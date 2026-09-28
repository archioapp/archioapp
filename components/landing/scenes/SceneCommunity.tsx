"use client"

/* =====================================================================
   SCENE 10 — LIVE COMMUNITY (The Coliseum)
   From the lone candle of Scene 4, we zoom out to a breathing coliseum
   of live rooms, mentors on stage, trades being called, reactions
   firing across the globe. Not a Discord. A world.
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
import { Mic, Radio, Users, MessageCircle, Activity } from "lucide-react"

/* ---------- Stage Rooms (constellation of live rooms) ---------- */

const ROOMS = [
  {
    id: "room-1",
    name: "Whale Room",
    mentor: "Kai Tanaka",
    x: "18%",
    y: "26%",
    viewers: 847,
    pnl: "+$3,420",
    status: "LIVE",
    color: PALETTE.resolutionCyan,
  },
  {
    id: "room-2",
    name: "Gold Masters",
    mentor: "Elena Petrova",
    x: "64%",
    y: "18%",
    viewers: 1204,
    pnl: "+$1,850",
    status: "LIVE",
    color: PALETTE.transitionPurple,
  },
  {
    id: "room-3",
    name: "NY Traders",
    mentor: "Marcus Webb",
    x: "78%",
    y: "52%",
    viewers: 2103,
    pnl: "+$5,680",
    status: "LIVE",
    color: PALETTE.resolutionMint,
  },
  {
    id: "room-4",
    name: "Crypto Elite",
    mentor: "Sophia Reyes",
    x: "12%",
    y: "62%",
    viewers: 689,
    pnl: "−$420",
    status: "LIVE",
    color: PALETTE.transitionMagenta,
  },
  {
    id: "room-5",
    name: "London Open",
    mentor: "Alex Chen",
    x: "46%",
    y: "70%",
    viewers: 1567,
    pnl: "+$2,100",
    status: "LIVE",
    color: PALETTE.resolutionSky,
  },
] as const

function StageRooms({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.2], [0, 1])

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {ROOMS.map((room, i) => (
        <motion.div
          key={room.id}
          className="absolute"
          style={{ left: room.x, top: room.y, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {/* Aura glow */}
            <div
              className="absolute -inset-4 rounded-3xl"
              style={{
                background: `radial-gradient(circle, ${room.color}25 0%, transparent 70%)`,
                filter: "blur(20px)",
              }}
            />

            {/* Room card */}
            <div
              className="relative w-[240px] rounded-2xl overflow-hidden backdrop-blur-xl"
              style={{
                background: "rgba(10,14,22,0.82)",
                border: `1px solid ${room.color}50`,
                boxShadow: `0 12px 40px rgba(0,0,0,0.55), 0 0 18px ${room.color}20`,
              }}
            >
              {/* Live stage video preview */}
              <div
                className="relative h-24 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${room.color}15, #0a0d14)`,
                  borderBottom: `1px solid ${room.color}20`,
                }}
              >
                {/* Simulated chart background */}
                <svg viewBox="0 0 240 96" className="absolute inset-0 w-full h-full opacity-40">
                  <path
                    d="M 0 70 Q 40 55 60 60 T 120 45 Q 160 35 200 25 L 240 20"
                    stroke={room.color}
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <path
                    d="M 0 70 Q 40 55 60 60 T 120 45 Q 160 35 200 25 L 240 20 L 240 96 L 0 96 Z"
                    fill={`url(#room-grad-${room.id})`}
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id={`room-grad-${room.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={room.color} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={room.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Live indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <div
                    className="text-[8px] font-bold font-mono tracking-[0.2em]"
                    style={{ color: "#ef4444" }}
                  >
                    LIVE
                  </div>
                </div>

                {/* Viewers */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" style={{ color: PALETTE.inkMuted }} />
                  <div
                    className="text-[9px] font-mono tabular-nums"
                    style={{ color: PALETTE.inkSoft }}
                  >
                    {room.viewers.toLocaleString()}
                  </div>
                </div>

                {/* Mentor avatar circle */}
                <div
                  className="absolute bottom-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${room.color}, ${room.color}80)`,
                    color: PALETTE.ink,
                    border: `1px solid ${room.color}`,
                  }}
                >
                  {room.mentor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* P&L chip */}
                <div
                  className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold font-mono"
                  style={{
                    background: room.pnl.startsWith("+")
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                    color: room.pnl.startsWith("+")
                      ? PALETTE.resolutionGreen
                      : PALETTE.chaosRed,
                    border: `1px solid ${
                      room.pnl.startsWith("+") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"
                    }`,
                  }}
                >
                  {room.pnl}
                </div>
              </div>

              {/* Details */}
              <div className="p-3">
                <div
                  className="text-[12px] font-semibold tracking-tight leading-tight"
                  style={{ color: PALETTE.ink }}
                >
                  {room.name}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: PALETTE.inkMuted }}
                >
                  {room.mentor} · on stage
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Floating Call-Outs (trade calls firing) ---------- */

const CALLOUTS = [
  { text: "EUR/USD LONG @ 1.0842", action: "CALL", x: "36%", y: "38%", delay: 1.5 },
  { text: "Stop just breached ES", action: "ALERT", x: "58%", y: "48%", delay: 2.2 },
  { text: "BTC reclaim 71.2k", action: "CALL", x: "32%", y: "56%", delay: 3 },
  { text: "Gold — supply rejection", action: "NOTE", x: "52%", y: "30%", delay: 3.8 },
  { text: "Scaling into NQ", action: "SIZE", x: "22%", y: "44%", delay: 4.5 },
] as const

function FloatingCallouts({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.2, 0.35, 0.95, 1], [0, 1, 1, 0.5])

  const colorFor = (action: string) => {
    if (action === "ALERT") return PALETTE.chaosOrange
    if (action === "CALL") return PALETTE.resolutionMint
    if (action === "SIZE") return PALETTE.resolutionCyan
    return PALETTE.transitionPurple
  }

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {CALLOUTS.map((c, i) => {
        const color = colorFor(c.action)
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: c.x, top: c.y, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            whileInView={{ opacity: [0, 1, 1, 0], y: [20, 0, -8, -24], scale: [0.7, 1, 1, 0.9] }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 4.5,
              delay: c.delay,
              times: [0, 0.15, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{
                background: `${color}18`,
                border: `1px solid ${color}60`,
                boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 14px ${color}30`,
              }}
            >
              <div
                className="text-[9px] font-mono font-bold tracking-[0.2em]"
                style={{ color }}
              >
                {c.action}
              </div>
              <div
                className="text-[11px] tabular-nums"
                style={{ color: PALETTE.ink }}
              >
                {c.text}
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ---------- Room Link Lines (cross-room connections) ---------- */

function RoomLinks({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.3, 0.5, 1], [0, 0.5, 0.35])

  const links: Array<[string, string, string, string]> = [
    ["18%", "26%", "64%", "18%"],
    ["64%", "18%", "78%", "52%"],
    ["78%", "52%", "46%", "70%"],
    ["46%", "70%", "12%", "62%"],
    ["12%", "62%", "18%", "26%"],
    ["18%", "26%", "46%", "70%"],
  ]

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full">
        {links.map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={PALETTE.resolutionCyan}
            strokeWidth="0.5"
            strokeDasharray="1 8"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 1 + i * 0.15 }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

/* ---------- Activity Stats Bar ---------- */

function ActivityStats({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.45, 0.65, 1], [0, 1, 1])

  const stats = [
    { icon: Users, label: "Live Now", value: "6,410", color: PALETTE.resolutionCyan },
    { icon: Mic, label: "Rooms", value: "12", color: PALETTE.resolutionMint },
    { icon: Radio, label: "Calls Today", value: "847", color: PALETTE.transitionPurple },
    { icon: MessageCircle, label: "Messages/min", value: "312", color: PALETTE.resolutionSky },
    { icon: Activity, label: "Pulse", value: "98%", color: PALETTE.resolutionGreen },
  ]

  return (
    <motion.div
      className="absolute bottom-[6%] inset-x-0 flex justify-center pointer-events-none z-30"
      style={{ opacity }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-2xl backdrop-blur-xl"
        style={{
          background: "rgba(10,14,22,0.78)",
          border: `1px solid ${PALETTE.border}`,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}
      >
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2.2 + i * 0.12 }}
              className="flex items-center gap-2.5 px-3"
              style={{
                borderRight: i < stats.length - 1 ? `1px solid ${PALETTE.border}` : "none",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: `${s.color}20`,
                  border: `1px solid ${s.color}40`,
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
              <div>
                <div
                  className="text-[9px] font-mono tracking-[0.2em] uppercase"
                  style={{ color: PALETTE.inkMuted }}
                >
                  {s.label}
                </div>
                <div
                  className="text-[14px] font-bold tabular-nums leading-none"
                  style={{ color: PALETTE.ink }}
                >
                  {s.value}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ---------- Scene Export ---------- */

export function SceneCommunity() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useSceneProgress(sceneRef as React.RefObject<HTMLElement>)

  const headlineOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5])

  return (
    <Scene id="scene-community" height="340vh">
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, #051e28 0%, #020812 60%, #000 100%)`,
        }}
      >
        <AuroraLayer
          tones={[
            "rgba(52,211,153,0.12)",
            PALETTE.resolutionCyanGlow,
            "rgba(56,189,248,0.12)",
          ]}
          opacity={0.5}
          blur={140}
        />
        <GridBackdrop color="rgba(6,182,212,0.05)" spacing={84} opacity={0.4} perspective />

        <ChapterMarker number="10" label="THE COLISEUM" />

        <RoomLinks progress={progress} />
        <StageRooms progress={progress} />
        <FloatingCallouts progress={progress} />
        <ActivityStats progress={progress} />

        {/* Headline — top */}
        <motion.div
          className="absolute inset-x-0 top-[8%] flex flex-col items-center pointer-events-none px-6 z-40"
          style={{ opacity: headlineOpacity }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(52,211,153,0.12)",
                border: `1px solid ${PALETTE.resolutionMint}40`,
                color: PALETTE.resolutionMint,
              }}
            >
              Scene Ten · The Coliseum
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.8vw, 66px)",
                color: PALETTE.ink,
                textShadow: `0 4px 40px rgba(52,211,153,0.22)`,
              }}
            >
              You will never{" "}
              <span className="italic font-light" style={{ color: PALETTE.resolutionMint }}>
                trade alone again.
              </span>
            </h2>
            <p
              className="mt-3 max-w-lg mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(12px, 1.05vw, 15px)" }}
            >
              Stages. Rooms. Mentors. Live chart calls, reactions, side-by-side entries. The
              entire global floor, in one place, breathing in real time.
            </p>
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
