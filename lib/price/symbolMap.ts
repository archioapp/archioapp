export function mapFxToFinnhub(symbol: string) {
  // EURUSD -> OANDA:EUR_USD (GBPUSD -> OANDA:GBP_USD, etc.)
  const s = symbol.toUpperCase().replace(/[^A-Z]/g, "")
  if (s.length === 6) return `OANDA:${s.slice(0, 3)}_${s.slice(3, 6)}`
  return `OANDA:${s}`
}
export function mapTfToResolution(tf: string) {
  switch (tf) {
    case "1m":
      return "1"
    case "5m":
      return "5"
    case "15m":
      return "15"
    case "1h":
      return "60"
    case "4h":
      return "240"
    case "1d":
      return "D"
    default:
      return "15"
  }
}
export function secondsPerTf(tf: string) {
  switch (tf) {
    case "1m":
      return 60
    case "5m":
      return 300
    case "15m":
      return 900
    case "1h":
      return 3600
    case "4h":
      return 14400
    case "1d":
      return 86400
    default:
      return 900
  }
}
export function mapTfToAVInterval(tf: string) {
  switch (tf) {
    case "1m":
      return "1min"
    case "5m":
      return "5min"
    case "15m":
      return "15min"
    case "1h":
      return "60min"
    case "4h":
      return "60min"
    default:
      return "15min"
  }
}
