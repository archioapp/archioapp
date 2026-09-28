/**
 * Symbol normalization utilities for TradingView to Polygon ticker conversion
 */

// Major forex pairs and their properties
const FOREX_PAIRS = {
  EURUSD: { decimals: 5, pipsFactor: 10000 },
  GBPUSD: { decimals: 5, pipsFactor: 10000 },
  AUDUSD: { decimals: 5, pipsFactor: 10000 },
  NZDUSD: { decimals: 5, pipsFactor: 10000 },
  USDCAD: { decimals: 5, pipsFactor: 10000 },
  USDCHF: { decimals: 5, pipsFactor: 10000 },
  USDJPY: { decimals: 3, pipsFactor: 100 },
  EURJPY: { decimals: 3, pipsFactor: 100 },
  GBPJPY: { decimals: 3, pipsFactor: 100 },
  AUDJPY: { decimals: 3, pipsFactor: 100 },
  CADJPY: { decimals: 3, pipsFactor: 100 },
  CHFJPY: { decimals: 3, pipsFactor: 100 },
  EURGBP: { decimals: 5, pipsFactor: 10000 },
  EURAUD: { decimals: 5, pipsFactor: 10000 },
  EURCHF: { decimals: 5, pipsFactor: 10000 },
  GBPAUD: { decimals: 5, pipsFactor: 10000 },
  GBPCAD: { decimals: 5, pipsFactor: 10000 },
  GBPCHF: { decimals: 5, pipsFactor: 10000 },
} as const

type ForexPair = keyof typeof FOREX_PAIRS

/**
 * Normalize TradingView symbol to standard forex pair format
 * Strips exchange prefixes like "OANDA:EURUSD" -> "EURUSD"
 */
export function normalizePair(pair: string): ForexPair {
  // Remove exchange prefix if present (e.g., "OANDA:EURUSD" -> "EURUSD")
  const cleanPair = pair.includes(":") ? pair.split(":")[1] : pair

  // Convert to uppercase and validate
  const upperPair = cleanPair.toUpperCase()

  // Return the pair if it's valid, otherwise default to EURUSD
  return upperPair in FOREX_PAIRS ? (upperPair as ForexPair) : "EURUSD"
}

/**
 * Convert forex pair to Polygon FX ticker format
 * "EURUSD" -> "C:EURUSD"
 */
export function toPolygonFxTicker(pair: string): string {
  const normalizedPair = normalizePair(pair)
  return `C:${normalizedPair}`
}

/**
 * Get decimal places for a forex pair
 * JPY pairs use 3 decimals, others use 5
 */
export function decimalsForPair(pair: string): number {
  const normalizedPair = normalizePair(pair)
  return FOREX_PAIRS[normalizedPair].decimals
}

/**
 * Get pips factor for a forex pair
 * JPY pairs use 100, others use 10000
 */
export function pipsFactor(pair: string): number {
  const normalizedPair = normalizePair(pair)
  return FOREX_PAIRS[normalizedPair].pipsFactor
}

/**
 * Format a number as pips with appropriate decimal places
 */
export function formatPips(value: number, pair?: string): string {
  if (pair) {
    const decimals = decimalsForPair(pair)
    return value.toFixed(decimals)
  }
  return value.toFixed(1)
}

/**
 * Calculate range in pips between high and low prices
 */
export function calculateRangePips(high: number, low: number, pair: string): number {
  const range = high - low
  const factor = pipsFactor(pair)
  return Math.round(range * factor)
}

/**
 * Normalize symbol for Polygon API format
 * Alias for toPolygonFxTicker to match import expectations
 */
export const normalizeSymbolForPolygon = toPolygonFxTicker
