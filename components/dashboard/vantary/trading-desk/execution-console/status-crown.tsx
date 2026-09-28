"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · STATUS CROWN  (Station 0)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The single source of truth for MODE and SAFETY. Pinned to the top of the
 *  console, always visible. Blueprint §4 · Station 0.
 *
 *  Carries four things:
 *    1. MODE TOKEN     — a pill whose colour IS the console's accent this
 *                        session (grey / teal / gold / red). The whole panel
 *                        inherits this colour, so the trader's environment
 *                        literally changes colour when they go live.
 *    2. ACCOUNT IDENTITY — name, broker, balance, a breathing equity spark.
 *    3. THE SAFETY PIP — the one dot that survives even in minimized mode.
 *    4. LIVE ARMING CONTROL — locked by default. In Phase 1 this is a real
 *                        lock/unlock toggle that flips live-locked ↔ live-ready
 *                        but is wired to NO execution path (blueprint Phase 1
 *                        rule: do not fake live execution).
 *
 *  Everything reads its colour from CONSOLE_ACCENTS so the crown can never
 *  drift out of sync with the rest of the console.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Lock, Unlock, Plug, FlaskConical, Zap, ShieldAlert } from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import {
  CONSOLE_ACCENTS,
  CONSOLE_DEMO_ACCOUNTS,
  type ConsoleMode,
  type ConsoleDemoAccount,
} from "./console-theme"

/* ─── Mode glyph ───────────────────────────────────────────────────────── */
function ModeGlyph({ mode, color }: { mode: ConsoleMode; color: string }) {
  const common = { size: 12, strokeWidth: 1.7, color } as const
  switch (mode) {
    case "disconnected": return <Plug {...common} />
    case "simulation":   return <FlaskConical {...common} />
    case "live-ready":
    case "live-locked":  return <Zap {...common} />
    case "blocked":      return <ShieldAlert {...common} />
  }
}

/* ─── Breathing equity micro-spark ─────────────────────────────────────── */
const MicroSpark = memo(function MicroSpark({
  series,
  color,
}: {
  series: number[]
  color: string
}) {
  if (series.length < 2) return null
  const w = 100
  const h = 28
  const stride = w / (series.length - 1)
  const pts = series
    .map((v, i) => `${(i * stride).toFixed(2)},${((1 - v) * h).toFixed(2)}`)
    .join(" ")
  const lastY = (1 - series[series.length - 1]) * h
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      width="100%"
      height={h}
      aria-hidden
      style={{ display: "block" }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.3}
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
      />
      <circle cx={w} cy={lastY} r={1.7} fill={color} vectorEffect="non-scaling-stroke" />
    </svg>
  )
})

/* ─── The safety pip — the single dot that survives in minimized mode ──── */
export const SafetyPip = memo(function SafetyPip({
  mode,
  size = 8,
}: {
  mode: ConsoleMode
  size?: number
}) {
  const accent = CONSOLE_ACCENTS[mode]
  const reduce = useReducedMotion()
  const shouldPulse = !reduce && (mode === "blocked" || mode === "live-ready")
  return (
    <span style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {shouldPulse && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: accent.base,
          }}
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: accent.base,
          boxShadow: `0 0 8px ${accent.halo}`,
        }}
      />
    </span>
  )
})

/* ─── The mode pill ────────────────────────────────────────────────────── */
export function ModePill({ mode }: { mode: ConsoleMode }) {
  const accent = CONSOLE_ACCENTS[mode]
  return (
    <span
      className="font-mono uppercase inline-flex items-center gap-1.5"
      style={{
        padding:       "4px 9px",
        fontSize:      9.5,
        letterSpacing: "0.2em",
        fontWeight:    500,
        color:         accent.base,
        background:    accent.wash,
        border:        `1px solid ${accent.halo}`,
        borderRadius:  999,
        whiteSpace:    "nowrap",
      }}
    >
      <ModeGlyph mode={mode} color={accent.base} />
      {accent.token}
    </span>
  )
}

/* ─── Live arming control ──────────────────────────────────────────────── */
export function LiveArmingControl({
  mode,
  onToggleLock,
}: {
  mode: ConsoleMode
  onToggleLock: () => void
}) {
  const accent = CONSOLE_ACCENTS[mode]

  // Only meaningful in the two live states. In sim / disconnected we render
  // a quiet, disabled hint so the control's HOME is always visible (the
  // trader learns where "go live" will live) without being actionable.
  const isLiveWorld = mode === "live-ready" || mode === "live-locked"
  const armed = mode === "live-ready"

  if (!isLiveWorld) {
    return (
      <span
        className="font-mono uppercase inline-flex items-center gap-1.5"
        title="Connect a live account to arm execution"
        style={{
          padding:       "4px 8px",
          fontSize:      8.5,
          letterSpacing: "0.18em",
          color:         VANTARY.ashGhost,
          border:        `1px dashed ${VANTARY.rule}`,
          borderRadius:  6,
          whiteSpace:    "nowrap",
          cursor:        "default",
        }}
      >
        <Lock size={10} strokeWidth={1.6} color={VANTARY.ashGhost} />
        LIVE LOCK
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggleLock}
      aria-pressed={armed}
      aria-label={armed ? "Lock live execution" : "Unlock live execution"}
      className="font-mono uppercase inline-flex items-center gap-1.5"
      style={{
        padding:       "4px 9px",
        fontSize:      8.5,
        letterSpacing: "0.18em",
        fontWeight:    500,
        color:         accent.base,
        background:    armed ? accent.wash : "transparent",
        border:        `1px solid ${armed ? accent.halo : VANTARY.rule}`,
        borderRadius:  6,
        cursor:        "pointer",
        whiteSpace:    "nowrap",
        transition:    "background 0.18s, border-color 0.18s, color 0.18s",
      }}
    >
      {armed
        ? <Unlock size={10} strokeWidth={1.7} color={accent.base} />
        : <Lock   size={10} strokeWidth={1.7} color={accent.base} />}
      {armed ? "ARMED" : "LOCKED"}
    </button>
  )
}

/* ─── THE STATUS CROWN ─────────────────────────────────────────────────── */
export interface StatusCrownProps {
  mode: ConsoleMode
  onToggleLock: () => void
  /** When the Account station has a live selection, it overrides the demo
   *  identity so the crown reflects the REAL chosen account. Falls back to
   *  the per-mode demo account when null (e.g. nothing selected yet). */
  account?: ConsoleDemoAccount | null
}

export const StatusCrown = memo(function StatusCrown({
  mode,
  onToggleLock,
  account: accountOverride,
}: StatusCrownProps) {
  const accent  = CONSOLE_ACCENTS[mode]
  const account = accountOverride ?? CONSOLE_DEMO_ACCOUNTS[mode]
  const reduce  = useReducedMotion()

  const balanceLabel = useMemo(() => {
    if (account.balance === 0) return "—"
    return `${account.currency === "USD" ? "$" : ""}${account.balance.toLocaleString("en-US")}`
  }, [account])

  return (
    <header
      role="banner"
      aria-label={`Execution console status — ${accent.token}`}
      style={{
        position:   "relative",
        flexShrink: 0,
        padding:    "12px 14px 13px",
        background: VANTARY.glassStrong,
        borderBottom: `1px solid ${VANTARY.rule}`,
        // The crown's top-edge light is the mode's signature glow — this is
        // the "the room changes colour when you go live" cue.
        boxShadow:  accent.glow,
        overflow:   "hidden",
      }}
    >
      {/* Ambient mode wash — a barely-there tint that bleeds the accent into
          the crown background. Breathes slowly so the resting state feels
          alive without demanding attention. */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 80% at 100% 0%, ${accent.wash} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Row 1 — eyebrow + mode pill */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono uppercase inline-flex items-center gap-1.5"
            style={{ fontSize: 9, letterSpacing: "0.24em", color: VANTARY.ashSoft }}
          >
            <SafetyPip mode={mode} />
            EXECUTION CONSOLE
          </span>
          <span aria-hidden style={{ flex: 1 }} />
          <ModePill mode={mode} />
        </div>

        {/* Row 2 — account identity + arming */}
        <div className="flex items-end gap-3" style={{ marginTop: 11 }}>
          {/* Account block */}
          <div className="flex flex-col" style={{ minWidth: 0, flex: 1 }}>
            <span
              className="font-mono uppercase truncate"
              style={{ fontSize: 8.5, letterSpacing: "0.2em", color: VANTARY.ashSoft }}
            >
              {account.broker}
            </span>
            <span
              className="font-sans truncate"
              style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500, marginTop: 2 }}
            >
              {account.name}
            </span>
          </div>

          {/* Balance + spark */}
          <div className="flex flex-col items-end" style={{ width: 116, flexShrink: 0 }}>
            <span
              className="font-mono tabular-nums"
              style={{
                fontSize:      16,
                lineHeight:    1,
                color:         account.balance === 0 ? VANTARY.ashSoft : VANTARY.paper,
                fontWeight:    500,
                letterSpacing: "-0.01em",
              }}
            >
              {balanceLabel}
            </span>
            <div style={{ width: "100%", marginTop: 4, opacity: account.balance === 0 ? 0.3 : 1 }}>
              <MicroSpark series={account.spark} color={accent.base} />
            </div>
          </div>
        </div>

        {/* Row 3 — caption + arming control */}
        <div className="flex items-center gap-2" style={{ marginTop: 11 }}>
          <span
            className="font-sans italic truncate"
            style={{ fontSize: 11, color: VANTARY.paperDim, flex: 1, minWidth: 0 }}
          >
            {accent.caption}
          </span>
          <LiveArmingControl mode={mode} onToggleLock={onToggleLock} />
        </div>
      </div>
    </header>
  )
})
