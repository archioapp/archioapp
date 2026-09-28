"use client"

import type React from "react"
import { generateUUID } from "@/lib/utils/uuid"
import { copilotBus } from "@/lib/copilot/eventBus"
import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { TrendingUp, TrendingDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScenarioStore, type TradingScenario } from "@/lib/scenario-store"
import { ScenarioEditModal } from "./scenario-edit-modal"
import { UserScenarioCard } from "./user-scenario-card"
import { CreateScenarioModal } from "./create-scenario-modal"

function AddButton({
  type,
  onClick,
}: {
  type: "buy" | "sell"
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={type === "buy" ? "Add Buy Scenario" : "Add Sell Scenario"}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-dashed backdrop-blur-xl",
        "cursor-pointer transition-all duration-500 ease-out premium-glass-container opacity-50 hover:opacity-100",
        type === "buy"
          ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/70 hover:shadow-emerald-500/30"
          : "border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400/70 hover:shadow-red-500/30",
      )}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus size={16} />
    </motion.button>
  )
}

export function FloatingScenarioPanel() {
  const { scenarios } = useScenarioStore()
  const [hoveredScenario, setHoveredScenario] = useState<TradingScenario | null>(null)
  const [editingScenario, setEditingScenario] = useState<TradingScenario | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createType, setCreateType] = useState<"buy" | "sell">("buy")
  const buttonRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const buyScenarios = scenarios.filter((s) => s.position === "Buy Position")
  const sellScenarios = scenarios.filter((s) => s.position === "Sell Position")

  useEffect(() => {
    const handleScenarioUpdate = () => setHoveredScenario(null)
    window.addEventListener("scenario:created" as any, handleScenarioUpdate)
    window.addEventListener("scenario:updated" as any, handleScenarioUpdate)
    window.addEventListener("scenario:deleted" as any, handleScenarioUpdate)
    return () => {
      window.removeEventListener("scenario:created" as any, handleScenarioUpdate)
      window.removeEventListener("scenario:updated" as any, handleScenarioUpdate)
      window.removeEventListener("scenario:deleted" as any, handleScenarioUpdate)
    }
  }, [])

  useEffect(() => {
    return () => {
      setShowCreateModal(false)
      setEditingScenario(null)
      setHoveredScenario(null)
    }
  }, [])

  const handleAddScenario = (type: "buy" | "sell") => {
    copilotBus.emit({
      id: generateUUID(),
      type: "scenario:opened",
      ts: Date.now(),
      sessionId: window.localStorage.getItem("sessionId") ?? "anon",
      context: { instrument: "current" },
      data: { scenarioType: type },
    })

    setCreateType(type)
    setShowCreateModal(true)
  }

  function ScenarioButton({ scenario, scenarioIndex }: { scenario: TradingScenario; scenarioIndex?: number }) {
    const isBuy = scenario.position === "Buy Position"
    const hideTimer = useRef<number | null>(null)
    const buttonRef = useRef<HTMLDivElement>(null)

    const show = useCallback(() => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current)
        hideTimer.current = null
      }
      setHoveredScenario(scenario)
    }, [scenario])

    const hideWithDelay = useCallback(() => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current)
      }
      hideTimer.current = window.setTimeout(() => {
        setHoveredScenario((curr) => (curr?.id === scenario.id ? null : curr))
      }, 300) // 300ms grace period
    }, [scenario.id])

    useEffect(() => {
      return () => {
        if (hideTimer.current) window.clearTimeout(hideTimer.current)
      }
    }, [])

    const getSmartCardPosition = (): React.CSSProperties => {
      const horizontalGapPx = 8

      const positioning: React.CSSProperties = {
        right: "100%",
        marginRight: `${horizontalGapPx}px`,
        pointerEvents: "auto",
        top: "-120px",
      }

      return positioning
    }

    const cardStyle = getSmartCardPosition()

    const getBridgeStyle = (): React.CSSProperties => {
      const horizontalGapPx = 8
      return {
        right: `calc(100% - ${horizontalGapPx}px)`,
        width: `${horizontalGapPx + 12}px`,
        height: "300px",
        top: "-120px",
      }
    }

    const bridgeStyle = getBridgeStyle()

    return (
      <div ref={buttonRef} className="relative flex items-center">
        <div className="relative" onMouseEnter={show} onMouseLeave={hideWithDelay}>
          <motion.button
            onClick={() => setEditingScenario(scenario)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border shadow-lg",
              "backdrop-blur-xl premium-glass-container transition-all duration-500 ease-out opacity-50 hover:opacity-100",
              isBuy
                ? "border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400/50 hover:shadow-emerald-500/30"
                : "border-red-400/30 text-red-300 hover:bg-red-500/25 hover:border-red-400/50 hover:shadow-red-500/30",
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-haspopup="dialog"
            aria-expanded={hoveredScenario?.id === scenario.id}
            aria-controls={`scenario-card-${scenario.id}`}
          >
            {isBuy ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </motion.button>

          <div
            className="absolute z-[61]"
            style={bridgeStyle}
            onMouseEnter={show}
            onMouseLeave={hideWithDelay}
            aria-hidden="true"
          />
        </div>

        <AnimatePresence>
          {hoveredScenario?.id === scenario.id && (
            <motion.div
              id={`scenario-card-${scenario.id}`}
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.18, type: "spring", stiffness: 300, damping: 25 }}
              className="absolute w-max z-[62] drop-shadow-2xl max-w-[400px]"
              style={cardStyle}
              onMouseEnter={show}
              onMouseLeave={hideWithDelay}
            >
              <UserScenarioCard scenario={scenario} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-56 right-5 z-40 flex flex-col items-end gap-2 max-h-[calc(100vh-200px)] overflow-visible">
        {buyScenarios.map((s, index) => (
          <ScenarioButton key={s.id} scenario={s} scenarioIndex={index} />
        ))}

        {(buyScenarios.length > 0 && sellScenarios.length > 0) && (
          <div className="w-5 h-px bg-white/[0.06] my-0.5" />
        )}

        {sellScenarios.map((s, index) => (
          <ScenarioButton key={s.id} scenario={s} scenarioIndex={index} />
        ))}
      </div>

      {editingScenario && (
        <ScenarioEditModal
          isOpen={!!editingScenario}
          scenario={editingScenario}
          onClose={() => setEditingScenario(null)}
          onSave={() => setEditingScenario(null)}
          onDelete={() => setEditingScenario(null)}
        />
      )}

      {showCreateModal && (
        <CreateScenarioModal
          isOpen={showCreateModal}
          onOpenChange={setShowCreateModal}
          initialData={{
            direction: createType === "buy" ? "Long" : "Short",
          }}
        />
      )}
    </>
  )
}
