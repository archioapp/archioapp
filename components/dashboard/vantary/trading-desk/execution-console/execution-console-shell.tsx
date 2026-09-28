"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · SHELL  (Phase 5 — pure consumer of the hoisted draft)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The live execution cockpit shell. Mounts inside the trading-desk right rail
 *  as the `execution-console` slot variant — a PEER of Active Windows, switched
 *  via the existing chip strip. Switching to Execute never reflows the chart.
 *
 *  As of Phase 5 the account + trade-draft PROVIDERS no longer live here — they
 *  are hoisted to `ExecutionShellProvider` at the trading-desk shell level so
 *  the always-visible Fast Entry bottom bar shares ONE draft with this rail.
 *  This shell is now a PURE CONSUMER: it reads `mode` / `onToggleLock` from
 *  `useExecutionShell()` and reads the live draft via the context the provider
 *  already supplies above it.
 *
 *  It registers a "pin me open" handler so the bottom bar can scroll the full
 *  ticket into view. The console scrolls internally and fills the rail height
 *  exactly, so it behaves identically in split, peek, and stacked placements.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS } from "./console-theme"
import { useExecutionShell } from "./execution-shell-context"
import { ExecutionCommandHeader } from "./execution-command-header"
import { ExecutionTicket } from "./execution-ticket"
import { FutureStations } from "./future-stations"

/* ─── THE EXECUTION CONSOLE SHELL ──────────────────────────────────────── */
export const ExecutionConsoleShell = memo(function ExecutionConsoleShell() {
  const { mode, onToggleLock, registerPinHandler } = useExecutionShell()
  const reduce = useReducedMotion()
  const accent = CONSOLE_ACCENTS[mode]

  // Allow the always-on bottom bar to pin this rail open + scroll the ticket
  // into view. The bar calls requestPinConsole() → this handler runs.
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const ticketRef = useRef<HTMLDivElement | null>(null)
  const pin = useCallback(() => {
    ticketRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }, [reduce])
  useEffect(() => {
    registerPinHandler(pin)
    return () => registerPinHandler(null)
  }, [registerPinHandler, pin])

  return (
    <div
      role="region"
      aria-label="Execution console"
      style={{
        position:      "relative",
        display:       "flex",
        flexDirection: "column",
        height:        "100%",
        background:    VANTARY.ink ?? VANTARY.paper,
        overflow:      "hidden",
      }}
    >
      {/* Mode-tinted ambient backdrop. Switches colour with the world. */}
      <AnimatePresence mode="wait">
        <motion.span
          key={mode}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(140% 50% at 50% 0%, ${accent.wash} 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />
      </AnimatePresence>

      {/* Scrollable station column. */}
      <div
        ref={scrollRef}
        style={{
          position: "relative",
          flex:     1,
          minHeight: 0,
          overflowY: "auto",
          padding:  "12px 12px 16px",
        }}
      >
        {/* COMMAND HEADER — crown eyebrow + identity + four glance numbers +
            go/no-go, with the rich station tucked behind a DETAILS disclosure. */}
        <ExecutionCommandHeader onToggleLock={onToggleLock} />

        {/* ── the live trade-build flow — Market → Direction → Risk, all bound
            to the ONE hoisted draft. ──────────────────────────────────────── */}
        <div ref={ticketRef} className="flex flex-col" style={{ gap: 14, marginTop: 14 }}>
          <ExecutionTicket />
        </div>

        {/* Remaining locked stations read as a deliberate checklist below. */}
        <div className="flex items-center gap-2" style={{ margin: "18px 0 11px" }}>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
          >
            FLIGHT CHECKLIST
          </span>
          <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule, opacity: 0.6 }} />
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashGhost }}
          >
            6 STATIONS
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <FutureStations mode={mode} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
})

export default ExecutionConsoleShell
