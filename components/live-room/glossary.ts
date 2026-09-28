/**
 * LIVE ROOM — glossary
 *
 * The Explain layer's vocabulary. Copy in the ledger is authored with
 * `{{id}}` or `{{id|display text}}` tokens; `splitTerms()` turns a string
 * into text + term segments at render time so the ledger stays plain.
 *
 * Each term carries three lines:
 *   short  — the definition (≤ 90 chars)
 *   why    — why it matters in THIS room (≤ 110 chars)
 *   diagram — which 48×24 micro-diagram to draw
 */

export type TermDiagram = "cross" | "gap" | "diverge" | "ladder" | "pulse" | "none"

export interface GlossaryTerm {
  id: string
  term: string
  short: string
  why: string
  diagram: TermDiagram
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  "liquidity-pool": {
    id: "liquidity-pool", term: "Liquidity pool",
    short: "A price where many stop orders rest — above a high or below a low.",
    why: "2035.50 holds the stops of every overnight short. Price is drawn to them.",
    diagram: "cross",
  },
  sweep: {
    id: "sweep", term: "Sweep",
    short: "Price briefly trades through a level to trigger the stops resting there, then turns.",
    why: "The mentor waits for the 2035.50 sweep instead of buying into it.",
    diagram: "cross",
  },
  displacement: {
    id: "displacement", term: "Displacement",
    short: "A fast, one-directional candle that leaves a gap behind it instead of filling one.",
    why: "Displacement after the sweep is the proof that buyers, not stops, moved price.",
    diagram: "gap",
  },
  "draw-on-liquidity": {
    id: "draw-on-liquidity", term: "Draw on liquidity",
    short: "The next obvious pool price is likely to reach — the target of a move.",
    why: "2042 is the H4 supply where the next stops sit. It is the target, not a guess.",
    diagram: "ladder",
  },
  fvg: {
    id: "fvg", term: "Fair value gap",
    short: "A three-candle imbalance where price moved too fast to trade both sides.",
    why: "The 2033.50 – 2035.80 gap is where the mentor expects price to retrace and fill.",
    diagram: "gap",
  },
  "equal-highs": {
    id: "equal-highs", term: "Equal highs",
    short: "Two or more highs at almost the same price — a magnet for stops.",
    why: "2035.40 / 2035.60 double the fuel resting above 2035.50.",
    diagram: "cross",
  },
  delta: {
    id: "delta", term: "Delta",
    short: "Buy-market volume minus sell-market volume in a candle.",
    why: "A +340 delta on the displacement candle shows aggressive buyers, not short covering.",
    diagram: "pulse",
  },
  "delta-divergence": {
    id: "delta-divergence", term: "Delta divergence",
    short: "Price makes a lower low while delta makes a higher low.",
    why: "Sellers hit the tape below 2033 and price would not fall — someone absorbed them.",
    diagram: "diverge",
  },
  absorption: {
    id: "absorption", term: "Absorption",
    short: "Large passive orders soak up aggressive selling without letting price drop.",
    why: "Absorption below 2033 is the institutional footprint the thesis needed.",
    diagram: "diverge",
  },
  accumulation: {
    id: "accumulation", term: "Accumulation",
    short: "A period where a large participant builds a position quietly — higher lows, fading volume.",
    why: "Three higher lows on the 5m confirmed the bullish bias before any entry.",
    diagram: "ladder",
  },
  trail: {
    id: "trail", term: "Trailing stop",
    short: "A stop moved in the direction of the trade to lock in profit as price advances.",
    why: "At 2036 the runner cannot lose — the worst case is a smaller win.",
    diagram: "ladder",
  },
  "break-even": {
    id: "break-even", term: "Break-even",
    short: "Moving the stop to the entry price so a loss is impossible.",
    why: "Rejected here: 2034.20 sits inside the gap and a retest could tag it.",
    diagram: "ladder",
  },
  "r-multiple": {
    id: "r-multiple", term: "R multiple",
    short: "Profit or loss measured in units of the original risk (entry to stop = 1 R).",
    why: "Every rung of the anatomy ladder is in R so all trades share one geometry.",
    diagram: "ladder",
  },
  mfe: {
    id: "mfe", term: "MFE",
    short: "Maximum favourable excursion — the best price the trade reached.",
    why: "MFE vs. banked P&L shows how much of the move the mentor actually captured.",
    diagram: "pulse",
  },
  mae: {
    id: "mae", term: "MAE",
    short: "Maximum adverse excursion — the worst price the trade reached.",
    why: "A small MAE means the entry was precise; the stop was never in danger.",
    diagram: "pulse",
  },
  fomc: {
    id: "fomc", term: "FOMC minutes",
    short: "The Federal Reserve's meeting record — a scheduled volatility event for the dollar and Gold.",
    why: "Two hours away at 4:00 PM. The reason size is half and TP1 was taken early.",
    diagram: "pulse",
  },
  dxy: {
    id: "dxy", term: "DXY",
    short: "The US dollar index. Gold is priced in dollars, so the two usually move inversely.",
    why: "DXY +0.11 while Gold rises is a small warning — one of them is early.",
    diagram: "diverge",
  },
  "htf-bias": {
    id: "htf-bias", term: "Higher-timeframe bias",
    short: "The direction the daily / H4 chart favours; intraday trades are taken with it.",
    why: "Daily EQ at 2031.20 is below price — the higher timeframe supports longs.",
    diagram: "ladder",
  },
  invalidation: {
    id: "invalidation", term: "Invalidation",
    short: "The exact price and condition that proves an idea wrong.",
    why: "Every node on the spine names one. If it prints, the node turns red.",
    diagram: "cross",
  },
  partial: {
    id: "partial", term: "Partial",
    short: "Closing part of a position at a target while the rest keeps running.",
    why: "Half banked at 2038.40 pays for the risk; the other half chases 2042.",
    diagram: "ladder",
  },
  runner: {
    id: "runner", term: "Runner",
    short: "The remaining part of a position left open for a further target.",
    why: "The 50% runner is what the trail at 2036 protects.",
    diagram: "ladder",
  },
  "half-size": {
    id: "half-size", term: "Half size",
    short: "Trading with 50% of normal position size — the same stop, half the money at risk.",
    why: "Chosen because FOMC can move Gold 15 dollars on a headline.",
    diagram: "pulse",
  },
  "asia-high": {
    id: "asia-high", term: "Asia session high",
    short: "The highest price during the Asian trading hours — a common stop cluster for the New York session.",
    why: "2035.50 is the Asia high. New York's job is often to run it.",
    diagram: "cross",
  },
  "london-high": {
    id: "london-high", term: "London high",
    short: "The highest price of the London session — the first realistic target after a New York sweep.",
    why: "TP1 at 2038.40 is the London high, not an arbitrary number.",
    diagram: "cross",
  },
  vwap: {
    id: "vwap", term: "VWAP",
    short: "Volume-weighted average price — where the average participant is positioned today.",
    why: "Price above VWAP keeps intraday buyers in profit and dips shallow.",
    diagram: "pulse",
  },
  ema: {
    id: "ema", term: "EMA",
    short: "Exponential moving average — a smoothed trend line weighted to recent prices.",
    why: "EMA 9 above EMA 21 is the mechanical read of the same bullish structure.",
    diagram: "pulse",
  },
  supply: {
    id: "supply", term: "Supply",
    short: "A zone where sellers previously overwhelmed buyers and price fell fast.",
    why: "1.0870 is the last 15m supply on EUR/USD — the euro short lives below it.",
    diagram: "gap",
  },
  "daily-eq": {
    id: "daily-eq", term: "Daily equilibrium",
    short: "The midpoint of the day's range — above it buyers control, below it sellers.",
    why: "2031.20 today. Price holding above it kept the long bias honest.",
    diagram: "ladder",
  },
}

export type TermSegment = { kind: "text"; text: string } | { kind: "term"; id: string; text: string }

const TOKEN = /\{\{([a-z0-9-]+)(?:\|([^}]+))?\}\}/g

/** Split authored copy into text and term segments. Unknown ids fall back to text. */
export function splitTerms(text: string): TermSegment[] {
  const out: TermSegment[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    const idx = m.index ?? 0
    if (idx > last) out.push({ kind: "text", text: text.slice(last, idx) })
    const id = m[1]
    const display = m[2] ?? GLOSSARY[id]?.term ?? id
    out.push(GLOSSARY[id] ? { kind: "term", id, text: display } : { kind: "text", text: display })
    last = idx + m[0].length
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) })
  return out
}

/** Plain-text projection (aria labels, canvas, message bodies). */
export function stripTerms(text: string): string {
  return text.replace(TOKEN, (_, id: string, display?: string) => display ?? GLOSSARY[id]?.term ?? id)
}

/** Which term ids appear in a string — used by nodes to list their vocabulary. */
export function termsIn(text: string | undefined): string[] {
  if (!text) return []
  const ids: string[] = []
  for (const m of text.matchAll(TOKEN)) if (GLOSSARY[m[1]] && !ids.includes(m[1])) ids.push(m[1])
  return ids
}
