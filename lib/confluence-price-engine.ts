import type { Confluence, ConfluenceId } from "./confluences"
import type { ConfluenceStatus } from "@/stores/confluence-store"

// --- Placeholder data functions ---
const getLiquidityLevels = (_instrument: string) => [1.08, 1.09]
const getBalancedPriceRange = (_instrument: string) => ({ high: 1.095, low: 1.082 })
const getWeeklyOpen = (_instrument: string) => 1.088
const getDailyOpen = (_instrument: string) => 1.086

/**
 * Analyzes the current price against a set of confluences and returns status updates.
 */
export const updateConfluencesWithPrice = (
  currentPrice: number,
  instrument: string,
  confluences: Confluence[],
): Record<ConfluenceId, Partial<ConfluenceStatus>> => {
  const updates: Record<string, Partial<ConfluenceStatus>> = {}

  confluences.forEach((confluence) => {
    const patch: Partial<ConfluenceStatus> = { active: false }

    switch (confluence.id) {
      case "htf-structure":
        patch.liveDescription = `Price at ${currentPrice.toFixed(5)}`
        patch.active = true // Dummy logic
        break

      case "liquidity-sweep":
        const levels = getLiquidityLevels(instrument)
        // Dummy check: is price within 0.05% of a level?
        patch.active = levels.some((level) => Math.abs(currentPrice - level) / level < 0.0005)
        patch.liveLevels = levels
        patch.liveDescription = patch.active
          ? `Sweeping near ${levels.find((level) => Math.abs(currentPrice - level) / level < 0.0005)?.toFixed(4)}`
          : "No sweep detected"
        break

      case "bpr":
        const range = getBalancedPriceRange(instrument)
        const midpoint = (range.high + range.low) / 2
        patch.liveZone = currentPrice > midpoint ? "Premium" : "Discount"
        patch.livePercentage = ((currentPrice - range.low) / (range.high - range.low)) * 100
        patch.liveDescription = `${patch.liveZone} (${patch.livePercentage.toFixed(0)}%)`
        patch.active = true
        break

      case "opens-pd":
        const weeklyOpen = getWeeklyOpen(instrument)
        const dailyOpen = getDailyOpen(instrument)
        patch.liveStatusDetails = {
          weekly: currentPrice > weeklyOpen ? "Above WO" : "Below WO",
          daily: currentPrice > dailyOpen ? "Above DO" : "Below DO",
          weeklyLevel: weeklyOpen,
          dailyLevel: dailyOpen,
        }
        patch.liveDescription = `Daily: ${patch.liveStatusDetails.daily}, Weekly: ${patch.liveStatusDetails.weekly}`
        patch.active = true
        break

      // Cases for other confluences can be added here...
    }
    updates[confluence.id] = patch
  })

  return updates
}
