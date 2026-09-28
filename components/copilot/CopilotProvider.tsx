"use client"

import { type PropsWithChildren, useEffect } from "react"
import { copilotBus } from "@/lib/copilot/eventBus"
import { initCopilotWatchers } from "@/lib/copilot/watchers"
// import { persistCopilotEvents } from "@/lib/copilot/persist"
import { useCopilotStore } from "@/lib/stores/copilotStore"

function registerDefaultActions() {
  const { registerAction } = useCopilotStore.getState()

  registerAction("open-risk-sizer", async ({ payload }) => {
    // Open your existing risk sizer UI with payload.entry etc.
    window.dispatchEvent(new CustomEvent("open-risk-sizer", { detail: payload }))
  })

  registerAction("set-default-sl", async ({ payload }) => {
    window.dispatchEvent(new CustomEvent("order-set-sl", { detail: payload }))
  })

  registerAction("optimize-rr", async ({ payload }) => {
    window.dispatchEvent(new CustomEvent("optimize-rr", { detail: payload }))
  })

  registerAction("reopen-scenario", ({ payload }) => {
    window.dispatchEvent(new CustomEvent("scenario-reopen", { detail: payload }))
  })

  registerAction("discard-scenario", ({ payload }) => {
    window.dispatchEvent(new CustomEvent("scenario-discard", { detail: payload }))
  })

  registerAction("apply-copy-risk-caps", ({ payload }) => {
    window.dispatchEvent(new CustomEvent("apply-copy-risk-caps", { detail: payload }))
  })

  registerAction("notify-mentor", async ({ payload }) => {
    await fetch("/api/copilot/notify-mentor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mentorId: payload?.mentorId, userId: "currentUser", entryId: payload?.entryId }),
    })
  })
}

export function CopilotProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    initCopilotWatchers(copilotBus)
    // copilotBus.startFlushLoop(persistCopilotEvents, 4000, 40)
    registerDefaultActions()
  }, [])
  return <>{children}</>
}
