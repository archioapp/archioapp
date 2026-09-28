"use client"

/* ═════════════════════════════════════════════════════════════════════════
   <CommunityProfileTemplate />

   M06 · THE COLLECTIVE · Community Profile

   The deep-view surface. Opens when a card click in the Atlas (M05),
   a node-cluster click in Discover Ecosystems (M04), or a natural-
   language intent ("Open London Precision Lab") resolves to a single
   community. Renders nine zones, vertically stacked, all mono Vantary:

     1. Hero  — segment watermark + name + tagline + region + visibility
                + verified state pill
     2. Live state band — when isLiveNow, an amber pulse strip with the
                live session title and attendee count
     3. Six-column metric strip — Members · Active · Weekly activity
                · Posts/wk · Win rate · Avg R:R
     4. Weekly heatmap rail — 7 segments Mon→Sun with the activity score
                above and the day label below each
     5. Asset share rail — re-uses the same 4-pair distribution from
                the Atlas card so the Profile tells one consistent story
     6. Who-is-for / Who-is-not-for matrix — two-column prose preserved
                verbatim from the source
     7. AI model description block — when has_archio_ai_models, the
                full ai_models_description in a mono-quoted block
     8. Mentor manifest — every entry of community.mentors as a row
                card with rating, students, years, specialty chips
     9. Tag forest — the tags array as small mono pills
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  Compass,
  Eye,
  EyeOff,
  Hash,
  LayoutGrid,
  MapPin,
  Quote,
  Star,
  X,
} from "lucide-react"

import { VANTARY, EASE_V } from "../../vantary-theme"
import { FdCorners, FdDashedRule } from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"
import {
  MOCK_COMMUNITIES,
  ASSET_WATERMARK_LABEL,
  COMMUNITY_PILL_LABELS,
  type Community,
  type CommunityMentor,
} from "../communities-source"
import {
  IconAiModels,
  IconLiveCalls,
  IconDashboard,
  IconVerified,
  IconLivePulse,
  IconMember,
  IconGrowth,
  IconCheckTick,
} from "../communities-icons"

/* ─────────────────────────────────────────────────────────────────────
   Layout constants
   ─────────────────────────────────────────────────────────────────── */

const HEATMAP_SEGMENTS = 7   // days Mon→Sun
const HEATMAP_HEIGHT = 56    // px
const METRIC_ROWS = 6        // strip cells

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const

/* ─────────────────────────────────────────────────────────────────────
   Public props
   ─────────────────────────────────────────────────────────────────── */

export interface CommunityProfileTemplateProps {
  /** Community id to render (matches Community.id). When omitted the
   *  template falls back to the first MOCK_COMMUNITIES entry so the
   *  Profile destination still tells a useful story when opened
   *  without params (e.g. via the cockpit click path). */
  communityId?: string
  /** Community slug — alternative resolver. Slug wins if both are set. */
  communitySlug?: string
  /** Echo of the raw NL query if relevant. */
  rawQuery?: string
  /** Optional resolver hint. */
  resolverNote?: string
  /** Inter-template dispatcher. */
  openTemplate?: (id: string, params?: Record<string, unknown>) => void
  /** Drill-forward suggestions sourced from the registry. */
  drillForward?: readonly DrillForwardSuggestion[]
  onClose?: () => void
  onPin?: () => void
  pinned?: boolean
}

/* ─────────────────────────────────────────────────────────────────────
   <CommunityProfileTemplate />
   ─────────────────────────────────────────────────────────────────── */

export function CommunityProfileTemplate({
  communityId,
  communitySlug,
  rawQuery,
  resolverNote,
  openTemplate,
  drillForward,
  onClose,
  onPin,
  pinned,
}: CommunityProfileTemplateProps) {
  const reduce = useReducedMotion()

  /* ── Resolve the community ─────────────────────────────────────────
     Priority: slug > id > first entry. The fallback ensures the
     Profile destination always renders something useful — it never
     dead-ends on an unknown id. */
  const community = React.useMemo<Community>(() => {
    if (communitySlug) {
      const bySlug = MOCK_COMMUNITIES.find((c) => c.slug === communitySlug)
      if (bySlug) return bySlug
    }
    if (communityId) {
      const byId = MOCK_COMMUNITIES.find((c) => c.id === communityId)
      if (byId) return byId
    }
    return MOCK_COMMUNITIES[0]
  }, [communityId, communitySlug])

  /* ── Inter-template dispatchers ───────────────────────────────── */
  const handleBackToAtlas = React.useCallback(() => {
    openTemplate?.("collective.community-atlas", {})
  }, [openTemplate])
  const handleOpenRadial = React.useCallback(() => {
    openTemplate?.("collective.discover-ecosystems", {})
  }, [openTemplate])
  const handleCompareCurrent = React.useCallback(() => {
    // Fires when "Compare to my current ecosystem" is clicked. We hand
    // the Atlas the slug so it can pre-pin the card.
    openTemplate?.("collective.community-atlas", {
      compareSlug: community.slug,
    })
  }, [openTemplate, community.slug])

  /* ── Subheadline derivation ───────────────────────────────────── */
  const subheadline = rawQuery
    ? `Resolved from "${rawQuery}".`
    : community.tagline

  /* ── Aggregate metrics for the six-column strip ───────────────── */
  const metrics = React.useMemo(
    () =>
      [
        {
          label: "MEMBERS",
          value: community.membersCount.toLocaleString(),
          glyph: <IconMember size={11} intensity="hover" />,
          tone: "amber" as const,
        },
        {
          label: "ACTIVE",
          value: community.activeMembers.toLocaleString(),
          glyph: <IconLivePulse size={11} intensity="hover" />,
          tone: "amber" as const,
        },
        {
          label: "WEEKLY ACTIVITY",
          value: `${community.weeklyActivity}%`,
          glyph: <IconCheckTick size={11} intensity="hover" />,
          tone: "amber" as const,
        },
        {
          label: "POSTS/WK",
          value: community.postsPerWeek.toLocaleString(),
          glyph: <IconGrowth size={11} intensity="hover" />,
          tone: "amber" as const,
        },
        {
          label: "WIN RATE",
          value: `${community.winRate}%`,
          glyph: null,
          tone: "amber" as const,
        },
        {
          label: "AVG R:R",
          value: `${community.avgRR.toFixed(1)}R`,
          glyph: null,
          tone: "amber" as const,
        },
      ] as const,
    [community],
  )

  /* ── Inputs / Resolver / Render-plan zones ────────────────────── */
  const inputsNode = (
    <ProfileInputs
      community={community}
      onBackToAtlas={handleBackToAtlas}
      onOpenRadial={handleOpenRadial}
      onCompareCurrent={handleCompareCurrent}
    />
  )

  const resolverNode = (
    <ProfileResolver
      community={community}
      metrics={metrics}
      resolverNote={resolverNote}
    />
  )

  const renderPlanNode = (
    <ProfileRenderPlan community={community} reduce={!!reduce} />
  )

  /* ──────────────────────────────────────────────────────────────────── */
  return (
    <TemplateShell
      id="collective.community-profile"
      eyebrow={`THE COLLECTIVE · PROFILE · ${
        community.verified ? "VERIFIED" : "LIVE"
      }`}
      routeId="C-PRF"
      headline={community.name}
      subheadline={subheadline}
      prelude={
        <span>
          Deep view of{" "}
          <em style={{ color: VANTARY.paper, fontStyle: "normal" }}>
            {community.name}
          </em>{" "}
          — segment watermark, live state, six-column metric strip, weekly
          heatmap, who-is-for matrix, AI model description, and the full
          mentor manifest.{" "}
          <em style={{ color: VANTARY.paper, fontStyle: "normal" }}>
            Decide
          </em>{" "}
          whether this ecosystem maps onto how you actually trade today.
        </span>
      }
      inputs={inputsNode}
      resolver={resolverNode}
      renderPlan={renderPlanNode}
      sources={[
        "EcosystemRegistry",
        "MentorVault",
        "ProofOfEdge",
        "BrokerLedger",
      ]}
      lastRefreshed={community.isLiveNow ? "live now" : "streaming"}
      state="ready"
      drillForward={drillForward}
      onClose={onClose}
      onPin={onPin}
      pinned={pinned}
    />
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 3 · INPUTS  — top control rail
   Three actions: back to atlas, open radial, compare to current.
   ═════════════════════════════════════════════════════════════════════════ */

function ProfileInputs({
  community,
  onBackToAtlas,
  onOpenRadial,
  onCompareCurrent,
}: {
  community: Community
  onBackToAtlas: () => void
  onOpenRadial: () => void
  onCompareCurrent: () => void
}) {
  return (
    <div className="px-5 py-4">
      <div
        className="flex items-center gap-2 flex-wrap"
        role="toolbar"
        aria-label="Community Profile actions"
      >
        <ProfileChipButton
          icon={<ArrowLeft size={11} strokeWidth={1.5} />}
          label="BACK TO ATLAS"
          onClick={onBackToAtlas}
        />
        <ProfileChipButton
          icon={<Compass size={11} strokeWidth={1.5} />}
          label="OPEN RADIAL"
          onClick={onOpenRadial}
        />
        <ProfileChipButton
          icon={<LayoutGrid size={11} strokeWidth={1.5} />}
          label="COMPARE TO CURRENT"
          onClick={onCompareCurrent}
          accent
        />

        {/* Spacer */}
        <div className="flex-1 hidden md:block" />

        {/* Right-aligned visibility marker */}
        <ProfileVisibilityMarker visibility={community.visibility} />
      </div>
    </div>
  )
}

function ProfileChipButton({
  icon,
  label,
  onClick,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums transition-colors"
      style={{
        fontSize: 9,
        letterSpacing: "0.22em",
        color: accent ? VANTARY.amber : VANTARY.paper,
        background: accent ? VANTARY.amberWash : VANTARY.glass,
        border: `1px solid ${accent ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
        padding: "6px 10px",
        height: 26,
      }}
    >
      <span
        style={{
          color: accent ? VANTARY.amber : VANTARY.ashSoft,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  )
}

function ProfileVisibilityMarker({
  visibility,
}: {
  visibility: Community["visibility"]
}) {
  const isPaid = visibility === "paid"
  return (
    <div
      className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums"
      style={{
        fontSize: 9,
        letterSpacing: "0.24em",
        color: VANTARY.ashSoft,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
        padding: "5px 9px",
        height: 26,
      }}
      aria-label={`Visibility ${visibility}`}
    >
      {isPaid ? (
        <Eye size={10} strokeWidth={1.5} />
      ) : (
        <EyeOff size={10} strokeWidth={1.5} />
      )}
      VISIBILITY · {visibility.toUpperCase()}
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 4 · RESOLVER — hero band, live pulse, metric strip, heatmap rail
   ═════════════════════════════════════════════════════════════════════════ */

interface MetricCell {
  readonly label: string
  readonly value: string
  readonly glyph: React.ReactNode
  readonly tone: "amber"
}

function ProfileResolver({
  community,
  metrics,
  resolverNote,
}: {
  community: Community
  metrics: readonly MetricCell[]
  resolverNote?: string
}) {
  return (
    <div className="px-5 py-4">
      {/* ── Hero band ─────────────────────────────────────────────── */}
      <ProfileHeroBand community={community} />

      {/* ── Live pulse band (conditional) ──────────────────────────── */}
      {community.isLiveNow && <ProfileLiveBand community={community} />}

      {/* ── Six-column metric strip ────────────────────────────────── */}
      <MetricStrip metrics={metrics} />

      {/* ── Weekly heatmap rail ─────────────────────────────────────── */}
      <WeeklyHeatmapRail community={community} />

      {/* Resolver note (optional) */}
      {resolverNote && (
        <div
          className="mt-3 font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
          }}
        >
          {resolverNote}
        </div>
      )}
    </div>
  )
}

/* ── Hero band ─────────────────────────────────────────────────────── */

function ProfileHeroBand({ community }: { community: Community }) {
  const watermark = ASSET_WATERMARK_LABEL[community.assetClass]
  return (
    <div
      className="relative overflow-hidden"
      style={{
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 6,
        background: VANTARY.glass,
        height: 144,
      }}
    >
      <FdCorners />

      {/* Watermark — large, dashed, low opacity */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-end pr-6 font-serif"
        style={{
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: VANTARY.ruleSoft,
          opacity: 0.32,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        {watermark}
      </div>

      {/* Foreground content */}
      <div className="relative h-full flex items-end p-5">
        <div className="flex-1 min-w-0">
          {/* Eyebrow strip */}
          <div
            className="font-mono uppercase tabular-nums flex items-center gap-2"
            style={{
              fontSize: 9,
              letterSpacing: "0.28em",
              color: VANTARY.amber,
            }}
          >
            <span>{COMMUNITY_PILL_LABELS.assetClass[community.assetClass]}</span>
            <span style={{ color: VANTARY.rule }}>·</span>
            <span>
              {COMMUNITY_PILL_LABELS.tradingStyle[community.tradingStyle]}
            </span>
            <span style={{ color: VANTARY.rule }}>·</span>
            <span>
              {COMMUNITY_PILL_LABELS.session[community.sessionFocus]}
            </span>
          </div>

          {/* Name */}
          <h1
            className="font-serif mt-1 text-pretty"
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: VANTARY.paper,
              lineHeight: 1.15,
            }}
          >
            {community.name}
          </h1>

          {/* Tagline */}
          <p
            className="text-pretty mt-1 max-w-[640px]"
            style={{
              fontSize: 12.5,
              color: VANTARY.ash,
              lineHeight: 1.55,
            }}
          >
            {community.tagline}
          </p>
        </div>

        {/* Right-aligned trust + region stack */}
        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
          {community.verified && <ProfileVerifiedBadge />}
          <ProfileRegionPill region={community.regionStamp} />
          <ProfileGrowthChip chip={community.growthChip} />
        </div>
      </div>
    </div>
  )
}

function ProfileVerifiedBadge() {
  return (
    <div
      className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums"
      style={{
        fontSize: 9,
        letterSpacing: "0.24em",
        color: VANTARY.amber,
        background: VANTARY.amberWash,
        border: `1px solid ${VANTARY.amberHalo}`,
        borderRadius: 4,
        padding: "4px 8px",
      }}
    >
      <IconVerified size={10} intensity="active" />
      VERIFIED
    </div>
  )
}

function ProfileRegionPill({ region }: { region: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums"
      style={{
        fontSize: 9,
        letterSpacing: "0.24em",
        color: VANTARY.ashSoft,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
        padding: "4px 8px",
      }}
    >
      <MapPin size={10} strokeWidth={1.5} />
      {region}
    </div>
  )
}

function ProfileGrowthChip({ chip }: { chip: string }) {
  const trimmed = chip.trim()
  const positive = trimmed.length > 0 && !trimmed.startsWith("-")
  return (
    <div
      className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums"
      style={{
        fontSize: 9,
        letterSpacing: "0.24em",
        color: positive ? VANTARY.amber : VANTARY.ashSoft,
        background: positive ? VANTARY.amberWash : "transparent",
        border: `1px solid ${positive ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
        padding: "4px 8px",
      }}
    >
      <IconGrowth size={10} intensity={positive ? "active" : "idle"} />
      {trimmed || "FLAT"}
    </div>
  )
}

/* ── Live pulse band ───────────────────────────────────────────────── */

function ProfileLiveBand({ community }: { community: Community }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE_V }}
      className="relative mt-3 overflow-hidden"
      style={{
        border: `1px solid ${VANTARY.amberHalo}`,
        borderRadius: 6,
        background: VANTARY.amberWash,
        padding: "10px 14px",
      }}
      role="status"
      aria-live="polite"
    >
      <FdCorners />

      <div className="flex items-center gap-3 flex-wrap">
        {/* Pulse marker */}
        <div className="relative inline-flex items-center justify-center" style={{ width: 16, height: 16 }}>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: VANTARY.amber }}
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.8, 1.05, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="relative rounded-full"
            style={{
              width: 6,
              height: 6,
              background: VANTARY.amber,
            }}
          />
        </div>

        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.30em",
            color: VANTARY.amber,
          }}
        >
          LIVE NOW
        </span>

        <span
          style={{
            fontSize: 12,
            color: VANTARY.paper,
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {community.liveSessionTitle ?? "Live mentor session"}
        </span>

        <div className="flex-1" />

        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
          }}
        >
          {(community.liveAttendeeCount ?? 0).toLocaleString()} ATTENDING
        </span>
      </div>
    </motion.div>
  )
}

/* ── Six-column metric strip ──────────────────────────────────────── */

function MetricStrip({ metrics }: { metrics: readonly MetricCell[] }) {
  return (
    <div
      className="mt-3 grid"
      style={{
        gridTemplateColumns: `repeat(${METRIC_ROWS}, minmax(0, 1fr))`,
        gap: 1,
        background: VANTARY.rule,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex flex-col items-start gap-1 px-3 py-3"
          style={{ background: VANTARY.ink }}
        >
          <div
            className="font-mono uppercase tabular-nums flex items-center gap-1.5"
            style={{
              fontSize: 8,
              letterSpacing: "0.26em",
              color: VANTARY.ashSoft,
            }}
          >
            {m.glyph}
            {m.label}
          </div>
          <div
            className="font-serif tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: VANTARY.amber,
              lineHeight: 1,
            }}
          >
            {m.value}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Weekly heatmap rail ──────────────────────────────────────────── */

function WeeklyHeatmapRail({ community }: { community: Community }) {
  const max = Math.max(...community.weeklyHeatmap, 1)

  return (
    <div className="mt-3">
      <div
        className="font-mono uppercase tabular-nums mb-1.5 flex items-center justify-between"
        style={{
          fontSize: 8,
          letterSpacing: "0.26em",
          color: VANTARY.ashSoft,
        }}
      >
        <span>WEEKLY HEATMAP · ACTIVITY 0–100</span>
        <span style={{ color: VANTARY.amber }}>
          PEAK · {Math.max(...community.weeklyHeatmap)}
        </span>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${HEATMAP_SEGMENTS}, minmax(0, 1fr))`,
          gap: 1,
          background: VANTARY.rule,
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {community.weeklyHeatmap.map((value, i) => {
          const fillRatio = value / max
          return (
            <div
              key={i}
              className="flex flex-col items-stretch justify-end relative"
              style={{
                background: VANTARY.ink,
                height: HEATMAP_HEIGHT,
              }}
              aria-label={`${DAY_LABELS[i]} activity ${value}`}
              role="img"
            >
              {/* Score above the fill */}
              <span
                className="absolute top-1 right-1.5 font-mono tabular-nums"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  color: VANTARY.ashSoft,
                }}
              >
                {value}
              </span>

              {/* Fill bar */}
              <div
                style={{
                  height: `${fillRatio * 100}%`,
                  background: VANTARY.amberWash,
                  borderTop: `1px solid ${VANTARY.amberHalo}`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Day labels under the rail */}
      <div
        className="grid mt-1"
        style={{
          gridTemplateColumns: `repeat(${HEATMAP_SEGMENTS}, minmax(0, 1fr))`,
          gap: 1,
        }}
      >
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="font-mono uppercase tabular-nums text-center"
            style={{
              fontSize: 8,
              letterSpacing: "0.22em",
              color: VANTARY.ashSoft,
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   ZONE 5 · RENDER PLAN  — asset shares, who-is-for, AI model, mentors, tags
   ═════════════════════════════════════════════════════════════════════════ */

function ProfileRenderPlan({
  community,
  reduce,
}: {
  community: Community
  reduce: boolean
}) {
  return (
    <div className="px-5 py-4">
      {/* ── Asset share rail ──────────────────────────────────────── */}
      <ProfileAssetShareRail community={community} />

      <FdDashedRule />

      {/* ── Who-is-for / Who-is-not-for matrix ────────────────────── */}
      <ProfileMatrix community={community} />

      {/* ── AI model description (conditional) ────────────────────── */}
      {community.hasArchioAi && community.aiModelsDescription && (
        <>
          <FdDashedRule />
          <ProfileAiBlock community={community} />
        </>
      )}

      <FdDashedRule />

      {/* ── Mentor manifest ───────────────────────────────────────── */}
      <ProfileMentorManifest community={community} reduce={reduce} />

      <FdDashedRule />

      {/* ── Capability bar ────────────────────────────────────────── */}
      <ProfileCapabilityBar community={community} />

      {/* ── Tag forest ────────────────────────────────────────────── */}
      <ProfileTagForest community={community} />
    </div>
  )
}

/* ── Asset share rail ──────────────────────────────────────────────── */

function ProfileAssetShareRail({ community }: { community: Community }) {
  return (
    <div>
      <div
        className="font-mono uppercase tabular-nums mb-2 flex items-center justify-between"
        style={{
          fontSize: 9,
          letterSpacing: "0.26em",
          color: VANTARY.ashSoft,
        }}
      >
        <span>ASSET DISTRIBUTION</span>
        <span style={{ color: VANTARY.amber }}>
          {community.regionStamp}
        </span>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 1,
          background: VANTARY.rule,
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {community.assetShares.map((slice) => (
          <div
            key={slice.symbol}
            className="px-3 py-3 flex flex-col gap-2"
            style={{ background: VANTARY.ink }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.20em",
                  color: VANTARY.paper,
                }}
              >
                {slice.symbol}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{
                  fontSize: 11,
                  color: VANTARY.amber,
                  fontWeight: 600,
                }}
              >
                {slice.share}%
              </span>
            </div>

            <div
              style={{
                height: 3,
                background: VANTARY.glass,
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${slice.share}%`,
                  height: "100%",
                  background: VANTARY.amber,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Who-is-for / Who-is-not-for matrix ────────────────────────────── */

function ProfileMatrix({ community }: { community: Community }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
      <MatrixCell
        polarity="for"
        title="Who this is for"
        body={community.whoIsFor}
      />
      <MatrixCell
        polarity="not"
        title="Who this is not for"
        body={community.whoIsNotFor}
      />
    </div>
  )
}

function MatrixCell({
  polarity,
  title,
  body,
}: {
  polarity: "for" | "not"
  title: string
  body: string
}) {
  const positive = polarity === "for"
  return (
    <div
      className="relative"
      style={{
        border: `1px solid ${positive ? VANTARY.amberHalo : VANTARY.rule}`,
        background: positive ? VANTARY.amberWash : VANTARY.glass,
        borderRadius: 6,
        padding: 14,
      }}
    >
      <FdCorners />

      <div className="flex items-center gap-2 mb-2">
        <div
          className="inline-flex items-center justify-center"
          style={{
            width: 18,
            height: 18,
            border: `1px solid ${positive ? VANTARY.amberHalo : VANTARY.rule}`,
            background: positive ? VANTARY.amber : "transparent",
            color: positive ? VANTARY.ink : VANTARY.ashSoft,
            borderRadius: 3,
          }}
        >
          {positive ? (
            <Check size={11} strokeWidth={2.2} />
          ) : (
            <X size={11} strokeWidth={2.2} />
          )}
        </div>
        <h3
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: "0.26em",
            color: positive ? VANTARY.amber : VANTARY.paper,
          }}
        >
          {title}
        </h3>
      </div>

      <p
        className="text-pretty"
        style={{
          fontSize: 12,
          color: VANTARY.ash,
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>
    </div>
  )
}

/* ── AI model block ────────────────────────────────────────────────── */

function ProfileAiBlock({ community }: { community: Community }) {
  return (
    <div
      className="relative mt-1"
      style={{
        border: `1px solid ${VANTARY.rule}`,
        background: VANTARY.glass,
        borderRadius: 6,
        padding: 16,
      }}
    >
      <FdCorners />

      <div className="flex items-start gap-3">
        <div
          className="shrink-0 inline-flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            border: `1px solid ${VANTARY.amberHalo}`,
            background: VANTARY.amberWash,
            borderRadius: 4,
          }}
          aria-hidden="true"
        >
          <IconAiModels size={18} intensity="active" />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-mono uppercase tabular-nums flex items-center gap-2"
            style={{
              fontSize: 9,
              letterSpacing: "0.26em",
              color: VANTARY.amber,
            }}
          >
            <span>AI MODEL · ARCHIO AI</span>
            <span style={{ color: VANTARY.rule }}>·</span>
            <span>{community.name.toUpperCase()}</span>
          </div>

          <div className="relative mt-2">
            <Quote
              size={14}
              strokeWidth={1.4}
              className="absolute -left-1 -top-1"
              style={{ color: VANTARY.amberHalo }}
              aria-hidden="true"
            />
            <p
              className="pl-4 text-pretty"
              style={{
                fontSize: 13,
                color: VANTARY.paper,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              {community.aiModelsDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Mentor manifest ───────────────────────────────────────────────── */

function ProfileMentorManifest({
  community,
  reduce,
}: {
  community: Community
  reduce: boolean
}) {
  return (
    <div>
      <div
        className="font-mono uppercase tabular-nums mb-3 flex items-center justify-between"
        style={{
          fontSize: 9,
          letterSpacing: "0.28em",
          color: VANTARY.amber,
        }}
      >
        <span>MENTOR MANIFEST · {community.mentors.length} ACTIVE</span>
        <span style={{ color: VANTARY.ashSoft }}>
          ROUTE · M-MAN
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {community.mentors.map((mentor, i) => (
          <MentorRow key={mentor.id} mentor={mentor} reduce={reduce} index={i} />
        ))}
      </div>
    </div>
  )
}

function MentorRow({
  mentor,
  reduce,
  index,
}: {
  mentor: CommunityMentor
  reduce: boolean
  index: number
}) {
  const monogram = mentor.displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        ease: EASE_V,
        delay: reduce ? 0 : Math.min(0.04 * index, 0.32),
      }}
      className="relative grid items-center"
      style={{
        gridTemplateColumns: "auto 1fr auto",
        gap: 14,
        border: `1px solid ${mentor.isLead ? VANTARY.amberHalo : VANTARY.rule}`,
        background: mentor.isLead ? VANTARY.amberWash : VANTARY.glass,
        borderRadius: 6,
        padding: 12,
      }}
    >
      <FdCorners />

      {/* Monogram */}
      <div
        className="inline-flex items-center justify-center font-serif tabular-nums shrink-0"
        style={{
          width: 44,
          height: 44,
          border: `1px solid ${mentor.isLead ? VANTARY.amber : VANTARY.rule}`,
          background: VANTARY.ink,
          color: mentor.isLead ? VANTARY.amber : VANTARY.paper,
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
        aria-hidden="true"
      >
        {monogram}
      </div>

      {/* Name + role + specialty chips */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-serif"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: VANTARY.paper,
              letterSpacing: "-0.005em",
            }}
          >
            {mentor.displayName}
          </span>

          {mentor.verified && (
            <span
              className="inline-flex items-center justify-center"
              aria-label="Verified mentor"
              title="Verified mentor"
            >
              <IconVerified size={12} intensity="active" />
            </span>
          )}

          {mentor.isLead && (
            <span
              className="inline-flex items-center font-mono uppercase tabular-nums"
              style={{
                fontSize: 8,
                letterSpacing: "0.30em",
                color: VANTARY.amber,
                background: VANTARY.amberWash,
                border: `1px solid ${VANTARY.amberHalo}`,
                borderRadius: 4,
                padding: "2px 6px",
              }}
            >
              LEAD
            </span>
          )}
        </div>

        <div
          className="mt-1 truncate"
          style={{
            fontSize: 11,
            color: VANTARY.ash,
            letterSpacing: "0.005em",
          }}
        >
          {mentor.title}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {mentor.specialties.map((s) => (
            <span
              key={s}
              className="inline-flex items-center font-mono uppercase tabular-nums"
              style={{
                fontSize: 8,
                letterSpacing: "0.20em",
                color: VANTARY.ashSoft,
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 999,
                padding: "2px 7px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right metrics — rating, students, years */}
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <div className="inline-flex items-center gap-1">
          <Star
            size={11}
            strokeWidth={1.6}
            style={{ color: VANTARY.amber }}
            fill={VANTARY.amber}
          />
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize: 11,
              color: VANTARY.amber,
              fontWeight: 600,
            }}
          >
            {mentor.rating.toFixed(1)}
          </span>
        </div>

        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.20em",
            color: VANTARY.ashSoft,
          }}
        >
          {mentor.totalStudents.toLocaleString()} STUDENTS
        </span>

        <span
          className="font-mono tabular-nums inline-flex items-center gap-1"
          style={{
            fontSize: 9,
            letterSpacing: "0.20em",
            color: VANTARY.ashSoft,
          }}
        >
          <Award size={10} strokeWidth={1.5} />
          {mentor.yearsExperience}Y
        </span>
      </div>
    </motion.div>
  )
}

/* ── Capability bar ────────────────────────────────────────────────── */

function ProfileCapabilityBar({ community }: { community: Community }) {
  const capabilities = [
    {
      label: "AI MODEL",
      value: community.hasArchioAi ? "ARCHIO AI" : "NONE",
      icon: <IconAiModels size={12} intensity={community.hasArchioAi ? "active" : "idle"} />,
      active: community.hasArchioAi,
    },
    {
      label: "LIVE CALLS",
      value: community.hasLiveCalls ? "AVAILABLE" : "NONE",
      icon: <IconLiveCalls size={12} intensity={community.hasLiveCalls ? "active" : "idle"} />,
      active: community.hasLiveCalls,
    },
    {
      label: "DASHBOARD",
      value: community.hasMentorDashboard ? "ANALYTICS" : "NONE",
      icon: <IconDashboard size={12} intensity={community.hasMentorDashboard ? "active" : "idle"} />,
      active: community.hasMentorDashboard,
    },
    {
      label: "TRUST",
      value: community.verified ? "VERIFIED" : "OPEN",
      icon: <IconVerified size={12} intensity={community.verified ? "active" : "idle"} />,
      active: community.verified,
    },
    {
      label: "ACCESS",
      value: community.beginnerFriendly ? "BEGINNER FRIENDLY" : "EXPERIENCED",
      icon: <IconCheckTick size={12} intensity={community.beginnerFriendly ? "active" : "idle"} />,
      active: community.beginnerFriendly,
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
      {capabilities.map((c) => (
        <div
          key={c.label}
          className="flex items-center gap-2 px-3 py-2"
          style={{
            background: c.active ? VANTARY.amberWash : VANTARY.glass,
            border: `1px solid ${c.active ? VANTARY.amberHalo : VANTARY.rule}`,
            borderRadius: 4,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            {c.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize: 8,
                letterSpacing: "0.26em",
                color: VANTARY.ashSoft,
              }}
            >
              {c.label}
            </div>
            <div
              className="font-mono uppercase tabular-nums truncate"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                color: c.active ? VANTARY.amber : VANTARY.paper,
                fontWeight: 600,
              }}
            >
              {c.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Tag forest ────────────────────────────────────────────────────── */

function ProfileTagForest({ community }: { community: Community }) {
  if (community.tags.length === 0) return null
  return (
    <div className="mt-4">
      <div
        className="font-mono uppercase tabular-nums mb-2"
        style={{
          fontSize: 9,
          letterSpacing: "0.26em",
          color: VANTARY.ashSoft,
        }}
      >
        TAG FOREST · {community.tags.length} TOPICS
      </div>

      <div className="flex flex-wrap gap-1.5">
        {community.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 font-mono uppercase tabular-nums"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: VANTARY.paper,
              border: `1px solid ${VANTARY.rule}`,
              borderRadius: 999,
              padding: "3px 9px",
              background: VANTARY.glass,
            }}
          >
            <Hash size={9} strokeWidth={1.6} style={{ color: VANTARY.ashSoft }} />
            {t}
          </span>
        ))}
      </div>

      {/* Final CTA — Join community */}
      <div className="mt-5">
        <ProfileJoinCta community={community} />
      </div>
    </div>
  )
}

function ProfileJoinCta({ community }: { community: Community }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("vt:flight-deck:community-join", {
              detail: { communityId: community.id, slug: community.slug },
            }),
          )
        }
      }}
      className="w-full inline-flex items-center justify-center gap-2 font-mono uppercase tabular-nums transition-colors"
      style={{
        fontSize: 11,
        letterSpacing: "0.30em",
        color: VANTARY.amber,
        background: VANTARY.amberWash,
        border: `1px solid ${VANTARY.amberHalo}`,
        borderRadius: 4,
        padding: "12px 14px",
        fontWeight: 600,
      }}
      aria-label={`Join ${community.name}`}
    >
      JOIN {community.name.toUpperCase()}
      <ArrowRight size={13} strokeWidth={1.5} />
    </button>
  )
}
