"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { RealTimeDataProvider } from "./RealTimeDataProvider"
import { usePerformanceMonitor, debounce, throttle } from "@/lib/utils/performance"
import { useStrategyAnalytics, usePsychologyAnalytics, useActivityAnalytics } from "@/hooks/useRealTimeAnalytics"

type CopilotView = "activity" | "strategy" | "psychology" | "chat"

// Memoized tab component to prevent unnecessary re-renders
const MemoizedTab = React.memo(
  ({
    tab,
    isActive,
    onClick,
  }: {
    tab: { id: CopilotView; label: string; badge: number; icon: React.ReactNode }
    isActive: boolean
    onClick: () => void
  }) => {
    return (
      <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
          isActive
            ? "bg-purple-500/30 text-purple-200 border border-purple-500/40"
            : "text-white/60 hover:text-white/80 hover:bg-white/10"
        }`}
      >
        {tab.icon}
        <span>{tab.label}</span>
        {tab.badge > 0 && (
          <div className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-300 rounded-full border border-red-500/30 min-w-[18px] text-center">
            {tab.badge > 99 ? "99+" : tab.badge}
          </div>
        )}
      </button>
    )
  },
)

MemoizedTab.displayName = "MemoizedTab"

// Lazy-loaded content components
const LazyActivityNotifications = React.lazy(() =>
  import("./ActivityNotifications").then((module) => ({ default: module.ActivityNotifications })),
)

const LazyStrategyAnalytics = React.lazy(() =>
  import("./analytics/StrategyAnalytics").then((module) => ({ default: module.StrategyAnalytics })),
)

const LazyPsychologyAnalytics = React.lazy(() =>
  import("./analytics/PsychologyAnalytics").then((module) => ({ default: module.PsychologyAnalytics })),
)

const LazyCopilotChatPanel = React.lazy(() =>
  import("./chat/CopilotChatPanel").then((module) => ({ default: module.CopilotChatPanel })),
)

export function OptimizedCopilotRightRail() {
  const { startMeasure, endMeasure } = usePerformanceMonitor("CopilotRightRail")

  const [activeView, setActiveView] = useState<CopilotView>("activity")
  const [isExpanded, setIsExpanded] = useState(true)
  const [chatThreadType, setChatThreadType] = useState<"general" | "strategy" | "psychology">("general")

  const strategyData = useStrategyAnalytics()
  const psychologyData = usePsychologyAnalytics()
  const activityData = useActivityAnalytics()

  const tabs = useMemo(
    () => [
      {
        id: "activity" as const,
        label: "Activity",
        badge: activityData.unreadCount,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7h5l-5-5v5z" />
          </svg>
        ),
      },
      {
        id: "strategy" as const,
        label: "Strategy",
        badge: strategyData.counts.scenarios,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
      {
        id: "psychology" as const,
        label: "Psychology",
        badge: Math.round(psychologyData.counts.moodChecks7d / 7),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        ),
      },
    ],
    [activityData.unreadCount, strategyData.counts.scenarios, psychologyData.counts.moodChecks7d],
  )

  const debouncedSetActiveView = useCallback(debounce(setActiveView, 100), [])

  const throttledToggleExpansion = useCallback(
    throttle(() => setIsExpanded((prev) => !prev), 200),
    [],
  )

  const handleChatSeed = useCallback(
    (e: CustomEvent) => {
      const { threadType } = e.detail
      setChatThreadType(threadType || "general")
      debouncedSetActiveView("chat")
    },
    [debouncedSetActiveView],
  )

  const handleChatAsk = useCallback(
    (e: CustomEvent) => {
      const { threadType } = e.detail
      setChatThreadType(threadType || "general")
      debouncedSetActiveView("chat")
    },
    [debouncedSetActiveView],
  )

  useEffect(() => {
    window.addEventListener("copilot:chat:seed", handleChatSeed as EventListener)
    window.addEventListener("copilot:chat:ask", handleChatAsk as EventListener)

    return () => {
      window.removeEventListener("copilot:chat:seed", handleChatSeed as EventListener)
      window.removeEventListener("copilot:chat:ask", handleChatAsk as EventListener)
    }
  }, [handleChatSeed, handleChatAsk])

  useEffect(() => {
    const startTime = startMeasure()
    return () => endMeasure(startTime)
  })

  const renderContent = useMemo(() => {
    const commonProps = {
      fallback: <div className="flex items-center justify-center h-32 text-white/60">Loading...</div>,
    }

    switch (activeView) {
      case "activity":
        return (
          <React.Suspense {...commonProps}>
            <LazyActivityNotifications />
          </React.Suspense>
        )
      case "strategy":
        return (
          <React.Suspense {...commonProps}>
            <LazyStrategyAnalytics data={strategyData} />
          </React.Suspense>
        )
      case "psychology":
        return (
          <React.Suspense {...commonProps}>
            <LazyPsychologyAnalytics data={psychologyData} />
          </React.Suspense>
        )
      case "chat":
        return (
          <React.Suspense {...commonProps}>
            <LazyCopilotChatPanel threadType={chatThreadType} />
          </React.Suspense>
        )
      default:
        return null
    }
  }, [activeView, strategyData, psychologyData, chatThreadType])

  return (
    <RealTimeDataProvider>
      <div className={`relative h-full transition-all duration-500 ${isExpanded ? "w-96" : "w-16"}`}>
        <div className="relative h-full bg-black/40 backdrop-blur-xl border-l border-white/10">
          {/* Header */}
          <div className="relative p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                {isExpanded && (
                  <div>
                    <div className="text-sm font-bold text-white">AI Copilot</div>
                    <div className="text-xs text-purple-300">Optimized System</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isExpanded && (
                  <button
                    onClick={() => debouncedSetActiveView("chat")}
                    className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                )}

                <button
                  onClick={throttledToggleExpansion}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-all duration-200"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            {isExpanded && (
              <div className="mt-4">
                <div className="flex gap-1 p-1 bg-black/20 rounded-lg backdrop-blur-sm">
                  {tabs.map((tab) => (
                    <MemoizedTab
                      key={tab.id}
                      tab={tab}
                      isActive={activeView === tab.id}
                      onClick={() => debouncedSetActiveView(tab.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          {isExpanded && <div className="h-[calc(100%-120px)]">{renderContent}</div>}

          {/* Collapsed State */}
          {!isExpanded && (
            <div className="p-2 space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    debouncedSetActiveView(tab.id)
                    setIsExpanded(true)
                  }}
                  className={`w-full p-3 rounded-lg transition-all duration-300 relative ${
                    activeView === tab.id
                      ? "bg-purple-500/30 text-purple-200 border border-purple-500/40"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80"
                  }`}
                >
                  {tab.icon}
                  {tab.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {tab.badge > 9 ? "9+" : tab.badge}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </RealTimeDataProvider>
  )
}
