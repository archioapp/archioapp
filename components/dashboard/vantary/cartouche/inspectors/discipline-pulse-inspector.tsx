"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · DISCIPLINE PULSE — the behavioral mirror
   ───────────────────────────────────────────────────────────────────────────
   Discipline score ring, 12-session adherence strip, behavioral ledger, and
   the AI-detected patterns that quietly shape the trader's edge.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { RadialGauge, Heatstrip, Heartbeat, Stat } from "../instruments"
import { PSYCHOLOGY } from "@/components/dashboard/dashboard-data"
import { DISCIPLINE_12D, BEHAVIOR_LEDGER, fmtPct } from "./inspector-data"

const LEDGER_TONE: Record<string, { hex: string; rgb: string; tag: string }> = {
  good:   { hex: VT.emerald, rgb: VT.emeraldRgb, tag: "HELD" },
  watch:  { hex: VT.amber,   rgb: VT.amberRgb,   tag: "WATCH" },
  breach: { hex: VT.rose,    rgb: VT.roseRgb,    tag: "BREACH" },
}

function DisciplinePulseBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "pulse", label: "Discipline" },
      { id: "ledger", label: "Behavior Ledger" },
      { id: "patterns", label: "AI Patterns" },
    ])
  }, [registerTabs])

  const score = PSYCHOLOGY.disciplineScore
  const adherence = Math.round((DISCIPLINE_12D.filter((d) => d >= 0.9).length / DISCIPLINE_12D.length) * 100)
  const scoreColor = score >= 75 ? VT.emerald : score >= 55 ? VT.amber : VT.rose
  const heldCount = BEHAVIOR_LEDGER.filter((b) => b.status === "good").length

  /* ── DISCIPLINE ── */
  if (activeTab === "pulse") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={2}>
          <InspectorSection title="Discipline score" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <RadialGauge
                value={score}
                min={0}
                max={100}
                size={140}
                thickness={12}
                accent={{ hex: scoreColor, rgb: score >= 75 ? VT.emeraldRgb : score >= 55 ? VT.amberRgb : VT.roseRgb, halo: "", wash: "" }}
                label={`${score}`}
                sublabel={PSYCHOLOGY.disciplineLevel.toUpperCase()}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <Stat label="Consecutive losses" value={PSYCHOLOGY.consecutiveLosses} color={PSYCHOLOGY.consecutiveLosses >= 2 ? VT.amber : VT.paper} valueSize={18} />
                <Stat label="Revenge-trade risk" value={PSYCHOLOGY.revengeTradingRisk.toUpperCase()} color={PSYCHOLOGY.revengeTradingRisk === "low" ? VT.emerald : VT.rose} valueSize={16} />
                <Stat label="Plan adherence" value={fmtPct(adherence, 0)} color={accent.hex} valueSize={18} />
              </div>
            </div>
          </InspectorSection>
          <InspectorSection title="Composure" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 6 }}>
              <Heartbeat accent={{ hex: scoreColor, rgb: score >= 75 ? VT.emeraldRgb : VT.amberRgb, halo: "", wash: "" }} w={320} h={56} bpm={score >= 75 ? 64 : 88} />
              <InspectorNote accent={accent}>
                A steady, slow pulse signals composed execution. Elevated rhythm means recent
                sessions carried emotional charge — the moment to slow down and re-anchor to plan.
              </InspectorNote>
            </div>
          </InspectorSection>
        </InspectorGrid>
        <InspectorSection title="12-session adherence" accent={accent}
          action={<span className="font-mono" style={{ fontSize: 10, color: VT.ashSoft }}>green = plan held</span>}>
          <Heatstrip cells={[...DISCIPLINE_12D]} w={780} h={44} accent={accent} />
        </InspectorSection>
      </div>
    )
  }

  /* ── BEHAVIOR LEDGER ── */
  if (activeTab === "ledger") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={3}>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Behaviors held" value={`${heldCount} / ${BEHAVIOR_LEDGER.length}`} color={VT.emerald} valueSize={18} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="On watch" value={BEHAVIOR_LEDGER.filter((b) => b.status === "watch").length} color={VT.amber} valueSize={18} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Breaches" value={BEHAVIOR_LEDGER.filter((b) => b.status === "breach").length} color={VT.rose} valueSize={18} />
          </InspectorSection>
        </InspectorGrid>
        <InspectorSection title="Behavioral ledger" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BEHAVIOR_LEDGER.map((b) => {
              const tone = LEDGER_TONE[b.status]!
              return (
                <div key={b.label} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                  borderRadius: 10, background: rgba(tone.rgb, 0.05),
                  border: `1px solid ${rgba(tone.rgb, 0.16)}`,
                }}>
                  <span style={{ width: 6, height: 28, borderRadius: 3, background: tone.hex, flexShrink: 0, boxShadow: `0 0 10px ${rgba(tone.rgb, 0.5)}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-sans" style={{ fontSize: 12.5, color: VT.paper }}>{b.label}</div>
                    <div className="font-sans" style={{ fontSize: 11, color: VT.ashSoft }}>{b.detail}</div>
                  </div>
                  <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: tone.hex, padding: "3px 8px", borderRadius: 6, background: rgba(tone.rgb, 0.12) }}>{tone.tag}</span>
                </div>
              )
            })}
          </div>
        </InspectorSection>
      </div>
    )
  }

  /* ── AI PATTERNS ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorNote accent={accent}>
        These are behavioral correlations the engine surfaced from your own trade history — not
        generic advice. Each one is a lever: protect the strong patterns, defuse the costly ones.
      </InspectorNote>
      <InspectorSection title="Detected patterns" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PSYCHOLOGY.patterns.map((p, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10,
              background: rgba(accent.rgb, 0.05), border: `1px solid ${rgba(accent.rgb, 0.16)}`,
            }}>
              <span className="font-mono" style={{ fontSize: 12, color: accent.hex, flexShrink: 0, paddingTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="font-sans" style={{ fontSize: 12.5, color: VT.paper, lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>
      </InspectorSection>
    </div>
  )
}

registerInspector("discipline-pulse", {
  eyebrow: "PSYCHE · BEHAVIOR",
  title: "Discipline Pulse",
  subtitle: "The mirror — your composure, plan adherence, and the patterns that move your edge.",
  Body: DisciplinePulseBody,
})
