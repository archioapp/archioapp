"use client"
import { useAnalysis } from "@/lib/stores/useAnalysis"

export default function OverlayDebug() {
  const analysisStore = useAnalysis()
  const { overlays = {}, computedAt } = analysisStore || {}

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 60,
        background: "rgba(20,22,28,.92)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 12,
        padding: 10,
        minWidth: 240,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6 }}>Overlays (dev)</div>
      {!overlays ? (
        <div style={{ opacity: 0.7, fontSize: 12 }}>Run Analyze ↑</div>
      ) : (
        <div style={{ fontSize: 12, opacity: 0.9, lineHeight: "18px" }}>
          <div>
            Daily H/L: {overlays.daily?.high?.toFixed(5)} / {overlays.daily?.low?.toFixed(5)}
          </div>
          <div>
            Asia H/L: {overlays.asia?.high?.toFixed(5)} / {overlays.asia?.low?.toFixed(5)}
          </div>
          <div>
            Weekly Open: {overlays.weeklyOpen?.price?.toFixed(5)} · {overlays.weeklyOpen?.side}
          </div>
          <div>
            FVG: {overlays.fvg?.length || 0} · Liquidity: {overlays.liquidity?.length || 0}
          </div>
          <div style={{ opacity: 0.6 }}>at {computedAt}</div>
        </div>
      )}
    </div>
  )
}
