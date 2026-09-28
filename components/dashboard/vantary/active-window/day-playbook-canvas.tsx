"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  <DayPlaybookCanvas/>  ·  Active Window · Layer B
 *  ─────────────────────────────────────────────────────────────────────────
 *  Borderless replacement for `DayPlaybookCompact`. Answers "what kind of
 *  day is this?" in a single luxurious editorial slab. Click anywhere on
 *  the row to expand into the full intel drawer (the redesigned, also
 *  borderless, version of `DayPlaybookPanel`).
 *
 *  Compact reading order (the slab):
 *    LEFT  · day badge       — `WED` 18px mono + `TODAY` 7.5px mono below
 *    MID   · verdict body    — 3 strata (eyebrow crumb · verdict · stats)
 *    RIGHT · open chevron    — `▾ STUDY` / `▴ FOLD`
 *
 *  Drawer reading order (when expanded):
 *    A · Day tab strip       — MON · TUE · WED · THU · FRI
 *    B · Headline            — Day name + quality chip + week position
 *    C · Insight prose       — the one-line poetic summary
 *    D · Intel grid (×3)     — RECOMMENDATION / MANIPULATION / KEY BEHAVIOR
 *    E · Historical edge     — italic eyebrowed strip
 *    F · Footer rail         — RISK / SIZING / OPTIMAL SESSIONS
 *
 *  Visual rules (from MASTERPLAN §2.2):
 *    1. NO outer border, NO background panel.
 *    2. Sections separated by archio seams only.
 *    3. Day badge sits left-aligned with the live ripple to ITS LEFT
 *       (not corner-stickered on a chip).
 *    4. Quality chip becomes typographic — color + weight do the work,
 *       no border, no background pill.
 *    5. Hover: whole row lifts 1px AND the seam shimmer brightens —
 *       no border-color flips, no background-color flips.
 *    6. Click-confirm pulse on the row at the moment of expand.
 * ═══════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { VANTARY } from "../vantary-theme"
import {
  AW_CADENCE, AW_DUR, AW_EASE, AW_LETTER, AW_SIZE,
} from "@/lib/vantary/active-window-tokens"
import { ArchioSeam } from "./archio-seam"
import { ArchioPulseDot } from "./archio-pulse-dot"

/* ── Local mirror types so we don't have to export from your-space.tsx ─
   These match the structural shape of the DayPlaybook + DayQuality types
   declared inline in your-space.tsx. TypeScript is structural — any value
   matching this shape passes. */
export type DayQuality = "high" | "medium" | "low"

export interface DayPlaybookData {
  day: string
  short: string
  insight: string
  qualityLabel: string
  quality: DayQuality
  weekPosition: string
  recommendation: string
  manipulationPattern: string
  historicalEdge: string
  keyBehavior: string
  riskProfile: string
  positionSizing: string
  optimalSessions: string[]
}

export interface DayPlaybookCanvasProps {
  /** Currently-selected day-of-week (1=Mon..5=Fri). Drives which playbook
   *  renders. The parent owns the selection state so the canvas stays
   *  controllable from elsewhere (e.g. command palette). */
  selectedDow: number
  /** Live day-of-week — used to mark `TODAY` and pulse the live tab. */
  liveDow: number
  /** Map of day-of-week → playbook intel, keyed by `1..5`. */
  playbookByDow: Record<number, DayPlaybookData>
  /** Called when the user clicks a different day tab inside the drawer. */
  onSelectDow: (dow: number) => void
}

export function DayPlaybookCanvas({
  selectedDow,
  liveDow,
  playbookByDow,
  onSelectDow,
}: DayPlaybookCanvasProps) {
  const reducedMotion = useReducedMotion() ?? false
  const drawerId = useId()

  const playbook = playbookByDow[selectedDow] ?? playbookByDow[2]
  const isLiveDay = selectedDow === liveDow
  const isWeekday = selectedDow >= 1 && selectedDow <= 5

  /* ── Accent · quality-driven, not session-driven. KEY/PRIME days
        paint amber; CAUTION/SELECTIVE paint paper; AVOID dims to dim. */
  const qualityAccent =
    playbook.quality === "high"   ? VANTARY.amber :
    playbook.quality === "medium" ? VANTARY.paper :
                                    VANTARY.paperDim

  /* ── Drawer expand/collapse + click-confirm pulse state ─────────── */
  const [expanded, setExpanded] = useState(false)
  const [confirmPulse, setConfirmPulse] = useState(0)  // re-key to retrigger
  const [hovered, setHovered] = useState(false)

  /* When the row is clicked, fire a 180ms click-confirm pulse THEN
     toggle expanded. The pulse is a brief amber-wash bloom across the
     whole slab — gives the user instant feedback while the drawer
     starts unfolding. */
  const onRowClick = useCallback(() => {
    setConfirmPulse((c) => c + 1)
    setExpanded((v) => !v)
  }, [])

  /* Esc collapses the drawer when the row has focus. */
  const onRowKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && expanded) {
      e.preventDefault()
      setExpanded(false)
    }
  }, [expanded])

  /* ── Hover spotlight (cursor X follower) ─────────────────────────────
     Tracks the cursor's X position inside the row and writes it to a
     CSS custom property on the row's ref. A radial gradient overlay
     positioned via `radial-gradient(... at var(--aw-spotlight-x) center, ...)`
     reads that property and follows the cursor. Reduced-motion AND touch
     omit this entirely. */
  /* Ref is typed to the actual DOM target (a <button>, since the row
     element is `motion.button`). Earlier draft used `HTMLDivElement`
     which TS rightfully rejected — the spotlight reads cursor-X
     against the button's bounding rect, so the element class matters
     for the LegacyRef contract. */
  const rowRef = useRef<HTMLButtonElement | null>(null)
  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return
    const el = rowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    el.style.setProperty("--aw-spotlight-x", `${x}%`)
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ────────────────────────────────────────────────────────────────
            TOP SEAM · marks the start of the playbook section
          ──────────────────────────────────────────────────────────── */}
      <ArchioSeam accent={qualityAccent} reduced={reducedMotion} marginY={0} />

      {/* ────────────��───────────────────────────────────────────────────
            THE COMPACT ROW (the always-visible verdict slab)
            One <button> for the whole row so click anywhere expands.
            No border. No background fill. Hover lifts 1px via transform.
          ──────────────────────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════
            COMPACT SLAB · v2 · FLIGHT-DECK CENTRED HERO
            ────────────────────────────────────────────────────────────
            User directive (13 May 2026):
              "day playbook remove.. early week range establishment
               phase remove.. use only monday manipulation day fake
               moves and thats it.. but make it look like flight deck.."

            The previous slab was a flush-left 3-column dossier:
              [WED badge] [eyebrow row + verdict + stat trio] [STUDY ▾]
            with an eyebrow strip ("DAY PLAYBOOK · CAUTION · EARLY
            WEEK — RANGE ESTABLISHMENT PHASE") and a live-day stat
            trio (OPTIMAL · SIZE · RISK).

            Retired entirely:
              • Eyebrow row (DAY PLAYBOOK · qualityLabel · weekPosition)
              • Live-day stat trio
              • The flush-left 72 px badge column
              • Right-side STUDY/FOLD chevron block

            The new slab is a single centred editorial hero, composed
            the same way as the Flight Deck nameplate:

                            ─ ─  — 01  ─ ─

                              M O N D A Y

              Manipulation day. False moves set the weekly range.

                              ⌄  STUDY

            Reading order (top → bottom, all centred):
              [α]  numeric eyebrow with thin flanking hairlines     — 9 px mono
              [β]  giant day name                                    — 30 px sans
              [γ]  insight (the verdict line)                        — 13 px sans
              [δ]  study / fold control                              — 9 px mono

            Retained:
              • Hover lift (1 px y-translate)
              • Cursor-X spotlight (radial gradient follows cursor)
              • Click-confirm pulse (re-keyed each click)
              • Live-day ripple — now flanks the day name, not corner-stickered
              • Quality-accent colour resolution unchanged
          ════════════════════════════════════════════════════════════ */}
      <motion.button
        type="button"
        ref={rowRef}
        aria-expanded={expanded}
        aria-controls={drawerId}
        aria-label={`${playbook.day} playbook summary. ${expanded ? "Collapse" : "Expand"} for full intel.`}
        onClick={onRowClick}
        onKeyDown={onRowKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMouseMove}
        whileHover={reducedMotion ? undefined : { y: -1 }}
        transition={{ duration: 0.18, ease: AW_EASE.aw }}
        className="focus:outline-none"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "26px 12px 22px",
          gap: 12,
          background: "transparent",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        {/* Hover spotlight overlay — follows cursor X, omitted when reduced. */}
        {!reducedMotion && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: hovered ? 1 : 0,
              transition: `opacity ${AW_DUR.hoverFollow}s ${AW_EASE.breath}`,
              background: `radial-gradient(260px 100px at var(--aw-spotlight-x, 50%) 50%, ${VANTARY.amberWash}, transparent 70%)`,
            }}
          />
        )}

        {/* Click-confirm pulse — re-keys on every click so the animation restarts. */}
        <AnimatePresence>
          <motion.span
            key={`confirm-${confirmPulse}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.32, 0] }}
            transition={{ duration: 0.36, ease: AW_EASE.aw }}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `linear-gradient(90deg, transparent 0%, ${qualityAccent} 50%, transparent 100%)`,
              mixBlendMode: "screen",
            }}
          />
        </AnimatePresence>

        {/* ── α · NUMERIC EYEBROW ROW ─────────────────────────────────
              Thin hairline on each side that pinches to transparent at
              the panel edge, terminating in a tiny accent dot, then the
              numeric stamp (the day-of-week ordinal, 1..5). Identical
              composition language to the temporal rail nameplate so
              the panel reads as one editorial document. */}
        <div
          className="flex items-center"
          style={{
            position: "relative",
            width: "100%",
            gap: 10,
            paddingLeft: 8,
            paddingRight: 8,
            minHeight: 14,
          }}
        >
          <EyebrowHairline accent={qualityAccent} side="left" />
          <span
            aria-hidden
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: qualityAccent,
              opacity: 0.65,
              boxShadow: `0 0 4px ${qualityAccent}`,
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize: 9,
              letterSpacing: "0.34em",
              color: VANTARY.ashSoft,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            — {String(isWeekday ? selectedDow : 0).padStart(2, "0")} ·{" "}
            <span style={{ color: qualityAccent }}>
              {isLiveDay ? "TODAY" : isWeekday ? "PREVIEW" : "OFF"}
            </span>
          </span>
          <span
            aria-hidden
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: qualityAccent,
              opacity: 0.65,
              boxShadow: `0 0 4px ${qualityAccent}`,
              flexShrink: 0,
            }}
          />
          <EyebrowHairline accent={qualityAccent} side="right" />
        </div>

        {/* ── β · GIANT DAY NAME (the headline) ─────────────────────────
              The slab's centre of gravity. Live-day ripple flanks the
              left edge of the headline as a confirming heartbeat —
              cross-fades on day swap so previewing future days reads
              as a contemplative gesture, not a status flip. */}
        <div
          className="flex items-center justify-center"
          style={{ gap: 14, minHeight: 36 }}
        >
          {isLiveDay && (
            <ArchioPulseDot
              accent={qualityAccent}
              size={AW_SIZE.liveDotMini}
              reduced={reducedMotion}
            />
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={playbook.day}
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: AW_DUR.contentFade * 1.1, ease: AW_EASE.aw }}
              className="font-sans"
              style={{
                fontSize: 30,
                color: qualityAccent,
                fontWeight: 500,
                letterSpacing: "0.04em",
                lineHeight: 1,
                textShadow:
                  isLiveDay && qualityAccent === VANTARY.amber
                    ? `0 0 14px ${VANTARY.amberHalo}`
                    : "none",
              }}
            >
              {playbook.day}
            </motion.span>
          </AnimatePresence>
          {isLiveDay && (
            <ArchioPulseDot
              accent={qualityAccent}
              size={AW_SIZE.liveDotMini}
              reduced={reducedMotion}
            />
          )}
        </div>

        {/* ── γ · VERDICT LINE (the insight) ──────────────────────────
              The one line the trader must read. Centred, max-width to
              hold an editorial line length, paperDim so the headline
              above carries the weight. Cross-fades when the day swaps
              so future-day preview reads as fresh prose. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`insight-${playbook.day}`}
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -2 }}
            transition={{ duration: AW_DUR.contentFade, ease: AW_EASE.aw }}
            className="font-sans"
            style={{
              fontSize: 13,
              color: VANTARY.paperDim,
              fontWeight: 400,
              letterSpacing: AW_LETTER.body,
              lineHeight: 1.55,
              maxWidth: 460,
              margin: 0,
              textWrap: "pretty",
            }}
          >
            {playbook.insight}
          </motion.p>
        </AnimatePresence>

        {/* ── δ · STUDY / FOLD CONTROL ────────────────────────────────
              A small centred control, mono uppercase, the chevron
              rotates 180° on expand. Hover/expanded paints amber. */}
        <div
          className="flex items-center justify-center"
          style={{ gap: 8, marginTop: 4 }}
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={reducedMotion ? undefined : { rotate: expanded ? 180 : 0, y: expanded ? 0 : [0, 1, 0] }}
            transition={{
              rotate: { duration: 0.28, ease: AW_EASE.aw },
              y: { duration: 2.4, ease: "easeInOut", repeat: Infinity },
            }}
            style={{
              fontSize: 11,
              lineHeight: 1,
              color: hovered || expanded ? VANTARY.amber : VANTARY.ashSoft,
              transition: `color ${AW_DUR.contentFade}s`,
            }}
          >
            ▾
          </motion.span>
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize: 9,
              letterSpacing: "0.38em",
              color: hovered || expanded ? VANTARY.amber : VANTARY.ashSoft,
              fontWeight: 500,
              transition: `color ${AW_DUR.contentFade}s`,
            }}
          >
            {expanded ? "FOLD" : "STUDY"}
          </span>
        </div>
      </motion.button>

      {/* ────────────────────────────────────────────────────────────────
            BOTTOM SEAM (closes the compact slab; also the drawer's
            top seam when expanded)
          ──────────────────────────────────────────────────────────── */}
      <ArchioSeam accent={qualityAccent} reduced={reducedMotion} />

      {/* ────────────────────────────────────────────────────────────────
            EXPANDED DRAWER · the full intel panel, borderless
            Renders only when expanded. Sections separated by archio
            seams, stagger-in on mount.
          ──────────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={drawerId}
            initial={reducedMotion ? false : { height: 0, opacity: 0, y: -8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -4 }}
            transition={{ duration: expanded ? AW_DUR.drawerOpen : AW_DUR.drawerClose, ease: AW_EASE.aw }}
            style={{ overflow: "hidden" }}
          >
            <DrawerContent
              playbook={playbook}
              playbookByDow={playbookByDow}
              selectedDow={selectedDow}
              liveDow={liveDow}
              onSelectDow={onSelectDow}
              qualityAccent={qualityAccent}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <DrawerContent/>  ·  the unfolded intel panel
 *  ───────────────────────────────────────────────────────────────────────
 *  Six layered sections, each separated by an ArchioSeam. Sections
 *  stagger-in on mount via the parent's height animation completing
 *  alongside each child's individual opacity/y reveal.
 *
 *  The intent here is to take the verbose `DayPlaybookPanel` content
 *  exactly as it exists today (so the words a trader trusts don't
 *  disappear) and re-skin it as a borderless editorial column. None of
 *  the data, none of the prose, none of the column ordering changes —
 *  only the chrome.
 * ─────────────────────────────────────────────────────────────────────── */
function DrawerContent({
  playbook,
  playbookByDow,
  selectedDow,
  liveDow,
  onSelectDow,
  qualityAccent,
  reducedMotion,
}: {
  playbook: DayPlaybookData
  playbookByDow: Record<number, DayPlaybookData>
  selectedDow: number
  liveDow: number
  onSelectDow: (dow: number) => void
  qualityAccent: string
  reducedMotion: boolean
}) {
  /* Stagger-in helper — each section becomes a motion.div with an
     index-based delay. The wrapper's height-animation is the visual
     "drawer," the children's stagger is the editorial pacing inside. */
  const stagger = (i: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 8 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: {
      duration: AW_DUR.contentFade,
      ease: AW_EASE.aw,
      delay: reducedMotion ? 0 : AW_DUR.drawerStagger * i,
    },
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingTop: 6 }}>
      {/* ── A · DAY TAB STRIP · MON..FRI ─────────────────────────────── */}
      <motion.div {...stagger(0)} style={{ display: "flex", flexDirection: "column", paddingTop: 4, paddingBottom: 10 }}>
        <DayTabStrip
          selectedDow={selectedDow}
          liveDow={liveDow}
          playbookByDow={playbookByDow}
          onSelectDow={onSelectDow}
          reducedMotion={reducedMotion}
        />
      </motion.div>

      <ArchioSeam accent={qualityAccent} reduced={reducedMotion} />

      {/* ── B · HEADLINE ────────────────────────────────────────────── */}
      <motion.div
        {...stagger(1)}
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 12,
          padding: "16px 4px 6px",
        }}
      >
        <span
          className="font-sans"
          style={{
            fontSize: 28,
            color: VANTARY.paper,
            fontWeight: 500,
            letterSpacing: AW_LETTER.headline,
            lineHeight: 1,
          }}
        >
          {playbook.day}
        </span>
        <BreathingKeyword text={playbook.qualityLabel} accent={qualityAccent} reduced={reducedMotion} size={9.5} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.26em",
            color: VANTARY.ashSoft,
          }}
        >
          {playbook.weekPosition}
        </span>
        <span aria-hidden style={{ flex: 1 }} />
        {selectedDow !== liveDow && (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.28em",
              color: VANTARY.ashSoft,
            }}
          >
            PREVIEW MODE
          </span>
        )}
      </motion.div>

      {/* ── C · INSIGHT PROSE ──────────────────────────────────────────── */}
      <motion.p
        {...stagger(2)}
        className="font-sans"
        style={{
          fontSize: 14,
          color: VANTARY.paperDim,
          lineHeight: 1.6,
          maxWidth: 720,
          padding: "0 4px 16px",
          textWrap: "pretty",
        }}
      >
        {playbook.insight}
      </motion.p>

      <ArchioSeam accent={qualityAccent} reduced={reducedMotion} />

      {/* ── D · INTEL GRID · 3 COLUMNS ─────────────────────────────────── */}
      <motion.div
        {...stagger(3)}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: "18px 0",
          gap: 20,
        }}
      >
        <IntelCell
          eyebrow="RECOMMENDATION"
          glyph="◆"
          glyphColor={qualityAccent}
          body={playbook.recommendation}
        />
        <IntelCell
          eyebrow="MANIPULATION PATTERN"
          glyph="⊕"
          glyphColor={VANTARY.paper}
          body={playbook.manipulationPattern}
        />
        <IntelCell
          eyebrow="KEY BEHAVIOR TODAY"
          glyph="◉"
          glyphColor={VANTARY.amber}
          body={playbook.keyBehavior}
        />
      </motion.div>

      <ArchioSeam accent={qualityAccent} reduced={reducedMotion} />

      {/* ── E · HISTORICAL EDGE ─────────────────────────────────────────── */}
      <motion.div
        {...stagger(4)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          padding: "16px 4px",
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: AW_LETTER.eyebrow,
            color: VANTARY.amber,
            fontWeight: 500,
            textShadow: `0 0 8px ${VANTARY.amberHalo}`,
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          HISTORICAL EDGE
        </span>
        <p
          className="font-sans"
          style={{
            fontSize: 13,
            color: VANTARY.paperDim,
            lineHeight: 1.6,
            fontStyle: "italic",
            textWrap: "pretty",
          }}
        >
          {playbook.historicalEdge}
        </p>
      </motion.div>

      <ArchioSeam accent={qualityAccent} reduced={reducedMotion} />

      {/* ── F · FOOTER RAIL · RISK · SIZING · OPTIMAL ─────────────────── */}
      <motion.div
        {...stagger(5)}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.2fr",
          padding: "16px 0 4px",
          gap: 20,
        }}
      >
        <FooterColumn eyebrow="RISK" body={playbook.riskProfile} />
        <FooterColumn eyebrow="SIZING" body={playbook.positionSizing} />
        <OptimalSessionsCell sessions={playbook.optimalSessions} reduced={reducedMotion} />
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <DayTabStrip/>  ·  MON..FRI day-switcher inside the drawer
 *  ───────────────────────────────────────────────────────────────────────
 *  Same shared layoutId underline trick as the existing DayPlaybookPanel,
 *  but with no borders. Tabs are typographic glyphs sitting on a single
 *  shared archio seam; the active tab gets a 2px underline that slides
 *  via `layoutId="aw-day-tab-underline"`.
 * ─────────────────────────────────────────────────────────────────────── */
function DayTabStrip({
  selectedDow,
  liveDow,
  playbookByDow,
  onSelectDow,
  reducedMotion,
}: {
  selectedDow: number
  liveDow: number
  playbookByDow: Record<number, DayPlaybookData>
  onSelectDow: (dow: number) => void
  reducedMotion: boolean
}) {
  const days = [1, 2, 3, 4, 5]
  return (
    <div
      role="tablist"
      aria-label="Day of week playbook selector"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 4,
      }}
    >
      {days.map((d) => {
        const pb = playbookByDow[d]
        if (!pb) return null
        const active = d === selectedDow
        const live = d === liveDow
        const tone =
          pb.quality === "high"   ? VANTARY.amber :
          pb.quality === "medium" ? VANTARY.paper : VANTARY.paperDim
        return (
          <button
            key={d}
            role="tab"
            aria-selected={active}
            onClick={() => onSelectDow(d)}
            className="relative flex flex-col items-center justify-center focus:outline-none"
            style={{
              padding: "10px 6px",
              gap: 4,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: active ? tone : live ? VANTARY.paper : VANTARY.ashSoft,
                  fontWeight: active || live ? 500 : 400,
                  transition: "color 200ms",
                }}
              >
                {pb.short}
              </span>
              {live && (
                <ArchioPulseDot
                  accent={VANTARY.amber}
                  size={AW_SIZE.liveDotMini}
                  reduced={reducedMotion}
                />
              )}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 7.5,
                letterSpacing: "0.24em",
                color: tone,
                opacity: active ? 1 : 0.7,
                fontWeight: 500,
              }}
            >
              {pb.qualityLabel}
            </span>
            {active && (
              <motion.span
                layoutId="aw-day-tab-underline"
                aria-hidden
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  bottom: 0,
                  height: 2,
                  background: tone,
                  boxShadow: `0 0 6px ${tone}`,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: AW_DUR.layoutShift, ease: AW_EASE.aw }
                }
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── Small parts ─────────────────────────────────────────────────────── */

function AccentBullet({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: accent,
        opacity: 0.6,
        boxShadow: `0 0 3px ${accent}`,
        flexShrink: 0,
      }}
    />
  )
}

/** Horizontal hairline that flanks the compact-slab numeric eyebrow.
 *  Mirrors the temporal rail's `NameplateHairline` so the slab and the
 *  rail above it read as one editorial document — same composition
 *  language, same pinch-to-transparent behavior at the outer edges. */
function EyebrowHairline({
  accent,
  side,
}: {
  accent: string
  side: "left" | "right"
}) {
  const direction = side === "left" ? "to right" : "to left"
  return (
    <span
      aria-hidden
      style={{
        flex: 1,
        height: 1,
        background:
          `linear-gradient(${direction}, ` +
          `  transparent 0%, ` +
          `  ${accent}33 65%, ` +
          `  ${accent}88 100%)`,
        opacity: 0.7,
      }}
    />
  )
}

function BreathingKeyword({
  text,
  accent,
  reduced,
  size = 9,
}: {
  text: string
  accent: string
  reduced: boolean
  size?: number
}) {
  /* The keyword (KEY DAY, CAUTION, AVOID) breathes its textShadow blur
     from 8 → 14 → 8px every 4 seconds. No background, no border. Pure
     typographic emphasis. */
  if (reduced) {
    return (
      <span
        className="font-mono uppercase"
        style={{
          fontSize: size,
          letterSpacing: AW_LETTER.eyebrowPremium,
          color: accent,
          fontWeight: 500,
          textShadow: `0 0 ${AW_SIZE.textHaloIdle}px ${accent}`,
        }}
      >
        {text}
      </span>
    )
  }
  return (
    <motion.span
      className="font-mono uppercase"
      style={{
        fontSize: size,
        letterSpacing: AW_LETTER.eyebrowPremium,
        color: accent,
        fontWeight: 500,
        willChange: "text-shadow",
      }}
      animate={{
        textShadow: [
          `0 0 ${AW_SIZE.textHaloIdle}px ${accent}`,
          `0 0 ${AW_SIZE.textHaloBreath}px ${accent}`,
          `0 0 ${AW_SIZE.textHaloIdle}px ${accent}`,
        ],
      }}
      transition={{
        duration: AW_CADENCE.qualityKeyword,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {text}
    </motion.span>
  )
}

function IntelCell({
  eyebrow, glyph, glyphColor, body,
}: {
  eyebrow: string
  glyph: string
  glyphColor: string
  body: string
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", paddingRight: 4 }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span
          aria-hidden
          className="font-mono"
          style={{ fontSize: 11, color: glyphColor, lineHeight: 1 }}
        >
          {glyph}
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: AW_LETTER.eyebrow,
            color: VANTARY.ashSoft,
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </span>
      </div>
      <p
        className="font-sans"
        style={{
          fontSize: 12.5,
          color: VANTARY.paperDim,
          lineHeight: 1.6,
          textWrap: "pretty",
        }}
      >
        {body}
      </p>
    </div>
  )
}

function FooterColumn({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        className="font-mono uppercase mb-2"
        style={{
          fontSize: 9,
          letterSpacing: AW_LETTER.eyebrow,
          color: VANTARY.ashSoft,
          fontWeight: 500,
        }}
      >
        {eyebrow}
      </div>
      <p
        className="font-sans"
        style={{
          fontSize: 12,
          color: VANTARY.paperDim,
          lineHeight: 1.55,
          textWrap: "pretty",
        }}
      >
        {body}
      </p>
    </div>
  )
}

function OptimalSessionsCell({ sessions, reduced }: { sessions: string[]; reduced: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <ArchioPulseDot accent={VANTARY.amber} size={AW_SIZE.liveDotMini} reduced={reduced} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: AW_LETTER.eyebrow,
            color: VANTARY.ashSoft,
            fontWeight: 500,
          }}
        >
          OPTIMAL SESSIONS
        </span>
      </div>
      {sessions.length === 0 ? (
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            color: VANTARY.paperDim,
            fontWeight: 500,
          }}
        >
          — STAY OUT —
        </span>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          {sessions.map((s) => (
            <span
              key={s}
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                color: VANTARY.amber,
                fontWeight: 500,
                textShadow: `0 0 8px ${VANTARY.amberHalo}`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
