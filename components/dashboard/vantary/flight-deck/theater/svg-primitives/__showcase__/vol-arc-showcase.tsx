"use client"

/**
 * ═════════════════════════════════════════════════════════════════════════
 *  VolArc Showcase  ·  Theater Deck · Gadget #1
 * ─────────────────────────────────────────────────────────────────────────
 *  An exhibition surface for the VolArc primitive. Eight variants on a
 *  single canvas so every tone, scale, size, and animation behavior can be
 *  reviewed in isolation before VolArc is wired into theaters.
 *
 *  The variants are deliberately ordered to expose a *progression*:
 *    1. neutral baseline       → 4. amber elevated
 *    2. info default           → 5. red breach
 *    3. positive on-target     → 6. critical pulsing
 *    7. info full-circle       → 8. with tick labels visible
 * ═════════════════════════════════════════════════════════════════════════
 */

import * as React from "react"

import { VolArc } from "@/components/dashboard/vantary/flight-deck/theater/svg-primitives/vol-arc"
import { VANTARY } from "@/components/dashboard/vantary/vantary-theme"

/* ─────────────────────────────────────────────────────────────────────── */

const MONO_CAP: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 9,
  letterSpacing: "0.20em",
  textTransform: "uppercase",
}

interface VariantSpec {
  title: string
  caption: string
  node: React.ReactNode
}

const VARIANTS: VariantSpec[] = [
  {
    title: "01 · NEUTRAL",
    caption: "Ash-routed default. Use for non-severity scales — counts, fractions, neutral metrics.",
    node: (
      <VolArc
        value={1.6}
        max={4}
        tone="neutral"
        topLabel="EXPECTED VOL"
        bottomLabel="VS BASELINE"
        size={220}
      />
    ),
  },
  {
    title: "02 · INFO · BRAND",
    caption: "Teal — the Vantary primary. The default tone for most flight-deck instruments.",
    node: (
      <VolArc
        value={2.4}
        max={4}
        tone="info"
        topLabel="EXPECTED VOL"
        bottomLabel="EUR/USD"
        size={220}
      />
    ),
  },
  {
    title: "03 · POSITIVE",
    caption: "Emerald. On-target / gain / desirable state. Confirms a bias.",
    node: (
      <VolArc
        value={73}
        min={0}
        max={100}
        tone="positive"
        topLabel="HIT-RATE"
        bottomLabel="LAST 30 DAYS"
        formatValue={(n) => `${Math.round(n)}%`}
        size={220}
      />
    ),
  },
  {
    title: "04 · WARN",
    caption: "Amber. Elevated state — watch this. The brand's amber severity tone.",
    node: (
      <VolArc
        value={2.4}
        max={4}
        tone="warn"
        topLabel="EXPECTED VOL"
        bottomLabel="ECB DECISION"
        size={220}
      />
    ),
  },
  {
    title: "05 · DANGER",
    caption: "Red. Breach state — a threshold has been crossed.",
    node: (
      <VolArc
        value={91}
        min={0}
        max={100}
        tone="danger"
        topLabel="ACTIVITY"
        bottomLabel="OF DAILY MAX"
        formatValue={(n) => `${Math.round(n)}%`}
        size={220}
      />
    ),
  },
  {
    title: "06 · CRITICAL · PULSING",
    caption: "Halo breathes 2.6s instead of 6s — eye-magnet for alarm-grade states.",
    node: (
      <VolArc
        value={100}
        min={0}
        max={100}
        tone="critical"
        topLabel="CAPACITY"
        bottomLabel="HARD LIMIT"
        formatValue={(n) => `${Math.round(n)}%`}
        size={220}
      />
    ),
  },
  {
    title: "07 · FULL CIRCLE",
    caption: "0–360° sweep. For alignment / completion / progress where 100% is a closed loop.",
    node: (
      <VolArc
        value={91}
        min={0}
        max={100}
        tone="info"
        topLabel="ALIGNMENT"
        bottomLabel="LIQUIDITY-HUNTERS"
        formatValue={(n) => `${Math.round(n)}%`}
        startAngle={180}
        sweepAngle={360}
        size={220}
        ticks={6}
      />
    ),
  },
  {
    title: "08 · WITH TICK LABELS",
    caption: "Tick labels render outside the arc — for instruments where the scale matters.",
    node: (
      <VolArc
        value={2.4}
        max={4}
        tone="info"
        topLabel="EXPECTED VOL"
        bottomLabel="VS BASELINE"
        size={220}
        showTickLabels
        formatTick={(n) => `${n}×`}
      />
    ),
  },
]

/* ─────────────────────────────────────────────────────────────────────── */

export function VolArcShowcase() {
  // A single re-mount controller so reviewers can replay all eight
  // entrance choreographies in lockstep without a page refresh.
  const [replayKey, setReplayKey] = React.useState(0)

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 24,
        border: `1px solid ${VANTARY.rule}`,
        background: VANTARY.glass,
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        overflow: "hidden",
      }}
    >
      {/* Replay rail */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: `1px solid ${VANTARY.ruleSoft}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: 999,
              background: VANTARY.teal,
              boxShadow: `0 0 8px ${VANTARY.teal}, 0 0 16px ${VANTARY.tealHalo}`,
            }}
          />
          <span style={{ ...MONO_CAP, color: VANTARY.teal }}>
            GADGET 01 · VOLARC · ALL TONES
          </span>
          <span style={{ ...MONO_CAP, color: VANTARY.ashGhost }}>
            8 VARIANTS · SHARED EASE_V CHOREOGRAPHY
          </span>
        </div>
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          style={{
            ...MONO_CAP,
            color: VANTARY.paperDim,
            padding: "6px 14px",
            borderRadius: 999,
            border: `1px solid ${VANTARY.rule}`,
            background: VANTARY.chipFill,
            cursor: "pointer",
          }}
        >
          REPLAY ENTRANCE
        </button>
      </div>

      {/* Variant grid */}
      <div
        key={replayKey}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 1,
          background: VANTARY.ruleSoft,
        }}
      >
        {VARIANTS.map((v, i) => (
          <div
            key={`${replayKey}-${i}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              padding: "32px 20px 20px",
              background: VANTARY.glassDeep,
              minHeight: 360,
            }}
          >
            <span style={{ ...MONO_CAP, color: VANTARY.ashSoft, marginBottom: 4 }}>
              {v.title}
            </span>
            <p
              style={{
                fontSize: 12,
                color: VANTARY.ashSoft,
                lineHeight: 1.5,
                margin: 0,
                marginBottom: 16,
                minHeight: 36,
              }}
            >
              {v.caption}
            </p>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {v.node}
            </div>
          </div>
        ))}
      </div>

      {/* Footer rail */}
      <div
        style={{
          padding: "12px 24px",
          borderTop: `1px solid ${VANTARY.ruleSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(0deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        }}
      >
        <span style={{ ...MONO_CAP, color: VANTARY.ashGhost }}>
          components/dashboard/vantary/flight-deck/theater/svg-primitives/vol-arc.tsx
        </span>
        <span style={{ ...MONO_CAP, color: VANTARY.ashGhost }}>
          STATUS · GADGET 01 OF 14 · UNDER REVIEW
        </span>
      </div>
    </div>
  )
}

export default VolArcShowcase
