"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, GLOW, RADIUS, ELEVATION, MOTION, GRADIENT } from "@/components/mtf/mtf-theme"

/* ── Per-asset gradients & accents ── */
const CARD_BG: Record<string, { g1: string; g2: string; pat: string }> = {
  forex:   { g1: "16,185,129", g2: "6,182,212",  pat: "M0 15L15 0M15 15L30 0" },
  crypto:  { g1: "139,92,246", g2: "236,72,153",  pat: "M8 0V16M0 8H16" },
  stocks:  { g1: "59,130,246", g2: "99,102,241",  pat: "M0 8L8 0L16 8L24 0" },
  futures: { g1: "245,158,11", g2: "244,63,94",   pat: "M0 0L16 16M16 0L32 16" },
  mixed:   { g1: "6,182,212",  g2: "59,130,246",  pat: "M0 8Q8 0 16 8Q24 16 32 8" },
}
const ASSET_ACCENT: Record<string, { rgb: string }> = {
  forex: ACCENT.emerald, crypto: ACCENT.purple, stocks: ACCENT.blue,
  futures: ACCENT.amber, mixed: ACCENT.cyan,
}

interface Mentor {
  id: string; display_name: string; title?: string
  verified?: boolean; rating?: number; total_students?: number
  is_lead?: boolean; years_experience?: number; specialties?: string[]
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
  community_mentors?: Mentor[]
}

/* ── Highlight keywords in tagline ── */
function HighlightedText({ text, accentRgb }: { text: string; accentRgb: string }) {
  const keywords = ["institutional", "grade", "professional", "advanced", "elite", "precision",
    "verified", "live", "ai", "algorithmic", "funded", "prop", "scalping", "swing", "forex",
    "crypto", "stocks", "futures", "equities", "options", "momentum", "breakout", "signal",
    "ultra-fast", "macro", "first", "guided", "accountability", "intelligent", "tokyo", "london",
    "asia", "neural", "discipline", "serious", "maximum"]
  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((p, i) =>
        keywords.some(k => k.toLowerCase() === p.toLowerCase()) ? (
          <span key={i} className="font-bold" style={{ color: `rgba(${accentRgb},0.85)` }}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  )
}

/* ── Build 4 unique features per community ── */
function getFeatures(c: Community): { icon: JSX.Element; label: string; value: string; accent: string }[] {
  const ac = (ASSET_ACCENT[c.asset_class] || ACCENT.purple).rgb
  const features: { icon: JSX.Element; label: string; value: string; accent: string }[] = []

  if (c.has_archio_ai_models) {
    features.push({
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/><circle cx="12" cy="12" r="9" strokeDasharray="4 3"/></svg>,
      label: "AI Model", value: "Archio AI", accent: ac,
    })
  }
  if (c.has_live_calls) {
    features.push({
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/><rect x="3" y="6" width="12" height="12" rx="2"/>
        {c.is_live_now && <circle cx="9" cy="12" r="2" fill={`rgba(${ACCENT.emerald.rgb},0.8)`} stroke="none"/>}</svg>,
      label: "Live Calls", value: c.is_live_now ? "Live Now" : "Available", accent: c.is_live_now ? ACCENT.emerald.rgb : ac,
    })
  }
  if (c.has_mentor_dashboard) {
    features.push({
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
      label: "Dashboard", value: "Analytics", accent: ac,
    })
  }
  if (c.verified) {
    features.push({
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ACCENT.emerald.rgb},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
      label: "Verified", value: "Trusted", accent: ACCENT.emerald.rgb,
    })
  }
  if (c.beginner_friendly) {
    features.push({
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ACCENT.cyan.rgb},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
      label: "Beginner", value: "Friendly", accent: ACCENT.cyan.rgb,
    })
  }
  if (c.session_focus === "london") {
    features.push({ icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Session", value: "London", accent: ac })
  } else if (c.session_focus === "asia") {
    features.push({ icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Session", value: "Tokyo", accent: ac })
  } else if (c.session_focus === "new_york") {
    features.push({ icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Session", value: "New York", accent: ac })
  }
  if (c.trading_style === "scalping") {
    features.push({ icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, label: "Style", value: "Scalping", accent: ac })
  } else if (c.trading_style === "swing") {
    features.push({ icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`rgba(${ac},0.55)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c2-4 4-6 6-6s4 2 6 6 4 6 6 6"/></svg>, label: "Style", value: "Swing", accent: ac })
  }
  return features.slice(0, 4)
}

/* ── SESSION ── */
const SESSION_MAP: Record<string, string> = { london: "London", asia: "Tokyo", new_york: "New York" }

export default function CommunityObject({ community, index, onSelect }: {
  community: Community; index: number; onSelect: (c: Community) => void
}) {
  const [hoveredMentor, setHoveredMentor] = useState<Mentor | null>(null)
  const mentorRef = useRef<HTMLDivElement>(null)
  const accent = ASSET_ACCENT[community.asset_class] || ACCENT.purple
  const bg = CARD_BG[community.asset_class] || CARD_BG.mixed
  const mentors = community.community_mentors || []
  // Always have at least 1 mentor for consistent height
  const displayMentors = mentors.length > 0 ? mentors : [{
    id: "default", display_name: community.name.split(" ")[0] + " Team",
    title: "Community Team", verified: false, is_lead: true, specialties: [community.asset_class],
  } as Mentor]
  const totalMembers = community.members_count || 0
  const features = getFeatures(community)

  // Trading data
  const pairsMap: Record<string, { pair: string; pct: number }[]> = {
    forex: [{ pair: "EUR/USD", pct: 34 }, { pair: "GBP/JPY", pct: 28 }, { pair: "XAU/USD", pct: 22 }, { pair: "USD/JPY", pct: 16 }],
    crypto: [{ pair: "BTC/USD", pct: 40 }, { pair: "ETH/USD", pct: 30 }, { pair: "SOL/USD", pct: 18 }, { pair: "XRP/USD", pct: 12 }],
    stocks: [{ pair: "SPY", pct: 32 }, { pair: "AAPL", pct: 24 }, { pair: "TSLA", pct: 24 }, { pair: "NVDA", pct: 20 }],
    futures: [{ pair: "ES", pct: 38 }, { pair: "NQ", pct: 30 }, { pair: "CL", pct: 18 }, { pair: "GC", pct: 14 }],
    mixed: [{ pair: "BTC/USD", pct: 30 }, { pair: "EUR/USD", pct: 28 }, { pair: "SPY", pct: 24 }, { pair: "GBP/JPY", pct: 18 }],
  }
  const pairs = pairsMap[community.asset_class] || pairsMap.mixed
  const heatmap = community.weekly_heatmap || [60, 65, 70, 75, 70, 40, 25]
  const peak = Math.max(...heatmap)
  const winRate = 62 + Math.floor((community.members_count || 100) % 20)
  const avgRR = (1.2 + ((community.members_count || 100) % 15) * 0.1).toFixed(1)
  const signalsWk = community.posts_per_week || 12
  const sessionLabel = SESSION_MAP[community.session_focus || ""] || "Multi"
  const monthlyGain = Math.round(winRate * 0.3)
  const daysShort = ["M", "T", "W", "T", "F", "S", "S"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: MOTION.ease, delay: index * 0.05 }}
      className="relative group cursor-pointer overflow-visible"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        boxShadow: ELEVATION.card,
        border: `1px solid rgba(${accent.rgb},0.04)`,
      }}
      whileHover={{
        y: MOTION.hoverLift,
        boxShadow: ELEVATION.cardGlow(accent.rgb),
        borderColor: `rgba(${accent.rgb},0.15)`,
      }}
      onClick={() => onSelect(community)}
      onMouseLeave={() => setHoveredMentor(null)}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: GRADIENT.cardAccent(accent.rgb), borderRadius: `${RADIUS.card} ${RADIUS.card} 0 0` }} />

      {/* ═══ HERO BACKGROUND ═══ */}
      <div className="relative overflow-hidden" style={{ height: 80 }}>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 120% 160% at 15% 85%, rgba(${bg.g1},0.14) 0%, transparent 55%),
            radial-gradient(ellipse 100% 140% at 90% 15%, rgba(${bg.g2},0.10) 0%, transparent 55%)
          `,
        }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`cp-${community.id}`} width="30" height="16" patternUnits="userSpaceOnUse">
              <path d={bg.pat} fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#cp-${community.id})`} />
        </svg>
        <div className="absolute -bottom-1 right-3">
          <span className="text-[38px] font-black uppercase leading-none tracking-tighter"
            style={{ color: `rgba(${accent.rgb},0.03)` }}>{community.asset_class}</span>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="px-4 pt-2.5 pb-3.5">

        {/* ROW 1: Name + Members */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[15px] font-black tracking-tight leading-snug"
            style={{ color: "rgba(255,255,255,0.92)" }}>
            {community.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            <span className="text-[7px] uppercase tracking-wider font-bold" style={{ color: "rgba(148,163,184,0.2)" }}>Members</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke={`rgba(${accent.rgb},0.35)`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <span className="text-[11px] font-black font-mono" style={{ color: `rgba(${accent.rgb},0.55)` }}>
              {totalMembers >= 1000 ? `${(totalMembers / 1000).toFixed(1)}k` : totalMembers}
            </span>
          </div>
        </div>

        {/* ROW 2: Tagline */}
        <p className="text-[10px] leading-[1.65] mb-3 line-clamp-2"
          style={{ color: "rgba(148,163,184,0.45)" }}>
          <HighlightedText text={community.tagline} accentRgb={accent.rgb} />
        </p>

        {/* ROW 3: 4 Feature Cards in 2x2 grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.015)", border: `1px solid rgba(${f.accent},0.04)` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(${f.accent},0.05)` }}>
                {f.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[7px] uppercase tracking-[0.12em] font-bold block" style={{ color: `rgba(${f.accent},0.3)` }}>{f.label}</span>
                <span className="text-[10px] font-bold block leading-tight truncate" style={{ color: "rgba(255,255,255,0.65)" }}>{f.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 4: Trading Intelligence -- redesigned with visual hierarchy */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.015)", border: `1px solid rgba(${accent.rgb},0.04)` }}>
          {/* Big Stats Row */}
          <div className="flex items-stretch">
            <div className="flex-1 text-center py-2.5" style={{ borderRight: `1px solid rgba(${accent.rgb},0.04)` }}>
              <span className="text-[18px] font-black font-mono block leading-none" style={{ color: `rgba(${ACCENT.emerald.rgb},0.7)` }}>{winRate}%</span>
              <span className="text-[7px] uppercase tracking-[0.12em] font-bold mt-1 block" style={{ color: "rgba(148,163,184,0.2)" }}>Win Rate</span>
            </div>
            <div className="flex-1 text-center py-2.5" style={{ borderRight: `1px solid rgba(${accent.rgb},0.04)` }}>
              <span className="text-[18px] font-black font-mono block leading-none" style={{ color: `rgba(${accent.rgb},0.6)` }}>{avgRR}R</span>
              <span className="text-[7px] uppercase tracking-[0.12em] font-bold mt-1 block" style={{ color: "rgba(148,163,184,0.2)" }}>Avg R:R</span>
            </div>
            <div className="flex-1 text-center py-2.5">
              <span className="text-[18px] font-black font-mono block leading-none" style={{ color: `rgba(${ACCENT.cyan.rgb},0.6)` }}>{signalsWk}</span>
              <span className="text-[7px] uppercase tracking-[0.12em] font-bold mt-1 block" style={{ color: "rgba(148,163,184,0.2)" }}>Signals/wk</span>
            </div>
          </div>

          {/* Pairs Row -- different look: horizontal ticker-style */}
          <div className="flex items-center gap-0" style={{ borderTop: `1px solid rgba(${accent.rgb},0.03)` }}>
            {pairs.map((p, i) => (
              <div key={p.pair} className="flex-1 text-center py-2" style={{ borderRight: i < pairs.length - 1 ? `1px solid rgba(${accent.rgb},0.03)` : "none" }}>
                <span className="text-[8px] font-bold font-mono block leading-none" style={{ color: `rgba(${accent.rgb},0.4)` }}>{p.pair}</span>
                <span className="text-[12px] font-black font-mono block mt-0.5" style={{ color: `rgba(${accent.rgb},${0.25 + p.pct * 0.012})` }}>{p.pct}%</span>
              </div>
            ))}
          </div>

          {/* Weekly mini heatmap + session + monthly */}
          <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: `1px solid rgba(${accent.rgb},0.03)` }}>
            <div className="flex items-end gap-[2px]">
              {heatmap.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-[1px]">
                  <div className="rounded-sm" style={{
                    width: 8, height: Math.max(2, (v / 100) * 14),
                    background: v === peak ? `rgba(${accent.rgb},0.5)` : `rgba(${accent.rgb},0.12)`,
                  }} />
                  <span className="text-[5px] font-mono" style={{ color: "rgba(148,163,184,0.15)" }}>{daysShort[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: `rgba(${accent.rgb},0.04)`, color: `rgba(${accent.rgb},0.35)` }}>{sessionLabel}</span>
              <span className="text-[8px] font-bold font-mono" style={{ color: `rgba(${ACCENT.emerald.rgb},0.45)` }}>+{monthlyGain}%</span>
            </div>
          </div>
        </div>

        {/* ROW 5: Mentor (always at least 1 for consistent card height) */}
        <div ref={mentorRef} className="relative mb-3">
          {displayMentors.slice(0, 1).map((m) => (
            <div key={m.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200"
              style={{
                background: hoveredMentor?.id === m.id ? `rgba(${accent.rgb},0.04)` : "rgba(255,255,255,0.01)",
                border: `1px solid ${hoveredMentor?.id === m.id ? `rgba(${accent.rgb},0.1)` : "rgba(255,255,255,0.02)"}`,
              }}
              onMouseEnter={() => setHoveredMentor(m)}
              onMouseLeave={() => setHoveredMentor(null)}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, rgba(${accent.rgb},0.1), rgba(${accent.rgb},0.03))` }}>
                <span className="text-[11px] font-black" style={{ color: `rgba(${accent.rgb},0.5)` }}>
                  {m.display_name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold truncate" style={{ color: "rgba(255,255,255,0.65)" }}>{m.display_name}</span>
                  {m.verified && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill={`rgba(${ACCENT.emerald.rgb},0.45)`}>
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  )}
                  {m.is_lead && (
                    <span className="text-[6px] font-bold uppercase tracking-wider px-1 py-0.5 rounded"
                      style={{ background: `rgba(${accent.rgb},0.06)`, color: `rgba(${accent.rgb},0.45)` }}>Lead</span>
                  )}
                </div>
              </div>
              <span className="text-[8px] leading-[1.4] max-w-[110px] text-right flex-shrink-0" style={{ color: "rgba(148,163,184,0.3)" }}>
                {m.specialties && m.specialties.length > 0
                  ? m.specialties.slice(0, 2).join(", ")
                  : m.title || "Trading mentor"}
              </span>
            </div>
          ))}
          {displayMentors.length > 1 && (
            <div className="flex items-center gap-1 mt-1 px-2">
              <div className="flex -space-x-1">
                {displayMentors.slice(1, 4).map((m, i) => (
                  <div key={m.id} className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold"
                    style={{
                      background: `rgba(${accent.rgb},0.08)`,
                      border: `1px solid rgba(${accent.rgb},0.12)`,
                      color: `rgba(${accent.rgb},0.4)`,
                      zIndex: 3 - i,
                    }}>{m.display_name?.charAt(0)}</div>
                ))}
              </div>
              <span className="text-[7px]" style={{ color: "rgba(148,163,184,0.2)" }}>+{displayMentors.length - 1} more</span>
            </div>
          )}

          {/* Mentor hover popup */}
          <AnimatePresence>
            {hoveredMentor && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute z-[60] left-0 right-0 pointer-events-none"
                style={{ bottom: "calc(100% + 6px)" }}>
                <div className="rounded-xl overflow-hidden mx-1"
                  style={{
                    background: "rgba(8,10,20,0.98)",
                    border: `1px solid rgba(${accent.rgb},0.12)`,
                    boxShadow: `0 20px 56px rgba(0,0,0,0.7), ${GLOW.med(accent.rgb)}`,
                    backdropFilter: "blur(24px)",
                  }}>
                  <div style={{ height: 2, background: `linear-gradient(90deg, transparent, rgb(${accent.rgb}), transparent)`, opacity: 0.4 }} />
                  <div className="p-3">
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, rgba(${accent.rgb},0.12), rgba(${accent.rgb},0.04))`, border: `1px solid rgba(${accent.rgb},0.12)` }}>
                        <span className="text-[14px] font-black" style={{ color: `rgba(${accent.rgb},0.6)` }}>
                          {hoveredMentor.display_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[12px] font-black" style={{ color: "rgba(255,255,255,0.9)" }}>{hoveredMentor.display_name}</span>
                          {hoveredMentor.verified && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill={`rgba(${ACCENT.emerald.rgb},0.5)`}>
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                          )}
                        </div>
                        {hoveredMentor.title && <span className="text-[9px] block" style={{ color: "rgba(148,163,184,0.45)" }}>{hoveredMentor.title}</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {hoveredMentor.rating != null && (
                        <div className="text-center p-1.5 rounded-lg" style={{ background: `rgba(${ACCENT.amber.rgb},0.04)` }}>
                          <span className="text-[12px] font-black font-mono block" style={{ color: `rgba(${ACCENT.amber.rgb},0.6)` }}>{hoveredMentor.rating.toFixed(1)}</span>
                          <span className="text-[7px]" style={{ color: "rgba(148,163,184,0.25)" }}>Rating</span>
                        </div>
                      )}
                      {hoveredMentor.total_students != null && (
                        <div className="text-center p-1.5 rounded-lg" style={{ background: `rgba(${accent.rgb},0.04)` }}>
                          <span className="text-[12px] font-black font-mono block" style={{ color: `rgba(${accent.rgb},0.5)` }}>{hoveredMentor.total_students >= 1000 ? `${(hoveredMentor.total_students / 1000).toFixed(1)}k` : hoveredMentor.total_students}</span>
                          <span className="text-[7px]" style={{ color: "rgba(148,163,184,0.25)" }}>Students</span>
                        </div>
                      )}
                      {hoveredMentor.years_experience != null && (
                        <div className="text-center p-1.5 rounded-lg" style={{ background: `rgba(${accent.rgb},0.04)` }}>
                          <span className="text-[12px] font-black font-mono block" style={{ color: `rgba(${accent.rgb},0.5)` }}>{hoveredMentor.years_experience}yr</span>
                          <span className="text-[7px]" style={{ color: "rgba(148,163,184,0.25)" }}>Experience</span>
                        </div>
                      )}
                    </div>
                    {hoveredMentor.specialties && hoveredMentor.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hoveredMentor.specialties.map(s => (
                          <span key={s} className="text-[7px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{ background: `rgba(${accent.rgb},0.05)`, color: `rgba(${accent.rgb},0.4)` }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ROW 6: Explore button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.12em] transition-all"
          style={{
            background: `linear-gradient(135deg, rgba(${accent.rgb},0.08) 0%, rgba(${accent.rgb},0.03) 100%)`,
            border: `1px solid rgba(${accent.rgb},0.08)`,
            color: `rgba(${accent.rgb},0.6)`,
          }}>
          Explore Community
        </motion.div>
      </div>
    </motion.div>
  )
}
