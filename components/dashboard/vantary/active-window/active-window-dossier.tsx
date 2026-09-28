"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  <ActiveWindowDossier/>  ·  Active Window · Layer C
 *  ─────────────────────────────────────────────────────────────────────────
 *  Borderless replacement for `ActiveSessionFocusCard`. The dossier of the
 *  live session: phase tabs, session nameplate, counters, the FOCUS NOW
 *  editorial headline, the WHY/EXPECT reasoning pair, and the micro-phase
 *  ladder. This is the largest piece in the panel and earns the most
 *  motion choreography — every transition has its own beat.
 *
 *  Reading order:
 *    C-1 · eyebrow rail        — ● ACTIVE WINDOW · UTC · [snap-to-live]
 *    C-2 · phase-tab rail      — 7 typographic glyphs on a shared seam
 *    C-3 · session nameplate   — huge sans name + breathing tag
 *    C-4 · counters + progress — elapsed/remaining + 2px progress bar w/ playhead
 *    C-5 · FOCUS NOW headline  — eyebrow + huge sans + body prose
 *    C-6 · WHY / EXPECT pair   — two cells, no border, micro-seams
 *    C-7 · MICRO-PHASES        — horizontal stepper on a single seam
 *    C-8 · session thesis      — italic voice-over
 *
 *  Choreography (MASTERPLAN §4):
 *    Phase-tab click          ~500ms total · 5 parallel tracks
 *    Micro-phase click        ~400ms total · 2 parallel tracks
 *    Snap-to-live             ~500ms + 220ms eyebrow crossfade
 *
 *  Motion budget · the dossier has ~6 active animations on the screen at
 *  once (panel breath, live ripple, tag halo, tab halo, seam shimmer,
 *  rotating label). All of them are compositor-bound (transform / opacity
 *  / text-shadow). Total per-frame paint area is bounded by the dossier's
 *  bounding rect; modern browsers handle 60fps comfortably.
 * ═══════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { VANTARY } from "../vantary-theme"
import {
  AW_CADENCE, AW_DUR, AW_EASE, AW_LETTER, AW_OPACITY, AW_SIZE,
  AW_TAB_THESIS, AW_BODY_PSYCH,
} from "@/lib/vantary/active-window-tokens"
import { ArchioSeam } from "./archio-seam"
import { ArchioPulseDot } from "./archio-pulse-dot"
import { ArchioRotatingLabel } from "./archio-rotating-label"

/* ── Structural mirror types · loose duck-types that match the inline
       interfaces in your-space.tsx. Anything passing those types passes
       these. */
export interface MicroPhaseLite {
  id: string
  shortLabel: string
  label: string
  focusNow: string
  focusWhy: string
  expect: string
}
export interface SessionDefLite {
  key: string
  label: string         // PRE-LONDON
  short: string         // PRE-LDN
  fullName: string      // Pre-London
  tag: string           // KZ / DEAD / OFF
  isKZ: boolean
  startUTC: number
  endUTC: number
  thesis: string
  phases: MicroPhaseLite[]
}

export interface ActiveWindowDossierProps {
  /** Spine-resolved live session. */
  liveSession: SessionDefLite
  /** Spine-resolved live phase inside that session. */
  livePhase: MicroPhaseLite
  /** Spine-resolved 0..1 progress through the live session. */
  liveProgress: number
  /** Minutes elapsed inside the live session. */
  elapsedMin: number
  /** Minutes remaining inside the live session. */
  remainingMin: number
  /** Live UTC "HH:MM" — when this changes the eyebrow clock digit-flashes. */
  utcClock: string
  /** All sessions in chronological order — drives the phase-tab rail. */
  allSessions: SessionDefLite[]
}

export function ActiveWindowDossier({
  liveSession,
  livePhase,
  liveProgress,
  elapsedMin,
  remainingMin,
  utcClock,
  allSessions,
}: ActiveWindowDossierProps) {
  const reducedMotion = useReducedMotion() ?? false

  /* ═══ STATE ═══════════════════════════════════════════════════════════
   *  Two pieces of state govern the view (identical semantics to the old
   *  card so transitions can replicate exactly):
   *      selectedKey   — which top-level session window is shown
   *      pickedPhaseId — which micro-phase inside that window is shown
   *  Both null = "follow the live spine."  */
  const [selectedKey,   setSelectedKey]   = useState<string | null>(null)
  const [pickedPhaseId, setPickedPhaseId] = useState<string | null>(null)

  /* Resolve which session/phase to render. */
  const sessionShown = useMemo<SessionDefLite>(() => {
    if (!selectedKey || selectedKey === liveSession.key) return liveSession
    return allSessions.find((s) => s.key === selectedKey) ?? liveSession
  }, [selectedKey, liveSession, allSessions])

  const phaseShown = useMemo<MicroPhaseLite>(() => {
    if (selectedKey && selectedKey !== liveSession.key) {
      if (pickedPhaseId) {
        const p = sessionShown.phases.find((x) => x.id === pickedPhaseId)
        if (p) return p
      }
      return sessionShown.phases[0] ?? livePhase
    }
    if (pickedPhaseId) {
      const p = liveSession.phases.find((x) => x.id === pickedPhaseId)
      if (p) return p
    }
    return livePhase
  }, [selectedKey, pickedPhaseId, liveSession, livePhase, sessionShown])

  const isViewingLive = !selectedKey || selectedKey === liveSession.key
  const isLivePhase   = isViewingLive && (!pickedPhaseId || pickedPhaseId === livePhase.id)
  const isKZ          = sessionShown.isKZ
  const isOff         = sessionShown.key === "OFF"
  const accent        = isKZ ? VANTARY.amber : isOff ? VANTARY.ashSoft : VANTARY.paper

  const snapToLive = useCallback(() => {
    setSelectedKey(null)
    setPickedPhaseId(null)
  }, [])

  /* ═══ Minute-rollover digit flash on the eyebrow UTC clock ═══════════ */
  const lastClockRef = useRef(utcClock)
  const [clockFlashKey, setClockFlashKey] = useState(0)
  useEffect(() => {
    if (lastClockRef.current === utcClock) return
    lastClockRef.current = utcClock
    setClockFlashKey((k) => k + 1)
  }, [utcClock])

  /* ═══ Atmospheric breath alpha · the panel's heartbeat ═══════════════
   *  Animates a CSS custom property on the dossier root so any descendant
   *  can read it. Reduced motion: skipped — we render at the mid-alpha. */
  const breathTargets = useMemo(
    () => [AW_OPACITY.panelBreathMin, AW_OPACITY.panelBreathMax, AW_OPACITY.panelBreathMin],
    [],
  )

  return (
    <motion.div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "8px 4px 12px",
        /* `--aw-accent` is consumed by descendants for color theming. */
        ["--aw-accent" as string]: accent,
      }}
    >
      {/* ── ATMOSPHERIC BREATH LAYER (single radial gradient) ──────────
            Sits at z-index -1 behind everything in the dossier. */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
          backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${accent}, transparent 70%)`,
        }}
        initial={false}
        animate={reducedMotion ? { opacity: AW_OPACITY.panelBreathMin } : { opacity: breathTargets }}
        transition={{
          duration: AW_CADENCE.panelBreath,
          ease: "easeInOut",
          repeat: reducedMotion ? 0 : Infinity,
        }}
      />

      {/* ═════════════ C-1 · EYEBROW RAIL ═════════════ */}
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 14 }}>
        <ArchioPulseDot
          accent={isViewingLive ? accent : VANTARY.ashSoft}
          size={AW_SIZE.liveDotCore}
          ringless={!isViewingLive}
          reduced={reducedMotion}
        />
        {/* Cross-fade between ACTIVE WINDOW and PREVIEW · NOT LIVE. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isViewingLive ? "active" : "preview"}
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: AW_DUR.contentFade, ease: AW_EASE.aw }}
            className="font-mono uppercase"
            style={{
              fontSize: AW_SIZE.eyebrowFontSize,
              letterSpacing: AW_LETTER.eyebrow,
              color: isViewingLive ? VANTARY.ashSoft : VANTARY.paperDim,
              fontWeight: 500,
            }}
          >
            {isViewingLive ? "ACTIVE WINDOW" : "PREVIEW · NOT LIVE"}
          </motion.span>
        </AnimatePresence>

        <span aria-hidden style={{ flex: 1 }} />

        {/* Snap-to-live · only when previewing. Borderless typographic chip. */}
        <AnimatePresence>
          {!isViewingLive && (
            <motion.button
              key="snap-to-live"
              type="button"
              onClick={snapToLive}
              aria-label="Return to the live session window"
              initial={reducedMotion ? false : { opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 4 }}
              transition={{ duration: AW_DUR.contentFade, ease: AW_EASE.aw }}
              whileHover={reducedMotion ? undefined : { y: -1 }}
              className="font-mono uppercase tabular-nums focus:outline-none"
              style={{
                fontSize: 9,
                letterSpacing: "0.36em",
                color: VANTARY.amber,
                fontWeight: 500,
                background: "transparent",
                border: "none",
                padding: "2px 6px",
                cursor: "pointer",
                textShadow: `0 0 10px ${VANTARY.amberHalo}`,
              }}
            >
              ◀ LIVE
            </motion.button>
          )}
        </AnimatePresence>

        {/* UTC clock with minute-rollover digit flash. */}
        <motion.span
          key={clockFlashKey}
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: AW_SIZE.eyebrowFontSize,
            letterSpacing: AW_LETTER.numeric,
            fontWeight: 500,
            willChange: "color",
          }}
          initial={false}
          animate={
            reducedMotion
              ? { color: accent }
              : { color: [accent, VANTARY.paper, accent] }
          }
          transition={{ duration: AW_CADENCE.minuteRolloverFlash, ease: "easeInOut" }}
        >
          {utcClock} UTC
        </motion.span>
      </div>

      {/* ═════════════ C-2 · PHASE-TAB RAIL ═════════════ */}
      <PhaseTabRail
        allSessions={allSessions}
        liveSession={liveSession}
        sessionShown={sessionShown}
        onSelect={(key) => {
          if (selectedKey === key) {
            setSelectedKey(null)
            setPickedPhaseId(null)
          } else {
            setSelectedKey(key)
            setPickedPhaseId(null)
          }
        }}
        accent={accent}
        reducedMotion={reducedMotion}
      />

      {/* ═════════════ C-3 · SESSION NAMEPLATE ═════════════ */}
      <SessionNameplate
        session={sessionShown}
        accent={accent}
        reduced={reducedMotion}
      />

      {/* ═════════════ C-4 · COUNTERS + PROGRESS (live-only) ═════════════ */}
      {isViewingLive ? (
        <LiveCounters
          elapsedMin={elapsedMin}
          remainingMin={remainingMin}
          progress={liveProgress}
          accent={accent}
          phaseLabel={phaseShown.label}
          reduced={reducedMotion}
        />
      ) : (
        <PreviewBanner session={sessionShown} reduced={reducedMotion} />
      )}

      {/* ═════════════ C-5 · FOCUS NOW HEADLINE ═════════════ */}
      <FocusNowBlock
        phase={phaseShown}
        phaseIndex={sessionShown.phases.indexOf(phaseShown) + 1}
        phaseTotal={sessionShown.phases.length}
        isLivePhase={isLivePhase}
        accent={accent}
        reduced={reducedMotion}
      />

      {/* ═════════════ C-6 · WHY / EXPECT PAIR ═════════════ */}
      <WhyExpectPair phase={phaseShown} accent={accent} reduced={reducedMotion} isLivePhase={isLivePhase} />

      {/* ═════════════ C-7 · MICRO-PHASES LADDER ═════════════ */}
      <MicroPhaseLadder
        session={sessionShown}
        currentPhase={phaseShown}
        accent={accent}
        reducedMotion={reducedMotion}
        onPick={(p) => {
          if (selectedKey === null) {
            if (p.id === livePhase.id) setPickedPhaseId(null)
            else setPickedPhaseId(p.id)
          } else {
            setPickedPhaseId(p.id)
          }
        }}
      />

      {/* ═════════════ C-8 · SESSION THESIS ═════════════ */}
      <p
        className="font-sans"
        style={{
          fontSize: 12,
          color: VANTARY.ashSoft,
          lineHeight: 1.6,
          fontStyle: "italic",
          marginTop: 18,
          textWrap: "pretty",
        }}
      >
        {sessionShown.thesis}
      </p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <PhaseTabRail/>  ·  the cinematic centerpiece (C-2)
 *  ───────────────────────────────────────────────────────────────────────
 *  Seven typographic glyphs floating on a single shared baseline seam.
 *  No tab has its own border. Each tab is just its label + a 5px indicator
 *  dot directly below it. The currently-selected tab is bridged via a
 *  shared `layoutId="aw-active-phase-underline"` accent line that SLIDES
 *  along the baseline when the user clicks a new tab.
 *
 *  Visual schema:
 *    ─────────●────────●────────●────────●────────●────────●────────●─────
 *      PRE-LDN  LDN-KZ  LDN-NY  NY-KZ  LDN-CLS  POST-NY   OFF
 *
 *  The dots below labels are state-coded:
 *    LIVE         · concentric ripple, accent color
 *    SELECTED     · solid accent
 *    INACTIVE     · 1.5px hollow ring at 30% alpha
 *
 *  The LIVE tab additionally carries a breathing radial wash behind its
 *  label — `radial-gradient(60% 100% at 50% 50%, accent, transparent)`
 *  pulsing 8%↔16% alpha every 3.4s. This is the panel's strongest "RIGHT
 *  NOW" cue. The rotating thesis label (9s) replaces the LIVE tab's plain
 *  short-name with a Bloomberg-ticker style alternation.
 *
 *  Hover: letter-spacing tightens 0.32em → 0.18em over 180ms and the
 *  indicator dot scales 1 → 1.4. NO color change, NO background change.
 *  The typographic settle alone signals hover.
 * ─────────────────────────────────────────────────────────────────────── */
function PhaseTabRail({
  allSessions,
  liveSession,
  sessionShown,
  onSelect,
  accent,
  reducedMotion,
}: {
  allSessions: SessionDefLite[]
  liveSession: SessionDefLite
  sessionShown: SessionDefLite
  onSelect: (key: string) => void
  accent: string
  reducedMotion: boolean
}) {
  return (
    <div
      role="tablist"
      aria-label="Trading-day session windows"
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${allSessions.length}, minmax(0, 1fr))`,
        alignItems: "stretch",
        marginBottom: 24,
      }}
    >
      {/* Continuous baseline seam — runs left-to-right behind all tabs. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 6,
          height: 1,
          pointerEvents: "none",
        }}
      >
        <ArchioSeam accent={accent} reduced={reducedMotion} />
      </div>

      {allSessions.map((s) => {
        const isLive     = s.key === liveSession.key
        const isSelected = s.key === sessionShown.key
        return (
          <PhaseTab
            key={s.key}
            session={s}
            isLive={isLive}
            isSelected={isSelected}
            onClick={() => onSelect(s.key)}
            accent={accent}
            reduced={reducedMotion}
          />
        )
      })}
    </div>
  )
}

function PhaseTab({
  session,
  isLive,
  isSelected,
  onClick,
  accent,
  reduced,
}: {
  session: SessionDefLite
  isLive: boolean
  isSelected: boolean
  onClick: () => void
  accent: string
  reduced: boolean
}) {
  const [hovered, setHovered] = useState(false)

  /* Color tone — only changes between selected vs not. Active inherits
     panel accent (driven by sessionShown.isKZ). */
  const sessionAccent = session.isKZ
    ? VANTARY.amber
    : session.key === "OFF"
      ? VANTARY.ashSoft
      : VANTARY.paper

  const labelColor = isSelected
    ? sessionAccent
    : hovered
      ? sessionAccent
      : VANTARY.ashSoft

  /* The LIVE tab gets a rotating label — short name ↔ short thesis. */
  const thesis = AW_TAB_THESIS[session.key]
  const labelVariants = isLive && thesis
    ? [
        <span key="short">{session.short}</span>,
        <span key="thesis" style={{ color: VANTARY.paperDim, fontWeight: 400 }}>{thesis}</span>,
      ]
    : [<span key="static">{session.short}</span>]

  /* Indicator dot: ripple for live, solid for selected, ring for inactive. */
  const renderIndicator = () => {
    if (isLive) {
      return (
        <ArchioPulseDot
          accent={sessionAccent}
          size={AW_SIZE.microPhaseDot}
          reduced={reduced}
        />
      )
    }
    if (isSelected) {
      return (
        <span
          aria-hidden
          style={{
            width: AW_SIZE.microPhaseDot,
            height: AW_SIZE.microPhaseDot,
            borderRadius: "50%",
            background: sessionAccent,
            boxShadow: `0 0 6px ${sessionAccent}`,
          }}
        />
      )
    }
    return (
      <motion.span
        aria-hidden
        animate={reduced ? undefined : { scale: hovered ? 1.4 : 1 }}
        transition={{ duration: 0.18, ease: AW_EASE.aw }}
        style={{
          width: AW_SIZE.microPhaseDot,
          height: AW_SIZE.microPhaseDot,
          borderRadius: "50%",
          border: `1.5px solid ${VANTARY.ash}`,
          opacity: 0.4,
        }}
      />
    )
  }

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center justify-end focus:outline-none"
      style={{
        background: "transparent",
        border: "none",
        padding: "8px 4px 14px",
        cursor: "pointer",
        gap: 6,
      }}
    >
      {/* Live radial halo — only on the actually live tab. */}
      {isLive && !reduced && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `radial-gradient(70% 100% at 50% 50%, ${sessionAccent}, transparent 70%)`,
          }}
          animate={{ opacity: [AW_OPACITY.liveTabHaloMin, AW_OPACITY.liveTabHaloMax, AW_OPACITY.liveTabHaloMin] }}
          transition={{
            duration: AW_CADENCE.liveTabHalo,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}
      {isLive && reduced && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `radial-gradient(70% 100% at 50% 50%, ${sessionAccent}, transparent 70%)`,
            opacity: AW_OPACITY.liveTabHaloMax,
          }}
        />
      )}

      {/* Rotating label — short name ↔ thesis on live tab, static otherwise. */}
      <motion.span
        className="font-mono uppercase whitespace-nowrap"
        style={{
          position: "relative",
          fontSize: AW_SIZE.eyebrowFontSize,
          color: labelColor,
          fontWeight: isSelected || isLive ? 500 : 400,
          minWidth: 56,
          textAlign: "center",
          willChange: "letter-spacing, color",
          transition: `color ${AW_DUR.contentFade}s`,
        }}
        animate={{
          letterSpacing: hovered ? AW_LETTER.tabLabelHover : AW_LETTER.tabLabel,
        }}
        transition={{ duration: AW_DUR.letterTightening, ease: AW_EASE.aw }}
      >
        <ArchioRotatingLabel
          variants={labelVariants}
          cadence={AW_CADENCE.tabLabelRotation}
          reduced={reduced}
          keyPrefix={`tab-${session.key}`}
        />
      </motion.span>

      {/* Indicator dot — state-coded. */}
      <span style={{ position: "relative" }}>{renderIndicator()}</span>

      {/* Slide-along active underline · shared layoutId across all tabs. */}
      {isSelected && (
        <motion.span
          layoutId="aw-active-phase-underline"
          aria-hidden
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 4,
            height: 2,
            background: sessionAccent,
            boxShadow: `0 0 8px ${sessionAccent}`,
            borderRadius: 999,
          }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: AW_DUR.layoutShift, ease: AW_EASE.aw }
          }
        />
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <SessionNameplate/>  ·  C-3
 *  ───────────────────────────────────────────────────────────────────────
 *  The huge sans 32px session name + breathing tag pill. The most
 *  important typographic moment in the dossier. The tag's textShadow
 *  blur breathes 8↔14px every 3.4s (KZ) or 6s (DEAD). When the session
 *  is DEAD the whole nameplate sits at 78% opacity so the trader feels
 *  it in peripheral vision before reading the tag.
 * ─────────────────────────────────────────────────────────────────────── */
function SessionNameplate({
  session,
  accent,
  reduced,
}: {
  session: SessionDefLite
  accent: string
  reduced: boolean
}) {
  const isKZ   = session.isKZ
  const isOff  = session.key === "OFF"
  const opacity = isKZ ? AW_OPACITY.kzNameplate : AW_OPACITY.deadNameplate
  const cadence = isKZ ? AW_CADENCE.sessionTagPulse.kz : AW_CADENCE.sessionTagPulse.dead

  return (
    <motion.div
      style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 14, marginBottom: 8 }}
      animate={{ opacity }}
      transition={{ duration: 0.32, ease: AW_EASE.aw }}
    >
      <span
        className="font-sans"
        style={{
          fontSize: AW_SIZE.sessionNameSize,
          color: accent,
          fontWeight: 500,
          letterSpacing: AW_LETTER.headline,
          lineHeight: 1.05,
          textWrap: "balance",
        }}
      >
        {session.label}
      </span>
      {/* Breathing tag — KZ / DEAD / OFF. No border, no background. */}
      {reduced ? (
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: "0.40em",
            color: accent,
            fontWeight: 500,
            textShadow: `0 0 ${AW_SIZE.textHaloIdle}px ${accent}`,
          }}
        >
          {session.tag}
        </span>
      ) : (
        <motion.span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: "0.40em",
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
          transition={{ duration: cadence, ease: "easeInOut", repeat: Infinity }}
        >
          {session.tag}
        </motion.span>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <LiveCounters/>  ·  C-4
 *  ───────────────────────────────────────────────────────────────────────
 *  Elapsed / Remaining counters + a 2px progress bar with a leading-edge
 *  playhead dot. The vertical bar separator between counters becomes a
 *  3px accent dot. No box-shadow halo on the fill — the halo migrates to
 *  the playhead dot, keeping the bar feeling fine-print rather than heavy.
 * ─────────────────────────────────────────────────────────────────────── */
function LiveCounters({
  elapsedMin,
  remainingMin,
  progress,
  accent,
  phaseLabel,
  reduced,
}: {
  elapsedMin: number
  remainingMin: number
  progress: number
  accent: string
  phaseLabel: string
  reduced: boolean
}) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 2 }}>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: AW_SIZE.numericSmall, color: VANTARY.paperDim, fontWeight: 500 }}
        >
          {elapsedMin}m elapsed
        </span>
        <span
          aria-hidden
          style={{
            width: 3, height: 3, borderRadius: "50%",
            background: accent, opacity: 0.6, boxShadow: `0 0 3px ${accent}`,
          }}
        />
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: AW_SIZE.numericSmall, color: VANTARY.paperDim, fontWeight: 500 }}
        >
          {remainingMin}m remaining
        </span>
      </div>

      {/* Progress track + fill + playhead — wrapped in a single relative
          container so the playhead can be absolutely positioned at the
          fill's leading edge. */}
      <div style={{ position: "relative", height: AW_SIZE.microPhaseDot + 2 }}>
        {/* Track */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0, right: 0, top: "50%",
            transform: "translateY(-50%)",
            height: 2,
            background: accent,
            opacity: 0.08,
          }}
        />
        {/* Fill */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: 2,
            background: accent,
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Playhead dot — concentric ripple at the leading edge. */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: AW_SIZE.microPhaseDot,
            height: AW_SIZE.microPhaseDot,
          }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ArchioPulseDot accent={accent} size={AW_SIZE.microPhaseDot} reduced={reduced} />
        </motion.div>
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: AW_LETTER.eyebrow, color: VANTARY.ashSoft }}
        >
          {phaseLabel}
        </span>
        <span
          className="font-mono uppercase tabular-nums"
          style={{ fontSize: 9, letterSpacing: AW_LETTER.numeric, color: accent }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}

/* Preview banner · borderless dashed-feel strip shown when previewing a
   non-live session window. */
function PreviewBanner({ session, reduced }: { session: SessionDefLite; reduced: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 0",
        marginBottom: 18,
        opacity: 0.88,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: AW_LETTER.eyebrow,
          color: VANTARY.ashSoft,
          fontWeight: 500,
        }}
      >
        PREVIEWING
      </span>
      <span
        aria-hidden
        style={{
          width: 3, height: 3, borderRadius: "50%",
          background: VANTARY.ashSoft, opacity: 0.7,
        }}
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{ fontSize: 10, letterSpacing: AW_LETTER.numeric, color: VANTARY.paper, fontWeight: 500 }}
      >
        {session.startUTC.toString().padStart(2, "0")}–
        {session.endUTC.toString().padStart(2, "0")} UTC
      </span>
      <span
        aria-hidden
        style={{ width: 3, height: 3, borderRadius: "50%", background: VANTARY.ashSoft, opacity: 0.6 }}
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{ fontSize: 10, letterSpacing: AW_LETTER.numeric, color: VANTARY.paperDim }}
      >
        {session.phases.length} PHASE{session.phases.length === 1 ? "" : "S"}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <FocusNowBlock/>  ·  C-5 · the magazine pull-quote
 *  ───────────────────────────────────────────────────────────────────────
 *  Eyebrow + huge sans 32px headline that morphs via shared `layoutId`
 *  when the active phase changes, an archio seam divider underneath,
 *  then the focusNow body prose with `text-wrap: pretty`.
 * ─────────────────────────────────────────────────────────────────────── */
function FocusNowBlock({
  phase,
  phaseIndex,
  phaseTotal,
  isLivePhase,
  accent,
  reduced,
}: {
  phase: MicroPhaseLite
  phaseIndex: number
  phaseTotal: number
  isLivePhase: boolean
  accent: string
  reduced: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
      {/* Eyebrow row · pulse + label + index */}
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 8 }}>
        <ArchioPulseDot
          accent={accent}
          size={AW_SIZE.liveDotCore}
          ringless={!isLivePhase}
          reduced={reduced}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isLivePhase ? "focus-now" : "focus-preview"}
            initial={reduced ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -3 }}
            transition={{ duration: AW_DUR.contentFade, ease: AW_EASE.aw }}
            className="font-mono uppercase"
            style={{
              fontSize: AW_SIZE.premiumEyebrowSize,
              letterSpacing: AW_LETTER.eyebrowPremium,
              color: VANTARY.amber,
              fontWeight: 500,
              textShadow: `0 0 8px ${VANTARY.amberHalo}`,
            }}
          >
            {isLivePhase ? "FOCUS NOW" : "FOCUS PREVIEW"}
          </motion.span>
        </AnimatePresence>
        <span aria-hidden style={{ flex: 1 }} />
        <span
          className="font-mono uppercase tabular-nums"
          style={{ fontSize: 9, letterSpacing: AW_LETTER.numeric, color: VANTARY.ashSoft }}
        >
          {phaseIndex}/{phaseTotal}
        </span>
      </div>

      {/* Headline · morphs via shared layoutId when phase changes. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.h2
          key={phase.id}
          layoutId="aw-focus-headline"
          className="font-sans"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: AW_DUR.headlineMorph, ease: AW_EASE.aw }}
          style={{
            fontSize: AW_SIZE.sessionNameSize,
            color: VANTARY.paper,
            fontWeight: 500,
            letterSpacing: AW_LETTER.headline,
            lineHeight: 1.05,
            textWrap: "balance",
            marginBottom: 10,
          }}
        >
          {phase.label}
        </motion.h2>
      </AnimatePresence>

      {/* Seam divider — replaces the old linear-gradient hairline. */}
      <ArchioSeam accent={accent} reduced={reduced} />

      {/* Body prose. */}
      <p
        className="font-sans"
        style={{
          fontSize: AW_SIZE.focusBodySize,
          color: VANTARY.paper,
          lineHeight: 1.6,
          fontWeight: 400,
          letterSpacing: AW_LETTER.body,
          marginTop: 14,
          textWrap: "pretty",
        }}
      >
        {phase.focusNow}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <WhyExpectPair/>  ·  C-6 · two-cell reasoning grid
 *  ───────────────────────────────────────────────────────────────────────
 *  No outer border. No middle divider. Just 24px horizontal gap. Each
 *  cell's eyebrow sits at the top with a micro-seam underneath that
 *  breathes 40↔56px width every 4 seconds. Hover grows the micro-seam
 *  to 88px and ramps text color from paperDim → paper.
 *
 *  WHY body rotates between tactical (focusWhy) and psychological
 *  (focusPsych from AW_BODY_PSYCH) framings on the LIVE phase only,
 *  every 14 seconds. EXPECT does not rotate — it's already concrete.
 * ─────────────────────────────────────────────────────────────────────── */
function WhyExpectPair({
  phase,
  accent,
  reduced,
  isLivePhase,
}: {
  phase: MicroPhaseLite
  accent: string
  reduced: boolean
  isLivePhase: boolean
}) {
  const psych = AW_BODY_PSYCH[phase.id]
  const whyVariants = isLivePhase && psych
    ? [
        <span key="tactical">{phase.focusWhy}</span>,
        <span key="psych" style={{ fontStyle: "italic", color: VANTARY.paperDim }}>{psych}</span>,
      ]
    : [<span key="tactical-only">{phase.focusWhy}</span>]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 26,
      }}
    >
      <ReasoningCell
        eyebrow="WHY"
        accent={accent}
        reduced={reduced}
        body={
          <ArchioRotatingLabel
            variants={whyVariants}
            cadence={AW_CADENCE.bodyRotation}
            reduced={reduced}
            keyPrefix={`why-${phase.id}`}
          />
        }
      />
      <ReasoningCell
        eyebrow="EXPECT"
        accent={accent}
        reduced={reduced}
        body={phase.expect}
      />
    </div>
  )
}

function ReasoningCell({
  eyebrow,
  accent,
  reduced,
  body,
}: {
  eyebrow: string
  accent: string
  reduced: boolean
  body: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <div className="flex items-center gap-2">
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

      {/* Breathing micro-seam under the eyebrow. */}
      <motion.span
        aria-hidden
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
          opacity: 0.6,
          willChange: "width",
        }}
        animate={
          reduced
            ? { width: hovered ? AW_SIZE.microSeamHoverW : AW_SIZE.microSeamIdleW }
            : hovered
              ? { width: AW_SIZE.microSeamHoverW }
              : {
                  width: [
                    AW_SIZE.microSeamIdleW,
                    AW_SIZE.microSeamIdleW + 16,
                    AW_SIZE.microSeamIdleW,
                  ],
                }
        }
        transition={
          hovered
            ? { duration: 0.22, ease: AW_EASE.aw }
            : { duration: AW_CADENCE.whyExpectSeam, ease: "easeInOut", repeat: Infinity }
        }
      />

      <motion.p
        className="font-sans"
        animate={{ color: hovered ? VANTARY.paper : VANTARY.paperDim }}
        transition={{ duration: AW_DUR.contentFade, ease: AW_EASE.aw }}
        style={{
          fontSize: AW_SIZE.whyExpectSize,
          lineHeight: 1.6,
          textWrap: "pretty",
        }}
      >
        {body}
      </motion.p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  <MicroPhaseLadder/>  ·  C-7
 *  ───────────────────────────────────────────────────────────────────────
 *  Horizontal stepper. Single archio seam baseline; each phase is a label
 *  + a state-coded dot. Active = concentric ripple. Past = solid paperDim
 *  dot. Future = hollow ring. Clicking a phase slides the active indicator
 *  via shared `layoutId="aw-micro-active"`.
 * ─────────────────────────────────────────────────────────────────────── */
function MicroPhaseLadder({
  session,
  currentPhase,
  accent,
  reducedMotion,
  onPick,
}: {
  session: SessionDefLite
  currentPhase: MicroPhaseLite
  accent: string
  reducedMotion: boolean
  onPick: (p: MicroPhaseLite) => void
}) {
  const activeIdx = session.phases.findIndex((p) => p.id === currentPhase.id)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 2 }}>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: AW_LETTER.eyebrow,
            color: VANTARY.ashSoft,
            fontWeight: 500,
          }}
        >
          MICRO-PHASES
        </span>
        <span aria-hidden style={{ flex: 1 }}>
          <ArchioSeam accent={accent} reduced={reducedMotion} />
        </span>
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: AW_LETTER.numeric,
            color: VANTARY.ashSoft,
          }}
        >
          TAP TO STUDY
        </span>
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${session.phases.length}, minmax(0, 1fr))`,
          alignItems: "stretch",
          paddingTop: 6,
          paddingBottom: 6,
        }}
      >
        {/* Baseline seam behind the dots. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 8, right: 8, top: "50%",
            transform: "translateY(-50%)",
            height: 1,
            pointerEvents: "none",
            opacity: 0.5,
          }}
        >
          <ArchioSeam accent={accent} reduced={reducedMotion} />
        </div>

        {session.phases.map((p, i) => {
          const isActive = p.id === currentPhase.id
          const isPassed = activeIdx > i
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPick(p)}
              aria-pressed={isActive}
              className="relative flex flex-col items-center gap-2 focus:outline-none"
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 4px",
                cursor: "pointer",
              }}
            >
              <span style={{ position: "relative", height: AW_SIZE.microPhaseDot, display: "flex", alignItems: "center" }}>
                {isActive && (
                  <motion.span
                    layoutId="aw-micro-active"
                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: AW_DUR.layoutShift, ease: AW_EASE.aw }
                    }
                  >
                    <ArchioPulseDot
                      accent={accent}
                      size={AW_SIZE.microPhaseDot}
                      reduced={reducedMotion}
                    />
                  </motion.span>
                )}
                {!isActive && (
                  <span
                    aria-hidden
                    style={{
                      width: AW_SIZE.microPhaseDot,
                      height: AW_SIZE.microPhaseDot,
                      borderRadius: "50%",
                      background: isPassed ? VANTARY.paperDim : "transparent",
                      border: isPassed ? "none" : `1.5px solid ${VANTARY.ash}`,
                      opacity: isPassed ? 0.7 : 0.4,
                    }}
                  />
                )}
              </span>
              <span
                className="font-mono uppercase tabular-nums whitespace-nowrap"
                style={{
                  fontSize: AW_SIZE.microPhaseLabel,
                  letterSpacing: "0.22em",
                  color: isActive ? accent : isPassed ? VANTARY.paperDim : VANTARY.ashSoft,
                  fontWeight: isActive ? 500 : 400,
                  textAlign: "center",
                  transition: "color 200ms",
                }}
              >
                {p.shortLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
