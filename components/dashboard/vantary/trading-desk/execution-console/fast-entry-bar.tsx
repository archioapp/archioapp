"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  FAST ENTRY BAR  (Phase 5 — the always-visible bottom rail)
 *  ─────────────────────────────────────────────────────────────────────────
 *  A slim horizontal bar pinned to the bottom of the trading desk in EVERY
 *  layout mode. It is a COMPACT MIRROR of the full Execution Ticket, bound to
 *  the SAME hoisted draft — set a side or nudge risk here and it is already
 *  there when you open the full console in the rail (and vice-versa).
 *
 *  Anatomy (left → right):
 *    · mode chip + symbol (mirrors the chart) + live mid price
 *    · compact SELL / BUY dual-price (the hero, shrunk)
 *    · a tiny risk-% stepper + the live R:R
 *    · readiness dot + REVIEW button — clicking pins the full console open
 *      and scrolls the ticket into view (the bar is the on-ramp to the ticket).
 *
 *  When the desk is `minimized` it collapses to a single-line "tape" (symbol ·
 *  side · RR · verdict dot) and expands its controls on hover.
 *
 *  Same motion vocabulary as the ticket, at smaller scale: hover-breathe rows,
 *  idle-breathe prices, press-scale buttons. Reduced-motion safe throughout.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { TrendingDown, TrendingUp, Minus, Plus, ArrowRight, Link2, Link2Off } from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS } from "./console-theme"
import { SIDE_TONE } from "./cockpit-controls"
import { GlassSurface, GlassButton } from "./glass-surface"
import { useTradeDraft } from "./trade-draft-context"
import { useExecutionShell } from "./execution-shell-context"
import { draftReadinessView } from "./trade-draft"
import { priceParts, fmtPips } from "./market-data"
import { idleBreath, useValueFlash, T } from "./console-motion"
import type { TradeSide } from "./trade-draft"

/* ─── THE BAR ──────────────────────────────────────────────────────────── */
export const FastEntryBar = memo(function FastEntryBar({
  collapsed = false,
}: {
  /** when the desk is minimized, render the single-line tape. */
  collapsed?: boolean
}) {
  const { mode, requestPinConsole } = useExecutionShell()
  const { input } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]

  if (collapsed) return <FastEntryTape accent={accent} />

  const sideTone: GlassToneArg =
    input.side === "buy" ? "buy" : input.side === "sell" ? "sell" : "active"

  return (
    /* No hover window here by design — the strip stays in place and only the
       individual controls brighten on hover (Flight Deck room-card quality). */
    <div className="relative">
      <GlassSurface
        accent={accent.base}
        tone={sideTone}
        transparent
        strip
        radius={0}
        interactive
        role="region"
        aria-label="Fast entry bar"
        className="flex items-center"
        style={{
          gap: 12,
          height: 56,
          padding: "0 14px",
          border: "none",
        }}
      >
        {/* click-to-open affordance — tapping empty strip space opens the rail */}
        <button
          type="button"
          aria-label="Open execution console"
          onClick={requestPinConsole}
          className="absolute inset-0"
          style={{ background: "transparent", border: "none", cursor: "pointer", zIndex: 0 }}
        />
        <div className="relative flex items-center" style={{ gap: 12, zIndex: 1, width: "100%" }}>
          <SymbolGlance accent={accent} />
          <Divider />
          <CompactSides accent={accent} />
          <Divider />
          <RiskGlance accent={accent} />
          <span aria-hidden style={{ flex: 1 }} />
          <ReadinessAction accent={accent} />
        </div>
      </GlassSurface>
    </div>
  )
})

type GlassToneArg = "buy" | "sell" | "active"

/* ─── divider — a whisper of a fade, not a hard rule (transparent vibes) ── */
function Divider() {
  return (
    <span
      aria-hidden
      style={{
        width: 1,
        height: 22,
        flexShrink: 0,
        background: `linear-gradient(180deg, transparent, ${VANTARY.ruleSoft}, transparent)`,
      }}
    />
  )
}

/* ─── left: mode chip + symbol + live mid ──────────────────────────────── */
const SymbolGlance = memo(function SymbolGlance({ accent }: { accent: typeof CONSOLE_ACCENTS[keyof typeof CONSOLE_ACCENTS] }) {
  const reduce = useReducedMotion()
  const { market, chartLinked, relinkChart } = useTradeDraft()
  const inst = market.instrument
  const quote = market.quote
  const Link = chartLinked ? Link2 : Link2Off
  const linkTone = chartLinked ? accent.base : "#E5A93C"

  return (
    <div className="flex items-center" style={{ gap: 9, flexShrink: 0, minWidth: 0 }}>
      {/* mode pill */}
      <span
        className="font-mono uppercase"
        style={{
          padding: "3px 7px", borderRadius: 6, fontSize: 8, letterSpacing: "0.16em", fontWeight: 600,
          color: accent.base, border: `1px solid ${accent.halo}`, background: accent.wash,
        }}
      >
        {accent.token}
      </span>

      {/* symbol + chart-link */}
      <button
        type="button"
        onClick={chartLinked ? undefined : relinkChart}
        aria-label={chartLinked ? "Following chart symbol" : "Relink to chart symbol"}
        className="inline-flex items-center gap-1.5"
        style={{ cursor: chartLinked ? "default" : "pointer", background: "none", border: "none", padding: 0 }}
      >
        <Link size={11} strokeWidth={2} color={linkTone} />
        <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.01em" }}>
          {inst?.symbol ?? "—"}
        </span>
      </button>

      {/* live mid */}
      <motion.span
        {...idleBreath(reduce, [1, 0.82])}
        className="font-mono tabular-nums"
        style={{ fontSize: 12, color: VANTARY.paperDim }}
      >
        {quote && inst ? priceParts(quote.mid, inst).big + priceParts(quote.mid, inst).pip : "—"}
      </motion.span>
    </div>
  )
})

/* ─── center: compact SELL / BUY ───────────────────────────────────────── */
const CompactSides = memo(function CompactSides({ accent }: { accent: typeof CONSOLE_ACCENTS[keyof typeof CONSOLE_ACCENTS] }) {
  const { market, input, setSide, buildingEnabled } = useTradeDraft()
  const { requestPinConsole } = useExecutionShell()
  const inst = market.instrument
  const quote = market.quote
  const disabled = !buildingEnabled || !quote || !inst

  /* Selecting a side is INTENT — open the execution console on the right
     immediately, no review step in between. The draft is hoisted, so the
     full ticket arrives already carrying this side. */
  const pick = (side: TradeSide) => {
    setSide(side)
    requestPinConsole()
  }

  return (
    <div className="flex items-stretch" style={{ gap: 4, flexShrink: 0 }}>
      <CompactSideButton side="sell" price={quote?.bid ?? null} active={input.side === "sell"} disabled={disabled} onSelect={() => pick("sell")} inst={inst} />
      <CompactSideButton side="buy"  price={quote?.ask ?? null} active={input.side === "buy"}  disabled={disabled} onSelect={() => pick("buy")}  inst={inst} />
    </div>
  )
})

const CompactSideButton = memo(function CompactSideButton({
  side, price, active, disabled, onSelect, inst,
}: {
  side: TradeSide
  price: number | null
  active: boolean
  disabled: boolean
  onSelect: () => void
  inst: ReturnType<typeof useTradeDraft>["market"]["instrument"]
}) {
  const tone = SIDE_TONE[side]
  const flashing = useValueFlash(price)
  const isBuy = side === "buy"
  const Icon = isBuy ? TrendingUp : TrendingDown
  const parts = price != null && inst ? priceParts(price, inst) : null

  return (
    <GlassButton
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={`${isBuy ? "Buy" : "Sell"} at ${price != null && inst ? price.toFixed(inst.digits) : "—"}`}
      accent={tone}
      tone={isBuy ? "buy" : "sell"}
      selected={active}
      disabled={disabled}
      onClick={onSelect}
      radius={9}
      style={{ padding: "6px 11px", gap: 8 }}
    >
      <Icon size={11} strokeWidth={2.2} color={active ? tone : VANTARY.ashSoft} />
      <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", fontWeight: 600, color: active ? tone : VANTARY.paperDim }}>
        {isBuy ? "BUY" : "SELL"}
      </span>
      <motion.span
        initial={false}
        animate={{ color: flashing ? tone : active ? VANTARY.paper : VANTARY.paperDim }}
        transition={T.flash}
        className="font-mono tabular-nums"
        style={{ fontSize: 12, fontWeight: 600 }}
      >
        {parts ? <>{parts.big}<span style={{ fontSize: 14, fontWeight: 700 }}>{parts.pip}</span></> : "—"}
      </motion.span>
    </GlassButton>
  )
})

/* ─── risk stepper + RR ────────────────────────────────────────────────── */
const RiskGlance = memo(function RiskGlance({ accent }: { accent: typeof CONSOLE_ACCENTS[keyof typeof CONSOLE_ACCENTS] }) {
  const { draft, input, setRiskPct, buildingEnabled } = useTradeDraft()
  const rrFlash = useValueFlash(draft.rr)
  const disabled = !buildingEnabled

  return (
    <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
      {/* risk % stepper */}
      <div className="flex items-center" style={{ gap: 4 }}>
        <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>RISK</span>
        <StepBtn label="Decrease risk" disabled={disabled} onClick={() => setRiskPct(Math.round((input.riskPct - 0.1) * 10) / 10)} Icon={Minus} />
        <span className="font-mono tabular-nums" style={{ fontSize: 12, fontWeight: 600, color: VANTARY.paper, minWidth: 34, textAlign: "center" }}>
          {input.riskPct.toFixed(1)}%
        </span>
        <StepBtn label="Increase risk" disabled={disabled} onClick={() => setRiskPct(Math.round((input.riskPct + 0.1) * 10) / 10)} Icon={Plus} />
      </div>

      {/* RR */}
      <div className="flex flex-col items-center" style={{ minWidth: 44 }}>
        <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>R:R</span>
        <motion.span
          initial={false}
          animate={{ color: rrFlash ? accent.base : VANTARY.paper }}
          transition={T.flash}
          className="font-mono tabular-nums"
          style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}
        >
          {draft.rr != null ? `1:${draft.rr.toFixed(1)}` : "—"}
        </motion.span>
      </div>
    </div>
  )
})

function StepBtn({ label, onClick, disabled, Icon }: { label: string; onClick: () => void; disabled: boolean; Icon: typeof Minus }) {
  /* Borderless, transparent at rest — only a quiet wash on hover. */
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center justify-center"
      style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        border: "none",
        background: hover && !disabled ? VANTARY.ruleSoft : "transparent",
        color: hover && !disabled ? VANTARY.paper : VANTARY.paperDim,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
        transition: "background .2s ease, color .2s ease",
      }}
    >
      <Icon size={11} strokeWidth={2} />
    </button>
  )
}

/* ─── right: readiness dot + REVIEW (pins console open) ─────────────────── */
const ReadinessAction = memo(function ReadinessAction({ accent }: { accent: typeof CONSOLE_ACCENTS[keyof typeof CONSOLE_ACCENTS] }) {
  const reduce = useReducedMotion()
  const { draft } = useTradeDraft()
  const { requestPinConsole } = useExecutionShell()
  const view = draftReadinessView(draft)
  const ready = draft.readiness === "preview-ready" || draft.readiness === "sim-ready"
  const blocked = draft.readiness === "blocked" || draft.readiness === "invalid"
  const tone = blocked ? VANTARY.chartDown : ready ? accent.base : VANTARY.ash

  return (
    <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
      {/* verdict headline (hidden on very narrow) */}
      <div className="hidden lg:flex items-center" style={{ gap: 6 }}>
        <motion.span
          aria-hidden
          {...(reduce ? {} : idleBreath(reduce, [1, 0.4]))}
          style={{ width: 7, height: 7, borderRadius: "50%", background: tone, boxShadow: !reduce ? `0 0 8px -1px ${tone}` : "none" }}
        />
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.1em", fontWeight: 600, color: tone }}>
          {view.headline}
        </span>
      </div>

      {/* PLACE button — armed, actionable: opens / pins the full console */}
      <GlassButton
        type="button"
        onClick={(e) => { e.stopPropagation(); requestPinConsole() }}
        accent={ready ? accent.base : VANTARY.ash}
        tone={ready ? "active" : "idle"}
        selected={ready}
        showpiece={ready}
        radius={9}
        aria-label={ready ? "Place order in console" : "Open execution console"}
        style={{ padding: "7px 13px", gap: 6 }}
      >
        <span className="font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: "0.12em", fontWeight: 600, color: ready ? accent.base : VANTARY.paperDim }}>
          {ready ? "PLACE" : "OPEN"}
        </span>
        <ArrowRight size={12} strokeWidth={2.2} color={ready ? accent.base : VANTARY.paperDim} />
      </GlassButton>
    </div>
  )
})

/* ─── collapsed tape (minimized desk) ──────────────────────────────────── */
const FastEntryTape = memo(function FastEntryTape({ accent }: { accent: typeof CONSOLE_ACCENTS[keyof typeof CONSOLE_ACCENTS] }) {
  const reduce = useReducedMotion()
  const { market, input, draft } = useTradeDraft()
  const view = draftReadinessView(draft)
  const ready = draft.readiness === "preview-ready" || draft.readiness === "sim-ready"
  const blocked = draft.readiness === "blocked" || draft.readiness === "invalid"
  const tone = blocked ? VANTARY.chartDown : ready ? accent.base : VANTARY.ash
  const sideTone = input.side ? SIDE_TONE[input.side] : VANTARY.ashSoft

  return (
    <div
      role="region"
      aria-label="Fast entry tape"
      className="flex items-center"
      style={{ gap: 10, height: 30, padding: "0 14px", borderTop: `1px solid ${VANTARY.rule}`, background: VANTARY.ink ?? VANTARY.paper, overflow: "hidden" }}
    >
      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", fontWeight: 600, color: accent.base }}>{accent.token}</span>
      <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: VANTARY.paper }}>{market.instrument?.symbol ?? "—"}</span>
      {input.side && (
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", fontWeight: 600, color: sideTone }}>
          {input.side}
        </span>
      )}
      <span className="font-mono tabular-nums" style={{ fontSize: 10.5, color: VANTARY.paperDim }}>
        {draft.rr != null ? `1:${draft.rr.toFixed(1)}` : ""}
        {draft.stopPips != null ? ` · ${fmtPips(draft.stopPips)}` : ""}
      </span>
      <span aria-hidden style={{ flex: 1 }} />
      <motion.span
        aria-hidden
        {...(reduce ? {} : idleBreath(reduce, [1, 0.4]))}
        style={{ width: 6, height: 6, borderRadius: "50%", background: tone }}
      />
      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.1em", fontWeight: 600, color: tone }}>{view.headline}</span>
    </div>
  )
})
