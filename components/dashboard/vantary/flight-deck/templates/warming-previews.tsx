"use client"

/* ═════════════════════════════════════════════════════════════════════════
 *  WARMING PREVIEWS
 *  ───────────────────────────────────────────────────────────────────────
 *  Per-destination rich preview nodes for the warming state. Each entry
 *  here is a self-contained ReactNode rendered between the four-panel
 *  grid and the "WHAT YOU CAN DO TODAY" callout.
 *
 *  Not every destination has one — only the data-rich ones. Destinations
 *  without an entry simply show the four-panel grid, which is already
 *  substantive on its own.
 *
 *  Visual register: matches the rest of the flight-deck — VANTARY tokens
 *  only, mono eyebrows, `font-sans` for body, dashed rules between
 *  groups, no decorative emoji or filler.
 * ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion } from "framer-motion"

import { VANTARY } from "../../vantary-theme"
import { MENTORS } from "../../oracle-data"
import { FdCorners } from "../flight-deck-primitives"
import type { FlightDeckTemplateId } from "../template-types"

/* ── Library: all eight mentors as compact cards ─────────────────────── */

function LibraryPreview() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          ACTIVE LIBRARY · 8 VERIFIED MENTORS
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          PREVIEW · NO FILTERING YET
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {MENTORS.map((m) => {
          const tier = m.tier === "premium" ? "PREMIUM" : m.tier === "pro" ? "PRO" : "FREE"
          const tierColor =
            m.tier === "premium" ? VANTARY.amber : m.tier === "pro" ? VANTARY.paper : VANTARY.ashSoft
          return (
            <div
              key={m.id}
              className="relative px-3 py-3"
              style={{
                background: VANTARY.glassDeep,
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 4,
              }}
            >
              <FdCorners size={6} thickness={1} inset={3} color={VANTARY.rule} />
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="font-mono inline-flex items-center justify-center shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    background: VANTARY.amberWash,
                    border: `1px solid ${VANTARY.amberHalo}`,
                    color: VANTARY.amber,
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {m.monogram}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="font-sans truncate"
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.2,
                      fontWeight: 500,
                      color: VANTARY.paper,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    className="font-mono uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: VANTARY.ashSoft,
                    }}
                  >
                    {m.archetype} · {m.years}y
                  </div>
                </div>
                <span
                  className="font-mono uppercase shrink-0"
                  style={{
                    fontSize: 8.5,
                    letterSpacing: "0.18em",
                    color: tierColor,
                    padding: "1px 5px",
                    border: `1px solid ${tierColor}40`,
                    borderRadius: 2,
                  }}
                >
                  {tier}
                </span>
              </div>

              <div
                className="font-sans mb-2"
                style={{
                  fontSize: 11.5,
                  lineHeight: 1.45,
                  color: VANTARY.ash,
                  textWrap: "pretty",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {m.signature}
              </div>

              <div
                className="grid grid-cols-3 gap-1 font-mono tabular-nums"
                style={{ fontSize: 10, color: VANTARY.ashSoft }}
              >
                <Stat label="WIN" value={`${m.winRate}%`} />
                <Stat label="R" value={(m.averageR ?? m.averageRR / 2).toFixed(1)} />
                <Stat label="N" value={m.sampleSize.toString()} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-start"
      style={{ borderTop: `1px dashed ${VANTARY.rule}`, paddingTop: 4 }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
      >
        {label}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: 11.5, color: VANTARY.paper, fontWeight: 500 }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── Followed: the user's followed mentors only ──────────────────────── */

function FollowedPreview() {
  const followed = MENTORS.filter((m) => m.followed)
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          FOLLOWED · {followed.length} MENTORS
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          PREVIEW · STATIC
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {followed.map((m, i) => {
          // Synthesise a "next live" pseudo-time deterministically from
          // the mentor's id so the preview reads as live but stays
          // stable across renders.
          const hours = ((m.id.length * 13) % 22) + 1
          const sessions = m.sessionWindow ?? "—"
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 px-3 py-2.5"
              style={{
                background: VANTARY.glassDeep,
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 4,
              }}
            >
              <div
                className="font-mono inline-flex items-center justify-center shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  background: VANTARY.amberWash,
                  border: `1px solid ${VANTARY.amberHalo}`,
                  color: VANTARY.amber,
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {m.monogram}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="font-sans truncate"
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.25,
                    fontWeight: 500,
                    color: VANTARY.paper,
                  }}
                >
                  {m.name}
                </div>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
                >
                  {m.archetype} · {sessions} session
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
                >
                  NEXT LIVE
                </div>
                <div
                  className="font-mono tabular-nums"
                  style={{ fontSize: 11.5, color: VANTARY.amber, fontWeight: 500 }}
                >
                  ~{hours}h {(i * 7) % 60}m
                </div>
              </div>
              <motion.span
                aria-hidden
                className="rounded-full"
                style={{
                  width: 6, height: 6,
                  background: VANTARY.amber,
                  boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
                }}
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Sessions: today's mentor live-session schedule ──────────────────── */

function SessionsPreview() {
  // A small synthetic schedule grid — deterministic per mentor.
  const items = MENTORS.slice(0, 6).map((m, i) => {
    const startH = 7 + (i * 2) % 14
    const dur = 60 + ((i * 17) % 60)
    return {
      id: m.id,
      name: m.name,
      monogram: m.monogram,
      session: m.sessionWindow ?? "—",
      kind: i % 3 === 0 ? "LIVE TRADE" : i % 3 === 1 ? "Q&A" : "POST-MORTEM",
      startUTC: `${startH.toString().padStart(2, "0")}:${((i * 13) % 60).toString().padStart(2, "0")}`,
      durationMin: dur,
      attendees: 120 + (i * 47) % 980,
    }
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          TODAY · {items.length} SESSIONS SCHEDULED
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          PREVIEW · STATIC
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((it, i) => (
          <div
            key={it.id}
            className="grid items-center px-3 py-2 gap-3"
            style={{
              gridTemplateColumns: "78px 32px 1fr 96px 80px 80px",
              borderTop: i === 0 ? `1px solid ${VANTARY.rule}` : "none",
              borderBottom: `1px solid ${VANTARY.rule}`,
              background: i % 2 === 0 ? VANTARY.glassDeep : "transparent",
            }}
          >
            <span
              className="font-mono tabular-nums"
              style={{ fontSize: 11.5, color: VANTARY.amber, fontWeight: 500 }}
            >
              {it.startUTC} UTC
            </span>
            <div
              className="font-mono inline-flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                background: VANTARY.amberWash,
                border: `1px solid ${VANTARY.amberHalo}`,
                color: VANTARY.amber,
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {it.monogram}
            </div>
            <span
              className="font-sans truncate"
              style={{ fontSize: 12.5, color: VANTARY.paper, fontWeight: 500 }}
            >
              {it.name}
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9.5, letterSpacing: "0.2em", color: VANTARY.ashSoft }}
            >
              {it.session}
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9.5, letterSpacing: "0.2em", color: VANTARY.ashSoft }}
            >
              {it.kind}
            </span>
            <span
              className="font-mono tabular-nums text-right"
              style={{ fontSize: 11, color: VANTARY.ash }}
            >
              {it.attendees.toLocaleString()} ✶
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Forecast Room: most recent published forecasts ─────────────────── */

function ForecastRoomPreview() {
  const FORECASTS: Array<{
    pair: string
    bias: "LONG" | "SHORT"
    by: string
    monogram: string
    confidence: number
    horizon: string
    tags: string[]
  }> = [
    { pair: "EUR/USD", bias: "LONG",  by: "Daniel Cohen",   monogram: "DC", confidence: 78, horizon: "1d", tags: ["LSE killzone", "FVG retrace"] },
    { pair: "USD/JPY", bias: "LONG",  by: "Yumi Takeda",    monogram: "YT", confidence: 72, horizon: "3d", tags: ["Spring", "BoJ window"] },
    { pair: "XAU/USD", bias: "SHORT", by: "Kelechi Okafor", monogram: "KO", confidence: 64, horizon: "1w", tags: ["DXY-cycle", "macro"] },
    { pair: "BTC/USD", bias: "LONG",  by: "Henri Girard",   monogram: "HG", confidence: 68, horizon: "5d", tags: ["weekly OB", "discount tap"] },
    { pair: "NAS100",  bias: "LONG",  by: "Mateo Álvarez",  monogram: "MA", confidence: 71, horizon: "1d", tags: ["BPR continuation", "OB"] },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          PUBLISHED · {FORECASTS.length} ACTIVE
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          PREVIEW · STATIC
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {FORECASTS.map((f) => (
          <div
            key={f.by + f.pair}
            className="relative px-3 py-3"
            style={{
              background: VANTARY.glassDeep,
              border: `1px solid ${VANTARY.rule}`,
              borderRadius: 4,
            }}
          >
            <FdCorners size={6} thickness={1} inset={3} color={VANTARY.rule} />
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 11.5,
                  color: VANTARY.paper,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {f.pair}
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  padding: "1px 6px",
                  borderRadius: 2,
                  color: f.bias === "LONG" ? VANTARY.amber : VANTARY.paper,
                  border: `1px solid ${f.bias === "LONG" ? VANTARY.amberHalo : VANTARY.rule}`,
                  background: f.bias === "LONG" ? VANTARY.amberWash : "transparent",
                  fontWeight: 600,
                }}
              >
                {f.bias}
              </span>
              <span aria-hidden className="flex-1" />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
              >
                {f.horizon}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="font-mono inline-flex items-center justify-center shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  background: VANTARY.amberWash,
                  border: `1px solid ${VANTARY.amberHalo}`,
                  color: VANTARY.amber,
                  fontSize: 9.5,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {f.monogram}
              </div>
              <span
                className="font-sans truncate"
                style={{ fontSize: 11.5, color: VANTARY.paper }}
              >
                {f.by}
              </span>
              <span aria-hidden className="flex-1" />
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 10.5, color: VANTARY.amber, fontWeight: 500 }}
              >
                {f.confidence}%
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {f.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.04em",
                    color: VANTARY.ashSoft,
                    padding: "1px 6px",
                    border: `1px solid ${VANTARY.rule}`,
                    borderRadius: 2,
                    background: "transparent",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Signal Room: live signals streaming, calm row layout ─────────────── */

function SignalRoomPreview() {
  const SIGNALS: Array<{
    by: string
    monogram: string
    pair: string
    side: "LONG" | "SHORT"
    entry: string
    rr: string
    age: string
    state: "FIRED" | "ARMED" | "EXPIRED"
  }> = [
    { by: "Daniel Cohen",   monogram: "DC", pair: "EUR/USD", side: "LONG",  entry: "1.0842", rr: "1:2.4", age: "12m",  state: "FIRED" },
    { by: "Mateo Álvarez",  monogram: "MA", pair: "NAS100",  side: "LONG",  entry: "18204",  rr: "1:1.8", age: "47m",  state: "FIRED" },
    { by: "Yumi Takeda",    monogram: "YT", pair: "USD/JPY", side: "LONG",  entry: "151.20", rr: "1:3.0", age: "1h12", state: "ARMED" },
    { by: "Lucien Picasso", monogram: "LP", pair: "GBP/USD", side: "SHORT", entry: "1.2611", rr: "1:1.5", age: "1h41", state: "FIRED" },
    { by: "Kelechi Okafor", monogram: "KO", pair: "XAU/USD", side: "SHORT", entry: "2381.4", rr: "1:4.2", age: "2h05", state: "ARMED" },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          STREAMING · 5 SIGNALS IN WINDOW
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          PREVIEW · STATIC
        </span>
      </div>
      <div className="flex flex-col">
        {SIGNALS.map((s, i) => {
          const stateColor =
            s.state === "FIRED"
              ? VANTARY.amber
              : s.state === "ARMED"
              ? VANTARY.paper
              : VANTARY.ashSoft
          return (
            <div
              key={i}
              className="grid items-center px-3 py-2 gap-3"
              style={{
                gridTemplateColumns: "32px 1fr 60px 80px 84px 80px 64px",
                borderTop: i === 0 ? `1px solid ${VANTARY.rule}` : "none",
                borderBottom: `1px solid ${VANTARY.rule}`,
                background: i % 2 === 0 ? VANTARY.glassDeep : "transparent",
              }}
            >
              <div
                className="font-mono inline-flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  background: VANTARY.amberWash,
                  border: `1px solid ${VANTARY.amberHalo}`,
                  color: VANTARY.amber,
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {s.monogram}
              </div>
              <span
                className="font-sans truncate"
                style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500 }}
              >
                {s.by}
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 11,
                  color: VANTARY.paper,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {s.pair}
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.22em",
                  color: s.side === "LONG" ? VANTARY.amber : VANTARY.paper,
                  fontWeight: 600,
                }}
              >
                {s.side}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 11, color: VANTARY.ash }}
              >
                @ {s.entry}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 10.5, color: VANTARY.amber, fontWeight: 500 }}
              >
                {s.rr}
              </span>
              <span
                className="font-mono uppercase text-right"
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.2em",
                  color: stateColor,
                  fontWeight: 600,
                }}
              >
                {s.state}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Master mapping ──────────────────────────────────────────────────── */

export const WARMING_PREVIEWS: Partial<Record<FlightDeckTemplateId, React.ReactNode>> = {
  "mentors.library":          <LibraryPreview />,
  "mentors.followed":         <FollowedPreview />,
  "mentors.sessions":         <SessionsPreview />,
  "market.forecast-room":     <ForecastRoomPreview />,
  "market.signal-room":       <SignalRoomPreview />,
}
