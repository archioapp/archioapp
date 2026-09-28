"use client"

/* =====================================================================
   SCENE 11 — TRANSFORMATION (Before / After)
   The proof. A trader's life rendered in two columns — left: chaos
   baseline; right: with ArchioAI. Equity curve, emotional state,
   session structure, support network, capital preservation.
   ===================================================================== */

import { useRef } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import {
  Scene,
  useSceneProgress,
  PALETTE,
  GridBackdrop,
  ChapterMarker,
  AuroraLayer,
} from "../LandingShared"
import {
  Zap,
  Shield,
  TrendingUp,
  Users,
  Brain,
  Database,
  Frown,
  Smile,
} from "lucide-react"

/* ---------- Side Column Wrapper ---------- */

function SideHeader({
  tag,
  title,
  subtitle,
  color,
  align,
  delay,
}: {
  tag: string
  title: string
  subtitle: string
  color: string
  align: "left" | "right"
  delay: number
}) {
  return (
    <motion.div
      className="mb-5"
      style={{ textAlign: align }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay }}
    >
      <div
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[9px] font-mono tracking-[0.35em] uppercase mb-2"
        style={{
          background: `${color}14`,
          border: `1px solid ${color}40`,
          color,
        }}
      >
        {tag}
      </div>
      <div
        className="text-[22px] md:text-[26px] font-bold leading-tight tracking-tight"
        style={{ color: PALETTE.ink }}
      >
        {title}
      </div>
      <div
        className="text-[12px] mt-1 leading-relaxed"
        style={{ color: PALETTE.inkMuted }}
      >
        {subtitle}
      </div>
    </motion.div>
  )
}

/* ---------- Equity Curve (before vs after) ---------- */

function EquityCurve({
  variant,
  delay,
}: {
  variant: "chaos" | "resolution"
  delay: number
}) {
  const chaosPath = "M 0 60 Q 30 30 50 45 T 90 70 Q 110 90 140 72 T 200 95 Q 230 110 260 88 T 320 115"
  const resolutionPath = "M 0 80 Q 30 70 50 60 T 90 45 Q 110 38 140 30 T 200 20 Q 230 14 260 10 T 320 5"

  const d = variant === "chaos" ? chaosPath : resolutionPath
  const color = variant === "chaos" ? PALETTE.chaosRed : PALETTE.resolutionMint
  const glow = variant === "chaos" ? "rgba(239,68,68,0.18)" : "rgba(52,211,153,0.25)"

  return (
    <motion.div
      className="relative w-full rounded-xl overflow-hidden mb-5 p-4"
      style={{
        background: "rgba(10,14,22,0.72)",
        border: `1px solid ${color}30`,
        backdropFilter: "blur(10px)",
      }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="text-[9px] font-mono tracking-[0.3em] uppercase"
          style={{ color: PALETTE.inkMuted }}
        >
          Equity · 90 days
        </div>
        <div
          className="text-[11px] font-bold tabular-nums"
          style={{ color }}
        >
          {variant === "chaos" ? "−$4,820" : "+$11,240"}
        </div>
      </div>

      <svg viewBox="0 0 320 120" className="w-full h-24">
        <defs>
          <linearGradient id={`eq-fill-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`eq-glow-${variant}`}>
            <feGaussianBlur stdDeviation="2" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid baseline */}
        <line x1="0" y1="60" x2="320" y2="60" stroke="rgba(100,116,139,0.15)" strokeDasharray="2 4" />

        {/* Fill */}
        <motion.path
          d={`${d} L 320 120 L 0 120 Z`}
          fill={`url(#eq-fill-${variant})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 0.2 }}
        />

        {/* Line */}
        <motion.path
          d={d}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#eq-glow-${variant})`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </svg>
    </motion.div>
  )
}

/* ---------- Metric Row (key stat with icon) ---------- */

function MetricRow({
  icon: Icon,
  label,
  value,
  detail,
  color,
  delay,
  negative = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  detail: string
  color: string
  delay: number
  negative?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: negative ? -14 : 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{
        background: "rgba(10,14,22,0.55)",
        border: `1px solid ${color}20`,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}35`,
        }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[9.5px] font-mono tracking-[0.25em] uppercase"
          style={{ color: PALETTE.inkMuted }}
        >
          {label}
        </div>
        <div className="flex items-baseline gap-2">
          <div
            className="text-[15px] font-bold tabular-nums leading-none"
            style={{ color: PALETTE.ink }}
          >
            {value}
          </div>
          <div
            className="text-[10px] truncate"
            style={{ color: negative ? PALETTE.chaosRed : PALETTE.resolutionMint }}
          >
            {detail}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Chaos Column ---------- */

function ChaosColumn({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.05, 0.2], [0, 1])

  return (
    <motion.div
      className="relative flex-1 max-w-[420px]"
      style={{ opacity }}
    >
      <SideHeader
        tag="Before · The Fragmented Floor"
        title="Working without a mirror."
        subtitle="Six tools, zero memory, shouting into Discord."
        color={PALETTE.chaosRed}
        align="left"
        delay={0.2}
      />

      <EquityCurve variant="chaos" delay={0.5} />

      <div className="space-y-2">
        <MetricRow
          icon={TrendingUp}
          label="Win Rate"
          value="42%"
          detail="−14% vs benchmark"
          color={PALETTE.chaosRed}
          delay={0.8}
          negative
        />
        <MetricRow
          icon={Brain}
          label="Emotional State"
          value="Reactive"
          detail="Detected after the fact"
          color={PALETTE.chaosOrange}
          delay={0.95}
          negative
        />
        <MetricRow
          icon={Shield}
          label="Playbook Compliance"
          value="31%"
          detail="Moving stops weekly"
          color={PALETTE.chaosRed}
          delay={1.1}
          negative
        />
        <MetricRow
          icon={Users}
          label="Support Network"
          value="Silent"
          detail="3am alone at the desk"
          color={PALETTE.chaosRed}
          delay={1.25}
          negative
        />
        <MetricRow
          icon={Database}
          label="Memory of Mistakes"
          value="0 / 47"
          detail="None surfaced next session"
          color={PALETTE.chaosRed}
          delay={1.4}
          negative
        />
        <MetricRow
          icon={Frown}
          label="Self-Awareness"
          value="22 / 100"
          detail="Blind to the loop"
          color={PALETTE.chaosRed}
          delay={1.55}
          negative
        />
      </div>
    </motion.div>
  )
}

/* ---------- Resolution Column ---------- */

function ResolutionColumn({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.25, 0.4], [0, 1])

  return (
    <motion.div
      className="relative flex-1 max-w-[420px]"
      style={{ opacity }}
    >
      <SideHeader
        tag="After · The Unified Core"
        title="Every decision, witnessed."
        subtitle="One operating system. One memory. One mirror."
        color={PALETTE.resolutionCyan}
        align="right"
        delay={0.3}
      />

      <EquityCurve variant="resolution" delay={0.6} />

      <div className="space-y-2">
        <MetricRow
          icon={TrendingUp}
          label="Win Rate"
          value="61%"
          detail="+19pts with discipline bias"
          color={PALETTE.resolutionMint}
          delay={0.9}
        />
        <MetricRow
          icon={Brain}
          label="Emotional State"
          value="Regulated"
          detail="Surfaced in-session"
          color={PALETTE.resolutionCyan}
          delay={1.05}
        />
        <MetricRow
          icon={Shield}
          label="Playbook Compliance"
          value="87%"
          detail="Deviation alerts live"
          color={PALETTE.resolutionMint}
          delay={1.2}
        />
        <MetricRow
          icon={Users}
          label="Support Network"
          value="Live"
          detail="5 rooms · mentor on stage"
          color={PALETTE.resolutionMint}
          delay={1.35}
        />
        <MetricRow
          icon={Database}
          label="Memory of Mistakes"
          value="47 / 47"
          detail="Surfaced before repeat"
          color={PALETTE.resolutionCyan}
          delay={1.5}
        />
        <MetricRow
          icon={Smile}
          label="Self-Awareness"
          value="78 / 100"
          detail="+56 pts in 60 days"
          color={PALETTE.resolutionMint}
          delay={1.65}
        />
      </div>
    </motion.div>
  )
}

/* ---------- Center Divider (The Bridge) ---------- */

function CenterBridge({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.2, 0.4], [0, 1])
  const scale = useTransform(progress, [0.2, 0.4], [0.6, 1])

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center gap-3 z-10 px-2"
      style={{ opacity, scale }}
    >
      {/* Vertical flowing line */}
      <div className="relative h-[400px] w-px">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent, ${PALETTE.resolutionCyan}, ${PALETTE.transitionPurple}, ${PALETTE.resolutionMint}, transparent)`,
          }}
        />
        {/* Traveling light dots */}
        {[0, 0.5, 1].map((d, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full -left-[3px]"
            style={{
              background: PALETTE.ink,
              boxShadow: `0 0 10px ${PALETTE.ink}`,
            }}
            animate={{ top: ["0%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: d,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Bridge icon */}
      <motion.div
        className="w-14 h-14 rounded-full flex items-center justify-center my-3"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.resolutionCyan}, ${PALETTE.transitionPurple})`,
          boxShadow: `0 0 30px ${PALETTE.resolutionCyan}70`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="w-6 h-6" style={{ color: PALETTE.ink }} />
      </motion.div>

      <div className="text-center">
        <div
          className="text-[9px] font-mono tracking-[0.4em] uppercase"
          style={{ color: PALETTE.inkMuted }}
        >
          Cross-over
        </div>
        <div
          className="text-[11px] font-bold tracking-wider"
          style={{ color: PALETTE.ink }}
        >
          ARCHIO
        </div>
      </div>

      {/* Vertical flowing line below */}
      <div className="relative h-[400px] w-px mt-3">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent, ${PALETTE.transitionPurple}, ${PALETTE.resolutionMint}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  )
}

/* ---------- Scene Export ---------- */

export function SceneTransformation() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const headlineOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5])

  return (
    <Scene id="scene-transformation" height="320vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #15060a 0%, #030812 50%, #051824 100%)`,
        }}
      >
        <AuroraLayer
          tones={["rgba(239,68,68,0.12)", PALETTE.transitionPurpleGlow, PALETTE.resolutionCyanGlow]}
          opacity={0.4}
          blur={160}
        />
        <GridBackdrop color="rgba(255,255,255,0.04)" spacing={80} opacity={0.35} />

        <ChapterMarker number="11" label="PROOF · BEFORE & AFTER" />

        {/* Headline — top */}
        <motion.div
          className="absolute inset-x-0 top-[7%] flex flex-col items-center pointer-events-none px-6 z-40"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${PALETTE.border}`,
                color: PALETTE.inkMuted,
              }}
            >
              Scene Eleven · Transformation
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(28px, 4.4vw, 60px)",
                color: PALETTE.ink,
                textShadow: "0 4px 40px rgba(0,0,0,0.7)",
              }}
            >
              Same trader.{" "}
              <span className="italic font-light" style={{ color: PALETTE.resolutionMint }}>
                Different life.
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Side-by-side columns */}
        <div className="absolute inset-x-0 top-[22%] bottom-[6%] flex items-start justify-center gap-6 px-6 md:px-12">
          <ChaosColumn progress={progress} />
          <CenterBridge progress={progress} />
          <ResolutionColumn progress={progress} />
        </div>
      </div>
    </Scene>
  )
}
