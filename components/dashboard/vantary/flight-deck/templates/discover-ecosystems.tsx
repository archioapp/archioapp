"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   <DiscoverEcosystemsTemplate />

   The marquee surface of THE COLLECTIVE room and the second canonical
   reference implementation in the Universal Template Engine (after
   Compare Mentors). It is the radial ecosystem finder migrated from the
   legacy `/communities` page — twenty-one operational dimensions arranged
   across three concentric orbits (Platform Intelligence · Support
   Structure · Market & Style). The trader clicks a node to apply that
   dimension as a filter; the matched ecosystems live underneath. A
   natural-language search at the centre routes free-form phrases ("find
   me an Asian-session swing community with live calls") through the same
   filter machinery.

   Anatomy (mirrors the TemplateShell seven-zone contract):

       ZONE 1 · Identity strip      → owned by TemplateShell
       ZONE 2 · Prelude + headline  → owned by TemplateShell
       ZONE 3 · Inputs              → NL search + filter chip rail
       ZONE 4 · Resolver            → match count + sort presets
       ZONE 5 · Render plan         → the radial canvas + matched rail
       ZONE 6 · Drill-forward       → owned by TemplateShell
       ZONE 7 · Footer telemetry    → owned by TemplateShell

   Pure render. All state is local; the underlying source-of-truth lives
   in `communities-source.ts` and every transform happens in
   `communities-translate.ts`. No localStorage, no client-side mutation
   of upstream data — the trader's current filter set is ephemeral until
   the registry persistence path comes online (M07+).
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Search,
  X,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  RotateCcw,
  Users,
  Activity,
  Radio,
  CircleDot,
  Compass,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Lock,
  Unlock,
  Send,
  MessageCircle,
  CheckCircle,
} from "lucide-react"

import { VANTARY, EASE_V } from "../../vantary-theme"
import {
  FdCorners,
  FdDashedRule,
  FdRouteId,
} from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"

import {
  COMMUNITY_DIMENSIONS,
  RING_TITLES,
  MOCK_COMMUNITIES,
  applyDimensionToFilters,
  filterCommunities,
  findDimensionById,
  type Community,
  type CommunityDimension,
  type CommunityFilters,
} from "../communities-source"
import {
  buildOrbitNodes,
  polarToCartesian,
  buildConstellation,
  buildFilterChips,
  removeFilterChip,
  rankCommunitiesAgainstFilters,
  type OrbitNode,
  type FilterChip,
} from "../communities-translate"
import { getDimensionIcon } from "../communities-icons"

/* ═════════════════════════════════════════════════════════════════════════
   Public API
   ═════════════════════════════════════════════════════════════════════════ */

export interface DiscoverEcosystemsTemplateProps {
  /** Pre-applied filter set from a click path or NL intent. */
  initialFilters?: CommunityFilters
  /** Pre-activated dimension ids (the "click these nodes" path). */
  initialActiveNodeIds?: readonly string[]
  /** Echo of the raw natural-language query if relevant. */
  rawQuery?: string
  /** Optional resolver hint (e.g. "Discovered 8 matches via natural language"). */
  resolverNote?: string
  /** Imperative dispatcher provided by the viewport — opens another
   *  template. Wired in M07; safe to omit during M04. */
  openTemplate?: (id: string, params?: Record<string, unknown>) => void
  /** Drill-forward suggestions sourced from the registry. */
  drillForward?: readonly DrillForwardSuggestion[]
  /** Close handler. */
  onClose?: () => void
  /** Pin handler. */
  onPin?: () => void
  /** Whether template is currently pinned. */
  pinned?: boolean
}

/* ═════════════════════════════════════════════════════════════════════════
   Tone constants — tuned per Vantary doctrine. The radial canvas uses
   relative sizing so it scales cleanly down to ~520px wide.
   ═════════════════════════════════════════════════════════════════════════ */

const RADIAL_BOX = 720             // SVG square side in px (max). Container clamps.
const NODE_RADIUS_BASE = 42        // ULTRA: base node hit-target radius
const NODE_RADIUS_HOVER = 56       // ULTRA: hover hit-target radius (dramatic expansion)
const NODE_ICON_BASE = 38          // ULTRA: base icon glyph size (fills the node completely)
const NODE_ICON_HOVER = 48         // ULTRA: hover icon glyph size (big and bold)
const RING_DASH = "4,6"            // ULTRA: dashed ring stroke pattern (more visible)
const CONSTELLATION_DASH = "2,4"   // ULTRA: constellation line stroke pattern
const CALLOUT_WIDTH = 300          // ULTRA: hover callout width (rich content)
const CALLOUT_OFFSET = 20          // distance from node centre to callout edge
const TOP_MATCHES = 6              // how many ecosystems to surface in the rail
const RING_LABEL_OFFSET = 22       // ULTRA: distance from ring edge to ring label

/* ═════════════════════════════════════════════════════════════════════════
   Component
   ═════════════════════════════════════════════════════════════════════════ */

export function DiscoverEcosystemsTemplate({
  initialFilters,
  initialActiveNodeIds,
  rawQuery,
  resolverNote,
  openTemplate,
  drillForward,
  onClose,
  onPin,
  pinned = false,
}: DiscoverEcosystemsTemplateProps) {
  const reduceMotion = useReducedMotion()

  /* ── Filter state ────────────────────────────────────────────────────
     We track *both* the active-node-id set and the filters object. The
     two are bidirectionally linked: clicking a node toggles its dim into
     filters, and removing a chip pulls the corresponding node out of the
     active set. The active-node set is the canonical UI state; filters
     is its projection.
  ──────────────────────────────────────────────────────────────────── */
  const [activeNodeIds, setActiveNodeIds] = React.useState<readonly string[]>(
    initialActiveNodeIds ?? [],
  )
  const [filters, setFilters] = React.useState<CommunityFilters>(
    initialFilters ?? {
      search: "",
      assetClass: "",
      tradingStyle: "",
      sessionFocus: "",
      visibility: "",
      hasArchioAi: false,
      hasLiveCalls: false,
      verified: false,
      beginnerFriendly: false,
      hasMentorDashboard: false,
      liveNowOnly: false,
      sortBy: "activity",
    },
  )

  /* ── React to incoming props (e.g. NL intent re-routes here) ────── */
  React.useEffect(() => {
    if (initialActiveNodeIds) setActiveNodeIds(initialActiveNodeIds)
  }, [initialActiveNodeIds])
  React.useEffect(() => {
    if (initialFilters) setFilters((prev) => ({ ...prev, ...initialFilters }))
  }, [initialFilters])

  /* ── Derived: orbit nodes + canvas geometry + constellation ─────── */
  const orbitNodes = React.useMemo(() => buildOrbitNodes(), [])
  const constellation = React.useMemo(
    () => buildConstellation(activeNodeIds, orbitNodes, RADIAL_BOX),
    [activeNodeIds, orbitNodes],
  )

  /* ── Derived: filter chips (visible in inputs zone) ─────────────── */
  const filterChips = React.useMemo(() => buildFilterChips(filters), [filters])

  /* ── Derived: ranked community matches ──────────────────────────── */
  const ranked = React.useMemo(
    () => rankCommunitiesAgainstFilters(filterCommunities(filters), filters),
    [filters],
  )
  const matchCount = ranked.length
  const topMatches = ranked.slice(0, TOP_MATCHES)

  /* ── Hover state — drives the node callout ──────────────────────── */
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  /* ── Toggling a node ─────────────────────────────────────────────── */
  const toggleNode = React.useCallback(
    (dim: CommunityDimension) => {
      setActiveNodeIds((prev) => {
        const isOn = prev.includes(dim.id)
        const next = isOn ? prev.filter((id) => id !== dim.id) : [...prev, dim.id]
        // Project the new active set onto filters.
        setFilters((f) => applyDimensionToFilters(f, dim, !isOn))
        return next
      })
    },
    [],
  )

  /* ── Removing a chip — also retract the corresponding node id ────── */
  const onRemoveChip = React.useCallback(
    (chip: FilterChip) => {
      setFilters((f) => removeFilterChip(f, chip))
      // Find any active node whose dim maps onto this chip and de-activate it.
      setActiveNodeIds((prev) => {
        const next = [...prev]
        for (const id of prev) {
          const dim = findDimensionById(id)
          if (!dim) continue
          if (
            (chip.removeKey === "assetClass" && dim.filterKey === "asset_class") ||
            (chip.removeKey === "tradingStyle" && dim.filterKey === "trading_style") ||
            (chip.removeKey === "sessionFocus" && dim.filterKey === "session_focus") ||
            (chip.removeKey === "visibility" && dim.filterKey === "visibility") ||
            (chip.removeKey === "hasArchioAi" && dim.filterKey === "has_ai") ||
            (chip.removeKey === "hasLiveCalls" && dim.filterKey === "has_live_calls") ||
            (chip.removeKey === "verified" && dim.filterKey === "verified") ||
            (chip.removeKey === "beginnerFriendly" && dim.filterKey === "beginner_friendly") ||
            (chip.removeKey === "hasMentorDashboard" && dim.filterKey === "has_mentor_dashboard") ||
            (chip.removeKey === "liveNowOnly" && dim.filterKey === "live_now")
          ) {
            const idx = next.indexOf(id)
            if (idx >= 0) next.splice(idx, 1)
          }
        }
        return next
      })
    },
    [],
  )

  /* ── Reset all ───────────────────────────────────────────────────── */
  const onResetAll = React.useCallback(() => {
    setActiveNodeIds([])
    setFilters({
      search: "",
      assetClass: "",
      tradingStyle: "",
      sessionFocus: "",
      visibility: "",
      hasArchioAi: false,
      hasLiveCalls: false,
      verified: false,
      beginnerFriendly: false,
      hasMentorDashboard: false,
      liveNowOnly: false,
      sortBy: "activity",
    })
  }, [])

  /* ── Search submission ──────────────────────────────────────────── */
  const [pendingSearch, setPendingSearch] = React.useState(filters.search ?? "")
  const onSubmitSearch = React.useCallback(() => {
    setFilters((f) => ({ ...f, search: pendingSearch.trim() }))
  }, [pendingSearch])

  /* ── Sort ────────────────────────────────────────────────────────── */
  const onChangeSort = React.useCallback(
    (sortBy: NonNullable<CommunityFilters["sortBy"]>) => {
      setFilters((f) => ({ ...f, sortBy }))
    },
    [],
  )

  /* ─────────────────────────────────────────────────────────────────
     Render — composed via TemplateShell zones.
     ───────────────────────────────────────────────────────────────── */

  return (
    <TemplateShell
      id="collective.discover-ecosystems"
      eyebrow="THE COLLECTIVE · DISCOVER · LIVE"
      routeId="C-DSC"
      headline="Find your ecosystem."
      subheadline="Twenty-one operational dimensions across three orbits. Click to compose your filter."
      prelude={
        <span>
          The radial ecosystem finder. Each node is a real operational
          dimension — <em style={{ color: VANTARY.paper }}>asset class</em>,{" "}
          <em style={{ color: VANTARY.paper }}>session focus</em>,{" "}
          <em style={{ color: VANTARY.paper }}>verified mentors</em>,{" "}
          <em style={{ color: VANTARY.paper }}>AI-trained model</em>, and seventeen
          others. Click nodes to filter; the matched ecosystems live below.
          {rawQuery ? (
            <>
              {" "}
              <span style={{ color: VANTARY.amber }}>
                Routed from natural language: &quot;{rawQuery}&quot;.
              </span>
            </>
          ) : null}
        </span>
      }
      inputs={
        <DiscoverInputs
          pendingSearch={pendingSearch}
          onChangePending={setPendingSearch}
          onSubmit={onSubmitSearch}
          chips={filterChips}
          onRemoveChip={onRemoveChip}
          onResetAll={onResetAll}
        />
      }
      resolver={
        <DiscoverResolver
          matchCount={matchCount}
          totalCount={MOCK_COMMUNITIES.length}
          activeDimensionCount={activeNodeIds.length}
          sortBy={filters.sortBy ?? "activity"}
          onChangeSort={onChangeSort}
          resolverNote={resolverNote}
        />
      }
      renderPlan={
        <DiscoverRenderPlan
          orbitNodes={orbitNodes}
          activeNodeIds={activeNodeIds}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          onToggle={toggleNode}
          constellation={constellation}
          topMatches={topMatches}
          openTemplate={openTemplate}
          reduceMotion={!!reduceMotion}
        />
      }
      drillForward={drillForward}
      sources={["EcosystemRegistry", "MentorVault", "ProofOfEdge"]}
      lastRefreshed={"just now"}
      state="ready"
      onClose={onClose}
      onPin={onPin}
      pinned={pinned}
    />
  )
}

/* ═══════���═════════════���═══════════════════════════════════════════════════
   ZONE 3 · INPUTS — NL search + filter chip rail
   ═══════════════════════════════════════════════���═══════════════���════���════ */

function DiscoverInputs({
  pendingSearch,
  onChangePending,
  onSubmit,
  chips,
  onRemoveChip,
  onResetAll,
}: {
  pendingSearch: string
  onChangePending: (v: string) => void
  onSubmit: () => void
  chips: readonly FilterChip[]
  onRemoveChip: (chip: FilterChip) => void
  onResetAll: () => void
}) {
  const placeholder =
    "Try: \"Asian-session swing community with live calls\"…"
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* ── NL search bar ───────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 rounded-xl"
        style={{
          padding: "10px 14px",
          background: VANTARY.glass,
          border: `1px solid ${VANTARY.rule}`,
        }}
      >
        <Search size={14} strokeWidth={1.7} color={VANTARY.ashSoft} />
        <input
          type="text"
          value={pendingSearch}
          onChange={(e) => onChangePending(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder={placeholder}
          aria-label="Search ecosystems by name, tag, or description"
          className="flex-1 bg-transparent outline-none font-sans"
          style={{
            fontSize: 13.5,
            color: VANTARY.paper,
            letterSpacing: "-0.005em",
          }}
        />
        <kbd
          className="font-mono uppercase select-none"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
            padding: "2px 6px",
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 4,
          }}
        >
          ⏎
        </kbd>
      </div>

      {/* ── Filter chip rail ───────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {chips.length > 0 ? (
          <motion.div
            key="chip-rail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 flex-wrap"
            role="list"
            aria-label="Active filters"
          >
            <AnimatePresence mode="popLayout">
              {chips.map((chip) => (
                <FilterChipPill
                  key={chip.id}
                  chip={chip}
                  onRemove={() => onRemoveChip(chip)}
                />
              ))}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={onResetAll}
              whileHover={{ scale: 1.03, borderColor: VANTARY.amber }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 font-mono uppercase rounded-full transition-colors"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.2em",
                padding: "5px 10px",
                color: VANTARY.ashSoft,
                border: `1px dashed ${VANTARY.rule}`,
                background: "transparent",
              }}
              aria-label="Reset all filters"
            >
              <RotateCcw size={10} strokeWidth={1.5} />
              RESET ALL
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-mono uppercase"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.2em",
              color: VANTARY.ashSoft,
            }}
          >
            NO FILTERS APPLIED · CLICK A NODE TO BEGIN COMPOSING
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterChipPill({
  chip,
  onRemove,
}: {
  chip: FilterChip
  onRemove: () => void
}) {
  return (
    <motion.span
      role="listitem"
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -10 }}
      transition={{ duration: 0.2, ease: EASE_V }}
      whileHover={{ scale: 1.02 }}
      className="inline-flex items-center gap-2 rounded-full"
      style={{
        padding: "4px 4px 4px 10px",
        background: VANTARY.amberWash,
        border: `1px solid ${VANTARY.amberHalo}`,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.2em",
          color: VANTARY.amber,
        }}
      >
        {chip.label}
      </span>
      <span
        className="font-sans"
        style={{
          fontSize: 11.5,
          color: VANTARY.paper,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {chip.value}
      </span>
      <motion.button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${chip.label} filter`}
        whileHover={{ scale: 1.1, backgroundColor: VANTARY.amber }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center justify-center rounded-full transition-colors"
        style={{
          width: 18,
          height: 18,
          background: "transparent",
          border: `1px solid ${VANTARY.amberHalo}`,
        }}
      >
        <X size={10} strokeWidth={2} color={VANTARY.amber} />
      </motion.button>
    </motion.span>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 4 · RESOLVER — match count + sort presets + resolver note
   ═════════════════════════════════════════════════════════════════════════ */

function DiscoverResolver({
  matchCount,
  totalCount,
  activeDimensionCount,
  sortBy,
  onChangeSort,
  resolverNote,
}: {
  matchCount: number
  totalCount: number
  activeDimensionCount: number
  sortBy: NonNullable<CommunityFilters["sortBy"]>
  onChangeSort: (sortBy: NonNullable<CommunityFilters["sortBy"]>) => void
  resolverNote?: string
}) {
  const sortOptions: { value: NonNullable<CommunityFilters["sortBy"]>; label: string }[] = [
    { value: "activity", label: "ACTIVITY" },
    { value: "members", label: "MEMBERS" },
    { value: "rating", label: "TRUSTED" },
    { value: "newest", label: "NEWEST" },
  ]
  return (
    <div
      className="flex items-center gap-4 px-5 py-3 flex-wrap"
      style={{ borderTop: `1px solid ${VANTARY.ruleSoft}`, borderBottom: `1px solid ${VANTARY.ruleSoft}` }}
    >
      {/* match count */}
      <div className="flex items-baseline gap-2">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          MATCHED
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 22,
            color: matchCount > 0 ? VANTARY.amber : VANTARY.ash,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          {String(matchCount).padStart(2, "0")}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 12,
            color: VANTARY.ashSoft,
            letterSpacing: "-0.005em",
          }}
        >
          / {String(totalCount).padStart(2, "0")}
        </span>
      </div>

      {/* dimensions active */}
      <div className="flex items-baseline gap-2">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          DIMENSIONS
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 14,
            color: activeDimensionCount > 0 ? VANTARY.paper : VANTARY.ash,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {String(activeDimensionCount).padStart(2, "0")}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: VANTARY.ashSoft,
            letterSpacing: "-0.005em",
          }}
        >
          / 21
        </span>
      </div>

      {/* spacer */}
      <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />

      {/* resolver note */}
      {resolverNote ? (
        <span
          className="font-sans italic"
          style={{
            fontSize: 11,
            color: VANTARY.ashSoft,
            letterSpacing: "-0.005em",
          }}
        >
          {resolverNote}
        </span>
      ) : null}

      {/* sort presets */}
      <div className="flex items-center gap-1.5">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
            marginRight: 4,
          }}
        >
          SORT
        </span>
        {sortOptions.map((opt) => {
          const active = sortBy === opt.value
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChangeSort(opt.value)}
              aria-pressed={active}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-mono uppercase rounded-full"
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                padding: "4px 9px",
                color: active ? VANTARY.amber : VANTARY.ashSoft,
                border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
                background: active ? VANTARY.amberWash : "transparent",
                transition: "all 150ms",
              }}
            >
              {opt.label}
            </motion.button>
          )
        })}
      </div>

      {/* View toggle + filter hint */}
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center rounded-lg"
          style={{
            width: 28,
            height: 28,
            background: VANTARY.glass,
            border: `1px solid ${VANTARY.rule}`,
          }}
          aria-label="Grid view"
        >
          <LayoutGrid size={12} strokeWidth={1.5} color={VANTARY.amber} />
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center rounded-lg"
          style={{
            width: 28,
            height: 28,
            background: "transparent",
            border: `1px solid ${VANTARY.rule}`,
          }}
          aria-label="List view"
        >
          <List size={12} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </motion.button>
        <div
          style={{ width: 1, height: 16, background: VANTARY.rule, marginLeft: 4, marginRight: 4 }}
          aria-hidden
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1.5 font-mono uppercase rounded-lg"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            padding: "6px 10px",
            color: VANTARY.ashSoft,
            background: "transparent",
            border: `1px solid ${VANTARY.rule}`,
          }}
          aria-label="Advanced filters"
        >
          <SlidersHorizontal size={11} strokeWidth={1.5} />
          FILTERS
        </motion.button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════��════════════════════════════
   ZONE 5 · RENDER PLAN — radial canvas + matched rail
   ═════════════════════════════════════════════════════════════════════════ */

function DiscoverRenderPlan({
  orbitNodes,
  activeNodeIds,
  hoveredId,
  onHover,
  onToggle,
  constellation,
  topMatches,
  openTemplate,
  reduceMotion,
}: {
  orbitNodes: readonly OrbitNode[]
  activeNodeIds: readonly string[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onToggle: (dim: CommunityDimension) => void
  constellation: ReturnType<typeof buildConstellation>
  topMatches: readonly { community: Community; score: number; matchPct: number }[]
  openTemplate?: (id: string, params?: Record<string, unknown>) => void
  reduceMotion: boolean
}) {
  return (
    <div className="px-5 pt-2 pb-5 flex flex-col gap-5">
      <RadialCanvas
        orbitNodes={orbitNodes}
        activeNodeIds={activeNodeIds}
        hoveredId={hoveredId}
        onHover={onHover}
        onToggle={onToggle}
        constellation={constellation}
        reduceMotion={reduceMotion}
      />
      <MatchedRail
        topMatches={topMatches}
        openTemplate={openTemplate}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Radial canvas — three concentric dashed rings + 21 orbit nodes.
   ───────────────────────────────────────────────────────────────────── */

function RadialCanvas({
  orbitNodes,
  activeNodeIds,
  hoveredId,
  onHover,
  onToggle,
  constellation,
  reduceMotion,
}: {
  orbitNodes: readonly OrbitNode[]
  activeNodeIds: readonly string[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onToggle: (dim: CommunityDimension) => void
  constellation: ReturnType<typeof buildConstellation>
  reduceMotion: boolean
}) {
  // Ring radii in absolute px against RADIAL_BOX
  const cx = RADIAL_BOX / 2
  const cy = RADIAL_BOX / 2
  const r0 = (RADIAL_BOX / 2) * 0.32
  const r1 = (RADIAL_BOX / 2) * 0.56
  const r2 = (RADIAL_BOX / 2) * 0.84

  // Progressive ring unlock system
  const activeNodeSet = new Set(activeNodeIds)
  const hasRing0Selection = orbitNodes.some(n => n.ringIndex === 0 && activeNodeSet.has(n.id))
  const hasRing1Selection = orbitNodes.some(n => n.ringIndex === 1 && activeNodeSet.has(n.id))
  
  // Ring unlock logic: inner ring always unlocked, outer rings unlock progressively
  const isRingUnlocked = (ringIdx: 0 | 1 | 2): boolean => {
    if (ringIdx === 0) return true // Inner ring always unlocked
    if (ringIdx === 1) return hasRing0Selection // Middle ring unlocks when inner has selection
    return hasRing0Selection && hasRing1Selection // Outer ring unlocks when both inner have selections
  }

  // Currently hovered or active node — used to render the callout above
  // the canvas. Active wins over hover for callout placement, since
  // hover is fleeting.
  const focusedNode =
    (hoveredId && orbitNodes.find((n) => n.id === hoveredId)) ||
    (activeNodeIds.length > 0
      ? orbitNodes.find((n) => n.id === activeNodeIds[activeNodeIds.length - 1]!)
      : null) ||
    null

  return (
    <div
      className="relative w-full"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, ${VANTARY.amberWash} 0%, transparent 55%),
          ${VANTARY.glass}
        `,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <FdCorners inset={12} size={10} />

      {/* Ring labels — three calm mono captions on the right edge ── */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end font-mono uppercase select-none">
        {(["RING 00", "RING 01", "RING 02"] as const).map((label, idx) => (
          <span
            key={label}
            className="flex items-center gap-2"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: VANTARY.ashSoft,
            }}
          >
            <span style={{ color: VANTARY.amber }}>{label}</span>
            <span>· {RING_TITLES[idx as 0 | 1 | 2].toUpperCase()}</span>
          </span>
        ))}
      </div>

      {/* Reset hover when leaving the whole canvas. */}
      <div
        onMouseLeave={() => onHover(null)}
        className="relative w-full"
        style={{ aspectRatio: "1 / 1", maxWidth: RADIAL_BOX, margin: "0 auto" }}
      >
        <svg
          viewBox={`0 0 ${RADIAL_BOX} ${RADIAL_BOX}`}
          width="100%"
          height="100%"
          role="img"
          aria-label="Radial finder · twenty-one operational dimensions across three orbits"
        >
          {/* Subtle radial backdrop fills */}
          <defs>
            <radialGradient id="dec-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={VANTARY.amber} stopOpacity={0.10} />
              <stop offset="60%" stopColor={VANTARY.amber} stopOpacity={0.02} />
              <stop offset="100%" stopColor={VANTARY.amber} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r2 + 8} fill="url(#dec-glow)" />

          {/* Three dashed rings with selection glow */}
          {[r0, r1, r2].map((r, idx) => {
            const ringHasSelection = idx === 0 ? hasRing0Selection : idx === 1 ? hasRing1Selection : 
              orbitNodes.some(n => n.ringIndex === 2 && activeNodeSet.has(n.id))
            const isUnlocked = isRingUnlocked(idx as 0 | 1 | 2)
            
            return (
              <g key={`ring-${idx}`}>
                {/* Glow ring when selected */}
                {ringHasSelection && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={VANTARY.amber}
                    strokeOpacity={0.15}
                    strokeWidth={8}
                    style={{ filter: "blur(4px)" }}
                  />
                )}
                {/* Main ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={ringHasSelection ? VANTARY.amber : isUnlocked ? VANTARY.amber : VANTARY.ash}
                  strokeOpacity={ringHasSelection ? 0.6 : isUnlocked ? (0.22 - idx * 0.05) : 0.1}
                  strokeWidth={ringHasSelection ? 1.5 : 1}
                  strokeDasharray={RING_DASH}
                >
                  {/* Animated dash for active rings */}
                  {ringHasSelection && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to={idx % 2 === 0 ? "-20" : "20"}
                      dur={`${3 + idx}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              </g>
            )
          })}

          {/* Cross-hair guides — extremely faint */}
          <line
            x1={cx} y1={8} x2={cx} y2={RADIAL_BOX - 8}
            stroke={VANTARY.rule} strokeWidth={1} strokeDasharray="2,6"
          />
          <line
            x1={8} y1={cy} x2={RADIAL_BOX - 8} y2={cy}
            stroke={VANTARY.rule} strokeWidth={1} strokeDasharray="2,6"
          />

          {/* Constellation lines (under nodes) */}
          {constellation.map((line) => (
            <g key={line.id}>
              <line
                x1={line.fromX} y1={line.fromY}
                x2={line.toX}   y2={line.toY}
                stroke={VANTARY.amber}
                strokeOpacity={0.32}
                strokeWidth={1}
                strokeDasharray={CONSTELLATION_DASH}
              />
              <text
                x={line.fromX + (line.toX - line.fromX) * line.labelT}
                y={line.fromY + (line.toY - line.fromY) * line.labelT - 4}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.2em"
                fill={VANTARY.amber}
                opacity={0.7}
              >
                {line.routeId}
              </text>
            </g>
          ))}

          {/* Centre disc — quiet anchor that frames the prompt */}
          <circle
            cx={cx} cy={cy} r={48}
            fill={VANTARY.glassDeep}
            stroke={VANTARY.amberHalo}
            strokeWidth={1}
          />
          <circle
            cx={cx} cy={cy} r={6}
            fill={VANTARY.amber}
            opacity={0.85}
          />

          {/* Twenty-one orbit nodes */}
          {orbitNodes.map((node) => (
            <RadialNode
              key={node.id}
              node={node}
              active={activeNodeIds.includes(node.id)}
              hovered={hoveredId === node.id}
              onHover={onHover}
              onToggle={onToggle}
              reduceMotion={reduceMotion}
              isUnlocked={isRingUnlocked(node.ringIndex)}
            />
          ))}
        </svg>

        {/* HTML overlay for the centre core — interactive search hub */}
        <CentreCore
          activeNodeIds={activeNodeIds}
          orbitNodes={orbitNodes}
          onToggle={onToggle}
        />

        {/* Hover/active callout — positioned over the focused node */}
        <AnimatePresence>
          {focusedNode ? (
            <NodeCallout
              key={focusedNode.id}
              node={focusedNode}
              isActive={activeNodeIds.includes(focusedNode.id)}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   CentreCore — the interactive hub at the center of the radial finder.
   When collapsed: shows "Click a node to begin" or active count.
   When hovered/focused: expands to reveal a search input that filters
   dimensions by name, allowing quick keyboard-driven navigation.
   ───────────────────────────────────────────────────────────────────── */

function CentreCore({
  activeNodeIds,
  orbitNodes,
  onToggle,
}: {
  activeNodeIds: readonly string[]
  orbitNodes: readonly OrbitNode[]
  onToggle: (dim: CommunityDimension) => void
}) {
  const [expanded, setExpanded] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Filter dimensions by search query
  const filteredDimensions = React.useMemo(() => {
    if (!search.trim()) return orbitNodes.slice(0, 6)
    const q = search.toLowerCase()
    return orbitNodes.filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        n.short.toLowerCase().includes(q) ||
        n.dimension.meaning.toLowerCase().includes(q)
    )
  }, [search, orbitNodes])

  // Focus input when expanded
  React.useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [expanded])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_V }}
            onMouseLeave={() => {
              setExpanded(false)
              setSearch("")
            }}
            className="flex flex-col items-center"
            style={{
              width: 260,
              background: VANTARY.glassDeep,
              border: `1px solid ${VANTARY.amberHalo}`,
              borderRadius: 20,
              padding: "16px 18px",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              boxShadow: `0 0 60px ${VANTARY.amberWash}, 0 16px 48px rgba(0,0,0,0.5)`,
            }}
          >
            <FdCorners inset={8} size={8} />

            {/* Header */}
            <div className="flex items-center gap-2 w-full mb-3">
              <Compass size={16} color={VANTARY.amber} strokeWidth={1.5} />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: VANTARY.amber,
                }}
              >
                DIMENSION FINDER
              </span>
            </div>

            {/* Search input */}
            <div
              className="flex items-center gap-2 w-full"
              style={{
                background: VANTARY.ink,
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              <Search size={14} color={VANTARY.ashSoft} strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter dimensions..."
                className="flex-1 bg-transparent outline-none font-sans"
                style={{
                  fontSize: 12,
                  color: VANTARY.paper,
                  letterSpacing: "-0.005em",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={12} color={VANTARY.paper} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Filtered dimension list */}
            <div
              className="flex flex-col gap-1 w-full mt-3"
              style={{ maxHeight: 140, overflowY: "auto" }}
            >
              {filteredDimensions.length === 0 ? (
                <div
                  className="font-mono text-center py-2"
                  style={{
                    fontSize: 10,
                    color: VANTARY.ashSoft,
                    letterSpacing: "0.1em",
                  }}
                >
                  NO MATCHES
                </div>
              ) : (
                filteredDimensions.map((node) => {
                  const isActive = activeNodeIds.includes(node.id)
                  const Icon = getDimensionIcon(node.id)
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => onToggle(node.dimension)}
                      className="flex items-center gap-2 w-full text-left rounded-lg transition-colors"
                      style={{
                        padding: "6px 8px",
                        background: isActive ? VANTARY.amberWash : "transparent",
                        border: `1px solid ${isActive ? VANTARY.amber : "transparent"}`,
                      }}
                    >
                      <Icon size={14} intensity={isActive ? "active" : "idle"} />
                      <span
                        className="font-sans flex-1 truncate"
                        style={{
                          fontSize: 11,
                          color: isActive ? VANTARY.amber : VANTARY.paper,
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {node.label}
                      </span>
                      {isActive && (
                        <span
                          className="font-mono uppercase"
                          style={{
                            fontSize: 7,
                            color: VANTARY.amber,
                            letterSpacing: "0.15em",
                          }}
                        >
                          ON
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            {/* Hint */}
            <div
              className="font-mono uppercase mt-3 pt-2 text-center w-full"
              style={{
                fontSize: 8,
                letterSpacing: "0.18em",
                color: VANTARY.ashSoft,
                borderTop: `1px solid ${VANTARY.rule}`,
              }}
            >
              TYPE TO FILTER · CLICK TO TOGGLE
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15, ease: EASE_V }}
            onMouseEnter={() => setExpanded(true)}
            className="flex flex-col items-center gap-2 select-none cursor-pointer"
            style={{ padding: "12px 20px" }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.28em",
                color: VANTARY.amber,
              }}
            >
              C-DSC · CORE
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: 13,
                color: VANTARY.paper,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {activeNodeIds.length === 0
                ? "Click a node to begin"
                : `${activeNodeIds.length} dimension${activeNodeIds.length === 1 ? "" : "s"} active`}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.15em",
                color: VANTARY.ashSoft,
              }}
            >
              HOVER TO SEARCH
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   RadialNode — single orbit node. Renders inside the SVG. The hit
   target is a foreignObject that wraps the icon — gives us hover
   semantics without losing SVG positioning.
   ───────────────────────────────────────────────────────────────────── */

function RadialNode({
  node,
  active,
  hovered,
  onHover,
  onToggle,
  reduceMotion,
  isUnlocked = true,
}: {
  node: OrbitNode
  active: boolean
  hovered: boolean
  onHover: (id: string | null) => void
  onToggle: (dim: CommunityDimension) => void
  reduceMotion: boolean
  isUnlocked?: boolean
}) {
  const { x, y } = polarToCartesian(node.theta, node.radius, RADIAL_BOX)
  const expanded = hovered || active
  const r = expanded ? NODE_RADIUS_HOVER : NODE_RADIUS_BASE
  const iconSize = expanded ? NODE_ICON_HOVER : NODE_ICON_BASE

  const Icon = getDimensionIcon(node.id)
  
  // Locked state - show different visuals
  const isLocked = !isUnlocked && !active

  return (
    <g
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => !isLocked && onToggle(node.dimension)}
      style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
      role="button"
      aria-pressed={active}
      aria-label={`${node.label} · ${isLocked ? "locked - select inner ring first" : active ? "remove from filter" : "add to filter"}`}
      tabIndex={isLocked ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isLocked) {
          e.preventDefault()
          onToggle(node.dimension)
        }
      }}
    >
      {/* ULTRA: Outer glow ring — always visible, pulses on hover/active */}
      <motion.circle
        cx={x}
        cy={y}
        r={r + 6}
        fill="none"
        stroke={active ? VANTARY.amber : hovered ? VANTARY.paper : VANTARY.rule}
        strokeWidth={active ? 2 : 1}
        strokeOpacity={active ? 0.6 : hovered ? 0.4 : 0.15}
        strokeDasharray={active ? "none" : "4,4"}
        initial={false}
        animate={{
          strokeOpacity: active ? [0.6, 0.9, 0.6] : hovered ? 0.4 : 0.15,
        }}
        transition={{
          strokeOpacity: active
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 },
        }}
      />
      {/* ULTRA: Multi-layer glow backdrop for expanded nodes */}
      {expanded && (
        <>
          <circle
            cx={x}
            cy={y}
            r={r + 24}
            fill={active ? VANTARY.amber : VANTARY.paper}
            fillOpacity={active ? 0.08 : 0.02}
          />
          <circle
            cx={x}
            cy={y}
            r={r + 12}
            fill={active ? VANTARY.amber : VANTARY.paper}
            fillOpacity={active ? 0.15 : 0.05}
          />
        </>
      )}
      {/* ULTRA: Triple-wave pulse for active nodes */}
      {active && !reduceMotion && (
        <>
          <motion.circle
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke={VANTARY.amber}
            strokeOpacity={0.6}
            strokeWidth={2.5}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 2.0, repeat: Infinity, ease: "easeOut" }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
          <motion.circle
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke={VANTARY.amber}
            strokeOpacity={0.4}
            strokeWidth={1.5}
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
          <motion.circle
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke={VANTARY.amber}
            strokeOpacity={0.25}
            strokeWidth={1}
            initial={{ scale: 1, opacity: 0.25 }}
            animate={{ scale: 4.2, opacity: 0 }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeOut", delay: 1.0 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        </>
      )}
      {/* ULTRA: Icon — borderless, full-size, SPINNING continuously when active. */}
      <foreignObject
        x={x - iconSize / 2}
        y={y - iconSize / 2}
        width={iconSize}
        height={iconSize}
        style={{ pointerEvents: "none", overflow: "visible" }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: expanded ? 1.2 : 1,
            rotate: reduceMotion ? 0 : (active ? 360 : (hovered ? 15 : 0)),
            opacity: isLocked ? 0.35 : 1,
          }}
          transition={{
            scale: { duration: 0.2, ease: EASE_V },
            rotate: active
              ? { duration: 6, repeat: Infinity, ease: "linear" }
              : { duration: 0.3, ease: EASE_V },
            opacity: { duration: 0.2 },
          }}
          style={{
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            size={iconSize}
            intensity={active ? "active" : hovered ? "hover" : (isLocked ? "idle" : "idle")}
          />
        </motion.div>
      </foreignObject>

      {/* Lock icon overlay for locked nodes */}
      {isLocked && (
        <foreignObject
          x={x + r * 0.4}
          y={y - r * 0.8}
          width={20}
          height={20}
          style={{ pointerEvents: "none", overflow: "visible" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 18,
              height: 18,
              background: VANTARY.ink,
              border: `1px solid ${VANTARY.rule}`,
            }}
          >
            <Lock size={10} strokeWidth={2} color={VANTARY.ashSoft} />
          </motion.div>
        </foreignObject>
      )}

      {/* ULTRA: Dimension name — ALWAYS visible, big and bold */}
      <text
        x={x}
        y={y + r + 18}
        textAnchor="middle"
        fontSize={expanded ? "12" : "10"}
        fontFamily="ui-monospace, monospace"
        fontWeight={expanded ? 700 : 500}
        letterSpacing="0.06em"
        fill={active ? VANTARY.amber : hovered ? VANTARY.paper : VANTARY.ash}
        style={{
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        {node.short}
      </text>
      {/* ULTRA: Ring category label — only visible on expanded nodes */}
      {expanded && (
        <text
          x={x}
          y={y + r + 32}
          textAnchor="middle"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fontWeight={400}
          letterSpacing="0.12em"
          fill={active ? VANTARY.amber : VANTARY.ashSoft}
          fillOpacity={0.7}
          style={{
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {node.eyebrow}
        </text>
      )}
    </g>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   NodeCallout — appears near the focused node with full meaning copy.
   Positioned via absolute coords against the percentage-sized canvas
   so it tracks correctly at any breakpoint.
   ───────────────────────────────────────────────────────────────────── */

function NodeCallout({
  node,
  isActive,
}: {
  node: OrbitNode
  isActive: boolean
}) {
  const { x, y } = polarToCartesian(node.theta, node.radius, RADIAL_BOX)
  const Icon = getDimensionIcon(node.id)

  // Place callout in the quadrant *opposite* the node so it never
  // overlaps the node and stays inside the canvas.
  const onLeft = x > RADIAL_BOX / 2
  const onTop = y > RADIAL_BOX / 2

  // Convert to percentages so the callout tracks the responsive canvas.
  const xPct = (x / RADIAL_BOX) * 100
  const yPct = (y / RADIAL_BOX) * 100

  // Offsets — push callout out from the node centre.
  const horizontalShift = onLeft ? -CALLOUT_OFFSET - CALLOUT_WIDTH : CALLOUT_OFFSET
  const verticalShift = onTop ? -180 - CALLOUT_OFFSET : CALLOUT_OFFSET + NODE_RADIUS_HOVER

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: EASE_V }}
      className="absolute pointer-events-none"
      style={{
        left: `calc(${xPct}% + ${horizontalShift}px)`,
        top: `calc(${yPct}% + ${verticalShift}px)`,
        width: CALLOUT_WIDTH,
        background: `linear-gradient(135deg, ${VANTARY.glassDeep} 0%, rgba(10,10,10,0.95) 100%)`,
        border: `1px solid ${isActive ? VANTARY.amber : VANTARY.rule}`,
        borderRadius: 16,
        padding: "16px 18px",
        backdropFilter: "blur(32px) saturate(160%)",
        WebkitBackdropFilter: "blur(32px) saturate(160%)",
        boxShadow: isActive
          ? `0 0 40px ${VANTARY.amberWash}, 0 12px 32px rgba(0,0,0,0.5)`
          : `0 12px 40px rgba(0,0,0,0.45)`,
      }}
    >
      <FdCorners inset={8} size={8} />

      {/* Header row with large icon and title */}
      <div className="flex items-start gap-3">
        {/* Large dimension icon */}
        <div
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isActive ? VANTARY.amberWash : "transparent",
            borderRadius: 10,
            border: `1px solid ${isActive ? VANTARY.amber : VANTARY.rule}`,
            flexShrink: 0,
          }}
        >
          <Icon size={26} intensity={isActive ? "active" : "hover"} />
        </div>

        {/* Title and ring info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isActive ? VANTARY.amber : VANTARY.ashSoft,
              }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                color: isActive ? VANTARY.amber : VANTARY.ashSoft,
              }}
            >
              {node.eyebrow}
            </span>
          </div>
          <div
            className="font-sans mt-1.5"
            style={{
              fontSize: 15,
              color: VANTARY.paper,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {node.label}
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        className="font-sans mt-3"
        style={{
          fontSize: 12,
          color: VANTARY.ash,
          letterSpacing: "-0.005em",
          lineHeight: 1.6,
        }}
      >
        {node.dimension.meaning}
      </div>

      {/* Stat row — communities matching this dimension */}
      <div
        className="flex items-center gap-4 mt-3 pt-3"
        style={{ borderTop: `1px solid ${VANTARY.rule}` }}
      >
        <div className="flex items-center gap-1.5">
          <Users size={12} color={VANTARY.ashSoft} strokeWidth={1.5} />
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: VANTARY.ashSoft,
              letterSpacing: "0.05em",
            }}
          >
            {node.dimension.communities?.length ?? "5+"} ECOSYSTEMS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity size={12} color={VANTARY.ashSoft} strokeWidth={1.5} />
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: VANTARY.ashSoft,
              letterSpacing: "0.05em",
            }}
          >
            HIGH ACTIVITY
          </span>
        </div>
      </div>

      {/* Action hint */}
      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: `1px solid ${VANTARY.rule}` }}
      >
        {isActive ? (
          <div className="flex items-center gap-2">
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: VANTARY.amber,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={10} color={VANTARY.ink} strokeWidth={2.5} />
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: VANTARY.amber,
              }}
            >
              ACTIVE · CLICK TO REMOVE
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `1px solid ${VANTARY.rule}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowRight size={10} color={VANTARY.paper} strokeWidth={2} />
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: VANTARY.paper,
              }}
            >
              CLICK TO APPLY FILTER
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Matched ecosystems rail — top six matches as compact thumbnails.
   ═════════════════════════════════════════════════════════════════════════ */

function MatchedRail({
  topMatches,
  openTemplate,
}: {
  topMatches: readonly { community: Community; score: number; matchPct: number }[]
  openTemplate?: (id: string, params?: Record<string, unknown>) => void
}) {
  if (topMatches.length === 0) {
    return (
      <div
        className="rounded-xl flex items-center justify-center"
        style={{
          padding: "32px 16px",
          background: VANTARY.glass,
          border: `1px dashed ${VANTARY.rule}`,
        }}
      >
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Compass size={18} strokeWidth={1.5} color={VANTARY.ashSoft} />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.22em",
              color: VANTARY.ashSoft,
            }}
          >
            NO ECOSYSTEMS MATCH THE CURRENT FILTERS
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: 12,
              color: VANTARY.ash,
              letterSpacing: "-0.005em",
            }}
          >
            Loosen one node, or remove a chip, and the matches will return.
          </span>
        </div>
      </div>
    )
  }

  return (
    <section 
      className="flex flex-col gap-2.5"
      aria-label={`Top ${topMatches.length} ecosystem matches`}
    >
      {/* ARIA live region for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {topMatches.length} ecosystems match your filter criteria
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-baseline gap-2">
          <FdRouteId id="C-DSC-RAIL" tone="neutral" />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: VANTARY.ashSoft,
            }}
          >
            TOP MATCHES
          </span>
          <motion.span
            key={topMatches.length}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono tabular-nums"
            style={{
              fontSize: 12,
              color: VANTARY.amber,
              fontWeight: 600,
              padding: "2px 6px",
              background: VANTARY.amberWash,
              borderRadius: 4,
            }}
          >
            {topMatches.length}
          </motion.span>
          <span
            className="font-sans hidden sm:inline"
            style={{
              fontSize: 11,
              color: VANTARY.ash,
              letterSpacing: "-0.005em",
            }}
          >
            · ranked by match × weekly activity
          </span>
        </div>
        <motion.button
          type="button"
          onClick={() => openTemplate?.("collective.community-atlas")}
          whileHover={{ scale: 1.02, boxShadow: `0 0 16px ${VANTARY.amberWash}` }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-1.5 font-mono uppercase rounded-full"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            padding: "6px 12px",
            color: VANTARY.ink,
            background: VANTARY.amber,
            border: "none",
            fontWeight: 600,
          }}
        >
          OPEN ATLAS
          <ArrowUpRight size={11} strokeWidth={2} />
        </motion.button>
      </div>

      <FdDashedRule />

      <motion.div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
        }}
        role="list"
        aria-label="Matched ecosystems"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06 },
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {topMatches.map((match) => (
            <motion.div
              key={match.community.id}
              role="listitem"
              layout
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: EASE_V }}
            >
              <EcosystemThumb
                community={match.community}
                matchPct={match.matchPct}
                openTemplate={openTemplate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Single ecosystem thumb — compact card. Shows name, tagline, member
   count, win rate, mentor count, live state, and a match-percentage
   indicator. Click opens the Community Profile template (M06).
   ───────────────────────────────────────────────────────────────────── */

function EcosystemThumb({
  community,
  matchPct,
  openTemplate,
}: {
  community: Community
  matchPct: number
  openTemplate?: (id: string, params?: Record<string, unknown>) => void
}) {
  const [hovered, setHovered] = React.useState(false)
  const memberCountDisplay = formatCount(community.membersCount)
  const matchPctDisplay = Math.round(matchPct * 100)
  const onClick = () =>
    openTemplate?.("collective.community-profile", { communityId: community.id })
  
  const hasAI = community.hasArchioAi
  const hasLiveCalls = community.hasLiveCalls
  const hasDashboard = community.hasMentorDashboard
  const mentorCount = community.mentors?.length || 0
  
  // Feature indicators
  const hasAI = community.hasArchioAi
  const hasLiveCalls = community.hasLiveCalls
  const hasDashboard = community.hasMentorDashboard
  const isVerified = community.verified
  
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative w-full text-left rounded-2xl overflow-hidden"
      style={{
        background: hovered ? VANTARY.glassDeep : VANTARY.glass,
        border: `1px solid ${hovered ? VANTARY.amberHalo : VANTARY.rule}`,
        transition: "border-color 200ms, background 200ms",
      }}
      aria-label={`Open ${community.name} profile`}
    >
      {/* Live indicator bar at top */}
      {community.isLiveNow && (
        <div 
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: VANTARY.amber }}
        >
          <motion.div
            className="h-full"
            style={{ background: VANTARY.paper, opacity: 0.5 }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Header: Status badges + Match score */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {community.isLiveNow && (
              <span
                className="inline-flex items-center gap-1 font-mono uppercase rounded-full"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  color: VANTARY.ink,
                  padding: "3px 8px",
                  background: VANTARY.amber,
                }}
              >
                <Radio size={8} strokeWidth={2} />
                LIVE NOW
              </span>
            )}
            {isVerified && (
              <span
                className="inline-flex items-center gap-1 font-mono uppercase rounded-full"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  color: VANTARY.paper,
                  padding: "3px 8px",
                  background: VANTARY.rule,
                }}
              >
                <CircleDot size={7} strokeWidth={2} />
                VERIFIED
              </span>
            )}
          </div>
          {/* Match percentage with ring */}
          <div 
            className="relative flex items-center justify-center"
            style={{ width: 40, height: 40 }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle
                cx="20" cy="20" r="17"
                fill="none"
                stroke={VANTARY.rule}
                strokeWidth="2"
              />
              <circle
                cx="20" cy="20" r="17"
                fill="none"
                stroke={VANTARY.amber}
                strokeWidth="2"
                strokeDasharray={`${matchPct * 107} 107`}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
            </svg>
            <span
              className="absolute font-mono tabular-nums"
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: VANTARY.amber,
              }}
            >
              {matchPctDisplay}
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          className="font-sans truncate"
          style={{
            fontSize: 16,
            color: VANTARY.paper,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {community.name}
        </div>
        
        {/* Tagline */}
        <div
          className="font-sans line-clamp-2 mt-1"
          style={{
            fontSize: 12,
            color: VANTARY.ash,
            letterSpacing: "-0.005em",
            lineHeight: 1.5,
          }}
        >
          {community.tagline}
        </div>

        {/* Stats row */}
        <div
          className="flex items-center gap-4 mt-3 pt-3"
          style={{ borderTop: `1px solid ${VANTARY.ruleSoft}` }}
        >
          <div className="flex flex-col">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: "0.15em", color: VANTARY.ashSoft }}
            >
              MEMBERS
            </span>
            <span
              className="font-mono tabular-nums"
              style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}
            >
              {memberCountDisplay}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: "0.15em", color: VANTARY.ashSoft }}
            >
              ACTIVITY
            </span>
            <span
              className="font-mono tabular-nums"
              style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}
            >
              {community.weeklyActivity}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: "0.15em", color: VANTARY.ashSoft }}
            >
              MENTORS
            </span>
            <span
              className="font-mono tabular-nums"
              style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}
            >
              {community.mentors.length}
            </span>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {hasAI && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.12em",
                color: VANTARY.ashSoft,
                padding: "3px 6px",
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 4,
              }}
            >
              AI
            </span>
          )}
          {hasLiveCalls && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.12em",
                color: VANTARY.ashSoft,
                padding: "3px 6px",
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 4,
              }}
            >
              CALLS
            </span>
          )}
          {hasDashboard && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.12em",
                color: VANTARY.ashSoft,
                padding: "3px 6px",
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 4,
              }}
            >
              DASH
            </span>
          )}
          <span style={{ flex: 1 }} />
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            color={hovered ? VANTARY.amber : VANTARY.ashSoft}
            className="transition-all"
            style={{
              transform: hovered ? "translateX(2px)" : "translateX(0)",
              transition: "transform 200ms, color 200ms",
            }}
          />
        </div>
      </div>
    </motion.button>
  )
}

/* ══════════════════════════════════════���══════════════════════════════════
   Helpers
   ═════════════════════════════════════════════════════════════════════════ */

function formatCount(n: number): string {
  if (n >= 100_000) return `${(n / 1000).toFixed(0)}k`
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
