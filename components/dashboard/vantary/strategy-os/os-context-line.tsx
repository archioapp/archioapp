"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · CONTEXT LINE  ·  RIGHT CARD SYNTHESIS  (EPIC H · H2)
 *  ─────────────────────────────────────────────────────────────────────────
 *  A single editorial sentence the trader reads on the RIGHT card right
 *  before the TraderStateFooter verdict (HUNT / WAIT / REST). It distils
 *  the entire OS state — discipline score · breached rules · capital
 *  posture · execution archetype — into one prose line so the OS speaks
 *  to the day's decision without forcing the user to scan the full bay.
 *
 *  Composition
 *  ───────────
 *    [ posture chip ]  · [ discipline pulse ]  · [ derived sentence ]
 *
 *      OPTIMAL      ·  82 / 100 DISCIPLINE  ·  6 commitments held, 1 below
 *                                              threshold; capital concentrated
 *                                              in USD with no correlation breach.
 *
 *  The chip's tone follows the OS posture (`OPTIMAL` / `ACTIVE` / `ALERT`)
 *  and the sentence is read directly from `state.derived.contextLine`,
 *  which is already produced by `deriveContextLine()` in derive.ts. The
 *  whole line is ALWAYS one row tall on desktop, wrapping cleanly on
 *  narrow viewports.
 *
 *  Visual rules
 *  ────────────
 *    · No background fill — the line is pure type on the RIGHT card's
 *      paper, separated by a single hairline above so it reads as a
 *      bridge between the ACTIVE WINDOW dossier and the verdict.
 *    · Chip is the only coloured element; the rest stays in `paper` and
 *      `ashSoft`.
 *    · Tabular-nums on the discipline figure for crisp glyph alignment.
 *    · A "JUMP TO OS" affordance on the right edge scrolls the page to
 *      the OS bay anchor, so the trader can drill into the source of
 *      the synthesis without losing place.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useStrategyOs } from "./provider"

type OsPosture = "OPTIMAL" | "ACTIVE" | "ALERT"

export const OsContextLine = memo(function OsContextLine() {
  const { state, palette } = useStrategyOs()
  const reduce = useReducedMotion()
  const { contextLine, posture, disciplineScore } = state.derived

  /* — chip tone resolution — */
  const chip = useCallback((p: OsPosture) => {
    switch (p) {
      case "OPTIMAL": return { fg: palette.amber,    bg: palette.amberWash, bd: palette.amberHalo }
      case "ACTIVE":  return { fg: palette.paper,    bg: "transparent",     bd: palette.rule       }
      case "ALERT":   return { fg: palette.paperDim, bg: "transparent",     bd: palette.paperDim   }
    }
  }, [palette])

  const ch = chip(posture)

  /* — JUMP TO OS — scrolls to the OS bay anchor in the LEFT card. */
  const onJump = useCallback(() => {
    const el = typeof document !== "undefined"
      ? document.querySelector("[data-vantary-anchor=\"strategy-os-bay\"]") as HTMLElement | null
      : null
    if (!el) return
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }, [reduce])

  return (
    <motion.section
      role="status"
      aria-live="polite"
      aria-label={`Strategy OS context: ${posture}, discipline ${disciplineScore} of 100. ${contextLine}`}
      initial={false}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      style={{
        // Single hairline above so the line reads as a bridge between
        // the dossier above and the verdict below — not a chrome block.
        borderTop: `1px solid ${palette.rule}`,
        marginTop: 16,
        paddingTop: 14,
        paddingBottom: 4,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {/* — posture chip — */}
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      9,
          letterSpacing: "0.26em",
          color:         ch.fg,
          background:    ch.bg,
          padding:       "3px 8px",
          border:        `1px solid ${ch.bd}`,
          borderRadius:  99,
          fontWeight:    600,
          flex:          "0 0 auto",
        }}
      >
        {posture}
      </span>

      {/* — discipline pulse — */}
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize:      9.5,
          letterSpacing: "0.22em",
          color:         palette.ashSoft,
          fontWeight:    500,
          flex:          "0 0 auto",
        }}
      >
        <span style={{ color: palette.paper, fontWeight: 600 }}>{disciplineScore}</span>
        <span style={{ opacity: 0.55 }}>/100</span> DISCIPLINE
      </span>

      {/* — derived sentence — */}
      <p
        className="font-sans"
        style={{
          flex:           "1 1 240px",
          margin:         0,
          fontSize:       12,
          lineHeight:     1.5,
          color:          palette.paper,
          letterSpacing:  "-0.005em",
          fontStyle:      "italic",
        }}
      >
        {contextLine}
      </p>

      {/* — JUMP TO OS — */}
      <button
        type="button"
        onClick={onJump}
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.26em",
          color:         palette.amber,
          background:    "transparent",
          border:        `1px solid ${palette.amberHalo}`,
          padding:       "4px 10px",
          borderRadius:  99,
          fontWeight:    500,
          cursor:        "pointer",
          flex:          "0 0 auto",
        }}
        aria-label="Jump to Strategy OS bay"
      >
        JUMP TO OS  ↗
      </button>
    </motion.section>
  )
})
