/* ────────────────────────────────────────────────────────────────────────
   COMMUNITIES TRANSLATION LAYER
   Vantary Universal Template Engine · Phase 2

   Pure functions that bridge the legacy /communities surface (rich
   casino-style cards with multi-color SVG icons and per-dimension
   accentRgb gradients) into Vantary-grade props (mono uppercase
   eyebrows, structural body, single amber keystone, dashed hairlines,
   no gradients).

   Every Communities flight-deck template imports from THIS module.
   Zero gradient strings, zero raw RGB, zero purple/violet/pink/cyan.
   ──────────────────────────────────────────────────────────────────── */

import type {
  Community,
  CommunityDimension,
  CommunityFilters,
  CommunityMentor,
} from "./communities-source"
import {
  COMMUNITY_DIMENSIONS_BY_RING,
  RING_TITLES,
  WEEK_DAYS,
  MOCK_COMMUNITIES,
} from "./communities-source"
import type { CommunityFilters } from "./communities-source"

/* ────────────────────────────────────────────────────────────────────
   1.  ORBIT NODE LAYOUT — the radial finder positions every dimension
        on a polar coordinate around the centre.

        Ring 0 (innermost  · platform)   sits at radius 0.32 of the box.
        Ring 1 (middle     · support)    sits at radius 0.56.
        Ring 2 (outermost  · style)      sits at radius 0.84.

        Each ring's nodes are evenly distributed over a full 360°,
        starting at -90° (12 o'clock) and rotating clockwise.  A small
        per-ring θ offset prevents nodes on different rings from sitting
        on the same vertical line — the result is the visually balanced
        constellation seen in the screenshots.
   ──────────────────────────────────────────────────────────────────── */

export interface OrbitNode {
  /** Stable id from CommunityDimension.id */
  readonly id: string
  /** Short label (≤ 18 chars) for the orbit callout */
  readonly short: string
  /** Long label for hover/active state */
  readonly label: string
  /** Eyebrow for the callout — always uppercase, mono. */
  readonly eyebrow: string
  /** 0 = inner, 1 = middle, 2 = outer */
  readonly ringIndex: 0 | 1 | 2
  /** Angle in radians, 0 = 12 o'clock, clockwise positive. */
  readonly theta: number
  /** Normalised radius — 0 = centre, 1 = box edge. */
  readonly radius: number
  /** Original dimension — kept for filter/microcopy lookups. */
  readonly dimension: CommunityDimension
}

/** Per-ring radius factor. ULTRA spacing for dramatic visual separation. */
const RING_RADII: Readonly<Record<0 | 1 | 2, number>> = {
  0: 0.20,   // Inner ring — Platform Intelligence (tight to centre)
  1: 0.48,   // Middle ring — Support Structure (wide separation)
  2: 0.80,   // Outer ring — Market & Style (near edge, room for labels)
}

/** Per-ring θ offset (in radians) to avoid vertical alignment between rings. */
const RING_THETA_OFFSET: Readonly<Record<0 | 1 | 2, number>> = {
  0: 0,
  1: Math.PI / 8,
  2: Math.PI / 12,
}

/** Build the full orbit node list — 21 nodes across 3 rings. */
export function buildOrbitNodes(): readonly OrbitNode[] {
  const out: OrbitNode[] = []
  for (const ringKey of [0, 1, 2] as const) {
    const dims = COMMUNITY_DIMENSIONS_BY_RING[ringKey]
    const count = dims.length
    const baseOffset = -Math.PI / 2 + RING_THETA_OFFSET[ringKey]
    dims.forEach((d, idx) => {
      const theta = baseOffset + (idx / count) * Math.PI * 2
      out.push({
        id: d.id,
        short: d.short,
        label: d.label,
        eyebrow: RING_TITLES[ringKey],
        ringIndex: ringKey,
        theta,
        radius: RING_RADII[ringKey],
        dimension: d,
      })
    })
  }
  return out
}

/** Convert (theta, radius) into x/y inside a square box of side `box`. */
export function polarToCartesian(
  theta: number,
  radius: number,
  box: number,
): { x: number; y: number } {
  const cx = box / 2
  const cy = box / 2
  return {
    x: cx + Math.cos(theta) * radius * (box / 2),
    y: cy + Math.sin(theta) * radius * (box / 2),
  }
}

/* ────────────────────────────────────────────────────────────────────
   2.  CARD MODEL — derives the screenshot card layout from a Community.
   ──────────────────────────────────────────────────────────────────── */

export interface CommunityCardModel {
  readonly community: Community
  /** Asset-share row, exactly 4 entries with width as percentage. */
  readonly assetShareBars: readonly {
    readonly symbol: string
    readonly share: number
    /** 0–1 normalised width for the mini bar. */
    readonly normalised: number
  }[]
  /** 7 segments derived from the community's weeklyHeatmap. */
  readonly weeklyHeatmapBars: readonly {
    readonly day: (typeof WEEK_DAYS)[number]
    readonly value: number
    /** 0–1 normalised height. */
    readonly normalised: number
  }[]
  /** Lead mentor (first isLead=true mentor, falls back to first entry). */
  readonly leadMentor: CommunityMentor | null
  /** Specialty list of the lead mentor, joined with ", ". */
  readonly leadMentorSpecialties: string
  /** Number of additional mentors (for the "+N more" affordance). */
  readonly extraMentorCount: number
  /** AI model pill value — "Archio AI" or "Standard". */
  readonly aiModelValue: string
  /** Live calls pill value — "Live Now" / "Available" / "Recorded". */
  readonly liveCallsValue: string
  /** Dashboard pill value — "Analytics" or "Basic". */
  readonly dashboardValue: string
  /** Verified pill value — "Trusted" or "Pending". */
  readonly verifiedValue: string
  /** Visibility pill value — "Paid" or "Public". */
  readonly visibilityValue: string
}

export function communityToCard(c: Community): CommunityCardModel {
  /* Asset shares ── normalise against the row's max so a 40% bar fully
     fills the column even if no row exceeds 40 %. */
  const maxShare = Math.max(...c.assetShares.map((a) => a.share), 1)
  const assetShareBars = c.assetShares.map((a) => ({
    symbol: a.symbol,
    share: a.share,
    normalised: a.share / maxShare,
  }))

  /* Weekly heatmap ── normalise against 100 (max activity). */
  const weeklyHeatmapBars = c.weeklyHeatmap.map((value, idx) => ({
    day: WEEK_DAYS[idx]!,
    value,
    normalised: Math.max(0, Math.min(1, value / 100)),
  }))

  const leadMentor =
    c.mentors.find((m) => m.isLead) ?? (c.mentors[0] ?? null)
  const leadMentorSpecialties = leadMentor
    ? leadMentor.specialties.slice(0, 3).join(", ")
    : "—"
  const extraMentorCount = Math.max(0, c.mentors.length - 1)

  const aiModelValue = c.hasArchioAi ? "Archio AI" : "Standard"
  const liveCallsValue = c.isLiveNow
    ? "Live Now"
    : c.hasLiveCalls
      ? "Available"
      : "Recorded"
  const dashboardValue = c.hasMentorDashboard ? "Analytics" : "Basic"
  const verifiedValue = c.verified ? "Trusted" : "Pending"
  const visibilityValue = c.visibility === "paid" ? "Paid" : "Public"

  return {
    community: c,
    assetShareBars,
    weeklyHeatmapBars,
    leadMentor,
    leadMentorSpecialties,
    extraMentorCount,
    aiModelValue,
    liveCallsValue,
    dashboardValue,
    verifiedValue,
    visibilityValue,
  }
}

/* ────────────────────────────────────────────────────────────────────
   3.  MENTOR CHIP — strips avatar gradients, keeps monogram + tier.
   ──────────────────────────────────────────────────────────────────── */

export interface MentorChipModel {
  readonly mentor: CommunityMentor
  /** Two-letter monogram from the display name. */
  readonly monogram: string
  /** "LEAD" / "SENIOR" / "COACH" / "MENTOR" */
  readonly tier: string
  /** Specialties truncated to 3 + "+N". */
  readonly specialtiesDisplay: string
  /** Numeric rating fixed to 2 decimals. */
  readonly ratingDisplay: string
}

export function mentorToChip(m: CommunityMentor): MentorChipModel {
  const parts = m.displayName.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? "?"
  const last = parts[parts.length - 1]?.[0] ?? ""
  const monogram = (first + last).toUpperCase()

  let tier = "MENTOR"
  if (m.isLead) tier = "LEAD"
  else if (m.title.toLowerCase().includes("senior")) tier = "SENIOR"
  else if (m.title.toLowerCase().includes("coach")) tier = "COACH"

  const visible = m.specialties.slice(0, 3).join(", ")
  const remaining = Math.max(0, m.specialties.length - 3)
  const specialtiesDisplay = remaining > 0 ? `${visible} · +${remaining}` : visible
  const ratingDisplay = m.rating.toFixed(2)

  return { mentor: m, monogram, tier, specialtiesDisplay, ratingDisplay }
}

/* ────────────────────────────────────────────────────────────────────
   4.  FILTER CHIP DERIVATION — turns a CommunityFilters object into the
        chip-rail entries shown in Zone 3 INPUTS of every template.
   ──────────────────────────────────────────────────────────────────── */

export interface FilterChip {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly removeKey: keyof CommunityFilters
}

const ASSET_LABELS: Readonly<Record<string, string>> = {
  forex: "Forex",
  crypto: "Crypto",
  stocks: "Stocks",
  futures: "Futures",
  mixed: "Mixed",
}

const STYLE_LABELS: Readonly<Record<string, string>> = {
  scalping: "Scalping",
  day_trading: "Day Trading",
  swing: "Swing",
  mixed: "Mixed",
}

const SESSION_LABELS: Readonly<Record<string, string>> = {
  london: "London",
  new_york: "New York",
  asia: "Asia",
  multi_session: "Multi-session",
}

const VISIBILITY_LABELS: Readonly<Record<string, string>> = {
  paid: "Paid",
  public: "Public",
}

const SORT_LABELS: Readonly<Record<string, string>> = {
  activity: "Activity",
  members: "Members",
  rating: "Rating",
  newest: "Newest",
}

export function buildFilterChips(filters: CommunityFilters): readonly FilterChip[] {
  const chips: FilterChip[] = []
  if (filters.search) {
    chips.push({
      id: "search",
      label: "SEARCH",
      value: `"${filters.search}"`,
      removeKey: "search",
    })
  }
  if (filters.assetClass) {
    chips.push({
      id: "asset",
      label: "ASSET",
      value: ASSET_LABELS[filters.assetClass] ?? filters.assetClass,
      removeKey: "assetClass",
    })
  }
  if (filters.tradingStyle) {
    chips.push({
      id: "style",
      label: "STYLE",
      value: STYLE_LABELS[filters.tradingStyle] ?? filters.tradingStyle,
      removeKey: "tradingStyle",
    })
  }
  if (filters.sessionFocus) {
    chips.push({
      id: "session",
      label: "SESSION",
      value: SESSION_LABELS[filters.sessionFocus] ?? filters.sessionFocus,
      removeKey: "sessionFocus",
    })
  }
  if (filters.visibility) {
    chips.push({
      id: "visibility",
      label: "TIER",
      value: VISIBILITY_LABELS[filters.visibility] ?? filters.visibility,
      removeKey: "visibility",
    })
  }
  if (filters.hasArchioAi) {
    chips.push({ id: "ai", label: "AI", value: "Archio AI", removeKey: "hasArchioAi" })
  }
  if (filters.hasLiveCalls) {
    chips.push({
      id: "live",
      label: "CALLS",
      value: "Live calls",
      removeKey: "hasLiveCalls",
    })
  }
  if (filters.verified) {
    chips.push({
      id: "verified",
      label: "VETTED",
      value: "Verified",
      removeKey: "verified",
    })
  }
  if (filters.beginnerFriendly) {
    chips.push({
      id: "beginner",
      label: "MODE",
      value: "Beginner safe",
      removeKey: "beginnerFriendly",
    })
  }
  if (filters.hasMentorDashboard) {
    chips.push({
      id: "dashboard",
      label: "TOOLS",
      value: "Dashboards",
      removeKey: "hasMentorDashboard",
    })
  }
  if (filters.liveNowOnly) {
    chips.push({
      id: "live-now",
      label: "STATE",
      value: "Live now",
      removeKey: "liveNowOnly",
    })
  }
  if (filters.sortBy && filters.sortBy !== "activity") {
    chips.push({
      id: "sort",
      label: "SORT",
      value: SORT_LABELS[filters.sortBy] ?? filters.sortBy,
      removeKey: "sortBy",
    })
  }
  return chips
}

export function removeFilterChip(
  filters: CommunityFilters,
  chip: FilterChip,
): CommunityFilters {
  const next: { -readonly [K in keyof CommunityFilters]: CommunityFilters[K] } = {
    ...filters,
  }
  switch (chip.removeKey) {
    case "search":
      next.search = ""
      break
    case "assetClass":
      next.assetClass = ""
      break
    case "tradingStyle":
      next.tradingStyle = ""
      break
    case "sessionFocus":
      next.sessionFocus = ""
      break
    case "visibility":
      next.visibility = ""
      break
    case "hasArchioAi":
      next.hasArchioAi = false
      break
    case "hasLiveCalls":
      next.hasLiveCalls = false
      break
    case "verified":
      next.verified = false
      break
    case "beginnerFriendly":
      next.beginnerFriendly = false
      break
    case "hasMentorDashboard":
      next.hasMentorDashboard = false
      break
    case "liveNowOnly":
      next.liveNowOnly = false
      break
    case "sortBy":
      next.sortBy = "activity"
      break
    default:
      break
  }
  return next
}

/* ────────────────────────────────────────────────────────────────────
   5.  CONSTELLATION GEOMETRY — when ≥2 nodes are active, dashed
        connectors trace a constellation through the centre.

        We connect every pair through the centre (so if 3 nodes are
        active, we draw 3 segments — A-centre, B-centre, C-centre).
        The result is a calm star burst, not a noisy mesh.
   ──────────────────────────────────────────────────────────────────── */

export interface ConstellationLine {
  readonly id: string
  readonly fromX: number
  readonly fromY: number
  readonly toX: number
  readonly toY: number
  /** 0–1 along the segment for the running route-id label. */
  readonly labelT: number
  readonly routeId: string
}

export function buildConstellation(
  activeIds: readonly string[],
  nodes: readonly OrbitNode[],
  box: number,
): readonly ConstellationLine[] {
  const cx = box / 2
  const cy = box / 2
  const lines: ConstellationLine[] = []
  activeIds.forEach((id, idx) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    const { x, y } = polarToCartesian(node.theta, node.radius, box)
    lines.push({
      id: `cl-${id}`,
      fromX: x,
      fromY: y,
      toX: cx,
      toY: cy,
      labelT: 0.55,
      routeId: `R${node.ringIndex}-${String(idx).padStart(2, "0")}`,
    })
  })
  return lines
}

/* ────────────────────────────────────────────────────────────────────
   6.  RANK + MATCH — pure scoring used by Discover Ecosystems'
        resolver-meta.

        Score = (active-dimensions matched / active-dimensions total)
                * weeklyActivity / 100.

        Communities with no active filters fall back to weeklyActivity.
   ──────────────────────────────────────────────────────────────────── */

export function rankCommunitiesAgainstFilters(
  communities: readonly Community[],
  filters: CommunityFilters,
): readonly { community: Community; score: number; matchPct: number }[] {
  const active = activeDimensionCount(filters)

  return communities
    .map((c) => {
      let matched = 0
      if (filters.assetClass && c.assetClass === filters.assetClass) matched++
      if (filters.tradingStyle && c.tradingStyle === filters.tradingStyle) matched++
      if (filters.sessionFocus && c.sessionFocus === filters.sessionFocus) matched++
      if (filters.visibility && c.visibility === filters.visibility) matched++
      if (filters.hasArchioAi && c.hasArchioAi) matched++
      if (filters.hasLiveCalls && c.hasLiveCalls) matched++
      if (filters.verified && c.verified) matched++
      if (filters.beginnerFriendly && c.beginnerFriendly) matched++
      if (filters.hasMentorDashboard && c.hasMentorDashboard) matched++
      if (filters.liveNowOnly && c.isLiveNow) matched++
      const matchPct = active === 0 ? 1 : matched / active
      const score = matchPct * (c.weeklyActivity / 100)
      return { community: c, score, matchPct }
    })
    .sort((a, b) => b.score - a.score)
}

function activeDimensionCount(f: CommunityFilters): number {
  let n = 0
  if (f.assetClass) n++
  if (f.tradingStyle) n++
  if (f.sessionFocus) n++
  if (f.visibility) n++
  if (f.hasArchioAi) n++
  if (f.hasLiveCalls) n++
  if (f.verified) n++
  if (f.beginnerFriendly) n++
  if (f.hasMentorDashboard) n++
  if (f.liveNowOnly) n++
  return n
}

/* ────────────────────────────────────────────────────────────────────
   7.  NL INTENT KEYWORDS — used by template-registry's
        templateIdFromQuery extension to route Oracle-bar prompts to
        the right Communities surface.
   ──────────────────────────────────────────────────────────────────── */

export const COMMUNITIES_NL_KEYWORDS = {
  /** Triggers the Discover radial. */
  discover: [
    "find me a community",
    "find a community",
    "ideal community",
    "show me communities",
    "discover community",
    "discover a community",
    "discover ecosystems",
    "discover ecosystem",
    "perfect community",
    "perfect ecosystem",
  ],
  /** Triggers the Atlas grid. */
  atlas: [
    "atlas",
    "all communities",
    "browse communities",
    "list communities",
    "open community atlas",
    "community atlas",
    "every community",
    "every ecosystem",
    "live now",
    "verified scalping rooms",
    "verified scalping",
    "communities with ai",
    "communities with ai models",
  ],
  /** Triggers a profile if the query mentions a known community name. */
  profileNames: [
    "scalp velocity",
    "london precision lab",
    "wall street edge",
    "tokyo flow",
    "foundation academy",
    "neural trading lab",
    "macro swing collective",
    "discipline circle",
  ],
} as const

/* ── parseCommunitiesIntent ─────────────────────────────────────────
   Lightweight rule-based classifier that returns a discriminated
   union for the viewport's openFromQuery to dispatch.

   Order matters:
     1. Profile-name lookup wins — "Open London Precision Lab" should
        always go straight to the profile.
     2. Atlas keywords come next — "verified scalping rooms" wants the
        grid pre-filtered, not the radial.
     3. Discover keywords are the catch-all — vague exploration
        queries land in the radial finder.
─────────────────────────────────────────────────────────────────── */

export type CommunitiesIntent =
  | {
      readonly detected: true
      readonly target: "profile"
      readonly slug: string
      readonly rawQuery: string
      readonly resolverNote: string
    }
  | {
      readonly detected: true
      readonly target: "atlas"
      readonly filters: CommunityFilters
      readonly rawQuery: string
      readonly resolverNote: string
    }
  | {
      readonly detected: true
      readonly target: "discover"
      readonly filters: CommunityFilters
      readonly activeNodeIds: readonly string[]
      readonly rawQuery: string
      readonly resolverNote: string
    }
  | { readonly detected: false }

export function parseCommunitiesIntent(query: string): CommunitiesIntent {
  const q = query.toLowerCase().trim()
  if (q.length < 3) return { detected: false }

  /* ── 1. Profile-name lookup ──────────────────────────────────── */
  for (const name of COMMUNITIES_NL_KEYWORDS.profileNames) {
    if (q.includes(name)) {
      const community = MOCK_COMMUNITIES.find(
        (c) => c.name.toLowerCase() === name,
      )
      if (community) {
        return {
          detected: true,
          target: "profile",
          slug: community.slug,
          rawQuery: query,
          resolverNote: `Matched on community name "${community.name}".`,
        }
      }
    }
  }

  /* ── 2. Atlas-routing keywords (with filter inference) ───────── */
  if (q.includes("live now")) {
    return {
      detected: true,
      target: "atlas",
      filters: { ...EMPTY_FILTERS, liveNowOnly: true },
      rawQuery: query,
      resolverNote: "Filtered to ecosystems live right now.",
    }
  }
  if (q.includes("verified scalping")) {
    return {
      detected: true,
      target: "atlas",
      filters: {
        ...EMPTY_FILTERS,
        verified: true,
        tradingStyle: "scalping",
      },
      rawQuery: query,
      resolverNote: "Filtered to verified · scalping rooms.",
    }
  }
  if (q.includes("communities with ai") || q.includes("ai models")) {
    return {
      detected: true,
      target: "atlas",
      filters: { ...EMPTY_FILTERS, hasArchioAi: true },
      rawQuery: query,
      resolverNote: "Filtered to ecosystems running Archio AI models.",
    }
  }
  for (const kw of COMMUNITIES_NL_KEYWORDS.atlas) {
    if (q.includes(kw)) {
      return {
        detected: true,
        target: "atlas",
        filters: { ...EMPTY_FILTERS },
        rawQuery: query,
        resolverNote: `Matched atlas keyword: "${kw}".`,
      }
    }
  }

  /* ── 3. Discover-routing keywords ─────────────────────────────── */
  for (const kw of COMMUNITIES_NL_KEYWORDS.discover) {
    if (q.includes(kw)) {
      return {
        detected: true,
        target: "discover",
        filters: { ...EMPTY_FILTERS },
        activeNodeIds: inferDimensionsFromQuery(q),
        rawQuery: query,
        resolverNote: `Matched discover keyword: "${kw}".`,
      }
    }
  }

  return { detected: false }
}

/* ── Empty filters template ────────────────────────────────────────
   Used by parseCommunitiesIntent so each branch starts clean. The
   shape matches CommunityFilters in communities-source.ts; every
   field is optional, so an empty literal would type-check, but we
   spell it out to make the intent explicit.                          */
const EMPTY_FILTERS: CommunityFilters = {
  search: "",
  assetClass: "",
  tradingStyle: "",
  sessionFocus: "",
  visibility: "",
}

/* ── inferDimensionsFromQuery ───────────────────────────────────────
   Cheap dimension-id sniffer. Maps obvious words in the query to
   discovery dimension ids so the radial pre-activates the right
   nodes when the trader types something like "find me a beginner-
   safe scalping community". Free from regex; just substring checks.
─────────────────────────────────────────────────────────────────── */
function inferDimensionsFromQuery(q: string): readonly string[] {
  const ids: string[] = []
  const push = (id: string) => {
    if (!ids.includes(id)) ids.push(id)
  }
  if (q.includes("beginner") || q.includes("safe")) push("beginner_safe")
  if (q.includes("scalp")) push("scalping")
  if (q.includes("day trad")) push("day_trading")
  if (q.includes("swing")) push("swing")
  if (q.includes("forex") || q.includes("fx")) push("forex")
  if (q.includes("crypto")) push("crypto")
  if (q.includes("stock") || q.includes("equit")) push("stocks")
  if (q.includes("london")) push("london")
  if (q.includes("verified")) push("verified")
  if (q.includes("ai") || q.includes("model")) push("ai_models")
  if (q.includes("live") && q.includes("call")) push("live_calls")
  if (q.includes("mentor")) push("mentor_access")
  if (q.includes("psychology") || q.includes("mind"))
    push("trading_psychology")
  if (q.includes("risk")) push("risk_mgmt")
  if (q.includes("research")) push("research")
  if (q.includes("prop firm")) push("prop_firm")
  if (q.includes("signal")) push("signals")
  if (q.includes("culture")) push("culture")
  if (q.includes("peer") || q.includes("energy")) push("peer_energy")
  if (q.includes("small") || q.includes("tribe")) push("small_tribe")
  if (q.includes("accountab")) push("accountability")
  return ids
}
