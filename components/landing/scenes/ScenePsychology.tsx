"use client"

/* =====================================================================
   SCENE 05 — PSYCHOLOGY (The Mind Is A Mirror)
   The fifth wound — emotional loops, self-sabotage, the recursive
   prison of unexamined patterns. No one tracks why traders fail from
   the inside. The same mistake, forever.
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
} from "../LandingShared"

/* ---------- Infinite Loop Ring ---------- */

function RecursiveLoop({ progress }: { progress: MotionValue<number> }) {
  const ringOpacity = useTransform(progress, [0, 0.25, 1], [0, 1, 1])
  const ringScale = useTransform(progress, [0, 0.3], [0.6, 1])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity: ringOpacity, scale: ringScale }}
    >
      <div className="relative" style={{ width: 620, height: 620 }}>
        {/* Outer ring — rotates slowly */}
        <motion.svg
          viewBox="0 0 620 620"
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="loop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={PALETTE.chaosRed} stopOpacity="0.6" />
              <stop offset="50%" stopColor={PALETTE.chaosOrange} stopOpacity="0.3" />
              <stop offset="100%" stopColor={PALETTE.chaosPurple} stopOpacity="0.5" />
            </linearGradient>
            <filter id="loop-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="310"
            cy="310"
            r="280"
            fill="none"
            stroke="url(#loop-gradient)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            filter="url(#loop-glow)"
          />
          <circle
            cx="310"
            cy="310"
            r="280"
            fill="none"
            stroke={PALETTE.chaosRed}
            strokeWidth="0.5"
            strokeDasharray="1 20"
            opacity="0.4"
          />
        </motion.svg>

        {/* Inner ring — rotates opposite */}
        <motion.svg
          viewBox="0 0 620 620"
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="310"
            cy="310"
            r="220"
            fill="none"
            stroke={PALETTE.chaosPurple}
            strokeWidth="0.8"
            strokeDasharray="2 14"
            opacity="0.5"
          />
          <circle
            cx="310"
            cy="310"
            r="180"
            fill="none"
            stroke={PALETTE.inkFaint}
            strokeWidth="0.5"
            strokeDasharray="1 30"
            opacity="0.4"
          />
        </motion.svg>

        {/* Orbiting error markers */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{ width: 0, height: 0 }}
            animate={{ rotate: angle + 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute"
              style={{
                transform: "translate(-50%, -50%) translateY(-280px)",
                left: 0,
                top: 0,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: PALETTE.chaosRed,
                  boxShadow: `0 0 12px ${PALETTE.chaosRed}`,
                  opacity: 0.8,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ---------- The Mirror (trader face reflection) ---------- */

function MirrorFigure({ progress }: { progress: MotionValue<number> }) {
  const figureOpacity = useTransform(progress, [0.1, 0.3, 0.9, 1], [0, 1, 1, 0.5])
  const shiverX = useTransform(progress, [0, 1], [0, 0])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity: figureOpacity, x: shiverX }}
    >
      <svg
        viewBox="0 0 400 460"
        className="relative z-10"
        style={{
          width: 260,
          height: 300,
          filter: `drop-shadow(0 0 40px ${PALETTE.chaosRedGlow})`,
        }}
      >
        <defs>
          <linearGradient id="silhouette-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#0a0a12" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#05050a" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="face-glow">
            <stop offset="0%" stopColor={PALETTE.chaosRed} stopOpacity="0.3" />
            <stop offset="100%" stopColor={PALETTE.chaosRed} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Head silhouette */}
        <ellipse cx="200" cy="140" rx="82" ry="96" fill="url(#silhouette-grad)" />
        <ellipse cx="200" cy="140" rx="82" ry="96" fill="url(#face-glow)" opacity="0.4" />

        {/* Shoulders */}
        <path
          d="M 100 260 Q 200 220 300 260 L 320 460 L 80 460 Z"
          fill="url(#silhouette-grad)"
        />

        {/* Eyes — two hollow glowing points */}
        <motion.circle
          cx="175"
          cy="135"
          r="3"
          fill={PALETTE.chaosRed}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ filter: `drop-shadow(0 0 6px ${PALETTE.chaosRed})` }}
        />
        <motion.circle
          cx="225"
          cy="135"
          r="3"
          fill={PALETTE.chaosRed}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 0.15 }}
          style={{ filter: `drop-shadow(0 0 6px ${PALETTE.chaosRed})` }}
        />

        {/* Mirror crack line */}
        <motion.path
          d="M 200 40 L 215 120 L 198 180 L 220 240 L 200 320"
          stroke={PALETTE.inkMuted}
          strokeWidth="0.4"
          fill="none"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 3, delay: 1.5 }}
        />
      </svg>
    </motion.div>
  )
}

/* ---------- Reflection — the same figure, mirrored ---------- */

function MirrorReflection({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.3, 0.55, 1], [0, 0.45, 0.35])
  const x = useTransform(progress, [0.3, 0.6], [0, 280])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, x }}
    >
      <svg
        viewBox="0 0 400 460"
        className="relative"
        style={{
          width: 260,
          height: 300,
          transform: "scaleX(-1)",
          filter: "blur(1.5px)",
        }}
      >
        <ellipse cx="200" cy="140" rx="82" ry="96" fill="rgba(10,10,18,0.6)" />
        <path
          d="M 100 260 Q 200 220 300 260 L 320 460 L 80 460 Z"
          fill="rgba(10,10,18,0.5)"
        />
        <circle cx="175" cy="135" r="2.5" fill={PALETTE.chaosRed} opacity="0.5" />
        <circle cx="225" cy="135" r="2.5" fill={PALETTE.chaosRed} opacity="0.5" />
      </svg>
    </motion.div>
  )
}

/* ---------- Third Reflection (further, fainter) ---------- */

function MirrorReflectionFar({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.5, 0.75, 1], [0, 0.2, 0.15])
  const x = useTransform(progress, [0.5, 0.8], [-100, -420])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, x }}
    >
      <svg
        viewBox="0 0 400 460"
        className="relative"
        style={{
          width: 180,
          height: 208,
          filter: "blur(3px)",
        }}
      >
        <ellipse cx="200" cy="140" rx="82" ry="96" fill="rgba(10,10,18,0.5)" />
        <path
          d="M 100 260 Q 200 220 300 260 L 320 460 L 80 460 Z"
          fill="rgba(10,10,18,0.4)"
        />
        <circle cx="175" cy="135" r="2" fill={PALETTE.chaosRed} opacity="0.3" />
        <circle cx="225" cy="135" r="2" fill={PALETTE.chaosRed} opacity="0.3" />
      </svg>
    </motion.div>
  )
}

/* ---------- Intrusive Thought Bubbles ---------- */

const INTRUSIVE_THOUGHTS = [
  { text: "Why did I move the stop?", x: "18%", y: "22%", delay: 1.2 },
  { text: "I told myself I wouldn't.", x: "72%", y: "18%", delay: 1.6 },
  { text: "One more trade. Just one.", x: "14%", y: "60%", delay: 2.0 },
  { text: "Revenge it. Recover it tonight.", x: "76%", y: "58%", delay: 2.4 },
  { text: "I always do this.", x: "22%", y: "82%", delay: 2.8 },
  { text: "I knew it was wrong.", x: "70%", y: "78%", delay: 3.2 },
]

function IntrusiveThoughts({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.2, 0.4, 0.95, 1], [0, 1, 1, 0.6])

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {INTRUSIVE_THOUGHTS.map((t, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: t.x, top: t.y, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, y: 10, filter: "blur(12px)" }}
          whileInView={{
            opacity: [0, 0.95, 0.7, 0.95, 0.7],
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 4,
            delay: t.delay,
            times: [0, 0.15, 0.4, 0.7, 1],
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div
            className="px-3 py-2 rounded text-[13px] italic font-light tracking-tight"
            style={{
              color: PALETTE.inkSoft,
              background: "rgba(10,10,18,0.65)",
              border: `1px solid ${PALETTE.chaosRedGlow}`,
              backdropFilter: "blur(6px)",
              textShadow: `0 0 20px ${PALETTE.chaosRedGlow}`,
              fontFamily: "var(--font-serif, Georgia), serif",
              whiteSpace: "nowrap",
            }}
          >
            &ldquo;{t.text}&rdquo;
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Pattern Repeat — the same candle chart, over and over ---------- */

function PatternRepeat({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.55, 0.75, 1], [0, 0.8, 0.7])

  const patterns = [
    { x: "6%", y: "14%", label: "MON" },
    { x: "6%", y: "44%", label: "TUE" },
    { x: "6%", y: "74%", label: "WED" },
  ]

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {patterns.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.x, top: p.y, width: 160 }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 2.4 + i * 0.3 }}
        >
          <div
            className="text-[9px] font-mono tracking-[0.3em] mb-1.5"
            style={{ color: PALETTE.inkDim }}
          >
            {p.label} · SAME PATTERN
          </div>
          <svg viewBox="0 0 160 60" className="w-full h-16">
            {/* Green rally */}
            {Array.from({ length: 6 }).map((_, j) => (
              <rect
                key={j}
                x={6 + j * 10}
                y={35 - j * 2}
                width="4"
                height={10 + j * 1.5}
                fill={PALETTE.resolutionGreen}
                opacity="0.5"
              />
            ))}
            {/* Stop hunt — red wick */}
            <line x1="72" y1="30" x2="72" y2="52" stroke={PALETTE.chaosRed} strokeWidth="1" />
            <rect x="70" y="30" width="4" height="6" fill={PALETTE.chaosRed} />
            {/* Revenge trade red plunge */}
            {Array.from({ length: 8 }).map((_, j) => (
              <rect
                key={j}
                x={82 + j * 9}
                y={32}
                width="4"
                height={12 + j * 2}
                fill={PALETTE.chaosCrimson}
                opacity={0.9 - j * 0.05}
              />
            ))}
          </svg>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Emotion Tangle (tangled chains) ---------- */

function EmotionTangle({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.4, 0.6, 1], [0, 0.6, 0.5])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity }}
    >
      <svg viewBox="0 0 800 600" className="w-full h-full max-w-5xl">
        <defs>
          <filter id="tangle-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tangled chain — randomish paths */}
        {[
          "M 120 100 Q 300 50 400 200 T 680 100 Q 500 250 620 400 T 300 500 Q 200 350 120 100",
          "M 200 150 Q 500 100 620 300 T 400 480 Q 250 380 180 200 T 200 150",
          "M 300 200 Q 500 300 400 400 T 250 300 Q 400 200 500 350 T 300 200",
        ].map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke={i === 0 ? PALETTE.chaosRed : i === 1 ? PALETTE.chaosPurple : PALETTE.chaosOrange}
            strokeWidth={i === 0 ? "1.2" : "0.8"}
            fill="none"
            opacity={0.5 - i * 0.1}
            strokeDasharray="3 5"
            filter="url(#tangle-glow)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 4, delay: 1.2 + i * 0.4 }}
          />
        ))}

        {/* Knot hotspots */}
        {[
          { x: 280, y: 240, label: "FEAR" },
          { x: 500, y: 320, label: "EGO" },
          { x: 400, y: 180, label: "IMPULSE" },
          { x: 360, y: 420, label: "REVENGE" },
        ].map((k, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 3 + i * 0.2 }}
          >
            <motion.circle
              cx={k.x}
              cy={k.y}
              r="16"
              fill={PALETTE.chaosRedGlow}
              stroke={PALETTE.chaosRed}
              strokeWidth="0.5"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            />
            <text
              x={k.x}
              y={k.y + 30}
              textAnchor="middle"
              className="text-[9px] font-mono tracking-[0.25em]"
              fill={PALETTE.inkMuted}
            >
              {k.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  )
}

/* ---------- Journal Fragments (torn, scattered) ---------- */

function JournalFragments({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.6, 0.85, 1], [0, 0.7, 0.6])

  const entries = [
    { text: "Week 1: I will follow the plan.", x: "8%", y: "8%", rot: -6 },
    { text: "Week 3: Moved stop again.", x: "82%", y: "12%", rot: 4 },
    { text: "Week 7: Didn't trust analysis.", x: "6%", y: "48%", rot: -3 },
    { text: "Week 11: Full position on gut feel.", x: "84%", y: "50%", rot: 5 },
    { text: "Week 19: Revenge sized.", x: "10%", y: "86%", rot: -4 },
    { text: "Week 26: Why do I keep doing this?", x: "80%", y: "84%", rot: 2 },
  ]

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: e.x,
            top: e.y,
            transform: `rotate(${e.rot}deg)`,
            maxWidth: 180,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.85, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 3.5 + i * 0.25 }}
        >
          <div
            className="px-3 py-2 text-[10px] italic"
            style={{
              color: PALETTE.inkMuted,
              background: "rgba(20,20,28,0.6)",
              border: `1px solid ${PALETTE.border}`,
              backdropFilter: "blur(4px)",
              fontFamily: "var(--font-serif, Georgia), serif",
            }}
          >
            {e.text}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Scene Export ---------- */

export function ScenePsychology() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const headlineOpacity = useTransform(progress, [0.4, 0.6, 0.95, 1], [0, 1, 1, 0.5])

  return (
    <Scene id="scene-psychology" height="320vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, #0b0510 0%, ${PALETTE.chaosBackgroundDeep} 60%, #000 100%)`,
        }}
      >
        <GridBackdrop color="rgba(239,68,68,0.04)" spacing={80} opacity={0.4} />
        <ParticleField density={30} hue="rgba(168,85,247,0.35)" speed={0.15} opacity={0.6} />

        <ChapterMarker number="05" label="THE MIND IS A MIRROR" />

        <RecursiveLoop progress={progress} />
        <EmotionTangle progress={progress} />
        <MirrorReflectionFar progress={progress} />
        <MirrorReflection progress={progress} />
        <MirrorFigure progress={progress} />
        <IntrusiveThoughts progress={progress} />
        <PatternRepeat progress={progress} />
        <JournalFragments progress={progress} />

        {/* Headline */}
        <motion.div
          className="absolute inset-x-0 bottom-[6%] flex flex-col items-center pointer-events-none px-6 z-40"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: `1px solid ${PALETTE.chaosPurple}40`,
                color: PALETTE.chaosPurple,
              }}
            >
              Scene Five · Recursion
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(34px, 5.4vw, 78px)",
                color: PALETTE.ink,
                textShadow: "0 4px 40px rgba(0,0,0,0.92)",
              }}
            >
              The same mistake.{" "}
              <span className="italic font-light" style={{ color: PALETTE.chaosPurple }}>
                Forever.
              </span>
              <br />
              <span style={{ color: PALETTE.inkMuted }}>
                Until someone names it,
              </span>{" "}
              <span className="italic font-light" style={{ color: PALETTE.chaosRed }}>
                it owns you.
              </span>
            </h2>
            <p
              className="mt-5 max-w-xl mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(13px, 1.15vw, 16px)" }}
            >
              Ninety percent of trading losses are psychological. Yet psychology is the one thing no tool
              measures, no broker reports, no mentor can see in real time. The loop continues
              because it&apos;s invisible to the one trapped inside it.
            </p>
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
