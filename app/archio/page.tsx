import type { Metadata } from "next"
import { ArchioLanding } from "@/components/archio/ArchioLanding"

export const metadata: Metadata = {
  title: "Archio — The trading operating system",
  description:
    "Archio is the trading operating system for clarity, community and execution. One intelligent surface for charts, AI forecasting, journal, signals and mentor rooms.",
  openGraph: {
    title: "Archio — The trading operating system",
    description:
      "Stop stitching together charts, Discords, journals and scattered AI tools. Archio brings your workflow into one intelligent system.",
    type: "website",
  },
}

export default function ArchioPage() {
  return <ArchioLanding />
}
