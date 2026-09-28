"use client"

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════════════════════
   NEURAL LIGHT ADVANCED EFFECTS SYSTEM
   
   Ultra-premium interactive effects exclusively for Neural Light theme:
   - Mouse-reactive holographic particles (brain synapse simulation)
   - Breathing ambient animations
   - Advanced glassmorphism with depth layers
   - Micro-interactions on every element
   - Color-shifting gradients based on mouse position
   - Floating geometric elements
   - Parallax depth system
   ═══════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────
   1. MOUSE-REACTIVE PARTICLE FIELD (Synapse Simulation)
   Simulates neural connections that react to cursor proximity
   ───────────────────────────────────────────────────────────────────────── */

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  depth: number // 0-1, for parallax
}

export function NeuralParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Refined particle palette — sophisticated purples + neutral grays
    const colors = [
      "#6D5BD0", // primary purple
      "#8B7FD8", // soft lavender
      "#7B8FE0", // periwinkle
      "#A7B0CC", // gray-blue (neutral)
      "#B8A9F0", // light purple
      "rgba(15,15,20,0.25)", // dark gray dots for contrast
    ]

    particlesRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      depth: Math.random(),
    }))

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Update and draw particles
      particles.forEach((p) => {
        // Mouse repulsion (stronger for closer particles)
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const forceRadius = 200 * p.depth // depth affects influence
        
        if (dist < forceRadius && dist > 0) {
          const force = (forceRadius - dist) / forceRadius
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force * 0.5
          p.vy += Math.sin(angle) * force * 0.5
        }

        // Apply velocity with friction
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.95
        p.vy *= 0.95

        // Boundary wrapping
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle (size based on depth - closer = larger)
        const renderSize = p.size * (0.5 + p.depth * 0.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.6 * p.depth // depth affects opacity
        ctx.fill()

        // Draw connections to nearby particles (synapse simulation)
        particles.forEach((p2) => {
          if (p2.id <= p.id) return
          const dx2 = p.x - p2.x
          const dy2 = p.y - p2.y
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
          
          // Only connect same-depth particles within range
          if (dist2 < 120 && Math.abs(p.depth - p2.depth) < 0.2) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = p.color
            ctx.globalAlpha = (1 - dist2 / 120) * 0.15 * p.depth
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      ctx.globalAlpha = 1
      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2, mixBlendMode: "normal" }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   2. FLOATING GEOMETRIC ELEMENTS (Ambient Decoration)
   Soft geometric shapes that float and rotate
   ───────────────────────────────────────────────────────────────────────── */

export function FloatingGeometry() {
  // Refined: muted purples + neutral grays. Larger blur for dreamy effect.
  const shapes = [
    { color: "#6D5BD0", size: 220, top: "10%", left: "6%",  duration: 32, rotate:  360 },
    { color: "#8B7FD8", size: 280, top: "62%", right: "8%", duration: 38, rotate: -360 },
    { color: "#7B8FE0", size: 180, top: "38%", left: "82%", duration: 28, rotate:  360 },
    { color: "#A7B0CC", size: 200, top: "76%", left: "22%", duration: 34, rotate: -360 },
    { color: "#B8A9F0", size: 140, top: "16%", right: "26%", duration: 26, rotate:  360 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle, ${shape.color}10 0%, ${shape.color}03 50%, transparent 70%)`,
            filter: "blur(60px)",
            opacity: 0.55,
            top: shape.top,
            left: shape.left,
            right: shape.right,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, shape.rotate],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   3. ENHANCED GLASS CARD with Micro-interactions
   Premium card wrapper with advanced hover effects
   ───────────────────────────────────────────────────────────────────────── */

interface EnhancedCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  depth?: number // 0-1, parallax depth
}

export function EnhancedCard({ children, className = "", glowColor = "#6D5BD0", depth = 0.5 }: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 25 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, z: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Multi-layer glass effect */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {/* Base glass */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(32px) saturate(140%)",
            WebkitBackdropFilter: "blur(32px) saturate(140%)",
          }}
        />
        
        {/* Shimmer gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${glowColor}08 0%, transparent 50%, ${glowColor}12 100%)`,
          }}
          animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Top highlight (light source simulation) */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}40, transparent)`,
          }}
        />
        
        {/* Hover glow */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: `
                  0 0 30px ${glowColor}30,
                  0 0 60px ${glowColor}20,
                  inset 0 0 30px ${glowColor}10
                `,
              }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Border with gradient */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          padding: "1px",
          background: `linear-gradient(135deg, ${glowColor}30, ${glowColor}10, ${glowColor}25)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10" style={{ transform: `translateZ(${depth * 30}px)` }}>
        {children}
      </div>
      
      {/* Floating particles on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: glowColor,
                  left: `${20 + i * 15}%`,
                  bottom: "10%",
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: -80,
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   4. HOLOGRAPHIC TEXT with Color Shifting
   Text that shifts colors based on viewport position
   ───────────────────────────────────────────────────────────────────────── */

interface HolographicTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
}

export function HolographicText({ 
  children, 
  className = "", 
  colors = ["#0F0F14", "#6D5BD0", "#0F0F14"]  // dark → purple → dark for sophisticated shift
}: HolographicTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [gradientAngle, setGradientAngle] = useState(45)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return
      const rect = textRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
      setGradientAngle(angle)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${colors.join(", ")})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        transition: "background 0.3s ease-out",
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   5. BREATHING AMBIENT LIGHT (Background Pulse)
   Subtle pulsing ambient light effect
   ───────────────────────────────────────────────────────────────────────── */

export function BreathingAmbient() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Central breathing light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(157,78,221,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Corner accents */}
      <motion.div
        className="absolute top-0 left-0"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle at top left, rgba(109,91,208,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle at bottom right, rgba(123,143,224,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   6. NEURAL GRID OVERLAY (Subtle Grid Pattern)
   Animated grid that simulates neural network structure
   ───────────────────────────────────────────────────────────────────────── */

export function NeuralGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <svg width="100%" height="100%" className="opacity-[0.12]">
        <defs>
          <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="url(#neural-gradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
            />
          </pattern>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F0F14" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6D5BD0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0F0F14" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#neural-grid)" />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   7. CURSOR TRAIL EFFECT (Holographic Cursor Trail)
   Leaves a fading trail behind the cursor
   ───────────────────────────────────────────────────────────────────────── */

interface TrailDot {
  id: number
  x: number
  y: number
  timestamp: number
}

export function CursorTrail() {
  const [dots, setDots] = useState<TrailDot[]>([])
  const dotIdRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newDot: TrailDot = {
        id: dotIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      }
      
      setDots((prev) => [...prev, newDot].slice(-20)) // Keep last 20 dots
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Cleanup old dots
    const interval = setInterval(() => {
      setDots((prev) => prev.filter((d) => Date.now() - d.timestamp < 1000))
    }, 50)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {dots.map((dot, i) => {
        const age = Date.now() - dot.timestamp
        const opacity = Math.max(0, 1 - age / 1000)
        const scale = 1 - age / 1500
        const color = ["#6D5BD0", "#8B7FD8", "#7B8FE0"][i % 3]
        
        return (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: dot.x - 4,
              top: dot.y - 4,
              width: 8,
              height: 8,
              background: color,
              opacity,
              scale,
              filter: "blur(2px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale, opacity }}
            exit={{ scale: 0, opacity: 0 }}
          />
        )
      })}
    </div>
  )
}
