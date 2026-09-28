"use client"

import { motion, useReducedMotion } from "framer-motion"
import { DeviceFrame } from "./DeviceFrame"

/**
 * ConvergenceField — the signature hero visual.
 *
 * Six real product screenshots sit in an elliptical orbit around a central
 * "OS core" frame that shows the live AI Copilot Cortex. Thin cyan signal
 * paths run from each orbiting module into the core and pulse on a slow
 * breathing loop — telling the whole Archio thesis in one picture:
 *
 *     scattered modules  →  one shared brain
 */

type OrbitItem = {
  src: string
  alt: string
  label: string
  /** angle around the ellipse, degrees. 0 = right, 90 = bottom */
  angle: number
  scale?: number
}

const ORBIT: OrbitItem[] = [
  { src: "/archio/screens/02-dashboard.png",          alt: "Archio performance dashboard",      label: "/dashboard",    angle: -90, scale: 1.02 },
  { src: "/archio/screens/05-forecast.png",           alt: "Archio multi-timeframe forecast",   label: "/forecast",     angle: -35 },
  { src: "/archio/screens/08-hub.png",                alt: "Archio forecasts hub",              label: "/hub",          angle:  35 },
  { src: "/archio/screens/09-communities.png",        alt: "Archio communities finder",         label: "/communities",  angle:  90, scale: 1.02 },
  { src: "/archio/screens/06-intelligence.png",       alt: "Archio market intelligence",        label: "/intelligence", angle: 145 },
  { src: "/archio/screens/03-copilot-psychology.png", alt: "Archio Neural Cortex",              label: "/copilot",      angle: 215 },
]

export function ConvergenceField() {
  const reduce = useReducedMotion()

  // Ellipse radii as % of container. Wider on X, tighter on Y so the orbit
  // reads as "coming toward you" rather than a flat circle.
  const RX = 42
  const RY = 38

  const positions = ORBIT.map((o) => {
    const rad = (o.angle * Math.PI) / 180
    return {
      ...o,
      x: 50 + RX * Math.cos(rad),
      y: 50 + RY * Math.sin(rad),
    }
  })

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[640px]">
      {/* ambient cyan halo with the only sanctioned violet ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 50%, rgba(34,211,238,0.11), transparent 60%), radial-gradient(70% 70% at 50% 50%, rgba(109,74,255,0.06), transparent 72%)",
        }}
      />

      {/* orbit rings */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="archio-orbit-ring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="55%" stopColor="rgba(34,211,238,0.22)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </radialGradient>
          <linearGradient id="archio-signal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.7)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>

        <ellipse cx="50" cy="50" rx={RX - 2}  ry={RY - 2}  fill="none" stroke="url(#archio-orbit-ring)" strokeWidth="0.15" strokeDasharray="0.6 1.4" />
        <ellipse cx="50" cy="50" rx={RX - 8}  ry={RY - 8}  fill="none" stroke="url(#archio-orbit-ring)" strokeWidth="0.12" strokeDasharray="0.4 1.2" opacity="0.8" />
        <ellipse cx="50" cy="50" rx={RX - 14} ry={RY - 14} fill="none" stroke="url(#archio-orbit-ring)" strokeWidth="0.1"  strokeDasharray="0.4 1.0" opacity="0.55" />
      </svg>

      {/* signal paths + traveling pulses */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 z-10 h-full w-full"
      >
        {positions.map((p, i) => (
          <g key={p.label}>
            <motion.line
              x1={p.x}
              y1={p.y}
              x2="50"
              y2="50"
              stroke="url(#archio-signal)"
              strokeWidth="0.28"
              strokeLinecap="round"
              initial={{ opacity: 0.25 }}
              animate={reduce ? { opacity: 0.4 } : { opacity: [0.25, 0.65, 0.25] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
            {!reduce && (
              <motion.circle
                r="0.55"
                fill="#22d3ee"
                initial={{ cx: p.x, cy: p.y, opacity: 0 }}
                animate={{ cx: [p.x, 50], cy: [p.y, 50], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* orbiting product frames */}
      {positions.map((p, i) => {
        const size = 22 * (p.scale ?? 1)
        return (
          <motion.div
            key={p.label}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${size}%`,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -4, 0, 4, 0] }}
              transition={{ duration: 6 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
            >
              <DeviceFrame
                src={p.src}
                alt={p.alt}
                variant="bare"
                aspect="aspect-[16/10]"
                sheen={false}
                sizes="(max-width: 768px) 38vw, 14vw"
                className="shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)]"
              />
              <div className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">
                {p.label}
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* central OS core — the Cortex */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          aria-hidden
          className="absolute -inset-6 -z-10 rounded-full"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.24), transparent 70%)" }}
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <DeviceFrame
          src="/archio/screens/11-copilot-right-rail.png"
          alt="Archio Copilot Cortex — AI overseeing every module in real time"
          variant="rail"
          aspect="aspect-[3/4]"
          label="CORTEX"
          priority
          sizes="(max-width: 768px) 55vw, 22vw"
          className="border-cyan-400/30 shadow-[0_30px_80px_-20px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-400/30"
          animate={reduce ? undefined : { opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  )
}
