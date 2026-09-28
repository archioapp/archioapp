"use client"
import { useEffect, useState } from "react"
import { on } from "@/lib/bus"
import { useInstrument } from "@/lib/stores/useInstrument"

export function useLivePrice() {
  const { instrument } = useInstrument()
  const [price, setPrice] = useState<number | null>(null)
  useEffect(() => {
    const off = on("price:tick", (p: any) => {
      if (!p) return
      if (typeof p.symbol === "string" && p.symbol.toUpperCase().includes(instrument.symbol.toUpperCase())) {
        setPrice(Number(p.price))
      }
    })
    return off
  }, [instrument.symbol])
  return price
}
