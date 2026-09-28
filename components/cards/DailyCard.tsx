import { useOverlaysSelectors } from "@/lib/selectors/overlays"
import { useLivePrice } from "@/lib/hooks/useLivePrice"

export default function DailyCard() {
  const { dailyHi, dailyLo, wkOpen, pdSide } = useOverlaysSelectors()
  const last = useLivePrice()
  const brokenUp = dailyHi && last != null ? last > Number(dailyHi) : false
  const brokenDown = dailyLo && last != null ? last < Number(dailyLo) : false

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="chip">
          <div className="label">High</div>
          <div className="value">{dailyHi ?? "—"}</div>
          {brokenUp && <div className="tag tag-green">BROKEN ↑</div>}
        </div>

        <div className="chip">
          <div className="label">Low</div>
          <div className="value">{dailyLo ?? "—"}</div>
          {brokenDown && <div className="tag tag-red">BROKEN ↓</div>}
        </div>

        <div className="chip">
          <div className="label">Weekly Open</div>
          <div className="value">{wkOpen ? `${wkOpen} · ${pdSide}` : "—"}</div>
        </div>
      </div>

      {!dailyHi && <div className="text-xs opacity-60 mt-1">Run "Analyze Charts" to populate.</div>}
    </div>
  )
}
