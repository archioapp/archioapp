"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · MACRO PULSE — today's event risk
   ───────────────────────────────────────────────────────────────────────────
   High-impact economic events on the calendar, ranked by time, with the
   stand-aside guidance baked into the trader's plan.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { Stat } from "../instruments"
import { EVENTS_TODAY } from "@/components/dashboard/dashboard-data"

const IMPACT_TONE: Record<string, { hex: string; rgb: string; label: string }> = {
  high: { hex: VT.rose, rgb: VT.roseRgb, label: "HIGH" },
  medium: { hex: VT.amber, rgb: VT.amberRgb, label: "MED" },
  low: { hex: VT.ashSoft, rgb: "148,163,184", label: "LOW" },
}

function MacroPulseBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([{ id: "calendar", label: "Today's Calendar" }])
  }, [registerTabs])

  const highCount = EVENTS_TODAY.filter((e) => e.impact === "high").length
  const nextEvent = EVENTS_TODAY[0]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorGrid cols={3}>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Events today" value={EVENTS_TODAY.length} color={accent.hex} valueSize={20} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="High impact" value={highCount} color={VT.rose} valueSize={20} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Next event" value={nextEvent?.time ?? "—"} valueSize={20} sub={nextEvent?.currency} />
        </InspectorSection>
      </InspectorGrid>
      <InspectorSection title="Economic calendar · today" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EVENTS_TODAY.map((e, i) => {
            const tone = IMPACT_TONE[e.impact]!
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: 10, background: rgba(tone.rgb, 0.05), border: `1px solid ${rgba(tone.rgb, 0.16)}` }}>
                <span className="font-mono tabular-nums" style={{ fontSize: 13, color: VT.paper, width: 48, flexShrink: 0 }}>{e.time}</span>
                <span style={{ width: 4, height: 24, borderRadius: 2, background: tone.hex, flexShrink: 0, boxShadow: `0 0 8px ${rgba(tone.rgb, 0.5)}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-sans" style={{ fontSize: 12.5, color: VT.paper }}>{e.event}</div>
                  <div className="font-mono" style={{ fontSize: 9.5, color: VT.ashSoft, letterSpacing: "0.06em" }}>{e.currency}</div>
                </div>
                <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: tone.hex, padding: "3px 8px", borderRadius: 6, background: rgba(tone.rgb, 0.12) }}>{tone.label}</span>
              </div>
            )
          })}
        </div>
      </InspectorSection>
      <InspectorNote accent={accent}>
        {highCount} high-impact {highCount === 1 ? "event" : "events"} on the tape today. Your plan calls
        for <strong style={{ color: accent.hex }}>no trading 30 minutes before high-impact news</strong> —
        these are the windows where spreads widen and clean structure breaks down. Let the volatility
        resolve, then trade the reaction.
      </InspectorNote>
    </div>
  )
}

registerInspector("macro-pulse", {
  eyebrow: "MARKET · EVENT RISK",
  title: "Macro Pulse",
  subtitle: "Today's event risk — what's on the calendar and when to stand aside.",
  Body: MacroPulseBody,
})
