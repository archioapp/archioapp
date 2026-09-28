import type { Metadata } from "next"
import { Dashboard } from "@/components/dashboard/dashboard"

export const metadata: Metadata = {
  title: "Command Center | Archio AI",
  description: "Your neural command center. Summon any surface, orchestrate your trading workflow, and command the entire platform at the speed of thought.",
}

/* The command center is a live, per-session surface: its clock spine,
   session state and countdowns are seeded from the request instant below.
   A statically prerendered page would bake a build-time clock into the HTML. */
export const dynamic = "force-dynamic"

export default function DashboardPage() {
  /* One timestamp for the whole tree. The client receives this exact value
     through the RSC payload, so every clock consumer hydrates against the
     same instant the server rendered — no server/client second drift. */
  const serverNow = Date.now()
  return <Dashboard serverNow={serverNow} />
}
