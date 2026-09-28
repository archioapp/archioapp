"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Crosshair,
  BarChart3,
  Trophy,
  Calendar,
  Plus,
  Search,
} from "lucide-react"
import { ForecastFeed } from "./forecast-feed"
import { ForecastMyRecord } from "./forecast-my-record"
import { ForecastLeaderboard } from "./forecast-leaderboard"
import { ForecastArchive } from "./forecast-archive"
import { ForecastSubmitDrawer } from "./forecast-submit-drawer"
import type { ForecastView, ForecastItem } from "./forecast-types"
import { VT, amber, slate } from "./forecast-vantary-tokens"

/* ── constants (UNCHANGED) ── */
const VIEWS: { id: ForecastView; label: string; icon: typeof Crosshair }[] = [
  { id: "feed", label: "Feed", icon: Crosshair },
  { id: "record", label: "My Record", icon: BarChart3 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "archive", label: "Calendar", icon: Calendar },
]

interface ForecastHubProps {
  /** When true, removes min-h-screen and adapts for embedding in flight deck rooms */
  embedded?: boolean
}

export function ForecastHub({ embedded = false }: ForecastHubProps) {
  const [activeView, setActiveView] = useState<ForecastView>("feed")
  const [showSubmit, setShowSubmit] = useState(false)
  const [selectedForecast, setSelectedForecast] = useState<ForecastItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleViewForecast = useCallback((forecast: ForecastItem) => {
    setSelectedForecast(forecast)
  }, [])
  const handleCloseDetail = useCallback(() => {
    setSelectedForecast(null)
  }, [])

  return (
    <div
      className={embedded ? "h-full flex flex-col" : "min-h-screen"}
      style={{ background: VT.ink }}
    >
      {/* ════════════════════════════════════════════════════════════════
          TOOLBAR — editorial briefing bar
          ════════════════════════════════════════════════════════════════ */}
      <header
        className={`${embedded ? "" : "sticky top-0"} z-30 flex-shrink-0 relative`}
        style={{
          background: VT.glassStrong,
          backdropFilter: VT.blurStrong,
          WebkitBackdropFilter: VT.blurStrong,
          borderBottom: `1px solid ${VT.rule}`,
        }}
      >
        {/* Top hairline shimmer (single pass on mount) */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${amber(0.18)} 50%, transparent 95%)`,
          }}
        />

        <div className="max-w-[1440px] mx-auto px-6">
          {/* Primary row */}
          <div className="flex items-center h-14 gap-4">
            {/* ─── Title / signature ─── */}
            <div className="flex items-center gap-3 mr-2 flex-shrink-0">
              <div className="relative" style={{ width: 28, height: 28 }}>
                {/* anchor circle */}
                <svg width="28" height="28" viewBox="0 0 28 28" className="absolute inset-0">
                  <circle
                    cx="14"
                    cy="14"
                    r="13"
                    fill="none"
                    stroke={amber(0.22)}
                    strokeWidth="0.6"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="9"
                    fill="none"
                    stroke={amber(0.12)}
                    strokeWidth="0.4"
                    strokeDasharray="2 4"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 14 14"
                      to="360 14 14"
                      dur="40s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crosshair size={11} style={{ color: VT.amber }} strokeWidth={1.6} />
                </div>
              </div>
              <div className="flex flex-col leading-none gap-1">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    color: VT.amber,
                    fontWeight: 500,
                  }}
                >
                  Forecast
                </span>
                <span
                  className="font-sans"
                  style={{
                    fontSize: 14,
                    color: VT.paper,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Forecasts
                </span>
              </div>
            </div>

            {/* Vertical hairline separator */}
            <div className="w-px h-6 flex-shrink-0" style={{ background: VT.rule }} />

            {/* ─── Tabs ─── */}
            <nav className="flex items-center gap-1 mr-auto">
              {VIEWS.map((v) => {
                const active = activeView === v.id
                const Icon = v.icon
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className="relative flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors duration-200"
                    style={{
                      color: active ? VT.paper : VT.ash,
                    }}
                  >
                    <Icon size={12} style={{ opacity: active ? 0.95 : 0.55 }} strokeWidth={1.7} />
                    <span
                      className="font-sans"
                      style={{
                        fontSize: 12,
                        fontWeight: active ? 500 : 400,
                        letterSpacing: "0.005em",
                      }}
                    >
                      {v.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="forecast-tab-underline"
                        className="absolute -bottom-px left-0 right-0 h-px"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${amber(0.55)}, transparent)`,
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* ─── Search ─── */}
            <div
              className="hidden md:flex items-center gap-2 px-3 h-8 flex-shrink-0"
              style={{
                background: VT.glassRecess,
                border: `1px solid ${VT.ruleSoft}`,
                borderRadius: VT.badgeRadius,
                boxShadow: VT.recessShadow,
              }}
            >
              <Search size={11} style={{ color: VT.ashSoft }} strokeWidth={1.7} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pairs, analysts…"
                className="bg-transparent outline-none w-[160px] font-sans"
                style={{
                  fontSize: 11,
                  color: VT.paper,
                  letterSpacing: "0.005em",
                }}
              />
            </div>

            {/* ─── CTA — outlined editorial button ─── */}
            <button
              onClick={() => setShowSubmit(true)}
              className="group relative flex items-center gap-1.5 px-4 h-8 cursor-pointer flex-shrink-0 transition-all duration-200 overflow-hidden"
              style={{
                background: amber(0.08),
                border: `1px solid ${amber(0.32)}`,
                borderRadius: VT.badgeRadius,
                color: VT.amber,
              }}
            >
              {/* shine sweep on hover */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${amber(0.18)}, transparent)`,
                }}
              />
              <Plus size={11} strokeWidth={2} />
              <span
                className="font-mono uppercase relative"
                style={{ fontSize: 10, letterSpacing: "0.18em", fontWeight: 500 }}
              >
                Submit
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          CONTENT
          ════════════════════════════════════════════════════════════════ */}
      <main className={`px-6 pt-5 ${embedded ? "flex-1 overflow-auto pb-5" : "pb-20"}`}>
        <div className="max-w-[1440px] mx-auto">
          <AnimatePresence mode="wait">
            {activeView === "feed" && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: VT.ease }}
              >
                <ForecastFeed
                  searchQuery={searchQuery}
                  instrumentFilter="All"
                  statusFilter="All Status"
                  onViewForecast={handleViewForecast}
                  onSubmit={() => setShowSubmit(true)}
                  selectedForecast={selectedForecast}
                  onCloseDetail={handleCloseDetail}
                />
              </motion.div>
            )}
            {activeView === "record" && (
              <motion.div
                key="record"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: VT.ease }}
              >
                <ForecastMyRecord onViewForecast={handleViewForecast} />
              </motion.div>
            )}
            {activeView === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: VT.ease }}
              >
                <ForecastLeaderboard />
              </motion.div>
            )}
            {activeView === "archive" && (
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: VT.ease }}
              >
                <ForecastArchive onViewForecast={handleViewForecast} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile FAB — hidden in embedded mode */}
      {!embedded && (
        <button
          onClick={() => setShowSubmit(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-12 h-12 md:hidden cursor-pointer"
          style={{
            background: amber(0.12),
            borderRadius: 14,
            border: `1px solid ${amber(0.4)}`,
            boxShadow: `0 8px 24px ${amber(0.28)}`,
            color: VT.amber,
          }}
        >
          <Plus size={20} strokeWidth={1.8} />
        </button>
      )}

      <ForecastSubmitDrawer isOpen={showSubmit} onClose={() => setShowSubmit(false)} />
    </div>
  )
}
