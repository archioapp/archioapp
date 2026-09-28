"use client"
import { useState } from "react"
import { useInstrument } from "@/lib/stores/useInstrument"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { emit } from "@/lib/bus"

export default function AnalyzeAction() {
  const { instrument } = useInstrument()
  const { set } = useAnalysis()
  const [loading, setLoading] = useState(false)

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        const q = new URLSearchParams({ symbol: instrument.symbol, tf: instrument.timeframe })
        const res = await fetch(`/api/market/overlays?${q.toString()}`)
        const json = await res.json()
        set(json.overlays)
        emit("analyze.completed", { instrument, overlays: json.overlays })
        setLoading(false)
      }}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        background: "linear-gradient(90deg,#7c3aed,#6366f1)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {loading ? "Analyzing…" : "Analyze"}
    </button>
  )
}
