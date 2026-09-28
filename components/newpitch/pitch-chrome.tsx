"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  PITCH CHROME  ·  the cockpit furniture of /newpitch
 *
 *  Boot-sequence hero, the sticky mission rail (vertical destination
 *  navigator with scroll progress), the numbered section frame, and footer.
 *  All inherited from the platform Visual DNA.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { useEffect, useState } from "react"
import { DNA, MONO_CAP, MONO_CAP_TIGHT, EASE_V } from "./pitch-dna"
import { LiveFrame, CornerTick } from "./pitch-scaffold"
import { HERO, DESTINATIONS, type Destination } from "./pitch-data"

/* ═══════════════════════════════════════════════════════════════════════
   BOOT CONSOLE  ·  typed terminal preface
   ═══════════════════════════════════════════════════════════════════════ */

function BootConsole({ lines }: { lines: string[] }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count >= lines.length) return
    const t = setTimeout(() => setCount((c) => c + 1), 520)
    return () => clearTimeout(t)
  }, [count, lines.length])

  return (
    <div
      className="font-mono"
      style={{
        background: DNA.glassDeep,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: DNA.rMd,
        padding: "14px 16px",
        fontSize: 11.5,
        lineHeight: 1.9,
      }}
    >
      {lines.slice(0, count).map((l, i) => (
        <div key={l} className="flex items-center gap-2" style={{ color: i === count - 1 ? DNA.teal : DNA.ash }}>
          <span style={{ color: DNA.tealDeep }}>›</span>
          <span style={{ letterSpacing: "0.01em" }}>{l}</span>
        </div>
      ))}
      <span
        aria-hidden
        className="archio-breathe"
        style={{ display: "inline-block", width: 7, height: 13, background: DNA.teal, verticalAlign: "middle", marginLeft: 2 }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════ */

export function PitchHero() {
  return (
    <header className="flex flex-col gap-8">
      {/* eyebrow rail */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          aria-hidden
          className="archio-breathe"
          style={{ width: 6, height: 6, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 8px ${DNA.teal}, 0 0 16px ${DNA.teal}66` }}
        />
        <span style={{ ...MONO_CAP, fontSize: 10, color: DNA.teal, letterSpacing: "0.3em" }}>{HERO.eyebrow}</span>
        <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>/newpitch · LIVE</span>
      </div>

      <div className="grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <h1
            className="font-sans text-balance"
            style={{ fontSize: 52, fontWeight: 300, color: DNA.paper, letterSpacing: "-0.035em", lineHeight: 1.04 }}
          >
            {HERO.title}{" "}
            <span style={{ color: DNA.teal, fontWeight: 400 }}>{HERO.titleAccent}</span>
          </h1>
          <p className="font-sans text-pretty" style={{ fontSize: 15, color: DNA.paperDim, lineHeight: 1.6, maxWidth: 760 }}>
            {HERO.sub}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <BootConsole lines={HERO.bootLines} />
        </div>
      </div>

      {/* hero stat rail */}
      <div
        className="flex items-center flex-wrap gap-x-10 gap-y-4"
        style={{
          background: DNA.glassDeep,
          border: `1px solid ${DNA.tealRule}`,
          borderRadius: DNA.rMd,
          padding: "16px 22px",
        }}
      >
        {HERO.rail.map((s, i) => (
          <div key={s.label} className="flex items-center gap-10">
            <div className="flex flex-col gap-1">
              <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>{s.label}</span>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 19, color: i === HERO.rail.length - 1 ? DNA.teal : DNA.paper, letterSpacing: "-0.01em" }}
              >
                {s.value}
              </span>
            </div>
            {i < HERO.rail.length - 1 ? (
              <span aria-hidden style={{ width: 1, height: 30, background: DNA.tealRule }} />
            ) : null}
          </div>
        ))}
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MISSION RAIL  ·  sticky vertical navigator + scroll progress
   ═══════════════════════════════════════════════════════════════════════ */

export function MissionRail({
  activeId,
  progress,
  onJump,
}: {
  activeId: string
  progress: number
  onJump: (id: string) => void
}) {
  return (
    <nav
      aria-label="Briefing sections"
      className="sticky flex flex-col gap-1.5"
      style={{ top: 28 }}
    >
      <div className="flex items-center gap-2 mb-2 pl-1">
        <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 6px ${DNA.teal}` }} />
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>BRIEFING · {Math.round(progress * 100)}%</span>
      </div>

      {/* progress spine */}
      <div className="relative flex flex-col gap-1.5">
        <span
          aria-hidden
          className="absolute"
          style={{ left: 11, top: 6, bottom: 6, width: 1, background: DNA.tealRule }}
        />
        <span
          aria-hidden
          className="absolute"
          style={{
            left: 11,
            top: 6,
            width: 1,
            height: `calc((100% - 12px) * ${Math.min(Math.max(progress, 0), 1)})`,
            background: DNA.teal,
            boxShadow: `0 0 8px ${DNA.teal}`,
            transition: `height 0.3s ${EASE_V}`,
          }}
        />
        {DESTINATIONS.map((d) => (
          <RailItem key={d.id} d={d} active={d.id === activeId} onJump={onJump} />
        ))}
      </div>
    </nav>
  )
}

function RailItem({ d, active, onJump }: { d: Destination; active: boolean; onJump: (id: string) => void }) {
  const [hover, setHover] = useState(false)
  const lit = active || hover
  return (
    <button
      type="button"
      onClick={() => onJump(d.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex items-center gap-3 text-left z-10"
      style={{
        padding: "8px 10px 8px 0",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          marginLeft: 8,
          borderRadius: 999,
          flexShrink: 0,
          background: active ? DNA.teal : DNA.ink,
          border: `1px solid ${lit ? DNA.teal : DNA.tealRule}`,
          boxShadow: active ? `0 0 10px ${DNA.teal}` : "none",
          transition: `all 0.24s ${EASE_V}`,
        }}
      />
      <span className="font-mono tabular-nums" style={{ fontSize: 9, color: lit ? DNA.teal : DNA.ashGhost }}>
        {d.index}
      </span>
      <span
        style={{
          ...MONO_CAP_TIGHT,
          fontSize: 9.5,
          color: active ? DNA.paper : lit ? DNA.paperDim : DNA.ashSoft,
          transition: `color 0.24s ${EASE_V}`,
        }}
      >
        {d.label}
      </span>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION FRAME  ·  numbered module header + framed body
   ═══════════════════════════════════════════════════════════════════════ */

export function SectionFrame({
  id,
  index,
  kicker,
  headline,
  body,
  children,
  padded = true,
}: {
  id: string
  index: string
  kicker: string
  headline: string
  body: string
  children: React.ReactNode
  padded?: boolean
}) {
  return (
    <section id={id} className="scroll-mt-8 flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 13, color: DNA.teal, letterSpacing: "0.18em", fontWeight: 500, textShadow: `0 0 12px ${DNA.tealHalo}` }}
          >
            {index}
          </span>
          <span aria-hidden style={{ width: 32, height: 1, background: DNA.tealRuleStrong }} />
          <span style={{ ...MONO_CAP, fontSize: 11, color: DNA.paper, letterSpacing: "0.3em" }}>{kicker}</span>
          <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
        </div>
        <h2
          className="font-sans text-balance"
          style={{ fontSize: 30, fontWeight: 300, color: DNA.paper, letterSpacing: "-0.025em", lineHeight: 1.12, maxWidth: 900 }}
        >
          {headline}
        </h2>
        <p className="font-sans text-pretty" style={{ fontSize: 14, color: DNA.paperDim, lineHeight: 1.6, maxWidth: 820 }}>
          {body}
        </p>
      </div>
      <LiveFrame padded={padded}>{children}</LiveFrame>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   INSIGHT STRIP  ·  full-width takeaway line (corner-ticked)
   ═══════════════════════════════════════════════════════════════════════ */

export function InsightStrip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="relative px-6 py-5"
      style={{ background: DNA.glass, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rMd, backdropFilter: "blur(20px) saturate(140%)" }}
    >
      <CornerTick className="top-2 left-2" />
      <CornerTick className="bottom-2 right-2" rotate={180} />
      <div className="flex items-start gap-4">
        <span aria-hidden className="mt-1.5 shrink-0" style={{ width: 4, height: 4, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 6px ${DNA.teal}` }} />
        <p className="font-sans" style={{ fontSize: 13.5, color: DNA.paperDim, lineHeight: 1.65, maxWidth: 980 }}>
          <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.teal, marginRight: 10 }}>{label}</span>
          {children}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════ */

export function PitchFooter() {
  return (
    <footer className="mt-8 flex items-center gap-3">
      <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>
        END OF BRIEFING · ARCHIO AI · /dashboard ↔ /design ↔ /newpitch
      </span>
      <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
    </footer>
  )
}
