"use client"

/* =====================================================================
   SCENE 08 — AI COPILOT (The Living Entity)
   A conversational intelligence rendered as a breathing orb with
   surrounding skill arcs. Demonstrates the four modes: Planner,
   Observer, Coach, Analyst. Live dialogue bubbles stream in.
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
import { Eye, Brain, Target, Activity, Sparkles } from "lucide-react"

/* ---------- The Living Orb (Copilot avatar) ---------- */

function LivingOrb({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.15], [0, 1])
  const scale = useTransform(progress, [0, 0.2], [0.6, 1])

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ opacity, scale }}
    >
      <div className="relative" style={{ width: 380, height: 380 }}>
        <svg viewBox="0 0 380 380" className="w-full h-full">
          <defs>
            <radialGradient id="orb-core" cx="50%" cy="50%">
              <stop offset="0%" stopColor={PALETTE.ink} stopOpacity="1" />
              <stop offset="20%" stopColor={PALETTE.resolutionCyan} stopOpacity="0.95" />
              <stop offset="55%" stopColor={PALETTE.transitionPurple} stopOpacity="0.7" />
              <stop offset="100%" stopColor={PALETTE.transitionPurple} stopOpacity="0" />
            </radialGradient>

            <radialGradient id="orb-shell" cx="50%" cy="40%">
              <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="0.4" />
              <stop offset="70%" stopColor={PALETTE.transitionPurple} stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id="orb-blur">
              <feGaussianBlur stdDeviation="10" />
            </filter>

            <filter id="orb-glow">
              <feGaussianBlur stdDeviation="4" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer aura glow */}
          <motion.circle
            cx="190"
            cy="190"
            r="170"
            fill="url(#orb-shell)"
            animate={{ r: [170, 185, 170], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#orb-blur)"
          />

          {/* Core orb */}
          <motion.circle
            cx="190"
            cy="190"
            r="115"
            fill="url(#orb-core)"
            animate={{ r: [115, 125, 115] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#orb-glow)"
          />

          {/* Inner iris ring */}
          <motion.circle
            cx="190"
            cy="190"
            r="85"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="0.5"
            strokeDasharray="1 3"
            opacity="0.6"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "190px 190px" }}
          />

          <motion.circle
            cx="190"
            cy="190"
            r="65"
            fill="none"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.7"
            strokeDasharray="3 2"
            opacity="0.5"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "190px 190px" }}
          />

          {/* Hexagonal sigil inside */}
          <motion.polygon
            points="190,135 232,160 232,220 190,245 148,220 148,160"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="0.8"
            opacity="0.7"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "190px 190px" }}
          />

          {/* Pupil — the reasoning point */}
          <motion.circle
            cx="190"
            cy="190"
            r="10"
            fill={PALETTE.ink}
            animate={{
              r: [10, 14, 10],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Vertical scan sweep */}
          <motion.line
            x1="190"
            y1="90"
            x2="190"
            y2="290"
            stroke={PALETTE.ink}
            strokeWidth="0.6"
            opacity="0.6"
            animate={{
              x1: [60, 320, 60],
              x2: [60, 320, 60],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Label */}
        <div className="absolute inset-x-0 top-full mt-6 text-center">
          <div
            className="text-[9px] font-mono tracking-[0.5em] uppercase mb-1"
            style={{ color: PALETTE.resolutionCyan }}
          >
            AI Copilot
          </div>
          <div
            className="text-[11px] tracking-wider"
            style={{ color: PALETTE.inkMuted }}
          >
            Always on · Always listening · Always learning
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Skill Arcs (the four modes) ---------- */

const MODES = [
  {
    id: "planner",
    name: "Planner",
    tag: "Pre-market",
    icon: Target,
    angle: 225,
    color: PALETTE.resolutionCyan,
  },
  {
    id: "observer",
    name: "Observer",
    tag: "In-session",
    icon: Eye,
    angle: 315,
    color: PALETTE.resolutionSky,
  },
  {
    id: "coach",
    name: "Coach",
    tag: "Psychology",
    icon: Brain,
    angle: 45,
    color: PALETTE.transitionPurple,
  },
  {
    id: "analyst",
    name: "Analyst",
    tag: "Post-mortem",
    icon: Activity,
    angle: 135,
    color: PALETTE.resolutionMint,
  },
] as const

function SkillArcs({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.15, 0.35, 1], [0, 1, 1])

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {MODES.map((mode, i) => {
        const rad = (mode.angle * Math.PI) / 180
        const distance = 280
        const x = Math.cos(rad) * distance
        const y = Math.sin(rad) * distance
        const Icon = mode.icon

        return (
          <motion.div
            key={mode.id}
            className="absolute top-1/2 left-1/2"
            style={{
              x: `calc(-50% + ${x}px)`,
              y: `calc(-50% + ${y}px)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glow halo */}
              <div
                className="absolute -inset-3 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${mode.color}30 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Node chip */}
              <div
                className="relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-xl"
                style={{
                  background: "rgba(10,14,22,0.75)",
                  border: `1px solid ${mode.color}55`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${mode.color}20`,
                  minWidth: 140,
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: `${mode.color}25`,
                    border: `1px solid ${mode.color}50`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: mode.color }} />
                </div>
                <div className="text-center">
                  <div
                    className="text-[13px] font-bold tracking-tight"
                    style={{ color: PALETTE.ink }}
                  >
                    {mode.name}
                  </div>
                  <div
                    className="text-[9px] font-mono tracking-[0.2em] mt-0.5"
                    style={{ color: mode.color }}
                  >
                    {mode.tag}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Connection lines from orb to each mode */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        {MODES.map((mode, i) => {
          const rad = (mode.angle * Math.PI) / 180
          const distance = 280
          const xViewport =
            typeof window !== "undefined" ? (Math.cos(rad) * distance) / window.innerWidth * 100 : 0
          const yViewport =
            typeof window !== "undefined" ? (Math.sin(rad) * distance) / window.innerHeight * 100 : 0

          return (
            <g key={mode.id}>
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${50 + xViewport}%`}
                y2={`${50 + yViewport}%`}
                stroke={mode.color}
                strokeWidth="0.6"
                strokeDasharray="2 6"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.15 }}
              />
              <motion.circle
                r="2"
                fill={mode.color}
                filter={`drop-shadow(0 0 6px ${mode.color})`}
                animate={{
                  cx: [`50%`, `${50 + xViewport}%`],
                  cy: [`50%`, `${50 + yViewport}%`],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: 1 + i * 0.3,
                  ease: "easeOut",
                }}
              />
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

/* ---------- Conversation Bubbles ---------- */

const DIALOGUE = [
  {
    role: "user",
    text: "I&apos;m thinking about going long on NQ.",
    x: "12%",
    y: "22%",
    delay: 1.5,
  },
  {
    role: "copilot",
    text: "You&apos;ve taken three NQ longs at this hour this week. Two stopped out.",
    x: "10%",
    y: "42%",
    delay: 2.5,
  },
  {
    role: "user",
    text: "Show me the entry conditions from my playbook.",
    x: "14%",
    y: "62%",
    delay: 3.5,
  },
  {
    role: "copilot",
    text: "Three of four conditions met. One missing: volume confirmation. Holding off is +0.3R expectancy for you.",
    x: "12%",
    y: "80%",
    delay: 4.5,
  },
  {
    role: "copilot",
    text: "Heart rate elevated. Last session you sized up after drawdown.",
    x: "62%",
    y: "18%",
    delay: 5,
  },
  {
    role: "user",
    text: "Good catch. Let&apos;s wait.",
    x: "68%",
    y: "38%",
    delay: 5.5,
  },
  {
    role: "copilot",
    text: "Alert set. I&apos;ll surface when volume signature appears.",
    x: "66%",
    y: "58%",
    delay: 6.5,
  },
  {
    role: "copilot",
    text: "Session notes staged for your journal.",
    x: "64%",
    y: "78%",
    delay: 7.5,
  },
] as const

function Dialogue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.25, 0.45, 0.95, 1], [0, 1, 1, 0.5])

  return (
    <motion.div className="absolute inset-0 pointer-events-none z-30" style={{ opacity }}>
      {DIALOGUE.map((d, i) => {
        const isUser = d.role === "user"
        return (
          <motion.div
            key={i}
            className="absolute max-w-[240px]"
            style={{ left: d.x, top: d.y }}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: d.delay }}
          >
            {/* Role label */}
            <div
              className="text-[8px] font-mono tracking-[0.35em] uppercase mb-1"
              style={{
                color: isUser ? PALETTE.inkMuted : PALETTE.resolutionCyan,
              }}
            >
              {isUser ? "You" : "· Copilot ·"}
            </div>

            {/* Bubble */}
            <div
              className="px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed backdrop-blur-xl"
              style={{
                background: isUser ? "rgba(24,30,40,0.75)" : "rgba(6,30,40,0.75)",
                border: `1px solid ${
                  isUser ? PALETTE.border : `${PALETTE.resolutionCyan}40`
                }`,
                color: isUser ? PALETTE.inkSoft : PALETTE.ink,
                boxShadow: isUser
                  ? "0 6px 24px rgba(0,0,0,0.4)"
                  : `0 6px 24px rgba(0,0,0,0.4), 0 0 18px ${PALETTE.resolutionCyanGlow}`,
              }}
              dangerouslySetInnerHTML={{ __html: d.text }}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ---------- Skill Capability Strip ---------- */

const CAPABILITIES = [
  "Session Plan Drafting",
  "Emotional State Detection",
  "Entry Quality Scoring",
  "Risk Deviation Alerts",
  "Journal Auto-Composition",
  "Playbook Compliance",
  "Recovery Protocol",
  "Live Coaching Interrupts",
]

function CapabilityStrip({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.55, 0.75, 1], [0, 1, 1])

  return (
    <motion.div
      className="absolute bottom-[6%] inset-x-0 flex justify-center pointer-events-none z-40"
      style={{ opacity }}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-2 max-w-4xl px-4"
      >
        {CAPABILITIES.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 3.5 + i * 0.08 }}
            className="px-3 py-1.5 rounded-full text-[10.5px] font-medium tracking-tight"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: `1px solid ${PALETTE.resolutionCyan}30`,
              color: PALETTE.inkSoft,
            }}
          >
            <Sparkles className="inline-block w-2.5 h-2.5 mr-1.5" style={{ color: PALETTE.resolutionCyan }} />
            {c}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ---------- Scene Export ---------- */

export function SceneCopilot() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const headlineOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5])

  return (
    <Scene id="scene-copilot" height="340vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, #051825 0%, #020610 65%, #000 100%)`,
        }}
      >
        <AuroraLayer
          tones={[PALETTE.resolutionCyanGlow, PALETTE.transitionPurpleGlow, "rgba(56,189,248,0.12)"]}
          opacity={0.55}
          blur={130}
        />
        <GridBackdrop color="rgba(6,182,212,0.05)" spacing={72} opacity={0.4} />
        <ParticleField density={45} hue="rgba(6,182,212,0.45)" speed={0.2} opacity={0.55} />

        <ChapterMarker number="08" label="THE COPILOT" />

        <LivingOrb progress={progress} />
        <SkillArcs progress={progress} />
        <Dialogue progress={progress} />
        <CapabilityStrip progress={progress} />

        {/* Headline — top */}
        <motion.div
          className="absolute inset-x-0 top-[8%] flex flex-col items-center pointer-events-none px-6 z-40"
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
              Scene Eight · The Copilot
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.6vw, 64px)",
                color: PALETTE.ink,
                textShadow: `0 4px 40px ${PALETTE.resolutionCyanGlow}`,
              }}
            >
              A second pair of eyes{" "}
              <span className="italic font-light" style={{ color: PALETTE.resolutionCyan }}>
                that never blinks.
              </span>
            </h2>
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
