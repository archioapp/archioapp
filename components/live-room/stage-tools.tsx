"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, Target, GitCompare, Waves, X, ArrowRight, Check, type LucideIcon } from "lucide-react"
import { LR, lrMix, toneColor } from "./live-room-tokens"
import { LrPane, LrRecess, LrEyebrow, LrChip, LrFactRow, LrGhostButton } from "./live-room-primitives"
import { useSession } from "./session-store"
import { TOOLS, VIEWER_GAMEPLAN, type ToolId, type Direction } from "./session-state"

const GLYPH: Record<ToolId, LucideIcon> = { oracle: Sparkles, forecast: Target, compare: GitCompare, flow: Waves }

/* ── Field — a mono input in the recess grammar ─────────────────────── */
function Field({ label, value, onChange, tone }: { label: string; value: string; onChange: (v: string) => void; tone?: "up" | "down" | "primary" }) {
  const id = React.useId()
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 min-w-0">
      <LrEyebrow size={9} weight={500}>{label}</LrEyebrow>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="font-mono tabular-nums w-full focus:outline-none"
        style={{
          fontSize: 13, color: tone ? toneColor(tone) : LR.paper, background: LR.recess.bg, border: `1px solid ${LR.recess.border}`,
          borderRadius: 10, padding: "8px 10px", transition: "border-color 240ms ease, box-shadow 240ms ease",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = lrMix(LR.primary, 0.4); e.currentTarget.style.boxShadow = `0 0 0 3px ${lrMix(LR.primary, 0.1)}` }}
        onBlur={(e) => { e.currentTarget.style.borderColor = LR.recess.border; e.currentTarget.style.boxShadow = "none" }}
      />
    </label>
  )
}

function PrimaryButton({ children, onClick, glyph }: { children: React.ReactNode; onClick: () => void; glyph?: React.ReactNode }) {
  return (
    <motion.button
      type="button" onClick={onClick} whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}
      className="inline-flex items-center gap-2 font-mono uppercase focus:outline-none shrink-0"
      style={{ fontSize: 9.5, letterSpacing: "0.18em", fontWeight: 600, color: LR.primaryInk, background: LR.primary, borderRadius: LR.pillRadius, padding: "9px 14px", boxShadow: LR.glow }}
    >
      {children}{glyph}
    </motion.button>
  )
}

/* ── Sheets ─────────────────────────────────────────────────────────── */
function OracleSheet() {
  const s = useSession()
  const thesis = s.lensById.thesis
  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans m-0 text-pretty" style={{ fontSize: 12.5, lineHeight: 1.5, color: LR.paperDim }}>
        Oracle reads every event in the ledger and the four lenses, then writes a three-line recap. The recap posts to Main Stage and appears above Room Intelligence as a temporary <span style={{ color: LR.paper }}>Catch me up</span> lens.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <LrChip tone="ash" size={9}>{s.events.length} events</LrChip>
        <LrChip tone="ash" size={9}>{s.lenses.length} lenses</LrChip>
        <LrChip tone="ash" size={9}>{thesis?.sourceIds.length ?? 0} thesis sources</LrChip>
        <span className="flex-1" />
        <PrimaryButton onClick={s.runOracle} glyph={<Sparkles size={11} />}>Generate summary</PrimaryButton>
      </div>
    </div>
  )
}

function ForecastSheet() {
  const s = useSession()
  const thesis = s.lensById.thesis
  const symbol = thesis?.title.match(/[A-Z]{3}\/[A-Z]{3}/)?.[0] ?? "XAU/USD"
  const dir: Direction = /long/.test(thesis?.title ?? "") ? "bullish" : /short/.test(thesis?.title ?? "") ? "bearish" : "neutral"
  const get = (l: string) => thesis?.facts.find((f) => f.label.toLowerCase().startsWith(l))?.value ?? ""
  const [entry, setEntry] = React.useState(get("entry"))
  const [stop, setStop] = React.useState(get("trail") || get("stop"))
  const [target, setTarget] = React.useState(get("target"))
  const rr = Math.abs(parseFloat(target) - parseFloat(entry)) / Math.max(1e-9, Math.abs(parseFloat(entry) - parseFloat(stop)))
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <LrEyebrow size={9} weight={500}>Prefilled from Current thesis</LrEyebrow>
        <LrChip tone="ash" size={9}>{symbol}</LrChip>
        <LrChip tone={dir === "bearish" ? "down" : "up"} active size={9}>{dir === "bearish" ? "short" : "long"}</LrChip>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
        <Field label="Entry" value={entry} onChange={setEntry} />
        <Field label="Stop" value={stop} onChange={setStop} tone="down" />
        <Field label="Target" value={target} onChange={setTarget} tone="up" />
        <div className="flex flex-col gap-1.5">
          <LrEyebrow size={9} weight={500}>R : R</LrEyebrow>
          <span className="font-mono tabular-nums inline-flex items-center" style={{ fontSize: 13, color: LR.paper, height: 34, padding: "0 10px", background: LR.recess.bg, border: `1px solid ${LR.recess.border}`, borderRadius: 10 }}>
            {Number.isFinite(rr) ? `1 : ${rr.toFixed(1)}` : "—"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-sans" style={{ fontSize: 11, color: LR.ashSoft }}>Publishing drops a forecast card into Trade Setups and logs it in the timeline.</span>
        <span className="flex-1" />
        <PrimaryButton onClick={() => s.publishForecast({ symbol, direction: dir === "neutral" ? "bullish" : dir, entry, stop, target })} glyph={<ArrowRight size={11} />}>Publish</PrimaryButton>
      </div>
    </div>
  )
}

function CompareSheet() {
  const s = useSession()
  const thesis = s.lensById.thesis
  const symbol = thesis?.title.match(/[A-Z]{3}\/[A-Z]{3}/)?.[0] ?? "XAU/USD"
  const plan = VIEWER_GAMEPLAN[symbol]
  const mentorDir = /long/.test(thesis?.title ?? "") ? "long" : /short/.test(thesis?.title ?? "") ? "short" : "—"
  const fmt = (n: number) => (n >= 100 ? n.toFixed(2) : n.toFixed(4))
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <LrRecess className="p-3 flex flex-col gap-1">
          <LrEyebrow tone="primary" size={9}>Mentor thesis</LrEyebrow>
          <LrFactRow label="Direction" value={mentorDir} tone={mentorDir === "long" ? "up" : "down"} />
          {thesis?.facts.slice(0, 3).map((f, i, a) => <LrFactRow key={f.label} label={f.label} value={f.value} tone={f.tone} last={i === a.length - 1} />)}
        </LrRecess>
        <LrRecess className="p-3 flex flex-col gap-1">
          <LrEyebrow size={9}>Your Daily Gameplan</LrEyebrow>
          {plan ? (
            <>
              <LrFactRow label="Bias" value={plan.bias === "bullish" ? "long" : "short"} tone={plan.bias === "bullish" ? "up" : "down"} />
              <LrFactRow label="Daily EQ" value={fmt(plan.dailyEq)} />
              <LrFactRow label="H4 supply" value={fmt(plan.h4Supply)} />
              <LrFactRow label="Key support" value={fmt(plan.keySupport)} last />
            </>
          ) : <span className="font-sans" style={{ fontSize: 12, color: LR.ashSoft }}>No plan for {symbol} today.</span>}
        </LrRecess>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {s.alignment ? (
          <>
            <LrChip tone={s.alignment.state === "aligned" ? "up" : "warn"} active size={9} glyph={<Check size={10} />}>{s.alignment.state}</LrChip>
            <span className="font-sans text-pretty flex-1 min-w-[200px]" style={{ fontSize: 12, lineHeight: 1.45, color: LR.paperDim }}>{s.alignment.reason}</span>
          </>
        ) : (
          <>
            <span className="font-sans" style={{ fontSize: 11, color: LR.ashSoft }}>The result lands on the Thesis lens as an alignment chip.</span>
            <span className="flex-1" />
            <PrimaryButton onClick={s.comparePlan} glyph={<GitCompare size={11} />}>Compare</PrimaryButton>
          </>
        )}
      </div>
    </div>
  )
}

function FlowSheet() {
  const s = useSession()
  const on = s.screenMode === "flow"
  const facts = [
    { label: "Delta · 5m", value: "+340", tone: "up" as const },
    { label: "Imbalance", value: "62 / 38 bid", tone: "up" as const },
    { label: "Volume", value: "12.4K" },
    { label: "Open interest", value: "+2.1K" },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
        {facts.map((f) => (
          <LrRecess key={f.label} className="p-3 flex flex-col gap-1.5">
            <LrEyebrow size={9} weight={500}>{f.label}</LrEyebrow>
            <span className="font-mono tabular-nums" style={{ fontSize: 16, color: f.tone ? toneColor(f.tone) : LR.paper }}>{f.value}</span>
          </LrRecess>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-sans" style={{ fontSize: 11, color: LR.ashSoft }}>{on ? "The screen is in flow mode — delta bars ride under price." : "Switches the screen overlay to flow and opens the Order Flow room."}</span>
        <span className="flex-1" />
        <PrimaryButton onClick={s.toggleFlow} glyph={<Waves size={11} />}>{on ? "Back to price" : "Show flow"}</PrimaryButton>
      </div>
    </div>
  )
}

/* ── The card ───────────────────────────────────────────────────────────
 *  One tool, as the inspector's card. The deck key that opened it stays
 *  lit; closing returns to the mentor. No inline expansion anywhere else.
 * ──────────────────────────────────────────────────────────────────────── */
export function ToolPanel({ id }: { id: ToolId }) {
  const s = useSession()
  const def = TOOLS.find((t) => t.id === id)!
  const Glyph = GLYPH[id]
  const fg = s.foregroundTools.includes(id)
  return (
    <LrPane labelledBy={`lr-tool-${id}`} delay={0} corners={false} glow>
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 min-w-0">
        <span className="inline-flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 9, background: lrMix(LR.primary, 0.12), border: `1px solid ${lrMix(LR.primary, 0.22)}`, color: LR.primary }}>
          <Glyph size={14} />
        </span>
        <div className="flex flex-col min-w-0 gap-0.5">
          <span id={`lr-tool-${id}`} className="font-sans truncate" style={{ fontSize: 14, fontWeight: 500, color: LR.paper, letterSpacing: "-0.005em" }}>{def.label}</span>
          <span className="font-mono uppercase truncate" style={{ fontSize: 9, letterSpacing: "0.16em", color: fg ? LR.primary : LR.ashSoft }}>{fg ? `Foregrounded · ${s.phase} phase` : `Tool · ${s.phase} phase`}</span>
        </div>
        <span className="flex-1" />
        <LrGhostButton label="Back to the mentor" onClick={s.goHome} size={26}>
          <X size={12} />
        </LrGhostButton>
      </div>
      <div className="px-4 pb-4">
        {id === "oracle" && <OracleSheet />}
        {id === "forecast" && <ForecastSheet />}
        {id === "compare" && <CompareSheet />}
        {id === "flow" && <FlowSheet />}
      </div>
    </LrPane>
  )
}
