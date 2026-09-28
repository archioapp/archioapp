"use client"

/**
 * LIVE ROOM — the inspector
 *
 * The left pane. A fixed deck of eight keys on top, ONE card beneath:
 *
 *   INSTRUMENTS  ⑃ BREAKDOWN 7/7 · ◎ INTELLIGENCE 04 · ≡ TIMELINE 16 · ⊕ ANATOMY +0.6R
 *   TOOLS        ≋ ORDER FLOW · ⑂ COMPARE · ✦ ORACLE · ⊕ FORECAST      (phase-aware)
 *   ─────────────────────────────────────────────────────────────────────
 *   status       execute phase · Order flow and Compare plan foregrounded
 *   ═══ one card ═══  home (mentor · phase · readouts) | instrument | tool
 *
 * Pressing a key swaps the card in place — the screen never moves, nothing
 * stacks below it. The same key again, ESC, or HOME returns to the mentor.
 * A single lit pill slides between keys (Framer layoutId) and a 1px light
 * segment under the lit key's column crowns the card, so the card visibly
 * belongs to the key that opened it.
 *
 * Shortcuts: 1–4 instruments · Q W E R tools · Esc home (ignored while typing)
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Workflow, Radar, ListOrdered, Crosshair, Waves, GitCompare, Sparkles, Target, Home, type LucideIcon } from "lucide-react"
import { LR, lrMix } from "./live-room-tokens"
import { LrEyebrow, LrPane, useReducedMotion } from "./live-room-primitives"
import { LrCapsule, LrCapsuleStrip } from "./lr-capsule"
import { useSession, INSTRUMENT_IDS, type InstrumentId, type Inspector } from "./session-store"
import { TOOLS, PHASES, clockLabel, type ToolId } from "./session-state"
import { LR_REVEAL_EVENT } from "./phase-rail"
import { MentorPresence } from "./mentor-presence"
import { PhaseRail } from "./phase-rail"
import { BreakdownSpine } from "./breakdown-spine"
import { IntelligenceLenses } from "./intelligence-lenses"
import { SessionTimeline } from "./session-timeline"
import { TradeAnatomy } from "./trade-anatomy"
import { ToolPanel } from "./stage-tools"

/* ── registry ─────────────────────────────────────────────────────────── */
export const INSTRUMENTS_DEF: Record<InstrumentId, { name: string; compact: string; purpose: string; icon: LucideIcon; key: string }> = {
  breakdown:    { name: "Breakdown",    compact: "Breakdown", purpose: "Why this trade exists.",   icon: Workflow,    key: "1" },
  intelligence: { name: "Intelligence", compact: "Intel",     purpose: "What the room knows now.", icon: Radar,       key: "2" },
  timeline:     { name: "Timeline",     compact: "Timeline",  purpose: "Every call, stamped.",     icon: ListOrdered, key: "3" },
  anatomy:      { name: "Anatomy",      compact: "Anatomy",   purpose: "The position, in R.",      icon: Crosshair,   key: "4" },
}

export const TOOL_KEYS: ToolId[] = ["flow", "compare", "oracle", "forecast"]
export const TOOLS_DEF: Record<ToolId, { short: string; compact: string; icon: LucideIcon; key: string }> = {
  flow:     { short: "Order flow", compact: "Flow",     icon: Waves,      key: "Q" },
  compare:  { short: "Compare",    compact: "Compare",  icon: GitCompare, key: "W" },
  oracle:   { short: "Oracle",     compact: "Oracle",   icon: Sparkles,   key: "E" },
  forecast: { short: "Forecast",   compact: "Forecast", icon: Target,     key: "R" },
}

/** Below this deck width the keys use their compact labels (no truncation, ever). */
const DECK_COMPACT_BELOW = 400

export const inspectorKey = (i: Inspector) => (i.kind === "home" ? "home" : `${i.kind}:${i.id}`)

function fmtMin(m: number) {
  const h = Math.floor(m / 60), r = Math.round(m % 60)
  return h > 0 ? `${h}h ${String(r).padStart(2, "0")}m` : `${r}m`
}

/** true when the keyboard focus is inside something that takes text */
function typing(): boolean {
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable
}

/* ── one key ──────────────────────────────────────────────────────────── */
function DeckKey({
  lit, dim = false, icon: Icon, label, badge, badgeTone = "ash", dot = false, shortcut, title, onPress, onHover, layoutId, controls,
}: {
  lit: boolean
  dim?: boolean
  icon: LucideIcon
  label: string
  badge?: string
  badgeTone?: "ash" | "primary" | "up" | "down"
  dot?: boolean
  shortcut: string
  title: string
  onPress: () => void
  onHover: (on: boolean) => void
  layoutId: string
  controls: string
}) {
  const reduce = useReducedMotion()
  const P = LR.primary
  const badgeColor = badgeTone === "up" ? LR.up : badgeTone === "down" ? LR.down : badgeTone === "primary" ? P : LR.ashSoft
  return (
    <button
      type="button"
      role="tab"
      aria-selected={lit}
      aria-controls={controls}
      title={`${title}  ·  ${shortcut}`}
      onClick={onPress}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className="lr-key relative flex flex-col items-center justify-center min-w-0 focus:outline-none focus-visible:ring-1"
      style={{ height: 52, borderRadius: 12, background: "transparent", border: "none", padding: "0 8px", cursor: "pointer", color: "inherit", opacity: dim && !lit ? 0.62 : 1, transition: "opacity 240ms ease" }}
    >
      {lit && (
        <motion.span
          layoutId={layoutId}
          aria-hidden
          className="absolute inset-0"
          style={{ borderRadius: 12, background: LR.chipFillHi, border: `1px solid ${lrMix(P, 0.32)}`, boxShadow: `0 0 0 1px ${lrMix(P, 0.06)}, 0 8px 22px -12px ${lrMix(P, 0.6)}` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
        >
          <span aria-hidden className="absolute left-3 right-3 top-0" style={{ height: 1, background: LR.thread(P, 0.7) }} />
        </motion.span>
      )}
      <span className="relative z-[1] flex flex-col items-center gap-[5px] min-w-0 w-full">
        <motion.span aria-hidden className="inline-flex" initial={false} animate={{ scale: lit ? 1.08 : 1, y: lit ? -0.5 : 0 }} transition={{ duration: 0.24, ease: LR.ease }}>
          <Icon size={15} strokeWidth={1.6} color={lit ? P : lrMix(P, 0.62)} />
        </motion.span>
        <span className="font-mono uppercase truncate max-w-full" style={{ fontSize: 9, letterSpacing: "0.12em", fontWeight: 600, color: lit ? LR.paper : LR.paperDim, textShadow: lit ? `0 0 10px ${lrMix(P, 0.35)}` : "none", transition: "color 180ms, text-shadow 220ms" }}>
          {label}
        </span>
      </span>
      {/* count badge — top-right corner so the label keeps the full width */}
      {badge && (
        <span className="absolute font-mono tabular-nums z-[1]" style={{ top: 4, right: 8, fontSize: 9, letterSpacing: "0.04em", lineHeight: 1, color: lit ? badgeColor : lrMix(badgeColor, 0.75), transition: "color 200ms" }}>{badge}</span>
      )}
      {dot && !badge && (
        <span aria-hidden className="absolute rounded-full z-[1]" style={{ top: 8, right: 8, width: 4, height: 4, background: P, boxShadow: `0 0 6px ${lrMix(P, 0.7)}`, opacity: lit ? 0 : 1, transition: "opacity 200ms" }} title="Foregrounded in this phase" />
      )}
      <span className="sr-only">{`${title} — ${shortcut}`}</span>
    </button>
  )
}

/* ── deck ────────────────────────────────────────────────────────��────── */
export function InspectorDeck({ deckId = "main", onHome }: { deckId?: string; onHome?: () => void }) {
  const s = useSession()
  const [hover, setHover] = React.useState<Inspector | null>(null)
  const deckRef = React.useRef<HTMLDivElement>(null)
  const [compact, setCompact] = React.useState(false)
  const thesis = s.lensById.thesis
  const cur = s.inspector

  React.useEffect(() => {
    const el = deckRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setCompact(e.contentRect.width < DECK_COMPACT_BELOW))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const counts: Record<InstrumentId, { text: string; tone: "ash" | "primary" | "up" | "down" }> = {
    breakdown: { text: `${Math.min(s.breakdown.length, s.frontier + 1)}/${s.breakdown.length}`, tone: "ash" },
    intelligence: { text: String(s.lenses.filter((l) => l.id !== "catchup").length).padStart(2, "0"), tone: s.catchUp ? "primary" : "ash" },
    timeline: { text: String(s.knownEvents.length), tone: s.fresh.length ? "primary" : "ash" },
    anatomy: s.anatomy ? { text: `${s.anatomy.rNow >= 0 ? "+" : "−"}${Math.abs(s.anatomy.rNow).toFixed(1)}R`, tone: s.anatomy.rNow >= 0 ? "up" : "down" } : { text: "—", tone: "ash" },
  }

  // the status line: hovered key wins, then the lit key, then the phase
  const shown = hover ?? (cur.kind === "home" ? null : cur)
  let status: React.ReactNode
  if (shown?.kind === "instrument") status = <><span style={{ color: LR.paper }}>{INSTRUMENTS_DEF[shown.id].name}</span> — {INSTRUMENTS_DEF[shown.id].purpose}</>
  else if (shown?.kind === "tool") { const def = TOOLS.find((t) => t.id === shown.id); status = <><span style={{ color: LR.paper }}>{def?.label}</span> — {def?.hint({ thesis, phase: s.phase })}</> }
  else status = <><span style={{ color: LR.paper }}>{PHASES.find((p) => p.id === s.phase)?.label} phase</span> · {s.foregroundTools.map((t) => TOOLS.find((x) => x.id === t)?.label).join(" and ")} foregrounded</>
  const statusKey = shown ? inspectorKey(shown) : `phase:${s.phase}`

  const layoutId = `lr-key-lit-${deckId}`
  const isLit = (i: Inspector) => inspectorKey(cur) === inspectorKey(i)
  const litCol = cur.kind === "instrument" ? INSTRUMENT_IDS.indexOf(cur.id) : cur.kind === "tool" ? TOOL_KEYS.indexOf(cur.id) : -1

  return (
    <div ref={deckRef} className="lr-deck relative flex flex-col shrink-0 min-w-0 gap-2" data-compact={compact ? "" : undefined} style={{ padding: "8px 12px 0" }}>
      {/* instruments — label + keys are one group; the deck's gap separates groups */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0 px-1">
          <LrEyebrow size={9} tone="ash">Instruments</LrEyebrow>
          <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
          <button type="button" onClick={onHome ?? s.goHome} aria-label="Show the mentor (home)" title="Home · Esc" className="inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 rounded-md" style={{ padding: "2px 4px", color: cur.kind === "home" ? LR.primary : LR.ashSoft, background: "transparent", border: "none", cursor: "pointer", transition: "color 200ms" }}>
            <Home size={11} strokeWidth={1.6} />
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", fontWeight: 600 }}>Home</span>
          </button>
        </div>
        <div role="tablist" aria-label="Instruments" className="grid gap-1" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {INSTRUMENT_IDS.map((id) => {
            const d = INSTRUMENTS_DEF[id]
            const target: Inspector = { kind: "instrument", id }
            return (
              <DeckKey key={id} layoutId={layoutId} controls="lr-inspector-card" lit={isLit(target)} icon={d.icon} label={compact ? d.compact : d.name} badge={counts[id].text} badgeTone={counts[id].tone} shortcut={d.key} title={`${d.name} — ${d.purpose}`} onPress={() => s.openInstrument(id)} onHover={(on) => setHover(on ? target : null)} />
            )
          })}
        </div>
      </div>

      {/* tools */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0 px-1">
          <LrEyebrow size={9} tone="ash">Tools</LrEyebrow>
          <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: LR.ashSoft, opacity: 0.8 }}>{PHASES.find((p) => p.id === s.phase)?.label}</span>
        </div>
        <div role="tablist" aria-label="Stage tools" className="grid gap-1" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {TOOL_KEYS.map((id) => {
            const d = TOOLS_DEF[id]
            const def = TOOLS.find((t) => t.id === id)!
            const target: Inspector = { kind: "tool", id }
            const fg = s.foregroundTools.includes(id)
            return (
              <DeckKey key={id} layoutId={layoutId} controls="lr-inspector-card" lit={isLit(target)} dim={!fg} dot={fg} icon={d.icon} label={compact ? d.compact : d.short} badge={id === "flow" && s.screenMode === "flow" ? "on" : undefined} badgeTone="up" shortcut={d.key} title={`${def.label} — ${def.hint({ thesis, phase: s.phase })}`} onPress={() => s.openTool_(id)} onHover={(on) => setHover(on ? target : null)} />
            )
          })}
        </div>
      </div>

      {/* status line */}
      <div className="flex items-center gap-2 min-w-0 px-1" style={{ minHeight: 16 }}>
        <span aria-hidden className="rounded-full shrink-0" style={{ width: 4, height: 4, background: LR.primary, opacity: 0.6 }} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={statusKey} initial={{ opacity: 0, y: 4, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -4, filter: "blur(4px)" }} transition={{ duration: 0.22, ease: LR.ease }} className="font-sans truncate" style={{ fontSize: 11, color: LR.ashSoft }}>
            {status}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* crown — the card's top hairline, lit under the pressed key's column */}
      <div aria-hidden className="relative" style={{ height: 9 }}>
        <span className="absolute left-2 right-2" style={{ top: 8, height: 1, background: LR.pane.border }} />
        <motion.span
          className="absolute"
          style={{ top: 8, height: 1, width: "25%", background: LR.thread(LR.primary, 0.85), boxShadow: `0 0 8px ${lrMix(LR.primary, 0.5)}` }}
          initial={false}
          animate={{ left: litCol >= 0 ? `${litCol * 25}%` : "37.5%", opacity: litCol >= 0 ? 1 : 0.35, scaleX: litCol >= 0 ? 1 : 0.6 }}
          transition={{ duration: 0.32, ease: LR.ease }}
        />
      </div>
    </div>
  )
}

/* ── home card ────────────────────────────────────────────────────────── */
function HomeCard() {
  const s = useSession()
  const phaseMin = Math.max(0, s.viewMin - s.phaseStartedAt)
  const pnl = s.ledger.pnl
  const risk = s.lensById.risk
  const macro = risk?.facts.find((f) => /macro/i.test(f.label))?.value ?? "—"
  const openRisk = risk?.facts.find((f) => /open risk/i.test(f.label))?.value ?? "0.0 R"
  const peak = s.pulse.reduce((m, b) => (b.reactions > m.reactions ? b : m), s.pulse[0])
  return (
    <div className="flex flex-col gap-3">
      <MentorPresence delay={0} />
      <LrPane labelledBy="lr-home-readouts" delay={0.05} corners={false}>
        <h3 id="lr-home-readouts" className="sr-only">Session readouts</h3>
        <PhaseRail delay={0} />
        <div className="px-2 pb-2 pt-1" style={{ borderTop: `1px solid ${LR.recess.border}` }}>
          <LrCapsuleStrip>
            <LrCapsule eyebrow="Phase" value={<>{PHASES.find((p) => p.id === s.phase)?.label ?? s.phase} <span style={{ color: LR.ashSoft }}>· {fmtMin(phaseMin)}</span></>} tone="primary" delay={0.02} onClick={() => s.openInstrument("breakdown")} title="Open the breakdown" signal={<span aria-hidden className="inline-block rounded-full" style={{ width: 4, height: 4, background: LR.primary, boxShadow: `0 0 6px ${LR.primary}` }} />} />
            <LrCapsule eyebrow="Banked" value={<span style={{ color: pnl >= 0 ? LR.up : LR.down }}>{pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}</span>} tone={pnl >= 0 ? "up" : "down"} delay={0.06} onClick={() => s.openInstrument("anatomy")} title="Open the anatomy" />
            <LrCapsule eyebrow="Open" value={<>{s.ledger.open} {s.ledger.open === 1 ? "runner" : "runners"} <span style={{ color: LR.ashSoft }}>· {openRisk}</span></>} tone="primary" delay={0.1} onClick={() => s.openInstrument("anatomy")} title="Open the anatomy" />
            <LrCapsule eyebrow="Next" value={macro} tone="warn" delay={0.14} onClick={() => s.dispatch({ type: "toggleLens", id: "risk" })} title="Open Current risk" />
            <LrCapsule eyebrow="Pulse" value={peak ? <>{peak.reactions} <span style={{ color: LR.ashSoft }}>peak · {clockLabel(peak.at)}</span></> : "—"} tone="primary" delay={0.18} onClick={() => s.openInstrument("timeline")} title="Open the timeline" />
          </LrCapsuleStrip>
        </div>
      </LrPane>
    </div>
  )
}

/* ── stage — exactly one card ─────────────────────────────────────────── */
export function InspectorStage({ className = "" }: { className?: string }) {
  const s = useSession()
  const reduce = useReducedMotion()
  const cur = s.inspector
  const key = inspectorKey(cur)
  const col = cur.kind === "instrument" ? INSTRUMENT_IDS.indexOf(cur.id) : cur.kind === "tool" ? TOOL_KEYS.indexOf(cur.id) : 1.5
  // the card rises from under the pressed key's column
  const fromX = reduce ? 0 : (col - 1.5) * 6
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }) }, [key])

  // "show me that call" from anywhere → the timeline, scrolled to the card
  const reveal = s.revealEvent
  React.useEffect(() => {
    const on = (e: Event) => reveal((e as CustomEvent<string>).detail)
    window.addEventListener(LR_REVEAL_EVENT, on)
    return () => window.removeEventListener(LR_REVEAL_EVENT, on)
  }, [reveal])

  let card: React.ReactNode
  if (cur.kind === "home") card = <HomeCard />
  else if (cur.kind === "instrument") {
    card = cur.id === "breakdown" ? <BreakdownSpine delay={0} />
      : cur.id === "intelligence" ? <IntelligenceLenses delay={0} />
      : cur.id === "timeline" ? <SessionTimeline delay={0} />
      : <TradeAnatomy delay={0} />
  } else card = <ToolPanel id={cur.id} />

  return (
    <div ref={scrollRef} id="lr-inspector-card" className={`lr-inspector-stage lr-feed flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${className}`} style={{ containerType: "inline-size", padding: "10px 12px 16px" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={key}
          role="tabpanel"
          data-lr-card={key}
          className="min-w-0"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, x: fromX, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0, transition: { duration: 0.1 } } : { opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.16, ease: LR.ease } }}
          transition={{ duration: reduce ? 0.12 : 0.26, ease: LR.ease }}
        >
          {card}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── the pane = deck + stage + shortcuts ──────────────────────────────── */
export function InspectorPane() {
  const s = useSession()
  const { goHome, openInstrument, openTool_ } = s

  React.useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (typing()) return
      const k = e.key
      if (k === "Escape") { if (s.inspector.kind !== "home") { e.preventDefault(); goHome() } return }
      const inst = INSTRUMENT_IDS.find((id) => INSTRUMENTS_DEF[id].key === k)
      if (inst) { e.preventDefault(); openInstrument(inst); return }
      const tool = TOOL_KEYS.find((id) => TOOLS_DEF[id].key.toLowerCase() === k.toLowerCase())
      if (tool) { e.preventDefault(); openTool_(tool) }
    }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [s.inspector.kind, goHome, openInstrument, openTool_])

  return (
    <aside aria-label="Inspector" className="lr-inspector flex flex-col h-full min-h-0 min-w-0">
      <InspectorDeck />
      <InspectorStage />
    </aside>
  )
}
