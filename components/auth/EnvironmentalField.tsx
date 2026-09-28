"use client"

import { useState, useEffect, useRef } from "react"

interface FieldParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function EnvironmentalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FieldParticle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    contextRef.current = ctx

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    updateCanvasSize()

    // Initialize particles - sparse, intentional placement
    const particles: FieldParticle[] = []
    const particleCount = 12 // Sparse field, not dense
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }
    particlesRef.current = particles

    // Mouse tracking for cursor-reactive behavior
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Clear with subtle fade (trails effect)
      ctx.fillStyle = "rgba(10, 14, 26, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Draw background gradient depth effect
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, "rgba(10, 14, 26, 0)")
      gradient.addColorStop(0.5, "rgba(30, 50, 90, 0.02)")
      gradient.addColorStop(1, "rgba(10, 14, 26, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Apply slight acceleration towards center (gravity well effect)
        const centerX = width / 2
        const centerY = height / 2
        const dx = centerX - particle.x
        const dy = centerY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 50) {
          particle.vx += dx * 0.00001
          particle.vy += dy * 0.00001
        }

        // Cursor attraction (subtle pull)
        const cursorDx = mouseRef.current.x - particle.x
        const cursorDy = mouseRef.current.y - particle.y
        const cursorDistance = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy)

        if (cursorDistance < 150) {
          const pull = (1 - cursorDistance / 150) * 0.00005
          particle.vx += cursorDx * pull
          particle.vy += cursorDy * pull
        }

        // Damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Boundary wrapping with padding
        const padding = 50
        if (particle.x < -padding) particle.x = width + padding
        if (particle.x > width + padding) particle.x = -padding
        if (particle.y < -padding) particle.y = height + padding
        if (particle.y > height + padding) particle.y = -padding

        // Pulse opacity based on proximity to cursor
        const distanceToCursor = Math.sqrt(
          (particle.x - mouseRef.current.x) ** 2 +
            (particle.y - mouseRef.current.y) ** 2
        )
        const basePulse = Math.sin(Date.now() * 0.001 + index) * 0.15 + 0.35
        const cursorInfluence = Math.max(0, 1 - distanceToCursor / 200)
        particle.opacity = basePulse + cursorInfluence * 0.3

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        )
        gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity * 0.8})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, ${particle.opacity * 0.1})`)

        ctx.fillStyle = gradient
        ctx.fillRect(
          particle.x - particle.radius * 3,
          particle.y - particle.radius * 3,
          particle.radius * 6,
          particle.radius * 6
        )

        // Core dot
        ctx.fillStyle = `rgba(100, 150, 255, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw subtle connecting lines between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.1
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw subtle breathing grid lines
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.02 + Math.sin(Date.now() * 0.0005) * 0.01})`
      ctx.lineWidth = 0.5

      // Vertical lines
      for (let x = 0; x < width; x += 100) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < height; y += 100) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      updateCanvasSize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        filter: "blur(0.5px)",
      }}
    />
  )
}
