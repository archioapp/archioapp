"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT II · THE LOOP — the two clarity slides added in rev3
   loopintro · walkthrough
   ───────────────────────────────────────────────────────────────────────
   loopintro    "a trade is five decisions" — five plain questions
   walkthrough  one real trade (Tuesday 08:31, gold, CPI) walked through
                the five places, so the loss of context is literal
   ═══════════════════════════════════════════════════════════════════════ */

import { Fragment } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, RotateCcw, Hash, Brain, StickyNote, Receipt, BookOpen } from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"
import { CHAIN } from "./act-loop"

/* ═══════════════════════════════════════════════════════════════════════
   LOOP INTRO — five questions in the trader's own words
   ═══════════════════════════════════════════════════════════════════════ */

const QUESTIONS = [
  "What is happening?",
  "What do I think will happen?",
  "Should I take it — and how big?",
  "Did I do what I decided?",
  "What did I learn?",
]

export function LoopIntroScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="h-[300px] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Micro color={accent}>One trade · five decisions</Micro>
        <Micro color={pal.textGhost}>in the trader&apos;s own words</Micro>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch flex-1">
        {CHAIN.map((s, i) => (
          <Fragment key={s.key}>
            <motion.div
              className="rounded-2xl p-4 flex flex-col gap-3 min-w-0"
              style={{ background: pal.glassHi, border: `1px solid ${withAlpha(accent, 0.28)}` }}
              initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2 + i * 0.28, duration: 0.6, ease: DECK_EASE }}
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
                <s.icon style={{ width: 16, height: 16, color: accent }} />
              </span>
              <span className="text-[16px] font-black leading-tight tracking-tight text-pretty" style={{ color: pal.text }}>{QUESTIONS[i]}</span>
              <span className="mt-auto text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: pal.textGhost }}>
                {s.n} · {s.label}
              </span>
            </motion.div>
            {i < CHAIN.length - 1 && (
              <motion.div
                className="flex items-center px-1.5"
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.28, duration: 0.4 }}
              >
                <ArrowRight style={{ width: 16, height: 16, color: withAlpha(accent, 0.7) }} />
              </motion.div>
            )}
          </Fragment>
        ))}
      </div>
      <motion.div
        className="flex items-center justify-center gap-2 text-[12px]"
        style={{ color: pal.textDim }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <motion.span animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="inline-flex">
          <RotateCcw style={{ width: 13, height: 13, color: accent }} />
        </motion.span>
        Tomorrow he runs it again — with whatever he learned. Or didn&apos;t.
      </motion.div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   WALKTHROUGH — one trade, five places, read left to right
   ═══════════════════════════════════════════════════════════════════════ */

const WALK: {
  step: string
  place: string
  icon: typeof Hash
  time: string
  lines: { text: string; tone: "ok" | "bad" | "dim" }[]
}[] = [
  {
    step: "01 Context", place: "Discord · #gold-room", icon: Hash, time: "08:31",
    lines: [
      { text: "Marcus: Gold long above 2,410.", tone: "ok" },
      { text: "Invalid below 2,388.", tone: "ok" },
      { text: "HALF SIZE — CPI at 08:30.", tone: "ok" },
    ],
  },
  {
    step: "02 Thesis", place: "His head", icon: Brain, time: "08:31",
    lines: [
      { text: "\u201cHe\u2019s right.\u201d", tone: "ok" },
      { text: "\u201c…but I want more than half.\u201d", tone: "bad" },
      { text: "Never written down.", tone: "dim" },
    ],
  },
  {
    step: "03 Decision", place: "Rules note · never opened", icon: StickyNote, time: "08:32",
    lines: [
      { text: "Rule: 0.5% on news days.", tone: "ok" },
      { text: "Rule: no entries 08:15–08:45.", tone: "ok" },
      { text: "Decides: 1.5%. Now.", tone: "bad" },
    ],
  },
  {
    step: "04 Execution", place: "Broker ticket", icon: Receipt, time: "08:32:41",
    lines: [
      { text: "BUY XAUUSD 1.5 lots @ 2,411.20", tone: "bad" },
      { text: "SL 2,388 · TP 2,446", tone: "dim" },
      { text: "Recorded. Only this.", tone: "ok" },
    ],
  },
  {
    step: "05 Review", place: "Journal · 22:10", icon: BookOpen, time: "22:10",
    lines: [
      { text: "\u201cBad luck. Stop hunted.\u201d", tone: "bad" },
      { text: "Size not mentioned.", tone: "dim" },
      { text: "Rule not mentioned.", tone: "dim" },
    ],
  },
]

export function WalkthroughScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const tone = (t: "ok" | "bad" | "dim") => (t === "ok" ? pal.green : t === "bad" ? pal.red : pal.textGhost)
  return (
    <Stage pal={pal} accent={accent} className="h-[330px] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill color={pal.amber}>Tuesday · CPI day</Pill>
          <Micro color={pal.textGhost}>XAUUSD · one trader · one trade</Micro>
        </div>
        <Micro color={pal.textGhost}>green = what happened · red = the contradiction</Micro>
      </div>

      <div className="grid grid-cols-5 gap-2 flex-1 min-h-0">
        {WALK.map((w, i) => {
          const Icon = w.icon
          return (
            <motion.div
              key={w.step}
              className="rounded-xl p-3 flex flex-col gap-2 min-w-0 relative"
              style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.5, duration: 0.55, ease: DECK_EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{w.step}</span>
                <Num color={pal.textGhost} size={10}>{w.time}</Num>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: pal.textDim }}>
                <Icon style={{ width: 11, height: 11 }} /> <span className="truncate">{w.place}</span>
              </div>
              <div className="flex flex-col gap-1.5 mt-1">
                {w.lines.map((l, j) => (
                  <motion.div
                    key={l.text}
                    className="text-[11.5px] leading-snug"
                    style={{ color: tone(l.tone), fontWeight: l.tone === "bad" ? 800 : 500, fontStyle: l.tone === "dim" ? "italic" : "normal" }}
                    initial={reduce ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.5 + j * 0.16, duration: 0.4 }}
                  >
                    {l.text}
                  </motion.div>
                ))}
              </div>
              {i < WALK.length - 1 && (
                <span className="absolute -right-[9px] top-1/2 -translate-y-1/2 text-[10px] font-black" style={{ color: pal.red }} aria-hidden>✕</span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* what the broker keeps */}
      <motion.div
        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-4 py-2.5"
        style={{ background: withAlpha(pal.red, 0.06), border: `1px solid ${withAlpha(pal.red, 0.3)}` }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 0.5, ease: DECK_EASE }}
      >
        <Micro color={pal.red}>What survives the day</Micro>
        <span className="text-[12px] font-mono whitespace-nowrap" style={{ color: pal.text }}>
          XAUUSD · BUY 1.5 · 2,411.20 → 2,388.00 · 08:32 → 08:41 ·{" "}
          <span className="font-black" style={{ color: pal.red }}>−$800</span>
        </span>
        <span className="text-[11px] font-bold text-right max-w-[34ch] leading-snug" style={{ color: pal.textDim }}>The call, the rule, the size, the reason — <span style={{ color: pal.red }}>gone</span>.</span>
      </motion.div>
    </Stage>
  )
}

export const WALK_GLOW = glow
