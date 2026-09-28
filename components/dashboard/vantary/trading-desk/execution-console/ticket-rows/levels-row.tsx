"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET · ROW 4 — LEVELS (Stop Loss / Take Profit + RR split-bar)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The two protective levels side-by-side as precision price inputs, each
 *  showing its pip distance + resulting $ underneath. Below them, the RR
 *  split-bar: a single horizontal bar — red (risk) | green (reward) — whose
 *  widths animate on every SL/TP change, with the RR multiple centered and
 *  flashing the accent when it updates.
 *
 *  An "auto" affordance seeds a sane 0.4-ATR stop + 2R target when the trader
 *  hasn't placed levels yet (logic lives in the draft context).
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Wand2 } from "lucide-react"

import { VANTARY } from "../../../vantary-theme"
import { CONSOLE_ACCENTS } from "../console-theme"
import { useTradeDraft } from "../trade-draft-context"
import { PrecisionPriceInput } from "../cockpit-controls"
import { fmtPips } from "../market-data"
import { useValueFlash, flashColor, T, SPRING } from "../console-motion"

const RISK_TONE = VANTARY.chartDown
const REWARD_TONE = VANTARY.chartUp

export const LevelsRow = memo(function LevelsRow() {
  const reduce = useReducedMotion()
  const { mode, input, draft, market, setStop, setTarget, autoFillLadder, buildingEnabled } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]
  const inst = market.instrument
  const disabled = !buildingEnabled

  const slBlock = draft.blocks.find(b => b.code.startsWith("sl-") || b.code === "no-sl")
  const tpCaution = draft.cautions.find(c => c.code === "no-tp")

  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      {/* header + auto */}
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
          PROTECTION
        </span>
        <button
          type="button"
          onClick={autoFillLadder}
          disabled={disabled || !input.side}
          className="inline-flex items-center gap-1.5"
          style={{
            padding: "4px 8px", borderRadius: 7,
            border: `1px solid ${accent.base}44`, background: `${accent.base}12`,
            color: accent.base, cursor: disabled || !input.side ? "default" : "pointer",
            opacity: disabled || !input.side ? 0.4 : 1, transition: "opacity .2s",
          }}
        >
          <Wand2 size={10} strokeWidth={2} />
          <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.12em", fontWeight: 600 }}>AUTO</span>
        </button>
      </div>

      {/* SL / TP inputs */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <LevelField
          label="STOP LOSS"
          value={input.stopLoss}
          onChange={setStop}
          step={inst?.pipSize ?? 0.0001}
          digits={inst?.digits ?? 5}
          tone={RISK_TONE}
          pips={draft.stopPips}
          dollars={draft.estLoss}
          disabled={disabled}
          warn={slBlock ? { level: "block" as const, message: slBlock.message } : null}
        />
        <LevelField
          label="TAKE PROFIT"
          value={input.takeProfit}
          onChange={setTarget}
          step={inst?.pipSize ?? 0.0001}
          digits={inst?.digits ?? 5}
          tone={REWARD_TONE}
          pips={draft.targetPips}
          dollars={draft.estProfit}
          disabled={disabled}
          warn={tpCaution ? { level: "caution" as const, message: tpCaution.message } : null}
        />
      </div>

      {/* RR split bar */}
      <RRSplitBar rr={draft.rr} accent={accent.base} reduce={reduce} />
    </div>
  )
})

/* ─── a single SL/TP field with distance + $ underneath ────────────────── */
const LevelField = memo(function LevelField({
  label, value, onChange, step, digits, tone, pips, dollars, disabled, warn,
}: {
  label: string
  value: number | null
  onChange: (n: number | null) => void
  step: number
  digits: number
  tone: string
  pips: number | null
  dollars: number | null
  disabled: boolean
  warn: { level: "block" | "caution"; message: string } | null
}) {
  const warnTone = warn?.level === "block" ? VANTARY.chartDown : "#E5A93C"
  return (
    <div className="flex flex-col" style={{ gap: 5 }}>
      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
        {label}
      </span>
      <div style={{ borderRadius: 10, border: `1px solid ${warn ? `${warnTone}55` : `${tone}33`}`, background: VANTARY.glass, transition: "border-color .2s" }}>
        <PrecisionPriceInput
          value={value}
          onChange={onChange}
          step={step}
          digits={digits}
          tone={tone}
          disabled={disabled}
          ariaLabel={`${label} price`}
          distanceLabel={pips != null
            ? <span style={{ color: tone }}>{fmtPips(pips)}{dollars != null ? ` · ${fmtMoney(dollars)}` : ""}</span>
            : undefined}
        />
      </div>
    </div>
  )
})

/* ─── the RR split-bar ─────────────────────────────────────────────────── */
const RRSplitBar = memo(function RRSplitBar({
  rr, accent, reduce,
}: {
  rr: number | null
  accent: string
  reduce: boolean | null
}) {
  const flashing = useValueFlash(rr)
  // risk is always "1"; reward is rr. Normalize widths so 1:rr fills the bar.
  const total = rr != null ? 1 + rr : 2
  const riskW = rr != null ? (1 / total) * 100 : 50
  const rewardW = rr != null ? (rr / total) * 100 : 50
  const has = rr != null

  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <div
        className="relative flex items-center"
        style={{ height: 26, borderRadius: 8, overflow: "hidden", border: `1px solid ${VANTARY.rule}`, background: VANTARY.ruleSoft }}
      >
        {/* risk */}
        <motion.div
          initial={false}
          animate={{ width: `${riskW}%` }}
          transition={reduce ? { duration: 0 } : SPRING.reveal}
          style={{ height: "100%", background: `${RISK_TONE}${has ? "33" : "1A"}`, borderRight: `1px solid ${RISK_TONE}55` }}
        />
        {/* reward */}
        <motion.div
          initial={false}
          animate={{ width: `${rewardW}%` }}
          transition={reduce ? { duration: 0 } : SPRING.reveal}
          style={{ flex: 1, height: "100%", background: `${REWARD_TONE}${has ? "2E" : "14"}` }}
        />
        {/* centered RR label */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: "none" }}>
          <motion.span
            className="font-mono tabular-nums"
            initial={false}
            animate={{ color: flashColor(VANTARY.paper, accent, flashing) }}
            transition={T.flash}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.02em", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {has ? `1 : ${rr!.toFixed(2)}` : "RR —"}
          </motion.span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: RISK_TONE }}>RISK</span>
        <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: REWARD_TONE }}>REWARD</span>
      </div>
    </div>
  )
})

function fmtMoney(n: number): string {
  const a = Math.abs(n)
  const s = a >= 1000 ? `$${(a / 1000).toFixed(1)}k` : `$${a.toFixed(0)}`
  return n < 0 ? `−${s}` : s
}
