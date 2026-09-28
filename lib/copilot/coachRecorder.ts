"use client"
import { useCoachProfile } from "@/lib/stores/coachProfile"

export const coachRecorder = {
  analyze: (instrument: string) => {
    useCoachProfile.getState().recordEvent({ type: "analyze", instrument, ts: Date.now() })
  },
  scenario: (p: { instrument: string; orderType: string; entry?: number; sl?: number; tp?: number; rr?: number }) => {
    useCoachProfile.getState().recordEvent({ type: "scenario", ...p, ts: Date.now() })
  },
  forecast: (instrument: string, link?: string) => {
    useCoachProfile.getState().recordEvent({ type: "forecast", instrument, link, ts: Date.now() })
  },
  copy: (instrument: string, mentor: string) => {
    useCoachProfile.getState().recordEvent({ type: "copy", instrument, mentor, ts: Date.now() })
  },
  result: (r: number, session?: "Asia" | "London" | "New York") => {
    useCoachProfile.getState().recordResult(r, session)
  },
}
