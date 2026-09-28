"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ACCENT, GLOW } from "@/components/mtf/mtf-theme"

/* ══════════════════════════════════════════════════════
   NEURAL ORB — Jarvis Command Core State Machine
   States: idle | hover | listening | processing | rendering | ready
   ══════════════════════════════════════════════════════ */

export type OrbState = "idle" | "hover" | "listening" | "processing" | "rendering" | "ready"

interface OrbConfig {
  particleCount: number
  ringCount: number
  pulseSpeed: number
  orbitSpeed: number
  glowIntensity: number
  coreScale: number
  particleSpread: number
}

const STATE_CONFIGS: Record<OrbState, OrbConfig> = {
  idle: {
    particleCount: 40,
    ringCount: 3,
    pulseSpeed: 0.003,
    orbitSpeed: 0.002,
    glowIntensity: 0.12,
    coreScale: 1,
    particleSpread: 1,
  },
  hover: {
    particleCount: 40,
    ringCount: 3,
    pulseSpeed: 0.005,
    orbitSpeed: 0.004,
    glowIntensity: 0.22,
    coreScale: 1.04,
    particleSpread: 1.05,
  },
  listening: {
    particleCount: 55,
    ringCount: 4,
    pulseSpeed: 0.008,
    orbitSpeed: 0.006,
    glowIntensity: 0.35,
    coreScale: 1.08,
    particleSpread: 1.12,
  },
  processing: {
    particleCount: 60,
    ringCount: 5,
    pulseSpeed: 0.015,
    orbitSpeed: 0.012,
    glowIntensity: 0.45,
    coreScale: 1.06,
    particleSpread: 1.2,
  },
  rendering: {
    particleCount: 65,
    ringCount: 4,
    pulseSpeed: 0.01,
    orbitSpeed: 0.008,
    glowIntensity: 0.55,
    coreScale: 1.15,
    particleSpread: 1.4,
  },
  ready: {
    particleCount: 30,
    ringCount: 2,
    pulseSpeed: 0.003,
    orbitSpeed: 0.002,
    glowIntensity: 0.14,
    coreScale: 0.92,
    particleSpread: 0.85,
  },
}

/* Particle type for the orb field */
interface Particle {
  angle: number
  radius: number
  baseRadius: number
  speed: number
  size: number
  opacity: number
  hue: number // 0=cyan, 1=blue, 2=violet
}

/* Ring type for orbiting arcs */
interface Ring {
  angle: number
  speed: number
  radius: number
  arcLength: number
  width: number
  opacity: number
  hue: number
}

interface NeuralOrbProps {
  state: OrbState
  size?: number
  onHover?: () => void
  onLeave?: () => void
  onClick?: () => void
  className?: string
}

export function NeuralOrb({
  state,
  size = 220,
  onHover,
  onLeave,
  onClick,
  className,
}: NeuralOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const ringsRef = useRef<Ring[]>([])
  const configRef = useRef<OrbConfig>(STATE_CONFIGS.idle)
  const targetConfigRef = useRef<OrbConfig>(STATE_CONFIGS.idle)
  const timeRef = useRef(0)

  /* Colors mapped to orb accents */
  const COLORS = [
    [6, 182, 212],    // cyan
    [59, 130, 246],   // blue
    [139, 92, 246],   // violet
    [96, 165, 250],   // light blue
  ]

  /* Initialize particles */
  const initParticles = useCallback((count: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 30 + Math.random() * 60,
        baseRadius: 30 + Math.random() * 60,
        speed: (Math.random() - 0.5) * 0.008,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.floor(Math.random() * COLORS.length),
      })
    }
    return particles
  }, [])

  /* Initialize rings */
  const initRings = useCallback((count: number) => {
    const rings: Ring[] = []
    for (let i = 0; i < count; i++) {
      rings.push({
        angle: (Math.PI * 2 * i) / count,
        speed: 0.003 + Math.random() * 0.004,
        radius: 50 + i * 16,
        arcLength: 0.8 + Math.random() * 1.2,
        width: 0.5 + Math.random() * 0.8,
        opacity: 0.08 + Math.random() * 0.12,
        hue: i % COLORS.length,
      })
    }
    return rings
  }, [])

  /* Smoothly interpolate config values */
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  /* Canvas render loop */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)

    particlesRef.current = initParticles(65)
    ringsRef.current = initRings(5)

    const cx = size / 2
    const cy = size / 2

    const draw = () => {
      timeRef.current += 1
      const t = timeRef.current

      /* Smooth config transition */
      const target = targetConfigRef.current
      const current = configRef.current
      const lerpT = 0.06
      configRef.current = {
        particleCount: Math.round(lerp(current.particleCount, target.particleCount, lerpT)),
        ringCount: Math.round(lerp(current.ringCount, target.ringCount, lerpT)),
        pulseSpeed: lerp(current.pulseSpeed, target.pulseSpeed, lerpT),
        orbitSpeed: lerp(current.orbitSpeed, target.orbitSpeed, lerpT),
        glowIntensity: lerp(current.glowIntensity, target.glowIntensity, lerpT),
        coreScale: lerp(current.coreScale, target.coreScale, lerpT),
        particleSpread: lerp(current.particleSpread, target.particleSpread, lerpT),
      }

      const cfg = configRef.current
      ctx.clearRect(0, 0, size, size)

      /* ── Core glow (radial gradient) ── */
      const pulse = Math.sin(t * cfg.pulseSpeed) * 0.3 + 0.7
      const coreR = 28 * cfg.coreScale

      // Outer ambient glow
      const ambientGrad = ctx.createRadialGradient(cx, cy, coreR * 0.5, cx, cy, coreR * 3.5)
      ambientGrad.addColorStop(0, `rgba(59,130,246,${cfg.glowIntensity * pulse * 0.3})`)
      ambientGrad.addColorStop(0.4, `rgba(139,92,246,${cfg.glowIntensity * pulse * 0.15})`)
      ambientGrad.addColorStop(1, `rgba(139,92,246,0)`)
      ctx.fillStyle = ambientGrad
      ctx.fillRect(0, 0, size, size)

      // Inner core gradient
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      coreGrad.addColorStop(0, `rgba(147,197,253,${0.3 * pulse * cfg.glowIntensity * 2})`)
      coreGrad.addColorStop(0.3, `rgba(59,130,246,${0.2 * pulse * cfg.glowIntensity * 2})`)
      coreGrad.addColorStop(0.6, `rgba(139,92,246,${0.12 * pulse * cfg.glowIntensity * 2})`)
      coreGrad.addColorStop(1, `rgba(139,92,246,0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.fill()

      // Bright core center
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 0.5)
      innerGrad.addColorStop(0, `rgba(224,242,254,${0.4 * pulse})`)
      innerGrad.addColorStop(0.5, `rgba(147,197,253,${0.15 * pulse})`)
      innerGrad.addColorStop(1, `rgba(59,130,246,0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, coreR * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = innerGrad
      ctx.fill()

      /* ── Orbiting rings ── */
      for (let i = 0; i < cfg.ringCount && i < ringsRef.current.length; i++) {
        const ring = ringsRef.current[i]
        ring.angle += ring.speed * (cfg.orbitSpeed / 0.003)
        const color = COLORS[ring.hue]
        const ringPulse = Math.sin(t * 0.005 + i * 0.8) * 0.3 + 0.7

        ctx.beginPath()
        ctx.arc(
          cx, cy,
          ring.radius * cfg.coreScale,
          ring.angle,
          ring.angle + ring.arcLength,
          false
        )
        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${ring.opacity * ringPulse * (cfg.glowIntensity / 0.12)})`
        ctx.lineWidth = ring.width
        ctx.lineCap = "round"
        ctx.stroke()
      }

      /* ── Particle field ── */
      for (let i = 0; i < cfg.particleCount && i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]
        p.angle += p.speed * (cfg.orbitSpeed / 0.002)
        p.radius = p.baseRadius * cfg.particleSpread + Math.sin(t * 0.004 + i) * 4

        const px = cx + Math.cos(p.angle) * p.radius
        const py = cy + Math.sin(p.angle) * p.radius
        const color = COLORS[p.hue]
        const pPulse = Math.sin(t * 0.006 + i * 0.5) * 0.3 + 0.7

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${p.opacity * pPulse * (cfg.glowIntensity / 0.15)})`
        ctx.fill()
      }

      /* ── Connection lines between nearby particles ── */
      for (let i = 0; i < Math.min(cfg.particleCount, particlesRef.current.length); i++) {
        const pi = particlesRef.current[i]
        const pix = cx + Math.cos(pi.angle) * pi.radius
        const piy = cy + Math.sin(pi.angle) * pi.radius

        for (let j = i + 1; j < Math.min(cfg.particleCount, particlesRef.current.length); j++) {
          const pj = particlesRef.current[j]
          const pjx = cx + Math.cos(pj.angle) * pj.radius
          const pjy = cy + Math.sin(pj.angle) * pj.radius
          const dist = Math.sqrt((pix - pjx) ** 2 + (piy - pjy) ** 2)

          if (dist < 45) {
            ctx.beginPath()
            ctx.moveTo(pix, piy)
            ctx.lineTo(pjx, pjy)
            ctx.strokeStyle = `rgba(147,197,253,${(1 - dist / 45) * 0.06 * (cfg.glowIntensity / 0.12)})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      /* ── Scanning arc (processing state emphasis) ── */
      if (cfg.pulseSpeed > 0.01) {
        const scanAngle = t * 0.02
        const scanGrad = ctx.createConicGradient(scanAngle, cx, cy)
        scanGrad.addColorStop(0, `rgba(59,130,246,${0.08 * cfg.glowIntensity})`)
        scanGrad.addColorStop(0.15, `rgba(139,92,246,${0.04 * cfg.glowIntensity})`)
        scanGrad.addColorStop(0.3, "rgba(139,92,246,0)")
        scanGrad.addColorStop(1, "rgba(139,92,246,0)")

        ctx.beginPath()
        ctx.arc(cx, cy, 85 * cfg.coreScale, 0, Math.PI * 2)
        ctx.fillStyle = scanGrad
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [size, initParticles, initRings])

  /* Update target config on state change */
  useEffect(() => {
    targetConfigRef.current = STATE_CONFIGS[state]
  }, [state])

  /* State label */
  const stateLabels: Record<OrbState, string> = {
    idle: "System Awake",
    hover: "Ready",
    listening: "Listening",
    processing: "Processing",
    rendering: "Staging",
    ready: "Docked",
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className || ""}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Archio Command Core - ${stateLabels[state]}`}
    >
      {/* Outer ambient glow (CSS layer for added depth) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 1.6,
          height: size * 1.6,
        }}
        animate={{
          boxShadow: [
            `0 0 ${60 * STATE_CONFIGS[state].glowIntensity}px rgba(59,130,246,${STATE_CONFIGS[state].glowIntensity * 0.3}), 0 0 ${120 * STATE_CONFIGS[state].glowIntensity}px rgba(139,92,246,${STATE_CONFIGS[state].glowIntensity * 0.15})`,
            `0 0 ${80 * STATE_CONFIGS[state].glowIntensity}px rgba(59,130,246,${STATE_CONFIGS[state].glowIntensity * 0.4}), 0 0 ${160 * STATE_CONFIGS[state].glowIntensity}px rgba(139,92,246,${STATE_CONFIGS[state].glowIntensity * 0.2})`,
            `0 0 ${60 * STATE_CONFIGS[state].glowIntensity}px rgba(59,130,246,${STATE_CONFIGS[state].glowIntensity * 0.3}), 0 0 ${120 * STATE_CONFIGS[state].glowIntensity}px rgba(139,92,246,${STATE_CONFIGS[state].glowIntensity * 0.15})`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 cursor-pointer"
        style={{ width: size, height: size }}
      />

      {/* State indicator */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: state === "processing" || state === "rendering"
              ? `rgba(${ACCENT.blue.rgb},0.8)`
              : state === "listening"
              ? `rgba(${ACCENT.cyan.rgb},0.8)`
              : `rgba(${ACCENT.purple.rgb},0.5)`,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span
          className="text-[9px] font-mono uppercase tracking-[0.2em] font-semibold"
          style={{
            color: state === "processing" || state === "rendering"
              ? `rgba(${ACCENT.blue.rgb},0.6)`
              : state === "listening"
              ? `rgba(${ACCENT.cyan.rgb},0.6)`
              : `rgba(${ACCENT.purple.rgb},0.4)`,
          }}
        >
          {stateLabels[state]}
        </span>
      </motion.div>
    </div>
  )
}
