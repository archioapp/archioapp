export type Bar = { t: number; o: number; h: number; l: number; c: number }
export type SessionKey = "asia" | "london" | "newyork"
export type SessionWindow = {
  startMs: number
  endMs: number
  status: "UPCOMING" | "LIVE" | "COMPLETED"
}
