"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · STATION PRIMITIVES  (Phase 2)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The reusable shells + atoms every live station is composed from. Building
 *  these once means Phase 3+ stations (Direction, SL/TP/RR, Preview) inherit
 *  the exact same glass surface, hairlines, metric typography, and guardrail
 *  rhythm — so the cockpit reads as one instrument, not a pile of cards.
 *
 *  Atoms:
 *    · ExecutionStationFrame — the layered glass station shell (index, icon,
 *      title, status edge-light, optional lock overlay).
 *    · ExecutionModeBadge — the small "SIM / LIVE · LOCKED / BLOCKED" pill.
 *    · AccountVaultMetric — a labelled vault numeral with optional sub + trend.
 *    · GuardrailItem — one readiness row that illuminates in sequence.
 *    · StationEyebrow — a hairline section divider with mono caption.
 * ══════════════════════════════════════════════════════════════════════ */

import { memo, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Check, AlertTriangle, X, Circle, Lock, Minus,
  type LucideIcon,
} from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS, type ConsoleMode } from "./console-theme"
import type { GuardrailStatus } from "./account-data"

/* ─────────────────────────────────────────────────────────────────────────
 *  StationEyebrow — a labelled terminal hairline used between sub-sections.
 * ──────────────────────────────────────────────────────────────────────── */
export const StationEyebrow = memo(function StationEyebrow({
  label,
  right,
  color = VANTARY.ashSoft,
}: {
  label: string
  right?: ReactNode
  color?: string
}) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 9 }}>
      <span
        className="font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.22em", color }}
      >
        {label}
      </span>
      <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule, opacity: 0.6 }} />
      {right != null && (
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashGhost }}>
          {right}
        </span>
      )}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  ExecutionStationFrame — the live station glass shell. Unlike the locked
 *  FutureStations plate, this is full-opacity, accent-lit, with a top
 *  edge-light and an optional dimmed lock overlay.
 * ──────────────────────────────────────────────────────────────────────── */
export const ExecutionStationFrame = memo(function ExecutionStationFrame({
  index,
  title,
  icon: Icon,
  accent,
  glow,
  badge,
  children,
  locked = false,
  lockedNote,
  live = true,
}: {
  index: string
  title: string
  icon: LucideIcon
  accent: string
  /** the mode's signature top-edge glow string. */
  glow?: string
  badge?: ReactNode
  children: ReactNode
  /** when true, dims the body and lays a premium lock veil over it. */
  locked?: boolean
  lockedNote?: string
  /** live stations get the accent rail at full strength; false dims it. */
  live?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <section
      aria-label={title}
      style={{
        position: "relative",
        borderRadius: 14,
        border: `1px solid ${VANTARY.ruleStrong}`,
        background: VANTARY.glassStrong,
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        boxShadow: glow ?? "0 6px 22px -10px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      {/* top inner highlight — the 1px lit edge that sells the glass depth */}
      <span
        aria-hidden
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
        }}
      />
      {/* left accent rail */}
      <span
        aria-hidden
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
          background: accent, opacity: live ? 0.5 : 0.2,
        }}
      />
      {/* ambient corner wash */}
      <span
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(120% 70% at 100% 0%, ${accent}14 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", padding: "13px 14px 14px" }}>
        {/* header */}
        <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 9.5, color: VANTARY.ashGhost, letterSpacing: "0.1em" }}
          >
            {index}
          </span>
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 24, height: 24, borderRadius: 7,
              border: `1px solid ${accent}3A`,
              background: `${accent}12`,
              flexShrink: 0,
            }}
          >
            <Icon size={13} strokeWidth={1.7} color={accent} />
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 11, letterSpacing: "0.18em", color: VANTARY.paper, fontWeight: 500 }}
          >
            {title}
          </span>
          <span aria-hidden style={{ flex: 1 }} />
          {badge}
        </div>

        {/* body — dimmed when locked */}
        <div style={{ opacity: locked ? 0.5 : 1, transition: "opacity 0.3s" }}>
          {children}
        </div>
      </div>

      {/* premium lock veil */}
      {locked && (
        <motion.div
          aria-hidden
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            background: `linear-gradient(180deg, transparent 30%, ${VANTARY.glassDeep} 100%)`,
            pointerEvents: "none",
            paddingBottom: 14,
          }}
        >
          {lockedNote && (
            <span
              className="font-mono uppercase inline-flex items-center gap-1.5"
              style={{
                fontSize: 8.5, letterSpacing: "0.18em", color: accent,
                padding: "4px 9px",
                background: VANTARY.glassDeep,
                border: `1px solid ${accent}3A`,
                borderRadius: 999,
              }}
            >
              <Lock size={9} strokeWidth={1.8} />
              {lockedNote}
            </span>
          )}
        </motion.div>
      )}
    </section>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  ExecutionModeBadge — the compact mode pill (mirror of the crown pill but
 *  sized for station headers).
 * ──────────────────────────────────────────────────────────────────────── */
export const ExecutionModeBadge = memo(function ExecutionModeBadge({
  mode,
  label,
}: {
  mode: ConsoleMode
  label?: string
}) {
  const accent = CONSOLE_ACCENTS[mode]
  return (
    <span
      className="font-mono uppercase inline-flex items-center gap-1.5"
      style={{
        padding: "3px 8px",
        fontSize: 8.5,
        letterSpacing: "0.16em",
        fontWeight: 500,
        color: accent.base,
        background: accent.wash,
        border: `1px solid ${accent.halo}`,
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{ width: 5, height: 5, borderRadius: "50%", background: accent.base, boxShadow: `0 0 6px ${accent.halo}` }}
      />
      {label ?? accent.token}
    </span>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  AccountVaultMetric — a labelled vault figure with optional sub + tone.
 *  Used for the equity / margin "vault numbers".
 * ──────────────────────────────────────────────────────────────────────── */
export const AccountVaultMetric = memo(function AccountVaultMetric({
  label,
  children,
  sub,
  align = "left",
  emphasize = false,
}: {
  label: string
  children: ReactNode
  sub?: ReactNode
  align?: "left" | "right"
  emphasize?: boolean
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        alignItems: align === "right" ? "flex-end" : "flex-start",
        gap: 4,
        padding: emphasize ? "10px 11px" : 0,
        borderRadius: emphasize ? 10 : 0,
        background: emphasize ? VANTARY.glass : "transparent",
        border: emphasize ? `1px solid ${VANTARY.rule}` : "none",
        minWidth: 0,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft, whiteSpace: "nowrap" }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>{children}</div>
      {sub != null && (
        <span
          className="font-mono"
          style={{ fontSize: 9, color: VANTARY.ashSoft, letterSpacing: "0.04em" }}
        >
          {sub}
        </span>
      )}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  GuardrailItem — one readiness/guardrail row. Illuminates in sequence via
 *  the `order` prop (parent staggers). Status drives icon + colour.
 * ──────────────────────────────────────────────────────────────────────── */
const STATUS_META: Record<GuardrailStatus, { icon: LucideIcon; tone: (a: string) => string }> = {
  pass:    { icon: Check,          tone: () => VANTARY.chartUp },
  warn:    { icon: AlertTriangle,  tone: () => "#E5A93C" },
  fail:    { icon: X,              tone: () => VANTARY.chartDown },
  pending: { icon: Circle,         tone: () => VANTARY.ashSoft },
  locked:  { icon: Lock,           tone: () => VANTARY.ashGhost },
}

export const GuardrailItem = memo(function GuardrailItem({
  label,
  detail,
  status,
  order = 0,
  future = false,
}: {
  label: string
  detail: string
  status: GuardrailStatus
  order?: number
  future?: boolean
}) {
  const reduce = useReducedMotion()
  const meta = STATUS_META[status]
  const Icon = meta.icon
  const tone = meta.tone("")
  const dim = status === "locked" || status === "pending" || future

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -4 }}
      animate={{ opacity: dim ? 0.62 : 1, x: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.32, delay: 0.04 * order, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2.5"
      style={{ padding: "6px 2px" }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
          background: status === "pass" ? `${tone}1A` : status === "fail" ? `${tone}1A` : status === "warn" ? `${tone}1A` : VANTARY.ruleSoft,
          border: `1px solid ${status === "pending" || status === "locked" ? VANTARY.rule : `${tone}44`}`,
          color: tone,
        }}
      >
        <Icon size={10} strokeWidth={2} color={tone} />
      </span>
      <span
        className="font-sans"
        style={{ fontSize: 11.5, color: dim ? VANTARY.ashSoft : VANTARY.paperDim, flex: 1, minWidth: 0 }}
      >
        {label}
      </span>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5, letterSpacing: "0.08em",
          color: status === "fail" ? tone : status === "warn" ? tone : VANTARY.ashSoft,
          whiteSpace: "nowrap",
          maxWidth: 120,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {detail}
      </span>
    </motion.li>
  )
})

/* small inline tone helpers shared across the station */
export function toneForHealth(tier: string): string {
  switch (tier) {
    case "strong":   return VANTARY.chartUp
    case "steady":   return VANTARY.teal
    case "caution":  return "#E5A93C"
    case "critical": return VANTARY.chartDown
    default:         return VANTARY.ash
  }
}

/* a tiny dot+label legend chip */
export const LegendDot = memo(function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
        {label}
      </span>
    </span>
  )
})

/* re-export for convenience */
export { Minus }
