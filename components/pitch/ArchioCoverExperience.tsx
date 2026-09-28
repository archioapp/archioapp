"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ARCHIO AI · COVER (Slide 0) — HOLOGRAPHIC RECONSTRUCTION
   ───────────────────────────────────────────────────────────────────────
   Bright, high-contrast holographic glass cover. Fully theme-aware: every
   surface, text tone and glow is derived from the active VantaryTheme via
   the shared holographic-kit palette.

   Visual thesis (shared with the Problem slide):
   • SIX fragmented systems  -> six vivid spectrum colors orbiting in chaos.
   • Archio's UNIFIED core    -> the single theme accent at the center.
   The hero literally shows six scattered nodes resolving into one core.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion"
import {
  Cpu, AlertTriangle, Globe, Layers, CircuitBoard, CandlestickChart,
  Brain, Users, Network, Wrench, ChevronRight, Diamond, ArrowDown,
} from "lucide-react"
import type { VantaryTheme } from "@/components/dashboard/vantary/theme-system"
import {
  useHoloPalette, withAlpha, glow, AuroraField, SectionEyebrow, HoloCard, HoloChip,
  type HoloPalette,
} from "./holographic-kit"

/* =====================================================================
   I. DECK ROADMAP DATA — narrative layer preserved, colors themed later
   ===================================================================== */

type RoadmapEntry = {
  id: number; tab: string; title: string; icon: React.ElementType
  line: string; why: string; detail: string; keyInsight: string
  previews: string[]; transitionNote: string
}

const DECK_ROADMAP: RoadmapEntry[] = [
  {
    id: 1, tab: "Problem", title: "The Broken Workflow", icon: AlertTriangle,
    line: "Follow a single trade across six disconnected tools. Watch context die at every handoff.",
    why: "Every investment thesis starts with pain. Before we size the market or present a solution, you need to feel the friction 300 million traders experience daily.",
    detail: "We trace one real EURUSD trade from the moment a trader reads an economic calendar through analysis, community signal, execution, account compliance, and journaling. At every step, context is destroyed. Each app is a dead end.",
    keyInsight: "45 minutes of daily productivity lost per trader",
    previews: ["6-category tab system with live tool data", "Trade journey window that updates per category", "News and events with expandable impact analysis", "Aggregate loss bar quantifying the annual cost"],
    transitionNote: "Once you feel the pain, the next question is: how large is the market that suffers from it?",
  },
  {
    id: 2, tab: "Market", title: "The Opportunity", icon: Globe,
    line: "The world's largest industry has no unified software layer for its 300M+ individual participants.",
    why: "The Problem slide proves the pain is real. This slide proves the pain is worth solving -- in dollar terms that investors can underwrite.",
    detail: "We present the $26.5 trillion financial services industry, derive a $14.2B total addressable market for trading tools, narrow to a $5.8B serviceable segment, and project $420M in Year 5 obtainable revenue. Every number shows its derivation.",
    keyInsight: "$14.2B TAM with zero unified competitors",
    previews: ["Macro context: finance as the world's largest industry", "Historical disruption precedents (Figma, GitLab, HubSpot)", "TAM/SAM/SOM with transparent methodology", "Regional breakdown and scenario analysis"],
    transitionNote: "Now that you know the market is massive and uncontested, the question becomes: what exactly does Archio build?",
  },
  {
    id: 3, tab: "Solution", title: "What Archio Changes", icon: Layers,
    line: "One platform replaces 8 disconnected apps with six integrated pillars and zero data silos.",
    why: "The Market slide proved the gap exists. This slide shows precisely what fills it -- pillar by pillar, feature by feature, with before-and-after comparisons.",
    detail: "Archio unifies six workflow categories (Intelligence, Execution, Community, Journaling, Account, News) into one AI-native platform. Each pillar is presented with the pain it solves, the tools it replaces, and the measurable improvement it delivers.",
    keyInsight: "6 pillars replacing 8+ apps with 23 automated handoffs",
    previews: ["Before and After cost comparison", "Six Pillars overview with module counts", "Deep-dive into each pillar's features and impact", "Replaced tools with market share data"],
    transitionNote: "You know the what. Next: how is the engineering actually built to deliver this?",
  },
  {
    id: 4, tab: "Architecture", title: "The Engine", icon: CircuitBoard,
    line: "Six technical layers, 48 AI modules, and 23 automated handoffs -- built, not mocked.",
    why: "Solutions are promises. Architecture is proof. This slide shows the engineering foundation that makes the six pillars possible and the moat that makes them defensible.",
    detail: "A vertical stack of six integrated layers: Interface, Orchestrator, AI Engine, Data Layer, Database Vault, and Deployment Foundation. Each layer expands to reveal internal components, data flows, and performance metrics.",
    keyInsight: "Vertically integrated system, not an API wrapper",
    previews: ["Expandable 6-layer architecture explorer", "Internal component node graphs per layer", "Inter-layer data flow animation", "Product bridge: how each layer maps to what you see next"],
    transitionNote: "You have seen the engine. The next four slides show the driving experience.",
  },
  {
    id: 5, tab: "Product 1", title: "Neural Matrix + Execution", icon: CandlestickChart,
    line: "Live charts with AI overlays and guided execution in one continuous surface.",
    why: "This is the product traders touch most. Neural Matrix merges the Analysis and Execution categories from the Problem slide into a single, unbroken flow.",
    detail: "Multi-timeframe charting with AI-generated support/resistance, pattern recognition overlays, and one-click execution that auto-fills parameters from your analysis. No more switching between TradingView and MetaTrader.",
    keyInsight: "Analysis-to-execution in one click, not five app switches",
    previews: ["Live chart interface with AI overlay annotations", "One-click execution flow demonstration", "Performance comparison vs. manual workflow"],
    transitionNote: "Neural Matrix handles charts and trades. The next product handles the intelligence that informs them.",
  },
  {
    id: 6, tab: "Product 2", title: "AI Forecast + Intelligence", icon: Brain,
    line: "Context-aware AI that sees your full workflow -- not just one chart in isolation.",
    why: "Standalone AI tools analyze price data in isolation. Archio's AI sees your journal, your community signals, your news context, and your risk limits -- then synthesizes all of it.",
    detail: "The Intelligence Engine processes 50,000+ sentiment signals and 10,000+ articles daily, generating personalized forecasts, pattern alerts, and a conversational copilot that understands your trading history.",
    keyInsight: "Full-context AI, not single-chart analysis",
    previews: ["AI copilot interface with contextual awareness", "Sentiment analysis and forecast visualizations", "Personalized pattern recognition examples"],
    transitionNote: "Intelligence feeds insight. The next product ensures the community around you is trustworthy.",
  },
  {
    id: 7, tab: "Product 3", title: "Community + Education", icon: Users,
    line: "Verified mentors with audited track records. Trust built with data, not follower counts.",
    why: "The Problem slide showed an $800M+ trust deficit in trading communities. This product solves it with cryptographic verification of every performance claim.",
    detail: "Every mentor's track record is audited against real trade data. Signals include verifiable entry/exit history. Community reputation is earned through proven results, not marketing.",
    keyInsight: "First trading community with verifiable performance data",
    previews: ["Verified mentor profile with audited statistics", "Signal verification system", "Trust scoring methodology"],
    transitionNote: "Trust is established. The final product ties everything together into one unified command center.",
  },
  {
    id: 8, tab: "Product 4", title: "Nexus + Copilot", icon: Network,
    line: "Multi-account dashboard, auto-journaling, and the unified view that ties everything together.",
    why: "This is the connective tissue -- the product that makes Archio a platform rather than a collection of features. It handles Account and Journaling from the Problem slide.",
    detail: "All broker accounts, prop firm challenges, and personal accounts in one dashboard. Every trade is auto-journaled with 18 data points. The AI copilot reviews your week and identifies patterns you missed.",
    keyInsight: "100% auto-capture journal with zero manual entry",
    previews: ["Multi-account unified dashboard", "Auto-journaling with AI review sessions", "Copilot weekly performance analysis"],
    transitionNote: "All four products demonstrated. The next slide shows what is already built and running.",
  },
  {
    id: 9, tab: "Built", title: "What Exists Today", icon: Diamond,
    line: "Production-ready systems, validated components, and live infrastructure.",
    why: "Product demos show what we intend. This slide shows what is already real -- deployed code, working features, and validated systems investors can verify.",
    detail: "A component-by-component status report: which modules are production-ready, which are in beta, and the live metrics from the existing deployment including codebase size and test coverage.",
    keyInsight: "Demonstrable progress, not just a pitch",
    previews: ["Feature status matrix with completion percentages", "Live deployment metrics", "Codebase and infrastructure evidence"],
    transitionNote: "Built shows the present. The final slide shows the road ahead.",
  },
  {
    id: 10, tab: "Partial", title: "What Is In Progress", icon: Wrench,
    line: "Development timelines, remaining milestones, and the path to full platform launch.",
    why: "Transparency builds trust. We show exactly what remains, how long it will take, and what resources are needed -- the honest roadmap an investor needs to see.",
    detail: "Remaining development milestones with realistic timelines, resource requirements, and the specific engineering challenges being solved. No hidden gaps.",
    keyInsight: "Clear roadmap with honest timelines",
    previews: ["Milestone timeline with dependencies", "Resource allocation plan", "Risk assessment and mitigation strategies"],
    transitionNote: "End of the deck. You now have the complete picture: pain, market, solution, proof, and plan.",
  },
]

/* Theme-aware color for each roadmap entry: accent + spectrum + status hues. */
function roadmapColor(pal: HoloPalette, index: number): string {
  const ramp = [
    pal.red, pal.tertiary, pal.green, pal.accent,
    pal.spectrum[1], pal.spectrum[2], pal.spectrum[3], pal.amber,
    pal.green, pal.amber,
  ]
  return ramp[index % ramp.length]
}

/* =====================================================================
   II. ORBITAL HERO — six fragmented nodes resolving into one core
   ===================================================================== */

const ORBIT_NODES = [
  { icon: CandlestickChart, label: "Charts" },
  { icon: Brain, label: "AI" },
  { icon: Users, label: "Community" },
  { icon: Network, label: "Accounts" },
  { icon: Globe, label: "News" },
  { icon: Layers, label: "Journal" },
]

function OrbitalHero({ pal }: { pal: HoloPalette }) {
  const reduce = useReducedMotion()
  const R = 116 // orbit radius

  return (
    <div className="relative mx-auto mb-9" style={{ width: 300, height: 300 }}>
      {/* orbit rings */}
      {[150, 116, 78].map((rad, i) => (
        <motion.div
          key={rad}
          className="absolute rounded-full"
          style={{
            width: rad * 2, height: rad * 2,
            left: `calc(50% - ${rad}px)`, top: `calc(50% - ${rad}px)`,
            border: `1px solid ${withAlpha(pal.accent, 0.16 - i * 0.03)}`,
          }}
          animate={reduce ? undefined : { rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      ))}

      {/* connective lines from each node to the core */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300" aria-hidden>
        {ORBIT_NODES.map((_, i) => {
          const ang = (i / ORBIT_NODES.length) * Math.PI * 2 - Math.PI / 2
          const x = 150 + Math.cos(ang) * R
          const y = 150 + Math.sin(ang) * R
          const c = pal.spectrum[i % pal.spectrum.length]
          return (
            <motion.line
              key={i}
              x1={150} y1={150} x2={x} y2={y}
              stroke={c} strokeWidth={1.2} strokeDasharray="3 5"
              initial={{ opacity: 0 }}
              animate={{ opacity: reduce ? 0.5 : [0.2, 0.7, 0.2] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
            />
          )
        })}
      </svg>

      {/* six fragmented spectrum nodes */}
      {ORBIT_NODES.map((node, i) => {
        const ang = (i / ORBIT_NODES.length) * Math.PI * 2 - Math.PI / 2
        const x = 150 + Math.cos(ang) * R
        const y = 150 + Math.sin(ang) * R
        const c = pal.spectrum[i % pal.spectrum.length]
        const Icon = node.icon
        return (
          <motion.div
            key={node.label}
            className="absolute flex flex-col items-center"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 120 }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 40, height: 40,
                background: withAlpha(c, 0.16),
                border: `1px solid ${withAlpha(c, 0.55)}`,
                boxShadow: glow(c, 0.5),
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon className="w-4 h-4" style={{ color: c }} />
            </motion.div>
          </motion.div>
        )
      })}

      {/* unified accent core */}
      <motion.div
        className="absolute flex items-center justify-center rounded-2xl"
        style={{
          width: 76, height: 76,
          left: "calc(50% - 38px)", top: "calc(50% - 38px)",
          background: `linear-gradient(135deg, ${withAlpha(pal.accent, 0.28)}, ${withAlpha(pal.accentDeep, 0.18)})`,
          border: `1px solid ${withAlpha(pal.accent, 0.6)}`,
          boxShadow: glow(pal.accent, 1.3),
          backdropFilter: "blur(14px)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Cpu className="w-8 h-8" style={{ color: pal.accent }} />
        </motion.div>
      </motion.div>
    </div>
  )
}

/* =====================================================================
   III. HERO IDENTITY
   ===================================================================== */

function HeroIdentity({ pal }: { pal: HoloPalette }) {
  const stats = [
    { value: "6-in-1", label: "Platform", color: pal.accent },
    { value: "$14.2B", label: "Market", color: pal.tertiary },
    { value: "300M+", label: "Traders", color: pal.spectrum[1] },
    { value: "0", label: "Unified Rivals", color: pal.amber },
  ]
  return (
    <div className="flex flex-col items-center pt-12 pb-8 px-6 md:px-10 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <OrbitalHero pal={pal} />
      </motion.div>

      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-center mb-7">
        <div className="text-[10px] uppercase font-bold mb-3" style={{ color: pal.accent, letterSpacing: "0.3em" }}>
          Investor Presentation
        </div>
        <h1
          className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          style={{
            letterSpacing: "-0.04em",
            background: `linear-gradient(120deg, ${pal.text} 0%, ${pal.text} 40%, ${pal.accent} 100%)`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            textShadow: `0 0 60px ${withAlpha(pal.accent, 0.25)}`,
          }}
        >
          Archio AI
        </h1>
        <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-3" style={{ color: pal.textDim }}>
          One platform replacing six disconnected trading apps with an integrated, AI-native operating system.
        </p>
        <p className="text-[11px] max-w-lg mx-auto leading-relaxed" style={{ color: pal.textSoft }}>
          Active traders use separate tools for charting, execution, community, journaling, news, and risk management.
          Nothing connects them. Archio unifies the entire workflow for the first time.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-2xl"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.06 }}
            className="relative overflow-hidden px-4 py-3.5 text-center"
            style={{
              borderRadius: 14,
              background: pal.glass,
              border: `1px solid ${pal.glassEdge}`,
              backdropFilter: "blur(16px)",
              boxShadow: `inset 0 1px 0 ${pal.glassEdgeHi}`,
            }}
          >
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: pal.edgeTop }} aria-hidden />
            <div className="text-xl font-black mb-0.5 tabular-nums" style={{ color: stat.color, fontFamily: "var(--font-mono)", textShadow: `0 0 20px ${withAlpha(stat.color, 0.35)}` }}>
              {stat.value}
            </div>
            <div className="text-[8px] uppercase font-bold" style={{ color: pal.textSoft, letterSpacing: "0.2em" }}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex flex-col items-center mt-8 gap-1">
        <span className="text-[8px] uppercase font-bold" style={{ color: pal.textGhost, letterSpacing: "0.2em" }}>Scroll to explore the deck</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <ArrowDown className="w-3 h-3" style={{ color: pal.textGhost }} />
        </motion.div>
      </motion.div>
    </div>
  )
}

/* =====================================================================
   IV. ROADMAP CARD — holographic glass card with hover-expand
   ===================================================================== */

function RoadmapCard({ slide, index, color, isActive, onHover, pal }: {
  slide: RoadmapEntry; index: number; color: string
  isActive: boolean; onHover: (id: number | null) => void; pal: HoloPalette
}) {
  const Icon = slide.icon
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-30px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.4 }}
      onMouseEnter={() => onHover(slide.id)}
      onMouseLeave={() => onHover(null)}
    >
      <HoloCard pal={pal} active={isActive} glowColor={color} style={{ borderRadius: 14 }}>
        {/* accent line on left edge */}
        <motion.span
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          animate={{ opacity: isActive ? 1 : 0.25, scaleY: isActive ? 1 : 0.4 }}
          transition={{ duration: 0.25 }}
          style={{ background: color, transformOrigin: "top", boxShadow: isActive ? glow(color, 0.5) : "none" }}
          aria-hidden
        />

        {/* always-visible row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black"
              style={{
                background: withAlpha(color, isActive ? 0.18 : 0.1),
                color, border: `1px solid ${withAlpha(color, isActive ? 0.4 : 0.18)}`,
              }}
            >
              {index + 1}
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: withAlpha(color, isActive ? 0.14 : 0.07), border: `1px solid ${withAlpha(color, isActive ? 0.3 : 0.12)}` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <HoloChip pal={pal} color={color}>{slide.tab}</HoloChip>
              <span className="text-[12px] font-bold" style={{ color: isActive ? pal.text : pal.textDim }}>{slide.title}</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: pal.textSoft }}>{slide.line}</p>
          </div>

          <motion.div animate={{ x: isActive ? 0 : -4, opacity: isActive ? 1 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5" style={{ color }} />
          </motion.div>
        </div>

        {/* hover-reveal panel */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1">
                <div className="h-px mb-3" style={{ background: withAlpha(color, 0.18) }} />

                <div className="mb-3">
                  <div className="text-[7px] uppercase font-black mb-1.5" style={{ color: withAlpha(color, 0.6), letterSpacing: "0.15em" }}>
                    Why this section comes {index === 0 ? "first" : `at position ${index + 1}`}
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: pal.textDim }}>{slide.why}</p>
                </div>

                <div className="mb-3">
                  <div className="text-[7px] uppercase font-black mb-1.5" style={{ color: withAlpha(color, 0.6), letterSpacing: "0.15em" }}>What you will see</div>
                  <p className="text-[10px] leading-relaxed mb-2" style={{ color: pal.textSoft }}>{slide.detail}</p>
                  <div className="flex flex-col gap-1">
                    {slide.previews.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full mt-[5px] flex-shrink-0" style={{ background: withAlpha(color, 0.6) }} />
                        <span className="text-[9px] leading-relaxed" style={{ color: pal.textSoft }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-stretch gap-2">
                  <div className="flex-1 rounded-lg px-3 py-2" style={{ background: withAlpha(color, 0.08), border: `1px solid ${withAlpha(color, 0.16)}` }}>
                    <div className="text-[7px] uppercase font-black mb-0.5" style={{ color: withAlpha(color, 0.55), letterSpacing: "0.12em" }}>Key insight</div>
                    <div className="text-[10px] font-semibold" style={{ color }}>{slide.keyInsight}</div>
                  </div>
                  <div className="flex-1 rounded-lg px-3 py-2" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}` }}>
                    <div className="text-[7px] uppercase font-black mb-0.5" style={{ color: pal.textGhost, letterSpacing: "0.12em" }}>Then</div>
                    <div className="text-[9px] leading-relaxed" style={{ color: pal.textSoft }}>{slide.transitionNote}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HoloCard>
    </motion.div>
  )
}

/* =====================================================================
   V. PRESENTATION ROADMAP
   ===================================================================== */

function PresentationRoadmap({ pal }: { pal: HoloPalette }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [activeId, setActiveId] = useState<number | null>(null)

  const phases = [
    { label: "Foundation", range: "Slides 1-4", color: pal.accent, ids: [1, 2, 3, 4], description: "Establish the pain, size the opportunity, present the answer, prove the engineering." },
    { label: "Product Proof", range: "Slides 5-8", color: pal.tertiary, ids: [5, 6, 7, 8], description: "Demonstrate each product module running on the architecture." },
    { label: "Evidence", range: "Slides 9-10", color: pal.amber, ids: [9, 10], description: "Show what is already built and what remains." },
  ]

  return (
    <div ref={ref} className="px-6 md:px-10 pb-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }} className="py-4">
        <SectionEyebrow pal={pal} label="Deck Structure" color={pal.tertiary} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.5 }} className="mb-5">
        <h2 className="text-lg md:text-xl font-bold mb-1.5 tracking-tight text-balance" style={{ color: pal.text }}>
          What this deck covers, in what order, and why.
        </h2>
        <p className="text-[11px] leading-relaxed max-w-xl" style={{ color: pal.textSoft }}>
          Hover over any section to see what it contains, why it appears at that position in the narrative, and what
          connects it to the next step. The deck is structured as three phases: foundation, product proof, and evidence.
        </p>
      </motion.div>

      {/* phase indicators */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.4 }} className="grid grid-cols-3 gap-2 mb-4">
        {phases.map((phase) => {
          const on = activeId !== null && phase.ids.includes(activeId)
          return (
            <div
              key={phase.label}
              className="rounded-lg px-3 py-2 transition-all duration-300"
              style={{ background: on ? withAlpha(phase.color, 0.1) : pal.glass, border: `1px solid ${on ? withAlpha(phase.color, 0.3) : pal.glassEdge}` }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: phase.color, boxShadow: on ? glow(phase.color, 0.5) : "none" }} />
                <span className="text-[8px] uppercase font-black" style={{ color: phase.color, letterSpacing: "0.12em" }}>{phase.label}</span>
                <span className="text-[7px] font-mono ml-auto" style={{ color: pal.textGhost }}>{phase.range}</span>
              </div>
              <p className="text-[8px] leading-relaxed" style={{ color: pal.textSoft }}>{phase.description}</p>
            </div>
          )
        })}
      </motion.div>

      {/* roadmap cards */}
      <div className="flex flex-col gap-1.5">
        {DECK_ROADMAP.map((slide, i) => (
          <RoadmapCard
            key={slide.id} slide={slide} index={i} color={roadmapColor(pal, i)}
            isActive={activeId === slide.id} onHover={setActiveId} pal={pal}
          />
        ))}
      </div>

      {/* narrative thread connector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-4 rounded-lg px-4 py-3" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}` }}
      >
        <div className="flex items-center gap-4 md:gap-6 justify-center">
          {[
            { step: "Pain", c: pal.red }, { step: "Scale", c: pal.tertiary }, { step: "Answer", c: pal.accent },
            { step: "Proof", c: pal.green }, { step: "Evidence", c: pal.amber },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full" style={{ background: s.c, boxShadow: glow(s.c, 0.4) }} />
                <span className="text-[7px] font-bold mt-1" style={{ color: pal.textSoft }}>{s.step}</span>
              </div>
              {i < arr.length - 1 && <div className="w-6 md:w-8 h-px" style={{ background: pal.glassEdgeHi }} />}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* =====================================================================
   VI. CLOSING
   ===================================================================== */

function ClosingSection({ pal }: { pal: HoloPalette }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <div ref={ref} className="px-6 md:px-10 pb-14">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <HoloCard pal={pal} glowColor={pal.accent} className="p-5 text-center" style={{ background: withAlpha(pal.accent, 0.06) }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Diamond className="w-4 h-4" style={{ color: pal.accent }} />
            <span className="text-[9px] uppercase font-bold" style={{ color: pal.accent, letterSpacing: "0.2em" }}>Begin</span>
          </div>
          <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: pal.text }}>
            The analysis starts with the problem traders face every day.
          </h3>
          <p className="text-[11px] leading-relaxed max-w-md mx-auto" style={{ color: pal.textSoft }}>
            Navigate to the next slide to follow a single trade through six disconnected systems.
          </p>
        </HoloCard>
      </motion.div>
    </div>
  )
}

/* =====================================================================
   VII. MAIN EXPORT
   ===================================================================== */

export function ArchioCoverExperience({ accent, theme }: { accent: string; theme: VantaryTheme }) {
  const pal = useHoloPalette(theme, accent)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl overflow-y-auto overflow-x-hidden"
      style={{
        background: `linear-gradient(160deg, ${pal.bg} 0%, ${pal.bgDeep} 55%, ${pal.bg2} 100%)`,
        border: `1px solid ${pal.glassEdge}`,
        height: 600, scrollBehavior: "smooth",
      }}
    >
      <AuroraField pal={pal} />
      <div className="relative z-10">
        <HeroIdentity pal={pal} />
        <PresentationRoadmap pal={pal} />
        <ClosingSection pal={pal} />
      </div>
    </div>
  )
}
