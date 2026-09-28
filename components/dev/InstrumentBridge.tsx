"use client"
import { useEffect } from "react"
import { useInstrument } from "@/lib/stores/useInstrument"
import { emit } from "@/lib/bus"

function normalizePair(text: string) {
  // e.g., "GBPUSD", "USD/JPY", "gbp/usd", "EUR USD"
  const up = text.toUpperCase().replace(/[^A-Z]/g, "")
  // Must be 6 letters like EURUSD, USDJPY, USDCAD etc.
  return /^[A-Z]{6}$/.test(up) ? up : null
}
function mapTfToken(s: string) {
  const t = s.toLowerCase().trim()
  if (["1m", "1min", "1 min"].includes(t)) return "1m"
  if (["5m", "5min", "5 min"].includes(t)) return "5m"
  if (["15m", "15min", "15 min"].includes(t)) return "15m"
  if (["1h", "1 hr", "1hr"].includes(t)) return "1h"
  if (["4h", "4 hr", "4hr"].includes(t)) return "4h"
  if (["1d", "1 day", "daily"].includes(t)) return "1d"
  return null
}

export default function InstrumentBridge() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const path = (e.composedPath && e.composedPath()) || []
      const node = path[0] as HTMLElement | undefined
      if (!node) return
      const el = (node.closest && node.closest("*")) as HTMLElement | null
      if (!el) return

      const label = (el.textContent || "").trim()

      // Try timeframe chips first (1m/5m/15m/1h/4h/1d)
      const tf = mapTfToken(label)
      if (tf) {
        useInstrument.getState().setTimeframe(tf as any)
        emit("instrument.changed", useInstrument.getState().instrument)
        return
      }

      // Try FX symbol (normalize "USD/JPY" -> "USDJPY")
      const maybe = normalizePair(label)
      if (maybe) {
        useInstrument.getState().setSymbol(maybe)
        emit("instrument.changed", useInstrument.getState().instrument)
      }
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])
  return null
}
