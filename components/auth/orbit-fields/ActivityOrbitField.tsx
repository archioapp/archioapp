"use client"

import { useEffect, useState, useRef } from "react"

// Orbital element that floats around a center point with physics-like motion
function OrbitalSVG({ 
  children, 
  cx, cy,
  orbitRadius,
  startAngle,
  speed,
  drift,
  delay,
  scale = 1,
}: { 
  children: React.ReactNode
  cx: number
  cy: number
  orbitRadius: number
  startAngle: number
  speed: number
  drift: { x: number; y: number }
  delay: number
  scale?: number
}) {
  const [angle, setAngle] = useState(startAngle)
  const [visible, setVisible] = useState(false)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(showTimer)
  }, [delay])

  useEffect(() => {
    if (!visible) return
    let running = true
    const animate = (ts: number) => {
      if (!running) return
      if (!timeRef.current) timeRef.current = ts
      const elapsed = (ts - timeRef.current) / 1000
      // Orbital angle + breathing drift
      const a = startAngle + elapsed * speed
      setAngle(a)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { running = false; cancelAnimationFrame(frameRef.current) }
  }, [visible, speed, startAngle])

  if (!visible) return null

  // Compute position: orbit + sinusoidal drift
  const rad = (angle * Math.PI) / 180
  const breathX = Math.sin(angle * 0.02) * drift.x
  const breathY = Math.cos(angle * 0.03) * drift.y
  const x = cx + Math.cos(rad) * orbitRadius + breathX
  const y = cy + Math.sin(rad) * orbitRadius + breathY
  const fadeIn = Math.min(1, (Date.now() - delay) / 800)

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: fadeIn * 0.85,
        transition: "opacity 0.3s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}

// ========================================
// ACTIVITY INTELLIGENCE SVG COMPONENTS
// Emerald green. Market data. Signal flow.
// Pattern recognition. Real-time analytics.
// ========================================

// 1. Live candlestick cluster -- tight formation, breathing wicks
function CandlestickCluster() {
  const candles = [
    { x: 0, o: 20, c: 8, h: 3, l: 28, g: true },
    { x: 10, o: 10, c: 22, h: 5, l: 26, g: false },
    { x: 20, o: 22, c: 6, h: 2, l: 28, g: true },
    { x: 30, o: 8, c: 18, h: 3, l: 24, g: false },
    { x: 40, o: 18, c: 5, h: 1, l: 22, g: true },
    { x: 50, o: 7, c: 15, h: 2, l: 20, g: false },
    { x: 60, o: 15, c: 4, h: 0, l: 20, g: true },
  ]
  return (
    <svg width="76" height="32" viewBox="0 0 76 32" fill="none">
      {candles.map((c, i) => {
        const col = c.g ? "rgb(34,197,94)" : "rgb(239,68,68)"
        const top = Math.min(c.o, c.c)
        const body = Math.abs(c.o - c.c)
        return (
          <g key={i}>
            <line x1={c.x + 3} y1={c.h} x2={c.x + 3} y2={c.l} stroke={col} strokeWidth="0.5" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite" />
            </line>
            <rect x={c.x} y={top} width="6" height={Math.max(body, 1)} fill={col} opacity="0.4">
              <animate attributeName="opacity" values="0.25;0.6;0.25" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
            </rect>
          </g>
        )
      })}
      {/* Moving average */}
      <path d="M3 14 Q15 10, 23 7 T43 4 T63 2" stroke="rgba(34,197,94,0.5)" strokeWidth="0.8" fill="none" strokeDasharray="2 2">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

// 2. Signal pulse waveform -- ECG-style market heartbeat
function SignalPulse() {
  return (
    <svg width="100" height="28" viewBox="0 0 100 28" fill="none">
      <path
        d="M0 14 L15 14 L20 4 L25 24 L30 8 L35 20 L40 14 L55 14 L60 6 L65 22 L70 10 L75 18 L80 14 L100 14"
        stroke="rgba(34,197,94,0.55)"
        strokeWidth="0.9"
        fill="none"
      />
      {/* Traveling glow along the waveform */}
      <circle r="2.5" fill="rgba(34,197,94,0.8)">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path="M0 14 L15 14 L20 4 L25 24 L30 8 L35 20 L40 14 L55 14 L60 6 L65 22 L70 10 L75 18 L80 14 L100 14"
        />
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Ghost trail */}
      <circle r="1.5" fill="rgba(34,197,94,0.3)">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path="M0 14 L15 14 L20 4 L25 24 L30 8 L35 20 L40 14 L55 14 L60 6 L65 22 L70 10 L75 18 L80 14 L100 14"
          begin="0.3s"
        />
        <animate attributeName="opacity" values="0;0.5;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// 3. Radar sweep -- scanning for patterns
function PatternRadar() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="10" stroke="rgba(34,197,94,0.12)" strokeWidth="0.5" fill="none" />
      <circle cx="26" cy="26" r="20" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" fill="none" />
      <circle cx="26" cy="26" r="24" stroke="rgba(34,197,94,0.05)" strokeWidth="0.3" fill="none" />
      {/* Sweep beam */}
      <line x1="26" y1="26" x2="26" y2="4" stroke="rgba(34,197,94,0.5)" strokeWidth="0.7">
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="3.5s" repeatCount="indefinite" />
      </line>
      {/* Sweep cone */}
      <path d="M26 26 L23 5 A22 22 0 0 1 29 5 Z" fill="rgba(34,197,94,0.06)">
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Blips */}
      {[{ x: 33, y: 14, d: 0 }, { x: 18, y: 18, d: 0.8 }, { x: 36, y: 32, d: 1.6 }, { x: 15, y: 35, d: 2.4 }].map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="1.5" fill="rgba(34,197,94,0.7)">
          <animate attributeName="opacity" values="0;1;0.4" dur="3.5s" begin={`${b.d}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="0.5;2;1.5" dur="3.5s" begin={`${b.d}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Center cross */}
      <line x1="23" y1="26" x2="29" y2="26" stroke="rgba(34,197,94,0.3)" strokeWidth="0.4" />
      <line x1="26" y1="23" x2="26" y2="29" stroke="rgba(34,197,94,0.3)" strokeWidth="0.4" />
    </svg>
  )
}

// 4. Neural network cluster -- data flowing through nodes
function NeuralCluster() {
  const nodes = [
    { x: 6, y: 8 }, { x: 6, y: 22 }, { x: 6, y: 36 },
    { x: 26, y: 12 }, { x: 26, y: 30 },
    { x: 46, y: 22 },
  ]
  const edges: [number, number][] = [[0,3],[0,4],[1,3],[1,4],[2,3],[2,4],[3,5],[4,5]]
  return (
    <svg width="52" height="44" viewBox="0 0 52 44" fill="none">
      {edges.map(([a, b], i) => (
        <g key={`e${i}`}>
          <line x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="rgba(34,197,94,0.18)" strokeWidth="0.4" />
          <circle r="1" fill="rgba(34,197,94,0.7)">
            <animateMotion dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" path={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`} />
            <animate attributeName="opacity" values="0;0.9;0" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r="2.5" stroke="rgba(34,197,94,0.45)" strokeWidth="0.6" fill="rgba(34,197,94,0.08)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

// 5. Order book depth bars -- bid/ask visualization
function DepthBars() {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
      {/* Bid side green */}
      {[{ y: 4, w: 18 }, { y: 10, w: 22 }, { y: 16, w: 14 }, { y: 22, w: 20 }, { y: 28, w: 16 }, { y: 34, w: 24 }].map((b, i) => (
        <rect key={`b${i}`} x={24 - b.w} y={b.y} width={b.w} height="3.5" fill="rgba(34,197,94,0.2)">
          <animate attributeName="width" values={`${b.w};${b.w + 5};${b.w}`} dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {/* Ask side red */}
      {[{ y: 4, w: 14 }, { y: 10, w: 20 }, { y: 16, w: 10 }, { y: 22, w: 18 }, { y: 28, w: 12 }, { y: 34, w: 16 }].map((b, i) => (
        <rect key={`a${i}`} x={24} y={b.y} width={b.w} height="3.5" fill="rgba(239,68,68,0.12)">
          <animate attributeName="width" values={`${b.w};${b.w + 4};${b.w}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {/* Center price */}
      <line x1="24" y1="0" x2="24" y2="40" stroke="rgba(34,197,94,0.35)" strokeWidth="0.4" strokeDasharray="1 2">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

// 6. Tick streamer -- flowing data ribbon
function TickStream() {
  return (
    <svg width="90" height="18" viewBox="0 0 90 18" fill="none">
      <path d="M0 9 L6 9 L9 3 L12 15 L15 6 L18 12 L21 9 L30 9 L33 4 L36 14 L39 7 L42 11 L45 9 L54 9 L57 2 L60 16 L63 5 L66 13 L69 9 L78 9 L81 4 L84 14 L87 7 L90 9" 
        stroke="rgba(34,197,94,0.4)" strokeWidth="0.7" fill="none" />
      {/* Scanning highlight */}
      <rect x="-12" y="0" width="12" height="18" fill="url(#tickGrad1)">
        <animate attributeName="x" values="-12;90" dur="2s" repeatCount="indefinite" />
      </rect>
      <defs>
        <linearGradient id="tickGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(34,197,94,0)" />
          <stop offset="0.5" stopColor="rgba(34,197,94,0.2)" />
          <stop offset="1" stopColor="rgba(34,197,94,0)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// 7. Correlation matrix -- heatmap cells
function CorrelationGrid() {
  const vals = [[0.9,0.4,-0.2],[0.4,0.85,0.3],[-0.2,0.3,0.95]]
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {vals.map((row, ri) => row.map((v, ci) => {
        const pos = v > 0
        return (
          <rect key={`${ri}${ci}`} x={ci * 12} y={ri * 12} width="10" height="10"
            fill={pos ? `rgba(34,197,94,${Math.abs(v) * 0.2})` : `rgba(239,68,68,${Math.abs(v) * 0.15})`}
            stroke={pos ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)"} strokeWidth="0.3">
            <animate attributeName="opacity" values={`${0.4};${0.8};${0.4}`} dur={`${2 + ri * 0.4 + ci * 0.3}s`} repeatCount="indefinite" />
          </rect>
        )
      }))}
    </svg>
  )
}

// 8. Emerald particles -- breathing dots
function EmeraldParticle({ size = 4, speed = 2 }: { size?: number; speed?: number }) {
  return (
    <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`}>
      <circle cx={size} cy={size} r={size * 0.6} fill="rgba(34,197,94,0.5)">
        <animate attributeName="r" values={`${size * 0.3};${size * 0.8};${size * 0.3}`} dur={`${speed}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${speed}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={size} cy={size} r={size * 0.3} fill="rgba(34,197,94,0.8)" />
    </svg>
  )
}

// ========================================
// MAIN ACTIVITY ORBIT FIELD
// ========================================

interface ActivityOrbitFieldProps {
  centerX: number
  centerY: number
  isActive: boolean
}

export function ActivityOrbitField({ centerX, centerY, isActive }: ActivityOrbitFieldProps) {
  if (!isActive) return null

  // All SVGs orbit around the center point of the hovered row
  // Different radii, speeds, and angles create a living galaxy-like effect
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.5s ease-out" }}>
      {/* Ambient emerald glow at center */}
      <div className="absolute" style={{
        left: centerX - 80,
        top: centerY - 40,
        width: 160,
        height: 80,
        background: "radial-gradient(ellipse at center, rgba(34,197,94,0.06), transparent 70%)",
        transition: "opacity 0.5s",
      }} />

      {/* ORBIT RING 1: Close orbit -- small fast elements */}
      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={50} startAngle={0} speed={18} drift={{ x: 3, y: 2 }} delay={0} scale={0.9}>
        <CandlestickCluster />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={55} startAngle={120} speed={-15} drift={{ x: 4, y: 3 }} delay={100} scale={0.85}>
        <SignalPulse />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={45} startAngle={240} speed={20} drift={{ x: 2, y: 4 }} delay={200} scale={0.8}>
        <EmeraldParticle size={5} speed={1.5} />
      </OrbitalSVG>

      {/* ORBIT RING 2: Medium orbit -- larger structural elements */}
      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={90} startAngle={30} speed={10} drift={{ x: 6, y: 4 }} delay={150} scale={0.95}>
        <PatternRadar />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={85} startAngle={150} speed={-12} drift={{ x: 5, y: 5 }} delay={250} scale={0.9}>
        <NeuralCluster />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={95} startAngle={270} speed={8} drift={{ x: 4, y: 6 }} delay={300}>
        <DepthBars />
      </OrbitalSVG>

      {/* ORBIT RING 3: Wide orbit -- ambient elements */}
      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={130} startAngle={60} speed={6} drift={{ x: 8, y: 5 }} delay={350} scale={1}>
        <TickStream />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={120} startAngle={180} speed={-7} drift={{ x: 7, y: 6 }} delay={400} scale={0.9}>
        <CorrelationGrid />
      </OrbitalSVG>

      {/* Scattered breathing particles at various orbits */}
      {[
        { r: 40, a: 45, s: 25, d: 50 },
        { r: 65, a: 90, s: -20, d: 120 },
        { r: 75, a: 200, s: 22, d: 180 },
        { r: 100, a: 315, s: -14, d: 250 },
        { r: 110, a: 135, s: 16, d: 320 },
        { r: 140, a: 20, s: -10, d: 80 },
        { r: 60, a: 280, s: 30, d: 160 },
        { r: 150, a: 100, s: 5, d: 280 },
      ].map((p, i) => (
        <OrbitalSVG key={`p${i}`} cx={centerX} cy={centerY} orbitRadius={p.r} startAngle={p.a} speed={p.s} drift={{ x: 3 + i, y: 2 + i * 0.5 }} delay={p.d} scale={0.7 + (i % 3) * 0.15}>
          <EmeraldParticle size={3 + (i % 3)} speed={1.5 + i * 0.3} />
        </OrbitalSVG>
      ))}
    </div>
  )
}
