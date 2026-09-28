"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET · ROW 2 — SIDE + PRICE (the TradeLocker hero)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Two big stacked buttons — SELL @ bid (left, cool) and BUY @ ask (right,
 *  warm/accent) — with the live price rendered large (big figure / pip digit /
 *  fractional pip, broker-terminal style). The chosen side fills with its
 *  directional tone; the other dims to a ghost. The spread sits in a thin gap
 *  between them with its pip value centered.
 *
 *  Motion: each button breathes on hover (lift + ring), presses to 0.97, and
 *  its price idle-breathes so the hero always feels live.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"

import { VANTARY } from "../../../vantary-theme"
import { useTradeDraft } from "../trade-draft-context"
import { SIDE_TONE } from "../cockpit-controls"
import { idleBreath, makeBreatheVariants, useValueFlash, T } from "../console-motion"
import type { TradeSide } from "../trade-draft"

export const SidePriceRow = memo(function SidePriceRow() {
  const reduce = useReducedMotion()
  const { market, input, setSide, buildingEnabled } = useTradeDraft()
  const inst = market.instrument
  const quote = market.quote
  const disabled = !buildingEnabled || !quote || !inst

  return (
    <div className="grid items-stretch" style={{ gridTemplateColumns: "1fr auto 1fr", gap: 0 }}>
      <SideButton
        side="sell"
        price={quote?.bid ?? null}
        active={input.side === "sell"}
        disabled={disabled}
        onSelect={() => setSide("sell")}
        digits={inst?.digits ?? 5}
        instReady={!!inst}
      />

      {/* center spread gutter */}
      <div className="flex flex-col items-center justify-center" style={{ padding: "0 10px", minWidth: 56 }}>
        <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
          SPREAD
        </span>
        <span className="font-mono tabular-nums" style={{ fontSize: 13, fontWeight: 600, color: VANTARY.paperDim, lineHeight: 1.2 }}>
          {quote ? quote.spreadPips.toFixed(1) : "—"}
        </span>
      </div>

      <SideButton
        side="buy"
        price={quote?.ask ?? null}
        active={input.side === "buy"}
        disabled={disabled}
        onSelect={() => setSide("buy")}
        digits={inst?.digits ?? 5}
        instReady={!!inst}
      />
    </div>
  )
})

/* ─── one side button ──────────────────────────────────────────────────── */
const SideButton = memo(function SideButton({
  side, price, active, disabled, onSelect, digits, instReady,
}: {
  side: TradeSide
  price: number | null
  active: boolean
  disabled: boolean
  onSelect: () => void
  digits: number
  instReady: boolean
}) {
  const reduce = useReducedMotion()
  const tone = SIDE_TONE[side]
  const flashing = useValueFlash(price)
  const variants = makeBreatheVariants({ kind: "lift", reduce })
  const isBuy = side === "buy"
  const Icon = isBuy ? TrendingUp : TrendingDown

  // big-figure split for terminal-style price
  const parts = price != null && instReady && market_inst_ok(digits)
    ? splitPrice(price, digits)
    : null

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={`${isBuy ? "Buy" : "Sell"} at ${price != null ? price.toFixed(digits) : "—"}`}
      disabled={disabled}
      onClick={onSelect}
      variants={variants}
      initial="rest"
      animate={active && !reduce ? "hover" : "rest"}
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "press"}
      className="relative flex flex-col"
      style={{
        alignItems: isBuy ? "flex-end" : "flex-start",
        gap: 3,
        padding: "12px 14px",
        borderRadius: isBuy ? "0 12px 12px 0" : "12px 0 0 12px",
        border: `1px solid ${active ? tone : VANTARY.rule}`,
        background: active ? `${tone}1F` : VANTARY.glass,
        boxShadow: active && !reduce ? `inset 0 0 0 1px ${tone}55, 0 0 22px -6px ${tone}` : "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        overflow: "hidden",
        transition: "border-color .2s, background .2s, box-shadow .25s",
      }}
    >
      {/* side label */}
      <span className="inline-flex items-center gap-1.5" style={{ flexDirection: isBuy ? "row-reverse" : "row" }}>
        <Icon size={12} strokeWidth={2.2} color={active ? tone : VANTARY.ashSoft} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.16em", fontWeight: 600, color: active ? tone : VANTARY.paperDim }}
        >
          {isBuy ? "BUY" : "SELL"}
        </span>
      </span>

      {/* big price */}
      <motion.span
        {...(reduce || !active ? {} : idleBreath(reduce, [1, 0.84]))}
        className="inline-flex items-baseline font-mono tabular-nums"
        style={{ flexDirection: isBuy ? "row" : "row" }}
      >
        {parts ? (
          <motion.span
            initial={false}
            animate={{ color: flashing ? tone : active ? VANTARY.paper : VANTARY.paperDim }}
            transition={T.flash}
            className="inline-flex items-baseline"
          >
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>{parts.big}</span>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{parts.pip}</span>
            {parts.frac && <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>{parts.frac}</span>}
          </motion.span>
        ) : (
          <span style={{ fontSize: 18, fontWeight: 600, color: VANTARY.ashGhost }}>—</span>
        )}
      </motion.span>
    </motion.button>
  )
})

/* split a price for the big-figure / pip / fractional rendering. We replicate
 * priceParts' rule locally to avoid needing the instrument object here. */
function splitPrice(price: number, digits: number): { big: string; pip: string; frac: string } {
  const s = price.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })
  if (digits >= 3) {
    return { big: s.slice(0, -2), pip: s.slice(-2, -1), frac: s.slice(-1) }
  }
  return { big: s.slice(0, -1), pip: s.slice(-1), frac: "" }
}
function market_inst_ok(digits: number): boolean {
  return Number.isFinite(digits) && digits > 0
}
