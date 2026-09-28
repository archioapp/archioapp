"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   <CommunityHubTemplate />

   The single-button destination for THE COLLECTIVE. Embeds the entire
   /communities page content — DiscoveryEngine (radial finder), CommunityObject
   cards, and CommunityInspector — all within the Flight Deck viewport shell.

   This is a full-page experience rendered inside the cockpit, giving users
   the complete community discovery flow without leaving the dashboard.
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { X, Pin, PinOff } from "lucide-react"

import DiscoveryEngine from "@/components/communities/DiscoveryEngine"
import CommunityObject from "@/components/communities/CommunityObject"
import CommunityInspector from "@/components/communities/CommunityInspector"
import { ALL_DIMENSIONS } from "@/components/communities/discovery-dimensions"
import { VANTARY } from "../../vantary-theme"
import { FdCorners } from "../flight-deck-primitives"
import { getTemplateDescriptor } from "../template-registry"
import type { DrillForwardItem } from "../template-types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface CommunityHubTemplateProps {
  drillForward?: readonly DrillForwardItem[]
  onClose?: () => void
  onPin?: () => void
  pinned?: boolean
}

export function CommunityHubTemplate({
  drillForward,
  onClose,
  onPin,
  pinned,
}: CommunityHubTemplateProps) {
  const [activeDimensions, setActiveDimensions] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null)

  const desc = getTemplateDescriptor("collective.community-hub")

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)

    for (const dimId of activeDimensions) {
      const dim = ALL_DIMENSIONS.find(d => d.id === dimId)
      if (!dim) continue
      if (dim.filterKey === "has_ai") params.set("has_ai", "true")
      else if (dim.filterKey === "has_live_calls") params.set("has_live_calls", "true")
      else if (dim.filterKey === "has_mentor_dashboard") params.set("has_mentor_dashboard", "true")
      else if (dim.filterKey === "verified") params.set("verified", "true")
      else if (dim.filterKey === "beginner_friendly") params.set("beginner_friendly", "true")
      else if (dim.filterKey === "asset_class") params.set("asset_class", String(dim.filterValue))
      else if (dim.filterKey === "trading_style") params.set("trading_style", String(dim.filterValue))
      else if (dim.filterKey === "session_focus") params.set("session_focus", String(dim.filterValue))
      else if (dim.filterKey === "visibility") params.set("visibility", String(dim.filterValue))
      else if (dim.filterKey === "sort_by") params.set("sort_by", String(dim.filterValue))
    }

    return params.toString()
  }, [activeDimensions, searchQuery])

  const { data, isLoading } = useSWR(
    `/api/communities${queryParams ? `?${queryParams}` : ""}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 500 }
  )

  const communities = data?.communities || []

  const handleToggleDimension = useCallback((id: string) => {
    setActiveDimensions(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: VANTARY.ink,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 20,
      }}
    >
      <FdCorners inset={10} size={10} />

      {/* Header strip */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: VANTARY.amber,
            }}
          >
            {desc.eyebrow}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPin && (
            <button
              type="button"
              onClick={onPin}
              className="p-1.5 rounded-md transition-colors"
              style={{
                background: pinned ? VANTARY.amberWash : "transparent",
                border: `1px solid ${pinned ? VANTARY.amber : VANTARY.rule}`,
              }}
            >
              {pinned ? (
                <PinOff size={14} color={VANTARY.amber} strokeWidth={1.5} />
              ) : (
                <Pin size={14} color={VANTARY.ashSoft} strokeWidth={1.5} />
              )}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md transition-colors hover:bg-white/5"
              style={{ border: `1px solid ${VANTARY.rule}` }}
            >
              <X size={14} color={VANTARY.paper} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content area */}
      <div
        className="overflow-y-auto"
        style={{
          height: "calc(100% - 52px)",
          background: "#0B0F1E",
        }}
      >
        {/* Layer 1: Discovery Engine (radial finder) */}
        <DiscoveryEngine
          activeDimensions={activeDimensions}
          onToggleDimension={handleToggleDimension}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={communities.length}
        />

        {/* Transition divider */}
        <div className="relative py-5">
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent 10%, rgba(99,165,255,0.1) 50%, transparent 90%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-1.5 rounded-full"
            style={{
              background: "rgba(14,18,38,0.9)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.14em] font-bold"
              style={{ color: "#525B73" }}
            >
              {activeDimensions.size > 0 || searchQuery
                ? `${communities.length} Matched Ecosystems`
                : "All Trading Ecosystems"}
            </span>
          </div>
        </div>

        {/* Layer 2: Community Results */}
        <div className="max-w-[1200px] mx-auto px-6 pb-24">
          {isLoading && (
            <div className="flex justify-center py-16">
              <motion.div
                className="w-8 h-8 rounded-full"
                style={{
                  border: "2px solid rgba(99,165,255,0.15)",
                  borderTopColor: "rgba(99,165,255,0.5)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {!isLoading && communities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {communities.map((community: any, i: number) => (
                <CommunityObject
                  key={community.id || i}
                  community={community}
                  index={i}
                  onSelect={setSelectedCommunity}
                />
              ))}
            </div>
          )}

          {!isLoading && communities.length === 0 && (activeDimensions.size > 0 || searchQuery) && (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                style={{
                  background: "rgba(99,165,255,0.06)",
                  border: "1px solid rgba(99,165,255,0.08)",
                }}
              >
                <span className="text-[20px]" style={{ color: "rgba(99,165,255,0.3)" }}>
                  ?
                </span>
              </div>
              <h3 className="text-[14px] font-bold mb-2" style={{ color: "#E8EAF0" }}>
                No communities match this profile yet
              </h3>
              <p
                className="text-[11px] text-center max-w-[320px]"
                style={{ color: "#525B73" }}
              >
                Try adjusting your discovery dimensions or search terms.
              </p>
            </div>
          )}
        </div>

        {/* Layer 3: Inspector (modal overlay) */}
        <AnimatePresence>
          {selectedCommunity && (
            <CommunityInspector
              community={selectedCommunity}
              onClose={() => setSelectedCommunity(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CommunityHubTemplate
