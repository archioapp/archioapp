"use client"

/**
 * LIVE ROOM — Decision Replay + Room Pulse
 *
 * Two lanes under the chart that share its x-axis (x = at / nowMin, with
 * the chart's 12px / 64px plot padding):
 *
 *   ReplayScrubber  — a slider whose ticks are the events. Dragging sets
 *                     the cutoff; every projection in the room re-derives
 *                     at that minute. Release snaps to the nearest event so
 *                     the viewer lands on decisions, not between them.
 *   PulseLane       — one bar per event, height = reactions. Where the
 *                     room cared. Hover → the event lights everywhere.
 */

import * as React from "react"
import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { LR, lrMix, toneColor } from "./live-room-tokens"
import { LrEyebrow, LrChip, LrLiveDot, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { clockLabel, eventTone, type SessionEvent } from "./session-state"
import { scrollToEvent } from "./phase-rail"

export const PLOT_PAD = { left: 12, right: 64 }

function useTrackX(ref: React.RefObject<HTMLDivElement | null>) {
  const [w, setW] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [ref])
  return w
}

/* ── replay scrubber ───────────────────────────────────────────────────── */
export function ReplayScrubber() {
  const s = useSession()
  const reduce = useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const w = useTrackX(ref)
  const plotW = Math.max(1, w - PLOT_PAD.left - PLOT_PAD.right)
  const xOf = (min: number) => PLOT_PAD.left + Math.max(0, Math.min(1, min / Math.max(1, s.nowMin))) * plotW
  const minOf = (x: number) => Math.max(0, Math.min(s.nowMin, ((x - PLOT_PAD.left) / plotW) * s.nowMin))
  const ticks = React.useMemo(() => [...s.events].sort((a, b) => a.at - b.at), [s.events])
  const [dragging, setDragging] = React.useState(false)
  const headX = xOf(s.viewMin)
  const known = s.knownEvents.length

  const snap = (min: number): number | null => {
    if (s.nowMin - min < (6 / plotW) * s.nowMin) return null
    let best: SessionEvent | null = null
    let bestD = Infinity
    for (const t of ticks) { const d = Math.abs(xOf(t.at) - xOf(min)); if (d < bestD) { bestD = d; best = t } }
    return best && bestD <= 7 ? best.at + 0.5 : min
  }

  const fromPointer = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    return minOf(e.clientX - r.left)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    s.setCutoff(fromPointer(e))
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => { if (dragging) s.setCutoff(fromPointer(e)) }
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
    s.setCutoff(snap(fromPointer(e)))
  }

  const stepEvent = (dir: 1 | -1) => {
    const cur = s.viewMin
    const next = dir > 0 ? ticks.find((t) => t.at > cur + 0.01) : [...ticks].reverse().find((t) => t.at < cur - 0.6)
    if (dir > 0 && !next) { s.setCutoff(null); return }
    if (next) s.setCutoff(next.at + 0.5)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); stepEvent(1) }
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); stepEvent(-1) }
    else if (e.key === "Home") { e.preventDefault(); s.setCutoff(ticks[0] ? ticks[0].at + 0.5 : 0) }
    else if (e.key === "End" || e.key === "Escape") { e.preventDefault(); s.setCutoff(null) }
  }

  const headTone = s.replaying ? toneColor("warn") : LR.primary

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-2 min-w-0" style={{ paddingLeft: PLOT_PAD.left, paddingRight: 8 }}>
        <LrEyebrow tone={s.replaying ? "warn" : "ash"} size={9}>{s.replaying ? "Decision replay" : "Replay"}</LrEyebrow>
        <span className="font-mono tabular-nums" style={{ fontSize: 10, color: LR.paperDim }}>
          {s.replaying ? <>{clockLabel(s.viewMin)} · <span style={{ color: toneColor("warn") }}>{known} of {s.events.length} events known</span></> : "Drag the head back to see what the room knew"}
        </span>
        <span className="flex-1" />
        {s.replaying && (
          <LrChip tone="warn" active size={9} glyph={<RotateCcw size={10} />} onClick={() => s.setCutoff(null)} pill>Return to live</LrChip>
        )}
      </div>

      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Decision replay — scrub through the session"
        aria-valuemin={0}
        aria-valuemax={Math.round(s.nowMin)}
        aria-valuenow={Math.round(s.viewMin)}
        aria-valuetext={`${clockLabel(s.viewMin)} · ${known} events known${s.replaying ? "" : " · live"}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative w-full select-none cursor-ew-resize focus:outline-none rounded-lg"
        style={{ height: 34, touchAction: "none" }}
      >
        {/* base track */}
        <span aria-hidden className="absolute" style={{ left: PLOT_PAD.left, right: PLOT_PAD.right, top: 17, height: 1, background: LR.dashed(lrMix(LR.paper, 0.14)) }} />
        {/* known portion */}
        <motion.span aria-hidden className="absolute" style={{ left: PLOT_PAD.left, top: 17, height: 1, background: `linear-gradient(90deg, ${lrMix(headTone, 0.3)}, ${headTone})` }} animate={{ width: Math.max(0, headX - PLOT_PAD.left) }} transition={dragging || reduce ? { duration: 0 } : { duration: 0.24, ease: LR.ease }} />
        {/* future portion, while replaying */}
        {s.replaying && <span aria-hidden className="absolute" style={{ left: headX, right: PLOT_PAD.right, top: 17, height: 1, background: LR.dashed(lrMix(LR.ashSoft, 0.4)) }} />}

        {/* event ticks */}
        {ticks.map((t) => {
          const x = xOf(t.at)
          const known = t.at <= s.viewMin + 0.001
          const h = t.importance >= 5 ? 12 : t.importance >= 4 ? 9 : t.importance >= 3 ? 7 : 4
          const c = t.type === "warning" ? toneColor("warn") : t.mentor ? (t.type === "entry" || t.type === "exit" ? toneColor("up") : LR.primary) : LR.ashSoft
          const lit = s.hoveredEvent === t.id || s.focusedEvent === t.id || s.litEvents.has(t.id)
          return (
            <span
              key={t.id}
              aria-hidden
              className="absolute"
              style={{ left: x - 0.75, top: 17 - h / 2, width: 1.5, height: h, background: known ? c : lrMix(c, 0.35), opacity: known ? (lit ? 1 : 0.85) : 0.5, boxShadow: lit ? `0 0 6px ${c}` : "none", borderRadius: 1, transition: "opacity 200ms, box-shadow 200ms" }}
            />
          )
        })}

        {/* head */}
        <motion.span
          aria-hidden
          className="absolute flex items-center justify-center"
          style={{ top: 17 - 9, width: 18, height: 18, marginLeft: -9, borderRadius: 999, background: lrMix(headTone, 0.16), border: `1px solid ${lrMix(headTone, 0.7)}`, boxShadow: `0 0 10px ${lrMix(headTone, 0.4)}` }}
          animate={{ left: headX, scale: dragging ? 1.15 : 1 }}
          transition={dragging || reduce ? { duration: 0 } : { duration: 0.24, ease: LR.ease }}
        >
          <span className="block rounded-full" style={{ width: 6, height: 6, background: headTone }} />
        </motion.span>

        {/* edge labels */}
        <span className="absolute font-mono tabular-nums pointer-events-none" style={{ left: PLOT_PAD.left, bottom: -1, fontSize: 9, color: LR.ashSoft, letterSpacing: "0.08em" }}>{clockLabel(0)}</span>
        <span className="absolute font-mono tabular-nums pointer-events-none inline-flex items-center gap-1.5" style={{ right: 4, top: 12, fontSize: 9, color: s.replaying ? LR.ashSoft : LR.down, letterSpacing: "0.08em" }}>
          {!s.replaying && <LrLiveDot tone="down" size={5} />}NOW {clockLabel(s.nowMin)}
        </span>
      </div>
    </div>
  )
}

/* ── pulse lane ────────────────────────────────────────────────────────── */
export function PulseLane() {
  const s = useSession()
  const ref = React.useRef<HTMLDivElement>(null)
  const w = useTrackX(ref)
  const plotW = Math.max(1, w - PLOT_PAD.left - PLOT_PAD.right)
  const xOf = (min: number) => PLOT_PAD.left + Math.max(0, Math.min(1, min / Math.max(1, s.nowMin))) * plotW
  const max = Math.max(1, ...s.pulse.map((p) => p.reactions))
  const H = 30
  const peak = s.pulse.reduce((a, b) => (b.reactions > a.reactions ? b : a), s.pulse[0])

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-2" style={{ paddingLeft: PLOT_PAD.left, paddingRight: 8 }}>
        <LrEyebrow size={9}>Room pulse</LrEyebrow>
        <span className="font-mono tabular-nums" style={{ fontSize: 10, color: LR.paperDim }}>
          reactions per event{peak ? <> · peak <span style={{ color: LR.primary }}>{peak.reactions}</span> at {clockLabel(peak.at)}</> : null}
        </span>
      </div>
      <div ref={ref} className="relative w-full" style={{ height: H }} role="list" aria-label="Audience reactions per event">
        <span aria-hidden className="absolute" style={{ left: PLOT_PAD.left, right: PLOT_PAD.right, bottom: 0, height: 1, background: lrMix(LR.paper, 0.08) }} />
        {s.pulse.map((p) => {
          const e = s.events.find((x) => x.id === p.id)
          if (!e) return null
          const x = xOf(p.at)
          const h = Math.max(3, (p.reactions / max) * (H - 4))
          const c = p.mentor ? (eventTone(e) === "warn" ? toneColor("warn") : LR.primary) : LR.ashSoft
          const lit = s.hoveredEvent === p.id || s.focusedEvent === p.id || s.litEvents.has(p.id)
          const future = p.at > s.viewMin + 0.001
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              aria-label={`${e.title} — ${p.reactions} reactions at ${clockLabel(p.at)}`}
              className="absolute bottom-0 focus:outline-none"
              style={{ left: x - 4, width: 8, height: H, background: "transparent" }}
              onMouseEnter={() => s.dispatch({ type: "hoverEvent", id: p.id })}
              onMouseLeave={() => s.dispatch({ type: "hoverEvent", id: null })}
              onFocus={() => s.dispatch({ type: "hoverEvent", id: p.id })}
              onBlur={() => s.dispatch({ type: "hoverEvent", id: null })}
              onClick={() => { s.focusEvent(p.id); window.setTimeout(() => scrollToEvent(p.id), 40) }}
            >
              <motion.span
                aria-hidden
                className="absolute left-[2px] bottom-0 rounded-t-[2px]"
                style={{ width: 4, background: lit ? c : lrMix(c, 0.55), boxShadow: lit ? `0 0 8px ${lrMix(c, 0.6)}` : "none", opacity: future ? 0.25 : 1, transition: "opacity 200ms, background 200ms, box-shadow 200ms" }}
                animate={{ height: lit ? h + 3 : h }}
                transition={{ duration: 0.2, ease: LR.ease }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
