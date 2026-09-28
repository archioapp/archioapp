"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET  (Phase 4 — Unified Order Ticket)
 *  ─────────────────────────────────────────────────────────────────────────
 *  ONE cohesive, TradeLocker-grade order ticket that replaces the three tall
 *  stations (Market Context / Direction / Risk). It is a single vertical stack
 *  of hairline-separated rows in the natural decision order — what → which way
 *  → how → protect → size → go — all bound to the one shared TradeDraft.
 *
 *      1. Pulse        symbol · chart-link · live price · spread/session/vol
 *      2. Side+Price   the big SELL@bid / BUY@ask hero
 *      3. Order type   MARKET · LIMIT · STOP (+ entry reveal)
 *      4. Levels       SL / TP + the RR split-bar
 *      5. Sizing       Risk% ⇄ $ ⇄ Lot + daily-budget meter
 *      6. Readiness    go/no-go verdict + REVIEW ORDER
 *
 *  No card headers, no station chrome — just rows that breathe. Every numeral
 *  is mono/tabular so the panel never reflows as the market ticks.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS } from "./console-theme"
import { GlassSurface } from "./glass-surface"
import { useExecutionShell } from "./execution-shell-context"
import { useTradeDraft } from "./trade-draft-context"
import { PulseRow } from "./ticket-rows/pulse-row"
import { SidePriceRow } from "./ticket-rows/side-price-row"
import { OrderTypeRow } from "./ticket-rows/order-type-tabs"
import { LevelsRow } from "./ticket-rows/levels-row"
import { SizingRow } from "./ticket-rows/sizing-row"
import { ReadinessBar } from "./ticket-rows/readiness-bar"

function Divider() {
  return <span aria-hidden style={{ display: "block", height: 1, width: "100%", background: VANTARY.rule, opacity: 0.55 }} />
}

export const ExecutionTicket = memo(function ExecutionTicket({
  onReview,
}: {
  onReview?: () => void
}) {
  const { mode } = useExecutionShell()
  const { input } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]
  const tone = input.side === "buy" ? "buy" : input.side === "sell" ? "sell" : "active"

  return (
    <GlassSurface
      accent={accent.base}
      tone={tone}
      transparent
      strip
      radius={14}
      aria-label="Order ticket"
      as="section"
      className="flex flex-col"
      style={{ gap: 12, padding: 14 }}
    >
      <PulseRow />
      <Divider />
      <SidePriceRow />
      <OrderTypeRow />
      <Divider />
      <LevelsRow />
      <Divider />
      <SizingRow />
      <Divider />
      <ReadinessBar onReview={onReview} />
    </GlassSurface>
  )
})

export default ExecutionTicket
