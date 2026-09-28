"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  PITCH SCAFFOLD  ·  bright paper-edition furniture for /newpitch
 *
 *  Light equivalents of the dark /design scaffold (LiveFrame, CornerTick) plus
 *  two small primitives the sections need (Chip, CommandInput) — all rendered
 *  on the bright paper token surface.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { useState } from "react"
import { DNA, MONO_CAP_TIGHT, EASE_V } from "./pitch-dna"

/* ── Corner tick (precision registration mark) ──────────────────────── */
export function CornerTick({ className, rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 ${className ?? ""}`}
      style={{
        width: 12,
        height: 12,
        transform: `rotate(${rotate}deg)`,
        borderLeft: `1px solid ${DNA.tealRuleStrong}`,
        borderTop: `1px solid ${DNA.tealRuleStrong}`,
        opacity: 0.7,
      }}
    />
  )
}

/* ── Live frame — the bright card shell for every module body ────────── */
export function LiveFrame({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <div
      className="relative"
      style={{
        background: DNA.glassStrong,
        border: `1px solid ${DNA.hair}`,
        borderRadius: DNA.rLg,
        boxShadow: DNA.shadowMd,
        padding: padded ? 24 : 0,
        overflow: "hidden",
      }}
    >
      {/* teal top hairline accent */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0"
        style={{ height: 2, background: `linear-gradient(90deg, transparent, ${DNA.tealRuleStrong}, transparent)` }}
      />
      <CornerTick className="top-2 left-2" />
      <CornerTick className="top-2 right-2" rotate={90} />
      <CornerTick className="bottom-2 right-2" rotate={180} />
      <CornerTick className="bottom-2 left-2" rotate={270} />
      {children}
    </div>
  )
}

/* ── Chip — small labelled token ────────────────────────────────────── */
export function PitchChip({ children, hot = false }: { children: React.ReactNode; hot?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono"
      style={{
        fontSize: 10.5,
        letterSpacing: "0.04em",
        color: hot ? DNA.teal : DNA.paperDim,
        padding: "5px 11px",
        borderRadius: 999,
        background: hot ? DNA.chipFillHi : DNA.chipFill,
        border: `1px solid ${hot ? DNA.tealRuleStrong : DNA.tealRule}`,
      }}
    >
      {hot ? (
        <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: DNA.teal }} />
      ) : null}
      {children}
    </span>
  )
}

/* ── Command input — the closing "ask" affordance ───────────────────── */
export function PitchCommandInput({ placeholder }: { placeholder: string }) {
  const [focus, setFocus] = useState(false)
  return (
    <label
      className="flex items-center gap-3"
      style={{
        background: DNA.glassDeep,
        border: `1px solid ${focus ? DNA.tealRuleStrong : DNA.hair}`,
        borderRadius: DNA.rMd,
        padding: "13px 16px",
        boxShadow: focus ? `0 0 0 3px ${DNA.tealWash}` : "none",
        transition: `all 0.2s ${EASE_V}`,
      }}
    >
      <span className="font-mono" style={{ color: DNA.teal, fontSize: 13 }}>›</span>
      <input
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none font-sans"
        style={{ fontSize: 14, color: DNA.paper }}
      />
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>ENTER ↵</span>
    </label>
  )
}
