export type Bar = { t: number; o: number; h: number; l: number; c: number }

export function rollupMinuteToTF(minBars: Bar[], minutesPerBar = 30): Bar[] {
  if (!minBars?.length) return []
  const out: Bar[] = []
  let cur: Bar | undefined,
    cnt = 0

  for (const b of minBars) {
    if (!cur) {
      cur = { t: b.t, o: b.o, h: b.h, l: b.l, c: b.c }
      cnt = 1
      continue
    }
    cur.h = Math.max(cur.h, b.h)
    cur.l = Math.min(cur.l, b.l)
    cur.c = b.c
    cnt++

    if (cnt === minutesPerBar) {
      out.push(cur)
      cur = undefined
      cnt = 0
    }
  }
  if (cur) out.push(cur) // last partial bar in LIVE window
  return out
}

export function rollupToTF(minutes: Bar[], tfMinutes: number, anchorStartMs: number): Bar[] {
  if (!minutes?.length) return []

  // 1) sort asc by t
  const sorted = [...minutes].sort((a, b) => a.t - b.t)

  // 2) bucketIndex = Math.floor((t - anchorStartMs) / (tfMinutes*60000))
  const tfMs = tfMinutes * 60000
  const buckets = new Map<number, Bar[]>()

  for (const bar of sorted) {
    const bucketIndex = Math.floor((bar.t - anchorStartMs) / tfMs)
    if (!buckets.has(bucketIndex)) {
      buckets.set(bucketIndex, [])
    }
    buckets.get(bucketIndex)!.push(bar)
  }

  // 3) for each bucket, o=first.o, c=last.c, h=max(h), l=min(l), t = anchorStartMs + bucketIndex*tfMs
  // 4) include **last partial** bucket (for LIVE sessions)
  const result: Bar[] = []

  for (const [bucketIndex, bars] of buckets.entries()) {
    if (bars.length === 0) continue

    const bucketTime = anchorStartMs + bucketIndex * tfMs
    const open = bars[0].o
    const close = bars[bars.length - 1].c
    const high = Math.max(...bars.map((b) => b.h))
    const low = Math.min(...bars.map((b) => b.l))

    result.push({
      t: bucketTime,
      o: open,
      h: high,
      l: low,
      c: close,
    })
  }

  // Sort by time to ensure proper order
  return result.sort((a, b) => a.t - b.t)
}
