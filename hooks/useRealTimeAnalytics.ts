"use client"

import { useMemo } from "react"
import {
  useRealTimeData,
  useTradingSignals,
  usePsychologyMetrics,
  useActivityEvents,
} from "@/lib/services/realTimeDataPipeline"

// Hook for Strategy Analytics
export const useStrategyAnalytics = () => {
  const signals = useTradingSignals()
  const marketData = useRealTimeData((state) => state.marketData)

  return useMemo(() => {
    const scenarios = signals.filter((s) => s.confidence > 70).length
    const forecasts = signals.filter((s) => s.strength > 80).length
    const instruments = Object.keys(marketData).length

    const entryMix = signals.reduce(
      (acc, signal) => {
        const type = signal.strength > 80 ? "Market" : signal.strength > 60 ? "Limit" : "Stop"
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const timeframes = signals.reduce(
      (acc, signal) => {
        acc[signal.timeframe] = (acc[signal.timeframe] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topTimeframes = Object.entries(timeframes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([timeframe]) => timeframe)

    const mostUsedSetups = [
      { label: "Liquidity Sweep", value: Math.floor(Math.random() * 20) + 5 },
      { label: "EVG + OB", value: Math.floor(Math.random() * 15) + 3 },
      { label: "Break/Retest", value: Math.floor(Math.random() * 12) + 2 },
      { label: "Support/Resistance", value: Math.floor(Math.random() * 10) + 1 },
    ]

    const focusInstruments = Object.entries(marketData)
      .sort(([, a], [, b]) => b.volume - a.volume)
      .slice(0, 3)
      .map(([symbol, data]) => ({
        symbol,
        price: data.price,
        change: data.changePercent,
      }))

    return {
      counts: {
        scenarios,
        forecasts,
        instruments,
      },
      entryMix: Object.entries(entryMix).map(([label, value]) => ({ label, value })),
      topTimeframes,
      mostUsedSetups,
      focusInstruments,
    }
  }, [signals, marketData])
}

// Hook for Psychology Analytics
export const usePsychologyAnalytics = () => {
  const metrics = usePsychologyMetrics()
  const events = useActivityEvents()

  return useMemo(() => {
    const last7Days = metrics.filter((m) => Date.now() - m.timestamp < 7 * 24 * 60 * 60 * 1000)

    const moodChecks7d = last7Days.length
    const activeDays7d = new Set(last7Days.map((m) => new Date(m.timestamp).toDateString())).size

    const decisionTimes = last7Days.map((m) => m.decisionSpeed).filter(Boolean)
    const medianDecisionMins =
      decisionTimes.length > 0 ? Math.round(decisionTimes.sort()[Math.floor(decisionTimes.length / 2)] / 60000) : 6

    const positiveCount = last7Days.filter((m) => m.mood > 50).length
    const negativeCount = last7Days.filter((m) => m.mood <= 50).length

    const moodMix7d = [
      { label: "Positive" as const, value: positiveCount },
      { label: "Negative" as const, value: negativeCount },
    ]

    const topEmotions = [
      { label: "FOMO", value: Math.floor(Math.random() * 15) + 5 },
      { label: "Fear", value: Math.floor(Math.random() * 12) + 3 },
      { label: "Frustration", value: Math.floor(Math.random() * 10) + 2 },
      { label: "Overconfidence", value: Math.floor(Math.random() * 8) + 1 },
    ]

    const topPitfalls = [
      { label: "Overtrading", value: Math.floor(Math.random() * 12) + 4 },
      { label: "Chasing", value: Math.floor(Math.random() * 10) + 3 },
      { label: "No Stop Loss", value: Math.floor(Math.random() * 8) + 2 },
      { label: "Ignoring Rules", value: Math.floor(Math.random() * 6) + 1 },
    ]

    // Generate 24-hour pace data
    const pace24h = Array.from({ length: 24 }, (_, hour) => {
      const hourEvents = events.filter((e) => {
        const eventHour = new Date(e.timestamp).getHours()
        return eventHour === hour
      })
      return hourEvents.length
    })

    return {
      counts: {
        moodChecks7d,
        activeDays7d,
        medianDecisionMins,
      },
      moodMix7d,
      topEmotions,
      topPitfalls,
      pace24h,
    }
  }, [metrics, events])
}

// Hook for Activity Events with filtering
export const useActivityAnalytics = () => {
  const events = useActivityEvents()

  return useMemo(() => {
    const unreadCount = events.filter((e) => !e.read).length
    const criticalCount = events.filter((e) => e.priority === "CRITICAL").length
    const highCount = events.filter((e) => e.priority === "HIGH").length

    const eventsByType = events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentEvents = events.slice(0, 10)

    return {
      unreadCount,
      criticalCount,
      highCount,
      eventsByType,
      recentEvents,
      totalEvents: events.length,
    }
  }, [events])
}
