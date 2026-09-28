"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT II · THE LOOP
   loop · record · eighthundred · hindsight · genericai
   ───────────────────────────────────────────────────────────────────────
   The diagnosis. Every trader runs CONTEXT → THESIS → DECISION →
   EXECUTION → REVIEW without knowing it. Today each step lives in a
   different place and the context dies at every arrow. These five
   visuals make that loss visible, one angle at a time.
   ═══════════════════════════════════════════════════════════════════════ */

import { Fragment } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Eye, Lightbulb, ClipboardList, MousePointerClick, RotateCcw,
  X, Check, Lock, Clock, type LucideIcon,
} from "lucide-react"
import { type HoloPalette, withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, Num, DECK_EASE } from "./slide-frame"

/* ── the loop itself — shared by Act II and Act III ─────────────────── */
export const CHAIN: { key: string; n: string; label: string; plain: string; today: string; icon: LucideIcon }[] = [
  { key: "context", n: "01", label: "Context", plain: "What I saw", today: "Discord · X · TradingView", icon: Eye },
  { key: "thesis", n: "02", label: "Thesis", plain: "What I believed", today: "In his head", icon: Lightbulb },
  { key: "decision", n: "03", label: "Decision", plain: "What I planned to do", today: "In his head", icon: ClipboardList },
  { key: "execution", n: "04", label: "Execution", plain: "What I actually did", today: "The broker", icon: MousePointerClick },
  { key: "review", n: "05", label: "Review", plain: "What I should learn", today: "Notion — or nowhere", icon: RotateCcw },
]

/* ═══════════════════════════════════════════════════════════════════════
   LOOP — five steps, five places, context dies at every arrow
   ═══════════════════════════════════════════════════════════════════════ */

export function LoopScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Micro color={accent}>The loop · every trader · every day</Micro>
        <Micro color={pal.textGhost}>where each step lives today</Micro>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 lg:gap-0 items-stretch">
        {CHAIN.map((s, i) => (
          <Fragment key={s.key}>
            <motion.div
              className="rounded-2xl p-4 flex flex-col gap-2 min-w-0"
              style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.16, duration: 0.55, ease: DECK_EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.38)}` }}>
                  <s.icon style={{ width: 15, height: 15, color: accent }} />
                </span>
                <Num color={pal.textGhost} size={11}>{s.n}</Num>
              </div>
              <span className="text-[15px] font-black tracking-tight uppercase" style={{ color: pal.text, letterSpacing: "0.04em" }}>{s.label}</span>
              <span className="text-[13px] italic leading-snug" style={{ color: pal.textDim }}>&ldquo;{s.plain}&rdquo;</span>
              <span className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-[0.12em] leading-snug" style={{ color: pal.textGhost, borderTop: `1px dashed ${pal.glassEdge}` }}>
                {s.today}
              </span>
              <motion.span
                className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.14em] px-1.5 py-0.5 rounded self-start"
                style={s.key === "execution"
                  ? { color: pal.green, background: withAlpha(pal.green, 0.14) }
                  : { color: pal.red, background: withAlpha(pal.red, 0.1) }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 + i * 0.1, duration: 0.4 }}
              >
                {s.key === "execution" ? <Check style={{ width: 9, height: 9 }} /> : <X style={{ width: 9, height: 9 }} />}
                {s.key === "execution" ? "recorded · by the broker" : "not recorded"}
              </motion.span>
            </motion.div>
            {i < CHAIN.length - 1 && <BrokenArrow pal={pal} delay={0.9 + i * 0.22} />}
          </Fragment>
        ))}
      </div>

      <motion.div
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
        style={{ background: withAlpha(pal.red, 0.07), border: `1px solid ${withAlpha(pal.red, 0.3)}` }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.5, ease: DECK_EASE }}
      >
        <span className="text-[13.5px] font-bold" style={{ color: pal.text }}>
          Five steps. Five places. Nothing carries from one step to the next.
        </span>
        <Pill color={pal.red}>Tomorrow starts over</Pill>
      </motion.div>
    </Stage>
  )
}

function BrokenArrow({ pal, delay }: { pal: HoloPalette; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative flex items-center justify-center h-8 lg:h-auto lg:w-[64px] shrink-0">
      <motion.span
        className="hidden lg:block absolute left-1 right-1 top-1/2 h-px"
        style={{ background: `repeating-linear-gradient(90deg, ${withAlpha(pal.red, 0.6)} 0 5px, transparent 5px 9px)` }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        aria-hidden
      />
      <motion.span
        className="lg:hidden absolute top-1 bottom-1 left-1/2 w-px"
        style={{ background: `repeating-linear-gradient(180deg, ${withAlpha(pal.red, 0.6)} 0 5px, transparent 5px 9px)` }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        aria-hidden
      />
      <motion.span
        className="relative w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: pal.bgDeep, border: `1px solid ${withAlpha(pal.red, 0.65)}`, boxShadow: glow(pal.red, 0.4) }}
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.18, type: "spring", stiffness: 320, damping: 18 }}
      >
        <X style={{ width: 11, height: 11, color: pal.red }} />
      </motion.span>
      <motion.span
        className="hidden lg:block absolute top-[calc(50%+15px)] text-[8.5px] font-bold uppercase tracking-[0.14em] whitespace-nowrap"
        style={{ color: withAlpha(pal.red, 0.85) }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.35 }}
      >
        context dies
      </motion.span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   RECORD — the broker's record vs the decision's record
   ═══════════════════════════════════════════════════════════════════════ */

const BROKER_ROWS: [string, string, boolean?][] = [
  ["Instrument", "XAU/USD"],
  ["Entry", "2,318.40"],
  ["Exit", "2,309.10"],
  ["Size", "0.50 lot"],
  ["Time", "10:42:07"],
  ["P&L", "−$465", true],
]

const DECISION_ROWS = [
  "Why did he enter?",
  "What was his thesis?",
  "Was his mentor bullish too?",
  "Had he hit his daily limit?",
  "Planned 0.5% — what did he risk?",
  "Bad trade, or bad execution?",
]

export function RecordScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* what the broker has */}
        <motion.div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: pal.glassHi, border: `1px solid ${withAlpha(accent, 0.4)}` }}
          initial={reduce ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: DECK_EASE }}
        >
          <div className="flex items-center justify-between gap-2">
            <Micro color={accent}>The broker&rsquo;s record</Micro>
            <Pill color={accent}>Complete</Pill>
          </div>
          <div className="flex flex-col">
            {BROKER_ROWS.map(([k, v, red], i) => (
              <motion.div
                key={k}
                className="flex items-center justify-between py-1.5"
                style={{ borderBottom: i < BROKER_ROWS.length - 1 ? `1px solid ${pal.glassEdge}` : "none" }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.07 }}
              >
                <span className="text-[12px]" style={{ color: pal.textDim }}>{k}</span>
                <Num color={red ? pal.red : pal.text} size={13}>{v}</Num>
              </motion.div>
            ))}
          </div>
          <div className="mt-auto rounded-lg px-3 py-2 text-center" style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.3)}` }}>
            <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>What happened</span>
          </div>
        </motion.div>

        {/* what nobody has */}
        <motion.div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: withAlpha(pal.red, 0.05), border: `1px dashed ${withAlpha(pal.red, 0.5)}` }}
          initial={reduce ? false : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: DECK_EASE }}
        >
          <div className="flex items-center justify-between gap-2">
            <Micro color={pal.red}>The decision&rsquo;s record</Micro>
            <Pill color={pal.red}>Does not exist</Pill>
          </div>
          <div className="flex flex-col">
            {DECISION_ROWS.map((q, i) => (
              <motion.div
                key={q}
                className="flex items-center justify-between gap-3 py-1.5"
                style={{ borderBottom: i < DECISION_ROWS.length - 1 ? `1px solid ${withAlpha(pal.red, 0.16)}` : "none" }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.09 }}
              >
                <span className="text-[12px]" style={{ color: pal.text }}>{q}</span>
                <span className="shrink-0 w-14 h-4 rounded" style={{ border: `1px dashed ${withAlpha(pal.red, 0.45)}` }} aria-label="no record" />
              </motion.div>
            ))}
          </div>
          <div className="mt-auto rounded-lg px-3 py-2 text-center" style={{ background: withAlpha(pal.red, 0.1), border: `1px solid ${withAlpha(pal.red, 0.3)}` }}>
            <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: pal.red }}>Why</span>
          </div>
        </motion.div>
      </div>

      <motion.p
        className="mt-3 text-center text-[13px] font-bold"
        style={{ color: pal.text }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Same trade. One side is complete. The other side was never written down.
        <span style={{ color: pal.textDim, fontWeight: 500 }}> Those are completely different questions.</span>
      </motion.p>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   −$800 — the rules he knew · what he did · what the account says
   ═══════════════════════════════════════════════════════════════════════ */

const RULES = ["Max 3 trades a day", "Risk 0.5% per trade", "No size-up after a loss", "A+ setups only", "Wait for confirmation"]
const BREAKS = ["Trade 4", "Trade 5", "Size doubled", "Entered early", "Moved the stop"]
const CAUSES: [string, string][] = [
  ["Strategy was wrong", "fix the strategy"],
  ["Market was abnormal", "fix nothing"],
  ["He abandoned his own process", "fix the trader"],
]

export function EightHundredScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const col = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: DECK_EASE },
  })
  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr] gap-3">
        {/* he knew */}
        <motion.div {...col(0.15)} className="rounded-2xl p-4 flex flex-col gap-2.5" style={{ background: pal.glassHi, border: `1px solid ${withAlpha(pal.green, 0.35)}` }}>
          <div className="flex items-center justify-between">
            <Micro color={pal.green}>The rules he wrote</Micro>
            <Pill color={pal.green}>He knew</Pill>
          </div>
          {RULES.map((r, i) => (
            <motion.div key={r} className="flex items-center gap-2" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.07 }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: withAlpha(pal.green, 0.14), border: `1px solid ${withAlpha(pal.green, 0.45)}` }}>
                <Check style={{ width: 10, height: 10, color: pal.green }} />
              </span>
              <span className="text-[12.5px]" style={{ color: pal.text }}>{r}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* he did */}
        <motion.div {...col(0.45)} className="rounded-2xl p-4 flex flex-col gap-2.5" style={{ background: withAlpha(pal.red, 0.05), border: `1px solid ${withAlpha(pal.red, 0.4)}` }}>
          <div className="flex items-center justify-between">
            <Micro color={pal.red}>What he did · 2:10 pm</Micro>
            <Pill color={pal.red}>Emotion</Pill>
          </div>
          {BREAKS.map((b, i) => (
            <motion.div key={b} className="flex items-center gap-2" initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: withAlpha(pal.red, 0.14), border: `1px solid ${withAlpha(pal.red, 0.5)}` }}>
                <X style={{ width: 10, height: 10, color: pal.red }} />
              </span>
              <span className="text-[12.5px]" style={{ color: pal.text }}>{b}</span>
              <span className="ml-auto text-[10px] line-through" style={{ color: pal.textGhost }}>{RULES[i].split(" ").slice(0, 3).join(" ")}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* the account */}
        <motion.div {...col(0.8)} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }}>
          <Micro color={pal.textDim}>What the account says</Micro>
          <div className="flex items-end gap-3">
            <Num color={pal.red} size={44} glowColor={pal.red}>−$800</Num>
            <span className="pb-2 text-[11px] leading-snug" style={{ color: pal.textDim }}>one number<br />three possible causes</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {CAUSES.map(([c, fix], i) => (
              <motion.div
                key={c}
                className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5"
                style={{ background: withAlpha(pal.bgDeep, 0.5), border: `1px solid ${pal.glassEdge}` }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15 + i * 0.12 }}
              >
                <span className="text-[12px]" style={{ color: pal.text }}>{c}?</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap" style={{ color: i === 2 ? accent : pal.textGhost }}>→ {fix}</span>
              </motion.div>
            ))}
          </div>
          <span className="text-[11.5px] font-bold" style={{ color: pal.text }}>Three different corrections. The account cannot tell them apart.</span>
        </motion.div>
      </div>

      {/* adherence */}
      <motion.div
        className="mt-3 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
        style={{ background: withAlpha(accent, 0.07), border: `1px solid ${withAlpha(accent, 0.3)}` }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5, ease: DECK_EASE }}
      >
        <div className="flex items-center gap-3 sm:w-[300px] shrink-0">
          <Micro color={accent}>Followed his plan</Micro>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: withAlpha(pal.text, 0.08) }}>
            <motion.div className="h-full rounded-full" style={{ background: accent, boxShadow: glow(accent, 0.5) }} initial={reduce ? false : { width: 0 }} animate={{ width: "60%" }} transition={{ delay: 1.8, duration: 0.9, ease: DECK_EASE }} />
          </div>
          <Num color={accent} size={14}>60%</Num>
        </div>
        <span className="text-[13px] font-bold" style={{ color: pal.text }}>
          A profitable strategy followed 60% of the time looks exactly like a losing strategy.
        </span>
      </motion.div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HINDSIGHT — journaling after the outcome rewrites the story
   ═══════════════════════════════════════════════════════════════════════ */

export function HindsightScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const cell = (label: string, sub: string, hot: boolean, color: string) => (
    <div className="rounded-xl px-3 py-2 flex flex-col gap-0.5 min-h-[52px]" style={{ background: hot ? withAlpha(color, 0.12) : pal.glassHi, border: `1px solid ${hot ? withAlpha(color, 0.55) : pal.glassEdge}`, boxShadow: hot ? glow(color, 0.25) : "none" }}>
      <span className="text-[12.5px] font-black" style={{ color: hot ? color : pal.text }}>{label}</span>
      <span className="text-[10.5px] leading-snug" style={{ color: pal.textDim }}>{sub}</span>
    </div>
  )
  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* two journal entries, written after the fact */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <Micro color={pal.textGhost}>Journal · written after the result</Micro>
          <motion.div className="rounded-2xl px-4 py-3 flex flex-col gap-1" style={{ background: withAlpha(pal.red, 0.05), border: `1px solid ${withAlpha(pal.red, 0.35)}` }} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: DECK_EASE }}>
            <div className="flex items-center justify-between">
              <Pill color={pal.red}>After a loss</Pill>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: pal.textGhost }}><Clock style={{ width: 10, height: 10 }} /> 4:30 pm</span>
            </div>
            <span className="text-[15px] font-bold italic" style={{ color: pal.text }}>&ldquo;I knew that setup wasn&rsquo;t great.&rdquo;</span>
            <span className="text-[11.5px]" style={{ color: pal.textDim }}>Did he know that at 10:42? There is no record of what he believed then.</span>
          </motion.div>
          <motion.div className="rounded-2xl px-4 py-3 flex flex-col gap-1" style={{ background: withAlpha(pal.green, 0.05), border: `1px solid ${withAlpha(pal.green, 0.35)}` }} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease: DECK_EASE }}>
            <div className="flex items-center justify-between">
              <Pill color={pal.green}>After a win</Pill>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: pal.textGhost }}><Clock style={{ width: 10, height: 10 }} /> 4:31 pm</span>
            </div>
            <span className="text-[15px] font-bold italic" style={{ color: pal.text }}>&ldquo;Exactly according to plan.&rdquo;</span>
            <span className="text-[11.5px]" style={{ color: pal.textDim }}>Was it? Or did a terrible trade happen to work?</span>
          </motion.div>
        </div>

        {/* decision × outcome */}
        <motion.div className="lg:col-span-7 rounded-2xl p-4 flex flex-col gap-3" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}` }} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5, ease: DECK_EASE }}>
          <div className="flex items-center justify-between gap-2">
            <Micro color={accent}>Decision × outcome</Micro>
            <span className="text-[10.5px]" style={{ color: pal.textDim }}>P&amp;L alone grades the two lit cells wrong</span>
          </div>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 items-stretch">
            <span />
            <Micro color={pal.green} className="text-center">Won</Micro>
            <Micro color={pal.red} className="text-center">Lost</Micro>
            <Micro color={pal.text} className="self-center pr-1">Good decision</Micro>
            {cell("Deserved", "keep doing it", false, pal.green)}
            {cell("Variance", "perfect execution, lost — do it again", true, accent)}
            <Micro color={pal.text} className="self-center pr-1">Bad decision</Micro>
            {cell("Luck", "terrible trade that worked — it will bleed you", true, pal.amber)}
            {cell("Deserved", "the lesson is real", false, pal.red)}
          </div>
          <motion.div
            className="rounded-xl px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-1"
            style={{ background: withAlpha(accent, 0.09), border: `1px solid ${withAlpha(accent, 0.35)}` }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Lock style={{ width: 12, height: 12, color: accent }} />
            <span className="text-[12px] font-bold" style={{ color: pal.text }}>Stamp before the outcome:</span>
            {["forecast", "rules", "risk"].map((t) => (
              <Pill key={t} color={accent}>{t}</Pill>
            ))}
            <span className="text-[11.5px]" style={{ color: pal.textDim }}>then compare said vs did.</span>
          </motion.div>
        </motion.div>
      </div>
    </Stage>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   GENERIC AI — market questions (commodity) vs personal questions (need history)
   ═══════════════════════════════════════════════════════════════════════ */

const GENERIC_Q = ["What do you think about gold?", "Explain RSI.", "Analyze EUR/USD.", "What happened after CPI?"]
const PERSONAL_Q = [
  "Why do I keep losing?",
  "Which rule do I break most?",
  "Do I perform worse after a loss?",
  "Am I better in the morning or the afternoon?",
  "Do I size up when I'm emotional?",
  "Which setups work when I actually follow my plan?",
]

export function GenericAiScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.25fr] gap-3">
        {/* any AI */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Micro color={pal.textGhost}>Any AI answers</Micro>
            <Pill color={pal.textGhost}>Commodity</Pill>
          </div>
          {GENERIC_Q.map((q, i) => (
            <motion.div
              key={q}
              className="rounded-xl px-3 py-2 flex items-center justify-between gap-2"
              style={{ background: withAlpha(pal.text, 0.03), border: `1px solid ${pal.glassEdge}` }}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span className="text-[12px]" style={{ color: pal.textDim }}>{q}</span>
              <Check style={{ width: 12, height: 12, color: pal.textGhost, flexShrink: 0 }} />
            </motion.div>
          ))}
          <span className="mt-auto text-[11px] leading-snug" style={{ color: pal.textGhost }}>Market intelligence. Free, everywhere, and not the problem.</span>
        </div>

        {/* only with your history */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Micro color={accent}>The questions that matter</Micro>
            <Pill color={accent}>Need your history</Pill>
          </div>
          {PERSONAL_Q.map((q, i) => (
            <motion.div
              key={q}
              className="rounded-xl px-3 py-2 flex items-center justify-between gap-2"
              style={{ background: withAlpha(accent, 0.07), border: `1px solid ${withAlpha(accent, 0.35)}` }}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.09 }}
            >
              <span className="text-[12.5px] font-bold" style={{ color: pal.text }}>{q}</span>
              <Lock style={{ width: 12, height: 12, color: accent, flexShrink: 0 }} />
            </motion.div>
          ))}
          <motion.div
            className="mt-1 flex flex-wrap items-center gap-1.5"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Micro color={pal.textDim}>Needs</Micro>
            {["your trades", "your rules", "your decisions", "what you repeat"].map((t) => (
              <Pill key={t} color={accent}>{t}</Pill>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.p
        className="mt-3 text-center text-[13px] font-bold"
        style={{ color: pal.text }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Nobody has that history.
        <span style={{ color: pal.textDim, fontWeight: 500 }}> A structured record of the trader is the asset — not the model.</span>
      </motion.p>
    </Stage>
  )
}
