"use client"

/**
 * LIVE ROOM — Room intelligence
 *
 * Four lenses folded from the ledger, at INSTRUMENT density (the Flight
 * Deck's, not a document's):
 *
 *   ● glyph  TITLE ····································· HIGH
 *   12px reading — the mentor's WHY, live glossary terms
 *   › so-what — one italic line
 *   ENTRY ······ 2034.20   TARGET ······ 2042.00   (tight ledger)
 *   │ INVALIDATION 2036.00 · 15m close below
 *   FROM  thesis 2:43 · entry 2:39 · exit 2:42        ◌ 4m ago
 *
 * Nothing is clamped. Hover → its events light and its levels draw.
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Eye, AlertTriangle, Activity, Sparkles, X, GitCompare, type LucideIcon } from "lucide-react"
import { LR, lrMix, toneColor, type LrTone } from "./live-room-tokens"
import { LrPane, LrPaneHeader, LrRecess, LrEyebrow, LrChip, LrConfidence, LrFreshnessRing, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { EVENT_META, clockLabel, eventMatches, type Lens, type EventCategory } from "./session-state"
import { Prose, Meaning } from "./explain-term"
import { InvalidationLine, EvidenceChips } from "./trade-bits"
import { scrollToEvent } from "./phase-rail"

const GLYPH: Record<Lens["id"], LucideIcon> = {
  thesis: Target, watch: Eye, risk: AlertTriangle, behavior: Activity, catchup: Sparkles,
}

const EYEBROW: Record<Lens["id"], string> = {
  thesis: "Thesis", watch: "Watch", risk: "Risk", behavior: "Behavior", catchup: "Catch up",
}

function categoryOf(type: string): EventCategory {
  const meta = EVENT_META[type as keyof typeof EVENT_META]
  return (meta?.category[0] as EventCategory) ?? "all"
}

/** Two-column fact ledger: label left, value right, hairline between rows. */
function FactLedger({ facts }: { facts: Lens["facts"] }) {
  if (!facts.length) return null
  return (
    <dl className="m-0 grid gap-x-4" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
      {facts.slice(0, 4).map((f, i) => (
        <div key={f.label} className="flex items-baseline justify-between gap-2 min-w-0 py-[5px]" style={{ borderBottom: i < facts.length - (facts.length % 2 === 0 ? 2 : 1) ? `1px solid ${LR.recess.border}` : "none" }}>
          <dt className="font-mono uppercase shrink-0" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: LR.ashSoft }}>{f.label}</dt>
          <dd className="m-0 font-mono tabular-nums text-right truncate" style={{ fontSize: 11, color: f.tone ? toneColor(f.tone) : LR.paper }}>{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function LensCard({ lens, index }: { lens: Lens; index: number }) {
  const s = useSession()
  const reduce = useReducedMotion()
  const Glyph = GLYPH[lens.id]
  const tone: LrTone = lens.tone ?? "primary"
  const accent = toneColor(tone)
  const lit = s.hoveredLens === lens.id || s.activeLens === lens.id
  const active = s.activeLens === lens.id
  const stampEvent = lens.stampEventId ? s.events.find((e) => e.id === lens.stampEventId) : undefined
  const minutesSince = Math.max(0, s.viewMin - lens.stampAt)
  const stale = minutesSince >= 30 && s.phase === "execute"

  const onToggle = () => {
    const turningOn = s.activeLens !== lens.id
    s.dispatch({ type: "toggleLens", id: lens.id })
    if (turningOn && stampEvent) {
      s.focusEvent(stampEvent.id)
      const cat = categoryOf(stampEvent.type)
      s.dispatch({ type: "filter", filter: eventMatches(stampEvent, cat) ? cat : "all" })
      window.setTimeout(() => scrollToEvent(stampEvent.id), 60)
    } else {
      s.focusEvent(null)
      s.dispatch({ type: "filter", filter: "all" })
    }
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: lit ? -1 : 0, filter: "blur(0px)" }}
      transition={{ duration: LR.enter.duration, ease: LR.ease, delay: 0.05 * index }}
      className="min-w-0"
      style={{ opacity: stale && !lit ? 0.72 : 1 }}
    >
      <LrRecess
        tone={tone}
        lit={lit}
        thread={tone === "warn" || lit}
        interactive
        role="button"
        tabIndex={0}
        aria-pressed={active}
        aria-label={`${lens.title} — ${lens.confidence} confidence`}
        onClick={onToggle}
        onMouseEnter={() => s.dispatch({ type: "hoverLens", id: lens.id })}
        onMouseLeave={() => s.dispatch({ type: "hoverLens", id: null })}
        className="h-full flex flex-col gap-2.5 px-3 pt-2.5 pb-3"
      >
        {/* header row — Flight Deck capsule grammar */}
        <div className="flex items-center gap-2 min-w-0">
          <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: lrMix(accent, 0.8), boxShadow: `0 0 6px ${lrMix(accent, 0.55)}` }} />
          <Glyph size={11} strokeWidth={1.6} color={accent} className="shrink-0" />
          <span className="font-mono uppercase shrink-0" style={{ fontSize: 9, letterSpacing: "0.22em", color: accent, fontWeight: 500 }}>{EYEBROW[lens.id]}</span>
          <span aria-hidden className="flex-1 min-w-[12px] h-px" style={{ background: LR.dashed(lrMix(accent, lit ? 0.35 : 0.18)) }} />
          <LrConfidence level={lens.confidence} />
        </div>

        <span className="font-sans text-pretty" style={{ fontSize: 12.5, fontWeight: 500, color: LR.paper, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{lens.title}</span>

        <Prose text={lens.body} style={{ fontSize: 11.5, lineHeight: 1.5, color: LR.paperDim }} />
        {lens.meaning && <Meaning text={lens.meaning} size={11} />}

        {lens.alignment && (
          <LrChip tone={lens.alignment.state === "aligned" ? "up" : "warn"} active size={8.5} glyph={<GitCompare size={9} />} title={lens.alignment.reason} className="self-start">
            {lens.alignment.state} with your plan
          </LrChip>
        )}

        <FactLedger facts={lens.facts} />

        {lens.invalidation && <InvalidationLine inv={lens.invalidation} compact />}

        <div className="flex items-center gap-2 mt-auto pt-1 min-w-0">
          <EvidenceChips ids={lens.sourceIds} label="From" max={3} />
          <span className="ml-auto inline-flex items-center gap-1.5 shrink-0">
            <LrFreshnessRing minutes={minutesSince} tone={tone} />
            <span className="font-mono uppercase whitespace-nowrap" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: stale ? LR.ashGhost : LR.ashSoft }}>
              {stampEvent ? `${clockLabel(stampEvent.at)}` : "—"}
            </span>
            {active && <LrEyebrow tone="primary" size={8.5}>pinned</LrEyebrow>}
          </span>
        </div>
      </LrRecess>
    </motion.div>
  )
}

function CatchUpLens({ lens }: { lens: Lens }) {
  const s = useSession()
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, filter: "blur(6px)", height: 0 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", height: "auto" }}
      exit={{ opacity: 0, y: -6, filter: "blur(4px)", height: 0 }}
      transition={{ duration: 0.38, ease: LR.ease }}
      className="overflow-hidden"
    >
      <LrRecess tone="primary" thread lit className="px-3 pt-2.5 pb-3 flex flex-col gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: LR.primary, boxShadow: `0 0 6px ${LR.primary}` }} />
          <Sparkles size={11} strokeWidth={1.6} color={LR.primary} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: LR.primary, fontWeight: 500 }}>Catch me up</span>
          <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed(lrMix(LR.primary, 0.3)) }} />
          <LrEyebrow size={8.5} weight={500}>{clockLabel(lens.stampAt)} · {lens.sourceIds.length} events</LrEyebrow>
          <button type="button" aria-label="Dismiss summary" onClick={() => s.dispatch({ type: "dismissCatchUp" })} className="inline-flex items-center justify-center rounded-md focus:outline-none" style={{ width: 20, height: 20, color: LR.ashSoft, border: `1px solid ${LR.recess.border}` }}>
            <X size={10} />
          </button>
        </div>
        <ol className="m-0 p-0 flex flex-col gap-1" style={{ listStyle: "none" }}>
          {lens.bullets?.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 8.5, color: LR.primary, letterSpacing: "0.16em", marginTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="font-sans text-pretty" style={{ fontSize: 11.5, lineHeight: 1.45, color: LR.paperDim }}>{b}</span>
            </li>
          ))}
        </ol>
      </LrRecess>
    </motion.div>
  )
}

export function IntelligenceLenses({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const catchup = s.lenses.find((l) => l.id === "catchup")
  const grid = s.lenses.filter((l) => l.id !== "catchup")
  return (
    <LrPane labelledBy="lr-intel-title" delay={delay}>
      <LrPaneHeader id="lr-intel-title" eyebrow="Room intelligence" hint={`from ${s.knownEvents.length} events${s.replaying ? ` · as of ${clockLabel(s.viewMin)}` : ""}`} count={grid.length} />
      <div className="px-3 pb-3">
        <AnimatePresence initial={false}>{catchup && <CatchUpLens key="catchup" lens={catchup} />}</AnimatePresence>
        <div className="lr-lens-grid grid gap-2.5">
          {grid.map((l, i) => <LensCard key={l.id} lens={l} index={i} />)}
        </div>
      </div>
    </LrPane>
  )
}
