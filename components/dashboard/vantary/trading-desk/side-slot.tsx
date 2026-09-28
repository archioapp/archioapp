"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · SIDE SLOT
 *  ─────────────────────────────────────────────────────────────────────────
 *  Owns the panel that lives next to (in split mode) or below (in
 *  stacked mode) the TradingView chart. Renders one of ten module
 *  variants from the trading-desk module library:
 *
 *    BUILT-IN MINIS (rendered from data here):
 *      "active-windows"  — open positions list
 *      "live-equity"     — equity sparkline + KPIs
 *
 *    PARENT-SUPPLIED (passed in via `customSlotContent`):
 *      "account-asset"   — Account & Asset Management module
 *      "pairs-you-trade" — Pairs You Trade module
 *
 *    PLACEHOLDERS (coming soon · render a "wired soon" card):
 *      "pending-orders"  — limit/stop ladder
 *      "risk-meter"      — daily R consumed
 *      "daily-max"       — distance to daily max loss
 *      "news-calendar"   — economic calendar + breaking news
 *      "watchlist"       — pinned instruments
 *      "ai-copilot"      — chat box that reads from all modules
 *
 *  At the top of the panel there is no longer a per-slot toggle — the
 *  chip strip in the bay header (and the customize popover) is the
 *  source of truth. The whole thing animates via AnimatePresence so
 *  the switch reads as a soft crossfade.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useMemo, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Hourglass } from "lucide-react"

import { useTradingDesk } from "./provider"
import {
  DEMO_ACTIVE_TRADES,
  DEMO_EQUITY_MICRO,
  TD_SIDE_SLOT_LABELS,
  TD_SIDE_SLOT_IMPLEMENTED,
  type TdSideSlot,
} from "./data"
import { VANTARY } from "../vantary-theme"
import { ExecutionConsoleShell } from "./execution-console"

/* ─── 1.  ROOT ───────────────────────────────────────────────────────
 *  The root accepts a single render-prop map — `customSlotContent` —
 *  whose keys are TdSideSlot ids and whose values are the parent-
 *  supplied node for each. When a key is present, the slot renders
 *  that node verbatim. When absent, the slot falls back to either a
 *  built-in mini (active-windows / live-equity) or a "coming soon"
 *  placeholder for not-yet-implemented modules.
 *
 *  The legacy `liveEquityContent` and `activeWindowsContent` props are
 *  still accepted as a backwards-compat shim — they're folded into the
 *  customSlotContent map at the start of render so old call-sites in
 *  your-space.tsx (and TradingDeskBay) keep working unchanged.
 * ────────────────────────────────────────────────────────────────────── */

export interface SideSlotProps {
  /** Map of slot id → node. The slot renders the matching node when
   *  present; falls back to the built-in mini or the "coming soon"
   *  placeholder otherwise. */
  customSlotContent?: Partial<Record<TdSideSlot, ReactNode>>
  /** Backwards-compat shim — folded into customSlotContent. */
  liveEquityContent?: ReactNode
  /** Backwards-compat shim — folded into customSlotContent. */
  activeWindowsContent?: ReactNode
}

export const SideSlot = memo(function SideSlot({
  customSlotContent,
  liveEquityContent,
  activeWindowsContent,
}: SideSlotProps) {
  const { state } = useTradingDesk()
  const slot = state.sideSlot

  // Fold legacy props into the unified map.
  const resolvedContent = useMemo<Partial<Record<TdSideSlot, ReactNode>>>(() => {
    return {
      ...(liveEquityContent    ? { "live-equity":    liveEquityContent    } : {}),
      ...(activeWindowsContent ? { "active-windows": activeWindowsContent } : {}),
      ...(customSlotContent ?? {}),
    }
  }, [customSlotContent, liveEquityContent, activeWindowsContent])

  const supplied = resolvedContent[slot]

  return (
    <div
      role="region"
      aria-label={`Trading desk side panel — ${TD_SIDE_SLOT_LABELS[slot]}`}
      style={{
        display:        "flex",
        flexDirection:  "column",
        height:         "100%",
        background:     VANTARY.ink ?? VANTARY.paper,
        overflow:       "hidden",
      }}
    >
      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slot}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "auto",
              padding: supplied ? 14 : 0,
            }}
          >
            {supplied ?? <DefaultSlotContent slot={slot} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
})

/* ─── 2.  DEFAULT CONTENT DISPATCH ────────────────────────────────── */

function DefaultSlotContent({ slot }: { slot: TdSideSlot }) {
  switch (slot) {
    case "execution-console": return <ExecutionConsoleShell />
    case "active-windows":  return <ActiveWindowsMini />
    case "live-equity":     return <LiveEquityMini />
    case "account-asset":   return <ComingSoonCard slot={slot} />
    case "pairs-you-trade": return <ComingSoonCard slot={slot} />
    case "pending-orders":  return <ComingSoonCard slot={slot} />
    case "risk-meter":      return <ComingSoonCard slot={slot} />
    case "daily-max":       return <ComingSoonCard slot={slot} />
    case "news-calendar":   return <ComingSoonCard slot={slot} />
    case "watchlist":       return <ComingSoonCard slot={slot} />
    case "ai-copilot":      return <ComingSoonCard slot={slot} />
    default:                return <ComingSoonCard slot={slot} />
  }
}

/* ─── 3.  COMING SOON PLACEHOLDER ─────────────────────────────────── */

function ComingSoonCard({ slot }: { slot: TdSideSlot }) {
  const isImplemented = TD_SIDE_SLOT_IMPLEMENTED[slot]
  const label = TD_SIDE_SLOT_LABELS[slot]

  // Module-specific descriptions that explain what the trader will see
  // when this gets wired up. Concrete and useful — not vague filler.
  const descriptions: Record<TdSideSlot, string> = {
    "execution-console": "One-screen order ticket — risk-first sizing, AI pre-trade check, broker execution.",
    "active-windows":  "Open positions, side, live PnL, R-multiple per row.",
    "live-equity":     "24h equity curve, today/week PnL, best/worst day.",
    "account-asset":   "Account holder, AUM, broker, leverage, asset register.",
    "pairs-you-trade": "Concentration map of which instruments dominate your tape.",
    "pending-orders":  "Limit/stop orders armed — distance to fill, time-in-force.",
    "risk-meter":      "R consumed today, daily max, drawdown approach gauge.",
    "daily-max":       "Distance to firm limit, prop-firm-aware (FTMO/Topstep/Apex).",
    "news-calendar":   "Next 24h economic events with countdown + impact tier.",
    "watchlist":       "Pinned instruments with price/change/volume.",
    "ai-copilot":      "Chat box. Ask anything — reads from every module.",
  }

  return (
    <div className="flex flex-col h-full px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3" style={{ borderBottom: `1px solid ${VANTARY.rule}`, paddingBottom: 10 }}>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10.5, letterSpacing: "0.22em", color: VANTARY.amber, fontWeight: 500 }}
        >
          {label}
        </span>
        <span aria-hidden style={{ flex: 1 }} />
        {!isImplemented && (
          <span
            className="font-mono uppercase flex items-center gap-1"
            style={{
              padding:       "2px 6px",
              fontSize:      8.5,
              letterSpacing: "0.22em",
              color:         VANTARY.ashSoft,
              border:        `1px solid ${VANTARY.rule}`,
              borderRadius:  2,
            }}
          >
            <Hourglass size={9} strokeWidth={1.6} />
            WIRED SOON
          </span>
        )}
      </div>

      {/* Description */}
      <p
        className="font-sans"
        style={{
          fontSize:   12.5,
          color:      VANTARY.paperDim,
          lineHeight: 1.55,
          marginBottom: 12,
        }}
      >
        {descriptions[slot]}
      </p>

      {/* Stub schematic — gives the slot some visual weight so the
          trader sees the module exists in the layout even before its
          real content is wired. Three hairline rows that hint at the
          shape of the upcoming content. */}
      <div className="flex flex-col gap-1.5 flex-1 mt-auto">
        {[0.7, 0.45, 0.55, 0.4, 0.6].map((w, i) => (
          <div
            key={i}
            style={{
              height:       8,
              width:        `${w * 100}%`,
              background:   VANTARY.rule,
              borderRadius: 2,
              opacity:      0.55,
            }}
          />
        ))}
      </div>

      {/* Footer hint */}
      <span
        className="font-mono uppercase mt-3"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        Pickable from CUSTOMIZE · {label}
      </span>
    </div>
  )
}

/* ─── 4.  ACTIVE WINDOWS MINI ──────────────────────────────────────── */

function ActiveWindowsMini() {
  const trades = DEMO_ACTIVE_TRADES
  const totalPnl = useMemo(
    () => trades.reduce((s, t) => s + t.pnlUsd, 0),
    [trades],
  )
  const isUp = totalPnl >= 0

  return (
    <div className="flex flex-col h-full">
      {/* Aggregate strip */}
      <div
        className="flex items-baseline gap-3 px-3 py-2"
        style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          OPEN · {trades.length}
        </span>
        <span aria-hidden style={{ width: 1, height: 9, background: VANTARY.rule }} />
        <span
          className="font-mono tabular-nums ml-auto"
          style={{
            fontSize:   13,
            color:      isUp ? VANTARY.amber : VANTARY.paperDim,
            fontWeight: 500,
          }}
        >
          {isUp ? "+" : "−"}${Math.abs(totalPnl).toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Trade rows */}
      <div className="flex-1 overflow-y-auto">
        {trades.length === 0 ? (
          <div
            className="font-sans italic px-3 py-4 text-center"
            style={{ fontSize: 12, color: VANTARY.paperDim }}
          >
            No open positions.
          </div>
        ) : (
          trades.map(t => (
            <article
              key={t.id}
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: `1px dashed ${VANTARY.rule}` }}
            >
              {/* side pill */}
              <span
                className="font-mono uppercase shrink-0"
                style={{
                  padding:       "2px 5px",
                  fontSize:      9,
                  letterSpacing: "0.18em",
                  color:         t.side === "LONG" ? VANTARY.amber : VANTARY.paperDim,
                  border:        `1px solid ${t.side === "LONG" ? VANTARY.amberHalo : VANTARY.rule}`,
                  borderRadius:  2,
                  fontWeight:    500,
                }}
              >
                {t.side}
              </span>

              {/* symbol */}
              <span
                className="font-sans flex-1 min-w-0 truncate"
                style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500 }}
              >
                {t.symbol}
              </span>

              {/* pnl */}
              <span
                className="font-mono tabular-nums shrink-0"
                style={{
                  fontSize:   12,
                  color:      t.pnlUsd >= 0 ? VANTARY.amber : VANTARY.paperDim,
                  fontWeight: 500,
                }}
              >
                {t.pnlUsd >= 0 ? "+" : "−"}${Math.abs(t.pnlUsd).toFixed(0)}
              </span>

              {/* R-multiple */}
              <span
                className="font-mono tabular-nums shrink-0"
                style={{ fontSize: 10, color: VANTARY.ashSoft, minWidth: 36, textAlign: "right" }}
              >
                {t.rMultiple >= 0 ? "+" : ""}{t.rMultiple.toFixed(1)}R
              </span>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── 5.  LIVE EQUITY MINI ─────────────────────────────────────────── */

function LiveEquityMini() {
  const eq = DEMO_EQUITY_MICRO
  const todayUp = eq.todayPnlUsd >= 0
  const weekUp  = eq.weekPnlUsd  >= 0

  return (
    <div className="flex flex-col h-full">
      {/* KPI block */}
      <div
        className="flex flex-col px-3 py-3 gap-1"
        style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          CURRENT EQUITY
        </span>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 24, color: VANTARY.paper, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          ${eq.currentEquity.toLocaleString("en-US")}
        </span>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <KpiPill
            label="TODAY"
            value={`${todayUp ? "+" : "−"}$${Math.abs(eq.todayPnlUsd)}`}
            sub={`${todayUp ? "+" : ""}${eq.todayPnlPct.toFixed(1)}%`}
            up={todayUp}
          />
          <KpiPill
            label="WEEK"
            value={`${weekUp ? "+" : "−"}$${Math.abs(eq.weekPnlUsd).toLocaleString("en-US")}`}
            sub={`${weekUp ? "+" : ""}${eq.weekPnlPct.toFixed(1)}%`}
            up={weekUp}
          />
        </div>
      </div>

      {/* Sparkline */}
      <div className="flex-1 px-3 py-3 flex flex-col">
        <span
          className="font-mono uppercase mb-2"
          style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          24H CURVE · 96 ticks
        </span>
        <div style={{ flex: 1, minHeight: 60 }}>
          <Sparkline series={eq.series} />
        </div>
      </div>

      {/* Best / worst chips */}
      <div
        className="flex items-center gap-3 px-3 py-2"
        style={{ borderTop: `1px solid ${VANTARY.rule}` }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          BEST
        </span>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 11, color: VANTARY.amber, fontWeight: 500 }}
        >
          +${eq.bestDayPnlUsd}
        </span>
        <span aria-hidden style={{ width: 1, height: 9, background: VANTARY.rule, marginLeft: "auto" }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          WORST
        </span>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 11, color: VANTARY.paperDim, fontWeight: 500 }}
        >
          −${Math.abs(eq.worstDayPnlUsd)}
        </span>
      </div>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function KpiPill({
  label,
  value,
  sub,
  up,
}: {
  label: string
  value: string
  sub: string
  up: boolean
}) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        padding:      "3px 8px",
        border:       `1px solid ${up ? VANTARY.amberHalo : VANTARY.rule}`,
        background:   up ? VANTARY.amberWash : "transparent",
        borderRadius: 3,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize:   11.5,
          color:      up ? VANTARY.amber : VANTARY.paperDim,
          fontWeight: 500,
        }}
      >
        {value}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{ fontSize: 9.5, color: VANTARY.ashSoft }}
      >
        {sub}
      </span>
      {up
        ? <TrendingUp   size={11} strokeWidth={1.6} color={VANTARY.amber} />
        : <TrendingDown size={11} strokeWidth={1.6} color={VANTARY.paperDim} />}
    </div>
  )
}

function Sparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null
  const w = 100
  const h = 100
  const stride = w / (series.length - 1)
  const points = series.map((v, i) => `${(i * stride).toFixed(2)},${((1 - v) * h).toFixed(2)}`).join(" ")
  const lastY = (1 - series[series.length - 1]) * h

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      aria-hidden
    >
      {/* underlay area */}
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={VANTARY.amberWash}
      />
      {/* curve */}
      <polyline
        points={points}
        fill="none"
        stroke={VANTARY.amber}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
      {/* end dot */}
      <circle
        cx={w}
        cy={lastY}
        r={1.6}
        fill={VANTARY.amber}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
