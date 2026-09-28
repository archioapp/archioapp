"use client"
import { useState } from "react"
import { useInstrument } from "@/lib/stores/useInstrument"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { emit } from "@/lib/bus"

export default function RunAnalyzeFab() {
  const { instrument } = useInstrument()
  const analysisStore = useAnalysis()
  const { set } = analysisStore || {}
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!set) return

    setLoading(true)
    const q = new URLSearchParams({ symbol: instrument.symbol, tf: instrument.timeframe })
    const res = await fetch(`/api/market/overlays?${q.toString()}`, { cache: "no-store" })
    const json = await res.json()
    set(json.overlays)
    emit("analyze.completed", { instrument, overlays: json.overlays })
    setLoading(false)
  }

  return (
    <button
      onClick={run}
      style={{
        position: "fixed",
        right: 12,
        bottom: 72,
        zIndex: 60,
        padding: "10px 12px",
        borderRadius: 10,
        background: "linear-gradient(90deg,#7c3aed,#6366f1)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {loading ? "Analyzing…" : "Run Analyze (DEV)"}
    </button>
  )
}
