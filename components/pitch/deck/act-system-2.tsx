"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT III · THE SYSTEM — the five scenes added in rev3
   systemmap · gameplan · tradingdna · portfolio · proofrecord
   ───────────────────────────────────────────────────────────────────────
   systemmap    the nine systems in canon order, hover → kills/owns/feeds
   gameplan     the mentor's week — interactive day tabs, news, bias, rules
   tradingdna   rules adherence · patterns · Mind Check · why did I lose
   portfolio    net worth · every account with its own limit · What If
   proofrecord  AI Verified Track Record → Social Network feed
   ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Users, Target, Landmark, ShieldCheck, Rss,
  Newspaper, TrendingUp, TrendingDown, Ban, Clock, Lock, AlertTriangle, Check, X,
  Brain, Repeat, Bell, Zap, Building2, Flame, Wallet, MessageSquare, Heart, ArrowRight,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"
import { DOSSIERS, setDossierFocus, type DossierStatus } from "./system-dossiers"

/* ═══════════════════════════════════════════════════════════════════════
   SYSTEM MAP — nine systems, one record, one dossier open at a time
   The grid is the map; the right panel is the DOSSIER of the selected
   system (data: system-dossiers.ts). Four tabs: What · Inside · Replaces
   · How. The open dossier is published to the presenter drawer so the
   founder sees the exact sentence to say for it.
   ═══════════════════════════════════════════════════════════════════════ */

/* 3×3 with Flight Deck in the centre */
const MAP_ORDER = [1, 2, 3, 4, 0, 5, 6, 7, 8]

type DossierTab = "what" | "inside" | "replaces" | "how"
const DOSSIER_TABS: { id: DossierTab; label: string }[] = [
  { id: "what", label: "What" },
  { id: "inside", label: "Inside" },
  { id: "replaces", label: "Replaces" },
  { id: "how", label: "How" },
]

export function SystemMapScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [sel, setSel] = useState(1)
  const [tab, setTab] = useState<DossierTab>("what")
  const d = DOSSIERS[sel]
  const statusColor = (st: DossierStatus) => (st === "real" ? pal.green : st === "demo" ? accent : pal.amber)
  const statusLabel = (st: DossierStatus) => (st === "real" ? "real" : st === "demo" ? "built · demo" : "planned")

  useEffect(() => {
    setDossierFocus(d.id)
    return () => setDossierFocus(null)
  }, [d.id])

  return (
    <Stage pal={pal} accent={accent} className="h-[400px] p-4 flex flex-col gap-3">
      <div className="grid grid-cols-[1.15fr_1fr] gap-4 flex-1 min-h-0">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 min-h-0">
          {MAP_ORDER.map((idx, i) => {
            const sys = DOSSIERS[idx]
            const on = sel === idx
            const centre = idx === 0
            return (
              <motion.button
                key={sys.n}
                type="button"
                onMouseEnter={() => setSel(idx)}
                onFocus={() => setSel(idx)}
                onClick={() => setSel(idx)}
                aria-pressed={on}
                className="relative rounded-xl px-3 py-2 flex flex-col items-start gap-1 text-left min-w-0 outline-none"
                style={{
                  background: on ? withAlpha(accent, 0.16) : centre ? withAlpha(accent, 0.08) : pal.glassHi,
                  border: `1px solid ${on ? withAlpha(accent, 0.7) : centre ? withAlpha(accent, 0.4) : pal.glassEdge}`,
                  boxShadow: on ? glow(accent, 0.35) : "none",
                }}
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: DECK_EASE }}
              >
                <div className="flex items-center justify-between w-full">
                  <Num color={on ? accent : pal.textGhost} size={10}>{sys.n}</Num>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(sys.status), boxShadow: glow(statusColor(sys.status), 0.5) }} aria-label={sys.status} />
                </div>
                <div className="flex items-center gap-1.5 min-w-0 w-full">
                  <sys.icon style={{ width: 13, height: 13, color: on ? accent : pal.textDim, flexShrink: 0 }} />
                  <span className="font-black truncate" style={{ color: pal.text, fontSize: sys.name.length > 18 ? 10 : 11.5, letterSpacing: sys.name.length > 18 ? "-0.03em" : undefined }}>{sys.name}</span>
                </div>
                <span className="text-[9.5px] leading-snug italic line-clamp-2" style={{ color: on ? pal.textDim : pal.textGhost }}>
                  &ldquo;{sys.quote}&rdquo;
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* the dossier */}
        <div className="rounded-2xl flex flex-col min-h-0 overflow-hidden" style={{ background: withAlpha(accent, 0.06), border: `1px solid ${withAlpha(accent, 0.3)}` }}>
          <div className="flex items-center gap-2 px-4 pt-3 pb-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(accent, 0.16) }}>
              <d.icon style={{ width: 15, height: 15, color: accent }} />
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-black truncate" style={{ color: pal.text }}>{d.n} · {d.name}</div>
              <Micro color={pal.textGhost}>Dossier · {d.inside.length} pages inside</Micro>
            </div>
            <span className="ml-auto text-[8.5px] font-black uppercase tracking-[0.14em] px-1.5 py-0.5 rounded shrink-0" style={{ color: statusColor(d.status), background: withAlpha(statusColor(d.status), 0.12) }}>
              {statusLabel(d.status)}
            </span>
          </div>

          <div role="tablist" aria-label="Dossier sections" className="flex items-center gap-1 px-4">
            {DOSSIER_TABS.map((t) => {
              const on = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.id)}
                  className="text-[10px] font-black uppercase tracking-[0.14em] px-2 py-1 rounded-md outline-none"
                  style={{ color: on ? accent : pal.textGhost, background: on ? withAlpha(accent, 0.14) : "transparent", border: `1px solid ${on ? withAlpha(accent, 0.5) : "transparent"}` }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 pt-2.5" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${d.id}-${tab}`}
                className="flex flex-col gap-2.5"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                {tab === "what" && (
                  <>
                    <p className="text-[13px] italic leading-snug" style={{ color: pal.text }}>&ldquo;{d.quote}&rdquo;</p>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: pal.text }}>{d.what}</p>
                    <div className="grid grid-cols-[64px_1fr] gap-2 items-start">
                      <Micro color={pal.textGhost}>Analogy</Micro>
                      <span className="text-[11px] leading-snug italic" style={{ color: pal.textDim }}>{d.analogy}</span>
                    </div>
                    <div className="grid grid-cols-[64px_1fr] gap-2 items-start">
                      <Micro color={pal.red}>Kills</Micro>
                      <div className="flex flex-wrap gap-1">
                        {d.kills.map((k) => (
                          <span key={k.n} className="text-[9.5px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded" style={{ color: pal.red, background: withAlpha(pal.red, 0.1), border: `1px solid ${withAlpha(pal.red, 0.35)}` }}>
                            {k.n} {k.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-[64px_1fr] gap-2 items-start">
                      <Micro color={accent}>Owns</Micro>
                      <span className="text-[11px] leading-snug" style={{ color: pal.text }}>{d.loop}</span>
                    </div>
                  </>
                )}

                {tab === "inside" && (
                  <ul className={`grid gap-x-4 gap-y-2 ${d.inside.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {d.inside.map((p) => {
                      const st = p.status ?? d.status
                      return (
                        <li key={p.name} className="grid grid-cols-[10px_1fr] gap-2 items-start" title={p.does}>
                          <span className="w-1.5 h-1.5 rounded-full mt-[5px]" style={{ background: statusColor(st), boxShadow: glow(statusColor(st), 0.4) }} aria-label={statusLabel(st)} />
                          <div className="min-w-0">
                            <div className="text-[11px] font-black leading-snug truncate" style={{ color: pal.text }}>{p.name}</div>
                            <div className="text-[10.5px] leading-snug line-clamp-2" style={{ color: pal.textDim }}>{p.does}</div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {tab === "replaces" && (
                  <ul className={`grid gap-x-4 gap-y-2 ${d.replaces.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {d.replaces.map((r) => (
                      <li key={r.app} className="grid grid-cols-[14px_1fr] gap-2 items-start">
                        <X style={{ width: 12, height: 12, color: pal.red, marginTop: 2 }} aria-hidden />
                        <div className="min-w-0">
                          <div className="text-[11px] font-black leading-snug" style={{ color: pal.text }}>{r.app}</div>
                          <div className="text-[10.5px] leading-snug" style={{ color: pal.textDim }}>{r.fails}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {tab === "how" && (
                  <>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: pal.text }}>{d.how}</p>
                    <div className="grid grid-cols-[64px_1fr] gap-2 items-start">
                      <Micro color={pal.green}>Feeds</Micro>
                      <ul className="flex flex-col gap-1">
                        {d.feeds.map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-[11px] leading-snug" style={{ color: pal.text }}>
                            <ArrowRight style={{ width: 11, height: 11, color: pal.green, marginTop: 2, flexShrink: 0 }} aria-hidden />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg px-3 py-1.5" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
        <Micro color={accent}>One record</Micro>
        <span className="relative flex-1 h-px overflow-hidden" style={{ background: withAlpha(accent, 0.25) }}>
          <motion.span className="absolute top-0 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} animate={reduce ? undefined : { left: ["-20%", "110%"] }} transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} />
        </span>
        <span className="text-[10.5px]" style={{ color: pal.textGhost }}>
          <span style={{ color: pal.green }}>●</span> real · <span style={{ color: accent }}>●</span> built, demo data · <span style={{ color: pal.amber }}>●</span> planned
        </span>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   GAMEPLAN — the mentor writes the week
   ═══════════════════════════════════════════════════════════════════════ */

type Day = {
  d: string; date: string
  news: { t: string; name: string; impact: 1 | 2 | 3; play: string }[]
  bias: { inst: string; dir: "long" | "short" | "flat"; level: string; invalid: string }[]
  read: string
  rules: { text: string; hot?: boolean }[]
}

/* the mentor's week — every event carries HOW to trade it, every day
   carries his read. This is what "gameplan" means: not a calendar, a plan. */
const WEEK: Day[] = [
  {
    d: "Mon", date: "09",
    news: [{ t: "10:00", name: "ISM Services", impact: 2, play: "Let it print. Fade the spike if it fails the Friday high." }],
    bias: [{ inst: "XAUUSD", dir: "long", level: "2,410", invalid: "2,388" }, { inst: "NAS100", dir: "flat", level: "—", invalid: "—" }],
    read: "Slow open to the week. Gold holds the 2,410 shelf while yields drift. Nothing on NAS until it picks a side of 18,240.",
    rules: [{ text: "Max 3 trades" }, { text: "0.75% risk" }, { text: "Book half at 1R" }],
  },
  {
    d: "Tue", date: "10",
    news: [
      { t: "08:30", name: "CPI · core m/m", impact: 3, play: "Flat 08:15–08:45. The first move is the trap — trade the second." },
      { t: "13:00", name: "10Y auction", impact: 1, play: "Watch yields. A weak auction = gold bid into the close." },
    ],
    bias: [{ inst: "XAUUSD", dir: "long", level: "2,410", invalid: "2,388" }, { inst: "EURUSD", dir: "short", level: "1.0860", invalid: "1.0905" }],
    read: "Hot CPI = dollar up, gold down first, then the real move. Do not chase the print. If 2,388 breaks on the print, the long is dead for the day.",
    rules: [{ text: "No entries 08:15–08:45", hot: true }, { text: "HALF size on news", hot: true }, { text: "Max 2 trades" }],
  },
  {
    d: "Wed", date: "11",
    news: [
      { t: "14:00", name: "FOMC decision", impact: 3, play: "No position into 14:00. Full stop." },
      { t: "14:30", name: "Powell presser", impact: 3, play: "Trade the presser, not the statement. First 15 min is noise." },
    ],
    bias: [{ inst: "XAUUSD", dir: "flat", level: "wait", invalid: "—" }, { inst: "NAS100", dir: "long", level: "18,240", invalid: "18,090" }],
    read: "Fed day. Gold does nothing until Powell speaks. NAS long only above 18,240 after 14:45 — and only if the dollar is soft.",
    rules: [{ text: "Flat into 14:00", hot: true }, { text: "Max 2 trades" }, { text: "No adds after 15:00" }],
  },
  {
    d: "Thu", date: "12",
    news: [
      { t: "08:30", name: "Jobless claims", impact: 1, play: "Background. Only matters if claims jump above 240k." },
      { t: "08:30", name: "PPI", impact: 2, play: "Confirms or denies Tuesday's CPI. Same 30-min no-entry window." },
    ],
    bias: [{ inst: "XAUUSD", dir: "long", level: "reclaim 2,420", invalid: "2,396" }, { inst: "EURUSD", dir: "short", level: "1.0860", invalid: "1.0905" }],
    read: "Post-Fed follow-through. Gold needs to reclaim 2,420 — the reclaim is the trade, the break is the trap. EUR short stays while 1.0905 holds.",
    rules: [{ text: "Max 3 trades" }, { text: "0.75% risk" }, { text: "Trade the reclaim, not the break" }],
  },
  {
    d: "Fri", date: "13",
    news: [{ t: "10:00", name: "UMich sentiment", impact: 1, play: "Ignore unless inflation expectations jump." }],
    bias: [{ inst: "XAUUSD", dir: "long", level: "2,420", invalid: "2,396" }, { inst: "NAS100", dir: "flat", level: "—", invalid: "—" }],
    read: "Friday is for protecting the week, not growing it. Half size, done by noon, review at 16:00 with the record open.",
    rules: [{ text: "HALF size · Friday", hot: true }, { text: "Done by 12:00" }, { text: "Weekly review 16:00" }],
  },
]

export function GameplanScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [di, setDi] = useState(1)
  const day = WEEK[di]
  const [secs, setSecs] = useState(9 * 60 + 41)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [reduce])
  const mm = String(Math.floor(secs / 60)).padStart(2, "0")
  const ss = String(secs % 60).padStart(2, "0")
  const dirColor = (d: Day["bias"][number]["dir"]) => (d === "long" ? pal.green : d === "short" ? pal.red : pal.textGhost)
  const DirIcon = ({ d }: { d: Day["bias"][number]["dir"] }) => (d === "long" ? <TrendingUp style={{ width: 12, height: 12 }} /> : d === "short" ? <TrendingDown style={{ width: 12, height: 12 }} /> : <Ban style={{ width: 12, height: 12 }} />)
  const nextEv = day.news.find((n) => n.impact === 3) ?? day.news[0]
  const hotRule = day.rules.find((r) => r.hot)
  const ribbonColor = nextEv.impact === 3 ? pal.red : nextEv.impact === 2 ? pal.amber : pal.textDim

  return (
    <Stage pal={pal} accent={accent} className="h-[360px] p-4 flex flex-col gap-3">
      {/* ribbon — follows the selected day */}
      <div className="flex items-center gap-3 rounded-lg px-3 py-1.5" style={{ background: withAlpha(ribbonColor, 0.08), border: `1px solid ${withAlpha(ribbonColor, 0.35)}` }}>
        <span className="relative flex w-2 h-2">
          {nextEv.impact === 3 && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: ribbonColor, opacity: 0.6 }} />}
          <span className="relative w-2 h-2 rounded-full" style={{ background: ribbonColor }} />
        </span>
        <Micro color={ribbonColor}>Next event · {day.d}</Micro>
        <span className="text-[12px] font-bold" style={{ color: pal.text }}>{nextEv.name} · {nextEv.t}</span>
        <span className="flex gap-0.5" aria-label={`impact ${nextEv.impact} of 3`}>
          {[1, 2, 3].map((k) => <span key={k} className="w-1.5 h-3 rounded-sm" style={{ background: k <= nextEv.impact ? ribbonColor : pal.glassEdge }} />)}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <Clock style={{ width: 11, height: 11, color: ribbonColor }} />
          <Num color={ribbonColor} size={14}>{di === 1 ? `in ${mm}:${ss}` : nextEv.t}</Num>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded" style={{ color: hotRule ? pal.red : pal.green, background: withAlpha(hotRule ? pal.red : pal.green, 0.12) }}>
          {hotRule ? `rule: ${hotRule.text}` : "normal size"}
        </span>
      </div>

      <div className="grid grid-cols-[92px_1fr] gap-3 flex-1 min-h-0">
        {/* week */}
        <div className="flex flex-col gap-1.5" role="tablist" aria-label="Week">
          {WEEK.map((w, i) => {
            const on = i === di
            const hot = w.news.some((n) => n.impact === 3)
            return (
              <button
                key={w.d}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setDi(i)}
                className="rounded-lg px-2.5 py-1.5 flex items-center justify-between text-left outline-none"
                style={{ background: on ? withAlpha(accent, 0.16) : pal.glassHi, border: `1px solid ${on ? withAlpha(accent, 0.6) : pal.glassEdge}`, boxShadow: on ? glow(accent, 0.25) : "none" }}
              >
                <span className="flex flex-col leading-tight">
                  <span className="text-[11.5px] font-black" style={{ color: on ? accent : pal.text }}>{w.d}</span>
                  <span className="text-[9px]" style={{ color: pal.textGhost }}>Sep {w.date}</span>
                </span>
                {hot && <Zap style={{ width: 11, height: 11, color: pal.amber }} aria-label="high impact" />}
              </button>
            )
          })}
        </div>

        {/* day panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={day.d}
            className="grid grid-rows-[1fr_auto] gap-2.5 min-h-0"
            initial={reduce ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-2 gap-2.5 min-h-0">
              {/* news */}
              <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
                <div className="flex items-center gap-1.5"><Newspaper style={{ width: 12, height: 12, color: accent }} /><Micro color={accent}>News · {day.d}</Micro></div>
                {day.news.map((n, k) => (
                  <motion.div
                    key={n.name}
                    className="flex flex-col gap-1 pb-2"
                    style={{ borderBottom: k < day.news.length - 1 ? `1px dashed ${pal.glassEdge}` : "none" }}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + k * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <Num color={pal.textDim} size={11}>{n.t}</Num>
                      <span className="text-[12px] font-bold flex-1 truncate" style={{ color: pal.text }}>{n.name}</span>
                      <span className="flex gap-0.5" aria-label={`impact ${n.impact} of 3`}>
                        {[1, 2, 3].map((j) => <span key={j} className="w-1.5 h-3 rounded-sm" style={{ background: j <= n.impact ? (n.impact === 3 ? pal.red : pal.amber) : pal.glassEdge }} />)}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5 pl-0.5">
                      <ArrowRight style={{ width: 10, height: 10, color: accent, flexShrink: 0, marginTop: 2 }} />
                      <span className="text-[10.5px] leading-snug" style={{ color: pal.textDim }}>{n.play}</span>
                    </div>
                  </motion.div>
                ))}
                {day.news.length === 1 && <span className="mt-auto text-[10px] italic" style={{ color: pal.textGhost }}>Quiet day. Normal size, normal rules.</span>}
              </div>
              {/* bias + read */}
              <div className="rounded-xl p-3 flex flex-col gap-2 min-h-0" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
                <div className="flex items-center gap-1.5"><Target style={{ width: 12, height: 12, color: accent }} /><Micro color={accent}>Marcus&apos;s bias</Micro></div>
                {day.bias.map((b) => (
                  <div key={b.inst} className="grid grid-cols-[58px_auto_1fr] items-center gap-2">
                    <span className="text-[11.5px] font-black" style={{ color: pal.text }}>{b.inst}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded" style={{ color: dirColor(b.dir), background: withAlpha(dirColor(b.dir), 0.12) }}>
                      <DirIcon d={b.dir} /> {b.dir}
                    </span>
                    <span className="text-[10.5px] truncate" style={{ color: pal.textDim }}>{b.dir === "flat" ? "no trade until it proves itself" : <>{b.dir === "long" ? "above" : "below"} <b style={{ color: pal.text }}>{b.level}</b> · invalid {b.invalid}</>}</span>
                  </div>
                ))}
                <motion.div
                  className="mt-auto rounded-lg px-2.5 py-2 flex flex-col gap-1"
                  style={{ background: withAlpha(accent, 0.07), border: `1px solid ${withAlpha(accent, 0.25)}` }}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.45 }}
                >
                  <Micro color={accent}>Marcus&apos;s read · {day.d}</Micro>
                  <p className="text-[11px] leading-snug italic" style={{ color: pal.text }}>{day.read}</p>
                </motion.div>
              </div>
            </div>
            {/* rules */}
            <div className="flex items-center gap-2 flex-wrap">
              <Micro color={pal.textGhost}>Rules for {day.d}</Micro>
              {day.rules.map((r) => (
                <span key={r.text} className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: r.hot ? pal.red : pal.text, background: r.hot ? withAlpha(pal.red, 0.1) : pal.glassHi, border: `1px solid ${r.hot ? withAlpha(pal.red, 0.5) : pal.glassEdge}` }}>
                  {r.hot ? <AlertTriangle style={{ width: 10, height: 10 }} /> : <Check style={{ width: 10, height: 10, color: pal.green }} />} {r.text}
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
                <Lock style={{ width: 10, height: 10 }} /> stamped · Sun 21:14 · adherence measured
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   TRADING DNA — why do I keep breaking my own rules?
   ═══════════════════════════════════════════════════════════════════════ */

const RULES = [
  { text: "Max 3 trades / day", pct: 86 },
  { text: "0.5% on news days", pct: 55 },
  { text: "No size after a loss", pct: 40 },
  { text: "No entries in news window", pct: 62 },
]
const PATTERNS = [
  { text: "Sizes up after a loss", n: "7 of last 9 losses" },
  { text: "Trades through news windows", n: "CPI · FOMC · NFP" },
  { text: "Moves stop after entry", n: "3× this week" },
]

export function TradingDnaScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="h-[340px] p-4 flex flex-col gap-3">
      <div className="grid grid-cols-[1.1fr_1fr_0.9fr] gap-3 flex-1 min-h-0">
        {/* rules */}
        <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
          <Micro color={accent}>Rules · adherence this week</Micro>
          {RULES.map((r, i) => {
            const c = r.pct >= 80 ? pal.green : r.pct >= 60 ? pal.amber : pal.red
            return (
              <div key={r.text} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-bold" style={{ color: pal.text }}>{r.text}</span>
                  <Num color={c} size={11}>{r.pct}%</Num>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: pal.glassEdge }}>
                  <motion.div className="h-full rounded-full" style={{ background: c }} initial={reduce ? { width: `${r.pct}%` } : { width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: DECK_EASE }} />
                </div>
              </div>
            )
          })}
        </div>
        {/* patterns + mind */}
        <div className="flex flex-col gap-2.5 min-h-0">
          <div className="rounded-xl p-3 flex flex-col gap-1.5 flex-1" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
            <div className="flex items-center gap-1.5"><Repeat style={{ width: 12, height: 12, color: pal.red }} /><Micro color={pal.red}>Patterns · found by the record</Micro></div>
            {PATTERNS.map((p, i) => (
              <motion.div key={p.text} className="flex items-center justify-between gap-2" initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.15 }}>
                <span className="text-[11.5px] font-bold" style={{ color: pal.text }}>{p.text}</span>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] shrink-0" style={{ color: pal.textGhost }}>{p.n}</span>
              </motion.div>
            ))}
          </div>
          <div className="rounded-xl p-3 flex flex-col gap-1.5" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5"><Brain style={{ width: 12, height: 12, color: accent }} /><Micro color={accent}>Mind Check · last session</Micro></div>
              <span className="text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: pal.amber }}>tilting</span>
            </div>
            <div className="relative h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${pal.green}, ${pal.amber} 55%, ${pal.red})`, opacity: 0.85 }}>
              <motion.span className="absolute -top-1 w-4 h-4 rounded-full border-2" style={{ background: pal.bg, borderColor: pal.text, boxShadow: glow(pal.amber, 0.6) }} initial={reduce ? { left: "68%" } : { left: "10%" }} animate={{ left: "68%" }} transition={{ delay: 0.9, duration: 1.1, ease: DECK_EASE }} />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: pal.textGhost }}><span>calm</span><span>measured, not guessed</span><span>tilted</span></div>
          </div>
        </div>
        {/* why did I lose */}
        <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: withAlpha(accent, 0.07), border: `1px solid ${withAlpha(accent, 0.35)}` }}>
          <div className="flex items-center gap-1.5"><MessageSquare style={{ width: 12, height: 12, color: accent }} /><Micro color={accent}>Ask Archio</Micro></div>
          <span className="text-[13px] font-black leading-tight" style={{ color: pal.text }}>&ldquo;Why did I lose yesterday?&rdquo;</span>
          <span className="text-[11px] leading-snug" style={{ color: pal.textDim }}>Not gold. You. 3 of 4 losses were rule breaks: sized up after loss ×2, traded through CPI ×1.</span>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2 flex flex-col items-center" style={{ background: withAlpha(pal.green, 0.1), border: `1px solid ${withAlpha(pal.green, 0.35)}` }}>
              <Micro color={pal.green}>rules kept</Micro>
              <Num color={pal.green} size={20} glowColor={pal.green}>+2.0R</Num>
            </div>
            <div className="rounded-lg p-2 flex flex-col items-center" style={{ background: withAlpha(pal.red, 0.1), border: `1px solid ${withAlpha(pal.red, 0.35)}` }}>
              <Micro color={pal.red}>rules broken</Micro>
              <Num color={pal.red} size={20} glowColor={pal.red}>−2.4R</Num>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-center" style={{ color: pal.text }}>The strategy works. <span style={{ color: accent }}>Adherence</span> is the problem.</span>
        </div>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PORTFOLIO · NET WORTH — every account, one scoreboard, What If
   ═══════════════════════════════════════════════════════════════════════ */

const ACCTS = [
  { icon: Building2, name: "Funded · prop A", bal: "$101,240", lim: "daily loss", used: 22, whatif: "−$0 · no crypto" },
  { icon: Flame, name: "Challenge · prop B", bal: "$48,390", lim: "daily loss", used: 84, whatif: "−$0 · no crypto", alert: true },
  { icon: Landmark, name: "Personal broker", bal: "$8,090", lim: "none set", used: 0, whatif: "−$1,210 · BTC CFD" },
  { icon: Wallet, name: "Wallet", bal: "0.42 BTC", bal2: "$24,780", lim: "none", used: 0, whatif: "−$7,430 · spot" },
]

export function PortfolioScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [nw, setNw] = useState(reduce ? 182500 : 0)
  useEffect(() => {
    if (reduce) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1500)
      setNw(Math.round(182500 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])
  return (
    <Stage pal={pal} accent={accent} className="h-[340px] p-4 flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <Micro color={accent}>Net Worth · today · every rail</Micro>
          <Num color={pal.text} size={34} glowColor={accent}>${nw.toLocaleString("en-US")}</Num>
        </div>
        <div className="flex items-center gap-2">
          <Pill color={pal.green}>+$1,026 today</Pill>
          <Pill color={accent}>4 accounts · 1 view</Pill>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
        {ACCTS.map((a, i) => {
          const Icon = a.icon
          const c = a.used >= 80 ? pal.amber : a.used > 0 ? pal.green : pal.textGhost
          return (
            <motion.div key={a.name} className="grid grid-cols-[24px_1.2fr_1fr_1.4fr_1fr] items-center gap-3 rounded-lg px-3 py-1.5" style={{ background: pal.glassHi, border: `1px solid ${a.alert ? withAlpha(pal.amber, 0.5) : pal.glassEdge}` }} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.45, ease: DECK_EASE }}>
              <Icon style={{ width: 14, height: 14, color: pal.textDim }} />
              <span className="text-[11.5px] font-bold truncate" style={{ color: pal.text }}>{a.name}</span>
              <span className="flex items-baseline gap-1"><Num color={pal.text} size={12}>{a.bal}</Num>{a.bal2 && <span className="text-[9.5px]" style={{ color: pal.textGhost }}>{a.bal2}</span>}</span>
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] w-[62px] shrink-0" style={{ color: pal.textGhost }}>{a.lim}</span>
                <span className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: pal.glassEdge }}>
                  <motion.span className="block h-full rounded-full" style={{ background: c }} initial={reduce ? { width: `${a.used}%` } : { width: 0 }} animate={{ width: `${a.used}%` }} transition={{ delay: 0.6 + i * 0.12, duration: 0.7, ease: DECK_EASE }} />
                </span>
                {a.alert ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded shrink-0" style={{ color: pal.amber, background: withAlpha(pal.amber, 0.14) }}><Bell style={{ width: 9, height: 9 }} /> 84% · alert fired</span>
                ) : <Num color={pal.textGhost} size={10}>{a.used}%</Num>}
              </span>
              <span className="text-[10.5px] font-mono truncate text-right" style={{ color: a.whatif.startsWith("−$0") ? pal.textGhost : pal.red }}>{a.whatif}</span>
            </motion.div>
          )
        })}
      </div>
      <motion.div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: withAlpha(accent, 0.08), border: `1px solid ${withAlpha(accent, 0.35)}` }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
        <Micro color={accent}>What If</Micro>
        <span className="text-[12px] font-black" style={{ color: pal.text }}>BTC −30%</span>
        <ArrowRight style={{ width: 12, height: 12, color: pal.textGhost }} />
        <span className="text-[11.5px]" style={{ color: pal.textDim }}>net worth <Num color={pal.red} size={12}>−$8,640</Num> (−4.7%) · two accounts exposed · challenge untouched</span>
        <span className="ml-auto text-[10.5px] font-bold" style={{ color: accent }}>He runs the crash before the crash.</span>
      </motion.div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PROOF RECORD — AI Verified Track Record → Social Network
   ═══════════════════════════════════════════════════════════════════════ */

const STATS = [
  { k: "Forecasts", v: "214" },
  { k: "Hit rate", v: "61%" },
  { k: "Avg R", v: "+0.84" },
  { k: "Adherence", v: "88%" },
  { k: "Max DD", v: "−6.2%" },
]
const POSTS = [
  { who: "Marcus Reed", v: "61% · +0.84R", text: "Gold reclaimed 2,420. Long from the plan, half size into PPI.", meta: "forecast #215 · stamped 08:02" },
  { who: "Lena K.", v: "54% · +0.41R", text: "Week 6 of the rule streak. Adherence 91%. Small, boring, green.", meta: "Trade Review · auto-posted" },
  { who: "Dev T.", v: "48% · +0.12R", text: "Broke 'no size after loss' twice. DNA flagged it before I did.", meta: "Trading DNA · shared" },
]

export function ProofRecordScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_auto_1.15fr] gap-3 items-start">
        {/* profile */}
        <motion.div className="rounded-xl p-3 flex flex-col gap-2.5" style={{ background: pal.glassHi, border: `1px solid ${withAlpha(accent, 0.35)}` }} initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: DECK_EASE }}>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: withAlpha(accent, 0.16), border: `1px solid ${withAlpha(accent, 0.5)}` }}>
              <span className="text-[12px] font-black" style={{ color: accent }}>MR</span>
            </span>
            <div className="min-w-0">
              <div className="text-[12.5px] font-black truncate" style={{ color: pal.text }}>Marcus Reed</div>
              <div className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.12em]" style={{ color: pal.green }}><ShieldCheck style={{ width: 10, height: 10 }} /> KYC verified · one identity</div>
            </div>
          </div>
          <Micro color={accent}>AI Verified Track Record</Micro>
          <div className="grid grid-cols-1 gap-1.5">
            {STATS.map((s, i) => (
              <motion.div key={s.k} className="flex items-center justify-between rounded-md px-2 py-1" style={{ background: withAlpha(accent, 0.05) }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <span className="text-[11px] font-bold" style={{ color: pal.textDim }}>{s.k}</span>
                <span className="flex items-center gap-1.5">
                  <Num color={pal.text} size={12}>{s.v}</Num>
                  <Check style={{ width: 10, height: 10, color: pal.green }} aria-label="verified by system" />
                </span>
              </motion.div>
            ))}
          </div>
          <span className="text-[9.5px] italic mt-auto" style={{ color: pal.textGhost }}>Audited by the system. Not typed by the person. Not editable.</span>
        </motion.div>

        {/* arrow */}
        <div className="flex flex-col items-center justify-center gap-1 px-1">
          <Micro color={pal.textGhost}>proof</Micro>
          <motion.span animate={reduce ? undefined : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}><ArrowRight style={{ width: 18, height: 18, color: accent }} /></motion.span>
          <Micro color={pal.textGhost}>identity</Micro>
        </div>

        {/* feed */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0"><Rss style={{ width: 12, height: 12, color: accent, flexShrink: 0 }} /><Micro color={accent}>Social Network · a feed for money</Micro></div>
            <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap" style={{ color: pal.textGhost }}>no screenshots</span>
          </div>
          {POSTS.map((p, i) => (
            <motion.div key={p.who} className="rounded-xl px-3 py-2 flex flex-col gap-1 min-w-0" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.18, duration: 0.45, ease: DECK_EASE }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11.5px] font-black" style={{ color: pal.text }}>{p.who}</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded whitespace-nowrap" style={{ color: pal.green, background: withAlpha(pal.green, 0.12) }}><ShieldCheck style={{ width: 9, height: 9 }} /> {p.v}</span>
                <span className="ml-auto text-[9px] whitespace-nowrap" style={{ color: pal.textGhost }}>{p.meta}</span>
              </div>
              <span className="text-[11px] leading-snug" style={{ color: pal.textDim }}>{p.text}</span>
              <div className="flex items-center gap-3 text-[9.5px]" style={{ color: pal.textGhost }}><span className="inline-flex items-center gap-1"><Heart style={{ width: 9, height: 9 }} /> follow the record</span><span className="inline-flex items-center gap-1"><Users style={{ width: 9, height: 9 }} /> join the room</span></div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-[11.5px] rounded-lg px-3 py-1.5" style={{ background: withAlpha(accent, 0.08), border: `1px solid ${withAlpha(accent, 0.3)}`, color: pal.text }}>
        <span>Proof brings the next trader into</span><span className="font-black" style={{ color: accent }}>Community</span><span>→ he builds a record → the loop closes.</span>
        <X style={{ width: 0, height: 0 }} aria-hidden />
      </div>
    </Stage>
  )
}
