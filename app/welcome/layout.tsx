import type React from "react"

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#05050a] min-h-screen">{children}</div>
}
