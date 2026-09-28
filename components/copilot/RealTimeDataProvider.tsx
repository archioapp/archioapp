"use client"

import { useEffect, type ReactNode } from "react"
import { getRealTimeDataPipeline, useRealTimeData } from "@/lib/services/realTimeDataPipeline"

interface RealTimeDataProviderProps {
  children: ReactNode
}

export function RealTimeDataProvider({ children }: RealTimeDataProviderProps) {
  const isConnected = useRealTimeData((state) => state.isConnected)

  useEffect(() => {
    // Initialize the real-time data pipeline
    const pipeline = getRealTimeDataPipeline()

    // Subscribe to default symbols
    const defaultSymbols = ["EURUSD", "GBPUSD", "XAUUSD", "USDJPY"]
    defaultSymbols.forEach((symbol) => {
      pipeline.subscribeToSymbol(symbol)
    })

    // Cleanup on unmount
    return () => {
      // Don't disconnect here as other components might still need it
      // pipeline.disconnect()
    }
  }, [])

  return (
    <>
      {children}

      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
            isConnected
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-xs font-medium">{isConnected ? "Live Data" : "Disconnected"}</span>
        </div>
      </div>
    </>
  )
}
