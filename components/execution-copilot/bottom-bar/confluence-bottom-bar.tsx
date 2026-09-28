"use client"

import { useState, useEffect } from "react"
import { useConfluenceStore } from "@/stores/confluence-store"
import { confluenceById } from "@/lib/confluences"
import { ConfluenceConfigModal } from "./confluence-config-modal"
import { ConfluenceDetailsModal } from "../../shared/confluence-details-modal"
import { Button } from "@/components/ui/button"
import { Settings, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UltraConfluencePanel } from "@/components/ultra-confluence/ultra-confluence-panel"

export function ConfluenceBottomBar() {
  const { pinnedConfluences, selectedConfluences, confluenceStatus, toggleConfluence, getGlobalStrength } =
    useConfluenceStore()

  const [configOpen, setConfigOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedConfluenceId, setSelectedConfluenceId] = useState<string | null>(null)

  // Auto-start real-time updates when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      useConfluenceStore.getState().validateConfluences(1.085, new Date())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const openDetails = (confluenceId: string) => {
    setSelectedConfluenceId(confluenceId)
    setDetailsOpen(true)
  }

  const globalStrength = getGlobalStrength()

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[min(1200px,96vw)]">
        {/* Floating buttons bar */}
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-zinc-800 rounded-full px-4 py-2 mb-3">
          {/* Settings button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfigOpen(true)}
                className="h-8 w-8 rounded-full p-0 hover:bg-zinc-800"
              >
                <Settings className="h-4 w-4 text-zinc-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Customize Panel</p>
            </TooltipContent>
          </Tooltip>

          {/* Confluence buttons */}
          {pinnedConfluences.map((confluenceId) => {
            const confluence = confluenceById.get(confluenceId)
            if (!confluence) return null

            const Icon = confluence.icon
            const isSelected = selectedConfluences.includes(confluenceId)
            const status = confluenceStatus[confluenceId]
            const isActive = status?.active || false
            const wasJustUpdated = status && Date.now() - status.lastUpdated < 2000

            return (
              <div key={confluenceId} className="relative flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleConfluence(confluenceId)}
                      className={cn(
                        "relative h-10 w-10 rounded-full border transition-all duration-200",
                        "hover:scale-110 hover:shadow-lg",
                        isSelected
                          ? "border-purple-500 bg-purple-500/20 shadow-purple-500/30"
                          : "border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800",
                        isActive && "ring-2 ring-green-500/50",
                        wasJustUpdated && isSelected && "confluence-pulse",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                          isSelected ? "text-purple-300" : "text-zinc-400",
                        )}
                      />
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center">
                          {globalStrength}
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">{confluence.name}</p>
                      <p className="text-xs text-zinc-400">{status?.liveDescription || confluence.hoverDescription}</p>
                      {isActive && <p className="text-xs text-green-400">● Active</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>

                {/* Info button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => openDetails(confluenceId)}
                      className="h-4 w-4 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                    >
                      <Info className="h-2.5 w-2.5 text-zinc-300" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>View Details</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )
          })}

          {/* Global strength indicator */}
          {selectedConfluences.length > 0 && (
            <div className="ml-2 px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full">
              <span className="text-xs font-medium text-purple-300">{globalStrength}% Strength</span>
            </div>
          )}
        </div>

        {/* Ultra Confluence Panel */}
        <UltraConfluencePanel />

        {/* Modals */}
        <ConfluenceConfigModal open={configOpen} onOpenChange={setConfigOpen} />
        {selectedConfluenceId && (
          <ConfluenceDetailsModal
            confluenceId={selectedConfluenceId}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
