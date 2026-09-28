"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · RISK ENVELOPE — today's risk budget, fully expanded
   ───────────────────────────────────────────────────────────────────────────
   How much of the daily loss ceiling is spent, per-trade risk cap, live open
   risk, and the clear read on whether another trade is responsible.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { RadialGauge, Stat } from "../instruments"
import { DAILY_PLAN } from "@/components/dashboard/dashboard-data"

function RiskEnvelopeBody({ accent }: InspectorBodyProps) {
  const used = DAILY_PLAN.dailyLossUsed
  const max = DAILY_PLAN.maxDailyLoss
  const perTrade = DAILY_PLAN.maxRiskPerTrade
  const remaining = Math.max(0, max - used)
  const pct = Math.max(0, Math.min(1, used / max))
  const tradesLeft = Math.max(0, DAILY_PLAN.maxTrades - DAILY_PLAN.tradesUsed)
  const zone = pct >= 0.8 ? VT.rose : pct >= 0.5 ? VT.amber : VT.emerald
  const zoneLabel = pct >= 0.8 ? "CRITICAL" : pct >= 0.5 ? "CAUTION" : "HEALTHY"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorGrid cols={2}>
        <InspectorSection title="Daily loss budget" accent={accent}>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <RadialGauge value={(1 - pct) * 100} max={100} size={168} thickness={14} accent={accent} valueColor={zone} label={`${remaining.toFixed(1)}%`} sublabel="BUDGET LEFT" />
          </div>
        </InspectorSection>
        <InspectorSection title="The numbers" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Stat label="Risk used today" value={`${used.toFixed(1)}% of ${max.toFixed(0)}%`} color={zone} valueSize={20} />
            <Stat label="Per-trade cap" value={`${perTrade.toFixed(1)}%`} color={VT.paper} valueSize={20} />
            <Stat label="Trades remaining" value={`${tradesLeft} of ${DAILY_PLAN.maxTrades}`} color={accent.hex} valueSize={20} />
            <div style={{ marginTop: 2, display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px", borderRadius: 8, alignSelf: "flex-start", background: rgba(zone === VT.emerald ? VT.emeraldRgb : zone === VT.amber ? VT.amberRgb : VT.roseRgb, 0.12), border: `1px solid ${rgba(zone === VT.emerald ? VT.emeraldRgb : zone === VT.amber ? VT.amberRgb : VT.roseRgb, 0.3)}` }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: zone, boxShadow: `0 0 7px ${zone}` }} />
              <span className="font-mono" style={{ fontSize: 10.5, letterSpacing: "0.08em", color: zone }}>{zoneLabel}</span>
            </div>
          </div>
        </InspectorSection>
      </InspectorGrid>

      <InspectorNote accent={accent}>
        You&apos;ve used <strong style={{ color: zone }}>{used.toFixed(1)}%</strong> of your{" "}
        <strong style={{ color: accent.hex }}>{max.toFixed(0)}%</strong> daily loss ceiling, leaving{" "}
        <strong style={{ color: VT.emerald }}>{remaining.toFixed(1)}%</strong> of headroom and{" "}
        <strong style={{ color: accent.hex }}>{tradesLeft} trade{tradesLeft === 1 ? "" : "s"}</strong> in the plan.{" "}
        {pct >= 0.8
          ? "You're near the wall — the disciplined move is to stop, not to chase it back."
          : pct >= 0.5
          ? "Half the budget is spent. Be selective: only A+ setups from here."
          : "Plenty of runway. Stay patient and let the plan come to you."}
      </InspectorNote>
    </div>
  )
}

registerInspector("risk-envelope", {
  eyebrow: "DISCIPLINE · RISK",
  title: "Risk Envelope",
  subtitle: "Today's loss budget, per-trade cap, and whether another trade is responsible.",
  Body: RiskEnvelopeBody,
})
