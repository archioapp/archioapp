"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT IV · THE ECONOMY — rev5, the full redesign
   precedent · lanes · flywheel · city
   ───────────────────────────────────────────────────────────────────────
   precedent  five bundlers + a TO-SCALE bar: retail trading is the largest
              profession that was never bundled ($360B/yr scattered spend)
   lanes      THREE lanes, each a full STOREFRONT when clicked:
              products with prices · how it works · replaces · the split ·
              one month · powered by
   flywheel   money moves in a circle — Archio takes a % at every hop.
              why three lanes are one business
   city       roles as JOBS: starts · every day · earns · stack · today
   ═══════════════════════════════════════════════════════════════════════ */

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Palette, Terminal, ShoppingBag, Gamepad2, MessageCircle, Users, GraduationCap, Bot, Wrench, Share2,
  LineChart, Megaphone, Building2, ArrowRight, Sparkles, Check, Copy, LayoutPanelTop, ShieldCheck,
  Radio, BookOpen, Percent, Rss, Fingerprint, type LucideIcon,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"

/* ═══════════════════════════════════════════════════════════════════════
   PRECEDENT — it has been done, five times. Never here.
   ═══════════════════════════════════════════════════════════════════════ */

const PRECEDENTS: { icon: LucideIcon; name: string; bundled: string; scale: string; who: string; people: string }[] = [
  { icon: Palette, name: "Adobe", bundled: "Photoshop · Illustrator · Premiere → one subscription", scale: "≈ $20B / yr", who: "creatives", people: "~30M" },
  { icon: Terminal, name: "Bloomberg", bundled: "News · data · chat · execution → one terminal", scale: "≈ $10B / yr", who: "finance pros", people: "~325k" },
  { icon: ShoppingBag, name: "Shopify", bundled: "Store · payments · shipping · apps → one platform", scale: "≈ $8B / yr", who: "merchants", people: "~5M" },
  { icon: Gamepad2, name: "Steam", bundled: "Store · library · friends · mods → one launcher", scale: "≈ $10B / yr", who: "gamers", people: "~130M" },
  { icon: MessageCircle, name: "WeChat", bundled: "Chat · payments · business → one app", scale: "≈ 1.3B users", who: "everyone in China", people: "~1.3B" },
]

/* to-scale bar: annual spend the bundle captures, in $B (rounded, public) */
const SIZE = [
  { name: "Bloomberg", v: 10, note: "325k seats × $25k" },
  { name: "Shopify", v: 8, note: "5M merchants" },
  { name: "Steam", v: 10, note: "130M gamers" },
  { name: "Adobe", v: 20, note: "30M creatives" },
  { name: "TradingView", v: 0.3, note: "100M traders · the chart only" },
]
const TRADERS = { name: "Retail traders", v: 360, note: "100M × $300 / mo · scattered across 7 bills · $0 bundled" }

export function PrecedentScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const max = TRADERS.v
  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-3">
      {/* five bundlers + the empty one */}
      <div className="grid grid-cols-6 gap-2">
        {PRECEDENTS.map((p, i) => (
          <motion.div key={p.name} className="rounded-xl p-2.5 flex flex-col gap-1.5" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: DECK_EASE }}>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(pal.textDim, 0.12) }}><p.icon style={{ width: 13, height: 13, color: pal.text }} /></span>
              <span className="text-[12.5px] font-black" style={{ color: pal.text }}>{p.name}</span>
            </div>
            <span className="text-[9.5px] leading-snug" style={{ color: pal.textDim }}>{p.bundled}</span>
            <span className="mt-auto flex items-center justify-between gap-1">
              <Num color={pal.green} size={11}>{p.scale}</Num>
              <span className="text-[8.5px] uppercase tracking-[0.1em] font-bold" style={{ color: pal.textGhost }}>{p.people} {p.who}</span>
            </span>
          </motion.div>
        ))}
        <motion.div className="rounded-xl p-2.5 flex flex-col gap-1.5 relative" style={{ border: `1px dashed ${withAlpha(accent, 0.6)}`, background: withAlpha(accent, 0.05) }} initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.6, ease: DECK_EASE }}>
          <motion.span className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: glow(accent, 0.35) }} animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} aria-hidden />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(accent, 0.16) }}><Users style={{ width: 13, height: 13, color: accent }} /></span>
            <span className="text-[12.5px] font-black" style={{ color: accent }}>Retail traders</span>
          </div>
          <span className="text-[9.5px] leading-snug" style={{ color: pal.textDim }}>Chart · mentor · signals · journal · proof · money — seven rooms, no door between them.</span>
          <span className="mt-auto flex items-center justify-between gap-1">
            <Num color={accent} size={11} glowColor={accent}>never bundled</Num>
            <span className="text-[8.5px] uppercase tracking-[0.1em] font-bold" style={{ color: accent }}>~100M traders</span>
          </span>
        </motion.div>
      </div>

      {/* the size bar — to scale */}
      <div className="rounded-xl p-3 flex flex-col gap-1.5" style={{ background: withAlpha(pal.bgDeep, 0.5), border: `1px solid ${pal.glassEdge}` }}>
        <div className="flex items-center justify-between">
          <Micro color={pal.textGhost}>What each bundle captures per year · to scale · $B</Micro>
          <Micro color={accent}>The one that was never captured</Micro>
        </div>
        {[...SIZE, TRADERS].map((s, i) => {
          const traders = s.name === "Retail traders"
          const w = Math.max(1.2, (s.v / max) * 100)
          return (
            <div key={s.name} className="grid grid-cols-[92px_1fr_auto] items-center gap-2">
              <span className="text-[10.5px] font-bold truncate" style={{ color: traders ? accent : pal.text }}>{s.name}</span>
              <div className="relative h-[14px] rounded-sm overflow-hidden" style={{ background: withAlpha(pal.text, 0.05) }}>
                <motion.div
                  className="h-full rounded-sm"
                  style={{ background: traders ? `linear-gradient(90deg, ${withAlpha(accent, 0.5)}, ${accent})` : withAlpha(pal.textDim, 0.45), boxShadow: traders ? glow(accent, 0.5) : "none", transformOrigin: "left" }}
                  initial={reduce ? { width: `${w}%` } : { width: 0 }}
                  animate={{ width: `${w}%` }}
                  transition={{ delay: 1 + i * 0.12, duration: traders ? 1.4 : 0.7, ease: DECK_EASE }}
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8.5px]" style={{ color: traders ? "#06100E" : pal.textDim, fontWeight: traders ? 800 : 500 }}>{s.note}</span>
              </div>
              <Num color={traders ? accent : pal.textDim} size={11} glowColor={traders ? accent : undefined}>{traders ? "$360B scattered · $0 bundled" : `≈ $${s.v}B`}</Num>
            </div>
          )
        })}
      </div>

      <motion.div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 rounded-lg px-4 py-2" style={{ background: withAlpha(accent, 0.08), border: `1px solid ${withAlpha(accent, 0.3)}` }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.5 }}>
        {["Gather the scattered profession", "Own the window", "Own the money flow"].map((t, i) => (
          <span key={t} className="contents">
            <span className="text-[12px] font-black text-center" style={{ color: i === 2 ? accent : pal.text }}>{t}</span>
            {i < 2 && <ArrowRight style={{ width: 14, height: 14, color: withAlpha(accent, 0.7) }} />}
          </span>
        ))}
      </motion.div>
      <span className="text-[9px] text-center" style={{ color: pal.textGhost }}>Public figures, rounded, say &ldquo;roughly&rdquo;. The $360B is 100M traders × $3,600 a year — the Act I bill — and is an assumption.</span>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   LANES — three storefronts
   ═══════════════════════════════════════════════════════════════════════ */

type Product = { icon: LucideIcon; name: string; price: string; buyer: string; line: string; hero?: boolean }
type Lane = {
  icon: LucideIcon; name: string; sub: string; tag?: string
  what: string
  products: Product[]
  steps: [string, string, string]
  replaces: string[]
  split: { creator: string; archio: string; why: string }
  ledger: { line: string; v: string; tone?: "a" | "e" }[]
  powered: string
}

const LANES: Lane[] = [
  {
    icon: GraduationCap, name: "Teach & mentor", sub: "The room · the course · the week",
    what: "Everything a mentor sells today across Skool, Whop, Discord and Zoom — the room, the course, the live sessions, the weekly gameplan — sold from one storefront that sits next to the chart and remembers every call.",
    products: [
      { icon: Radio, name: "The room", price: "$49–$299 / mo", buyer: "students", line: "Live sessions on the chart · timeline · Catch Me Up · circles", hero: true },
      { icon: BookOpen, name: "The course", price: "$199–$999", buyer: "students", line: "Lessons tied to real sessions and real calls, not slides" },
      { icon: Sparkles, name: "The gameplan", price: "in the room", buyer: "students", line: "Mon–Fri plan: news, bias, levels, rules — checked before every ticket" },
      { icon: ShieldCheck, name: "Signals with a record", price: "$29–$99 / mo", buyer: "followers", line: "Every call stamped and resolved — no screenshots" },
    ],
    steps: ["KYC → record verified → one official room", "Teach on the chart · every call lands on the timeline", "Students pay on the rail · the record grows · more students find him"],
    replaces: ["Skool", "Whop", "Discord", "Zoom", "Telegram VIP"],
    split: { creator: "85%", archio: "15%", why: "of every subscription and every course" },
    ledger: [{ line: "640 members × $79 room", v: "$50,560" }, { line: "+ 38 courses × $399", v: "$15,162" }, { line: "Mentor keeps 85%", v: "$55,864", tone: "e" }, { line: "Archio 15%", v: "$9,858", tone: "a" }],
    powered: "02 Community · 08 AI Verified Track Record · 03 Decision Desk",
  },
  {
    icon: Wrench, name: "Build & sell", sub: "Install the way you think. Install the way you work.", tag: "new · only here",
    what: "A mentor or a good trader does not only teach. He packages himself. His CLONE is the way he thinks — an AI trained on his calls, rules and sessions that answers at 3 AM. His DESK is the way he works — his Flight Deck layout, modules, alerts. His AGENTS run his method on the student's own record. All installable. All sold here.",
    products: [
      { icon: Copy, name: "Your clone", price: "$19–$49 / mo", buyer: "his students", line: "The way you THINK — trained on your calls, rules, sessions. Answers in your voice while you sleep", hero: true },
      { icon: LayoutPanelTop, name: "Your desk", price: "$9–$49", buyer: "any trader", line: "The way you WORK — your Flight Deck layout: modules, order, alerts, one-click install" },
      { icon: Bot, name: "Your agents", price: "$19–$99 / mo", buyer: "any trader", line: "Your method as staff: an analyst on your setups, a risk warden on your rules, a coach on your reviews" },
      { icon: LineChart, name: "Your indicators", price: "$9–$29", buyer: "any trader", line: "Scripts and studies — the old marketplace, now tied to a verified creator" },
    ],
    steps: ["Pick sources: calls · rules · sessions · layout", "Train, test, set what it may and may not do", "Publish · students install · it runs on THEIR record"],
    replaces: ["MQL5 market", "TradingView scripts", "Gumroad", "indicator sellers", "nothing (the clone)"],
    split: { creator: "70–85%", archio: "15–30%", why: "15% on desks and indicators · 30% on clones and agents (we run the model and the memory)" },
    ledger: [{ line: "Clone · 1,900 subs × $29", v: "$55,100" }, { line: "Desk · 820 installs × $29", v: "$23,780" }, { line: "Creator keeps", v: "$58,783", tone: "e" }, { line: "Archio takes", v: "$20,097", tone: "a" }],
    powered: "05 AI Agent Marketplace · 01 Flight Deck (where it installs) · 04 Trading DNA (the record it runs on)",
  },
  {
    icon: Share2, name: "Refer & earn", sub: "A lifetime cut of everyone you bring",
    what: "Every mentor, student and creator can bring the next trader. They earn a share of that trader's subscription for as long as it renews — and a share of what that trader spends in the marketplace. Tied to a KYC'd identity, so there is no fraud and no fake traffic.",
    products: [
      { icon: Percent, name: "Subscription share", price: "20% · lifetime", buyer: "anyone", line: "Of the $99 every month the referred trader renews", hero: true },
      { icon: Percent, name: "Marketplace share", price: "5% · lifetime", buyer: "anyone", line: "Of every room, clone, desk the referred trader buys" },
      { icon: Users, name: "Mentor → mentor", price: "10% · 12 mo", buyer: "mentors", line: "Bring another mentor's room onto the rail" },
      { icon: Fingerprint, name: "Verified only", price: "KYC", buyer: "—", line: "No identity, no payout — kills the fake-referral game" },
    ],
    steps: ["Share your record, your room or your desk", "The trader signs up under your identity", "Paid every month they stay — on the rail, automatically"],
    replaces: ["Broker IB links", "one-off CPA deals", "Whop affiliate", "nothing recurring"],
    split: { creator: "20%", archio: "80% + the user", why: "we pay it out of the $99 and the take — acquisition we never had to buy" },
    ledger: [{ line: "310 referred × $99", v: "$30,690" }, { line: "+ their marketplace spend × 5%", v: "$1,240" }, { line: "Affiliate · for life", v: "$7,378 / mo", tone: "e" }, { line: "Archio keeps", v: "$24,552", tone: "a" }],
    powered: "08 AI Verified Track Record (identity) · 09 Social Network (where referrals happen)",
  },
]

export function LanesScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [sel, setSel] = useState(0)
  const l = LANES[sel]
  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2.5">
        {LANES.map((lane, i) => {
          const on = i === sel
          return (
            <motion.button
              key={lane.name}
              type="button"
              onClick={() => setSel(i)}
              aria-pressed={on}
              className="relative rounded-xl px-3 py-2.5 flex items-center gap-2.5 text-left outline-none"
              style={{ background: on ? withAlpha(accent, 0.16) : pal.glassHi, border: `1px solid ${on ? withAlpha(accent, 0.7) : pal.glassEdge}`, boxShadow: on ? glow(accent, 0.3) : "none" }}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.45, ease: DECK_EASE }}
            >
              <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(accent, on ? 0.22 : 0.1) }}>
                <lane.icon style={{ width: 16, height: 16, color: accent }} />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-[13px] font-black truncate" style={{ color: pal.text }}>{lane.name}</span>
                <span className="text-[10px] truncate" style={{ color: pal.textGhost }}>{lane.sub}</span>
              </span>
              <Num color={on ? accent : pal.textGhost} size={10} >{`0${i + 1}`}</Num>
              {lane.tag && <span className="absolute -top-2 right-2 text-[8px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded" style={{ color: "#06100E", background: pal.green }}>{lane.tag}</span>}
              {on && <motion.span layoutId="lane-caret" className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style={{ background: withAlpha(accent, 0.16), borderRight: `1px solid ${withAlpha(accent, 0.7)}`, borderBottom: `1px solid ${withAlpha(accent, 0.7)}` }} aria-hidden />}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={l.name}
          className="rounded-2xl p-3.5 flex flex-col gap-3"
          style={{ background: withAlpha(accent, 0.06), border: `1px solid ${withAlpha(accent, 0.3)}` }}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {/* what it is */}
          <p className="text-[12px] leading-relaxed" style={{ color: pal.text }}>{l.what}</p>

          <div className="grid grid-cols-[1.35fr_1fr] gap-3">
            {/* the products */}
            <div className="flex flex-col gap-1.5">
              <Micro color={accent}>The products · who buys · price</Micro>
              <div className="grid grid-cols-2 gap-1.5">
                {l.products.map((p, i) => (
                  <motion.div key={p.name} className="rounded-lg p-2 flex flex-col gap-1" style={{ background: p.hero ? withAlpha(accent, 0.12) : pal.glassHi, border: `1px solid ${p.hero ? withAlpha(accent, 0.5) : pal.glassEdge}` }} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}>
                    <div className="flex items-center gap-1.5">
                      <p.icon style={{ width: 12, height: 12, color: accent, flexShrink: 0 }} />
                      <span className="text-[11.5px] font-black truncate" style={{ color: pal.text }}>{p.name}</span>
                      <Num color={pal.green} size={10} >{p.price}</Num>
                    </div>
                    <span className="text-[9.5px] leading-snug" style={{ color: pal.textDim }}>{p.line}</span>
                    <span className="text-[8.5px] uppercase tracking-[0.12em] font-bold" style={{ color: pal.textGhost }}>buys: {p.buyer}</span>
                  </motion.div>
                ))}
              </div>
              {/* how it works */}
              <div className="flex flex-col gap-1 rounded-lg px-2.5 py-1.5 mt-0.5" style={{ background: withAlpha(pal.bgDeep, 0.5), border: `1px solid ${pal.glassEdge}` }}>
                <Micro color={pal.textGhost}>How it works</Micro>
                {l.steps.map((s, i) => (
                  <div key={s} className="grid grid-cols-[22px_1fr] items-center gap-1.5">
                    <Num color={accent} size={10}>{`0${i + 1}`}</Num>
                    <span className="text-[10px] leading-snug" style={{ color: pal.text }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* split · replaces · ledger */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="rounded-lg p-2 flex flex-col" style={{ background: withAlpha(pal.green, 0.08), border: `1px solid ${withAlpha(pal.green, 0.35)}` }}>
                  <Micro color={pal.green}>Creator keeps</Micro>
                  <Num color={pal.green} size={18}>{l.split.creator}</Num>
                </div>
                <div className="rounded-lg p-2 flex flex-col" style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.45)}` }}>
                  <Micro color={accent}>Archio takes</Micro>
                  <Num color={accent} size={18} glowColor={accent}>{l.split.archio}</Num>
                </div>
              </div>
              <span className="text-[9.5px] leading-snug -mt-1" style={{ color: pal.textDim }}>{l.split.why}</span>
              <div className="flex flex-wrap items-center gap-1">
                <Micro color={pal.red}>Replaces</Micro>
                {l.replaces.map((r) => <span key={r} className="text-[9px] font-bold px-1.5 py-0.5 rounded line-through" style={{ color: pal.textGhost, background: withAlpha(pal.text, 0.05) }}>{r}</span>)}
              </div>
              <div className="rounded-lg p-2 flex flex-col gap-1" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
                <div className="flex items-center justify-between"><Micro color={pal.textGhost}>One month · one creator</Micro><span className="text-[8.5px] italic" style={{ color: pal.textGhost }}>invented, realistic</span></div>
                {l.ledger.map((r, i) => (
                  <div key={r.line} className="flex items-center justify-between gap-2" style={{ borderTop: i === 0 ? "none" : `1px dashed ${pal.glassEdge}`, paddingTop: i === 0 ? 0 : 3 }}>
                    <span className="text-[10px]" style={{ color: r.tone ? pal.text : pal.textDim, fontWeight: r.tone ? 700 : 500 }}>{r.line}</span>
                    <Num color={r.tone === "a" ? accent : r.tone === "e" ? pal.green : pal.text} size={11} glowColor={r.tone === "a" ? accent : undefined}>{r.v}</Num>
                  </div>
                ))}
              </div>
              <span className="text-[9px] leading-snug" style={{ color: pal.textGhost }}><span style={{ color: accent, fontWeight: 800 }}>Powered by</span> {l.powered}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   FLYWHEEL — money moves in a circle; Archio takes a % at every hop
   ═══════════════════════════════════════════════════════════════════════ */

const HOPS: { icon: LucideIcon; from: string; to: string; what: string; take: string; system: string }[] = [
  { icon: GraduationCap, from: "Student", to: "Mentor", what: "pays for the room · the course", take: "15%", system: "02 Community" },
  { icon: ShieldCheck, from: "Mentor", to: "The record", what: "every call stamped · resolved · audited", take: "—", system: "08 Track Record" },
  { icon: Rss, from: "The record", to: "The feed", what: "proof becomes identity · the next student finds him", take: "—", system: "09 Social Network" },
  { icon: Copy, from: "Mentor", to: "Clone · desk · agents", what: "packages the way he thinks and works", take: "15–30%", system: "05 Marketplace" },
  { icon: Bot, from: "Students", to: "Install them", what: "hire the clone · install the desk · run his agents", take: "on every month", system: "01 Flight Deck" },
  { icon: Share2, from: "Student", to: "Next student", what: "refers a friend · earns 20% for life", take: "80%", system: "09 → 02" },
]

export function FlywheelScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_1.1fr] gap-4">
        {/* the ring */}
        <div className="relative flex items-center justify-center" style={{ minHeight: 330 }}>
          <div className="relative" style={{ width: 320, height: 320 }}>
            <motion.span className="absolute inset-0 rounded-full" style={{ border: `1.5px dashed ${withAlpha(accent, 0.45)}` }} animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} aria-hidden />
            {!reduce && (
              <motion.span className="absolute w-2.5 h-2.5 rounded-full" style={{ background: accent, boxShadow: glow(accent, 1), top: -5, left: "50%", marginLeft: -5, transformOrigin: "5px 165px" }} animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} aria-hidden />
            )}
            {HOPS.map((h, i) => {
              const a = (i / HOPS.length) * Math.PI * 2 - Math.PI / 2
              const x = 160 + Math.cos(a) * 130
              const y = 160 + Math.sin(a) * 130
              return (
                <motion.div key={h.from + h.to} className="absolute flex flex-col items-center gap-1 text-center" style={{ left: x, top: y, translate: "-50% -50%", width: 96 }} initial={reduce ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.14, duration: 0.45, ease: DECK_EASE }}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: withAlpha(pal.bgDeep, 0.9), border: `1px solid ${withAlpha(accent, 0.5)}`, boxShadow: glow(accent, 0.25) }}>
                    <h.icon style={{ width: 15, height: 15, color: accent }} />
                  </span>
                  <span className="text-[9.5px] font-black leading-tight" style={{ color: pal.text }}>{h.from} → {h.to}</span>
                  {h.take !== "—" && <span className="text-[8.5px] font-black px-1.5 py-0.5 rounded" style={{ color: "#06100E", background: accent }}>Archio {h.take}</span>}
                </motion.div>
              )
            })}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-0.5 pointer-events-none">
              <span className="text-[9px] uppercase tracking-[0.24em] font-bold" style={{ color: accent }}>The record</span>
              <span className="text-[13px] font-black leading-tight" style={{ color: pal.text }}>every hop<br />runs through it</span>
            </div>
          </div>
        </div>

        {/* the hops as rows */}
        <div className="flex flex-col gap-1.5">
          <Micro color={accent}>Six hops · one circle · one rail</Micro>
          {HOPS.map((h, i) => (
            <motion.div key={h.from + h.to} className="grid grid-cols-[22px_1fr_auto] items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }} initial={reduce ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}>
              <Num color={accent} size={10}>{`0${i + 1}`}</Num>
              <span className="flex flex-col min-w-0">
                <span className="text-[11px] font-black truncate" style={{ color: pal.text }}>{h.from} → {h.to}</span>
                <span className="text-[9.5px] leading-snug" style={{ color: pal.textDim }}>{h.what} · <span style={{ color: pal.textGhost }}>{h.system}</span></span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0" style={{ color: h.take === "—" ? pal.textGhost : "#06100E", background: h.take === "—" ? withAlpha(pal.text, 0.06) : accent }}>{h.take === "—" ? "free · builds trust" : h.take}</span>
            </motion.div>
          ))}
          <div className="rounded-lg px-3 py-2 mt-0.5 flex items-center gap-2" style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
            <Sparkles style={{ width: 12, height: 12, color: accent, flexShrink: 0 }} />
            <span className="text-[11px] leading-snug" style={{ color: pal.text }}><span style={{ fontWeight: 800 }}>Why three lanes are one business:</span> the record makes the mentor worth paying, the mentor makes the clone worth installing, the student who installs it brings the next student. Nobody outside can copy it — the record lives here.</span>
          </div>
        </div>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CITY — a place where people work
   ═══════════════════════════════════════════════════════════════════════ */

type Role = { icon: LucideIcon; name: string; one: string; start: string; day: string; paid: string; stack: string; today: string; here: string }

const ROLES: Role[] = [
  { icon: GraduationCap, name: "Mentor", one: "Runs the room. Writes the week.", start: "KYC → record verified → opens one official room", day: "Sunday: writes the gameplan. Weekdays: live on the chart at his session. Calls land on the timeline. Reviews his students' records on Friday.", paid: "Room subs + courses (85%) + clone (70%) + desk installs (85%)", stack: "02 Community · 03 Decision Desk · 05 Marketplace · 08 Track Record", today: "Skool for the course · Whop for billing · Discord for the room · Zoom for live · a Telegram for signals — five logins, no memory, no proof", here: "One storefront. One record. Every call stamped. Paid on one rail." },
  { icon: Bot, name: "Clone operator", one: "Keeps the mentor's AI honest.", start: "A mentor's team member with access to his sessions", day: "Feeds new sessions to the clone · reviews its answers against the record · updates rules when the mentor changes them · flags drift", paid: "A share of clone revenue from the mentor · paid on the rail", stack: "05 Marketplace · 04 Trading DNA · 02 Community", today: "Does not exist. Nobody sells a person's method as a running agent.", here: "A new job. Thousands of mentors × one operator each." },
  { icon: Wrench, name: "Builder", one: "Ships desks and agents that run on the record.", start: "Builds one Flight Deck layout or one agent against the Archio record", day: "Watches what traders ask Archio for · ships a desk or agent that answers it · reads installs and reviews · versions weekly", paid: "85% of every install · 70% of every agent month", stack: "05 Marketplace · 01 Flight Deck · 04 Trading DNA", today: "TradingView scripts · MQL5 · GitHub · Gumroad — no distribution, no data, no recurring", here: "One store, 100M buyers, every product runs on the buyer's own record." },
  { icon: LineChart, name: "Analyst", one: "Never teaches. Just proven right.", start: "Publishes forecasts on the Decision Desk for six months", day: "Two forecasts a day, stamped before the outcome · resolves automatically · the record compounds", paid: "Paid forecast feed · hired by rooms and prop firms · an agent built on his calls", stack: "03 Decision Desk · 08 Track Record · 09 Social Network", today: "Free X threads and screenshots — no way to be paid for being right", here: "A public number nobody can fake: 61% · +0.84R · 214 calls. That IS the resume." },
  { icon: Megaphone, name: "Affiliate", one: "Brings the next trader.", start: "Shares his verified record, his room or his desk", day: "Posts to the proof feed · every follower who joins is tied to his KYC'd identity", paid: "20% of every subscription he brought, for life · 5% of their marketplace spend", stack: "09 Social Network · 08 Track Record", today: "Broker IB links · one-off CPA · fake traffic · no recurring", here: "Recurring, verified, on the rail. The fake-referral game is dead." },
  { icon: Users, name: "Community lead", one: "Runs the room while the mentor trades.", start: "Hired by a mentor from inside his own room", day: "Onboards new members · curates Catch Me Up · moderates · runs events · answers with the clone beside him", paid: "A salary from room revenue, paid on the rail", stack: "02 Community · 05 Marketplace (the clone he works with)", today: "Unpaid Discord mods. Burnout in six months.", here: "A paid job inside every room that crosses 300 members." },
  { icon: Building2, name: "Prop firm · broker", one: "Plugs into traders who follow rules.", start: "Connects the execution rail and account data", day: "Sees adherence, not just P&L · funds traders whose record shows discipline · lists on the marketplace", paid: "Lower churn · more volume · a distribution channel to 100M traders", stack: "03 Decision Desk → broker rails · 06 Portfolio · 07 Net Worth", today: "Sees the fill. Never sees the decision. Loses 90% of challengers to rules they already knew.", here: "The decision before the fill. Traders who last." },
]

const REPLACED = ["Skool", "Whop", "Discord", "Zoom", "TradingView", "MQL5", "X", "the broker"]

export function CityScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [sel, setSel] = useState(0)
  const r = ROLES[sel]
  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-3">
      <div className="grid grid-cols-[0.9fr_1.5fr] gap-3">
        <div className="flex flex-col gap-1.5">
          <Micro color={accent}>Seven jobs today · click one</Micro>
          <div className="grid grid-cols-2 gap-1.5">
            {ROLES.map((role, i) => {
              const on = i === sel
              return (
                <motion.button
                  key={role.name}
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={on}
                  className="rounded-lg px-2.5 py-2 flex items-center gap-2 text-left outline-none"
                  style={{ background: on ? withAlpha(accent, 0.16) : pal.glassHi, border: `1px solid ${on ? withAlpha(accent, 0.7) : pal.glassEdge}`, boxShadow: on ? glow(accent, 0.25) : "none" }}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: DECK_EASE }}
                >
                  <role.icon style={{ width: 13, height: 13, color: on ? accent : pal.textDim, flexShrink: 0 }} />
                  <span className="text-[11px] font-black truncate" style={{ color: pal.text }}>{role.name}</span>
                </motion.button>
              )
            })}
          </div>
          <div className="rounded-lg px-2.5 py-2 flex items-start gap-2" style={{ background: withAlpha(accent, 0.06), border: `1px dashed ${withAlpha(accent, 0.4)}` }}>
            <Sparkles style={{ width: 12, height: 12, color: accent, flexShrink: 0, marginTop: 2 }} />
            <span className="text-[10.5px] leading-snug" style={{ color: pal.textDim }}>Adobe made a job called &ldquo;creative&rdquo;. Shopify made a job called &ldquo;merchant&rdquo;. We are making seven — and the city grows every time someone builds a job on the record.</span>
          </div>
          {/* the money between roles */}
          <div className="rounded-lg px-2.5 py-2 flex flex-col gap-1" style={{ background: withAlpha(pal.bgDeep, 0.5), border: `1px solid ${pal.glassEdge}` }}>
            <Micro color={pal.textGhost}>Money between roles · one month</Micro>
            {[["Student → Mentor", "$79 room"], ["Mentor → Community lead", "$2,400 salary"], ["Mentor → Builder", "$29 desk × 640"], ["Student → Clone operator", "via the clone $29"], ["Affiliate ← Archio", "$19.80 / student / mo"]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2"><span className="text-[9.5px]" style={{ color: pal.text }}>{k}</span><Num color={pal.green} size={9.5}>{v}</Num></div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={r.name}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: withAlpha(accent, 0.06), border: `1px solid ${withAlpha(accent, 0.3)}` }}
            initial={reduce ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: withAlpha(accent, 0.16) }}><r.icon style={{ width: 16, height: 16, color: accent }} /></span>
              <div>
                <div className="text-[14px] font-black" style={{ color: pal.text }}>{r.name}</div>
                <div className="text-[10.5px] italic" style={{ color: pal.textDim }}>{r.one}</div>
              </div>
            </div>
            {[
              ["Starts", r.start, pal.text],
              ["Every day", r.day, pal.text],
              ["Gets paid", r.paid, pal.green],
              ["Stack", r.stack, accent],
            ].map(([k, v, c]) => (
              <div key={k as string} className="grid grid-cols-[76px_1fr] gap-2 items-start">
                <Micro color={k === "Gets paid" ? pal.green : k === "Stack" ? accent : pal.textGhost}>{k}</Micro>
                <span className="text-[11px] leading-snug" style={{ color: c as string, fontWeight: k === "Gets paid" ? 800 : 500 }}>{v}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-auto pt-2" style={{ borderTop: `1px dashed ${pal.glassEdge}` }}>
              <div className="rounded-lg p-2 flex flex-col gap-0.5" style={{ background: withAlpha(pal.red, 0.06), border: `1px solid ${withAlpha(pal.red, 0.3)}` }}>
                <Micro color={pal.red}>Today</Micro>
                <span className="text-[10px] leading-snug" style={{ color: pal.textDim }}>{r.today}</span>
              </div>
              <div className="rounded-lg p-2 flex flex-col gap-0.5" style={{ background: withAlpha(pal.green, 0.06), border: `1px solid ${withAlpha(pal.green, 0.3)}` }}>
                <Micro color={pal.green}>Here</Micro>
                <span className="text-[10px] leading-snug" style={{ color: pal.text }}>{r.here}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-between rounded-lg px-4 py-2" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
        {REPLACED.map((n) => (
          <span key={n} className="text-[11px] font-bold line-through" style={{ color: pal.textGhost }}>{n}</span>
        ))}
        <motion.span className="absolute left-4 right-4 top-1/2 h-px pointer-events-none" style={{ background: accent, transformOrigin: "left" }} initial={reduce ? { scaleX: 1 } : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 1.1, ease: DECK_EASE }} aria-hidden />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.16em] px-2 py-0.5 rounded" style={{ color: "#06100E", background: accent }}>
          <Check style={{ width: 9, height: 9 }} /> one window · one record · one rail · everyone gets paid
        </span>
      </div>
    </Stage>
  )
}

export const _pill = Pill
