/**
 * Converts trading pair format to Polygon.io ticker format
 * @param pair - Trading pair like 'EURUSD', 'GBPJPY', etc.
 * @returns Polygon ticker format like 'C:EURUSD'
 */
export function toPolygonTicker(pair: string): string {
  // 'EURUSD' -> 'C:EURUSD'
  const p = pair.toUpperCase().replace(/[^A-Z]/g, "")
  return `C:${p}`
}
