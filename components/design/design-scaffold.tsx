"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  DESIGN SCAFFOLD  ·  shared chrome for the /design master palette
 *
 *  The structural furniture every specimen section is mounted in:
 *  numbered section labels, the instrumented "live frame" with corner
 *  ticks, meta rows, spec blocks, captions, and small mono/label atoms.
 *
 *  These are NOT platform UI — they are the museum's vitrines. The actual
 *  reusable platform primitives live in `archio-kit.tsx`.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { useEffect, useState } from "react"
import { DNA, MONO_CAP, MONO_CAP_TIGHT } from "./design-tokens"

/* ── ClientOnly ──────────────────────────────────────────────────────────
 *  The live production surfaces (FlightDeck, MacroAlertSheet) render their
 *  own clocks, session timers, and tick readouts at render time, so their
 *  server HTML never matches the first client paint. Mounting them only
 *  after hydration keeps the master palette free of hydration-mismatch
 *  warnings while preserving an exact, reserved space during SSR.
 * ──────────────────────────────────────────────────────────────────────── */

export function ClientOnly({
  children,
  minHeight,
}: {
  children: React.ReactNode
  minHeight?: number
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="flex items-center justify-center"
        style={{ minHeight: minHeight ?? 280 }}
      >
        <span
          className="font-mono"
          style={{
            ...MONO_CAP_TIGHT,
            fontSize: 9,
            color: DNA.ashSoft,
            opacity: 0.6,
            animation: "archio-breathe 1.8s ease-in-out infinite",
          }}
        >
          MOUNTING LIVE SURFACE…
        </span>
      </div>
    )
  }

  return <>{children}</>
}

/* ── Section label ───────────────────────────────────────────────────── */

export function SectionLabel({
  number,
  title,
  caption,
  sourcePath,
  badge = "LIVE",
}: {
  number: string
  title: string
  caption: string
  sourcePath?: string
  badge?: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 13,
            color: DNA.teal,
            letterSpacing: "0.18em",
            fontWeight: 500,
            textShadow: `0 0 12px ${DNA.tealHalo}`,
          }}
        >
          {number}
        </span>
        <span aria-hidden style={{ width: 32, height: 1, background: DNA.tealRuleStrong }} />
        <span style={{ ...MONO_CAP, fontSize: 11, color: DNA.paper, letterSpacing: "0.32em" }}>
          {title}
        </span>
        {badge ? (
          <span
            style={{
              ...MONO_CAP_TIGHT,
              fontSize: 9,
              color: DNA.teal,
              padding: "3px 8px",
              border: `1px solid ${DNA.tealRule}`,
              borderRadius: 999,
              background: DNA.tealWash,
            }}
          >
            {badge}
          </span>
        ) : null}
        <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
        {sourcePath ? (
          <code
            style={{
              fontSize: 11,
              color: DNA.ashSoft,
              fontFamily: "var(--font-mono), ui-monospace, monospace",
            }}
          >
            {sourcePath}
          </code>
        ) : null}
      </div>
      <p
        className="font-sans text-pretty"
        style={{
          fontSize: 14,
          color: DNA.paperDim,
          letterSpacing: "0.005em",
          maxWidth: 820,
          lineHeight: 1.55,
        }}
      >
        {caption}
      </p>
    </div>
  )
}

/* ── Live frame (instrumented vitrine) ───────────────────────────────── */

export function LiveFrame({
  children,
  padded,
}: {
  children: React.ReactNode
  padded?: boolean
}) {
  return (
    <div
      className="relative"
      style={{
        background: DNA.glass,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: DNA.rLg,
        boxShadow: `0 1px 0 0 ${DNA.tealHalo} inset, 0 30px 60px -40px rgba(0,0,0,0.6)`,
        padding: padded ? 24 : 0,
        overflow: "hidden",
      }}
    >
      <CornerTick className="top-2 left-2" />
      <CornerTick className="top-2 right-2" rotate={90} />
      <CornerTick className="bottom-2 right-2" rotate={180} />
      <CornerTick className="bottom-2 left-2" rotate={270} />
      <div className="relative" style={{ borderRadius: DNA.rLg }}>
        {children}
      </div>
    </div>
  )
}

export function CornerTick({
  className,
  rotate = 0,
}: {
  className?: string
  rotate?: number
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 ${className ?? ""}`}
      style={{
        width: 14,
        height: 14,
        transform: `rotate(${rotate}deg)`,
        borderLeft: `1px solid ${DNA.teal}`,
        borderTop: `1px solid ${DNA.teal}`,
        opacity: 0.55,
      }}
    />
  )
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-b pb-2"
      style={{ borderColor: DNA.tealRule }}
    >
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>{label}</span>
      <span
        className="font-mono tabular-nums"
        style={{ fontSize: 11, color: DNA.paper, letterSpacing: "0.04em" }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── Spec primitives (small documentation atoms) ─────────────────────── */

/** A monospace eyebrow caption used to label each specimen. */
export function SpecLabel({
  children,
  color = DNA.ashSoft,
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color, display: "inline-block" }}>
      {children}
    </span>
  )
}

/** A bordered specimen cell — the building block of every documentation grid. */
export function SpecCell({
  children,
  label,
  className,
  style,
}: {
  children: React.ReactNode
  label?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`relative flex flex-col gap-3 ${className ?? ""}`}
      style={{
        background: DNA.glassStrong,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: DNA.rMd,
        padding: 18,
        ...style,
      }}
    >
      {label ? <SpecLabel>{label}</SpecLabel> : null}
      {children}
    </div>
  )
}

/** A token row: swatch name + value, mono, for the spec sheets. */
export function TokenLine({
  name,
  value,
  swatch,
}: {
  name: string
  value: string
  swatch?: string
}) {
  return (
    <div className="flex items-center gap-3">
      {swatch ? (
        <span
          aria-hidden
          className="shrink-0"
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: swatch,
            border: `1px solid ${DNA.tealRule}`,
          }}
        />
      ) : null}
      <span
        className="font-mono"
        style={{ fontSize: 11, color: DNA.paperDim, minWidth: 92, letterSpacing: "0.02em" }}
      >
        {name}
      </span>
      <span
        className="font-mono tabular-nums ml-auto"
        style={{ fontSize: 10.5, color: DNA.ash, letterSpacing: "0.02em" }}
      >
        {value}
      </span>
    </div>
  )
}
