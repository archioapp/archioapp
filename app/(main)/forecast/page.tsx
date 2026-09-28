import type { Metadata } from "next"
import { ForecastHub } from "@/components/forecast-hub/forecast-hub"

export const metadata: Metadata = {
  title: "Forecast Hub | Archio",
  description: "Make a call. Prove it. Build your record. The verifiable prediction record system.",
}

export default function ForecastPage() {
  return <ForecastHub />
}
