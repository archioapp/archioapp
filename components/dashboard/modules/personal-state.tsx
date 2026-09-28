"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW, MOTION } from "@/components/mtf/mtf-theme"
import type { PsychologyState, MoodLevel } from "../dashboard-types"
import {
  Compass, Heart, Target, Flame, Star,
  ChevronDown, Shield, Brain, Sparkles, Eye, BookOpen,
} from "lucide-react"

/* ── Types ── */
interface PersonalGoal {
  id: string
  title: string
  progress: number
  type: "trading" | "personal" | "discipline"
  milestoneLabel?: string
}

interface PersonalMission {
  statement: string
  whyTrading: string
  longTermVision: string
}

interface Props {
  psychology: PsychologyState
  goals: PersonalGoal[]
  mission: PersonalMission
}

const MOOD_MAP: Record<MoodLevel, { label: string; color: string }> = {
  sharp: { label: "Sharp", color: ACCENT.emerald.rgb },
  focused: { label: "Focused", color: ACCENT.blue.rgb },
  neutral: { label: "Neutral", color: ACCENT.slate.rgb },
  distracted: { label: "Distracted", color: ACCENT.amber.rgb },
  tilted: { label: "Tilted", color: ACCENT.rose.rgb },
}

const GOAL_TYPE_COLOR: Record<string, string> = {
  trading: ACCENT.blue.rgb,
  personal: ACCENT.emerald.rgb,
  discipline: ACCENT.amber.rgb,
}

export function PersonalStateLayer({ psychology, goals, mission }: Props) {
  const [showMission, setShowMission] = useState(false)
  const [showPatterns, setShowPatterns] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ── Left: Psychology & Mood ── */}
      <div
        className="lg:col-span-1"
        style={{
          background: SURFACE.card,
          borderRadius: RADIUS.card,
          border: `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Brain className="w-4 h-4" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>
              Mental State
            </span>
          </div>

          {/* Discipline score */}
          <div className="mb-5">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-white font-mono text-3xl font-bold tracking-tighter">{psychology.disciplineScore}</div>
                <div className={TYPE.caption}>Discipline</div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold"
                style={{
                  background: `rgba(${psychology.disciplineLevel === "excellent" || psychology.disciplineLevel === "good" ? ACCENT.emerald.rgb : psychology.disciplineLevel === "fair" ? ACCENT.amber.rgb : ACCENT.rose.rgb},0.1)`,
                  color: `rgba(${psychology.disciplineLevel === "excellent" || psychology.disciplineLevel === "good" ? ACCENT.emerald.rgb : psychology.disciplineLevel === "fair" ? ACCENT.amber.rgb : ACCENT.rose.rgb},0.8)`,
                }}
              >
                {psychology.disciplineLevel}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${psychology.disciplineScore}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{
                  background: `linear-gradient(90deg, rgba(${ACCENT.purple.rgb},0.6), rgba(${ACCENT.blue.rgb},0.8))`,
                }}
              />
            </div>
          </div>

          {/* Risk indicators */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-3 rounded-xl" style={{ background: SURFACE.recess }}>
              <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>Losses</div>
              <div className="text-white font-mono text-sm font-bold">{psychology.consecutiveLosses}</div>
              <div className={TYPE.caption}>consecutive</div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: SURFACE.recess }}>
              <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>Revenge Risk</div>
              <span
                className="text-sm font-mono font-bold"
                style={{
                  color: psychology.revengeTradingRisk === "high" ? ACCENT.rose.hex :
                    psychology.revengeTradingRisk === "medium" ? ACCENT.amber.hex : ACCENT.emerald.hex,
                }}
              >
                {psychology.revengeTradingRisk.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 7-day mood strip */}
          <div className="mb-4">
            <div className={`${TYPE.label} mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>7-Day Mood</div>
            <div className="flex items-center gap-1.5">
              {psychology.moodHistory.slice(0, 7).map((day, i) => {
                const mood = MOOD_MAP[day.mood]
                return (
                  <div
                    key={i}
                    className="flex-1 h-7 rounded-lg relative group cursor-default"
                    style={{
                      background: `rgba(${mood.color},0.08)`,
                      border: `1px solid rgba(${mood.color},0.1)`,
                    }}
                    title={`${day.date}: ${mood.label}${day.note ? ` -- ${day.note}` : ""}`}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all"
                      style={{
                        height: `${MOOD_MAP[day.mood].label === "Sharp" ? 100 : MOOD_MAP[day.mood].label === "Focused" ? 75 : MOOD_MAP[day.mood].label === "Neutral" ? 50 : MOOD_MAP[day.mood].label === "Distracted" ? 25 : 10}%`,
                        background: `rgba(${mood.color},0.2)`,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI behavioral patterns */}
          <button
            onClick={() => setShowPatterns(!showPatterns)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
            style={{
              background: `rgba(${ACCENT.purple.rgb},0.03)`,
              border: `1px solid rgba(${ACCENT.purple.rgb},0.05)`,
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: `rgba(${ACCENT.purple.rgb},0.4)` }} />
            <span className="text-[10px] flex-1" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }}>
              {psychology.patterns.length} patterns detected
            </span>
            <ChevronDown
              className="w-3 h-3 transition-transform"
              style={{ color: `rgba(${ACCENT.purple.rgb},0.3)`, transform: showPatterns ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          <AnimatePresence>
            {showPatterns && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2 space-y-1.5"
              >
                {psychology.patterns.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: SURFACE.recess }}>
                    <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.3)` }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.45)` }}>{p}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Center: Mission & Identity ── */}
      <div
        className="lg:col-span-1"
        style={{
          background: SURFACE.card,
          borderRadius: RADIUS.card,
          border: `1px solid rgba(${ACCENT.emerald.rgb},0.06)`,
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Compass className="w-4 h-4" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>
              Purpose & Direction
            </span>
          </div>

          {/* Mission statement */}
          <div
            className="p-5 rounded-2xl mb-5"
            style={{
              background: `rgba(${ACCENT.emerald.rgb},0.02)`,
              border: `1px solid rgba(${ACCENT.emerald.rgb},0.05)`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-3.5 h-3.5" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }}>
                My Mission
              </span>
            </div>
            <p className="text-[13px] leading-[1.7] text-white/60 mb-3">
              {mission.statement}
            </p>
            <button
              onClick={() => setShowMission(!showMission)}
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: `rgba(${ACCENT.emerald.rgb},0.4)` }}
            >
              {showMission ? "Less" : "Why I trade"}
            </button>
            <AnimatePresence>
              {showMission && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 space-y-3" style={{ borderTop: `1px solid rgba(${ACCENT.emerald.rgb},0.06)` }}>
                    <div>
                      <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>Why</div>
                      <p className="text-[11px] leading-relaxed" style={{ color: `rgba(255,255,255,0.45)` }}>{mission.whyTrading}</p>
                    </div>
                    <div>
                      <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>Vision</div>
                      <p className="text-[11px] leading-relaxed" style={{ color: `rgba(255,255,255,0.45)` }}>{mission.longTermVision}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Calm reminder */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: `rgba(${ACCENT.slate.rgb},0.03)`,
              border: `1px solid rgba(${ACCENT.slate.rgb},0.04)`,
            }}
          >
            <p className="text-[11px] leading-[1.7] italic" style={{ color: `rgba(255,255,255,0.3)` }}>
              {"The market rewards patience and discipline. Your edge is not in the next trade -- it's in the system you follow every single day."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Goals & Milestones ── */}
      <div
        className="lg:col-span-1"
        style={{
          background: SURFACE.card,
          borderRadius: RADIUS.card,
          border: `1px solid rgba(${ACCENT.amber.rgb},0.06)`,
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Target className="w-4 h-4" style={{ color: `rgba(${ACCENT.amber.rgb},0.5)` }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>
              Goals & Milestones
            </span>
          </div>

          <div className="space-y-3">
            {goals.map((goal, i) => {
              const goalColor = GOAL_TYPE_COLOR[goal.type] || ACCENT.slate.rgb
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: SURFACE.recess,
                    border: `1px solid rgba(${goalColor},0.04)`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white text-xs font-semibold">{goal.title}</span>
                      {goal.milestoneLabel && (
                        <div className="text-[10px] font-mono mt-0.5" style={{ color: `rgba(${goalColor},0.6)` }}>
                          {goal.milestoneLabel}
                        </div>
                      )}
                    </div>
                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold"
                      style={{
                        background: `rgba(${goalColor},0.1)`,
                        color: `rgba(${goalColor},0.7)`,
                      }}
                    >
                      {goal.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                        style={{ background: `linear-gradient(90deg, rgba(${goalColor},0.5), rgba(${goalColor},0.9))` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${goalColor},0.7)` }}>
                      {goal.progress}%
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Positive reinforcement */}
          {goals.some(g => g.progress >= 50) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 rounded-xl flex items-start gap-2.5"
              style={{
                background: `rgba(${ACCENT.emerald.rgb},0.03)`,
                border: `1px solid rgba(${ACCENT.emerald.rgb},0.05)`,
              }}
            >
              <Flame className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }} />
              <p className="text-[10px] leading-relaxed" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }}>
                You are making real progress. Stay the course.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
