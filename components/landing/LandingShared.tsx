"use client"

/* =====================================================================
   LANDING SHARED UTILITIES
   Shared design primitives for the ArchioAI cinematic landing page.
   Color system, atmospheric particles, glow effects, motion helpers.
   ===================================================================== */

import { useEffect, useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"

/* ---------- Color System ---------- */

export const PALETTE = {
  // Chaos states (Scenes 1-6)
  chaosBackground: "#05050a",
  chaosBackgroundDeep: "#020205",
  chaosRed: "#ef4444",
  chaosRedGlow: "rgba(239,68,68,0.18)",
  chaosOrange: "#f59e0b",
  chaosPurple: "#a855f7",
  chaosCrimson: "#dc2626",

  // Transition (Scenes 6-7)
  transitionPurple: "#8b5cf6",
  transitionPurpleGlow: "rgba(139,92,246,0.22)",
  transitionMagenta: "#c026d3",

  // Resolution (Scenes 7-11)
  resolutionCyan: "#06b6d4",
  resolutionCyanGlow: "rgba(6,182,212,0.2)",
  resolutionTeal: "#14b8a6",
  resolutionGreen: "#10b981",
  resolutionMint: "#34d399",
  resolutionSky: "#38bdf8",

  // Neutrals
  ink: "#f8fafc",
  inkSoft: "#e2e8f0",
  inkMuted: "#94a3b8",
  inkDim: "#64748b",
  inkFaint: "#475569",
  surface: "rgba(30,30,45,0.55)",
  surfaceHigh: "rgba(40,40,60,0.75)",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.12)",
} as const

/* ---------- Ambient Particle Field ---------- */

type ParticleFieldProps = {
  density?: number
  hue?: string
  speed?: number
  opacity?: number
  className?: string
}

export function ParticleField({
  density = 80,
  hue = "rgba(139,92,246,0.5)",
  speed = 0.3,
  opacity = 1,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number }
    const rect0 = canvas.getBoundingClientRect()
    const particles: P[] = Array.from({ length: density }, () => ({
      x: Math.random() * rect0.width,
      y: Math.random() * rect0.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.7 + 0.2,
    }))

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > rect.width) p.vx *= -1
        if (p.y < 0 || p.y > rect.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = hue.replace(/[\d.]+\)$/, `${p.a * opacity})`)
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [density, hue, speed, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  )
}

/* ---------- Grid Backdrop ---------- */

export function GridBackdrop({
  color = "rgba(139,92,246,0.08)",
  spacing = 64,
  opacity = 1,
  perspective = false,
}: {
  color?: string
  spacing?: number
  opacity?: number
  perspective?: boolean
}) {
  const bgImage = `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: bgImage,
        backgroundSize: `${spacing}px ${spacing}px`,
        maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        transform: perspective ? "perspective(800px) rotateX(55deg) translateY(20%) scale(1.5)" : undefined,
        transformOrigin: perspective ? "center bottom" : undefined,
      }}
    />
  )
}

/* ---------- Aurora Layer ---------- */

export function AuroraLayer({
  tones,
  opacity = 0.6,
  blur = 120,
}: {
  tones: [string, string, string]
  opacity?: number
  blur?: number
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${tones[0]} 0%, transparent 60%)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${tones[1]} 0%, transparent 60%)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
        animate={{ x: [0, -50, 40, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[50%] h-[50%] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${tones[2]} 0%, transparent 55%)`,
          filter: `blur(${blur * 0.7}px)`,
          opacity: opacity * 0.6,
        }}
        animate={{ x: [0, 30, -40, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

/* ---------- Scene Container ---------- */

type SceneProps = {
  children: ReactNode
  id: string
  height?: string
  className?: string
  background?: string
  pin?: boolean
}

export function Scene({
  children,
  id,
  height = "200vh",
  className = "",
  background,
  pin = true,
}: SceneProps) {
  return (
    <section id={id} className={`relative w-full ${className}`} style={{ height, background }}>
      {pin ? (
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

/* ---------- Split Word Reveal ---------- */

type SplitWordProps = {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

export function SplitWord({ text, className = "", delay = 0, stagger = 0.04 }: SplitWordProps) {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0, filter: "blur(12px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

/* ---------- Glow Orb ---------- */

export function GlowOrb({
  color = PALETTE.transitionPurple,
  size = 400,
  intensity = 0.4,
  className = "",
  style = {},
}: {
  color?: string
  size?: number
  intensity?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 65%)`,
        opacity: intensity,
        filter: "blur(40px)",
        ...style,
      }}
    />
  )
}

/* ---------- Ticker Tape ---------- */

export function TickerTape({
  items,
  direction = 1,
  speed = 40,
  className = "",
}: {
  items: string[]
  direction?: 1 | -1
  speed?: number
  className?: string
}) {
  const track = [...items, ...items, ...items]
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: direction === 1 ? ["0%", "-33.333%"] : ["-33.333%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="text-[11px] tracking-[0.2em] uppercase font-mono"
            style={{ color: PALETTE.inkDim }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------- Easing ---------- */

export const EASE = {
  smooth: [0.22, 1, 0.36, 1] as const,
  inOut: [0.43, 0.13, 0.23, 0.96] as const,
  power: [0.16, 1, 0.3, 1] as const,
}

export function useProgressTransform<T>(
  progress: MotionValue<number>,
  input: number[],
  output: T[],
) {
  return useTransform(progress, input, output as any)
}

export function useSceneProgress(ref: React.RefObject<HTMLElement>): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  return scrollYProgress
}

/* ---------- Scroll Indicator ---------- */

export function ScrollIndicator({ label = "SCROLL" }: { label?: string }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      <span className="text-[10px] tracking-[0.4em] font-mono" style={{ color: PALETTE.inkMuted }}>
        {label}
      </span>
      <motion.div
        className="w-px h-12"
        style={{
          background: `linear-gradient(to bottom, ${PALETTE.transitionPurple}, transparent)`,
        }}
        animate={{ scaleY: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

/* ---------- Chapter Marker ---------- */

export function ChapterMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="absolute top-12 left-12 flex items-center gap-4 pointer-events-none z-20">
      <div
        className="px-3 py-1 border text-[10px] tracking-[0.3em] font-mono"
        style={{
          borderColor: PALETTE.borderStrong,
          color: PALETTE.inkDim,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
        }}
      >
        {number}
      </div>
      <div
        className="text-[11px] tracking-[0.3em] font-mono uppercase"
        style={{ color: PALETTE.inkMuted }}
      >
        {label}
      </div>
    </div>
  )
}
