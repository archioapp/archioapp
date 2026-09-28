import type { Metadata } from "next"
import { ArchioDesignPage } from "@/components/design/archio-design-page"

export const metadata: Metadata = {
  title: "ArchioAI · Visual DNA",
  description:
    "Internal master visual reference. Two interface specimens — the Flight Deck and the Macro Alert Sheet — preserved as the platform's design DNA.",
  robots: { index: false, follow: false },
}

export default function DesignPage() {
  return <ArchioDesignPage />
}
