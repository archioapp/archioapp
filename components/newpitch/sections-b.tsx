"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  SECTIONS B  ·  03 THE UNIFICATION (solution) · 04 THE STACK (architecture)
 * ──────────────────────────────────────────────────────────────────────── */

import { DNA, MONO_CAP_TIGHT, accentFor } from "./pitch-dna"
import { UNIFICATION, STACK } from "./pitch-data"
import { SectionFrame, InsightStrip } from "./pitch-chrome"
import { StatReadout, LayerStack } from "./pitch-instruments"

/* ── 03 · THE UNIFICATION ───────────────────────────────────────────── */

export function UnificationSection() {
  const before = accentFor(UNIFICATION.before.sev)
  const after = accentFor(UNIFICATION.after.sev)
  return (
    <SectionFrame id="unification" index="03" kicker={UNIFICATION.kicker} headline={UNIFICATION.headline} body={UNIFICATION.body}>
      <div className="flex flex-col gap-7">
        {/* before → after */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <CollapseCard tone={before} label={UNIFICATION.before.label} value={UNIFICATION.before.value} unit={UNIFICATION.before.unit} />
          <div className="flex items-center justify-center">
            <span
              aria-hidden
              className="font-mono"
              style={{
                fontSize: 22,
                color: DNA.teal,
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${DNA.tealRuleStrong}`,
                background: DNA.tealWash,
                textShadow: `0 0 12px ${DNA.tealHalo}`,
              }}
            >
              →
            </span>
          </div>
          <CollapseCard tone={after} label={UNIFICATION.after.label} value={UNIFICATION.after.value} unit={UNIFICATION.after.unit} />
        </div>

        {/* counters */}
        <div className="grid grid-cols-3 gap-3">
          {UNIFICATION.counters.map((c) => (
            <StatReadout key={c.label} value={c.value} label={c.label} />
          ))}
        </div>

        {/* six pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {UNIFICATION.pillars.map((p) => {
            const a = accentFor(p.sev)
            return (
              <div
                key={p.id}
                className="relative flex flex-col gap-2"
                style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rLg, padding: 18 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans" style={{ fontSize: 15, color: DNA.paper }}>
                    {p.name}
                  </span>
                  <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: a.ink }}>{p.ai} AI</span>
                </div>
                <p className="font-sans" style={{ fontSize: 12.5, color: DNA.ash, lineHeight: 1.5 }}>
                  {p.tagline}
                </p>
              </div>
            )
          })}
        </div>

        <InsightStrip label="THE MOAT">{UNIFICATION.moat}</InsightStrip>
      </div>
    </SectionFrame>
  )
}

function CollapseCard({
  tone,
  label,
  value,
  unit,
}: {
  tone: { ink: string; edge: string; wash: string; halo: string }
  label: string
  value: string
  unit: string
}) {
  return (
    <div
      className="flex items-center gap-4"
      style={{ background: DNA.glassStrong, border: `1px solid ${tone.edge}`, borderRadius: DNA.rLg, padding: "18px 22px", boxShadow: `0 0 28px -18px ${tone.halo}` }}
    >
      <span className="font-mono tabular-nums" style={{ fontSize: 44, color: tone.ink, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </span>
      <div className="flex flex-col gap-1">
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>{label}</span>
        <span className="font-sans" style={{ fontSize: 13, color: DNA.paperDim }}>
          {unit}
        </span>
      </div>
    </div>
  )
}

/* ── 04 · THE STACK ─────────────────────────────────────────────────── */

export function StackSection() {
  return (
    <SectionFrame id="stack" index="04" kicker={STACK.kicker} headline={STACK.headline} body={STACK.body}>
      <div className="flex flex-col gap-7">
        <LayerStack layers={STACK.layers} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STACK.totals.map((t) => (
            <StatReadout key={t.label} value={t.value} label={t.label} />
          ))}
        </div>
      </div>
    </SectionFrame>
  )
}
