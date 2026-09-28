export type BusHandler = (payload?: any) => void

const map = new Map<string, Set<BusHandler>>()

export function on(evt: string, fn: BusHandler) {
  if (!map.has(evt)) map.set(evt, new Set())
  map.get(evt)!.add(fn)
  return () => map.get(evt)!.delete(fn)
}

export function emit(evt: string, payload?: any) {
  // eslint-disable-next-line no-console
  console.log("[BUS]", evt, payload ?? "")
  map.get(evt)?.forEach((fn) => fn(payload))
}
