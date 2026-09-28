"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import type { Confluence } from "@/lib/analysis-data"
import { Info } from "lucide-react"
import { UltraConfluenceCard } from "@/components/ultra-confluence/ultra-confluence-card"

type PivotLinesConfluence = Confluence & {
  pivots: { r3: string; r2: string; r1: string; p: string; s1: string; s2: string; s3: string }
}

/**
 * Legacy Pivot Lines card — kept EXACTLY as-is per requirements.
 */
const CardWrapper = ({ children, item }: { children: React.ReactNode; item: Confluence }) => (
  <div
    className={cn(
      "w-[340px] rounded-xl p-4 flex flex-col",
      "bg-slate-grey/95 backdrop-blur-2xl border border-white/10 shadow-2xl",
    )}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 rounded-md bg-slate-800")}>
          {/* @ts-expect-error icon is a component on item */}
          <item.icon className={cn("w-5 h-5")} style={{ color: (item as any).color }} />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{(item as any).title}</h4>
          <p className="text-xs text-zinc-300">{(item as any).subtitle}</p>
        </div>
      </div>
      <div
        className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          (item as any).statusColor === "emerald" && "bg-emerald-500/20 text-emerald-400",
          (item as any).statusColor === "amber" && "bg-amber-500/20 text-amber-400",
          (item as any).statusColor === "cyan" && "bg-cyan-500/20 text-cyan-400",
        )}
      >
        {(item as any).status}
      </div>
    </div>
    {children}
    <div className="flex justify-between items-center mt-3">
      <span className="text-xs text-zinc-400">AI Confidence:</span>
      <span className={cn("font-bold text-xs")} style={{ color: (item as any).color }}>
        {(item as any).confidence}%
      </span>
    </div>
    <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden mt-1">
      <div
        className={cn("h-1.5 rounded-full")}
        style={{ width: `${(item as any).confidence}%`, backgroundColor: (item as any).color }}
      />
    </div>
  </div>
)

const PivotsCard = ({ item }: { item: PivotLinesConfluence }) => {
  const resistancePivots = [
    { label: "R3", value: item.pivots.r3 },
    { label: "R2", value: item.pivots.r2 },
    { label: "R1", value: item.pivots.r1, active: true },
  ]
  const supportPivots = [
    { label: "S1", value: item.pivots.s1, active: true },
    { label: "S2", value: item.pivots.s2 },
    { label: "S3", value: item.pivots.s3 },
  ]

  return (
    <CardWrapper item={item}>
      <div className="flex flex-col space-y-4 text-xs">
        <div className="flex gap-4">
          <div className="w-1/3 space-y-2 font-mono">
            {resistancePivots.map(({ label, value, active }) => (
              <div key={label} className={cn("font-bold", active ? "text-yellow-300" : "text-zinc-400")}>
                {label}{" "}
                <span className={cn("font-light", active ? "text-yellow-400/80" : "text-zinc-500")}>({value})</span>
              </div>
            ))}
          </div>
          <div className="w-2/3 text-zinc-300 space-y-1 border-l border-white/10 pl-3">
            <p className="font-bold text-white">Resistance Rules</p>
            <p>
              R1/S1 = <span className="font-semibold text-emerald-400">40%</span> Reversal Prob.
            </p>
            <p>
              R2/S2 = <span className="font-semibold text-amber-400">60%</span> Reversal Prob.
            </p>
            <p>
              R3/S3 = <span className="font-semibold text-red-400">80%</span> Reversal Prob.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-center border-y border-white/10 py-2">
          <div className={cn("font-bold text-zinc-400 font-mono")}>
            P <span className={cn("font-light text-zinc-500")}>({(item as any).pivots.p})</span>
          </div>
          <p className="text-zinc-300">Gives daily bias. Above = Bullish, Below = Bearish.</p>
        </div>

        <div className="flex gap-4">
          <div className="w-1/3 space-y-2 font-mono">
            {supportPivots.map(({ label, value, active }) => (
              <div key={label} className={cn("font-bold", active ? "text-yellow-300" : "text-zinc-400")}>
                {label}{" "}
                <span className={cn("font-light", active ? "text-yellow-400/80" : "text-zinc-500")}>({value})</span>
              </div>
            ))}
          </div>
          <div className="w-2/3 text-zinc-300 space-y-1 border-l border-white/10 pl-3">
            <p className="font-bold text-white">Support Rules</p>
            <p>Targets when price is in discount.</p>
            <p>High probability reversal zones.</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-3 mt-2">
          <p className="font-bold text-white mb-2 flex items-center gap-2">
            <Info size={14} /> Pivot Validity Rules (APM)
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <span className="text-emerald-400">Valid:</span> Prev. day move &gt; 60% APM.
            </li>
            <li>
              <span className="text-emerald-400">Valid:</span> Current APM must not exceed R3/S3.
            </li>
            <li>
              <span className="text-red-400">Invalid:</span> Prev. day move &lt; 60% APM.
            </li>
          </ul>
        </div>
      </div>
    </CardWrapper>
  )
}

/**
 * RichConfluenceCard:
 * - For every confluence EXCEPT "Pivot Lines", delegate to UltraConfluenceCard
 * - "Pivot Lines" stays with the legacy PivotsCard
 */
export const RichConfluenceCard = ({ item }: { item: Confluence }) => {
  const title = (item as any).title ?? (item as any).name ?? ""
  if (title === "Pivot Lines") {
    return <PivotsCard item={item as PivotLinesConfluence} />
  }
  return <UltraConfluenceCard id={(item as any).id} />
}
