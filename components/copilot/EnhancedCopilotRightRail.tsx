"use client"

import { useState, useEffect } from "react"
import { CopilotChatPanel } from "./chat/CopilotChatPanel"
import { ActivityNotifications } from "./ActivityNotifications"
import dynamic from "next/dynamic"

const StrategyAnalytics = dynamic(
  () => import("./analytics/StrategyAnalytics").then(m => ({ default: m.StrategyAnalytics })),
  { ssr: false }
)
const PsychologyAnalytics = dynamic(
  () => import("./analytics/PsychologyAnalytics").then(m => ({ default: m.PsychologyAnalytics })),
  { ssr: false }
)
import { RealTimeDataProvider } from "./RealTimeDataProvider"
import {
  HoverboardContainer,
  FloatingParticles,
  RippleEffect,
  GlowTracker,
  MorphingBackground,
  PulseGlow,
} from "@/components/ui/hoverboard-effects"
import { useStrategyAnalytics, usePsychologyAnalytics, useActivityAnalytics } from "@/hooks/useRealTimeAnalytics"

type CopilotView = "activity" | "strategy" | "psychology" | "chat"

export function EnhancedCopilotRightRail() {
  const [activeView, setActiveView] = useState<CopilotView>("activity")
  const [isExpanded, setIsExpanded] = useState(true)
  const [chatThreadType, setChatThreadType] = useState<"general" | "strategy" | "psychology">("general")

  // Real-time analytics data
  const strategyData = useStrategyAnalytics()
  const psychologyData = usePsychologyAnalytics()
  const activityData = useActivityAnalytics()

  // Auto-switch to chat when seeded
  useEffect(() => {
    const handleChatSeed = (e: CustomEvent) => {
      const { threadType } = e.detail
      setChatThreadType(threadType || "general")
      setActiveView("chat")
    }

    const handleChatAsk = (e: CustomEvent) => {
      const { threadType } = e.detail
      setChatThreadType(threadType || "general")
      setActiveView("chat")
    }

    window.addEventListener("copilot:chat:seed", handleChatSeed as EventListener)
    window.addEventListener("copilot:chat:ask", handleChatAsk as EventListener)

    return () => {
      window.removeEventListener("copilot:chat:seed", handleChatSeed as EventListener)
      window.removeEventListener("copilot:chat:ask", handleChatAsk as EventListener)
    }
  }, [])

  const tabs = [
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
  ]

  return (
    <RealTimeDataProvider>
      <div className={`relative h-full transition-all duration-500 ${isExpanded ? "w-96" : "w-16"}`}>
        {/* Morphing Background */}
        <MorphingBackground />

        {/* Floating Particles */}
        <FloatingParticles count={15} color="#8b5cf6" />

        <div className="relative h-full bg-black/40 backdrop-blur-xl border-l border-white/10">
          {/* Enhanced Header */}
          <div className="relative p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between">
              <HoverboardContainer intensity={0.5}>
                <div className="flex items-center gap-3">
                  <PulseGlow color="#8b5cf6" intensity={1}>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  </PulseGlow>
                  {isExpanded && (
                    <div>
                      <div className="text-sm font-bold text-white">AI Copilot</div>
                      <div className="text-xs text-purple-300">Enhanced Mirror System</div>
                    </div>
                  )}
                </div>
              </HoverboardContainer>

              <div className="flex items-center gap-2">
                {isExpanded && (
                  <RippleEffect>
                    <button
                      onClick={() => setActiveView("chat")}
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
                  </RippleEffect>
                )}

                <RippleEffect>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
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
                </RippleEffect>
              </div>
            </div>

            {/* Enhanced Tab Navigation */}
            {isExpanded && (
              <div className="mt-4">
                <div className="flex gap-1 p-1 bg-black/20 rounded-lg backdrop-blur-sm">
                  {tabs.map((tab) => (
                    <HoverboardContainer key={tab.id} intensity={0.3}>
                      <RippleEffect>
                        <button
                          onClick={() => setActiveView(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                            activeView === tab.id
                              ? "bg-purple-500/30 text-purple-200 border border-purple-500/40"
                              : "text-white/60 hover:text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {tab.icon}
                          <span>{tab.label}</span>
                          {tab.badge > 0 && (
                            <PulseGlow color="#ef4444" intensity={0.5}>
                              <div className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-300 rounded-full border border-red-500/30 min-w-[18px] text-center">
                                {tab.badge > 99 ? "99+" : tab.badge}
                              </div>
                            </PulseGlow>
                          )}
                        </button>
                      </RippleEffect>
                    </HoverboardContainer>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Content Area */}
          {isExpanded && (
            <div className="h-[calc(100%-120px)]">
              <GlowTracker glowColor="#8b5cf6">
                {activeView === "activity" && <ActivityNotifications />}
                {activeView === "strategy" && <StrategyAnalytics data={strategyData} />}
                {activeView === "psychology" && <PsychologyAnalytics data={psychologyData} />}
                {activeView === "chat" && <CopilotChatPanel threadType={chatThreadType} />}
              </GlowTracker>
            </div>
          )}

          {/* Collapsed State */}
          {!isExpanded && (
            <div className="p-2 space-y-3">
              {tabs.map((tab) => (
                <HoverboardContainer key={tab.id} intensity={0.5}>
                  <RippleEffect>
                    <button
                      onClick={() => {
                        setActiveView(tab.id)
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
                        <PulseGlow color="#ef4444" intensity={0.8}>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {tab.badge > 9 ? "9+" : tab.badge}
                          </div>
                        </PulseGlow>
                      )}
                    </button>
                  </RippleEffect>
                </HoverboardContainer>
              ))}
            </div>
          )}
        </div>
      </div>
    </RealTimeDataProvider>
  )
}
