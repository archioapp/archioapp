"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · EQUITY BEACON — the equity command view
   ───────────────────────────────────────────────────────────────────────────
   Full equity curve, daily P&L columns, MTD / peak / drawdown stats, and the
   per-account contribution breakdown.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import {
  AreaSpark, BarColumns, Donut, Stat, TrendArrow, VaultNumber,
} from "../instruments"
import {
  LIVE_ACCOUNTS, TOTAL_EQUITY, TOTAL_FLOATING,
  EQUITY_CURVE_30D, EQUITY_DAILY_14D, ACCOUNT_SPARKLINES,
  fmtUsd, fmtSignedUsd, fmtPct,
} from "./inspector-data"

const MTD_PCT = 18.3

function EquityBeaconBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "curve", label: "Equity Curve" },
      { id: "daily", label: "Daily P&L" },
      { id: "accounts", label: "Accounts" },
    ])
  }, [registerTabs])

  const peak = Math.max(...EQUITY_CURVE_30D)
  const trough = Math.min(...EQUITY_CURVE_30D)
  const maxDD = ((peak - trough) / peak) * 100
  const greenDays = EQUITY_DAILY_14D.filter((d) => d > 0).length
  const totalDaily = EQUITY_DAILY_14D.reduce((s, d) => s + d, 0)

  /* ── header stat band shared across tabs ── */
  const StatBand = (
    <InspectorGrid cols={4}>
      <InspectorSection accent={accent} pad={14}>
        <Stat label="Total equity" value={<VaultNumber value={TOTAL_EQUITY} prefix="$" />} color={accent.hex} valueSize={20} />
      </InspectorSection>
      <InspectorSection accent={accent} pad={14}>
        <Stat label="Month to date" value={fmtPct(MTD_PCT)} color={VT.emerald} valueSize={20} sub={<TrendArrow value={MTD_PCT} suffix="%" />} />
      </InspectorSection>
      <InspectorSection accent={accent} pad={14}>
        <Stat label="Peak equity" value={fmtUsd(peak)} valueSize={20} />
      </InspectorSection>
      <InspectorSection accent={accent} pad={14}>
        <Stat label="Max drawdown" value={fmtPct(maxDD)} color={VT.rose} valueSize={20} />
      </InspectorSection>
    </InspectorGrid>
  )

  /* ── CURVE ── */
  if (activeTab === "curve") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {StatBand}
        <InspectorSection title="30-day equity curve" accent={accent}
          action={<span className="font-mono" style={{ fontSize: 10, color: VT.ashSoft }}>{fmtUsd(trough)} → {fmtUsd(peak)}</span>}>
          <AreaSpark data={EQUITY_CURVE_30D} w={780} h={180} accent={accent} strokeWidth={2} />
        </InspectorSection>
        <InspectorNote accent={accent}>
          Equity climbed <strong style={{ color: VT.emerald }}>{fmtPct(((TOTAL_EQUITY - EQUITY_CURVE_30D[0]!) / EQUITY_CURVE_30D[0]!) * 100)}</strong>{" "}
          over the trailing 30 days with a max intra-period drawdown of {fmtPct(maxDD)}. Floating P&L
          across open positions currently contributes{" "}
          <strong style={{ color: TOTAL_FLOATING >= 0 ? VT.emerald : VT.rose }}>{fmtSignedUsd(TOTAL_FLOATING)}</strong>.
        </InspectorNote>
      </div>
    )
  }

  /* ── DAILY ── */
  if (activeTab === "daily") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {StatBand}
        <InspectorSection title="Daily P&L · last 14 sessions" accent={accent}
          action={<span className="font-mono" style={{ fontSize: 10, color: VT.emerald }}>{greenDays} green / {EQUITY_DAILY_14D.length - greenDays} red</span>}>
          <BarColumns data={[...EQUITY_DAILY_14D]} w={780} h={150} accent={accent} gap={6} />
        </InspectorSection>
        <InspectorGrid cols={3}>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="14-day net" value={fmtSignedUsd(totalDaily)} color={totalDaily >= 0 ? VT.emerald : VT.rose} valueSize={18} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Best day" value={fmtSignedUsd(Math.max(...EQUITY_DAILY_14D))} color={VT.emerald} valueSize={18} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={14}>
            <Stat label="Worst day" value={fmtSignedUsd(Math.min(...EQUITY_DAILY_14D))} color={VT.rose} valueSize={18} />
          </InspectorSection>
        </InspectorGrid>
        <InspectorNote accent={accent}>
          {greenDays} of the last {EQUITY_DAILY_14D.length} sessions closed green ({fmtPct((greenDays / EQUITY_DAILY_14D.length) * 100, 0)} hit
          rate). The single worst day was {fmtSignedUsd(Math.min(...EQUITY_DAILY_14D))} — well inside
          your risk envelope, which is what keeps the curve compounding.
        </InspectorNote>
      </div>
    )
  }

  /* ── ACCOUNTS ── */
  const segments = LIVE_ACCOUNTS.map((a, i) => ({
    value: a.equity,
    color: i === 0 ? accent.hex : i === 1 ? VT.blue : VT.amber,
    rgb: i === 0 ? accent.rgb : i === 1 ? VT.blueRgb : VT.amberRgb,
    label: a.name,
  }))
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {StatBand}
      <InspectorGrid cols={2}>
        <InspectorSection title="Allocation" accent={accent}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Donut segments={segments} size={120} thickness={14} label={LIVE_ACCOUNTS.length} sublabel="accounts" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {LIVE_ACCOUNTS.map((a, i) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: segments[i]!.color, flexShrink: 0 }} />
                  <span className="font-sans" style={{ fontSize: 11, color: VT.paper, flex: 1, whiteSpace: "nowrap" }}>{a.name}</span>
                  <span className="font-mono tabular-nums" style={{ fontSize: 11, color: VT.ashSoft }}>{fmtPct((a.equity / TOTAL_EQUITY) * 100, 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </InspectorSection>
        <InspectorSection title="Per-account equity" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {LIVE_ACCOUNTS.map((a) => {
              const spark = ACCOUNT_SPARKLINES[a.id]
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-sans" style={{ fontSize: 12, color: VT.paper, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                    <div className="font-mono" style={{ fontSize: 9.5, color: VT.ashSoft, letterSpacing: "0.08em" }}>{a.broker.toUpperCase()}</div>
                  </div>
                  {spark && <AreaSpark data={[...spark]} w={84} h={28} accent={accent} showDot={false} />}
                  <div style={{ textAlign: "right", minWidth: 88 }}>
                    <div className="font-mono tabular-nums" style={{ fontSize: 13, color: accent.hex }}>{fmtUsd(a.equity)}</div>
                    <div className="font-mono tabular-nums" style={{ fontSize: 10, color: a.floatingPnl >= 0 ? VT.emerald : VT.rose }}>{fmtSignedUsd(a.floatingPnl)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </InspectorSection>
      </InspectorGrid>
      <InspectorNote accent={accent}>
        Equity is concentrated in your {LIVE_ACCOUNTS[1]?.name ?? "prop"} account
        ({fmtPct(((LIVE_ACCOUNTS[1]?.equity ?? 0) / TOTAL_EQUITY) * 100, 0)} of capital). Diversifying
        realized gains into your live account reduces single-evaluation risk once the challenge clears.
      </InspectorNote>
    </div>
  )
}

registerInspector("equity-beacon-live", {
  eyebrow: "CAPITAL · LIVE",
  title: "Equity Beacon",
  subtitle: "Your full capital picture — curve, daily rhythm, and where every dollar sits.",
  Body: EquityBeaconBody,
})
