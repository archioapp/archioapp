"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  PITCH INSTRUMENTS  ·  bespoke cockpit visualizations for /newpitch
 *
 *  Built entirely from the platform Visual DNA — teal, risk-red/amber, glass,
 *  mono caps, corner ticks. Each instrument animates on first reveal using the
 *  shared EASE_V grammar and respects prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { DNA, MONO_CAP_TIGHT, EASE_V, accentFor, withAlpha, type Severity } from "./pitch-dna"

/* ── Reveal-on-view hook ────────────────────────────────────────────── */
export function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setShown(true)
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, shown }
}

/* ═══════════════════════════════════════════════════════════════════════
   STAT READOUT  ·  big value · unit · label instrument cell
   ═══════════════════════════════════════════════════════════════════════ */

export function StatReadout({
  value,
  unit,
  label,
  sev = "teal",
}: {
  value: string
  unit?: string
  label: string
  sev?: Severity
}) {
  const a = accentFor(sev)
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col gap-2"
      style={{
        background: DNA.glassStrong,
        border: `1px solid ${hover ? a.edge : DNA.tealRule}`,
        borderRadius: DNA.rMd,
        padding: "16px 18px",
        transition: `all 0.28s ${EASE_V}`,
        boxShadow: hover ? `0 0 26px -14px ${a.halo}` : "none",
      }}
    >
      <div className="flex items-baseline gap-1">
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 30, fontWeight: 500, color: a.ink, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {value}
        </span>
        {unit ? (
          <span className="font-mono" style={{ fontSize: 15, color: withAlpha(a.ink, 0.7) }}>
            {unit}
          </span>
        ) : null}
      </div>
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>{label}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   METER BAR  ·  horizontal fill with leading label + trailing value
   ═══════════════════════════════════════════════════════════════════════ */

export function MeterBar({
  label,
  value,
  pct,
  sev = "teal",
  delay = 0,
}: {
  label: string
  value: string
  pct: number
  sev?: Severity
  delay?: number
}) {
  const a = accentFor(sev)
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-sans" style={{ fontSize: 13, color: DNA.paper }}>
          {label}
        </span>
        <span className="font-mono tabular-nums" style={{ fontSize: 13, color: a.ink }}>
          {value}
        </span>
      </div>
      <div
        className="relative overflow-hidden"
        style={{ height: 8, borderRadius: 999, background: DNA.glassDeep, border: `1px solid ${DNA.tealRule}` }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left",
            transform: `scaleX(${shown ? Math.min(pct, 100) / 100 : 0})`,
            background: `linear-gradient(90deg, ${withAlpha(a.ink, 0.35)}, ${a.ink})`,
            boxShadow: `0 0 12px -2px ${a.halo}`,
            transition: `transform 0.9s ${EASE_V} ${delay}s`,
          }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CONCENTRIC ARCS  ·  TAM / SAM / SOM nested gauge
   ═══════════════════════════════════════════════════════════════════════ */

export function ConcentricArcs({
  rings,
  size = 280,
}: {
  rings: { tier: string; value: string; pct: number }[]
  size?: number
}) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const cx = size / 2
  const cy = size / 2
  const stroke = 12
  const gap = 22
  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label="Market funnel: TAM, SAM, SOM">
        {rings.map((r, i) => {
          const radius = size / 2 - stroke - i * gap
          const circ = 2 * Math.PI * radius
          const arc = (r.pct / 100) * circ * 0.75 // 270° sweep
          const ringTone =
            i === 0 ? withAlpha(DNA.teal, 0.45) : i === 1 ? withAlpha(DNA.teal, 0.72) : DNA.teal
          return (
            <g key={r.tier} transform={`rotate(135 ${cx} ${cy})`}>
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={DNA.tealRule}
                strokeWidth={stroke}
                strokeDasharray={`${circ * 0.75} ${circ}`}
                strokeLinecap="round"
              />
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={ringTone}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${arc} ${circ}`}
                style={{
                  opacity: shown ? 1 : 0,
                  strokeDashoffset: shown ? 0 : arc,
                  transition: `stroke-dashoffset 1.1s ${EASE_V} ${i * 0.15}s, opacity 0.4s ${EASE_V} ${i * 0.15}s`,
                  filter: `drop-shadow(0 0 6px ${withAlpha(DNA.teal, 0.4)})`,
                }}
              />
            </g>
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>SOM · 3YR</span>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 26, color: DNA.teal, letterSpacing: "-0.02em", textShadow: `0 0 14px ${DNA.tealHalo}` }}
        >
          {rings[rings.length - 1]?.value}
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   FRACTURE DIAGRAM  ·  one intent line shattering into N nodes
   ═══════════════════════════════════════════════════════════════════════ */

export function FractureDiagram({
  nodes,
  activeId,
  onSelect,
}: {
  nodes: { id: string; name: string; tools: number; sev: Severity }[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* origin */}
      <div className="flex items-center gap-3">
        <span
          className="archio-breathe"
          aria-hidden
          style={{ width: 8, height: 8, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 12px ${DNA.teal}` }}
        />
        <span
          className="font-mono inline-flex items-center gap-2"
          style={{
            ...MONO_CAP_TIGHT,
            fontSize: 10,
            color: DNA.teal,
            padding: "8px 14px",
            borderRadius: 999,
            border: `1px solid ${DNA.tealRuleStrong}`,
            background: DNA.tealWash,
          }}
        >
          ONE TRADE IDEA
        </span>
        <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.riskInk }}>SHATTERS INTO →</span>
      </div>

      {/* nodes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {nodes.map((n, i) => {
          const active = n.id === activeId
          const a = accentFor(n.sev)
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelect(n.id)}
              className="group relative flex flex-col items-center gap-2 text-center"
              style={{
                background: active ? a.wash : DNA.glassStrong,
                border: `1px solid ${active ? a.edge : DNA.tealRule}`,
                borderRadius: DNA.rMd,
                padding: "16px 10px",
                cursor: "pointer",
                transform: active ? "translateY(-3px)" : "none",
                boxShadow: active ? `0 0 28px -12px ${a.halo}` : "none",
                transition: `all 0.28s ${EASE_V}`,
              }}
            >
              {/* fracture connector glyph */}
              <span aria-hidden style={{ ...MONO_CAP_TIGHT, fontSize: 7.5, color: DNA.ashGhost }}>
                {String(i + 1).padStart(2, "0")} · BREAK
              </span>
              <span
                aria-hidden
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: active ? a.wash : DNA.glassDeep,
                  border: `1px solid ${active ? a.edge : DNA.tealRule}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: a.ink,
                  fontSize: 13,
                }}
              >
                ◇
              </span>
              <span className="font-sans" style={{ fontSize: 12, color: active ? DNA.paper : DNA.paperDim, lineHeight: 1.2 }}>
                {n.name}
              </span>
              <span style={{ ...MONO_CAP_TIGHT, fontSize: 8, color: a.ink }}>{n.tools} TOOLS</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   LAYER STACK  ·  vertical architecture layers
   ═══════════════════════════════════════════════════════════════════════ */

export function LayerStack({
  layers,
}: {
  layers: { id: string; name: string; role: string; nodes: string[]; tech: string; metric: string; sev: Severity }[]
}) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-2">
      {layers.map((l, i) => {
        const a = accentFor(l.sev)
        const isActive = active === l.id
        return (
          <div key={l.id} className="flex items-stretch gap-3">
            {/* rail */}
            <div className="flex flex-col items-center" style={{ width: 24 }}>
              <span
                aria-hidden
                style={{ width: 7, height: 7, borderRadius: 999, background: a.ink, boxShadow: `0 0 8px ${a.ink}`, marginTop: 22 }}
              />
              {i < layers.length - 1 ? (
                <span aria-hidden className="flex-1" style={{ width: 1, marginTop: 4, background: DNA.tealRule }} />
              ) : null}
            </div>
            <button
              type="button"
              onMouseEnter={() => setActive(l.id)}
              onMouseLeave={() => setActive(null)}
              className="flex-1 text-left"
              style={{
                background: isActive ? a.wash : DNA.glassStrong,
                border: `1px solid ${isActive ? a.edge : DNA.tealRule}`,
                borderRadius: DNA.rMd,
                padding: "14px 18px",
                cursor: "default",
                transition: `all 0.28s ${EASE_V}`,
                boxShadow: isActive ? `0 0 24px -14px ${a.halo}` : "none",
              }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashGhost }}>L{layers.length - i}</span>
                  <span className="font-sans" style={{ fontSize: 15, color: DNA.paper }}>
                    {l.name}
                  </span>
                </div>
                <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: a.ink }}>{l.metric}</span>
              </div>
              <p className="font-sans mt-1.5" style={{ fontSize: 12.5, color: DNA.ash, lineHeight: 1.5 }}>
                {l.role}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {l.nodes.map((node) => (
                  <span
                    key={node}
                    className="font-mono"
                    style={{
                      fontSize: 9.5,
                      color: DNA.paperDim,
                      padding: "3px 8px",
                      borderRadius: 999,
                      border: `1px solid ${DNA.tealRule}`,
                      background: DNA.chipFill,
                    }}
                  >
                    {node}
                  </span>
                ))}
                <span className="font-mono ml-auto" style={{ fontSize: 9.5, color: DNA.ashSoft, letterSpacing: "0.04em" }}>
                  {l.tech}
                </span>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SCENARIO TRIAD  ·  bear / base / bull vertical meters
   ═══════════════════════════════════════════════════════════════════════ */

export function ScenarioTriad({
  scenarios,
}: {
  scenarios: { tier: string; value: string; note: string; sev: Severity; pct: number }[]
}) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {scenarios.map((s, i) => {
        const a = accentFor(s.sev)
        return (
          <div
            key={s.tier}
            className="relative flex flex-col gap-4"
            style={{
              background: DNA.glassStrong,
              border: `1px solid ${DNA.tealRule}`,
              borderRadius: DNA.rLg,
              padding: 20,
              overflow: "hidden",
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: a.ink }}>{s.tier}</span>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 22, color: DNA.paper, letterSpacing: "-0.02em" }}
              >
                {s.value}
              </span>
            </div>
            {/* vertical fill */}
            <div className="relative overflow-hidden" style={{ height: 90, borderRadius: DNA.rSm, background: DNA.glassDeep, border: `1px solid ${DNA.tealRule}` }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${s.pct}%`,
                  transformOrigin: "bottom",
                  transform: shown ? "scaleY(1)" : "scaleY(0)",
                  background: `linear-gradient(0deg, ${a.ink}, ${withAlpha(a.ink, 0.2)})`,
                  boxShadow: `0 0 18px -4px ${a.halo}`,
                  transition: `transform 0.9s ${EASE_V} ${i * 0.12}s`,
                }}
              />
            </div>
            <p className="font-sans" style={{ fontSize: 12, color: DNA.ash, lineHeight: 1.5 }}>
              {s.note}
            </p>
          </div>
        )
      })}
    </div>
  )
}
