import { useOverlaysSelectors } from "@/lib/selectors/overlays"

export default function AsiaCard() {
  const { asiaHi, asiaLo } = useOverlaysSelectors()

  return (
    <div className="flex gap-3 items-center">
      <div className="chip">
        <div className="label">High</div>
        <div className="value">{asiaHi ?? "—"}</div>
      </div>
      <div className="chip">
        <div className="label">Low</div>
        <div className="value">{asiaLo ?? "—"}</div>
      </div>
    </div>
  )
}
