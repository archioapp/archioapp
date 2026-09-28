"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   INSPECTOR · MANAGEMENT PULSE — the portfolio command deck
   ───────────────────────────────────────────────────────────────────────────
   Total equity across every account, today's intraday P&L curve, per-account
   contribution and exposure, and the read on where the capital is working.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { VT, rgba } from "@/components/vantary-glass"
import {
  InspectorSection, InspectorGrid, InspectorNote,
  registerInspector, type InspectorBodyProps,
} from "../gadget-inspector"
import { AreaSpark, Donut, VaultNumber, Stat } from "../instruments"
import { ACCOUNTS, TODAY_PNL_SPARKLINE_24H } from "@/components/dashboard/dashboard-data"

const ACCOUNT_COLORS = [VT.emerald, "#4fb8ff", VT.amber, "#b98bff"]

function fmtUsd(n: number) {
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
}

function ManagementPulseBody({ accent, activeTab, registerTabs }: InspectorBodyProps) {
  React.useEffect(() => {
    registerTabs([
      { id: "overview", label: "Overview" },
      { id: "accounts", label: "Accounts" },
    ])
  }, [registerTabs])

  const totalEquity = ACCOUNTS.reduce((s, a) => s + a.equity, 0)
  const totalFloating = ACCOUNTS.reduce((s, a) => s + a.floatingPnl, 0)
  const todayOpen = TODAY_PNL_SPARKLINE_24H[0] ?? 0
  const todayNow = TODAY_PNL_SPARKLINE_24H[TODAY_PNL_SPARKLINE_24H.length - 1] ?? 0
  const todayDelta = todayNow - todayOpen

  const donutSegments = ACCOUNTS.map((a, i) => ({
    value: a.equity,
    color: ACCOUNT_COLORS[i % ACCOUNT_COLORS.length],
    label: a.name,
  }))

  if (activeTab === "overview") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InspectorGrid cols={3}>
          <InspectorSection accent={accent} pad={16}>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: VT.ashSoft }}>TOTAL EQUITY</span>
            <div style={{ marginTop: 6 }}>
              <VaultNumber value={totalEquity} prefix="$" decimals={0} color={accent.hex} size={32} />
            </div>
          </InspectorSection>
          <InspectorSection accent={accent} pad={16}>
            <Stat label="Floating P&L" value={`${totalFloating >= 0 ? "+" : ""}${fmtUsd(totalFloating)}`} color={totalFloating >= 0 ? VT.emerald : VT.rose} valueSize={22} />
          </InspectorSection>
          <InspectorSection accent={accent} pad={16}>
            <Stat label="Today" value={`${todayDelta >= 0 ? "+" : ""}${fmtUsd(todayDelta)}`} color={todayDelta >= 0 ? VT.emerald : VT.rose} valueSize={22} />
          </InspectorSection>
        </InspectorGrid>

        <InspectorSection title="Today's intraday P&L" accent={accent}>
          <AreaSpark data={[...TODAY_PNL_SPARKLINE_24H]} w={780} h={130} accent={accent} fill baseline={todayOpen} />
        </InspectorSection>

        <InspectorNote accent={accent}>
          Capital is spread across <strong style={{ color: accent.hex }}>{ACCOUNTS.length} accounts</strong> totalling{" "}
          <strong style={{ color: accent.hex }}>{fmtUsd(totalEquity)}</strong>. Floating exposure is{" "}
          <strong style={{ color: totalFloating >= 0 ? VT.emerald : VT.rose }}>{totalFloating >= 0 ? "+" : ""}{fmtUsd(totalFloating)}</strong>{" "}
          — {Math.abs(totalFloating) < totalEquity * 0.01 ? "well within a calm risk band." : "worth watching as it scales against total equity."}
        </InspectorNote>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <InspectorGrid cols={2}>
        <InspectorSection title="Equity allocation" accent={accent}>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <Donut segments={donutSegments} size={160} thickness={18} label={fmtUsd(totalEquity)} sublabel="TOTAL" />
          </div>
        </InspectorSection>
        <InspectorSection title="Per-account" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ACCOUNTS.map((a, i) => {
              const c = ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]
              const pct = (a.equity / totalEquity) * 100
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 10, background: rgba("255,255,255", 0.03), border: `1px solid ${rgba("255,255,255", 0.07)}` }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: c, flexShrink: 0, boxShadow: `0 0 7px ${c}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-sans" style={{ fontSize: 12.5, color: VT.paper, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                    <div className="font-mono" style={{ fontSize: 9.5, letterSpacing: "0.05em", color: VT.ashSoft }}>{a.type.replace("_", " ").toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="font-mono tabular-nums" style={{ fontSize: 12.5, color: VT.paper }}>{fmtUsd(a.equity)}</div>
                    <div className="font-mono tabular-nums" style={{ fontSize: 9.5, color: a.floatingPnl >= 0 ? VT.emerald : VT.rose }}>{a.floatingPnl >= 0 ? "+" : ""}{fmtUsd(a.floatingPnl)} · {pct.toFixed(0)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </InspectorSection>
      </InspectorGrid>

      <InspectorNote accent={accent}>
        Your largest book holds <strong style={{ color: accent.hex }}>{((Math.max(...ACCOUNTS.map((a) => a.equity)) / totalEquity) * 100).toFixed(0)}%</strong>{" "}
        of total equity. Diversifying execution across prop and live accounts spreads firm-rule risk while keeping the live curve compounding.
      </InspectorNote>
    </div>
  )
}

registerInspector("management-pulse", {
  eyebrow: "ACTIVITY · PORTFOLIO",
  title: "Management Pulse",
  subtitle: "Total capital across every account, today's intraday flow, and where the money is working.",
  Body: ManagementPulseBody,
})
