import type { Metadata } from "next"
import { MasterPlanPage } from "@/components/masterplan/master-plan-page"

export const metadata: Metadata = {
  title: "Masterplan · My Record v2 — ArchioAI",
  description:
    "Five-pillar pentagram of the My Record v2 plan: Goal, Distribution, Instruments, Calibration, Execution.",
}

export default function MasterplanRoute() {
  return <MasterPlanPage />
}
