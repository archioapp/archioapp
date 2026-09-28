"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Minus,
  Shield,
  Target,
  Flame,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Info,
  Lock,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import type { LeaderboardEntry } from "./forecast-types"
import { VT, amber, slate } from "./forecast-vantary-tokens"

const LEADERBOARD_PERIODS = ["This Week", "This Month", "All Time"] as const
const LEADERBOARD_SCOPES = ["Global", "My Communities", "Mentors Only"] as const

export function ForecastLeaderboard() {
  const [period, setPeriod] = useState<(typeof LEADERBOARD_PERIODS)[number]>("This Month")
  const [scope, setScope] = useState<(typeof LEADERBOARD_SCOPES)[number]>("Global")
  const [showMethodology, setShowMethodology] = useState(false)

  const entries: LeaderboardEntry[] = []

  return (
    <div className="space-y-5">
      {/* ─── Briefing bar header ─── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
            <circle cx="3" cy="3" r="2.4" fill="none" stroke={amber(0.5)} strokeWidth="0.7" />
          </svg>
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${amber(0.32)}, transparent)` }} />
          <div className="flex items-center gap-2">
            <Trophy size={12} strokeWidth={1.7} style={{ color: VT.amber }} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: VT.amber, fontWeight: 500 }}
            >
              Leaderboard
            </span>
          </div>
          <div className="h-px w-12" style={{ background: VT.rule }} />
          <span
            className="font-sans italic"
            style={{ fontSize: 11, color: VT.paperDim, letterSpacing: "0.005em" }}
          >
            Ranked by verified outcomes — minimum 5 resolved forecasts to qualify.
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Scope filter */}
          <SegmentedTabs
            label="Scope"
            options={LEADERBOARD_SCOPES.map((s) => ({ id: s, label: s }))}
            active={scope}
            onChange={(v) => setScope(v as typeof scope)}
          />
          <div className="h-4 w-px" style={{ background: VT.rule }} />
          {/* Period filter */}
          <SegmentedTabs
            label="Period"
            options={LEADERBOARD_PERIODS.map((p) => ({ id: p, label: p }))}
            active={period}
            onChange={(v) => setPeriod(v as typeof period)}
          />
          <div className="h-4 w-px" style={{ background: VT.rule }} />
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="flex items-center gap-1.5 px-2.5 h-7 cursor-pointer transition-colors duration-150"
            style={{
              background: showMethodology ? amber(0.06) : "transparent",
              border: `1px solid ${showMethodology ? amber(0.22) : VT.ruleSoft}`,
              borderRadius: VT.chipRadius,
              color: showMethodology ? VT.amber : VT.ash,
            }}
          >
            <Info size={11} strokeWidth={1.7} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.18em", fontWeight: 500 }}
            >
              How it works
            </span>
          </button>
        </div>
      </div>

      {/* Methodology panel */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: VT.ease }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: VT.glass,
                backdropFilter: VT.blur,
                WebkitBackdropFilter: VT.blur,
                borderRadius: VT.cardRadius,
                border: `1px solid ${VT.rule}`,
                boxShadow: VT.cardShadow,
              }}
            >
              <div className="px-6 py-5">
                <div className="flex items-baseline gap-3 mb-5">
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VT.amber, fontWeight: 500 }}
                  >
                    Methodology
                  </span>
                  <div className="w-12 h-px" style={{ background: VT.rule }} />
                  <h4
                    className="font-sans"
                    style={{ fontSize: 14, fontWeight: 500, color: VT.paper, letterSpacing: "-0.01em" }}
                  >
                    Ranking System
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { icon: CheckCircle2, title: "Outcome-based", desc: "Only resolved forecasts count. Active predictions have zero ranking weight.", rgb: VT.emeraldRgb },
                    { icon: Lock, title: "Minimum sample", desc: "You need at least 5 resolved forecasts to appear. This prevents lucky-streak gaming.", rgb: VT.amberRgb },
                    { icon: BarChart3, title: "Composite score", desc: "Win rate, risk-reward quality, and consistency all factor into your ranking score.", rgb: VT.blueRgb },
                    { icon: Shield, title: "Role transparency", desc: "Mentor and student badges are shown but do not affect ranking calculations.", rgb: VT.purpleRgb },
                    { icon: AlertTriangle, title: "Anti-gaming", desc: "Submitting many low-conviction forecasts dilutes your accuracy. Quality over volume.", rgb: VT.roseRgb },
                    { icon: Users, title: "Community scoping", desc: "Filter by community to see rankings within your learning group.", rgb: VT.cyanRgb },
                  ].map((rule, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 pb-4"
                      style={{ borderBottom: i < 4 ? `1px dashed ${VT.ruleSoft}` : "none" }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 22, height: 22,
                          background: `rgba(${rule.rgb},0.06)`,
                          border: `1px solid rgba(${rule.rgb},0.18)`,
                          borderRadius: VT.chipRadius,
                        }}
                      >
                        <rule.icon size={10} strokeWidth={1.6} style={{ color: `rgba(${rule.rgb},0.85)` }} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className="font-sans block mb-1"
                          style={{ fontSize: 12, fontWeight: 500, color: VT.paper, letterSpacing: "-0.005em" }}
                        >
                          {rule.title}
                        </span>
                        <p
                          className="font-sans"
                          style={{ fontSize: 11, color: VT.paperDim, lineHeight: 1.55, letterSpacing: "0.005em" }}
                        >
                          {rule.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 ? (
        <LeaderboardTable entries={entries} />
      ) : (
        <EmptyLeaderboard />
      )}
    </div>
  )
}

/* ── Reusable segmented tabs (mono caps with hairline rules) ── */
function SegmentedTabs({
  label, options, active, onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
      >
        {label}
      </span>
      <div className="flex items-center gap-0.5">
        {options.map((o, i, arr) => {
          const isActive = active === o.id
          return (
            <div key={o.id} className="flex items-center">
              <button
                onClick={() => onChange(o.id)}
                className="px-2.5 py-1 cursor-pointer transition-colors duration-150"
                style={{
                  borderRadius: VT.chipRadius,
                  background: isActive ? amber(0.06) : "transparent",
                  border: `1px solid ${isActive ? amber(0.22) : "transparent"}`,
                  color: isActive ? VT.amber : VT.ash,
                  fontSize: 10,
                  letterSpacing: "0.04em",
                  fontFamily: "var(--font-mono, ui-monospace)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {o.label}
              </button>
              {i < arr.length - 1 && <div className="w-1 h-px mx-0.5" style={{ background: VT.rule }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Table when data exists ── */
function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: VT.glass,
        backdropFilter: VT.blur,
        WebkitBackdropFilter: VT.blur,
        borderRadius: VT.cardRadius,
        border: `1px solid ${VT.rule}`,
        boxShadow: VT.cardShadow,
      }}
    >
      <div
        className="grid px-6 py-3.5"
        style={{
          gridTemplateColumns: "48px 1fr 100px 90px 90px 90px 60px",
          borderBottom: `1px solid ${VT.rule}`,
        }}
      >
        {["Rank", "Forecaster", "Resolved", "Win Rate", "Avg R:R", "Streak", "Trend"].map((h) => (
          <span
            key={h}
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
          >
            {h}
          </span>
        ))}
      </div>

      {entries.map((entry, i) => (
        <LeaderboardRow key={entry.user.id} entry={entry} index={i} />
      ))}
    </div>
  )
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const [hover, setHover] = useState(false)
  const isPodium = entry.rank <= 3

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid items-center px-6 py-3.5 cursor-pointer transition-colors duration-200"
      style={{
        gridTemplateColumns: "48px 1fr 100px 90px 90px 90px 60px",
        background: hover ? "rgba(255,255,255,0.018)" : "transparent",
        borderBottom: `1px dashed ${VT.ruleSoft}`,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: isPodium ? VT.amber : VT.paperDim,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        #{entry.rank}
      </span>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-full"
          style={{
            width: 28, height: 28,
            background: amber(0.06),
            border: entry.user.isMentor ? `1px solid ${amber(0.4)}` : `1px solid ${VT.rule}`,
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: 11, fontWeight: 600, color: VT.amber }}
          >
            {entry.user.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col leading-none gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className="font-sans"
              style={{ fontSize: 12, fontWeight: 500, color: VT.paper, letterSpacing: "-0.005em" }}
            >
              {entry.user.name}
            </span>
            {entry.user.isMentor && <Shield size={9} strokeWidth={1.6} style={{ color: VT.amber, opacity: 0.7 }} />}
          </div>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
          >
            {entry.user.tier}{!entry.isQualified && " · Not yet qualified"}
          </span>
        </div>
      </div>

      <span
        className="font-mono"
        style={{ fontSize: 12, color: VT.paperDim, fontVariantNumeric: "tabular-nums" }}
      >
        {entry.resolvedForecasts}/{entry.totalForecasts}
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: VT.emerald,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {entry.winRate}%
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: VT.blue,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {entry.avgRiskReward}
      </span>

      <div className="flex items-center gap-1.5">
        <Flame size={10} strokeWidth={1.6} style={{ color: entry.currentStreak >= 5 ? VT.amber : VT.ashSoft }} />
        <span
          className="font-mono"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: VT.paper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {entry.currentStreak}
        </span>
      </div>

      {entry.trend === "up" && <ChevronUp size={14} strokeWidth={1.6} style={{ color: VT.emerald }} />}
      {entry.trend === "down" && <ChevronDown size={14} strokeWidth={1.6} style={{ color: VT.rose }} />}
      {entry.trend === "stable" && <Minus size={14} strokeWidth={1.6} style={{ color: VT.ashSoft }} />}
    </motion.div>
  )
}

/* ── Empty leaderboard ── */
function EmptyLeaderboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: VT.ease }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: VT.glass,
          backdropFilter: VT.blur,
          WebkitBackdropFilter: VT.blur,
          borderRadius: VT.cardRadius,
          border: `1px solid ${VT.rule}`,
          boxShadow: VT.cardShadow,
        }}
      >
        {/* Skeleton table header */}
        <div
          className="grid px-6 py-3.5"
          style={{
            gridTemplateColumns: "48px 1fr 100px 90px 90px 90px 60px",
            borderBottom: `1px solid ${VT.rule}`,
          }}
        >
          {["Rank", "Forecaster", "Resolved", "Win Rate", "Avg R:R", "Streak", "Trend"].map((h) => (
            <span
              key={h}
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashWhisper, fontWeight: 500 }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Skeleton rows */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="grid items-center px-6 py-4"
            style={{
              gridTemplateColumns: "48px 1fr 100px 90px 90px 90px 60px",
              borderBottom: `1px dashed ${VT.ruleSoft}`,
              opacity: 1 - i * 0.16,
            }}
          >
            <div className="w-5 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
              <div className="w-24 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
            <div className="w-10 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
            <div className="w-10 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
            <div className="w-10 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
            <div className="w-6 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
            <div className="w-4 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
          </div>
        ))}

        {/* Empty message */}
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div
            className="w-14 h-14 flex items-center justify-center mb-5"
            style={{
              background: amber(0.06),
              border: `1px solid ${amber(0.22)}`,
              borderRadius: 18,
            }}
          >
            <Trophy size={20} strokeWidth={1.4} style={{ color: VT.amber, opacity: 0.7 }} />
          </div>
          <h3
            className="font-sans mb-2 text-center"
            style={{ fontSize: 16, color: VT.paper, fontWeight: 500, letterSpacing: "-0.01em" }}
          >
            Rankings require verified outcomes
          </h3>
          <p
            className="font-sans text-center max-w-md mb-5"
            style={{ fontSize: 12, color: VT.paperDim, lineHeight: 1.6, letterSpacing: "0.005em" }}
          >
            The leaderboard populates once forecasters have at least 5 resolved predictions. Rankings are computed from verified market outcomes, ensuring credibility over vanity.
          </p>

          <div className="flex items-center gap-5 pt-5" style={{ borderTop: `1px dashed ${VT.ruleSoft}`, width: "100%", justifyContent: "center" }}>
            {[
              { label: "Outcome-verified", icon: CheckCircle2 },
              { label: "Min. 5 resolved", icon: Lock },
              { label: "Anti-gaming logic", icon: Shield },
              { label: "Quality over volume", icon: Target },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <f.icon size={10} strokeWidth={1.5} style={{ color: VT.amber, opacity: 0.55 }} />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashSoft, fontWeight: 500 }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
