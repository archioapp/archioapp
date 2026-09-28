"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, TrendingUp, BarChart3, Layers } from "lucide-react"
import { type Mode, type Legs, MODE_CONFIG } from "@/lib/types/trading-modes"
import {
  SURFACE, ACCENT, MODE_ACCENT, RADIUS, MOTION,
} from "./mtf-theme"

/* ═══════════════════════════════════════════════════════════════
   COMMAND DECK v5 -- Compact control + tutorial guide buttons
   ─────────────────────────────────────────────────────────────
   Row 1: Mode tabs | Legs toggle | Mode descriptor
   Row 2: 3 TF guide buttons (replace old TF labels)
          Each is clickable to reveal educational breakdown
   ═══════════════════════════════════════════════════════════════ */

/* ── Per-mode, per-TF educational content ── */
const TF_GUIDE: Record<string, { role: string; why: string; strategy: string; updates: string; candles: string }[]> = {
  scalp: [
    {
      role: "Entry Trigger",
      why: "The 5-minute chart captures micro-structure momentum -- every impulse candle, every wick rejection, every shift in short-term order flow. This is where you pull the trigger.",
      strategy: "Wait for a clean break or rejection on the 5M that agrees with both higher TFs. Enter on the close of the impulse candle. Stop below the last micro-pivot.",
      updates: "Each candle prints every 5 minutes. Fast feedback loop -- you know within 2-3 candles if the trade is working.",
      candles: "30 candles (Leg 1) = 2.5 hours of micro-structure. 60 candles (Leg 2) = 5 hours for deeper context.",
    },
    {
      role: "Confirmation",
      why: "The 15-minute chart smooths out 5M noise and reveals whether the micro-move has real momentum behind it. If the 15M agrees, the 5M signal carries weight.",
      strategy: "Check that the 15M displacement and frequency both lean in the same direction as your 5M entry. If the 15M is flat or opposing, reduce size or skip.",
      updates: "Each candle prints every 15 minutes. Slower rhythm gives you time to assess without rushing decisions.",
      candles: "24 candles (Leg 1) = 6 hours. 48 candles (Leg 2) = 12 hours of momentum context.",
    },
    {
      role: "Structural Bias",
      why: "The 1-hour chart is the compass for scalpers. It tells you which way the intraday wind blows. Trading against the 1H bias means fighting the session's dominant flow.",
      strategy: "Only take 5M entries that fire in the direction of the 1H bias. The 1H doesn't need to be perfect -- just needs to lean your way.",
      updates: "Each candle prints every hour. Provides session-level structure that doesn't change on every tick.",
      candles: "12 candles (Leg 1) = 12 hours. 24 candles (Leg 2) = full 24-hour cycle.",
    },
  ],
  day: [
    {
      role: "Entry Trigger",
      why: "The 15-minute chart balances speed and reliability for intraday entries. It filters out the noise of 5M while still catching early moves within a session.",
      strategy: "Enter when the 15M prints an impulse candle that breaks structure in the direction of both 1H flow and 4H compass. Set stops below the last 15M structural pivot.",
      updates: "Each candle prints every 15 minutes. Fast enough for timely entries, slow enough to avoid whipsaws.",
      candles: "16 candles (Leg 1) = 4 hours. 32 candles (Leg 2) = 8 hours of intraday structure.",
    },
    {
      role: "Flow Direction",
      why: "The 1-hour chart reveals the session's directional flow. It shows whether buyers or sellers are controlling the current trading window. This is your flow compass.",
      strategy: "Check that 1H frequency and displacement both agree before committing to a 15M entry. When the 1H is conflicted, size down or wait.",
      updates: "Each candle prints every hour. Captures full session rhythms -- London open to NY close.",
      candles: "12 candles (Leg 1) = 12 hours. 24 candles (Leg 2) = full day of directional flow.",
    },
    {
      role: "Daily Compass",
      why: "The 4-hour chart is the day trader's strategic compass. It reveals the multi-session directional bias that should never be fought without strong reason.",
      strategy: "Use the 4H conviction score to determine whether today is a trending day or a range day. Only take 15M entries that align with 4H structural direction.",
      updates: "Each candle prints every 4 hours. 6 candles per day give you the big-picture read without noise.",
      candles: "6 candles (Leg 1) = 24 hours. 12 candles (Leg 2) = 2 full trading days.",
    },
  ],
  swing: [
    {
      role: "Entry Trigger",
      why: "The 4-hour chart gives swing traders precise entry timing without the noise of lower timeframes. It captures structural breaks and retests at the session level.",
      strategy: "Wait for a 4H impulse candle that fires in the direction of both daily trend and weekly context. Enter on the close, stop below the last 4H structural pivot.",
      updates: "Each candle prints every 4 hours. Patience is rewarded -- you only need 1-2 clean setups per week.",
      candles: "18 candles (Leg 1) = 3 days. 32 candles (Leg 2) = ~5.3 days of trigger-level structure.",
    },
    {
      role: "Trend Direction",
      why: "The daily chart reveals the prevailing trend that should define your directional bias. Daily candles carry the weight of full sessions and are the most-watched timeframe by institutions.",
      strategy: "The daily chart sets the direction. If daily conviction is above 60%, the trend is real. Below 40%, the market is ranging -- swing entries carry higher risk.",
      updates: "One candle per day. The cleanest, most respected timeframe in technical analysis.",
      candles: "10 candles (Leg 1) = 2 weeks. 20 candles (Leg 2) = 1 month of daily trend data.",
    },
    {
      role: "Macro Context",
      why: "The weekly chart provides the highest-level structural context. It shows multi-month trends, major support/resistance zones, and whether the market is in expansion or contraction.",
      strategy: "Never fight the weekly. If the weekly is bearish, only take swing shorts. If bullish, only longs. The weekly doesn't change often -- when it does, it matters.",
      updates: "One candle per week. The ultimate structural filter for swing trade conviction.",
      candles: "6 candles (Leg 1) = 6 weeks. 10 candles (Leg 2) = 2.5 months of macro structure.",
    },
  ],
}

const TF_FULL: Record<string, string> = {
  "5M": "5 Minute", "15M": "15 Minute", "1H": "1 Hour",
  "4H": "4 Hour", "1D": "Daily", "1W": "Weekly",
}

const MODE_ICONS = { scalp: Clock, day: TrendingUp, swing: BarChart3 }
const MODE_LABELS = { scalp: "Scalp", day: "Day Trade", swing: "Swing" }
const MODE_DESCS: Record<string, string> = {
  scalp: "Micro-structure momentum",
  day: "Intraday directional flow",
  swing: "Multi-day structural positions",
}

/* ── Extracted component for AnimatePresence compatibility ── */
function GuidePanel({ guide, card, accent }: {
  guide: { role: string; why: string; strategy: string; updates: string; candles: string }
  card: { displayName: string }
  accent: { rgb: string }
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-2.5">
        <motion.div className="w-[5px] h-[5px] rounded-full"
          style={{ background: `rgba(${accent.rgb},0.5)` }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[8px] font-mono uppercase tracking-[0.12em] font-bold"
          style={{ color: `rgba(${accent.rgb},0.4)` }}>
          {guide.role}
        </span>
        <span className="text-[10px] font-mono" style={{ color: "rgba(148,163,184,0.15)" }}>|</span>
        <span className="text-[11px] font-semibold"
          style={{ color: `rgba(${accent.rgb},0.65)` }}>
          {TF_FULL[card.displayName] || card.displayName}
        </span>
      </div>
      <p className="text-[9.5px] leading-[1.8] mb-3"
        style={{ color: "rgba(203,213,225,0.4)" }}>
        {guide.why}
      </p>
      <div className="flex gap-4">
        {[
          { label: "Strategy", value: guide.strategy },
          { label: "Update Cycle", value: guide.updates },
          { label: "Sample Depth", value: guide.candles },
        ].map((item) => (
          <div key={item.label} className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-[3px] h-[3px] rounded-full"
                style={{ background: `rgba(${accent.rgb},0.18)` }} />
              <span className="text-[7px] font-mono uppercase tracking-[0.1em] font-bold"
                style={{ color: `rgba(${accent.rgb},0.22)` }}>
                {item.label}
              </span>
            </div>
            <p className="text-[8.5px] leading-[1.7] pl-[9px]"
              style={{ color: "rgba(148,163,184,0.28)" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CommandDeck({
  mode, legs, onModeChange, onLegsChange,
}: {
  mode: Mode; legs: Legs; onModeChange: (m: Mode) => void; onLegsChange: (l: Legs) => void
}) {
  const [openGuide, setOpenGuide] = useState<number | null>(null)

  const cfg = MODE_CONFIG[mode]
  const accent = MODE_ACCENT[mode] || ACCENT.purple
  const guides = TF_GUIDE[mode]

  return (
    <div className="mb-3">
      <div className="overflow-hidden"
        style={{
          background: SURFACE.card,
          borderRadius: RADIUS.card,
          border: `1px solid rgba(${accent.rgb},0.04)`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.015)`,
        }}
      >
        {/* ═══ ROW 1: Mode tabs + Legs + Mode descriptor ═══ */}
        <div className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: `1px solid rgba(${accent.rgb},0.04)` }}>
          {/* Mode tabs */}
          <div className="flex items-center gap-0.5 p-0.5"
            style={{ background: SURFACE.recess, borderRadius: RADIUS.pill }}>
            {(["scalp", "day", "swing"] as Mode[]).map((m) => {
              const Icon = MODE_ICONS[m]
              const isActive = m === mode
              const mAccent = MODE_ACCENT[m] || ACCENT.purple
              return (
                <button key={m}
                  onClick={() => { onModeChange(m); setOpenGuide(null) }}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300"
                  style={{ borderRadius: RADIUS.badge }}
                >
                  {isActive && (
                    <motion.div layoutId="mtf-mode-bg" className="absolute inset-0"
                      style={{
                        borderRadius: RADIUS.badge,
                        background: `rgba(${mAccent.rgb},0.08)`,
                        boxShadow: `inset 0 1px 0 rgba(${mAccent.rgb},0.06)`,
                      }}
                      transition={MOTION.spring}
                    />
                  )}
                  <Icon className="w-3 h-3 relative z-10"
                    style={{ color: isActive ? `rgba(${mAccent.rgb},0.8)` : "rgba(148,163,184,0.18)" }} />
                  <span className="text-[11px] font-semibold relative z-10"
                    style={{ color: isActive ? `rgba(${mAccent.rgb},0.85)` : "rgba(148,163,184,0.22)" }}>
                    {MODE_LABELS[m]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-4 shrink-0" style={{ background: `rgba(${accent.rgb},0.06)` }} />

          {/* Legs */}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3" style={{ color: `rgba(${accent.rgb},0.2)` }} />
            <span className="text-[8px] font-mono uppercase tracking-wider font-bold"
              style={{ color: "rgba(148,163,184,0.22)" }}>Legs</span>
            <div className="flex gap-0.5 p-0.5"
              style={{ background: SURFACE.recess, borderRadius: RADIUS.badge }}>
              {([1, 2] as Legs[]).map((l) => (
                <button key={l} onClick={() => onLegsChange(l)}
                  className="relative px-2.5 py-1 text-[11px] font-mono font-bold transition-all duration-300"
                  style={{ borderRadius: "5px", color: l === legs ? "rgba(226,232,240,0.8)" : "rgba(148,163,184,0.18)" }}
                >
                  {l === legs && (
                    <motion.div layoutId="mtf-leg-bg" className="absolute inset-0"
                      style={{ borderRadius: "5px", background: `rgba(${accent.rgb},0.06)`, boxShadow: `inset 0 1px 0 rgba(${accent.rgb},0.04)` }}
                      transition={MOTION.spring}
                    />
                  )}
                  <span className="relative z-10">{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mode descriptor */}
          <span className="text-[9px] font-mono tracking-wider hidden md:block"
            style={{ color: "rgba(148,163,184,0.18)" }}>
            {MODE_DESCS[mode]}
          </span>
        </div>

        {/* ═══ ROW 2: TF Guide Buttons ═══ */}
        <div className="flex items-stretch"
          style={{ borderBottom: openGuide !== null ? `1px solid rgba(${accent.rgb},0.04)` : undefined }}>
          {cfg.cards.map((card, ci) => {
            const guide = guides[ci]
            const isOpen = openGuide === ci
            return (
              <button key={`${mode}-${card.tf}`}
                onClick={() => setOpenGuide(isOpen ? null : ci)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-2 transition-all duration-200"
                style={{
                  background: isOpen ? `rgba(${accent.rgb},0.04)` : "transparent",
                  borderRight: ci < cfg.cards.length - 1 ? `1px solid rgba(${accent.rgb},0.04)` : "none",
                }}
              >
                <span className="text-[7px] font-mono uppercase tracking-[0.1em] font-bold"
                  style={{ color: `rgba(${accent.rgb},${isOpen ? 0.45 : 0.18})` }}>
                  {guide.role}
                </span>
                <span className="text-[11px] font-semibold"
                  style={{ color: `rgba(${accent.rgb},${isOpen ? 0.8 : 0.5})` }}>
                  {TF_FULL[card.displayName] || card.displayName}
                </span>
                <span className="text-[9px] font-mono font-bold"
                  style={{ color: `rgba(148,163,184,${isOpen ? 0.35 : 0.2})` }}>
                  {card.counts[legs]}c
                </span>
              </button>
            )
          })}
        </div>

        {/* ═══ ROW 3: Expanded guide panel ═══ */}
        {openGuide !== null && guides[openGuide] && cfg.cards[openGuide] && (
          <div key={`guide-${mode}-${openGuide}`}>
            <GuidePanel
              guide={guides[openGuide]}
              card={cfg.cards[openGuide]}
              accent={accent}
            />
          </div>
        )}
      </div>
    </div>
  )
}
