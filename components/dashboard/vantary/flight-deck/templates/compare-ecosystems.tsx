"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   <CompareEcosystemsTemplate />

   Side-by-side comparison of trading communities. Objective metrics — 
   win rates, mentor quality, activity levels, dimension alignment. 
   Make the switch decision with data, not FOMO.

   Decision enabled: "Should I switch ecosystems? Which one objectively 
   fits better?"

   Value system applied:
   1. What decision does this help them make? → Switch vs. stay decision
   2. What evidence does it show? → Win rate, avg R, signals/week, mentors, activity
   3. What action does it enable? → Choose this ecosystem, compare more, save for later
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  X,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Zap,
  Clock,
  Shield,
  BarChart3,
  Sparkles,
} from "lucide-react"

import { VANTARY, EASE_V } from "../../vantary-theme"
import {
  MOCK_COMMUNITIES,
  type Community,
} from "../communities-source"
import {
  FdCorners,
  FdDashedRule,
  FdRouteId,
  FdMagnitude,
} from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"

/* ── Public API ─────────────────────────────────────────────────────── */

export interface CompareEcosystemsTemplateProps {
  /** Pre-selected ecosystem A slug. */
  initialEcosystemASlug?: string
  /** Pre-selected ecosystem B slug. */
  initialEcosystemBSlug?: string
  /** Optional resolver note. */
  resolverNote?: string
  /** Raw NL query if relevant. */
  rawQuery?: string
  /** Close handler. */
  onClose?: () => void
  /** Pin handler. */
  onPin?: () => void
  /** Whether pinned. */
  pinned?: boolean
}

/* ── Comparison Logic ─────────────────────────────────────────────── */

interface MetricComparison {
  label: string
  aValue: number | string
  bValue: number | string
  aWins: boolean
  bWins: boolean
  unit?: string
  higher?: "better" | "neutral" | "worse"
}

function compareEcosystems(a: Community, b: Community): MetricComparison[] {
  return [
    {
      label: "Win Rate",
      aValue: a.winRate,
      bValue: b.winRate,
      aWins: a.winRate > b.winRate,
      bWins: b.winRate > a.winRate,
      unit: "%",
      higher: "better",
    },
    {
      label: "Avg R",
      aValue: a.avgR,
      bValue: b.avgR,
      aWins: a.avgR > b.avgR,
      bWins: b.avgR > a.avgR,
      unit: "R",
      higher: "better",
    },
    {
      label: "Signals/Week",
      aValue: a.signalsPerWeek,
      bValue: b.signalsPerWeek,
      aWins: a.signalsPerWeek > b.signalsPerWeek,
      bWins: b.signalsPerWeek > a.signalsPerWeek,
      unit: "",
      higher: "neutral",
    },
    {
      label: "Members",
      aValue: a.members,
      bValue: b.members,
      aWins: a.members > b.members,
      bWins: b.members > a.members,
      unit: "",
      higher: "neutral",
    },
    {
      label: "Weekly Activity",
      aValue: a.weeklyActivity,
      bValue: b.weeklyActivity,
      aWins: a.weeklyActivity > b.weeklyActivity,
      bWins: b.weeklyActivity > a.weeklyActivity,
      unit: "%",
      higher: "better",
    },
    {
      label: "Mentors",
      aValue: a.mentors.length,
      bValue: b.mentors.length,
      aWins: a.mentors.length > b.mentors.length,
      bWins: b.mentors.length > a.mentors.length,
      unit: "",
      higher: "neutral",
    },
    {
      label: "Has AI",
      aValue: a.hasArchioAi ? "Yes" : "No",
      bValue: b.hasArchioAi ? "Yes" : "No",
      aWins: a.hasArchioAi && !b.hasArchioAi,
      bWins: b.hasArchioAi && !a.hasArchioAi,
      higher: "better",
    },
    {
      label: "Verified",
      aValue: a.verified ? "Yes" : "No",
      bValue: b.verified ? "Yes" : "No",
      aWins: a.verified && !b.verified,
      bWins: b.verified && !a.verified,
      higher: "better",
    },
  ]
}

function countWins(metrics: MetricComparison[]): { a: number; b: number; ties: number } {
  let a = 0, b = 0, ties = 0
  for (const m of metrics) {
    if (m.aWins) a++
    else if (m.bWins) b++
    else ties++
  }
  return { a, b, ties }
}

/* ── Component ─────────────────────────────────────────────────────── */

export function CompareEcosystemsTemplate({
  initialEcosystemASlug,
  initialEcosystemBSlug,
  resolverNote,
  rawQuery,
  onClose,
  onPin,
  pinned = false,
}: CompareEcosystemsTemplateProps) {
  const [ecosystemASlug, setEcosystemASlug] = React.useState<string | undefined>(
    initialEcosystemASlug ?? MOCK_COMMUNITIES[0]?.slug
  )
  const [ecosystemBSlug, setEcosystemBSlug] = React.useState<string | undefined>(
    initialEcosystemBSlug
  )
  const [pickerSlot, setPickerSlot] = React.useState<"A" | "B" | null>(
    initialEcosystemBSlug ? null : "B"
  )
  const [searchQuery, setSearchQuery] = React.useState("")

  const ecosystemA = MOCK_COMMUNITIES.find((c) => c.slug === ecosystemASlug)
  const ecosystemB = MOCK_COMMUNITIES.find((c) => c.slug === ecosystemBSlug)
  const ready = !!(ecosystemA && ecosystemB)

  const metrics = React.useMemo(() => {
    if (!ecosystemA || !ecosystemB) return []
    return compareEcosystems(ecosystemA, ecosystemB)
  }, [ecosystemA, ecosystemB])

  const wins = React.useMemo(() => countWins(metrics), [metrics])

  const swap = React.useCallback(() => {
    setEcosystemASlug((a) => {
      const newA = ecosystemBSlug
      setEcosystemBSlug(a)
      return newA
    })
  }, [ecosystemBSlug])

  const filteredCommunities = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return MOCK_COMMUNITIES
    return MOCK_COMMUNITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tradingStyle.toLowerCase().includes(q) ||
        c.assetClass.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const drillers: DrillForwardSuggestion[] = React.useMemo(() => {
    if (!ready) return []
    return [
      {
        id: "drill.view-profile-a",
        routeId: "D01",
        label: `View ${ecosystemA?.name} profile`,
        hint: "Deep-dive into full community profile",
        urgency: "high",
      },
      {
        id: "drill.view-profile-b",
        routeId: "D02",
        label: `View ${ecosystemB?.name} profile`,
        hint: "Deep-dive into full community profile",
        urgency: "high",
      },
      {
        id: "drill.add-third",
        routeId: "D03",
        label: "Add a third ecosystem to compare",
        hint: "Three-way comparison for maximum clarity",
        urgency: "medium",
      },
      {
        id: "drill.fit-analysis",
        routeId: "D04",
        label: "Run fit analysis on winner",
        hint: "See how the winner matches your trading style",
        urgency: "medium",
      },
    ]
  }, [ready, ecosystemA, ecosystemB])

  return (
    <TemplateShell
      id="collective.compare-ecosystems"
      eyebrow="THE COLLECTIVE · COMPARE · LIVE"
      routeId="C-CMP"
      headline="Compare Ecosystems"
      subheadline={
        ready
          ? `${ecosystemA?.name} vs ${ecosystemB?.name}`
          : "Select two ecosystems to compare"
      }
      prelude={
        <span>
          Side-by-side objective comparison. Win rates, mentor quality, activity
          levels. Make the{" "}
          <span style={{ color: VANTARY.amber }}>switch decision</span> with data,
          not FOMO.
        </span>
      }
      inputs={
        <div className="flex flex-col gap-4">
          {/* Picker row */}
          <div className="flex items-center gap-4">
            {/* Slot A */}
            <EcosystemSlot
              label="A"
              ecosystem={ecosystemA}
              isActive={pickerSlot === "A"}
              onClick={() => setPickerSlot(pickerSlot === "A" ? null : "A")}
            />

            {/* Swap button */}
            <motion.button
              type="button"
              onClick={swap}
              disabled={!ready}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full transition-colors"
              style={{
                background: ready ? VANTARY.amberWash : "transparent",
                border: `1px solid ${ready ? VANTARY.amber : VANTARY.rule}`,
                opacity: ready ? 1 : 0.4,
              }}
            >
              <ArrowLeftRight size={16} color={ready ? VANTARY.amber : VANTARY.ash} />
            </motion.button>

            {/* Slot B */}
            <EcosystemSlot
              label="B"
              ecosystem={ecosystemB}
              isActive={pickerSlot === "B"}
              onClick={() => setPickerSlot(pickerSlot === "B" ? null : "B")}
            />
          </div>

          {/* Search + picker dropdown */}
          <AnimatePresence>
            {pickerSlot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: EASE_V }}
                className="overflow-hidden"
              >
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${VANTARY.rule}`,
                  }}
                >
                  {/* Search input */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${VANTARY.rule}`,
                    }}
                  >
                    <Search size={14} color={VANTARY.ashSoft} />
                    <input
                      type="text"
                      placeholder="Search ecosystems..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: VANTARY.paper }}
                    />
                  </div>

                  {/* Ecosystem grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto">
                    {filteredCommunities
                      .filter((c) =>
                        pickerSlot === "A"
                          ? c.slug !== ecosystemBSlug
                          : c.slug !== ecosystemASlug
                      )
                      .map((c) => (
                        <motion.button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            if (pickerSlot === "A") setEcosystemASlug(c.slug)
                            else setEcosystemBSlug(c.slug)
                            setPickerSlot(null)
                            setSearchQuery("")
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-3 rounded-lg text-left transition-colors"
                          style={{
                            background:
                              (pickerSlot === "A" && c.slug === ecosystemASlug) ||
                              (pickerSlot === "B" && c.slug === ecosystemBSlug)
                                ? VANTARY.amberWash
                                : "rgba(255,255,255,0.02)",
                            border: `1px solid ${VANTARY.rule}`,
                          }}
                        >
                          <div
                            className="text-xs font-bold truncate"
                            style={{ color: VANTARY.paper }}
                          >
                            {c.name}
                          </div>
                          <div
                            className="text-[10px] mt-1 flex items-center gap-2"
                            style={{ color: VANTARY.ash }}
                          >
                            <span>{c.winRate}% win</span>
                            <span>{c.avgR}R avg</span>
                          </div>
                        </motion.button>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      resolver={
        ready ? (
          <div
            className="flex items-center gap-4 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${VANTARY.rule}`,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: wins.a > wins.b ? VANTARY.amberWash : "rgba(255,255,255,0.05)",
                  color: wins.a > wins.b ? VANTARY.amber : VANTARY.ash,
                  border: `1px solid ${wins.a > wins.b ? VANTARY.amber : VANTARY.rule}`,
                }}
              >
                A
              </div>
              <span
                className="text-sm font-mono"
                style={{ color: wins.a > wins.b ? VANTARY.amber : VANTARY.paper }}
              >
                {wins.a} wins
              </span>
            </div>
            <span style={{ color: VANTARY.ashSoft }}>vs</span>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-mono"
                style={{ color: wins.b > wins.a ? VANTARY.amber : VANTARY.paper }}
              >
                {wins.b} wins
              </span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: wins.b > wins.a ? VANTARY.amberWash : "rgba(255,255,255,0.05)",
                  color: wins.b > wins.a ? VANTARY.amber : VANTARY.ash,
                  border: `1px solid ${wins.b > wins.a ? VANTARY.amber : VANTARY.rule}`,
                }}
              >
                B
              </div>
            </div>
            {wins.ties > 0 && (
              <span className="text-xs" style={{ color: VANTARY.ashSoft }}>
                ({wins.ties} tied)
              </span>
            )}
          </div>
        ) : null
      }
      renderPlan={
        ready ? (
          <div className="flex flex-col gap-6">
            {/* Metrics comparison grid */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.01)",
                border: `1px solid ${VANTARY.rule}`,
              }}
            >
              {/* Header */}
              <div
                className="grid grid-cols-3 gap-4 px-4 py-3"
                style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
              >
                <div className="text-xs font-mono uppercase tracking-wide" style={{ color: VANTARY.ashSoft }}>
                  Metric
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold" style={{ color: VANTARY.amber }}>
                    A
                  </span>
                  <span className="text-xs ml-2" style={{ color: VANTARY.paper }}>
                    {ecosystemA?.name}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold" style={{ color: VANTARY.amber }}>
                    B
                  </span>
                  <span className="text-xs ml-2" style={{ color: VANTARY.paper }}>
                    {ecosystemB?.name}
                  </span>
                </div>
              </div>

              {/* Rows */}
              {metrics.map((m, idx) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, ease: EASE_V }}
                  className="grid grid-cols-3 gap-4 px-4 py-3"
                  style={{
                    borderBottom: idx < metrics.length - 1 ? `1px solid ${VANTARY.rule}` : "none",
                    background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  }}
                >
                  <div className="text-sm" style={{ color: VANTARY.ash }}>
                    {m.label}
                  </div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: m.aWins ? VANTARY.amber : VANTARY.paper }}
                    >
                      {m.aValue}
                      {m.unit}
                    </span>
                    {m.aWins && (
                      <TrendingUp size={12} color={VANTARY.amber} />
                    )}
                  </div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: m.bWins ? VANTARY.amber : VANTARY.paper }}
                    >
                      {m.bValue}
                      {m.unit}
                    </span>
                    {m.bWins && (
                      <TrendingUp size={12} color={VANTARY.amber} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Verdict card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease: EASE_V }}
              className="p-5 rounded-xl"
              style={{
                background: VANTARY.amberWash,
                border: `1px solid ${VANTARY.amber}`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: VANTARY.amber,
                  }}
                >
                  <Sparkles size={18} color={VANTARY.ink} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold mb-1" style={{ color: VANTARY.amber }}>
                    {wins.a > wins.b
                      ? `${ecosystemA?.name} leads on ${wins.a} metrics`
                      : wins.b > wins.a
                      ? `${ecosystemB?.name} leads on ${wins.b} metrics`
                      : "Both ecosystems are evenly matched"}
                  </div>
                  <div className="text-xs" style={{ color: VANTARY.paper }}>
                    {wins.a > wins.b
                      ? `${ecosystemA?.name} shows stronger performance across key indicators. Consider their ${ecosystemA?.tradingStyle} approach if it matches your style.`
                      : wins.b > wins.a
                      ? `${ecosystemB?.name} demonstrates better metrics overall. Their ${ecosystemB?.tradingStyle} methodology may suit your trading.`
                      : "Both communities offer comparable value. Your decision should be based on trading style fit and community culture."}
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-bold"
                  style={{
                    background: VANTARY.amber,
                    color: VANTARY.ink,
                  }}
                >
                  Choose {wins.a >= wins.b ? ecosystemA?.name : ecosystemB?.name}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{
                    background: "transparent",
                    border: `1px solid ${VANTARY.amber}`,
                    color: VANTARY.amber,
                  }}
                >
                  Run Fit Analysis
                </motion.button>
              </div>
            </motion.div>

            {/* Asset distribution comparison */}
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.01)",
                border: `1px solid ${VANTARY.rule}`,
              }}
            >
              <div
                className="text-xs font-mono uppercase tracking-wide mb-4"
                style={{ color: VANTARY.ashSoft }}
              >
                Asset Distribution Comparison
              </div>
              <div className="grid grid-cols-2 gap-6">
                <AssetBars ecosystem={ecosystemA!} label="A" />
                <AssetBars ecosystem={ecosystemB!} label="B" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-16"
            style={{ color: VANTARY.ashSoft }}
          >
            <PlusCircle size={32} className="mb-4 opacity-40" />
            <div className="text-sm">
              Select two ecosystems above to compare
            </div>
          </div>
        )
      }
      drillForward={drillers}
      onClose={onClose}
      onPin={onPin}
      state="ready"
    />
  )
}

/* ── Subcomponents ─────────────────────────────────────────────────── */

function EcosystemSlot({
  label,
  ecosystem,
  isActive,
  onClick,
}: {
  label: string
  ecosystem?: Community
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 p-4 rounded-xl text-left transition-all"
      style={{
        background: isActive ? VANTARY.amberWash : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? VANTARY.amber : VANTARY.rule}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: ecosystem ? VANTARY.amberWash : "rgba(255,255,255,0.05)",
            border: `1px solid ${ecosystem ? VANTARY.amber : VANTARY.rule}`,
          }}
        >
          <span
            className="text-xs font-bold"
            style={{ color: ecosystem ? VANTARY.amber : VANTARY.ash }}
          >
            {label}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {ecosystem ? (
            <>
              <div
                className="text-sm font-bold truncate"
                style={{ color: VANTARY.paper }}
              >
                {ecosystem.name}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px]" style={{ color: VANTARY.ash }}>
                  {ecosystem.winRate}% win
                </span>
                <span className="text-[10px]" style={{ color: VANTARY.ash }}>
                  {ecosystem.avgR}R
                </span>
                <span className="text-[10px]" style={{ color: VANTARY.ash }}>
                  {ecosystem.members} members
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm" style={{ color: VANTARY.ashSoft }}>
              Click to select ecosystem
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

function AssetBars({ ecosystem, label }: { ecosystem: Community; label: string }) {
  const maxShare = Math.max(...ecosystem.assetShares.map((a) => a.share), 1)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{
            background: VANTARY.amberWash,
            color: VANTARY.amber,
            border: `1px solid ${VANTARY.amber}`,
          }}
        >
          {label}
        </div>
        <span className="text-xs font-bold" style={{ color: VANTARY.paper }}>
          {ecosystem.name}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {ecosystem.assetShares.map((a) => (
          <div key={a.symbol} className="flex items-center gap-2">
            <span
              className="w-12 text-[10px] font-mono"
              style={{ color: VANTARY.ash }}
            >
              {a.symbol}
            </span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: VANTARY.rule }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(a.share / maxShare) * 100}%` }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE_V }}
                className="h-full rounded-full"
                style={{ background: VANTARY.amber }}
              />
            </div>
            <span
              className="w-8 text-right text-[10px] font-mono"
              style={{ color: VANTARY.paper }}
            >
              {a.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompareEcosystemsTemplate
