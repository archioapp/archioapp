"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

/* ═══════════════════════════════════════════════════════════
   PARTIAL SLIDE — Controlled Transparency (Elevated Visual)
   ═══════════════════════════════════════════════════════════ */

interface PartialItem {
  name: string
  exists: string
  missing: string
}

interface PartialColumn {
  title: string
  status: string
  color: string
  glow: string
  description: string
  items: PartialItem[]
}

const COLUMNS: PartialColumn[] = [
  {
    title: "Built UI, Needs Backend",
    status: "Interface complete",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.12)",
    description: "The visual layer is fully designed and rendering in the browser. What is missing is the backend connection -- a database table, an API call, or a live data feed.",
    items: [
      { name: "AI Forecast Generation", exists: "Full forecast UI with instrument picker, confidence meter, directional bias display, key level markers, and written reasoning panel.", missing: "Connect an AI model (OpenAI / fine-tuned) to generate actual predictions. The UI is ready to display whatever the model returns." },
      { name: "Market Sentiment Panel", exists: "Sentiment gauge UI, bullish/bearish positioning bars, source attribution cards.", missing: "Connect a sentiment data API (social media aggregation, news NLP scoring) to populate the gauges with real numbers." },
      { name: "Forecast History", exists: "History list UI with date, instrument, direction, and outcome columns.", missing: "Create a forecasts database table and connect CRUD operations so forecasts persist and outcomes can be tracked." },
      { name: "Economic Calendar", exists: "Calendar panel with countdown timers, impact badges, and forecast vs previous display.", missing: "Connect to a real economic events data source (ForexFactory API or equivalent) to populate with live event data." },
      { name: "News and Headlines", exists: "News card layout with sentiment tags, urgency ranking, and source attribution.", missing: "Connect a financial news API to populate with live headlines instead of placeholder content." },
      { name: "Trade Journal Dashboard", exists: "Journal dashboard UI with trade cards, performance metrics, and filter system.", missing: "Create trades and trade_journal database tables. Connect CRUD so trades persist and analytics can be calculated from real data." },
    ],
  },
  {
    title: "Partial Logic",
    status: "Partially connected",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.12)",
    description: "Some backend logic exists but is not fully wired. The route may work, the table may exist, but the full flow from user action to stored result is incomplete.",
    items: [
      { name: "Community Data", exists: "API route works and the filter system is functional. Community cards render correctly from data.", missing: "Replace sample data with real database-backed community records. Communities need real creation, editing, and membership flows." },
      { name: "Video Carousel", exists: "Carousel UI in the community inspector modal with thumbnail grid and playback controls.", missing: "Real video upload, storage (Vercel Blob or equivalent), and streaming. Currently displays placeholder thumbnails." },
      { name: "AI / Copilot Chat", exists: "Chat route works. Messages send and receive. The AI responds with contextual awareness of the active instrument.", missing: "Full context injection (trade history, journal entries, psychology state) into the AI prompt. Currently has limited context." },
      { name: "Subscription Flow", exists: "Plans table seeded in database. Webhook route exists. Plan selection UI renders.", missing: "Full Stripe Checkout integration, Stripe Connect for mentor payouts, and subscription lifecycle management (upgrade, downgrade, cancel)." },
      { name: "Market Data Routes", exists: "API endpoints exist for price data, instrument metadata, and market state.", missing: "Connect a live market data provider (Polygon.io, Twelve Data, or equivalent). Needs API key and rate limiting." },
      { name: "Share Designer", exists: "Share card layout with customization options and preview.", missing: "Image generation from trade data, social media API connections for direct sharing, and template persistence." },
    ],
  },
  {
    title: "Not Built Yet",
    status: "Needs full build",
    color: "#f87171",
    glow: "rgba(248,113,113,0.12)",
    description: "These features do not exist in the codebase yet. They require design, frontend development, backend logic, and database schema work.",
    items: [
      { name: "Join / Subscribe Flows", exists: "Community cards show a 'Join' button that is currently non-functional.", missing: "Full membership flow: join request, approval (for private communities), member management, and notification system." },
      { name: "Social Feed Real-Time", exists: "Social feed UI in the Execution Copilot renders messages in a list format.", missing: "Real-time messaging backend (Supabase Realtime or WebSockets), message persistence, and presence indicators." },
      { name: "Confluence AI Bar", exists: "Bottom bar UI in the Neural Matrix dashboard with placeholder confluence indicators.", missing: "AI data connection that analyzes multiple signals (technical, fundamental, sentiment) and generates a real confluence score." },
      { name: "Settings Page", exists: "Navigation link exists. No settings page is built.", missing: "Full settings page: profile editing, notification preferences, connected accounts, subscription management, and theme options." },
      { name: "Trade History View", exists: "Navigation link exists. Placeholder page renders.", missing: "Full trade history interface with filtering, sorting, performance analytics, and export functionality. Requires trades database table." },
    ],
  },
]

const NEEDED_TABLES = ["forecasts", "trades", "trade_journal", "messages", "analyses", "psychology_logs", "strategy_configs", "notifications"]

export function PartialSlide({ accent }: { accent: string }) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems = COLUMNS.reduce((s, c) => s + c.items.length, 0)

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1220 0%, #080e1a 50%, #0a0f18 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[450px] h-[450px] rounded-full" style={{ top: "-10%", left: "-5%", background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)" }} animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-10%", right: "-5%", background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)" }} animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[300px] h-[300px] rounded-full" style={{ top: "50%", right: "20%", background: "radial-gradient(circle, rgba(248,113,113,0.04) 0%, transparent 70%)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} animate={{ boxShadow: ["0 0 4px rgba(251,191,36,0.3)", "0 0 12px rgba(251,191,36,0.6)", "0 0 4px rgba(251,191,36,0.3)"] }} transition={{ duration: 2.5, repeat: Infinity }} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(251,191,36,0.7)" }}>Engineering Truth</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.3), transparent)" }} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5 text-balance">The interface is built. The wiring is defined.</h2>
        <p className="text-sm text-zinc-300 mb-5 max-w-2xl" style={{ lineHeight: 1.6 }}>{totalItems} items across three categories. Every gap is identified, scoped, and has a clear path to completion.</p>

        {/* Three columns */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col">
              {/* Column header */}
              <div className="rounded-t-xl px-3 py-3" style={{ background: `linear-gradient(135deg, ${col.color}12, ${col.color}06)`, borderTop: `2px solid ${col.color}60`, borderLeft: `1px solid ${col.color}18`, borderRight: `1px solid ${col.color}18`, boxShadow: `0 -2px 15px ${col.color}08` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black text-white">{col.title}</span>
                  <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ background: `${col.color}20`, color: col.color, border: `1px solid ${col.color}30` }}>{col.items.length}</span>
                </div>
                <div className="text-[9px] text-zinc-400 leading-relaxed">{col.description}</div>
              </div>

              {/* Items */}
              <div className="flex-1 rounded-b-xl overflow-y-auto" style={{ maxHeight: 260, background: "rgba(255,255,255,0.015)", borderLeft: `1px solid ${col.color}12`, borderRight: `1px solid ${col.color}12`, borderBottom: `1px solid ${col.color}12` }}>
                {col.items.map((item) => {
                  const key = `${col.title}-${item.name}`
                  const isExp = expandedItems[key]
                  return (
                    <div key={item.name}>
                      <button
                        className="w-full px-3 py-2.5 text-left flex items-center gap-2 cursor-pointer transition-all duration-200"
                        style={{ borderBottom: `1px solid ${col.color}08`, background: isExp ? `${col.color}06` : "transparent" }}
                        onClick={() => toggle(key)}
                      >
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.color, boxShadow: `0 0 6px ${col.color}40` }} />
                        <span className="text-[10px] font-bold text-zinc-200 flex-1">{item.name}</span>
                        <ChevronDown className="w-3 h-3 flex-shrink-0 transition-transform duration-200" style={{ color: `${col.color}60`, transform: isExp ? "rotate(180deg)" : "" }} />
                      </button>
                      <AnimatePresence>
                        {isExp && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-1">
                              <div className="mb-2.5">
                                <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-1" style={{ color: "rgba(52,211,153,0.7)" }}>What exists now</div>
                                <div className="text-[10px] text-zinc-300 leading-relaxed">{item.exists}</div>
                              </div>
                              <div>
                                <div className="text-[8px] uppercase tracking-[0.15em] font-black mb-1" style={{ color: `${col.color}80` }}>What is missing</div>
                                <div className="text-[10px] text-zinc-300 leading-relaxed">{item.missing}</div>
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
          ))}
        </div>

        {/* Needed DB tables */}
        <div className="rounded-xl p-3.5 mb-4" style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(251,191,36,0.02))", border: "1px solid rgba(251,191,36,0.15)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase tracking-[0.15em] font-black" style={{ color: "rgba(251,191,36,0.7)" }}>Database Tables Still Needed</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(251,191,36,0.12)", color: "rgba(251,191,36,0.9)", border: "1px solid rgba(251,191,36,0.2)" }}>{NEEDED_TABLES.length} tables</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {NEEDED_TABLES.map(t => (
              <span key={t} className="text-[9px] px-2.5 py-1 rounded-md font-bold font-mono" style={{ background: "rgba(251,191,36,0.08)", color: "rgba(251,191,36,0.8)", border: "1px solid rgba(251,191,36,0.15)" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Investor takeaway */}
        <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(251,191,36,0.02))", border: "1px solid rgba(251,191,36,0.15)", boxShadow: "0 2px 20px rgba(251,191,36,0.04)" }}>
          <p className="text-[12px] font-semibold leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            Every gap on this slide is a defined engineering task -- not a design question. The interface decisions are made. The database schemas are known. The API contracts are clear. <span style={{ color: "#fbbf24" }}>This is the kind of remaining work that funding accelerates directly.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
