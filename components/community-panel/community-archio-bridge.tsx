"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  community-archio-bridge.tsx
 *  ─────────────────────────────────────────────────────────────────────────
 *  Bridges the Community Swipe surface to the canonical Archio language
 *  shipping in <ActiveWindow/>. Everything in here is a thin re-export of,
 *  or a strict structural copy of, primitives that already exist in the
 *  Active Window wing — bound to the same VANTARY tokens, the same
 *  AW_CADENCE / AW_LETTER / AW_SIZE / AW_OPACITY / AW_EASE / AW_DUR scales,
 *  and the same single-accent (amber) discipline.
 *
 *  The community layer NEVER invents motion timings or letter-spacing
 *  numbers of its own. Anything visual reads from this file or from the
 *  active-window-tokens module. That is what makes the Community Swipe
 *  a member of the same instrument cluster as the dashboard wings —
 *  not a sibling design, but the SAME design.
 *
 *  What lives here:
 *    1. Re-exports of the public Archio primitives
 *         · <ArchioSeam/>          — gradient hairline w/ irrational shimmer
 *         · <ArchioPulseDot/>      — concentric sonar live indicator
 *         · <ArchioRotatingLabel/> — content rotation on irrational cadence
 *    2. NameplateHairline / NameplateDot — structural copies of the
 *       (un-exported) helpers in temporal-anchor-rail.tsx, tuned identically.
 *    3. <CmtyNameplate/> — the canonical "──●  TITLE  ●──" assembly used
 *       by every section header in the community panel.
 *    4. Token re-exports under AW.* shorthand for terse call sites.
 * ═════════════════════════════════════════════════════════════════════════ */

import type { CSSProperties, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

import {
  AW_CADENCE,
  AW_DUR,
  AW_EASE,
  AW_LETTER,
  AW_OPACITY,
  AW_SIZE,
} from "@/lib/vantary/active-window-tokens"
import { VANTARY } from "@/components/dashboard/vantary/vantary-theme"

import { ArchioSeam } from "@/components/dashboard/vantary/active-window/archio-seam"
import { ArchioPulseDot } from "@/components/dashboard/vantary/active-window/archio-pulse-dot"
import { ArchioRotatingLabel } from "@/components/dashboard/vantary/active-window/archio-rotating-label"

/* ─────────────────────────────────────────────────────────────────────────
 *  PUBLIC RE-EXPORTS
 *  Keep the original names so call sites read like Archio, not a wrapper.
 * ───────────────────────────────────────────────────────────────────────── */

export { ArchioSeam, ArchioPulseDot, ArchioRotatingLabel, VANTARY }
export {
  AW_CADENCE,
  AW_DUR,
  AW_EASE,
  AW_LETTER,
  AW_OPACITY,
  AW_SIZE,
}

/** Terse alias used in the community panel's call sites:
 *    AW.amber, AW.paper, AW.eyebrow, AW.aw, AW.contentFade …
 *  Maps every surface-level token onto a single namespace so consumers
 *  never reach for a hex literal. */
export const AW = {
  // Color (single accent + paper + ash + status reds — nothing else)
  amber: VANTARY.amber,
  amberHalo: VANTARY.amberHalo,
  amberDeep: VANTARY.amberDeep,
  amberWash: VANTARY.amberWash,
  paper: VANTARY.paper,
  paperDim: VANTARY.paperDim,
  ash: VANTARY.ash,
  ashSoft: VANTARY.ashSoft,
  ashGhost: VANTARY.ashGhost,
  ink: VANTARY.ink,
  ink2: VANTARY.ink2,
  rule: VANTARY.rule,
  ruleSoft: VANTARY.ruleSoft,
  ruleStrong: VANTARY.ruleStrong,
  liveRed: VANTARY.badgeRed,
  liveRedHalo: VANTARY.warnEdge,
  glass: VANTARY.glass,
  glassStrong: VANTARY.glassStrong,
  glassDeep: VANTARY.glassDeep,

  // Letter-spacing — never a magic number again
  letterEyebrow: AW_LETTER.eyebrow,
  letterEyebrowPremium: AW_LETTER.eyebrowPremium,
  letterTabLabel: AW_LETTER.tabLabel,
  letterTabLabelHover: AW_LETTER.tabLabelHover,
  letterNumeric: AW_LETTER.numeric,
  letterHeadline: AW_LETTER.headline,
  letterBody: AW_LETTER.body,

  // Sizes
  liveDotCore: AW_SIZE.liveDotCore,
  microPhaseDot: AW_SIZE.microPhaseDot,
  eyebrowFontSize: AW_SIZE.eyebrowFontSize,
  premiumEyebrowSize: AW_SIZE.premiumEyebrowSize,
  numericSmall: AW_SIZE.numericSmall,
  sessionNameSize: AW_SIZE.sessionNameSize,
  focusBodySize: AW_SIZE.focusBodySize,
  whyExpectSize: AW_SIZE.whyExpectSize,
  textHaloIdle: AW_SIZE.textHaloIdle,
  textHaloBreath: AW_SIZE.textHaloBreath,

  // Cadences (irrational across the panel — see active-window-tokens.ts)
  cadenceLiveTabHalo: AW_CADENCE.liveTabHalo,
  cadenceTabLabelRotation: AW_CADENCE.tabLabelRotation,
  cadenceBodyRotation: AW_CADENCE.bodyRotation,
  cadencePanelBreath: AW_CADENCE.panelBreath,
  cadenceWhyExpectSeam: AW_CADENCE.whyExpectSeam,
  cadenceMinuteFlash: AW_CADENCE.minuteRolloverFlash,
  cadenceSessionTagKZ: AW_CADENCE.sessionTagPulse.kz,
  cadenceSessionTagDead: AW_CADENCE.sessionTagPulse.dead,

  // Easing & durations
  ease: AW_EASE.aw,
  durContentFade: AW_DUR.contentFade,
  durHeadlineMorph: AW_DUR.headlineMorph,

  // Opacity ramps (canonical AW_OPACITY names — no inventing keys)
  opKzNameplate: AW_OPACITY.kzNameplate,
  opDeadNameplate: AW_OPACITY.deadNameplate,
  opInactiveTab: AW_OPACITY.inactiveTab,
  opPanelBreathMin: AW_OPACITY.panelBreathMin,
  opPanelBreathMax: AW_OPACITY.panelBreathMax,
  opLiveTabHaloMin: AW_OPACITY.liveTabHaloMin,
  opLiveTabHaloMax: AW_OPACITY.liveTabHaloMax,
  opRippleStart: AW_OPACITY.rippleAlphaStart,
  opRippleEnd: AW_OPACITY.rippleAlphaEnd,
} as const

/* ─────────────────────────────────────────────────────────────────────────
 *  <NameplateHairline/>
 *  Structural copy of the (un-exported) helper in temporal-anchor-rail.tsx,
 *  tuned identically. The hairline pinches to TRANSPARENT at the outer
 *  panel edge and rises to the accent at the INNER edge, so the title
 *  reads as a fold-open chapter marker — strongest light at the dot.
 * ───────────────────────────────────────────────────────────────────────── */
export function NameplateHairline({
  side,
  accent = AW.amber,
  accentSubtle = AW.amberHalo,
  reduced,
  flex = 1,
}: {
  side: "left" | "right"
  accent?: string
  accentSubtle?: string
  reduced?: boolean
  flex?: number | string
}) {
  const isReduced = reduced ?? false
  const direction = side === "left" ? "to right" : "to left"
  return (
    <span
      aria-hidden
      style={{
        flex,
        height: 1,
        background:
          `linear-gradient(${direction}, ` +
          `transparent 0%, ` +
          `${accentSubtle} 50%, ` +
          `${accent} 100%)`,
        opacity: isReduced ? 0.55 : 0.72,
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <NameplateDot/>
 *  4×4 accent dot terminating each nameplate hairline. Mirrors the helper
 *  in temporal-anchor-rail.tsx exactly. Has a soft halo so the dot reads
 *  as a printed-circuit terminal, not a ui chip.
 * ───────────────────────────────────────────────────────────────────────── */
export function NameplateDot({ accent = AW.amber }: { accent?: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: accent,
        boxShadow: `0 0 6px ${accent}`,
        flexShrink: 0,
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <CmtyNameplate/>
 *  The canonical Archio nameplate assembly:
 *
 *      ─────────● ㅤ TITLEㅤ ●─────────
 *
 *  Used by every named section header in the community panel — the shell
 *  header, the Live Now band, the room-group dividers, the Room Pulse,
 *  the deploy modal title.  A `subtitle` slot rendered underneath in
 *  premium eyebrow type — same hierarchy the Active Window dossier uses
 *  for its session name + pulsing tag.
 * ───────────────────────────────────────────────────────────────────────── */
export function CmtyNameplate({
  title,
  subtitle,
  accent = AW.amber,
  paddingX = 12,
  align = "center",
  className,
  style,
}: {
  title: ReactNode
  subtitle?: ReactNode
  accent?: string
  paddingX?: number
  align?: "center" | "left"
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion() ?? false
  const Wrap = align === "center" ? "div" : "div"

  return (
    <Wrap
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "stretch",
        gap: 4,
        ...style,
      }}
    >
      {/* Hairline · dot · TITLE · dot · hairline */}
      <div
        className="flex items-center"
        style={{ width: "100%", gap: 8 }}
      >
        <NameplateHairline side="left" accent={accent} reduced={reduced} />
        <NameplateDot accent={accent} />
        <span
          className="font-sans"
          style={{
            paddingLeft: paddingX,
            paddingRight: paddingX,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: AW.letterHeadline,
            color: AW.paper,
            lineHeight: 1.1,
            textWrap: "balance",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <NameplateDot accent={accent} />
        <NameplateHairline side="right" accent={accent} reduced={reduced} />
      </div>

      {/* Subtitle · premium amber eyebrow w/ amber halo (matches FOCUS NOW) */}
      {subtitle != null && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: AW.durContentFade, ease: AW.ease }}
          className="font-mono uppercase"
          style={{
            fontSize: AW.premiumEyebrowSize,
            letterSpacing: AW.letterEyebrowPremium,
            color: AW.amber,
            fontWeight: 500,
            textShadow: `0 0 8px ${AW.amberHalo}`,
          }}
        >
          {subtitle}
        </motion.div>
      )}
    </Wrap>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <CmtyEyebrow/>
 *  9pt mono uppercase eyebrow at canonical letter-spacing 0.34em.
 *  Replaces every ad-hoc `text-[10px] uppercase tracking-wider` in the
 *  community panel.  Single component → one source of truth for eyebrows.
 * ───────────────────────────────────────────────────────────────────────── */
export function CmtyEyebrow({
  children,
  tone = "ash",
  size = AW.eyebrowFontSize,
  letter = AW.letterEyebrow,
  glow = false,
  className,
  style,
}: {
  children: ReactNode
  tone?: "ash" | "ashSoft" | "paper" | "amber" | "live"
  size?: number
  letter?: string
  glow?: boolean
  className?: string
  style?: CSSProperties
}) {
  const color =
    tone === "amber" ? AW.amber :
    tone === "live"  ? AW.liveRed :
    tone === "paper" ? AW.paper :
    tone === "ashSoft" ? AW.ashSoft :
                       AW.ash
  return (
    <span
      className={`font-mono uppercase ${className ?? ""}`}
      style={{
        fontSize: size,
        letterSpacing: letter,
        color,
        fontWeight: 500,
        textShadow: glow ? `0 0 8px ${AW.amberHalo}` : undefined,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <CmtyMagnitude/>
 *  Lead-bold / tail-light split numerals — the Active Window dossier idiom
 *  for headline counts ("847 LISTENING", "2,403 MEMBERS"). Tabular nums,
 *  monospace digits, paper colour for the lead, ash for the tail label.
 * ───────────────────────────────────────────────────────────────────────── */
export function CmtyMagnitude({
  value,
  suffix,
  size = 15,
  align = "left",
  tone = "paper",
  style,
}: {
  value: ReactNode
  suffix?: ReactNode
  size?: number
  align?: "left" | "right"
  tone?: "paper" | "amber"
  style?: CSSProperties
}) {
  const lead = tone === "amber" ? AW.amber : AW.paper
  return (
    <span
      className="font-mono tabular-nums"
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: size,
          fontWeight: 600,
          color: lead,
          letterSpacing: AW.letterNumeric,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {suffix != null && (
        <span
          className="uppercase"
          style={{
            fontSize: 9,
            color: AW.ashSoft,
            letterSpacing: AW.letterEyebrow,
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {suffix}
        </span>
      )}
    </span>
  )
}
