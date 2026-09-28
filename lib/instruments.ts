export interface Instrument {
  id: string
  name: string
  symbol: string
  category: "Forex" | "Indices" | "Crypto" | "Commodities"
  pipDecimalPlaces?: number
  apiSymbol?: string // For cases where API symbol differs, e.g., SPX500 -> SPY
}

const forex: Instrument[] = [
  { id: "EURUSD", name: "EUR/USD", symbol: "EURUSD", category: "Forex", pipDecimalPlaces: 5, apiSymbol: "EUR" },
  { id: "GBPUSD", name: "GBP/USD", symbol: "GBPUSD", category: "Forex", pipDecimalPlaces: 5, apiSymbol: "GBP" },
  { id: "USDJPY", name: "USD/JPY", symbol: "USDJPY", category: "Forex", pipDecimalPlaces: 3, apiSymbol: "JPY" },
  { id: "AUDUSD", name: "AUD/USD", symbol: "AUDUSD", category: "Forex", pipDecimalPlaces: 5, apiSymbol: "AUD" },
  { id: "USDCAD", name: "USD/CAD", symbol: "USDCAD", category: "Forex", pipDecimalPlaces: 5, apiSymbol: "CAD" },
]

const indices: Instrument[] = [
  { id: "SPX500", name: "S&P 500", symbol: "SPX500", category: "Indices", pipDecimalPlaces: 2, apiSymbol: "SPY" },
  { id: "US30", name: "Dow Jones 30", symbol: "US30", category: "Indices", pipDecimalPlaces: 2, apiSymbol: "DIA" },
  { id: "NAS100", name: "Nasdaq 100", symbol: "NAS100", category: "Indices", pipDecimalPlaces: 2, apiSymbol: "QQQ" },
  { id: "DE30", name: "DAX 30", symbol: "DE30", category: "Indices", pipDecimalPlaces: 2, apiSymbol: "EWG" },
]

const crypto: Instrument[] = [
  { id: "BTCUSD", name: "Bitcoin", symbol: "BTCUSD", category: "Crypto", pipDecimalPlaces: 2, apiSymbol: "BTC" },
  { id: "ETHUSD", name: "Ethereum", symbol: "ETHUSD", category: "Crypto", pipDecimalPlaces: 2, apiSymbol: "ETH" },
]

const commodities: Instrument[] = [
  { id: "XAUUSD", name: "Gold", symbol: "XAUUSD", category: "Commodities", pipDecimalPlaces: 2, apiSymbol: "GLD" },
  { id: "XAGUSD", name: "Silver", symbol: "XAGUSD", category: "Commodities", pipDecimalPlaces: 3, apiSymbol: "SLV" },
  { id: "WTI", name: "Crude Oil (WTI)", symbol: "WTI", category: "Commodities", pipDecimalPlaces: 2, apiSymbol: "USO" },
]

export const instrumentsByCategory = {
  forex,
  indices,
  crypto,
  commodities,
}

export const allInstruments: Instrument[] = [...forex, ...indices, ...crypto, ...commodities]

export const getInstrumentById = (id: string): Instrument | undefined => allInstruments.find((inst) => inst.id === id)
