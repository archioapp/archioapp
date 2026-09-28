"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · GENERATED MODULES — native Flight Deck surfaces built by Archio
   ───────────────────────────────────────────────────────────────────────────
   Every module renders inside the shared <ModuleFrame/>: dark glass, top
   accent seam, mono eyebrow + title, "Generated" tag, whisper action footer.
   These are DECK-native — never white SaaS cards. All data comes from the
   deterministic fixtures in archio-intelligence.ts so builds are stable.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { motion } from "framer-motion"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import {
  type ArchioModuleId, MODULE_META,
  MORNING_STACK, DECISION_FEED, FORECAST, RISK_PULSE, JOURNAL_REVIEW,
} from "./archio-intelligence"

/* ── shared micro-primitives ─────────────────────────────────────────── */
const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  textTransform: "uppercase",
}

function Whisper({ rgb, children, onClick }: {
  rgb: string; children: React.ReactNode; onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent border-0 cursor-pointer p-0"
      style={{ ...MONO, fontSize: 9, letterSpacing: "0.24em", color: vgRgba(rgb, 0.55) }}
      onMouseEnter={(e) => { e.currentTarget.style.color = vgRgba(rgb, 0.95) }}
      onMouseLeave={(e) => { e.currentTarget.style.color = vgRgba(rgb, 0.55) }}
    >
      {children}
    </button>
  )
}

/* ── ModuleFrame — the shared generated-surface contract ─────────────── */
export function ModuleFrame({ accent, moduleId, children }: {
  accent: ThemeAccent
  moduleId: ArchioModuleId
  children: React.ReactNode
}) {
  const rgb  = accent.rgb
  const meta = MODULE_META[moduleId]
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`Generated module: ${meta.title}`}
      className="w-full text-left"
      style={{
        position: "relative",
        borderRadius: 14,
        border: `1px solid ${vgRgba(rgb, 0.18)}`,
        background: "rgba(8,12,16,0.55)",
        overflow: "hidden",
      }}
    >
      {/* top accent seam */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
        background: `linear-gradient(90deg, transparent, ${vgRgba(rgb, 0.55)}, transparent)`,
      }} />
      <header className="flex items-baseline justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <div style={{ ...MONO, fontSize: 9, letterSpacing: "0.3em", color: vgRgba(rgb, 0.8) }}>
            {meta.eyebrow}
          </div>
          <div className="font-sans mt-1" style={{ fontSize: 15, fontWeight: 500, color: VG_VT.paper }}>
            {meta.title}
          </div>
        </div>
        <span style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.26em", color: vgRgba(rgb, 0.5),
          border: `1px solid ${vgRgba(rgb, 0.22)}`, borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>
          Generated
        </span>
      </header>

      <div className="px-5 py-4">{children}</div>

      <footer className="flex items-center gap-5 px-5 pb-4">
        <Whisper rgb={rgb}>Open in workspace</Whisper>
        <Whisper rgb={rgb}>Save to journal</Whisper>
        <Whisper rgb={rgb}>Pin to deck</Whisper>
      </footer>
    </motion.section>
  )
}

/* ── row helper ──────────────────────────────────────────────────────── */
function Row({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2"
      style={{ borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
      {children}
    </div>
  )
}

/* ── per-module bodies ───────────────────────────────────────────────── */
function MorningStackBody({ rgb }: { rgb: string }) {
  return (
    <div className="flex flex-col gap-1">
      {MORNING_STACK.bias.map((b) => (
        <Row key={b.pair}>
          <span className="font-sans" style={{ fontSize: 13, color: VG_VT.paper }}>{b.pair}</span>
          <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.2em",
            color: b.dir === "long" ? vgRgba(rgb, 0.9) : "rgba(240,120,120,0.9)" }}>
            {b.dir}
          </span>
          <span className="font-sans italic text-right" style={{ fontSize: 12, color: VG_VT.paperDim, flex: 1 }}>
            {b.note}
          </span>
        </Row>
      ))}
      <Row>
        <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.22em", color: vgRgba(rgb, 0.7) }}>Risk</span>
        <span className="font-sans" style={{ fontSize: 12.5, color: VG_VT.paper }}>
          {MORNING_STACK.risk.usedPct}% used · {MORNING_STACK.risk.budgetPct}% budget · {MORNING_STACK.risk.tradesLeft} trades left
        </span>
      </Row>
      {MORNING_STACK.events.map((e, i) => (
        <Row key={e.time} last={i === MORNING_STACK.events.length - 1}>
          <span style={{ ...MONO, fontSize: 10, letterSpacing: "0.14em", color: vgRgba(rgb, 0.85) }}>{e.time}</span>
          <span className="font-sans" style={{ fontSize: 12.5, color: VG_VT.paper, flex: 1 }}>{e.label}</span>
          <span style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.2em",
            color: e.weight === "high" ? "rgba(240,170,110,0.95)" : VG_VT.paperDim }}>
            {e.weight}
          </span>
        </Row>
      ))}
    </div>
  )
}

function DecisionFeedBody({ rgb }: { rgb: string }) {
  return (
    <div className="flex flex-col gap-1">
      {DECISION_FEED.map((d, i) => (
        <Row key={d.pair + d.setup} last={i === DECISION_FEED.length - 1}>
          <div className="min-w-0">
            <div className="font-sans" style={{ fontSize: 13, color: VG_VT.paper }}>{d.pair} · {d.setup}</div>
            <div style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.18em", color: VG_VT.paperDim }}>{d.window}</div>
          </div>
          <div className="text-right">
            <div style={{ ...MONO, fontSize: 11, color: vgRgba(rgb, 0.95) }}>{d.fit}% fit</div>
            <div style={{ ...MONO, fontSize: 9, color: VG_VT.paperDim }}>{d.r}</div>
          </div>
        </Row>
      ))}
    </div>
  )
}

function ForecastBody({ rgb }: { rgb: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div style={{ ...MONO, fontSize: 9, letterSpacing: "0.22em", color: VG_VT.paperDim }}>
        {FORECAST.pair} · {FORECAST.horizon}
      </div>
      {FORECAST.scenarios.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <span style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.2em", color: vgRgba(rgb, 0.85), width: 38 }}>
            {s.label}
          </span>
          <div className="flex-1" style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.prob}%` }}
              transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: "100%", borderRadius: 2, background: vgRgba(rgb, 0.7) }}
            />
          </div>
          <span style={{ ...MONO, fontSize: 10, color: VG_VT.paper, width: 34, textAlign: "right" }}>{s.prob}%</span>
          <span className="font-sans italic hidden md:block" style={{ fontSize: 11.5, color: VG_VT.paperDim, width: 190 }}>
            {s.path}
          </span>
        </div>
      ))}
    </div>
  )
}

function RiskPulseBody({ rgb }: { rgb: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Row>
        <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.22em", color: vgRgba(rgb, 0.7) }}>Open risk</span>
        <span className="font-sans" style={{ fontSize: 13, color: VG_VT.paper }}>
          {RISK_PULSE.openRiskR}R of {RISK_PULSE.dayBudgetR}R · {RISK_PULSE.phase}
        </span>
      </Row>
      {RISK_PULSE.flags.map((f, i) => (
        <Row key={f} last={i === RISK_PULSE.flags.length - 1}>
          <span aria-hidden style={{ width: 4, height: 4, borderRadius: 999, background: vgRgba(rgb, 0.8) }} />
          <span className="font-sans" style={{ fontSize: 12.5, color: VG_VT.paperDim, flex: 1 }}>{f}</span>
        </Row>
      ))}
    </div>
  )
}

function JournalReviewBody({ rgb }: { rgb: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-sans" style={{ fontSize: 14, color: VG_VT.paper }}>
        {JOURNAL_REVIEW.pattern}
      </div>
      <div style={{ ...MONO, fontSize: 9.5, letterSpacing: "0.18em", color: "rgba(240,120,120,0.9)" }}>
        {JOURNAL_REVIEW.occurrences} occurrences · {JOURNAL_REVIEW.costR}R
      </div>
      <p className="font-sans m-0 leading-relaxed" style={{ fontSize: 12.5, color: VG_VT.paperDim }}>
        {JOURNAL_REVIEW.fix}
      </p>
    </div>
  )
}

function DashboardDraftBody({ rgb }: { rgb: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans m-0 leading-relaxed" style={{ fontSize: 12.5, color: VG_VT.paperDim }}>
        Drafted a native module skeleton from your command. Tell me which surfaces
        to bind — bias, risk, events, setups — and I&apos;ll assemble the full module.
      </p>
      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {["BIAS", "RISK", "EVENTS"].map((s) => (
          <div key={s} className="flex items-center justify-center"
            style={{ height: 44, borderRadius: 10, border: `1px dashed ${vgRgba(rgb, 0.3)}` }}>
            <span style={{ ...MONO, fontSize: 8.5, letterSpacing: "0.26em", color: vgRgba(rgb, 0.6) }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── public dispatcher ───────────────────────────────────────────────── */
export function ArchioGeneratedModule({ accent, moduleId }: {
  accent: ThemeAccent
  moduleId: ArchioModuleId
}) {
  const rgb = accent.rgb
  const body =
    moduleId === "morning-stack"  ? <MorningStackBody  rgb={rgb} /> :
    moduleId === "decision-feed"  ? <DecisionFeedBody  rgb={rgb} /> :
    moduleId === "forecast"       ? <ForecastBody      rgb={rgb} /> :
    moduleId === "risk-pulse"     ? <RiskPulseBody     rgb={rgb} /> :
    moduleId === "journal-review" ? <JournalReviewBody rgb={rgb} /> :
    <DashboardDraftBody rgb={rgb} />

  return <ModuleFrame accent={accent} moduleId={moduleId}>{body}</ModuleFrame>
}
