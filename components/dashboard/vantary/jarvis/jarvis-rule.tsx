"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · <Rule/> — the canonical hairline primitive
 *  ─────────────────────────────────────────────────────────────────────
 *  Law #6: hairlines, not boxes.
 *
 *  This is the ONLY sanctioned way to draw a 1px separator inside a
 *  JARVIS surface. It enforces:
 *
 *    - exactly 1 logical pixel thickness (we explicitly ask for 1px,
 *      not "thin" or "default border" — the Vantary aesthetic dies
 *      the moment a rule rounds up to 2px on a hi-DPI screen)
 *    - the three named states (idle / awakened / engaged) — there
 *      are no other rule colors anywhere
 *    - solid only — dashed rules are reserved for chart target lines
 *      and are produced via a chart-specific helper, never via <Rule/>
 *    - margin-collapsing-safe defaults — a rule never introduces
 *      vertical space unless asked for explicitly via the
 *      `padding`/`margin` Tailwind classes on the wrapper
 *
 *  Two orientations: horizontal (default) and vertical. Vertical
 *  rules accept an optional `inset` prop that crops 8px from each
 *  end so the rule "floats" inside its band rather than touching the
 *  band's top/bottom edges. This mimics the editorial typography
 *  trick where vertical separators in a stat-strip never touch the
 *  rule above and below them — they recede.
 *
 *  Usage:
 *
 *    <Rule />                              // horizontal idle
 *    <Rule state="awakened" />             // horizontal hover state
 *    <Rule orientation="vertical" inset /> // vertical between cells
 *    <Rule orientation="vertical" state="engaged" /> // active divider
 *
 *  ANTI-USAGE:
 *    - Don't apply `borderColor` or `backgroundColor` overrides — the
 *      state prop is the only correct way.
 *    - Don't use <Rule/> inside an SVG. Use SVG <line/> with the
 *      `jarvisRuleStyle()` helper from jarvis-tokens.ts instead.
 * ═══════════════════════════════════════════════════════════════════════ */

import type { CSSProperties } from "react"
import { JARVIS_RULE, type JarvisRuleName } from "./jarvis-tokens"

export interface RuleProps {
  /** Visual state. Defaults to `idle`. Set to `awakened` when the
   *  parent surface is hovered; set to `engaged` when the parent
   *  surface is clicked / pinned. */
  state?: JarvisRuleName

  /** `horizontal` produces a 1px-tall full-width line. `vertical`
   *  produces a 1px-wide full-height line. Defaults to `horizontal`. */
  orientation?: "horizontal" | "vertical"

  /** When true, crops 8px from each end of the rule. Used for
   *  vertical separators inside a strip so they don't visually
   *  touch the band's edges. Has no visual effect on horizontal
   *  rules (their "ends" are the parent's edges by definition). */
  inset?: boolean

  /** Layout-only Tailwind classes. Use to control margin / position. */
  className?: string

  /** Inline style — for layout overrides only. The `background` and
   *  `opacity` properties from the consumer's style object are
   *  IGNORED since those are state-managed. */
  style?: CSSProperties

  /** ARIA — most rules are decorative and should be hidden from
   *  screen readers. The default is `aria-hidden="true"`; pass
   *  `aria-hidden={false}` and provide `aria-orientation`/`role` only
   *  when the rule is genuinely interactive (e.g. a draggable
   *  splitter, which has its own primitive). */
  "aria-hidden"?: boolean
}

/* ─────────────────────────────────────────────────────────────────────
 *  Component
 * ─────────────────────────────────────────────────────────────────── */

export function Rule({
  state         = "idle",
  orientation   = "horizontal",
  inset         = false,
  className,
  style,
  "aria-hidden": ariaHidden = true,
}: RuleProps) {
  const r = JARVIS_RULE[state]

  /* The base style depends on orientation:
   *   - horizontal: full width, 1px tall
   *   - vertical:   1px wide, full height (with optional inset)
   *
   * We use `background` rather than `border` for the line color
   * because background colors render at sub-pixel precision on
   * hi-DPI displays whereas borders sometimes round up. The visible
   * difference between a 1.0px and a 1.2px line is the difference
   * between editorial and amateur. */
  const baseStyle: CSSProperties = orientation === "horizontal"
    ? {
        width:      "100%",
        height:     1,
        background: r.color,
        opacity:    r.opacity,
        flexShrink: 0,
        /* Without this, in a flex parent the rule can collapse to
         * 0px tall when content above/below it wants room. */
        minHeight:  1,
      }
    : {
        width:      1,
        minWidth:   1,
        height:     inset ? "calc(100% - 16px)" : "100%",
        marginTop:  inset ? 8 : 0,
        background: r.color,
        opacity:    r.opacity,
        flexShrink: 0,
        alignSelf:  inset ? "stretch" : "auto",
      }

  /* Strip any consumer-provided background/opacity — those are state-
   * managed and overrides break the doctrine. Layout properties
   * (margin, position, etc.) pass through. */
  const consumerStyle: CSSProperties = { ...style }
  delete (consumerStyle as Record<string, unknown>).background
  delete (consumerStyle as Record<string, unknown>).backgroundColor
  delete (consumerStyle as Record<string, unknown>).opacity
  delete (consumerStyle as Record<string, unknown>).color
  delete (consumerStyle as Record<string, unknown>).border
  delete (consumerStyle as Record<string, unknown>).borderColor

  return (
    <div
      role="presentation"
      aria-hidden={ariaHidden ? "true" : undefined}
      className={className}
      style={{
        ...baseStyle,
        ...consumerStyle,
        /* Smooth state transitions — when the parent surface awakens,
         * the rule colors cross-fade rather than snap. We use the
         * `awaken` motion preset's CSS form to keep the curve
         * consistent with the rest of the system. */
        transition:
          "background 220ms cubic-bezier(0.32, 0, 0.32, 1), opacity 220ms cubic-bezier(0.32, 0, 0.32, 1)",
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  PRESET COMPONENTS — common rule patterns
 * ─────────────────────────────────────────────────────────────────── */

/** A horizontal hairline that separates two bands within a card. The
 *  most-used rule in the system — sits between the Protagonist Band
 *  and the Pulse Strip, between the Spine and the Story Panel, etc. */
export function BandRule(props: Omit<RuleProps, "orientation">) {
  return <Rule orientation="horizontal" {...props} />
}

/** A vertical hairline between two cells of a strip. Auto-applies
 *  the inset crop so the line floats inside the band. */
export function CellRule(props: Omit<RuleProps, "orientation" | "inset">) {
  return <Rule orientation="vertical" inset {...props} />
}
