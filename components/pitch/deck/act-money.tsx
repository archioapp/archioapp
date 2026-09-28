"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT I · THE BILL   +   ACT IV · THE MONEY
   bill · market · gmv · jobs
   Every number here is an explicit assumption, said out loud in `say`.
   ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  CandlestickChart, Users, Send, BookOpen, Newspaper, Bot, Trophy, Store, GraduationCap,
  Copy, LineChart, Share2, Percent, ArrowRight, Wrench, Landmark, Layers, type LucideIcon,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"

const fmt = (n: number) => n.toLocaleString("en-US")

function useCountUp(target: number, delay = 0.4, duration = 1.4, on = true) {
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce || !on ? target : 0)
  useEffect(() => {
    if (reduce || !on) return
    let raf = 0
    const t0 = performance.now() + delay * 1000
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / (duration * 1000)))
      setV(Math.round(target * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, delay, duration, reduce, on])
  return v
}

/* ═══════════════════════════════════════════════════════════════════════
   BILL — what one trader already pays, to apps that never talk
   ═══════════════════════════════════════════════════════════════════════ */

const BILL: { icon: LucideIcon; cat: string; brands: string; usd: number }[] = [
  { icon: CandlestickChart, cat: "Charts", brands: "TradingView", usd: 30 },
  { icon: Users, cat: "Community & course", brands: "Whop · Skool · Discord", usd: 80 },
  { icon: Send, cat: "Signals & mentorship", brands: "Telegram VIP", usd: 40 },
  { icon: BookOpen, cat: "Journal", brands: "Tradezella · TraderSync", usd: 30 },
  { icon: Newspaper, cat: "Data & news", brands: "Calendar · squawk", usd: 30 },
  { icon: Bot, cat: "AI", brands: "ChatGPT", usd: 20 },
  { icon: Trophy, cat: "Prop challenges", brands: "FTMO · Apex · amortized", usd: 70 },
]
const BILL_TOTAL = BILL.reduce((s, b) => s + b.usd, 0)

export function BillScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const monthly = useCountUp(BILL_TOTAL, 0.9, 1.3)
  const yearly = useCountUp(BILL_TOTAL * 12, 1.5, 1.2)

  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <Micro color={accent}>One trader · one month · today</Micro>
        <Micro color={pal.textGhost}>7 bills · 0 shared context</Micro>
      </div>

      <ol className="flex flex-col gap-1.5">
        {BILL.map((b, i) => (
          <motion.li
            key={b.cat}
            className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-lg px-2.5 py-1.5"
            style={{ background: withAlpha(pal.bgDeep, 0.5), border: `1px solid ${pal.glassEdge}` }}
            initial={reduce ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.45, ease: DECK_EASE }}
          >
            <span className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: withAlpha(accent, 0.12), border: `1px solid ${withAlpha(accent, 0.35)}` }}>
              <b.icon style={{ width: 13, height: 13, color: accent }} />
            </span>
            <span className="flex flex-col min-w-0 leading-tight">
              <span className="text-[12.5px] font-bold" style={{ color: pal.text }}>{b.cat}</span>
              <span className="text-[10.5px]" style={{ color: pal.textDim }}>{b.brands}</span>
            </span>
            <Num color={pal.text} size={13}>${b.usd}</Num>
          </motion.li>
        ))}
      </ol>

      <div className="mt-3 pt-3 flex items-end justify-between gap-3" style={{ borderTop: `1px dashed ${withAlpha(accent, 0.45)}` }}>
        <div className="flex flex-col">
          <Micro color={pal.textDim}>Per month</Micro>
          <span className="text-[26px] font-black tracking-tight leading-none" style={{ color: pal.text, fontFamily: "var(--font-mono)" }}>≈ ${fmt(monthly)}</span>
        </div>
        <div className="flex flex-col items-end">
          <Micro color={accent}>Per year</Micro>
          <span className="text-[26px] font-black tracking-tight leading-none" style={{ color: accent, fontFamily: "var(--font-mono)", textShadow: glow(accent, 0.5) }}>≈ ${fmt(yearly)}</span>
        </div>
      </div>

      <motion.p
        className="mt-3 text-[11.5px] leading-snug"
        style={{ color: pal.textDim }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
      >
        Whop and Skool sell the room. TradingView shows the chart. The broker fills the trade.
        <span style={{ color: pal.red }}> Not one of them knows what the other did.</span>
      </motion.p>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MARKET — 100M traders × $99, the subscription floor
   ═══════════════════════════════════════════════════════════════════════ */

const LADDER: { subs: string; share: string; arr: string; w: number; hero?: boolean }[] = [
  { subs: "100,000", share: "0.1%", arr: "$119M", w: 0.22 },
  { subs: "1,000,000", share: "1%", arr: "$1.19B", w: 0.5, hero: true },
  { subs: "5,000,000", share: "5%", arr: "$5.9B", w: 0.78 },
  { subs: "10,000,000", share: "10%", arr: "$11.9B", w: 1 },
]

export function MarketScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* the population + the price */}
      <Stage pal={pal} accent={accent} className="lg:col-span-5 p-5 flex flex-col gap-4">
        <div className="flex flex-col">
          <Micro color={accent}>Active retail traders · worldwide</Micro>
          <motion.span
            className="text-[56px] font-black tracking-tight leading-none"
            style={{ color: pal.text, fontFamily: "var(--font-mono)", textShadow: glow(accent, 0.35) }}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: DECK_EASE }}
          >
            100M
          </motion.span>
        </div>

        <div className="flex flex-col gap-2">
          <motion.div
            className="rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3"
            style={{ background: withAlpha(pal.red, 0.07), border: `1px solid ${withAlpha(pal.red, 0.4)}` }}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: DECK_EASE }}
          >
            <span className="flex flex-col leading-tight">
              <span className="text-[12.5px] font-bold" style={{ color: pal.text }}>What he pays today</span>
              <span className="text-[10.5px]" style={{ color: pal.textDim }}>seven apps · zero shared context</span>
            </span>
            <Num color={pal.red} size={18}>≈ $300 / mo</Num>
          </motion.div>
          <motion.div
            className="rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3"
            style={{ background: withAlpha(pal.green, 0.08), border: `1px solid ${withAlpha(pal.green, 0.5)}`, boxShadow: glow(pal.green, 0.25) }}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: DECK_EASE }}
          >
            <span className="flex flex-col leading-tight">
              <span className="text-[12.5px] font-bold" style={{ color: pal.text }}>Archio</span>
              <span className="text-[10.5px]" style={{ color: pal.textDim }}>one window · one record · the whole loop</span>
            </span>
            <Num color={pal.green} size={18}>$99 / mo</Num>
          </motion.div>
        </div>

        <p className="mt-auto text-[11.5px] leading-snug" style={{ color: pal.textDim }}>
          Cheaper than what he already pays. Connected, which nothing he pays for is.
        </p>
      </Stage>

      {/* the ladder */}
      <Stage pal={pal} accent={accent} className="lg:col-span-7 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Micro color={accent}>Subscription alone · $99 × 12</Micro>
          <Micro color={pal.textGhost}>annual recurring revenue</Micro>
        </div>
        <div className="flex flex-col gap-2.5">
          {LADDER.map((r, i) => {
            const c = r.hero ? accent : pal.textDim
            return (
              <motion.div
                key={r.subs}
                className="grid grid-cols-[112px_44px_1fr_78px] items-center gap-3"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.22 }}
              >
                <span className="flex flex-col leading-tight">
                  <Num color={r.hero ? pal.text : pal.textDim} size={13}>{r.subs}</Num>
                  <Micro color={pal.textGhost}>subscribers</Micro>
                </span>
                <Pill color={c} solid={r.hero}>{r.share}</Pill>
                <span className="relative h-[22px] rounded-md overflow-hidden" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${pal.glassEdge}` }}>
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{ background: r.hero ? `linear-gradient(90deg, ${withAlpha(accent, 0.5)}, ${accent})` : withAlpha(pal.textDim, 0.35), boxShadow: r.hero ? glow(accent, 0.7) : "none" }}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${r.w * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.22, duration: 0.9, ease: DECK_EASE }}
                  />
                </span>
                <span className="text-right font-black tracking-tight" style={{ color: r.hero ? accent : pal.text, fontFamily: "var(--font-mono)", fontSize: r.hero ? 20 : 15, textShadow: r.hero ? glow(accent, 0.5) : "none" }}>
                  {r.arr}
                </span>
              </motion.div>
            )
          })}
        </div>
        <motion.div
          className="mt-auto rounded-xl px-4 py-2.5 flex items-center gap-3"
          style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.45)}` }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <Landmark style={{ width: 14, height: 14, color: accent }} />
          <span className="text-[12.5px] font-bold" style={{ color: pal.text }}>One percent of the market is a billion-dollar subscription business.</span>
          <span className="text-[11.5px] ml-auto" style={{ color: pal.textDim }}>That is the floor.</span>
        </motion.div>
      </Stage>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   GMV — the $300 moves inside; Archio takes a percentage of it
   ═══════════════════════════════════════════════════════════════════════ */

export function GmvScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const cols: { k: string; big: string; math: string; color: string; hero?: boolean }[] = [
    { k: "Subscription", big: "$1.19B", math: "1,000,000 × $99 × 12", color: pal.green },
    { k: "Marketplace take", big: "$540M", math: "15% of $3.6B moved inside", color: accent },
    { k: "Per year · 1M users", big: "$1.73B", math: "= $144 / trader / month", color: pal.text, hero: true },
  ]
  return (
    <div className="flex flex-col gap-3">
      {/* the flow */}
      <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
        <div className="flex items-center justify-between mb-3">
          <Micro color={accent}>Where the $300 goes once mentor, store and chart share one window</Micro>
          <Micro color={pal.textGhost}>assumption · 1,000,000 users</Micro>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.4fr_auto_1fr] items-center gap-3">
          <div className="rounded-xl px-3.5 py-3 flex flex-col gap-0.5" style={{ background: withAlpha(pal.bgDeep, 0.55), border: `1px solid ${pal.glassEdge}` }}>
            <Micro color={pal.textDim}>Trader spends</Micro>
            <Num color={pal.text} size={20}>$300 / mo</Num>
            <span className="text-[10.5px]" style={{ color: pal.textDim }}>rooms · courses · signals · agents · dashboards</span>
          </div>
          <ArrowRight className="hidden lg:block" style={{ width: 16, height: 16, color: accent }} />
          <div className="rounded-xl px-3.5 py-3 flex flex-col gap-2" style={{ background: withAlpha(accent, 0.08), border: `1px solid ${withAlpha(accent, 0.45)}` }}>
            <Micro color={accent}>Inside Archio · the marketplace</Micro>
            <div className="flex flex-wrap gap-1.5">
              {[["Mentor rooms", GraduationCap], ["Courses", BookOpen], ["Mentor clones", Copy], ["Agents", Bot], ["Dashboards", Layers], ["Signals w/ record", LineChart]].map(([t, I], i) => {
                const Icon = I as LucideIcon
                return (
                  <motion.span key={t as string} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-semibold" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${pal.glassEdge}`, color: pal.text }} initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.08 }}>
                    <Icon style={{ width: 11, height: 11, color: accent }} />{t as string}
                  </motion.span>
                )
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: pal.textDim }}>1M × $300 × 12</span>
              <Num color={pal.text} size={16}>$3.6B GMV / yr</Num>
            </div>
          </div>
          <ArrowRight className="hidden lg:block" style={{ width: 16, height: 16, color: accent }} />
          <motion.div className="rounded-xl px-3.5 py-3 flex flex-col gap-0.5" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.6)}`, boxShadow: glow(accent, 0.4) }} initial={reduce ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0, duration: 0.5, ease: DECK_EASE }}>
            <div className="flex items-center gap-1.5"><Percent style={{ width: 12, height: 12, color: accent }} /><Micro color={accent}>Archio takes</Micro></div>
            <Num color={pal.text} size={20}>15%</Num>
            <span className="text-[10.5px]" style={{ color: pal.textDim }}>Whop 3% · Skool 2.9% · App Store 30%</span>
          </motion.div>
        </div>
      </Stage>

      {/* the three numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cols.map((c, i) => (
          <motion.div
            key={c.k}
            className="rounded-2xl px-5 py-4 flex flex-col gap-1"
            style={{
              background: c.hero ? withAlpha(accent, 0.12) : pal.glass,
              border: `1px solid ${c.hero ? withAlpha(accent, 0.6) : pal.glassEdge}`,
              boxShadow: c.hero ? glow(accent, 0.5) : pal.shadowLg,
              backdropFilter: "blur(14px)",
            }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.18, duration: 0.5, ease: DECK_EASE }}
          >
            <Micro color={c.hero ? accent : pal.textDim}>{c.k}</Micro>
            <span className="text-[34px] font-black tracking-tight leading-none" style={{ color: c.color, fontFamily: "var(--font-mono)", textShadow: c.hero ? glow(accent, 0.6) : "none" }}>{c.big}</span>
            <span className="text-[11.5px]" style={{ color: pal.textDim }}>{c.math}</span>
          </motion.div>
        ))}
      </div>

      <motion.div className="flex items-center justify-center gap-3 text-[12px]" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span style={{ color: pal.textDim }}>Software companies sell seats.</span>
        <span className="font-black" style={{ color: pal.text }}>We run the money flow — and the trader still pays less than today.</span>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   JOBS — a place where people work; the new standard
   ═══════════════════════════════════════════════════════════════════════ */

const ROLES: { icon: LucideIcon; role: string; earns: string; example: string }[] = [
  { icon: GraduationCap, role: "Mentor", earns: "Room subscriptions + his 24/7 clone", example: "312 members × $99 + 1,204 clone hires" },
  { icon: Wrench, role: "Builder", earns: "Every dashboard, indicator and agent shipped", example: "Risk Warden · 3,860 hires × $19" },
  { icon: LineChart, role: "Analyst", earns: "A public forecast record nobody can fake", example: "Hired by rooms · paid per seat" },
  { icon: Bot, role: "Agent operator", earns: "Runs and tunes agents for other traders", example: "Manages 40 rooms' Night Coach" },
  { icon: Share2, role: "Affiliate", earns: "20% of every payment, for life", example: "Brought 500 traders · paid monthly" },
]

const TODAY = [
  { icon: GraduationCap, name: "Skool", does: "community" },
  { icon: Store, name: "Whop", does: "the store" },
  { icon: Users, name: "Discord", does: "the calls" },
  { icon: CandlestickChart, name: "TradingView", does: "the chart" },
  { icon: Landmark, name: "Broker", does: "the fill" },
]

export function JobsScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.role}
            className="rounded-2xl p-3.5 flex flex-col gap-2"
            style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}`, backdropFilter: "blur(14px)", boxShadow: pal.shadowLg }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: DECK_EASE }}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.4)}`, boxShadow: glow(accent, 0.3) }}>
              <r.icon style={{ width: 15, height: 15, color: accent }} />
            </span>
            <span className="text-[15px] font-black tracking-tight" style={{ color: pal.text }}>{r.role}</span>
            <span className="text-[11.5px] leading-snug" style={{ color: pal.textDim }}>{r.earns}</span>
            <span className="mt-auto rounded-md px-2 py-1 text-[10.5px] font-semibold" style={{ background: withAlpha(pal.green, 0.08), border: `1px solid ${withAlpha(pal.green, 0.35)}`, color: pal.green }}>{r.example}</span>
          </motion.div>
        ))}
      </div>

      {/* today → Archio */}
      <Stage pal={pal} accent={accent} className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col gap-2">
            <Micro color={pal.red}>Today · five companies, five logins, five payouts</Micro>
            <div className="flex flex-wrap gap-1.5">
              {TODAY.map((t, i) => (
                <motion.span key={t.name} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${pal.glassEdge}` }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}>
                  <t.icon style={{ width: 11, height: 11, color: pal.textDim }} />
                  <span className="text-[11.5px] font-bold" style={{ color: pal.text }}>{t.name}</span>
                  <span className="text-[10.5px]" style={{ color: pal.textDim }}>{t.does}</span>
                </motion.span>
              ))}
            </div>
          </div>
          <ArrowRight className="hidden lg:block" style={{ width: 18, height: 18, color: accent }} />
          <motion.div className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ background: withAlpha(accent, 0.12), border: `1px solid ${withAlpha(accent, 0.55)}`, boxShadow: glow(accent, 0.45) }} initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, duration: 0.5, ease: DECK_EASE }}>
            <Micro color={accent}>Archio · the new standard</Micro>
            <span className="text-[15px] font-black tracking-tight" style={{ color: pal.text }}>One window. One record. One payment rail.</span>
            <span className="text-[11.5px]" style={{ color: pal.textDim }}>Everyone on it gets paid. That is why everyone ends up on it.</span>
          </motion.div>
        </div>
      </Stage>
    </div>
  )
}
