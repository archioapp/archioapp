import type { Metadata } from "next"
import { CockpitExperience } from "@/components/cockpit/CockpitExperience"

/**
 * /cockpit
 * ----------------------------------------------------------------------------
 * The flagship artefact of the Archio masterplan. A cinematic, interactive
 * expression of the F02 Cockpit — the three-stage rail (Analyze · Forecast ·
 * Execute) with its spine, flow, and ecosystem.
 *
 * This route is intentionally deep-linkable and self-contained. It does not
 * use the (main) app shell so it reads as a statement, not a tool.
 * ----------------------------------------------------------------------------
 */
export const metadata: Metadata = {
  title: "The Cockpit · Archio · Analyze → Forecast → Execute",
  description:
    "Three acts. One cockpit. Analysis, forecast, and execution are the same thought, held for three different moments of time. This is the rail.",
}

export default function CockpitPage() {
  return <CockpitExperience />
}
