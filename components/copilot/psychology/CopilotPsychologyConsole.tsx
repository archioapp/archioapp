"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Activity,
} from "lucide-react"
import dynamic from "next/dynamic"

const PsychologyAnalytics = dynamic(
  () => import("@/components/copilot/analytics/PsychologyAnalytics").then(m => ({ default: m.PsychologyAnalytics })),
  { ssr: false }
)
import { PsychologyGuideAndTutorial } from "@/components/copilot/psychology/PsychologyGuideAndTutorial"

/* ═══════════════════════════════════════════════════════════════
   COPILOT PSYCHOLOGY CONSOLE

   Same pattern as CopilotStrategyConsole:
   1. Presents a trader-profile carousel with different psychological
      states (FOCUSED / CAUTIOUS / REACTIVE / TILTED / SPIRALING)
   2. Generates profile-specific PsychologyData for each profile.
   3. Renders the REAL PsychologyAnalytics component (Neural Cortex 2.0)
      with that data.

   Zero custom sub-components. The real thing, always.
   ═══════════════════════════════════════════════════════════════ */

/* ── Psychological Profiles ── */

interface PsychProfile {
  id: string
  label: string
  grade: string
  color: string
  description: string
  moodPositivePct: number
  activeDays: number
  medianDecisionMins: number
  moodChecks: number
  topEmotions: { label: string; value: number }[]
  topPitfalls: { label: string; value: number }[]
}

const PROFILES: PsychProfile[] = [
  {
    id: "focused",
    label: "FOCUSED STATE",
    grade: "A+",
    color: "#10b981",
    description: "Peak mental clarity. Emotions are acknowledged but don't drive decisions. Patient, deliberate, operating from process not impulse. This is the target state.",
    moodPositivePct: 88,
    activeDays: 7,
    medianDecisionMins: 8,
    moodChecks: 14,
    topEmotions: [
      { label: "Calm Confidence", value: 42 },
      { label: "Patient Focus", value: 28 },
      { label: "Detached Clarity", value: 18 },
      { label: "Mild Anticipation", value: 8 },
    ],
    topPitfalls: [
      { label: "Overconfidence", value: 4 },
      { label: "Complacency", value: 3 },
      { label: "Boredom Entry", value: 2 },
      { label: "Size Creep", value: 1 },
    ],
  },
  {
    id: "cautious",
    label: "CAUTIOUS STATE",
    grade: "B+",
    color: "#06b6d4",
    description: "Aware of emotional interference. Self-monitoring is active but second-guessing creates hesitation. Good awareness, but overthinking delays execution.",
    moodPositivePct: 65,
    activeDays: 6,
    medianDecisionMins: 14,
    moodChecks: 11,
    topEmotions: [
      { label: "Uncertainty", value: 32 },
      { label: "Cautious Hope", value: 24 },
      { label: "Mild Anxiety", value: 22 },
      { label: "Self-Doubt", value: 14 },
    ],
    topPitfalls: [
      { label: "Hesitation", value: 18 },
      { label: "Missed Entries", value: 14 },
      { label: "Overthinking", value: 12 },
      { label: "Late Execution", value: 8 },
    ],
  },
  {
    id: "reactive",
    label: "REACTIVE STATE",
    grade: "C",
    color: "#f59e0b",
    description: "Emotions are driving decisions more than process. Impulsive entries, premature exits, and difficulty sitting still. The system is known but not followed under pressure.",
    moodPositivePct: 42,
    activeDays: 5,
    medianDecisionMins: 3,
    moodChecks: 7,
    topEmotions: [
      { label: "Frustration", value: 28 },
      { label: "Impatience", value: 24 },
      { label: "FOMO", value: 22 },
      { label: "Excitement", value: 16 },
    ],
    topPitfalls: [
      { label: "Impulsive Entry", value: 28 },
      { label: "Early Exit", value: 22 },
      { label: "FOMO Chase", value: 18 },
      { label: "Overtrading", value: 14 },
    ],
  },
  {
    id: "tilted",
    label: "TILTED STATE",
    grade: "D",
    color: "#f97316",
    description: "Emotional hijack in progress. Losses are personal, revenge trading is active, position sizing is escalating. The rational mind has been overridden by the limbic system.",
    moodPositivePct: 18,
    activeDays: 4,
    medianDecisionMins: 1,
    moodChecks: 3,
    topEmotions: [
      { label: "Anger", value: 32 },
      { label: "Revenge Drive", value: 28 },
      { label: "Desperation", value: 22 },
      { label: "Denial", value: 12 },
    ],
    topPitfalls: [
      { label: "Revenge Trading", value: 38 },
      { label: "Size Escalation", value: 28 },
      { label: "Rule Abandonment", value: 22 },
      { label: "Loss Chasing", value: 18 },
    ],
  },
  {
    id: "spiraling",
    label: "SPIRALING STATE",
    grade: "F",
    color: "#ef4444",
    description: "Complete emotional breakdown. No rules, no process, no awareness. Trading has become purely reactive. Every action makes the situation worse. Immediate intervention required.",
    moodPositivePct: 5,
    activeDays: 7,
    medianDecisionMins: 0,
    moodChecks: 0,
    topEmotions: [
      { label: "Panic", value: 35 },
      { label: "Helplessness", value: 28 },
      { label: "Rage", value: 22 },
      { label: "Numbness", value: 15 },
    ],
    topPitfalls: [
      { label: "All-In Gambles", value: 40 },
      { label: "No Stop Loss", value: 32 },
      { label: "24/7 Trading", value: 28 },
      { label: "Account Destruction", value: 22 },
    ],
  },
]

/* ── Deterministic data generator ── */

function generatePsychologyData(profile: PsychProfile) {
  const positiveCount = Math.round(profile.moodChecks * (profile.moodPositivePct / 100))
  const negativeCount = Math.max(0, profile.moodChecks - positiveCount)

  // Generate 24h pace data (activity intensity per hour)
  const pace24h: number[] = []
  const seed = profile.id.charCodeAt(0) + profile.id.charCodeAt(1)
  for (let h = 0; h < 24; h++) {
    let base: number
    if (profile.id === "focused") {
      // Clean activity: peaks at killzones only
      base = (h >= 7 && h <= 10) ? 0.7 + ((seed + h) % 3) * 0.1 : (h >= 13 && h <= 16) ? 0.8 + ((seed + h) % 2) * 0.1 : 0.05
    } else if (profile.id === "cautious") {
      base = (h >= 7 && h <= 10) ? 0.5 + ((seed + h) % 3) * 0.1 : (h >= 13 && h <= 16) ? 0.6 + ((seed + h) % 3) * 0.08 : 0.1
    } else if (profile.id === "reactive") {
      base = (h >= 5 && h <= 20) ? 0.3 + ((seed + h) % 5) * 0.12 : 0.15
    } else if (profile.id === "tilted") {
      // Erratic: high everywhere, spikes after losses
      base = 0.4 + ((seed + h) % 4) * 0.15
    } else {
      // Spiraling: constant high activity, no pattern
      base = 0.6 + ((seed * h) % 3) * 0.13
    }
    pace24h.push(Math.min(1, Math.max(0, base)))
  }

  return {
    counts: {
      moodChecks7d: profile.moodChecks,
      activeDays7d: profile.activeDays,
      medianDecisionMins: profile.medianDecisionMins,
    },
    moodMix7d: [
      { label: "Positive" as const, value: positiveCount },
      { label: "Negative" as const, value: negativeCount },
    ],
    topEmotions: profile.topEmotions,
    topPitfalls: profile.topPitfalls,
    pace24h,
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CONSOLE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function CopilotPsychologyConsole() {
  const [profileIdx, setProfileIdx] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const autoPlayRef = useRef(autoPlay)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { autoPlayRef.current = autoPlay }, [autoPlay])

  const profile = PROFILES[profileIdx]

  const psychologyData = useMemo(() => generatePsychologyData(profile), [profile])

  const goToProfile = useCallback((idx: number) => {
    setProfileIdx(((idx % PROFILES.length) + PROFILES.length) % PROFILES.length)
  }, [])

  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setProfileIdx(prev => (prev + 1) % PROFILES.length)
      }, 5000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoPlay])

  return (
    <div className="relative flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">

      {/* ── Psychology Tutorial & Guide ── */}
      <PsychologyGuideAndTutorial
        onStartDemo={() => {
          setAutoPlay(true)
        }}
      />

      {/* ── Profile Navigation Bar ── */}
      <div className="sticky top-0 z-20 px-3 pt-3 pb-2"
        style={{ background: "linear-gradient(180deg, rgba(12,14,22,0.98) 0%, rgba(12,14,22,0.92) 80%, transparent 100%)" }}>

        <div className="flex items-center gap-1">
          <button
            onClick={() => { setAutoPlay(false); goToProfile(profileIdx - 1) }}
            className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-1.5">
            {PROFILES.map((p, i) => {
              const isActive = i === profileIdx
              return (
                <button
                  key={p.id}
                  onClick={() => { setAutoPlay(false); goToProfile(i) }}
                  className="group flex flex-col items-center gap-1 shrink-0 py-1 px-1"
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 20 : 6,
                      height: 6,
                      backgroundColor: isActive ? p.color : `${p.color}25`,
                      boxShadow: isActive ? `0 0 10px ${p.color}40` : "none",
                    }}
                  />
                  <span
                    className="text-[6px] font-mono font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                    style={{
                      color: isActive ? p.color : "rgba(255,255,255,0.12)",
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    {isActive ? p.label : ""}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => { setAutoPlay(false); goToProfile(profileIdx + 1) }}
            className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors shrink-0"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`ml-1 flex items-center gap-1 px-2 py-1 rounded-md border text-[7px] font-mono font-black uppercase tracking-wider transition-all shrink-0 ${
              autoPlay
                ? "border-amber-400/25 bg-amber-400/[0.06] text-amber-400/70"
                : "border-white/[0.04] bg-white/[0.01] text-white/20 hover:border-white/[0.08] hover:text-white/35"
            }`}
          >
            {autoPlay ? (
              <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }} />
            ) : (
              <Activity className="w-2.5 h-2.5" />
            )}
            {autoPlay ? "LIVE" : "DEMO"}
          </button>
        </div>

        {/* Profile identity bar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: profile.color }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div className="absolute inset-0 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: profile.color }}
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            <motion.span className="text-[11px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${profile.color}10`,
                color: `${profile.color}90`,
                border: `1px solid ${profile.color}20`,
              }}
              animate={{ borderColor: [`${profile.color}20`, `${profile.color}45`, `${profile.color}20`] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {profile.grade}
            </motion.span>

            <span className="text-[12px] font-mono font-black uppercase tracking-wider"
              style={{ color: profile.color }}>
              {profile.label}
            </span>
          </div>

          <span className="text-[8px] font-mono text-white/15 tabular-nums">
            {profileIdx + 1} / {PROFILES.length}
          </span>
        </div>

        <p className="text-[9px] font-mono text-white/25 leading-relaxed mt-1.5 max-w-[500px]">
          {profile.description}
        </p>
      </div>

      {/* ── The REAL PsychologyAnalytics Component ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <PsychologyAnalytics data={psychologyData} />
        </motion.div>
      </AnimatePresence>

      </div>
    </div>
  )
}
