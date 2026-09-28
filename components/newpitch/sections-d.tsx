"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  SECTIONS D  ·  07 THE PATH (roadmap) · 08 THE ASK
 * ──────────────────────────────────────────────────────────────────────── */

import { DNA, MONO_CAP_TIGHT, accentFor } from "./pitch-dna"
import { PATH, ASK } from "./pitch-data"
import { SectionFrame, InsightStrip } from "./pitch-chrome"
import { PitchCommandInput } from "./pitch-scaffold"

/* ── 07 · THE PATH ──────────────────────────────────────────────────── */

export function PathSection() {
  return (
    <SectionFrame id="path" index="07" kicker={PATH.kicker} headline={PATH.headline} body={PATH.body}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PATH.workstreams.map((w) => {
          const a = accentFor(w.sev)
          return (
            <div
              key={w.id}
              className="flex flex-col gap-4"
              style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rLg, padding: 18 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans" style={{ fontSize: 15, color: DNA.paper }}>
                  {w.name}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{ fontSize: 12, color: a.ink, padding: "4px 10px", borderRadius: 999, border: `1px solid ${a.edge}`, background: a.wash }}
                >
                  {w.budget}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {w.lanes.map((lane) => (
                  <div key={lane.name} className="flex flex-col gap-2">
                    <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: a.ink }}>{lane.name}</span>
                    <div className="flex flex-col gap-1.5">
                      {lane.deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2">
                          <span aria-hidden style={{ width: 4, height: 4, borderRadius: 999, background: DNA.ash }} />
                          <span className="font-sans" style={{ fontSize: 12.5, color: DNA.paperDim }}>
                            {d}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionFrame>
  )
}

/* ── 08 · THE ASK ───────────────────────────────────────────────────── */

export function AskSection() {
  return (
    <SectionFrame id="ask" index="08" kicker={ASK.kicker} headline={ASK.headline} body={ASK.body}>
      <div className="flex flex-col gap-7">
        {/* amount */}
        <div
          className="relative flex flex-col items-center gap-2 text-center"
          style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRuleStrong}`, borderRadius: DNA.rLg, padding: "32px 24px", boxShadow: `0 0 50px -28px ${DNA.tealHalo}` }}
        >
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>{ASK.amountSub}</span>
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 56, color: DNA.teal, letterSpacing: "-0.03em", lineHeight: 1, textShadow: `0 0 24px ${DNA.tealHalo}` }}
          >
            {ASK.amount}
          </span>
        </div>

        {/* phases timeline */}
        <div className="flex flex-col gap-3">
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>5 PHASES · 12 MILESTONES · ~120 DAYS</span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {ASK.phases.map((p, i) => {
              const a = accentFor(p.sev)
              return (
                <div
                  key={p.index}
                  className="flex flex-col gap-3"
                  style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rMd, padding: 16 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ fontSize: 11, color: a.ink }}>
                      {p.index}
                    </span>
                    <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: a.ink, boxShadow: `0 0 6px ${a.ink}` }} />
                  </div>
                  <span className="font-sans" style={{ fontSize: 13.5, color: DNA.paper, lineHeight: 1.2 }}>
                    {p.name}
                  </span>
                  <span style={{ ...MONO_CAP_TIGHT, fontSize: 8, color: DNA.ashSoft }}>{p.window}</span>
                  <div className="flex flex-col gap-1.5">
                    {p.milestones.map((m) => (
                      <span key={m} className="font-sans" style={{ fontSize: 11.5, color: DNA.ash, lineHeight: 1.4 }}>
                        · {m}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* two worlds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASK.worlds.map((w, i) => (
            <div
              key={w.name}
              className="flex flex-col gap-2"
              style={{
                background: i === 0 ? DNA.glassStrong : DNA.glassDeep,
                border: `1px solid ${i === 0 ? DNA.tealRuleStrong : DNA.tealRule}`,
                borderRadius: DNA.rLg,
                padding: 20,
              }}
            >
              <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: i === 0 ? DNA.teal : DNA.ashSoft }}>{w.name}</span>
              <p className="font-sans" style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.55 }}>
                {w.desc}
              </p>
            </div>
          ))}
        </div>

        <InsightStrip label="WHY NOW">{ASK.whyNow}</InsightStrip>

        {/* CTA command bar */}
        <PitchCommandInput placeholder={ASK.cta} />
      </div>
    </SectionFrame>
  )
}
