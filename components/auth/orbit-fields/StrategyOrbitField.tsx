"use client"

import { useEffect, useState, useRef } from "react"

// Reusable orbital container -- positions children in orbit around a center point
function OrbitalSVG({ 
  children, cx, cy, orbitRadius, startAngle, speed, drift, delay, scale = 1,
}: { 
  children: React.ReactNode
  cx: number; cy: number; orbitRadius: number; startAngle: number
  speed: number; drift: { x: number; y: number }; delay: number; scale?: number
}) {
  const [angle, setAngle] = useState(startAngle)
  const [visible, setVisible] = useState(false)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!visible) return
    let running = true
    const animate = (ts: number) => {
      if (!running) return
      if (!timeRef.current) timeRef.current = ts
      const elapsed = (ts - timeRef.current) / 1000
      setAngle(startAngle + elapsed * speed)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { running = false; cancelAnimationFrame(frameRef.current) }
  }, [visible, speed, startAngle])

  if (!visible) return null

  const rad = (angle * Math.PI) / 180
  const breathX = Math.sin(angle * 0.02) * drift.x
  const breathY = Math.cos(angle * 0.03) * drift.y
  const x = cx + Math.cos(rad) * orbitRadius + breathX
  const y = cy + Math.sin(rad) * orbitRadius + breathY

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: 0.85,
        transition: "opacity 0.3s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}

// ============================================================
// STRATEGY OPERATING SYSTEM SVG COMPONENTS
// Color: Blue (rgb 96,165,250) -- Cold, analytical, systematic
// Concept: Execution frameworks, rule engines, confluence grids,
// position sizing, backtest logic, risk matrices, entry trees
// ============================================================

const B = "rgb(96,165,250)"   // primary blue
const BD = "rgb(59,130,246)"  // deeper blue
const BL = "rgb(147,197,253)" // light blue

// 1. RULE ENGINE DECISION TREE -- branching if/then/else logic with animated data packets
function RuleEngineTree() {
  // Nodes: root -> two branches -> four leaves
  const nodes = [
    { x: 40, y: 4, label: "ENTRY" },
    { x: 18, y: 20, label: "BUY" },
    { x: 62, y: 20, label: "SELL" },
    { x: 6, y: 38, label: "L" },
    { x: 28, y: 38, label: "S" },
    { x: 52, y: 38, label: "L" },
    { x: 72, y: 38, label: "S" },
  ]
  const edges: [number, number][] = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]

  return (
    <svg width="80" height="48" viewBox="0 0 80 48" fill="none">
      {/* Edges with data packets flowing */}
      {edges.map(([a, b], i) => (
        <g key={`e${i}`}>
          <line
            x1={nodes[a].x} y1={nodes[a].y + 3}
            x2={nodes[b].x} y2={nodes[b].y - 2}
            stroke={B} strokeWidth="0.5" opacity="0.25"
          />
          {/* Data packet traveling down the edge */}
          <circle r="1.2" fill={B} opacity="0.8">
            <animateMotion
              dur={`${1.4 + i * 0.3}s`}
              repeatCount="indefinite"
              path={`M${nodes[a].x},${nodes[a].y + 3} L${nodes[b].x},${nodes[b].y - 2}`}
            />
            <animate attributeName="opacity" values="0;1;0" dur={`${1.4 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Decision nodes */}
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          {i === 0 ? (
            // Root: diamond shape
            <rect x={n.x - 5} y={n.y - 3} width="10" height="6"
              stroke={B} strokeWidth="0.7" fill={`${B}`} fillOpacity="0.08"
              transform={`rotate(45 ${n.x} ${n.y})`}
            >
              <animate attributeName="fill-opacity" values="0.04;0.12;0.04" dur="2.5s" repeatCount="indefinite" />
            </rect>
          ) : i < 3 ? (
            // Branch: rectangle
            <rect x={n.x - 7} y={n.y - 3} width="14" height="6"
              stroke={B} strokeWidth="0.5" fill={`${B}`} fillOpacity="0.06"
            >
              <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </rect>
          ) : (
            // Leaf: small circle
            <circle cx={n.x} cy={n.y} r="3" stroke={B} strokeWidth="0.5" fill={`${B}`} fillOpacity="0.05">
              <animate attributeName="fill-opacity" values="0.03;0.1;0.03" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          )}
          <text x={n.x} y={n.y + 1.2} fontSize="3.5" fill={B} textAnchor="middle" fontFamily="monospace" opacity="0.5">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

// 2. CONFLUENCE GRID -- 5x5 matrix showing rule confluence levels with breathing heat
function ConfluenceGrid() {
  // Each cell = confluence score 0-1
  const grid = [
    [0.9, 0.7, 0.3, 0.5, 0.8],
    [0.6, 0.95, 0.4, 0.2, 0.7],
    [0.3, 0.5, 0.85, 0.6, 0.4],
    [0.4, 0.2, 0.6, 0.9, 0.5],
    [0.8, 0.6, 0.3, 0.5, 0.92],
  ]
  const sz = 8
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Grid label */}
      <text x="24" y="5" fontSize="3" fill={B} textAnchor="middle" fontFamily="monospace" opacity="0.4">CONFLUENCE</text>
      {grid.map((row, ri) => row.map((v, ci) => {
        const x = ci * (sz + 1) + 3
        const y = ri * (sz + 1) + 8
        return (
          <g key={`${ri}${ci}`}>
            <rect x={x} y={y} width={sz} height={sz}
              fill={B}
              fillOpacity={v * 0.25}
              stroke={B}
              strokeWidth="0.3"
              strokeOpacity={0.15}
            >
              <animate
                attributeName="fill-opacity"
                values={`${v * 0.12};${v * 0.3};${v * 0.12}`}
                dur={`${2.5 + ri * 0.2 + ci * 0.15}s`}
                repeatCount="indefinite"
              />
            </rect>
            {/* High confluence glow */}
            {v > 0.8 && (
              <rect x={x + 1} y={y + 1} width={sz - 2} height={sz - 2} fill={BL} fillOpacity="0.1">
                <animate attributeName="fill-opacity" values="0.05;0.15;0.05" dur="1.8s" repeatCount="indefinite" />
              </rect>
            )}
          </g>
        )
      }))}
    </svg>
  )
}

// 3. POSITION SIZING ENGINE -- risk/reward ratio wheel with animated percentages
function PositionSizer() {
  const segments = [
    { angle: 0, sweep: 72, label: "1R", opacity: 0.35 },
    { angle: 72, sweep: 54, label: "2R", opacity: 0.5 },
    { angle: 126, sweep: 90, label: "3R", opacity: 0.25 },
    { angle: 216, sweep: 36, label: "0.5R", opacity: 0.6 },
    { angle: 252, sweep: 108, label: "1.5R", opacity: 0.4 },
  ]
  const cx = 28, cy = 28, r = 20, ir = 12

  function polarToCart(a: number, radius: number) {
    const rad = ((a - 90) * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {segments.map((s, i) => {
        const start = polarToCart(s.angle, r)
        const end = polarToCart(s.angle + s.sweep, r)
        const iStart = polarToCart(s.angle, ir)
        const iEnd = polarToCart(s.angle + s.sweep, ir)
        const large = s.sweep > 180 ? 1 : 0
        const mid = polarToCart(s.angle + s.sweep / 2, (r + ir) / 2)
        return (
          <g key={i}>
            <path
              d={`M${iStart.x},${iStart.y} L${start.x},${start.y} A${r},${r} 0 ${large},1 ${end.x},${end.y} L${iEnd.x},${iEnd.y} A${ir},${ir} 0 ${large},0 ${iStart.x},${iStart.y}`}
              fill={B} fillOpacity={s.opacity * 0.15}
              stroke={B} strokeWidth="0.4" strokeOpacity="0.3"
            >
              <animate attributeName="fill-opacity" values={`${s.opacity * 0.08};${s.opacity * 0.22};${s.opacity * 0.08}`} dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
            </path>
            <text x={mid.x} y={mid.y + 1} fontSize="3" fill={BL} textAnchor="middle" fontFamily="monospace" opacity="0.5">
              {s.label}
            </text>
          </g>
        )
      })}
      {/* Center hub */}
      <circle cx={cx} cy={cy} r="5" stroke={B} strokeWidth="0.5" fill={B} fillOpacity="0.06" />
      <text x={cx} y={cy + 1.2} fontSize="3.5" fill={BL} textAnchor="middle" fontFamily="monospace" opacity="0.6">SIZE</text>
      {/* Rotating indicator arm */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - ir + 1} stroke={BL} strokeWidth="0.8" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="8s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

// 4. BACKTEST EQUITY CURVE -- smooth line with drawdown zones and growing balance
function BacktestCurve() {
  // Equity curve points
  const pts = "M2 36 Q8 34, 14 30 T26 22 T38 18 T50 14 T62 16 T70 10 T82 6 T90 4 T98 2"
  const dd = "M50 14 L54 18 L58 17 L62 16" // Drawdown segment
  return (
    <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
      {/* Background grid */}
      {[8, 16, 24, 32].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="100" y2={y} stroke={B} strokeWidth="0.2" opacity="0.08" />
      ))}
      {[20, 40, 60, 80].map((x, i) => (
        <line key={i} x1={x} y1="0" x2={x} y2="40" stroke={B} strokeWidth="0.2" opacity="0.08" />
      ))}
      {/* Area fill under curve */}
      <path d={`${pts} L98 40 L2 40 Z`} fill={B} fillOpacity="0.04">
        <animate attributeName="fill-opacity" values="0.02;0.07;0.02" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Equity line */}
      <path d={pts} stroke={B} strokeWidth="0.8" opacity="0.55">
        <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Drawdown highlight */}
      <path d={dd} stroke="rgb(239,68,68)" strokeWidth="0.7" opacity="0.3" strokeDasharray="1 1">
        <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Traveling marker on curve */}
      <circle r="2" fill={BL} opacity="0.7">
        <animateMotion dur="4s" repeatCount="indefinite" path={pts} />
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Labels */}
      <text x="4" y="38" fontSize="3" fill={B} fontFamily="monospace" opacity="0.35">START</text>
      <text x="82" y="6" fontSize="3" fill={BL} fontFamily="monospace" opacity="0.45">+342%</text>
    </svg>
  )
}

// 5. RISK MATRIX -- 4x4 probability/impact grid with pulsing risk cells
function RiskMatrix() {
  const levels = [
    // [row, col, intensity]
    [0,3,0.95],[1,2,0.7],[1,3,0.85],[2,1,0.5],[2,2,0.65],[2,3,0.8],
    [3,0,0.3],[3,1,0.45],[3,2,0.6],[3,3,0.75],
    [0,0,0.15],[0,1,0.25],[0,2,0.5],[1,0,0.2],[1,1,0.4],
    [2,0,0.3],[3,0,0.2],
  ]
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
      {/* Axis labels */}
      <text x="22" y="5" fontSize="2.8" fill={B} textAnchor="middle" fontFamily="monospace" opacity="0.4">IMPACT</text>
      <text x="2" y="30" fontSize="2.8" fill={B} fontFamily="monospace" opacity="0.4" transform="rotate(-90 2 30)">PROB</text>
      {/* Grid cells */}
      {levels.map(([r, c, v], i) => {
        const x = c * 10 + 6
        const y = r * 10 + 9
        const color = v > 0.7 ? "rgb(239,68,68)" : v > 0.45 ? "rgb(245,158,11)" : B
        return (
          <rect key={i} x={x} y={y} width="9" height="9"
            fill={color} fillOpacity={v * 0.18}
            stroke={color} strokeWidth="0.3" strokeOpacity={0.2}
          >
            <animate attributeName="fill-opacity" values={`${v * 0.08};${v * 0.25};${v * 0.08}`} dur={`${2.2 + i * 0.15}s`} repeatCount="indefinite" />
          </rect>
        )
      })}
    </svg>
  )
}

// 6. ENTRY/EXIT LOGIC FLOW -- horizontal pipeline with gates and checkpoints
function EntryExitPipeline() {
  const gates = [
    { x: 8, label: "SCAN", pass: true },
    { x: 24, label: "FILTER", pass: true },
    { x: 40, label: "CONF", pass: true },
    { x: 56, label: "SIZE", pass: true },
    { x: 72, label: "EXEC", pass: false },
    { x: 88, label: "EXIT", pass: false },
  ]
  return (
    <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
      {/* Pipeline backbone */}
      <line x1="4" y1="12" x2="96" y2="12" stroke={B} strokeWidth="0.4" opacity="0.2" />
      {/* Gates */}
      {gates.map((g, i) => (
        <g key={i}>
          {/* Gate shape */}
          <rect x={g.x - 5} y={6} width="10" height="12"
            stroke={B} strokeWidth="0.5"
            fill={B} fillOpacity={g.pass ? 0.1 : 0.03}
            strokeOpacity={g.pass ? 0.5 : 0.2}
          >
            <animate attributeName="fill-opacity" values={`${g.pass ? 0.06 : 0.02};${g.pass ? 0.15 : 0.05};${g.pass ? 0.06 : 0.02}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </rect>
          {/* Gate label */}
          <text x={g.x} y={14} fontSize="2.5" fill={g.pass ? BL : B} textAnchor="middle" fontFamily="monospace" opacity={g.pass ? 0.6 : 0.3}>
            {g.label}
          </text>
          {/* Pass/fail indicator */}
          {g.pass && (
            <circle cx={g.x} cy={4} r="1" fill={B} opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
      {/* Data packet traveling through pipeline */}
      <circle r="1.5" fill={BL} opacity="0.8">
        <animateMotion dur="3s" repeatCount="indefinite" path="M4,12 L96,12" />
        <animate attributeName="opacity" values="0;0.9;0.9;0" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Second packet offset */}
      <circle r="1" fill={B} opacity="0.5">
        <animateMotion dur="3s" repeatCount="indefinite" path="M4,12 L96,12" begin="1.5s" />
        <animate attributeName="opacity" values="0;0.6;0.6;0" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </circle>
    </svg>
  )
}

// 7. PAIR CORRELATION MATRIX -- currency pairs with correlation lines
function PairCorrelation() {
  const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"]
  const corr: [number, number, number][] = [
    [0, 1, 0.85], [0, 2, -0.6], [0, 3, 0.7],
    [1, 2, -0.45], [1, 3, 0.55], [2, 3, -0.3],
  ]
  const positions = [{ x: 15, y: 8 }, { x: 55, y: 8 }, { x: 15, y: 30 }, { x: 55, y: 30 }]

  return (
    <svg width="70" height="40" viewBox="0 0 70 40" fill="none">
      {/* Correlation lines */}
      {corr.map(([a, b, v], i) => {
        const pos = v > 0
        const color = pos ? B : "rgb(239,68,68)"
        return (
          <line key={i}
            x1={positions[a].x} y1={positions[a].y + 3}
            x2={positions[b].x} y2={positions[b].y + 3}
            stroke={color} strokeWidth={Math.abs(v) * 1.2}
            opacity={Math.abs(v) * 0.3}
            strokeDasharray={pos ? "none" : "2 1"}
          >
            <animate attributeName="opacity" values={`${Math.abs(v) * 0.15};${Math.abs(v) * 0.4};${Math.abs(v) * 0.15}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </line>
        )
      })}
      {/* Pair nodes */}
      {pairs.map((p, i) => (
        <g key={i}>
          <rect x={positions[i].x - 12} y={positions[i].y - 1} width="24" height="8"
            stroke={B} strokeWidth="0.4" fill={B} fillOpacity="0.05" />
          <text x={positions[i].x} y={positions[i].y + 5} fontSize="3" fill={BL} textAnchor="middle" fontFamily="monospace" opacity="0.55">
            {p}
          </text>
        </g>
      ))}
    </svg>
  )
}

// 8. TIMING FRAMEWORK -- clock-like session indicator with market hours
function TimingFramework() {
  const sessions = [
    { start: 0, sweep: 90, label: "ASIA", intensity: 0.3 },
    { start: 90, sweep: 90, label: "EU", intensity: 0.7 },
    { start: 180, sweep: 90, label: "US", intensity: 0.9 },
    { start: 270, sweep: 90, label: "LATE", intensity: 0.2 },
  ]
  const cx = 24, cy = 24, r = 18

  function arc(start: number, sweep: number) {
    const s = ((start - 90) * Math.PI) / 180
    const e = ((start + sweep - 90) * Math.PI) / 180
    const sx = cx + r * Math.cos(s), sy = cy + r * Math.sin(s)
    const ex = cx + r * Math.cos(e), ey = cy + r * Math.sin(e)
    return `M${cx},${cy} L${sx},${sy} A${r},${r} 0 0,1 ${ex},${ey} Z`
  }

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {sessions.map((s, i) => (
        <g key={i}>
          <path d={arc(s.start, s.sweep)} fill={B} fillOpacity={s.intensity * 0.12} stroke={B} strokeWidth="0.3" strokeOpacity="0.2">
            <animate attributeName="fill-opacity" values={`${s.intensity * 0.06};${s.intensity * 0.18};${s.intensity * 0.06}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      {/* Clock hand */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - r + 2} stroke={BL} strokeWidth="0.7" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="10s" repeatCount="indefinite" />
      </line>
      {/* Center */}
      <circle cx={cx} cy={cy} r="2" stroke={B} strokeWidth="0.5" fill={BD} fillOpacity="0.15" />
      {/* Session labels */}
      <text x={cx} y={cy - r + 6} fontSize="2.5" fill={BL} textAnchor="middle" fontFamily="monospace" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="-360 24 24" dur="10s" repeatCount="indefinite" />
        US
      </text>
    </svg>
  )
}

// 9. Blue breathing particles
function BlueParticle({ size = 4, speed = 2 }: { size?: number; speed?: number }) {
  return (
    <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`}>
      <circle cx={size} cy={size} r={size * 0.6} fill={B} opacity="0.5">
        <animate attributeName="r" values={`${size * 0.3};${size * 0.8};${size * 0.3}`} dur={`${speed}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${speed}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={size} cy={size} r={size * 0.25} fill={BL} opacity="0.7" />
    </svg>
  )
}

// ============================================================
// MAIN STRATEGY OS ORBIT FIELD
// ============================================================

interface StrategyOrbitFieldProps {
  centerX: number
  centerY: number
  isActive: boolean
}

export function StrategyOrbitField({ centerX, centerY, isActive }: StrategyOrbitFieldProps) {
  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.5s ease-out" }}>
      {/* Ambient blue glow at orbit center */}
      <div className="absolute" style={{
        left: centerX - 100,
        top: centerY - 50,
        width: 200,
        height: 100,
        background: "radial-gradient(ellipse at center, rgba(96,165,250,0.07), transparent 70%)",
      }} />

      {/* ORBIT RING 1: Close -- fast, small structural elements */}
      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={48} startAngle={15} speed={16} drift={{ x: 4, y: 3 }} delay={0} scale={0.85}>
        <RuleEngineTree />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={52} startAngle={135} speed={-14} drift={{ x: 3, y: 4 }} delay={80} scale={0.9}>
        <EntryExitPipeline />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={45} startAngle={255} speed={19} drift={{ x: 2, y: 3 }} delay={160} scale={0.8}>
        <BlueParticle size={5} speed={1.8} />
      </OrbitalSVG>

      {/* ORBIT RING 2: Medium -- larger analytical frameworks */}
      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={88} startAngle={40} speed={9} drift={{ x: 6, y: 5 }} delay={120} scale={0.95}>
        <ConfluenceGrid />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={85} startAngle={160} speed={-11} drift={{ x: 5, y: 4 }} delay={200} scale={0.9}>
        <PositionSizer />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={92} startAngle={280} speed={7} drift={{ x: 4, y: 6 }} delay={280}>
        <RiskMatrix />
      </OrbitalSVG>

      {/* ORBIT RING 3: Wide -- ambient system-level views */}
      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={128} startAngle={55} speed={5.5} drift={{ x: 8, y: 5 }} delay={300} scale={1}>
        <BacktestCurve />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={118} startAngle={175} speed={-6} drift={{ x: 7, y: 6 }} delay={360} scale={0.9}>
        <PairCorrelation />
      </OrbitalSVG>

      <OrbitalSVG cx={centerX} cy={centerY} orbitRadius={135} startAngle={290} speed={4.5} drift={{ x: 6, y: 7 }} delay={420} scale={0.95}>
        <TimingFramework />
      </OrbitalSVG>

      {/* Blue breathing particles at varied orbits */}
      {[
        { r: 38, a: 60, s: 22, d: 50 },
        { r: 62, a: 100, s: -18, d: 100 },
        { r: 72, a: 210, s: 20, d: 150 },
        { r: 98, a: 330, s: -12, d: 220 },
        { r: 108, a: 140, s: 14, d: 280 },
        { r: 142, a: 30, s: -8, d: 60 },
        { r: 58, a: 300, s: 28, d: 140 },
        { r: 148, a: 110, s: 4, d: 260 },
        { r: 76, a: 50, s: -24, d: 180 },
        { r: 115, a: 240, s: 10, d: 340 },
      ].map((p, i) => (
        <OrbitalSVG key={`bp${i}`} cx={centerX} cy={centerY} orbitRadius={p.r} startAngle={p.a} speed={p.s} drift={{ x: 3 + i * 0.5, y: 2 + i * 0.4 }} delay={p.d} scale={0.65 + (i % 4) * 0.12}>
          <BlueParticle size={2.5 + (i % 3)} speed={1.4 + i * 0.25} />
        </OrbitalSVG>
      ))}
    </div>
  )
}
