"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight, ArrowDownRight, Minus, Plus, ChevronDown,
  Shield, Target, AlertTriangle, Crosshair, Copy,
  Zap, X, Check, DollarSign, Lock, Wallet, Activity,
  TrendingUp, Globe, RefreshCw, BarChart3
} from "lucide-react"

/* ══════════════════════════════════════════════════════════════════════════
   EXECUTION TERMINAL — "TRADE FORGE"
   
   This is where analysis becomes action. Every pixel communicates risk.
   The design language matches the Strategy Mirror and Neural Cortex.
   Breathing, layered, alive.
   ══════════════════════════════════════════════════════════════════════════ */

/* ────────────────────── types ────────────────────── */
type OrderType = "market" | "limit" | "stop" | "stop-limit"
type Side = "buy" | "sell"

interface BrokerAccount {
  id: string
  broker: string
  abbr: string
  accountId: string
  type: "live" | "demo" | "prop"
  balance: number
  equity: number
  leverage: string
  connected: boolean
  selected: boolean
  copyTrade: boolean
  color: string
  pnlToday: number
}

/* ────────────────────── constants ────────────────────── */
const BROKER_ACCOUNTS: BrokerAccount[] = [
  { id: "1", broker: "IC Markets",   abbr: "ICM",  accountId: "****4821", type: "live", balance: 25000,  equity: 25340,  leverage: "1:500", connected: true,  selected: true,  copyTrade: false, color: "#3b82f6", pnlToday: 340 },
  { id: "2", broker: "FTMO",         abbr: "FTMO", accountId: "****7392", type: "prop", balance: 100000, equity: 102400, leverage: "1:100", connected: true,  selected: false, copyTrade: false, color: "#a855f7", pnlToday: 1240 },
  { id: "3", broker: "Pepperstone",  abbr: "PP",   accountId: "****1105", type: "live", balance: 10000,  equity: 10120,  leverage: "1:200", connected: true,  selected: false, copyTrade: false, color: "#06b6d4", pnlToday: -80 },
  { id: "4", broker: "OANDA",        abbr: "OA",   accountId: "****6643", type: "demo", balance: 50000,  equity: 50000,  leverage: "1:50",  connected: false, selected: false, copyTrade: false, color: "#f59e0b", pnlToday: 0 },
  { id: "5", broker: "MetaTrader 5", abbr: "MT5",  accountId: "****9901", type: "live", balance: 15000,  equity: 15280,  leverage: "1:300", connected: true,  selected: false, copyTrade: false, color: "#10b981", pnlToday: 210 },
]

const QUICK_LOTS = [0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0]
const QUICK_RR = [1, 1.5, 2, 3, 5]

/* ────────────────────── ambient SVG ────────────────────── */
function ForgeAmbient({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 120" preserveAspectRatio="none">
      <defs>
        <radialGradient id="forge-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx="200" cy="60" rx="180" ry="50"
        fill="url(#forge-glow)"
        animate={{ rx: [180, 200, 180], ry: [50, 60, 50] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </svg>
  )
}

/* ────────────────────── broker logo ────────────────────── */
function BrokerBadge({ abbr, color, size = "md", selected = false }: { abbr: string; color: string; size?: "sm" | "md"; selected?: boolean }) {
  const dim = size === "sm" ? "w-7 h-7 text-[8px]" : "w-9 h-9 text-[9px]"
  return (
    <div className={`${dim} rounded-lg border flex items-center justify-center font-mono font-black shrink-0 transition-all duration-200 relative`}
      style={{
        borderColor: selected ? `${color}80` : `${color}30`,
        backgroundColor: selected ? `${color}15` : `${color}08`,
        color: selected ? color : `${color}90`,
        boxShadow: selected ? `0 0 12px ${color}20` : "none",
      }}
    >
      {abbr}
      {selected && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  )
}

/* ────────────────────── stepper ────────────────────── */
function Stepper({ value, onChange, step, min, max, label, suffix, precision = 2, color = "#10b981" }: {
  value: number; onChange: (v: number) => void; step: number; min: number; max: number
  label: string; suffix?: string; precision?: number; color?: string
}) {
  return (
    <div>
      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/35 block mb-1.5">{label}</span>
      <div className="flex items-center gap-1">
        <motion.button whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(precision)))}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/50 hover:text-white/80 transition-all"
        >
          <Minus className="w-3.5 h-3.5" />
        </motion.button>
        <div className="flex-1 h-9 rounded-lg border flex items-center justify-center bg-white/[0.02] relative overflow-hidden"
          style={{ borderColor: `${color}30` }}
        >
          <span className="text-[15px] font-mono font-black relative z-10" style={{ color }}>{value.toFixed(precision)}</span>
          {suffix && <span className="text-[9px] text-white/25 ml-1 relative z-10">{suffix}</span>}
          <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(180deg, ${color}08 0%, transparent 100%)` }} />
        </div>
        <motion.button whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, +(value + step).toFixed(precision)))}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/50 hover:text-white/80 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export function TradeExecutionPanel({ instrument = "EUR/USD", currentPrice = 1.08534, onClose }: {
  instrument?: string; currentPrice?: number; onClose?: () => void
}) {
  const [side, setSide] = useState<Side>("buy")
  const [orderType, setOrderType] = useState<OrderType>("market")
  const [lotSize, setLotSize] = useState(0.1)
  const [slPips, setSlPips] = useState(15)
  const [tpPips, setTpPips] = useState(30)
  const [entryPrice, setEntryPrice] = useState(currentPrice)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [partialTp, setPartialTp] = useState(false)
  const [trailingSl, setTrailingSl] = useState(false)
  const [breakEvenSl, setBreakEvenSl] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [accounts, setAccounts] = useState(BROKER_ACCOUNTS)
  const [copyTradeEnabled, setCopyTradeEnabled] = useState(false)

  const isBuy = side === "buy"
  const accentColor = isBuy ? "#10b981" : "#ef4444"
  const accentName = isBuy ? "emerald" : "red"

  const primaryAccount = accounts.find(a => a.selected) || accounts[0]
  const copyAccounts = accounts.filter(a => a.copyTrade && a.id !== primaryAccount.id)
  const totalAccounts = 1 + copyAccounts.length
  const totalEquity = accounts.filter(a => a.connected).reduce((s, a) => s + a.equity, 0)

  const risk = useMemo(() => {
    const pipValue = lotSize * 10
    const riskUsd = slPips * pipValue
    const rewardUsd = tpPips * pipValue
    const rr = slPips > 0 ? tpPips / slPips : 0
    const riskPercent = (riskUsd / primaryAccount.balance) * 100
    return { riskPercent, riskUsd, rewardUsd, rr, pipsSl: slPips, pipsTp: tpPips }
  }, [lotSize, slPips, tpPips, primaryAccount.balance])

  const riskColor = risk.riskPercent <= 1 ? "#10b981" : risk.riskPercent <= 2 ? "#f59e0b" : risk.riskPercent <= 5 ? "#f97316" : "#ef4444"

  const handleRRPreset = useCallback((rr: number) => { setTpPips(Math.round(slPips * rr)) }, [slPips])
  const handleExecute = useCallback(() => { setIsExecuting(true); setTimeout(() => setIsExecuting(false), 2000) }, [])
  const toggleAccountSelect = (id: string) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, selected: true } : { ...a, selected: false }))
  const toggleCopyTrade = (id: string) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, copyTrade: !a.copyTrade } : a))

  return (
    <div className="flex flex-col h-full bg-[#070910]/98 relative">

      {/* ═══════════ HEADER — Nerve Center style ═══════════ */}
      <div className="relative px-5 pt-4 pb-3 border-b border-white/[0.04]">
        <ForgeAmbient color={accentColor} />
        <div className="relative z-10">
          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="w-8 h-8"
                >
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <circle cx="16" cy="16" r="14" fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
                    <circle cx="16" cy="16" r="10" fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
                  </svg>
                </motion.div>
                <Crosshair className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: accentColor }} />
              </div>
              <div>
                <h2 className="text-[14px] font-mono font-black tracking-wide text-white/90">TRADE FORGE</h2>
                <p className="text-[9px] font-mono text-white/25 tracking-[0.1em]">ORDER EXECUTION TERMINAL</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-emerald-400">LIVE</span>
              </div>
              {onClose && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all">
                  <X className="w-4 h-4 text-white/40" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Instrument + Price */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] font-mono font-black text-white tracking-tight">{instrument}</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">FX MAJOR</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] font-mono text-white/25">SPREAD <span className="text-white/50 font-bold">1.2</span></span>
                <span className="text-[9px] font-mono text-white/25">SWAP L <span className="text-red-400/60">-3.42</span></span>
                <span className="text-[9px] font-mono text-white/25">SWAP S <span className="text-emerald-400/60">+1.18</span></span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-[9px] font-mono text-white/25 text-right mb-0.5">BID</div>
                  <span className="text-[18px] font-mono font-black text-red-400">{(currentPrice - 0.00006).toFixed(5)}</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div>
                  <div className="text-[9px] font-mono text-white/25 text-right mb-0.5">ASK</div>
                  <span className="text-[18px] font-mono font-black text-emerald-400">{(currentPrice + 0.00006).toFixed(5)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 justify-end mt-1">
                <Activity className="w-3 h-3 text-emerald-400/40" />
                <span className="text-[9px] font-mono text-emerald-400/50 font-bold">+0.12%</span>
              </div>
            </div>
          </div>

          {/* ═══ Broker Accounts — clickable cards ═══ */}
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/30 font-bold">Trading Accounts</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-[9px] font-mono font-bold" style={{ color: accentColor }}>
                ${totalEquity.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {accounts.filter(a => a.connected).map(account => (
                <motion.button
                  key={account.id}
                  onClick={() => toggleAccountSelect(account.id)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-shrink-0 rounded-xl border p-2.5 transition-all duration-200 text-left min-w-[130px] relative overflow-hidden ${
                    account.selected
                      ? "ring-1"
                      : "bg-white/[0.015] border-white/[0.05] hover:border-white/[0.1]"
                  }`}
                  style={{
                    borderColor: account.selected ? `${account.color}40` : undefined,
                    backgroundColor: account.selected ? `${account.color}08` : undefined,
                    ringColor: account.selected ? `${account.color}25` : undefined,
                    boxShadow: account.selected ? `0 0 20px ${account.color}10` : undefined,
                  }}
                >
                  {account.selected && (
                    <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${account.color}10 0%, transparent 70%)` }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BrokerBadge abbr={account.abbr} color={account.color} size="sm" selected={account.selected} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-mono font-bold text-white/70 truncate">{account.broker}</div>
                        <div className="text-[8px] font-mono text-white/25">{account.accountId}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-mono font-black text-white/80">${account.equity.toLocaleString()}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        account.type === "live" ? "bg-emerald-500/10 text-emerald-400" :
                        account.type === "prop" ? "bg-purple-500/10 text-purple-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {account.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t" style={{ borderColor: `${account.color}10` }}>
                      <span className="text-[8px] font-mono text-white/20">{account.leverage}</span>
                      <span className={`text-[9px] font-mono font-bold ${account.pnlToday >= 0 ? "text-emerald-400/70" : "text-red-400/70"}`}>
                        {account.pnlToday >= 0 ? "+" : ""}{account.pnlToday.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Copy trade indicator */}
                  {copyTradeEnabled && !account.selected && (
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); toggleCopyTrade(account.id) }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute top-1.5 right-1.5 z-20 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        account.copyTrade
                          ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                          : "bg-white/[0.04] border-white/[0.08] text-white/20 hover:text-white/40"
                      }`}
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </motion.button>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ SCROLLABLE BODY ═══════════ */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 space-y-4">

        {/* ── BUY / SELL ── */}
        <div className="grid grid-cols-2 gap-2">
          {(["buy", "sell"] as Side[]).map(s => {
            const active = side === s
            const isBuyBtn = s === "buy"
            const btnColor = isBuyBtn ? "#10b981" : "#ef4444"
            return (
              <motion.button key={s} onClick={() => setSide(s)} whileTap={{ scale: 0.96 }}
                className="relative rounded-xl py-3.5 font-mono font-black text-[15px] uppercase tracking-[0.05em] transition-all border overflow-hidden"
                style={{
                  borderColor: active ? `${btnColor}50` : "rgba(255,255,255,0.04)",
                  backgroundColor: active ? `${btnColor}12` : "rgba(255,255,255,0.015)",
                  color: active ? btnColor : "rgba(255,255,255,0.25)",
                  boxShadow: active ? `0 0 24px ${btnColor}15, inset 0 1px 0 ${btnColor}10` : "none",
                }}
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isBuyBtn ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {s}
                </div>
                {active && (
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(180deg, ${btnColor}08 0%, transparent 100%)` }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* ── Order Type ── */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/30 block mb-2">Order Type</span>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            {(["market", "limit", "stop", "stop-limit"] as OrderType[]).map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-[0.08em] transition-all ${
                  orderType === t
                    ? "text-white/80 bg-white/[0.06] border border-white/[0.1] shadow-sm"
                    : "text-white/20 hover:text-white/40"
                }`}
              >
                {t === "stop-limit" ? "S/LIMIT" : t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Entry Price (conditional) ── */}
        <AnimatePresence>
          {orderType !== "market" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <Stepper value={entryPrice} onChange={setEntryPrice} step={0.0001} min={0} max={99999} label={`${orderType} Price`} precision={5} color={accentColor} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Volume ── */}
        <div>
          <Stepper value={lotSize} onChange={setLotSize} step={0.01} min={0.01} max={100} label="Volume (Lots)" color={accentColor} />
          <div className="grid grid-cols-8 gap-1 mt-2">
            {QUICK_LOTS.map(l => (
              <motion.button key={l} onClick={() => setLotSize(l)} whileTap={{ scale: 0.9 }}
                className={`py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all border ${
                  lotSize === l
                    ? "text-white/80 bg-white/[0.06] border-white/[0.12]"
                    : "text-white/15 bg-white/[0.01] border-white/[0.03] hover:text-white/35 hover:border-white/[0.08]"
                }`}
              >
                {l}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── SL / TP ── */}
        <div className="grid grid-cols-2 gap-3">
          <Stepper value={slPips} onChange={setSlPips} step={1} min={1} max={500} label="Stop Loss (pips)" precision={0} color="#ef4444" />
          <Stepper value={tpPips} onChange={setTpPips} step={1} min={1} max={2000} label="Take Profit (pips)" precision={0} color="#06b6d4" />
        </div>

        {/* ── R:R Presets ── */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/30 block mb-2">Risk : Reward</span>
          <div className="grid grid-cols-5 gap-1">
            {QUICK_RR.map(rr => (
              <motion.button key={rr} onClick={() => handleRRPreset(rr)} whileTap={{ scale: 0.9 }}
                className={`py-2 rounded-lg text-[11px] font-mono font-black transition-all border ${
                  Math.abs(risk.rr - rr) < 0.1
                    ? "text-cyan-400 bg-cyan-400/10 border-cyan-500/25 shadow-sm shadow-cyan-500/10"
                    : "text-white/15 bg-white/[0.01] border-white/[0.03] hover:text-white/35"
                }`}
              >
                1:{rr}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ═══ Risk Summary Card ═══ */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 relative overflow-hidden">
          <ForgeAmbient color={riskColor} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-3.5 h-3.5" style={{ color: riskColor }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/35 font-bold">Risk Analysis</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { label: "RISK", value: `$${risk.riskUsd.toFixed(0)}`, sub: `${risk.riskPercent.toFixed(1)}%`, color: riskColor },
                { label: "REWARD", value: `$${risk.rewardUsd.toFixed(0)}`, sub: `${(risk.rewardUsd / primaryAccount.balance * 100).toFixed(1)}%`, color: "#10b981" },
                { label: "R:R", value: `1:${risk.rr.toFixed(1)}`, sub: risk.rr >= 2 ? "Optimal" : risk.rr >= 1 ? "Fair" : "Poor", color: risk.rr >= 2 ? "#10b981" : risk.rr >= 1 ? "#f59e0b" : "#ef4444" },
                { label: "NET P&L", value: `$${(risk.rewardUsd - risk.riskUsd).toFixed(0)}`, sub: "Expected", color: risk.rewardUsd > risk.riskUsd ? "#10b981" : "#ef4444" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-[9px] font-mono text-white/25 uppercase tracking-[0.1em] mb-0.5">{s.label}</div>
                  <div className="text-[16px] font-mono font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[9px] font-mono text-white/25 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Risk bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-white/25">Account Exposure</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: riskColor }}>{risk.riskPercent.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: riskColor }}
                  initial={{ width: 0 }} animate={{ width: `${Math.min(risk.riskPercent * 10, 100)}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              </div>
            </div>

            {risk.riskPercent > 2 && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 mt-3 px-3 py-2 rounded-lg bg-red-500/[0.06] border border-red-500/15"
              >
                <AlertTriangle className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
                <span className="text-[10px] font-mono text-red-400/60 leading-relaxed">Risk exceeds 2% of equity. Institutional standard is 0.5-1%. Consider reducing position size.</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* ═══ Advanced Execution Options ═══ */}
        <div className="rounded-xl border border-white/[0.04] overflow-hidden">
          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-all"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/30 font-bold">Advanced Execution</span>
            <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-4 pb-3 space-y-2">
                  {[
                    { label: "Partial TP (50% at TP1)", icon: Target, active: partialTp, toggle: () => setPartialTp(!partialTp), color: "#06b6d4" },
                    { label: "Trailing Stop Loss", icon: Shield, active: trailingSl, toggle: () => setTrailingSl(!trailingSl), color: "#f59e0b" },
                    { label: "Break-Even at +10 pips", icon: Lock, active: breakEvenSl, toggle: () => setBreakEvenSl(!breakEvenSl), color: "#10b981" },
                  ].map(opt => (
                    <motion.button key={opt.label} onClick={opt.toggle} whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                        opt.active ? "bg-white/[0.02]" : "border-white/[0.04] text-white/25 hover:text-white/40"
                      }`}
                      style={{
                        borderColor: opt.active ? `${opt.color}30` : undefined,
                        color: opt.active ? opt.color : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <opt.icon className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold">{opt.label}</span>
                      </div>
                      <div className={`w-9 h-5 rounded-full transition-all border`}
                        style={{
                          backgroundColor: opt.active ? `${opt.color}20` : "rgba(255,255,255,0.03)",
                          borderColor: opt.active ? `${opt.color}30` : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <motion.div className="w-4 h-4 rounded-full mt-[1px]"
                          style={{ backgroundColor: opt.active ? opt.color : "rgba(255,255,255,0.15)" }}
                          animate={{ x: opt.active ? 17 : 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ Copy Trade ═══ */}
        <motion.button onClick={() => setCopyTradeEnabled(!copyTradeEnabled)} whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
            copyTradeEnabled ? "bg-purple-500/[0.04] border-purple-500/20 text-purple-400" : "border-white/[0.04] text-white/25 hover:text-white/40"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Copy className="w-4 h-4" />
            <div className="text-left">
              <span className="text-[11px] font-mono font-bold block">Copy Trade to Other Accounts</span>
              {copyTradeEnabled && copyAccounts.length > 0 && (
                <span className="text-[9px] font-mono text-purple-300/50">{copyAccounts.length} account{copyAccounts.length > 1 ? "s" : ""} will mirror</span>
              )}
            </div>
          </div>
          <div className={`w-9 h-5 rounded-full transition-all border ${copyTradeEnabled ? "bg-purple-500/20 border-purple-500/30" : "bg-white/[0.03] border-white/[0.06]"}`}>
            <motion.div className={`w-4 h-4 rounded-full mt-[1px] ${copyTradeEnabled ? "bg-purple-400" : "bg-white/15"}`}
              animate={{ x: copyTradeEnabled ? 17 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </motion.button>
      </div>

      {/* ═══════════ EXECUTE BUTTON — fixed at bottom ═══════════ */}
      <div className="px-5 pb-4 pt-2 border-t border-white/[0.04] bg-[#070910]/95">
        <motion.button onClick={handleExecute} disabled={isExecuting}
          whileHover={!isExecuting ? { scale: 1.01, y: -1 } : undefined}
          whileTap={!isExecuting ? { scale: 0.98 } : undefined}
          className={`w-full py-4 rounded-xl font-mono font-black text-[15px] uppercase tracking-[0.06em] transition-all relative overflow-hidden border ${isExecuting ? "opacity-60 cursor-not-allowed" : ""}`}
          style={{
            borderColor: `${accentColor}40`,
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            boxShadow: `0 0 30px ${accentColor}15, inset 0 1px 0 ${accentColor}10`,
          }}
        >
          {isExecuting ? (
            <div className="flex items-center justify-center gap-2.5">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
              <span>Executing{totalAccounts > 1 ? ` across ${totalAccounts} accounts` : ""}...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2.5">
              <Zap className="w-5 h-5" />
              <span>{isBuy ? "Buy" : "Sell"} {instrument}</span>
              {totalAccounts > 1 && <span className="text-white/20 text-[11px]">x{totalAccounts}</span>}
            </div>
          )}
          {!isExecuting && (
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}08, transparent)` }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.button>
      </div>
    </div>
  )
}
