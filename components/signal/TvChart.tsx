"use client"
import { useEffect, useRef } from "react"
import { on } from "@/lib/bus"
import { useInstrument } from "@/lib/stores/useInstrument"

export default function TvChart() {
  const ref = useRef<HTMLDivElement>(null)
  const { instrument, setSymbol, setTimeframe } = useInstrument()

  useEffect(() => {
    // TEMP: placeholder until real TradingView CL init is added.
    if (ref.current) {
      ref.current.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="opacity:.7;font-size:12px">[TV CHART PLACEHOLDER] ${instrument.symbol} · ${instrument.timeframe}</div>
      </div>`
    }

    // App → "CL" (already reflected via instrument store). No-op for placeholder.
    const offA = on("instrument.changed", () => {
      /* would setWidgetSymbol here */
    })

    // Simulated "CL" → App: dev events (will be replaced by real widget callbacks)
    const offB = on("cl.symbolChanged", (s: string) => setSymbol(s))
    const offC = on("cl.timeframeChanged", (tf: any) => setTimeframe(tf))

    return () => {
      offA()
      offB()
      offC()
    }
  }, [instrument.symbol, instrument.timeframe, setSymbol, setTimeframe])

  return <div ref={ref} style={{ height: "100%", width: "100%" }} />
}
