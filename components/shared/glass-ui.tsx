"use client"

import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { BadgeCheck, CircleGauge, type LightbulbIcon as LucideProps } from "lucide-react"

/**
 * Small helpers to replicate the GLASS badge and button aesthetics seen in your screenshots.
 */

export function ConfidenceBadge({
  value = 86,
  className,
}: {
  value?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5",
        "text-[11px] font-semibold text-zinc-200",
        className,
      )}
    >
      <CircleGauge className="h-3.5 w-3.5 text-purple-300" />
      <span>{value}%</span>
    </div>
  )
}

export function RiskBadge({ level = "High", className }: { level?: "High" | "Medium" | "Low"; className?: string }) {
  const color =
    level === "High"
      ? "text-emerald-300 ring-emerald-500/20 bg-emerald-500/10"
      : level === "Medium"
        ? "text-amber-300 ring-amber-500/20 bg-amber-500/10"
        : "text-sky-300 ring-sky-500/20 bg-sky-500/10"
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        "border border-white/10 ring-1",
        color,
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      <span>{level}</span>
    </div>
  )
}

export function ViewForecastButton(props: ComponentProps<"button">) {
  const { className, ...rest } = props
  return (
    <button
      {...rest}
      className={cn(
        "w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-black",
        "bg-gradient-to-r from-purple-500 to-amber-300",
        "shadow-[0_14px_40px_-8px_rgba(147,51,234,0.6)]",
        "transition hover:shadow-[0_18px_56px_-8px_rgba(147,51,234,0.75)] active:scale-[0.99]",
        className,
      )}
    />
  )
}

export function MetricPill({
  icon: Icon,
  label,
  value,
  accent = "emerald",
}: {
  icon: (props: LucideProps) => JSX.Element
  label: string
  value: string
  accent?: "emerald" | "rose" | "zinc"
}) {
  const accentCls = accent === "emerald" ? "text-emerald-300" : accent === "rose" ? "text-rose-300" : "text-zinc-300"
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-3 backdrop-blur-md">
      <div className="mb-1 flex items-center gap-2 text-xs text-zinc-400">
        <Icon className="h-4 w-4 text-purple-300" />
        <span>{label}</span>
      </div>
      <div className={cn("font-semibold tracking-tight", accentCls)}>{value}</div>
    </div>
  )
}
