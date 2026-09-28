"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ChevronRight, TrendingUp, Globe, Users, BarChart3,
  Target, Layers, ArrowUpRight, Cpu, Shield, Activity, Diamond,
  CandlestickChart, Zap, MessageSquare, Wallet, BookOpen, Newspaper,
  ShieldAlert, Brain, Network, Puzzle, PieChart, ArrowRight, Check, X,
  MapPin, DollarSign, Percent, AlertTriangle, CircleDot, Building2,
  Scale, Crown, Landmark, Banknote, LineChart, Info
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════
   SLIDE DATA ARCHITECTURE
   ═══════════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id: "macro",
    title: "The World's Largest Industry Has No Operating System",
    subtitle: "Financial services is a $26.5 trillion global industry. The retail trading segment alone moves $9.6 trillion daily in forex. Yet the software layer powering individual traders has never been unified.",
  },
  {
    id: "disruption",
    title: "Historical Disruption Proves the Thesis",
    subtitle: "Every fragmented professional market in history has been unified by a single platform. Trading is the last major category without one.",
  },
  {
    id: "overview",
    title: "Market Opportunity Executive Summary",
    subtitle: "A $14.2B market built by excellent individual tools that are structurally incapable of connecting the full trading workflow. Zero platforms score above 2/6 categories.",
  },
  {
    id: "tam",
    title: "Total Addressable Market (TAM): $14.2B",
    subtitle: "The complete global market for retail and semi-professional trading software, validated by 5 independent research firms and bottom-up revenue analysis of 15 segment leaders.",
  },
  {
    id: "tam-segments",
    title: "TAM Sub-Segment Breakdown",
    subtitle: "Six distinct categories -- each dominated by different incumbents, each growing at different rates, none connected to each other.",
  },
  {
    id: "sam",
    title: "Serviceable Addressable Market (SAM): $5.8B",
    subtitle: "32 million active traders currently paying for tools. They spend $180/yr on average across fragmented subscriptions. This is Archio's replacement market.",
  },
  {
    id: "sam-assets",
    title: "SAM by Asset Class and User Economics",
    subtitle: "Where the paying traders are, what they spend, and which segments offer the highest unit economics for Archio's go-to-market.",
  },
  {
    id: "som",
    title: "Serviceable Obtainable Market (SOM): $420M",
    subtitle: "A 5-year revenue target requiring 7.2% SAM penetration with 1.4M paying users -- conservative relative to TradingView's 16% penetration with only charting.",
  },
  {
    id: "som-revenue",
    title: "SOM Revenue Architecture: Four Diversified Streams",
    subtitle: "Subscriptions (60%) + B2B Prop Firm Partnerships (20%) + Marketplace (12%) + Data Intelligence API (8%). No single-stream dependency.",
  },
  {
    id: "projections",
    title: "Multi-Year Growth Projections (2022-2030)",
    subtitle: "TAM, SAM, and SOM trajectories modeled with conservative assumptions. Every projection uses the lower-bound CAGR across sub-segments.",
  },
  {
    id: "regional",
    title: "Regional Market Intelligence",
    subtitle: "300M+ retail traders distributed across 7 regions with dramatically different growth rates, spending patterns, and maturity levels. Archio's GTM phases map directly to opportunity.",
  },
  {
    id: "drivers",
    title: "Six Structural Tailwinds Driving the Opportunity",
    subtitle: "These are not cyclical trends. They are irreversible structural shifts that compound annually and make the market increasingly ready for unification.",
  },
  {
    id: "competitive",
    title: "Competitive Capability Matrix: Why Nobody Has Done This",
    subtitle: "Every incumbent is structurally locked into 1-2 categories by their business model. Unification requires building from scratch. That is Archio.",
  },
  {
    id: "scenarios",
    title: "Scenario Analysis: Bear / Base / Bull",
    subtitle: "Three revenue scenarios stress-tested against churn sensitivity, ARPU expansion, and competitive response. Even the bear case produces a venture-scale outcome.",
  },
  {
    id: "thesis",
    title: "The Investment Thesis: Why Now, Why Archio",
    subtitle: "Four converging forces make this the precise moment for a unified trading platform. The market conditions that enable this company exist today and did not exist 3 years ago.",
  },
]

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 0: MACRO CONTEXT -- Finance Is The World's Biggest Market
   ═══════════════════════════════════════════════════════════════════ */

function SlideMacro({ accent }: { accent: string }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const macroFacts = [
    { icon: Landmark, value: "$26.5T", label: "Global financial services", detail: "The financial services industry generated $26.5 trillion in revenue in 2024, making it the largest industry in the world by revenue -- larger than healthcare ($12.1T), technology ($5.9T), and energy ($4.8T) combined. Every other industry depends on financial infrastructure to operate.", source: "McKinsey Global Banking Annual Review 2024", color: "#10b981" },
    { icon: Globe, value: "$9.6T/day", label: "Daily forex volume", detail: "The foreign exchange market alone processes $9.6 trillion in daily transaction volume (BIS Triennial Survey 2025). This is the most liquid market in human history. Retail traders now account for approximately 5.5% of this volume, up from 3.5% in 2019 -- representing over $528 billion in daily retail-driven volume.", source: "Bank for International Settlements Triennial Survey", color: "#06b6d4" },
    { icon: BarChart3, value: "$115T", label: "Global equities market cap", detail: "Total global equity market capitalization exceeds $115 trillion across 80+ exchanges. The US alone accounts for $50.8 trillion (NYSE + NASDAQ). Retail investors now represent 23% of US equity trading volume, up from 10% in 2019 -- a structural shift driven by zero-commission brokers and mobile-first platforms.", source: "World Federation of Exchanges, NYSE data 2024", color: "#3b82f6" },
    { icon: Banknote, value: "$2.8T", label: "Crypto market cap", detail: "The cryptocurrency market reached $2.8 trillion in total market capitalization by late 2024, with daily trading volume exceeding $150 billion. There are now 580M+ crypto wallets globally. This asset class did not meaningfully exist 10 years ago -- it represents a $2.8 trillion market with zero institutional-grade retail infrastructure.", source: "CoinGecko, Chainalysis Crypto Report 2024", color: "#f59e0b" },
    { icon: Users, value: "300M+", label: "Global retail traders", detail: "Over 300 million individuals now actively trade financial markets globally, up from approximately 95 million in 2019. This 3x growth was driven by zero-commission brokers (Robinhood, eToro), mobile-first platforms, pandemic-era market interest, and the democratization of access to global markets via fintech infrastructure.", source: "BIS, FINRA, FCA registrations, broker disclosures", color: "#8b5cf6" },
    { icon: Building2, value: "$0", label: "Unified platforms today", detail: "Despite the financial services industry being the largest in the world, there is no single platform that unifies the complete retail trading workflow: charting, execution, community, journaling, intelligence, and AI assistance. The Bloomberg Terminal serves institutional traders at $25,000/year. For the 300M+ retail traders, no equivalent exists. This is the gap.", source: "Archio market analysis, competitive audit 2024-2025", color: "#ef4444" },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Opening context */}
      <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[12px] text-zinc-300 leading-relaxed">
          Financial services is not just another industry. It is the <span className="text-white font-semibold">single largest sector in the global economy</span> -- generating more revenue than healthcare, technology, and energy combined. Every company, government, and individual on Earth interacts with financial infrastructure daily. Yet the software layer serving the 300M+ people who actively trade these markets has never been unified into a single coherent platform. The institutional world has Bloomberg. The retail world has <span className="font-semibold" style={{ color: accent }}>nothing</span>.
        </p>
      </div>

      {/* Macro fact cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {macroFacts.map((fact, i) => {
          const Icon = fact.icon
          const isExp = expanded === i
          return (
            <motion.button
              key={fact.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              onClick={() => setExpanded(isExp ? null : i)}
              className="rounded-xl p-4 text-left transition-all duration-400 outline-none relative overflow-hidden group/fact"
              style={{ background: isExp ? `${fact.color}06` : "rgba(255,255,255,0.035)", border: `1px solid ${isExp ? `${fact.color}18` : "rgba(255,255,255,0.035)"}` }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/fact:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${fact.color}04 0%, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${fact.color}08`, border: `1px solid ${fact.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: `${fact.color}70` }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold font-mono text-white leading-none">{fact.value}</div>
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-zinc-400 mb-1.5">{fact.label}</div>
                <AnimatePresence>
                  {isExp && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                      <p className="text-[9px] text-zinc-400 leading-relaxed mb-2">{fact.detail}</p>
                      <div className="text-[7px] font-mono px-2 py-1 rounded inline-block" style={{ background: `${fact.color}06`, color: `${fact.color}50`, border: `1px solid ${fact.color}10` }}>{fact.source}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isExp && <p className="text-[8px] text-zinc-600 leading-relaxed line-clamp-2">{fact.detail.slice(0, 120)}...</p>}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* The punchline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-xl p-4" style={{ background: `${accent}04`, border: `1px solid ${accent}12` }}>
        <div className="flex items-start gap-3">
          <Diamond className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `${accent}50` }} />
          <p className="text-[11px] font-semibold leading-relaxed" style={{ color: `${accent}85` }}>
            This is the world Archio enters: the largest industry in human history, serving 300M+ active participants who collectively move trillions daily, powered by software that has never been connected into a single workflow. We are not entering an established SaaS category. We are creating one -- the first unified operating system for the world&apos;s most active individual market participants.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 1: HISTORICAL DISRUPTION PRECEDENT
   ═══════════════════════════════════════════════════════════════════ */

function SlideDisruption({ accent }: { accent: string }) {
  const precedents = [
    { industry: "Design", before: "Photoshop + Illustrator + Sketch + InVision + Abstract", after: "Figma", outcome: "$20B acquisition by Adobe (2022)", timeToUnify: "4 years to dominant market share", archioPara: "Designers used 5+ disconnected tools. Figma unified design, prototyping, handoff, and collaboration into one browser-based platform. Result: $20B exit at ~$600M ARR (33x revenue multiple).", color: "#a855f7" },
    { industry: "DevOps", before: "GitHub + Jenkins + CircleCI + Docker + Terraform", after: "GitLab", outcome: "$11B peak market cap (2021)", timeToUnify: "5 years to enterprise adoption", archioPara: "Developers managed code, CI/CD, security, and deployment across 5+ tools. GitLab created a single platform for the complete DevOps lifecycle. IPO at $14.9B, now serving 30M+ users.", color: "#f97316" },
    { industry: "Marketing", before: "Mailchimp + Hootsuite + Google Analytics + Salesforce + HubSpot", after: "HubSpot", outcome: "$30B+ market cap (2024)", timeToUnify: "7 years to full-stack CRM", archioPara: "Marketers juggled email, social, analytics, CRM, and automation tools. HubSpot consolidated the marketing stack into one platform. Grew from $0 to $2.2B ARR with 194,000+ customers across 120 countries.", color: "#06b6d4" },
    { industry: "Collaboration", before: "Email + Dropbox + Trello + Zoom + Slack", after: "Notion / Microsoft Teams", outcome: "$10B+ valuations", timeToUnify: "3 years to mainstream adoption", archioPara: "Knowledge workers used 5+ collaboration tools daily. Notion unified docs, databases, project management, and wikis. Reached $10B valuation at $250M ARR. Microsoft Teams consolidated chat, meetings, and file sharing for 320M+ monthly active users.", color: "#10b981" },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[11px] text-zinc-300 leading-relaxed">
          The pattern is proven and repeatable: <span className="text-white font-semibold">when professionals are forced to use 5+ disconnected tools for a single workflow, a unified platform always emerges and captures the category</span>. This has happened in design (Figma), DevOps (GitLab), marketing (HubSpot), and collaboration (Notion). Trading is the last major professional workflow that has not been unified. The question is not <em>whether</em> this will happen -- it is <em>who</em> will build it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {precedents.map((p, i) => (
          <motion.div
            key={p.industry}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="rounded-xl p-4"
            style={{ background: `${p.color}03`, border: `1px solid ${p.color}10` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-[0.15em] font-bold" style={{ color: `${p.color}70` }}>{p.industry}</span>
              <span className="text-[8px] font-mono" style={{ color: `${p.color}50` }}>{p.timeToUnify}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[8px] text-zinc-600 flex-1 leading-tight">{p.before}</div>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `${p.color}40` }} />
              <span className="text-[11px] font-bold text-white">{p.after}</span>
            </div>
            <div className="text-[10px] font-bold mb-2" style={{ color: p.color }}>{p.outcome}</div>
            <p className="text-[9px] text-zinc-500 leading-relaxed">{p.archioPara}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-xl p-4" style={{ background: `${accent}04`, border: `1px solid ${accent}12` }}>
        <div className="flex items-start gap-3">
          <Diamond className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `${accent}50` }} />
          <div>
            <p className="text-[11px] font-semibold leading-relaxed" style={{ color: `${accent}85` }}>
              Trading is the next domino. Traders use 6+ disconnected tools daily -- charting, execution, community, journaling, intelligence, and AI. No platform unifies them. The historical precedent suggests the winner will be worth $10-30B+. Archio is purpose-built to be that platform.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 2: EXECUTIVE OVERVIEW (enhanced)
   ═══════════════════════════════════════════════════════════════════ */

function SlideOverview({ accent }: { accent: string }) {
  const metrics = [
    { label: "Total Market (TAM)", value: "$14.2B", sub: "2026E -- Global trading software", cagr: "7.2%", color: "#10b981", detail: "CAGR = compound annual growth rate. Cross-validated from 5 research firms. Conservative 7.2% blended CAGR despite AI (18.4%) and social (14.1%) growing 2-3x faster." },
    { label: "Serviceable Market (SAM)", value: "$5.8B", sub: "32M paying traders x $180/yr", cagr: "9.1%", color: "#06b6d4", detail: "Bottom-up derivation: 300M traders filtered to 85M active, filtered to 32M paying. Cross-validated against 15 segment leaders at ~30% combined share." },
    { label: "Obtainable Market (SOM)", value: "$420M", sub: "1.4M users x $300/yr ARPU (avg revenue per user)", cagr: "Y5 ARR", color: "#8b5cf6", detail: "7.2% SAM penetration by Year 5. Conservative vs TradingView (16% of charting-only segment). Four diversified revenue streams reduce concentration risk." },
  ]

  const keyInsights = [
    { icon: Users, stat: "300M+", label: "Global retail traders", detail: "3x growth since 2019. India, SEA, LATAM at 25-30% annual growth. Average age dropped from 42 to 28. This is a generational shift, not a cycle." },
    { icon: Target, stat: "78%", label: "Would consolidate", detail: "78% of surveyed traders (N=2,400) said they would switch to a single platform if it covered their full workflow. Willingness rises to 91% among prop firm traders." },
    { icon: BarChart3, stat: "1,200+", label: "Prop firms globally", detail: "Up from fewer than 50 in 2018. $2.5B+ in evaluation fees. Funded traders need professional tools. Highest-value user segment at $240/yr ARPU (average revenue per user)." },
    { icon: Globe, stat: "14.1%", label: "Social trading CAGR", detail: "CAGR (compound annual growth rate): 14.1%. Fastest-growing segment: $1.8B today to $5.6B by 2030. Gen Z prefers community-led learning." },
    { icon: DollarSign, stat: "$47/mo", label: "Already paying", detail: "Traders already spend $47/month across fragmented subscriptions. They are paying for a unified platform -- just not receiving one." },
    { icon: Layers, stat: "$0", label: "Unified platforms", detail: "No existing platform connects all six workflow categories. Every incumbent is locked into 1-2 categories by their business model." },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl p-5 relative overflow-hidden group/mc cursor-default"
            style={{ background: `${m.color}06`, border: `1px solid ${m.color}18` }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: `radial-gradient(circle, ${m.color}08 0%, transparent 70%)` }} />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: `${m.color}70` }}>{m.label}</div>
              <div className="text-3xl font-bold font-mono text-white mb-1">{m.value}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-zinc-500">{m.sub}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${m.color}10`, color: `${m.color}80` }}>{m.cagr}{m.cagr !== "Y5 ARR" ? " CAGR" : ""}</span>
              </div>
              <p className="text-[8px] text-zinc-600 leading-relaxed opacity-0 group-hover/mc:opacity-100 transition-opacity duration-400">{m.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-3">Key Market Indicators</div>
        <div className="grid grid-cols-3 gap-2">
          {keyInsights.map((insight, i) => {
            const Icon = insight.icon
            return (
              <motion.div key={insight.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                className="rounded-lg p-3.5 group/ki cursor-default" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: `${accent}60` }} />
                  </div>
                  <span className="text-lg font-bold font-mono text-white">{insight.stat}</span>
                </div>
                <div className="text-[10px] font-semibold text-zinc-400 mb-1">{insight.label}</div>
                <p className="text-[9px] text-zinc-600 leading-relaxed">{insight.detail}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="rounded-xl p-5" style={{ background: `${accent}04`, border: `1px solid ${accent}12` }}>
        <div className="flex items-start gap-3">
          <Diamond className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `${accent}50` }} />
          <div>
            <div className="text-sm font-bold text-white mb-1">The Core Thesis</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              A $14.2 billion market built by excellent individual tools that are structurally unable to connect the complete trading workflow. TradingView owns charting ($400M+ ARR). MetaTrader owns execution (15M+ users). Discord owns community (5M+ trading members). Nobody owns the workflow. Archio is the first platform built to unify all six categories. In the same way Figma unified design ($20B exit) and HubSpot unified marketing ($30B+ market cap), Archio will unify trading.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDES 3-4: TAM (keeping existing rich content, adding narratives)
   ═══════════════════════════════════════════════════════════════════ */

function SlideTAM({ accent }: { accent: string }) {
  const color = "#10b981"
  const calculations = [
    { label: "Base year (2022)", value: "$10.8B", note: "Cross-validated from Grand View Research, Mordor Intelligence, Allied Market Research, Finance Magnates, and Market Research Future. All five reports converged within a $0.9B range, indicating high confidence in the baseline." },
    { label: "Applied CAGR", value: "7.2%", note: "Conservative blended rate across 6 sub-segments (range: 5.8% to 18.4%). We use the weighted average, not the fastest-growing segment, to ensure defensible projections." },
    { label: "2026 TAM estimate", value: "$14.2B", note: "$10.8B x (1.072)^4 = $14.24B. This is a simple compound growth calculation, not a speculative projection. The two fastest segments (AI at 18.4%, Social at 14.1%) could push the real number significantly higher." },
    { label: "2030 projection", value: "$19.5B", note: "$10.8B x (1.072)^8 = $19.48B. Likely conservative as AI trading tools ($1.6B today) are projected to reach $8.2B independently by 2030, which alone would add $6.6B to the TAM." },
  ]

  const methodology = [
    "Top-down sizing from 5 independent industry research reports, each covering different sub-segments. We averaged overlapping estimates and used the median for contested segments.",
    "Cross-validated with bottom-up analysis: estimated revenues of 15 segment leaders (TradingView ~$400M, MetaQuotes ~$180M, eToro ~$1.2B, TradeZella ~$8M, etc.) sum to ~$4.2B. At estimated 30% market concentration, this implies a ~$14B total market -- validating the top-down number.",
    "Scope includes: subscription SaaS, freemium models monetized through data/ads, licensing fees, premium tiers, and marketplace commissions. Excludes institutional terminals (Bloomberg at $25K/yr, Refinitiv Eikon at $22K/yr) and pure algorithmic infrastructure.",
    "Deliberately conservative: uses 7.2% blended CAGR despite the two fastest-growing segments (AI at 18.4%, Social Trading at 14.1%) growing 2-3x faster. If we weighted toward high-growth segments, the 2026E TAM would exceed $16B.",
  ]

  const comparisons = [
    { label: "Project Management SaaS", value: "$7.2B", comp: "Asana, Monday, Notion", note: "Trading software is 2x larger and growing faster." },
    { label: "Design Tools SaaS", value: "$4.8B", comp: "Figma, Canva, Adobe CC", note: "Figma captured 25%+ at $20B valuation." },
    { label: "CRM Software", value: "$69B", comp: "Salesforce, HubSpot", note: "Salesforce alone: $34B ARR from CRM unification." },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0">
          <div className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: `${color}60` }}>Total Addressable Market</div>
          <div className="text-5xl font-bold font-mono text-white">$14.2B</div>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
            <span className="text-sm font-semibold font-mono" style={{ color: `${color}80` }}>7.2% CAGR</span>
            <span className="text-[10px] text-zinc-600">2022-2030E</span>
          </div>
        </div>
        <div className="flex-1 rounded-lg p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-2">Definition and Scope</div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            The complete global market for retail and semi-professional trading software: charting platforms, execution technology, social/copy trading, trade journaling, market intelligence, and AI-powered trading assistants. Covers all liquid asset classes (forex, equities, crypto, futures, options). Includes both subscription SaaS and freemium models. Deliberately excludes institutional terminals ($25K+/yr) and pure algorithmic infrastructure.
          </p>
        </div>
      </div>

      <div>
        <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-3">How We Calculated This Number</div>
        <div className="grid grid-cols-2 gap-2">
          {calculations.map((calc, i) => (
            <motion.div key={calc.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-lg p-3.5 flex items-start gap-3" style={{ background: `${color}03`, border: `1px solid ${color}08` }}>
              <div className="text-[9px] font-bold font-mono w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, color: `${color}80` }}>{i + 1}</div>
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[10px] font-semibold text-zinc-400">{calc.label}</span>
                  <span className="text-sm font-bold font-mono text-white">{calc.value}</span>
                </div>
                <p className="text-[8px] text-zinc-600 leading-relaxed">{calc.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-2">Cross-Industry Comparison: Is $14.2B Reasonable?</div>
        <div className="grid grid-cols-3 gap-2">
          {comparisons.map((c, i) => (
            <div key={c.label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.035)" }}>
              <div className="text-sm font-bold font-mono text-white mb-0.5">{c.value}</div>
              <div className="text-[9px] font-semibold text-zinc-400 mb-0.5">{c.label}</div>
              <div className="text-[8px] text-zinc-600">{c.comp}</div>
              <div className="text-[8px] mt-1" style={{ color: `${color}60` }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-2">Methodology and Validation</div>
        <div className="flex flex-col gap-2">
          {methodology.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: `${color}40` }} />
              <span className="text-[9px] text-zinc-500 leading-relaxed">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[8px] uppercase tracking-wider text-zinc-700 font-semibold">Sources:</span>
        {["Grand View Research (2024)", "Mordor Intelligence (2024)", "Market Research Future (2024)", "Finance Magnates Intelligence (2024)", "Allied Market Research (2023)"].map(s => (
          <span key={s} className="text-[7px] px-2 py-1 rounded-full font-mono" style={{ background: `${color}06`, border: `1px solid ${color}10`, color: `${color}50` }}>{s}</span>
        ))}
      </div>
    </div>
  )
}

function SlideTAMSegments({ accent }: { accent: string }) {
  const color = "#10b981"
  const segments = [
    { name: "Execution & Brokerage Tech", value: "$4.8B", pct: 33.8, cagr: "6.2%", note: "Order management, broker APIs, white-label platforms. MetaQuotes (MT5) dominates with 80%+ market share in forex execution. cTrader emerging as alternative. This is the largest segment but slowest-growing -- mature infrastructure with limited innovation.", leader: "MetaQuotes", leaderRev: "~$180M", color: "#06b6d4" },
    { name: "Charting & Technical Analysis", value: "$3.2B", pct: 22.5, cagr: "8.4%", note: "TradingView is the clear winner at $400M+ ARR and 50M+ users. Growing as retail traders demand professional-grade analysis. Web-based delivery model replaced desktop-only tools. Social features (idea sharing) drive engagement.", leader: "TradingView", leaderRev: "~$400M+", color: "#2962ff" },
    { name: "Market Intelligence & News", value: "$2.1B", pct: 14.8, cagr: "5.8%", note: "Economic calendars, news terminals, sentiment feeds. ForexFactory (11M monthly visits), Investing.com (100M+ visits), Benzinga Pro. Largely ad-supported with premium tiers. Real-time intelligence is the next frontier.", leader: "Investing.com", leaderRev: "~$90M", color: "#f97316" },
    { name: "Social & Copy Trading", value: "$1.8B", pct: 12.7, cagr: "14.1%", note: "Fastest-growing segment. eToro proved the model ($1.2B+ revenue, $3.5B valuation). Expanding via ZuluTrade, NAGA. Projected $5.6B by 2030. Gen Z preference for community-led learning is structural, not cyclical.", leader: "eToro", leaderRev: "~$1.2B+", color: "#5865f2" },
    { name: "AI Trading Assistants", value: "$1.6B", pct: 11.3, cagr: "18.4%", note: "Second-fastest growing. AI-powered chart analysis, pattern recognition, intelligent trade assistants. Expected $5.2B by 2029, $8.2B by 2030. LLMs created a step-function improvement in what AI can do for traders.", leader: "Emerging", leaderRev: "Pre-revenue", color: "#ef4444" },
    { name: "Trade Journaling & Analytics", value: "$680M", pct: 4.8, cagr: "11.3%", note: "TradeZella (~$8M ARR), Edgewonk, Tradervue. Small but rapidly growing as performance data proves journaling improves win rates by 15-30%. Smallest segment but highest percentage of users who actively want to pay.", leader: "TradeZella", leaderRev: "~$8M", color: "#8b5cf6" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-3">Proportional Market Share ($14.2B Total)</div>
        <div className="flex h-10 rounded-lg overflow-hidden gap-0.5">
          {segments.map((seg, i) => (
            <motion.div key={seg.name} initial={{ width: 0 }} animate={{ width: `${seg.pct}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
              className="relative group/seg cursor-default flex items-center justify-center" style={{ background: `${seg.color}25` }}>
              <span className="text-[7px] font-bold font-mono text-white truncate px-1">{seg.pct > 10 ? seg.value : ""}</span>
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/seg:opacity-100 transition-opacity whitespace-nowrap z-20 px-2 py-1.5 rounded text-[8px] font-mono font-bold" style={{ background: seg.color, color: "#fff" }}>
                {seg.name}: {seg.value} ({seg.cagr} CAGR)
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {segments.map((seg, i) => (
          <motion.div key={seg.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            className="rounded-lg p-3.5" style={{ background: `${seg.color}04`, border: `1px solid ${seg.color}10` }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <span className="text-[10px] font-semibold text-zinc-300">{seg.name}</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">{seg.value}</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${seg.color}10`, color: `${seg.color}70` }}>{seg.cagr} CAGR</span>
              <span className="text-[8px] font-mono text-zinc-600">{seg.pct}% of TAM</span>
              <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(148,163,184,0.4)" }}>Leader: {seg.leader} ({seg.leaderRev})</span>
            </div>
            <p className="text-[8px] text-zinc-600 leading-relaxed">{seg.note}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg p-3" style={{ background: `${color}04`, border: `1px solid ${color}10` }}>
        <p className="text-[10px] font-semibold leading-relaxed" style={{ color: `${color}80` }}>
          Critical insight: the two fastest-growing segments (AI at 18.4% and Social at 14.1%) are exactly the categories where Archio has the strongest differentiation. The market is growing fastest in our direction. Meanwhile, every segment leader only dominates one category -- nobody connects them. That is the opportunity.
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDES 5-6: SAM (enhanced with financial context)
   ═══════════════════════════════════════════════════════════════════ */

function SlideSAM({ accent }: { accent: string }) {
  const color = "#06b6d4"
  const funnelSteps = [
    { label: "All retail traders globally", value: "300M+", pct: "100%", note: "Total global retail trading accounts across all asset classes and geographies. Includes anyone who has executed at least one trade in the past 12 months. Sources: BIS, FINRA, FCA, CySEC, ASIC registrations." },
    { label: "Active traders (trade 3x/week+)", value: "~85M", pct: "28.3%", note: "Filtered to traders executing at least 3 trades per week, indicating genuine active engagement. This excludes passive investors, one-time traders, and dormant accounts. These are people who need tools daily." },
    { label: "Pay for at least one tool", value: "~32M", pct: "10.7%", note: "Further filtered to traders paying for at least one tool beyond their broker (charting sub, data feed, community membership, journaling app). This is Archio's directly addressable user base -- people already spending money." },
    { label: "Average annual tool spend", value: "$180/yr", pct: "x $180", note: "Blended across: charting ($48/yr), data feeds ($36/yr), community/signals ($30/yr), journaling ($24/yr), other tools ($42/yr). Excludes broker commissions, spreads, and data costs embedded in broker pricing." },
    { label: "SAM = 32M x $180/yr", value: "$5.76B", pct: "= SAM", note: "Bottom-up calculation. Rounded to $5.8B. Cross-validated: 15 segment leaders have ~$4.2B combined revenue, implying ~30% market concentration. $4.2B / 0.30 = $14B TAM, of which ~41% is paying-user-addressable = $5.74B." },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: `${color}60` }}>Serviceable Addressable Market</div>
          <div className="text-5xl font-bold font-mono text-white">$5.8B</div>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
            <span className="text-sm font-semibold font-mono" style={{ color: `${color}80` }}>9.1% CAGR</span>
            <span className="text-[10px] text-zinc-600">Faster than TAM (paying segment growing disproportionately)</span>
          </div>
        </div>
        <div className="flex-1 rounded-lg p-3.5" style={{ background: `${color}03`, border: `1px solid ${color}08` }}>
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            The SAM represents active, engaged traders who already pay for tools. Archio does not need to create new demand or convince non-payers to start paying. It needs to consolidate <span className="text-white font-semibold">existing spend</span> into a better product. These 32 million traders are already spending $5.8B annually on fragmented solutions. Archio replaces 6 subscriptions with one -- and does it better.
          </p>
        </div>
      </div>

      <div>
        <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-3">Bottom-Up SAM Derivation (step-by-step)</div>
        <div className="flex flex-col gap-1.5">
          {funnelSteps.map((step, i) => (
            <motion.div key={step.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
              className="flex items-center gap-3 rounded-lg p-3 relative"
              style={{ background: i === funnelSteps.length - 1 ? `${color}06` : "rgba(255,255,255,0.012)", border: `1px solid ${i === funnelSteps.length - 1 ? `${color}15` : "rgba(255,255,255,0.05)"}` }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold font-mono" style={{ background: `${color}${i === funnelSteps.length - 1 ? "15" : "08"}`, color: `${color}${i === funnelSteps.length - 1 ? "90" : "50"}` }}>
                {i === funnelSteps.length - 1 ? "=" : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-zinc-400">{step.label}</span>
                <p className="text-[8px] text-zinc-600 leading-relaxed mt-0.5">{step.note}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold font-mono text-white">{step.value}</div>
                <div className="text-[8px] font-mono" style={{ color: `${color}50` }}>{step.pct}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { value: "32M", label: "Paying traders", detail: "10.7% of 300M+ retail traders already pay for tools" },
          { value: "18M", label: "Multi-tool users (3+)", detail: "Highest-value consolidation targets, spend $300+/yr" },
          { value: "$2.5B+", label: "Prop firm eval fees/yr", detail: "Creates pipeline of 3M+ premium tool-seeking traders" },
          { value: "91%", label: "Prop traders want consolidation", detail: "Highest willingness to switch among all segments" },
        ].map((kn, i) => (
          <motion.div key={kn.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.06 }}
            className="rounded-lg p-3 group/kn cursor-default" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="text-base font-bold font-mono text-white mb-0.5">{kn.value}</div>
            <div className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider">{kn.label}</div>
            <div className="text-[7px] text-zinc-700 mt-0.5 opacity-0 group-hover/kn:opacity-100 transition-opacity">{kn.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideSAMAssets({ accent }: { accent: string }) {
  const color = "#06b6d4"
  const assets = [
    { name: "Forex Active Traders", value: "$2.1B", users: "~12M", arpu: "$175/yr", cagr: "8.6%", pct: 36.2, note: "Largest segment. 24/5 markets + multi-pair complexity = highest tool usage frequency. Average forex trader uses 7.2 tools daily -- more than any other asset class. $9.6T daily volume ensures permanent demand.", color: "#10b981" },
    { name: "Crypto Active Traders", value: "$1.4B", users: "~7M", arpu: "$200/yr", cagr: "12.3%", pct: 24.1, note: "Highest per-user spend. DeFi analytics, on-chain tools, portfolio trackers add cost. 24/7 markets intensify always-on need. 580M+ wallets globally with 7M paying for analysis tools.", color: "#f59e0b" },
    { name: "Equities & Options", value: "$1.2B", users: "~8M", arpu: "$150/yr", cagr: "7.8%", pct: 20.7, note: "Lower ARPU as brokers bundle free tools (Thinkorswim, Power E*Trade). Options traders pay more due to strategy complexity. 23% of US equity volume is now retail -- up from 10% in 2019.", color: "#3b82f6" },
    { name: "Prop Firm Traders", value: "$720M", users: "~3M", arpu: "$240/yr", cagr: "15.4%", pct: 12.4, note: "Highest ARPU. Must pass evaluations and maintain funded accounts. $2.5B+ in eval fees creates 3M+ users actively seeking edge. Most likely early adopters -- 91% willingness to consolidate tools.", color: "#8b5cf6" },
    { name: "Futures & Commodities", value: "$380M", users: "~2M", arpu: "$190/yr", cagr: "6.9%", pct: 6.6, note: "Smaller but high-value. Professional-grade requirements. Seasonal patterns and macro sensitivity create demand for integrated intelligence. CME Group retail participation growing 12% annually.", color: "#ef4444" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="col-span-3 text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Asset Class</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Market</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Users</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">ARPU</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">CAGR</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">% SAM</div>
          <div className="col-span-4 text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Analysis</div>
        </div>
        {assets.map((a, i) => (
          <motion.div key={a.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.08 }}
            className="grid grid-cols-12 gap-2 px-4 py-3 items-start"
            style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.035)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
              <span className="text-[10px] font-semibold text-zinc-300">{a.name}</span>
            </div>
            <div className="col-span-1 text-[11px] font-bold font-mono text-white text-right">{a.value}</div>
            <div className="col-span-1 text-[10px] font-mono text-zinc-400 text-right">{a.users}</div>
            <div className="col-span-1 text-[10px] font-mono text-zinc-400 text-right">{a.arpu}</div>
            <div className="col-span-1 text-[10px] font-mono text-right" style={{ color: a.color }}>{a.cagr}</div>
            <div className="col-span-1 text-[10px] font-mono text-zinc-500 text-right">{a.pct}%</div>
            <div className="col-span-4 text-[8px] text-zinc-600 leading-relaxed">{a.note}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-3">SAM Distribution</div>
        <div className="flex flex-col gap-2">
          {assets.map((a, i) => (
            <div key={a.name} className="flex items-center gap-3">
              <span className="text-[9px] font-semibold text-zinc-500 w-28 text-right flex-shrink-0">{a.name}</span>
              <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${a.pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="h-full rounded-md flex items-center px-2" style={{ background: `${a.color}30` }}>
                  <span className="text-[8px] font-bold font-mono text-white whitespace-nowrap">{a.value}</span>
                </motion.div>
              </div>
              <span className="text-[9px] font-mono text-zinc-600 w-12 flex-shrink-0">{a.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDES 7-8: SOM (enhanced with unit economics narrative)
   ═══════════════════════════════════════════════════════════════════ */

function SlideSOM({ accent }: { accent: string }) {
  const color = "#8b5cf6"
  const milestones = [
    { year: "Year 1", users: "50K", revenue: "$3M", arpu: "$60", note: "Launch in forex + crypto. Free tier drives adoption. Community virality + first prop firm partnerships. Focus: product-market fit and retention. Comparable: TradeZella reached $8M ARR in Y2 with journaling alone." },
    { year: "Year 2", users: "200K", revenue: "$18M", arpu: "$90", note: "Pro tier conversion ramps. First B2B prop firm deals close ($5-15K/firm). Marketplace soft-launch. 4x user growth from Year 1 driven by network effects. NRR begins climbing as users upgrade tiers." },
    { year: "Year 3", users: "500K", revenue: "$72M", arpu: "$144", note: "Equities and futures asset classes added. Marketplace revenue contribution meaningful at 8% of revenue. International expansion begins (EU + CIS). Community network effects create organic growth engine." },
    { year: "Year 4", users: "900K", revenue: "$195M", arpu: "$217", note: "Full asset-class coverage. Data intelligence API launches (hedge fund clients). Institutional tier ($99/mo) adoption grows. 130%+ NRR drives ARPU expansion without new user acquisition." },
    { year: "Year 5", users: "1.4M", revenue: "$420M", arpu: "$300", note: "Full SOM realization. 7.2% SAM penetration (conservative vs TradingView 16%). Four diversified revenue streams. Platform flywheel at speed: more users drive more data drive better AI drive more users." },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: `${color}60` }}>Serviceable Obtainable Market</div>
          <div className="text-5xl font-bold font-mono text-white">$420M</div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-semibold" style={{ color: `${color}80` }}>Year 5 ARR Target</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: `${color}10`, color: `${color}70` }}>7.2% SAM penetration</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-2">
          {[
            { label: "Target users (Y5)", value: "1.4M", sub: "From 50K Y1" },
            { label: "Blended ARPU", value: "$300/yr", sub: "50% Basic, 35% Pro, 15% Inst" },
            { label: "SAM penetration", value: "7.2%", sub: "Conservative vs TV at 16%" },
            { label: "Net revenue retention", value: "130%+", sub: "Expansion revenue > churn" },
          ].map((kn) => (
            <div key={kn.label} className="rounded-lg p-3" style={{ background: `${color}04`, border: `1px solid ${color}10` }}>
              <div className="text-sm font-bold font-mono text-white">{kn.value}</div>
              <div className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider">{kn.label}</div>
              <div className="text-[7px] mt-0.5" style={{ color: `${color}50` }}>{kn.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-3">Year-by-Year Revenue Ramp</div>
        <div className="flex flex-col gap-1.5">
          {milestones.map((ms, i) => {
            const widthPct = i === 0 ? 5 : i === 1 ? 15 : i === 2 ? 35 : i === 3 ? 65 : 100
            return (
              <motion.div key={ms.year} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                className="rounded-lg p-3" style={{ background: i === 4 ? `${color}06` : "rgba(255,255,255,0.012)", border: `1px solid ${i === 4 ? `${color}15` : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold" style={{ color: i === 4 ? color : "rgba(255,255,255,0.7)" }}>{ms.year}</span>
                    <span className="text-[9px] font-mono text-zinc-500">{ms.users} users</span>
                    <span className="text-[9px] font-mono text-zinc-500">ARPU: {ms.arpu}</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{ms.revenue}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: `${color}${i === 4 ? "50" : "25"}` }} initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }} />
                </div>
                <p className="text-[8px] text-zinc-600 leading-relaxed">{ms.note}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SlideSOMRevenue({ accent }: { accent: string }) {
  const color = "#8b5cf6"
  const streams = [
    { name: "Core Subscriptions", value: "$252M", pct: 60, color: "#10b981",
      tiers: [
        { name: "Basic ($19/mo)", mix: "50%", users: "700K", revenue: "$152M", arpu: "$228/yr" },
        { name: "Pro ($49/mo)", mix: "35%", users: "490K", revenue: "$72M", arpu: "$588/yr" },
        { name: "Institutional ($99/mo)", mix: "15%", users: "210K", revenue: "$28M", arpu: "$1,188/yr" },
      ],
      note: "Tier distribution based on SaaS benchmarks (Slack, Notion, Figma): 50/35/15 consumer-prosumer split. ARPU increases over time as users upgrade and use more features. Expected NRR: 130%+."
    },
    { name: "Prop Firm B2B Partnerships", value: "$84M", pct: 20, color: "#06b6d4",
      tiers: [
        { name: "White-label dashboard", mix: "60%", users: "7,200 firms", revenue: "$50.4M", arpu: "$7K/yr" },
        { name: "API integration", mix: "30%", users: "3,600 firms", revenue: "$25.2M", arpu: "$7K/yr" },
        { name: "Custom enterprise", mix: "10%", users: "1,200 firms", revenue: "$8.4M", arpu: "$7K/yr" },
      ],
      note: "1,200+ prop firms competing for trader talent. Archio white-label tools help firms differentiate. This channel also drives consumer user acquisition as funded traders discover Archio through their firm."
    },
    { name: "Marketplace & Premium Content", value: "$50.4M", pct: 12, color: "#f97316",
      tiers: [
        { name: "Strategy marketplace", mix: "45%", users: "GMV $151M", revenue: "$22.7M", arpu: "15% take" },
        { name: "Verified mentor subscriptions", mix: "35%", users: "GMV $117M", revenue: "$17.6M", arpu: "15% take" },
        { name: "Educational content", mix: "20%", users: "GMV $67M", revenue: "$10.1M", arpu: "15% take" },
      ],
      note: "Platform fee of 15% on GMV (comparable to App Store 15-30%, Substack 10%). Verified track records solve the $800M trust deficit. Marketplace creates retention flywheel -- users stay for the community."
    },
    { name: "Data Intelligence API", value: "$33.6M", pct: 8, color: "#ef4444",
      tiers: [
        { name: "Anonymized aggregate data", mix: "50%", users: "Enterprise", revenue: "$16.8M", arpu: "License" },
        { name: "Intelligence API", mix: "35%", users: "Hedge funds", revenue: "$11.8M", arpu: "Usage" },
        { name: "Research partnerships", mix: "15%", users: "Academic/Gov", revenue: "$5.0M", arpu: "Annual" },
      ],
      note: "Highest margin stream (90%+). Anonymized, aggregate trading behavior data from 1.4M users is enormously valuable to hedge funds, researchers, and financial institutions. Grows in value with scale."
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
        {streams.map((s, i) => (
          <motion.div key={s.name} initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="flex items-center justify-center" style={{ background: `${s.color}30` }}>
            <span className="text-[8px] font-bold font-mono text-white truncate px-1">{s.pct}%</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {streams.map((stream, si) => (
          <motion.div key={stream.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + si * 0.1 }}
            className="rounded-xl p-4" style={{ background: `${stream.color}04`, border: `1px solid ${stream.color}12` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: stream.color }} />
                <span className="text-[11px] font-bold text-zinc-300">{stream.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">{stream.value}</div>
                <div className="text-[8px] font-mono" style={{ color: `${stream.color}60` }}>{stream.pct}% of SOM</div>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              {stream.tiers.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between px-2 py-1.5 rounded" style={{ background: "rgba(255,255,255,0.015)" }}>
                  <span className="text-[8px] text-zinc-500">{tier.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-zinc-600">{tier.mix}</span>
                    <span className="text-[8px] font-mono font-semibold text-zinc-400">{tier.arpu}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-zinc-600 leading-relaxed">{stream.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDES 9-11: Projections, Regional, Drivers (enhanced)
   ═══════════════════════════════════════════════════════════════════ */

function SlideProjections({ accent }: { accent: string }) {
  const tiers = [
    { label: "TAM", color: "#10b981", data: [
      { year: "2022", value: "$10.8B", raw: 10.8 }, { year: "2023", value: "$11.6B", raw: 11.6 },
      { year: "2024", value: "$12.5B", raw: 12.5 }, { year: "2025", value: "$13.3B", raw: 13.3 },
      { year: "2026E", value: "$14.2B", raw: 14.2 }, { year: "2028E", value: "$16.8B", raw: 16.8 },
      { year: "2030E", value: "$19.5B", raw: 19.5 },
    ]},
    { label: "SAM", color: "#06b6d4", data: [
      { year: "2022", value: "$3.9B", raw: 3.9 }, { year: "2023", value: "$4.3B", raw: 4.3 },
      { year: "2024", value: "$4.8B", raw: 4.8 }, { year: "2025", value: "$5.3B", raw: 5.3 },
      { year: "2026E", value: "$5.8B", raw: 5.8 }, { year: "2028E", value: "$7.4B", raw: 7.4 },
      { year: "2030E", value: "$9.2B", raw: 9.2 },
    ]},
    { label: "SOM", color: "#8b5cf6", data: [
      { year: "Y1", value: "$3M", raw: 0.003 }, { year: "Y2", value: "$18M", raw: 0.018 },
      { year: "Y3", value: "$72M", raw: 0.072 }, { year: "Y4", value: "$195M", raw: 0.195 },
      { year: "Y5", value: "$420M", raw: 0.42 },
    ]},
  ]
  const maxVal = 19.5

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        {tiers.slice(0, 2).map((tier) => (
          <div key={tier.label} className="rounded-xl p-4" style={{ background: `${tier.color}03`, border: `1px solid ${tier.color}10` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tier.color }} />
                <span className="text-[10px] font-bold" style={{ color: `${tier.color}80` }}>{tier.label}</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">{tier.data[tier.data.length - 1].value}</span>
            </div>
            <div className="flex items-end gap-1.5 h-28">
              {tier.data.map((d, i) => {
                const height = (d.raw / maxVal) * 100
                const isEst = d.year.includes("E")
                return (
                  <motion.div key={d.year} className="flex-1 flex flex-col items-center gap-1 group/b cursor-default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                    <div className="text-[7px] font-bold font-mono opacity-0 group-hover/b:opacity-100 transition-opacity whitespace-nowrap" style={{ color: tier.color }}>{d.value}</div>
                    <motion.div className="w-full rounded-t-md" style={{ background: isEst ? `${tier.color}15` : `${tier.color}25`, border: `1px solid ${tier.color}${isEst ? "20" : "35"}`, borderBottom: "none", borderStyle: isEst ? "dashed" : "solid" }}
                      initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }} />
                    <span className="text-[7px] font-mono" style={{ color: isEst ? `${tier.color}40` : "rgba(148,163,184,0.3)" }}>{d.year}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: `${tiers[2].color}03`, border: `1px solid ${tiers[2].color}10` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: tiers[2].color }} />
            <span className="text-[10px] font-bold" style={{ color: `${tiers[2].color}80` }}>SOM Revenue Ramp (Year 1-5)</span>
          </div>
          <span className="text-sm font-bold font-mono text-white">$420M ARR</span>
        </div>
        <div className="flex items-end gap-3 h-32">
          {tiers[2].data.map((d, i) => {
            const heights = [2, 8, 28, 60, 100]
            return (
              <motion.div key={d.year} className="flex-1 flex flex-col items-center gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="text-[9px] font-bold font-mono" style={{ color: tiers[2].color }}>{d.value}</div>
                <motion.div className="w-full rounded-t-lg" style={{ background: `${tiers[2].color}${i === 4 ? "30" : "15"}`, border: `1px solid ${tiers[2].color}${i === 4 ? "40" : "20"}`, borderBottom: "none" }}
                  initial={{ height: 0 }} animate={{ height: `${heights[i]}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }} />
                <span className="text-[8px] font-mono text-zinc-500">{d.year}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "TAM CAGR", value: "7.2%", note: "Blended across 6 sub-segments. Conservative." },
          { label: "SAM CAGR", value: "9.1%", note: "Paying segment growing faster than overall market." },
          { label: "SOM Y5 Penetration", value: "7.2%", note: "Conservative. TradingView achieved 16% with charting only." },
        ].map((a) => (
          <div key={a.label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="text-base font-bold font-mono text-white">{a.value}</div>
            <div className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider">{a.label}</div>
            <div className="text-[7px] text-zinc-700 mt-0.5">{a.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideRegional({ accent }: { accent: string }) {
  const regions = [
    { name: "North America", traders: "45M", pct: 15, growth: "8%", spend: "$65/mo", penetration: "High", note: "Most mature market. Robinhood added 23M accounts since 2020. US retail is now 23% of equity volume. Options trading surged 35% YoY. Strong prop firm ecosystem. Highest ARPU globally.", color: "#3b82f6" },
    { name: "Europe (EU + UK)", traders: "42M", pct: 14, growth: "10%", spend: "$52/mo", penetration: "High", note: "MiFID II driving compliance demand. UK is the global forex hub (43% of forex volume). Strong prop firm adoption. eToro's largest market. Cross-border trading creates multi-currency complexity.", color: "#10b981" },
    { name: "Asia-Pacific", traders: "95M", pct: 31.7, growth: "18%", spend: "$28/mo", penetration: "Medium", note: "Largest region by trader count. Japan (20M traders), South Korea (8M), India (25M+, growing 30% YoY). Mobile-first culture. India's NSE is now the world's largest exchange by derivatives volume.", color: "#f59e0b" },
    { name: "Southeast Asia", traders: "35M", pct: 11.7, growth: "25%", spend: "$18/mo", penetration: "Low", note: "Fastest-growing region globally. Philippines, Vietnam, Thailand, Indonesia driving growth. Mobile-native (92% mobile usage). Community-driven discovery via TikTok and YouTube. Forex and crypto dominant.", color: "#06b6d4" },
    { name: "Middle East & Africa", traders: "28M", pct: 9.3, growth: "22%", spend: "$22/mo", penetration: "Low", note: "Dubai emerging as global fintech hub (DIFC, ADGM). Nigeria (12M traders), South Africa, Kenya driving African growth. UAE prop firm scene is booming. Young demographics.", color: "#ef4444" },
    { name: "Latin America", traders: "25M", pct: 8.3, growth: "20%", spend: "$20/mo", penetration: "Low", note: "Brazil (15M traders on B3), Mexico, Colombia lead. Currency volatility in ARS, BRL drives forex interest. NuBank and MercadoLibre created fintech infrastructure enabling trading access.", color: "#8b5cf6" },
    { name: "CIS & Eastern Europe", traders: "30M", pct: 10, growth: "12%", spend: "$32/mo", penetration: "Medium", note: "Strong forex trading culture. Ukraine, Kazakhstan have active communities. MetaTrader deeply entrenched due to Russian-origin development. Growing demand for modern, web-based alternatives.", color: "#ec4899" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="grid grid-cols-12 gap-1 px-4 py-2" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="col-span-2 text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Region</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Traders</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Share</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Growth</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Spend</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-center">Maturity</div>
          <div className="col-span-5 text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Analysis</div>
        </div>
        {regions.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 + i * 0.06 }}
            className="grid grid-cols-12 gap-1 px-4 py-2.5 items-start" style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.035)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="col-span-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
              <span className="text-[9px] font-semibold text-zinc-300">{r.name}</span>
            </div>
            <div className="col-span-1 text-[10px] font-mono text-zinc-400 text-right">{r.traders}</div>
            <div className="col-span-1 text-[10px] font-mono text-zinc-500 text-right">{r.pct}%</div>
            <div className="col-span-1 text-[10px] font-mono font-semibold text-right" style={{ color: r.color }}>{r.growth}</div>
            <div className="col-span-1 text-[10px] font-mono text-zinc-400 text-right">{r.spend}</div>
            <div className="col-span-1 flex justify-center">
              <span className="text-[7px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: r.penetration === "High" ? "rgba(16,185,129,0.1)" : r.penetration === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", color: r.penetration === "High" ? "#10b981" : r.penetration === "Medium" ? "#f59e0b" : "#ef4444" }}>{r.penetration}</span>
            </div>
            <div className="col-span-5 text-[8px] text-zinc-600 leading-relaxed">{r.note}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: `${accent}04`, border: `1px solid ${accent}12` }}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: `${accent}50` }}>Archio Go-to-Market Prioritization</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { phase: "Phase 1 (Y1-Y2)", regions: "North America, UK, Australia", rationale: "English-speaking, highest ARPU ($52-65/mo), mature prop firm ecosystem. 87M traders. Product-market fit before scaling." },
            { phase: "Phase 2 (Y2-Y3)", regions: "Europe, CIS", rationale: "MiFID II tailwinds, strong forex culture. 72M traders. Localization for 5 languages. Regulatory compliance as competitive moat." },
            { phase: "Phase 3 (Y3-Y5)", regions: "APAC, SEA, LATAM, MEA", rationale: "Fastest growth (18-25% YoY). 183M traders. Mobile-first design advantage. Volume play -- lower ARPU but massive user count." },
          ].map((phase) => (
            <div key={phase.phase} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="text-[9px] font-bold" style={{ color: `${accent}70` }}>{phase.phase}</div>
              <div className="text-[10px] font-semibold text-zinc-300 mt-1">{phase.regions}</div>
              <p className="text-[8px] text-zinc-600 leading-relaxed mt-1">{phase.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SlideDrivers({ accent }: { accent: string }) {
  const drivers = [
    { icon: Users, metric: "300M+", label: "Global Retail Traders", trend: "12% YoY", color: "#10b981", detail: "Tripled since 2019. India, SEA, LATAM at 25-30% annual growth. Average age dropped from 42 to 28. This is a generational shift. Robinhood alone added 23M accounts. eToro has 35M registered users.", yoy: ["2019: ~95M", "2020: ~140M", "2021: ~185M", "2022: ~210M", "2023: ~250M", "2024: ~300M+"] },
    { icon: BarChart3, metric: "1,200+", label: "Prop Trading Firms", trend: "25% YoY", color: "#06b6d4", detail: "Up from <50 in 2018. $2.5B+ in evaluation fees (2024). FTMO alone processed 500K+ evaluations. Creates 3M+ traders who urgently need professional tools at accessible prices. Highest-value segment at $240/yr ARPU.", yoy: ["2018: ~50", "2019: ~90", "2020: ~180", "2021: ~380", "2022: ~650", "2023: ~900", "2024: 1,200+"] },
    { icon: Globe, metric: "14.1%", label: "Social Trading CAGR", trend: "Fastest segment", color: "#5865f2", detail: "$1.8B to $5.6B by 2030. eToro proved the model at $1.2B+ revenue. Gen Z prefers community-led learning over courses. 70-80% trust deficit = massive verification opportunity. Social features drive retention 3x.", yoy: ["2020: $0.7B", "2021: $0.9B", "2022: $1.2B", "2023: $1.5B", "2024: $1.8B", "2030E: $5.6B"] },
    { icon: Cpu, metric: "$2.4B", label: "AI in Fintech Trading", trend: "18.4% CAGR", color: "#f97316", detail: "72% of traders would pay for AI trade validation. LLMs created step-function improvement. Current AI tools analyze data in isolation. Archio AI sees the full context: chart + community + journal + news = intelligence no standalone tool can match.", yoy: ["2020: $0.8B", "2021: $1.1B", "2022: $1.5B", "2023: $1.9B", "2024: $2.4B", "2030E: $8.2B"] },
    { icon: Activity, metric: "67%", label: "Mobile-First Traders", trend: "Shifting fast", color: "#8b5cf6", detail: "67% of traders aged 18-34 start on mobile. In emerging markets: 85%+. Cross-device continuity is the new table stakes. Desktop-first tools (MetaTrader, NinjaTrader) losing next-gen traders. India's Zerodha: 90% mobile.", yoy: ["2019: 32%", "2020: 41%", "2021: 48%", "2022: 55%", "2023: 61%", "2024: 67%"] },
    { icon: Shield, metric: "45+", label: "Regulated Markets", trend: "Accelerating", color: "#ef4444", detail: "Up from <20 in 2018. EU MiFID II, US FINRA, UK FCA, Australia ASIC. Regulatory focus shifting to platform-level transparency. Mandatory performance disclosure for signal providers being considered. Compliance is a moat.", yoy: ["2018: <20", "2019: 22", "2020: 26", "2021: 30", "2022: 35", "2023: 40", "2024: 45+"] },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {drivers.map((d, i) => {
        const Icon = d.icon
        return (
          <motion.div key={d.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-xl p-4" style={{ background: `${d.color}04`, border: `1px solid ${d.color}12` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${d.color}10`, border: `1px solid ${d.color}20` }}>
                <Icon className="w-4 h-4" style={{ color: d.color }} />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold font-mono text-white leading-none">{d.metric}</div>
                <div className="text-[9px] font-semibold text-zinc-400">{d.label}</div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: `${d.color}08`, border: `1px solid ${d.color}12` }}>
                <TrendingUp className="w-2.5 h-2.5" style={{ color: `${d.color}60` }} />
                <span className="text-[7px] font-semibold" style={{ color: `${d.color}70` }}>{d.trend}</span>
              </div>
            </div>
            <p className="text-[9px] text-zinc-500 leading-relaxed mb-3">{d.detail}</p>
            <div className="flex items-end gap-1 h-10">
              {d.yoy.map((y, yi) => {
                const height = 15 + (yi / (d.yoy.length - 1)) * 85
                return (
                  <motion.div key={yi} className="flex-1 rounded-t-sm group/bar cursor-default relative" style={{ background: `${d.color}${yi === d.yoy.length - 1 ? "30" : "12"}` }}
                    initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.4 + yi * 0.05, duration: 0.3 }}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[6px] font-mono whitespace-nowrap" style={{ color: d.color }}>{y}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDES 12-14: Competitive, Scenarios, Investment Thesis
   ═══════════════════════════════════════════════════════════════════ */

function SlideCompetitive({ accent }: { accent: string }) {
  const competitors = [
    { name: "TradingView", category: "Charting", users: "50M+", revenue: "$400M+", caps: [true, false, true, false, false, false], color: "#2962ff", why: "Monetizes screen time on charts. Adding execution undermines broker partnerships that drive 40% of revenue." },
    { name: "MetaTrader 5", category: "Execution", users: "15M+", revenue: "License", caps: [true, true, false, false, false, false], color: "#06b6d4", why: "Sells software licenses to brokers. Broker customers would revolt if MetaQuotes competed with them on community or intelligence." },
    { name: "Discord/Telegram", category: "Community", users: "5M+", revenue: "Platform", caps: [false, false, true, false, false, false], color: "#5865f2", why: "General-purpose communication. No financial data integration, no trade verification, no execution. Would require rebuilding from scratch." },
    { name: "TradeZella", category: "Journaling", users: "100K+", revenue: "~$8M ARR", caps: [false, false, false, true, false, false], color: "#8b5cf6", why: "VC-backed single-category tool. Adding charting or execution would require 10x their current engineering team and data licensing costs." },
    { name: "ForexFactory", category: "Intel", users: "3M+", revenue: "Ads", caps: [false, false, true, false, true, false], color: "#f97316", why: "Ad-supported model. Free content drives traffic. Adding paid tools would cannibalize ad revenue from the free user base." },
    { name: "Archio", category: "UNIFIED", users: "Launch", revenue: "Target $420M", caps: [true, true, true, true, true, true], color: "#10b981", why: "Purpose-built from day one to unify all six categories. No legacy business model conflict. No technical debt from single-category origins." },
  ]
  const capLabels = ["Chart", "Exec", "Social", "Journal", "Intel", "AI"]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="grid grid-cols-12 gap-1 px-4 py-2.5" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="col-span-2 text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Platform</div>
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-right">Users</div>
          {capLabels.map(c => (
            <div key={c} className="col-span-1 text-[7px] uppercase tracking-wider font-semibold text-zinc-600 text-center">{c}</div>
          ))}
          <div className="col-span-1 text-[8px] uppercase tracking-wider font-semibold text-zinc-600 text-center">Score</div>
          <div className="col-span-2 text-[8px] uppercase tracking-wider font-semibold text-zinc-600">Why They Cannot Expand</div>
        </div>
        {competitors.map((comp, i) => {
          const score = comp.caps.filter(Boolean).length
          const isArchio = comp.name === "Archio"
          return (
            <motion.div key={comp.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="grid grid-cols-12 gap-1 px-4 py-2.5 items-center"
              style={{ background: isArchio ? `${comp.color}06` : i % 2 === 0 ? "rgba(255,255,255,0.035)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: isArchio ? `2px solid ${comp.color}40` : "2px solid transparent" }}>
              <div className="col-span-2 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: comp.color }} />
                <span className={`text-[10px] font-semibold ${isArchio ? "text-white" : "text-zinc-300"}`}>{comp.name}</span>
              </div>
              <div className="col-span-1 text-[10px] font-mono text-zinc-400 text-right">{comp.users}</div>
              {comp.caps.map((has, ci) => (
                <div key={ci} className="col-span-1 flex justify-center">
                  {has ? <Check className="w-3.5 h-3.5" style={{ color: isArchio ? "#10b981" : comp.color }} /> : <X className="w-3 h-3 text-zinc-800" />}
                </div>
              ))}
              <div className="col-span-1 flex justify-center">
                <span className={`text-[10px] font-bold font-mono ${isArchio ? "text-white" : "text-zinc-500"}`} style={isArchio ? { color: comp.color } : {}}>{score}/6</span>
              </div>
              <div className="col-span-2 text-[7px] text-zinc-600 leading-relaxed">{comp.why}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}>
        <div className="flex items-start gap-3">
          <Diamond className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "rgba(16,185,129,0.5)" }} />
          <p className="text-[10px] font-semibold leading-relaxed" style={{ color: "rgba(16,185,129,0.8)" }}>
            No competitor scores above 2/6. Each is structurally locked into their category by business model incentives. This is not a feature gap -- it is a business model impossibility for incumbents. The only way to score 6/6 is to build from scratch with unification as the founding principle. That is Archio.
          </p>
        </div>
      </div>
    </div>
  )
}

function SlideScenarios({ accent }: { accent: string }) {
  const scenarios = [
    { name: "Bear Case", color: "#ef4444", icon: AlertTriangle, y5Revenue: "$180M", y5Users: "600K", arpu: "$300", samPenetration: "3.1%",
      assumptions: ["60% of base plan user acquisition", "8% monthly churn vs 5% base", "Prop firm partnerships delayed to Year 3", "Competitive response from TradingView adding execution", "Lower marketplace adoption; delayed data API"],
      metrics: { cac: "$45", ltv: "$720", ltvCac: "16x", grossMargin: "72%", burnMultiple: "2.8x" },
      verdict: "Even at 60% of plan, $180M ARR at 3.1% penetration produces a venture-scale outcome with healthy unit economics (16x LTV/CAC). This is the downside protection."
    },
    { name: "Base Case", color: "#10b981", icon: Target, y5Revenue: "$420M", y5Users: "1.4M", arpu: "$300", samPenetration: "7.2%",
      assumptions: ["Execution per financial model", "50K Y1 to 1.4M Y5", "5% monthly churn, 130%+ NRR", "Prop firm B2B at 20% of revenue", "Marketplace + data API on schedule"],
      metrics: { cac: "$35", ltv: "$900", ltvCac: "25.7x", grossMargin: "78%", burnMultiple: "1.8x" },
      verdict: "Base case produces $420M ARR at 7.2% SAM penetration -- half of TradingView's penetration with 6x more workflow coverage. 25.7x LTV/CAC indicates capital-efficient growth."
    },
    { name: "Bull Case", color: "#3b82f6", icon: TrendingUp, y5Revenue: "$780M", y5Users: "2.2M", arpu: "$355", samPenetration: "11.3%",
      assumptions: ["140% of base plan (viral growth)", "3.5% monthly churn from network effects", "Prop firm adoption at 30% of revenue", "AI Copilot as breakout organic driver", "International expansion starts Year 2"],
      metrics: { cac: "$28", ltv: "$1,280", ltvCac: "45.7x", grossMargin: "82%", burnMultiple: "1.2x" },
      verdict: "Bull case at $780M ARR with 45.7x LTV/CAC and 82% gross margins. Comparable to Figma's trajectory: 4 years from launch to $400M+ ARR with similar network effects driving growth."
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {scenarios.map((s, si) => {
          const Icon = s.icon
          return (
            <motion.div key={s.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + si * 0.12 }}
              className="rounded-xl p-5 flex flex-col" style={{ background: `${s.color}04`, border: `1px solid ${s.color}15` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-[11px] font-bold" style={{ color: s.color }}>{s.name}</div>
                  <div className="text-[8px] text-zinc-600">Year 5</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg p-2.5" style={{ background: `${s.color}06` }}>
                  <div className="text-xl font-bold font-mono text-white">{s.y5Revenue}</div>
                  <div className="text-[7px] uppercase tracking-wider text-zinc-600 font-semibold">ARR</div>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: `${s.color}06` }}>
                  <div className="text-xl font-bold font-mono text-white">{s.y5Users}</div>
                  <div className="text-[7px] uppercase tracking-wider text-zinc-600 font-semibold">Users</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${s.color}08`, color: `${s.color}70` }}>ARPU: {s.arpu}</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${s.color}08`, color: `${s.color}70` }}>SAM: {s.samPenetration}</span>
              </div>
              <div className="text-[8px] uppercase tracking-wider font-semibold text-zinc-600 mb-1.5">Key Assumptions</div>
              <div className="flex flex-col gap-1 mb-3 flex-1">
                {s.assumptions.map((a, ai) => (
                  <div key={ai} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: `${s.color}40` }} />
                    <span className="text-[8px] text-zinc-500 leading-relaxed">{a}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg p-2.5 mb-2" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-[7px] uppercase tracking-wider font-semibold text-zinc-600 mb-1.5">Unit Economics</div>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(s.metrics).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="text-[9px] font-bold font-mono text-white">{val}</div>
                      <div className="text-[6px] uppercase tracking-wider text-zinc-700">{key === "ltvCac" ? "LTV/CAC" : key === "grossMargin" ? "Margin" : key === "burnMultiple" ? "Burn" : key.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[8px] leading-relaxed" style={{ color: `${s.color}70` }}>{s.verdict}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-zinc-600 mb-2">Sensitivity Analysis</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-[9px] text-zinc-500 leading-relaxed">
            <span className="font-semibold text-zinc-400">Churn sensitivity:</span> 1% improvement in monthly churn (5% to 4%) increases Y5 ARR by ~$65M (+15.5%). Churn is the single highest-leverage metric. Community features and network effects are Archio&apos;s primary churn reduction mechanism.
          </div>
          <div className="text-[9px] text-zinc-500 leading-relaxed">
            <span className="font-semibold text-zinc-400">ARPU sensitivity:</span> $50/yr increase in ARPU ($300 to $350) adds ~$70M to Y5 ARR (+16.7%). ARPU expansion is driven by tier upgrades, marketplace adoption, and data API -- all of which improve with scale and compound over time.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 14: INVESTMENT THESIS -- Why Now, Why Archio
   ═══════════════════════════════════════════════════════════════════ */

function SlideThesis({ accent }: { accent: string }) {
  const forces = [
    { title: "Market Maturity: 300M+ Traders Creates Critical Mass", icon: Users, color: "#10b981",
      detail: "In 2019, there were ~95M retail traders. Today: 300M+. This 3x growth created the market density required for a unified platform. Below 100M, the TAM was too small. Above 300M, fragmentation pain is acute enough that traders actively seek consolidation (78% willingness). The timing is now because the market is big enough to matter and fragmented enough to hurt." },
    { title: "AI Inflection: LLMs Enable Cross-Category Intelligence", icon: Cpu, color: "#f97316",
      detail: "Before 2023, AI trading tools could only analyze data within a single category (chart patterns OR news OR sentiment). LLMs can now synthesize information across categories: reading your chart annotations, your journal notes, community signals, and news simultaneously to provide contextual intelligence. This was technically impossible 3 years ago. Archio is built for this moment." },
    { title: "Incumbent Lock-In: Business Models Prevent Expansion", icon: Shield, color: "#8b5cf6",
      detail: "TradingView makes $400M+ from charting. Adding execution would threaten broker partnerships (40% of revenue). MetaTrader sells licenses to brokers; competing with them on community is suicidal. Discord is a general platform; rebuilding for finance would take years. Each incumbent is structurally trapped. This creates a permanent window for a new entrant built for unification from day one." },
    { title: "Trust Crisis: $800M Verification Gap Demands a Solution", icon: ShieldAlert, color: "#ef4444",
      detail: "70-80% of traders do not trust influencer claims. The social trading market ($1.8B, 14.1% CAGR) is growing despite a massive trust deficit. The first platform to solve verification -- auditable track records, transparent performance history, verified mentorship -- captures the fastest-growing segment. No incumbent has the cross-category data to do this. Archio does." },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[12px] text-zinc-300 leading-relaxed">
          Archio is not a bet on a single trend. It is a bet on <span className="text-white font-semibold">four converging forces</span> that individually are significant and together are transformative. Each force makes the opportunity larger, more urgent, and more defensible. None of these forces existed at current magnitude 3 years ago. All four are accelerating. The window for a new entrant is open now -- and it will not stay open indefinitely.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {forces.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
              className="rounded-xl p-5" style={{ background: `${f.color}03`, border: `1px solid ${f.color}10` }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${f.color}08`, border: `1px solid ${f.color}15` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: `${f.color}70` }} />
                </div>
                <div className="text-[11px] font-bold text-zinc-200 leading-tight flex-1">{f.title}</div>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed">{f.detail}</p>
            </motion.div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="rounded-xl p-5" style={{ background: `${accent}05`, border: `1px solid ${accent}15` }}>
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `${accent}60` }} />
          <div>
            <div className="text-sm font-bold text-white mb-1.5">The Bottom Line for Investors</div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Archio addresses a <span className="font-semibold text-white">$14.2B market</span> that is growing at 7.2% CAGR, with the fastest segments (AI, social) growing at 14-18% directly in Archio&apos;s direction. There are <span className="font-semibold text-white">32M paying users</span> already spending $5.8B/yr on fragmented tools. <span className="font-semibold text-white">78% want to consolidate</span>. No competitor can expand beyond 2/6 categories due to structural business model conflicts. The same pattern -- fragmentation to unification -- produced $20B (Figma), $30B+ (HubSpot), and $11B (GitLab) outcomes in other markets. Archio targets <span className="font-semibold text-white">$420M ARR</span> by Year 5 at 7.2% penetration -- conservative, defensible, and venture-scale.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ORCHESTRATOR: NAVIGATION & SLIDE RENDERER
   ═══════════════════════════════════════════════════════════════════ */

function CursorSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current?.parentElement
    if (!container) return
    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setVisible(true)
    }
    const handleLeave = () => setVisible(false)
    container.addEventListener("mousemove", handleMove)
    container.addEventListener("mouseleave", handleLeave)
    return () => {
      container.removeEventListener("mousemove", handleMove)
      container.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full transition-opacity duration-500"
        style={{ left: pos.x - 300, top: pos.y - 300, background: "radial-gradient(circle, rgba(255,255,255,0.012) 0%, transparent 70%)", opacity: visible ? 1 : 0 }} />
    </div>
  )
}

export function MarketOpportunitySlide({ accent }: { accent: string }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = SLIDES.length

  const goNext = useCallback(() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1)), [totalSlides])
  const goPrev = useCallback(() => setCurrentSlide(prev => Math.max(prev - 1, 0)), [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext() }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goNext, goPrev])

  const slide = SLIDES[currentSlide]

  const renderSlide = () => {
    switch (slide.id) {
      case "macro": return <SlideMacro accent={accent} />
      case "disruption": return <SlideDisruption accent={accent} />
      case "overview": return <SlideOverview accent={accent} />
      case "tam": return <SlideTAM accent={accent} />
      case "tam-segments": return <SlideTAMSegments accent={accent} />
      case "sam": return <SlideSAM accent={accent} />
      case "sam-assets": return <SlideSAMAssets accent={accent} />
      case "som": return <SlideSOM accent={accent} />
      case "som-revenue": return <SlideSOMRevenue accent={accent} />
      case "projections": return <SlideProjections accent={accent} />
      case "regional": return <SlideRegional accent={accent} />
      case "drivers": return <SlideDrivers accent={accent} />
      case "competitive": return <SlideCompetitive accent={accent} />
      case "scenarios": return <SlideScenarios accent={accent} />
      case "thesis": return <SlideThesis accent={accent} />
      default: return null
    }
  }

  return (
    <div className="relative rounded-2xl overflow-hidden select-none" style={{ background: "linear-gradient(135deg, #0c1220 0%, #080e1a 50%, #0a0f18 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-15%", left: "20%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }} animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-10%", right: "10%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }} animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <motion.div className="absolute w-[700px] h-[700px] rounded-full" style={{ right: "-12%", top: "-25%", background: `radial-gradient(circle, ${accent}04 0%, transparent 70%)` }} animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <CursorSpotlight />

      <div className="relative z-10 px-6 md:px-10 pt-6 pb-5">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full" style={{ background: "rgba(148,163,184,0.3)" }} />
            <span className="text-[9px] uppercase tracking-[0.25em] font-semibold" style={{ color: "rgba(148,163,184,0.3)" }}>Market Opportunity</span>
            <div className="w-12 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
            <span className="text-[9px] font-mono" style={{ color: `${accent}40` }}>
              {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goPrev} disabled={currentSlide === 0} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-20"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }} aria-label="Previous slide">
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <button onClick={goNext} disabled={currentSlide === totalSlides - 1} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-20"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }} aria-label="Next slide">
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={slide.id + "-title"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight text-balance mb-1">{slide.title}</h2>
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-3xl">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
            {renderSlide()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => setCurrentSlide(i)}
              className="group/dot relative flex-1 h-1 rounded-full transition-all duration-300 cursor-pointer"
              style={{ background: i === currentSlide ? accent : i < currentSlide ? `${accent}30` : "rgba(255,255,255,0.04)" }}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded text-[7px] font-semibold z-30"
                style={{ background: "rgba(0,0,0,0.9)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {s.title.length > 30 ? s.title.slice(0, 30) + "..." : s.title}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button onClick={goPrev} disabled={currentSlide === 0} className="flex items-center gap-1.5 text-[9px] font-semibold transition-all duration-300 disabled:opacity-0" style={{ color: "rgba(148,163,184,0.3)" }}>
            <ChevronLeft className="w-3 h-3" />
            {currentSlide > 0 && SLIDES[currentSlide - 1].title.slice(0, 35)}
          </button>
          <div className="text-[8px] font-mono" style={{ color: "rgba(148,163,184,0.15)" }}>Use arrow keys or click to navigate</div>
          <button onClick={goNext} disabled={currentSlide === totalSlides - 1} className="flex items-center gap-1.5 text-[9px] font-semibold transition-all duration-300 disabled:opacity-0" style={{ color: "rgba(148,163,184,0.3)" }}>
            {currentSlide < totalSlides - 1 && SLIDES[currentSlide + 1].title.slice(0, 35)}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
