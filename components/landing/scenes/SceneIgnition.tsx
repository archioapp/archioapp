"use client"

/* =====================================================================
   SCENE 06 — IGNITION (The Shift)
   The pivot point of the entire narrative. Chaos collapses. A portal
   opens. ArchioAI — the operating system — emerges from the dark.
   Red/purple decay gives way to cyan/teal clarity.
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
  GlowOrb,
} from "../LandingShared"

/* ---------- Collapsing Chaos Field ---------- */

function ChaosCollapse({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.25, 0.4], [1, 0.5, 0])
  const scale = useTransform(progress, [0, 0.3], [1, 0.7])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, scale }}
    >
      <ParticleField density={40} hue="rgba(239,68,68,0.3)" speed={0.8} opacity={0.6} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${PALETTE.chaosRedGlow} 0%, transparent 55%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Red debris streaks falling */}
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 10 + ((i * 73) % 90)
          return (
            <motion.line
              key={i}
              x1={`${x}%`}
              y1="0%"
              x2={`${x - 3}%`}
              y2="100%"
              stroke={PALETTE.chaosRed}
              strokeWidth="0.5"
              opacity="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 2.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

/* ---------- The Portal (concentric rings igniting) ---------- */

function PortalIgnition({ progress }: { progress: MotionValue<number> }) {
  const portalScale = useTransform(progress, [0.2, 0.55, 0.75], [0, 1, 1.15])
  const portalOpacity = useTransform(progress, [0.2, 0.4, 1], [0, 1, 1])
  const expansion = useTransform(progress, [0.5, 1], [1, 1.3])

  const ringCount = 9
  const rings = Array.from({ length: ringCount }, (_, i) => i)

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity: portalOpacity, scale: portalScale }}
    >
      <motion.div
        className="relative"
        style={{ width: 720, height: 720, scale: expansion }}
      >
        <svg viewBox="0 0 720 720" className="w-full h-full">
          <defs>
            <radialGradient id="portal-core">
              <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="1" />
              <stop offset="30%" stopColor={PALETTE.resolutionTeal} stopOpacity="0.8" />
              <stop offset="60%" stopColor={PALETTE.transitionPurple} stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id="portal-glow">
              <feGaussianBlur stdDeviation="6" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="1" />
              <stop offset="50%" stopColor={PALETTE.transitionPurple} stopOpacity="0.8" />
              <stop offset="100%" stopColor={PALETTE.resolutionTeal} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Outer aura */}
          <circle cx="360" cy="360" r="340" fill="url(#portal-core)" opacity="0.25" />

          {/* Concentric rings */}
          {rings.map((i) => {
            const r = 60 + i * 32
            const duration = 20 + i * 2
            return (
              <motion.circle
                key={i}
                cx="360"
                cy="360"
                r={r}
                fill="none"
                stroke="url(#ring-grad)"
                strokeWidth={i === 0 ? 2 : i < 3 ? 1 : 0.6}
                strokeDasharray={i === 0 ? "none" : `${2 + i * 0.5} ${4 + i * 1.2}`}
                opacity={0.9 - i * 0.07}
                filter="url(#portal-glow)"
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "360px 360px" }}
              />
            )
          })}

          {/* Inner pulsing core */}
          <motion.circle
            cx="360"
            cy="360"
            r="36"
            fill="url(#portal-core)"
            animate={{
              r: [36, 48, 36],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#portal-glow)"
          />

          {/* Orbiting energy nodes */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <motion.g
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "360px 360px" }}
            >
              <circle
                cx={360 + Math.cos((angle * Math.PI) / 180) * 220}
                cy={360 + Math.sin((angle * Math.PI) / 180) * 220}
                r="5"
                fill={PALETTE.resolutionCyan}
                filter="url(#portal-glow)"
              />
            </motion.g>
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Convergence Lines (everything pulls to center) ---------- */

function ConvergenceLines({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.25, 0.5, 0.8], [0, 1, 0.4])

  const lineCount = 24
  const lines = Array.from({ length: lineCount }, (_, i) => {
    const angle = (i / lineCount) * Math.PI * 2
    const len = 38 + ((i * 13) % 18)
    return {
      x1: `${50 + Math.cos(angle) * len}%`,
      y1: `${50 + Math.sin(angle) * len}%`,
      x2: "50%",
      y2: "50%",
      delay: i * 0.04,
    }
  })

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="converge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="0" />
            <stop offset="85%" stopColor={PALETTE.resolutionCyan} stopOpacity="0.9" />
            <stop offset="100%" stopColor={PALETTE.resolutionCyan} stopOpacity="1" />
          </linearGradient>
        </defs>
        {lines.map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="url(#converge-grad)"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{
              pathLength: [0, 1, 1],
              opacity: [0, 0.8, 0.3],
            }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 2.5,
              delay: l.delay,
              times: [0, 0.6, 1],
            }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

/* ---------- System Sigil (ArchioAI logo mark) ---------- */

function ArchioSigil({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.6, 0.82, 1], [0, 1, 1])
  const scale = useTransform(progress, [0.6, 0.82], [0.5, 1])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, scale }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.svg
          viewBox="0 0 120 120"
          className="w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="sigil-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={PALETTE.resolutionCyan} />
              <stop offset="100%" stopColor={PALETTE.transitionPurple} />
            </linearGradient>
          </defs>
          {/* Hexagonal core */}
          <polygon
            points="60,18 96,38 96,82 60,102 24,82 24,38"
            fill="none"
            stroke="url(#sigil-grad)"
            strokeWidth="1.2"
          />
          {/* Inner triangle */}
          <polygon
            points="60,36 84,72 36,72"
            fill="none"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="1"
            opacity="0.7"
          />
          {/* Center dot */}
          <circle cx="60" cy="60" r="5" fill={PALETTE.resolutionCyan} />
          <circle cx="60" cy="60" r="5" fill={PALETTE.resolutionCyan} opacity="0.4">
            <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </motion.svg>

        <div className="text-center">
          <div
            className="text-[10px] font-mono tracking-[0.6em] uppercase mb-2"
            style={{ color: PALETTE.resolutionCyan }}
          >
            Operating System Initialized
          </div>
          <div
            className="font-black tracking-tight"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              background: `linear-gradient(135deg, ${PALETTE.resolutionCyan} 0%, ${PALETTE.transitionPurple} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: `0 0 60px ${PALETTE.resolutionCyanGlow}`,
            }}
          >
            ArchioAI
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Boot Sequence Ticker ---------- */

const BOOT_LINES = [
  { text: "INITIALIZING NEURAL MESH", status: "OK" },
  { text: "LINKING STRATEGY ENGINE", status: "OK" },
  { text: "CALIBRATING PSYCHOLOGY CORE", status: "OK" },
  { text: "ESTABLISHING COMMUNITY LAYER", status: "OK" },
  { text: "SYNCHRONIZING MEMORY BANK", status: "OK" },
  { text: "UNIFYING THE STACK", status: "LIVE" },
]

function BootSequence({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.4, 0.6, 0.85, 1], [0, 1, 1, 0.4])

  return (
    <motion.div
      className="absolute bottom-[12%] right-[6%] flex flex-col gap-1 pointer-events-none z-30"
      style={{ opacity }}
    >
      {BOOT_LINES.map((line, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 text-[10px] font-mono tracking-[0.15em]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1.2 + i * 0.25 }}
          style={{ color: PALETTE.inkMuted }}
        >
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: line.status === "LIVE" ? PALETTE.resolutionGreen : PALETTE.resolutionCyan,
            }}
            animate={{ opacity: line.status === "LIVE" ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="uppercase">{line.text}</span>
          <span
            className="ml-2"
            style={{ color: line.status === "LIVE" ? PALETTE.resolutionGreen : PALETTE.resolutionCyan }}
          >
            [{line.status}]
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- The Five Wounds — ghosted callouts being absorbed ---------- */

function WoundsAbsorbed({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.35, 0.55, 0.7], [0, 0.7, 0])

  const wounds = [
    { label: "TOOL CHAOS", x: "10%", y: "18%" },
    { label: "GURU LIES", x: "86%", y: "22%" },
    { label: "ISOLATION", x: "8%", y: "78%" },
    { label: "PSYCHOLOGY", x: "88%", y: "76%" },
    { label: "DATA BLACK HOLE", x: "50%", y: "10%" },
  ]

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {wounds.map((w, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center gap-2"
          style={{ left: w.x, top: w.y, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{
            opacity: [0, 1, 0],
            scale: [0.9, 1, 0.6],
            x: ["0%", "0%", "calc(50vw - 50%)"],
          }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 3.5, delay: 1.5 + i * 0.15 }}
        >
          <span
            className="text-[9px] font-mono tracking-[0.3em] uppercase px-2 py-1 rounded-sm"
            style={{
              color: PALETTE.chaosRed,
              background: "rgba(239,68,68,0.08)",
              border: `1px solid ${PALETTE.chaosRedGlow}`,
              textDecoration: "line-through",
              textDecorationColor: PALETTE.chaosRed,
            }}
          >
            {w.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Scene Export ---------- */

export function SceneIgnition() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const bgFade = useTransform(
    progress,
    [0, 0.3, 0.6, 1],
    [
      `radial-gradient(ellipse at center, #0b0510 0%, ${PALETTE.chaosBackgroundDeep} 100%)`,
      `radial-gradient(ellipse at center, #0a0520 0%, #030312 100%)`,
      `radial-gradient(ellipse at center, #051824 0%, #020814 100%)`,
      `radial-gradient(ellipse at center, #062228 0%, #020810 100%)`,
    ],
  )

  const headlineOpacity = useTransform(progress, [0.7, 0.85, 1], [0, 1, 1])

  return (
    <Scene id="scene-ignition" height="340vh">
      <motion.div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{ background: bgFade }}
      >
        <GridBackdrop color="rgba(6,182,212,0.05)" spacing={72} opacity={0.5} />

        <ChapterMarker number="06" label="THE IGNITION" />

        <ChaosCollapse progress={progress} />
        <WoundsAbsorbed progress={progress} />
        <ConvergenceLines progress={progress} />

        <GlowOrb
          color={PALETTE.resolutionCyan}
          size={900}
          intensity={0.35}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <PortalIgnition progress={progress} />
        <ArchioSigil progress={progress} />
        <BootSequence progress={progress} />

        <ParticleField density={60} hue="rgba(6,182,212,0.5)" speed={0.4} opacity={0.8} />

        {/* Final headline */}
        <motion.div
          className="absolute inset-x-0 top-[14%] flex flex-col items-center pointer-events-none px-6 z-40"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: `${PALETTE.resolutionCyanGlow}`,
                border: `1px solid ${PALETTE.resolutionCyan}40`,
                color: PALETTE.resolutionCyan,
              }}
            >
              Scene Six · Arrival
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(36px, 5.6vw, 82px)",
                color: PALETTE.ink,
                textShadow: `0 4px 60px ${PALETTE.resolutionCyanGlow}`,
              }}
            >
              The stack{" "}
              <span className="italic font-light" style={{ color: PALETTE.resolutionCyan }}>
                unifies.
              </span>
              <br />
              <span style={{ color: PALETTE.inkSoft }}>One operating system.</span>
              <br />
              <span className="italic font-light" style={{ color: PALETTE.transitionPurple }}>
                Built for the mind behind the chart.
              </span>
            </h2>
          </div>
        </motion.div>
      </motion.div>
    </Scene>
  )
}
