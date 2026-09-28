"use client"

/**
 * ForecastScopeNavigator — Editorial reconstruction
 * ──────────────────────────────────────────────────
 * Built from scratch to match the AI Dashboard / Flight Deck design language
 * exactly. No heavy glass card wrapping the whole thing — bare composition
 * with dashed editorial dividers, anchor circles, hairline travelers, and
 * mono-caps eyebrows. Every surface and color is routed through VT (which
 * forwards to VANTARY CSS custom properties), so a theme switch propagates
 * to the entire navigator in one frame.
 *
 * Composition (vertical):
 *   1. FRAME LINE   — anchor · live pulse · UTC · signal counts · anchor
 *   2. SCOPE TABS   — underline-style segmented (Global / Community /
 *                     Mentors / Personal) with sliding indicator
 *   3. CONTEXT BAR  — sub-filter chips · contextual selector · sort segment
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Check,
  Search,
  Users,
  Compass,
  Crown,
  User,
  Clock,
  Flame,
  Gauge,
} from "lucide-react"
import { VT, amber } from "./forecast-vantary-tokens"

/* ════════════════════════════════════════════════════════════════════════
   TAXONOMY
   ════════════════════════════════════════════════════════════════════════ */
export type ForecastScope = "global" | "community" | "mentors" | "personal"
export type ForecastSortKey = "recent" | "popular" | "confidence"

export interface ScopeDef {
  id: ForecastScope
  label: string
  description: string
  Icon: typeof Compass
}

export interface SubFilterDef {
  id: string
  label: string
}

export const SCOPES: ScopeDef[] = [
  { id: "global",    label: "Global",    description: "Every published forecast across the platform", Icon: Compass },
  { id: "community", label: "Community", description: "Forecasts from communities you're in",         Icon: Users },
  { id: "mentors",   label: "Mentors",   description: "Verified mentors you follow",                  Icon: Crown },
  { id: "personal",  label: "Personal",  description: "Your own forecast record",                     Icon: User },
]

/**
 * SUB_FILTERS — first entry per scope is ALWAYS the pinned "show all" filter
 * (it never rotates). All entries after index 0 rotate through the chip slots.
 * Every id below has matching filter logic + count logic in forecast-feed.tsx.
 */
export const SUB_FILTERS: Record<ForecastScope, SubFilterDef[]> = {
  global: [
    { id: "all",             label: "All" },
    { id: "trending",        label: "Trending" },
    { id: "high-conviction", label: "High Conviction" },
    { id: "active-setups",   label: "Active Setups" },
    { id: "reviewed",        label: "Reviewed" },
    { id: "bullish",         label: "Bullish" },
    { id: "bearish",         label: "Bearish" },
    { id: "expiring-soon",   label: "Expiring Soon" },
    { id: "forex-only",      label: "Forex" },
    { id: "crypto-only",     label: "Crypto" },
    { id: "indices-only",    label: "Indices" },
    { id: "new-today",       label: "New Today" },
  ],
  community: [
    { id: "all",            label: "All" },
    { id: "good-traders",   label: "Good Traders" },
    { id: "news-alerts",    label: "News & Alerts" },
    { id: "hot-calls",      label: "Hot Calls" },
    { id: "discussions",    label: "Discussions" },
    { id: "top-rated",      label: "Top Rated" },
    { id: "featured",       label: "Featured" },
    { id: "bullish-bias",   label: "Bullish Bias" },
    { id: "bearish-bias",   label: "Bearish Bias" },
    { id: "mentor-led",     label: "Mentor-Led" },
  ],
  mentors: [
    { id: "all-verified",       label: "All Verified" },
    { id: "top-wr",             label: "Top Win Rate" },
    { id: "most-active",        label: "Most Active" },
    { id: "recent-calls",       label: "Recent Calls" },
    { id: "highest-edge",       label: "Highest Edge" },
    { id: "specialists-fx",     label: "FX Specialists" },
    { id: "specialists-crypto", label: "Crypto Specialists" },
    { id: "pro-tier",           label: "Pro Tier" },
    { id: "bullish-bias",       label: "Bullish Bias" },
    { id: "bearish-bias",       label: "Bearish Bias" },
  ],
  personal: [
    { id: "all",                  label: "All Mine" },
    { id: "active",               label: "Active" },
    { id: "won",                  label: "Won" },
    { id: "lost",                 label: "Lost" },
    { id: "watching",             label: "Watching" },
    { id: "this-week",            label: "This Week" },
    { id: "high-conviction-mine", label: "High Conviction" },
    { id: "pending-review",       label: "Pending Review" },
    { id: "bullish-bias",         label: "Bullish Bias" },
    { id: "bearish-bias",         label: "Bearish Bias" },
  ],
}

export const COMMUNITIES = [
  "All Communities",
  "ICT Mastery",
  "FX Mastermind",
  "Crypto Inner Circle",
  "Indices Hub",
  "Commodities Desk",
]

const SORTS: { id: ForecastSortKey; label: string }[] = [
  { id: "recent",     label: "Recent" },
  { id: "popular",    label: "Popular" },
  { id: "confidence", label: "Confidence" },
]

/* ════════════════════════════════════════════════════════════════════════
   PROPS
   ════════════════════════════════════════════════════════════════════════ */
interface NavigatorProps {
  scope: ForecastScope
  onScopeChange: (s: ForecastScope) => void
  subFilter: string
  onSubFilterChange: (f: string) => void
  sortBy: ForecastSortKey
  onSortChange: (s: ForecastSortKey) => void
  community: string
  onCommunityChange: (c: string) => void
  selectedMentorId: string | null
  onMentorChange: (id: string | null) => void
  scopeCounts: Record<ForecastScope, number>
  stats: { active: number; resolved: number; mentorReviewed: number; total: number }
  mentors: Array<{ id: string; name: string; isVerified: boolean; accuracy: number }>
  resultsCount: number
  communities?: string[]
  subFilterCounts?: Record<string, number>
}

function eyebrowStyle(color: string): React.CSSProperties {
  return {
    fontSize: 9.5,
    letterSpacing: "0.22em",
    color,
    fontWeight: 500,
    textTransform: "uppercase",
    fontFamily: "var(--font-mono, ui-monospace)",
  }
}

/* ════════════════════════════════════════════════════════════════════════
   SCOPE TABS — underline-style segmented control with sliding indicator
   ════════════════════════════════════════�����═══════════════════════════════ */
function ScopeTabs({
  scope,
  onScopeChange,
  scopeCounts,
}: {
  scope: ForecastScope
  onScopeChange: (s: ForecastScope) => void
  scopeCounts: Record<ForecastScope, number>
}) {
  return (
    <div className="flex items-stretch gap-8 relative">
      {SCOPES.map((s) => {
        const active = scope === s.id
        const Icon = s.Icon
        return (
          <button
            key={s.id}
            onClick={() => onScopeChange(s.id)}
            className="relative flex items-center gap-2.5 pb-3 cursor-pointer transition-colors duration-150 group"
            style={{ color: active ? VT.paper : VT.ash }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = VT.paperDim
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = VT.ash
            }}
          >
            <Icon size={15} strokeWidth={1.5} style={{ color: active ? VT.amber : "currentColor" }} />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 12,
                letterSpacing: "0.16em",
                fontWeight: 500,
                color: "currentColor",
              }}
            >
              {s.label}
            </span>
            <CountBadge value={scopeCounts[s.id]} active={active} />

            {/* Sliding underline indicator */}
            {active && (
              <motion.div
                layoutId="forecast-scope-underline"
                className="absolute left-0 right-0"
                style={{
                  bottom: -1,
                  height: 1.5,
                  background: VT.amber,
                  boxShadow: `0 0 8px ${amber(0.4)}`,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

function CountBadge({ value, active }: { value: number; active: boolean }) {
  return (
    <span
      className="font-mono inline-flex items-center justify-center"
      style={{
        minWidth: 18,
        height: 16,
        padding: "0 5px",
        fontSize: 9.5,
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
        background: active ? VT.amberWash : "transparent",
        border: `1px solid ${active ? VT.amberHalo : VT.rule}`,
        borderRadius: 4,
        color: active ? VT.amber : VT.ashSoft,
        letterSpacing: "-0.01em",
      }}
    >
      {value}
    </span>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   CONTEXT BAR — sub-filters · contextual selector · sort
   ════════════════════════════════════════════════════════════════════════ */
function ContextBar({
  scope,
  subFilter,
  onSubFilterChange,
  subFilterCounts,
  community,
  onCommunityChange,
  communities,
  mentors,
  selectedMentorId,
  onMentorChange,
  sortBy,
  onSortChange,
}: NavigatorProps & { communities: string[] }) {
  const subFilters = SUB_FILTERS[scope]
  const pinned = subFilters[0]
  const rotatingPool = subFilters.slice(1)

  return (
    // No flex-wrap — chips/selector get min-w-0 so they shrink, sort stays
    // pinned on the right. Result: scope, refinement and sort always read
    // as ONE row, never a stack of three.
    <div className="flex items-center gap-4 min-w-0">
      {/* SUB-FILTER CAROUSEL — pinned ALL + 3 rotating slots that auto-cycle */}
      <RotatingChipRow
        pinned={pinned}
        pool={rotatingPool}
        scopeKey={scope}
        active={subFilter}
        counts={subFilterCounts}
        onSelect={onSubFilterChange}
      />

      {/* CONTEXTUAL SELECTOR — only renders when scope demands it */}
      <AnimatePresence mode="wait">
        {scope === "community" && (
          <motion.div
            key="community-selector"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18 }}
          >
            <CommunityPicker
              value={community}
              onChange={onCommunityChange}
              communities={communities}
            />
          </motion.div>
        )}
        {scope === "mentors" && mentors.length > 0 && (
          <motion.div
            key="mentor-rail"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18 }}
          >
            <MentorRail
              mentors={mentors}
              selectedId={selectedMentorId}
              onSelect={onMentorChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPACER pushes sort to the right */}
      <div className="flex-1 min-w-[16px]" />

      {/* SORT CONSOLE — rich, 2-line tabs with icons + sub-labels + direction indicator */}
      <SortConsole sortBy={sortBy} onSortChange={onSortChange} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   SORT CONSOLE — editorial command panel that replaces the flat sort strip
   ────────────────────────────────────────────────────────────────────────
   Layout:
     [eyebrow column]   [segmented w/ 3 rich tabs]   [direction indicator]

   Each tab is a 2-line cell:
     • icon (left)
     • title  (mono caps, primary)
     • sublabel (mono micro, ash) — describes what the sort key actually is

   The active tab has a sliding amber pill (layoutId="forecast-sort-pill")
   PLUS a 1px amber underline scan beam that tints the cell. The eyebrow
   column shows "SORT" + active key as a tiny status line. The direction
   indicator on the right shows the implicit DESC ordering with an icon.
   ════════════════════════════════════════════════════════════════════════ */
const SORT_DEF: Record<ForecastSortKey, { title: string; sub: string; Icon: typeof Clock }> = {
  recent:     { title: "Recent",     sub: "by created date", Icon: Clock },
  popular:    { title: "Popular",    sub: "by engagement",   Icon: Flame },
  confidence: { title: "Confidence", sub: "by % score",      Icon: Gauge },
}

function SortConsole({
  sortBy,
  onSortChange,
}: {
  sortBy: ForecastSortKey
  onSortChange: (s: ForecastSortKey) => void
}) {
  // Compact single-row segmented control — icon + label per tab. The
  // previous version was ~360px wide with an eyebrow column, two-line
  // tabs and a standalone DESC pill, which forced the whole context bar
  // to wrap. This trims to a single 32px-tall segmented (~210px) so
  // chips + selector + sort all coexist on one row.
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span style={eyebrowStyle(VT.ashGhost)}>Sort</span>
      <div
        className="flex items-stretch"
        style={{
          padding: 2,
          borderRadius: 7,
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
          backdropFilter: VT.blur,
          WebkitBackdropFilter: VT.blur,
        }}
      >
        {SORTS.map((s, i) => {
          const def = SORT_DEF[s.id]
          const active = sortBy === s.id
          const Icon = def.Icon
          return (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              className="relative flex items-center gap-1.5 px-2.5 cursor-pointer transition-colors duration-150"
              style={{
                height: 28,
                borderRadius: 5,
                background: "transparent",
                marginLeft: i === 0 ? 0 : 1,
              }}
            >
              <Icon
                size={11}
                strokeWidth={1.6}
                style={{
                  color: active ? VT.amber : VT.ashSoft,
                  zIndex: 1,
                  position: "relative",
                  flexShrink: 0,
                }}
              />
              <span
                className="relative font-mono uppercase whitespace-nowrap"
                style={{
                  zIndex: 1,
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                  fontWeight: 500,
                  color: active ? VT.amber : VT.paperDim,
                }}
              >
                {def.title}
              </span>

              {active && (
                <motion.div
                  layoutId="forecast-sort-pill"
                  className="absolute inset-0"
                  style={{
                    borderRadius: 5,
                    background: VT.amberWash,
                    border: `1px solid ${VT.amberHalo}`,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   ROTATING CHIP ROW — pinned "ALL" + 3 auto-cycling slots
   ────────────────────────────────────────────────────────────────────────
   - First chip in SUB_FILTERS[scope] is pinned (never rotates)
   - The remaining pool cycles through 3 visible slots every ROTATE_MS
   - Hover-pause, manual prev/next/play-pause controls, page indicator,
     thin storyline progress bar that fills each interval and resets
   - Selected chip (whether pinned or currently in a rotating slot) shows
     active styling. If the selected non-pinned chip rotates out of view,
     the filter still applies — selection is stored upstream in feed state.
   ════════════════════════════════════════════════════════════════════════ */
const VISIBLE_ROTATING = 3
const ROTATE_MS = 1900

function RotatingChipRow({
  pinned,
  pool,
  scopeKey,
  active,
  counts,
  onSelect,
}: {
  pinned: SubFilterDef
  pool: SubFilterDef[]
  scopeKey: ForecastScope
  active: string
  counts?: Record<string, number>
  onSelect: (id: string) => void
}) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tickKey, setTickKey] = useState(0) // re-triggers the scan beam each cycle

  // Reset when scope changes
  useEffect(() => {
    setIdx(0)
    setTickKey((k) => k + 1)
  }, [scopeKey])

  const visibleCount = Math.min(VISIBLE_ROTATING, pool.length)
  const willRotate = pool.length > VISIBLE_ROTATING

  // Auto-advance — paused on hover so the user can read / click
  useEffect(() => {
    if (paused || !willRotate) return
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % pool.length)
      setTickKey((k) => k + 1)
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, willRotate, pool.length])

  const visibleChips = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, i) => pool[(idx + i) % pool.length]),
    [idx, visibleCount, pool],
  )

  return (
    <div
      className="flex items-center gap-1.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* PINNED — always first, never rotates */}
      <Chip
        def={pinned}
        active={active === pinned.id}
        count={counts?.[pinned.id]}
        onClick={() => onSelect(pinned.id)}
      />

      {/* Hairline divider between pinned and rotating slots */}
      <div className="w-px h-4 mx-1" style={{ background: VT.rule }} />

      {/* ROTATING SLOTS — fixed-width perspective stage */}
      <div
        className="relative flex items-center gap-1.5"
        style={{ perspective: 720 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleChips.map((f, i) => (
            <motion.div
              key={`${scopeKey}-${f.id}-${idx}-${i}`}
              layout
              initial={{
                opacity: 0,
                x: 22,
                rotateX: -28,
                filter: "brightness(1.6) blur(2px)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                rotateX: 0,
                filter: "brightness(1) blur(0px)",
              }}
              exit={{
                opacity: 0,
                x: -14,
                rotateX: 22,
                filter: "brightness(0.45) blur(3px)",
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 30,
                mass: 0.55,
                delay: i * 0.04, // tiny stagger reads like a tape advance
              }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
              }}
            >
              <Chip
                def={f}
                active={active === f.id}
                count={counts?.[f.id]}
                onClick={() => onSelect(f.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* SCAN BEAM — single amber sweep fires once per tick across the rotating row */}
        {willRotate && !paused && (
          <motion.div
            key={`scan-${tickKey}`}
            className="absolute inset-y-0 pointer-events-none"
            initial={{ left: "-12%", opacity: 0 }}
            animate={{ left: "104%", opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 32,
              background: `linear-gradient(90deg, transparent, ${amber(0.55)}, transparent)`,
              filter: "blur(1px)",
              mixBlendMode: "plus-lighter",
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ──── shared Chip renderer (used by pinned + rotating slots) ──── */
function Chip({
  def,
  active,
  count,
  onClick,
}: {
  def: SubFilterDef
  active: boolean
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 cursor-pointer transition-all duration-150"
      style={{
        height: 26,
        borderRadius: 4,
        border: `1px solid ${active ? VT.amberHalo : "transparent"}`,
        background: active ? VT.amberWash : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent"
      }}
    >
      <span
        className="font-mono uppercase whitespace-nowrap"
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          fontWeight: 500,
          color: active ? VT.amber : VT.ash,
        }}
      >
        {def.label}
      </span>
      {typeof count === "number" && (
        <span
          className="font-mono"
          style={{
            fontSize: 9.5,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
            color: active ? amber(0.7) : VT.ashGhost,
            opacity: count === 0 ? 0.4 : 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   COMMUNITY PICKER — premium glass dropdown with search
   ════════════════════════════════════════════════════════════════════════ */
function CommunityPicker({
  value,
  onChange,
  communities,
}: {
  value: string
  onChange: (c: string) => void
  communities: string[]
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!query) return communities
    const q = query.toLowerCase()
    return communities.filter((c) => c.toLowerCase().includes(q))
  }, [communities, query])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 cursor-pointer transition-colors duration-150"
        style={{
          height: 28,
          borderRadius: 6,
          border: `1px solid ${open ? VT.amberHalo : VT.rule}`,
          background: open ? VT.amberWash : VT.glassRecess,
        }}
      >
        <Users size={12} strokeWidth={1.5} style={{ color: open ? VT.amber : VT.ashSoft }} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            fontWeight: 500,
            color: open ? VT.amber : VT.paperDim,
          }}
        >
          {value}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={11} strokeWidth={1.5} style={{ color: open ? VT.amber : VT.ashSoft }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: VT.easeOut }}
            className="absolute left-0 mt-2 z-50"
            style={{
              width: 280,
              borderRadius: 10,
              background: VT.glassStrong,
              backdropFilter: VT.blurStrong,
              WebkitBackdropFilter: VT.blurStrong,
              border: `1px solid ${VT.ruleStrong}`,
              boxShadow: VT.cardShadowHover,
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-2 px-3"
              style={{ height: 36, borderBottom: `1px solid ${VT.rule}` }}
            >
              <Search size={12} strokeWidth={1.5} style={{ color: VT.ashGhost }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search communities…"
                autoFocus
                className="flex-1 bg-transparent outline-none border-0"
                style={{
                  fontSize: 12,
                  color: VT.paper,
                  fontFamily: "var(--font-sans, system-ui)",
                }}
              />
              <span style={eyebrowStyle(VT.ashGhost)}>{filtered.length}</span>
            </div>

            {/* Eyebrow */}
            <div className="px-3 pt-2.5 pb-1.5">
              <span style={eyebrowStyle(VT.ashGhost)}>Switch Community</span>
            </div>

            {/* Options */}
            <div className="max-h-72 overflow-auto pb-1.5">
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-center">
                  <span style={{ fontSize: 11, color: VT.ashGhost, fontStyle: "italic" }}>
                    No communities match
                  </span>
                </div>
              )}
              {filtered.map((c, i) => {
                const active = c === value
                const isAll = c === "All Communities"
                return (
                  <div key={c}>
                    <button
                      onClick={() => {
                        onChange(c)
                        setOpen(false)
                        setQuery("")
                      }}
                      className="w-full flex items-center justify-between px-3 cursor-pointer transition-colors duration-100 group"
                      style={{
                        height: 32,
                        background: active ? VT.amberWash : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.background = "transparent"
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: active ? 500 : 400,
                          color: active ? VT.amber : VT.paper,
                          fontFamily: "var(--font-sans, system-ui)",
                        }}
                      >
                        {c}
                      </span>
                      {active ? (
                        <Check size={12} strokeWidth={2} style={{ color: VT.amber }} />
                      ) : (
                        <span
                          className="font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            fontSize: 9,
                            letterSpacing: "0.14em",
                            color: VT.ashGhost,
                            textTransform: "uppercase",
                          }}
                        >
                          Select
                        </span>
                      )}
                    </button>
                    {isAll && i < filtered.length - 1 && (
                      <div className="mx-3 my-1.5" style={{ height: 1, background: VT.rule }} />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   MENTOR RAIL — horizontal avatar row with verified marker
   ════════════════════════════════════════════════════════════════════════ */
function MentorRail({
  mentors,
  selectedId,
  onSelect,
}: {
  mentors: NavigatorProps["mentors"]
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const allActive = !selectedId
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className="flex items-center gap-1.5 px-2.5 cursor-pointer transition-colors duration-150"
        style={{
          height: 28,
          borderRadius: 6,
          border: `1px solid ${allActive ? VT.amberHalo : VT.rule}`,
          background: allActive ? VT.amberWash : VT.glassRecess,
        }}
      >
        <Crown size={12} strokeWidth={1.5} style={{ color: allActive ? VT.amber : VT.ashSoft }} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            fontWeight: 500,
            color: allActive ? VT.amber : VT.paperDim,
          }}
        >
          All Mentors
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 9.5,
            color: allActive ? amber(0.7) : VT.ashGhost,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {mentors.length}
        </span>
      </button>

      <div className="w-px h-3.5" style={{ background: VT.rule }} />

      <div className="flex items-center gap-1">
        {mentors.slice(0, 6).map((m) => {
          const active = selectedId === m.id
          return (
            <button
              key={m.id}
              onClick={() => onSelect(active ? null : m.id)}
              title={`${m.name} · ${m.accuracy}%`}
              className="relative flex-shrink-0 cursor-pointer transition-all duration-150"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `1px solid ${active ? VT.amber : VT.rule}`,
                background: active ? VT.amberWash : VT.glassRecess,
                boxShadow: active ? `0 0 0 2px ${amber(0.18)}` : "none",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 9.5,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: active ? VT.amber : VT.paperDim,
                }}
              >
                {initials(m.name)}
              </span>
              {m.isVerified && (
                <span
                  className="absolute"
                  style={{
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: VT.amber,
                    border: `1.5px solid ${VT.ink}`,
                  }}
                />
              )}
            </button>
          )
        })}
        {mentors.length > 6 && (
          <span
            className="font-mono"
            style={{
              marginLeft: 4,
              fontSize: 9.5,
              color: VT.ashGhost,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.08em",
            }}
          >
            +{mentors.length - 6}
          </span>
        )}
      </div>
    </div>
  )
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/* ════════════════════════════════════════════════════════════════════════
   MAST HEAD — editorial title strip that anchors the navigator
   ────────────────────────────────────────────────────────────────────────
   The old navigator dropped users straight onto a wall of tabs + chips
   with no preamble. The masthead fixes that with three legible reads:

     LEFT     scope-tinted icon tile, "Forecast Atlas · {scope} Feed"
              eyebrow stack, and the active scope's plain-English
              description so a new user immediately understands what
              "Global" vs "Community" vs "Mentors" actually means.

     RIGHT    live stats trio — Showing (current filter) | Active |
              Resolved | Total — so the user always knows how many
              forecasts the current configuration is producing.

   Mirrors the right-rail "Community Pulse" header pattern (icon tile +
   eyebrow + description + live stat pills) so the two surfaces feel
   like the same design family.
   ════════════════════════════════════════════════════════════════════════ */
function NavigatorMastHead({
  activeScope,
  stats,
  resultsCount,
}: {
  activeScope: ScopeDef
  stats: { active: number; resolved: number; mentorReviewed: number; total: number }
  resultsCount: number
}) {
  const ActiveIcon = activeScope.Icon
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-4">
      {/* LEFT — editorial title + active scope description */}
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: VT.amberWash,
            border: `1px solid ${VT.amberHalo}`,
            boxShadow: `0 0 16px ${amber(0.12)}, 0 1px 0 rgba(255,255,255,0.06) inset`,
          }}
        >
          <ActiveIcon size={15} strokeWidth={1.6} style={{ color: VT.amber }} />
        </div>
        <div className="flex flex-col gap-1 min-w-0 pt-0.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span style={eyebrowStyle(VT.ashGhost)}>Forecast Atlas</span>
            <div
              className="rounded-full"
              style={{ width: 3, height: 3, background: VT.rule }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                color: VT.amber,
                fontWeight: 500,
              }}
            >
              {activeScope.label} Feed
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: VT.paperDim,
              fontFamily: "var(--font-sans, system-ui)",
              letterSpacing: "-0.005em",
              lineHeight: 1.45,
            }}
          >
            {activeScope.description}
          </span>
        </div>
      </div>

      {/* RIGHT — live stats trio */}
      <div
        className="flex items-stretch flex-shrink-0"
        style={{
          padding: 3,
          borderRadius: 8,
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
          backdropFilter: VT.blur,
          WebkitBackdropFilter: VT.blur,
        }}
      >
        <StatPill label="Showing" value={resultsCount} accent />
        <StatDivider />
        <StatPill label="Active" value={stats.active} tone="live" />
        <StatDivider />
        <StatPill label="Resolved" value={stats.resolved} />
        <StatDivider />
        <StatPill label="Reviewed" value={stats.mentorReviewed} tone="mentor" />
        <StatDivider />
        <StatPill label="Total" value={stats.total} />
      </div>
    </div>
  )
}

function StatPill({
  label,
  value,
  accent = false,
  tone,
}: {
  label: string
  value: number
  accent?: boolean
  tone?: "live" | "mentor"
}) {
  // Tone overrides accent — semantic indicator dot for live/mentor pills
  const dotColor =
    tone === "live"
      ? `rgba(${VT.blueRgb},0.85)`
      : tone === "mentor"
        ? VT.amber
        : null
  const dotPulse = tone === "live"

  return (
    <div
      className="flex items-center gap-1.5 px-2.5"
      style={{
        height: 30,
        borderRadius: 5,
        background: accent ? VT.amberWash : "transparent",
        border: `1px solid ${accent ? VT.amberHalo : "transparent"}`,
      }}
    >
      {dotColor && (
        <motion.span
          className="rounded-full flex-shrink-0"
          style={{
            width: 5,
            height: 5,
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}`,
          }}
          animate={dotPulse ? { opacity: [0.55, 1, 0.55] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.22em",
          color: accent ? amber(0.7) : VT.ashGhost,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: accent ? VT.amber : VT.paper,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
    </div>
  )
}

function StatDivider() {
  return <div className="w-px self-center" style={{ height: 14, background: VT.rule }} />
}

/* ════════════════════════════════════════════════════════════════════════
   ROOT — glass panel that wraps the entire navigator
   ────────────────────────────────────────────────────────────────────────
   Matches the right-rail Community Pulse / Conviction Split aesthetic:
     • 22px radius, soft white-on-glass gradient surface
     • 1px hairline border + inset top highlight
     • amber corner glow tinted to the brand accent
     • dashed rgba(255,255,255,0.06) hairlines between sections

   Vertical stack inside the glass:
     1. Masthead     — title, scope description, live stats
     2. (hairline)
     3. View row     — eyebrow + scope tabs (underline-style)
     4. Filter row   — eyebrow + rotating chip carousel + sort console
   ════════════════════════════════════════════════════════════════════════ */
export function ForecastScopeNavigator(props: NavigatorProps) {
  const communityList =
    props.communities && props.communities.length ? props.communities : COMMUNITIES
  const activeScope = SCOPES.find((s) => s.id === props.scope) ?? SCOPES[0]

  return (
    <div className="mb-5">
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 22,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.024) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px) saturate(150%)",
          WebkitBackdropFilter: "blur(24px) saturate(150%)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {/* Top inner highlight — same primitive used by the right rail */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
          }}
        />
        {/* Amber corner glow — ties to the active scope tile */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: 0,
            right: 0,
            width: 320,
            height: 220,
            background: `radial-gradient(circle at top right, ${amber(0.07)}, transparent 60%)`,
          }}
        />

        {/* ── Atlas command deck — three connected zones inside ONE glass panel.
            No dashed dividers, no eyebrow labels above scope/filter rows; the
            visual hierarchy (mast text → underlined scope tabs → smaller
            refinement chips) carries the layer relationship on its own.
            Result: feels like one breathing navigator, not three stacked strips. ── */}
        <div className="relative flex flex-col">
          {/* ZONE 1 — Masthead (identity + live stats) */}
          <NavigatorMastHead
            activeScope={activeScope}
            stats={props.stats}
            resultsCount={props.resultsCount}
          />

          {/* ZONE 2 — Scope tabs (primary navigation, underline-style).
              Sits flush against the masthead with only a soft 1px hairline
              along its baseline — no extra row separator above. */}
          <div className="px-5">
            <div style={{ borderBottom: `1px solid ${VT.rule}` }}>
              <ScopeTabs
                scope={props.scope}
                onScopeChange={props.onScopeChange}
                scopeCounts={props.scopeCounts}
              />
            </div>
          </div>

          {/* ZONE 3 — Refinement (sub-filter chips + selector + sort console).
              Tighter vertical rhythm (pt-2.5 / pb-3.5) keeps it visually
              chained to the scope tabs above instead of feeling like a
              separate utility strip. */}
          <div className="px-5 pt-2.5 pb-3.5">
            <ContextBar {...props} communities={communityList} />
          </div>
        </div>
      </div>
    </div>
  )
}
