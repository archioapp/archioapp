"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Crosshair,
  Hourglass,
  Shield,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react"
import { ACCENT } from "@/components/mtf/mtf-theme"
import type { ForecastItem, ForecastStatus } from "./forecast-types"
import { ForecastInlineDetail } from "./forecast-inline-detail"
import { VT, amber, slate } from "./forecast-vantary-tokens"
import {
  ForecastScopeNavigator,
  SUB_FILTERS,
  type ForecastScope,
  type ForecastSortKey,
} from "./forecast-scope-navigator"

/* ══════════════════════════════════════════════════════════════════════
   SAMPLE DATA (UNCHANGED — business data preserved verbatim)
   ══════════════════════════════════════════════════════════════════════ */
const SAMPLE_FORECASTS: ForecastItem[] = [
  {
    id: "fc-001",
    user: {
      id: "u1", name: "Alexandra Chen", role: "mentor", tier: "expert",
      isMentor: true, isVerified: true, communityName: "ICT Mastery",
      resolvedCount: 87, overallAccuracy: 72,
    },
    instrument: "EURUSD", instrumentType: "Forex", direction: "LONG", timeframe: "4H",
    entry: "1.0845", stopLoss: "1.0790", takeProfit: "1.0950", riskReward: "1:1.9",
    confidence: 78,
    commentary: "Break + retest of daily resistance with London-session continuation. Institutional support at key order block level.",
    invalidation: "Break below 1.0780 with displacement invalidates this setup.",
    confluences: [
      { id: "c1", name: "Order Block", strength: 92, category: "structure" },
      { id: "c2", name: "FVG Retest", strength: 85, category: "liquidity" },
      { id: "c3", name: "London Session", strength: 70, category: "session" },
    ],
    status: "active",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 3600000).toISOString(),
    likes: 24, comments: 8, views: 156,
    communityContext: { id: "comm-1", name: "ICT Mastery" },
  },
  {
    id: "fc-002",
    user: {
      id: "u2", name: "Marcus Rodriguez", role: "trader", tier: "advanced",
      isMentor: false, isVerified: true, resolvedCount: 34, overallAccuracy: 65,
    },
    instrument: "BTCUSD", instrumentType: "Crypto", direction: "SHORT", timeframe: "1H",
    entry: "67,450", stopLoss: "68,200", takeProfit: "65,800", riskReward: "1:2.2",
    confidence: 65,
    commentary: "Distribution pattern forming at key resistance. RSI divergence on 4H confirms exhaustion.",
    confluences: [
      { id: "c3", name: "RSI Divergence", strength: 88, category: "momentum" },
      { id: "c4", name: "Supply Zone", strength: 80, category: "structure" },
    ],
    status: "resolved_win", accuracy: 94,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    likes: 41, comments: 12, views: 312,
  },
  {
    id: "fc-003",
    user: {
      id: "u3", name: "Sarah Kim", role: "student", tier: "intermediate",
      isMentor: false, isVerified: false, resolvedCount: 8, overallAccuracy: 50,
    },
    instrument: "NAS100", instrumentType: "Indices", direction: "LONG", timeframe: "15m",
    entry: "18,245", stopLoss: "18,180", takeProfit: "18,390", riskReward: "1:2.2",
    confidence: 55,
    commentary: "Break and retest of daily resistance confirmed. Looking for NY session momentum continuation.",
    confluences: [
      { id: "c5", name: "Break & Retest", strength: 75, category: "pattern" },
      { id: "c6", name: "NY Session", strength: 68, category: "session" },
    ],
    status: "active",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 3600000).toISOString(),
    likes: 5, comments: 2, views: 43,
    mentorReview: {
      mentorName: "Alexandra Chen", mentorId: "u1", rating: 7,
      feedback: "Good confluence identification. Entry could be tighter -- wait for the displacement candle.",
      reviewedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    },
  },
  {
    id: "fc-004",
    user: {
      id: "u4", name: "David Park", role: "trader", tier: "advanced",
      isMentor: false, isVerified: true, resolvedCount: 52, overallAccuracy: 61,
    },
    instrument: "XAUUSD", instrumentType: "Commodities", direction: "LONG", timeframe: "1D",
    entry: "2,315", stopLoss: "2,280", takeProfit: "2,400", riskReward: "1:2.4",
    confidence: 82,
    commentary: "Weekly order block rejection with strong bullish displacement. DXY showing continued weakness supporting gold rally.",
    confluences: [
      { id: "c7", name: "Weekly OB", strength: 95, category: "structure" },
      { id: "c8", name: "DXY Weakness", strength: 85, category: "momentum" },
      { id: "c9", name: "Displacement", strength: 90, category: "pattern" },
    ],
    status: "resolved_loss",
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    likes: 18, comments: 6, views: 198,
  },
  {
    id: "fc-005",
    user: {
      id: "u5", name: "Emily Torres", role: "student", tier: "beginner",
      isMentor: false, isVerified: false, resolvedCount: 2, overallAccuracy: 0,
    },
    instrument: "GBPJPY", instrumentType: "Forex", direction: "SHORT", timeframe: "1H",
    entry: "191.45", stopLoss: "192.10", takeProfit: "190.15", riskReward: "1:2.0",
    confidence: 48,
    commentary: "Potential reversal at session high. Confluence from Asian session sweep and bearish engulfing.",
    confluences: [
      { id: "c10", name: "Session Sweep", strength: 65, category: "session" },
    ],
    status: "near_expiry",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    likes: 3, comments: 1, views: 28,
  },
]

/* ══════════════════════════════════════════════════════════════════════
   FEED COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
interface ForecastFeedProps {
  searchQuery: string
  instrumentFilter: string
  statusFilter: string
  onViewForecast: (forecast: ForecastItem) => void
  onSubmit: () => void
  selectedForecast?: ForecastItem | null
  onCloseDetail?: () => void
}

export function ForecastFeed({ searchQuery, instrumentFilter, statusFilter, onViewForecast, onSubmit, selectedForecast, onCloseDetail }: ForecastFeedProps) {
  // Sort + multi-scope navigator state (replaces the old static stats strip)
  const [sortBy, setSortBy] = useState<ForecastSortKey>("recent")
  const [scope, setScope] = useState<ForecastScope>("global")
  const [subFilter, setSubFilter] = useState<string>("all")
  const [community, setCommunity] = useState<string>("All Communities")
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)

  // Reset to first sub-filter whenever scope changes (clean default)
  const onScopeChange = (s: ForecastScope) => {
    setScope(s)
    setSubFilter(SUB_FILTERS[s][0]?.id ?? "all")
  }

  // Derive a community for a forecast — uses authored context first,
  // falls back to instrument category (so the filter works on existing data)
  function deriveCommunity(f: ForecastItem): string {
    if (f.communityContext?.name) return f.communityContext.name
    const sym = f.instrument
    if (/BTC|ETH|SOL/i.test(sym)) return "Crypto Inner Circle"
    if (/XAU|XAG|OIL/i.test(sym)) return "Commodities Desk"
    if (/^NAS|^SPX|^US30|^DAX|^FTSE/.test(sym)) return "Indices Hub"
    return "FX Mastermind"
  }

  function applyScopeFilter(items: ForecastItem[]): ForecastItem[] {
    switch (scope) {
      case "global":
        return items
      case "community": {
        if (community === "All Communities") return items
        return items.filter((f) => deriveCommunity(f) === community)
      }
      case "mentors": {
        let out = items.filter((f) => f.user.isMentor)
        if (selectedMentorId) out = out.filter((f) => f.user.id === selectedMentorId)
        return out
      }
      case "personal":
        return items.filter((f) => f.user.id === "you")
      default:
        return items
    }
  }

  function applySubFilter(items: ForecastItem[]): ForecastItem[] {
    if (subFilter === "all" || subFilter === "all-verified") return items
    const newsRe = /fomc|cpi|nfp|news|macro|session|dxy|fed|rate|jobs|inflation|ecb|boj/i
    const now = Date.now()
    const DAY = 86_400_000
    switch (subFilter) {
      // ── engagement / curation ──
      case "trending":
      case "hot-calls":
        return [...items].sort(
          (a, b) =>
            (b.views + b.likes * 2 + b.comments * 3) -
            (a.views + a.likes * 2 + a.comments * 3),
        )
      case "discussions":
        return [...items].filter((f) => f.comments > 0).sort((a, b) => b.comments - a.comments)
      case "featured":
      case "reviewed":
        return items.filter(
          (f) => f.mentorReview || f.status === "resolved_win" || f.status === "resolved_loss",
        )
      case "news-alerts":
        return items.filter((f) => newsRe.test(f.commentary))

      // ── conviction / status ──
      case "high-conviction":
      case "high-conviction-mine":
        return items.filter((f) => f.confidence >= 70)
      case "highest-edge":
        return items.filter((f) => f.confidence >= 80)
      case "active-setups":
      case "active":
        return items.filter((f) => f.status === "active" || f.status === "near_expiry")
      case "expiring-soon":
        return items.filter((f) => f.status === "near_expiry")
      case "won":
        return items.filter((f) => f.status === "resolved_win")
      case "lost":
        return items.filter((f) => f.status === "resolved_loss")
      case "pending-review":
        return items.filter(
          (f) => (f.status === "resolved_win" || f.status === "resolved_loss") && !f.mentorReview,
        )

      // ── direction ──
      case "bullish":
      case "bullish-bias":
        return items.filter((f) => f.direction === "long")
      case "bearish":
      case "bearish-bias":
        return items.filter((f) => f.direction === "short")

      // ── instrument class ──
      case "forex-only":
      case "specialists-fx":
        return items.filter((f) => f.instrumentType === "FOREX")
      case "crypto-only":
      case "specialists-crypto":
        return items.filter((f) => f.instrumentType === "CRYPTO")
      case "indices-only":
        return items.filter((f) => f.instrumentType === "INDEX")

      // ── time window ──
      case "new-today":
        return items.filter((f) => now - new Date(f.createdAt).getTime() < DAY)
      case "this-week":
        return items.filter((f) => now - new Date(f.createdAt).getTime() < 7 * DAY)

      // ── people / reputation ──
      case "good-traders":
        return items.filter((f) => f.user.isVerified && f.user.overallAccuracy >= 60)
      case "top-rated":
      case "top-wr":
        return items.filter((f) => f.user.overallAccuracy >= 60)
      case "pro-tier":
        return items.filter((f) => f.user.overallAccuracy >= 70 && f.user.resolvedCount >= 20)
      case "mentor-led":
        return items.filter((f) => f.user.isMentor)
      case "most-active":
        return [...items].sort((a, b) => b.user.resolvedCount - a.user.resolvedCount)
      case "recent-calls":
        return [...items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

      case "watching":
        return []
      default:
        return items
    }
  }

  const filteredForecasts = useMemo(() => {
    let items = [...SAMPLE_FORECASTS]

    // 1) Scope (Global / Community / Mentors / Personal) — gates the dataset
    items = applyScopeFilter(items)

    // 2) Sub-filter (per-scope refinement: trending, news, good-traders, etc.)
    items = applySubFilter(items)

    // 3) Existing legacy filters preserved verbatim
    if (instrumentFilter !== "All") items = items.filter((f) => f.instrumentType === instrumentFilter)
    if (statusFilter !== "All Status") {
      const statusMap: Record<string, ForecastStatus[]> = {
        Active: ["active", "near_expiry"],
        Resolved: ["resolved_win", "resolved_loss"],
        Expired: ["expired", "invalidated"],
      }
      const allowed = statusMap[statusFilter] || []
      if (allowed.length) items = items.filter((f) => allowed.includes(f.status))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (f) => f.instrument.toLowerCase().includes(q) || f.user.name.toLowerCase().includes(q) || f.commentary.toLowerCase().includes(q)
      )
    }

    // 4) Sort — only applied when a sub-filter hasn't already imposed an ordering
    const orderingSubFilters = new Set([
      "trending", "hot-calls", "discussions", "most-active", "recent-calls",
    ])
    if (!orderingSubFilters.has(subFilter)) {
      switch (sortBy) {
        case "popular": items.sort((a, b) => b.views - a.views); break
        case "confidence": items.sort((a, b) => b.confidence - a.confidence); break
        default: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    }
    return items
  }, [searchQuery, instrumentFilter, statusFilter, sortBy, scope, subFilter, community, selectedMentorId])

  const feedStats = useMemo(() => {
    const active = SAMPLE_FORECASTS.filter((f) => f.status === "active" || f.status === "near_expiry").length
    const resolved = SAMPLE_FORECASTS.filter((f) => f.status === "resolved_win" || f.status === "resolved_loss").length
    const mentorReviewed = SAMPLE_FORECASTS.filter((f) => f.mentorReview != null).length
    return { active, resolved, mentorReviewed, total: SAMPLE_FORECASTS.length }
  }, [])

  // Per-scope total counts (used by scope tabs) — derived from raw data, not filtered
  const scopeCounts = useMemo(() => {
    return {
      global: SAMPLE_FORECASTS.length,
      community: SAMPLE_FORECASTS.length,
      mentors: SAMPLE_FORECASTS.filter((f) => f.user.isMentor).length,
      personal: SAMPLE_FORECASTS.filter((f) => f.user.id === "you").length,
    }
  }, [])

  // Sub-filter counts for the active scope — recomputed when scope/community/mentor changes
  const subFilterCounts = useMemo(() => {
    const base = applyScopeFilter([...SAMPLE_FORECASTS])
    const newsRe = /fomc|cpi|nfp|news|macro|session|dxy|fed|rate|jobs|inflation|ecb|boj/i
    const now = Date.now()
    const DAY = 86_400_000
    const counts: Record<string, number> = {}
    for (const def of SUB_FILTERS[scope]) {
      let n = base.length
      switch (def.id) {
        // pinned + non-filtering sorts
        case "all":
        case "all-verified":
        case "trending":
        case "hot-calls":
        case "most-active":
        case "recent-calls":
          n = base.length; break

        // conviction
        case "high-conviction":
        case "high-conviction-mine":
          n = base.filter((f) => f.confidence >= 70).length; break
        case "highest-edge":
          n = base.filter((f) => f.confidence >= 80).length; break

        // status
        case "active-setups":
        case "active":
          n = base.filter((f) => f.status === "active" || f.status === "near_expiry").length; break
        case "expiring-soon":
          n = base.filter((f) => f.status === "near_expiry").length; break
        case "won":
          n = base.filter((f) => f.status === "resolved_win").length; break
        case "lost":
          n = base.filter((f) => f.status === "resolved_loss").length; break
        case "pending-review":
          n = base.filter((f) => (f.status === "resolved_win" || f.status === "resolved_loss") && !f.mentorReview).length; break
        case "reviewed":
        case "featured":
          n = base.filter((f) => f.mentorReview || f.status === "resolved_win" || f.status === "resolved_loss").length; break

        // direction
        case "bullish":
        case "bullish-bias":
          n = base.filter((f) => f.direction === "long").length; break
        case "bearish":
        case "bearish-bias":
          n = base.filter((f) => f.direction === "short").length; break

        // instrument class
        case "forex-only":
        case "specialists-fx":
          n = base.filter((f) => f.instrumentType === "FOREX").length; break
        case "crypto-only":
        case "specialists-crypto":
          n = base.filter((f) => f.instrumentType === "CRYPTO").length; break
        case "indices-only":
          n = base.filter((f) => f.instrumentType === "INDEX").length; break

        // time
        case "new-today":
          n = base.filter((f) => now - new Date(f.createdAt).getTime() < DAY).length; break
        case "this-week":
          n = base.filter((f) => now - new Date(f.createdAt).getTime() < 7 * DAY).length; break

        // people
        case "good-traders":
          n = base.filter((f) => f.user.isVerified && f.user.overallAccuracy >= 60).length; break
        case "top-wr":
        case "top-rated":
          n = base.filter((f) => f.user.overallAccuracy >= 60).length; break
        case "pro-tier":
          n = base.filter((f) => f.user.overallAccuracy >= 70 && f.user.resolvedCount >= 20).length; break
        case "mentor-led":
          n = base.filter((f) => f.user.isMentor).length; break
        case "news-alerts":
          n = base.filter((f) => newsRe.test(f.commentary)).length; break
        case "discussions":
          n = base.filter((f) => f.comments > 0).length; break

        case "watching":
          n = 0; break
        default:
          n = base.length
      }
      counts[def.id] = n
    }
    return counts
  }, [scope, community, selectedMentorId])

  // Distinct community list — derived once from sample data
  const communities = useMemo(() => {
    const set = new Set<string>(["All Communities"])
    for (const f of SAMPLE_FORECASTS) set.add(deriveCommunity(f))
    return Array.from(set)
  }, [])

  // Distinct mentor list — derived once from sample data
  const mentors = useMemo(() => {
    const map = new Map<string, ForecastItem["user"]>()
    for (const f of SAMPLE_FORECASTS) {
      if (f.user.isMentor && !map.has(f.user.id)) map.set(f.user.id, f.user)
    }
    return Array.from(map.values())
  }, [])

  // If a forecast is selected, show inline detail instead of the grid (UNCHANGED)
  if (selectedForecast && onCloseDetail) {
    return <ForecastInlineDetail forecast={selectedForecast} onClose={onCloseDetail} />
  }

  return (
    <div>
      {/* ════════════════════════════════════════════════════════════════
          SCOPE NAVIGATOR — replaces the old static LIVE/ACTIVE/RESOLVED/SORT strip
          - Row 1: scope tabs (Global / Community / Mentors / Personal)
                   + contextual selector (community dropdown / mentor rail)
                   + result counter + sort segment
          - Row 2: per-scope sub-filter palette with live counts
          ════════════════════════════════════════════════════════════════ */}
      <ForecastScopeNavigator
        scope={scope}
        onScopeChange={onScopeChange}
        scopeCounts={scopeCounts}
        subFilter={subFilter}
        onSubFilterChange={setSubFilter}
        subFilterCounts={subFilterCounts}
        community={community}
        onCommunityChange={setCommunity}
        communities={communities}
        mentors={mentors.map((u) => ({
          id: u.id,
          name: u.name,
          isVerified: u.isVerified,
          accuracy: u.overallAccuracy,
        }))}
        selectedMentorId={selectedMentorId}
        onMentorChange={setSelectedMentorId}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultsCount={filteredForecasts.length}
        stats={feedStats}
      />

      {/* Card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredForecasts.map((forecast, i) => (
          <ForecastCard key={forecast.id} forecast={forecast} index={i} onView={onViewForecast} />
        ))}
      </div>
      {filteredForecasts.length === 0 && <EmptyFeedState onSubmit={onSubmit} />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   FORECAST CARD — Forecast Passport Preview
   ──────────────────────────────────────────────────────────────────────
   The compressed dossier. When opened, this becomes the full Forecast
   Passport popup. Carries the popup's design DNA so the transition
   from grid → popup feels like one continuous surface, not two:

     • 22px radius glass primitive (white-on-glass gradient + hairline)
     • inset top highlight + direction-tinted corner glow
     • mentor ribbon corner ornament when reviewed
     • lifecycle pulse rail on the left edge for live forecasts
     • soft directional wash inside the chart preview

   Information layers (top → bottom):
     1. IDENTITY ROW — symbol · timeframe · direction · lifecycle/time
     2. THESIS       — 2-line preview of the call's reasoning
     3. AUTHOR       — avatar · name · mentor badge · accuracy · calls · community
     4. EVIDENCE     — up to 3 confluence chips with category dot
     5. CHART        — premium candle preview with directional glow
     6. PLAN STRIP   — Entry · Stop · Target · R:R · Move
     7. OPEN ACTION  — chevron + "Open Dossier" hover label
   ══════════════════════════════════════════════════════════════════════ */
function ForecastCard({
  forecast, index, onView,
}: {
  forecast: ForecastItem; index: number
  onView: (f: ForecastItem) => void
}) {
  const [hover, setHover] = useState(false)
  const { user, instrument, direction, status } = forecast
  const dirRgb = direction === "LONG" ? VT.emeraldRgb : VT.roseRgb
  const dirHex = direction === "LONG" ? VT.emerald : VT.rose
  const statusCfg = getStatusConfig(status)
  const isResolved = status === "resolved_win" || status === "resolved_loss"
  const isLive = status === "active" || status === "near_expiry"

  const projectedMove = useMemo(() => {
    const entry = parseFloat(forecast.entry.replace(/,/g, ""))
    const target = parseFloat(forecast.takeProfit.replace(/,/g, ""))
    if (isNaN(entry) || isNaN(target) || entry === 0) return null
    const pct = ((target - entry) / entry) * 100
    return direction === "SHORT" ? `${(pct * -1).toFixed(2)}%` : `+${pct.toFixed(2)}%`
  }, [forecast.entry, forecast.takeProfit, direction])

  // Status-tinted ambient signature — gives each card a quiet personality
  // without breaking the unified glass language. ~6–10% alpha only.
  const statusRgb = statusCfg.color // active=emerald, near_expiry=amber, win=emerald, loss=rose
  const statusAmbient = isLive
    ? `rgba(${statusRgb},${hover ? 0.10 : 0.07})`
    : `rgba(${statusRgb},${hover ? 0.08 : 0.05})`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: VT.ease }}
      onClick={() => onView(forecast)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -2 }}
      className="relative cursor-pointer group overflow-hidden"
      style={{
        borderRadius: 22,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.024) 100%)",
        border: `1px solid ${hover ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        boxShadow: hover
          ? `0 1px 0 rgba(255,255,255,0.08) inset, 0 16px 40px rgba(0,0,0,0.48), 0 0 0 1px ${statusAmbient}`
          : `0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${statusAmbient}, 0 1px 2px rgba(0,0,0,0.2)`,
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* ── Top inset highlight (gentle 4s breathing on live cards only) ── */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        animate={isLive ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
        }}
      />

      {/* ── Direction-tinted corner glow ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 0,
          right: 0,
          width: 320,
          height: 220,
          background: `radial-gradient(circle at top right, rgba(${dirRgb},${hover ? 0.11 : 0.06}), transparent 65%)`,
          transition: "background 0.3s",
        }}
      />

      {/* ── Hover hairline traveler ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${dirRgb},0.55), transparent)`,
        }}
      />

      {/* ── Lifecycle pulse rail — only for live forecasts ── */}
      {isLive && (
        <motion.div
          className="absolute left-0 top-6 bottom-6 w-px z-10 pointer-events-none"
          animate={{ opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `linear-gradient(180deg, transparent, rgba(${statusCfg.color},0.7), transparent)`,
          }}
        />
      )}

      {/* ── Mentor reviewed corner ribbon ── */}
      {forecast.mentorReview && (
        <MentorRibbonCorner rating={forecast.mentorReview.rating} />
      )}

      {/* ════════════════════════════════════════════════════════
          INFO + CHART ZONE
          ════════════════════════════════════════════════════════ */}
      <div className="flex relative">
        {/* LEFT — intelligence stack */}
        <div className="flex-1 p-5 pr-4 min-w-0 flex flex-col gap-3.5">
          {/* 1) IDENTITY ROW — symbol left, status + direction right (consistent across every card) */}
          <div className="flex items-center justify-between gap-3">
            <span
              className="font-sans truncate"
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: VT.paper,
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              {instrument}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusWord statusCfg={statusCfg} isLive={isLive} />
              <DirectionChip direction={direction} dirRgb={dirRgb} dirHex={dirHex} />
            </div>
          </div>

          {/* 2) THESIS */}
          <p
            className="font-sans line-clamp-2"
            style={{
              fontSize: 12.5,
              lineHeight: 1.55,
              color: VT.paperDim,
              letterSpacing: "0.005em",
            }}
          >
            {forecast.commentary}
          </p>

          {/* 3) AUTHOR STRIP */}
          <div
            className="flex items-center gap-2 pt-3"
            style={{ borderTop: "1px dashed rgba(255,255,255,0.06)" }}
          >
            <AuthorAvatar user={user} dirRgb={dirRgb} />
            <span
              className="font-sans truncate"
              style={{
                fontSize: 11.5,
                color: VT.paper,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {user.name}
            </span>
            {user.isMentor ? (
              <span
                className="font-mono uppercase px-1.5 flex-shrink-0 inline-flex items-center"
                style={{
                  height: 14,
                  fontSize: 8,
                  letterSpacing: "0.22em",
                  color: VT.amber,
                  fontWeight: 500,
                  background: amber(0.08),
                  border: `1px solid ${amber(0.22)}`,
                  borderRadius: 3,
                }}
              >
                Mentor
              </span>
            ) : (
              user.isVerified && (
                <CheckCircle2
                  size={10}
                  strokeWidth={1.6}
                  style={{ color: VT.emerald, opacity: 0.6, flexShrink: 0 }}
                />
              )
            )}

            {/* Stat dot separator */}
            <div
              className="rounded-full flex-shrink-0"
              style={{ width: 3, height: 3, background: VT.rule }}
            />

            {/* Accuracy */}
            {user.overallAccuracy != null && user.overallAccuracy > 0 ? (
              <div className="flex items-baseline gap-1 flex-shrink-0">
                <span
                  className="font-sans tabular-nums"
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: user.overallAccuracy >= 60 ? VT.emerald : VT.paperDim,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {user.overallAccuracy}%
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 8.5,
                    letterSpacing: "0.18em",
                    color: VT.ashGhost,
                    fontWeight: 500,
                  }}
                >
                  Acc
                </span>
              </div>
            ) : (
              <span
                className="font-mono uppercase flex-shrink-0"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.18em",
                  color: VT.ashGhost,
                  fontWeight: 500,
                }}
              >
                New
              </span>
            )}

            {/* Calls */}
            {user.resolvedCount != null && user.resolvedCount > 0 && (
              <>
                <div
                  className="rounded-full flex-shrink-0"
                  style={{ width: 3, height: 3, background: VT.rule }}
                />
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span
                    className="font-sans tabular-nums"
                    style={{
                      fontSize: 10.5,
                      color: VT.paperDim,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {user.resolvedCount}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: 8.5,
                      letterSpacing: "0.18em",
                      color: VT.ashGhost,
                      fontWeight: 500,
                    }}
                  >
                    Calls
                  </span>
                </div>
              </>
            )}

            {/* Community context — pushed to right */}
            {forecast.communityContext && (
              <div className="ml-auto flex items-center gap-1 flex-shrink-0 truncate">
                <Sparkles
                  size={9}
                  strokeWidth={1.7}
                  style={{ color: amber(0.7), flexShrink: 0 }}
                />
                <span
                  className="font-sans truncate"
                  style={{
                    fontSize: 10.5,
                    color: VT.ashSoft,
                    fontWeight: 500,
                    letterSpacing: "0.005em",
                  }}
                >
                  {forecast.communityContext.name}
                </span>
              </div>
            )}
          </div>

          {/* 4) EVIDENCE CHIPS — single row only, fixed slot height for vertical rhythm.
              Cap visible to 2; everything else collapses into a "+N" overflow pill so
              cards with many confluences never grow taller than cards with few. */}
          <div
            className="flex items-center gap-1.5 flex-nowrap overflow-hidden"
            style={{ minHeight: 22 }}
          >
            {forecast.confluences.slice(0, 2).map((c) => (
              <EvidenceChip key={c.id} confluence={c} />
            ))}
            {forecast.confluences.length > 2 && (
              <span
                className="font-mono uppercase inline-flex items-center px-1.5 flex-shrink-0"
                style={{
                  height: 22,
                  fontSize: 8.5,
                  letterSpacing: "0.18em",
                  color: VT.ashSoft,
                  fontWeight: 500,
                  borderRadius: VT.chipRadius,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                +{forecast.confluences.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT — chart preview */}
        <div
          className="w-[40%] flex-shrink-0 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 100%)",
            borderLeft: "1px dashed rgba(255,255,255,0.05)",
          }}
        >
          {/* Directional wash inside chart panel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, rgba(${dirRgb},${hover ? 0.07 : 0.028}) 0%, transparent 65%)`,
              transition: "background 0.3s",
            }}
          />
          <CardChart forecast={forecast} dirRgb={dirRgb} hover={hover} />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          PLAN STRIP — polished execution summary
          ────────────────────────────────────────────────────────
          • Brighter labels (ashSoft) — readable at a glance
          • Higher-contrast semantic values (rose/emerald/amber lifted)
          • Hover-warmed background for "alive but not flashy" feel
          ════════════════════════════════════════════════════════ */}
      <div
        className="flex items-stretch relative"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: hover
            ? "linear-gradient(180deg, rgba(255,255,255,0.030) 0%, rgba(255,255,255,0.012) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.020) 0%, rgba(255,255,255,0.006) 100%)",
          transition: "background 0.3s",
        }}
      >
        <div className="flex-1 flex items-stretch">
          {[
            { label: "Entry", value: forecast.entry, color: VT.paper },
            { label: "Stop", value: forecast.stopLoss, color: `rgba(${VT.roseRgb},0.95)` },
            { label: "Target", value: forecast.takeProfit, color: `rgba(${VT.emeraldRgb},0.95)` },
            { label: "R:R", value: forecast.riskReward, color: `rgba(${VT.amberRgb},0.95)` },
            ...(projectedMove
              ? [{ label: "Move", value: projectedMove, color: `rgba(${dirRgb},0.95)` }]
              : []),
          ].map((m, i, arr) => (
            <div
              key={m.label}
              className="flex-1 py-3 px-3"
              style={{
                borderRight:
                  i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <div className="flex flex-col leading-none gap-1.5">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 8.5,
                    letterSpacing: "0.22em",
                    color: VT.ashSoft,
                    fontWeight: 500,
                  }}
                >
                  {m.label}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: m.color,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* OPEN DOSSIER affordance — warm amber plate on hover */}
        <motion.div
          className="flex items-center gap-2 px-4 flex-shrink-0 relative overflow-hidden"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
          animate={{
            backgroundColor: hover ? amber(0.06) : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.25 }}
        >
          <motion.span
            className="font-mono uppercase whitespace-nowrap hidden lg:inline relative"
            animate={{
              color: hover ? VT.amber : VT.paperDim,
              letterSpacing: hover ? "0.22em" : "0.18em",
            }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize: 9,
              fontWeight: 500,
            }}
          >
            {hover ? "Open Dossier" : isResolved ? "Outcome" : "Open"}
          </motion.span>
          <ChevronRight
            size={12}
            strokeWidth={1.9}
            style={{
              color: hover ? VT.amber : VT.paperDim,
              transform: hover ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.2s, color 0.2s",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   CARD SUB-COMPONENTS — small, focused primitives that keep the main
   ForecastCard JSX readable. Each one is responsible for a single
   information layer of the Passport Preview.
   ══════════════════════════════════════════════════════════════════════ */

/** Direction chip — tinted bull/bear pill with arrow icon. */
function DirectionChip({
  direction,
  dirRgb,
  dirHex,
}: {
  direction: "LONG" | "SHORT"
  dirRgb: string
  dirHex: string
}) {
  const Icon = direction === "LONG" ? ArrowUpRight : ArrowDownRight
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5"
      style={{
        background: `rgba(${dirRgb},0.08)`,
        border: `1px solid rgba(${dirRgb},0.28)`,
        borderRadius: VT.chipRadius,
      }}
    >
      <Icon size={10} strokeWidth={1.9} style={{ color: dirHex }} />
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          color: dirHex,
          fontWeight: 500,
        }}
      >
        {direction}
      </span>
    </div>
  )
}

/** Status word — pulsing dot + tinted ACTIVE / EXPIRING / WON / LOST. No time. */
function StatusWord({
  statusCfg,
  isLive,
}: {
  statusCfg: { label: string; icon: typeof Timer; color: string }
  isLive: boolean
}) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <motion.span
        className="rounded-full"
        style={{
          width: 5,
          height: 5,
          background: `rgba(${statusCfg.color},0.9)`,
          boxShadow: `0 0 6px rgba(${statusCfg.color},0.6)`,
        }}
        animate={isLive ? { opacity: [0.55, 1, 0.55] } : {}}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: `rgba(${statusCfg.color},0.92)`,
          fontWeight: 500,
        }}
      >
        {statusCfg.label}
      </span>
    </div>
  )
}

/** Author avatar — small rounded tile, mentor gets amber halo. */
function AuthorAvatar({
  user,
  dirRgb,
}: {
  user: ForecastItem["user"]
  dirRgb: string
}) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 relative"
      style={{
        width: 24,
        height: 24,
        borderRadius: 7,
        background: `linear-gradient(135deg, rgba(${dirRgb},0.16), rgba(${dirRgb},0.04))`,
        border: user.isMentor
          ? `1px solid ${amber(0.5)}`
          : `1px solid rgba(255,255,255,0.08)`,
        boxShadow: user.isMentor ? `0 0 8px ${amber(0.16)}` : "none",
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: VT.paper,
          letterSpacing: "-0.01em",
        }}
      >
        {user.name.charAt(0)}
      </span>
      {user.isMentor && (
        <Crown
          size={7}
          strokeWidth={2}
          className="absolute"
          style={{
            top: -3,
            right: -3,
            color: VT.amber,
            background: VT.ink,
            borderRadius: 999,
            padding: 1,
          }}
        />
      )}
    </div>
  )
}

/** Evidence chip — confluence pill with category dot. */
function EvidenceChip({
  confluence,
}: {
  confluence: ForecastItem["confluences"][number]
}) {
  const dotRgb = categoryRgb(confluence.category)
  return (
    <span
      className="font-mono uppercase inline-flex items-center gap-1.5 px-2 py-1"
      style={{
        fontSize: 8.5,
        letterSpacing: "0.16em",
        borderRadius: VT.chipRadius,
        border: "1px solid rgba(255,255,255,0.07)",
        color: VT.ashSoft,
        fontWeight: 500,
        background: VT.glassRecess,
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: 4,
          height: 4,
          background: `rgba(${dotRgb},0.85)`,
          boxShadow: `0 0 4px rgba(${dotRgb},0.5)`,
        }}
      />
      {confluence.name}
    </span>
  )
}

/** Category color routing — matches confluence taxonomy. */
function categoryRgb(category: string): string {
  switch (category) {
    case "structure": return VT.slate
    case "liquidity": return VT.cyanRgb
    case "pattern":   return VT.purpleRgb
    case "session":   return VT.amberRgb
    case "momentum":  return VT.blueRgb
    default:          return VT.slate
  }
}

/** Mentor reviewed corner ribbon — diagonal amber wash with crown. */
function MentorRibbonCorner({ rating }: { rating: number }) {
  return (
    <div
      className="absolute top-0 right-0 z-10 pointer-events-none flex items-center gap-1 pl-2.5 pr-3 py-1"
      style={{
        background: `linear-gradient(225deg, ${amber(0.22)} 0%, ${amber(0.06)} 75%, transparent)`,
        borderBottomLeftRadius: 12,
        borderLeft: `1px solid ${amber(0.22)}`,
        borderBottom: `1px solid ${amber(0.18)}`,
      }}
    >
      <Crown size={9} strokeWidth={1.9} style={{ color: VT.amber }} />
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.22em",
          color: VT.amber,
          fontWeight: 500,
        }}
      >
        Reviewed
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize: 9,
          color: amber(0.8),
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {rating}/10
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   CARD CHART — premium minimalist candle preview
   ──────────────────────────────────────────────────────────────────────
   - Hairline grid floor
   - Soft directional gradient wash behind candles (intensifies on hover)
   - Crisp Entry / Stop / Target hairline rays inside the projection zone
   - 28 generated candles with deterministic seed for visual consistency
   ══════════════════════════════════════════════════════════════════════ */
function CardChart({
  forecast,
  dirRgb,
  hover,
}: {
  forecast: ForecastItem
  dirRgb: string
  hover: boolean
}) {
  const seed = forecast.id.charCodeAt(forecast.id.length - 1)
  const isLong = forecast.direction === "LONG"
  const candles: { x: number; o: number; c: number; h: number; l: number }[] = []
  let price = 50 + (seed % 20)
  for (let i = 0; i < 28; i++) {
    const move = (Math.sin(seed * 0.6 + i * 0.7) * 4.5) + (isLong ? 0.35 : -0.35)
    const open = price
    const close = price + move
    const high = Math.max(open, close) + Math.abs(Math.sin(i + seed) * 2.2)
    const low = Math.min(open, close) - Math.abs(Math.cos(i + seed) * 2.2)
    candles.push({ x: i * 9 + 5, o: open, c: close, h: high, l: low })
    price = close
  }
  const allP = candles.flatMap((c) => [c.h, c.l])
  const mn = Math.min(...allP) - 3
  const mx = Math.max(...allP) + 3
  const s = (v: number) => 128 - ((v - mn) / (mx - mn)) * 128

  const entryPrice = candles[20].c
  const slPrice = isLong ? entryPrice - 6 : entryPrice + 6
  const tpPrice = isLong ? entryPrice + 11 : entryPrice - 11
  const entryY = s(entryPrice)
  const slY = s(slPrice)
  const tpY = s(tpPrice)

  const tpAlpha = hover ? 0.18 : 0.11
  const slAlpha = hover ? 0.13 : 0.08

  return (
    <svg
      viewBox="0 0 260 135"
      className="w-full h-full relative"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`dir-wash-${forecast.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${dirRgb},${hover ? 0.08 : 0.04})`} />
          <stop offset="100%" stopColor={`rgba(${dirRgb},0)`} />
        </linearGradient>
        <linearGradient id={`tp-fill-${forecast.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${VT.emeraldRgb},${tpAlpha})`} />
          <stop offset="100%" stopColor={`rgba(${VT.emeraldRgb},0.02)`} />
        </linearGradient>
        <linearGradient id={`sl-fill-${forecast.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${VT.roseRgb},${slAlpha})`} />
          <stop offset="100%" stopColor={`rgba(${VT.roseRgb},0.01)`} />
        </linearGradient>
      </defs>

      {/* Directional wash behind candles */}
      <rect x="0" y="0" width="260" height="135" fill={`url(#dir-wash-${forecast.id})`} />

      {/* Hairline grid floor */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          y1={135 * f}
          x2="260"
          y2={135 * f}
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="0.4"
        />
      ))}

      {/* Projection zones */}
      <rect
        x="180"
        y={Math.min(entryY, tpY)}
        width="80"
        height={Math.abs(tpY - entryY)}
        fill={`url(#tp-fill-${forecast.id})`}
      />
      <rect
        x="180"
        y={Math.min(entryY, slY)}
        width="80"
        height={Math.abs(slY - entryY)}
        fill={`url(#sl-fill-${forecast.id})`}
      />

      {/* Hairline level rays */}
      <line
        x1="150"
        y1={entryY}
        x2="260"
        y2={entryY}
        stroke={`rgba(255,255,255,${hover ? 0.28 : 0.18})`}
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />
      <line
        x1="180"
        y1={tpY}
        x2="260"
        y2={tpY}
        stroke={`rgba(${VT.emeraldRgb},${hover ? 0.55 : 0.4})`}
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />
      <line
        x1="180"
        y1={slY}
        x2="260"
        y2={slY}
        stroke={`rgba(${VT.roseRgb},${hover ? 0.5 : 0.35})`}
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />

      {/* Candles */}
      {candles.map((c, i) => {
        const bull = c.c > c.o
        const col = bull
          ? `rgba(${VT.emeraldRgb},${hover ? 0.88 : 0.78})`
          : `rgba(${VT.roseRgb},${hover ? 0.82 : 0.72})`
        const top = s(Math.max(c.o, c.c))
        const bot = s(Math.min(c.o, c.c))
        return (
          <g key={i}>
            <line x1={c.x} y1={s(c.h)} x2={c.x} y2={s(c.l)} stroke={col} strokeWidth="0.6" />
            <rect
              x={c.x - 2.2}
              y={top}
              width="4.4"
              height={Math.max(0.8, bot - top)}
              fill={col}
              rx="0.4"
            />
          </g>
        )
      })}

      {/* Entry pivot dot */}
      <circle
        cx="150"
        cy={entryY}
        r="1.6"
        fill={`rgba(${dirRgb},0.95)`}
        opacity={hover ? 1 : 0.7}
      />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   EMPTY STATE — adopts the same Passport glass primitive as cards
   ══════════════════════════════════════════════════════════════════════ */
function EmptyFeedState({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 relative overflow-hidden"
      style={{
        borderRadius: 22,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.024) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top inset highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
        }}
      />
      {/* Soft amber corner glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 0,
          right: 0,
          width: 320,
          height: 220,
          background: `radial-gradient(circle at top right, ${amber(0.07)}, transparent 65%)`,
        }}
      />

      <div
        className="w-12 h-12 flex items-center justify-center mb-5 relative"
        style={{
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
          borderRadius: 14,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <Crosshair size={18} strokeWidth={1.4} style={{ color: VT.ashSoft }} />
      </div>

      <span
        className="font-mono uppercase mb-2"
        style={{
          fontSize: 9,
          letterSpacing: "0.28em",
          color: VT.amber,
          fontWeight: 500,
        }}
      >
        No Forecasts Found
      </span>
      <h3
        className="font-sans mb-2"
        style={{
          fontSize: 15,
          color: VT.paper,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        Atlas is quiet for this view.
      </h3>
      <p
        className="font-sans mb-6 max-w-[320px] text-center"
        style={{
          fontSize: 12,
          lineHeight: 1.55,
          color: VT.paperDim,
          letterSpacing: "0.005em",
        }}
      >
        Try adjusting scope, sub-filter, or instrument — or post the first call from this lens.
      </p>
      <button
        onClick={onSubmit}
        className="group relative px-5 py-2 cursor-pointer transition-colors duration-200 overflow-hidden"
        style={{
          background: amber(0.08),
          border: `1px solid ${amber(0.32)}`,
          borderRadius: VT.badgeRadius,
          color: VT.amber,
        }}
      >
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${amber(0.18)}, transparent)`,
          }}
        />
        <span
          className="relative font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", fontWeight: 500 }}
        >
          Submit Forecast
        </span>
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   HELPERS (UNCHANGED LOGIC)
   ════════════════════════════════════════════════════════════���═════════ */
function getStatusConfig(status: ForecastStatus) {
  switch (status) {
    case "active": return { label: "Active", icon: Timer, color: VT.blueRgb }
    case "near_expiry": return { label: "Expiring", icon: Hourglass, color: VT.amberRgb }
    case "awaiting_resolution": return { label: "Awaiting", icon: Clock, color: VT.cyanRgb }
    case "resolved_win": return { label: "Won", icon: CheckCircle2, color: VT.emeraldRgb }
    case "resolved_loss": return { label: "Lost", icon: XCircle, color: VT.roseRgb }
    case "expired": return { label: "Expired", icon: Clock, color: VT.slate }
    case "invalidated": return { label: "Void", icon: XCircle, color: VT.slate }
  }
}

function getConfidenceRgb(confidence: number) {
  if (confidence >= 75) return VT.emeraldRgb
  if (confidence >= 50) return VT.amberRgb
  return VT.roseRgb
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function getTimeUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return "expired"
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m left`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h left`
  return `${Math.floor(hours / 24)}d left`
}
