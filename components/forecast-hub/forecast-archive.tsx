"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  History,
  Target,
} from "lucide-react"
import type { ForecastItem } from "./forecast-types"
import { VT, amber, slate } from "./forecast-vantary-tokens"

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface ForecastArchiveProps {
  onViewForecast: (forecast: ForecastItem) => void
}

export function ForecastArchive({ onViewForecast }: ForecastArchiveProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [archiveSearch, setArchiveSearch] = useState("")
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "wins" | "losses" | "expired">("all")

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7

  const goToPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
  }
  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
  }

  return (
    <div className="space-y-5">
      {/* ─── Briefing bar ─── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
            <circle cx="3" cy="3" r="2.4" fill="none" stroke={amber(0.5)} strokeWidth="0.7" />
          </svg>
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${amber(0.32)}, transparent)` }} />
          <div className="flex items-center gap-2">
            <History size={12} strokeWidth={1.7} style={{ color: VT.amber }} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: VT.amber, fontWeight: 500 }}
            >
              Archive
            </span>
          </div>
          <div className="h-px w-12" style={{ background: VT.rule }} />
          <span
            className="font-sans italic"
            style={{ fontSize: 11, color: VT.paperDim, letterSpacing: "0.005em" }}
          >
            Complete forecast history — search, filter, and review past predictions.
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 h-7"
            style={{
              background: VT.glassRecess,
              border: `1px solid ${VT.ruleSoft}`,
              borderRadius: VT.chipRadius,
              boxShadow: VT.recessShadow,
            }}
          >
            <Search size={11} strokeWidth={1.7} style={{ color: VT.ashSoft }} />
            <input
              type="text"
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              placeholder="Search history…"
              className="bg-transparent outline-none w-[120px] font-sans"
              style={{ fontSize: 11, color: VT.paper, letterSpacing: "0.005em" }}
            />
          </div>

          <div className="h-4 w-px" style={{ background: VT.rule }} />

          {/* Outcome filter */}
          <div className="flex items-center gap-0.5">
            {(["all", "wins", "losses", "expired"] as const).map((f, i, arr) => {
              const cfgMap: Record<string, { label: string; hex: string; rgb: string }> = {
                all: { label: "All", hex: VT.ash, rgb: VT.slate },
                wins: { label: "Wins", hex: VT.emerald, rgb: VT.emeraldRgb },
                losses: { label: "Losses", hex: VT.rose, rgb: VT.roseRgb },
                expired: { label: "Expired", hex: VT.paperDim, rgb: VT.slate },
              }
              const cfg = cfgMap[f]
              const isActive = outcomeFilter === f
              return (
                <div key={f} className="flex items-center">
                  <button
                    onClick={() => setOutcomeFilter(f)}
                    className="px-2.5 py-1 cursor-pointer transition-colors duration-150"
                    style={{
                      borderRadius: VT.chipRadius,
                      background: isActive ? `rgba(${cfg.rgb},0.06)` : "transparent",
                      border: `1px solid ${isActive ? `rgba(${cfg.rgb},0.22)` : "transparent"}`,
                      color: isActive ? cfg.hex : VT.ash,
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      fontFamily: "var(--font-mono, ui-monospace)",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {cfg.label}
                  </button>
                  {i < arr.length - 1 && <div className="w-1 h-px mx-0.5" style={{ background: VT.rule }} />}
                </div>
              )
            })}
          </div>

          <div className="h-4 w-px" style={{ background: VT.rule }} />

          {/* View mode toggle */}
          <div className="flex items-center gap-0.5">
            {([
              { id: "calendar" as const, icon: LayoutGrid, label: "Calendar" },
              { id: "timeline" as const, icon: List, label: "Timeline" },
            ]).map(({ id, icon: Icon }) => {
              const isActive = viewMode === id
              return (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className="flex items-center justify-center cursor-pointer transition-colors duration-150"
                  style={{
                    width: 26, height: 26,
                    background: isActive ? amber(0.06) : "transparent",
                    border: `1px solid ${isActive ? amber(0.22) : "transparent"}`,
                    borderRadius: VT.chipRadius,
                    color: isActive ? VT.amber : VT.ash,
                  }}
                >
                  <Icon size={12} strokeWidth={1.7} />
                </button>
              )
            })}
          </div>

          <div className="h-4 w-px" style={{ background: VT.rule }} />

          {/* Month navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrevMonth}
              className="cursor-pointer flex items-center justify-center transition-colors duration-150"
              style={{
                width: 22, height: 22,
                borderRadius: VT.chipRadius,
                color: VT.ash,
                border: `1px solid ${VT.ruleSoft}`,
              }}
            >
              <ChevronLeft size={12} strokeWidth={1.7} />
            </button>
            <span
              className="font-mono uppercase text-center"
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                color: VT.paper,
                fontWeight: 500,
                minWidth: 100,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {MONTHS_SHORT[currentMonth]} {currentYear}
            </span>
            <button
              onClick={goToNextMonth}
              className="cursor-pointer flex items-center justify-center transition-colors duration-150"
              style={{
                width: 22, height: 22,
                borderRadius: VT.chipRadius,
                color: VT.ash,
                border: `1px solid ${VT.ruleSoft}`,
              }}
            >
              <ChevronRight size={12} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <CalendarView
          daysInMonth={daysInMonth}
          firstDayOfWeek={firstDayOfWeek}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      ) : (
        <TimelineView />
      )}
    </div>
  )
}

/* ── Calendar grid ── */
function CalendarView({
  daysInMonth, firstDayOfWeek, currentMonth, currentYear,
}: {
  daysInMonth: number; firstDayOfWeek: number; currentMonth: number; currentYear: number
}) {
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: VT.ease }}
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
      {/* Day headers */}
      <div
        className="grid grid-cols-7"
        style={{ borderBottom: `1px solid ${VT.rule}`, background: VT.glassRecess }}
      >
        {DAYS.map((day, i) => (
          <div
            key={day}
            className="flex items-center justify-center py-3"
            style={{
              borderRight: i < DAYS.length - 1 ? `1px solid ${VT.ruleSoft}` : "none",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayOfWeek }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[88px]"
            style={{
              borderRight: (i + 1) % 7 !== 0 ? `1px dashed ${VT.ruleSoft}` : "none",
              borderBottom: `1px dashed ${VT.ruleSoft}`,
              background: "rgba(0,0,0,0.18)",
            }}
          />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isToday = isCurrentMonth && day === today.getDate()
          const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const cellIdx = firstDayOfWeek + i
          const isLastCol = (cellIdx + 1) % 7 === 0

          return (
            <div
              key={day}
              className="min-h-[88px] p-2.5 cursor-pointer transition-colors duration-150 hover:bg-white/[0.018] group relative"
              style={{
                borderRight: !isLastCol ? `1px dashed ${VT.ruleSoft}` : "none",
                borderBottom: `1px dashed ${VT.ruleSoft}`,
                background: isToday ? amber(0.04) : "transparent",
              }}
            >
              {/* today accent — left hairline */}
              {isToday && (
                <div
                  className="absolute left-0 top-2 bottom-2 w-px"
                  style={{ background: VT.amber }}
                />
              )}
              <div className="flex items-center justify-between">
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: isToday ? VT.amber : isPast ? VT.ashSoft : VT.paperDim,
                    fontWeight: isToday ? 600 : 400,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {day}
                </span>
                {isToday && (
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 8, letterSpacing: "0.22em", color: VT.amber, fontWeight: 500 }}
                  >
                    Today
                  </span>
                )}
              </div>
              {/* placeholder dots row */}
              <div className="mt-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* future: outcome dots will appear */}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend + month summary */}
      <div
        className="flex items-center justify-between px-6 py-3.5"
        style={{ borderTop: `1px solid ${VT.rule}`, background: VT.glassRecess }}
      >
        <div className="flex items-center gap-5">
          {[
            { label: "Won", hex: VT.emerald, rgb: VT.emeraldRgb },
            { label: "Lost", hex: VT.rose, rgb: VT.roseRgb },
            { label: "Active", hex: VT.blue, rgb: VT.blueRgb },
            { label: "Expired", hex: VT.paperDim, rgb: VT.slate },
          ].map(({ label, hex, rgb }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="rounded-full"
                style={{ width: 6, height: 6, background: `rgba(${rgb},0.7)` }}
              />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashSoft, fontWeight: 500 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <span
          className="font-sans italic"
          style={{ fontSize: 10.5, color: VT.ashSoft, letterSpacing: "0.005em" }}
        >
          No forecast data for {MONTHS_SHORT[currentMonth]} {currentYear}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Timeline view ── */
function TimelineView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: VT.ease }}
    >
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center py-20 px-8"
        style={{
          background: VT.glass,
          backdropFilter: VT.blur,
          WebkitBackdropFilter: VT.blur,
          borderRadius: VT.cardRadius,
          border: `1px solid ${VT.rule}`,
          boxShadow: VT.cardShadow,
        }}
      >
        {/* Editorial timeline visual */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3">
            {[
              { hex: VT.emerald, rgb: VT.emeraldRgb },
              { hex: VT.rose, rgb: VT.roseRgb },
              { hex: VT.blue, rgb: VT.blueRgb },
              { hex: VT.paperDim, rgb: VT.slate },
            ].map((color, i, arr) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.32, ease: VT.ease }}
                className="flex items-center"
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 10, height: 10,
                    background: `rgba(${color.rgb},0.18)`,
                    border: `1px solid rgba(${color.rgb},0.42)`,
                  }}
                />
                {i < arr.length - 1 && (
                  <div
                    className="h-px w-8"
                    style={{ background: VT.ruleSoft }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <h3
          className="font-sans mb-2 text-center"
          style={{ fontSize: 16, color: VT.paper, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          No archived forecasts yet
        </h3>
        <p
          className="font-sans text-center max-w-md mb-2"
          style={{ fontSize: 12, color: VT.paperDim, lineHeight: 1.6, letterSpacing: "0.005em" }}
        >
          Resolved and expired forecasts appear here in chronological order. The timeline builds automatically as your predictions reach their outcomes.
        </p>
        <p
          className="font-sans italic text-center max-w-md mb-6"
          style={{ fontSize: 11, color: VT.ashSoft, lineHeight: 1.6, letterSpacing: "0.005em" }}
        >
          Use the calendar view to see forecast density by day, or switch to timeline mode for a chronological feed of past predictions.
        </p>

        <div
          className="flex items-center gap-5 pt-5"
          style={{ borderTop: `1px dashed ${VT.ruleSoft}`, width: "100%", maxWidth: 420, justifyContent: "center" }}
        >
          {[
            { label: "Searchable", icon: Search },
            { label: "Filterable", icon: SlidersHorizontal },
            { label: "Drillable", icon: Target },
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
    </motion.div>
  )
}
