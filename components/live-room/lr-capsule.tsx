"use client"

/**
 * LIVE ROOM — capsule
 *
 * The Flight Deck's status-strip grammar, verbatim:
 *   ● 4px glowing dot · 9px/0.20em mono eyebrow · 11px/500 sans value · optional signal
 * Transparent at rest; a whisper of accent fill + hairline on hover.
 * Dividers are 1×14px vertical gradient hairlines.
 */

import * as React from "react"
import { motion } from "framer-motion"
import { LR, lrMix, toneColor, type LrTone } from "./live-room-tokens"
import { useReducedMotion } from "./live-room-primitives"

export function LrCapsule({
  eyebrow, value, tone = "primary", signal, onClick, title, delay = 0, active = false, className = "",
}: {
  eyebrow: string
  value: React.ReactNode
  tone?: LrTone | "ash"
  signal?: React.ReactNode
  onClick?: () => void
  title?: string
  delay?: number
  active?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const accent = tone === "ash" ? LR.ashSoft : toneColor(tone)
  const [hover, setHover] = React.useState(false)
  const Tag: "button" | "span" = onClick ? "button" : "span"
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + delay, duration: 0.35, ease: LR.ease }}
      className={`shrink-0 inline-flex ${className}`}
    >
      <Tag
        type={onClick ? "button" : undefined}
        onClick={onClick}
        title={title}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="inline-flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-1"
        style={{
          padding: "5px 9px",
          borderRadius: 8,
          background: hover || active ? lrMix(accent, 0.05) : "transparent",
          border: `1px solid ${hover || active ? lrMix(accent, 0.16) : "transparent"}`,
          transition: "background 200ms ease, border-color 200ms ease",
          cursor: onClick ? "pointer" : "default",
          color: "inherit",
          font: "inherit",
          textAlign: "left",
        }}
      >
        <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: lrMix(accent, 0.7), boxShadow: `0 0 6px ${lrMix(accent, 0.5)}` }} />
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: LR.ashSoft }}>{eyebrow}</span>
        <span className="font-sans whitespace-nowrap tabular-nums" style={{ fontSize: 11, color: active ? LR.paper : LR.paperDim, fontWeight: 500 }}>{value}</span>
        {signal}
      </Tag>
    </motion.span>
  )
}

export function LrCapsuleDivider() {
  return (
    <span aria-hidden className="shrink-0" style={{ width: 1, height: 14, margin: "0 4px", background: `linear-gradient(180deg, transparent 0%, ${LR.rule} 50%, transparent 100%)` }} />
  )
}

/**
 * A row of capsules with dividers between them. Wraps onto a second row when
 * the column is narrow — a readout that is cut off is a readout that lies.
 * The divider belongs to the item AFTER it, so a wrapped row never starts
 * with a stray hairline.
 */
export function LrCapsuleStrip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const items = React.Children.toArray(children).filter(Boolean)
  return (
    <div className={`flex items-center flex-wrap gap-y-0.5 min-w-0 ${className}`} role="list">
      {items.map((child, i) => (
        <span key={i} role="listitem" className="inline-flex items-center shrink-0">
          {i > 0 && <LrCapsuleDivider />}
          {child}
        </span>
      ))}
    </div>
  )
}
