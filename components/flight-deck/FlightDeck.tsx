"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  <FlightDeck/>  ·  shared functional surface
 *
 *  Re-exports the REAL `JarvisWelcomeBand` ("Flight Deck") from the
 *  production cockpit (`components/dashboard/vantary/your-space.tsx`) so
 *  both the dashboard and `/design` consume the exact same component
 *  code — same status rail, same Trader Cartouche, same Ask command bar,
 *  same 4-room navigator with hover / focus / customizer behaviour.
 *
 *  `<FlightDeckHost/>` mounts the minimum context providers the band
 *  needs to function in isolation (outside the dashboard's full
 *  provider tree). The dashboard does NOT use the host — it already
 *  has its own provider stack at the page root. `/design` does use
 *  the host because it mounts the band standalone.
 * ──────────────────────────────────────────────────────────────────────── */

import type { ReactNode } from "react"

import { JarvisWelcomeBand } from "@/components/dashboard/vantary/your-space"
import { VantaryThemeProvider } from "@/components/dashboard/vantary/theme-context"
import {
  ClockSpineProvider,
  SecondClockProvider,
  DaySelectionProvider,
} from "@/components/dashboard/vantary/clock-spine"
import { CommandPaletteProvider } from "@/components/dashboard/vantary/command-palette"
import { StrategyOsProvider } from "@/components/dashboard/vantary/strategy-os/provider"
import { FlightDeckRevealProvider } from "@/components/dashboard/vantary/flight-deck-reveal"
import { FlightDeckViewportProvider } from "@/components/dashboard/vantary/flight-deck/flight-deck-viewport"
import { SideRailProvider } from "@/components/dashboard/vantary/side-detail-rail"
import { DrillCardCrossHighlightProvider } from "@/components/ui/drill-card"

/** Re-export of the real Flight Deck composition from the cockpit. */
export const FlightDeck = JarvisWelcomeBand

/**
 * `<FlightDeckHost/>` — minimal provider stack for mounting <FlightDeck/>
 * outside the main dashboard shell (e.g. on `/design`).
 *
 * Mirrors the exact provider order from `your-space.tsx` (lines
 * 31206-31288), trimmed to ONLY the providers the cockpit / cartouche /
 * eyebrow rail / ask bar actually read from at runtime.
 */
export function FlightDeckHost({ children }: { children: ReactNode }) {
  return (
    <VantaryThemeProvider>
      <DrillCardCrossHighlightProvider>
        <SideRailProvider>
          <ClockSpineProvider>
            <SecondClockProvider>
              <DaySelectionProvider>
                <CommandPaletteProvider>
                  <StrategyOsProvider initialPlan="optimal">
                    <FlightDeckRevealProvider>
                      <FlightDeckViewportProvider>
                        {children}
                      </FlightDeckViewportProvider>
                    </FlightDeckRevealProvider>
                  </StrategyOsProvider>
                </CommandPaletteProvider>
              </DaySelectionProvider>
            </SecondClockProvider>
          </ClockSpineProvider>
        </SideRailProvider>
      </DrillCardCrossHighlightProvider>
    </VantaryThemeProvider>
  )
}
