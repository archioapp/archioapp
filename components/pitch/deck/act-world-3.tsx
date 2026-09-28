"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT I · THE STORY — one trader, one Tuesday, nine apps.
   This is the slide that makes every later problem slide land: the
   audience watches him move through his real tools, hour by hour, and
   sees exactly where each one drops the ball. Green = what the app is
   for. Red = what it silently loses.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  AtSign, Hash, CandlestickChart, Send, Building2, StickyNote, Bot, Calendar,
  X, ArrowRight, AlertTriangle, type LucideIcon,
} from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { Stage, Micro, Pill, Num, DECK_EASE, type SceneProps } from "./slide-frame"

interface Hour {
  t: string
  app: string
  icon: LucideIcon
  color: string
  /** what he does there — the app's honest job */
  does: string
  /** what the app cannot know / silently loses */
  loses: string
  /** which later problem slide this becomes */
  becomes: string
}

const DAY: Hour[] = [
  { t: "06:30", app: "X", icon: AtSign, color: "#E6EDF3", does: "Wakes up scrolling. Forty threads on gold. Three contradict each other. One has 40k likes and a cropped P&L.", loses: "No record on any account. Likes rank it, not results.", becomes: "01 Noise · 05 Screenshots" },
  { t: "07:15", app: "Discord", icon: Hash, color: "#7289FF", does: "Opens the mentor's server. The gameplan was posted at 06:00 in #daily — 212 messages ago. He scrolls up, finds half of it.", loses: "The call is buried. Nothing stamped. If he'd slept an hour more, gone.", becomes: "06 Lost calls" },
  { t: "07:50", app: "Calendar", icon: Calendar, color: "#F5C542", does: "Checks the news. CPI at 08:30. The mentor said 'half size on news days' — he remembers that part.", loses: "The rule lives in his memory, not in front of the ticket.", becomes: "02 Blind tools" },
  { t: "08:00", app: "TradingView", icon: CandlestickChart, color: "#3FB6F0", does: "Draws the levels from memory of the gameplan. 2,410 support, 2,388 invalidation. One of them is wrong.", loses: "The chart doesn't know the mentor, the rule, or the account.", becomes: "02 Blind tools" },
  { t: "08:29", app: "Telegram VIP", icon: Send, color: "#3FB6F0", does: "'GOLD BUY NOW 🚀 97% this month.' Second voice. He paid $149 for this one.", loses: "Unverified. Unrecorded. Twenty groups wear the same mentor's name.", becomes: "04 Fakes" },
  { t: "08:31", app: "Broker app", icon: Building2, color: "#F59E42", does: "Opens the ticket. Rules are in Notion — closed. 'I want more than half.' Buys 1.5 lots at 2,411.20.", loses: "The broker records the fill. Only the fill. Not the thesis, not the rule he broke, not the size he planned.", becomes: "08 The 90%" },
  { t: "08:41", app: "Broker app", icon: Building2, color: "#F59E42", does: "Stopped at 2,388. −$800.", loses: "One line in a statement. Why is nowhere.", becomes: "08 The 90%" },
  { t: "12:00", app: "ChatGPT", icon: Bot, color: "#A78BFA", does: "'Why did gold dump after CPI?' Gets a good answer about the market.", loses: "It has never seen his trade, his rule, or his mentor. It explains gold, not him.", becomes: "02 Blind tools" },
  { t: "22:10", app: "Notion", icon: StickyNote, color: "#E6EDF3", does: "Journal: 'Bad luck. Stop hunted.' Size not mentioned. Rule not mentioned.", loses: "Written after the result, by the person who lost. Hindsight is a terrible database.", becomes: "05 Screenshots · 08 The 90%" },
]

export function DayScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number>(5)
  const cur = DAY[open]

  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Pill color={pal.amber}>Tuesday · CPI day</Pill>
          <Micro color={pal.textGhost}>One trader · nine apps · read left to right</Micro>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: pal.green }}><span className="w-2 h-2 rounded-full" style={{ background: pal.green }} />what the app does</span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: pal.red }}><span className="w-2 h-2 rounded-full" style={{ background: pal.red }} />what it loses</span>
        </div>
      </div>

      {/* the day rail */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-[22px] h-px" style={{ background: `linear-gradient(90deg, ${withAlpha(pal.glassEdge, 0)}, ${pal.glassEdge} 8%, ${pal.glassEdge} 92%, ${withAlpha(pal.glassEdge, 0)})` }} aria-hidden />
        <div className="grid grid-cols-9 gap-1.5 relative">
          {DAY.map((h, i) => {
            const on = i === open
            const isLoss = h.t === "08:41"
            return (
              <motion.button
                key={h.t + h.app}
                type="button"
                onClick={() => setOpen(i)}
                className="flex flex-col items-center gap-1.5 rounded-xl px-1 pt-1 pb-2 text-center focus:outline-none"
                style={{ background: on ? withAlpha(h.color, 0.1) : "transparent", border: `1px solid ${on ? withAlpha(h.color, 0.55) : "transparent"}` }}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease: DECK_EASE }}
                aria-pressed={on}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                  style={{ background: withAlpha(isLoss ? pal.red : h.color, on ? 0.22 : 0.12), border: `1px solid ${withAlpha(isLoss ? pal.red : h.color, on ? 0.7 : 0.35)}`, boxShadow: on ? glow(isLoss ? pal.red : h.color, 0.5) : "none" }}
                >
                  {isLoss ? <X style={{ width: 16, height: 16, color: pal.red }} /> : <h.icon style={{ width: 16, height: 16, color: h.color }} />}
                </span>
                <Num color={on ? pal.text : pal.textGhost} size={10.5}>{h.t}</Num>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] leading-tight" style={{ color: on ? pal.text : pal.textDim }}>{h.app}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* the open hour */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={open}
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_auto] gap-3 rounded-2xl p-4"
          style={{ background: pal.glassHi, border: `1px solid ${withAlpha(cur.color, 0.4)}` }}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: DECK_EASE }}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: pal.green }} />
              <Micro color={pal.green}>{cur.t} · {cur.app} · what he does</Micro>
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: pal.text }}>{cur.does}</p>
          </div>
          <div className="flex flex-col gap-1.5 lg:border-l lg:pl-4" style={{ borderColor: pal.glassEdge }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: pal.red }} />
              <Micro color={pal.red}>what the app cannot know</Micro>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: pal.textDim }}>{cur.loses}</p>
          </div>
          <div className="flex flex-col items-start lg:items-end justify-between gap-2 lg:pl-3">
            <Micro color={pal.textGhost}>becomes</Micro>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.12em] px-2 py-1 rounded-md" style={{ color: pal.red, background: withAlpha(pal.red, 0.1), border: `1px solid ${withAlpha(pal.red, 0.35)}` }}>
              <AlertTriangle style={{ width: 11, height: 11 }} />{cur.becomes}
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => (o + 1) % DAY.length)}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] focus:outline-none"
              style={{ color: accent }}
            >
              next hour <ArrowRight style={{ width: 11, height: 11 }} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: withAlpha(pal.red, 0.06), border: `1px solid ${withAlpha(pal.red, 0.28)}` }}>
        <span className="text-[12px]" style={{ color: pal.text }}>
          Nine apps did their job. <span className="font-black" style={{ color: pal.red }}>Not one of them knew the other eight existed.</span> And tomorrow he does it again.
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap" style={{ color: pal.textGhost }}>the whole day · one Tuesday</span>
      </div>
    </Stage>
  )
}
