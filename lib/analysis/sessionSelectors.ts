export type SessionKey = "asia" | "london" | "newyork" | "daily" | "weekly" | "monthly"

type OHLC = { open?: number; high?: number; low?: number; close?: number; range?: number }

function pick(ov: any, key: SessionKey): OHLC | undefined {
  if (!ov) return undefined
  if (key === "newyork") return (ov.newyork ?? ov.newYork) as OHLC | undefined
  return ov[key] as OHLC | undefined
}

export function valuesFor(ov: any, key: SessionKey): Required<OHLC> | undefined {
  const s = pick(ov, key)
  if (!s) return undefined
  const high = s.high
  const low = s.low
  const open = s.open
  const close = s.close
  const range = s.range ?? (high != null && low != null ? high - low : undefined)
  if ([high, low, open, close, range].some((v) => v == null)) return { open, high, low, close, range } as any
  return { open: open!, high: high!, low: low!, close: close!, range: range! }
}

export function valPrev(ov: any, k: "asia" | "london" | "newyork") {
  const s = ov?.prev ? (k === "newyork" ? (ov.prev.newyork ?? ov.prev.newYork) : ov.prev[k]) : undefined
  if (!s) return undefined
  const { open, high, low, close } = s
  const range = s.range ?? (high != null && low != null ? high - low : undefined)
  return { open, high, low, close, range }
}

export function f5(n?: number): string {
  return n == null || Number.isNaN(n) ? "—" : Number(n).toFixed(5)
}

// ACTIVE / INCOMING / COMPLETED using epoch seconds in meta.now + windows
export function sessionState(ov: any, winKey: "asia" | "london" | "newyork"): string {
  const now = ov?.meta?.now ?? Math.floor(Date.now() / 1000)
  const w = ov?.meta?.windows?.[winKey]
  if (!Array.isArray(w) || w.length < 2) return "COMPLETED SESSION"
  const [s, e] = w
  if (now < s) return "INCOMING SESSION"
  if (now >= s && now < e) return "ACTIVE SESSION"
  return "COMPLETED SESSION"
}
