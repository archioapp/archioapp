"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { LR, lrMix } from "./live-room-tokens"
import { LrEyebrow, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { PHASES, agoLabel } from "./session-state"

export const LR_REVEAL_EVENT = "lr:reveal-event"

/**
 * Scroll the timeline to an event card. The timeline lives in the inspector
 * and may not be the open card — the workspace listens for this event and
 * opens it first, so every "show me that call" lands on the stamped card.
 */
export function scrollToEvent(id: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent<string>(LR_REVEAL_EVENT, { detail: id }))
  const el = document.querySelector<HTMLElement>(`[data-lr-event="${id}"]`)
  el?.scrollIntoView({ block: "center", behavior: "smooth" })
}

export function PhaseRail({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const reduce = useReducedMotion()
  const activeIdx = PHASES.findIndex((p) => p.id === s.phase)
  const active = PHASES[activeIdx]
  const elapsedInPhase = agoLabel(s.phaseStartedAt, s.nowMin)

  return (
    <motion.nav
      aria-label="Session phase"
      className="relative px-4 py-3"
      initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: LR.enter.duration, ease: LR.ease, delay }}
    >
      <ol className="relative flex items-start justify-between" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {/* connector */}
        <span aria-hidden className="absolute left-[11px] right-[11px]" style={{ top: 10, height: 1, background: LR.dashed(LR.pane.border) }} />
        <motion.span
          aria-hidden
          className="absolute left-[11px]"
          style={{ top: 10, height: 1, background: LR.primary, opacity: 0.7, transformOrigin: "left" }}
          initial={false}
          animate={{ width: `calc(${(activeIdx / (PHASES.length - 1)) * 100}% - ${activeIdx === PHASES.length - 1 ? 22 : 11}px)` }}
          transition={{ duration: 0.8, ease: LR.ease }}
        />

        {PHASES.map((p, i) => {
          const done = i < activeIdx
          const isActive = i === activeIdx
          const start = s.phaseStarts[p.id]
          const clickable = Boolean(start)
          return (
            <li key={p.id} className="relative z-[1] flex flex-col items-center gap-2" style={{ width: 22 + 40 }}>
              <button
                type="button"
                disabled={!clickable}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${p.label} phase${start ? `, started ${agoLabel(start.at, s.nowMin)} ago` : ""}`}
                onClick={() => { if (start) { s.focusEvent(start.eventId); scrollToEvent(start.eventId) } }}
                className="relative inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2"
                style={{
                  width: 22, height: 22,
                  background: isActive ? LR.primary : done ? lrMix(LR.primary, 0.1) : "transparent",
                  border: `1px solid ${isActive ? LR.primary : done ? lrMix(LR.primary, 0.6) : LR.ashGhost}`,
                  color: isActive ? LR.primaryInk : done ? LR.primary : LR.ashGhost,
                  boxShadow: isActive ? LR.glow : "none",
                  cursor: clickable ? "pointer" : "default",
                  transition: "background 400ms ease, border-color 400ms ease, box-shadow 600ms ease",
                }}
              >
                {isActive && !reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1px solid ${lrMix(LR.primary, 0.5)}` }}
                    animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                {done ? <Check size={11} strokeWidth={2.5} /> : <span className="rounded-full" style={{ width: 5, height: 5, background: isActive ? LR.primaryInk : "transparent" }} />}
              </button>
              <LrEyebrow tone={isActive ? "paper" : done ? "primary" : "ash"} size={9} weight={isActive ? 600 : 500} style={{ opacity: !isActive && !done ? 0.7 : 1 }}>
                {p.label}
              </LrEyebrow>
            </li>
          )
        })}
      </ol>

      <div className="flex items-center justify-center gap-2 mt-2.5">
        <LrEyebrow tone="primary" size={9}>{active.label}</LrEyebrow>
        <span aria-hidden style={{ width: 3, height: 3, borderRadius: 999, background: LR.ashGhost }} />
        <span className="font-mono tabular-nums" style={{ fontSize: 10, color: LR.ashSoft, letterSpacing: "0.1em" }}>{elapsedInPhase}</span>
        <span aria-hidden style={{ width: 3, height: 3, borderRadius: 999, background: LR.ashGhost }} />
        <span className="font-sans" style={{ fontSize: 11, color: LR.ashSoft }}>{active.hint}</span>
      </div>
    </motion.nav>
  )
}
