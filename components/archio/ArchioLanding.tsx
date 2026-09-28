"use client"

import { useState } from "react"
import { ArchioNav } from "./ArchioNav"
import { HeroSection } from "./HeroSection"
import { PainSection } from "./PainSection"
import { PersonalizationSection } from "./PersonalizationSection"
import { SolutionSection } from "./SolutionSection"
import { OutcomesSection } from "./OutcomesSection"
import { TransformationSection } from "./TransformationSection"
import { BrainSpotlightSection } from "./BrainSpotlightSection"
import { ShowcaseSection } from "./ShowcaseSection"
import { MagicSection } from "./MagicSection"
import { PathwaysSection } from "./PathwaysSection"
import { TrustSection } from "./TrustSection"
import { QuickWinSection } from "./QuickWinSection"
import { FinalCTASection } from "./FinalCTASection"
import { ArchioFooter } from "./ArchioFooter"
import type { PainId } from "./painMap"

/**
 * ArchioLanding — orchestrator for the 8-screen conversion flow.
 *
 * Flow:
 *   Hook → Problem → Personalization → Solution → Outcomes
 *        → Transformation → BrainSpotlight → Showcase
 *        → Magic → Pathways → Trust → QuickWin → CTA
 *
 * State:
 *   selectedPain is lifted here so PersonalizationSection can write it
 *   and SolutionSection can render the matching panel.
 */
export function ArchioLanding() {
  const [selectedPain, setSelectedPain] = useState<PainId | null>(null)

  return (
    <div
      className="relative min-h-screen text-white antialiased"
      style={{
        background: "linear-gradient(180deg, #05070f 0%, #03050c 100%)",
      }}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 80%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[70vh]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.08), transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <ArchioNav />
        <main>
          <HeroSection />
          <PainSection />
          <PersonalizationSection
            selected={selectedPain}
            onSelect={setSelectedPain}
          />
          <SolutionSection selected={selectedPain} />
          <OutcomesSection />
          <TransformationSection />
          <BrainSpotlightSection />
          <ShowcaseSection />
          <MagicSection />
          <PathwaysSection />
          <TrustSection />
          <QuickWinSection />
          <FinalCTASection />
        </main>
        <ArchioFooter />
      </div>
    </div>
  )
}
