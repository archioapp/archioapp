"use client"

/* =====================================================================
   SCENE 3 — GURU BETRAYAL
   Fake P&L screenshots. Lambo. Smoke. Coins draining to a faceless figure.
   Anger and shame. The industry's oldest trick, laid bare.
   ===================================================================== */

import { useRef, useMemo } from "react"
import { motion, useTransform } from "framer-motion"
import {
  PALETTE,
  ParticleField,
  Scene,
  useSceneProgress,
  ChapterMarker,
} from "../LandingShared"

/* ---------- Fake P&L Screenshot Card ---------- */

function FakePnlCard({
  amount,
  username,
  avatar,
  x,
  y,
  rotate,
  delay,
  glitched,
  duplicate,
}: {
  amount: string
  username: string
  avatar: string
  x: number
  y: number
  rotate: number
  delay: number
  glitched?: boolean
  duplicate?: boolean
}) {
  return (
    <motion.div
      className="absolute w-[280px] pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.8, rotate: rotate + 10 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "rgba(20,20,30,0.92)",
          border: "1px solid rgba(16,185,129,0.3)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.15)",
        }}
      >
        {/* Discord-style header */}
        <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "white",
            }}
          >
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-white">{username}</span>
              <span
                className="text-[8px] px-1.5 py-0.5 rounded font-bold"
                style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}
              >
                VIP
              </span>
            </div>
            <span className="text-[9px]" style={{ color: PALETTE.inkMuted }}>
              Today · 09:47
            </span>
          </div>
          {glitched && (
            <motion.span
              className="text-[8px] font-mono text-red-400"
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              [INSPECT]
            </motion.span>
          )}
        </div>

        {/* Message */}
        <div className="p-3">
          <p className="text-[11px] text-slate-300 mb-2">{duplicate ? "🔥🔥🔥 LFG BOYS 🔥🔥🔥" : "massive day 🚀"}</p>
          <div
            className="rounded-lg p-3 flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <div>
              <div className="text-[8px] font-mono uppercase tracking-wider" style={{ color: "#10b981" }}>
                TODAY&apos;S P&L
              </div>
              <div className="text-2xl font-black mt-0.5" style={{ color: "#10b981" }}>
                {amount}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-mono">+347%</span>
              <span className="text-[8px] text-slate-500 font-mono">ACCOUNT</span>
            </div>
          </div>

          {/* Fake reactions */}
          <div className="flex items-center gap-1.5 mt-2">
            {["🔥 847", "💰 412", "🚀 287", "💎 156"].map((r) => (
              <span
                key={r}
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  color: "#c4b5fd",
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Glitch overlay */}
        {glitched && (
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-difference"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(239,68,68,0.2) 3px, rgba(239,68,68,0.2) 4px)",
            }}
            animate={{ opacity: [0, 0.8, 0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "steps(5)" }}
          />
        )}
      </div>

      {/* Duplicate indicator */}
      {duplicate && (
        <motion.div
          className="absolute -top-3 -right-3 px-2 py-1 rounded-full text-[8px] font-black tracking-wider"
          style={{
            background: "#ef4444",
            color: "white",
            boxShadow: "0 4px 12px rgba(239,68,68,0.5)",
          }}
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          DUPLICATE
        </motion.div>
      )}
    </motion.div>
  )
}

/* ---------- Smoke Layer ---------- */

function SmokeVeil({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.2, 0.6, 0.6, 0.25])
  return (
    <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ opacity }}>
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(120,80,40,0.25), transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(80,40,20,0.3), transparent 45%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(100,60,20,0.2), transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

/* ---------- Coin Drain Animation ---------- */

function CoinDrain({ progress }: { progress: any }) {
  const coins = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        startX: 30 + Math.random() * 40,
        startY: 40 + Math.random() * 30,
        delay: 0.2 + i * 0.08,
        size: 12 + Math.random() * 16,
      })),
    [],
  )

  const opacity = useTransform(progress, [0.3, 0.45, 0.9, 1], [0, 1, 1, 0])

  return (
    <motion.div className="absolute inset-0 pointer-events-none z-15" style={{ opacity }}>
      {coins.map((c) => (
        <motion.div
          key={c.id}
          className="absolute rounded-full flex items-center justify-center font-black"
          style={{
            left: `${c.startX}%`,
            top: `${c.startY}%`,
            width: c.size,
            height: c.size,
            background: "linear-gradient(135deg, #fbbf24, #d97706)",
            color: "#78350f",
            fontSize: c.size * 0.55,
            boxShadow: "0 2px 8px rgba(251,191,36,0.6)",
          }}
          animate={{
            x: [0, 180 + Math.random() * 80, 360],
            y: [0, -40 - Math.random() * 60, -120],
            opacity: [1, 0.7, 0],
            scale: [1, 0.9, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 1.5,
            delay: c.delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: [0.45, 0, 0.55, 1],
          }}
        >
          $
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Faceless Guru Silhouette ---------- */

function FacelessGuru({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.2, 0.4, 0.9, 1], [0, 1, 1, 0.5])
  return (
    <motion.div
      className="absolute right-[8%] top-1/2 -translate-y-1/2 pointer-events-none z-10"
      style={{ opacity }}
    >
      <svg width="240" height="320" viewBox="0 0 240 320">
        <defs>
          <linearGradient id="guru-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1e2e" />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>
          <filter id="guru-glow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {/* Body */}
        <path
          d="M40 320 Q40 220 80 180 Q100 160 120 150 L120 120 Q70 100 70 60 Q70 30 120 30 Q170 30 170 60 Q170 100 120 120 L120 150 Q140 160 160 180 Q200 220 200 320 Z"
          fill="url(#guru-grad)"
          opacity="0.95"
        />
        {/* Head glow (no face) */}
        <circle cx="120" cy="70" r="40" fill="rgba(120,80,40,0.2)" filter="url(#guru-glow)" />
        {/* Dollar sign where face should be */}
        <motion.text
          x="120"
          y="85"
          textAnchor="middle"
          fontSize="48"
          fontWeight="900"
          fill="rgba(251,191,36,0.4)"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          $
        </motion.text>
      </svg>

      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest"
        style={{
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#f87171",
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        THE MENTOR
      </motion.div>

      <div className="mt-4 flex flex-col items-center gap-1.5">
        {["$97 Basic Course", "$297 Advanced", "$997 Mentorship", "$1,997 Inner Circle"].map((price, i) => (
          <motion.div
            key={i}
            className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{
              color: "#fbbf24",
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 1 + i * 0.2 }}
          >
            {price}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ---------- Main Scene ---------- */

export default function SceneGuruBetrayal() {
  const ref = useRef<HTMLElement>(null)
  const progress = useSceneProgress(ref)

  const headlineOpacity = useTransform(progress, [0.5, 0.7, 0.9, 1], [0, 1, 1, 0])

  const pnlCards = [
    {
      amount: "+$5,000",
      username: "AlphaTrader_FX",
      avatar: "AT",
      x: 8,
      y: 22,
      rotate: -6,
      delay: 0.1,
    },
    {
      amount: "+$12,400",
      username: "FxKingDubai",
      avatar: "FK",
      x: 24,
      y: 56,
      rotate: 4,
      delay: 0.3,
    },
    {
      amount: "+$8,750",
      username: "SignalMaster",
      avatar: "SM",
      x: 12,
      y: 84,
      rotate: -3,
      delay: 0.5,
    },
    {
      amount: "+$5,000",
      username: "AlphaTrader_FX",
      avatar: "AT",
      x: 42,
      y: 32,
      rotate: 7,
      delay: 0.7,
      duplicate: true,
    },
    {
      amount: "+$25,300",
      username: "WhaleCallsOnly",
      avatar: "WC",
      x: 58,
      y: 16,
      rotate: -5,
      delay: 0.9,
      glitched: true,
    },
    {
      amount: "+$5,000",
      username: "AlphaTrader_FX",
      avatar: "AT",
      x: 30,
      y: 72,
      rotate: 2,
      delay: 1.1,
      duplicate: true,
    },
  ]

  return (
    <Scene id="scene-guru" height="280vh">
      <div
        ref={ref as any}
        className="relative w-full h-full overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #0f0a14 0%, #080508 60%, #020104 100%)",
        }}
      >
        {/* Atmospheric smoke */}
        <SmokeVeil progress={progress} />

        {/* Grain particles */}
        <ParticleField density={40} hue="rgba(120,80,40,0.5)" speed={0.4} opacity={0.4} />

        <ChapterMarker number="03" label="THE SMOKE AND MIRRORS" />

        {/* Discord-style fake P&L cards scattered */}
        {pnlCards.map((card, i) => (
          <FakePnlCard key={i} {...card} />
        ))}

        {/* Faceless guru silhouette on the right */}
        <FacelessGuru progress={progress} />

        {/* Coins draining toward guru */}
        <CoinDrain progress={progress} />

        {/* Center bottom headline */}
        <motion.div
          className="absolute inset-x-0 bottom-[10%] flex flex-col items-center pointer-events-none px-6 z-20"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              Scene Three · Betrayal
            </div>
            <h2
              className="font-black leading-[1] tracking-tight"
              style={{
                fontSize: "clamp(36px, 5.8vw, 82px)",
                color: PALETTE.ink,
                textShadow: "0 4px 40px rgba(0,0,0,0.9)",
              }}
            >
              Gurus <span style={{ color: "#fbbf24" }}>hide</span>.<br />
              Platforms <span style={{ color: "#ef4444" }}>fragment</span>.<br />
              <span className="italic font-light" style={{ color: PALETTE.inkSoft }}>
                We fix both.
              </span>
            </h2>
            <p
              className="mt-6 max-w-lg mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(13px, 1.2vw, 16px)" }}
            >
              The screenshots were edited. The accounts were demo. The &ldquo;students&rdquo; were plants.
              The only real number was the one that left your wallet.
            </p>
          </div>
        </motion.div>

        {/* Corner stat */}
        <motion.div
          className="absolute top-1/3 right-[30%] flex flex-col items-start gap-1 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-[10px] font-mono tracking-widest" style={{ color: PALETTE.inkDim }}>
            INDUSTRY TRUST DEFICIT
          </div>
          <div
            className="text-4xl font-black font-mono"
            style={{ color: "#f87171", textShadow: "0 0 30px rgba(239,68,68,0.5)" }}
          >
            $800M
          </div>
          <div className="text-[10px] font-mono max-w-[160px]" style={{ color: PALETTE.inkFaint }}>
            IN UNVERIFIED COURSE SALES ANNUALLY
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
