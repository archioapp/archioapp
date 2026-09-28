"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT II · THE DECISION  +  ACT III · THE SYSTEM
   decision · flightdeck · community · forecast · execution · history
   One visual per slide. Every visual is a schematic of the real product,
   drawn with the theme palette — never a screenshot, never a stock image.
   ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  LayoutPanelTop, Users, Target, Crosshair, Wallet, Store,
  Radio, Clock, BadgeCheck, ShieldCheck, Lock, Check, X, Sparkles,
  CandlestickChart, Activity, MessageSquare, Bot, ArrowRight, type LucideIcon,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, seeded, DECK_EASE } from "./slide-frame"

/* ═══════════════════════════════════════════════════════════════════════
   DECISION — six features around one memory
   ═══════════════════════════════════════════════════════════════════════ */

export const SIX: { id: string; n: string; icon: LucideIcon; name: string; line: string }[] = [
  { id: "flightdeck", n: "01", icon: LayoutPanelTop, name: "Flight Deck", line: "One window for everything" },
  { id: "community", n: "02", icon: Users, name: "Community", line: "Verified mentor rooms + Catch Me Up" },
  { id: "forecast", n: "03", icon: Target, name: "Decision Desk", line: "Say it before the trade · rules in front of the ticket" },
  { id: "execution", n: "04", icon: Crosshair, name: "Broker rails", line: "The fill · TradeLocker · not connected yet" },
  { id: "history", n: "05", icon: Wallet, name: "Trading DNA", line: "Rules · patterns · Mind Check · every trade, one memory" },
  { id: "marketplace", n: "06", icon: Store, name: "AI Agent Marketplace", line: "Clones, agents, dashboards — sold on the record" },
]

/* the loop, now owned step by step — the EXECUTION slot is the broker's, and it is honest about it */
const LOOP_BUILT: { step: string; icon: LucideIcon; name: string; line: string; broker?: boolean }[] = [
  { step: "01 Context", icon: Users, name: "Community", line: "Verified room · Catch Me Up" },
  { step: "02 Thesis", icon: Target, name: "Decision Desk", line: "Forecast · stamped before the trade" },
  { step: "03 Decision", icon: ShieldCheck, name: "Rules check", line: "Your plan + the gameplan, in front of the ticket" },
  { step: "04 Execution", icon: Crosshair, name: "Broker rails", line: "TradeLocker · not connected yet", broker: true },
  { step: "05 Review", icon: Wallet, name: "Trading DNA", line: "“Why did I lose yesterday?”" },
]

export function DecisionScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      {/* the window that holds the loop */}
      <div className="rounded-2xl p-3 lg:p-4 flex flex-col gap-3" style={{ border: `1px solid ${withAlpha(accent, 0.4)}`, background: withAlpha(pal.bgDeep, 0.35) }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LayoutPanelTop style={{ width: 13, height: 13, color: accent }} />
            <Micro color={accent}>Flight Deck · one window</Micro>
          </div>
          <div className="flex items-center gap-2">
            <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: glow(accent, 0.7) }} animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }} />
            <Micro color={pal.textDim}>one record · written at every step</Micro>
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-2 lg:gap-3">
          {/* the connected thread behind the nodes */}
          <motion.span
            className="hidden lg:block absolute left-[10%] right-[10%] top-[26px] h-px"
            style={{ background: `linear-gradient(90deg, ${withAlpha(accent, 0.15)}, ${accent}, ${withAlpha(accent, 0.15)})`, transformOrigin: "left center" }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: DECK_EASE }}
            aria-hidden
          />
          {!reduce && (
            <motion.span
              className="hidden lg:block absolute top-[23px] w-[7px] h-[7px] rounded-full"
              style={{ background: accent, boxShadow: glow(accent, 1) }}
              animate={{ left: ["10%", "90%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.8, repeatDelay: 0.6 }}
              aria-hidden
            />
          )}

          {LOOP_BUILT.map((f, i) => {
            const c = f.broker ? pal.amber : accent
            return (
              <motion.div
                key={f.step}
                className="relative rounded-2xl p-3.5 flex flex-col gap-2"
                style={{
                  background: f.broker ? withAlpha(pal.amber, 0.06) : pal.glassHi,
                  border: `1px ${f.broker ? "dashed" : "solid"} ${withAlpha(c, f.broker ? 0.6 : 0.4)}`,
                }}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.55, ease: DECK_EASE }}
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: withAlpha(c, 0.14), border: `1px solid ${withAlpha(c, 0.45)}`, boxShadow: glow(c, 0.3) }}>
                    <f.icon style={{ width: 16, height: 16, color: c }} />
                  </span>
                  {f.broker ? <Pill color={pal.amber}>Your rail</Pill> : <Check style={{ width: 14, height: 14, color: pal.green }} />}
                </div>
                <Micro color={c}>{f.step}</Micro>
                <span className="text-[14px] font-black tracking-tight leading-tight" style={{ color: pal.text }}>{f.name}</span>
                <span className="text-[11.5px] leading-snug" style={{ color: pal.textDim }}>{f.line}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* the economy around the record */}
      <motion.div
        className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-2.5"
        style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex items-center gap-2">
          <Store style={{ width: 13, height: 13, color: pal.textDim }} />
          <span className="text-[12px] font-bold" style={{ color: pal.text }}>06 Marketplace</span>
          <span className="text-[11.5px]" style={{ color: pal.textDim }}>— dashboards, agents and mentors sold around the record</span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>The unconscious loop, made conscious</span>
      </motion.div>
    </Stage>
  )
}

/* ═══════════���═══════════════════════════════════════════════════════════
   FLIGHT DECK — the hero schematic of the one window
   top bar (Archio now · equity · R) · left community rail · chart · right execution
   ═══════════════════════════════════════════════════════════════════════ */

function MiniCandles({ color, up, n = 26, seed = 3 }: { color: string; up: string; n?: number; seed?: number }) {
  const bars = Array.from({ length: n }, (_, i) => {
    const o = 40 + seeded(i, seed) * 30
    const c = 40 + seeded(i + 1, seed) * 30
    const hi = Math.max(o, c) + seeded(i, seed + 9) * 8
    const lo = Math.min(o, c) - seeded(i, seed + 5) * 8
    return { o, c, hi, lo }
  })
  return (
    <svg viewBox={`0 0 ${n * 10} 100`} className="w-full h-full" preserveAspectRatio="none" aria-hidden>
      {bars.map((b, i) => {
        const bull = b.c >= b.o
        const col = bull ? up : color
        return (
          <g key={i}>
            <line x1={i * 10 + 5} x2={i * 10 + 5} y1={100 - b.hi} y2={100 - b.lo} stroke={withAlpha(col, 0.7)} strokeWidth={1} />
            <rect x={i * 10 + 2} width={6} y={100 - Math.max(b.o, b.c)} height={Math.max(2, Math.abs(b.c - b.o))} fill={bull ? withAlpha(col, 0.85) : withAlpha(col, 0.55)} rx={0.8} />
          </g>
        )
      })}
    </svg>
  )
}

export function FlightDeckScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (reduce) { setStep(3); return }
    const t = [400, 1100, 1800].map((ms, i) => window.setTimeout(() => setStep(i + 1), ms))
    return () => t.forEach(clearTimeout)
  }, [reduce])

  const label = (t: string, c = pal.textGhost) => <Micro color={c}>{t}</Micro>

  return (
    <Stage pal={pal} accent={accent} className="p-3 lg:p-4">
      <div className="flex flex-col gap-2" style={{ minHeight: 360 }}>
        {/* TOP BAR — Archio now · equity · R */}
        <motion.div
          className="grid grid-cols-12 gap-2 rounded-xl px-3 py-2"
          style={{ background: pal.glassHi, border: `1px solid ${withAlpha(accent, step >= 3 ? 0.45 : 0.12)}` }}
          animate={{ opacity: step >= 3 ? 1 : 0.35 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-span-5 flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(accent, 0.18), boxShadow: glow(accent, 0.4) }}>
              <Sparkles style={{ width: 12, height: 12, color: accent }} />
            </span>
            <div className="flex flex-col min-w-0">
              {label("Archio · now", accent)}
              <span className="text-[12px] truncate" style={{ color: pal.text }}>Mentor called XAU/USD long · 2:39 PM · your rules: 2 of 3 today</span>
            </div>
          </div>
          <div className="col-span-7 grid grid-cols-4 gap-2">
            {[
              ["Equity", "$50,412", pal.text],
              ["Today", "+1.4R", pal.green],
              ["Open risk", "0.5%", pal.amber],
              ["Phase 2", "14d left", pal.textDim],
            ].map(([k, v, c]) => (
              <div key={k} className="flex flex-col items-end">
                {label(k)}
                <Num color={c as string} size={14}>{v}</Num>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BODY */}
        <div className="grid grid-cols-12 gap-2 flex-1" style={{ minHeight: 290 }}>
          {/* LEFT — community slides in */}
          <motion.div
            className="col-span-3 rounded-xl p-3 flex flex-col gap-2 overflow-hidden"
            style={{ background: pal.glassHi, border: `1px solid ${withAlpha(pal.green, step >= 1 ? 0.45 : 0.1)}` }}
            initial={reduce ? false : { x: -40, opacity: 0 }}
            animate={{ x: step >= 1 ? 0 : -40, opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: DECK_EASE }}
          >
            <div className="flex items-center justify-between">
              {label("Community", pal.green)}
              <span className="flex items-center gap-1">
                <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: pal.red }} animate={reduce ? undefined : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }} />
                {label("Live", pal.red)}
              </span>
            </div>
            <div className="rounded-lg aspect-video flex items-center justify-center" style={{ background: withAlpha(pal.bgDeep, 0.7), border: `1px solid ${pal.glassEdge}` }}>
              <Radio style={{ width: 18, height: 18, color: pal.green }} />
            </div>
            <div className="flex flex-col gap-1.5">
              {["2:39 Long XAU · 2,412", "2:41 Invalidation 2,404", "2:47 Target 1 hit"].map((t, i) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: i === 2 ? pal.green : pal.textGhost }} />
                  <span className="text-[10.5px] truncate" style={{ color: i === 2 ? pal.text : pal.textDim }}>{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg px-2 py-1.5 flex items-center gap-1.5" style={{ background: withAlpha(pal.green, 0.12), border: `1px solid ${withAlpha(pal.green, 0.35)}` }}>
              <Clock style={{ width: 11, height: 11, color: pal.green }} />
              <span className="text-[10px] font-bold" style={{ color: pal.green }}>Catch me up</span>
            </div>
          </motion.div>

          {/* CENTER — chart */}
          <div className="col-span-6 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden" style={{ background: withAlpha(pal.bgDeep, 0.7), border: `1px solid ${pal.glassEdge}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CandlestickChart style={{ width: 13, height: 13, color: pal.textDim }} />
                <span className="text-[11px] font-bold" style={{ color: pal.text }}>XAU/USD · 5m</span>
              </div>
              {label("TradingView")}
            </div>
            <div className="flex-1 relative" style={{ minHeight: 200 }}>
              <MiniCandles color={pal.red} up={pal.green} />
              {/* mentor level */}
              <motion.div
                className="absolute inset-x-0 flex items-center gap-2"
                style={{ top: "38%" }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: step >= 1 ? 1 : 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="flex-1 h-px" style={{ background: `repeating-linear-gradient(90deg, ${withAlpha(pal.green, 0.8)} 0 6px, transparent 6px 11px)` }} />
                <Pill color={pal.green}>Mentor 2,412</Pill>
              </motion.div>
              <motion.div
                className="absolute inset-x-0 flex items-center gap-2"
                style={{ top: "66%" }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: step >= 1 ? 1 : 0 }}
                transition={{ delay: 0.45 }}
              >
                <span className="flex-1 h-px" style={{ background: `repeating-linear-gradient(90deg, ${withAlpha(pal.red, 0.8)} 0 6px, transparent 6px 11px)` }} />
                <Pill color={pal.red}>Invalid 2,404</Pill>
              </motion.div>
            </div>
          </div>

          {/* RIGHT — execution */}
          <motion.div
            className="col-span-3 rounded-xl p-3 flex flex-col gap-2"
            style={{ background: pal.glassHi, border: `1px solid ${withAlpha(pal.accentDeep, step >= 2 ? 0.55 : 0.1)}` }}
            initial={reduce ? false : { x: 40, opacity: 0 }}
            animate={{ x: step >= 2 ? 0 : 40, opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: DECK_EASE }}
          >
            <div className="flex items-center justify-between">
              {label("Execution", pal.accentDeep === accent ? accent : pal.text)}
              <Pill color={pal.amber}>Sim</Pill>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[["Side", "Long"], ["Size", "0.5%"], ["Entry", "2,413"], ["Stop", "2,404"]].map(([k, v]) => (
                <div key={k} className="rounded-lg px-2 py-1.5 flex flex-col" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${pal.glassEdge}` }}>
                  {label(k)}
                  <span className="text-[12px] font-bold" style={{ color: pal.text }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {label("Your rules", pal.textDim)}
              {[["Max 3 trades", true], ["Risk ≤ 1%", true], ["No trade 12–1", true]].map(([r, ok]) => (
                <div key={r as string} className="flex items-center gap-1.5">
                  <Check style={{ width: 11, height: 11, color: ok ? pal.green : pal.red }} />
                  <span className="text-[10.5px]" style={{ color: pal.textDim }}>{r as string}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg py-2 text-center text-[11px] font-black uppercase tracking-[0.16em]" style={{ background: withAlpha(pal.green, 0.16), color: pal.green, border: `1px solid ${withAlpha(pal.green, 0.45)}` }}>
              Ready
            </div>
          </motion.div>
        </div>
      </div>
    </Stage>
  )
}

/* ══════════════════════════════════════════════�����════════════════════════
   COMMUNITY — verified room + timeline + Catch Me Up replay
   ════════════════════════════════════════════════════════════════════��═�� */

const CALLS = [
  { t: "2:39", text: "XAU/USD long above 2,412", kind: "call" },
  { t: "2:41", text: "Invalidation below 2,404", kind: "rule" },
  { t: "2:47", text: "Target 1 hit · 2,421", kind: "win" },
  { t: "2:52", text: "Do not chase the second leg", kind: "rule" },
  { t: "3:04", text: "Closing half at 2,428", kind: "win" },
]

export function CommunityScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [caught, setCaught] = useState(false)
  useEffect(() => {
    if (reduce) { setCaught(true); return }
    const id = window.setTimeout(() => setCaught(true), 1600)
    return () => clearTimeout(id)
  }, [reduce])

  const tone = (k: string) => (k === "win" ? pal.green : k === "rule" ? pal.amber : accent)

  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="grid grid-cols-12 gap-3" style={{ minHeight: 380 }}>
        {/* mentor stage */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-3">
          <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: withAlpha(accent, 0.18), border: `1px solid ${withAlpha(accent, 0.45)}` }}>
                <Users style={{ width: 16, height: 16, color: accent }} />
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold" style={{ color: pal.text }}>Marcus Reed · Official room</span>
                  <BadgeCheck style={{ width: 14, height: 14, color: pal.green }} />
                </div>
                <div className="flex items-center gap-2">
                  <Micro color={pal.green}>KYC verified</Micro>
                  <span className="w-px h-2.5" style={{ background: pal.glassEdgeHi }} />
                  <Micro color={pal.textDim}>Record · 68% · 214 forecasts</Micro>
                </div>
              </div>
            </div>
            <Pill color={pal.red}><span className="w-1.5 h-1.5 rounded-full" style={{ background: pal.red }} /> Live · 312</Pill>
          </div>

          <div className="rounded-xl relative overflow-hidden flex-1" style={{ background: withAlpha(pal.bgDeep, 0.75), border: `1px solid ${pal.glassEdge}`, minHeight: 200 }}>
            <div className="absolute inset-0 p-3 opacity-70"><MiniCandles color={pal.red} up={pal.green} seed={7} /></div>
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <Micro color={pal.textDim}>Mentor screen</Micro>
            </div>
            {/* catch me up card */}
            <AnimatePresence>
              {caught && (
                <motion.div
                  className="absolute right-3 bottom-3 left-3 lg:left-auto lg:w-[62%] rounded-xl p-3 flex flex-col gap-2"
                  style={{ background: withAlpha(pal.bg, 0.92), border: `1px solid ${withAlpha(pal.green, 0.5)}`, boxShadow: glow(pal.green, 0.5), backdropFilter: "blur(10px)" }}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: DECK_EASE }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock style={{ width: 12, height: 12, color: pal.green }} />
                      <Micro color={pal.green}>Catch me up · last 40 min</Micro>
                    </div>
                    <Micro color={pal.textGhost}>10 s</Micro>
                  </div>
                  <p className="text-[12px] leading-snug" style={{ color: pal.text }}>
                    Long XAU above 2,412, invalid 2,404. Target 1 hit at 2,421, half closed 2,428. Rule for the room: no chasing the second leg.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* timeline */}
        <div className="col-span-12 lg:col-span-5 rounded-xl p-3 flex flex-col gap-2" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
          <div className="flex items-center justify-between">
            <Micro color={pal.textDim}>Session timeline</Micro>
            <Micro color={pal.textGhost}>Every call stamped</Micro>
          </div>
          <div className="relative flex flex-col gap-2 pl-4">
            <span className="absolute left-[5px] top-2 bottom-2 w-px" style={{ background: pal.glassEdgeHi }} aria-hidden />
            {CALLS.map((c, i) => (
              <motion.div
                key={c.t}
                className="relative flex items-start gap-2.5"
                initial={reduce ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.16, duration: 0.45, ease: DECK_EASE }}
              >
                <span className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: tone(c.kind), boxShadow: glow(tone(c.kind), 0.5) }} />
                <Num color={pal.textGhost} size={11}>{c.t}</Num>
                <span className="text-[12px] leading-snug" style={{ color: pal.text }}>{c.text}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-auto grid grid-cols-3 gap-1.5 pt-2">
            {[["Forecast", Target], ["Compare", Activity], ["Ask", MessageSquare]].map(([n, I]) => {
              const Icon = I as LucideIcon
              return (
                <div key={n as string} className="rounded-lg px-2 py-1.5 flex items-center justify-center gap-1.5" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${pal.glassEdge}` }}>
                  <Icon style={{ width: 11, height: 11, color: pal.textDim }} />
                  <span className="text-[10px] font-bold" style={{ color: pal.textDim }}>{n as string}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   FORECAST — the card: said before, resolved after, locked
   ═══════════════════════════════════════════════════════════════════════ */

export function ForecastScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<0 | 1 | 2>(0)
  useEffect(() => {
    if (reduce) { setPhase(2); return }
    const a = window.setTimeout(() => setPhase(1), 900)
    const b = window.setTimeout(() => setPhase(2), 2300)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [reduce])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* the card */}
      <Stage pal={pal} accent={accent} className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target style={{ width: 14, height: 14, color: accent }} />
            <Micro color={accent}>Forecast · XAU/USD</Micro>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={phase} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.3 }}>
              {phase === 0 && <Pill color={pal.textDim}>Draft</Pill>}
              {phase === 1 && <Pill color={accent} solid>Published</Pill>}
              {phase === 2 && <Pill color={pal.green} solid>Resolved · Win</Pill>}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            ["Direction", "Long", pal.green],
            ["Level", "2,412", pal.text],
            ["Invalidation", "2,404", pal.red],
            ["Horizon", "4 hours", pal.text],
          ].map(([k, v, c]) => (
            <div key={k} className="rounded-xl px-3 py-2.5 flex flex-col gap-0.5" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
              <Micro color={pal.textGhost}>{k}</Micro>
              <span className="text-[15px] font-black" style={{ color: c as string }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-3 py-2.5 flex flex-col gap-1" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
          <Micro color={pal.textGhost}>Why</Micro>
          <span className="text-[12.5px] leading-snug" style={{ color: pal.text }}>Mentor thesis + London sweep of 2,408 lows + my rule: only longs above the 5m VWAP.</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Lock style={{ width: 12, height: 12, color: pal.textDim }} />
            <Micro color={pal.textDim}>Locked at 2:44 PM · cannot be edited</Micro>
          </div>
          <Num color={pal.textGhost} size={11}>#00214</Num>
        </div>
      </Stage>

      {/* the record */}
      <Stage pal={pal} accent={accent} className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Micro color={pal.textDim}>Public record · Marcus Reed</Micro>
          <BadgeCheck style={{ width: 14, height: 14, color: pal.green }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["Forecasts", "214", pal.text], ["Hit rate", "68%", pal.green], ["Avg R", "+1.9", accent]].map(([k, v, c]) => (
            <div key={k} className="flex flex-col items-center rounded-xl py-3" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
              <Num color={c as string} size={22} glowColor={c as string}>{v}</Num>
              <Micro color={pal.textGhost}>{k}</Micro>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <Micro color={pal.textGhost}>Last 24 resolved</Micro>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, i) => {
              const win = seeded(i, 11) > 0.32
              return (
                <motion.span
                  key={i}
                  className="h-6 rounded-md"
                  style={{ background: withAlpha(win ? pal.green : pal.red, win ? 0.7 : 0.45) }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.035, duration: 0.35, ease: DECK_EASE }}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-auto rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: withAlpha(pal.green, 0.1), border: `1px solid ${withAlpha(pal.green, 0.35)}` }}>
          <ShieldCheck style={{ width: 14, height: 14, color: pal.green }} />
          <span className="text-[12px] font-semibold" style={{ color: pal.text }}>No screenshots. Every number came from a locked forecast.</span>
        </div>
      </Stage>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   EXECUTION — the rules gate in front of the ticket
   ═══════════════════════════════════════════════════════════════════════ */

const RULES = [
  { r: "Max 3 trades per day", ok: true, note: "2 of 3" },
  { r: "Risk per trade ≤ 1%", ok: true, note: "0.5%" },
  { r: "No trades 12:00–13:00", ok: true, note: "14:44" },
  { r: "Forecast published first", ok: true, note: "#00214" },
]

export function ExecutionScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [oversize, setOversize] = useState(false)
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setOversize((v) => !v), 2600)
    return () => clearInterval(id)
  }, [reduce])

  const rules = RULES.map((x, i) => (i === 1 ? { ...x, ok: !oversize, note: oversize ? "2.2%" : "0.5%" } : x))
  const blocked = rules.some((x) => !x.ok)
  const gate = blocked ? pal.red : pal.green

  return (
    <Stage pal={pal} accent={accent} className="p-5">
      <div className="grid grid-cols-12 gap-4 items-stretch">
        {/* ticket */}
        <div className="col-span-12 sm:col-span-4 rounded-xl p-4 flex flex-col gap-3" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
          <div className="flex items-center justify-between">
            <Micro color={pal.textDim}>Order ticket</Micro>
            <Pill color={pal.amber}>Sim</Pill>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[["Pair", "XAU/USD"], ["Side", "Long"], ["Entry", "2,413"], ["Stop", "2,404"], ["Target", "2,430"]].map(([k, v]) => (
              <div key={k} className="rounded-lg px-2.5 py-2 flex flex-col min-w-0 overflow-hidden" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${pal.glassEdge}` }}>
                <Micro color={pal.textGhost}>{k}</Micro>
                <span className="text-[13px] font-bold" style={{ color: pal.text }}>{v}</span>
              </div>
            ))}
            <motion.div
              className="rounded-lg px-2.5 py-2 flex flex-col"
              animate={{ background: withAlpha(oversize ? pal.red : pal.bgDeep, oversize ? 0.16 : 0.6), borderColor: withAlpha(oversize ? pal.red : pal.glassEdge, oversize ? 0.6 : 1) }}
              style={{ border: `1px solid ${pal.glassEdge}` }}
            >
              <Micro color={pal.textGhost}>Risk</Micro>
              <span className="text-[13px] font-bold" style={{ color: oversize ? pal.red : pal.text }}>{oversize ? "2.2%" : "0.5%"}</span>
            </motion.div>
          </div>
        </div>

        {/* gate */}
        <div className="col-span-12 sm:col-span-2 flex sm:flex-col items-center justify-center gap-2">
          <span className="hidden sm:block flex-1 w-px" style={{ background: `linear-gradient(180deg, transparent, ${withAlpha(gate, 0.6)})` }} />
          <motion.span
            className="w-12 h-12 rounded-full flex items-center justify-center"
            animate={{ background: withAlpha(gate, 0.18), borderColor: withAlpha(gate, 0.7), boxShadow: glow(gate, 0.9) }}
            style={{ border: "1px solid" }}
          >
            {blocked ? <X style={{ width: 18, height: 18, color: gate }} /> : <Check style={{ width: 18, height: 18, color: gate }} />}
          </motion.span>
          <span className="hidden sm:block flex-1 w-px" style={{ background: `linear-gradient(180deg, ${withAlpha(gate, 0.6)}, transparent)` }} />
        </div>

        {/* rules */}
        <div className="col-span-12 sm:col-span-6 rounded-xl p-4 flex flex-col gap-2" style={{ background: pal.glassHi, border: `1px solid ${withAlpha(gate, 0.4)}` }}>
          <div className="flex items-center justify-between">
            <Micro color={pal.textDim}>Your rules · checked first</Micro>
            <ShieldCheck style={{ width: 13, height: 13, color: gate }} />
          </div>
          {rules.map((x) => (
            <div key={x.r} className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2" style={{ background: withAlpha(pal.bgDeep, 0.55), border: `1px solid ${withAlpha(x.ok ? pal.glassEdge : pal.red, x.ok ? 1 : 0.5)}` }}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {x.ok ? <Check style={{ width: 12, height: 12, color: pal.green, flexShrink: 0 }} /> : <X style={{ width: 12, height: 12, color: pal.red, flexShrink: 0 }} />}
                <span className="text-[11.5px] leading-tight" style={{ color: pal.text }}>{x.r}</span>
              </div>
              <span className="shrink-0 whitespace-nowrap"><Num color={x.ok ? pal.textDim : pal.red} size={11}>{x.note}</Num></span>
            </div>
          ))}
          <motion.div
            className="mt-auto rounded-lg py-2.5 text-center text-[11px] font-black uppercase tracking-[0.18em]"
            animate={{ background: withAlpha(gate, 0.16), color: gate, borderColor: withAlpha(gate, 0.5) }}
            style={{ border: "1px solid" }}
          >
            {blocked ? "Blocked · size above plan" : "Ready · send on broker rails"}
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        <Micro color={pal.textGhost}>Archio checks</Micro>
        <ArrowRight style={{ width: 11, height: 11, color: pal.textGhost }} />
        <Micro color={pal.textGhost}>Broker executes</Micro>
        <ArrowRight style={{ width: 11, height: 11, color: pal.textGhost }} />
        <Micro color={pal.textGhost}>Archio remembers</Micro>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HISTORY — accounts row + auto-journal + the question answered
   ═══════════════════════════════════════════════════════════════════════ */

const ACCOUNTS = [
  { name: "FTMO 50K", tag: "Phase 2 · 14d", eq: "$50,412", d: "+0.8%", up: true },
  { name: "Live · IC Markets", tag: "Personal", eq: "$12,940", d: "−0.4%", up: false },
  { name: "TradeLocker demo", tag: "Sim", eq: "$100,000", d: "+2.1%", up: true },
]

const JOURNAL = [
  { t: "09:12", pair: "EUR/USD", r: "+1.2R", ok: true, note: "Rule-clean" },
  { t: "10:40", pair: "XAU/USD", r: "+0.8R", ok: true, note: "Rule-clean" },
  { t: "13:05", pair: "NAS100", r: "−1.0R", ok: false, note: "Size 2.2× plan" },
  { t: "13:31", pair: "NAS100", r: "−1.4R", ok: false, note: "Over daily limit" },
]

export function HistoryScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [answered, setAnswered] = useState(false)
  useEffect(() => {
    if (reduce) { setAnswered(true); return }
    const id = window.setTimeout(() => setAnswered(true), 1500)
    return () => clearTimeout(id)
  }, [reduce])

  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="flex flex-col gap-3">
        {/* accounts */}
        <div className="grid grid-cols-3 gap-2">
          {ACCOUNTS.map((a, i) => (
            <motion.div
              key={a.name}
              className="rounded-xl px-3 py-2.5 flex flex-col gap-1"
              style={{ background: pal.glassHi, border: `1px solid ${i === 0 ? withAlpha(accent, 0.45) : pal.glassEdge}` }}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold truncate" style={{ color: pal.text }}>{a.name}</span>
                <Micro color={pal.textGhost}>{a.tag}</Micro>
              </div>
              <div className="flex items-end justify-between">
                <Num color={pal.text} size={15}>{a.eq}</Num>
                <Num color={a.up ? pal.green : pal.red} size={12}>{a.d}</Num>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* journal */}
          <div className="col-span-12 lg:col-span-6 rounded-xl p-3 flex flex-col gap-1.5" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
            <div className="flex items-center justify-between mb-1">
              <Micro color={pal.textDim}>Yesterday · auto-journaled</Micro>
              <Micro color={pal.textGhost}>4 trades · −0.4R</Micro>
            </div>
            {JOURNAL.map((j, i) => (
              <motion.div
                key={j.t}
                className="grid grid-cols-12 items-center gap-2 rounded-lg px-2.5 py-2"
                style={{ background: withAlpha(pal.bgDeep, 0.55), border: `1px solid ${withAlpha(j.ok ? pal.glassEdge : pal.red, j.ok ? 1 : 0.35)}` }}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
              >
                <Num color={pal.textGhost} size={10.5}>{j.t}</Num>
                <span className="col-span-3 text-[12px] font-bold" style={{ color: pal.text }}>{j.pair}</span>
                <span className="col-span-2"><Num color={j.ok ? pal.green : pal.red} size={12}>{j.r}</Num></span>
                <span className="col-span-6 text-[11px] flex items-center gap-1.5 justify-end" style={{ color: j.ok ? pal.textDim : pal.red }}>
                  {!j.ok && <span className="w-1.5 h-1.5 rounded-full" style={{ background: pal.red }} />}
                  {j.note}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ask archio */}
          <div className="col-span-12 lg:col-span-6 rounded-xl p-3 flex flex-col gap-2" style={{ background: withAlpha(pal.bgDeep, 0.6), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
              <Sparkles style={{ width: 12, height: 12, color: accent }} />
              <span className="text-[12.5px]" style={{ color: pal.text }}>Why did I lose yesterday?</span>
            </div>
            <AnimatePresence>
              {answered && (
                <motion.div
                  className="flex flex-col gap-2.5 px-1 pt-1"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: DECK_EASE }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg px-3 py-2 flex flex-col" style={{ background: withAlpha(pal.green, 0.1), border: `1px solid ${withAlpha(pal.green, 0.35)}` }}>
                      <Micro color={pal.green}>Rule-clean trades</Micro>
                      <Num color={pal.green} size={20} glowColor={pal.green}>+2.0R</Num>
                    </div>
                    <div className="rounded-lg px-3 py-2 flex flex-col" style={{ background: withAlpha(pal.red, 0.1), border: `1px solid ${withAlpha(pal.red, 0.35)}` }}>
                      <Micro color={pal.red}>Rule-breaking trades</Micro>
                      <Num color={pal.red} size={20} glowColor={pal.red}>−2.4R</Num>
                    </div>
                  </div>
                  <p className="text-[12.5px] leading-snug" style={{ color: pal.text }}>
                    You did not lose to the market. You lost to size: both losers were 2.2× plan, both after 13:00, both over your daily limit.
                  </p>
                  <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.35)}` }}>
                    <Bot style={{ width: 12, height: 12, color: accent }} />
                    <span className="text-[11.5px] font-semibold" style={{ color: pal.text }}>Lesson: the rule you break is always the same one. Lock size after any red trade.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Stage>
  )
}
