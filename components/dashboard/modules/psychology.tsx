"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW } from "@/components/mtf/mtf-theme"
import type { PsychologyState, MoodLevel } from "../dashboard-types"
import { Brain, AlertTriangle, Sparkles, Shield } from "lucide-react"

const MOOD_MAP: Record<MoodLevel, { label: string; color: string; position: number }> = {
  sharp: { label: "Sharp", color: ACCENT.emerald.rgb, position: 100 },
  focused: { label: "Focused", color: ACCENT.blue.rgb, position: 75 },
  neutral: { label: "Neutral", color: ACCENT.slate.rgb, position: 50 },
  distracted: { label: "Distracted", color: ACCENT.amber.rgb, position: 25 },
  tilted: { label: "Tilted", color: ACCENT.rose.rgb, position: 0 },
}

const DISCIPLINE_COLOR: Record<string, string> = {
  excellent: ACCENT.emerald.rgb,
  good: ACCENT.blue.rgb,
  fair: ACCENT.amber.rgb,
  poor: ACCENT.rose.rgb,
  danger: ACCENT.rose.rgb,
}

interface Props {
  state: PsychologyState
  onCheckIn: (mood: MoodLevel) => void
}

export function PsychologyModule({ state, onCheckIn }: Props) {
  const [showPatterns, setShowPatterns] = useState(false)
  const discColor = DISCIPLINE_COLOR[state.disciplineLevel] || ACCENT.slate.rgb

  return (
    <div
      className="h-full"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${discColor},0.08)`,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Brain className="w-4 h-4" style={{ color: `rgba(${ACCENT.purple.rgb},0.6)` }} />
            <span className={TYPE.label} style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>Psychology State</span>
          </div>
          {state.dangerFlags.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: `rgba(${ACCENT.rose.rgb},0.1)` }}>
              <AlertTriangle className="w-3 h-3" style={{ color: ACCENT.rose.hex }} />
              <span className="text-[9px] font-mono font-bold" style={{ color: ACCENT.rose.hex }}>
                {state.dangerFlags.length} FLAG{state.dangerFlags.length > 1 ? "S" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Discipline score */}
        <div className="mb-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-white font-mono text-2xl font-bold">{state.disciplineScore}</div>
              <div className={TYPE.caption}>Discipline score</div>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold"
              style={{
                background: `rgba(${discColor},0.1)`,
                color: `rgba(${discColor},0.8)`,
              }}
            >
              {state.disciplineLevel}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${state.disciplineScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                background: `linear-gradient(90deg, rgba(${discColor},0.6), rgba(${discColor},0.9))`,
              }}
            />
          </div>
        </div>

        {/* Risk meters */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-lg" style={{ background: SURFACE.recess }}>
            <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>Consec. Losses</div>
            <div className="text-white font-mono text-sm font-bold">{state.consecutiveLosses}</div>
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: SURFACE.recess }}>
            <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>Revenge Risk</div>
            <span
              className="text-xs font-mono font-bold"
              style={{
                color: state.revengeTradingRisk === "high" ? ACCENT.rose.hex :
                  state.revengeTradingRisk === "medium" ? ACCENT.amber.hex : ACCENT.emerald.hex,
              }}
            >
              {state.revengeTradingRisk.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Mood history (7 day strip) */}
        <div className="mb-3">
          <div className={`${TYPE.label} mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>7-Day Mood</div>
          <div className="flex items-center gap-1.5">
            {state.moodHistory.slice(0, 7).map((day, i) => {
              const mood = MOOD_MAP[day.mood]
              return (
                <div
                  key={i}
                  className="flex-1 h-6 rounded-md relative group cursor-default"
                  style={{
                    background: `rgba(${mood.color},0.12)`,
                    border: `1px solid rgba(${mood.color},0.15)`,
                  }}
                  title={`${day.date}: ${mood.label}${day.note ? ` - ${day.note}` : ""}`}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-b-md"
                    style={{
                      height: `${mood.position}%`,
                      background: `rgba(${mood.color},0.25)`,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* AI patterns */}
        <button
          onClick={() => setShowPatterns(!showPatterns)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150"
          style={{
            background: `rgba(${ACCENT.purple.rgb},0.04)`,
            border: `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
          }}
        >
          <Sparkles className="w-3 h-3" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
          <span className="text-[10px] flex-1" style={{ color: `rgba(${ACCENT.purple.rgb},0.6)` }}>
            {state.patterns.length} behavioral patterns detected
          </span>
        </button>
        {showPatterns && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 space-y-1.5"
          >
            {state.patterns.map((pattern, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: SURFACE.recess }}>
                <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.4)` }} />
                <p className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.5)` }}>{pattern}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
