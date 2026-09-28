import { useAnalysis } from "@/lib/stores/useAnalysis"

export function useOverlaysSelectors() {
  const { overlays, computedAt } = useAnalysis()
  const dailyHi = overlays?.daily?.high?.toFixed(5) ?? null
  const dailyLo = overlays?.daily?.low?.toFixed(5) ?? null
  const asiaHi = overlays?.asia?.high?.toFixed(5) ?? null
  const asiaLo = overlays?.asia?.low?.toFixed(5) ?? null
  const wkOpen = overlays?.weeklyOpen?.price?.toFixed(5) ?? null
  const pdSide = (overlays?.weeklyOpen?.side as "premium" | "discount" | null) ?? null
  const fvgCount = overlays?.fvg?.length ?? 0
  const liqCount = overlays?.liquidity?.length ?? 0
  const windows = (overlays as any)?.meta?.windows
  return { dailyHi, dailyLo, asiaHi, asiaLo, wkOpen, pdSide, fvgCount, liqCount, windows, computedAt }
}
