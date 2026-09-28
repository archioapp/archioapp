"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW, MOTION } from "@/components/mtf/mtf-theme"
import type { AICheckIn, MoodLevel, PsychologyState, DailyPlan, PerformanceSnapshot, SessionMode } from "../dashboard-types"
import {
  Sparkles, ArrowRight, Clock, Shield, Brain, Target,
  ChevronRight, Eye, Zap, BookOpen, Play, Lock,
} from "lucide-react"

/* ── Entry Mode ── */
type EntryMode = "quick" | "guided" | "protected"

/* ── Mode Config ── */
const MODE_CONFIG: Record<SessionMode, { label: string; tagline: string; color: string }> = {
  pre_market: { label: "Pre-Market", tagline: "Prepare with clarity", color: ACCENT.blue.rgb },
  in_session: { label: "In Session", tagline: "Stay disciplined", color: ACCENT.emerald.rgb },
  post_session: { label: "Post Session", tagline: "Reflect and recover", color: ACCENT.amber.rgb },
  reset: { label: "Reset Mode", tagline: "Step back. Breathe.", color: ACCENT.amber.rgb },
}

const MOOD_OPTIONS: { level: MoodLevel; label: string; emoji: string; color: string }[] = [
  { level: "sharp", label: "Sharp", emoji: "", color: ACCENT.emerald.rgb },
  { level: "focused", label: "Focused", emoji: "", color: ACCENT.blue.rgb },
  { level: "neutral", label: "Neutral", emoji: "", color: ACCENT.slate.rgb },
  { level: "distracted", label: "Distracted", emoji: "", color: ACCENT.amber.rgb },
  { level: "tilted", label: "Tilted", emoji: "", color: ACCENT.rose.rgb },
]

/* ── Node field background ── */
function NodeField({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; o: number }[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    nodesRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.35 + 0.08,
    }))

    const draw = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const nodes = nodesRef.current

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${color},${(1 - dist / 130) * 0.06})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${n.o})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize) }
  }, [color])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />
}

/* ── Adaptive Greeting ── */
function buildAdaptive(
  checkin: AICheckIn, psych: PsychologyState, perf: PerformanceSnapshot, mode: SessionMode,
): { greeting: string; questions: string[]; insight: string; suggestion: string } {
  const hour = new Date().getHours()
  const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const streak = checkin.stateSummary.currentStreak
  const losing = streak.type === "loss" && streak.count >= 2
  const winning = streak.type === "win" && streak.count >= 3
  const revenge = psych.revengeTradingRisk === "high"
  const lowDisc = psych.disciplineScore < 60
  const noCheckin = !psych.lastCheckIn

  let greeting = time
  if (winning) greeting += ". Momentum is with you"
  else if (losing && revenge) greeting += ". Take a breath before we begin"
  else if (losing) greeting += ". Losses are data, not identity"
  else if (noCheckin) greeting += ". Ready to check in?"

  const questions: string[] = []
  if (noCheckin || !psych.currentMood) questions.push("How are you feeling right now?")
  if (mode === "pre_market") questions.push("Are you here to plan, execute, or just observe?")
  if (losing) questions.push("Do you want to review what happened, or take a step back first?")
  if (mode === "post_session") questions.push("Ready to reflect on today?")
  if (lowDisc) questions.push("Your discipline has been drifting. Want to reset your rules?")
  if (revenge) questions.push("You broke your risk rule recently. Want to review before entering?")

  return { greeting, questions: questions.slice(0, 3), insight: checkin.keyInsight, suggestion: checkin.suggestion }
}

/* ── Props ── */
interface Props {
  checkin: AICheckIn
  psychology: PsychologyState
  performance: PerformanceSnapshot
  plan: DailyPlan
  sessionMode: SessionMode
  currentMood: MoodLevel | null
  onMoodCheckIn: (mood: MoodLevel) => void
  onEnterHome: (mode: EntryMode) => void
  isHighRisk: boolean
  isLosingStreak: boolean
}

export function ArrivalLayer({
  checkin, psychology, performance, plan, sessionMode,
  currentMood, onMoodCheckIn, onEnterHome, isHighRisk, isLosingStreak,
}: Props) {
  const mode = MODE_CONFIG[sessionMode]
  const adaptive = buildAdaptive(checkin, psychology, performance, sessionMode)

  /* Typewriter greeting */
  const [typed, setTyped] = useState("")
  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      setTyped(adaptive.greeting.slice(0, i + 1))
      i++
      if (i >= adaptive.greeting.length) clearInterval(iv)
    }, 30)
    return () => clearInterval(iv)
  }, [adaptive.greeting])

  /* Mood selected state */
  const [moodDone, setMoodDone] = useState(!!currentMood)
  const selectMood = (m: MoodLevel) => { onMoodCheckIn(m); setMoodDone(true) }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">

      {/* Node field */}
      <NodeField color={mode.color} />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, rgba(${mode.color},0.04), transparent 65%)` }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6 py-12">

        {/* Mode pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: `rgba(${mode.color},0.8)` }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color: `rgba(${mode.color},0.7)` }}>
            {mode.label}
          </span>
          <span className="text-[10px] font-mono" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>
            {mode.tagline}
          </span>
        </motion.div>

        {/* AI Presence Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{
            background: `linear-gradient(135deg, rgba(${ACCENT.purple.rgb},0.15), rgba(${mode.color},0.08))`,
            border: `1px solid rgba(${ACCENT.purple.rgb},0.15)`,
            boxShadow: GLOW.med(ACCENT.purple.rgb),
          }}
        >
          <motion.div
            animate={{ boxShadow: [GLOW.low(ACCENT.purple.rgb), GLOW.high(ACCENT.purple.rgb), GLOW.low(ACCENT.purple.rgb)] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-full h-full rounded-2xl flex items-center justify-center"
          >
            <Sparkles className="w-7 h-7" style={{ color: ACCENT.purple.hex }} />
          </motion.div>
        </motion.div>

        {/* Greeting */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mb-4">
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight min-h-[40px]">
            {typed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-6 ml-1 align-text-bottom"
              style={{ background: `rgba(${ACCENT.purple.rgb},0.6)` }}
            />
          </h1>
        </motion.div>

        {/* Session context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <Clock className="w-3.5 h-3.5" style={{ color: `rgba(${mode.color},0.4)` }} />
          <span className="text-[12px]" style={{ color: `rgba(255,255,255,0.4)` }}>
            {checkin.sessionInfo.isOpen
              ? `${checkin.sessionInfo.name} session is live`
              : `${checkin.sessionInfo.name} opens in ${checkin.sessionInfo.opensIn}`}
          </span>
          <span className="w-px h-3" style={{ background: `rgba(${ACCENT.slate.rgb},0.15)` }} />
          <span className="text-[10px] font-mono" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>
            {checkin.stateSummary.currentStreak.count}{checkin.stateSummary.currentStreak.type === "win" ? "W" : "L"} streak
          </span>
        </motion.div>

        {/* Insight card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-5 rounded-2xl mb-4"
          style={{
            background: `rgba(${ACCENT.purple.rgb},0.03)`,
            border: `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-3.5 h-3.5" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }}>
              What I see right now
            </span>
          </div>
          <p className="text-[13px] leading-[1.7]" style={{ color: `rgba(255,255,255,0.55)` }}>{adaptive.insight}</p>
        </motion.div>

        {/* Suggestion card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="p-5 rounded-2xl mb-8"
          style={{
            background: `rgba(${mode.color},0.03)`,
            border: `1px solid rgba(${mode.color},0.06)`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5" style={{ color: `rgba(${mode.color},0.5)` }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${mode.color},0.5)` }}>
              What matters right now
            </span>
          </div>
          <p className="text-[13px] leading-[1.7]" style={{ color: `rgba(255,255,255,0.55)` }}>{adaptive.suggestion}</p>
        </motion.div>

        {/* Adaptive Questions */}
        {adaptive.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-2 mb-8"
          >
            {adaptive.questions.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.12 }}
                className="w-full text-left p-4 rounded-xl flex items-center gap-3 group transition-all duration-200"
                style={{
                  background: `rgba(${ACCENT.purple.rgb},0.02)`,
                  border: `1px solid rgba(${ACCENT.purple.rgb},0.05)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${ACCENT.purple.rgb},0.06)`
                  e.currentTarget.style.borderColor = `rgba(${ACCENT.purple.rgb},0.14)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(${ACCENT.purple.rgb},0.02)`
                  e.currentTarget.style.borderColor = `rgba(${ACCENT.purple.rgb},0.05)`
                }}
              >
                <span className="text-[13px]" style={{ color: `rgba(255,255,255,0.55)` }}>{q}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Mood check-in (if not yet done) */}
        {!moodDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mb-8"
          >
            <div className="text-center mb-3">
              <span className="text-[11px]" style={{ color: `rgba(${ACCENT.slate.rgb},0.45)` }}>
                How do you feel right now?
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.level}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectMood(opt.level)}
                  className="px-3.5 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider font-semibold transition-all duration-200"
                  style={{
                    background: `rgba(${opt.color},0.04)`,
                    border: `1px solid rgba(${opt.color},0.08)`,
                    color: `rgba(${opt.color},0.5)`,
                  }}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ ENTRY MODES ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: moodDone ? 1.0 : 1.5 }}
          className="space-y-3"
        >
          {/* Divider */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-px" style={{ background: `rgba(${ACCENT.slate.rgb},0.06)` }} />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }}>
              Enter
            </span>
            <div className="flex-1 h-px" style={{ background: `rgba(${ACCENT.slate.rgb},0.06)` }} />
          </div>

          {/* Quick Entry */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onEnterHome("quick")}
            className="w-full p-4 rounded-2xl flex items-center gap-4 group transition-all duration-200"
            style={{
              background: `rgba(${ACCENT.emerald.rgb},0.04)`,
              border: `1px solid rgba(${ACCENT.emerald.rgb},0.08)`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${ACCENT.emerald.rgb},0.1)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.1)` }}
            >
              <Zap className="w-4 h-4" style={{ color: `rgba(${ACCENT.emerald.rgb},0.8)` }} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white text-sm font-semibold">Quick Entry</div>
              <div className="text-[11px]" style={{ color: `rgba(255,255,255,0.35)` }}>Go straight to your dashboard</div>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: `rgba(${ACCENT.emerald.rgb},0.6)` }} />
          </motion.button>

          {/* Guided Entry */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onEnterHome("guided")}
            className="w-full p-4 rounded-2xl flex items-center gap-4 group transition-all duration-200"
            style={{
              background: `rgba(${ACCENT.blue.rgb},0.04)`,
              border: `1px solid rgba(${ACCENT.blue.rgb},0.08)`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${ACCENT.blue.rgb},0.1)`, border: `1px solid rgba(${ACCENT.blue.rgb},0.1)` }}
            >
              <Eye className="w-4 h-4" style={{ color: `rgba(${ACCENT.blue.rgb},0.8)` }} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white text-sm font-semibold">Guided Entry</div>
              <div className="text-[11px]" style={{ color: `rgba(255,255,255,0.35)` }}>AI walks you through your current state</div>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: `rgba(${ACCENT.blue.rgb},0.6)` }} />
          </motion.button>

          {/* Protected Entry (always shown if risk, otherwise subtle) */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onEnterHome("protected")}
            className="w-full p-4 rounded-2xl flex items-center gap-4 group transition-all duration-200"
            style={{
              background: isHighRisk ? `rgba(${ACCENT.amber.rgb},0.06)` : `rgba(${ACCENT.amber.rgb},0.02)`,
              border: `1px solid rgba(${ACCENT.amber.rgb},${isHighRisk ? 0.12 : 0.05})`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `rgba(${ACCENT.amber.rgb},${isHighRisk ? 0.15 : 0.08})`,
                border: `1px solid rgba(${ACCENT.amber.rgb},${isHighRisk ? 0.15 : 0.08})`,
              }}
            >
              <Shield className="w-4 h-4" style={{ color: `rgba(${ACCENT.amber.rgb},0.8)` }} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white text-sm font-semibold">
                Protected Entry
                {isHighRisk && (
                  <span className="ml-2 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded" style={{
                    background: `rgba(${ACCENT.amber.rgb},0.12)`,
                    color: `rgba(${ACCENT.amber.rgb},0.8)`,
                  }}>Suggested</span>
                )}
              </div>
              <div className="text-[11px]" style={{ color: `rgba(255,255,255,0.35)` }}>
                {isHighRisk
                  ? "High behavioral risk detected. Enter with trade lock enabled"
                  : "Enter with trade lock and calming interface"}
              </div>
            </div>
            <Lock className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: `rgba(${ACCENT.amber.rgb},0.6)` }} />
          </motion.button>

          {/* Risk warning if applicable */}
          {isHighRisk && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="p-3 rounded-xl flex items-start gap-2.5 mt-2"
              style={{
                background: `rgba(${ACCENT.rose.rgb},0.03)`,
                border: `1px solid rgba(${ACCENT.rose.rgb},0.06)`,
              }}
            >
              <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.rose.rgb},0.5)` }} />
              <p className="text-[10px] leading-relaxed" style={{ color: `rgba(${ACCENT.rose.rgb},0.5)` }}>
                {isLosingStreak
                  ? `You have ${psychology.consecutiveLosses} consecutive losses. Historical pattern shows increased risk-taking after streaks like this. Protected entry is recommended.`
                  : "Your discipline score is below safe threshold. Consider entering with protections active."}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Subtle footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="text-center mt-10"
        >
          <p className="text-[10px] italic" style={{ color: `rgba(255,255,255,0.15)` }}>
            The market rewards patience and discipline.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
