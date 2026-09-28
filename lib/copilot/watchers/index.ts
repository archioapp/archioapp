import type { EventBus } from "@/lib/copilot/eventBus"
import { useCopilotStore } from "@/lib/stores/copilotStore"
import { initRiskWatcher } from "./riskWatcher"
import { initProgressWatcher } from "./progressWatcher"
import { initCopyWatcher } from "./copyWatcher"

export function initCopilotWatchers(bus: EventBus) {
  const addSuggestion = useCopilotStore.getState().addSuggestion

  // Core watchers
  initRiskWatcher(bus, addSuggestion)
  initProgressWatcher(bus, addSuggestion)
  initCopyWatcher(bus, addSuggestion)

  // TODO: session/news watcher, confluence watcher, telemetry watcher...
}
