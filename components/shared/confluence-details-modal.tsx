"use client"

import { confluenceById } from "@/lib/confluences"
import { useConfluenceStore } from "@/stores/confluence-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  confluenceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfluenceDetailsModal({ confluenceId, open, onOpenChange }: Props) {
  const { selectedConfluences, confluenceStatus, toggleConfluence } = useConfluenceStore()

  const confluence = confluenceById.get(confluenceId as any)
  if (!confluence) return null

  const Icon = confluence.icon
  const isSelected = selectedConfluences.includes(confluenceId as any)
  const status = confluenceStatus[confluenceId]
  const isActive = status?.active || false
  const strength = status?.strength || 0
  const lastUpdated = status?.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : "Never"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0b0f] border border-zinc-800 text-zinc-100">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
              <Icon className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-white">{confluence.name}</DialogTitle>
              <Badge variant="outline" className="mt-1">
                {confluence.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-zinc-400 hover:text-white"
          >
            Close
          </Button>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detection">Detection Rules</TabsTrigger>
            <TabsTrigger value="status">Current Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Description</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{confluence.detailedDescription}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Quick Summary</h3>
              <p className="text-sm text-zinc-400">{confluence.hoverDescription}</p>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
              <div className="text-sm">
                <span className="text-zinc-400">Strength Weight:</span>
                <span className="ml-2 font-medium text-white">{confluence.strengthWeight}%</span>
              </div>
              <div className="text-sm">
                <span className="text-zinc-400">Impact:</span>
                <Badge variant="outline" className="ml-2">
                  {confluence.confidenceImpact}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detection" className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Detection Methodology</h3>
              <div className="space-y-3">
                {confluence.detectionRules.map((rule, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-xs font-medium text-blue-400">
                      {index + 1}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed flex-1">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Visual Indicators</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{confluence.visualIndicators.type}</Badge>
                <span className="text-xs text-zinc-500">How this confluence appears on charts</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-300">Current State</h3>
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn("text-sm font-medium", isActive ? "text-green-400" : "text-red-400")}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-300">Strength</h3>
                <div className="space-y-1">
                  <Progress value={strength} className="h-2" />
                  <span className="text-xs text-zinc-400">{strength}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-300">Last Updated</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">{lastUpdated}</span>
              </div>
            </div>

            {status?.levels && status.levels.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-300">Key Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {status.levels.map((level, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {level.toFixed(5)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300">Enable in Analysis</h3>
                  <p className="text-xs text-zinc-500">Include this confluence in trade analysis</p>
                </div>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleConfluence(confluenceId as any)}
                >
                  {isSelected ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Integration Info</h3>
                <div className="space-y-2 text-xs text-zinc-500">
                  <p>• This confluence integrates with forecast creation</p>
                  <p>• Real-time status updates every 2 seconds</p>
                  <p>• Affects global confidence calculation</p>
                  <p>• Visible in terminal bottom bar when pinned</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
