"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, TrendingUp, TrendingDown, CheckCircle } from "lucide-react"
import { useScenarioStore, type TradingScenario } from "@/lib/scenario-store"
import { CreateScenarioModal } from "./create-scenario-modal"
import { cn } from "@/lib/utils"

interface ScenarioSelectorProps {
  selectedScenarioIds: string[]
  onScenarioToggle: (scenarioId: string) => void
  currentPair?: string
  forecastData?: {
    pair?: string
    direction?: string
    confluences?: string[]
    commentary?: string
    screenshotUrl?: string
  }
}

export function ScenarioSelector({
  selectedScenarioIds,
  onScenarioToggle,
  currentPair,
  forecastData,
}: ScenarioSelectorProps) {
  const { scenarios, getScenariosByPair } = useScenarioStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [localScenarios, setLocalScenarios] = useState<TradingScenario[]>([])

  // Update local scenarios when store changes
  useEffect(() => {
    const relevantScenarios = currentPair ? getScenariosByPair(currentPair) : scenarios
    setLocalScenarios(relevantScenarios)
  }, [scenarios, currentPair, getScenariosByPair])

  // Listen for new scenarios created from terminal or other sources
  useEffect(() => {
    const handleScenarioCreated = (event: CustomEvent<{ scenario: TradingScenario }>) => {
      const newScenario = event.detail.scenario || event.detail
      if (newScenario && newScenario.id) {
        // Auto-select newly created scenarios
        onScenarioToggle(newScenario.id)

        // Update local state immediately
        setLocalScenarios((prev) => {
          const exists = prev.find((s) => s.id === newScenario.id)
          if (!exists) {
            return [...prev, newScenario]
          }
          return prev
        })
      }
    }

    const handleScenarioUpdated = (event: CustomEvent) => {
      // Refresh scenarios when updated
      const relevantScenarios = currentPair ? getScenariosByPair(currentPair) : scenarios
      setLocalScenarios(relevantScenarios)
    }

    const handleScenarioDeleted = (event: CustomEvent<{ id: string }>) => {
      const deletedId = event.detail.id
      setLocalScenarios((prev) => prev.filter((s) => s.id !== deletedId))
    }

    // Listen for various scenario events
    window.addEventListener("scenario:created" as any, handleScenarioCreated)
    window.addEventListener("scenario:updated" as any, handleScenarioUpdated)
    window.addEventListener("scenario:deleted" as any, handleScenarioDeleted)

    return () => {
      window.removeEventListener("scenario:created" as any, handleScenarioCreated)
      window.removeEventListener("scenario:updated" as any, handleScenarioUpdated)
      window.removeEventListener("scenario:deleted" as any, handleScenarioDeleted)
    }
  }, [onScenarioToggle, currentPair, getScenariosByPair, scenarios])

  useEffect(() => {
    return () => {
      setShowCreateModal(false)
    }
  }, [])

  const handleCreateScenario = () => {
    setShowCreateModal(true)
  }

  const getPositionIcon = (position: string) => {
    return position === "Buy Position" ? (
      <TrendingUp className="h-4 w-4 text-emerald-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    )
  }

  const getPositionColor = (position: string) => {
    return position === "Buy Position"
      ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
      : "border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-300" />
          <span className="font-semibold">Link Trading Scenarios</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {selectedScenarioIds.length} selected
        </Badge>
      </div>

      <p className="text-sm text-zinc-400 mb-4">
        Connect this forecast to existing trading scenarios or create new ones. Scenarios will automatically sync with
        the institutional terminal.
      </p>

      {/* Create New Scenario Button - Removed Quick Create */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={handleCreateScenario}
          variant="outline"
          className="flex items-center gap-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Create New Scenario
        </Button>
      </div>

      {/* Available Scenarios */}
      <div>
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Available Scenarios</h4>

        {localScenarios.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No scenarios available</p>
            <p className="text-xs mt-1">Create your first scenario to get started</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {localScenarios.map((scenario) => {
              const isSelected = selectedScenarioIds.includes(scenario.id)

              return (
                <div
                  key={scenario.id}
                  onClick={() => onScenarioToggle(scenario.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200",
                    isSelected
                      ? "border-blue-500/50 bg-blue-500/20 shadow-lg shadow-blue-500/10"
                      : getPositionColor(scenario.position),
                    "hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Selection Indicator */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                        isSelected ? "border-blue-400 bg-blue-500" : "border-zinc-600 bg-transparent",
                      )}
                    >
                      {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>

                    {/* Position Icon */}
                    {getPositionIcon(scenario.position)}

                    {/* Scenario Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{scenario.pair}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs px-2 py-0.5",
                            scenario.position === "Buy Position"
                              ? "border-emerald-500/50 text-emerald-300"
                              : "border-red-500/50 text-red-300",
                          )}
                        >
                          {scenario.position}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-zinc-600 text-zinc-400">
                          {scenario.rr}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                        <span>Entry: {scenario.level}</span>
                        <span>SL: {scenario.sl}</span>
                        <span>TP: {scenario.tp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Source Badge */}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs px-2 py-1",
                      scenario.source === "forecast"
                        ? "border-purple-500/50 text-purple-300 bg-purple-500/10"
                        : scenario.source === "terminal"
                          ? "border-cyan-500/50 text-cyan-300 bg-cyan-500/10"
                          : "border-zinc-600 text-zinc-400",
                    )}
                  >
                    {scenario.source}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <CreateScenarioModal isOpen={showCreateModal} onOpenChange={setShowCreateModal} initialData={forecastData} />
      )}
    </div>
  )
}
