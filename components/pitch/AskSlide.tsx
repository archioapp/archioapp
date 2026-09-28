"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, ChevronDown, ArrowRight } from "lucide-react"

/* ═══════════════════════════════════════════════════════════
   ASK SLIDE — Investor Action with Real Numbers
   Budget-aligned. Dual-world framing. Detailed milestones.
   ═══════════════════════════════════════════════════════════ */

interface FundsBucket {
  label: string
  phase: string
  amount: string
  pct: number
  color: string
  detail: string
  deliverables: string[]
}

const FUNDS_BUCKETS: FundsBucket[] = [
  {
    label: "Public Site and Landing Pages",
    phase: "Phase 1A",
    amount: "$18K - $22K",
    pct: 13,
    color: "#3b82f6",
    detail: "Full public website with waitlist capture, 6 feature sub-landing pages (one per product pillar), persona-based content sections, SEO infrastructure, and analytics. This is the storefront that converts visitors into waitlist signups and establishes brand credibility for investor conversations.",
    deliverables: ["Live website at archio.ai", "Functional waitlist with referral system", "6 feature sub-pages indexed by search engines", "Persona content for 3 user types", "SEO + analytics infrastructure"],
  },
  {
    label: "Dashboard Polish and AI Features",
    phase: "Phase 1B",
    amount: "$60K - $65K",
    pct: 40,
    color: "#8b5cf6",
    detail: "Systematic elevation of all 12 major product systems from functional to premium. Neural Matrix UX refinement, Execution Copilot flow optimization, Community Discovery polish, unified motion design system, Copilot AI interface enhancement, MRKT Intelligence panel polish, and full responsive + accessibility pass.",
    deliverables: ["Every major system polished to demo-grade", "60fps animations and skeleton loading states", "Keyboard shortcuts for power users", "WCAG 2.1 AA accessibility compliance", "Tablet-responsive layouts", "Unified motion design language"],
  },
  {
    label: "Backend, Live Data, and AI Agents",
    phase: "Phase 2",
    amount: "$40K - $48K",
    pct: 28,
    color: "#10b981",
    detail: "Database expansion (8 new tables with RLS), live market data pipeline (Polygon.io WebSocket), AI forecast generation engine, full AI agent orchestration (8 registered tools for contextual intelligence), community data persistence, trade journal auto-capture with 18 data points per entry, and the shareable ecosystem with cross-module data flow.",
    deliverables: ["17 database tables total (9 existing + 8 new)", "Live market data streaming via WebSocket", "AI forecasts from real models", "Agent orchestration with 8 tool-calling capabilities", "Cross-module event bus for data flow", "Share card generator for social distribution"],
  },
  {
    label: "Shadow World (Admin + Tracking)",
    phase: "Phase 3",
    amount: "$18K - $22K",
    pct: 13,
    color: "#ef4444",
    detail: "The operational intelligence layer invisible to users. Millisecond-precision activity tracking (clicks, keystrokes, mouse paths, scroll events), DOM-mutation session replay engine, full admin dashboard with live user monitoring, behavioral analytics with automated churn prediction and fraud detection, and operator tools for content moderation.",
    deliverables: ["Client-side event capture SDK (3KB)", "Session replay with timeline scrubber", "Admin dashboard (invisible to users)", "Churn prediction model", "Fraud detection (IP + device fingerprinting)", "Automated Slack alerts for key events"],
  },
  {
    label: "Beta Launch and Monetization",
    phase: "Phase 4",
    amount: "$7K - $10K",
    pct: 6,
    color: "#f59e0b",
    detail: "Stripe Checkout with subscription management (Free / Pro $49 / Elite $149), Stripe Connect for mentor revenue share (70/30 split), TradeLocker broker API integration for real order execution, production hardening (rate limiting, error boundaries, security audit), and the controlled beta launch sequence with 100 invited users.",
    deliverables: ["Stripe payments live with 3 tiers", "Mentor payouts via Stripe Connect", "Live broker execution from the platform", "Production security hardening", "100 beta users onboarded", "First MRR recorded"],
  },
]

const MILESTONES = [
  { label: "Investor-demo-ready product with premium UX", when: "Day 45" },
  { label: "Live public website with waitlist capturing signups", when: "Day 40" },
  { label: "AI forecasts generating from real models", when: "Day 75" },
  { label: "Full AI agent orchestration with 8 tool capabilities", when: "Day 80" },
  { label: "Live market data streaming via WebSocket", when: "Day 65" },
  { label: "Shadow World admin dashboard with session replay", when: "Day 95" },
  { label: "Millisecond activity tracking on every user interaction", when: "Day 85" },
  { label: "Stripe payments and mentor payouts live", when: "Day 100" },
  { label: "Broker API connected for real trade execution", when: "Day 110" },
  { label: "100 beta users onboarded with retention tracking", when: "Day 120" },
  { label: "First monthly recurring revenue recorded", when: "Day 120" },
  { label: "Validated unit economics (ARPU, retention, LTV)", when: "Day 150" },
]

export function AskSlide({ accent }: { accent: string }) {
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null)
  const [showMilestones, setShowMilestones] = useState(false)
  const [showTwoWorlds, setShowTwoWorlds] = useState(false)

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "#080A10", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Subtle breathing glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle, ${accent}04, transparent 65%)` }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}90` }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accent}60` }}>The Investment</span>
          <div className="flex-1 h-px" style={{ background: `${accent}12` }} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5 text-balance">The product is built. The path is costed. This is the moment to fund.</h2>
        <p className="text-sm text-zinc-400 mb-5 max-w-3xl">A substantial product base exists. The remaining work is 27 defined engineering tasks across 5 phases, with real budgets and real deliverables. Every dollar maps to a specific outcome.</p>

        {/* Two-column: Stage + Numbers */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Current Stage */}
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-3" style={{ color: "rgba(148,163,184,0.4)" }}>What Exists Today</div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Product Interface", value: "12 Major Systems Built", color: "#10b981" },
                { label: "UI Components", value: "340+ Components", color: "#10b981" },
                { label: "Database", value: "9 Tables with RLS", color: "#10b981" },
                { label: "API Layer", value: "34+ Routes", color: "#10b981" },
                { label: "Authentication", value: "Live with Session Mgmt", color: "#10b981" },
                { label: "Backend Connections", value: "Partial (defined gaps)", color: "#f59e0b" },
                { label: "Operational Intelligence", value: "Not yet built", color: "#ef4444" },
                { label: "Revenue", value: "Pre-Revenue", color: "rgba(148,163,184,0.5)" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-500">{item.label}</span>
                  <span className="text-[9px] font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Numbers */}
          <div className="rounded-xl p-4" style={{ background: `${accent}04`, border: `1px solid ${accent}15` }}>
            <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-3" style={{ color: `${accent}50` }}>Investment Parameters</div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[8px] text-zinc-500 mb-0.5">Total Project Budget</div>
                <div className="text-xl font-black font-mono" style={{ color: accent }}>$145,000 - $160,000</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg px-2.5 py-2" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <div className="text-[7px] text-zinc-500">Frontend Design</div>
                  <div className="text-[11px] font-black font-mono text-blue-400">$80-85K</div>
                </div>
                <div className="rounded-lg px-2.5 py-2" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                  <div className="text-[7px] text-zinc-500">{"Backend + AI + Admin"}</div>
                  <div className="text-[11px] font-black font-mono text-emerald-400">$65-75K</div>
                </div>
              </div>
              {[
                { label: "Raise Amount", placeholder: "Founder to confirm" },
                { label: "Valuation / Terms", placeholder: "Founder to confirm" },
                { label: "Round Type", placeholder: "Pre-seed / Seed" },
              ].map(field => (
                <div key={field.label}>
                  <div className="text-[8px] text-zinc-500 mb-0.5">{field.label}</div>
                  <div className="rounded-lg px-3 py-1.5 text-[10px] font-bold" style={{ background: `${accent}06`, border: `1px dashed ${accent}20`, color: `${accent}60` }}>
                    {field.placeholder}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use of Funds */}
        <div className="mb-4">
          <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-3 text-zinc-500">Where Every Dollar Goes (Mapped to Phases)</div>

          {/* Visual bar */}
          <div className="flex rounded-lg overflow-hidden h-3.5 mb-3">
            {FUNDS_BUCKETS.map(b => (
              <div
                key={b.label}
                className="h-full relative cursor-pointer transition-all duration-200 hover:brightness-125"
                style={{ width: `${b.pct}%`, background: `${b.color}25` }}
                onClick={() => setExpandedBucket(expandedBucket === b.label ? null : b.label)}
              >
                {b.pct >= 10 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[7px] font-black font-mono" style={{ color: `${b.color}` }}>{b.pct}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bucket rows */}
          <div className="flex flex-col gap-0.5">
            {FUNDS_BUCKETS.map(b => {
              const isExp = expandedBucket === b.label
              return (
                <div key={b.label}>
                  <button
                    className="w-full rounded-lg px-3 py-2.5 flex items-center gap-3 text-left cursor-pointer transition-all duration-150"
                    style={{ background: isExp ? `${b.color}06` : "rgba(255,255,255,0.01)", border: isExp ? `1px solid ${b.color}12` : "1px solid transparent" }}
                    onClick={() => setExpandedBucket(isExp ? null : b.label)}
                  >
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: b.color }} />
                    <span className="text-[10px] font-bold text-zinc-300 flex-1">{b.label}</span>
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0" style={{ background: `${b.color}08`, color: `${b.color}70` }}>{b.phase}</span>
                    <span className="text-[10px] font-black font-mono flex-shrink-0" style={{ color: b.color }}>{b.amount}</span>
                    <ChevronDown className="w-2.5 h-2.5 flex-shrink-0 transition-transform duration-200" style={{ color: `${b.color}40`, transform: isExp ? "rotate(180deg)" : "" }} />
                  </button>
                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 ml-5">
                          <div className="text-[9px] text-zinc-400 leading-relaxed mb-2">{b.detail}</div>
                          <div className="flex flex-col gap-0.5">
                            {b.deliverables.map(d => (
                              <div key={d} className="flex items-center gap-1.5">
                                <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `${b.color}40` }} />
                                <span className="text-[8px] text-zinc-500">{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Two Worlds toggle */}
        <button
          className="w-full rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-200 mb-2"
          style={{ background: showTwoWorlds ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.015)", border: showTwoWorlds ? "1px solid rgba(239,68,68,0.12)" : "1px solid rgba(255,255,255,0.04)" }}
          onClick={() => setShowTwoWorlds(!showTwoWorlds)}
        >
          <span className="text-[10px] font-bold text-zinc-300">{"The Two Worlds: Shadow + Front"}</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ color: "rgba(239,68,68,0.4)", transform: showTwoWorlds ? "rotate(180deg)" : "" }} />
        </button>
        <AnimatePresence>
          {showTwoWorlds && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="grid grid-cols-2 gap-3 px-1">
                <div className="rounded-xl p-3" style={{ background: "rgba(16,185,129,0.03)", border: "1px solid rgba(16,185,129,0.1)" }}>
                  <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: "rgba(16,185,129,0.5)" }}>The Front World (Users)</div>
                  <div className="text-[9px] text-zinc-400 leading-relaxed">
                    What traders see: their dashboard, their charts, their trades, their community. A seamless, premium experience where every interaction feels intentional. Users never know the Shadow World exists. Their experience is sovereign, and the product feels like it was built just for them.
                  </div>
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}>
                  <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: "rgba(239,68,68,0.5)" }}>The Shadow World (Operators)</div>
                  <div className="text-[9px] text-zinc-400 leading-relaxed">
                    What operators see: every click, every keystroke, every mouse path, every session replay. Behavioral analytics, churn prediction, fraud detection, engagement scoring, funnel analysis, and content moderation -- all invisible to users. A 3-person team operates with the precision of a 50-person operations department.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestones toggle */}
        <button
          className="w-full rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-200 mb-2"
          style={{ background: showMilestones ? `${accent}05` : "rgba(255,255,255,0.015)", border: showMilestones ? `1px solid ${accent}12` : "1px solid rgba(255,255,255,0.04)" }}
          onClick={() => setShowMilestones(!showMilestones)}
        >
          <span className="text-[10px] font-bold text-zinc-300">12 Milestones This Round Unlocks (with timelines)</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ color: `${accent}40`, transform: showMilestones ? "rotate(180deg)" : "" }} />
        </button>
        <AnimatePresence>
          {showMilestones && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {MILESTONES.map(m => (
                  <div key={m.label} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: `${accent}03`, border: `1px solid ${accent}08` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                    <span className="text-[9px] text-zinc-400 flex-1">{m.label}</span>
                    <span className="text-[7px] font-mono font-bold flex-shrink-0" style={{ color: `${accent}60` }}>{m.when}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Why Now */}
        <div className="rounded-xl p-4 mb-5" style={{ background: `${accent}03`, border: `1px solid ${accent}08` }}>
          <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: `${accent}50` }}>Why This Moment</div>
          <p className="text-[10px] text-zinc-400 leading-relaxed mb-2">
            Trading is more social and faster than ever, but the infrastructure is decades old. AI is finally capable enough to augment real-time decision-making. The fragmented tool market ($47/month across 6 disconnected apps) has created a clear consolidation opportunity with zero unified competitors. And the hardest part -- the 340+ component interface layer with 12 major systems -- is already built and functional.
          </p>
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            The dual-world architecture gives a lean founding team operational intelligence that would normally require 50+ people. Every user interaction is tracked, every behavioral pattern is detected, and every product decision is data-informed from Day 1. This is not a feature advantage -- it is an operational advantage that compounds with every user.
          </p>
        </div>

        {/* Brand close */}
        <div className="flex items-center justify-center gap-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <motion.div className="flex items-center gap-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }}>
            <Brain className="w-5 h-5" style={{ color: accent }} />
            <span className="text-sm font-black text-white tracking-wide">ARCHIO AI</span>
          </motion.div>
          <span className="text-[10px] text-zinc-500">Intelligence. Community. Execution.</span>
        </div>
      </div>
    </div>
  )
}
