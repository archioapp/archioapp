"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · ACCURACY ENGINE — call quality over time
   ───────────────────────────────────────────────────────────────────────────
   Forecast/entry accuracy, its 30-day trajectory, your strongest and weakest
   setups, and the AI read on what's dragging the number.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { RadialGauge, AreaSpark, Stat, TrendArrow } from "../instruments"
import { PERFORMANCE } from "@/components/dashboard/dashboard-data"
import { fmtPct } from "./inspector-data"

function SetupRow({ label, wr, samples, accent, suggestion }: {
  label: string; wr: number; samples?: number; accent: { hex: string; rgb: string }; suggestion?: string
}) {
  const c = wr >= 60 ? VT.emerald : wr >= 45 ? VT.amber : VT.rose
  const rgbC = wr >= 60 ? VT.emeraldRgb : wr >= 45 ? VT.amberRgb : VT.roseRgb
  return (
    <div style={{ padding: "10px 12px", borderRadius: 10, background: rgba(rgbC, 0.05), border: `1px solid ${rgba(rgbC, 0.16)}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="font-sans" style={{ fontSize: 12.5, color: VT.paper, flex: 1 }}>{label}</span>
        {samples != null && <span className="font-mono" style={{ fontSize: 10, color: VT.ashSoft }}>{samples} trades</span>}
        <span className="font-mono tabular-nums" style={{ fontSize: 14, color: c }}>{fmtPct(wr, 0)}</span>
      </div>
      {suggestion && <div className="font-sans" style={{ fontSize: 11, color: VT.ashSoft, marginTop: 4, lineHeight: 1.45 }}>{suggestion}</div>}
    </div>
  )
}

function AccuracyEngineBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "accuracy", label: "Accuracy" },
      { id: "setups", label: "Setups" },
    ])
  }, [registerTabs])

  const acc = PERFORMANCE.accuracy
  const accColor = acc >= 60 ? VT.emerald : acc >= 45 ? VT.amber : VT.rose

  if (activeTab === "accuracy") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={2}>
          <InspectorSection title="Accuracy" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <RadialGauge value={acc} min={0} max={100} size={140} thickness={12}
                accent={{ hex: accColor, rgb: acc >= 60 ? VT.emeraldRgb : VT.amberRgb, halo: "", wash: "" }}
                label={fmtPct(acc, 0)} sublabel="ACCURATE" />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <Stat label="30-day trend" value={`${PERFORMANCE.accuracyTrend > 0 ? "+" : ""}${PERFORMANCE.accuracyTrend}%`}
                  color={PERFORMANCE.accuracyTrend >= 0 ? VT.emerald : VT.rose} valueSize={18}
                  sub={<TrendArrow value={PERFORMANCE.accuracyTrend} suffix="%" />} />
                <Stat label="Consistency score" value={`${PERFORMANCE.consistencyScore}`} color={accent.hex} valueSize={18} />
              </div>
            </div>
          </InspectorSection>
          <InspectorSection title="Best vs worst session" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
              {[
                { label: PERFORMANCE.bestSession.name, wr: PERFORMANCE.bestSession.winRate, c: VT.emerald, rgb: VT.emeraldRgb },
                { label: PERFORMANCE.worstSession.name, wr: PERFORMANCE.worstSession.winRate, c: VT.rose, rgb: VT.roseRgb },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span className="font-sans" style={{ fontSize: 12, color: VT.paper }}>{s.label}</span>
                    <span className="font-mono tabular-nums" style={{ fontSize: 12, color: s.c }}>{fmtPct(s.wr, 0)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: rgba("255,255,255", 0.06), overflow: "hidden" }}>
                    <div style={{ width: `${s.wr}%`, height: "100%", borderRadius: 4, background: s.c, boxShadow: `0 0 8px ${rgba(s.rgb, 0.5)}` }} />
                  </div>
                </div>
              ))}
            </div>
          </InspectorSection>
        </InspectorGrid>
        <InspectorSection title="Accuracy · trailing 30 sessions" accent={accent}>
          <AreaSpark data={[...PERFORMANCE.sparkline]} w={780} h={140} accent={accent} strokeWidth={2} />
        </InspectorSection>
        <InspectorNote accent={accent}>
          Accuracy is {acc.toFixed(1)}% and trending {PERFORMANCE.accuracyTrend >= 0 ? "up" : "down"}{" "}
          {Math.abs(PERFORMANCE.accuracyTrend)}% over 30 days. Your {PERFORMANCE.bestSession.name} session
          ({PERFORMANCE.bestSession.winRate}%) carries the number — protect that window and trade lighter
          in {PERFORMANCE.worstSession.name} ({PERFORMANCE.worstSession.winRate}%).
        </InspectorNote>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorSection title="Strongest setups" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SetupRow label={PERFORMANCE.bestSetup.name} wr={PERFORMANCE.bestSetup.winRate} samples={PERFORMANCE.bestSetup.sampleSize} accent={accent} />
          <SetupRow label={PERFORMANCE.bestPair.name} wr={PERFORMANCE.bestPair.winRate} accent={accent} />
        </div>
      </InspectorSection>
      <InspectorSection title="Needs attention" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SetupRow label={PERFORMANCE.worstSetup.name} wr={PERFORMANCE.worstSetup.winRate} samples={PERFORMANCE.worstSetup.sampleSize} accent={accent} suggestion={PERFORMANCE.worstSetup.aiSuggestion} />
          <SetupRow label={PERFORMANCE.worstPair.name} wr={PERFORMANCE.worstPair.winRate} accent={accent} suggestion={PERFORMANCE.worstPair.aiSuggestion} />
        </div>
      </InspectorSection>
    </div>
  )
}

registerInspector("accuracy-engine", {
  eyebrow: "PERFORMANCE · CALLS",
  title: "Accuracy Engine",
  subtitle: "How accurate your calls are, where they're sharpest, and what's pulling the number down.",
  Body: AccuracyEngineBody,
})
