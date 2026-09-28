export function toPips(value: number, symbol: string): number {
  // Major pairs have 4 decimal places (1 pip = 0.0001)
  // JPY pairs have 2 decimal places (1 pip = 0.01)
  const isJPY = symbol.includes("JPY")
  const pipMultiplier = isJPY ? 100 : 10000
  return Math.round(value * pipMultiplier)
}

export function formatNYWeek(timestamp: number): string {
  const date = new Date(timestamp)
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay() + 1) // Monday

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 4) // Friday

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }

  const start = startOfWeek.toLocaleDateString("en-US", formatOptions)
  const end = endOfWeek.toLocaleDateString("en-US", formatOptions)

  return `${start} – ${end} (EST)`
}

export function formatPercentChange(open: number, close: number): string {
  const change = ((close - open) / open) * 100
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(2)}%`
}
