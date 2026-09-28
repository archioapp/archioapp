"use client"

import { motion } from "framer-motion"
import { useMemo, useCallback, useState, useEffect } from "react"
import { PARTICLES, ACCENT, GRADIENT } from "./mtf-theme"

interface AmbientFieldProps {
  /** Index of hovered card (0,1,2) or null -- glow orbs respond */
  hoveredCard?: number | null
}

/**
 * AmbientField v2 -- Immersive particle background.
 * 12 floating particles, 2 interactive glow orbs, grid dots,
 * noise texture, twinkling stars, and section dividers.
 */
export function AmbientField({ hoveredCard = null }: AmbientFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES.count }).map((_, i) => ({
        id: i,
        x: 5 + ((i * 7.3 + 11) % 90),
        y: 8 + ((i * 13.7 + 5) % 84),
        size: PARTICLES.sizes[i % PARTICLES.sizes.length],
        color: PARTICLES.colors[i % PARTICLES.colors.length],
        duration: 5 + (i % 4) * 1.5,
        delay: i * 0.4,
      })),
    [],
  )

  /* ── Twinkle stars ── */
  const [twinkles, setTwinkles] = useState<{ id: number; x: number; y: number; active: boolean }[]>(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: 12 + ((i * 19 + 7) % 76),
        y: 10 + ((i * 23 + 13) % 80),
        active: false,
      })),
  )

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    twinkles.forEach((t) => {
      const scheduleNext = () => {
        const delay = 4000 + Math.random() * 6000
        const timer = setTimeout(() => {
          setTwinkles((prev) => prev.map((tw) => (tw.id === t.id ? { ...tw, active: true } : tw)))
          const offTimer = setTimeout(() => {
            setTwinkles((prev) => prev.map((tw) => (tw.id === t.id ? { ...tw, active: false } : tw)))
            scheduleNext()
          }, 400)
          timers.push(offTimer)
        }, delay)
        timers.push(timer)
      }
      scheduleNext()
    })
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const leftOrbIntensity = hoveredCard === 0 ? 1.3 : hoveredCard !== null ? 0.6 : 1
  const rightOrbIntensity = hoveredCard === 2 ? 1.3 : hoveredCard !== null ? 0.6 : 1

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ zIndex: 0 }}>
      {/* ── Subtle grid dots ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${ACCENT.purple.rgb},0.5) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── SVG noise texture overlay ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015]" aria-hidden="true">
        <filter id="ambientNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ambientNoise)" />
      </svg>

      {/* ── Purple glow orb -- top right ── */}
      <motion.div
        className="absolute"
        style={{
          width: 360,
          height: 360,
          right: "-6%",
          top: "-10%",
          background: `radial-gradient(circle, rgba(${ACCENT.purple.rgb},0.045) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1 * rightOrbIntensity, 1.15 * rightOrbIntensity, 1 * rightOrbIntensity],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ── Rose glow orb -- bottom left ── */}
      <motion.div
        className="absolute"
        style={{
          width: 280,
          height: 280,
          left: "-4%",
          bottom: "-6%",
          background: `radial-gradient(circle, rgba(${ACCENT.rose.rgb},0.03) 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1 * leftOrbIntensity, 1.12 * leftOrbIntensity, 1 * leftOrbIntensity],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* ── Center emerald glow -- responds to middle card ── */}
      <motion.div
        className="absolute"
        style={{
          width: 200,
          height: 200,
          left: "45%",
          top: "30%",
          background: `radial-gradient(circle, rgba(${ACCENT.emerald.rgb},0.02) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{
          opacity: hoveredCard === 1 ? [0.6, 1, 0.6] : [0.2, 0.35, 0.2],
          scale: hoveredCard === 1 ? [1, 1.2, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
          animate={{
            y: [-14, 14, -14],
            x: [-8, 8, -8],
            opacity: [0.25, 0.75, 0.25],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: hoveredCard !== null ? p.duration * 0.7 : p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* ── Twinkling stars ── */}
      {twinkles.map((t) => (
        <motion.div
          key={t.id}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            left: `${t.x}%`,
            top: `${t.y}%`,
            background: `rgba(${ACCENT.purple.rgb},0.6)`,
          }}
          animate={{
            opacity: t.active ? [0, 0.9, 0] : 0,
            scale: t.active ? [0.5, 1.5, 0.5] : 1,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      ))}

      {/* ── Top section divider ── */}
      <div
        className="absolute left-[4%] right-[4%] top-0 h-px"
        style={{ background: GRADIENT.divider }}
      />

      {/* ── Bottom section divider ── */}
      <div
        className="absolute left-[4%] right-[4%] bottom-0 h-px"
        style={{ background: GRADIENT.divider }}
      />
    </div>
  )
}
