"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · INTELLIGENCE CHAMBER — the conversation surface of the Flight Deck
   ───────────────────────────────────────────────────────────────────────────
   Mounted in the CENTER COLUMN of the TraderCartouche, ABOVE the 4-room
   navigator. It replaces the welcome stack the moment a FREE-TEXT question
   is submitted from the Ask bar, and yields back on Esc / Clear.

   ⚠️ SCOPE CONTRACT (hard-learned): destination clicks (Market Floor →
   Signal Room, Forecast Room, …) set `viewportApi.activeId` and must keep
   painting their templates in the BELOW-COCKPIT AskAnswerSurface theater.
   The chamber therefore only engages when the parent passes `engaged`
   (isAnswering && activeId == null). This component never touches the
   viewport context itself.

   P1+P2 OF THE RESPONSE ENGINE (masterplan) LIVE HERE:
     · BUILD prompts still route client-side to the staged module assembler.
     · Everything else fires /api/archio via useArchio: REAL gpt-5-mini,
       REAL polygon grounding, streamed verdict, structured envelope.
     · ANALYSIS mode renders the template canvas (registry) under the
       readout — Asset Deep Dive is the first composition.
     · Named thinking states come from the deterministic route header.
     · API unreachable → deterministic fallback, provenance says "demo".

   Design language (matches the approved screenshot):
     · Presence line: breathing dot · ARCHIO · hairline · phase word · ESC·DECK
     · User prompt right-aligned with a tick dash
     · Answer: 17px readout → 13px body → template canvas → pills → whisper
     · Build mode: staged mono assembly log → native generated module
     · Hairline follow-up dock (no box)
   ═══════════════════════════════════════════════════════════════════════════ */

import React, {
  useCallback, useEffect, useRef, useState,
} from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import { useAskVantaryState } from "../ask-vantary-state-context"
import {
  routeIntent, ASSEMBLY_SCRIPTS, BUILD_ACK,
  type ArchioModuleId,
} from "./archio-intelligence"
import { ArchioGeneratedModule } from "./archio-modules"
import { useArchio, type ArchioTurnResult } from "./use-archio"
import { ArchioTemplateCanvas } from "../../response-engine/registry"
import { ROOM_LABEL } from "@/lib/response-engine/router"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  textTransform: "uppercase",
}

/* ────────────────────────────────────────────────────────────────────────
   Turn model — local history so follow-ups append instead of replacing
   ──────────────────────────────────────────────────────────────────────── */
interface Turn {
  id:        number
  prompt:    string
  intent:    ReturnType<typeof routeIntent>
  /** Committed engine result once the stream finishes (conversation turns). */
  answer?:   ArchioTurnResult
}

/* ────────────────────────────────────────────────────────────────────────
   Presence line
   ──────────────────────────────────────────────────────────────────────── */
function PresenceLine({ rgb, phase, onExit, reduced }: {
  rgb: string
  phase: "composing" | "building" | "live"
  onExit: () => void
  reduced: boolean
}) {
  const phaseWord = phase === "composing" ? "Composing"
                  : phase === "building"  ? "Building" : "Live"
  return (
    <div className="flex items-center gap-3 w-full">
      <motion.span
        aria-hidden
        animate={reduced ? {} : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: phase === "live" ? 3.2 : 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 5, height: 5, borderRadius: 999, background: vgRgba(rgb, 0.95),
          boxShadow: `0 0 8px ${vgRgba(rgb, 0.6)}`, flexShrink: 0 }}
      />
      <span style={{ ...MONO, fontSize: 10, letterSpacing: "0.34em", color: vgRgba(rgb, 0.9) }}>
        Archio
      </span>
      <span aria-hidden className="flex-1" style={{ height: 1,
        background: `linear-gradient(90deg, ${vgRgba(rgb, 0.28)}, transparent)` }} />
      <span aria-live="polite" style={{ ...MONO, fontSize: 9, letterSpacing: "0.3em",
        color: phase === "live" ? vgRgba(rgb, 0.85) : VG_VT.paperDim }}>
        {phaseWord}
      </span>
      <button
        type="button"
        onClick={onExit}
        aria-label="Return to deck (Escape)"
        className="bg-transparent border-0 cursor-pointer p-0"
        style={{ ...MONO, fontSize: 9, letterSpacing: "0.26em", color: VG_VT.paperDim }}
        onMouseEnter={(e) => { e.currentTarget.style.color = vgRgba(rgb, 0.95) }}
        onMouseLeave={(e) => { e.currentTarget.style.color = VG_VT.paperDim }}
      >
        ESC · Deck
      </button>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Named thinking — cycles the route's lens states while tokens arrive
   ──────────────────────────────────────────────────────────────────────── */
function NamedThinking({ rgb, states, reduced }: { rgb: string; states: string[]; reduced: boolean }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (states.length <= 1) return
    const t = window.setInterval(() => setIdx((i) => Math.min(i + 1, states.length - 1)), reduced ? 400 : 900)
    return () => window.clearInterval(t)
  }, [states.length, reduced])
  const line = states[Math.min(idx, states.length - 1)] ?? "Composing"
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3" aria-label="Archio is composing">
      <div className="flex items-center gap-2.5" aria-live="polite">
        <motion.span
          aria-hidden
          animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          style={{ width: 4, height: 4, borderRadius: 999, background: vgRgba(rgb, 0.85) }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={line}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.22em", color: vgRgba(rgb, 0.7) }}
          >
            {line}…
          </motion.span>
        </AnimatePresence>
      </div>
      {[0, 1].map((i) => (
        <motion.div key={i}
          animate={reduced ? { opacity: 0.35 } : { opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.22 }}
          style={{ height: 11, width: i === 0 ? "62%" : "44%", borderRadius: 4,
            background: vgRgba(rgb, 0.28) }}
        />
      ))}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   One conversation turn
   ──────────────────────────────────────────────────────────────────────── */
function TurnBlock({ turn, accent, isLast, live, onSuggest, reduced }: {
  turn: Turn
  accent: ThemeAccent
  isLast: boolean
  /** The in-flight engine result — only meaningful for the last turn. */
  live: ArchioTurnResult | null
  onSuggest: (cmd: string) => void
  reduced: boolean
}) {
  const rgb = accent.rgb
  const [logStep, setLogStep] = useState(0)

  const isBuild  = turn.intent.kind === "build"
  const moduleId = isBuild ? (turn.intent as { kind: "build"; moduleId: ArchioModuleId }).moduleId : null
  const script   = moduleId ? ASSEMBLY_SCRIPTS[moduleId] : []

  /* The answer shown: committed history, or the live stream for the last turn. */
  const answer = turn.answer ?? (isLast ? live : null)
  const streamingVerdict = isLast && live?.status === "streaming" ? live.liveMessage : ""
  const isThinking = !isBuild && !turn.answer && isLast &&
    (live == null || live.status === "routing" || (live.status === "streaming" && !live.liveMessage))

  /* Staged assembly log — advance one line every ~560ms. */
  useEffect(() => {
    if (!isBuild) return
    if (logStep >= script.length) return
    const t = window.setTimeout(() => setLogStep((s) => s + 1), reduced ? 60 : 560)
    return () => window.clearTimeout(t)
  }, [isBuild, logStep, script.length, reduced])

  const built = isBuild && logStep >= script.length
  const envelope = answer?.envelope ?? null
  const route = answer?.route ?? null
  const showTemplate = envelope && route?.mode === "analysis" && route.templateId

  /* Provenance whisper — honest about lenses, room, and demo fallback. */
  const provenance = answer?.demo
    ? "Archio · Demo data · Offline"
    : route
      ? `${route.lenses.map((l) => l === "master" ? "Master Archio" : `${l[0].toUpperCase()}${l.slice(1)} lens`).join(" + ")}${route.room ? ` · ${ROOM_LABEL[route.room]}` : ""} · ${envelope?.confidence ?? "…"} confidence`
      : "Master Archio · Flight Deck"

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ── user prompt · right-aligned with tick dash ────────────────── */}
      <div className="flex items-center justify-end gap-3">
        <span className="font-sans text-right text-pretty"
          style={{ fontSize: 15.5, color: VG_VT.paper, opacity: 0.92, maxWidth: "70%" }}>
          {turn.prompt}
        </span>
        <span aria-hidden style={{ width: 22, height: 1, background: vgRgba(rgb, 0.5), flexShrink: 0 }} />
      </div>

      {/* ── Archio's turn ─────────────────────────────────────────────── */}
      {isBuild && moduleId ? (
        <div className="flex flex-col gap-3">
          <p className="font-sans m-0 leading-relaxed" style={{ fontSize: 13, color: VG_VT.paperDim }}>
            {BUILD_ACK[moduleId]}
          </p>
          <div className="flex flex-col gap-1.5" aria-live="polite">
            {script.slice(0, logStep).map((line) => (
              <motion.div key={line}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center gap-2"
              >
                <span aria-hidden style={{ width: 3, height: 3, borderRadius: 999, background: vgRgba(rgb, 0.7) }} />
                <span style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.16em", color: vgRgba(rgb, 0.65) }}>
                  {line}
                </span>
              </motion.div>
            ))}
          </div>
          {built && <ArchioGeneratedModule accent={accent} moduleId={moduleId} />}
        </div>
      ) : isThinking ? (
        <NamedThinking rgb={rgb} states={live?.route?.thinking ?? ["Composing"]} reduced={reduced} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-start gap-3 text-left"
        >
          {/* readout — streams live, then settles */}
          <h3 className="font-sans m-0 text-balance"
            style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35, color: VG_VT.paper, letterSpacing: "-0.012em" }}>
            {envelope?.message ?? streamingVerdict}
            {streamingVerdict && !envelope && (
              <motion.span aria-hidden animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}
                style={{ color: vgRgba(rgb, 0.9) }}>▍</motion.span>
            )}
          </h3>

          {/* body */}
          {envelope?.body && (
            <p className="font-sans m-0 leading-relaxed text-pretty"
              style={{ fontSize: 13, color: VG_VT.paperDim, maxWidth: 620 }}>
              {envelope.body}
            </p>
          )}

          {/* ── TEMPLATE CANVAS — analysis mode only ──────────────────── */}
          {showTemplate && envelope && (
            <div className="w-full pt-2 pb-1">
              <ArchioTemplateCanvas
                templateId={route!.templateId}
                accent={accent}
                envelope={envelope}
                market={answer?.market ?? null}
                journal={answer?.journal ?? null}
              />
            </div>
          )}

          {/* actions + followUps — fireable pills */}
          {envelope && (envelope.actions.length > 0 || envelope.followUps.length > 0) && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {envelope.actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => onSuggest(a.command)}
                  className="cursor-pointer bg-transparent"
                  style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.26em", color: vgRgba(rgb, 0.9),
                    border: `1px solid ${vgRgba(rgb, 0.35)}`, borderRadius: 999, padding: "8px 18px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = vgRgba(rgb, 0.7)
                    e.currentTarget.style.background = vgRgba(rgb, 0.07)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = vgRgba(rgb, 0.35)
                    e.currentTarget.style.background = "transparent"
                  }}
                >
                  {a.label}
                </button>
              ))}
              {envelope.followUps.slice(0, envelope.actions.length ? 2 : 3).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onSuggest(f)}
                  className="cursor-pointer bg-transparent border-0"
                  style={{ ...MONO, fontSize: 9, letterSpacing: "0.2em", color: VG_VT.paperDim, padding: "8px 6px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = vgRgba(rgb, 0.9) }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = VG_VT.paperDim }}
                >
                  {f} ↗
                </button>
              ))}
            </div>
          )}

          {/* provenance whisper */}
          {(envelope || answer) && (
            <div style={{ ...MONO, fontSize: 8, letterSpacing: "0.3em", color: VG_VT.paperDim, opacity: 0.75 }}>
              {provenance}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   The chamber
   ──────────────────────────────────────────────────────────────────────── */
export interface ArchioCommandRoomProps {
  accent: ThemeAccent
  /** True only for free-text flow: isAnswering && viewport.activeId == null. */
  engaged: boolean
}

export function ArchioCommandRoom({ accent, engaged }: ArchioCommandRoomProps) {
  const ask     = useAskVantaryState()
  const reduced = useReducedMotion() ?? false
  const rgb     = accent.rgb
  const { result: live, fire: fireEngine, reset: resetEngine } = useArchio()

  const [turns, setTurns] = useState<Turn[]>([])
  const [followUp, setFollowUp] = useState("")
  const nextId    = useRef(1)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const lastSeen  = useRef("")

  /* Ingest each new submitted prompt from the FSM exactly once.
     BUILD prompts stay client-side; everything else fires the engine. */
  useEffect(() => {
    if (!ask.isAnswering) return
    const p = ask.prompt.trim()
    if (!p || p === lastSeen.current) return
    lastSeen.current = p
    const intent = routeIntent(p)
    setTurns((t) => [...t, { id: nextId.current++, prompt: p, intent }])
    if (intent.kind !== "build") void fireEngine(p)
  }, [ask.isAnswering, ask.prompt, fireEngine])

  /* Commit the finished engine result into the last conversation turn. */
  useEffect(() => {
    if (live.status !== "done") return
    setTurns((t) => {
      const last = t[t.length - 1]
      if (!last || last.intent.kind === "build" || last.answer) return t
      return [...t.slice(0, -1), { ...last, answer: live }]
    })
  }, [live])

  /* Reset history when the session fully clears (Esc / Clear). */
  useEffect(() => {
    if (ask.state === "idle" && turns.length > 0) {
      setTurns([]); lastSeen.current = ""; setFollowUp(""); resetEngine()
    }
  }, [ask.state, turns.length, resetEngine])

  /* Keep the newest turn in view (snap-pager: land on the last page). */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" })
  }, [turns, live.status, reduced])

  const lastTurn = turns[turns.length - 1]
  const engineBusy = lastTurn && lastTurn.intent.kind !== "build" && !lastTurn.answer &&
    (live.status === "routing" || live.status === "streaming")
  const phase: "composing" | "building" | "live" =
    engineBusy ? "composing"
    : lastTurn?.intent.kind === "build" ? "building"
    : "live"

  /* ANALYSIS answers need a taller frame than quick verdicts. */
  const lastMode = lastTurn?.answer?.route?.mode ?? (live.status !== "routing" ? live.route?.mode : null)
  const frameHeight = lastMode === "analysis" ? "min(58vh, 560px)" : "min(38vh, 360px)"

  const fire = useCallback((text: string) => {
    const p = text.trim()
    if (!p) return
    ask.submit(p)
    setFollowUp("")
  }, [ask])

  const onDockKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    fire(followUp)
  }, [fire, followUp])

  return (
    <AnimatePresence>
      {engaged && (
        <motion.section
          key="archio-chamber"
          aria-label="Archio Intelligence Chamber"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.94, y: -8 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scaleY: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.96, y: -6 }}
          transition={{ duration: 0.42, ease: EASE }}
          style={{ transformOrigin: "top center", width: "100%" }}
          className="flex flex-col gap-6"
        >
          <PresenceLine rgb={rgb} phase={phase} onExit={ask.clear} reduced={reduced} />

          {/* transcript — STRICT one-exchange pager per trader directive
              ("1 question by 1 question"): scroll-snap turns the frame into
              a paged viewer where each exchange fills 100% of the fixed
              frame, so no fragment of a neighboring answer (pill,
              provenance, …) can peek in. Scrolling up/down snaps WHOLE
              exchanges into view; the auto-scroll effect below always
              lands on the newest one. ANALYSIS answers get a taller frame. */}
          <div
            ref={scrollRef}
            className="flex flex-col w-full overflow-y-auto pr-1"
            style={{
              height: frameHeight,
              transition: "height 0.45s cubic-bezier(0.22,1,0.36,1)",
              scrollbarWidth: "thin",
              scrollSnapType: "y mandatory",
              overscrollBehavior: "contain",
            }}
          >
            {turns.map((t, i) => (
              <div
                key={t.id}
                className="flex flex-col justify-center shrink-0 w-full"
                style={{
                  /* each exchange owns the full frame — the snap page */
                  height: "100%",
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                  /* very tall answers scroll INSIDE their own page rather
                     than bleeding into the next exchange's frame */
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <TurnBlock
                  turn={t}
                  accent={accent}
                  isLast={i === turns.length - 1}
                  live={i === turns.length - 1 ? live : null}
                  onSuggest={fire}
                  reduced={reduced}
                />
              </div>
            ))}
          </div>

          {/* hairline follow-up dock */}
          <div className="w-full" style={{ borderTop: `1px solid ${vgRgba(rgb, 0.16)}`, paddingTop: 14 }}>
            <div className="flex items-center gap-3">
              <span aria-hidden style={{ width: 18, height: 1, background: vgRgba(rgb, 0.4) }} />
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={onDockKeyDown}
                placeholder={'Continue — ask, or command: build, show, review, forecast …'}
                aria-label="Ask Archio a follow-up"
                className="flex-1 bg-transparent border-0 outline-none font-sans"
                style={{ fontSize: 13.5, color: VG_VT.paper, caretColor: vgRgba(rgb, 0.9) }}
              />
              <button
                type="button"
                onClick={() => fire(followUp)}
                aria-label="Send follow-up"
                className="bg-transparent cursor-pointer flex items-center justify-center"
                style={{ width: 30, height: 30, borderRadius: 999,
                  border: `1px solid ${vgRgba(rgb, followUp.trim() ? 0.6 : 0.22)}`,
                  color: vgRgba(rgb, followUp.trim() ? 0.95 : 0.4), transition: "all 0.2s" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 18l-4-4 4-4M5 14h11a4 4 0 0 0 4-4V6"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    transform="scale(-1,1) translate(-24,0)" />
                </svg>
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
