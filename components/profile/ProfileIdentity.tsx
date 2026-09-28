"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Clock,
  Target,
  BookOpen,
  ChevronDown,
  Zap,
  Globe,
  Quote,
} from "lucide-react"
import type { TradingIdentity } from "@/types/profile"

interface ProfileIdentityProps {
  identity: TradingIdentity
}

const styleLabels = {
  scalp: "Scalper",
  day: "Day Trader",
  swing: "Swing Trader",
  position: "Position Trader",
  hybrid: "Hybrid",
}

const styleColors = {
  scalp: "bg-red-500/20 text-red-400 border-red-500/30",
  day: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  swing: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  position: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hybrid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

export function ProfileIdentity({ identity }: ProfileIdentityProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl bg-[#111318] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white">Trading Identity</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${styleColors[identity.style]}`}>
          {styleLabels[identity.style]}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Methodology */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Methodology</span>
          </div>
          <p className="text-sm text-white font-medium">{identity.methodology}</p>
        </div>

        {/* Markets & Instruments */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Markets</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {identity.primaryMarkets.map((m) => (
                <span key={m} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Instruments</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {identity.primaryInstruments.slice(0, 3).map((i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300 font-mono">
                  {i}
                </span>
              ))}
              {identity.primaryInstruments.length > 3 && (
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-500">
                  +{identity.primaryInstruments.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sessions & Experience */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Sessions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {identity.preferredSessions.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] text-sky-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Experience</span>
            </div>
            <p className="text-sm text-white font-medium">{identity.experienceYears} years</p>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {expanded ? "Show Less" : "Show Philosophy"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {/* Expanded Philosophy */}
        <AnimatePresence>
          {expanded && identity.tradingPhilosophy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-violet-300 italic leading-relaxed">{identity.tradingPhilosophy}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
