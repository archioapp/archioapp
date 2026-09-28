"use client"

import type React from "react"

import { useEffect, useRef, useState, type ReactNode } from "react"

// Hoverboard container with magnetic effects
export function HoverboardContainer({
  children,
  className = "",
  intensity = 1,
  magneticRange = 100,
}: {
  children: ReactNode
  className?: string
  intensity?: number
  magneticRange?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance < magneticRange) {
        const force = (magneticRange - distance) / magneticRange
        const moveX = (deltaX * force * intensity) / 10
        const moveY = (deltaY * force * intensity) / 10

        setMousePosition({ x: moveX, y: moveY })
        setIsHovering(true)
      } else {
        setMousePosition({ x: 0, y: 0 })
        setIsHovering(false)
      }
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 })
      setIsHovering(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [intensity, magneticRange])

  return (
    <div
      ref={containerRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) ${
          isHovering ? "scale(1.02)" : "scale(1)"
        }`,
      }}
    >
      {children}
    </div>
  )
}

// Floating particle effect
export function FloatingParticles({ count = 20, color = "#8b5cf6" }: { count?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      life: number
    }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      life: Math.random() * 100 + 50,
    }))

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.5

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Reset particle if life is over
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.life = Math.random() * 100 + 50
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity * (particle.life / 100)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [count, color])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30" />
}

// Ripple effect on click
export function RippleEffect({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const createRipple = (e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
    }, 600)
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} onClick={createRipple}>
      {children}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-0 h-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: "0.6s" }} />
        </div>
      ))}
    </div>
  )
}

// Glow effect that follows mouse
export function GlowTracker({ children, glowColor = "#8b5cf6" }: { children: ReactNode; glowColor?: string }) {
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      setGlowPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {children}
      <div
        className={`absolute pointer-events-none transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: glowPosition.x,
          top: glowPosition.y,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          width: "200px",
          height: "200px",
        }}
      />
    </div>
  )
}

// Morphing background effect
export function MorphingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create morphing gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time) * 100,
        canvas.height / 2 + Math.cos(time * 0.7) * 80,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2,
      )

      gradient.addColorStop(0, `hsla(${(time * 20) % 360}, 70%, 60%, 0.1)`)
      gradient.addColorStop(0.5, `hsla(${(time * 15 + 60) % 360}, 70%, 50%, 0.05)`)
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

// Pulse animation for important elements
export function PulseGlow({
  children,
  color = "#8b5cf6",
  intensity = 1,
}: { children: ReactNode; color?: string; intensity?: number }) {
  return (
    <div
      className="relative"
      style={{
        filter: `drop-shadow(0 0 ${8 * intensity}px ${color}40)`,
        animation: `pulse-glow-${intensity} 2s ease-in-out infinite alternate`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes pulse-glow-${intensity} {
          0% {
            filter: drop-shadow(0 0 ${4 * intensity}px ${color}40);
          }
          100% {
            filter: drop-shadow(0 0 ${12 * intensity}px ${color}60);
          }
        }
      `}</style>
    </div>
  )
}
