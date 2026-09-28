import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { CopilotProvider } from "@/components/copilot/CopilotProvider"
import { CommunityHubGate } from "@/components/community-panel/community-hub-gate"
import { CommandLayer } from "@/components/command/CommandLayer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CopilotProvider>
      <div className="min-h-screen relative">
        <CommunityHubGate />
        {children}
        <CommandLayer />
        <Toaster />
      </div>
    </CopilotProvider>
  )
}
