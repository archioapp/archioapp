"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  SECTIONS A  ·  01 THE FRACTURE (problem) · 02 THE FIELD (market)
 * ──────────────────────────────────────────────────────────────────────── */

import { useState } from "react"
import { DNA, MONO_CAP_TIGHT, accentFor } from "./pitch-dna"
import { FRACTURE, FIELD } from "./pitch-data"
import { SectionFrame, InsightStrip } from "./pitch-chrome"
import {
  StatReadout,
  MeterBar,
  ConcentricArcs,
  FractureDiagram,
  ScenarioTriad,
} from "./pitch-instruments"
import { PitchChip } from "./pitch-scaffold"

/* ── 01 · THE FRACTURE ──────────────────────────────────────────────── */

export function FractureSection() {
  const [active, setActive] = useState(FRACTURE.nodes[0].id)
  const node = FRACTURE.nodes.find((n) => n.id === active) ?? FRACTURE.nodes[0]
  const a = accentFor(node.sev)

  return (
    <SectionFrame
      id="fracture"
      index="01"
      kicker={FRACTURE.kicker}
      headline={FRACTURE.headline}
      body={FRACTURE.body}
    >
      <div className="flex flex-col gap-7">
        <FractureDiagram nodes={FRACTURE.nodes} activeId={active} onSelect={setActive} />

        {/* selected node detail */}
        <div
          style={{
            background: DNA.glassStrong,
            border: `1px solid ${a.edge}`,
            borderRadius: DNA.rMd,
            padding: 18,
            boxShadow: `0 0 30px -18px ${a.halo}`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: a.ink, boxShadow: `0 0 8px ${a.ink}` }} />
            <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: a.ink }}>{node.name}</span>
            <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>· {node.tools} TOOLS · DEAD END</span>
          </div>
          <p className="font-sans" style={{ fontSize: 13.5, color: DNA.paperDim, lineHeight: 1.6 }}>
            {node.detail}
          </p>
        </div>

        {/* damage readouts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {FRACTURE.stats.map((s) => (
            <StatReadout key={s.label} value={s.value} unit={s.unit} label={s.label} sev={s.sev} />
          ))}
        </div>

        <InsightStrip label="THE SEAM">
          Each system is a dead end. Data, intent, and context cannot cross the gaps between them — and the gap is exactly
          where every trader is losing <span style={{ color: DNA.riskInk }}>45–60 minutes a day</span>.
        </InsightStrip>
      </div>
    </SectionFrame>
  )
}

/* ── 02 · THE FIELD ─────────────────────────────────────────────────── */

export function FieldSection() {
  return (
    <SectionFrame id="field" index="02" kicker={FIELD.kicker} headline={FIELD.headline} body={FIELD.body}>
      <div className="flex flex-col gap-7">
        {/* macro stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FIELD.macro.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-2"
              style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rMd, padding: "18px 20px" }}
            >
              <span className="font-mono tabular-nums" style={{ fontSize: 30, color: DNA.teal, letterSpacing: "-0.02em", textShadow: `0 0 14px ${DNA.tealHalo}` }}>
                {m.value}
              </span>
              <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* funnel arcs + meters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <ConcentricArcs rings={FIELD.funnel} />
          </div>
          <div className="flex flex-col gap-5">
            {FIELD.funnel.map((f, i) => (
              <div key={f.tier} className="flex flex-col gap-2">
                <MeterBar label={`${f.tier} — ${f.desc}`} value={f.value} pct={f.pct} delay={i * 0.12} />
              </div>
            ))}
          </div>
        </div>

        {/* tailwinds */}
        <div className="flex flex-col gap-3">
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>TAILWINDS</span>
          <div className="flex items-center gap-2 flex-wrap">
            {FIELD.tailwinds.map((t, i) => (
              <PitchChip key={t} hot={i === 0}>
                {t}
              </PitchChip>
            ))}
          </div>
        </div>

        {/* scenarios */}
        <div className="flex flex-col gap-3">
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>3-YEAR SCENARIOS</span>
          <ScenarioTriad scenarios={FIELD.scenarios} />
        </div>

        <InsightStrip label="INVESTMENT THESIS">{FIELD.thesis}</InsightStrip>
      </div>
    </SectionFrame>
  )
}
