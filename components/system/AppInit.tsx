"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { emit, on } from "@/lib/bus"
import { useInstrument } from "@/lib/stores/useInstrument"
import { connectPriceBus, disconnectPriceBus } from "@/lib/price/priceBus"

export default function AppInit() {
  const path = usePathname()
  const { instrument, setSymbol, setTimeframe } = useInstrument()

  useEffect(() => {
    emit("app.boot")
  }, [])
  useEffect(() => {
    emit("route.changed", { path })
  }, [path])
  useEffect(() => {
    connectPriceBus(instrument.symbol)
    emit("instrument.changed", instrument)
    return () => disconnectPriceBus()
  }, [instrument]) // Fixed dependency array to use entire instrument object

  // DEV ONLY: simulate TradingView widget callbacks from console
  if (typeof window !== "undefined") {
    ;(window as any).__cl = {
      setSymbol: (s: string) => emit("cl.symbolChanged", s),
      setTimeframe: (tf: string) => emit("cl.timeframeChanged", tf),
    }
  }

  useEffect(() => {
    const offB = on("cl.symbolChanged", (s: string) => setSymbol(String(s)))
    const offC = on("cl.timeframeChanged", (tf: string) => setTimeframe(String(tf) as any))
    return () => {
      offB()
      offC()
    }
  }, [setSymbol, setTimeframe])

  return null
}
