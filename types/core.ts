export type AssetClass = "FX" | "INDEX" | "CRYPTO" | "COMMODITY"
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d"

export type InstrumentState = {
  symbol: string
  assetClass: AssetClass
  timeframe: Timeframe
}

export type Overlays = {
  daily?: { high: number; low: number }
  asia?: { startISO: string; endISO: string; high: number; low: number }
  weeklyOpen?: { price: number; side: "premium" | "discount" }
  fvg?: { from: number; to: number; dir: "up" | "down" }[]
  bpr?: { from: number; to: number; dir: "buy" | "sell" }[]
  liquidity?: { kind: "equal_highs" | "equal_lows"; level: number }[]
}
