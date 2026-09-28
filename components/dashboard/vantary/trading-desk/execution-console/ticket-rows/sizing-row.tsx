"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET · ROW 5 — SIZING (Risk% ⇄ Risk$ ⇄ Lot)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Design law: RISK IS THE PROTAGONIST. The trader sets what they're willing to
 *  lose; LOT SIZE is the computed consequence (never typed). This row presents
 *  three bound readouts — Risk %, Risk $, and Lot/Units — where Risk % is the
 *  one input (a scrubbable stepper bounded by the account ceiling) and the
 *  other two are derived, flashing the accent when they recompute.
 *
 *  Beneath, a SegmentMeter shows how much of the account's remaining DAILY risk
 *  budget this trade consumes, heating amber→red as it nears the cap.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Minus, Plus } from "lucide-react"

import { VANTARY } from "../../../vantary-theme"
import { CONSOLE_ACCENTS } from "../console-theme"
import { useTradeDraft } from "../trade-draft-context"
import { SegmentMeter } from "../console-instruments"
import { useValueFlash, flashColor, T } from "../console-motion"

export const SizingRow = memo(function SizingRow() {
  const reduce = useReducedMotion()
  const { mode, draft, account, budget, setRiskPct, buildingEnabled } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]
  const disabled = !buildingEnabled

  const ceiling = account?.maxRiskPctPerTrade ?? 5
  const step = 0.1

  const riskFlash = useValueFlash(draft.riskAmount)
  const lotFlash = useValueFlash(draft.lotSize)

  // fraction of remaining daily budget this trade eats
  const budgetFraction = budget && budget.remaining > 0
    ? Math.min(1, draft.riskAmount / budget.remaining)
    : 0
  const budgetTone = budgetFraction > 0.85 ? VANTARY.chartDown : budgetFraction > 0.6 ? "#E5A93C" : accent.base

  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
          POSITION SIZE
        </span>
        {draft.riskCappedByBudget && (
          <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.1em", color: "#E5A93C" }}>
            CAPPED BY BUDGET
          </span>
        )}
      </div>

      <div className="grid items-stretch" style={{ gridTemplateColumns: "1.15fr 1fr 1fr", gap: 8 }}>
        {/* RISK % — the input */}
        <div
          className="flex flex-col"
          style={{
            gap: 6, padding: "9px 10px", borderRadius: 10,
            border: `1px solid ${accent.base}55`, background: `${accent.base}12`,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: accent.base }}>RISK</span>
          <div className="flex items-center justify-between gap-1">
            <Stepper dir={-1} icon={Minus} onClick={() => setRiskPct(draft.riskPct - step)} disabled={disabled} tone={accent.base} />
            <span className="font-mono tabular-nums" style={{ fontSize: 17, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.01em" }}>
              {draft.riskPct.toFixed(1)}<span style={{ fontSize: 11, color: VANTARY.ashSoft }}>%</span>
            </span>
            <Stepper dir={1} icon={Plus} onClick={() => setRiskPct(draft.riskPct + step)} disabled={disabled || draft.riskPct >= ceiling} tone={accent.base} />
          </div>
        </div>

        {/* RISK $ — derived */}
        <DerivedCell
          label="RISK $"
          flash={riskFlash}
          accent={accent.base}
          value={draft.riskAmount > 0 ? fmtMoney(draft.riskAmount) : "—"}
        />

        {/* LOT — derived */}
        <DerivedCell
          label="LOT"
          flash={lotFlash}
          accent={accent.base}
          value={draft.lotSize != null ? draft.lotSize.toFixed(2) : "—"}
          sub={draft.units != null ? `${draft.units.toLocaleString()} u` : undefined}
        />
      </div>

      {/* daily budget consumption */}
      {budget && (
        <div className="flex flex-col" style={{ gap: 5 }}>
          <SegmentMeter fraction={budgetFraction} color={budgetTone} segments={20} height={5} />
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
              OF DAILY BUDGET
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: 8.5, color: budgetTone }}>
              {Math.round(budgetFraction * 100)}% · {fmtMoney(budget.remaining)} left
            </span>
          </div>
        </div>
      )}
    </div>
  )
})

const DerivedCell = memo(function DerivedCell({
  label, value, sub, flash, accent,
}: {
  label: string
  value: string
  sub?: string
  flash: boolean
  accent: string
}) {
  return (
    <div
      className="flex flex-col justify-between"
      style={{ gap: 4, padding: "9px 10px", borderRadius: 10, border: `1px solid ${VANTARY.rule}`, background: VANTARY.glass }}
    >
      <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>{label}</span>
      <div className="flex items-baseline gap-1">
        <motion.span
          className="font-mono tabular-nums"
          initial={false}
          animate={{ color: flashColor(VANTARY.paper, accent, flash) }}
          transition={T.flash}
          style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {value}
        </motion.span>
        {sub && <span className="font-mono" style={{ fontSize: 8, color: VANTARY.ashSoft }}>{sub}</span>}
      </div>
    </div>
  )
})

const Stepper = memo(function Stepper({
  dir, icon: Icon, onClick, disabled, tone,
}: {
  dir: 1 | -1
  icon: typeof Minus
  onClick: () => void
  disabled: boolean
  tone: string
}) {
  return (
    <button
      type="button"
      aria-label={dir > 0 ? "Increase risk" : "Decrease risk"}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center"
      style={{
        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
        border: `1px solid ${tone}44`, background: `${tone}10`, color: tone,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon size={12} strokeWidth={2.4} />
    </button>
  )
})

function fmtMoney(n: number): string {
  const a = Math.abs(n)
  const s = a >= 1000 ? `$${(a / 1000).toFixed(1)}k` : `$${a.toFixed(0)}`
  return n < 0 ? `−${s}` : s
}
