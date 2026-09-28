"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SessionName = "Asia" | "London" | "New York"
export type Style = "scalp" | "day" | "swing" | "position" | "hybrid"
export type Structure = "bullish" | "bearish" | "range" | "neutral"
export type Methodology = "ict" | "smc" | "price-action" | "supply-demand" | "vsa" | "indicator" | "custom"
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "professional"
export type MarketType = "forex" | "indices" | "crypto" | "commodities" | "stocks"

// ═══ TRADING IDENTITY ═══
export interface TradingIdentity {
  style: Style
  methodology: Methodology
  methodologyCustom?: string
  experienceLevel: ExperienceLevel
  experienceYears: number
  markets: MarketType[]
  primaryInstruments: string[]
  tradingGoal: string
  weeklyHoursAvailable: number
}

// ═══ STRATEGY FRAMEWORK ═══
export interface StrategyProfile {
  style: Style
  minRR: number
  riskPerTrade: number
  preferredSessions: SessionName[]
  entryTypes: ("market" | "limit" | "stop")[]
  slPolicy: "swing" | "structure" | "atr" | "fixed" | "custom"
  newsFilterMins: number
  confluences: string[]
  invalidationNote?: string
  // Extended fields
  analysisTimeframes: string[]
  entryTimeframes: string[]
  tpStrategy: "fixed-rr" | "structure" | "trail" | "partial" | "custom"
  maxTradesPerDay: number
  scaleInto: boolean
  counterTrendAllowed: boolean
  tradingRules: TradingRule[]
}

export interface TradingRule {
  id: string
  text: string
  category: "entry" | "exit" | "risk" | "session" | "mindset"
  importance: "critical" | "important" | "preference"
  adherence?: number
  violations?: number
  streak?: number
}

// ═══ RISK PARAMETERS ═══
export interface RiskParameters {
  riskPerTrade: number
  dailyLossCap: number
  weeklyLossCap: number
  maxTradesPerSession: number
  maxTradesPerDay: number
  maxExposurePercent: number
  maxCorrelatedPairs: number
  weeklyRTarget: number
  drawdownLimit: number
  scaleIntoPositions: boolean
}

// ═══ PSYCHOLOGY SELF-ASSESSMENT ═══
export interface PsychologyProfile {
  riskCapDaily: number
  maxTradesPerSession: number
  cooldownAfterLossMins: number
  focusMode: boolean
  lastCheckIn?: { mood: number; sleep: number; stress: number; note?: string; ts: number }
  cooldownUntil?: number
  // Extended fields
  afterLossBehavior: "wait" | "reduce-size" | "re-enter" | "increase-size" | "next-session"
  biggestWeakness: string[]
  winningStreakBehavior: "disciplined" | "increase-size" | "loosen-rules" | "take-break"
  selfDisciplineRating: number
  selfPatienceRating: number
  journalHabit: "always" | "sometimes" | "never"
  emotionalTriggers: string[]
  strengthAreas: string[]
  preSessionRoutine: string[]
  postSessionRoutine: string[]
}

// ═══ ONBOARDING STATE ═══
export interface OnboardingState {
  completed: boolean
  completedAt?: number
  currentPhase: number // 0-4
  phasesCompleted: boolean[]
  version: number // for schema migration
}

export interface CoachStats {
  total: number
  wins: number
  losses: number
  avgR: number
  last7R: number[]
  bySession: Partial<Record<SessionName, { total: number; wins: number; losses: number }>>
}

type UserEvent =
  | { type: "analyze"; instrument: string; ts: number }
  | {
      type: "scenario"
      instrument: string
      orderType: string
      entry?: number
      sl?: number
      tp?: number
      rr?: number
      ts: number
    }
  | { type: "forecast"; instrument: string; link?: string; ts: number }
  | { type: "copy"; instrument: string; mentor: string; ts: number }
  | { type: "result"; r: number; ts: number; session?: SessionName }

interface CoachState {
  identity: TradingIdentity
  strategy: StrategyProfile
  risk: RiskParameters
  psych: PsychologyProfile
  onboarding: OnboardingState
  stats: CoachStats
  events: UserEvent[]
  // actions
  setIdentity: (p: Partial<TradingIdentity>) => void
  setStrategy: (p: Partial<StrategyProfile>) => void
  setRisk: (p: Partial<RiskParameters>) => void
  setPsych: (p: Partial<PsychologyProfile>) => void
  setOnboarding: (p: Partial<OnboardingState>) => void
  addTradingRule: (rule: TradingRule) => void
  removeTradingRule: (id: string) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  recordEvent: (e: UserEvent) => void
  recordResult: (r: number, session?: SessionName) => void
  startCooldown: (mins: number) => void
  clearCooldown: () => void
  exportProfile: () => any
}

export const useCoachProfile = create<CoachState>()(
  persist(
    (set, get) => ({
      identity: {
        style: "day",
        methodology: "price-action",
        experienceLevel: "intermediate",
        experienceYears: 1,
        markets: ["forex"],
        primaryInstruments: [],
        tradingGoal: "",
        weeklyHoursAvailable: 20,
      },
      strategy: {
        style: "day",
        minRR: 1.5,
        riskPerTrade: 0.5,
        preferredSessions: ["London", "New York"],
        entryTypes: ["limit"],
        slPolicy: "structure",
        newsFilterMins: 15,
        confluences: [],
        analysisTimeframes: ["H4", "H1"],
        entryTimeframes: ["M15", "M5"],
        tpStrategy: "structure",
        maxTradesPerDay: 3,
        scaleInto: false,
        counterTrendAllowed: false,
        tradingRules: [],
      },
      risk: {
        riskPerTrade: 0.5,
        dailyLossCap: 2.0,
        weeklyLossCap: 5.0,
        maxTradesPerSession: 3,
        maxTradesPerDay: 5,
        maxExposurePercent: 3.0,
        maxCorrelatedPairs: 2,
        weeklyRTarget: 4,
        drawdownLimit: 10,
        scaleIntoPositions: false,
      },
      psych: {
        riskCapDaily: 2.0,
        maxTradesPerSession: 3,
        cooldownAfterLossMins: 15,
        focusMode: false,
        afterLossBehavior: "wait",
        biggestWeakness: [],
        winningStreakBehavior: "disciplined",
        selfDisciplineRating: 5,
        selfPatienceRating: 5,
        journalHabit: "sometimes",
        emotionalTriggers: [],
        strengthAreas: [],
        preSessionRoutine: [],
        postSessionRoutine: [],
      },
      onboarding: {
        completed: false,
        currentPhase: 0,
        phasesCompleted: [false, false, false, false, false],
        version: 1,
      },
      stats: { total: 0, wins: 0, losses: 0, avgR: 0, last7R: [], bySession: {} },
      events: [],

      setIdentity: (p) => set((s) => ({ identity: { ...s.identity, ...p } })),
      setStrategy: (p) => set((s) => ({ strategy: { ...s.strategy, ...p } })),
      setRisk: (p) => set((s) => ({ risk: { ...s.risk, ...p } })),
      setPsych: (p) => set((s) => ({ psych: { ...s.psych, ...p } })),
      setOnboarding: (p) => set((s) => ({ onboarding: { ...s.onboarding, ...p } })),
      addTradingRule: (rule) => set((s) => ({ strategy: { ...s.strategy, tradingRules: [...s.strategy.tradingRules, rule] } })),
      removeTradingRule: (id) => set((s) => ({ strategy: { ...s.strategy, tradingRules: s.strategy.tradingRules.filter((r) => r.id !== id) } })),
      completeOnboarding: () => set((s) => ({ onboarding: { ...s.onboarding, completed: true, completedAt: Date.now(), phasesCompleted: [true, true, true, true, true] } })),
      resetOnboarding: () => set({ onboarding: { completed: false, currentPhase: 0, phasesCompleted: [false, false, false, false, false], version: 1 } }),
      recordEvent: (e) =>
        set((s) => {
          const next = [e, ...s.events].slice(0, 300)
          return { events: next }
        }),
      recordResult: (r, session) =>
        set((s) => {
          const wins = s.stats.wins + (r > 0 ? 1 : 0)
          const losses = s.stats.losses + (r <= 0 ? 1 : 0)
          const total = s.stats.total + 1
          const avgR = (s.stats.avgR * s.stats.total + r) / total
          const last7R = [r, ...s.stats.last7R].slice(0, 7)
          const bySession = { ...s.stats.bySession }
          if (session) {
            const bucket = bySession[session] || { total: 0, wins: 0, losses: 0 }
            bucket.total += 1
            if (r > 0) bucket.wins += 1
            else bucket.losses += 1
            bySession[session] = bucket as any
          }
          return { stats: { total, wins, losses, avgR, last7R, bySession } }
        }),
      startCooldown: (mins) => set((s) => ({ psych: { ...s.psych, cooldownUntil: Date.now() + mins * 60_000 } })),
      clearCooldown: () => set((s) => ({ psych: { ...s.psych, cooldownUntil: undefined } })),
      exportProfile: () => {
        const { identity, strategy, risk, psych, stats, onboarding } = get()
        return { identity, strategy, risk, psych, stats, onboarding }
      },
    }),
    { name: "coach.profile.v1" },
  ),
)
