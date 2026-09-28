/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · SURFACE · EQUITY PORTFOLIO COMPOSITION
 *  ─────────────────────────────────────────────────────────────────────
 *  When a trader hovers (or focuses) the Live Equity Volume protagonist
 *  headline, this surface reveals the COMPOSITION of that headline
 *  number — answering, in one editorial breath:
 *
 *    · HOW MANY accounts are being managed
 *    · WHICH brokers / prop firms hold them
 *    · WHAT TYPE each one is (LIVE / PROP / DEMO)
 *    · HOW MUCH equity each contributes
 *    · WHAT SHARE of the total each represents
 *
 *  The doctrine: this is NOT a chart. There are no bars, no stacked
 *  meters, no donut slices. A composition is a *reading* — three to six
 *  rows of editorial typography on a hairline rhythm, every row a
 *  miniature account passport: type-glyph + name + venue + magnitude +
 *  share. The aggregate footer carries the total + breakdown phrase
 *  ("MANAGED ACROSS 3 BROKERS · 1 LIVE · 2 PROP").
 *
 *  This component is INTENTIONALLY data-shape-agnostic. It accepts a
 *  flat `rows: AccountCompositionRow[]` plus a precomputed `total` so
 *  the host (EquityVolumeInline) owns the aggregation logic and the
 *  surface owns the editorial expression.
 * ════════════════════════════════════════════════════════════════════════ */

"use client"

import * as React from "react"

import {
  JARVIS_TX,
  JARVIS_WEIGHT,
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
} from "../jarvis-tokens"
import { Tx } from "../jarvis-text"

/* ═════════════════════════════════════════════════════════════════════════
 *  PUBLIC CONTRACTS
 *  ─────────────────────────────────────────────────────────────────────── */

/** Tag bucket used to drive the type chip's tone + glyph. The three
 *  buckets are intentionally exhaustive — every account in the Vantary
 *  data model maps to exactly one of these. New tiers (e.g. "MANAGED")
 *  must extend this union explicitly so the chip mapping stays total. */
export type AccountKind = "live" | "prop" | "demo"

/** One row in the composition panel. Pre-formatted strings so the
 *  surface stays purely presentational and never re-runs i18n / number
 *  formatting at render time.
 *
 *    name      — primary label, e.g. "Apex US Equities"
 *    venue     — secondary label, e.g. "Schwab" (broker) or "FTMO · P1"
 *                (prop firm + phase). Rendered in the quiet eyebrow tone.
 *    kind      — drives the leading chip glyph and tone
 *    equity    — pre-formatted magnitude string, e.g. "$48,200"
 *    sharePct  — share of total as a 0..1 number; the surface
 *                formats it to a clean integer percent. Provided as a
 *                ratio so the host doesn't have to round before passing
 *                it down — keeps the typographic alignment stable.
 *    accent    — optional one-character glyph rendered RIGHT of the
 *                share. Useful for marking the protagonist account
 *                (the one currently driving the headline period). */
export interface AccountCompositionRow {
  id:        string
  name:      string
  venue:     string
  kind:      AccountKind
  equity:    string
  sharePct:  number
  accent?:   "lead" | "watch" | undefined
}

export interface EquityPortfolioCompositionProps {
  /** Rows in the order they should appear. Host pre-sorts. */
  rows:           AccountCompositionRow[]
  /** Pre-formatted total (must match the headline protagonist). */
  total:          string
  /** Trailing summary phrase, e.g. "ACROSS 3 BROKERS · 1 LIVE · 2 PROP". */
  footerSummary?: string
  /** Optional render override — when the surface lives inside an
   *  AnimatePresence parent the parent already drives entrance/exit. */
  className?:     string
}

/* ─────────────────────────────────────────────────────────────────────────
 *  KIND CHIP — the leading three-letter editorial glyph
 *  ─────────────────────────────────────────────────────────────────────────
 *  We do NOT use icons here. The kind is communicated entirely by the
 *  chip's typography + tone:
 *
 *    LIVE → amber tone, full-saturation       (real capital, real risk)
 *    PROP → support tone, mono-caps           (firm capital, contracts)
 *    DEMO → quietest tone, low-contrast       (paper, no consequence)
 *
 *  The chip is 28px wide, fixed, so all rows align on a perfect grid
 *  regardless of label length. */
function KindChip({ kind }: { kind: AccountKind }) {
  const map: Record<AccountKind, { label: string; tone: keyof typeof JARVIS_TONE }> = {
    live: { label: "LIVE", tone: "amber"    },
    prop: { label: "PROP", tone: "support"  },
    demo: { label: "DEMO", tone: "quietest" },
  }
  const cell = map[kind]
  return (
    <span
      aria-hidden
      className="font-mono uppercase select-none"
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          34,
        flex:           "0 0 34px",
        fontSize:       JARVIS_TX.eyebrow.fontSize,
        lineHeight:     1,
        letterSpacing:  JARVIS_TX.eyebrow.letterSpacing,
        fontWeight:     JARVIS_WEIGHT.medium,
        color:          JARVIS_TONE[cell.tone],
        opacity:        kind === "demo" ? 0.55 : 1,
      }}
    >
      {cell.label}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  COMPOSITION ROW — one account
 *  ─────────────────────────────────────────────────────────────────────── */

function CompositionRow({ row, isLast }: { row: AccountCompositionRow; isLast: boolean }) {
  const sharePct = Math.max(0, Math.min(100, Math.round(row.sharePct * 100)))

  return (
    <>
      <div
        role="listitem"
        style={{
          display:        "flex",
          alignItems:     "baseline",
          gap:            JARVIS_RHYTHM.bay,
          padding:        "6px 0",
          minWidth:       0,
        }}
      >
        {/* Kind chip — fixed-width 34px so rows align on a grid. */}
        <KindChip kind={row.kind} />

        {/* Name + venue stack — protagonist line + quiet eyebrow.
            Truncates at narrow widths via min-w-0 + overflow-hidden so
            the magnitude on the right always stays readable. */}
        <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", minWidth: 0 }}>
          <span
            className="font-sans select-none"
            style={{
              fontSize:      JARVIS_TX.body.fontSize,
              lineHeight:    1.25,
              letterSpacing: JARVIS_TX.body.letterSpacing,
              fontWeight:    JARVIS_WEIGHT.medium,
              color:         JARVIS_TONE.protag,
              overflow:      "hidden",
              textOverflow:  "ellipsis",
              whiteSpace:    "nowrap",
            }}
            title={row.name}
          >
            {row.name}
          </span>
          <Tx size="eyebrow" tone="quiet">
            {row.venue}
          </Tx>
        </div>

        {/* Equity magnitude — tabular-nums, semibold, right-aligned. */}
        <span
          className="font-mono tabular-nums select-none"
          style={{
            fontSize:      JARVIS_TX.body.fontSize,
            lineHeight:    JARVIS_TX.body.lineHeight,
            letterSpacing: JARVIS_TX.body.letterSpacing,
            fontWeight:    JARVIS_WEIGHT.medium,
            color:         JARVIS_TONE.protag,
            flex:          "0 0 auto",
            textAlign:     "right",
          }}
        >
          {row.equity}
        </span>

        {/* Share percentage — quiet caption, fixed 36px box so the
            decimal column always lines up across rows. */}
        <span
          className="font-mono tabular-nums select-none"
          style={{
            fontSize:      JARVIS_TX.caption.fontSize,
            lineHeight:    JARVIS_TX.caption.lineHeight,
            letterSpacing: JARVIS_TX.caption.letterSpacing,
            fontWeight:    JARVIS_WEIGHT.regular,
            color:         JARVIS_TONE.support,
            width:         36,
            flex:          "0 0 36px",
            textAlign:     "right",
          }}
        >
          {sharePct}%
        </span>

        {/* Accent glyph — tiny, 8px, only present for "lead" / "watch"
            anchors. lead=amber, watch=warnEdge. Replaces a per-row
            indicator chip (which would have been chrome). */}
        <span
          aria-hidden
          className="font-mono select-none"
          style={{
            width:    8,
            flex:     "0 0 8px",
            textAlign:"center",
            fontSize: 9,
            color:    row.accent === "lead"  ? JARVIS_TONE.amber
                    : row.accent === "watch" ? JARVIS_TONE.warnEdge
                    :                          "transparent",
            lineHeight: 1,
          }}
        >
          {row.accent === "lead" ? "★" : row.accent === "watch" ? "!" : "·"}
        </span>
      </div>

      {/* Hairline between rows. No rule under the last row — the parent
          renders its own footer rule below. */}
      {!isLast && (
        <span
          aria-hidden
          style={{
            display:    "block",
            height:     1,
            background: JARVIS_RULE.idle.color,
            opacity:    JARVIS_RULE.idle.opacity * 0.7,
          }}
        />
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  THE PANEL
 *  ─────────────────────────────────────────────────────────────────────── */

export function EquityPortfolioComposition({
  rows,
  total,
  footerSummary,
  className,
}: EquityPortfolioCompositionProps) {
  if (!rows || rows.length === 0) return null

  return (
    <section
      role="list"
      aria-label="Portfolio composition by account"
      className={className}
      style={{
        display:        "flex",
        flexDirection:  "column",
        minWidth:       0,
        paddingTop:     JARVIS_RHYTHM.bay,
        animationDuration: `${JARVIS_MOTION.awaken.duration}ms`,
      }}
    >
      {/* ── Header — eyebrow on the left, summary chip on the right ── */}
      <header
        style={{
          display:        "flex",
          alignItems:     "baseline",
          justifyContent: "space-between",
          gap:            JARVIS_RHYTHM.bay,
          paddingBottom:  6,
          borderBottom:   `1px solid ${JARVIS_RULE.idle.color}`,
          marginBottom:   2,
        }}
      >
        <Tx size="eyebrow" tone="amber">
          PORTFOLIO COMPOSITION
        </Tx>
        <Tx size="eyebrow" tone="quiet">
          {`${rows.length} ACCOUNT${rows.length === 1 ? "" : "S"} MANAGED`}
        </Tx>
      </header>

      {/* ── Rows ──────────────────────────────────────────────────── */}
      {rows.map((row, i) => (
        <CompositionRow
          key={row.id}
          row={row}
          isLast={i === rows.length - 1}
        />
      ))}

      {/* ── Footer — total + summary phrase ─────────────────────────
       *  The footer rule is darker (idle * 1.0) so the trader's eye
       *  bookends on it — the total + summary phrase reads as the
       *  closing statement of the panel, not a fourth row. */}
      <span
        aria-hidden
        style={{
          display:    "block",
          height:     1,
          background: JARVIS_RULE.awakened.color,
          opacity:    JARVIS_RULE.awakened.opacity * 0.85,
          marginTop:  4,
        }}
      />
      <div
        style={{
          display:        "flex",
          alignItems:     "baseline",
          justifyContent: "space-between",
          gap:            JARVIS_RHYTHM.bay,
          paddingTop:     6,
          minWidth:       0,
        }}
      >
        <Tx size="eyebrow" tone="support">
          TOTAL MANAGED
        </Tx>
        <span style={{ display: "flex", alignItems: "baseline", gap: JARVIS_RHYTHM.bay }}>
          {footerSummary && (
            <Tx size="eyebrow" tone="quiet">
              {footerSummary}
            </Tx>
          )}
          <span
            className="font-mono tabular-nums select-none"
            style={{
              fontSize:      JARVIS_TX.body.fontSize,
              lineHeight:    JARVIS_TX.body.lineHeight,
              letterSpacing: JARVIS_TX.body.letterSpacing,
              fontWeight:    JARVIS_WEIGHT.semibold,
              color:         JARVIS_TONE.amber,
            }}
          >
            {total}
          </span>
        </span>
      </div>
    </section>
  )
}
