"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { confluenceById, technicalConfluences, type Confluence, type ConfluenceId } from "@/lib/confluences"

export type ConfluenceStatus = {
  active: boolean
  strength: number // 0-100 global strength mapping for UI
  lastUpdated: number
  levels?: number[]
  // New live properties from price engine
  liveDescription?: string
  liveLevels?: number[]
  liveZone?: "Premium" | "Discount" | string
  livePercentage?: number
  liveStatusDetails?: Record<string, any>
}

type ConfidenceTier = "low" | "medium" | "high"

export interface CustomConfluence extends Confluence {
  isCustom: true
  createdAt: number
  updatedAt: number
  createdBy: string
  validationRules?: {
    minPrice?: number
    maxPrice?: number
    timeframe?: string[]
    instruments?: string[]
  }
  customParameters?: Record<string, any>
}

// Export the constants that were missing
export const RECOMMENDED_MAX_SELECTED = 6

// Export the utility function that was missing
export const strengthFromCount = (count: number): number => {
  return Math.min(100, Math.round((count / RECOMMENDED_MAX_SELECTED) * 100))
}

export interface ConfluenceStore {
  // Data
  systemConfluences: Confluence[]
  customConfluences: CustomConfluence[] // Updated type from Confluence to CustomConfluence
  // Selections
  selectedConfluences: ConfluenceId[]
  pinnedConfluences: ConfluenceId[] // shown in bottom bar (max 5 by UX)
  // Status map
  confluenceStatus: Record<string, ConfluenceStatus>
  // Realtime state
  isRealtimeActive: boolean
  realtimeInterval: NodeJS.Timeout | null
  // Derived
  getActiveConfluences: () => Confluence[]
  getConfidenceLevel: () => ConfidenceTier
  getGlobalStrength: () => number
  getConfluencesByType: (category: Confluence["category"]) => Confluence[]
  // Mutations
  toggleConfluence: (id: ConfluenceId) => void
  setSelectedConfluences: (ids: ConfluenceId[]) => void
  setPinnedConfluences: (ids: ConfluenceId[]) => void
  updateConfluenceStatus: (id: ConfluenceId, patch: Partial<ConfluenceStatus>) => void
  updateStatusesForPrice: (price: number, instrumentSymbol: string) => void
  // Realtime methods
  startRealtime: () => void
  stopRealtime: () => void
  // Validation hook
  validateConfluences: (price: number, time: Date) => void
}

const DEFAULT_PINNED: ConfluenceId[] = ["htf-structure", "liquidity-sweep", "bpr", "fvg", "pivot-points"]

export const useConfluenceStore = create<ConfluenceStore>()(
  persist(
    (set, get) => ({
      systemConfluences: technicalConfluences,
      customConfluences: [],
      selectedConfluences: [],
      pinnedConfluences: DEFAULT_PINNED,
      confluenceStatus: Object.fromEntries(
        technicalConfluences.map((c) => [
          c.id,
          { active: false, strength: 0, lastUpdated: Date.now() } satisfies ConfluenceStatus,
        ]),
      ),
      isRealtimeActive: false,
      realtimeInterval: null,
      getActiveConfluences: () => {
        const { selectedConfluences } = get()
        return selectedConfluences.map((id) => confluenceById.get(id)!).filter(Boolean)
      },
      getConfidenceLevel: () => {
        const count = get().selectedConfluences.length
        if (count <= 0) return "low"
        if (count === 1) return "low"
        if (count <= 3) return "medium"
        return "high"
      },
      getGlobalStrength: () => {
        const count = get().selectedConfluences.length
        return strengthFromCount(count)
      },
      getConfluencesByType: (category) => get().systemConfluences.filter((c) => c.category === category),
      toggleConfluence: (id) =>
        set((state) => {
          const exists = state.selectedConfluences.includes(id)
          const next = exists ? state.selectedConfluences.filter((x) => x !== id) : [...state.selectedConfluences, id]
          // Update strength globally for visual parity
          const strength = strengthFromCount(next.length)
          const confluenceStatus = { ...state.confluenceStatus }
          for (const key of Object.keys(confluenceStatus)) {
            confluenceStatus[key] = {
              ...confluenceStatus[key],
              strength: next.includes(key as ConfluenceId) ? strength : 0,
              lastUpdated: Date.now(),
            }
          }
          return { selectedConfluences: next, confluenceStatus }
        }),
      setSelectedConfluences: (ids) =>
        set((state) => {
          const strength = strengthFromCount(ids.length)
          const confluenceStatus = { ...state.confluenceStatus }
          for (const key of Object.keys(confluenceStatus)) {
            confluenceStatus[key] = {
              ...confluenceStatus[key],
              strength: ids.includes(key as ConfluenceId) ? strength : 0,
              lastUpdated: Date.now(),
            }
          }
          return { selectedConfluences: ids, confluenceStatus }
        }),
      setPinnedConfluences: (ids) => set({ pinnedConfluences: ids.slice(0, 5) }),
      updateConfluenceStatus: (id, patch) =>
        set((state) => ({
          confluenceStatus: {
            ...state.confluenceStatus,
            [id]: {
              ...state.confluenceStatus[id],
              ...patch,
              lastUpdated: Date.now(),
            },
          },
        })),
      updateStatusesForPrice: (price, instrumentSymbol) => {
        const { systemConfluences, confluenceStatus } = get()
        // Mock price engine updates for demo
        const newStatus = { ...confluenceStatus }
        for (const confluence of systemConfluences) {
          if (newStatus[confluence.id]) {
            // Simulate live updates based on price
            const mockStrength = Math.floor(Math.random() * 100)
            newStatus[confluence.id] = {
              ...newStatus[confluence.id],
              active: Math.random() > 0.5,
              liveDescription: `Live analysis for ${confluence.name} at ${price.toFixed(4)}`,
              liveZone: Math.random() > 0.5 ? "Premium" : "Discount",
              livePercentage: Math.floor(Math.random() * 100),
              lastUpdated: Date.now(),
            }
          }
        }
        set({ confluenceStatus: newStatus })
      },
      startRealtime: () => {
        const { isRealtimeActive, realtimeInterval } = get()
        if (isRealtimeActive && realtimeInterval) return // Already running

        const interval = setInterval(() => {
          // Simulate price updates for demo
          const mockPrice = 1.05 + (Math.random() - 0.5) * 0.01
          get().updateStatusesForPrice(mockPrice, "EURUSD")
        }, 5000) // Update every 5 seconds

        set({
          isRealtimeActive: true,
          realtimeInterval: interval,
        })
      },
      stopRealtime: () => {
        const { realtimeInterval } = get()
        if (realtimeInterval) {
          clearInterval(realtimeInterval)
        }
        set({
          isRealtimeActive: false,
          realtimeInterval: null,
        })
      },
      validateConfluences: (_price, _time) => {
        // Placeholder: apps can connect websockets to update active/levels here.
        // Keep Pivot Points logic unchanged elsewhere; we only set timestamps.
        set((state) => {
          const updated: Record<string, ConfluenceStatus> = { ...state.confluenceStatus }
          for (const id of Object.keys(updated)) {
            updated[id] = { ...updated[id], lastUpdated: Date.now() }
          }
          return { confluenceStatus: updated }
        })
      },
    }),
    {
      name: "confluence-store",
      partialize: (state) => ({
        selectedConfluences: state.selectedConfluences,
        pinnedConfluences: state.pinnedConfluences,
        // Don't persist realtime state
      }),
    },
  ),
)

// Export the convenience hook that was missing
export const useConfluences = () => {
  const store = useConfluenceStore()
  return {
    // Data
    systemConfluences: store.systemConfluences,
    customConfluences: store.customConfluences,
    selectedConfluences: store.selectedConfluences,
    pinnedConfluences: store.pinnedConfluences,
    confluenceStatus: store.confluenceStatus,
    isRealtimeActive: store.isRealtimeActive,

    // Derived getters
    activeConfluences: store.getActiveConfluences(),
    confidenceLevel: store.getConfidenceLevel(),
    globalStrength: store.getGlobalStrength(),

    // Methods
    getConfluencesByType: store.getConfluencesByType,
    toggleConfluence: store.toggleConfluence,
    setSelectedConfluences: store.setSelectedConfluences,
    setPinnedConfluences: store.setPinnedConfluences,
    updateConfluenceStatus: store.updateConfluenceStatus,
    updateStatusesForPrice: store.updateStatusesForPrice,
    validateConfluences: store.validateConfluences,
    startRealtime: store.startRealtime,
    stopRealtime: store.stopRealtime,
  }
}
