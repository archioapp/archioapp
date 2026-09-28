"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { LiveMarketIntelligence } from "@/components/live-market-intelligence"

const InstrumentBridge = dynamic(() => import("@/components/dev/InstrumentBridge"), { ssr: false })

export default function DashboardPage() {
  useEffect(() => {
    console.log("[v0] DashboardPage mounted successfully")
  }, [])

  return (
    <>
      <LiveMarketIntelligence />
      <InstrumentBridge />
    </>
  )
}
