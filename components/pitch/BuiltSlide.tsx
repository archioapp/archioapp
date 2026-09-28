"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, Shield, Activity, Target, Globe, Users,
  GraduationCap, Eye, Network, Cpu, Navigation, Database,
  ChevronDown, Layers
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════
   BUILT SLIDE — Proof Board (Elevated Visual Design)
   ═══════════════════════════════════════════════════════════ */

interface BuiltSystem {
  name: string
  icon: React.ElementType
  layer: "Foundation" | "Execution" | "Intelligence" | "Community"
  status: "Live" | "Functional" | "Screenshot-ready"
  what: string
  why: string
  evidence: string[]
}

const BUILT_SYSTEMS: BuiltSystem[] = [
  {
    name: "Authentication System",
    icon: Shield,
    layer: "Foundation",
    status: "Live",
    what: "Login, registration, password reset, email verification. Row-level security on every database table ensures complete data isolation between users.",
    why: "Without authentication, nothing else works. This is the security foundation that lets every other system trust who is using it.",
    evidence: ["Supabase Auth integrated", "RLS on all 9 tables", "Session management", "Protected routes"],
  },
  {
    name: "Neural Matrix Dashboard",
    icon: Activity,
    layer: "Execution",
    status: "Live",
    what: "The daily command center. Live TradingView chart widget with 50+ instruments, real-time market state display (session, spread, volatility), and an AI Copilot sidebar with 5 intelligent tabs.",
    why: "This is where traders spend 80% of their time. The chart, the data, and the AI assistant live side by side -- no tab-switching.",
    evidence: ["TradingView widget", "50+ instruments", "Market state bar", "Copilot 5-tab rail", "Instrument selector"],
  },
  {
    name: "Execution Copilot",
    icon: Target,
    layer: "Execution",
    status: "Live",
    what: "Split-screen workspace: chart on the left, execution panel on the right. Signal terminal header with live price data. Auto-journal captures every trade. Social feed below for community context.",
    why: "This closes the gap between 'I see a setup' and 'I executed and logged it.' One workspace, zero switching.",
    evidence: ["Signal header", "Chart panel", "Execute toggle", "Auto-journal", "Social feed"],
  },
  {
    name: "MRKT Intelligence",
    icon: Globe,
    layer: "Intelligence",
    status: "Live",
    what: "Six-panel macro intelligence dashboard: Market Sentiment, Fundamental Drivers, Live Headlines, Political Risk, Central Bank Events, and Economic Calendar. All panels fully designed and rendering.",
    why: "Replaces the 15-25 minutes traders spend every morning scanning five different news sources. Everything in one view.",
    evidence: ["6 intelligence panels", "Card layout system", "Impact categorization", "Urgency ranking"],
  },
  {
    name: "Community Discovery",
    icon: Users,
    layer: "Community",
    status: "Live",
    what: "Orbit-based marketplace for trading communities. 15+ filters (win rate, R:R, signals/week, pairs traded). Community cards with full inspector modal and video carousel.",
    why: "The trust layer. No more guessing which mentor or community is legitimate. Every metric is visible.",
    evidence: ["Orbit engine", "15+ filters", "Community cards", "Inspector modal", "Mentor profiles"],
  },
  {
    name: "Student Hub",
    icon: GraduationCap,
    layer: "Community",
    status: "Live",
    what: "Students submit chart forecasts, receive AI-scored accuracy ratings, and compete on a gamified leaderboard with badges and points. Filters by asset class, direction, and timeframe.",
    why: "Turns passive learning into measurable skill development. Students prove they are improving.",
    evidence: ["Forecast submission", "AI scoring", "Gamified leaderboard", "Badge system", "Asset filters"],
  },
  {
    name: "Mentor Forecast Engine",
    icon: Eye,
    layer: "Community",
    status: "Live",
    what: "Professional forecast creation: chart upload, canvas annotations, key level markers, macro driver tags, and a narrative editor. Every forecast is tracked and every outcome recorded.",
    why: "Mentors build verified track records. No more 'trust me' -- every call is on the record.",
    evidence: ["Chart upload", "Canvas annotations", "Key levels", "Narrative editor", "Outcome tracking"],
  },
  {
    name: "Nexus Knowledge Graph",
    icon: Network,
    layer: "Intelligence",
    status: "Live",
    what: "Interactive visual knowledge graph. Nodes represent markets, concepts, and strategies. Three layout modes: circular, force-directed, hierarchical. AI synthesizes connections between nodes.",
    why: "Makes the invisible connections between markets visible. A trader can see how USD strength relates to gold, oil, and emerging markets in one view.",
    evidence: ["3 layout modes", "Node detail panel", "AI synthesis", "Connection visualization"],
  },
  {
    name: "Copilot AI System",
    icon: Cpu,
    layer: "Intelligence",
    status: "Live",
    what: "Five-tab right rail: Activity, Strategy, Psychology (5 emotional profiles with mood tracking), AI Console, and Edge Analytics. Each tab has its own console, analytics, and guides.",
    why: "The AI that sees everything. Unlike standalone AI tools, the Copilot has context from the trader's full workflow -- their charts, their trades, their psychology patterns.",
    evidence: ["5 copilot tabs", "Psychology profiles", "Strategy console", "Edge analytics", "Mood tracking"],
  },
  {
    name: "Navigation and Glass UI",
    icon: Navigation,
    layer: "Foundation",
    status: "Live",
    what: "Floating navigation system, collapsible sidebar, glass-morphism component library, and an instrument bridge that syncs the selected instrument across every view on the platform.",
    why: "The connective tissue. When a trader switches from EURUSD to GBPJPY, every panel, every chart, and every AI context updates simultaneously.",
    evidence: ["Floating nav", "Sidebar system", "Glass UI library", "Instrument bridge"],
  },
  {
    name: "Database Layer",
    icon: Database,
    layer: "Foundation",
    status: "Live",
    what: "9 PostgreSQL tables with full row-level security policies. Users, profiles, communities, subscriptions, plans, payments, community members, user settings, and analytics.",
    why: "Not a prototype database. Production-grade schema with security policies that ensure no user can ever access another user's data.",
    evidence: ["9 RLS tables", "Supabase hosted", "Auth integration", "CRUD operations"],
  },
  {
    name: "API Layer",
    icon: Layers,
    layer: "Foundation",
    status: "Live",
    what: "34+ API routes covering authentication, CRUD operations, subscriptions, market data endpoints, and AI chat. Server-side validation and error handling on every route.",
    why: "The wiring between frontend and backend exists. These are not placeholder endpoints -- they handle real requests with real validation.",
    evidence: ["34+ routes", "Server validation", "Error handling", "Auth middleware"],
  },
]

const LAYER_META: Record<string, { color: string; glow: string }> = {
  Foundation: { color: "#94a3b8", glow: "rgba(148,163,184,0.15)" },
  Execution: { color: "#34d399", glow: "rgba(52,211,153,0.15)" },
  Intelligence: { color: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
  Community: { color: "#fbbf24", glow: "rgba(251,191,36,0.15)" },
}

const STATUS_COLORS: Record<string, string> = {
  Live: "#34d399",
  Functional: "#22d3ee",
  "Screenshot-ready": "#a78bfa",
}

export function BuiltSlide({ accent }: { accent: string }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterLayer, setFilterLayer] = useState<string | null>(null)

  const layers = Object.keys(LAYER_META)
  const filtered = filterLayer ? BUILT_SYSTEMS.filter(s => s.layer === filterLayer) : BUILT_SYSTEMS

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1220 0%, #080e1a 50%, #0a0f18 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-15%", right: "-10%", background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)" }} animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-10%", left: "-5%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)" }} animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[300px] h-[300px] rounded-full" style={{ top: "40%", left: "30%", background: "radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} animate={{ boxShadow: ["0 0 4px rgba(52,211,153,0.3)", "0 0 12px rgba(52,211,153,0.6)", "0 0 4px rgba(52,211,153,0.3)"] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(52,211,153,0.7)" }}>What Exists Today</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.3), transparent)" }} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5 text-balance">This is working software. Not a prototype.</h2>
        <p className="text-sm text-zinc-300 mb-5 max-w-2xl" style={{ lineHeight: 1.6 }}>Every system below is functional in the browser and can be demonstrated live. Click any row for detail.</p>

        {/* Layer filters */}
        <div className="flex items-center gap-1.5 mb-4">
          <button
            onClick={() => setFilterLayer(null)}
            className="text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              background: !filterLayer ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
              color: !filterLayer ? "#fff" : "rgba(255,255,255,0.35)",
              border: !filterLayer ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.04)",
            }}
          >
            All ({BUILT_SYSTEMS.length})
          </button>
          {layers.map(l => {
            const count = BUILT_SYSTEMS.filter(s => s.layer === l).length
            const meta = LAYER_META[l]
            const active = filterLayer === l
            return (
              <button
                key={l}
                onClick={() => setFilterLayer(active ? null : l)}
                className="text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: active ? `${meta.color}20` : "rgba(255,255,255,0.02)",
                  color: active ? meta.color : "rgba(255,255,255,0.3)",
                  border: active ? `1px solid ${meta.color}40` : "1px solid rgba(255,255,255,0.04)",
                  boxShadow: active ? `0 0 15px ${meta.color}10` : "none",
                }}
              >
                {l} ({count})
              </button>
            )
          })}
        </div>

        {/* Proof board */}
        <div className="flex flex-col gap-1.5 mb-5 overflow-y-auto pr-1" style={{ maxHeight: 380 }}>
          {filtered.map((sys, i) => {
            const isExp = expanded === sys.name
            const lc = LAYER_META[sys.layer].color
            const sc = STATUS_COLORS[sys.status]
            const SysIcon = sys.icon
            return (
              <motion.div
                key={sys.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  className="w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left cursor-pointer transition-all duration-300"
                  style={{
                    background: isExp ? `linear-gradient(135deg, ${lc}12, ${lc}06)` : "rgba(255,255,255,0.025)",
                    border: isExp ? `1px solid ${lc}35` : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isExp ? `0 4px 20px ${lc}08, inset 0 1px 0 ${lc}10` : "none",
                  }}
                  onClick={() => setExpanded(isExp ? null : sys.name)}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${lc}15, ${lc}08)`, border: `1px solid ${lc}25`, boxShadow: `0 2px 8px ${lc}10` }}>
                    <SysIcon className="w-4 h-4" style={{ color: lc }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-zinc-100">{sys.name}</div>
                    {!isExp && <div className="text-[10px] text-zinc-400 truncate mt-0.5">{sys.what.slice(0, 90)}...</div>}
                  </div>
                  <span className="text-[8px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex-shrink-0" style={{ background: `${lc}15`, color: lc, border: `1px solid ${lc}25` }}>{sys.layer}</span>
                  <span className="text-[8px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-1" style={{ background: `${sc}12`, color: sc, border: `1px solid ${sc}20` }}>
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {sys.status}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300" style={{ color: `${lc}60`, transform: isExp ? "rotate(180deg)" : "" }} />
                </button>
                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 ml-12">
                        <div className="grid grid-cols-2 gap-5 mb-3">
                          <div>
                            <div className="text-[9px] uppercase tracking-[0.15em] font-black mb-1.5" style={{ color: `${lc}80` }}>What it does</div>
                            <div className="text-[11px] text-zinc-300 leading-relaxed">{sys.what}</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-[0.15em] font-black mb-1.5" style={{ color: `${lc}80` }}>Why it matters</div>
                            <div className="text-[11px] text-zinc-300 leading-relaxed">{sys.why}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sys.evidence.map(e => (
                            <span key={e} className="text-[9px] px-2.5 py-1 rounded-md font-semibold" style={{ background: `${lc}10`, color: lc, border: `1px solid ${lc}20` }}>
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Aggregate stats */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {[
            { label: "Live Systems", value: "12", color: "#34d399" },
            { label: "UI Components", value: "340+", color: "#a78bfa" },
            { label: "API Routes", value: "34+", color: "#60a5fa" },
            { label: "DB Tables (RLS)", value: "9", color: "#fbbf24" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: `linear-gradient(135deg, ${s.color}08, ${s.color}03)`, border: `1px solid ${s.color}20`, boxShadow: `0 2px 12px ${s.color}06` }}>
              <div className="text-xl font-black font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Investor takeaway */}
        <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}03)`, border: `1px solid ${accent}20`, boxShadow: `0 2px 20px ${accent}06` }}>
          <p className="text-[12px] font-semibold leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            The hard part of building a platform is the interface layer -- the hundreds of components, interactions, and visual systems that make a product feel real. <span style={{ color: accent }}>That work is done.</span> What remains is structured backend engineering with clear, finite scope.
          </p>
        </div>
      </div>
    </div>
  )
}
