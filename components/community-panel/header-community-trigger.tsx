"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Radio, Users } from "lucide-react"
import { VANTARY } from "../dashboard/vantary/vantary-theme"

/* ── Cross-tree event bridge ─────────────────────────────────────────────
 * The Community Hub is mounted globally in app/(main)/layout.tsx with its
 * own internal open-state, while this trigger lives inside the trading-desk
 * chart header (a different React tree, deep inside your-space.tsx). They
 * talk over two window CustomEvents — the same pattern the rest of the
 * codebase uses to bridge trees:
 *   · community-hub:toggle      fired by THIS trigger → hub opens/closes
 *   · community-hub:indicators  fired by the HUB      → trigger live state
 * ──────────────────────────────────────────────────────────────────────── */
export const COMMUNITY_TOGGLE_EVENT = "community-hub:toggle"
export const COMMUNITY_INDICATORS_EVENT = "community-hub:indicators"

export interface CommunityIndicators {
  hasLive: boolean
  liveCount: number
  totalUnread: number
  topContext: string
}

const DEFAULT_INDICATORS: CommunityIndicators = {
  hasLive: false,
  liveCount: 0,
  totalUnread: 0,
  topContext: "Community",
}

/**
 * HeaderCommunityTrigger — the chart-header port of the floating Community
 * swipe tab. Slots into the chart/split control rail (same row as
 * CHART · SPLIT · EXECUTE · pairs) and toggles the global Community Hub.
 *
 * Styled to read as a sibling of the surrounding header chips: glass pill,
 * 9px mono label, theme-rule hairline — but carries a live emerald pulse and
 * an unread badge so it keeps the "something is happening" signal the old
 * floating tab had.
 */
export function HeaderCommunityTrigger() {
  const [ind, setInd] = useState<CommunityIndicators>(DEFAULT_INDICATORS)

  // Listen for the hub broadcasting its live/unread state.
  useEffect(() => {
    const onIndicators = (e: Event) => {
      const detail = (e as CustomEvent<CommunityIndicators>).detail
      if (detail) setInd(detail)
    }
    window.addEventListener(COMMUNITY_INDICATORS_EVENT, onIndicators as EventListener)
    // Ask the hub to (re)broadcast in case it mounted first.
    window.dispatchEvent(new CustomEvent("community-hub:request-indicators"))
    return () => window.removeEventListener(COMMUNITY_INDICATORS_EVENT, onIndicators as EventListener)
  }, [])

  const toggle = () => window.dispatchEvent(new CustomEvent(COMMUNITY_TOGGLE_EVENT))

  const dotColor = ind.hasLive ? "#ef4444" : ind.totalUnread > 0 ? VANTARY.amber : VANTARY.teal
  const statusLabel = ind.hasLive
    ? `${ind.liveCount} LIVE`
    : ind.totalUnread > 0
      ? `${ind.totalUnread} NEW`
      : "OPEN"

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label="Open Community Hub"
      className="relative flex items-center rounded-full transition-all"
      style={{
        gap:        6,
        padding:    "5px 11px",
        background: VANTARY.glass ?? "rgba(255,255,255,0.04)",
        border:     `1px solid ${VANTARY.rule}`,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <Radio size={13} strokeWidth={1.75} color={VANTARY.teal} className="shrink-0" />

      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.paperDim }}
      >
        Community
      </span>

      {/* live / unread status capsule */}
      <span className="flex items-center gap-1" style={{ marginLeft: 1 }}>
        <span className="relative flex" style={{ width: 6, height: 6 }}>
          {ind.hasLive && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: dotColor, opacity: 0.5 }}
            />
          )}
          <span
            className="relative rounded-full"
            style={{ width: 6, height: 6, background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
          />
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: "0.14em", color: dotColor }}
        >
          {statusLabel}
        </span>
      </span>
    </motion.button>
  )
}
