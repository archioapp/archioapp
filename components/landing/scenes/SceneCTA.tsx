"use client"

/* =====================================================================
   SCENE 12 — THE INVITATION (Final CTA)
   The portal reforms. The core pulses. A single sentence carries the
   weight of everything before it. Two calls-to-action: enter the
   ecosystem, or scroll back and study the map.
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
  TickerTape,
} from "../LandingShared"
import { ArrowRight, Play } from "lucide-react"

/* ---------- Final Portal (smaller, definitive) ---------- */

function FinalPortal({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 0.3], [0.7, 1])
  const opacity = useTransform(progress, [0, 0.15], [0, 1])

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ scale, opacity }}
    >
      <div className="relative" style={{ width: 560, height: 560 }}>
        <svg viewBox="0 0 560 560" className="w-full h-full">
          <defs>
            <radialGradient id="final-core">
              <stop offset="0%" stopColor={PALETTE.ink} stopOpacity="1" />
              <stop offset="25%" stopColor={PALETTE.resolutionCyan} stopOpacity="0.85" />
              <stop offset="60%" stopColor={PALETTE.transitionPurple} stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="final-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={PALETTE.resolutionCyan} stopOpacity="1" />
              <stop offset="50%" stopColor={PALETTE.transitionPurple} stopOpacity="0.9" />
              <stop offset="100%" stopColor={PALETTE.resolutionMint} stopOpacity="1" />
            </linearGradient>
            <filter id="final-glow">
              <feGaussianBlur stdDeviation="8" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Aura */}
          <motion.circle
            cx="280"
            cy="280"
            r="250"
            fill="url(#final-core)"
            opacity="0.3"
            animate={{ r: [250, 265, 250], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#final-glow)"
          />

          {/* Outer ring */}
          <motion.circle
            cx="280"
            cy="280"
            r="230"
            fill="none"
            stroke="url(#final-ring)"
            strokeWidth="1.2"
            strokeDasharray="2 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "280px 280px" }}
            filter="url(#final-glow)"
          />

          {/* Middle ring */}
          <motion.circle
            cx="280"
            cy="280"
            r="180"
            fill="none"
            stroke={PALETTE.transitionPurple}
            strokeWidth="0.8"
            strokeDasharray="1 10"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "280px 280px" }}
            opacity="0.6"
          />

          {/* Inner ring */}
          <motion.circle
            cx="280"
            cy="280"
            r="130"
            fill="none"
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.6"
            strokeDasharray="4 6"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "280px 280px" }}
            opacity="0.5"
          />

          {/* Core pulse */}
          <motion.circle
            cx="280"
            cy="280"
            r="50"
            fill="url(#final-core)"
            animate={{
              r: [50, 62, 50],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#final-glow)"
          />

          {/* Orbiting nodes */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.g
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 28 + i * 3, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "280px 280px" }}
            >
              <circle
                cx={280 + Math.cos((angle * Math.PI) / 180) * 230}
                cy={280 + Math.sin((angle * Math.PI) / 180) * 230}
                r="3.5"
                fill={PALETTE.ink}
                filter="url(#final-glow)"
              />
            </motion.g>
          ))}
        </svg>
      </div>
    </motion.div>
  )
}

/* ---------- Headline Block ---------- */

function Headline({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.1, 0.3, 0.95, 1], [0, 1, 1, 0.8])
  const y = useTransform(progress, [0.1, 0.3], [20, 0])

  return (
    <motion.div
      className="absolute inset-x-0 top-[14%] flex flex-col items-center pointer-events-none px-6 z-40"
      style={{ opacity, y }}
    >
      <div className="max-w-4xl text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
          style={{
            background: PALETTE.resolutionCyanGlow,
            border: `1px solid ${PALETTE.resolutionCyan}40`,
            color: PALETTE.resolutionCyan,
          }}
        >
          Scene Twelve · The Invitation
        </div>

        <h2
          className="font-black leading-[0.92] tracking-tight"
          style={{
            fontSize: "clamp(42px, 7vw, 112px)",
            color: PALETTE.ink,
            textShadow: `0 6px 80px ${PALETTE.resolutionCyanGlow}`,
          }}
        >
          The market will{" "}
          <span className="italic font-light" style={{ color: PALETTE.inkMuted }}>
            open again
          </span>
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${PALETTE.resolutionCyan} 0%, ${PALETTE.transitionPurple} 50%, ${PALETTE.resolutionMint} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            tomorrow morning.
          </span>
        </h2>

        <motion.p
          className="mt-6 max-w-xl mx-auto leading-relaxed"
          style={{ color: PALETTE.inkSoft, fontSize: "clamp(14px, 1.25vw, 18px)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 1.2 }}
        >
          You can show up the same way you did today.
          <br />
          Or you can bring the entire operating system with you.
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ---------- CTA Buttons ---------- */

function CTAButtons({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.35, 0.55, 1], [0, 1, 1])
  const y = useTransform(progress, [0.35, 0.55], [16, 0])

  return (
    <motion.div
      className="absolute inset-x-0 bottom-[28%] flex flex-col items-center gap-4 px-6 z-40"
      style={{ opacity, y }}
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Primary CTA */}
        <motion.a
          href="#get-started"
          className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-[14px] tracking-tight overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${PALETTE.resolutionCyan} 0%, ${PALETTE.transitionPurple} 100%)`,
            color: PALETTE.ink,
            boxShadow: `0 12px 40px ${PALETTE.resolutionCyan}45, 0 0 0 1px ${PALETTE.ink}20 inset`,
          }}
          whileHover={{ y: -2, boxShadow: `0 18px 50px ${PALETTE.resolutionCyan}60` }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Hover shimmer */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative">Enter ArchioAI</span>
          <ArrowRight className="relative w-4 h-4" />
        </motion.a>

        {/* Secondary CTA */}
        <motion.a
          href="#tour"
          className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full font-medium text-[14px] tracking-tight"
          style={{
            background: "rgba(10,14,22,0.6)",
            border: `1px solid ${PALETTE.borderStrong}`,
            color: PALETTE.inkSoft,
            backdropFilter: "blur(12px)",
          }}
          whileHover={{
            y: -2,
            borderColor: PALETTE.resolutionCyan,
            color: PALETTE.ink,
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Watch the Walkthrough</span>
        </motion.a>
      </div>

      <div
        className="text-[10px] font-mono tracking-[0.3em] uppercase"
        style={{ color: PALETTE.inkDim }}
      >
        Free for 14 days · No card required · Live onboarding
      </div>
    </motion.div>
  )
}

/* ---------- Social Proof Strip ---------- */

function SocialProof({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.5, 0.7, 1], [0, 1, 1])

  const testimonials = [
    { name: "Derek N.", role: "Prop Trader · NY", quote: "First system that caught me before the trade, not after." },
    { name: "Anya K.", role: "Crypto · Berlin", quote: "My journaling finally has a reader who remembers." },
    { name: "Toshi M.", role: "FX · Tokyo", quote: "The coach feature pulled my Sharpe from 0.6 to 1.4." },
  ]

  return (
    <motion.div
      className="absolute inset-x-0 bottom-[8%] flex justify-center pointer-events-none z-30 px-6"
      style={{ opacity }}
    >
      <div className="flex flex-wrap items-stretch gap-3 max-w-4xl justify-center">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="flex-1 min-w-[240px] max-w-[280px] rounded-xl p-3.5 backdrop-blur-xl"
            style={{
              background: "rgba(10,14,22,0.75)",
              border: `1px solid ${PALETTE.border}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 2.5 + i * 0.15 }}
          >
            <div
              className="text-[12px] leading-relaxed italic mb-2"
              style={{ color: PALETTE.inkSoft, fontFamily: "var(--font-serif, Georgia), serif" }}
            >
              &ldquo;{t.quote}&rdquo;
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${PALETTE.resolutionCyan}, ${PALETTE.transitionPurple})`,
                  color: PALETTE.ink,
                }}
              >
                {t.name[0]}
              </div>
              <div>
                <div
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: PALETTE.ink }}
                >
                  {t.name}
                </div>
                <div
                  className="text-[9px] font-mono tracking-[0.15em] uppercase"
                  style={{ color: PALETTE.inkMuted }}
                >
                  {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ---------- Closing Ticker ---------- */

function ClosingTicker() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 border-t z-40"
      style={{ borderColor: PALETTE.border, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
    >
      <TickerTape
        items={[
          "ARCHIOAI · OPERATING SYSTEM FOR TRADERS",
          "STRATEGY · PSYCHOLOGY · COMMUNITY · COPILOT · MEMORY",
          "BUILT FOR THE MIND BEHIND THE CHART",
          "LIVE NOW · 6,410 TRADERS ONLINE",
          "ENTER THE ECOSYSTEM",
        ]}
        speed={60}
        className="py-3"
      />
    </div>
  )
}

/* ---------- Scene Export ---------- */

export function SceneCTA() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  return (
    <Scene id="scene-cta" height="260vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, #06222e 0%, #020814 55%, #000 100%)`,
        }}
      >
        <AuroraLayer
          tones={[
            PALETTE.resolutionCyanGlow,
            PALETTE.transitionPurpleGlow,
            "rgba(52,211,153,0.14)",
          ]}
          opacity={0.6}
          blur={160}
        />
        <GridBackdrop color="rgba(6,182,212,0.06)" spacing={80} opacity={0.5} />
        <ParticleField density={60} hue="rgba(6,182,212,0.5)" speed={0.25} opacity={0.7} />

        <ChapterMarker number="12" label="THE INVITATION" />

        <FinalPortal progress={progress} />
        <Headline progress={progress} />
        <CTAButtons progress={progress} />
        <SocialProof progress={progress} />
        <ClosingTicker />
      </div>
    </Scene>
  )
}
