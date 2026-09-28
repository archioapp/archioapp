"use client"
import { useEffect, useRef } from "react"
import { CopilotSDK } from "@/lib/copilot/sdk"

export function useScenarioTelemetry(params: {
  scenarioId: string
  form: { entry?: number; sl?: number; tp?: number }
  instrument?: string
}) {
  const { scenarioId, form, instrument } = params
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      CopilotSDK.scenario.opened(scenarioId, { instrument })
      return
    }
    CopilotSDK.scenario.changed(scenarioId, form, { instrument })
  }, [scenarioId, form, instrument])

  return {
    onSave: () => CopilotSDK.scenario.saved(scenarioId, form, { instrument }),
    onCancel: () => CopilotSDK.scenario.cancelled(scenarioId, { instrument }),
  }
}
