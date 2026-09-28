"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ChevronDown,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ImageIcon,
  BarChart3,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Award,
  Video,
  Upload,
  Play,
  Pause,
  Monitor,
  Maximize2,
  X,
  Eye,
  Layers,
  LineChart,
  CandlestickChart,
  Send,
  Reply,
  Clock,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

/* ── Types ── */
type TradeStatus = "live" | "tp-hit" | "sl-hit" | "closed" | "pending"
type Direction = "LONG" | "SHORT"
type MediaMode = "chart" | "video"

interface TradeEntry {
  id: string
  user: {
    name: string
    avatar: string
    level: "Beginner" | "Intermediate" | "Advanced" | "Elite"
    winRate: number
    accuracy: number
  }
  trade: {
    pair: string
    direction: Direction
    entryPrice: string
    stopLoss: string
    targets: string[]
    rr: string
    timeframe: string
  }
  confluences: string[]
  reasoning: string
  status: TradeStatus
  pnl?: string
  chartImage?: string
  videoUrl?: string
  reactions: {
    agree: number
    disagree: number
    fire: number
  }
  comments: number
  timestamp: string
  mentorReview?: {
    mentor: string
    rating: number
    note: string
  }
}

interface Comment {
  id: string
  user: { name: string; avatar: string; color: string }
  text: string
  time: string
  likes: number
  isReply?: boolean
  replyTo?: string
}

const ENTRY_COMMENTS: Record<string, Comment[]> = {
  "te-1": [
    { id: "c1", user: { name: "TraderMike", avatar: "TM", color: "from-blue-500 to-cyan-500" }, text: "Clean setup. BPR rejection + DXY strength is a solid confluence. I'm in the same direction on EU.", time: "2m ago", likes: 8 },
    { id: "c2", user: { name: "GoldHunter", avatar: "GH", color: "from-amber-500 to-orange-500" }, text: "Be careful with the Asian session lows sweep -- sometimes it reverses after.", time: "3m ago", likes: 4 },
    { id: "c3", user: { name: "Mentor Alex", avatar: "MA", color: "from-emerald-500 to-teal-500" }, text: "Good read on the institutional flow. The H4 supply zone aligns with the weekly OB. Watch for the London close manipulation.", time: "4m ago", likes: 15, isReply: true, replyTo: "TraderMike" },
    { id: "c4", user: { name: "SwingKing", avatar: "SK", color: "from-violet-500 to-purple-500" }, text: "What's your invalidation if DXY pulls back? The 105.20 level seems critical.", time: "5m ago", likes: 6 },
  ],
  "te-2": [
    { id: "c5", user: { name: "PipMaster", avatar: "PM", color: "from-rose-500 to-pink-500" }, text: "Nice TP hit! The FVG fill was textbook. London sweep into demand is always a strong setup.", time: "45m ago", likes: 12 },
    { id: "c6", user: { name: "NoviceNate", avatar: "NN", color: "from-slate-400 to-slate-500" }, text: "How do you identify the daily FVG? I'm still learning to spot these.", time: "1h ago", likes: 3 },
    { id: "c7", user: { name: "Sophia Reyes", avatar: "SR", color: "from-pink-500 to-rose-500" }, text: "Thanks! I marked the FVG on the daily chart first, then waited for the London session to sweep into it for confirmation.", time: "55m ago", likes: 7, isReply: true, replyTo: "NoviceNate" },
  ],
  "te-3": [
    { id: "c8", user: { name: "TraderMike", avatar: "TM", color: "from-blue-500 to-cyan-500" }, text: "ATH rejection is risky. What if we get another push? CPI coming up could cause volatility.", time: "8m ago", likes: 5 },
    { id: "c9", user: { name: "GoldHunter", avatar: "GH", color: "from-amber-500 to-orange-500" }, text: "Supply zone confluence is strong here. Bearish divergence on the 4H confirms the short bias.", time: "10m ago", likes: 9 },
  ],
}

/* ── Data ── */
const TRADE_ENTRIES: TradeEntry[] = [
  {
    id: "te-1",
    user: { name: "Alex Chen", avatar: "AC", level: "Advanced", winRate: 76, accuracy: 89 },
    trade: { pair: "GBP/USD", direction: "SHORT", entryPrice: "1.3520", stopLoss: "1.3580", targets: ["1.3460", "1.3420"], rr: "1.7", timeframe: "4H" },
    confluences: ["BPR Rejection", "Institutional Flow", "DXY Strength"],
    reasoning: "Short from BPR rejection at H4 supply. DXY showing bullish continuation which supports GBP weakness. Looking for sweep of Asian lows.",
    status: "live",
    chartImage: "/images/student_chart_main.png",
    reactions: { agree: 24, disagree: 3, fire: 12 },
    comments: 8,
    timestamp: "5m ago",
    mentorReview: { mentor: "Chen", rating: 8.5, note: "Clean read on institutional flow. Entry timing is precise." },
  },
  {
    id: "te-2",
    user: { name: "Sophia Reyes", avatar: "SR", level: "Intermediate", winRate: 65, accuracy: 72 },
    trade: { pair: "XAU/USD", direction: "LONG", entryPrice: "2030.50", stopLoss: "2025.00", targets: ["2042.00", "2048.50"], rr: "2.3", timeframe: "1H" },
    confluences: ["FVG Fill", "Demand Zone", "London Open Sweep"],
    reasoning: "Long after London sweep of Asian lows filled the daily FVG. Demand zone at 2030 held with bullish reaction. Targeting weekly supply.",
    status: "tp-hit",
    pnl: "+2.3R",
    reactions: { agree: 41, disagree: 2, fire: 28 },
    comments: 15,
    timestamp: "1h ago",
  },
  {
    id: "te-3",
    user: { name: "Marcus Webb", avatar: "MW", level: "Advanced", winRate: 71, accuracy: 84 },
    trade: { pair: "NAS100", direction: "SHORT", entryPrice: "18520", stopLoss: "18580", targets: ["18420", "18350"], rr: "2.8", timeframe: "15M" },
    confluences: ["ATH Rejection", "Divergence", "Supply Zone"],
    reasoning: "Shorting ATH rejection with bearish divergence on momentum. Supply zone confluence at 18520 area. CPI data risk favors downside.",
    status: "live",
    reactions: { agree: 18, disagree: 7, fire: 5 },
    comments: 4,
    timestamp: "12m ago",
  },
  {
    id: "te-4",
    user: { name: "Emma Li", avatar: "EL", level: "Beginner", winRate: 52, accuracy: 58 },
    trade: { pair: "EUR/USD", direction: "SHORT", entryPrice: "1.0870", stopLoss: "1.0910", targets: ["1.0830", "1.0800"], rr: "1.8", timeframe: "4H" },
    confluences: ["H4 Supply", "Bearish OB"],
    reasoning: "Short from H4 supply zone. Bearish order block rejection with volume confirmation.",
    status: "sl-hit",
    pnl: "-1R",
    reactions: { agree: 6, disagree: 11, fire: 1 },
    comments: 9,
    timestamp: "3h ago",
    mentorReview: { mentor: "Alex", rating: 5.0, note: "Entry was premature. Wait for confirmation candle close before entering." },
  },
  {
    id: "te-5",
    user: { name: "David Park", avatar: "DP", level: "Elite", winRate: 82, accuracy: 91 },
    trade: { pair: "BTC/USD", direction: "LONG", entryPrice: "67200", stopLoss: "66500", targets: ["68800", "70000"], rr: "2.3", timeframe: "1D" },
    confluences: ["Weekly Demand", "Halving Cycle", "Macro Risk-On"],
    reasoning: "Swing long from weekly demand zone. Post-halving accumulation phase aligns with macro risk-on sentiment. DXY weakness supporting crypto.",
    status: "live",
    videoUrl: "demo",
    reactions: { agree: 56, disagree: 8, fire: 34 },
    comments: 22,
    timestamp: "6h ago",
  },
]

const statusConfig = {
  live: { label: "LIVE", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  "tp-hit": { label: "TP HIT", color: "bg-sky-500/20 text-sky-400 border-sky-500/30", dot: "bg-sky-400" },
  "sl-hit": { label: "SL HIT", color: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-400" },
  closed: { label: "CLOSED", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", dot: "bg-slate-400" },
  pending: { label: "PENDING", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
}

const levelColors = {
  Beginner: { text: "text-slate-400", bg: "bg-slate-500/20", gradient: "from-slate-500 to-slate-600" },
  Intermediate: { text: "text-sky-400", bg: "bg-sky-500/20", gradient: "from-sky-500 to-blue-600" },
  Advanced: { text: "text-violet-400", bg: "bg-violet-500/20", gradient: "from-violet-500 to-indigo-600" },
  Elite: { text: "text-amber-400", bg: "bg-amber-500/20", gradient: "from-amber-500 to-orange-600" },
}

const EASE = [0.22, 1, 0.36, 1] as const

/* ── TradingView Chart Placeholder (interactive mock) ── */
function TradingViewPanel({ pair, direction, entry, sl, targets }: {
  pair: string; direction: Direction; entry: string; sl: string; targets: string[]
}) {
  const isLong = direction === "LONG"
  const entryNum = parseFloat(entry.replace(",", ""))
  const slNum = parseFloat(sl.replace(",", ""))
  const tp1Num = parseFloat((targets[0] || entry).replace(",", ""))

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Chart toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <CandlestickChart className="w-3 h-3 text-slate-400/70" />
          <span className="text-[10px] font-mono font-bold text-white/80">{pair}</span>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${isLong ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
            {isLong ? "+0.42%" : "-0.18%"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {["1m", "5m", "15m", "1H", "4H"].map(tf => (
            <button key={tf} className={`px-1.5 py-0.5 rounded text-[7px] font-mono transition-all ${
              tf === "4H" ? "bg-white/10 text-white/80" : "text-slate-500/60 hover:text-white/60"
            }`}>{tf}</button>
          ))}
        </div>
      </div>

      {/* Chart body with SVG candles + levels */}
      <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.95), rgba(8,10,18,0.98))" }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {[...Array(8)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 12}%`} x2="100%" y2={`${(i + 1) * 12}%`}
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[...Array(12)].map((_, i) => (
            <line key={`v-${i}`} x1={`${(i + 1) * 8}%`} y1="0" x2={`${(i + 1) * 8}%`} y2="100%"
              stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          ))}
        </svg>

        {/* Candlestick pattern (mock) */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
          {[
            { x: 30, o: 130, c: 120, h: 110, l: 140 },
            { x: 50, o: 120, c: 115, h: 105, l: 125 },
            { x: 70, o: 115, c: 125, h: 100, l: 130 },
            { x: 90, o: 125, c: 118, h: 112, l: 132 },
            { x: 110, o: 118, c: 108, h: 100, l: 125 },
            { x: 130, o: 108, c: 100, h: 95, l: 115 },
            { x: 150, o: 100, c: 110, h: 90, l: 115 },
            { x: 170, o: 110, c: 105, h: 98, l: 118 },
            { x: 190, o: 105, c: 95, h: 88, l: 110 },
            { x: 210, o: 95, c: 85, h: 78, l: 100 },
            { x: 230, o: 85, c: 92, h: 78, l: 98 },
            { x: 250, o: 92, c: 88, h: 82, l: 96 },
            { x: 270, o: 88, c: 78, h: 72, l: 92 },
            { x: 290, o: 78, c: 82, h: 70, l: 88 },
            { x: 310, o: 82, c: isLong ? 70 : 90, h: isLong ? 65 : 95, l: isLong ? 88 : 78 },
            { x: 330, o: isLong ? 70 : 90, c: isLong ? 60 : 100, h: isLong ? 55 : 105, l: isLong ? 75 : 85 },
            { x: 350, o: isLong ? 60 : 100, c: isLong ? 55 : 108, h: isLong ? 48 : 115, l: isLong ? 65 : 95 },
          ].map((c, i) => {
            const bullish = c.c < c.o
            const color = bullish ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.85)"
            const bodyTop = Math.min(c.o, c.c)
            const bodyH = Math.abs(c.o - c.c) || 1
            return (
              <g key={i}>
                <motion.line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth="1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.03, duration: 0.2 }} />
                <motion.rect x={c.x - 5} y={bodyTop} width="10" height={bodyH} fill={color} rx="0.5"
                  initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.03, duration: 0.25, ease: EASE }} />
              </g>
            )
          })}
        </svg>

        {/* Entry level line */}
        <motion.div className="absolute left-0 right-0 flex items-center"
          style={{ top: "45%" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.4, ease: EASE }}>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.25)", backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 6px, transparent 6px, transparent 12px)" }} />
          <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
            ENTRY {entry}
          </span>
        </motion.div>

        {/* Stop loss level */}
        <motion.div className="absolute left-0 right-0 flex items-center"
          style={{ top: isLong ? "68%" : "25%" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.4, ease: EASE }}>
          <div className="h-px flex-1" style={{ background: "rgba(239,68,68,0.5)", backgroundImage: "repeating-linear-gradient(90deg, rgba(239,68,68,0.5) 0, rgba(239,68,68,0.5) 6px, transparent 6px, transparent 12px)" }} />
          <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.15)", color: "rgba(248,113,113,0.9)" }}>
            SL {sl}
          </span>
        </motion.div>

        {/* TP1 level */}
        <motion.div className="absolute left-0 right-0 flex items-center"
          style={{ top: isLong ? "22%" : "70%" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.4, ease: EASE }}>
          <div className="h-px flex-1" style={{ background: "rgba(16,185,129,0.5)", backgroundImage: "repeating-linear-gradient(90deg, rgba(16,185,129,0.5) 0, rgba(16,185,129,0.5) 6px, transparent 6px, transparent 12px)" }} />
          <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.15)", color: "rgba(52,211,153,0.9)" }}>
            TP1 {targets[0]}
          </span>
        </motion.div>

        {/* TP2 level */}
        {targets[1] && (
          <motion.div className="absolute left-0 right-0 flex items-center"
            style={{ top: isLong ? "12%" : "82%" }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.4, ease: EASE }}>
            <div className="h-px flex-1" style={{ background: "rgba(16,185,129,0.35)", backgroundImage: "repeating-linear-gradient(90deg, rgba(16,185,129,0.35) 0, rgba(16,185,129,0.35) 6px, transparent 6px, transparent 12px)" }} />
            <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0"
              style={{ background: "rgba(16,185,129,0.1)", color: "rgba(52,211,153,0.7)" }}>
              TP2 {targets[1]}
            </span>
          </motion.div>
        )}

        {/* Direction arrow indicator */}
        <motion.div className="absolute right-4 flex flex-col items-center gap-1"
          style={{ top: "40%" }}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}>
          {isLong ? (
            <TrendingUp className="w-6 h-6 text-emerald-400/60" />
          ) : (
            <TrendingDown className="w-6 h-6 text-red-400/60" />
          )}
        </motion.div>

        {/* Volume bars at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[30px] flex items-end gap-px px-4">
          {[...Array(35)].map((_, i) => {
            const h = Math.random() * 20 + 4
            return (
              <motion.div key={i} className="flex-1 rounded-t-sm"
                style={{ background: h > 15 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)" }}
                initial={{ height: 0 }} animate={{ height: h }}
                transition={{ delay: 0.5 + i * 0.02, duration: 0.3 }} />
            )
          })}
        </div>

        {/* TradingView watermark */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1 opacity-20">
          <LineChart className="w-3 h-3 text-slate-400" />
          <span className="text-[7px] font-mono text-slate-400">TradingView</span>
        </div>
      </div>

      {/* Price info bar */}
      <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <span className="text-[7px] text-slate-500/50">O</span>
          <span className="text-[8px] font-mono text-white/60">{entry}</span>
          <span className="text-[7px] text-slate-500/50">H</span>
          <span className="text-[8px] font-mono text-emerald-400/60">{(entryNum * 1.002).toFixed(pair.includes("USD") && !pair.includes("XAU") && !pair.includes("BTC") && !pair.includes("NAS") ? 4 : 2)}</span>
          <span className="text-[7px] text-slate-500/50">L</span>
          <span className="text-[8px] font-mono text-red-400/60">{(entryNum * 0.998).toFixed(pair.includes("USD") && !pair.includes("XAU") && !pair.includes("BTC") && !pair.includes("NAS") ? 4 : 2)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[6px] text-slate-500/40">Vol</span>
          <span className="text-[7px] font-mono text-slate-400/50">12.4K</span>
        </div>
      </div>
    </div>
  )
}

/* ── Video Upload Panel ── */
function VideoPanel({ entry, hasVideo }: { entry: TradeEntry; hasVideo: boolean }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (hasVideo) {
    return (
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Video toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
          style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <Video className="w-3 h-3 text-violet-400/70" />
            <span className="text-[10px] font-bold text-white/80">Trade Breakdown</span>
            <span className="text-[7px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400/80 font-bold">3:42</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-slate-500/50">by {entry.user.name}</span>
          </div>
        </div>

        {/* Video content area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.95), rgba(8,10,18,0.98))" }}>
          {/* Video poster/thumbnail */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08), transparent 70%)" }} />

          {/* Play button overlay */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(109,40,217,0.5))",
              boxShadow: "0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)",
              border: "2px solid rgba(167,139,250,0.3)",
            }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(139,92,246,0.3)" }} />
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white ml-0" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </motion.button>

          {/* Mock video waveform when playing */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-12 left-4 right-4 flex items-end justify-center gap-[2px] h-8">
                {[...Array(50)].map((_, i) => (
                  <motion.div key={i} className="w-1 rounded-t-sm bg-violet-400/40"
                    animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.02 }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart screenshot in background (faded) */}
          {entry.chartImage && (
            <div className="absolute inset-0 opacity-10">
              <img src={entry.chartImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Video controls bar */}
        <div className="flex items-center gap-3 px-3 py-2 flex-shrink-0"
          style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex-1 h-1 rounded-full bg-white/10 relative overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.8), rgba(167,139,250,0.8))" }}
              animate={isPlaying ? { width: ["0%", "100%"] } : {}}
              transition={isPlaying ? { duration: 222, ease: "linear" } : {}} />
          </div>
          <span className="text-[7px] font-mono text-slate-500/50">{isPlaying ? "0:12" : "0:00"} / 3:42</span>
        </div>
      </div>
    )
  }

  // Upload state
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0"
      style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.95), rgba(8,10,18,0.98))" }}>
      <motion.div
        className={`w-full max-w-[280px] aspect-[16/10] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${
          isDragging ? "scale-[1.02]" : ""
        }`}
        style={{
          background: isDragging ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
          border: `2px dashed ${isDragging ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: isDragging ? "0 0 30px rgba(139,92,246,0.15)" : "none",
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
        onClick={() => fileRef.current?.click()}
        whileHover={{ borderColor: "rgba(139,92,246,0.35)" }}
      >
        <input ref={fileRef} type="file" accept="video/*" className="hidden" />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <Upload className="w-8 h-8 text-violet-400/50" />
        </motion.div>
        <div className="text-center">
          <p className="text-[11px] font-semibold text-white/60">Upload Trade Video</p>
          <p className="text-[8px] text-slate-500/50 mt-1">Drag & drop or click to browse</p>
          <p className="text-[7px] text-slate-600/40 mt-0.5">MP4, WebM up to 50MB</p>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Comment Section ── */
function CommentSection({ entryId, entryUser }: { entryId: string; entryUser: string }) {
  const [commentInput, setCommentInput] = useState("")
  const comments = ENTRY_COMMENTS[entryId] || []

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Comment header */}
      <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.15)" }}>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-violet-400/70" />
          <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Discussion</span>
          <span className="px-1.5 py-0.5 rounded text-[7px] font-bold"
            style={{ background: "rgba(139,92,246,0.1)", color: "rgba(167,139,250,0.8)" }}>
            {comments.length}
          </span>
        </div>
        <span className="text-[7px] text-slate-500/40">{entryUser}&apos;s trade</span>
      </div>

      {/* Comment feed — scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2.5 space-y-2">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="w-8 h-8 text-slate-700/40 mb-2" />
              <p className="text-[10px] text-slate-600/50">No comments yet</p>
              <p className="text-[8px] text-slate-700/35 mt-0.5">Be the first to share your thoughts</p>
            </div>
          ) : (
            comments.map((comment, idx) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
                className="group"
              >
                {/* Reply indicator */}
                {comment.isReply && comment.replyTo && (
                  <div className="flex items-center gap-1 ml-5 mb-0.5">
                    <Reply className="w-2 h-2 text-slate-600/40 rotate-180" />
                    <span className="text-[7px] text-slate-600/40">replying to {comment.replyTo}</span>
                  </div>
                )}
                <div className={`flex gap-2 ${comment.isReply ? "ml-5" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${comment.user.color} flex-shrink-0 flex items-center justify-center text-[7px] font-bold text-white`}
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                    {comment.user.avatar}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-semibold text-white/80">{comment.user.name}</span>
                      <div className="flex items-center gap-0.5">
                        <Clock className="w-2 h-2 text-slate-600/40" />
                        <span className="text-[7px] text-slate-600/40">{comment.time}</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400/75 leading-relaxed">{comment.text}</p>
                    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-0.5 text-[7px] text-slate-600/50 hover:text-emerald-400 transition-colors">
                        <ThumbsUp className="w-2 h-2" />{comment.likes}
                      </button>
                      <button className="flex items-center gap-0.5 text-[7px] text-slate-600/50 hover:text-violet-400 transition-colors">
                        <Reply className="w-2 h-2" />Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Comment input */}
      <div className="flex-shrink-0 px-2.5 py-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.12)" }}>
        <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-0 text-[10px] text-white/80 placeholder:text-slate-600/50 focus-visible:ring-0 p-0 h-auto"
          />
          <motion.button whileTap={{ scale: 0.85 }}
            className="p-1 rounded-md transition-all"
            style={{
              background: commentInput.trim() ? "linear-gradient(135deg, rgba(139,92,246,0.7), rgba(109,40,217,0.8))" : "rgba(255,255,255,0.04)",
              color: commentInput.trim() ? "white" : "rgba(148,163,184,0.35)",
            }}>
            <Send className="w-2.5 h-2.5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

/* ── Media Panel (right column) ── */
function MediaPanel({ selectedEntry }: { selectedEntry: TradeEntry | null }) {
  const [mediaMode, setMediaMode] = useState<MediaMode>("chart")

  if (!selectedEntry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-0"
        style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.95), rgba(8,10,18,0.98))" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Layers className="w-10 h-10 text-slate-600/40 mx-auto mb-3" />
          </motion.div>
          <p className="text-[11px] text-slate-500/50 font-medium">Select an entry</p>
          <p className="text-[8px] text-slate-600/35 mt-1">Click any trade to view chart or video</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Media toggle header */}
      <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.25)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider">{selectedEntry.user.name}</span>
          <span className="text-[8px] font-mono text-slate-500/50">{selectedEntry.trade.pair}</span>
        </div>
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
          <button
            onClick={() => setMediaMode("chart")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-bold transition-all ${
              mediaMode === "chart"
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-slate-500/50 hover:text-white/50"
            }`}>
            <BarChart3 className="w-2.5 h-2.5" />
            Chart
          </button>
          <button
            onClick={() => setMediaMode("video")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-bold transition-all ${
              mediaMode === "video"
                ? "bg-violet-500/15 text-violet-400"
                : "text-slate-500/50 hover:text-white/50"
            }`}>
            <Video className="w-2.5 h-2.5" />
            Video
          </button>
        </div>
      </div>

      {/* Media content */}
      <AnimatePresence mode="wait">
        {mediaMode === "chart" ? (
          <motion.div key="chart" className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}>
            <TradingViewPanel
              pair={selectedEntry.trade.pair}
              direction={selectedEntry.trade.direction}
              entry={selectedEntry.trade.entryPrice}
              sl={selectedEntry.trade.stopLoss}
              targets={selectedEntry.trade.targets}
            />
          </motion.div>
        ) : (
          <motion.div key="video" className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}>
            <VideoPanel entry={selectedEntry} hasVideo={!!selectedEntry.videoUrl} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Main EntryRoom Component ── */
export function EntryRoom() {
  const [filter, setFilter] = useState<"all" | "live" | "winners" | "losers">("all")
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<string | null>("te-1")
  const [userReactions, setUserReactions] = useState<Record<string, "agree" | "disagree" | "fire" | null>>({})

  const filtered = TRADE_ENTRIES.filter((e) => {
    if (filter === "live") return e.status === "live" || e.status === "pending"
    if (filter === "winners") return e.status === "tp-hit"
    if (filter === "losers") return e.status === "sl-hit"
    return true
  })

  const selectedEntryData = TRADE_ENTRIES.find(e => e.id === selectedEntry) || null

  const handleReaction = (entryId: string, type: "agree" | "disagree" | "fire") => {
    setUserReactions((prev) => ({
      ...prev,
      [entryId]: prev[entryId] === type ? null : type,
    }))
  }

  const handleSelectEntry = (id: string) => {
    setSelectedEntry(prev => prev === id ? null : id)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-400" />
          <span className="text-[12px] font-semibold text-white">Entry Room</span>
          <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-[8px] font-bold">
            {TRADE_ENTRIES.filter((e) => e.status === "live").length} LIVE
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
          {(["all", "live", "winners", "losers"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all capitalize ${
                filter === f ? "bg-violet-500/20 text-violet-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT — Entry cards list */}
        <ScrollArea className="w-[48%] min-w-[300px] flex-shrink-0 border-r border-white/[0.04]">
          <div className="p-3 space-y-2.5">
            {filtered.map((entry, idx) => {
              const isExpanded = expandedEntry === entry.id
              const isSelected = selectedEntry === entry.id
              const currentReaction = userReactions[entry.id]
              const sc = statusConfig[entry.status]
              const lc = levelColors[entry.user.level]

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleSelectEntry(entry.id)}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "ring-1 ring-violet-500/40"
                      : ""
                  } ${
                    entry.status === "sl-hit"
                      ? "opacity-75"
                      : ""
                  }`}
                  style={{
                    background: isSelected
                      ? "rgba(139,92,246,0.06)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${
                      isSelected
                        ? "rgba(139,92,246,0.2)"
                        : entry.status === "sl-hit"
                          ? "rgba(239,68,68,0.12)"
                          : entry.status === "tp-hit"
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(255,255,255,0.06)"
                    }`,
                  }}
                >
                  {/* Card Header */}
                  <div className="p-3 pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${lc.gradient} flex items-center justify-center text-[9px] font-bold text-white`}
                          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                          {entry.user.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-white">{entry.user.name}</span>
                            <span className={`text-[7px] px-1 py-0.5 rounded font-medium ${lc.text} ${lc.bg}`}>
                              {entry.user.level}
                            </span>
                            {entry.mentorReview && (
                              <span className="text-[7px] px-1 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium flex items-center gap-0.5">
                                <Award className="w-2 h-2" /> Reviewed
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[8px] text-slate-500">WR {entry.user.winRate}%</span>
                            <span className="text-[8px] text-slate-600">|</span>
                            <span className="text-[8px] text-slate-500">Acc {entry.user.accuracy}%</span>
                            <span className="text-[8px] text-slate-600">|</span>
                            <span className="text-[8px] text-slate-500">{entry.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {entry.pnl && (
                          <span className={`text-[10px] font-mono font-bold ${
                            entry.pnl.startsWith("+") ? "text-emerald-400" : "text-red-400"
                          }`}>{entry.pnl}</span>
                        )}
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wider border ${sc.color}`}>
                          {entry.status === "live" && (
                            <span className={`w-1 h-1 rounded-full ${sc.dot} animate-pulse`} />
                          )}
                          {sc.label}
                        </span>
                      </div>
                    </div>

                    {/* Trade Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] font-mono font-bold text-white">{entry.trade.pair}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex items-center gap-0.5 ${
                        entry.trade.direction === "LONG"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}>
                        {entry.trade.direction === "LONG" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                        {entry.trade.direction}
                      </span>
                      <span className="text-[8px] text-slate-500 bg-white/5 px-1 py-0.5 rounded">{entry.trade.timeframe}</span>
                      <span className="text-[8px] text-slate-500 font-mono">R:R {entry.trade.rr}</span>
                    </div>

                    {/* Price Grid — compact */}
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                        <p className="text-[7px] text-slate-500 uppercase">Entry</p>
                        <p className="text-[10px] font-mono font-bold text-white">{entry.trade.entryPrice}</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-red-500/[0.04] border border-red-500/[0.08]">
                        <p className="text-[7px] text-red-400/70 uppercase">Stop</p>
                        <p className="text-[10px] font-mono font-bold text-red-400">{entry.trade.stopLoss}</p>
                      </div>
                      {entry.trade.targets.map((tp, i) => (
                        <div key={i} className="p-1.5 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/[0.08]">
                          <p className="text-[7px] text-emerald-400/70 uppercase">TP{i + 1}</p>
                          <p className="text-[10px] font-mono font-bold text-emerald-400">{tp}</p>
                        </div>
                      ))}
                    </div>

                    {/* Confluences */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.confluences.map((c, i) => (
                        <span key={i} className="text-[7px] px-1.5 py-0.5 rounded-md bg-violet-500/8 text-violet-400/80 border border-violet-500/15">
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Reasoning */}
                    <p className={`text-[10px] text-slate-400/80 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
                      {entry.reasoning}
                    </p>
                  </div>

                  {/* Expand Toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedEntry(isExpanded ? null : entry.id) }}
                    className="w-full px-3 py-1.5 flex items-center justify-center gap-1 text-[8px] text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all border-t border-white/[0.04]"
                  >
                    {isExpanded ? "Show less" : "Show chart & mentor review"}
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-2 border-t border-white/[0.04]">
                          {/* Chart thumbnail */}
                          {entry.chartImage && (
                            <div className="aspect-[16/9] rounded-lg bg-white/[0.03] border border-white/[0.04] overflow-hidden mt-2">
                              <img src={entry.chartImage} alt={`${entry.trade.pair} chart`} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {/* Mentor Review */}
                          {entry.mentorReview && (
                            <div className={`p-2.5 rounded-lg border ${
                              entry.mentorReview.rating >= 7
                                ? "bg-emerald-500/[0.04] border-emerald-500/15"
                                : entry.mentorReview.rating >= 5
                                  ? "bg-amber-500/[0.04] border-amber-500/15"
                                  : "bg-red-500/[0.04] border-red-500/15"
                            }`}>
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <Award className="w-3 h-3 text-amber-400" />
                                  <span className="text-[10px] font-semibold text-white">Mentor {entry.mentorReview.mentor}</span>
                                </div>
                                <span className={`text-[11px] font-bold font-mono ${
                                  entry.mentorReview.rating >= 7 ? "text-emerald-400"
                                    : entry.mentorReview.rating >= 5 ? "text-amber-400" : "text-red-400"
                                }`}>{entry.mentorReview.rating}/10</span>
                              </div>
                              <p className="text-[9px] text-slate-300/70 italic">{`"${entry.mentorReview.note}"`}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer: Reactions */}
                  <div className="px-3 py-1.5 flex items-center justify-between border-t border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      {([
                        { type: "agree" as const, icon: ThumbsUp, count: entry.reactions.agree, active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", color: "text-slate-500 hover:text-emerald-400" },
                        { type: "disagree" as const, icon: ThumbsDown, count: entry.reactions.disagree, active: "bg-red-500/15 text-red-400 border-red-500/25", color: "text-slate-500 hover:text-red-400" },
                        { type: "fire" as const, icon: Flame, count: entry.reactions.fire, active: "bg-amber-500/15 text-amber-400 border-amber-500/25", color: "text-slate-500 hover:text-amber-400" },
                      ]).map(r => (
                        <button key={r.type}
                          onClick={(e) => { e.stopPropagation(); handleReaction(entry.id, r.type) }}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] transition-all ${
                            currentReaction === r.type ? `${r.active} border` : `${r.color} hover:bg-white/[0.03]`
                          }`}>
                          <r.icon className="w-2.5 h-2.5" />
                          {r.count + (currentReaction === r.type ? 1 : 0)}
                        </button>
                      ))}
                    </div>
                    <button className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {entry.comments}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>

        {/* RIGHT — Chart/Video (top) + Comments (bottom) */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Media takes ~55% */}
          <div className="flex flex-col" style={{ height: "55%", minHeight: 200 }}>
            <MediaPanel selectedEntry={selectedEntryData} />
          </div>
          {/* Comments take ~45% */}
          <div className="flex flex-col flex-1 min-h-0">
            {selectedEntryData ? (
              <CommentSection entryId={selectedEntryData.id} entryUser={selectedEntryData.user.name} />
            ) : (
              <div className="flex-1 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.1)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="text-center">
                  <MessageSquare className="w-6 h-6 text-slate-700/30 mx-auto mb-1.5" />
                  <p className="text-[9px] text-slate-600/40">Select a trade to view discussion</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
