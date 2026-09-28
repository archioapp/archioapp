"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT I · THE WORLD — the three problems added in rev3
   proof · accounts · ninety
   ───────────────────────────────────────────────────────────────────────
   proof     the only proof in retail trading is a screenshot
   accounts  four accounts, four rule sets, no scoreboard
   ninety    the regulatory number — most lose — and why: structure,
             not strategy. The bridge into Act II.
   ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Image as ImageIcon, Crop, LineChart, Lock, ShieldCheck, Clock, CheckCircle2, Globe,
  Building2, Flame, Landmark, Wallet, HelpCircle, AlertTriangle, Bell,
  Radio, EyeOff, Receipt, Users, Camera, Video, Layers,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"

/* ═══════════════════════════════════════════════════════════════════════
   PROOF — screenshots vs a record
   ═══════════════════════════════════════════════════════════════════════ */

const TODAY_PROOF = [
  { icon: ImageIcon, title: "Account screenshot", meta: "$48,210.55 · cropped · no date", tag: "unverifiable" },
  { icon: Crop, title: "Win rate · 94%", meta: "self-reported · losses deleted", tag: "unverifiable" },
  { icon: LineChart, title: "Chart drawn after the move", meta: "arrow added at 16:40 · never posted live", tag: "unverifiable" },
]

const SHOULD_PROOF = [
  { icon: Clock, title: "Stamped before the outcome", meta: "direction · level · invalidation · time" },
  { icon: CheckCircle2, title: "Resolved automatically", meta: "hit / miss / expired — by the system" },
  { icon: ShieldCheck, title: "Audited, not typed", meta: "hit rate · avg R · adherence" },
  { icon: Globe, title: "Public", meta: "one profile · one identity · KYC" },
]

export function ProofScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="h-[384px] p-4 flex flex-col gap-3">
      <div className="grid grid-cols-[1.12fr_1fr] gap-3 flex-1 min-h-0">
        {/* today */}
        <div className="flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <Micro color={pal.red}>Proof today</Micro>
            <Pill color={pal.red}>screenshots</Pill>
          </div>
          {TODAY_PROOF.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                style={{ background: pal.glassHi, border: `1px solid ${withAlpha(pal.red, 0.35)}` }}
                initial={reduce ? false : { opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.14, duration: 0.5, ease: DECK_EASE }}
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(pal.red, 0.12) }}>
                  <Icon style={{ width: 15, height: 15, color: pal.red }} />
                </span>
                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                  <div className="text-[12.5px] font-bold leading-tight" style={{ color: pal.text }}>{p.title}</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] px-1.5 py-px rounded shrink-0" style={{ color: pal.red, background: withAlpha(pal.red, 0.12) }}>{p.tag}</span>
                    <span className="text-[10px] leading-snug" style={{ color: pal.textGhost }}>{p.meta}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* should be */}
        <div className="relative flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <Micro color={pal.textGhost}>Should be</Micro>
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.14em] whitespace-nowrap" style={{ color: pal.textGhost }}>
              <Lock style={{ width: 10, height: 10 }} /> nobody has this
            </span>
          </div>
          {SHOULD_PROOF.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                className="rounded-xl px-3 py-2 flex items-center gap-3"
                style={{ background: "transparent", border: `1px dashed ${pal.glassEdge}`, opacity: 0.62 }}
                initial={reduce ? false : { opacity: 0, x: 14 }}
                animate={{ opacity: 0.62, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.5, ease: DECK_EASE }}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(accent, 0.1) }}>
                  <Icon style={{ width: 13, height: 13, color: accent }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold leading-tight" style={{ color: pal.text }}>{p.title}</div>
                  <div className="text-[10px] leading-snug" style={{ color: pal.textGhost }}>{p.meta}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <motion.div
        className="rounded-lg px-3 py-2 text-[12px] text-center"
        style={{ background: withAlpha(pal.red, 0.08), border: `1px solid ${withAlpha(pal.red, 0.3)}`, color: pal.text }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5, ease: DECK_EASE }}
      >
        A real mentor and a scammer are <span className="font-black" style={{ color: pal.red }}>indistinguishable</span>. Same screenshot, same claim, same price.
      </motion.div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   ACCOUNTS — four accounts, no scoreboard
   ═══════════════════════════════════════════════════════════════════════ */

const ACCOUNTS = [
  { icon: Building2, name: "Funded · prop A", size: "$100,000", pnl: "+$1,240", up: true, rule: "max daily loss 5% · trailing DD 10%", status: null },
  { icon: Flame, name: "Challenge · prop B", size: "$50,000", pnl: "−$2,610", up: false, rule: "daily loss 4% · 30 days", status: "breached" },
  { icon: Landmark, name: "Personal broker", size: "$8,400", pnl: "−$310", up: false, rule: "no rules · no limits", status: null },
  { icon: Wallet, name: "Wallet", size: "0.42 BTC", pnl: "+$96", up: true, rule: "long-only · never checked", status: null },
]

export function AccountsScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="h-[340px] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Micro color={pal.textGhost}>One trader · Tuesday · four logins</Micro>
        <Pill color={pal.red}>4 rule sets · 0 scoreboards</Pill>
      </div>
      <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
        {ACCOUNTS.map((a, i) => {
          const Icon = a.icon
          const c = pal.spectrum[(i * 2) % pal.spectrum.length]
          return (
            <motion.div
              key={a.name}
              className="rounded-xl p-3 flex flex-col gap-1.5 relative overflow-hidden"
              style={{ background: pal.glassHi, border: `1px solid ${withAlpha(c, 0.4)}` }}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.14, duration: 0.5, ease: DECK_EASE }}
            >
              <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: c }} aria-hidden />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: withAlpha(c, 0.14) }}>
                  <Icon style={{ width: 13, height: 13, color: c }} />
                </span>
                <span className="text-[12px] font-bold truncate flex-1" style={{ color: pal.text }}>{a.name}</span>
                {a.status && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded" style={{ color: pal.red, background: withAlpha(pal.red, 0.14) }}>
                    <AlertTriangle style={{ width: 9, height: 9 }} /> {a.status}
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between">
                <Num color={pal.text} size={15}>{a.size}</Num>
                <Num color={a.up ? pal.green : pal.red} size={14}>{a.pnl}</Num>
              </div>
              <div className="text-[10px] truncate" style={{ color: pal.textGhost }}>{a.rule}</div>
            </motion.div>
          )
        })}
      </div>
      {/* the missing total */}
      <motion.div
        className="rounded-xl px-4 py-2.5 flex items-center justify-between"
        style={{ border: `1px dashed ${withAlpha(pal.red, 0.5)}`, background: withAlpha(pal.red, 0.05) }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="flex items-center gap-2.5">
          <motion.span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: withAlpha(pal.red, 0.12) }}
            animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <HelpCircle style={{ width: 16, height: 16, color: pal.red }} />
          </motion.span>
          <div>
            <div className="text-[12.5px] font-bold" style={{ color: pal.text }}>What am I worth today?</div>
            <div className="text-[10.5px]" style={{ color: pal.textGhost }}>No tool computes it · no alert fires before a breach</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: pal.textGhost }}><Bell style={{ width: 10, height: 10 }} /> 0 alerts</span>
          <Num color={pal.red} size={22} glowColor={pal.red}>?</Num>
        </div>
      </motion.div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   NINETY — the number, and why: structure not strategy
   ═══════════════════════════════════════════════════════════════════════ */

const SEVEN = [
  { n: "01", icon: Radio, label: "Noise" },
  { n: "02", icon: EyeOff, label: "Blind tools" },
  { n: "03", icon: Receipt, label: "Seven bills" },
  { n: "04", icon: Users, label: "Fakes" },
  { n: "05", icon: Camera, label: "Screenshots" },
  { n: "06", icon: Video, label: "Lost calls" },
  { n: "07", icon: Layers, label: "Account chaos" },
]

export function NinetyScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? 90 : 0)
  useEffect(() => {
    if (reduce) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600)
      setN(Math.round(90 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <Stage pal={pal} accent={accent} className="h-[300px] p-5 flex flex-col gap-4">
      <div className="flex items-end gap-6">
        <div className="flex items-baseline gap-2 shrink-0 whitespace-nowrap">
          <Num color={pal.text} size={64} glowColor={pal.red}>70–{n}%</Num>
        </div>
        <div className="flex flex-col gap-1 pb-2 min-w-0 flex-1">
          <span className="text-[14px] font-bold" style={{ color: pal.text }}>of retail accounts lose money.</span>
          <span className="text-[11px]" style={{ color: pal.textGhost }}>Regulatory risk disclosure range (ESMA / FCA-style CFD warnings). Brokers must print it.</span>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1 pb-2 shrink-0">
          <Micro color={pal.textGhost}>Everyone&apos;s answer</Micro>
          <span className="text-[12px] line-through whitespace-nowrap" style={{ color: pal.textGhost }}>more education · more signals · better indicators</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {SEVEN.map((p, i) => {
          const Icon = p.icon
          return (
            <motion.div
              key={p.n}
              className="rounded-xl p-2.5 flex flex-col items-center gap-1.5 text-center"
              style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.45, ease: DECK_EASE }}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: withAlpha(pal.red, 0.1) }}>
                <Icon style={{ width: 14, height: 14, color: pal.red }} />
              </span>
              <span className="text-[11px] font-bold leading-tight" style={{ color: pal.text }}>{p.label}</span>
              <motion.span
                className="text-[8.5px] font-black uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
                style={{ color: accent, background: withAlpha(accent, 0.12) }}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.35, ease: DECK_EASE }}
              >
                structure
              </motion.span>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="mt-auto flex items-center justify-between rounded-xl px-4 py-2.5"
        style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.4)}`, boxShadow: glow(accent, 0.2) }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.5, ease: DECK_EASE }}
      >
        <span className="text-[12.5px]" style={{ color: pal.text }}>Seven problems. <span className="font-black" style={{ color: accent }}>Zero</span> are strategy. <span className="font-black" style={{ color: accent }}>Seven</span> are structure.</span>
        <span className="text-[12px] font-bold" style={{ color: accent }}>Nobody solves structure — because structure is a place, not a feature.</span>
      </motion.div>
    </Stage>
  )
}
