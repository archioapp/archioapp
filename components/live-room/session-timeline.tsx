"use client"

/**
 * LIVE ROOM — Session timeline
 *
 * The ledger, newest first. Every card carries the copy contract:
 *   eyebrow   type · instrument · side · mentor
 *   title     WHAT
 *   body      WHY  — the mentor's reasoning with live glossary terms
 *             (long reasoning folds to three lines with a "read" toggle)
 *   meaning   SO WHAT — one italic line
 *   strata    confluence, on level calls
 *   facts     the numbers
 *   invalidation  the red hairline
 *   evidence  the events this one stands on
 *
 * While replaying, events after the cutoff render ghosted under a
 * "not yet" divider so the viewer sees exactly what the room did not know.
 */

import * as React from "react"
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion"
import {
  Crown, ChevronDown, Flag, ArrowRight, Crosshair, Lightbulb, Layers, AlertTriangle, Compass, Users, Zap,
  ArrowUpRight, ArrowDownRight, Radio, Sparkles, MessageSquare, EyeOff, type LucideIcon,
} from "lucide-react"
import { LR, lrMix, toneColor, type LrTone } from "./live-room-tokens"
import { LrPane, LrPaneHeader, LrRecess, LrEyebrow, LrChip, LrLiveDot, useReducedMotion } from "./live-room-primitives"
import { LrCapsule, LrCapsuleStrip } from "./lr-capsule"
import { useSession } from "./session-store"
import { EVENT_META, PHASES, clockLabel, agoLabel, eventMatches, eventTone, type SessionEvent, type EventCategory, type SessionEventType } from "./session-state"
import { Prose, Meaning } from "./explain-term"
import { ConfluenceStrata, InvalidationLine, EvidenceChips } from "./trade-bits"

const GLYPH: Record<SessionEventType, LucideIcon> = {
  system: Radio, "mode-change": Layers, "focus-change": Crosshair, "thesis-update": Lightbulb, "level-call": Flag,
  warning: AlertTriangle, "bias-shift": Compass, "audience-milestone": Users, "key-moment": Zap,
  entry: ArrowUpRight, exit: ArrowDownRight, "forecast-published": Sparkles,
}

const FILTERS: { id: EventCategory; label: string }[] = [
  { id: "all", label: "All" }, { id: "mentor", label: "Mentor" }, { id: "trades", label: "Trades" }, { id: "levels", label: "Levels" }, { id: "warnings", label: "Warnings" },
]

/* ── AnimatedNumber — the P&L rolls, nothing else moves ─────────────── */
function AnimatedMoney({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const [txt, setTxt] = React.useState(() => fmt(value))
  const reduce = useReducedMotion()
  React.useEffect(() => {
    if (reduce) { setTxt(fmt(value)); return }
    const c = animate(mv, value, { duration: 0.9, ease: LR.easeOut, onUpdate: (v) => setTxt(fmt(v)) })
    return () => c.stop()
  }, [value, mv, reduce])
  return <>{txt}</>
}
const fmt = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(Math.round(v)).toLocaleString()}`

/* ── Event node — 26px recess square with the glyph, tone by meaning ── */
function EventNode({ e, lit, fresh, ghost }: { e: SessionEvent; lit: boolean; fresh: boolean; ghost: boolean }) {
  const tone = eventTone(e)
  const c = toneColor(tone)
  const Glyph = GLYPH[e.type]
  const reduce = useReducedMotion()
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: 26, height: 26 }}>
      {fresh && !reduce && (
        <motion.span aria-hidden className="absolute inset-[-3px] rounded-[10px]" style={{ border: `1px solid ${c}` }}
          initial={{ opacity: 0.9, scale: 0.7 }} animate={{ opacity: 0, scale: 1.5 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      )}
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 26, height: 26, borderRadius: 8,
          background: lit ? lrMix(c, 0.18) : LR.recess.bg,
          border: `1px ${ghost ? "dashed" : "solid"} ${lit ? lrMix(c, 0.6) : lrMix(c, tone === "neutral" ? 0.18 : 0.3)}`,
          color: tone === "neutral" ? LR.ash : c,
          boxShadow: lit ? `0 0 10px ${lrMix(c, 0.3)}` : "none",
          transition: "background 300ms ease, border-color 300ms ease, box-shadow 400ms ease",
        }}
      >
        <Glyph size={12} strokeWidth={2} />
      </span>
    </span>
  )
}

/* ── Event card ─────────────────────────────────────────────────────── */
function EventCard({ e, ghost = false }: { e: SessionEvent; ghost?: boolean }) {
  const s = useSession()
  const reduce = useReducedMotion()
  const tone = eventTone(e)
  const meta = EVENT_META[e.type]
  const lit = s.litEvents.has(e.id) || s.hoveredEvent === e.id
  const focused = s.focusedEvent === e.id
  const fresh = s.fresh.includes(e.id)
  const ago = agoLabel(e.at, s.viewMin)
  const reactions = e.reactions ?? 0
  const cardTone: LrTone = tone === "neutral" ? "primary" : tone
  const longBody = (e.body?.length ?? 0) > 170
  const [openBody, setOpenBody] = React.useState(false)
  const showFull = !longBody || openBody || focused

  return (
    <motion.li
      data-lr-event={e.id}
      className="relative flex gap-3 min-w-0"
      aria-hidden={ghost || undefined}
      initial={fresh && !reduce ? { opacity: 0, y: 6, filter: "blur(6px)" } : false}
      animate={{ opacity: ghost ? 0.38 : 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: LR.ease, delay: fresh ? 0.25 : 0 }}
    >
      {/* gutter */}
      <div className="lr-gutter flex flex-col items-center shrink-0" style={{ width: 44 }}>
        <span className="font-mono tabular-nums" style={{ fontSize: 9, color: LR.ashSoft, letterSpacing: "0.08em", height: 14 }}>{ghost ? "+" + Math.round(e.at - s.viewMin) + "m" : ago}</span>
        <EventNode e={e} lit={lit || focused} fresh={fresh} ghost={ghost} />
        <span aria-hidden className="flex-1 w-px my-1" style={{ background: LR.dashedV(), minHeight: 12 }} />
      </div>

      {/* card */}
      <div className="flex-1 min-w-0 pb-3">
        <LrRecess
          tone={cardTone}
          lit={lit || focused}
          thread={lit || focused || e.importance >= 5}
          interactive={!ghost}
          role={ghost ? undefined : "button"}
          tabIndex={ghost ? -1 : 0}
          aria-pressed={ghost ? undefined : focused}
          aria-label={`${meta.label} at ${clockLabel(e.at)}: ${e.title}`}
          onClick={ghost ? undefined : () => s.focusEvent(focused ? null : e.id)}
          onMouseEnter={() => s.dispatch({ type: "hoverEvent", id: e.id })}
          onMouseLeave={() => s.dispatch({ type: "hoverEvent", id: null })}
          className="px-3 pt-2.5 pb-2.5 flex flex-col gap-2"
          style={ghost ? { borderStyle: "dashed" } : undefined}
        >
          {/* header — capsule grammar: ● TYPE · XAU/USD · long ·········· 2:39 PM */}
          <div className="flex items-center gap-2 min-w-0">
            <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: tone === "neutral" ? lrMix(LR.ashSoft, 0.7) : lrMix(toneColor(tone), 0.85), boxShadow: tone === "neutral" ? "none" : `0 0 6px ${lrMix(toneColor(tone), 0.5)}` }} />
            <span className="font-mono uppercase shrink-0" style={{ fontSize: 9, letterSpacing: "0.22em", color: tone === "neutral" ? LR.ashSoft : toneColor(tone), fontWeight: 500 }}>{meta.label}</span>
            {e.instrument && <span className="font-mono shrink-0" style={{ fontSize: 9.5, color: LR.paperDim, letterSpacing: "0.02em" }}>{e.instrument}</span>}
            {e.direction && e.direction !== "neutral" && (
              <span className="font-mono uppercase shrink-0" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: e.direction === "bullish" ? LR.up : LR.down }}>{e.direction === "bullish" ? "long" : "short"}</span>
            )}
            {e.mentor && <Crown size={10} style={{ color: LR.primary }} aria-label="Mentor" className="shrink-0" />}
            {e.sourceMessageId && <MessageSquare size={10} style={{ color: LR.ashSoft }} aria-label="Pinned from discussion" className="shrink-0" />}
            {ghost && <LrChip tone="warn" size={8.5} glyph={<EyeOff size={9} />} style={{ padding: "2px 6px" }}>not yet</LrChip>}
            <span aria-hidden className="flex-1 min-w-[10px] h-px" style={{ background: LR.dashed(lrMix(tone === "neutral" ? LR.ashSoft : toneColor(tone), lit || focused ? 0.35 : 0.16)) }} />
            <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 9, color: LR.ashSoft, letterSpacing: "0.06em" }}>{clockLabel(e.at)}</span>
          </div>

          <p className="font-sans m-0 text-pretty" style={{ fontSize: 12.5, lineHeight: 1.3, color: LR.paper, fontWeight: 500, letterSpacing: "-0.005em" }}>{e.title}</p>

          {e.body && (
            <div className="relative min-w-0">
              <Prose
                text={e.body}
                tone="dim"
                style={{
                  fontSize: 11.5, lineHeight: 1.5, color: LR.paperDim,
                  ...(showFull ? {} : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }),
                }}
              />
              {!showFull && <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-4" style={{ background: `linear-gradient(180deg, transparent, ${lrMix(LR.pane.bgDeep, 0.9)})` }} />}
              {longBody && !focused && !ghost && (
                <button
                  type="button"
                  onClick={(ev) => { ev.stopPropagation(); setOpenBody((o) => !o) }}
                  className="mt-1 inline-flex items-center gap-1.5 font-mono uppercase focus:outline-none"
                  style={{ fontSize: 8.5, letterSpacing: "0.18em", color: LR.primary, fontWeight: 500, background: "transparent", border: "none", padding: 0 }}
                >
                  <span aria-hidden className="inline-block rounded-full" style={{ width: 3, height: 3, background: LR.primary }} />
                  {openBody ? "less" : "read the reasoning"}
                </button>
              )}
            </div>
          )}

          {e.meaning && <Meaning text={e.meaning} size={11} />}

          {e.type === "mode-change" && e.from && e.to && (
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: LR.ashSoft }}>{e.from}</span>
              <ArrowRight size={10} style={{ color: LR.ashSoft }} />
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: LR.primary, fontWeight: 500 }}>{e.to}</span>
            </div>
          )}

          {(typeof e.pnl === "number" || (e.facts && e.facts.length > 0)) && (
            <LrCapsuleStrip className="-mx-2">
              {typeof e.pnl === "number" && <LrCapsule eyebrow="Realised" tone={tone === "neutral" ? "primary" : tone} value={<span style={{ color: toneColor(tone) }}>{fmt(e.pnl)}</span>} />}
              {e.facts?.map((f) => <LrCapsule key={f.label} eyebrow={f.label} tone="ash" value={f.value} />)}
            </LrCapsuleStrip>
          )}

          {e.confluence && e.confluence.length > 0 && (focused || lit) && (
            <div className="pt-0.5"><ConfluenceStrata strata={e.confluence} compact live={false} /></div>
          )}

          {e.invalidation && <InvalidationLine inv={e.invalidation} compact={!focused} />}

          {(e.evidence?.length || reactions > 0) && (
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              {e.evidence && e.evidence.length > 0 && !ghost && <EvidenceChips ids={e.evidence} label="Stands on" max={3} />}
              {reactions > 0 && (
                <span className="inline-flex items-center gap-2 ml-auto">
                  <span className="font-mono tabular-nums" style={{ fontSize: 8.5, color: LR.ashSoft, letterSpacing: "0.1em" }}>{reactions} reacted</span>
                  <span aria-hidden className="h-px rounded-full overflow-hidden" style={{ background: LR.recess.border, width: 56 }}>
                    <span className="block h-full" style={{ width: `${Math.min(100, (reactions / 70) * 100)}%`, background: lrMix(LR.primary, 0.45) }} />
                  </span>
                </span>
              )}
            </div>
          )}
        </LrRecess>
      </div>
    </motion.li>
  )
}

function Divider({ label, tone = "ash" }: { label: string; tone?: "ash" | "warn" }) {
  return (
    <li aria-hidden className="flex items-center gap-3 py-1.5 pl-[44px]">
      <span className="flex-1 h-px" style={{ background: LR.dashed(tone === "warn" ? lrMix(toneColor("warn"), 0.4) : undefined) }} />
      <LrChip tone={tone === "warn" ? "warn" : "ash"} size={9}>{label}</LrChip>
      <span className="flex-1 h-px" style={{ background: LR.dashed(tone === "warn" ? lrMix(toneColor("warn"), 0.4) : undefined) }} />
    </li>
  )
}

export function SessionTimeline({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const [open, setOpen] = React.useState(true)
  const counts = React.useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, s.knownEvents.filter((e) => eventMatches(e, f.id)).length])) as Record<EventCategory, number>, [s.knownEvents])
  const visible = React.useMemo(() => [...s.knownEvents].filter((e) => eventMatches(e, s.filter)).sort((a, b) => b.at - a.at || b.id.localeCompare(a.id)), [s.knownEvents, s.filter])
  const future = React.useMemo(() => [...s.futureEvents].filter((e) => eventMatches(e, s.filter)).sort((a, b) => b.at - a.at), [s.futureEvents, s.filter])

  // rows with phase dividers inserted where the phase changes (newest first)
  const rows: Array<{ kind: "event"; e: SessionEvent; ghost?: boolean } | { kind: "divider"; label: string; key: string; tone?: "ash" | "warn" }> = []
  if (future.length) {
    future.forEach((e) => rows.push({ kind: "event", e, ghost: true }))
    rows.push({ kind: "divider", key: "div-future", label: `not yet · after ${clockLabel(s.viewMin)}`, tone: "warn" })
  }
  visible.forEach((e, i) => {
    const prev = visible[i - 1]
    if (prev && prev.phase !== e.phase) {
      const p = PHASES.find((x) => x.id === prev.phase)
      const start = s.phaseStarts[prev.phase]
      rows.push({ kind: "divider", key: `div-${prev.phase}`, label: `${p?.label ?? prev.phase} phase${start ? ` · ${clockLabel(start.at)}` : ""}` })
    }
    rows.push({ kind: "event", e })
  })

  return (
    <LrPane labelledBy="lr-timeline-title" delay={delay} className="lr-timeline-pane">
      <LrPaneHeader
        id="lr-timeline-title"
        eyebrow="Session timeline"
        count={s.knownEvents.length}
        trailing={
          <button type="button" aria-expanded={open} aria-label={open ? "Collapse timeline" : "Expand timeline"} onClick={() => setOpen((o) => !o)} className="inline-flex items-center justify-center rounded-lg focus:outline-none" style={{ width: 24, height: 24, color: LR.ashSoft, border: `1px solid ${LR.recess.border}` }}>
            <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.3, ease: LR.ease }} className="inline-flex"><ChevronDown size={12} /></motion.span>
          </button>
        }
      />

      {/* ledger strip */}
      <div className="px-4">
        <LrRecess className="flex items-center gap-4 px-3.5 py-3 min-w-0">
          <div className="flex flex-col gap-1 shrink-0">
            <LrEyebrow size={9}>{s.replaying ? "P&L as of" : "Running P&L"}</LrEyebrow>
            <span className="font-mono tabular-nums leading-none" style={{ fontSize: 18, color: s.ledger.pnl >= 0 ? LR.up : LR.down, fontWeight: 500, letterSpacing: "-0.01em" }}>
              <AnimatedMoney value={s.ledger.pnl} />
            </span>
          </div>
          <span aria-hidden className="w-px self-stretch" style={{ background: LR.recess.border }} />
          <div className="flex flex-col gap-1 shrink-0">
            <LrEyebrow size={9}>Positions</LrEyebrow>
            <span className="font-mono tabular-nums leading-none" style={{ fontSize: 12, color: LR.paper }}>
              {s.ledger.open} open <span style={{ color: LR.ashSoft }}>·</span> {s.ledger.closed} closed
            </span>
          </div>
          <span className="flex-1" />
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="font-mono tabular-nums" style={{ fontSize: 11, color: LR.paperDim }}>{s.ledger.total} events{s.replaying ? <span style={{ color: LR.ashSoft }}> · {s.futureEvents.length} ahead</span> : null}</span>
            <span className="font-mono tabular-nums" style={{ fontSize: 9, letterSpacing: "0.14em", color: LR.primary }}>{s.ledger.key} KEY</span>
          </div>
        </LrRecess>
      </div>

      {/* filters */}
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 overflow-x-auto lr-scroll-x" role="tablist" aria-label="Filter events">
        {FILTERS.map((f) => (
          <LrChip key={f.id} tone={f.id === "warnings" ? "warn" : "primary"} active={s.filter === f.id} dim={s.filter !== f.id && f.id !== "all"} size={9} onClick={() => s.dispatch({ type: "filter", filter: f.id })} ariaPressed={s.filter === f.id}>
            {f.label} <span className="tabular-nums" style={{ opacity: 0.75 }}>{counts[f.id]}</span>
          </LrChip>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: LR.ease }} className="overflow-hidden">
            <ol className="lr-timeline-body lr-feed m-0 px-4 pt-2 pb-2" style={{ listStyle: "none" }} aria-label="Session events, newest first">
              {/* NOW head */}
              <li className="flex items-center gap-3 pb-3" aria-live="polite" aria-atomic="true">
                <span className="flex items-center justify-center shrink-0" style={{ width: 44 }}>{s.replaying ? <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: toneColor("warn"), boxShadow: `0 0 8px ${lrMix(toneColor("warn"), 0.6)}` }} /> : <LrLiveDot tone="down" size={7} />}</span>
                <LrEyebrow tone={s.replaying ? "warn" : "paper"} size={9}>{s.replaying ? "Replay" : "Now"}</LrEyebrow>
                <span className="font-mono tabular-nums" style={{ fontSize: 11, color: LR.paperDim }}>{clockLabel(s.viewMin)}</span>
                <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
                <LrEyebrow size={9} weight={500}>{visible.length} shown</LrEyebrow>
              </li>
              <AnimatePresence initial={false}>
                {rows.map((r) => r.kind === "divider" ? <Divider key={r.key} label={r.label} tone={r.tone} /> : <EventCard key={r.e.id} e={r.e} ghost={r.ghost} />)}
              </AnimatePresence>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </LrPane>
  )
}
