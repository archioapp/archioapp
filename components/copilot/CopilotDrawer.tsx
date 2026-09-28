"use client"

import { useCopilotStore } from "@/lib/stores/copilotStore"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopilotRightRail } from "./CopilotRightRail"
import { Bot, BookOpen, FileText, Activity, Settings } from "lucide-react"

export function CopilotDrawer() {
  const { open, setOpen } = useCopilotStore()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-[420px] p-0 bg-[#0c0c10]/95 backdrop-blur-xl border-l border-purple-500/20"
      >
        <SheetHeader className="p-4 border-b border-white/10">
          <SheetTitle className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5 text-purple-400" />
            AI Copilot
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="coach" className="w-full">
          <TabsList className="mx-4 mt-4 bg-black/40 border border-white/10">
            <TabsTrigger
              value="coach"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Bot className="w-4 h-4 mr-1" />
              Coach
            </TabsTrigger>
            <TabsTrigger
              value="playbooks"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Playbooks
            </TabsTrigger>
            <TabsTrigger
              value="journal"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <FileText className="w-4 h-4 mr-1" />
              Journal
            </TabsTrigger>
            <TabsTrigger
              value="telemetry"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Activity className="w-4 h-4 mr-1" />
              Telemetry
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coach" className="p-4">
            <ScrollArea className="h-[75vh]">
              {/* Reuse the same list as the right-rail */}
              <CopilotRightRail />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="playbooks" className="p-4">
            <div className="text-sm text-white/70 space-y-4">
              <div className="premium-glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Context Playbooks</h4>
                <p className="text-xs text-white/60 mb-3">
                  Create macros from repeated actions (e.g., "London open scalp").
                </p>
                <div className="space-y-2">
                  <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                    <div className="text-xs font-medium text-purple-300">London Open Mean-Revert</div>
                    <div className="text-xs text-white/50">Auto-checklist for session opens</div>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <div className="text-xs font-medium text-blue-300">News Event Guard</div>
                    <div className="text-xs text-white/50">High-impact event protection</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="p-4">
            <div className="text-sm text-white/70 space-y-4">
              <div className="premium-glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Auto-Journal</h4>
                <p className="text-xs text-white/60 mb-3">Auto‑logged sessions, entries, screenshots, emotions.</p>
                <div className="space-y-2">
                  <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                    <div className="text-xs font-medium text-green-300">Today's Session</div>
                    <div className="text-xs text-white/50">3 entries, +2.4R, 67% win rate</div>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                    <div className="text-xs font-medium text-yellow-300">Replay Available</div>
                    <div className="text-xs text-white/50">EURUSD setup from 14:30 UTC</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="telemetry" className="p-4">
            <div className="text-sm text-white/70 space-y-4">
              <div className="premium-glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Event Timeline</h4>
                <p className="text-xs text-white/60 mb-3">Event timeline & health monitoring.</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Events Today:</span>
                    <span className="text-white">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Suggestions:</span>
                    <span className="text-purple-300">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Actions Taken:</span>
                    <span className="text-green-300">8</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <div className="text-sm text-white/70 space-y-4">
              <div className="premium-glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Copilot Settings</h4>
                <p className="text-xs text-white/60 mb-3">Nudge level, news guard, risk caps, privacy toggles.</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Suggestion Level</span>
                    <select className="bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white">
                      <option>Conservative</option>
                      <option>Balanced</option>
                      <option>Aggressive</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">News Guard</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Risk Caps</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
