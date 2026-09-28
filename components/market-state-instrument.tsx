"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useInstrument } from "@/lib/stores/useInstrument"

/* ═══════════════════════════════════════════════════════════════════════
   PAIR / SESSION INTELLIGENCE MAP
   ═══════════════════════════════════════════════════════════════════════ */

interface PairSessionProfile {
  dominantSession: string
  secondarySession: string
  deadZone: string
  sessionBehavior: Record<string, string>
  keyKillzones: string[]
  character: string
}

const PAIR_PROFILES: Record<string, PairSessionProfile> = {
  EURUSD: {
    dominantSession: "london", secondarySession: "newyork", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Consolidation. Tight range. No institutional interest.",
      tokyo: "Minor positioning. Watch for false breaks against London direction.",
      london: "Primary expansion. This is where EUR/USD makes its move. Frankfurt open sets the trap, London break executes it.",
      newyork: "Continuation or reversal of London move. NY session decides if London was right.",
    },
    keyKillzones: ["London Open (07:00)", "NY Open (12:00)"],
    character: "The benchmark pair. Moves on European macro and Fed positioning.",
  },
  GBPUSD: {
    dominantSession: "london", secondarySession: "newyork", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Dead. No meaningful volume. Avoid.",
      tokyo: "Occasional stop hunts above/below Asian range before London.",
      london: "Volatile expansion. Cable moves fast and punishes late entries.",
      newyork: "Second leg opportunity. Often retraces London move then extends or fully reverses.",
    },
    keyKillzones: ["London Open (07:00)", "NY Open (12:00)"],
    character: "The volatile Sterling pair. Wider stops needed. Respects SMT divergence with EUR/USD.",
  },
  USDJPY: {
    dominantSession: "tokyo", secondarySession: "newyork", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Light flows. BOJ intervention rumors can spike it unexpectedly.",
      tokyo: "Primary session. Japanese institutional flows dominate. Moves are methodical, trending.",
      london: "European banks position against Tokyo flow. Reversals common at London open.",
      newyork: "US Treasury yields drive it. Moves correlate with bond market, not just FX.",
    },
    keyKillzones: ["Tokyo Open (23:00)", "NY Open (12:00)"],
    character: "The carry trade pair. Driven by yield differentials and risk sentiment.",
  },
  AUDUSD: {
    dominantSession: "sydney", secondarySession: "tokyo", deadZone: "newyork",
    sessionBehavior: {
      sydney: "Primary expansion window. RBA flows and commodity sentiment drive the move.",
      tokyo: "Continuation of Sydney direction. Chinese data releases create secondary impulse.",
      london: "Usually rangebound unless risk-off event.",
      newyork: "Low relevance unless broad USD move.",
    },
    keyKillzones: ["Sydney Open (21:00)", "Tokyo Open (23:00)"],
    character: "The commodity currency. Tracks iron ore, risk appetite, and China PMI.",
  },
  USDCAD: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Dead zone. No meaningful volume.",
      tokyo: "Minimal. Pre-positioning ahead of oil inventories.",
      london: "Early positioning begins. Oil price establishes direction.",
      newyork: "Primary expansion. US + Canadian data releases overlap.",
    },
    keyKillzones: ["NY Open (12:00)", "London Open (07:00)"],
    character: "The oil-correlated pair. Tracks WTI crude.",
  },
  SPX500: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Futures overnight. Thin liquidity.",
      tokyo: "Asian risk sentiment sets the tone.",
      london: "European pre-market positioning.",
      newyork: "Cash open at 13:30 UTC is where real volume enters.",
    },
    keyKillzones: ["NY Cash Open (13:30)", "NY Open (12:00)"],
    character: "The equity benchmark. Smart money operates on 15m structure after cash open.",
  },
  NAS100: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Futures drift.", tokyo: "Asian tech sentiment.",
      london: "Pre-market algo positioning.",
      newyork: "Cash open is violent. The 9:30-10:00 AM ET killzone is where the move starts.",
    },
    keyKillzones: ["NY Cash Open (13:30)", "NY Open (12:00)"],
    character: "Tech-heavy. More volatile than SPX.",
  },
  US30: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Minimal activity.", tokyo: "Light positioning.",
      london: "European banks hedge equity exposure.", newyork: "Cash session is everything.",
    },
    keyKillzones: ["NY Cash Open (13:30)", "NY Open (12:00)"],
    character: "Blue-chip industrial index.",
  },
  DE30: {
    dominantSession: "london", secondarySession: "newyork", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Closed / minimal.", tokyo: "Pre-European positioning.",
      london: "Primary session. Frankfurt open at 07:00 UTC is the catalyst.",
      newyork: "Correlation with US equity open.",
    },
    keyKillzones: ["London Open (07:00)", "Frankfurt Open (07:00)"],
    character: "European equity benchmark. Sensitive to ECB policy.",
  },
  BTCUSD: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "none",
    sessionBehavior: {
      sydney: "Whale accumulation zone.", tokyo: "Asian retail flows.",
      london: "Institutional positioning begins.", newyork: "Highest volume. ETF inflows/outflows peak.",
    },
    keyKillzones: ["NY Open (12:00)", "CME Open (13:30)"],
    character: "24/7 market but institution-dominated during NY.",
  },
  ETHUSD: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "none",
    sessionBehavior: {
      sydney: "DeFi activity.", tokyo: "Asian retail.",
      london: "Follows BTC with higher beta.", newyork: "Primary volume. Higher volatility.",
    },
    keyKillzones: ["NY Open (12:00)", "CME Open (13:30)"],
    character: "BTC correlation with DeFi alpha.",
  },
  XAUUSD: {
    dominantSession: "london", secondarySession: "newyork", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Thin. Can gap on geopolitical news.",
      tokyo: "Shanghai Gold Exchange sets Asian premium.",
      london: "Primary price discovery. London Gold Fix.",
      newyork: "COMEX futures drive continuation.",
    },
    keyKillzones: ["London AM Fix (10:30)", "NY Open (12:00)", "London PM Fix (15:00)"],
    character: "The safe haven. Inversely correlated to DXY.",
  },
  XAGUSD: {
    dominantSession: "london", secondarySession: "newyork", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Illiquid. Wide spreads.", tokyo: "Industrial demand from Asian manufacturing.",
      london: "Primary session. Follows gold with higher beta.", newyork: "COMEX continuation.",
    },
    keyKillzones: ["London Open (07:00)", "NY Open (12:00)"],
    character: "Gold with higher beta.",
  },
  WTI: {
    dominantSession: "newyork", secondarySession: "london", deadZone: "sydney",
    sessionBehavior: {
      sydney: "Geopolitical headlines only.", tokyo: "Asian demand signals.",
      london: "Brent crude leads.", newyork: "NYMEX is king. Wednesday EIA is key.",
    },
    keyKillzones: ["NY Open (12:00)", "EIA Report (14:30 Wed)"],
    character: "Supply/demand driven. OPEC + geopolitics.",
  },
}

const DEFAULT_PROFILE: PairSessionProfile = {
  dominantSession: "london", secondarySession: "newyork", deadZone: "sydney",
  sessionBehavior: {
    sydney: "Low volume.", tokyo: "Asian session flow.",
    london: "Primary expansion.", newyork: "Continuation or reversal.",
  },
  keyKillzones: ["London Open (07:00)", "NY Open (12:00)"],
  character: "Standard pair behavior profile.",
}

/* ═══════════════════════════════════════════════════════════════════════
   SESSION DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════ */

interface SessionDef {
  key: string; label: string; shortLabel: string
  startH: number; startM: number; endH: number; endM: number
  color: { text: string; fill: string; muted: string; hex: string; rgb: string }
  liquidityWeight: number
}

const SESSIONS: SessionDef[] = [
  {
    key: "sydney", label: "Sydney", shortLabel: "SYD",
    startH: 21, startM: 0, endH: 6, endM: 0,
    color: { text: "text-emerald-400", fill: "bg-emerald-400", muted: "text-emerald-400/40", hex: "#34d399", rgb: "52,211,153" },
    liquidityWeight: 0.15,
  },
  {
    key: "tokyo", label: "Tokyo", shortLabel: "TKY",
    startH: 23, startM: 0, endH: 8, endM: 0,
    color: { text: "text-amber-400", fill: "bg-amber-400", muted: "text-amber-400/40", hex: "#fbbf24", rgb: "251,191,36" },
    liquidityWeight: 0.3,
  },
  {
    key: "london", label: "London", shortLabel: "LDN",
    startH: 7, startM: 0, endH: 16, endM: 0,
    color: { text: "text-blue-400", fill: "bg-blue-400", muted: "text-blue-400/40", hex: "#60a5fa", rgb: "96,165,250" },
    liquidityWeight: 0.85,
  },
  {
    key: "newyork", label: "New York", shortLabel: "NYC",
    startH: 12, startM: 0, endH: 21, endM: 0,
    color: { text: "text-sky-400", fill: "bg-sky-400", muted: "text-sky-400/40", hex: "#38bdf8", rgb: "56,189,248" },
    liquidityWeight: 0.9,
  },
]

const MAJOR_OPENS = [
  { label: "London Open", hour: 7, minute: 0, sessionKey: "london" },
  { label: "NY Open", hour: 12, minute: 0, sessionKey: "newyork" },
  { label: "Tokyo Open", hour: 23, minute: 0, sessionKey: "tokyo" },
  { label: "Sydney Open", hour: 21, minute: 0, sessionKey: "sydney" },
]

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function toMin(h: number, m: number) { return h * 60 + m }

function isActive(s: SessionDef, t: number): boolean {
  const start = toMin(s.startH, s.startM)
  const end = toMin(s.endH, s.endM)
  return start > end ? t >= start || t < end : t >= start && t < end
}

function sessionProgress(s: SessionDef, t: number): number {
  const start = toMin(s.startH, s.startM)
  let end = toMin(s.endH, s.endM)
  if (start > end) end += 1440
  let cur = t
  if (cur < start) cur += 1440
  return Math.max(0, Math.min(1, (cur - start) / (end - start)))
}

function sessionPhase(prog: number): { label: string; detail: string } {
  if (prog < 0.15) return { label: "OPENING", detail: "Initial liquidity sweep. Judas swing likely." }
  if (prog < 0.35) return { label: "EXPANSION", detail: "Smart money revealing direction." }
  if (prog < 0.65) return { label: "MIDPOINT", detail: "Primary move. Entry window closing." }
  if (prog < 0.85) return { label: "DISTRIBUTION", detail: "Profit-taking begins." }
  return { label: "CLOSING", detail: "Session winding down. Avoid new entries." }
}

function nextOpen(t: number): { label: string; minutes: number; sessionKey: string } {
  let best = { label: "", minutes: Infinity, sessionKey: "" }
  for (const o of MAJOR_OPENS) {
    let d = toMin(o.hour, o.minute) - t
    if (d <= 0) d += 1440
    if (d < best.minutes) best = { label: o.label, minutes: d, sessionKey: o.sessionKey }
  }
  return best
}

function fmtCountdown(m: number): string {
  const h = Math.floor(m / 60)
  const r = m % 60
  return h ? `${h}h ${String(r).padStart(2, "0")}m` : `${r}m`
}

function computeIntensity(active: SessionDef[]): number {
  if (!active.length) return 0
  return Math.min(1, active.reduce((a, s) => a + s.liquidityWeight, 0))
}

function getConditionLabel(intensity: number) {
  if (intensity >= 0.75) return { label: "PEAK VOLUME", shortLabel: "PEAK", color: "text-red-400", glowHex: "248,113,113", borderColor: "border-red-500/20" }
  if (intensity >= 0.45) return { label: "HIGH VOLUME", shortLabel: "ACTIVE", color: "text-amber-400", glowHex: "251,191,36", borderColor: "border-amber-500/20" }
  if (intensity > 0.1) return { label: "LOW VOLUME", shortLabel: "LOW", color: "text-zinc-400", glowHex: "161,161,170", borderColor: "border-zinc-500/15" }
  return { label: "MARKET QUIET", shortLabel: "QUIET", color: "text-zinc-600", glowHex: "82,82,91", borderColor: "border-zinc-700/15" }
}

function getDayIntel(): { day: string; note: string } {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const d = new Date().getUTCDay()
  const notes: Record<number, string> = {
    0: "Market closed. Prepare weekly analysis.",
    1: "Monday. Accumulation day. Ranges set for the week.",
    2: "Tuesday. Highest probability day. Institutional direction reveals.",
    3: "Wednesday. Mid-week reversal possible. FOMC / EIA.",
    4: "Thursday. Continuation or expansion day.",
    5: "Friday. NFP risk. Position reduction before weekend.",
    6: "Market closed. Review the week.",
  }
  return { day: days[d], note: notes[d] || "" }
}


/* ═══════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════ */

export function MarketStateInstrument() {
  const [now, setNow] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const { instrument } = useInstrument()
  const pairSymbol = instrument.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "")

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (leaveTimeout.current) { clearTimeout(leaveTimeout.current); leaveTimeout.current = null }
    hoverTimeout.current = setTimeout(() => setOpen(true), 80)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null }
    leaveTimeout.current = setTimeout(() => setOpen(false), 400)
  }, [])

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
    }
  }, [])

  const t = now.getUTCHours() * 60 + now.getUTCMinutes()
  const secs = now.getUTCSeconds()
  const activeSessions = useMemo(() => SESSIONS.filter(s => isActive(s, t)), [t])
  const intensity = useMemo(() => computeIntensity(activeSessions), [activeSessions])
  const next = useMemo(() => nextOpen(t), [t])
  const condition = getConditionLabel(intensity)
  const dayIntel = useMemo(() => getDayIntel(), [])

  const profile = PAIR_PROFILES[pairSymbol] || DEFAULT_PROFILE
  const dominantSessionActive = activeSessions.some(s => s.key === profile.dominantSession)
  const secondarySessionActive = activeSessions.some(s => s.key === profile.secondarySession)
  const inDeadZone = !dominantSessionActive && !secondarySessionActive && activeSessions.length > 0 &&
    activeSessions.every(s => s.key === profile.deadZone || (profile.deadZone !== "none" && s.key !== profile.dominantSession && s.key !== profile.secondarySession))

  const currentBehavior = activeSessions.length > 0
    ? activeSessions.map(s => profile.sessionBehavior[s.key] || "").filter(Boolean)
    : [profile.sessionBehavior[profile.deadZone] || "No active session."]

  const getAlignmentVerdict = (): { verdict: string; level: "optimal" | "acceptable" | "caution" | "avoid" } => {
    if (!activeSessions.length) return { verdict: "Market closed. No session active.", level: "avoid" }
    if (inDeadZone) return { verdict: `${pairSymbol} is in its dead zone. Wait for the primary session.`, level: "avoid" }
    if (dominantSessionActive && secondarySessionActive) return { verdict: `Optimal window. Dominant + secondary overlapping. Peak institutional flow.`, level: "optimal" }
    if (dominantSessionActive) return { verdict: `Primary session active. This is where ${pairSymbol} moves.`, level: "optimal" }
    if (secondarySessionActive) return { verdict: `Secondary window. Acceptable but not primary.`, level: "acceptable" }
    return { verdict: `Low relevance in the current session.`, level: "caution" }
  }

  const alignment = getAlignmentVerdict()

  const pad = (n: number) => String(n).padStart(2, "0")
  const h = pad(now.getUTCHours())
  const m = pad(now.getUTCMinutes())
  const s = pad(secs)
  const timeStr = `${h}:${m}:${s}`

  const nextOpenSignificance = (): string => {
    if (next.sessionKey === profile.dominantSession) return `Primary session for ${pairSymbol}. Expect expansion.`
    if (next.sessionKey === profile.secondarySession) return `Secondary window for ${pairSymbol}.`
    return `Low relevance for ${pairSymbol}.`
  }

  const alignColors = {
    optimal: { hex: "#34d399", bg: "bg-emerald-400", text: "text-emerald-400" },
    acceptable: { hex: "#fbbf24", bg: "bg-amber-400", text: "text-amber-400" },
    caution: { hex: "#fb923c", bg: "bg-orange-400", text: "text-orange-400" },
    avoid: { hex: "#f87171", bg: "bg-red-400", text: "text-red-400" },
  }[alignment.level]

  // 24h timeline pct
  const nowPct = (t / 1440) * 100
  const toPct = (min: number) => (min / 1440) * 100

  // Compute per-session color accents for the trigger
  const primarySessColor = activeSessions[0]?.color || SESSIONS[2].color

  return (
    <div
      ref={ref}
      className="relative"
      style={{ zIndex: 60 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ═══════════════════════════════════════════════════════════════
          COLLAPSED TRIGGER
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "relative flex items-center h-[34px] rounded-xl select-none cursor-default transition-all duration-300",
          open
            ? "bg-white/[0.04] border-white/[0.06]"
            : "bg-transparent border-transparent hover:bg-white/[0.025] hover:border-white/[0.04]"
        )}
        style={{ border: open ? `1px solid rgba(255,255,255,0.06)` : "1px solid transparent" }}
        aria-label="Market state instrument"
      >
        {/* ── Clock + dot ── */}
        <div className="flex items-center gap-2 pl-3 pr-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{ backgroundColor: alignColors.hex }}
          />
          <div className="flex items-baseline">
            <span className="font-mono text-[13px] font-bold text-white/70 tabular-nums tracking-tight leading-none">{h}</span>
            <motion.span
              animate={{ opacity: [0.7, 0.15, 0.7] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="font-mono text-[13px] font-bold text-white/30 leading-none mx-[1px]"
            >:</motion.span>
            <span className="font-mono text-[13px] font-bold text-white/70 tabular-nums tracking-tight leading-none">{m}</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-px h-3.5 bg-white/[0.06] flex-shrink-0" />

        {/* ── Sessions ── */}
        <div className="flex items-center gap-1.5 px-2">
          {activeSessions.length > 0 ? (
            activeSessions.map((sess) => (
              <div key={sess.key} className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: sess.color.hex, opacity: 0.7 }} />
                <span className="text-[9px] font-semibold tracking-wide leading-none"
                  style={{ color: sess.color.hex, opacity: 0.55 }}>
                  {sess.shortLabel}
                </span>
              </div>
            ))
          ) : (
            <span className="text-[9px] text-white/15 font-semibold tracking-wider">CLOSED</span>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="w-px h-3.5 bg-white/[0.06] flex-shrink-0" />

        {/* ── Next countdown ── */}
        <div className="flex items-center gap-1.5 px-2 pr-3">
          <span className="text-[8px] text-white/15 font-semibold uppercase tracking-wider leading-none">
            {next.label.replace(" Open", "").substring(0, 3)}
          </span>
          <span className={cn(
            "font-mono text-[11px] font-bold tabular-nums leading-none",
            next.minutes <= 15 ? "text-red-400/60" : next.minutes <= 30 ? "text-amber-400/40" : "text-white/25"
          )}>
            {fmtCountdown(next.minutes)}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EXPANDED PANEL -- premium glass panel design
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 mt-2 w-[480px]"
            style={{ zIndex: 70 }}
          >
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 bg-[#0c0e14]/[0.98] border border-white/[0.06]"
              style={{ backdropFilter: "blur(32px)" }}
            >

              {/* ────────────────────────────────────────────────
                  SESSION CARDS -- at the very top
                  ──────────────────────────────────────────────── */}
              <div className="px-5 pt-4 pb-3">
                <div className="grid grid-cols-4 gap-2">
                  {SESSIONS.map(sess => {
                    const act = isActive(sess, t)
                    const prog = act ? sessionProgress(sess, t) : 0
                    const phase = act ? sessionPhase(prog) : null
                    const isDom = sess.key === profile.dominantSession
                    const isSec = sess.key === profile.secondarySession
                    const isDead = sess.key === profile.deadZone

                    const sessOpenMin = toMin(sess.startH, sess.startM)
                    let minsUntilOpen = sessOpenMin - t
                    if (minsUntilOpen <= 0) minsUntilOpen += 1440

                    return (
                      <div key={sess.key}
                        className="relative rounded-lg overflow-hidden transition-all duration-300"
                        style={{
                          background: act ? `${sess.color.hex}06` : "rgba(255,255,255,0.01)",
                          border: act ? `1px solid ${sess.color.hex}15` : "1px solid rgba(255,255,255,0.03)",
                        }}
                      >
                        {act && (
                          <div className="absolute top-0 left-2 right-2 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${sess.color.hex}30, transparent)` }} />
                        )}
                        <div className="relative z-10 px-2.5 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <motion.div
                                animate={act ? { opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                                style={{ backgroundColor: act ? sess.color.hex : "rgba(255,255,255,0.06)" }}
                              />
                              <span className="text-[9px] font-bold tracking-wide leading-none"
                                style={{ color: act ? sess.color.hex : "rgba(255,255,255,0.18)", opacity: act ? 0.85 : 1 }}>
                                {sess.shortLabel}
                              </span>
                            </div>
                            {isDom && <span className="text-[5px] uppercase tracking-[0.15em] font-extrabold rounded px-1 py-[1px]" style={{ color: sess.color.hex, opacity: 0.45, backgroundColor: `${sess.color.hex}08` }}>PRI</span>}
                            {isSec && !isDom && <span className="text-[5px] uppercase tracking-[0.15em] font-bold rounded px-1 py-[1px]" style={{ color: sess.color.hex, opacity: 0.3, backgroundColor: `${sess.color.hex}06` }}>SEC</span>}
                          </div>
                          {act && phase ? (
                            <div>
                              <span className="text-[7px] font-bold uppercase tracking-[0.1em] block"
                                style={{ color: sess.color.hex, opacity: 0.5 }}>
                                {phase.label}
                              </span>
                              <p className="text-[6.5px] text-white/20 leading-[1.3] mt-0.5 line-clamp-2">{phase.detail}</p>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-[6.5px] text-white/12 uppercase tracking-wider font-bold">in</span>
                                <span className="text-[8px] font-mono font-bold tabular-nums leading-none"
                                  style={{ color: sess.color.hex, opacity: 0.3 }}>
                                  {fmtCountdown(minsUntilOpen)}
                                </span>
                              </div>
                              <p className="text-[6.5px] leading-[1.3] mt-0.5 line-clamp-1"
                                style={{ color: isDom || isSec ? sess.color.hex : "rgba(255,255,255,0.12)", opacity: 0.3 }}>
                                {isDom ? `Key for ${pairSymbol}` : isSec ? `Worth watching` : isDead ? `Low relevance` : `Minor`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)` }} />

              {/* ────────────────────────────────���───────────────
                  24H TIMELINE
                  ──────────────────────────────────────────────── */}
              <div className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] text-white/25 uppercase tracking-[0.14em] font-bold">24h Timeline</span>
                  <span className="text-[8px] text-white/20 font-mono tabular-nums">{dayIntel.day}</span>
                </div>
                <div className="relative h-[18px] rounded-md overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.012)", border: "1px solid rgba(255,255,255,0.025)" }}>
                  {SESSIONS.map((sess) => {
                    const start = toMin(sess.startH, sess.startM)
                    const end = toMin(sess.endH, sess.endM)
                    const act = isActive(sess, t)
                    const opacity = act ? 0.1 : 0.02

                    if (start > end) {
                      return (
                        <span key={sess.key}>
                          <div className="absolute inset-y-0 transition-opacity duration-500"
                            style={{ left: `${toPct(start)}%`, right: 0, backgroundColor: sess.color.hex, opacity }} />
                          <div className="absolute inset-y-0 transition-opacity duration-500"
                            style={{ left: 0, width: `${toPct(end)}%`, backgroundColor: sess.color.hex, opacity }} />
                        </span>
                      )
                    }
                    return (
                      <div key={sess.key} className="absolute inset-y-0 transition-opacity duration-500"
                        style={{ left: `${toPct(start)}%`, width: `${toPct(end - start)}%`, backgroundColor: sess.color.hex, opacity }} />
                    )
                  })}

                  {[0, 4, 8, 12, 16, 20].map((hr) => (
                    <div key={hr} className="absolute inset-y-0 w-px bg-white/[0.03]" style={{ left: `${toPct(hr * 60)}%` }}>
                      <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 text-[5px] text-white/12 font-mono tabular-nums select-none">
                        {String(hr).padStart(2, "0")}
                      </span>
                    </div>
                  ))}

                  <motion.div
                    className="absolute inset-y-0 w-[2px] z-10 rounded-full"
                    style={{ left: `${nowPct}%`, background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.35))" }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute z-20 w-[5px] h-[5px] rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${nowPct}%`, top: "50%", backgroundColor: "white", boxShadow: "0 0 6px rgba(255,255,255,0.35)" }} />
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 h-px bg-white/[0.03]" />

              {/* ────────────────────────────────────────────────
                  VOLUME -- compact
                  ──────────────────────────────────────────────── */}
              <div className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] text-white/25 uppercase tracking-[0.12em] font-bold">Volume</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[16px] font-mono font-extrabold tabular-nums leading-none", condition.color)} style={{ opacity: 0.65 }}>
                        {Math.round(intensity * 100)}
                      </span>
                      <span className={cn("text-[8px] font-bold uppercase tracking-wider", condition.color)} style={{ opacity: 0.4 }}>
                        {condition.shortLabel}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end gap-[2px] h-4">
                    {Array.from({ length: 8 }).map((_, i) => {
                      const thresh = (i + 1) / 8
                      const filled = intensity >= thresh
                      const barColor = intensity >= 0.75 ? "#f87171" : intensity >= 0.45 ? "#fbbf24" : "#34d399"
                      return (
                        <motion.div key={i}
                          className="w-[4px] rounded-sm"
                          style={{
                            height: `${4 + i * 1.5}px`,
                            backgroundColor: filled ? barColor : "rgba(255,255,255,0.025)",
                            opacity: filled ? 0.5 : 1,
                          }}
                          animate={filled ? { opacity: [0.35, 0.6, 0.35] } : {}}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Section divider */}
              <div className="mx-5 h-px bg-white/[0.03]" />

              {/* ────────────────────────────────────────────────
                  SESSION INTELLIGENCE -- expandable rows
                  ──────────────��───────────────────────────────── */}
              <div className="px-6 py-4">
                <span className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold block mb-3">Session Intelligence</span>
                <div className="space-y-1.5">
                  {SESSIONS.map(sess => {
                    const act = isActive(sess, t)
                    const prog = act ? sessionProgress(sess, t) : 0
                    const phase = act ? sessionPhase(prog) : null
                    const isDom = sess.key === profile.dominantSession
                    const isSec = sess.key === profile.secondarySession
                    const isDead = sess.key === profile.deadZone
                    const isExp = expandedSession === sess.key
                    const behavior = profile.sessionBehavior[sess.key] || ""

                    // time until open
                    const sessOpenMin = toMin(sess.startH, sess.startM)
                    let mUntil = sessOpenMin - t
                    if (mUntil <= 0) mUntil += 1440
                    // session window string
                    const windowStr = `${String(sess.startH).padStart(2,"0")}:${String(sess.startM).padStart(2,"0")} – ${String(sess.endH).padStart(2,"0")}:${String(sess.endM).padStart(2,"0")} UTC`

                    return (
                      <motion.div key={sess.key}
                        className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                        style={{
                          background: act ? `linear-gradient(135deg, ${sess.color.hex}05, transparent 50%)` : "transparent",
                          border: act ? `1px solid ${sess.color.hex}10` : "1px solid rgba(255,255,255,0.025)",
                        }}
                        onClick={() => setExpandedSession(isExp ? null : sess.key)}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.015)" }}
                      >
                        <div className="px-4 py-3 flex items-center gap-3">
                          {/* Session indicator */}
                          <motion.div
                            animate={act ? { opacity: [0.4, 1, 0.4] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: act ? sess.color.hex : "rgba(255,255,255,0.04)",
                              boxShadow: act ? `0 0 8px ${sess.color.hex}30` : "none",
                            }}
                          />

                          {/* Name + role tag */}
                          <div className="flex items-center gap-2 w-[110px]">
                            <span className="text-[11px] font-semibold tracking-wide leading-none"
                              style={{ color: act ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)" }}>
                              {sess.label}
                            </span>
                            {isDom && (
                              <span className="text-[6px] font-extrabold uppercase tracking-[0.15em] px-1.5 py-[2px] rounded"
                                style={{ color: sess.color.hex, opacity: 0.5, backgroundColor: `${sess.color.hex}08` }}>PRI</span>
                            )}
                            {isSec && !isDom && (
                              <span className="text-[6px] font-bold uppercase tracking-[0.15em] px-1.5 py-[2px] rounded"
                                style={{ color: sess.color.hex, opacity: 0.3, backgroundColor: `${sess.color.hex}06` }}>SEC</span>
                            )}
                          </div>

                          {/* Status: active phase label OR upcoming countdown */}
                          <div className="flex-1 flex items-center justify-end gap-2">
                            {act && phase ? (
                              <span className="text-[8px] font-bold uppercase tracking-[0.08em] px-2 py-[3px] rounded-md"
                                style={{ color: sess.color.hex, opacity: 0.6, backgroundColor: `${sess.color.hex}08` }}>
                                {phase.label}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[7px] text-white/15 uppercase tracking-[0.08em] font-bold">in</span>
                                <span className="text-[9px] font-mono font-bold tabular-nums"
                                  style={{ color: sess.color.hex, opacity: 0.35 }}>
                                  {fmtCountdown(mUntil)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Chevron */}
                          <motion.svg width="10" height="10" viewBox="0 0 10 10" className="text-white/15 flex-shrink-0"
                            animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                          </motion.svg>
                        </div>

                        <AnimatePresence>
                          {isExp && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-3.5 pt-0.5">
                                <div className="ml-5 pl-3.5" style={{ borderLeft: `1px solid ${sess.color.hex}10` }}>
                                  {/* Window time */}
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[7px] text-white/15 uppercase tracking-[0.1em] font-bold">Window</span>
                                    <span className="text-[9px] font-mono text-white/30 tabular-nums">{windowStr}</span>
                                  </div>
                                  {/* Pair relevance for this session */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[7px] uppercase tracking-[0.1em] font-bold"
                                      style={{ color: isDom ? sess.color.hex : isSec ? sess.color.hex : isDead ? "#f87171" : "rgba(255,255,255,0.15)", opacity: isDom ? 0.6 : 0.4 }}>
                                      {isDom ? `Primary session for ${pairSymbol}` : isSec ? `Secondary session for ${pairSymbol}` : isDead ? `Dead zone for ${pairSymbol}` : `Low relevance for ${pairSymbol}`}
                                    </span>
                                  </div>
                                  {/* Behavior */}
                                  <p className="text-[10px] text-white/35 leading-relaxed">{behavior}</p>
                                  {/* Active phase detail */}
                                  {act && phase && (
                                    <p className="text-[9px] mt-1.5 leading-relaxed italic" style={{ color: sess.color.hex, opacity: 0.35 }}>
                                      {phase.detail}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Section divider */}
              <div className="mx-5 h-px bg-white/[0.03]" />

              {/* ────────────────────────────────────────────────
                  BOTTOM: Killzones + Next + Character
                  ──────────────────────────────────────────────── */}
              <div className="px-6 py-4">
                <div className="flex gap-3 mb-3.5">
                  {/* Killzones */}
                  <div className="flex-1">
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.12em] font-bold block mb-2.5">Key Killzones</span>
                    <div className="flex flex-col gap-1.5">
                      {profile.keyKillzones.map((kz, i) => (
                        <div key={i}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.02] transition-all duration-200 group/kz"
                          style={{ border: "1px solid rgba(255,255,255,0.025)" }}>
                          <motion.div
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primarySessColor.hex, opacity: 0.5 }}
                          />
                          <span className="text-[10px] text-white/35 group-hover/kz:text-white/55 font-mono transition-colors duration-200">{kz}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next open */}
                  {(() => {
                    const nextSess = SESSIONS.find(s => s.key === next.sessionKey)
                    const nextColor = nextSess?.color.hex || "#fff"
                    const nextIsDom = next.sessionKey === profile.dominantSession
                    const nextIsSec = next.sessionKey === profile.secondarySession
                    const nextBehavior = profile.sessionBehavior[next.sessionKey] || ""
                    return (
                      <div className="w-[185px] rounded-xl overflow-hidden relative"
                        style={{ background: `linear-gradient(160deg, ${nextColor}04, transparent 60%)`, border: `1px solid ${nextColor}10` }}>
                        {next.minutes <= 15 && (
                          <motion.div
                            animate={{ opacity: [0.03, 0.08, 0.03] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: `linear-gradient(180deg, ${nextColor}0a, transparent)` }}
                          />
                        )}
                        <div className="absolute top-0 left-3 right-3 h-px"
                          style={{ background: `linear-gradient(90deg, transparent, ${nextColor}20, transparent)` }} />
                        <div className="relative px-4 py-3.5 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] text-white/30 uppercase tracking-[0.12em] font-bold">Next Open</span>
                            {nextIsDom && <span className="text-[6px] font-extrabold uppercase tracking-[0.15em] px-1 py-[2px] rounded" style={{ color: nextColor, opacity: 0.5, backgroundColor: `${nextColor}08` }}>PRI</span>}
                            {nextIsSec && !nextIsDom && <span className="text-[6px] font-bold uppercase tracking-[0.15em] px-1 py-[2px] rounded" style={{ color: nextColor, opacity: 0.35, backgroundColor: `${nextColor}06` }}>SEC</span>}
                          </div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <motion.div
                              animate={{ opacity: [0.3, 0.7, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="w-[6px] h-[6px] rounded-full"
                              style={{ backgroundColor: nextColor, boxShadow: `0 0 6px ${nextColor}35` }}
                            />
                            <span className="text-[12px] font-bold tracking-wide" style={{ color: nextColor, opacity: 0.65 }}>{next.label}</span>
                          </div>
                          <span className={cn(
                            "font-mono text-[20px] font-extrabold tabular-nums leading-none mb-2",
                            next.minutes <= 15 ? "text-red-400/80" : next.minutes <= 30 ? "text-amber-400/55" : "text-white/30"
                          )}>
                            {fmtCountdown(next.minutes)}
                          </span>
                          <p className="text-[8px] text-white/25 leading-[1.5] line-clamp-3">{nextBehavior}</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Character */}
                <div className="rounded-xl px-4 py-3 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: primarySessColor.hex, opacity: 0.4 }} />
                    <span className="text-[9px] text-white/25 uppercase tracking-[0.1em] font-bold">{pairSymbol} Character</span>
                  </div>
                  <p className="text-[10px] text-white/35 leading-relaxed ml-3">{profile.character}</p>
                </div>
              </div>

              {/* Bottom spacing */}
              <div className="h-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
