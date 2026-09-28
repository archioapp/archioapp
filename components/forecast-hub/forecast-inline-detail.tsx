"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  MessageSquare,
  Timer,
  CheckCircle2,
  XCircle,
  Clock,
  Share2,
  Hourglass,
  Copy,
  Bookmark,
  ExternalLink,
  ArrowLeft,
  // ─── added for the premium pass ──────────────────────────────────────
  Crown,
  Pin,
  Reply,
  Maximize2,
  Layers,
  Play,
  Sparkles,
  Crosshair,
  Users,
  ChevronRight,
  ChevronDown,
  Star,
  AlertTriangle,
  TrendingUp,
  Activity,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ACCENT } from "@/components/mtf/mtf-theme"
import { VT, amber, rgba } from "./forecast-vantary-tokens"
import type { ForecastItem, ForecastStatus } from "./forecast-types"
import { ForecastIntelligencePanel } from "./forecast-detail-intelligence"

/* ════════════════════════════════════════════════════════════════════════
   FORECAST INLINE DETAIL — "Forecast Room" premium frame
   ────────────────────────────────────────────────────────────────────────
   Composition contract:
   • Stage (outer terminal environment)
       → Frame chrome (status-tinted halo + corner accents)
           → Command strip header (3 zones: nav · status · context+actions)
           → Split body
               LEFT  — Evidence Theater (chart) → Spec Rail → Discussion Room
               RIGHT — Forecast Intelligence Passport (UNTOUCHED MODULE)

   Visual language:
   • Anchor circles, hairline travelers, dashed bottom rules
   • Mono-uppercase eyebrows at 0.22em / 9–10px / weight 500
   • tabular-nums on every numeric value
   • VT.* tokens for theme-routing; ACCENT.* for chart semantics
   • No new colors; no new fonts; no global token changes
   ════════════════════════════════════════════════════════════════════════ */

interface ForecastInlineDetailProps {
  forecast: ForecastItem
  onClose: () => void
}

/* ── shared text styles ──────────────────────────────────────────────────
   Typography contract aligned with the right Intelligence panel:
     • Inter sans for ALL display & numeric values (no chunky terminal mono)
     • Mono ONLY for tiny uppercase micro-cap eyebrow labels (≤10 px)
     • Letter-spacing 0.18 em on eyebrows (matches right panel)
   ────────────────────────────────────────────────────────────────────── */
const eyebrow = (color: string, size = 9.5): React.CSSProperties => ({
  fontFamily: "var(--font-mono)",
  fontSize: size,
  letterSpacing: "0.18em",
  fontWeight: 500,
  color,
  textTransform: "uppercase",
})

const numStyle = (color: string, size: number, weight = 500): React.CSSProperties => ({
  fontFamily: "var(--font-sans)",
  fontSize: size,
  fontWeight: weight,
  color,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-0.02em",
  lineHeight: 1,
})

/* ════════════════════════════════════════════════════════════════════════
   GLASS PRIMITIVES — mirror the right-rail aesthetic (forecast-detail-
   intelligence.tsx → GlassCard / Hairline). These wrap the LEFT column
   sections (Execution Spec, Community Vote, Discussion) so they read as
   the same visual family as the Community Pulse / Conviction Split / Top
   Reactions panels on the right side of the popup.
   ──────────────────────────────────────────────────────────────────────
   • LeftCard       — 22px radius, soft white-on-glass gradient, hairline
                      border, inset top highlight, optional accent corner
                      glow tinted to the forecast direction (long/short).
   • LeftHairline   — dashed rgba(255,255,255,0.06) — same token the
                      right rail uses between subsections.
   ════════════════════════════════════════════════════════════════════════ */
function LeftCard({
  children,
  accentRgb,
  className,
  padding = 0,
}: {
  children: React.ReactNode
  accentRgb?: string
  className?: string
  padding?: number
}) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        borderRadius: 22,
        padding,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.024) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      {/* top inner highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
        }}
      />
      {/* accent corner glow tinted to direction */}
      {accentRgb && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: `radial-gradient(circle at top right, ${rgba(accentRgb, 0.08)}, transparent 60%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

function LeftHairline() {
  return (
    <div
      className="w-full"
      style={{
        height: 1,
        borderTop: "1px dashed rgba(255,255,255,0.06)",
      }}
    />
  )
}

/* ── small helper: derive the active session from a UTC timestamp ────── */
function deriveSession(date: Date): { name: string; band: string } {
  const h = date.getUTCHours()
  if (h >= 0 && h < 7) return { name: "Asia", band: "00:00 — 07:00 UTC" }
  if (h >= 7 && h < 12) return { name: "London", band: "07:00 — 12:00 UTC" }
  if (h >= 12 && h < 16) return { name: "NY · Overlap", band: "12:00 — 16:00 UTC" }
  if (h >= 16 && h < 21) return { name: "NY", band: "16:00 — 21:00 UTC" }
  return { name: "Late NY · Asia open", band: "21:00 — 24:00 UTC" }
}

/* ── small helper: deterministic per-name role badge ─────────────────── */
function deriveCommenterRole(name: string): "MENTOR" | "PRO" | "MEMBER" {
  if (!name) return "MEMBER"
  const c = name.charCodeAt(0)
  if (c % 7 === 0) return "MENTOR"
  if (c % 3 === 0) return "PRO"
  return "MEMBER"
}

export function ForecastInlineDetail({ forecast: rawForecast, onClose }: ForecastInlineDetailProps) {
  // ── Status preview switcher ──────────────────────────────────────────
  // Lets the viewer flip the displayed lifecycle state (active / won / lost
  // / expired / etc.) WITHOUT mutating the underlying forecast data. The
  // displayedForecast below is the single source of truth threaded to
  // every child of the popup — the chart theater, the spec rail, the
  // discussion room, and the right Intelligence Passport. Reset returns
  // to the original state.
  const [overrideStatus, setOverrideStatus] = useState<ForecastStatus | null>(null)

  const forecast = useMemo<ForecastItem>(
    () =>
      overrideStatus && overrideStatus !== rawForecast.status
        ? { ...rawForecast, status: overrideStatus }
        : rawForecast,
    [rawForecast, overrideStatus],
  )

  const dirColor = forecast.direction === "LONG" ? ACCENT.emerald : ACCENT.rose
  const statusCfg = getStatusConfig(forecast.status)
  const expiresIn = forecast.expiresAt ? getTimeUntil(forecast.expiresAt) : null

  const projectedMove = useMemo(() => {
    const entry = parseFloat(forecast.entry.replace(/,/g, ""))
    const target = parseFloat(forecast.takeProfit.replace(/,/g, ""))
    if (isNaN(entry) || isNaN(target) || entry === 0) return null
    const pct = ((target - entry) / entry) * 100
    return forecast.direction === "SHORT" ? `${(pct * -1).toFixed(2)}%` : `+${pct.toFixed(2)}%`
  }, [forecast.entry, forecast.takeProfit, forecast.direction])

  const riskRewardDistances = useMemo(() => {
    const entry = parseFloat(forecast.entry.replace(/,/g, ""))
    const sl = parseFloat(forecast.stopLoss.replace(/,/g, ""))
    const tp = parseFloat(forecast.takeProfit.replace(/,/g, ""))
    if (isNaN(entry) || isNaN(sl) || isNaN(tp)) return null
    const riskDist = Math.abs(entry - sl)
    const rewardDist = Math.abs(tp - entry)
    return {
      risk: riskDist.toFixed(entry > 100 ? 0 : 4),
      reward: rewardDist.toFixed(entry > 100 ? 0 : 4),
    }
  }, [forecast.entry, forecast.stopLoss, forecast.takeProfit])

  return (
    <Stage dirRgb={dirColor.rgb}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease: VT.ease }}
        className="overflow-hidden relative"
        style={{
          background: VT.glass,
          backdropFilter: VT.blurStrong,
          WebkitBackdropFilter: VT.blurStrong,
          border: `1px solid ${VT.rule}`,
          borderRadius: VT.cardRadius,
          boxShadow: [
            // existing card shadow
            VT.cardShadow,
            // top inner light edge
            "inset 0 1px 0 rgba(255,255,255,0.05)",
            // very faint direction wash from below — no status ring
            `0 50px 100px -40px ${rgba(dirColor.rgb, 0.10)}`,
          ].join(", "),
        }}
      >
        {/* ── Corner accents (4 L-shaped marks inside the frame) ── */}
        <CornerAccent corner="tl" />
        <CornerAccent corner="tr" />
        <CornerAccent corner="bl" />
        <CornerAccent corner="br" />

        {/* ── COMMAND STRIP ── */}
        <FrameHeader
          forecast={forecast}
          dirColor={dirColor}
          statusCfg={statusCfg}
          expiresIn={expiresIn}
          onClose={onClose}
          overrideStatus={overrideStatus}
          originalStatus={rawForecast.status}
          onOverrideStatus={setOverrideStatus}
        />

        {/* ── STATUS PREVIEW BAR (collapsible) ── */}
        <StatusPreviewBar
          originalStatus={rawForecast.status}
          activeStatus={forecast.status}
          overrideStatus={overrideStatus}
          onOverrideStatus={setOverrideStatus}
        />

        {/* ── SPLIT VIEW ── */}
        <div
          className="flex"
          style={{ maxHeight: "calc(100vh - 280px)", minHeight: "500px" }}
        >
          {/* LEFT — Evidence + Spec Rail + Discussion Room */}
          <div
            className="flex-[62] flex flex-col overflow-y-auto"
            style={{ borderRight: `1px solid ${VT.rule}` }}
          >
            <EvidenceTheater
              forecast={forecast}
              dirColor={dirColor}
              statusCfg={statusCfg}
            />

            {/* ── Glass card wrapping Execution Spec → Community Vote → Discussion.
                Mirrors the right-rail Community Pulse panel: one rounded glass
                surface with internal dashed hairlines between subsections. ── */}
            <div className="px-4 pt-4 pb-5">
              <LeftCard accentRgb={dirColor.rgb}>
                <SpecHeadlineRail
                  forecast={forecast}
                  dirColor={dirColor}
                  projectedMove={projectedMove}
                  riskRewardDistances={riskRewardDistances}
                />
                <LeftHairline />
                <CommunityVoteBar forecast={forecast} dirColor={dirColor} />
                <LeftHairline />
                <DiscussionRoom forecast={forecast} dirColor={dirColor} />
              </LeftCard>
            </div>
          </div>

          {/* RIGHT — Intelligence Passport (UNTOUCHED) */}
          <ForecastIntelligencePanel
            forecast={forecast}
            dirColor={dirColor}
            statusCfg={statusCfg}
            expiresIn={expiresIn}
            riskRewardDistances={riskRewardDistances}
            projectedMove={projectedMove}
          />
        </div>
      </motion.div>
    </Stage>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   STAGE — outer terminal environment (grid + scanlines + radial glows)
   ────────────────────────────────────────────────────────────────────────
   Wraps the frame so the popup feels mounted inside an institutional
   trading terminal, not pasted onto the dashboard. Pure-display only —
   no interactive content lives in the stage.
   ════════════════════════════════════════════════════════════════════════ */
function Stage({
  dirRgb,
  children,
}: {
  dirRgb: string
  children: React.ReactNode
}) {
  return (
    <div
      className="relative isolate"
      style={{
        padding: "20px 18px",
        background:
          "radial-gradient(1200px 600px at 0% 0%, rgba(255,255,255,0.012), transparent 60%), radial-gradient(900px 500px at 100% 100%, rgba(255,255,255,0.008), transparent 60%), linear-gradient(180deg, rgba(7,9,13,0.55) 0%, rgba(7,9,13,0.32) 100%)",
        borderRadius: VT.cardRadius + 8,
      }}
    >
      {/* terminal grid (1.2% opacity, 24px) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, transparent 0, transparent 23px, rgba(255,255,255,0.014) 24px)",
            "repeating-linear-gradient(90deg, transparent 0, transparent 23px, rgba(255,255,255,0.014) 24px)",
          ].join(", "),
          maskImage:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 30%, transparent 80%)",
        }}
      />

      {/* single neutral scanline — drifting white at very low alpha, no color tint */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)",
          mixBlendMode: "screen",
        }}
        initial={{ top: "-2%", opacity: 0 }}
        animate={{ top: "102%", opacity: [0, 0.55, 0.55, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", times: [0, 0.05, 0.95, 1] }}
      />

      {/* single faint direction glow, top-left only — drops 10% → 5% */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -160,
          left: -160,
          width: 560,
          height: 560,
          background: `radial-gradient(closest-side, ${rgba(dirRgb, 0.05)}, transparent 70%)`,
        }}
      />

      {/* corner cross marks at the popup outer bounds */}
      <CrossMark position="tl" />
      <CrossMark position="tr" />
      <CrossMark position="bl" />
      <CrossMark position="br" />

      {/* the actual frame */}
      <div className="relative">{children}</div>
    </div>
  )
}

function CrossMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const off = 8
  const styles: React.CSSProperties = {
    position: "absolute",
    width: 10,
    height: 10,
    pointerEvents: "none",
    color: "rgba(255,255,255,0.18)",
  }
  if (position === "tl") {
    styles.top = off
    styles.left = off
  }
  if (position === "tr") {
    styles.top = off
    styles.right = off
  }
  if (position === "bl") {
    styles.bottom = off
    styles.left = off
  }
  if (position === "br") {
    styles.bottom = off
    styles.right = off
  }
  return (
    <svg viewBox="0 0 10 10" style={styles} aria-hidden>
      <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function CornerAccent({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const size = 14
  const inset = 6
  const stroke = "rgba(255,255,255,0.10)"
  const common: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
    zIndex: 2,
  }
  const horiz = (k: "top" | "bottom"): React.CSSProperties => ({
    position: "absolute",
    height: 1,
    width: size,
    background: stroke,
    [k]: 0,
    left: corner.endsWith("l") ? 0 : "auto",
    right: corner.endsWith("r") ? 0 : "auto",
  })
  const vert = (k: "top" | "bottom"): React.CSSProperties => ({
    position: "absolute",
    width: 1,
    height: size,
    background: stroke,
    [k]: 0,
    left: corner.endsWith("l") ? 0 : "auto",
    right: corner.endsWith("r") ? 0 : "auto",
  })
  if (corner === "tl") {
    common.top = inset
    common.left = inset
  }
  if (corner === "tr") {
    common.top = inset
    common.right = inset
  }
  if (corner === "bl") {
    common.bottom = inset
    common.left = inset
  }
  if (corner === "br") {
    common.bottom = inset
    common.right = inset
  }
  const isTop = corner.startsWith("t")
  return (
    <div style={common} aria-hidden>
      <div style={horiz(isTop ? "top" : "bottom")} />
      <div style={vert(isTop ? "top" : "bottom")} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   FRAME HEADER — three-zone command strip
   ────────────────────────────────────────────────────────────────────────
   Zone A — Navigation + Identity:  ‹ BACK · symbol · timeframe · direction
   Zone B — Status:                 live pulse · status label · countdown
   Zone C — Context + Actions:      community · UTC · toolbar
   ═══════════════════════════════════════════════════════════════════���════ */
function FrameHeader({
  forecast,
  dirColor,
  statusCfg,
  expiresIn,
  onClose,
  overrideStatus,
  originalStatus,
  onOverrideStatus,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  statusCfg: ReturnType<typeof getStatusConfig>
  expiresIn: string | null
  onClose: () => void
  overrideStatus: ForecastStatus | null
  originalStatus: ForecastStatus
  onOverrideStatus: (s: ForecastStatus | null) => void
}) {
  const [now, setNow] = useState(() => formatUTC(new Date()))
  useEffect(() => {
    const t = setInterval(() => setNow(formatUTC(new Date())), 30_000)
    return () => clearInterval(t)
  }, [])

  const community =
    forecast.communityContext?.name ??
    forecast.user?.communityName ??
    "Public feed"

  return (
    <div
      className="flex items-center px-5 relative"
      style={{
        height: 56,
        borderBottom: `1px solid ${VT.rule}`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0.0) 100%), " +
          VT.glassRecess,
      }}
    >
      {/* direction-tinted bottom hairline (single-tone, low opacity) */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${rgba(dirColor.rgb, 0.22)} 50%, transparent)`,
        }}
      />

      {/* ───── ZONE A — Navigation + Identity ───── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-2.5 cursor-pointer transition-colors"
          style={{
            height: 26,
            borderRadius: 4,
            border: `1px solid ${VT.rule}`,
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            e.currentTarget.style.borderColor = VT.ruleSoft
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.borderColor = VT.rule
          }}
        >
          <ArrowLeft size={11} strokeWidth={1.6} style={{ color: VT.ash }} />
          <span
            className="font-sans"
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: VT.ash,
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
          >
            Back
          </span>
        </button>

        <AnchorCircle />

        <div
          className="h-px flex-shrink-0"
          style={{
            width: 24,
            background: `linear-gradient(90deg, ${rgba(dirColor.rgb, 0.32)}, transparent)`,
          }}
        />

        <div className="flex items-baseline gap-2 flex-shrink-0">
          <span
            className="font-sans"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              fontWeight: 500,
              color: VT.paper,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {forecast.instrument}
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: VT.ashSoft,
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
          >
            {forecast.timeframe}
          </span>
        </div>

        <div
          className="flex items-center gap-1 px-2 flex-shrink-0"
          style={{
            height: 22,
            borderRadius: 4,
            border: `1px solid ${rgba(dirColor.rgb, 0.22)}`,
            background: rgba(dirColor.rgb, 0.06),
          }}
        >
          {forecast.direction === "LONG" ? (
            <ArrowUpRight size={10} strokeWidth={1.8} style={{ color: dirColor.hex }} />
          ) : (
            <ArrowDownRight size={10} strokeWidth={1.8} style={{ color: dirColor.hex }} />
          )}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              fontWeight: 500,
              color: dirColor.hex,
            }}
          >
            {forecast.direction}
          </span>
        </div>
      </div>

      {/* zone divider */}
      <ZoneDivider />

      {/* ───── ZONE B — Status ───── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <motion.div
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: `rgb(${statusCfg.color})`,
            boxShadow: `0 0 10px ${rgba(statusCfg.color, 0.7)}`,
          }}
          animate={{ scale: [0.85, 1.18, 0.85], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={eyebrow(rgba(statusCfg.color, 0.92), 9.5)}>{statusCfg.label}</span>
        {expiresIn &&
          (forecast.status === "active" || forecast.status === "near_expiry") && (
            <>
              <span style={{ color: VT.ashGhost, fontSize: 10 }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  fontWeight: 500,
                  color:
                    forecast.status === "near_expiry" ? VT.amber : VT.ashSoft,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {expiresIn}
              </span>
            </>
          )}

        {/* Preview-state toggle — opens the StatusPreviewBar below header */}
        <button
          type="button"
          onClick={() => {
            // Toggling re-enters its own bar via the parent; here we just
            // surface the intent. Bar visibility is owned by StatusPreviewBar.
            // We piggyback by toggling: if already overriding, reset; else
            // open the bar (which mounts always-visible-on-override).
            if (overrideStatus) {
              onOverrideStatus(null)
            } else {
              // open the bar by emitting a no-op-equivalent override (set to
              // current original) — bar reads `overrideStatus` to decide
              // whether to render "active picker" mode. To keep the UX
              // minimal we just nudge the bar open via a sibling state.
              window.dispatchEvent(new CustomEvent("forecast:status-preview:toggle"))
            }
          }}
          className="flex items-center gap-1 px-2 transition-colors cursor-pointer"
          style={{
            height: 22,
            borderRadius: 4,
            border: `1px solid ${overrideStatus ? rgba("245,158,11", 0.42) : VT.rule}`,
            background: overrideStatus ? rgba("245,158,11", 0.08) : "transparent",
            marginLeft: 6,
          }}
          onMouseEnter={(e) => {
            if (!overrideStatus) {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)"
              e.currentTarget.style.borderColor = VT.ruleSoft
            }
          }}
          onMouseLeave={(e) => {
            if (!overrideStatus) {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = VT.rule
            }
          }}
          aria-label={
            overrideStatus
              ? `Preview override active. Click to reset to ${originalStatus}.`
              : "Preview other forecast states"
          }
        >
          {overrideStatus ? (
            <RotateCcw size={9.5} strokeWidth={1.8} style={{ color: VT.amber }} />
          ) : (
            <Sparkles size={9.5} strokeWidth={1.8} style={{ color: VT.ashGhost }} />
          )}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 8.5,
              letterSpacing: "0.2em",
              fontWeight: 500,
              color: overrideStatus ? VT.amber : VT.ashSoft,
            }}
          >
            {overrideStatus ? "Reset" : "Preview"}
          </span>
        </button>
      </div>

      {/* spacer */}
      <div className="flex-1 min-w-[24px]" />

      {/* ───── ZONE C — Context + Actions ───── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* community / source pill */}
        <div
          className="flex items-center gap-1.5 px-2"
          style={{
            height: 22,
            borderRadius: 4,
            border: `1px solid ${VT.rule}`,
            background: VT.glassRecess,
          }}
        >
          <Users size={10} strokeWidth={1.6} style={{ color: VT.ashGhost }} />
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 500,
              color: VT.ash,
              letterSpacing: "-0.005em",
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {community}
          </span>
        </div>

        <ZoneDivider />

        <span style={eyebrow(VT.ashGhost, 9)}>{now}</span>

        <ZoneDivider />

        <div className="flex items-center gap-0.5">
          <ToolbarBtn icon={Copy} label="Copy Levels" />
          <ToolbarBtn icon={Bookmark} label="Save" />
          <ToolbarBtn icon={Share2} label="Share" />
          <ToolbarBtn icon={ExternalLink} label="Full Chart" />
        </div>

        <AnchorCircle />
      </div>
    </div>
  )
}

function ZoneDivider() {
  return (
    <div className="flex items-center px-2.5" aria-hidden>
      <div className="w-px h-3.5" style={{ background: VT.rule }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   STATUS PREVIEW BAR — visual-only lifecycle switcher
   ────────────────────────────────────────────────────────────────────────
   Lets the viewer flip the displayed lifecycle state without mutating
   the underlying forecast. Useful for content review, design QA, and
   for the author to see how their card will read once resolved.

     • Always renders when an override is active (so Reset is visible).
     • Otherwise, the bar opens via the FrameHeader's "Preview" button,
       which dispatches a window CustomEvent. The bar listens for that.
     • Selecting a chip sets the override; "Reset" clears it.
   ════════════════════════════════════════════════════════════════════════ */

const STATUS_PREVIEW_OPTIONS: {
  key: ForecastStatus
  label: string
  description: string
  rgb: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>
}[] = [
  { key: "active", label: "Live", description: "Idea is actionable now", rgb: "16,185,129", icon: Activity },
  { key: "near_expiry", label: "Near Expiry", description: "Closes within 4h", rgb: "245,158,11", icon: Hourglass },
  { key: "awaiting_resolution", label: "Awaiting", description: "Outcome being verified", rgb: "245,158,11", icon: Clock },
  { key: "resolved_win", label: "Won", description: "Target was hit", rgb: "16,185,129", icon: CheckCircle2 },
  { key: "resolved_loss", label: "Lost", description: "Stop loss was hit", rgb: "244,63,94", icon: XCircle },
  { key: "expired", label: "Expired", description: "Window closed flat", rgb: "148,163,184", icon: Timer },
  { key: "invalidated", label: "Invalidated", description: "Voided by conditions", rgb: "244,63,94", icon: AlertTriangle },
]

function StatusPreviewBar({
  originalStatus,
  activeStatus,
  overrideStatus,
  onOverrideStatus,
}: {
  originalStatus: ForecastStatus
  activeStatus: ForecastStatus
  overrideStatus: ForecastStatus | null
  onOverrideStatus: (s: ForecastStatus | null) => void
}) {
  const [open, setOpen] = useState(false)

  // Open whenever the FrameHeader emits the toggle event. Auto-open while
  // an override is active so the user can see/clear it.
  useEffect(() => {
    const handler = () => setOpen((p) => !p)
    window.addEventListener("forecast:status-preview:toggle", handler)
    return () =>
      window.removeEventListener("forecast:status-preview:toggle", handler)
  }, [])

  const visible = open || !!overrideStatus

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.24, ease: VT.easeOut }}
          style={{
            overflow: "hidden",
            borderBottom: `1px solid ${VT.rule}`,
            background:
              "linear-gradient(180deg, rgba(245,158,11,0.025) 0%, rgba(255,255,255,0) 100%), " +
              VT.glassRecess,
          }}
        >
          <div className="flex items-center gap-3 px-5 py-3 flex-wrap">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Sparkles size={11} strokeWidth={1.8} style={{ color: VT.amber }} />
              <span style={eyebrow(VT.amber, 9)}>Preview State</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_PREVIEW_OPTIONS.map((opt) => {
                const isActive = activeStatus === opt.key
                const isOriginal = originalStatus === opt.key
                const Icon = opt.icon
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      if (opt.key === originalStatus) {
                        onOverrideStatus(null)
                      } else {
                        onOverrideStatus(opt.key)
                      }
                    }}
                    title={opt.description}
                    className="flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-all"
                    style={{
                      height: 24,
                      borderRadius: 4,
                      border: `1px solid ${
                        isActive ? rgba(opt.rgb, 0.55) : VT.rule
                      }`,
                      background: isActive
                        ? rgba(opt.rgb, 0.12)
                        : "rgba(255,255,255,0.018)",
                      boxShadow: isActive ? `0 0 8px ${rgba(opt.rgb, 0.22)}` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = rgba(opt.rgb, 0.32)
                        e.currentTarget.style.background = rgba(opt.rgb, 0.05)
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = VT.rule
                        e.currentTarget.style.background = "rgba(255,255,255,0.018)"
                      }
                    }}
                  >
                    <Icon
                      size={10}
                      strokeWidth={1.8}
                      style={{ color: isActive ? `rgb(${opt.rgb})` : VT.ashSoft }}
                    />
                    <span
                      className="font-sans"
                      style={{
                        fontSize: 10.5,
                        fontWeight: 500,
                        color: isActive ? `rgb(${opt.rgb})` : VT.ash,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {opt.label}
                    </span>
                    {isOriginal && (
                      <span
                        className="font-mono uppercase ml-0.5"
                        style={{
                          fontSize: 7.5,
                          letterSpacing: "0.18em",
                          color: VT.ashGhost,
                        }}
                      >
                        og
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 min-w-[16px]" />

            {overrideStatus && (
              <button
                type="button"
                onClick={() => onOverrideStatus(null)}
                className="flex items-center gap-1.5 px-2 cursor-pointer transition-colors"
                style={{
                  height: 24,
                  borderRadius: 4,
                  border: `1px solid ${rgba("245,158,11", 0.32)}`,
                  background: rgba("245,158,11", 0.06),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = rgba("245,158,11", 0.12)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = rgba("245,158,11", 0.06)
                }}
              >
                <RotateCcw size={9.5} strokeWidth={1.8} style={{ color: VT.amber }} />
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 8.5,
                    letterSpacing: "0.2em",
                    fontWeight: 500,
                    color: VT.amber,
                  }}
                >
                  Reset to {originalStatus.replace("_", " ")}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center cursor-pointer transition-colors"
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                border: `1px solid ${VT.rule}`,
                background: "transparent",
              }}
              aria-label="Close preview bar"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                e.currentTarget.style.borderColor = VT.ruleSoft
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.borderColor = VT.rule
              }}
            >
              <XCircle size={11} strokeWidth={1.6} style={{ color: VT.ashSoft }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   EVIDENCE THEATER — premium chart frame
   ────────────────────────────────────────────────────────────────────────
   Wraps the existing WorkspaceChart with a top header strip
   (eyebrow + timeframe + session + live + tools) and a footer strip
   (replay scrubber + level toggles), plus refined floating level chips.
   ════════════════════════════════════════════════════════════════════════ */
function EvidenceTheater({
  forecast,
  dirColor,
  statusCfg,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  statusCfg: ReturnType<typeof getStatusConfig>
}) {
  const session = useMemo(() => deriveSession(new Date(forecast.createdAt)), [forecast.createdAt])
  const isLive = forecast.status === "active" || forecast.status === "near_expiry"

  /* level toggles — purely visual: flips opacity of floating chips */
  const [showEntry, setShowEntry] = useState(true)
  const [showSL, setShowSL] = useState(true)
  const [showTP, setShowTP] = useState(true)

  return (
    <div
      className="flex-shrink-0"
      style={{
        margin: 16,
        marginBottom: 0,
        padding: 1,
        borderRadius: 14,
        // Neutral charcoal frame with only a 1px direction-tinted top edge as polarity cue
        background: `linear-gradient(180deg, ${rgba(dirColor.rgb, 0.10)} 0%, ${VT.rule} 18%, ${VT.rule} 100%)`,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: "rgba(8,10,14,0.78)",
          borderRadius: 13,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035)",
        }}
      >
        {/* ── chart state ribbon (institutional) ── */}
        <div
          className="flex items-center gap-3 px-4 relative"
          style={{
            height: 30,
            borderBottom: `1px solid ${VT.rule}`,
            background: "rgba(255,255,255,0.012)",
          }}
        >
          {/* live status */}
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <motion.div
                className="rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  background: `rgb(${statusCfg.color})`,
                  boxShadow: `0 0 6px ${rgba(statusCfg.color, 0.7)}`,
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <span style={eyebrow(rgba(statusCfg.color, 0.85), 9)}>LIVE</span>
            </div>
          ) : (
            <span style={eyebrow(VT.ashSoft, 9)}>{statusCfg.label}</span>
          )}

          <ZoneDivider />

          {/* timeframe — tabular-nums mono, no pill */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 500,
              color: VT.paperDim,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.04em",
            }}
          >
            {forecast.timeframe}
          </span>

          <ZoneDivider />

          {/* session — labelled */}
          <div className="flex items-center gap-1.5" title={session.band}>
            <span style={eyebrow(VT.ashGhost, 9)}>Session</span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 500,
                color: VT.paperDim,
                letterSpacing: "0.04em",
              }}
            >
              {session.name}
            </span>
          </div>

          <ZoneDivider />

          {/* candle count (terminal feel) */}
          <div className="flex items-center gap-1.5">
            <span style={eyebrow(VT.ashGhost, 9)}>Bars</span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 500,
                color: VT.paperDim,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              48
            </span>
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* tools cluster (display-only) */}
          <div className="flex items-center gap-0.5">
            <TheaterToolBtn icon={Layers} label="Layers" />
            <TheaterToolBtn icon={Play} label="Replay" />
            <TheaterToolBtn icon={Maximize2} label="Fullscreen" />
          </div>
        </div>

        {/* ── chart body ── */}
        {/*
          Numbers are NOT shown here. Entry / SL / TP values live ONLY in the
          spec rail below. The chart shows the visual proof (lines + zones via
          WorkspaceChart's own SVG-rendered "TP / SL / Entry" labels). The
          right-edge legend column below shows just the level identity (E,
          SL, TP) so the user can read the chart without the values being
          duplicated as floating chips.
        */}
        <div
          className="relative flex"
          style={{ height: 260, background: "rgba(8,10,14,0.55)" }}
        >
          <div className="flex-1 relative">
            <WorkspaceChart forecast={forecast} dirColor={dirColor} />
          </div>

          {/* right-edge legend column — abbreviations only, no values */}
          <div
            className="flex flex-col flex-shrink-0"
            style={{
              width: 36,
              borderLeft: `1px solid ${VT.rule}`,
              background: "rgba(255,255,255,0.012)",
            }}
          >
            <ChartLegendTag
              label="TP"
              rgb={ACCENT.emerald.rgb}
              show={showTP}
            />
            <ChartLegendTag
              label="E"
              rgb="255,255,255"
              show={showEntry}
            />
            <ChartLegendTag
              label="SL"
              rgb={ACCENT.rose.rgb}
              show={showSL}
            />
          </div>
        </div>

        {/* ── theater footer strip ── */}
        <div
          className="flex items-center gap-3 px-4 relative"
          style={{
            height: 30,
            borderTop: `1px solid ${VT.rule}`,
            background:
              "linear-gradient(0deg, rgba(255,255,255,0.018) 0%, transparent 100%)",
          }}
        >
          {/* replay scrubber */}
          <span style={eyebrow(VT.ashGhost, 8.5)}>Replay</span>
          <div className="flex-1 relative" style={{ height: 18 }}>
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
              style={{
                height: 2,
                borderRadius: 999,
                background: VT.rule,
              }}
            />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2"
              style={{
                height: 2,
                width: "62%",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${rgba(dirColor.rgb, 0.4)}, ${rgba(dirColor.rgb, 0.7)})`,
              }}
            />
            {/* tick marks */}
            {[0, 50, 100].map((p) => (
              <div
                key={p}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{
                  left: `${p}%`,
                  width: 2,
                  height: 8,
                  borderRadius: 1,
                  background: VT.ruleStrong,
                }}
              />
            ))}
            {/* draggable handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
              style={{
                left: "62%",
                width: 10,
                height: 10,
                background: dirColor.hex,
                boxShadow: `0 0 0 1px rgba(0,0,0,0.4), 0 0 8px ${rgba(dirColor.rgb, 0.55)}`,
              }}
            />
          </div>

          <ZoneDivider />

          {/* level toggles */}
          <span style={eyebrow(VT.ashGhost, 8.5)}>Levels</span>
          <div className="flex items-center gap-1">
            <LevelToggle label="Entry" active={showEntry} onToggle={() => setShowEntry((v) => !v)} rgb="255,255,255" />
            <LevelToggle label="SL" active={showSL} onToggle={() => setShowSL((v) => !v)} rgb={ACCENT.rose.rgb} />
            <LevelToggle label="TP" active={showTP} onToggle={() => setShowTP((v) => !v)} rgb={ACCENT.emerald.rgb} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TheaterToolBtn({
  icon: Icon,
  label,
}: {
  icon: typeof Crosshair
  label: string
}) {
  return (
    <button
      title={label}
      className="flex items-center justify-center cursor-pointer transition-colors"
      style={{
        width: 22,
        height: 22,
        borderRadius: 3,
        background: "transparent",
        border: "1px solid transparent",
        color: VT.ashGhost,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)"
        e.currentTarget.style.borderColor = VT.rule
        e.currentTarget.style.color = VT.amber
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
        e.currentTarget.style.borderColor = "transparent"
        e.currentTarget.style.color = VT.ashGhost
      }}
    >
      <Icon size={11} strokeWidth={1.5} />
    </button>
  )
}

/* Right-edge legend column: a vertically-stacked abbreviation-only tag.
   No values; values live ONCE in the spec rail. */
function ChartLegendTag({
  label,
  rgb,
  show,
}: {
  label: string
  rgb: string
  show: boolean
}) {
  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0.22 }}
      transition={{ duration: 0.2, ease: VT.ease }}
      className="flex-1 flex items-center justify-center relative"
      style={{
        borderBottom: `1px solid ${VT.rule}`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 3,
          height: 14,
          borderRadius: "0 1.5px 1.5px 0",
          background: `rgb(${rgb})`,
          opacity: show ? 0.85 : 0.25,
        }}
      />
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.16em",
          fontWeight: 500,
          color: rgba(rgb, show ? 0.95 : 0.4),
        }}
      >
        {label}
      </span>
    </motion.div>
  )
}

function LevelToggle({
  label,
  active,
  onToggle,
  rgb,
}: {
  label: string
  active: boolean
  onToggle: () => void
  rgb: string
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 px-1.5 cursor-pointer transition-colors"
      style={{
        height: 18,
        borderRadius: 3,
        border: `1px solid ${active ? rgba(rgb, 0.32) : VT.rule}`,
        background: active ? rgba(rgb, 0.08) : "transparent",
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: 4,
          height: 4,
          background: active ? `rgb(${rgb})` : VT.ashGhost,
          opacity: active ? 1 : 0.4,
        }}
      />
      <span
        style={{
          ...eyebrow(active ? VT.paper : VT.ashSoft, 8.5),
          letterSpacing: "0.2em",
        }}
      >
        {label}
      </span>
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   SPEC HEADLINE RAIL — protagonist numbers + plan integrity
   ════════════════════════════════════════════════════════════════════════ */
function SpecHeadlineRail({
  forecast,
  dirColor,
  projectedMove,
  riskRewardDistances,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  projectedMove: string | null
  riskRewardDistances: { risk: string; reward: string } | null
}) {
  /*
    EXECUTION SPEC — single canonical home for numeric trade plan.
    Numbers live ONLY here. The chart shows visual proof (lines + zones);
    the legend column shows level identity. No duplication.
  */
  const cells: { label: string; value: string; color: string }[] = [
    { label: "Entry", value: forecast.entry, color: VT.paper },
    { label: "Stop", value: forecast.stopLoss, color: ACCENT.rose.hex },
    { label: "Target", value: forecast.takeProfit, color: ACCENT.emerald.hex },
    { label: "R : R", value: forecast.riskReward, color: VT.amber },
  ]
  if (projectedMove) {
    cells.push({ label: "Move", value: projectedMove, color: dirColor.hex })
  }

  return (
    <div className="flex-shrink-0 px-5 pt-5 pb-4">
      {/* ── eyebrow row — section header (institutional, mono-caps) ── */}
      <div className="flex items-center gap-3 mb-4">
        <span style={eyebrow(VT.ashSoft, 9.5)}>Execution Spec</span>
        <div
          className="h-px flex-1"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        {riskRewardDistances && (
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1.5">
              <span style={eyebrow(VT.ashGhost, 9)}>Risk Δ</span>
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 10.5,
                  fontWeight: 500,
                  color: rgba(ACCENT.rose.rgb, 0.85),
                  letterSpacing: "-0.01em",
                }}
              >
                {riskRewardDistances.risk}
              </span>
            </div>
            <div
              className="w-px self-stretch"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <div className="flex items-baseline gap-1.5">
              <span style={eyebrow(VT.ashGhost, 9)}>Reward Δ</span>
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 10.5,
                  fontWeight: 500,
                  color: rgba(ACCENT.emerald.rgb, 0.85),
                  letterSpacing: "-0.01em",
                }}
              >
                {riskRewardDistances.reward}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── primary spec row — equal cells, generous breathing room ── */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
        {cells.map((c) => (
          <div
            key={c.label}
            className="flex flex-col items-start gap-2"
          >
            <span style={eyebrow(VT.ashGhost, 9)}>{c.label}</span>
            <span style={numStyle(c.color, 20, 500)}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   COMMUNITY VOTE BAR — interactive sentiment under the spec rail
   ────────────────────────────────────────────────────────────────────────
   Sits where the Plan Integrity ribbon used to live. Three semantic
   actions for the viewer:

     • Agree  — endorse the call (bullish on the trade idea)
     • Watch  — mark as interesting but not committed
     • Fade   — actively disagree / counter-trade

   Each button is clickable, single-select, and toggleable. Selecting a
   vote increments that bucket and visually fills the button. The
   sentiment bar on the right reflects the live distribution. Numbers
   are seeded deterministically from the forecast id so the same idea
   always shows the same baseline before user interaction.
   ════════════════════════════════════════════════════════════════════════ */
type VoteKey = "agree" | "watch" | "fade"

function CommunityVoteBar({
  forecast,
  dirColor,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
}) {
  // Local user vote — null means "haven't voted yet"
  const [myVote, setMyVote] = useState<VoteKey | null>(null)

  // Deterministic baseline tallies from the forecast id (so the bar feels
  // like a real, populated community read on first render).
  const baseline = useMemo(() => {
    const seed = (forecast.id ?? "x").charCodeAt(0) + (forecast.likes ?? 0)
    const total = Math.max(12, (forecast.likes ?? 0) + 18)
    const agree = Math.floor(total * (0.46 + ((seed % 19) / 100)))
    const watch = Math.floor(total * (0.18 + ((seed % 13) / 100)))
    const fade = Math.max(2, total - agree - watch)
    return { agree, watch, fade }
  }, [forecast.id, forecast.likes])

  // Live tallies = baseline + 1 for whichever bucket the viewer chose
  const tallies = useMemo(() => {
    const t = { ...baseline }
    if (myVote) t[myVote] += 1
    return t
  }, [baseline, myVote])

  const total = tallies.agree + tallies.watch + tallies.fade
  const pct = {
    agree: (tallies.agree / total) * 100,
    watch: (tallies.watch / total) * 100,
    fade: (tallies.fade / total) * 100,
  }

  const verdict =
    pct.agree >= 55
      ? "Crowd is leaning with this call"
      : pct.fade >= 45
        ? "Crowd is leaning against this call"
        : "Room is split"
  const verdictColor =
    pct.agree >= 55
      ? ACCENT.emerald.hex
      : pct.fade >= 45
        ? ACCENT.rose.hex
        : VT.ashSoft

  const handleVote = (k: VoteKey) => setMyVote((prev) => (prev === k ? null : k))

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      {/* eyebrow row */}
      <div className="flex items-center gap-2.5">
        <Users size={10} strokeWidth={1.7} style={{ color: VT.ashGhost }} />
        <span style={eyebrow(VT.ashSoft, 9.5)}>Community Vote</span>
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            fontWeight: 500,
            color: verdictColor,
            letterSpacing: "0.005em",
          }}
        >
          {verdict}
        </span>
        <span style={{ color: VT.ashGhost, fontSize: 10 }}>·</span>
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: VT.paperDim,
            letterSpacing: "-0.005em",
          }}
        >
          {total}
        </span>
        <span style={eyebrow(VT.ashGhost, 8.5)}>Votes</span>
      </div>

      {/* vote buttons + sentiment bar */}
      <div className="flex items-stretch gap-2">
        {/* Vote buttons (segmented) */}
        <div
          className="flex items-stretch flex-shrink-0"
          style={{
            borderRadius: 5,
            border: `1px solid ${VT.rule}`,
            background: "rgba(255,255,255,0.018)",
            overflow: "hidden",
          }}
        >
          <VoteButton
            icon={ThumbsUp}
            label="Agree"
            count={tallies.agree}
            pct={pct.agree}
            color={ACCENT.emerald.hex}
            rgb={ACCENT.emerald.rgb}
            isActive={myVote === "agree"}
            onClick={() => handleVote("agree")}
          />
          <div className="w-px self-stretch" style={{ background: VT.rule }} />
          <VoteButton
            icon={Eye}
            label="Watch"
            count={tallies.watch}
            pct={pct.watch}
            color={VT.amber}
            rgb="245,158,11"
            isActive={myVote === "watch"}
            onClick={() => handleVote("watch")}
          />
          <div className="w-px self-stretch" style={{ background: VT.rule }} />
          <VoteButton
            icon={ThumbsDown}
            label="Fade"
            count={tallies.fade}
            pct={pct.fade}
            color={ACCENT.rose.hex}
            rgb={ACCENT.rose.rgb}
            isActive={myVote === "fade"}
            onClick={() => handleVote("fade")}
          />
        </div>

        {/* Sentiment distribution bar */}
        <div
          className="flex-1 flex flex-col justify-center gap-1.5 pl-1"
          aria-label={`${tallies.agree} agree, ${tallies.watch} watch, ${tallies.fade} fade`}
        >
          <div
            className="flex relative overflow-hidden"
            style={{
              height: 6,
              borderRadius: 999,
              background: VT.ruleStrong,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct.agree}%` }}
              transition={{ duration: 0.5, ease: VT.easeOut }}
              style={{
                background: `linear-gradient(90deg, ${rgba(ACCENT.emerald.rgb, 0.6)}, ${rgba(ACCENT.emerald.rgb, 0.92)})`,
                boxShadow: `inset 0 0 4px ${rgba(ACCENT.emerald.rgb, 0.4)}`,
              }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct.watch}%` }}
              transition={{ duration: 0.5, ease: VT.easeOut, delay: 0.05 }}
              style={{ background: rgba("245,158,11", 0.62) }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct.fade}%` }}
              transition={{ duration: 0.5, ease: VT.easeOut, delay: 0.1 }}
              style={{
                background: `linear-gradient(90deg, ${rgba(ACCENT.rose.rgb, 0.62)}, ${rgba(ACCENT.rose.rgb, 0.92)})`,
                boxShadow: `inset 0 0 4px ${rgba(ACCENT.rose.rgb, 0.4)}`,
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <SentimentLegend label="Agree" pct={pct.agree} color={ACCENT.emerald.hex} />
            <SentimentLegend label="Watch" pct={pct.watch} color={VT.amber} />
            <SentimentLegend label="Fade" pct={pct.fade} color={ACCENT.rose.hex} />
            <div className="flex-1" />
            {myVote && (
              <button
                type="button"
                onClick={() => setMyVote(null)}
                className="cursor-pointer transition-colors"
                style={{
                  ...eyebrow(VT.ashSoft, 8.5),
                  letterSpacing: "0.18em",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = VT.paper
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = VT.ashSoft
                }}
              >
                Clear vote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VoteButton({
  icon: Icon,
  label,
  count,
  pct,
  color,
  rgb,
  isActive,
  onClick,
}: {
  icon: LucideIcon
  label: string
  count: number
  pct: number
  color: string
  rgb: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 cursor-pointer transition-all relative"
      style={{
        height: 32,
        background: isActive ? rgba(rgb, 0.14) : "transparent",
        boxShadow: isActive ? `inset 0 0 0 1px ${rgba(rgb, 0.4)}` : "none",
        minWidth: 90,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          ;(e.currentTarget as HTMLButtonElement).style.background = rgba(rgb, 0.06)
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
        }
      }}
      aria-pressed={isActive}
      aria-label={`${label} — ${count} votes, ${pct.toFixed(0)}%`}
    >
      <Icon
        size={11}
        strokeWidth={isActive ? 2 : 1.6}
        style={{ color: isActive ? color : VT.ashSoft, flexShrink: 0 }}
      />
      <span
        className="font-sans"
        style={{
          fontSize: 11,
          fontWeight: isActive ? 600 : 500,
          color: isActive ? color : VT.paperDim,
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </span>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 10.5,
          fontWeight: 500,
          color: isActive ? rgba(rgb, 0.85) : VT.ashSoft,
          letterSpacing: "-0.01em",
          marginLeft: "auto",
        }}
      >
        {count}
      </span>
    </button>
  )
}

function SentimentLegend({
  label,
  pct,
  color,
}: {
  label: string
  pct: number
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="rounded-full"
        style={{
          width: 4,
          height: 4,
          background: color,
          boxShadow: `0 0 4px ${color}66`,
        }}
      />
      <span style={eyebrow(VT.ashGhost, 8.5)}>{label}</span>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 10,
          fontWeight: 500,
          color,
          letterSpacing: "-0.01em",
        }}
      >
        {pct.toFixed(0)}%
      </span>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   DISCUSSION ROOM — structured community intelligence
   ────────────────────────────────────────────────────────────────────────
   Header (anchor + count + heart/eye + filter chips)
   Mentor Review block (amber edge, crown overlay, ribbon)
   Author Update strip (cyan edge — only when latest commenter is the author)
   Pinned thread (only if forecast.pinnedComment exists — defensive)
   Sample comments with role badges + reply affordance + reactions
   ════════════════════════════════════════════════════════════════════════ */
function DiscussionRoom({
  forecast,
  dirColor,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
}) {
  const [activeFilter, setActiveFilter] = useState<"all" | "mentor" | "author" | "pinned">("all")

  /* deterministic sample comments — same shape as before */
  const sampleComments = [
    {
      name: "TraderJake",
      initial: "T",
      text: "Clean setup. I'm watching the same level on the 1H.",
      time: "12m ago",
      reactions: 4,
    },
    {
      name: "CryptoNova",
      initial: "C",
      text: "Good R:R. What's your position size on this?",
      time: "28m ago",
      reactions: 2,
    },
  ].slice(0, Math.max(forecast.comments, 1))

  /* author-update detection */
  const authorName = forecast.user?.name ?? ""
  const latestIsAuthor = sampleComments.length > 0 && sampleComments[0].name === authorName

  /* optional pinned comment from the data layer (read defensively) */
  const pinned = (forecast as unknown as { pinnedComment?: { name: string; text: string; time: string } }).pinnedComment

  return (
    <div className="flex-1 px-5 pt-4 pb-5">
      {/* ── Discussion header — institutional bar with proper hierarchy ── */}
      <DiscussionHeaderBar
        forecast={forecast}
        dirColor={dirColor}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        mentorCount={forecast.mentorReview ? 1 : 0}
        authorCount={latestIsAuthor ? 1 : 0}
        pinnedCount={pinned ? 1 : 0}
      />

      {/* ── mentor review (elevated) ── */}
      {forecast.mentorReview && (activeFilter === "all" || activeFilter === "mentor") && (
        <MentorReviewBlock review={forecast.mentorReview} />
      )}

      {/* ── author update strip ── */}
      {latestIsAuthor && (activeFilter === "all" || activeFilter === "author") && (
        <AuthorUpdateRibbon
          name={authorName}
          text={sampleComments[0].text}
          time={sampleComments[0].time}
        />
      )}

      {/* ── pinned thread ── */}
      {pinned && (activeFilter === "all" || activeFilter === "pinned") && (
        <PinnedBlock name={pinned.name} text={pinned.text} time={pinned.time} />
      )}

      {/* ── sample comments ── */}
      <div className="flex flex-col">
        {sampleComments
          .filter((c, i) => {
            if (activeFilter === "all") return !(latestIsAuthor && i === 0)
            if (activeFilter === "author") return false // already shown via ribbon
            if (activeFilter === "pinned") return false
            if (activeFilter === "mentor") return false
            return true
          })
          .map((c, i, arr) => (
            <CommentRow key={i} comment={c} isLast={i === arr.length - 1} />
          ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   DISCUSSION HEADER BAR — institutional toolbar
   ────────────────────────────────────────────────────────────────────────
   Three clean groupings with proper visual rhythm:

     LEFT     icon · title · count badge
     CENTER   segmented filter control (counts inside chips)
     RIGHT    metric pills (likes · views) on a recessed surface

   Replaces the old loose row of mixed text and chips. The filter is
   now a true segmented control with continuous internal dividers, the
   chip labels render in sentence-case, and counts are surfaced inline
   so the user knows how many entries each filter will reveal.
   ════════════════════════════════════════════════════════════════════════ */
function DiscussionHeaderBar({
  forecast,
  dirColor,
  activeFilter,
  onFilterChange,
  mentorCount,
  authorCount,
  pinnedCount,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  activeFilter: "all" | "mentor" | "author" | "pinned"
  onFilterChange: (k: "all" | "mentor" | "author" | "pinned") => void
  mentorCount: number
  authorCount: number
  pinnedCount: number
}) {
  const filters = [
    { k: "all" as const, label: "All", count: forecast.comments },
    { k: "mentor" as const, label: "Mentor", count: mentorCount },
    { k: "author" as const, label: "Author", count: authorCount },
    { k: "pinned" as const, label: "Pinned", count: pinnedCount },
  ]

  return (
    <div
      className="flex items-center gap-4 mb-4 px-3 py-2"
      style={{
        borderRadius: 10,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      {/* ── LEFT — title cluster ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="flex items-center justify-center"
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            background: rgba(dirColor.rgb, 0.08),
            border: `1px solid ${rgba(dirColor.rgb, 0.18)}`,
          }}
        >
          <MessageSquare
            size={11}
            strokeWidth={1.8}
            style={{ color: rgba(dirColor.rgb, 0.85) }}
          />
        </div>
        <span
          className="font-sans"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: VT.paper,
            letterSpacing: "-0.01em",
          }}
        >
          Discussion
        </span>
        <span
          className="font-sans tabular-nums px-1.5"
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: VT.paperDim,
            background: VT.glassRecess,
            border: `1px solid ${VT.ruleSoft}`,
            borderRadius: 999,
            height: 16,
            display: "inline-flex",
            alignItems: "center",
            letterSpacing: "-0.01em",
          }}
        >
          {forecast.comments}
        </span>
      </div>

      {/* ── CENTER — segmented filter control ── */}
      <div
        className="flex items-stretch flex-shrink-0"
        style={{
          height: 24,
          borderRadius: 5,
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
          padding: 2,
          gap: 1,
        }}
        role="tablist"
        aria-label="Filter discussion"
      >
        {filters.map((f) => {
          const isActive = activeFilter === f.k
          const isDisabled = f.count === 0 && f.k !== "all"
          return (
            <button
              key={f.k}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              onClick={() => !isDisabled && onFilterChange(f.k)}
              className="flex items-center gap-1.5 px-2 transition-all"
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
                height: "100%",
                borderRadius: 3,
                background: isActive
                  ? rgba(dirColor.rgb, 0.16)
                  : "transparent",
                boxShadow: isActive
                  ? `inset 0 0 0 1px ${rgba(dirColor.rgb, 0.32)}`
                  : "none",
                opacity: isDisabled ? 0.35 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isDisabled) {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.04)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !isDisabled) {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    "transparent"
                }
              }}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 10.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? rgba(dirColor.rgb, 0.95)
                    : VT.ashSoft,
                  letterSpacing: "-0.005em",
                }}
              >
                {f.label}
              </span>
              {f.count > 0 && (
                <span
                  className="font-sans tabular-nums"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 500,
                    color: isActive ? rgba(dirColor.rgb, 0.7) : VT.ashGhost,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1" />

      {/* ── RIGHT — engagement metric pills ── */}
      <div
        className="flex items-stretch flex-shrink-0"
        style={{
          height: 24,
          borderRadius: 5,
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
          overflow: "hidden",
        }}
      >
        <MetricPill
          icon={Heart}
          value={forecast.likes}
          color={ACCENT.rose.hex}
          label="Likes"
        />
        <div className="w-px self-stretch" style={{ background: VT.rule }} />
        <MetricPill
          icon={Eye}
          value={forecast.views}
          color={VT.paperDim}
          label="Views"
        />
      </div>
    </div>
  )
}

function MetricPill({
  icon: Icon,
  value,
  color,
  label,
}: {
  icon: LucideIcon
  value: number
  color: string
  label: string
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2"
      title={`${value} ${label.toLowerCase()}`}
    >
      <Icon size={10} strokeWidth={1.7} style={{ color, opacity: 0.85 }} />
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 10.5,
          fontWeight: 500,
          color: VT.paper,
          letterSpacing: "-0.01em",
        }}
      >
        {formatMetricValue(value)}
      </span>
    </div>
  )
}

function formatMetricValue(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return n.toLocaleString()
}

function MentorReviewBlock({
  review,
}: {
  review: NonNullable<ForecastItem["mentorReview"]>
}) {
  const [expanded, setExpanded] = useState(false)

  // ── Synthesize a full-review payload deterministically from the review
  //    payload. No backend mutation. Stable across renders.
  const detail = useMemo(() => buildMentorReviewDetail(review), [review])

  return (
    <div
      className="flex gap-3 pl-3 pr-3 py-3 mb-3 relative"
      style={{
        borderLeft: `2px solid ${VT.amber}`,
        background: VT.amberWash,
        borderRadius: 4,
      }}
    >
      {/* avatar with crown overlay */}
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{
            background: amber(0.12),
            border: `1px solid ${amber(0.28)}`,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 600,
              color: VT.amber,
            }}
          >
            {(review.mentorName ?? "?").charAt(0)}
          </span>
        </div>
        <div
          className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
          style={{
            width: 13,
            height: 13,
            background: VT.amber,
            border: "1.5px solid rgba(7,9,13,0.95)",
            boxShadow: `0 0 6px ${amber(0.45)}`,
          }}
          aria-hidden
        >
          <Crown size={7} strokeWidth={2.2} style={{ color: "#1a1208" }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          {/* ribbon: MENTOR REVIEW · rating/10 */}
          <div
            className="flex items-center gap-1.5 px-1.5"
            style={{
              height: 16,
              borderRadius: 3,
              background: amber(0.14),
              border: `1px solid ${amber(0.32)}`,
            }}
          >
            <span style={{ ...eyebrow(VT.amber, 8.5), letterSpacing: "0.2em" }}>
              Mentor Review
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 9,
                fontWeight: 600,
                color: VT.amber,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {review.rating}/10
            </span>
          </div>

          <span
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: VT.paper,
              letterSpacing: "-0.005em",
            }}
          >
            {review.mentorName}
          </span>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 cursor-pointer transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = VT.amber
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = expanded ? VT.amber : VT.ashSoft
            }}
            style={{ color: expanded ? VT.amber : VT.ashSoft }}
          >
            <span
              style={{
                ...eyebrow("currentColor", 8.5),
                letterSpacing: "0.18em",
              }}
            >
              {expanded ? "Hide Full Review" : "View Full Review"}
            </span>
            <ChevronDown
              size={10}
              strokeWidth={1.8}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.22s ease",
              }}
            />
          </button>
        </div>

        <p
          style={{
            fontSize: 11.5,
            lineHeight: 1.6,
            color: VT.paperDim,
          }}
        >
          {review.feedback}
        </p>

        {/* ── Expanded full review ── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="mt-3 px-3 py-3 flex flex-col gap-4"
                style={{
                  borderRadius: 6,
                  background: "rgba(245,158,11,0.04)",
                  border: `1px solid ${amber(0.18)}`,
                }}
              >
                {/* Rating breakdown */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span style={{ ...eyebrow(VT.amber, 9), letterSpacing: "0.18em" }}>
                      Rating Breakdown
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={9.5} strokeWidth={1.8} style={{ color: VT.amber, fill: VT.amber }} />
                      <span
                        className="font-sans tabular-nums"
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: VT.amber,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {review.rating.toFixed(1)} / 10
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {detail.criteria.map((c) => (
                      <CriteriaRow key={c.label} label={c.label} score={c.score} />
                    ))}
                  </div>
                </div>

                {/* Working / Fixing two-column */}
                <div className="grid grid-cols-2 gap-3">
                  <ReviewList
                    title="Working"
                    items={detail.working}
                    color={ACCENT.emerald.hex}
                    rgb={ACCENT.emerald.rgb}
                  />
                  <ReviewList
                    title="To improve"
                    items={detail.fixing}
                    color={ACCENT.rose.hex}
                    rgb={ACCENT.rose.rgb}
                  />
                </div>

                {/* Reviewer note */}
                <div
                  className="flex flex-col gap-1.5 px-2.5 py-2"
                  style={{
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.022)",
                    border: `1px solid ${VT.rule}`,
                  }}
                >
                  <span style={{ ...eyebrow(VT.ashSoft, 8.5), letterSpacing: "0.18em" }}>
                    Reviewer note
                  </span>
                  <p
                    style={{
                      fontSize: 11.5,
                      lineHeight: 1.6,
                      color: VT.paper,
                      letterSpacing: "0.005em",
                    }}
                  >
                    {detail.note}
                  </p>
                </div>

                {/* Reviewer credentials footer */}
                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}
                >
                  <div className="flex items-center gap-2">
                    <Crown size={10} strokeWidth={1.8} style={{ color: VT.amber }} />
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 500,
                        color: VT.paper,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {review.mentorName}
                    </span>
                    <span style={{ color: VT.ashGhost, fontSize: 10 }}>·</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: VT.ashSoft,
                        letterSpacing: "0.005em",
                      }}
                    >
                      {detail.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-sans tabular-nums"
                      style={{
                        fontSize: 10,
                        color: VT.paperDim,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {detail.totalReviews} reviews
                    </span>
                    <span style={{ color: VT.ashGhost, fontSize: 10 }}>·</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: VT.ashSoft,
                        letterSpacing: "0.005em",
                      }}
                    >
                      since {detail.mentorSince}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Mentor review breakdown atoms + synth ───────────────────────────── */

function CriteriaRow({ label, score }: { label: string; score: number }) {
  const color = score >= 8 ? ACCENT.emerald.hex : score >= 6 ? VT.amber : ACCENT.rose.hex
  const rgb = score >= 8 ? ACCENT.emerald.rgb : score >= 6 ? "245,158,11" : ACCENT.rose.rgb
  return (
    <div className="flex items-center gap-2.5">
      <span
        style={{
          fontSize: 10.5,
          color: VT.paper,
          letterSpacing: "-0.005em",
          width: 110,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          height: 3,
          borderRadius: 2,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${rgba(rgb, 0.5)}, ${color})`,
            boxShadow: `0 0 6px ${rgba(rgb, 0.32)}`,
          }}
        />
      </div>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 10.5,
          fontWeight: 500,
          color,
          width: 28,
          textAlign: "right",
          letterSpacing: "-0.01em",
        }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  )
}

function ReviewList({
  title,
  items,
  color,
  rgb,
}: {
  title: string
  items: string[]
  color: string
  rgb: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span
          className="rounded-full"
          style={{
            width: 5,
            height: 5,
            background: color,
            boxShadow: `0 0 5px rgba(${rgb},0.55)`,
          }}
        />
        <span style={{ ...eyebrow(color, 8.5), letterSpacing: "0.18em" }}>
          {title}
        </span>
      </div>
      <ul className="flex flex-col gap-1 pl-3">
        {items.map((it, i) => (
          <li
            key={i}
            style={{
              fontSize: 11,
              lineHeight: 1.55,
              color: VT.paperDim,
              letterSpacing: "0.005em",
              listStyle: "none",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: -10,
                top: 7,
                width: 4,
                height: 1,
                background: rgba(rgb, 0.5),
              }}
              aria-hidden
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function buildMentorReviewDetail(
  review: NonNullable<ForecastItem["mentorReview"]>,
) {
  // Stable seed from mentorId + reviewedAt
  const seedStr = (review.mentorId ?? "") + (review.reviewedAt ?? "")
  let seed = 0
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0
  }
  const r = (offset: number, span: number) =>
    ((seed + offset) % 100) / 100 * span

  const base = review.rating
  // Generate 5 criteria scores that average roughly to the headline rating.
  // Each is in the 0-10 scale, jittered by ~1 point either way.
  const criteria = [
    { label: "Setup quality", score: clampScore(base + r(7, 1.6) - 0.7) },
    { label: "Risk management", score: clampScore(base + r(13, 1.4) - 0.6) },
    { label: "Entry timing", score: clampScore(base + r(19, 1.8) - 1.0) },
    { label: "Reasoning depth", score: clampScore(base + r(23, 1.4) - 0.5) },
    { label: "Market context", score: clampScore(base + r(29, 1.6) - 0.8) },
  ]

  // Working / fixing pools — pick 2-3 of each deterministically
  const workingPool = [
    "Clear bias with explicit confluence chain",
    "Risk-reward profile is asymmetric and well-defined",
    "Entry placed at logical structural level, not chasing",
    "Invalidation level is unambiguous and respected",
    "Higher-timeframe alignment is acknowledged",
    "Position sizing language is appropriate for setup",
    "Thesis is falsifiable, not vague directional bias",
  ]
  const fixingPool = [
    "Consider tighter trigger to avoid premature entry",
    "Higher-timeframe context could be more explicit",
    "Stop placement is wider than necessary for this RR",
    "Confluence count is thin — needs another factor",
    "Session timing is suboptimal for the chosen pair",
    "Target ladder would help capture partial profit",
    "Spread cost on this instrument deserves a callout",
  ]
  const working = pickN(workingPool, seed, 3)
  const fixing = pickN(fixingPool, seed >> 3, 2 + (seed % 2))

  // Longer-form note — synthesized from the existing feedback + criteria
  const lowestCriterion = [...criteria].sort((a, b) => a.score - b.score)[0]
  const highestCriterion = [...criteria].sort((a, b) => b.score - a.score)[0]
  const note =
    `${review.feedback} The strongest dimension here is ${highestCriterion.label.toLowerCase()} (${highestCriterion.score.toFixed(1)}/10), while ${lowestCriterion.label.toLowerCase()} is the most actionable area to refine (${lowestCriterion.score.toFixed(1)}/10). ` +
    (review.rating >= 8
      ? "Overall this is a high-conviction submission worth following closely."
      : review.rating >= 6
        ? "Solid submission with clear edges, but margin remains for refinement."
        : "Treat this as a learning case; the core idea is workable but execution risk is elevated.")

  // Reviewer credential footer — synthesized
  const titlePool = [
    "Senior Mentor",
    "Lead Mentor · ICT Track",
    "Senior Mentor · Crypto Desk",
    "Head Mentor · Funded Trader Program",
  ]
  const title = titlePool[seed % titlePool.length]
  const totalReviews = 80 + (seed % 320)
  const monthsAgo = 12 + (seed % 30)
  const since = new Date()
  since.setMonth(since.getMonth() - monthsAgo)
  const mentorSince = since.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  return { criteria, working, fixing, note, title, totalReviews, mentorSince }
}

function clampScore(n: number) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10))
}

function pickN<T>(pool: T[], seed: number, n: number): T[] {
  const out: T[] = []
  const used = new Set<number>()
  let s = seed
  while (out.length < n && used.size < pool.length) {
    s = (s * 1103515245 + 12345) >>> 0
    const idx = s % pool.length
    if (!used.has(idx)) {
      used.add(idx)
      out.push(pool[idx])
    }
  }
  return out
}

function AuthorUpdateRibbon({
  name,
  text,
  time,
}: {
  name: string
  text: string
  time: string
}) {
  return (
    <div
      className="flex gap-3 pl-3 pr-3 py-3 mb-3"
      style={{
        borderLeft: `2px solid ${rgba(VT.cyanRgb, 0.85)}`,
        background: rgba(VT.cyanRgb, 0.05),
        borderRadius: 4,
      }}
    >
      <div
        className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
        style={{
          background: rgba(VT.cyanRgb, 0.1),
          border: `1px solid ${rgba(VT.cyanRgb, 0.28)}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            color: VT.cyan,
          }}
        >
          {(name ?? "?").charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex items-center px-1.5"
            style={{
              height: 16,
              borderRadius: 3,
              background: rgba(VT.cyanRgb, 0.14),
              border: `1px solid ${rgba(VT.cyanRgb, 0.32)}`,
            }}
          >
            <span style={{ ...eyebrow(VT.cyan, 8.5), letterSpacing: "0.2em" }}>
              Author Update
            </span>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: VT.paper }}>{name}</span>
          <span style={eyebrow(VT.ashGhost, 8.5)}>{time}</span>
        </div>
        <p style={{ fontSize: 11.5, lineHeight: 1.6, color: VT.paperDim }}>{text}</p>
      </div>
    </div>
  )
}

function PinnedBlock({ name, text, time }: { name: string; text: string; time: string }) {
  return (
    <div
      className="flex gap-3 pl-3 pr-3 py-3 mb-3"
      style={{
        borderLeft: `2px solid ${rgba("255,255,255", 0.22)}`,
        background: "rgba(255,255,255,0.018)",
        borderRadius: 4,
      }}
    >
      <div
        className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
        style={{
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
        }}
      >
        <Pin size={11} strokeWidth={1.8} style={{ color: VT.ashSoft }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ ...eyebrow(VT.ashSoft, 8.5), letterSpacing: "0.22em" }}>Pinned</span>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: VT.paper }}>{name}</span>
          <span style={eyebrow(VT.ashGhost, 8.5)}>{time}</span>
        </div>
        <p style={{ fontSize: 11.5, lineHeight: 1.6, color: VT.paperDim }}>{text}</p>
      </div>
    </div>
  )
}

function CommentRow({
  comment,
  isLast,
}: {
  comment: { name: string; initial: string; text: string; time: string; reactions: number }
  isLast: boolean
}) {
  const role = deriveCommenterRole(comment.name)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start gap-3 py-3.5"
      style={{
        borderBottom: !isLast ? "1px dashed rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div
        className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: VT.glassRecess,
          border: `1px solid ${VT.rule}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 500,
            color: VT.ash,
          }}
        >
          {comment.initial}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: VT.paperDim,
              letterSpacing: "-0.005em",
            }}
          >
            {comment.name}
          </span>

          <RoleBadge role={role} />

          <span style={eyebrow(VT.ashGhost, 8.5)}>{comment.time}</span>
        </div>

        <p
          style={{
            fontSize: 11.5,
            lineHeight: 1.6,
            color: VT.ash,
          }}
        >
          {comment.text}
        </p>

        {/* reaction + reply micro-row */}
        <div className="flex items-center gap-3 mt-1.5">
          <button
            className="flex items-center gap-1 cursor-pointer transition-colors"
            style={{ color: VT.ashGhost }}
            onMouseEnter={(e) => (e.currentTarget.style.color = VT.rose)}
            onMouseLeave={(e) => (e.currentTarget.style.color = VT.ashGhost)}
          >
            <Heart size={10} strokeWidth={1.6} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 9.5,
                fontWeight: 500,
                color: "currentColor",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {comment.reactions}
            </span>
          </button>

          <motion.button
            initial={false}
            animate={{ opacity: hovered ? 1 : 0.55 }}
            className="flex items-center gap-1 cursor-pointer transition-colors"
            style={{ color: VT.ashGhost }}
            onMouseEnter={(e) => (e.currentTarget.style.color = VT.amber)}
            onMouseLeave={(e) => (e.currentTarget.style.color = VT.ashGhost)}
          >
            <Reply size={10} strokeWidth={1.6} />
            <span style={{ ...eyebrow("currentColor", 8.5), letterSpacing: "0.2em" }}>Reply</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: "MENTOR" | "PRO" | "MEMBER" }) {
  const cfg =
    role === "MENTOR"
      ? { rgb: VT.amberRgb, label: "Mentor" }
      : role === "PRO"
        ? { rgb: VT.blueRgb, label: "Pro" }
        : { rgb: VT.slate, label: "Member" }
  return (
    <div
      className="flex items-center px-1.5"
      style={{
        height: 14,
        borderRadius: 3,
        background: rgba(cfg.rgb, 0.08),
        border: `1px solid ${rgba(cfg.rgb, 0.22)}`,
      }}
    >
      <span
        style={{
          ...eyebrow(rgba(cfg.rgb, 0.95), 8),
          letterSpacing: "0.2em",
        }}
      >
        {cfg.label}
      </span>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED PIECES
   ════════════════════════════════════════════════════════════════════════ */
function AnchorCircle() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
      <circle cx="3" cy="3" r="2.4" fill="none" stroke={amber(0.5)} strokeWidth="0.7" />
    </svg>
  )
}

function MetaPill({
  label,
  value,
  rgb,
  bright,
}: {
  label: string
  value: string
  rgb: string
  bright?: boolean
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 500,
          color: rgba(rgb, bright ? 0.85 : 0.65),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <span style={eyebrow(rgba(rgb, 0.5), 8.5)}>{label}</span>
    </div>
  )
}

function ToolbarBtn({ icon: Icon, label }: { icon: typeof Copy; label: string }) {
  return (
    <button
      title={label}
      className="flex items-center justify-center cursor-pointer transition-colors"
      style={{
        width: 26,
        height: 26,
        borderRadius: 4,
        background: "transparent",
        border: `1px solid transparent`,
        color: VT.ashGhost,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)"
        e.currentTarget.style.borderColor = VT.rule
        e.currentTarget.style.color = VT.amber
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
        e.currentTarget.style.borderColor = "transparent"
        e.currentTarget.style.color = VT.ashGhost
      }}
    >
      <Icon size={12} strokeWidth={1.5} />
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   WORKSPACE CHART — unchanged logic, kept byte-for-byte
   ════════════════════════════════════════════════════════════════════════ */
function WorkspaceChart({
  forecast,
  dirColor: _dirColor,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
}) {
  const seed = forecast.id.charCodeAt(forecast.id.length - 1)
  const isLong = forecast.direction === "LONG"
  const candles: { x: number; o: number; c: number; h: number; l: number }[] = []
  let price = 50 + (seed % 20)
  for (let i = 0; i < 48; i++) {
    const move = Math.sin(seed * 0.5 + i * 0.55) * 4.8 + (isLong ? 0.28 : -0.28)
    const open = price
    const close = price + move
    const high = Math.max(open, close) + Math.abs(Math.sin(i + seed) * 2.5)
    const low = Math.min(open, close) - Math.abs(Math.cos(i + seed) * 2.5)
    candles.push({ x: i * 13 + 8, o: open, c: close, h: high, l: low })
    price = close
  }
  const allP = candles.flatMap((c) => [c.h, c.l])
  const mn = Math.min(...allP) - 4
  const mx = Math.max(...allP) + 4
  const s = (v: number) => ((mx - v) / (mx - mn)) * 240

  const entryPrice = candles[34].c
  const slPrice = isLong ? entryPrice - 7 : entryPrice + 7
  const tpPrice = isLong ? entryPrice + 14 : entryPrice - 14
  const entryY = s(entryPrice)
  const slY = s(slPrice)
  const tpY = s(tpPrice)

  return (
    <div className="w-full h-full p-2">
      <svg viewBox="0 0 640 245" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ws-tp-fill-inline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${ACCENT.emerald.rgb},0.06)`} />
            <stop offset="100%" stopColor={`rgba(${ACCENT.emerald.rgb},0.015)`} />
          </linearGradient>
          <linearGradient id="ws-sl-fill-inline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${ACCENT.rose.rgb},0.05)`} />
            <stop offset="100%" stopColor={`rgba(${ACCENT.rose.rgb},0.01)`} />
          </linearGradient>
        </defs>
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line
            key={f}
            x1="0"
            y1={245 * f}
            x2="640"
            y2={245 * f}
            stroke="rgba(148,163,184,0.025)"
            strokeWidth="0.5"
          />
        ))}
        <rect
          x="440"
          y={Math.min(entryY, tpY)}
          width="200"
          height={Math.abs(tpY - entryY)}
          fill="url(#ws-tp-fill-inline)"
        />
        <rect
          x="440"
          y={Math.min(entryY, slY)}
          width="200"
          height={Math.abs(slY - entryY)}
          fill="url(#ws-sl-fill-inline)"
        />
        <line
          x1="0"
          y1={entryY}
          x2="640"
          y2={entryY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
          strokeDasharray="4 3"
        />
        <line
          x1="380"
          y1={tpY}
          x2="640"
          y2={tpY}
          stroke={`rgba(${ACCENT.emerald.rgb},0.25)`}
          strokeWidth="0.5"
          strokeDasharray="4 3"
        />
        <line
          x1="380"
          y1={slY}
          x2="640"
          y2={slY}
          stroke={`rgba(${ACCENT.rose.rgb},0.2)`}
          strokeWidth="0.5"
          strokeDasharray="4 3"
        />
        <text
          x="634"
          y={tpY - 4}
          textAnchor="end"
          fill={`rgba(${ACCENT.emerald.rgb},0.4)`}
          fontSize="7"
          fontFamily="monospace"
        >
          TP
        </text>
        <text
          x="634"
          y={slY - 4}
          textAnchor="end"
          fill={`rgba(${ACCENT.rose.rgb},0.35)`}
          fontSize="7"
          fontFamily="monospace"
        >
          SL
        </text>
        <text
          x="634"
          y={entryY - 4}
          textAnchor="end"
          fill="rgba(255,255,255,0.2)"
          fontSize="7"
          fontFamily="monospace"
        >
          Entry
        </text>
        {candles.map((c, i) => {
          const bull = c.c > c.o
          const col = bull ? `rgba(${ACCENT.emerald.rgb},0.6)` : `rgba(${ACCENT.rose.rgb},0.5)`
          const top = s(Math.max(c.o, c.c))
          const bot = s(Math.min(c.o, c.c))
          return (
            <g key={i}>
              <line x1={c.x} y1={s(c.h)} x2={c.x} y2={s(c.l)} stroke={col} strokeWidth="0.7" />
              <rect
                x={c.x - 3.5}
                y={top}
                width="7"
                height={Math.max(1, bot - top)}
                fill={col}
                rx="0.5"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   HELPERS — unchanged
   ════════════════════════════════════════════════════════════════════════ */
function getStatusConfig(status: ForecastStatus) {
  switch (status) {
    case "active":
      return { label: "Active", icon: Timer, color: ACCENT.blue.rgb }
    case "near_expiry":
      return { label: "Expiring", icon: Hourglass, color: ACCENT.amber.rgb }
    case "awaiting_resolution":
      return { label: "Awaiting", icon: Clock, color: ACCENT.cyan.rgb }
    case "resolved_win":
      return { label: "Won", icon: CheckCircle2, color: ACCENT.emerald.rgb }
    case "resolved_loss":
      return { label: "Lost", icon: XCircle, color: ACCENT.rose.rgb }
    case "expired":
      return { label: "Expired", icon: Clock, color: ACCENT.slate.rgb }
    case "invalidated":
      return { label: "Void", icon: XCircle, color: ACCENT.slate.rgb }
  }
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

function formatUTC(d: Date) {
  const hh = d.getUTCHours().toString().padStart(2, "0")
  const mm = d.getUTCMinutes().toString().padStart(2, "0")
  return `${hh}:${mm} UTC`
}
