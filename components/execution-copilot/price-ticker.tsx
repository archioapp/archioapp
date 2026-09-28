"use client"

import { useState, useEffect } from "react"
import { PriceService } from "@/lib/price-api"
import type { Instrument } from "@/lib/instruments"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface PriceTickerProps {
  instrument: Instrument
}

export function PriceTicker({ instrument }: PriceTickerProps) {
  const [price, setPrice] = useState<number | null>(null)
  const [flash, setFlash] = useState("")
  const [change, setChange] = useState(0)

  useEffect(() => {
    setPrice(null)
    setChange(0)
    const intervalId = PriceService.startPriceUpdates(instrument.id, (newPrice) => {
      setPrice((prevPrice) => {
        if (prevPrice !== null) {
          const priceChange = newPrice - prevPrice
          setChange(priceChange)
          if (priceChange > 0) {
            setFlash("price-flash-green")
          } else if (priceChange < 0) {
            setFlash("price-flash-red")
          }
          setTimeout(() => setFlash(""), 500)
        }
        return newPrice
      })
    })

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [instrument])

  const priceColor = change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-zinc-300"
  const decimals = instrument.pipDecimalPlaces ?? 2

  return (
    <div className={cn("flex items-center gap-3 p-1 rounded-md transition-colors duration-500", flash)}>
      <span className="font-bold text-sm text-white">{instrument.name}</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={price}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className={cn("font-mono text-sm", priceColor)}
        >
          {price !== null ? price.toFixed(decimals) : "Loading..."}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
