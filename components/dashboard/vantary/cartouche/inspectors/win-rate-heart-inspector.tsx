"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · WIN RATE HEART — the conversion engine
   ───────────────────────────────────────────────────────────────────────────
   Win rate over time, win/loss split, profit factor, and the R-distribution
   that explains how a sub-50% strategy can still print money.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { RadialGauge, AreaSpark, Donut, Stat, TrendArrow } from "../instruments"
import { PERFORMANCE } from "@/components/dashboard/dashboard-data"
import { WINS, LOSSES, EXPECTANCY_R, fmtPct } from "./inspector-data"

function WinRateHeartBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "rate", label: "Win Rate" },
      { id: "quality", label: "Edge Quality" },
    ])
  }, [registerTabs])

  const wr = PERFORMANCE.winRate
  const wrColor = wr >= 60 ? VT.emerald : wr >= 45 ? VT.amber : VT.rose

  if (activeTab === "rate") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={2}>
          <InspectorSection title="Win rate" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <RadialGauge value={wr} min={0} max={100} size={140} thickness={12}
                accent={{ hex: wrColor, rgb: wr >= 60 ? VT.emeraldRgb : VT.amberRgb, halo: "", wash: "" }}
                label={fmtPct(wr, 0)} sublabel="WIN RATE" />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <Stat label="Total trades" value={PERFORMANCE.totalTrades} valueSize={18} />
                <Stat label="Wins" value={WINS} color={VT.emerald} valueSize={18} />
                <Stat label="Losses" value={LOSSES} color={VT.rose} valueSize={18} />
              </div>
            </div>
          </InspectorSection>
          <InspectorSection title="Win / loss split" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Donut size={120} thickness={14} label={`${WINS}`} sublabel="wins"
                segments={[
                  { value: WINS, color: VT.emerald, rgb: VT.emeraldRgb, label: "Wins" },
                  { value: LOSSES, color: VT.rose, rgb: VT.roseRgb, label: "Losses" },
                ]} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <Stat label="Profit factor" value={PERFORMANCE.profitFactor.toFixed(2)} color={accent.hex} valueSize={20} />
                <Stat label="Avg R / trade" value={`${PERFORMANCE.averageRR.toFixed(1)}R`} valueSize={18} />
              </div>
            </div>
          </InspectorSection>
        </InspectorGrid>
        <InspectorSection title="Win rate · trailing 30 trades" accent={accent}
          action={<TrendArrow value={PERFORMANCE.accuracyTrend} suffix="%" />}>
          <AreaSpark data={[...PERFORMANCE.sparkline]} w={780} h={140} accent={accent} strokeWidth={2} />
        </InspectorSection>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorGrid cols={3}>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Expectancy" value={`${EXPECTANCY_R.toFixed(2)}R`} color={EXPECTANCY_R >= 0 ? VT.emerald : VT.rose} valueSize={20} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Profit factor" value={PERFORMANCE.profitFactor.toFixed(2)} color={accent.hex} valueSize={20} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Consistency" value={`${PERFORMANCE.consistencyScore}`} valueSize={20} />
        </InspectorSection>
      </InspectorGrid>
      <InspectorNote accent={accent}>
        With a <strong style={{ color: wrColor }}>{fmtPct(wr, 0)}</strong> win rate and{" "}
        <strong style={{ color: accent.hex }}>{PERFORMANCE.averageRR.toFixed(1)}R</strong> average winner,
        your expectancy is <strong style={{ color: EXPECTANCY_R >= 0 ? VT.emerald : VT.rose }}>{EXPECTANCY_R.toFixed(2)}R per trade</strong>.
        The profit factor of {PERFORMANCE.profitFactor.toFixed(2)} means every dollar risked returns{" "}
        ${PERFORMANCE.profitFactor.toFixed(2)} — the edge is in the size of your winners, not the frequency.
      </InspectorNote>
    </div>
  )
}

registerInspector("win-rate-heart", {
  eyebrow: "PERFORMANCE · CONVERSION",
  title: "Win Rate Heart",
  subtitle: "How often you win — and why the size of those wins matters more than the count.",
  Body: WinRateHeartBody,
})
