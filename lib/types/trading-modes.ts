export type Timeframe = "5m" | "15m" | "1h" | "4h" | "1d" | "1w"
export type Mode = "scalp" | "day" | "swing"
export type Legs = 1 | 2

export interface Candle {
  t: number // ms epoch
  o: number
  h: number
  l: number
  c: number
}

export interface SliceStats {
  tf: Timeframe
  bars: number
  bullCount: number
  bearCount: number
  avgRange: number // in points or pips
  rangeDominance: number // bullRange / bearRange
  bias: "Bullish" | "Bearish" | "Range"
  note: string
  bullishTotalRange?: number
  bearishTotalRange?: number
  avgBullishRange?: number
  avgBearishRange?: number
}

export interface CardConfig {
  tf: Timeframe
  counts: Record<Legs, number>
  fractalK: 2 | 3
  displayName: string
}

export interface ModeConfig {
  cards: CardConfig[] // left, middle, right
  description: string
}

export const MODE_CONFIG: Record<Mode, ModeConfig> = {
  scalp: {
    description: "Trade micro legs aligned with meso bias",
    cards: [
      { tf: "5m", counts: { 1: 30, 2: 60 }, fractalK: 2, displayName: "5M" },
      { tf: "15m", counts: { 1: 24, 2: 48 }, fractalK: 2, displayName: "15M" },
      { tf: "1h", counts: { 1: 12, 2: 24 }, fractalK: 2, displayName: "1H" },
    ],
  },
  day: {
    description: "Intraday legs confirmed with higher timeframe structure",
    cards: [
      { tf: "15m", counts: { 1: 16, 2: 32 }, fractalK: 2, displayName: "15M" },
      { tf: "1h", counts: { 1: 12, 2: 24 }, fractalK: 2, displayName: "1H" },
      { tf: "4h", counts: { 1: 6, 2: 12 }, fractalK: 2, displayName: "4H" },
    ],
  },
  swing: {
    description: "Enter on 4H legs aligned with daily/weekly bias",
    cards: [
      { tf: "4h", counts: { 1: 18, 2: 32 }, fractalK: 2, displayName: "4H" },
      { tf: "1d", counts: { 1: 10, 2: 20 }, fractalK: 3, displayName: "1D" },
      { tf: "1w", counts: { 1: 6, 2: 10 }, fractalK: 3, displayName: "1W" },
    ],
  },
}
