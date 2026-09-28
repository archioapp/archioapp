"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import {
  TrendingUp, TrendingDown, Calendar, BarChart3, Activity,
  Target, Clock, ArrowUpRight, ArrowDownRight, ChevronRight,
  Flame, Brain, Shield, Plus, X, Search, Settings,
  LayoutGrid, DollarSign, Crosshair, Gauge, ChevronDown,
  Wallet, Zap, Eye, EyeOff, GripVertical,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   DATA LAYER
   ═══════════════════════════════════════════════════════════════ */
interface Trade {
  id: string; pair: string; side: "long" | "short"; date: string
  entry: number; exit: number; pnl: number; rr: number; pips: number
  session: string; setup: string; emotion: string; tags: string[]
  account: string
}

const ACCOUNTS = [
  { id: "main", label: "Main Account", balance: 25000, color: "#10b981" },
  { id: "prop", label: "FTMO Challenge", balance: 100000, color: "#06b6d4" },
  { id: "demo", label: "Demo / Backtest", balance: 50000, color: "#8b5cf6" },
]

const TRADES: Trade[] = [
  { id: "1", pair: "EUR/USD", side: "long", date: "Mar 4", entry: 1.08423, exit: 1.08567, pnl: 72, rr: 2.4, pips: 14.4, session: "London", setup: "Order Block", emotion: "Calm", tags: ["Trend"], account: "main" },
  { id: "2", pair: "GBP/JPY", side: "short", date: "Mar 4", entry: 193.456, exit: 193.112, pnl: 103, rr: 3.1, pips: 34.4, session: "NY AM", setup: "FVG", emotion: "Confident", tags: ["Reversal"], account: "main" },
  { id: "3", pair: "XAU/USD", side: "long", date: "Mar 3", entry: 2341.50, exit: 2338.20, pnl: -33, rr: -0.7, pips: -3.3, session: "London", setup: "Breaker", emotion: "FOMO", tags: ["Against Trend"], account: "main" },
  { id: "4", pair: "NAS100", side: "long", date: "Mar 3", entry: 18234, exit: 18312, pnl: 156, rr: 4.2, pips: 78, session: "NY PM", setup: "Displacement", emotion: "Focused", tags: ["Momentum"], account: "prop" },
  { id: "5", pair: "USD/CAD", side: "short", date: "Mar 2", entry: 1.36789, exit: 1.36912, pnl: -25, rr: -0.8, pips: -12.3, session: "London", setup: "Liq Sweep", emotion: "Revenge", tags: ["Overtraded"], account: "main" },
  { id: "6", pair: "EUR/JPY", side: "long", date: "Mar 1", entry: 162.345, exit: 162.567, pnl: 89, rr: 2.8, pips: 22.2, session: "Asia", setup: "Breaker Block", emotion: "Patient", tags: ["Session Open"], account: "prop" },
  { id: "7", pair: "BTC/USD", side: "short", date: "Feb 28", entry: 67234, exit: 66890, pnl: 172, rr: 3.5, pips: 344, session: "Late NY", setup: "Supply Zone", emotion: "Calm", tags: ["Swing"], account: "main" },
]

function useStats(accountFilter: string) {
  return useMemo(() => {
    const filtered = accountFilter === "all" ? TRADES : TRADES.filter(t => t.account === accountFilter)
    const wins = filtered.filter(t => t.pnl > 0)
    const losses = filtered.filter(t => t.pnl < 0)
    const total = filtered.reduce((s, t) => s + t.pnl, 0)
    const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0
    const avgLoss = losses.length ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0
    return {
      total, winRate: filtered.length ? (wins.length / filtered.length) * 100 : 0,
      avgRR: filtered.length ? filtered.reduce((s, t) => s + Math.abs(t.rr), 0) / filtered.length : 0,
      wins: wins.length, losses: losses.length, count: filtered.length,
      best: filtered.length ? Math.max(...filtered.map(t => t.pnl)) : 0,
      worst: filtered.length ? Math.min(...filtered.map(t => t.pnl)) : 0,
      avgWin, avgLoss, profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
      trades: filtered,
    }
  }, [accountFilter])
}

/* ═══════════════════════════════════════════════════════════════
   ACCOUNT SELECTOR
   ═══════════════════════════════════════════════════════════════ */
function AccountSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const current = value === "all" ? { label: "All Accounts", color: "#f59e0b" } : ACCOUNTS.find(a => a.id === value) || ACCOUNTS[0]

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-white/[0.02]"
        style={{ border: `1px solid ${current.color}12` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: current.color }} />
        <span className="text-[8px] font-mono font-bold text-white/35 uppercase tracking-[0.1em]">{current.label}</span>
        <ChevronDown className={`w-2.5 h-2.5 text-white/15 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-1 z-50 w-[200px] rounded-xl overflow-hidden"
              style={{ backgroundColor: "rgba(10,11,15,0.97)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}>
              <button onClick={() => { onChange("all"); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 transition-all hover:bg-white/[0.02] ${value === "all" ? "bg-white/[0.015]" : ""}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-[0.1em] flex-1 text-left">All Accounts</span>
              </button>
              <div className="h-px bg-white/[0.03]" />
              {ACCOUNTS.map(a => (
                <button key={a.id} onClick={() => { onChange(a.id); setOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 transition-all hover:bg-white/[0.02] ${value === a.id ? "bg-white/[0.015]" : ""}`}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                  <div className="flex-1 text-left">
                    <span className="text-[8px] font-mono font-bold text-white/40 block">{a.label}</span>
                    <span className="text-[6px] font-mono text-white/12">${a.balance.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE COCKPIT - Deeply Enhanced
   ═══════════════════════════════════════════════════════════════ */
function PerformanceCockpit({ s }: { s: ReturnType<typeof useStats> }) {
  const [hovIdx, setHovIdx] = useState<number | null>(null)
  const [showBalance, setShowBalance] = useState(true)

  const metrics = [
    {
      label: "Net Profit", value: `${s.total >= 0 ? "+" : ""}$${Math.abs(s.total).toLocaleString()}`,
      sub: `${s.count} trades`, color: s.total >= 0 ? "#10b981" : "#ef4444",
      icon: DollarSign, spark: [0, 72, 175, 142, 298, 273, 534],
      detail: s.total >= 0 ? "Profitable" : "Drawdown",
    },
    {
      label: "Win Rate", value: `${s.winRate.toFixed(1)}%`,
      sub: `${s.wins}W ${s.losses}L`, color: s.winRate >= 55 ? "#10b981" : s.winRate >= 45 ? "#f59e0b" : "#ef4444",
      icon: Target, spark: [45, 60, 55, 71, 65, 58, 71],
      detail: s.winRate >= 55 ? "Above target" : "Below target",
    },
    {
      label: "Avg R:R", value: `${s.avgRR.toFixed(1)}R`,
      sub: `Best ${s.best > 0 ? "+" : ""}$${s.best}`, color: s.avgRR >= 2 ? "#06b6d4" : "#f59e0b",
      icon: Crosshair, spark: [2.4, 3.1, 0.7, 4.2, 0.8, 2.8, 3.5],
      detail: s.avgRR >= 2 ? "Positive edge" : "Needs work",
    },
    {
      label: "Profit Factor", value: s.profitFactor > 0 ? s.profitFactor.toFixed(2) : "--",
      sub: `Avg +$${s.avgWin.toFixed(0)} / -$${s.avgLoss.toFixed(0)}`, color: s.profitFactor >= 1.5 ? "#8b5cf6" : "#f59e0b",
      icon: Zap, spark: [1.2, 1.8, 1.4, 2.1, 1.6, 2.4, 2.2],
      detail: s.profitFactor >= 1.5 ? "Strong edge" : "Marginal",
    },
    {
      label: "Discipline", value: "72%",
      sub: "3/5 rules met", color: "#14b8a6",
      icon: Shield, spark: [60, 75, 55, 80, 45, 78, 72],
      detail: "Above avg",
    },
  ]

  return (
    <div className="space-y-3">
      {/* Balance hero */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="w-2.5 h-2.5 text-white/10" />
            <span className="text-[7px] font-mono text-white/15 uppercase tracking-[0.12em]">Account Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} className="p-0.5 rounded hover:bg-white/[0.03] transition-all">
              {showBalance ? <Eye className="w-2.5 h-2.5 text-white/10" /> : <EyeOff className="w-2.5 h-2.5 text-white/10" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-mono font-black text-white/70 tabular-nums leading-none">
              {showBalance ? "$25,534" : "$*****"}
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-400/60">+2.14%</span>
          </div>
        </div>
        {/* Mini equity spark */}
        <svg width="100" height="32" viewBox="0 0 100 32" className="shrink-0">
          <defs>
            <linearGradient id="bal-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const pts = [25000, 25072, 25175, 25142, 25298, 25273, 25534]
            const mn = Math.min(...pts), mx = Math.max(...pts), rng = mx - mn || 1
            const coords = pts.map((v, i) => ({ x: 4 + (i / (pts.length - 1)) * 92, y: 4 + (1 - (v - mn) / rng) * 24 }))
            const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ")
            return (
              <>
                <path d={line + ` L${coords[coords.length - 1].x.toFixed(1)} 30 L${coords[0].x.toFixed(1)} 30 Z`} fill="url(#bal-g)" />
                <path d={line} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="2.5" fill="#10b981" opacity="0.8">
                  <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
                </circle>
              </>
            )
          })()}
        </svg>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* KPI cards row */}
      <div className="grid grid-cols-5 gap-1.5">
        {metrics.map((m, i) => {
          const Icon = m.icon
          const isH = hovIdx === i
          const sparkMax = Math.max(...m.spark)
          const sparkMin = Math.min(...m.spark)
          const sparkRange = sparkMax - sparkMin || 1

          return (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
              className="relative rounded-xl px-2.5 py-2.5 cursor-default overflow-hidden group/kpi"
              style={{
                backgroundColor: isH ? `${m.color}06` : "rgba(255,255,255,0.008)",
                border: `1px solid ${isH ? `${m.color}15` : "rgba(255,255,255,0.025)"}`,
                transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
              }}>
              {/* Background sparkline */}
              <svg className="absolute bottom-0 left-0 right-0 h-[24px] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 24">
                <path d={m.spark.map((v, j) => {
                  const x = (j / (m.spark.length - 1)) * 100
                  const y = 20 - ((v - sparkMin) / sparkRange) * 16
                  return `${j === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
                }).join(" ") + " L100 24 L0 24 Z"} fill={m.color} opacity={isH ? 0.08 : 0.02} />
                <path d={m.spark.map((v, j) => {
                  const x = (j / (m.spark.length - 1)) * 100
                  const y = 20 - ((v - sparkMin) / sparkRange) * 16
                  return `${j === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
                }).join(" ")} fill="none" stroke={m.color} strokeWidth="1" opacity={isH ? 0.4 : 0.1} strokeLinecap="round" />
              </svg>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-1.5">
                  <Icon className="w-2.5 h-2.5 transition-colors" style={{ color: isH ? `${m.color}70` : `${m.color}30` }} />
                  <span className="text-[6px] font-mono font-bold uppercase tracking-[0.14em] transition-colors" style={{ color: isH ? `${m.color}50` : `${m.color}25` }}>
                    {m.label}
                  </span>
                </div>
                <div className="text-[15px] font-mono font-black tabular-nums leading-none transition-colors" style={{ color: isH ? m.color : `${m.color}90` }}>
                  {m.value}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[6px] font-mono text-white/12 tabular-nums">{m.sub}</span>
                </div>
              </div>

              {/* Hover tooltip */}
              <AnimatePresence>
                {isH && (
                  <motion.div
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-1 right-1.5 z-20">
                    <span className="text-[5px] font-mono italic" style={{ color: `${m.color}35` }}>{m.detail}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EQUITY CURVE - Enhanced
   ═══════════════════════════════════════════════════════════════ */
function EquityCurve({ trades }: { trades: Trade[] }) {
  const [hov, setHov] = useState<number | null>(null)
  const points = useMemo(() => {
    let eq = 25000
    return [{ y: eq, label: "Start", pnl: 0, date: "" }, ...trades.map(t => { eq += t.pnl; return { y: eq, label: t.pair, pnl: t.pnl, date: t.date } })]
  }, [trades])

  const maxY = Math.max(...points.map(p => p.y))
  const minY = Math.min(...points.map(p => p.y))
  const range = maxY - minY || 1
  const isUp = points[points.length - 1].y >= points[0].y
  const color = isUp ? "#10b981" : "#ef4444"
  const W = 400, H = 130, PAD = 14

  const coords = points.map((p, i) => ({
    x: PAD + (i / (points.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - (p.y - minY) / range) * (H - PAD * 2 - 10),
  }))
  const lineD = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ")
  const areaD = lineD + ` L${coords[coords.length - 1].x.toFixed(1)} ${H - 4} L${coords[0].x.toFixed(1)} ${H - 4} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }} onMouseLeave={() => setHov(null)}>
        <defs>
          <linearGradient id="eq-fill-v2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(p => {
          const yy = PAD + (1 - p) * (H - PAD * 2 - 10)
          const val = minY + p * range
          return (
            <g key={p}>
              <line x1={PAD} x2={W - PAD} y1={yy} y2={yy} stroke="rgba(255,255,255,0.015)" strokeDasharray="3 8" />
              <text x={W - PAD + 4} y={yy + 3} className="text-[5px] font-mono" fill="rgba(255,255,255,0.06)">${val.toFixed(0)}</text>
            </g>
          )
        })}
        {/* Area + Line */}
        <path d={areaD} fill="url(#eq-fill-v2)" />
        <path d={lineD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${color}25)` }} />
        {/* Points */}
        {coords.map((c, i) => {
          const isHov = hov === i
          const ptColor = points[i].pnl >= 0 ? "#10b981" : i === 0 ? "#06b6d4" : "#ef4444"
          return (
            <g key={i} onMouseEnter={() => setHov(i)} className="cursor-crosshair">
              <circle cx={c.x} cy={c.y} r="12" fill="transparent" />
              <circle cx={c.x} cy={c.y} r={isHov ? 4.5 : 2.5} fill={ptColor} opacity={isHov ? 1 : 0.3}
                style={isHov ? { filter: `drop-shadow(0 0 8px ${ptColor}50)` } : {}} />
              {isHov && (
                <g>
                  <line x1={c.x} y1={PAD} x2={c.x} y2={H - 4} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
                  <rect x={c.x - 42} y={Math.max(2, c.y - 36)} width="84" height="28" rx="8" fill="#0a0c12" stroke={`${ptColor}20`} strokeWidth="1" />
                  <text x={c.x - 36} y={Math.max(2, c.y - 36) + 11} className="text-[6px] font-mono" fill="rgba(255,255,255,0.3)">{points[i].label} {points[i].date}</text>
                  <text x={c.x - 36} y={Math.max(2, c.y - 36) + 22} className="text-[8px] font-mono font-bold" fill={ptColor}>
                    ${points[i].y.toLocaleString()} {i > 0 ? `(${points[i].pnl >= 0 ? "+" : ""}$${points[i].pnl})` : ""}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
      <div className="flex items-center justify-between px-1 mt-1">
        <span className="text-[7px] font-mono text-white/10 tabular-nums">${points[0].y.toLocaleString()}</span>
        <div className="flex items-center gap-2">
          <span className="text-[6px] font-mono text-white/8">{points.length - 1} trades</span>
          <span className={`text-[9px] font-mono font-bold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            ${points[points.length - 1].y.toLocaleString()} ({isUp ? "+" : ""}{((points[points.length - 1].y - points[0].y) / points[0].y * 100).toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CALENDAR HEATMAP - Enhanced
   ═══════════════════════════════════════════════════════════════ */
function CalendarHeatmap() {
  const [hov, setHov] = useState<number | null>(null)
  const [month] = useState("March 2026")
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => {
    const d = i + 1
    const weekend = d % 7 === 0 || d % 7 === 6
    const tc = weekend ? 0 : d % 4 === 0 ? 0 : (d % 3) + 1
    return { day: d, trades: tc, pnl: tc === 0 ? 0 : (d % 2 === 0 ? 1 : -1) * (20 + Math.abs(Math.sin(d * 0.7)) * 180), weekend }
  }), [])
  const maxP = Math.max(...days.filter(d => d.trades > 0).map(d => Math.abs(d.pnl)), 1)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const totalPnl = days.reduce((s, d) => s + d.pnl, 0)
  const tradeDays = days.filter(d => d.trades > 0).length

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md hover:bg-white/[0.03] transition-all">
            <ChevronRight className="w-2.5 h-2.5 text-white/12 rotate-180" />
          </button>
          <span className="text-[9px] font-mono font-bold text-white/35">{month}</span>
          <button className="p-1 rounded-md hover:bg-white/[0.03] transition-all">
            <ChevronRight className="w-2.5 h-2.5 text-white/12" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[6px] font-mono text-white/10 block">Monthly P&L</span>
            <span className={`text-[9px] font-mono font-bold tabular-nums ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {totalPnl >= 0 ? "+" : ""}${Math.abs(totalPnl).toFixed(0)}
            </span>
          </div>
          <div className="w-px h-5 bg-white/[0.04]" />
          <div className="text-right">
            <span className="text-[6px] font-mono text-white/10 block">Active Days</span>
            <span className="text-[9px] font-mono font-bold text-white/35 tabular-nums">{tradeDays}</span>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((d, i) => (
          <div key={i} className={`text-center text-[6px] font-mono font-bold ${i >= 5 ? "text-white/[0.04]" : "text-white/10"}`}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(d => {
          const int = d.trades === 0 ? 0 : Math.min(Math.abs(d.pnl) / maxP, 1) * 0.65 + 0.15
          const green = d.pnl > 0
          const isH = hov === d.day
          return (
            <motion.div key={d.day}
              onMouseEnter={() => setHov(d.day)} onMouseLeave={() => setHov(null)}
              className="relative rounded-lg cursor-pointer"
              style={{
                aspectRatio: "1",
                backgroundColor: d.trades === 0
                  ? d.weekend ? "rgba(255,255,255,0.004)" : "rgba(255,255,255,0.01)"
                  : green ? `rgba(16,185,129,${int * 0.55})` : `rgba(239,68,68,${int * 0.55})`,
                border: isH && d.trades > 0
                  ? `1px solid ${green ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`
                  : "1px solid transparent",
                boxShadow: isH && d.trades > 0
                  ? `0 0 12px ${green ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"}` : "none",
                transition: "all 0.2s",
              }}
              whileHover={{ scale: 1.08 }}>
              {/* Day number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-[7px] font-mono font-bold tabular-nums ${d.trades === 0 ? (d.weekend ? "text-white/[0.03]" : "text-white/[0.06]") : "text-white/35"}`}>{d.day}</span>
                {d.trades > 0 && (
                  <span className={`text-[5px] font-mono font-bold tabular-nums mt-0.5 ${green ? "text-emerald-400/40" : "text-red-400/40"}`}>
                    {d.pnl >= 0 ? "+" : ""}{d.pnl.toFixed(0)}
                  </span>
                )}
              </div>
              {/* Hover tooltip */}
              <AnimatePresence>
                {isH && d.trades > 0 && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute -top-[48px] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div className="bg-[#0a0c14] border border-white/[0.08] rounded-xl px-3 py-1.5 shadow-2xl whitespace-nowrap">
                      <div className="text-[6px] font-mono text-white/20 mb-0.5">Mar {d.day} -- {d.trades} trade{d.trades !== 1 ? "s" : ""}</div>
                      <div className={`text-[10px] font-mono font-bold tabular-nums ${green ? "text-emerald-400" : "text-red-400"}`}>
                        {d.pnl >= 0 ? "+" : ""}${Math.abs(d.pnl).toFixed(0)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2.5 px-0.5">
        <button className="text-[7px] font-mono px-2 py-1 rounded-lg text-white/15 hover:text-white/30 transition-all"
          style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
          This month
        </button>
        <div className="flex items-center gap-1">
          <span className="text-[5px] font-mono text-white/8">Loss</span>
          {[0.15, 0.35, 0.6].map((o, i) => <div key={i} className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: `rgba(239,68,68,${o})` }} />)}
          <div className="w-px h-2.5 bg-white/[0.03] mx-0.5" />
          {[0.15, 0.35, 0.6].map((o, i) => <div key={i} className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: `rgba(16,185,129,${o})` }} />)}
          <span className="text-[5px] font-mono text-white/8">Profit</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SESSION PERFORMANCE - Enhanced
   ═══════════════════════════════════════════════════════════════ */
function SessionPerf() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const sessions = [
    { name: "London", abbr: "LDN", hours: "03:00-12:00", trades: 8, wins: 5, wr: 62, pnl: 312, avgRR: 2.1, bestPair: "EUR/USD", color: "#60a5fa" },
    { name: "New York AM", abbr: "NY-AM", hours: "08:00-12:00", trades: 5, wins: 4, wr: 80, pnl: 487, avgRR: 3.2, bestPair: "NAS100", color: "#10b981" },
    { name: "New York PM", abbr: "NY-PM", hours: "12:00-17:00", trades: 3, wins: 1, wr: 33, pnl: -67, avgRR: 1.4, bestPair: "GBP/USD", color: "#f59e0b" },
    { name: "Asia", abbr: "ASIA", hours: "19:00-03:00", trades: 2, wins: 1, wr: 50, pnl: 45, avgRR: 1.8, bestPair: "EUR/JPY", color: "#818cf8" },
  ]
  const maxTrades = Math.max(...sessions.map(s => s.trades))

  return (
    <div className="space-y-1.5">
      {sessions.map((s, i) => {
        const isExp = expanded === s.name
        return (
          <motion.div key={s.name}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              backgroundColor: isExp ? `${s.color}04` : "rgba(255,255,255,0.006)",
              border: `1px solid ${isExp ? `${s.color}12` : "rgba(255,255,255,0.02)"}`,
            }}>
            <button
              onClick={() => setExpanded(isExp ? null : s.name)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.005] transition-all">
              {/* Session badge */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative"
                style={{ backgroundColor: `${s.color}06`, border: `1px solid ${s.color}10` }}>
                <span className="text-[6px] font-mono font-black" style={{ color: `${s.color}60` }}>{s.abbr}</span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-white/45">{s.name}</span>
                  <span className="text-[6px] font-mono text-white/10">{s.hours}</span>
                </div>
                {/* Win rate bar */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1 h-[3px] rounded-full bg-white/[0.02] overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.wr}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.23, 1, 0.32, 1] }} />
                  </div>
                  <span className="text-[7px] font-mono font-bold tabular-nums shrink-0" style={{ color: `${s.color}50` }}>{s.wr}%</span>
                </div>
              </div>

              {/* Trade count dots */}
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: s.trades }, (_, j) => (
                  <div key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor: j < s.wins ? s.color : "#ef4444", opacity: 0.5 }} />
                ))}
              </div>

              {/* P&L */}
              <div className="text-right shrink-0 w-[50px]">
                <div className={`text-[11px] font-mono font-black tabular-nums ${s.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {s.pnl >= 0 ? "+" : ""}${Math.abs(s.pnl)}
                </div>
              </div>

              <motion.div animate={{ rotate: isExp ? 90 : 0 }} transition={{ duration: 0.15 }}>
                <ChevronRight className="w-2.5 h-2.5 text-white/8" />
              </motion.div>
            </button>

            {/* Expanded detail */}
            <AnimatePresence initial={false}>
              {isExp && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3">
                    <div className="h-px mb-2" style={{ background: `linear-gradient(to right, transparent, ${s.color}08, transparent)` }} />
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { l: "Trades", v: s.trades.toString() },
                        { l: "Win/Loss", v: `${s.wins}/${s.trades - s.wins}` },
                        { l: "Avg R:R", v: `${s.avgRR.toFixed(1)}R` },
                        { l: "Best Pair", v: s.bestPair },
                      ].map(d => (
                        <div key={d.l} className="rounded-lg p-2" style={{ backgroundColor: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.02)" }}>
                          <div className="text-[5px] font-mono text-white/10 uppercase tracking-wider mb-0.5">{d.l}</div>
                          <div className="text-[9px] font-mono font-bold text-white/40 tabular-nums">{d.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   REMAINING WIDGETS (compact, functional)
   ═══════════════════════════════════════════════════════════════ */
function TradeLog({ trades }: { trades: Trade[] }) {
  const [exp, setExp] = useState<string | null>(null)
  return (
    <div className="space-y-1">
      {trades.map((t, i) => {
        const win = t.pnl > 0; const c = win ? "#10b981" : "#ef4444"; const open = exp === t.id
        return (
          <motion.div key={t.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-xl overflow-hidden" style={{ backgroundColor: open ? `${c}03` : "rgba(255,255,255,0.006)", border: `1px solid ${open ? `${c}10` : "rgba(255,255,255,0.025)"}` }}>
            <button onClick={() => setExp(open ? null : t.id)} className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/[0.005] transition-all">
              <div className="w-0.5 h-6 rounded-full shrink-0" style={{ backgroundColor: c }} />
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${c}06` }}>
                {t.side === "long" ? <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400/50" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400/50" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-[9px] font-mono font-bold text-white/50">{t.pair}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[6px] font-mono text-white/12">{t.date}</span>
                  <span className="text-[6px] font-mono px-1 py-0.5 rounded text-white/12" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>{t.setup}</span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold tabular-nums shrink-0" style={{ color: `${c}60` }}>{t.rr > 0 ? "+" : ""}{t.rr.toFixed(1)}R</span>
              <span className={`text-[12px] font-mono font-black tabular-nums shrink-0 ${win ? "text-emerald-400" : "text-red-400"}`}>{win ? "+" : ""}{t.pnl}$</span>
              <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}><ChevronRight className="w-2.5 h-2.5 text-white/8" /></motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3 space-y-2">
                    <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${c}08, transparent)` }} />
                    <div className="grid grid-cols-4 gap-1.5">
                      {[{ l: "Entry", v: t.entry.toString() }, { l: "Exit", v: t.exit.toString() }, { l: "Pips", v: `${t.pips > 0 ? "+" : ""}${t.pips}` }, { l: "Session", v: t.session }].map(d => (
                        <div key={d.l} className="rounded-lg p-1.5" style={{ backgroundColor: "rgba(255,255,255,0.008)", border: "1px solid rgba(255,255,255,0.025)" }}>
                          <div className="text-[5px] font-mono text-white/12 uppercase tracking-wider mb-0.5">{d.l}</div>
                          <div className="text-[8px] font-mono font-bold text-white/40 tabular-nums">{d.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg" style={{
                        backgroundColor: (t.emotion === "FOMO" || t.emotion === "Revenge") ? "rgba(239,68,68,0.04)" : "rgba(16,185,129,0.04)",
                        border: `1px solid ${(t.emotion === "FOMO" || t.emotion === "Revenge") ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"}`,
                      }}>
                        <Brain className="w-2 h-2" style={{ color: (t.emotion === "FOMO" || t.emotion === "Revenge") ? "#ef444460" : "#10b98160" }} />
                        <span className="text-[7px] font-mono font-bold" style={{ color: (t.emotion === "FOMO" || t.emotion === "Revenge") ? "#ef444470" : "#10b98170" }}>{t.emotion}</span>
                      </div>
                      {t.tags.map(tag => (
                        <span key={tag} className="text-[6px] font-mono px-1 py-0.5 rounded text-white/15" style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

function ProgressTracker() {
  const weeks = 14
  const data = useMemo(() => Array.from({ length: weeks * 6 }, (_, i) => {
    const s = Math.sin(i * 0.3) * 0.5 + 0.5
    const r = Math.abs(Math.sin(i * 7.13 + 3) * 10000) % 1
    return r < 0.2 ? 0 : Math.round(s * 4 + r)
  }), [])
  return (
    <div>
      <div className="flex items-center gap-1">
        <div className="flex flex-col gap-[3px] mr-1">
          {["M", "T", "W", "T", "F", "S"].map((d, i) => <span key={`${d}-${i}`} className="text-[5px] font-mono text-white/8 h-[9px] flex items-center">{d}</span>)}
        </div>
        <div className="flex gap-[3px] flex-1">
          {Array.from({ length: weeks }, (_, w) => (
            <div key={w} className="flex flex-col gap-[3px] flex-1">
              {Array.from({ length: 6 }, (_, d) => {
                const val = data[w * 6 + d]
                const op = val === 0 ? 0.02 : (val / 5) * 0.65 + 0.1
                return <motion.div key={d} className="aspect-square rounded-[2px] cursor-pointer"
                  style={{ backgroundColor: val === 0 ? `rgba(255,255,255,${op})` : `rgba(139,92,246,${op})` }}
                  whileHover={{ scale: 1.3 }} />
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] font-mono text-white/20 font-bold">{"Today's Score"}</span>
          <span className="text-[10px] font-mono font-black text-purple-400 tabular-nums">3/5</span>
        </div>
        <button className="text-[7px] font-mono px-2 py-1 rounded-lg text-white/20 hover:text-white/40 transition-all"
          style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          Daily checklist
        </button>
      </div>
    </div>
  )
}

function DrawdownWidget() {
  const dd = [-0.2, -0.5, -1.2, -0.8, -2.1, -3.4, -2.8, -1.5, -0.9, -1.8, -2.5, -1.2]
  const minDD = Math.min(...dd)
  return (
    <div>
      <svg viewBox="0 0 200 60" className="w-full" style={{ height: 60 }}>
        <defs>
          <linearGradient id="dd-fill-v2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="4" x2="196" y1="4" y2="4" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 6" />
        <path d={dd.map((v, i) => {
          const x = 4 + (i / (dd.length - 1)) * 192
          const y = 4 + (Math.abs(v) / Math.abs(minDD)) * 50
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
        }).join(" ") + " L196 4 L4 4 Z"} fill="url(#dd-fill-v2)" />
        <path d={dd.map((v, i) => {
          const x = 4 + (i / (dd.length - 1)) * 192
          const y = 4 + (Math.abs(v) / Math.abs(minDD)) * 50
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
        }).join(" ")} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
      <div className="flex items-center justify-between mt-1 px-0.5">
        <span className="text-[7px] font-mono text-white/10">Max Drawdown</span>
        <span className="text-[10px] font-mono font-bold text-red-400 tabular-nums">{minDD.toFixed(1)}%</span>
      </div>
    </div>
  )
}

function StreakWidget() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <Flame className="w-7 h-7 text-orange-400/50" />
      </motion.div>
      <div className="text-center">
        <div className="text-2xl font-mono font-black text-orange-400 tabular-nums">3</div>
        <div className="text-[7px] font-mono text-white/12 uppercase tracking-wider">Win Streak</div>
      </div>
      <div className="text-[7px] font-mono text-white/8">Best: 7</div>
    </div>
  )
}

function SetupStats() {
  const setups = [
    { name: "Order Block", wr: 75, pnl: 245, color: "#10b981" },
    { name: "FVG", wr: 66, pnl: 180, color: "#06b6d4" },
    { name: "Displacement", wr: 100, pnl: 310, color: "#f59e0b" },
    { name: "Breaker", wr: 33, pnl: -45, color: "#ef4444" },
    { name: "Liq Sweep", wr: 50, pnl: -25, color: "#818cf8" },
  ]
  return (
    <div className="space-y-2">
      {setups.map((s, i) => (
        <div key={s.name} className="flex items-center gap-2">
          <span className="text-[7px] font-mono text-white/25 w-[72px] truncate">{s.name}</span>
          <div className="flex-1 h-[3px] rounded-full bg-white/[0.02] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: s.color }}
              initial={{ width: 0 }} animate={{ width: `${s.wr}%` }} transition={{ duration: 0.5, delay: i * 0.06 }} />
          </div>
          <span className="text-[7px] font-mono text-white/15 w-[20px] text-right tabular-nums">{s.wr}%</span>
          <span className={`text-[8px] font-mono font-bold w-[32px] text-right tabular-nums ${s.pnl >= 0 ? "text-emerald-400/50" : "text-red-400/50"}`}>
            {s.pnl >= 0 ? "+" : ""}{s.pnl}
          </span>
        </div>
      ))}
    </div>
  )
}

function PsychologyWidget() {
  const emotions = [
    { label: "Calm", count: 3, pnl: 332, color: "#10b981" },
    { label: "Confident", count: 1, pnl: 103, color: "#06b6d4" },
    { label: "Focused", count: 1, pnl: 156, color: "#60a5fa" },
    { label: "FOMO", count: 1, pnl: -33, color: "#ef4444" },
    { label: "Revenge", count: 1, pnl: -25, color: "#f97316" },
  ]
  return (
    <div className="space-y-1.5">
      {emotions.map(e => (
        <div key={e.label} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-[7px] font-mono text-white/25 w-[52px]">{e.label}</span>
          <span className="text-[6px] font-mono text-white/10 tabular-nums">{e.count}x</span>
          <div className="flex-1" />
          <span className={`text-[8px] font-mono font-bold tabular-nums ${e.pnl >= 0 ? "text-emerald-400/50" : "text-red-400/50"}`}>
            {e.pnl >= 0 ? "+" : ""}${Math.abs(e.pnl)}
          </span>
        </div>
      ))}
    </div>
  )
}

function WinLossWidget({ s }: { s: ReturnType<typeof useStats> }) {
  const wr = s.winRate / 100
  return (
    <div className="flex items-center gap-4 justify-center py-1">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="5" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 26}`} strokeDashoffset={`${2 * Math.PI * 26 * (1 - wr)}`} transform="rotate(-90 32 32)" opacity="0.7" />
        <text x="32" y="30" textAnchor="middle" className="text-[10px] font-mono font-black" fill="#10b981">{s.wins}W</text>
        <text x="32" y="42" textAnchor="middle" className="text-[8px] font-mono font-bold" fill="#ef4444">{s.losses}L</text>
      </svg>
      <div className="space-y-1.5">
        <div><span className="text-[6px] font-mono text-white/10 uppercase block">Avg Win</span><span className="text-[10px] font-mono font-bold text-emerald-400 tabular-nums">+${s.avgWin.toFixed(0)}</span></div>
        <div><span className="text-[6px] font-mono text-white/10 uppercase block">Avg Loss</span><span className="text-[10px] font-mono font-bold text-red-400 tabular-nums">-${s.avgLoss.toFixed(0)}</span></div>
      </div>
    </div>
  )
}

function DisciplineWidget() {
  const score = 72
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-2">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
        <circle cx="26" cy="26" r="20" fill="none" stroke="#14b8a6" strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - score / 100)}`}
          transform="rotate(-90 26 26)" opacity="0.6" />
      </svg>
      <div className="text-lg font-mono font-black text-teal-400 tabular-nums">{score}%</div>
      <div className="text-[7px] font-mono text-white/12 uppercase tracking-wider">Discipline</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WIDGET REGISTRY
   ═══════════════════════════════════════════════════════════════ */
type WidgetId = "cockpit" | "equity" | "calendar" | "sessions" | "trades" | "progress" | "streak" | "discipline" | "psychology" | "setups" | "drawdown" | "winloss"
interface WDef { id: WidgetId; label: string; desc: string; icon: typeof Activity; accent: string; span: 1 | 2; cat: string }

const WIDGETS: WDef[] = [
  { id: "cockpit", label: "Performance Cockpit", desc: "Balance, P&L, Win Rate, R:R, Profit Factor, Discipline", icon: Gauge, accent: "#10b981", span: 2, cat: "performance" },
  { id: "equity", label: "Equity Curve", desc: "Running balance with interactive hover tooltips", icon: TrendingUp, accent: "#06b6d4", span: 2, cat: "performance" },
  { id: "calendar", label: "Calendar Heatmap", desc: "Monthly P&L heat grid with day detail", icon: Calendar, accent: "#f59e0b", span: 1, cat: "calendar" },
  { id: "sessions", label: "Session Performance", desc: "London, NY, Asia expandable breakdown", icon: Clock, accent: "#818cf8", span: 1, cat: "analytics" },
  { id: "trades", label: "Trade Log", desc: "Expandable entries with full trade detail", icon: Activity, accent: "#10b981", span: 2, cat: "performance" },
  { id: "progress", label: "Progress Tracker", desc: "Weekly consistency heatmap", icon: Target, accent: "#8b5cf6", span: 1, cat: "analytics" },
  { id: "drawdown", label: "Drawdown", desc: "Peak-to-trough drawdown chart", icon: TrendingDown, accent: "#ef4444", span: 1, cat: "performance" },
  { id: "winloss", label: "Win/Loss Ratio", desc: "Visual ring chart with averages", icon: BarChart3, accent: "#f59e0b", span: 1, cat: "analytics" },
  { id: "setups", label: "Setup Stats", desc: "Which setups are most profitable", icon: BarChart3, accent: "#60a5fa", span: 1, cat: "analytics" },
  { id: "psychology", label: "Psychology", desc: "Emotional pattern and P&L correlation", icon: Brain, accent: "#ec4899", span: 1, cat: "psychology" },
  { id: "streak", label: "Streak Meter", desc: "Current win/loss streak tracker", icon: Flame, accent: "#f97316", span: 1, cat: "performance" },
  { id: "discipline", label: "Discipline Score", desc: "Rule adherence ring gauge", icon: Shield, accent: "#14b8a6", span: 1, cat: "psychology" },
]

function RenderWidget({ id, stats }: { id: WidgetId; stats: ReturnType<typeof useStats> }) {
  switch (id) {
    case "cockpit": return <PerformanceCockpit s={stats} />
    case "equity": return <EquityCurve trades={stats.trades} />
    case "calendar": return <CalendarHeatmap />
    case "sessions": return <SessionPerf />
    case "trades": return <TradeLog trades={stats.trades} />
    case "progress": return <ProgressTracker />
    case "drawdown": return <DrawdownWidget />
    case "winloss": return <WinLossWidget s={stats} />
    case "setups": return <SetupStats />
    case "psychology": return <PsychologyWidget />
    case "streak": return <StreakWidget />
    case "discipline": return <DisciplineWidget />
  }
}

const DEFAULT_WIDGETS: WidgetId[] = ["cockpit", "equity", "calendar", "sessions", "trades", "progress", "drawdown", "streak"]

/* ═══════════════════════════════════════════════════════════════
   WIDGET LIBRARY MODAL
   ═══════════════════════════════════════════════════════════════ */
function WidgetLibrary({ open, onClose, active, onAdd, onRemove }: { open: boolean; onClose: () => void; active: WidgetId[]; onAdd: (id: WidgetId) => void; onRemove: (id: WidgetId) => void }) {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("all")
  const cats = ["all", "performance", "calendar", "analytics", "psychology"]
  const filtered = WIDGETS.filter(w => (cat === "all" || w.cat === cat) && (!search || w.label.toLowerCase().includes(search.toLowerCase())))

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-0 top-[10%] mx-auto w-[500px] max-h-[65vh] z-[71] rounded-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: "rgba(10,11,15,0.97)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <div className="px-5 pt-5 pb-3 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-white/20" />
              <span className="text-[10px] font-mono font-bold text-white/45 uppercase tracking-[0.12em] flex-1">Widget Library</span>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-all"><X className="w-3.5 h-3.5 text-white/15" /></button>
            </div>
            <div className="px-5 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/12" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search widgets..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-[10px] font-mono text-white/60 placeholder:text-white/15 outline-none bg-white/[0.02] border border-white/[0.04]" />
              </div>
            </div>
            <div className="px-5 pb-2 flex gap-1">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-2 py-1 rounded-lg text-[8px] font-mono font-bold uppercase tracking-[0.1em] transition-all ${cat === c ? "bg-white/[0.05] text-white/45 border border-white/[0.06]" : "text-white/15 hover:text-white/25 border border-transparent"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2.5 space-y-1">
              {filtered.map(w => {
                const isOn = active.includes(w.id)
                const Icon = w.icon
                return (
                  <div key={w.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/[0.01]"
                    style={{ border: `1px solid ${isOn ? `${w.accent}10` : "rgba(255,255,255,0.02)"}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${w.accent}06`, border: `1px solid ${w.accent}10` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: `${w.accent}50` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono font-bold text-white/50 block">{w.label}</span>
                      <span className="text-[7px] font-mono text-white/18 block mt-0.5">{w.desc}</span>
                    </div>
                    <button
                      onClick={() => isOn ? onRemove(w.id) : onAdd(w.id)}
                      className={`px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold uppercase transition-all shrink-0 ${isOn
                        ? "bg-red-500/6 text-red-400/50 border border-red-500/10 hover:bg-red-500/10"
                        : "hover:text-white/70"
                      }`}
                      style={isOn ? {} : { backgroundColor: `${w.accent}08`, border: `1px solid ${w.accent}15`, color: `${w.accent}80` }}>
                      {isOn ? "Remove" : "Insert"}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            <div className="px-5 py-2.5 flex items-center justify-between">
              <span className="text-[7px] font-mono text-white/10">{active.length}/{WIDGETS.length} active</span>
              <button onClick={onClose} className="px-3 py-1 rounded-lg text-[8px] font-mono font-bold text-white/25 hover:text-white/45 bg-white/[0.02] border border-white/[0.04] transition-all">Done</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */
export function TradeJournalDashboard() {
  const [account, setAccount] = useState("all")
  const stats = useStats(account)
  const [active, setActive] = useState<WidgetId[]>(DEFAULT_WIDGETS)
  const [editing, setEditing] = useState(false)
  const [showLib, setShowLib] = useState(false)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  const remove = useCallback((id: WidgetId) => setActive(p => p.filter(w => w !== id)), [])
  const add = useCallback((id: WidgetId) => setActive(p => p.includes(id) ? p : [...p, id]), [])
  const defs = active.map(id => WIDGETS.find(w => w.id === id)).filter(Boolean) as WDef[]

  // Drag reorder
  const handleDragStart = (i: number) => { if (editing) setDraggedIdx(i) }
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === i) return
    setActive(prev => {
      const next = [...prev]
      const [moved] = next.splice(draggedIdx, 1)
      next.splice(i, 0, moved)
      return next
    })
    setDraggedIdx(i)
  }
  const handleDragEnd = () => setDraggedIdx(null)

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[9px] font-mono font-bold text-white/25 uppercase tracking-[0.12em]">Dashboard</span>
        <div className="flex-1" />
        <AccountSelector value={account} onChange={setAccount} />
        <div className="w-px h-4 bg-white/[0.04]" />
        <button onClick={() => setShowLib(true)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-mono font-bold uppercase tracking-[0.1em] text-white/20 hover:text-white/40 hover:bg-white/[0.02] border border-white/[0.04] transition-all">
          <Plus className="w-2.5 h-2.5" /> Add
        </button>
        <button onClick={() => setEditing(!editing)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-mono font-bold uppercase tracking-[0.1em] transition-all ${editing ? "bg-amber-500/8 text-amber-400/60 border border-amber-500/15" : "text-white/20 hover:text-white/40 hover:bg-white/[0.02] border border-white/[0.04]"}`}>
          <Settings className="w-2.5 h-2.5" /> {editing ? "Done" : "Customize"}
        </button>
      </div>

      {/* Edit mode banner */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: "rgba(245,158,11,0.03)", border: "1px solid rgba(245,158,11,0.08)" }}>
              <GripVertical className="w-3 h-3 text-amber-400/30" />
              <span className="text-[8px] font-mono text-amber-400/40">Drag widgets to reorder. Click X to remove.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {defs.map((w, idx) => (
            <motion.div key={w.id} layout
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -6 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              draggable={editing}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`${w.span === 2 ? "col-span-2" : "col-span-1"} relative rounded-2xl overflow-hidden group/w transition-all duration-300 ${editing ? "cursor-grab active:cursor-grabbing" : ""} ${draggedIdx === idx ? "opacity-50" : ""}`}
              style={{ backgroundColor: "rgba(255,255,255,0.006)", border: `1px solid ${editing ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.025)"}` }}>
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-2.5">
                {editing && <GripVertical className="w-3 h-3 text-white/8 shrink-0" />}
                <div className="w-0.5 h-3 rounded-full shrink-0" style={{ backgroundColor: w.accent }} />
                <w.icon className="w-3 h-3 shrink-0" style={{ color: `${w.accent}45` }} />
                <span className="text-[8px] font-mono font-bold uppercase tracking-[0.12em] flex-1 truncate" style={{ color: `${w.accent}40` }}>{w.label}</span>
                {editing && (
                  <button onClick={() => remove(w.id)} className="p-1 rounded-md hover:bg-red-500/10 transition-all">
                    <X className="w-2.5 h-2.5 text-white/15 hover:text-red-400/60" />
                  </button>
                )}
              </div>
              <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${w.accent}06, transparent)` }} />
              <div className="px-4 py-3">
                <RenderWidget id={w.id} stats={stats} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {editing && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowLib(true)}
            className="col-span-1 rounded-2xl flex flex-col items-center justify-center gap-2 py-10 hover:bg-white/[0.008] transition-all"
            style={{ border: "2px dashed rgba(255,255,255,0.04)" }}>
            <Plus className="w-5 h-5 text-white/8" />
            <span className="text-[8px] font-mono text-white/8 uppercase tracking-wider">Add widget</span>
          </motion.button>
        )}
      </div>

      <WidgetLibrary open={showLib} onClose={() => setShowLib(false)} active={active} onAdd={add} onRemove={remove} />
    </div>
  )
}
