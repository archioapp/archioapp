"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useCoachProfile } from "@/lib/stores/coachProfile"
import {
  Crosshair, Shield, Brain, BookOpen, Zap,
  ChevronRight, ChevronLeft, Check, X,
  Fingerprint, ArrowRight,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════
// PHASE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

const PHASES = [
  {
    id: "identity",
    label: "Trading Identity",
    subtitle: "Who are you as a trader?",
    description: "Define your trading style, methodology, experience level, and the markets you operate in. This shapes every recommendation the system will make.",
    icon: Fingerprint,
    color: "#10b981",
    colorName: "emerald",
    accentGlow: "shadow-emerald-500/20",
  },
  {
    id: "strategy",
    label: "Strategy Framework",
    subtitle: "How do you trade?",
    description: "Map your entry logic, confluences, timeframes, and trade management. The system learns your language so it can speak it back to you.",
    icon: Crosshair,
    color: "#06b6d4",
    colorName: "cyan",
    accentGlow: "shadow-cyan-500/20",
  },
  {
    id: "risk",
    label: "Risk Architecture",
    subtitle: "How do you protect yourself?",
    description: "Set your risk per trade, daily caps, maximum exposure, and drawdown limits. These become hard boundaries the system enforces.",
    icon: Shield,
    color: "#f59e0b",
    colorName: "amber",
    accentGlow: "shadow-amber-500/20",
  },
  {
    id: "psychology",
    label: "Psychology Profile",
    subtitle: "Who are you under pressure?",
    description: "Identify your emotional patterns, behavioral triggers, and psychological tendencies. This is the most important data -- it determines 40% of your readiness score.",
    icon: Brain,
    color: "#a78bfa",
    colorName: "violet",
    accentGlow: "shadow-violet-500/20",
  },
  {
    id: "rules",
    label: "Trading Rules",
    subtitle: "What have you committed to?",
    description: "Define the rules you trade by. The system will track your adherence and show you the cost every time you break one.",
    icon: BookOpen,
    color: "#ec4899",
    colorName: "pink",
    accentGlow: "shadow-pink-500/20",
  },
] as const

export type PhaseId = (typeof PHASES)[number]["id"]

// ═══════════════════════════════════════════════════════════════════
// PARTICLE FIELD (background animation)
// ═══════════════════════════════════════════════════════════════════

function ParticleField({ color, phase }: { color: string; phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number }>>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    // Initialize particles
    const count = 60
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }))

    const animate = () => {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const t = Date.now() * 0.001

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `${color}${Math.round((1 - dist / 80) * 15).toString(16).padStart(2, "0")}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02

        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        const pulsedAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse + t))
        const hex = Math.round(pulsedAlpha * 255).toString(16).padStart(2, "0")

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${hex}`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [color, phase])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ═══════════════════════════════════════════════════════════════════
// DNA HELIX PROGRESS
// ═══════════════════════════════════════════════════════════════════

function DNAProgress({ currentPhase, completedPhases }: { currentPhase: number; completedPhases: boolean[] }) {
  return (
    <div className="flex items-center gap-0.5 py-3 px-2">
      {PHASES.map((phase, i) => {
        const isActive = i === currentPhase
        const isDone = completedPhases[i]
        const Icon = phase.icon

        return (
          <div key={phase.id} className="flex items-center">
            {/* Node */}
            <motion.div
              className="relative flex items-center justify-center"
              animate={{
                scale: isActive ? 1 : 0.85,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Glow ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 12px 2px ${phase.color}40` }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  isDone
                    ? "border-white/20 bg-white/10"
                    : isActive
                      ? "border-white/30 bg-white/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02]"
                }`}
                style={isActive ? { borderColor: `${phase.color}60` } : isDone ? { borderColor: `${phase.color}30` } : {}}
              >
                {isDone ? (
                  <Check className="w-3 h-3" style={{ color: phase.color }} />
                ) : (
                  <Icon className="w-3 h-3" style={{ color: isActive ? phase.color : "rgba(255,255,255,0.2)" }} />
                )}
              </div>
            </motion.div>

            {/* Connector line */}
            {i < PHASES.length - 1 && (
              <div className="w-4 h-[1px] mx-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isDone ? `${phase.color}40` : "rgba(255,255,255,0.06)",
                  }}
                  animate={isDone ? { opacity: [0.4, 0.8, 0.4] } : {}}
                  transition={isDone ? { duration: 3, repeat: Infinity } : {}}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE INTRO CARD
// ═══════════════════════════════════════════════════════════════════

function PhaseIntro({ phase, onBegin }: { phase: (typeof PHASES)[number]; onBegin: () => void }) {
  const Icon = phase.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center h-full px-6 text-center"
    >
      {/* Icon with glow */}
      <motion.div
        className="relative mb-5"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10"
          style={{ background: `${phase.color}10`, boxShadow: `0 0 40px 8px ${phase.color}15` }}
        >
          <Icon className="w-7 h-7" style={{ color: phase.color }} />
        </div>
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: phase.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          initial={{ x: 28, y: 28 }}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <span
          className="text-[9px] font-mono tracking-[0.2em] uppercase mb-2 block"
          style={{ color: phase.color }}
        >
          {phase.subtitle}
        </span>
        <h2 className="text-xl font-bold text-white/95 mb-3 tracking-tight">{phase.label}</h2>
        <p className="text-[11px] text-white/40 leading-relaxed max-w-xs mx-auto mb-6">
          {phase.description}
        </p>
      </motion.div>

      {/* Begin button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBegin}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-semibold text-white border border-white/10 transition-all duration-300 hover:border-white/20"
        style={{ background: `${phase.color}15`, boxShadow: `0 0 20px 4px ${phase.color}10` }}
      >
        Begin Configuration
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SHARED QUESTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════

export function QuestionSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-5"
    >
      <h3 className="text-[11px] font-bold text-white/80 mb-0.5 tracking-wide">{title}</h3>
      {subtitle && <p className="text-[9px] text-white/30 mb-2.5">{subtitle}</p>}
      {!subtitle && <div className="mb-2.5" />}
      {children}
    </motion.div>
  )
}

export function OptionGrid({
  options,
  selected,
  onSelect,
  multi = false,
  columns = 3,
  color = "#10b981",
}: {
  options: Array<{ value: string; label: string; desc?: string; icon?: React.ReactNode }>
  selected: string | string[]
  onSelect: (v: string) => void
  multi?: boolean
  columns?: number
  color?: string
}) {
  const isSelected = (v: string) => (Array.isArray(selected) ? selected.includes(v) : selected === v)

  return (
    <div className={`grid gap-1.5 ${columns === 2 ? "grid-cols-2" : columns === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
      {options.map((opt) => {
        const active = isSelected(opt.value)
        return (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(opt.value)}
            className={`relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border text-center transition-all duration-200 ${
              active
                ? "border-white/20 bg-white/[0.06]"
                : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08]"
            }`}
            style={active ? { borderColor: `${color}40`, background: `${color}08`, boxShadow: `0 0 12px 2px ${color}08` } : {}}
          >
            {opt.icon && (
              <div className="text-white/40" style={active ? { color } : {}}>
                {opt.icon}
              </div>
            )}
            <span className={`text-[10px] font-semibold ${active ? "text-white/90" : "text-white/50"}`}>
              {opt.label}
            </span>
            {opt.desc && (
              <span className="text-[8px] text-white/25 leading-tight">{opt.desc}</span>
            )}
            {active && (
              <motion.div
                layoutId={multi ? undefined : "option-indicator"}
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  color = "#10b981",
  formatValue,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  color?: string
  formatValue?: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  const display = formatValue ? formatValue(value) : `${value}${unit}`

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-white/50">{label}</span>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>
          {display}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color, width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}

export function TagInput({
  tags,
  onToggle,
  available,
  color = "#10b981",
}: {
  tags: string[]
  onToggle: (tag: string) => void
  available: string[]
  color?: string
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {available.map((tag) => {
        const active = tags.includes(tag)
        return (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(tag)}
            className={`px-2.5 py-1 rounded-md text-[9px] font-semibold border transition-all duration-200 ${
              active
                ? "text-white/90 border-white/15"
                : "text-white/35 border-white/[0.04] hover:border-white/[0.08]"
            }`}
            style={active ? { borderColor: `${color}40`, background: `${color}10`, color: `${color}` } : {}}
          >
            {tag}
          </motion.button>
        )
      })}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  const cls = "w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] text-white/80 placeholder-white/20 outline-none focus:border-white/15 transition-colors"

  if (multiline) {
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls + " resize-none"} />
  }
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
}

export function RatingInput({ value, onChange, max = 10, color = "#10b981" }: { value: number; onChange: (v: number) => void; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const active = i < value
        return (
          <motion.button
            key={i}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(i + 1)}
            className={`w-5 h-5 rounded-sm border transition-all duration-200 text-[8px] font-bold flex items-center justify-center ${
              active ? "border-white/15 text-white/80" : "border-white/[0.04] text-white/15 hover:border-white/[0.08]"
            }`}
            style={active ? { borderColor: `${color}40`, background: `${color}12` } : {}}
          >
            {i + 1}
          </motion.button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN ONBOARDING SHELL
// ═══════════════════════════════════════════════════════════════════

export function OnboardingShell({ onComplete }: { onComplete: () => void }) {
  const onboarding = useCoachProfile((s) => s.onboarding)
  const setOnboarding = useCoachProfile((s) => s.setOnboarding)
  const completeOnboarding = useCoachProfile((s) => s.completeOnboarding)
  const safeOnboarding = onboarding ?? { currentPhase: 0, phasesCompleted: [false, false, false, false, false], completed: false, version: 1 }
  const [currentPhase, setCurrentPhase] = useState(safeOnboarding.currentPhase)
  const [showIntro, setShowIntro] = useState(true)
  const [direction, setDirection] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)

  const phase = PHASES[currentPhase]
  const completedPhases = safeOnboarding.phasesCompleted ?? [false, false, false, false, false]

  const goToPhase = useCallback((idx: number) => {
    setDirection(idx > currentPhase ? 1 : -1)
    setCurrentPhase(idx)
    setShowIntro(true)
    setOnboarding({ currentPhase: idx })
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [currentPhase, setOnboarding])

  const markPhaseComplete = useCallback(() => {
    const next = [...completedPhases]
    next[currentPhase] = true
    setOnboarding({ phasesCompleted: next })

    if (currentPhase < PHASES.length - 1) {
      goToPhase(currentPhase + 1)
    } else {
      // All phases done
      completeOnboarding()
      onComplete()
    }
  }, [currentPhase, completedPhases, goToPhase, setOnboarding, completeOnboarding, onComplete])

  const totalCompleted = completedPhases.filter(Boolean).length
  const overallProgress = (totalCompleted / PHASES.length) * 100

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#050508] overflow-hidden">
      {/* Particle Background */}
      <ParticleField color={phase.color} phase={currentPhase} />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${phase.color}08 0%, transparent 70%)`,
        }}
      />

      {/* ── TOP BAR ── */}
      <div className="relative z-10 flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" style={{ color: phase.color }} />
            <span className="text-[10px] font-bold text-white/70 tracking-wide uppercase">System Calibration</span>
          </div>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/30 font-mono">
            {totalCompleted}/{PHASES.length}
          </span>
        </div>
        <button
          onClick={onComplete}
          className="text-[9px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Skip
        </button>
      </div>

      {/* ── DNA PROGRESS ── */}
      <div className="relative z-10 border-b border-white/[0.04]">
        <DNAProgress currentPhase={currentPhase} completedPhases={completedPhases} />
        {/* Overall progress bar */}
        <div className="h-[1px] bg-white/[0.02]">
          <motion.div
            className="h-full"
            style={{ background: phase.color }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {showIntro ? (
            <motion.div
              key={`intro-${currentPhase}`}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <PhaseIntro phase={phase} onBegin={() => setShowIntro(false)} />
            </motion.div>
          ) : (
            <motion.div
              key={`content-${currentPhase}`}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Phase header */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <phase.icon className="w-3.5 h-3.5" style={{ color: phase.color }} />
                  <span className="text-[11px] font-bold text-white/80">{phase.label}</span>
                </div>
                <span className="text-[8px] font-mono text-white/25">
                  PHASE {currentPhase + 1} OF {PHASES.length}
                </span>
              </div>

              {/* Scrollable content */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
                <PhaseContent phaseId={phase.id} color={phase.color} />
              </div>

              {/* Footer nav */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/[0.04]">
                <button
                  onClick={() => currentPhase > 0 ? goToPhase(currentPhase - 1) : setShowIntro(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-medium text-white/40 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08] transition-all"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Back
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={markPhaseComplete}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[10px] font-bold text-white/90 border border-white/15 transition-all"
                  style={{ background: `${phase.color}15`, borderColor: `${phase.color}30` }}
                >
                  {currentPhase < PHASES.length - 1 ? (
                    <>
                      Continue
                      <ChevronRight className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-3 h-3" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE CONTENT ROUTER
// ═══════════════════════════════════════════════════════════════════

function PhaseContent({ phaseId, color }: { phaseId: PhaseId; color: string }) {
  switch (phaseId) {
    case "identity": return <IdentityPhase color={color} />
    case "strategy": return <StrategyPhase color={color} />
    case "risk": return <RiskPhase color={color} />
    case "psychology": return <PsychologyPhase color={color} />
    case "rules": return <RulesPhase color={color} />
    default: return null
  }
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 1: TRADING IDENTITY
// ═══════════════════════════════════════════════════════════════════

function IdentityPhase({ color }: { color: string }) {
  const identity = useCoachProfile((s) => s.identity) ?? { style: "day", methodology: "price-action", experienceLevel: "intermediate", experienceYears: 1, markets: ["forex"] as string[], primaryInstruments: [] as string[], tradingGoal: "", weeklyHoursAvailable: 20 }
  const setIdentity = useCoachProfile((s) => s.setIdentity)

  const toggleMarket = (m: string) => {
    const markets = (identity.markets ?? []) as string[]
    setIdentity({ markets: markets.includes(m) ? markets.filter((x: string) => x !== m) : [...markets, m] as any })
  }

  return (
    <div className="space-y-1">
      <QuestionSection title="Trading Style" subtitle="How long do you typically hold positions?">
        <OptionGrid
          options={[
            { value: "scalp", label: "Scalp", desc: "Seconds to minutes" },
            { value: "day", label: "Day Trade", desc: "Intraday, closed by session end" },
            { value: "swing", label: "Swing", desc: "Days to weeks" },
            { value: "position", label: "Position", desc: "Weeks to months" },
            { value: "hybrid", label: "Hybrid", desc: "Multiple styles" },
          ]}
          selected={identity.style}
          onSelect={(v) => setIdentity({ style: v as any })}
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Methodology" subtitle="What framework guides your analysis?">
        <OptionGrid
          options={[
            { value: "ict", label: "ICT", desc: "Inner Circle Trader" },
            { value: "smc", label: "SMC", desc: "Smart Money Concepts" },
            { value: "price-action", label: "Price Action", desc: "Candlesticks & structure" },
            { value: "supply-demand", label: "Supply & Demand", desc: "Zone-based trading" },
            { value: "vsa", label: "VSA", desc: "Volume Spread Analysis" },
            { value: "indicator", label: "Indicator", desc: "MA, RSI, MACD, etc." },
            { value: "custom", label: "Custom", desc: "Your own system" },
          ]}
          selected={identity.methodology}
          onSelect={(v) => setIdentity({ methodology: v as any })}
          columns={3}
          color={color}
        />
        {identity.methodology === "custom" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
            <TextInput
              value={identity.methodologyCustom || ""}
              onChange={(v) => setIdentity({ methodologyCustom: v })}
              placeholder="Describe your trading methodology..."
              multiline
            />
          </motion.div>
        )}
      </QuestionSection>

      <QuestionSection title="Experience Level" subtitle="How long have you been trading actively?">
        <OptionGrid
          options={[
            { value: "beginner", label: "Beginner", desc: "< 1 year" },
            { value: "intermediate", label: "Intermediate", desc: "1-3 years" },
            { value: "advanced", label: "Advanced", desc: "3-5 years" },
            { value: "professional", label: "Professional", desc: "5+ years" },
          ]}
          selected={identity.experienceLevel}
          onSelect={(v) => setIdentity({ experienceLevel: v as any })}
          columns={4}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Markets" subtitle="Which markets do you trade? Select all that apply.">
        <OptionGrid
          options={[
            { value: "forex", label: "Forex", desc: "Currency pairs" },
            { value: "indices", label: "Indices", desc: "US30, NAS100, SPX" },
            { value: "crypto", label: "Crypto", desc: "BTC, ETH, etc." },
            { value: "commodities", label: "Commodities", desc: "Gold, Oil, etc." },
            { value: "stocks", label: "Stocks", desc: "Individual equities" },
          ]}
          selected={identity.markets}
          onSelect={toggleMarket}
          multi
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Primary Instruments" subtitle="Which instruments do you trade most? Comma-separated.">
        <TextInput
          value={identity.primaryInstruments.join(", ")}
          onChange={(v) => setIdentity({ primaryInstruments: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="e.g. EURUSD, GBPJPY, XAUUSD, NAS100"
        />
      </QuestionSection>

      <QuestionSection title="Trading Goal" subtitle="What are you trying to achieve with your trading?">
        <TextInput
          value={identity.tradingGoal}
          onChange={(v) => setIdentity({ tradingGoal: v })}
          placeholder="e.g. Consistent 3-5R per week with strict risk management"
          multiline
        />
      </QuestionSection>

      <QuestionSection title="Weekly Hours" subtitle="How many hours per week can you dedicate to trading?">
        <SliderInput
          label="Hours per week"
          value={identity.weeklyHoursAvailable}
          onChange={(v) => setIdentity({ weeklyHoursAvailable: v })}
          min={2}
          max={60}
          step={1}
          unit="h"
          color={color}
        />
      </QuestionSection>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 2: STRATEGY FRAMEWORK
// ═══════════════════════════════════════════════════════════════════

function StrategyPhase({ color }: { color: string }) {
  const { strategy, setStrategy } = useCoachProfile()

  const toggleSession = (s: string) => {
    const sessions = strategy.preferredSessions as string[]
    setStrategy({ preferredSessions: sessions.includes(s) ? sessions.filter((x: string) => x !== s) : [...sessions, s] as any })
  }

  const toggleConfluence = (c: string) => {
    setStrategy({ confluences: strategy.confluences.includes(c) ? strategy.confluences.filter((x) => x !== c) : [...strategy.confluences, c] })
  }

  const toggleTf = (tf: string, key: "analysisTimeframes" | "entryTimeframes") => {
    const arr = strategy[key]
    setStrategy({ [key]: arr.includes(tf) ? arr.filter((x) => x !== tf) : [...arr, tf] })
  }

  const allConfluences = [
    "Order Blocks", "Fair Value Gaps", "Break of Structure", "Change of Character",
    "Liquidity Sweeps", "Liquidity Pools", "Supply Zones", "Demand Zones",
    "Equal Highs/Lows", "Fibonacci", "Moving Averages", "VWAP",
    "Divergence", "Trendlines", "Support/Resistance", "Volume Profile",
    "Candlestick Patterns", "Chart Patterns", "Market Structure Shift",
  ]

  const allTimeframes = ["M1", "M3", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN"]

  return (
    <div className="space-y-1">
      <QuestionSection title="Preferred Sessions" subtitle="When do you actively trade?">
        <OptionGrid
          options={[
            { value: "Asia", label: "Asia", desc: "00:00 - 08:00 UTC" },
            { value: "London", label: "London", desc: "07:00 - 16:00 UTC" },
            { value: "New York", label: "New York", desc: "12:00 - 21:00 UTC" },
          ]}
          selected={strategy.preferredSessions}
          onSelect={toggleSession}
          multi
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Confluences" subtitle="What signals do you look for before entering? Select all you use.">
        <TagInput tags={strategy.confluences} onToggle={toggleConfluence} available={allConfluences} color={color} />
      </QuestionSection>

      <QuestionSection title="Minimum R:R" subtitle="What is the lowest reward-to-risk ratio you will accept?">
        <SliderInput
          label="Risk-to-Reward Ratio"
          value={strategy.minRR}
          onChange={(v) => setStrategy({ minRR: v })}
          min={0.5}
          max={5}
          step={0.25}
          color={color}
          formatValue={(v) => `1:${v}`}
        />
      </QuestionSection>

      <QuestionSection title="Entry Type" subtitle="How do you typically enter trades?">
        <OptionGrid
          options={[
            { value: "limit", label: "Limit Order", desc: "Set & wait" },
            { value: "market", label: "Market Order", desc: "Enter now" },
            { value: "stop", label: "Stop Order", desc: "Trigger at level" },
          ]}
          selected={strategy.entryTypes}
          onSelect={(v) => {
            const types = strategy.entryTypes as string[]
            setStrategy({ entryTypes: types.includes(v) ? types.filter((x: string) => x !== v) : [...types, v] as any })
          }}
          multi
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Analysis Timeframes" subtitle="Which timeframes do you use for higher timeframe analysis?">
        <TagInput tags={strategy.analysisTimeframes} onToggle={(tf) => toggleTf(tf, "analysisTimeframes")} available={allTimeframes} color={color} />
      </QuestionSection>

      <QuestionSection title="Entry Timeframes" subtitle="Which timeframes do you use for entries?">
        <TagInput tags={strategy.entryTimeframes} onToggle={(tf) => toggleTf(tf, "entryTimeframes")} available={allTimeframes} color={color} />
      </QuestionSection>

      <QuestionSection title="Stop Loss Method" subtitle="How do you determine your stop loss placement?">
        <OptionGrid
          options={[
            { value: "swing", label: "Swing H/L", desc: "Beyond swing point" },
            { value: "structure", label: "Structure", desc: "Beyond key structure" },
            { value: "atr", label: "ATR-based", desc: "Volatility adjusted" },
            { value: "fixed", label: "Fixed Pips", desc: "Set distance" },
            { value: "custom", label: "Custom", desc: "Your own method" },
          ]}
          selected={strategy.slPolicy}
          onSelect={(v) => setStrategy({ slPolicy: v as any })}
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Take Profit Strategy" subtitle="How do you manage your exits?">
        <OptionGrid
          options={[
            { value: "fixed-rr", label: "Fixed R:R", desc: "Set target at R:R" },
            { value: "structure", label: "Structure", desc: "Key levels" },
            { value: "trail", label: "Trail Stop", desc: "Lock in profits" },
            { value: "partial", label: "Partials", desc: "Scale out" },
            { value: "custom", label: "Custom", desc: "Your own" },
          ]}
          selected={strategy.tpStrategy}
          onSelect={(v) => setStrategy({ tpStrategy: v as any })}
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="News Filter" subtitle="How many minutes before/after high-impact news do you avoid trading?">
        <SliderInput
          label="News buffer"
          value={strategy.newsFilterMins}
          onChange={(v) => setStrategy({ newsFilterMins: v })}
          min={0}
          max={60}
          step={5}
          unit=" min"
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Counter-Trend Trades" subtitle="Do you take trades against the higher timeframe trend?">
        <OptionGrid
          options={[
            { value: "no", label: "No", desc: "Trend only" },
            { value: "yes", label: "Sometimes", desc: "With extra confirmation" },
          ]}
          selected={strategy.counterTrendAllowed ? "yes" : "no"}
          onSelect={(v) => setStrategy({ counterTrendAllowed: v === "yes" })}
          columns={2}
          color={color}
        />
      </QuestionSection>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 3: RISK ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════

function RiskPhase({ color }: { color: string }) {
  const { risk, setRisk } = useCoachProfile()

  return (
    <div className="space-y-1">
      <QuestionSection title="Risk Per Trade" subtitle="What percentage of your account do you risk on each trade?">
        <SliderInput label="Per trade" value={risk.riskPerTrade} onChange={(v) => setRisk({ riskPerTrade: v })} min={0.1} max={3} step={0.1} unit="%" color={color} />
      </QuestionSection>

      <QuestionSection title="Daily Loss Cap" subtitle="At what daily drawdown do you stop trading?">
        <SliderInput label="Daily cap" value={risk.dailyLossCap} onChange={(v) => setRisk({ dailyLossCap: v })} min={0.5} max={10} step={0.5} unit="%" color={color} />
      </QuestionSection>

      <QuestionSection title="Weekly Loss Cap" subtitle="Maximum allowable weekly drawdown.">
        <SliderInput label="Weekly cap" value={risk.weeklyLossCap} onChange={(v) => setRisk({ weeklyLossCap: v })} min={1} max={20} step={0.5} unit="%" color={color} />
      </QuestionSection>

      <QuestionSection title="Max Trades Per Session" subtitle="How many trades will you take in a single session?">
        <SliderInput label="Trades / session" value={risk.maxTradesPerSession} onChange={(v) => setRisk({ maxTradesPerSession: v })} min={1} max={10} step={1} color={color} />
      </QuestionSection>

      <QuestionSection title="Max Trades Per Day" subtitle="Total trades across all sessions.">
        <SliderInput label="Trades / day" value={risk.maxTradesPerDay} onChange={(v) => setRisk({ maxTradesPerDay: v })} min={1} max={15} step={1} color={color} />
      </QuestionSection>

      <QuestionSection title="Max Portfolio Exposure" subtitle="Maximum total exposure at any time.">
        <SliderInput label="Exposure" value={risk.maxExposurePercent} onChange={(v) => setRisk({ maxExposurePercent: v })} min={0.5} max={10} step={0.5} unit="%" color={color} />
      </QuestionSection>

      <QuestionSection title="Max Correlated Pairs" subtitle="How many correlated instruments can you have open?">
        <SliderInput label="Correlated pairs" value={risk.maxCorrelatedPairs} onChange={(v) => setRisk({ maxCorrelatedPairs: v })} min={1} max={5} step={1} color={color} />
      </QuestionSection>

      <QuestionSection title="Weekly R Target" subtitle="How much R do you aim for per week?">
        <SliderInput label="R target" value={risk.weeklyRTarget} onChange={(v) => setRisk({ weeklyRTarget: v })} min={1} max={20} step={0.5} unit="R" color={color} />
      </QuestionSection>

      <QuestionSection title="Drawdown Kill Switch" subtitle="At what account drawdown do you stop trading entirely?">
        <SliderInput label="Kill switch" value={risk.drawdownLimit} onChange={(v) => setRisk({ drawdownLimit: v })} min={3} max={30} step={1} unit="%" color={color} />
      </QuestionSection>

      <QuestionSection title="Scale Into Positions" subtitle="Do you add to winning positions?">
        <OptionGrid
          options={[
            { value: "no", label: "No", desc: "Full size at entry" },
            { value: "yes", label: "Yes", desc: "Add on confirmation" },
          ]}
          selected={risk.scaleIntoPositions ? "yes" : "no"}
          onSelect={(v) => setRisk({ scaleIntoPositions: v === "yes" })}
          columns={2}
          color={color}
        />
      </QuestionSection>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 4: PSYCHOLOGY PROFILE
// ═══════════════════════════════════════════════════════════════════

function PsychologyPhase({ color }: { color: string }) {
  const { psych, setPsych } = useCoachProfile()

  const toggleItem = (key: "biggestWeakness" | "emotionalTriggers" | "strengthAreas" | "preSessionRoutine" | "postSessionRoutine", item: string) => {
    const arr = psych[key]
    setPsych({ [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item] })
  }

  return (
    <div className="space-y-1">
      <QuestionSection title="After a Loss" subtitle="When you take a loss, what do you typically do next?">
        <OptionGrid
          options={[
            { value: "wait", label: "Wait", desc: "Pause and reset" },
            { value: "reduce-size", label: "Reduce Size", desc: "Trade smaller" },
            { value: "re-enter", label: "Re-enter", desc: "Try again immediately" },
            { value: "increase-size", label: "Increase Size", desc: "Try to recover" },
            { value: "next-session", label: "Next Session", desc: "Done for the session" },
          ]}
          selected={psych.afterLossBehavior}
          onSelect={(v) => setPsych({ afterLossBehavior: v as any })}
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Biggest Weaknesses" subtitle="What costs you the most money? Select all that apply.">
        <TagInput
          tags={psych.biggestWeakness}
          onToggle={(v) => toggleItem("biggestWeakness", v)}
          available={[
            "Overtrading", "Revenge trading", "Cutting winners short", "Moving stop loss",
            "Not following rules", "Fear of entry", "FOMO entries", "No stop loss",
            "Chasing price", "Trading boredom", "Impulsive entries", "Holding losers too long",
          ]}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Winning Streak Behavior" subtitle="How do you behave after consecutive wins?">
        <OptionGrid
          options={[
            { value: "disciplined", label: "Stay Disciplined", desc: "Same rules apply" },
            { value: "increase-size", label: "Size Up", desc: "I feel confident" },
            { value: "loosen-rules", label: "Loosen Rules", desc: "Rules feel optional" },
            { value: "take-break", label: "Take a Break", desc: "Bank profits and stop" },
          ]}
          selected={psych.winningStreakBehavior}
          onSelect={(v) => setPsych({ winningStreakBehavior: v as any })}
          columns={2}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Cooldown After Loss" subtitle="How long do you wait before trading again after a loss?">
        <SliderInput
          label="Cooldown"
          value={psych.cooldownAfterLossMins}
          onChange={(v) => setPsych({ cooldownAfterLossMins: v })}
          min={0}
          max={120}
          step={5}
          unit=" min"
          color={color}
          formatValue={(v) => v === 0 ? "None" : v >= 60 ? `${v / 60}h` : `${v} min`}
        />
      </QuestionSection>

      <QuestionSection title="Emotional Triggers" subtitle="What situations trigger emotional trading for you?">
        <TagInput
          tags={psych.emotionalTriggers}
          onToggle={(v) => toggleItem("emotionalTriggers", v)}
          available={[
            "Missing a move", "Consecutive losses", "Big unexpected move", "Seeing others profit",
            "News volatility", "Boredom", "End of session pressure", "Account at high water mark",
            "Monday trading", "Being wrong on bias", "Stop hunt feeling", "Overnight gaps",
          ]}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Strength Areas" subtitle="What do you do well as a trader?">
        <TagInput
          tags={psych.strengthAreas}
          onToggle={(v) => toggleItem("strengthAreas", v)}
          available={[
            "Patience on entries", "Risk management", "Journaling", "Accepting losses",
            "Reading structure", "Session discipline", "Position sizing", "Following the plan",
            "Cutting losers quickly", "Staying calm", "Pre-session prep", "Avoiding FOMO",
          ]}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Self-Assessment: Discipline" subtitle="Rate your overall trading discipline.">
        <RatingInput value={psych.selfDisciplineRating} onChange={(v) => setPsych({ selfDisciplineRating: v })} color={color} />
      </QuestionSection>

      <QuestionSection title="Self-Assessment: Patience" subtitle="Rate your patience in waiting for setups.">
        <RatingInput value={psych.selfPatienceRating} onChange={(v) => setPsych({ selfPatienceRating: v })} color={color} />
      </QuestionSection>

      <QuestionSection title="Journal Habit" subtitle="How consistently do you journal your trades?">
        <OptionGrid
          options={[
            { value: "always", label: "Always", desc: "Every trade logged" },
            { value: "sometimes", label: "Sometimes", desc: "When I remember" },
            { value: "never", label: "Never", desc: "I don't journal" },
          ]}
          selected={psych.journalHabit}
          onSelect={(v) => setPsych({ journalHabit: v as any })}
          columns={3}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Pre-Session Routine" subtitle="What do you do before a trading session?">
        <TagInput
          tags={psych.preSessionRoutine}
          onToggle={(v) => toggleItem("preSessionRoutine", v)}
          available={[
            "Review daily bias", "Mark key levels", "Check economic calendar", "Review previous session",
            "Set alerts", "Mental reset / meditation", "Review rules", "Physical exercise",
            "Check open positions", "Set daily targets", "Review trade plan",
          ]}
          color={color}
        />
      </QuestionSection>

      <QuestionSection title="Post-Session Routine" subtitle="What do you do after a trading session?">
        <TagInput
          tags={psych.postSessionRoutine}
          onToggle={(v) => toggleItem("postSessionRoutine", v)}
          available={[
            "Journal trades", "Screenshot charts", "Calculate daily P&L", "Review mistakes",
            "Update trade log", "Close all charts", "Emotional debrief", "Review rule adherence",
            "Plan next session", "Take a break",
          ]}
          color={color}
        />
      </QuestionSection>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 5: TRADING RULES
// ═══════════════════════════════════════════════════════════════════

const RULE_LIBRARY = {
  entry: [
    "Wait for HTF confluence before LTF entry",
    "Only enter in the direction of the higher timeframe trend",
    "Wait for a point of interest (OB/FVG/SD zone) before entering",
    "Require BOS or CHoCH confirmation before entry",
    "Only enter during killzone hours",
    "Use limit orders only -- no market entries",
    "Wait for candle close confirmation",
    "No counter-trend trades",
  ],
  exit: [
    "Move SL to breakeven after 1R profit",
    "Take partial profits at each key level",
    "Never widen a stop loss",
    "Trail stop using market structure",
    "Set TP before entering the trade",
  ],
  risk: [
    "Maximum 1% risk per trade",
    "Maximum 2 trades per session",
    "No trading during high-impact news",
    "Minimum 1:2 R:R on every trade",
    "No increased risk on losing days",
    "Stop trading after daily loss limit hit",
  ],
  session: [
    "Only trade during preferred sessions",
    "No trading Friday afternoon",
    "No Monday pre-London entries",
    "Maximum 4 hours of screen time per day",
  ],
  mindset: [
    "Journal every trade within 5 minutes",
    "Check emotional state before each trade",
    "Review pre-session checklist",
    "Accept the loss before entering the trade",
    "Walk away after 3 consecutive losses",
    "5-minute meditation before trading",
  ],
}

function RulesPhase({ color }: { color: string }) {
  const { strategy, addTradingRule, removeTradingRule } = useCoachProfile()
  const [customRule, setCustomRule] = useState("")
  const [activeCategory, setActiveCategory] = useState<keyof typeof RULE_LIBRARY>("entry")

  const categories: Array<{ key: keyof typeof RULE_LIBRARY; label: string }> = [
    { key: "entry", label: "Entry" },
    { key: "exit", label: "Exit" },
    { key: "risk", label: "Risk" },
    { key: "session", label: "Session" },
    { key: "mindset", label: "Mindset" },
  ]

  const rules = strategy?.tradingRules ?? []
  const isRuleSelected = (text: string) => rules.some((r) => r.text === text)

  const toggleRule = (text: string, category: string) => {
    if (isRuleSelected(text)) {
      const rule = rules.find((r) => r.text === text)
      if (rule) removeTradingRule(rule.id)
    } else {
      addTradingRule({
        id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text,
        category: category as any,
        importance: "important",
        adherence: undefined,
        violations: 0,
        streak: 0,
      })
    }
  }

  const addCustomRule = () => {
    if (!customRule.trim()) return
    addTradingRule({
      id: `rule-custom-${Date.now()}`,
      text: customRule.trim(),
      category: activeCategory,
      importance: "important",
    })
    setCustomRule("")
  }

  return (
    <div className="space-y-1">
      <QuestionSection title="Your Trading Rules" subtitle="Select the rules you commit to following. You can add custom rules too.">
        {/* Category tabs */}
        <div className="flex gap-1 mb-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-2.5 py-1 rounded-md text-[9px] font-semibold border transition-all ${
                activeCategory === cat.key
                  ? "text-white/80 border-white/15"
                  : "text-white/30 border-white/[0.04] hover:border-white/[0.08]"
              }`}
              style={activeCategory === cat.key ? { borderColor: `${color}40`, background: `${color}10` } : {}}
            >
              {cat.label}
              <span className="ml-1 text-[8px] opacity-50">
                {RULE_LIBRARY[cat.key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Rule list */}
        <div className="space-y-1 mb-3">
          {RULE_LIBRARY[activeCategory].map((rule) => {
            const selected = isRuleSelected(rule)
            return (
              <motion.button
                key={rule}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleRule(rule, activeCategory)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all duration-200 ${
                  selected
                    ? "border-white/15 bg-white/[0.04]"
                    : "border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08]"
                }`}
                style={selected ? { borderColor: `${color}30`, background: `${color}06` } : {}}
              >
                <div
                  className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all ${
                    selected ? "border-white/20" : "border-white/[0.08]"
                  }`}
                  style={selected ? { borderColor: `${color}50`, background: `${color}15` } : {}}
                >
                  {selected && <Check className="w-2.5 h-2.5" style={{ color }} />}
                </div>
                <span className={`text-[10px] ${selected ? "text-white/80" : "text-white/40"}`}>
                  {rule}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Custom rule input */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customRule}
            onChange={(e) => setCustomRule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomRule()}
            placeholder="Add a custom rule..."
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white/70 placeholder-white/20 outline-none focus:border-white/15"
          />
          <button
            onClick={addCustomRule}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/10 transition-all"
            style={customRule.trim() ? { borderColor: `${color}30`, color, background: `${color}08` } : {}}
          >
            Add
          </button>
        </div>

        {/* Selected rules count */}
        {rules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/40">Rules committed</span>
              <span className="text-[11px] font-mono font-bold" style={{ color }}>
                {rules.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {rules.map((r) => (
                <span
                  key={r.id}
                  className="text-[8px] px-1.5 py-0.5 rounded border border-white/[0.06] text-white/30 bg-white/[0.02] truncate max-w-[150px]"
                >
                  {r.text}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </QuestionSection>
    </div>
  )
}
