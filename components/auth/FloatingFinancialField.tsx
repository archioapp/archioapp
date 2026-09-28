"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface FloatingFinancialFieldProps {
  interactionState?: string
  hoveredLayer?: string | null
  className?: string
}

// Individual floating SVG element
function FloatingElement({ 
  children, 
  delay, 
  duration, 
  startX, 
  startY,
  amplitude,
  direction,
  opacity = 1,
}: { 
  children: React.ReactNode
  delay: number
  duration: number
  startX: number
  startY: number
  amplitude: number
  direction: "up" | "down" | "left" | "right"
  opacity?: number
}) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay * 100)
    return () => clearTimeout(t)
  }, [delay])

  const animStyle = {
    "--float-x": direction === "left" ? `-${amplitude}px` : direction === "right" ? `${amplitude}px` : "0px",
    "--float-y": direction === "up" ? `-${amplitude}px` : direction === "down" ? `${amplitude}px` : "0px",
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "absolute transition-opacity duration-1000",
        mounted ? "opacity-100" : "opacity-0"
      )}
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        opacity: mounted ? opacity : 0,
        animation: mounted ? `floatElement ${duration}s ease-in-out infinite alternate` : "none",
        animationDelay: `${delay * 0.3}s`,
        ...animStyle,
      }}
    >
      {children}
    </div>
  )
}

// ===========================
// BASE FINANCIAL ELEMENTS
// ===========================

function CandlestickSVG({ color, height }: { color: string; height: number }) {
  const isGreen = color === "green"
  return (
    <svg width="12" height={height} viewBox={`0 0 12 ${height}`} fill="none" opacity="0.12">
      <line x1="6" y1="0" x2="6" y2={height} stroke={isGreen ? "rgb(34,197,94)" : "rgb(239,68,68)"} strokeWidth="0.5" />
      <rect x="2" y={height * 0.3} width="8" height={height * 0.4} fill={isGreen ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"} stroke={isGreen ? "rgb(34,197,94)" : "rgb(239,68,68)"} strokeWidth="0.5" />
    </svg>
  )
}

function TrendLineSVG({ direction, width }: { direction: "up" | "down"; width: number }) {
  const h = 24
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none" opacity="0.08">
      <path d={direction === "up" ? `M0 ${h} Q${width * 0.25} ${h * 0.6}, ${width * 0.5} ${h * 0.4} T${width} 2` : `M0 2 Q${width * 0.25} ${h * 0.4}, ${width * 0.5} ${h * 0.6} T${width} ${h}`} stroke="rgba(148,163,184,0.5)" strokeWidth="0.8" fill="none" />
      <circle cx={width - 2} cy={direction === "up" ? 4 : h - 4} r="1.5" fill="rgba(148,163,184,0.3)" />
    </svg>
  )
}

function NetworkNodeSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.06">
      <circle cx="24" cy="24" r="3" stroke="rgba(148,163,184,0.6)" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="2" stroke="rgba(148,163,184,0.4)" strokeWidth="0.6" />
      <circle cx="36" cy="12" r="2" stroke="rgba(148,163,184,0.4)" strokeWidth="0.6" />
      <circle cx="12" cy="36" r="2" stroke="rgba(148,163,184,0.4)" strokeWidth="0.6" />
      <circle cx="36" cy="36" r="2" stroke="rgba(148,163,184,0.4)" strokeWidth="0.6" />
      <line x1="22" y1="22" x2="14" y2="14" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5" />
      <line x1="26" y1="22" x2="34" y2="14" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5" />
      <line x1="22" y1="26" x2="14" y2="34" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5" />
      <line x1="26" y1="26" x2="34" y2="34" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5" />
    </svg>
  )
}

function PulseLineSVG({ width }: { width: number }) {
  return (
    <svg width={width} height="20" viewBox={`0 0 ${width} 20`} fill="none" opacity="0.06">
      <path d={`M0 10 L${width * 0.2} 10 L${width * 0.25} 3 L${width * 0.3} 17 L${width * 0.35} 7 L${width * 0.4} 13 L${width * 0.45} 10 L${width} 10`} stroke="rgba(34,197,94,0.5)" strokeWidth="0.8" fill="none" />
    </svg>
  )
}

// ===========================
// ACTIVITY INTELLIGENCE SVGs
// Emerald-green themed: real-time market data, pattern recognition, signal flows
// ===========================

// Large animated candlestick chart with moving price action
function ActivityCandlestickChart() {
  return (
    <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
      {/* Grid background */}
      {[20, 40, 60, 80].map(y => (
        <line key={y} x1="0" y1={y} x2="180" y2={y} stroke="rgba(34,197,94,0.06)" strokeWidth="0.3" strokeDasharray="2 4" />
      ))}
      {/* Candlesticks with staggered animation */}
      {[
        { x: 10, o: 55, c: 35, h: 25, l: 65, green: true },
        { x: 25, o: 35, c: 50, h: 28, l: 58, green: false },
        { x: 40, o: 50, c: 30, h: 22, l: 55, green: true },
        { x: 55, o: 30, c: 45, h: 20, l: 52, green: false },
        { x: 70, o: 45, c: 25, h: 18, l: 50, green: true },
        { x: 85, o: 25, c: 20, h: 12, l: 35, green: true },
        { x: 100, o: 20, c: 38, h: 15, l: 42, green: false },
        { x: 115, o: 38, c: 22, h: 15, l: 45, green: true },
        { x: 130, o: 22, c: 18, h: 10, l: 30, green: true },
        { x: 145, o: 18, c: 32, h: 12, l: 40, green: false },
        { x: 160, o: 32, c: 15, h: 8, l: 38, green: true },
      ].map((c, i) => {
        const col = c.green ? "rgb(34,197,94)" : "rgb(239,68,68)"
        const colFill = c.green ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.2)"
        const top = Math.min(c.o, c.c)
        const bodyH = Math.abs(c.o - c.c)
        return (
          <g key={i}>
            <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={col} strokeWidth="0.6" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </line>
            <rect x={c.x - 4} y={top} width="8" height={Math.max(bodyH, 2)} fill={colFill} stroke={col} strokeWidth="0.5">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
            </rect>
          </g>
        )
      })}
      {/* Moving average line */}
      <path d="M10 45 Q30 38, 50 32 T90 22 T130 18 T170 12" stroke="rgba(34,197,94,0.4)" strokeWidth="1" fill="none" strokeDasharray="3 2">
        <animate attributeName="stroke-dashoffset" values="0;-20" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Volume bars at bottom */}
      {[10, 25, 40, 55, 70, 85, 100, 115, 130, 145, 160].map((x, i) => (
        <rect key={`v${i}`} x={x - 3} y={100 - (6 + Math.random() * 12)} width="6" height={6 + Math.random() * 12} fill="rgba(34,197,94,0.08)">
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur={`${1.5 + i * 0.15}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  )
}

// Neural network pattern recognition SVG
function ActivityNeuralNetwork() {
  const nodes = [
    // Input layer
    { x: 10, y: 15, r: 3 }, { x: 10, y: 35, r: 3 }, { x: 10, y: 55, r: 3 }, { x: 10, y: 75, r: 3 },
    // Hidden layer 1
    { x: 45, y: 20, r: 4 }, { x: 45, y: 45, r: 4 }, { x: 45, y: 70, r: 4 },
    // Hidden layer 2
    { x: 80, y: 25, r: 4 }, { x: 80, y: 50, r: 4 }, { x: 80, y: 75, r: 3 },
    // Output layer
    { x: 115, y: 35, r: 5 }, { x: 115, y: 60, r: 5 },
  ]

  // Connection pairs: input -> hidden1 -> hidden2 -> output
  const connections = [
    // input -> hidden1
    [0,4],[0,5],[1,4],[1,5],[1,6],[2,5],[2,6],[3,5],[3,6],
    // hidden1 -> hidden2
    [4,7],[4,8],[5,7],[5,8],[5,9],[6,8],[6,9],
    // hidden2 -> output
    [7,10],[7,11],[8,10],[8,11],[9,10],[9,11],
  ]

  return (
    <svg width="130" height="90" viewBox="0 0 130 90" fill="none">
      {/* Connections with data flow animation */}
      {connections.map(([from, to], i) => (
        <g key={`c${i}`}>
          <line
            x1={nodes[from].x} y1={nodes[from].y}
            x2={nodes[to].x} y2={nodes[to].y}
            stroke="rgba(34,197,94,0.15)"
            strokeWidth="0.5"
          />
          {/* Traveling data packet */}
          <circle r="1" fill="rgba(34,197,94,0.6)">
            <animateMotion
              dur={`${1.5 + (i % 5) * 0.4}s`}
              repeatCount="indefinite"
              path={`M${nodes[from].x},${nodes[from].y} L${nodes[to].x},${nodes[to].y}`}
            />
            <animate attributeName="opacity" values="0;0.8;0" dur={`${1.5 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Nodes with breathing glow */}
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r={n.r + 2} fill="rgba(34,197,94,0.04)">
            <animate attributeName="r" values={`${n.r + 1};${n.r + 4};${n.r + 1}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={n.x} cy={n.y} r={n.r} stroke="rgba(34,197,94,0.5)" strokeWidth="0.8" fill="rgba(34,197,94,0.08)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={n.x} cy={n.y} r="1" fill="rgba(34,197,94,0.7)" />
        </g>
      ))}
    </svg>
  )
}

// Signal flow detector -- real-time streaming lines
function ActivitySignalFlow() {
  return (
    <svg width="160" height="60" viewBox="0 0 160 60" fill="none">
      {/* Multiple signal channels */}
      {[
        { y: 10, path: "M0 10 C20 5, 40 15, 60 8 S100 15, 120 6 S150 12, 160 10", delay: 0 },
        { y: 25, path: "M0 25 C25 20, 45 30, 65 22 S105 28, 125 20 S155 26, 160 25", delay: 0.5 },
        { y: 40, path: "M0 40 C30 35, 50 45, 70 38 S110 42, 130 36 S150 40, 160 40", delay: 1 },
        { y: 55, path: "M0 55 C20 50, 40 58, 60 52 S100 56, 120 50 S150 54, 160 55", delay: 1.5 },
      ].map((signal, i) => (
        <g key={i}>
          {/* Signal line */}
          <path d={signal.path} stroke="rgba(34,197,94,0.2)" strokeWidth="0.6" fill="none" />
          {/* Traveling pulse */}
          <circle r="2" fill="rgba(34,197,94,0.7)">
            <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" path={signal.path} />
            <animate attributeName="r" values="1;2.5;1" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          {/* Secondary trailing pulse */}
          <circle r="1" fill="rgba(34,197,94,0.4)">
            <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" path={signal.path} begin={`${signal.delay + 0.8}s`} />
            <animate attributeName="opacity" values="0;0.6;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Signal detection nodes */}
      {[20, 60, 100, 140].map((x, i) => (
        <g key={`d${i}`}>
          <circle cx={x} cy={30} r="4" stroke="rgba(34,197,94,0.15)" strokeWidth="0.5" fill="none">
            <animate attributeName="r" values="3;6;3" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={30} r="1" fill="rgba(34,197,94,0.5)">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  )
}

// Market depth order book visualization
function ActivityOrderBook() {
  return (
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
      {/* Bid side (green bars from center-left) */}
      {[
        { y: 8, w: 35 }, { y: 16, w: 42 }, { y: 24, w: 30 },
        { y: 32, w: 48 }, { y: 40, w: 25 }, { y: 48, w: 38 },
        { y: 56, w: 45 }, { y: 64, w: 32 }, { y: 72, w: 40 },
      ].map((bar, i) => (
        <rect key={`b${i}`} x={50 - bar.w} y={bar.y} width={bar.w} height="5" fill="rgba(34,197,94,0.12)">
          <animate attributeName="width" values={`${bar.w};${bar.w + 8};${bar.w}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {/* Ask side (red bars from center-right) */}
      {[
        { y: 8, w: 28 }, { y: 16, w: 38 }, { y: 24, w: 22 },
        { y: 32, w: 42 }, { y: 40, w: 20 }, { y: 48, w: 35 },
        { y: 56, w: 40 }, { y: 64, w: 26 }, { y: 72, w: 34 },
      ].map((bar, i) => (
        <rect key={`a${i}`} x={50} y={bar.y} width={bar.w} height="5" fill="rgba(239,68,68,0.08)">
          <animate attributeName="width" values={`${bar.w};${bar.w + 6};${bar.w}`} dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0.15;0.06" dur={`${2.8 + i * 0.2}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {/* Center price line */}
      <line x1="50" y1="0" x2="50" y2="80" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" strokeDasharray="2 3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

// Orbiting pattern recognition radar
function ActivityPatternRadar() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      {/* Concentric rings */}
      {[12, 24, 36].map((r, i) => (
        <circle key={i} cx="45" cy="45" r={r} stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" fill="none" />
      ))}
      {/* Sweeping radar beam */}
      <line x1="45" y1="45" x2="45" y2="9" stroke="rgba(34,197,94,0.4)" strokeWidth="0.8">
        <animateTransform attributeName="transform" type="rotate" from="0 45 45" to="360 45 45" dur="4s" repeatCount="indefinite" />
      </line>
      {/* Radar sweep cone */}
      <path d="M45 45 L40 12 A36 36 0 0 1 50 12 Z" fill="rgba(34,197,94,0.04)">
        <animateTransform attributeName="transform" type="rotate" from="0 45 45" to="360 45 45" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Detected pattern blips */}
      {[
        { x: 58, y: 25, delay: 0 }, { x: 30, y: 32, delay: 1 },
        { x: 65, y: 50, delay: 2 }, { x: 25, y: 60, delay: 0.5 },
        { x: 55, y: 68, delay: 1.5 }, { x: 38, y: 20, delay: 2.5 },
      ].map((blip, i) => (
        <g key={i}>
          <circle cx={blip.x} cy={blip.y} r="2" fill="rgba(34,197,94,0.6)">
            <animate attributeName="opacity" values="0;1;0.3" dur="4s" begin={`${blip.delay}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="1;3;2" dur="4s" begin={`${blip.delay}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Cross-hair center */}
      <line x1="39" y1="45" x2="51" y2="45" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
      <line x1="45" y1="39" x2="45" y2="51" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
    </svg>
  )
}

// Real-time tick stream
function ActivityTickStream() {
  return (
    <svg width="200" height="30" viewBox="0 0 200 30" fill="none">
      <path
        d="M0 15 L8 15 L12 5 L16 25 L20 10 L24 20 L28 12 L32 18 L36 15 L44 15 L48 8 L52 22 L56 11 L60 19 L64 14 L68 16 L72 15 L80 15 L84 6 L88 24 L92 9 L96 21 L100 13 L104 17 L108 15 L116 15 L120 4 L124 26 L128 8 L132 22 L136 12 L140 18 L144 15 L152 15 L156 7 L160 23 L164 10 L168 20 L172 13 L176 17 L180 15 L200 15"
        stroke="rgba(34,197,94,0.3)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Streaming highlight */}
      <rect x="0" y="0" width="30" height="30" fill="url(#actTickGrad)">
        <animate attributeName="x" values="-30;200" dur="3s" repeatCount="indefinite" />
      </rect>
      <defs>
        <linearGradient id="actTickGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(34,197,94,0)" />
          <stop offset="0.5" stopColor="rgba(34,197,94,0.15)" />
          <stop offset="1" stopColor="rgba(34,197,94,0)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Correlation matrix visualization
function ActivityCorrelationMatrix() {
  const cells = [
    [0.9, 0.4, -0.2, 0.7],
    [0.4, 0.8, 0.3, -0.1],
    [-0.2, 0.3, 0.95, 0.5],
    [0.7, -0.1, 0.5, 0.85],
  ]
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {cells.map((row, ri) =>
        row.map((val, ci) => {
          const intensity = Math.abs(val)
          const isPositive = val > 0
          return (
            <rect
              key={`${ri}-${ci}`}
              x={ci * 14}
              y={ri * 14}
              width="12"
              height="12"
              fill={isPositive ? `rgba(34,197,94,${intensity * 0.15})` : `rgba(239,68,68,${intensity * 0.1})`}
              stroke={isPositive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)"}
              strokeWidth="0.3"
            >
              <animate attributeName="opacity" values={`${0.3 + intensity * 0.3};${0.6 + intensity * 0.3};${0.3 + intensity * 0.3}`} dur={`${2 + ri * 0.5 + ci * 0.3}s`} repeatCount="indefinite" />
            </rect>
          )
        })
      )}
    </svg>
  )
}


export function FloatingFinancialField({ interactionState, hoveredLayer, className }: FloatingFinancialFieldProps) {
  const isEngaged = interactionState !== "idle" && interactionState !== undefined
  const isActivityHovered = hoveredLayer === "activity-intelligence"

  return (
    <div className={cn(
      "absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500",
      className,
    )}>
      {/* ===== BASE FINANCIAL ELEMENTS (always visible, subtle) ===== */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-700",
        isActivityHovered ? "opacity-20" : isEngaged ? "opacity-80" : "opacity-50",
      )}>
        <FloatingElement delay={0} duration={8} startX={8} startY={15} amplitude={12} direction="up">
          <CandlestickSVG color="green" height={32} />
        </FloatingElement>
        <FloatingElement delay={3} duration={10} startX={82} startY={70} amplitude={10} direction="down">
          <CandlestickSVG color="red" height={28} />
        </FloatingElement>
        <FloatingElement delay={5} duration={9} startX={70} startY={20} amplitude={8} direction="up">
          <CandlestickSVG color="green" height={24} />
        </FloatingElement>
        <FloatingElement delay={1} duration={12} startX={5} startY={35} amplitude={6} direction="right">
          <TrendLineSVG direction="up" width={80} />
        </FloatingElement>
        <FloatingElement delay={4} duration={14} startX={60} startY={85} amplitude={8} direction="left">
          <TrendLineSVG direction="down" width={60} />
        </FloatingElement>
        <FloatingElement delay={2} duration={16} startX={55} startY={25} amplitude={10} direction="down">
          <NetworkNodeSVG />
        </FloatingElement>
        <FloatingElement delay={3} duration={11} startX={25} startY={30} amplitude={5} direction="right">
          <PulseLineSVG width={100} />
        </FloatingElement>
        <FloatingElement delay={6} duration={13} startX={55} startY={78} amplitude={7} direction="left">
          <PulseLineSVG width={80} />
        </FloatingElement>
      </div>

      {/* ===== ACTIVITY INTELLIGENCE LAYER (emerald green explosion on hover) ===== */}
      <div className={cn(
        "absolute inset-0 transition-all duration-700",
        isActivityHovered ? "opacity-100 scale-100" : "opacity-0 scale-95",
      )}>
        {/* Ambient emerald glow wash */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.04), transparent 70%)",
        }} />

        {/* Large candlestick chart - center-left */}
        <FloatingElement delay={0} duration={20} startX={5} startY={8} amplitude={8} direction="down" opacity={0.9}>
          <ActivityCandlestickChart />
        </FloatingElement>

        {/* Neural network - top right */}
        <FloatingElement delay={1} duration={18} startX={55} startY={5} amplitude={6} direction="left" opacity={0.8}>
          <ActivityNeuralNetwork />
        </FloatingElement>

        {/* Signal flow - middle */}
        <FloatingElement delay={2} duration={22} startX={15} startY={42} amplitude={5} direction="right" opacity={0.7}>
          <ActivitySignalFlow />
        </FloatingElement>

        {/* Order book - bottom left */}
        <FloatingElement delay={3} duration={16} startX={2} startY={65} amplitude={10} direction="up" opacity={0.75}>
          <ActivityOrderBook />
        </FloatingElement>

        {/* Pattern radar - right center */}
        <FloatingElement delay={1} duration={24} startX={65} startY={40} amplitude={7} direction="down" opacity={0.65}>
          <ActivityPatternRadar />
        </FloatingElement>

        {/* Tick stream - bottom wide */}
        <FloatingElement delay={2} duration={15} startX={5} startY={85} amplitude={4} direction="right" opacity={0.6}>
          <ActivityTickStream />
        </FloatingElement>

        {/* Correlation matrix - top left */}
        <FloatingElement delay={4} duration={19} startX={70} startY={72} amplitude={8} direction="up" opacity={0.55}>
          <ActivityCorrelationMatrix />
        </FloatingElement>

        {/* Additional scattered emerald particles */}
        {[
          { x: 30, y: 15, d: 6, s: "up" as const },
          { x: 80, y: 25, d: 8, s: "down" as const },
          { x: 15, y: 55, d: 7, s: "right" as const },
          { x: 75, y: 60, d: 9, s: "left" as const },
          { x: 45, y: 80, d: 5, s: "up" as const },
          { x: 90, y: 45, d: 10, s: "down" as const },
        ].map((p, i) => (
          <FloatingElement key={`ep${i}`} delay={i + 2} duration={12 + i * 2} startX={p.x} startY={p.y} amplitude={p.d} direction={p.s} opacity={0.4}>
            <svg width="6" height="6" viewBox="0 0 6 6">
              <circle cx="3" cy="3" r="2" fill="rgba(34,197,94,0.3)">
                <animate attributeName="r" values="1;3;1" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
              </circle>
            </svg>
          </FloatingElement>
        ))}
      </div>
    </div>
  )
}
