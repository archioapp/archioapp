"use client"

/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  MacroAlertSheet — DESIGN LAB MASTERPIECE VARIANT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Row list (collapsed)  →  click row  →  MacroEventTheater (full reveal)
 *
 *  MacroEventTheater is a cinematic, multi-layer composition:
 *   ▸ Layered backdrop (ink wash + severity radial pulse + 60° aurora bar)
 *   ▸ Severity rail (top hairline), corner brackets (tactical instrumentation)
 *   ▸ Breadcrumb + pulsing severity badge + scoped Back control
 *   ▸ 60/40 hero split:
 *        LEFT  · eyebrow · split-reveal title · UTC/window meta ·
 *                MASSIVE 7-seg style live countdown · plan-rule echo
 *        RIGHT · animated vol arc gauge with sweep + glow tip ·
 *                expected move readout · last-8-prints distribution sparks
 *   ▸ Intel triptych — Why this matters · Setup compatibility · Last 4 prints
 *   ▸ Affected pairs theater — large chips, magnetic pop, deviation tickers
 *   ▸ Action bar · Recommendation footer
 *
 *  Every entrance is choreographed. Nothing pops in flat — every layer
 *  arrives in sequence, on a single shared easing curve.
 * ═════════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Brain,
  Calendar,
  Crosshair,
  History,
  Pin,
  Sparkles,
  Triangle,
  VolumeX,
} from "lucide-react"

import {
  MACRO_EVENTS,
  parseHM,
} from "@/components/dashboard/vantary/vantary-modules"
import { DAILY_PLAN } from "@/components/dashboard/dashboard-data"
import { VANTARY, RADIUS_V, EASE_V } from "@/components/dashboard/vantary/vantary-theme"

type MacroEvent = (typeof MACRO_EVENTS)[number]

/* ── Severity → RGB triplet (drives every accent in the theater) ───────── */
const SEV_RGB = {
  high:   "239, 68, 68",   // red-500
  medium: "251, 146, 60",  // orange-400
  low:    "45, 212, 191",  // teal-400
} as const

function sevRgb(e: MacroEvent): string {
  return (SEV_RGB as Record<string, string>)[e.impact] ?? SEV_RGB.medium
}
function sevLabel(e: MacroEvent): string {
  return e.impact === "high" ? "HIGH IMPACT" : e.impact === "medium" ? "MEDIUM IMPACT" : "LOW IMPACT"
}

/* ── Mono caps token used everywhere ───────────────────────────────────── */
const MONO_EYEBROW: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 10,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: VANTARY.ash,
}

/* ═════════════════════════════════════════════════════════════════════════
   1.  ROW (collapsed state)
   ═════════════════════════════════════════════════════════════════════════ */

function MacroRowLab({ event, onOpen }: { event: MacroEvent; onOpen: () => void }) {
  const [utcHour] = useState(() => {
    const d = new Date()
    return d.getUTCHours() + d.getUTCMinutes() / 60
  })
  const hoursUntil = parseHM(event.time) - utcHour
  const isPast = hoursUntil <= -0.05
  const isImminent = !isPast && hoursUntil <= 0.5
  const rgb = sevRgb(event)

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${event.event} details`}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.18, ease: EASE_V }}
      className="relative mb-2 w-full overflow-hidden text-left group/macrorow"
      style={{
        background: "transparent",
        borderRadius: RADIUS_V.inner,
        padding: "16px 18px",
      }}
    >
      {/* hover floor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/macrorow:opacity-100"
        style={{
          background: `linear-gradient(90deg, rgba(${rgb},0.06) 0%, transparent 70%)`,
          borderRadius: RADIUS_V.inner,
          border: `1px solid rgba(${rgb}, 0.20)`,
        }}
      />
      {/* leading severity bar */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
        style={{
          background: `linear-gradient(180deg, rgba(${rgb},0.85), rgba(${rgb},0.15))`,
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 flex items-center gap-5">
        {/* UTC timestamp */}
        <div className="flex-none w-16">
          <div style={{ ...MONO_EYEBROW, fontSize: 9, color: VANTARY.ashSoft }}>{event.time}</div>
          <div style={{ ...MONO_EYEBROW, fontSize: 8, color: VANTARY.ashGhost }}>UTC</div>
        </div>

        {/* event title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Triangle size={9} fill={`rgb(${rgb})`} strokeWidth={0} style={{ opacity: 0.9 }} />
            <span
              className="truncate"
              style={{
                color: VANTARY.paper,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {event.event}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2" style={MONO_EYEBROW}>
            <span style={{ color: `rgb(${rgb})` }}>{event.currency}</span>
            <span style={{ color: VANTARY.ashGhost }}>·</span>
            <span style={{ color: VANTARY.ashSoft }}>{sevLabel(event)}</span>
          </div>
        </div>

        {/* right rail status */}
        <div className="flex-none flex items-center gap-3">
          {isImminent && (
            <span
              className="px-2 py-1 rounded-full"
              style={{
                ...MONO_EYEBROW,
                fontSize: 9,
                color: `rgb(${rgb})`,
                background: `rgba(${rgb}, 0.10)`,
                border: `1px solid rgba(${rgb}, 0.30)`,
              }}
            >
              IMMINENT
            </span>
          )}
          <ArrowUpRight
            size={14}
            style={{ color: VANTARY.ashSoft }}
            className="transition-transform duration-200 group-hover/macrorow:translate-x-0.5 group-hover/macrorow:-translate-y-0.5"
          />
        </div>
      </div>
    </motion.button>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   2.  COUNTDOWN (massive 7-seg-style hero clock)
   ═════════════════════════════════════════════════════════════════════════ */

function useNow() {
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return new Date()
}

function HeroCountdown({ targetHm, rgb }: { targetHm: string; rgb: string }) {
  const now = useNow()
  const target = parseHM(targetHm) * 3600
  const cur = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()
  let delta = Math.max(0, target - cur)
  // wrap to next day if past
  if (target - cur < 0) delta = target - cur + 86400

  const hh = Math.floor(delta / 3600)
  const mm = Math.floor((delta % 3600) / 60)
  const ss = delta % 60

  return (
    <div className="flex items-end gap-4 select-none">
      <div className="flex items-end">
        <DigitGroup value={hh.toString().padStart(2, "0")} rgb={rgb} />
        <BreathColon rgb={rgb} />
        <DigitGroup value={mm.toString().padStart(2, "0")} rgb={rgb} />
        <BreathColon rgb={rgb} />
        <DigitGroup value={ss.toString().padStart(2, "0")} rgb={rgb} small />
      </div>
      <div className="pb-3 flex flex-col">
        <span style={{ ...MONO_EYEBROW, fontSize: 9, color: `rgb(${rgb})` }}>UNTIL</span>
        <span style={{ ...MONO_EYEBROW, fontSize: 9, color: VANTARY.ashSoft }}>RELEASE</span>
      </div>
    </div>
  )
}

function DigitGroup({ value, rgb, small }: { value: string; rgb: string; small?: boolean }) {
  return (
    <div className="flex">
      {value.split("").map((d, i) => (
        <Digit key={`${i}-${d}`} d={d} rgb={rgb} small={small} />
      ))}
    </div>
  )
}

function Digit({ d, rgb, small }: { d: string; rgb: string; small?: boolean }) {
  const size = small ? 44 : 84
  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: small ? 28 : 52, height: size }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={d}
          initial={{ y: -size * 0.6, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: size * 0.6, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: EASE_V }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: small ? 42 : 78,
            fontWeight: 200,
            letterSpacing: "-0.04em",
            color: VANTARY.paper,
            textShadow: `0 0 24px rgba(${rgb}, 0.25)`,
            lineHeight: 1,
          }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function BreathColon({ rgb }: { rgb: string }) {
  return (
    <motion.span
      animate={{ opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 64,
        fontWeight: 200,
        color: `rgb(${rgb})`,
        margin: "0 4px",
        lineHeight: 1,
        alignSelf: "center",
        textShadow: `0 0 20px rgba(${rgb}, 0.6)`,
      }}
    >
      :
    </motion.span>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   3.  VOL ARC GAUGE (animated SVG sweep)
   ═════════════════════════════════════════════════════════════════════════ */

function VolArcGauge({ multiplier, rgb }: { multiplier: number; rgb: string }) {
  // Map 0×–4× to a 240° arc starting from 150°
  const cap = 4
  const pct = Math.min(1, multiplier / cap)
  const startAngle = 150
  const sweep = 240
  const endAngle = startAngle + sweep * pct

  // SVG arc geometry — 160x160 viewBox, radius 64, center 80
  const R = 64
  const cx = 80
  const cy = 80
  const polar = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180
    return [cx + R * Math.cos(rad), cy + R * Math.sin(rad)] as const
  }
  const [trackSx, trackSy] = polar(startAngle)
  const [trackEx, trackEy] = polar(startAngle + sweep)
  const [fillEx, fillEy] = polar(endAngle)
  const largeArc = sweep > 180 ? 1 : 0
  const fillLarge = sweep * pct > 180 ? 1 : 0

  const trackPath = `M ${trackSx} ${trackSy} A ${R} ${R} 0 ${largeArc} 1 ${trackEx} ${trackEy}`
  const fillPath = `M ${trackSx} ${trackSy} A ${R} ${R} 0 ${fillLarge} 1 ${fillEx} ${fillEy}`

  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      <svg viewBox="0 0 160 160" width="200" height="200">
        <defs>
          <linearGradient id="vol-arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgba(${rgb}, 0.4)`} />
            <stop offset="60%" stopColor={`rgb(${rgb})`} />
            <stop offset="100%" stopColor={`rgba(${rgb}, 0.9)`} />
          </linearGradient>
          <filter id="vol-arc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* track */}
        <path
          d={trackPath}
          stroke={`rgba(${rgb}, 0.08)`}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* tick marks every 1× */}
        {[0, 1, 2, 3, 4].map((tick) => {
          const a = startAngle + sweep * (tick / cap)
          const [x1, y1] = polar(a)
          const rad = ((a - 90) * Math.PI) / 180
          const x2 = cx + (R + 8) * Math.cos(rad)
          const y2 = cy + (R + 8) * Math.sin(rad)
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={tick === Math.floor(multiplier) ? `rgba(${rgb}, 0.8)` : `rgba(${rgb}, 0.15)`}
              strokeWidth="1"
            />
          )
        })}
        {/* animated fill arc */}
        <motion.path
          d={fillPath}
          stroke="url(#vol-arc-grad)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#vol-arc-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE_V, delay: 0.35 }}
        />
        {/* tip dot */}
        <motion.circle
          cx={fillEx}
          cy={fillEy}
          r="4.5"
          fill={`rgb(${rgb})`}
          filter="url(#vol-arc-glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_V, delay: 1.35 }}
        />
      </svg>
      {/* center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ ...MONO_EYEBROW, fontSize: 8, color: VANTARY.ashSoft }}>EXPECTED VOL</span>
        <motion.span
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1.0, ease: EASE_V }}
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 36,
            fontWeight: 250,
            letterSpacing: "-0.04em",
            color: VANTARY.paper,
            textShadow: `0 0 24px rgba(${rgb}, 0.45)`,
            lineHeight: 1.05,
          }}
        >
          {multiplier.toFixed(1)}×
        </motion.span>
        <span style={{ ...MONO_EYEBROW, fontSize: 8, color: VANTARY.ashGhost, marginTop: 2 }}>
          VS 30D BASELINE
        </span>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   4.  HISTORICAL PRINT DISTRIBUTION (stem chart)
   ═════════════════════════════════════════════════════════════════════════ */

function PrintDistribution({ rgb }: { rgb: string }) {
  // deterministic-looking historical prints (pips deviation)
  const prints = useMemo(
    () => [
      { v: 12, label: "P8" },
      { v: -8, label: "P7" },
      { v: 28, label: "P6" },
      { v: -22, label: "P5" },
      { v: 14, label: "P4" },
      { v: 36, label: "P3" },
      { v: -6, label: "P2" },
      { v: 42, label: "P1" },
    ],
    [],
  )
  const max = 48
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={MONO_EYEBROW}>LAST 8 PRINTS · ±PIPS</span>
        <span style={{ ...MONO_EYEBROW, color: VANTARY.ashGhost }}>EUR/USD</span>
      </div>
      <div className="relative h-[72px] flex items-center gap-3">
        {/* zero line */}
        <span
          aria-hidden
          className="absolute left-0 right-0 h-px"
          style={{ background: `rgba(${rgb}, 0.18)`, top: "50%" }}
        />
        {prints.map((p, i) => {
          const positive = p.v >= 0
          const heightPct = (Math.abs(p.v) / max) * 100
          return (
            <div key={i} className="relative flex-1 h-full flex items-center justify-center">
              <motion.span
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${heightPct}%`, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.06, ease: EASE_V }}
                className="absolute w-1.5 rounded-full"
                style={{
                  background: `linear-gradient(180deg, rgb(${rgb}), rgba(${rgb}, 0.4))`,
                  boxShadow: `0 0 10px rgba(${rgb}, 0.5)`,
                  top: positive ? "50%" : undefined,
                  bottom: positive ? undefined : "50%",
                  transform: positive ? "translateY(-100%)" : "translateY(100%)",
                }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 + i * 0.04 }}
                className="absolute"
                style={{
                  ...MONO_EYEBROW,
                  fontSize: 8,
                  color: VANTARY.ashGhost,
                  bottom: -16,
                }}
              >
                {p.label}
              </motion.span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   5.  SPLIT-REVEAL TITLE
   ═════════════════════════════════════════════════════════════════════════ */

function HeroTitle({ text }: { text: string }) {
  const words = text.split(" ")
  return (
    <h1
      className="flex flex-wrap gap-x-3 gap-y-1"
      style={{
        fontSize: 52,
        fontWeight: 300,
        letterSpacing: "-0.025em",
        lineHeight: 1.02,
        color: VANTARY.paper,
      }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.18 + i * 0.06, ease: EASE_V }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   6.  INTEL CARD
   ═════════════════════════════════════════════════════════════════════════ */

function IntelCard({
  icon: Icon,
  eyebrow,
  body,
  rgb,
  delay,
}: {
  icon: typeof Brain
  eyebrow: string
  body: React.ReactNode
  rgb: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, delay, ease: EASE_V }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden"
      style={{
        background: "rgba(20, 27, 33, 0.55)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: `1px solid rgba(255,255,255,0.04)`,
        borderRadius: RADIUS_V.inner,
        padding: "18px 18px 20px",
      }}
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.5), transparent)`,
        }}
      />
      <span
        aria-hidden
        className="absolute top-4 right-4 w-1 h-1 rounded-full"
        style={{ background: `rgb(${rgb})`, boxShadow: `0 0 8px rgba(${rgb}, 0.7)` }}
      />
      <div className="flex items-center gap-2 mb-3">
        <Icon size={11} style={{ color: `rgb(${rgb})` }} />
        <span style={MONO_EYEBROW}>{eyebrow}</span>
      </div>
      <div style={{ color: VANTARY.paperDim, fontSize: 13, lineHeight: 1.55 }}>{body}</div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   7.  AFFECTED PAIR CHIP
   ═════════════════════════════════════════════════════════════════════════ */

function PairChip({
  pair,
  delta,
  hot,
  rgb,
  delay,
}: {
  pair: string
  delta: string
  hot?: boolean
  rgb: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE_V }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="relative overflow-hidden group/chip cursor-default"
      style={{
        background: hot
          ? `linear-gradient(135deg, rgba(${rgb}, 0.12), rgba(${rgb}, 0.04))`
          : "rgba(255,255,255,0.025)",
        border: hot ? `1px solid rgba(${rgb}, 0.35)` : "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS_V.chip,
        padding: "10px 14px",
        minWidth: 110,
      }}
    >
      {hot && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-[10px]"
          animate={{ opacity: [0.0, 0.25, 0.0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle at 0% 0%, rgba(${rgb}, 0.5), transparent 60%)`,
          }}
        />
      )}
      <div className="relative flex flex-col">
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            color: hot ? VANTARY.paper : VANTARY.paperDim,
            letterSpacing: "0.02em",
          }}
        >
          {pair}
        </span>
        <span
          style={{
            ...MONO_EYEBROW,
            fontSize: 9,
            color: hot ? `rgb(${rgb})` : VANTARY.ashSoft,
            marginTop: 2,
          }}
        >
          {delta}
        </span>
      </div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   8.  MACRO EVENT THEATER (the masterpiece)
   ═════════════════════════════════════════════════════════════════════════ */

const enter: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", scale: 0.98 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.55, ease: EASE_V },
  },
  exit: { opacity: 0, filter: "blur(8px)", scale: 0.99, transition: { duration: 0.25 } },
}

function MacroEventTheater({ event, onBack }: { event: MacroEvent; onBack: () => void }) {
  const rgb = sevRgb(event)
  const typicalMoveStr = (event as any).typicalMove ?? "±20p"
  const expectedVolStr = (event as any).expectedVol ?? "1.6x"
  const typicalPips = useMemo(() => {
    const m = typicalMoveStr.match(/[\d.]+/)
    return m ? Number.parseInt(m[0]) : 18
  }, [typicalMoveStr])
  const volMultiplier = useMemo(() => {
    const m = expectedVolStr.match(/[\d.]+/)
    return m ? Number.parseFloat(m[0]) : 1.5
  }, [expectedVolStr])

  // Synth deviation strings per pair so chips have unique values.
  const pairDeltas = useMemo(() => {
    return (event.affectedPairs ?? []).map((p, i) => {
      const base = typicalPips
      const dev = i === 0 ? `+${base}p` : i === 1 ? `−${Math.round(base * 0.45)}p` : `+${Math.round(base * 1.18)}p`
      return { pair: p, delta: dev, hot: i === 0 }
    })
  }, [event.affectedPairs, typicalPips])

  const recommend =
    event.impact === "high"
      ? `Stand down 30 minutes before ${event.event.split(" ")[0]}. Re-enter on post-event displacement only — your post-news continuation setups have averaged 2.8R historically.`
      : event.impact === "medium"
        ? `Reduce position size by 50% if you must trade through the release. Otherwise wait for the first 5-min candle to close before initiating.`
        : `Watchable. No plan restriction — but expect noise around the print.`

  return (
    <motion.div
      key={event.id}
      variants={enter}
      initial="hidden"
      animate="show"
      exit="exit"
      className="relative overflow-hidden"
      style={{
        background: VANTARY.ink,
        borderRadius: RADIUS_V.cardLg,
        border: `1px solid rgba(255,255,255,0.04)`,
        padding: 0,
      }}
    >
      {/* ── Layered backdrop ─────────────────────────────────────────────── */}
      {/* layer A · ink wash */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 100% 0%, rgba(${rgb}, 0.18), transparent 55%), radial-gradient(80% 60% at 0% 100%, rgba(${rgb}, 0.10), transparent 50%)`,
        }}
      />
      {/* layer B · severity pulse */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.3, 0.65, 0.3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(60% 40% at 80% 20%, rgba(${rgb}, 0.20), transparent 60%)`,
        }}
      />
      {/* layer C · 60° aurora bar */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-y-12 -left-32 right-1/3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{
          background: `linear-gradient(60deg, transparent 30%, rgba(${rgb}, 0.06) 50%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      {/* layer D · top severity hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.6), transparent)`,
        }}
      />
      {/* layer E · grid */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(${rgb},1) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},1) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: "-1px -1px",
          maskImage: "radial-gradient(ellipse at top right, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at top right, black 30%, transparent 75%)",
        }}
      />
      {/* corner brackets */}
      <CornerBrackets rgb={rgb} />

      {/* ── Top rail ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 px-8 pt-6 pb-4 flex items-center justify-between">
        <motion.button
          type="button"
          onClick={onBack}
          aria-label="All events"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE_V }}
          whileHover={{ x: -2 }}
          className="flex items-center gap-1.5"
          style={{
            ...MONO_EYEBROW,
            color: VANTARY.ash,
            padding: "6px 10px 6px 8px",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: RADIUS_V.pill,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <ArrowLeft size={10} />
          <span>ALL EVENTS</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2"
          style={MONO_EYEBROW}
        >
          <span>MACRO</span>
          <span style={{ color: VANTARY.ashGhost }}>/</span>
          <span style={{ color: `rgb(${rgb})` }}>{event.currency}</span>
          <span style={{ color: VANTARY.ashGhost }}>/</span>
          <span>{event.event.split(" ")[0].toUpperCase()}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_V }}
          className="relative flex items-center gap-2 px-3 py-1.5"
          style={{
            background: `rgba(${rgb}, 0.10)`,
            border: `1px solid rgba(${rgb}, 0.30)`,
            borderRadius: RADIUS_V.pill,
          }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `rgb(${rgb})`, boxShadow: `0 0 8px rgba(${rgb}, 0.9)` }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{ ...MONO_EYEBROW, color: `rgb(${rgb})` }}>{sevLabel(event)}</span>
        </motion.div>
      </div>

      {/* ── Hero split ───────────────────────────────────────────────────── */}
      <div className="relative z-10 px-8 pt-6 pb-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* LEFT */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            style={MONO_EYEBROW}
            className="mb-3"
          >
            <span style={{ color: `rgb(${rgb})` }}>{event.currency}</span>
            <span style={{ color: VANTARY.ashGhost, margin: "0 8px" }}>·</span>
            <span>{event.time} UTC</span>
            <span style={{ color: VANTARY.ashGhost, margin: "0 8px" }}>·</span>
            <span style={{ color: VANTARY.ashSoft }}>POLICY · SCHEDULED</span>
          </motion.div>

          <HeroTitle text={event.event} />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-8"
          >
            <HeroCountdown targetHm={event.time} rgb={rgb} />
          </motion.div>

          {/* plan-rule echo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease: EASE_V }}
            className="relative mt-9 overflow-hidden"
            style={{
              background: `linear-gradient(90deg, rgba(${rgb}, 0.08), rgba(${rgb}, 0.02))`,
              border: `1px solid rgba(${rgb}, 0.25)`,
              borderRadius: RADIUS_V.inner,
              padding: "14px 16px 16px",
            }}
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ background: `rgb(${rgb})`, boxShadow: `0 0 8px rgba(${rgb}, 0.6)` }}
            />
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle size={11} style={{ color: `rgb(${rgb})` }} />
              <span style={{ ...MONO_EYEBROW, color: `rgb(${rgb})` }}>PLAN RULE · ACTIVE</span>
            </div>
            <div style={{ color: VANTARY.paper, fontSize: 13.5, lineHeight: 1.55 }}>
              No trading 30 minutes before · affects{" "}
              <span style={{ color: `rgb(${rgb})` }}>
                {DAILY_PLAN.focusPairs.join(" · ")}
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center lg:items-end gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_V }}
          >
            <VolArcGauge multiplier={volMultiplier} rgb={rgb} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.15, ease: EASE_V }}
            className="flex items-baseline gap-2"
          >
            <span style={MONO_EYEBROW}>TYPICAL MOVE</span>
            <span
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 24,
                fontWeight: 250,
                letterSpacing: "-0.03em",
                color: VANTARY.paper,
              }}
            >
              {typicalMoveStr}
            </span>
            <span style={{ ...MONO_EYEBROW, color: VANTARY.ashGhost }}>
              {event.affectedPairs?.[0] ?? ""}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3, ease: EASE_V }}
            className="w-full"
          >
            <PrintDistribution rgb={rgb} />
          </motion.div>
        </div>
      </div>

      {/* ── Hairline ─────────────────────────────────────────────────────── */}
      <span
        aria-hidden
        className="relative z-10 block mx-8 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.18), transparent)`,
        }}
      />

      {/* ── Intel triptych ───────────────────────────────────────────────── */}
      <div className="relative z-10 px-8 py-7 grid grid-cols-1 md:grid-cols-3 gap-4">
        <IntelCard
          icon={Brain}
          eyebrow="WHY THIS MATTERS"
          delay={0.7}
          rgb={rgb}
          body={
            <>
              Print can produce a short-lived spike. Risk is asymmetric on a surprise miss/beat —
              most setups stay valid through the release, but liquidity thins for the first
              90 seconds.
            </>
          }
        />
        <IntelCard
          icon={Crosshair}
          eyebrow="YOUR SETUP COMPATIBILITY"
          delay={0.8}
          rgb={rgb}
          body={
            <>
              Post-news continuation setups on{" "}
              <span style={{ color: `rgb(${rgb})` }}>{event.affectedPairs?.[0] ?? "this pair"}</span> have averaged{" "}
              <span style={{ color: VANTARY.paper }}>2.8R</span> over the last 12 months.
              Liquidity sweeps in the first 5-min candle resolve cleanly.
            </>
          }
        />
        <IntelCard
          icon={History}
          eyebrow="LAST 4 PRINTS"
          delay={0.9}
          rgb={rgb}
          body={
            <div className="flex items-center gap-1.5">
              {[42, -22, 28, 18].map((p, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1"
                  style={{ flex: 1 }}
                >
                  <span style={{ ...MONO_EYEBROW, fontSize: 9, color: VANTARY.ashGhost }}>
                    P{4 - i}
                  </span>
                  <span
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 14,
                      color: p >= 0 ? `rgb(${rgb})` : VANTARY.paperDim,
                    }}
                  >
                    {p > 0 ? "+" : ""}
                    {p}p
                  </span>
                </div>
              ))}
            </div>
          }
        />
      </div>

      {/* ── Affected pairs ───────────────────────────────────────────────── */}
      <div className="relative z-10 px-8 pb-6">
        <div className="flex items-baseline justify-between mb-3">
          <span style={MONO_EYEBROW}>AFFECTED PAIRS · LIVE BROADCAST</span>
          <span style={{ ...MONO_EYEBROW, color: VANTARY.ashGhost }}>
            {(event.affectedPairs ?? []).length} TRACKED
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {pairDeltas.map((p, i) => (
            <PairChip
              key={p.pair}
              pair={p.pair}
              delta={p.delta}
              hot={p.hot}
              rgb={rgb}
              delay={1.0 + i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* ── Action bar ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: EASE_V }}
        className="relative z-10 px-8 pb-6 flex flex-wrap items-center gap-2"
      >
        <ActionButton primary rgb={rgb} icon={Pin} label="Pin to flight deck" />
        <ActionButton rgb={rgb} icon={Calendar} label="Full calendar" />
        <ActionButton rgb={rgb} icon={VolumeX} label="Mute" />
      </motion.div>

      {/* ── Recommend strip ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.35, ease: EASE_V }}
        className="relative z-10 px-8 py-4 border-t flex items-start gap-3"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(${rgb}, 0.04))`,
          borderColor: `rgba(${rgb}, 0.12)`,
        }}
      >
        <motion.span
          className="mt-0.5 w-1.5 h-1.5 rounded-full flex-none"
          style={{
            background: `rgb(${rgb})`,
            boxShadow: `0 0 12px rgba(${rgb}, 0.9)`,
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex items-center gap-2 flex-1">
          <Sparkles size={12} style={{ color: `rgb(${rgb})` }} />
          <span style={{ ...MONO_EYEBROW, color: `rgb(${rgb})` }}>RECOMMEND</span>
          <span style={{ color: VANTARY.paperDim, fontSize: 13, lineHeight: 1.55 }}>
            {recommend}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ActionButton({
  primary,
  rgb,
  icon: Icon,
  label,
}: {
  primary?: boolean
  rgb: string
  icon: typeof Pin
  label: string
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: EASE_V }}
      className="relative flex items-center gap-2 overflow-hidden"
      style={{
        background: primary
          ? `linear-gradient(180deg, rgba(${rgb}, 0.16), rgba(${rgb}, 0.08))`
          : "rgba(255,255,255,0.025)",
        border: primary ? `1px solid rgba(${rgb}, 0.40)` : "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS_V.pill,
        padding: "9px 16px",
        color: primary ? VANTARY.paper : VANTARY.paperDim,
        fontSize: 12,
        letterSpacing: "0.02em",
      }}
    >
      <Icon size={12} style={{ color: primary ? `rgb(${rgb})` : VANTARY.ashSoft }} />
      <span>{label}</span>
    </motion.button>
  )
}

function CornerBrackets({ rgb }: { rgb: string }) {
  const stroke = `rgba(${rgb}, 0.35)`
  const size = 14
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((c) => {
        const base: React.CSSProperties = {
          position: "absolute",
          width: size,
          height: size,
          borderColor: stroke,
          opacity: 0.7,
        }
        const style: React.CSSProperties = {
          ...base,
          ...(c === "tl" && { top: 10, left: 10, borderTop: "1px solid", borderLeft: "1px solid" }),
          ...(c === "tr" && { top: 10, right: 10, borderTop: "1px solid", borderRight: "1px solid" }),
          ...(c === "bl" && { bottom: 10, left: 10, borderBottom: "1px solid", borderLeft: "1px solid" }),
          ...(c === "br" && {
            bottom: 10,
            right: 10,
            borderBottom: "1px solid",
            borderRight: "1px solid",
          }),
        }
        return <span key={c} aria-hidden className="pointer-events-none" style={style} />
      })}
    </>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   9.  OUTER MacroAlertSheet
   ═════════════════════════════════════════════════════════════════════════ */

export function MacroAlertSheet() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const events = MACRO_EVENTS
  const selected = selectedId ? events.find((e) => e.id === selectedId) ?? null : null
  const highCount = events.filter((e) => e.impact === "high").length

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: VANTARY.ink,
        borderRadius: RADIUS_V.cardLg,
        border: `1px solid rgba(255,255,255,0.04)`,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <MacroEventTheater key={selected.id} event={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE_V }}
            className="relative p-6"
          >
            {/* list-state backdrop wash */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 0% 0%, rgba(239,68,68,0.08), transparent 55%)",
              }}
            />
            <div className="relative z-10 mb-5 flex items-start gap-4">
              <span
                className="flex-none flex items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.30)",
                }}
              >
                <AlertTriangle size={16} style={{ color: "rgb(239,68,68)" }} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div style={MONO_EYEBROW}>MACRO · ALERT SHEET</div>
                  <div style={MONO_EYEBROW}>
                    <span style={{ color: VANTARY.paper }}>{events.length}</span> EVENTS
                  </div>
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: VANTARY.paper,
                    letterSpacing: "-0.01em",
                    marginTop: 6,
                  }}
                >
                  {highCount} high-impact {highCount === 1 ? "event" : "events"} today
                </h2>
                <div style={{ ...MONO_EYEBROW, color: VANTARY.ashSoft, marginTop: 6 }}>
                  PLAN RULE · NO TRADING 30 MIN BEFORE · AFFECTS{" "}
                  {DAILY_PLAN.focusPairs.join(" · ")}
                </div>
              </div>
            </div>
            <span
              aria-hidden
              className="relative z-10 block mb-3 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(239,68,68,0.20), transparent)",
              }}
            />
            <div className="relative z-10">
              {events.map((e) => (
                <MacroRowLab key={e.id} event={e} onOpen={() => setSelectedId(e.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default MacroAlertSheet
