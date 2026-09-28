/**
 * Bar rollup utilities for aggregating timeframes
 */

export interface Bar {
  t: number
  o: number
  h: number
  l: number
  c: number
  v?: number
}

export function rollup60mTo4h(bars60m: Bar[]): Bar[] {
  if (!bars60m || bars60m.length === 0) return []

  const h4Bars: Bar[] = []

  // Group bars into 4-hour buckets aligned to NY timezone
  for (let i = 0; i < bars60m.length; i += 4) {
    const chunk = bars60m.slice(i, i + 4)
    if (chunk.length === 0) continue

    const h4Bar: Bar = {
      t: chunk[0].t, // Start time of the 4H period
      o: chunk[0].o, // Open of first bar
      h: Math.max(...chunk.map((b) => b.h)), // Highest high
      l: Math.min(...chunk.map((b) => b.l)), // Lowest low
      c: chunk[chunk.length - 1].c, // Close of last bar
      v: chunk.reduce((sum, b) => sum + (b.v || 0), 0), // Sum volume if available
    }

    h4Bars.push(h4Bar)
  }

  return h4Bars
}
