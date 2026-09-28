"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ORACLE · COMMAND CONSOLE
   ───────────────────────────────────────────────────────────────────────────
   The dropdown that materialises beneath the "ASK ME ANYTHING…" input.

   Sections, top-to-bottom:

     1. SUGGESTED FOR YOU  — 3 prompts ranked by current trader state
                              (drawdown, macro proximity, session, streak).
                              Each carries a MATCH 87% pill and a 1-line
                              "why this is here" reason.
     2. COMPARE            — 5 comparison commands that resolve to a real
                              category in `generateOracleResult`:
                                · mentors
                                · two trader profiles
                                · live vs prop
                                · this week vs last
                                · best vs worst session
     3. ANALYZE            — 5 single-axis analysis commands:
                                · account statistics
                                · equity curves
                                · discipline trend
                                · strategy decay
                                · time-of-day heatmap
     4. QUICK              — 6 chip-pills (sessions, watchlist, macro, plan,
                              strategy, psychology). The legacy fast actions.
     5. RECENT             — last 5 queries the trader has actually run, so
                              re-running a question is one click. Persisted
                              by the parent (VantaryOracle).

   Keyboard contract:
     ↑↓     navigate through visible items (fuzzy-filtered when typing)
     ⏎      run the active item
     ESC    bubbles up — parent closes the console
     /      caller's responsibility (parent re-focuses the input)

   Hover contract:
     hovering a Compare/Analyze row expands an inline preview strip showing
     up-to-3 `previewChips` (small monospace tokens). This previews the
     data the prompt will surface, before the user commits to running it.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Users, User, GitCompare, History,
  BarChart3, TrendingUp, TrendingDown, Brain, Flame,
  Clock, Crosshair, Globe, Calendar, Shield, Target,
  Zap, ChevronRight, CornerDownLeft, ArrowUpDown,
} from "lucide-react"
import { VANTARY, EASE_V } from "./vantary-theme"
import {
  COMPARE_COMMANDS,
  ANALYZE_COMMANDS,
  QUICK_COMMANDS,
  fuzzyScore,
  type CommandItem,
  type SmartSuggestion,
} from "./oracle-data"
import { useUTCSecondClock } from "./clock-spine"

/* ─────────────────────────────────────────────────────────────────────────
   Flight-deck primitives — local versions to keep this file self-contained.
   They mirror the FdLiveTick / FdCorners / FdPanelHeader idioms used in
   vantary-modules.tsx so the Oracle command console reads as part of the
   same cockpit doctrine when it expands beneath the input.
   ───────────────────────────────────────────────────────────────────────── */

function ConsoleLiveTick({ size = 9.5, label = "UTC" }: { size?: number; label?: string }) {
  const sec = useUTCSecondClock()
  const hh = sec.getUTCHours().toString().padStart(2, "0")
  const mm = sec.getUTCMinutes().toString().padStart(2, "0")
  const ss = sec.getUTCSeconds().toString().padStart(2, "0")
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      <motion.span
        aria-hidden
        className="rounded-full"
        style={{
          width: 5, height: 5,
          background: VANTARY.amber,
          boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
        }}
        animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{ fontSize: size, letterSpacing: "0.16em", color: VANTARY.ashSoft, fontWeight: 500 }}
      >
        {label} · {hh}:{mm}:{ss}
      </span>
    </span>
  )
}

function ConsoleDashedRule({ accent }: { accent?: string }) {
  return (
    <span
      aria-hidden
      className="flex-1 h-px"
      style={{
        background: `repeating-linear-gradient(90deg, ${accent ?? VANTARY.rule} 0 4px, transparent 4px 8px)`,
      }}
    />
  )
}

function ConsoleCorner({
  rotate, x, y, inset = 8, size = 8, color, thickness = 1,
}: {
  rotate: number
  x: "l" | "r"
  y: "t" | "b"
  inset?: number
  size?: number
  color?: string
  thickness?: number
}) {
  const c = color ?? VANTARY.amberHalo
  return (
    <span
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left: x === "l" ? inset : "auto",
        right: x === "r" ? inset : "auto",
        top: y === "t" ? inset : "auto",
        bottom: y === "b" ? inset : "auto",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, width: size, height: thickness, background: c, opacity: 0.7 }} />
      <span style={{ position: "absolute", left: 0, top: 0, width: thickness, height: size, background: c, opacity: 0.7 }} />
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Icon registry — keeps the data layer free of React deps.
   ───────────────────────────────────────────────────────────────────────── */

const ICONS: Record<CommandItem["icon"], React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  scale: GitCompare,
  users: Users,
  user: User,
  split: GitCompare,
  history: History,
  barChart: BarChart3,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  brain: Brain,
  flame: Flame,
  clock: Clock,
  crosshair: Crosshair,
  globe: Globe,
  calendar: Calendar,
  shield: Shield,
  target: Target,
  zap: Zap,
  sparkles: Sparkles,
}

/* ─────────────────────────────────────────────────────────────────────────
   Section eyebrow — small-caps title + hairline rule + count.
   ───────────────────────────────────────────────────────────────────────── */

function SectionEyebrow({
  label,
  count,
  hint,
  prefix,
}: {
  label: string
  count: number
  hint?: string
  /** Optional 2-letter band code — e.g. "S" for Suggested, "C" for Compare. */
  prefix?: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 pt-5 pb-2">
      {prefix && (
        <span
          className="font-mono uppercase shrink-0 tabular-nums"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.16em",
            color: VANTARY.ashSoft,
            padding: "1.5px 5px",
            border: `1px solid ${VANTARY.ruleSoft}`,
            borderRadius: 3,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {prefix}-BAND
        </span>
      )}
      <div
        className="font-mono uppercase shrink-0"
        style={{
          fontSize: 9,
          letterSpacing: "0.24em",
          color: VANTARY.amber,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      {/* Dashed rule, replaces the old solid hairline */}
      <span
        aria-hidden
        className="flex-1 h-px"
        style={{
          background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
        }}
      />
      {hint && (
        <div
          className="font-mono uppercase shrink-0"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
          }}
        >
          {hint}
        </div>
      )}
      <div
        className="font-mono shrink-0"
        style={{
          fontSize: 9,
          letterSpacing: "0.16em",
          color: VANTARY.ash,
          minWidth: 18,
          textAlign: "right",
        }}
      >
        {String(count).padStart(2, "0")}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Single command row.

   Visual structure:
     ┌─ 2px tinted left bar (only when active) ─┐
     │  [icon]  label                            │
     │          hint                             │     [MATCH 87%] [→]
     │  ── (preview chips when active) ──        │
     └───────────────────────────────────────────┘
   ───────────────────────────────────────────────────────────────────────── */

function CommandRow({
  item,
  active,
  onActivate,
  onRun,
  matchScore,
  reason,
  trailing,
  routeId,
  pulse = false,
}: {
  item: CommandItem
  active: boolean
  onActivate: () => void
  onRun: () => void
  /** Optional score (0-100) shown as a pill on the right. */
  matchScore?: number
  /** Optional "why this is here" line, shown beneath the hint. */
  reason?: string
  /** Optional trailing string (e.g. "3m ago" for recent items). */
  trailing?: string
  /** Optional flight-deck route identifier — e.g. "S01", "C03". */
  routeId?: string
  /** Show a breathing pip — used on suggestion rows that are state-driven. */
  pulse?: boolean
}) {
  const Icon = ICONS[item.icon] ?? Sparkles

  return (
    <div
      role="option"
      aria-selected={active}
      tabIndex={-1}
      onMouseEnter={onActivate}
      onClick={onRun}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onRun()
        }
      }}
      className="relative cursor-pointer outline-none"
      style={{
        // hairline accent on the left when active
        background: active ? VANTARY.chipFill : "transparent",
        transition: "background 200ms",
      }}
    >
      {/* left rail */}
      <motion.div
        className="absolute left-0 top-0 bottom-0"
        animate={{
          width: active ? 2 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: EASE_V }}
        style={{ background: VANTARY.amber }}
      />

      <div className="px-5 py-2.5 flex items-center gap-3">
        {/* Flight-deck route ID + breathing pip */}
        {routeId && (
          <div className="shrink-0 flex items-center gap-1.5" style={{ width: 38 }}>
            <motion.span
              aria-hidden
              className="rounded-full"
              style={{
                width: 5, height: 5,
                background: pulse ? VANTARY.amber : VANTARY.ashSoft,
                boxShadow: pulse ? `0 0 6px ${VANTARY.amberHalo}` : "none",
              }}
              animate={pulse ? { opacity: [0.5, 1, 0.5], scale: [0.92, 1.08, 0.92] } : undefined}
              transition={pulse ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
            />
            <span
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize: 8.5,
                letterSpacing: "0.14em",
                color: active ? VANTARY.amber : VANTARY.ashSoft,
                fontWeight: 500,
                transition: "color 200ms",
              }}
            >
              {routeId}
            </span>
          </div>
        )}

        {/* icon tile */}
        <div
          className="shrink-0 rounded-lg flex items-center justify-center transition-all"
          style={{
            width: 28,
            height: 28,
            background: active ? VANTARY.chipFillHi : VANTARY.chipFill,
            border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
            boxShadow: active ? `0 0 12px ${VANTARY.amberHalo}` : "none",
          }}
        >
          <Icon size={13} strokeWidth={1.6} color={active ? VANTARY.amber : VANTARY.paperDim} />
        </div>

        {/* label + hint */}
        <div className="flex-1 min-w-0">
          <div
            className="truncate"
            style={{
              fontSize: 12.5,
              color: active ? VANTARY.paper : VANTARY.paperDim,
              letterSpacing: "0.005em",
              fontWeight: 500,
              transition: "color 200ms",
            }}
          >
            {item.label}
          </div>
          {(item.hint || reason) && (
            <div
              className="truncate font-mono mt-0.5"
              style={{
                fontSize: 10,
                color: VANTARY.ashSoft,
                letterSpacing: "0.04em",
              }}
            >
              {item.hint || reason}
            </div>
          )}
        </div>

        {/* match score pill */}
        {typeof matchScore === "number" && (
          <div
            className="shrink-0 px-2 py-0.5 rounded-full font-mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: VANTARY.amber,
              background: VANTARY.chipFill,
              border: `1px solid ${VANTARY.amberHalo}`,
            }}
          >
            {`MATCH ${matchScore}%`}
          </div>
        )}

        {/* trailing string */}
        {trailing && (
          <div
            className="shrink-0 font-mono"
            style={{
              fontSize: 10,
              color: VANTARY.ashSoft,
              letterSpacing: "0.06em",
            }}
          >
            {trailing}
          </div>
        )}

        {/* chevron */}
        <motion.div
          className="shrink-0"
          animate={{ x: active ? 2 : 0, opacity: active ? 1 : 0.3 }}
          transition={{ duration: 0.2, ease: EASE_V }}
        >
          <ChevronRight size={14} strokeWidth={1.5} color={VANTARY.amber} />
        </motion.div>
      </div>

      {/* preview chips strip — collapses unless this row is active */}
      <AnimatePresence initial={false}>
        {active && item.previewChips && item.previewChips.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE_V }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3 pt-0.5 ml-[40px] flex items-center gap-1.5 flex-wrap">
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.22em",
                  color: VANTARY.ashSoft,
                  marginRight: 2,
                }}
              >
                preview
              </div>
              {item.previewChips.map((chip, i) => (
                <motion.div
                  key={chip}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25, ease: EASE_V }}
                  className="px-2 py-0.5 rounded font-mono"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.08em",
                    color: VANTARY.amber,
                    background: VANTARY.chipFill,
                    border: `1px solid ${VANTARY.amberHalo}`,
                  }}
                >
                  {chip}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Quick-action chip — used in the QUICK section as a horizontal row of
   compact pills, matching the older Active-Theory look.
   ───────────────────────────────────────────────────────────────────────── */

function QuickChip({
  item,
  onRun,
  active,
  onActivate,
}: {
  item: CommandItem
  onRun: () => void
  active: boolean
  onActivate: () => void
}) {
  const Icon = ICONS[item.icon] ?? Sparkles
  return (
    <button
      type="button"
      onClick={onRun}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all"
      style={{
        background: active ? VANTARY.chipFillHi : VANTARY.chipFill,
        border: `1px solid ${active ? VANTARY.amber : VANTARY.amberHalo}`,
        boxShadow: active ? `0 0 14px ${VANTARY.amberHalo}` : "none",
      }}
    >
      <Icon size={11} strokeWidth={1.6} color={VANTARY.amber} />
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.18em",
          color: active ? VANTARY.paper : VANTARY.amber,
          transition: "color 200ms",
        }}
      >
        {item.label}
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   The console itself.
   ───────────────────────────────────────────────────────────────────────── */

export interface OracleCommandConsoleProps {
  /** The current text inside the input, used for fuzzy filtering. */
  query: string
  /** Run a query — caller should also push it onto recents. */
  onSubmit: (q: string) => void
  /** The last N queries the trader actually ran, in newest-first order. */
  recentQueries: readonly { q: string; at: number }[]
  /** State-aware suggestions computed by the caller from live data. */
  suggestions: readonly SmartSuggestion[]
  /** Called on ESC — parent closes the dropdown. */
  onDismiss: () => void
}

export function OracleCommandConsole({
  query,
  onSubmit,
  recentQueries,
  suggestions,
  onDismiss,
}: OracleCommandConsoleProps) {
  /* ── 1. Filter every section against the live query ── */
  const filtered = useMemo(() => {
    const q = query.trim()

    function score(item: CommandItem): number {
      // Score against a concatenation of label + hint + category — that way
      // typing "ftmo" still surfaces account commands even though "ftmo" is
      // only in the underlying generator.
      const target = `${item.label} ${item.hint ?? ""} ${item.category}`
      return fuzzyScore(q, target)
    }

    const filterAndRank = (xs: readonly CommandItem[]) =>
      xs
        .map((x) => ({ x, s: score(x) }))
        .filter((p) => p.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((p) => p.x)

    return {
      suggestions: q
        ? suggestions
            .map((s) => ({ s, score: fuzzyScore(q, `${s.label} ${s.hint ?? ""}`) }))
            .filter((p) => p.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((p) => p.s)
        : suggestions,
      compare: filterAndRank(COMPARE_COMMANDS),
      analyze: filterAndRank(ANALYZE_COMMANDS),
      quick: filterAndRank(QUICK_COMMANDS),
      recent: q
        ? recentQueries.filter((r) => fuzzyScore(q, r.q) > 0)
        : recentQueries,
    }
  }, [query, suggestions, recentQueries])

  /* ── 2. Build the flat keyboard-traversable list ──
        Order: suggestions → compare → analyze → quick → recent. */
  const flat = useMemo(() => {
    type Entry =
      | { kind: "suggestion"; item: SmartSuggestion }
      | { kind: "compare" | "analyze" | "quick"; item: CommandItem }
      | { kind: "recent"; item: { q: string; at: number } }

    const xs: Entry[] = []
    filtered.suggestions.forEach((item) => xs.push({ kind: "suggestion", item }))
    filtered.compare.forEach((item) => xs.push({ kind: "compare", item }))
    filtered.analyze.forEach((item) => xs.push({ kind: "analyze", item }))
    filtered.quick.forEach((item) => xs.push({ kind: "quick", item }))
    filtered.recent.forEach((item) => xs.push({ kind: "recent", item }))
    return xs
  }, [filtered])

  /* ── 3. Active index for keyboard navigation ── */
  const [activeIdx, setActiveIdx] = useState(0)

  // Reset to top whenever the result set changes.
  useEffect(() => {
    setActiveIdx(0)
  }, [flat.length, query])

  // Keyboard handler — uses keydown on the document so the input keeps focus.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIdx((i) => Math.min(flat.length - 1, i + 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIdx((i) => Math.max(0, i - 1))
      } else if (e.key === "Enter") {
        const entry = flat[activeIdx]
        if (!entry) return
        e.preventDefault()
        if (entry.kind === "recent") onSubmit(entry.item.q)
        else onSubmit(entry.item.query)
      } else if (e.key === "Escape") {
        e.preventDefault()
        onDismiss()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [flat, activeIdx, onSubmit, onDismiss])

  // Auto-scroll the active row into view.
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [activeIdx])

  /* ── 4. Helpers to compute the flat-index per row ── */
  const idxBase = useMemo(() => {
    const base = {
      suggestions: 0,
      compare: filtered.suggestions.length,
      analyze: filtered.suggestions.length + filtered.compare.length,
      quick:
        filtered.suggestions.length + filtered.compare.length + filtered.analyze.length,
      recent:
        filtered.suggestions.length +
        filtered.compare.length +
        filtered.analyze.length +
        filtered.quick.length,
    }
    return base
  }, [filtered])

  const totalVisible = flat.length
  const noResults = totalVisible === 0

  /* ── 5. Render ── */
  return (
    <motion.div
      role="listbox"
      aria-label="Oracle command suggestions"
      initial={{ opacity: 0, y: -6, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.985 }}
      transition={{ duration: 0.28, ease: EASE_V }}
      className="rounded-3xl overflow-hidden"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.amberHalo}`,
        backdropFilter: "blur(36px) saturate(160%)",
        WebkitBackdropFilter: "blur(36px) saturate(160%)",
        boxShadow: `0 20px 80px rgba(0,0,0,0.55), 0 0 80px ${VANTARY.amberHalo}30`,
      }}
    >
      {/* Corner registration marks framing the console */}
      <ConsoleCorner rotate={0}   x="l" y="t" />
      <ConsoleCorner rotate={90}  x="r" y="t" />
      <ConsoleCorner rotate={270} x="l" y="b" />
      <ConsoleCorner rotate={180} x="r" y="b" />

      {/* ── Flight-deck status header — eyebrow + dashed rule + UTC tick ── */}
      <div
        className="relative flex items-center gap-3 px-5 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${VANTARY.ruleSoft}` }}
      >
        <span
          className="font-mono uppercase shrink-0"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
            padding: "2px 7px",
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 4,
            background: "rgba(217,119,6,0.06)",
          }}
        >
          COMMAND CONSOLE · ARMED
        </span>
        <ConsoleDashedRule accent={VANTARY.amberHalo} />
        <span
          className="font-mono uppercase shrink-0"
          style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
        >
          {totalVisible} {totalVisible === 1 ? "PROMPT" : "PROMPTS"} · LIVE
        </span>
        <ConsoleLiveTick label="UTC" size={9} />
      </div>

      {/* breathing top accent — sits below the header */}
      <motion.div
        className="h-px mx-auto"
        style={{
          width: "70%",
          background: `linear-gradient(90deg, transparent 0%, ${VANTARY.amber} 50%, transparent 100%)`,
        }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div ref={listRef} className="max-h-[62vh] overflow-y-auto pb-2">
        {/* ── SUGGESTED ── */}
        {filtered.suggestions.length > 0 && (
          <section>
            <SectionEyebrow
              label="Suggested for you"
              count={filtered.suggestions.length}
              hint="Reads your live state"
              prefix="S"
            />
            <div>
              {filtered.suggestions.map((s, i) => {
                const idx = idxBase.suggestions + i
                return (
                  <div key={s.id} data-idx={idx}>
                    <CommandRow
                      item={s}
                      active={activeIdx === idx}
                      onActivate={() => setActiveIdx(idx)}
                      onRun={() => onSubmit(s.query)}
                      matchScore={s.matchScore}
                      reason={s.reason}
                      routeId={`S${String(i + 1).padStart(2, "0")}`}
                      pulse
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── COMPARE ── */}
        {filtered.compare.length > 0 && (
          <section>
            <SectionEyebrow
              label="Compare"
              count={filtered.compare.length}
              hint="Side-by-side"
              prefix="C"
            />
            <div>
              {filtered.compare.map((item, i) => {
                const idx = idxBase.compare + i
                return (
                  <div key={item.id} data-idx={idx}>
                    <CommandRow
                      item={item}
                      active={activeIdx === idx}
                      onActivate={() => setActiveIdx(idx)}
                      onRun={() => onSubmit(item.query)}
                      routeId={`C${String(i + 1).padStart(2, "0")}`}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── ANALYZE ── */}
        {filtered.analyze.length > 0 && (
          <section>
            <SectionEyebrow
              label="Analyze"
              count={filtered.analyze.length}
              hint="Single-axis deep read"
              prefix="A"
            />
            <div>
              {filtered.analyze.map((item, i) => {
                const idx = idxBase.analyze + i
                return (
                  <div key={item.id} data-idx={idx}>
                    <CommandRow
                      item={item}
                      active={activeIdx === idx}
                      onActivate={() => setActiveIdx(idx)}
                      onRun={() => onSubmit(item.query)}
                      routeId={`A${String(i + 1).padStart(2, "0")}`}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── QUICK (chip row) ── */}
        {filtered.quick.length > 0 && (
          <section>
            <SectionEyebrow
              label="Quick"
              count={filtered.quick.length}
              hint="Single key-press"
              prefix="Q"
            />
            <div className="px-5 pb-3 flex items-center gap-1.5 flex-wrap">
              {filtered.quick.map((item, i) => {
                const idx = idxBase.quick + i
                return (
                  <div key={item.id} data-idx={idx}>
                    <QuickChip
                      item={item}
                      onRun={() => onSubmit(item.query)}
                      active={activeIdx === idx}
                      onActivate={() => setActiveIdx(idx)}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── RECENT ── */}
        {filtered.recent.length > 0 && (
          <section>
            <SectionEyebrow
              label="Recent"
              count={filtered.recent.length}
              hint="Run again"
              prefix="R"
            />
            <div>
              {filtered.recent.slice(0, 5).map((r, i) => {
                const idx = idxBase.recent + i
                return (
                  <div key={`${r.q}-${r.at}`} data-idx={idx}>
                    <CommandRow
                      item={{
                        id: `recent-${i}`,
                        label: r.q,
                        icon: "history",
                        category: "OVERVIEW",
                        query: r.q,
                      }}
                      active={activeIdx === idx}
                      onActivate={() => setActiveIdx(idx)}
                      onRun={() => onSubmit(r.q)}
                      trailing={formatRelative(r.at)}
                      routeId={`R${String(i + 1).padStart(2, "0")}`}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── empty state ── */}
        {noResults && (
          <div className="px-5 py-10 text-center">
            <div
              className="font-mono uppercase mb-2"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: VANTARY.ashSoft,
              }}
            >
              No matching prompts
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 10.5,
                color: VANTARY.ash,
                letterSpacing: "0.04em",
              }}
            >
              Press <kbd style={kbdStyle}>⏎</kbd> to ask the Oracle directly: <span style={{ color: VANTARY.amber }}>"{query}"</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer · keyboard hint strip + transmission tick ── */}
      <div
        className="relative px-5 py-2.5 flex items-center justify-between gap-4 border-t"
        style={{ borderColor: VANTARY.rule, background: VANTARY.glassStrong }}
      >
        {/* Dashed timeline strip running the full footer width */}
        <span
          aria-hidden
          className="absolute left-5 right-5 top-0 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.ruleSoft} 0 4px, transparent 4px 8px)`,
          }}
        />
        <div className="flex items-center gap-4">
          <KbdHint icon={<ArrowUpDown size={10} strokeWidth={1.5} color={VANTARY.ashSoft} />} label="navigate" />
          <KbdHint icon={<CornerDownLeft size={10} strokeWidth={1.5} color={VANTARY.ashSoft} />} label="run" />
          <KbdHint label="esc" sublabel="close" />
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: VANTARY.ashSoft,
            }}
          >
            TRANSMIT · STDBY
          </span>
          <ConsoleLiveTick label="" size={9} />
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Small footer kbd hint.
   ───────────────────────────────────────────────────────────────────────── */

const kbdStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 18,
  height: 16,
  padding: "0 4px",
  borderRadius: 4,
  fontFamily: "var(--font-geist-mono, ui-monospace, SFMono-Regular, monospace)",
  fontSize: 9.5,
  letterSpacing: "0.04em",
  color: VANTARY.amber,
  background: VANTARY.chipFill,
  border: `1px solid ${VANTARY.amberHalo}`,
}

function KbdHint({
  icon,
  label,
  sublabel,
}: {
  icon?: React.ReactNode
  label: string
  sublabel?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={kbdStyle}>{icon ?? label}</span>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: VANTARY.ashSoft,
        }}
      >
        {sublabel ?? label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Format a unix-ms timestamp as "3m ago" / "2h ago" / "yesterday".
   Used by the RECENT section.
   ───────────────────────────────────────────────────────────────────────── */

function formatRelative(at: number): string {
  const dt = Date.now() - at
  const m = Math.floor(dt / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return "yesterday"
  return `${d}d ago`
}
