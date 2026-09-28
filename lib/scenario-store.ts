import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface TradingScenario {
  id: string
  pair: string
  position: "Buy Position" | "Sell Position"
  probability: "High Probability" | "Medium Probability" | "Low Probability"
  level: string
  rr: string
  sl: string
  tp: string
  confluences: { text: string; tooltip?: string }[]
  aiConfidence: number
  relevantPairs: string[]
  createdAt: string
  updatedAt: string
  source: "forecast" | "terminal" | "manual"
  chartData?: {
    screenshotUrl?: string
    commentary?: string
  }
  notes?: string
}

interface ScenarioStore {
  scenarios: TradingScenario[]
  selectedScenarioId: string | null

  // Actions
  addScenario: (scenario: Omit<TradingScenario, "id" | "createdAt" | "updatedAt">) => TradingScenario
  updateScenario: (id: string, updates: Partial<TradingScenario>) => void
  deleteScenario: (id: string) => void
  selectScenario: (id: string | null) => void
  getScenariosByPair: (pair: string) => TradingScenario[]
  getScenarioById: (id: string) => TradingScenario | undefined
  syncScenarioToTerminal: (scenarioId: string) => void

  // Forecast integration
  createScenarioFromForecast: (forecastData: {
    pair: string
    direction: string
    confluences: string[]
    commentary: string
    screenshotUrl?: string
  }) => TradingScenario

  // Terminal integration
  createScenarioFromTerminal: (terminalData: {
    pair: string
    position: "Buy Position" | "Sell Position"
    entry: string
    sl: string
    tp: string
    confluences?: string[]
  }) => TradingScenario
}

// Calculate R/R ratio helper function
const calculateRR = (entry: string, sl: string, tp: string, position: "Buy Position" | "Sell Position"): string => {
  const entryPrice = Number.parseFloat(entry)
  const stopLoss = Number.parseFloat(sl)
  const takeProfit = Number.parseFloat(tp)

  if (!entryPrice || !stopLoss || !takeProfit) {
    return "1:0"
  }

  let risk: number
  let reward: number

  if (position === "Buy Position") {
    risk = Math.abs(entryPrice - stopLoss)
    reward = Math.abs(takeProfit - entryPrice)
  } else {
    risk = Math.abs(stopLoss - entryPrice)
    reward = Math.abs(entryPrice - takeProfit)
  }

  if (risk === 0) {
    return "1:0"
  }

  const ratio = reward / risk
  return `1:${ratio.toFixed(2)}`
}

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set, get) => ({
      scenarios: [],
      selectedScenarioId: null,

      addScenario: (scenarioData) => {
        const scenario: TradingScenario = {
          ...scenarioData,
          id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rr: calculateRR(scenarioData.level, scenarioData.sl, scenarioData.tp, scenarioData.position),
        }

        set((state) => ({
          scenarios: [...state.scenarios, scenario],
        }))

        // Notify terminal about new scenario
        window.dispatchEvent(
          new CustomEvent("scenario:created", {
            detail: scenario,
          }),
        )

        // Notify execution copilot specifically
        window.dispatchEvent(
          new CustomEvent("execution:scenario-available", {
            detail: {
              scenarios: [scenario],
              source: "store",
            },
          }),
        )

        return scenario
      },

      updateScenario: (id, updates) => {
        set((state) => ({
          scenarios: state.scenarios.map((scenario) => {
            if (scenario.id === id) {
              const updatedScenario = {
                ...scenario,
                ...updates,
                updatedAt: new Date().toISOString(),
              }

              // Recalculate R/R if relevant fields changed
              if (updates.level || updates.sl || updates.tp || updates.position) {
                updatedScenario.rr = calculateRR(
                  updatedScenario.level,
                  updatedScenario.sl,
                  updatedScenario.tp,
                  updatedScenario.position,
                )
              }

              // Notify execution copilot about update
              window.dispatchEvent(
                new CustomEvent("execution:scenario-updated", {
                  detail: {
                    scenario: updatedScenario,
                    source: "store",
                  },
                }),
              )

              return updatedScenario
            }
            return scenario
          }),
        }))

        // Notify about update
        window.dispatchEvent(
          new CustomEvent("scenario:updated", {
            detail: { id, updates },
          }),
        )
      },

      deleteScenario: (id) => {
        set((state) => ({
          scenarios: state.scenarios.filter((scenario) => scenario.id !== id),
          selectedScenarioId: state.selectedScenarioId === id ? null : state.selectedScenarioId,
        }))

        // Notify execution copilot about deletion
        window.dispatchEvent(
          new CustomEvent("execution:scenario-deleted", {
            detail: { id },
          }),
        )

        window.dispatchEvent(
          new CustomEvent("scenario:deleted", {
            detail: { id },
          }),
        )
      },

      selectScenario: (id) => {
        set({ selectedScenarioId: id })
      },

      getScenariosByPair: (pair) => {
        return get().scenarios.filter((scenario) => scenario.pair === pair || scenario.relevantPairs.includes(pair))
      },

      getScenarioById: (id) => {
        return get().scenarios.find((scenario) => scenario.id === id)
      },

      syncScenarioToTerminal: (scenarioId) => {
        const scenario = get().getScenarioById(scenarioId)
        if (scenario) {
          window.dispatchEvent(
            new CustomEvent("terminal:sync-scenario", {
              detail: scenario,
            }),
          )
        }
      },

      createScenarioFromForecast: (forecastData) => {
        const scenario = get().addScenario({
          pair: forecastData.pair,
          position: forecastData.direction === "Long" ? "Buy Position" : "Sell Position",
          probability: "High Probability",
          level: "Pending Analysis",
          rr: "1:0",
          sl: "TBD",
          tp: "TBD",
          confluences: forecastData.confluences.map((conf) => ({ text: conf })),
          aiConfidence: 0, // Will be calculated by AI
          relevantPairs: [forecastData.pair],
          source: "forecast",
          chartData: {
            screenshotUrl: forecastData.screenshotUrl,
            commentary: forecastData.commentary,
          },
        })

        return scenario
      },

      createScenarioFromTerminal: (terminalData) => {
        const scenario = get().addScenario({
          pair: terminalData.pair,
          position: terminalData.position,
          probability: "High Probability",
          level: terminalData.entry,
          rr: calculateRR(terminalData.entry, terminalData.sl, terminalData.tp, terminalData.position),
          sl: terminalData.sl,
          tp: terminalData.tp,
          confluences: (terminalData.confluences || []).map((conf) => ({ text: conf })),
          aiConfidence: 0, // Will be calculated by AI
          relevantPairs: [terminalData.pair],
          source: "terminal",
        })

        return scenario
      },
    }),
    {
      name: "scenario-store",
      version: 1,
    },
  ),
)
