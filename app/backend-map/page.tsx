import type { Metadata } from "next"
import { BackendMapPage } from "@/components/backend-map/backend-map-page"

export const metadata: Metadata = {
  title: "Backend Map · ARCHIO",
  description: "A plain-English map of ARCHIO's backend, infrastructure, integrations, and AI system.",
  robots: { index: false, follow: false },
}

export default function BackendMapRoute() {
  return <BackendMapPage />
}
