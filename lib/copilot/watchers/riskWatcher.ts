import type { EventBus } from "@/lib/copilot/eventBus"
import type { CopilotSuggestion } from "@/lib/copilot/types"
const uid = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
const last = new Map<string, number>() // dedupe per scenario/order
const DEBOUNCE = 15000

function RR(e?: number, s?: number, t?: number) {
  if (!e || !s || !t) return
  const r = Math.abs(e - s),
    R = Math.abs(t - e)
  return r > 0 ? R / r : undefined
}

export function initRiskWatcher(bus: EventBus, push: (s: CopilotSuggestion) => void) {
  const on = (e: any) => {
    const key = String(e.data?.scenarioId ?? e.data?.orderId ?? e.context?.instrument ?? "g")
    const entry = Number(e.data?.entry),
      sl = Number(e.data?.sl),
      tp = Number(e.data?.tp)
    const rr = Number.isFinite(e.data?.rr) ? Number(e.data?.rr) : RR(entry, sl, tp)
    const now = Date.now(),
      recent = now - (last.get(key) ?? 0) < DEBOUNCE

    // Missing SL -> sticky, always show
    if (entry && !Number.isFinite(sl)) {
      push({
        id: uid(),
        ts: now,
        title: "No Stop Loss on this setup",
        detail: "Add an SL. I can size it for you.",
        severity: "warning",
        source: "risk",
        actions: [
          { id: "open-risk-sizer", label: "Open Risk Sizer", payload: { entry } },
          { id: "set-default-sl", label: "Default SL (15 pips)", payload: { pips: 15 } },
        ],
        sticky: true,
      })
      last.set(key, now)
      return
    }

    // Weak RR -> info, debounced
    if (!recent && typeof rr === "number" && rr < 1.3 && tp) {
      push({
        id: uid(),
        ts: now,
        title: `Weak risk–reward (${rr.toFixed(2)}R)`,
        detail: "Consider widening TP or tightening SL.",
        severity: "info",
        source: "risk",
        actions: [{ id: "optimize-rr", label: "Optimize RR", payload: { entry, sl, tp } }],
      })
      last.set(key, now)
    }
  }
  ;["scenario:changed", "scenario:saved", "order:previewed", "order:placed", "sl:removed", "tp:removed"].forEach((t) =>
    bus.on(t as any, on),
  )
}
