import type { Metadata } from "next"
import { NewPitchPage } from "@/components/newpitch/newpitch-page"

export const metadata: Metadata = {
  title: "Archio AI · Investor Terminal",
  description:
    "The Archio AI investment briefing as a single instrumented cockpit — one trading operating system for a $26.5T market. Problem, market, solution, architecture, traction, roadmap, and the ask.",
  robots: { index: false, follow: false },
}

export default function NewPitchRoute() {
  return <NewPitchPage />
}
