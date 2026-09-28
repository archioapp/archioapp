"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  SESSION DEBRIEF OVERLAY · MILESTONE 9
 *  ─────────────────────────────────────────────────────────────────────────
 *  An auto-surfacing, dock-style card that slides in from the bottom-right
 *  during the final stretch of any active trading session. The intent is
 *  to interrupt the trader's instinct to keep clicking buttons just as the
 *  session winds down, and instead invite them into a structured 30-second
 *  debrief while the tape is still fresh in their head.
 *
 *  Trigger contract
 *  ────────────────
 *    · Reads the live UTC clock from the shared <ClockSpineProvider>.
 *    · Determines the active session via the same SESSION_DEFS table the
 *      command palette uses (Pre-LDN, LDN-KZ, LDN-NY, NY-KZ, LDN-CLS,
 *      Post-NY, OFF). Falls back gracefully if no session is live.
 *    · Surfaces the overlay only when:
 *           remainingMin <= ACTIVATION_WINDOW_MIN  AND
 *           !hasBeenDismissed(sessionKey, dateUTC) AND
 *           !isSnoozedUntil(now)
 *      Default ACTIVATION_WINDOW_MIN is 8 minutes, configurable via prop.
 *    · While the overlay is up, a thin amber progress bar across the top
 *      drains in real time (1-second resolution via the spine's second
 *      clock) so the trader sees the close approaching.
 *
 *  Persistence & quiet-hours
 *  ─────────────────────────
 *    · Dismiss → localStorage key `vantary-debrief-dismissed:<sessionKey>:<dateUTC>`
 *      so the overlay never re-appears for the same (session, day) pair.
 *    · Snooze 5m → in-memory `snoozedUntil` ref. Resets on hard reload by
 *      design — snoozing across reloads would be too sticky.
 *    · Begin debrief → fires a `vantary:begin-debrief` custom event with
 *      the active session payload, then closes the overlay. Other modules
 *      (Vantary Oracle, future SignalTerminal) can listen and react.
 *
 *  Visual language
 *  ───────────────
 *    Brutalist editorial. 1 px hairlines. Mono caps for chips and meta.
 *    Amber accent on stats that beat target; ash-soft on neutral metrics.
 *    A top-strip "drain" progress bar in amber pulses with the second
 *    clock. Card lives at fixed bottom-right with a soft float-in entry
 *    that respects prefers-reduced-motion.
 *
 *  Mount instructions
 *  ──────────────────
 *      <ClockSpineProvider>
 *        <SecondClockProvider>
 *          <SessionDebriefOverlay />            ← drop once, anywhere
 *          ...
 *        </SecondClockProvider>
 *      </ClockSpineProvider>
 *
 *  Tunables (props)
 *  ────────────────
 *    activationWindowMin   default 8        Activation threshold in minutes.
 *    snoozeMinutes         default 5        How long Snooze suppresses for.
 *    enabled               default true     Master kill-switch (e.g. for tests).
 * ═══════════════════════════════════════════════════════════════════════ */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Mic, Clock4, Target, ShieldCheck, Sparkles } from "lucide-react"
import { VANTARY, EASE_V } from "./vantary-theme"
import { useUTCClock, useUTCSecondClock } from "./clock-spine"

/* ─────────────────────────────────────────────────────────────────────────
 *  Session table · same as command-palette.tsx so the overlay can stand
 *  alone without introducing a circular import. If your-space.tsx ever
 *  exports the canonical table, replace this with the import.
 * ───────────────────────────────────────────────────────────────────────── */

interface SessionDef {
  key: string
  short: string
  long: string
  startUTC: number
  endUTC: number      // may be > 24 to express a wrap (e.g. 21..29 = 21..05)
  isKZ: boolean
  thesis: string
}

const SESSIONS: SessionDef[] = [
  { key: "PRE-LDN", short: "PRE-LDN", long: "Pre-London",        startUTC:  5, endUTC:  7, isKZ: false, thesis: "Asia range marked. London bias locked." },
  { key: "LDN",     short: "LDN-KZ",  long: "London Killzone",   startUTC:  7, endUTC: 10, isKZ: true,  thesis: "Displacement window. Bias confirmation."  },
  { key: "LDN-NY",  short: "LDN-NY",  long: "London-NY Gap",     startUTC: 10, endUTC: 13, isKZ: false, thesis: "Low-volume bridge. Levels hold." },
  { key: "NY",      short: "NY-KZ",   long: "New York Killzone", startUTC: 13, endUTC: 15, isKZ: true,  thesis: "Prime US execution window."  },
  { key: "LDN-CLS", short: "LDN-CLS", long: "London Close",      startUTC: 15, endUTC: 16, isKZ: false, thesis: "London exits. Manage open trades." },
  { key: "POST-NY", short: "POST-NY", long: "Post-NY",           startUTC: 16, endUTC: 21, isKZ: false, thesis: "Late drift. Tape thins out." },
  { key: "OFF",     short: "OFF",     long: "Off Hours",         startUTC: 21, endUTC: 29, isKZ: false, thesis: "Asia regime. Range establishment." },
]

/* ─────────────────────────────────────────────────────────────────────────
 *  Session resolver · returns the active session and a precise minutes-to-
 *  close counter at second resolution. Handles wrap-around windows.
 * ───────────────────────────────────────────────────────────────────────── */

interface ActiveSessionSnap {
  def: SessionDef
  totalMin: number
  elapsedMin: number
  remainingMin: number
  remainingSec: number
  /** 0..1 */
  progress: number
}

function resolveActiveSession(now: Date): ActiveSessionSnap | null {
  const utcH = now.getUTCHours()
  const utcM = now.getUTCMinutes()
  const utcS = now.getUTCSeconds()
  const hourFrac = utcH + utcM / 60 + utcS / 3600

  for (const s of SESSIONS) {
    const start = s.startUTC
    const end   = s.endUTC > 24 ? s.endUTC - 24 : s.endUTC
    const wraps = s.endUTC > 24 || start >= end
    const inWindow = wraps
      ? (hourFrac >= start || hourFrac < end)
      : (hourFrac >= start && hourFrac < end)

    if (!inWindow) continue

    const totalH    = wraps ? (24 - start + end) : (end - start)
    const offsetH   = wraps
      ? (hourFrac >= start ? hourFrac - start : 24 - start + hourFrac)
      : (hourFrac - start)
    const totalMin    = totalH   * 60
    const elapsedMin  = Math.floor(offsetH * 60)
    const remainingSec = Math.max(0, Math.round((totalH - offsetH) * 3600))
    const remainingMin = Math.ceil(remainingSec / 60)
    const progress    = Math.max(0, Math.min(1, offsetH / totalH))

    return { def: s, totalMin, elapsedMin, remainingMin, remainingSec, progress }
  }
  return null
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Persistence helpers · localStorage-backed dismissal per (session, day).
 * ───────────────────────────────────────────────────────────────────────── */

const DISMISSED_PREFIX = "vantary-debrief-dismissed:"

function dateUTCKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
}

function readDismissedKey(sessionKey: string, dateKey: string): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(`${DISMISSED_PREFIX}${sessionKey}:${dateKey}`) === "1"
  } catch {
    return false
  }
}

function writeDismissedKey(sessionKey: string, dateKey: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(`${DISMISSED_PREFIX}${sessionKey}:${dateKey}`, "1")
  } catch { /* quota / disabled */ }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Mock session metrics · stand-in for the eventual live trade store.
 *  Pure function of the session key so the rendered numbers feel stable
 *  while the user watches the overlay (don't flip every render).
 * ───────────────────────────────────────────────────────────────────────── */

interface SessionMetrics {
  pl: number             // P&L in $
  plDelta: number        // delta vs. session target (>0 ahead)
  ruleAdherencePct: number  // 0..100
  ruleAdherenceDelta: number // delta vs 7-day average (>0 better)
  aPlusCount: number     // count of A+ rated trades this session
  totalTrades: number
  topSetupLabel: string
  topSetupRMultiple: number
  disciplineLine: string
}

function buildMetrics(sessionKey: string): SessionMetrics {
  // Deterministic-but-varied values keyed off the session string. Seeded
  // hash is enough — these numbers are illustrative, not analytical.
  let h = 0
  for (let i = 0; i < sessionKey.length; i++) {
    h = (h * 31 + sessionKey.charCodeAt(i)) >>> 0
  }
  const seedFloat = (n: number) => ((h >> n) & 0xff) / 255

  const pl = Math.round((seedFloat(0) - 0.4) * 720)     // -288..+432
  const plDelta = Math.round((seedFloat(2) - 0.45) * 220)
  const ruleAdherencePct = Math.round(72 + seedFloat(4) * 26)   // 72..98
  const ruleAdherenceDelta = Math.round((seedFloat(6) - 0.4) * 18)
  const totalTrades = Math.max(1, Math.round(2 + seedFloat(8) * 5))
  const aPlusCount  = Math.min(totalTrades, Math.round(seedFloat(10) * totalTrades))
  const topSetupRMultiple = Math.round((seedFloat(12) * 4 + 0.6) * 10) / 10

  const setups = ["IFVG-PD reversion", "Equal-highs sweep", "Order-block return",
                   "Liquidity grab", "BPR continuation", "FVG mean revert"]
  const topSetupLabel = setups[h % setups.length]

  const onPlan = Math.max(0, totalTrades - Math.round(seedFloat(14) * 2))
  const disciplineLine = onPlan === totalTrades
    ? `All ${totalTrades} trades inside the plan.`
    : `${onPlan} of ${totalTrades} trades inside the plan, ${totalTrades - onPlan} outside.`

  return {
    pl, plDelta, ruleAdherencePct, ruleAdherenceDelta,
    aPlusCount, totalTrades, topSetupLabel, topSetupRMultiple, disciplineLine,
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Public component
 * ───────────────────────────────────────────────────────────────────────── */

export interface SessionDebriefOverlayProps {
  /** Surface the overlay this many minutes before session close. */
  activationWindowMin?: number
  /** Snooze button suppresses for this many minutes (in-memory only). */
  snoozeMinutes?: number
  /** Master switch — set to false to disable the overlay entirely. */
  enabled?: boolean
}

export function SessionDebriefOverlay({
  activationWindowMin = 8,
  snoozeMinutes = 5,
  enabled = true,
}: SessionDebriefOverlayProps) {
  const reduceMotion = useReducedMotion() ?? false

  // ── Clocks ───────────────────────────────────────────────────────────
  const minute = useUTCClock()                       // updates each minute
  const secondNow = useUTCSecondClock()              // updates each second

  // ── Active session ───────────────────────────────────────────────────
  // Recompute on each second tick so the progress bar drains in real time.
  const active = useMemo(() => resolveActiveSession(secondNow), [secondNow])

  // ── Suppression refs ─────────────────────────────────────────────────
  const snoozedUntilRef = useRef<number>(0)         // epoch ms

  // ── Open state ───────────────────────────────────────────────────────
  // Open when: enabled AND in window AND not dismissed AND not snoozed AND
  // we have an active session with a remainingMin <= activationWindowMin.
  // We separate "should be open" from "open" via an effect so the user's
  // explicit dismiss/snooze takes precedence over the auto-trigger.
  const [openSessionKey, setOpenSessionKey] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      if (openSessionKey) setOpenSessionKey(null)
      return
    }
    if (!active) {
      if (openSessionKey) setOpenSessionKey(null)
      return
    }
    const inActivationWindow = active.remainingMin <= activationWindowMin
    if (!inActivationWindow) {
      if (openSessionKey) setOpenSessionKey(null)
      return
    }
    const dKey = dateUTCKey(secondNow)
    if (readDismissedKey(active.def.key, dKey)) {
      if (openSessionKey) setOpenSessionKey(null)
      return
    }
    if (Date.now() < snoozedUntilRef.current) {
      if (openSessionKey) setOpenSessionKey(null)
      return
    }
    if (openSessionKey !== active.def.key) {
      setOpenSessionKey(active.def.key)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, active?.def.key, active?.remainingMin, activationWindowMin, secondNow])

  // ── Metrics · keyed off the session so they don't churn frame-to-frame ─
  const metrics = useMemo(
    () => (openSessionKey ? buildMetrics(openSessionKey) : null),
    [openSessionKey],
  )

  // ── Progress bar fill (0..1) drains over time ────────────────────────
  const drainPct = useMemo(() => {
    if (!active) return 0
    if (active.remainingMin > activationWindowMin) return 0
    const totalSec = activationWindowMin * 60
    const remainingSec = Math.max(0, active.remainingSec)
    return Math.max(0, Math.min(1, remainingSec / totalSec))
  }, [active, activationWindowMin])

  // ── Action handlers ──────────────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    if (active) {
      writeDismissedKey(active.def.key, dateUTCKey(secondNow))
    }
    setOpenSessionKey(null)
  }, [active, secondNow])

  const handleSnooze = useCallback(() => {
    snoozedUntilRef.current = Date.now() + snoozeMinutes * 60_000
    setOpenSessionKey(null)
  }, [snoozeMinutes])

  const handleBeginDebrief = useCallback(() => {
    if (typeof window !== "undefined" && active && metrics) {
      window.dispatchEvent(new CustomEvent("vantary:begin-debrief", {
        detail: {
          sessionKey: active.def.key,
          sessionLong: active.def.long,
          metrics,
          remainingMin: active.remainingMin,
        },
      }))
    }
    if (active) writeDismissedKey(active.def.key, dateUTCKey(secondNow))
    setOpenSessionKey(null)
  }, [active, metrics, secondNow])

  // ── Esc closes ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!openSessionKey) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openSessionKey, handleDismiss])

  if (!openSessionKey || !active || !metrics) return null

  return (
    <AnimatePresence>
      <motion.aside
        key={`debrief-${openSessionKey}`}
        role="region"
        aria-label={`${active.def.long} debrief — ${active.remainingMin} minutes to close`}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.34, ease: EASE_V }}
        className="fixed bottom-6 right-6 z-[900] flex flex-col font-sans"
        style={{
          width: 380,
          maxWidth: "calc(100vw - 48px)",
          background: VANTARY.glassDeep,
          border: `1px solid ${VANTARY.ruleStrong}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.32)",
        }}
      >
        {/* ── Drain bar · top edge ─────────────────────────────────── */}
        <div
          aria-hidden
          className="relative"
          style={{ height: 2, background: VANTARY.rule }}
        >
          <motion.div
            className="absolute left-0 top-0 bottom-0"
            style={{
              background: VANTARY.amber,
              boxShadow: `0 0 6px ${VANTARY.amber}`,
            }}
            animate={{ width: `${drainPct * 100}%` }}
            transition={{ duration: 1.0, ease: "linear" }}
          />
        </div>

        {/* ── Header strip ─────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${VANTARY.rule}`,
          }}
        >
          <div className="flex items-center gap-2">
            <motion.span
              aria-hidden
              className="rounded-full"
              style={{
                width: 5, height: 5,
                background: VANTARY.amber,
                boxShadow: `0 0 5px ${VANTARY.amber}`,
                display: "inline-block",
              }}
              animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
              transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.26em", color: VANTARY.amber, fontWeight: 500 }}
            >
              SESSION DEBRIEF
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
            >
              · {active.def.short}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss debrief"
            className="flex items-center justify-center focus:outline-none"
            style={{
              width: 18, height: 18,
              border: `1px solid ${VANTARY.rule}`,
              background: "transparent",
              cursor: "pointer",
              transition: "color 180ms, border-color 180ms",
              color: VANTARY.ashSoft,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = VANTARY.amber
              e.currentTarget.style.borderColor = VANTARY.amberHalo
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = VANTARY.ashSoft
              e.currentTarget.style.borderColor = VANTARY.rule
            }}
          >
            <X size={11} strokeWidth={1.75} />
          </button>
        </div>

        {/* ── Headline · time-to-close + thesis ────────────────────── */}
        <div style={{ padding: "12px 14px 10px" }}>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono"
              style={{
                fontSize: 22,
                color: VANTARY.paper,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(Math.floor(active.remainingSec / 60)).padStart(2, "0")}
              <span style={{ color: VANTARY.ashSoft }}>:</span>
              {String(active.remainingSec % 60).padStart(2, "0")}
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
            >
              TO CLOSE
            </span>
          </div>
          <p
            className="font-sans"
            style={{
              fontSize: 12,
              color: VANTARY.paperDim,
              lineHeight: 1.45,
              marginTop: 4,
              fontStyle: "italic",
            }}
          >
            {active.def.thesis}
          </p>
        </div>

        {/* ── Stat row · 3 cells ───────────────────────────────────── */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            borderTop: `1px solid ${VANTARY.rule}`,
            borderBottom: `1px solid ${VANTARY.rule}`,
          }}
        >
          <DebriefStat
            label="P&L"
            value={`${metrics.pl >= 0 ? "+" : "-"}$${Math.abs(metrics.pl)}`}
            delta={metrics.plDelta}
            deltaPrefix="$"
            tonePositive={metrics.pl >= 0}
            divider
          />
          <DebriefStat
            label="ADHERENCE"
            value={`${metrics.ruleAdherencePct}%`}
            delta={metrics.ruleAdherenceDelta}
            deltaPrefix=""
            deltaSuffix="%"
            tonePositive={metrics.ruleAdherencePct >= 80}
            divider
          />
          <DebriefStat
            label="A+ TRADES"
            value={`${metrics.aPlusCount}/${metrics.totalTrades}`}
            tonePositive={metrics.aPlusCount >= Math.ceil(metrics.totalTrades / 2)}
          />
        </div>

        {/* ── Top setup row ────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${VANTARY.rule}`,
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Target size={11} strokeWidth={1.5} color={VANTARY.amber} aria-hidden />
            <div className="flex flex-col min-w-0">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
              >
                TOP SETUP
              </span>
              <span
                className="font-sans truncate"
                style={{ fontSize: 12.5, color: VANTARY.paper, marginTop: 1, fontWeight: 500 }}
              >
                {metrics.topSetupLabel}
              </span>
            </div>
          </div>
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.16em",
              color: metrics.topSetupRMultiple >= 1.5 ? VANTARY.amber : VANTARY.paperDim,
              padding: "3px 6px",
              border: `1px solid ${metrics.topSetupRMultiple >= 1.5 ? VANTARY.amberHalo : VANTARY.rule}`,
            }}
          >
            {metrics.topSetupRMultiple.toFixed(1)}R
          </span>
        </div>

        {/* ── Discipline diagnostic line ───────────────────────────── */}
        <div
          className="flex items-center gap-2"
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${VANTARY.rule}`,
          }}
        >
          <ShieldCheck size={11} strokeWidth={1.5} color={VANTARY.ashSoft} aria-hidden />
          <span
            className="font-sans"
            style={{ fontSize: 11.5, color: VANTARY.paperDim, lineHeight: 1.45, flex: 1 }}
          >
            {metrics.disciplineLine}
          </span>
        </div>

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <div
          className="flex items-stretch"
          style={{ padding: 8, gap: 6 }}
        >
          <DebriefCTA
            primary
            icon={<Mic size={11} strokeWidth={1.75} />}
            label="BEGIN DEBRIEF"
            onClick={handleBeginDebrief}
          />
          <DebriefCTA
            icon={<Clock4 size={11} strokeWidth={1.75} />}
            label={`SNOOZE ${snoozeMinutes}M`}
            onClick={handleSnooze}
          />
        </div>

        {/* ── Footer hint ──────────────────────────────────────────── */}
        <div
          className="flex items-center gap-1.5 font-mono uppercase"
          style={{
            padding: "7px 14px",
            borderTop: `1px solid ${VANTARY.rule}`,
            fontSize: 8,
            letterSpacing: "0.22em",
            color: VANTARY.ashGhost,
            background: "rgba(0,0,0,0.16)",
          }}
        >
          <Sparkles size={9} strokeWidth={1.5} aria-hidden />
          <span>OPEN ⌘K · SEARCH “SUMMARIZE TODAY” FOR THE FULL RECAP</span>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Subcomponent · stat cell with optional delta tag.
 * ───────────────────────────────────────────────────────────────────────── */

function DebriefStat({
  label, value, delta, deltaPrefix = "", deltaSuffix = "",
  tonePositive, divider = false,
}: {
  label: string
  value: string
  delta?: number
  deltaPrefix?: string
  deltaSuffix?: string
  tonePositive: boolean
  divider?: boolean
}) {
  const valueColor = tonePositive ? VANTARY.amber : VANTARY.paperDim
  const deltaSign = delta == null ? null : (delta > 0 ? "+" : delta < 0 ? "-" : "±")
  const deltaTone = delta == null
    ? VANTARY.ashSoft
    : delta > 0 ? VANTARY.amber : delta < 0 ? VANTARY.paperDim : VANTARY.ashSoft

  return (
    <div
      className="flex flex-col items-start"
      style={{
        padding: "10px 12px",
        borderRight: divider ? `1px solid ${VANTARY.rule}` : "none",
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 15,
            color: valueColor,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </span>
        {delta != null && (
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 9.5, color: deltaTone, letterSpacing: "0.04em" }}
          >
            {deltaSign}
            {deltaPrefix}
            {Math.abs(delta)}
            {deltaSuffix}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Subcomponent · CTA button (primary = amber-filled, secondary = outlined).
 * ───────────────────────────────────────────────────────────────────────── */

function DebriefCTA({
  primary = false,
  icon,
  label,
  onClick,
}: {
  primary?: boolean
  icon?: React.ReactNode
  label: string
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = hover || focused

  if (primary) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={label}
        className="flex items-center justify-center gap-2 font-mono uppercase focus:outline-none"
        style={{
          flex: 1,
          padding: "8px 10px",
          fontSize: 9.5,
          letterSpacing: "0.22em",
          color: VANTARY.amberInk,
          background: VANTARY.amber,
          border: `1px solid ${VANTARY.amber}`,
          cursor: "pointer",
          transition: "background-color 180ms, box-shadow 180ms, transform 180ms",
          fontWeight: 600,
          transform: active ? "translateY(-0.5px)" : "translateY(0)",
          boxShadow: active ? `0 0 12px ${VANTARY.amberHalo}` : "none",
        }}
      >
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={label}
      className="flex items-center justify-center gap-2 font-mono uppercase focus:outline-none"
      style={{
        flex: 1,
        padding: "8px 10px",
        fontSize: 9.5,
        letterSpacing: "0.22em",
        color: active ? VANTARY.amber : VANTARY.ashSoft,
        background: active ? VANTARY.amberWash : "transparent",
        border: `1px solid ${focused ? VANTARY.amber : active ? VANTARY.amberHalo : VANTARY.rule}`,
        cursor: "pointer",
        transition: "color 180ms, background-color 180ms, border-color 180ms, box-shadow 180ms",
        boxShadow: focused ? `0 0 0 2px ${VANTARY.amberWash}` : "none",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
