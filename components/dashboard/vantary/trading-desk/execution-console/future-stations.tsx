"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · FUTURE STATIONS  (Stations 1–9, placeholder)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Blueprint §4 — the console is a vertical column of "stations." In Phase 1
 *  every station below the Status Crown is a DIMMED, LOCKED glass plate that
 *  reserves its space and announces its future purpose. The design intent
 *  (blueprint Phase 1 rule): "inactive stations should look intentionally
 *  locked / future-ready, not unfinished."
 *
 *  Each plate carries:
 *    · a station index (00..09) so the column reads as a pre-flight checklist
 *    · an icon + title + one-line purpose
 *    · a thin "schematic" hint of the upcoming instrument shape
 *    · a SOON ribbon corner
 *
 *  No order logic, no inputs, nothing interactive. These are the empty seats
 *  on the flight deck — the trader instantly understands "this is where
 *  execution will happen" without anything being half-built.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import {
  Sparkles,
  ClipboardCheck,
  Fingerprint,
  Radio,
  Briefcase,
  Lock,
  type LucideIcon,
} from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS, type ConsoleMode } from "./console-theme"

/* ─── Station catalog (blueprint §4 stations 1–9 + the cockpit) ────────── */
export interface ConsoleStationDef {
  index:   string
  id:      string
  title:   string
  purpose: string
  icon:    LucideIcon
  /** schematic hint kind — drives the little preview drawing on the plate. */
  schematic: "cards" | "ladder" | "segments" | "gauge" | "scale" | "lines" | "summary"
}

export const CONSOLE_STATIONS: ReadonlyArray<ConsoleStationDef> = [
  { index: "05", id: "ai-check",  title: "AI TRADE CHECK",     purpose: "A co-pilot read before you commit.",             icon: Sparkles,         schematic: "summary" },
  { index: "06", id: "preview",   title: "ORDER PREVIEW",      purpose: "The whole order as one honest sentence.",        icon: ClipboardCheck,   schematic: "summary" },
  { index: "07", id: "commit",    title: "CONFIRMATION",       purpose: "Hold-to-execute — the deliberate commit.",       icon: Fingerprint,      schematic: "summary" },
  { index: "08", id: "status",    title: "ORDER STATUS",       purpose: "In-flight, filled, or refused — truthfully.",    icon: Radio,            schematic: "lines" },
  { index: "09", id: "position",  title: "POSITION COCKPIT",   purpose: "Tend the live trade once it's open.",            icon: Briefcase,        schematic: "ladder" },
] as const

/* ─── Schematic preview drawings ───────────────────────────────────────── */
function Schematic({ kind }: { kind: ConsoleStationDef["schematic"] }) {
  const bar = (w: string, key: number, h = 7) => (
    <div
      key={key}
      style={{ height: h, width: w, background: VANTARY.rule, borderRadius: 2, opacity: 0.5 }}
    />
  )

  switch (kind) {
    case "cards":
      return (
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                flex: 1, height: 30, borderRadius: 5,
                border: `1px solid ${VANTARY.rule}`, background: VANTARY.ruleSoft, opacity: 0.6,
              }}
            />
          ))}
        </div>
      )
    case "segments":
      return (
        <div className="flex gap-1.5">
          {[0, 1].map(i => (
            <div
              key={i}
              style={{
                flex: 1, height: 26, borderRadius: 5,
                border: `1px solid ${VANTARY.rule}`, background: VANTARY.ruleSoft, opacity: 0.6,
              }}
            />
          ))}
        </div>
      )
    case "gauge":
      return (
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 34, height: 34, borderRadius: "50%",
              border: `2px solid ${VANTARY.rule}`,
              borderTopColor: "transparent", borderRightColor: "transparent",
              opacity: 0.6,
            }}
          />
          <div className="flex flex-col gap-1.5" style={{ flex: 1 }}>
            {bar("60%", 0)}
            {bar("40%", 1)}
          </div>
        </div>
      )
    case "scale":
      return (
        <div className="flex items-stretch gap-2" style={{ height: 34 }}>
          <div style={{ width: 2, background: VANTARY.rule, opacity: 0.5, borderRadius: 2 }} />
          <div className="flex flex-col justify-between" style={{ flex: 1 }}>
            {bar("50%", 0, 6)}
            {bar("70%", 1, 6)}
            {bar("35%", 2, 6)}
          </div>
        </div>
      )
    case "summary":
      return (
        <div className="flex flex-col gap-1.5">
          {bar("85%", 0)}
          {bar("60%", 1)}
        </div>
      )
    case "ladder":
      return (
        <div className="flex flex-col gap-1.5">
          {bar("70%", 0)}
          {bar("45%", 1)}
          {bar("55%", 2)}
        </div>
      )
    case "lines":
    default:
      return (
        <div className="flex flex-col gap-1.5">
          {bar("75%", 0)}
          {bar("50%", 1)}
        </div>
      )
  }
}

/* ─── A single locked station plate ────────────────────────────────────── */
const StationPlate = memo(function StationPlate({
  station,
  accent,
}: {
  station: ConsoleStationDef
  accent: string
}) {
  const Icon = station.icon
  return (
    <section
      aria-label={`${station.title} — coming in a later phase`}
      style={{
        position:     "relative",
        padding:      "12px 13px 13px",
        borderRadius: 12,
        border:       `1px solid ${VANTARY.rule}`,
        background:   VANTARY.glass,
        overflow:     "hidden",
        // Locked stations sit quietly below the live crown.
        opacity:      0.78,
      }}
    >
      {/* Left accent rail — barely lit, hints the station belongs to the
          console's colour world without competing with the crown. */}
      <span
        aria-hidden
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
          background: accent, opacity: 0.18,
        }}
      />

      {/* SOON corner ribbon */}
      <span
        className="font-mono uppercase inline-flex items-center gap-1"
        style={{
          position:      "absolute", top: 10, right: 11,
          fontSize:      7.5, letterSpacing: "0.2em",
          color:         VANTARY.ashSoft,
          padding:       "2px 5px",
          border:        `1px solid ${VANTARY.rule}`,
          borderRadius:  3,
        }}
      >
        <Lock size={8} strokeWidth={1.7} />
        SOON
      </span>

      {/* Header */}
      <div className="flex items-center gap-2" style={{ paddingRight: 48 }}>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 9.5, color: VANTARY.ashGhost, letterSpacing: "0.1em" }}
        >
          {station.index}
        </span>
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: 22, height: 22, borderRadius: 6,
            border: `1px solid ${VANTARY.rule}`, background: VANTARY.ruleSoft,
            flexShrink: 0,
          }}
        >
          <Icon size={12} strokeWidth={1.6} color={VANTARY.ash} />
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10.5, letterSpacing: "0.18em", color: VANTARY.paperDim, fontWeight: 500 }}
        >
          {station.title}
        </span>
      </div>

      {/* Purpose */}
      <p
        className="font-sans"
        style={{ fontSize: 11.5, color: VANTARY.ashSoft, lineHeight: 1.5, margin: "8px 0 11px" }}
      >
        {station.purpose}
      </p>

      {/* Schematic hint */}
      <Schematic kind={station.schematic} />
    </section>
  )
})

/* ─── The full locked station column ───────────────────────────────────── */
export const FutureStations = memo(function FutureStations({
  mode,
}: {
  mode: ConsoleMode
}) {
  const accent = CONSOLE_ACCENTS[mode].base
  return (
    <div className="flex flex-col gap-2.5">
      {CONSOLE_STATIONS.map(station => (
        <StationPlate key={station.id} station={station} accent={accent} />
      ))}
    </div>
  )
})
