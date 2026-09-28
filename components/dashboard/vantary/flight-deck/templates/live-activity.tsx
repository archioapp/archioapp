"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   <LiveActivityTemplate />

   What's happening right now across all ecosystems. Active sessions, 
   recent mentor activity, member engagement. Proof that these communities 
   are alive, not ghost towns.

   Decision enabled: "Which ecosystems are alive right now? Who's trading?"

   Value system applied:
   1. What decision does this help them make? → Which community is active NOW
   2. What evidence does it show? → Live sessions, recent events, activity metrics
   3. What action does it enable? → Join active community, watch live session
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  Users,
  Mic2,
  Radio,
  Clock,
  TrendingUp,
  Zap,
  Eye,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  Filter,
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
} from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"

/* ── Mock Activity Data ─────────────────────────────────────────────── */

interface ActivityEvent {
  id: string
  type: "session_start" | "member_join" | "signal_posted" | "mentor_online" | "call_ended"
  communitySlug: string
  communityName: string
  actor?: string
  description: string
  timestamp: Date
}

interface LiveSession {
  id: string
  communitySlug: string
  communityName: string
  mentor: string
  topic: string
  viewers: number
  startedAt: Date
  isLive: boolean
}

// Generate mock activity events
function generateMockActivity(): ActivityEvent[] {
  const now = new Date()
  const events: ActivityEvent[] = []
  
  const eventTypes: ActivityEvent["type"][] = [
    "session_start", "member_join", "signal_posted", "mentor_online", "call_ended"
  ]
  
  MOCK_COMMUNITIES.forEach((c, idx) => {
    // Random number of events per community
    const numEvents = Math.floor(Math.random() * 4) + 1
    
    for (let i = 0; i < numEvents; i++) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]!
      const minutesAgo = Math.floor(Math.random() * 60)
      
      let description = ""
      let actor = ""
      
      switch (type) {
        case "session_start":
          actor = c.mentors[0]?.displayName || "Mentor"
          description = `${actor} started a live session`
          break
        case "member_join":
          actor = `User${Math.floor(Math.random() * 1000)}`
          description = `${actor} joined the community`
          break
        case "signal_posted":
          actor = c.mentors[0]?.displayName || "Mentor"
          description = `${actor} posted a new signal`
          break
        case "mentor_online":
          actor = c.mentors[0]?.displayName || "Mentor"
          description = `${actor} is now online`
          break
        case "call_ended":
          actor = c.mentors[0]?.displayName || "Mentor"
          description = `${actor}'s session ended (42 attended)`
          break
      }
      
      events.push({
        id: `${c.slug}-${i}`,
        type,
        communitySlug: c.slug,
        communityName: c.name,
        actor,
        description,
        timestamp: new Date(now.getTime() - minutesAgo * 60000),
      })
    }
  })
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

function generateMockSessions(): LiveSession[] {
  return MOCK_COMMUNITIES
    .filter((c) => c.isLiveNow || Math.random() > 0.6)
    .slice(0, 3)
    .map((c, idx) => ({
      id: `session-${c.slug}`,
      communitySlug: c.slug,
      communityName: c.name,
      mentor: c.mentors[0]?.displayName || "Lead Mentor",
      topic: ["Market Analysis", "Setup Review", "Q&A Session", "Live Trading"][idx % 4]!,
      viewers: Math.floor(Math.random() * 50) + 10,
      startedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
      isLive: c.isLiveNow || Math.random() > 0.5,
    }))
}

/* ── Component ─────────────────────────────────────────────────────── */

export interface LiveActivityTemplateProps {
  onClose?: () => void
  onPin?: () => void
  pinned?: boolean
}

export function LiveActivityTemplate({
  onClose,
  onPin,
  pinned = false,
}: LiveActivityTemplateProps) {
  const [filter, setFilter] = React.useState<"all" | "live" | "signals" | "joins">("all")
  const [lastRefresh, setLastRefresh] = React.useState(new Date())
  
  const [events] = React.useState(() => generateMockActivity())
  const [sessions] = React.useState(() => generateMockSessions())
  
  const filteredEvents = React.useMemo(() => {
    if (filter === "all") return events
    if (filter === "live") return events.filter((e) => e.type === "session_start" || e.type === "mentor_online")
    if (filter === "signals") return events.filter((e) => e.type === "signal_posted")
    if (filter === "joins") return events.filter((e) => e.type === "member_join")
    return events
  }, [events, filter])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // In real app, would re-fetch data
  }

  // Community activity ranking
  const activityRanking = React.useMemo(() => {
    const counts: Record<string, number> = {}
    events.forEach((e) => {
      counts[e.communitySlug] = (counts[e.communitySlug] || 0) + 1
    })
    
    return MOCK_COMMUNITIES
      .map((c) => ({
        community: c,
        eventCount: counts[c.slug] || 0,
        hasLiveSession: sessions.some((s) => s.communitySlug === c.slug && s.isLive),
      }))
      .sort((a, b) => {
        // Live sessions first, then by event count
        if (a.hasLiveSession && !b.hasLiveSession) return -1
        if (!a.hasLiveSession && b.hasLiveSession) return 1
        return b.eventCount - a.eventCount
      })
  }, [events, sessions])

  const drillers: DrillForwardSuggestion[] = [
    {
      id: "drill.join-most-active",
      routeId: "D01",
      label: `Join ${activityRanking[0]?.community.name}`,
      hint: "Most active ecosystem right now",
      urgency: "high",
    },
    {
      id: "drill.watch-live",
      routeId: "D02",
      label: "Watch live session",
      hint: "Join a session in progress",
      urgency: "high",
    },
    {
      id: "drill.filter-timezone",
      routeId: "D03",
      label: "Filter by my timezone",
      hint: "Show activity during your trading hours",
      urgency: "medium",
    },
  ]

  return (
    <TemplateShell
      id="collective.live-activity"
      eyebrow="THE COLLECTIVE · ACTIVITY · LIVE"
      routeId="C-ACT"
      headline="Live Activity"
      subheadline={`${sessions.filter((s) => s.isLive).length} live sessions · ${events.length} events in last hour`}
      prelude={
        <span>
          Real-time activity across all ecosystems. See{" "}
          <span style={{ color: VANTARY.amber }}>who&apos;s live</span>, what
          signals are being posted, and which communities are most active right
          now.
        </span>
      }
      inputs={
        <div className="flex items-center justify-between">
          {/* Filter chips */}
          <div className="flex items-center gap-2">
            {[
              { value: "all", label: "All Activity" },
              { value: "live", label: "Live Now" },
              { value: "signals", label: "Signals" },
              { value: "joins", label: "New Members" },
            ].map((f) => (
              <motion.button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value as typeof filter)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: filter === f.value ? VANTARY.amberWash : "rgba(255,255,255,0.02)",
                  border: `1px solid ${filter === f.value ? VANTARY.amber : VANTARY.rule}`,
                  color: filter === f.value ? VANTARY.amber : VANTARY.ash,
                }}
              >
                {f.label}
              </motion.button>
            ))}
          </div>

          {/* Refresh button */}
          <motion.button
            type="button"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${VANTARY.rule}`,
              color: VANTARY.ash,
            }}
          >
            <RefreshCw size={12} />
            Refresh
          </motion.button>
        </div>
      }
      resolver={
        <div
          className="flex items-center gap-4 text-xs"
          style={{ color: VANTARY.ashSoft }}
        >
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <span>|</span>
          <span>{filteredEvents.length} events shown</span>
        </div>
      }
      renderPlan={
        <div className="flex flex-col gap-6">
          {/* Live Sessions */}
          {sessions.filter((s) => s.isLive).length > 0 && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: VANTARY.amberWash,
                border: `1px solid ${VANTARY.amber}`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Radio size={16} color={VANTARY.amber} />
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: VANTARY.amber }}
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <span
                  className="text-xs font-mono uppercase tracking-wide"
                  style={{ color: VANTARY.amber }}
                >
                  Live Now
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {sessions.filter((s) => s.isLive).map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, ease: EASE_V }}
                    className="p-3 rounded-lg"
                    style={{
                      background: "rgba(8,9,12,0.5)",
                      border: `1px solid ${VANTARY.amber}`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="text-sm font-bold truncate"
                        style={{ color: VANTARY.paper }}
                      >
                        {session.communityName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={10} color={VANTARY.amber} />
                        <span
                          className="text-xs font-mono"
                          style={{ color: VANTARY.amber }}
                        >
                          {session.viewers}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-xs mb-2"
                      style={{ color: VANTARY.ash }}
                    >
                      {session.mentor} · {session.topic}
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1"
                      style={{
                        background: VANTARY.amber,
                        color: VANTARY.ink,
                      }}
                    >
                      Watch
                      <ArrowRight size={10} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Activity by Community */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Activity feed */}
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
                Recent Activity
              </div>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {filteredEvents.slice(0, 15).map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, ease: EASE_V }}
                    className="flex items-start gap-3 py-2"
                    style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
                  >
                    <EventIcon type={event.type} />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs truncate"
                        style={{ color: VANTARY.paper }}
                      >
                        {event.description}
                      </div>
                      <div
                        className="text-[10px] mt-0.5"
                        style={{ color: VANTARY.ashSoft }}
                      >
                        {event.communityName} · {formatTimeAgo(event.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Community ranking */}
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
                Most Active Right Now
              </div>
              <div className="flex flex-col gap-2">
                {activityRanking.slice(0, 6).map((item, idx) => (
                  <motion.div
                    key={item.community.slug}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, ease: EASE_V }}
                    className="flex items-center gap-3 py-2"
                    style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: idx === 0 ? VANTARY.amberWash : "rgba(255,255,255,0.05)",
                        color: idx === 0 ? VANTARY.amber : VANTARY.ash,
                        border: `1px solid ${idx === 0 ? VANTARY.amber : VANTARY.rule}`,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-medium truncate"
                          style={{ color: VANTARY.paper }}
                        >
                          {item.community.name}
                        </span>
                        {item.hasLiveSession && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[8px] uppercase font-bold flex items-center gap-1"
                            style={{
                              background: VANTARY.amberWash,
                              color: VANTARY.amber,
                            }}
                          >
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: VANTARY.amber }}
                              animate={{ opacity: [1, 0.4, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            Live
                          </span>
                        )}
                      </div>
                      <div
                        className="text-[10px]"
                        style={{ color: VANTARY.ashSoft }}
                      >
                        {item.eventCount} events · {item.community.members} members
                      </div>
                    </div>
                    <ActivityMeter level={item.eventCount / 4} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      drillForward={drillers}
      onClose={onClose}
      onPin={onPin}
      state="ready"
    />
  )
}

/* ── Subcomponents ─────────────────────────────────────────────────── */

function EventIcon({ type }: { type: ActivityEvent["type"] }) {
  const iconProps = { size: 12, strokeWidth: 2 }
  
  switch (type) {
    case "session_start":
      return (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: VANTARY.amberWash }}
        >
          <Mic2 {...iconProps} color={VANTARY.amber} />
        </div>
      )
    case "member_join":
      return (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(99,165,255,0.1)" }}
        >
          <Users {...iconProps} color="#63A5FF" />
        </div>
      )
    case "signal_posted":
      return (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(76,217,100,0.1)" }}
        >
          <Zap {...iconProps} color="#4CD964" />
        </div>
      )
    case "mentor_online":
      return (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: VANTARY.amberWash }}
        >
          <Activity {...iconProps} color={VANTARY.amber} />
        </div>
      )
    case "call_ended":
      return (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <Clock {...iconProps} color={VANTARY.ash} />
        </div>
      )
    default:
      return null
  }
}

function ActivityMeter({ level }: { level: number }) {
  const bars = 5
  const activeBars = Math.min(Math.round(level * bars), bars)
  
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: bars }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ height: 4 }}
          animate={{ height: 4 + (idx + 1) * 2 }}
          className="w-1 rounded-full"
          style={{
            background: idx < activeBars ? VANTARY.amber : VANTARY.rule,
            opacity: idx < activeBars ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default LiveActivityTemplate
