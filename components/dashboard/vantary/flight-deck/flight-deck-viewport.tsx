"use client"

/* ═════════════════════════════════════════════════════════════════════════
   <FlightDeckViewport />

   The single host that paints whichever flight-deck template is
   currently active. Renders inline above the TradingView chart in
   your-space.tsx so the trader never leaves the dashboard.

   Responsibilities:

     · Owns the activeTemplate / params state for the cockpit.
     · Bridges the click path (cockpit destination → setActiveTemplate)
       and the natural-language path (Oracle ⇒ MENTOR_COMPARE intent).
     · Renders an empty / "ready when you are" state when no template
       is active so the spot above the chart isn't a blank gap.
     · Routes "mentors.compare-mentors" to the marquee component;
       every other id renders inside <TemplateShell state="warming"/>.
     · Carries an in/out animation that respects EASE_V doctrine.

   Public API:

     · useFlightDeckViewport()     hook that returns
         { open, close, openWithIntent, activeId, params }
     · <FlightDeckViewport ... />  the visual surface
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Sparkles, X } from "lucide-react"

import { VANTARY, EASE_V } from "../vantary-theme"
import {
  FdCorners,
  FdRouteId,
  FdDashedRule,
} from "./flight-deck-primitives"
import { TemplateShell } from "./template-shell"
import { TEMPLATE_REGISTRY, getTemplateDescriptor } from "./template-registry"
import type {
  FlightDeckTemplateId,
  TemplateDescriptor,
} from "./template-types"
import { CompareMentorsTemplate } from "./templates/compare-mentors"
// MARKET FLOOR — templates for market observation.
import { ForecastRoomTemplate } from "./templates/forecast-room"
// THE COLLECTIVE — templates for ecosystem discovery.
import { CommunityHubTemplate } from "./templates/community-hub"
import { CompareEcosystemsTemplate } from "./templates/compare-ecosystems"
import { MyFitAnalysisTemplate } from "./templates/my-fit-analysis"
import { LiveActivityTemplate } from "./templates/live-activity"
import { WARMING_PREVIEWS } from "./templates/warming-previews"
import {
  parseMentorCompareIntent,
  type MentorCompareIntent,
} from "../oracle-data"
import { parseCommunitiesIntent } from "./communities-translate"
import { useFlightDeckReveal } from "../flight-deck-reveal"

/* ────────────────────────────────────────────────────────────────────────
   Hook — viewport state for the cockpit shell.
   Lives in the parent of FlightDeckViewport (e.g. JarvisWelcomeBand or
   your-space's main layout) so the cockpit destination buttons can
   call open(), and the Oracle classifier can call openWithIntent().
   ──────────────────────────────────────────────────────────────────── */

export type FlightDeckViewportParams = Record<string, unknown>

export interface FlightDeckViewportApi {
  activeId: FlightDeckTemplateId | null
  params: FlightDeckViewportParams
  open: (id: FlightDeckTemplateId, params?: FlightDeckViewportParams) => void
  openWithIntent: (intent: MentorCompareIntent) => void
  openFromQuery: (query: string) => boolean
  close: () => void
  pinned: Record<string, true>
  togglePin: (id: FlightDeckTemplateId) => void
}

export function useFlightDeckViewport(): FlightDeckViewportApi {
  const [activeId, setActiveId] = React.useState<FlightDeckTemplateId | null>(null)
  const [params, setParams] = React.useState<FlightDeckViewportParams>({})
  const [pinned, setPinned] = React.useState<Record<string, true>>({})

  const open = React.useCallback(
    (id: FlightDeckTemplateId, p?: FlightDeckViewportParams) => {
      setActiveId(id)
      setParams(p ?? {})
      // Defer scroll into view to next paint to avoid jank.
      requestAnimationFrame(() => {
        const el = document.querySelector("[data-fd-viewport]") as HTMLElement | null
        el?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    },
    [],
  )

  const close = React.useCallback(() => {
    setActiveId(null)
    setParams({})
  }, [])

  const openWithIntent = React.useCallback(
    (intent: MentorCompareIntent) => {
      if (!intent.detected) return
      open("mentors.compare-mentors", {
        mentorAId: intent.mentorAId,
        mentorBId: intent.mentorBId,
        resolverNote: intent.resolverNote,
        rawQuery: intent.rawQuery,
      })
    },
    [open],
  )

  const openFromQuery = React.useCallback(
    (query: string) => {
      // ── 1. Mentor-compare intent (highest priority — long-standing) ──
      const compareIntent = parseMentorCompareIntent(query)
      if (compareIntent.detected) {
        openWithIntent(compareIntent)
        return true
      }
      // ── 2. Communities intent — all routes now go to the hub ────────
      const communitiesIntent = parseCommunitiesIntent(query)
      if (communitiesIntent.detected) {
        open("collective.community-hub", {
          rawQuery: communitiesIntent.rawQuery,
          resolverNote: communitiesIntent.resolverNote,
        })
        return true
      }
      return false
    },
    [openWithIntent, open],
  )

  const togglePin = React.useCallback((id: FlightDeckTemplateId) => {
    setPinned((p) => {
      const next = { ...p }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }, [])

  return { activeId, params, open, openWithIntent, openFromQuery, close, pinned, togglePin }
}

/* ────────────────────────────────────────────────────────────────────────
   Context — share the viewport API across distant components.
   The cockpit destination buttons and the Oracle ask-bar both want to
   call open() / openFromQuery() but they live in different subtrees.
   The host wraps both subtrees in <FlightDeckViewportProvider> and the
   FlightDeckViewport itself renders BETWEEN them, all reading the same
   instance.
   ──────────────────────────────────────────────────────────────────── */

const FlightDeckViewportContext = React.createContext<FlightDeckViewportApi | null>(null)

export function FlightDeckViewportProvider({ children }: { children: React.ReactNode }) {
  const api = useFlightDeckViewport()
  const { setScrollLocked } = useFlightDeckReveal()

  /* ── Scroll-lock bridge ───────────────────────────────────────────────
     When a template is active, we lock the deck's scroll-to-close
     behaviour so the user can scroll inside the viewport/popup without
     the deck closing. The lock releases when the template closes.       */
  React.useEffect(() => {
    setScrollLocked(api.activeId !== null)
  }, [api.activeId, setScrollLocked])

  /* ── Cross-template navigation bridge listener ─────────────────────
     The Discover Ecosystems matched-rail and the Atlas card grid (and
     any future template drill-forward) dispatch a `vt:flight-deck:open`
     custom event so children don't need to drag the api context
     through their props. We install the listener once at provider
     mount and forward each event into api.open. The listener is
     idempotent because every open() in the api is itself idempotent.
  ──────────────────────────────────────────────────────────────────── */
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (ev: Event) => {
      const ce = ev as CustomEvent<{
        id: FlightDeckTemplateId
        params?: FlightDeckViewportParams
      }>
      if (!ce.detail?.id) return
      api.open(ce.detail.id, ce.detail.params)
    }
    window.addEventListener("vt:flight-deck:open", handler as EventListener)
    return () => {
      window.removeEventListener("vt:flight-deck:open", handler as EventListener)
    }
  }, [api])

  return (
    <FlightDeckViewportContext.Provider value={api}>
      {children}
    </FlightDeckViewportContext.Provider>
  )
}

/** Inside-the-tree hook. Returns null when no provider is mounted so
 *  callers can degrade gracefully (e.g. cockpit destinations remain
 *  no-ops if used in a context without the viewport). */
export function useFlightDeckViewportContext(): FlightDeckViewportApi | null {
  return React.useContext(FlightDeckViewportContext)
}

/** Convenience surface — paints the active template using the context
 *  API. Use this inline in your-space.tsx without threading props. */
export function FlightDeckViewportSurface({
  className,
  style,
  showIdleHint = false,
}: {
  className?: string
  style?: React.CSSProperties
  showIdleHint?: boolean
}) {
  const api = useFlightDeckViewportContext()
  if (!api) return null
  return (
    <FlightDeckViewport
      api={api}
      className={className}
      style={style}
      showIdleHint={showIdleHint}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Visual surface — paints the active template (or the empty state).
   ──────────────────────────────────────────────────────────────────── */

export interface FlightDeckViewportProps {
  api: FlightDeckViewportApi
  /** Optional class so callers can position the viewport in their grid. */
  className?: string
  /** Optional inline style. */
  style?: React.CSSProperties
  /** When true, an empty "ready when you are" card is shown while idle.
   *  Defaults to false — viewport collapses when no template is active so
   *  the trading desk sits flush against the cockpit above it. */
  showIdleHint?: boolean
}

export function FlightDeckViewport({
  api,
  className,
  style,
  showIdleHint = false,
}: FlightDeckViewportProps) {
  const { activeId, params, close, pinned, togglePin } = api

  return (
    <section
      data-fd-viewport
      data-fd-active={activeId ?? "idle"}
      aria-live="polite"
      aria-label="Flight deck destination viewport"
      className={`relative ${className ?? ""}`}
      style={style}
    >
      <AnimatePresence mode="wait" initial={false}>
        {activeId ? (
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.32, ease: EASE_V }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-5">
              <ActiveTemplate
                id={activeId}
                params={params}
                onClose={close}
                onPin={() => togglePin(activeId)}
                pinned={!!pinned[activeId]}
              />
            </div>
          </motion.div>
        ) : showIdleHint ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.32, ease: EASE_V }}
          >
            <ViewportIdleState />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ActiveTemplate — the runtime resolver for the registry.
   ──────────────────────────────────────────────────────────────────── */

function ActiveTemplate({
  id,
  params,
  onClose,
  onPin,
  pinned,
}: {
  id: FlightDeckTemplateId
  params: FlightDeckViewportParams
  onClose: () => void
  onPin: () => void
  pinned: boolean
}) {
  if (id === "mentors.compare-mentors") {
    return (
      <CompareMentorsTemplate
        initialMentorAId={params.mentorAId as string | undefined}
        initialMentorBId={params.mentorBId as string | undefined}
        resolverNote={params.resolverNote as string | undefined}
        rawQuery={params.rawQuery as string | undefined}
        onClose={onClose}
        onPin={onPin}
        pinned={pinned}
      />
    )
  }
  // ── MARKET FLOOR · Forecast Room ───────────────────────────────────
  // The full forecast hub with feed, my record, leaderboard, and archive.
  if (id === "market.forecast-room") {
    return (
      <ForecastRoomTemplate
        onClose={onClose}
        onPin={onPin}
        pinned={pinned}
      />
    )
  }
  // ── THE COLLECTIVE · Community Hub ─────────────────────────────────
  // The main communities explorer with radial finder, cards, inspector.
  if (id === "collective.community-hub") {
    const desc = getTemplateDescriptor(id)
    return (
      <CommunityHubTemplate
        drillForward={desc.drillForward}
        onClose={onClose}
        onPin={onPin}
        pinned={pinned}
      />
    )
  }
  // ── THE COLLECTIVE · Compare Ecosystems ─────────────────────────────
  // Side-by-side comparison of trading communities.
  if (id === "collective.compare-ecosystems") {
    const desc = getTemplateDescriptor(id)
    return (
      <CompareEcosystemsTemplate
        initialEcosystemASlug={params?.ecosystemA as string | undefined}
        initialEcosystemBSlug={params?.ecosystemB as string | undefined}
        resolverNote={params?.resolverNote as string | undefined}
        rawQuery={params?.rawQuery as string | undefined}
        onClose={onClose}
        onPin={onPin}
        pinned={pinned}
      />
    )
  }
  // ── THE COLLECTIVE · My Fit Analysis ───────────────────────────────
  // Trading style profiler with fit scores and recommendations.
  if (id === "collective.my-fit") {
    return (
      <MyFitAnalysisTemplate
        onClose={onClose}
        onPin={onPin}
        pinned={pinned}
      />
    )
  }
  // ── THE COLLECTIVE · Live Activity ─────────────────────────────────
  // Real-time activity feed showing what's happening across ecosystems.
  if (id === "collective.live-activity") {
    return (
      <LiveActivityTemplate
        onClose={onClose}
        onPin={onPin}
        pinned={pinned}
      />
    )
  }
  // All other destinations render inside the shared shell with the
  // polished warming body.
  const desc = getTemplateDescriptor(id)
  return <WarmingTemplate desc={desc} onClose={onClose} onPin={onPin} pinned={pinned} />
}

/* ── Cross-template navigation bridge ────────────────────────────────
   ActiveTemplate is a child of the viewport but doesn't directly own
   the dispatcher. We expose a tiny helper so child templates can ask
   the viewport to swap the active id without dragging the whole API
   context through their props. The provider below installs the
   matching `vt:flight-deck:open` event listener on mount.
─────────────────────────────────────────────────────────────────── */

/* The bridge accepts a wide `string` id (templates declare their
 * `openTemplate` callback as `(id: string, ...) => void` so they
 * don't have to import the union). The provider listener narrows
 * back to FlightDeckTemplateId before calling api.open. */
function openFromActiveTemplate(
  id: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent("vt:flight-deck:open", {
      detail: { id, params },
    }),
  )
}

function WarmingTemplate({
  desc,
  onClose,
  onPin,
  pinned,
}: {
  desc: TemplateDescriptor
  onClose: () => void
  onPin: () => void
  pinned: boolean
}) {
  const sources =
    "sources" in desc.sourceStatus ? desc.sourceStatus.sources : []

  // Pull warming-plan details if the descriptor uses a warming plan,
  // and any per-destination rich preview from the registry.
  const wPlan =
    desc.renderPlan.kind === "warming" ? desc.renderPlan : null
  const warmingPreview = WARMING_PREVIEWS[desc.id]

  return (
    <TemplateShell
      id={desc.id}
      eyebrow={desc.eyebrow}
      routeId={desc.routePrefix}
      headline={desc.destination}
      subheadline={desc.prelude}
      sources={sources}
      lastRefreshed="awaiting first feed"
      state="warming"
      warmingDetails={
        wPlan
          ? {
              destination: desc.destination,
              replaces: wPlan.replaces,
              decision: wPlan.decision,
              expectedSources: wPlan.expectedSources,
              railConnection: wPlan.railConnection,
              preview: warmingPreview,
            }
          : undefined
      }
      drillForward={desc.drillForward}
      onClose={onClose}
      onPin={onPin}
      pinned={pinned}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Idle state — rendered when no template is active.
   Three roles:
     · Reassure the trader the surface is "ready when you are"
     · Show four shortcut chips (one per room) that re-open quickly
     · Hint at the natural-language path through the Oracle pill
   ──────────────────────────────────────────────────────────────────── */

const ROOM_HINTS: {
  roomId: "market" | "studio" | "mentors" | "review"
  label: string
  routeId: string
  topDestination: string
  topId: FlightDeckTemplateId
  hint: string
}[] = [
  {
    roomId: "market",
    label: "MARKET FLOOR",
    routeId: "R-MK",
    topDestination: "Signal Room",
    topId: "market.signal-room",
    hint: "Live signals streaming from your followed mentors.",
  },
  {
    roomId: "studio",
    label: "THE STUDIO",
    routeId: "R-ST",
    topDestination: "Create Forecast",
    topId: "studio.create-forecast",
    hint: "Make something today — forecast, signal, journal, or setup.",
  },
  {
    roomId: "mentors",
    label: "MENTOR HALL",
    routeId: "R-MN",
    topDestination: "Compare Mentors",
    topId: "mentors.compare-mentors",
    hint: "Whose process should influence yours? Compare two side-by-side.",
  },
  {
    roomId: "review",
    label: "REVIEW ROOM",
    routeId: "R-RV",
    topDestination: "Today's Stats",
    topId: "review.todays-stats",
    hint: "Look at yourself — today, the week, and the month.",
  },
]

function ViewportIdleState() {
  return (
    <div
      className="relative px-5 py-5"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 6,
        backdropFilter: "blur(28px) saturate(150%)",
        WebkitBackdropFilter: "blur(28px) saturate(150%)",
      }}
    >
      <FdCorners />

      {/* Eyebrow strip */}
      <div className="flex items-center gap-3">
        <motion.span
          aria-hidden
          className="rounded-full"
          style={{
            width: 5,
            height: 5,
            background: VANTARY.amber,
            boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
          }}
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="font-mono uppercase select-none"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          FLIGHT DECK · VIEWPORT · IDLE
        </span>
        <FdDashedRule className="flex-1" />
        <FdRouteId id="VP-00" tone="neutral" />
      </div>

      {/* Headline */}
      <h3
        className="font-sans mt-4"
        style={{
          fontSize: 22,
          letterSpacing: "-0.018em",
          color: VANTARY.paper,
          fontWeight: 600,
          textWrap: "balance",
          maxWidth: 720,
        }}
      >
        Pick a destination, or just ask.
      </h3>
      <p
        className="font-sans mt-2"
        style={{
          fontSize: 13.5,
          color: VANTARY.ash,
          lineHeight: 1.55,
          maxWidth: 680,
          textWrap: "pretty",
        }}
      >
        Hover any room above and click a destination — the answer paints right
        here, above your charts. Or type your question into the bar above and
        the right template opens with your selection pre-filled.
      </p>

      {/* Room shortcut chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-5">
        {ROOM_HINTS.map((r) => (
          <RoomShortcutTile key={r.roomId} hint={r} />
        ))}
      </div>

      {/* NL path hint */}
      <div
        className="flex items-center gap-3 mt-4 px-4 py-3"
        style={{
          background: VANTARY.glassDeep,
          border: `1px dashed ${VANTARY.rule}`,
          borderRadius: 4,
        }}
      >
        <Sparkles size={13} strokeWidth={1.5} color={VANTARY.amber} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          TRY THE BAR
        </span>
        <span
          className="font-sans truncate"
          style={{
            fontSize: 13,
            color: VANTARY.ash,
            fontStyle: "italic",
          }}
        >
          {"\u201C"}Compare Picasso to Girard{"\u201D"}, or {"\u201C"}what was my biggest leak this
          week?{"\u201D"}
        </span>
      </div>
    </div>
  )
}

function RoomShortcutTile({
  hint,
}: {
  hint: (typeof ROOM_HINTS)[number]
}) {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative px-4 py-3"
      style={{
        background: hover ? VANTARY.amberWash : VANTARY.glassDeep,
        border: `1px solid ${hover ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <FdCorners inset={6} size={6} />
      <div className="flex items-center gap-2">
        <FdRouteId id={hint.routeId} tone={hover ? "active" : "neutral"} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            color: hover ? VANTARY.amber : VANTARY.ash,
            fontWeight: 600,
          }}
        >
          {hint.label}
        </span>
      </div>
      <div
        className="font-sans mt-1.5 truncate"
        style={{
          fontSize: 12.5,
          color: VANTARY.paper,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {hint.topDestination}
        <ChevronRight
          size={11}
          strokeWidth={1.5}
          color={hover ? VANTARY.amber : VANTARY.ashSoft}
          style={{ display: "inline", marginLeft: 4, verticalAlign: "middle" }}
        />
      </div>
      <div
        className="font-sans mt-0.5"
        style={{
          fontSize: 11.5,
          color: VANTARY.ashSoft,
          lineHeight: 1.4,
          textWrap: "pretty",
        }}
      >
        {hint.hint}
      </div>
    </div>
  )
}
