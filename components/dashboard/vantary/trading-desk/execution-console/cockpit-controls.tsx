"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · COCKPIT CONTROLS  (Phase 3)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The precision input surface the trade-building stations are made of. These
 *  are NOT a broker ticket's form fields — they are cockpit controls: a sliding
 *  Buy/Sell selector with directional energy, a segmented order-type switch, a
 *  precision price stepper that nudges by pip, status pills that change tone
 *  with condition, and a labelled field shell with lock + warning seats.
 *
 *  Every control:
 *    · takes an explicit accent (never guesses), follows the mode world,
 *    · degrades under prefers-reduced-motion,
 *    · supports a disabled/locked state with a calm, premium veil,
 *    · animates only when motion carries meaning (a slide, a tone change).
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useCallback, useRef, type ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion"
import {
  TrendingUp, TrendingDown, Minus, Plus, Lock, AlertTriangle, Check,
  type LucideIcon,
} from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import type { TradeSide, OrderType } from "./trade-draft"
import type { SpreadCondition, MarketReadiness } from "./market-data"

/* directional tones — buy is teal-green (long/up), sell is red (short/down).
 * Deliberately the platform's chart up/down so the cockpit speaks the same
 * colour language as the candles. */
export const SIDE_TONE: Record<TradeSide, string> = {
  buy:  VANTARY.chartUp,
  sell: VANTARY.chartDown,
}

/* ─────────────────────────────────────────────────────────────────────────
 *  ExecutionFieldShell — a labelled control seat with optional warning + lock.
 *  Every input in the builder sits in one of these so the vertical rhythm and
 *  the warning placement are identical across stations.
 * ──────────────────────────────────────────────────────────────────────── */
export const ExecutionFieldShell = memo(function ExecutionFieldShell({
  label,
  hint,
  children,
  tone = VANTARY.rule,
  warning,
  locked = false,
  right,
}: {
  label: string
  hint?: ReactNode
  children: ReactNode
  /** border/accent tone for the active state. */
  tone?: string
  /** a controlled warning line shown beneath (block = red, caution = amber). */
  warning?: { level: "block" | "caution"; message: string } | null
  locked?: boolean
  right?: ReactNode
}) {
  const warnTone = warning?.level === "block" ? VANTARY.chartDown : "#E5A93C"
  return (
    <div className="flex flex-col" style={{ gap: 6, opacity: locked ? 0.5 : 1, transition: "opacity 0.25s" }}>
      <div className="flex items-center gap-2">
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
          {label}
        </span>
        {locked && <Lock size={9} strokeWidth={1.9} color={VANTARY.ashGhost} />}
        <span aria-hidden style={{ flex: 1 }} />
        {right}
      </div>
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${warning ? `${warnTone}55` : tone}`,
          background: VANTARY.glass,
          transition: "border-color 0.2s",
        }}
      >
        {children}
      </div>
      <AnimatePresence initial={false}>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-1.5"
            style={{ overflow: "hidden" }}
          >
            <AlertTriangle size={10} strokeWidth={2} color={warnTone} style={{ marginTop: 1, flexShrink: 0 }} />
            <span className="font-sans" style={{ fontSize: 10, color: warnTone, lineHeight: 1.4 }}>
              {warning.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {hint != null && !warning && (
        <span className="font-sans" style={{ fontSize: 10, color: VANTARY.ashSoft, lineHeight: 1.4 }}>
          {hint}
        </span>
      )}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  OrderDirectionToggle — the Buy/Sell selector. A premium sliding pill: the
 *  selected side fills with its directional tone and the thumb glides across.
 *  No selection = both rest neutral, gently inviting a choice.
 * ──────────────────────────────────────────────────────────────────────── */
export const OrderDirectionToggle = memo(function OrderDirectionToggle({
  value,
  onChange,
  disabled = false,
}: {
  value: TradeSide | null
  onChange: (s: TradeSide) => void
  disabled?: boolean
}) {
  const reduce = useReducedMotion()
  const sides: { side: TradeSide; label: string; icon: LucideIcon }[] = [
    { side: "buy",  label: "BUY · LONG",  icon: TrendingUp },
    { side: "sell", label: "SELL · SHORT", icon: TrendingDown },
  ]
  return (
    <LayoutGroup id="dir-toggle">
      <div
        role="radiogroup"
        aria-label="Trade direction"
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        {sides.map(({ side, label, icon: Icon }) => {
          const active = value === side
          const tone = SIDE_TONE[side]
          return (
            <button
              key={side}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(side)}
              className="relative inline-flex items-center justify-center gap-2"
              style={{
                position: "relative",
                padding: "13px 10px",
                borderRadius: 11,
                border: `1px solid ${active ? `${tone}88` : VANTARY.rule}`,
                background: active ? `${tone}1A` : VANTARY.glass,
                cursor: "pointer",
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              {active && !reduce && (
                <motion.span
                  layoutId="dir-thumb"
                  aria-hidden
                  style={{
                    position: "absolute", inset: 0, borderRadius: 11,
                    boxShadow: `inset 0 0 0 1px ${tone}66, 0 0 18px -4px ${tone}`,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={15} strokeWidth={2} color={active ? tone : VANTARY.ashSoft} style={{ position: "relative", zIndex: 1 }} />
              <span
                className="font-mono uppercase"
                style={{
                  position: "relative", zIndex: 1,
                  fontSize: 10, letterSpacing: "0.12em", fontWeight: 600,
                  color: active ? tone : VANTARY.paperDim,
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  OrderTypeSelector — a segmented cockpit switch for Market / Limit / Stop.
 *  The active segment glides with a shared-layout thumb.
 * ──────────────────────────────────────────────────────────────────────── */
const ORDER_TYPES: { id: OrderType; label: string }[] = [
  { id: "market", label: "MARKET" },
  { id: "limit",  label: "LIMIT" },
  { id: "stop",   label: "STOP" },
]
export const OrderTypeSelector = memo(function OrderTypeSelector({
  value,
  onChange,
  accent,
  disabled = false,
}: {
  value: OrderType
  onChange: (o: OrderType) => void
  accent: string
  disabled?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <LayoutGroup id="ot-selector">
      <div
        role="tablist"
        aria-label="Order type"
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 3,
          padding: 3,
          borderRadius: 10,
          background: VANTARY.ruleSoft,
          border: `1px solid ${VANTARY.rule}`,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        {ORDER_TYPES.map(({ id, label }) => {
          const active = value === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(id)}
              className="relative inline-flex items-center justify-center"
              style={{ position: "relative", padding: "7px 4px", borderRadius: 7, cursor: "pointer", zIndex: 1 }}
            >
              {active && (
                reduce
                  ? <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 7, background: `${accent}1F`, border: `1px solid ${accent}55` }} />
                  : <motion.span
                      layoutId="ot-thumb"
                      aria-hidden
                      style={{ position: "absolute", inset: 0, borderRadius: 7, background: `${accent}1F`, border: `1px solid ${accent}55` }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
              )}
              <span
                className="font-mono uppercase"
                style={{
                  position: "relative", zIndex: 1,
                  fontSize: 9, letterSpacing: "0.14em", fontWeight: 500,
                  color: active ? accent : VANTARY.ashSoft,
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  PrecisionPriceInput — a price control that feels like an instrument, not a
 *  text box. A big tabular numeral, ± steppers that nudge by one pip, and an
 *  optional distance readout. Empty state invites a value without screaming.
 * ──────────────────────────────────────────────────────────────────────── */
export const PrecisionPriceInput = memo(function PrecisionPriceInput({
  value,
  onChange,
  step,
  digits,
  tone = VANTARY.paper,
  placeholder = "—",
  prefix,
  disabled = false,
  distanceLabel,
  ariaLabel,
  }: {
  value: number | null
  onChange: (n: number | null) => void
  /** the price increment per ± press (usually one pip). */
  step: number
  digits: number
  tone?: string
  placeholder?: string
  prefix?: ReactNode
  disabled?: boolean
  /** e.g. "32.0 pips" shown on the right as context. */
  distanceLabel?: ReactNode
  /** accessible name for the text input. */
  ariaLabel?: string
}) {
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nudge = useCallback((dir: 1 | -1) => {
    onChange(round((value ?? 0) + dir * step, digits))
  }, [value, step, digits, onChange])

  const startHold = useCallback((dir: 1 | -1) => {
    nudge(dir)
    holdRef.current = setInterval(() => nudge(dir), 90)
  }, [nudge])
  const endHold = useCallback(() => {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null }
  }, [])

  const stepper = (dir: 1 | -1, Icon: LucideIcon) => (
    <button
      type="button"
      aria-label={dir > 0 ? "Increase by one pip" : "Decrease by one pip"}
      onPointerDown={() => startHold(dir)}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      disabled={disabled}
      className="inline-flex items-center justify-center"
      style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        border: `1px solid ${VANTARY.rule}`,
        background: VANTARY.ruleSoft,
        color: VANTARY.paperDim,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <Icon size={13} strokeWidth={2} />
    </button>
  )

  return (
    <div className="flex items-center gap-2" style={{ padding: "8px 9px" }}>
      {stepper(-1, Minus)}
      <div className="flex flex-col items-center" style={{ flex: 1, minWidth: 0 }}>
        <div className="inline-flex items-baseline gap-1">
          {prefix}
          <input
            type="text"
            inputMode="decimal"
            aria-label={ariaLabel}
            disabled={disabled}
            value={value != null ? fmt(value, digits) : ""}
            placeholder={placeholder}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9.]/g, "")
              if (raw === "") { onChange(null); return }
              const n = Number(raw)
              if (!Number.isNaN(n)) onChange(n)
            }}
            className="font-mono tabular-nums bg-transparent text-center"
            style={{
              width: "100%", border: "none", outline: "none",
              fontSize: 18, fontWeight: 600, color: value != null ? tone : VANTARY.ashGhost,
              letterSpacing: "-0.01em",
            }}
          />
        </div>
        {distanceLabel != null && (
          <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft, marginTop: 2 }}>
            {distanceLabel}
          </span>
        )}
      </div>
      {stepper(1, Plus)}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  MarketStatusPill — a small pill whose tone tracks a market condition
 *  (spread / readiness). The dot + label change colour with the verdict.
 * ──────────────────────────────────────────────────────────────────────── */
const SPREAD_TONE: Record<SpreadCondition, { tone: string; label: string }> = {
  tight:  { tone: VANTARY.chartUp, label: "TIGHT" },
  normal: { tone: VANTARY.teal,    label: "NORMAL" },
  wide:   { tone: "#E5A93C",       label: "WIDE" },
}
export const SpreadPill = memo(function SpreadPill({
  condition,
  pips,
}: {
  condition: SpreadCondition
  pips: number
}) {
  const m = SPREAD_TONE[condition]
  return (
    <motion.span
      className="font-mono uppercase inline-flex items-center gap-1.5"
      initial={false}
      animate={{ color: m.tone, borderColor: `${m.tone}55`, backgroundColor: `${m.tone}14` }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "3px 8px", fontSize: 8.5, letterSpacing: "0.14em", fontWeight: 500,
        borderRadius: 999, border: "1px solid", whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: m.tone }} />
      {pips.toFixed(1)} · {m.label}
    </motion.span>
  )
})

const READINESS_TONE: Record<MarketReadiness, { tone: string; label: string; icon: LucideIcon }> = {
  tradable:    { tone: VANTARY.chartUp,   label: "TRADABLE",    icon: Check },
  caution:     { tone: "#E5A93C",         label: "CAUTION",     icon: AlertTriangle },
  unavailable: { tone: VANTARY.chartDown, label: "UNAVAILABLE", icon: Lock },
  closed:      { tone: VANTARY.ash,       label: "CLOSED",      icon: Lock },
}
export const MarketStatusPill = memo(function MarketStatusPill({
  readiness,
}: {
  readiness: MarketReadiness
}) {
  const m = READINESS_TONE[readiness]
  const Icon = m.icon
  return (
    <span
      className="font-mono uppercase inline-flex items-center gap-1.5"
      style={{
        padding: "3px 8px", fontSize: 8.5, letterSpacing: "0.16em", fontWeight: 500,
        borderRadius: 999, border: `1px solid ${m.tone}55`, background: `${m.tone}14`, color: m.tone,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={9} strokeWidth={2} />
      {m.label}
    </span>
  )
})

/* shared rounding util */
function round(n: number, digits: number): number {
  const f = Math.pow(10, digits)
  return Math.round(n * f) / f
}
function fmt(n: number, digits: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: false })
}
