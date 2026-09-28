"use client"
import { copilotBus } from "@/lib/copilot/eventBus"

const sid = () => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
const now = () => Date.now()

type Ctx = { instrument?: string; route?: string; mode?: string; timeframe?: string }

function emit(type: string, data?: Record<string, unknown>, ctx?: Ctx) {
  copilotBus.emit({
    id: sid(),
    type: type as any,
    ts: now(),
    sessionId: localStorage.getItem("sessionId") ?? "anon",
    context: ctx,
    data,
  })
}

export const CopilotSDK = {
  scenario: {
    opened: (scenarioId: string, ctx?: Ctx) => emit("scenario:opened", { scenarioId }, ctx),
    changed: (scenarioId: string, form: { entry?: number; sl?: number; tp?: number }, ctx?: Ctx) => {
      const rr =
        form.entry && form.sl && form.tp ? Math.abs(form.tp - form.entry) / Math.abs(form.entry - form.sl) : undefined
      emit("scenario:changed", { scenarioId, ...form, rr }, ctx)
    },
    saved: (scenarioId: string, form: { entry?: number; sl?: number; tp?: number }, ctx?: Ctx) => {
      const rr =
        form.entry && form.sl && form.tp ? Math.abs(form.tp - form.entry) / Math.abs(form.entry - form.sl) : undefined
      emit("scenario:saved", { scenarioId, ...form, rr }, ctx)
    },
    cancelled: (scenarioId: string, ctx?: Ctx) => emit("scenario:cancelled", { scenarioId }, ctx),
  },
  order: {
    preview: (payload: { orderId?: string; entry?: number; sl?: number; tp?: number; riskPct?: number }, ctx?: Ctx) => {
      const { entry, sl, tp } = payload
      const rr = entry && sl && tp ? Math.abs(tp - entry) / Math.abs(entry - sl) : undefined
      emit("order:previewed", { ...payload, rr }, ctx)
    },
    placed: (payload: any, ctx?: Ctx) => emit("order:placed", payload, ctx),
    modified: (payload: any, ctx?: Ctx) => emit("order:modified", payload, ctx),
    cancelled: (payload: any, ctx?: Ctx) => emit("order:cancelled", payload, ctx),
    slSet: (orderId: string, sl: number, ctx?: Ctx) => emit("sl:set", { orderId, sl }, ctx),
    slRemoved: (orderId: string, ctx?: Ctx) => emit("sl:removed", { orderId }, ctx),
    tpSet: (orderId: string, tp: number, ctx?: Ctx) => emit("tp:set", { orderId, tp }, ctx),
    tpRemoved: (orderId: string, ctx?: Ctx) => emit("tp:removed", { orderId }, ctx),
  },
  chart: {
    symbol: (symbol: string, ctx?: Ctx) => emit("chart:symbol_changed", {}, { ...ctx, instrument: symbol }),
    interval: (tf: string, ctx?: Ctx) => emit("chart:interval_changed", {}, { ...ctx, timeframe: tf }),
  },
  mentor: {
    viewedEntry: (entryId: string, mentorId: string, ctx?: Ctx) =>
      emit("mentor:entry_viewed", { entryId, mentorId }, ctx),
    copied: (entryId: string, mentorId: string, mentorName?: string, ctx?: Ctx) =>
      emit("mentor:copied", { entryId, mentorId, mentorName }, ctx),
  },
}
