"use client"

import { CockpitRailNav } from "./CockpitRailNav"
import { CockpitHero } from "./sections/CockpitHero"
import { CockpitPrinciples } from "./sections/CockpitPrinciples"
import { CockpitRail } from "./sections/CockpitRail"
import { CockpitSpine } from "./sections/CockpitSpine"
import { CockpitFlow } from "./sections/CockpitFlow"
import { CockpitEcosystem } from "./sections/CockpitEcosystem"
import { CockpitClose } from "./sections/CockpitClose"

/**
 * CockpitExperience
 * ----------------------------------------------------------------------------
 * The composition of the /cockpit route. Orders the six sections of the
 * masterplan's F02 feature into a single cinematic scroll:
 *
 *   Hero              → the thesis, three verbs, the live spine strip
 *   Principles        → the five immovable laws
 *   Rail              → the interactive three-stage selector
 *   Spine             → the five state objects and their photon
 *   Flow              → Marco's 13-minute trade
 *   Ecosystem         → the six-layer organism
 *   Close             → the exits
 *
 * The rail nav floats above everything and reveals after the hero.
 * ----------------------------------------------------------------------------
 */
export function CockpitExperience() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05060a] text-white">
      <CockpitRailNav />
      <CockpitHero />
      <CockpitPrinciples />
      <CockpitRail />
      <CockpitSpine />
      <CockpitFlow />
      <CockpitEcosystem />
      <CockpitClose />
    </main>
  )
}
