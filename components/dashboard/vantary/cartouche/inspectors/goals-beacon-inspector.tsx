"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · GOALS BEACON — progress toward the trader's personal goals
   ───────────────────────────────────────────────────────────────────────────
   Every personal goal with its progress ring, milestone, and category, plus
   the aggregate read on momentum across trading / discipline / personal arcs.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { RadialGauge, Stat } from "../instruments"
import { PERSONAL_GOALS } from "@/components/dashboard/dashboard-data"

const CAT_COLOR: Record<string, string> = { trading: VT.emerald, discipline: VT.amber, personal: VT.blue }

function GoalsBeaconBody({ accent }: InspectorBodyProps) {
  const avg = PERSONAL_GOALS.reduce((s, g) => s + g.progress, 0) / PERSONAL_GOALS.length
  const nearest = [...PERSONAL_GOALS].sort((a, b) => b.progress - a.progress)[0]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorGrid cols={3}>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Active goals" value={`${PERSONAL_GOALS.length}`} color={accent.hex} valueSize={22} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Avg progress" value={`${Math.round(avg)}%`} color={VT.paper} valueSize={22} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Closest" value={`${nearest.progress}%`} color={VT.emerald} valueSize={22} />
        </InspectorSection>
      </InspectorGrid>

      <InspectorSection title="Every goal" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PERSONAL_GOALS.map((g) => {
            const c = CAT_COLOR[g.type] ?? accent.hex
            return (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 12, background: rgba("255,255,255", 0.03), border: `1px solid ${rgba("255,255,255", 0.07)}` }}>
                <RadialGauge value={g.progress} max={100} size={52} thickness={5} accent={accent} valueColor={c} label={`${g.progress}%`} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-sans" style={{ fontSize: 14, fontWeight: 500, color: VT.paper }}>{g.title}</div>
                  <div className="font-sans" style={{ fontSize: 12, color: VT.ashSoft, marginTop: 1 }}>{g.milestoneLabel}</div>
                </div>
                <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: c, padding: "3px 8px", borderRadius: 6, background: rgba(c === VT.emerald ? VT.emeraldRgb : c === VT.amber ? VT.amberRgb : VT.blueRgb, 0.12), border: `1px solid ${rgba(c === VT.emerald ? VT.emeraldRgb : c === VT.amber ? VT.amberRgb : VT.blueRgb, 0.26)}` }}>
                  {g.type.toUpperCase()}
                </span>
              </div>
            )
          })}
        </div>
      </InspectorSection>

      <InspectorNote accent={accent}>
        You&apos;re averaging <strong style={{ color: accent.hex }}>{Math.round(avg)}%</strong> across{" "}
        <strong style={{ color: accent.hex }}>{PERSONAL_GOALS.length} goals</strong>, with{" "}
        <strong style={{ color: VT.emerald }}>&quot;{nearest.title}&quot;</strong> closest to the line at {nearest.progress}%.
        Momentum compounds — finishing the nearest goal first builds the streak that carries the rest.
      </InspectorNote>
    </div>
  )
}

registerInspector("goals-beacon", {
  eyebrow: "IDENTITY · GOALS",
  title: "Goals Beacon",
  subtitle: "Progress across every personal goal — trading, discipline, and the life behind the screens.",
  Body: GoalsBeaconBody,
})
