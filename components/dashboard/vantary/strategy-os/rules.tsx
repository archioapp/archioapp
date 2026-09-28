"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS  ·  E · RULE COMMITMENTS
 *  ─────────────────────────────────────────────────────────────────────────
 *  Editorial RuleCard list with adherence ring, 7-dot binary history,
 *  streak/best chips, INVIOLABLE/BREACH tier badges (derived from
 *  adherence thresholds), in-place expansion (teaching · impact-when-held
 *  · impact-when-broken · violation timeline), inline AddRule picker
 *  (search + 5 category filters + 30 templates), sort, prose verdict
 *  footer, markdown export of the violation log.
 *
 *  All editorial — hairline borders, transparent backgrounds, amberWash
 *  reserved for hover/selected/picker states. Theme-safe.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion"

import { useStrategyOs }          from "./provider"
import {
  RuleCommitment,
  RuleTemplate,
  ALL_AVAILABLE_RULES,
  OS_BREACH_THRESHOLD,
  OS_INVIOLABLE_THRESHOLD,
} from "./data"

/* ─────────────────────────────────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────────────────────────────────── */

type SortKey = "adherence" | "streak" | "category"
const SORT_OPTIONS: { key: SortKey; label: string; help: string }[] = [
  { key: "adherence", label: "ADHERENCE", help: "Lowest first — see breaches at the top" },
  { key: "streak",    label: "STREAK",    help: "Longest current streak first" },
  { key: "category",  label: "CATEGORY",  help: "Alphabetical by rule category" },
]

const CATEGORY_FILTERS = [
  { key: "all",     label: "ALL"     },
  { key: "entry",   label: "ENTRY"   },
  { key: "exit",    label: "EXIT"    },
  { key: "risk",    label: "RISK"    },
  { key: "session", label: "SESSION" },
  { key: "mindset", label: "MINDSET" },
] as const

type CategoryFilter = (typeof CATEGORY_FILTERS)[number]["key"]

/* ═══════════════════════════════════════════════════════════════════════════
 *  RuleCommitments  ·  the entire RULES tab body
 * ═══════════════════════════════════════════════════════════════════════ */

export const RuleCommitments = memo(function RuleCommitments() {
  const { state, actions, selectors, palette, toneMap } = useStrategyOs()
  const { rules, pickerOpen } = state
  const reduce = useReducedMotion()

  const [sortKey, setSortKey] = useState<SortKey>("adherence")
  const [pickerCategory, setPickerCategory] = useState<CategoryFilter>("all")
  const [pickerSearch, setPickerSearch]     = useState("")

  /* ── stats ────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const sum   = rules.reduce((s, r) => s + r.adherence, 0)
    const avg   = rules.length ? sum / rules.length : 0
    const worst = rules.reduce<RuleCommitment | null>(
      (acc, r) => (acc == null || r.adherence < acc.adherence ? r : acc),
      null,
    )
    const breachedCount   = rules.filter((r) => r.adherence < OS_BREACH_THRESHOLD).length
    const inviolableCount = rules.filter((r) => r.adherence >= OS_INVIOLABLE_THRESHOLD).length
    return { avg, worst, breachedCount, inviolableCount }
  }, [rules])

  /* ── sorted rules ─────────────────────────────────────────── */
  const sortedRules = useMemo(() => {
    const arr = [...rules]
    arr.sort((a, b) => {
      if (sortKey === "adherence") return a.adherence - b.adherence
      if (sortKey === "streak")    return b.streak - a.streak
      return a.category.localeCompare(b.category)
    })
    return arr
  }, [rules, sortKey])

  /* ── verdict prose ─────────────────────────────────────────── */
  const verdict = useMemo(() => {
    const held = rules.length - stats.breachedCount
    if (rules.length === 0) {
      return "No rules tracked yet. Add one from the picker to anchor your discipline."
    }
    if (stats.breachedCount === 0) {
      return `All ${rules.length} rules held this period. Discipline average ${Math.round(stats.avg)}%. Compound the streak — don't add a sixth rule until adherence holds another full week.`
    }
    if (stats.breachedCount === 1 && stats.worst) {
      return `Discipline is held by ${held} rules. The rule "${stats.worst.rule}" is the leak (${Math.round(stats.worst.adherence)}%). Fix that one and the OS clears.`
    }
    return `${held} of ${rules.length} rules holding. ${stats.breachedCount} below ${OS_BREACH_THRESHOLD}% — the worst is "${stats.worst?.rule ?? "—"}". Review every breach below before adding new commitments.`
  }, [rules, stats])

  /* ── violation log markdown export ─────────────────────────── */
  const exportViolationLog = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return
    const lines: string[] = ["# Strategy OS · Violation Log\n"]
    rules.forEach((r) => {
      lines.push(`## ${r.rule}  (${r.adherence}%)`)
      lines.push(`> ${r.teaching}\n`)
      if (r.violationLog && r.violationLog.length) {
        r.violationLog.forEach((v) => {
          lines.push(`- **${v.date}** — ${v.context}`)
        })
      } else {
        lines.push(`_No logged violations._`)
      }
      lines.push("")
    })
    navigator.clipboard.writeText(lines.join("\n"))
  }, [rules])

  /* ── picker options ─────────────────────────────────────────── */
  const pickerOptions = useMemo<RuleTemplate[]>(() => {
    const usedNames = new Set(rules.map((r) => r.rule))
    const haystack = pickerSearch.trim().toLowerCase()
    return ALL_AVAILABLE_RULES.filter((tpl) => !usedNames.has(tpl.rule)).filter((tpl) => {
      if (pickerCategory !== "all" && tpl.category !== pickerCategory) return false
      if (!haystack) return true
      return (
        tpl.rule.toLowerCase().includes(haystack) ||
        tpl.teaching.toLowerCase().includes(haystack)
      )
    })
  }, [rules, pickerCategory, pickerSearch])

  const handlePick = useCallback((tpl: RuleTemplate) => {
    // Convert template → fresh RuleCommitment with neutral starting state.
    const fresh: RuleCommitment = {
      id:               `r${Date.now().toString(36)}`,
      rule:             tpl.rule,
      category:         tpl.category,
      adherence:        80,
      violations:       0,
      streak:           0,
      bestStreak:       0,
      totalDaysTracked: 0,
      weeklyHistory:    [0, 0, 0, 0, 0, 0, 0],
      teaching:         tpl.teaching,
      impactWhenFollowed: "Newly committed — track for a week to see the upside.",
      impactWhenBroken:   "Newly committed — track for a week to see the downside.",
      violationLog:     [],
    }
    actions.addRule(fresh)
    actions.closePicker()
  }, [actions])

  /* ── render ────────────────────────────────────────────────── */
  return (
    <section className="flex flex-col gap-5">
      {/* ── stats strip ─────────────────────────────────────── */}
      <header
        className="grid items-center gap-4"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr)) auto",
          paddingBottom: 12,
          borderBottom:  `1px solid ${palette.rule}`,
        }}
      >
        <StatCell
          label="ADHERENCE"
          value={`${Math.round(stats.avg)}%`}
          tone={stats.avg >= OS_INVIOLABLE_THRESHOLD ? "good" : stats.avg < OS_BREACH_THRESHOLD ? "alert" : "neutral"}
          palette={palette}
          toneMap={toneMap}
        />
        <StatCell
          label="HELD"
          value={`${rules.length - stats.breachedCount}/${rules.length}`}
          tone={stats.breachedCount === 0 ? "good" : stats.breachedCount > 2 ? "alert" : "neutral"}
          palette={palette}
          toneMap={toneMap}
        />
        <StatCell
          label="BREACHED"
          value={String(stats.breachedCount)}
          tone={stats.breachedCount === 0 ? "good" : "alert"}
          palette={palette}
          toneMap={toneMap}
        />
        <StatCell
          label="INVIOLABLE"
          value={String(stats.inviolableCount)}
          tone="neutral"
          palette={palette}
          toneMap={toneMap}
        />

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSortKey(s.key)}
              className="font-mono uppercase tracking-wider"
              title={s.help}
              style={{
                fontSize:      8.5,
                padding:       "4px 8px",
                letterSpacing: "0.22em",
                border:        `1px solid ${sortKey === s.key ? palette.amberHalo : palette.rule}`,
                background:    sortKey === s.key ? palette.amberWash : "transparent",
                color:         sortKey === s.key ? palette.amber : palette.ashSoft,
                borderRadius:  2,
                transition:    "all 200ms ease",
                cursor:        "pointer",
              }}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => actions.openPicker()}
            className="font-mono uppercase tracking-wider"
            style={{
              fontSize:      8.5,
              padding:       "4px 10px",
              letterSpacing: "0.24em",
              border:        `1px solid ${palette.amberHalo}`,
              background:    palette.amberWash,
              color:         palette.amber,
              borderRadius:  2,
              cursor:        "pointer",
              fontWeight:    500,
            }}
          >
            + ADD RULE
          </button>
          <button
            type="button"
            onClick={exportViolationLog}
            className="font-mono uppercase tracking-wider"
            title="Copy violation log as markdown"
            style={{
              fontSize:      8.5,
              padding:       "4px 8px",
              letterSpacing: "0.22em",
              border:        `1px solid ${palette.rule}`,
              background:    "transparent",
              color:         palette.ashSoft,
              borderRadius:  2,
              cursor:        "pointer",
            }}
          >
            EXPORT
          </button>
        </div>
      </header>

      {/* ── verdict prose ────────────────────────────────────── */}
      <p
        className="font-sans"
        style={{
          fontSize:    13,
          lineHeight:  1.6,
          color:       palette.paperDim,
          margin:      0,
          paddingLeft: 12,
          borderLeft:  `1px solid ${palette.amberHalo}`,
        }}
      >
        {verdict}
      </p>

      {/* ── rules list ────────────────────────────────────────── */}
      <ul className="flex flex-col" style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {sortedRules.map((rule, i) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            index={i}
            expanded={selectors.isRuleExpanded(rule.id)}
            flashing={selectors.isRuleFlashing(rule.id)}
            onToggle={() => actions.toggleRule(rule.id)}
            onRemove={() => actions.removeRule(rule.id)}
            palette={palette}
            toneMap={toneMap}
            reduce={!!reduce}
          />
        ))}
      </ul>

      {/* ── picker ────────────────────────────────────────────── */}
      <AnimatePresence>
        {pickerOpen && (
          <RulePicker
            options={pickerOptions}
            search={pickerSearch}
            setSearch={setPickerSearch}
            category={pickerCategory}
            setCategory={setPickerCategory}
            onPick={handlePick}
            onClose={() => actions.closePicker()}
            palette={palette}
            toneMap={toneMap}
            reduce={!!reduce}
          />
        )}
      </AnimatePresence>
    </section>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
 *  StatCell  ·  hairline tile in the rules header
 * ═══════════════════════════════════════════════════════════════════════ */

function StatCell({
  label,
  value,
  tone,
  palette,
  toneMap,
}: {
  label:   string
  value:   string
  tone:    "good" | "neutral" | "alert"
  palette: any
  toneMap: any
}) {
  const valueColor =
    tone === "good"   ? toneMap.optimal :
    tone === "alert"  ? palette.paper   :
                        palette.paper
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.26em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize:      16,
          color:         valueColor,
          fontWeight:    500,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  RuleCard
 * ═══════════════════════════════════════════════════════════════════════ */

function RuleCard({
  rule,
  index,
  expanded,
  flashing,
  onToggle,
  onRemove,
  palette,
  toneMap,
  reduce,
}: {
  rule:     RuleCommitment
  index:    number
  expanded: boolean
  flashing: boolean
  onToggle: () => void
  onRemove: () => void
  palette:  any
  toneMap:  any
  reduce:   boolean
}) {
  const breach     = rule.adherence < OS_BREACH_THRESHOLD
  const inviolable = rule.adherence >= OS_INVIOLABLE_THRESHOLD
  const ringColor  = breach ? palette.paperDim : toneMap.discipline

  // first sentence of teaching → use as compact body summary
  const summary = useMemo(() => {
    const t = rule.teaching || ""
    const m = t.match(/^[^.!?]+[.!?]/)
    return m ? m[0] : t
  }, [rule.teaching])

  // flash effect
  const flashRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    if (!flashing || !flashRef.current) return
    flashRef.current.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" })
  }, [flashing, reduce])

  return (
    <motion.li
      ref={flashRef}
      initial={false}
      animate={{
        background: flashing
          ? palette.amberWash
          : expanded
            ? "rgba(255,255,255,0.012)"
            : "transparent",
      }}
      transition={{ duration: reduce ? 0.05 : 0.32, ease: [0.65, 0, 0.35, 1] }}
      style={{
        borderTop: index === 0 ? "none" : `1px solid ${palette.rule}`,
        listStyle: "none",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left grid items-start gap-4"
        style={{
          gridTemplateColumns: "60px 1fr auto",
          padding:             "16px 4px",
          background:          "transparent",
          border:              "none",
          cursor:              "pointer",
          color:               "inherit",
        }}
        aria-expanded={expanded}
      >
        {/* left rail */}
        <div className="flex flex-col items-center gap-1.5">
          <AdherenceRing value={rule.adherence} color={ringColor} palette={palette} />
          {inviolable && (
            <TierChip label="INVIOLABLE" tone="amber" palette={palette} />
          )}
          {breach && !inviolable && (
            <TierChip label="BREACH" tone="dim" palette={palette} />
          )}
        </div>

        {/* middle */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-sans"
              style={{
                fontSize:      14,
                fontWeight:    500,
                color:         palette.paper,
                letterSpacing: "-0.01em",
              }}
            >
              {rule.rule}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize:      8.5,
                letterSpacing: "0.24em",
                color:         palette.ashSoft,
              }}
            >
              · {rule.category}
            </span>
            <span
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize:      8.5,
                letterSpacing: "0.20em",
                color:         palette.ashSoft,
              }}
            >
              · {rule.violations} VIOLATION{rule.violations === 1 ? "" : "S"}
            </span>
          </div>
          <p
            className="font-sans"
            style={{
              fontSize:   12.5,
              lineHeight: 1.55,
              color:      palette.paperDim,
              margin:     0,
            }}
          >
            {summary}
          </p>

          {/* 7-dot weekly history (binary) */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="font-mono uppercase"
              style={{
                fontSize:      8,
                letterSpacing: "0.24em",
                color:         palette.ashSoft,
              }}
            >
              7-DAY
            </span>
            <div className="flex items-center gap-1">
              {(rule.weeklyHistory ?? Array(7).fill(0)).map((h, i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    width:        6,
                    height:       6,
                    borderRadius: 99,
                    background:   h ? toneMap.discipline : palette.paperDim,
                    opacity:      h ? 1 : 0.32,
                    boxShadow:    h ? `0 0 3px ${palette.amberHalo}` : "none",
                  }}
                />
              ))}
            </div>
            <span aria-hidden style={{ width: 1, height: 10, background: palette.rule }} />
            <span
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize:      8.5,
                letterSpacing: "0.20em",
                color:         palette.ashSoft,
              }}
            >
              STREAK {rule.streak}d · BEST {rule.bestStreak}d
            </span>
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize:   18,
              color:      breach ? palette.paper : palette.amber,
              fontWeight: 500,
              minWidth:   42,
              textAlign:  "right",
            }}
          >
            {Math.round(rule.adherence)}
            <span style={{ fontSize: 9, color: palette.ashSoft }}>%</span>
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: reduce ? 0.05 : 0.22 }}
            style={{
              display:    "inline-flex",
              fontSize:   11,
              color:      palette.ashSoft,
              fontFamily: "monospace",
            }}
          >
            ▾
          </motion.span>
        </div>
      </button>

      {/* expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="rule-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.05 : 0.32, ease: [0.65, 0, 0.35, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "60px 1fr",
                padding:             "0 4px 18px 4px",
              }}
            >
              <div /> {/* spacer column to align with ring */}

              <div className="flex flex-col gap-3">
                {/* teaching */}
                <div
                  className="font-sans"
                  style={{
                    fontSize:    13,
                    lineHeight:  1.6,
                    color:       palette.paper,
                    paddingLeft: 12,
                    borderLeft:  `1px solid ${palette.amberHalo}`,
                  }}
                >
                  {rule.teaching}
                </div>

                {/* impact pills */}
                <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <ImpactPill
                    label="WHEN HELD"
                    text={rule.impactWhenFollowed}
                    tone="good"
                    palette={palette}
                    toneMap={toneMap}
                  />
                  <ImpactPill
                    label="WHEN BROKEN"
                    text={rule.impactWhenBroken}
                    tone="alert"
                    palette={palette}
                    toneMap={toneMap}
                  />
                </div>

                {/* violation timeline */}
                <ViolationTimeline rule={rule} palette={palette} toneMap={toneMap} />

                {/* footer pills */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <ActionPill
                    label="ASK COPILOT"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("vantary:command", {
                          detail: { prompt: `Coach me on the rule: ${rule.rule}` },
                        }))
                      }
                    }}
                    palette={palette}
                    toneMap={toneMap}
                  />
                  <ActionPill
                    label="COPY READOUT"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        const text = [
                          `# ${rule.rule} (${rule.adherence}%)`,
                          rule.teaching,
                          `\nStreak: ${rule.streak}d · Best: ${rule.bestStreak}d · Violations: ${rule.violations}`,
                          rule.violationLog.length
                            ? `\n## Violations\n${rule.violationLog.map((v) => `- ${v.date} — ${v.context}`).join("\n")}`
                            : "",
                        ].filter(Boolean).join("\n")
                        navigator.clipboard.writeText(text)
                      }
                    }}
                    palette={palette}
                    toneMap={toneMap}
                  />
                  {!inviolable && (
                    <ActionPill
                      label="REMOVE"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (typeof window !== "undefined" && window.confirm(`Remove rule "${rule.rule}"? This drops it from your commitment list.`)) {
                          onRemove()
                        }
                      }}
                      palette={palette}
                      toneMap={toneMap}
                      tone="danger"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Helpers
 * ═══════════════════════════════════════════════════════════════════════ */

function TierChip({
  label,
  tone,
  palette,
}: {
  label:   string
  tone:    "amber" | "dim"
  palette: any
}) {
  return (
    <span
      className="font-mono uppercase tabular-nums"
      style={{
        fontSize:      7.5,
        letterSpacing: "0.22em",
        color:         tone === "amber" ? palette.amber : palette.paperDim,
        padding:       "1px 5px",
        border:        `1px solid ${tone === "amber" ? palette.amberHalo : palette.rule}`,
        background:    tone === "amber" ? palette.amberWash : "transparent",
        borderRadius:  99,
      }}
    >
      {label}
    </span>
  )
}

function AdherenceRing({
  value,
  color,
  palette,
  size = 38,
}: {
  value:   number
  color:   string
  palette: any
  size?:   number
}) {
  const r   = size / 2 - 3
  const c   = 2 * Math.PI * r
  const off = c * (1 - Math.min(1, Math.max(0, value / 100)))
  return (
    <svg width={size} height={size} role="img" aria-label={`Adherence ${Math.round(value)}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={palette.rule} strokeWidth={1.25} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.36em"
        fontFamily="ui-monospace, monospace"
        fontSize={11}
        fill={palette.paper}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {Math.round(value)}
      </text>
    </svg>
  )
}

function ImpactPill({
  label,
  text,
  tone,
  palette,
  toneMap,
}: {
  label:   string
  text:    string
  tone:    "good" | "alert"
  palette: any
  toneMap: any
}) {
  const accent = tone === "good" ? toneMap.optimal : palette.paperDim
  return (
    <div
      style={{
        border:     `1px solid ${palette.rule}`,
        padding:    "10px 12px",
        background: "transparent",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          aria-hidden
          style={{
            width: 6, height: 6, borderRadius: 99, background: accent, opacity: 0.85,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      8,
            letterSpacing: "0.26em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          {label}
        </span>
      </div>
      <p
        className="font-sans"
        style={{
          margin:     0,
          fontSize:   12.5,
          lineHeight: 1.55,
          color:      palette.paper,
        }}
      >
        {text}
      </p>
    </div>
  )
}

function ViolationTimeline({
  rule,
  palette,
  toneMap,
}: {
  rule:    RuleCommitment
  palette: any
  toneMap: any
}) {
  const log = rule.violationLog ?? []
  if (!log.length) {
    return (
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          style={{ width: 6, height: 6, borderRadius: 99, background: toneMap.optimal }}
        />
        <span
          className="font-sans italic"
          style={{ fontSize: 12, color: palette.ashSoft }}
        >
          {rule.lastViolation
            ? `Last logged violation: ${rule.lastViolation}.`
            : "No logged violations this period."}
        </span>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2 mt-1">
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.26em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        VIOLATIONS · {log.length}
      </span>
      <ul
        className="flex flex-col gap-2"
        style={{
          paddingLeft: 12,
          borderLeft:  `1px solid ${palette.rule}`,
          margin:      0,
          listStyle:   "none",
        }}
      >
        {log.map((v, i) => (
          <li key={i} className="grid items-baseline gap-3" style={{ gridTemplateColumns: "auto auto 1fr" }}>
            <span
              aria-hidden
              style={{
                width:        7,
                height:       7,
                borderRadius: 99,
                background:   palette.amber,
                marginLeft:   -16,
                boxShadow:    `0 0 4px ${palette.amberHalo}`,
              }}
            />
            <span
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize:      9,
                letterSpacing: "0.22em",
                color:         palette.ashSoft,
                minWidth:      54,
              }}
            >
              {v.date}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize:   12.5,
                color:      palette.paper,
                lineHeight: 1.5,
              }}
            >
              {v.context}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ActionPill({
  label,
  onClick,
  palette,
  toneMap,
  tone = "neutral",
}: {
  label:   string
  onClick: (e: React.MouseEvent) => void
  palette: any
  toneMap: any
  tone?:   "neutral" | "danger"
}) {
  const color  = tone === "danger" ? palette.paperDim : toneMap.optimal
  const border = tone === "danger" ? palette.rule     : palette.amberHalo
  const bg     = tone === "danger" ? "transparent"    : palette.amberWash
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono uppercase tracking-wider"
      style={{
        fontSize:      8.5,
        padding:       "4px 10px",
        letterSpacing: "0.24em",
        border:        `1px solid ${border}`,
        background:    bg,
        color,
        borderRadius:  2,
        cursor:        "pointer",
        fontWeight:    500,
      }}
    >
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  RulePicker
 * ═══════════════════════════════════════════════════════════════════════ */

function RulePicker({
  options,
  search,
  setSearch,
  category,
  setCategory,
  onPick,
  onClose,
  palette,
  toneMap,
  reduce,
}: {
  options:     RuleTemplate[]
  search:      string
  setSearch:   (s: string) => void
  category:    CategoryFilter
  setCategory: (c: CategoryFilter) => void
  onPick:      (rule: RuleTemplate) => void
  onClose:     () => void
  palette:     any
  toneMap:     any
  reduce:      boolean
}) {
  return (
    <motion.div
      key="picker"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: reduce ? 0.05 : 0.32, ease: [0.65, 0, 0.35, 1] }}
      style={{
        overflow:   "hidden",
        border:     `1px solid ${palette.amberHalo}`,
        background: palette.amberWash,
      }}
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <span
            className="font-mono uppercase"
            style={{
              fontSize:      9.5,
              letterSpacing: "0.26em",
              color:         palette.amber,
              fontWeight:    500,
            }}
          >
            ADD RULE · {options.length} AVAILABLE
          </span>
          <span aria-hidden style={{ flex: 1, height: 1, background: palette.rule, opacity: 0.4 }} />
          <button
            type="button"
            onClick={onClose}
            className="font-mono uppercase"
            style={{
              fontSize:      8.5,
              padding:       "4px 8px",
              letterSpacing: "0.24em",
              border:        `1px solid ${palette.rule}`,
              background:    "transparent",
              color:         palette.paperDim,
              cursor:        "pointer",
              borderRadius:  2,
            }}
          >
            CLOSE
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rules…"
          className="font-sans"
          style={{
            fontSize:     13,
            padding:      "8px 10px",
            border:       `1px solid ${palette.rule}`,
            background:   "transparent",
            color:        palette.paper,
            outline:      "none",
            borderRadius: 0,
          }}
          autoFocus
        />

        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((c) => {
            const active = category === c.key
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className="font-mono uppercase tracking-wider"
                style={{
                  fontSize:      8.5,
                  padding:       "4px 10px",
                  letterSpacing: "0.22em",
                  border:        `1px solid ${active ? palette.amberHalo : palette.rule}`,
                  background:    active ? palette.amber : "transparent",
                  color:         active ? "#000" : palette.ashSoft,
                  borderRadius:  2,
                  cursor:        "pointer",
                  fontWeight:    500,
                }}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        <ul
          className="flex flex-col"
          style={{
            maxHeight:  320,
            overflowY:  "auto",
            border:     `1px solid ${palette.rule}`,
            background: "transparent",
            margin:     0,
            padding:    0,
            listStyle:  "none",
          }}
        >
          {options.length === 0 && (
            <li
              className="font-sans italic"
              style={{
                padding:  "16px",
                color:    palette.ashSoft,
                fontSize: 12.5,
              }}
            >
              No matching rule templates. Try clearing your filter.
            </li>
          )}
          {options.map((tpl, i) => (
            <li
              key={tpl.rule}
              style={{
                borderTop: i === 0 ? "none" : `1px dashed ${palette.rule}`,
              }}
            >
              <button
                type="button"
                onClick={() => onPick(tpl)}
                className="w-full text-left grid items-baseline gap-3"
                style={{
                  gridTemplateColumns: "auto 1fr auto",
                  padding:             "10px 12px",
                  background:          "transparent",
                  border:              "none",
                  color:               "inherit",
                  cursor:              "pointer",
                  transition:          "background 200ms ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = palette.amberWash }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
              >
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize:      8,
                    letterSpacing: "0.24em",
                    color:         palette.ashSoft,
                    minWidth:      54,
                  }}
                >
                  {tpl.category}
                </span>
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className="font-sans"
                    style={{
                      fontSize:   13,
                      color:      palette.paper,
                      fontWeight: 500,
                    }}
                  >
                    {tpl.rule}
                  </span>
                  <span
                    className="font-sans"
                    style={{
                      fontSize:   12,
                      color:      palette.paperDim,
                      lineHeight: 1.5,
                    }}
                  >
                    {tpl.teaching}
                  </span>
                </span>
                <span
                  className="font-mono uppercase tabular-nums"
                  style={{
                    fontSize:      8.5,
                    letterSpacing: "0.22em",
                    color:         palette.amber,
                  }}
                >
                  ADD
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
