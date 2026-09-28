"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import type { LucideIcon } from "lucide-react"
import { Settings, Minimize2, Maximize2, Pin, GripVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UltraConfluenceCard } from "@/components/ultra-confluence/ultra-confluence-card"
import { ULTRA_CONFLUENCES, type UltraConfluenceId } from "@/components/ultra-confluence/types"
import { ConfluenceConfigModal } from "@/components/execution-copilot/bottom-bar/confluence-config-modal"
import { useConfluenceStore } from "@/stores/confluence-store"

const STORAGE_DOCK = "confluenceDockPos"
const STORAGE_MIN = "confluenceBarMinimized"
const MAX_VISIBLE = 5

type Props = { activeInstrument: string }

export function FloatingConfluencePanel(_props: Props) {
  const { pinnedConfluences } = useConfluenceStore()

  const [dockPos, setDockPos] = useState<"bottom" | "left">(() => {
    try {
      if (typeof window !== "undefined") {
        const v = window.localStorage.getItem(STORAGE_DOCK)
        if (v === "bottom" || v === "left") return v
      }
    } catch {}
    return "bottom"
  })

  const [minimized, setMinimized] = useState<boolean>(true)

  useEffect(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_DOCK, dockPos)
    } catch {}
  }, [dockPos])
  useEffect(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_MIN, minimized ? "1" : "0")
    } catch {}
  }, [minimized])

  // Build Ultra lookup once
  const ultraById = useMemo(() => {
    const map = new Map<UltraConfluenceId, (typeof ULTRA_CONFLUENCES)[number]>()
    ULTRA_CONFLUENCES.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  // Only the 10 Ultra ids are allowed
  const validUltraIds = useMemo(() => new Set(ULTRA_CONFLUENCES.map((c) => c.id)), [])
  const selected = useMemo(() => {
    const fromStore = (pinnedConfluences || []) as string[]
    const filtered = fromStore.filter((id) => validUltraIds.has(id as UltraConfluenceId)) as UltraConfluenceId[]
    const fallback = ULTRA_CONFLUENCES.slice(0, MAX_VISIBLE).map((c) => c.id)
    return filtered.length ? filtered.slice(0, MAX_VISIBLE) : fallback
  }, [pinnedConfluences, validUltraIds])

  // Hover/lock state - ensure they start as null/false
  const [hoveredId, setHoveredId] = useState<UltraConfluenceId | null>(null)
  const [lockedId, setLockedId] = useState<UltraConfluenceId | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current)
        hoverTimeout.current = null
      }
    }
  }, [])

  const handleHoverStart = (id: UltraConfluenceId) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => setHoveredId(id), 300)
  }

  const handleHoverEnd = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    if (!lockedId) setHoveredId(null)
  }

  const toggleLock = (id: UltraConfluenceId) => {
    setLockedId((prev) => (prev === id ? null : id))
  }

  function iconIdleFor(id: UltraConfluenceId) {
    // Subtle idle animations by id
    if (id === "liquidity-sweep")
      return { scale: [1, 1.08, 1], transition: { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }
    if (id === "bpr")
      return {
        rotate: [0, 2, 0, -2, 0],
        transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }
    if (id === "fvg")
      return {
        opacity: [0.8, 1, 0.8],
        transition: { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }
    if (id === "ifvg")
      return { rotateY: [0, 180, 0], transition: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }
    if (id === "order-block")
      return { y: [0, -1, 0], transition: { duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }
    if (id === "breaker-block")
      return {
        rotate: [0, -3, 0, 3, 0],
        transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }
    if (id === "po3")
      return {
        rotate: [0, 120, 240, 360],
        transition: { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
      }
    if (id === "bank-session")
      return {
        rotate: [0, 8, 0, -8, 0],
        transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }
    if (id === "opens-pd")
      return { y: [0, -1.5, 0], transition: { duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }
    return { scale: [1, 1.04, 1], transition: { duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }
  }

  return (
    <>
      <ConfluenceConfigModal open={showConfig} onOpenChange={setShowConfig} />

      <div
        className={`absolute z-[70] ${
          dockPos === "bottom" ? "left-1/2 -translate-x-1/2 bottom-6" : "left-6 top-1/2 -translate-y-1/2"
        }`}
        onMouseLeave={() => {
          if (!lockedId) setHoveredId(null)
        }}
      >
        {/* Controls cluster */}
        {/* Icon rail */}
        {/* Hover popup with Ultra content */}
        {/* Replace this motion.div */}
        {/* <motion.div
    layout
    className={\`
relative group pointer-events-auto
${dockPos === "bottom" ? "flex-row" : "flex-col"} flex items-center gap-3 rounded-[28px] px-3 py-2
bg-transparent backdrop-blur-xl backdrop-saturate-150
border border-white/15 ring-1 ring-purple-400/25
shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]
\`}
  > */}
        {/* With this motion.div */}
        {(() => {
          const containerClasses = `
relative group pointer-events-auto
${dockPos === "bottom" ? "flex-row" : "flex-col"} flex items-center gap-3 rounded-[28px] px-3 py-2
bg-transparent
`

          return (
            <motion.div layout className={containerClasses}>
              {/* Controls cluster */}
              <div
                role="toolbar"
                aria-orientation={dockPos === "bottom" ? "horizontal" : "vertical"}
                className={`flex ${dockPos === "bottom" ? "flex-row gap-2 pr-2" : "flex-col gap-2 pb-2"} items-center`}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, y: dockPos === "bottom" ? -3 : 0 }}
                  onClick={() => setShowConfig(true)}
                  className="h-9 w-9 rounded-full bg-zinc-900/50 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  aria-label="Customize confluences"
                >
                  <Settings className="h-4 w-4 m-auto" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08, y: dockPos === "bottom" ? -3 : 0 }}
                  onClick={() => setDockPos((p) => (p === "bottom" ? "left" : "bottom"))}
                  className="h-9 w-9 rounded-full bg-zinc-900/50 border border-zinc-700/60 text-purple-300 hover:bg-zinc-800"
                  aria-label="Toggle dock position"
                >
                  <Pin className="h-4 w-4 m-auto" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08, y: dockPos === "bottom" ? -3 : 0 }}
                  onClick={() => setMinimized((m) => !m)}
                  className="h-9 w-9 rounded-full bg-zinc-900/50 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  aria-label={minimized ? "Expand" : "Minimize"}
                >
                  {minimized ? <Maximize2 className="h-4 w-4 m-auto" /> : <Minimize2 className="h-4 w-4 m-auto" />}
                </motion.button>
              </div>

              {/* Icon rail */}
              {!minimized && (
                <div className={`flex ${dockPos === "bottom" ? "flex-row" : "flex-col"} items-center gap-3`}>
                  {selected.map((id, idx) => {
                    const meta = ultraById.get(id)
                    if (!meta) return null
                    const Icon = meta.icon as LucideIcon
                    const showCard = hoveredId === id || lockedId === id

                    // Adjust popup vertical position when docked on the left so bottom items don't overflow the canvas.
                    const len = selected.length || 1
                    const pct = idx / Math.max(1, len - 1) // 0 at top, 1 at bottom
                    const verticalOffsetClass =
                      dockPos === "left"
                        ? (() => {
                            // 45% stronger upward shift vs previous values
                            if (pct > 0.9) return "top-1/2 -translate-y-[232%]"
                            if (pct > 0.75) return "top-1/2 -translate-y-[195%]"
                            if (pct > 0.6) return "top-1/2 -translate-y-[174%]"
                            if (pct > 0.4) return "top-1/2 -translate-y-[152%]"
                            if (pct > 0.25) return "top-1/2 -translate-y-[130%]"
                            if (pct > 0.1) return "top-1/2 -translate-y-[109%]"
                            return "top-1/2 -translate-y-[87%]"
                          })()
                        : ""

                    return (
                      <div key={id} className="relative">
                        <motion.button
                          type="button"
                          onMouseEnter={() => handleHoverStart(id)}
                          onMouseLeave={handleHoverEnd}
                          onClick={() => toggleLock(id)}
                          className={`relative h-12 w-12 rounded-full border transition-all duration-200
bg-[rgba(18,18,28,0.7)] backdrop-blur-xl
${lockedId === id ? "ring-2 ring-purple-400/60" : ""}
border-zinc-700/70 hover:bg-zinc-800/50`}
                          whileHover={{ scale: 1.12, y: dockPos === "bottom" ? -6 : 0 }}
                          whileTap={{ scale: 0.98 }}
                          aria-pressed={lockedId === id}
                          aria-label={meta.name}
                        >
                          <motion.span
                            className="pointer-events-none absolute inset-0 rounded-full"
                            style={{
                              boxShadow: "0 0 24px 8px rgba(168,85,247,0.22), inset 0 0 12px 2px rgba(168,85,247,0.18)",
                            }}
                            animate={{ opacity: showCard ? 0.55 : 0.12 }}
                            transition={{ type: "spring", stiffness: 240, damping: 20 }}
                          />
                          <motion.span
                            className="absolute inset-0 flex items-center justify-center"
                            animate={iconIdleFor(id)}
                          >
                            <Icon className={`h-5 w-5 ${showCard ? "text-purple-300" : "text-zinc-300"}`} />
                          </motion.span>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500">
                            <GripVertical className="h-3 w-3" />
                          </div>
                        </motion.button>

                        <AnimatePresence>
                          {showCard && (
                            <motion.div
                              initial={{ y: 12, opacity: 0, scale: 0.98 }}
                              animate={{ y: 0, opacity: 1, scale: 1 }}
                              exit={{ y: 12, opacity: 0, scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 300, damping: 24 }}
                              onMouseEnter={() => setHoveredId(id)}
                              onMouseLeave={handleHoverEnd}
                              className={`absolute ${
                                dockPos === "bottom"
                                  ? "bottom-full mb-3 left-1/2 -translate-x-1/2"
                                  : `left-full ml-3 ${verticalOffsetClass}`
                              } w-[420px] z-[80] pointer-events-auto drop-shadow-[0_24px_36px_rgba(0,0,0,0.45)]`}
                            >
                              <UltraConfluenceCard id={id} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )
        })()}
      </div>
    </>
  )
}
