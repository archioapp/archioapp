"use client"

/* ═══════════════════════════════════════════════════════════════════════════════════
   OBSIDIAN GLASS EFFECTS — Ultra-Premium Animation & UI System
   
   The most detailed effects file in the entire system. Inspired by Apple Vision
   Pro, premium cinema dashboards, and luxury Linear-quality interfaces.
   
   ── EFFECT MODULES ──
   1.  ObsidianAtmosphere      — Multi-layer atmospheric fog with parallax depth
   2.  GrainOverlay             — Animated film grain noise texture (procedural SVG)
   3.  LightLeakBeams           — Cinematic diagonal light beams that drift
   4.  GlassDustParticles       — Floating glass dust with cursor-reactive physics
   5.  CursorLightFollow        — Soft light orb that follows cursor with lag
   6.  AmbientGlassOrbs         — Large blurred orbs that breathe & rotate
   7.  HoloEdgeShimmer          — Subtle holographic edge animation on cards
   8.  LiquidGlassCard          — Premium card with light refraction & 3D tilt
   9.  PulsePing                — Status indicator with concentric ripples
   10. DepthFog                 — Atmospheric fog at viewport edges
   11. ScanLineSweep            — Cinematic horizontal scan line
   12. RippleClickEffect        — Material-style ripple on click
   13. ChromaticAberration      — RGB split shimmer on text
   14. BackdropGrid             — Animated dot/grid pattern in background
   ═══════════════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

/* ═══════════════════════════════════════════════════════════════════════════════════
   1. OBSIDIAN ATMOSPHERE — Multi-layer fog/gradient world plane
   Three deep gradient layers that drift independently for parallax depth.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function ObsidianAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Layer 1: Deep base gradient — top light reduced 70% */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(40,40,50,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,20,28,0.40) 0%, transparent 60%),
            linear-gradient(180deg, #0A0A0C 0%, #0F0F12 50%, #0A0A0C 100%)
          `,
        }}
      />

      {/* Layer 2: Slow-drifting top bloom (warm) — reduced 70% */}
      <motion.div
        className="absolute"
        style={{
          top: -400, left: "30%",
          width: 1200, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,148,106,0.018) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 30, -20, 0],
          opacity: [0.12, 0.21, 0.15, 0.12],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 3: Cool side bloom */}
      <motion.div
        className="absolute"
        style={{
          top: "30%", right: -300,
          width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(138,138,152,0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -60, 20, 0],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 4: Bottom subtle glow */}
      <motion.div
        className="absolute"
        style={{
          bottom: -300, left: "20%",
          width: 1000, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,200,208,0.05) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          opacity: [0.2, 0.5, 0.3, 0.2],
          scale: [0.95, 1.05, 0.98, 0.95],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   2. GRAIN OVERLAY — Procedural SVG noise for premium film texture
   Uses turbulence filter for organic noise. Applied at low opacity.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function GrainOverlay({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none mix-blend-overlay"
      style={{ zIndex: 50, opacity }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="obsidianNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#obsidianNoise)" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   3. LIGHT LEAK BEAMS — Cinematic diagonal beams that drift slowly
   Inspired by film light leaks and lens flares.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function LightLeakBeams() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Beam 1: top-left to bottom-right */}
      <motion.div
        className="absolute"
        style={{
          top: "-20%", left: "-10%",
          width: "120%", height: 6,
          background: "linear-gradient(90deg, transparent 0%, rgba(245,245,247,0.08) 50%, transparent 100%)",
          transform: "rotate(15deg)",
          filter: "blur(8px)",
        }}
        animate={{
          x: [-200, 200, -200],
          opacity: [0, 0.6, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Beam 2: warm tint */}
      <motion.div
        className="absolute"
        style={{
          top: "30%", left: "-10%",
          width: "120%", height: 4,
          background: "linear-gradient(90deg, transparent 0%, rgba(184,148,106,0.10) 50%, transparent 100%)",
          transform: "rotate(-8deg)",
          filter: "blur(6px)",
        }}
        animate={{
          x: [200, -200, 200],
          opacity: [0, 0.5, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Beam 3: subtle vertical */}
      <motion.div
        className="absolute"
        style={{
          top: "-10%", left: "60%",
          width: 3, height: "120%",
          background: "linear-gradient(180deg, transparent 0%, rgba(245,245,247,0.06) 50%, transparent 100%)",
          filter: "blur(4px)",
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   4. GLASS DUST PARTICLES — Floating glass dust with cursor-reactive repulsion
   Canvas-based particle system with physics simulation.
   ═══════════════════════════════════════════════════════════════════════════════════ */

interface DustParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
  hue: number  // 0-360 for slight color variation
  depth: number  // parallax layer
}

export function GlassDustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<DustParticle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize 90 dust particles with depth layers
    particlesRef.current = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.8 + 0.4,
      opacity: 0,
      baseOpacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * 30 - 15, // -15 to +15 around white
      depth: Math.random(),
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        // Cursor repulsion
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repulseRadius = 140

        if (dist < repulseRadius) {
          const force = (1 - dist / repulseRadius) * 0.8 * p.depth
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          p.opacity = Math.min(p.opacity + 0.02, p.baseOpacity * 2)
        } else {
          p.opacity = p.opacity * 0.96 + p.baseOpacity * 0.04
        }

        // Physics damping
        p.vx *= 0.96
        p.vy *= 0.96

        // Drift
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        // Render with hue variation
        const tint = p.hue >= 0 ? 245 : 200
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.5 + p.depth * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${tint}, ${tint}, ${tint + 8}, ${p.opacity})`
        ctx.shadowBlur = 4
        ctx.shadowColor = `rgba(245,245,247,${p.opacity * 0.5})`
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   5. CURSOR LIGHT FOLLOW — Soft glowing orb that lags behind cursor
   Creates a premium "light following you" effect.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function CursorLightFollow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Smoother, softer spring — heavier damping, lower stiffness for cinematic lag
  const springX = useSpring(x, { damping: 40, stiffness: 60, mass: 1.2 })
  const springY = useSpring(y, { damping: 40, stiffness: 60, mass: 1.2 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX - 200)
      y.set(e.clientY - 200)
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [x, y])

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        x: springX,
        y: springY,
        width: 400,
        height: 400,
        borderRadius: "50%",
        // Reduced 50%: 0.06 → 0.03, 0.02 → 0.01
        background: "radial-gradient(circle, rgba(245,245,247,0.03) 0%, rgba(245,245,247,0.01) 30%, transparent 70%)",
        filter: "blur(48px)",
        zIndex: 3,
      }}
      aria-hidden="true"
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   6. AMBIENT GLASS ORBS — Large breathing orbs with rotation
   Premium decorative elements with multi-axis animation.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function AmbientGlassOrbs() {
  const orbs = [
    { size: 300, top: "8%",  left: "4%",   color: "rgba(200,200,208,0.04)", duration: 28, delay: 0 },
    { size: 380, top: "55%", right: "6%",  color: "rgba(184,148,106,0.04)", duration: 36, delay: 3 },
    { size: 260, top: "30%", left: "78%",  color: "rgba(138,138,152,0.05)", duration: 24, delay: 6 },
    { size: 340, top: "75%", left: "20%",  color: "rgba(245,245,247,0.03)", duration: 32, delay: 9 },
    { size: 220, top: "15%", right: "30%", color: "rgba(200,200,208,0.04)", duration: 26, delay: 12 },
    { size: 180, top: "85%", right: "45%", color: "rgba(184,148,106,0.03)", duration: 30, delay: 15 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1],
            opacity: [0.4, 0.7, 0.5, 0.4],
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   7. HOLO EDGE SHIMMER — Subtle holographic edge that travels around cards
   Animated conic-gradient that rotates slowly.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function HoloEdgeShimmer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, rgba(245,245,247,0.10) 25%, transparent 50%, rgba(184,148,106,0.08) 75%, transparent 100%)",
          padding: 1,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        } as CSSProperties}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   8. LIQUID GLASS CARD — Premium glass card with light refraction & 3D tilt
   - Mouse-tracking 3D rotation (rotateX/rotateY)
   - Light refraction follows cursor inside card
   - Animated edge highlight (top-down light source)
   - Backdrop blur with saturate boost
   - Inner shadow for depth
   - Holographic edge shimmer
   ═══════════════════════════════════════════════════════════════════════════════════ */

interface LiquidGlassCardProps {
  children: ReactNode
  className?: string
  intensity?: number  // 0-1 multiplier for tilt
  glowColor?: string
}

export function LiquidGlassCard({
  children,
  className = "",
  intensity = 0.4,
  glowColor = "rgba(255,255,255,0.06)",
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  // One-shot shimmer state: only fires on enter and leave transitions.
  const [shimmerKey, setShimmerKey] = useState<{ phase: "idle" | "enter" | "leave"; id: number }>({
    phase: "idle",
    id: 0,
  })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Heavier damping = ultra-smooth, less jittery motion (matches reference's calm feel)
  const smoothMouseX = useSpring(mouseX, { damping: 42, stiffness: 90, mass: 0.85 })
  const smoothMouseY = useSpring(mouseY, { damping: 42, stiffness: 90, mass: 0.85 })

  // Very subtle 3D tilt — reference shows only mild parallax, never exaggerated
  const rotateX = useTransform(smoothMouseY, [0, 1], [2 * intensity, -2 * intensity])
  const rotateY = useTransform(smoothMouseX, [0, 1], [-2 * intensity, 2 * intensity])

  const lightX = useTransform(smoothMouseX, [0, 1], ["0%", "100%"])
  const lightY = useTransform(smoothMouseY, [0, 1], ["0%", "100%"])

  const refractionBackground = useTransform(
    [lightX, lightY],
    ([x, y]: any) =>
      // Reduced 0.06 → 0.030 — much subtler cursor light, like reference
      `radial-gradient(circle 280px at ${x} ${y}, rgba(255,255,255,0.030) 0%, transparent 65%)`,
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1600,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => {
        setHovered(true)
        setShimmerKey((prev) => ({ phase: "enter", id: prev.id + 1 }))
      }}
      onMouseLeave={() => {
        setHovered(false)
        mouseX.set(0.5)
        mouseY.set(0.5)
        setShimmerKey((prev) => ({ phase: "leave", id: prev.id + 1 }))
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Outer glow — only visible on hover, very subtle ── */}
      <motion.div
        className="absolute -inset-1.5 rounded-[20px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Main card surface — SOLID dark block matching reference photos ── */}
      <div className="relative rounded-[16px] overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
        {/* Solid base — opaque dark gray (NOT translucent like before) */}
        <div
          className="absolute inset-0"
          style={{ background: "#16161A" }}
        />

        {/* Very subtle top-down highlight — just a hint of light from above */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, transparent 30%, transparent 100%)",
          }}
        />

        {/* Cursor light refraction — only visible on hover, very subtle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: refractionBackground }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Inner border — single soft hairline like the reference photos */}
        <div
          className="absolute inset-0 rounded-[16px] pointer-events-none"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.035)",
          }}
        />

        {/* Content */}
        <div className="relative" style={{ transform: "translateZ(8px)" }}>
          {children}
        </div>
      </div>

      {/* ── ONE-SHOT SHIMMER (enter + leave only, never loops) ── */}
      {shimmerKey.phase !== "idle" && (
        <motion.div
          key={shimmerKey.id}
          className="absolute inset-0 rounded-[16px] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0"
            style={{
              width: "55%",
              // Toned down even more — barely there
              background:
                shimmerKey.phase === "enter"
                  ? "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.045) 50%, transparent 100%)"
                  : "linear-gradient(105deg, transparent 0%, rgba(184,148,106,0.035) 50%, transparent 100%)",
            }}
            initial={{ x: shimmerKey.phase === "enter" ? "-80%" : "100%", opacity: 0 }}
            animate={{
              x: shimmerKey.phase === "enter" ? "180%" : "-180%",
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() =>
              setShimmerKey((prev) => ({ phase: "idle", id: prev.id }))
            }
          />
        </motion.div>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   9. PULSE PING — Premium status indicator with concentric expanding rings
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function PulsePing({ color = "#3DDC84", size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{
          background: color,
          animation: "obsidian-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
      />
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-50"
        style={{
          background: color,
          animation: "obsidian-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
          animationDelay: "0.7s",
        }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: color, boxShadow: `0 0 12px ${color}` }}
      />
      <style jsx>{`
        @keyframes obsidian-ping {
          0% { transform: scale(1); opacity: 0.7; }
          75%, 100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   10. DEPTH FOG — Atmospheric fog at viewport edges (creates infinite depth feel)
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function DepthFog() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 4 }}>
      {/* Top fog */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background: "linear-gradient(180deg, rgba(10,10,12,0.6) 0%, transparent 100%)",
        }}
      />
      {/* Bottom fog */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(0deg, rgba(10,10,12,0.7) 0%, transparent 100%)",
        }}
      />
      {/* Left fog */}
      <div
        className="absolute inset-y-0 left-0 w-32"
        style={{
          background: "linear-gradient(90deg, rgba(10,10,12,0.4) 0%, transparent 100%)",
        }}
      />
      {/* Right fog */}
      <div
        className="absolute inset-y-0 right-0 w-32"
        style={{
          background: "linear-gradient(270deg, rgba(10,10,12,0.4) 0%, transparent 100%)",
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   11. SCAN LINE SWEEP — Cinematic horizontal scan line that drifts across screen
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function ScanLineSweep() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(245,245,247,0.30) 50%, transparent 100%)",
          boxShadow: "0 0 12px rgba(245,245,247,0.20)",
        }}
        initial={{ y: "-10vh" }}
        animate={{ y: "110vh" }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 8,
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   12. BACKDROP GRID — Pure dot-field ambient texture
   ───────────────────────────────────────────────────────────────────────────────────
   Was: a full-viewport SVG <pattern> with vertical + horizontal hairlines that
   ran top-to-bottom across the page. Those vertical hairlines happened to
   visually align with the WEEK STATIONS column gaps (and the WEEKLY ADHERENCE
   day grid), making it look like 7 bright bleed-lines slicing through every
   section of the dashboard.

   Replaced with a CSS radial-gradient dot-field — same intent (subtle ambient
   texture under glass cards), same fixed positioning, same radial vignette
   fade — but no line strokes at all, so there is nothing left to align with
   the day columns. Component name + export shape preserved so consumers
   (`ObsidianGlassWorld` etc.) keep working.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function BackdropGrid() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        // Two stacked radial gradients on a 22×22 tile produce a fine,
        // evenly-spaced dot field. Opacity is intentionally featherweight
        // (~0.07) so the field reads as ambient texture, not as a grid.
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(245,245,247,0.07) 0.8px, transparent 1.2px)",
        backgroundSize: "22px 22px",
        backgroundPosition: "0 0",
        // Vignette mask: full strength in the centre, fading to transparent
        // at the viewport edges, matching the look of the previous SVG mask.
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   13. CHROMATIC SHIMMER TEXT — RGB-split shimmer effect on hover
   ═══════════════════════════════════════════════════════════════════════════════════ */

export function ChromaticShimmerText({
  children,
  className = "",
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className={`relative inline-block ${className}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <>
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{ color: "#FF4D5E", mixBlendMode: "screen" }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: -1.5, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{ color: "#3DDC84", mixBlendMode: "screen" }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 1.5, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {children}
          </motion.span>
        </>
      )}
      <span className="relative">{children}</span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════��═══════════════════════
   14. MASTER WRAPPER — All Obsidian Glass effects in one component
   Drops into YourSpace as a single mount point.
   ═════════════════════════════════════════════════════════════════════���═════════════ */

export function ObsidianGlassWorld() {
  return (
    <>
      <ObsidianAtmosphere />
      <BackdropGrid />
      <AmbientGlassOrbs />
      <LightLeakBeams />
      <GlassDustParticles />
      <CursorLightFollow />
      <ScanLineSweep />
      <DepthFog />
      <GrainOverlay opacity={0.04} />
    </>
  )
}
