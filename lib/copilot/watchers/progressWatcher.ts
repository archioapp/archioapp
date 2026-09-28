import type { EventBus } from "@/lib/copilot/eventBus"
import type { CopilotSuggestion } from "@/lib/copilot/types"
import { generateUUID } from "@/lib/utils/uuid"

const uid = () => generateUUID()

export function initProgressWatcher(bus: EventBus, push: (s: CopilotSuggestion) => void) {
  const timers = new Map<string, NodeJS.Timeout>() // key by instrument or scenarioId

  bus.on("scenario:opened", (e) => {
    const key = String(e.data?.scenarioId ?? e.context?.instrument ?? "global")
    clearTimeout(timers.get(key)!)
    timers.set(
      key,
      setTimeout(() => {
        push({
          id: uid(),
          ts: Date.now(),
          title: "Finish your setup?",
          detail: "You started a scenario but didn't complete it.",
          severity: "info",
          source: "progress",
          actions: [
            { id: "reopen-scenario", label: "Reopen", payload: { scenarioId: e.data?.scenarioId } },
            { id: "discard-scenario", label: "Discard", payload: { scenarioId: e.data?.scenarioId } },
          ],
          sticky: true,
        })
      }, 90_000), // 90s idle -> nudge
    )
  })

  const clear = (e: any) => {
    const key = String(e.data?.scenarioId ?? e.context?.instrument ?? "global")
    clearTimeout(timers.get(key)!)
  }
  bus.on("scenario:saved", clear)
  bus.on("scenario:cancelled", clear)
}
