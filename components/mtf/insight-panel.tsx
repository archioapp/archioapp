"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import type { CardAnalysisResult } from "./types"
import { ACCENT, SURFACE, RADIUS, TYPE, MOTION, GLOW, GRADIENT } from "./mtf-theme"

/* ═══════════════════════════════════════════════════════════════
   DESIGN CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const DOT_COLORS: Record<string, string> = {
  emerald: `rgba(${ACCENT.emerald.rgb},0.55)`,
  rose: `rgba(${ACCENT.rose.rgb},0.55)`,
  amber: `rgba(${ACCENT.amber.rgb},0.5)`,
  cyan: `rgba(${ACCENT.cyan.rgb},0.45)`,
  slate: "rgba(148,163,184,0.22)",
}

const GLOW_COLORS: Record<string, string> = {
  emerald: `rgba(${ACCENT.emerald.rgb},0.12)`,
  rose: `rgba(${ACCENT.rose.rgb},0.12)`,
  amber: `rgba(${ACCENT.amber.rgb},0.1)`,
  cyan: `rgba(${ACCENT.cyan.rgb},0.1)`,
  slate: "rgba(148,163,184,0.05)",
}

const TEXT_COLORS: Record<string, string> = {
  emerald: `rgba(${ACCENT.emerald.rgb},0.65)`,
  rose: `rgba(${ACCENT.rose.rgb},0.65)`,
  amber: `rgba(${ACCENT.amber.rgb},0.6)`,
  cyan: `rgba(${ACCENT.cyan.rgb},0.55)`,
  slate: "rgba(148,163,184,0.4)",
}

type Tone = "emerald" | "rose" | "amber" | "cyan" | "slate"

/* ═══════════════════════════════════════════════════════════════
   CONFIDENCE RING v3 -- Multi-arc SVG with 24 tick marks,
   breathing tip dot, gradient arc fill, and inner glow
   ═══════════════════════════════════════════════════════════════ */
function ConfidenceRing({
  value,
  rgb,
  size = 56,
  strokeWidth = 3,
  delay = 0,
  showTicks = false,
}: {
  value: number
  rgb: string
  size?: number
  strokeWidth?: number
  delay?: number
  showTicks?: boolean
}) {
  const center = size / 2
  const radius = (size - strokeWidth * 2) / 2
  const innerRadius = radius - 6
  const circumference = 2 * Math.PI * radius
  const innerCircumference = 2 * Math.PI * innerRadius
  const strokeDashoffset = circumference - (value / 100) * circumference
  const innerStrokeDashoffset =
    innerCircumference - (Math.min(value + 15, 100) / 100) * innerCircumference

  /* Tick mark positions -- 24 radiating lines */
  const TICK_COUNT = 24
  const ticks = useMemo(
    () =>
      Array.from({ length: TICK_COUNT }).map((_, i) => {
        const angle = (i / TICK_COUNT) * 360 - 90
        const rad = (angle * Math.PI) / 180
        const tickRadius = radius + 3
        const tickLen = i % 6 === 0 ? 4 : 2
        return {
          x1: center + Math.cos(rad) * tickRadius,
          y1: center + Math.sin(rad) * tickRadius,
          x2: center + Math.cos(rad) * (tickRadius + tickLen),
          y2: center + Math.sin(rad) * (tickRadius + tickLen),
          isLit: (i / TICK_COUNT) * 100 <= value,
          isMajor: i % 6 === 0,
        }
      }),
    [center, radius, value],
  )

  /* Tip dot position on the arc */
  const tipAngle = ((value / 100) * 360 - 90) * (Math.PI / 180)
  const tipX = center + Math.cos(tipAngle) * radius
  const tipY = center + Math.sin(tipAngle) * radius

  const uniqueId = useMemo(() => `cr-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Ambient radial glow behind ring */}
      <motion.div
        className="absolute inset-[-25%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: delay + 0.8, duration: 1.2 }}
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.1) 0%, rgba(${rgb},0.03) 40%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />

      <svg
        className="w-full h-full -rotate-90 relative z-10"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id={`${uniqueId}-arc`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgba(${rgb},0.35)`} />
            <stop offset="50%" stopColor={`rgba(${rgb},0.65)`} />
            <stop offset="100%" stopColor={`rgba(${rgb},0.45)`} />
          </linearGradient>
          <filter id={`${uniqueId}-glow`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tick marks */}
        {showTicks &&
          ticks.map((t, i) => (
            <motion.line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={
                t.isLit ? `rgba(${rgb},${t.isMajor ? 0.5 : 0.3})` : "rgba(148,163,184,0.06)"
              }
              strokeWidth={t.isMajor ? 1.2 : 0.6}
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + i * 0.015, duration: 0.2 }}
            />
          ))}

        {/* Background track -- outer */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.04)"
          strokeWidth={strokeWidth}
        />
        {/* Background track -- inner */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="rgba(148,163,184,0.02)"
          strokeWidth={strokeWidth - 1}
        />

        {/* Inner arc -- secondary confidence */}
        <motion.circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke={`rgba(${rgb},0.12)`}
          strokeWidth={strokeWidth - 1}
          strokeLinecap="round"
          strokeDasharray={innerCircumference}
          initial={{ strokeDashoffset: innerCircumference }}
          animate={{ strokeDashoffset: innerStrokeDashoffset }}
          transition={{ duration: 1.4, delay: delay + 0.3, ease: MOTION.ease }}
        />

        {/* Glow layer on main arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`rgba(${rgb},0.15)`}
          strokeWidth={strokeWidth + 5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, delay: delay + 0.4, ease: MOTION.ease }}
          filter={`url(#${uniqueId}-glow)`}
        />

        {/* Main arc -- gradient fill */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${uniqueId}-arc)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, delay: delay + 0.4, ease: MOTION.ease }}
        />

        {/* Breathing tip dot */}
        {value > 0 && (
          <motion.circle
            cx={tipX}
            cy={tipY}
            r={showTicks ? 3 : 2}
            fill={`rgba(${rgb},0.9)`}
            initial={{ opacity: 0, r: 0 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              r: showTicks ? [2.5, 3.5, 2.5] : [1.5, 2.5, 1.5],
            }}
            transition={{
              opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: delay + 1.5 },
              r: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: delay + 1.5 },
            }}
            filter={`url(#${uniqueId}-glow)`}
          />
        )}
      </svg>

      {/* Center value */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.8, duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <span
          className="font-bold font-mono leading-none"
          style={{
            color: `rgba(${rgb},0.8)`,
            fontSize: showTicks ? 16 : 14,
          }}
        >
          {value}
        </span>
        <span
          className="text-[6px] font-mono uppercase tracking-widest mt-0.5"
          style={{ color: `rgba(${rgb},0.35)` }}
        >
          conf
        </span>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DIMENSION GAUGE -- Mini radial gauge for summary row
   ═══════════════════════════════════════════════════════════════ */
function DimensionGauge({
  label,
  value,
  rgb,
  delay,
}: {
  label: string
  value: number
  rgb: string
  delay: number
}) {
  const size = 36
  const sw = 2.5
  const center = size / 2
  const radius = (size - sw * 2) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (Math.min(Math.abs(value), 100) / 100) * circ
  const isPositive = value >= 0

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: MOTION.ease }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.04)"
            strokeWidth={sw}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`rgba(${rgb},${isPositive ? 0.5 : 0.35})`}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: delay + 0.2, ease: MOTION.ease }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[9px] font-mono font-bold leading-none"
            style={{ color: `rgba(${rgb},0.6)` }}
          >
            {Math.abs(Math.round(value))}
          </span>
        </div>
      </div>
      <span
        className="text-[7px] font-mono uppercase tracking-widest font-semibold"
        style={{ color: "rgba(148,163,184,0.22)" }}
      >
        {label}
      </span>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SIGNAL READ CARD v3 -- Layered card with deep overlap,
   left accent bar, parallax depth, and correlation awareness
   ═══════════════════════════════════════════════════════════════ */
function SignalReadCard({
  signal,
  read,
  tone,
  strength,
  index,
  totalCount,
  isActive,
  onActivate,
  isFullSignal,
}: {
  signal: string
  read: string
  tone: Tone
  strength: number
  index: number
  totalCount: number
  isActive: boolean
  onActivate: () => void
  isFullSignal: boolean
}) {
  const [isRevealed, setIsRevealed] = useState(false)
  const dotColor = DOT_COLORS[tone] || DOT_COLORS.slate
  const glowColor = GLOW_COLORS[tone] || GLOW_COLORS.slate
  const textColor = TEXT_COLORS[tone] || TEXT_COLORS.slate
  const accentRgb = ACCENT[tone === "slate" ? "purple" : tone].rgb
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20px" })

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsRevealed(true), index * 180 + 80)
      return () => clearTimeout(timer)
    }
  }, [inView, index])

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer"
      initial={{ opacity: 0, x: -28, scale: 0.92 }}
      animate={isRevealed ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{
        duration: 0.65,
        ease: MOTION.ease,
        delay: index * 0.1,
      }}
      onClick={onActivate}
      style={{
        zIndex: isActive ? 10 : totalCount - index,
        marginTop: index > 0 ? -6 : 0,
      }}
    >
      <motion.div
        className="relative overflow-hidden"
        animate={{
          scale: isActive ? 1.012 : 1,
          y: isActive ? -2 : 0,
        }}
        transition={{ duration: 0.35 }}
        style={{
          background: isActive
            ? `linear-gradient(135deg, rgba(${accentRgb},0.06) 0%, ${SURFACE.recess} 50%, rgba(${accentRgb},0.02) 100%)`
            : SURFACE.recess,
          borderRadius: RADIUS.inner,
          padding: "14px 16px 14px 20px",
          boxShadow: isActive
            ? `0 6px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(${accentRgb},0.08), ${GLOW.low(accentRgb)}`
            : `0 2px 10px rgba(0,0,0,0.18)`,
          transition: "box-shadow 0.4s cubic-bezier(0.33, 1, 0.68, 1)",
        }}
      >
        {/* Left accent bar */}
        <motion.div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
          initial={{ scaleY: 0 }}
          animate={isRevealed ? { scaleY: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: MOTION.ease }}
          style={{
            background: isActive
              ? `linear-gradient(180deg, rgba(${accentRgb},0.6), rgba(${accentRgb},0.2))`
              : `linear-gradient(180deg, rgba(${accentRgb},0.2), rgba(${accentRgb},0.05))`,
            transformOrigin: "top",
          }}
        />

        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          initial={{ scaleX: 0 }}
          animate={isRevealed ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: MOTION.ease }}
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${dotColor} 50%, transparent 95%)`,
            transformOrigin: "left",
          }}
        />

        {/* Active glow orb */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute -top-12 -right-12 w-36 h-36 pointer-events-none"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.5 }}
              style={{
                background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                filter: "blur(20px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Full-signal ripple wave */}
        {isFullSignal && isRevealed && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.06, 0], scale: [0.95, 1.02, 0.95] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.25,
            }}
            style={{
              background: `radial-gradient(ellipse at 20% 50%, rgba(${accentRgb},0.2) 0%, transparent 70%)`,
              borderRadius: RADIUS.inner,
            }}
          />
        )}

        {/* Header row */}
        <div className="flex items-center gap-3 relative z-10">
          {/* Animated dot with pulse */}
          <motion.div
            className="relative shrink-0"
            initial={{ scale: 0 }}
            animate={isRevealed ? { scale: 1 } : {}}
            transition={{
              delay: index * 0.1 + 0.15,
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: dotColor,
                boxShadow: isActive ? `0 0 8px ${glowColor}` : "none",
              }}
            />
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 2.8, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ border: `1px solid ${dotColor}` }}
              />
            )}
          </motion.div>

          <span className={TYPE.label} style={{ color: textColor }}>
            {signal}
          </span>

          {/* Strength bar + percentage */}
          <div className="flex items-center gap-2 ml-auto">
            <div
              className="w-16 h-[4px] rounded-full overflow-hidden"
              style={{ background: "rgba(148,163,184,0.04)" }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={isRevealed ? { width: `${strength}%` } : {}}
                transition={{
                  delay: index * 0.1 + 0.35,
                  duration: 0.8,
                  ease: MOTION.ease,
                }}
                style={{
                  background: `linear-gradient(90deg, ${dotColor}, rgba(${accentRgb},0.3))`,
                  boxShadow: strength > 60 ? `0 0 10px ${glowColor}` : "none",
                }}
              />
            </div>
            <motion.span
              className="text-[8px] font-mono font-bold"
              initial={{ opacity: 0 }}
              animate={isRevealed ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              style={{ color: textColor, minWidth: 22, textAlign: "right" }}
            >
              {strength}%
            </motion.span>
          </div>
        </div>

        {/* Read text with expansion */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: MOTION.ease }}
              className="overflow-hidden"
            >
              <p
                className="text-[11px] leading-[1.95] mt-3 pl-5"
                style={{ color: "rgba(203,213,225,0.6)" }}
              >
                {read}
              </p>

              {/* Mini confidence ring for this signal */}
              <div className="flex items-center gap-2 mt-3 pl-5">
                <ConfidenceRing
                  value={strength}
                  rgb={accentRgb}
                  size={28}
                  strokeWidth={2}
                  delay={0}
                />
                <span
                  className="text-[8px] font-mono uppercase tracking-wider"
                  style={{ color: "rgba(148,163,184,0.25)" }}
                >
                  Signal Conviction
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed preview */}
        {!isActive && (
          <motion.p
            className="text-[10px] leading-[1.6] mt-2 pl-5 line-clamp-1"
            style={{ color: "rgba(148,163,184,0.22)" }}
          >
            {read}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HARMONIC DOTS -- Visual signal alignment indicator
   ═══════════════════════════════════════════════════════════════ */
function HarmonicDots({
  count,
  maxDots = 5,
  rgb,
  delay = 0,
  pulseSync = false,
}: {
  count: number
  maxDots?: number
  rgb: string
  delay?: number
  pulseSync?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxDots }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: pulseSync && i < count ? [1, 1.5, 1] : 1,
            opacity: i < count ? (pulseSync ? [0.4, 1, 0.4] : 1) : 0.3,
          }}
          transition={
            pulseSync && i < count
              ? {
                  scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: delay + i * 0.12 },
                  opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: delay + i * 0.12 },
                }
              : { delay: delay + i * 0.08, type: "spring", stiffness: 400, damping: 20 }
          }
          style={{
            width: 5,
            height: 5,
            background: i < count ? `rgba(${rgb},0.6)` : "rgba(148,163,184,0.08)",
            boxShadow: i < count ? `0 0 6px rgba(${rgb},0.2)` : "none",
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER TEXT -- Animated character-by-character reveal
   ═══════════════════════════════════════════════════════════════ */
function TypewriterText({
  text,
  delay = 0,
  charDelay = 6,
  style,
  className,
}: {
  text: string
  delay?: number
  charDelay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const [visibleChars, setVisibleChars] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (visibleChars >= text.length) return
    const timer = setTimeout(() => setVisibleChars((v) => v + 1), charDelay)
    return () => clearTimeout(timer)
  }, [started, visibleChars, text.length, charDelay])

  return (
    <span className={className} style={style}>
      {text.slice(0, visibleChars)}
      {visibleChars < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ color: "rgba(148,163,184,0.5)" }}
        >
          {"_"}
        </motion.span>
      )}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SUMMARY SYNTHESIS v3 -- Verdict block with typewriter text,
   large confidence ring with ticks, harmonic wave visualizer
   ═══════════════════════════════════════════════════════════════ */
function SummarySynthesis({
  overallStrength,
  summaryRgb,
  summarySentence,
  harmonicScore,
  harmonicLabel,
  domSide,
  readsCount,
  dimensions,
}: {
  overallStrength: number
  summaryRgb: string
  summarySentence: string
  harmonicScore: number
  harmonicLabel: string
  domSide: string
  readsCount: number
  dimensions: Array<{ label: string; value: number; rgb: string }>
}) {
  const delayBase = readsCount * 0.1 + 0.5

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayBase, duration: 0.7, ease: MOTION.ease }}
      style={{
        background: `linear-gradient(135deg, rgba(${summaryRgb},0.04) 0%, ${SURFACE.recess} 30%, rgba(${ACCENT.purple.rgb},0.02) 100%)`,
        borderRadius: RADIUS.inner,
        padding: "22px 24px",
        boxShadow: `0 6px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(${summaryRgb},0.06)`,
      }}
    >
      {/* Top shimmer line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${summaryRgb},0.25), rgba(${ACCENT.purple.rgb},0.12), transparent)`,
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ambient mesh gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse at 15% 30%, rgba(${summaryRgb},0.04) 0%, transparent 50%), radial-gradient(ellipse at 85% 70%, rgba(${ACCENT.purple.rgb},0.03) 0%, transparent 50%)`,
        }}
      />

      {/* Dimension gauges row */}
      <motion.div
        className="flex items-center justify-around mb-5 pb-4 relative z-10"
        style={{ borderBottom: `1px solid rgba(${summaryRgb},0.04)` }}
      >
        {dimensions.map((d, i) => (
          <DimensionGauge
            key={d.label}
            label={d.label}
            value={d.value}
            rgb={d.rgb}
            delay={delayBase + i * 0.12}
          />
        ))}
      </motion.div>

      <div className="flex items-start gap-5 relative z-10">
        {/* Main confidence ring with tick marks */}
        <ConfidenceRing
          value={overallStrength}
          rgb={summaryRgb}
          size={64}
          strokeWidth={3}
          delay={delayBase}
          showTicks
        />

        <div className="flex-1 min-w-0">
          {/* Harmonic label + dots */}
          <div className="flex items-center gap-3 mb-2.5">
            <motion.span
              className={TYPE.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delayBase + 0.3, duration: 0.4 }}
              style={{ color: `rgba(${summaryRgb},0.5)` }}
            >
              {harmonicLabel}
            </motion.span>
            <HarmonicDots
              count={harmonicScore}
              rgb={summaryRgb}
              delay={delayBase + 0.4}
              pulseSync={harmonicScore >= 4}
            />
          </div>

          {/* Summary text with typewriter */}
          <TypewriterText
            text={summarySentence}
            delay={delayBase + 0.6}
            charDelay={8}
            className="text-[11px] leading-[1.9] block"
            style={{ color: "rgba(203,213,225,0.55)" }}
          />

          {/* Directional tag */}
          <motion.div
            className="flex items-center gap-2 mt-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delayBase + 1.5, duration: 0.4 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                boxShadow: [
                  `0 0 4px rgba(${summaryRgb},0.15)`,
                  `0 0 10px rgba(${summaryRgb},0.3)`,
                  `0 0 4px rgba(${summaryRgb},0.15)`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: `rgba(${summaryRgb},0.5)` }}
            />
            <span
              className="text-[8px] font-mono uppercase tracking-widest font-bold"
              style={{ color: `rgba(${summaryRgb},0.35)` }}
            >
              {domSide === "bull"
                ? "Bullish Structure"
                : domSide === "bear"
                  ? "Bearish Structure"
                  : "Neutral Range"}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN INSIGHT PANEL EXPORT v3
   ═══════════════════════════════════════════════════════════════ */
export function InsightPanel({
  cardAnalysis: d,
  isVisible,
  timeframe,
}: {
  cardAnalysis: CardAnalysisResult | null
  isVisible: boolean
  timeframe: string
}) {
  const [activeReadIndex, setActiveReadIndex] = useState(0)

  /* Reset active when card changes */
  useEffect(() => {
    setActiveReadIndex(0)
  }, [timeframe, d?.total])

  if (!d || !isVisible) return null

  const totalRange = d.bullishTotalRange + d.bearishTotalRange
  const candleSkew = d.total > 0 ? (d.bullCount - d.bearCount) / d.total : 0
  const rangeSkew = totalRange > 0 ? (d.bullishTotalRange - d.bearishTotalRange) / totalRange : 0
  const domSide = rangeSkew > 0.05 ? "bull" : rangeSkew < -0.05 ? "bear" : "neutral"

  const hasDivergence =
    (candleSkew > 0.15 && rangeSkew < -0.1) || (candleSkew < -0.15 && rangeSkew > 0.1)
  const avgDiff = Math.abs(d.avgBullishRange - d.avgBearishRange)
  const avgMid = (d.avgBullishRange + d.avgBearishRange) / 2
  const efficiency = avgMid > 0 ? avgDiff / avgMid : 0
  const isCompressed = Math.abs(candleSkew) < 0.12 && Math.abs(rangeSkew) < 0.12
  const ratio = d.rangeRatio >= 1 ? d.rangeRatio : 1 / d.rangeRatio
  const isExhausted = ratio > 3 && d.total >= 6

  /* ── Harmonic computation ── */
  const countSignal = Math.abs(candleSkew) < 0.08 ? 0 : candleSkew > 0 ? 1 : -1
  const rangeSignal = Math.abs(rangeSkew) < 0.06 ? 0 : rangeSkew > 0 ? 1 : -1
  const aligned =
    (countSignal >= 0 && rangeSignal >= 0) || (countSignal <= 0 && rangeSignal <= 0)
  const weakerAvg = domSide === "bull" ? d.avgBearishRange : d.avgBullishRange
  const strongerAvg = domSide === "bull" ? d.avgBullishRange : d.avgBearishRange
  const absRatio = strongerAvg > 0 ? weakerAvg / strongerAvg : 1
  const absorptionSignal = absRatio < 0.35 ? 1 : absRatio < 0.65 ? 0.5 : 0
  const convictionScore = aligned ? Math.min(1, (ratio - 1) / 3) : Math.max(0, 1 - ratio / 3)
  const harmonicScore =
    (countSignal !== 0 ? 1 : 0) +
    (rangeSignal !== 0 ? 1 : 0) +
    (aligned ? 1 : 0) +
    (absorptionSignal >= 0.5 ? 1 : 0) +
    (convictionScore > 0.4 ? 1 : 0)
  const harmonicLabel =
    harmonicScore >= 4
      ? "Full Signal"
      : harmonicScore >= 3
        ? "Aligned"
        : harmonicScore >= 2
          ? "Mixed"
          : "Fractured"

  const isFullSignal = harmonicScore >= 4

  /* ── Build signal reads ── */
  const reads: Array<{
    signal: string
    read: string
    tone: Tone
    strength: number
  }> = []

  if (hasDivergence) {
    reads.push({
      signal: candleSkew > 0 ? "Count-Range Split" : "Hidden Expansion",
      read:
        candleSkew > 0
          ? "More bullish candles printed but bearish range dominates. The visible structure is a facade. The real force is flowing opposite to what candle count suggests. Likely a liquidity collection phase before reversal."
          : "Bearish candle majority masks bullish range absorption. Large wicks on bullish candles indicate institutional loading. The selling pressure is being eaten, not respected.",
      tone: "amber",
      strength: 75,
    })
  }

  reads.push({
    signal: "Directional Efficiency",
    read:
      efficiency > 0.5
        ? `${domSide === "bull" ? "Bullish" : domSide === "bear" ? "Bearish" : "Neutral"} candles cover ${(efficiency * 100).toFixed(0)}% more range per candle. High-grade directional movement -- each candle in the dominant direction carries real commitment.`
        : efficiency > 0.2
          ? `Moderate directional lean at ${(efficiency * 100).toFixed(0)}% per candle. The opposing wicks are not negligible. Structure is leaning but uncommitted. A catalyst candle would confirm or deny.`
          : "Both sides produce near-equal range per candle. Grinding environment with no clean edge. Rotation mode -- favor range boundaries over mid-range entries.",
    tone:
      efficiency > 0.5
        ? domSide === "bull"
          ? "emerald"
          : domSide === "bear"
            ? "rose"
            : "slate"
        : efficiency > 0.2
          ? "cyan"
          : "slate",
    strength: Math.round(Math.min(100, efficiency * 120)),
  })

  if (isCompressed) {
    reads.push({
      signal: "Compression",
      read: "All dimensions near equilibrium. Energy is coiling. The next impulse candle triggers expansion -- direction unknown until it fires. Pre-move environment.",
      tone: "cyan",
      strength: 60,
    })
  }

  if (isExhausted) {
    reads.push({
      signal: "Exhaustion Risk",
      read: `Extreme ratio of ${ratio.toFixed(1)}:1 across ${d.total} candles. Late-stage momentum. Watch for decreasing candle range on the next formation as an early exhaustion tell.`,
      tone: "amber",
      strength: 85,
    })
  }

  if (!hasDivergence && !isCompressed && !isExhausted) {
    const wAvg = domSide === "bull" ? d.avgBearishRange : d.avgBullishRange
    const sAvg = domSide === "bull" ? d.avgBullishRange : d.avgBearishRange
    const aRatio = sAvg > 0 ? wAvg / sAvg : 1
    reads.push({
      signal: "Opposition State",
      read:
        aRatio < 0.35
          ? `The ${domSide === "bull" ? "bearish" : "bullish"} side is structurally eliminated. Average candle covers less than a third of the dominant side.`
          : aRatio < 0.65
            ? `The ${domSide === "bull" ? "bearish" : "bullish"} side is fading but generating some range. Not dead yet. A catalyst could ignite reversal.`
            : `The ${domSide === "bull" ? "bearish" : "bullish"} side matches dominant range closely. Contested territory. No clean structural superiority.`,
      tone:
        aRatio < 0.35
          ? "slate"
          : aRatio < 0.65
            ? "amber"
            : domSide === "bull"
              ? "rose"
              : "emerald",
      strength: Math.round(Math.min(100, (1 - aRatio) * 130)),
    })
  }

  /* ── Summary ── */
  const overallStrength = Math.round(
    reads.reduce((sum, r) => sum + r.strength, 0) / reads.length,
  )
  const summaryRgb =
    domSide === "bull"
      ? ACCENT.emerald.rgb
      : domSide === "bear"
        ? ACCENT.rose.rgb
        : ACCENT.slate.rgb
  const summarySentence =
    overallStrength > 70
      ? `Strong directional conviction on ${timeframe}. Signals are aligned with high confidence. Structure supports continuation.`
      : overallStrength > 40
        ? `Moderate signal strength on ${timeframe}. Partial alignment with room for confirmation. Wait for a trigger candle to commit.`
        : `Weak or mixed signals on ${timeframe}. Structure is unconvincing for directional trades. Range or rotation likely.`

  /* ── Dimension gauge data ── */
  const dimensions = [
    {
      label: "Count",
      value: Math.round(candleSkew * 100),
      rgb: candleSkew > 0 ? ACCENT.emerald.rgb : candleSkew < 0 ? ACCENT.rose.rgb : ACCENT.slate.rgb,
    },
    {
      label: "Force",
      value: Math.round(rangeSkew * 100),
      rgb: rangeSkew > 0 ? ACCENT.emerald.rgb : rangeSkew < 0 ? ACCENT.rose.rgb : ACCENT.slate.rgb,
    },
    {
      label: "Effic",
      value: Math.round(efficiency * 100),
      rgb: efficiency > 0.5 ? ACCENT.cyan.rgb : efficiency > 0.2 ? ACCENT.blue.rgb : ACCENT.slate.rgb,
    },
    {
      label: "Ratio",
      value: Math.round(Math.min(ratio / 4, 1) * 100),
      rgb: ratio > 2 ? ACCENT.amber.rgb : ACCENT.slate.rgb,
    },
  ]

  return (
    <div
      className="relative"
      style={{
        background: `linear-gradient(180deg, rgba(${ACCENT.purple.rgb},0.015) 0%, ${SURFACE.recess} 15%, ${SURFACE.void} 100%)`,
        padding: "20px 20px 24px",
      }}
    >
      {/* Top gradient border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${ACCENT.purple.rgb},0.12), rgba(${summaryRgb},0.08), transparent)`,
        }}
      />

      {/* Animated mesh gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse at 10% 20%, rgba(${summaryRgb},0.04) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, rgba(${ACCENT.purple.rgb},0.03) 0%, transparent 40%)`,
        }}
      />

      {/* Section header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-[3px] h-4 rounded-full"
            style={{ background: `rgba(${ACCENT.purple.rgb},0.35)` }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className={TYPE.label} style={{ color: `rgba(${ACCENT.purple.rgb},0.45)` }}>
            {timeframe} Signal Depth
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono" style={{ color: "rgba(148,163,184,0.2)" }}>
            {reads.length} signals
          </span>
          <HarmonicDots
            count={harmonicScore}
            rgb={summaryRgb}
            delay={0.2}
            pulseSync={isFullSignal}
          />
        </div>
      </div>

      {/* Signal read cards -- layered with deep overlap */}
      <div className="space-y-1 mb-5 relative z-10">
        {reads.map((r, ri) => (
          <SignalReadCard
            key={ri}
            signal={r.signal}
            read={r.read}
            tone={r.tone}
            strength={r.strength}
            index={ri}
            totalCount={reads.length}
            isActive={activeReadIndex === ri}
            onActivate={() => setActiveReadIndex(ri)}
            isFullSignal={isFullSignal}
          />
        ))}
      </div>

      {/* Summary synthesis block with dimensions + confidence ring */}
      <div className="relative z-10">
        <SummarySynthesis
          overallStrength={overallStrength}
          summaryRgb={summaryRgb}
          summarySentence={summarySentence}
          harmonicScore={harmonicScore}
          harmonicLabel={harmonicLabel}
          domSide={domSide}
          readsCount={reads.length}
          dimensions={dimensions}
        />
      </div>
    </div>
  )
}
