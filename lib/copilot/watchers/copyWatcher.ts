import type { EventBus } from "@/lib/copilot/eventBus"
import type { CopilotSuggestion } from "@/lib/copilot/types"
import { generateUUID } from "@/lib/utils/uuid"

const uid = () => generateUUID()

export function initCopyWatcher(bus: EventBus, push: (s: CopilotSuggestion) => void) {
  bus.on("mentor:copied", (e) => {
    const from = e.data?.mentorName as string | undefined
    push({
      id: uid(),
      ts: Date.now(),
      title: "Copied a mentor entry",
      detail: from ? `Mirroring ${from}. Apply risk caps and confirmation checks?` : "Apply risk caps and checks?",
      severity: "info",
      source: "copy",
      actions: [
        { id: "apply-copy-risk-caps", label: "Apply Caps", payload: { maxRiskPct: 0.5 } },
        { id: "notify-mentor", label: "Notify Mentor", payload: { mentorId: e.data?.mentorId } },
      ],
      sticky: false,
    })
  })
}
