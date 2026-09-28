"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET · ROW 1 — PULSE ROW
 *  ─────────────────────────────────────────────────────────────────────────
 *  The "what am I trading and is it alive" row. Symbol + chart-link state on
 *  the left, the breathing live mid price in the center, and the market
 *  condition pills (spread · session · volatility) on the right.
 *
 *  The chain-link icon is the chart bridge: lit accent when the console mirrors
 *  the chart, amber + tooltip when the trader has manually overridden the
 *  symbol (click to re-sync to the chart).
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Link2, Link2Off, Clock } from "lucide-react"

import { VANTARY } from "../../../vantary-theme"
import { CONSOLE_ACCENTS } from "../console-theme"
import { useTradeDraft } from "../trade-draft-context"
import { SpreadPill } from "../cockpit-controls"
import { idleBreath } from "../console-motion"

const VOL_TONE: Record<string, string> = {
  calm:     VANTARY.chartUp,
  normal:   VANTARY.teal,
  elevated: "#E5A93C",
  high:     VANTARY.chartDown,
}

export const PulseRow = memo(function PulseRow() {
  const reduce = useReducedMotion()
  const { market, mode, chartLinked, chartLabel, relinkChart } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]
  const inst = market.instrument
  const quote = market.quote

  const linkTone = chartLinked ? accent.base : "#E5A93C"

  return (
    <div className="flex items-center justify-between gap-3" style={{ minHeight: 38 }}>
      {/* ── symbol + chart link + live pulse ── */}
      <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
        <button
          type="button"
          onClick={relinkChart}
          aria-label={chartLinked ? "Synced to chart" : `Chart on ${chartLabel} — click to re-sync console`}
          title={chartLinked ? "Console is synced to the chart" : `Chart showing ${chartLabel} — click to sync`}
          className="inline-flex items-center justify-center"
          style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
            border: `1px solid ${linkTone}44`,
            background: `${linkTone}14`,
            cursor: chartLinked ? "default" : "pointer",
            transition: "border-color .2s, background .2s",
          }}
        >
          {chartLinked
            ? <Link2 size={13} strokeWidth={2} color={linkTone} />
            : <motion.span
                animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <Link2Off size={13} strokeWidth={2} color={linkTone} />
              </motion.span>}
        </button>

        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <span className="inline-flex items-center gap-1.5">
            {quote && (
              <motion.span
                {...(reduce ? {} : idleBreath(reduce, [1, 0.4]))}
                aria-hidden
                style={{ width: 6, height: 6, borderRadius: "50%", background: accent.base, boxShadow: `0 0 8px ${accent.base}`, flexShrink: 0 }}
              />
            )}
            <span
              className="font-mono"
              style={{ fontSize: 15, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.01em", lineHeight: 1.1, whiteSpace: "nowrap" }}
            >
              {inst?.symbol ?? chartLabel}
            </span>
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8, letterSpacing: "0.16em", color: chartLinked ? VANTARY.ashSoft : "#E5A93C", lineHeight: 1.3, marginLeft: quote ? 13.5 : 0 }}
          >
            {chartLinked ? (inst?.klass ?? "—") : "MANUAL"}
          </span>
        </div>
      </div>

      {/* ── condition pills ── */}
      <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
        {quote && market.spread && <SpreadPill condition={market.spread} pips={quote.spreadPips} />}
        <span
          className="font-mono uppercase inline-flex items-center gap-1"
          style={{
            padding: "3px 7px", fontSize: 8, letterSpacing: "0.12em", fontWeight: 500,
            borderRadius: 999, border: `1px solid ${VANTARY.rule}`, color: VANTARY.paperDim, whiteSpace: "nowrap",
          }}
        >
          <Clock size={8} strokeWidth={2} color={VANTARY.ashSoft} />
          {market.session.label}
        </span>
        {market.volatility && (
          <span
            className="font-mono uppercase inline-flex items-center gap-1"
            style={{
              padding: "3px 7px", fontSize: 8, letterSpacing: "0.12em", fontWeight: 500,
              borderRadius: 999,
              border: `1px solid ${VOL_TONE[market.volatility.state]}44`,
              background: `${VOL_TONE[market.volatility.state]}12`,
              color: VOL_TONE[market.volatility.state], whiteSpace: "nowrap",
            }}
          >
            {market.volatility.label}
          </span>
        )}
      </div>
    </div>
  )
})
