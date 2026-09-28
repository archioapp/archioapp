"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET · ROW 3 — ORDER TYPE TABS
 *  ─────────────────────────────────────────────────────────────────────────
 *  Market / Limit / Stop segmented control (the existing OrderTypeSelector with
 *  its sliding shared-layout thumb), plus a spring-height reveal for the entry
 *  price field when a pending order type (limit/stop) is chosen.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { VANTARY } from "../../../vantary-theme"
import { CONSOLE_ACCENTS } from "../console-theme"
import { useTradeDraft } from "../trade-draft-context"
import { OrderTypeSelector, PrecisionPriceInput } from "../cockpit-controls"
import { fmtPips } from "../market-data"
import { SPRING } from "../console-motion"

export const OrderTypeRow = memo(function OrderTypeRow() {
  const reduce = useReducedMotion()
  const { mode, input, market, setOrderType, setEntry, buildingEnabled } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]
  const inst = market.instrument
  const pending = input.orderType !== "market"

  // distance from market for the entry field hint
  const mid = market.quote?.mid ?? null
  const dist = pending && input.entry != null && inst && mid != null
    ? Math.abs(input.entry - mid) / inst.pipSize
    : null

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      <OrderTypeSelector
        value={input.orderType}
        onChange={setOrderType}
        accent={accent.base}
        disabled={!buildingEnabled}
      />

      <AnimatePresence initial={false}>
        {pending && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={SPRING.reveal}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: 8 }}>
              <div
                style={{
                  borderRadius: 10,
                  border: `1px solid ${VANTARY.rule}`,
                  background: VANTARY.glass,
                }}
              >
                <div className="flex items-center justify-between" style={{ padding: "6px 10px 0" }}>
                  <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
                    {input.orderType === "limit" ? "LIMIT PRICE" : "STOP PRICE"}
                  </span>
                  {mid != null && (
                    <button
                      type="button"
                      onClick={() => inst && setEntry(round(mid, inst.digits))}
                      className="font-mono uppercase"
                      style={{ fontSize: 8, letterSpacing: "0.1em", color: accent.base, cursor: "pointer", background: "transparent", border: "none" }}
                    >
                      USE MARKET
                    </button>
                  )}
                </div>
                <PrecisionPriceInput
                  value={input.entry}
                  onChange={setEntry}
                  step={inst?.pipSize ?? 0.0001}
                  digits={inst?.digits ?? 5}
                  tone={accent.base}
                  disabled={!buildingEnabled}
                  distanceLabel={dist != null ? `${fmtPips(dist)} from market` : undefined}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

function round(n: number, digits: number): number {
  const f = Math.pow(10, digits)
  return Math.round(n * f) / f
}
