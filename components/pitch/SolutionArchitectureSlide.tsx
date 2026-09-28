"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ChevronRight, Brain, Users, Zap, Shield, Layers, Target,
  ArrowRight, Check, X, Activity, Cpu, Globe, BarChart3, BookOpen,
  Newspaper, MessageSquare, Wallet, TrendingUp, Diamond, Network,
  CandlestickChart, Eye, Lock, Smartphone, Sparkles, GitMerge,
  ArrowUpRight, Clock, AlertTriangle, CheckCircle, CircleDot,
  Lightbulb, Boxes, FileCheck, Workflow, Database, Gauge, Rocket
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════
   SOLUTION ARCHITECTURE SLIDE — 15 SLIDES
   Continues the narrative from Market ("no operating system")
   to Solution ("here is the operating system")
   ═══════════════════════════════════════════════════════════════════ */

const SLIDES = [
  { id: "overview", title: "Archio AI: The Trading Operating System", subtitle: "One platform. Six pillars. 48 AI components. Zero app-switching." },
  { id: "before-after", title: "Before and After", subtitle: "8 disconnected apps versus one unified platform. Side-by-side." },
  { id: "six-pillars", title: "Six Core Pillars", subtitle: "Every broken workflow category rebuilt as a connected, AI-native module." },
  { id: "pillar-intel", title: "Pillar 1: Intelligence Engine", subtitle: "AI-driven market analysis, forecasting, and a contextual copilot that sees your full workflow." },
  { id: "pillar-exec", title: "Pillar 2: Execution Layer", subtitle: "The fastest path from trade idea to executed, journaled position." },
  { id: "pillar-comm", title: "Pillar 3: Community and Trust", subtitle: "Verified mentors. Audited track records. Trust earned with data." },
  { id: "pillar-journal", title: "Pillar 4: Journaling and Review", subtitle: "100% auto-capture. 18 data points per trade. AI-powered review sessions." },
  { id: "pillar-account", title: "Pillar 5: Account and Risk", subtitle: "Every broker, every prop firm challenge -- one unified dashboard." },
  { id: "pillar-news", title: "Pillar 6: News and Intelligence", subtitle: "Contextual macro intelligence woven into the workflow." },
]

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 0: WHY NOW — Three converging forces
   ═══════════════════════════════════════════════════════════════════ */

function SlideWhyNow({ accent }: { accent: string }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const forces = [
    {
      icon: Cpu, title: "AI Maturity Has Crossed the Threshold", color: "#8b5cf6",
      stat: "2023-2026", statLabel: "Inflection window",
      summary: "For 20 years, the trading tool market fragmented because no technology could connect disparate data sources into a coherent workflow. Large language models and multi-modal AI changed that in 2023. For the first time, software can understand chart annotations, interpret news context, read community signals, assess trader psychology, and synthesize all of it into actionable intelligence -- in real-time.",
      evidence: [
        { fact: "GPT-4-class models reduced NLP costs by 97% since 2020", source: "Stanford HAI AI Index 2024", impact: "Processing 10,000+ daily news articles is now economically viable for a SaaS product at $19-99/mo pricing." },
        { fact: "Multi-modal AI can now process charts, text, and structured data simultaneously", source: "Google DeepMind, OpenAI research 2024", impact: "The Archio Copilot can see your chart annotation, read the related news article, and check community consensus -- in one inference call." },
        { fact: "RAG architectures enable personalized AI at scale without fine-tuning", source: "Meta AI, Anthropic research 2023-2024", impact: "Each trader gets a personalized AI that learns from their journal, their patterns, and their history -- without requiring individual model training." },
      ],
      precedent: "Figma could not exist before WebGL made browser-based vector editing possible (2012). Notion could not exist before block-based editors matured (2016). Archio could not exist before multi-modal AI made cross-domain workflow synthesis possible (2023).",
    },
    {
      icon: Users, title: "The Market Has Tripled in 3 Years", color: "#10b981",
      stat: "300M+", statLabel: "Active traders (3x since 2019)",
      summary: "The retail trading population tripled from ~95M in 2019 to 300M+ by 2024, driven by zero-commission brokers (Robinhood effect), mobile-first onboarding in emerging markets, social media virality (WallStreetBets, TikTok trading), and the prop firm revolution that democratized access to capital. This is not a niche market anymore -- it is a mass-market opportunity with the spending power and tool adoption rates to support a category-defining platform.",
      evidence: [
        { fact: "Robinhood alone onboarded 23M users between 2020-2023", source: "Robinhood S-1, quarterly reports", impact: "Zero-commission models eliminated the cost barrier to entry, creating millions of tool-seeking active traders." },
        { fact: "India added 80M+ demat accounts since 2020, reaching 130M+ total", source: "CDSL/NSDL data 2024", impact: "Emerging markets represent 60%+ of new trader growth. Mobile-first, tech-savvy, and underserved by legacy desktop tools." },
        { fact: "Prop firm industry generated $2.5B+ in evaluation fees with 1,200+ firms", source: "Industry reports 2024", impact: "3M+ funded/evaluating traders represent the highest-value segment: they spend $240/yr on tools and need unified workflow more urgently than anyone." },
      ],
      precedent: "GitHub launched when 7M developers existed (2008). Today there are 100M+. Archio launches with 300M+ traders. The market is already massive and growing at 12% YoY compound -- this is not a bet on future growth, it is a capture of existing demand.",
    },
    {
      icon: AlertTriangle, title: "The Trust Crisis Has Reached Breaking Point", color: "#ef4444",
      stat: "$800M+", statLabel: "Annual trust deficit",
      summary: "Trading communities have devolved into a crisis of credibility. 70-80% of traders do not trust trading influencers. Fake screenshots, cherry-picked results, and zero accountability are the norm across Discord, Telegram, and social media. Multiple regulatory bodies (FCA, ESMA, ASIC) are actively investigating mandatory performance disclosure requirements. The market is screaming for a platform that makes trust the default -- not the exception.",
      evidence: [
        { fact: "FTC received 46,000+ complaints about investment-related fraud in 2023", source: "FTC Consumer Sentinel Network 2024", impact: "Regulatory pressure is mounting. Platforms that build compliance-first will survive the coming regulatory wave. Those that don't will face existential risk." },
        { fact: "MyForexFunds ($300M+ revenue) was shut down by regulators in 2023", source: "CFTC enforcement action", impact: "Even major prop firms are not immune. The industry needs transparent infrastructure. Archio provides the audit trail layer that regulators are demanding." },
        { fact: "Average new trader tries 3-4 mentors before finding one they trust", source: "User survey data N=2,400, Q4 2024", impact: "The discovery problem costs traders $500-2,000+ in wasted subscriptions and losing trades following unverified signals. Archio's verified mentor system solves this on Day 1." },
      ],
      precedent: "Airbnb solved the trust problem in home-sharing with verified reviews and insurance. Archio solves the trust problem in trading with verified trade records, audited track records, and ML-powered fraud detection. Trust infrastructure creates the deepest moats.",
    },
  ]

  return (
    <div className="flex flex-col gap-4">


      {forces.map((f, fi) => {
        const isExp = expanded === fi
        return (
          <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + fi * 0.08 }}>
            <button onClick={() => setExpanded(isExp ? null : fi)} className="w-full text-left rounded-xl p-4 transition-all duration-400 outline-none" style={{ background: isExp ? `${f.color}04` : "rgba(255,255,255,0.03)", border: `1px solid ${isExp ? `${f.color}12` : "rgba(255,255,255,0.06)"}` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}08`, border: `1px solid ${f.color}15` }}>
                  <f.icon className="w-5 h-5" style={{ color: `${f.color}70` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[12px] font-bold text-white">{f.title}</span>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded" style={{ background: `${f.color}08`, color: `${f.color}70` }}>{f.stat}</span>
                    <span className="text-[7px] font-mono" style={{ color: `${f.color}35` }}>{f.statLabel}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{f.summary}</p>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isExp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                  <div className="px-4 pb-4 pt-2 ml-[52px]">
                    <div className="text-[7px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: `${f.color}30` }}>Evidence & Sources</div>
                    <div className="flex flex-col gap-2 mb-3">
                      {f.evidence.map((e, ei) => (
                        <div key={ei} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `${f.color}50` }} />
                            <div>
                              <div className="text-[9px] font-semibold text-zinc-300 mb-0.5">{e.fact}</div>
                              <div className="text-[7px] font-mono mb-1" style={{ color: `${f.color}30` }}>{e.source}</div>
                              <div className="text-[8px] text-zinc-600 leading-relaxed">{e.impact}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg p-3" style={{ background: `${f.color}03`, border: `1px solid ${f.color}06` }}>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `${f.color}40` }} />
                        <div>
                          <div className="text-[7px] uppercase tracking-wider font-bold mb-0.5" style={{ color: `${f.color}30` }}>Historical Precedent</div>
                          <p className="text-[9px] leading-relaxed" style={{ color: `${f.color}60` }}>{f.precedent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 1: EXECUTIVE OVERVIEW
   ═══════════════════════════════════════════════════════════════════ */

function SlideOverview({ accent }: { accent: string }) {
  const [showComparison, setShowComparison] = useState(false)
  const coreStats = [
    { value: "1", label: "Platform", sub: "Replaces 8+ disconnected apps with one intelligent operating system", color: accent },
    { value: "6", label: "Pillars", sub: "Every workflow category rebuilt as a connected, AI-native module", color: "#06b6d4" },
    { value: "48", label: "AI Components", sub: "Copilot modules across every surface -- not bolted on, woven in", color: "#8b5cf6" },
    { value: "23", label: "Auto Handoffs", sub: "Data flows automatically between pillars -- zero manual re-entry", color: "#f97316" },
  ]

  const thesis = [
    { icon: Layers, title: "Consolidation, Not Addition", color: "#10b981",
      desc: "Archio does not add another tool to the stack. It replaces the stack entirely. This is the Figma model applied to trading: one platform that makes the entire previous generation of fragmented tools obsolete.",
      evidence: "Figma replaced Sketch + InVision + Zeplin + Abstract with one connected design tool and reached $20B valuation. Archio replaces TradingView + MetaTrader + Discord + TradeZella + ForexFactory + Broker Portals with one connected trading tool targeting the same consolidation premium." },
    { icon: Brain, title: "AI as Connective Tissue", color: "#8b5cf6",
      desc: "The 48 AI components are not features. They are the connective tissue between modules. The Copilot sees your chart, journal, community signals, risk state, and emotional patterns simultaneously -- enabling intelligence no standalone AI tool can replicate.",
      evidence: "Standalone AI tools (ChatGPT, Claude) can answer trading questions but cannot see your live chart, your journal history, or your current risk exposure. Archio AI operates on first-party data across all 6 pillars -- a fundamentally different capability." },
    { icon: Shield, title: "Trust Infrastructure", color: "#5865f2",
      desc: "Every mentor has a verified track record calculated from actual broker-connected trade data. Every signal has full audit history. Every community interaction has accountability. Archio solves the $800M+ annual trust deficit by making transparency the architectural default.",
      evidence: "Airbnb solved trust in home-sharing with verified reviews and host insurance, unlocking a $100B+ market. Archio applies the same principle to trading communities where 70-80% of participants currently distrust the information they receive." },
    { icon: Zap, title: "Workflow Moat (Systemic)", color: "#f97316",
      desc: "Individual features are copyable. TradingView can add community. Discord can add charting. But the unified workflow -- where every module talks to every other module through 23 automated data handoffs -- is a systems-level moat that compounds with every user interaction.",
      evidence: "HubSpot proved this model in marketing: CRM + Email + Analytics + CMS individually are commodity features. Combined into one workflow with shared data, they created a $30B+ company. The value is not in any single module -- it is in the connections between them." },
  ]

  const comparisons = [
    { category: "Platform", archio: "6-pillar unified OS", tradingview: "Charting + social", mt5: "Execution only", discord: "Chat only" },
    { category: "AI Integration", archio: "48 native components", tradingview: "Pine Script (scripting)", mt5: "Expert Advisors (2003-era)", discord: "None" },
    { category: "Data Continuity", archio: "23 auto handoffs", tradingview: "Siloed to charts", mt5: "Siloed to orders", discord: "Siloed to messages" },
    { category: "Trust Verification", archio: "Broker-verified records", tradingview: "Self-reported ideas", mt5: "None", discord: "None" },
    { category: "Journaling", archio: "100% auto-capture", tradingview: "None", mt5: "Basic history log", discord: "None" },
    { category: "Risk Management", archio: "Cross-account real-time", tradingview: "None", mt5: "Per-account basic", discord: "None" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        {coreStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl p-3.5 text-center group/cs cursor-default" style={{ background: `${s.color}04`, border: `1px solid ${s.color}10` }}>
            <div className="text-2xl font-black font-mono text-white mb-0.5">{s.value}</div>
            <div className="text-[10px] font-bold" style={{ color: `${s.color}90` }}>{s.label}</div>
            <div className="text-[8px] text-zinc-600 mt-0.5 opacity-60 group-hover/cs:opacity-100 transition-opacity">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {thesis.map((t, i) => (
          <motion.div key={t.title} initial={{ opacity: 0, x: i % 2 === 0 ? -8 : 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="rounded-xl p-4 group/th cursor-default" style={{ background: `${t.color}03`, border: `1px solid ${t.color}08` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${t.color}08`, border: `1px solid ${t.color}15` }}>
                <t.icon className="w-3.5 h-3.5" style={{ color: `${t.color}60` }} />
              </div>
              <span className="text-[11px] font-bold text-white">{t.title}</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed mb-2">{t.desc}</p>
            <p className="text-[8px] leading-relaxed opacity-0 group-hover/th:opacity-100 transition-opacity duration-400" style={{ color: `${t.color}50` }}>{t.evidence}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button onClick={() => setShowComparison(!showComparison)} className="w-full text-left rounded-xl p-3.5 transition-all duration-300 outline-none" style={{ background: showComparison ? `${accent}04` : `${accent}02`, border: `1px solid ${showComparison ? `${accent}12` : `${accent}06`}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4" style={{ color: `${accent}50` }} />
              <span className="text-[11px] font-bold text-white">Platform Capability Comparison</span>
            </div>
            <span className="text-[8px] font-mono" style={{ color: `${accent}35` }}>{showComparison ? "Collapse" : "Expand comparison matrix"}</span>
          </div>
        </button>
        <AnimatePresence>
          {showComparison && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-b-xl overflow-hidden" style={{ border: `1px solid ${accent}08`, borderTop: "none" }}>
                <div className="grid grid-cols-5 gap-px" style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Category", "Archio AI", "TradingView", "MetaTrader 5", "Discord"].map((h, i) => (
                    <div key={h} className="px-3 py-2 text-center" style={{ background: i === 1 ? `${accent}06` : "rgba(255,255,255,0.01)" }}>
                      <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: i === 1 ? `${accent}70` : "rgba(148,163,184,0.3)" }}>{h}</span>
                    </div>
                  ))}
                  {comparisons.map((row, ri) => (
                    [row.category, row.archio, row.tradingview, row.mt5, row.discord].map((cell, ci) => (
                      <div key={`${ri}-${ci}`} className="px-3 py-2" style={{ background: ci === 1 ? `${accent}03` : "#080A10" }}>
                        <span className={`text-[9px] ${ci === 0 ? "font-semibold text-zinc-400" : ci === 1 ? "font-bold" : "text-zinc-600"}`} style={ci === 1 ? { color: `${accent}80` } : undefined}>{cell}</span>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 2: BEFORE & AFTER
   ═══════════════════════════════════════════════════════════════════ */

function SlideBeforeAfter({ accent }: { accent: string }) {
  const beforeApps = [
    { name: "TradingView", cat: "Charting", cost: "$14.95/mo", users: "50M+", color: "#2962ff", limitation: "No execution, no journaling, no account management. Analysis and action are separated by a chasm of app-switching, copy-pasting price levels, and context loss.", revenue: "$400M+ ARR" },
    { name: "MetaTrader 5", cat: "Execution", cost: "Free*", users: "15M+", color: "#0698ce", limitation: "No modern charting, no community, no AI. Built in 2003. Broker-locked architecture means your data belongs to the broker, not you. *Free to users; brokers pay $100K+ licensing fees.", revenue: "$200M+ licensing" },
    { name: "Discord", cat: "Community", cost: "Free", users: "150M+", color: "#5865f2", limitation: "No trade verification, no audit trails, no signal-to-execution pipeline. 80% trust deficit. The largest trading communities have zero accountability infrastructure.", revenue: "$600M+ (general)" },
    { name: "TradeZella", cat: "Journaling", cost: "$29.99/mo", users: "100K", color: "#8b5cf6", limitation: "Manual entry required. Disconnected from execution and charts. 60-70% of trades are never logged because the friction is too high for consistent use.", revenue: "~$15M ARR" },
    { name: "ForexFactory", cat: "News/Calendar", cost: "Free", users: "5M+", color: "#f97316", limitation: "No connection to your chart, your trades, or your context. Another tab, another context switch, another piece of information you must mentally synthesize.", revenue: "Ad-supported" },
    { name: "Broker Portal", cat: "Account Mgmt", cost: "Free", users: "Varies", color: "#f59e0b", limitation: "Separate login for every broker. No cross-account analytics. No unified risk view. No prop firm rule tracking. The most fragmented category.", revenue: "Bundled with brokerage" },
    { name: "Spreadsheets", cat: "Analytics", cost: "Free", users: "Universal", color: "#22c55e", limitation: "Manual data entry, no real-time sync, error-prone at scale. The fact that professional traders still use spreadsheets for analytics is the clearest indictment of the current tool ecosystem.", revenue: "N/A" },
    { name: "Twitter/X", cat: "Sentiment", cost: "Free", users: "500M+", color: "#a8b3bc", limitation: "Extreme noise-to-signal ratio. No verification of claims. No integration with any trading workflow. Algorithmically optimized for engagement, not accuracy.", revenue: "$3B+ (general)" },
  ]

  const afterModules = [
    { name: "Intelligence Engine", cat: "Analysis + Forecast + Copilot", features: "18 AI components. Multi-timeframe charts with AI pattern recognition, forecast engine with confidence scores, contextual copilot that sees your entire workflow. Replaces TradingView + Bloomberg + paid signals.", savings: "$40-200/mo saved" },
    { name: "Execution Layer", cat: "Orders + Sizing + Checklists", features: "6 AI components. One-click chart-to-order execution, auto position sizing (99.9% accuracy), enforced pre-trade checklists, psychology check-ins. Replaces MetaTrader + calculators + discipline.", savings: "3-7 min saved per trade" },
    { name: "Community Hub", cat: "Verified Social + Signals", features: "8 AI components. Broker-verified mentor leaderboards, transparent track records, signal-to-execution pipeline, ML fraud detection. Replaces Discord + Telegram + paid gurus.", savings: "$500-2K/yr in wasted subs" },
    { name: "Trade Journal", cat: "Auto-Capture + AI Review", features: "6 AI components. 100% auto-capture (18 data points/trade), weekly AI review sessions, psychology tracker, performance analytics (25+ metrics). Replaces TradeZella + spreadsheets.", savings: "5-10 min saved per trade" },
    { name: "MRKT Intelligence", cat: "News + Calendar + Sentiment", features: "6 AI components. AI briefings, smart economic calendar with historical analysis, 200+ source sentiment aggregation, contextual chart annotations. Replaces ForexFactory + news terminals.", savings: "20-30 min saved per session" },
    { name: "Account Dashboard", cat: "Multi-Broker + Risk + Prop", features: "4 AI components. Cross-broker unified view, prop firm rule compliance monitoring, correlated risk detection, funding/payout tracking. Replaces broker portals + spreadsheets.", savings: "15 min saved per day" },
  ]

  const costComparison = [
    { label: "Fragmented stack cost", value: "$60-200+/mo", sub: "8 tools, 8 logins, 8 UIs, 0 data sharing" },
    { label: "Annual fragmented cost", value: "$720-2,400/yr", sub: "Plus 45-60 min/day lost to context switching" },
    { label: "Archio unified cost", value: "$19-99/mo", sub: "1 platform, 1 login, 6 pillars, 48 AI components, 23 auto handoffs" },
    { label: "Annual savings", value: "$500-2,100/yr", sub: "Plus 300+ hours/year recovered from eliminated context switching" },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {costComparison.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-lg p-2.5 text-center" style={{ background: i < 2 ? "rgba(239,68,68,0.03)" : `${accent}04`, border: `1px solid ${i < 2 ? "rgba(239,68,68,0.06)" : `${accent}10`}` }}>
            <div className="text-sm font-bold font-mono text-white">{c.value}</div>
            <div className="text-[7px] font-semibold uppercase tracking-wider" style={{ color: i < 2 ? "rgba(239,68,68,0.4)" : `${accent}50` }}>{c.label}</div>
            <div className="text-[7px] text-zinc-700 mt-0.5">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(239,68,68,0.08)" }}>
          <div className="px-3 py-2 flex items-center justify-between" style={{ background: "rgba(239,68,68,0.04)", borderBottom: "1px solid rgba(239,68,68,0.06)" }}>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(239,68,68,0.6)" }}>Before: 8 Disconnected Apps</span>
            <span className="text-[8px] font-mono" style={{ color: "rgba(239,68,68,0.3)" }}>$60-200+/mo + friction</span>
          </div>
          <div className="flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>
            {beforeApps.map((app, i) => (
              <motion.div key={app.name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="px-3 py-1.5 group/app cursor-default" style={{ background: "rgba(8,14,26,0.9)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: app.color }} />
                    <span className="text-[9px] font-semibold text-zinc-300">{app.name}</span>
                    <span className="text-[7px] px-1 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.02)", color: "rgba(148,163,184,0.45)" }}>{app.cat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] font-mono text-zinc-700">{app.revenue}</span>
                    <span className="text-[8px] font-mono text-zinc-700">{app.cost}</span>
                  </div>
                </div>
                <p className="text-[7px] text-zinc-700 leading-relaxed max-h-0 group-hover/app:max-h-20 overflow-hidden transition-all duration-300">{app.limitation}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accent}10` }}>
          <div className="px-3 py-2 flex items-center justify-between" style={{ background: `${accent}04`, borderBottom: `1px solid ${accent}08` }}>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: `${accent}70` }}>After: Archio AI (6 Pillars)</span>
            <span className="text-[8px] font-mono" style={{ color: `${accent}35` }}>$19-99/mo unified</span>
          </div>
          <div className="flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>
            {afterModules.map((mod, i) => (
              <motion.div key={mod.name} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.04 }} className="px-3 py-2 group/mod cursor-default" style={{ background: "rgba(8,14,26,0.9)" }}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: `${accent}50` }} />
                    <span className="text-[9px] font-semibold text-zinc-300">{mod.name}</span>
                    <span className="text-[7px] px-1 py-0.5 rounded font-mono" style={{ background: `${accent}06`, color: `${accent}40` }}>{mod.cat}</span>
                  </div>
                  <span className="text-[7px] font-semibold" style={{ color: `${accent}40` }}>{mod.savings}</span>
                </div>
                <p className="text-[8px] leading-relaxed opacity-50 group-hover/mod:opacity-100 transition-opacity" style={{ color: `${accent}50` }}>{mod.features}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════��═══════
   SLIDE 3: SIX PILLARS OVERVIEW
   ═══════════════════════════════════════════════════════════════════ */

function SlideSixPillars({ accent }: { accent: string }) {
  const pillars = [
    { icon: Brain, name: "Intelligence Engine", color: "#8b5cf6", modules: 12, ai: 18, replaces: "TradingView + Bloomberg + ForexFactory + paid signals", keyMetric: "25 min -> 3 min pre-trade analysis", desc: "AI-powered market analysis, multi-model forecasting, confluence detection, and a contextual copilot that sees your chart, journal, community signals, and risk state simultaneously. The brain of the operating system.", revenue: "$3.2B charting + $2.1B intelligence market" },
    { icon: Zap, name: "Execution Layer", color: "#f97316", modules: 8, ai: 6, replaces: "MetaTrader 5 + position calculators + trade copiers", keyMetric: "3-7 min -> <10 sec idea-to-order", desc: "One-click chart-to-order with auto position sizing, enforced pre-trade checklists, psychology check-ins, and auto journal capture. The fastest path from idea to execution to review.", revenue: "$4.8B execution tech market" },
    { icon: Users, name: "Community & Trust", color: "#5865f2", modules: 10, ai: 8, replaces: "Discord + Telegram + paid gurus + blind trust", keyMetric: "80% trust gap -> 90%+ verified confidence", desc: "Broker-verified mentor leaderboards, auditable track records, signal-to-execution pipeline, and ML fraud detection. The first trading community where trust is earned with data, not assumed.", revenue: "$1.8B social trading market" },
    { icon: BookOpen, name: "Journaling & Review", color: "#06b6d4", modules: 7, ai: 6, replaces: "TradeZella + spreadsheets + Notion", keyMetric: "30-40% -> 100% journal capture rate", desc: "100% auto-capture (18 data points/trade), weekly AI review sessions identifying patterns, psychology tracking correlating emotions with performance, and 25+ analytics metrics.", revenue: "$680M journaling market" },
    { icon: Wallet, name: "Account & Risk", color: "#10b981", modules: 6, ai: 4, replaces: "Broker portals + prop firm dashboards + spreadsheets", keyMetric: "15 min -> 30 sec daily account review", desc: "Multi-broker unified dashboard, prop firm rule compliance monitoring with 70/85/95% alerts, correlated risk detection across accounts, and automated funding/payout tracking.", revenue: "$380M+ account management" },
    { icon: Newspaper, name: "News & Events", color: "#ef4444", modules: 6, ai: 6, replaces: "ForexFactory + Twitter + Bloomberg + news terminals", keyMetric: "20-30 min -> 2-3 min pre-session prep", desc: "AI-generated daily briefings, smart economic calendar with 50K+ historical events, 200+ source sentiment aggregation, and contextual chart annotations. Intelligence woven into workflow.", revenue: "$2.1B market intelligence" },
  ]

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-3 gap-2.5">
        {pillars.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl p-3.5 group/pillar cursor-default" style={{ background: `${p.color}03`, border: `1px solid ${p.color}08` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${p.color}08`, border: `1px solid ${p.color}15` }}>
                <p.icon className="w-4 h-4" style={{ color: `${p.color}70` }} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">{p.name}</div>
                <div className="text-[7px] font-mono" style={{ color: `${p.color}35` }}>{p.modules} modules | {p.ai} AI</div>
              </div>
            </div>
            <p className="text-[9px] text-zinc-500 leading-relaxed mb-2">{p.desc}</p>
            <div className="rounded-lg px-2 py-1.5 mb-2" style={{ background: `${p.color}04`, border: `1px solid ${p.color}08` }}>
              <div className="text-[8px] font-bold" style={{ color: `${p.color}70` }}>{p.keyMetric}</div>
            </div>
            <div className="text-[7px] text-zinc-700 leading-relaxed opacity-0 group-hover/pillar:opacity-100 transition-opacity duration-300">
              <div className="mb-0.5"><span className="font-semibold" style={{ color: "rgba(239,68,68,0.4)" }}>Replaces:</span> <span className="text-zinc-600">{p.replaces}</span></div>
              <div><span className="font-semibold" style={{ color: `${p.color}35` }}>Addressable:</span> <span className="text-zinc-600">{p.revenue}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-6 gap-1.5">
        {[
          { label: "Total Modules", value: "49", color: accent },
          { label: "AI Components", value: "48", color: "#8b5cf6" },
          { label: "Apps Replaced", value: "8+", color: "#f97316" },
          { label: "Data Handoffs", value: "23", color: "#06b6d4" },
          { label: "Logins Required", value: "1", color: "#10b981" },
          { label: "Data Silos", value: "0", color: "#ef4444" },
        ].map(t => (
          <div key={t.label} className="rounded-lg p-2 text-center" style={{ background: `${t.color}03`, border: `1px solid ${t.color}08` }}>
            <div className="text-lg font-black font-mono text-white">{t.value}</div>
            <div className="text-[6px] font-semibold uppercase tracking-wider" style={{ color: `${t.color}40` }}>{t.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDES 4-9: PILLAR DEEP DIVES (reusing enhanced data)
   ═══════════════════════════════════════════════════════════════════ */

interface PillarData {
  icon: React.ElementType; name: string; color: string; tagline: string
  painPoints: { problem: string; impact: string; currentSolution: string; costOfInaction: string }[]
  archioSolution: { feature: string; detail: string; howItWorks: string; techDetail: string }[]
  techSpecs: { label: string; value: string }[]
  replaces: { tool: string; limitation: string; marketShare: string }[]
  impactMetrics: { metric: string; before: string; after: string; methodology: string }[]
  investorNote: string; marketContext: string
}

const PILLAR_DATA: Record<string, PillarData> = {
  "pillar-intel": {
    icon: Brain, name: "Intelligence Engine", color: "#8b5cf6",
    tagline: "AI-driven market analysis that sees your full context -- not just one chart in isolation. This is the pillar that creates the most immediate, measurable value for users and the highest willingness to pay.",
    marketContext: "The charting and analytics market ($3.2B) plus market intelligence ($2.1B) represents $5.3B in addressable revenue. TradingView dominates charting with $400M+ ARR and 50M+ users, but offers zero AI-native intelligence, no journal integration, and no execution capability. The gap between what TradingView provides (charts + basic social) and what traders actually need (intelligent analysis + execution + review) is where Archio's Intelligence Engine operates.",
    painPoints: [
      { problem: "Analysis spread across 5+ tabs", impact: "45 min/day lost to context switching between charting, news, calendars, and sentiment tools", currentSolution: "TradingView for charts, ForexFactory for calendar, Twitter for sentiment, Bloomberg for macro, paid signal groups for ideas", costOfInaction: "A trader making 3-5 trades/day loses 300+ hours/year to manual multi-tab research. At $50/hour opportunity cost, that is $15,000/year in lost productive trading time." },
      { problem: "No AI understands trading context", impact: "Generic AI tools cannot cross-reference chart annotations with economic events and community signals simultaneously", currentSolution: "ChatGPT for general questions that cannot see live charts, cannot access journal history, and cannot assess current risk exposure", costOfInaction: "Trades made without full context awareness have 2.3x lower success rates than trades with confluence confirmation across multiple data sources." },
      { problem: "Market intelligence is fragmented", impact: "Traders miss correlations between macro events, sentiment shifts, and technical levels because data lives in separate, unconnected applications", currentSolution: "Manual mental synthesis across 4-6 data sources before every single trade decision -- an unsustainable cognitive load", costOfInaction: "40% of confluent setups are missed entirely because the trader did not check all sources. Each missed high-conviction setup represents $200-2,000 in potential profit depending on account size." },
    ],
    archioSolution: [
      { feature: "AI Forecast Engine", detail: "Generates directional bias with confidence scores (1-100) and transparent reasoning chains. Shows exactly why it thinks EURUSD is bearish: which technical levels, which economic events, which sentiment shifts, and how they interact.", howItWorks: "Multi-model ensemble analyzing 15+ data signals: price action structure, volume profile, order flow sentiment, economic calendar proximity, cross-pair correlations, and historical pattern matching across 10+ years of data.", techDetail: "4 specialized models (technical, fundamental, sentiment, pattern) produce independent scores that are weighted by a meta-model trained on historical prediction accuracy. Confidence scores reflect agreement across models." },
      { feature: "MRKT Intelligence Hub", detail: "6-panel real-time intelligence surface: economic calendar with historical impact analysis, news aggregation with NLP classification, sentiment dashboard with multi-source aggregation, central bank tracker, COT data visualization, and market heat maps.", howItWorks: "NLP processing pipeline ingests 10,000+ daily news articles from 200+ sources, classifies by affected pairs and impact severity, extracts sentiment direction, and contextualizes against the user's active watchlist and open positions.", techDetail: "Custom fine-tuned NLP models for financial text classification (92%+ accuracy), named entity recognition for central bank officials and economic indicators, and sentiment scoring calibrated against historical market reactions." },
      { feature: "Copilot AI System", detail: "48-component AI assistant woven across every surface. It sees your chart annotations, journal patterns, community signals, risk state, and emotional indicators simultaneously -- enabling intelligence that no standalone AI tool can replicate.", howItWorks: "RAG architecture combining personal trading data (charts, journals, trade history, psychology scores) with real-time market data (prices, news, sentiment) and community intelligence (mentor signals, consensus) to deliver context-aware insights.", techDetail: "Vector database stores all user interactions as embeddings. Each copilot query retrieves relevant context from personal history + market state + community data. Response generation uses a fine-tuned model optimized for trading domain accuracy." },
      { feature: "Confluence Scanner", detail: "Automatically identifies when multiple independent signals align: technical level + economic event proximity + community mentor consensus + AI forecast agreement + sentiment direction. Scores setups on a 1-10 confluence scale.", howItWorks: "Cross-referencing engine monitors 6 independent signal sources in real-time. When 3+ sources agree on direction and timing, the scanner triggers an alert with a detailed breakdown of which signals agree and the historical success rate of similar confluence patterns.", techDetail: "Weighted scoring algorithm: technical (30%), fundamental (20%), sentiment (15%), AI forecast (15%), community (10%), pattern (10%). Minimum 3/6 sources required. Historical backtesting shows 2.3x improvement in trade outcomes with confluence score >= 7." },
    ],
    techSpecs: [
      { label: "AI models in ensemble", value: "4 specialized" },
      { label: "Data signals per forecast", value: "15+" },
      { label: "News articles processed/day", value: "10,000+" },
      { label: "Copilot components", value: "48 across all surfaces" },
      { label: "Forecast latency", value: "<2 seconds" },
      { label: "Context window", value: "Full user history (vector DB)" },
      { label: "NLP classification accuracy", value: "92%+" },
      { label: "Historical pattern database", value: "10+ years" },
    ],
    replaces: [
      { tool: "TradingView Premium ($14.95/mo)", limitation: "Charts and basic social features only. No AI analysis, no contextual intelligence, no journal integration, no execution.", marketShare: "50M+ users, $400M+ ARR" },
      { tool: "ForexFactory (Free)", limitation: "Economic calendar only. No chart connection, no AI interpretation, no personalization, no workflow integration.", marketShare: "5M+ monthly visitors" },
      { tool: "Bloomberg Terminal ($25K/yr)", limitation: "Institutional-grade data but designed for fund managers. No retail workflow, no AI copilot, no community.", marketShare: "325K terminals, $11B+ revenue" },
      { tool: "Paid Signal Groups ($50-500/mo)", limitation: "No verification of accuracy. No transparent track records. No execution pipeline. Trust is assumed, never proven.", marketShare: "$800M+ fragmented market" },
    ],
    impactMetrics: [
      { metric: "Pre-trade analysis time", before: "25-40 min", after: "3-5 min", methodology: "Measured across 2,400 beta users. AI briefing + confluence scanner + contextual news replaces manual 5-tab research workflow." },
      { metric: "Data sources checked pre-trade", before: "5-8 manual tabs", after: "1 unified view", methodology: "Intelligence Hub surfaces all relevant data in one panel, eliminating the need to switch between charting, news, calendar, sentiment, and signal sources." },
      { metric: "Missed confluence signals", before: "~40% unnoticed", after: "<5% with scanner", methodology: "Confluence Scanner monitors all 6 signal sources continuously. Manual monitoring misses 40% of confluent setups due to attention limits and tab-switching fatigue." },
      { metric: "AI-assisted trade decisions", before: "0% (no context-aware AI exists)", after: "100% (copilot on every surface)", methodology: "Every trade surface includes copilot integration. Users can query context-aware AI at any point in the decision process." },
    ],
    investorNote: "The Intelligence Engine is the highest-value pillar because it creates immediate, measurable time savings (25+ min/day) and directly improves trade quality through confluence detection. This is the feature that drives initial adoption, willingness to pay at premium tiers, and the strongest word-of-mouth referrals. In user surveys, 78% rated AI-assisted analysis as the #1 reason they would pay for Archio.",
  },
  "pillar-exec": {
    icon: Zap, name: "Execution Layer", color: "#f97316",
    tagline: "The fastest path from trade idea to executed order to journal entry -- in one continuous, disciplined flow. This is the pillar that locks users in: once you experience one-click execution with auto-journaling, going back to MetaTrader feels like going from Google Maps back to paper maps.",
    marketContext: "The execution technology market ($4.8B) is dominated by MetaQuotes (MetaTrader) with $200M+ in licensing revenue from 1,500+ brokers. MetaTrader was built in 2003 and has not fundamentally evolved. It has no modern charting quality, no AI, no community integration, and no journaling. The execution layer is the most commoditized category -- and therefore the most ripe for disruption by a platform that makes execution part of an intelligent, connected workflow rather than an isolated step.",
    painPoints: [
      { problem: "Idea-to-execution gap averages 3-7 minutes", impact: "Price moves 0.5-2% during the delay between identifying a setup on TradingView and placing the order on MetaTrader. Conviction fades. Slippage accumulates.", currentSolution: "Copy price levels from chart platform, open broker terminal, manually calculate lot size, enter order parameters, double-check, submit", costOfInaction: "At 3-5 trades/day, a trader loses 15-35 minutes daily to execution friction. Slippage from delayed execution costs an estimated 0.3-0.8% per trade in missed entry quality." },
      { problem: "Manual position sizing is the #1 cause of unexpected large losses", impact: "12-18% of trades have position sizing errors. A single lot size mistake can cause losses 5-10x larger than intended.", currentSolution: "External pip value calculators, spreadsheet formulas, or mental arithmetic under time pressure. Error rates increase with fatigue and emotional trading.", costOfInaction: "Position sizing errors account for an estimated 25-30% of all catastrophic loss events (losses > 5% of equity in a single trade) among retail traders." },
      { problem: "No pre-trade discipline enforcement exists", impact: "Impulsive trades (entered without analysis, during unfavorable conditions, or in emotional states) account for 40-60% of all losing trades across retail populations.", currentSolution: "Self-discipline (proven unreliable), post-hoc journal review (too late to prevent the loss), willpower (depletes throughout the trading session)", costOfInaction: "Eliminating impulsive trades alone would improve the average retail trader's performance by an estimated 15-25%. The tool to enforce this discipline simply has not existed until now." },
    ],
    archioSolution: [
      { feature: "One-Click Chart-to-Order Execution", detail: "Click a level on your chart. The execution panel auto-populates entry, stop-loss, and take-profit. Position size is calculated from your risk rules. Risk/reward ratio is displayed. One confirmation click executes the trade.", howItWorks: "Chart click event captures price level, retrieves account balance and risk percentage from settings, calculates lot size using instrument pip value and account currency conversion, pre-populates all order fields -- complete in <500ms.", techDetail: "WebSocket connection to broker API enables sub-second order execution. Position sizing engine handles 28 major pairs with real-time pip value calculation, account currency normalization, and leverage-adjusted lot sizing." },
      { feature: "Pre-Trade Checklist Engine", detail: "Configurable 5-12 step checklist that must be completed before the order submission button activates. Includes auto-scored confluence check, auto-calculated risk assessment, auto-checked news proximity, and manual trader self-assessment.", howItWorks: "Rule engine validates each checklist item: (1) confluence score from Intelligence Engine >= threshold, (2) risk/reward ratio >= minimum, (3) no high-impact news within configurable window, (4) daily loss limit not approaching, (5-12) custom user rules.", techDetail: "Checklist rules are composable and user-configurable. Default templates for different trading styles (scalping, swing, position). Historical data shows traders who complete 8+ checklist items have 2.3x better outcomes than those who skip." },
      { feature: "Auto-Journal Capture (Zero Input)", detail: "Every executed trade is automatically logged with full context: chart screenshot at moment of entry, entry reasoning from checklist responses, market conditions, news context, emotional state assessment, and time-of-day metadata.", howItWorks: "Trade execution event triggers async multi-source capture: chart renderer generates PNG screenshot, order parameters are structured into journal entry, checklist responses become decision log, market state is captured as context snapshot. Entire process completes in <1 second with zero manual input.", techDetail: "18 data points captured per trade: entry price, exit price, pair, direction, lot size, SL, TP, R:R ratio, confluence score, checklist score, market session, news proximity, emotional state (4 dimensions), chart screenshot URL, entry timestamp, exit timestamp, outcome." },
      { feature: "Psychology Check-In System", detail: "Between trades, optional emotional state assessment (30 seconds). Over 50+ data points, the system identifies personal patterns: you lose money when trading angry on Mondays, your best trades happen in calm Asian sessions, your performance degrades after 3 consecutive losses.", howItWorks: "4-dimension emotional assessment: energy level (1-5), confidence (1-5), patience (1-5), focus (1-5). ML model trained on user-specific data correlates self-reported states with trade outcomes. Minimum 50 data points for statistically significant insights.", techDetail: "Longitudinal time-series analysis with sliding window correlation. Alerts trigger when current emotional profile matches historically poor-performance patterns. User-configurable alert sensitivity." },
    ],
    techSpecs: [
      { label: "Idea-to-order latency", value: "<10 seconds total" },
      { label: "Position size accuracy", value: "99.9% (auto-calculated)" },
      { label: "Supported brokers (API)", value: "15+ and expanding" },
      { label: "Checklist steps", value: "5-12 configurable per template" },
      { label: "Auto-journal capture time", value: "<1 second" },
      { label: "Data points per trade", value: "18 auto-captured" },
      { label: "Psychology dimensions", value: "4 (energy, confidence, patience, focus)" },
      { label: "Min data for pattern detection", value: "50 trades" },
    ],
    replaces: [
      { tool: "MetaTrader 5 (Free*)", limitation: "2003-era UX. No modern charting, no AI, no community, no journaling. Broker-locked. *Free to users; brokers pay $100K+ licensing.", marketShare: "15M+ users, 1,500+ broker licenses" },
      { tool: "Position Size Calculators", limitation: "External browser tool. Manual input. Error-prone. Breaks workflow. No connection to chart or journal.", marketShare: "Dozens of free tools, highly fragmented" },
      { tool: "TradeZella ($29.99/mo)", limitation: "Manual entry after the fact. 60-70% of trades never journaled. No execution connection. No real-time auto-capture.", marketShare: "~100K users, ~$15M ARR" },
      { tool: "Trade Copier Services ($30-100/mo)", limitation: "Blind copy without understanding. No learning pathway. No context. No discipline enforcement.", marketShare: "$200M+ fragmented market" },
    ],
    impactMetrics: [
      { metric: "Idea-to-execution time", before: "3-7 minutes", after: "<10 seconds", methodology: "Elimination of app-switching (TradingView -> MetaTrader), manual lot size calculation, and order form completion. Chart-to-order in 2 clicks." },
      { metric: "Position sizing errors", before: "12-18% of trades", after: "<0.1%", methodology: "Auto-calculation with real-time pip values and account balance. Human arithmetic removed from the process entirely." },
      { metric: "Trades with completed pre-checklist", before: "~5% (manual self-discipline)", after: "100% (system-enforced)", methodology: "Order submission button physically disabled until checklist is completed. Impulsive trade prevention is architectural, not behavioral." },
      { metric: "Trades with complete journal entries", before: "30-40% (manual entry fatigue)", after: "100% (zero-input auto-capture)", methodology: "18 data points captured automatically on execution. No manual input required. Journal completion rate goes from opt-in to guaranteed." },
    ],
    investorNote: "The Execution Layer is the retention moat. Once a trader experiences one-click execution with auto-journaling and enforced checklists, the switching cost to go back to manual MetaTrader + calculator + spreadsheet workflow is enormous. Beta data shows that users who connect a broker account in Week 1 have 92% Month-1 retention vs. 65% for users who only use analysis features. This is where behavioral lock-in happens.",
  },
  "pillar-comm": {
    icon: Users, name: "Community & Trust", color: "#5865f2",
    tagline: "The first trading community where every claim is verifiable, every track record is audited, and trust is earned with data -- not assumed from follower counts.",
    marketContext: "The social trading market ($1.8B, 14.1% CAGR, projected $5.6B by 2030) is the fastest-growing segment in trading software. eToro pioneered copy trading but the model is evolving: traders want transparent mentorship, verifiable track records, and educational context -- not blind signal copying. The $800M+ trust deficit across Discord/Telegram trading communities creates an urgent demand for verification infrastructure.",
    painPoints: [
      { problem: "$800M+ annual trust deficit in trading communities", impact: "70-80% of traders do not trust trading influencers. Fake screenshots, cherry-picked results, and zero accountability. Average new trader wastes $500-2,000 on fraudulent or misleading signal services.", currentSolution: "Discord with unverified admins, Telegram groups with no audit trails, YouTube traders with no accountability", costOfInaction: "The trust crisis suppresses community participation. Traders who would benefit from mentorship avoid it entirely because they cannot distinguish real expertise from social media performance." },
      { problem: "Signal-to-execution disconnect", impact: "Even legitimate signals require the user to manually screenshot, switch apps, re-enter parameters, and execute -- losing 2-5 minutes and accuracy per signal", currentSolution: "Screenshot a Discord message, open MetaTrader, manually enter entry/SL/TP, calculate lot size, hope the price has not moved during the 3-minute process", costOfInaction: "Signal providers show theoretical results based on signal timestamps. But the trader's actual results are 15-30% worse because of execution delay. This gap erodes trust even in legitimate signal providers." },
      { problem: "No data-driven mentor discovery", impact: "New traders cannot distinguish experienced mentors from social media influencers. Discovery is entirely trust-based (follower counts, marketing quality, testimonials that may be fabricated)", currentSolution: "Trial and error. Average new trader tries 3-4 mentors ($200-800 each) before finding one they trust. Total wasted spend: $500-2,000.", costOfInaction: "The mentorship market is worth more when trust is solved. Right now, 60%+ of potential mentorship revenue is lost because traders refuse to pay for services they cannot verify." },
    ],
    archioSolution: [
      { feature: "Verified Mentor Leaderboards", detail: "Every mentor's performance is calculated from actual broker-connected trade data. Win rate, average R:R, signal accuracy, pair specialization, drawdown history, and consistency score -- all verified, none self-reported.", howItWorks: "Broker API connection verifies executed trades against posted signals. Minimum 100-trade threshold for statistical significance. Performance recalculated daily. Mentors cannot hide losing periods.", techDetail: "Trade matching algorithm compares signal timestamps and parameters against actual execution data. Tolerance windows for slippage. Statistical significance testing prevents small-sample-size outliers from distorting rankings." },
      { feature: "Inspector Modal (Full Transparency)", detail: "Click any mentor profile to see complete transparent performance: equity curve, trade-by-trade history with chart screenshots, risk metrics, consistency scores, student feedback, teaching methodology, and response time.", howItWorks: "Real-time data aggregation: verified trades -> equity curve, signal history -> accuracy metrics, student interactions -> feedback scores, content -> methodology assessment. Comprehensive profile updated continuously.", techDetail: "Inspector Modal renders 15+ data visualizations from live data. No screenshots, no self-reported numbers. Every metric is calculated from verifiable source data with full audit trail." },
      { feature: "Signal-to-Execution Pipeline", detail: "See a mentor signal -> one click populates your execution panel with entry, SL, TP, and auto-calculated position size based on your personal risk rules. Execute immediately. Trade auto-journaled with signal source attribution.", howItWorks: "Standardized signal data structure includes entry, SL, TP, direction, and pair. User click triggers API call to Execution Layer: pre-populate order form, calculate position size from user's risk rules, show R:R ratio. One confirmation click to execute.", techDetail: "Signal-to-order latency: <3 seconds. Position sizing adapts to user's account, not signal provider's account. Signal attribution recorded in journal for performance analysis of which mentors drive the best outcomes for this specific user." },
      { feature: "ML-Powered Fraud Detection", detail: "Machine learning system monitors for suspicious patterns: fabricated screenshots, retroactively edited signals, statistical anomalies in reported performance, and coordinated inauthentic behavior across multiple accounts.", howItWorks: "Anomaly detection models trained on verified trade data identify performance patterns that are statistically unlikely (suspiciously consistent returns, no losing streaks, performance that does not match market conditions).", techDetail: "Ensemble of anomaly detection models: isolation forest for outlier detection, LSTM for temporal pattern analysis, graph neural network for coordinated behavior detection. False positive rate: <2%." },
    ],
    techSpecs: [
      { label: "Minimum verification trades", value: "100+ for ranking" },
      { label: "Discovery filter dimensions", value: "15+" },
      { label: "Signal-to-order latency", value: "<3 seconds" },
      { label: "Performance update frequency", value: "Real-time (daily recalc)" },
      { label: "Trust score dimensions", value: "8 weighted factors" },
      { label: "Fraud detection accuracy", value: "98%+ (ML ensemble)" },
      { label: "Inspector Modal data views", value: "15+ visualizations" },
      { label: "Signal attribution tracking", value: "Full audit trail" },
    ],
    replaces: [
      { tool: "Discord (Free)", limitation: "No verification, no audit trails, no signal-to-execution, no fraud detection. Trust is assumed from admin authority, never proven with data.", marketShare: "150M+ total users, ~10M in trading servers" },
      { tool: "Telegram Groups (Free)", limitation: "Ephemeral messages, no performance tracking, no accountability. Screenshots can be fabricated. Groups can delete history.", marketShare: "5M+ in trading groups" },
      { tool: "Paid Signal Services ($50-500/mo)", limitation: "No transparent verification. No way to audit historical accuracy. High churn (50-70%) due to trust issues and unmet expectations.", marketShare: "$800M+ fragmented across thousands of providers" },
      { tool: "eToro Social Trading (Free*)", limitation: "Copy trading without understanding. No learning pathway. No mentor relationship. User pays through wider spreads, not subscriptions.", marketShare: "30M+ users, $600M+ revenue" },
    ],
    impactMetrics: [
      { metric: "Mentor trust confidence", before: "20-30% (guessing from marketing)", after: "90%+ (verified data-backed)", methodology: "Inspector Modal provides 15+ data visualizations from verified sources. Users report 4.2x higher confidence in mentor selection decisions." },
      { metric: "Signal-to-execution time", before: "2-5 min (manual copy-paste)", after: "<3 seconds (one-click pipeline)", methodology: "Standardized signal format enables direct order form population. Eliminates app-switching, manual entry, and calculation delays." },
      { metric: "Wasted mentor subscription spend", before: "$500-2,000/year (3-4 failed trials)", after: "<$100 (data-driven first choice)", methodology: "Verified leaderboards with 15+ filter dimensions enable data-driven mentor selection. Users find compatible mentors on first or second attempt." },
      { metric: "Community fraud incidents", before: "Industry-wide crisis ($800M+ deficit)", after: "Near-zero (ML audit + verification)", methodology: "Combination of broker-verified performance data and ML anomaly detection eliminates the attack surface for fraudulent claims." },
    ],
    investorNote: "Community & Trust is the viral growth engine and the network effect driver. Verified mentors attract students (free user acquisition). Students become traders (conversion pipeline). Traders who succeed become mentors (supply expansion). The trust infrastructure creates a self-reinforcing growth loop that accelerates organic acquisition and reduces CAC toward zero for community-driven channels. This is the Airbnb dynamic applied to trading expertise.",
  },
  "pillar-journal": {
    icon: BookOpen, name: "Journaling & Review", color: "#06b6d4",
    tagline: "Every trade auto-captured with full context. AI-powered review turns raw data into accelerated improvement. This is the pillar that creates the deepest data moat.",
    marketContext: "The trade journaling market ($680M, 11.3% CAGR) is small but strategically critical. TradeZella ($29.99/mo, ~100K users) is the largest pure-play journal but suffers from the fundamental problem of manual entry: 60-70% of trades are never logged. Archio's auto-capture architecture solves this entirely, creating 100% journal completion as an architectural guarantee rather than a behavioral aspiration.",
    painPoints: [
      { problem: "60-70% of trades are never journaled", impact: "Without complete trade records, the learning loop is broken for the majority of active traders. They repeat mistakes because they have no systematic way to identify patterns.", currentSolution: "TradeZella ($30/mo) requires manual entry for every trade. Spreadsheets require manual data import. Most traders start journaling, maintain it for 2-3 weeks, then abandon it.", costOfInaction: "Traders without journals repeat the same mistakes for months or years. Research shows that consistent journaling improves performance by 15-25% over 6 months. The 60-70% who skip it forfeit this improvement entirely." },
      { problem: "Context is lost after trade closes", impact: "When reviewing a trade days later, the trader cannot reconstruct their reasoning, the market conditions, their emotional state, or the community signals that influenced the decision", currentSolution: "Screenshots saved to random folders. Notes in Notion (if any). No systematic connection between the trade, the reasoning, and the outcome. Review is guesswork.", costOfInaction: "Without context, trade review degenerates into hindsight bias: 'I should have known.' With context (chart state, news, checklist score, emotional state), review becomes actionable: 'I entered when my patience score was 1/5 -- I should not trade when patience is below 3.'" },
      { problem: "No AI-powered pattern detection across trade history", impact: "Traders cannot objectively identify their own behavioral patterns: time-of-day biases, revenge trading sequences, pair-specific weaknesses, or correlation between emotional states and outcomes", currentSolution: "Manual review of spreadsheet data. Subjective self-assessment with no statistical rigor. Confirmation bias in self-analysis.", costOfInaction: "A trader might lose money every Monday morning for 6 months without realizing the pattern exists. AI detection would identify this in the first 2 weeks with statistical confidence." },
    ],
    archioSolution: [
      { feature: "Zero-Input Auto-Capture Engine", detail: "Every trade automatically logged with 18 data points: chart screenshot, entry price, exit price, direction, pair, lot size, SL, TP, R:R ratio, confluence score, checklist score, market session, news proximity, emotional state (4 dims), timestamps, and outcome.", howItWorks: "Trade execution event triggers async multi-source capture. Chart renderer -> PNG screenshot. Order params -> structured log. Checklist responses -> decision tree. Market state -> context snapshot. Emotion assessment -> psychology score. All captured in <1 second.", techDetail: "Event-driven architecture: trade_executed event fans out to 6 capture services running in parallel. Chart screenshot service uses headless browser rendering. Context services pull from Intelligence Hub. All data normalized into unified journal schema." },
      { feature: "AI Review Sessions", detail: "Weekly AI-generated trade review: pattern detection across 12 dimensions, statistical significance testing on behavioral patterns, improvement recommendations ranked by expected impact, and conversational interface for exploring your own data.", howItWorks: "LLM analysis of complete journal data. Clustering algorithm groups trades by 12 dimensions (time, pair, direction, session, confluence, checklist, emotion). Statistical tests identify significant performance differences between clusters. Natural language summary highlights top 3 improvement opportunities.", techDetail: "Minimum 50 trades for initial pattern detection. Significance threshold: p < 0.05. Review algorithm identifies overconfidence patterns, revenge trading sequences, and time-of-day biases. Each review session is estimated to improve next-month performance by 3-8%." },
      { feature: "Psychology Tracker", detail: "Longitudinal emotional data correlated with trading performance. After 50+ trades, identifies personal patterns: 'You lose money when trading with energy < 2 and patience < 3.' 'Your best trades happen when confidence is 3-4, not 5.'", howItWorks: "Time-series analysis of 4-dimension emotional self-assessment cross-referenced with trade P&L. Sliding window correlation analysis identifies statistically significant emotional-performance patterns unique to each trader.", techDetail: "4 dimensions x 5-point scale = 625 possible emotional states. Correlation analysis requires minimum 50 data points per emotional cluster. Significant patterns are displayed as actionable rules with confidence intervals." },
      { feature: "Performance Analytics (25+ Metrics)", detail: "Profit factor, Sharpe ratio, max drawdown, win rate by pair/session/day, R-multiple distribution, streak analysis, edge ratio, expectancy, and comparison against your own historical averages -- all calculated from auto-captured data.", howItWorks: "Real-time calculation engine processing all journal data through 25+ statistical metrics. Configurable time windows (week, month, quarter, all-time). Benchmark comparisons against personal historical performance and anonymized peer averages.", techDetail: "Metrics update in real-time as trades close. Trend detection identifies improving/declining metrics. Alert system notifies when key metrics (drawdown, win rate, avg R:R) deviate from personal averages by >1 standard deviation." },
    ],
    techSpecs: [
      { label: "Auto-capture rate", value: "100% (architectural)" },
      { label: "Data points per trade", value: "18 auto-captured" },
      { label: "Capture latency", value: "<1 second" },
      { label: "AI review frequency", value: "Weekly auto + on-demand" },
      { label: "Analytics metrics", value: "25+" },
      { label: "Pattern detection minimum", value: "50 trades" },
      { label: "Statistical significance", value: "p < 0.05 threshold" },
      { label: "Historical storage", value: "Unlimited" },
    ],
    replaces: [
      { tool: "TradeZella ($29.99/mo)", limitation: "Manual entry. 60-70% skip rate. No auto-capture. No AI review. No psychology tracking. Incomplete data = useless analysis.", marketShare: "~100K users, ~$15M ARR" },
      { tool: "Spreadsheets (Free)", limitation: "Manual data entry. No screenshots. No emotional context. No AI analysis. Error-prone. Not scalable beyond 100 trades.", marketShare: "Universal usage, no revenue" },
      { tool: "Notion (Free-$10/mo)", limitation: "General-purpose tool with no trading-specific metrics, no auto-capture, no AI review, no statistical analysis capability.", marketShare: "35M+ users (general), small % for trading" },
      { tool: "Edgewonk ($169/yr)", limitation: "Desktop-only. Manual CSV import. No real-time sync. No AI analysis. Limited to post-hoc statistics without context.", marketShare: "~50K users" },
    ],
    impactMetrics: [
      { metric: "Trades with complete journal entries", before: "30-40% (manual entry)", after: "100% (auto-capture)", methodology: "Architectural guarantee: trade execution event triggers auto-capture. No manual input required. Completion rate is a system property, not a user behavior." },
      { metric: "Context data preserved per trade", before: "1-2 points (price, P&L)", after: "18 data points", methodology: "Chart state, decision reasoning, market conditions, emotional state, news context, and checklist scores are all captured automatically at moment of entry." },
      { metric: "Time spent on journal entry", before: "5-10 min/trade (manual)", after: "0 min (fully automated)", methodology: "Zero manual input required. At 3-5 trades/day, this saves 15-50 min/day previously spent on manual journaling or (more commonly) skipped entirely." },
      { metric: "Pattern detection speed", before: "Weeks-months (manual review)", after: "Real-time (AI analysis)", methodology: "AI review engine processes complete journal data continuously. Patterns identified within days of reaching 50-trade threshold, vs. months of manual spreadsheet review." },
    ],
    investorNote: "Journaling creates the deepest data moat in the entire platform. Every auto-captured trade with 18 context data points becomes training data for the personal AI Copilot. After 6 months, each user's AI is uniquely calibrated to their trading patterns, biases, and strengths. This personal data moat makes Archio irreplaceable -- the AI gets smarter the longer you use it, creating the compounding flywheel that drives 65%+ Month-12 retention.",
  },
  "pillar-account": {
    icon: Wallet, name: "Account & Risk", color: "#10b981",
    tagline: "Every account, every broker, every prop firm challenge -- one unified dashboard with real-time risk monitoring. This is the sticky infrastructure layer.",
    marketContext: "Account management infrastructure is embedded in broker platforms ($4.8B execution market) but no standalone tool provides cross-broker unified views. The prop firm industry ($2.5B+ in evaluation fees, 1,200+ firms, 3M+ evaluating traders) creates urgent demand for multi-account management with rule compliance tracking. This is the highest-stickiness category: once broker accounts are connected, switching cost is near-infinite.",
    painPoints: [
      { problem: "Fragmented multi-broker account management", impact: "Traders with 2-5 accounts across brokers must log into separate portals. No unified view of total equity, aggregate P&L, or net exposure.", currentSolution: "Individual broker portals, each with separate login, different UI, different reporting format, and no cross-account analytics", costOfInaction: "A trader long EURUSD on Broker A and short on Broker B may not realize they have zero net exposure. Without unified view, risk management is guesswork." },
      { problem: "Prop firm chaos (3-8 simultaneous accounts)", impact: "Funded traders manage multiple challenge/funded accounts, each with different rules, drawdown limits, and profit targets. Manual tracking causes rule violations.", currentSolution: "Spreadsheet tracking each account's rules, current P&L, remaining drawdown, payout schedule. Updated manually. Error rate: high.", costOfInaction: "8-12% of funded account losses are caused by rule violations (exceeding daily loss limit, trading during news). Each violated account represents $200-2,000+ in lost evaluation fees." },
      { problem: "No real-time correlated risk detection", impact: "Without aggregated position data, traders unknowingly build concentrated directional exposure. Correlated losses across accounts can be catastrophic.", currentSolution: "Mental arithmetic across multiple browser tabs. No systematic correlation analysis. No automated alerts.", costOfInaction: "Correlated position blowups account for an estimated 15-20% of catastrophic loss events where traders lose >10% of total equity across all accounts simultaneously." },
    ],
    archioSolution: [
      { feature: "Multi-Broker Unified Dashboard", detail: "Connect all broker accounts through API. Total equity, aggregate P&L, combined position exposure, and net directional bias displayed in one view with real-time updates.", howItWorks: "OAuth and API-key broker connections. Real-time position and balance polling from 15+ supported brokers. Normalization engine converts different broker reporting formats into unified schema.", techDetail: "Broker adapter layer abstracts differences in API formats (FIX, REST, WebSocket). Balance polling every 5 seconds. Position reconciliation handles partial fills, swaps, and broker-specific reporting quirks." },
      { feature: "Prop Firm Rule Compliance Monitor", detail: "Track all challenge and funded accounts with visual drawdown gauges, profit target progress bars, and automatic alerts at 70%, 85%, and 95% of rule limits.", howItWorks: "Rule engine pre-configured for 50+ prop firms with firm-specific parameters: max daily loss, max total drawdown, profit target, minimum trading days, news trading restrictions, lot size limits.", techDetail: "Alert cascade: 70% = yellow notification, 85% = orange warning with trading style suggestion, 95% = red critical alert with optional auto-trade disable. Reduces rule violations from 8-12% to <1%." },
      { feature: "Correlated Risk Detection", detail: "Monitors positions across all accounts. Detects when combined exposure creates unintended directional risk. Alerts on correlated positions, over-concentration, and net exposure above thresholds.", howItWorks: "Cross-account position aggregation with 28-pair correlation matrix. Real-time net exposure calculation by currency. Alerts when aggregate risk exceeds user-defined thresholds.", techDetail: "Correlation matrix updated daily from 5-year rolling data. Position aggregation handles different lot size conventions across brokers. Net exposure shown in base currency with configurable alert thresholds." },
      { feature: "Funding & Payout Tracking Hub", detail: "Unified view of all deposits, withdrawals, and payout schedules. Performance fee calculations, profit split tracking, and tax-relevant event logging.", howItWorks: "Transaction aggregation from broker APIs. Categorization engine for deposits, withdrawals, fees, commissions, swaps, and payouts. Exportable reports for tax preparation and financial planning.", techDetail: "Multi-currency transaction normalization. Automatic tax category classification (capital gains, fees, commissions). CSV/PDF/JSON export with configurable date ranges and account filters." },
    ],
    techSpecs: [
      { label: "Supported brokers", value: "15+ (API-connected)" },
      { label: "Prop firm presets", value: "50+ firms pre-configured" },
      { label: "Balance update latency", value: "<5 seconds" },
      { label: "Risk alert levels", value: "3 (70/85/95%)" },
      { label: "Correlation pairs tracked", value: "28 major" },
      { label: "Export formats", value: "CSV, PDF, JSON" },
      { label: "Multi-currency support", value: "Full normalization" },
      { label: "Historical transaction storage", value: "Unlimited" },
    ],
    replaces: [
      { tool: "Individual Broker Portals", limitation: "Separate logins. Different UIs. No cross-account view. No aggregate risk monitoring. No prop firm tracking.", marketShare: "15+ major brokers, each with proprietary portal" },
      { tool: "Prop Firm Dashboards", limitation: "Each firm has own portal with different UI. No unified tracking. No rule compliance alerts. No cross-firm analytics.", marketShare: "1,200+ firms, each with separate dashboard" },
      { tool: "Spreadsheet Tracking", limitation: "Manual updates. Formula errors. No real-time data. Breaks after 3-4 accounts. Not mobile-accessible.", marketShare: "Universal usage, no revenue" },
      { tool: "MyFXBook (Free)", limitation: "Analytics only. No risk monitoring. No prop firm support. No execution integration. Delayed data.", marketShare: "2M+ accounts tracked" },
    ],
    impactMetrics: [
      { metric: "Daily account review time", before: "15-20 min (multiple logins)", after: "30 seconds (unified view)", methodology: "Single dashboard replaces 2-5 separate broker portal logins. All balances, positions, and P&L visible in one screen." },
      { metric: "Prop firm rule violations", before: "8-12% of funded accounts", after: "<1% with real-time alerts", methodology: "Three-tier alert system (70/85/95%) catches approaching limits before violation occurs. Optional auto-trade-disable at critical thresholds." },
      { metric: "Undetected correlated risk events", before: "Common (no cross-account view)", after: "Real-time detection + alert", methodology: "28-pair correlation matrix continuously monitors aggregate exposure across all connected accounts." },
      { metric: "Tax/reporting preparation", before: "2-4 hours/month manual", after: "1-click export", methodology: "Automated transaction categorization and report generation. Multi-format export (CSV, PDF, JSON) with configurable parameters." },
    ],
    investorNote: "Account & Risk is the highest-stickiness pillar. Once a trader connects broker accounts and configures prop firm rules, the switching cost is near-infinite: they would need to re-connect every account, re-configure every rule, and lose all historical data. Beta data shows 95%+ monthly retention among users who connect 2+ broker accounts. This is the infrastructure layer that makes churn nearly impossible.",
  },
  "pillar-news": {
    icon: Newspaper, name: "News & Events", color: "#ef4444",
    tagline: "Macro intelligence woven into your workflow -- not isolated in another browser tab. This is the daily engagement driver.",
    marketContext: "Market intelligence and news ($2.1B market) is dominated by institutional products (Bloomberg $25K/yr, Refinitiv $22K/yr) and ad-supported free tools (ForexFactory, Investing.com). No product provides AI-interpreted, personalized, contextual macro intelligence at retail price points ($19-99/mo). The gap between institutional-grade intelligence and retail-accessible pricing is where Archio operates.",
    painPoints: [
      { problem: "News exists in complete isolation from trading workflow", impact: "Economic events and news have zero connection to the trader's chart, journal, or execution. Every piece of macro information requires manual mental synthesis.", currentSolution: "ForexFactory in one tab, TradingView in another, Twitter in a third. Context switching between 3+ information sources before every decision.", costOfInaction: "Traders who skip news check (30%+) are blindsided by high-impact events. Traders who check news manually lose 20-30 minutes per session to multi-tab research." },
      { problem: "Information overload without relevance filtering", impact: "Hundreds of news items daily. Without intelligent filtering, important signals are buried in noise. Traders either check everything (time waste) or nothing (risk).", currentSolution: "Scroll through ForexFactory calendar, scan Twitter timeline, check 3-4 news sites. No personalization. No relevance scoring. No AI interpretation.", costOfInaction: "15-20% of high-impact economic events are missed by traders who rely on manual checking. Each missed event can cause unexpected losses on open positions." },
      { problem: "No AI interpretation of macro events", impact: "Raw news and calendar data require expertise to interpret. New traders do not know that a hawkish ECB statement is bullish for EUR. Veterans lose time doing analysis that AI could provide instantly.", currentSolution: "Experience-based interpretation. YouTube explainers (delayed). Twitter opinions (unreliable). No personalized, instant AI analysis.", costOfInaction: "Misinterpretation of macro events is a leading cause of losses during high-impact news releases. AI interpretation with historical context would prevent an estimated 40-60% of news-related trading mistakes." },
    ],
    archioSolution: [
      { feature: "AI Daily & Pre-Session Briefings", detail: "AI-generated briefings summarizing the 3-5 most important macro themes affecting your specific watchlist. Includes key price levels to watch, expected volatility ranges, and suggested risk adjustments.", howItWorks: "LLM synthesis of overnight news, economic releases, central bank communications, and technical levels. Personalized to user's watchlist, trading style, and time zone. Generated in <30 seconds.", techDetail: "Custom prompt chain: (1) aggregate overnight events, (2) filter by user watchlist relevance, (3) rank by expected market impact, (4) generate narrative with specific price levels, (5) include historical context for similar events." },
      { feature: "Smart Economic Calendar", detail: "Economic events with AI-generated impact previews, historical volatility data (50,000+ past events), automatic chart annotations when events approach, and suggested risk adjustments.", howItWorks: "Historical database: 50,000+ economic events with measured market reactions (pip movement, duration, direction). AI previews combine historical patterns with current market context for forward-looking impact estimates.", techDetail: "Event database covers 2010-2024 with pip-level market reactions for 28 major pairs. AI preview compares current consensus vs. previous reading, market positioning, and historical reaction distribution to generate probabilistic impact range." },
      { feature: "Multi-Source Sentiment Dashboard", detail: "Real-time aggregation: retail positioning (broker data), social sentiment (Twitter/Reddit/Discord NLP), institutional flow indicators (COT data, options skew). Composite score: -100 to +100 per pair.", howItWorks: "Multi-source ingestion: broker API positioning data (real-time), NLP of 50,000+ social posts/day (5-minute batches), institutional flow from CFTC COT reports (weekly) and options market data (daily).", techDetail: "Sentiment scoring model: retail positioning (40% weight), social NLP sentiment (30%), institutional flow (30%). Historical calibration shows composite scores > +60 or < -60 have 72% directional accuracy over 5-day horizons." },
      { feature: "Contextual Chart Annotations", detail: "Upcoming economic events and high-impact news automatically annotated on your charts at the relevant time. No need to check a separate calendar -- the information comes to you.", howItWorks: "Calendar events matched to chart timeframe. Annotations appear 30 minutes before event time with event name, expected impact, and consensus vs. previous reading. Annotations are clickable for full AI analysis.", techDetail: "Annotation engine processes user's active chart pairs against upcoming calendar events. Priority scoring ensures only relevant, high-impact events are annotated (avoiding chart clutter). User-configurable impact threshold." },
    ],
    techSpecs: [
      { label: "News sources monitored", value: "200+" },
      { label: "Articles processed daily", value: "10,000+" },
      { label: "Sentiment data points/day", value: "50,000+" },
      { label: "Historical event database", value: "50,000+ events" },
      { label: "Briefing generation time", value: "<30 seconds" },
      { label: "Relevance filtering accuracy", value: "92%+" },
      { label: "Sentiment directional accuracy", value: "72% (5-day)" },
      { label: "Chart annotation lead time", value: "30 min pre-event" },
    ],
    replaces: [
      { tool: "ForexFactory (Free)", limitation: "Calendar only. No AI analysis. No chart integration. No personalization. No sentiment. Ad-heavy.", marketShare: "5M+ monthly visitors" },
      { tool: "Twitter/X (Free)", limitation: "Extreme noise-to-signal. No verification. No filtering. No workflow integration. Algorithmically optimized for engagement, not accuracy.", marketShare: "500M+ users (general)" },
      { tool: "Bloomberg Terminal ($25K/yr)", limitation: "Institutional product. $300K+/year per seat. No retail workflow. No AI copilot. No community integration.", marketShare: "325K terminals, $11B+ revenue" },
      { tool: "Investing.com (Free)", limitation: "Generic feed. No personalization. No AI interpretation. Ad-heavy. No workflow integration.", marketShare: "100M+ monthly visitors" },
    ],
    impactMetrics: [
      { metric: "Pre-session research time", before: "20-30 min (multi-tab)", after: "2-3 min (AI briefing)", methodology: "AI briefing synthesizes overnight events, calendar, and sentiment into personalized 2-minute read. Eliminates 3-5 tab manual research workflow." },
      { metric: "High-impact events missed", before: "15-20% (manual checking)", after: "<2% (auto-alerts + annotations)", methodology: "Calendar alerts + chart annotations ensure traders are aware of approaching events. Auto-risk adjustment suggestions prevent blindside losses." },
      { metric: "News interpretation accuracy", before: "Variable (experience-dependent)", after: "AI-calibrated (historical data)", methodology: "AI analysis includes historical reaction data for similar events. New traders receive institutional-grade interpretation at retail pricing." },
      { metric: "Sentiment data sources", before: "1-2 (manual check)", after: "200+ (auto-aggregated)", methodology: "Multi-source sentiment aggregation: broker positioning, social NLP, institutional flow. Composite score replaces gut-feeling sentiment assessment." },
    ],
    investorNote: "News & Events is the daily engagement driver and the habit loop creator. AI briefings create a morning ritual: check Archio first, then trade. This daily active usage pattern is critical for retention metrics (DAU/MAU ratio) and creates the surface area for premium feature upselling. Users who read AI briefings daily have 40% higher retention at Month 6 than users who skip them.",
  },
}

function SlidePillarDeepDive({ pillarKey, accent }: { pillarKey: string; accent: string }) {
  const data = PILLAR_DATA[pillarKey]
  if (!data) return null
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null)
  const [showMarket, setShowMarket] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 rounded-xl p-3" style={{ background: `${data.color}04`, border: `1px solid ${data.color}10` }}>
        <data.icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `${data.color}60` }} />
        <div className="flex-1">
          <p className="text-[10px] font-semibold leading-relaxed" style={{ color: `${data.color}80` }}>{data.tagline}</p>
          <button onClick={() => setShowMarket(!showMarket)} className="text-[7px] font-mono mt-1 underline opacity-50 hover:opacity-100 transition-opacity" style={{ color: `${data.color}40` }}>{showMarket ? "Hide market context" : "Show market context"}</button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showMarket && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-lg p-3 mb-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-[7px] uppercase tracking-wider font-bold mb-1" style={{ color: `${data.color}25` }}>Market Context</div>
              <p className="text-[9px] text-zinc-500 leading-relaxed">{data.marketContext}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(239,68,68,0.06)" }}>
          <div className="px-3 py-1.5" style={{ background: "rgba(239,68,68,0.03)", borderBottom: "1px solid rgba(239,68,68,0.05)" }}>
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(239,68,68,0.5)" }}>Pain Points + Cost of Inaction</span>
          </div>
          <div className="flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>
            {data.painPoints.map((pp, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-2.5 group/pp cursor-default" style={{ background: "rgba(8,14,26,0.9)" }}>
                <div className="text-[9px] font-semibold text-zinc-300 mb-0.5">{pp.problem}</div>
                <div className="text-[8px] text-zinc-600 leading-relaxed">{pp.impact}</div>
                <div className="text-[7px] leading-relaxed mt-1 max-h-0 group-hover/pp:max-h-20 overflow-hidden transition-all duration-300" style={{ color: "rgba(239,68,68,0.35)" }}>{pp.costOfInaction}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${data.color}08` }}>
          <div className="px-3 py-1.5" style={{ background: `${data.color}03`, borderBottom: `1px solid ${data.color}06` }}>
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: `${data.color}50` }}>Archio Solution + Technical Detail</span>
          </div>
          <div className="flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>
            {data.archioSolution.map((sol, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <button onClick={() => setExpandedSolution(expandedSolution === i ? null : i)} className="w-full text-left p-2.5 outline-none transition-colors" style={{ background: expandedSolution === i ? `${data.color}04` : "#080A10" }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: `${data.color}50` }} />
                    <span className="text-[9px] font-semibold text-zinc-300">{sol.feature}</span>
                  </div>
                  <div className="text-[8px] text-zinc-600 leading-relaxed ml-4.5 line-clamp-2">{sol.detail}</div>
                </button>
                <AnimatePresence>
                  {expandedSolution === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="px-3 pb-2.5 pt-0.5 ml-4 flex flex-col gap-1.5">
                        <div><div className="text-[6px] uppercase tracking-wider font-bold mb-0.5" style={{ color: `${data.color}25` }}>How It Works</div><p className="text-[8px] leading-relaxed" style={{ color: `${data.color}45` }}>{sol.howItWorks}</p></div>
                        <div><div className="text-[6px] uppercase tracking-wider font-bold mb-0.5" style={{ color: `${data.color}25` }}>Technical Detail</div><p className="text-[8px] leading-relaxed" style={{ color: `${data.color}35` }}>{sol.techDetail}</p></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-[6px] uppercase tracking-wider font-bold mb-1.5" style={{ color: `${data.color}22` }}>Tech Specs</div>
          <div className="flex flex-col gap-1">{data.techSpecs.map((s, i) => <div key={i} className="flex items-center justify-between"><span className="text-[7px] text-zinc-600">{s.label}</span><span className="text-[8px] font-bold font-mono text-white">{s.value}</span></div>)}</div>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: `${data.color}02`, border: `1px solid ${data.color}06` }}>
          <div className="text-[6px] uppercase tracking-wider font-bold mb-1.5" style={{ color: `${data.color}22` }}>Impact Metrics</div>
          <div className="flex flex-col gap-1">{data.impactMetrics.map((m, i) => <div key={i} className="group/im cursor-default"><div className="flex items-center gap-1.5"><span className="text-[8px] font-mono line-through" style={{ color: "rgba(239,68,68,0.3)" }}>{m.before}</span><ArrowRight className="w-2 h-2 text-zinc-800" /><span className="text-[8px] font-bold font-mono" style={{ color: `${data.color}70` }}>{m.after}</span></div><div className="text-[6px] text-zinc-700 mb-0.5">{m.metric}</div></div>)}</div>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: "rgba(239,68,68,0.02)", border: "1px solid rgba(239,68,68,0.04)" }}>
          <div className="text-[6px] uppercase tracking-wider font-bold mb-1.5" style={{ color: "rgba(239,68,68,0.22)" }}>Replaces</div>
          <div className="flex flex-col gap-1">{data.replaces.map((r, i) => <div key={i} className="group/r cursor-default"><div className="flex items-center gap-1"><X className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "rgba(239,68,68,0.25)" }} /><span className="text-[8px] font-semibold text-zinc-400">{r.tool}</span></div><div className="text-[6px] text-zinc-700 ml-3.5">{r.marketShare}</div></div>)}</div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-xl p-3" style={{ background: `${accent}03`, border: `1px solid ${accent}08` }}>
        <div className="flex items-start gap-2">
          <Diamond className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: `${accent}40` }} />
          <div><div className="text-[7px] uppercase tracking-wider font-bold mb-0.5" style={{ color: `${accent}28` }}>Investor Note</div><p className="text-[9px] leading-relaxed" style={{ color: `${accent}60` }}>{data.investorNote}</p></div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 10: WORKFLOW UNIFICATION
   ═══════════════════════════════════════════════════════════════════ */

function SlideWorkflow({ accent }: { accent: string }) {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const workflow = [
    { step: 1, pillar: "News & Events", icon: Newspaper, color: "#ef4444", action: "Morning: AI briefing identifies 3 key themes for your watchlist. ECB rate decision today, USD sentiment shifting bearish, GBP CPI data overnight was hotter than expected.", output: "Macro awareness + risk adjustment suggestions", dataFlow: ["AI Briefing", "Calendar Alerts", "Sentiment Score", "Chart Annotations", "Historical Event Data"], timesSaved: "20 min" },
    { step: 2, pillar: "Intelligence Engine", icon: Brain, color: "#8b5cf6", action: "AI Forecast: EURUSD bearish bias (72% confidence). Technical confluence at 1.2720 resistance + descending channel + ECB event risk. Copilot explains reasoning chain.", output: "Directional hypothesis + confluence score (8/10)", dataFlow: ["4-Model Ensemble", "Technical Analysis", "Fundamental Context", "Pattern Database", "Confluence Score"], timesSaved: "15 min" },
    { step: 3, pillar: "Community & Trust", icon: Users, color: "#5865f2", action: "Check verified mentors: 3 mentors also bearish EURUSD with 1.2680 target. Combined verified win rate: 64%. Inspector Modal shows full trade-by-trade history.", output: "Social confluence + verified signal", dataFlow: ["Mentor Signals", "Verified Records", "Signal Accuracy", "Community Consensus", "Trust Scores"], timesSaved: "5 min" },
    { step: 4, pillar: "Execution Layer", icon: Zap, color: "#f97316", action: "Pre-trade checklist: 8/8 passed. Click chart level 1.2720. Auto-populated: Sell EURUSD, SL 1.2755, TP 1.2680, 0.5 lots (1.2% risk). One click to execute. Psychology check-in: calm, focused.", output: "Executed trade + auto-captured context", dataFlow: ["Checklist Score", "Position Size", "Risk Calculation", "Psychology State", "Order Parameters"], timesSaved: "5 min" },
    { step: 5, pillar: "Account & Risk", icon: Wallet, color: "#10b981", action: "Risk monitor: total exposure 1.2% across all accounts. No correlated positions detected. Prop firm A: 78% of daily loss limit remaining. All rules compliant.", output: "Risk validation + compliance confirmation", dataFlow: ["Multi-Account View", "Correlation Matrix", "Prop Firm Rules", "Exposure Limits", "Alert Status"], timesSaved: "5 min" },
    { step: 6, pillar: "Journaling & Review", icon: BookOpen, color: "#06b6d4", action: "Trade auto-logged: chart screenshot, entry reasoning (checklist), market conditions (ECB day), mentor signal attribution, emotional state (4/5 focus, 3/5 confidence). 18 data points captured.", output: "Complete context preserved for AI review", dataFlow: ["Chart Screenshot", "Decision Log", "Market Context", "Psychology Score", "Signal Attribution"], timesSaved: "8 min" },
  ]

  const totals = [
    { label: "Automated data handoffs", value: "23", detail: "Each step passes structured data to the next. Zero manual re-entry. Zero copy-paste. Zero context loss." },
    { label: "Context data points/trade", value: "18", detail: "Chart, reasoning, checklist, conditions, emotion, signal source -- all auto-captured at moment of execution." },
    { label: "Time saved per trade cycle", value: "58 min", detail: "Fragmented workflow: 58+ min per full cycle (research + execute + journal). Unified: 5-8 min total." },
    { label: "Decision quality multiplier", value: "2.3x", detail: "Trades with full confluence + completed checklist + verified signal outperform impulsive trades by 2.3x average." },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {workflow.map((w, i) => {
          const isActive = activeStep === i
          return (
            <motion.div key={w.step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <button onClick={() => setActiveStep(isActive ? null : i)} className="w-full text-left rounded-xl px-3.5 py-2.5 transition-all duration-300 outline-none" style={{ background: isActive ? `${w.color}05` : "rgba(255,255,255,0.03)", border: `1px solid ${isActive ? `${w.color}12` : "rgba(255,255,255,0.02)"}` }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold font-mono" style={{ background: `${w.color}08`, color: `${w.color}70`, border: `1px solid ${w.color}15` }}>{w.step}</div>
                    <w.icon className="w-3.5 h-3.5" style={{ color: isActive ? `${w.color}80` : `${w.color}30` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[10px] font-bold" style={{ color: isActive ? w.color : "rgba(255,255,255,0.7)" }}>{w.pillar}</span><span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${w.color}06`, color: `${w.color}35` }}>-{w.timesSaved}</span></div>
                    <div className="text-[8px] text-zinc-500 leading-relaxed">{w.action}</div>
                  </div>
                </div>
              </button>
              <AnimatePresence>
                {isActive && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="px-3.5 pb-2.5 pt-1 ml-8">
                      <div className="text-[7px] uppercase tracking-wider font-bold mb-1" style={{ color: `${w.color}25` }}>Data Flow ({w.dataFlow.length} signals)</div>
                      <div className="flex items-center gap-1.5 flex-wrap">{w.dataFlow.map((d, di) => <span key={di} className="text-[7px] px-1.5 py-0.5 rounded font-mono" style={{ background: `${w.color}06`, border: `1px solid ${w.color}10`, color: `${w.color}50` }}>{d}</span>)}</div>
                      <div className="mt-1.5 text-[8px]" style={{ color: `${w.color}40` }}><span className="font-semibold">Output:</span> {w.output}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {i < workflow.length - 1 && <div className="flex items-center ml-7 h-2"><div className="w-px h-full" style={{ background: `linear-gradient(${w.color}15, ${workflow[i + 1].color}15)` }} /></div>}
            </motion.div>
          )
        })}
      </div>
      <div className="grid grid-cols-4 gap-2">{totals.map((t, i) => <motion.div key={t.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="rounded-xl p-2.5 text-center group/t cursor-default" style={{ background: `${accent}03`, border: `1px solid ${accent}06` }}><div className="text-lg font-black font-mono text-white">{t.value}</div><div className="text-[6px] font-semibold uppercase tracking-wider" style={{ color: `${accent}35` }}>{t.label}</div><div className="text-[7px] text-zinc-700 mt-0.5 opacity-0 group-hover/t:opacity-100 transition-opacity">{t.detail}</div></motion.div>)}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 11: TECHNICAL ARCHITECTURE
   ═══════════════════════════════════════════════════════════════════ */

function SlideTechArchitecture({ accent }: { accent: string }) {
  const layers = [
    { name: "Presentation Layer", color: "#8b5cf6", tech: "Next.js 15 + React 19 + TailwindCSS", components: "200+ components across 6 pillar UIs", detail: "Server-side rendering for performance. Client-side interactivity for real-time data. Responsive from mobile (375px) to ultrawide (3440px). Accessibility-first (WCAG 2.1 AA)." },
    { name: "API & Gateway Layer", color: "#06b6d4", tech: "GraphQL + WebSocket + REST APIs", components: "45 API endpoints, 12 WebSocket channels", detail: "GraphQL for flexible data fetching. WebSocket for real-time price streams and alerts. REST for broker integrations. Rate limiting, authentication, and caching at edge." },
    { name: "AI & Intelligence Layer", color: "#f97316", tech: "4 ML models + RAG pipeline + NLP engine", components: "48 AI components, 10K+ articles/day", detail: "Multi-model ensemble for forecasting. RAG architecture for personalized copilot. Custom NLP for financial text classification (92%+ accuracy). Vector database for semantic search across user history." },
    { name: "Data & Storage Layer", color: "#10b981", tech: "PostgreSQL + Redis + S3 + Vector DB", components: "25 tables, 50M+ rows, <50ms queries", detail: "PostgreSQL for transactional data. Redis for real-time caching and session management. S3 for chart screenshots and media. Pinecone/Weaviate for vector embeddings." },
    { name: "Integration Layer", color: "#ef4444", tech: "15+ broker APIs + 200 news sources", components: "Broker adapters, news ingestion, sentiment", detail: "Abstraction layer normalizing 15+ broker API formats (FIX, REST, WebSocket). News aggregation pipeline processing 10,000+ articles daily. Sentiment scoring from 50,000+ social posts." },
    { name: "Infrastructure Layer", color: "#a855f7", tech: "Vercel + AWS + CloudFlare", components: "Global CDN, auto-scaling, 99.9% uptime", detail: "Edge deployment on Vercel. GPU compute on AWS for AI inference. CloudFlare for DDoS protection and global caching. Automated CI/CD with preview deployments." },
  ]

  return (
    <div className="flex flex-col gap-2">
      {layers.map((l, i) => (
        <motion.div key={l.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl p-3.5 group/layer cursor-default" style={{ background: `${l.color}03`, border: `1px solid ${l.color}08` }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span className="text-[11px] font-bold text-white">{l.name}</span>
            </div>
            <span className="text-[8px] font-mono" style={{ color: `${l.color}45` }}>{l.tech}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-zinc-500">{l.components}</span>
          </div>
          <p className="text-[8px] text-zinc-600 leading-relaxed mt-1.5 opacity-0 group-hover/layer:opacity-100 transition-opacity duration-300">{l.detail}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 12: COMPETITIVE MOATS
   ═══════════════════════════════════════════════════════════════════ */

function SlideCompetitive({ accent }: { accent: string }) {
  const moats = [
    { title: "Workflow Moat (Systemic)", strength: "Very Strong", replication: "3-5 years", color: accent, desc: "23 automated data handoffs between 6 pillars create a unified system that no collection of standalone tools can replicate. TradingView adding community is not the same as community that sees your chart annotations, journal patterns, and AI forecasts simultaneously. The value is in the connections, not the features.", evidence: "Figma vs. Sketch+InVision+Zeplin: Figma won not because of better features, but because one connected tool eliminates the friction between design, prototyping, and handoff. Same dynamic applies." },
    { title: "Data Moat (Compounding)", strength: "Strong", replication: "2-3 years", color: "#8b5cf6", desc: "Every trade auto-logged with 18 context data points. Every AI interaction generates training data. Every community signal builds the trust graph. After 6 months, Archio knows more about a trader's patterns, biases, and strengths than any standalone tool ever could.", evidence: "Netflix's recommendation engine improves with every view. Archio's Copilot improves with every trade. The personal data moat means a Day-1 user and a Month-6 user have fundamentally different experiences." },
    { title: "Network Effect (Community)", strength: "Strong", replication: "2-4 years", color: "#5865f2", desc: "Verified mentors attract students. Students become traders. Traders generate data. Data improves AI. Better AI attracts more traders. The community trust infrastructure creates a self-reinforcing growth loop.", evidence: "GitHub's network effect: more developers -> more repos -> more utility -> more developers. Archio: more verified mentors -> more students -> more traders -> more data -> better AI -> more traders." },
    { title: "Switching Cost (Integration)", strength: "Very Strong", replication: "Ongoing", color: "#f97316", desc: "Connected broker accounts + journal history + mentor follows + AI Copilot calibration + prop firm configurations. The switching cost to go back to 8 disconnected tools is enormous and increases every month.", evidence: "Salesforce's switching cost: data + workflows + integrations. Archio's: broker connections + 6 months of auto-journaled trade history + personally calibrated AI + configured prop firm rules." },
  ]

  const incumbents = [
    { name: "TradingView", reason: "Charting company. Business model (freemium + ads + data licensing) conflicts with premium workflow subscriptions. Adding execution, verification, journaling, and AI copilot = rebuilding entire product.", category: "Charting", revenue: "$400M+ ARR" },
    { name: "MetaTrader", reason: "2003 architecture. MetaQuotes licenses to brokers -- does not own user relationship. Adding modern UI, AI, community, and journaling = complete platform rewrite. Broker dependencies prevent innovation.", category: "Execution", revenue: "$200M+ licensing" },
    { name: "Discord", reason: "General-purpose chat with no concept of trade verification, chart context, or performance analytics. Would need to build entire fintech platform on messaging infrastructure. Not in their strategic roadmap.", category: "Community", revenue: "$600M+ (general)" },
    { name: "TradeZella", reason: "Journaling niche ($15M ARR). No charting, execution, community, AI, or news. Would need to 10x product scope while competing against users' existing tool stacks. Insufficient capital for transformation.", category: "Journaling", revenue: "~$15M ARR" },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">{moats.map((m, i) => (
        <motion.div key={m.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl p-3.5 group/moat cursor-default" style={{ background: `${m.color}03`, border: `1px solid ${m.color}08` }}>
          <div className="flex items-center justify-between mb-1.5"><span className="text-[10px] font-bold text-white">{m.title}</span><div className="flex items-center gap-1.5"><span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${m.color}08`, color: `${m.color}60` }}>{m.strength}</span><span className="text-[7px] font-mono" style={{ color: `${m.color}30` }}>{m.replication}</span></div></div>
          <p className="text-[9px] text-zinc-500 leading-relaxed mb-1.5">{m.desc}</p>
          <p className="text-[8px] leading-relaxed opacity-0 group-hover/moat:opacity-100 transition-opacity" style={{ color: `${m.color}40` }}>{m.evidence}</p>
        </motion.div>
      ))}</div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="px-3 py-1.5" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.02)" }}><span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.5)" }}>{"Why Incumbents Can't Replicate This"}</span></div>
        <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>{incumbents.map((inc, i) => (
          <motion.div key={inc.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 }} className="p-3" style={{ background: "rgba(8,14,26,0.9)" }}>
            <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><X className="w-3 h-3" style={{ color: "rgba(239,68,68,0.35)" }} /><span className="text-[10px] font-bold text-zinc-300">{inc.name}</span><span className="text-[7px] px-1 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.02)", color: "rgba(148,163,184,0.45)" }}>{inc.category}</span></div><span className="text-[7px] font-mono text-zinc-700">{inc.revenue}</span></div>
            <p className="text-[8px] text-zinc-600 leading-relaxed">{inc.reason}</p>
          </motion.div>
        ))}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 13: IMPACT METRICS
   ═══════════════════════════════════════════════════════════════════ */

function SlideImpact({ accent }: { accent: string }) {
  const userMetrics = [
    { category: "Time Efficiency", metrics: [
      { metric: "Daily time saved per trader", value: "45-60 min", detail: "Elimination of app-switching (25 min), manual data entry (10 min), context reconstruction (10 min), and calendar checking (10 min)." },
      { metric: "Pre-trade analysis time", value: "25 min -> 3 min", detail: "AI briefings + confluence scanner + contextual news replace manual 5-tab research. 88% time reduction." },
      { metric: "Trade journaling time", value: "5-10 min -> 0 min", detail: "Auto-capture engine records 18 data points. Zero manual input. Completion rate: 100% (architectural guarantee)." },
      { metric: "Account review time", value: "15 min -> 30 sec", detail: "Multi-broker unified dashboard. One screen for all accounts. Real-time updates. No portal-hopping." },
    ]},
    { category: "Performance Improvement", metrics: [
      { metric: "Trades with full pre-checklist", value: "5% -> 100%", detail: "System-enforced checklist. Order button disabled until completion. Eliminates 40-60% of impulsive losing trades." },
      { metric: "Journal completion rate", value: "30-40% -> 100%", detail: "Architectural guarantee from auto-capture. 18 data points per trade without any manual effort." },
      { metric: "Signal execution accuracy", value: "+2.3x improvement", detail: "One-click pipeline eliminates re-entry errors, reduces slippage from delayed execution, and ensures exact parameter matching." },
      { metric: "Prop firm rule compliance", value: "88% -> 99%+", detail: "Real-time 3-tier alerts (70/85/95%) + optional auto-disable. Prevents accidental violations that cost $200-2K each." },
    ]},
  ]

  const businessMetrics = [
    { label: "Month-1 Retention", value: "85%+", bench: "Industry: 40-50%", reason: "Broker connection + auto-journaling creates immediate switching cost. Users who connect a broker in Week 1 retain at 92%." },
    { label: "Month-12 Retention", value: "65%+", bench: "Industry: 15-25%", reason: "Personal AI Copilot becomes more valuable with every trade. After 6 months, the data moat makes leaving impossible." },
    { label: "Net Revenue Retention", value: "130%+", bench: "Best SaaS: 120%", reason: "Users upgrade Basic->Pro->Institutional. Marketplace + intelligence features add expansion revenue. Negative net churn." },
    { label: "CAC Payback", value: "<4 months", bench: "Industry: 12-18 mo", reason: "Community-driven viral acquisition (mentors bring students). Signal pipeline drives word-of-mouth. Near-zero CAC for organic." },
    { label: "LTV:CAC Ratio", value: "8:1+", bench: "Good SaaS: 3:1", reason: "High retention (65% M12) x high ARPU ($300/yr) x low CAC (community) = exceptional unit economics." },
    { label: "Gross Margin", value: "82%+", bench: "SaaS median: 72%", reason: "Pure software. AI inference costs offset by high ARPU. No physical goods. No large support team at scale." },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">{userMetrics.map((cat, ci) => (
        <motion.div key={cat.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accent}08` }}>
          <div className="px-3 py-1.5" style={{ background: `${accent}03`, borderBottom: `1px solid ${accent}06` }}><span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: `${accent}45` }}>{cat.category}</span></div>
          <div className="flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>{cat.metrics.map((m, mi) => (
            <div key={mi} className="px-3 py-2 group/im cursor-default" style={{ background: "rgba(8,14,26,0.9)" }}>
              <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-400">{m.metric}</span><span className="text-[10px] font-bold font-mono" style={{ color: `${accent}80` }}>{m.value}</span></div>
              <p className="text-[7px] text-zinc-700 leading-relaxed opacity-0 group-hover/im:opacity-100 transition-opacity">{m.detail}</p>
            </div>
          ))}</div>
        </motion.div>
      ))}</div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="px-3 py-1.5" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.02)" }}><span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.5)" }}>Business Impact (Projected)</span></div>
        <div className="grid grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.01)" }}>{businessMetrics.map((bm, i) => (
          <motion.div key={bm.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.04 }} className="p-3 group/bm cursor-default" style={{ background: "rgba(8,14,26,0.9)" }}>
            <div className="text-lg font-black font-mono text-white mb-0.5">{bm.value}</div>
            <div className="text-[8px] font-semibold text-zinc-400">{bm.label}</div>
            <div className="text-[7px] font-mono" style={{ color: `${accent}25` }}>{bm.bench}</div>
            <p className="text-[7px] text-zinc-700 leading-relaxed mt-1 opacity-0 group-hover/bm:opacity-100 transition-opacity">{bm.reason}</p>
          </motion.div>
        ))}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 14: STRATEGIC SYNTHESIS
   ═══════════════════════════════════════════════════════════════════ */

function SlideSynthesis({ accent }: { accent: string }) {
  const chain = [
    { label: "Market", value: "$14.2B", detail: "The world's largest industry has no unified operating system for 300M+ individual participants. 6 tool categories, all disconnected.", color: "#10b981" },
    { label: "Problem", value: "6+ Apps", detail: "Every trader uses 6+ disconnected tools daily. 45-60 min/day lost to context switching. $800M+ trust deficit. 60-70% of trades never journaled.", color: "#ef4444" },
    { label: "Solution", value: "6 Pillars", detail: "One platform replacing 8+ tools with 49 modules, 48 AI components, and 23 automated data handoffs. Zero app-switching. Zero data silos.", color: accent },
    { label: "Moat", value: "4 Layers", detail: "Workflow moat (systemic) + data moat (compounding) + network effect (community) + switching cost (integration). Each gets stronger with time.", color: "#8b5cf6" },
    { label: "Unit Economics", value: "8:1 LTV:CAC", detail: "85%+ M1 retention, 65%+ M12, 130%+ NRR, <4 month payback. Community-driven acquisition. 82%+ gross margin.", color: "#f97316" },
    { label: "Target", value: "$420M Y5", detail: "1.4M paying users at $300/yr ARPU. 7.2% SAM penetration. Conservative vs. TradingView's 16% penetration achievement.", color: "#06b6d4" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-4" style={{ background: `${accent}03`, border: `1px solid ${accent}10` }}>
        <p className="text-[11px] font-semibold leading-relaxed" style={{ color: `${accent}80` }}>
          {"This slide connects every section of the presentation into one continuous investment thesis: from the $14.2B market gap, through the 6-pillar solution, to the unit economics that make Archio a category-defining opportunity."}
        </p>
      </motion.div>

      <div className="flex flex-col gap-1.5">
        {chain.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: `${c.color}03`, border: `1px solid ${c.color}08` }}>
              <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: `${c.color}08`, border: `1px solid ${c.color}15` }}>
                <span className="text-[8px] font-bold" style={{ color: `${c.color}60` }}>{c.label}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-bold font-mono text-white">{c.value}</span>
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed">{c.detail}</p>
              </div>
            </div>
            {i < chain.length - 1 && <div className="flex items-center ml-7 h-2"><div className="w-px h-full" style={{ background: `linear-gradient(${c.color}12, ${chain[i + 1].color}12)` }} /></div>}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-start gap-2.5">
          <Diamond className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: `${accent}50` }} />
          <div>
            <div className="text-[11px] font-bold text-white mb-1">The Complete Investment Case</div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              {"Archio AI is not entering an existing software category. It is creating one: the first unified trading operating system. The $14.2B market is fragmented across 6 categories with zero cross-category integration. Every precedent -- Figma in design ($20B), HubSpot in marketing ($30B+), GitLab in DevOps ($11B) -- shows that the platform that unifies a fragmented workflow captures category-defining value. Archio is the first to attempt this in the world's largest participant-driven industry, at the exact moment when AI makes cross-domain workflow synthesis technically possible for the first time. The timing is not accidental. It is structural."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN ORCHESTRATOR
   ═════════════════════════════��═════════════════════════════════════ */

export function SolutionArchitectureSlide({ accent }: { accent: string }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = SLIDES.length
  const slide = SLIDES[currentSlide]
  const containerRef = useRef<HTMLDivElement>(null)

  const goNext = useCallback(() => setCurrentSlide(p => Math.min(p + 1, totalSlides - 1)), [totalSlides])
  const goPrev = useCallback(() => setCurrentSlide(p => Math.max(p - 1, 0)), [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowRight") goNext(); if (e.key === "ArrowLeft") goPrev() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [goNext, goPrev])

  function renderSlide() {
    switch (slide.id) {
      case "overview": return <SlideOverview accent={accent} />
      case "before-after": return <SlideBeforeAfter accent={accent} />
      case "six-pillars": return <SlideSixPillars accent={accent} />
      case "pillar-intel": return <SlidePillarDeepDive pillarKey="pillar-intel" accent={accent} />
      case "pillar-exec": return <SlidePillarDeepDive pillarKey="pillar-exec" accent={accent} />
      case "pillar-comm": return <SlidePillarDeepDive pillarKey="pillar-comm" accent={accent} />
      case "pillar-journal": return <SlidePillarDeepDive pillarKey="pillar-journal" accent={accent} />
      case "pillar-account": return <SlidePillarDeepDive pillarKey="pillar-account" accent={accent} />
      case "pillar-news": return <SlidePillarDeepDive pillarKey="pillar-news" accent={accent} />
      default: return null
    }
  }

  return (
    <div ref={containerRef} className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1220 0%, #080e1a 50%, #0a0f18 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-15%", left: "10%", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-10%", right: "-5%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden"><motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ left: "50%", top: "40%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle, ${accent}04, transparent 70%)` }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity }} /></div>

      <div className="relative z-10 px-6 md:px-10 pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} /><span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accent}60` }}>The Solution</span><div className="h-px flex-1 min-w-[40px]" style={{ background: `${accent}12` }} /></div>
          <div className="flex items-center gap-2">
            <button onClick={goPrev} disabled={currentSlide === 0} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-20" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}><ChevronLeft className="w-3.5 h-3.5 text-zinc-400" /></button>
            <span className="text-[9px] font-mono min-w-[48px] text-center" style={{ color: "rgba(148,163,184,0.45)" }}>{currentSlide + 1} / {totalSlides}</span>
            <button onClick={goNext} disabled={currentSlide === totalSlides - 1} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-20" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}><ChevronRight className="w-3.5 h-3.5 text-zinc-400" /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={slide.id + "-title"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight text-balance mb-1">{slide.title}</h2>
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-3xl">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
            {renderSlide()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center gap-1">{SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrentSlide(i)} className="group/dot relative flex-1 h-1 rounded-full transition-all duration-300 cursor-pointer" style={{ background: i === currentSlide ? accent : i < currentSlide ? `${accent}30` : "rgba(255,255,255,0.04)" }} aria-label={`Go to slide ${i + 1}`}>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded text-[7px] font-semibold z-30" style={{ background: "rgba(0,0,0,0.9)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>{s.title.length > 35 ? s.title.slice(0, 35) + "..." : s.title}</div>
          </button>
        ))}</div>

        <div className="mt-3 flex items-center justify-between">
          <button onClick={goPrev} disabled={currentSlide === 0} className="flex items-center gap-1.5 text-[9px] font-semibold transition-all duration-300 disabled:opacity-0" style={{ color: "rgba(148,163,184,0.3)" }}><ChevronLeft className="w-3 h-3" />{currentSlide > 0 && SLIDES[currentSlide - 1].title.slice(0, 30)}</button>
          <div className="text-[8px] font-mono" style={{ color: "rgba(148,163,184,0.12)" }}>Arrow keys or click to navigate</div>
          <button onClick={goNext} disabled={currentSlide === totalSlides - 1} className="flex items-center gap-1.5 text-[9px] font-semibold transition-all duration-300 disabled:opacity-0" style={{ color: "rgba(148,163,184,0.3)" }}>{currentSlide < totalSlides - 1 && SLIDES[currentSlide + 1].title.slice(0, 30)}<ChevronRight className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  )
}
