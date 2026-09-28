"use client"

/* =====================================================================
   SCENE 07 — UNIFIED ECOSYSTEM (The Six Pillars Take Shape)
   After the ignition, we reveal the architecture. Six interconnected
   modules orbit a living neural core. The stack is shown as a single
   organism rather than a list of features.
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
import {
  Brain,
  Users,
  LineChart,
  Compass,
  Sparkles,
  Database,
} from "lucide-react"

/* ---------- Six Pillars Configuration ---------- */

const PILLARS = [
  {
    id: "intelligence",
    name: "Strategy Intelligence",
    short: "STRATEGY",
    desc: "Systems, playbooks, backtest memory — an executable library of every edge a trader builds.",
    icon: Compass,
    angle: 270,
    color: PALETTE.resolutionCyan,
    tint: "rgba(6,182,212,0.22)",
  },
  {
    id: "psychology",
    name: "Psychology Operating System",
    short: "PSYCHOLOGY",
    desc: "The mirror that sees the loop. Emotional state, left/right hemisphere patterns, self-sabotage mapped in real time.",
    icon: Brain,
    angle: 330,
    color: PALETTE.transitionPurple,
    tint: "rgba(139,92,246,0.22)",
  },
  {
    id: "community",
    name: "Live Community",
    short: "COMMUNITY",
    desc: "Rooms, stages, mentors. A coliseum of live traders at every hour of the market.",
    icon: Users,
    angle: 30,
    color: PALETTE.resolutionMint,
    tint: "rgba(52,211,153,0.22)",
  },
  {
    id: "performance",
    name: "Performance Analytics",
    short: "ANALYTICS",
    desc: "Trades, equity, sessions, outcomes — the full truth of your account, reconstructed.",
    icon: LineChart,
    angle: 90,
    color: PALETTE.resolutionSky,
    tint: "rgba(56,189,248,0.22)",
  },
  {
    id: "copilot",
    name: "AI Copilot",
    short: "COPILOT",
    desc: "A live entity that remembers you, challenges you, drafts your plan, and narrates your session.",
    icon: Sparkles,
    angle: 150,
    color: PALETTE.transitionMagenta,
    tint: "rgba(192,38,211,0.22)",
  },
  {
    id: "memory",
    name: "Unified Memory Bank",
    short: "MEMORY",
    desc: "Every chart, note, trade, emotion, decision — preserved, searchable, linked.",
    icon: Database,
    angle: 210,
    color: PALETTE.resolutionTeal,
    tint: "rgba(20,184,166,0.22)",
  },
] as const

/* ---------- Central Neural Core ---------- */

function NeuralCore({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 0.3], [0.5, 1])
  const opacity = useTransform(progress, [0, 0.2], [0, 1])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, scale }}
    >
      <div className="relative" style={{ width: 220, height: 220 }}>
        <svg viewBox="0 0 220 220" className="w-full h-full">
          <defs>
            <radialGradient id="core-grad">
              <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="1" />
              <stop offset="40%" stopColor={PALETTE.transitionPurple} stopOpacity="0.7" />
              <stop offset="100%" stopColor={PALETTE.transitionPurple} stopOpacity="0" />
            </radialGradient>
            <filter id="core-glow">
              <feGaussianBlur stdDeviation="6" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring */}
          <motion.circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.8"
            strokeDasharray="2 6"
            opacity="0.6"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "110px 110px" }}
          />

          {/* Inner spinning ring */}
          <motion.circle
            cx="110"
            cy="110"
            r="68"
            fill="none"
            stroke={PALETTE.transitionPurple}
            strokeWidth="0.5"
            strokeDasharray="1 8"
            opacity="0.5"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "110px 110px" }}
          />

          {/* Glowing core */}
          <circle cx="110" cy="110" r="50" fill="url(#core-grad)" filter="url(#core-glow)" />

          {/* Inner hexagonal sigil */}
          <motion.polygon
            points="110,75 140,92 140,128 110,145 80,128 80,92"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="0.8"
            opacity="0.8"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "110px 110px" }}
          />

          {/* Pulse dot */}
          <motion.circle
            cx="110"
            cy="110"
            r="4"
            fill={PALETTE.ink}
            animate={{ r: [4, 8, 4], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Label */}
        <div
          className="absolute inset-x-0 top-full mt-4 text-center"
          style={{ transform: "translateY(8px)" }}
        >
          <div
            className="text-[9px] font-mono tracking-[0.4em] uppercase"
            style={{ color: PALETTE.inkMuted }}
          >
            Archio
          </div>
          <div
            className="text-[14px] font-semibold tracking-wider"
            style={{ color: PALETTE.ink }}
          >
            THE CORE
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Pillar Node ---------- */

function PillarNode({
  pillar,
  progress,
  index,
}: {
  pillar: (typeof PILLARS)[number]
  progress: MotionValue<number>
  index: number
}) {
  const start = 0.15 + index * 0.05
  const end = start + 0.15

  const nodeOpacity = useTransform(progress, [start, end], [0, 1])
  const nodeScale = useTransform(progress, [start, end], [0.3, 1])

  // Compute orbital position
  const radius = 320
  const rad = (pillar.angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  const Icon = pillar.icon

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        x: `calc(-50% + ${x}px)`,
        y: `calc(-50% + ${y}px)`,
        opacity: nodeOpacity,
        scale: nodeScale,
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 5 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        }}
      >
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${pillar.tint} 0%, transparent 70%)`,
            filter: "blur(30px)",
            transform: "scale(1.8)",
          }}
        />

        {/* Node card */}
        <div
          className="relative w-48 rounded-2xl overflow-hidden backdrop-blur-xl"
          style={{
            background: "rgba(10,14,22,0.78)",
            border: `1px solid ${pillar.color}66`,
            boxShadow: `0 12px 48px rgba(0,0,0,0.6), 0 0 24px ${pillar.tint}`,
          }}
        >
          {/* Top gradient bar */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
            }}
          />

          <div className="p-4">
            {/* Icon + short label */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: pillar.tint,
                  border: `1px solid ${pillar.color}40`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: pillar.color }} />
              </div>
              <div
                className="text-[9px] font-mono tracking-[0.3em]"
                style={{ color: pillar.color }}
              >
                {pillar.short}
              </div>
            </div>

            {/* Title */}
            <div
              className="text-[13px] font-semibold mb-1.5 leading-tight"
              style={{ color: PALETTE.ink }}
            >
              {pillar.name}
            </div>

            {/* Description */}
            <div
              className="text-[10.5px] leading-relaxed"
              style={{ color: PALETTE.inkMuted }}
            >
              {pillar.desc}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Connection Lines (core → each pillar) ---------- */

function CoreConnections({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.45, 0.65, 1], [0, 0.7, 0.5])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    >
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        <defs>
          {PILLARS.map((p) => (
            <linearGradient
              key={`grad-${p.id}`}
              id={`link-${p.id}`}
              x1="50%"
              y1="50%"
              x2={`${50 + Math.cos((p.angle * Math.PI) / 180) * 22}%`}
              y2={`${50 + Math.sin((p.angle * Math.PI) / 180) * 22}%`}
            >
              <stop offset="0%" stopColor={p.color} stopOpacity="1" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.1" />
            </linearGradient>
          ))}
        </defs>

        {PILLARS.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180
          const x = 50 + (Math.cos(rad) * 320) / (typeof window !== "undefined" ? window.innerWidth : 1400) * 100
          const y = 50 + (Math.sin(rad) * 320) / (typeof window !== "undefined" ? window.innerHeight : 800) * 100

          return (
            <g key={p.id}>
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke={`url(#link-${p.id})`}
                strokeWidth="1.2"
                strokeDasharray="3 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.8, delay: 0.6 + i * 0.12 }}
              />
              {/* Pulsing data particle traveling outward */}
              <motion.circle
                r="2.5"
                fill={p.color}
                filter={`drop-shadow(0 0 6px ${p.color})`}
                animate={{
                  cx: [`50%`, `${x}%`],
                  cy: [`50%`, `${y}%`],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1.2 + i * 0.25,
                  ease: "easeOut",
                }}
              />
            </g>
          )
        })}

        {/* Ring-to-ring connections (neighboring pillars) */}
        {PILLARS.map((p, i) => {
          const next = PILLARS[(i + 1) % PILLARS.length]
          const r1 = (p.angle * Math.PI) / 180
          const r2 = (next.angle * Math.PI) / 180
          const x1 = 50 + (Math.cos(r1) * 320) / (typeof window !== "undefined" ? window.innerWidth : 1400) * 100
          const y1 = 50 + (Math.sin(r1) * 320) / (typeof window !== "undefined" ? window.innerHeight : 800) * 100
          const x2 = 50 + (Math.cos(r2) * 320) / (typeof window !== "undefined" ? window.innerWidth : 1400) * 100
          const y2 = 50 + (Math.sin(r2) * 320) / (typeof window !== "undefined" ? window.innerHeight : 800) * 100
          return (
            <motion.line
              key={`ring-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={PALETTE.resolutionCyan}
              strokeWidth="0.4"
              strokeDasharray="1 6"
              opacity="0.25"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 1.5 + i * 0.1 }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

/* ---------- Orbital Dust (gentle outer atmosphere) ---------- */

function OrbitalDust() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[380, 480, 580].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: r * 2,
            height: r * 2,
            border: `1px dashed rgba(6,182,212,${0.08 - i * 0.02})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 15, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

/* ---------- Scene Export ---------- */

export function SceneEcosystem() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const headlineOpacity = useTransform(progress, [0, 0.15, 0.9, 1], [0, 1, 1, 0.5])

  return (
    <Scene id="scene-ecosystem" height="340vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, #061a26 0%, #020610 60%, #000 100%)`,
        }}
      >
        <AuroraLayer
          tones={[PALETTE.resolutionCyanGlow, PALETTE.transitionPurpleGlow, "rgba(20,184,166,0.15)"]}
          opacity={0.5}
          blur={140}
        />
        <GridBackdrop color="rgba(6,182,212,0.06)" spacing={96} opacity={0.55} perspective />
        <ParticleField density={50} hue="rgba(6,182,212,0.5)" speed={0.18} opacity={0.55} />

        <ChapterMarker number="07" label="THE ECOSYSTEM" />

        <OrbitalDust />
        <CoreConnections progress={progress} />
        <NeuralCore progress={progress} />
        {PILLARS.map((p, i) => (
          <PillarNode key={p.id} pillar={p} progress={progress} index={i} />
        ))}

        {/* Headline — top */}
        <motion.div
          className="absolute inset-x-0 top-[9%] flex flex-col items-center pointer-events-none px-6 z-40"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: PALETTE.resolutionCyanGlow,
                border: `1px solid ${PALETTE.resolutionCyan}40`,
                color: PALETTE.resolutionCyan,
              }}
            >
              Scene Seven · Architecture
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(32px, 5vw, 70px)",
                color: PALETTE.ink,
                textShadow: `0 4px 40px ${PALETTE.resolutionCyanGlow}`,
              }}
            >
              Six systems.{" "}
              <span className="italic font-light" style={{ color: PALETTE.resolutionCyan }}>
                One organism.
              </span>
            </h2>
            <p
              className="mt-4 max-w-lg mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(12px, 1.05vw, 15px)" }}
            >
              Every pillar speaks to every other pillar. Strategy informs psychology. Community
              shapes analytics. The core remembers everything.
            </p>
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
