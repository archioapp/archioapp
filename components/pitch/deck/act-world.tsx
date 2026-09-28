"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT I · THE WORLD — the four visuals that make Owen feel the problem
   cover · noise · scatter · clones · livecall
   ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Hash, Send, MessageCircle, AtSign, Play, Zap, AlertTriangle,
  CandlestickChart, StickyNote, Table, Bot, Calendar, Building2,
  Brain, Users, Layers, Radio, Clock, Sparkles, ShieldAlert, HelpCircle,
  ArrowRight, Store, GraduationCap, type LucideIcon,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, seeded, DECK_EASE } from "./slide-frame"

/* ═══════════════════════════════════════════════════════════════════════
   COVER — six fragments resolving into one core + the four-act agenda
   ═══════════════════════════════════════════════════════════════════════ */

const COVER_FRAGMENTS: { icon: LucideIcon; label: string }[] = [
  { icon: CandlestickChart, label: "Chart" },
  { icon: Users, label: "Mentor" },
  { icon: Brain, label: "AI" },
  { icon: Layers, label: "Rules" },
  { icon: Building2, label: "Broker" },
  { icon: StickyNote, label: "Journal" },
]

export function CoverScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const R = 104

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* orbital */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative" style={{ width: 300, height: 300 }}>
          {[1, 0.66].map((k, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                inset: `${(1 - k) * 50}%`,
                border: `1px solid ${withAlpha(accent, 0.16 + i * 0.08)}`,
              }}
              aria-hidden
            />
          ))}
          {COVER_FRAGMENTS.map((f, i) => {
            const a = (i / COVER_FRAGMENTS.length) * Math.PI * 2 - Math.PI / 2
            const x = Math.cos(a) * R
            const y = Math.sin(a) * R
            const c = pal.spectrum[i % pal.spectrum.length]
            return (
              <motion.div
                key={f.label}
                className="absolute left-1/2 top-1/2 flex flex-col items-center gap-1"
                style={{ marginLeft: -22, marginTop: -22 }}
                animate={
                  reduce
                    ? { x, y }
                    : { x: [x * 1.25, x, x, x * 0.08, x * 1.25], y: [y * 1.25, y, y, y * 0.08, y * 1.25], opacity: [0.6, 1, 1, 0.2, 0.6] }
                }
                transition={{ duration: 9, times: [0, 0.22, 0.55, 0.78, 1], repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.08 }}
              >
                <span
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: withAlpha(c, 0.14), border: `1px solid ${withAlpha(c, 0.4)}`, boxShadow: glow(c, 0.4) }}
                >
                  <f.icon style={{ color: c, width: 18, height: 18 }} />
                </span>
                <Micro color={pal.textSoft}>{f.label}</Micro>
              </motion.div>
            )
          })}
          {/* core */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${withAlpha(accent, 0.9)}, ${withAlpha(pal.accentDeep, 0.85)})`, boxShadow: glow(accent, 1.4) }}
            animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <span className="font-black tracking-[0.18em] text-[11px]" style={{ color: "#06100E" }}>ARCHIO</span>
          </motion.div>
        </div>
      </div>

      {/* agenda */}
      <div className="lg:col-span-7">
        <Stage pal={pal} accent={accent} className="p-6 md:p-7">
          <Micro color={accent}>Thirty minutes · five parts · interrupt anytime</Micro>
          <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["I", "The world", "Seven problems every trader lives with — and the number that proves it."],
              ["II", "The loop", "Why they lose: five decisions, five places, context dies."],
              ["III", "The system", "The same loop, built consciously. Nine systems, one record."],
              ["IV", "The economy", "Where the $300 a month goes. Four lanes, agents, the city."],
              ["V", "The app", "Where we really are. Then one decision, live."],
            ].map(([n, t, d], i) => (
              <motion.li
                key={n}
                initial={reduce ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: DECK_EASE }}
                className="flex gap-3 items-start p-3 rounded-xl"
                style={{ background: withAlpha(pal.text, 0.03), border: `1px solid ${pal.glassEdge}` }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-[12px]"
                  style={{ background: withAlpha(accent, 0.14), color: accent, border: `1px solid ${withAlpha(accent, 0.35)}`, fontFamily: "var(--font-mono)" }}
                >
                  {n}
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold" style={{ color: pal.text }}>{t}</div>
                  <div className="text-[12px] leading-snug" style={{ color: pal.textSoft }}>{d}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </Stage>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   NOISE — the feed a trader actually lives in
   ═══════════════════════════════════════════════════════════════════════ */

type Platform = "discord" | "telegram" | "whatsapp" | "x" | "youtube" | "whop" | "skool"
const PLATFORM: Record<Platform, { icon: LucideIcon; color: string; name: string }> = {
  discord: { icon: Hash, color: "#7289FF", name: "Discord" },
  telegram: { icon: Send, color: "#3FB6F0", name: "Telegram" },
  whatsapp: { icon: MessageCircle, color: "#4AD66D", name: "WhatsApp" },
  x: { icon: AtSign, color: "#E6EDF3", name: "X" },
  youtube: { icon: Play, color: "#FF4D5E", name: "YouTube" },
  whop: { icon: Store, color: "#FF6A3D", name: "Whop" },
  skool: { icon: GraduationCap, color: "#F5C542", name: "Skool" },
}

const NOISE: { p: Platform; from: string; text: string; scam?: boolean }[] = [
  { p: "telegram", from: "GOLD VIP SIGNALS", text: "XAUUSD BUY NOW — 97% win rate this month", scam: true },
  { p: "discord", from: "#alerts", text: "@everyone EURUSD short 1.0850 sl 40 tp 120" },
  { p: "whop", from: "Elite FX Room", text: "$149/mo · 2,400 members · no track record shown" },
  { p: "whatsapp", from: "Marcus Reed (Official)", text: "DM me for the private mentorship price", scam: true },
  { p: "x", from: "@fx_millionaire", text: "Turned $500 into $48,000 in 3 weeks. Thread." , scam: true },
  { p: "skool", from: "Day Trade Academy", text: "$97/mo course + community · 48 lessons · zero verified" },
  { p: "youtube", from: "Trading Secrets", text: "The ONE strategy banks don't want you to know" },
  { p: "telegram", from: "Prop Firm Passers", text: "We pass your challenge for you. 100% guaranteed", scam: true },
  { p: "discord", from: "#general", text: "anyone know why my stop got hunted again" },
  { p: "telegram", from: "ICT Concepts VIP 2", text: "Join before price goes up tonight", scam: true },
  { p: "whatsapp", from: "Crypto Pump Group", text: "Next 10x call in 10 minutes. Be ready", scam: true },
  { p: "x", from: "@chartwizard", text: "NQ setup. Not financial advice." },
  { p: "discord", from: "#live-calls", text: "mentor is live — link in chat" },
  { p: "telegram", from: "Signals Bot", text: "TP1 HIT +40 pips. TP2 HIT +80 pips. TP3 HIT", scam: true },
  { p: "youtube", from: "FX Academy", text: "Live stream starting: London open" },
  { p: "whatsapp", from: "Unknown", text: "Hi, I saw your profile. Are you into forex?", scam: true },
  { p: "discord", from: "#results", text: "screenshot.png" },
  { p: "telegram", from: "Elite Traders Club", text: "Last 3 spots. Pay in USDT only", scam: true },
  { p: "x", from: "@macro_daily", text: "CPI at 8:30. Expect volatility." },
  { p: "discord", from: "#mentorship", text: "did I miss anything from the call?" },
]

export function NoiseScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(3_812)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setCount((c) => c + 1 + Math.floor(seeded(c, 3) * 3)), 900)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* the feed wall */}
      <Stage pal={pal} accent={accent} className="lg:col-span-8 p-4" style={{ maxHeight: 340 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative overflow-hidden" style={{ maxHeight: 308 }}>
          {NOISE.slice(0, 10).map((m, i) => {
            const P = PLATFORM[m.p]
            return (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1, 1], y: [8, 0, 0, 0], x: [0, seeded(i) * 2 - 1, 0] }}
                transition={{ duration: 0.5 + seeded(i, 2) * 0.4, delay: 0.1 + i * 0.07, ease: DECK_EASE }}
                className="relative flex items-start gap-2.5 px-3 py-2 rounded-xl"
                style={{
                  background: withAlpha(pal.text, 0.035),
                  border: `1px solid ${m.scam ? withAlpha(pal.red, 0.28) : pal.glassEdge}`,
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: withAlpha(P.color, 0.14), color: P.color }}
                >
                  <P.icon style={{ width: 13, height: 13 }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold truncate" style={{ color: pal.text }}>{m.from}</span>
                    {m.scam && (
                      <span
                        className="text-[8px] font-black uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
                        style={{ background: withAlpha(pal.red, 0.16), color: pal.red, border: `1px solid ${withAlpha(pal.red, 0.4)}` }}
                      >
                        unverified
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] leading-snug truncate" style={{ color: pal.textDim }}>{m.text}</div>
                </div>
              </motion.div>
            )
          })}
          {/* bottom fade — the feed never ends */}
          <span
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: `linear-gradient(180deg, transparent, ${withAlpha(pal.bgDeep, 0.9)})` }}
            aria-hidden
          />
        </div>
      </Stage>

      {/* the truth column */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <Stage pal={pal} accent={accent} className="p-5 flex-1">
          <Micro color={pal.textSoft}>Unread · one trader · today</Micro>
          <div className="mt-1">
            <Num color={pal.text} size={44} glowColor={accent}>{count.toLocaleString()}</Num>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {[
              ["31", "rooms & groups"],
              ["14", "people selling a course"],
              ["0", "of them verified"],
            ].map(([n, l], i) => (
              <div key={l} className="flex items-baseline justify-between pb-2" style={{ borderBottom: `1px solid ${pal.glassEdge}` }}>
                <span className="text-[12px]" style={{ color: pal.textDim }}>{l}</span>
                <Num color={i === 2 ? pal.red : pal.text} size={20} glowColor={i === 2 ? pal.red : undefined}>{n}</Num>
              </div>
            ))}
          </div>
        </Stage>
        <Stage pal={pal} accent={accent} className="p-5">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: withAlpha(pal.red, 0.14), color: pal.red }}>
              <ShieldAlert style={{ width: 16, height: 16 }} />
            </span>
            <div>
              <div className="text-[13px] font-bold" style={{ color: pal.text }}>Nobody is accountable.</div>
              <div className="text-[12px] leading-snug" style={{ color: pal.textSoft }}>No structure. No filter. No record of who was right.</div>
            </div>
          </div>
        </Stage>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SCATTER — ten tools, none of them connected to the trader
   ═══════════════════════════════════════════════════════════════════════ */

const TOOLS: { icon: LucideIcon; name: string; color: string }[] = [
  { icon: CandlestickChart, name: "TradingView", color: "#39B5FF" },
  { icon: Hash, name: "Discord", color: "#7289FF" },
  { icon: Send, name: "Telegram", color: "#3FB6F0" },
  { icon: AtSign, name: "X", color: "#E6EDF3" },
  { icon: Building2, name: "Broker", color: "#FF8C42" },
  { icon: StickyNote, name: "Notion", color: "#F2F2F2" },
  { icon: Table, name: "Excel", color: "#3DE08A" },
  { icon: Bot, name: "ChatGPT", color: "#8C7BFF" },
  { icon: Play, name: "YouTube", color: "#FF4D5E" },
  { icon: Calendar, name: "Calendar", color: "#FFB23D" },
]

export function ScatterScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const W = 640
  const H = 420
  const cx = W / 2
  const cy = H / 2
  const rx = 268
  const ry = 168

  return (
    <div className="flex flex-col gap-4">
      <Stage pal={pal} accent={accent} className="w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" aria-hidden>
          {TOOLS.map((t, i) => {
            const a = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2
            const x = cx + Math.cos(a) * rx
            const y = cy + Math.sin(a) * ry
            // line stops at 58% — the connection never arrives
            const bx = cx + (x - cx) * 0.42
            const by = cy + (y - cy) * 0.42
            return (
              <g key={t.name}>
                <motion.line
                  x1={x} y1={y} x2={bx} y2={by}
                  stroke={withAlpha(t.color, 0.45)}
                  strokeWidth={1.4}
                  strokeDasharray="4 5"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: DECK_EASE }}
                />
                <motion.g
                  initial={reduce ? false : { opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.3 }}
                  style={{ transformOrigin: `${bx}px ${by}px` }}
                >
                  <circle cx={bx} cy={by} r={7} fill={withAlpha(pal.bgDeep, 0.9)} stroke={withAlpha(pal.red, 0.7)} strokeWidth={1.2} />
                  <path d={`M${bx - 3} ${by - 3} L${bx + 3} ${by + 3} M${bx + 3} ${by - 3} L${bx - 3} ${by + 3}`} stroke={pal.red} strokeWidth={1.4} strokeLinecap="round" />
                </motion.g>
              </g>
            )
          })}
        </svg>

        {/* tool tiles */}
        {TOOLS.map((t, i) => {
          const a = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2
          const x = 50 + (Math.cos(a) * rx / W) * 100
          const y = 50 + (Math.sin(a) * ry / H) * 100
          return (
            <motion.div
              key={t.name}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${x}%`, top: `${y}%`, translate: "-50% -50%" }}
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, seeded(i) * 6 - 3, 0] }}
              transition={{ opacity: { delay: 0.1 + i * 0.06 }, scale: { delay: 0.1 + i * 0.06, duration: 0.45, ease: DECK_EASE }, y: { duration: 4 + seeded(i, 5) * 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
            >
              <span
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: withAlpha(pal.bg3, 0.9), border: `1px solid ${withAlpha(t.color, 0.35)}`, boxShadow: `0 8px 24px rgba(0,0,0,.35), inset 0 1px 0 ${withAlpha(t.color, 0.25)}` }}
              >
                <t.icon style={{ width: 17, height: 17, color: t.color }} />
              </span>
              <span className="text-[9.5px] font-bold" style={{ color: pal.textDim }}>{t.name}</span>
            </motion.div>
          )
        })}

        {/* the trader — invisible to all of them */}
        <motion.div
          className="absolute flex flex-col items-center text-center"
          style={{ left: "50%", top: "50%", translate: "-50% -42px", width: 84 }}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: DECK_EASE }}
        >
          <span
            className="w-[84px] h-[84px] rounded-full flex flex-col items-center justify-center gap-0.5 shrink-0"
            style={{ background: `radial-gradient(circle, ${withAlpha(pal.bgDeep, 0.95)}, ${withAlpha(pal.bgDeep, 0.8)})`, border: `1.5px dashed ${withAlpha(pal.text, 0.32)}`, boxShadow: `0 0 0 10px ${withAlpha(pal.bgDeep, 0.85)}` }}
          >
            <HelpCircle style={{ width: 16, height: 16, color: pal.textSoft }} />
            <span className="text-[11px] font-black tracking-[0.18em]" style={{ color: pal.text }}>YOU</span>
          </span>
          <span
            className="mt-2 px-2 py-1 rounded-md text-[10px] leading-tight whitespace-nowrap"
            style={{ color: pal.textSoft, background: withAlpha(pal.bgDeep, 0.92), border: `1px solid ${pal.glassEdge}` }}
          >
            your rules · your history · your risk — invisible to all of them
          </span>
        </motion.div>
      </Stage>

      {/* the three costs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          "The rule lived in another tab.",
          "The call happened while you were away.",
          "The lesson was never written down.",
        ].map((c, i) => (
          <motion.div
            key={c}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 + i * 0.12, duration: 0.5, ease: DECK_EASE }}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{ background: withAlpha(pal.red, 0.06), border: `1px solid ${withAlpha(pal.red, 0.22)}` }}
          >
            <AlertTriangle style={{ width: 14, height: 14, color: pal.red, flexShrink: 0 }} />
            <span className="text-[12.5px] font-semibold" style={{ color: pal.textDim }}>{c}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CLONES — one real mentor, twenty impostors, no way to tell
   ═══════════════════════════════════════════════════════════════════════ */

const CLONE_NAMES = [
  "@marcusreed_official", "@marcus_reed_vip", "Marcus Reed Signals", "MR Gold Room",
  "@marcusreed2", "Marcus Reed | Mentorship", "@realmarcusreed", "MR Private Calls",
  "@marcus.reed.fx", "Marcus Reed VIP 2", "@marcusreedtrades", "MR Inner Circle",
  "@marcus_reed_official", "Marcus Reed Academy", "@mreed_signals", "MR Elite",
  "@marcusreed_support", "Marcus Reed Copytrade", "@marcusreedvip", "MR Prop Passers",
]

export function ClonesScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [stamped, setStamped] = useState(0)

  useEffect(() => {
    if (reduce) { setStamped(CLONE_NAMES.length); return }
    let i = 0
    const t = setInterval(() => {
      i += 1
      setStamped(i)
      if (i >= CLONE_NAMES.length) clearInterval(t)
    }, 140)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <div className="flex flex-col gap-4">
      <Stage pal={pal} accent={accent} className="p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px_minmax(0,1fr)] gap-4 items-center">
          {/* left clones */}
          <CloneColumn pal={pal} names={CLONE_NAMES.slice(0, 10)} stamped={stamped} offset={0} reduce={!!reduce} />

          {/* the real one */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: DECK_EASE }}
            className="relative rounded-2xl p-4 text-center"
            style={{ background: withAlpha(pal.bg3, 0.85), border: `1px solid ${pal.glassEdgeHi}`, boxShadow: pal.shadowLg }}
          >
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: pal.edgeTop }} aria-hidden />
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${withAlpha(accent, 0.5)}, ${withAlpha(pal.tertiary, 0.4)})`, border: `1px solid ${pal.glassEdgeHi}` }}
            >
              <span className="text-[15px] font-black" style={{ color: pal.text }}>MR</span>
            </div>
            <div className="mt-2.5 text-[14px] font-black" style={{ color: pal.text }}>Marcus Reed</div>
            <div className="text-[11px]" style={{ color: pal.textSoft }}>Mentor · 11 years · 2,400 students</div>
            <div
              className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-[0.14em]"
              style={{ background: withAlpha(pal.amber, 0.12), color: pal.amber, border: `1px solid ${withAlpha(pal.amber, 0.35)}` }}
            >
              <HelpCircle style={{ width: 11, height: 11 }} /> no verification exists
            </div>
          </motion.div>

          {/* right clones */}
          <CloneColumn pal={pal} names={CLONE_NAMES.slice(10)} stamped={stamped} offset={10} reduce={!!reduce} />
        </div>
      </Stage>

      <div className="grid grid-cols-3 gap-3">
        {[
          ["1", "real mentor", pal.text],
          [String(Math.min(stamped, CLONE_NAMES.length)), "impostors wearing his name", pal.red],
          ["0", "ways for a student to tell", pal.red],
        ].map(([n, l, c]) => (
          <div key={l} className="px-4 py-3 rounded-xl flex items-baseline gap-3" style={{ background: withAlpha(pal.text, 0.03), border: `1px solid ${pal.glassEdge}` }}>
            <Num color={c} size={26} glowColor={c === pal.red ? pal.red : undefined}>{n}</Num>
            <span className="text-[12px]" style={{ color: pal.textDim }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CloneColumn({
  pal, names, stamped, offset, reduce,
}: { pal: SceneProps["pal"]; names: string[]; stamped: number; offset: number; reduce: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {names.map((n, i) => {
        const idx = offset + i
        const isStamped = idx < stamped
        return (
          <motion.div
            key={n}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.04, duration: 0.4 }}
            className="relative overflow-hidden flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
            style={{ background: withAlpha(pal.text, 0.03), border: `1px solid ${isStamped ? withAlpha(pal.red, 0.35) : pal.glassEdge}` }}
          >
            <span className="w-4 h-4 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${withAlpha(pal.spectrum[idx % 6], 0.6)}, ${withAlpha(pal.bg3, 0.9)})` }} />
            <span className="text-[9.5px] font-semibold truncate" style={{ color: isStamped ? pal.textSoft : pal.textDim, textDecoration: isStamped ? "line-through" : "none" }}>{n}</span>
            <AnimatePresence>
              {isStamped && (
                <motion.span
                  initial={{ opacity: 0, scale: 1.6, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: -8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[7px] font-black uppercase tracking-[0.14em] px-1 rounded"
                  style={{ color: pal.red, border: `1px solid ${withAlpha(pal.red, 0.7)}`, background: withAlpha(pal.bgDeep, 0.8) }}
                >
                  fake
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   LIVE CALL — you joined at 09:58; the call started at 09:30
   ═══════════════════════════════════════════════════════════════════════ */

const CALLS: { t: string; pct: number; text: string; kind: "call" | "rule" | "close" }[] = [
  { t: "09:42", pct: 20, text: "EURUSD short below 1.0850", kind: "call" },
  { t: "09:51", pct: 35, text: "Stop moved to 1.0866", kind: "call" },
  { t: "09:55", pct: 42, text: "Rule: no adds after 10:00", kind: "rule" },
  { t: "10:04", pct: 57, text: "Closed half · +1.2R", kind: "close" },
  { t: "10:19", pct: 82, text: "GBPUSD watch above 1.2710", kind: "call" },
]
const JOIN_PCT = 47 // 09:58

export function LiveCallScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [caught, setCaught] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCaught(true), reduce ? 200 : 2600)
    return () => clearTimeout(t)
  }, [reduce])

  const missed = CALLS.filter((c) => c.pct < JOIN_PCT)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* timeline */}
      <Stage pal={pal} accent={accent} className="lg:col-span-7 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: pal.red, animation: reduce ? "none" : "ping 1.6s cubic-bezier(0,0,.2,1) infinite" }} />
              <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: pal.red }} />
            </span>
            <Micro color={pal.text}>Live · Marcus Reed · London open</Micro>
          </div>
          <Micro color={pal.textSoft}>Discord voice · no recording</Micro>
        </div>

        <div className="relative mt-8 mb-16 h-1 rounded-full" style={{ background: withAlpha(pal.text, 0.08) }}>
          {/* lost zone */}
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${JOIN_PCT}%`,
              background: `repeating-linear-gradient(135deg, ${withAlpha(pal.red, 0.55)} 0 4px, transparent 4px 8px)`,
              transformOrigin: "left center",
            }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: DECK_EASE }}
          />
          {/* live zone */}
          <span className="absolute inset-y-0 rounded-full" style={{ left: `${JOIN_PCT}%`, right: 0, background: withAlpha(accent, 0.6) }} />

          {/* ticks */}
          {["09:30", "09:45", "10:00", "10:15", "10:30"].map((t, i) => (
            <span key={t} className="absolute top-3 -translate-x-1/2 text-[9px] font-mono" style={{ left: `${i * 25}%`, color: pal.textGhost }}>{t}</span>
          ))}

          {/* events */}
          {CALLS.map((c, i) => {
            const lost = c.pct < JOIN_PCT
            const color = c.kind === "close" ? pal.green : c.kind === "rule" ? pal.amber : lost ? pal.red : accent
            return (
              <motion.div
                key={c.t}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${c.pct}%`, top: -8 }}
                initial={reduce ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
              >
                <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: withAlpha(pal.bgDeep, 0.95), border: `1.5px solid ${color}`, boxShadow: lost ? "none" : glow(color, 0.5) }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                </span>
                <span className="mt-7 text-[9px] font-mono" style={{ color: lost ? withAlpha(pal.red, 0.8) : pal.textSoft }}>{c.t}</span>
              </motion.div>
            )
          })}

          {/* YOU JOINED */}
          <motion.div
            className="absolute -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${JOIN_PCT}%`, top: -34 }}
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5, ease: DECK_EASE }}
          >
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.16em] whitespace-nowrap" style={{ background: pal.text, color: pal.bgDeep }}>you joined · 09:58</span>
            <span className="w-px h-6" style={{ background: pal.text }} />
          </motion.div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock style={{ width: 13, height: 13, color: pal.red }} />
            <span className="text-[12px] font-semibold" style={{ color: pal.textDim }}>
              28 minutes · {missed.length} calls · gone. No recording, no timeline, no memory.
            </span>
          </div>
          <Pill color={pal.red}>Today: lost forever</Pill>
        </div>
      </Stage>

      {/* Catch me up */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={() => setCaught((v) => !v)}
          className="relative w-full rounded-2xl px-5 py-4 flex items-center justify-between text-left"
          style={{
            background: caught ? accent : withAlpha(accent, 0.12),
            border: `1px solid ${withAlpha(accent, caught ? 0 : 0.45)}`,
            boxShadow: caught ? glow(accent, 1) : "none",
          }}
          animate={reduce || caught ? undefined : { boxShadow: [glow(accent, 0.2), glow(accent, 0.8), glow(accent, 0.2)] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          aria-pressed={caught}
        >
          <span className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: caught ? withAlpha("#06100E", 0.14) : withAlpha(accent, 0.18) }}>
              <Sparkles style={{ width: 16, height: 16, color: caught ? "#06100E" : accent }} />
            </span>
            <span>
              <span className="block text-[14px] font-black tracking-tight" style={{ color: caught ? "#06100E" : pal.text }}>Catch me up</span>
              <span className="block text-[11px]" style={{ color: caught ? withAlpha("#06100E", 0.7) : pal.textSoft }}>the last 28 minutes, in 10 seconds</span>
            </span>
          </span>
          <ArrowRight style={{ width: 16, height: 16, color: caught ? "#06100E" : accent }} />
        </motion.button>

        <AnimatePresence mode="wait">
          {caught ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: DECK_EASE }}
            >
              <Stage pal={pal} accent={accent} className="p-4">
                <div className="flex items-center justify-between">
                  <Micro color={accent}>While you were away</Micro>
                  <Micro color={pal.textSoft}>09:30 → 09:58</Micro>
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {missed.map((c, i) => (
                    <motion.li
                      key={c.t}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[10px] font-mono w-10 shrink-0" style={{ color: pal.textSoft }}>{c.t}</span>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.kind === "rule" ? pal.amber : accent }} />
                      <span className="text-[12.5px] font-semibold" style={{ color: pal.text }}>{c.text}</span>
                    </motion.li>
                  ))}
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono w-10 shrink-0" style={{ color: pal.textSoft }}>now</span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pal.green }} />
                    <span className="text-[12.5px] font-semibold" style={{ color: pal.text }}>Short is live · +0.6R · stop at 1.0866</span>
                  </motion.li>
                </ul>
                <div className="mt-4 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${pal.glassEdge}` }}>
                  <Brain style={{ width: 13, height: 13, color: accent }} />
                  <span className="text-[11px] font-semibold" style={{ color: pal.textDim }}>Archio was in the room. It followed the meeting.</span>
                </div>
              </Stage>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Stage pal={pal} accent={accent} className="p-4">
                <div className="flex items-center gap-3">
                  <Radio style={{ width: 15, height: 15, color: pal.textSoft }} />
                  <span className="text-[12px]" style={{ color: pal.textSoft }}>This button does not exist in Discord, Zoom, Telegram or WhatsApp.</span>
                </div>
              </Stage>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-1 flex items-center gap-2">
          <Zap style={{ width: 12, height: 12, color: accent }} />
          <span className="text-[11.5px] font-semibold" style={{ color: pal.textDim }}>It exists in Archio. Slide 08 shows it live.</span>
        </div>
      </div>
    </div>
  )
}
