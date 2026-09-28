"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, GLOW, RADIUS, ELEVATION, MOTION, GRADIENT } from "@/components/mtf/mtf-theme"

const ASSET_ACCENT: Record<string, { rgb: string }> = {
  forex: ACCENT.emerald, crypto: ACCENT.purple, stocks: ACCENT.blue,
  futures: ACCENT.amber, mixed: ACCENT.cyan,
}
const DAYS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const SESSION_MAP: Record<string, { label: string; time: string; desc: string }> = {
  london: { label: "London", time: "08:00 - 16:30 GMT", desc: "Highest forex volume session with institutional flow and major pair movements" },
  asia: { label: "Tokyo", time: "00:00 - 09:00 GMT", desc: "JPY crosses and Asian equity futures dominate this early-bird session" },
  new_york: { label: "New York", time: "13:00 - 22:00 GMT", desc: "US equity power session with overlap into London close for maximum volatility" },
}

interface Community {
  id: string; name: string; slug: string; tagline: string
  description?: string; asset_class: string; trading_style: string
  session_focus?: string; visibility?: string
  has_archio_ai_models?: boolean; ai_models_description?: string
  has_live_calls?: boolean; has_mentor_dashboard?: boolean
  verified?: boolean; beginner_friendly?: boolean
  members_count?: number; active_members?: number
  weekly_activity?: number; posts_per_week?: number
  is_live_now?: boolean; live_session_title?: string; live_attendee_count?: number
  tags?: string[]; weekly_heatmap?: number[]
  who_is_for?: string; who_is_not_for?: string
  community_mentors?: Array<{
    id: string; display_name: string; title?: string
    verified?: boolean; rating?: number; total_students?: number
    is_lead?: boolean; years_experience?: number; specialties?: string[]
  }>
}

/* ── Video data per community type ── */
const VIDEO_LIBRARY: Record<string, { id: string; title: string; duration: string; views: string; type: string }[]> = {
  forex: [
    { id: "v1", title: "London Session Breakdown: GBP/JPY Sniper Entry", duration: "14:32", views: "2.4k", type: "Analysis" },
    { id: "v2", title: "How I Caught 180 Pips on EUR/USD in 1 Trade", duration: "22:08", views: "5.1k", type: "Recap" },
    { id: "v3", title: "Gold (XAU/USD) Weekly Forecast + Key Levels", duration: "18:45", views: "3.8k", type: "Forecast" },
    { id: "v4", title: "Risk Management Masterclass: The 1% Rule", duration: "31:20", views: "8.2k", type: "Education" },
    { id: "v5", title: "Live Trade: Scalping USD/JPY During NFP", duration: "45:10", views: "12k", type: "Live" },
  ],
  crypto: [
    { id: "v1", title: "BTC Weekly Structure: Where Is The Next Move?", duration: "16:45", views: "6.2k", type: "Analysis" },
    { id: "v2", title: "Altcoin Rotation Strategy That Made 40%", duration: "24:30", views: "9.4k", type: "Recap" },
    { id: "v3", title: "SOL Setup: 4H Breakout Pattern Forming", duration: "12:15", views: "3.1k", type: "Forecast" },
    { id: "v4", title: "On-Chain Data + Price Action Combined", duration: "28:00", views: "4.7k", type: "Education" },
    { id: "v5", title: "Live: ETH Liquidation Cascade Scalping", duration: "38:22", views: "7.8k", type: "Live" },
  ],
  stocks: [
    { id: "v1", title: "SPY Gap Fill Strategy: Pre-Market Setup", duration: "19:30", views: "4.3k", type: "Analysis" },
    { id: "v2", title: "NVDA Earnings Play: +$2,400 in 15 Minutes", duration: "11:45", views: "11k", type: "Recap" },
    { id: "v3", title: "Weekly Watchlist: Top 5 Setups This Week", duration: "20:00", views: "5.6k", type: "Forecast" },
    { id: "v4", title: "Options Flow Reading for Day Traders", duration: "35:15", views: "7.1k", type: "Education" },
    { id: "v5", title: "Live Trading: Power Hour Momentum Plays", duration: "52:00", views: "15k", type: "Live" },
  ],
  futures: [
    { id: "v1", title: "ES Micro Scalping: 20 Ticks in 10 Minutes", duration: "13:20", views: "3.5k", type: "Analysis" },
    { id: "v2", title: "NQ Opening Range Breakout Masterclass", duration: "26:40", views: "6.8k", type: "Recap" },
    { id: "v3", title: "Crude Oil (CL) Inventory Play Setup", duration: "15:00", views: "2.9k", type: "Forecast" },
    { id: "v4", title: "Volume Profile: Finding Institutional Levels", duration: "33:10", views: "8.4k", type: "Education" },
    { id: "v5", title: "Live: Trading ES During FOMC", duration: "1:02:00", views: "18k", type: "Live" },
  ],
  mixed: [
    { id: "v1", title: "Multi-Asset Correlation Trading Strategy", duration: "21:15", views: "4.1k", type: "Analysis" },
    { id: "v2", title: "How I Trade BTC + EUR/USD Together", duration: "17:30", views: "5.9k", type: "Recap" },
    { id: "v3", title: "Weekly Macro Overview: All Markets", duration: "25:00", views: "7.2k", type: "Forecast" },
    { id: "v4", title: "Cross-Asset Hedging for Small Accounts", duration: "29:45", views: "3.6k", type: "Education" },
    { id: "v5", title: "Live Session: Morning Multi-Market Scan", duration: "41:30", views: "9.5k", type: "Live" },
  ],
}

const TYPE_COLORS: Record<string, string> = {
  Analysis: ACCENT.cyan.rgb,
  Recap: ACCENT.emerald.rgb,
  Forecast: ACCENT.purple.rgb,
  Education: ACCENT.amber.rgb,
  Live: ACCENT.rose.rgb,
}

export default function CommunityInspector({ community, onClose }: {
  community: Community; onClose: () => void
}) {
  const accent = ASSET_ACCENT[community.asset_class] || ACCENT.purple
  const mentors = community.community_mentors || []
  const heatmap = community.weekly_heatmap || [50, 60, 75, 80, 70, 30, 15]
  const [activeTab, setActiveTab] = useState<"overview" | "signals" | "mentors" | "ai">("overview")
  const [videoModal, setVideoModal] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const peak = Math.max(...heatmap)
  const peakIdx = heatmap.indexOf(peak)
  const winRate = 62 + Math.floor((community.members_count || 100) % 20)
  const avgRR = (1.2 + ((community.members_count || 100) % 15) * 0.1).toFixed(1)
  const signalsWk = community.posts_per_week || 12
  const monthlyGain = Math.round(winRate * 0.3)
  const totalTrades = 148 + ((community.members_count || 100) % 200)
  const avgHold = community.trading_style === "scalping" ? "4m" : community.trading_style === "swing" ? "3.2d" : "2.1h"
  const session = SESSION_MAP[community.session_focus || ""] || { label: "Multi-Session", time: "All sessions", desc: "Active across multiple trading sessions globally" }

  const pairsMap: Record<string, { pair: string; pct: number; trend: string; pips: number }[]> = {
    forex: [{ pair: "EUR/USD", pct: 34, trend: "+", pips: 142 }, { pair: "GBP/JPY", pct: 28, trend: "+", pips: 238 }, { pair: "XAU/USD", pct: 22, trend: "-", pips: 89 }, { pair: "USD/JPY", pct: 16, trend: "+", pips: 67 }],
    crypto: [{ pair: "BTC/USD", pct: 40, trend: "+", pips: 3200 }, { pair: "ETH/USD", pct: 30, trend: "+", pips: 840 }, { pair: "SOL/USD", pct: 18, trend: "-", pips: 22 }, { pair: "XRP/USD", pct: 12, trend: "+", pips: 4 }],
    stocks: [{ pair: "SPY", pct: 32, trend: "+", pips: 18 }, { pair: "AAPL", pct: 24, trend: "+", pips: 12 }, { pair: "TSLA", pct: 24, trend: "-", pips: 34 }, { pair: "NVDA", pct: 20, trend: "+", pips: 45 }],
    futures: [{ pair: "ES", pct: 38, trend: "+", pips: 42 }, { pair: "NQ", pct: 30, trend: "+", pips: 180 }, { pair: "CL", pct: 18, trend: "-", pips: 2 }, { pair: "GC", pct: 14, trend: "+", pips: 28 }],
    mixed: [{ pair: "BTC/USD", pct: 30, trend: "+", pips: 3200 }, { pair: "EUR/USD", pct: 28, trend: "+", pips: 142 }, { pair: "SPY", pct: 24, trend: "+", pips: 18 }, { pair: "GBP/JPY", pct: 18, trend: "-", pips: 238 }],
  }
  const pairs = pairsMap[community.asset_class] || pairsMap.mixed
  const videos = VIDEO_LIBRARY[community.asset_class] || VIDEO_LIBRARY.mixed

  const recentSignals = [
    { pair: pairs[0].pair, dir: "LONG", entry: "1.0842", tp: "1.0890", sl: "1.0820", rr: "2.2R", status: "hit", time: "2h ago" },
    { pair: pairs[1].pair, dir: "SHORT", entry: "192.45", tp: "191.80", sl: "192.80", rr: "1.9R", status: "active", time: "5h ago" },
    { pair: pairs[2].pair, dir: "LONG", entry: "2,310", tp: "2,340", sl: "2,295", rr: "2.0R", status: "hit", time: "1d ago" },
    { pair: pairs[0].pair, dir: "LONG", entry: "1.0810", tp: "1.0865", sl: "1.0788", rr: "2.5R", status: "missed", time: "1d ago" },
    { pair: pairs[3].pair, dir: "SHORT", entry: "148.90", tp: "148.20", sl: "149.15", rr: "2.8R", status: "hit", time: "2d ago" },
  ]

  const upcomingCalls = [
    { title: `${session.label} Session Analysis`, time: "Tomorrow 08:30 GMT", host: mentors[0]?.display_name || "Lead Mentor", attendees: 45 },
    { title: "Weekly Forecast Breakdown", time: "Sunday 19:00 GMT", host: mentors[0]?.display_name || "Lead Mentor", attendees: 120 },
    { title: "Student Q&A + Trade Reviews", time: "Friday 15:00 GMT", host: mentors[1]?.display_name || mentors[0]?.display_name || "Mentor", attendees: 68 },
  ]

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "signals" as const, label: "Signals & Forecasts" },
    ...(mentors.length > 0 ? [{ id: "mentors" as const, label: `Mentors (${mentors.length})` }] : []),
    ...(community.has_archio_ai_models ? [{ id: "ai" as const, label: "AI Model" }] : []),
  ]

  const scrollVideos = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.97 }}
        transition={{ ...MOTION.springGentle }}
        className="relative w-full max-w-[1000px] my-8 mx-4"
        onClick={e => e.stopPropagation()}
        style={{
          background: SURFACE.card,
          borderRadius: RADIUS.card,
          boxShadow: ELEVATION.cardGlow(accent.rgb),
          border: `1px solid rgba(${accent.rgb},0.08)`,
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, borderRadius: `${RADIUS.card} ${RADIUS.card} 0 0`, background: `linear-gradient(90deg, transparent 5%, rgba(${accent.rgb},0.5) 50%, transparent 95%)` }} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center z-10 transition-all hover:scale-105"
          style={{ background: `rgba(${accent.rgb},0.06)`, border: `1px solid rgba(${accent.rgb},0.1)` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        {/* ═══ HERO ═══ */}
        <div className="relative overflow-hidden" style={{ height: 160 }}>
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 60% 80% at 30% 60%, rgba(${accent.rgb},0.08) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 70% 30%, rgba(${ACCENT.purple.rgb},0.04) 0%, transparent 70%)`,
          }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 15} x2="100%" y2={i * 15} stroke="white" strokeWidth="0.5" />
            ))}
          </svg>
          <div className="absolute bottom-4 right-8">
            <span className="text-[80px] font-black uppercase leading-none tracking-tighter" style={{ color: `rgba(${accent.rgb},0.025)` }}>{community.asset_class}</span>
          </div>
          {community.is_live_now && (
            <motion.div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(0,0,0,0.5)", border: `1px solid rgba(${ACCENT.emerald.rgb},0.2)`, backdropFilter: "blur(8px)" }}>
              <motion.div className="w-2 h-2 rounded-full" style={{ background: `rgb(${ACCENT.emerald.rgb})` }}
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: `rgb(${ACCENT.emerald.rgb})` }}>Live Now</span>
            </motion.div>
          )}
          <div className="absolute bottom-5 left-8 right-20">
            <h2 className="text-[28px] font-black tracking-tight leading-none mb-1.5" style={{ color: "rgba(255,255,255,0.95)" }}>{community.name}</h2>
            <p className="text-[11px]" style={{ color: "rgba(148,163,184,0.5)" }}>{community.tagline}</p>
          </div>
        </div>

        {/* ═══ DESCRIPTION ═══ */}
        {community.description && (
          <div className="px-8 pt-5 pb-2">
            <HighlightedDescription text={community.description} accent={accent.rgb} />
          </div>
        )}

        {/* ═══ VIDEO CAROUSEL ═══ */}
        <div className="px-8 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <Sh label="Community Content" rgb={accent.rgb} />
            <div className="flex items-center gap-1.5">
              <button onClick={() => scrollVideos(-1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105" style={{ background: `rgba(${accent.rgb},0.05)`, border: `1px solid rgba(${accent.rgb},0.08)` }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.5)`} strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button onClick={() => scrollVideos(1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105" style={{ background: `rgba(${accent.rgb},0.05)`, border: `1px solid rgba(${accent.rgb},0.08)` }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.5)`} strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {videos.map((v) => {
              const typeColor = TYPE_COLORS[v.type] || accent.rgb
              return (
                <motion.div key={v.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex-shrink-0 w-[260px] rounded-xl overflow-hidden cursor-pointer group"
                  style={{ scrollSnapAlign: "start", background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}
                  onClick={() => setVideoModal(v.id)}
                >
                  {/* Video Thumbnail */}
                  <div className="relative h-[130px] overflow-hidden" style={{
                    background: `linear-gradient(135deg, rgba(${typeColor},0.08) 0%, rgba(${accent.rgb},0.03) 100%)`,
                  }}>
                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ background: `rgba(${typeColor},0.15)`, border: `2px solid rgba(${typeColor},0.3)`, backdropFilter: "blur(8px)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={`rgba(${typeColor},0.8)`}>
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </motion.div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.7)" }}>
                      <span className="text-[8px] font-mono font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>{v.duration}</span>
                    </div>
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md" style={{ background: `rgba(${typeColor},0.12)`, border: `1px solid rgba(${typeColor},0.15)` }}>
                      <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: `rgba(${typeColor},0.8)` }}>{v.type}</span>
                    </div>
                    {/* Grid pattern overlay */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line key={i} x1="0" y1={i * 16} x2="100%" y2={i * 16} stroke="white" strokeWidth="0.5"/>
                      ))}
                    </svg>
                  </div>
                  {/* Video Info */}
                  <div className="p-3">
                    <span className="text-[10px] font-bold block leading-snug mb-1.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.65)" }}>{v.title}</span>
                    <div className="flex items-center gap-2">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.3)`} strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <span className="text-[8px] font-mono" style={{ color: "rgba(148,163,184,0.25)" }}>{v.views} views</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ═══ QUICK STATS BAR ═══ */}
        <div className="flex items-stretch mx-8 mt-3 mb-4 rounded-2xl overflow-hidden" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.05)` }}>
          {[
            { val: `${winRate}%`, label: "Win Rate", color: ACCENT.emerald.rgb },
            { val: `${avgRR}R`, label: "Avg R:R", color: accent.rgb },
            { val: `${signalsWk}`, label: "Signals/wk", color: ACCENT.cyan.rgb },
            { val: `${totalTrades}`, label: "Total Trades", color: accent.rgb },
            { val: avgHold, label: "Avg Hold", color: ACCENT.purple.rgb },
            { val: `+${monthlyGain}%`, label: "This Month", color: ACCENT.emerald.rgb },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center py-3" style={{ borderRight: i < 5 ? `1px solid rgba(${accent.rgb},0.04)` : "none" }}>
              <span className="text-[20px] font-black font-mono block leading-none" style={{ color: `rgba(${s.color},0.7)` }}>{s.val}</span>
              <span className="text-[7px] uppercase tracking-[0.12em] font-bold mt-1.5 block" style={{ color: "rgba(148,163,184,0.25)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ═══ TAB NAVIGATION ═══ */}
        <div className="flex items-center gap-1 px-8 pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: activeTab === tab.id ? `rgba(${accent.rgb},0.1)` : "transparent",
                border: activeTab === tab.id ? `1px solid rgba(${accent.rgb},0.15)` : "1px solid transparent",
                color: activeTab === tab.id ? `rgba(${accent.rgb},0.8)` : "rgba(148,163,184,0.3)",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 pt-4">
          <AnimatePresence mode="wait">
            {/* ═══ OVERVIEW TAB ═══ */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {/* Top Traded Pairs */}
                <Sh label="Top Traded Instruments" rgb={accent.rgb} />
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {pairs.map(p => (
                    <div key={p.pair} className="p-3 rounded-xl text-center" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                      <span className="text-[11px] font-black font-mono block mb-1" style={{ color: `rgba(${accent.rgb},0.6)` }}>{p.pair}</span>
                      <span className="text-[22px] font-black font-mono block leading-none mb-1" style={{ color: `rgba(${accent.rgb},${0.3 + p.pct * 0.015})` }}>{p.pct}%</span>
                      <span className="text-[8px] font-mono" style={{ color: p.trend === "+" ? `rgba(${ACCENT.emerald.rgb},0.5)` : `rgba(${ACCENT.rose.rgb},0.5)` }}>
                        {p.trend === "+" ? "+" : "-"}{p.pips} {community.asset_class === "stocks" || community.asset_class === "futures" ? "pts" : "pips"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Session Focus */}
                <Sh label="Session Focus" rgb={accent.rgb} />
                <div className="p-4 rounded-xl mb-6 flex items-center gap-4" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${accent.rgb},0.06)`, border: `1px solid rgba(${accent.rgb},0.08)` }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.5)`} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[16px] font-black block mb-0.5" style={{ color: `rgba(${accent.rgb},0.7)` }}>{session.label} Session</span>
                    <span className="text-[11px] font-mono block mb-1" style={{ color: `rgba(${accent.rgb},0.35)` }}>{session.time}</span>
                    <span className="text-[10px] leading-[1.7]" style={{ color: "rgba(148,163,184,0.35)" }}>{session.desc}</span>
                  </div>
                </div>

                {/* Weekly Rhythm */}
                <Sh label="Weekly Rhythm" rgb={accent.rgb} />
                <div className="p-5 rounded-xl mb-6" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                  <div className="flex items-end gap-3">
                    {heatmap.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                        <span className="text-[12px] font-bold font-mono opacity-50 group-hover/bar:opacity-100 transition-opacity" style={{ color: `rgba(${accent.rgb},0.7)` }}>{val}%</span>
                        <div className="w-full rounded-xl transition-all duration-300 group-hover/bar:scale-y-105" style={{
                          height: Math.max(16, (val / 100) * 80),
                          background: i === peakIdx
                            ? `linear-gradient(180deg, rgba(${accent.rgb},0.5) 0%, rgba(${accent.rgb},0.2) 100%)`
                            : `linear-gradient(180deg, rgba(${accent.rgb},${0.15 + (val / 100) * 0.15}) 0%, rgba(${accent.rgb},0.04) 100%)`,
                          transformOrigin: "bottom",
                          boxShadow: i === peakIdx ? `0 0 16px rgba(${accent.rgb},0.15)` : "none",
                        }} />
                        <span className="text-[11px] font-bold" style={{ color: i === peakIdx ? `rgba(${accent.rgb},0.6)` : "rgba(148,163,184,0.3)" }}>{DAYS_FULL[i]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid rgba(${accent.rgb},0.04)` }}>
                    <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.25)" }}>Peak day: <span className="font-bold" style={{ color: `rgba(${accent.rgb},0.5)` }}>{DAYS_FULL[peakIdx]}</span> at {peak}% activity</span>
                    <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.25)" }}>Avg weekly activity: <span className="font-bold" style={{ color: `rgba(${accent.rgb},0.5)` }}>{Math.round(heatmap.reduce((a, b) => a + b, 0) / 7)}%</span></span>
                  </div>
                </div>

                {/* Upcoming Live Calls */}
                {community.has_live_calls && (
                  <>
                    <Sh label="Upcoming Live Calls" rgb={accent.rgb} />
                    <div className="flex flex-col gap-2 mb-6">
                      {upcomingCalls.map((call, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${accent.rgb},0.05)` }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.4)`} strokeWidth="1.5" strokeLinecap="round">
                              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/><rect x="3" y="6" width="12" height="12" rx="2"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[12px] font-bold block truncate" style={{ color: "rgba(255,255,255,0.7)" }}>{call.title}</span>
                            <span className="text-[9px] font-mono" style={{ color: "rgba(148,163,184,0.3)" }}>{call.time} - Hosted by {call.host}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.3)`} strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            <span className="text-[9px] font-mono font-bold" style={{ color: `rgba(${accent.rgb},0.4)` }}>{call.attendees}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Who This Is For / Not For */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {community.who_is_for && (
                    <div className="p-5 rounded-xl" style={{ background: `linear-gradient(135deg, rgba(${ACCENT.emerald.rgb},0.03), rgba(${ACCENT.emerald.rgb},0.01))`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.08)` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ACCENT.emerald.rgb},0.5)`} strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                        <span className="text-[16px] font-black" style={{ color: `rgba(${ACCENT.emerald.rgb},0.7)` }}>Who This Is For</span>
                      </div>
                      <p className="text-[12px] leading-[1.9]" style={{ color: "rgba(203,213,225,0.45)" }}>{community.who_is_for}</p>
                    </div>
                  )}
                  {community.who_is_not_for && (
                    <div className="p-5 rounded-xl" style={{ background: `linear-gradient(135deg, rgba(${ACCENT.rose.rgb},0.03), rgba(${ACCENT.rose.rgb},0.01))`, border: `1px solid rgba(${ACCENT.rose.rgb},0.08)` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ACCENT.rose.rgb},0.5)`} strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        <span className="text-[16px] font-black" style={{ color: `rgba(${ACCENT.rose.rgb},0.7)` }}>Not For</span>
                      </div>
                      <p className="text-[12px] leading-[1.9]" style={{ color: "rgba(203,213,225,0.45)" }}>{community.who_is_not_for}</p>
                    </div>
                  )}
                </div>

                {/* Mentor preview */}
                {mentors.length > 0 && (
                  <>
                    <Sh label={`${mentors.length} Mentor${mentors.length > 1 ? "s" : ""}`} rgb={accent.rgb} />
                    <div className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.003]" onClick={() => setActiveTab("mentors")}
                      style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                      <div className="flex -space-x-2">
                        {mentors.slice(0, 4).map((m, i) => (
                          <div key={m.id || i} className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, rgba(${accent.rgb},0.12), rgba(${accent.rgb},0.04))`, border: `2px solid rgba(10,12,24,0.9)`, zIndex: mentors.length - i }}>
                            <span className="text-[12px] font-bold" style={{ color: `rgba(${accent.rgb},0.5)` }}>{m.display_name?.charAt(0)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-bold block" style={{ color: "rgba(255,255,255,0.6)" }}>{mentors.map(m => m.display_name).join(", ")}</span>
                        <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.25)" }}>View detailed profiles</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accent.rgb},0.3)`} strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ═══ SIGNALS TAB ═══ */}
            {activeTab === "signals" && (
              <motion.div key="signals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-4 rounded-xl text-center" style={{ background: `rgba(${ACCENT.emerald.rgb},0.03)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.06)` }}>
                    <span className="text-[28px] font-black font-mono block leading-none" style={{ color: `rgba(${ACCENT.emerald.rgb},0.7)` }}>{winRate}%</span>
                    <span className="text-[8px] uppercase tracking-widest font-bold mt-2 block" style={{ color: `rgba(${ACCENT.emerald.rgb},0.3)` }}>Win Rate</span>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: `rgba(${accent.rgb},0.03)`, border: `1px solid rgba(${accent.rgb},0.06)` }}>
                    <span className="text-[28px] font-black font-mono block leading-none" style={{ color: `rgba(${accent.rgb},0.65)` }}>{avgRR}R</span>
                    <span className="text-[8px] uppercase tracking-widest font-bold mt-2 block" style={{ color: `rgba(${accent.rgb},0.3)` }}>Avg Reward</span>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: `rgba(${ACCENT.cyan.rgb},0.03)`, border: `1px solid rgba(${ACCENT.cyan.rgb},0.06)` }}>
                    <span className="text-[28px] font-black font-mono block leading-none" style={{ color: `rgba(${ACCENT.cyan.rgb},0.65)` }}>{totalTrades}</span>
                    <span className="text-[8px] uppercase tracking-widest font-bold mt-2 block" style={{ color: `rgba(${ACCENT.cyan.rgb},0.3)` }}>Total Trades</span>
                  </div>
                </div>

                <Sh label="Recent Signals" rgb={accent.rgb} />
                <div className="rounded-xl overflow-hidden mb-6" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                  <div className="grid grid-cols-[80px_50px_1fr_1fr_1fr_60px_60px_70px] gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid rgba(${accent.rgb},0.04)` }}>
                    {["Pair", "Side", "Entry", "TP", "SL", "R:R", "Status", "Time"].map(h => (
                      <span key={h} className="text-[7px] uppercase tracking-wider font-bold" style={{ color: "rgba(148,163,184,0.2)" }}>{h}</span>
                    ))}
                  </div>
                  {recentSignals.map((sig, i) => (
                    <div key={i} className="grid grid-cols-[80px_50px_1fr_1fr_1fr_60px_60px_70px] gap-2 px-4 py-2.5 transition-all hover:bg-white/[0.01]" style={{ borderBottom: i < recentSignals.length - 1 ? `1px solid rgba(${accent.rgb},0.02)` : "none" }}>
                      <span className="text-[10px] font-black font-mono" style={{ color: `rgba(${accent.rgb},0.6)` }}>{sig.pair}</span>
                      <span className="text-[9px] font-bold font-mono" style={{ color: sig.dir === "LONG" ? `rgba(${ACCENT.emerald.rgb},0.6)` : `rgba(${ACCENT.rose.rgb},0.6)` }}>{sig.dir}</span>
                      <span className="text-[9px] font-mono" style={{ color: "rgba(148,163,184,0.4)" }}>{sig.entry}</span>
                      <span className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.emerald.rgb},0.4)` }}>{sig.tp}</span>
                      <span className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.rose.rgb},0.4)` }}>{sig.sl}</span>
                      <span className="text-[9px] font-bold font-mono" style={{ color: `rgba(${accent.rgb},0.5)` }}>{sig.rr}</span>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-center" style={{
                        background: sig.status === "hit" ? `rgba(${ACCENT.emerald.rgb},0.06)` : sig.status === "active" ? `rgba(${ACCENT.cyan.rgb},0.06)` : `rgba(${ACCENT.rose.rgb},0.04)`,
                        color: sig.status === "hit" ? `rgba(${ACCENT.emerald.rgb},0.6)` : sig.status === "active" ? `rgba(${ACCENT.cyan.rgb},0.6)` : `rgba(${ACCENT.rose.rgb},0.4)`,
                      }}>{sig.status}</span>
                      <span className="text-[8px] font-mono" style={{ color: "rgba(148,163,184,0.2)" }}>{sig.time}</span>
                    </div>
                  ))}
                </div>

                <Sh label="Student Results Spotlight" rgb={accent.rgb} />
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { name: "Trading Journal", before: "No structure", after: "Daily P&L tracking", metric: "+34% consistency" },
                    { name: "Risk Management", before: "2-5% per trade", after: "Fixed 1% rule", metric: "-60% drawdown" },
                  ].map((r, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.04)` }}>
                      <span className="text-[11px] font-bold block mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>{r.name}</span>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: `rgba(${ACCENT.rose.rgb},0.05)`, color: `rgba(${ACCENT.rose.rgb},0.45)` }}>Before</span>
                        <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.35)" }}>{r.before}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: `rgba(${ACCENT.emerald.rgb},0.05)`, color: `rgba(${ACCENT.emerald.rgb},0.45)` }}>After</span>
                        <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.35)" }}>{r.after}</span>
                      </div>
                      <span className="text-[14px] font-black font-mono" style={{ color: `rgba(${ACCENT.emerald.rgb},0.6)` }}>{r.metric}</span>
                    </div>
                  ))}
                </div>

                <Sh label="Forecast Accuracy (Last 30 Days)" rgb={accent.rgb} />
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Direction Calls", val: `${winRate - 3}%`, color: ACCENT.emerald.rgb },
                    { label: "TP Hit Rate", val: `${winRate - 8}%`, color: accent.rgb },
                    { label: "Avg Pips/Signal", val: `+${Math.round((pairs[0]?.pips || 100) * 0.3)}`, color: ACCENT.cyan.rgb },
                    { label: "Max Drawdown", val: `-${Math.round(winRate * 0.12)}%`, color: ACCENT.rose.rgb },
                  ].map((f, i) => (
                    <div key={i} className="p-3 rounded-xl text-center" style={{ background: `rgba(${f.color},0.02)`, border: `1px solid rgba(${f.color},0.05)` }}>
                      <span className="text-[18px] font-black font-mono block leading-none" style={{ color: `rgba(${f.color},0.6)` }}>{f.val}</span>
                      <span className="text-[7px] uppercase tracking-widest font-bold mt-1.5 block" style={{ color: `rgba(${f.color},0.25)` }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ MENTORS TAB ═══ */}
            {activeTab === "mentors" && (
              <motion.div key="mentors" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="flex flex-col gap-4">
                  {mentors.map((m, i) => (
                    <div key={m.id || i} className="p-5 rounded-xl" style={{ background: SURFACE.recess, border: `1px solid rgba(${accent.rgb},0.05)` }}>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, rgba(${accent.rgb},0.12), rgba(${accent.rgb},0.04))`, border: `1px solid rgba(${accent.rgb},0.15)` }}>
                          <span className="text-[22px] font-black" style={{ color: `rgba(${accent.rgb},0.5)` }}>{m.display_name?.charAt(0) || "M"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[16px] font-black tracking-tight" style={{ color: "rgba(255,255,255,0.85)" }}>{m.display_name}</span>
                            {m.is_lead && <span className="text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg" style={{ background: `rgba(${accent.rgb},0.1)`, color: `rgba(${accent.rgb},0.7)`, border: `1px solid rgba(${accent.rgb},0.15)` }}>Lead</span>}
                            {m.verified && <svg width="14" height="14" viewBox="0 0 24 24" fill={`rgba(${ACCENT.emerald.rgb},0.6)`}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                          </div>
                          {m.title && <span className="text-[11px] block mb-3" style={{ color: "rgba(148,163,184,0.4)" }}>{m.title}</span>}
                          <div className="flex items-center gap-5 mb-3">
                            {m.rating != null && (
                              <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill={`rgba(${ACCENT.amber.rgb},0.5)`}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <span className="text-[14px] font-black font-mono" style={{ color: `rgba(${ACCENT.amber.rgb},0.65)` }}>{m.rating.toFixed(1)}</span>
                              </div>
                            )}
                            {m.total_students != null && (
                              <div><span className="text-[14px] font-black font-mono" style={{ color: `rgba(${accent.rgb},0.55)` }}>{m.total_students.toLocaleString()}</span><span className="text-[9px] ml-1" style={{ color: "rgba(148,163,184,0.25)" }}>students</span></div>
                            )}
                            {m.years_experience != null && (
                              <div><span className="text-[14px] font-black font-mono" style={{ color: `rgba(${accent.rgb},0.55)` }}>{m.years_experience}</span><span className="text-[9px] ml-1" style={{ color: "rgba(148,163,184,0.25)" }}>years</span></div>
                            )}
                          </div>
                          {m.specialties && m.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {m.specialties.map((s: string) => (
                                <span key={s} className="text-[8px] font-bold font-mono uppercase tracking-wider px-2 py-1 rounded-lg"
                                  style={{ background: `rgba(${accent.rgb},0.05)`, color: `rgba(${accent.rgb},0.4)`, border: `1px solid rgba(${accent.rgb},0.05)` }}>{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ AI TAB ═══ */}
            {activeTab === "ai" && community.has_archio_ai_models && (
              <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="p-6 rounded-xl mb-6" style={{ background: `linear-gradient(135deg, rgba(${ACCENT.purple.rgb},0.04), rgba(${ACCENT.blue.rgb},0.02))`, border: `1px solid rgba(${ACCENT.purple.rgb},0.1)` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `rgba(${ACCENT.purple.rgb},0.1)`, border: `1px solid rgba(${ACCENT.purple.rgb},0.15)` }}
                      animate={{ boxShadow: [GLOW.low(ACCENT.purple.rgb), GLOW.med(ACCENT.purple.rgb), GLOW.low(ACCENT.purple.rgb)] }}
                      transition={{ duration: 4, repeat: Infinity }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`rgb(${ACCENT.purple.rgb})`} strokeWidth="1.5">
                        <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/><circle cx="12" cy="12" r="8" strokeDasharray="4 4" opacity="0.3"/>
                      </svg>
                    </motion.div>
                    <div>
                      <span className="text-[18px] font-black block" style={{ color: `rgba(${ACCENT.purple.rgb},0.8)` }}>Archio AI Model</span>
                      <span className="text-[10px]" style={{ color: "rgba(148,163,184,0.35)" }}>Custom-trained on this community{"'"}s methodology</span>
                    </div>
                  </div>
                  <p className="text-[12px] leading-[2] mb-5" style={{ color: "rgba(203,213,225,0.45)" }}>
                    {community.ai_models_description || "This community features a custom Archio AI model trained on the mentor's methodology. Ask questions, get trade reviews, and receive 24/7 guidance even when mentors are offline."}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "24/7 Available" },
                      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Mentor-Trained" },
                      { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m14 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6m14 0H3", label: "Trade Review" },
                      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", label: "Strategy Q&A" },
                    ].map(cap => (
                      <div key={cap.label} className="p-3 rounded-xl text-center" style={{ background: `rgba(${ACCENT.purple.rgb},0.03)`, border: `1px solid rgba(${ACCENT.purple.rgb},0.05)` }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ACCENT.purple.rgb},0.4)`} strokeWidth="1.5" className="mx-auto mb-1.5"><path d={cap.icon}/></svg>
                        <span className="text-[9px] font-bold" style={{ color: `rgba(${ACCENT.purple.rgb},0.45)` }}>{cap.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ CTA FOOTER ═══ */}
          <div className="flex items-center justify-between pt-5 mt-4" style={{ borderTop: `1px solid rgba(${accent.rgb},0.06)` }}>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-[0.14em] font-bold" style={{ color: "rgba(148,163,184,0.2)" }}>
                {community.visibility === "paid" ? "Premium Community" : "Open Community"}
              </span>
              {community.tags && community.tags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {community.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `rgba(${accent.rgb},0.04)`, color: `rgba(${accent.rgb},0.3)` }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-xl text-[11px] font-black tracking-wide uppercase"
              style={{
                background: `linear-gradient(135deg, rgba(${accent.rgb},0.15), rgba(${accent.rgb},0.08))`,
                border: `1px solid rgba(${accent.rgb},0.25)`,
                color: `rgba(${accent.rgb},0.85)`,
                boxShadow: GLOW.med(accent.rgb),
              }}>
              {community.visibility === "paid" ? "Request Access" : "Join Community"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ═══ VIDEO MODAL ═══ */}
      <AnimatePresence>
        {videoModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setVideoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-[820px] mx-6 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
              style={{ background: SURFACE.card, border: `1px solid rgba(${accent.rgb},0.1)` }}
            >
              <button onClick={() => setVideoModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center z-10"
                style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>

              {/* Video Player Area */}
              <div className="relative" style={{ aspectRatio: "16/9", background: `linear-gradient(135deg, rgba(${accent.rgb},0.05), rgba(${ACCENT.purple.rgb},0.03))` }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <motion.div className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    style={{ background: `rgba(${accent.rgb},0.15)`, border: `2px solid rgba(${accent.rgb},0.3)` }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={`rgba(${accent.rgb},0.8)`}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </motion.div>
                  <span className="text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {videos.find(v => v.id === videoModal)?.title || "Video"}
                  </span>
                  <span className="text-[10px]" style={{ color: "rgba(148,163,184,0.3)" }}>
                    Video content will be available when the community uploads their recordings
                  </span>
                </div>
                {/* Grid overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`g${i}`} x1="0" y1={i * 24} x2="100%" y2={i * 24} stroke="white" strokeWidth="0.5"/>
                  ))}
                </svg>
              </div>

              {/* Video Info Bar */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[14px] font-bold block mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {videos.find(v => v.id === videoModal)?.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono" style={{ color: "rgba(148,163,184,0.3)" }}>
                      {videos.find(v => v.id === videoModal)?.duration}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: "rgba(148,163,184,0.3)" }}>
                      {videos.find(v => v.id === videoModal)?.views} views
                    </span>
                    {(() => {
                      const v = videos.find(v => v.id === videoModal)
                      const tc = TYPE_COLORS[v?.type || ""] || accent.rgb
                      return (
                        <span className="text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `rgba(${tc},0.1)`, color: `rgba(${tc},0.7)` }}>
                          {v?.type}
                        </span>
                      )
                    })()}
                  </div>
                </div>
                <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.2)" }}>Uploaded by {community.name}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Highlighted Description: bold key trading words ── */
function HighlightedDescription({ text, accent }: { text: string; accent: string }) {
  const keywords = ["patient", "macro-driven", "swing", "scalping", "institutional", "day trading", "crypto", "forex", "futures", "stocks", "discipline", "serious", "advanced", "beginner", "professional", "premium", "verified", "live", "mentor", "AI", "signals", "analysis", "risk", "strategy", "execution", "breakdowns", "deep-dive", "session", "London", "New York", "Tokyo", "Asia"]
  const regex = new RegExp(`(${keywords.join("|")})`, "gi")
  const parts = text.split(regex)

  return (
    <p className="text-[13px] leading-[2]" style={{ color: "rgba(203,213,225,0.45)" }}>
      {parts.map((part, i) => {
        const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase())
        return isKeyword
          ? <span key={i} className="font-bold" style={{ color: `rgba(${accent},0.7)` }}>{part}</span>
          : <span key={i}>{part}</span>
      })}
    </p>
  )
}

function Sh({ label, rgb }: { label: string; rgb: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${rgb},0.4)` }} />
      <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: `rgba(${rgb},0.3)` }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: `rgba(${rgb},0.04)` }} />
    </div>
  )
}
