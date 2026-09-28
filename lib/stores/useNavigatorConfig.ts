import { create } from "zustand"

export interface NavSection {
  id: string
  label: string
  customLabel?: string
  visible: boolean
  order: number
}

export interface NavGadget {
  id: string
  label: string
  description: string
  enabled: boolean
  icon: string // lucide icon name
}

const DEFAULT_SECTIONS: NavSection[] = [
  { id: "time-session", label: "Time & Session", visible: true, order: 0 },
  { id: "forex", label: "Forex", visible: true, order: 1 },
  { id: "indices", label: "Indices", visible: true, order: 2 },
  { id: "crypto", label: "Crypto", visible: true, order: 3 },
  { id: "commodities", label: "Commodities", visible: true, order: 4 },
  { id: "analyze", label: "Analyze", visible: true, order: 5 },
]

const DEFAULT_GADGETS: NavGadget[] = [
  { id: "spread-monitor", label: "Spread Monitor", description: "Live spread tracking for active pair", enabled: false, icon: "activity" },
  { id: "pip-calculator", label: "Pip Calculator", description: "Quick position sizing tool", enabled: false, icon: "calculator" },
  { id: "news-ticker", label: "News Ticker", description: "Scrolling economic events feed", enabled: false, icon: "rss" },
  { id: "correlation-map", label: "Correlation Map", description: "Real-time pair correlation matrix", enabled: false, icon: "git-branch" },
  { id: "economic-calendar", label: "Econ Calendar", description: "Upcoming high-impact events", enabled: false, icon: "calendar" },
  { id: "sentiment-gauge", label: "Sentiment Gauge", description: "Retail vs institutional positioning", enabled: false, icon: "gauge" },
  { id: "volatility-meter", label: "Volatility Meter", description: "ATR-based volatility tracking", enabled: false, icon: "bar-chart-2" },
  { id: "session-alerts", label: "Session Alerts", description: "Notifications at session opens", enabled: false, icon: "bell" },
]

interface NavigatorConfigState {
  sections: NavSection[]
  gadgets: NavGadget[]
  customizeOpen: boolean
  activeTab: "sections" | "gadgets" | "appearance"
  setCustomizeOpen: (open: boolean) => void
  setActiveTab: (tab: "sections" | "gadgets" | "appearance") => void
  toggleSection: (id: string) => void
  renameSection: (id: string, newLabel: string) => void
  reorderSections: (reordered: NavSection[]) => void
  toggleGadget: (id: string) => void
  resetSections: () => void
  resetGadgets: () => void
}

const loadFromStorage = (): NavSection[] | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem("navigator_config")
    if (raw) return JSON.parse(raw) as NavSection[]
  } catch { /* noop */ }
  return null
}

const saveToStorage = (sections: NavSection[]) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem("navigator_config", JSON.stringify(sections))
  } catch { /* noop */ }
}

const loadGadgets = (): NavGadget[] | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem("navigator_gadgets")
    if (raw) return JSON.parse(raw) as NavGadget[]
  } catch { /* noop */ }
  return null
}

const saveGadgets = (gadgets: NavGadget[]) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem("navigator_gadgets", JSON.stringify(gadgets))
  } catch { /* noop */ }
}

export const useNavigatorConfig = create<NavigatorConfigState>((set) => ({
  sections: loadFromStorage() || DEFAULT_SECTIONS,
  gadgets: loadGadgets() || DEFAULT_GADGETS,
  customizeOpen: false,
  activeTab: "sections",
  setCustomizeOpen: (open) => set({ customizeOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleSection: (id) =>
    set((state) => {
      const next = state.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
      saveToStorage(next)
      return { sections: next }
    }),

  renameSection: (id, newLabel) =>
    set((state) => {
      const next = state.sections.map((s) =>
        s.id === id ? { ...s, customLabel: newLabel || undefined } : s
      )
      saveToStorage(next)
      return { sections: next }
    }),

  reorderSections: (reordered) =>
    set(() => {
      const next = reordered.map((s, i) => ({ ...s, order: i }))
      saveToStorage(next)
      return { sections: next }
    }),

  toggleGadget: (id) =>
    set((state) => {
      const next = state.gadgets.map((g) =>
        g.id === id ? { ...g, enabled: !g.enabled } : g
      )
      saveGadgets(next)
      return { gadgets: next }
    }),

  resetSections: () =>
    set(() => {
      saveToStorage(DEFAULT_SECTIONS)
      return { sections: DEFAULT_SECTIONS }
    }),

  resetGadgets: () =>
    set(() => {
      saveGadgets(DEFAULT_GADGETS)
      return { gadgets: DEFAULT_GADGETS }
    }),
}))
