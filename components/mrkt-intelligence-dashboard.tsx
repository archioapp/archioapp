"use client"
import { CentralBankEvents } from "./central-bank-events"
import { TrumpTracker } from "./trump-tracker"
import { EconomicCalendar } from "./economic-calendar"
import { LiveHeadlines } from "./live-headlines"
import { MarketSentiment } from "./market-sentiment"
import { FundamentalDrivers } from "./fundamental-drivers"

export function MrktIntelligenceDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">MRKT Intelligence</h1>
        <p className="text-zinc-400 mt-2">AI-Powered Institutional-Grade Macro Event Analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <MarketSentiment />
        </div>
        <div className="lg:col-span-2">
          <FundamentalDrivers />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <LiveHeadlines />
        </div>
        <div className="lg:col-span-2">
          <TrumpTracker />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CentralBankEvents />
        <EconomicCalendar />
      </div>
    </div>
  )
}
