"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { BankSessionTimeline } from "./bank-session-timeline"
import { ULTRA_CONFLUENCES, type UltraConfluenceId } from "./types"
import {
  Info,
  Plus,
  Minus,
  Repeat,
  ScanLine,
  Hammer,
  TrendingUp,
  Droplets,
  Scale,
  Box,
  CalendarClock,
  Clock,
  FlipHorizontal2,
} from "lucide-react"

/* -----------------------------------------
   Shared tiny helpers
------------------------------------------*/
function useLiveNumber(initial: number, delta = 0.0006, ms = 3500) {
  const [value, setValue] = useState(initial)
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    const i = setInterval(
      () => {
        setValue((v) => {
          const next = +(v + (Math.random() - 0.5) * delta).toFixed(5)
          setPulse(true)
          const t = setTimeout(() => setPulse(false), 450)
          return next
        })
      },
      ms + Math.random() * ms,
    )
    return () => clearInterval(i)
  }, [delta, ms])
  return { value, pulse }
}

function LiveNumber({ value, pulse, className }: { value: number | string; pulse?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "digital-display font-mono tabular-nums text-[13px] text-white",
        pulse && "digits-flash",
        className,
      )}
    >
      {typeof value === "number" ? value.toString() : value}
    </span>
  )
}

function EduPill({ icon: Icon, label, animate }: { icon: any; label: string; animate?: any }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.03 }}
      className="premium-glass-segment flex items-center gap-2 px-2 py-1"
      animate={animate}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
    >
      <Icon className="w-3.5 h-3.5 text-purple-300" />
      <span className="text-[11px] text-zinc-300">{label}</span>
    </motion.div>
  )
}

/* -----------------------------------------
   Unique animation/hover/variants per card
------------------------------------------*/
const cardHoverVariants: Record<UltraConfluenceId, any> = {
  "htf-structure": { scale: 1.02, y: -8, rotateX: 2 },
  "liquidity-sweep": { scaleX: 1.03, y: -4 },
  bpr: { rotateY: 3, y: -6 },
  fvg: { scale: 1.015, y: -6, rotateX: 1.5 },
  ifvg: { scale: 1.015, y: -6, rotateX: -1.5 },
  "order-block": { y: -7, scale: 1.02 },
  "breaker-block": { y: -7, scale: 1.02, rotateZ: -0.5 },
  "bank-session": { y: -8, scale: 1.02 },
  po3: { y: -6, rotateZ: 0.6, scale: 1.02 },
  "opens-pd": { y: -5, scale: 1.015 },
}

const iconKeyframes: Record<UltraConfluenceId, any> = {
  "htf-structure": { rotate: [0, 10, 0, -10, 0] },
  "liquidity-sweep": { scale: [1, 1.2, 1] },
  bpr: { x: [0, 6, -6, 0] },
  fvg: { y: [0, -6, 0] },
  ifvg: { rotateY: [0, 180, 0] },
  "order-block": { y: [0, -3, 0] },
  "breaker-block": { rotateZ: [0, -12, 0] },
  "bank-session": { rotate: [0, 10, 0] },
  po3: { rotate: [0, 120, 240, 360] },
  "opens-pd": { rotate: [0, 5, -5, 0] },
}

const popupVariants: Record<UltraConfluenceId, { initial: any; animate: any; exit: any }> = {
  "htf-structure": { initial: { y: 12, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 12, opacity: 0 } },
  "liquidity-sweep": {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  bpr: { initial: { x: -12, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -12, opacity: 0 } },
  fvg: {
    initial: { rotateX: -10, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -10, opacity: 0 },
  },
  ifvg: {
    initial: { rotateY: -10, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -10, opacity: 0 },
  },
  "order-block": { initial: { y: -12, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -12, opacity: 0 } },
  "breaker-block": {
    initial: { rotateZ: -6, opacity: 0 },
    animate: { rotateZ: 0, opacity: 1 },
    exit: { rotateZ: -6, opacity: 0 },
  },
  "bank-session": { initial: { y: 10, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 10, opacity: 0 } },
  po3: { initial: { scale: 0.96, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.96, opacity: 0 } },
  "opens-pd": { initial: { x: 12, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 12, opacity: 0 } },
}

/* -----------------------------------------
   Visual tops
------------------------------------------*/
function FlowingTrendArrows() {
  return (
    <div className="relative h-20 overflow-hidden rounded-lg border border-zinc-800">
      <div className="absolute inset-0 bg-[radial-gradient(180px_100px_at_20%_60%,rgba(147,51,234,0.17),transparent),radial-gradient(180px_120px_at_70%_30%,rgba(59,130,246,0.14),transparent)]" />
      <div className="absolute inset-0">
        {[...Array(3)].map((_, row) => (
          <motion.div
            key={row}
            className="absolute left-0 right-0 flex gap-4"
            style={{ top: `${20 + row * 22}%` }}
            animate={{ x: ["-10%", "110%"] }}
            transition={{ duration: 6 + row, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            {Array.from({ length: 8 }).map((__, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="h-1 w-6 rounded bg-emerald-400/70 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-emerald-400" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StopHuntViz() {
  return (
    <div className="relative h-20 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:14px_100%]" />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-700" />
      {/* Spike */}
      <motion.div
        initial={{ x: "-10%" }}
        animate={{ x: ["-10%", "30%", "65%", "100%"] }}
        transition={{ times: [0, 0.35, 0.6, 1], duration: 4.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-0"
      >
        <div className="relative w-0.5 h-16 bg-rose-400/80">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.7)]" />
        </div>
      </motion.div>
      {/* Sweep label */}
      <motion.div
        className="absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/30"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Stop Hunt
      </motion.div>
    </div>
  )
}

function SlidingPremiumDiscount() {
  return (
    <div className="relative h-20 overflow-hidden rounded-lg border border-zinc-800">
      <motion.div
        className="absolute inset-0"
        animate={{ x: ["-10%", "0%", "10%", "0%"] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="absolute inset-y-0 left-0 w-1/2 bg-rose-500/10" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-emerald-500/10" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/40" />
      </motion.div>
      <div className="absolute bottom-1 left-2 text-[11px] text-rose-200">Premium</div>
      <div className="absolute bottom-1 right-2 text-[11px] text-emerald-300">Discount</div>
    </div>
  )
}

function GapFormation() {
  return (
    <div className="relative h-20 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
      {[0, 1].map((row) => (
        <motion.div
          key={row}
          className="absolute left-2 right-2 h-0.5 bg-zinc-700"
          style={{ top: `${40 + row * 10}%` }}
          animate={row === 0 ? { y: [0, -8, 0] } : { y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: row ? 0.6 : 0 }}
        />
      ))}
      <motion.div
        className="absolute left-1/3 right-1/3 top-[45%] bottom-[45%] bg-purple-500/20 border-y border-purple-400/30"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  )
}

function PO3Cycle() {
  return (
    <div className="relative h-20 overflow-hidden rounded-lg border border-zinc-800">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, 120, 240, 360] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border border-purple-500/40" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400" />
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-300" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-400" />
        </div>
      </motion.div>
      <div className="absolute bottom-1 inset-x-0 text-center text-[11px] text-zinc-300">
        Accumulation · Manipulation · Distribution
      </div>
    </div>
  )
}

/* -----------------------------------------
   Card component
------------------------------------------*/
type Props = { id: UltraConfluenceId | string }

export function UltraConfluenceCard({ id }: Props) {
  const [showDetails, setShowDetails] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useTransform(my, [-40, 40], [2.5, -2.5])
  const ry = useTransform(mx, [-40, 40], [-3, 3])
  const iconX = useTransform(mx, [-60, 60], [-6, 6])
  const iconY = useTransform(my, [-60, 60], [-6, 6])

  const meta = useMemo(() => ULTRA_CONFLUENCES.find((c) => c.id === (id as UltraConfluenceId)), [id])

  // Unknown id guard: render a minimal, non-crashing fallback
  if (!meta) {
    return (
      <div className="premium-glass-container ultra-premium-scenario-card bg-gradient-mesh floating-particles p-3 rounded-2xl relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[13px] font-semibold text-white">Unknown Confluence</div>
            <div className="text-[11px] text-zinc-400 break-all">No Ultra configuration found for id: {String(id)}</div>
          </div>
          <Badge className="bg-zinc-900/60 border border-zinc-700 text-[10px]">Interactive</Badge>
        </div>
        <div className="premium-glass-segment rounded-xl p-3">
          <div className="text-[12px] text-zinc-300">
            This confluence is not mapped to an Ultra card yet. The classic panel will be shown instead.
          </div>
        </div>
      </div>
    )
  }

  const onMouseMove = (e: React.MouseEvent) => {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    const x = e.clientX - (bounds.left + bounds.width / 2)
    const y = e.clientY - (bounds.top + bounds.height / 2)
    mx.set(x)
    my.set(y)
  }
  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  // Shared live numbers (demo)
  const d1 = useLiveNumber(1.335)
  const d2 = useLiveNumber(1.318)
  const d3 = useLiveNumber(1.328)
  const d4 = useLiveNumber(1.315)

  // BPR inputs
  const [hi, setHi] = useState("1.3350")
  const [lo, setLo] = useState("1.3150")
  const mid = useMemo(() => {
    const H = Number.parseFloat(hi)
    const L = Number.parseFloat(lo)
    return Number.isFinite(H) && Number.isFinite(L) ? ((H + L) / 2).toFixed(4) : "—"
  }, [hi, lo])

  // FVG gaps
  const [gapList, setGapList] = useState<Array<{ high: string; low: string; tf: string; side: "bullish" | "bearish" }>>(
    [{ high: "1.3270", low: "1.3240", tf: "15m", side: "bullish" }],
  )
  const addGap = () => setGapList((g) => [...g, { high: "", low: "", tf: "5m", side: "bullish" }])
  const removeGap = (i: number) => setGapList((g) => g.filter((_, idx) => idx !== i))

  // Unique top visuals
  function TopVisual() {
    if (id === "htf-structure") return <FlowingTrendArrows />
    if (id === "liquidity-sweep") return <StopHuntViz />
    if (id === "bpr") return <SlidingPremiumDiscount />
    if (id === "fvg" || id === "ifvg") return <GapFormation />
    if (id === "po3") return <PO3Cycle />
    if (id === "bank-session") return <BankSessionTimeline />
    return (
      <div className="relative h-20 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
        <div className="absolute inset-0 flex items-center justify-center text-[12px] text-zinc-400">
          {meta.description}
        </div>
      </div>
    )
  }

  // Icon mapper
  const Icon = {
    "htf-structure": TrendingUp,
    "liquidity-sweep": Droplets,
    bpr: Scale,
    fvg: ScanLine,
    ifvg: FlipHorizontal2,
    "order-block": Box,
    "breaker-block": Hammer,
    "bank-session": Clock,
    po3: Repeat,
    "opens-pd": CalendarClock,
  }[id] as any

  // Liquidity proximity bars
  const current = d3.value
  function LevelBar({
    label,
    value,
  }: {
    label: string
    value: number
  }) {
    const dist = Math.abs(value - current)
    const proximity = Math.max(0, 1 - dist * 100) // tune factor
    const glow = proximity > 0.6
    return (
      <div className="premium-glass-segment p-2">
        <div className="text-[11px] text-zinc-400">{label}</div>
        <div className="mt-1 flex items-center justify-between">
          <LiveNumber value={value} pulse={glow} />
          <div className="ml-2 flex-1 h-2 rounded bg-zinc-800 overflow-hidden">
            <motion.div
              className={cn("h-full rounded bg-emerald-500/50", glow && "shadow-[0_0_18px_rgba(16,185,129,0.6)]")}
              initial={false}
              animate={{ width: `${Math.round(proximity * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rx as any, rotateY: ry as any, transformStyle: "preserve-3d" }}
      className="premium-glass-container ultra-premium-scenario-card bg-gradient-mesh floating-particles p-3 rounded-2xl relative"
      whileHover={cardHoverVariants[id]}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            style={{ x: iconX as any, y: iconY as any }}
            animate={iconKeyframes[id]}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3.5, ease: "easeInOut" }}
          >
            <Icon className="w-4.5 h-4.5 text-purple-300" />
          </motion.div>
          <div>
            <div className="text-[13px] font-semibold text-white">{meta.name}</div>
            <div className="text-[11px] text-zinc-400">{meta.description}</div>
          </div>
        </div>
        <Badge className="bg-zinc-900/60 border border-zinc-700 text-[10px]">Interactive</Badge>
      </div>

      {/* TOP SECTION */}
      <div className="premium-glass-chart-container p-3 rounded-xl mb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Education</h4>
          <Info className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="mt-2">
          <TopVisual />
        </div>

        {/* Quick animated pills unique per confluence */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {id === "htf-structure" && (
            <>
              <EduPill icon={TrendingUp} label="BOS / CHoCH" animate={{ y: [0, -2, 0] }} />
              <EduPill icon={Repeat} label="Trend Alignment" animate={{ scale: [1, 1.03, 1] }} />
              <EduPill icon={CalendarClock} label="Risk On/Off" animate={{ rotate: [0, 4, 0] }} />
              <EduPill icon={Droplets} label="DXY Context" animate={{ x: [0, 3, 0] }} />
              <EduPill icon={ScanLine} label="Displacement" animate={{ opacity: [0.7, 1, 0.7] }} />
              <EduPill icon={Hammer} label="Mitigation" animate={{ rotateZ: [0, -6, 0] }} />
            </>
          )}
          {id === "liquidity-sweep" && (
            <>
              <EduPill icon={Droplets} label="Stop Hunts" animate={{ scale: [1, 1.08, 1] }} />
              <EduPill icon={Repeat} label="Engineered Liquidity" animate={{ rotate: [0, 10, 0] }} />
              <EduPill icon={ScanLine} label="Displacement After Sweep" animate={{ x: [0, -4, 0] }} />
            </>
          )}
          {id === "bpr" && (
            <>
              <EduPill icon={Scale} label="Premium / Discount" animate={{ x: [0, 5, -5, 0] }} />
              <EduPill icon={CalendarClock} label="Reference Range" animate={{ rotate: [0, 6, 0] }} />
              <EduPill icon={ScanLine} label="EQ (50%)" animate={{ y: [0, -3, 0] }} />
            </>
          )}
          {id === "fvg" && (
            <>
              <EduPill icon={ScanLine} label="3-Candle Imbalance" animate={{ y: [0, -4, 0] }} />
              <EduPill icon={Repeat} label="HTF vs LTF" animate={{ rotate: [0, 8, 0] }} />
              <EduPill icon={Box} label="Midpoint Tracking" animate={{ scale: [1, 1.04, 1] }} />
            </>
          )}
          {id === "ifvg" && (
            <>
              <EduPill icon={FlipHorizontal2} label="Inversion Rules" animate={{ rotateY: [0, 180, 0] }} />
              <EduPill icon={Hammer} label="Retest & Flip" animate={{ rotateZ: [0, -8, 0] }} />
              <EduPill icon={ScanLine} label="Support/Resistance" animate={{ x: [0, -3, 0] }} />
            </>
          )}
          {id === "order-block" && (
            <>
              <EduPill icon={Box} label="Origin Candle" animate={{ y: [0, -4, 0] }} />
              <EduPill icon={Repeat} label="Displacement Follow" animate={{ x: [0, 4, 0] }} />
              <EduPill icon={Hammer} label="Mitigation" animate={{ rotate: [0, -6, 0] }} />
            </>
          )}
          {id === "breaker-block" && (
            <>
              <EduPill icon={Hammer} label="Failed OB Flip" animate={{ rotateZ: [0, -10, 0] }} />
              <EduPill icon={Droplets} label="After Sweep" animate={{ scale: [1, 1.06, 1] }} />
              <EduPill icon={Repeat} label="Retest Behavior" animate={{ y: [0, -3, 0] }} />
            </>
          )}
          {id === "po3" && (
            <>
              <EduPill icon={Box} label="Accumulation" animate={{ scale: [1, 1.05, 1] }} />
              <EduPill icon={Droplets} label="Manipulation" animate={{ rotate: [0, 8, 0] }} />
              <EduPill icon={Repeat} label="Distribution" animate={{ x: [0, 3, 0] }} />
            </>
          )}
          {id === "opens-pd" && (
            <>
              <EduPill icon={CalendarClock} label="Weekly Open" animate={{ y: [0, -3, 0] }} />
              <EduPill icon={CalendarClock} label="Daily Open" animate={{ y: [0, -3, 0] }} />
              <EduPill icon={Scale} label="Premium / Discount" animate={{ x: [0, -5, 0] }} />
            </>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="premium-glass-segment rounded-xl p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Live + Inputs</h4>
          <Info className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="mt-2 space-y-3">
          {id === "htf-structure" && (
            <div className="grid grid-cols-3 gap-2">
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Market Structure</div>
                <div className="mt-1 text-sm font-semibold text-white">Bullish Bias</div>
                <div className="text-[11px] text-emerald-400">BOS up · HLs intact</div>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Latest BOS</div>
                <div className="mt-1">
                  <LiveNumber value={d1.value} pulse={d1.pulse} />
                </div>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] border border-emerald-500/30">
                  Active BOS
                </div>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Recent CHoCH</div>
                <div className="mt-1">
                  <LiveNumber value={d2.value} pulse={d2.pulse} />
                </div>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] border border-amber-500/30">
                  Watch Flip
                </div>
              </div>
            </div>
          )}

          {id === "liquidity-sweep" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <LevelBar label="Weekly High" value={d1.value} />
              <LevelBar label="Weekly Low" value={d2.value} />
              <LevelBar label="Daily High" value={d3.value} />
              <LevelBar label="Daily Low" value={d4.value} />
              <LevelBar label="Asia High" value={d3.value} />
              <LevelBar label="Asia Low" value={d4.value} />
            </div>
          )}

          {id === "bpr" && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="premium-glass-segment p-2">
                  <div className="text-[11px] text-zinc-400">High</div>
                  <Input
                    className="premium-glass-input mt-1 h-8 text-xs active:scale-95 transition"
                    value={hi}
                    onChange={(e) => setHi(e.target.value)}
                  />
                </div>
                <div className="premium-glass-segment p-2">
                  <div className="text-[11px] text-zinc-400">Low</div>
                  <Input
                    className="premium-glass-input mt-1 h-8 text-xs active:scale-95 transition"
                    value={lo}
                    onChange={(e) => setLo(e.target.value)}
                  />
                </div>
                <div className="premium-glass-segment p-2">
                  <div className="text-[11px] text-zinc-400">Midpoint (50%)</div>
                  <div className="mt-1">
                    <LiveNumber value={mid} pulse />
                  </div>
                </div>
              </div>
              {/* Animated line scan */}
              <div className="relative h-10 rounded-md bg-zinc-950/40 border border-zinc-800 overflow-hidden">
                <motion.div
                  key={mid}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                />
                <div className="absolute inset-0">
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/30" />
                </div>
              </div>
            </>
          )}

          {(id === "fvg" || id === "ifvg") && (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {gapList.map((g, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    className="premium-glass-segment p-2 grid grid-cols-5 gap-2"
                  >
                    <div>
                      <div className="text-[11px] text-zinc-400">Gap High</div>
                      <Input
                        className="premium-glass-input mt-1 h-8 text-xs active:scale-95 transition"
                        value={g.high}
                        onChange={(e) => {
                          setGapList((list) =>
                            list.map((it, idx) => (idx === i ? { ...it, high: e.target.value } : it)),
                          )
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[11px] text-zinc-400">Gap Low</div>
                      <Input
                        className="premium-glass-input mt-1 h-8 text-xs active:scale-95 transition"
                        value={g.low}
                        onChange={(e) => {
                          setGapList((list) => list.map((it, idx) => (idx === i ? { ...it, low: e.target.value } : it)))
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[11px] text-zinc-400">Timeframe</div>
                      <Select
                        value={g.tf}
                        onValueChange={(v) =>
                          setGapList((list) => list.map((it, idx) => (idx === i ? { ...it, tf: v } : it)))
                        }
                      >
                        <SelectTrigger className="premium-glass-input mt-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="premium-glass-dropdown">
                          {["1m", "5m", "15m", "1h", "4h", "1d"].map((tf) => (
                            <SelectItem key={tf} value={tf}>
                              {tf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center gap-1 bg-zinc-900/40 border border-zinc-800 rounded-md p-1">
                        {(["bullish", "bearish"] as const).map((side) => (
                          <button
                            key={side}
                            className={cn(
                              "px-2 py-1 text-[11px] rounded hover:bg-zinc-800 transition",
                              g.side === side
                                ? "bg-purple-500/20 border border-purple-500/30 text-purple-200"
                                : "text-zinc-300",
                            )}
                            onClick={() =>
                              setGapList((list) => list.map((it, idx) => (idx === i ? { ...it, side } : it)))
                            }
                          >
                            {side}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        variant="outline"
                        className="premium-glass-action-button h-8 px-3 bg-transparent"
                        onClick={() => removeGap(i)}
                      >
                        <Minus className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button className="liquid-glass-button h-9" onClick={addGap}>
                <Plus className="w-4 h-4 mr-2" /> Add Gap
              </Button>
            </div>
          )}

          {(id === "order-block" || id === "breaker-block") && (
            <div className="grid grid-cols-3 gap-2">
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Level</div>
                <Input
                  className="premium-glass-input mt-1 h-8 text-xs active:scale-95 transition"
                  placeholder="e.g., 1.3240"
                />
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Timeframe</div>
                <Select defaultValue="15m">
                  <SelectTrigger className="premium-glass-input mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="premium-glass-dropdown">
                    {["5m", "15m", "1h", "4h", "1d"].map((tf) => (
                      <SelectItem key={tf} value={tf}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Status</div>
                <div className="mt-1 text-xs text-emerald-400">Active · Untested</div>
              </div>
            </div>
          )}

          {id === "po3" && (
            <div className="grid grid-cols-3 gap-2">
              <div className="premium-glass-segment p-2 relative overflow-hidden">
                <div className="text-[11px] text-zinc-400">Current Phase</div>
                <div className="mt-1 text-sm font-semibold text-white">Manipulation</div>
                {/* particles */}
                <motion.div
                  className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full bg-amber-500/10"
                  animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Asia Box High</div>
                <div className="mt-1">
                  <LiveNumber value={d1.value} pulse={d1.pulse} />
                </div>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Asia Box Low</div>
                <div className="mt-1">
                  <LiveNumber value={d2.value} pulse={d2.pulse} />
                </div>
              </div>
            </div>
          )}

          {id === "opens-pd" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Weekly Open</div>
                <div className="mt-1">
                  <LiveNumber value="1.3210" pulse />
                </div>
                <div className="text-[11px] text-emerald-400">Premium</div>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">Daily Open</div>
                <div className="mt-1">
                  <LiveNumber value="1.3235" pulse />
                </div>
                <div className="text-[11px] text-rose-300">Discount</div>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">PW EQ</div>
                <div className="mt-1">
                  <LiveNumber value={d3.value} pulse={d3.pulse} />
                </div>
              </div>
              <div className="premium-glass-segment p-2">
                <div className="text-[11px] text-zinc-400">PD EQ</div>
                <div className="mt-1">
                  <LiveNumber value={d4.value} pulse={d4.pulse} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature detail popup per-confluence with unique animation */}
      <div className="mt-3 flex justify-end">
        <Button
          className="liquid-glass-button h-9"
          onMouseEnter={() => setShowDetails(true)}
          onMouseLeave={() => setShowDetails(false)}
        >
          Learn More
        </Button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            {...popupVariants[id]}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className="absolute left-3 right-3 -top-2 -translate-y-full premium-glass-modal p-4 z-20"
          >
            <div className="text-sm font-semibold mb-1">{meta.name} · Details</div>
            <div className="text-xs text-zinc-300">
              Deeper guidance tailored to this confluence. Keep your cursor inside to hold this window open.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
