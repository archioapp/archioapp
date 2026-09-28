"use client"

/**
 * LIVE ROOM — session store
 *
 * The single shared state the three views (timeline · intelligence ·
 * tools) project from. One reducer, one clock, one set of cross-highlight
 * pointers (hovered lens, focused event, hovered event).
 *
 * Hydration: the clock is initialised to a fixed value and only ticks
 * inside an effect, so server and client render the same first frame.
 */

import * as React from "react"
import {
  SEED_EVENTS, SEED_MESSAGES, SESSION_START_ELAPSED_SEC, INSTRUMENTS, VIEWER_GAMEPLAN,
  derivePhase, deriveThesis, deriveWatch, deriveRisk, deriveBehavior, deriveLedger, deriveOpenPositions, phaseStarts,
  deriveBreakdown, breakdownFrontier, deriveAnatomy, derivePulse, atCutoff,
  clockLabel, PHASE_TOOLS, TOOLS,
  type SessionEvent, type DiscussionMessage, type Lens, type LensId, type ToolId, type RoomId, type ComposerMode,
  type EventCategory, type SessionPhase, type Direction, type NodeRole, type BreakdownNode, type TradeAnatomy, type PulseBar,
} from "./session-state"
import { stripTerms } from "./glossary"

export type Timeframe = "1m" | "5m" | "15m" | "1H" | "4H"
export type ChartType = "candles" | "line"
export type ScreenMode = "price" | "flow"

/** The four instruments the inspector can show. */
export type InstrumentId = "breakdown" | "intelligence" | "timeline" | "anatomy"
export const INSTRUMENT_IDS: InstrumentId[] = ["breakdown", "intelligence", "timeline", "anatomy"]

/**
 * What the left inspector shows — exactly one card at a time.
 *   home       = mentor presence + phase rail (the default on entry)
 *   instrument = one of the four derived instruments
 *   tool       = one of the four phase-aware stage tools
 */
export type Inspector =
  | { kind: "home" }
  | { kind: "instrument"; id: InstrumentId }
  | { kind: "tool"; id: ToolId }

export const INSPECTOR_HOME: Inspector = { kind: "home" }

export const sameInspector = (a: Inspector, b: Inspector) =>
  a.kind === b.kind && (a.kind === "home" || (b.kind !== "home" && a.id === b.id))

/** Live price + extremes since the entry printed. Owned by the chart. */
export interface Tape { price: number; hi: number; lo: number }

interface State {
  events: SessionEvent[]
  messages: DiscussionMessage[]
  room: RoomId
  composerMode: ComposerMode
  filter: EventCategory
  hoveredLens: LensId | null
  activeLens: LensId | null
  hoveredNode: NodeRole | null
  activeNode: NodeRole | null
  focusedEvent: string | null
  hoveredEvent: string | null
  inspector: Inspector
  /** which key row last drove the inspector — slide direction of the swap */
  inspectorOrigin: "instrument" | "tool" | null
  catchUp: { bullets: string[]; at: number } | null
  alignment: { state: "aligned" | "divergent"; reason: string } | null
  screenMode: ScreenMode
  timeframe: Timeframe
  chartType: ChartType
  muted: boolean
  following: boolean
  bookmarked: boolean
  /** Explain layer — glossary underlines + term cards */
  explain: boolean
  /** Decision Replay — null = live, otherwise minutes since open */
  cutoffMin: number | null
  tape: Tape
  /** ids of events that arrived after mount (they get the seal animation) */
  fresh: string[]
}

type Action =
  | { type: "emit"; event: SessionEvent }
  | { type: "message"; message: DiscussionMessage }
  | { type: "room"; room: RoomId }
  | { type: "composerMode"; mode: ComposerMode }
  | { type: "filter"; filter: EventCategory }
  | { type: "hoverLens"; id: LensId | null }
  | { type: "toggleLens"; id: LensId }
  | { type: "hoverNode"; role: NodeRole | null }
  | { type: "toggleNode"; role: NodeRole }
  | { type: "focusEvent"; id: string | null }
  | { type: "hoverEvent"; id: string | null }
  /** show a card; the same card again (or `home`) returns to the mentor */
  | { type: "inspector"; to: Inspector; toggle?: boolean }
  | { type: "catchUp"; bullets: string[]; at: number }
  | { type: "dismissCatchUp" }
  | { type: "alignment"; state: "aligned" | "divergent"; reason: string }
  | { type: "screenMode"; mode: ScreenMode }
  | { type: "timeframe"; tf: Timeframe }
  | { type: "chartType"; ct: ChartType }
  | { type: "toggle"; key: "muted" | "following" | "bookmarked" | "explain" }
  | { type: "cutoff"; min: number | null }
  | { type: "tape"; tape: Tape }
  | { type: "pinMessage"; id: string; at: number }
  | { type: "react"; id: string }

const initial: State = {
  events: SEED_EVENTS,
  messages: SEED_MESSAGES,
  room: "main",
  composerMode: "chat",
  filter: "all",
  hoveredLens: null,
  activeLens: null,
  hoveredNode: null,
  activeNode: null,
  focusedEvent: null,
  hoveredEvent: null,
  inspector: INSPECTOR_HOME,
  inspectorOrigin: null,
  catchUp: null,
  alignment: null,
  screenMode: "price",
  timeframe: "15m",
  chartType: "candles",
  muted: false,
  following: false,
  bookmarked: false,
  explain: true,
  cutoffMin: null,
  tape: { price: INSTRUMENTS[0].price, hi: INSTRUMENTS[0].high, lo: 2033.4 },
  fresh: [],
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "emit":
      return { ...s, events: [...s.events, a.event], fresh: [...s.fresh, a.event.id] }
    case "message":
      return { ...s, messages: [...s.messages, a.message] }
    case "room": return { ...s, room: a.room }
    case "composerMode": return { ...s, composerMode: a.mode }
    case "filter": return { ...s, filter: a.filter }
    case "hoverLens": return { ...s, hoveredLens: a.id }
    case "toggleLens": {
      const activeLens = s.activeLens === a.id ? null : a.id
      // a pinned lens is explained by Intelligence — pull the inspector there
      const inspector: Inspector = activeLens ? { kind: "instrument", id: "intelligence" } : s.inspector
      return { ...s, activeLens, activeNode: null, inspector, inspectorOrigin: activeLens ? "instrument" : s.inspectorOrigin }
    }
    case "hoverNode": return { ...s, hoveredNode: a.role }
    case "toggleNode": {
      const activeNode = s.activeNode === a.role ? null : a.role
      const inspector: Inspector = activeNode ? { kind: "instrument", id: "breakdown" } : s.inspector
      return { ...s, activeNode, activeLens: null, inspector, inspectorOrigin: activeNode ? "instrument" : s.inspectorOrigin }
    }
    case "focusEvent": return { ...s, focusedEvent: a.id }
    case "hoverEvent": return { ...s, hoveredEvent: a.id }
    case "inspector": {
      const toggle = a.toggle ?? true
      const next: Inspector = toggle && sameInspector(s.inspector, a.to) ? INSPECTOR_HOME : a.to
      const origin = next.kind === "home" ? s.inspectorOrigin : next.kind
      return { ...s, inspector: next, inspectorOrigin: origin }
    }
    case "cutoff": return { ...s, cutoffMin: a.min }
    case "tape": return { ...s, tape: a.tape }
    case "catchUp": return { ...s, catchUp: { bullets: a.bullets, at: a.at } }
    case "dismissCatchUp": return { ...s, catchUp: null }
    case "alignment": return { ...s, alignment: { state: a.state, reason: a.reason } }
    case "screenMode": return { ...s, screenMode: a.mode }
    case "timeframe": return { ...s, timeframe: a.tf }
    case "chartType": return { ...s, chartType: a.ct }
    case "toggle": return { ...s, [a.key]: !s[a.key] }
    case "react":
      return { ...s, messages: s.messages.map((m) => (m.id === a.id ? { ...m, reactions: (m.reactions ?? 0) + 1 } : m)) }
    case "pinMessage": {
      const m = s.messages.find((x) => x.id === a.id)
      if (!m || m.ledgered) return s
      const { phase } = derivePhase(s.events)
      const event: SessionEvent = {
        id: `te-pin-${a.id}`,
        type: "key-moment",
        at: a.at,
        title: m.body.length > 92 ? `${m.body.slice(0, 92).trimEnd()}…` : m.body,
        body: `Pinned from ${m.author} in the discussion`,
        instrument: m.instrument,
        importance: 4,
        mentor: m.role === "mentor",
        phase,
        reactions: m.reactions,
        sourceMessageId: m.id,
      }
      return {
        ...s,
        events: [...s.events, event],
        fresh: [...s.fresh, event.id],
        messages: s.messages.map((x) => (x.id === a.id ? { ...x, ledgered: true } : x)),
      }
    }
    default: return s
  }
}

/* ────────────────────────────────────────────────────────────────────────
 *  Clock — one number, ticking after mount only
 * ──────────────────────────────────────────────────────────────────────── */

function useSessionClock() {
  const [elapsed, setElapsed] = React.useState(SESSION_START_ELAPSED_SEC)
  React.useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(id)
  }, [])
  return elapsed
}

/* ────────────────────────────────────────────────────────────────────────
 *  Context
 * ──────────────────────────────────────────────────────────────────────── */

export interface SessionCtx extends State {
  elapsedSec: number
  /** the live clock, minutes since open */
  nowMin: number
  /** the clock every view reads — cutoff while replaying, otherwise now */
  viewMin: number
  replaying: boolean
  /** events known at viewMin */
  knownEvents: SessionEvent[]
  /** events after the cutoff (empty while live) */
  futureEvents: SessionEvent[]
  phase: SessionPhase
  phaseStartedAt: number
  phaseStartEventId?: string
  phaseStarts: ReturnType<typeof phaseStarts>
  lenses: Lens[]
  lensById: Record<string, Lens>
  ledger: ReturnType<typeof deriveLedger>
  openPositions: ReturnType<typeof deriveOpenPositions>
  breakdown: BreakdownNode[]
  frontier: number
  anatomy: TradeAnatomy | null
  pulse: PulseBar[]
  foregroundTools: ToolId[]
  /** event ids currently lit by a hovered/active lens or node */
  litEvents: Set<string>
  /** the lens (if any) whose levels the chart should draw */
  chartLens: Lens | null
  /** the node (if any) the dossier shows */
  activeNodeData: BreakdownNode | null
  /** the open tool, if the inspector is showing one (kept for older consumers) */
  openTool: ToolId | null
  dispatch: React.Dispatch<Action>
  // verbs
  openInstrument: (id: InstrumentId) => void
  openTool_: (id: ToolId) => void
  goHome: () => void
  /** open the timeline and scroll to an event — the one way an event is "revealed" */
  revealEvent: (id: string) => void
  sendMessage: (text: string) => void
  pinMessage: (id: string) => void
  runOracle: () => void
  publishForecast: (f: { symbol: string; direction: Direction; entry: string; stop: string; target: string }) => void
  comparePlan: () => void
  toggleFlow: () => void
  focusEvent: (id: string | null) => void
  setCutoff: (min: number | null) => void
  setTape: (tape: Tape) => void
}

const Ctx = React.createContext<SessionCtx | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initial)
  const elapsedSec = useSessionClock()
  const nowMin = elapsedSec / 60
  const replaying = state.cutoffMin !== null && state.cutoffMin < nowMin
  const viewMin = replaying ? (state.cutoffMin as number) : nowMin
  const viewMinFloor = Math.floor(viewMin)

  const derived = React.useMemo(() => {
    const known = atCutoff(state.events, replaying ? viewMinFloor + 0.999 : null)
    const future = replaying ? state.events.filter((e) => !known.includes(e)) : []
    const { phase, startedAt, startEventId } = derivePhase(known)
    const prices = Object.fromEntries(INSTRUMENTS.map((i) => [i.symbol, i.price]))
    const thesis = deriveThesis(known)
    if (state.alignment && !replaying) thesis.alignment = state.alignment
    const lenses: Lens[] = [
      thesis,
      deriveWatch(known, prices),
      deriveRisk(known, viewMinFloor),
      deriveBehavior(known, phase),
    ]
    if (state.catchUp && !replaying) {
      lenses.unshift({
        id: "catchup", title: "Catch me up", confidence: "high",
        body: "Session summary generated by Oracle.", facts: [], sourceIds: known.map((e) => e.id),
        stampAt: state.catchUp.at, levels: [], bullets: state.catchUp.bullets,
      })
    }
    const lensById = Object.fromEntries(lenses.map((l) => [l.id, l]))
    const breakdown = deriveBreakdown(known)
    const nodeByRole = Object.fromEntries(breakdown.map((n) => [n.role, n])) as Record<NodeRole, BreakdownNode>
    const activeLens = state.hoveredLens ?? state.activeLens
    const activeNode = state.hoveredNode ?? state.activeNode
    const lit = new Set<string>()
    if (activeLens && lensById[activeLens]) lensById[activeLens].sourceIds.forEach((id) => lit.add(id))
    if (activeNode && nodeByRole[activeNode]) nodeByRole[activeNode].evidenceIds.forEach((id) => lit.add(id))
    const chartLens: Lens | null =
      activeLens && lensById[activeLens] ? lensById[activeLens]
      : activeNode && nodeByRole[activeNode]
        ? { id: "thesis", title: nodeByRole[activeNode].label, confidence: nodeByRole[activeNode].confidence, body: "", facts: [], sourceIds: nodeByRole[activeNode].evidenceIds, stampAt: nodeByRole[activeNode].stampAt ?? 0, levels: nodeByRole[activeNode].levels }
        : null
    return {
      knownEvents: known, futureEvents: future,
      phase, phaseStartedAt: startedAt, phaseStartEventId: startEventId,
      phaseStarts: phaseStarts(known),
      lenses, lensById,
      ledger: deriveLedger(known),
      openPositions: deriveOpenPositions(known),
      breakdown, frontier: breakdownFrontier(breakdown),
      anatomy: deriveAnatomy(known, state.tape, viewMin),
      pulse: derivePulse(state.events),
      foregroundTools: PHASE_TOOLS[phase],
      litEvents: lit,
      chartLens,
      activeNodeData: state.activeNode ? nodeByRole[state.activeNode] ?? null : null,
    }
  // viewMin only matters at minute granularity for the risk lens / anatomy clock
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.events, state.alignment, state.catchUp, state.hoveredLens, state.activeLens, state.hoveredNode, state.activeNode, state.tape, replaying, viewMinFloor])

  const nowRef = React.useRef(nowMin)
  nowRef.current = nowMin

  const sendMessage = React.useCallback((text: string) => {
    const body = text.trim()
    if (!body) return
    const kind = state.composerMode === "question" ? "question" : state.composerMode === "setup" ? "callout" : "audience"
    const room: RoomId = state.composerMode === "question" ? "questions" : state.composerMode === "setup" ? "setups" : state.room
    dispatch({
      type: "message",
      message: {
        id: `m-${Date.now()}`, room, kind, author: "You", initials: "Y", role: "member", body,
        at: nowRef.current, refEventId: state.focusedEvent ?? undefined, self: true,
      },
    })
    if (room !== state.room) dispatch({ type: "room", room })
  }, [state.composerMode, state.room, state.focusedEvent])

  const pinMessage = React.useCallback((id: string) => dispatch({ type: "pinMessage", id, at: nowRef.current }), [])

  const runOracle = React.useCallback(() => {
    const thesis = derived.lensById.thesis
    const risk = derived.lensById.risk
    const behavior = derived.lensById.behavior
    const frontierNode = derived.breakdown[Math.max(0, derived.frontier)]
    const bullets = [
      `${thesis?.title.split(" — ")[0] ?? "Thesis"}: ${derived.ledger.pnl >= 0 ? "+" : "−"}$${Math.abs(derived.ledger.pnl).toLocaleString()} banked, ${derived.ledger.open} runner open. The spine is at ${frontierNode?.label ?? "Context"} · ${frontierNode?.statusLabel ?? ""}.`,
      stripTerms(behavior?.meaning ?? behavior?.body ?? ""),
      `${risk?.facts[0]?.value ?? "No macro risk"} · ${risk?.facts[1]?.value ?? ""}`,
    ].filter(Boolean)
    const at = nowRef.current
    dispatch({ type: "catchUp", bullets, at })
    dispatch({
      type: "emit",
      event: { id: `te-oracle-${Date.now()}`, type: "system", at, title: "Oracle summary generated", body: "Three-line recap posted to Main Stage", importance: 2, mentor: false, phase: derived.phase },
    })
    dispatch({
      type: "message",
      message: { id: `m-oracle-${Date.now()}`, room: "main", kind: "summary", author: "Oracle", initials: "O", body: "Catch me up — session so far", at, bullets },
    })
    // the recap lands as a lens — show it where it lives
    dispatch({ type: "inspector", to: { kind: "instrument", id: "intelligence" }, toggle: false })
  }, [derived])

  const publishForecast = React.useCallback((f: { symbol: string; direction: Direction; entry: string; stop: string; target: string }) => {
    const at = nowRef.current
    const entry = parseFloat(f.entry), stop = parseFloat(f.stop), target = parseFloat(f.target)
    const rr = Math.abs(target - entry) / Math.max(1e-9, Math.abs(entry - stop))
    dispatch({
      type: "emit",
      event: {
        id: `te-fc-${Date.now()}`, type: "forecast-published", at,
        title: `Forecast published — ${f.symbol} ${f.direction === "bullish" ? "long" : "short"} ${f.entry} → ${f.target}`,
        instrument: f.symbol, direction: f.direction, importance: 3, mentor: false, phase: derived.phase,
        facts: [{ label: "Entry", value: f.entry }, { label: "Stop", value: f.stop }, { label: "Target", value: f.target }, { label: "R:R", value: `1 : ${rr.toFixed(1)}` }],
        levels: [{ kind: "entry", price: entry, instrument: f.symbol }, { kind: "stop", price: stop, instrument: f.symbol }, { kind: "target", price: target, instrument: f.symbol }],
      },
    })
    dispatch({
      type: "message",
      message: {
        id: `m-fc-${Date.now()}`, room: "setups", kind: "forecast", author: "You", initials: "Y", role: "member", at, instrument: f.symbol, self: true,
        body: `${f.symbol} ${f.direction === "bullish" ? "LONG" : "SHORT"} · entry ${f.entry} · stop ${f.stop} · target ${f.target} · 1 : ${rr.toFixed(1)}`,
      },
    })
    dispatch({ type: "room", room: "setups" })
    // the forecast is now an event — show it stamped in the timeline
    dispatch({ type: "inspector", to: { kind: "instrument", id: "timeline" }, toggle: false })
  }, [derived.phase])

  const comparePlan = React.useCallback(() => {
    const thesis = derived.lensById.thesis
    const symbol = thesis?.title.match(/[A-Z]{3}\/[A-Z]{3}/)?.[0] ?? "XAU/USD"
    const plan = VIEWER_GAMEPLAN[symbol]
    const mentorDir: Direction = /long/.test(thesis?.title ?? "") ? "bullish" : /short/.test(thesis?.title ?? "") ? "bearish" : "neutral"
    const aligned = plan ? plan.bias === mentorDir : false
    const reason = plan
      ? aligned
        ? `Your gameplan is ${plan.bias} on ${symbol} — same side. Daily EQ ${plan.dailyEq} sits below the entry; H4 supply ${plan.h4Supply} is beyond the 2042 target.`
        : `Your gameplan is ${plan.bias} on ${symbol}, the mentor is ${mentorDir}. Re-check the H4 supply at ${plan.h4Supply}.`
      : `No gameplan for ${symbol} today.`
    const at = nowRef.current
    dispatch({ type: "alignment", state: aligned ? "aligned" : "divergent", reason })
    dispatch({
      type: "emit",
      event: { id: `te-cmp-${Date.now()}`, type: "system", at, title: `Plan compared — ${aligned ? "ALIGNED" : "DIVERGENT"} with your Daily Gameplan`, body: reason, importance: 2, mentor: false, phase: derived.phase, instrument: symbol },
    })
  }, [derived])

  const toggleFlow = React.useCallback(() => {
    dispatch({ type: "screenMode", mode: state.screenMode === "flow" ? "price" : "flow" })
    if (state.screenMode !== "flow") dispatch({ type: "room", room: "flow" })
  }, [state.screenMode])

  const focusEvent = React.useCallback((id: string | null) => dispatch({ type: "focusEvent", id }), [])
  const setCutoff = React.useCallback((min: number | null) => {
    dispatch({ type: "cutoff", min: min === null || min >= nowRef.current ? null : Math.max(0, min) })
    dispatch({ type: "focusEvent", id: null })
  }, [])
  const setTape = React.useCallback((tape: Tape) => dispatch({ type: "tape", tape }), [])

  const openInstrument = React.useCallback((id: InstrumentId) => dispatch({ type: "inspector", to: { kind: "instrument", id } }), [])
  const openTool_ = React.useCallback((id: ToolId) => dispatch({ type: "inspector", to: { kind: "tool", id } }), [])
  const goHome = React.useCallback(() => dispatch({ type: "inspector", to: INSPECTOR_HOME, toggle: false }), [])
  const revealEvent = React.useCallback((id: string) => {
    dispatch({ type: "focusEvent", id })
    dispatch({ type: "inspector", to: { kind: "instrument", id: "timeline" }, toggle: false })
    // the card may be mounting this very render — scroll once it exists
    const scroll = () => document.querySelector<HTMLElement>(`[data-lr-event="${id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" })
    window.requestAnimationFrame(() => { if (!document.querySelector(`[data-lr-event="${id}"]`)) window.setTimeout(scroll, 120); else scroll() })
  }, [])

  const value: SessionCtx = {
    ...state, ...derived, elapsedSec, nowMin, viewMin, replaying, dispatch,
    openTool: state.inspector.kind === "tool" ? state.inspector.id : null,
    openInstrument, openTool_, goHome, revealEvent,
    sendMessage, pinMessage, runOracle, publishForecast, comparePlan, toggleFlow, focusEvent, setCutoff, setTape,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSession(): SessionCtx {
  const c = React.useContext(Ctx)
  if (!c) throw new Error("useSession must be used inside <SessionProvider>")
  return c
}

export function eventTimeLabel(e: SessionEvent) {
  return clockLabel(e.at)
}

export const TOOL_DEFS = TOOLS
