"use client"

/**
 * LIVE ROOM — primitives
 *
 * The small vocabulary every pane is written in. Composes the Flight Deck
 * primitives (FdCorners, FdPanelHeader, FdLiveTick) and reads only LR /
 * VANTARY tokens. No literal accent colors.
 */

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { FdCorners, FdLiveTick } from "@/components/dashboard/vantary/flight-deck/flight-deck-primitives"
import { LR, lrMix, toneColor, type LrTone } from "./live-room-tokens"

/* ────────────────────────────────────────────────────────────────────────
 *  LrEyebrow — mono small caps. Sizes never below 9.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrEyebrow({
  children, tone = "ash", size = 9, tracking = LR.type.eyebrowTracking, weight = 600, className = "", style,
}: {
  children: React.ReactNode
  tone?: "ash" | "primary" | "paper" | "up" | "down" | "warn" | "dim"
  size?: number
  tracking?: string
  weight?: number
  className?: string
  style?: React.CSSProperties
}) {
  const color =
    tone === "primary" ? LR.primary
    : tone === "paper" ? LR.paper
    : tone === "dim" ? LR.paperDim
    : tone === "up" ? LR.up
    : tone === "down" ? LR.down
    : tone === "warn" ? LR.warn
    : LR.ashSoft
  return (
    <span
      className={`font-mono uppercase whitespace-nowrap ${className}`}
      style={{ fontSize: Math.max(9, size), letterSpacing: tracking, color, fontWeight: weight, lineHeight: 1, ...style }}
    >
      {children}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrThread — the 1px accent strip on a pane's top edge.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrThread({ tone = "primary", opacity = 1, inset = 18 }: { tone?: LrTone; opacity?: number; inset?: number }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-0"
      style={{ left: inset, right: inset, height: 1, background: LR.thread(toneColor(tone), 0.55), opacity, transition: "opacity 400ms ease" }}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrLiveDot — breathing dot. Rose for LIVE, primary for ticks.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrLiveDot({ tone = "down", size = 6 }: { tone?: LrTone; size?: number }) {
  const reduce = useReducedMotion()
  const c = toneColor(tone)
  return (
    <motion.span
      aria-hidden
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, background: c, boxShadow: `0 0 ${size + 2}px ${lrMix(c, 0.55)}` }}
      animate={reduce ? undefined : { opacity: [0.55, 1, 0.55], scale: [0.9, 1.08, 0.9] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  useMounted — false on the server and during hydration, true after.
 *  Clocks render a fixed placeholder until then (no hydration mismatch).
 * ──────────────────────────────────────────────────────────────────────── */
const subscribeNoop = () => () => {}
export function useMounted() {
  return React.useSyncExternalStore(subscribeNoop, () => true, () => false)
}

/** FdLiveTick that only starts after mount — same width placeholder before. */
export function LrLiveTick({ size = 9.5 }: { size?: number }) {
  const mounted = useMounted()
  if (mounted) return <FdLiveTick label="UTC" showSeconds size={size} />
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      <span className="rounded-full" style={{ width: 5, height: 5, background: LR.primary, opacity: 0.6 }} />
      <span className="font-mono uppercase tabular-nums" style={{ fontSize: size, letterSpacing: "0.16em", color: LR.ashSoft, fontWeight: 500 }}>UTC · --:--:--</span>
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrPaneHeader — eyebrow · dashed rule · hint · live tick · count · trailing
 *  (FdPanelHeader with 16px horizontal padding to sit on the 8-grid.)
 * ──────────────────────────────────────────────────────────────────────── */
export function LrPaneHeader({
  eyebrow, count, hint, tick = true, tone = "primary", trailing, id,
}: {
  eyebrow: string
  count?: number | string
  hint?: string
  tick?: boolean
  tone?: LrTone
  trailing?: React.ReactNode
  id?: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-3 min-w-0">
      <span id={id} className="font-mono uppercase whitespace-nowrap" style={{ fontSize: 9, letterSpacing: LR.type.headerTracking, color: toneColor(tone), fontWeight: 600 }}>
        {eyebrow}
      </span>
      <span aria-hidden className="flex-1 h-px min-w-3" style={{ background: LR.dashed() }} />
      {hint && (
        <span className="lr-hint font-mono uppercase whitespace-nowrap" style={{ fontSize: 9, letterSpacing: "0.18em", color: LR.ashSoft, opacity: 0.85 }}>
          {hint}
        </span>
      )}
      {tick && <span className="lr-tick whitespace-nowrap"><LrLiveTick size={9.5} /></span>}
      {typeof count !== "undefined" && (
        <span className="font-mono tabular-nums" style={{ fontSize: 9, letterSpacing: "0.16em", color: LR.ashSoft, minWidth: 18, textAlign: "right" }}>
          {typeof count === "number" ? String(count).padStart(2, "0") : count}
        </span>
      )}
      {trailing}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrPane — the glass instrument pane.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrPane({
  children, className = "", style, tone = "primary", corners = true, thread = true, deep = false, lift = false,
  glow = false, delay = 0, as = "section", labelledBy, onMouseEnter, onMouseLeave, fill = false, ...rest
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  tone?: LrTone
  corners?: boolean
  thread?: boolean
  deep?: boolean
  lift?: boolean
  glow?: boolean
  delay?: number
  as?: "section" | "div" | "aside"
  labelledBy?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  /** the pane is a flex column that fills its parent; children get the remaining height */
  fill?: boolean
} & Omit<HTMLMotionProps<"section">, "children" | "style" | "className" | "onMouseEnter" | "onMouseLeave">) {
  const reduce = useReducedMotion()
  const [hover, setHover] = React.useState(false)
  const Tag = (as === "div" ? motion.div : as === "aside" ? motion.aside : motion.section) as typeof motion.section
  const accent = toneColor(tone)
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={`lr-pane relative overflow-hidden ${fill ? "flex flex-col h-full min-h-0" : ""} ${className}`}
      initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: lift && hover ? -2 : 0, filter: "blur(0px)" }}
      transition={{ duration: LR.enter.duration, ease: LR.ease, delay }}
      onMouseEnter={() => { setHover(true); onMouseEnter?.() }}
      onMouseLeave={() => { setHover(false); onMouseLeave?.() }}
      style={{
        background: deep ? LR.pane.bgDeep : LR.pane.bg,
        border: `1px solid ${glow ? LR.pane.borderStrong : LR.pane.border}`,
        borderRadius: LR.pane.radius,
        backdropFilter: LR.pane.blur,
        WebkitBackdropFilter: LR.pane.blur,
        boxShadow: `${LR.specular}, ${hover && lift ? LR.shadowHover : LR.shadow}${glow ? `, ${LR.glow}` : ""}`,
        transition: "box-shadow 420ms cubic-bezier(0.22,0.68,0.36,1), border-color 420ms ease",
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: LR.topLight(accent, hover ? 0.11 : 0.07), transition: "background 500ms ease" }} />
      {thread && <LrThread tone={tone} />}
      {corners && <span className="lr-corners"><FdCorners inset={10} size={9} /></span>}
      <div className={`relative z-[1] ${fill ? "flex-1 min-h-0 flex flex-col" : ""}`}>{children}</div>
    </Tag>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrRecess — a carved cell inside a pane. Lighter than its pane.
 * ──────────────────────────────────────────────────────────────────────── */
export const LrRecess = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  tone?: LrTone
  lit?: boolean
  thread?: boolean
  interactive?: boolean
  radius?: number
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  role?: string
  tabIndex?: number
  "aria-pressed"?: boolean
  "aria-label"?: string
}>(function LrRecess({ children, className = "", style, tone = "primary", lit = false, thread = false, interactive = false, radius = LR.recess.radius, onClick, onMouseEnter, onMouseLeave, ...aria }, ref) {
  const accent = toneColor(tone)
  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={interactive && onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick() } } : undefined}
      className={`lr-recess relative ${interactive ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: lit ? LR.recess.bgHover : LR.recess.bg,
        border: `1px solid ${lit ? lrMix(accent, 0.28) : LR.recess.border}`,
        borderRadius: radius,
        boxShadow: lit ? `${LR.recess.shadow}, 0 0 0 1px ${lrMix(accent, 0.08)}, 0 6px 18px ${lrMix(accent, 0.08)}` : LR.recess.shadow,
        transition: "border-color 360ms ease, box-shadow 420ms cubic-bezier(0.22,0.68,0.36,1), background 360ms ease, transform 360ms cubic-bezier(0.22,0.68,0.36,1)",
        ...style,
      }}
      {...aria}
    >
      {thread && <span aria-hidden className="pointer-events-none absolute top-0 left-4 right-4" style={{ height: 1, background: LR.thread(accent, lit ? 0.7 : 0.45), transition: "opacity 300ms" }} />}
      {children}
    </div>
  )
})

/* ────────────────────────────────────────────────────────────────────────
 *  LrChip — mono chip. Tone drives color; `active` drives fill.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrChip({
  children, tone = "primary", active = false, dim = false, size = 9, glyph, onClick, title, className = "", pill = false, ariaPressed, style,
}: {
  children: React.ReactNode
  tone?: LrTone | "ash"
  active?: boolean
  dim?: boolean
  size?: number
  glyph?: React.ReactNode
  onClick?: () => void
  title?: string
  className?: string
  pill?: boolean
  ariaPressed?: boolean
  style?: React.CSSProperties
}) {
  const c = tone === "ash" ? LR.ashSoft : toneColor(tone)
  const Comp: React.ElementType = onClick ? "button" : "span"
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={title}
      aria-pressed={ariaPressed}
      className={`inline-flex items-center gap-1.5 font-mono uppercase whitespace-nowrap select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        fontSize: Math.max(9, size),
        letterSpacing: "0.16em",
        fontWeight: 600,
        color: dim ? LR.ashSoft : c,
        background: active ? lrMix(c, 0.12) : tone === "ash" ? "transparent" : lrMix(c, 0.05),
        border: `1px solid ${active ? lrMix(c, 0.32) : lrMix(c, tone === "ash" ? 0.18 : 0.14)}`,
        borderRadius: pill ? LR.pillRadius : LR.chipRadius,
        padding: pill ? "5px 10px" : "4px 8px",
        lineHeight: 1,
        opacity: dim ? 0.6 : 1,
        transition: "background 260ms ease, border-color 260ms ease, color 260ms ease, opacity 260ms ease, transform 260ms cubic-bezier(0.22,0.68,0.36,1)",
        ...style,
      }}
    >
      {glyph && <span className="inline-flex shrink-0" style={{ color: c }}>{glyph}</span>}
      {children}
    </Comp>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrStat — eyebrow above · value · sub-line below.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrStat({
  label, value, sub, tone = "primary", size = 18, align = "left", valueColor,
}: {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  tone?: LrTone | "paper"
  size?: number
  align?: "left" | "right" | "center"
  valueColor?: string
}) {
  const color = valueColor ?? (tone === "paper" ? LR.paper : toneColor(tone))
  return (
    <div className="flex flex-col gap-1 min-w-0" style={{ alignItems: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start" }}>
      <LrEyebrow size={9}>{label}</LrEyebrow>
      <span className="font-mono tabular-nums leading-none whitespace-nowrap" style={{ fontSize: size, color, letterSpacing: "-0.01em", fontWeight: 500 }}>{value}</span>
      {sub && <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: LR.ashSoft }}>{sub}</span>}
    </div>
  )
}

/* ───────────────────────────────────────────────────────────���────────────
 *  LrFreshnessRing — fills as time passes since a source event.
 *  0 min = empty ring · 30 min = full ring. Stale = ashSoft.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrFreshnessRing({ minutes, horizon = 30, size = 12, tone = "primary" }: { minutes: number; horizon?: number; size?: number; tone?: LrTone }) {
  const pct = Math.max(0, Math.min(1, minutes / horizon))
  const stale = pct >= 1
  const r = (size - 2) / 2
  const circ = 2 * Math.PI * r
  const c = stale ? LR.ashSoft : toneColor(tone)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={lrMix(c, 0.18)} strokeWidth={1.5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={1.5}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,0.68,0.36,1)" }}
      />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrCoin — avatar coin. Primary-ink square with the initial in primary.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrCoin({ initials, size = 24, ring = false, tone = "primary", radius, style }: { initials: string; size?: number; ring?: boolean; tone?: LrTone; radius?: number; style?: React.CSSProperties }) {
  const c = toneColor(tone)
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center shrink-0 font-mono"
      style={{
        width: size, height: size, borderRadius: radius ?? Math.round(size * 0.32),
        background: `linear-gradient(160deg, ${lrMix(c, 0.22)}, ${LR.primaryInk})`,
        border: `1px solid ${ring ? lrMix(c, 0.55) : lrMix(c, 0.22)}`,
        boxShadow: ring ? `0 0 0 2px ${lrMix(c, 0.12)}` : undefined,
        color: c, fontSize: Math.max(9, Math.round(size * 0.42)), fontWeight: 600, letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {initials}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrGhostButton — 32px icon button, hairline ring, primary on hover.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrGhostButton({ children, label, onClick, active = false, tone = "primary", size = 32, className = "" }: {
  children: React.ReactNode; label: string; onClick?: () => void; active?: boolean; tone?: LrTone; size?: number; className?: string
}) {
  const c = toneColor(tone)
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`inline-flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 ${className}`}
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.34),
        color: active ? c : LR.ash,
        background: active ? lrMix(c, 0.12) : "transparent",
        border: `1px solid ${active ? lrMix(c, 0.32) : LR.pane.border}`,
        transition: "color 240ms ease, background 240ms ease, border-color 240ms ease",
      }}
    >
      {children}
    </motion.button>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrSegmented — segmented control with a sliding glass indicator.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrSegmented<T extends string>({ options, value, onChange, size = 9, layoutId, label }: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  size?: number
  layoutId: string
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-0.5 p-0.5" style={{ background: LR.recess.bg, border: `1px solid ${LR.recess.border}`, borderRadius: 10 }}>
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className="relative font-mono uppercase whitespace-nowrap focus:outline-none"
            style={{ fontSize: Math.max(9, size), letterSpacing: "0.14em", fontWeight: 600, color: on ? LR.paper : LR.ashSoft, padding: "5px 9px", borderRadius: 8, lineHeight: 1, transition: "color 260ms ease" }}
          >
            {on && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className="absolute inset-0"
                style={{ borderRadius: 8, background: LR.chipFillHi, border: `1px solid ${LR.chipBorder}` }}
                transition={LR.spring}
              />
            )}
            <span className="relative z-[1]">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrSheen + LrBubbles — the "life" cues. Mount only while hovered.
 *  Deterministic per-index offsets, skipped on reduced motion.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrSheen({ id, tone = "primary" }: { id: string; tone?: LrTone }) {
  const kf = `lr-sheen-${id}`
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <span
        style={{
          position: "absolute", top: 0, bottom: 0, width: "55%", left: 0,
          background: `linear-gradient(110deg, transparent 0%, ${lrMix(toneColor(tone), 0.3)} 50%, transparent 100%)`,
          filter: "blur(3px)",
          animation: `${kf} 1.6s cubic-bezier(0.22, 0.61, 0.36, 1) 1 forwards`,
        }}
      />
      <style>{`@keyframes ${kf}{0%{transform:translateX(-110%);opacity:0}18%{opacity:1}82%{opacity:1}100%{transform:translateX(220%);opacity:0}}`}</style>
    </span>
  )
}

export function LrBubbles({ id, tone = "primary" }: { id: string; tone?: LrTone }) {
  const kf = `lr-bubbles-${id}`
  const c = toneColor(tone)
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {[0, 1, 2, 3, 4, 5].map((b) => {
        const left = 8 + ((b * 37) % 84)
        const size = 3 + (b % 3)
        const dur = 3.2 + (b % 4) * 0.55
        const delay = (b * 0.42) % 1.9
        return (
          <span
            key={b}
            style={{
              position: "absolute", left: `${left}%`, bottom: -8, width: size, height: size, borderRadius: 999,
              background: lrMix(c, 0.55), boxShadow: `0 0 ${size * 2}px ${lrMix(c, 0.35)}`,
              animation: `${kf} ${dur}s cubic-bezier(0.22,0.61,0.36,1) ${delay}s infinite`,
              opacity: 0,
            }}
          />
        )
      })}
      <style>{`@keyframes ${kf}{0%{transform:translateY(0) translateX(0);opacity:0}12%{opacity:.85}60%{transform:translateY(-70px) translateX(6px);opacity:.55}100%{transform:translateY(-120px) translateX(-4px);opacity:0}}`}</style>
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrFactRow — eyebrow left · value right, separated by ruleSoft.
 * ──────────────────────────────────────────────────────────────────────── */
export function LrFactRow({ label, value, tone, last = false, size = 11.5 }: { label: string; value: React.ReactNode; tone?: LrTone; last?: boolean; size?: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[7px]" style={{ borderBottom: last ? "none" : `1px solid ${LR.recess.border}` }}>
      <LrEyebrow size={9} weight={500}>{label}</LrEyebrow>
      <span className="font-mono tabular-nums text-right truncate" style={{ fontSize: size, color: tone ? toneColor(tone) : LR.paper, letterSpacing: "-0.005em" }}>{value}</span>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrConfidence — HIGH primary · MEDIUM amber · LOW ash
 * ──────────────────────────────────────────────────────────────────────── */
export function LrConfidence({ level }: { level: "high" | "medium" | "low" }) {
  return <LrChip tone={level === "high" ? "primary" : level === "medium" ? "warn" : "ash"} active={level === "high"} size={9}>{level}</LrChip>
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrDivider — dashed connector with an optional centered mono chip
 * ──────────────────────────────────────────────────────────────────────── */
export function LrDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
      {label && <LrEyebrow size={9} weight={500}>{label}</LrEyebrow>}
      <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
    </div>
  )
}

export { useReducedMotion }
