"use client"
import { technicalConfluences } from "@/lib/confluences"
import { StudentCollaborationHub } from "./student-collaboration-hub"

type AnalysisStatus = "idle" | "analyzing" | "success" | "error"

const psychologyBiases = [
  "FOMO",
  "Overconfidence",
  "Revenge Trading",
  "Confirmation Bias",
  "Recency Bias",
  "Herd Mentality",
  "Loss Aversion",
  "Anchoring",
]

// Mock AI analysis function
const analyzeImage = async (file: File): Promise<any> => {
  console.log("Analyzing image:", file.name)
  await new Promise((resolve) => setTimeout(resolve, 2500)) // Simulate network delay and processing

  const randomConfluences = technicalConfluences
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 3)
    .map((c) => c.name)

  return {
    success: true,
    data: {
      instrument: "EUR/USD",
      direction: "Long",
      confluences: randomConfluences,
      insights:
        "The chart shows a strong bullish reversal pattern at a key support level, with RSI indicating oversold conditions. High probability of upward movement towards the next resistance zone.",
    },
  }
}

interface StudentHubProps {
  onForecastCreated?: () => void
}

export function StudentHub({ onForecastCreated }: StudentHubProps) {
  return <StudentCollaborationHub />
}
