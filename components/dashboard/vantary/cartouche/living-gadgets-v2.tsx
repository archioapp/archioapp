"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — NEW GADGETS (v2 expansion)
   ───────────────────────────────────────────────────────────────────────────
   Three new living gadgets that fill real gaps in the deck:

     · risk-envelope  (S) — how much of today's risk budget is spent. The single
                            most important "can I take another trade?" signal.
     · daily-plan     (M) — today's trade plan: trades used, focus pairs, the
                            day's intent. The pre-flight checklist.
     · goals-beacon   (M) — progress toward the trader's personal goals.

   Each is a thin wrapper around <LivingGadget/> with multiple cycling faces,
   mirroring the existing 10 gadgets exactly. Deep detail lives in each one's
   Inspector (see ./inspectors).
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { motion } from "framer-motion"
import { LivingGadget, GadgetEyebrow, GadgetBig, GadgetSub } from "./living-gadget"
import { MicroRing, ProgressBar } from "./gadget-primitives"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import type { GadgetAlignment } from "./living-gadget"

const CARTOUCHE_RED   = "#ff5c6d"
const CARTOUCHE_GREEN = "#22d3a3"
const CARTOUCHE_AMBER = "#f5b544"

/* ════════════════════════════════════════════════════════════════════════
   Per-gadget data shapes
   ════════════════════════════════════════════════════════════════════════ */

export interface RiskEnvelopeData {
  lossUsed: number        // R or % already risked today
  lossMax: number         // daily loss ceiling
  tradesUsed: number
  tradesMax: number
  openRisk: number        // R currently live in the market
}

export interface DailyPlanData {
  tradesUsed: number
  tradesMax: number
  focusPairs: readonly string[]
  bias: string            // e.g. "Long EUR on retrace"
  sessionName: string
}

export interface GoalsBeaconData {
  goals: ReadonlyArray<{ id: string; title: string; progress: number; milestoneLabel: string }>
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET · risk-envelope (S, 3 faces, gauge-fill)
   ════════════════════════════════════════════════════════════════════════ */

export function RiskEnvelopeGadget(props: {
  data: RiskEnvelopeData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const lossPct  = Math.max(0, Math.min(1, data.lossUsed / data.lossMax))
  const remaining = Math.max(0, data.lossMax - data.lossUsed)
  const zone = lossPct >= 0.8 ? CARTOUCHE_RED : lossPct >= 0.5 ? CARTOUCHE_AMBER : CARTOUCHE_GREEN

  return (
    <LivingGadget
      name="risk-envelope"
      label="Risk Envelope"
      alignment={alignment}
      size="s"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="pulse-flash"
      baseInterval={5200}
      faces={[
        /* ── Face · BUDGET LEFT ─────────────────────────────────────────── */
        {
          id: "budget", label: "Risk Budget", intervalMs: 5400,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Risk Budget</GadgetEyebrow>
              <GadgetBig alignment={alignment} accent={accent} size={20}>
                <span style={{ color: zone }}>{remaining.toFixed(1)}R</span>
              </GadgetBig>
              <GadgetSub alignment={alignment}>left of {data.lossMax.toFixed(0)}R today</GadgetSub>
              <div style={{ marginTop: 5, display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                <ProgressBar pct={lossPct * 100} accent={accent} width={108} height={5} fillColor={zone} />
              </div>
            </div>
          ),
        },

        /* ── Face · SPENT GAUGE ─────────────────────────────────────────── */
        {
          id: "spent", label: "Used", intervalMs: 5000,
          render: () => (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
              <MicroRing value={lossPct * 100} max={100} size={40} strokeWidth={3.5} accent={accent} label={`${Math.round(lossPct * 100)}%`} />
              <div>
                <GadgetEyebrow alignment={alignment} accent={accent}>Risk Used</GadgetEyebrow>
                <GadgetSub alignment={alignment}>{data.lossUsed.toFixed(1)}R of {data.lossMax.toFixed(0)}R</GadgetSub>
              </div>
            </div>
          ),
        },

        /* ── Face · OPEN RISK ───────────────────────────────────────────── */
        {
          id: "open", label: "Live Risk", intervalMs: 4800,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Live Risk</GadgetEyebrow>
              <motion.div
                animate={{ opacity: data.openRisk > 0 ? [1, 0.6, 1] : 1 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <GadgetBig alignment={alignment} accent={accent} size={20}>
                  <span style={{ color: data.openRisk > 0 ? CARTOUCHE_AMBER : VG_VT.paperDim }}>{data.openRisk.toFixed(1)}R</span>
                </GadgetBig>
              </motion.div>
              <GadgetSub alignment={alignment}>{data.openRisk > 0 ? "exposed in market" : "flat · no open risk"}</GadgetSub>
            </div>
          ),
        },
      ]}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET · daily-plan (M, 3 faces, checklist)
   ════════════════════════════════════════════════════════════════════════ */

export function DailyPlanGadget(props: {
  data: DailyPlanData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const tradesLeft = Math.max(0, data.tradesMax - data.tradesUsed)

  return (
    <LivingGadget
      name="daily-plan"
      label="Daily Plan"
      alignment={alignment}
      size="m"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="vault-roll"
      baseInterval={5600}
      faces={[
        /* ── Face · TRADES LEFT ─────────────────────────────────────────── */
        {
          id: "trades", label: "Trades Left", intervalMs: 5600,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Trades Left Today</GadgetEyebrow>
              <GadgetBig alignment={alignment} accent={accent} size={22}>
                {tradesLeft}<span style={{ color: VG_VT.paperDim, fontSize: 14 }}> / {data.tradesMax}</span>
              </GadgetBig>
              <div style={{ marginTop: 6, display: "flex", gap: 4, justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                {Array.from({ length: data.tradesMax }).map((_, i) => {
                  const used = i < data.tradesUsed
                  return (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      style={{
                        width: 16, height: 5, borderRadius: 3,
                        background: used ? vgRgba(accent.rgb, 0.25) : accent.hex,
                        boxShadow: used ? "none" : `0 0 6px ${vgRgba(accent.rgb, 0.5)}`,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          ),
        },

        /* ── Face · FOCUS PAIRS ─────────────────────────────────────────── */
        {
          id: "focus", label: "Focus", intervalMs: 5200,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Focus Pairs</GadgetEyebrow>
              <div style={{ marginTop: 3, display: "flex", flexWrap: "wrap", gap: 5, justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                {data.focusPairs.map((p) => (
                  <span
                    key={p}
                    className="font-mono"
                    style={{
                      fontSize: 11, padding: "2px 7px", borderRadius: 6,
                      color: accent.hex,
                      background: vgRgba(accent.rgb, 0.1),
                      border: `1px solid ${vgRgba(accent.rgb, 0.22)}`,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
              <GadgetSub alignment={alignment}>{data.sessionName} session</GadgetSub>
            </div>
          ),
        },

        /* ── Face · BIAS ────────────────────────────────────────────────── */
        {
          id: "bias", label: "Bias", intervalMs: 5000,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Today&apos;s Bias</GadgetEyebrow>
              <div className="font-sans" style={{ fontSize: 14, fontWeight: 500, color: VG_VT.paper, lineHeight: 1.35, marginTop: 2 }}>
                {data.bias}
              </div>
              <GadgetSub alignment={alignment}>{tradesLeft} trade{tradesLeft === 1 ? "" : "s"} to execute it</GadgetSub>
            </div>
          ),
        },
      ]}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET · goals-beacon (M, cycles each goal)
   ════════════════════════════════════════════════════════════════════════ */

export function GoalsBeaconGadget(props: {
  data: GoalsBeaconData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const goals = data.goals.length ? data.goals : [{ id: "none", title: "No goals set", progress: 0, milestoneLabel: "Add a goal" }]

  return (
    <LivingGadget
      name="goals-beacon"
      label="Goals Beacon"
      alignment={alignment}
      size="m"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="ring-redraw"
      baseInterval={5400}
      faces={goals.map((g) => ({
        id: g.id,
        label: g.title,
        intervalMs: 5200,
        render: () => (
          <div style={{ display: "flex", alignItems: "center", gap: 11, flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
            <MicroRing value={g.progress} max={100} size={42} strokeWidth={3.5} accent={accent} label={`${Math.round(g.progress)}%`} />
            <div style={{ minWidth: 0 }}>
              <GadgetEyebrow alignment={alignment} accent={accent}>Goal</GadgetEyebrow>
              <div className="font-sans" style={{ fontSize: 13, fontWeight: 500, color: VG_VT.paper, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                {g.title}
              </div>
              <GadgetSub alignment={alignment}>{g.milestoneLabel}</GadgetSub>
            </div>
          </div>
        ),
      }))}
    />
  )
}
