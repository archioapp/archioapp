"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · INLINE CARD CUSTOMIZE PANEL
 *  ─────────────────────────────────────────────────────────────────────
 *  An editorial, dropdown-free card-scoped customize surface. Replaces
 *  the dropdown menu pattern with a single hairline rectangle that
 *  expands BENEATH the card (in-flow, not floating) when the trader
 *  taps the [CUSTOMIZE] eyebrow link in the card's footer corner.
 *
 *  Why no dropdown:
 *    Dropdowns are an OS metaphor — fast for one-pick lists, terrible
 *    for multi-section configuration. They float, they pop, they steal
 *    focus, they fight scroll. For a six-line "configure my card"
 *    interaction, a dropdown reads as a server admin panel, not as a
 *    design tool.
 *
 *  The replacement:
 *    A flat, in-flow editorial panel. Hairline border. Mono-caps
 *    section headers. Pill-checkbox rows. One section per slot the
 *    card exposes (e.g. "PULSE STRIP" + "STORY PANEL" for Live Equity
 *    Volume). Each row is a single tappable rectangle that toggles
 *    inclusion of that pair / story in the rotation. Selected items
 *    show an amber underline. Reorderable later — for now selection
 *    is enough.
 *
 *  THE THREE BUILDING BLOCKS
 *    · CardCustomizePanel    — the chassis (header + sections + footer)
 *    · CustomizeSection      — one labelled section with a slot of pills
 *    · CustomizePill         — one toggleable option (label + selected)
 *
 *  ENGAGEMENT MODEL
 *    The host renders <CardCustomizePanel/> in-flow underneath the
 *    card, gated by an `open` boolean. The host is the source of truth
 *    for which pills are selected; the panel just emits onToggle
 *    callbacks. This keeps the panel completely stateless — every
 *    selection persists through whatever store the host already uses
 *    (provider state, localStorage, server-state, etc.).
 *
 *  WIDTH-AWARENESS
 *    The panel reflows naturally — pills wrap when the row narrows.
 *    No JS-driven tier collapse needed.
 * ════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_TX,
  JARVIS_WEIGHT,
  Tx,
} from "../index"

/* ─────────────────────────────────────────────────────────────────────────
 *  CUSTOMIZE PILL
 *  ───────────────────────────────────────────────────────────────────── */

export interface CustomizePillProps {
  /** Stable id (e.g. "trades-winrate", "dna-exposure"). */
  id:       string
  /** Mono-caps display label. */
  label:    string
  /** Optional secondary line beneath the label (e.g. a short hint). */
  hint?:    string
  /** Whether this pill is currently part of the rotation. */
  selected: boolean
  /** Toggle the pill's selection. */
  onToggle: (id: string) => void
}

export function CustomizePill({
  id, label, hint, selected, onToggle,
}: CustomizePillProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={() => onToggle(id)}
      style={{
        position:       "relative",
        display:        "inline-flex",
        flexDirection:  "column",
        alignItems:     "flex-start",
        gap:            2,
        padding:        `6px 10px 8px 10px`,
        background:     "transparent",
        border:         `1px solid ${selected ? JARVIS_TONE.amberHalo : JARVIS_RULE.idle.color}`,
        borderRadius:   2,
        cursor:         "pointer",
        outline:        "none",
        textAlign:      "left",
        transition:     `border-color ${JARVIS_MOTION.awaken.duration}ms ease`,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      JARVIS_TX.eyebrow.fontSize,
          letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
          fontWeight:    selected ? JARVIS_WEIGHT.medium : JARVIS_WEIGHT.regular,
          color:         selected ? JARVIS_TONE.protag : JARVIS_TONE.support,
        }}
      >
        {label}
      </span>

      {hint && (
        <span
          className="font-sans"
          style={{
            fontSize: JARVIS_TX.caption.fontSize,
            color:    JARVIS_TONE.quiet,
            lineHeight: JARVIS_TX.caption.lineHeight,
          }}
        >
          {hint}
        </span>
      )}

      {/* Amber underline when selected — same vocabulary as the period
       *  spine's active marker so the customize affordance reads as
       *  "this is what the page is showing." */}
      {selected && (
        <span
          aria-hidden
          style={{
            position:   "absolute",
            left:       10,
            right:      10,
            bottom:     2,
            height:     1,
            background: JARVIS_TONE.amber,
            opacity:    0.85,
          }}
        />
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  CUSTOMIZE SECTION
 *  ───────────────────────────────────────────────────────────────────── */

export interface CustomizeSectionProps {
  /** Mono-caps section title (e.g. "PULSE STRIP" / "STORY PANEL"). */
  title:    string
  /** Optional one-line note rendered next to the title in quiet tone. */
  note?:    string
  /** The pill collection that lives inside this section. */
  children: React.ReactNode
}

export function CustomizeSection({ title, note, children }: CustomizeSectionProps) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        gap:            JARVIS_RHYTHM.bay,
        paddingTop:     JARVIS_RHYTHM.band,
        paddingBottom:  JARVIS_RHYTHM.band,
      }}
    >
      <div
        style={{
          display:        "flex",
          alignItems:     "baseline",
          justifyContent: "space-between",
          gap:            JARVIS_RHYTHM.bay,
        }}
      >
        <Tx size="eyebrow" tone="amber">
          {title}
        </Tx>
        {note && (
          <Tx size="eyebrow" tone="quietest">
            {note}
          </Tx>
        )}
      </div>

      <div
        style={{
          display:        "flex",
          flexWrap:       "wrap",
          gap:            8,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  CUSTOMIZE PANEL — the chassis
 *  ───────────────────────────────────────────────────────────────────── */

export interface CardCustomizePanelProps {
  /** Whether the panel is open. The host owns this state. */
  open:     boolean
  /** Mono-caps eyebrow header (e.g. "CUSTOMIZE LIVE EQUITY VOLUME"). */
  title:    string
  /** Optional reset callback — restores defaults across all sections. */
  onReset?: () => void
  /** Optional close callback — collapses the panel without changing
   *  selections. The host typically passes the same toggle the
   *  [CUSTOMIZE] eyebrow uses. */
  onClose?: () => void
  /** The section content (typically <CustomizeSection> children). */
  children: React.ReactNode
  /** Optional className passthrough. */
  className?: string
}

export function CardCustomizePanel({
  open, title, onReset, onClose, children, className,
}: CardCustomizePanelProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.section
          key="card-customize-panel"
          aria-label={title}
          className={className}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{    opacity: 0, height: 0 }}
          transition={{
            duration: JARVIS_MOTION.silk.duration / 1000,
            ease:     JARVIS_MOTION.silk.easeArray,
          }}
          style={{
            overflow: "hidden",
            marginTop: JARVIS_RHYTHM.band,
          }}
        >
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              border:         `1px solid ${JARVIS_RULE.idle.color}`,
              borderRadius:   2,
              padding:        `${JARVIS_RHYTHM.band}px ${JARVIS_RHYTHM.chasm}px`,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display:        "flex",
                alignItems:     "baseline",
                justifyContent: "space-between",
                gap:            JARVIS_RHYTHM.bay,
                paddingBottom:  JARVIS_RHYTHM.bay,
                borderBottom:   `1px solid ${JARVIS_RULE.idle.color}`,
              }}
            >
              <Tx size="eyebrow" tone="protag">
                {title}
              </Tx>
              <div style={{ display: "flex", gap: JARVIS_RHYTHM.band }}>
                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="font-mono uppercase"
                    style={{
                      fontSize:      JARVIS_TX.eyebrow.fontSize,
                      letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
                      color:         JARVIS_TONE.quiet,
                      background:    "transparent",
                      border:        "none",
                      cursor:        "pointer",
                      padding:       0,
                    }}
                  >
                    RESET
                  </button>
                )}
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-mono uppercase"
                    style={{
                      fontSize:      JARVIS_TX.eyebrow.fontSize,
                      letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
                      color:         JARVIS_TONE.support,
                      background:    "transparent",
                      border:        "none",
                      cursor:        "pointer",
                      padding:       0,
                    }}
                  >
                    DONE
                  </button>
                )}
              </div>
            </div>

            {/* Body — sections stack vertically with hairline dividers */}
            {children}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  CUSTOMIZE TOGGLE — the eyebrow link that opens the panel
 *  ─────────────────────────────────────────────────────────────────────
 *  A tiny editorial mono-caps link the host typically renders near the
 *  bottom-right of the card (next to the QuietLayer). Toggling it
 *  flips the panel open/closed.
 *
 *  Visual at rest: "CUSTOMIZE  +"
 *  Visual when open: "CUSTOMIZE  ×"
 *  ───────────────────────────────────────────────────────────────────── */

export interface CustomizeToggleProps {
  open:    boolean
  onClick: () => void
  label?:  string
}

export function CustomizeToggle({
  open, onClick, label = "CUSTOMIZE",
}: CustomizeToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="font-mono uppercase"
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            6,
        background:     "transparent",
        border:         "none",
        cursor:         "pointer",
        padding:        0,
        fontSize:       JARVIS_TX.eyebrow.fontSize,
        letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
        fontWeight:     open ? JARVIS_WEIGHT.medium : JARVIS_WEIGHT.regular,
        color:          open ? JARVIS_TONE.amber : JARVIS_TONE.quiet,
        transition:     `color ${JARVIS_MOTION.awaken.duration}ms ease`,
      }}
    >
      {label}
      <span
        aria-hidden
        style={{
          fontSize:   JARVIS_TX.eyebrow.fontSize,
          color:      "inherit",
          transform:  open ? "rotate(45deg)" : "rotate(0deg)",
          transition: `transform ${JARVIS_MOTION.silk.duration}ms cubic-bezier(${JARVIS_MOTION.silk.easeArray.join(",")})`,
          display:    "inline-block",
        }}
      >
        +
      </span>
    </button>
  )
}
