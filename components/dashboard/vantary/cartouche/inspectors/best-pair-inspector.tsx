"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · BEST PAIR — instrument leaderboard
   ───────────────────────────────────────────────────────────────────────────
   Win rate and net-R per instrument, directional bias, and where your edge
   concentrates vs. where it leaks.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { Stat } from "../instruments"
import { PAIR_LEADERBOARD, fmtPct } from "./inspector-data"

const BIAS_TONE: Record<string, { hex: string; label: string }> = {
  long: { hex: VT.emerald, label: "LONG BIAS" },
  short: { hex: VT.rose, label: "SHORT BIAS" },
  balanced: { hex: VT.ashSoft, label: "BALANCED" },
}

function BestPairBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([{ id: "leaderboard", label: "Leaderboard" }])
  }, [registerTabs])

  const best = PAIR_LEADERBOARD[0]!
  const worst = PAIR_LEADERBOARD[PAIR_LEADERBOARD.length - 1]!
  const maxNetR = Math.max(...PAIR_LEADERBOARD.map((p) => Math.abs(p.netR)))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorGrid cols={3}>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Top instrument" value={best.pair} color={accent.hex} valueSize={18} sub={`${fmtPct(best.winRate, 0)} · +${best.netR.toFixed(1)}R`} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Instruments traded" value={PAIR_LEADERBOARD.length} valueSize={18} />
        </InspectorSection>
        <InspectorSection accent={accent} pad={14}>
          <Stat label="Weakest" value={worst.pair} color={VT.rose} valueSize={18} sub={`${fmtPct(worst.winRate, 0)} · ${worst.netR.toFixed(1)}R`} />
        </InspectorSection>
      </InspectorGrid>
      <InspectorSection title="Instrument leaderboard" accent={accent}
        action={<span className="font-mono" style={{ fontSize: 10, color: VT.ashSoft }}>by net R</span>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PAIR_LEADERBOARD.map((p) => {
            const pos = p.netR >= 0
            const c = pos ? VT.emerald : VT.rose
            const rgbC = pos ? VT.emeraldRgb : VT.roseRgb
            const bias = BIAS_TONE[p.bias]!
            return (
              <div key={p.pair} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: rgba("255,255,255", 0.025), border: `1px solid ${VT.rule}` }}>
                <span className="font-mono" style={{ fontSize: 13, color: VT.paper, width: 76, flexShrink: 0 }}>{p.pair}</span>
                <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: bias.hex, width: 78, flexShrink: 0 }}>{bias.label}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: rgba("255,255,255", 0.05), overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${(Math.abs(p.netR) / maxNetR) * 100}%`, height: "100%", borderRadius: 4, background: c, boxShadow: `0 0 8px ${rgba(rgbC, 0.5)}` }} />
                </div>
                <span className="font-mono tabular-nums" style={{ fontSize: 11, color: VT.ashSoft, width: 56, textAlign: "right" }}>{fmtPct(p.winRate, 0)}</span>
                <span className="font-mono tabular-nums" style={{ fontSize: 12, color: c, width: 56, textAlign: "right" }}>{pos ? "+" : ""}{p.netR.toFixed(1)}R</span>
              </div>
            )
          })}
        </div>
      </InspectorSection>
      <InspectorNote accent={accent}>
        <strong style={{ color: accent.hex }}>{best.pair}</strong> is your edge engine — {fmtPct(best.winRate, 0)} win
        rate and +{best.netR.toFixed(1)}R net across {best.trades} trades. {worst.pair} is bleeding
        ({worst.netR.toFixed(1)}R); consider sizing down or pausing it until the read sharpens.
      </InspectorNote>
    </div>
  )
}

registerInspector("best-pair", {
  eyebrow: "PERFORMANCE · INSTRUMENTS",
  title: "Best Pair",
  subtitle: "Where your edge concentrates — win rate and net R ranked across every instrument.",
  Body: BestPairBody,
})
