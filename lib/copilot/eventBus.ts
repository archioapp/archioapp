import type { CopilotEvent, EventType } from "./types"

type Handler = (e: CopilotEvent) => void

export class EventBus {
  private subs = new Map<EventType | "*", Set<Handler>>()
  private buffer: CopilotEvent[] = []
  private flushing = false

  on(type: EventType | "*", handler: Handler) {
    if (!this.subs.has(type)) this.subs.set(type, new Set())
    this.subs.get(type)!.add(handler)
    return () => this.off(type, handler)
  }

  off(type: EventType | "*", handler: Handler) {
    this.subs.get(type)?.delete(handler)
  }

  emit(e: CopilotEvent) {
    this.buffer.push(e)
    this.subs.get(e.type)?.forEach((h) => h(e))
    this.subs.get("*")?.forEach((h) => h(e))
  }

  /** Call at app start. Batches events for persistence. */
  startFlushLoop(persist: (events: CopilotEvent[]) => Promise<void>, intervalMs = 5000, maxBatch = 50) {
    if (this.flushing) return
    this.flushing = true
    setInterval(async () => {
      if (this.buffer.length === 0) return
      const batch = this.buffer.splice(0, maxBatch)
      try {
        await persist(batch)
      } catch (err) {
        // If persist fails, requeue:
        this.buffer.unshift(...batch)
        console.error("[Copilot] persist failed:", err)
      }
    }, intervalMs)
  }
}

// Singleton (client)
export const copilotBus = new EventBus()
