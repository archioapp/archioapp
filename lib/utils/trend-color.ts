export function getTrendColor(trend: string) {
  switch (trend) {
    case "bullish":
      return "from-emerald-500/10 via-green-500/5 to-teal-500/10 border-emerald-400/20 hover:border-emerald-400/40"
    case "bearish":
      return "from-rose-500/10 via-red-500/5 to-pink-500/10 border-rose-400/20 hover:border-rose-400/40"
    default:
      return "from-amber-500/10 via-yellow-500/5 to-orange-500/10 border-amber-400/20 hover:border-amber-400/40"
  }
}
