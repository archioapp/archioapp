"use client"

/**
 * Dashboard / Your Space
 *
 * The /dashboard route renders the new VANTARY edition of "Your Space" —
 * a pixel-strict translation of the 40 Vantary/RON reference frames into
 * the trader's command surface (hairline charts, magnitude/precision
 * numerics, glass cards, amber-only accent, Bus 6023-style account
 * cards, Schedule Offset matrix, brick-red Warning sheet, breathing
 * ticker, atmospheric blooms and chromatic-aberration on hover).
 *
 * All implementation lives in components/dashboard/vantary/your-space.tsx.
 * This file is intentionally minimal so the route stays a thin wrapper.
 */

import { YourSpace } from "./vantary/your-space"

export function Dashboard({ serverNow }: { serverNow?: number }) {
  return <YourSpace serverNow={serverNow} />
}
