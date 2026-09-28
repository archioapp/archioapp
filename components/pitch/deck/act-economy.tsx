"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT IV · THE ECONOMY  +  CLOSE
   money · agents · doors
   ═══════════════════════════════════════════════════════════════════════ */

import { motion, useReducedMotion } from "framer-motion"
import {
  Store, GraduationCap, Share2, Bot, Percent, ArrowRight, ArrowUpRight, Copy, Moon,
  LayoutPanelTop, Radio, Target, ShieldAlert, LineChart, Brain, type LucideIcon,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"

/* ═══════════════════════════════════════════════════════════════════════
   MONEY — three lanes, one house cut
   ═══════════════════════════════════════════════════════════════════════ */

const LANES: { icon: LucideIcon; n: string; title: string; who: string; how: string; example: string; tag?: string }[] = [
  {
    icon: GraduationCap, n: "01", title: "Teach & mentor",
    who: "Verified mentors",
    how: "A paid room, a course, a community — Skool and Whop, inside the same window as the chart. Memory and Catch Me Up keep students.",
    example: "A $99/mo room · 312 members",
    tag: "Skool + Whop, inside",
  },
  {
    icon: Copy, n: "02", title: "Clone yourself",
    who: "The same mentors",
    how: "An AI copy of the mentor — trained on his calls, his rules, his sessions. Answers students at 3 AM. He earns while he sleeps.",
    example: "Reed · 24/7 clone · 1,204 hires",
    tag: "New",
  },
  {
    icon: Store, n: "03", title: "Build & sell",
    who: "Traders and builders",
    how: "Sell dashboards, indicators and AI agents in the marketplace.",
    example: "A $29/mo risk dashboard · 400 buyers",
  },
  {
    icon: Share2, n: "04", title: "Refer & earn",
    who: "Anyone with an audience",
    how: "Bring a trader. Get paid when they pay — every month they stay.",
    example: "20% of every payment · lifetime",
  },
]

export function MoneyScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LANES.map((l, i) => (
          <motion.div
            key={l.n}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.55, ease: DECK_EASE }}
          >
            <Stage pal={pal} accent={accent} className="p-4 h-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.4)}`, boxShadow: glow(accent, 0.3) }}>
                  <l.icon style={{ width: 17, height: 17, color: accent }} />
                </span>
                {l.tag ? <Pill color={accent} solid={l.tag === "New"}>{l.tag}</Pill> : <Num color={pal.textGhost} size={12}>{l.n}</Num>}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] font-black tracking-tight" style={{ color: pal.text }}>{l.title}</span>
                <Micro color={pal.textDim}>{l.who}</Micro>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: pal.textDim }}>{l.how}</p>
              <div className="mt-auto rounded-xl px-2.5 py-1.5 flex items-center gap-2" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
                <ArrowUpRight style={{ width: 12, height: 12, color: pal.green, flexShrink: 0 }} />
                <span className="text-[11.5px] font-semibold leading-tight" style={{ color: pal.text }}>{l.example}</span>
              </div>
            </Stage>
          </motion.div>
        ))}
      </div>

      {/* the cut */}
      <motion.div
        className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.4)}`, boxShadow: glow(accent, 0.25) }}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease: DECK_EASE }}
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: withAlpha(accent, 0.2), border: `1px solid ${withAlpha(accent, 0.5)}` }}>
            <Percent style={{ width: 16, height: 16, color: accent }} />
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-black" style={{ color: pal.text }}>Archio takes a percentage of every transaction.</span>
            <span className="text-[12.5px]" style={{ color: pal.textDim }}>Free to enter. We earn only when money moves inside the space.</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill color={pal.textDim}>Trader</Pill>
          <ArrowRight style={{ width: 11, height: 11, color: pal.textGhost }} />
          <Pill color={pal.textDim}>Seller</Pill>
          <ArrowRight style={{ width: 11, height: 11, color: pal.textGhost }} />
          <Pill color={accent} solid>Archio %</Pill>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   AGENTS — the marketplace of AI agents
   ═══════════════════════════════════════════════════════════════════════ */

const AGENTS: { icon: LucideIcon; name: string; by: string; does: string; price: string; hires: string; clone?: boolean }[] = [
  { icon: Copy, name: "Marcus Reed · 24/7", by: "carbon copy of the mentor", does: "Trained on every call, rule and session he ever ran. Answers his students at 3 AM, in his voice, with his method. He earns while he sleeps.", price: "$49/mo", hires: "1,204 hires", clone: true },
  { icon: LineChart, name: "Reed Analyst", by: "by Marcus Reed", does: "Reads every chart with his method. Flags setups that match the room's rules.", price: "$39/mo", hires: "980 hires" },
  { icon: ShieldAlert, name: "Risk Warden", by: "by community", does: "Sits in front of the ticket. Blocks size above plan, stops trading after the daily limit.", price: "$19/mo", hires: "3,860 hires" },
  { icon: Brain, name: "Night Coach", by: "by Archio", does: "Reviews every losing day from your own record and writes the one lesson.", price: "$24/mo", hires: "2,117 hires" },
]

export function AgentsScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot style={{ width: 14, height: 14, color: accent }} />
          <Micro color={accent}>AI agent marketplace</Micro>
        </div>
        <Micro color={pal.textGhost}>Built by the community · hired by traders · paid like staff</Micro>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AGENTS.map((a, i) => (
          <motion.div
            key={a.name}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{
              background: a.clone ? withAlpha(accent, 0.1) : pal.glassHi,
              border: `1px solid ${a.clone ? withAlpha(accent, 0.6) : pal.glassEdge}`,
              boxShadow: a.clone ? glow(accent, 0.45) : "none",
            }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: DECK_EASE }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: withAlpha(accent, 0.16), border: `1px solid ${withAlpha(accent, 0.45)}` }}
                animate={reduce ? undefined : { boxShadow: [glow(accent, 0.2), glow(accent, 0.7), glow(accent, 0.2)] }}
                transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.6 }}
              >
                <a.icon style={{ width: 18, height: 18, color: accent }} />
              </motion.span>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-black leading-tight" style={{ color: pal.text }}>{a.name}</span>
                <Micro color={a.clone ? accent : pal.textDim}>{a.by}</Micro>
              </div>
            </div>
            {a.clone && (
              <div className="flex items-center gap-1.5">
                <Moon style={{ width: 11, height: 11, color: accent }} />
                <Micro color={accent}>Always awake · 03:14 · answering</Micro>
              </div>
            )}
            <p className="text-[12px] leading-relaxed" style={{ color: pal.textDim }}>{a.does}</p>
            <div className="mt-auto flex items-center justify-between pt-1">
              <Num color={pal.text} size={14}>{a.price}</Num>
              <Micro color={pal.green}>{a.hires}</Micro>
            </div>
            <div className="rounded-lg py-2 text-center text-[10.5px] font-black uppercase tracking-[0.16em]" style={{ background: withAlpha(accent, 0.14), color: accent, border: `1px solid ${withAlpha(accent, 0.4)}` }}>
              Hire
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6" style={{ background: withAlpha(pal.bgDeep, 0.55), border: `1px solid ${pal.glassEdge}` }}>
        <span className="text-[12.5px] font-semibold" style={{ color: pal.text }}>Every agent runs on the trader&apos;s own memory.</span>
        <span className="text-[12px]" style={{ color: pal.textDim }}>That is why it cannot be copied outside Archio: the data it needs lives here.</span>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   DOORS — open the app
   ═══════════════════════════════════════════════════════════════════════ */

const DOORS: { icon: LucideIcon; title: string; line: string; href: string; key: string }[] = [
  { icon: LayoutPanelTop, title: "Flight Deck", line: "The one window", href: "/dashboard", key: "1" },
  { icon: Radio, title: "Live Room", line: "Mentor · timeline · Catch me up", href: "/live-room", key: "2" },
  { icon: Target, title: "Forecast", line: "Say it before the trade", href: "/forecast", key: "3" },
]

export function DoorsScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {DOORS.map((d, i) => (
        <motion.a
          key={d.title}
          href={d.href}
          target="_blank"
          rel="noreferrer"
          className="group rounded-3xl p-6 flex flex-col gap-5 focus:outline-none"
          style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}`, backdropFilter: "blur(16px)", boxShadow: pal.shadowLg }}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={reduce ? undefined : { y: -4, borderColor: withAlpha(accent, 0.6), boxShadow: `${pal.shadowLg}, ${glow(accent, 0.6)}` }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.55, ease: DECK_EASE }}
        >
          <div className="flex items-center justify-between">
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.4)}`, boxShadow: glow(accent, 0.35) }}>
              <d.icon style={{ width: 20, height: 20, color: accent }} />
            </span>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}`, color: pal.textDim, fontFamily: "var(--font-mono)" }}>{d.key}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-black tracking-tight" style={{ color: pal.text }}>{d.title}</span>
            <span className="text-[13px]" style={{ color: pal.textDim }}>{d.line}</span>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>Open</span>
            <ArrowRight style={{ width: 13, height: 13, color: accent }} className="transition-transform group-hover:translate-x-1" />
          </div>
        </motion.a>
      ))}
    </div>
  )
}
