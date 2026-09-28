"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   <CommunityAtlasTemplate />

   The second canonical template of THE COLLECTIVE room and the direct
   re-paint of the legacy `/communities` grid view. Every card row from
   the source screenshot is preserved verbatim — but none of the casino
   chrome (gradient borders, neon pill backgrounds, two-tone watermarks,
   purple/cyan accent stops) survives. Every datum is rendered in the
   four-token Vantary palette only.

   Card anatomy (top → bottom · seven rows):

       ROW 1 · CREST BAND       — segment watermark · member count chip
       ROW 2 · TITLE + TAGLINE  — name + tagline with amber keystone phrases
       ROW 3 · ATTRIBUTE PILLS  — AI MODEL · LIVE CALLS · DASHBOARD · VERIFIED
       ROW 4 · STAT TRIPLET     — WIN RATE % · AVG R:R · SIGNALS / WEEK
       ROW 5 · ASSET SHARE ROW  — 4 columns, symbol + percent + mini-bar
       ROW 6 · HEALTH STRIP     — 11-segment activity rail · region · growth
       ROW 7 · LEAD MENTOR + CTA — monogram · name · tier · specialties · EXPLORE

   The template owns five Zone surfaces. TemplateShell paints zones 1, 2,
   6, 7. Zones 3–5 belong here:

       ZONE 3 · INPUTS      — search input + filter rail + sort dropdown
       ZONE 4 · RESOLVER    — running ecosystem count · live-now count
       ZONE 5 · RENDER PLAN — the responsive 3-column card grid

   All state local. All transforms in `communities-translate.ts`. Every
   filter mutation goes through `filterCommunities` so the running count
   in Zone 4 stays in lock-step with the grid.

   Inter-template wiring:
   • Card click   → openTemplate("collective.community-profile", { id })
   • Compare CTA  → openTemplate("collective.community-profile", { id, mode:"compare" })
   • "OPEN RADIAL" header chip → openTemplate("collective.discover-ecosystems", { filters })
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Filter,
  Sparkles,
  RotateCcw,
  Compass,
  ArrowUpDown,
  MapPin,
  CircleDot,
} from "lucide-react"

import { VANTARY, EASE_V } from "../../vantary-theme"
import { FdCorners, FdDashedRule } from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"

import {
  MOCK_COMMUNITIES,
  filterCommunities,
  COMMUNITY_PILL_LABELS,
  ASSET_WATERMARK_LABEL,
  type Community,
  type CommunityFilters,
  type AssetClass,
  type TradingStyle,
  type SessionFocus,
} from "../communities-source"
import {
  communityToCard,
  buildFilterChips,
  removeFilterChip,
  rankCommunitiesAgainstFilters,
  type CommunityCardModel,
  type FilterChip,
} from "../communities-translate"
import {
  IconAiModels,
  IconLiveCalls,
  IconDashboard,
  IconVerified,
  IconMember,
  IconGrowth,
  IconCheckTick,
} from "../communities-icons"

/* ═════════════════════════════════════════════════════════════════════════
   Public API
   ═════════════════════════════════════════════════════════════════════════ */

export interface CommunityAtlasTemplateProps {
  /** Pre-applied filter set. */
  initialFilters?: CommunityFilters
  /** Echo of the raw NL query if relevant (e.g. "verified scalping rooms"). */
  rawQuery?: string
  /** Optional resolver hint. */
  resolverNote?: string
  /** Inter-template dispatcher. */
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
   Tone constants
   ═════════════════════════════════════════════════════════════════════════ */

const HEALTH_SEGMENTS = 11        // segments in the activity strip
const ASSET_BAR_HEIGHT = 3        // px asset-share mini-bar height

/* Sort presets — drives the dropdown next to the running count. */
const SORT_OPTIONS: { id: NonNullable<CommunityFilters["sortBy"]>; label: string }[] = [
  { id: "activity", label: "BY ACTIVITY" },
  { id: "members", label: "BY MEMBERS" },
  { id: "rating", label: "BY RATING" },
  { id: "newest", label: "NEWEST" },
]

/* Asset-class quick-filter chips, ordered by screenshot prevalence. */
const ASSET_CLASS_CHIPS: { id: AssetClass; label: string }[] = [
  { id: "forex",   label: "FOREX" },
  { id: "crypto",  label: "CRYPTO" },
  { id: "stocks",  label: "STOCKS" },
  { id: "futures", label: "FUTURES" },
  { id: "mixed",   label: "MIXED" },
]

const STYLE_CHIPS: { id: TradingStyle; label: string }[] = [
  { id: "scalping",    label: "SCALPING" },
  { id: "day_trading", label: "DAY" },
  { id: "swing",       label: "SWING" },
  { id: "mixed",       label: "MIXED" },
]

const SESSION_CHIPS: { id: SessionFocus; label: string }[] = [
  { id: "asia",          label: "ASIA" },
  { id: "london",        label: "LONDON" },
  { id: "new_york",      label: "NEW YORK" },
  { id: "multi_session", label: "MULTI" },
]

/* ═════════════════════════════════════════════════════════════════════════
   <CommunityAtlasTemplate />
   ═════════════════════════════════════════════════════════════════════════ */

export function CommunityAtlasTemplate({
  initialFilters,
  rawQuery,
  resolverNote,
  openTemplate,
  drillForward,
  onClose,
  onPin,
  pinned,
}: CommunityAtlasTemplateProps) {
  const reduce = useReducedMotion()

  /* ── Filter state — single source of truth ───────────────────────────
        Every filter chip click, dropdown choice, and search keystroke
        flows through this one setter so the running count + grid stay
        in lock-step. Default sort is "activity" (matches the rank
        function's natural ordering). */
  const [filters, setFilters] = React.useState<CommunityFilters>(
    () => initialFilters ?? { sortBy: "activity" },
  )

  /* ── Search box mirror — debounced into filters.search.
        We keep an immediate visual mirror so the input stays
        responsive even if filterCommunities is heavy. */
  const [searchDraft, setSearchDraft] = React.useState<string>(
    initialFilters?.search ?? "",
  )
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchDraft.trim() }))
    }, 180)
    return () => window.clearTimeout(id)
  }, [searchDraft])

  /* ── Filter results, ranked, mapped to card models ─────────────────── */
  const filtered = React.useMemo(
    () => filterCommunities(filters),
    [filters],
  )
  const ranked = React.useMemo(
    () => rankCommunitiesAgainstFilters(filtered, filters),
    [filtered, filters],
  )
  const cards: { model: CommunityCardModel; matchPct: number }[] = React.useMemo(
    () =>
      ranked.map((r) => ({
        model: communityToCard(r.community),
        matchPct: r.matchPct,
      })),
    [ranked],
  )
  const liveNowCount = React.useMemo(
    () => filtered.filter((c) => c.isLiveNow).length,
    [filtered],
  )

  /* ── Filter chip rail data ───────────────────────────────────────── */
  const chips = React.useMemo(() => buildFilterChips(filters), [filters])

  /* ── Reset / clear handlers ──────────────────────────────────────── */
  const reset = React.useCallback(() => {
    setSearchDraft("")
    setFilters({ sortBy: "activity" })
  }, [])

  const removeChip = React.useCallback(
    (chip: FilterChip) => {
      setFilters((f) => removeFilterChip(f, chip))
      if (chip.removeKey === "search") setSearchDraft("")
    },
    [],
  )

  /* ── Toggle helpers — single-select for asset/style/session,
        mutex toggle for booleans. */
  const toggleAsset = (id: AssetClass) =>
    setFilters((f) => ({ ...f, assetClass: f.assetClass === id ? "" : id }))
  const toggleStyle = (id: TradingStyle) =>
    setFilters((f) => ({ ...f, tradingStyle: f.tradingStyle === id ? "" : id }))
  const toggleSession = (id: SessionFocus) =>
    setFilters((f) => ({ ...f, sessionFocus: f.sessionFocus === id ? "" : id }))
  const toggleBool = (key: keyof CommunityFilters) =>
    setFilters((f) => ({ ...f, [key]: !f[key] }) as CommunityFilters)
  const setSort = (sort: NonNullable<CommunityFilters["sortBy"]>) =>
    setFilters((f) => ({ ...f, sortBy: sort }))

  /* ── Inter-template handlers ─────────────────────────────────────── */
  const handleCardOpen = React.useCallback(
    (id: string) => {
      openTemplate?.("collective.community-profile", { communityId: id })
    },
    [openTemplate],
  )
  const handleOpenRadial = React.useCallback(
    () => openTemplate?.("collective.discover-ecosystems", { filters }),
    [openTemplate, filters],
  )

  /* ── Telemetry strings for Zone 7 footer ─────────────────────────── */
  const total = MOCK_COMMUNITIES.length
  const filteredCount = filtered.length
  const sortLabel = SORT_OPTIONS.find((o) => o.id === (filters.sortBy ?? "activity"))?.label ?? "BY ACTIVITY"

  /* Bundled props feed every zone — single source-of-truth across
     ZoneInputs / ZoneResolver / ZoneRenderPlan so the shell + the inner
     zones can re-render independently without thrashing filter state. */
  const zoneProps: AtlasZoneProps = {
    cards,
    filters,
    chips,
    searchDraft,
    onSearchDraftChange: setSearchDraft,
    onRemoveChip: removeChip,
    onToggleAsset: toggleAsset,
    onToggleStyle: toggleStyle,
    onToggleSession: toggleSession,
    onToggleBool: toggleBool,
    onSetSort: setSort,
    onReset: reset,
    onCardOpen: handleCardOpen,
    onOpenRadial: handleOpenRadial,
    liveNowCount,
    filteredCount,
    total,
    sortLabel,
    resolverNote,
    reduce: !!reduce,
  }

  /* ──────────────────────────────────────────────────────────────────── */
  return (
    <TemplateShell
      id="collective.community-atlas"
      eyebrow="THE COLLECTIVE · ATLAS · LIVE"
      routeId="C-ATL"
      headline="Community Atlas"
      subheadline={
        rawQuery
          ? `Resolved from "${rawQuery}" — ${filteredCount} of ${total} ecosystems match.`
          : "Every active ecosystem · win rate · mentor manifest · live state."
      }
      prelude={
        <span>
          The Atlas is the full grid of every active ecosystem in THE
          COLLECTIVE — win-rate, mentor manifest, asset distribution, and
          live state at a glance.{" "}
          <em style={{ color: VANTARY.paper, fontStyle: "normal" }}>
            Filter
          </em>{" "}
          to narrow the field, or{" "}
          <em style={{ color: VANTARY.paper, fontStyle: "normal" }}>
            open the radial finder
          </em>{" "}
          to compose by dimension.
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
      inputs={<ZoneInputs {...zoneProps} />}
      resolver={<ZoneResolver {...zoneProps} />}
      renderPlan={<ZoneRenderPlan {...zoneProps} />}
      sources={["EcosystemRegistry", "MentorVault", "BrokerLedger"]}
      lastRefreshed="streaming"
      state="ready"
      drillForward={drillForward}
      onClose={onClose}
      onPin={onPin}
      pinned={pinned}
    />
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   AtlasZoneProps — the shared shape passed to every zone. Splitting these
   into one interface keeps the JSX in `CommunityAtlasTemplate` tidy.
   ═════════════════════════════════════════════════════════════════════════ */

interface AtlasZoneProps {
  cards: { model: CommunityCardModel; matchPct: number }[]
  filters: CommunityFilters
  chips: readonly FilterChip[]
  searchDraft: string
  onSearchDraftChange: (s: string) => void
  onRemoveChip: (chip: FilterChip) => void
  onToggleAsset: (id: AssetClass) => void
  onToggleStyle: (id: TradingStyle) => void
  onToggleSession: (id: SessionFocus) => void
  onToggleBool: (key: keyof CommunityFilters) => void
  onSetSort: (sort: NonNullable<CommunityFilters["sortBy"]>) => void
  onReset: () => void
  onCardOpen: (id: string) => void
  onOpenRadial: () => void
  liveNowCount: number
  filteredCount: number
  total: number
  sortLabel: string
  resolverNote?: string
  reduce: boolean
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 3 · INPUTS
   Search · Filter chip rail · Quick-filter chips for asset/style/session ·
   Mode toggles for AI / Live / Verified / Beginner · Sort dropdown.
   ═════════════════════════════════════════════════════════════════════════ */

function ZoneInputs({
  filters,
  chips,
  searchDraft,
  onSearchDraftChange,
  onRemoveChip,
  onToggleAsset,
  onToggleStyle,
  onToggleSession,
  onToggleBool,
  onSetSort,
  onReset,
  onOpenRadial,
}: AtlasZoneProps) {
  return (
    <div className="px-5 py-4">
      {/* Eyebrow + helper actions */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          ZONE 3 · INPUTS
        </span>
        <FdDashedRule className="flex-1" />
        <button
          type="button"
          onClick={onOpenRadial}
          className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums transition-colors"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 4,
            padding: "4px 10px",
            background: VANTARY.glassDeep,
          }}
          aria-label="Open the radial finder with these filters preset"
        >
          <Compass size={11} strokeWidth={1.5} />
          OPEN RADIAL
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 font-mono uppercase transition-colors"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 4,
            padding: "4px 10px",
            background: "transparent",
          }}
          aria-label="Reset all filters"
        >
          <RotateCcw size={11} strokeWidth={1.5} />
          RESET
        </button>
      </div>

      {/* Search input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-7">
          <SearchInput
            value={searchDraft}
            onChange={onSearchDraftChange}
            placeholder="Search ecosystems by name, tag, mentor, or descriptor…"
          />
        </div>
        <div className="lg:col-span-5 flex items-center justify-end">
          <SortDropdown
            value={filters.sortBy ?? "activity"}
            onChange={onSetSort}
          />
        </div>
      </div>

      {/* Quick-filter chip groups */}
      <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ChipGroup
          eyebrow="ASSET"
          chips={ASSET_CLASS_CHIPS}
          activeId={filters.assetClass ?? ""}
          onToggle={(id) => onToggleAsset(id as AssetClass)}
        />
        <ChipGroup
          eyebrow="STYLE"
          chips={STYLE_CHIPS}
          activeId={filters.tradingStyle ?? ""}
          onToggle={(id) => onToggleStyle(id as TradingStyle)}
        />
        <ChipGroup
          eyebrow="SESSION"
          chips={SESSION_CHIPS}
          activeId={filters.sessionFocus ?? ""}
          onToggle={(id) => onToggleSession(id as SessionFocus)}
        />
      </div>

      {/* Mode toggles */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className="font-mono uppercase mr-1"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          MODE
        </span>
        <ModeToggle
          label="ARCHIO AI"
          active={!!filters.hasArchioAi}
          onClick={() => onToggleBool("hasArchioAi")}
        />
        <ModeToggle
          label="LIVE CALLS"
          active={!!filters.hasLiveCalls}
          onClick={() => onToggleBool("hasLiveCalls")}
        />
        <ModeToggle
          label="VERIFIED"
          active={!!filters.verified}
          onClick={() => onToggleBool("verified")}
        />
        <ModeToggle
          label="BEGINNER SAFE"
          active={!!filters.beginnerFriendly}
          onClick={() => onToggleBool("beginnerFriendly")}
        />
        <ModeToggle
          label="DASHBOARD"
          active={!!filters.hasMentorDashboard}
          onClick={() => onToggleBool("hasMentorDashboard")}
        />
        <ModeToggle
          label="LIVE NOW"
          active={!!filters.liveNowOnly}
          onClick={() => onToggleBool("liveNowOnly")}
        />
      </div>

      {/* Active filter chip rail */}
      {chips.length > 0 && (
        <div className="mt-3">
          <FdDashedRule />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.22em",
                color: VANTARY.amber,
                fontWeight: 600,
              }}
            >
              ACTIVE FILTERS · {chips.length}
            </span>
            {chips.map((chip) => (
              <ActiveFilterChip
                key={chip.id}
                chip={chip}
                onRemove={() => onRemoveChip(chip)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────── Search box (mono pill, amber active border) ──────── */
function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (s: string) => void
  placeholder: string
}) {
  return (
    <label
      className="flex items-center gap-2 px-3 py-2.5 transition-colors"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${value ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <Search size={13} strokeWidth={1.5} color={value ? VANTARY.amber : VANTARY.ashSoft} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none font-sans"
        style={{
          fontSize: 13,
          color: VANTARY.paper,
          letterSpacing: "-0.005em",
        }}
        aria-label="Search the ecosystem atlas"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Clear search"
        >
          <X size={13} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </button>
      )}
    </label>
  )
}

/* ──────────────── Sort dropdown ─────────────────────────────────────── */
function SortDropdown({
  value,
  onChange,
}: {
  value: NonNullable<CommunityFilters["sortBy"]>
  onChange: (sort: NonNullable<CommunityFilters["sortBy"]>) => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onClickAway)
    return () => document.removeEventListener("mousedown", onClickAway)
  }, [open])

  const active = SORT_OPTIONS.find((o) => o.id === value) ?? SORT_OPTIONS[0]!
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 font-mono uppercase tabular-nums"
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          color: VANTARY.paper,
          background: VANTARY.glassDeep,
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 4,
          padding: "8px 12px",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ArrowUpDown size={11} strokeWidth={1.5} color={VANTARY.amber} />
        SORT · {active.label}
        <ChevronDown size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE_V }}
            className="absolute right-0 z-10 mt-1 min-w-[200px]"
            style={{
              background: VANTARY.glassDeep,
              border: `1px solid ${VANTARY.amberHalo}`,
              borderRadius: 4,
              backdropFilter: "blur(28px) saturate(150%)",
              WebkitBackdropFilter: "blur(28px) saturate(150%)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
            }}
            role="listbox"
          >
            {SORT_OPTIONS.map((opt) => {
              const isActive = opt.id === value
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id)
                    setOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 font-mono uppercase tabular-nums transition-colors"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    color: isActive ? VANTARY.amber : VANTARY.paper,
                    background: isActive ? VANTARY.amberWash : "transparent",
                  }}
                  role="option"
                  aria-selected={isActive}
                >
                  <span>{opt.label}</span>
                  {isActive && <CircleDot size={10} strokeWidth={1.5} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ──────────────── Reusable chip group ───────────────────────────────── */
function ChipGroup({
  eyebrow,
  chips,
  activeId,
  onToggle,
}: {
  eyebrow: string
  chips: readonly { id: string; label: string }[]
  activeId: string
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <div
        className="font-mono uppercase mb-2"
        style={{
          fontSize: 9,
          letterSpacing: "0.24em",
          color: VANTARY.amber,
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => {
          const isActive = c.id === activeId
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onToggle(c.id)}
              className="inline-flex items-center font-mono uppercase tabular-nums transition-colors"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.20em",
                color: isActive ? VANTARY.amber : VANTARY.paper,
                background: isActive ? VANTARY.amberWash : "transparent",
                border: `1px solid ${isActive ? VANTARY.amberHalo : VANTARY.rule}`,
                borderRadius: 999,
                padding: "4px 10px",
                fontWeight: isActive ? 600 : 500,
              }}
              aria-pressed={isActive}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────── Mode boolean toggle ───────────────────────────────── */
function ModeToggle({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 font-mono uppercase transition-colors"
      style={{
        fontSize: 9.5,
        letterSpacing: "0.22em",
        color: active ? VANTARY.amber : VANTARY.paper,
        background: active ? VANTARY.amberWash : "transparent",
        border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 999,
        padding: "4px 10px",
        fontWeight: active ? 600 : 500,
      }}
      aria-pressed={active}
    >
      <span
        className="rounded-full"
        style={{
          width: 5,
          height: 5,
          background: active ? VANTARY.amber : "transparent",
          boxShadow: active ? `0 0 6px ${VANTARY.amberHalo}` : "none",
          border: active ? "none" : `1px solid ${VANTARY.ashSoft}`,
        }}
      />
      {label}
    </button>
  )
}

/* ──────────────── Active filter chip with × remove ──────────────────── */
function ActiveFilterChip({
  chip,
  onRemove,
}: {
  chip: FilterChip
  onRemove: () => void
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono uppercase"
      style={{
        fontSize: 9.5,
        letterSpacing: "0.22em",
        color: VANTARY.paper,
        background: VANTARY.amberWash,
        border: `1px solid ${VANTARY.amberHalo}`,
        borderRadius: 999,
        padding: "3px 4px 3px 10px",
      }}
    >
      <span style={{ color: VANTARY.amber, fontWeight: 600 }}>{chip.label}</span>
      <span style={{ opacity: 0.85 }}>{chip.value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center justify-center transition-opacity opacity-70 hover:opacity-100"
        style={{
          width: 16,
          height: 16,
          marginLeft: 2,
          borderRadius: 999,
          background: "transparent",
        }}
        aria-label={`Remove ${chip.label} filter`}
      >
        <X size={10} strokeWidth={1.6} color={VANTARY.amber} />
      </button>
    </span>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 4 · RESOLVER
   Running counts: total / filtered / live now / sort label.
   ═════════════════════════════════════════════════════════════════════════ */

function ZoneResolver({
  filteredCount,
  total,
  liveNowCount,
  sortLabel,
  resolverNote,
}: AtlasZoneProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-3 mb-2">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          ZONE 4 · RESOLVER
        </span>
        <FdDashedRule className="flex-1" />
      </div>
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden"
        style={{
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 4,
          background: VANTARY.rule,
        }}
      >
        <ResolverStat
          eyebrow="ECOSYSTEMS"
          value={`${total}`}
          tail="active"
        />
        <ResolverStat
          eyebrow="FILTERED"
          value={`${filteredCount}`}
          tail={`of ${total}`}
          accent={filteredCount < total}
        />
        <ResolverStat
          eyebrow="LIVE NOW"
          value={`${liveNowCount}`}
          tail={liveNowCount === 1 ? "broadcasting" : "broadcasting"}
          pulse={liveNowCount > 0}
        />
        <ResolverStat
          eyebrow="ORDER"
          value={sortLabel.replace(/^BY /, "")}
          tail="sort"
        />
      </div>
      {resolverNote && (
        <div
          className="mt-2 font-sans"
          style={{
            fontSize: 12,
            color: VANTARY.ashSoft,
            textWrap: "pretty",
            lineHeight: 1.5,
          }}
        >
          {resolverNote}
        </div>
      )}
    </div>
  )
}

function ResolverStat({
  eyebrow,
  value,
  tail,
  accent = false,
  pulse = false,
}: {
  eyebrow: string
  value: string
  tail: string
  accent?: boolean
  pulse?: boolean
}) {
  return (
    <div
      className="flex items-baseline justify-between px-3.5 py-3"
      style={{ background: VANTARY.ink }}
    >
      <div>
        <div
          className="font-mono uppercase mb-1"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.ashSoft,
          }}
        >
          {eyebrow}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: accent ? VANTARY.amber : VANTARY.paper,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          {pulse && (
            <motion.span
              aria-hidden
              className="rounded-full"
              style={{
                width: 5,
                height: 5,
                background: VANTARY.amber,
                boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.05, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.20em",
          color: VANTARY.ashSoft,
        }}
      >
        {tail}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 5 · RENDER PLAN
   The responsive 3-column grid of CommunityAtlasCard.
   ═════════════════════════════════════════════════════════════════════════ */

function ZoneRenderPlan({
  cards,
  filters,
  onCardOpen,
  onReset,
  onOpenRadial,
  reduce,
}: AtlasZoneProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          ZONE 5 · RENDER PLAN · ATLAS GRID
        </span>
        <FdDashedRule className="flex-1" />
      </div>

      {cards.length === 0 ? (
        <EmptyState onReset={onReset} onOpenRadial={onOpenRadial} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {cards.map(({ model, matchPct }, idx) => (
            <motion.div
              key={model.community.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.32,
                delay: reduce ? 0 : Math.min(idx * 0.04, 0.32),
                ease: EASE_V,
              }}
            >
              <CommunityAtlasCard
                model={model}
                matchPct={matchPct}
                showMatch={!!(
                  filters.assetClass ||
                  filters.tradingStyle ||
                  filters.sessionFocus ||
                  filters.visibility ||
                  filters.hasArchioAi ||
                  filters.hasLiveCalls ||
                  filters.verified ||
                  filters.beginnerFriendly ||
                  filters.hasMentorDashboard ||
                  filters.liveNowOnly
                )}
                onOpen={() => onCardOpen(model.community.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────────── Empty state ───────────────────────────────────────── */
function EmptyState({
  onReset,
  onOpenRadial,
}: {
  onReset: () => void
  onOpenRadial: () => void
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <Filter size={20} strokeWidth={1.4} color={VANTARY.amber} />
      <div
        className="font-mono uppercase mt-3 mb-1"
        style={{
          fontSize: 10,
          letterSpacing: "0.24em",
          color: VANTARY.amber,
          fontWeight: 600,
        }}
      >
        NO ECOSYSTEM MATCHES
      </div>
      <div
        className="font-sans max-w-md"
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: VANTARY.ashSoft,
          textWrap: "pretty",
        }}
      >
        Your current filter set rules out every active ecosystem. Loosen one or
        two filters or open the radial finder to explore by dimension.
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: VANTARY.paper,
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 4,
            padding: "6px 12px",
            background: "transparent",
          }}
        >
          <RotateCcw size={11} strokeWidth={1.5} />
          RESET FILTERS
        </button>
        <button
          type="button"
          onClick={onOpenRadial}
          className="inline-flex items-center gap-1.5 font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 4,
            padding: "6px 12px",
            background: VANTARY.amberWash,
          }}
        >
          <Compass size={11} strokeWidth={1.5} />
          OPEN RADIAL
        </button>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   <CommunityAtlasCard />

   The seven-row atlas card. The whole card is keyboard-focusable; the
   bottom CTA is the primary affordance, but a click anywhere inside the
   card title row also opens the profile.
   ═════════════════════════════════════════════════════════════════════════ */

interface CommunityAtlasCardProps {
  model: CommunityCardModel
  matchPct: number
  showMatch: boolean
  onOpen: () => void
}

function CommunityAtlasCard({
  model,
  matchPct,
  showMatch,
  onOpen,
}: CommunityAtlasCardProps) {
  const { community, assetShareBars, weeklyHeatmapBars } = model
  const watermark = ASSET_WATERMARK_LABEL[community.assetClass]

  return (
    <article
      className="relative h-full flex flex-col overflow-hidden"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <FdCorners size={10} thickness={1} inset={6} color={VANTARY.amberHalo} />

      {/* Match badge — only when filters are actively narrowing */}
      {showMatch && (
        <div
          className="absolute top-2 right-2 inline-flex items-center gap-1 font-mono uppercase tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            background: VANTARY.amberWash,
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 999,
            padding: "2px 6px",
            zIndex: 2,
          }}
        >
          <Sparkles size={9} strokeWidth={1.5} />
          MATCH {Math.round(matchPct * 100)}%
        </div>
      )}

      {/* ROW 1 · CREST BAND ─────────────────────────────────────────── */}
      <CardCrestBand
        watermark={watermark}
        membersCount={community.membersCount}
        isLiveNow={community.isLiveNow}
      />

      {/* ROW 2 · TITLE + TAGLINE ─────────────────────────────────────── */}
      <div className="px-[18px] pt-3.5">
        <button
          type="button"
          onClick={onOpen}
          className="text-left w-full focus:outline-none"
        >
          <h3
            className="font-sans"
            style={{
              fontSize: 18,
              lineHeight: 1.2,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.015em",
            }}
          >
            {community.name}
          </h3>
        </button>
        <p
          className="font-sans mt-1.5"
          style={{
            fontSize: 12.5,
            lineHeight: 1.55,
            color: VANTARY.ashSoft,
            textWrap: "pretty",
          }}
        >
          <KeystoneText text={community.tagline} />
        </p>
      </div>

      {/* ROW 3 · ATTRIBUTE PILLS ─────────────────────────────────────── */}
      <div className="px-[18px] mt-3">
        <AttributePills model={model} />
      </div>

      {/* ROW 4 · STAT TRIPLET ────────────────────────────────────────── */}
      <div className="px-[18px] mt-3">
        <StatTriplet community={community} />
      </div>

      {/* ROW 5 · ASSET SHARE ROW ─────────────────────────────────────── */}
      <div className="px-[18px] mt-3">
        <AssetShareRow bars={assetShareBars} />
      </div>

      {/* ROW 6 · HEALTH STRIP ────────────────────────────────────────── */}
      <div className="px-[18px] mt-3.5">
        <HealthStrip
          bars={weeklyHeatmapBars}
          weeklyActivity={community.weeklyActivity}
          regionStamp={community.regionStamp}
          growthChip={community.growthChip}
        />
      </div>

      {/* ROW 7 · LEAD MENTOR + CTA ───────────────────────────────────── */}
      <div className="px-[18px] mt-3.5">
        <LeadMentorRow model={model} />
      </div>

      <div className="px-[18px] pt-3 pb-[18px] mt-auto">
        <ExploreCta onClick={onOpen} liveNow={community.isLiveNow} />
      </div>
    </article>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ROW 1 · CREST BAND

   The watermark text sits behind the card top with low opacity, the
   member-count chip floats top-right, and a thin amber-pulse rail at
   the bottom of the band lights up when the community is live now.
   ═════════════════════════════════════════════════════════════════════════ */

function CardCrestBand({
  watermark,
  membersCount,
  isLiveNow,
}: {
  watermark: string
  membersCount: number
  isLiveNow: boolean
}) {
  return (
    <div
      className="relative flex items-end justify-between overflow-hidden"
      style={{
        height: 88,
        borderBottom: `1px solid ${VANTARY.rule}`,
        background: `linear-gradient(180deg, ${VANTARY.amberWash} 0%, transparent 75%)`,
      }}
    >
      {/* Watermark text — outline-only, single layer, low opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-5"
      >
        <span
          className="font-sans tracking-wider uppercase"
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "transparent",
            WebkitTextStroke: `1px ${VANTARY.amberHalo}`,
            opacity: 0.4,
            lineHeight: 1,
          }}
        >
          {watermark}
        </span>
      </div>

      {/* Bottom amber pulse rail */}
      <div
        aria-hidden
        className="absolute left-4 right-4 bottom-0"
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${VANTARY.amberHalo} 50%, transparent 100%)`,
          opacity: isLiveNow ? 0.85 : 0.35,
        }}
      />

      {/* Live badge bottom-left */}
      {isLiveNow && (
        <div
          className="relative z-[1] inline-flex items-center gap-1.5 font-mono uppercase ml-4 mb-3"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            background: VANTARY.amberWash,
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 999,
            padding: "3px 8px",
            fontWeight: 600,
          }}
        >
          <motion.span
            aria-hidden
            className="rounded-full"
            style={{
              width: 5, height: 5,
              background: VANTARY.amber,
              boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.06, 0.9] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          LIVE NOW
        </div>
      )}

      {/* Member count chip top-right */}
      <div
        className="relative z-[1] inline-flex items-center gap-1.5 font-mono uppercase tabular-nums mr-4 mb-3 ml-auto"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.20em",
          color: VANTARY.paper,
          background: VANTARY.glassDeep,
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 999,
          padding: "3px 8px 3px 6px",
        }}
        aria-label={`${membersCount} members`}
      >
        <IconMember size={10} intensity="active" />
        <span style={{ color: VANTARY.amber, fontWeight: 600 }}>
          {membersCount.toLocaleString()}
        </span>
        <span style={{ color: VANTARY.ashSoft, marginLeft: 2, fontWeight: 500 }}>
          MEMBERS
        </span>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Tagline keystone-highlighter

   Highlights specific operative phrases inside the tagline (e.g.
   "Ultra-fast crypto scalping", "Institutional-grade", "first 90 days")
   in amber so the cards keep the screenshot's accent without leaning on
   gradients. We keep the rule-set tiny and deterministic to avoid
   surprising emphasis.
   ═════════════════════════════════════════════════════════════════════════ */

const KEYSTONE_PHRASES = [
  /\bUltra-fast\s+\w+\s+\w+\b/i,
  /\bInstitutional-grade\s+\w+\b/i,
  /\bequities\b/i,
  /\boptions\b/i,
  /\bAI mentor\b/i,
  /\blive pre-market calls\b/i,
  /\bfirst\s+90\s+days\b/i,
  /\bguided\b/i,
  /\bserious\s+Asia\b/i,
  /\bintelligent\b/i,
  /\bscalping\b/i,
  /\binstitutional\b/i,
  /\bdiscipline-first\b/i,
  /\brisk-first\b/i,
]

function KeystoneText({ text }: { text: string }) {
  // Build a list of [start, end, isAmber] segments by sweeping the
  // keystone regexes left → right and merging matches. Greedy, but
  // bounded by phrase count (~15) so the cost is negligible.
  const segs: { from: number; to: number; amber: boolean }[] = [
    { from: 0, to: text.length, amber: false },
  ]
  for (const rx of KEYSTONE_PHRASES) {
    rx.lastIndex = 0
    const m = rx.exec(text)
    if (!m) continue
    const start = m.index
    const end = m.index + m[0].length
    const next: typeof segs = []
    for (const s of segs) {
      if (s.amber) {
        next.push(s)
        continue
      }
      const a = Math.max(s.from, start)
      const b = Math.min(s.to, end)
      if (a >= b) {
        next.push(s)
        continue
      }
      if (a > s.from) next.push({ from: s.from, to: a, amber: false })
      next.push({ from: a, to: b, amber: true })
      if (b < s.to) next.push({ from: b, to: s.to, amber: false })
    }
    segs.length = 0
    segs.push(...next)
  }
  return (
    <>
      {segs.map((s, i) => {
        const piece = text.slice(s.from, s.to)
        return s.amber ? (
          <span
            key={i}
            style={{ color: VANTARY.amber, fontWeight: 500 }}
          >
            {piece}
          </span>
        ) : (
          <React.Fragment key={i}>{piece}</React.Fragment>
        )
      })}
    </>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ROW 3 · ATTRIBUTE PILLS

   Two columns × two rows. Each pill = mono icon + uppercase eyebrow +
   value. Matches the screenshot order exactly:
       AI MODEL · LIVE CALLS
       DASHBOARD · VERIFIED
   ═════════════════════════════════════════════════════════════════════════ */

function AttributePills({ model }: { model: CommunityCardModel }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Pill
        icon={<IconAiModels size={14} intensity="active" />}
        eyebrow={COMMUNITY_PILL_LABELS.aiModel}
        value={model.aiModelValue}
      />
      <Pill
        icon={<IconLiveCalls size={14} intensity={model.community.isLiveNow ? "active" : "hover"} />}
        eyebrow={COMMUNITY_PILL_LABELS.liveCalls}
        value={model.liveCallsValue}
        valueAmber={model.community.isLiveNow}
      />
      <Pill
        icon={<IconDashboard size={14} intensity="active" />}
        eyebrow={COMMUNITY_PILL_LABELS.dashboard}
        value={model.dashboardValue}
      />
      <Pill
        icon={<IconVerified size={14} intensity="active" />}
        eyebrow={COMMUNITY_PILL_LABELS.verified}
        value={model.verifiedValue}
        valueAmber={model.community.verified}
      />
    </div>
  )
}

function Pill({
  icon,
  eyebrow,
  value,
  valueAmber = false,
}: {
  icon: React.ReactNode
  eyebrow: string
  value: string
  valueAmber?: boolean
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-2.5 py-2"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <div
        className="shrink-0 flex items-center justify-center"
        style={{
          width: 22, height: 22,
          background: VANTARY.amberWash,
          border: `1px solid ${VANTARY.amberHalo}`,
          borderRadius: 4,
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div
          className="font-mono uppercase truncate"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
            lineHeight: 1.2,
          }}
        >
          {eyebrow}
        </div>
        <div
          className="font-sans truncate"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: valueAmber ? VANTARY.amber : VANTARY.paper,
            lineHeight: 1.25,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ROW 4 · STAT TRIPLET — WIN RATE % · AVG R:R · SIGNALS / WK
   ═════════════════════════════════════════════════════════════════════════ */

function StatTriplet({ community }: { community: Community }) {
  return (
    <div
      className="grid grid-cols-3 gap-px overflow-hidden"
      style={{
        background: VANTARY.rule,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <Stat label="WIN RATE" value={`${community.winRate}`} suffix="%" />
      <Stat label="AVG R:R"  value={`${community.avgRR.toFixed(1)}`} suffix="R" />
      <Stat label="SIGNALS / WK" value={`${community.signalsPerWeek}`} suffix="" />
    </div>
  )
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string
  value: string
  suffix: string
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-2 py-2.5"
      style={{ background: VANTARY.ink }}
    >
      <div
        className="font-mono uppercase mb-1"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.22em",
          color: VANTARY.ashSoft,
        }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-0.5">
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: VANTARY.amber,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: VANTARY.amber,
              opacity: 0.7,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ROW 5 · ASSET SHARE ROW

   Four columns. Each column carries:
       • Symbol (e.g. BTC/USD)
       • Percent (40%)
       • A 3px-tall mono mini-bar whose width = percent.
   ═════════════════════════════════════════════════════════════════════════ */

function AssetShareRow({
  bars,
}: {
  bars: readonly { symbol: string; share: number; normalised: number }[]
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {bars.map((b) => (
        <div key={b.symbol} className="min-w-0">
          <div
            className="font-mono uppercase truncate"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: VANTARY.ashSoft,
              lineHeight: 1.25,
            }}
          >
            {b.symbol}
          </div>
          <div
            className="font-sans tabular-nums"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {b.share}%
          </div>
          <div
            className="mt-1.5 relative overflow-hidden"
            style={{
              height: ASSET_BAR_HEIGHT,
              background: VANTARY.rule,
              borderRadius: 999,
            }}
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 bottom-0"
              style={{
                width: `${Math.max(0, Math.min(100, b.share))}%`,
                background: VANTARY.amber,
                opacity: 0.85,
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ROW 6 · HEALTH STRIP

   Eleven dashed segments. The trailing N segments light up in amber
   based on weeklyActivity (0–100 → 0–11 segments). Below the rail sit
   the region stamp (left) and the growth chip (right).
   ═════════════════════════════════════════════════════════════════════════ */

function HealthStrip({
  bars,
  weeklyActivity,
  regionStamp,
  growthChip,
}: {
  bars: readonly { day: string; value: number; normalised: number }[]
  weeklyActivity: number
  regionStamp: string
  /** Pre-formatted growth string (e.g. "+22%", "-3%"). */
  growthChip: string
}) {
  // Map weeklyActivity → segments lit. Lowest value lights ≥ 1 segment
  // so the strip never reads as "dead".
  const lit = Math.max(1, Math.round((weeklyActivity / 100) * HEALTH_SEGMENTS))
  // Derive direction from the leading sign of the pre-formatted chip.
  // A chip of "+22%" or "22%" is positive; "-3%" is negative; an empty
  // string is neutral and renders mono.
  const trimmed = growthChip.trim()
  const positive = trimmed.length > 0 && !trimmed.startsWith("-")

  return (
    <div>
      <div className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: HEALTH_SEGMENTS }).map((_, i) => {
          const isLit = i >= HEALTH_SEGMENTS - lit
          // Fold the 7-day heatmap onto 11 segments: roughly bar i =
          // bars[Math.round(i * 6 / 10)]. The visual is a narrow column
          // that brightens with activity.
          const dayIdx = Math.round((i * (bars.length - 1)) / (HEALTH_SEGMENTS - 1))
          const day = bars[dayIdx]
          const intensity = day ? day.normalised : 0
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                height: 7,
                background: isLit ? VANTARY.amber : VANTARY.rule,
                opacity: isLit ? 0.4 + intensity * 0.6 : 0.55,
                borderRadius: 1,
              }}
            />
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.20em",
            color: VANTARY.ashSoft,
          }}
        >
          <MapPin size={10} strokeWidth={1.5} color={VANTARY.amber} />
          {regionStamp}
        </span>
        <span
          className="inline-flex items-center gap-1 font-mono uppercase tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.20em",
            color: positive ? VANTARY.amber : VANTARY.ashSoft,
            background: positive ? VANTARY.amberWash : "transparent",
            border: `1px solid ${positive ? VANTARY.amberHalo : VANTARY.rule}`,
            borderRadius: 999,
            padding: "2px 6px",
            fontWeight: positive ? 600 : 500,
          }}
        >
          <IconGrowth size={10} intensity={positive ? "active" : "idle"} />
          {trimmed || "FLAT"}
        </span>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ROW 7 · LEAD MENTOR ROW + EXPLORE CTA
   ═════════════════════════════════════════════════════════════════════════ */

function LeadMentorRow({ model }: { model: CommunityCardModel }) {
  const lead = model.leadMentor
  if (!lead) return null

  const monogramBlock =
    lead.displayName.split(/\s+/).filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      {/* Monogram */}
      <div
        className="shrink-0 flex items-center justify-center font-mono uppercase tabular-nums"
        style={{
          width: 30, height: 30,
          background: VANTARY.amberWash,
          border: `1px solid ${VANTARY.amberHalo}`,
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 600,
          color: VANTARY.amber,
          letterSpacing: "0.06em",
        }}
        aria-hidden
      >
        {monogramBlock}
      </div>

      {/* Name + tier + verified tick */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className="font-sans truncate"
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.005em",
            }}
          >
            {lead.displayName}
          </span>
          {lead.verified && <IconCheckTick size={10} intensity="active" />}
          <span
            className="inline-flex items-center font-mono uppercase ml-1"
            style={{
              fontSize: 8.5,
              letterSpacing: "0.22em",
              color: VANTARY.amber,
              background: VANTARY.amberWash,
              border: `1px solid ${VANTARY.amberHalo}`,
              borderRadius: 999,
              padding: "1px 5px",
              fontWeight: 600,
            }}
          >
            {lead.isLead ? "LEAD" : "MENTOR"}
          </span>
        </div>
        <div
          className="font-mono uppercase mt-0.5 truncate"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
          }}
        >
          {model.leadMentorSpecialties}
        </div>
      </div>

      {/* +N more */}
      {model.extraMentorCount > 0 && (
        <span
          className="inline-flex items-center font-mono uppercase tabular-nums shrink-0"
          style={{
            fontSize: 9,
            letterSpacing: "0.20em",
            color: VANTARY.ashSoft,
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 999,
            padding: "2px 7px",
          }}
        >
          +{model.extraMentorCount} MORE
        </span>
      )}
    </div>
  )
}

function ExploreCta({
  onClick,
  liveNow,
}: {
  onClick: () => void
  liveNow: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 font-mono uppercase tabular-nums transition-colors"
      style={{
        fontSize: 10,
        letterSpacing: "0.28em",
        color: VANTARY.amber,
        background: liveNow ? VANTARY.amberWash : "transparent",
        border: `1px solid ${VANTARY.amberHalo}`,
        borderRadius: 4,
        padding: "10px 14px",
        fontWeight: 600,
      }}
      aria-label="Explore this community"
    >
      EXPLORE COMMUNITY
      <ArrowRight size={12} strokeWidth={1.5} />
    </button>
  )
}
