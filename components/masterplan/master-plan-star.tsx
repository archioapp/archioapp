"use client"

/**
 * MASTERPLAN — pentagram constellation (DETAILED PASS v2)
 * ────────────────────────────────────────────────────────────────────────
 * A 5-vertex star with rich layered visuals:
 *   · pentagon scaffold (dashed) + inscribed inner pentagon (whisper)
 *   · 5 spokes from hub → vertices (hairlines, lit on active)
 *   · pentagram path (5 segments, lit on adjacent active)
 *   · DEPENDENCY ARCS — curved paths drawn between the active pillar
 *     and every pillar it depends on (one-shot when active changes)
 *   · SATELLITE RING — three small chip-dots orbiting the active anchor
 *     showing the pillar's sub-nodes
 *   · 5 anchor circles + 5 floating phase chips above each anchor
 *   · 5 PillarNode cards (visited & active states)
 *   · CENTER HUB with two-weight protagonist and HubBadge ledger
 *   · MINI-MAP corner widget (top-right of the star area)
 *   · BLUEPRINT MODE — when on, swaps to ortho hatching grid for
 *     "engineering schematic" feel
 *   · Constellation Legend strip (bottom)
 *
 * Click a vertex node → parent's onSelect fires, parent paints the
 * detail panel below, and this component lights up the connecting
 * geometry.
 */

import { useId, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Compass as CompassIcon } from "lucide-react"
import { PILLARS, HUB_STATS, LEGEND_KEYS, type PillarKey } from "./master-plan-data"

/* ── Theme constants ───────────────────────────────────────────────── */
const C = {
  ink: "#0c0c10",
  glass: "rgba(18,20,28,0.62)",
  glassDeep: "rgba(12,12,16,0.85)",
  rule: "rgba(255,255,255,0.08)",
  ruleSoft: "rgba(255,255,255,0.05)",
  ruleStrong: "rgba(255,255,255,0.14)",
  paper: "rgba(255,255,255,0.96)",
  paperDim: "rgba(255,255,255,0.78)",
  ash: "rgba(255,255,255,0.55)",
  ashSoft: "rgba(255,255,255,0.42)",
  ashGhost: "rgba(255,255,255,0.30)",
  amber: "#f59e0b",
  amberDeep: "#d97706",
  amberWash: "rgba(245,158,11,0.10)",
  amberHalo: "rgba(245,158,11,0.22)",
  emerald: "#10b981",
  emeraldHalo: "rgba(16,185,129,0.22)",
  rose: "#ef4444",
} as const

/* ── Star geometry ────────────────────────────────────────────────── */
function buildStarGeometry(cx: number, cy: number, rOuter: number) {
  const rInner = rOuter * 0.382
  const outer: { x: number; y: number }[] = []
  const inner: { x: number; y: number }[] = []
  for (let i = 0; i < 5; i++) {
    const aOuter = -Math.PI / 2 + i * ((Math.PI * 2) / 5)
    outer.push({ x: cx + rOuter * Math.cos(aOuter), y: cy + rOuter * Math.sin(aOuter) })
    const aInner = aOuter + Math.PI / 5
    inner.push({ x: cx + rInner * Math.cos(aInner), y: cy + rInner * Math.sin(aInner) })
  }
  const star = [outer[0], outer[2], outer[4], outer[1], outer[3], outer[0]]
  const pentagon = [...outer, outer[0]]
  return { outer, inner, star, pentagon, rOuter, rInner }
}

const VIEW = 720
const CX = VIEW / 2
const CY = VIEW / 2 + 6
const R_OUTER = 268
const GEO = buildStarGeometry(CX, CY, R_OUTER)

const ptsAttr = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")

/* Build a quadratic-bezier arc between two outer vertices, bowing
 * toward the center hub by `bow` (a fraction of the inner radius).
 * Used for dependency arcs so they read distinct from the pentagram. */
function arcPath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  bow = 0.55,
) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  // Vector from midpoint toward center
  const dx = CX - mx
  const dy = CY - my
  const len = Math.hypot(dx, dy) || 1
  const nx = dx / len
  const ny = dy / len
  const ctrlX = mx + nx * GEO.rInner * bow
  const ctrlY = my + ny * GEO.rInner * bow
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

/* ── Component ──────────────────────────────────────────────────────── */
export function MasterPlanStar({
  active,
  onSelect,
  blueprint = false,
  tourActive = false,
}: {
  /** Currently expanded pillar — null when nothing is open. */
  active: PillarKey | null
  /** Click handler — toggles the active pillar in the parent. */
  onSelect: (key: PillarKey) => void
  /** When on, swaps to the engineering-schematic visual mode. */
  blueprint?: boolean
  /** When the auto-tour is running, used by the hub badge to switch
   *  the caption from "PILLAR OPEN" to "AUTO TOUR RUNNING". */
  tourActive?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const id = useId().replace(/:/g, "")
  const gradMain = `${id}-grad-main`
  const gradHalo = `${id}-grad-halo`
  const filtGlow = `${id}-filt-glow`
  const patBlueprint = `${id}-pat-blueprint`

  const byVertex = useMemo(() => {
    const map: Record<number, (typeof PILLARS)[number]> = {} as never
    for (const p of PILLARS) map[p.vertex] = p
    return map
  }, [])

  /** Active pillar object lookup — used by deps + sub-node ring. */
  const activePillar = useMemo(
    () => (active ? PILLARS.find((p) => p.key === active) ?? null : null),
    [active],
  )

  /** Compute outward unit vector at a vertex (for satellite & phase chip
   *  placement so they push away from the star's center). */
  const outwardAt = (v: { x: number; y: number }) => {
    const dx = v.x - CX
    const dy = v.y - CY
    const len = Math.hypot(dx, dy) || 1
    return { x: dx / len, y: dy / len }
  }

  return (
    <div
      className="relative mx-auto"
      style={{
        width: "min(92vw, 760px)",
        aspectRatio: "1 / 1",
      }}
      role="group"
      aria-label="Masterplan pentagram — five pillars"
    >
      {/* ── SVG geometry layer ─────────────────────────────────────── */}
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <radialGradient id={gradMain} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0.55" />
            <stop offset="55%" stopColor={C.amber} stopOpacity="0.10" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradHalo} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id={filtGlow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b1" />
            <feGaussianBlur stdDeviation="8" in="SourceGraphic" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Blueprint hatching — orthogonal cross-hatch pattern. */}
          <pattern
            id={patBlueprint}
            width={18}
            height={18}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="18" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background wash */}
        <circle cx={CX} cy={CY} r={R_OUTER * 0.95} fill={`url(#${gradMain})`} />
        <circle cx={CX} cy={CY} r={R_OUTER * 0.55} fill={`url(#${gradHalo})`} />

        {/* Blueprint hatching — only in blueprint mode, masked to the
            outer pentagon hull so it doesn't bleed into the corners. */}
        {blueprint && (
          <polygon points={ptsAttr(GEO.pentagon)} fill={`url(#${patBlueprint})`} opacity={0.5} />
        )}

        {/* Pentagon scaffold (dashed) */}
        <polyline
          points={ptsAttr(GEO.pentagon)}
          fill="none"
          stroke={blueprint ? C.ruleStrong : C.ruleSoft}
          strokeWidth={1}
          strokeDasharray={blueprint ? "1 0" : "2 6"}
          strokeLinecap="round"
        />

        {/* Inner valley pentagon (whisper) */}
        <polyline
          points={ptsAttr([...GEO.inner, GEO.inner[0]])}
          fill="none"
          stroke={C.ruleSoft}
          strokeWidth={1}
          strokeDasharray="1 4"
        />

        {/* Spokes from hub to each vertex */}
        {GEO.outer.map((p, i) => {
          const isActiveSpoke = active != null && byVertex[i]?.key === active
          return (
            <line
              key={`spoke-${i}`}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke={isActiveSpoke ? C.amber : C.rule}
              strokeOpacity={isActiveSpoke ? 0.95 : 0.45}
              strokeWidth={isActiveSpoke ? 1.4 : 1}
              strokeDasharray={isActiveSpoke ? undefined : "2 5"}
              filter={isActiveSpoke ? `url(#${filtGlow})` : undefined}
              style={{
                transition: "stroke 240ms ease-out, stroke-opacity 240ms ease-out",
              }}
            />
          )
        })}

        {/* PENTAGRAM — 5 segments lit independently */}
        {(() => {
          const seq = [0, 2, 4, 1, 3, 0]
          const segments: { a: number; b: number }[] = []
          for (let i = 0; i < 5; i++) segments.push({ a: seq[i], b: seq[i + 1] })
          const activeVertex =
            active != null ? PILLARS.find((p) => p.key === active)?.vertex : undefined
          return segments.map((seg, i) => {
            const a = GEO.outer[seg.a]
            const b = GEO.outer[seg.b]
            const isActive =
              activeVertex !== undefined && (seg.a === activeVertex || seg.b === activeVertex)
            return (
              <line
                key={`star-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isActive ? C.amber : C.ruleStrong}
                strokeWidth={isActive ? 1.5 : 1.1}
                strokeOpacity={isActive ? 0.95 : 0.7}
                strokeLinecap="round"
                filter={isActive ? `url(#${filtGlow})` : undefined}
                style={{
                  transition:
                    "stroke 320ms ease-out, stroke-opacity 320ms ease-out, stroke-width 320ms ease-out",
                }}
              />
            )
          })
        })()}

        {/* DEPENDENCY ARCS — curved hairlines from each dependency
            vertex INTO the active vertex. Drawn above the pentagram
            so they're the loudest line on the page when active. */}
        {activePillar && activePillar.dependencies.length > 0 && (
          <g>
            {activePillar.dependencies.map((depKey, i) => {
              const dep = PILLARS.find((p) => p.key === depKey)
              if (!dep) return null
              const a = GEO.outer[dep.vertex]
              const b = GEO.outer[activePillar.vertex]
              return (
                <g key={`arc-${depKey}`}>
                  {/* glow underlay */}
                  <path
                    d={arcPath(a, b, 0.55 + i * 0.08)}
                    fill="none"
                    stroke={C.amber}
                    strokeOpacity={0.18}
                    strokeWidth={6}
                    filter={`url(#${filtGlow})`}
                  />
                  {/* main arc */}
                  <path
                    d={arcPath(a, b, 0.55 + i * 0.08)}
                    fill="none"
                    stroke={C.amber}
                    strokeOpacity={0.95}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  >
                    {!reduceMotion && (
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-14"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </path>
                  {/* tip dart on the active end */}
                  <circle cx={b.x} cy={b.y} r={3.6} fill={C.amber} filter={`url(#${filtGlow})`} />
                </g>
              )
            })}
          </g>
        )}

        {/* Traveling dot — pentagram circuit (hidden under reduced motion) */}
        {!reduceMotion && (
          <>
            <path
              id={`${id}-traveler-path`}
              d={`M ${ptsAttr(GEO.star)
                .split(" ")
                .map((p, i) => (i === 0 ? p : `L ${p}`))
                .join(" ")
                .replace(/^([^L]+)/, "$1")}`}
              fill="none"
              stroke="none"
            />
            <circle r={2.4} fill={C.amber} opacity={0.85}>
              <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${id}-traveler-path`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0.0;0.85;0.85;0.0"
                keyTimes="0;0.1;0.9;1"
                dur="14s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}

        {/* Anchor circles at each outer vertex */}
        {GEO.outer.map((p, i) => {
          const isActive = active != null && byVertex[i]?.key === active
          return (
            <g key={`anchor-${i}`}>
              {isActive && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={22}
                  fill={C.amberHalo}
                  filter={`url(#${filtGlow})`}
                  style={{ transition: "all 280ms ease-out" }}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={9}
                fill={C.glassDeep}
                stroke={isActive ? C.amber : C.ruleStrong}
                strokeWidth={1.2}
                style={{ transition: "all 240ms ease-out" }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={3}
                fill={isActive ? C.amber : C.ash}
                style={{ transition: "all 240ms ease-out" }}
              />
            </g>
          )
        })}

        {/* SATELLITE RING — orbits the active anchor with three sub-node
            dots. We render three dots on a 26px-radius ring around the
            active vertex, each with a tiny tether back to the anchor.
            Rotates slowly so the eye registers it as "alive". */}
        {activePillar && !reduceMotion && (
          <g>
            <SatelliteRing
              cx={GEO.outer[activePillar.vertex].x}
              cy={GEO.outer[activePillar.vertex].y}
              filtGlow={filtGlow}
            />
          </g>
        )}
        {activePillar && reduceMotion && (
          <g>
            <SatelliteRingStatic
              cx={GEO.outer[activePillar.vertex].x}
              cy={GEO.outer[activePillar.vertex].y}
              filtGlow={filtGlow}
            />
          </g>
        )}

        {/* Center hub disc + halo */}
        <circle cx={CX} cy={CY} r={64} fill={C.glassDeep} stroke={C.ruleStrong} strokeWidth={1} />
        <circle
          cx={CX}
          cy={CY}
          r={64}
          fill="none"
          stroke={C.amber}
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        {!reduceMotion && (
          <circle cx={CX} cy={CY} r={70} fill="none" stroke={C.amber} strokeWidth={0.8}>
            <animate attributeName="r" values="68;82;68" dur="4.6s" repeatCount="indefinite" />
            <animate
              attributeName="stroke-opacity"
              values="0.35;0.05;0.35"
              dur="4.6s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Blueprint mode — corner tick marks + measurement labels */}
        {blueprint && <BlueprintOverlay />}
      </svg>

      {/* ── HTML overlay layer ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <HubBadge active={active} tourActive={tourActive} />

        {/* Floating PHASE CHIPS above each anchor (small mono caps).
            Pushed outward along the outward unit vector so they don't
            collide with the pillar card. */}
        {PILLARS.map((p) => {
          const v = GEO.outer[p.vertex]
          const out = outwardAt(v)
          // chip sits ~36px outward from the anchor disc
          const chipX = v.x + out.x * 36
          const chipY = v.y + out.y * 36
          return (
            <PhaseChip
              key={`phase-${p.key}`}
              x={(chipX / VIEW) * 100}
              y={(chipY / VIEW) * 100}
              phase={p.phase}
              active={active === p.key}
            />
          )
        })}

        {/* Pillar node cards */}
        {PILLARS.map((p) => {
          const v = GEO.outer[p.vertex]
          return (
            <PillarNode
              key={p.key}
              x={(v.x / VIEW) * 100}
              y={(v.y / VIEW) * 100}
              vertex={p.vertex}
              icon={p.icon}
              eyebrow={p.eyebrow}
              tag={p.tag}
              title={p.title}
              headline={p.headline}
              isActive={active === p.key}
              subTags={p.subNodes.map((s) => s.tag)}
              onClick={() => onSelect(p.key)}
            />
          )
        })}
      </div>

      {/* MINI-MAP — top-right of the constellation area, tiny pentagram
          mirror of the active state. Useful for quick scan and as a
          "we know where we are" affordance. */}
      <MiniMap active={active} />

      {/* Constellation legend */}
      <Legend />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function HubBadge({
  active,
  tourActive,
}: {
  active: PillarKey | null
  tourActive: boolean
}) {
  const caption = tourActive ? "AUTO TOUR RUNNING" : active ? "PILLAR OPEN" : "PICK A PILLAR"
  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 240,
        textAlign: "center",
      }}
    >
      <motion.div
        layout
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-1.5 select-none"
      >
        <span
          className="font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 9.5,
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          MASTERPLAN · v2
        </span>

        <div className="flex items-baseline justify-center" style={{ lineHeight: 0.92 }}>
          <span
            className="font-sans"
            style={{
              fontSize: 56,
              fontWeight: 600,
              color: C.amber,
              letterSpacing: "-0.045em",
              textShadow: `0 0 24px ${C.amberHalo}`,
            }}
          >
            M
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: 56,
              fontWeight: 400,
              color: C.paper,
              letterSpacing: "-0.045em",
            }}
          >
            y Record
          </span>
        </div>

        <span
          className="font-sans italic"
          style={{ color: C.paperDim, fontSize: 11, lineHeight: 1.35, paddingInline: 4 }}
        >
          Three deep dives. One story.
        </span>

        <div className="flex items-center gap-1.5 mt-1">
          <motion.span
            aria-hidden
            animate={
              active || tourActive
                ? { boxShadow: [`0 0 0 0 ${C.amberHalo}`, `0 0 0 5px transparent`] }
                : undefined
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: active || tourActive ? C.amber : C.ashGhost,
              boxShadow: active || tourActive ? `0 0 6px ${C.amberHalo}` : "none",
              transition: "background 240ms ease-out",
            }}
          />
          <span
            className="font-mono uppercase"
            style={{
              color: active || tourActive ? C.amber : C.ashGhost,
              fontSize: 8.5,
              letterSpacing: "0.24em",
              fontWeight: 500,
            }}
          >
            {caption}
          </span>
        </div>
      </motion.div>

      {/* HUB STATS strip below */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "50%", top: "calc(100% + 18px)", transform: "translateX(-50%)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-1.5 rounded-full"
          style={{
            background: C.glass,
            border: `1px solid ${C.ruleSoft}`,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            whiteSpace: "nowrap",
          }}
        >
          {HUB_STATS.map((s, i) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span
                className="font-mono uppercase"
                style={{
                  color: C.ashGhost,
                  fontSize: 8.5,
                  letterSpacing: "0.22em",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{
                  color: s.tone === "amber" ? C.amber : s.tone === "emerald" ? C.emerald : C.paper,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.value}
              </span>
              {i < HUB_STATS.length - 1 && (
                <span
                  aria-hidden
                  className="inline-block"
                  style={{
                    width: 1,
                    height: 8,
                    background: C.ruleSoft,
                    marginInline: 2,
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Phase chip — tiny pill above each anchor disc showing the rollout
 *  phase for that pillar. Positioned in screen-percent coords by
 *  the parent so it sits exactly where outwardAt() points. */
function PhaseChip({
  x,
  y,
  phase,
  active,
}: {
  x: number
  y: number
  phase: 1 | 2 | 3
  active: boolean
}) {
  return (
    <span
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono uppercase"
        style={{
          background: active ? C.amberWash : C.glassDeep,
          border: `1px solid ${active ? C.amber : C.ruleSoft}`,
          color: active ? C.amber : C.ashSoft,
          fontSize: 8,
          letterSpacing: "0.22em",
          fontWeight: 500,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          whiteSpace: "nowrap",
          transition: "all 240ms ease-out",
        }}
      >
        <span
          aria-hidden
          className="inline-block rounded-full"
          style={{
            width: 4,
            height: 4,
            background: active ? C.amber : C.ash,
            boxShadow: active ? `0 0 4px ${C.amber}` : "none",
          }}
        />
        P0{phase}
      </span>
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Three orbiting sub-node dots around the active vertex. Animated
 *  group rotates slowly. The dots are SVG circles with tiny tethers. */
function SatelliteRing({
  cx,
  cy,
  filtGlow,
}: {
  cx: number
  cy: number
  filtGlow: string
}) {
  const radius = 22
  // Three dots at 120° apart
  const dots = [0, 1, 2].map((i) => {
    const a = (i * 2 * Math.PI) / 3
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius, idx: i }
  })
  return (
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" } as never}
      // Note: transformOrigin in SVG via React style doesn't accept the px-string
      // form on every browser; we additionally use a transform attribute below.
    >
      <g transform={`translate(${cx} ${cy})`}>
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill="none"
          stroke={C.amber}
          strokeOpacity={0.22}
          strokeWidth={0.8}
          strokeDasharray="2 3"
        />
        {dots.map((d) => (
          <g key={d.idx}>
            <line
              x1={0}
              y1={0}
              x2={d.x}
              y2={d.y}
              stroke={C.amber}
              strokeOpacity={0.32}
              strokeWidth={0.8}
            />
            <circle
              cx={d.x}
              cy={d.y}
              r={3}
              fill={C.amber}
              filter={`url(#${filtGlow})`}
            />
            <circle cx={d.x} cy={d.y} r={1.4} fill={C.glassDeep} />
          </g>
        ))}
      </g>
    </motion.g>
  )
}

/** Static fallback when prefers-reduced-motion is on. */
function SatelliteRingStatic({
  cx,
  cy,
  filtGlow,
}: {
  cx: number
  cy: number
  filtGlow: string
}) {
  const radius = 22
  const dots = [0, 1, 2].map((i) => {
    const a = (i * 2 * Math.PI) / 3
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius }
  })
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill="none"
        stroke={C.amber}
        strokeOpacity={0.22}
        strokeWidth={0.8}
        strokeDasharray="2 3"
      />
      {dots.map((d, i) => (
        <g key={i}>
          <line
            x1={0}
            y1={0}
            x2={d.x}
            y2={d.y}
            stroke={C.amber}
            strokeOpacity={0.32}
            strokeWidth={0.8}
          />
          <circle cx={d.x} cy={d.y} r={3} fill={C.amber} filter={`url(#${filtGlow})`} />
        </g>
      ))}
    </g>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function PillarNode({
  x,
  y,
  vertex,
  icon: Icon,
  eyebrow,
  tag,
  title,
  headline,
  isActive,
  subTags,
  onClick,
}: {
  x: number
  y: number
  vertex: 0 | 1 | 2 | 3 | 4
  icon: LucideIcon
  eyebrow: string
  tag: string
  title: string
  headline: [string, string]
  isActive: boolean
  subTags: string[]
  onClick: () => void
}) {
  const placement: Record<number, { tx: string; ty: string; align: "left" | "right" | "center" }> =
    {
      0: { tx: "-50%", ty: "calc(-100% - 14px)", align: "center" },
      1: { tx: "10px", ty: "-50%", align: "left" },
      2: { tx: "10px", ty: "calc(-100% + 110%)", align: "left" },
      3: { tx: "calc(-100% - 10px)", ty: "calc(-100% + 110%)", align: "right" },
      4: { tx: "calc(-100% - 10px)", ty: "-50%", align: "right" },
    }
  const place = placement[vertex]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute pointer-events-auto group text-left"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(${place.tx}, ${place.ty})`,
        textAlign: place.align,
        width: 232,
      }}
      aria-pressed={isActive}
      aria-label={`${tag} pillar — ${title}`}
    >
      <div
        className="relative flex flex-col gap-2 px-3.5 py-3"
        style={{
          background: isActive ? "rgba(245,158,11,0.06)" : C.glass,
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
          border: `1px solid ${isActive ? "rgba(245,158,11,0.45)" : C.rule}`,
          borderRadius: 14,
          boxShadow: isActive
            ? `0 0 0 1px ${C.amberHalo}, 0 18px 42px rgba(0,0,0,0.45), 0 0 28px ${C.amberHalo}`
            : `0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 30px rgba(0,0,0,0.36)`,
          transition: "all 280ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center rounded-md"
            style={{
              width: 22,
              height: 22,
              background: isActive ? C.amberWash : "rgba(255,255,255,0.04)",
              border: `1px solid ${isActive ? "rgba(245,158,11,0.4)" : C.rule}`,
              color: isActive ? C.amber : C.ashSoft,
              transition: "all 240ms ease-out",
            }}
          >
            <Icon size={12} strokeWidth={1.6} />
          </span>
          <span
            className="font-mono uppercase truncate"
            style={{
              color: isActive ? C.amber : C.ashGhost,
              fontSize: 8.5,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        </div>

        <span
          aria-hidden
          className="block w-full"
          style={{
            height: 1,
            backgroundImage: `linear-gradient(90deg, transparent, ${C.ruleSoft} 18%, ${C.ruleSoft} 82%, transparent)`,
          }}
        />

        <div className="flex items-baseline gap-1.5" style={{ lineHeight: 0.96 }}>
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: isActive ? C.amber : C.paper,
              letterSpacing: "-0.04em",
              transition: "color 240ms ease-out",
            }}
          >
            {headline[0]}
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: C.ash,
              letterSpacing: "-0.005em",
            }}
          >
            {headline[1]}
          </span>
        </div>

        <p
          className="font-sans"
          style={{
            color: C.paperDim,
            fontSize: 11.5,
            fontWeight: 400,
            letterSpacing: "-0.005em",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </p>

        {/* Sub-tags strip — appears in slim form by default, expands
            into a 3-chip row when this pillar is active. */}
        <div className="flex items-center gap-1 flex-wrap">
          {subTags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="font-mono uppercase"
              style={{
                fontSize: 7.5,
                letterSpacing: "0.22em",
                color: isActive ? C.paperDim : C.ashGhost,
                background: isActive ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px dashed ${isActive ? "rgba(245,158,11,0.35)" : C.ruleSoft}`,
                borderRadius: 999,
                padding: "1.5px 6px",
                transition: "all 240ms ease-out",
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <span
            className="font-sans"
            style={{
              fontSize: 9.5,
              color: isActive ? C.amber : C.ashSoft,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "color 240ms ease-out",
            }}
          >
            {tag}
          </span>
          <span
            className="inline-flex items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
            style={{
              width: 14,
              height: 14,
              background: isActive ? C.amber : "transparent",
              border: `1px solid ${isActive ? C.amber : C.rule}`,
              color: isActive ? C.ink : C.ashSoft,
              fontSize: 9,
              fontWeight: 600,
              transition: "all 240ms ease-out, transform 200ms ease-out",
            }}
            aria-hidden
          >
            ›
          </span>
        </div>

        <span
          aria-hidden
          className="font-mono uppercase absolute"
          style={{
            top: 6,
            right: 8,
            color: C.ashGhost,
            fontSize: 8,
            letterSpacing: "0.18em",
            opacity: 0.6,
          }}
        >
          0{vertex + 1}
        </span>
      </div>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Mini-map — tiny pentagram in the top-right corner showing the
 *  active vertex as a filled amber dot. Helps orient the eye when
 *  the main star is deep in the page. */
function MiniMap({ active }: { active: PillarKey | null }) {
  const size = 76
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 6
  // Build a tiny version of the same geometry
  const verts: { x: number; y: number }[] = []
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * ((Math.PI * 2) / 5)
    verts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) })
  }
  const seq = [0, 2, 4, 1, 3, 0]
  const starPts = seq.map((i) => verts[i])
  const activeVertex = active ? PILLARS.find((p) => p.key === active)?.vertex : undefined
  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center gap-1"
      style={{
        top: 4,
        right: 4,
      }}
    >
      <div
        className="rounded-xl flex flex-col items-center px-2.5 pt-2 pb-1.5"
        style={{
          background: C.glass,
          border: `1px solid ${C.ruleSoft}`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 7.5,
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          MINI · MAP
        </span>
        <svg width={size} height={size} aria-hidden>
          {/* dashed outer pentagon */}
          <polyline
            points={[...verts, verts[0]].map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={C.ruleSoft}
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          {/* star */}
          <polyline
            points={starPts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={C.ruleStrong}
            strokeWidth={1}
          />
          {/* anchors */}
          {verts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={i === activeVertex ? C.amber : C.ash}
              opacity={i === activeVertex ? 1 : 0.5}
              style={{ transition: "fill 240ms ease-out, opacity 240ms ease-out" }}
            />
          ))}
        </svg>
        <span
          className="font-mono uppercase mt-0.5"
          style={{
            color: activeVertex !== undefined ? C.amber : C.ashGhost,
            fontSize: 8,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          {activeVertex !== undefined ? `0${(activeVertex ?? 0) + 1} / 05` : "— / 05"}
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Blueprint mode overlay — corner ticks + measurement labels that
 *  give the page a "engineering schematic" feel. Pure SVG group. */
function BlueprintOverlay() {
  return (
    <g>
      {/* corner crosshairs */}
      {[
        [40, 40],
        [VIEW - 40, 40],
        [40, VIEW - 40],
        [VIEW - 40, VIEW - 40],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke={C.ashGhost} strokeWidth="0.8" />
          <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke={C.ashGhost} strokeWidth="0.8" />
        </g>
      ))}
      {/* radius dimension line — center → top vertex */}
      <g>
        <line
          x1={CX}
          y1={CY}
          x2={GEO.outer[0].x}
          y2={GEO.outer[0].y}
          stroke={C.ashGhost}
          strokeWidth="0.6"
          strokeDasharray="1 3"
        />
        <text
          x={CX + 6}
          y={CY - R_OUTER / 2}
          fill={C.ashGhost}
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.18em"
        >
          R = {R_OUTER}
        </text>
      </g>
      {/* phi ratio annotation */}
      <text
        x={CX - 32}
        y={CY + R_OUTER * 0.382 + 14}
        fill={C.ashGhost}
        fontSize="9"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        ϕ⁻² · 0.382
      </text>
    </g>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function Legend() {
  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center gap-1"
      style={{
        left: "50%",
        bottom: -52,
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="flex items-center gap-3 px-3 py-1.5 rounded-full"
        style={{
          background: C.glass,
          border: `1px solid ${C.ruleSoft}`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          className="inline-flex items-center gap-1 font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 8.5,
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          <CompassIcon size={10} strokeWidth={1.7} />
          CONSTELLATION KEY
        </span>
        <LegendDivider />
        {LEGEND_KEYS.map((k, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <LegendDot color={k.dot === "amber" ? C.amber : k.dot === "emerald" ? C.emerald : k.dot === "rose" ? C.rose : C.ash} />
            <span
              className="font-mono uppercase"
              style={{
                color: C.ashSoft,
                fontSize: 8.5,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              {k.label}
            </span>
            {i < LEGEND_KEYS.length - 1 && <LegendDivider />}
          </span>
        ))}
      </div>
    </div>
  )
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full"
      style={{ width: 6, height: 6, background: color, boxShadow: `0 0 6px ${color}55` }}
    />
  )
}

function LegendDivider() {
  return (
    <span
      aria-hidden
      className="inline-block"
      style={{ width: 1, height: 8, background: C.ruleSoft }}
    />
  )
}
