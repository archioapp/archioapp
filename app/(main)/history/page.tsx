import { LiveCallHistory } from "@/components/community-panel/live-call-history"

export const metadata = { title: "Live Call History — ArchioAI" }

export default function HistoryPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <LiveCallHistory />
    </div>
  )
}
