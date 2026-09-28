"use client"

import { useState, useEffect, Component, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { CopilotActivityConsole } from "../activity/CopilotActivityConsole"
import { CopilotAIView } from "../ai/CopilotAIView"
import { EdgeAnalytics } from "./EdgeAnalytics"

const StrategyAnalytics = dynamic(
  () => import("./StrategyAnalytics").then(m => ({ default: m.StrategyAnalytics })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" /></div> }
)

const PsychologyAnalytics = dynamic(
  () => import("./PsychologyAnalytics").then(m => ({ default: m.PsychologyAnalytics })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" /></div> }
)

/* ── Error Boundary to prevent tab crashes from killing the app ── */
class TabErrorBoundary extends Component<{ children: ReactNode; tab: string }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error) { console.error(`[v0] ${this.props.tab} tab crashed:`, error) }
  render() {
    if (this.state.error) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="text-[11px] text-red-400/70 font-mono">Tab Error</div>
            <div className="text-[10px] text-white/30 max-w-[200px]">{this.state.error.message}</div>
            <button onClick={() => this.setState({ error: null })} className="text-[10px] text-cyan-400/60 hover:text-cyan-400 underline">Retry</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export interface CopilotAnalyticsSnapshot {
  activity: {
    counts: {
      alertsToday: number
      actionsCompleted: number
      avgResponseTime: number
    }
    recentAlerts: Array<{
      id: string
      title: string
      message: string
      timestamp: number
      category: "trading" | "market" | "system"
      priority: "high" | "medium" | "low"
      metadata?: {
        instrument?: string
        value?: number
        change?: number
      }
    }>
    activityByHour: Array<number>
    topCategories: Array<{ label: string; value: number }>
  }
  strategy: {
    counts: {
      scenariosOpen: number
      forecastsOpen: number
      instrumentsActive: number
    }
    entryMix: Array<{ label: "market" | "limit" | "stop"; value: number }>
    timeframes: Array<{ label: string; value: number }>
    topModels: Array<{ label: string; value: number }>
    instruments: Array<{ symbol: string; count: number }>
    openForecasts: Array<{ id: string; instrument: string; status: "draft" | "published"; createdAt: number }>
  }
  psychology: {
    counts: {
      moodChecks7d: number
      activeDays7d: number
      medianDecisionMins: number
    }
    moodMix7d: Array<{ label: "Positive" | "Negative"; value: number }>
    topEmotions: Array<{ label: string; value: number }>
    topPitfalls: Array<{ label: string; value: number }>
    pace24h?: Array<number>
  }
}

interface CopilotAnalyticsProps {
  activeTab: "activity" | "strategy" | "psychology" | "ai" | "edge"
  externalSnapshot?: CopilotAnalyticsSnapshot | null
}

export function CopilotAnalytics({ activeTab, externalSnapshot }: CopilotAnalyticsProps) {
  const [snapshot, setSnapshot] = useState<CopilotAnalyticsSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // If external snapshot is provided, use it immediately
  useEffect(() => {
    if (externalSnapshot !== undefined) {
      if (externalSnapshot) {
        setSnapshot(externalSnapshot)
        setIsLoading(false)
      }
      // when cleared (null), let the default sample data take over -- it's already loaded
    }
  }, [externalSnapshot])

  useEffect(() => {
    // Expose global setter
    if (typeof window !== "undefined") {
      window.copilotAnalytics = {
        setSnapshot: (newSnapshot: CopilotAnalyticsSnapshot) => {
          setSnapshot(newSnapshot)
        },
      }

      const sampleSnapshot: CopilotAnalyticsSnapshot = {
        activity: {
          counts: {
            alertsToday: 12,
            actionsCompleted: 8,
            avgResponseTime: 4,
          },
          recentAlerts: [
            {
              id: "1",
              title: "Major Support Break",
              message: "EURUSD has broken below key support at 1.0850. Consider reviewing open positions.",
              timestamp: Date.now() - 300000,
              category: "trading",
              priority: "high",
              metadata: {
                instrument: "EURUSD",
                value: 1.0845,
                change: -0.0012,
              },
            },
            {
              id: "2",
              title: "Market Volatility Alert",
              message: "Increased volatility detected across major pairs. Risk management protocols activated.",
              timestamp: Date.now() - 600000,
              category: "market",
              priority: "medium",
            },
            {
              id: "3",
              title: "Session Transition",
              message: "London session opening in 15 minutes. Prepare for increased liquidity.",
              timestamp: Date.now() - 900000,
              category: "system",
              priority: "low",
            },
            {
              id: "4",
              title: "Price Action Signal",
              message: "GBPUSD showing bullish engulfing pattern on H1 timeframe.",
              timestamp: Date.now() - 1200000,
              category: "trading",
              priority: "medium",
              metadata: {
                instrument: "GBPUSD",
                value: 1.2645,
                change: 0.0023,
              },
            },
          ],
          activityByHour: [2, 1, 0, 0, 1, 3, 5, 4, 2, 3, 4, 5, 3, 2, 4, 6, 5, 3, 2, 1, 1, 2, 1, 1],
          topCategories: [
            { label: "Trading", value: 7 },
            { label: "Market", value: 3 },
            { label: "System", value: 2 },
          ],
        },
        strategy: {
          counts: { scenariosOpen: 3, forecastsOpen: 2, instrumentsActive: 4 },
          entryMix: [
            { label: "market", value: 2 },
            { label: "limit", value: 5 },
            { label: "stop", value: 1 },
          ],
          timeframes: [
            { label: "M1", value: 1 },
            { label: "M5", value: 3 },
            { label: "M15", value: 4 },
            { label: "H1", value: 2 },
          ],
          topModels: [
            { label: "Liquidity Sweep", value: 4 },
            { label: "FVG + OB", value: 3 },
            { label: "Break/Retest", value: 2 },
          ],
          instruments: [
            { symbol: "EURUSD", count: 7 },
            { symbol: "GBPUSD", count: 4 },
            { symbol: "XAUUSD", count: 3 },
          ],
          openForecasts: [
            { id: "F-1021", instrument: "EURUSD", status: "published", createdAt: 1715000000000 },
            { id: "F-1022", instrument: "GBPUSD", status: "draft", createdAt: 1715100000000 },
          ],
        },
        psychology: {
          counts: { moodChecks7d: 9, activeDays7d: 5, medianDecisionMins: 6 },
          moodMix7d: [
            { label: "Positive", value: 6 },
            { label: "Negative", value: 3 },
          ],
          topEmotions: [
            { label: "FOMO", value: 3 },
            { label: "Fear of losing", value: 2 },
            { label: "Frustration", value: 2 },
          ],
          topPitfalls: [
            { label: "Overtrading", value: 2 },
            { label: "Chasing trades", value: 2 },
            { label: "Didn't follow rules", value: 1 },
          ],
          pace24h: [0, 1, 0, 0, 0, 2, 3, 1, 0, 0, 1, 2, 0, 1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0],
        },
      }

      // Set sample data after a short delay to simulate loading
      setTimeout(() => {
        setSnapshot(sampleSnapshot)
        setIsLoading(false)
      }, 1000)
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.copilotAnalytics
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <div className="text-xs text-white/60">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (activeTab === "activity") {
    return <TabErrorBoundary tab="Activity"><CopilotActivityConsole /></TabErrorBoundary>
  }

  if (activeTab === "strategy") {
    return <TabErrorBoundary tab="Strategy"><StrategyAnalytics data={snapshot?.strategy} /></TabErrorBoundary>
  }

  if (activeTab === "psychology") {
    return <TabErrorBoundary tab="Psychology"><PsychologyAnalytics data={snapshot?.psychology} /></TabErrorBoundary>
  }

  if (activeTab === "ai") {
    return <TabErrorBoundary tab="AI"><CopilotAIView /></TabErrorBoundary>
  }

  if (activeTab === "edge") {
    return <TabErrorBoundary tab="Edge"><EdgeAnalytics /></TabErrorBoundary>
  }

  return null
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    copilotAnalytics?: {
      setSnapshot: (snapshot: CopilotAnalyticsSnapshot) => void
    }
  }
}
