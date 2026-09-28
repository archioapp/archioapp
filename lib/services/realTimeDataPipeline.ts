"use client"

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

// Types for real-time data
export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
  bid: number
  ask: number
  spread: number
}

export interface TradingSignal {
  id: string
  symbol: string
  type: "BUY" | "SELL" | "HOLD"
  strength: number // 0-100
  confidence: number // 0-100
  timeframe: string
  reason: string
  timestamp: number
  price: number
  stopLoss?: number
  takeProfit?: number
}

export interface PsychologyMetric {
  timestamp: number
  mood: number // 0-100
  confidence: number // 0-100
  stress: number // 0-100
  focus: number // 0-100
  riskTolerance: number // 0-100
  decisionSpeed: number // milliseconds
}

export interface ActivityEvent {
  id: string
  type: "TRADE" | "ANALYSIS" | "MOOD_CHECK" | "SIGNAL" | "ALERT"
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  timestamp: number
  data?: any
  read: boolean
}

// Real-time data store
interface RealTimeDataStore {
  // Market data
  marketData: Record<string, MarketData>
  tradingSignals: TradingSignal[]
  psychologyMetrics: PsychologyMetric[]
  activityEvents: ActivityEvent[]

  // Connection status
  isConnected: boolean
  lastUpdate: number

  // Subscriptions
  subscribedSymbols: string[]

  // Actions
  updateMarketData: (symbol: string, data: MarketData) => void
  addTradingSignal: (signal: TradingSignal) => void
  addPsychologyMetric: (metric: PsychologyMetric) => void
  addActivityEvent: (event: ActivityEvent) => void
  markEventAsRead: (eventId: string) => void
  subscribeToSymbol: (symbol: string) => void
  unsubscribeFromSymbol: (symbol: string) => void
  setConnectionStatus: (connected: boolean) => void

  // Computed values
  getLatestPrice: (symbol: string) => number | null
  getLatestSignal: (symbol: string) => TradingSignal | null
  getUnreadEvents: () => ActivityEvent[]
  getCurrentMood: () => number
  getAverageConfidence: () => number
}

export const useRealTimeData = create<RealTimeDataStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    marketData: {},
    tradingSignals: [],
    psychologyMetrics: [],
    activityEvents: [],
    isConnected: false,
    lastUpdate: Date.now(),
    subscribedSymbols: ["EURUSD", "GBPUSD", "XAUUSD", "USDJPY"],

    // Actions
    updateMarketData: (symbol, data) => {
      set((state) => ({
        marketData: {
          ...state.marketData,
          [symbol]: data,
        },
        lastUpdate: Date.now(),
      }))
    },

    addTradingSignal: (signal) => {
      set((state) => ({
        tradingSignals: [signal, ...state.tradingSignals.slice(0, 49)], // Keep last 50
      }))
    },

    addPsychologyMetric: (metric) => {
      set((state) => ({
        psychologyMetrics: [metric, ...state.psychologyMetrics.slice(0, 99)], // Keep last 100
      }))
    },

    addActivityEvent: (event) => {
      set((state) => ({
        activityEvents: [event, ...state.activityEvents.slice(0, 199)], // Keep last 200
      }))
    },

    markEventAsRead: (eventId) => {
      set((state) => ({
        activityEvents: state.activityEvents.map((event) => (event.id === eventId ? { ...event, read: true } : event)),
      }))
    },

    subscribeToSymbol: (symbol) => {
      set((state) => ({
        subscribedSymbols: [...new Set([...state.subscribedSymbols, symbol])],
      }))
    },

    unsubscribeFromSymbol: (symbol) => {
      set((state) => ({
        subscribedSymbols: state.subscribedSymbols.filter((s) => s !== symbol),
      }))
    },

    setConnectionStatus: (connected) => {
      set({ isConnected: connected })
    },

    // Computed values
    getLatestPrice: (symbol) => {
      const data = get().marketData[symbol]
      return data ? data.price : null
    },

    getLatestSignal: (symbol) => {
      const signals = get().tradingSignals
      return signals.find((s) => s.symbol === symbol) || null
    },

    getUnreadEvents: () => {
      return get().activityEvents.filter((event) => !event.read)
    },

    getCurrentMood: () => {
      const metrics = get().psychologyMetrics
      return metrics.length > 0 ? metrics[0].mood : 50
    },

    getAverageConfidence: () => {
      const metrics = get().psychologyMetrics.slice(0, 10) // Last 10 metrics
      if (metrics.length === 0) return 50
      return metrics.reduce((sum, m) => sum + m.confidence, 0) / metrics.length
    },
  })),
)

// Real-time data pipeline class
class RealTimeDataPipeline {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private dataGenerationInterval: NodeJS.Timeout | null = null

  constructor() {
    this.connect()
    this.startDataGeneration() // For demo purposes
  }

  private connect() {
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo, we'll simulate the connection
      console.log("[v0] Connecting to real-time data pipeline...")

      // Simulate connection success
      setTimeout(() => {
        useRealTimeData.getState().setConnectionStatus(true)
        this.reconnectAttempts = 0
        this.startHeartbeat()
        console.log("[v0] Real-time data pipeline connected")
      }, 1000)
    } catch (error) {
      console.error("[v0] Failed to connect to data pipeline:", error)
      this.handleReconnect()
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`[v0] Reconnecting... Attempt ${this.reconnectAttempts}`)

      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error("[v0] Max reconnection attempts reached")
      useRealTimeData.getState().setConnectionStatus(false)
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      // Send heartbeat to maintain connection
      console.log("[v0] Heartbeat sent")
    }, 30000) // Every 30 seconds
  }

  private startDataGeneration() {
    // Generate realistic market data for demo
    const symbols = ["EURUSD", "GBPUSD", "XAUUSD", "USDJPY"]
    const baseRates = {
      EURUSD: 1.17,
      GBPUSD: 1.38,
      XAUUSD: 1950.0,
      USDJPY: 110.5,
    }

    this.dataGenerationInterval = setInterval(() => {
      const store = useRealTimeData.getState()

      symbols.forEach((symbol) => {
        const baseRate = baseRates[symbol as keyof typeof baseRates]
        const change = (Math.random() - 0.5) * 0.002 // ±0.2% change
        const newPrice = baseRate * (1 + change)

        const marketData: MarketData = {
          symbol,
          price: newPrice,
          change: change * baseRate,
          changePercent: change * 100,
          volume: Math.floor(Math.random() * 1000000),
          timestamp: Date.now(),
          bid: newPrice - 0.0001,
          ask: newPrice + 0.0001,
          spread: 0.0002,
        }

        store.updateMarketData(symbol, marketData)

        // Generate trading signals occasionally
        if (Math.random() < 0.1) {
          // 10% chance
          const signal: TradingSignal = {
            id: `signal_${Date.now()}_${Math.random()}`,
            symbol,
            type: Math.random() > 0.5 ? "BUY" : "SELL",
            strength: Math.floor(Math.random() * 100),
            confidence: Math.floor(Math.random() * 100),
            timeframe: ["M5", "M15", "H1", "H4"][Math.floor(Math.random() * 4)],
            reason: "Technical analysis pattern detected",
            timestamp: Date.now(),
            price: newPrice,
            stopLoss: newPrice * (Math.random() > 0.5 ? 0.99 : 1.01),
            takeProfit: newPrice * (Math.random() > 0.5 ? 1.02 : 0.98),
          }

          store.addTradingSignal(signal)

          // Add activity event for signal
          store.addActivityEvent({
            id: `event_${Date.now()}_${Math.random()}`,
            type: "SIGNAL",
            title: `${signal.type} Signal: ${symbol}`,
            description: `${signal.strength}% strength, ${signal.confidence}% confidence`,
            priority: signal.strength > 80 ? "HIGH" : signal.strength > 60 ? "MEDIUM" : "LOW",
            timestamp: Date.now(),
            data: signal,
            read: false,
          })
        }
      })

      // Generate psychology metrics occasionally
      if (Math.random() < 0.05) {
        // 5% chance
        const metric: PsychologyMetric = {
          timestamp: Date.now(),
          mood: Math.floor(Math.random() * 100),
          confidence: Math.floor(Math.random() * 100),
          stress: Math.floor(Math.random() * 100),
          focus: Math.floor(Math.random() * 100),
          riskTolerance: Math.floor(Math.random() * 100),
          decisionSpeed: Math.floor(Math.random() * 5000) + 1000,
        }

        store.addPsychologyMetric(metric)
      }
    }, 2000) // Update every 2 seconds
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.dataGenerationInterval) {
      clearInterval(this.dataGenerationInterval)
      this.dataGenerationInterval = null
    }

    useRealTimeData.getState().setConnectionStatus(false)
    console.log("[v0] Real-time data pipeline disconnected")
  }

  public subscribeToSymbol(symbol: string) {
    useRealTimeData.getState().subscribeToSymbol(symbol)
    console.log(`[v0] Subscribed to ${symbol}`)
  }

  public unsubscribeFromSymbol(symbol: string) {
    useRealTimeData.getState().unsubscribeFromSymbol(symbol)
    console.log(`[v0] Unsubscribed from ${symbol}`)
  }
}

// Singleton instance
let pipelineInstance: RealTimeDataPipeline | null = null

export const getRealTimeDataPipeline = () => {
  if (!pipelineInstance) {
    pipelineInstance = new RealTimeDataPipeline()
  }
  return pipelineInstance
}

// Hook for components to use real-time data
export const useMarketData = (symbol: string) => {
  return useRealTimeData((state) => state.marketData[symbol])
}

export const useTradingSignals = (symbol?: string) => {
  return useRealTimeData((state) =>
    symbol ? state.tradingSignals.filter((s) => s.symbol === symbol) : state.tradingSignals,
  )
}

export const usePsychologyMetrics = () => {
  return useRealTimeData((state) => state.psychologyMetrics)
}

export const useActivityEvents = () => {
  return useRealTimeData((state) => state.activityEvents)
}

export const useConnectionStatus = () => {
  return useRealTimeData((state) => state.isConnected)
}

// Initialize pipeline when module loads
if (typeof window !== "undefined") {
  getRealTimeDataPipeline()
}
