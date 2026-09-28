"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · INTEL BRAIN  (EPIC C)
 *  ─────────────────────────────────────────────────────────────────────────
 *  This file ships the four INTEL slabs that mount under <OsCommandHeader/>:
 *
 *      ┌── OsCommandHeader ───────────────────────────────────────┐
 *      │  eyebrow · ring · OPTIMAL chip · sentence · alert       │
 *      │  4 nerve cards · MIRROR/RULES/EXPOSURE/DNA tab strip    │
 *      └── OsIntelBay (this file) ───────────────────────────────┘
 *      │  toolbar · WEEK CAPITAL LENS · ASK COPILOT · COPY       │
 *      │  ┌─ active slab (one of 4) ──────────────────────────┐  │
 *      │  │ MirrorIntel  | RulesIntel | ExposureIntel | DNA   │  │
 *      │  └────────────────────────────────────────────────────┘  │
 *      │  cross-section drilldown ribbons                          │
 *      └─────────────────────────────────────────────────────────┘
 *
 *  EPICs D, E, F, G will replace each first-pass slab with its full
 *  fidelity port. The bay container, the toolbar, the slab shell, the
 *  drilldown ribbons, and the lens overlay machinery defined in *this*
 *  file will remain — those subsequent epics swap out only the per-slab
 *  body content.
 *
 *  Editorial language
 *  ──────────────────
 *  · hairlines · no soft corners · mono-caps eyebrows
 *  · amber/paper/ash/rule via OS_TONE → VANTARY (no purple, no emerald)
 *  · all motion gated by useReducedMotion()
 *  · all numeric values tabular
 *  · every interactive element has focus-visible + keyboard map
 *
 *  Cross-cutting affordances
 *  ─────────────────────────
 *  · WEEK CAPITAL LENS — tinted overlay of weekly P&L on Mirror + Exposure
 *  · ASK COPILOT       — opens the existing CommandPalette pre-filled
 *  · COPY READOUT      — emits a prose summary to clipboard
 * ═══════════════════════════════════════════════════════════════════════ */

import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  ChevronDown,
  Sparkles,
  Copy,
  Check,
  ArrowDownRight,
  Eye,
  Shield,
  Target,
  Crosshair,
  AlertTriangle,
} from "lucide-react"

import { useStrategyOs }    from "./provider"
import {
  OsTabKey,
  OsSectionId,
  RuleCommitment,
  CapitalSlice,
  OS_BREACH_THRESHOLD,
  OS_INVIOLABLE_THRESHOLD,
} from "./data"
import { DisciplineMirror }     from "./mirror"
import { RuleCommitments }      from "./rules"
import { CapitalExposureMap }   from "./exposure"
import { ExecutionDnaProfile }  from "./dna"

/* ═══════════════════════════════════════════════════════════════════════════
 *  Local style helpers
 * ═══════════════════════════════════════════════════════════════════════ */

/** mono-caps eyebrow text — used everywhere */
const eyebrowStyle = (color: string, size = 9): React.CSSProperties => ({
  fontSize:      size,
  letterSpacing: "0.24em",
  color,
  fontWeight:    500,
  lineHeight:    1.1,
})

/** the editorial "stations" gridTemplateColumns — 7 equal-width day cells */
const SEVEN_COLS = "repeat(7, 1fr)"

const DOW_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const
/** dow index used by the OS state (0..6 where 0 = MON) */
type OsDow = 0 | 1 | 2 | 3 | 4 | 5 | 6

/* ═══════════════════════════════════════════════════════════════════════════
 *  TOOLBAR  ·  the row above the active slab
 *  ─────────────────────────────────────────────────────────────────────────
 *  Three buttons:
 *    LENS · WEEK CAPITAL    pill toggle, lights amber when on
 *    ASK COPILOT            opens the CommandPalette (window event)
 *    COPY READOUT           copies a prose summary to clipboard
 *
 *  Plus a left-side eyebrow that names the active slab so the user always
 *  knows where they are even if the tab strip scrolls out of view.
 * ═══════════════════════════════════════════════════════════════════════ */
function Toolbar({
  activeTab,
  onAskCopilot,
}: {
  activeTab: OsTabKey
  onAskCopilot: () => void
}) {
  const { state, actions, palette, toneMap } = useStrategyOs()
  const lensOn = state.lensWeekCapital
  const reduce = useReducedMotion()

  return (
    <div
      className="flex items-center flex-wrap gap-x-4 gap-y-2"
      style={{
        paddingBottom: 12,
        borderBottom:  `1px dashed ${palette.rule}`,
      }}
    >
      {/* — left: active-slab breadcrumb — */}
      <div className="flex items-baseline gap-2">
        <span style={eyebrowStyle(palette.ashSoft)}>OS · INTEL</span>
        <span aria-hidden style={{ width: 12, height: 1, background: palette.rule }} />
        <span
          className="font-mono uppercase tabular-nums"
          style={eyebrowStyle(palette.paper, 10)}
        >
          {activeTab}
        </span>
      </div>

      {/* — right: pill row — */}
      <div className="flex items-center gap-2 ml-auto">
        {/* WEEK CAPITAL LENS toggle */}
        <button
          type="button"
          onClick={actions.toggleLensWeekCapital}
          className="font-mono uppercase tabular-nums inline-flex items-center gap-1.5 transition-colors"
          aria-pressed={lensOn}
          style={{
            fontSize:      9.5,
            letterSpacing: "0.24em",
            color:         lensOn ? toneMap.optimal : palette.ashSoft,
            border:        `1px solid ${lensOn ? toneMap.optimal : palette.rule}`,
            background:    lensOn ? toneMap.flow : "transparent",
            padding:       "5px 10px",
            cursor:        "pointer",
          }}
        >
          <span
            aria-hidden
            style={{
              width:        4,
              height:       4,
              borderRadius: 99,
              background:   lensOn ? toneMap.optimal : palette.ashSoft,
              boxShadow:    lensOn && !reduce
                ? `0 0 6px ${toneMap.optimal}`
                : "none",
            }}
          />
          LENS · WEEK CAPITAL
        </button>

        {/* ASK COPILOT */}
        <button
          type="button"
          onClick={onAskCopilot}
          className="font-mono uppercase tabular-nums inline-flex items-center gap-1.5 transition-colors hover:text-paper"
          style={{
            fontSize:      9.5,
            letterSpacing: "0.24em",
            color:         palette.ashSoft,
            border:        `1px solid ${palette.rule}`,
            padding:       "5px 10px",
            cursor:        "pointer",
            background:    "transparent",
          }}
        >
          <Sparkles size={11} strokeWidth={1.5} aria-hidden />
          ASK COPILOT
        </button>

        {/* COPY READOUT */}
        <CopyReadoutButton activeTab={activeTab} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  COPY READOUT  ·  emits a prose summary of the active slab to clipboard
 * ═══════════════════════════════════════════════════════════════════════ */
function CopyReadoutButton({ activeTab }: { activeTab: OsTabKey }) {
  const { state, palette } = useStrategyOs()
  const [copied, setCopied] = useState(false)

  const buildReadout = useCallback((): string => {
    const { derived, rules, capital } = state
    const head =
      `STRATEGY OS · ${activeTab.toUpperCase()} READOUT  ` +
      `(plan: ${state.plans[state.planIndex].label})`

    if (activeTab === "mirror") {
      return [
        head,
        `Discipline ${derived.disciplineScore}, posture ${derived.posture}.`,
        `Intended ${derived.mirror.intentVsAction.intended}% vs actual ` +
          `${derived.mirror.intentVsAction.actual}%.`,
        `Breached ${derived.breachedRuleIds.length} of ${rules.length} rules.`,
      ].join("\n")
    }
    if (activeTab === "rules") {
      const lines = rules.map(
        (r) =>
          `· ${r.rule} — ${r.adherence}% (${r.streak}d streak, ` +
          `${r.violations} breaches)`,
      )
      return [head, ...lines].join("\n")
    }
    if (activeTab === "exposure") {
      const top = capital.bySymbol[0]
      return [
        head,
        `Dominant currency ${capital.dominantCurrency.code} at ` +
          `${Math.round(capital.dominantCurrency.weight * 100)}%.`,
        `Top symbol ${top?.label} at ` +
          `${Math.round((top?.pct ?? 0) * 100)}% of total.`,
        capital.suggestion,
      ].join("\n")
    }
    // dna
    const dna = state.derived
    return [
      head,
      `Archetype ${dna.archetypeLabel}, EXEC PATIENCE ` +
        `${Math.round(dna.execPatiencePct * 100)}%.`,
      `Limit ratio ${(dna.mirror.limitRatio * 100).toFixed(0)}%.`,
    ].join("\n")
  }, [state, activeTab])

  const handle = useCallback(() => {
    const txt = buildReadout()
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(txt)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }, [buildReadout])

  return (
    <button
      type="button"
      onClick={handle}
      className="font-mono uppercase tabular-nums inline-flex items-center gap-1.5 transition-colors hover:text-paper"
      style={{
        fontSize:      9.5,
        letterSpacing: "0.24em",
        color:         copied ? palette.amber : palette.ashSoft,
        border:        `1px solid ${copied ? palette.amberHalo : palette.rule}`,
        padding:       "5px 10px",
        cursor:        "pointer",
        background:    "transparent",
      }}
    >
      {copied ? (
        <Check size={11} strokeWidth={2} aria-hidden />
      ) : (
        <Copy size={11} strokeWidth={1.5} aria-hidden />
      )}
      {copied ? "COPIED" : "COPY READOUT"}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  SLAB SHELL  ·  the reusable wrapper for each INTEL slab
 *  ─────────────────────────────────────────────────────────────────────────
 *  Wraps the slab body with:
 *    · click-to-collapse eyebrow row (chevron, label, optional badge)
 *    · hairline border, no soft corners
 *    · animated height collapse
 *    · the slab's `iconKey` resolves to a lucide icon
 *
 *  The collapsed/expanded state is held in `state.openSections` so the
 *  user's choice survives tab switches.
 * ═══════════════════════════════════════════════════════════════════════ */
const SECTION_ICONS = {
  "section-mirror":   Eye,
  "section-rules":    Shield,
  "section-exposure": Target,
  "section-dna":      Crosshair,
} as const

function OsIntelSlab({
  sectionId,
  label,
  badge,
  children,
}: {
  sectionId: OsSectionId
  label:     string
  badge?:    React.ReactNode
  children:  React.ReactNode
}) {
  const { selectors, actions, palette } = useStrategyOs()
  const open = selectors.isSectionOpen(sectionId)
  const reduce = useReducedMotion()
  const Icon = SECTION_ICONS[sectionId]

  return (
    <section
      aria-label={label}
      style={{
        border:     `1px solid ${palette.rule}`,
        background: "transparent",
      }}
    >
      <button
        type="button"
        onClick={() => actions.toggleSection(sectionId)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 transition-colors"
        style={{
          padding:    "12px 16px",
          background: open ? palette.amberWash : "transparent",
          borderBottom: open ? `1px solid ${palette.rule}` : "none",
          cursor:     "pointer",
        }}
      >
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: [0.65, 0, 0.35, 1] }}
          style={{ display: "inline-flex" }}
        >
          <ChevronDown
            size={13}
            strokeWidth={1.5}
            color={palette.ashSoft}
            aria-hidden
          />
        </motion.span>
        <Icon size={13} strokeWidth={1.5} color={palette.ashSoft} aria-hidden />
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      11,
            letterSpacing: "0.22em",
            color:         palette.paper,
            fontWeight:    500,
          }}
        >
          {label}
        </span>
        {badge && <span className="ml-auto">{badge}</span>}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="slab-body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.34, ease: [0.65, 0, 0.35, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: 18 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ══════════���════════════════════════════════════════════════════════════════
 *  C2 · MIRROR INTEL  ·  deferred to <DisciplineMirror/> (EPIC D)
 *  ────────────────────────────────────────────��────────────────────────────
 *  EPIC D shipped the full-fidelity port. This wrapper exists only so
 *  the original first-pass body code below remains as a fallback (under
 *  `MirrorIntelFirstPass`) — it is no longer rendered. The active body
 *  is the deep mirror imported from ./mirror.
 * ═══════════════════════════════════════════════════════════════════════ */
const MirrorIntel = memo(function MirrorIntel() {
  return <DisciplineMirror />
})

/* The original first-pass body, kept around as `MirrorIntelFirstPass` for
 * reference and as a dev-only fallback. Not exported from this file. */
const MirrorIntelFirstPass = memo(function MirrorIntelFirstPass() {
  const { state, selectors, actions, palette, toneMap } = useStrategyOs()
  const { mirror }  = state.derived
  const reduce      = useReducedMotion()
  const lensOn      = state.lensWeekCapital
  const intended    = mirror.intentVsAction.intended / 100
  // Per-day capital share for the LENS overlay
  const lensByDow   = useMemo(() => {
    const map = new Map<OsDow, number>()
    for (const slice of state.capital.byDay) {
      const idx = DOW_LABELS.findIndex((d) => slice.label.toUpperCase().startsWith(d))
      if (idx >= 0) map.set(idx as OsDow, slice.pct)
    }
    return map
  }, [state.capital.byDay])

  return (
    <div className="flex flex-col gap-4">
      {/* — eyebrow line — */}
      <div className="flex items-center gap-3">
        <span style={eyebrowStyle(palette.ashSoft)}>WEEKLY ADHERENCE</span>
        <span aria-hidden style={{ flex: 1, height: 1, background: palette.rule, opacity: 0.5 }} />
        <span
          className="font-mono uppercase tabular-nums"
          style={eyebrowStyle(palette.amber, 9)}
        >
          INTENDED {Math.round(intended * 100)}%
        </span>
        <span aria-hidden style={{ width: 1, height: 10, background: palette.rule }} />
        <span
          className="font-mono uppercase tabular-nums"
          style={eyebrowStyle(palette.paper, 9)}
        >
          ACTUAL {mirror.intentVsAction.actual}%
        </span>
      </div>

      {/* — 7 vertical bars — */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: SEVEN_COLS,
          gap: 6,
          alignItems: "end",
          height: 132,
        }}
        role="list"
        aria-label="Weekly discipline adherence by day of week"
      >
        {DOW_LABELS.map((label, idx) => {
          const adh = selectors.adherenceOnDay(idx)
          const breach = selectors.isDowBreach(idx)
          const selected = selectors.isDowSelected(idx)
          const lensPct = lensByDow.get(idx as OsDow) ?? 0

          return (
            <button
              key={label}
              type="button"
              role="listitem"
              onClick={() => actions.selectDow(idx)}
              onMouseEnter={() => actions.selectDow(idx)}
              onMouseLeave={() => actions.selectDow(null)}
              className="relative flex flex-col items-stretch focus:outline-none"
              style={{
                height:     "100%",
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                padding:    0,
              }}
              aria-label={`${label} adherence ${Math.round(adh * 100)}%`}
            >
              {/* track */}
              <div
                className="relative flex-1"
                style={{
                  border:     `1px solid ${selected ? palette.amberHalo : palette.rule}`,
                  background: selected ? palette.amberWash : "transparent",
                }}
              >
                {/* INTENDED dashed line */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0"
                  style={{
                    bottom:      `${intended * 100}%`,
                    height:      0,
                    borderTop:   `1px dashed ${palette.amberHalo}`,
                    opacity:     0.7,
                  }}
                />
                {/* ACTUAL fill */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{ height: `${adh * 100}%` }}
                  transition={{
                    duration: reduce ? 0 : 0.46,
                    ease:     [0.65, 0, 0.35, 1],
                    delay:    reduce ? 0 : idx * 0.04,
                  }}
                  style={{
                    position:  "absolute",
                    left:      0,
                    right:     0,
                    bottom:    0,
                    background: breach
                      ? `repeating-linear-gradient(0deg, ${palette.paperDim} 0, ${palette.paperDim} 1px, transparent 1px, transparent 4px)`
                      : toneMap.discipline,
                    opacity:    breach ? 0.55 : 0.85,
                  }}
                />
                {/* LENS overlay — capital share */}
                {lensOn && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position:    "absolute",
                      left:        0,
                      right:       0,
                      bottom:      0,
                      height:      `${lensPct * 100}%`,
                      background:  toneMap.flow,
                      borderTop:   `1px solid ${toneMap.optimal}`,
                      mixBlendMode: "screen",
                    }}
                  />
                )}
                {/* breach pip */}
                {breach && (
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      top:          4,
                      right:        4,
                      width:        4,
                      height:       4,
                      borderRadius: 99,
                      background:   palette.amber,
                      boxShadow:    `0 0 4px ${palette.amber}`,
                    }}
                  />
                )}
              </div>

              {/* dow label */}
              <span
                className="font-mono uppercase tabular-nums mt-1.5"
                style={{
                  fontSize:      9,
                  letterSpacing: "0.18em",
                  color:         selected ? palette.paper : palette.ashSoft,
                  textAlign:     "center",
                }}
              >
                {label}
              </span>
              {/* adherence number */}
              <span
                className="font-mono tabular-nums mt-0.5"
                style={{
                  fontSize:  10,
                  color:     selected ? palette.amber : palette.ashSoft,
                  textAlign: "center",
                }}
              >
                {Math.round(adh * 100)}
              </span>
            </button>
          )
        })}
      </div>

      {/* — caption — */}
      <p
        className="font-sans"
        style={{
          fontSize: 12.5,
          color:    palette.ashSoft,
          margin:   0,
        }}
      >
        Intended is the line you swore to hold. Actual is what your trades say
        you actually held. The gap is the discipline tax.
      </p>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
 *  C3 · RULES INTEL  ·  deferred to <RuleCommitments/> (EPIC E)
 *  ─────────────────────────────────────────────────────────────────────────
 *  EPIC E shipped the full RuleCommitments deck (toolbar · sort menu ·
 *  category chips · search · adherence rings · 7-dot history · streak +
 *  best · in-place expansion · AddRule picker · prose verdict footer ·
 *  markdown copy-out). The original first-pass list-and-row is kept
 *  alongside as `RulesIntelFirstPass` for reference / dev fallback.
 * ═══════════════════════════════════════════════════════════════════════ */
const RulesIntel = memo(function RulesIntel() {
  return <RuleCommitments />
})

const RulesIntelFirstPass = memo(function RulesIntelFirstPass() {
  const { state, selectors, actions, palette } = useStrategyOs()
  return (
    <div className="flex flex-col">
      {state.rules.map((r, i) => (
        <RuleRow
          key={r.id}
          rule={r}
          isFirst={i === 0}
          expanded={selectors.isRuleExpanded(r.id)}
          flashing={selectors.isRuleFlashing(r.id)}
          onToggle={() => actions.toggleRule(r.id)}
          palette={palette}
        />
      ))}
    </div>
  )
})

function RuleRow({
  rule,
  isFirst,
  expanded,
  flashing,
  onToggle,
  palette,
}: {
  rule:     RuleCommitment
  isFirst:  boolean
  expanded: boolean
  flashing: boolean
  onToggle: () => void
  palette:  ReturnType<typeof useStrategyOs>["palette"]
}) {
  const reduce = useReducedMotion()
  const breached   = rule.adherence < OS_BREACH_THRESHOLD
  const inviolable = rule.adherence >= OS_INVIOLABLE_THRESHOLD

  return (
    <div
      style={{
        borderTop: isFirst ? "none" : `1px dashed ${palette.rule}`,
        background: flashing ? palette.amberWash : "transparent",
        transition: "background 220ms ease",
      }}
    >
      {/* header row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full grid items-center"
        style={{
          gridTemplateColumns: "auto 1fr auto auto auto",
          gap:        14,
          padding:    "12px 4px",
          background: "transparent",
          border:     "none",
          cursor:     "pointer",
          textAlign:  "left",
        }}
      >
        {/* status pip */}
        <span
          aria-hidden
          style={{
            width:        7,
            height:       7,
            borderRadius: 99,
            border:       inviolable ? `1px solid ${palette.amber}` : "none",
            background:   inviolable
              ? "transparent"
              : breached
                ? palette.paperDim
                : palette.amber,
            boxShadow:    !breached && !inviolable && !reduce
              ? `0 0 5px ${palette.amberHalo}`
              : "none",
          }}
        />

        {/* rule text */}
        <span
          className="font-sans truncate"
          style={{
            fontSize:    13.5,
            color:       palette.paper,
            fontWeight:  500,
            letterSpacing: "-0.005em",
          }}
        >
          {rule.rule}
        </span>

        {/* 7-dot history */}
        <span className="flex items-center gap-1">
          {rule.weeklyHistory.map((h, i) => (
            <span
              key={i}
              aria-hidden
              style={{
                width:        4,
                height:       4,
                borderRadius: 99,
                background:   h ? palette.amber : palette.rule,
                opacity:      h ? 1 : 0.7,
              }}
            />
          ))}
        </span>

        {/* adherence */}
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize:   13,
            color:      breached ? palette.paperDim : palette.amber,
            fontWeight: 500,
            minWidth:   38,
            textAlign:  "right",
          }}
        >
          {rule.adherence}%
        </span>

        {/* streak chip */}
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize:      9,
            letterSpacing: "0.18em",
            color:         palette.ashSoft,
            border:        `1px solid ${palette.rule}`,
            padding:       "2px 6px",
            minWidth:      54,
            textAlign:     "center",
          }}
        >
          {rule.streak}D · {rule.bestStreak}B
        </span>
      </button>

      {/* expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="rule-body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.65, 0, 0.35, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "1fr",
                paddingLeft: 22,
                paddingRight: 4,
                paddingBottom: 16,
                paddingTop: 4,
              }}
            >
              {/* teaching */}
              <RuleBodyBlock
                eyebrow="THE WHY"
                body={rule.teaching}
                tone="paper"
                palette={palette}
              />
              {/* impact when followed / broken */}
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                <RuleBodyBlock
                  eyebrow="WHEN HONORED"
                  body={rule.impactWhenFollowed}
                  tone="amber"
                  palette={palette}
                />
                <RuleBodyBlock
                  eyebrow="WHEN BROKEN"
                  body={rule.impactWhenBroken}
                  tone="paperDim"
                  palette={palette}
                />
              </div>
              {/* violation log */}
              {rule.violationLog.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle
                      size={11}
                      strokeWidth={1.5}
                      color={palette.ashSoft}
                      aria-hidden
                    />
                    <span style={eyebrowStyle(palette.ashSoft)}>
                      VIOLATION LOG · {rule.violationLog.length}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {rule.violationLog.map((v, i) => (
                      <li
                        key={i}
                        className="grid items-baseline"
                        style={{
                          gridTemplateColumns: "auto 1fr",
                          gap:    10,
                          padding: "6px 0",
                          borderTop: i === 0 ? "none" : `1px dotted ${palette.rule}`,
                        }}
                      >
                        <span
                          className="font-mono uppercase tabular-nums"
                          style={{
                            fontSize:      9.5,
                            letterSpacing: "0.18em",
                            color:         palette.ashSoft,
                            minWidth:      72,
                          }}
                        >
                          {v.date}
                        </span>
                        <span
                          className="font-sans"
                          style={{
                            fontSize: 12,
                            color:    palette.paperDim,
                          }}
                        >
                          {v.context}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function RuleBodyBlock({
  eyebrow,
  body,
  tone,
  palette,
}: {
  eyebrow: string
  body:    string
  tone:    "amber" | "paper" | "paperDim"
  palette: ReturnType<typeof useStrategyOs>["palette"]
}) {
  const color =
    tone === "amber"
      ? palette.amber
      : tone === "paperDim"
        ? palette.paperDim
        : palette.paper
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span
          aria-hidden
          style={{
            width:  10,
            height: 1,
            background: color,
            opacity:    0.6,
          }}
        />
        <span style={eyebrowStyle(color)}>{eyebrow}</span>
      </div>
      <p
        className="font-sans"
        style={{
          fontSize:   12.5,
          color:      tone === "paper" ? palette.paper : palette.ashSoft,
          margin:     0,
          lineHeight: 1.55,
        }}
      >
        {body}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  C4 · EXPOSURE INTEL  ·  deferred to <CapitalExposureMap/> (EPIC F)
 *  ─────────────────────────────────────────────────────────────────────────
 *  EPIC F shipped the full Capital-of-Week map: dominant-currency chip,
 *  correlation-risk badge, three strata (SYMBOL · SESSION · DAY) with
 *  hover-to-isolate, drill-in symbol sparklines, suggestion engine,
 *  net-USD-exposure pill, R-per-killzone breakdown, and the LEFT-card
 *  week-grid mirror beneath. First pass remains as `ExposureIntelFirstPass`.
 * ═══════════════════════════════════════════════════════════════════════ */
const ExposureIntel = memo(function ExposureIntel() {
  return <CapitalExposureMap />
})

const ExposureIntelFirstPass = memo(function ExposureIntelFirstPass() {
  const { state, palette, toneMap } = useStrategyOs()
  const { capital } = state
  const reduce = useReducedMotion()
  const [hoveredSliceId, setHoveredSliceId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-5">
      {/* — head row: dominant currency + correlation — */}
      <div className="flex items-center flex-wrap gap-3">
        <div
          className="flex items-baseline gap-2"
          style={{
            border:  `1px solid ${palette.amberHalo}`,
            background: palette.amberWash,
            padding: "6px 10px",
          }}
        >
          <span style={eyebrowStyle(palette.ashSoft, 9)}>DOMINANT</span>
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize:   16,
              color:      palette.amber,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            {capital.dominantCurrency.code}
          </span>
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize: 11,
              color:    palette.ashSoft,
            }}
          >
            {Math.round(capital.dominantCurrency.weight * 100)}%
          </span>
        </div>

        {capital.correlationRisk && (
          <div
            className="flex items-center gap-1.5"
            style={{
              border: `1px solid ${palette.rule}`,
              padding: "6px 10px",
            }}
          >
            <AlertTriangle
              size={11}
              strokeWidth={1.5}
              color={palette.amber}
              aria-hidden
            />
            <span style={eyebrowStyle(palette.paper, 9.5)}>
              CORRELATION RISK
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2 ml-auto">
          <span style={eyebrowStyle(palette.ashSoft, 9)}>WEEK NET</span>
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize:   13,
              color:      capital.totalPl >= 0 ? palette.amber : palette.paperDim,
              fontWeight: 500,
            }}
          >
            {capital.totalPl >= 0 ? "+" : ""}
            ${Math.round(capital.totalPl)}
          </span>
          <span aria-hidden style={{ width: 1, height: 11, background: palette.rule }} />
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 11, color: palette.ashSoft }}
          >
            {capital.totalR.toFixed(1)}R
          </span>
        </div>
      </div>

      {/* — three strata — */}
      <div className="flex flex-col gap-4">
        <Stratum
          title="SYMBOL"
          slices={capital.bySymbol}
          hoveredSliceId={hoveredSliceId}
          onHover={setHoveredSliceId}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
        <Stratum
          title="SESSION"
          slices={capital.bySession}
          hoveredSliceId={hoveredSliceId}
          onHover={setHoveredSliceId}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
        <Stratum
          title="DAY"
          slices={capital.byDay}
          hoveredSliceId={hoveredSliceId}
          onHover={setHoveredSliceId}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
      </div>

      {/* — suggestion — */}
      <div
        className="flex items-start gap-2"
        style={{
          borderTop: `1px dashed ${palette.rule}`,
          paddingTop: 12,
        }}
      >
        <ArrowDownRight
          size={14}
          strokeWidth={1.5}
          color={palette.amber}
          aria-hidden
          style={{ marginTop: 2 }}
        />
        <p
          className="font-sans"
          style={{
            fontSize:   13,
            color:      palette.paper,
            margin:     0,
            lineHeight: 1.5,
          }}
        >
          <span style={{ ...eyebrowStyle(palette.ashSoft), marginRight: 8 }}>
            SUGGESTION
          </span>
          {capital.suggestion}
        </p>
      </div>
    </div>
  )
})

function Stratum({
  title,
  slices,
  hoveredSliceId,
  onHover,
  palette,
  toneMap,
  reduce,
}: {
  title:          string
  slices:         CapitalSlice[]
  hoveredSliceId: string | null
  onHover:        (id: string | null) => void
  palette:        ReturnType<typeof useStrategyOs>["palette"]
  toneMap:        ReturnType<typeof useStrategyOs>["toneMap"]
  reduce:         boolean
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span style={eyebrowStyle(palette.ashSoft)}>{title}</span>
        <span aria-hidden style={{ flex: 1, height: 1, background: palette.rule, opacity: 0.5 }} />
      </div>
      <div
        className="flex w-full"
        style={{
          height: 26,
          border: `1px solid ${palette.rule}`,
          background: palette.amberWash,
        }}
      >
        {slices.map((s, i) => {
          const dimmed = hoveredSliceId !== null && hoveredSliceId !== s.id
          return (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(s.id)}
              onBlur={() => onHover(null)}
              className="relative flex items-center justify-center transition-all"
              style={{
                flexBasis:  `${s.pct * 100}%`,
                background: i % 2 === 0 ? toneMap.discipline : palette.paper,
                opacity:    dimmed ? 0.18 : 1,
                borderLeft: i === 0 ? "none" : `1px solid ${palette.rule}`,
                cursor:     "pointer",
                border:     "none",
                padding:    0,
              }}
              aria-label={`${s.label} ${(s.pct * 100).toFixed(1)}% of ${title}`}
              title={`${s.label} · ${(s.pct * 100).toFixed(1)}% · ${
                s.pl >= 0 ? "+" : ""
              }$${s.pl.toFixed(0)}`}
            >
              {s.pct > 0.08 && (
                <span
                  className="font-mono uppercase tabular-nums"
                  style={{
                    fontSize:      9,
                    letterSpacing: "0.18em",
                    color:         i % 2 === 0 ? palette.ink : palette.ink,
                    fontWeight:    500,
                    mixBlendMode:  "luminosity",
                  }}
                >
                  {s.label}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {/* sub-row: detail of hovered slice */}
      {hoveredSliceId !== null && (
        <SliceDetail
          slice={slices.find((s) => s.id === hoveredSliceId) ?? null}
          palette={palette}
          reduce={reduce}
        />
      )}
    </div>
  )
}

function SliceDetail({
  slice,
  palette,
  reduce,
}: {
  slice:   CapitalSlice | null
  palette: ReturnType<typeof useStrategyOs>["palette"]
  reduce:  boolean
}) {
  if (!slice) return null
  return (
    <motion.div
      key={slice.id}
      initial={reduce ? false : { opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex items-baseline gap-3 mt-1.5"
    >
      <span style={eyebrowStyle(palette.amber, 9)}>{slice.label}</span>
      <span
        className="font-mono tabular-nums"
        style={{ fontSize: 11, color: palette.paper }}
      >
        {(slice.pct * 100).toFixed(1)}%
      </span>
      <span aria-hidden style={{ width: 1, height: 9, background: palette.rule }} />
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize: 11,
          color:    slice.pl >= 0 ? palette.amber : palette.paperDim,
        }}
      >
        {slice.pl >= 0 ? "+" : ""}${slice.pl.toFixed(0)}
      </span>
      <span aria-hidden style={{ width: 1, height: 9, background: palette.rule }} />
      <span
        className="font-mono tabular-nums"
        style={{ fontSize: 11, color: palette.ashSoft }}
      >
        {slice.rMultiple.toFixed(1)}R · {slice.trades} trades
      </span>
      {slice.detail && (
        <>
          <span aria-hidden style={{ width: 1, height: 9, background: palette.rule }} />
          <span
            className="font-sans italic"
            style={{ fontSize: 11.5, color: palette.ashSoft }}
          >
            {slice.detail}
          </span>
        </>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  C5 · DNA INTEL  ·  deferred to <ExecutionDnaProfile/> (EPIC G)
 *  ─────────────────────────────────────────────────────────────────────────
 *  EPIC G shipped the full DNA profile: archetype banner, entry-mix
 *  hairline strip, patience tier ladder, current-position pip,
 *  impatience-cost ledger, axis micrometers, next-tier requirement
 *  copy, evolution arc, verdict footer. First pass remains as
 *  `DnaIntelFirstPass` for reference / dev fallback.
 * ═══════════════════════════════════════════════════════════════════════ */
const PATIENCE_TIERS = ["REACTOR", "HYBRID", "SNIPER"] as const
type PatienceTier = (typeof PATIENCE_TIERS)[number]

const DnaIntel = memo(function DnaIntel() {
  return <ExecutionDnaProfile />
})

const DnaIntelFirstPass = memo(function DnaIntelFirstPass() {
  const { state, palette, toneMap } = useStrategyOs()
  const { mirror, archetypeLabel, execPatiencePct } = state.derived
  const reduce = useReducedMotion()
  const totalEntries = state.data.entryMix.reduce((s, m) => s + m.value, 0) || 1
  const limitRatio   = mirror.limitRatio
  // Map archetype to a 0..1 ladder position
  const ladderPos =
    archetypeLabel === "REACTOR"
      ? 0.16
      : archetypeLabel === "HYBRID"
        ? 0.5
        : 0.84

  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
    >
      {/* — ENTRY MIX — */}
      <div>
        <span style={eyebrowStyle(palette.ashSoft)}>ENTRY MIX</span>
        <div
          className="flex w-full mt-2"
          style={{ height: 18, border: `1px solid ${palette.rule}` }}
        >
          {state.data.entryMix.map((m, i) => {
            const pct = m.value / totalEntries
            const color =
              m.label === "limit"
                ? toneMap.discipline
                : m.label === "market"
                  ? palette.paperDim
                  : palette.paper
            return (
              <div
                key={m.label}
                title={`${m.label} · ${Math.round(pct * 100)}%`}
                style={{
                  flexBasis: `${pct * 100}%`,
                  background: color,
                  borderLeft: i === 0 ? "none" : `1px solid ${palette.rule}`,
                  opacity: m.label === "stop" ? 0.55 : 1,
                }}
              />
            )
          })}
        </div>
        <ul className="mt-2 grid gap-1" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          {state.data.entryMix.map((m) => (
            <li
              key={m.label}
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize:      9,
                letterSpacing: "0.18em",
                color:         palette.ashSoft,
              }}
            >
              {m.label}
              <br />
              <span
                className="font-mono tabular-nums"
                style={{
                  fontSize:   12,
                  color:      m.label === "limit" ? palette.amber : palette.paperDim,
                  fontWeight: 500,
                }}
              >
                {Math.round((m.value / totalEntries) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* — PATIENCE LADDER — */}
      <div>
        <span style={eyebrowStyle(palette.ashSoft)}>PATIENCE LADDER</span>
        <div
          className="relative mt-3"
          style={{
            height:     8,
            background: palette.amberWash,
            border:     `1px solid ${palette.rule}`,
          }}
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={{ left: `${ladderPos * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.65, 0, 0.35, 1] }}
            style={{
              position:    "absolute",
              top:         -3,
              width:       2,
              height:      14,
              background:  palette.amber,
              boxShadow:   `0 0 6px ${palette.amber}`,
              transform:   "translateX(-1px)",
            }}
          />
        </div>
        <div
          className="grid mt-1.5"
          style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          {PATIENCE_TIERS.map((t) => {
            const isCurrent = t === archetypeLabel
            return (
              <span
                key={t}
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize:      9,
                  letterSpacing: "0.18em",
                  color:         isCurrent ? palette.amber : palette.ashSoft,
                  textAlign:
                    t === "REACTOR" ? "left" : t === "SNIPER" ? "right" : "center",
                }}
              >
                {t}
              </span>
            )
          })}
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize:   18,
              color:      palette.amber,
              fontWeight: 500,
            }}
          >
            {Math.round(execPatiencePct * 100)}%
          </span>
          <span style={eyebrowStyle(palette.ashSoft)}>EXEC PATIENCE</span>
        </div>
      </div>

      {/* — ARCHETYPE — */}
      <div>
        <span style={eyebrowStyle(palette.ashSoft)}>ARCHETYPE</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span
            className="font-sans"
            style={{
              fontSize:    20,
              color:       palette.paper,
              fontWeight:  500,
              letterSpacing: "-0.01em",
            }}
          >
            {archetypeLabel}
          </span>
          <span style={eyebrowStyle(palette.amber, 10)}>
            {Math.round(limitRatio * 100)}% LIMIT
          </span>
        </div>
        <p
          className="font-sans mt-2"
          style={{
            fontSize:   12.5,
            color:      palette.ashSoft,
            margin:     "8px 0 0 0",
            lineHeight: 1.55,
          }}
        >
          {ARCHETYPE_BLURBS[archetypeLabel]}
        </p>
      </div>
    </div>
  )
})

const ARCHETYPE_BLURBS: Record<PatienceTier, string> = {
  REACTOR:
    "Quick on the button — most entries are market orders. Edge is responsiveness; risk is impatience.",
  HYBRID:
    "Mixed entry style — limits when prep was done, markets when conviction spikes. Stable but undifferentiated.",
  SNIPER:
    "Patient — entries are predominantly limit orders at predefined levels. Edge is selectivity.",
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  ACTIVE-SLAB SWITCH  ·  picks the right body for state.selectedTab
 * ═══════════════════════════════════════════════════════════════════════ */
function ActiveSlab() {
  const { state } = useStrategyOs()
  const tab = state.selectedTab
  // We render only the active tab to keep DOM size + motion costs down.
  // The previously-mounted slab is unmounted — its hover/expand state is
  // held by the OS reducer so it persists across switches.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.26, ease: [0.65, 0, 0.35, 1] }}
      >
        {tab === "mirror"   && <MirrorIntel />}
        {tab === "rules"    && <RulesIntel />}
        {tab === "exposure" && <ExposureIntel />}
        {tab === "dna"      && <DnaIntel />}
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CROSS-SECTION DRILLDOWN  ·  dotted hairline that connects related
 *  intel between the active slab and the LEFT-card week grid.
 *  ─────────────────────────────────────────────────────────────────────────
 *  Renders a thin vertical hairline dropping from below the active slab
 *  down toward the mounted week grid (which lives further up the page).
 *  When `state.selectedDow` is non-null and `state.lensWeekCapital` is
 *  on, the line lights amber. When neither, it is an inert dotted hint.
 *
 *  This is a visual breadcrumb only — the actual sync is via the OS
 *  context (already wired through actions.selectDow + selectors.isDowSelected).
 * ═══════════════════════════════════════════════════════════════════════ */
function DrilldownRibbon() {
  const { state, palette } = useStrategyOs()
  const armed = state.selectedDow !== null || state.lensWeekCapital
  return (
    <div
      aria-hidden
      className="flex items-center gap-2"
      style={{
        paddingTop:    14,
        paddingBottom: 4,
      }}
    >
      <span
        style={eyebrowStyle(armed ? palette.amber : palette.ashSoft, 9)}
      >
        {armed ? "LINKED · WEEK GRID" : "WEEK GRID · IDLE"}
      </span>
      <span
        style={{
          flex: 1,
          height: 0,
          borderTop: `1px dashed ${armed ? palette.amberHalo : palette.rule}`,
          opacity:   armed ? 0.85 : 0.5,
        }}
      />
      <span
        style={eyebrowStyle(armed ? palette.amber : palette.ashSoft, 9)}
      >
        {state.selectedDow !== null
          ? DOW_LABELS[state.selectedDow]
          : state.lensWeekCapital
            ? "LENS ON"
            : "—"}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  PUBLIC SURFACE  ·  <OsIntelBay/>
 *  ─────────────────────────────────────────────────────────────────────────
 *  The single export consumed by your-space.tsx. Renders:
 *    1. Toolbar (LENS / ASK COPILOT / COPY READOUT)
 *    2. Active slab (one of MIRROR / RULES / EXPOSURE / DNA)
 *    3. Drilldown ribbon
 *    4. Below: collapsible accordion of all 4 sections (the original
 *       screenshot pattern — RULE COMMITMENTS / CAPITAL EXPOSURE MAP /
 *       EXECUTION DNA PROFILE / THE DISCIPLINE MIRROR — each opens in
 *       place to the same body content the active tab renders, but in a
 *       persistent always-visible-until-collapsed mode).
 *
 *  The accordion below mirrors the screenshot's lower 4 chevron rows.
 *  EPICs D-G will deepen each per-section body; this file ships the
 *  shell + first-pass content.
 * ═══════════════════════════════════════════════════════════════════════ */

export function OsIntelBay() {
  const { state } = useStrategyOs()
  // `palette` is no longer needed here — the only reader was the
  // accordion's borderTop, which has been removed. Sub-components
  // continue to read `palette` directly via `useStrategyOs()`.

  const handleAskCopilot = useCallback(() => {
    if (typeof window === "undefined") return
    const evt = new CustomEvent("vantary:command-palette:open", {
      detail: { source: "strategy-os", topic: state.selectedTab },
    })
    window.dispatchEvent(evt)
  }, [state.selectedTab])

  /* ─── TRUE TAB NAVIGATION ─────────────────────────────────────
   *
   * The previous build mounted ALL FOUR sections (Mirror / Rules /
   * Exposure / DNA) as a stacked accordion below the active slab —
   * which produced the "I can scroll through Discipline Score into
   * Rules into Exposure into DNA" behaviour the trader explicitly
   * objected to. The accordion has been removed: clicking a tab now
   * navigates to that section EXCLUSIVELY, with the previous slab
   * unmounting and the new one fading in via `<ActiveSlab/>`'s
   * AnimatePresence wrapper.
   *
   * The `<DrilldownRibbon/>` is also removed — it was a redundant
   * cross-section breadcrumb that only made sense in the accordion
   * world. With true tabs, the active slab IS the breadcrumb. */
  return (
    <div
      className="flex flex-col gap-5"
      style={{ paddingTop: 16 }}
    >
      <Toolbar activeTab={state.selectedTab} onAskCopilot={handleAskCopilot} />

      <ActiveSlab />
    </div>
  )
}

/* The accordion mirrors the screenshot's lower 4 rows. Each row uses the
 * same OsIntelSlab shell. Note we render the body lazily inside each slab
 * so closed slabs cost ~nothing. */
function SectionAccordion() {
  return (
    <>
      <OsIntelSlab sectionId="section-mirror" label="THE DISCIPLINE MIRROR">
        <MirrorIntel />
      </OsIntelSlab>
      <OsIntelSlab sectionId="section-rules" label="RULE COMMITMENTS">
        <RulesIntel />
      </OsIntelSlab>
      <OsIntelSlab sectionId="section-exposure" label="CAPITAL EXPOSURE MAP">
        <ExposureIntel />
      </OsIntelSlab>
      <OsIntelSlab sectionId="section-dna" label="EXECUTION DNA PROFILE">
        <DnaIntel />
      </OsIntelSlab>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Re-exports for EPICs D–G (each will replace one slab body)
 * ═══════════════════════════════════════════════════════════════════════ */
export { MirrorIntel, RulesIntel, ExposureIntel, DnaIntel }
export { OsIntelSlab, Toolbar, DrilldownRibbon, CopyReadoutButton }

// Suppress dead-import lint until EPIC D ports the proper hook map
void useEffect
