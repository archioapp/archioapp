"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { computeDashboardState } from "./engine"
import { JADECAP_TEMPLATE } from "./templates/jadecap-ict-ny"
import type { MentorTemplate, MentorDashboardState } from "./types"

/**
 * useMentorDashboard -- Live state hook for the mentor operating system.
 * 
 * Ticks every 30 seconds to recompute session phase, conditions, and
 * entry model states based on the current time.
 * 
 * Supports "demo mode" which simulates an active killzone session
 * regardless of the real time, so the dashboard is always explorable.
 */
export function useMentorDashboard(templateId: string = "jadecap-ict-ny") {
  const template: MentorTemplate = useMemo(() => {
    switch (templateId) {
      case "jadecap-ict-ny":
      default:
        return JADECAP_TEMPLATE
    }
  }, [templateId])

  const [demoMode, setDemoMode] = useState(true) // Default to demo mode ON

  const [state, setState] = useState<MentorDashboardState>(() =>
    computeDashboardState(template, new Date(), demoMode)
  )

  // Tick every 30 seconds to recompute state
  useEffect(() => {
    const tick = () => setState(computeDashboardState(template, new Date(), demoMode))
    tick()
    const iv = setInterval(tick, 30_000)
    return () => clearInterval(iv)
  }, [template, demoMode])

  const toggleDemoMode = useCallback(() => {
    setDemoMode(prev => !prev)
  }, [])

  return { template, state, demoMode, toggleDemoMode }
}
