"use client"

import { CopilotAIView } from "@/components/copilot/ai/CopilotAIView"
import { AIGuideAndTutorial } from "@/components/copilot/ai/AIGuideAndTutorial"

/* ═══════════════════════════════════════════════════════════════
   COPILOT AI COPILOT CONSOLE

   Wraps the existing CopilotAIView (full AI intelligence view)
   for use inside the LayerDetailModal. CopilotAIView is already
   a fully self-contained component with its own chat interface,
   intelligence boards, and contextual AI assistance.

   Pattern matches CopilotStrategyConsole / CopilotActivityConsole.
   ═══════════════════════════════════════════════════════════════ */

export function CopilotAICopilotConsole() {
  return (
    <div className="relative flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
        {/* ── AI Intelligence Guide & Tutorial ── */}
        <AIGuideAndTutorial />
        <CopilotAIView />
      </div>
    </div>
  )
}
