"use client"

/* =====================================================================
   SCENE 09 — PSYCHOLOGY OPERATING SYSTEM
   The anatomical brain. Left hemisphere = discipline, patience,
   structure, analysis. Right hemisphere = impulse, fear, ego,
   volatility. Synapses connect, pattern loops illuminate, the mirror
   that sees the loop from outside.
   ===================================================================== */

import { useRef } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import {
  Scene,
  useSceneProgress,
  PALETTE,
  GridBackdrop,
  ParticleField,
  ChapterMarker,
  AuroraLayer,
} from "../LandingShared"

/* ---------- Brain Silhouette with Two Hemispheres ---------- */

function BrainAnatomy({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.2], [0, 1])
  const scale = useTransform(progress, [0, 0.25], [0.7, 1])

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ opacity, scale }}
    >
      <svg viewBox="0 0 760 580" className="w-[620px] md:w-[720px] h-auto">
        <defs>
          {/* Left hemisphere gradient — cool rational */}
          <radialGradient id="left-hemi" cx="30%" cy="35%">
            <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="0.55" />
            <stop offset="60%" stopColor="#0a2a3a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#030810" stopOpacity="1" />
          </radialGradient>

          {/* Right hemisphere gradient — warm emotional */}
          <radialGradient id="right-hemi" cx="70%" cy="35%">
            <stop offset="0%" stopColor={PALETTE.transitionPurple} stopOpacity="0.55" />
            <stop offset="60%" stopColor="#2a0a35" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0f0318" stopOpacity="1" />
          </radialGradient>

          <filter id="brain-glow">
            <feGaussianBlur stdDeviation="1.5" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="synapse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="1" />
            <stop offset="50%" stopColor={PALETTE.ink} stopOpacity="0.8" />
            <stop offset="100%" stopColor={PALETTE.transitionPurple} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* LEFT HEMISPHERE — stylized cortex */}
        <g filter="url(#brain-glow)">
          <path
            d="M 380 60
               C 280 60 180 120 150 220
               C 120 320 140 440 220 480
               C 260 510 320 520 380 520
               L 380 60 Z"
            fill="url(#left-hemi)"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Cortical folds — abstract gyri */}
          <path
            d="M 200 150 Q 230 180 210 220 Q 180 260 220 300 Q 260 340 230 380 Q 200 420 250 450"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 260 120 Q 290 160 270 200 Q 250 240 290 280 Q 330 320 300 360 Q 280 400 330 440"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.5"
            fill="none"
            opacity="0.45"
          />
          <path
            d="M 320 100 Q 350 140 330 190 Q 310 240 350 290 Q 390 340 370 400"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.4"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* RIGHT HEMISPHERE — stylized cortex */}
        <g filter="url(#brain-glow)">
          <path
            d="M 380 60
               C 480 60 580 120 610 220
               C 640 320 620 440 540 480
               C 500 510 440 520 380 520
               L 380 60 Z"
            fill="url(#right-hemi)"
            stroke={PALETTE.transitionPurple}
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Cortical folds — right */}
          <path
            d="M 560 150 Q 530 180 550 220 Q 580 260 540 300 Q 500 340 530 380 Q 560 420 510 450"
            stroke={PALETTE.transitionPurple}
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 500 120 Q 470 160 490 200 Q 510 240 470 280 Q 430 320 460 360 Q 480 400 430 440"
            stroke={PALETTE.transitionPurple}
            strokeWidth="0.5"
            fill="none"
            opacity="0.45"
          />
          <path
            d="M 440 100 Q 410 140 430 190 Q 450 240 410 290 Q 370 340 390 400"
            stroke={PALETTE.transitionPurple}
            strokeWidth="0.4"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* Corpus callosum — the bridge between hemispheres */}
        <motion.line
          x1="380"
          y1="80"
          x2="380"
          y2="500"
          stroke="url(#synapse-grad)"
          strokeWidth="0.8"
          strokeDasharray="3 4"
          opacity="0.6"
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Cerebellum hint at base */}
        <ellipse
          cx="380"
          cy="510"
          rx="80"
          ry="18"
          fill="rgba(30,30,50,0.7)"
          stroke="rgba(100,116,139,0.4)"
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  )
}

/* ---------- Zone Labels (hover-like labels on hemisphere regions) ---------- */

const LEFT_ZONES = [
  { label: "Discipline", x: "22%", y: "30%", metric: "84" },
  { label: "Patience", x: "24%", y: "50%", metric: "72" },
  { label: "Structure", x: "18%", y: "68%", metric: "91" },
  { label: "Analysis", x: "26%", y: "82%", metric: "88" },
]

const RIGHT_ZONES = [
  { label: "Impulse", x: "78%", y: "30%", metric: "63" },
  { label: "Fear", x: "80%", y: "50%", metric: "41" },
  { label: "Ego", x: "82%", y: "68%", metric: "52" },
  { label: "Volatility", x: "74%", y: "82%", metric: "38" },
]

function ZoneLabel({
  label,
  x,
  y,
  metric,
  side,
  delay,
}: {
  label: string
  x: string
  y: string
  metric: string
  side: "left" | "right"
  delay: number
}) {
  const color = side === "left" ? PALETTE.resolutionCyan : PALETTE.transitionPurple
  const tint =
    side === "left" ? "rgba(6,182,212,0.14)" : "rgba(139,92,246,0.14)"
  return (
    <motion.div
      className="absolute flex items-center gap-2 pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: `translate(${side === "left" ? "-100%" : "0"}, -50%)`,
      }}
      initial={{ opacity: 0, x: side === "left" ? -12 : 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay }}
    >
      {side === "right" && (
        <div
          className="h-px"
          style={{
            width: 32,
            background: `linear-gradient(90deg, transparent, ${color})`,
          }}
        />
      )}
      <div
        className="px-2.5 py-1.5 rounded-md backdrop-blur-lg flex items-center gap-2"
        style={{
          background: "rgba(10,14,22,0.7)",
          border: `1px solid ${color}50`,
          boxShadow: `0 4px 16px ${tint}`,
        }}
      >
        <div
          className="text-[9px] font-mono tracking-[0.25em] uppercase"
          style={{ color }}
        >
          {label}
        </div>
        <div
          className="text-[11px] font-bold tabular-nums"
          style={{ color: PALETTE.ink }}
        >
          {metric}
        </div>
      </div>
      {side === "left" && (
        <div
          className="h-px"
          style={{
            width: 32,
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
      )}
    </motion.div>
  )
}

function ZoneLabels({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.25, 0.45, 1], [0, 1, 1])
  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {LEFT_ZONES.map((z, i) => (
        <ZoneLabel key={`l-${i}`} {...z} side="left" delay={i * 0.15} />
      ))}
      {RIGHT_ZONES.map((z, i) => (
        <ZoneLabel key={`r-${i}`} {...z} side="right" delay={0.6 + i * 0.15} />
      ))}
    </motion.div>
  )
}

/* ---------- Synapse Network (firing between zones) ---------- */

function SynapseNetwork({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.35, 0.55, 1], [0, 0.8, 0.7])

  const pairs: Array<[string, string, string, string, number]> = [
    ["26%", "34%", "76%", "34%", 0],
    ["26%", "54%", "78%", "54%", 0.3],
    ["22%", "72%", "80%", "72%", 0.6],
    ["30%", "86%", "72%", "86%", 0.9],
  ]

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="syn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="0.9" />
            <stop offset="50%" stopColor={PALETTE.ink} stopOpacity="0.6" />
            <stop offset="100%" stopColor={PALETTE.transitionPurple} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {pairs.map(([x1, y1, x2, y2, delay], i) => (
          <g key={i}>
            <motion.line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#syn-grad)"
              strokeWidth="0.6"
              strokeDasharray="2 5"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 1 + delay }}
            />
            <motion.circle
              r="2.5"
              fill={PALETTE.ink}
              filter={`drop-shadow(0 0 6px ${PALETTE.ink})`}
              animate={{
                cx: [x1, x2],
                cy: [y1, y2],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: 2 + delay,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>
    </motion.div>
  )
}

/* ---------- Live Pattern Readout Panel ---------- */

function PatternReadout({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.5, 0.7, 1], [0, 1, 1])

  const patterns = [
    {
      label: "Pattern Detected",
      text: "Moving stop after second entry.",
      kind: "WARN",
      color: PALETTE.chaosOrange,
    },
    {
      label: "Left-Hemisphere Strength",
      text: "Structure + Analysis trending up 8% this week.",
      kind: "GOOD",
      color: PALETTE.resolutionMint,
    },
    {
      label: "Right-Hemisphere Spike",
      text: "Ego score rising after prop-firm payout.",
      kind: "WATCH",
      color: PALETTE.transitionPurple,
    },
  ]

  return (
    <motion.div
      className="absolute bottom-[8%] left-[5%] flex flex-col gap-2 pointer-events-none z-30 max-w-[320px]"
      style={{ opacity }}
    >
      {patterns.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 2.5 + i * 0.3 }}
          className="rounded-xl overflow-hidden backdrop-blur-xl"
          style={{
            background: "rgba(10,14,22,0.78)",
            border: `1px solid ${p.color}40`,
            boxShadow: `0 6px 22px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            className="px-3 py-1.5 text-[8.5px] font-mono tracking-[0.3em] uppercase flex items-center gap-2"
            style={{
              background: `${p.color}15`,
              color: p.color,
              borderBottom: `1px solid ${p.color}25`,
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: p.color }}
            />
            {p.label}
            <span className="ml-auto">{p.kind}</span>
          </div>
          <div
            className="px-3 py-2.5 text-[11.5px] leading-relaxed"
            style={{ color: PALETTE.inkSoft }}
          >
            {p.text}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Self-Awareness Meter ---------- */

function AwarenessMeter({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.6, 0.8, 1], [0, 1, 1])

  return (
    <motion.div
      className="absolute bottom-[10%] right-[5%] pointer-events-none z-30"
      style={{ opacity }}
    >
      <div
        className="rounded-xl overflow-hidden backdrop-blur-xl p-4 w-[280px]"
        style={{
          background: "rgba(10,14,22,0.78)",
          border: `1px solid ${PALETTE.resolutionCyan}30`,
          boxShadow: `0 6px 22px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="text-[9px] font-mono tracking-[0.3em] uppercase mb-2.5"
          style={{ color: PALETTE.resolutionCyan }}
        >
          Self-Awareness Index
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <div
            className="text-[32px] font-bold leading-none tabular-nums"
            style={{ color: PALETTE.ink }}
          >
            73
          </div>
          <div className="text-[10px]" style={{ color: PALETTE.inkMuted }}>
            / 100
          </div>
          <div
            className="ml-auto text-[10px] font-medium"
            style={{ color: PALETTE.resolutionMint }}
          >
            +9 this week
          </div>
        </div>

        {/* Meter bar */}
        <div
          className="relative h-2 rounded-full overflow-hidden mb-3"
          style={{ background: "rgba(100,116,139,0.15)" }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${PALETTE.resolutionCyan}, ${PALETTE.transitionPurple})`,
              boxShadow: `0 0 14px ${PALETTE.resolutionCyanGlow}`,
            }}
            initial={{ width: 0 }}
            whileInView={{ width: "73%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div
          className="text-[11px] leading-relaxed italic"
          style={{ color: PALETTE.inkMuted }}
        >
          &ldquo;You&apos;re seeing your own patterns faster than last cycle. Keep the
          mirror honest.&rdquo;
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Scene Export ---------- */

export function ScenePsychOS() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const headlineOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5])

  return (
    <Scene id="scene-psych-os" height="340vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, #0a1020 0%, #020510 60%, #000 100%)`,
        }}
      >
        <AuroraLayer
          tones={[PALETTE.resolutionCyanGlow, PALETTE.transitionPurpleGlow, "rgba(139,92,246,0.12)"]}
          opacity={0.5}
          blur={140}
        />
        <GridBackdrop color="rgba(139,92,246,0.05)" spacing={80} opacity={0.4} />
        <ParticleField density={40} hue="rgba(139,92,246,0.4)" speed={0.15} opacity={0.5} />

        <ChapterMarker number="09" label="PSYCHOLOGY O.S." />

        <BrainAnatomy progress={progress} />
        <ZoneLabels progress={progress} />
        <SynapseNetwork progress={progress} />
        <PatternReadout progress={progress} />
        <AwarenessMeter progress={progress} />

        {/* Headline — top */}
        <motion.div
          className="absolute inset-x-0 top-[8%] flex flex-col items-center pointer-events-none px-6 z-40"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(139,92,246,0.12)",
                border: `1px solid ${PALETTE.transitionPurple}40`,
                color: PALETTE.transitionPurple,
              }}
            >
              Scene Nine · The Mirror
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.8vw, 66px)",
                color: PALETTE.ink,
                textShadow: `0 4px 40px rgba(139,92,246,0.25)`,
              }}
            >
              The mind{" "}
              <span className="italic font-light" style={{ color: PALETTE.resolutionCyan }}>
                made legible.
              </span>
            </h2>
            <p
              className="mt-3 max-w-lg mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(12px, 1.05vw, 15px)" }}
            >
              Left hemisphere: discipline, patience, structure, analysis. Right hemisphere:
              impulse, fear, ego, volatility. Every trade, both sides fire. Archio watches which
              wins.
            </p>
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
