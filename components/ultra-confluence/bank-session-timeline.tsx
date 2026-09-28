"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Session = {
  id: "sydney" | "tokyo" | "frankfurt" | "london" | "newyork"
  label: string
  startUTC: number
  endUTC: number
  color: string
  tip: string
  dot: { top: string; left: string } // for world map dots
}

const SESSIONS: Session[] = [
  {
    id: "sydney",
    label: "Sydney",
    startUTC: 22,
    endUTC: 2,
    color: "from-fuchsia-700/50 to-fuchsia-500/30",
    tip: "Asia risk build-up, quieter liquidity.",
    dot: { top: "75%", left: "85%" },
  },
  {
    id: "tokyo",
    label: "Tokyo",
    startUTC: 0,
    endUTC: 6,
    color: "from-violet-700/50 to-violet-500/30",
    tip: "Asia accumulation; initial liquidity maps.",
    dot: { top: "58%", left: "88%" },
  },
  {
    id: "frankfurt",
    label: "Frankfurt",
    startUTC: 6,
    endUTC: 8,
    color: "from-purple-700/50 to-purple-500/30",
    tip: "Pre-London positioning; manipulation risk.",
    dot: { top: "40%", left: "52%" },
  },
  {
    id: "london",
    label: "London",
    startUTC: 8,
    endUTC: 12,
    color: "from-indigo-700/50 to-indigo-500/30",
    tip: "Liquidity hunt; expansion starts.",
    dot: { top: "38%", left: "48%" },
  },
  {
    id: "newyork",
    label: "New York",
    startUTC: 13,
    endUTC: 20,
    color: "from-blue-700/50 to-blue-500/30",
    tip: "Distribution; NYC reversals/continuations.",
    dot: { top: "40%", left: "22%" },
  },
]

function isInWindowUTC(hourUTC: number, startUTC: number, endUTC: number) {
  if (startUTC <= endUTC) return hourUTC >= startUTC && hourUTC < endUTC
  return hourUTC >= startUTC || hourUTC < endUTC
}

export function useCurrentSession(now: Date) {
  const hourUTC = now.getUTCHours()
  const minute = now.getUTCMinutes()
  const current = useMemo(() => SESSIONS.find((s) => isInWindowUTC(hourUTC, s.startUTC, s.endUTC)) ?? null, [hourUTC])

  const endHour = current ? (current.endUTC >= current.startUTC ? current.endUTC : current.endUTC + 24) : 24
  const minsNow = hourUTC * 60 + minute
  const minsEnd = (endHour % 24) * 60 + (current ? 0 : 0)
  const minutesLeft = current ? (minsEnd >= minsNow ? minsEnd - minsNow : 24 * 60 - (minsNow - minsEnd)) : 0

  return { current, hourUTC, minute, minutesLeft }
}

export function WorldMapSessions({ highlight }: { highlight: Session["id"] | null }) {
  return (
    <div className="relative h-28 rounded-xl overflow-hidden border border-zinc-800 bg-[radial-gradient(150px_80px_at_30%_60%,rgba(147,51,234,0.15),transparent),radial-gradient(120px_90px_at_70%_30%,rgba(59,130,246,0.15),transparent)]">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(hsla(0,0%,100%,0.06)_1px,transparent_1px),linear-gradient(90deg,hsla(0,0%,100%,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      {/* Curved longitude lines */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_50%,transparent_40%,hsla(0,0%,100%,0.06)_42%,transparent_44%)]" />
      </div>
      {/* Session dots */}
      {SESSIONS.map((s) => (
        <div key={s.id} className="absolute" style={{ top: s.dot.top, left: s.dot.left }}>
          <div
            className={cn(
              "h-2 w-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.6)]",
              highlight === s.id ? "bg-emerald-400" : "bg-zinc-400/70",
            )}
          />
          {highlight === s.id && (
            <motion.div
              layoutId="session-glow"
              className="absolute -inset-2 rounded-full"
              animate={{ boxShadow: ["0 0 0 rgba(16,185,129,0)", "0 0 24px rgba(16,185,129,0.45)"] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut" }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function BankSessionTimeline() {
  const [now, setNow] = useState<Date>(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  const hourUTC = now.getUTCHours()
  const minute = now.getUTCMinutes()
  const { current, minutesLeft } = useCurrentSession(now)
  const progressPct = ((hourUTC * 60 + minute) / (24 * 60)) * 100

  return (
    <div className="w-full space-y-3">
      <WorldMapSessions highlight={current?.id ?? null} />
      <div className="premium-glass-segment p-3">
        <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
          <span>Global Sessions (UTC)</span>
          <span className="text-zinc-400">
            UTC {hourUTC.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="relative h-10 rounded-md bg-zinc-900/40 border border-zinc-800 overflow-hidden">
          {/* Session bands */}
          <div className="absolute inset-0">
            {SESSIONS.map((s, idx) => {
              const startPct = (s.startUTC / 24) * 100
              const endPct = ((s.endUTC >= s.startUTC ? s.endUTC : s.endUTC + 24) / 24) * 100
              return (
                <div
                  key={s.id + idx}
                  className={cn("absolute top-0 bottom-0 bg-gradient-to-r opacity-50", s.color)}
                  style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
                  title={s.tip}
                />
              )
            })}
          </div>

          {/* Now indicator */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.7)]"
            initial={false}
            animate={{ left: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />

          {/* Labels */}
          <div className="absolute inset-0 grid grid-cols-5">
            {SESSIONS.map((s) => {
              const active = current?.id === s.id
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center justify-center text-[11px] font-medium px-1",
                    active ? "text-white" : "text-zinc-400",
                  )}
                  title={s.tip}
                >
                  {s.label}
                  {active && <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Countdown + focus */}
        {current && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-400">Ends in:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {Math.floor(minutesLeft / 60)}h {minutesLeft % 60}m
            </span>
            <span className="text-zinc-400">Focus now:</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-200 border border-purple-500/30">
              {current.id === "tokyo" && "Map Asia accumulation ranges and liquidity pools"}
              {current.id === "frankfurt" && "Watch manipulative pre-London moves"}
              {current.id === "london" && "Liquidity hunts and displacement"}
              {current.id === "newyork" && "Distribution; reversal/continuation windows"}
              {current.id === "sydney" && "Quiet buildup; prepare for Tokyo/London"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
