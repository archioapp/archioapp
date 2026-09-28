"use client"

/* =====================================================================
   SCENE 4 — ISOLATION
   A single candle on empty chart. A lone bird against wind.
   An empty Discord with scroll count climbing. The loneliness of trading.
   ===================================================================== */

import { useRef, useMemo } from "react"
import { motion, useTransform } from "framer-motion"
import {
  PALETTE,
  ParticleField,
  GridBackdrop,
  Scene,
  useSceneProgress,
  ChapterMarker,
} from "../LandingShared"

/* ---------- Lone Candle Chart ---------- */

function LoneCandleChart({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0, 0.15, 0.5, 0.7], [0, 1, 1, 0])
  const scale = useTransform(progress, [0, 0.2, 0.5], [0.85, 1, 1.05])
  return (
    <motion.div
      className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
      style={{ opacity, scale }}
    >
      <div className="flex flex-col items-center gap-6">
        <div
          className="relative rounded-2xl p-8"
          style={{
            background: "rgba(10,10,18,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.1)",
            width: 560,
            height: 340,
          }}
        >
          {/* Chart header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest" style={{ color: PALETTE.inkMuted }}>
                EURUSD · 15M · CHICAGO · 03:47
              </span>
            </div>
            <motion.span
              className="text-[10px] font-mono"
              style={{ color: "#ef4444" }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              · MARKET QUIET ·
            </motion.span>
          </div>

          {/* Empty chart with single candle */}
          <svg viewBox="0 0 480 240" className="w-full h-[240px]">
            <defs>
              <linearGradient id="lone-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Faint grid */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={40 * i + 20}
                x2="480"
                y2={40 * i + 20}
                stroke="rgba(255,255,255,0.04)"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={48 * i}
                y1="0"
                x2={48 * i}
                y2="240"
                stroke="rgba(255,255,255,0.03)"
              />
            ))}

            {/* The lone candle */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              {/* Wick */}
              <line x1="240" y1="60" x2="240" y2="170" stroke="#ef4444" strokeWidth="1" />
              {/* Body */}
              <rect
                x="234"
                y="100"
                width="12"
                height="50"
                fill="#ef4444"
                stroke="#ef4444"
                strokeWidth="1"
              />
              {/* Glow */}
              <motion.circle
                cx="240"
                cy="125"
                r="30"
                fill="url(#lone-glow)"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.g>

            {/* Price axis */}
            {["1.0855", "1.0845", "1.0835"].map((p, i) => (
              <text key={i} x="460" y={80 + i * 40} fontSize="9" fill={PALETTE.inkFaint} fontFamily="monospace">
                {p}
              </text>
            ))}
          </svg>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] font-mono" style={{ color: PALETTE.inkFaint }}>
              VOLUME · LOW
            </span>
            <span className="text-[9px] font-mono" style={{ color: PALETTE.inkFaint }}>
              SESSION · ASIA THIN
            </span>
          </div>
        </div>

        {/* Single trader label */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="text-[10px] font-mono tracking-[0.4em]" style={{ color: PALETTE.inkDim }}>
            ONE TRADER · ONE CANDLE · ONE DECISION
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ---------- Empty Discord Panel ---------- */

function EmptyDiscord({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.3, 0.45, 0.75, 0.9], [0, 1, 1, 0])
  const x = useTransform(progress, [0.3, 0.45], [-60, 0])

  return (
    <motion.div
      className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none z-20"
      style={{ opacity, x }}
    >
      <div
        className="rounded-xl overflow-hidden w-[280px]"
        style={{
          background: "rgba(12,12,20,0.92)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="p-3 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <span className="text-[11px]" style={{ color: PALETTE.inkMuted }}>
            #
          </span>
          <span className="text-[11px] font-bold text-slate-300">trading-floor</span>
          <span className="text-[9px] font-mono ml-auto" style={{ color: PALETTE.inkFaint }}>
            3:47 AM
          </span>
        </div>

        <div className="p-4 space-y-3 min-h-[280px] flex flex-col justify-center">
          <div className="text-center">
            <div
              className="text-[9px] font-mono tracking-widest mb-2"
              style={{ color: PALETTE.inkFaint }}
            >
              · · ·
            </div>
            <motion.div
              className="text-[10px] font-mono"
              style={{ color: PALETTE.inkDim }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              no messages since yesterday
            </motion.div>
          </div>

          {/* Ghost "typing" indicator that never resolves */}
          <motion.div
            className="flex items-center gap-2 mt-8 text-[10px]"
            style={{ color: PALETTE.inkFaint }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ background: PALETTE.inkFaint }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span>someone is typing...</span>
          </motion.div>
        </div>

        <div
          className="p-3 border-t flex items-center gap-2 text-[10px]"
          style={{ borderColor: "rgba(255,255,255,0.05)", color: PALETTE.inkFaint }}
        >
          <span>Message #trading-floor</span>
        </div>
      </div>

      {/* Scroll count */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-2 text-[9px] font-mono tracking-widest"
        style={{ color: PALETTE.inkDim }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>SCROLLS</span>
        <motion.span style={{ color: "#ef4444" }}>
          <motion.span
            animate={{
              opacity: [1, 0.6, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            247
          </motion.span>
        </motion.span>
        <span>·</span>
        <span>REPLIES</span>
        <span style={{ color: "#ef4444" }}>0</span>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Lone Bird ---------- */

function LoneBird({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.45, 0.6, 0.85, 1], [0, 1, 1, 0.5])
  const x = useTransform(progress, [0.45, 1], [60, -60])
  const y = useTransform(progress, [0.45, 0.7, 1], [0, -20, 30])

  return (
    <motion.div
      className="absolute right-[10%] top-[22%] pointer-events-none z-20"
      style={{ opacity, x, y }}
    >
      <svg width="160" height="80" viewBox="0 0 160 80">
        <motion.path
          d="M10 40 Q30 20 50 30 Q70 10 90 30 Q110 10 130 30 Q140 35 150 40"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="3 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
        />
        <motion.g
          animate={{ y: [0, -3, 0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Single bird shape (V) */}
          <path
            d="M70 38 L78 30 L86 38 M82 30 L82 32"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>

      <motion.div
        className="mt-2 text-[10px] font-mono tracking-widest text-center"
        style={{ color: PALETTE.inkFaint }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}
      >
        FIGHTING 100% OF THE WIND
      </motion.div>
    </motion.div>
  )
}

/* ---------- Wind Streaks ---------- */

function WindStreaks() {
  const streaks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        y: Math.random() * 100,
        length: 40 + Math.random() * 120,
        delay: i * 0.3,
        duration: 4 + Math.random() * 3,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {streaks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            top: `${s.y}%`,
            width: s.length,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
          animate={{ x: ["-20%", "120vw"] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Main Scene ---------- */

export default function SceneIsolation() {
  const ref = useRef<HTMLElement>(null)
  const progress = useSceneProgress(ref)

  const headlineOpacity = useTransform(progress, [0.65, 0.8, 0.95, 1], [0, 1, 1, 0])

  return (
    <Scene id="scene-isolation" height="280vh">
      <div
        ref={ref as any}
        className="relative w-full h-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #05050a 0%, #0a0a15 50%, #05050a 100%)",
        }}
      >
        {/* Cold atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.08) 0%, transparent 60%)",
          }}
        />

        <GridBackdrop color="rgba(100,116,139,0.06)" spacing={80} />
        <ParticleField density={30} hue="rgba(203,213,225,0.4)" opacity={0.4} speed={0.2} />

        <WindStreaks />

        <ChapterMarker number="04" label="THE DESK IS AN ISLAND" />

        <LoneCandleChart progress={progress} />
        <EmptyDiscord progress={progress} />
        <LoneBird progress={progress} />

        {/* Headline */}
        <motion.div
          className="absolute inset-x-0 bottom-[8%] flex flex-col items-center pointer-events-none px-6 z-30"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(100,116,139,0.15)",
                border: "1px solid rgba(100,116,139,0.3)",
                color: PALETTE.inkMuted,
              }}
            >
              Scene Four · Solitude
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(36px, 5.8vw, 84px)",
                color: PALETTE.ink,
                textShadow: "0 4px 40px rgba(0,0,0,0.9)",
              }}
            >
              Three A.M. <span className="italic font-light" style={{ color: PALETTE.inkSoft }}>Chicago.</span>
              <br />
              <span style={{ color: PALETTE.inkMuted }}>Nobody&apos;s awake.</span>
              <br />
              <span className="italic font-light">Nobody&apos;s reading your chart.</span>
            </h2>
            <p
              className="mt-6 max-w-lg mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(13px, 1.2vw, 16px)" }}
            >
              The loneliest industry on earth. Billions in flow, millions of participants, and every one of them
              closing the laptop alone at the end of a red day.
            </p>
          </div>
        </motion.div>

        {/* Ambient ticker of loss moments */}
        <motion.div
          className="absolute top-16 right-8 flex flex-col gap-1 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 2 }}
        >
          {["No accountability.", "No mirror.", "No one to catch the spiral."].map((t, i) => (
            <motion.div
              key={i}
              className="text-[10px] font-mono tracking-widest text-right"
              style={{ color: PALETTE.inkDim }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 0.8, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 2.2 + i * 0.3 }}
            >
              {t}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Scene>
  )
}
