import type { Metadata } from "next"
import "@/components/owen/owen.css"

export const metadata: Metadata = {
  title: "ARCHIO",
  robots: { index: false, follow: false },
}

/**
 * Private route family for the Owen call: /owen (what Owen sees) ·
 * /owen/presenter (what Kan and Luke see) · /owen/guide (the same guide,
 * printable). owen.css hides the global floating nav and the account
 * button here — nothing but the screen should be on a shared display.
 */
export default function OwenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
