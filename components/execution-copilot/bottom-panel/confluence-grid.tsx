"use client"

import { useEffect, useMemo, useState } from "react"
import { ConfluenceCard } from "./confluence-card"
import {
  TrendingUp,
  Droplets,
  Scaling,
  Layers,
  FlipHorizontal2,
  Box,
  ArrowLeftRight,
  Shuffle,
  Clock,
  GitCommit,
  Crosshair,
  type LucideIcon,
} from "lucide-react"
import { useConfluences } from "@/stores/confluence-store"
import { ConfluenceDetailsModal } from "@/components/execution-copilot/bottom-bar/confluence-details-modal"

const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Droplets,
  Scaling,
  Layers,
  FlipHorizontal2,
  Box,
  ArrowLeftRight,
  Shuffle,
  Clock,
  GitCommit,
  Crosshair,
}

export function ConfluenceGrid() {
  const { systemConfluences, selectedConfluences, confluenceStatus, toggleConfluence, startRealtime } = useConfluences()
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    startRealtime()
  }, [startRealtime])

  const orderedIds = useMemo(
    () => [
      "htf-structure",
      "liquidity-sweep",
      "bpr",
      "fvg",
      "ifvg",
      "order-block",
      "breaker-block",
      "po3",
      "bank-session",
      "wo-do-premium-discount",
      "pivot-points",
    ],
    [],
  )

  const items = useMemo(() => {
    const map = new Map(systemConfluences.map((c) => [c.id, c]))
    return orderedIds
      .map((id) => map.get(id))
      .filter(Boolean)
      .map((c) => c!)
  }, [systemConfluences, orderedIds])

  return (
    <>
      <div className="w-full h-full p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {items.map((item) => {
          const status = confluenceStatus[item.id]
          const Icon = ICONS[(item as any).icon] || Crosshair
          const isSelected = selectedConfluences.includes(item.id)
          const value = typeof status?.strength === "number" ? `${status.strength}%` : "—"

          return (
            <ConfluenceCard
              key={item.id}
              icon={Icon}
              title={item.name}
              value={value}
              status={status?.active ? "active" : "inactive"}
              onClick={() => {
                // Instead of modal open here, toggle selection like before.
                // Details are available in the bottom bar via (i) button.
                toggleConfluence(item.id)
              }}
            />
          )
        })}
      </div>
      <ConfluenceDetailsModal confluenceId={openId} open={!!openId} onClose={() => setOpenId(null)} />
    </>
  )
}
