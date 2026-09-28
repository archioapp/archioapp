"use client"

import GlassHoverPopup from "@/components/shared/glass-hover-popup"
import {
  CalendarClock,
  Clock,
  Droplets,
  Hammer,
  Repeat,
  Scale,
  ScanLine,
  TrendingUp,
  Box,
  FlipHorizontal2,
  Info,
} from "lucide-react"

const ULTRA_DEMO = [
  { icon: TrendingUp, name: "HTF Structure", desc: "BOS, CHoCH, trend bias" },
  { icon: Droplets, name: "Liquidity Sweep", desc: "Stop hunts, engineered moves" },
  { icon: Scale, name: "BPR", desc: "Premium/discount zones" },
  { icon: ScanLine, name: "FVG", desc: "HTF/LTF imbalances" },
  { icon: FlipHorizontal2, name: "iFVG", desc: "Inverted FVGs" },
  { icon: Box, name: "Order Block", desc: "Institutional footprints" },
  { icon: Hammer, name: "Breaker Block", desc: "Failed OB flipping" },
  { icon: Clock, name: "Bank Session Filter", desc: "Session windows" },
  { icon: Repeat, name: "PO3", desc: "Accumulation → Manipulation → Distribution" },
  { icon: CalendarClock, name: "Weekly/Daily Open + PD", desc: "Opens with PD context" },
]

export default function GlassPopupPlayground() {
  return (
    <main className="min-h-[80vh] w-full bg-gradient-to-b from-[#0a0a12] to-[#0b0b14] text-zinc-200">
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold text-white">Glass Hover Popup – Premium Shine</h1>

        <div className="flex flex-wrap items-start gap-12">
          <GlassHoverPopup
            placement="right"
            align="center"
            offset={16}
            width={540}
            trigger={
              <button className="rounded-full border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 shadow transition hover:border-[rgba(147,51,234,0.35)] hover:shadow-[0_0_30px_rgba(147,51,234,0.25)]">
                Hover me (Right)
              </button>
            }
            popupClassName="p-5"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-6">
              <div>
                <div className="text-lg font-semibold">Key Confluences</div>
                <div className="mt-0.5 text-xs text-zinc-400">Premium glass popup with diagonal shine sweep</div>
              </div>
              <Info className="h-4 w-4 text-zinc-400" />
            </div>

            {/* Grid of ultra confluences */}
            <div className="grid grid-cols-2 gap-3">
              {ULTRA_DEMO.map((c) => {
                const Icon = c.icon
                return (
                  <div
                    key={c.name}
                    className="group relative rounded-xl border border-white/10 bg-zinc-900/40 p-3 backdrop-blur-md transition hover:border-[rgba(147,51,234,0.35)] hover:shadow-[0_0_24px_rgba(147,51,234,0.35)] hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-purple-500/10 p-1.5 text-purple-300 ring-1 ring-purple-500/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-300">
                            Technical
                          </span>
                        </div>
                        <div className="mt-1 line-clamp-1 text-xs text-zinc-400">{c.desc}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs text-purple-300">10 / 10 selected</div>
              <button className="rounded-lg bg-gradient-to-r from-purple-500 to-amber-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_8px_24px_-8px_rgba(147,51,234,0.55)] transition hover:shadow-[0_10px_36px_-8px_rgba(147,51,234,0.7)]">
                Save
              </button>
            </div>
          </GlassHoverPopup>

          <GlassHoverPopup
            placement="top"
            align="center"
            offset={14}
            width={440}
            trigger={
              <button className="rounded-full border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 shadow transition hover:border-[rgba(147,51,234,0.35)] hover:shadow-[0_0_30px_rgba(147,51,234,0.25)]">
                Hover me (Top)
              </button>
            }
          >
            <div className="space-y-2">
              <div className="text-sm font-semibold text-white">Full-surface Shine</div>
              <p className="text-xs text-zinc-400">
                A single-run 0.9s reflection sweeps diagonally across the entire popup every time you hover.
              </p>
            </div>
          </GlassHoverPopup>
        </div>

        {/* Decorative background gradient mesh (demo) */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(360px_200px_at_20%_20%,rgba(147,51,234,0.18),transparent_60%),radial-gradient(320px_200px_at_80%_75%,rgba(168,85,247,0.12),transparent_60%)]" />
        </div>
      </div>
    </main>
  )
}
