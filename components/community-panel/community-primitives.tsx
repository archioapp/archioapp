"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  COMMUNITY SWIPE — DESIGN SYSTEM FOUNDATION  (Phase 1)
 *  ─────────────────────────────────────────────────────────────────────────
 *  These primitives are the visual vocabulary of the redesigned Community
 *  Swipe. They sit in their own file so:
 *
 *    1.  floating-community-hub.tsx stays untouched in Phase 1
 *    2.  the rebuild in Phases 2–6 is a series of small, surgical swaps
 *        ( <colored-bubble/> → <CSSigil/>, <flat-row/> → <CSRoomRow/>, etc.)
 *    3.  the language is shared with Forecast Hub & Flight Deck:
 *          – VANTARY tokens (theme-routed, single primary accent)
 *          – mono uppercase eyebrows, 9pt, 0.22em
 *          – sans display titles, -0.018em
 *          – 14–24px glass radii, blur(28px) saturate(150%)
 *          – hairline shimmer on the top edge of premium surfaces
 *          – registration L-marks at the corners of attention bands
 *          – breathing 1.6s live pulse, reduced-motion respected
 *          – Archio-seam dashed connectors instead of hard borders
 *
 *  Status-only red (`VANTARY.offlineDot` / `VANTARY.chartDown`) is reserved
 *  for LIVE / urgent state. Everything else uses the single theme primary
 *  (`VANTARY.amber` — which is whatever color the user picked).
 *
 *  NOTHING in this file imports from floating-community-hub.tsx. It is a
 *  one-way dependency: the hub will start importing FROM here in Phase 2.
 * ═══════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

import { VANTARY, EASE_V, RADIUS_V } from "@/components/dashboard/vantary/vantary-theme"

/* ────────────────────────────────────────────────────────────────────────
 *  TOKENS — local shorthand. We keep these as a single export so any
 *  later phase can read CS.* without re-importing VANTARY everywhere.
 *  ────────────────────────────────────────────────────────────────────── */

export const CS = {
  /* surfaces */
  ink:           VANTARY.ink,
  ink2:          VANTARY.ink2,
  glass:         VANTARY.glass,
  glassStrong:   VANTARY.glassStrong,
  glassDeep:     VANTARY.glassDeep,

  /* hairlines */
  rule:          VANTARY.rule,
  ruleSoft:      VANTARY.ruleSoft,
  ruleStrong:    VANTARY.ruleStrong,

  /* foreground */
  paper:         VANTARY.paper,
  paperDim:      VANTARY.paperDim,
  ash:           VANTARY.ash,
  ashSoft:       VANTARY.ashSoft,
  ashGhost:      VANTARY.ashGhost,

  /* single accent (theme primary, NOT hardcoded) */
  accent:        VANTARY.amber,
  accentDeep:    VANTARY.amberDeep,
  accentInk:     VANTARY.amberInk,
  accentWash:    VANTARY.amberWash,
  accentHalo:    VANTARY.amberHalo,

  /* status (reserved — used sparingly) */
  live:          VANTARY.chartDown,    // red, for LIVE only
  liveHalo:      "rgba(239,68,68,0.35)",
  ok:            VANTARY.chartUp,      // green, for verified/win only

  /* geometry */
  radiusCard:    RADIUS_V.card,        // 20
  radiusCardLg:  RADIUS_V.cardLg,      // 24
  radiusInner:   RADIUS_V.inner,       // 14
  radiusChip:    RADIUS_V.chip,        // 10
  radiusPill:    RADIUS_V.pill,        // 999
} as const

export const CS_EASE = EASE_V

/* Eyebrow contract — every section label in the rebuild uses these.
   9pt, mono, uppercase, 0.22em — Forecast Hub / Flight Deck signature. */
export const CS_EYEBROW = {
  fontSize: 9,
  letterSpacing: "0.22em",
  fontWeight: 600,
} as const

/* ────────────────────────────────────────────────────────────────────────
 *  CSEyebrow — small-caps mono section label.
 *  Tone "accent" uses theme primary, "ash" is neutral, "paper" is high.
 *  ────────────────────────────────────────────────────────────────────── */

export function CSEyebrow({
  children,
  tone = "ash",
  size = CS_EYEBROW.fontSize,
  className = "",
  style,
}: {
  children: React.ReactNode
  tone?: "ash" | "accent" | "paper" | "live"
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  const color =
    tone === "accent" ? CS.accent :
    tone === "paper"  ? CS.paper  :
    tone === "live"   ? CS.live   :
                        CS.ashSoft
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        fontSize: size,
        letterSpacing: CS_EYEBROW.letterSpacing,
        fontWeight: CS_EYEBROW.fontWeight,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSSeam — Archio-style dashed connector hairline. Replaces hard
 *  border-t lines between bands. Accepts a "shimmer" prop that fades
 *  a soft accent traveler across the line (subtle, expensive feel).
 *  ────────────────────────────────────────────────────────────────────── */

export function CSSeam({
  className = "",
  shimmer = false,
  vertical = false,
  thickness = 1,
  color,
  style,
}: {
  className?: string
  shimmer?: boolean
  vertical?: boolean
  thickness?: number
  color?: string
  style?: React.CSSProperties
}) {
  const reduce = useReducedMotion()
  const c = color ?? CS.rule
  const gradient = vertical
    ? `repeating-linear-gradient(180deg, ${c} 0 4px, transparent 4px 8px)`
    : `repeating-linear-gradient(90deg, ${c} 0 4px, transparent 4px 8px)`
  return (
    <span
      aria-hidden
      className={`relative block overflow-hidden ${className}`}
      style={{
        width: vertical ? thickness : "100%",
        height: vertical ? "100%" : thickness,
        background: gradient,
        ...style,
      }}
    >
      {shimmer && !reduce && (
        <motion.span
          aria-hidden
          className="absolute"
          style={{
            inset: 0,
            background: vertical
              ? `linear-gradient(180deg, transparent 0%, ${CS.accentHalo} 50%, transparent 100%)`
              : `linear-gradient(90deg, transparent 0%, ${CS.accentHalo} 50%, transparent 100%)`,
            mixBlendMode: "screen",
          }}
          animate={vertical ? { y: ["-100%", "100%"] } : { x: ["-100%", "100%"] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: "linear" }}
        />
      )}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSCorners — registration L-marks at the four corners. Pulled from
 *  Flight Deck's FdCorners DNA. Used on every primary attention band.
 *  ────────────────────────────────────────────────────────────────────── */

export function CSCorners({
  inset = 10,
  size = 9,
  thickness = 1,
  color,
  opacity = 0.7,
}: {
  inset?: number
  size?: number
  thickness?: number
  color?: string
  opacity?: number
}) {
  const c = color ?? CS.ashSoft
  const tick = (x: "l" | "r", y: "t" | "b") => (
    <span
      key={`${x}${y}`}
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left:   x === "l" ? inset : "auto",
        right:  x === "r" ? inset : "auto",
        top:    y === "t" ? inset : "auto",
        bottom: y === "b" ? inset : "auto",
        width:  size,
        height: size,
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, width: size,      height: thickness, background: c, opacity }} />
      <span style={{ position: "absolute", left: 0, top: 0, width: thickness, height: size,      background: c, opacity }} />
    </span>
  )
  return (
    <>
      {tick("l", "t")}
      {tick("r", "t")}
      {tick("l", "b")}
      {tick("r", "b")}
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSGlassSlab — the canonical glass surface for the redesign.
 *
 *    variant:
 *      "glass"   – plane-1 default (community panels, room rows)
 *      "deep"    – plane-0 (the swipe shell itself, modal backdrops)
 *      "attention" – wash of theme primary (Live Now band, hero CTAs)
 *
 *    elev:
 *      "flat" | "raised" | "halo"
 *
 *  Renders a hairline shimmer on the top edge by default — the
 *  Forecast Hub signature for "premium surface".
 *  ────────────────────────────────────────────────────────────────────── */

type CSGlassSlabProps = {
  children?: React.ReactNode
  variant?: "glass" | "deep" | "attention"
  elev?: "flat" | "raised" | "halo"
  radius?: number | string
  corners?: boolean
  cornerInset?: number
  cornerSize?: number
  topShimmer?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  role?: string
  ariaLabel?: string
}

export function CSGlassSlab({
  children,
  variant = "glass",
  elev = "flat",
  radius = CS.radiusCard,
  corners = false,
  cornerInset = 10,
  cornerSize = 9,
  topShimmer = true,
  className = "",
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  role,
  ariaLabel,
}: CSGlassSlabProps) {
  const background =
    variant === "deep"      ? CS.glassDeep :
    variant === "attention" ? CS.accentWash :
                              CS.glass
  const borderColor =
    variant === "attention" ? CS.accentHalo :
                              CS.rule
  const shadow =
    elev === "halo"
      ? `0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px rgba(0,0,0,0.45), 0 0 24px ${CS.accentHalo}`
      : elev === "raised"
        ? "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.30)"
        : "0 1px 0 rgba(255,255,255,0.02) inset, 0 2px 10px rgba(0,0,0,0.18)"
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: radius,
        backdropFilter: "blur(28px) saturate(150%)",
        WebkitBackdropFilter: "blur(28px) saturate(150%)",
        boxShadow: shadow,
        ...style,
      }}
    >
      {topShimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${
              variant === "attention" ? CS.accentHalo : "rgba(255,255,255,0.08)"
            } 25%, ${
              variant === "attention" ? CS.accent : "rgba(255,255,255,0.12)"
            } 50%, ${
              variant === "attention" ? CS.accentHalo : "rgba(255,255,255,0.08)"
            } 75%, transparent 100%)`,
          }}
        />
      )}
      {corners && <CSCorners inset={cornerInset} size={cornerSize} />}
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSLivePulse — small breathing red dot for LIVE state.
 *  1.6s cadence to match Flight Deck FdLiveTick. Reduced-motion respected.
 *  ────────────────────────────────────────────────────────────────────── */

export function CSLivePulse({
  size = 6,
  color = CS.live,
  halo,
  className = "",
}: {
  size?: number
  color?: string
  halo?: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const h = halo ?? CS.liveHalo
  if (reduce) {
    return (
      <span
        aria-hidden
        className={`inline-block rounded-full ${className}`}
        style={{ width: size, height: size, background: color, boxShadow: `0 0 6px ${h}` }}
      />
    )
  }
  return (
    <span aria-hidden className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: color, opacity: 0.45 }}
        animate={{ scale: [1, 2.1, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative inline-block rounded-full"
        style={{ width: size, height: size, background: color, boxShadow: `0 0 6px ${h}` }}
      />
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSSigil — community 2-letter sigil. Mono, monochrome by default.
 *  Replaces the Discord-style gradient bubble. Active state lifts the
 *  sigil onto a theme-primary wash with a left accent bar (drawn by the
 *  parent rail row, NOT inside the sigil itself).
 *  ────────────────────────────────────────────────────────────────────── */

export function CSSigil({
  initials,
  active = false,
  size = 38,
  className = "",
  style,
}: {
  initials: string
  active?: boolean
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={`relative inline-flex items-center justify-center font-mono tabular-nums select-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: CS.radiusInner,
        background: active ? CS.accentWash : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? CS.accentHalo : CS.rule}`,
        color: active ? CS.accent : CS.paperDim,
        fontSize: Math.round(size * 0.36),
        fontWeight: 600,
        letterSpacing: "0.06em",
        transition: "background 220ms ease, color 220ms ease, border-color 220ms ease",
        ...style,
      }}
    >
      {initials}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSTierGlyph — premium / mentor / public / war room tier markers.
 *  Geometric, not colorful. The hierarchy reads as a single glyph
 *  scale, so the rail does not become a rainbow.
 *
 *      mentor   → ⬡ (hex)
 *      premium  → ◆ (diamond)
 *      public   → ○ (ring)
 *      war      → ▣ (filled square)
 *      prop     → ▲ (triangle)
 *  ────────────────────────────────────────────────────────────────────── */

export type CSTier = "mentor" | "premium" | "public" | "war" | "prop"

const TIER_GLYPH: Record<CSTier, string> = {
  mentor:  "⬡",
  premium: "◆",
  public:  "○",
  war:     "▣",
  prop:    "▲",
}

const TIER_LABEL: Record<CSTier, string> = {
  mentor:  "Mentor Desk",
  premium: "Premium",
  public:  "Public",
  war:     "War Room",
  prop:    "Prop Firm",
}

export function CSTierGlyph({
  tier,
  active = false,
  size = 9,
  className = "",
  withLabel = false,
}: {
  tier: CSTier
  active?: boolean
  size?: number
  className?: string
  withLabel?: boolean
}) {
  const color = active ? CS.accent : CS.ashSoft
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} style={{ color }}>
      <span aria-hidden style={{ fontSize: size + 2, lineHeight: 1 }}>
        {TIER_GLYPH[tier]}
      </span>
      {withLabel && (
        <CSEyebrow tone={active ? "accent" : "ash"} size={size}>
          {TIER_LABEL[tier]}
        </CSEyebrow>
      )}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSStatusPill — minimal mono uppercase pill. Used for LIVE / NEW /
 *  MENTOR / VERIFIED / EXPIRING. Color is opt-in; default is paper-dim
 *  on chip-fill so a row never looks like a Skittle bag.
 *  ────────────────────────────────────────────────────────────────────── */

export function CSStatusPill({
  children,
  tone = "neutral",
  size = 8.5,
  className = "",
}: {
  children: React.ReactNode
  tone?: "neutral" | "accent" | "live" | "ok"
  size?: number
  className?: string
}) {
  const color =
    tone === "accent" ? CS.accent :
    tone === "live"   ? CS.live   :
    tone === "ok"     ? CS.ok     :
                        CS.paperDim
  const bg =
    tone === "accent" ? CS.accentWash :
    tone === "live"   ? "rgba(239,68,68,0.12)" :
    tone === "ok"     ? "rgba(16,185,129,0.12)" :
                        "rgba(255,255,255,0.04)"
  const border =
    tone === "accent" ? CS.accentHalo :
    tone === "live"   ? "rgba(239,68,68,0.30)" :
    tone === "ok"     ? "rgba(16,185,129,0.30)" :
                        CS.rule
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase ${className}`}
      style={{
        fontSize: size,
        letterSpacing: "0.18em",
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 4,
        padding: "2px 6px",
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSActionButton — editorial outlined CTA.
 *  Variants:
 *    "ghost"   — minimal text link, on-hover faint wash
 *    "outline" — primary editorial; 1px hairline; shine sweep on hover
 *    "solid"   — accent fill; reserved for ONE primary action per band
 *  ────────────────────────────────────────────────────────────────────── */

type CSActionButtonProps = {
  children: React.ReactNode
  variant?: "ghost" | "outline" | "solid"
  size?: "sm" | "md"
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  ariaLabel?: string
  type?: "button" | "submit"
}

export function CSActionButton({
  children,
  variant = "outline",
  size = "md",
  iconLeft,
  iconRight,
  onClick,
  fullWidth = false,
  disabled = false,
  className = "",
  ariaLabel,
  type = "button",
}: CSActionButtonProps) {
  const reduce = useReducedMotion()
  const h = size === "sm" ? 30 : 36
  const px = size === "sm" ? 12 : 16
  const fs = size === "sm" ? 11 : 12

  const palette =
    variant === "solid"
      ? { bg: CS.accent,      fg: CS.accentInk,  bd: CS.accent       }
      : variant === "outline"
        ? { bg: "transparent", fg: CS.paper,      bd: CS.accentHalo   }
        : { bg: "transparent", fg: CS.paperDim,   bd: "transparent"   }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.18, ease: CS_EASE }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden font-mono uppercase select-none ${className}`}
      style={{
        height: h,
        paddingLeft: px,
        paddingRight: px,
        width: fullWidth ? "100%" : "auto",
        background: palette.bg,
        color: palette.fg,
        border: `1px solid ${palette.bd}`,
        borderRadius: CS.radiusChip,
        fontSize: fs,
        letterSpacing: "0.16em",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background 200ms ease, color 200ms ease, border-color 200ms ease",
      }}
    >
      {/* Shine sweep — outline variant only, reduced-motion safe */}
      {variant === "outline" && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 0.9, ease: CS_EASE }}
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${CS.accentHalo} 50%, transparent 100%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
      {iconLeft && <span className="relative inline-flex">{iconLeft}</span>}
      <span className="relative">{children}</span>
      {iconRight && <span className="relative inline-flex">{iconRight}</span>}
    </motion.button>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSRoomRow — borderless room row with active accent bar.
 *  Used in the new "Rooms by Purpose" navigator (Phase 5).
 *
 *    layout:
 *      [ left accent bar (active only) ]
 *      [ icon ] [ name + sub ]              [ status pill ] [ count ]
 *
 *  Click → setActiveView(...) (passed via onClick).
 *  ────────────────────────────────────────────────────────────────────── */

export function CSRoomRow({
  icon,
  label,
  sub,
  active = false,
  status,
  count,
  onClick,
  className = "",
}: {
  icon?: React.ReactNode
  label: React.ReactNode
  sub?: React.ReactNode
  active?: boolean
  status?: React.ReactNode
  count?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px 9px 14px",
        borderRadius: CS.radiusInner,
        background: active ? CS.accentWash : "transparent",
        border: `1px solid ${active ? CS.accentHalo : "transparent"}`,
        transition: "background 200ms ease, border-color 200ms ease",
      }}
    >
      {/* Active left accent bar */}
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: 4,
          top: 8,
          bottom: 8,
          width: 2,
          borderRadius: 2,
          background: active ? CS.accent : "transparent",
          opacity: active ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />

      {/* Hover wash (subtle, only when inactive) */}
      {!active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderRadius: CS.radiusInner,
            transition: "opacity 200ms ease",
          }}
        />
      )}

      {icon && (
        <span
          className="relative inline-flex items-center justify-center shrink-0"
          style={{
            width: 22,
            height: 22,
            color: active ? CS.accent : CS.ash,
            transition: "color 200ms ease",
          }}
        >
          {icon}
        </span>
      )}

      <span className="relative flex flex-1 min-w-0 flex-col">
        <span
          className="font-sans truncate"
          style={{
            fontSize: 12.5,
            fontWeight: active ? 600 : 500,
            letterSpacing: "-0.005em",
            color: active ? CS.paper : CS.paperDim,
            transition: "color 200ms ease, font-weight 200ms ease",
          }}
        >
          {label}
        </span>
        {sub && (
          <span
            className="font-mono uppercase truncate"
            style={{
              fontSize: 8.5,
              letterSpacing: "0.16em",
              color: CS.ashSoft,
              marginTop: 2,
              opacity: 0.85,
            }}
          >
            {sub}
          </span>
        )}
      </span>

      {status && <span className="relative">{status}</span>}

      {typeof count !== "undefined" && (
        <span
          className="relative font-mono tabular-nums"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.14em",
            color: active ? CS.accent : CS.ashSoft,
            minWidth: 18,
            textAlign: "right",
          }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSCommandBand — stratified band shell. The new Command Surface
 *  (Phase 3) is a vertical stack of these bands:
 *
 *    NAMEPLATE  |  LIVE NOW  |  ROOMS BY PURPOSE  |  ROOM PULSE  |  ACTIONS
 *
 *  Each band has:
 *    – mono uppercase eyebrow on the left
 *    – dashed connector to the right edge
 *    – optional trailing element (live tick, count, mini-action)
 *    – content slot
 *    – optional Archio seam at the bottom (separates next band)
 *  ────────────────────────────────────────────────────────────────────── */

export function CSCommandBand({
  eyebrow,
  trailing,
  children,
  bottomSeam = true,
  seamShimmer = false,
  paddingY = 14,
  paddingX = 16,
  className = "",
  eyebrowTone = "ash",
}: {
  eyebrow?: React.ReactNode
  trailing?: React.ReactNode
  children: React.ReactNode
  bottomSeam?: boolean
  seamShimmer?: boolean
  paddingY?: number
  paddingX?: number
  className?: string
  eyebrowTone?: "ash" | "accent" | "paper" | "live"
}) {
  return (
    <section
      className={`relative ${className}`}
      style={{ paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX }}
    >
      {eyebrow && (
        <header className="flex items-center gap-3 mb-2.5">
          {typeof eyebrow === "string" ? (
            <CSEyebrow tone={eyebrowTone}>{eyebrow}</CSEyebrow>
          ) : (
            eyebrow
          )}
          <span
            aria-hidden
            className="flex-1 h-px"
            style={{
              background: `repeating-linear-gradient(90deg, ${CS.rule} 0 4px, transparent 4px 8px)`,
            }}
          />
          {trailing}
        </header>
      )}
      {children}
      {bottomSeam && (
        <span aria-hidden className="absolute bottom-0 left-0 right-0">
          <CSSeam shimmer={seamShimmer} />
        </span>
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSNameplate — Flight-Deck-style centered identity plate.
 *
 *    ────●  ICT MASTERY · PRIVATE DESK  ●────
 *
 *  The dots are theme primary, the lines are dashed rule, the title is
 *  small-caps mono. Used as the very top of the Command Surface to give
 *  the active community a sense of "you are inside this room".
 *  ────────────────────────────────────────────────────────────────────── */

export function CSNameplate({
  title,
  subtitle,
  className = "",
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
}) {
  const dot = (
    <span
      aria-hidden
      className="inline-block rounded-full"
      style={{
        width: 5,
        height: 5,
        background: CS.accent,
        boxShadow: `0 0 6px ${CS.accentHalo}`,
      }}
    />
  )
  const dash = (
    <span
      aria-hidden
      className="block h-px"
      style={{
        width: 28,
        background: `repeating-linear-gradient(90deg, ${CS.ruleStrong} 0 4px, transparent 4px 8px)`,
      }}
    />
  )
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        {dash}
        {dot}
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.22em",
            color: CS.paper,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        {dot}
        {dash}
      </div>
      {subtitle && (
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.20em",
            color: CS.ashSoft,
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSMagnitude — lead-bold / tail-light split numeral. Mirrors Flight
 *  Deck's FdMagnitude but smaller, for inline counters (members online,
 *  active rooms, mentor seats). Useful inside the nameplate meta line.
 *  ────────────────────────────────────────────────────────────────────── */

function splitNumber(v: string): { lead: string; tail: string } {
  // "2,403" → lead: "2", tail: ",403". "218" → lead "2", tail "18".
  // "JOIN" or non-numeric → all lead.
  if (!/\d/.test(v)) return { lead: v, tail: "" }
  return { lead: v.slice(0, 1), tail: v.slice(1) }
}

export function CSMagnitude({
  value,
  suffix,
  size = 22,
  tone = "paper",
  className = "",
}: {
  value: string
  suffix?: string
  size?: number
  tone?: "paper" | "accent"
  className?: string
}) {
  const { lead, tail } = splitNumber(value)
  const leadColor = tone === "accent" ? CS.accent : CS.paper
  return (
    <span className={`inline-flex items-baseline gap-1 select-none ${className}`}>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.018em",
          fontWeight: 600,
          color: leadColor,
        }}
      >
        {lead}
      </span>
      {tail && (
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: size,
            lineHeight: 1,
            letterSpacing: "-0.018em",
            fontWeight: 300,
            color: CS.ash,
          }}
        >
          {tail}
        </span>
      )}
      {suffix && (
        <span
          className="font-mono uppercase"
          style={{
            fontSize: Math.max(8.5, Math.round(size * 0.42)),
            letterSpacing: "0.18em",
            color: CS.ashSoft,
            marginLeft: 4,
            fontWeight: 600,
          }}
        >
          {suffix}
        </span>
      )}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSMetaLine — compact horizontal meta row used under the nameplate
 *  and inside the Room Pulse band.  Renders a list of label/value pairs
 *  with dot separators between them.
 *
 *    218 ONLINE · 3 LIVE ROOMS · MENTOR ACTIVE
 *  ────────────────────────────────────────────────────────────────────── */

export function CSMetaLine({
  items,
  className = "",
}: {
  items: Array<{
    label: React.ReactNode
    tone?: "ash" | "paper" | "accent" | "live"
    icon?: React.ReactNode
  }>
  className?: string
}) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${className}`}>
      {items.map((it, i) => {
        const color =
          it.tone === "accent" ? CS.accent :
          it.tone === "paper"  ? CS.paper  :
          it.tone === "live"   ? CS.live   :
                                 CS.ashSoft
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span
                aria-hidden
                className="inline-block rounded-full"
                style={{ width: 2, height: 2, background: CS.ashGhost, opacity: 0.7 }}
              />
            )}
            <span
              className="inline-flex items-center gap-1.5 font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.20em",
                color,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {it.icon}
              {it.label}
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  CSGroupHeader — used to separate room groups (Mentor Desk / Trading
 *  Floor / Intel & Growth). A small-caps eyebrow with a left tier glyph
 *  and a hairline rule extending right.
 *  ────────────────────────────────────────────────────────────────────── */

export function CSGroupHeader({
  label,
  glyph,
  tone = "ash",
  trailing,
  className = "",
}: {
  label: React.ReactNode
  glyph?: React.ReactNode
  tone?: "ash" | "accent"
  trailing?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2.5 px-1.5 ${className}`}>
      {glyph && (
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: 14,
            height: 14,
            color: tone === "accent" ? CS.accent : CS.ashSoft,
            fontSize: 11,
            lineHeight: 1,
          }}
        >
          {glyph}
        </span>
      )}
      <CSEyebrow tone={tone}>{label}</CSEyebrow>
      <span
        aria-hidden
        className="flex-1 h-px"
        style={{ background: CS.ruleSoft }}
      />
      {trailing}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  Optional: motion-aware wrapper. Re-exported helper for any band-level
 *  enter animation. Reduces motion automatically.
 *  ────────────────────────────────────────────────────────────────────── */

export function CSReveal({
  children,
  delay = 0,
  y = 6,
  duration = 0.42,
  className = "",
  style,
  ...rest
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
} & Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition">) {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: CS_EASE, delay }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXPORT SUMMARY
 *  ─────────────────────────────────────────────────────────────────────────
 *    CS                — token shorthand (single accent, glass, rules, radii)
 *    CS_EASE           — shared cubic-bezier
 *    CS_EYEBROW        — eyebrow type contract
 *
 *    CSEyebrow         — section labels
 *    CSSeam            — Archio dashed connector (optional shimmer)
 *    CSCorners         — registration L-marks
 *    CSGlassSlab       — canonical glass surface (variants: glass/deep/attention)
 *    CSLivePulse       — breathing live dot
 *    CSSigil           — community 2-letter sigil (no gradient)
 *    CSTierGlyph       — mentor/premium/public/war/prop glyph
 *    CSStatusPill      — mono uppercase pill (neutral/accent/live/ok)
 *    CSActionButton    — editorial CTA (ghost/outline/solid)
 *    CSRoomRow         — borderless room row with active accent bar
 *    CSCommandBand     — stratified band shell (eyebrow + connector + seam)
 *    CSNameplate       — Flight-Deck centered identity plate
 *    CSMagnitude       — lead-bold / tail-light numeral
 *    CSMetaLine        — dot-separated meta row
 *    CSGroupHeader     — room-group separator with tier glyph
 *    CSReveal          — motion-aware reveal wrapper
 *
 *  None of these are mounted yet. Phase 2 begins the surgical swaps.
 * ═══════════════════════════════════════════════════════════════════════ */
