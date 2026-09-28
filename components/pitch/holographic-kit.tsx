"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ARCHIO AI · HOLOGRAPHIC KIT
   ───────────────────────────────────────────────────────────────────────
   Shared, fully theme-aware "bright holographic glass" primitives used by
   the two reconstructed hero slides (Cover + Problem).

   Design philosophy — why this exists:
   The original hero slides rendered everything at ~2% white surfaces with
   zinc-500/600/700 text on near-black, so they read dim, flat, and
   monochrome. This kit fixes the root cause by deriving a BRIGHT, high
   contrast palette from the active VantaryTheme and exposing luminous glass
   primitives (gradient-stroked cards, glowing stats, aurora backdrop).

   Core visual metaphor shared across both slides:
   • SIX systems = six different vivid colors = chaos / fragmentation.
     -> exposed as SPECTRUM (deliberately NOT the theme accent).
   • Archio's UNIFIED layer = the single theme accent = order / continuity.
   ═══════════════════════════════════════════════════════════════════════ */

import type React from "react"
import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { VantaryTheme } from "@/components/dashboard/vantary/theme-system"

/* ── alpha helper: append an 8-bit alpha to a hex, or wrap rgb/var ──────── */
export function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))
  if (color.startsWith("#")) {
    let hex = color.slice(1)
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
    const v = Math.round(a * 255).toString(16).padStart(2, "0")
    return `#${hex}${v}`
  }
  // rgb() / rgba() / hsl() / var() — fall back to color-mix for robustness
  return `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`
}

/* ── multi-stop glow shadow from a single color ────────────────────────── */
export function glow(color: string, intensity = 1): string {
  return [
    `0 0 ${16 * intensity}px ${withAlpha(color, 0.45)}`,
    `0 0 ${40 * intensity}px ${withAlpha(color, 0.22)}`,
    `0 0 ${90 * intensity}px ${withAlpha(color, 0.1)}`,
  ].join(", ")
}

/* ═══════════════════════════════════════════════════════════════════════
   PALETTE — derive a bright, theme-aware working palette
   ═══════════════════════════════════════════════════════════════════════ */

export interface HoloPalette {
  isLight: boolean
  /* backgrounds */
  bg: string
  bg2: string
  bg3: string
  bgDeep: string
  /* text */
  text: string
  textDim: string
  textSoft: string
  textGhost: string
  /* unify (single theme accent) */
  accent: string
  accentDeep: string
  /* glass */
  glass: string
  glassHi: string
  glassEdge: string
  glassEdgeHi: string
  edgeTop: string
  /* status hues from theme */
  red: string
  amber: string
  green: string
  tertiary: string
  /* six-system fragmentation spectrum (fixed, deliberately multi-vendor) */
  spectrum: string[]
  /* shadows */
  shadowLg: string
}

const FRAGMENT_SPECTRUM = [
  "#FFB23D", // News — solar amber
  "#39E0FF", // Analysis — holographic cyan
  "#8C7BFF", // Communication — electric indigo
  "#FF5C7A", // Execution — vivid rose
  "#FF74D4", // Account — magenta
  "#3DE08A", // Journaling — signal green
]

export function useHoloPalette(theme: VantaryTheme, accent: string): HoloPalette {
  return useMemo(() => {
    const isLight = theme.id === "light"
    /* Some themes (e.g. obsidian) ship extra elevation tokens that are not on
       the VantaryTheme interface. Access them through a loose view and fall
       back to the declared tokens so every theme renders correctly. */
    const t = theme as unknown as Record<string, string>
    const ink4 = t.ink4 ?? theme.ink3
    const ink5 = t.ink5 ?? ink4
    const inkDeep = t.inkDeep ?? theme.ink
    return {
      isLight,
      bg: theme.ink2,
      bg2: theme.ink3,
      bg3: ink4,
      bgDeep: inkDeep,
      text: theme.paper,
      textDim: theme.paperDim,
      textSoft: theme.ash,
      textGhost: theme.ashSoft,
      accent,
      accentDeep: theme.primaryDeep ?? accent,
      glass: isLight ? "rgba(255,255,255,0.66)" : withAlpha(ink4, 0.55),
      glassHi: isLight ? "rgba(255,255,255,0.82)" : withAlpha(ink5, 0.72),
      glassEdge: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)",
      glassEdgeHi: isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.18)",
      edgeTop: isLight
        ? "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, transparent 55%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 55%)",
      red: t.accentRed ?? theme.badgeRed ?? theme.chartDown ?? "#FF4D5E",
      amber: t.accentAmber ?? "#F2A24A",
      green: t.accentGreen ?? theme.chartUp ?? "#3DDC84",
      tertiary: theme.tertiary ?? accent,
      spectrum: FRAGMENT_SPECTRUM,
      shadowLg: isLight
        ? "0 20px 60px rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.08)"
        : "0 24px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
    }
  }, [theme, accent])
}

/* ═══════════════════════════════════════════════════════════════════════
   AURORA FIELD — animated holographic backdrop
   ═══════════════════════════════════════════════════════════════════════ */

export function AuroraField({
  pal,
  hues,
  density = 1,
}: {
  pal: HoloPalette
  hues?: string[]
  density?: number
}) {
  const reduce = useReducedMotion()
  const colors = hues ?? [pal.accent, pal.spectrum[1], pal.spectrum[2], pal.amber]
  const blobs = [
    { x: "8%", y: "12%", s: 460, c: colors[0 % colors.length], d: 0 },
    { x: "78%", y: "8%", s: 380, c: colors[1 % colors.length], d: 1.5 },
    { x: "62%", y: "70%", s: 520, c: colors[2 % colors.length], d: 3 },
    { x: "16%", y: "76%", s: 360, c: colors[3 % colors.length], d: 4.5 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* fine holographic grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${pal.glassEdge} 1px, transparent 1px), linear-gradient(90deg, ${pal.glassEdge} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)",
          opacity: pal.isLight ? 0.5 : 0.35,
        }}
      />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s * density,
            height: b.s * density,
            background: `radial-gradient(circle, ${withAlpha(b.c, pal.isLight ? 0.22 : 0.28)} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={
            reduce
              ? undefined
              : { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7], x: [0, 18, 0], y: [0, -14, 0] }
          }
          transition={{ duration: 9 + i * 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: b.d }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION EYEBROW — dot + uppercase label + rule
   ═══════════════════════════════════════════════════════════════════════ */

export function SectionEyebrow({
  pal,
  label,
  color,
  icon: Icon,
}: {
  pal: HoloPalette
  label: string
  color?: string
  icon?: React.ElementType
}) {
  const c = color ?? pal.accent
  return (
    <div className="flex items-center gap-2.5">
      {Icon ? (
        <Icon className="w-3.5 h-3.5" style={{ color: c }} />
      ) : (
        <motion.span
          className="block w-2 h-2 rounded-full"
          style={{ background: c, boxShadow: glow(c, 0.7) }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      )}
      <span
        className="text-[10px] font-bold uppercase"
        style={{ color: c, letterSpacing: "0.28em" }}
      >
        {label}
      </span>
      <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${withAlpha(c, 0.4)}, transparent)` }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HOLO CARD — luminous glass surface with gradient stroke + top edge light
   ═══════════════════════════════════════════════════════════════════════ */

export function HoloCard({
  pal,
  children,
  className = "",
  style,
  glowColor,
  active = false,
  onClick,
  as = "div",
}: {
  pal: HoloPalette
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
  active?: boolean
  onClick?: () => void
  as?: "div" | "button"
}) {
  const ringColor = glowColor ?? pal.accent
  const Comp: any = onClick ? motion.button : motion.div
  return (
    <Comp
      onClick={onClick}
      className={`relative overflow-hidden text-left ${className}`}
      style={{
        borderRadius: 18,
        background: active ? pal.glassHi : pal.glass,
        border: `1px solid ${active ? withAlpha(ringColor, 0.5) : pal.glassEdge}`,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        boxShadow: active
          ? `${pal.shadowLg}, 0 0 30px ${withAlpha(ringColor, 0.28)}, inset 0 1px 0 ${pal.glassEdgeHi}`
          : `${pal.shadowLg}, inset 0 1px 0 ${pal.glassEdgeHi}`,
        ...style,
      }}
    >
      {/* top edge light source */}
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: pal.edgeTop }} aria-hidden />
      {/* corner accent bloom when active */}
      {active && (
        <span
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${withAlpha(ringColor, 0.35)}, transparent 70%)`, filter: "blur(10px)" }}
          aria-hidden
        />
      )}
      {children}
    </Comp>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HOLO STAT — glowing metric tile
   ═══════════════════════════════════════════════════════════════════════ */

export function HoloStat({
  pal,
  value,
  label,
  color,
  icon: Icon,
  delay = 0,
}: {
  pal: HoloPalette
  value: string
  label: string
  color?: string
  icon?: React.ElementType
  delay?: number
}) {
  const c = color ?? pal.accent
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden p-4"
      style={{
        borderRadius: 16,
        background: pal.glass,
        border: `1px solid ${pal.glassEdge}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: `inset 0 1px 0 ${pal.glassEdgeHi}`,
      }}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: c, boxShadow: glow(c, 0.5) }}
        aria-hidden
      />
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: c }} />}
        <span
          className="text-2xl font-black tabular-nums"
          style={{ color: pal.text, fontFamily: "var(--font-mono)", textShadow: `0 0 24px ${withAlpha(c, 0.4)}` }}
        >
          {value}
        </span>
      </div>
      <div className="text-[9px] font-bold uppercase" style={{ color: pal.textSoft, letterSpacing: "0.16em" }}>
        {label}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HOLO CHIP — small pill
   ═══════════════════════════════════════════════════════════════════════ */

export function HoloChip({
  pal,
  children,
  color,
}: {
  pal: HoloPalette
  children: React.ReactNode
  color?: string
}) {
  const c = color ?? pal.accent
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold"
      style={{
        background: withAlpha(c, 0.12),
        color: c,
        border: `1px solid ${withAlpha(c, 0.3)}`,
      }}
    >
      {children}
    </span>
  )
}
