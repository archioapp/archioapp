"use client"

import GlassWindowPopup from "@/components/shared/glass-window-popup"
import { ConfidenceBadge, MetricPill, RiskBadge, ViewForecastButton } from "@/components/shared/glass-ui"
import {
  Activity,
  ArrowDownLeft,
  Box,
  CalendarClock,
  CircleDot,
  Droplets,
  Hammer,
  Repeat,
  Scale,
  ScanLine,
  TrendingUp,
  FlipHorizontal2,
} from "lucide-react"

const keyConfluences = [
  { icon: TrendingUp, name: "Higher Timeframe Structure" },
  { icon: Droplets, name: "Liquidity Sweep" },
  { icon: Scale, name: "Balanced Price Range" },
  { icon: ScanLine, name: "Fair Value Gap (FVG)" },
  { icon: FlipHorizontal2, name: "Inverted FVG (iFVG)" },
  { icon: Box, name: "Order Block (OB)" },
  { icon: Hammer, name: "Breaker Block" },
  { icon: Repeat, name: "Power of Three (PO3)" },
  { icon: CalendarClock, name: "Bank Session Filter" },
]

export default function GlassDemoPage() {
  return (
    <main className="min-h-[80vh] w-full bg-[#0a0a12] bg-[radial-gradient(360px_200px_at_20%_20%,rgba(147,51,234,0.14),transparent_60%),radial-gradient(320px_200px_at_80%_75%,rgba(168,85,247,0.08),transparent_60%)] p-8 text-zinc-200">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-2xl font-semibold text-white">GLASS – Hover Popup with Full-Surface Shine</h1>

        <div className="flex items-start gap-10">
          <GlassWindowPopup
            placement="right"
            align="center"
            width={520}
            trigger={
              <button className="rounded-full border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 shadow transition hover:border-[rgba(147,51,234,0.35)] hover:shadow-[0_0_30px_rgba(147,51,234,0.25)]">
                Hover for GLASS popup
              </button>
            }
          >
            {/* Card Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[rgba(124,58,237,0.15)] p-2 ring-1 ring-purple-500/30">
                  <ArrowDownLeft className="h-4 w-4 text-purple-300" />
                </div>
                <div>
                  <div className="text-base font-semibold">USD/CHF</div>
                  <div className="text-xs text-zinc-400">Sell Position</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ConfidenceBadge value={86} />
                <RiskBadge level="High" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MetricPill icon={Activity} label="Entry" value="0.00" accent="zinc" />
              <MetricPill icon={CircleDot} label="R/R" value="1:00.00" accent="emerald" />
              <MetricPill icon={ArrowDownLeft} label="Stop Loss" value="0.00" accent="rose" />
              <MetricPill icon={ArrowDownLeft} label="Take Profit" value="0.00" accent="emerald" />
            </div>

            {/* Key Confluences */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-md">
              <div className="mb-3 text-sm font-semibold">Key Confluences</div>
              <div className="flex flex-wrap gap-2">
                {keyConfluences.map((c) => {
                  const Icon = c.icon
                  return (
                    <div
                      key={c.name}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 transition hover:border-[rgba(147,51,234,0.35)] hover:shadow-[0_0_20px_rgba(147,51,234,0.35)]"
                    >
                      <Icon className="h-3.5 w-3.5 text-purple-300" />
                      <span className="whitespace-nowrap">{c.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs text-zinc-400">04:22:40 • forecast</div>
              <ViewForecastButton>View Forecast</ViewForecastButton>
            </div>
          </GlassWindowPopup>

          <p className="max-w-sm text-sm text-zinc-400">
            This popup reproduces your “GLASS” system: frosted purple glass, glowing borders, chips, badges, and a
            diagonal shine that sweeps across the whole window once per hover.
          </p>
        </div>
      </div>
    </main>
  )
}
