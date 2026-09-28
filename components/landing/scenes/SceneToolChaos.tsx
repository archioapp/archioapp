"use client"

/* =====================================================================
   SCENE 2 — TOOL CHAOS
   Icons multiply. Tabs spawn. Glitchy text pulses. Recognition anxiety.
   ===================================================================== */

import { useRef, useMemo } from "react"
import { motion, useTransform } from "framer-motion"
import {
  LineChart,
  MessageSquare,
  Bell,
  FileSpreadsheet,
  BookOpen,
  Hash,
  Newspaper,
  Calendar,
  Bot,
  Zap,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  PieChart,
  Send,
  Calculator,
} from "lucide-react"
import {
  PALETTE,
  ParticleField,
  GridBackdrop,
  Scene,
  useSceneProgress,
  ChapterMarker,
} from "../LandingShared"

/* ---------- Floating Tool Icon ---------- */

type ToolIconProps = {
  Icon: any
  label: string
  hue: string
  x: number
  y: number
  size: number
  entryAt: number
  rotation: number
  progress: any
}

function ToolIcon({ Icon, label, hue, x, y, size, entryAt, rotation, progress }: ToolIconProps) {
  // Icons fade in over [entryAt, entryAt+0.1], stay through [entryAt, 0.85], then collapse together at end
  const opacity = useTransform(progress, [entryAt, entryAt + 0.05, 0.85, 1], [0, 1, 1, 0.15])
  const scale = useTransform(progress, [entryAt, entryAt + 0.1, 0.9, 1], [0.3, 1, 1, 0.4])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        scale,
      }}
      animate={{
        y: [0, -8, 0],
        rotate: [rotation - 2, rotation + 2, rotation - 2],
      }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl"
        style={{
          background: "rgba(15,15,25,0.7)",
          border: `1px solid ${hue}50`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 8px 24px ${hue}20, 0 0 30px ${hue}15`,
          width: size,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: hue }} />
        <span className="text-[8px] font-mono tracking-wider" style={{ color: hue, opacity: 0.9 }}>
          {label}
        </span>
      </div>
      {/* notification badge */}
      {Math.random() > 0.5 && (
        <motion.div
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center"
          style={{ background: PALETTE.chaosRed, color: "white", fontSize: "9px", fontWeight: 800 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {Math.floor(Math.random() * 99) + 1}
        </motion.div>
      )}
    </motion.div>
  )
}

/* ---------- Browser Tab Bar ---------- */

function BrowserTabBar({ progress }: { progress: any }) {
  const tabCount = useTransform(progress, [0, 0.3, 0.6, 0.85], [0, 4, 12, 22])

  const tabs = [
    { label: "TradingView — EURUSD", color: "#10b981" },
    { label: "MT5 Terminal", color: "#06b6d4" },
    { label: "Discord — FX Signals", color: "#8b5cf6" },
    { label: "Telegram — Guru Chat", color: "#06b6d4" },
    { label: "ChatGPT", color: "#10b981" },
    { label: "TradeZella Journal", color: "#f59e0b" },
    { label: "ForexFactory Calendar", color: "#ef4444" },
    { label: "Twitter — $EURUSD", color: "#06b6d4" },
    { label: "Reddit r/forex", color: "#f59e0b" },
    { label: "YouTube — Analysis", color: "#ef4444" },
    { label: "CoinGecko", color: "#10b981" },
    { label: "Notion Journal", color: "#94a3b8" },
    { label: "Google Sheets", color: "#10b981" },
    { label: "Bloomberg News", color: "#06b6d4" },
    { label: "Signal Bot Pro", color: "#8b5cf6" },
    { label: "Excel — Backtest", color: "#10b981" },
    { label: "TradingLocker", color: "#f59e0b" },
    { label: "ThinkOrSwim", color: "#06b6d4" },
    { label: "DXY Tracker", color: "#ef4444" },
    { label: "FOMC Calendar", color: "#8b5cf6" },
    { label: "Economic News", color: "#06b6d4" },
    { label: "Prop Firm Portal", color: "#f59e0b" },
  ]

  const opacity = useTransform(progress, [0.05, 0.12, 0.85, 1], [0, 0.9, 0.9, 0])

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-10"
      style={{
        opacity,
        background: "rgba(10,10,18,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex overflow-hidden h-9 items-stretch">
        {tabs.map((tab, i) => {
          const show = useTransform(tabCount, (v: number) => (v > i ? 1 : 0))
          const width = useTransform(tabCount, [i - 0.5, i + 0.5], [0, 160])
          return (
            <motion.div
              key={i}
              className="flex items-center gap-1.5 px-2 border-r text-[9px] font-mono overflow-hidden whitespace-nowrap"
              style={{
                opacity: show,
                width,
                borderColor: "rgba(255,255,255,0.05)",
                color: PALETTE.inkMuted,
                minWidth: 0,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tab.color, opacity: 0.7 }} />
              <span className="truncate">{tab.label}</span>
              <span className="ml-auto text-[9px]" style={{ color: PALETTE.inkFaint }}>
                ×
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ---------- Glitchy Panic Text ---------- */

function PanicText({ text, x, y, hue, delay }: { text: string; x: number; y: number; hue: string; delay: number }) {
  return (
    <motion.div
      className="absolute font-mono font-bold pointer-events-none tracking-[0.3em] uppercase"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: "11px",
        color: hue,
        textShadow: `0 0 20px ${hue}`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: [0, 0.8, 0.3, 0.9, 0.4, 0.85, 0],
        scale: [0.9, 1.05, 1, 1.1, 1, 1.05, 0.95],
        x: [0, 2, -1, 1, -2, 0, 0],
      }}
      transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: 2 }}
    >
      {text}
    </motion.div>
  )
}

/* ---------- Notification Cascade ---------- */

function NotificationCascade({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.35, 0.5, 0.8, 1], [0, 1, 1, 0])
  const notifications = useMemo(
    () => [
      { app: "Discord", msg: "PREMIUM SIGNAL — JUST IN", color: "#8b5cf6", time: "now" },
      { app: "Telegram", msg: "VIP Channel · TP hit +15R", color: "#06b6d4", time: "2s" },
      { app: "MT5", msg: "Margin Call Warning", color: "#ef4444", time: "5s" },
      { app: "Twitter", msg: "Guru posted — $EURUSD", color: "#06b6d4", time: "12s" },
      { app: "TradingView", msg: "Alert: EURUSD crossed 1.0850", color: "#10b981", time: "18s" },
      { app: "Broker Email", msg: "Account balance update", color: "#f59e0b", time: "24s" },
      { app: "Prop Firm", msg: "Daily loss limit 85%", color: "#ef4444", time: "31s" },
      { app: "News Wire", msg: "FED speaker at 14:30 UTC", color: "#06b6d4", time: "45s" },
    ],
    [],
  )

  return (
    <motion.div
      className="absolute top-24 right-8 w-[280px] space-y-2 pointer-events-none z-10"
      style={{ opacity }}
    >
      {notifications.map((n, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-2 p-2.5 rounded-lg"
          style={{
            background: "rgba(15,15,25,0.88)",
            border: `1px solid ${n.color}40`,
            backdropFilter: "blur(8px)",
            boxShadow: `0 4px 20px ${n.color}15`,
          }}
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
            style={{ background: n.color }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-wider" style={{ color: n.color }}>
                {n.app.toUpperCase()}
              </span>
              <span className="text-[8px] font-mono" style={{ color: PALETTE.inkFaint }}>
                {n.time}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5 truncate">{n.msg}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Main Scene ---------- */

export default function SceneToolChaos() {
  const ref = useRef<HTMLElement>(null)
  const progress = useSceneProgress(ref)

  // 16 tools staggered across the scroll
  const tools = useMemo(
    () => [
      { Icon: LineChart, label: "TRADINGVIEW", hue: "#10b981", x: 12, y: 28, size: 78, entry: 0.02, rot: -3 },
      { Icon: TrendingUp, label: "MT5", hue: "#06b6d4", x: 82, y: 22, size: 72, entry: 0.04, rot: 4 },
      { Icon: PieChart, label: "CTRADER", hue: "#8b5cf6", x: 6, y: 58, size: 74, entry: 0.08, rot: 2 },
      { Icon: Calculator, label: "THINKORSWIM", hue: "#f59e0b", x: 88, y: 52, size: 76, entry: 0.1, rot: -4 },
      { Icon: MessageSquare, label: "DISCORD", hue: "#5865f2", x: 18, y: 78, size: 72, entry: 0.14, rot: 3 },
      { Icon: Send, label: "TELEGRAM", hue: "#229ed9", x: 78, y: 72, size: 70, entry: 0.16, rot: -2 },
      { Icon: Hash, label: "SLACK", hue: "#ec4899", x: 34, y: 18, size: 66, entry: 0.18, rot: 4 },
      { Icon: Bell, label: "NOTIFY", hue: "#ef4444", x: 62, y: 16, size: 64, entry: 0.2, rot: -3 },
      { Icon: Bot, label: "CHATGPT", hue: "#10b981", x: 44, y: 68, size: 68, entry: 0.24, rot: 2 },
      { Icon: Zap, label: "AI SIGNAL", hue: "#a855f7", x: 52, y: 22, size: 64, entry: 0.28, rot: -4 },
      { Icon: BookOpen, label: "TRADEZELLA", hue: "#f59e0b", x: 72, y: 82, size: 66, entry: 0.3, rot: 3 },
      { Icon: FileSpreadsheet, label: "EXCEL", hue: "#10b981", x: 26, y: 86, size: 62, entry: 0.32, rot: -2 },
      { Icon: Calendar, label: "FOREXFACTORY", hue: "#ef4444", x: 50, y: 84, size: 68, entry: 0.36, rot: 4 },
      { Icon: Newspaper, label: "BLOOMBERG", hue: "#06b6d4", x: 6, y: 42, size: 64, entry: 0.38, rot: -3 },
      { Icon: DollarSign, label: "BROKER", hue: "#f59e0b", x: 94, y: 38, size: 60, entry: 0.4, rot: 2 },
      { Icon: AlertTriangle, label: "MARGIN", hue: "#ef4444", x: 58, y: 50, size: 56, entry: 0.42, rot: -3 },
    ],
    [],
  )

  const panicTexts = [
    { text: "STOP LOSS", x: 28, y: 44, hue: "#ef4444", delay: 0.4 },
    { text: "ENTRY NOW", x: 60, y: 38, hue: "#f59e0b", delay: 1.2 },
    { text: "FOMO", x: 44, y: 32, hue: "#ec4899", delay: 2.1 },
    { text: "WAIT FOR CONFIRM", x: 20, y: 62, hue: "#8b5cf6", delay: 1.7 },
    { text: "JUST TAKE IT", x: 66, y: 58, hue: "#ef4444", delay: 2.8 },
    { text: "CHECK TG", x: 48, y: 48, hue: "#06b6d4", delay: 0.8 },
    { text: "REVENGE", x: 30, y: 72, hue: "#ef4444", delay: 3.2 },
  ]

  const headlineOpacity = useTransform(progress, [0.15, 0.35, 0.7, 0.85], [0, 1, 1, 0])
  const headlineY = useTransform(progress, [0.15, 0.85], [40, -40])
  const chaosIntensity = useTransform(progress, [0, 0.5, 0.85, 1], [0, 1, 1, 0.2])

  return (
    <Scene id="scene-chaos" height="280vh">
      <div
        ref={ref as any}
        className="relative w-full h-full"
        style={{ background: PALETTE.chaosBackground }}
      >
        {/* Red atmospheric wash growing over scene */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 40%, transparent 75%)",
            opacity: chaosIntensity,
          }}
        />

        <GridBackdrop color="rgba(239,68,68,0.07)" spacing={60} />
        <ParticleField density={60} hue="rgba(239,68,68,0.6)" opacity={0.5} speed={0.8} />

        <ChapterMarker number="02" label="FIVE HUNDRED TOOLS · NO COHERENCE" />

        {/* Browser tab bar */}
        <BrowserTabBar progress={progress} />

        {/* Floating tools */}
        {tools.map((t, i) => (
          <ToolIcon
            key={i}
            Icon={t.Icon}
            label={t.label}
            hue={t.hue}
            x={t.x}
            y={t.y}
            size={t.size}
            entryAt={t.entry}
            rotation={t.rot}
            progress={progress}
          />
        ))}

        {/* Panic words */}
        {panicTexts.map((p, i) => (
          <PanicText key={i} {...p} />
        ))}

        {/* Notification cascade */}
        <NotificationCascade progress={progress} />

        {/* Central headline */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 z-20"
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <div className="max-w-3xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Scene Two · Recognition
            </div>
            <h2
              className="font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(38px, 6.5vw, 92px)",
                color: PALETTE.ink,
                textShadow: "0 4px 60px rgba(0,0,0,0.9), 0 0 80px rgba(239,68,68,0.3)",
              }}
            >
              Your setup is
              <br />
              <span style={{ color: "#ef4444" }}>ten tabs</span>{" "}
              <span className="italic font-light">and a prayer.</span>
            </h2>
            <p
              className="mt-8 max-w-xl mx-auto leading-relaxed"
              style={{ color: PALETTE.inkMuted, fontSize: "clamp(14px, 1.3vw, 17px)" }}
            >
              A browser screaming at you. A chat app asking for your next move. An AI guessing on one chart.
              A spreadsheet you haven&apos;t updated in weeks. A journal you never finish. Somewhere in the noise —
              a trade you were supposed to take.
            </p>
            <p
              className="mt-6 text-[13px] font-mono tracking-wider"
              style={{ color: "#ef4444" }}
            >
              Forty-five minutes of your day — lost between apps. Every single day.
            </p>
          </div>
        </motion.div>

        {/* Corner metrics */}
        <motion.div
          className="absolute bottom-12 left-12 flex flex-col gap-1 pointer-events-none z-20"
          style={{ opacity: chaosIntensity }}
        >
          <div className="text-[9px] font-mono tracking-widest" style={{ color: PALETTE.inkDim }}>
            CONTEXT SWITCHES
          </div>
          <div className="text-4xl font-black font-mono" style={{ color: "#ef4444" }}>
            168
          </div>
          <div className="text-[9px] font-mono" style={{ color: PALETTE.inkFaint }}>
            PER TRADING SESSION
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 right-12 flex flex-col gap-1 items-end pointer-events-none z-20"
          style={{ opacity: chaosIntensity }}
        >
          <div className="text-[9px] font-mono tracking-widest" style={{ color: PALETTE.inkDim }}>
            DAILY ANNUAL LOSS
          </div>
          <div className="text-4xl font-black font-mono" style={{ color: "#ef4444" }}>
            $13.5B
          </div>
          <div className="text-[9px] font-mono" style={{ color: PALETTE.inkFaint }}>
            300M TRADERS · 45 MIN/DAY
          </div>
        </motion.div>
      </div>
    </Scene>
  )
}
