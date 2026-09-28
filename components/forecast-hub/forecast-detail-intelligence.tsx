"use client"

/**
 * Forecast Detail · Intelligence Panel — v4 "Forecast Intelligence Passport"
 *
 * The right rail is no longer five cards repeating Entry/SL/TP/RR/Confidence
 * three times each. It's a single intelligence story that answers, top to
 * bottom:
 *
 *   1. Identity / Source       — who posted this and why they matter
 *   2. Status Capsule          — where this forecast is in its life
 *   3. Thesis Snapshot         — the idea, told in clean hierarchy
 *   4. Evidence Stack          — the receipts (author / engine / community / mentor)
 *   5. Lifecycle Story         — what's happened since publish
 *   6. Community Pulse         — bull/bear, watching, saved, agreement
 *   7. Role-Aware Actions      — adapts to viewerRole (trader / mentor / mod / author)
 *
 * + ProfileView (preserved) — the full analyst dossier opened from the
 *   Identity strip.
 *
 * Dedup contract:
 *   • Entry / SL / TP / RR live ONLY on the chart + Spec Headline rail.
 *     Right panel references them as relational facts ("TP closer than SL"),
 *     not as repeated numbers.
 *   • Confidence: ONE compact "Conviction tone" inside Thesis Snapshot.
 *     No 88pt hero number.
 *   • Status: ONLY inside Status Capsule and the frame header.
 *   • Likes / comments / views: ONLY inside Community Pulse.
 *   • Window countdown: ONLY inside Status Capsule.
 *
 * Visual contract:
 *   • Inter sans for everything human; tabular-nums for numbers.
 *   • Mono uppercase used ONLY for tiny eyebrows (0.22em tracking).
 *   • Glass cards: 22px radius, 24px backdrop-blur, top inner highlight,
 *     accent corner glow, layered shadow.
 *   • Single accent per card. Dashboard rule: 3-5 colors total.
 *   • Generous whitespace (24px card padding, 20px between cards).
 */

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Award,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Crown,
  Edit3,
  Eye,
  Flag,
  Globe,
  Hash,
  Heart,
  Lock,
  MapPin,
  MessageSquare,
  Pin,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Users,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  VolumeX,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { ACCENT } from "@/components/mtf/mtf-theme"
import { VT, amber, rgba } from "./forecast-vantary-tokens"
import type { ForecastItem, ForecastUser } from "./forecast-types"

/* ════════════════════════════════════════════════════════════════════════
   PUBLIC PROPS
   ════════════════════════════════════════════════════════════════════════ */

/**
 * Viewer's role relative to this forecast. Drives the action stack and
 * subtle authority cues. Defaults to "trader" — the most common case.
 */
export type ViewerRole = "trader" | "mentor" | "moderator" | "author"

/**
 * Poster's archetype, derived from the ForecastUser. Drives identity
 * strip emphasis (which credibility metrics, what badge, what tone).
 */
type PosterRole = "mentor" | "verified" | "pro" | "member"

export interface ForecastIntelligencePanelProps {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  statusCfg: {
    label: string
    icon: LucideIcon
    color: string // rgb triplet
  }
  expiresIn: string | null
  riskRewardDistances: { risk: string; reward: string } | null
  projectedMove: string | null
  /** Viewer's role. Defaults to "trader". */
  viewerRole?: ViewerRole
}

type PanelView = "intelligence" | "profile"

/* ════════════════════════════════════════════════════════════════════════
   PRIMITIVES — typography + glass surfaces
   ════════════════════════════════════════════════════════════════════════ */

/** Glass card shell — 22px radius, 24px backdrop-blur, accent corner glow. */
function GlassCard({
  children,
  accentRgb,
  className,
  delay = 0,
  onClick,
  interactive,
  padding = 24,
}: {
  children: React.ReactNode
  accentRgb?: string
  className?: string
  delay?: number
  onClick?: () => void
  interactive?: boolean
  padding?: number
}) {
  const hasClick = !!onClick
  return (
    <motion.div
      onClick={onClick}
      role={hasClick ? "button" : undefined}
      tabIndex={hasClick ? 0 : undefined}
      onKeyDown={
        hasClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: VT.easeOut, delay }}
      whileHover={interactive ? { y: -2 } : undefined}
      className={`relative overflow-hidden text-left w-full ${className ?? ""}`}
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
        cursor: interactive ? "pointer" : "default",
      }}
    >
      {/* Top inner highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
        }}
      />
      {/* Accent corner glow */}
      {accentRgb && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: 0,
            right: 0,
            width: 160,
            height: 160,
            background: `radial-gradient(circle at top right, ${rgba(accentRgb, 0.09)}, transparent 65%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}

/** Tiny mono-caps section eyebrow. */
function Eyebrow({
  children,
  color = VT.ashSoft,
  size = 9.5,
}: {
  children: React.ReactNode
  color?: string
  size?: number
}) {
  return (
    <span
      className="font-mono uppercase"
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "0.22em",
        color,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  )
}

/** Split-magnitude tabular-num. Heavy 500 lead + thin 200 tail. */
function StatNumber({
  value,
  size = 22,
  color = VT.paper,
  tailColor,
}: {
  value: string
  size?: number
  color?: string
  tailColor?: string
}) {
  const m = value.match(/^([+\-−]?[\d.,]+)(.*)$/)
  const lead = m ? m[1] : value
  const tail = m ? m[2] : ""
  return (
    <span
      className="font-sans tabular-nums"
      style={{
        fontSize: size,
        fontWeight: 500,
        color,
        letterSpacing: "-0.025em",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {lead}
      {tail && (
        <span
          style={{
            fontWeight: 200,
            color: tailColor ?? rgba("255,255,255", 0.42),
            marginLeft: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {tail}
        </span>
      )}
    </span>
  )
}

/** Mono caption — dim, used sparingly. */
function Caption({
  children,
  color = VT.ashGhost,
  size = 10.5,
}: {
  children: React.ReactNode
  color?: string
  size?: number
}) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: size,
        fontWeight: 400,
        color,
        letterSpacing: "0.04em",
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  )
}

/** Hairline rule. */
function Hairline({ dashed = false }: { dashed?: boolean }) {
  return (
    <div
      className="w-full"
      style={{
        height: 1,
        borderTop: `1px ${dashed ? "dashed" : "solid"} rgba(255,255,255,0.06)`,
      }}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   UTILITIES — deterministic, no fetches, no state side effects
   ════════════════════════════════════════════════════════════════════════ */

function seedFrom(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function timeAgo(iso?: string): string {
  if (!iso) return "—"
  const t = new Date(iso).getTime()
  if (isNaN(t)) return "—"
  const sec = Math.max(0, Math.floor((Date.now() - t) / 1000))
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}

function formatClockUTC(iso?: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  const hh = d.getUTCHours().toString().padStart(2, "0")
  const mm = d.getUTCMinutes().toString().padStart(2, "0")
  return `${hh}:${mm}`
}

/** Derive the poster's archetype from their user record. */
function getPosterRole(user: ForecastUser): PosterRole {
  if (user.isMentor) return "mentor"
  if (user.isVerified) return "verified"
  if (user.tier === "expert" || user.tier === "advanced") return "pro"
  return "member"
}

/** Tone for a poster archetype — single accent, single label. */
function getPosterTone(role: PosterRole, dirRgb: string): { label: string; rgb: string; hex: string } {
  switch (role) {
    case "mentor":
      return { label: "Mentor", rgb: "245,158,11", hex: VT.amber }
    case "verified":
      return { label: "Verified Analyst", rgb: VT.emeraldRgb, hex: VT.emerald }
    case "pro":
      return { label: "Pro Trader", rgb: VT.blueRgb, hex: VT.blue }
    case "member":
    default:
      return { label: "Community Member", rgb: dirRgb, hex: `rgb(${dirRgb})` }
  }
}

/** Strategy specialty for the poster — derived from seed if not stated. */
function getStrategyStyle(seed: number): string {
  const styles = [
    "ICT Mastery",
    "Smart Money Concepts",
    "Wyckoff",
    "Liquidity Hunter",
    "Order Flow",
    "Macro Swing",
    "Mean Reversion",
    "Trend Continuation",
  ]
  return styles[seed % styles.length]
}

/** Deterministic uniform float in [lo, hi] driven by seed + offset.
 *  Used for all dossier derivations so every visible number is stable
 *  per-forecast across re-renders without needing a real backend. */
function seedRange(seed: number, offset: number, lo: number, hi: number): number {
  const r = ((seed + offset) * 9301 + 49297) % 233280
  return lo + (hi - lo) * (r / 233280)
}

/** The analyst's trading desk timezone — drives session alignment context. */
function getDeskTimezone(seed: number): { city: string; session: string } {
  const desks = [
    { city: "London", session: "EU · LDN" },
    { city: "New York", session: "US · NY" },
    { city: "Singapore", session: "ASIA · SGT" },
    { city: "Tokyo", session: "ASIA · JPN" },
    { city: "Dubai", session: "EMEA · AE" },
    { city: "Sydney", session: "ASIA · AUS" },
  ]
  return desks[seed % desks.length]
}

/** Operator vitals — capital under management, typical risk, tenure, desk.
 *  AUM/risk ranges are tier-scaled because that's how the real world works:
 *  community members trade smaller books with looser risk; verified analysts
 *  and mentors trade larger books with tighter risk discipline. */
function getOperatorVitals(role: PosterRole, seed: number) {
  // [aumLo, aumHi, riskLoBp, riskHiBp]  (risk in basis points × 100)
  const tiers: Record<PosterRole, [number, number, number, number]> = {
    member:   [25_000,    500_000,    100, 200],
    pro:      [500_000,   5_000_000,   50, 125],
    verified: [800_000,   8_000_000,   50, 100],
    mentor:   [2_000_000, 25_000_000,  25,  75],
  }
  const tenures: Record<PosterRole, [number, number]> = {
    member:   [0.5, 3],
    pro:      [2,   7],
    verified: [3,  10],
    mentor:   [5,  18],
  }
  const [aumLo, aumHi, riskLo, riskHi] = tiers[role]
  const [tLo, tHi] = tenures[role]
  return {
    aum: seedRange(seed, 1, aumLo, aumHi),
    riskPercent: seedRange(seed, 2, riskLo, riskHi) / 100,
    tenureYears: seedRange(seed, 3, tLo, tHi),
    desk: getDeskTimezone(seed),
  }
}

/** Compact AUM formatter: $2.4M, $480K, $25M. */
function formatAUM(aum: number): string {
  if (aum >= 10_000_000) return `$${Math.round(aum / 1_000_000)}M`
  if (aum >= 1_000_000) return `$${(aum / 1_000_000).toFixed(1)}M`
  if (aum >= 1_000) return `$${Math.round(aum / 1_000)}K`
  return `$${Math.round(aum)}`
}

/** Recent form — surfaces the last 6 outcomes from the analyst's
 *  deterministic 30-call history (already produced by buildIdentityBreakdowns).
 *  Each tile carries a deterministic R-multiple so the viewer sees both
 *  the W/L pattern AND the magnitude of recent wins/losses. Critical
 *  decision signal that aggregate accuracy hides. */
/* Pair pool used by buildRecentForm — the same family of tickers used
   throughout the popup so the recent-form capsules read consistently
   with the rest of the dossier (no NAS100 in the strip if the trader's
   coverage is all FX). Deterministic by seed. */
const RECENT_PAIR_POOL = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "NAS100",
  "BTCUSD",
  "US30",
] as const

const RECENT_TF_POOL = ["M15", "H1", "H4", "D1"] as const

function buildRecentForm(
  seed: number,
  last30: ("win" | "loss" | "expired")[],
): {
  outcome: "win" | "loss" | "expired"
  r: number
  daysAgo: number
  pair: string
  direction: "Long" | "Short"
  timeframe: string
}[] {
  // Last 5 trades, not 6 — capsules now carry pair + direction + TF +
  // result + date, so the grid needs each cell to be wider than the
  // old "letter + R" tile. Five cells in a 5-col grid hit the right
  // density: enough signal to read each trade, not so much it crowds.
  return last30.slice(0, 5).map((outcome, i) => {
    // Wins: 0.6R..3.4R | Losses: -1.2R..-0.6R | Expired: 0R
    const winR = 0.6 + ((seed + i * 11) % 28) / 10
    const lossR = -(0.6 + ((seed + i * 13) % 6) / 10)
    const r = outcome === "win" ? winR : outcome === "loss" ? lossR : 0
    // Pair / direction / timeframe — fully deterministic per (seed, i)
    // so the capsule layout is stable across re-renders.
    const pair = RECENT_PAIR_POOL[(seed + i * 7) % RECENT_PAIR_POOL.length]
    const direction = ((seed + i * 5) % 2 === 0 ? "Long" : "Short") as "Long" | "Short"
    const timeframe = RECENT_TF_POOL[(seed + i * 3) % RECENT_TF_POOL.length]
    return {
      outcome,
      r: Math.round(r * 10) / 10,
      daysAgo: i === 0 ? 0 : i + ((seed + i) % 2),
      pair,
      direction,
      timeframe,
    }
  })
}

/* ════════════════════════════════════════════════════════════════════════
   OPERATOR VITALS — 2×2 dossier grid with full English labels.
   Reads like a hedge-fund factsheet: capital scale, risk discipline,
   tenure, and desk geography. Capital cell uses an amber accent — the
   only color accent in the strip — because capital scale is the most
   decision-impactful dossier signal; everything else is contextual.
   Labels use full sentence-case English ("Capital Managed", "Risk Per
   Trade") rather than abbreviations, and values are rendered larger
   and brighter than the previous version for legibility.
   ════════════════════════════════════════════════════════════════════════ */
/* ═══════���������������������════════════════════════════════════════════════════════════════
   OPERATOR VITALS — open-surface 2×2.

   No outer border, no inner solid hairlines. The four cells are felt
   through a soft tonal vignette per quadrant + a dissolving crosshair
   at center + one slow ambient luminous drift. The reader sees four
   "zones" without ever seeing a line drawn around them.

   Reading model wired into the layout:
     top-left  = SCALE          (Capital Managed, amber accent)
     top-right = RISK BEHAVIOR  (Risk Per Trade)
     bot-left  = MATURITY       (Years Active)
     bot-right = ENVIRONMENT    (Trading Desk, cyan accent)
   ════════════════════════════════════════════════════════════════════════ */
function OperatorVitals({
  vitals,
  accuracy,
  calls,
  monetary,
  breakdowns,
  splits,
  seed,
  posterRole,
  streak,
  forecast,
  onOpenProfile,
}: {
  vitals: ReturnType<typeof getOperatorVitals>
  accuracy: number
  calls: number
  monetary: ReturnType<typeof buildMonetaryStats>
  breakdowns: IdentityBreakdowns
  splits: ReturnType<typeof buildExtendedSplits>
  seed: number
  posterRole: PosterRole
  streak: number
  forecast: ForecastItem
  onOpenProfile: () => void
}) {
  /* ──────────────────────────────────────────────────────────────────
     MASTERMIND EXPANSION STATE
     ─────────────────────────────────────────────────────────────────
     The 3-cell strip is the "headline" of the operator dossier.
     Clicking ANY cell collapses the headline and unfolds a thematic
     deep-dive panel in its place — the IDENTITY block above stays put
     across every swap (per the user's standing rule: always keep the
     name visible). Three groups, three panels:

       cell 1 (Management ⇄ Years live) → "account"  panel
       cell 2 (Risk       ⇄ Win rate)   → "edge"     panel
       cell 3 (Calls      ⇄ Desk)       → "coverage" panel

     Each panel is a self-contained <div> (not a popup or dropdown)
     so the experience reads as "the strip transformed", not "a tray
     opened". Esc collapses, the back chevron collapses, and clicks
     outside the panel bubble up safely.
     ────────────────────────────────────────────────────────────── */
  const [expanded, setExpanded] = useState<"account" | "edge" | "coverage" | null>(null)
  const collapse = () => setExpanded(null)

  // Esc-to-close keeps the panel keyboard-accessible and consistent
  // with how the rest of the popup handles dismissals.
  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") collapse()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [expanded])

  // Operator context is now a 3-cell rotator strip — each cell quietly
  // cycles through TWO related facts so the dossier reveals more of
  // the operator profile without the eye scanning more boxes. Pairings
  // are thematic, not arbitrary:
  //   1. SCALE       — Capital Managed ⇄ Years Active
  //                    (how big they manage · how long they've done it)
  //   2. DISCIPLINE  — Risk Per Trade  ⇄ Win Rate
  //                    (how much they bet · how often they're right)
  //   3. ENVIRONMENT — Verified Calls  ⇄ Trading Desk
  //                    (how much volume · where they operate)
  // Values stay in paper/ash-soft (no accent green/amber/cyan) so the
  // group still reads as low-contrast operator context — color signal
  // weight belongs in the proof matrix below.
  // Real-desk vernacular pass. Every label is now ≤ 10 chars so it
  // never truncates inside a 1/3-width cell at any popup width, and
  // every sub is the kind of phrase a prop-firm risk manager or a
  // discretionary trader actually says out loud — no "operating
  // tenure", no "equity under management", no corporate copy. Direct
  // trading language only.
  const scaleFrames = useMemo(
    () => [
      {
        // Cell 1 frame A — capital under management. "Management" reads
        // immediately to anyone (retail, prop, fund) without needing
        // the desk-jargon decoder ring "Book" required.
        label: "Management",
        value: formatAUM(vitals.aum),
        sub: "Capital live",
        tint: "245,158,11", // warm vignette
      },
      {
        // Cell 1 frame B — how long they've been doing it. "Years live"
        // is direct: live capital, live for years.
        label: "Years live",
        value: `${vitals.tenureYears.toFixed(1)} yrs`,
        sub: "On the desk",
        tint: "245,158,11",
      },
    ],
    [vitals.aum, vitals.tenureYears],
  )

  const disciplineFrames = useMemo(
    () => [
      {
        // Cell 2 frame A — per-trade risk %. "Risk" + "Per setup" is
        // exactly how a trader describes their position-sizing rule:
        // "I risk 0.8% per setup". Anyone in the seat reads this.
        label: "Risk",
        value: `${vitals.riskPercent.toFixed(2)}%`,
        sub: "Per setup",
        tint: "232,232,222",
      },
      {
        // Cell 2 frame B — win rate. Traders also say "hit rate";
        // "Win rate" is more universal across retail + prop. Sub
        // reads as "wins · losses" with the standard W/L glyphs.
        label: "Win rate",
        value: `${accuracy}%`,
        sub: `${monetary.wins}W · ${monetary.losses}L`,
        tint: "232,232,222",
      },
    ],
    [vitals.riskPercent, accuracy, monetary.wins, monetary.losses],
  )

  const environmentFrames = useMemo(
    () => [
      {
        // Cell 3 frame A — verified calls count. "Calls" is the desk
        // word for "trade ideas posted". "Closed · audited" tells the
        // reader these are settled trades that have been checked, not
        // open hopium.
        label: "Calls",
        value: `${calls}`,
        sub: "Closed · audited",
        tint: VT.cyanRgb,
      },
      {
        // Cell 3 frame B — where they sit. "Desk" + the city is how
        // a trader actually identifies their seat ("I'm on the Sydney
        // desk"). Session abbreviation reads as "ASIA · JPN" etc.
        label: "Desk",
        value: vitals.desk.city,
        sub: vitals.desk.session,
        tint: VT.cyanRgb,
      },
    ],
    [calls, vitals.desk.city, vitals.desk.session],
  )

  // Hover pauses each cell independently. Cadences staggered (5.5 / 6.5
  // / 7.5s) so the rail never pulses in unison — the eye registers
  // gentle, organic movement, never a synchronized flip.
  const [pauseScale, setPauseScale] = useState(false)
  const [pauseDiscipline, setPauseDiscipline] = useState(false)
  const [pauseEnv, setPauseEnv] = useState(false)
  const scale = useRotator(scaleFrames, 5500, pauseScale)
  const discipline = useRotator(disciplineFrames, 6500, pauseDiscipline)
  const environment = useRotator(environmentFrames, 7500, pauseEnv)

  return (
    /* motion.div with `layout` enables a smooth height crossfade
       between the compact strip and the taller panel — no manual
       height math needed. AnimatePresence with mode="wait" guarantees
       the outgoing view fully fades before the incoming one renders,
       so the user never sees both layers stacked mid-swap. */
    <motion.div layout transition={{ duration: 0.32, ease: VT.easeOut }}>
      <AnimatePresence mode="wait" initial={false}>
        {expanded === null && (
          <motion.div
            key="strip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: VT.easeOut }}
          >
            <ProfileFacts
              cells={[
                {
                  ...scale.item,
                  idx: scale.idx,
                  total: scaleFrames.length,
                  onHoverChange: setPauseScale,
                  // Cell 1 (Management ⇄ Years live) → Account panel
                  onClick: () => setExpanded("account"),
                },
                {
                  ...discipline.item,
                  idx: discipline.idx,
                  total: disciplineFrames.length,
                  onHoverChange: setPauseDiscipline,
                  // Cell 2 (Risk ⇄ Win rate) → Edge & risk panel
                  onClick: () => setExpanded("edge"),
                },
                {
                  ...environment.item,
                  idx: environment.idx,
                  total: environmentFrames.length,
                  onHoverChange: setPauseEnv,
                  // Cell 3 (Calls ⇄ Desk) → Coverage panel
                  onClick: () => setExpanded("coverage"),
                },
              ]}
            />
          </motion.div>
        )}

        {expanded === "account" && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.26, ease: VT.easeOut }}
          >
            <AccountPanel
              vitals={vitals}
              posterRole={posterRole}
              seed={seed}
              calls={calls}
              monetary={monetary}
              accuracy={accuracy}
              forecast={forecast}
              onJumpTo={(g) => setExpanded(g)}
              onBack={collapse}
              onOpenProfile={onOpenProfile}
            />
          </motion.div>
        )}

        {expanded === "edge" && (
          <motion.div
            key="edge"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.26, ease: VT.easeOut }}
          >
            <EdgeRiskPanel
              vitals={vitals}
              monetary={monetary}
              breakdowns={breakdowns}
              accuracy={accuracy}
              streak={streak}
              seed={seed}
              forecast={forecast}
              onJumpTo={(g) => setExpanded(g)}
              onBack={collapse}
              onOpenProfile={onOpenProfile}
            />
          </motion.div>
        )}

        {expanded === "coverage" && (
          <motion.div
            key="coverage"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.26, ease: VT.easeOut }}
          >
            <CoveragePanel
              vitals={vitals}
              calls={calls}
              breakdowns={breakdowns}
              splits={splits}
              seed={seed}
              forecast={forecast}
              onJumpTo={(g) => setExpanded(g)}
              onBack={collapse}
              onOpenProfile={onOpenProfile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── PROFILE FACTS — CALM 3-cell operator-context strip.

   One unified open surface, three zones, no boxed borders. Each cell
   quietly rotates through 2 thematic facts (driven by OperatorVitals
   above) so the dossier reveals more of the operator profile without
   asking the eye to scan more boxes.

   High-quality cell behavior:
     · Hover pauses the rotation so the reader can read at their own pace
     · Hover intensifies the per-cell vignette (alpha 0.018 → 0.045)
     · Hover lifts the cell -1px and reveals a soft chevron-right hint
     · Bottom of every cell carries dim progress dots showing position
       in the 2-frame rotation (always visible, brighten on hover)
     · Click routes to the analyst profile (the popup stays a preview)
     · AnimatePresence handles the y-fade swap with a 0.45s ease-out

   Differentiation vs the proof bento below:
     · 3 cells in one row (proof: 1 hero + 3-cell row)
     · Vertical hairline alpha 0.05 (proof: 0.06) — softer split
     · NO ambient drift slug (proof has a 14s drift)
     · NO accent colors on values, NO value glow
     · Value typography 16px regular paper (proof row: 19px medium)
     · Per-cell vignette alpha 0.018 → 0.045 on hover (proof: 0.030+)
     · Warm paper-tone surface tint (proof: cool tint)

   Reads as one premium glass strip with three internal zones that
   gently breathe new information into the dossier. ── */
type ProfileFactCellData = {
  label: string
  value: string
  sub: string
  tint: string
  idx: number
  total: number
  onHoverChange: (h: boolean) => void
  onClick: () => void
}

function ProfileFacts({ cells }: { cells: ProfileFactCellData[] }) {
  return (
    <div
      className="relative grid grid-cols-3"
      style={{
        // Warm paper-tone surface — counterpoint to the cool proof
        // bento below. Together they make the two groups feel like
        // sibling chapters of one dossier without chrome.
        backgroundImage:
          "radial-gradient(140% 90% at 50% 0%, rgba(245,158,11,0.014) 0%, transparent 60%)",
        borderRadius: 8,
      }}
    >
      {/* Two vertical hairlines between the 3 cells, at 1/3 and 2/3.
          Gradient fades to transparent at top/bottom so the split is
          felt at center and disappears at the edges — never reads as a
          stamped border. Alpha 0.05 — slightly softer than the proof
          bento's 0.06 so this group stays the calmer sibling. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[15%] bottom-[15%] w-px"
        style={{
          left: "33.333%",
          transform: "translateX(-0.5px)",
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-[15%] bottom-[15%] w-px"
        style={{
          left: "66.666%",
          transform: "translateX(-0.5px)",
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        }}
      />

      {cells.map((c, i) => (
        <ProfileFactCell key={i} cell={c} />
      ))}
    </div>
  )
}

/* ── PROFILE FACT CELL — single zone of the operator-context strip.

   Built as a button so the entire cell is a click target (routes to
   the analyst profile). Hover behavior is layered:
     1. lift -1px
     2. vignette intensify (240ms crossfade)
     3. chevron-right hint at top-right (240ms crossfade)
     4. progress dots at bottom brighten
     5. rotation pauses (signaled to parent via onHoverChange)
   The AnimatePresence wraps the value/sub stack only — label stays
   stable so the eye anchors on the column heading. ── */
function ProfileFactCell({ cell }: { cell: ProfileFactCellData }) {
  // Stable swap key — combines rotator index + label so AnimatePresence
  // re-mounts the inner stack on every cycle without ever colliding
  // with sibling cells.
  const swapKey = `${cell.idx}-${cell.label}`
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        cell.onClick()
      }}
      onMouseEnter={() => cell.onHoverChange(true)}
      onMouseLeave={() => cell.onHoverChange(false)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15, ease: VT.easeOut }}
      className="group relative flex flex-col items-center justify-center text-center select-none"
      style={{
        // Symmetric vertical padding now that the progress dots are
        // gone — was "18px 14px 24px" to reserve room for dots at the
        // bottom; balanced 18px top/bottom so the value sits visually
        // centered in the cell.
        padding: "18px 14px",
        minHeight: 92,
        // Calm baseline vignette — softer than the proof bento's 0.030
        // so this strip reads as low-contrast operating context, not
        // credibility evidence.
        background: `radial-gradient(120% 100% at 50% 0%, ${rgba(cell.tint, 0.018)} 0%, transparent 65%)`,
        cursor: "pointer",
      }}
    >
      {/* Hover-only intensified vignette — sits on top of the baseline
          vignette and crossfades in over 240ms so the cell glows
          gently without ever flashing. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 100% at 50% 0%, ${rgba(cell.tint, 0.045)} 0%, transparent 65%)`,
          transition: "opacity 240ms ease-out",
        }}
      />

      {/* True crossfade — both frames stack via absolute positioning so
          they coexist briefly during the swap. The cell NEVER empties
          mid-rotation, which is what was causing the ghosted/half-opacity
          render the user caught on the AUM cell. mode="sync" (or rather
          omitting mode="wait") lets in/out animate together; the in
          frame ramps up while the out frame ramps down. Opacity-only
          crossfade — no Y translate — eliminates the bobbing artifact
          and shortens perceived duration. The wrapping <div> reserves
          a fixed footprint (matches one full label+value+sub stack)
          so siblings never reflow. */}
      <div
        className="relative w-full"
        style={{
          // Reserve enough vertical room for the tallest stack:
          //   label 9.5px (line 1) + gap 6 + value 16px (line ~17)
          //   + gap 6 + sub 9.5px (line ~10) ≈ 56-58px.
          minHeight: 56,
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={swapKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: VT.easeOut }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
          >
            {/* Caps eyebrow — same scale as proof bento labels so the
                two groups feel like the same family. */}
            <span
              className="font-sans truncate max-w-full"
              style={{
                fontSize: 9.5,
                color: VT.ashSoft,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                lineHeight: 1,
                opacity: 0.82,
              }}
            >
              {cell.label}
            </span>
            {/* Calm value — 16px regular paper, never an accent color.
                This is what makes the eye register "operator context"
                instead of "performance proof". */}
            <span
              className="font-sans tabular-nums truncate max-w-full"
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: VT.paper,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                opacity: 0.94,
              }}
            >
              {cell.value}
            </span>
            <span
              className="font-sans truncate max-w-full"
              style={{
                fontSize: 9.5,
                color: VT.ashGhost,
                fontWeight: 400,
                letterSpacing: "-0.005em",
                lineHeight: 1.1,
              }}
            >
              {cell.sub}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots removed — the rotation cadence + AnimatePresence
          y-fade already telegraph "there's more here" without needing
          a UI legend. The chevron-on-hover and pause-on-hover behaviors
          carry the affordance, and removing the dots cleans up the
          bottom edge of the strip so the cells sit flush. */}

      {/* Chevron hint — fades in on hover at top-right to telegraph
          "click to open profile". 70% opacity max so it stays whisper. */}
      <ChevronRight
        size={11}
        strokeWidth={1.6}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-70 pointer-events-none"
        style={{ color: VT.ashGhost, transition: "opacity 240ms ease-out" }}
        aria-hidden
      />
    </motion.button>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   MASTERMIND VITALS PANELS
   ════════════════════════════════════════════════════════════════════════
   Three thematic deep-dive panels that REPLACE the 3-cell strip in-place
   when a vital cell is clicked. They share the same warm paper-tone
   surface as the strip so the swap reads as "the strip transformed",
   not "a popup appeared". The IDENTITY block above stays put across
   every swap (per the user's standing rule: always keep the name).

   Layout language is shared across all three panels:
     · HEADER  — back chip · GROUP TITLE · summary chip + jump pills
     · HERO    — two big anchor stats with a separator dot, clickable
                 to open the analyst's full profile
     · KPI Δ STRIP — three before/after cards with arrow + magnitude
     · DETAIL GRID — 6 rows, 2 columns, each row optionally carrying
                     a 5px severity dot and/or a 36px micro-fill bar
     · RISK BAND — 3 chips colored by severity (low / med / high)
     · WORKED EXAMPLE — italic narrative paragraph, single sentence
     · SUB-NODES — 3 mini-cards with a deeper related metric each
     · FOOTER  — single italic micro-note tying the panel together

   They use existing primitives (Eyebrow, Caption, VT, ACCENT, rgba)
   so theme tweaks elsewhere automatically flow through.
   ═══════════════════════════════════════════════════════════════════════ */

/* Shared shell — header + warm-paper surface + click-stop. The body
   is passed in as `children` so each panel only writes its content. */
function VitalsPanelShell({
  title,
  summary,
  jumpTargets,
  onJumpTo,
  onBack,
  children,
}: {
  title: string
  summary?: string
  /** Optional jump pills — let the user hop to a sibling panel without
   *  collapsing back to the strip first. Each pill carries the panel
   *  group key the user wants to go to. */
  jumpTargets?: { key: "account" | "edge" | "coverage"; label: string }[]
  onJumpTo?: (g: "account" | "edge" | "coverage") => void
  onBack: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="relative flex flex-col gap-3"
      style={{
        // Warm paper-tone surface — matches ProfileFacts so the strip-
        // to-panel swap looks like one continuous surface, just with a
        // different layout inside. Gradient is slightly more present
        // here (0.022 vs strip's 0.014) because the panel is taller and
        // needs a touch more vignette to feel anchored.
        backgroundImage:
          "radial-gradient(140% 90% at 50% 0%, rgba(245,158,11,0.022) 0%, transparent 60%)",
        borderRadius: 8,
        padding: "14px 14px 16px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER ROW — back chip · title · summary · jump pills */}
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onBack()
          }}
          className="group flex items-center gap-1 shrink-0"
          style={{
            padding: "4px 7px 4px 5px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.035)",
            border: `1px solid ${VT.ruleSoft}`,
            color: VT.ashSoft,
            cursor: "pointer",
            transition: "background 180ms ease-out, color 180ms ease-out",
          }}
          aria-label="Back to operator vitals"
        >
          <ArrowLeft size={10} strokeWidth={1.9} />
          <span
            className="font-sans"
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
          >
            Back
          </span>
        </button>
        <Eyebrow size={10}>{title}</Eyebrow>
        <span className="ml-auto" />
        {summary && (
          <span
            className="font-sans truncate shrink-0 max-w-[55%]"
            style={{
              fontSize: 9.5,
              color: VT.ashGhost,
              fontWeight: 400,
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
            title={summary}
          >
            {summary}
          </span>
        )}
      </div>

      {/* Soft hairline separator — same dashed style used throughout
          the dossier so the panel reads as a continuation, not a popup. */}
      <span
        aria-hidden
        className="block w-full"
        style={{
          height: 1,
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0.06) 82%, transparent 100%)",
        }}
      />

      {children}

      {/* Jump pills — when wired, give the user a way to navigate to
          the OTHER two panels without collapsing back to the strip
          first. Reads as "while you're looking at coverage, here's
          a one-click jump to risk or account". */}
      {jumpTargets && jumpTargets.length > 0 && onJumpTo && (
        <div
          className="flex items-center gap-1.5 pt-2 mt-1"
          style={{
            borderTop: `1px dashed ${VT.ruleSoft}`,
          }}
        >
          <span
            className="font-sans shrink-0"
            style={{
              fontSize: 9,
              color: VT.ashGhost,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              opacity: 0.7,
            }}
          >
            Jump
          </span>
          {jumpTargets.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onJumpTo(t.key)
              }}
              className="group flex items-center gap-1 shrink-0"
              style={{
                padding: "3px 7px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${VT.ruleSoft}`,
                color: VT.ashSoft,
                cursor: "pointer",
                transition: "background 180ms ease-out, color 180ms ease-out",
              }}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 9.5,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  lineHeight: 1,
                }}
              >
                {t.label}
              </span>
              <ChevronRight size={9} strokeWidth={1.8} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* HERO — two big anchor stats with a separator dot. Clickable so the
   user can drill into the full analyst profile without first
   collapsing back to the strip. */
function VitalsHero({
  primary,
  secondary,
  onClick,
}: {
  primary: string
  secondary: string
  onClick?: () => void
}) {
  const inner = (
    <div className="flex items-baseline gap-2.5">
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: VT.paper,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {primary}
      </span>
      <span
        aria-hidden
        style={{
          width: 3,
          height: 3,
          borderRadius: 999,
          background: VT.ashGhost,
          opacity: 0.5,
        }}
      />
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 18,
          fontWeight: 400,
          color: VT.paper,
          letterSpacing: "-0.025em",
          lineHeight: 1,
          opacity: 0.92,
        }}
      >
        {secondary}
      </span>
    </div>
  )
  if (!onClick) return <div className="-mt-0.5">{inner}</div>
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="group flex items-baseline -mt-0.5"
      style={{ cursor: "pointer" }}
      aria-label="Open full analyst profile"
    >
      {inner}
    </button>
  )
}

/* KPI Δ STRIP — three before/after cards in a row. Each card carries:
     · a tiny eyebrow (the metric label)
     · the current value (paper, big-ish)
     · a tiny "from X" sub line in ash whisper
     · an arrow + delta badge in semantic color (emerald up / rose down)
   This is the masterplan-style "trajectory at a glance" element — it
   tells the reader not just where the operator IS but where they're
   COMING FROM, in 3 reads. */
function VitalsKPIDelta({
  cards,
}: {
  cards: {
    label: string
    value: string
    from: string
    delta: string
    direction: "up" | "down" | "flat"
  }[]
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {cards.map((c, i) => {
        const isUp = c.direction === "up"
        const isDown = c.direction === "down"
        const accent = isUp
          ? ACCENT.emerald.hex
          : isDown
            ? ACCENT.rose.hex
            : VT.ashSoft
        const accentRgb = isUp
          ? ACCENT.emerald.rgb
          : isDown
            ? ACCENT.rose.rgb
            : "232,232,222"
        return (
          <div
            key={i}
            className="relative flex flex-col items-start"
            style={{
              padding: "8px 9px 9px",
              borderRadius: 7,
              background: `rgba(${accentRgb},0.05)`,
              border: `1px solid rgba(${accentRgb},0.16)`,
              gap: 3,
            }}
          >
            <span
              className="font-sans truncate max-w-full"
              style={{
                fontSize: 8.5,
                color: VT.ashSoft,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                lineHeight: 1,
                opacity: 0.78,
              }}
            >
              {c.label}
            </span>
            <span
              className="font-sans tabular-nums truncate max-w-full"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: VT.paper,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {c.value}
            </span>
            <div className="flex items-center gap-1 truncate max-w-full">
              {isUp ? (
                <ArrowUpRight size={9} strokeWidth={2} style={{ color: accent }} />
              ) : isDown ? (
                <ArrowDownRight size={9} strokeWidth={2} style={{ color: accent }} />
              ) : (
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 1,
                    background: accent,
                    opacity: 0.7,
                  }}
                />
              )}
              <span
                className="font-mono tabular-nums truncate"
                style={{
                  fontSize: 8.5,
                  fontWeight: 500,
                  color: accent,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.1,
                  opacity: 0.92,
                }}
              >
                {c.delta}
              </span>
              <span
                className="font-sans truncate"
                style={{
                  fontSize: 8.5,
                  color: VT.ashGhost,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.1,
                  opacity: 0.78,
                }}
              >
                from {c.from}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* DETAIL ROW — left label (uppercase tiny) · right value (paper,
   slightly larger). Optional dot renders a tiny severity indicator
   before the value, optional bar renders a 36px micro-fill, both
   designed to add 1-glance signal without polluting the row's calm. */
/* VitalsRow — STACKED compact cell.

   This row used to lay out label and value side-by-side with `truncate`
   on both, which is what produced "MyForexF…", "Indice…", "London…",
   "+0…", etc., inside the narrow 1/2-width grid cells. The new layout
   stacks the eyebrow label above the value:

     LABEL (uppercase 9px)
     ●  value  ━━━━━   (value can wrap to a second line if needed)

   Benefits:
     · The value gets the FULL cell width — no more horizontal squeeze.
     · `whitespace-normal` + `break-words` means long firm/session names
       wrap to a second line instead of getting clipped with "...".
     · The bar/dot indicators move to the same line as the value, still
       readable at a glance.
     · Vertical rhythm of the 2-col fact list stays tight (`gap-y-3`
       handled by the caller). */
function VitalsRow({
  label,
  value,
  accent,
  dot,
  bar,
}: {
  label: string
  value: string
  accent?: string
  dot?: string
  bar?: number
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      {/* Eyebrow label — never wraps; labels are intentionally kept
          ≤ 14 chars by the panels so they always fit one line. */}
      <span
        className="font-sans"
        style={{
          fontSize: 9,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1.1,
          opacity: 0.78,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      {/* Value row — dot/bar live inline with the value. The value
          itself wraps naturally; no `truncate` anywhere in this row. */}
      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
        {dot && (
          <span
            aria-hidden
            className="shrink-0"
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: dot,
              boxShadow: `0 0 4px ${dot}88`,
            }}
          />
        )}
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: 12,
            color: accent ?? VT.paper,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
            opacity: 0.96,
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {value}
        </span>
        {bar !== undefined && (
          <span
            aria-hidden
            className="relative shrink-0"
            style={{
              width: 42,
              height: 3,
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
              marginLeft: 2,
            }}
          >
            <span
              className="absolute inset-y-0 left-0"
              style={{
                width: `${Math.max(0, Math.min(100, bar))}%`,
                borderRadius: 999,
                background: accent ?? VT.paper,
                opacity: 0.85,
                boxShadow: accent ? `0 0 4px ${accent}55` : undefined,
              }}
            />
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   INTEL PRIMITIVES — the editorial system that replaces the cookie-cutter
   "hero + KPI strip + grid + chips + paragraph" template.

   Each expanded view is now structured as a short AI intelligence report:

     IntelThesis   — one direct sentence in editorial type
     [LEAD VISUAL] — panel-specific, the ONE thing that makes the view
                     feel different from the other two. Account gets a
                     trust-signal trio, Risk gets a comparative R-pair
                     scale, Coverage gets a forecast-vs-zone alignment.
     IntelLedger   — 5–6 concise label/value rows. Right-aligned values,
                     full cell width, never truncated.
     IntelVerdict  — bold verdict tag + supporting clause. Replaces the
                     dot-pill "Aligned / Caution" treatment with an
                     editorial line that reads like a desk write-up.
   ───────────────────────────────────────────────────────────────────── */

/* IntelThesis — the one-sentence headline that opens every panel.
   Editorial type, no chrome, full width, balances on its own line. */
function IntelThesis({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans m-0 text-balance"
      style={{
        fontSize: 13.5,
        color: VT.paper,
        fontWeight: 400,
        letterSpacing: "-0.015em",
        lineHeight: 1.45,
        opacity: 0.96,
      }}
    >
      {children}
    </p>
  )
}

/* IntelLedger — clean editorial label/value rows.
   Label left (uppercase eyebrow), value right (paper). Full width.
   `whitespace-normal` + `word-break: break-word` on values means long
   firm or session names wrap to a second line instead of clipping. */
function IntelLedger({
  rows,
}: {
  rows: { label: string; value: React.ReactNode; accent?: string; mono?: boolean }[]
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: 0,
      }}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-baseline justify-between gap-4"
          style={{
            padding: "9px 0",
            borderTop: i === 0 ? "none" : `1px solid ${VT.ruleSoft}`,
            minWidth: 0,
          }}
        >
          <span
            className="font-sans shrink-0"
            style={{
              fontSize: 10,
              color: VT.ashSoft,
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              lineHeight: 1.2,
              opacity: 0.85,
            }}
          >
            {r.label}
          </span>
          <span
            className={r.mono ? "font-mono tabular-nums" : "font-sans tabular-nums"}
            style={{
              fontSize: 12.5,
              color: r.accent ?? VT.paper,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              textAlign: "right",
              wordBreak: "break-word",
              whiteSpace: "normal",
              minWidth: 0,
              maxWidth: "62%",
            }}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/* IntelVerdict — bold uppercase verdict tag + supporting clause.
   Replaces the old RelevanceLine dot-pill. Reads like the conclusion
   of a desk note: "ALIGNED — mature account history gives this forecast
   more credibility." */
function IntelVerdict({
  tag,
  tone,
  children,
}: {
  tag: string
  tone: "aligned" | "caution" | "neutral"
  children: React.ReactNode
}) {
  const accent =
    tone === "aligned"
      ? ACCENT.emerald.hex
      : tone === "caution"
        ? ACCENT.rose.hex
        : VT.amber
  const accentRgb =
    tone === "aligned"
      ? ACCENT.emerald.rgb
      : tone === "caution"
        ? ACCENT.rose.rgb
        : "245,158,11"
  return (
    <div
      className="flex items-start gap-2.5"
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: `rgba(${accentRgb},0.06)`,
        border: `1px solid rgba(${accentRgb},0.22)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      {/* Vertical accent bar — tiny editorial detail that distinguishes
          this from a generic info pill. */}
      <span
        aria-hidden
        className="shrink-0"
        style={{
          width: 2,
          alignSelf: "stretch",
          background: accent,
          borderRadius: 2,
          opacity: 0.85,
        }}
      />
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="font-sans"
          style={{
            fontSize: 10,
            color: accent,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {tag}
        </span>
        <p
          className="font-sans m-0"
          style={{
            fontSize: 12,
            color: VT.paper,
            fontWeight: 400,
            letterSpacing: "-0.005em",
            lineHeight: 1.5,
            opacity: 0.95,
            wordBreak: "break-word",
          }}
        >
          {children}
        </p>
      </div>
    </div>
  )
}

/* AccountTrustStrip — Account view's ONLY distinctive visual.
   Three flat trust signals (Audit · Drawdown · Maturity) shown as a
   horizontal strip of compact verdict tags. No bars, no progress,
   just direct verdicts in the trader's own language. */
function AccountTrustStrip({
  audited,
  drawdownOk,
  maturity,
}: {
  audited: boolean
  drawdownOk: boolean
  maturity: "high" | "medium" | "low"
}) {
  const items: { label: string; tone: "ok" | "warn" }[] = [
    { label: audited ? "Profile audited" : "Audit pending", tone: audited ? "ok" : "warn" },
    {
      label: drawdownOk ? "Drawdown honored" : "Drawdown elevated",
      tone: drawdownOk ? "ok" : "warn",
    },
    {
      label:
        maturity === "high"
          ? "Tenure mature"
          : maturity === "medium"
            ? "Track building"
            : "Sample early",
      tone: maturity === "low" ? "warn" : "ok",
    },
  ]
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((it, i) => {
        const accent = it.tone === "ok" ? ACCENT.emerald.hex : VT.amber
        const accentRgb = it.tone === "ok" ? ACCENT.emerald.rgb : "245,158,11"
        return (
          <span
            key={i}
            className="font-sans inline-flex items-center gap-1.5"
            style={{
              padding: "5px 9px",
              borderRadius: 999,
              background: `rgba(${accentRgb},0.07)`,
              border: `1px solid rgba(${accentRgb},0.28)`,
              fontSize: 10.5,
              fontWeight: 500,
              color: VT.paper,
              letterSpacing: "-0.005em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: accent,
                boxShadow: `0 0 5px ${accent}88`,
              }}
            />
            {it.label}
          </span>
        )
      })}
    </div>
  )
}

/* RPairScale — Risk view's ONLY distinctive visual.
   Two horizontal bars in a side-by-side comparative chart:
       AVG WINNER  ━━━━━━━━━━━━━━━━━  +1.70R
       AVG LOSER   ━━━━━━━           −1.00R
   The bar widths scale to the larger of |winner| / |loser|, so the
   viewer's eye instantly grasps the payout asymmetry — which IS the
   edge story. No other panel uses this element. */
function RPairScale({
  winR,
  lossR,
}: {
  winR: number
  lossR: number // negative number, e.g. -1.00
}) {
  const max = Math.max(Math.abs(winR), Math.abs(lossR))
  const winWidth = `${(Math.abs(winR) / max) * 100}%`
  const lossWidth = `${(Math.abs(lossR) / max) * 100}%`

  const Row = ({
    label,
    valueText,
    width,
    accent,
    accentRgb,
  }: {
    label: string
    valueText: string
    width: string
    accent: string
    accentRgb: string
  }) => (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className="font-sans shrink-0"
          style={{
            fontSize: 9.5,
            color: VT.ashSoft,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 13,
            color: accent,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          {valueText}
        </span>
      </div>
      <div
        className="relative w-full"
        style={{
          height: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width,
            background: `linear-gradient(90deg, rgba(${accentRgb},0.5) 0%, ${accent} 100%)`,
            borderRadius: 999,
            boxShadow: `0 0 8px rgba(${accentRgb},0.45)`,
          }}
        />
      </div>
    </div>
  )

  return (
    <div
      className="flex flex-col gap-3"
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${VT.ruleSoft}`,
      }}
    >
      <Row
        label="Avg winner"
        valueText={`+${winR.toFixed(2)}R`}
        width={winWidth}
        accent={ACCENT.emerald.hex}
        accentRgb={ACCENT.emerald.rgb}
      />
      <Row
        label="Avg loser"
        valueText={`${lossR.toFixed(2)}R`}
        width={lossWidth}
        accent={ACCENT.rose.hex}
        accentRgb={ACCENT.rose.rgb}
      />
    </div>
  )
}

/* CoverageAlignment — Coverage view's ONLY distinctive visual.
   Side-by-side strip comparing the CURRENT forecast (left) to the
   trader's top market/session zone (right), with an alignment glyph
   between them. The only place in the popup where forecast and
   trader profile are visually placed side-by-side. */
function CoverageAlignment({
  forecastSymbol,
  forecastSession,
  topMarket,
  topSession,
  match,
}: {
  forecastSymbol: string
  forecastSession: string
  topMarket: string
  topSession: string
  match: "full" | "partial" | "outside"
}) {
  const accent =
    match === "full"
      ? ACCENT.emerald.hex
      : match === "partial"
        ? VT.amber
        : ACCENT.rose.hex
  const accentRgb =
    match === "full"
      ? ACCENT.emerald.rgb
      : match === "partial"
        ? "245,158,11"
        : ACCENT.rose.rgb
  const glyph = match === "full" ? "≡" : match === "partial" ? "~" : "≠"

  const Cell = ({
    eyebrow,
    primary,
    secondary,
  }: {
    eyebrow: string
    primary: string
    secondary: string
  }) => (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <span
        className="font-sans"
        style={{
          fontSize: 9,
          color: VT.ashGhost,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {eyebrow}
      </span>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 13,
          color: VT.paper,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          lineHeight: 1.15,
          wordBreak: "break-word",
        }}
      >
        {primary}
      </span>
      <span
        className="font-sans"
        style={{
          fontSize: 10.5,
          color: VT.ashSoft,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {secondary}
      </span>
    </div>
  )

  return (
    <div
      className="flex items-stretch gap-3"
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: `rgba(${accentRgb},0.04)`,
        border: `1px solid rgba(${accentRgb},0.22)`,
      }}
    >
      <Cell eyebrow="This forecast" primary={forecastSymbol} secondary={forecastSession} />
      <div
        className="flex shrink-0 items-center justify-center self-stretch"
        style={{
          width: 28,
        }}
      >
        <span
          className="font-mono"
          aria-hidden
          style={{
            fontSize: 18,
            color: accent,
            fontWeight: 600,
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          {glyph}
        </span>
      </div>
      <Cell eyebrow="Top zone" primary={topMarket} secondary={topSession} />
    </div>
  )
}

/* RelevanceLine — the single connective sentence each panel ends with.

   Translates raw profile data into intelligence about THIS forecast:
     · "Aligned" / "Caution" lead-word, color-toned to the verdict
     · One short clause after it (no paragraphs)

   The panels each compute their own copy and pass it in, so this
   component only handles presentation. */
function RelevanceLine({
  verdict,
  text,
}: {
  verdict: "aligned" | "caution" | "neutral"
  text: string
}) {
  const accent =
    verdict === "aligned"
      ? ACCENT.emerald.hex
      : verdict === "caution"
        ? VT.amber
        : VT.paper
  const lead =
    verdict === "aligned" ? "Aligned" : verdict === "caution" ? "Caution" : "Context"
  return (
    <div
      className="flex items-start gap-2"
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        aria-hidden
        className="mt-1 shrink-0"
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 6px ${accent}55`,
        }}
      />
      <p
        className="font-sans m-0"
        style={{
          fontSize: 11,
          color: VT.paper,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.5,
          opacity: 0.92,
          wordBreak: "break-word",
        }}
      >
        <span
          style={{
            color: accent,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontSize: 10,
          }}
        >
          {lead}
        </span>
        {"  "}
        {text}
      </p>
    </div>
  )
}

/* RISK / DEPENDENCY BAND — three chips colored by severity. Used in
   panels to surface "what could break this metric" or "what depends
   on this metric being honored" — masterplan thinking applied to
   personal-trader telemetry. */
function VitalsRiskBand({
  items,
}: {
  items: { label: string; severity: "low" | "med" | "high"; note?: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => {
        const accent =
          it.severity === "low"
            ? ACCENT.emerald.hex
            : it.severity === "med"
              ? VT.amber
              : ACCENT.rose.hex
        const accentRgb =
          it.severity === "low"
            ? ACCENT.emerald.rgb
            : it.severity === "med"
              ? "245,158,11"
              : ACCENT.rose.rgb
        return (
          <div
            key={i}
            className="flex items-center gap-1.5"
            style={{
              padding: "4px 8px 4px 6px",
              borderRadius: 999,
              background: `rgba(${accentRgb},0.06)`,
              border: `1px solid rgba(${accentRgb},0.18)`,
            }}
            title={it.note}
          >
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: accent,
                boxShadow: `0 0 4px ${accent}88`,
              }}
            />
            <span
              className="font-sans truncate"
              style={{
                fontSize: 9.5,
                color: VT.paper,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                lineHeight: 1.1,
                opacity: 0.92,
              }}
            >
              {it.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* WORKED EXAMPLE — single italic narrative paragraph that gives the
   panel's metrics a real-world trade context. "If they take a NAS100
   long this week with a 1.31% risk and a 1:2 R:R..." — turns the
   abstract dossier into a movie. */
function VitalsWorkedExample({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        padding: "9px 11px 10px 12px",
        borderRadius: 7,
        background: "rgba(255,255,255,0.018)",
        border: `1px dashed ${VT.ruleSoft}`,
      }}
    >
      <span
        className="font-sans block mb-1"
        style={{
          fontSize: 9,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          lineHeight: 1,
          opacity: 0.78,
        }}
      >
        Worked example
      </span>
      <p
        className="font-sans"
        style={{
          fontSize: 11,
          color: VT.paper,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.5,
          opacity: 0.86,
          fontStyle: "italic",
        }}
      >
        {children}
      </p>
    </div>
  )
}

/* SUB-NODE CARD — one tile of the "deeper related metrics" cluster
   that closes each panel. Three of these in a row, each carrying a
   tiny eyebrow + protagonist value + soft narrative line. */
function VitalsSubNode({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note: string
  accent?: string
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        padding: "8px 9px 9px",
        borderRadius: 7,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${VT.ruleSoft}`,
        gap: 3,
      }}
    >
      <span
        className="font-sans truncate max-w-full"
        style={{
          fontSize: 8.5,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1,
          opacity: 0.78,
        }}
      >
        {label}
      </span>
      <span
        className="font-sans tabular-nums truncate max-w-full"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: accent ?? VT.paper,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        {value}
      </span>
      <span
        className="font-sans truncate max-w-full"
        style={{
          fontSize: 9,
          color: VT.ashGhost,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.2,
        }}
      >
        {note}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ACCOUNT PANEL — opens from cell 1 (Management ⇄ Years live).
   The "who's funding this and how long they've been at it" view.
   ─────────────────────────────────────────────────────────────────── */
function AccountPanel({
  vitals,
  posterRole,
  seed,
  calls,
  monetary,
  accuracy,
  forecast,
  onJumpTo,
  onBack,
  onOpenProfile,
}: {
  vitals: ReturnType<typeof getOperatorVitals>
  posterRole: PosterRole
  seed: number
  calls: number
  monetary: ReturnType<typeof buildMonetaryStats>
  accuracy: number
  forecast: ForecastItem
  onJumpTo: (g: "account" | "edge" | "coverage") => void
  onBack: () => void
  onOpenProfile: () => void
}) {
  // Account type — short, scannable. Mentors run prop-firm desks;
  // verified analysts run funded accounts; pros run live retail.
  const accountType =
    posterRole === "mentor"
      ? "Live prop firm"
      : posterRole === "verified"
        ? "Live funded"
        : "Live retail"

  // Broker / firm — trader-recognized name pool. Kept short enough
  // to fit one line in the cell at the new stacked-row layout, with
  // `MyForexFunds` and `IC Markets · Raw` being the natural wrap cases.
  const brokers = [
    "FTMO",
    "MyForexFunds",
    "The5ers",
    "TopstepTrader",
    "FundedNext",
    "IC Markets",
    "Pepperstone",
    "OANDA",
  ]
  const broker = brokers[seed % brokers.length]

  // First call month — same algorithm as the identity row's "Member
  // since" so the two values stay aligned across the popup.
  const firstCall = useMemo(() => {
    const months = Math.max(6, Math.round(vitals.tenureYears * 12))
    const d = new Date()
    d.setMonth(d.getMonth() - months)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }, [vitals.tenureYears])

  // Risk per call — kept on the panel since it's the single most useful
  // "$ per setup" framing for an account-context view.
  const riskPerCall = formatUSD(monetary.avgRiskUSD, true)

  // Combined-book vs single-account — verified analysts typically run
  // multiple sleeves (challenge + funded + personal); pros are single.
  const accountStructure =
    posterRole === "mentor" || posterRole === "verified"
      ? "Combined book"
      : "Single account"

  // Maturity verdict in plain language for the ledger row.
  const maturityLevel: "high" | "medium" | "low" =
    vitals.tenureYears >= 5 && calls >= 30
      ? "high"
      : vitals.tenureYears >= 1.5 && calls >= 15
        ? "medium"
        : "low"
  const maturityLabel =
    maturityLevel === "high"
      ? "High — long track"
      : maturityLevel === "medium"
        ? "Medium — established"
        : "Low — still building"

  // Editorial thesis sentence — assembled from the highest-signal facts.
  const thesis = `${accountType} profile with a ${vitals.tenureYears.toFixed(1)}-year record and ${formatAUM(vitals.aum)} of capital tracked across ${calls} audited calls.`

  // Final verdict tag — translates the maturity verdict into desk-talk.
  const verdictTag =
    maturityLevel === "high"
      ? "ALIGNED"
      : maturityLevel === "medium"
        ? "ESTABLISHED"
        : "BUILDING"
  const verdictTone: "aligned" | "caution" | "neutral" =
    maturityLevel === "high"
      ? "aligned"
      : maturityLevel === "medium"
        ? "neutral"
        : "caution"
  const verdictBody =
    maturityLevel === "high"
      ? `A ${vitals.tenureYears.toFixed(1)}-year record with ${calls} audited calls gives this forecast meaningful operator credibility — treat the call with normal weight.`
      : maturityLevel === "medium"
        ? `An established ${vitals.tenureYears.toFixed(1)}-year history with ${calls} calls on file — credible, but newer than a senior desk operator.`
        : `Only ${calls} audited calls so far — sample size is still building. Treat this forecast as a directional read rather than established authority.`

  return (
    <VitalsPanelShell
      title="Account intelligence"
      jumpTargets={[
        { key: "edge", label: "Risk →" },
        { key: "coverage", label: "Coverage →" },
      ]}
      onJumpTo={onJumpTo}
      onBack={onBack}
    >
      {/* ── Thesis — one editorial sentence that opens the report. */}
      <IntelThesis>{thesis}</IntelThesis>

      {/* ── LEAD VISUAL (Account-only) — flat trust-signal strip. */}
      <AccountTrustStrip
        audited
        drawdownOk
        maturity={maturityLevel}
      />

      {/* ── Editorial ledger — 6 account facts. Right-aligned values,
          no grids of mini-cards, no truncation. ─────────────────── */}
      <IntelLedger
        rows={[
          { label: "Account type", value: accountType, accent: accountType.startsWith("Live") ? ACCENT.emerald.hex : VT.amber },
          { label: "Capital base", value: formatAUM(vitals.aum), mono: true },
          { label: "Structure", value: accountStructure },
          { label: "Firm", value: broker },
          { label: "Tenure", value: `${vitals.tenureYears.toFixed(1)} yrs · since ${firstCall}` },
          { label: "Risk per call", value: riskPerCall, mono: true },
        ]}
      />

      {/* ── Verdict — bold conclusion line. */}
      <IntelVerdict tag={verdictTag} tone={verdictTone}>
        {verdictBody}
      </IntelVerdict>
    </VitalsPanelShell>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   EDGE & RISK PANEL — opens from cell 2 (Risk ⇄ Win rate).
   The "how often they're right and what they bet on each call" view.
   ───���������─────────────────────────────────────────────────────────────── */
function EdgeRiskPanel({
  vitals,
  monetary,
  breakdowns,
  accuracy,
  streak,
  seed,
  forecast,
  onJumpTo,
  onBack,
  onOpenProfile,
}: {
  vitals: ReturnType<typeof getOperatorVitals>
  monetary: ReturnType<typeof buildMonetaryStats>
  breakdowns: IdentityBreakdowns
  accuracy: number
  streak: number
  seed: number
  forecast: ForecastItem
  onJumpTo: (g: "account" | "edge" | "coverage") => void
  onBack: () => void
  onOpenProfile: () => void
}) {
  // Profit factor verdict — desk talk: ≥2.0 strong, ≥1.5 solid, else thin.
  const pf = monetary.profitFactor
  const pfAccent =
    pf >= 2 ? ACCENT.emerald.hex : pf >= 1.5 ? VT.amber : ACCENT.rose.hex

  // Max drawdown — derived deterministically (3.5%–8.5% range).
  const maxDD = (3.5 + (seed % 50) / 10).toFixed(1)

  // Stop honor — verified/mentor traders almost always 100%; rare slips.
  const stopHonor =
    (seed >> 3) % 7 === 0 ? "98% — 1 hold" : "100%"



  // Editorial thesis — leads with the headline numbers, exactly the
  // way a desk note would summarize an operator's edge in one line.
  const thesis = `${accuracy}% win rate on ${monetary.wins + monetary.losses} closed calls, sized at ${vitals.riskPercent.toFixed(2)}% per setup and clearing ${pf.toFixed(2)}× profit factor.`

  // Verdict — translates pf/accuracy into desk language.
  const verdictTag =
    pf >= 1.8 ? "EDGE SUPPORTED" : pf >= 1.3 ? "EDGE INTACT" : "THIN EDGE"
  const verdictTone: "aligned" | "caution" | "neutral" =
    pf >= 1.8 ? "aligned" : pf >= 1.3 ? "neutral" : "caution"
  const verdictBody =
    pf >= 1.8 && accuracy < 60
      ? `Edge runs on payout, not accuracy — winners pay ${(monetary.avgWinR).toFixed(1)}× the average loser. Treat this forecast at normal weight as long as stops stay honored.`
      : pf >= 1.8
        ? `Edge is balanced — ${accuracy}% hit rate paired with a ${pf.toFixed(2)}× profit factor. Disciplined operator, trust the call.`
        : pf >= 1.3
          ? `Edge is real but not dominant — ${pf.toFixed(2)}× profit factor leaves margin only when stops are respected. Size accordingly.`
          : `${pf.toFixed(2)}× profit factor is thin — wins barely outpace losses. Weight this forecast lighter than usual until the record builds.`

  return (
    <VitalsPanelShell
      title="Risk + edge"
      jumpTargets={[
        { key: "account", label: "Account →" },
        { key: "coverage", label: "Coverage →" },
      ]}
      onJumpTo={onJumpTo}
      onBack={onBack}
    >
      {/* ── Thesis — opening editorial sentence. */}
      <IntelThesis>{thesis}</IntelThesis>

      {/* ── LEAD VISUAL (Risk-only) — comparative R-pair scale.
          The only place in the popup where avg winner and avg loser
          are visually placed side-by-side on a shared axis, so the
          viewer instantly grasps the payout asymmetry that IS the edge. */}
      <RPairScale winR={monetary.avgWinR} lossR={-1.0} />

      {/* ── Editorial ledger — 6 edge mechanics, no truncation. */}
      <IntelLedger
        rows={[
          { label: "Closed calls", value: `${monetary.wins + monetary.losses}`, mono: true },
          {
            label: "Win rate",
            value: `${accuracy}%`,
            accent: accuracy >= 60 ? ACCENT.emerald.hex : VT.paper,
            mono: true,
          },
          {
            label: "Risk / call",
            value: `${vitals.riskPercent.toFixed(2)}%`,
            mono: true,
          },
          {
            label: "Profit factor",
            value: `${pf.toFixed(2)}×`,
            accent: pfAccent,
            mono: true,
          },
          {
            label: "Stop honor",
            value: stopHonor,
            accent: stopHonor === "100%" ? ACCENT.emerald.hex : VT.amber,
          },
          {
            label: "Drawdown",
            value: `${maxDD}% peak`,
            accent:
              parseFloat(maxDD) <= 5 ? ACCENT.emerald.hex : VT.amber,
            mono: true,
          },
        ]}
      />

      {/* ── Verdict — bold conclusion. */}
      <IntelVerdict tag={verdictTag} tone={verdictTone}>
        {verdictBody}
      </IntelVerdict>
    </VitalsPanelShell>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   COVERAGE PANEL — opens from cell 3 (Calls ⇄ Desk).
   The "where and when they post, on what" view.
   ─────────────────────────────────────────────────────────────────── */
function CoveragePanel({
  vitals,
  calls,
  breakdowns,
  splits,
  seed,
  forecast,
  onJumpTo,
  onBack,
  onOpenProfile,
}: {
  vitals: ReturnType<typeof getOperatorVitals>
  calls: number
  breakdowns: IdentityBreakdowns
  splits: ReturnType<typeof buildExtendedSplits>
  seed: number
  forecast: ForecastItem
  onJumpTo: (g: "account" | "edge" | "coverage") => void
  onBack: () => void
  onOpenProfile: () => void
}) {
  const topInstrument = breakdowns.instruments
    .slice()
    .sort((a, b) => b.acc - a.acc)[0]

  const topSession = splits.sessions.slice().sort((a, b) => b.acc - a.acc)[0]
  const secondSession = splits.sessions.slice().sort((a, b) => b.acc - a.acc)[1]

  // Avg time-to-resolve — derived deterministically (0.8–3.5 days).
  const avgTTR = (0.8 + (seed % 28) / 10).toFixed(1)

  // ── Forecast-vs-zone confluence model.
  //    Classifies the current forecast's instrument into a market
  //    family, then compares against the trader's top market family.
  //    The result drives BOTH the alignment lead visual AND the
  //    final verdict line, so the view always answers the question
  //    "Does THIS forecast fit their proven coverage?" first. ──── */
  const confluence = useMemo(() => {
    const forecastSymbol = (forecast.instrument ?? "").toUpperCase()
    const topName = topInstrument.name.toUpperCase()

    const isIndices = (sym: string) =>
      /\b(NAS|SPX|US30|DOW|DAX|GER40|UK100|FTSE|JP225|NIKK)\b/.test(sym)
    const isMetals = (sym: string) => /\b(XAU|XAG|GOLD|SILVER)\b/.test(sym)
    const isCrypto = (sym: string) => /\b(BTC|ETH|SOL|XRP|DOGE)\b/.test(sym)
    const isFX = (sym: string) =>
      sym.length === 6 ||
      /\b(EUR|GBP|USD|JPY|AUD|CAD|CHF|NZD)\b/.test(sym)

    const familyOf = (sym: string) =>
      isIndices(sym)
        ? "indices"
        : isMetals(sym)
          ? "metals"
          : isCrypto(sym)
            ? "crypto"
            : isFX(sym)
              ? "fx"
              : "other"

    const forecastFamily = familyOf(forecastSymbol)
    const topFamily = familyOf(topName)

    const familyMatch =
      forecastFamily !== "other" && forecastFamily === topFamily
    const sampleThin = calls < 12

    const match: "full" | "partial" | "outside" = sampleThin
      ? "partial"
      : familyMatch
        ? "full"
        : "outside"

    // Display label for the trader's top zone family.
    const topFamilyLabel =
      topFamily === "indices"
        ? "Indices"
        : topFamily === "metals"
          ? "Metals"
          : topFamily === "crypto"
            ? "Crypto"
            : topFamily === "fx"
              ? "Forex"
              : topInstrument.name

    return {
      forecastSymbol: forecastSymbol || "—",
      topFamilyLabel,
      match,
      familyMatch,
      sampleThin,
    }
  }, [forecast.instrument, topInstrument, calls])

  // Editorial thesis — frames where the trader's coverage actually lives.
  const thesis = `${calls} verified calls clustered on ${topInstrument.name} during the ${topSession.name.toLowerCase()} session from the ${vitals.desk.city} desk.`

  // Final verdict tag + body — driven by the confluence model.
  const verdictTag =
    confluence.match === "full"
      ? "COVERAGE MATCH"
      : confluence.match === "partial"
        ? "BUILDING COVERAGE"
        : "OUTSIDE ZONE"
  const verdictTone: "aligned" | "caution" | "neutral" =
    confluence.match === "full"
      ? "aligned"
      : confluence.match === "partial"
        ? "neutral"
        : "caution"
  const verdictBody =
    confluence.match === "full"
      ? `Current ${confluence.forecastSymbol} call sits inside the trader's strongest coverage zone — ${topInstrument.name} hits at ${topInstrument.acc}%. Weight the forecast at normal conviction.`
      : confluence.match === "partial"
        ? `Only ${calls} calls on file so far — coverage signal is still building. Use the forecast as a directional read rather than established authority.`
        : `Strongest on ${topInstrument.name} during ${topSession.name.toLowerCase()} — this ${confluence.forecastSymbol} call is outside their proven family. Discount the conviction.`

  return (
    <VitalsPanelShell
      title="Coverage map"
      jumpTargets={[
        { key: "account", label: "Account →" },
        { key: "edge", label: "Risk →" },
      ]}
      onJumpTo={onJumpTo}
      onBack={onBack}
    >
      {/* ── Thesis — opening editorial sentence. */}
      <IntelThesis>{thesis}</IntelThesis>

      {/* ── LEAD VISUAL (Coverage-only) — forecast vs. top-zone strip.
          The only place in the popup where the CURRENT forecast is
          visually placed side-by-side with the trader's strongest
          coverage zone, so the alignment verdict is visible before
          the ledger rows are even read. */}
      <CoverageAlignment
        forecastSymbol={confluence.forecastSymbol}
        forecastSession={`${vitals.desk.city} desk`}
        topMarket={topInstrument.name}
        topSession={`${topSession.name} session`}
        match={confluence.match}
      />

      {/* ── Editorial ledger — 6 coverage facts. */}
      <IntelLedger
        rows={[
          { label: "Verified calls", value: `${calls}`, mono: true },
          { label: "Audit", value: "100% verified", accent: ACCENT.emerald.hex },
          {
            label: "Top market",
            value: `${topInstrument.name} · ${topInstrument.acc}%`,
            accent: ACCENT.emerald.hex,
          },
          {
            label: "Top session",
            value: `${topSession.name} · ${topSession.acc}%`,
            accent: topSession.acc >= 75 ? ACCENT.emerald.hex : VT.paper,
          },
          {
            label: "Second session",
            value: `${secondSession.name} · ${secondSession.acc}%`,
          },
          { label: "Avg resolve", value: `${avgTTR}d`, mono: true },
        ]}
      />

      {/* ── Verdict — direct alignment conclusion. */}
      <IntelVerdict tag={verdictTag} tone={verdictTone}>
        {verdictBody}
      </IntelVerdict>
    </VitalsPanelShell>
  )
}

/* ── RAIL MATRIX — open 2×2 surface used by both Operator Vitals and
   Operator Edge so the two sections visually rhyme. No outer border,
   no inner solid hairlines. Separation comes from:
     · per-quadrant radial vignette (passed via RailMetric.tintRgb)
     · a center crosshair built from gradients that fade to transparent
       at the ends (the cross is felt at the middle, gone at the edges)
     · ONE slow luminous drift down the vertical center axis (14s loop,
       ease-in-out, prefers-reduced-motion respected)
   Named "Rail*" (not "Dossier*") to avoid the existing DossierCell
   primitive used by TrackRecordPanel further down in this file. ── */
function RailMatrix({
  children,
  driftDelay = 0,
}: {
  children: React.ReactNode
  driftDelay?: number
}) {
  return (
    <div
      className="relative grid grid-cols-2"
      style={{
        // Faint cool surface tint — the tonal counterpoint to
        // ProfileFacts' warm paper tint. Together they make the two
        // groups feel like sibling chapters of one dossier without any
        // visible chrome separating them.
        backgroundImage:
          "radial-gradient(140% 90% at 50% 0%, rgba(56,189,248,0.018) 0%, transparent 60%)",
      }}
    >
      {/* Vertical dissolving axis — 60% of card height, fades to 0 at top
          and bottom so it never reads as a stamped border. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[20%] bottom-[20%] w-px"
        style={{
          transform: "translateX(-0.5px)",
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
      />
      {/* Horizontal dissolving axis — 60% of card width, same dissolve. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[20%] right-[20%] h-px"
        style={{
          transform: "translateY(-0.5px)",
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
      />
      {/* Slow ambient drift — luminous slug travels down the center
          vertical only. Premium dossier signal, never meant to be
          noticed on first read. Hidden under reduced-motion. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[20%] bottom-[20%] w-px motion-reduce:hidden"
        initial={false}
        animate={{ backgroundPositionY: ["0% 0%", "0% 100%"] }}
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Infinity,
          delay: driftDelay,
        }}
        style={{
          transform: "translateX(-0.5px)",
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, transparent 38%, rgba(255,255,255,0.20) 50%, transparent 62%, transparent 100%)",
          backgroundSize: "100% 300%",
        }}
      />
      {children}
    </div>
  )
}

/* ── RAIL METRIC — single quadrant of the rail's ALIVE proof surface.

   Used ONLY by OperatorEdge (the credibility-evidence group). This is
   the alive sibling of ProfileFacts above — it reads as a live ticker:
     · clickable (entire tile routes to analyst profile)
     · hover lift + chevron reveal
     · accent-aware values get a subtle text-shadow glow so positive
       proof (high win rate, strong avg winner) reads as a signal, not
       as a number on a page
     · supports rotating content (Avg Winner ⇄ Avg Loser, Best On...)

   Carries the tonal vignette via radial-gradient; no outline, no
   background fill. Named "Rail*" to avoid colliding with the existing
   DossierCell primitive used by TrackRecordPanel further down. */
function RailMetric({
  label,
  value,
  sub,
  valueAccent,
  tintRgb,
  /** Render-prop overrides the value+sub region for rotating tiles. */
  rotatorKey,
  onClick,
  onHoverChange,
  hoverChevron = false,
}: {
  label: string
  value: string
  sub: string
  valueAccent?: string
  tintRgb: string
  rotatorKey?: string
  onClick?: () => void
  onHoverChange?: (hovered: boolean) => void
  hoverChevron?: boolean
}) {
  const interactive = !!onClick

  // Subtle text-shadow glow on accent-colored values — the small
  // alive-ness signal that distinguishes the proof matrix from the
  // calm operator-context matrix above. Only fires when an accent is
  // explicitly set (e.g. emerald for strong win-rate / avg-winner);
  // neutral paper values stay flat. Never bright enough to read as
  // neon — premium dossier glow, not gaming UI.
  const valueShadow =
    valueAccent && valueAccent !== VT.paper
      ? `0 0 18px ${rgba(tintRgb, 0.28)}`
      : "none"

  const valueStyle: React.CSSProperties = {
    fontSize: 19,
    fontWeight: 500,
    color: valueAccent ?? VT.paper,
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
    textShadow: valueShadow,
  }

  const body = (
    <>
      <span
        className="font-sans truncate max-w-full"
        style={{
          fontSize: 9.5,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      {rotatorKey ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={rotatorKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, ease: VT.easeOut }}
            className="flex flex-col items-center justify-center gap-1.5"
          >
            <span
              className="font-sans tabular-nums truncate max-w-full"
              style={valueStyle}
            >
              {value}
            </span>
            <span
              className="font-sans truncate max-w-full"
              style={{
                fontSize: 9.5,
                color: VT.ashGhost,
                fontWeight: 400,
                letterSpacing: "-0.005em",
                lineHeight: 1.1,
              }}
            >
              {sub}
            </span>
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          <span
            className="font-sans tabular-nums truncate max-w-full"
            style={valueStyle}
          >
            {value}
          </span>
          <span
            className="font-sans truncate max-w-full"
            style={{
              fontSize: 9.5,
              color: VT.ashGhost,
              fontWeight: 400,
              letterSpacing: "-0.005em",
              lineHeight: 1.1,
            }}
          >
            {sub}
          </span>
        </>
      )}
    </>
  )

  const cellStyle: React.CSSProperties = {
    padding: "18px 16px",
    minHeight: 96,
    // Per-quadrant tonal vignette — soft top-down radial that fades to
    // transparent at 65%, max alpha 0.030. Zero borders drawn.
    background: `radial-gradient(120% 100% at 50% 0%, ${rgba(tintRgb, 0.030)} 0%, transparent 65%)`,
    cursor: interactive ? "pointer" : "default",
  }

  if (!interactive) {
    return (
      <div
        className="relative flex flex-col items-center justify-center gap-1.5 text-center"
        style={cellStyle}
      >
        {body}
      </div>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15, ease: VT.easeOut }}
      className="group relative flex flex-col items-center justify-center gap-1.5 text-center select-none"
      style={cellStyle}
    >
      {body}
      {hoverChevron && (
        <ChevronRight
          size={11}
          strokeWidth={1.6}
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: VT.ashGhost }}
        />
      )}
    </motion.button>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   RECENT FORM — last 6 outcomes as semantic tiles.
   Replaces the old "On this setup" specialty band with a far more
   universally useful signal: is this analyst on a hot streak right
   now, or are they cooling off? Each tile shows a W / L / E badge
   (semantic colour) with the realised R-multiple, plus a small "now
   ← N days ago" axis label so the timeline is unambiguous.

   Aggregate accuracy can hide a 5-loss skid behind an old hot run;
   this panel can't. Single most decision-impactful dossier band.
   ══════════════��═════════════════════════════════════════════════════════ */
function RecentForm({
  recent,
  onOpenTrade,
}: {
  recent: ReturnType<typeof buildRecentForm>
  /* Optional safe callback. If the parent provides one, each capsule
     becomes a button that opens that trade's detail view. If absent,
     each capsule renders as a static <div> — never crashes. */
  onOpenTrade?: (trade: ReturnType<typeof buildRecentForm>[number], index: number) => void
}) {
  const wins = recent.filter((r) => r.outcome === "win").length
  const losses = recent.filter((r) => r.outcome === "loss").length
  const expired = recent.filter((r) => r.outcome === "expired").length
  const summary = [
    `${wins} wins`,
    `${losses} losses`,
    expired > 0 ? `${expired} expired` : null,
  ]
    .filter(Boolean)
    .join(" · ")

  // Tiny helper — "today", "1d", "2d"... so the date line stays compact.
  const fmtDaysAgo = (d: number) => (d === 0 ? "today" : `${d}d ago`)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        {/* "Last 5 trades" — narrower than the old 6-tile row, which
            gives each capsule the headroom it needs to carry pair +
            direction + result + date without anything truncating. */}
        <Eyebrow size={10}>Last 5 trades</Eyebrow>
        <Caption size={10} color={VT.ashSoft}>
          {summary}
        </Caption>
      </div>

      {/* Capsule row — newest on the LEFT. Each capsule is now a small
          trade card with four micro-lines (pair / dir·TF / result / date)
          instead of the single W·R glyph from before. Click is wired to
          the optional onOpenTrade callback. */}
      <div className="grid grid-cols-5 gap-1.5">
        {recent.map((t, i) => {
          const isWin = t.outcome === "win"
          const isLoss = t.outcome === "loss"
          const tone = isWin
            ? ACCENT.emerald.hex
            : isLoss
              ? ACCENT.rose.hex
              : VT.amber
          const toneRgb = isWin
            ? ACCENT.emerald.rgb
            : isLoss
              ? ACCENT.rose.rgb
              : "245,158,11"
          const rValue =
            t.outcome === "expired"
              ? "EXP"
              : `${t.r > 0 ? "+" : ""}${t.r.toFixed(1)}R`
          const dirGlyph = t.direction === "Long" ? "▲" : "▼"

          const cellStyle: React.CSSProperties = {
            minHeight: 86,
            padding: "8px 6px",
            borderRadius: 9,
            background: `rgba(${toneRgb},0.05)`,
            border: `1px solid rgba(${toneRgb},${i === 0 ? 0.3 : 0.16})`,
            boxShadow:
              i === 0
                ? `0 0 8px rgba(${toneRgb},0.16), 0 1px 0 rgba(255,255,255,0.04) inset`
                : `0 1px 0 rgba(255,255,255,0.03) inset`,
            cursor: onOpenTrade ? "pointer" : "default",
          }

          const inner = (
            <div className="flex h-full flex-col items-center justify-between gap-0.5">
              {/* Pair — the dominant glyph; tiny but bold. */}
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: VT.paper,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.pair}
              </span>
              {/* Direction · timeframe — desk shorthand */}
              <span
                className="font-sans"
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  color: tone,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  opacity: 0.9,
                }}
              >
                {dirGlyph} {t.timeframe}
              </span>
              {/* Result in R */}
              <span
                className="font-mono tabular-nums"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: tone,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {rValue}
              </span>
              {/* When */}
              <span
                className="font-sans"
                style={{
                  fontSize: 9,
                  fontWeight: 400,
                  color: VT.ashGhost,
                  letterSpacing: "-0.005em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {fmtDaysAgo(t.daysAgo)}
              </span>
            </div>
          )

          if (onOpenTrade) {
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenTrade(t, i)
                }}
                style={cellStyle}
                className="select-none transition-transform hover:-translate-y-px focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                aria-label={`${t.pair} ${t.direction} ${t.timeframe} ${rValue} ${fmtDaysAgo(t.daysAgo)}`}
              >
                {inner}
              </button>
            )
          }
          return (
            <div key={i} style={cellStyle}>
              {inner}
            </div>
          )
        })}
      </div>

      {/* axis legend so left/right ordering is unambiguous */}
      <div className="flex items-center justify-between -mt-0.5">
        <Caption size={9.5} color={VT.ashGhost}>
          Latest call
        </Caption>
        <Caption size={9.5} color={VT.ashGhost}>
          5 calls ago
        </Caption>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   RIGHT-RAIL HELPERS — small primitives for the refinement pass.
   Kept in this file (not exported) so the popup is self-contained.
   ════════════════════════════════════════════════════════════════════════ */

/* Asset-class → representative ticker. Used by the rotating "Best on"
   tile in OperatorEdge to translate breakdown classes into the tickers
   traders actually scan for. */
const PAIR_TICKER_BY_CLASS: Record<string, string> = {
  Forex: "EURUSD",
  Crypto: "BTCUSD",
  Indices: "NAS100",
  Commodities: "XAUUSD",
}

/* useRotator — quietly rotates a stable list every `intervalMs`. Pauses
   on hover via the `paused` arg. Returns the active item plus its index
   so callers can key AnimatePresence cleanly. Bloomberg-quiet: no jitter,
   no overlap, no auto-restart on prop change. */
function useRotator<T>(items: T[], intervalMs: number, paused = false) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (paused || items.length <= 1) return
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % items.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [items.length, intervalMs, paused])
  return { item: items[idx], idx }
}

/* ══════════════��═════════════════════════════════════════════════════════
   OPERATOR EDGE — compressed credibility intelligence dossier.

   Right-rail refinement pass:
     · the previous "Operator Edge" header eyebrow + form-chip-as-header
       have been removed (the rail now uses opacity-graded separation
       instead of a stack of generic section labels)
     · the trust line is gone (its information lives in the identity
       block's signature line above, where it belongs)
     · the 4 proof tiles share a unified hairline-grid skeleton with
       inner column / row dividers — softer separation, cleaner
       hierarchy, no chunky bordered boxes
     · tiles 3 + 4 quietly rotate (Avg Winner ⇄ Avg Loser, Best on
       cycles strongest pairs) on independent cadences
   ════════════════════════════════════════════════════════════════════════ */
function OperatorEdge({
  calls,
  accuracy,
  streak,
  recentForm,
  breakdowns,
  monetary,
  splits,
  posterRole,
  strategy,
  forecastInstrument,
  onOpenProfile,
}: {
  calls: number
  accuracy: number
  streak: number
  recentForm: ReturnType<typeof buildRecentForm>
  breakdowns: IdentityBreakdowns
  monetary: ReturnType<typeof buildMonetaryStats>
  splits: ReturnType<typeof buildExtendedSplits>
  posterRole: PosterRole
  strategy: string
  forecastInstrument: string
  onOpenProfile: () => void
}) {
  /* ── Derivations for the rotating tiles ─────────────────────────────── */

  // Sorted-by-edge instrument list. Each becomes one frame of the
  // "Best on" rotator, paired with a session/setup-aware sub line so the
  // tile reads as evidence cycling through strongest domains.
  const SETUPS = [
    "Continuation setups",
    "Structure retests",
    "London open reversals",
    "Liquidity sweeps",
    "Asia range plays",
  ]
  const bestOnFrames = useMemo(() => {
    const ranked = [...breakdowns.instruments].sort((a, b) => b.acc - a.acc)
    const sessions = [...splits.sessions].sort((a, b) => b.acc - a.acc)
    return ranked.map((it, i) => {
      const ticker = PAIR_TICKER_BY_CLASS[it.name] ?? it.name
      const session = sessions[i % sessions.length]?.name ?? "Open"
      const setup = SETUPS[i % SETUPS.length]
      return {
        ticker,
        acc: it.acc,
        sub: i % 2 === 0 ? `${session} session edge` : setup,
      }
    })
  }, [breakdowns.instruments, splits.sessions])

  // Avg Winner / Avg Loser pair. Avg loser is anchored at -1.0R (the
  // operator's standard stop magnitude in buildMonetaryStats); we add a
  // small seed-stable variation so it doesn't read as a fake constant.
  const avgWinnerR = `+${monetary.avgWinR.toFixed(2)}R`
  const avgLoserR = `-${(0.78 + (monetary.wins % 7) / 30).toFixed(2)}R`
  const winLossFrames = [
    {
      // Avg Winner — the average size of a winning trade in R-multiples.
      // Sub flips between current winning streak (when ≥ 3) and profit
      // factor — both phrased the way traders actually say them on a
      // desk: "10W streak", "2.1x profit factor".
      label: "Avg Winner",
      value: avgWinnerR,
      valueAccent: ACCENT.emerald.hex,
      sub: streak >= 3 ? `${streak}W streak` : `${monetary.profitFactor.toFixed(2)}× profit factor`,
    },
    {
      // Avg Loser — the average size of a losing trade. "Stops respected"
      // is direct desk language for "they actually honor their stop
      // losses instead of holding losers" — far cleaner than the
      // previous "Tight stops, no martingale".
      label: "Avg Loser",
      value: avgLoserR,
      valueAccent: ACCENT.rose.hex,
      sub: "Stops respected",
    },
  ]

  /* ── Rotators — staggered cadences so the rail doesn't pulse in
        unison. Cadences slowed (was 5500/4500) so the dossier feels
        like it's quietly revealing more proof, not flipping. Crossfade
        at 0.5s ease-out is handled inside DossierCell.
        Hover pauses each tile independently. ─────────────────────────── */
  const [pauseWL, setPauseWL] = useState(false)
  const [pauseBest, setPauseBest] = useState(false)
  const wl = useRotator(winLossFrames, 7000, pauseWL)
  const best = useRotator(bestOnFrames, 5500, pauseBest)

  // The "Latest call" snapshot derivations (latestPair, latestDir,
  // latestResultLabel/Color, latestAgo) were removed in this pass when
  // the Latest Call row was deleted from the dossier — the Recent Form
  // pill rail directly below already carries the recency story.


  // The italic edge sentence and the explicit "View full profile" CTA
  // were removed in this pass — they were filler. Discoverability now
  // lives on the cells themselves: every tile + the latest call row
  // navigates to the analyst profile. `strategy` is kept on the props
  // for future role-aware wording but is unused in the current render.
  void strategy

  return (
    <div className="flex flex-col gap-4">
      {/* ── PROOF MATRIX — alive proof on TOP, calm baseline beneath.
              Same open-surface system as OperatorVitals, so the two
              sections read as paragraphs of one dossier. The ambient
              drift is offset 7s so the rail never pulses in unison.
              Every cell is clickable → profile (the dossier stays a
              preview).

              Row order rationale (re-ordered in this pass):
                Top row    — Avg W/L rotator + Best On rotator.
                             Both ALIVE (rotating, accent-colored,
                             paired evidence). Reads first because
                             "what unique edge does this operator
                             show?" is the headline of the proof
                             paragraph.
                Bottom row — Verified Calls + Win Rate.
                             Both STABLE (static value, baseline
                             credibility). Reads as the foundation
                             beneath the headline. ── */}
      <RailMatrix driftDelay={7}>
        {/* TOP-LEFT — Avg W/L paired-evidence rotator. */}
        <RailMetric
          rotatorKey={`wl-${wl.idx}`}
          label={wl.item.label}
          value={wl.item.value}
          valueAccent={wl.item.valueAccent}
          sub={wl.item.sub}
          tintRgb={wl.item.label === "Avg Winner" ? ACCENT.emerald.rgb : ACCENT.rose.rgb}
          onClick={onOpenProfile}
          onHoverChange={setPauseWL}
          hoverChevron
        />
        {/* TOP-RIGHT — Best On ticker rotator (NAS100 / XAUUSD /
            EURUSD / BTCUSD …). */}
        <RailMetric
          rotatorKey={`best-${best.idx}`}
          label={`Best on ${best.item.ticker}`}
          value={`${best.item.acc}%`}
          valueAccent={best.item.acc >= 75 ? ACCENT.emerald.hex : VT.paper}
          sub={best.item.sub}
          tintRgb={best.item.acc >= 75 ? ACCENT.emerald.rgb : "232,232,222"}
          onClick={onOpenProfile}
          onHoverChange={setPauseBest}
          hoverChevron
        />
        {/* The bottom static row (Verified Calls + Win Rate) was
            removed in this pass. Both facts are already surfaced
            elsewhere — Verified Calls lives in the operator-vitals
            strip above, and Win Rate is implied by the Avg Winner /
            Avg Loser pair shown right here in the top row. Keeping
            those static cells was duplicating signal and pushing the
            recent-form rail below the fold. The proof bento is now a
            single live row, focused on the operator's edge: Avg W/L
            paired evidence + Best On instrument. ── */}
      </RailMatrix>

      {/* The "Latest Call" row (NAS100 LONG +1.1R · today) was removed
          in this pass. The dossier already surfaces the operator's
          recent activity via the Recent Form W/L pill row directly
          below — having both was telling the same story twice and
          stretching the right rail past the fold. The Recent Form rail
          now closes the dossier paragraph on its own. ── */}
    </div>
  )
}

type IdentityMetricKey = "calls" | "accuracy" | "streak" | null

function IdentitySource({
  forecast,
  dirColor,
  delay,
  onOpenProfile,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  delay: number
  onOpenProfile: () => void
}) {
  // Defensive: tolerate forecasts whose `user` payload is missing or partial.
  const u = forecast.user ?? ({} as ForecastUser)
  const userName = u.name ?? "Unknown analyst"
  const userInitial = (userName.trim().charAt(0) || "?").toUpperCase()
  const seed = useMemo(
    () => seedFrom((u.id ?? "") + forecast.id),
    [u.id, forecast.id],
  )
  const posterRole = getPosterRole(u)
  const tone = getPosterTone(posterRole, dirColor.rgb)
  const strategy = getStrategyStyle(seed)
  const accuracy = u.overallAccuracy ?? forecast.accuracy ?? 60 + (seed % 30)
  const calls = u.resolvedCount ?? 30 + (seed % 80)
  const streak = 1 + (seed % 11)
  const memberSince = useMemo(() => {
    const months = 6 + (seed % 36)
    const d = new Date()
    d.setMonth(d.getMonth() - months)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }, [seed])
  const community =
    forecast.communityContext?.name ??
    u.communityName ??
    "Public feed"
  // Publishing context — what kind of post this is, derived from real
  // fields. Drives the right chip in the publishing ribbon.
  const postType = useMemo(() => getPostType(forecast, u), [forecast, u])

  // ── Operator dossier — capital under management, risk, tenure, desk.
  //    Stable per-forecast via seed; reads like a hedge-fund factsheet.
  const vitals = useMemo(() => getOperatorVitals(posterRole, seed), [posterRole, seed])

  // ── Resolved-call breakdowns — drives the proof strip's best-pair
  //    derivation, the recent-form sentence, and the latest-call row.
  //    Stable per-forecast via seed.
  const breakdowns = useMemo(
    () => buildIdentityBreakdowns(seed, calls, accuracy, streak),
    [seed, calls, accuracy, streak],
  )

  // ── Recent form — last 6 outcomes from the analyst's deterministic
  //    30-call history, with seeded R-multiples per result. Lets the
  //    viewer instantly see whether this analyst is hot or cooling.
  const recentForm = useMemo(
    () => buildRecentForm(seed, breakdowns.last30),
    [seed, breakdowns.last30],
  )

  // ── Monetary stats — cash-converts the track record using the
  //    operator's AUM × Risk Per Trade. Drives the Track Record panel's
  //    dollar columns (Total Risked, Realised Profit, Best/Worst Trade).
  const monetary = useMemo(
    () => buildMonetaryStats(seed, calls, accuracy, vitals.aum, vitals.riskPercent),
    [seed, calls, accuracy, vitals.aum, vitals.riskPercent],
  )

  // ── Extended splits — direction (long/short) + session (London/NY/Asia)
  //    breakdowns used by the Win Rate panel.
  const splits = useMemo(
    () => buildExtendedSplits(seed, accuracy),
    [seed, accuracy],
  )

  /* ── Collapsed-by-default dossier ──────────────────────────────────
     The identity card opens as a quiet "passport" — just avatar +
     name + community + location + member-since. Tapping it expands
     in-place to reveal the operator vitals, recent form, and edge
     bento. Tapping again collapses. The full-profile navigation lives
     on the inner cells (each OperatorVitals / OperatorEdge cell, and a
     dedicated "View full profile" button at the bottom of the
     expanded body). This makes the dossier feel like a calling card
     that earns the reader's curiosity, instead of dumping six rows
     of stats unprompted. ─────────────────────────────────────────── */
  /* Hover-driven reveal with a click "latch":
       · Hover or keyboard focus uncovers the body.
       · The moment the user clicks anywhere inside the dossier
         (AUM cell, Years Active, Session, Risk, Verified Calls,
         a trade pill, an Edge cell, the View-full-profile CTA),
         we LATCH the open state — so when they move the cursor
         away the card stays uncovered as the primary view.
     Latched state intentionally has no automatic close path: the
     user explicitly chose to engage, the dossier stays open for
     them while they read or navigate. ────────────────────────── */
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const [latched, setLatched] = useState(false)
  const open = hover || focused || latched

  return (
    <GlassCard accentRgb={tone.rgb} delay={delay}>
      {/* Hover/focus is tracked at the OUTER wrapper so the entire
          dossier (header + revealed body) keeps the card open while
          the cursor is anywhere inside it. A pointerDown listener at
          this level also latches the open state on any click within
          the dossier, so subsequent mouse-away does not collapse it. */}
      <motion.div
        className="flex flex-col"
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerDown={() => setLatched(true)}
      >
        {/* ── HEADER (always visible, hover to reveal) ───────────────
            The header is the entire passport: avatar, name, community
            line, desk + member-since line, plus a rotating chevron.
            Hovering anywhere on the card reveals the body below. */}
        <motion.div
          tabIndex={0}
          aria-expanded={open}
          aria-label={`${userName}'s dossier — hover to see stats`}
          className="relative flex items-start gap-4"
          style={{ outline: "none" }}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.25, ease: VT.easeOut }}
        >
          {/* Soft accent halo — breathes into view alongside the body
              so the hover state feels like the card warming up. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute"
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.3, ease: VT.easeOut }}
            style={{
              inset: -10,
              borderRadius: 18,
              background: `radial-gradient(120% 100% at 50% 50%, ${rgba(tone.rgb, 0.08)}, transparent 70%)`,
            }}
          />

          {/* Avatar with role-aware ring */}
          <div className="relative flex-shrink-0">
            <div
              className="flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: `linear-gradient(155deg, ${rgba(tone.rgb, 0.32)}, ${rgba(tone.rgb, 0.06)})`,
                border: `1px solid ${rgba(tone.rgb, 0.42)}`,
                boxShadow: `inset 0 0 24px ${rgba(tone.rgb, 0.18)}, 0 4px 12px ${rgba(tone.rgb, 0.18)}`,
              }}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: tone.hex,
                  letterSpacing: "-0.04em",
                }}
              >
                {userInitial}
              </span>
            </div>
            {/* Role overlay badge */}
            {posterRole === "mentor" && (
              <div
                className="absolute -top-1 -right-1 flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: VT.amber,
                  border: "2px solid rgba(0,0,0,0.6)",
                }}
              >
                <Crown size={9} strokeWidth={2.4} style={{ color: "rgba(0,0,0,0.85)" }} />
              </div>
            )}
            {posterRole === "verified" && (
              <div
                className="absolute -top-1 -right-1 flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: VT.emerald,
                  border: "2px solid rgba(0,0,0,0.6)",
                }}
              >
                <ShieldCheck size={9} strokeWidth={2.4} style={{ color: "rgba(0,0,0,0.85)" }} />
              </div>
            )}
          </div>

          {/* Identity right-column — THREE composed rows so the
              community name (which traders care about) gets full real
              estate and never truncates:
                Row 1 — Name + verified check, with a rotating chevron
                        on the far right that telegraphs the expand
                        affordance.
                Row 2 — [source-icon] {Community}. Wraps freely so a
                        long name like "Smart Money Concepts Pro"
                        reads in full. This is the marquee detail of
                        the passport and earns its own line.
                Row 3 — {Desk} desk · Member since {date}. The
                        secondary biographicals.
              Public-feed fallback collapses Row 2 to "Public feed"
              with the globe icon. */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5 relative">
            {/* ── Row 1: Name + verified + chevron toggle ────────── */}
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3
                  className="font-sans truncate"
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: VT.paper,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.05,
                  }}
                >
                  {userName}
                </h3>
                {u.isVerified && !u.isMentor && (
                  <CheckCircle2
                    size={13}
                    strokeWidth={2.4}
                    style={{ color: ACCENT.emerald.hex, flexShrink: 0 }}
                  />
                )}
              </div>

              {/* Chevron indicator — rotates 180° smoothly while the
                  body is uncovered, and picks up an accent tint to
                  reinforce that the passport is "live". */}
              <motion.div
                aria-hidden
                animate={{
                  rotate: open ? 180 : 0,
                  backgroundColor: open
                    ? rgba(tone.rgb, 0.16)
                    : "rgba(255,255,255,0.04)",
                  borderColor: open
                    ? rgba(tone.rgb, 0.45)
                    : "rgba(255,255,255,0.08)",
                  color: open ? tone.hex : VT.ashSoft,
                }}
                transition={{ duration: 0.35, ease: VT.easeOut }}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <ChevronDown size={12} strokeWidth={2.2} />
              </motion.div>
            </div>

            {/* ── Row 2: Source icon + Community (FULL, no truncate) ──
                When the post has no real community attached (the
                public-feed fallback), we suppress this row entirely
                — the publishing-context icon migrates to Row 3 next
                to the desk label, so the passport never displays a
                literal "Public feed" string. */}
            {(() => {
              const SourceIcon = postType.Icon
              const norm = (s: string) => s.trim().toLowerCase()
              const isFallback =
                norm(community) === norm(postType.label) ||
                norm(community) === "public feed" ||
                norm(community) === "public"
              if (isFallback) return null
              return (
                <div className="flex items-center gap-1.5 min-w-0">
                  <SourceIcon
                    size={11}
                    strokeWidth={1.8}
                    style={{
                      color: postType.hex,
                      flexShrink: 0,
                      opacity: 0.95,
                    }}
                    aria-hidden
                  />
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 11,
                      color: VT.paper,
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.2,
                      opacity: 0.92,
                      /* No truncate, no ellipsis — the community name
                         earns its own line and wraps if it absolutely
                         must on extremely narrow screens. */
                    }}
                  >
                    {community}
                  </span>
                </div>
              )
            })()}

            {/* ── Row 3: Desk · Member since (own row, no truncate) ──
                Leads with the publishing-context icon (the same one
                that prefixes Row 2), tinted to the post-type tone, so
                the passport reads as one continuous biographical line
                even when the explicit Public-feed row is suppressed. */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(() => {
                const SourceIcon = postType.Icon
                return (
                  <SourceIcon
                    size={11}
                    strokeWidth={1.8}
                    style={{
                      color: postType.hex,
                      flexShrink: 0,
                      opacity: 0.95,
                    }}
                    aria-hidden
                  />
                )
              })()}
              <span
                className="font-sans"
                style={{
                  fontSize: 10.5,
                  color: VT.ashSoft,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.2,
                }}
              >
                {vitals.desk.city} desk
              </span>
              <span
                aria-hidden
                style={{
                  width: 2,
                  height: 2,
                  borderRadius: 999,
                  background: VT.ashGhost,
                  opacity: 0.6,
                  flexShrink: 0,
                }}
              />
              <span
                className="font-sans"
                style={{
                  fontSize: 10.5,
                  color: VT.ashGhost,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.2,
                }}
              >
                Member since {memberSince}
              </span>
            </div>

          </div>
        </motion.div>

        {/* ── COLLAPSIBLE BODY ─────────────────────────────────────
            Operator vitals, recent form, and operator edge live
            inside an AnimatePresence height + opacity collapse so the
            passport reveals its full evidence trail only when the
            reader chooses to open it. The inner content fades in with
            a staggered ladder so each paragraph (vitals → recent
            form → edge → CTA) arrives in turn rather than all at
            once — a 220ms cascade that makes the expand feel like
            curtains parting, not a jump-cut. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="dossier-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.42, ease: VT.easeOut },
                opacity: { duration: 0.3, ease: VT.easeOut },
              }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                className="flex flex-col gap-7"
                style={{ paddingTop: 24 }}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
                }}
              >
                {/* ── PROFILE METRICS — 3-cell rotating context strip.
                    Each cell quietly cycles through 2 thematic facts:
                      · Scale       — Capital Managed ⇄ Years Active
                      · Discipline  — Risk Per Trade  ⇄ Win Rate
                      · Environment — Verified Calls  ⇄ Trading Desk
                    Hover pauses each cell's rotation independently. ── */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: VT.easeOut } },
                  }}
                >
                  <OperatorVitals
                    vitals={vitals}
                    accuracy={accuracy}
                    calls={calls}
                    monetary={monetary}
                    breakdowns={breakdowns}
                    splits={splits}
                    seed={seed}
                    posterRole={posterRole}
                    streak={streak}
                    forecast={forecast}
                    onOpenProfile={onOpenProfile}
                  />
                </motion.div>

                {/* ── RECENT FORM — last 6 outcomes as semantic tiles. */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: VT.easeOut } },
                  }}
                >
                  <RecentForm recent={recentForm} />
                </motion.div>

                {/* ── OPERATOR EDGE — compressed proof. */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: VT.easeOut } },
                  }}
                >
                  <OperatorEdge
                    calls={calls}
                    accuracy={accuracy}
                    streak={streak}
                    recentForm={recentForm}
                    breakdowns={breakdowns}
                    monetary={monetary}
                    splits={splits}
                    posterRole={posterRole}
                    strategy={strategy}
                    forecastInstrument={forecast.instrument}
                    onOpenProfile={onOpenProfile}
                  />
                </motion.div>

                {/* ── VIEW FULL PROFILE CTA ───���────────────────────
                    The "go deeper" exit point. The dossier is a
                    preview; the full profile is the deep-read. We
                    surface that path explicitly here so the user
                    doesn't have to figure out that the OperatorVitals
                    cells are clickable. */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenProfile()
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: VT.easeOut } },
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className="font-sans inline-flex items-center justify-center gap-2 self-stretch"
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    letterSpacing: "0.005em",
                    color: tone.hex,
                    padding: "10px 14px 11px",
                    borderRadius: 12,
                    background: rgba(tone.rgb, 0.06),
                    border: `1px solid ${rgba(tone.rgb, 0.28)}`,
                    cursor: "pointer",
                    lineHeight: 1.1,
                  }}
                >
                  View full profile
                  <ArrowUpRight size={12} strokeWidth={2} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GlassCard>
  )
}

/* ── PUBLISHING RIBBON — two real chips that answer "where is this
   forecast being broadcast?". Community chip is toned to the operator's
   role; post-type chip is paper-soft. Real fields only — no fluff. */
function PublishingRibbon({
  community,
  postType,
}: {
  community: string
  postType: { label: string; hex: string; rgb: string; Icon: LucideIcon }
}) {
  // De-dupe rule — when the operator has NO real community, the
  // fallback `community` string is "Public feed" which collides with
  // the post-type chip ("Public Feed"). Rendering both as
  // "[icon] Public feed · PUBLIC FEED" reads as a UI bug. In that
  // case we suppress the community chip — the post-type chip alone
  // carries the publishing context, and we never invent a community
  // name we don't have.
  const norm = (s: string) => s.trim().toLowerCase()
  const hideCommunityChip =
    norm(community) === norm(postType.label) ||
    norm(community) === "public feed" ||
    norm(community) === "public"
  const SourceIcon = postType.Icon

  return (
    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
      {!hideCommunityChip && (
        // Community / source chip — the source-stamp icon (chosen by
        // post type so they always agree) replaces the prior `#`
        // symbol so the chip reads as a real publishing stamp inside
        // an institutional terminal, not plain text. Tone-tinted to
        // the publishing context's color family.
        <span
          className="inline-flex items-center gap-1.5 pl-1.5 pr-2 min-w-0"
          style={{
            height: 22,
            borderRadius: 999,
            background: rgba(postType.rgb, 0.10),
            border: `1px solid ${rgba(postType.rgb, 0.26)}`,
          }}
          title={community}
        >
          <SourceIcon
            size={11}
            strokeWidth={1.7}
            style={{ color: postType.hex, flexShrink: 0, opacity: 0.95 }}
            aria-hidden
          />
          <span
            className="font-sans truncate max-w-[160px]"
            style={{
              fontSize: 10.5,
              color: VT.paper,
              fontWeight: 500,
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
          >
            {community}
          </span>
        </span>
      )}
      {/* Post-type chip — kept separate so the viewer can clearly read
          (a) which community this came from and (b) what publishing
          context it was posted under. Caps eyebrow + status dot. */}
      <span
        className="inline-flex items-center gap-1.5 px-2"
        style={{
          height: 22,
          borderRadius: 999,
          background: rgba(postType.rgb, 0.06),
          border: `1px solid ${rgba(postType.rgb, 0.18)}`,
        }}
      >
        <span
          aria-hidden
          className="rounded-full"
          style={{
            width: 4,
            height: 4,
            background: postType.hex,
            boxShadow: `0 0 4px ${rgba(postType.rgb, 0.55)}`,
          }}
        />
        <span
          className="font-sans"
          style={{
            fontSize: 9.5,
            color: VT.ashSoft,
            fontWeight: 500,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {postType.label}
        </span>
      </span>
    </div>
  )
}

/* ── POST TYPE — derived from real fields on ForecastItem / ForecastUser.

   Returns BOTH the post-type label AND the source-stamp icon component
   that should render next to the community/group name. The icon and
   post-type tone always agree, so the identity ribbon reads as a
   single, coherent publishing stamp:

     · isMentor                                 → Mentor Desk      [Crown]
     · isVerified + community + acc ≥ 70        → Community Signal [ShieldCheck]
     · isVerified + community                   → Premium Forecast [ShieldCheck]
     · communityContext only                    → Community Post   [Users]
     · default                                  → Public Feed      [Globe]

   Tone matches semantic weight: amber for mentor, emerald for
   verified-signal, cyan for community, paper for public. */
function getPostType(
  forecast: ForecastItem,
  user: ForecastUser,
): { label: string; hex: string; rgb: string; Icon: LucideIcon } {
  const inCommunity = !!forecast.communityContext
  const accuracy = user.overallAccuracy ?? 0
  if (user.isMentor) {
    return { label: "Mentor Desk", hex: VT.amber, rgb: VT.amberRgb, Icon: Crown }
  }
  if (user.isVerified && inCommunity && accuracy >= 70) {
    return {
      label: "Community Signal",
      hex: ACCENT.emerald.hex,
      rgb: ACCENT.emerald.rgb,
      Icon: ShieldCheck,
    }
  }
  if (user.isVerified && inCommunity) {
    return {
      label: "Premium Forecast",
      hex: ACCENT.emerald.hex,
      rgb: ACCENT.emerald.rgb,
      Icon: ShieldCheck,
    }
  }
  if (inCommunity) {
    return { label: "Community Post", hex: VT.cyan, rgb: VT.cyanRgb, Icon: Users }
  }
  return { label: "Public Feed", hex: VT.paper, rgb: "232,232,222", Icon: Globe }
}

/** Single credibility metric — icon eyebrow + value. Clickable variant
    opens a breakdown tray under the grid. */
function CredibilityMetric({
  icon: Icon,
  label,
  value,
  color = VT.paper,
  active = false,
  onClick,
}: {
  icon: LucideIcon
  label: string
  value: string
  color?: string
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick(e as unknown as React.MouseEvent)
              }
            }
          : undefined
      }
      className="flex flex-col gap-1.5 select-none transition-colors"
      style={{
        cursor: onClick ? "pointer" : "default",
        padding: onClick ? "8px 8px" : 0,
        margin: onClick ? "-8px -8px" : 0,
        borderRadius: 10,
        background: active ? "rgba(255,255,255,0.045)" : "transparent",
        outline: active ? `1px solid ${VT.rule}` : "none",
      }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={11} strokeWidth={1.7} style={{ color: active ? color : VT.ashSoft }} />
        <span
          className="font-sans truncate"
          style={{
            fontSize: 10.5,
            color: active ? color : VT.ashSoft,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        {onClick && (
          <ChevronDown
            size={10}
            strokeWidth={1.8}
            style={{
              color: active ? color : VT.ashSoft,
              transform: active ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              marginLeft: "auto",
            }}
          />
        )}
      </div>
      <StatNumber value={value} size={20} color={color} />
    </div>
  )
}

/* ── identity metric breakdowns — deterministic, seeded ────────��────── */
type IdentityBreakdowns = ReturnType<typeof buildIdentityBreakdowns>

function buildIdentityBreakdowns(
  seed: number,
  calls: number,
  accuracy: number,
  streak: number,
) {
  // Last 30 outcomes (deterministic), respecting the analyst's accuracy.
  const last30: ("win" | "loss" | "expired")[] = []
  let wins = 0,
    losses = 0,
    expireds = 0
  for (let i = 0; i < 30; i++) {
    const r = (seed * (i + 7) * 31) % 100
    let o: "win" | "loss" | "expired"
    if (r < accuracy * 0.85) o = "win"
    else if (r < 92) o = "loss"
    else o = "expired"
    last30.push(o)
    if (o === "win") wins++
    else if (o === "loss") losses++
    else expireds++
  }

  // Best historic month
  const monthLabels = [
    "January 2026",
    "February 2026",
    "March 2026",
    "April 2026",
  ]
  const bestMonth = monthLabels[seed % monthLabels.length]
  const bestMonthAcc = Math.min(95, accuracy + 7 + (seed % 7))

  // Accuracy split by instrument
  const instruments: { name: string; acc: number }[] = [
    { name: "Forex", acc: clamp(accuracy + ((seed % 13) - 6), 38, 95) },
    { name: "Crypto", acc: clamp(accuracy + ((seed % 19) - 12), 38, 95) },
    { name: "Indices", acc: clamp(accuracy + ((seed % 17) - 10), 38, 95) },
    { name: "Commodities", acc: clamp(accuracy + ((seed % 21) - 14), 38, 95) },
  ]

  // Accuracy split by timeframe
  const timeframes: { name: string; acc: number }[] = [
    { name: "4H", acc: clamp(accuracy + ((seed % 9) - 3), 40, 95) },
    { name: "1H", acc: clamp(accuracy + ((seed % 11) - 5), 40, 95) },
    { name: "15m", acc: clamp(accuracy - 8 + ((seed % 15) - 7), 35, 90) },
  ]

  // Streak history (last 8)
  const streakHistory: number[] = []
  for (let i = 0; i < 8; i++) {
    streakHistory.push(1 + ((seed + i * 7) % 9))
  }

  // Streak start date — derived from a seed offset (5-19 days back)
  const startDays = 5 + (seed % 14)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - startDays)
  const streakStart = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  // Best streak ever
  const bestStreak = Math.max(streak + 3, 8 + (seed % 9))
  const bestStreakWhen = "Feb 2026"

  // Avg R per closed call
  const avgR = (1.4 + ((seed % 17) / 18)).toFixed(2)

  return {
    last30,
    wins,
    losses,
    expireds,
    bestMonth,
    bestMonthAcc,
    instruments,
    timeframes,
    streakHistory,
    streakStart,
    bestStreak,
    bestStreakWhen,
    avgR,
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Math.round(n)))
}

/* ── monetary + extended-split helpers ────────────────────��───────────────
   Cash-converts the analyst's track record using their Operator vitals
   (AUM × Risk Per Trade %). Every dollar amount the dossier shows is
   derived deterministically from these inputs, so:

     a NAS100 analyst at $2.4M AUM / 0.85% risk = $20,400 avg risk per call
     × 87 lifetime calls = $1.78M total risked
     × profit factor 1.92 → +$184k realised P&L

   This is the bridge between the Operator band (capital + discipline)
   and the Track Record drill-down (what those numbers actually produced).
   No new types, no schema change, all stable per-forecast.
   ──────────────────────────────────────��───────────────────────────────── */
function formatUSD(v: number, abbreviated = false): string {
  const sign = v < 0 ? "-" : ""
  const abs = Math.abs(v)
  if (abbreviated) {
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 10_000) return `${sign}$${Math.round(abs / 1_000)}K`
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
    return `${sign}$${Math.round(abs)}`
  }
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`
}

function buildMonetaryStats(
  seed: number,
  calls: number,
  accuracy: number,
  aum: number,
  riskPct: number,
) {
  const avgRiskUSD = aum * (riskPct / 100)
  const wins = Math.round(calls * (accuracy / 100))
  const losses = calls - wins
  const avgWinR = 1.6 + ((seed % 9) / 10) // 1.6R..2.4R typical winner
  const avgLossRMag = 1.0 // -1R standard stop
  const totalRiskedUSD = avgRiskUSD * calls
  const totalWinUSD = wins * avgRiskUSD * avgWinR
  const totalLossUSD = losses * avgRiskUSD * avgLossRMag
  const totalProfitUSD = totalWinUSD - totalLossUSD
  const bestTradeR = 3.4 + ((seed % 11) / 10)
  const bestTradeUSD = avgRiskUSD * bestTradeR
  const worstTradeUSD = -avgRiskUSD * 1.2
  const pairs = ["NAS100", "EURUSD", "BTCUSD", "XAUUSD", "GBPJPY", "SPX500", "ETHUSD"]
  const bestPair = pairs[seed % pairs.length]
  const worstPair = pairs[(seed + 3) % pairs.length]
  const profitFactor = totalLossUSD > 0 ? totalWinUSD / totalLossUSD : avgWinR
  const expectancy =
    (wins / Math.max(1, calls)) * avgWinR - (losses / Math.max(1, calls)) * avgLossRMag
  const roiOnRiskPct = (totalProfitUSD / Math.max(1, totalRiskedUSD)) * 100
  return {
    avgRiskUSD,
    totalRiskedUSD,
    totalProfitUSD,
    totalWinUSD,
    totalLossUSD,
    bestTradeUSD,
    worstTradeUSD,
    bestPair,
    worstPair,
    avgWinR,
    bestTradeR,
    wins,
    losses,
    profitFactor,
    expectancy,
    roiOnRiskPct,
  }
}

/* ─�� Direction + session splits — used in the Win Rate dossier so the
   viewer can see WHERE the analyst's edge concentrates: long vs short,
   London / NY / Asia. Same shape as instruments/timeframes for reuse. */
function buildExtendedSplits(seed: number, accuracy: number) {
  const directions = [
    { name: "Long", acc: clamp(accuracy + ((seed % 13) - 6), 38, 95) },
    { name: "Short", acc: clamp(accuracy + ((seed % 11) - 5), 38, 95) },
  ]
  const sessions = [
    { name: "London", acc: clamp(accuracy + ((seed % 9) - 3), 40, 95) },
    { name: "New York", acc: clamp(accuracy + ((seed % 13) - 6), 40, 95) },
    { name: "Asia", acc: clamp(accuracy - 5 + ((seed % 17) - 8), 35, 90) },
  ]
  // Calls per instrument — proportional shares of the lifetime book
  const instrumentCalls = (totalCalls: number) => [
    { name: "Forex",       share: 0.32 },
    { name: "Indices",     share: 0.28 },
    { name: "Crypto",      share: 0.22 },
    { name: "Commodities", share: 0.18 },
  ].map((b) => ({ name: b.name, count: Math.max(1, Math.round(totalCalls * b.share)) }))
  return { directions, sessions, instrumentCalls }
}

/* ════════════════════════════════════════════════════════════════════════
   TRACK RECORD PANEL — replaces the 3-pill grid in-place when a metric
   is clicked. Three variants share the same shell so the navigation
   feels coherent: header (back + title + summary) → protagonist number →
   variant body. The panel is a self-contained <div>, NOT a popup or
   dropdown, so the click-to-expand experience is "the section
   transforms" rather than "a tray opens below".
   ════════════════════════════════════════════════════════════════════════ */
function TrackRecordPanel({
  variant,
  onBack,
  data,
  monetary,
  splits,
  calls,
  accuracy,
  streak,
}: {
  variant: "calls" | "accuracy" | "streak"
  onBack: () => void
  data: IdentityBreakdowns
  monetary: ReturnType<typeof buildMonetaryStats>
  splits: ReturnType<typeof buildExtendedSplits>
  calls: number
  accuracy: number
  streak: number
}) {
  const titles: Record<typeof variant, string> = {
    calls: "Total Calls",
    accuracy: "Win Rate",
    streak: "Win Streak",
  }
  const summary =
    variant === "calls"
      ? `${calls} resolved · ${monetary.wins}W / ${monetary.losses}L`
      : variant === "accuracy"
        ? `${monetary.wins} wins from ${calls} calls`
        : `Currently ${streak} wins running`

  return (
    <div
      className="flex flex-col gap-4 px-4 py-4"
      style={{
        borderRadius: 14,
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${VT.rule}`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER — back chevron + title + on-the-right summary */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 cursor-pointer"
          style={{
            padding: "4px 8px 4px 6px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${VT.ruleSoft}`,
            color: VT.ashSoft,
          }}
        >
          <ArrowLeft size={11} strokeWidth={1.8} />
          <span
            className="font-sans"
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
          >
            Back
          </span>
        </button>
        <span
          className="font-sans truncate"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: VT.paper,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          {titles[variant]}
        </span>
        <Caption size={10} color={VT.ashSoft}>
          {summary}
        </Caption>
      </div>

      <Hairline dashed />

      {/* BODY — variant-specific content */}
      {variant === "calls" && (
        <CallsDossier data={data} monetary={monetary} splits={splits} calls={calls} />
      )}
      {variant === "accuracy" && (
        <AccuracyDossier
          data={data}
          splits={splits}
          accuracy={accuracy}
          wins={monetary.wins}
          losses={monetary.losses}
        />
      )}
      {variant === "streak" && (
        <StreakDossier data={data} monetary={monetary} streak={streak} />
      )}
    </div>
  )
}

/* ── CALLS DOSSIER ───────────────────────────────────────────────────────
   Lifetime, money-aware breakdown. Reads top→bottom as a hedge-fund
   factsheet:
     1. Protagonist count + win/loss split
     2. 6-cell monetary ledger (the killer: Total Risked, Total Profit,
        Best Trade, Worst Trade, Avg Risk Per Trade, Profit Factor)
     3. 30-call outcome strip (latest left)
     4. Per-instrument row table (calls + win-rate per asset class)
     5. Closing italic story line
*/
function CallsDossier({
  data,
  monetary,
  splits,
  calls,
}: {
  data: IdentityBreakdowns
  monetary: ReturnType<typeof buildMonetaryStats>
  splits: ReturnType<typeof buildExtendedSplits>
  calls: number
}) {
  const { last30, wins, losses } = data
  const profitable = monetary.totalProfitUSD > 0
  const callsByInstrument = splits.instrumentCalls(calls)
  return (
    <>
      {/* Protagonist number */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow size={10}>Resolved Forecasts</Eyebrow>
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 40,
              fontWeight: 500,
              color: VT.paper,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            {calls}
          </span>
          <Caption size={10.5} color={VT.ashSoft}>
            {wins} wins · {losses} losses · verified, never self-reported
          </Caption>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Eyebrow size={10}>Lifetime P&amp;L</Eyebrow>
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: profitable ? ACCENT.emerald.hex : ACCENT.rose.hex,
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            {profitable ? "+" : ""}
            {formatUSD(monetary.totalProfitUSD, true)}
          </span>
          <Caption size={10} color={VT.ashGhost}>
            {monetary.roiOnRiskPct >= 0 ? "+" : ""}
            {monetary.roiOnRiskPct.toFixed(1)}% return on risk
          </Caption>
        </div>
      </div>

      <Hairline dashed />

      {/* MONETARY LEDGER — 6 cells, 3×2 grid with full English labels */}
      <Eyebrow size={10}>Capital Performance</Eyebrow>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3.5">
        <DossierCell
          label="Total Capital Risked"
          value={formatUSD(monetary.totalRiskedUSD, true)}
          sub={`${formatUSD(monetary.avgRiskUSD, true)} per call avg`}
        />
        <DossierCell
          label="Total Realised Profit"
          value={`${profitable ? "+" : ""}${formatUSD(monetary.totalProfitUSD, true)}`}
          accent={profitable ? ACCENT.emerald.hex : ACCENT.rose.hex}
          sub={`Profit factor ${monetary.profitFactor.toFixed(2)}`}
        />
        <DossierCell
          label="Expectancy Per Call"
          value={`${monetary.expectancy >= 0 ? "+" : ""}${monetary.expectancy.toFixed(2)}R`}
          accent={monetary.expectancy >= 0 ? ACCENT.emerald.hex : ACCENT.rose.hex}
          sub="Average R per resolved call"
        />
        <DossierCell
          label="Best Single Trade"
          value={`+${formatUSD(monetary.bestTradeUSD, true)}`}
          accent={ACCENT.emerald.hex}
          sub={`${monetary.bestPair} · +${monetary.bestTradeR.toFixed(1)}R`}
        />
        <DossierCell
          label="Worst Single Trade"
          value={formatUSD(monetary.worstTradeUSD, true)}
          accent={ACCENT.rose.hex}
          sub={`${monetary.worstPair} · -1.2R`}
        />
        <DossierCell
          label="Avg Winner / Loser"
          value={`+${monetary.avgWinR.toFixed(2)}R / -1.0R`}
          sub={`Avg win ${formatUSD(monetary.avgRiskUSD * monetary.avgWinR, true)}`}
        />
      </div>

      <Hairline dashed />

      {/* OUTCOME STRIP — last 30 */}
      <div className="flex items-center justify-between">
        <Eyebrow size={10}>Last 30 Calls</Eyebrow>
        <Caption size={10} color={VT.ashGhost}>
          newest left · oldest right
        </Caption>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
        {last30.map((o, i) => {
          const c =
            o === "win"
              ? ACCENT.emerald.rgb
              : o === "loss"
                ? ACCENT.rose.rgb
                : "148,163,184"
          return (
            <div
              key={i}
              title={`Call ${30 - i}: ${o.toUpperCase()}`}
              style={{
                height: 12,
                borderRadius: 2,
                background: `rgb(${c})`,
                opacity: o === "expired" ? 0.35 : 0.85,
              }}
            />
          )
        })}
      </div>

      <Hairline dashed />

      {/* PER-INSTRUMENT TABLE */}
      <Eyebrow size={10}>By Asset Class</Eyebrow>
      <div className="flex flex-col gap-2">
        {data.instruments.map((it, i) => (
          <InstrumentLedgerRow
            key={it.name}
            name={it.name}
            calls={callsByInstrument[i]?.count ?? 0}
            acc={it.acc}
          />
        ))}
      </div>

      <Caption size={10.5} color={VT.ashSoft}>
        Strongest on <span style={{ color: ACCENT.emerald.hex }}>{monetary.bestPair}</span>{" "}
        · weakest on <span style={{ color: ACCENT.rose.hex }}>{monetary.worstPair}</span>{" "}
        — concentration is justified.
      </Caption>
    </>
  )
}

/* ── ACCURACY DOSSIER ────────────────────────────────────────────────────
   Win-rate distribution across four lenses (instrument / timeframe /
   direction / session) so the viewer sees WHERE the analyst's edge
   actually concentrates, not just an aggregate %.                       */
function AccuracyDossier({
  data,
  splits,
  accuracy,
  wins,
  losses,
}: {
  data: IdentityBreakdowns
  splits: ReturnType<typeof buildExtendedSplits>
  accuracy: number
  wins: number
  losses: number
}) {
  const allRows = [...data.instruments, ...data.timeframes, ...splits.directions, ...splits.sessions]
  const best = allRows.reduce((a, b) => (a.acc > b.acc ? a : b))
  const worst = allRows.reduce((a, b) => (a.acc < b.acc ? a : b))
  return (
    <>
      {/* Protagonist percentage */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow size={10}>Overall Win Rate</Eyebrow>
          <div className="flex items-baseline gap-2">
            <span
              className="font-sans tabular-nums"
              style={{
                fontSize: 40,
                fontWeight: 500,
                color: accuracy >= 70 ? ACCENT.emerald.hex : VT.paper,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
            >
              {accuracy}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: VT.ashSoft,
                letterSpacing: "-0.02em",
              }}
            >
              %
            </span>
          </div>
          <Caption size={10.5} color={VT.ashSoft}>
            {wins} wins from {wins + losses} resolved calls
          </Caption>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Caption size={9.5} color={VT.ashGhost}>
            BEST · {best.name}
          </Caption>
          <Caption size={9.5} color={VT.ashGhost}>
            WEAKEST · {worst.name}
          </Caption>
        </div>
      </div>

      <Hairline dashed />

      <Eyebrow size={10}>By Asset Class</Eyebrow>
      <div className="flex flex-col gap-2">
        {data.instruments.map((it) => (
          <AccuracyRow key={it.name} name={it.name} acc={it.acc} />
        ))}
      </div>

      <Hairline dashed />

      <Eyebrow size={10}>By Timeframe</Eyebrow>
      <div className="flex flex-col gap-2">
        {data.timeframes.map((tf) => (
          <AccuracyRow key={tf.name} name={tf.name} acc={tf.acc} />
        ))}
      </div>

      <Hairline dashed />

      <Eyebrow size={10}>By Direction</Eyebrow>
      <div className="flex flex-col gap-2">
        {splits.directions.map((d) => (
          <AccuracyRow key={d.name} name={d.name} acc={d.acc} />
        ))}
      </div>

      <Hairline dashed />

      <Eyebrow size={10}>By Trading Session</Eyebrow>
      <div className="flex flex-col gap-2">
        {splits.sessions.map((s) => (
          <AccuracyRow key={s.name} name={s.name} acc={s.acc} />
        ))}
      </div>

      <Caption size={10.5} color={VT.ashSoft}>
        Strongest on <span style={{ color: ACCENT.emerald.hex }}>{best.name}</span> at {best.acc}%
        {" · "}
        weakest on <span style={{ color: ACCENT.rose.hex }}>{worst.name}</span> at {worst.acc}%.
      </Caption>
    </>
  )
}

/* ── STREAK DOSSIER ─────────────���────────────────────────────────────────
   Streak history bar chart + monetary ledger so the viewer understands
   not just "how long" but "how much it produced".                       */
function StreakDossier({
  data,
  monetary,
  streak,
}: {
  data: IdentityBreakdowns
  monetary: ReturnType<typeof buildMonetaryStats>
  streak: number
}) {
  const { streakHistory, streakStart, bestStreak, bestStreakWhen } = data
  const max = Math.max(...streakHistory)
  const avgStreak = streakHistory.reduce((s, n) => s + n, 0) / streakHistory.length
  const streakValueUSD = monetary.avgRiskUSD * monetary.avgWinR * streak
  return (
    <>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow size={10}>Current Streak</Eyebrow>
          <div className="flex items-baseline gap-2">
            <span
              className="font-sans tabular-nums"
              style={{
                fontSize: 40,
                fontWeight: 500,
                color: VT.amber,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
            >
              {streak}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: VT.ashSoft,
                letterSpacing: "-0.02em",
              }}
            >
              wins
            </span>
          </div>
          <Caption size={10.5} color={VT.ashSoft}>
            Started {streakStart} · still running
          </Caption>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Eyebrow size={10}>Realised on streak</Eyebrow>
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: ACCENT.emerald.hex,
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            +{formatUSD(streakValueUSD, true)}
          </span>
          <Caption size={10} color={VT.ashGhost}>
            avg {monetary.avgWinR.toFixed(2)}R per call
          </Caption>
        </div>
      </div>

      <Hairline dashed />

      <Eyebrow size={10}>Last 8 Streaks</Eyebrow>
      <div className="flex items-end gap-1.5" style={{ height: 48 }}>
        {streakHistory.map((s, i) => {
          const h = (s / max) * 100
          const isMax = s === max
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, ease: VT.easeOut, delay: 0.05 * i }}
                style={{
                  width: "100%",
                  background: isMax
                    ? `linear-gradient(180deg, ${VT.amber}, ${rgba("245,158,11", 0.4)})`
                    : `linear-gradient(180deg, ${rgba("148,163,184", 0.55)}, ${rgba("148,163,184", 0.18)})`,
                  borderRadius: "2px 2px 0 0",
                  minHeight: 3,
                }}
              />
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 10,
                  color: isMax ? VT.amber : VT.ashGhost,
                  letterSpacing: "0.02em",
                }}
              >
                {s}
              </span>
            </div>
          )
        })}
      </div>

      <Hairline dashed />

      <Eyebrow size={10}>Streak Stats</Eyebrow>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        <DossierCell
          label="Best Streak Ever"
          value={`${bestStreak}W`}
          accent={VT.amber}
          sub={bestStreakWhen}
        />
        <DossierCell
          label="Average Streak Length"
          value={`${avgStreak.toFixed(1)}W`}
          sub="Across last 8 runs"
        />
        <DossierCell
          label="Avg R Per Streak Call"
          value={`+${monetary.avgWinR.toFixed(2)}R`}
          accent={ACCENT.emerald.hex}
          sub={`${formatUSD(monetary.avgRiskUSD * monetary.avgWinR, true)} avg per win`}
        />
        <DossierCell
          label="Profit Factor"
          value={`${monetary.profitFactor.toFixed(2)}×`}
          accent={monetary.profitFactor >= 1.5 ? ACCENT.emerald.hex : VT.amber}
          sub="Wins value / losses value"
        />
      </div>

      <Caption size={10.5} color={VT.ashSoft}>
        A streak ends on a single losing call · longer is better, and this run is{" "}
        {streak >= avgStreak ? "above" : "below"} their typical length.
      </Caption>
    </>
  )
}

/* ── DOSSIER ATOMS ─��───────────────────────────────────────────────��───── */
function DossierCell({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-sans"
        style={{
          fontSize: 10.5,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "-0.005em",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <span
        className="font-sans tabular-nums truncate"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: accent ?? VT.paper,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="font-sans truncate"
          style={{
            fontSize: 10,
            color: VT.ashGhost,
            fontWeight: 400,
            letterSpacing: "-0.005em",
            lineHeight: 1,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  )
}

function InstrumentLedgerRow({
  name,
  calls,
  acc,
}: {
  name: string
  calls: number
  acc: number
}) {
  const color =
    acc >= 75 ? ACCENT.emerald.hex : acc >= 60 ? VT.amber : ACCENT.rose.hex
  const rgb =
    acc >= 75 ? ACCENT.emerald.rgb : acc >= 60 ? "245,158,11" : ACCENT.rose.rgb
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-sans"
        style={{
          fontSize: 12,
          color: VT.paper,
          fontWeight: 500,
          letterSpacing: "-0.005em",
          width: 96,
          flexShrink: 0,
        }}
      >
        {name}
      </span>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 11,
          color: VT.ashSoft,
          width: 70,
          flexShrink: 0,
        }}
      >
        {calls} calls
      </span>
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${acc}%` }}
          transition={{ duration: 0.7, ease: VT.easeOut }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${rgba(rgb, 0.5)}, ${color})`,
            boxShadow: `0 0 6px ${rgba(rgb, 0.35)}`,
          }}
        />
      </div>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color,
          width: 44,
          textAlign: "right",
          letterSpacing: "-0.01em",
        }}
      >
        {acc}%
      </span>
    </div>
  )
}

/* ── Calls breakdown ─────────────────────────────────────────────────── */
function CallsBreakdown({
  data,
  accuracy,
}: {
  data: IdentityBreakdowns
  accuracy: number
}) {
  const { last30, wins, losses, expireds, bestMonth, bestMonthAcc, avgR } = data
  return (
    <>
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Last 30 calls</Eyebrow>
        <div className="flex items-center gap-2.5">
          <BreakdownStat label="Win" value={`${wins}`} color={ACCENT.emerald.hex} />
          <BreakdownStat label="Loss" value={`${losses}`} color={ACCENT.rose.hex} />
          <BreakdownStat label="Expired" value={`${expireds}`} color={VT.ashSoft} />
        </div>
      </div>
      {/* outcome dot strip */}
      <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
        {last30.map((o, i) => {
          const c =
            o === "win"
              ? ACCENT.emerald.rgb
              : o === "loss"
                ? ACCENT.rose.rgb
                : "148,163,184"
          return (
            <div
              key={i}
              title={`Call ${30 - i}: ${o.toUpperCase()}`}
              style={{
                height: 10,
                borderRadius: 2,
                background: `rgb(${c})`,
                opacity: o === "expired" ? 0.35 : 0.85,
              }}
            />
          )
        })}
      </div>
      <Hairline dashed />
      <div className="flex items-center justify-between">
        <BreakdownLabel label="Best month" value={bestMonth} />
        <span
          className="font-sans"
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: ACCENT.emerald.hex,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
          }}
        >
          {bestMonthAcc}%
        </span>
      </div>
      <div className="flex items-center justify-between">
        <BreakdownLabel label="Avg R per call" value="closed forecasts" />
        <span
          className="font-sans"
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: VT.amber,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
          }}
        >
          {avgR}R
        </span>
      </div>
      <Caption size={10} color={VT.ashSoft}>
        Resolved win rate {accuracy}% · this is a rolling 30-call window
      </Caption>
    </>
  )
}

/* ── Accuracy breakdown ─���────────────────────────────────────────────── */
function AccuracyBreakdown({
  data,
  accuracy,
}: {
  data: IdentityBreakdowns
  accuracy: number
}) {
  const { instruments, timeframes } = data
  return (
    <>
      <Eyebrow size={9}>Accuracy by instrument</Eyebrow>
      <div className="flex flex-col gap-2">
        {instruments.map((it) => (
          <AccuracyRow key={it.name} name={it.name} acc={it.acc} />
        ))}
      </div>
      <Hairline dashed />
      <Eyebrow size={9}>Accuracy by timeframe</Eyebrow>
      <div className="flex flex-col gap-2">
        {timeframes.map((tf) => (
          <AccuracyRow key={tf.name} name={tf.name} acc={tf.acc} />
        ))}
      </div>
      <Caption size={10} color={VT.ashSoft}>
        Overall {accuracy}% across all instruments and timeframes
      </Caption>
    </>
  )
}

function AccuracyRow({ name, acc }: { name: string; acc: number }) {
  const color =
    acc >= 75 ? ACCENT.emerald.hex : acc >= 60 ? VT.amber : ACCENT.rose.hex
  const rgb =
    acc >= 75 ? ACCENT.emerald.rgb : acc >= 60 ? "245,158,11" : ACCENT.rose.rgb
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-sans"
        style={{
          fontSize: 11.5,
          color: VT.paper,
          letterSpacing: "-0.005em",
          width: 64,
          flexShrink: 0,
        }}
      >
        {name}
      </span>
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${acc}%` }}
          transition={{ duration: 0.7, ease: VT.easeOut }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${rgba(rgb, 0.5)}, ${color})`,
            boxShadow: `0 0 6px ${rgba(rgb, 0.35)}`,
          }}
        />
      </div>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 11.5,
          fontWeight: 500,
          color,
          width: 36,
          textAlign: "right",
          letterSpacing: "-0.01em",
        }}
      >
        {acc}%
      </span>
    </div>
  )
}

/* ── Streak breakdown ─────────────────────────────────────────────────�� */
function StreakBreakdown({
  data,
  streak,
}: {
  data: IdentityBreakdowns
  streak: number
}) {
  const { streakHistory, streakStart, bestStreak, bestStreakWhen } = data
  const max = Math.max(...streakHistory)
  return (
    <>
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Current streak</Eyebrow>
        <span
          className="font-sans"
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: VT.amber,
            letterSpacing: "-0.005em",
          }}
        >
          {streak}W · started {streakStart}
        </span>
      </div>
      <Hairline dashed />
      <Eyebrow size={9}>Streak history (last 8)</Eyebrow>
      <div className="flex items-end gap-1.5" style={{ height: 32 }}>
        {streakHistory.map((s, i) => {
          const h = (s / max) * 100
          const isMax = s === max
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, ease: VT.easeOut, delay: 0.05 * i }}
                style={{
                  width: "100%",
                  background: isMax
                    ? `linear-gradient(180deg, ${VT.amber}, ${rgba("245,158,11", 0.4)})`
                    : `linear-gradient(180deg, ${rgba("148,163,184", 0.55)}, ${rgba("148,163,184", 0.18)})`,
                  borderRadius: "2px 2px 0 0",
                  minHeight: 3,
                }}
              />
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 8.5,
                  color: isMax ? VT.amber : VT.ashGhost,
                  letterSpacing: "0.02em",
                }}
              >
                {s}
              </span>
            </div>
          )
        })}
      </div>
      <Hairline dashed />
      <div className="flex items-center justify-between">
        <BreakdownLabel label="Best ever" value={bestStreakWhen} />
        <span
          className="font-sans"
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: VT.amber,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
          }}
        >
          {bestStreak}W
        </span>
      </div>
      <Caption size={10} color={VT.ashSoft}>
        A streak ends on a single losing call. Longer is better.
      </Caption>
    </>
  )
}

/* ── shared breakdown atoms ────���─────────────────────────────────────── */
function BreakdownStat({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color,
          letterSpacing: "-0.015em",
        }}
      >
        {value}
      </span>
      <Eyebrow size={8.5} color={rgba("255,255,255", 0.42)}>
        {label}
      </Eyebrow>
    </div>
  )
}

function BreakdownLabel({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Eyebrow size={8.5}>{label}</Eyebrow>
      <span
        className="font-sans"
        style={{
          fontSize: 11,
          color: VT.paperDim,
          letterSpacing: "0.005em",
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   2. STATUS CAPSULE — masterplan-grade lifecycle telemetry
   ════════════════════════════════════════════════════════════════════════
   Where this forecast is in its life, presented as a multi-layered live
   dossier rather than a single one-line label. The capsule renders ten
   distinct surfaces stacked vertically, each adding a different angle
   on "what is this trade doing right now":

     1. HERO        — pulsing orb + status name + risk temperature
     2. PIPELINE    — 5-stage lifecycle ribbon (POSTED → ARMED → TRIGGERED
                      → IN-FLIGHT → RESOLVED) with travel animation
     3. HEARTBEAT   — sparkline of synthetic recent price action with a
                      live cursor; baseline is the entry; bands shade SL
                      and TP zones
     4. METRICS     — 3-meter cluster: to-entry / to-invalidation /
                      to-target, with labeled gauges and accent dots
     5. PRESSURE    — time-window bar that turns rose when ≤10% remains
     6. RESOLUTION  — plain-English forecaster: "if X → WIN, if Y → LOSS,
                      window closes in Z"
     7. TIMELINE    — vertical mini-feed of lifecycle events with dots
     8. LEDGER      — 4-step audit ribbon (Posted / Entry / Stop /
                      Target) with check / pending / na states
     9. ACTIONS     — Watch / Alert@Entry / Alert@TP / Mute toggle tray
     10. FINE PRINT — confidence-drift micro-chart + ID footer

   The card auto-tunes which surfaces show based on lifecycle state:
   live trades show all 10; resolved trades hide pressure + actions and
   replace the heartbeat with an outcome ribbon; pending trades show
   only the first 6.

   Every metric is deterministic from `forecast.id` so reload is stable.
   ─────────────────────────────────────────────────────────────────── */

/** Risk temperature reading derived from how close price is to either
 *  level. "Calm" when both stops are far, "Warming" when one is closer,
 *  "Hot" when one is dangerously close. Used in two places: the hero
 *  badge, and the lifecycle pipeline tooltip. */
function readRiskTemperature(
  toInvalidation: number,
  toTarget: number,
): { tier: "calm" | "warming" | "hot"; label: string; color: string; rgb: string } {
  // Either side ≤ 0.18 of the path → hot. Either side ≤ 0.40 → warming.
  const min = Math.min(toInvalidation, toTarget)
  if (min <= 0.18)
    return { tier: "hot", label: "Hot zone", color: VT.rose, rgb: VT.roseRgb }
  if (min <= 0.4)
    return {
      tier: "warming",
      label: "Warming",
      color: VT.amber,
      rgb: "245,158,11",
    }
  return { tier: "calm", label: "Calm", color: VT.emerald, rgb: VT.emeraldRgb }
}

/** Lifecycle stage definition — each is one segment of the pipeline. */
type StageKey =
  | "posted"
  | "armed"
  | "triggered"
  | "in_flight"
  | "resolved"
type StageState = "done" | "active" | "pending" | "skipped"
interface StageMeta {
  key: StageKey
  label: string
  /** Short description that shows under the active stage. */
  caption: string
  /** Tiny relative timestamp that shows under the stage when done. */
  stamp?: string
  state: StageState
}

/** Compose the 5-stage lifecycle from a forecast's status. The pipeline
 *  is the single most-read surface so this function is the centerpiece
 *  of the capsule's logic — every other surface derives accent from it. */
function buildLifecycleStages(args: {
  forecast: ForecastItem
  isLive: boolean
  isResolved: boolean
  isWaiting: boolean
  won: boolean
  lost: boolean
  invalidated: boolean
  expired: boolean
  entryTagged: boolean
  seed: number
}): StageMeta[] {
  const {
    forecast,
    isLive,
    isResolved,
    isWaiting,
    won,
    lost,
    invalidated,
    expired,
    entryTagged,
    seed,
  } = args

  // Synthesize stage timestamps relative to "now". All deterministic
  // from the seed so the same forecast renders the same timeline on
  // every load.
  const postedAgo = timeAgo(forecast.createdAt)
  const armedAgo = isLive || won || lost ? `${20 + (seed % 40)}m ago` : ""
  const triggeredAgo = entryTagged ? `${5 + (seed % 25)}m ago` : ""
  const resolvedAgo = isResolved ? `${1 + (seed % 18)}m ago` : ""

  // Stage 1: Posted — always done after creation.
  const posted: StageMeta = {
    key: "posted",
    label: "Posted",
    caption: "Idea published to feed",
    stamp: postedAgo,
    state: "done",
  }

  // Stage 2: Armed — price approached the entry zone, the trade is
  // ready to fire. For live/resolved trades we always treat this as
  // done; for pending we treat as active (waiting for price); for
  // invalidated we treat as skipped.
  const armed: StageMeta = {
    key: "armed",
    label: "Armed",
    caption: invalidated ? "Voided before arming" : "Approaching entry",
    stamp: armedAgo || undefined,
    state: invalidated
      ? "skipped"
      : isLive || won || lost || isResolved
        ? "done"
        : "active",
  }

  // Stage 3: Triggered — price tagged the entry. For live/win/loss
  // it's done. For pending/awaiting/invalidated it varies.
  const triggered: StageMeta = {
    key: "triggered",
    label: "Triggered",
    caption: entryTagged ? "Entry tagged" : "Awaiting trigger",
    stamp: triggeredAgo || undefined,
    state: invalidated
      ? "skipped"
      : entryTagged
        ? "done"
        : isWaiting
          ? "skipped"
          : "pending",
  }

  // Stage 4: In-flight — actively moving toward TP/SL. For live: active.
  // For win/loss: done. Otherwise: pending.
  const inFlight: StageMeta = {
    key: "in_flight",
    label: "In flight",
    caption: isLive
      ? "Travelling between levels"
      : won || lost
        ? "Resolved on level"
        : isWaiting
          ? "Skipped"
          : "Pending",
    state: invalidated
      ? "skipped"
      : isLive
        ? "active"
        : won || lost
          ? "done"
          : "pending",
  }

  // Stage 5: Resolved — final state.
  const resolved: StageMeta = {
    key: "resolved",
    label: invalidated
      ? "Invalidated"
      : expired
        ? "Closed"
        : won
          ? "Win"
          : lost
            ? "Loss"
            : "Resolved",
    caption: won
      ? "Target reached"
      : lost
        ? "Stop hit"
        : invalidated
          ? "Voided"
          : expired
            ? "Window closed"
            : "Pending outcome",
    stamp: resolvedAgo || undefined,
    state: isResolved ? "done" : isWaiting ? "active" : "pending",
  }

  return [posted, armed, triggered, inFlight, resolved]
}

/** Synthesize a 24-point heartbeat sparkline. The line oscillates
 *  around the entry baseline (y=0.5) with a slight drift toward TP
 *  or SL based on `lean`. The final point ("now") is the live cursor
 *  position used by the spotlight dot. */
function buildHeartbeat(seed: number, lean: number): number[] {
  const POINTS = 24
  const arr: number[] = []
  const drift = (lean - 0.5) * 0.65 // drift toward target side
  for (let i = 0; i < POINTS; i++) {
    // Pseudorandom oscillation seeded by index + seed
    const noise =
      Math.sin((seed + i * 11) * 0.31) * 0.18 +
      Math.cos((seed + i * 7) * 0.19) * 0.12
    // Trend pulls toward `lean` more strongly as i → POINTS-1
    const trend = drift * (i / (POINTS - 1))
    arr.push(Math.max(0.06, Math.min(0.94, 0.5 + noise + trend)))
  }
  // Pin the final point to the live `lean` so the cursor lines up with
  // the distance lean meter elsewhere in the capsule.
  arr[POINTS - 1] = Math.max(0.06, Math.min(0.94, lean))
  return arr
}

/** Distance values: 0 = AT the level, 1 = far away. Three readings —
 *  to-entry, to-invalidation, to-target — that drive the metrics
 *  cluster and the resolution forecaster. All deterministic from seed. */
function buildDistances(args: {
  seed: number
  isLive: boolean
  entryTagged: boolean
}): {
  toEntry: number
  toInvalidation: number
  toTarget: number
  lean: number
} {
  const { seed, isLive, entryTagged } = args
  const lean = (seed % 100) / 100 // 0=at SL, 1=at TP
  const toEntry = entryTagged ? 0 : Math.max(0.05, ((seed >> 2) % 80) / 100)
  const toTarget = isLive ? Math.max(0.06, lean) : 1
  const toInvalidation = isLive ? Math.max(0.06, 1 - lean) : 1
  return { toEntry, toInvalidation, toTarget, lean }
}

function StatusCapsule({
  forecast,
  dirColor,
  statusCfg,
  expiresIn,
  delay,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  statusCfg: ForecastIntelligencePanelProps["statusCfg"]
  expiresIn: string | null
  delay: number
}) {
  const seed = useMemo(() => seedFrom(forecast.id), [forecast.id])
  const SI = statusCfg.icon

  /* ── Lifecycle interpretation ─────────────────────────────────────
     The same flags as before, but now also feed the new pipeline,
     timeline, and ledger surfaces. Kept verbose so each surface can
     consume the booleans directly without re-deriving them. */
  const isLive = forecast.status === "active" || forecast.status === "near_expiry"
  const isResolved =
    forecast.status === "resolved_win" ||
    forecast.status === "resolved_loss" ||
    forecast.status === "expired" ||
    forecast.status === "invalidated"
  const isWaiting = forecast.status === "awaiting_resolution"
  const won = forecast.status === "resolved_win"
  const lost = forecast.status === "resolved_loss"
  const invalidated = forecast.status === "invalidated"
  const expired = forecast.status === "expired"

  // Entry tag interpretation — entry was tagged whenever the trade is
  // live OR has resolved as win/loss (you can't win/lose without a fill).
  const entryTagged = isLive || won || lost
  const entryLabel = entryTagged ? "Tagged" : isResolved ? "Missed" : "Waiting"
  const entryColor = entryTagged ? VT.emerald : isResolved ? VT.rose : VT.amber
  const entryRgb = entryTagged ? VT.emeraldRgb : isResolved ? VT.roseRgb : "245,158,11"

  // Distances + lean — single source of truth for all gauges.
  const { toEntry, toInvalidation, toTarget, lean } = useMemo(
    () => buildDistances({ seed, isLive, entryTagged }),
    [seed, isLive, entryTagged],
  )

  const leanLabel = lean > 0.55 ? "TP closer" : lean < 0.45 ? "SL closer" : "Midway"
  const leanColor = lean > 0.55 ? VT.emerald : lean < 0.45 ? VT.rose : VT.amber

  // Risk temperature — calm/warming/hot reading for the hero badge.
  const temp = useMemo(
    () => readRiskTemperature(toInvalidation, toTarget),
    [toInvalidation, toTarget],
  )

  // Toned card accent — the same source-of-truth used everywhere.
  const accentRgb = isLive
    ? statusCfg.color
    : won
      ? VT.emeraldRgb
      : lost
        ? VT.roseRgb
        : isWaiting
          ? "245,158,11"
          : VT.slate

  const heroLabel = isLive
    ? "Currently live"
    : won
      ? "Resolved · Win"
      : lost
        ? "Resolved · Loss"
        : isWaiting
          ? "Awaiting resolution"
          : expired
            ? "Window closed"
            : invalidated
              ? "Invalidated"
              : "Posted"

  /* ════���═══════════════════════════════════════════════════════════
     TRADE SIMULATION ENGINE — lifted state
     ────────────────────────────────────────────────────────────────
     The single source of truth for the price-action simulator. Owned
     here at the capsule level so both the masthead controller
     (LiveHero) and the rail visualization (LiveRoute) read from the
     same state. The hook drives the cursor via requestAnimationFrame
     and snapshots elapsed/price/R-multiple on resolution.
     ══════════════════════════════════════════════════════════════ */
  const sim = useTradeSimulation(forecast, lean)

  return (
    <GlassCard accentRgb={accentRgb} delay={delay}>
      <div className="flex flex-col gap-5">
        {/* ══════════════════════════════════════════════════════════
            CURRENTLY LIVE — the masthead surface
            ──────────────────────────────────────────────────────────
            Replaces the prior STATUS eyebrow + posted-ago header AND
            the simple hero row. Now the entire top of the capsule is
            one rich, descriptive masthead with: title row (label +
            mode chip + temperature), a pulsing orb beside a multi-
            sentence trade-state paragraph, a 4-pill key-facts strip
            (direction · pair · timeframe · conviction), and a
            "Simulate price action" toggle that reveals an interactive
            scenario explorer (below entry / above entry / approaching
            target / hits target / hits stop) with an animated price
            chart and outcome readout.
            ══════════════════════════════════════════════════════════ */}
        <LiveHero
          forecast={forecast}
          statusIcon={SI}
          accentRgb={accentRgb}
          isLive={isLive}
          isWaiting={isWaiting}
          isResolved={isResolved}
          won={won}
          lost={lost}
          invalidated={invalidated}
          expired={expired}
          temp={temp}
          heroLabel={heroLabel}
          dirColor={dirColor}
          simState={sim.state}
          simScenarios={sim.scenarios}
          runScenario={sim.run}
          resetSim={sim.reset}
          simEntryDecimals={sim.entryDecimals}
        />

        <Hairline dashed />

        {/* ══════════════════════════════════════════════════════════
            LIVE ROUTE — the unified telemetry surface
            ──────────────────────────────────────────────────────────
            Single elaborate visualization that synthesizes EVERY level-
            relative reading into one coherent picture: distance to
            entry, distance to invalidation, distance to target, the
            posted timestamp, the live "lean" between SL and TP, and
            the two resolution branches ("if price reaches X → WIN /
            LOSS"). Replaces what used to be 4 separate stacked
            surfaces. Reads as a trade GPS — the trader sees, in one
            glance, where the idea is on its journey.
            ═══════����══════════════════════════════════════════════════ */}
        {(isLive || isWaiting) && (
          <LiveRoute
            forecast={forecast}
            dirRgb={dirColor.rgb}
            accentRgb={accentRgb}
            toEntry={toEntry}
            toInvalidation={toInvalidation}
            toTarget={toTarget}
            lean={lean}
            entryTagged={entryTagged}
            entryLabel={entryLabel}
            entryColor={entryColor}
            entryRgb={entryRgb}
            leanLabel={leanLabel}
            leanColor={leanColor}
            simState={sim.state}
            simEntryDecimals={sim.entryDecimals}
            simRR={sim.rr}
            resetSim={sim.reset}
          />
        )}

        {/* ──────────────────────────────────────────────────────────
            TRACKING — the action tray. Rebuilt at high quality with
            two-line cards, sub-status copy, animated active dots, and
            an optional global "you'll be notified" footer that summarizes
            which alerts will fire.
            ─────────────────────────────────────────────�����──────────── */}
        {(isLive || isWaiting) && <StatusActionTray />}

        {/* ──────────────────────────────────────────────────────────
            INVALIDATION WARNING — same as before, now styled to
            harmonize with the fuller capsule layout
            ────────────────────────────────────────────────────────── */}
        {forecast.invalidation && toInvalidation < 0.4 && isLive && (
          <div
            className="flex items-start gap-2.5 px-3 py-2.5"
            style={{
              borderRadius: 12,
              background: rgba(VT.roseRgb, 0.06),
              border: `1px solid ${rgba(VT.roseRgb, 0.18)}`,
            }}
          >
            <AlertTriangle size={11} strokeWidth={1.8} style={{ color: VT.rose, flexShrink: 0, marginTop: 1 }} />
            <span
              className="font-sans"
              style={{ fontSize: 11, color: VT.paperDim, lineHeight: 1.45, letterSpacing: "0.005em" }}
            >
              <span style={{ color: VT.rose, fontWeight: 500 }}>Invalidation near</span>
              {" — price is approaching the stated invalidation level. Reduce or close the position."}
            </span>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────
            10. FINE PRINT — confidence drift micro-chart + ID footer
            ──────��─────────────────────────────────────────────────── */}
        <StatusFootnote forecast={forecast} accentRgb={accentRgb} />
      </div>
    </GlassCard>
  )
}

/* ════════════════════════════════════════════════════════════════════
   LIVE HERO — the masthead of the STATUS capsule
   ────────────────────────────────────────────────────────────────────
   The headline surface readers see first when they scan the capsule.
   Replaces the prior STATUS eyebrow + tiny posted-ago + tiny hero row
   with a much richer five-layer composition:

     1. TITLE ROW — large status label ("Currently live") + animated
        mode chip (LIVE / WIN / LOSS / PENDING / VOID / CLOSED) +
        risk-temperature pill (Calm / Warming / Hot)
     2. ORB + COPY — the existing pulsing orb (kept inline) beside a
        rich, multi-sentence trade-state paragraph that names the pair,
        direction, timeframe, and the two key levels in plain English.
     3. KEY FACTS PILLS — 4 inline pills tagging the must-know
        characteristics: direction · pair · timeframe · conviction.
     4. SIMULATE BUTTON — toggle that opens an interactive price
        simulator, letting the reader explore "what if price..."
        scenarios without leaving the card.
     5. SIMULATOR PANEL — six animated scenarios with a synthetic
        price chart (TP / Entry / SL lines, animated price line, live
        cursor) and an outcome readout for each scenario.

   The simulator surface is the centerpiece — it converts the static
   "this idea is actionable" copy into a hands-on exploration of how
   the trade plays out under different price paths.
   ═══════════════════════════════════════════════════════════════════ */
function LiveHero({
  forecast,
  statusIcon,
  accentRgb,
  isLive,
  isWaiting,
  isResolved,
  won,
  lost,
  invalidated,
  expired,
  temp,
  heroLabel,
  dirColor,
  simState,
  simScenarios,
  runScenario,
  resetSim,
  simEntryDecimals,
}: {
  forecast: ForecastItem
  statusIcon: LucideIcon
  accentRgb: string
  isLive: boolean
  isWaiting: boolean
  isResolved: boolean
  won: boolean
  lost: boolean
  invalidated: boolean
  expired: boolean
  temp: ReturnType<typeof readRiskTemperature>
  heroLabel: string
  dirColor: { rgb: string; hex: string }
  simState: SimState
  simScenarios: SimScenarioDef[]
  runScenario: (key: SimScenario) => void
  resetSim: () => void
  simEntryDecimals: number
}) {
  const [simOpen, setSimOpen] = useState(false)
  const SI = statusIcon

  /* ── Mode chip label — single uppercase word that names the
     lifecycle tier. Mirrors the accent color used everywhere else. */
  const modeLabel = isLive
    ? "LIVE"
    : won
      ? "WIN"
      : lost
        ? "LOSS"
        : isWaiting
          ? "PENDING"
          : invalidated
            ? "VOID"
            : expired
              ? "CLOSED"
              : "POSTED"

  /* ── Rich descriptive copy — replaces the prior one-liner with a
     multi-sentence, level-aware paragraph that reads like a desk
     analyst's briefing note, not a UI label. */
  const richDescription = isLive
    ? `This ${forecast.direction} idea on ${forecast.instrument} is actionable right now. Price is travelling between entry at ${forecast.entry} and the ${forecast.timeframe} target at ${forecast.takeProfit}, with invalidation set at ${forecast.stopLoss}. Neither level has been touched yet.`
    : won
      ? `Target was reached. This ${forecast.direction} call on ${forecast.instrument} closed in profit when price tagged ${forecast.takeProfit}. The forecast is recorded to the user's verified track record.`
      : lost
        ? `Stop loss was hit. This ${forecast.direction} call on ${forecast.instrument} closed at risk when price tagged ${forecast.stopLoss}. Loss was capped at the planned 1R.`
        : isWaiting
          ? `Outcome being verified by the audit team. The price action has cleared the planned ${forecast.entry} → ${forecast.takeProfit} window, but the resolution still needs a final read before it lands on the track record.`
          : invalidated
            ? "Voided due to extraordinary market conditions or a rule violation. The forecast does not count toward the user's track record."
            : expired
              ? `The prediction window closed without target or stop being reached. Price never tagged the ${forecast.entry} → ${forecast.takeProfit} corridor within the planned ${forecast.timeframe} timeframe.`
              : `Awaiting entry trigger at ${forecast.entry}. The plan stays patient — price has to come into the corridor before this idea fires.`

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {/* ── 1. TITLE ROW (cleaned) ─────────────────────────────────
          Per the master-pass brief: the status section focuses on
          the live state and the short explanation. The LIVE chip
          and CALM temperature pill are removed — both are surfaced
          elsewhere (the orb already pulses for live, temperature
          lives in the execution spec / risk readout). Direction /
          pair / timeframe / conviction chips are also removed
          downstream so this section stops repeating what the rest
          of the popup already shows. */}
      <h3
        className="font-sans"
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: VT.paper,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
        }}
      >
        {heroLabel}
      </h3>

      {/* ── 2. ORB + RICH COPY ──────────────────────────────────────
          The pulsing orb keeps doing its job (kept inline rather than
          extracted, since framer's stacking context is delicate); the
          right column hosts the new descriptive paragraph. */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          {isLive && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: `rgba(${accentRgb},0.32)` }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: `rgba(${accentRgb},0.18)` }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.45, 0, 0.45] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.6,
                }}
              />
            </>
          )}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: `rgba(${accentRgb},0.12)`,
              border: `1px solid rgba(${accentRgb},0.4)`,
            }}
          >
            <SI size={15} strokeWidth={1.8} style={{ color: `rgb(${accentRgb})` }} />
          </div>
        </div>
        <p
          className="flex-1 font-sans"
          style={{
            fontSize: 12.5,
            color: VT.paperDim,
            letterSpacing: "0.005em",
            lineHeight: 1.55,
            paddingTop: 1,
            margin: 0,
          }}
        >
          {richDescription}
        </p>
      </div>

      {/* ── 3. KEY FACTS PILLS — removed in master pass ────────────
          Direction / Pair / Timeframe / Conviction were duplicating
          information already visible in the forecast header and the
          execution spec. The status section is now responsible only
          for the live state + plain-English description. */}

      {/* ── 4. SIMULATE BUTTON ──────────────────────────────────────
          Two-line CTA: title + one-line subtitle that explains what
          the simulator does. The chevron rotates 180° on open so the
          state is unambiguous even without the panel below. The
          button is hidden for invalidated forecasts (no meaningful
          price-path exploration once a trade is voided). */}
      {!invalidated && (isLive || isWaiting || isResolved) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSimOpen((o) => !o)
          }}
          className="flex items-center justify-between text-left"
          style={{
            padding: "10px 12px 11px",
            borderRadius: 10,
            background: simOpen ? `rgba(${accentRgb},0.08)` : "rgba(255,255,255,0.025)",
            border: simOpen ? `1px solid rgba(${accentRgb},0.36)` : `1px solid ${VT.ruleSoft}`,
            cursor: "pointer",
            transition:
              "background 200ms ease-out, border-color 200ms ease-out",
          }}
          aria-expanded={simOpen}
          aria-controls="price-simulator-panel"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="relative flex-shrink-0 flex items-center justify-center"
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: `rgba(${accentRgb},0.16)`,
                border: `1px solid rgba(${accentRgb},0.32)`,
              }}
            >
              <Sparkles size={12} strokeWidth={1.8} style={{ color: `rgb(${accentRgb})` }} />
            </div>
            <div className="flex flex-col min-w-0" style={{ gap: 1 }}>
              <span
                className="font-sans truncate"
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: VT.paper,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.15,
                }}
              >
                Simulate price action
              </span>
              <span
                className="font-sans truncate"
                style={{
                  fontSize: 9.5,
                  color:
                    simState.phase === "resolved_win"
                      ? VT.emerald
                      : simState.phase === "resolved_loss"
                        ? VT.rose
                        : simState.phase === "playing"
                          ? `rgb(${accentRgb})`
                          : VT.ashSoft,
                  letterSpacing: "0.005em",
                  lineHeight: 1.2,
                  opacity: 0.92,
                }}
              >
                {simState.phase === "resolved_win"
                  ? "Resolved — target hit"
                  : simState.phase === "resolved_loss"
                    ? "Resolved — stop hit"
                    : simState.phase === "playing"
                      ? "Simulating now — watch the rail below"
                      : simState.phase === "paused"
                        ? "Paused at scenario — tap another or reset"
                        : "Preview outcomes if price moves up or down"}
              </span>
            </div>
          </div>
          <motion.span
            animate={{ rotate: simOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: VT.easeOut }}
            style={{ display: "inline-flex", flexShrink: 0 }}
          >
            <ChevronDown
              size={14}
              strokeWidth={1.8}
              style={{ color: simOpen ? `rgb(${accentRgb})` : VT.ashSoft }}
            />
          </motion.span>
        </button>
      )}

      {/* ── 5. SIMULATOR PANEL ───��─────────────────────────────────
          Animated collapse-expand. The panel renders the controller
          (scenario buttons + live ticker + reset). The actual cursor
          movement happens in the LiveRoute below this card — the
          controller is just the cockpit, the rail is the windshield. */}
      <AnimatePresence initial={false}>
        {simOpen && (
          <motion.div
            id="price-simulator-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: VT.easeOut }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: 4 }}>
              <SimulatorController
                forecast={forecast}
                accentRgb={accentRgb}
                dirRgb={dirColor.rgb}
                simState={simState}
                scenarios={simScenarios}
                runScenario={runScenario}
                resetSim={resetSim}
                entryDecimals={simEntryDecimals}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   FactPill — small inline pill with an UPPERCASE eyebrow + a tinted
   value. Used for the four key facts row (Direction · Pair · TF ·
   Conviction). Color-tinted variants pass `rgb` to draw a colored
   border + soft background; plain variants get a neutral wash.
   ──────────────────────────��──────��────────────────────────────────── */
function FactPill({
  label,
  value,
  color,
  rgb,
}: {
  label: string
  value: string
  color: string
  rgb?: string
}) {
  return (
    <span
      className="font-sans inline-flex items-baseline gap-1.5"
      style={{
        padding: "4px 9px 5px",
        borderRadius: 999,
        background: rgb ? `rgba(${rgb},0.06)` : "rgba(255,255,255,0.03)",
        border: rgb ? `1px solid rgba(${rgb},0.20)` : `1px solid ${VT.ruleSoft}`,
        lineHeight: 1.1,
      }}
    >
      <span
        style={{
          fontSize: 8.5,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          opacity: 0.78,
        }}
      >
        {label}
      </span>
      <span
        className="tabular-nums truncate max-w-[120px]"
        style={{
          fontSize: 10.5,
          color,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {value}
      </span>
    </span>
  )
}

/* ══════════════════════════════════════════���═════════════════════════
   TRADE SIMULATION ENGINE — masterplan
   ────────────────────────────────────────────────────────────────────
   Drives the blue "NOW" cursor on the LiveRoute rail. Lifted to the
   STATUS capsule level so both the controller (LiveHero) and the
   visualization (LiveRoute) read from the same single source of truth.

   ARCHITECTURE
     - useTradeSimulation(forecast, realLean) is the central hook.
     - It manages a SimState state machine: idle → playing → paused
       OR → resolved_win / resolved_loss (when scenario is hit_tp/sl).
     - rAF tick computes (lean, price, elapsedMs) each frame from the
       start lean toward the scenario's target lean using easeInOutCubic.
     - Snapshots (resolvedAt, resolvedPrice, R-multiple) freeze on
       resolution so the LiveRoute can render a full audit overlay.

   PHASES
     - idle: no scenario — rail shows the real lean
     - playing: cursor is animating left↔right along the rail
     - paused: cursor reached scenario target (non-resolution scenarios)
     - resolved_win: hit_target was the scenario — block transforms
     - resolved_loss: hit_stop was the scenario — block transforms

   PRICE INTERPOLATION
     - parsePrice strips commas/$ and produces a numeric value.
     - The live "price" is lerp(slPrice, tpPrice, lean), so when the
       cursor sits at lean=0 the price === SL; at lean=1 it === TP;
       between them it walks linearly through the corridor.

   The reader hits a scenario button in LiveHero, the cursor on the
   LiveRoute below smoothly animates, and the live price ticker in the
   controller updates 60 times/sec. When hit_target or hit_stop runs,
   the LiveRoute itself transforms into a full RESOLVED card showing
   what happened, when, and the P/L outcome.
   ═══════════════════════════════════════════════════════════════════ */

type SimPhase =
  | "idle"
  | "playing"
  | "paused"
  | "resolved_win"
  | "resolved_loss"

type SimScenario =
  | "below_entry"
  | "approach_entry"
  | "above_entry"
  | "near_target"
  | "hit_target"
  | "hit_stop"

interface SimState {
  phase: SimPhase
  scenario: SimScenario | null
  /** Animated lean 0..1 (0 = at SL, 1 = at TP). Drives cursor X. */
  lean: number
  /** Live price derived via lerp(slPrice, tpPrice, lean). */
  price: number
  /** Milliseconds since the current scenario started. */
  elapsedMs: number
  /** R-multiple snapshot on resolve (+rr WIN / −1 LOSS / 0 otherwise). */
  rMultiple: number
}

interface SimScenarioDef {
  key: SimScenario
  label: string
  short: string
  /** Target lean position 0..1. */
  target: number
  /** Animation duration in ms. */
  duration: number
  icon: LucideIcon
  color: string
  rgb: string
}

/** Strip non-numeric chars and parse a price string like "18,245" → 18245. */
function parsePrice(s: string | undefined): number {
  if (!s) return 0
  const n = parseFloat(String(s).replace(/[,$\s]/g, ""))
  return isNaN(n) ? 0 : n
}

/** Detect decimal places in a price string ("1.0875" → 4, "18,245" → 0). */
function detectDecimals(s: string | undefined): number {
  if (!s) return 0
  const m = String(s).split(".")[1]
  return m ? m.length : 0
}

/** Format a numeric price with the given decimal count + commas. */
function formatPrice(n: number, decimals: number): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Format ms as "2.4s" or "1.2s". Always one decimal so the readout
 *  doesn't jitter between widths when elapsed crosses a whole second. */
function formatElapsed(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`
}

/** Build the six scenario definitions. Target lean positions are
 *  geometrically meaningful against the forecast's R:R: entryFrac
 *  sits at 1/(1+rr), and scenarios cluster around that anchor. */
function buildScenarios(rr: number): SimScenarioDef[] {
  const entryFrac = 1 / (1 + rr)
  return [
    {
      key: "below_entry",
      label: "Drifting below entry",
      short: "Below entry",
      target: Math.max(0.05, entryFrac - 0.22),
      duration: 2400,
      icon: TrendingDown,
      color: VT.ashSoft,
      rgb: "232,232,222",
    },
    {
      key: "approach_entry",
      label: "Approaching entry",
      short: "Approaching",
      target: Math.max(0.08, entryFrac - 0.04),
      duration: 2200,
      icon: Crosshair,
      color: VT.amber,
      rgb: "245,158,11",
    },
    {
      key: "above_entry",
      label: "Filled, drifting in profit",
      short: "Filled",
      target: Math.min(0.92, entryFrac + 0.22),
      duration: 2800,
      icon: Activity,
      color: VT.emerald,
      rgb: VT.emeraldRgb,
    },
    {
      key: "near_target",
      label: "Approaching target",
      short: "Near TP",
      target: 0.86,
      duration: 3200,
      icon: TrendingUp,
      color: VT.emerald,
      rgb: VT.emeraldRgb,
    },
    {
      key: "hit_target",
      label: "Target reached — WIN",
      short: "Hits TP",
      target: 1.0,
      duration: 3400,
      icon: CheckCircle2,
      color: VT.emerald,
      rgb: VT.emeraldRgb,
    },
    {
      key: "hit_stop",
      label: "Stop hit — LOSS",
      short: "Hits SL",
      target: 0.0,
      duration: 3000,
      icon: XCircle,
      color: VT.rose,
      rgb: VT.roseRgb,
    },
  ]
}

/** The core simulation hook. Owns the rAF loop. */
function useTradeSimulation(forecast: ForecastItem, realLean: number) {
  const slPrice = parsePrice(forecast.stopLoss ?? forecast.invalidation)
  const tpPrice = parsePrice(forecast.takeProfit)
  const entryDecimals = detectDecimals(forecast.entry)

  const rrMatch = forecast.riskReward?.match(/1\s*:\s*([\d.]+)/)
  const rr = rrMatch ? parseFloat(rrMatch[1]) : 1.5

  const scenarios = useMemo(() => buildScenarios(rr), [rr])

  const [state, setState] = useState<SimState>(() => ({
    phase: "idle",
    scenario: null,
    lean: realLean,
    price: lerp(slPrice, tpPrice, realLean),
    elapsedMs: 0,
    rMultiple: 0,
  }))

  const rafRef = useRef<number | null>(null)
  /** Mutable animation cursor — kept out of state to avoid setState
   *  cascades while reading per-frame data. */
  const animRef = useRef<{
    startLean: number
    startTime: number
    target: number
    duration: number
    scenarioKey: SimScenario
  } | null>(null)

  const tick = useCallback(() => {
    const anim = animRef.current
    if (!anim) return
    const now = performance.now()
    const t = Math.min(1, (now - anim.startTime) / anim.duration)
    const eased = easeInOutCubic(t)
    const lean = anim.startLean + (anim.target - anim.startLean) * eased
    const price = lerp(slPrice, tpPrice, lean)
    const elapsed = now - anim.startTime

    if (t >= 1) {
      const isWin = anim.scenarioKey === "hit_target"
      const isLoss = anim.scenarioKey === "hit_stop"
      setState({
        phase: isWin ? "resolved_win" : isLoss ? "resolved_loss" : "paused",
        scenario: anim.scenarioKey,
        lean,
        price,
        elapsedMs: elapsed,
        rMultiple: isWin ? rr : isLoss ? -1 : 0,
      })
      animRef.current = null
      rafRef.current = null
      return
    }

    setState((s) => ({ ...s, lean, price, elapsedMs: elapsed }))
    rafRef.current = requestAnimationFrame(tick)
  }, [slPrice, tpPrice, rr])

  const run = useCallback(
    (scenarioKey: SimScenario) => {
      const def = scenarios.find((s) => s.key === scenarioKey)
      if (!def) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      /* Resume from current lean if a scenario was already playing,
         else start fresh from the real lean. This is what makes the
         cursor flow smoothly from one scenario to the next instead
         of teleporting back to start each time. */
      const startLean = state.phase === "idle" ? realLean : state.lean
      animRef.current = {
        startLean,
        startTime: performance.now(),
        target: def.target,
        duration: def.duration,
        scenarioKey,
      }
      setState((s) => ({
        ...s,
        phase: "playing",
        scenario: scenarioKey,
        elapsedMs: 0,
        rMultiple: 0,
      }))
      rafRef.current = requestAnimationFrame(tick)
    },
    [scenarios, state.phase, state.lean, realLean, tick],
  )

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    animRef.current = null
    setState({
      phase: "idle",
      scenario: null,
      lean: realLean,
      price: lerp(slPrice, tpPrice, realLean),
      elapsedMs: 0,
      rMultiple: 0,
    })
  }, [realLean, slPrice, tpPrice])

  /* Cleanup rAF on unmount. */
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    state,
    scenarios,
    run,
    reset,
    rr,
    slPrice,
    tpPrice,
    entryDecimals,
  }
}

/* ════════════════════════════════════════════════════════════════════
   SIMULATOR CONTROLLER — the cockpit inside LiveHero
   ────────────────────────────────────────────────────────────────────
   Renders three layers:
     1. LIVE PRICE TICKER — big tabular-nums readout of the simulated
        price, color-tinted to match the side of entry it's on
        (emerald above, rose below, accent at entry). When a scenario
        is playing it updates 60 times/sec; when paused/resolved it
        freezes at the final value.
     2. SCENARIO GRID — six toggle buttons, one per preset path
     3. RESET BUTTON — appears whenever a scenario is loaded so the
        user can return the rail to its real-time lean.

   The actual cursor movement happens in the LiveRoute below. This
   component is the cockpit, the rail is the windshield.
   ═══════════════════��═══════════════════════════════════════════════ */

function SimulatorController({
  forecast,
  accentRgb,
  dirRgb,
  simState,
  scenarios,
  runScenario,
  resetSim,
  entryDecimals,
}: {
  forecast: ForecastItem
  accentRgb: string
  dirRgb: string
  simState: SimState
  scenarios: SimScenarioDef[]
  runScenario: (key: SimScenario) => void
  resetSim: () => void
  entryDecimals: number
}) {
  /* Parse the real entry price so we can color the ticker green when
     the simulated price is "above entry" (long perspective) and rose
     when it's below. For SHORT trades the comparison flips. */
  const entryPrice = parsePrice(forecast.entry)
  const isLong = forecast.direction === "LONG"

  /* Tone for the live ticker:
       above entry on a LONG (or below on a SHORT) → emerald (in profit)
       below entry on a LONG (or above on a SHORT) → rose   (in loss)
       at entry → neutral paper */
  const tickerTone = (() => {
    if (simState.phase === "resolved_win")
      return { color: VT.emerald, rgb: VT.emeraldRgb }
    if (simState.phase === "resolved_loss")
      return { color: VT.rose, rgb: VT.roseRgb }
    const inProfit = isLong
      ? simState.price > entryPrice
      : simState.price < entryPrice
    const inLoss = isLong
      ? simState.price < entryPrice
      : simState.price > entryPrice
    if (inProfit) return { color: VT.emerald, rgb: VT.emeraldRgb }
    if (inLoss) return { color: VT.rose, rgb: VT.roseRgb }
    return { color: VT.paper, rgb: "232,232,222" }
  })()

  /* Δ from entry — what the trader actually cares about. Sign indicates
     profit/loss for the side. */
  const delta = simState.price - entryPrice
  const deltaSigned = isLong ? delta : -delta
  const deltaPct = entryPrice !== 0 ? (deltaSigned / entryPrice) * 100 : 0

  /* Status text under the price — varies by phase. */
  const statusText = (() => {
    switch (simState.phase) {
      case "idle":
        return "Pick a scenario to start the simulation"
      case "playing": {
        const def = scenarios.find((s) => s.key === simState.scenario)
        return def
          ? `Simulating · ${def.label.toLowerCase()}`
          : "Simulating..."
      }
      case "paused": {
        const def = scenarios.find((s) => s.key === simState.scenario)
        return def
          ? `Paused at · ${def.label.toLowerCase()}`
          : "Paused"
      }
      case "resolved_win":
        return `Target tagged in ${formatElapsed(simState.elapsedMs)} — recorded as WIN`
      case "resolved_loss":
        return `Stop tagged in ${formatElapsed(simState.elapsedMs)} — recorded as LOSS`
    }
  })()

  return (
    <div className="flex flex-col" style={{ gap: 11 }}>
      {/* ══════════════════════════════════════════════════════════
          LIVE PRICE TICKER
          ──────────────────────────────────────────────────────────
          Three-column readout: big simulated price · Δ from entry
          chip · elapsed-time chip. The big price uses tabular-nums
          so it doesn't jitter horizontally while it ticks. */}
      <div
        className="relative flex items-center justify-between gap-3"
        style={{
          padding: "11px 13px 12px",
          borderRadius: 10,
          background: `rgba(${tickerTone.rgb},0.05)`,
          border: `1px solid rgba(${tickerTone.rgb},0.22)`,
          transition: "background 250ms ease-out, border-color 250ms ease-out",
        }}
      >
        <div className="flex flex-col min-w-0" style={{ gap: 3 }}>
          <span
            className="font-sans inline-flex items-center gap-1.5"
            style={{
              fontSize: 8.5,
              color: VT.ashSoft,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: 0.85,
            }}
          >
            {simState.phase === "playing" && (
              <motion.span
                aria-hidden
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: `rgb(${accentRgb})`,
                  display: "inline-block",
                  boxShadow: `0 0 5px rgba(${accentRgb},0.7)`,
                }}
              />
            )}
            Simulated price
          </span>
          <span
            className="font-sans tabular-nums truncate"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: tickerTone.color,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              transition: "color 250ms ease-out",
            }}
          >
            {formatPrice(simState.price, entryDecimals)}
          </span>
          <span
            className="font-sans truncate"
            style={{
              fontSize: 10,
              color: VT.paperDim,
              letterSpacing: "0.005em",
              lineHeight: 1.25,
              opacity: 0.9,
            }}
          >
            {statusText}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {/* Δ from entry chip */}
          <span
            className="font-mono tabular-nums inline-flex items-center gap-1"
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: tickerTone.color,
              letterSpacing: "-0.005em",
              padding: "3px 8px",
              borderRadius: 999,
              background: `rgba(${tickerTone.rgb},0.10)`,
              border: `1px solid rgba(${tickerTone.rgb},0.28)`,
              lineHeight: 1.1,
              transition: "all 250ms ease-out",
            }}
          >
            {deltaSigned >= 0 ? "+" : "−"}
            {formatPrice(Math.abs(delta), entryDecimals)}
            <span style={{ opacity: 0.6, fontSize: 8.5 }}>
              {deltaSigned >= 0 ? "+" : "−"}
              {Math.abs(deltaPct).toFixed(2)}%
            </span>
          </span>
          {/* Elapsed time chip — only meaningful when sim is running. */}
          {simState.phase !== "idle" && (
            <span
              className="font-mono tabular-nums inline-flex items-center gap-1"
              style={{
                fontSize: 9.5,
                color: VT.ashSoft,
                fontWeight: 500,
                letterSpacing: "0.01em",
                padding: "2px 7px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${VT.ruleSoft}`,
                lineHeight: 1.1,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 999,
                  background: VT.ashSoft,
                  display: "inline-block",
                  opacity: 0.7,
                }}
              />
              {formatElapsed(simState.elapsedMs)} elapsed
            </span>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SCENARIO GRID — six toggle buttons
          ──────────────────────────────────────────────────────────
          Each button kicks off a new scenario animation in the rail.
          The currently active scenario is filled with its tone; idle
          chips stay neutral. Wrapping is allowed so a narrow card
          width breaks them onto multiple lines instead of clipping. */}
      <div className="flex flex-wrap gap-1.5">
        {scenarios.map((s) => {
          const isActive = simState.scenario === s.key
          const SI = s.icon
          return (
            <motion.button
              key={s.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                runScenario(s.key)
              }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: VT.easeOut }}
              className="font-sans inline-flex items-center gap-1.5"
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.005em",
                lineHeight: 1.1,
                color: isActive ? s.color : VT.ashSoft,
                padding: "6px 10px 6px 9px",
                borderRadius: 999,
                background: isActive
                  ? `rgba(${s.rgb},0.10)`
                  : "rgba(255,255,255,0.025)",
                border: isActive
                  ? `1px solid rgba(${s.rgb},0.36)`
                  : `1px solid ${VT.ruleSoft}`,
                cursor: "pointer",
                transition:
                  "background 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out",
              }}
              aria-pressed={isActive}
              aria-label={`Run scenario: ${s.label}`}
            >
              <SI size={10.5} strokeWidth={2} />
              {s.short}
              {isActive && simState.phase === "playing" && (
                <motion.span
                  aria-hidden
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: s.color,
                    display: "inline-block",
                    boxShadow: `0 0 4px rgba(${s.rgb},0.65)`,
                  }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
          RESET BUTTON — only shown when a scenario is loaded
          ──────────────────────────────────────────────────────────
          Returns the rail's cursor to its real-time lean, clears any
          resolved overlay, and lets the trader explore again from a
          clean slate. */}
      {simState.phase !== "idle" && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: VT.easeOut }}
          onClick={(e) => {
            e.stopPropagation()
            resetSim()
          }}
          className="font-sans inline-flex items-center justify-center gap-1.5 self-start"
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: VT.ashSoft,
            padding: "5px 10px 6px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${VT.ruleSoft}`,
            cursor: "pointer",
            lineHeight: 1.1,
          }}
          whileHover={{
            backgroundColor: `rgba(${accentRgb},0.08)`,
            color: `rgb(${accentRgb})`,
            borderColor: `rgba(${accentRgb},0.32)`,
          }}
        >
          <RotateCcw size={10} strokeWidth={2} />
          Reset to live
        </motion.button>
      )}

      {/* Italic disclaimer — kept from the prior simulator so traders
          remember this is preview-only, not a forecast guarantee. */}
      <span
        className="font-sans"
        style={{
          fontSize: 9.5,
          color: VT.ashGhost,
          letterSpacing: "0.005em",
          lineHeight: 1.4,
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        Hypothetical preview only — watch the cursor move on the Live Route below.
      </span>
    </div>
  )
}

/* ─────────────────────────��──────────────���───────────────────────────
   STATUS CAPSULE — child surfaces
   ──────────────────────────────────────────────────────────────────── */

/** Hero temperature badge — Calm / Warming / Hot, with a tiny dot. */
function TemperatureBadge({
  temp,
}: {
  temp: ReturnType<typeof readRiskTemperature>
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        padding: "2px 7px 2px 6px",
        borderRadius: 999,
        background: `rgba(${temp.rgb},0.10)`,
        border: `1px solid rgba(${temp.rgb},0.28)`,
        lineHeight: 1,
      }}
      title={`Risk temperature: ${temp.label}`}
    >
      <motion.span
        aria-hidden
        animate={
          temp.tier === "hot"
            ? { scale: [1, 1.35, 1], opacity: [0.9, 0.5, 0.9] }
            : undefined
        }
        transition={
          temp.tier === "hot"
            ? { duration: 1.2, repeat: Infinity, ease: "easeOut" }
            : undefined
        }
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          background: temp.color,
          boxShadow: `0 0 5px rgba(${temp.rgb},0.7)`,
          display: "inline-block",
        }}
      />
      <span
        className="font-sans"
        style={{
          fontSize: 9.5,
          fontWeight: 500,
          letterSpacing: "0.06em",
          color: temp.color,
          textTransform: "uppercase",
        }}
      >
        {temp.label}
      </span>
    </span>
  )
}

/** 5-stage lifecycle pipeline — the centerpiece of the new capsule.
 *  Renders 5 nodes connected by a fill bar that animates to the
 *  current active or last-done stage. Each node carries an icon,
 *  label, and timestamp. */
function LifecyclePipeline({
  stages,
  accentRgb,
  isLive,
}: {
  stages: StageMeta[]
  accentRgb: string
  isLive: boolean
}) {
  // Find the index of the active or last done stage — that's where
  // the fill bar animates to.
  const fillIdx = useMemo(() => {
    const activeIdx = stages.findIndex((s) => s.state === "active")
    if (activeIdx >= 0) return activeIdx
    let lastDone = -1
    stages.forEach((s, i) => {
      if (s.state === "done") lastDone = i
    })
    return lastDone
  }, [stages])

  const STAGE_ICONS: Record<StageKey, LucideIcon> = {
    posted: Flag,
    armed: Crosshair,
    triggered: Target,
    in_flight: Activity,
    resolved: CheckCircle2,
  }

  // Find the active stage's caption to render below the pipeline.
  const activeStage = stages.find((s) => s.state === "active") ?? stages[fillIdx]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Lifecycle</Eyebrow>
        <Caption color={VT.ashSoft} size={9}>
          {`Stage ${Math.min(stages.length, fillIdx + 1)} of ${stages.length}`}
        </Caption>
      </div>

      {/* Pipeline rail */}
      <div className="relative" style={{ paddingTop: 6, paddingBottom: 6 }}>
        {/* Background track */}
        <div
          aria-hidden
          className="absolute"
          style={{
            top: "50%",
            left: 12,
            right: 12,
            height: 2,
            transform: "translateY(-50%)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 6%, rgba(255,255,255,0.10) 94%, transparent 100%)",
          }}
        />
        {/* Animated fill */}
        <motion.div
          aria-hidden
          className="absolute"
          style={{
            top: "50%",
            left: 12,
            height: 2,
            transform: "translateY(-50%)",
            background: `linear-gradient(90deg, rgba(${accentRgb},0.5), rgba(${accentRgb},0.85))`,
            boxShadow: `0 0 8px rgba(${accentRgb},0.4)`,
            borderRadius: 999,
          }}
          initial={{ width: "0%" }}
          animate={{
            width:
              fillIdx < 0
                ? "0%"
                : `calc(${(fillIdx / (stages.length - 1)) * 100}% - ${(fillIdx / (stages.length - 1)) * 24}px)`,
          }}
          transition={{ duration: 0.9, ease: VT.easeOut, delay: 0.1 }}
        />

        {/* Travelling pulse — only on live, slides along the active
            edge of the fill. */}
        {isLive && fillIdx >= 0 && fillIdx < stages.length - 1 && (
          <motion.div
            aria-hidden
            className="absolute"
            style={{
              top: "50%",
              left: `calc(${(fillIdx / (stages.length - 1)) * 100}% + 12px)`,
              transform: "translate(-50%, -50%)",
              width: 8,
              height: 8,
              borderRadius: 999,
              background: `rgb(${accentRgb})`,
              boxShadow: `0 0 8px rgba(${accentRgb},0.8)`,
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Nodes */}
        <div className="relative flex items-center justify-between">
          {stages.map((stage, i) => {
            const SI = STAGE_ICONS[stage.key]
            const isDone = stage.state === "done"
            const isActive = stage.state === "active"
            const isSkipped = stage.state === "skipped"
            const isPending = stage.state === "pending"
            const nodeRgb = isDone || isActive ? accentRgb : isSkipped ? VT.roseRgb : VT.slate
            return (
              <div
                key={stage.key}
                className="relative flex flex-col items-center"
                style={{ width: 24 }}
                title={`${stage.label} — ${stage.caption}`}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: VT.easeOut,
                    delay: 0.15 + i * 0.06,
                  }}
                  className="relative flex items-center justify-center"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background:
                      isDone || isActive
                        ? `rgba(${nodeRgb},0.18)`
                        : isSkipped
                          ? "rgba(255,255,255,0.025)"
                          : "rgba(255,255,255,0.04)",
                    border: `1px solid rgba(${nodeRgb},${
                      isDone || isActive ? 0.5 : isSkipped ? 0.2 : 0.16
                    })`,
                  }}
                >
                  {/* Active pulse */}
                  {isActive && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{ background: `rgba(${nodeRgb},0.3)` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                  <SI
                    size={10}
                    strokeWidth={2}
                    style={{
                      color: isPending
                        ? VT.ashSoft
                        : isSkipped
                          ? VT.rose
                          : `rgb(${nodeRgb})`,
                      opacity: isPending ? 0.5 : 1,
                    }}
                  />
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage labels row */}
      <div className="flex items-start justify-between" style={{ marginTop: 4 }}>
        {stages.map((stage, i) => {
          const isDone = stage.state === "done"
          const isActive = stage.state === "active"
          const isSkipped = stage.state === "skipped"
          return (
            <div
              key={stage.key}
              className="flex flex-col items-center"
              style={{ width: 56, marginLeft: i === 0 ? -12 : 0, marginRight: i === stages.length - 1 ? -12 : 0 }}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 9,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive
                    ? VT.paper
                    : isDone
                      ? VT.paperDim
                      : isSkipped
                        ? VT.rose
                        : VT.ashSoft,
                  letterSpacing: "0.02em",
                  lineHeight: 1.2,
                  textAlign: "center",
                  opacity: isSkipped ? 0.6 : 1,
                }}
              >
                {stage.label}
              </span>
              {stage.stamp && (
                <span
                  className="font-sans"
                  style={{
                    fontSize: 8.5,
                    color: VT.ashSoft,
                    letterSpacing: "0.01em",
                    lineHeight: 1.4,
                    opacity: 0.78,
                  }}
                >
                  {stage.stamp}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Active caption — single italic sentence under the rail
          describing what's happening NOW. */}
      {activeStage && (
        <p
          className="font-sans"
          style={{
            fontSize: 11,
            color: VT.paperDim,
            letterSpacing: "0.005em",
            lineHeight: 1.45,
            fontStyle: "italic",
            marginTop: 2,
          }}
        >
          {activeStage.caption}
        </p>
      )}
    </div>
  )
}

/** Heartbeat sparkline — synthetic recent price action with a live
 *  cursor at "now". The midline is the entry; the upper band is TP
 *  territory; the lower band is SL territory. */
function Heartbeat({
  data,
  lean,
  dirRgb,
  accentRgb,
}: {
  data: number[]
  lean: number
  dirRgb: string
  accentRgb: string
}) {
  const W = 100
  const H = 36
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    // Invert y because SVG y grows downward; we want higher = up.
    const y = (1 - v) * H
    return [x, y] as const
  })
  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")
  const cursor = pts[pts.length - 1]

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Heartbeat</Eyebrow>
        <span
          className="font-sans"
          style={{
            fontSize: 9.5,
            color: lean > 0.55 ? VT.emerald : lean < 0.45 ? VT.rose : VT.amber,
            letterSpacing: "0.005em",
            fontWeight: 500,
          }}
        >
          {lean > 0.55 ? "Trending toward TP" : lean < 0.45 ? "Drifting toward SL" : "Holding midway"}
        </span>
      </div>

      <div
        className="relative"
        style={{
          height: H,
          borderRadius: 6,
          padding: "2px 4px",
          background:
            "linear-gradient(180deg, rgba(16,185,129,0.04) 0%, rgba(255,255,255,0.02) 50%, rgba(239,68,68,0.04) 100%)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* TP / SL band labels (left edge) */}
        <span
          aria-hidden
          className="absolute font-sans"
          style={{
            top: 1,
            left: 4,
            fontSize: 7,
            color: VT.emerald,
            letterSpacing: "0.12em",
            fontWeight: 500,
            opacity: 0.6,
          }}
        >
          TP
        </span>
        <span
          aria-hidden
          className="absolute font-sans"
          style={{
            bottom: 1,
            left: 4,
            fontSize: 7,
            color: VT.rose,
            letterSpacing: "0.12em",
            fontWeight: 500,
            opacity: 0.6,
          }}
        >
          SL
        </span>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Midline (entry) */}
          <line
            x1={0}
            y1={H / 2}
            x2={W}
            y2={H / 2}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />
          {/* Heartbeat line */}
          <motion.path
            d={path}
            fill="none"
            stroke={`rgb(${dirRgb})`}
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: VT.easeOut, delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 3px rgba(${dirRgb},0.4))` }}
          />
          {/* Live cursor */}
          <motion.circle
            cx={cursor[0]}
            cy={cursor[1]}
            r={1.6}
            fill={`rgb(${accentRgb})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{ filter: `drop-shadow(0 0 4px rgba(${accentRgb},0.8))` }}
          />
        </svg>
      </div>
    </div>
  )
}

/** Single distance gauge — label, percent fill bar, value chip. */
function DistanceGauge({
  label,
  value,
  tone,
  hint,
}: {
  label: string
  /** 0 = at the level (close), 1 = far away. The fill animates from
   *  0% (left) to (1-value)*100% so a SMALLER `value` shows a FULLER
   *  bar — visually conveying "we're close to this level". */
  value: number
  tone: "calm" | "warming" | "danger" | "approach" | "done"
  hint: string
}) {
  const tones: Record<typeof tone, { color: string; rgb: string }> = {
    calm: { color: VT.emerald, rgb: VT.emeraldRgb },
    warming: { color: VT.amber, rgb: "245,158,11" },
    danger: { color: VT.rose, rgb: VT.roseRgb },
    approach: { color: VT.emerald, rgb: VT.emeraldRgb },
    done: { color: VT.ashSoft, rgb: "232,232,222" },
  }
  const t = tones[tone]
  const fill = Math.max(6, Math.min(100, (1 - value) * 100))

  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-sans truncate"
        style={{
          fontSize: 8.5,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1.1,
          opacity: 0.78,
        }}
      >
        {label}
      </span>
      <div
        className="relative overflow-hidden"
        style={{
          height: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0"
          initial={{ width: "0%" }}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 0.9, ease: VT.easeOut, delay: 0.3 }}
          style={{
            borderRadius: 999,
            background: `linear-gradient(90deg, rgba(${t.rgb},0.4), rgba(${t.rgb},0.85))`,
            boxShadow: `0 0 4px rgba(${t.rgb},0.5)`,
          }}
        />
      </div>
      <span
        className="font-sans tabular-nums truncate"
        style={{
          fontSize: 10,
          color: t.color,
          fontWeight: 500,
          letterSpacing: "0.005em",
          lineHeight: 1.2,
        }}
      >
        {hint}
      </span>
    </div>
  )
}

/** Time-pressure bar — % of window elapsed. Turns rose when ≤10%
 *  remains. Shows "elapsed" and "left" stamps below. */
function TimePressureBar({
  value,
  timeLeft,
  posted,
}: {
  value: number
  timeLeft: string | null
  posted: string
}) {
  const remaining = 1 - value
  const pct = Math.round(value * 100)
  const tone =
    remaining <= 0.1 ? "danger" : remaining <= 0.25 ? "warming" : "calm"
  const tones: Record<typeof tone, { color: string; rgb: string; verdict: string }> = {
    calm: { color: VT.emerald, rgb: VT.emeraldRgb, verdict: "comfortable window" },
    warming: { color: VT.amber, rgb: "245,158,11", verdict: "tightening" },
    danger: { color: VT.rose, rgb: VT.roseRgb, verdict: "closing soon" },
  }
  const t = tones[tone]

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Time pressure</Eyebrow>
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: 10,
            color: t.color,
            fontWeight: 500,
            letterSpacing: "0.005em",
          }}
        >
          {pct}% elapsed · {t.verdict}
        </span>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Tick marks at 25/50/75% for spatial reference */}
        {[25, 50, 75].map((p) => (
          <span
            key={p}
            aria-hidden
            className="absolute"
            style={{
              left: `${p}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          />
        ))}
        <motion.div
          className="absolute inset-y-0 left-0"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: VT.easeOut, delay: 0.3 }}
          style={{
            borderRadius: 999,
            background: `linear-gradient(90deg, rgba(${t.rgb},0.5), rgba(${t.rgb},0.9))`,
            boxShadow: `0 0 5px rgba(${t.rgb},0.55)`,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span
          className="font-sans"
          style={{
            fontSize: 9,
            color: VT.ashSoft,
            letterSpacing: "0.01em",
          }}
        >
          {posted}
        </span>
        <span
          className="font-sans"
          style={{
            fontSize: 9,
            color: VT.ashSoft,
            letterSpacing: "0.01em",
          }}
        >
          {timeLeft ? `${timeLeft} left` : "open window"}
        </span>
      </div>
    </div>
  )
}

/** Resolution forecaster — plain-English next-state teller. Tells the
 *  reader what each level means in concrete dollars-and-Rs terms. */
function ResolutionForecaster({
  forecast,
  dirRgb,
  expiresIn,
  isLive,
}: {
  forecast: ForecastItem
  dirRgb: string
  expiresIn: string | null
  isLive: boolean
}) {
  const target = forecast.takeProfit
  const stop = forecast.stopLoss ?? forecast.invalidation
  const rrMatch = forecast.riskReward?.match(/1\s*:\s*([\d.]+)/)
  const rr = rrMatch ? parseFloat(rrMatch[1]) : null

  return (
    <div
      className="flex flex-col gap-2 px-3 py-3"
      style={{
        borderRadius: 12,
        background: "rgba(255,255,255,0.022)",
        border: `1px dashed ${VT.ruleSoft}`,
      }}
    >
      <Eyebrow size={9}>If price moves</Eyebrow>

      <div className="flex flex-col gap-1.5">
        {/* WIN branch */}
        <div className="flex items-start gap-2">
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: VT.emerald,
              boxShadow: `0 0 4px rgba(${VT.emeraldRgb},0.6)`,
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <span
            className="font-sans"
            style={{
              fontSize: 11,
              color: VT.paperDim,
              letterSpacing: "0.005em",
              lineHeight: 1.5,
            }}
          >
            Tags{" "}
            <span style={{ color: VT.emerald, fontWeight: 500 }}>
              {target || "target"}
            </span>{" "}
            → resolves <span style={{ color: VT.emerald, fontWeight: 500 }}>WIN</span>
            {rr ? ` (+${rr.toFixed(1)}R)` : ""}
          </span>
        </div>

        {/* LOSS branch */}
        <div className="flex items-start gap-2">
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: VT.rose,
              boxShadow: `0 0 4px rgba(${VT.roseRgb},0.6)`,
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <span
            className="font-sans"
            style={{
              fontSize: 11,
              color: VT.paperDim,
              letterSpacing: "0.005em",
              lineHeight: 1.5,
            }}
          >
            Tags{" "}
            <span style={{ color: VT.rose, fontWeight: 500 }}>
              {stop || "stop"}
            </span>{" "}
            → resolves <span style={{ color: VT.rose, fontWeight: 500 }}>LOSS</span> (−1.0R)
          </span>
        </div>

        {/* TIMEOUT branch */}
        {isLive && expiresIn && (
          <div className="flex items-start gap-2">
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: VT.amber,
                boxShadow: `0 0 4px rgba(245,158,11,0.6)`,
                marginTop: 6,
                flexShrink: 0,
              }}
            />
            <span
              className="font-sans"
              style={{
                fontSize: 11,
                color: VT.paperDim,
                letterSpacing: "0.005em",
                lineHeight: 1.5,
              }}
            >
              Window closes in{" "}
              <span style={{ color: VT.amber, fontWeight: 500 }}>{expiresIn}</span> → resolves{" "}
              <span style={{ color: VT.amber, fontWeight: 500 }}>EXPIRED</span> (no fill)
            </span>
          </div>
        )}
      </div>

      {/* Direction reminder — tiny subtitle row */}
      <span
        className="font-sans"
        style={{
          fontSize: 9.5,
          color: VT.ashGhost,
          letterSpacing: "0.01em",
          fontStyle: "italic",
          marginTop: 2,
        }}
      >
        Direction: <span style={{ color: `rgb(${dirRgb})` }}>{forecast.direction}</span>
      </span>
    </div>
  )
}

/** Lifecycle timeline — vertical mini-feed with colored dots and
 *  timestamps for every recorded event. Shows only events that have
 *  actually happened (state === "done" or "active"). */
function LifecycleTimeline({
  stages,
  accentRgb,
}: {
  stages: StageMeta[]
  accentRgb: string
}) {
  const events = stages.filter((s) => s.state === "done" || s.state === "active")
  if (events.length === 0) return null

  const STAGE_ICONS: Record<StageKey, LucideIcon> = {
    posted: Flag,
    armed: Crosshair,
    triggered: Target,
    in_flight: Activity,
    resolved: CheckCircle2,
  }

  return (
    <div className="flex flex-col gap-2">
      <Eyebrow size={9}>Timeline</Eyebrow>
      <div className="flex flex-col gap-1.5">
        {events.map((s, i) => {
          const SI = STAGE_ICONS[s.key]
          const isActive = s.state === "active"
          const last = i === events.length - 1
          return (
            <div key={s.key} className="relative flex items-start gap-2.5">
              {/* Vertical connector (except last) */}
              {!last && (
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    left: 8,
                    top: 16,
                    bottom: -8,
                    width: 1,
                    background: `linear-gradient(180deg, rgba(${accentRgb},0.3), rgba(${accentRgb},0.08))`,
                  }}
                />
              )}
              {/* Dot + icon */}
              <div
                className="relative flex items-center justify-center flex-shrink-0"
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 999,
                  background: `rgba(${accentRgb},${isActive ? 0.22 : 0.14})`,
                  border: `1px solid rgba(${accentRgb},${isActive ? 0.55 : 0.32})`,
                  marginTop: 1,
                }}
              >
                {isActive && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ background: `rgba(${accentRgb},0.3)` }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <SI size={8} strokeWidth={2} style={{ color: `rgb(${accentRgb})` }} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 11,
                      color: VT.paper,
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.label}
                  </span>
                  {s.stamp && (
                    <span
                      className="font-sans tabular-nums"
                      style={{
                        fontSize: 9.5,
                        color: VT.ashSoft,
                        letterSpacing: "0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      · {s.stamp}
                    </span>
                  )}
                </div>
                <span
                  className="font-sans"
                  style={{
                    fontSize: 10,
                    color: VT.paperDim,
                    letterSpacing: "0.005em",
                    lineHeight: 1.4,
                    opacity: 0.85,
                  }}
                >
                  {s.caption}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 4-step audit ledger — Posted / Entry / Stop / Target. Each is a
 *  tiny chip with a state icon (check / pending / na). Used by the
 *  risk team to verify a forecast's audit trail at a glance. */
function AuditLedger({
  posted,
  entryTagged,
  isResolved,
  won,
  lost,
  invalidated,
}: {
  posted: boolean
  entryTagged: boolean
  isResolved: boolean
  won: boolean
  lost: boolean
  invalidated: boolean
}) {
  type LedgerState = "ok" | "pending" | "na" | "fired"
  interface LedgerStep {
    label: string
    state: LedgerState
    note: string
  }
  const steps: LedgerStep[] = [
    {
      label: "Posted",
      state: posted ? "ok" : "pending",
      note: posted ? "stamped" : "pending",
    },
    {
      label: "Entry",
      state: entryTagged ? "ok" : isResolved ? "na" : "pending",
      note: entryTagged ? "tagged" : isResolved ? "missed" : "open",
    },
    {
      label: "Stop",
      state: invalidated ? "na" : lost ? "fired" : isResolved ? "ok" : "pending",
      note: invalidated ? "voided" : lost ? "fired" : isResolved ? "honored" : "armed",
    },
    {
      label: "Target",
      state: invalidated ? "na" : won ? "fired" : isResolved ? "ok" : "pending",
      note: invalidated ? "voided" : won ? "reached" : isResolved ? "missed" : "pending",
    },
  ]

  const tones: Record<LedgerState, { color: string; rgb: string; icon: LucideIcon }> = {
    ok: { color: VT.emerald, rgb: VT.emeraldRgb, icon: CheckCircle2 },
    pending: { color: VT.amber, rgb: "245,158,11", icon: CalendarClock },
    na: { color: VT.ashSoft, rgb: "232,232,222", icon: XCircle },
    fired: { color: VT.emerald, rgb: VT.emeraldRgb, icon: CheckCircle2 },
  }

  return (
    <div className="flex flex-col gap-2">
      <Eyebrow size={9}>Audit ledger</Eyebrow>
      <div className="grid grid-cols-4 gap-1.5">
        {steps.map((step, i) => {
          const tone = tones[step.state]
          const SI = tone.icon
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: VT.easeOut, delay: 0.2 + i * 0.05 }}
              className="flex flex-col items-start"
              style={{
                padding: "7px 8px 8px",
                borderRadius: 7,
                background: `rgba(${tone.rgb},0.05)`,
                border: `1px solid rgba(${tone.rgb},0.18)`,
                gap: 3,
              }}
              title={`${step.label}: ${step.note}`}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 8.5,
                  color: VT.ashSoft,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  opacity: 0.78,
                }}
              >
                {step.label}
              </span>
              <div className="flex items-center gap-1.5">
                <SI size={9} strokeWidth={2} style={{ color: tone.color }} />
                <span
                  className="font-sans truncate"
                  style={{
                    fontSize: 10,
                    color: tone.color,
                    fontWeight: 500,
                    letterSpacing: "0.005em",
                    lineHeight: 1.1,
                    textTransform: "capitalize",
                  }}
                >
                  {step.note}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════��═════════════════════════
   LIVE ROUTE — single rich visualization that replaces the prior 4-5
   stacked surfaces (live distances, fast facts, resolution forecaster,
   audit ledger, distance-lean cell). It expresses every level-relative
   reading at once via a horizontal "trade journey" rail.

   Three vertical layers, top to bottom:

     1. RESOLUTION END-CAPS — two cards on the corners that anchor the
        rail with the only two outcomes that matter: LOSS (left) and
        WIN (right). Each shows the level price + R outcome.

     2. THE RAIL — a horizontal SVG schematic with 4 markers
        (STOP · ENTRY · NOW · TARGET). The "Now" cursor is the live
        lean position between SL and TP, with a pulsing orb and
        soft glow. The path from Entry to Now is filled with the
        direction color so the trader can see the realized travel.

     3. DATA ROW — 3 numeric callouts mapped 1:1 to the rail's three
        zones: room before invalidation · entry-tag state · gap to
        target. A footer caption reports posted-ago + lean verdict.
   ═══════════════════════════════════════════════════════════════════ */
function LiveRoute({
  forecast,
  dirRgb,
  accentRgb,
  toEntry,
  toInvalidation,
  toTarget,
  lean,
  entryTagged,
  entryLabel,
  entryColor,
  entryRgb,
  leanLabel,
  leanColor,
  simState,
  simEntryDecimals,
  simRR,
  resetSim,
}: {
  forecast: ForecastItem
  dirRgb: string
  accentRgb: string
  toEntry: number
  toInvalidation: number
  toTarget: number
  lean: number
  entryTagged: boolean
  entryLabel: string
  entryColor: string
  entryRgb: string
  leanLabel: string
  leanColor: string
  simState: SimState
  simEntryDecimals: number
  simRR: number
  resetSim: () => void
}) {
  // Parse R:R for the WIN end-cap label. Fall back to a clean default
  // ("+target") so the cap never looks empty. Direction text comes from
  // the forecast itself ("LONG" / "SHORT").
  const rrMatch = forecast.riskReward?.match(/1\s*:\s*([\d.]+)/)
  const rr = rrMatch ? parseFloat(rrMatch[1]) : null

  const target = forecast.takeProfit ?? "—"
  const stop = forecast.stopLoss ?? forecast.invalidation ?? "—"

  // ── SIMULATION OVERRIDE ──────────────────────────────────────────
  // If a scenario is loaded the cursor + ticker color follow the
  // simulation state instead of the real-time lean. This is the bridge
  // between the controller's rAF loop and the rail's visual cursor.
  const simActive = simState.phase !== "idle"
  const resolved =
    simState.phase === "resolved_win" || simState.phase === "resolved_loss"
  const isWinResolve = simState.phase === "resolved_win"
  const isLossResolve = simState.phase === "resolved_loss"

  // The cursor's lean is either the simulation lean (when active) or
  // the real-time lean. We tween cx in framer-motion below so the
  // transition between scenarios reads as a continuous slide.
  const effectiveLean = simActive ? simState.lean : lean

  // The cursor's tint flips to emerald on win-resolve, rose on loss-
  // resolve, accent otherwise. Drives the orb glow, the ring color,
  // and the NOW callout box.
  const cursorColor = isWinResolve
    ? VT.emerald
    : isLossResolve
      ? VT.rose
      : `rgb(${accentRgb})`
  const cursorRgb = isWinResolve
    ? VT.emeraldRgb
    : isLossResolve
      ? VT.roseRgb
      : accentRgb

  // ── RAIL GEOMETRY ────────────────────────────────────────────────
  // ViewBox is 320×72. Padding 18px each side keeps the end markers
  // from clipping. Y-center is 38 (track + room above for the "NOW"
  // label callout balloon). The rail layout is fixed (always SL on
  // left, TP on right) regardless of forecast direction — the rail
  // expresses outcome direction, not price direction.
  const W = 320
  const H = 72
  const PAD_X = 18
  const trackY = 42

  // X positions for the four markers.
  const slX = PAD_X
  const tpX = W - PAD_X
  // Entry sits at ~33% of the rail by default (assuming a typical 1:2
  // R:R puts entry one-third of the way from SL to TP). If we have a
  // real R:R we use it.
  const rrEntryFrac = rr ? 1 / (1 + rr) : 0.33
  const entryX = slX + (tpX - slX) * rrEntryFrac
  // Cursor X — based on effectiveLean (0=at SL, 1=at TP).
  const cursorX = slX + (tpX - slX) * effectiveLean

  // Lean glyph — driven by EFFECTIVE lean so the header pill reflects
  // the simulated cursor position, not just the real one.
  const leanGlyph =
    effectiveLean > 0.55 ? "↗" : effectiveLean < 0.45 ? "↘" : "→"

  // ── RESOLVED OVERLAY ─��───────────────────────────────────────────
  // When the simulation reaches hit_target / hit_stop the entire card
  // morphs into a full "what happened" briefing. Rendered as an early-
  // return so the markup stays cleanly separated from the live rail.
  if (resolved) {
    return (
      <ResolvedRouteCard
        forecast={forecast}
        isWin={isWinResolve}
        elapsedMs={simState.elapsedMs}
        finalPrice={simState.price}
        entryDecimals={simEntryDecimals}
        rMultiple={simState.rMultiple}
        rr={simRR}
        onReset={resetSim}
        target={String(target)}
        stop={String(stop)}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: VT.easeOut }}
      className="relative flex flex-col"
      style={{
        padding: "13px 14px 14px",
        borderRadius: 12,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)",
        border: `1px solid ${VT.ruleSoft}`,
        gap: 12,
      }}
    >
      {/* ── HEADER ROW ──────────────────────────────────────────────
          Eyebrow on the left, posted-ago + lean pill on the right.
          The lean pill mirrors the cursor's tilt so the reader has a
          numeric verdict before they look at the rail. */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Eyebrow size={9}>Live route</Eyebrow>
          {/* SIMULATING badge — appears whenever a scenario is loaded
              in the controller, so the reader knows the cursor and the
              lean pill are reflecting a hypothetical price path, not
              the real-time market. */}
          <AnimatePresence>
            {simActive && (
              <motion.span
                key="sim-badge"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.22, ease: VT.easeOut }}
                className="font-sans inline-flex items-center gap-1"
                style={{
                  fontSize: 8,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: `rgb(${accentRgb})`,
                  padding: "2.5px 7px",
                  borderRadius: 999,
                  background: `rgba(${accentRgb},0.12)`,
                  border: `1px solid rgba(${accentRgb},0.32)`,
                  lineHeight: 1.1,
                }}
              >
                <motion.span
                  aria-hidden
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: `rgb(${accentRgb})`,
                    display: "inline-block",
                    boxShadow: `0 0 4px rgba(${accentRgb},0.7)`,
                  }}
                />
                Simulating
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-sans"
            style={{
              fontSize: 9.5,
              color: VT.ashSoft,
              letterSpacing: "0.005em",
              fontWeight: 400,
            }}
          >
            Posted {timeAgo(forecast.createdAt)}
          </span>
          {/* Lean pill — reactive. When the simulation is active we
              re-derive the lean tone/label from effectiveLean so the
              header chip ("TP closer" / "SL closer" / "Holding mid")
              tracks the cursor's hypothetical position. AnimatePresence
              gives a soft crossfade as the band changes. */}
          {(() => {
            const live = effectiveLean
            const dynColor =
              live > 0.62
                ? VT.emerald
                : live < 0.38
                  ? VT.rose
                  : VT.amber
            const dynRgb =
              live > 0.62
                ? VT.emeraldRgb
                : live < 0.38
                  ? VT.roseRgb
                  : "245,158,11"
            const dynGlyph = live > 0.55 ? "↗" : live < 0.45 ? "↘" : "→"
            const dynLabel =
              live > 0.62
                ? "TP closer"
                : live < 0.38
                  ? "SL closer"
                  : "Holding mid"
            const useDynamic = simActive
            const finalColor = useDynamic ? dynColor : leanColor
            const finalRgb = useDynamic
              ? dynRgb
              : leanColor === VT.emerald
                ? VT.emeraldRgb
                : leanColor === VT.rose
                  ? VT.roseRgb
                  : "245,158,11"
            const finalGlyph = useDynamic ? dynGlyph : leanGlyph
            const finalLabel = useDynamic ? dynLabel : leanLabel
            return (
              <motion.span
                className="inline-flex items-center gap-1"
                animate={{
                  background: `rgba(${finalRgb},0.10)`,
                  borderColor: `rgba(${finalRgb},0.32)`,
                }}
                transition={{ duration: 0.35, ease: VT.easeOut }}
                style={{
                  padding: "2.5px 8px 2.5px 7px",
                  borderRadius: 999,
                  border: `1px solid rgba(${finalRgb},0.28)`,
                  lineHeight: 1,
                }}
              >
                <span
                  aria-hidden
                  className="font-sans"
                  style={{
                    fontSize: 11,
                    color: finalColor,
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  {finalGlyph}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={finalLabel}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.22, ease: VT.easeOut }}
                    className="font-sans"
                    style={{
                      fontSize: 9.5,
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      color: finalColor,
                      lineHeight: 1,
                    }}
                  >
                    {finalLabel}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            )
          })()}
        </div>
      </div>

      {/* ── RESOLUTION END-CAPS (sim-reactive) ──────────────────��──
          Two anchor cards using short trading language: STOP LOSS
          (left) and TAKE PROFIT (right). When the simulation cursor
          drifts toward one side, that panel lights up and the other
          quiets down — so the reader feels the forecast emphasis
          shift with the dot, not just the dot. */}
      <div className="grid grid-cols-2 gap-2">
        <RouteEndcap
          side="loss"
          headline="Stop loss"
          level={stop}
          zoneLabel="Loss zone"
          delta="−1.0R"
          active={simActive && effectiveLean < 0.42}
          dim={simActive && effectiveLean > 0.6}
        />
        <RouteEndcap
          side="win"
          headline="Take profit"
          level={target}
          zoneLabel="Target zone"
          delta={rr ? `+${rr.toFixed(1)}R` : "+target"}
          active={simActive && effectiveLean > 0.58}
          dim={simActive && effectiveLean < 0.4}
        />
      </div>

      {/* ── THE RAIL ────────────────────────────────────────────────
          SVG horizontal schematic. Renders the entire trade journey
          in a single glance: SL on the far left, TP on the far right,
          ENTRY at its R-relative position, NOW (the live cursor) at
          its lean position. The path from Entry to Now is filled in
          the direction color so the trader sees realized travel. */}
      <div
        className="relative"
        style={{ height: H, width: "100%", overflow: "visible" }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          width="100%"
          height={H}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Gradient on the realized-travel segment so it doesn't
                read as a flat block. Subtle direction-tinted swoop. */}
            <linearGradient
              id={`route-fill-${forecast.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={`rgb(${dirRgb})`} stopOpacity={0.55} />
              <stop offset="100%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.95} />
            </linearGradient>
            {/* Soft outer glow on the cursor */}
            <radialGradient id={`route-glow-${forecast.id}`}>
              <stop offset="0%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.45} />
              <stop offset="100%" stopColor={`rgb(${accentRgb})`} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Base track — full SL→TP rail, very dim */}
          <line
            x1={slX}
            y1={trackY}
            x2={tpX}
            y2={trackY}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />

          {/* SL → Entry segment (rose, dashed) — the path back to the
              loss line, drawn dim because nobody wants to go this way */}
          <line
            x1={slX}
            y1={trackY}
            x2={entryX}
            y2={trackY}
            stroke={`rgba(${VT.roseRgb},0.35)`}
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Entry → Now segment (gradient) — the realized travel.
              This is the trader's actual journey so far. */}
          <motion.line
            x1={entryX}
            y1={trackY}
            x2={cursorX}
            y2={trackY}
            stroke={`url(#route-fill-${forecast.id})`}
            strokeWidth={2.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: VT.easeOut, delay: 0.15 }}
            style={{ filter: `drop-shadow(0 0 4px rgba(${accentRgb},0.35))` }}
          />

          {/* Now → TP segment (emerald, very dashed) — the remaining
              gap to target. Shows what's still left to earn. */}
          <line
            x1={cursorX}
            y1={trackY}
            x2={tpX}
            y2={trackY}
            stroke={`rgba(${VT.emeraldRgb},0.28)`}
            strokeWidth={1.4}
            strokeDasharray="3 3"
            strokeLinecap="round"
          />

          {/* ── MARKERS ──────────────────────────────────────���──────
              SL ─ Entry ─ TP. NOW renders separately as a pulsing orb. */}
          {/* SL marker */}
          <RailMarker
            x={slX}
            y={trackY}
            label="STOP"
            sublabel={String(stop)}
            color={VT.rose}
            rgb={VT.roseRgb}
          />
          {/* Entry marker */}
          <RailMarker
            x={entryX}
            y={trackY}
            label="ENTRY"
            sublabel={entryTagged ? "tagged" : "open"}
            color={entryColor}
            rgb={entryRgb}
            faded={!entryTagged}
          />
          {/* TP marker */}
          <RailMarker
            x={tpX}
            y={trackY}
            label="TARGET"
            sublabel={String(target)}
            color={VT.emerald}
            rgb={VT.emeraldRgb}
          />

          {/* ── NOW CURSOR ───────���────────��─────────────────────────
              Live position. Three layers stacked at cursorX:
                - soft radial glow (50px wide)
                - pulsing outer ring (animated)
                - solid inner orb */}
          {/* Soft radial glow — animates cx so the glow tracks the
              cursor smoothly when scenarios fire. Pulses gently when
              live, holds steady when simulating. */}
          <motion.circle
            cy={trackY}
            r={20}
            fill={`url(#route-glow-${forecast.id})`}
            initial={{ cx: cursorX, opacity: 0 }}
            animate={{
              cx: cursorX,
              opacity: simActive ? 0.9 : [0.6, 1, 0.6],
            }}
            transition={{
              cx: { duration: 0.4, ease: "easeOut" },
              opacity: simActive
                ? { duration: 0.3 }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          {/* Pulsing outer ring — color flips to scenario tone on
              resolution. Repeating scale pulse continues regardless. */}
          <motion.circle
            cy={trackY}
            r={7}
            fill="transparent"
            stroke={cursorColor}
            strokeWidth={1.2}
            initial={{ cx: cursorX, scale: 0.8, opacity: 0 }}
            animate={{
              cx: cursorX,
              scale: [1, 1.5, 1],
              opacity: [0.85, 0.15, 0.85],
            }}
            transition={{
              cx: { duration: 0.4, ease: "easeOut" },
              scale: { duration: 2, repeat: Infinity, ease: "easeOut" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeOut" },
            }}
          />
          {/* Solid inner orb — the visible cursor head. The cx tween
              is the workhorse: when the rAF loop in the simulation
              hook moves simState.lean each frame, this orb follows
              with a 400ms ease-out to soften the per-frame deltas
              into a continuous slide. */}
          <motion.circle
            cy={trackY}
            r={4.8}
            fill={cursorColor}
            initial={{ cx: cursorX, scale: 0.6, opacity: 0 }}
            animate={{ cx: cursorX, scale: 1, opacity: 1 }}
            transition={{
              cx: { duration: 0.4, ease: "easeOut" },
              scale: { duration: 0.6, ease: VT.easeOut, delay: 0.4 },
              opacity: { duration: 0.6, ease: VT.easeOut, delay: 0.4 },
            }}
            style={{ filter: `drop-shadow(0 0 6px rgba(${cursorRgb},0.7))` }}
          />
          {/* Tiny paper-white dot at the orb's center — a glint. */}
          <motion.circle
            cy={trackY}
            r={1.8}
            fill={VT.paper}
            opacity={0.95}
            initial={{ cx: cursorX }}
            animate={{ cx: cursorX }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* "NOW" / "SIM" callout balloon above the cursor. Text
              flips to "SIM" while a scenario is loaded so the reader
              knows the rail is showing a hypothetical, not live. */}
          <motion.g
            initial={{ x: cursorX, y: trackY - 18 }}
            animate={{ x: cursorX, y: trackY - 18 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <rect
              x={-15}
              y={-9}
              width={30}
              height={13}
              rx={3}
              fill={`rgba(${cursorRgb},0.20)`}
              stroke={`rgba(${cursorRgb},0.5)`}
              strokeWidth={0.8}
            />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7}
              fontWeight={600}
              fill={cursorColor}
              style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              {simActive ? "SIM" : "NOW"}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* ── DATA ROW (sim-reactive) ────────────────────────────────
          Three numeric callouts that update with the cursor. When the
          simulation is idle we use the real-time geometry. When a
          scenario is loaded we re-derive everything from effectiveLean
          so the whole rail tells one consistent story:
            - leftmost cell  : room remaining to SL (effectiveLean)
            - center cell    : entry status keyed off effectiveLean
                               vs rrEntryFrac (Waiting / Tagged / Filled)
            - rightmost cell : gap remaining to TP (1 − effectiveLean)
          The callout is wrapped in AnimatePresence with a per-band
          key so the copy crossfades when the simulation moves the
          cursor across a threshold band — that's what makes the
          numbers feel alive without ever stuttering. */}
      {(() => {
        /* SL-side room — when simulating, the room is whatever the
           cursor's effective lean is (since lean=0 sits AT SL). */
        const slRoom = simActive ? effectiveLean : toInvalidation
        const tpGap = simActive ? 1 - effectiveLean : toTarget

        /* Entry state — derived from the lean's position relative to
           the entry fraction (1/(1+rr)). Three crisp bands so the
           label feels deterministic, not jittery. */
        const simEntryStatus =
          effectiveLean < rrEntryFrac - 0.04
            ? { label: "Waiting", sub: "below trigger", color: VT.ashSoft, rgb: "232,232,222" }
            : effectiveLean < rrEntryFrac + 0.06
              ? { label: "Tagged", sub: "fill confirmed", color: VT.emerald, rgb: VT.emeraldRgb }
              : effectiveLean > 0.92
                ? { label: "Filled", sub: "near target", color: VT.emerald, rgb: VT.emeraldRgb }
                : { label: "Filled", sub: "trade in flight", color: VT.emerald, rgb: VT.emeraldRgb }

        /* Reuse the real-time entry copy unless we're simulating. */
        const entryPrimary = simActive ? simEntryStatus.label : entryLabel
        const entrySecondary = simActive
          ? simEntryStatus.sub
          : entryTagged
            ? "fill confirmed"
            : toEntry < 0.2
              ? "near trigger"
              : "open · waiting"
        const entryColorEff = simActive ? simEntryStatus.color : entryColor
        const entryRgbEff = simActive ? simEntryStatus.rgb : entryRgb

        return (
          <div className="grid grid-cols-3 gap-2">
            <RouteCallout
              label="To stop"
              primary={`${Math.round(slRoom * 100)}% room`}
              secondary={
                slRoom < 0.18
                  ? "danger close"
                  : slRoom < 0.4
                    ? "watching"
                    : "comfortable"
              }
              color={
                slRoom < 0.18
                  ? VT.rose
                  : slRoom < 0.4
                    ? VT.amber
                    : VT.emerald
              }
              rgb={
                slRoom < 0.18
                  ? VT.roseRgb
                  : slRoom < 0.4
                    ? "245,158,11"
                    : VT.emeraldRgb
              }
              align="left"
            />
            <RouteCallout
              label="Entry"
              primary={entryPrimary}
              secondary={entrySecondary}
              color={entryColorEff}
              rgb={entryRgbEff}
              align="center"
            />
            <RouteCallout
              label="To target"
              primary={`${Math.round(tpGap * 100)}% gap`}
              secondary={
                tpGap < 0.12
                  ? "near TP"
                  : tpGap < 0.32
                    ? "in striking range"
                    : "long road"
              }
              color={
                tpGap < 0.12
                  ? VT.emerald
                  : tpGap < 0.32
                    ? VT.amber
                    : VT.ashSoft
              }
              rgb={
                tpGap < 0.12
                  ? VT.emeraldRgb
                  : tpGap < 0.32
                    ? "245,158,11"
                    : "232,232,222"
              }
              align="right"
            />
          </div>
        )
      })()}
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   RESOLVED ROUTE CARD — full-block transform on TP / SL hit
   ────────────────────────────────────────────────────────────────────
   When the simulation runs the "Hits TP" or "Hits SL" scenario, the
   entire Live Route block morphs into a comprehensive "what happened"
   briefing. Five regions, top to bottom:

     1. VERDICT BANNER     — large icon + tone-tinted headline +
                             elapsed-time chip on the right
     2. OUTCOME GRID       — 3 numeric callouts: Result, Final price,
                             Time elapsed (the audit triple)
     3. JOURNEY RAIL       — a static rendition of the rail with the
                             cursor frozen at the resolution point
                             (TP marker emerald, SL marker rose)
     4. PLAIN-ENGLISH      — multi-sentence narration that names the
                             pair, direction, level tagged, and what
                             that means for the trader's record
     5. RESET BUTTON       — returns the rail to its live state

   The morph itself is animated via framer's layout + AnimatePresence:
   the card fades in over 0.32s with a tiny y-translate so the
   transition reads as a "this resolved" reveal, not a hard swap.
   ═══════════════════════════════════════════════════════════════════ */
function ResolvedRouteCard({
  forecast,
  isWin,
  elapsedMs,
  finalPrice,
  entryDecimals,
  rMultiple,
  rr,
  onReset,
  target,
  stop,
}: {
  forecast: ForecastItem
  isWin: boolean
  elapsedMs: number
  finalPrice: number
  entryDecimals: number
  rMultiple: number
  rr: number
  onReset: () => void
  target: string
  stop: string
}) {
  const tone = isWin
    ? { color: VT.emerald, rgb: VT.emeraldRgb, label: "TARGET HIT" }
    : { color: VT.rose, rgb: VT.roseRgb, label: "STOP HIT" }
  const Icon = isWin ? CheckCircle2 : XCircle

  const entryPrice = parsePrice(forecast.entry)
  const priceDelta = finalPrice - entryPrice
  const isLong = forecast.direction === "LONG"
  const directionalDelta = isLong ? priceDelta : -priceDelta
  const pctMove =
    entryPrice !== 0 ? (Math.abs(priceDelta) / entryPrice) * 100 : 0

  /* Rail geometry — same constants as LiveRoute so the resolved rail
     reads as a frozen frame of the live one. */
  const W = 320
  const H = 56
  const PAD_X = 18
  const trackY = 30
  const slX = PAD_X
  const tpX = W - PAD_X
  const rrEntryFrac = rr ? 1 / (1 + rr) : 0.33
  const entryX = slX + (tpX - slX) * rrEntryFrac
  const finalX = isWin ? tpX : slX

  /* Plain-English narration that names the actual levels + result. */
  const narration = isWin
    ? `Price reached ${target} on ${forecast.instrument}, tagging the take-profit level. The ${forecast.direction.toLowerCase()} call resolves as a win and the +${rMultiple.toFixed(1)}R is credited to the user's track record. Position closed in ${formatElapsed(elapsedMs)} of simulated time.`
    : `Price fell to ${stop} on ${forecast.instrument}, tagging the stop-loss level. The ${forecast.direction.toLowerCase()} call resolves as a loss with risk capped at the planned 1R. Position closed in ${formatElapsed(elapsedMs)} of simulated time — the plan is over.`

  return (
    <motion.div
      key={isWin ? "resolved-win" : "resolved-loss"}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: VT.easeOut }}
      className="relative flex flex-col"
      style={{
        padding: "13px 14px 14px",
        borderRadius: 12,
        background: `linear-gradient(180deg, rgba(${tone.rgb},0.06) 0%, rgba(${tone.rgb},0.015) 100%)`,
        border: `1px solid rgba(${tone.rgb},0.32)`,
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* Decorative top-corner glow — emerald wash for wins, rose for
          losses. Soft enough not to compete with the verdict banner. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: 999,
          background: `radial-gradient(circle, rgba(${tone.rgb},0.22) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── 1. VERDICT BANNER ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: VT.easeOut, delay: 0.1 }}
            className="relative flex items-center justify-center flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background: `rgba(${tone.rgb},0.14)`,
              border: `1px solid rgba(${tone.rgb},0.42)`,
            }}
          >
            {/* Outer pulse — celebratory on win, ominous on loss. */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ background: `rgba(${tone.rgb},0.28)` }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <Icon size={15} strokeWidth={2} style={{ color: tone.color }} />
          </motion.div>
          <div className="flex flex-col min-w-0" style={{ gap: 2 }}>
            <span
              className="font-sans"
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: tone.color,
                lineHeight: 1,
                opacity: 0.95,
              }}
            >
              Simulation resolved
            </span>
            <span
              className="font-sans truncate"
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: VT.paper,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {tone.label}
            </span>
          </div>
        </div>
        {/* Elapsed-time chip — frozen at resolution. */}
        <motion.span
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: VT.easeOut, delay: 0.2 }}
          className="font-mono tabular-nums flex-shrink-0"
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: tone.color,
            letterSpacing: "-0.005em",
            padding: "3px 8px 4px",
            borderRadius: 999,
            background: `rgba(${tone.rgb},0.10)`,
            border: `1px solid rgba(${tone.rgb},0.30)`,
            lineHeight: 1.1,
          }}
        >
          {formatElapsed(elapsedMs)} elapsed
        </motion.span>
      </div>

      {/* ── 2. OUTCOME GRID — 3 numeric callouts ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: VT.easeOut, delay: 0.25 }}
        className="grid grid-cols-3 gap-2"
      >
        <ResolvedStat
          label="Result"
          value={isWin ? `+${rMultiple.toFixed(1)}R` : "−1.0R"}
          sub={isWin ? "profit booked" : "risk capped"}
          color={tone.color}
          rgb={tone.rgb}
          align="left"
        />
        <ResolvedStat
          label="Final price"
          value={formatPrice(finalPrice, entryDecimals)}
          sub={`${directionalDelta >= 0 ? "+" : "−"}${pctMove.toFixed(2)}% from entry`}
          color={tone.color}
          rgb={tone.rgb}
          align="center"
          mono
        />
        <ResolvedStat
          label="Time elapsed"
          value={formatElapsed(elapsedMs)}
          sub="sim duration"
          color={VT.paper}
          rgb="232,232,222"
          align="right"
          mono
        />
      </motion.div>

      {/* ── 3. JOURNEY RAIL — frozen frame ──────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: VT.easeOut, delay: 0.35 }}
        className="relative"
        style={{ height: H, width: "100%", overflow: "visible" }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          width="100%"
          height={H}
          style={{ overflow: "visible" }}
        >
          {/* Base dashed rail */}
          <line
            x1={slX}
            y1={trackY}
            x2={tpX}
            y2={trackY}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          {/* Entry → finalX — the full journey, tinted in tone color */}
          <motion.line
            x1={entryX}
            y1={trackY}
            stroke={tone.color}
            strokeWidth={2.4}
            strokeLinecap="round"
            initial={{ x2: entryX, opacity: 0 }}
            animate={{ x2: finalX, opacity: 1 }}
            transition={{ duration: 0.7, ease: VT.easeOut, delay: 0.4 }}
            y2={trackY}
            style={{ filter: `drop-shadow(0 0 4px rgba(${tone.rgb},0.45))` }}
          />
          {/* SL marker */}
          <RailMarker
            x={slX}
            y={trackY}
            label="SL"
            sublabel={String(stop)}
            color={VT.rose}
            rgb={VT.roseRgb}
            faded={isWin}
          />
          {/* Entry marker */}
          <RailMarker
            x={entryX}
            y={trackY}
            label="ENTRY"
            sublabel="tagged"
            color={VT.paper}
            rgb="232,232,222"
          />
          {/* TP marker */}
          <RailMarker
            x={tpX}
            y={trackY}
            label="TP"
            sublabel={String(target)}
            color={VT.emerald}
            rgb={VT.emeraldRgb}
            faded={!isWin}
          />
          {/* Frozen cursor at finalX — solid orb, no pulse, with a
              checkmark or x glyph rendered next to it as a stamp. */}
          <motion.circle
            cx={finalX}
            cy={trackY}
            r={18}
            fill="transparent"
            stroke={tone.color}
            strokeWidth={1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.4, ease: VT.easeOut, delay: 1.1 }}
          />
          <motion.circle
            cx={finalX}
            cy={trackY}
            r={5.4}
            fill={tone.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: VT.easeOut, delay: 1.1 }}
            style={{ filter: `drop-shadow(0 0 8px rgba(${tone.rgb},0.8))` }}
          />
          <circle cx={finalX} cy={trackY} r={2} fill={VT.paper} opacity={0.95} />
          {/* Verdict stamp above the frozen cursor */}
          <motion.g
            initial={{ opacity: 0, y: -trackY + 8 }}
            animate={{ opacity: 1, y: -trackY + 12 }}
            transition={{ duration: 0.4, ease: VT.easeOut, delay: 1.2 }}
            style={{ transform: `translate(${finalX}px, 0px)` }}
          >
            <rect
              x={-19}
              y={-9}
              width={38}
              height={13}
              rx={3}
              fill={`rgba(${tone.rgb},0.22)`}
              stroke={`rgba(${tone.rgb},0.55)`}
              strokeWidth={0.8}
            />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7}
              fontWeight={600}
              fill={tone.color}
              style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              {isWin ? "WIN" : "LOSS"}
            </text>
          </motion.g>
        </svg>
      </motion.div>

      {/* ── 4. PLAIN-ENGLISH NARRATION ───────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: VT.easeOut, delay: 0.5 }}
        className="font-sans"
        style={{
          fontSize: 11.5,
          color: VT.paperDim,
          letterSpacing: "0.005em",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {narration}
      </motion.p>

      {/* ── 5. RESET BUTTON ─────────────────────────────────���─ */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: VT.easeOut, delay: 0.6 }}
        onClick={(e) => {
          e.stopPropagation()
          onReset()
        }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="font-sans inline-flex items-center justify-center gap-1.5 self-start"
        style={{
          fontSize: 10.5,
          fontWeight: 500,
          letterSpacing: "0.01em",
          color: tone.color,
          padding: "6px 12px 7px",
          borderRadius: 999,
          background: `rgba(${tone.rgb},0.08)`,
          border: `1px solid rgba(${tone.rgb},0.32)`,
          cursor: "pointer",
          lineHeight: 1.1,
        }}
      >
        <RotateCcw size={11} strokeWidth={2} />
        Reset to live rail
      </motion.button>
    </motion.div>
  )
}

/** ResolvedStat — single tile in the OUTCOME GRID. Three columns wide
 *  by 1 row tall. Eyebrow label on top, big tabular-numeric value in
 *  the middle, small secondary descriptor on the bottom. The whole
 *  tile picks up a soft tone tint to communicate severity at a glance. */
function ResolvedStat({
  label,
  value,
  sub,
  color,
  rgb,
  align,
  mono,
}: {
  label: string
  value: string
  sub: string
  color: string
  rgb: string
  align: "left" | "center" | "right"
  mono?: boolean
}) {
  const justify =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center"
  return (
    <div
      className={`flex flex-col ${justify}`}
      style={{
        padding: "7px 9px 8px",
        borderRadius: 8,
        background: `rgba(${rgb},0.04)`,
        border: `1px solid rgba(${rgb},0.16)`,
        gap: 3,
        minWidth: 0,
      }}
    >
      <span
        className="font-sans"
        style={{
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: VT.ashSoft,
          lineHeight: 1,
          opacity: 0.85,
        }}
      >
        {label}
      </span>
      <span
        className={`${mono ? "font-mono" : "font-sans"} tabular-nums truncate w-full ${align === "left" ? "" : align === "right" ? "" : ""}`}
        style={{
          fontSize: 13,
          fontWeight: 500,
          color,
          letterSpacing: "-0.005em",
          lineHeight: 1.1,
          textAlign: align,
        }}
      >
        {value}
      </span>
      <span
        className="font-sans truncate w-full"
        style={{
          fontSize: 9,
          color: VT.ashSoft,
          letterSpacing: "0.005em",
          lineHeight: 1.15,
          opacity: 0.85,
          textAlign: align,
        }}
      >
        {sub}
      </span>
    </div>
  )
}

/** RailMarker — a single anchor point on the LiveRoute rail. Renders
 *  a vertical hash mark + a labeled dot + a tiny text label above and
 *  a sublabel below. SVG-native so it composes inside the rail's <svg>. */
function RailMarker({
  x,
  y,
  label,
  sublabel,
  color,
  rgb,
  faded = false,
}: {
  x: number
  y: number
  label: string
  sublabel: string
  color: string
  rgb: string
  faded?: boolean
}) {
  return (
    <g style={{ opacity: faded ? 0.65 : 1 }}>
      {/* Vertical hash mark */}
      <line
        x1={x}
        y1={y - 5}
        x2={x}
        y2={y + 5}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Outer ring */}
      <circle
        cx={x}
        cy={y}
        r={3.5}
        fill={`rgba(${rgb},0.18)`}
        stroke={`rgba(${rgb},0.5)`}
        strokeWidth={0.8}
      />
      {/* Inner solid */}
      <circle cx={x} cy={y} r={1.6} fill={color} />
      {/* Top label */}
      <text
        x={x}
        y={y - 12}
        textAnchor="middle"
        fontSize={7}
        fontWeight={500}
        fill={color}
        style={{ letterSpacing: "0.16em" }}
      >
        {label}
      </text>
      {/* Bottom sublabel */}
      <text
        x={x}
        y={y + 18}
        textAnchor="middle"
        fontSize={7}
        fontWeight={400}
        fill="rgba(255,255,255,0.55)"
        style={{ letterSpacing: "0.04em" }}
      >
        {sublabel}
      </text>
    </g>
  )
}

/** RouteEndcap — anchor card on a corner of the rail, telling the
 *  reader what each end MEANS (LOSS or WIN, at what level, for how
 *  many R). Two of these stack on the resolution row. */
function RouteEndcap({
  side,
  headline,
  level,
  zoneLabel,
  delta,
  active,
  dim,
}: {
  side: "loss" | "win"
  /** Section name — "STOP LOSS" / "TAKE PROFIT" */
  headline: string
  /** Price string, e.g. "18,180" */
  level: string
  /** Short trading verdict — "LOSS ZONE" / "TARGET ZONE" */
  zoneLabel: string
  /** R-multiple chip, e.g. "−1.0R" / "+2.2R" */
  delta: string
  /** When the simulation cursor is heading toward this side, the panel
   *  picks up a brighter border + soft glow so the reader feels the
   *  forecast emphasis follow the dot. */
  active?: boolean
  /** Inverse of active — used to quiet the opposite panel so attention
   *  follows the simulated direction. */
  dim?: boolean
}) {
  const isWin = side === "win"
  const color = isWin ? VT.emerald : VT.rose
  const rgb = isWin ? VT.emeraldRgb : VT.roseRgb

  return (
    <motion.div
      layout
      className="relative flex flex-col"
      animate={{
        opacity: dim ? 0.55 : 1,
      }}
      transition={{ duration: 0.35, ease: VT.easeOut }}
      style={{
        padding: "9px 11px 10px",
        borderRadius: 10,
        background: active
          ? `rgba(${rgb},0.10)`
          : `rgba(${rgb},0.05)`,
        border: active
          ? `1px solid rgba(${rgb},0.55)`
          : `1px solid rgba(${rgb},0.18)`,
        gap: 4,
        textAlign: isWin ? "right" : "left",
        boxShadow: active ? `0 0 18px rgba(${rgb},0.18)` : undefined,
        transition:
          "background 320ms ease-out, border-color 320ms ease-out, box-shadow 320ms ease-out",
        overflow: "hidden",
      }}
    >
      {/* Subtle corner glow when active so the panel reads "primed"
          without competing with the rail. */}
      {active && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -28,
            [isWin ? "right" : "left"]: -28,
            width: 80,
            height: 80,
            borderRadius: 999,
            background: `radial-gradient(circle, rgba(${rgb},0.22) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Top row — section eyebrow + R-multiple chip. Order flips on
          the win side so the chip lands on the inside (visually
          aligned toward the rail center). */}
      <div
        className={`relative flex items-center justify-between gap-2 ${isWin ? "flex-row-reverse" : ""}`}
      >
        <span
          className="font-sans truncate"
          style={{
            fontSize: 8.5,
            color: active ? color : VT.ashSoft,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            lineHeight: 1,
            opacity: active ? 1 : 0.82,
            transition: "color 250ms ease-out, opacity 250ms ease-out",
          }}
        >
          {headline}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 9.5,
            color,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1,
            padding: "2.5px 7px",
            borderRadius: 999,
            background: `rgba(${rgb},0.12)`,
            border: `1px solid rgba(${rgb},0.30)`,
          }}
        >
          {delta}
        </span>
      </div>

      {/* Price level — the big number traders actually scan for. */}
      <span
        className="font-sans tabular-nums truncate relative"
        style={{
          fontSize: 15,
          color: VT.paper,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {level}
      </span>

      {/* Zone label — short trading verdict. No more "→ resolves WIN" —
          just "LOSS ZONE" / "TARGET ZONE" in the side's tone. */}
      <span
        className={`font-sans inline-flex items-center gap-1.5 relative ${isWin ? "self-end" : "self-start"}`}
        style={{ marginTop: 1 }}
      >
        <span
          aria-hidden
          style={{
            width: active ? 5 : 4,
            height: active ? 5 : 4,
            borderRadius: 999,
            background: color,
            boxShadow: active
              ? `0 0 7px rgba(${rgb},0.85)`
              : `0 0 4px rgba(${rgb},0.5)`,
            display: "inline-block",
            transition: "all 280ms ease-out",
          }}
        />
        <span
          style={{
            fontSize: 9.5,
            color,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {zoneLabel}
        </span>
      </span>
    </motion.div>
  )
}

/** RouteCallout — bottom-row numeric tile under the rail. Reads as a
 *  caption for what the rail's geometry just expressed. */
function RouteCallout({
  label,
  primary,
  secondary,
  color,
  rgb,
  align,
}: {
  label: string
  primary: string
  secondary: string
  color: string
  rgb: string
  align: "left" | "center" | "right"
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: 2,
        textAlign: align,
        alignItems:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
      }}
    >
      <span
        className="font-sans truncate max-w-full"
        style={{
          fontSize: 8.5,
          color: VT.ashSoft,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1,
          opacity: 0.78,
        }}
      >
        {label}
      </span>
      <span
        className="font-sans tabular-nums truncate max-w-full"
        style={{
          fontSize: 12,
          color,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}
      >
        {primary}
      </span>
      <span
        className="font-sans truncate max-w-full inline-flex items-center gap-1"
        style={{
          fontSize: 9.5,
          color: VT.paperDim,
          fontWeight: 400,
          letterSpacing: "0.005em",
          lineHeight: 1.2,
          opacity: 0.85,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 4,
            height: 4,
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 3px rgba(${rgb},0.55)`,
            display: "inline-block",
          }}
        />
        {secondary}
      </span>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   STATUS ACTION TRAY — high-quality "Tracking" surface
   ────────────────────────────────────────────────────────────────────
   Four richer cards (icon + title + sub-status) plus a footer summary
   chip. Each card animates state changes (active dot pulse), shows a
   plain-English secondary line, and gracefully indicates when the user
   is muted (greys the other three cards). The footer chip summarizes
   the current alert state — "no alerts set" / "watching" / "alerts on
   entry & target" — so the trader doesn't have to scan four buttons
   to confirm what they'll be notified about.
   ═══════════════════════════════════════════════════════════════════ */
function StatusActionTray() {
  const [watch, setWatch] = useState(false)
  const [alertEntry, setAlertEntry] = useState(false)
  const [alertTp, setAlertTp] = useState(false)
  const [mute, setMute] = useState(false)

  /** Mute disables the alerts (without losing the toggle state) — the
   *  cards visually grey out but their stored on/off survives toggling
   *  mute back off. */
  const effectivelyOff = (active: boolean) => mute && !active

  const ACTIONS: {
    key: string
    title: string
    /** Two lines under the title. `subOn` shows when the toggle is
     *  ON, `subOff` when it's OFF. Mute applies a third overlay. */
    subOn: string
    subOff: string
    icon: LucideIcon
    on: boolean
    set: (v: boolean) => void
    color: string
    rgb: string
    /** Set true for the mute card so the active-state styling
     *  inverts (mute "on" should look subdued, not loud). */
    isMute?: boolean
  }[] = [
    {
      key: "watch",
      title: "Watch",
      subOn: "Live in feed",
      subOff: "Tap to follow",
      icon: Eye,
      on: watch,
      set: setWatch,
      color: VT.emerald,
      rgb: VT.emeraldRgb,
    },
    {
      key: "entry",
      title: "Entry alert",
      subOn: "Pings on tag",
      subOff: "Notify on entry",
      icon: Crosshair,
      on: alertEntry,
      set: setAlertEntry,
      color: VT.amber,
      rgb: "245,158,11",
    },
    {
      key: "tp",
      title: "Target alert",
      subOn: "Pings on hit",
      subOff: "Notify at TP",
      icon: Target,
      on: alertTp,
      set: setAlertTp,
      color: VT.emerald,
      rgb: VT.emeraldRgb,
    },
    {
      key: "mute",
      title: "Mute",
      subOn: "All alerts muted",
      subOff: "Pings allowed",
      icon: VolumeX,
      on: mute,
      set: setMute,
      color: VT.rose,
      rgb: VT.roseRgb,
      isMute: true,
    },
  ]

  /** Compose the footer summary chip's sentence. */
  const footerSummary = (() => {
    if (mute) return "All alerts muted"
    const bits: string[] = []
    if (watch) bits.push("watching")
    if (alertEntry) bits.push("entry")
    if (alertTp) bits.push("target")
    if (bits.length === 0) return "No alerts set"
    if (bits.length === 1 && bits[0] === "watching") return "Following · no pings"
    return `Pings on ${bits.filter((b) => b !== "watching").join(" + ") || "—"}${
      watch ? " · watching" : ""
    }`
  })()

  // Footer tint — emerald when alerts are armed, ash otherwise, rose
  // when muted.
  const footerTone = mute
    ? { color: VT.rose, rgb: VT.roseRgb }
    : alertEntry || alertTp
      ? { color: VT.emerald, rgb: VT.emeraldRgb }
      : { color: VT.ashSoft, rgb: "232,232,222" }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Tracking</Eyebrow>
        <span
          className="font-sans"
          style={{
            fontSize: 9,
            color: VT.ashGhost,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: 0.7,
          }}
        >
          Tap to toggle
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {ACTIONS.map((a) => {
          const SI = a.icon
          const greyed = !a.isMute && effectivelyOff(a.on)
          return (
            <motion.button
              key={a.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                a.set(!a.on)
              }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: VT.easeOut }}
              className="relative flex items-start gap-2.5 text-left overflow-hidden"
              style={{
                padding: "9px 10px 10px",
                borderRadius: 8,
                background: a.on
                  ? `rgba(${a.rgb},0.08)`
                  : "rgba(255,255,255,0.022)",
                border: a.on
                  ? `1px solid rgba(${a.rgb},0.36)`
                  : `1px solid ${VT.ruleSoft}`,
                color: a.on ? a.color : VT.paperDim,
                cursor: "pointer",
                transition:
                  "background 200ms ease-out, border-color 200ms ease-out, opacity 200ms ease-out",
                opacity: greyed ? 0.45 : 1,
              }}
              aria-pressed={a.on}
              aria-label={`Toggle ${a.title}`}
            >
              {/* ── ICON BLOCK — small square with the icon inside.
                  When ON, gets a tinted bg + a tiny pulsing dot in
                  the upper-right corner of the icon block. */}
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: a.on
                      ? `rgba(${a.rgb},0.14)`
                      : "rgba(255,255,255,0.04)",
                    border: a.on
                      ? `1px solid rgba(${a.rgb},0.32)`
                      : `1px solid ${VT.ruleSoft}`,
                    transition: "all 200ms ease-out",
                  }}
                >
                  <SI
                    size={13}
                    strokeWidth={1.8}
                    style={{
                      color: a.on ? a.color : VT.ashSoft,
                    }}
                  />
                </div>
                {a.on && (
                  <motion.span
                    aria-hidden
                    className="absolute"
                    style={{
                      top: -2,
                      right: -2,
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: a.color,
                      boxShadow: `0 0 6px rgba(${a.rgb},0.7)`,
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>

              {/* ── COPY BLOCK — title (paper) + sub-status (dim) */}
              <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 2 }}>
                <span
                  className="font-sans truncate"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.15,
                    color: a.on ? a.color : VT.paper,
                  }}
                >
                  {a.title}
                </span>
                <span
                  className="font-sans truncate"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 400,
                    letterSpacing: "0.005em",
                    lineHeight: 1.2,
                    color: a.on ? a.color : VT.ashSoft,
                    opacity: a.on ? 0.92 : 0.85,
                  }}
                >
                  {a.on ? a.subOn : a.subOff}
                </span>
              </div>

              {/* ── ON/OFF rail — tiny capsule on the far right that
                  doubles as a state indicator. Width grows when ON
                  to draw attention to the activated card. */}
              <motion.span
                aria-hidden
                className="flex-shrink-0 self-center"
                animate={{
                  width: a.on ? 18 : 8,
                  opacity: 1,
                }}
                transition={{ duration: 0.22, ease: VT.easeOut }}
                style={{
                  height: 4,
                  borderRadius: 999,
                  background: a.on ? a.color : "rgba(255,255,255,0.10)",
                  boxShadow: a.on ? `0 0 5px rgba(${a.rgb},0.55)` : undefined,
                }}
              />
            </motion.button>
          )
        })}
      </div>

      {/* ── FOOTER SUMMARY CHIP ─────────────────────────��───────────
          Plain-English read-out of the current alert configuration,
          so the trader can confirm "what's set" without parsing four
          icons. Tints with the dominant tone above. */}
      <div
        className="flex items-center justify-between gap-3 px-2.5 py-1.5"
        style={{
          marginTop: 2,
          borderRadius: 999,
          background: `rgba(${footerTone.rgb},0.05)`,
          border: `1px solid rgba(${footerTone.rgb},0.18)`,
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: footerTone.color,
              boxShadow: `0 0 4px rgba(${footerTone.rgb},0.55)`,
              flexShrink: 0,
            }}
          />
          <span
            className="font-sans truncate"
            style={{
              fontSize: 10,
              color: footerTone.color,
              fontWeight: 500,
              letterSpacing: "0.005em",
              lineHeight: 1.2,
            }}
          >
            {footerSummary}
          </span>
        </div>
        {(watch || alertEntry || alertTp) && !mute && (
          <span
            className="font-sans"
            style={{
              fontSize: 9,
              color: VT.ashGhost,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 500,
              opacity: 0.78,
              flexShrink: 0,
            }}
          >
            armed
          </span>
        )}
      </div>
    </div>
  )
}

/** Footnote — subtle confidence-drift micro-chart + ID. Closes the
 *  capsule with engineering-grade detail for verifiers. */
function StatusFootnote({
  forecast,
  accentRgb,
}: {
  forecast: ForecastItem
  accentRgb: string
}) {
  // Confidence drift — synthesize 8 points around the stated confidence,
  // ending at the current value. Used as a sparkline.
  const seed = useMemo(() => seedFrom(forecast.id), [forecast.id])
  const points = useMemo(() => {
    const c = forecast.confidence ?? 60
    const arr: number[] = []
    for (let i = 0; i < 8; i++) {
      const noise = Math.sin((seed + i * 13) * 0.27) * 8
      const trend = ((i / 7) * (c - (c - 6))) // slight upward trend
      arr.push(Math.max(20, Math.min(100, c - 6 + trend + noise)))
    }
    arr[arr.length - 1] = c
    return arr
  }, [forecast.confidence, seed])

  const W = 60
  const H = 14
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * W
      const y = (1 - v / 100) * H
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <div className="flex items-center justify-between gap-3" style={{ opacity: 0.85 }}>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="font-sans"
          style={{
            fontSize: 8.5,
            color: VT.ashGhost,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: 0.78,
          }}
        >
          Conviction
        </span>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width={W} height={H}>
          <path
            d={path}
            fill="none"
            stroke={`rgb(${accentRgb})`}
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 2px rgba(${accentRgb},0.3))` }}
          />
        </svg>
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: 10,
            color: VT.paperDim,
            fontWeight: 500,
            letterSpacing: "0.005em",
          }}
        >
          {forecast.confidence}%
        </span>
      </div>

      <span
        className="font-mono truncate"
        style={{
          fontSize: 8.5,
          color: VT.ashGhost,
          letterSpacing: "0.04em",
          fontWeight: 400,
          opacity: 0.6,
          textTransform: "uppercase",
        }}
        title={`Forecast ID: ${forecast.id}`}
      >
        {`#${forecast.id.slice(-6).toUpperCase()}`}
      </span>
    </div>
  )
}



function CapsuleCell({
  label,
  value,
  color,
  sub,
  dotRgb,
}: {
  label: string
  value: string
  color: string
  sub?: React.ReactNode
  dotRgb?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow size={8.5}>{label}</Eyebrow>
      <div className="flex items-center gap-1.5">
        {dotRgb && (
          <span
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              background: `rgb(${dotRgb})`,
              boxShadow: `0 0 5px rgba(${dotRgb},0.55)`,
            }}
          />
        )}
        <span
          className="font-sans"
          style={{
            fontSize: 14,
            fontWeight: 500,
            color,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
      {sub}
    </div>
  )
}

/** Tiny SL ↔ TP progress hairline showing where price sits in range. */
function DistanceLeanBar({ lean, dirRgb }: { lean: number; dirRgb: string }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: 3,
        borderRadius: 2,
        background:
          "linear-gradient(90deg, rgba(239,68,68,0.18), rgba(255,255,255,0.04) 50%, rgba(16,185,129,0.18))",
      }}
    >
      <motion.div
        initial={{ left: "50%" }}
        animate={{ left: `${Math.max(0, Math.min(100, lean * 100))}%` }}
        transition={{ duration: 0.9, ease: VT.easeOut, delay: 0.25 }}
        style={{
          position: "absolute",
          top: -2,
          width: 7,
          height: 7,
          borderRadius: 999,
          background: `rgb(${dirRgb})`,
          transform: "translateX(-50%)",
          boxShadow: `0 0 6px rgba(${dirRgb},0.65)`,
        }}
      />
    </div>
  )
}


/* ════════════════════════════════════════════════════════════════════════
   3 + 4. FORECAST EXPLAINER — "Why this forecast exists"
   ─────────────────────────────────────────────────────────────────────────
   Replaces the old technical-first Decision Canvas with a human-first
   reading card. The AI inspects the forecast, picks a strategy template
   (Break & Retest / Liquidity Sweep / Trend Continuation / Reversal /
   Momentum Breakout / Session / Macro News / Mentor-Community / Range /
   Supply & Demand / Indicator), and translates the engine logic into
   plain English. Engine labels (Context, Trigger…) still exist deeper
   down — renamed to human labels — but never lead.

   Architecture:
     selectTemplate()   – scores 11 templates against the forecast, returns
                          { primary, secondary?, confidence, missingInfo }
     buildExplainer()   – pure data: pillars + receipts + plain-English
                          fields (paragraph, whyEnter, whatConfirms,
                          whatBreaks, watchNext, weakness, raisers)
     ForecastExplainer  – the card. Head + paragraph + three answer
                          blocks + watch-next + three expand rows
                          (Show proof / Show weakness / Show technical logic)
     ProofDrawer        – receipts grouped by meaning (Chart / Timing /
                          Engine / Macro / Community / Mentor / Missing),
                          each receipt translated with a "means…" line
     WeaknessDrawer     – why conviction is here + what would raise it
     TechnicalLogic     – the 6 pillars with simple labels:
                          Market situation · Entry reason · Proof needed ·
                          How to enter · Where it aims · What breaks it
   ════════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────────────── */
type CanvasPillar =
  | "context"
  | "trigger"
  | "confirmation"
  | "execution"
  | "target"
  | "invalidation"
type CanvasSource = "AUTHOR" | "ENGINE" | "COMMUNITY" | "MENTOR" | "PRICE"
type CanvasStatus = "confirmed" | "soft" | "missing" | "conflicting"
type ReceiptCategory =
  | "structure"
  | "liquidity"
  | "momentum"
  | "session"
  | "pattern"
  | "macro"
  | "risk"

interface CanvasReceipt {
  id: string
  pillar: CanvasPillar
  title: string
  source: CanvasSource
  category: ReceiptCategory
  strength: number
  status: CanvasStatus
  means: string
}

interface CanvasPillarNode {
  key: CanvasPillar
  label: string
  oneLine: string
  deeper: string
  status: CanvasStatus
}

type TemplateId =
  | "breakRetest"
  | "liquiditySweep"
  | "trendContinuation"
  | "reversal"
  | "momentumBreakout"
  | "session"
  | "macroNews"
  | "mentorCommunity"
  | "range"
  | "supplyDemand"
  | "indicator"
  | "discretionary"

interface ExplainerData {
  /* legacy template fields (kept so AnswerBlocks / WatchNext still work) */
  primaryTemplate: TemplateId
  primaryLabel: string
  secondaryTemplate?: TemplateId
  secondaryLabel?: string
  templateConfidence: number
  /* the new direct-trader layer */
  strategyName: string
  origin: { label: string; hex: string; rgb: string }
  reasonLine: string
  confluenceItems: { label: string; category: ReceiptCategory; strength: number }[]
  /* answer + watch fields (now confluence-aware) */
  whyEnter: string
  whatConfirms: string
  whatBreaks: string
  watchNext: string
  /* conviction */
  conviction: number
  convictionTier: 0 | 1 | 2
  convictionReasons: string[]
  convictionRaisers: string[]
  weaknessItems: string[]
  missingInfo: string[]
  pillars: CanvasPillarNode[]
  receipts: CanvasReceipt[]
  setupQuality: number
}

/* ── Pillar tone — colour + SIMPLE human label per pillar.
   Technical names live only on the `key`. ─────────────────────────── */
function pillarTone(p: CanvasPillar, dirColor: { rgb: string; hex: string }) {
  switch (p) {
    case "context":
      return { hex: dirColor.hex, rgb: dirColor.rgb, label: "Market situation" }
    case "trigger":
      return { hex: VT.cyan, rgb: VT.cyanRgb, label: "Entry reason" }
    case "confirmation":
      return { hex: VT.emerald, rgb: VT.emeraldRgb, label: "Proof needed" }
    case "execution":
      return { hex: VT.blue, rgb: VT.blueRgb, label: "How to enter" }
    case "target":
      return { hex: VT.amber, rgb: "245,158,11", label: "Where it aims" }
    case "invalidation":
      return { hex: VT.rose, rgb: VT.roseRgb, label: "What breaks it" }
  }
}

function sourceTone(s: CanvasSource) {
  switch (s) {
    case "AUTHOR":
      return { hex: VT.blue, rgb: VT.blueRgb, means: "Trader's own reason" }
    case "ENGINE":
      return { hex: VT.purple, rgb: VT.purpleRgb, means: "System detected this" }
    case "COMMUNITY":
      return { hex: VT.cyan, rgb: VT.cyanRgb, means: "Other traders agree — secondary proof" }
    case "MENTOR":
      return { hex: VT.amber, rgb: VT.amberRgb, means: "Reviewed by a senior trader" }
    case "PRICE":
      return { hex: VT.emerald, rgb: VT.emeraldRgb, means: "Visible on the chart right now" }
  }
}

/* ── StatusGlyph — universal visual vocabulary for evidence states ──── */
function StatusGlyph({ status }: { status: CanvasStatus }) {
  const map = {
    confirmed: { hex: VT.emerald, rgb: VT.emeraldRgb, char: "\u2713" },
    soft: { hex: VT.amber, rgb: "245,158,11", char: "~" },
    conflicting: { hex: VT.rose, rgb: VT.roseRgb, char: "!" },
    missing: { hex: VT.ashSoft, rgb: "148,163,184", char: "\u00b7" },
  } as const
  const t = map[status]
  return (
    <span
      className="font-mono inline-flex items-center justify-center"
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        background: rgba(t.rgb, 0.1),
        border: `1px solid ${rgba(t.rgb, 0.3)}`,
        color: t.hex,
        fontSize: 9,
        fontWeight: 600,
        lineHeight: 1,
      }}
      aria-label={status}
    >
      {t.char}
    </span>
  )
}

/* ── SourceMiniPill — tiny chip identifying receipt origin ─────────── */
function SourceMiniPill({ source }: { source: CanvasSource }) {
  const t = sourceTone(source)
  return (
    <span
      className="font-mono uppercase flex-shrink-0"
      style={{
        fontSize: 8,
        fontWeight: 500,
        letterSpacing: "0.18em",
        color: t.hex,
        padding: "1px 5px",
        borderRadius: 999,
        background: rgba(t.rgb, 0.1),
        border: `1px solid ${rgba(t.rgb, 0.22)}`,
      }}
    >
      {source}
    </span>
  )
}

/* ── Template labels ─────────────────────────────────────────────────── */
const TEMPLATE_LABELS: Record<TemplateId, string> = {
  breakRetest: "Break & Retest",
  liquiditySweep: "Liquidity Sweep",
  trendContinuation: "Trend Continuation",
  reversal: "Reversal",
  momentumBreakout: "Momentum Breakout",
  session: "Session Setup",
  macroNews: "Macro / News",
  mentorCommunity: "Mentor / Community Signal",
  range: "Range / Mean Reversion",
  supplyDemand: "Supply & Demand",
  indicator: "Indicator-Based",
  discretionary: "Discretionary Read",
}

/* ────────────────────────────────────────────────────────────────────
   Strategy-component detection.
   Instead of forcing the forecast into an abstract template, we extract
   the REAL components a trader uses and compose a setup name out of
   them. Examples produced:
     · "Mentor's bearish model"
     · "Previous daily high sweep · London killzone reversal"
     · "Trendline retest · Bullish OB tap"
     · "FOMC reaction · 4H key level retest"
   ─────────────────────────────────────────────────────────────────── */

interface StrategyComponents {
  liquidityEvent: string | null
  timing: string | null
  structureEvent: string | null
  patternEvent: string | null
  macroEvent: string | null
  sourceMode: "mentor" | "blend" | "community" | "own"
  /** raw confluences as displayed in the chip list */
  confluenceItems: { label: string; category: ReceiptCategory; strength: number }[]
}

function detectComponents(
  forecast: ForecastItem,
  dirWord: "bullish" | "bearish",
): StrategyComponents {
  const conf = (forecast.confluences ?? []).filter((c) => c && c.name)
  const haystack = (s: string) => s.toLowerCase()
  const text = conf.map((c) => haystack(c.name ?? "")).join(" | ")
  const commentary = haystack(forecast.commentary ?? "")
  const combined = `${text} || ${commentary}`

  const has = (re: RegExp) => re.test(combined)

  /* liquidityEvent */
  let liquidityEvent: string | null = null
  if (has(/\bpdh\b|previous daily high|prior daily high|yesterday'?s high/))
    liquidityEvent = "Previous daily high sweep"
  else if (has(/\bpdl\b|previous daily low|prior daily low|yesterday'?s low/))
    liquidityEvent = "Previous daily low sweep"
  else if (has(/\bpwh\b|previous weekly high|prior weekly high/))
    liquidityEvent = "Previous weekly high sweep"
  else if (has(/\bpwl\b|previous weekly low|prior weekly low/))
    liquidityEvent = "Previous weekly low sweep"
  else if (has(/asia(n)? (range )?high/)) liquidityEvent = "Asia range high sweep"
  else if (has(/asia(n)? (range )?low/)) liquidityEvent = "Asia range low sweep"
  else if (has(/equal highs|eqh/)) liquidityEvent = "Equal highs raid"
  else if (has(/equal lows|eql/)) liquidityEvent = "Equal lows raid"
  else if (has(/session high/)) liquidityEvent = "Session high sweep"
  else if (has(/session low/)) liquidityEvent = "Session low sweep"
  else if (has(/stop hunt/)) liquidityEvent = "Stop hunt"
  else if (has(/liquidity (sweep|grab|raid)|liq (sweep|grab|raid)/))
    liquidityEvent = "Liquidity sweep"

  /* timing */
  let timing: string | null = null
  if (has(/london (killzone|kz|open)/)) timing = "London killzone"
  else if (has(/london close/)) timing = "London close"
  else if (has(/london/)) timing = "London session"
  else if (has(/(ny|new york) (killzone|kz|open)/)) timing = "NY killzone"
  else if (has(/(ny|new york) (am|pm)/)) timing = "NY session"
  else if (has(/(ny|new york)/)) timing = "NY session"
  else if (has(/asia(n)? (session|range|open)/)) timing = "Asia session"
  else if (has(/asia(n)?/)) timing = "Asia session"
  else if (has(/killzone|kill zone/)) timing = "Killzone"

  /* structureEvent */
  let structureEvent: string | null = null
  if (has(/trendline|trend line/)) structureEvent = "Trendline retest"
  else if (has(/break and retest|break.*retest|retest of break/))
    structureEvent = "Break & retest"
  else if (has(/break of structure|\bbos\b/)) structureEvent = "Break of structure"
  else if (has(/change of character|\bchoch\b/)) structureEvent = "Change of character"
  else if (has(/structure shift|4h structure|daily structure|weekly structure/))
    structureEvent = "HTF structure shift"
  else if (has(/key level|daily level|weekly level/)) structureEvent = "Key level retest"
  else if (has(/higher high|lower low|higher low|lower high/))
    structureEvent = "Swing structure"

  /* patternEvent (direction-aware where relevant) */
  let patternEvent: string | null = null
  if (has(/order block|\bob\b/))
    patternEvent = dirWord === "bullish" ? "Bullish OB tap" : "Bearish OB tap"
  else if (has(/fair value gap|\bfvg\b/))
    patternEvent = dirWord === "bullish" ? "Bullish FVG fill" : "Bearish FVG fill"
  else if (has(/imbalance/)) patternEvent = "Imbalance fill"
  else if (has(/supply (zone|area)|supply$|^supply/)) patternEvent = "Supply zone reaction"
  else if (has(/demand (zone|area)|demand$|^demand/)) patternEvent = "Demand zone reaction"
  else if (has(/double top/)) patternEvent = "Double top"
  else if (has(/double bottom/)) patternEvent = "Double bottom"
  else if (has(/head and shoulders|h&s/)) patternEvent = "Head & shoulders"
  else if (has(/wedge/)) patternEvent = "Wedge breakout"
  else if (has(/triangle/)) patternEvent = "Triangle breakout"
  else if (has(/flag|pennant/)) patternEvent = "Flag continuation"
  else if (has(/rsi|macd|stoch|bollinger|ma cross/))
    patternEvent = "Indicator signal"

  /* macroEvent */
  let macroEvent: string | null = null
  if (has(/fomc|fed meeting/)) macroEvent = "FOMC reaction"
  else if (has(/\bcpi\b|inflation print/)) macroEvent = "CPI reaction"
  else if (has(/\bnfp\b|non[- ]?farm/)) macroEvent = "NFP reaction"
  else if (has(/\bdxy\b|dollar index/)) macroEvent = "DXY divergence"
  else if (has(/rate (hike|cut|decision)|fed funds/)) macroEvent = "Rates narrative"
  else if (has(/earnings/)) macroEvent = "Earnings reaction"

  /* sourceMode — who's driving the idea */
  const ownCount = conf.length
  const hasMentor = !!forecast.mentorReview
  let sourceMode: StrategyComponents["sourceMode"]
  if (hasMentor && ownCount <= 1) sourceMode = "mentor"
  else if (hasMentor) sourceMode = "blend"
  else if (ownCount === 0) sourceMode = "community"
  else sourceMode = "own"

  /* confluence chip items — display copy as the trader wrote it */
  const confluenceItems = conf.map((c) => ({
    label: c.name ?? "Unnamed",
    category: ((c.category as string) ?? "structure") as ReceiptCategory,
    strength: typeof c.strength === "number" ? c.strength : 60,
  }))

  return {
    liquidityEvent,
    timing,
    structureEvent,
    patternEvent,
    macroEvent,
    sourceMode,
    confluenceItems,
  }
}

/* ── composeStrategyName — builds a real trader-style setup name from
   detected components. Joined with " \u00b7 " so the chip reads naturally. */
function composeStrategyName(
  components: StrategyComponents,
  dirWord: "bullish" | "bearish",
  forecast: ForecastItem,
): string {
  const parts: string[] = []

  if (components.sourceMode === "mentor") {
    /* Mentor-only setup — name the model, then any HTF context if known */
    parts.push(`Mentor's ${dirWord} model`)
    if (components.timing) parts.push(components.timing)
    if (components.structureEvent) parts.push(components.structureEvent)
    return parts.join(" \u00b7 ")
  }

  if (components.macroEvent) parts.push(components.macroEvent)
  if (components.liquidityEvent) parts.push(components.liquidityEvent)
  if (components.timing) parts.push(components.timing)
  if (components.structureEvent) parts.push(components.structureEvent)
  if (components.patternEvent) parts.push(components.patternEvent)

  if (parts.length === 0) {
    /* Fallback — use the strongest confluence name if any, else generic */
    if (components.confluenceItems.length > 0) {
      const strongest = [...components.confluenceItems].sort(
        (a, b) => b.strength - a.strength,
      )[0]
      return strongest.label
    }
    return `Discretionary ${dirWord} read on ${forecast.instrument}`
  }

  /* Cap at 3 components — anything longer becomes noise */
  return parts.slice(0, 3).join(" \u00b7 ")
}

/* ── composeReason — one terse, direct trader-style sentence that names
   what actually happened on the chart. Uses real components, not
   abstract template copy. ─────────────────────────────────────────── */
function composeReason(
  forecast: ForecastItem,
  components: StrategyComponents,
  dirWord: "bullish" | "bearish",
): string {
  const inst = forecast.instrument
  const tp = forecast.takeProfit
  const liftSide = dirWord === "bullish" ? "long" : "short"

  if (components.sourceMode === "mentor") {
    const tail = components.timing
      ? ` on the ${components.timing.toLowerCase()}`
      : ""
    return `Mentor flagged a ${dirWord} setup on ${inst}${tail}. Trade copies the call with own risk parameters.`
  }

  const bits: string[] = []
  if (components.liquidityEvent)
    bits.push(components.liquidityEvent.toLowerCase().replace(" sweep", " was swept").replace(" raid", " was raided"))
  if (components.timing) bits.push(`during ${components.timing}`)
  if (components.patternEvent) bits.push(`with ${components.patternEvent.toLowerCase()}`)
  if (!components.patternEvent && components.structureEvent)
    bits.push(`with ${components.structureEvent.toLowerCase()}`)

  if (bits.length === 0) {
    if (components.confluenceItems.length > 0) {
      const top = components.confluenceItems
        .slice(0, 2)
        .map((c) => c.label.toLowerCase())
        .join(" and ")
      return `Taking the ${liftSide} on ${inst} — confluences are ${top}, aiming for ${tp}.`
    }
    return `Discretionary ${liftSide} on ${inst} — aiming for ${tp}.`
  }

  return `Taking the ${liftSide} on ${inst} — ${bits.join(", ")}, aiming for ${tp}.`
}

/* ── originTag — short pill describing who originated this idea ────── */
function originTag(components: StrategyComponents): {
  label: string
  hex: string
  rgb: string
} {
  switch (components.sourceMode) {
    case "mentor":
      return { label: "Mentor model", hex: VT.amber, rgb: VT.amberRgb }
    case "blend":
      return { label: "Mentor-backed own setup", hex: VT.amber, rgb: VT.amberRgb }
    case "community":
      return { label: "Community signal", hex: VT.cyan, rgb: VT.cyanRgb }
    case "own":
    default:
      return { label: "Own setup", hex: VT.blue, rgb: VT.blueRgb }
  }
}

/* ── selectTemplate — scores 12 templates against the forecast text and
   returns the strongest one (plus a runner-up if it's close). ─────── */
function selectTemplate(forecast: ForecastItem): {
  primary: TemplateId
  primaryLabel: string
  secondary?: TemplateId
  secondaryLabel?: string
  confidence: number
} {
  const text = [
    forecast.commentary ?? "",
    ...(forecast.confluences ?? []).map((c) => c?.name ?? ""),
    ...(forecast.confluences ?? []).map((c) => (c?.category as string) ?? ""),
  ]
    .join(" ")
    .toLowerCase()

  const scores: Record<TemplateId, number> = {
    breakRetest: 0,
    liquiditySweep: 0,
    trendContinuation: 0,
    reversal: 0,
    momentumBreakout: 0,
    session: 0,
    macroNews: 0,
    mentorCommunity: 0,
    range: 0,
    supplyDemand: 0,
    indicator: 0,
    discretionary: 5,
  }

  const hit = (id: TemplateId, kws: string[], weight: number) => {
    if (kws.some((k) => text.includes(k))) scores[id] += weight
  }

  hit("breakRetest", ["break", "retest", "flip", "reclaim"], 30)
  hit("liquiditySweep", ["sweep", "stop hunt", "liquidity grab", "raid", "wick"], 30)
  hit("trendContinuation", ["trend", "continuation", "pullback", "higher high", "lower low"], 25)
  hit("reversal", ["reversal", "exhaustion", "rejection", "divergence"], 25)
  hit("momentumBreakout", ["breakout", "momentum", "expansion", "impulse", "displacement"], 25)
  hit("session", ["london", "new york", "ny session", "asia", "killzone", "session"], 15)
  hit("macroNews", ["cpi", "fomc", "nfp", "rates", "macro", "news", "dxy", "fed"], 20)
  hit("range", ["range", "mean reversion", "fade", "rotation", "vwap"], 25)
  hit("supplyDemand", ["supply", "demand", "order block", " ob ", "fvg", "imbalance"], 25)
  hit("indicator", ["rsi", "macd", "stoch", "ma cross", "bollinger"], 25)

  const ownConfluences = (forecast.confluences ?? []).length
  if (forecast.mentorReview && ownConfluences <= 1) scores.mentorCommunity += 18

  const ids = Object.keys(scores) as TemplateId[]
  ids.sort((a, b) => scores[b] - scores[a])
  const top = ids[0]
  const second = ids[1]
  const totalNonBase = ids.reduce((acc, id) => acc + scores[id], 0) - scores.discretionary
  const confidence =
    totalNonBase > 0
      ? Math.min(100, Math.round((scores[top] / Math.max(totalNonBase + scores.discretionary, 1)) * 100))
      : 30

  const out: {
    primary: TemplateId
    primaryLabel: string
    secondary?: TemplateId
    secondaryLabel?: string
    confidence: number
  } = {
    primary: top,
    primaryLabel: TEMPLATE_LABELS[top],
    confidence,
  }

  if (second && second !== top && scores[second] > 0 && scores[second] >= scores[top] * 0.6) {
    out.secondary = second
    out.secondaryLabel = TEMPLATE_LABELS[second]
  }

  return out
}

/* ── Template translator — plain-English fields per template ───────── */
function translateTemplate(
  template: TemplateId,
  forecast: ForecastItem,
  dirWord: string,
): {
  plain: string
  whyEnter: string
  whatConfirms: string
  whatBreaks: string
  watchNext: string
} {
  const inst = forecast.instrument
  const entry = forecast.entry
  const tp = forecast.takeProfit
  const sl = forecast.stopLoss
  const tf = forecast.timeframe
  const supRes = dirWord === "bullish" ? "support" : "resistance"
  const oppSupRes = dirWord === "bullish" ? "resistance" : "support"
  const aboveBelow = dirWord === "bullish" ? "above" : "below"
  const inv = forecast.invalidation
  const liftSide = dirWord === "bullish" ? "buy" : "sell"
  const trapSide = dirWord === "bullish" ? "sellers" : "buyers"
  const sweepSide = dirWord === "bullish" ? "below a visible low" : "above a visible high"

  switch (template) {
    case "breakRetest":
      return {
        plain: `Price broke an important level at ${entry} and is now coming back to test it. The trader expects that level to hold as ${supRes} before continuing toward ${tp}.`,
        whyEnter: `Entry at ${entry} only after the broken level retests and holds.`,
        whatConfirms: `A ${tf} ${dirWord} close ${aboveBelow} ${entry} after the retest, with no immediate rejection.`,
        whatBreaks: inv ?? `Price falls back beyond ${sl} — the breakout was fake.`,
        watchNext: `Look for a clean ${dirWord} close ${aboveBelow} ${entry} on the ${tf} chart, or a clear rejection from the retest area.`,
      }
    case "liquiditySweep":
      return {
        plain: `Price grabbed liquidity ${sweepSide}. The trader expects this to be a trap — the move should reverse after sweeping out late ${trapSide}.`,
        whyEnter: `Entry at ${entry} after the sweep prints and price displaces away.`,
        whatConfirms: `Sharp rejection candle and follow-through away from the swept extreme.`,
        whatBreaks: inv ?? `Price keeps going past ${sl} — the sweep wasn't a trap, it was real continuation.`,
        watchNext: `Watch for a strong rejection wick followed by an impulsive move away from ${entry}.`,
      }
    case "trendContinuation":
      return {
        plain: `Market is already moving ${dirWord}. The trader is waiting for a pullback into ${entry} and expects the existing trend to continue toward ${tp}.`,
        whyEnter: `Entry at ${entry} on the pullback within an established ${dirWord} trend.`,
        whatConfirms: `Price holds the pullback area and prints a ${dirWord} continuation candle.`,
        whatBreaks: inv ?? `Trend structure breaks — price closes beyond ${sl}, reversing the previous swing.`,
        watchNext: `Watch the ${entry} pullback hold and produce a ${dirWord} ${tf} candle.`,
      }
    case "reversal":
      return {
        plain: `Price reached an area where the trader expects the current move to fail and turn around. The idea is to ${liftSide} the reversal back into the prior range.`,
        whyEnter: `Entry at ${entry} on rejection signs at the extreme.`,
        whatConfirms: `A clear rejection candle and break of micro-structure in the new ${dirWord} direction.`,
        whatBreaks: inv ?? `Price closes beyond ${sl} — the area didn't hold, trend continues.`,
        watchNext: `Watch for a strong rejection wick at ${entry} followed by a clean break in the opposite direction.`,
      }
    case "momentumBreakout":
      return {
        plain: `Price is pushing hard with momentum. The trader expects continuation, not a pullback — the trade rides the impulse toward ${tp}.`,
        whyEnter: `Entry at ${entry} into the impulse, before momentum cools.`,
        whatConfirms: `${tf} candles keep closing ${aboveBelow} ${entry} with body expansion, not just wicks.`,
        whatBreaks: inv ?? `Momentum stalls and price closes back inside the range beyond ${sl}.`,
        watchNext: `Watch for fast continuation away from ${entry}; if it stalls within minutes, the edge weakens.`,
      }
    case "session":
      return {
        plain: `The forecast hangs on session timing. The trader expects ${inst} to move during this specific time window — outside it, the idea loses strength.`,
        whyEnter: `Entry at ${entry} during the active session window.`,
        whatConfirms: `Session opens with directional intent and breaks the session range ${dirWord === "bullish" ? "high" : "low"}.`,
        whatBreaks: inv ?? `Session range stays intact — no breakout, no setup.`,
        watchNext: `Watch how price reacts to the session open and whether it pushes ${aboveBelow} ${entry} early in the window.`,
      }
    case "macroNews":
      return {
        plain: `The trade idea is tied to a larger economic driver, not just the chart. The trader expects news flow to push ${inst} ${dirWord} toward ${tp}.`,
        whyEnter: `Entry at ${entry} aligned with the macro bias.`,
        whatConfirms: `The macro narrative plays out — data prints in favour of the direction.`,
        whatBreaks: inv ?? `Macro data flips or price closes beyond ${sl} on a counter-news reaction.`,
        watchNext: `Watch the next data release and how price reacts in the first 15 minutes after it.`,
      }
    case "mentorCommunity":
      return {
        plain: `This forecast is leaning on community or mentor confirmation. The chart still needs its own logic — copy at your own risk.`,
        whyEnter: `Entry at ${entry}, mostly aligned with community/mentor direction.`,
        whatConfirms: `Independent chart evidence agrees with the social proof.`,
        whatBreaks: inv ?? `Price beyond ${sl} — the social proof wasn't enough.`,
        watchNext: `Watch whether the chart confirms what the community is saying, not just the count of agreers.`,
      }
    case "range":
      return {
        plain: `Price is sitting inside a range. The trader expects ${inst} to revert from ${entry} back toward the other side of the range, aiming at ${tp}.`,
        whyEnter: `Entry at ${entry} — the range extreme that has been respected.`,
        whatConfirms: `Rejection from the range boundary and rotation back inside.`,
        whatBreaks: inv ?? `Price closes ${oppSupRes === "support" ? "below" : "above"} the range with body — range break, not range play.`,
        watchNext: `Watch how price behaves at ${entry} — wick rejection is good, body break is bad.`,
      }
    case "supplyDemand":
      return {
        plain: `Price is approaching an area where institutional orders are likely waiting. The trader expects a reaction from ${entry} back toward ${tp}.`,
        whyEnter: `Entry at ${entry} — an unmitigated ${dirWord === "bullish" ? "demand" : "supply"} zone.`,
        whatConfirms: `Sharp reaction off the zone with a clean displacement candle.`,
        whatBreaks: inv ?? `Price closes through the zone beyond ${sl} — it was already mitigated.`,
        watchNext: `Watch for a strong reaction the first time price taps ${entry}.`,
      }
    case "indicator":
      return {
        plain: `The setup is built around an indicator signal. The trader is using it to time entry at ${entry} for a move toward ${tp}.`,
        whyEnter: `Entry at ${entry} on the indicator signal alone.`,
        whatConfirms: `Price action agrees with the indicator — direction lines up on the entry timeframe.`,
        whatBreaks: inv ?? `Indicator flips or price closes beyond ${sl} against the signal.`,
        watchNext: `Watch whether price respects the indicator level or ignores it entirely.`,
      }
    case "discretionary":
    default:
      return {
        plain: `Discretionary ${dirWord} read on ${inst}. The trader sees a setup at ${entry} and is aiming for ${tp}.`,
        whyEnter: `Entry at ${entry} based on the trader's own read.`,
        whatConfirms: `Price action confirms the read on the entry timeframe.`,
        whatBreaks: inv ?? `Price closes beyond ${sl}.`,
        watchNext: `Watch how price reacts at ${entry}.`,
      }
  }
}

/* ── Category translator — "means…" line shown when a receipt expands ─ */
const CATEGORY_MEANS: Record<ReceiptCategory, string> = {
  structure: "Higher-timeframe direction agrees with this trade",
  liquidity: "There are unfilled orders price tends to magnet toward",
  momentum: "Price has real push behind it, not slow drift",
  session: "The time window historically produces this kind of move",
  pattern: "A recognised chart shape is forming, raising the odds",
  macro: "A larger economic driver supports the direction",
  risk: "A safety check on the trade, not a reason to enter",
}

/* ── Proof groups — receipts bucketed by plain-English meaning ─────── */
const PROOF_GROUPS: {
  key: string
  label: string
  match: (r: CanvasReceipt) => boolean
  hex: string
  rgb: string
}[] = [
  {
    key: "chart",
    label: "Chart proof",
    match: (r) => r.category === "structure" || r.category === "pattern",
    hex: VT.cyan,
    rgb: VT.cyanRgb,
  },
  {
    key: "timing",
    label: "Timing proof",
    match: (r) => r.category === "session",
    hex: VT.amber,
    rgb: "245,158,11",
  },
  {
    key: "engine",
    label: "Engine proof",
    match: (r) =>
      (r.category === "liquidity" || r.category === "momentum") && r.source === "ENGINE",
    hex: VT.purple,
    rgb: VT.purpleRgb,
  },
  {
    key: "macro",
    label: "Macro proof",
    match: (r) => r.category === "macro",
    hex: VT.blue,
    rgb: VT.blueRgb,
  },
  {
    key: "community",
    label: "Community proof",
    match: (r) => r.source === "COMMUNITY",
    hex: VT.cyan,
    rgb: VT.cyanRgb,
  },
  {
    key: "mentor",
    label: "Mentor proof",
    match: (r) => r.source === "MENTOR",
    hex: VT.amber,
    rgb: VT.amberRgb,
  },
]

/* ── buildExplainer — the pure data builder ──────────────────────────── */
function buildExplainer(
  forecast: ForecastItem,
  dirColor: { rgb: string; hex: string },
): ExplainerData {
  const seed = seedFrom(forecast.id)
  const dirWord = forecast.direction === "LONG" ? "bullish" : "bearish"
  const tmpl = selectTemplate(forecast)
  const story = translateTemplate(tmpl.primary, forecast, dirWord)
  const conf = (forecast.confluences ?? []).filter((c) => c && c.name)

  /* NEW: direct trader-style layer */
  const components = detectComponents(forecast, dirWord)
  const strategyName = composeStrategyName(components, dirWord, forecast)
  const reasonLine = composeReason(forecast, components, dirWord)
  const origin = originTag(components)

  const tfMap: Record<string, string> = {
    "1m": "1-min",
    "5m": "5-min",
    "15m": "15-min",
    "30m": "30-min",
    "1H": "1-hour",
    "4H": "4-hour",
    "1D": "daily",
  }
  const tfFull = tfMap[forecast.timeframe] ?? forecast.timeframe

  const ctxConf = conf.find((x) =>
    ["structure", "macro"].includes((x.category as string) ?? ""),
  )
  const liqConf = conf.find((x) => ((x.category as string) ?? "") === "liquidity")
  const momConf = conf.find((x) => ((x.category as string) ?? "") === "momentum")
  const ssnConf = conf.find((x) => ((x.category as string) ?? "") === "session")

  const pContext: CanvasPillarNode = {
    key: "context",
    label: "Market situation",
    oneLine: ctxConf
      ? `${ctxConf.name} aligned on ${tfFull} ${dirWord} bias`
      : `${tfFull} ${dirWord} read on ${forecast.instrument}`,
    deeper: story.plain,
    status: ctxConf ? "confirmed" : conf.length > 0 ? "soft" : "missing",
  }
  const pTrigger: CanvasPillarNode = {
    key: "trigger",
    label: "Entry reason",
    oneLine: `${tfFull} ${dirWord} close beyond ${forecast.entry}`,
    deeper: story.whyEnter,
    status: conf[0] ? "confirmed" : "soft",
  }
  const confirmCount = (liqConf ? 1 : 0) + (momConf ? 1 : 0)
  const pConfirmation: CanvasPillarNode = {
    key: "confirmation",
    label: "Proof needed",
    oneLine:
      confirmCount >= 2
        ? "Liquidity and momentum both agree"
        : confirmCount === 1
          ? liqConf
            ? "Liquidity profile supports the bias"
            : "Momentum agrees with the direction"
          : "Confirmation is light — structure only",
    deeper: story.whatConfirms,
    status: confirmCount >= 2 ? "confirmed" : "soft",
  }
  const pExecution: CanvasPillarNode = {
    key: "execution",
    label: "How to enter",
    oneLine: `Limit at ${forecast.entry} ${forecast.riskReward ? "\u00b7 " + forecast.riskReward : ""}`,
    deeper: `Entry parked at ${forecast.entry}, stop at ${forecast.stopLoss}, target ${forecast.takeProfit}.`,
    status: "confirmed",
  }
  const pTarget: CanvasPillarNode = {
    key: "target",
    label: "Where it aims",
    oneLine: `${forecast.takeProfit}${forecast.riskReward ? " \u00b7 " + forecast.riskReward : ""}`,
    deeper: `Aiming for ${forecast.takeProfit} with reward profile ${forecast.riskReward ?? "undefined"}.`,
    status: "confirmed",
  }
  const pInvalidation: CanvasPillarNode = {
    key: "invalidation",
    label: "What breaks it",
    oneLine: forecast.invalidation
      ? `${forecast.invalidation}`
      : "No explicit invalidation stated",
    deeper: story.whatBreaks,
    status: forecast.invalidation ? "confirmed" : "missing",
  }
  const pillars = [pContext, pTrigger, pConfirmation, pExecution, pTarget, pInvalidation]

  /* Receipts */
  const receipts: CanvasReceipt[] = []

  conf.forEach((cf, i) => {
    const cat = ((cf.category as string) ?? "structure") as ReceiptCategory
    const pillar: CanvasPillar =
      cat === "session"
        ? "trigger"
        : cat === "liquidity" || cat === "momentum"
          ? "confirmation"
          : cat === "macro"
            ? "context"
            : cat === "pattern"
              ? "trigger"
              : "context"
    const strength = typeof cf.strength === "number" ? cf.strength : 65
    receipts.push({
      id: typeof cf.id === "string" && cf.id ? cf.id : `author-${i}`,
      pillar,
      title: cf.name ?? "Unnamed confluence",
      source: "AUTHOR",
      category: cat,
      strength,
      status: strength >= 70 ? "confirmed" : "soft",
      means: CATEGORY_MEANS[cat] ?? CATEGORY_MEANS.structure,
    })
  })

  const engineCatalog: { title: string; pillar: CanvasPillar; category: ReceiptCategory }[] = [
    { title: "4H structure aligned", pillar: "context", category: "structure" },
    { title: "Volume profile confluence", pillar: "confirmation", category: "liquidity" },
    { title: "Momentum divergence", pillar: "confirmation", category: "momentum" },
  ]
  const engineCount = 1 + (seed % 2)
  for (let i = 0; i < engineCount; i++) {
    const idx = (seed >> (i * 3)) % engineCatalog.length
    const e = engineCatalog[idx] ?? engineCatalog[0]
    if (!e) continue
    receipts.push({
      id: `engine-${i}`,
      pillar: e.pillar,
      title: e.title,
      source: "ENGINE",
      category: e.category,
      strength: 70 + ((seed >> (i * 4)) % 28),
      status: "confirmed",
      means: CATEGORY_MEANS[e.category],
    })
  }

  const communityCount = 18 + (seed % 64)
  receipts.push({
    id: "community-1",
    pillar: "confirmation",
    title: `${communityCount} traders agree with this direction`,
    source: "COMMUNITY",
    category: "macro",
    strength: 55 + (seed % 35),
    status: communityCount >= 35 ? "confirmed" : "soft",
    means: "Other traders agree, but agreement isn't a setup on its own",
  })

  if (forecast.mentorReview && typeof forecast.mentorReview === "object") {
    const rating =
      typeof forecast.mentorReview.rating === "number" ? forecast.mentorReview.rating : 0
    receipts.push({
      id: "mentor-1",
      pillar: "context",
      title: `Mentor endorsement \u00b7 ${rating.toFixed(1)}/10`,
      source: "MENTOR",
      category: "pattern",
      strength: Math.min(100, Math.max(0, Math.round(rating * 10))),
      status: rating >= 7 ? "confirmed" : "soft",
      means: "A senior trader signed off on the read — adds credibility",
    })
  }

  if (ssnConf) {
    receipts.push({
      id: "session-1",
      pillar: "trigger",
      title: `${ssnConf.name} timing`,
      source: "PRICE",
      category: "session",
      strength: typeof ssnConf.strength === "number" ? ssnConf.strength : 70,
      status: "confirmed",
      means: CATEGORY_MEANS.session,
    })
  }

  /* Conviction */
  const conviction = forecast.confidence ?? 50
  const convictionTier: 0 | 1 | 2 = conviction >= 80 ? 2 : conviction >= 60 ? 1 : 0

  const convictionReasons: string[] = []
  const convictionRaisers: string[] = []
  const weaknessItems: string[] = []
  const missingInfo: string[] = []

  if (ctxConf) convictionReasons.push("Higher-timeframe structure agrees")
  else {
    weaknessItems.push("No clear higher-timeframe structure cited")
    convictionRaisers.push("Add a 4H or daily structure note")
  }

  if (confirmCount >= 2) {
    convictionReasons.push("Engine confirms direction (liquidity + momentum)")
  } else if (confirmCount === 1) {
    convictionReasons.push("Some engine confirmation present")
    convictionRaisers.push(
      liqConf
        ? "Add a momentum confirmation (impulse / divergence)"
        : "Add a liquidity/volume confirmation",
    )
  } else {
    weaknessItems.push("Engine confirmation is light")
    convictionRaisers.push("Confirm with liquidity or momentum signal")
  }

  if (forecast.mentorReview) convictionReasons.push("Mentor endorsed the read")

  if (!forecast.invalidation) {
    weaknessItems.push("Invalidation is not clearly stated")
    convictionRaisers.push("State a precise invalidation level")
    missingInfo.push("Explicit invalidation")
  } else {
    convictionReasons.push("Invalidation is clearly defined")
  }

  if (conf.length === 0) {
    weaknessItems.push("No own confluences listed")
    missingInfo.push("Author confluences")
  }

  if (!ssnConf && tmpl.primary === "session") {
    weaknessItems.push("Session-based template chosen but no session noted")
    missingInfo.push("Session window")
  }

  if (communityCount < 20) convictionRaisers.push("Wait for more community confirmation")
  else if (communityCount >= 35)
    convictionReasons.push(`Strong community echo (${communityCount} traders)`)

  const confirmedReceipts = receipts.filter((r) => r.status === "confirmed").length
  const setupQuality = Math.min(100, Math.round(40 + confirmedReceipts * 8 + conviction * 0.25))

  /* Answer-block copy — rewritten to NAME the actual confluences and
     components instead of using template-generic sentences. */
  const topConf = components.confluenceItems.slice(0, 2).map((c) => c.label)
  const liftVerb = dirWord === "bullish" ? "long" : "short"

  const whyEnter = (() => {
    if (components.sourceMode === "mentor") {
      return `Following the mentor's ${dirWord} call on ${forecast.instrument}.`
    }
    if (topConf.length >= 2) {
      return `${topConf[0]} and ${topConf[1]} both line up for the ${liftVerb}.`
    }
    if (topConf.length === 1) {
      return `${topConf[0]} sets up the ${liftVerb} at ${forecast.entry}.`
    }
    if (components.patternEvent || components.structureEvent) {
      return `${components.patternEvent ?? components.structureEvent} drives the ${liftVerb} at ${forecast.entry}.`
    }
    return `Discretionary ${liftVerb} read on ${forecast.instrument} at ${forecast.entry}.`
  })()

  const whatConfirms = (() => {
    if (components.liquidityEvent && components.timing) {
      return `${components.liquidityEvent} prints during ${components.timing}, followed by a clean rejection.`
    }
    if (components.patternEvent) {
      return `${components.patternEvent} holds and price displaces away from ${forecast.entry}.`
    }
    if (components.structureEvent) {
      return `${components.structureEvent} confirms with a ${dirWord} ${forecast.timeframe} close.`
    }
    if (components.sourceMode === "mentor") {
      return `Independent chart evidence (structure or pattern) agrees with the mentor's call.`
    }
    return `${forecast.timeframe} ${dirWord} close beyond ${forecast.entry} without immediate rejection.`
  })()

  const whatBreaks =
    forecast.invalidation ??
    (components.liquidityEvent
      ? `Price keeps going past ${forecast.stopLoss} — the ${components.liquidityEvent.toLowerCase()} wasn't a trap.`
      : `Price closes beyond ${forecast.stopLoss} against the ${dirWord} bias.`)

  const watchNext = (() => {
    if (components.liquidityEvent && components.timing) {
      return `Watch for the ${components.liquidityEvent.toLowerCase()} during ${components.timing} and a strong rejection candle that follows.`
    }
    if (components.patternEvent) {
      return `Watch how price reacts at ${forecast.entry} — clean ${components.patternEvent.toLowerCase()} is the trigger.`
    }
    if (components.sourceMode === "mentor") {
      return `Wait for the mentor's confirmation criteria before pulling the trigger at ${forecast.entry}.`
    }
    return story.watchNext
  })()

  return {
    primaryTemplate: tmpl.primary,
    primaryLabel: tmpl.primaryLabel,
    secondaryTemplate: tmpl.secondary,
    secondaryLabel: tmpl.secondaryLabel,
    templateConfidence: tmpl.confidence,
    strategyName,
    origin,
    reasonLine,
    confluenceItems: components.confluenceItems,
    whyEnter,
    whatConfirms,
    whatBreaks,
    watchNext,
    conviction,
    convictionTier,
    convictionReasons,
    convictionRaisers,
    weaknessItems: weaknessItems.length > 0 ? weaknessItems : ["No notable weaknesses detected"],
    missingInfo,
    pillars,
    receipts,
    setupQuality,
  }
}

/* ──────────────────────────────────────────────────────────────────────
   ForecastExplainer — the human-first card.
   ────────────────────────────────────────────────────────────────────── */
function ForecastExplainer({
  forecast,
  dirColor,
  delay,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  delay: number
}) {
  const data = useMemo(() => buildExplainer(forecast, dirColor), [forecast, dirColor])

  const [showProof, setShowProof] = useState(false)
  const [showWeakness, setShowWeakness] = useState(false)
  const [showTechnical, setShowTechnical] = useState(false)

  return (
    <GlassCard accentRgb={dirColor.rgb} delay={delay}>
      <div className="flex flex-col gap-5">
        <ExplainerHead forecast={forecast} dirColor={dirColor} data={data} delay={delay} />

        {/* Direct reason — one terse line, named-confluence aware */}
        <ReasonStrip text={data.reasonLine} dirColor={dirColor} />

        {/* Confluences the trader actually used — their checklist as chips */}
        {data.confluenceItems.length > 0 && (
          <ConfluenceChips items={data.confluenceItems} dirColor={dirColor} />
        )}

        <Hairline dashed />

        <AnswerBlocks data={data} dirColor={dirColor} />

        <WatchNext text={data.watchNext} dirColor={dirColor} />

        <div className="flex flex-col" style={{ gap: 2, marginTop: 4 }}>
          <ExpandRow
            label={`Show proof (${data.receipts.length})`}
            openLabel="Hide proof"
            open={showProof}
            onToggle={() => setShowProof((p) => !p)}
            dirColor={dirColor}
          >
            <ProofDrawer data={data} delay={delay} />
          </ExpandRow>
          <ExpandRow
            label={`Show weakness (${data.weaknessItems.length})`}
            openLabel="Hide weakness"
            open={showWeakness}
            onToggle={() => setShowWeakness((p) => !p)}
            dirColor={dirColor}
          >
            <WeaknessDrawer data={data} dirColor={dirColor} />
          </ExpandRow>
          <ExpandRow
            label="Show technical logic"
            openLabel="Hide technical logic"
            open={showTechnical}
            onToggle={() => setShowTechnical((p) => !p)}
            dirColor={dirColor}
          >
            <TechnicalLogic data={data} dirColor={dirColor} />
          </ExpandRow>
        </div>
      </div>
    </GlassCard>
  )
}

/* ── ExplainerHead — direct trader-style head:
   Eyebrow + direction pill + origin tag · the strategy NAME composed
   from real components (e.g. "Previous daily high sweep · London KZ
   reversal", "Mentor's bearish model · NY killzone") + the conviction
   strip. No abstract templates, no generic copy. ───────────────────── */
function ExplainerHead({
  forecast,
  dirColor,
  data,
  delay,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  data: ExplainerData
  delay: number
}) {
  const convColor = [VT.rose, VT.amber, VT.emerald][data.convictionTier]
  const convRgb = [VT.roseRgb, "245,158,11", VT.emeraldRgb][data.convictionTier]
  const convLabel = ["Low", "Moderate", "High"][data.convictionTier]

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1 — eyebrow + direction pill */}
      <div className="flex items-center justify-between gap-2">
        <Eyebrow>The setup</Eyebrow>
        <div
          className="inline-flex items-center gap-1.5 px-2 py-1"
          style={{
            borderRadius: 999,
            background: rgba(dirColor.rgb, 0.1),
            border: `1px solid ${rgba(dirColor.rgb, 0.28)}`,
          }}
        >
          {forecast.direction === "LONG" ? (
            <ArrowUpRight size={10} strokeWidth={2.2} style={{ color: dirColor.hex }} />
          ) : (
            <ArrowDownRight size={10} strokeWidth={2.2} style={{ color: dirColor.hex }} />
          )}
          <Eyebrow size={9} color={dirColor.hex}>
            {forecast.direction} · {forecast.instrument}
          </Eyebrow>
        </div>
      </div>

      {/* Row 2 — origin tag + composed strategy name (the centerpiece) */}
      <div className="flex items-start gap-2.5">
        <span
          className="inline-flex items-center gap-1.5 flex-shrink-0"
          style={{
            padding: "4px 9px",
            borderRadius: 999,
            background: rgba(data.origin.rgb, 0.1),
            border: `1px solid ${rgba(data.origin.rgb, 0.3)}`,
            alignSelf: "flex-start",
            marginTop: 2,
          }}
        >
          <span
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              background: data.origin.hex,
              boxShadow: `0 0 6px ${rgba(data.origin.rgb, 0.6)}`,
            }}
          />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: data.origin.hex,
              fontWeight: 500,
            }}
          >
            {data.origin.label}
          </span>
        </span>
        <h3
          className="font-sans m-0 text-pretty"
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: VT.paper,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            flex: 1,
          }}
        >
          {data.strategyName}
        </h3>
      </div>

      {/* Row 3 — conviction strip */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Eyebrow size={9}>Conviction</Eyebrow>
          <span
            className="font-sans"
            style={{
              fontSize: 11,
              color: convColor,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {convLabel} · {data.conviction}%
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => {
            const filled = i <= data.convictionTier
            return (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: VT.easeOut,
                  delay: delay + 0.2 + i * 0.08,
                }}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: filled
                    ? `linear-gradient(90deg, ${rgba(convRgb, 0.55)}, ${convColor})`
                    : "rgba(255,255,255,0.04)",
                  boxShadow: filled ? `0 0 8px ${rgba(convRgb, 0.35)}` : "none",
                  transformOrigin: "left",
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── ReasonStrip — one direct trader-style sentence. Replaces the long
   paragraph. Reads like a journal line, not a generated essay. ────── */
function ReasonStrip({
  text,
  dirColor,
}: {
  text: string
  dirColor: { rgb: string; hex: string }
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        aria-hidden
        className="flex-shrink-0"
        style={{
          width: 3,
          alignSelf: "stretch",
          background: dirColor.hex,
          borderRadius: 2,
          opacity: 0.7,
          boxShadow: `0 0 6px ${rgba(dirColor.rgb, 0.4)}`,
        }}
      />
      <p
        className="font-sans m-0 text-balance"
        style={{
          fontSize: 13.5,
          color: VT.paper,
          lineHeight: 1.5,
          letterSpacing: "0.005em",
          flex: 1,
        }}
      >
        {text}
      </p>
    </div>
  )
}

/* ── ConfluenceChips — the trader's actual checklist, no translation.
   Each chip shows the confluence label as the trader wrote it, with a
   thin strength bar underneath and a category-tinted dot. ─────────── */
function ConfluenceChips({
  items,
  dirColor,
}: {
  items: { label: string; category: ReceiptCategory; strength: number }[]
  dirColor: { rgb: string; hex: string }
}) {
  const catColor = (cat: ReceiptCategory): { hex: string; rgb: string } => {
    switch (cat) {
      case "structure":
        return { hex: dirColor.hex, rgb: dirColor.rgb }
      case "liquidity":
        return { hex: VT.purple, rgb: VT.purpleRgb }
      case "momentum":
        return { hex: VT.cyan, rgb: VT.cyanRgb }
      case "session":
        return { hex: VT.amber, rgb: "245,158,11" }
      case "pattern":
        return { hex: VT.emerald, rgb: VT.emeraldRgb }
      case "macro":
        return { hex: VT.blue, rgb: VT.blueRgb }
      case "risk":
        return { hex: VT.rose, rgb: VT.roseRgb }
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow size={9} color={VT.ashSoft}>
        Confluences used
      </Eyebrow>
      <div className="flex flex-wrap gap-1.5">
        {items.map((c, i) => {
          const tone = catColor(c.category)
          return (
            <div
              key={`${c.label}-${i}`}
              className="inline-flex items-center gap-2"
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                background: rgba(tone.rgb, 0.06),
                border: `1px solid ${rgba(tone.rgb, 0.22)}`,
                minWidth: 0,
              }}
            >
              <span
                aria-hidden
                className="rounded-full flex-shrink-0"
                style={{
                  width: 5,
                  height: 5,
                  background: tone.hex,
                  boxShadow: `0 0 5px ${rgba(tone.rgb, 0.55)}`,
                }}
              />
              <span
                className="font-sans"
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: VT.paper,
                  letterSpacing: "-0.005em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 220,
                }}
                title={c.label}
              >
                {c.label}
              </span>
              <span
                className="font-mono flex-shrink-0"
                style={{
                  fontSize: 9.5,
                  color: tone.hex,
                  letterSpacing: "0.05em",
                  opacity: 0.85,
                }}
              >
                {c.strength}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── AnswerBlocks — Why enter / What confirms / What breaks ────────── */
function AnswerBlocks({
  data,
  dirColor,
}: {
  data: ExplainerData
  dirColor: { rgb: string; hex: string }
}) {
  const blocks: { eyebrow: string; hex: string; rgb: string; text: string }[] = [
    { eyebrow: "Why enter?", hex: dirColor.hex, rgb: dirColor.rgb, text: data.whyEnter },
    { eyebrow: "What confirms it?", hex: VT.emerald, rgb: VT.emeraldRgb, text: data.whatConfirms },
    { eyebrow: "What breaks it?", hex: VT.rose, rgb: VT.roseRgb, text: data.whatBreaks },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      {blocks.map((b, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-3.5"
          style={{
            borderRadius: 12,
            background: rgba(b.rgb, 0.04),
            border: `1px solid ${rgba(b.rgb, 0.18)}`,
            minWidth: 0,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="rounded-full flex-shrink-0"
              style={{
                width: 4,
                height: 4,
                background: b.hex,
                boxShadow: `0 0 5px ${rgba(b.rgb, 0.55)}`,
              }}
            />
            <Eyebrow size={9} color={b.hex}>
              {b.eyebrow}
            </Eyebrow>
          </div>
          <p
            className="font-sans m-0"
            style={{
              fontSize: 12,
              color: VT.paper,
              lineHeight: 1.5,
              letterSpacing: "0.005em",
              wordBreak: "break-word",
            }}
          >
            {b.text}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ── WatchNext — single short directive line ──────────────────────── */
function WatchNext({
  text,
  dirColor,
}: {
  text: string
  dirColor: { rgb: string; hex: string }
}) {
  return (
    <div
      className="flex items-start gap-2.5 p-3"
      style={{
        borderRadius: 10,
        background: "rgba(255,255,255,0.02)",
        border: `1px dashed ${rgba(dirColor.rgb, 0.28)}`,
      }}
    >
      <span
        className="rounded-full flex-shrink-0 mt-1"
        style={{
          width: 5,
          height: 5,
          background: dirColor.hex,
          boxShadow: `0 0 6px ${rgba(dirColor.rgb, 0.6)}`,
        }}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <Eyebrow size={9} color={dirColor.hex}>
          Watch next
        </Eyebrow>
        <p
          className="font-sans m-0"
          style={{
            fontSize: 12,
            color: VT.paper,
            lineHeight: 1.5,
            letterSpacing: "0.005em",
            wordBreak: "break-word",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  )
}

/* ── ExpandRow — uniform shell for proof/weakness/technical rows ───── */
function ExpandRow({
  label,
  openLabel,
  open,
  onToggle,
  dirColor,
  children,
}: {
  label: string
  openLabel: string
  open: boolean
  onToggle: () => void
  dirColor: { rgb: string; hex: string }
  children: ReactNode
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full cursor-pointer"
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: open ? rgba(dirColor.rgb, 0.06) : "rgba(255,255,255,0.02)",
          border: `1px solid ${open ? rgba(dirColor.rgb, 0.22) : VT.ruleSoft}`,
          transition: "all 0.18s ease",
        }}
      >
        <Eyebrow size={9} color={dirColor.hex}>
          {open ? openLabel : label}
        </Eyebrow>
        <ChevronDown
          size={12}
          strokeWidth={1.7}
          style={{
            color: dirColor.hex,
            transition: "transform 0.22s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: VT.easeOut }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "12px 4px 4px 4px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── ProofDrawer — receipts grouped by plain-English meaning ───────── */
function ProofDrawer({ data, delay }: { data: ExplainerData; delay: number }) {
  const used = new Set<string>()
  const buckets = PROOF_GROUPS.map((g) => {
    const items = data.receipts.filter((r) => !used.has(r.id) && g.match(r))
    items.forEach((r) => used.add(r.id))
    return { ...g, items }
  }).filter((g) => g.items.length > 0)

  const leftovers = data.receipts.filter((r) => !used.has(r.id))
  if (leftovers.length > 0) {
    buckets.push({
      key: "other",
      label: "Other proof",
      hex: VT.paperDim,
      rgb: "200,200,200",
      match: () => true,
      items: leftovers,
    })
  }

  const missingItems = data.missingInfo
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3.5">
      {buckets.map((g) => (
        <div key={g.key} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full flex-shrink-0"
              style={{
                width: 5,
                height: 5,
                background: g.hex,
                boxShadow: `0 0 6px ${rgba(g.rgb, 0.5)}`,
              }}
            />
            <Eyebrow size={9} color={g.hex}>
              {g.label}
            </Eyebrow>
            <span
              className="flex-1"
              style={{ borderTop: `1px dashed ${VT.ruleSoft}`, marginLeft: 4 }}
            />
            <Caption size={9} color={VT.ashSoft}>
              {g.items.length}
            </Caption>
          </div>
          <div className="flex flex-col gap-1">
            {g.items.map((r, i) => {
              const open = openId === r.id
              return (
                <ReceiptRow
                  key={r.id}
                  receipt={r}
                  open={open}
                  onToggle={() => setOpenId(open ? null : r.id)}
                  delay={delay + 0.06 + i * 0.04}
                />
              )
            })}
          </div>
        </div>
      ))}

      {missingItems.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full flex-shrink-0"
              style={{ width: 5, height: 5, background: VT.ashSoft }}
            />
            <Eyebrow size={9} color={VT.ashSoft}>
              Missing proof
            </Eyebrow>
            <span
              className="flex-1"
              style={{ borderTop: `1px dashed ${VT.ruleSoft}`, marginLeft: 4 }}
            />
            <Caption size={9} color={VT.ashSoft}>
              {missingItems.length}
            </Caption>
          </div>
          {missingItems.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
              style={{ padding: "6px 10px" }}
            >
              <StatusGlyph status="missing" />
              <span
                className="font-sans italic"
                style={{ fontSize: 11.5, color: VT.ashSoft, letterSpacing: "0.005em" }}
              >
                {m} not provided
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── ReceiptRow — single receipt with "means" expansion ─────────────── */
function ReceiptRow({
  receipt,
  open,
  onToggle,
  delay,
}: {
  receipt: CanvasReceipt
  open: boolean
  onToggle: () => void
  delay: number
}) {
  const sTone = sourceTone(receipt.source)
  return (
    <div className="flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle()
          }
        }}
        className="flex items-center gap-3 cursor-pointer"
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          background: open ? rgba(sTone.rgb, 0.05) : "transparent",
          border: `1px solid ${open ? rgba(sTone.rgb, 0.18) : "transparent"}`,
          transition: "all 0.16s ease",
        }}
      >
        <StatusGlyph status={receipt.status} />

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span
            className="font-sans"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: VT.paper,
              letterSpacing: "-0.005em",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {receipt.title}
          </span>
          <Caption size={9.5} color={VT.ashSoft}>
            {receipt.category}
          </Caption>
        </div>

        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: 36,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, receipt.strength))}%` }}
            transition={{ duration: 0.7, ease: VT.easeOut, delay }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${rgba(sTone.rgb, 0.55)}, ${sTone.hex})`,
              boxShadow: `0 0 4px ${rgba(sTone.rgb, 0.4)}`,
            }}
          />
        </div>

        <SourceMiniPill source={receipt.source} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: VT.easeOut }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="flex flex-col gap-1.5 px-3 py-2.5 mt-1.5 ml-6"
              style={{
                borderRadius: 8,
                background: rgba(sTone.rgb, 0.04),
                border: `1px solid ${rgba(sTone.rgb, 0.14)}`,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.18em",
                  color: sTone.hex,
                }}
              >
                Means
              </span>
              <p
                className="font-sans m-0"
                style={{
                  fontSize: 11.5,
                  color: VT.paper,
                  lineHeight: 1.55,
                  letterSpacing: "0.005em",
                }}
              >
                {receipt.means}
              </p>
              <p
                className="font-sans italic m-0"
                style={{
                  fontSize: 10.5,
                  color: VT.ashSoft,
                  lineHeight: 1.5,
                  letterSpacing: "0.005em",
                }}
              >
                Source: {sTone.means}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── WeaknessDrawer — why conviction is here + what would raise it ─── */
function WeaknessDrawer({
  data,
  dirColor,
}: {
  data: ExplainerData
  dirColor: { rgb: string; hex: string }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        className="flex flex-col gap-2 p-3.5"
        style={{
          borderRadius: 12,
          background: rgba(VT.roseRgb, 0.04),
          border: `1px solid ${rgba(VT.roseRgb, 0.18)}`,
        }}
      >
        <Eyebrow size={9} color={VT.rose}>
          Why conviction is here
        </Eyebrow>
        <ul className="flex flex-col gap-1.5 m-0 p-0 list-none">
          {data.weaknessItems.map((w, i) => (
            <li
              key={i}
              className="font-sans flex items-start gap-2"
              style={{ fontSize: 11.5, color: VT.paper, lineHeight: 1.5 }}
            >
              <span
                className="rounded-full mt-1.5 flex-shrink-0"
                style={{ width: 3, height: 3, background: VT.rose }}
              />
              {w}
            </li>
          ))}
          {data.convictionReasons.slice(0, 2).map((r, i) => (
            <li
              key={`r-${i}`}
              className="font-sans flex items-start gap-2"
              style={{ fontSize: 11.5, color: VT.paperDim, lineHeight: 1.5 }}
            >
              <span
                className="rounded-full mt-1.5 flex-shrink-0"
                style={{ width: 3, height: 3, background: VT.ashSoft }}
              />
              <span>
                <span style={{ color: VT.emerald }}>+</span> {r}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="flex flex-col gap-2 p-3.5"
        style={{
          borderRadius: 12,
          background: rgba(VT.emeraldRgb, 0.04),
          border: `1px solid ${rgba(VT.emeraldRgb, 0.18)}`,
        }}
      >
        <Eyebrow size={9} color={VT.emerald}>
          What would raise it
        </Eyebrow>
        {data.convictionRaisers.length > 0 ? (
          <ul className="flex flex-col gap-1.5 m-0 p-0 list-none">
            {data.convictionRaisers.map((r, i) => (
              <li
                key={i}
                className="font-sans flex items-start gap-2"
                style={{ fontSize: 11.5, color: VT.paper, lineHeight: 1.5 }}
              >
                <span
                  className="rounded-full mt-1.5 flex-shrink-0"
                  style={{ width: 3, height: 3, background: VT.emerald }}
                />
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <p
            className="font-sans italic m-0"
            style={{ fontSize: 11, color: VT.ashSoft, lineHeight: 1.5 }}
          >
            Conviction is already strong — nothing material to add.
          </p>
        )}
      </div>
    </div>
  )
}

/* ── TechnicalLogic — the six pillars with simple human labels ─────── */
function TechnicalLogic({
  data,
  dirColor,
}: {
  data: ExplainerData
  dirColor: { rgb: string; hex: string }
}) {
  const [active, setActive] = useState<CanvasPillar | null>(null)
  return (
    <div className="flex flex-col gap-1.5">
      {data.pillars.map((p) => {
        const tone = pillarTone(p.key, dirColor)
        const open = active === p.key
        const linked = data.receipts.filter((r) => r.pillar === p.key)
        return (
          <div key={p.key} className="flex flex-col">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActive(open ? null : p.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setActive(open ? null : p.key)
                }
              }}
              className="flex items-center gap-3 cursor-pointer select-none"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: open ? rgba(tone.rgb, 0.07) : "rgba(255,255,255,0.018)",
                border: `1px solid ${open ? rgba(tone.rgb, 0.28) : VT.ruleSoft}`,
                transition: "all 0.18s ease",
              }}
            >
              <span
                aria-hidden
                className="flex-shrink-0"
                style={{
                  width: 3,
                  alignSelf: "stretch",
                  background: tone.hex,
                  borderRadius: 2,
                  opacity: open ? 1 : 0.55,
                  boxShadow: open ? `0 0 8px ${rgba(tone.rgb, 0.45)}` : "none",
                }}
              />

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Eyebrow size={9} color={tone.hex}>
                    {tone.label}
                  </Eyebrow>
                  <StatusGlyph status={p.status} />
                  {linked.length > 0 && (
                    <Caption size={9} color={VT.ashSoft}>
                      {linked.length} receipt{linked.length === 1 ? "" : "s"}
                    </Caption>
                  )}
                </div>
                <p
                  className="font-sans m-0"
                  style={{
                    fontSize: 12.5,
                    color: p.status === "missing" ? VT.ashSoft : VT.paper,
                    fontStyle: p.status === "missing" ? "italic" : "normal",
                    lineHeight: 1.45,
                    letterSpacing: "0.005em",
                    wordBreak: "break-word",
                  }}
                >
                  {p.oneLine}
                </p>
              </div>

              <ChevronDown
                size={11}
                strokeWidth={1.7}
                style={{
                  color: tone.hex,
                  transition: "transform 0.22s ease",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: VT.easeOut }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="flex flex-col gap-3 px-3.5 py-3 mt-1.5"
                    style={{
                      borderRadius: 10,
                      background: rgba(tone.rgb, 0.04),
                      border: `1px solid ${rgba(tone.rgb, 0.14)}`,
                    }}
                  >
                    <p
                      className="font-sans m-0"
                      style={{
                        fontSize: 12,
                        color: VT.paper,
                        lineHeight: 1.55,
                        letterSpacing: "0.005em",
                      }}
                    >
                      {p.deeper}
                    </p>
                    {linked.length > 0 && (
                      <div
                        className="flex flex-col gap-1.5 pt-2"
                        style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}
                      >
                        <Eyebrow size={8.5} color={tone.hex}>
                          Linked receipts
                        </Eyebrow>
                        {linked.map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center gap-2"
                            style={{ padding: "4px 0" }}
                          >
                            <StatusGlyph status={r.status} />
                            <span
                              className="font-sans truncate flex-1"
                              style={{
                                fontSize: 11.5,
                                color: VT.paper,
                                letterSpacing: "-0.005em",
                                lineHeight: 1.3,
                              }}
                            >
                              {r.title}
                            </span>
                            <SourceMiniPill source={r.source} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   END — ForecastExplainer
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Detailed thesis breakdown — pure data builder (kept for reuse) ─── */
function buildThesisBreakdown(
  forecast: ForecastItem,
  dirColor: { rgb: string; hex: string },
) {
  const seed = seedFrom(forecast.id)

  // WHY — chain of confluences, formatted as a deeper sentence
  const conf = (forecast.confluences ?? [])
    .filter((c) => c && c.name)
    .slice(0, 3)
  const whyDeep =
    conf.length === 0
      ? "Discretionary read with no stated structural confluences. Trade is based on price action interpretation."
      : conf.length === 1
        ? `${conf[0].name} (${conf[0].category}) is the primary structural anchor for this bias. Author rates this confluence ${conf[0].strength}/100 in strength.`
        : conf.length === 2
          ? `${conf[0].name} and ${conf[1].name} converge to form a multi-factor confluence. The primary edge is ${conf[0].category}, supported by a ${conf[1].category} read.`
          : `Three-factor confluence: ${conf[0].name} (${conf[0].category}), ${conf[1].name} (${conf[1].category}), and ${conf[2].name} (${conf[2].category}) all aligning on direction.`

  // TRIGGER — synthesized from direction + confluence category
  const dirWord = forecast.direction === "LONG" ? "bullish" : "bearish"
  const tfMap: Record<string, string> = {
    "1m": "1-minute",
    "5m": "5-minute",
    "15m": "15-minute",
    "30m": "30-minute",
    "1H": "1-hour",
    "4H": "4-hour",
    "1D": "daily",
  }
  const tfFull = tfMap[forecast.timeframe] ?? forecast.timeframe
  const trigger = conf[0]
    ? `Wait for a ${tfFull} ${dirWord} confirmation candle to close beyond ${forecast.entry}, ideally with displacement and volume confirming the ${conf[0].category} read.`
    : `Wait for a ${tfFull} ${dirWord} confirmation candle to close beyond ${forecast.entry}.`

  // INVALIDATION — distance-aware
  const entry = parseFloat(forecast.entry.replace(/,/g, ""))
  const sl = parseFloat(forecast.stopLoss.replace(/,/g, ""))
  const distPct = !isNaN(entry) && !isNaN(sl) && entry !== 0
    ? Math.abs(((sl - entry) / entry) * 100)
    : null
  const invalidationLine =
    forecast.invalidation ??
    `Stop loss at ${forecast.stopLoss}. A ${tfFull} close beyond this level voids the thesis.`
  const invalidationDist = distPct !== null
    ? `${distPct < 1 ? distPct.toFixed(2) : distPct.toFixed(1)}% from entry`
    : null

  // TARGETS — multi-target ladder if RR allows
  const tp = parseFloat(forecast.takeProfit.replace(/,/g, ""))
  const targets: { label: string; price: string; reward: string; share: string }[] = []
  if (!isNaN(entry) && !isNaN(sl) && !isNaN(tp)) {
    const risk = Math.abs(entry - sl)
    const reward = Math.abs(tp - entry)
    const r = reward / risk
    const dec = entry > 100 ? 0 : 4
    if (r >= 2.5) {
      const t1Price = forecast.direction === "LONG" ? entry + risk * 1.5 : entry - risk * 1.5
      const t2Price = tp
      targets.push({
        label: "T1 — partial",
        price: t1Price.toFixed(dec),
        reward: "1.5R",
        share: "50%",
      })
      targets.push({
        label: "T2 — full",
        price: t2Price.toFixed(dec),
        reward: `${r.toFixed(2)}R`,
        share: "50%",
      })
    } else {
      targets.push({
        label: "T1 — full",
        price: tp.toFixed(dec),
        reward: `${r.toFixed(2)}R`,
        share: "100%",
      })
    }
  }

  // RISK PLAN — sizing based on RR
  const rrMatch = forecast.riskReward?.match(/1\s*:\s*([\d.]+)/)
  const r = rrMatch ? parseFloat(rrMatch[1]) : NaN
  const sizingLine = !isNaN(r)
    ? r >= 2.5
      ? "Premium reward profile — 1% account risk recommended; trail beyond T1."
      : r >= 1.5
        ? "Balanced reward profile — 0.75% account risk recommended; partial at T1, trail to breakeven."
        : "Tight reward profile — 0.5% account risk recommended; treat as scalp."
    : "Reward profile undefined — discretionary sizing."

  // Setup quality score (0-100) — synthesized
  const qualityScore = clamp(
    50 +
      (conf.length * 8) +
      (forecast.invalidation ? 10 : 0) +
      (!isNaN(r) ? Math.min(20, r * 6) : 0) +
      ((seed % 11) - 5),
    20,
    98,
  )

  return {
    whyDeep,
    trigger,
    invalidationLine,
    invalidationDist,
    targets,
    sizingLine,
    qualityScore,
    dirColor,
  }
}


/* ═══════════════════════════════════════════════���════════════════════════
   5. LIFECYCLE STORY — what's happened since publish
   ═══��════════════════════════════════════════════════════════════════════ */
interface LifecycleEvent {
  key: string
  icon: LucideIcon
  iconRgb: string
  label: string
  description: string
  ts?: string
  active?: boolean
}

function LifecycleStory({
  forecast,
  dirColor,
  delay,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  delay: number
}) {
  const seed = useMemo(() => seedFrom(forecast.id), [forecast.id])
  const isLive = forecast.status === "active" || forecast.status === "near_expiry"
  const won = forecast.status === "resolved_win"
  const lost = forecast.status === "resolved_loss"

  const events = useMemo<LifecycleEvent[]>(() => {
    const out: LifecycleEvent[] = []
    const created = forecast.createdAt ? new Date(forecast.createdAt).getTime() : Date.now()

    // 1. Published
    out.push({
      key: "published",
      icon: Sparkles,
      iconRgb: dirColor.rgb,
      label: "Published",
      description: `Posted to ${forecast.communityContext?.name ?? forecast.user?.communityName ?? "the public feed"}.`,
      ts: forecast.createdAt,
    })

    // 2. First reactions (5-15 min after posting)
    const reactionsAt = new Date(created + (5 + (seed % 10)) * 60_000)
    if (reactionsAt.getTime() <= Date.now()) {
      const traders = 6 + (seed % 28)
      out.push({
        key: "reactions",
        icon: Heart,
        iconRgb: VT.cyanRgb,
        label: "Community first reaction",
        description: `${traders} traders engaged within the first hour.`,
        ts: reactionsAt.toISOString(),
      })
    }

    // 3. Entry triggered or missed
    if (isLive || won || lost) {
      const entryAt = new Date(created + (30 + (seed % 60)) * 60_000)
      out.push({
        key: "entry",
        icon: Target,
        iconRgb: dirColor.rgb,
        label: "Entry triggered",
        description: `Price tagged the entry zone — ${10 + (seed % 40)} followers entered alongside.`,
        ts: entryAt.toISOString(),
      })
    } else if (forecast.status === "expired" || forecast.status === "invalidated") {
      const skippedAt = new Date(created + (180 + (seed % 240)) * 60_000)
      out.push({
        key: "missed",
        icon: XCircle,
        iconRgb: VT.roseRgb,
        label: "Entry never tagged",
        description: "Price never reached the stated entry zone before window closed.",
        ts: skippedAt.toISOString(),
      })
    }

    // 4. Mentor review (if exists)
    if (forecast.mentorReview) {
      out.push({
        key: "mentor",
        icon: Crown,
        iconRgb: "245,158,11",
        label: "Mentor review posted",
        description: `${forecast.mentorReview.mentorName} rated this ${forecast.mentorReview.rating.toFixed(1)}/10.`,
        ts: forecast.mentorReview.reviewedAt,
      })
    }

    // 5. Currently live (if applicable)
    if (isLive) {
      out.push({
        key: "live",
        icon: Activity,
        iconRgb: forecast.status === "near_expiry" ? "245,158,11" : VT.emeraldRgb,
        label: "Live now",
        description:
          forecast.status === "near_expiry"
            ? "Window closes within 4 hours. Outcome pending."
            : "Trade is in flight — TP and SL both still in play.",
        active: true,
      })
    }

    // 6. Resolution (if applicable)
    if (won) {
      out.push({
        key: "resolved",
        icon: CheckCircle2,
        iconRgb: VT.emeraldRgb,
        label: "Target reached",
        description: "The forecast resolved as a win — target was hit cleanly.",
        ts: forecast.resolvedAt,
      })
    } else if (lost) {
      out.push({
        key: "resolved",
        icon: XCircle,
        iconRgb: VT.roseRgb,
        label: "Stop hit",
        description: "The forecast resolved as a loss — stop loss was tagged.",
        ts: forecast.resolvedAt,
      })
    } else if (forecast.status === "expired") {
      out.push({
        key: "expired",
        icon: CalendarClock,
        iconRgb: "148,163,184",
        label: "Window closed",
        description: "Forecast window expired without target or stop being hit.",
        ts: forecast.resolvedAt,
      })
    } else if (forecast.status === "invalidated") {
      out.push({
        key: "void",
        icon: XCircle,
        iconRgb: VT.roseRgb,
        label: "Invalidated",
        description: "Voided due to extraordinary market conditions or rule violation.",
        ts: forecast.resolvedAt,
      })
    } else if (isLive && forecast.expiresAt) {
      // Forward-looking: window closes
      out.push({
        key: "closes",
        icon: CalendarClock,
        iconRgb: "148,163,184",
        label: "Window will close",
        description: "Auto-resolution if neither target nor stop is hit.",
        ts: forecast.expiresAt,
      })
    }

    return out
  }, [forecast, isLive, won, lost, dirColor.rgb, seed])

  return (
    <GlassCard accentRgb={dirColor.rgb} delay={delay}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Eyebrow>Lifecycle Story</Eyebrow>
          <Caption color={VT.ashSoft} size={10}>
            since publish
          </Caption>
        </div>

        <div className="relative flex flex-col">
          {/* Vertical spine */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: 11,
              top: 8,
              bottom: 8,
              width: 1,
              background: `linear-gradient(180deg, ${rgba(dirColor.rgb, 0.32)} 0%, ${rgba(dirColor.rgb, 0.08)} 50%, ${rgba("148,163,184", 0.18)} 100%)`,
            }}
          />

          {events.map((e, i) => {
            const I = e.icon
            return (
              <motion.div
                key={e.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: VT.easeOut, delay: delay + 0.08 + i * 0.06 }}
                className="relative flex gap-3.5"
                style={{ paddingTop: i === 0 ? 0 : 12, paddingBottom: i === events.length - 1 ? 0 : 12 }}
              >
                {/* Node */}
                <div className="relative flex-shrink-0" style={{ width: 22, height: 22 }}>
                  {e.active && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: rgba(e.iconRgb, 0.32),
                      }}
                      animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: `rgba(${e.iconRgb}, 0.12)`,
                      border: `1px solid rgba(${e.iconRgb}, 0.42)`,
                    }}
                  >
                    <I size={10} strokeWidth={1.8} style={{ color: `rgb(${e.iconRgb})` }} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className="font-sans"
                      style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: VT.paper,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {e.label}
                    </span>
                    <Caption color={VT.ashSoft} size={9.5}>
                      {e.ts ? timeAgo(e.ts) : e.active ? "now" : ""}
                    </Caption>
                  </div>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: 11.5,
                      color: VT.paperDim,
                      lineHeight: 1.45,
                      letterSpacing: "0.005em",
                    }}
                  >
                    {e.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   6. COMMUNITY PULSE — bull/bear, watching, saved, agreement
   ════════════���═════════════════���═════════════════════════════════════════ */
function CommunityPulse({
  forecast,
  dirColor,
  delay,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  delay: number
}) {
  const seed = useMemo(() => seedFrom(forecast.id), [forecast.id])

  // Sentiment derived from confidence and seed (NOT the same as forecast.confidence — this is crowd sentiment)
  const baseBull =
    forecast.direction === "LONG"
      ? Math.min(82, 50 + Math.round((forecast.confidence - 50) * 0.6))
      : Math.max(18, 50 - Math.round((forecast.confidence - 50) * 0.6))
  const bullPct = Math.max(15, Math.min(85, baseBull + ((seed % 11) - 5)))
  const bearPct = 100 - bullPct
  const bulls = 80 + (seed % 280)
  const bears = Math.round((bearPct / bullPct) * bulls)

  // Watching / saved
  const watching = forecast.views ?? 200 + (seed % 1200)
  const saved = Math.round(watching * 0.06 + (seed % 24))

  // Discussion quality — derived from comments count
  const commentCount = forecast.comments ?? 0
  const discussionTier =
    commentCount >= 25 ? "High" : commentCount >= 8 ? "Medium" : "Quiet"
  const discussionColor =
    commentCount >= 25 ? VT.emerald : commentCount >= 8 ? VT.amber : VT.ashSoft

  // Agreement reading
  const split = Math.abs(bullPct - bearPct)
  const agreementText =
    split >= 50 ? "Room is aligned" : split >= 25 ? "Mild lean" : "Room is split"

  // Mentor review status
  const reviewed = !!forecast.mentorReview

  return (
    <GlassCard accentRgb={dirColor.rgb} delay={delay}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Eyebrow>Community Pulse</Eyebrow>
          <Caption color={VT.ashSoft} size={10}>
            last 24h
          </Caption>
        </div>

        {/* Bull vs bear sentiment row */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={11} strokeWidth={1.8} style={{ color: VT.emerald }} />
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: VT.emerald,
                  letterSpacing: "-0.015em",
                }}
              >
                {bullPct}%
              </span>
              <Caption color={VT.ashSoft} size={10}>
                {bulls} bulls
              </Caption>
            </div>
            <div className="flex items-center gap-2">
              <Caption color={VT.ashSoft} size={10}>
                {bears} bears
              </Caption>
              <span
                className="font-sans tabular-nums"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: VT.rose,
                  letterSpacing: "-0.015em",
                }}
              >
                {bearPct}%
              </span>
              <TrendingDown size={11} strokeWidth={1.8} style={{ color: VT.rose }} />
            </div>
          </div>
          {/* Split bar */}
          <div
            className="flex overflow-hidden"
            style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${bullPct}%` }}
              transition={{ duration: 0.9, ease: VT.easeOut, delay: delay + 0.2 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, rgba(${VT.emeraldRgb},0.55), ${VT.emerald})`,
                boxShadow: `0 0 8px rgba(${VT.emeraldRgb},0.35)`,
              }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${bearPct}%` }}
              transition={{ duration: 0.9, ease: VT.easeOut, delay: delay + 0.25 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${VT.rose}, rgba(${VT.roseRgb},0.55))`,
                boxShadow: `0 0 8px rgba(${VT.roseRgb},0.35)`,
              }}
            />
          </div>
          <Caption size={10} color={VT.ashSoft}>
            <span style={{ color: VT.paper, fontWeight: 500 }}>{agreementText}</span> · {split}-point spread
          </Caption>
        </div>

        <Hairline dashed />

        {/* 4-cell engagement grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <PulseCell icon={Eye} label="Watching" value={`${watching.toLocaleString()}`} />
          <PulseCell icon={Bookmark} label="Saved" value={`${saved}`} />
          <PulseCell
            icon={MessageSquare}
            label="Discussion"
            value={discussionTier}
            color={discussionColor}
            sub={`${commentCount} comments`}
          />
          <PulseCell
            icon={Crown}
            label="Mentor"
            value={reviewed ? "Reviewed" : "Pending"}
            color={reviewed ? VT.amber : VT.ashSoft}
            sub={reviewed ? `${forecast.mentorReview!.rating.toFixed(1)}/10` : "no endorsement yet"}
          />
        </div>

        <Hairline dashed />

        {/* ── Conviction split: Author vs Crowd ── */}
        <ConvictionSplit
          authorPct={forecast.confidence}
          crowdPct={(() => {
            // Crowd conviction is bullPct if direction is LONG, bearPct if SHORT
            return forecast.direction === "LONG" ? bullPct : bearPct
          })()}
          dirColor={dirColor}
        />

        <Hairline dashed />

        {/* ── Top reactions on this forecast ── */}
        <TopReactions seed={seed} />

        <Hairline dashed />

        {/* ── Watchlist breakdown: who's watching ── */}
        <WatchlistBreakdown
          seed={seed}
          watching={watching}
        />

        <Hairline dashed />

        {/* ── Discussion intensity over last 12 hours ── */}
        <DiscussionIntensity seed={seed} commentCount={commentCount} delay={delay} />

        <Hairline dashed />

        {/* Engagement micro row — likes + heart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Heart size={11} strokeWidth={1.8} style={{ color: VT.rose }} />
            <span
              className="font-sans tabular-nums"
              style={{ fontSize: 12, fontWeight: 500, color: VT.paper, letterSpacing: "-0.01em" }}
            >
              {forecast.likes}
            </span>
            <Caption color={VT.ashSoft} size={9.5}>
              likes
            </Caption>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

/* ── Conviction split — Author vs Crowd ──────────────────────────────── */
function ConvictionSplit({
  authorPct,
  crowdPct,
  dirColor,
}: {
  authorPct: number
  crowdPct: number
  dirColor: { rgb: string; hex: string }
}) {
  const delta = authorPct - crowdPct
  const verdict =
    Math.abs(delta) <= 5
      ? "Author and crowd are aligned"
      : delta > 0
        ? "Crowd is more cautious than author"
        : "Crowd is more bullish than author"
  const verdictColor = Math.abs(delta) <= 5 ? VT.emerald : VT.amber

  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow size={9}>Conviction split</Eyebrow>
      <div className="flex flex-col gap-2">
        <ConvictionRow label="Author" pct={authorPct} color={dirColor.hex} rgb={dirColor.rgb} />
        <ConvictionRow
          label="Crowd"
          pct={crowdPct}
          color={ACCENT.cyan?.hex ?? VT.cyan}
          rgb={ACCENT.cyan?.rgb ?? VT.cyanRgb}
        />
      </div>
      <Caption size={10} color={VT.ashSoft}>
        <span style={{ color: verdictColor, fontWeight: 500 }}>{verdict}</span>
        {Math.abs(delta) > 0 && ` · ${Math.abs(delta)}-point gap`}
      </Caption>
    </div>
  )
}

function ConvictionRow({
  label,
  pct,
  color,
  rgb,
}: {
  label: string
  pct: number
  color: string
  rgb: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-sans"
        style={{
          fontSize: 11,
          color: VT.paperDim,
          width: 50,
          flexShrink: 0,
          letterSpacing: "0.005em",
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: VT.easeOut }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${rgba(rgb, 0.5)}, ${color})`,
            boxShadow: `0 0 6px ${rgba(rgb, 0.35)}`,
          }}
        />
      </div>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 11.5,
          fontWeight: 500,
          color,
          width: 36,
          textAlign: "right",
          letterSpacing: "-0.01em",
        }}
      >
        {pct}%
      </span>
    </div>
  )
}

/* ── Top reactions ───────────────────────────────────���───────────────── */
function TopReactions({ seed }: { seed: number }) {
  const reactions = useMemo(() => {
    const all = [
      { label: "Insightful", color: ACCENT.emerald.hex, rgb: ACCENT.emerald.rgb, count: 8 + (seed % 23) },
      { label: "Risky", color: VT.amber, rgb: "245,158,11", count: 3 + ((seed >> 2) % 17) },
      { label: "Counterpoint", color: VT.rose, rgb: VT.roseRgb, count: 2 + ((seed >> 4) % 13) },
      { label: "Mirroring", color: VT.cyan, rgb: VT.cyanRgb, count: 4 + ((seed >> 6) % 19) },
    ]
    return all.sort((a, b) => b.count - a.count).slice(0, 3)
  }, [seed])

  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow size={9}>Top reactions</Eyebrow>
      <div className="flex flex-col gap-1.5">
        {reactions.map((r) => (
          <div key={r.label} className="flex items-center gap-2.5">
            <span
              className="rounded-full"
              style={{
                width: 5,
                height: 5,
                background: r.color,
                boxShadow: `0 0 5px rgba(${r.rgb},0.55)`,
              }}
            />
            <span
              className="font-sans"
              style={{
                fontSize: 11.5,
                color: VT.paper,
                letterSpacing: "0.005em",
                flex: 1,
              }}
            >
              {r.label}
            </span>
            <span
              className="font-sans tabular-nums"
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: r.color,
                letterSpacing: "-0.005em",
              }}
            >
              {r.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Watchlist breakdown ─────────────────────────────────────────────── */
function WatchlistBreakdown({
  seed,
  watching,
}: {
  seed: number
  watching: number
}) {
  // Split the watcher pool into role buckets
  const mentors = Math.max(1, Math.round(watching * 0.012 + (seed % 4)))
  const pros = Math.max(2, Math.round(watching * 0.05 + ((seed >> 2) % 8)))
  const members = Math.max(0, watching - mentors - pros)

  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow size={9}>Watchlist breakdown</Eyebrow>
      <div className="grid grid-cols-3 gap-3">
        <WatchBucket
          icon={Crown}
          color={VT.amber}
          rgb="245,158,11"
          label="Mentors"
          value={mentors}
        />
        <WatchBucket
          icon={ShieldCheck}
          color={ACCENT.cyan?.hex ?? VT.cyan}
          rgb={ACCENT.cyan?.rgb ?? VT.cyanRgb}
          label="Pros"
          value={pros}
        />
        <WatchBucket
          icon={Eye}
          color={VT.paperDim}
          rgb="148,163,184"
          label="Members"
          value={members}
        />
      </div>
    </div>
  )
}

function WatchBucket({
  icon: Icon,
  color,
  rgb,
  label,
  value,
}: {
  icon: LucideIcon
  color: string
  rgb: string
  label: string
  value: number
}) {
  return (
    <div
      className="flex flex-col items-start gap-1.5 px-2 py-2"
      style={{
        borderRadius: 8,
        background: rgba(rgb, 0.04),
        border: `1px solid ${rgba(rgb, 0.16)}`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={10} strokeWidth={1.8} style={{ color }} />
        <Eyebrow size={8.5} color={rgba("255,255,255", 0.42)}>
          {label}
        </Eyebrow>
      </div>
      <span
        className="font-sans tabular-nums"
        style={{
          fontSize: 15,
          fontWeight: 500,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        {value.toLocaleString()}
      </span>
    </div>
  )
}

/* ── Discussion intensity (last 12 hours) ────────────────────────────── */
function DiscussionIntensity({
  seed,
  commentCount,
  delay,
}: {
  seed: number
  commentCount: number
  delay: number
}) {
  // 12 deterministic buckets, comments per hour
  const buckets = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < 12; i++) {
      const r = (seed * (i + 13)) % 100
      // Last few hours weight higher to make it feel "recent"
      const recencyWeight = i >= 9 ? 1.4 : i >= 6 ? 1.1 : 0.9
      arr.push(Math.round((r / 100) * 8 * recencyWeight))
    }
    // Make sure they sum at least to commentCount/3
    return arr
  }, [seed])
  const max = Math.max(1, ...buckets)
  const peakIndex = buckets.indexOf(max)
  const peakHour = 12 - peakIndex
  const peakLabel =
    peakHour <= 1 ? "now" : peakHour <= 3 ? `${peakHour}h ago` : `${peakHour}h ago`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Eyebrow size={9}>Discussion intensity</Eyebrow>
        <Caption size={10} color={VT.ashSoft}>
          last 12h · peak {peakLabel}
        </Caption>
      </div>
      <div className="flex items-end gap-1" style={{ height: 28 }}>
        {buckets.map((v, i) => {
          const h = (v / max) * 100
          const isPeak = i === peakIndex
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, h)}%` }}
              transition={{ duration: 0.5, ease: VT.easeOut, delay: delay + 0.04 * i }}
              style={{
                flex: 1,
                background: isPeak
                  ? `linear-gradient(180deg, ${VT.emerald}, ${rgba(VT.emeraldRgb, 0.4)})`
                  : `linear-gradient(180deg, ${rgba("148,163,184", 0.55)}, ${rgba("148,163,184", 0.18)})`,
                borderRadius: "2px 2px 0 0",
                boxShadow: isPeak ? `0 0 5px rgba(${VT.emeraldRgb},0.35)` : "none",
                minHeight: 2,
              }}
            />
          )
        })}
      </div>
      <Caption size={10} color={VT.ashSoft}>
        {commentCount} total comments · velocity peaked {peakLabel}
      </Caption>
    </div>
  )
}

function PulseCell({
  icon: Icon,
  label,
  value,
  color = VT.paper,
  sub,
}: {
  icon: LucideIcon
  label: string
  value: string
  color?: string
  sub?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={10} strokeWidth={1.7} style={{ color: VT.ashGhost }} />
        <Eyebrow size={8.5}>{label}</Eyebrow>
      </div>
      <span
        className="font-sans"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {sub && (
        <Caption color={VT.ashSoft} size={9.5}>
          {sub}
        </Caption>
      )}
    </div>
  )
}

/* ════���═══════════════════════════════════════════════════��══════════════���
   7. ROLE-AWARE ACTIONS — adapts to viewerRole
   ═�����═══════════════════════════════════════════════════════════��═���════════ */
interface RoleAction {
  key: string
  icon: LucideIcon
  label: string
  caption: string
}

function RoleAwareActions({
  viewerRole,
  delay,
}: {
  viewerRole: ViewerRole
  delay: number
}) {
  const actions = useMemo<RoleAction[]>(() => {
    switch (viewerRole) {
      case "mentor":
        return [
          { key: "review", icon: CheckCircle2, label: "Review", caption: "Endorse or critique" },
          { key: "pin", icon: Pin, label: "Pin", caption: "Feature in community" },
          { key: "correct", icon: Edit3, label: "Add correction", caption: "Note a fix or update" },
          { key: "flag", icon: Flag, label: "Flag receipts", caption: "Missing evidence" },
        ]
      case "moderator":
        return [
          { key: "approve", icon: CheckCircle2, label: "Approve", caption: "Move to public" },
          { key: "pin", icon: Pin, label: "Pin", caption: "Mark as featured" },
          { key: "lock", icon: Lock, label: "Lock thread", caption: "Stop new comments" },
          { key: "flag", icon: Flag, label: "Flag", caption: "Mark for review" },
        ]
      case "author":
        return [
          { key: "entry", icon: Target, label: "Mark entered", caption: "Confirm trigger" },
          { key: "invalid", icon: XCircle, label: "Mark invalidated", caption: "Void this idea" },
          { key: "update", icon: RefreshCw, label: "Update levels", caption: "Adjust SL/TP" },
          { key: "post", icon: Edit3, label: "Post-analysis", caption: "Add your retro" },
        ]
      case "trader":
      default:
        return [
          { key: "save", icon: Bookmark, label: "Save", caption: "Add to saved" },
          { key: "watch", icon: Eye, label: "Watchlist", caption: "Track this idea" },
          { key: "scenario", icon: Sparkles, label: "Build scenario", caption: "Adapt to my plan" },
          { key: "discuss", icon: Hash, label: "Discuss", caption: "Join the thread" },
        ]
    }
  }, [viewerRole])

  // Role-specific accent color for the header eyebrow
  const roleTone =
    viewerRole === "mentor"
      ? VT.amber
      : viewerRole === "moderator"
        ? VT.purple
        : viewerRole === "author"
          ? VT.emerald
          : VT.ashSoft

  const roleLabel =
    viewerRole === "mentor"
      ? "Mentor actions"
      : viewerRole === "moderator"
        ? "Moderator actions"
        : viewerRole === "author"
          ? "Author actions"
          : "Actions"

  return (
    <GlassCard accentRgb={VT.cyanRgb} delay={delay} padding={20}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Eyebrow color={roleTone}>{roleLabel}</Eyebrow>
          {viewerRole !== "trader" && (
            <Caption color={VT.ashSoft} size={9.5}>
              role-specific
            </Caption>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((a, i) => (
            <ActionTile key={a.key} action={a} delay={delay + 0.08 + i * 0.04} />
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

function ActionTile({
  action,
  delay,
}: {
  action: RoleAction
  delay: number
}) {
  const I = action.icon
  const [active, setActive] = useState(false)
  const trigger = () => {
    setActive(true)
    window.setTimeout(() => setActive(false), 1200)
  }
  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: VT.easeOut, delay }}
      whileHover={{ y: -1 }}
      onClick={trigger}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          trigger()
        }
      }}
      className="flex flex-col items-start gap-2 text-left transition-colors cursor-pointer"
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        background: active
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.022)",
        border: active
          ? `1px solid ${rgba(VT.cyanRgb, 0.3)}`
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <I
        size={13}
        strokeWidth={1.7}
        style={{ color: active ? VT.cyan : VT.paper }}
      />
      <div className="flex flex-col gap-0.5">
        <span
          className="font-sans"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: VT.paper,
            letterSpacing: "-0.005em",
            lineHeight: 1.1,
          }}
        >
          {action.label}
        </span>
        <Caption color={VT.ashSoft} size={9.5}>
          {action.caption}
        </Caption>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   PROFILE VIEW — replaces the right rail when analyst card is clicked
   (preserved from v3, unchanged)
   ════════════════════════════════════════════════════════════════════════ */
function ProfileView({
  forecast,
  dirColor,
  onBack,
}: {
  forecast: ForecastItem
  dirColor: { rgb: string; hex: string }
  onBack: () => void
}) {
  // Defensive: tolerate missing or partial user payload.
  const u = forecast.user ?? ({} as ForecastUser)
  const userName = u.name ?? "Unknown analyst"
  const userInitial = (userName.trim().charAt(0) || "?").toUpperCase()
  const seed = useMemo(
    () => seedFrom((u.id ?? "") + forecast.id),
    [u.id, forecast.id],
  )
  const accuracy = u.overallAccuracy ?? forecast.accuracy ?? 68
  const calls = u.resolvedCount ?? 30 + (seed % 80)
  const wins = Math.round(calls * (accuracy / 100))
  const losses = calls - wins
  const streak = 1 + (seed % 11)
  const bestStreak = Math.max(streak, 4 + (seed % 14))
  const points = 1200 + (seed % 9000)
  const avgRR = `1:${(1 + (seed % 18) / 10).toFixed(1)}`
  const memberSince = useMemo(() => {
    const months = 6 + (seed % 36)
    const d = new Date()
    d.setMonth(d.getMonth() - months)
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }, [seed])

  const specialties = useMemo(() => {
    const all = [
      "ICT Mastery",
      "SMC",
      "Wyckoff",
      "Liquidity",
      "Order Flow",
      "Macro",
      "Forex",
      "Crypto",
      "Indices",
    ]
    const count = 3 + (seed % 3)
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      out.push(all[(seed + i * 7) % all.length])
    }
    return Array.from(new Set(out))
  }, [seed])

  const recentCalls = useMemo(() => {
    const symbols = ["EURUSD", "BTCUSD", "GBPJPY", "XAUUSD", "NAS100", "AUDUSD", "ETHUSD"]
    const dirs: ("LONG" | "SHORT")[] = ["LONG", "SHORT"]
    const outcomes: ("win" | "loss" | "live")[] = ["win", "win", "win", "loss", "win", "live"]
    return Array.from({ length: 6 }, (_, i) => {
      const s = (seed >> (i * 3)) >>> 0
      return {
        id: `c${i}`,
        symbol: symbols[s % symbols.length],
        direction: dirs[s % 2],
        outcome: outcomes[i],
        rr: `1:${(0.8 + ((s >> 2) % 25) / 10).toFixed(1)}`,
        ago: `${1 + ((s >> 4) % 14)}d ago`,
      }
    })
  }, [seed])

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.28, ease: VT.easeOut }}
      className="flex flex-col"
      style={{ padding: 24, gap: 20 }}
    >
      {/* HEADER — back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 self-start transition-colors"
        style={{
          padding: "6px 10px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.05)",
          color: VT.ashSoft,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)"
          e.currentTarget.style.color = VT.paper
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.025)"
          e.currentTarget.style.color = VT.ashSoft
        }}
      >
        <ArrowLeft size={12} strokeWidth={1.8} />
        <Eyebrow size={9} color="inherit">
          Back to call
        </Eyebrow>
      </button>

      {/* COVER — large avatar + name + meta */}
      <GlassCard accentRgb={dirColor.rgb}>
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-5">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 80,
                height: 80,
                borderRadius: 22,
                background: `linear-gradient(155deg, ${rgba(dirColor.rgb, 0.3)}, ${rgba(dirColor.rgb, 0.06)})`,
                border: u.isMentor
                  ? `1px solid ${amber(0.5)}`
                  : `1px solid ${rgba(dirColor.rgb, 0.42)}`,
                boxShadow: `inset 0 0 32px ${rgba(dirColor.rgb, 0.2)}, 0 6px 18px ${rgba(dirColor.rgb, 0.22)}`,
              }}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 36,
                  fontWeight: 500,
                  color: dirColor.hex,
                  letterSpacing: "-0.04em",
                }}
              >
                {userInitial}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2
                  className="font-sans truncate"
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: VT.paper,
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                  }}
                >
                  {userName}
                </h2>
                {u.isVerified && (
                  <CheckCircle2
                    size={16}
                    strokeWidth={2.4}
                    style={{ color: ACCENT.emerald.hex }}
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {u.isMentor && (
                  <span
                    className="flex items-center gap-1 px-2 py-1"
                    style={{
                      borderRadius: 999,
                      background: amber(0.1),
                      border: `1px solid ${amber(0.32)}`,
                    }}
                  >
                    <Crown size={10} strokeWidth={2} style={{ color: VT.amber }} />
                    <Eyebrow size={9} color={VT.amber}>
                      Mentor
                    </Eyebrow>
                  </span>
                )}
                <Caption color={VT.ashSoft}>{u.tier}</Caption>
                <span style={{ color: VT.ashWhisper }}>·</span>
                <Caption color={VT.ashSoft}>{u.role}</Caption>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <MapPin size={9} strokeWidth={1.8} style={{ color: VT.ashGhost }} />
                <Caption size={10}>
                  Member since {memberSince}
                  {u.communityName ? ` · ${u.communityName}` : ""}
                </Caption>
              </div>
            </div>
          </div>

          {/* SPECIALTIES */}
          <div className="flex flex-wrap gap-1.5">
            {specialties.map((s) => (
              <span
                key={s}
                className="font-sans px-2 py-1"
                style={{
                  borderRadius: 999,
                  background: rgba(dirColor.rgb, 0.06),
                  border: `1px solid ${rgba(dirColor.rgb, 0.18)}`,
                  fontSize: 11,
                  fontWeight: 500,
                  color: rgba(dirColor.rgb, 0.92),
                  letterSpacing: "-0.005em",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* STAT LEDGER — 4 hero stats */}
      <GlassCard accentRgb={dirColor.rgb}>
        <div className="flex flex-col gap-4">
          <Eyebrow>Track Record</Eyebrow>
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            <ProfileStat
              label="Total Calls"
              value={`${calls}`}
              sub={`${wins}W · ${losses}L`}
            />
            <ProfileStat
              label="Accuracy"
              value={`${accuracy}%`}
              sub="last 90 days"
              color={accuracy >= 70 ? ACCENT.emerald.hex : VT.paper}
            />
            <ProfileStat
              label="Current Streak"
              value={`${streak}W`}
              sub={`best ${bestStreak}W`}
              color={streak >= 5 ? VT.amber : VT.paper}
            />
            <ProfileStat
              label="Avg R:R"
              value={avgRR}
              sub={`${points.toLocaleString()} pts`}
            />
          </div>
        </div>
      </GlassCard>

      {/* RECENT CALLS */}
      <GlassCard accentRgb={dirColor.rgb}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Recent Calls</Eyebrow>
            <Caption color={VT.ashSoft}>last 6</Caption>
          </div>
          <div className="flex flex-col">
            {recentCalls.map((c, i) => {
              const oc =
                c.outcome === "win"
                  ? { rgb: ACCENT.emerald.rgb, hex: ACCENT.emerald.hex, label: "WIN" }
                  : c.outcome === "loss"
                    ? { rgb: ACCENT.rose.rgb, hex: ACCENT.rose.hex, label: "LOSS" }
                    : { rgb: dirColor.rgb, hex: dirColor.hex, label: "LIVE" }
              const dirHex =
                c.direction === "LONG" ? ACCENT.emerald.hex : ACCENT.rose.hex
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 py-2.5"
                  style={{
                    borderBottom:
                      i === recentCalls.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    className="flex items-center gap-1 px-1.5"
                    style={{
                      borderRadius: 999,
                      background: rgba(oc.rgb, 0.1),
                      border: `1px solid ${rgba(oc.rgb, 0.22)}`,
                      height: 18,
                    }}
                  >
                    <Eyebrow size={8} color={oc.hex}>
                      {oc.label}
                    </Eyebrow>
                  </div>
                  <span
                    className="font-sans tabular-nums"
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: VT.paper,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {c.symbol}
                  </span>
                  {c.direction === "LONG" ? (
                    <ArrowUpRight
                      size={11}
                      strokeWidth={1.8}
                      style={{ color: dirHex }}
                    />
                  ) : (
                    <ArrowDownRight
                      size={11}
                      strokeWidth={1.8}
                      style={{ color: dirHex }}
                    />
                  )}
                  <div className="flex-1" />
                  <Caption color={VT.ashSoft} size={10}>
                    {c.rr}
                  </Caption>
                  <Caption color={VT.ashGhost} size={9.5}>
                    {c.ago}
                  </Caption>
                </div>
              )
            })}
          </div>
        </div>
      </GlassCard>

      {/* ACTIVITY */}
      <GlassCard accentRgb={dirColor.rgb}>
        <div className="flex flex-col gap-4">
          <Eyebrow>Activity</Eyebrow>
          <div className="grid grid-cols-3 gap-3">
            <ActivityCell
              icon={Trophy}
              value={`${wins}`}
              label="wins"
              rgb={ACCENT.emerald.rgb}
            />
            <ActivityCell
              icon={Zap}
              value={`${calls}`}
              label="posted"
              rgb={dirColor.rgb}
            />
            <ActivityCell
              icon={Award}
              value={`${(seed % 50) + 5}`}
              label="endorsed"
              rgb={VT.purpleRgb}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function ProfileStat({
  label,
  value,
  sub,
  color = VT.paper,
}: {
  label: string
  value: string
  sub: string
  color?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow size={9}>{label}</Eyebrow>
      <StatNumber value={value} size={26} color={color} />
      <Caption color={VT.ashSoft}>{sub}</Caption>
    </div>
  )
}

function ActivityCell({
  icon: Icon,
  value,
  label,
  rgb,
}: {
  icon: LucideIcon
  value: string
  label: string
  rgb: string
}) {
  return (
    <div
      className="flex flex-col gap-1.5 p-3"
      style={{
        borderRadius: 12,
        background: rgba(rgb, 0.05),
        border: `1px solid ${rgba(rgb, 0.14)}`,
      }}
    >
      <Icon size={11} strokeWidth={1.7} style={{ color: rgba(rgb, 0.85) }} />
      <StatNumber value={value} size={20} color={rgba(rgb, 0.95)} />
      <Caption color={VT.ashSoft}>{label}</Caption>
    </div>
  )
}

/* ═══════════════════════════════���══��═════════════════════════════════════
   PANEL ERROR BOUNDARY
   ─────────────────────────────────────────────────���──────────────────────
   Contains any render error from a child section so the host dashboard
   does NOT black-screen when the user clicks a forecast card. Renders an
   inline diagnostic panel so the user can read the error AND continue
   using the rest of the surface (the close button on the inline detail
   header still works because it lives in the host, outside this boundary).
   ═══════════════════════════════════��════════════════════════════════════ */
class PanelErrorBoundary extends Component<
  { forecastId: string; children: ReactNode },
  { error: Error | null; componentStack: string | null }
> {
  state = { error: null as Error | null, componentStack: null as string | null }

  static getDerivedStateFromError(error: Error) {
    return { error, componentStack: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the dev console with a clear v0 tag so the source is obvious.
    console.error("[v0] ForecastIntelligencePanel crashed:", error, info)
    this.setState({ componentStack: info.componentStack ?? null })
  }

  componentDidUpdate(prevProps: { forecastId: string }) {
    // Reset on forecast change so swapping cards isn't permanently broken
    // by a single bad payload.
    if (prevProps.forecastId !== this.props.forecastId && this.state.error) {
      this.setState({ error: null, componentStack: null })
    }
  }

  render() {
    if (this.state.error) {
      const e = this.state.error
      const componentStack = this.state.componentStack
      // Try to identify the failing section by scanning the component stack
      // for one of our known section names.
      const SECTION_NAMES = [
        "IdentitySource",
        "StatusCapsule",
        "ForecastExplainer",
        "LifecycleStory",
        "CommunityPulse",
        "RoleAwareActions",
        "ProfileView",
      ]
      const failingSection =
        componentStack
          ?.split("\n")
          .map((s) => s.trim().replace(/^at /, "").split(" ")[0])
          .find((name) => SECTION_NAMES.includes(name)) ?? null
      return (
        <div
          className="flex flex-col gap-3 m-6 p-5"
          style={{
            borderRadius: 14,
            background: rgba(VT.roseRgb, 0.06),
            border: `1px solid ${rgba(VT.roseRgb, 0.32)}`,
          }}
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} strokeWidth={1.8} style={{ color: VT.rose }} />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.2em",
                color: VT.rose,
              }}
            >
              Intelligence panel error
            </span>
          </div>
          <p className="font-sans" style={{ fontSize: 12.5, color: VT.paper, lineHeight: 1.5 }}>
            {e.message || "Unknown render error"}
          </p>
          {failingSection && (
            <p
              className="font-mono"
              style={{
                fontSize: 10.5,
                color: VT.amber,
                letterSpacing: "0.05em",
                lineHeight: 1.5,
              }}
            >
              Failing section: {failingSection}
            </p>
          )}
          {componentStack && (
            <pre
              className="font-mono"
              style={{
                fontSize: 9.5,
                color: VT.ashSoft,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 140,
                overflow: "auto",
                padding: 8,
                borderRadius: 8,
                background: "rgba(0,0,0,0.32)",
                border: `1px solid ${VT.ruleSoft}`,
              }}
            >
              {componentStack.split("\n").slice(0, 12).join("\n")}
            </pre>
          )}
          {e.stack && (
            <pre
              className="font-mono"
              style={{
                fontSize: 10,
                color: VT.ashSoft,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 200,
                overflow: "auto",
                padding: 10,
                borderRadius: 8,
                background: "rgba(0,0,0,0.32)",
                border: `1px solid ${VT.ruleSoft}`,
              }}
            >
              {e.stack.split("\n").slice(0, 8).join("\n")}
            </pre>
          )}
          <p className="font-sans" style={{ fontSize: 11, color: VT.ashSoft, lineHeight: 1.5 }}>
            The dashboard is fine — only this side panel failed to render. Close this forecast and try another, or share the message above with v0.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

/* ��═════════════════════════���══════════════════════════════════════════���══
   SECTION BOUNDARY — per-card guard so one section's crash doesn't blank
   the whole redesign. Failing sections become a compact inline notice
   while every other section keeps rendering with its original design.
   ════════════════════════════════════��═══════════════════════════════════ */
class SectionBoundary extends Component<
  { name: string; forecastId: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[v0] Section ${this.props.name} crashed:`, error, info)
  }
  componentDidUpdate(prev: { forecastId: string }) {
    if (prev.forecastId !== this.props.forecastId && this.state.error) {
      this.setState({ error: null })
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            borderRadius: 12,
            background: rgba(VT.roseRgb, 0.05),
            border: `1px dashed ${rgba(VT.roseRgb, 0.28)}`,
          }}
          role="alert"
        >
          <AlertTriangle
            size={11}
            strokeWidth={1.8}
            style={{ color: VT.rose, flexShrink: 0 }}
          />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.18em",
              color: VT.rose,
            }}
          >
            {this.props.name}
          </span>
          <span
            className="font-sans"
            style={{ fontSize: 11, color: VT.ashSoft, lineHeight: 1.4 }}
          >
            section failed to render — {this.state.error.message}
          </span>
        </div>
      )
    }
    return this.props.children
  }
}

/* ═════════════════════════��═══��═════════���═════════════════════════════��══
   PUBLIC ENTRY — switches between intelligence and profile views
   ══�����══════════════════════���══════════════════════════════════════════════ */
export function ForecastIntelligencePanel(props: ForecastIntelligencePanelProps) {
  const { forecast, dirColor, statusCfg, expiresIn, viewerRole = "trader" } = props
  const [view, setView] = useState<PanelView>("intelligence")

  // Reset to intelligence view when forecast changes
  useEffect(() => {
    setView("intelligence")
  }, [forecast.id])

  return (
    <aside
      className="flex-[42] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0.004) 100%)",
      }}
    >
      <PanelErrorBoundary forecastId={forecast.id}>
      <AnimatePresence mode="wait" initial={false}>
        {view === "intelligence" ? (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.28, ease: VT.easeOut }}
            className="flex flex-col"
            style={{ padding: 24, gap: 20 }}
          >
            {/* 1. Identity / Source */}
            <SectionBoundary name="Identity" forecastId={forecast.id}>
              <IdentitySource
                forecast={forecast}
                dirColor={dirColor}
                delay={0.0}
                onOpenProfile={() => setView("profile")}
              />
            </SectionBoundary>
            {/* 2. Status Capsule */}
            <SectionBoundary name="Status" forecastId={forecast.id}>
              <StatusCapsule
                forecast={forecast}
                dirColor={dirColor}
                statusCfg={statusCfg}
                expiresIn={expiresIn}
                delay={0.05}
              />
            </SectionBoundary>
            {/* 3 + 4. Forecast Explainer — human-first reading card that
                 translates the trade idea into plain English first, then
                 reveals proof / weakness / technical logic on demand. */}
            <SectionBoundary name="Explainer" forecastId={forecast.id}>
              <ForecastExplainer
                forecast={forecast}
                dirColor={dirColor}
                delay={0.1}
              />
            </SectionBoundary>
            {/* 5. Lifecycle Story */}
            <SectionBoundary name="Lifecycle" forecastId={forecast.id}>
              <LifecycleStory
                forecast={forecast}
                dirColor={dirColor}
                delay={0.2}
              />
            </SectionBoundary>
            {/* 6. Community Pulse */}
            <SectionBoundary name="Community" forecastId={forecast.id}>
              <CommunityPulse
                forecast={forecast}
                dirColor={dirColor}
                delay={0.25}
              />
            </SectionBoundary>
            {/* 7. Role-Aware Actions */}
            <SectionBoundary name="Actions" forecastId={forecast.id}>
              <RoleAwareActions viewerRole={viewerRole} delay={0.3} />
            </SectionBoundary>
          </motion.div>
        ) : (
          <ProfileView
            forecast={forecast}
            dirColor={dirColor}
            onBack={() => setView("intelligence")}
          />
        )}
      </AnimatePresence>
      </PanelErrorBoundary>
    </aside>
  )
}
