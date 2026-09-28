import { useAnalysis } from "@/lib/stores/useAnalysis"
import { emit } from "@/lib/bus"

export async function runAnalyze(opts: { symbol: string; timeframe: string; provider?: "OANDA" | "FXCM" }) {
  const q = new URLSearchParams({ symbol: opts.symbol, tf: opts.timeframe, provider: opts.provider || "OANDA" })
  const res = await fetch(`/api/market/overlays?${q.toString()}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Analyze failed")
  const json = await res.json()
  useAnalysis.getState().set(json.overlays)
  emit("analyze.completed", { instrument: opts, overlays: json.overlays })
  return json.overlays
}
