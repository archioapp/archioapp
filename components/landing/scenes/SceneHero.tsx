"use client"

/* =====================================================================
   SCENE 1 — THE OPENING
   Silhouette trader at a curved desk, surrounded by 6 glowing screens.
   The calm before the storm. Scroll unveils the first emotional hook.
   ===================================================================== */

import { useRef } from "react"
import { motion, useTransform } from "framer-motion"
import {
  PALETTE,
  ParticleField,
  GridBackdrop,
  AuroraLayer,
  Scene,
  SplitWord,
  useSceneProgress,
  ChapterMarker,
  ScrollIndicator,
  TickerTape,
} from "../LandingShared"

/* ---------- Six Screens Arranged in an Arc ---------- */

function TraderScreenRig({ progress }: { progress: any }) {
  // Each screen has a radial position relative to viewport center
  const screens = [
    { angle: -72, distance: 420, glow: "#10b981", content: "chart" as const }, // far left chart
    { angle: -42, distance: 380, glow: "#ef4444", content: "news" as const }, // news
    { angle: -12, distance: 360, glow: "#06b6d4", content: "terminal" as const }, // center-left terminal
    { angle: 18, distance: 360, glow: "#8b5cf6", content: "discord" as const }, // center-right discord
    { angle: 48, distance: 380, glow: "#f59e0b", content: "journal" as const }, // journal
    { angle: 78, distance: 420, glow: "#ec4899", content: "ai" as const }, // ai
  ]

  const zoom = useTransform(progress, [0, 1], [1, 1.12])
  const parallax = useTransform(progress, [0, 1], [0, -80])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ scale: zoom, y: parallax }}
    >
      {/* The trader silhouette (shoulders + head from behind) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[480px] h-[380px] z-[2]">
        <svg viewBox="0 0 480 380" className="w-full h-full">
          <defs>
            <linearGradient id="silhouette-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0a14" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#05050a" stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </linearGradient>
            <filter id="silhouette-blur">
              <feGaussianBlur stdDeviation="0.8" />
            </filter>
            <radialGradient id="rim-light" cx="50%" cy="20%" r="60%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Rim light */}
          <ellipse cx="240" cy="120" rx="180" ry="80" fill="url(#rim-light)" />

          {/* Shoulders + torso */}
          <path
            d="M60 380 Q60 260 140 220 Q180 200 200 180 L280 180 Q300 200 340 220 Q420 260 420 380 Z"
            fill="url(#silhouette-grad)"
            filter="url(#silhouette-blur)"
          />
          {/* Head + neck */}
          <path
            d="M200 180 Q200 150 210 140 Q220 100 240 100 Q260 100 270 140 Q280 150 280 180 Z"
            fill="url(#silhouette-grad)"
            filter="url(#silhouette-blur)"
          />
          {/* Subtle head highlight */}
          <path
            d="M220 130 Q225 115 240 112 Q255 115 260 130"
            stroke="rgba(139,92,246,0.25)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* The six screens */}
      {screens.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180
        const x = Math.sin(rad) * s.distance
        const y = -Math.cos(rad) * 180 + 40
        const rotate = s.angle * 0.6
        return <ScreenUnit key={i} x={x} y={y} rotate={rotate} glow={s.glow} content={s.content} delay={0.6 + i * 0.12} />
      })}
    </motion.div>
  )
}

/* ---------- Individual screen unit ---------- */

function ScreenUnit({
  x,
  y,
  rotate,
  glow,
  content,
  delay,
}: {
  x: number
  y: number
  rotate: number
  glow: string
  content: "chart" | "news" | "terminal" | "discord" | "journal" | "ai"
  delay: number
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(45% + ${y}px)`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        {/* Screen body */}
        <div
          className="relative w-[240px] h-[160px] rounded-sm overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(10,10,15,0.95), rgba(5,5,10,0.9))",
            border: `1px solid ${glow}40`,
            boxShadow: `0 0 60px ${glow}30, inset 0 0 40px ${glow}08, 0 20px 40px rgba(0,0,0,0.6)`,
          }}
        >
          <ScreenContent kind={content} glow={glow} />
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${glow}80, transparent)` }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Glass glare */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)`,
            }}
          />
        </div>
        {/* Stand */}
        <div className="mx-auto w-2 h-8" style={{ background: "rgba(30,30,40,0.9)" }} />
        <div className="mx-auto w-20 h-1 rounded-sm" style={{ background: "rgba(30,30,40,0.9)" }} />
        {/* Halo */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glow}20, transparent 70%)`,
            filter: "blur(20px)",
            zIndex: -1,
          }}
        />
      </div>
    </motion.div>
  )
}

/* ---------- Screen content variants ---------- */

function ScreenContent({ kind, glow }: { kind: string; glow: string }) {
  if (kind === "chart") {
    const points = "8,120 40,100 72,110 104,80 136,90 168,60 200,70 232,40"
    return (
      <div className="relative w-full h-full p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-1 rounded-full" style={{ background: "#ef4444" }} />
          <div className="w-1 h-1 rounded-full" style={{ background: "#f59e0b" }} />
          <div className="w-1 h-1 rounded-full" style={{ background: glow }} />
          <span className="text-[7px] tracking-widest ml-2 font-mono" style={{ color: glow, opacity: 0.7 }}>
            EURUSD · 5M
          </span>
        </div>
        <svg viewBox="0 0 240 140" className="w-full h-full">
          <defs>
            <linearGradient id={`chart-fill-${glow}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={glow} stopOpacity="0.3" />
              <stop offset="100%" stopColor={glow} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" y1={30 * i + 20} x2="240" y2={30 * i + 20} stroke="rgba(255,255,255,0.04)" />
          ))}
          <motion.polyline
            points={points}
            fill="none"
            stroke={glow}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeOut" }}
          />
          <polygon points={`${points} 232,140 8,140`} fill={`url(#chart-fill-${glow})`} opacity="0.4" />
          {/* Candles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const h = Math.sin(i * 0.7) * 15 + 20
            return (
              <rect
                key={i}
                x={8 + i * 9.5}
                y={70 - h / 2}
                width="5"
                height={h}
                fill={i % 3 === 0 ? glow : "rgba(255,255,255,0.3)"}
                opacity="0.5"
              />
            )
          })}
        </svg>
      </div>
    )
  }
  if (kind === "news") {
    return (
      <div className="relative w-full h-full p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 mb-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: glow }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: glow, opacity: 0.8 }}>
            BREAKING
          </span>
        </div>
        {[
          "USD strengthens on CPI beat",
          "ECB hints at 50bps cut path",
          "Oil surges above $95 mark",
          "Fed minutes reveal hawkish",
          "Gold tests $2400 support",
        ].map((line, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 1 + i * 0.15 }}
          >
            <div className="w-0.5 h-0.5 rounded-full" style={{ background: glow, opacity: 0.6 }} />
            <span className="text-[7px] text-slate-300 font-mono">{line}</span>
          </motion.div>
        ))}
      </div>
    )
  }
  if (kind === "terminal") {
    return (
      <div className="relative w-full h-full p-3 font-mono">
        <div className="text-[7px] mb-1" style={{ color: glow, opacity: 0.8 }}>
          ~/archio $
        </div>
        {["analyze eurusd --tf 5m", "loading candles...", "pattern: ascending triangle", "confidence: 0.78"].map(
          (line, i) => (
            <motion.div
              key={i}
              className="text-[7px] leading-relaxed"
              style={{ color: i === 0 ? glow : "rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.2 }}
            >
              {line}
            </motion.div>
          ),
        )}
        <motion.div
          className="inline-block w-1 h-2 mt-1"
          style={{ background: glow }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>
    )
  }
  if (kind === "discord") {
    return (
      <div className="relative w-full h-full p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ background: glow, opacity: 0.4 }} />
          <span className="text-[7px] font-mono" style={{ color: glow, opacity: 0.8 }}>
            #signals · 247 online
          </span>
        </div>
        <div className="space-y-1">
          {[
            { u: "Alex_FX", m: "anyone in EURUSD long?", c: "#10b981" },
            { u: "Mike", m: "just stopped out -2R", c: "#ef4444" },
            { u: "Sarah", m: "taking profits here", c: "#f59e0b" },
            { u: "Tom", m: "what's your TP?", c: "#06b6d4" },
          ].map((msg, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-1.5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 1 + i * 0.2 }}
            >
              <div className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0" style={{ background: msg.c, opacity: 0.7 }} />
              <div>
                <span className="text-[6.5px] font-bold" style={{ color: msg.c }}>
                  {msg.u}
                </span>
                <span className="text-[6.5px] text-slate-400 ml-1">{msg.m}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }
  if (kind === "journal") {
    return (
      <div className="relative w-full h-full p-3">
        <div className="text-[7px] font-mono mb-2" style={{ color: glow, opacity: 0.8 }}>
          JOURNAL · WED
        </div>
        {["09:14 EURUSD long +1.2R", "10:47 GBPUSD short -0.8R", "13:22 XAUUSD long +2.4R", "15:03 USDJPY short -1.0R"].map(
          (t, i) => (
            <motion.div
              key={i}
              className="text-[6.5px] font-mono py-0.5 border-b"
              style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.04)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.3 + i * 0.15 }}
            >
              {t}
            </motion.div>
          ),
        )}
      </div>
    )
  }
  // AI
  return (
    <div className="relative w-full h-full p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: glow }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[7px] font-mono tracking-wider" style={{ color: glow, opacity: 0.8 }}>
          AI COPILOT
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          "Analyzing EURUSD structure...",
          "Detected liquidity sweep @ 1.0845",
          "Bias: long · conf 0.72",
        ].map((t, i) => (
          <motion.div
            key={i}
            className="text-[7px] leading-relaxed"
            style={{ color: "rgba(236,72,153,0.7)" }}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 + i * 0.25 }}
          >
            {t}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Main Scene Export ---------- */

export default function SceneHero() {
  const ref = useRef<HTMLElement>(null)
  const progress = useSceneProgress(ref)

  const titleOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const titleY = useTransform(progress, [0, 1], [30, -80])
  const screenRigOpacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.6])
  const tickerOpacity = useTransform(progress, [0, 0.15, 0.8, 1], [0, 0.6, 0.6, 0])

  return (
    <Scene id="scene-hero" height="250vh">
      <div
        ref={ref as any}
        className="relative w-full h-full flex items-center justify-center"
        style={{ background: PALETTE.chaosBackground }}
      >
        {/* Backdrops */}
        <AuroraLayer
          tones={["rgba(139,92,246,0.12)", "rgba(6,182,212,0.08)", "rgba(16,185,129,0.06)"]}
          opacity={0.5}
        />
        <GridBackdrop color="rgba(139,92,246,0.05)" spacing={80} perspective />
        <ParticleField density={120} hue="rgba(200,200,220,0.5)" opacity={0.7} />

        {/* Chapter marker */}
        <ChapterMarker number="01" label="OPENING · THE ROOM" />

        {/* Ticker at top */}
        <motion.div
          className="absolute top-0 left-0 right-0 py-3 border-b z-10"
          style={{
            borderColor: PALETTE.border,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
            opacity: tickerOpacity,
          }}
        >
          <TickerTape
            items={[
              "EURUSD 1.0851 +0.12%",
              "GBPUSD 1.2712 −0.08%",
              "XAUUSD 2341.50 +0.34%",
              "BTCUSD 63821 +1.24%",
              "NAS100 18214 −0.22%",
              "DXY 104.82 +0.08%",
              "SPX 5421 +0.11%",
              "USDJPY 151.42 +0.19%",
            ]}
            speed={60}
          />
        </motion.div>

        {/* Trader + screens */}
        <motion.div className="absolute inset-0" style={{ opacity: screenRigOpacity }}>
          <TraderScreenRig progress={progress} />
        </motion.div>

        {/* Headline overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <div
            className="text-[10px] tracking-[0.5em] font-mono mb-6"
            style={{ color: PALETTE.inkMuted }}
          >
            ARCHIO · PROLOGUE
          </div>
          <h1
            className="font-black leading-[0.95] text-center tracking-tight"
            style={{
              fontSize: "clamp(44px, 8vw, 112px)",
              color: PALETTE.ink,
              textShadow: "0 2px 40px rgba(0,0,0,0.8)",
            }}
          >
            <SplitWord text="The industry" className="block" delay={0.2} />
            <SplitWord
              text="hid behind smoke."
              className="block italic font-light"
              delay={0.8}
              stagger={0.035}
            />
          </h1>
          <motion.p
            className="mt-10 text-center max-w-2xl leading-relaxed"
            style={{ color: PALETTE.inkMuted, fontSize: "clamp(14px, 1.3vw, 18px)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 2, duration: 1 }}
          >
            This is where three hundred million people try to build a future from a chair,
            a screen, and the hope that someone somewhere is telling them the truth.
          </motion.p>
        </motion.div>

        <ScrollIndicator label="BEGIN THE STORY" />
      </div>
    </Scene>
  )
}
