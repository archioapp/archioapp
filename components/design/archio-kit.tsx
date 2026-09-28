"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  ARCHIO KIT  ·  the reusable platform primitives
 *
 *  These ARE the platform's design-system components — the cards, panels,
 *  buttons, pills, chips, command bar, status rail, and alert modules that
 *  every ArchioAI page is meant to inherit. They are built directly from
 *  the Visual DNA tokens so a single edit here propagates everywhere.
 *
 *  Everything is interactive and self-contained: real hover lifts, focus
 *  states, toggle states, expand/collapse, and the cockpit motion grammar.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { useState } from "react"
import { DNA, MONO_CAP, MONO_CAP_TIGHT } from "./design-tokens"

/* ═══════════════════════════════════════════════════════════════════════
   PANEL  ·  the box system
   The base glass surface. Three tones: glass (default), strong, deep.
   ═══════════════════════════════════════════════════════════════════════ */

export type PanelTone = "glass" | "strong" | "deep"

export function ArchioPanel({
  children,
  tone = "glass",
  className,
  style,
  inset,
}: {
  children: React.ReactNode
  tone?: PanelTone
  className?: string
  style?: React.CSSProperties
  inset?: boolean
}) {
  const bg = tone === "deep" ? DNA.glassDeep : tone === "strong" ? DNA.glassStrong : DNA.glass
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: bg,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: DNA.rLg,
        backdropFilter: "blur(20px) saturate(140%)",
        boxShadow: inset
          ? `0 1px 0 0 ${DNA.tealHalo} inset`
          : `0 1px 0 0 ${DNA.tealHalo} inset, 0 24px 48px -36px rgba(0,0,0,0.6)`,
        padding: 22,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CARD  ·  the card system
   A hover-reactive panel that lifts 2px and intensifies its halo —
   the cockpit's standard interactive surface.
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioCard({
  title,
  eyebrow,
  children,
  accent = DNA.teal,
  footer,
}: {
  title?: string
  eyebrow?: string
  children: React.ReactNode
  accent?: string
  footer?: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: DNA.glassStrong,
        border: `1px solid ${hover ? DNA.tealRuleStrong : DNA.tealRule}`,
        borderRadius: DNA.rLg,
        padding: 20,
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover
          ? `0 1px 0 0 ${DNA.tealHalo} inset, 0 0 0 1px ${DNA.tealWash}, 0 20px 40px -28px rgba(0,0,0,0.7), 0 0 28px -10px ${DNA.tealHalo}`
          : `0 1px 0 0 ${DNA.tealHalo} inset, 0 16px 32px -28px rgba(0,0,0,0.6)`,
        transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {eyebrow ? (
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: accent }}>{eyebrow}</span>
      ) : null}
      {title ? (
        <h4
          className="font-sans"
          style={{ fontSize: 16, fontWeight: 400, color: DNA.paper, letterSpacing: "-0.01em" }}
        >
          {title}
        </h4>
      ) : null}
      <div style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.55 }}>{children}</div>
      {footer ? (
        <div
          className="mt-1 pt-3"
          style={{ borderTop: `1px solid ${DNA.tealRule}` }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   BUTTON  ·  primary · secondary · ghost · danger
   ═══════════════════════════════════════════════════════════════════════ */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

export function ArchioButton({
  children,
  variant = "primary",
  onClick,
  icon,
}: {
  children: React.ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  icon?: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)

  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: hover ? DNA.tealDeep : DNA.teal,
      color: "#06201D",
      border: `1px solid ${DNA.teal}`,
      boxShadow: hover ? `0 0 24px -6px ${DNA.tealHalo}, 0 0 0 1px ${DNA.tealWash}` : "none",
      fontWeight: 600,
    },
    secondary: {
      background: hover ? DNA.chipFillHi : DNA.chipFill,
      color: DNA.teal,
      border: `1px solid ${hover ? DNA.tealRuleStrong : DNA.chipBorder}`,
    },
    ghost: {
      background: hover ? "rgba(255,255,255,0.03)" : "transparent",
      color: hover ? DNA.paper : DNA.paperDim,
      border: `1px solid ${hover ? DNA.tealRule : "transparent"}`,
    },
    danger: {
      background: hover ? DNA.riskWash : "rgba(122,47,47,0.10)",
      color: DNA.riskInk,
      border: `1px solid ${hover ? DNA.riskGlowEdge : DNA.riskEdge}`,
      boxShadow: hover ? `0 0 22px -8px ${DNA.riskGlow}` : "none",
    },
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setDown(false)
      }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      className="font-sans inline-flex items-center gap-2"
      style={{
        fontSize: 13,
        letterSpacing: "0.01em",
        padding: "9px 16px",
        borderRadius: DNA.rSm,
        cursor: "pointer",
        transform: down ? "translateY(1px) scale(0.99)" : hover ? "translateY(-1px)" : "none",
        transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        ...styles[variant],
      }}
    >
      {icon ? <span className="inline-flex" style={{ width: 14, height: 14 }}>{icon}</span> : null}
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PILL  ·  toggle / segmented control
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioPillGroup({
  options,
  defaultValue,
}: {
  options: string[]
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue ?? options[0])
  return (
    <div
      className="inline-flex items-center gap-1"
      style={{
        background: DNA.glassDeep,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: 999,
        padding: 4,
      }}
    >
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(opt)}
            className="font-mono"
            style={{
              ...MONO_CAP_TIGHT,
              fontSize: 10,
              padding: "6px 14px",
              borderRadius: 999,
              cursor: "pointer",
              border: "1px solid transparent",
              color: active ? "#06201D" : DNA.ash,
              background: active ? DNA.teal : "transparent",
              boxShadow: active ? `0 0 16px -6px ${DNA.tealHalo}` : "none",
              transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CHIP  ·  default · selectable · hot (live halo)
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioChip({
  children,
  hot,
  selected: controlled,
  selectable,
  tone = "teal",
}: {
  children: React.ReactNode
  hot?: boolean
  selected?: boolean
  selectable?: boolean
  tone?: "teal" | "risk" | "amber"
}) {
  const [selfSel, setSelfSel] = useState(false)
  const selected = controlled ?? selfSel

  const toneColor = tone === "risk" ? DNA.riskInk : tone === "amber" ? DNA.riskAmber : DNA.teal
  const toneEdge = tone === "risk" ? DNA.riskEdge : tone === "amber" ? "rgba(245,158,11,0.3)" : DNA.chipBorder
  const toneWash =
    tone === "risk" ? DNA.riskWash : tone === "amber" ? "rgba(245,158,11,0.10)" : DNA.chipFill

  return (
    <button
      type="button"
      onClick={selectable ? () => setSelfSel((s) => !s) : undefined}
      className={`font-mono inline-flex items-center gap-1.5 ${hot ? "archio-halo-sweep" : ""}`}
      style={{
        ...MONO_CAP_TIGHT,
        fontSize: 10,
        padding: "5px 10px",
        borderRadius: 999,
        cursor: selectable ? "pointer" : "default",
        color: selected || hot ? toneColor : DNA.paperDim,
        border: `1px solid ${selected || hot ? toneEdge : DNA.tealRule}`,
        background: hot
          ? `linear-gradient(90deg, ${toneWash}, ${DNA.chipFillHi}, ${toneWash})`
          : selected
            ? toneWash
            : DNA.chipFill,
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {hot ? (
        <span
          aria-hidden
          className="archio-breathe"
          style={{
            width: 5,
            height: 5,
            borderRadius: 999,
            background: toneColor,
            boxShadow: `0 0 8px ${toneColor}`,
          }}
        />
      ) : null}
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   COMMAND INPUT  ·  the Ask bar
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioCommandInput({
  placeholder = "Should I size up on EUR/USD today?",
}: {
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState("")
  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: DNA.glassDeep,
        border: `1px solid ${focused ? DNA.tealRuleStrong : DNA.tealRule}`,
        borderRadius: DNA.rMd,
        padding: "12px 14px",
        boxShadow: focused
          ? `0 0 0 1px ${DNA.tealWash}, 0 0 28px -10px ${DNA.tealHalo}`
          : "none",
        transition: "all 0.24s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span
        aria-hidden
        className="shrink-0 inline-flex items-center justify-center"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: DNA.tealWash,
          border: `1px solid ${DNA.tealRule}`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={DNA.teal} strokeWidth="2">
          <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5L13 3z" />
        </svg>
      </span>
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.teal }}>ASK</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none font-sans"
        style={{ fontSize: 13.5, color: DNA.paper, letterSpacing: "0.01em" }}
      />
      <kbd
        className="font-mono shrink-0"
        style={{
          fontSize: 10,
          color: DNA.ash,
          padding: "3px 7px",
          borderRadius: 6,
          border: `1px solid ${DNA.tealRule}`,
          background: DNA.glass,
        }}
      >
        ⌘K
      </kbd>
      <button
        type="button"
        className="shrink-0 inline-flex items-center justify-center"
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: DNA.teal,
          color: "#06201D",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        aria-label="Submit query"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   STATUS RAIL  ·  tick · equity · session readout
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioStatusRail() {
  return (
    <div
      className="flex items-center flex-wrap gap-x-8 gap-y-3"
      style={{
        background: DNA.glassDeep,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: DNA.rMd,
        padding: "12px 18px",
      }}
    >
      <RailStat label="TICK" value="01:07:46" mono />
      <RailDivider />
      <RailStat label="RECORD" value="3W · 2L · +4.1R net" tint={DNA.teal} />
      <RailDivider />
      <RailStat label="TOTAL EQUITY" value="$113,863" big />
      <RailDivider />
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="archio-breathe"
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: DNA.riskAmber,
            boxShadow: `0 0 8px ${DNA.riskAmber}`,
          }}
        />
        <RailStat label="SESSION" value="LONDON · 06:07:47" tint={DNA.riskAmber} />
      </div>
    </div>
  )
}

function RailStat({
  label,
  value,
  tint = DNA.paper,
  mono,
  big,
}: {
  label: string
  value: string
  tint?: string
  mono?: boolean
  big?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>{label}</span>
      <span
        className={mono || big ? "font-mono tabular-nums" : "font-sans"}
        style={{ fontSize: big ? 18 : 12, color: tint, letterSpacing: big ? "-0.01em" : "0.02em" }}
      >
        {value}
      </span>
    </div>
  )
}

function RailDivider() {
  return <span aria-hidden style={{ width: 1, height: 26, background: DNA.tealRule }} />
}

/* ═══════════════════════════════════════════════════════════════════════
   ALERT / RISK MODULE  ·  expandable severity row
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioAlertModule({
  severity = "high",
  title = "ECB Rate Decision",
  time = "08:30",
  detail = "High-impact EUR event. Affected pairs flagged below. Recommended: reduce EUR exposure ahead of the print, re-enter after volatility settles.",
  pairs = ["EUR/USD", "EUR/GBP", "EUR/JPY"],
}: {
  severity?: "low" | "medium" | "high"
  title?: string
  time?: string
  detail?: string
  pairs?: string[]
}) {
  const [open, setOpen] = useState(false)
  const tint = severity === "high" ? DNA.riskInk : severity === "medium" ? DNA.riskAmber : DNA.teal
  const edge = severity === "high" ? DNA.riskGlowEdge : severity === "medium" ? "rgba(245,158,11,0.35)" : DNA.tealRuleStrong
  const wash = severity === "high" ? DNA.riskGlow : severity === "medium" ? "rgba(245,158,11,0.08)" : DNA.tealWash

  return (
    <div
      style={{
        background: DNA.glassStrong,
        border: `1px solid ${open ? edge : DNA.tealRule}`,
        borderRadius: DNA.rMd,
        overflow: "hidden",
        transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: open ? `0 0 32px -14px ${wash}` : "none",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 text-left"
        style={{ padding: "14px 16px", cursor: "pointer" }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: tint,
            boxShadow: `0 0 10px ${tint}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: tint, width: 64, flexShrink: 0 }}
        >
          {severity.toUpperCase()}
        </span>
        <span className="font-sans" style={{ fontSize: 14, color: DNA.paper, flex: 1 }}>
          {title}
        </span>
        <span className="font-mono tabular-nums" style={{ fontSize: 13, color: DNA.paperDim }}>
          {time}
        </span>
        <span
          aria-hidden
          style={{
            color: DNA.ash,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? 220 : 0,
          opacity: open ? 1 : 0,
          transition: "all 0.34s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className="flex flex-col gap-3"
          style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${DNA.tealRule}`, paddingTop: 14 }}
        >
          <p className="font-sans" style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.6 }}>
            {detail}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ ...MONO_CAP_TIGHT, fontSize: 8.5, color: DNA.ashSoft }}>AFFECTED</span>
            {pairs.map((p, i) => (
              <ArchioChip key={p} tone={severity === "low" ? "teal" : "risk"} hot={i === 0}>
                {p}
              </ArchioChip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   DRAWER SPECIMEN  ·  the swipe / drawer interaction language
   A self-contained bottom-sheet demo (does NOT import /swipe). Documents
   the grabber, spring slide, scrim, and snap behavior the platform uses.
   ═══════════════════════════════════════════════════════════════════════ */

export function ArchioDrawerSpecimen() {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 320,
        background: DNA.ink,
        border: `1px solid ${DNA.tealRule}`,
        borderRadius: DNA.rLg,
      }}
    >
      {/* faux page behind */}
      <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 p-6">
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>
          DRAWER HOST · TAP TO SUMMON
        </span>
        <ArchioButton variant="secondary" onClick={() => setOpen(true)}>
          Open drawer
        </ArchioButton>
      </div>

      {/* scrim */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.34s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
          background: DNA.glassDeep,
          borderTop: `1px solid ${DNA.tealRuleStrong}`,
          borderTopLeftRadius: DNA.rXl,
          borderTopRightRadius: DNA.rXl,
          backdropFilter: "blur(24px) saturate(140%)",
          padding: "14px 20px 22px",
          boxShadow: `0 -20px 50px -30px rgba(0,0,0,0.8), 0 -1px 0 0 ${DNA.tealHalo} inset`,
        }}
      >
        {/* grabber */}
        <div className="flex justify-center mb-4">
          <span
            aria-hidden
            style={{ width: 40, height: 4, borderRadius: 999, background: DNA.tealRuleStrong }}
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span style={{ ...MONO_CAP, fontSize: 10, color: DNA.teal }}>QUICK ACTIONS</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-mono"
            style={{ fontSize: 10, color: DNA.ash, cursor: "pointer", ...MONO_CAP_TIGHT }}
          >
            CLOSE
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {["Publish forecast", "Audit a trade", "Open journal"].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between"
              style={{
                background: DNA.glass,
                border: `1px solid ${DNA.tealRule}`,
                borderRadius: DNA.rSm,
                padding: "11px 14px",
              }}
            >
              <span className="font-sans" style={{ fontSize: 13, color: DNA.paper }}>
                {row}
              </span>
              <span aria-hidden style={{ color: DNA.teal }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
