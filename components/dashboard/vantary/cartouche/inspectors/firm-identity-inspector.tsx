"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · FIRM IDENTITY — the evaluation dossier
   ───────────────────────────────────────────────────────────────────────────
   Deep canvas for the funded-account / prop-firm evaluation: phase timeline,
   profit-target ladder, drawdown headroom, days-left countdown, and the full
   objective checklist with a plain-language read on where the trader stands.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import {
  RadialGauge, HeadroomBar, ProgressLadder, Stat, TrendArrow,
} from "../instruments"
import {
  PROP_ACCOUNT, PROP, fmtUsd, fmtPct,
} from "./inspector-data"

function FirmIdentityBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "overview", label: "Overview" },
      { id: "objectives", label: "Objectives" },
      { id: "timeline", label: "Timeline" },
    ])
  }, [registerTabs])

  const profitPct = (PROP.profitCurrent / PROP.profitTarget) * 100
  const ddHeadroom = PROP.maxDrawdown - PROP_ACCOUNT.drawdownCurrent
  const dailyHeadroom = PROP.dailyLossLimit - PROP.dailyLossUsed
  const daysLeft = Math.max(0, PROP.daysRequired - PROP.daysTraded + 7)

  /* ── OVERVIEW ── */
  if (activeTab === "overview") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={3}>
          <InspectorSection title="Profit progress" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <RadialGauge
                value={profitPct} size={92} thickness={9} accent={accent} ticks={5}
                label={fmtPct(profitPct, 0)} sublabel="of target"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Stat label="Current" value={fmtPct(PROP.profitCurrent)} color={accent.hex} />
                <Stat label="Target" value={fmtPct(PROP.profitTarget)} />
              </div>
            </div>
          </InspectorSection>

          <InspectorSection title="Drawdown headroom" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <RadialGauge
                value={ddHeadroom} max={PROP.maxDrawdown} size={92} thickness={9}
                accent={accent} valueColor={ddHeadroom > 4 ? VT.emerald : VT.amber}
                label={fmtPct(ddHeadroom)} sublabel="left"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Stat label="Used" value={fmtPct(PROP_ACCOUNT.drawdownCurrent)} />
                <Stat label="Max" value={fmtPct(PROP.maxDrawdown)} color={VT.rose} />
              </div>
            </div>
          </InspectorSection>

          <InspectorSection title="Days remaining" accent={accent}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <RadialGauge
                value={PROP.daysTraded} max={PROP.daysTraded + daysLeft} size={92}
                thickness={9} accent={accent} label={daysLeft} sublabel="days left"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Stat label="Traded" value={`${PROP.daysTraded}d`} color={accent.hex} />
                <Stat label="Min req" value={`${PROP.daysRequired}d`} />
              </div>
            </div>
          </InspectorSection>
        </InspectorGrid>

        <InspectorSection title="Daily loss headroom" accent={accent}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <HeadroomBar
              used={PROP.dailyLossUsed} max={PROP.dailyLossLimit} w={260} h={10}
              accent={accent} label={`${fmtPct(PROP.dailyLossUsed)} of ${fmtPct(PROP.dailyLossLimit)} used today`}
            />
            <Stat label="Buffer left" value={fmtPct(dailyHeadroom)} color={VT.emerald} valueSize={20} />
          </div>
        </InspectorSection>

        <InspectorNote accent={accent}>
          You&apos;re <strong style={{ color: accent.hex }}>{fmtPct(profitPct, 0)}</strong> of the
          way to your {fmtPct(PROP.profitTarget)} profit target with{" "}
          <strong style={{ color: VT.emerald }}>{fmtPct(ddHeadroom)}</strong> of drawdown still in
          reserve. At this pace, staying disciplined for the remaining {daysLeft} days clears the{" "}
          {PROP.phase} phase. Protecting the downside matters more than chasing the target now —
          a single {fmtPct(PROP.dailyLossLimit)} breach ends the evaluation.
        </InspectorNote>
      </div>
    )
  }

  /* ── OBJECTIVES ── */
  if (activeTab === "objectives") {
    const objectives = [
      { label: `Reach ${fmtPct(PROP.profitTarget)} profit target`, done: PROP.profitCurrent >= PROP.profitTarget, value: fmtPct(PROP.profitCurrent) },
      { label: `Stay under ${fmtPct(PROP.maxDrawdown)} max drawdown`, done: PROP_ACCOUNT.drawdownCurrent < PROP.maxDrawdown, value: fmtPct(PROP_ACCOUNT.drawdownCurrent) },
      { label: `Respect ${fmtPct(PROP.dailyLossLimit)} daily loss limit`, done: PROP.dailyLossUsed < PROP.dailyLossLimit, value: fmtPct(PROP.dailyLossUsed) },
      { label: `Trade minimum ${PROP.daysRequired} days`, done: PROP.daysTraded >= PROP.daysRequired, value: `${PROP.daysTraded}d` },
    ]
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorSection title="Evaluation objectives" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {objectives.map((o, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 4px",
                  borderBottom: i < objectives.length - 1 ? `1px solid ${VT.ruleSoft}` : "none",
                }}
              >
                <span
                  style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: o.done ? rgba(VT.emeraldRgb, 0.16) : rgba(accent.rgb, 0.1),
                    border: `1px solid ${o.done ? rgba(VT.emeraldRgb, 0.5) : rgba(accent.rgb, 0.3)}`,
                    color: o.done ? VT.emerald : accent.hex, fontSize: 11, fontWeight: 700,
                  }}
                >
                  {o.done ? "✓" : "•"}
                </span>
                <span className="font-sans" style={{ flex: 1, fontSize: 13, color: VT.paper }}>{o.label}</span>
                <span className="font-mono tabular-nums" style={{ fontSize: 13, color: o.done ? VT.emerald : accent.hex }}>{o.value}</span>
              </div>
            ))}
          </div>
        </InspectorSection>
        <InspectorNote accent={accent}>
          Two of four objectives are structural guardrails (drawdown + daily loss) — they don&apos;t
          require action, only restraint. The profit target is the one you actively pursue. Once the
          minimum trading days are met, only the profit target gates payout.
        </InspectorNote>
      </div>
    )
  }

  /* ── TIMELINE ── */
  const phases = [
    { label: "Evaluation", value: "active", reached: true },
    { label: "Verification", value: fmtPct(PROP.profitTarget), reached: false },
    { label: "Funded", value: "payout", reached: false },
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorSection title="Account journey" accent={accent}>
        <ProgressLadder
          steps={phases} current={0} accent={accent} w={320}
        />
      </InspectorSection>
      <InspectorGrid cols={2}>
        <InspectorSection title="Firm" accent={accent}>
          <Stat label="Prop firm" value={PROP.firm} valueSize={18} />
          <div style={{ height: 10 }} />
          <Stat label="Account size" value={fmtUsd(PROP_ACCOUNT.balance)} />
        </InspectorSection>
        <InspectorSection title="Phase progress" accent={accent}>
          <Stat label="Phase" value={PROP.phase} valueSize={18} color={accent.hex} />
          <div style={{ height: 10 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Stat label="To target" value={fmtPct(PROP.profitTarget - PROP.profitCurrent)} />
            <TrendArrow value={PROP.profitCurrent} suffix="%" showBg />
          </div>
        </InspectorSection>
      </InspectorGrid>
    </div>
  )
}

registerInspector("firm-identity", {
  eyebrow: "FUNDED ACCOUNT · EVALUATION",
  title: "Firm Identity",
  subtitle: "Your prop-firm evaluation at a glance — targets, guardrails, and the path to funded.",
  Body: FirmIdentityBody,
})
