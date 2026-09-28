"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SessionName = "Asia" | "London" | "New York"

export type Strategy = {
  style: "scalp" | "day" | "swing" | "hybrid"
  sessions: SessionName[]
  riskPct: number // e.g. 0.5
  minRR: number // e.g. 1.5
  slPolicy: "structure" | "atr" | "swing"
  entries: ("market" | "limit" | "stop")[]
  confluences: string[] // e.g. ["OB","FVG","PDH/PDL"]
}

export type Psychology = {
  maxTradesPerSession: number
  dailyRiskCapPct: number
  cooldownMins: number
  focusMode: boolean
  accountability: boolean // notify me if I break rules
  autoJournal: boolean
}

type CoachState = {
  strategy: Strategy | null
  psychology: Psychology | null
  setStrategy: (s: Strategy) => void
  setPsychology: (p: Psychology) => void
  reset: () => void
}

export const useCoach = create<CoachState>()(
  persist(
    (set) => ({
      strategy: null,
      psychology: null,
      setStrategy: (s) => set({ strategy: s }),
      setPsychology: (p) => set({ psychology: p }),
      reset: () => set({ strategy: null, psychology: null }),
    }),
    { name: "coach.v1" },
  ),
)
