"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · PRIMITIVES (P2 — first 5 of 18)
   ───────────────────────────────────────────────────────────────────────────
   The composable answer atoms. Domain templates (registry.tsx) STACK these;
   the AI only fills their data — it never generates UI.

     · StatusPrimitive   — regime verdict strip (tone-tinted)
     · MetricGrid        — 3-6 grounded scalars
     · TrendPrimitive    — REAL closes sparkline (never model-echoed)
     · TimelinePrimitive — session events/catalysts
     · ActionPlan        — ordered "what to do about it" steps

   Design language: chamber-native. No boxes-in-boxes — hairlines, mono
   eyebrows, one accent. Every primitive renders nothing (not a broken
   shell) when its data is absent — the composition decides empty states.
   ═══════════════════════════════════════════════════════════════════════════ */

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import type { ArchioEnvelope, MarketGrounding } from "@/lib/response-engine/contract"
import type { JournalGrounding } from "@/lib/response-engine/journal"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  textTransform: "uppercase",
}

type TemplateData = NonNullable<ArchioEnvelope["data"]>

/* Tone → color. Bearish/down uses the deck's red; everything else stays
   in the single accent family (color discipline). */
const RED = "239,68,68"
function toneRgb(accentRgb: string, tone: string): string {
  return tone === "bearish" || tone === "down" ? RED : accentRgb
}

/* ── Eyebrow — shared section label ─────────────────────────────────────── */
function Eyebrow({ rgb, children }: { rgb: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden style={{ width: 12, height: 1, background: vgRgba(rgb, 0.5) }} />
      <span style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.32em", color: vgRgba(rgb, 0.75) }}>{children}</span>
    </div>
  )
}

/* ── 1 · STATUS — regime verdict strip ──────────────────────────────────── */
export function StatusPrimitive({ accent, regime }: { accent: ThemeAccent; regime: TemplateData["regime"] }) {
  const rgb = toneRgb(accent.rgb, regime.tone)
  return (
    <div className="flex items-center gap-4 w-full" role="status">
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: vgRgba(rgb, 0.95),
          boxShadow: `0 0 10px ${vgRgba(rgb, 0.55)}`,
          flexShrink: 0,
        }}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-sans" style={{ fontSize: 14.5, fontWeight: 550, color: VG_VT.paper, letterSpacing: "-0.01em" }}>
            {regime.label}
          </span>
          <span style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.3em", color: vgRgba(rgb, 0.85) }}>{regime.tone}</span>
        </div>
        <span className="font-sans text-pretty" style={{ fontSize: 11.5, color: VG_VT.paperDim }}>
          {regime.note}
        </span>
      </div>
    </div>
  )
}

/* ── 2 · METRIC GRID — grounded scalars ─────────────────────────────────── */
export function MetricGrid({ accent, metrics }: { accent: ThemeAccent; metrics: TemplateData["metrics"] }) {
  if (!metrics.length) return null
  return (
    <div className="grid gap-x-6 gap-y-4 w-full" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
      {metrics.map((m) => {
        const rgb = m.tone ? toneRgb(accent.rgb, m.tone) : accent.rgb
        return (
          <div key={m.label} className="flex flex-col gap-1 min-w-0">
            <span style={{ ...MONO, fontSize: 8, letterSpacing: "0.26em", color: VG_VT.paperDim }}>{m.label}</span>
            <span
              className="font-sans tabular-nums"
              style={{
                fontSize: 16,
                fontWeight: 550,
                letterSpacing: "-0.01em",
                color: m.tone && m.tone !== "flat" ? vgRgba(rgb, 0.95) : VG_VT.paper,
              }}
            >
              {m.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── 3 · TREND — sparkline from REAL closes (grounding, not model) ──────── */
export function TrendPrimitive({ accent, market }: { accent: ThemeAccent; market: MarketGrounding }) {
  const reduced = useReducedMotion() ?? false
  const closes = market.closes
  if (closes.length < 8) return null

  const W = 560
  const H = 64
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const span = max - min || 1
  const pts = closes.map((c, i) => {
    const x = (i / (closes.length - 1)) * W
    const y = H - 6 - ((c - min) / span) * (H - 12)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const up = closes[closes.length - 1] >= closes[0]
  const rgb = up ? accent.rgb : RED
  const lastY = Number(pts[pts.length - 1].split(",")[1])

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-baseline justify-between">
        <Eyebrow rgb={accent.rgb}>{market.pair} · 48H · Live polygon</Eyebrow>
        <span className="tabular-nums" style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.2em", color: VG_VT.paperDim }}>
          {min.toFixed(4)} — {max.toFixed(4)}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} role="img" aria-label={`${market.pair} 48-hour price trend, ${up ? "up" : "down"}`}>
        <line x1="0" y1={H - 6} x2={W} y2={H - 6} stroke={vgRgba(accent.rgb, 0.12)} strokeWidth="1" />
        <motion.polyline
          points={pts.join(" ")}
          fill="none"
          stroke={vgRgba(rgb, 0.85)}
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={reduced ? {} : { pathLength: 0 }}
          animate={reduced ? {} : { pathLength: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <circle cx={W} cy={lastY} r="3" fill={vgRgba(rgb, 0.95)}>
          {!reduced && <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />}
        </circle>
      </svg>
    </div>
  )
}

/* ── 4 · TIMELINE — session catalysts ───────────────────────────────────── */
export function TimelinePrimitive({ accent, events }: { accent: ThemeAccent; events: TemplateData["events"] }) {
  if (!events.length) return null
  const rgb = accent.rgb
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <Eyebrow rgb={rgb}>Session catalysts</Eyebrow>
      <div className="flex flex-col gap-2">
        {events.map((ev) => (
          <div key={`${ev.time}-${ev.label}`} className="flex items-center gap-3">
            <span className="tabular-nums" style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.14em", color: vgRgba(rgb, 0.85), width: 44, flexShrink: 0 }}>
              {ev.time}
            </span>
            <span
              aria-hidden
              style={{
                width: 4,
                height: 4,
                borderRadius: 999,
                background: ev.weight === "high" ? vgRgba(RED, 0.9) : vgRgba(rgb, ev.weight === "med" ? 0.7 : 0.35),
                flexShrink: 0,
              }}
            />
            <span className="font-sans text-pretty" style={{ fontSize: 12, color: VG_VT.paper, opacity: 0.88 }}>
              {ev.label}
            </span>
            <span style={{ ...MONO, fontSize: 7.5, letterSpacing: "0.24em", color: VG_VT.paperDim, marginLeft: "auto" }}>{ev.weight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 6 · TRADE TAPE — the day's REAL journal rows (grounding, not model) ──
   The trades come from JournalGrounding (shipped raw via X-Archio-Journal);
   the model contributes ONLY the one-line `take` per trade, joined by
   tradeId. A model hallucinating a trade is architecturally impossible
   here — it can only annotate rows that exist. */
export function TradeTape({
  accent,
  journal,
  takes,
}: {
  accent: ThemeAccent
  journal: JournalGrounding
  takes: { tradeId: string; take: string }[]
}) {
  const rgb = accent.rgb
  const takeFor = (id: string) => takes.find((t) => t.tradeId === id)?.take ?? null
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-baseline justify-between">
        <Eyebrow rgb={rgb}>The tape · {journal.stats.date}</Eyebrow>
        <span style={{ ...MONO, fontSize: 7.5, letterSpacing: "0.26em", color: VG_VT.paperDim }}>
          {journal.source === "demo-journal" ? "Demo journal" : "Your journal"}
        </span>
      </div>
      <div className="flex flex-col">
        {journal.trades.map((t) => {
          const win = t.resultR > 0
          const rRgb = win ? rgb : RED
          const take = takeFor(t.id)
          const dirty = t.ruleBreaks.length > 0
          return (
            <div
              key={t.id}
              className="flex flex-col gap-1 py-2.5"
              style={{ borderBottom: `1px solid ${vgRgba(rgb, 0.08)}` }}
            >
              <div className="flex items-center gap-3">
                <span className="tabular-nums" style={{ ...MONO, fontSize: 9, letterSpacing: "0.12em", color: VG_VT.paperDim, width: 40, flexShrink: 0 }}>
                  {t.time}
                </span>
                <span style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.14em", color: VG_VT.paper, width: 62, flexShrink: 0 }}>
                  {t.pair}
                </span>
                <span
                  aria-label={t.direction}
                  style={{ ...MONO, fontSize: 8, letterSpacing: "0.2em", color: vgRgba(rgb, 0.6), width: 38, flexShrink: 0 }}
                >
                  {t.direction === "long" ? "LONG" : "SHORT"}
                </span>
                <span className="font-sans truncate" style={{ fontSize: 11.5, color: VG_VT.paperDim, minWidth: 0, flex: 1 }}>
                  {t.setup}
                </span>
                {dirty && (
                  <span
                    title={t.ruleBreaks.join(" · ")}
                    style={{ ...MONO, fontSize: 7, letterSpacing: "0.22em", color: vgRgba(RED, 0.8), flexShrink: 0 }}
                  >
                    {t.ruleBreaks.length} rule{t.ruleBreaks.length > 1 ? "s" : ""}
                  </span>
                )}
                <span
                  className="tabular-nums"
                  style={{
                    ...MONO,
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: vgRgba(rRgb, 0.95),
                    width: 52,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {win ? "+" : ""}
                  {t.resultR.toFixed(1)}R
                </span>
              </div>
              {take && (
                <div className="flex items-start gap-2" style={{ paddingLeft: 52 }}>
                  <span aria-hidden style={{ width: 10, height: 1, background: vgRgba(rRgb, 0.45), marginTop: 7, flexShrink: 0 }} />
                  <span className="font-sans italic text-pretty" style={{ fontSize: 11, color: VG_VT.paperDim, lineHeight: 1.5 }}>
                    {take}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── 7 · SESSION RHYTHM — R by hour, the discipline-drift x-ray ─────────── */
export function SessionRhythm({ accent, journal }: { accent: ThemeAccent; journal: JournalGrounding }) {
  const reduced = useReducedMotion() ?? false
  const rgb = accent.rgb
  const trades = journal.trades
  if (trades.length < 2) return null

  const maxAbs = Math.max(...trades.map((t) => Math.abs(t.resultR)), 1)
  const BAR_MAX = 34

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-baseline justify-between">
        <Eyebrow rgb={rgb}>Session rhythm</Eyebrow>
        <span className="tabular-nums" style={{ ...MONO, fontSize: 8, letterSpacing: "0.2em", color: VG_VT.paperDim }}>
          AM {journal.stats.amR >= 0 ? "+" : ""}
          {journal.stats.amR}R · PM {journal.stats.pmR >= 0 ? "+" : ""}
          {journal.stats.pmR}R
        </span>
      </div>
      {/* zero-axis bar rhythm — wins rise, losses fall */}
      <div className="flex items-center gap-4" style={{ height: BAR_MAX * 2 + 18 }}>
        {trades.map((t, i) => {
          const win = t.resultR > 0
          const h = Math.max(4, (Math.abs(t.resultR) / maxAbs) * BAR_MAX)
          const barRgb = win ? rgb : RED
          return (
            <div key={t.id} className="flex flex-col items-center gap-1" style={{ width: 44 }}>
              <div className="flex flex-col justify-end" style={{ height: BAR_MAX }}>
                {win && (
                  <motion.div
                    initial={reduced ? {} : { height: 0 }}
                    animate={{ height: h }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
                    style={{ width: 16, background: vgRgba(barRgb, 0.75), borderRadius: "2px 2px 0 0" }}
                  />
                )}
              </div>
              <div aria-hidden style={{ width: 28, height: 1, background: vgRgba(rgb, 0.25) }} />
              <div className="flex flex-col justify-start" style={{ height: BAR_MAX }}>
                {!win && (
                  <motion.div
                    initial={reduced ? {} : { height: 0 }}
                    animate={{ height: h }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
                    style={{ width: 16, background: vgRgba(barRgb, 0.75), borderRadius: "0 0 2px 2px" }}
                  />
                )}
              </div>
              <span className="tabular-nums" style={{ ...MONO, fontSize: 7.5, letterSpacing: "0.1em", color: VG_VT.paperDim }}>
                {t.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── 8 · LESSON — the one sentence to carry into tomorrow ───────────────── */
export function LessonCard({ accent, lesson }: { accent: ThemeAccent; lesson: string }) {
  const rgb = accent.rgb
  return (
    <div className="flex flex-col gap-2 w-full">
      <Eyebrow rgb={rgb}>The lesson</Eyebrow>
      <div className="flex items-stretch gap-3.5">
        <span aria-hidden style={{ width: 2, borderRadius: 2, background: vgRgba(rgb, 0.55), flexShrink: 0 }} />
        <p className="font-sans text-pretty m-0" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.55, color: VG_VT.paper, letterSpacing: "-0.005em" }}>
          {lesson}
        </p>
      </div>
    </div>
  )
}

/* ── 5 · ACTION PLAN — what to do about it ──────────────────────────────── */
export function ActionPlan({ accent, plan }: { accent: ThemeAccent; plan: TemplateData["plan"] }) {
  if (!plan.length) return null
  const rgb = accent.rgb
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <Eyebrow rgb={rgb}>The plan</Eyebrow>
      <ol className="flex flex-col gap-2.5 m-0 p-0" style={{ listStyle: "none" }}>
        {plan.map((step, i) => (
          <li key={step.action} className="flex items-start gap-3">
            <span className="tabular-nums" style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: vgRgba(rgb, 0.7), paddingTop: 2, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-sans" style={{ fontSize: 12.5, fontWeight: 550, color: VG_VT.paper }}>
                {step.action}
              </span>
              <span className="font-sans text-pretty" style={{ fontSize: 11.5, color: VG_VT.paperDim }}>
                {step.detail}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
