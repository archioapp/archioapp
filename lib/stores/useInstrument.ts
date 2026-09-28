import { create } from "zustand"
import type { InstrumentState, AssetClass, Timeframe } from "@/types/core"

type S = {
  instrument: InstrumentState
  setSymbol: (s: string) => void
  setTimeframe: (tf: Timeframe) => void
  setClass: (c: AssetClass) => void
}

export const useInstrument = create<S>((set) => ({
  instrument: { symbol: "EURUSD", assetClass: "FX", timeframe: "15m" },
  setSymbol: (symbol) => set((s) => ({ instrument: { ...s.instrument, symbol } })),
  setTimeframe: (timeframe) => set((s) => ({ instrument: { ...s.instrument, timeframe } })),
  setClass: (assetClass) => set((s) => ({ instrument: { ...s.instrument, assetClass } })),
}))
