"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · SESSION CLOCKWORK — the 24-hour edge map
   ───────────────────────────────────────────────────────────────────────────
   A live UTC killzone clock, per-session win rates, and the read on which
   windows to lean into and which to sit out.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { KillzoneClock, Stat, type SessionBand } from "../instruments"
import { SESSIONS, nowUtcHour, fmtPct } from "./inspector-data"

const SESSION_COLORS: Array<{ hex: string; rgb: string }> = [
  { hex: VT.blue, rgb: VT.blueRgb },
  { hex: VT.amber, rgb: VT.amberRgb },
  { hex: VT.emerald, rgb: VT.emeraldRgb },
  { hex: VT.purple, rgb: VT.purpleRgb },
]

function SessionClockworkBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "clock", label: "Killzone Clock" },
      { id: "edge", label: "Session Edge" },
    ])
  }, [registerTabs])

  const [nowHour, setNowHour] = React.useState(() => nowUtcHour())
  React.useEffect(() => {
    const t = setInterval(() => setNowHour(nowUtcHour()), 60_000)
    return () => clearInterval(t)
  }, [])

  const bands: SessionBand[] = SESSIONS.map((s, i) => ({
    startHour: s.startHour, endHour: s.endHour,
    color: SESSION_COLORS[i % SESSION_COLORS.length]!.hex,
    rgb: SESSION_COLORS[i % SESSION_COLORS.length]!.rgb,
    label: s.name,
  }))
  const activeSession = SESSIONS.find((s) => {
    const end = s.endHour > s.startHour ? s.endHour : s.endHour + 24
    const h = nowHour < s.startHour ? nowHour + 24 : nowHour
    return h >= s.startHour && h < end
  })
  const best = [...SESSIONS].sort((a, b) => b.winRate - a.winRate)[0]!

  if (activeTab === "clock") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={2}>
          <InspectorSection title="24-hour killzone clock" accent={accent}>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
              <KillzoneClock size={200} thickness={16} sessions={bands} nowHour={nowHour} accent={accent}
                label={activeSession?.name ?? "Closed"} sublabel={`${String(Math.floor(nowHour)).padStart(2, "0")}:${String(Math.floor((nowHour % 1) * 60)).padStart(2, "0")} UTC`} />
            </div>
          </InspectorSection>
          <InspectorSection title="Sessions" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
              {SESSIONS.map((s, i) => {
                const isActive = activeSession?.name === s.name
                const col = SESSION_COLORS[i % SESSION_COLORS.length]!
                return (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: isActive ? rgba(col.rgb, 0.08) : "transparent", border: `1px solid ${isActive ? rgba(col.rgb, 0.25) : VT.rule}` }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: col.hex, flexShrink: 0, boxShadow: `0 0 8px ${rgba(col.rgb, 0.6)}` }} />
                    <span className="font-sans" style={{ fontSize: 12.5, color: VT.paper, flex: 1 }}>{s.name}{isActive ? " · live" : ""}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: VT.ashSoft }}>KZ {s.killzone}</span>
                    <span className="font-mono tabular-nums" style={{ fontSize: 12, color: s.winRate >= 60 ? VT.emerald : VT.amber, width: 44, textAlign: "right" }}>{fmtPct(s.winRate, 0)}</span>
                  </div>
                )
              })}
            </div>
          </InspectorSection>
        </InspectorGrid>
        <InspectorNote accent={accent}>
          {activeSession ? <>You&apos;re inside the <strong style={{ color: accent.hex }}>{activeSession.name}</strong> session ({fmtPct(activeSession.winRate, 0)} historical win rate).</> : <>All major sessions are closed right now — a natural stand-aside window.</>}{" "}
          Your sharpest window is <strong style={{ color: VT.emerald }}>{best.name}</strong> at {fmtPct(best.winRate, 0)}.
        </InspectorNote>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorSection title="Win rate by session" accent={accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
          {[...SESSIONS].sort((a, b) => b.winRate - a.winRate).map((s) => {
            const c = s.winRate >= 60 ? VT.emerald : s.winRate >= 50 ? VT.amber : VT.rose
            const rgbC = s.winRate >= 60 ? VT.emeraldRgb : s.winRate >= 50 ? VT.amberRgb : VT.roseRgb
            return (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span className="font-sans" style={{ fontSize: 12, color: VT.paper }}>{s.name}</span>
                  <span className="font-mono tabular-nums" style={{ fontSize: 12, color: c }}>{fmtPct(s.winRate, 0)}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: rgba("255,255,255", 0.06), overflow: "hidden" }}>
                  <div style={{ width: `${s.winRate}%`, height: "100%", borderRadius: 4, background: c, boxShadow: `0 0 8px ${rgba(rgbC, 0.5)}` }} />
                </div>
              </div>
            )
          })}
        </div>
      </InspectorSection>
      <InspectorGrid cols={2}>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Best session" value={best.name} color={VT.emerald} valueSize={18} sub={fmtPct(best.winRate, 0)} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Killzone" value={best.killzone} valueSize={16} sub="prime entry window" />
        </InspectorSection>
      </InspectorGrid>
    </div>
  )
}

registerInspector("session-clockwork", {
  eyebrow: "TIMING · SESSIONS",
  title: "Session Clockwork",
  subtitle: "Your 24-hour edge map — which killzones to trade and which to sit out.",
  Body: SessionClockworkBody,
})
