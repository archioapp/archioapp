"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  SECTIONS C  ·  05 WHAT'S LIVE (built) · 06 THE GAP (partial)
 * ──────────────────────────────────────────────────────────────────────── */

import { DNA, MONO_CAP_TIGHT, accentFor } from "./pitch-dna"
import { LIVE, GAP } from "./pitch-data"
import { SectionFrame, InsightStrip } from "./pitch-chrome"

/* ── 05 · WHAT'S LIVE ───────────────────────────────────────────────── */

export function LiveSection() {
  return (
    <SectionFrame id="live" index="05" kicker={LIVE.kicker} headline={LIVE.headline} body={LIVE.body}>
      <div className="flex flex-col gap-7">
        {/* live banner */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRuleStrong}`, borderRadius: DNA.rMd, padding: "14px 18px" }}
        >
          <span aria-hidden className="archio-breathe" style={{ width: 8, height: 8, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 12px ${DNA.teal}` }} />
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.teal }}>SYSTEMS ONLINE</span>
          <span className="font-mono tabular-nums" style={{ fontSize: 18, color: DNA.paper }}>
            {LIVE.liveCount}
          </span>
          <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>NOT VAPORWARE · RUNNING TODAY</span>
        </div>

        {/* groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LIVE.groups.map((g) => (
            <div
              key={g.group}
              className="flex flex-col gap-3"
              style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rLg, padding: 18 }}
            >
              <div className="flex items-center gap-3">
                <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.teal }}>{g.group}</span>
                <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
              </div>
              <div className="flex flex-col gap-3">
                {g.systems.map((s) => (
                  <div key={s.name} className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 shrink-0" style={{ width: 6, height: 6, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 6px ${DNA.teal}` }} />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans" style={{ fontSize: 13.5, color: DNA.paper }}>
                        {s.name}
                      </span>
                      <span className="font-sans" style={{ fontSize: 12, color: DNA.ash, lineHeight: 1.5 }}>
                        {s.what}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <InsightStrip label="STATE OF PLAY">
          The expensive, hard-to-copy work is already done and interactive. What remains is wiring real data behind
          surfaces that already feel right — the cheapest place a startup can be ahead.
        </InsightStrip>
      </div>
    </SectionFrame>
  )
}

/* ── 06 · THE GAP ───────────────────────────────────────────────────── */

export function GapSection() {
  return (
    <SectionFrame id="gap" index="06" kicker={GAP.kicker} headline={GAP.headline} body={GAP.body}>
      <div className="flex flex-col gap-7">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GAP.columns.map((c) => {
            const a = accentFor(c.sev)
            return (
              <div
                key={c.title}
                className="flex flex-col gap-3"
                style={{ background: DNA.glassStrong, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rLg, padding: 18 }}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: a.ink, boxShadow: `0 0 8px ${a.ink}` }} />
                  <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: a.ink }}>{c.title}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {c.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                      style={{ borderBottom: `1px solid ${DNA.tealRule}`, paddingBottom: 8 }}
                    >
                      <span aria-hidden style={{ color: a.ink, fontSize: 11 }}>
                        ›
                      </span>
                      <span className="font-sans" style={{ fontSize: 13, color: DNA.paperDim }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* DB tables needed */}
        <div className="flex flex-col gap-3">
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>DATABASE TABLES TO SHIP · {GAP.tables.length}</span>
          <div className="flex items-center gap-2 flex-wrap">
            {GAP.tables.map((t) => (
              <span
                key={t}
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: DNA.paperDim,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1px solid ${DNA.tealRule}`,
                  background: DNA.glassDeep,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
