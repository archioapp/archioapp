import type { Metadata } from "next"
import LandingExperience from "@/components/landing/LandingExperience"

export const metadata: Metadata = {
  title: "ArchioAI — The Operating System for Traders",
  description:
    "Twelve broken tools. One living platform. ArchioAI unifies strategy, psychology, community, and capital into one immersive trading ecosystem — with a copilot that understands not just your trades, but you.",
  keywords: [
    "ArchioAI",
    "trading platform",
    "AI copilot for traders",
    "trading psychology",
    "mentor rooms",
    "live trading community",
    "forex",
    "crypto",
    "trading OS",
  ],
  openGraph: {
    title: "ArchioAI — The Operating System for Traders",
    description:
      "Unified strategy, psychology, and community. One platform. One copilot. One trader finally becoming who they were meant to be.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchioAI — The Operating System for Traders",
    description:
      "The chaos is not your fault. The stack is. Meet the platform built to end it.",
  },
}

export default function WelcomePage() {
  return <LandingExperience />
}
