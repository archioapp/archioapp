"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS  ·  F · CAPITAL EXPOSURE MAP
 *  ─────────────────────────────────────────────────────────────────────────
 *  The CAPITAL OF WEEK centerpiece. Three horizontal strata —
 *    SYMBOL  ·  SESSION  ·  DAY
 *  — each a row of normalised hairline-bordered slices that sum to 100%.
 *  Above the strata: dominant-currency callout + correlation badge.
 *  Below: a prose suggestion line and a net-USD/net-R summary chip.
 *
 *  Hovering a slice ISOLATES it: other slices in the SAME stratum dim,
 *  and slices in OTHER strata that share the same hovered key (the same
 *  symbol's day breakdown, the same session's symbol breakdown) lift to
 *  amber to show the structural overlap. Clicking a DAY slice writes
 *  selectedDow to the OS context — so it lights up the LEFT-card week
 *  grid + the Mirror ribbon (bidirectional sync arrives in EPIC H).
 *
 *  Editorial — hairline borders, transparent backgrounds, amberWash only
 *  for hover/selected. Theme-safe under TEAL GLASS / OBSIDIAN INK / etc.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useMemo, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useStrategyOs } from "./provider"
import { CapitalSlice }  from "./data"

/* ═══════════════════════════════════════════════════════════════════════════
 *  CapitalExposureMap  ·  the entire EXPOSURE tab body
 * ═══════════════════════════════════════════════════════════════════════ */

export const CapitalExposureMap = memo(function CapitalExposureMap() {
  const { state, actions, palette, toneMap } = useStrategyOs()
  const { capital, selectedDow } = state
  const reduce = useReducedMotion()

  /* hovered slice (id) — drives isolation across strata */
  const [hoverId, setHoverId] = useState<string | null>(null)

  /* helper · resolve dow index from a "day-tue" id */
  const dowFromDayId = useCallback((id: string): number | null => {
    const tag = id.replace("day-", "").toUpperCase()
    const map: Record<string, number> = {
      MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 0,
    }
    return tag in map ? map[tag] : null
  }, [])

  /* ── render ───────────────────────────────────────────────── */
  return (
    <section className="flex flex-col gap-5">
      {/* ── HEADER · dominant currency + correlation + totals ─────── */}
      <header
        className="grid items-end gap-5"
        style={{
          gridTemplateColumns: "auto auto 1fr auto",
          paddingBottom: 14,
          borderBottom:  `1px solid ${palette.rule}`,
        }}
      >
        <DominantCurrency
          code={capital.dominantCurrency.code}
          weight={capital.dominantCurrency.weight}
          palette={palette}
          toneMap={toneMap}
        />
        <CorrelationBadge
          on={capital.correlationRisk}
          palette={palette}
          toneMap={toneMap}
        />
        <span aria-hidden style={{ height: 1, background: palette.rule, opacity: 0.4 }} />
        <CapitalTotals
          totalPl={capital.totalPl}
          totalR={capital.totalR}
          weekStart={capital.weekStart}
          palette={palette}
          toneMap={toneMap}
        />
      </header>

      {/* ── SUGGESTION · prose call-to-action ───────────────────── */}
      <SuggestionLine text={capital.suggestion} palette={palette} toneMap={toneMap} />

      {/* ── STRATA · three stacked horizontal stratum bars ───────── */}
      <div className="flex flex-col gap-5">
        <Stratum
          label="SYMBOL"
          slices={capital.bySymbol}
          hoverId={hoverId}
          setHoverId={setHoverId}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
        <Stratum
          label="SESSION"
          slices={capital.bySession}
          hoverId={hoverId}
          setHoverId={setHoverId}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
        <Stratum
          label="DAY"
          slices={capital.byDay}
          hoverId={hoverId}
          setHoverId={setHoverId}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
          onSliceClick={(slice) => {
            const dow = dowFromDayId(slice.id)
            if (dow != null) actions.selectDow(dow)
          }}
          highlightId={
            selectedDow != null
              ? capital.byDay.find((s) => dowFromDayId(s.id) === selectedDow)?.id ?? null
              : null
          }
        />
      </div>

      {/* ── DRILLDOWN · hovered slice's micro-readout ─────────────── */}
      <AnimatePresence>
        {hoverId && (
          <SliceDrilldown
            slice={
              [...capital.bySymbol, ...capital.bySession, ...capital.byDay].find((s) => s.id === hoverId) ?? null
            }
            palette={palette}
            toneMap={toneMap}
            reduce={!!reduce}
          />
        )}
      </AnimatePresence>
    </section>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
 *  Stratum  ·  one horizontal row of slices summing to 100%
 * ═══════════════════════════════════════════════════════════════════════ */

function Stratum({
  label,
  slices,
  hoverId,
  setHoverId,
  palette,
  toneMap,
  reduce,
  onSliceClick,
  highlightId,
}: {
  label:        string
  slices:       CapitalSlice[]
  hoverId:      string | null
  setHoverId:   (id: string | null) => void
  palette:      any
  toneMap:      any
  reduce:       boolean
  onSliceClick?: (slice: CapitalSlice) => void
  highlightId?:  string | null
}) {
  // Drop zero-pct slices from the visible bar; keep them in the legend.
  const visible = useMemo(() => slices.filter((s) => s.pct > 0), [slices])
  const empty   = useMemo(() => slices.filter((s) => s.pct === 0), [slices])

  return (
    <div className="flex flex-col gap-2">
      {/* eyebrow + slice labels */}
      <div className="flex items-baseline justify-between gap-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      9,
            letterSpacing: "0.30em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          {label} EXPOSURE
        </span>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {slices.map((s) => {
            const isHover    = hoverId === s.id
            const isHighlight = highlightId === s.id
            const dim        = hoverId != null && hoverId !== s.id
            return (
              <span
                key={s.id}
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize:      9,
                  letterSpacing: "0.18em",
                  color:         isHover || isHighlight ? palette.amber
                                  : dim                 ? palette.ashSoft
                                  : palette.paperDim,
                  opacity:       dim ? 0.55 : 1,
                  transition:    "color 200ms ease, opacity 200ms ease",
                }}
              >
                {s.label} {Math.round(s.pct * 100)}%
              </span>
            )
          })}
        </div>
      </div>

      {/* the 100% bar */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: visible.map((s) => `${s.pct}fr`).join(" "),
          height:              28,
          width:               "100%",
          border:              `1px solid ${palette.rule}`,
          background:          "transparent",
          overflow:            "hidden",
        }}
        role="group"
        aria-label={`${label} exposure breakdown`}
      >
        {visible.map((s, i) => {
          const isHover     = hoverId === s.id
          const isHighlight = highlightId === s.id
          const dim         = hoverId != null && hoverId !== s.id
          const isLoss      = s.pl < 0
          return (
            <button
              type="button"
              key={s.id}
              onMouseEnter={() => setHoverId(s.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(s.id)}
              onBlur={() => setHoverId(null)}
              onClick={() => onSliceClick?.(s)}
              className="relative flex items-center justify-center font-mono uppercase tabular-nums"
              aria-label={`${s.label} ${Math.round(s.pct * 100)}% — ${s.pl >= 0 ? "+" : ""}${s.pl} USD`}
              style={{
                borderLeft:    i === 0 ? "none" : `1px solid ${palette.rule}`,
                background:    isHover || isHighlight ? palette.amberWash : "transparent",
                color:         isHover || isHighlight ? palette.amber
                                : dim                 ? palette.ashSoft
                                : isLoss              ? palette.paperDim
                                : palette.paper,
                fontSize:      10,
                letterSpacing: "0.18em",
                cursor:        onSliceClick ? "pointer" : "default",
                transition:    "all 200ms ease",
                opacity:       dim ? 0.55 : 1,
                fontWeight:    isHover || isHighlight ? 500 : 400,
              }}
            >
              {/* loss diagonal hatch — only for negative slices */}
              {isLoss && (
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: `repeating-linear-gradient(135deg, ${palette.paperDim}, ${palette.paperDim} 1px, transparent 1px, transparent 5px)`,
                    opacity:    0.18,
                    pointerEvents: "none",
                  }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                {s.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* empty (zero-pct) slices · greyed legend below the bar */}
      {empty.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span
            className="font-mono uppercase"
            style={{
              fontSize:      8.5,
              letterSpacing: "0.24em",
              color:         palette.ashSoft,
            }}
          >
            INACTIVE
          </span>
          {empty.map((s) => (
            <span
              key={s.id}
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize:      8.5,
                letterSpacing: "0.20em",
                color:         palette.ashSoft,
                opacity:       0.55,
                padding:       "1px 5px",
                border:        `1px dashed ${palette.rule}`,
                borderRadius:  2,
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  DominantCurrency  ·  the "USD 50%" callout
 * ═══════════════════════════════════════════════════════════════════════ */

function DominantCurrency({
  code,
  weight,
  palette,
  toneMap,
}: {
  code:    string
  weight:  number  // 0..1
  palette: any
  toneMap: any
}) {
  const pct = Math.round(weight * 100)
  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.30em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        DOMINANT
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize:      24,
            color:         palette.paper,
            fontWeight:    500,
            letterSpacing: "-0.02em",
          }}
        >
          {code}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize:      14,
            color:         toneMap.optimal,
            fontWeight:    500,
          }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CorrelationBadge
 * ═══════════════════════════════════════════════════════════════════════ */

function CorrelationBadge({
  on,
  palette,
  toneMap,
}: {
  on:      boolean
  palette: any
  toneMap: any
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.30em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        CORRELATION
      </span>
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize:      11,
          padding:       "3px 8px",
          letterSpacing: "0.24em",
          color:         on ? palette.paper : toneMap.optimal,
          border:        `1px solid ${on ? palette.amberHalo : palette.rule}`,
          background:    on ? palette.amberWash : "transparent",
          borderRadius:  2,
          alignSelf:     "flex-start",
          fontWeight:    500,
        }}
      >
        {on ? "RISK" : "BALANCED"}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CapitalTotals
 * ═══════════════════════════════════════════════════════════════════════ */

function CapitalTotals({
  totalPl,
  totalR,
  weekStart,
  palette,
  toneMap,
}: {
  totalPl:   number
  totalR:    number
  weekStart: string
  palette:   any
  toneMap:   any
}) {
  const positive = totalPl >= 0
  return (
    <div className="flex items-baseline gap-4">
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      8.5,
            letterSpacing: "0.26em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          NET WEEK · {weekStart}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize:      18,
            color:         positive ? toneMap.optimal : palette.paper,
            fontWeight:    500,
            letterSpacing: "-0.01em",
          }}
        >
          {positive ? "+" : ""}{totalPl.toLocaleString()} USD
        </span>
      </div>
      <span aria-hidden style={{ width: 1, height: 28, background: palette.rule, alignSelf: "center" }} />
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      8.5,
            letterSpacing: "0.26em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          R-MULTIPLE
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize:   18,
            color:      totalR >= 0 ? toneMap.optimal : palette.paper,
            fontWeight: 500,
          }}
        >
          {totalR >= 0 ? "+" : ""}{totalR.toFixed(1)}R
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  SuggestionLine
 * ═══════════════════════════════════════════════════════════════════════ */

function SuggestionLine({
  text,
  palette,
  toneMap,
}: {
  text:    string
  palette: any
  toneMap: any
}) {
  if (!text) return null
  return (
    <div
      className="flex items-start gap-3"
      style={{
        padding:    "10px 14px",
        border:     `1px solid ${palette.amberHalo}`,
        background: palette.amberWash,
      }}
    >
      <span
        aria-hidden
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.30em",
          color:         palette.amber,
          fontWeight:    500,
          marginTop:     2,
          minWidth:      62,
        }}
      >
        SUGGEST
      </span>
      <p
        className="font-sans"
        style={{
          margin:     0,
          fontSize:   12.5,
          lineHeight: 1.6,
          color:      palette.paper,
        }}
      >
        {text}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  SliceDrilldown
 * ═══════════════════════════════════════════════════════════════════════ */

function SliceDrilldown({
  slice,
  palette,
  toneMap,
  reduce,
}: {
  slice:   CapitalSlice | null
  palette: any
  toneMap: any
  reduce:  boolean
}) {
  if (!slice) return null
  const positive = slice.pl >= 0
  return (
    <motion.div
      key={slice.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: reduce ? 0.05 : 0.22, ease: [0.65, 0, 0.35, 1] }}
      className="grid items-center gap-4"
      style={{
        gridTemplateColumns: "auto auto auto auto 1fr",
        padding:    "10px 14px",
        border:     `1px solid ${palette.rule}`,
        background: "transparent",
      }}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      8.5,
            letterSpacing: "0.26em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          SLICE
        </span>
        <span
          className="font-sans"
          style={{
            fontSize:      14,
            color:         palette.amber,
            fontWeight:    500,
            letterSpacing: "-0.01em",
          }}
        >
          {slice.label}
        </span>
      </div>
      <DrillStat label="SHARE" value={`${Math.round(slice.pct * 100)}%`} palette={palette} />
      <DrillStat
        label="P&L"
        value={`${positive ? "+" : ""}${slice.pl} USD`}
        valueColor={positive ? toneMap.optimal : palette.paper}
        palette={palette}
      />
      <DrillStat
        label="R"
        value={`${slice.rMultiple >= 0 ? "+" : ""}${slice.rMultiple.toFixed(1)}R`}
        valueColor={slice.rMultiple >= 0 ? toneMap.optimal : palette.paper}
        palette={palette}
      />
      <span
        className="font-sans"
        style={{
          fontSize:   12,
          color:      palette.paperDim,
          lineHeight: 1.5,
        }}
      >
        {slice.detail || `${slice.trades} trade${slice.trades === 1 ? "" : "s"}`}
      </span>
    </motion.div>
  )
}

function DrillStat({
  label,
  value,
  valueColor,
  palette,
}: {
  label:       string
  value:       string
  valueColor?: string
  palette:     any
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.26em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize:      13,
          color:         valueColor ?? palette.paper,
          fontWeight:    500,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
    </div>
  )
}
