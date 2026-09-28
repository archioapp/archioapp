"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · DAILY PLAN — the pre-flight checklist
   ───────────────────────────────────────────────────────────────────────────
   Today's intent: focus pairs, session, the personal rules in force, the
   macro events to respect, and the AI read on where the edge is today.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { Stat } from "../instruments"
import { DAILY_PLAN } from "@/components/dashboard/dashboard-data"

const IMPACT_COLOR: Record<string, string> = { high: VT.rose, medium: VT.amber, low: VT.emerald }

function DailyPlanBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "plan", label: "The Plan" },
      { id: "rules", label: "Rules & Events" },
    ])
  }, [registerTabs])

  const tradesLeft = Math.max(0, DAILY_PLAN.maxTrades - DAILY_PLAN.tradesUsed)

  if (activeTab === "plan") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={3}>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Trades left" value={`${tradesLeft} / ${DAILY_PLAN.maxTrades}`} color={accent.hex} valueSize={20} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Risk / trade" value={`${DAILY_PLAN.maxRiskPerTrade.toFixed(1)}%`} color={VT.paper} valueSize={20} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Session" value={DAILY_PLAN.sessionFocus.join(", ")} color={VT.paper} valueSize={18} />
          </InspectorSection>
        </InspectorGrid>

        <InspectorSection title="Focus pairs" accent={accent}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DAILY_PLAN.focusPairs.map((p) => (
              <span key={p} className="font-mono" style={{ fontSize: 14, padding: "7px 14px", borderRadius: 10, color: accent.hex, background: rgba(accent.rgb, 0.1), border: `1px solid ${rgba(accent.rgb, 0.24)}` }}>
                {p}
              </span>
            ))}
          </div>
        </InspectorSection>

        <InspectorSection title="AI read for today" accent={accent}>
          <p className="font-sans" style={{ fontSize: 13.5, lineHeight: 1.6, color: VT.ashSoft, margin: 0 }}>{DAILY_PLAN.aiSuggestion}</p>
        </InspectorSection>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorSection title="Rules in force" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DAILY_PLAN.personalRules.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, background: rgba(accent.rgb, 0.05), border: `1px solid ${rgba(accent.rgb, 0.14)}` }}>
              <span style={{ marginTop: 2, width: 6, height: 6, borderRadius: 999, background: accent.hex, flexShrink: 0, boxShadow: `0 0 6px ${rgba(accent.rgb, 0.6)}` }} />
              <span className="font-sans" style={{ fontSize: 13, color: VT.paper, lineHeight: 1.45 }}>{r}</span>
            </div>
          ))}
        </div>
      </InspectorSection>

      <InspectorSection title="Macro events to respect" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DAILY_PLAN.macroEvents.map((e, i) => {
            const c = IMPACT_COLOR[e.impact] ?? VT.ashSoft
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: rgba("255,255,255", 0.03), border: `1px solid ${rgba("255,255,255", 0.07)}` }}>
                <span className="font-mono tabular-nums" style={{ fontSize: 13, color: VT.paper, width: 52, flexShrink: 0 }}>{e.time}</span>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: c, flexShrink: 0, boxShadow: `0 0 7px ${c}` }} />
                <span className="font-sans" style={{ fontSize: 13, color: VT.paper, flex: 1 }}>{e.event}</span>
                <span className="font-mono" style={{ fontSize: 10.5, letterSpacing: "0.05em", color: c, width: 44, textAlign: "right" }}>{e.currency}</span>
              </div>
            )
          })}
        </div>
      </InspectorSection>

      <InspectorNote accent={accent}>
        Two high-impact prints today — trade around them, not into them. The plan caps you at{" "}
        <strong style={{ color: accent.hex }}>{DAILY_PLAN.maxTrades} trades</strong> and{" "}
        <strong style={{ color: accent.hex }}>{DAILY_PLAN.maxRiskPerTrade.toFixed(1)}% per trade</strong> —
        structure beats impulse every session.
      </InspectorNote>
    </div>
  )
}

registerInspector("daily-plan", {
  eyebrow: "DISCIPLINE · PLAN",
  title: "Daily Plan",
  subtitle: "Today's intent — focus pairs, rules in force, macro events, and the AI read on your edge.",
  Body: DailyPlanBody,
})
