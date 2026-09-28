"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · LAST 5 TRADES — the recent tape
   ───────────────────────────────────────────────────────────────────────────
   Every recent trade with its R outcome, direction, and timeframe, plus the
   R-distribution and the running read on current form.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { RMultiplePips, Stat, BarColumns } from "../instruments"
import { RECENT_TRADES } from "@/components/dashboard/dashboard-data"

function Last5TradesBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "tape", label: "Recent Tape" },
      { id: "dist", label: "R Distribution" },
    ])
  }, [registerTabs])

  const wins = RECENT_TRADES.filter((t) => t.won).length
  const netR = RECENT_TRADES.reduce((s, t) => s + t.rMultiple, 0)
  const rValues = RECENT_TRADES.map((t) => t.rMultiple)

  if (activeTab === "tape") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={3}>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Last 5 record" value={`${wins}W · ${RECENT_TRADES.length - wins}L`} color={wins >= RECENT_TRADES.length - wins ? VT.emerald : VT.rose} valueSize={18} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Net R" value={`${netR >= 0 ? "+" : ""}${netR.toFixed(1)}R`} color={netR >= 0 ? VT.emerald : VT.rose} valueSize={18} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Form" value={<RMultiplePips results={rValues} size={9} />} valueSize={14} />
          </InspectorSection>
        </InspectorGrid>
        <InspectorSection title="Recent trades" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RECENT_TRADES.map((t) => {
              const c = t.won ? VT.emerald : VT.rose
              const rgbC = t.won ? VT.emeraldRgb : VT.roseRgb
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: rgba(rgbC, 0.05), border: `1px solid ${rgba(rgbC, 0.16)}` }}>
                  <span style={{ width: 4, height: 26, borderRadius: 2, background: c, flexShrink: 0, boxShadow: `0 0 8px ${rgba(rgbC, 0.5)}` }} />
                  <span className="font-mono" style={{ fontSize: 13, color: VT.paper, width: 76, flexShrink: 0 }}>{t.pair}</span>
                  <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: t.direction === "long" ? VT.emerald : VT.rose, width: 46 }}>{t.direction.toUpperCase()}</span>
                  <span className="font-mono" style={{ fontSize: 10, color: VT.ashSoft, width: 36 }}>{t.timeframe}</span>
                  <span className="font-sans" style={{ fontSize: 11, color: VT.ashSoft, flex: 1, textAlign: "right" }}>{t.recency}</span>
                  <span className="font-mono tabular-nums" style={{ fontSize: 13, color: c, width: 56, textAlign: "right" }}>{t.rMultiple >= 0 ? "+" : ""}{t.rMultiple.toFixed(1)}R</span>
                </div>
              )
            })}
          </div>
        </InspectorSection>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorSection title="R-multiple per trade" accent={accent}>
        <BarColumns data={[...rValues]} w={780} h={160} accent={accent} gap={14} />
      </InspectorSection>
      <InspectorGrid cols={3}>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Best trade" value={`+${Math.max(...rValues).toFixed(1)}R`} color={VT.emerald} valueSize={18} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Worst trade" value={`${Math.min(...rValues).toFixed(1)}R`} color={VT.rose} valueSize={18} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Avg R" value={`${(netR / RECENT_TRADES.length).toFixed(2)}R`} color={accent.hex} valueSize={18} />
        </InspectorSection>
      </InspectorGrid>
      <InspectorNote accent={accent}>
        Across your last {RECENT_TRADES.length} trades you&apos;re {wins}W / {RECENT_TRADES.length - wins}L
        for <strong style={{ color: netR >= 0 ? VT.emerald : VT.rose }}>{netR >= 0 ? "+" : ""}{netR.toFixed(1)}R</strong> net.
        Your winners are running to {Math.max(...rValues).toFixed(1)}R while losses stay capped near 1R —
        exactly the asymmetry that compounds an account.
      </InspectorNote>
    </div>
  )
}

registerInspector("last-5-trades", {
  eyebrow: "ACTIVITY · TAPE",
  title: "Last 5 Trades",
  subtitle: "Your recent tape — outcomes, direction, and the R-asymmetry behind the curve.",
  Body: Last5TradesBody,
})
