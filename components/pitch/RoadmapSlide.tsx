"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown, ArrowRight, Sparkles, Brain, Shield, Handshake,
  Server, Megaphone, Layers, Database, Bell, Users, Activity,
  Globe, Wifi, CheckCircle2, Zap, Lock, CreditCard, Rocket
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════
   FLAGSHIP ROADMAP SLIDE — Capital Deployment Control Tower
   Three workstreams. Real budgets. Execution logic.
   Elevated design with color, warmth, and investor-grade UX.
   ═══════════════════════════════════════════════════════════ */

interface SubWorkstream {
  id: string
  title: string
  budget: string
  icon: React.ElementType
  description: string
  deliverables: string[]
  whyItMatters: string
}

interface Workstream {
  id: "frontend" | "backend" | "gtm"
  title: string
  subtitle: string
  budgetRange: string
  budgetNote?: string
  color: string
  gradientFrom: string
  gradientTo: string
  icon: React.ElementType
  summary: string
  investorTakeaway: string
  subWorkstreams: SubWorkstream[]
}

const WORKSTREAMS: Workstream[] = [
  {
    id: "frontend",
    title: "Frontend / Design",
    subtitle: "The face of Archio",
    budgetRange: "$75k -- $105k",
    color: "#6366f1",
    gradientFrom: "#6366f1",
    gradientTo: "#818cf8",
    icon: Sparkles,
    summary: "Public storytelling, product polish, and premium usability. This track turns Archio from a promising interface into a polished, market-ready product experience.",
    investorTakeaway: "This track turns Archio from a promising interface into a polished, market-ready product experience. Every pixel is deliberate. Every interaction builds trust.",
    subWorkstreams: [
      {
        id: "landing",
        title: "Landing Page + 7 Feature Pages",
        budget: "$45k -- $60k",
        icon: Globe,
        description: "Build a premium landing page that explains the frustrated-trader problem clearly. Show the fragmented workflow and why ArchioAI exists. Build 7 major feature pages where each page sells one capability clearly and connects it back to the wider platform. The public site should feel interconnected, not like isolated product pages.",
        deliverables: [
          "Main landing page with hero, problem/solution, waitlist capture",
          "7 feature landing pages (Neural Matrix, AI Forecasts, Execution, Community, Journaling, MRKT Intelligence, Copilot)",
          "Connected storytelling architecture between all pages",
          "Visual product framing and positioning",
          "Responsive design system across all breakpoints",
          "Premium motion and brand presentation",
        ],
        whyItMatters: "Investor clarity, customer clarity, stronger product positioning, and better conversion into demos, signups, and partnerships.",
      },
      {
        id: "polish",
        title: "In-App UI/UX Polish + Motion",
        budget: "$30k -- $45k",
        icon: Zap,
        description: "Re-check and refine the half-complete product surfaces already inside Archio. Improve layout quality, consistency, motion, and usability. Make the product feel alive, responsive, premium, and coherent. Polish how each feature behaves, not just how it looks.",
        deliverables: [
          "Dashboard refinement and layout consistency",
          "Animation and motion polish across all interactions",
          "Interaction cleanup and micro-feedback",
          "Typography and spacing consistency pass",
          "Transitions between product states",
          "Premium breathing feel without clutter",
          "UX review of all half-done features",
          "Connected, intentional experience throughout",
        ],
        whyItMatters: "Stronger user trust, stronger demo quality, better retention, perceived product maturity, and better investor confidence in execution quality.",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend / Infrastructure",
    subtitle: "The brain of Archio",
    budgetRange: "$150k -- $175k",
    color: "#10b981",
    gradientFrom: "#10b981",
    gradientTo: "#34d399",
    icon: Server,
    summary: "This workstream turns the visible product shell into a connected, intelligent, secure, and production-capable platform. The main product-completion track.",
    investorTakeaway: "This track is what turns Archio from an impressive interface into a real, connected operating system. Every dollar here builds infrastructure that compounds.",
    subWorkstreams: [
      {
        id: "ai-orchestration",
        title: "AI Orchestration Layer + Agent Framework",
        budget: "$40k -- $50k",
        icon: Brain,
        description: "Build the central AI orchestration layer -- the system brain of the platform. Create a main coordination layer with 150+ specialized sub-agents. Each sub-agent handles a narrow task. The value is not one giant agent working alone. The value is a connected ecosystem where agents cooperate and pass context to each other.",
        deliverables: [
          "Central orchestration logic and routing",
          "Agent routing based on user intent",
          "Context sharing between agents",
          "Agent memory and coordination logic",
          "Task specialization for 150+ domains",
          "Multi-agent workflow behavior",
          "Output consistency and quality control",
        ],
        whyItMatters: "This is the intelligence layer that differentiates the platform. No competitor has agent orchestration at this scale for trading workflows.",
      },
      {
        id: "live-data",
        title: "Live Market Data + Workflow Engine",
        budget: "$30k -- $35k",
        icon: Wifi,
        description: "Connect live market feeds and millisecond-sensitive data services. Build the workflow engine that moves information through the system in the right order. Teach the AI system how to use live data inside real workflows. This is what turns passive UI into active intelligence.",
        deliverables: [
          "Live data ingestion from market providers",
          "Market feed normalization across instruments",
          "Event routing and workflow orchestration",
          "Alert handling and signal processing",
          "Response timing and latency optimization",
          "Data-to-output logic for AI consumption",
        ],
        whyItMatters: "Trading decisions depend on current prices. Stale data means missed entries, wrong position sizing, and broken trust. AI agents cannot generate accurate forecasts without real-time market context.",
      },
      {
        id: "partnerships",
        title: "Broker / PropFirm / TradingView",
        budget: "$25k -- $30k",
        icon: Handshake,
        description: "Build the technical layer for integrations with TradingView, brokers, and prop firms. Budget for meetings, relationship development, contract discussions, and API coordination. Integration work is both technical and business-facing.",
        deliverables: [
          "API evaluation and technical planning",
          "TradingView charting integration",
          "Broker connectivity for live execution",
          "Prop firm API integration for challenge tracking",
          "Meetings and partner coordination",
          "Contract and platform access discussions",
          "Testing and integration review",
        ],
        whyItMatters: "Archio cannot build everything in-house. TradingView has best-in-class charting. Prop firms represent a massive user segment. Brokers enable real execution. Partnerships unlock capabilities that would take years to build.",
      },
      {
        id: "security",
        title: "KYC / Security / Compliance",
        budget: "$15k -- $20k",
        icon: Shield,
        description: "Protect the company, the platform, and the users. Add KYC, stronger security layers, permissions, and defensive architecture. Make sure user information is handled safely. Reduce the risk of hacks, abuse, and bad access control.",
        deliverables: [
          "KYC flows for mentor verification",
          "User verification and identity checks",
          "Permissions and role-based access",
          "Cybersecurity hardening",
          "Data protection and encryption",
          "Secure authentication review",
          "Compliance-aware infrastructure",
        ],
        whyItMatters: "Users trust Archio with sensitive financial data, trading history, and potentially broker credentials. A single breach destroys that trust permanently. Security is not optional -- it is foundational.",
      },
      {
        id: "persistence",
        title: "Persistence / Realtime / DevOps / Billing",
        budget: "$40k",
        icon: Database,
        description: "Make the platform actually persistent, operational, and maintainable. Save activity, history, and user-generated actions properly. Add the realtime layer required for collaboration, feeds, and notifications. Put the platform on stable operational foundations.",
        deliverables: [
          "Database persistence and schema optimization",
          "History and audit trails for all actions",
          "Journaling persistence with full trade data",
          "Realtime notifications and messaging",
          "Realtime communication layer (WebSocket)",
          "Admin controls and moderation tools",
          "Billing and subscription foundation (Stripe)",
          "Monitoring, logging, and observability",
          "Testing infrastructure and CI/CD",
          "Deployment reliability and rollback",
        ],
        whyItMatters: "This is the operational backbone. Without persistence, nothing is saved. Without realtime, nothing feels alive. Without DevOps, nothing is reliable.",
      },
    ],
  },
  {
    id: "gtm",
    title: "GTM / Marketing",
    subtitle: "The voice of Archio",
    budgetRange: "Founder input needed",
    budgetNote: "founder-input",
    color: "#f59e0b",
    gradientFrom: "#f59e0b",
    gradientTo: "#fbbf24",
    icon: Megaphone,
    summary: "This workstream turns product completion into market entry, distribution, beta recruitment, brand communication, and launch readiness.",
    investorTakeaway: "This track ensures that product completion translates into real market activation. Building in silence is a risk. Launching with intent is a strategy.",
    subWorkstreams: [
      {
        id: "brand",
        title: "Brand + Launch Assets",
        budget: "TBD",
        icon: Rocket,
        description: "Create the visual and messaging assets needed for a compelling market launch. Consistent brand identity across all touchpoints.",
        deliverables: [
          "Brand guidelines and visual identity",
          "Launch video and demo materials",
          "Pitch deck refinement",
          "Press kit and media assets",
        ],
        whyItMatters: "First impressions matter. A polished brand presence signals credibility and professionalism to users, partners, and press.",
      },
      {
        id: "waitlist",
        title: "Waitlist / CRM / Lead Capture",
        budget: "TBD",
        icon: Users,
        description: "Build systems to capture, nurture, and convert interested users from first touch to active beta participant.",
        deliverables: [
          "Waitlist capture with referral mechanics",
          "CRM setup for lead management",
          "Email sequences and nurture flows",
          "Analytics and attribution tracking",
        ],
        whyItMatters: "Without lead capture, traffic is wasted. Without nurture, leads go cold. This is the conversion infrastructure.",
      },
      {
        id: "beta",
        title: "Beta Onboarding + Community",
        budget: "TBD",
        icon: Activity,
        description: "Recruit and onboard the first cohort of beta users. Build feedback loops and community engagement.",
        deliverables: [
          "Beta application and selection process",
          "Onboarding flow and documentation",
          "Feedback collection systems",
          "Community Discord or forum setup",
          "Mentor and partner onboarding",
        ],
        whyItMatters: "Early users validate the product and provide the testimonials and case studies needed for growth.",
      },
      {
        id: "content",
        title: "Content + Education",
        budget: "TBD",
        icon: Bell,
        description: "Create educational content that explains the platform, builds trust, and establishes thought leadership.",
        deliverables: [
          "Explainer videos and tutorials",
          "Blog content and SEO articles",
          "Social media content calendar",
          "Webinar and demo infrastructure",
        ],
        whyItMatters: "Content builds trust at scale. Education reduces support burden and increases retention.",
      },
    ],
  },
]

const EXECUTION_PHASES = [
  { phase: 1, label: "Frontend storytelling + experience polish", color: "#6366f1", icon: Sparkles },
  { phase: 2, label: "Backend intelligence + integrations", color: "#10b981", icon: Server },
  { phase: 3, label: "Security + persistence + DevOps", color: "#10b981", icon: Lock },
  { phase: 4, label: "GTM activation + launch", color: "#f59e0b", icon: Rocket },
]

const BACKEND_INFRA = [
  { icon: Layers, label: "Workflow Engine", desc: "Routes data through the system in correct order", color: "#10b981" },
  { icon: Database, label: "Long-term Storage", desc: "Scalable schema for years of user data", color: "#3b82f6" },
  { icon: Bell, label: "Realtime Events", desc: "Instant alerts, messages, and live updates", color: "#f59e0b" },
  { icon: Users, label: "Admin + Roles", desc: "Operator tools, permissions, moderation", color: "#8b5cf6" },
  { icon: Activity, label: "DevOps + QA", desc: "CI/CD, observability, testing", color: "#ef4444" },
  { icon: CreditCard, label: "Stripe Billing", desc: "Subscriptions, payouts, revenue tracking", color: "#06b6d4" },
]

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function RoadmapSlide({ accent }: { accent: string }) {
  const [mode, setMode] = useState<"overview" | "deepdive">("overview")
  const [selectedWorkstream, setSelectedWorkstream] = useState<"frontend" | "backend" | "gtm" | null>(null)
  const [expandedSub, setExpandedSub] = useState<string | null>(null)

  const handleWorkstreamClick = (id: "frontend" | "backend" | "gtm") => {
    setSelectedWorkstream(id)
    setMode("deepdive")
    setExpandedSub(null)
  }

  const handleBackToOverview = () => {
    setMode("overview")
    setSelectedWorkstream(null)
    setExpandedSub(null)
  }

  const selectedData = WORKSTREAMS.find(w => w.id === selectedWorkstream)

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "#080A10", border: "1px solid rgba(255,255,255,0.06)" }}>

      {/* ── Multi-layer ambient background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left warm glow */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ left: "-10%", top: "-20%", background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom-right emerald glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ right: "-15%", bottom: "-25%", background: "radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)" }}
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center amber pulse */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(245,158,11,0.04), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">

        {/* ════════════════════════════════════════════════════════
            HEADER
            ════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: accent }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: `${accent}70` }}>Capital Deployment Roadmap</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}20, transparent)` }} />
          {mode === "deepdive" && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBackToOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 hover:scale-105"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              All Workstreams
            </motion.button>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 text-balance leading-tight">
          {mode === "overview"
            ? "Three workstreams to complete the platform."
            : selectedData?.title}
        </h2>
        <p className="text-[13px] leading-relaxed mb-6 max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
          {mode === "overview"
            ? "Frontend experience, backend intelligence infrastructure, and go-to-market activation. Each workstream has a defined scope, budget, and reason for existing."
            : selectedData?.summary}
        </p>

        {/* ════════════════════════════════════════════════════════
            BUDGET SUMMARY STRIP
            ════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-stretch gap-3 mb-7">
          {WORKSTREAMS.map((ws, i) => {
            const Icon = ws.icon
            return (
              <motion.button
                key={ws.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex-1 min-w-[160px] rounded-xl px-4 py-3 cursor-pointer text-left group overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${ws.gradientFrom}10, ${ws.gradientTo}05)`,
                  border: `1px solid ${ws.color}20`,
                }}
                onClick={() => handleWorkstreamClick(ws.id)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover fill */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${ws.gradientFrom}15, ${ws.gradientTo}08)` }} />
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${ws.gradientFrom}, ${ws.gradientTo})` }} />
                {/* Breathing border */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ border: `1px solid ${ws.color}` }}
                  animate={{ opacity: [0.08, 0.2, 0.08] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${ws.color}20` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: ws.color }} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white">{ws.title}</div>
                      <div className="text-[9px] font-medium" style={{ color: `${ws.color}60` }}>{ws.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-base font-black font-mono" style={{ color: ws.budgetNote === "founder-input" ? `${ws.color}50` : ws.color }}>
                    {ws.budgetRange}
                  </div>
                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] font-bold" style={{ color: `${ws.color}60` }}>{ws.subWorkstreams.length} workstreams</span>
                    <ArrowRight className="w-3 h-3" style={{ color: `${ws.color}50` }} />
                  </div>
                </div>
              </motion.button>
            )
          })}

          {/* Total */}
          <div className="relative rounded-xl px-4 py-3 min-w-[140px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accent}40, ${accent}20)` }} />
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-zinc-500 mb-1">Core Build</div>
            <div className="text-base font-black font-mono text-white">$225k -- $280k</div>
            <div className="text-[9px] text-zinc-600 mt-0.5">before GTM allocation</div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            MODE: OVERVIEW
            ════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {mode === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Workstream Cards - larger, richer */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {WORKSTREAMS.map((ws, i) => {
                  const Icon = ws.icon
                  return (
                    <motion.button
                      key={ws.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      className="relative rounded-xl p-5 text-left cursor-pointer group overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, ${ws.gradientFrom}08, ${ws.gradientTo}03, transparent)`,
                        border: `1px solid ${ws.color}15`,
                      }}
                      onClick={() => handleWorkstreamClick(ws.id)}
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${ws.color}12, transparent 60%)` }} />
                      {/* Left accent bar */}
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: `linear-gradient(180deg, ${ws.gradientFrom}, ${ws.gradientTo}60)` }} />

                      <div className="relative z-10 pl-3">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ws.gradientFrom}20, ${ws.gradientTo}10)` }}>
                            <Icon className="w-4.5 h-4.5" style={{ color: ws.color }} />
                          </div>
                          <div>
                            <div className="text-[13px] font-black text-white">{ws.title}</div>
                            <div className="text-[10px]" style={{ color: `${ws.color}70` }}>{ws.subtitle}</div>
                          </div>
                        </div>
                        <p className="text-[11px] leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>{ws.summary}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] px-2.5 py-1 rounded-full font-bold" style={{ background: `${ws.color}15`, color: ws.color }}>
                            {ws.subWorkstreams.length} workstreams inside
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" style={{ color: ws.color }} />
                        </div>
                      </div>

                      {/* Animated bottom border */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${ws.color}, transparent)` }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      />
                    </motion.button>
                  )
                })}
              </div>

              {/* Execution Order - visual timeline */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Execution Sequence</div>
                <div className="flex items-center gap-2">
                  {EXECUTION_PHASES.map((phase, i) => {
                    const Icon = phase.icon
                    return (
                      <div key={phase.phase} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${phase.color}15`, border: `1px solid ${phase.color}20` }}>
                            <Icon className="w-4 h-4" style={{ color: phase.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-black" style={{ color: phase.color }}>Phase {phase.phase}</div>
                            <div className="text-[9px] text-zinc-500 leading-snug truncate">{phase.label}</div>
                          </div>
                        </div>
                        {i < EXECUTION_PHASES.length - 1 && (
                          <div className="flex-shrink-0 w-6 flex items-center justify-center">
                            <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <span className="text-[10px] text-zinc-500">Phases 1 and 2 run in parallel. GTM prep begins before backend is fully complete.</span>
                </div>
              </div>

              {/* What this unlocks */}
              <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${accent}06, ${accent}02)`, border: `1px solid ${accent}15` }}>
                <div className="flex items-start gap-3">
                  <motion.div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accent}25, ${accent}10)` }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" style={{ color: accent }} />
                  </motion.div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-black mb-1.5" style={{ color: `${accent}70` }}>What This Round Unlocks</div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      A polished public website that converts visitors. A dashboard that feels premium and alive. An AI system with 150+ coordinated agents. Live market data flowing through every feature. Secure, persistent, production-ready infrastructure. And a clear path to market activation.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════
              MODE: DEEP DIVE
              ════════════════════════════════════════════════════════ */}
          {mode === "deepdive" && selectedData && (
            <motion.div
              key="deepdive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Workstream navigation tabs */}
              <div className="flex items-center gap-2 mb-5">
                {WORKSTREAMS.map(ws => {
                  const isActive = ws.id === selectedData.id
                  const Icon = ws.icon
                  return (
                    <button
                      key={ws.id}
                      onClick={() => handleWorkstreamClick(ws.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200"
                      style={{
                        background: isActive ? `${ws.color}15` : "rgba(255,255,255,0.03)",
                        border: isActive ? `1px solid ${ws.color}30` : "1px solid rgba(255,255,255,0.05)",
                        color: isActive ? ws.color : "rgba(255,255,255,0.4)",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {ws.title}
                    </button>
                  )
                })}
              </div>

              {/* Sub-workstreams */}
              <div className="flex flex-col gap-2 mb-4 max-h-[340px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: `${selectedData.color}20 transparent` }}>
                {selectedData.subWorkstreams.map((sub, si) => {
                  const isExpanded = expandedSub === sub.id
                  const SubIcon = sub.icon
                  return (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.06 }}
                    >
                      <button
                        className="w-full rounded-xl px-4 py-3.5 text-left cursor-pointer transition-all duration-300 group relative overflow-hidden"
                        style={{
                          background: isExpanded
                            ? `linear-gradient(135deg, ${selectedData.color}10, ${selectedData.color}04)`
                            : `linear-gradient(135deg, ${selectedData.color}04, transparent)`,
                          border: isExpanded ? `1px solid ${selectedData.color}25` : `1px solid ${selectedData.color}10`,
                        }}
                        onClick={() => setExpandedSub(isExpanded ? null : sub.id)}
                      >
                        {/* Left accent */}
                        <div
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-300"
                          style={{ background: isExpanded ? `linear-gradient(180deg, ${selectedData.gradientFrom}, ${selectedData.gradientTo})` : `${selectedData.color}20`, opacity: isExpanded ? 1 : 0.5 }}
                        />

                        <div className="flex items-center gap-3 mb-1 pl-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${selectedData.color}15` }}>
                            <SubIcon className="w-3.5 h-3.5" style={{ color: selectedData.color }} />
                          </div>
                          <span className="text-[12px] font-black text-white flex-1">{sub.title}</span>
                          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg" style={{ background: `${selectedData.color}12`, color: selectedData.color }}>
                            {sub.budget}
                          </span>
                          <ChevronDown
                            className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                            style={{ color: `${selectedData.color}50`, transform: isExpanded ? "rotate(180deg)" : "" }}
                          />
                        </div>
                        <p className="text-[10px] leading-relaxed ml-12 line-clamp-2" style={{ color: "rgba(255,255,255,0.4)" }}>{sub.description}</p>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-5 mr-1 mt-2 mb-2 space-y-3">
                              {/* Description */}
                              <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${selectedData.color}06, ${selectedData.color}02)`, border: `1px solid ${selectedData.color}12` }}>
                                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{sub.description}</p>
                              </div>

                              {/* Deliverables */}
                              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div className="text-[8px] uppercase tracking-[0.2em] font-black mb-3" style={{ color: `${selectedData.color}60` }}>Deliverables</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                  {sub.deliverables.map((d, di) => (
                                    <motion.div
                                      key={di}
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: di * 0.03 }}
                                      className="flex items-start gap-2"
                                    >
                                      <motion.div
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                                        style={{ background: selectedData.color }}
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: di * 0.2 }}
                                      />
                                      <span className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{d}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* Why it matters */}
                              <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${selectedData.color}08, ${selectedData.color}03)`, border: `1px solid ${selectedData.color}15` }}>
                                <div className="text-[8px] uppercase tracking-[0.2em] font-black mb-1.5" style={{ color: `${selectedData.color}70` }}>Why This Matters</div>
                                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{sub.whyItMatters}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Extra backend infrastructure */}
              {selectedData.id === "backend" && (
                <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-3">Additional Infrastructure</div>
                  <div className="grid grid-cols-6 gap-2">
                    {BACKEND_INFRA.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          className="rounded-xl p-3 text-center group cursor-default"
                          style={{ background: `${item.color}06`, border: `1px solid ${item.color}10` }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: `${item.color}15` }}>
                            <Icon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <div className="text-[9px] font-bold text-zinc-300 mb-0.5">{item.label}</div>
                          <div className="text-[8px] leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Investor takeaway */}
              <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${selectedData.color}08, ${selectedData.color}03)`, border: `1px solid ${selectedData.color}18` }}>
                <div className="flex items-start gap-3">
                  <motion.div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${selectedData.gradientFrom}25, ${selectedData.gradientTo}10)` }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" style={{ color: selectedData.color }} />
                  </motion.div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-black mb-1.5" style={{ color: `${selectedData.color}70` }}>Investor Takeaway</div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{selectedData.investorTakeaway}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
