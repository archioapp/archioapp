import type React from "react"
import dynamic from "next/dynamic"
import LiveMarketIntelligence from "./LiveMarketIntelligence"

const TvChart = dynamic(() => import("@/components/signal/TvChart"), { ssr: false })

const MainDashboard: React.FC = () => {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Main Dashboard</h1>
      <div style={{ height: "60vh", width: "100%", marginBottom: "1rem" }}>
        <TvChart />
      </div>
      <LiveMarketIntelligence />
      {/* ... existing code ... */}
    </main>
  )
}

export default MainDashboard
