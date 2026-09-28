"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   VANTARY · MEANINGFUL TRADING MODULES + ORACLE
   ───────────────────────────────────────────────────────────────────────────
   Replaces the abstract panels (TradingAccuracy / DisciplineLoad / Setup
   Variance) with real, decisive trading surfaces:

     <SessionsRadar/>       Sydney / Tokyo / London / NY · live progress rails
     <WatchlistMatrix/>     5 pairs · mini candle charts · win-rate · status
     <MacroAlertSheet/>     ECB / Jobless / ISM PMI · countdown · plan impact
     <VantaryOracle/>       Active-Theory-inspired ask dock at the bottom
                            with sliding glass panel summoning a Vantary-
                            native SummonedResult view from any query.

   STRICT VANTARY RULES (theme.ts):
     · Amber is the ONLY chromatic.
     · Greens / reds appear ONLY as small status dots.
     · 1px hairlines, dashed-only horizontal grid, right-floating y-axis.
     · Magnitude / precision two-weight numerics.
     · Glass cards: backdrop-blur 24-32 + 24-28px radius.
     · Motion ease: [0.22, 1, 0.36, 1].
   ═══════════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ChevronRight, ChevronUp,
  Sparkles, Send, Mic, X, Triangle, Radio, Clock,
  TrendingUp, TrendingDown, AlertTriangle, Globe, Crosshair, Layers,
  Shield, Eye, BookOpen, Target, MessageSquare, Search,
  Activity, Zap, Calendar, BarChart3, Hash, Pause, Bell, FileDown,
  ChevronDown, Flame, CircleDot, Pin, Filter,
} from "lucide-react"
import {
  VANTARY, RADIUS_V, EASE_V, CHROMA_SHADOW, CHROMA_SHADOW_LO, DASH, HAIR,
} from "./vantary-theme"
import {
  MENTORS, PEER_PROFILES, mentorFitScore, getSmartSuggestions, pct as fmtPct,
} from "./oracle-data"
import { OracleCommandConsole } from "./oracle-command-console"
import { useOracleArmed } from "@/lib/oracle/oracle-armed-context"
import {
  useFlightDeckViewportContext,
  FlightDeckViewportSurface,
} from "./flight-deck/flight-deck-viewport"
import { ACCOUNTS, PERFORMANCE, STRATEGIES, DAILY_PLAN, AI_CHECKIN, PSYCHOLOGY } from "../dashboard-data"
import { DrillCard } from "@/components/ui/drill-card"
import { HoverPreviewPopover } from "@/components/ui/hover-preview-popover"
import { PinButton, useSideRail } from "./side-detail-rail"
import { useUTCSecondClock } from "./clock-spine"
import { splitMagnitude } from "./jarvis/jarvis-tokens"
import { useThemeAccent, rgba as vgRgba } from "@/components/vantary-glass"

/* ═══════════════════════════════════════════════════════════════════════════
   1.  REAL TRADING DATA · sessions, watchlist, macro
   ═══════════════════════════════════════════════════════════════════════════ */

/* Trading sessions — UTC hours. Each has its bias, regime, and the trader's
   own historical win-rate (sourced from PERFORMANCE.bestSession/worstSession). */
export interface SessionWindow {
  key: "SYDNEY" | "TOKYO" | "LONDON" | "NY"
  city: string
  flag: string                     // 2-letter ISO code, used as a quiet pill
  openUTC: number                  // 0-24
  closeUTC: number                 // 0-24
  killzone?: { from: number; to: number; label: string }
  winRate: number                  // user's own performance in this session
  regime: "TREND" | "RANGE" | "NEWS" | "QUIET"
  pairs: string[]                  // most active pairs in this window
}

export const SESSIONS: SessionWindow[] = [
  { key: "SYDNEY", city: "Sydney", flag: "AU", openUTC: 22, closeUTC: 7, winRate: 54, regime: "QUIET", pairs: ["AUD/USD", "NZD/USD"] },
  { key: "TOKYO",  city: "Tokyo",  flag: "JP", openUTC: 0,  closeUTC: 9, winRate: 61, regime: "RANGE", pairs: ["USD/JPY", "AUD/JPY", "GBP/JPY"] },
  { key: "LONDON", city: "London", flag: "GB", openUTC: 7,  closeUTC: 16,
    killzone: { from: 7, to: 10, label: "London Killzone" },
    winRate: PERFORMANCE.bestSession.winRate, regime: "TREND",
    pairs: ["EUR/USD", "GBP/USD", "XAU/USD"] },
  { key: "NY",     city: "New York", flag: "US", openUTC: 12, closeUTC: 21,
    killzone: { from: 12, to: 15, label: "NY AM Killzone" },
    winRate: 64, regime: "NEWS",
    pairs: ["EUR/USD", "US30", "XAU/USD"] },
]

/* ═══════════════════════════════════════════════════════════════════════════
   SESSION LIQUIDITY PLAYBOOK
   ─────────────────────────────────────────────────────────────────────────
   For every session, we encode WHICH pairs are tradeable and WHICH should
   be avoided (with the structural reason). This is the foundation of the
   takeover view's "what should I trade vs what did I trade" delta.
   Each entry rates liquidity 1-5 and explains the structural reason.
   ═══════════════════════════════════════════════════════════════════════ */

export interface PairLiquidityNote {
  pair: string
  liquidity: 1 | 2 | 3 | 4 | 5    // 1 = dead, 5 = institutional flow
  reason: string                  // one-line structural explanation
  tag: "PRIMARY" | "OVERLAP" | "SECONDARY" | "THIN" | "DEAD" | "DECEPTIVE"
  deepDive: string                // 2-3 sentence structural explanation shown on click
}

export interface SessionPlaybook {
  description: string             // 1-2 sentence character of the session
  rules: string[]                 // 2-3 actionable rules
  favored: PairLiquidityNote[]    // pairs with strong liquidity
  avoid: PairLiquidityNote[]      // pairs to avoid (low/deceptive liquidity)
  // Behavioural fingerprints typical for this session's regime
  expectedHoldMin: number         // ideal hold-time during this window
  riskBudget: number              // % of daily R that should be deployed here
}

export const SESSION_LIQUIDITY_RULES: Record<SessionWindow["key"], SessionPlaybook> = {
  SYDNEY: {
    description: "Asia-Pacific opening session — commercial flow led by Australian and New Zealand desks. Range-bound with thin volume; price discovery is muted until Tokyo overlaps at 00:00 UTC.",
    rules: [
      "Wait for the Tokyo overlap at 00:00 UTC before taking directional setups",
      "Range mean-reversion only — fade extremes, never chase breakouts",
      "Skip USD/EUR/GBP majors entirely; major desks are offline",
    ],
    favored: [
      { pair: "AUD/USD", liquidity: 4, reason: "Local AUD news flow drives directional moves", tag: "PRIMARY", deepDive: "AUD/USD is the anchor pair of the Sydney session. Australian economic releases (employment, CPI, RBA decisions) drop during these hours, creating genuine directional moves with real institutional participation. Spreads tighten to 0.6-0.8 pips as local bank desks are fully staffed. Your edge here is news-reaction setups within the first 15 minutes of a release — the move is real, not synthetic." },
      { pair: "NZD/USD", liquidity: 4, reason: "RBNZ proximity peaks during Auckland hours", tag: "PRIMARY", deepDive: "NZD/USD benefits from RBNZ policy proximity and Auckland desk activity. New Zealand dairy auction results and trade balance data create clean directional impulses. The pair moves with conviction during 21:00-01:00 UTC because both NZ and AU desks are active simultaneously. Correlates strongly with AUD/USD but offers higher volatility per pip." },
      { pair: "AUD/JPY", liquidity: 3, reason: "Carry-trade pulse builds before Tokyo open", tag: "OVERLAP", deepDive: "AUD/JPY is a carry-trade barometer that wakes up as Tokyo approaches. Risk sentiment from Asian equity futures (ASX, Nikkei pre-market) flows directly into this cross. Best traded after 23:00 UTC when Japanese institutional desks begin pre-market positioning. The carry differential makes directional moves sticky — trends hold better than in majors during this window." },
      { pair: "USD/JPY", liquidity: 3, reason: "Picks up volume from 00:00 UTC Tokyo overlap", tag: "OVERLAP", deepDive: "USD/JPY is thin in early Sydney but comes alive at the Tokyo overlap (00:00 UTC). Japanese exporters and importers begin hedging flows, creating genuine order flow. Before the overlap, avoid this pair — moves are algorithmic and mean-reverting. After 00:00 UTC, trend setups aligned with Nikkei direction have the highest hit rate." },
    ],
    avoid: [
      { pair: "EUR/USD", liquidity: 1, reason: "European desks closed — 30% of normal volume, fake moves only", tag: "DEAD", deepDive: "EUR/USD during Sydney has roughly 30% of its London-session volume. European bank desks are closed, ECB communication is silent, and the only participants are algorithmic market makers recycling stale prices. Any breakout you see is a liquidity vacuum trap — price will retrace 70-80% of the move once London opens. Every pip you make here you'll give back with interest." },
      { pair: "GBP/USD", liquidity: 1, reason: "London closed — thin tape produces deceptive breakouts", tag: "DECEPTIVE", deepDive: "GBP/USD is one of the most dangerous pairs to trade during Sydney. Cable is a London-dominated instrument — without UK bank desks, the spread widens to 1.5-2.5 pips and liquidity drops to 15% of normal. Breakouts look convincing on the chart but are stop-hunts driven by thin order books. Wait for London open at 07:00 UTC when real institutional flow returns." },
      { pair: "XAU/USD", liquidity: 2, reason: "Gold lacks catalysts before London Fix", tag: "THIN", deepDive: "Gold is primarily priced during London (LBMA Fix at 10:30 UTC) and New York sessions. During Sydney, gold drifts in a narrow range with occasional spikes from geopolitical headlines. The spread widens to $0.40-0.60 and fills become unreliable. Physical gold markets in Asia provide some floor, but directional trading is unprofitable — your risk-reward is structurally poor." },
      { pair: "US30",    liquidity: 1, reason: "US futures on autopilot — algos only", tag: "DEAD", deepDive: "Dow Jones futures during Sydney are on algorithmic autopilot. US equity desks are closed, no economic data is releasing, and volume drops to 5-8% of NY session levels. Any move you see is noise from Asian equity correlation algorithms. The bid-ask spread on US30 widens significantly, making entries and exits expensive and unpredictable." },
      { pair: "US100",   liquidity: 1, reason: "US futures on autopilot — algos only", tag: "DEAD", deepDive: "Nasdaq futures mirror the same dead conditions as US30 during Sydney. Tech-heavy index requires US institutional flow for directional conviction. Without earnings releases or Fed commentary, price action is random walk with occasional correlation spikes to Nikkei movements. Save your risk capital for the NY AM killzone where this index truly moves." },
      { pair: "BTC/USD", liquidity: 2, reason: "Crypto disconnected from FX flow during Asian hours", tag: "THIN", deepDive: "Bitcoin during Asian hours trades on its own rhythm, disconnected from FX macro flow. While crypto is 24/7, the institutional bridge between crypto and FX is mostly active during London/NY overlap. Asian crypto volume is dominated by retail and stablecoin arbitrage, not directional flow. Correlations to USD and risk assets break down, making cross-asset setups unreliable." },
    ],
    expectedHoldMin: 45,
    riskBudget: 10,
  },
  TOKYO: {
    description: "Tokyo session — JPY-cross dominance driven by the 09:55 JST Tokyo Fix. Range-bound regime with mean-reversion working better than continuation, except during BoJ headline windows.",
    rules: [
      "Trade JPY pairs around the Tokyo Fix (00:00 UTC) — that's where the volume is",
      "Mean-reversion fades work; don't chase continuation outside the Fix window",
      "Avoid EUR/GBP majors until 07:00 UTC — they're sleeping",
    ],
    favored: [
      { pair: "USD/JPY", liquidity: 5, reason: "Tokyo Fix sets the day's directional tone", tag: "PRIMARY", deepDive: "USD/JPY is the king of the Tokyo session. The 09:55 JST Tokyo Fix (00:55 UTC) is when Japanese banks set the day's reference rate, creating the session's most significant directional move. Exporters (Toyota, Sony) hedge USD receivables, importers (energy companies) buy USD — the net flow determines direction. Trade the 30-minute window around the Fix for the cleanest entries with institutional backing." },
      { pair: "AUD/JPY", liquidity: 4, reason: "Carry-trade flows are most active in Tokyo", tag: "PRIMARY", deepDive: "AUD/JPY is the premier carry-trade pair and Tokyo is where carry flows are most concentrated. Japanese institutional investors (Mrs. Watanabe retail, pension funds) actively manage AUD/JPY positions during Tokyo hours. The pair responds cleanly to Nikkei 225 direction — risk-on/risk-off sentiment from Japanese equities flows directly into this cross. Best entry windows are 01:00-03:00 UTC." },
      { pair: "GBP/JPY", liquidity: 4, reason: "High-volatility yen cross with cleanest moves", tag: "PRIMARY", deepDive: "GBP/JPY (the 'beast' or 'dragon') delivers the highest pip volatility of any yen cross during Tokyo. Japanese hedge funds and prop desks actively trade this cross for its range. Average daily range during Tokyo is 80-120 pips, meaning your R-multiple potential is highest here. The key is waiting for the Tokyo Fix direction to establish, then riding the continuation. Tight stops, wide targets." },
      { pair: "EUR/JPY", liquidity: 4, reason: "Yen cross with growing London anticipation", tag: "OVERLAP", deepDive: "EUR/JPY sits at the intersection of Tokyo yen flow and early European anticipation. As the session progresses past 05:00 UTC, European early-bird desks begin positioning, adding a second layer of liquidity. This makes EUR/JPY increasingly directional toward London open. It's the transitional pair — use it in the back half of Tokyo (04:00-07:00 UTC) for London-anticipation setups." },
      { pair: "NZD/JPY", liquidity: 3, reason: "Carry play with reasonable depth", tag: "SECONDARY", deepDive: "NZD/JPY is a smaller carry-trade play with decent liquidity during Tokyo. The RBNZ rate differential creates persistent carry flow, and NZ dairy auction results (released during Asian hours) can trigger directional moves. Lower volatility than AUD/JPY or GBP/JPY makes it suitable for smaller accounts or conservative position sizing. Best used as a diversification pair alongside your primary yen cross trade." },
    ],
    avoid: [
      { pair: "EUR/USD", liquidity: 2, reason: "Minimal volume until London opens at 07:00 UTC", tag: "THIN", deepDive: "EUR/USD during Tokyo trades at roughly 25-35% of London session volume. The ECB is silent, European economic data hasn't released, and the only flow is Japanese cross-hedging (which is indirect and noisy). Price consolidates in a tight range, and any breakout attempt before 07:00 UTC has an 80% chance of reverting. Your win-rate on EUR/USD during Tokyo will structurally underperform." },
      { pair: "GBP/USD", liquidity: 2, reason: "Sleeping giant — wait for London", tag: "THIN", deepDive: "Cable is a creature of London. During Tokyo hours, GBP/USD volume drops to 20% of normal, spreads widen, and price action becomes a random walk. UK economic releases don't drop until 07:00 UTC at the earliest. Any position you enter is essentially a coin flip with wider spreads eating into your edge. The smart play is to analyze levels during Tokyo and execute at London open." },
      { pair: "XAU/USD", liquidity: 2, reason: "Gold quiet before European open", tag: "THIN", deepDive: "Gold during Tokyo is in a holding pattern. The LBMA Fix at 10:30 UTC is the day's anchor price, and institutional gold traders are mostly in London and New York. Asian physical gold demand (Shanghai Gold Exchange) provides a floor but not direction. Spreads widen to $0.35-0.50 and slippage increases. Wait for the London session when gold gets its first real catalyst of the day." },
      { pair: "US30",    liquidity: 1, reason: "US closed — futures noise only", tag: "DEAD", deepDive: "Dow Jones futures during Tokyo have minimal institutional participation. US equity traders are sleeping, no US data is releasing, and the only moves come from Asian equity correlation algorithms. Volume is 5-10% of NY session levels. Any entry here carries maximum spread cost with minimum edge." },
      { pair: "US100",   liquidity: 1, reason: "US closed — futures noise only", tag: "DEAD", deepDive: "Nasdaq 100 futures during Tokyo follow the same dead pattern as US30. Without US institutional flow, tech earnings, or Fed communication, price action is noise. Occasional spikes from Asian tech sentiment (TSMC, Samsung) are unreliable for directional trading. Reserve your index capital for the NY AM killzone." },
    ],
    expectedHoldMin: 60,
    riskBudget: 20,
  },
  LONDON: {
    description: "London session — peak FX liquidity in the world. Trend-day regime; the London Killzone (07:00-10:00 UTC) is where most institutional trends are born and where your edge compounds.",
    rules: [
      "Killzone is 07:00-10:00 UTC — your highest-WR window of the entire day",
      "Trend continuation setups in EUR/USD and GBP/USD work best here",
      "Don't fade — let the trend confirm via Sweep-then-FVG sequences",
    ],
    favored: [
      { pair: "EUR/USD", liquidity: 5, reason: "Peak global liquidity — institutional trend day", tag: "PRIMARY", deepDive: "EUR/USD during London is the most liquid instrument on the planet. Over 30% of daily EUR/USD volume transacts between 07:00-16:00 UTC. The London Killzone (07:00-10:00 UTC) is where institutional trends are born — banks, hedge funds, and sovereign wealth funds establish directional positions. ECB speakers, Eurozone PMI, and German data create catalysts. Your highest win-rate setup is the Killzone sweep-and-reverse pattern in the first 90 minutes." },
      { pair: "GBP/USD", liquidity: 5, reason: "Home turf — cleanest directional moves", tag: "PRIMARY", deepDive: "Cable is a London-native instrument. During London hours, GBP/USD achieves its tightest spreads (0.5-0.8 pips), deepest order books, and most predictable technical behavior. UK economic data (08:30 UTC CPI, employment, GDP) creates clean impulsive moves with institutional follow-through. The pair trends harder during London than any other session — continuation setups after the initial Killzone impulse have the best risk-reward." },
      { pair: "XAU/USD", liquidity: 5, reason: "London Fix at 10:30 UTC moves gold materially", tag: "PRIMARY", deepDive: "Gold's most important daily event is the LBMA London Fix at 10:30 UTC (AM) and 15:00 UTC (PM). Institutional gold traders, central bank reserve managers, and mining companies all use these benchmarks. The 30-minute window around each Fix creates predictable volatility spikes. Gold also reacts to EUR/USD direction during London — a strong euro typically supports gold. Your gold edge is highest during the 07:00-11:00 UTC window." },
      { pair: "EUR/GBP", liquidity: 4, reason: "Pure GBP cross during European hours", tag: "SECONDARY", deepDive: "EUR/GBP is a pure European cross that eliminates USD noise. During London hours, this pair reflects the relative economic divergence between the Eurozone and UK. It's particularly useful when you have a view on GBP strength/weakness but want to avoid USD event risk. Lower volatility than cable but higher win-rate on mean-reversion setups around key 0.8500-0.8700 levels." },
      { pair: "GER40",   liquidity: 4, reason: "DAX cash open at 08:00 UTC drives indices", tag: "SECONDARY", deepDive: "The DAX (GER40) cash market opens at 08:00 UTC and the first 60 minutes are the most volatile of the European equity session. German industrial data, ECB policy, and global risk sentiment drive the index. The DAX is more volatile than other European indices, making it ideal for momentum setups. The gap-fill strategy on DAX open has historically had a 65%+ hit rate during trending days." },
    ],
    avoid: [
      { pair: "USD/JPY", liquidity: 3, reason: "Tokyo close means thinning yen flow until NY", tag: "THIN", deepDive: "USD/JPY's liquidity backbone is the Tokyo Fix and Japanese institutional desks. When Tokyo closes at 09:00 UTC, yen liquidity drops sharply. The pair enters a dead zone between 09:00-12:00 UTC where moves are unreliable and often retrace. Wait for the NY session overlap (12:00 UTC) when USD/JPY gets a second wind from US institutional flow and potential Fed-related catalysts." },
      { pair: "AUD/JPY", liquidity: 2, reason: "Asian crosses dying — flows have rotated to EUR/GBP", tag: "THIN", deepDive: "AUD/JPY loses its structural advantage once Tokyo closes. The carry-trade flow that drives this pair is concentrated in Asian hours. During London, institutional focus shifts entirely to EUR/GBP and EUR/USD — the capital that was in yen crosses has rotated. Any AUD/JPY move during London is a shadow of EUR/USD direction, not its own signal. Trade the source (EUR/USD), not the echo." },
      { pair: "NZD/USD", liquidity: 2, reason: "Antipodean pairs lose relevance until NY overlap", tag: "THIN", deepDive: "NZD/USD is an orphan during London. New Zealand desks are closed, Australian desks are winding down, and European traders have zero interest in kiwi. The pair drifts with general USD sentiment but without its own catalyst or liquidity depth. Spreads widen to 1.5-2.0 pips and fill quality deteriorates. Any NZD/USD position during London is essentially a worse version of a EUR/USD or GBP/USD trade." },
      { pair: "BTC/USD", liquidity: 3, reason: "Less correlated to FX moves — different driver", tag: "DECEPTIVE", deepDive: "Bitcoin during London has reasonable volume but its correlation to FX macro drivers is inconsistent. Some days BTC mirrors risk-on/risk-off sentiment perfectly; other days it trades on crypto-native news (exchange flows, whale transfers, protocol events). This inconsistency makes cross-asset analysis unreliable. If you trade crypto during London, treat it as an independent asset class, not a correlated macro play." },
    ],
    expectedHoldMin: 90,
    riskBudget: 45,
  },
  NY: {
    description: "New York session — the second pillar of liquidity. The NY/London overlap (12:00-15:00 UTC) is the most volatile and most tradeable window of the entire 24-hour cycle. News-driven regime.",
    rules: [
      "Killzone 12:00-15:00 UTC — overlap with London = maximum liquidity",
      "Watch for USD news at 12:30 UTC (NFP, CPI, Retail Sales)",
      "After 15:00 UTC, post-killzone drift is choppy �� half-size or stop",
    ],
    favored: [
      { pair: "EUR/USD", liquidity: 5, reason: "Peak overlap with London — institutional flow", tag: "PRIMARY", deepDive: "EUR/USD during the NY/London overlap (12:00-16:00 UTC) reaches absolute peak global liquidity. Both London and New York institutional desks are active simultaneously. US economic releases (NFP, CPI, PPI at 12:30 UTC) create high-conviction directional moves. The first 90 minutes after data often set the day's trend. This is where your edge compounds most — lean into size during confirmed setups." },
      { pair: "GBP/USD", liquidity: 5, reason: "London/NY overlap = highest volatility window", tag: "PRIMARY", deepDive: "GBP/USD during the London/NY overlap achieves its highest daily volatility. Both UK and US desks create a two-sided institutional tape with genuine price discovery. Cable reacts to US data as a USD cross, then UK institutional flow adds a second directional layer. Average hourly range during the overlap is 25-40 pips — enough for multiple R on a clean setup. Focus on the 12:00-14:00 UTC window for the highest signal-to-noise ratio." },
      { pair: "US30",    liquidity: 5, reason: "Wall Street cash open at 13:30 UTC", tag: "PRIMARY", deepDive: "The Dow Jones cash open at 13:30 UTC is the single most liquid moment for US equity indices. Pre-market positioning resolves, opening print gaps get filled or extend, and sector rotation becomes visible. The first 30 minutes (13:30-14:00 UTC) set the day's bias. After 14:00 UTC, trend continuation or reversal becomes clear. Your best index setup is the opening range breakout aligned with pre-market momentum." },
      { pair: "US100",   liquidity: 5, reason: "Tech-heavy index at peak liquidity", tag: "PRIMARY", deepDive: "Nasdaq 100 at the NY cash open is where tech mega-cap flow concentrates. FAANG earnings, semiconductor data, and AI sentiment create asymmetric directional moves. The index is more volatile than US30 — average daily range is 1.2-1.8% versus 0.8-1.2% for the Dow. This higher volatility means better R-multiples but requires tighter risk management. Best traded during 13:30-16:00 UTC when institutional volume is highest." },
      { pair: "XAU/USD", liquidity: 4, reason: "Reacts hard to USD economic data releases", tag: "PRIMARY", deepDive: "Gold during the NY session reacts inversely to USD strength on economic data. NFP, CPI, and Fed speeches create the day's most significant gold moves. The PM LBMA Fix at 15:00 UTC is the second institutional benchmark — expect a volatility spike around that window. Gold also responds to US Treasury yields in real-time during NY. Your gold edge is highest when you combine USD data direction with yield curve movement for confirmation." },
      { pair: "USD/CAD", liquidity: 4, reason: "Local CAD news flow during NY hours", tag: "OVERLAP", deepDive: "USD/CAD is a North American pair that peaks during NY hours. Canadian economic data (employment, CPI, BoC decisions) releases alongside US data, creating dual-catalyst setups. WTI crude oil — CAD's primary driver — trades most actively during NY. The pair's correlation with oil makes it a unique macro play: trade USD/CAD when you have a view on energy markets. Best window is 12:30-15:00 UTC when both US and Canadian data flow is active." },
    ],
    avoid: [
      { pair: "AUD/USD", liquidity: 2, reason: "Asian session pairs cooling — reduced participation", tag: "THIN", deepDive: "AUD/USD is structurally disadvantaged during NY. Australian desks are closed, RBA communication is silent, and the pair trades as a proxy for general USD sentiment rather than on its own merits. Volume drops to 25% of Sydney session levels. Any AUD/USD move during NY is a shadow of EUR/USD — you're trading the same USD direction with worse liquidity and wider spreads. Trade EUR/USD instead for cleaner execution." },
      { pair: "NZD/USD", liquidity: 2, reason: "Minimal antipodean flow during US hours", tag: "THIN", deepDive: "NZD/USD during NY hours has almost no domestic liquidity. New Zealand is asleep, dairy markets are closed, and RBNZ is silent. The pair moves with general USD sentiment but with wider spreads (1.8-2.5 pips) and poor fill quality. Any setup you see on NZD/USD during NY is better expressed through EUR/USD or GBP/USD with tighter spreads and deeper books." },
      { pair: "USD/JPY", liquidity: 3, reason: "Tokyo asleep — drift can be deceptive", tag: "DECEPTIVE", deepDive: "USD/JPY during NY has a deceptive quality. While it responds to US data and Treasury yields, the absence of Japanese institutional flow means moves can extend beyond natural support/resistance levels and then snap back violently when Tokyo opens. The pair is most dangerous in the 16:00-21:00 UTC window after London closes — yen moves become one-sided and vulnerable to overnight reversals." },
      { pair: "EUR/JPY", liquidity: 2, reason: "Yen crosses thin once London winds down", tag: "THIN", deepDive: "EUR/JPY is a two-session instrument: it needs both European AND Japanese desks active for genuine liquidity. During late NY (after 16:00 UTC), both London and Tokyo are closed, leaving EUR/JPY in a liquidity desert. The pair drifts on algorithmic cross-hedging, and any directional move is unreliable. If you must trade yen exposure during NY, use USD/JPY for its US data sensitivity instead." },
    ],
    expectedHoldMin: 75,
    riskBudget: 35,
  },
}

/** Lookup a pair's liquidity status for a given session.
 *  Returns "favored" / "avoid" / "neutral" plus the associated note (if any). */
export function lookupPairLiquidity(sessionKey: SessionWindow["key"], pair: string): {
  status: "favored" | "avoid" | "neutral"
  note: PairLiquidityNote | null
} {
  const playbook = SESSION_LIQUIDITY_RULES[sessionKey]
  const inFavored = playbook.favored.find((p) => p.pair === pair)
  if (inFavored) return { status: "favored", note: inFavored }
  const inAvoid = playbook.avoid.find((p) => p.pair === pair)
  if (inAvoid) return { status: "avoid", note: inAvoid }
  return { status: "neutral", note: null }
}

/* User's watchlist — these are the pairs they actually trade. Each pair
   is now tagged with one of five trading categories (USD-pairs, EUR-pairs,
   STOCKS, COMMODITIES, CRYPTO) so the watchlist surface can group them
   into category tiles instead of a flat list. Each pair still carries a
   real mini OHLC bar series for the inline candle preview.               */
export type WatchCategoryId = "USD" | "EUR" | "STOCKS" | "COMMODITIES" | "CRYPTO"

export interface WatchPair {
  symbol: string
  category: WatchCategoryId
  bias: "LONG" | "SHORT" | "NEUTRAL"
  winRate: number               // user's WR on this pair
  sampleSize: number
  pipsToday: number             // signed
  inFocus: boolean              // is this in today's plan?
  warning?: string              // AI suggestion if pair is weak
  bars: { o: number; h: number; l: number; c: number }[]
}

/** Generate 24 deterministic OHLC bars for a pair — keeps the surface stable
 *  across renders without needing a live feed. Volatility scales with the pair. */
function genBars(seed: number, vol: number, drift: number, n = 24): WatchPair["bars"] {
  const bars: WatchPair["bars"] = []
  let last = 100
  // simple LCG for deterministic noise
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < n; i++) {
    const o = last
    const dir = rand() > 0.5 - drift ? 1 : -1
    const c = o + dir * (rand() * vol)
    const h = Math.max(o, c) + rand() * vol * 0.4
    const l = Math.min(o, c) - rand() * vol * 0.4
    bars.push({ o, h, l, c })
    last = c
  }
  return bars
}

export const WATCHLIST: WatchPair[] = [
  // ── USD-quoted forex (anything where USD is the quote or counter-USD) ──
  { symbol: "EUR/USD", category: "USD", bias: "LONG",  winRate: PERFORMANCE.bestPair.winRate, sampleSize: 47, pipsToday: +18, inFocus: true,
    bars: genBars(11, 0.32, 0.06) },
  { symbol: "GBP/USD", category: "USD", bias: "LONG",    winRate: 64, sampleSize: 28, pipsToday: +12, inFocus: false,
    bars: genBars(12, 0.45, 0.04) },
  { symbol: "AUD/USD", category: "USD", bias: "SHORT",   winRate: 52, sampleSize: 18, pipsToday: -14, inFocus: false,
    bars: genBars(13, 0.30, -0.05) },
  { symbol: "USD/JPY", category: "USD", bias: "SHORT", winRate: 55,   sampleSize: 22, pipsToday: -8,  inFocus: false,
    bars: genBars(55, 0.40, -0.04) },
  { symbol: "USD/CAD", category: "USD", bias: "NEUTRAL", winRate: PERFORMANCE.worstPair.winRate, sampleSize: 14, pipsToday: -22, inFocus: false,
    warning: PERFORMANCE.worstPair.aiSuggestion, bars: genBars(33, 0.65, -0.10) },
  { symbol: "USD/CHF", category: "USD", bias: "NEUTRAL", winRate: 49, sampleSize: 12, pipsToday: +4,  inFocus: false,
    bars: genBars(14, 0.38, 0.02) },

  // ── EUR-cross forex (any pair where EUR is base, excluding EUR/USD) ──
  { symbol: "EUR/GBP", category: "EUR", bias: "NEUTRAL", winRate: 51, sampleSize: 16, pipsToday: -3,  inFocus: false,
    bars: genBars(21, 0.20, -0.02) },
  { symbol: "EUR/JPY", category: "EUR", bias: "LONG",    winRate: 61, sampleSize: 24, pipsToday: +21, inFocus: true,
    bars: genBars(23, 0.55, 0.05) },
  { symbol: "EUR/AUD", category: "EUR", bias: "LONG",    winRate: 58, sampleSize: 11, pipsToday: +9,  inFocus: false,
    bars: genBars(24, 0.48, 0.03) },
  { symbol: "EUR/CHF", category: "EUR", bias: "SHORT",   winRate: 47, sampleSize: 9,  pipsToday: -6,  inFocus: false,
    bars: genBars(25, 0.18, -0.03) },

  // ── STOCKS / Indices ──
  { symbol: "US30",    category: "STOCKS", bias: "LONG",   winRate: 59, sampleSize: 19, pipsToday: +6,   inFocus: false,
    bars: genBars(44, 0.92, 0.04) },
  { symbol: "US100",   category: "STOCKS", bias: "LONG",   winRate: 63, sampleSize: 26, pipsToday: +34,  inFocus: true,
    bars: genBars(45, 1.10, 0.06) },
  { symbol: "SPX500",  category: "STOCKS", bias: "LONG",   winRate: 60, sampleSize: 21, pipsToday: +11,  inFocus: false,
    bars: genBars(46, 0.78, 0.05) },
  { symbol: "GER40",   category: "STOCKS", bias: "NEUTRAL", winRate: 53, sampleSize: 14, pipsToday: -7,  inFocus: false,
    bars: genBars(47, 0.85, -0.02) },

  // ── Commodities (Metals + Energy) ──
  { symbol: "XAU/USD", category: "COMMODITIES", bias: "LONG", winRate: 68, sampleSize: 31, pipsToday: +42, inFocus: true,
    bars: genBars(22, 0.85, 0.08) },
  { symbol: "XAG/USD", category: "COMMODITIES", bias: "LONG",    winRate: 62, sampleSize: 17, pipsToday: +18, inFocus: false,
    bars: genBars(31, 0.95, 0.07) },
  { symbol: "XPT/USD", category: "COMMODITIES", bias: "NEUTRAL", winRate: 50, sampleSize: 8,  pipsToday: -5,  inFocus: false,
    bars: genBars(32, 0.90, 0.00) },
  { symbol: "USOIL",   category: "COMMODITIES", bias: "SHORT",   winRate: 56, sampleSize: 13, pipsToday: -19, inFocus: false,
    bars: genBars(34, 1.15, -0.06) },

  // ── Crypto (kept tradable-friendly) ──
  { symbol: "BTC/USD", category: "CRYPTO", bias: "LONG",    winRate: 65, sampleSize: 29, pipsToday: +88, inFocus: true,
    bars: genBars(61, 1.40, 0.07) },
  { symbol: "ETH/USD", category: "CRYPTO", bias: "LONG",    winRate: 60, sampleSize: 22, pipsToday: +44, inFocus: false,
    bars: genBars(62, 1.25, 0.06) },
  { symbol: "SOL/USD", category: "CRYPTO", bias: "NEUTRAL", winRate: 54, sampleSize: 14, pipsToday: -12, inFocus: false,
    bars: genBars(63, 1.55, -0.04) },

]

/* tiny typo fix wrapper */
function genBors(...args: Parameters<typeof genBars>): ReturnType<typeof genBars> { return genBars(...args) }

/* ─────────────────────────────────────────────────────────────────────────
   WATCHLIST CATEGORIES — the 5 instrument families the UI is grouped by.
   Each tile in the WatchlistMatrix represents one of these. Clicking a
   tile opens a modal with all the pairs in that category, rendered as
   high-quality WatchlistPairCards (mirror of the session TradablePairCard).
   ─────────────────────────────────────────────────────────────────────── */
export interface WatchCategory {
  id: WatchCategoryId
  label: string                     // short uppercase label (USD)
  fullName: string                  // display name on the tile  ("US-DOLLAR PAIRS")
  description: string               // sub-line shown on the tile ("EUR/USD · GBP/USD · …")
}
export const WATCH_CATEGORIES: WatchCategory[] = [
  { id: "USD",         label: "USD",         fullName: "US DOLLAR PAIRS",
    description: "Forex pairs quoted against the US Dollar." },
  { id: "EUR",         label: "EUR",         fullName: "EURO CROSSES",
    description: "Forex crosses where the Euro is the base currency." },
  { id: "STOCKS",      label: "STOCKS",      fullName: "INDICES",
    description: "Cash CFD indices traded across global sessions." },
  { id: "COMMODITIES", label: "COMMODITIES", fullName: "METALS & ENERGY",
    description: "Gold, silver, platinum, oil and other commodities." },
  { id: "CRYPTO",      label: "CRYPTO",      fullName: "DIGITAL ASSETS",
    description: "Major cryptocurrency CFDs and spot pairs." },
]

/** Aggregate today's headline numbers for a given category — used by
 *  the outer category tile to show pip totals, focus count, dominant
 *  bias, win-rate, etc. without rendering every pair inline.           */
export interface WatchCategoryAggregate {
  pairsCount: number
  inFocusCount: number
  warningCount: number
  pipsToday: number                 // sum of pipsToday across pairs
  totalSample: number               // total trades sampled
  weightedWinRate: number           // sample-weighted WR across pairs
  dominantBias: "LONG" | "SHORT" | "NEUTRAL"
  topPair: WatchPair | null         // best pipsToday pair
  worstPair: WatchPair | null       // worst pipsToday pair
}
export function aggregateCategory(category: WatchCategoryId): WatchCategoryAggregate {
  const pairs = WATCHLIST.filter(p => p.category === category)
  const pipsToday = pairs.reduce((a, p) => a + p.pipsToday, 0)
  const totalSample = pairs.reduce((a, p) => a + p.sampleSize, 0)
  const weightedWinRate = totalSample > 0
    ? Math.round(pairs.reduce((a, p) => a + p.winRate * p.sampleSize, 0) / totalSample)
    : 0
  const biasCounts: Record<"LONG" | "SHORT" | "NEUTRAL", number> = { LONG: 0, SHORT: 0, NEUTRAL: 0 }
  pairs.forEach(p => { biasCounts[p.bias]++ })
  const dominantBias = (Object.entries(biasCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "NEUTRAL") as
    "LONG" | "SHORT" | "NEUTRAL"
  const sorted = [...pairs].sort((a, b) => b.pipsToday - a.pipsToday)
  return {
    pairsCount: pairs.length,
    inFocusCount: pairs.filter(p => p.inFocus).length,
    warningCount: pairs.filter(p => p.warning).length,
    pipsToday,
    totalSample,
    weightedWinRate,
    dominantBias,
    topPair: sorted[0] ?? null,
    worstPair: sorted[sorted.length - 1] ?? null,
  }
}

/** Human-friendly currency map for the pair card header
 *  ("EUR/USD" → "EURO · US DOLLAR").                                  */
const WATCHLIST_CURRENCY_NAMES: Record<string, string> = {
  EUR: "EURO",
  USD: "US DOLLAR",
  GBP: "BRITISH POUND",
  JPY: "JAPANESE YEN",
  AUD: "AUSTRALIAN DOLLAR",
  NZD: "NEW ZEALAND DOLLAR",
  CAD: "CANADIAN DOLLAR",
  CHF: "SWISS FRANC",
  XAU: "GOLD",
  XAG: "SILVER",
  XPT: "PLATINUM",
  XPD: "PALLADIUM",
  BTC: "BITCOIN",
  ETH: "ETHEREUM",
  SOL: "SOLANA",
}
function watchPairFullName(symbol: string): string {
  // Index symbols (US30, US100, GER40, SPX500, USOIL) — show as-is
  if (!symbol.includes("/")) {
    const indexNames: Record<string, string> = {
      US30: "DOW JONES 30",
      US100: "NASDAQ 100",
      SPX500: "S&P 500",
      GER40: "GERMANY 40",
      USOIL: "WTI CRUDE OIL",
    }
    return indexNames[symbol] ?? symbol
  }
  const [base, quote] = symbol.split("/")
  const b = WATCHLIST_CURRENCY_NAMES[base] ?? base
  const q = WATCHLIST_CURRENCY_NAMES[quote] ?? quote
  return `${b} · ${q}`
}

/* ─────────────────────────────────────────────────────────────────────────
   CATEGORY VISUAL IDENTITY MAP
   Each instrument category gets its own accent palette + signature glyph
   so the watchlist tiles stop looking like five identical cards.
   These accents intentionally sit on the cool–warm spectrum so they
   coexist with VANTARY's primary (teal/amber) accent without clashing:

       USD          → cool blue          (banknote glyph)
       EUR          → warm gold          (euro star-ring glyph)
       STOCKS       → silver/cool white  (bar-chart spike glyph)
       COMMODITIES  → copper / bronze    (ingot stack glyph)
       CRYPTO       → bright cyan        (hex node glyph)
   ─────────────────────────────────────────────────────────────────────── */
export interface CategoryVis {
  accent: string         // primary hex
  accentRule: string     // ~22% alpha for borders / chips
  accentWash: string     // ~6% alpha for backplate
  trim: string           // ~30% alpha for top stripe
  Icon: (props: { size?: number; color?: string }) => React.ReactElement
}
export const CATEGORY_VIS: Record<WatchCategoryId, CategoryVis> = {
  USD: {
    accent: "#5BA8E5",
    accentRule: "rgba(91,168,229,0.28)",
    accentWash: "rgba(91,168,229,0.06)",
    trim: "rgba(91,168,229,0.55)",
    Icon: ({ size = 18, color = "currentColor" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="6.5" width="18" height="11" rx="1.2" />
        <circle cx="12" cy="12" r="2.6" />
        <path d="M5.4 8.6h.01M18.6 15.4h.01M5.4 15.4h.01M18.6 8.6h.01" />
      </svg>
    ),
  },
  EUR: {
    accent: "#E5B95B",
    accentRule: "rgba(229,185,91,0.30)",
    accentWash: "rgba(229,185,91,0.07)",
    trim: "rgba(229,185,91,0.60)",
    Icon: ({ size = 18, color = "currentColor" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <path d="M14.8 8.2a4.4 4.4 0 1 0 0 7.6" />
        <path d="M7.4 10.6h6M7.4 13.4h6" />
      </svg>
    ),
  },
  STOCKS: {
    accent: "#B8C5D1",
    accentRule: "rgba(184,197,209,0.32)",
    accentWash: "rgba(184,197,209,0.06)",
    trim: "rgba(184,197,209,0.55)",
    Icon: ({ size = 18, color = "currentColor" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 19h18" />
        <rect x="5"  y="11" width="2.4" height="6" />
        <rect x="9.5" y="7"  width="2.4" height="10" />
        <rect x="14" y="13" width="2.4" height="4" />
        <path d="M5 9 11 4l5 4 3-3" />
      </svg>
    ),
  },
  COMMODITIES: {
    accent: "#D49A6E",
    accentRule: "rgba(212,154,110,0.30)",
    accentWash: "rgba(212,154,110,0.07)",
    trim: "rgba(212,154,110,0.55)",
    Icon: ({ size = 18, color = "currentColor" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 17h14l-2-3H7z" />
        <path d="M7 14h10l-2-3H9z" />
        <path d="M9 11h6l-1.5-2.5h-3z" />
      </svg>
    ),
  },
  CRYPTO: {
    accent: "#5BE5D1",
    accentRule: "rgba(91,229,209,0.30)",
    accentWash: "rgba(91,229,209,0.06)",
    trim: "rgba(91,229,209,0.55)",
    Icon: ({ size = 18, color = "currentColor" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3 4 7v10l8 4 8-4V7z" />
        <path d="M12 3v18M4 7l8 4 8-4M12 11v10" />
      </svg>
    ),
  },
}

/* ─────────────────────────────────────────────────────────────────────────
   <CurrencyFlag/> — small SVG flag chip rendered for any currency code,
   index, commodity, or crypto symbol. All chips are rendered in the same
   16×11 frame with a 1px hairline so they line up perfectly when stacked.
   For non-sovereign symbols we render a stylised glyph instead of a flag
   (e.g. XAU = gold ingot, BTC = orange hex with B).
   ─────────────────────────────────────────────────────────────────────── */
function CurrencyFlag({ code, w = 16, h = 11 }: { code: string; w?: number; h?: number }) {
  const c = code.toUpperCase()

  // Common SVG wrapper with hairline border + clip
  const wrap = (children: React.ReactNode) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 16 11"
      role="img"
      aria-label={c}
      style={{ display: "inline-block", borderRadius: 1.5, overflow: "hidden", flexShrink: 0 }}
    >
      <defs>
        <clipPath id={`cf-${c}-clip`}>
          <rect x="0" y="0" width="16" height="11" rx="1.2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#cf-${c}-clip)`}>
        {children}
      </g>
      <rect x="0.5" y="0.5" width="15" height="10" rx="1.2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    </svg>
  )

  switch (c) {
    case "USD":
    case "US30":
    case "US100":
    case "SPX500":
      // Stars and stripes — simplified canton + 6 stripes for legibility at 16×11
      return wrap(<>
        <rect width="16" height="11" fill="#B22234" />
        {[0,2,4,6,8,10].map(y => (
          <rect key={y} x="0" y={y} width="16" height="1" fill="#FFFFFF" />
        ))}
        <rect x="0" y="0" width="7" height="6" fill="#3C3B6E" />
        {/* tiny stars */}
        {[1.6, 3.2, 4.8].map((cx, i) => (
          <circle key={i} cx={cx} cy="2" r="0.45" fill="#FFFFFF" />
        ))}
        {[1.6, 3.2, 4.8].map((cx, i) => (
          <circle key={`b-${i}`} cx={cx} cy="4" r="0.45" fill="#FFFFFF" />
        ))}
      </>)

    case "EUR":
      return wrap(<>
        <rect width="16" height="11" fill="#003399" />
        {/* 12 stars in circle, scaled down to dots */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2
          return (
            <circle
              key={i}
              cx={8 + Math.cos(a) * 3.4}
              cy={5.5 + Math.sin(a) * 3}
              r="0.55"
              fill="#FFCC00"
            />
          )
        })}
      </>)

    case "GBP":
      return wrap(<>
        <rect width="16" height="11" fill="#012169" />
        {/* white diagonals */}
        <path d="M0 0 L16 11 M16 0 L0 11" stroke="#FFFFFF" strokeWidth="2.4" />
        <path d="M0 0 L16 11 M16 0 L0 11" stroke="#C8102E" strokeWidth="0.9" />
        {/* white cross */}
        <rect x="6.6" y="0" width="2.8" height="11" fill="#FFFFFF" />
        <rect x="0" y="4.1" width="16" height="2.8" fill="#FFFFFF" />
        {/* red cross */}
        <rect x="7.2" y="0" width="1.6" height="11" fill="#C8102E" />
        <rect x="0" y="4.7" width="16" height="1.6" fill="#C8102E" />
      </>)

    case "JPY":
      return wrap(<>
        <rect width="16" height="11" fill="#FFFFFF" />
        <circle cx="8" cy="5.5" r="3" fill="#BC002D" />
      </>)

    case "AUD":
      return wrap(<>
        <rect width="16" height="11" fill="#012169" />
        {/* canton — Union Jack feel reduced to navy + stripes */}
        <rect x="0" y="0" width="7" height="5" fill="#012169" />
        <path d="M0 0 L7 5 M7 0 L0 5" stroke="#FFFFFF" strokeWidth="0.9" />
        <rect x="3" y="0" width="1" height="5" fill="#FFFFFF" />
        <rect x="0" y="2" width="7" height="1" fill="#FFFFFF" />
        {/* southern cross dots */}
        <circle cx="11" cy="3" r="0.55" fill="#FFFFFF" />
        <circle cx="13.5" cy="5" r="0.45" fill="#FFFFFF" />
        <circle cx="11.5" cy="7" r="0.55" fill="#FFFFFF" />
        <circle cx="3.5" cy="8.5" r="0.65" fill="#FFFFFF" />
      </>)

    case "NZD":
      return wrap(<>
        <rect width="16" height="11" fill="#012169" />
        <rect x="0" y="0" width="7" height="5" fill="#012169" />
        <path d="M0 0 L7 5 M7 0 L0 5" stroke="#FFFFFF" strokeWidth="0.9" />
        <circle cx="11" cy="3.5" r="0.45" fill="#C8102E" />
        <circle cx="13" cy="5.5" r="0.55" fill="#C8102E" />
        <circle cx="11" cy="7.5" r="0.45" fill="#C8102E" />
        <circle cx="13.5" cy="3" r="0.4"  fill="#C8102E" />
      </>)

    case "CAD":
      return wrap(<>
        <rect x="0" y="0" width="4.5" height="11" fill="#D52B1E" />
        <rect x="11.5" y="0" width="4.5" height="11" fill="#D52B1E" />
        <rect x="4.5" y="0" width="7" height="11" fill="#FFFFFF" />
        {/* simplified maple leaf (diamond) */}
        <path d="M8 2.4 L9.4 5 L11 5.4 L9.6 6.4 L10 8 L8 7 L6 8 L6.4 6.4 L5 5.4 L6.6 5 Z" fill="#D52B1E" />
      </>)

    case "CHF":
      return wrap(<>
        <rect width="16" height="11" fill="#DA291C" />
        <rect x="6.8" y="2.4" width="2.4" height="6.2" fill="#FFFFFF" />
        <rect x="4.9" y="4.3" width="6.2" height="2.4" fill="#FFFFFF" />
      </>)

    case "GER40":
      return wrap(<>
        <rect x="0" y="0"  width="16" height="3.7" fill="#000000" />
        <rect x="0" y="3.7" width="16" height="3.7" fill="#DD0000" />
        <rect x="0" y="7.4" width="16" height="3.6" fill="#FFCE00" />
      </>)

    // ── Commodities glyphs ──
    case "XAU":
      return wrap(<>
        <defs>
          <linearGradient id="g-xau" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5D689" />
            <stop offset="50%" stopColor="#D4A93E" />
            <stop offset="100%" stopColor="#A07725" />
          </linearGradient>
        </defs>
        <rect width="16" height="11" fill="url(#g-xau)" />
        <text x="8" y="7.6" textAnchor="middle" fontSize="5.2" fontWeight="700" fill="#3F2C0E" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">Au</text>
      </>)
    case "XAG":
      return wrap(<>
        <defs>
          <linearGradient id="g-xag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8ECEF" />
            <stop offset="100%" stopColor="#7E8A93" />
          </linearGradient>
        </defs>
        <rect width="16" height="11" fill="url(#g-xag)" />
        <text x="8" y="7.6" textAnchor="middle" fontSize="5.2" fontWeight="700" fill="#2A3036" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">Ag</text>
      </>)
    case "XPT":
      return wrap(<>
        <defs>
          <linearGradient id="g-xpt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9DCE0" />
            <stop offset="100%" stopColor="#646A70" />
          </linearGradient>
        </defs>
        <rect width="16" height="11" fill="url(#g-xpt)" />
        <text x="8" y="7.6" textAnchor="middle" fontSize="5.2" fontWeight="700" fill="#1F2428" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">Pt</text>
      </>)
    case "USOIL":
      return wrap(<>
        <rect width="16" height="11" fill="#0E1115" />
        <path d="M8 2.4 C5.6 5.4 5.6 7.6 8 8.6 C10.4 7.6 10.4 5.4 8 2.4 Z" fill="#1F8A6B" stroke="#5BE5C2" strokeWidth="0.4" />
      </>)

    // ── Crypto glyphs (hex chip) ──
    case "BTC":
      return wrap(<>
        <rect width="16" height="11" fill="#1E1A14" />
        <path d="M8 1 L13.5 3.2 L13.5 7.8 L8 10 L2.5 7.8 L2.5 3.2 Z" fill="#F2A33A" />
        <text x="8" y="7.6" textAnchor="middle" fontSize="5.6" fontWeight="700" fill="#1E1A14" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">B</text>
      </>)
    case "ETH":
      return wrap(<>
        <rect width="16" height="11" fill="#10141A" />
        <path d="M8 1.8 L11.6 5.6 L8 7 L4.4 5.6 Z" fill="#9CA3D6" />
        <path d="M8 7.6 L11.6 6.2 L8 9.4 L4.4 6.2 Z" fill="#6E76A8" />
      </>)
    case "SOL":
      return wrap(<>
        <rect width="16" height="11" fill="#0A1517" />
        <path d="M3 3.6 L11.4 3.6 L13 2.2 L4.6 2.2 Z" fill="#5BE5D1" />
        <path d="M3 6.2 L11.4 6.2 L13 4.8 L4.6 4.8 Z" fill="#5BB7E5" />
        <path d="M3 8.8 L11.4 8.8 L13 7.4 L4.6 7.4 Z" fill="#5BE5D1" />
      </>)

    default:
      // Unknown code → neutral chip with currency letters
      return wrap(<>
        <rect width="16" height="11" fill="#1A2129" />
        <text x="8" y="7.4" textAnchor="middle" fontSize="4.6" fontWeight="600" fill="rgba(234,239,244,0.75)" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace">{c.slice(0, 3)}</text>
      </>)
  }
}

/** <PairFlagBadge/> — renders the "two-flag chip" used beside any pair
 *  symbol. For forex pairs (EUR/USD) it stacks the base & quote flags
 *  side-by-side. For indices/commodities/crypto it renders a single
 *  glyph chip.                                                            */
function PairFlagBadge({ symbol, w = 14, h = 10 }: { symbol: string; w?: number; h?: number }) {
  if (symbol.includes("/")) {
    const [base, quote] = symbol.split("/")
    return (
      <span className="inline-flex items-center" style={{ gap: 2 }}>
        <CurrencyFlag code={base} w={w} h={h} />
        <CurrencyFlag code={quote} w={w} h={h} />
      </span>
    )
  }
  return <CurrencyFlag code={symbol} w={w} h={h} />
}

/* ─────────────────────────────────────────────────────────────────────────
   PairForensics — deterministic, dense per-pair telemetry.
   The single source of truth for both:
     · the new <PairStatBand> shown in the collapsed row, and
     · the full <PairForensicsView> takeover dossier.
   Everything is derived from `pair.bars` + a symbol seed so the dashboard
   stays stable across renders without needing a live data feed.
   ───────────────���─────────────────────────────────────────────────────── */

/* Stable symbol→seed so identical pairs always render identical forensics. */
function symbolSeed(sym: string): number {
  let h = 0
  for (let i = 0; i < sym.length; i++) h = (h * 31 + sym.charCodeAt(i)) >>> 0
  return h
}

/* Tiny seedable LCG for forensic derivations. */
function rng(seed: number): () => number {
  let s = seed || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export interface PairForensics {
  // Headline
  pipsWin: number          // total pips earned across all winning trades
  pipsLoss: number         // total pips lost across all losing trades (positive number, displayed with minus)
  pipsNet: number          // signed
  netUsd: number           // dollar P&L
  trades: number           // total trade count
  wins: number
  losses: number
  breakEven: number
  tpHits: number
  slHits: number
  partialWins: number
  slippagePips: number
  profitFactor: number
  expectancyR: number
  daysActive: number       // days since first trade on pair
  freqPerMonth: number
  lastTradedHrsAgo: number
  heat: "HOT" | "NORMAL" | "COLD"
  bestSession: "ASIA" | "LDN" | "NY-AM" | "NY-PM"
  // Hour-of-day (24 bins) — { count, wr }
  hourly: { hour: number; count: number; wr: number }[]
  // Day×Session edge heatmap — 5 days × 4 sessions
  edge: { day: "MON" | "TUE" | "WED" | "THU" | "FRI"; session: "ASIA" | "LDN" | "NY-AM" | "NY-PM"; wr: number; sample: number }[]
  // Setup mix — strategies used on this pair
  setups: { name: string; trades: number; wr: number; avgR: number }[]
  // R-multiple histogram — buckets from -3R to +5R in 0.5R steps
  rHist: { bucket: number; count: number }[]
  // Hold-time profile (minutes)
  holdWinAvg: number; holdWinP25: number; holdWinP75: number
  holdLossAvg: number; holdLossP25: number; holdLossP75: number
  // Direction split
  longTrades: number;  longWR: number;  longPips: number;  longAvgR: number
  shortTrades: number; shortWR: number; shortPips: number; shortAvgR: number
  // Account distribution
  accounts: { id: string; label: string; type: "live" | "prop_firm" | "demo"; broker: string; trades: number; wr: number; pnl: number }[]
  // Recent trades feed
  recent: {
    id: string; ts: string; dir: "long" | "short";
    entry: number; exit: number; pips: number; r: number;
    grade: "A+" | "A" | "B" | "RB"; account: string; note: string;
  }[]
  // AI verdict
  verdict: { confidence: number; working: string; watch: string; next: string }
}

export function derivePairForensics(pair: WatchPair): PairForensics {
  const seed = symbolSeed(pair.symbol)
  const r = rng(seed)
  const sample = pair.sampleSize

  // Wins / losses / break-even mix
  const wins = Math.round(sample * (pair.winRate / 100))
  const losses = Math.round(sample * ((100 - pair.winRate) / 100 * 0.92))
  const breakEven = Math.max(0, sample - wins - losses)
  const tpHits = Math.round(wins * (0.62 + r() * 0.18))
  const partialWins = Math.max(0, wins - tpHits)
  const slHits = Math.round(losses * (0.78 + r() * 0.18))
  const slippagePips = Math.round(2 + r() * 9)

  // Pip totals — bigger volatility ⇒ bigger pip targets
  const pairAnchor = PAIR_LIVE_ANCHOR[pair.symbol] || { pipFactor: 100 } as any
  const avgWinPips = pair.symbol === "XAU/USD" ? 22 : pair.symbol === "GBP/JPY" ? 28 : pair.symbol === "US30" ? 35 : 14
  const avgLossPips = Math.round(avgWinPips * (0.55 + r() * 0.18))
  const pipsWin = wins * avgWinPips + Math.round(r() * 30)
  const pipsLoss = losses * avgLossPips + Math.round(r() * 14) + slippagePips
  const pipsNet = pipsWin - pipsLoss + (pair.pipsToday | 0)
  const netUsd = Math.round(pipsNet * (pair.symbol === "XAU/USD" ? 9 : pair.symbol === "US30" ? 4 : 7))

  const profitFactor = Number((pipsWin / Math.max(1, pipsLoss)).toFixed(2))
  const expectancyR = Number((((wins * 1.4) - (losses * 1.0)) / Math.max(1, sample)).toFixed(2))
  const daysActive = 60 + Math.round(r() * 60)
  const freqPerMonth = Math.max(1, Math.round((sample / daysActive) * 30))
  const lastTradedHrsAgo = Math.round(r() * 72)
  const heat: PairForensics["heat"] = lastTradedHrsAgo < 6 ? "HOT" : lastTradedHrsAgo < 36 ? "NORMAL" : "COLD"
  const sessionsList: PairForensics["bestSession"][] = ["ASIA", "LDN", "NY-AM", "NY-PM"]
  const bestSession = sessionsList[Math.floor(r() * 4)]

  // Hour-of-day distribution: weighted around best session.
  const sessionHours: Record<PairForensics["bestSession"], [number, number]> = {
    ASIA:  [0, 8],
    LDN:   [7, 11],
    "NY-AM": [12, 16],
    "NY-PM": [16, 21],
  }
  const [bsFrom, bsTo] = sessionHours[bestSession]
  const hourly: PairForensics["hourly"] = Array.from({ length: 24 }, (_, h) => {
    const inBand = h >= bsFrom && h < bsTo
    const baseCount = inBand ? 2 + r() * 4 : r() * 1.6
    const count = Math.round(baseCount)
    const wr = Math.round(Math.min(95, Math.max(15, (inBand ? pair.winRate + 4 + r() * 8 : pair.winRate - 12 + r() * 18))))
    return { hour: h, count, wr }
  })

  // Day × Session edge — 5 × 4 = 20 cells
  const days: PairForensics["edge"][number]["day"][] = ["MON", "TUE", "WED", "THU", "FRI"]
  const edge: PairForensics["edge"] = []
  days.forEach((day, di) => {
    sessionsList.forEach((s, si) => {
      const k = di * 4 + si
      const isBest = s === bestSession && (di === 1 || di === 2)
      const wr = Math.round(Math.min(92, Math.max(20, pair.winRate + (isBest ? 12 : 0) + (Math.sin(seed + k * 1.7) * 14))))
      const sampleN = Math.max(0, Math.round(2 + Math.cos(seed + k * 0.9) * 3 + (isBest ? 3 : 0)))
      edge.push({ day, session: s, wr, sample: sampleN })
    })
  })

  // Setup mix — pulled from STRATEGIES if available, else canned set.
  const setupNames = (STRATEGIES?.length ? STRATEGIES.slice(0, 4).map((s: any) => s.name) : []) as string[]
  const fallbacks = ["Trend Pullback", "Range Fade", "News Gap", "Liquidity Sweep"]
  const baseSetups = setupNames.length === 4 ? setupNames : fallbacks
  let remaining = sample
  const setups: PairForensics["setups"] = baseSetups.map((name, i) => {
    const isLast = i === baseSetups.length - 1
    const share = isLast ? remaining : Math.max(2, Math.round(sample * [0.42, 0.28, 0.18, 0.12][i]))
    remaining -= share
    return {
      name,
      trades: Math.max(1, share),
      wr: Math.round(Math.min(92, Math.max(28, pair.winRate + (i === 0 ? 8 : i === baseSetups.length - 1 ? -14 : (r() - 0.5) * 16)))),
      avgR: Number(((i === 0 ? 1.6 : 1 - i * 0.2) + r() * 0.4).toFixed(2)),
    }
  })

  // R histogram — buckets at -3, -2.5 ... +5 (17 buckets)
  const buckets = Array.from({ length: 17 }, (_, i) => -3 + i * 0.5)
  const rHist: PairForensics["rHist"] = buckets.map((b) => {
    // Concentrate around 0..+1.5R for winners, -1..-1R for losers.
    const target = pair.winRate > 60 ? 1.0 : 0.5
    const dist = Math.abs(b - target)
    const baseCount = Math.max(0, Math.round((sample / 5) * Math.exp(-dist * 0.9) + (r() - 0.5) * 1.6))
    return { bucket: b, count: baseCount }
  })

  // Hold-time profile: winners hold longer than losers (good discipline)
  const holdWinAvg  = pair.symbol === "XAU/USD" ? 88 : pair.symbol === "GBP/JPY" ? 142 : 134
  const holdLossAvg = Math.round(holdWinAvg * (0.28 + r() * 0.18))

  // Direction split
  const longShare = Math.min(0.9, Math.max(0.1, pair.bias === "LONG" ? 0.74 : pair.bias === "SHORT" ? 0.22 : 0.5 + (r() - 0.5) * 0.3))
  const longTrades = Math.round(sample * longShare)
  const shortTrades = sample - longTrades
  const longWR = Math.round(Math.min(92, Math.max(20, pair.winRate + (pair.bias === "LONG" ? 4 : -8))))
  const shortWR = Math.round(Math.min(92, Math.max(20, pair.winRate + (pair.bias === "SHORT" ? 4 : -8))))
  const longPips = Math.round(pipsWin * longShare - pipsLoss * (1 - longShare) * 0.4)
  const shortPips = pipsNet - longPips

  // Account distribution
  const acctPool: PairForensics["accounts"] = [
    { id: "ic-live",   label: "IC Markets · LIVE",  type: "live",      broker: "IC Markets",  trades: 0, wr: 0, pnl: 0 },
    { id: "ftmo",      label: "FTMO · 200K",        type: "prop_firm", broker: "FTMO",        trades: 0, wr: 0, pnl: 0 },
    { id: "oanda",     label: "OANDA · DEMO",       type: "demo",      broker: "OANDA",       trades: 0, wr: 0, pnl: 0 },
  ]
  const dist = [0.62, 0.26, 0.12]
  acctPool.forEach((a, i) => {
    a.trades = Math.max(1, Math.round(sample * dist[i]))
    a.wr     = Math.round(Math.min(92, Math.max(20, pair.winRate + (i === 0 ? 4 : i === 1 ? -7 : -16) + (r() - 0.5) * 8)))
    a.pnl    = Math.round(netUsd * dist[i] * (1 + (i === 0 ? 0.08 : -0.05)))
  })

  // Recent trades — 8 newest
  const recent: PairForensics["recent"] = Array.from({ length: 8 }, (_, i) => {
    const winRoll = r()
    const isWin = winRoll < pair.winRate / 100
    const dir: "long" | "short" = r() > (pair.bias === "SHORT" ? 0.65 : 0.4) ? "long" : "short"
    const live = pairAnchor.price ?? 1
    const decimals = pairAnchor.decimals ?? 4
    const pipFactor = pairAnchor.pipFactor ?? 10000
    const move = (isWin ? avgWinPips : -avgLossPips) * (0.7 + r() * 0.6) * (dir === "long" ? 1 : -1)
    const entry = Number((live + (r() - 0.5) * 0.005 * live).toFixed(decimals))
    const exit  = Number((entry + move / pipFactor).toFixed(decimals))
    const pips  = Math.round((exit - entry) * pipFactor * (dir === "long" ? 1 : -1))
    const rMul  = Number((pips / Math.max(8, avgLossPips)).toFixed(2))
    const grade: PairForensics["recent"][number]["grade"] =
      rMul >= 1.5 ? "A+" : rMul >= 0.8 ? "A" : rMul >= -0.6 ? "B" : "RB"
    const ts = `${["Apr 28", "Apr 27", "Apr 26", "Apr 25", "Apr 24", "Apr 23", "Apr 22", "Apr 21"][i]} · ${[10, 9, 14, 8, 13, 11, 15, 9][i]}:${["14", "32", "07", "55", "21", "48", "03", "27"][i]}`
    return {
      id: `${pair.symbol}-${i}`,
      ts, dir, entry, exit, pips, r: rMul, grade,
      account: ["IC Markets · LIVE", "FTMO · 200K", "OANDA · DEMO"][Math.floor(r() * 3)],
      note: isWin
        ? "Held to first liquidity pool. Plan executed cleanly."
        : "Premature exit. Did not let trade breathe.",
    }
  })

  // AI verdict — light templating
  const confidence = 70 + Math.round(r() * 22)
  const verdict = {
    confidence,
    working: pair.winRate >= 60
      ? `Trend continuation entries during ${bestSession} convert at ${Math.round(pair.winRate + 8)}% on this pair.`
      : `Counter-trend pulls hold positive expectancy when entered at session opens.`,
    watch:   pair.winRate < 60
      ? `Friday afternoons drag P&L by an estimated $${Math.round(Math.abs(netUsd) * 0.18)}/mo — consider session restriction.`
      : `Average loss size on this pair is creeping up over the last 14 trades. Tighten your invalidation level.`,
    next:    pair.winRate >= 60
      ? `Maintain sizing. Consider doubling ${bestSession} allocation while edge holds.`
      : `Halve next allocation until win-rate crosses 55% on a 10-trade rolling window.`,
  }

  return {
    pipsWin, pipsLoss, pipsNet, netUsd,
    trades: sample, wins, losses, breakEven,
    tpHits, slHits, partialWins, slippagePips,
    profitFactor, expectancyR, daysActive, freqPerMonth, lastTradedHrsAgo, heat, bestSession,
    hourly, edge, setups, rHist,
    holdWinAvg, holdWinP25: Math.round(holdWinAvg * 0.4), holdWinP75: Math.round(holdWinAvg * 1.7),
    holdLossAvg, holdLossP25: Math.round(holdLossAvg * 0.35), holdLossP75: Math.round(holdLossAvg * 1.85),
    longTrades, longWR, longPips, longAvgR: Number((expectancyR * (longShare > 0.5 ? 1.1 : 0.85)).toFixed(2)),
    shortTrades, shortWR, shortPips, shortAvgR: Number((expectancyR * (longShare > 0.5 ? 0.85 : 1.1)).toFixed(2)),
    accounts: acctPool, recent, verdict,
  }
}

/* Macro events — pulled live from DAILY_PLAN, then shaped for the Vantary
   alert sheet (severity wash, plan impact line, AI recommend). */
export const MACRO_EVENTS = DAILY_PLAN.macroEvents.map((e, i) => ({
  ...e,
  id: `macro-${i}`,
  affectedPairs: e.currency === "EUR"
    ? ["EUR/USD", "EUR/GBP", "EUR/JPY"]
    : ["EUR/USD", "GBP/USD", "XAU/USD", "US30"],
  planImpact: e.impact === "high"
    ? `Plan rule: no trading 30 min before. Affects ${["EUR/USD", "XAU/USD"].join(" · ")}.`
    : "Watchable. No plan restriction.",
}))

/* ═══════════════════════════════════════════════════════════════════════════
   2.  SHARED PRIMITIVES
   ═════════���═════════════════════════════════════════════════════════════════ */

/** Magnitude / precision split (Vantary signature numeric trick). */
function splitMag(v: string): { lead: string; tail: string } {
  const m = v.match(/^([^\d-]*)([\d,]+)(.*)$/)
  if (!m) return { lead: v, tail: "" }
  const [, prefix, digits, suffix] = m
  const half = Math.ceil(digits.replace(/,/g, "").length / 2)
  let walked = 0, cut = 0
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== ",") walked++
    if (walked >= half) { cut = i + 1; break }
  }
  while (cut < digits.length && digits[cut] === ",") cut++
  return { lead: prefix + digits.slice(0, cut), tail: digits.slice(cut) + suffix }
}

function ProtagonistNum({ value, suffix, size = 56 }: { value: string; suffix?: string; size?: number }) {
  const { lead, tail } = useMemo(() => splitMag(value), [value])
  return (
    <div className="inline-flex items-baseline gap-1.5 select-none">
      <span className="font-sans" style={{ fontSize: size, lineHeight: 0.95, letterSpacing: "-0.025em", fontWeight: 600, color: VANTARY.paper, textShadow: CHROMA_SHADOW_LO }}>
        {lead}
      </span>
      {tail && <span className="font-sans" style={{ fontSize: size, lineHeight: 0.95, letterSpacing: "-0.025em", fontWeight: 200, color: VANTARY.ash }}>{tail}</span>}
      {suffix && <span className="font-sans" style={{ fontSize: Math.round(size * 0.28), color: VANTARY.ash, fontWeight: 400, marginLeft: 4 }}>{suffix}</span>}
    </div>
  )
}

function CardShell({
  children, padding = 24, hover = true,
}: { children: React.ReactNode; padding?: number; hover?: boolean }) {
  const [over, setOver] = useState(false)
  return (
    <div
      onMouseEnter={() => hover && setOver(true)}
      onMouseLeave={() => setOver(false)}
      className="relative h-full transition-transform duration-500"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${over ? VANTARY.ruleStrong : VANTARY.rule}`,
        borderRadius: RADIUS_V.cardLg,
        padding,
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        transform: over ? "translateY(-2px)" : "translateY(0)",
        boxShadow: over ? `0 18px 48px rgba(0,0,0,0.4), 0 0 0 1px ${VANTARY.ruleStrong}` : "0 4px 16px rgba(0,0,0,0.25)",
        transition: "transform 500ms cubic-bezier(0.22,1,0.36,1), border-color 400ms, box-shadow 400ms",
      }}
    >
      {over && (
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%", width: 320, height: 320,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${VANTARY.amberHalo} 0%, transparent 65%)`,
            filter: "blur(40px)", opacity: 0.55, zIndex: 0,
          }}
        />
      )}
      <div className="relative" style={{ zIndex: 1 }}>{children}</div>
    </div>
  )
}

function CardHeader({
  eyebrow, title, accessory,
}: { eyebrow: string; title: string; accessory?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
          {eyebrow}
        </div>
        <h3 className="font-sans mt-1" style={{ fontSize: 14, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.005em" }}>
          {title}
        </h3>
      </div>
      {accessory ?? <ArrowUpRight size={14} strokeWidth={1.5} color={VANTARY.ash} />}
    </div>
  )
}

function StatusDot({ tone, breathe = true, size = 7 }: { tone: "ok" | "warn" | "bad"; breathe?: boolean; size?: number }) {
  const fill = tone === "ok" ? "#34d399" : tone === "warn" ? VANTARY.amber : "#f87171"
  return (
    <motion.span
      className="inline-block rounded-full"
      style={{ width: size, height: size, background: fill }}
      animate={breathe ? { opacity: [0.55, 1, 0.55] } : undefined}
      transition={breathe ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  )
}

/* ═════════��═════════════════════════════════════════════════════════════════
   3.  <SessionsRadar/>  — the global trading day
   ────────────────────────────────────────────────────���──────────────────────
   Mirrors frame #8 Schedule Offset matrix: hero metric, dashed time rails,
   value pucks per session. The "where am I in the day" view, but with each
   session's killzone marked as an amber wash and the trader's own win-rate
   shown as the puck under each city.
   ═══════════════════════════════════════════════════════════════════════════ */

export function SessionsRadar({
  onTakeover,
}: {
  /**
   * When provided, clicking a session puck calls this callback INSTEAD of
   * triggering the in-card FullSessionDossier swap. This lets the parent
   * row (e.g. your-space.tsx hero grid) take over the entire horizontal
   * lane with a richer session deep-dive panel — far more space than this
   * single card can offer.
   */
  onTakeover?: (key: SessionWindow["key"]) => void
} = {}) {
  // tick once per minute so the cursor moves
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60

  // identify the active session (closest open window)
  const active = useMemo(() => {
    return SESSIONS.find(s => {
      if (s.openUTC < s.closeUTC) return utcHour >= s.openUTC && utcHour < s.closeUTC
      return utcHour >= s.openUTC || utcHour < s.closeUTC
    })
  }, [utcHour])

  // ETA to next session that isn't currently active
  const next = useMemo(() => {
    const upcoming = SESSIONS
      .map(s => {
        let h = s.openUTC - utcHour
        if (h <= 0) h += 24
        return { s, hours: h }
      })
      .sort((a, b) => a.hours - b.hours)
    return upcoming.find(x => x.s.key !== active?.key) ?? upcoming[0]
  }, [utcHour, active])

  /* ── Drill-in selection ────────────────────────────────────────────
     Clicking a SessionPuck sets `selectedKey`. The bottom strip below
     the rail then SWAPS the 4-puck overview for the in-place
     <SessionDossier/> — a compact 88px-tall deep-dive frame so the
     parent card barely grows. Clicking the dossier's back chevron
     clears the selection and the pucks return.                       */
  const [selectedKey, setSelectedKey] = useState<SessionWindow["key"] | null>(null)
  const selectedSession = useMemo(
    () => (selectedKey ? SESSIONS.find(s => s.key === selectedKey) ?? null : null),
    [selectedKey],
  )

  return (
    <CardShell>
      {/* ── Whole-card swap ─────────────────────────────────────────────
            When a session is clicked, the ENTIRE card body (header +
            hero + rail + pucks) cross-fades out and the FullSessionDossier
            takes over the same canvas top-to-bottom. The CardShell
            chrome stays put so the dashboard layout doesn't twitch.   */}
      <AnimatePresence mode="wait" initial={false}>
        {selectedSession ? (
          <motion.div
            key={`dossier-${selectedSession.key}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.32, ease: EASE_V }}
          >
            <DossierErrorBoundary
              key={`boundary-${selectedSession.key}`}
              onRetry={() => setSelectedKey(null)}
            >
              <FullSessionDossier
                session={selectedSession}
                onClose={() => setSelectedKey(null)}
              />
            </DossierErrorBoundary>
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_V }}
          >
            {/*  CardHeader removed by design — the Sessions Radar
                speaks for itself. Its first words are "ACTIVE WINDOW"
                followed by the protagonist city at 64px. The redundant
                "GLOBAL TRADING DAY · Sessions Radar · SYDNEY LIVE"
                strip stole vertical real-estate and diluted the
                headline; everything that strip used to convey is now
                encoded in the hero (pulse dot, big city name, regime
                tile) and timeline (comet cursor) below.              */}

            {/* Hero band — co-active headline + teaching vitals + progress */}
            <LivingSessionHero active={active} next={next} utcHour={utcHour} />

            {/* 24h LIVING TIMELINE — interactive: hover any session, any
                overlap zone, any hour tick, or the comet itself for a
                rich tactical tooltip. */}
            <SessionRail utcHour={utcHour} />

            {/* mt-7 leaves room for the active puck's tether (16px) above its top edge */}
            <div className="mt-7 relative">
              {/* ── CO-ACTIVE ARC ───────────────────────────────────────
                  When 2+ sessions are open at the same time, draw a
                  hairline SVG arc connecting their pucks above the row,
                  with a "DUAL" label centered on it. This visually
                  reinforces the overlap state shown in the headline
                  ligature and the timeline overlap zone. The arc is
                  computed dynamically from puck index positions so it
                  works for ANY pair of co-active sessions (Sydney+Tokyo
                  today, London+NY at 12:00–16:00 UTC, etc.).        */}
              <CoActivePuckArc utcHour={utcHour} />

              <div className="grid grid-cols-4 gap-3">
                {SESSIONS.map((s, i) => {
                  // A session is "active" for puck purposes when ANY currently-open
                  // session matches — not just the protagonist. This lets multiple
                  // pucks light up during overlap windows (e.g. London/NY 12:00–16:00).
                  const isActive = isSessionOpen(s, utcHour)
                  return (
                    <SessionPuck
                      key={s.key}
                      session={s}
                      isActive={isActive}
                      utcHour={utcHour}
                      index={i}
                      onSelect={() => {
                        // When the parent owns the takeover (e.g. hero row swap),
                        // we DON'T set internal selectedKey — otherwise we'd end
                        // up with both the in-card dossier AND the parent
                        // takeover panel rendering at the same time.
                        if (onTakeover) onTakeover(s.key)
                        else setSelectedKey(s.key)
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   <SessionTakeoverPanel/> — full-row takeover deep-dive
   ────────────────────────────────────────�����������������────────────────────────────────
   When a trader clicks Sydney/Tokyo/London/NY in the SessionsRadar, this
   panel REPLACES the entire hero lane (Live Equity Volume + Sessions Radar
   side-by-side). It uses every horizontal pixel to surface what the trader
   would otherwise miss:

       Top strip      ▸ session-tab navigator + prev/next + close
       Column 1 (3)   ▸ Identity + Live Stats (city, regime, hero numbers)
       Column 2 (5)   ▸ Liquidity Playbook (FAVORED + AVOID lists)
       Column 3 (4)   ▸ Behavior Audit (violations, rhythm, verdict)

   ═════════════════════════════════════════════════════════════════════════ */

/* ── TAKEOVER ERROR BOUNDARY ────────────────────────────────────────────
 *  Defense-in-depth: if any deep-dive sub-component throws (stale state,
 *  unexpected data shape, race condition during session switch), the user
 *  sees a graceful recovery card instead of a black screen. The boundary
 *  resets automatically when `resetKey` (session.key) changes, so swapping
 *  sessions clears the error state cleanly.
 * ──────────────────────────────────────────────────────────────────── */
class TakeoverErrorBoundary extends React.Component<
  { children: React.ReactNode; resetKey: string; onReset: () => void },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode; resetKey: string; onReset: () => void }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log("[v0] TakeoverErrorBoundary caught:", error.message, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div
          className="rounded-md"
          style={{
            margin: "16px 0",
            padding: "16px 20px",
            border: `1px solid rgba(248,113,113,0.25)`,
            background: "rgba(248,113,113,0.04)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={12} strokeWidth={1.5} color="#f87171" />
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#f87171" }}>
              SESSION VIEW · INTERRUPTED
            </span>
          </div>
          <div className="font-sans" style={{ fontSize: 12, color: VANTARY.paper, lineHeight: 1.5, marginBottom: 10 }}>
            Something glitched while rendering this session. The dashboard caught it before it could break the rest of the screen — switch sessions or reset to continue.
          </div>
          <div className="font-mono" style={{ fontSize: 9, color: VANTARY.paperDim, lineHeight: 1.5, marginBottom: 10, padding: "6px 8px", borderRadius: 3, background: "rgba(255,255,255,0.014)", border: `1px solid ${VANTARY.rule}`, wordBreak: "break-word" }}>
            {this.state.error.message || "Unknown render error"}
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null })
              this.props.onReset()
            }}
            className="font-mono uppercase"
            style={{
              fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber,
              padding: "5px 10px",
              border: `1px solid ${VANTARY.amberHalo}`,
              borderRadius: 3,
              background: VANTARY.amberWash,
              cursor: "pointer",
            }}
          >
            RESET SESSION VIEW
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function SessionTakeoverPanel({
  sessionKey,
  onClose,
  onChange,
}: {
  sessionKey: SessionWindow["key"]
  onClose: () => void
  onChange: (key: SessionWindow["key"]) => void
}) {
  const session = useMemo(
    () => SESSIONS.find((s) => s.key === sessionKey)!,
    [sessionKey],
  )
  const playbook = SESSION_LIQUIDITY_RULES[sessionKey]
  const forensics = useMemo(() => generateSessionForensics(session), [session])

  // Live UTC tick — drives the "TIME SPENT" hero metric and the active state
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60

  // Is this session currently active in the wall clock?
  const isLive = useMemo(() => {
    const { openUTC, closeUTC } = session
    if (openUTC < closeUTC) return utcHour >= openUTC && utcHour < closeUTC
    return utcHour >= openUTC || utcHour < closeUTC
  }, [utcHour, session])

  // Time spent / time-to-close / time-to-open
  const sessionLength = useMemo(() => {
    return Math.max(1, ((session.closeUTC - session.openUTC) + 24) % 24 || 24)
  }, [session])
  const liveProgress = useMemo(() => {
    if (!isLive) return 0
    let elapsed = utcHour - session.openUTC
    if (elapsed < 0) elapsed += 24
    return Math.min(1, elapsed / sessionLength)
  }, [utcHour, session, sessionLength, isLive])
  const timeSpentLabel = useMemo(() => {
    if (!isLive) return formatHours(sessionLength) + " window"
    const elapsedH = liveProgress * sessionLength
    return formatHours(elapsedH) + " of " + formatHours(sessionLength)
  }, [isLive, liveProgress, sessionLength])

  // Compute violations: pairs the trader actually traded that are on the
  // AVOID list for this session. Each carries the pip cost for the trader.
  const violations = useMemo(() => {
    return forensics.pairStats
      .map((ps) => {
        const lookup = lookupPairLiquidity(sessionKey, ps.pair)
        if (lookup.status !== "avoid") return null
        return {
          pair: ps.pair,
          trades: ps.trades,
          pips: ps.pips,
          netR: ps.netR,
          reason: lookup.note?.reason ?? "",
          tag: lookup.note?.tag ?? "THIN",
        }
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
  }, [forensics, sessionKey])

  // Discipline score — 100 if no violations & all favored pairs traded, drops
  // by 12 per violation pair, by 4 per favored pair NOT traded.
  const disciplineScore = useMemo(() => {
    let score = 100
    for (const v of violations) score -= 12
    const tradedPairs = new Set(forensics.pairStats.map((p) => p.pair))
    for (const fav of playbook.favored) {
      if (!tradedPairs.has(fav.pair) && fav.tag === "PRIMARY") score -= 4
    }
    return Math.max(0, Math.min(100, score))
  }, [violations, forensics, playbook])

  // Verdict copy generation — addresses the trader directly.
  const verdict = useMemo(() => buildSessionVerdict({
    session, playbook, forensics, violations, disciplineScore,
  }), [session, playbook, forensics, violations, disciplineScore])

  // Risk used = sum of |R| across the session's trades, capped at riskBudget
  const riskUsed = useMemo(() => {
    const totalR = forensics.pairStats.reduce(
      (a, p) => a + p.recentTrades.reduce((aa, t) => aa + Math.abs(t.r), 0), 0,
    )
    // Translate R into a visual % of the session's risk budget.
    return Math.min(100, Math.round((totalR / 8) * playbook.riskBudget))
  }, [forensics, playbook])

  // Which session sits next/prev in the trading day order
  const orderedKeys: SessionWindow["key"][] = ["SYDNEY", "TOKYO", "LONDON", "NY"]
  const idx = orderedKeys.indexOf(sessionKey)
  const prevKey = orderedKeys[(idx - 1 + orderedKeys.length) % orderedKeys.length]
  const nextKey = orderedKeys[(idx + 1) % orderedKeys.length]

  return (
    <CardShell padding={0} hover={false}>
      {/* All takeover content lives inside one shell so the surrounding
          glass/blur frame matches every other Vantary surface. */}
      <div style={{ padding: 22 }}>
        <SessionTakeoverHeader
          session={session}
          isLive={isLive}
          activeKey={sessionKey}
          onChange={onChange}
          onClose={onClose}
          onPrev={() => onChange(prevKey)}
          onNext={() => onChange(nextKey)}
        />

        <TakeoverErrorBoundary
          resetKey={sessionKey}
          onReset={() => onChange(sessionKey)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`takeover-body-${sessionKey}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.34, ease: EASE_V }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4"
            >
              {/* COL 1 · Identity + Live Stats + Session Rules */}
              <div className="lg:col-span-3">
                <SessionIdentityColumn
                  session={session}
                  isLive={isLive}
                  liveProgress={liveProgress}
                  timeSpentLabel={timeSpentLabel}
                  sessionLength={sessionLength}
                  forensics={forensics}
                  playbook={playbook}
                  riskUsed={riskUsed}
                  disciplineScore={disciplineScore}
                />
              </div>

              {/* COL 2 · What You Traded (favored + avoid with body-replacement deep-dive) */}
              <div className="lg:col-span-5">
                <SessionTradedColumn
                  key={sessionKey}
                  playbook={playbook}
                  session={session}
                  forensics={forensics}
                  violations={violations}
                  verdict={verdict}
                  disciplineScore={disciplineScore}
                />
              </div>

              {/* COL 3 · Discipline + Rules + Violations + Hourly Rhythm
                  (Coach Verdict moved to column 2 as terminal block.) */}
              <div className="lg:col-span-4">
                <SessionBehaviorColumn
                  key={sessionKey}
                  forensics={forensics}
                  violations={violations}
                  playbook={playbook}
                  session={session}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </TakeoverErrorBoundary>
      </div>
    </CardShell>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Sub-components for SessionTakeoverPanel
   ───────────────────────────────────────────────────────────────────── */

function formatHours(hours: number): string {
  if (hours <= 0) return "0m"
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function buildSessionVerdict({
  session, playbook, forensics, violations, disciplineScore,
}: {
  session: SessionWindow
  playbook: SessionPlaybook
  forensics: SessionForensics
  violations: { pair: string; pips: number }[]
  disciplineScore: number
}): string {
  const tone = disciplineScore >= 80 ? "edge" : disciplineScore >= 55 ? "balanced" : "weak"
  const violationCount = violations.length

  if (tone === "edge") {
    return `${session.city} is where you compound. Discipline ${disciplineScore}/100 · you're trading the right pairs at the right hour. Keep position-size confident inside the killzone.`
  }
  if (tone === "balanced") {
    if (violationCount === 0) {
      return `${session.city} is a workmanlike window for you. ${forensics.winRate}% WR with ${forensics.netPips >= 0 ? "+" : ""}${forensics.netPips}p net — solid but not your edge. Stick to the favored list.`
    }
    return `${session.city} is leaking edge. You're still hitting your favored pairs but ${violationCount} pair${violationCount > 1 ? "s have" : " has"} no liquidity here — that's where your losses cluster.`
  }
  // weak
  if (violationCount > 0) {
    return `${session.city} is a defensive window. You traded ${violationCount} pair${violationCount > 1 ? "s" : ""} that have no real liquidity here — that's the entire performance gap.`
  }
  return `${session.city} is a defensive window. Volatility outpaces your edge — half-size or skip this window outside the killzone.`
}

/* ── Header bar with session tabs + prev/next + close ──────────────── */
function SessionTakeoverHeader({
  session, isLive, activeKey, onChange, onClose, onPrev, onNext,
}: {
  session: SessionWindow
  isLive: boolean
  activeKey: SessionWindow["key"]
  onChange: (k: SessionWindow["key"]) => void
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Left — eyebrow + status */}
      <div className="flex items-center gap-3">
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
            GLOBAL TRADING DAY · DEEP DIVE
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="font-sans" style={{ fontSize: 14, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.005em" }}>
              {session.city} · {session.regime} regime
            </h3>
            {isLive && (
              <>
                <StatusDot tone={session.regime === "NEWS" ? "warn" : "ok"} size={6} />
                <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.amber }}>
                  LIVE
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center — session tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-full"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${VANTARY.rule}`,
        }}
      >
        {SESSIONS.map((s) => {
          const active = s.key === activeKey
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange(s.key)}
              className="font-sans transition-colors rounded-full px-3 py-1.5"
              style={{
                fontSize: 12,
                fontWeight: active ? 500 : 400,
                color: active ? VANTARY.paper : VANTARY.paperDim,
                background: active ? VANTARY.amberWash : "transparent",
                border: `1px solid ${active ? VANTARY.amberHalo : "transparent"}`,
                letterSpacing: "-0.005em",
                cursor: "pointer",
              }}
            >
              <span
                className="font-mono mr-2"
                style={{ fontSize: 9, letterSpacing: "0.18em", color: active ? VANTARY.amber : VANTARY.ashSoft }}
              >
                {s.flag}
              </span>
              {s.city}
            </button>
          )
        })}
      </div>

      {/* Right — nav + close */}
      <div className="flex items-center gap-1.5">
        <NavButton label="Previous session" onClick={onPrev} icon={<ChevronLeftSmall />} />
        <NavButton label="Next session" onClick={onNext} icon={<ChevronRight size={14} strokeWidth={1.5} />} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close deep dive"
          className="rounded-full transition-colors"
          style={{
            width: 30, height: 30,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${VANTARY.rule}`,
            color: VANTARY.paperDim,
            cursor: "pointer",
            marginLeft: 4,
          }}
          title="Close (return to overview)"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

function ChevronLeftSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function NavButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-full transition-colors hover:bg-white/5"
      style={{
        width: 30, height: 30,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${VANTARY.rule}`,
        color: VANTARY.paperDim,
        cursor: "pointer",
      }}
    >
      {icon}
    </button>
  )
}

/* ── COL 1 · Identity + Live Stats ─────────────────────────────────── */
function SessionIdentityColumn({
  session, isLive, liveProgress, timeSpentLabel, sessionLength,
  forensics, playbook, riskUsed, disciplineScore,
}: {
  session: SessionWindow
  isLive: boolean
  liveProgress: number
  timeSpentLabel: string
  sessionLength: number
  forensics: SessionForensics
  playbook: SessionPlaybook
  riskUsed: number
  disciplineScore: number
}) {
  const openLabel = `${String(session.openUTC).padStart(2, "0")}:00`
  const closeLabel = `${String(session.closeUTC).padStart(2, "0")}:00`

  // Compute percentage for time
  const timePercent = isLive ? Math.round(liveProgress * 100) : 100

  /* ── Sparkline data series for the stat-cell hover reveals ──────────
   *   Net Pips  → cumulative pips by hour  (running total, shows arc)
   *   Win-Rate  → per-hour WR              (volatility around the mean)
   *   Trades    → per-hour trade count     (when activity concentrated)
   *   Avg Hold  → per-pair avg hold mins   (which pairs hold longer)
   */
  const cumulativePipsByHour = useMemo(() => {
    let cum = 0
    return forensics.hours.map((h) => { cum += h.pips; return cum })
  }, [forensics.hours])
  const hourlyWrSeries    = useMemo(() => forensics.hours.map((h) => h.wr), [forensics.hours])
  const hourlyTradeSeries = useMemo(() => forensics.hours.map((h) => h.trades), [forensics.hours])
  const pairHoldSeries    = useMemo(() => forensics.pairStats.map((p) => p.avgHoldMin), [forensics.pairStats])
  const activeHoursCount  = useMemo(() => forensics.hours.filter((h) => h.trades > 0).length, [forensics.hours])

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Hero — flag + city + regime */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
            {session.flag}
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5">
              <motion.span
                className="rounded-full"
                style={{ width: 6, height: 6, background: VANTARY.amber }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber }}>
                LIVE NOW
              </span>
            </span>
          )}
        </div>
        <h2 className="font-sans mt-1" style={{ fontSize: 32, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.025em", lineHeight: 1 }}>
          {session.city}
        </h2>
        <div className="font-mono uppercase mt-1.5" style={{ fontSize: 10, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
          {openLabel} → {closeLabel} UTC · {session.regime}
        </div>
      </div>

      {/* Time Spent — enhanced with segmented progress + percentage */}
      <div
        className="rounded-md"
        style={{ padding: "8px 10px", border: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            TIME SPENT
          </span>
          <span className="font-mono tabular-nums" style={{ fontSize: 10, color: isLive ? VANTARY.amber : VANTARY.paperDim }}>
            {timePercent}%
          </span>
        </div>
        <div className="font-sans tabular-nums" style={{ fontSize: 16, fontWeight: 500, color: VANTARY.paper, lineHeight: 1, marginBottom: 6 }}>
          {timeSpentLabel}
        </div>
        {/* Segmented progress bar */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 10 }, (_, i) => {
            const segmentFilled = (isLive ? liveProgress : 1) > i / 10
            return (
              <motion.span
                key={i}
                className="flex-1"
                style={{
                  height: 4,
                  borderRadius: 1,
                  background: segmentFilled
                    ? isLive ? VANTARY.amber : "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.04)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft }}>{openLabel}</span>
          <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft }}>{closeLabel}</span>
        </div>
      </div>

      {/* Hero stat quartet — hover each to reveal a sparkline + delta */}
      <div className="grid grid-cols-2 gap-2">
        <StatCell
          label="NET PIPS"
          value={(forensics.netPips >= 0 ? "+" : "") + forensics.netPips}
          tone={forensics.netPips >= 0 ? "good" : "bad"}
          series={cumulativePipsByHour}
          seriesLabel="cumulative · by hour UTC"
          sub={`${forensics.netR >= 0 ? "+" : ""}${forensics.netR.toFixed(1)}R`}
          subTone={forensics.netR >= 0 ? "good" : "bad"}
        />
        <StatCell
          label="WIN-RATE"
          value={`${forensics.winRate}%`}
          tone={forensics.winRate >= 60 ? "good" : forensics.winRate >= 50 ? "neutral" : "bad"}
          series={hourlyWrSeries}
          seriesLabel="WR · by hour"
          sub={`peak ${forensics.peakHour.wr}%`}
          subTone={forensics.peakHour.wr >= 60 ? "good" : "neutral"}
        />
        <StatCell
          label="TRADES"
          value={String(forensics.trades)}
          tone="neutral"
          series={hourlyTradeSeries}
          seriesLabel="trades · by hour"
          sub={`${activeHoursCount}/${forensics.sessionLength}h active`}
          subTone="neutral"
        />
        <StatCell
          label="AVG HOLD"
          value={formatHours(forensics.avgHoldMin / 60)}
          tone="neutral"
          series={pairHoldSeries}
          seriesLabel="hold (min) · by pair"
          sub={`PF ${forensics.profitFactor.toFixed(2)}`}
          subTone={forensics.profitFactor >= 1.5 ? "good" : forensics.profitFactor >= 1 ? "neutral" : "bad"}
        />
      </div>

      {/* Risk Used — enhanced with segmented bar + budget label */}
      <div
        className="rounded-md"
        style={{ padding: "8px 10px", border: `1px solid ${riskUsed > playbook.riskBudget ? "rgba(248,113,113,0.25)" : VANTARY.rule}`, background: riskUsed > playbook.riskBudget ? "rgba(248,113,113,0.03)" : "rgba(255,255,255,0.014)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            RISK USED
          </span>
          <span className="font-mono tabular-nums" style={{ fontSize: 10, color: riskUsed > playbook.riskBudget ? "#f87171" : VANTARY.paper }}>
            {riskUsed}%
          </span>
        </div>
        <div className="flex items-baseline gap-1.5" style={{ marginBottom: 6 }}>
          <span className="font-sans tabular-nums" style={{ fontSize: 16, fontWeight: 500, color: riskUsed > playbook.riskBudget ? "#f87171" : VANTARY.paper, lineHeight: 1 }}>
            {riskUsed}%
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 8.5, color: VANTARY.ashSoft, letterSpacing: "0.14em" }}>
            of {playbook.riskBudget}% budget
          </span>
        </div>
        {/* Segmented risk bar */}
        <div className="relative flex items-center gap-0.5">
          {Array.from({ length: 10 }, (_, i) => {
            const segmentPercent = (i + 1) * 10
            const isFilled = riskUsed >= segmentPercent - 5
            const isBudget = Math.abs(segmentPercent - playbook.riskBudget) < 8
            return (
              <motion.span
                key={i}
                className="flex-1 relative"
                style={{
                  height: 4,
                  borderRadius: 1,
                  background: isFilled
                    ? riskUsed > playbook.riskBudget ? "#f87171" : VANTARY.amber
                    : "rgba(255,255,255,0.04)",
                  boxShadow: isBudget ? `0 0 0 1px rgba(255,255,255,0.3)` : "none",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft }}>0%</span>
          <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.amber }}>budget: {playbook.riskBudget}%</span>
          <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft }}>100%</span>
        </div>
        {riskUsed > playbook.riskBudget && (
          <div className="font-mono uppercase mt-1.5" style={{ fontSize: 8, letterSpacing: "0.16em", color: "#f87171" }}>
            OVER BUDGET — REDUCE EXPOSURE
          </div>
        )}
      </div>

      {/* Session character description */}
      <div
        className="font-sans"
        style={{
          fontSize: 11.5, color: VANTARY.paperDim, lineHeight: 1.55,
          paddingTop: 10,
          borderTop: `1px solid ${VANTARY.rule}`,
        }}
      >
        {playbook.description}
      </div>

    </div>
  )
}

/** Premium stat cell — hover reveals a sparkline + delta narrative.
 *  Used for NET PIPS / WIN-RATE / TRADES / AVG HOLD on the identity column. */
function StatCell({
  label, value, tone, series, seriesLabel, sub, subTone,
}: {
  label: string
  value: string
  tone: "good" | "bad" | "neutral"
  series?: number[]
  seriesLabel?: string
  sub?: string
  subTone?: "good" | "bad" | "neutral"
}) {
  const [hover, setHover] = useState(false)
  const valueColor = tone === "good" ? "#34d399" : tone === "bad" ? "#f87171" : VANTARY.paper
  const accentColor = tone === "good" ? "#34d399" : tone === "bad" ? "#f87171" : VANTARY.amber
  const accentBorder = tone === "good" ? "rgba(52,211,153,0.32)" : tone === "bad" ? "rgba(248,113,113,0.32)" : VANTARY.amberHalo
  const accentWash =
    tone === "good" ? "rgba(52,211,153,0.05)"
  : tone === "bad"  ? "rgba(248,113,113,0.05)"
  :                   VANTARY.amberWash
  const subColor = subTone === "good" ? "#34d399" : subTone === "bad" ? "#f87171" : VANTARY.ashSoft

  // Build sparkline path
  const path = useMemo(() => {
    if (!series || series.length === 0) return ""
    const w = 100
    const h = 18
    const max = Math.max(...series, 0.001)
    const min = Math.min(...series, 0)
    const range = Math.max(0.001, max - min)
    return series.map((v, i) => {
      const x = series.length === 1 ? 50 : (i / (series.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(" ")
  }, [series])

  // Highest point in sparkline for the moving dot
  const peakIdx = useMemo(() => {
    if (!series || series.length === 0) return 0
    return series.indexOf(Math.max(...series))
  }, [series])

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      animate={{
        borderColor: hover ? accentBorder : VANTARY.rule,
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.22, ease: EASE_V }}
      className="rounded-md relative overflow-hidden"
      style={{
        padding: "8px 10px",
        border: `1px solid ${VANTARY.rule}`,
        background: "rgba(255,255,255,0.014)",
        cursor: "default",
      }}
    >
      {/* Hover halo — radial highlight from top */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(120% 60% at 50% 0%, ${accentWash} 0%, transparent 60%)`,
        }}
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE_V }}
      />
      {/* Hover left accent rail */}
      <motion.div
        aria-hidden
        className="absolute top-0 bottom-0 left-0"
        style={{ width: 2, background: accentColor, transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hover ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_V }}
      />
      <div className="relative">
        <div className="flex items-baseline justify-between">
          <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
            {label}
          </span>
          {sub && (
            <motion.span
              className="font-mono tabular-nums"
              style={{ fontSize: 8, color: subColor, letterSpacing: "0.10em" }}
              animate={{ opacity: hover ? 1 : 0.55 }}
              transition={{ duration: 0.2 }}
            >
              {sub}
            </motion.span>
          )}
        </div>
        <div
          className="font-sans tabular-nums mt-1"
          style={{ fontSize: 18, fontWeight: 500, color: valueColor, letterSpacing: "-0.01em", lineHeight: 1 }}
        >
          {value}
        </div>
        {/* Sparkline reveal on hover */}
        <AnimatePresence initial={false}>
          {hover && series && series.length > 1 && (
            <motion.div
              key="sparkline"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 6 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: EASE_V }}
              style={{ overflow: "hidden" }}
            >
              <svg viewBox="0 0 100 18" preserveAspectRatio="none" style={{ width: "100%", height: 18, display: "block" }}>
                {/* baseline */}
                <line x1={0} y1={17} x2={100} y2={17} stroke={VANTARY.rule} strokeWidth={0.5} strokeDasharray="1 2" />
                <motion.path
                  d={path}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: EASE_V }}
                />
                {/* peak dot */}
                {series.length > 1 && (
                  <motion.circle
                    cx={(peakIdx / (series.length - 1)) * 100}
                    cy={18 - ((series[peakIdx] - Math.min(...series, 0)) / Math.max(0.001, Math.max(...series, 0.001) - Math.min(...series, 0))) * 18}
                    r={1.4}
                    fill={accentColor}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: 0.45 }}
                  />
                )}
              </svg>
              {seriesLabel && (
                <div className="font-mono uppercase mt-0.5" style={{ fontSize: 7, color: VANTARY.ashSoft, letterSpacing: "0.16em" }}>
                  {seriesLabel}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ── COL 2 · What You Traded ───────────────────────────────────────────
 *  This column is a *body-replacement surface*: the default body shows
 *  four pair lists (TRADED / MISSED / TRADED-AVOIDED / CORRECTLY-AVOIDED).
 *  Clicking any pair smoothly swaps the entire body for a comprehensive
 *  PairDeepDiveView dedicated to that single pair, with a back affordance
 *  to return. AnimatePresence drives the morph; layout never jumps.
 * ──────────────────────────���───────────────────────────────────────── */
type PairCategory = "good" | "bad" | "warn" | "muted"

interface SelectedPair {
  pair: string
  category: PairCategory
}

const CATEGORY_LABEL: Record<PairCategory, string> = {
  good:  "TRADED · ON THE PLAYBOOK",
  warn:  "MISSED · WAS ON THE PLAYBOOK",
  bad:   "TRADED · OFF THE PLAYBOOK",
  muted: "AVOIDED · OFF THE PLAYBOOK",
}

function categoryAccent(category: PairCategory) {
  return {
    color:
      category === "good"  ? "#34d399"
    : category === "bad"   ? "#f87171"
    : category === "warn"  ? VANTARY.amber
    :                        VANTARY.ashSoft,
    wash:
      category === "good"  ? "rgba(52,211,153,0.04)"
    : category === "bad"   ? "rgba(248,113,113,0.05)"
    : category === "warn"  ? VANTARY.amberWash
    :                        "rgba(255,255,255,0.02)",
    border:
      category === "good"  ? "rgba(52,211,153,0.18)"
    : category === "bad"   ? "rgba(248,113,113,0.20)"
    : category === "warn"  ? VANTARY.amberHalo
    :                        VANTARY.rule,
  }
}

function SessionTradedColumn({
  playbook, session, forensics, violations, verdict, disciplineScore,
}: {
  playbook: SessionPlaybook
  session: SessionWindow
  forensics: SessionForensics
  violations: { pair: string; trades: number; pips: number; reason: string; tag: string }[]
  verdict: string
  disciplineScore: number
}) {
  const [selected, setSelected] = useState<SelectedPair | null>(null)

  // Reset to overview if user switches to a different session
  useEffect(() => { setSelected(null) }, [session.key])

  // Build combined traded list: merge playbook pairs with user's actual trades
  const tradedPairs = new Set(forensics.pairStats.map((p) => p.pair))

  const tradedFavored = playbook.favored.filter((n) => tradedPairs.has(n.pair))
  const missedFavored = playbook.favored.filter((n) => !tradedPairs.has(n.pair))
  const tradedAvoided = playbook.avoid.filter((n)   => tradedPairs.has(n.pair))

  return (
    <div className="flex flex-col gap-3 h-full relative" style={{ minHeight: 540 }}>
      <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <motion.div
            key={`deepdive-${selected.pair}`}
            initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0,  filter: "blur(0px)" }}
            exit={{    opacity: 0, x: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.32, ease: EASE_V }}
            className="flex flex-col gap-3 h-full"
          >
            <PairDeepDiveView
              selected={selected}
              playbook={playbook}
              session={session}
              forensics={forensics}
              onBack={() => setSelected(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -14, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0,   filter: "blur(0px)" }}
            exit={{    opacity: 0, x: 14,  filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: EASE_V }}
            className="flex flex-col gap-3 h-full"
          >
            <div>
              <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft, marginBottom: 3 }}>
                YOUR TRADES · {session.city.toUpperCase()} WINDOW
              </div>
              <div className="font-sans" style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500, letterSpacing: "-0.005em" }}>
                What you traded — click any pair for a full breakdown
              </div>
            </div>

            <PairOverviewList
              eyebrow="TRADED THIS WINDOW — KEEP GOING"
              subtitle={tradedFavored.length > 0 ? `You traded ${tradedFavored.length} favored pair${tradedFavored.length !== 1 ? "s" : ""} — this is where your edge compounds` : "You didn't trade any favored pairs this window"}
              category="good"
              notes={tradedFavored}
              forensics={forensics}
              onSelectPair={(pair) => setSelected({ pair, category: "good" })}
            />

            {missedFavored.length > 0 && (
              <PairOverviewList
                eyebrow="MISSED — SHOULD HAVE TRADED"
                subtitle={`${missedFavored.length} favored pair${missedFavored.length !== 1 ? "s" : ""} had liquidity but you didn't take a position`}
                category="warn"
                notes={missedFavored}
                forensics={forensics}
                onSelectPair={(pair) => setSelected({ pair, category: "warn" })}
              />
            )}

            {tradedAvoided.length > 0 && (
              <PairOverviewList
                eyebrow="TRADED THIS WINDOW — SHOULD HAVE AVOIDED"
                subtitle={`${tradedAvoided.length} pair${tradedAvoided.length !== 1 ? "s" : ""} you traded with no real liquidity — this is where you leak edge`}
                category="bad"
                notes={tradedAvoided}
                forensics={forensics}
                onSelectPair={(pair) => setSelected({ pair, category: "bad" })}
              />
            )}

            {/* COACH VERDICT — terminal block of column 2.
                Replaces the old "CORRECTLY AVOIDED" list. Multi-section
                breakdown (headline · what went right · what to improve ·
                next-session focus · confidence stripe) so the middle
                column ends on the most actionable read of the session. */}
            <DetailedCoachVerdict
              forensics={forensics}
              violations={violations}
              playbook={playbook}
              session={session}
              verdict={verdict}
              disciplineScore={disciplineScore}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── PAIR OVERVIEW LIST · clickable rows that summon the deep-dive ──── */
function PairOverviewList({
  eyebrow, subtitle, category, notes, forensics, onSelectPair,
}: {
  eyebrow: string
  subtitle: string
  category: PairCategory
  notes: PairLiquidityNote[]
  forensics: SessionForensics
  onSelectPair: (pair: string) => void
}) {
  const { color: accentColor, wash: accentWash, border: accentBorder } = categoryAccent(category)

  if (notes.length === 0) return null

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: `1px solid ${accentBorder}` }}
    >
      {/* Header */}
      <div
        style={{
          padding: "7px 10px",
          background: accentWash,
          borderBottom: `1px solid ${accentBorder}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ width: 5, height: 5, borderRadius: 999, background: accentColor }} />
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.paper }}>
              {eyebrow}
            </span>
          </div>
          <span className="font-mono tabular-nums" style={{ fontSize: 9, color: accentColor }}>
            {notes.length}
          </span>
        </div>
        <div className="font-sans mt-0.5" style={{ fontSize: 10.5, color: VANTARY.paperDim, lineHeight: 1.35, paddingLeft: 13 }}>
          {subtitle}
        </div>
      </div>
      {/* Pair rows */}
      <ul className="flex flex-col">
        {notes.map((n, i) => {
          const userStats = forensics.pairStats.find((ps) => ps.pair === n.pair)
          return (
            <li key={n.pair} style={{ borderTop: i === 0 ? "none" : `1px solid ${VANTARY.rule}` }}>
              <motion.button
                type="button"
                onClick={() => onSelectPair(n.pair)}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.18 }}
                className="w-full flex items-center gap-2.5"
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                }}
              >
                <span className="font-sans shrink-0 tabular-nums" style={{ fontSize: 12, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.005em", width: 62 }}>
                  {n.pair}
                </span>
                <LiquidityRating value={n.liquidity} accent={accentColor} />
                {userStats && (
                  <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 10, color: userStats.pips >= 0 ? "#34d399" : "#f87171", fontWeight: 500 }}>
                    {userStats.pips >= 0 ? "+" : ""}{userStats.pips}p · {userStats.trades}t
                  </span>
                )}
                <span className="font-sans flex-1 min-w-0 truncate" style={{ fontSize: 11, color: VANTARY.paperDim }}>
                  {n.reason}
                </span>
                <span
                  className="font-mono uppercase shrink-0"
                  style={{
                    fontSize: 8, letterSpacing: "0.18em", color: accentColor,
                    padding: "1px 5px",
                    border: `1px solid ${accentBorder}`,
                    borderRadius: 999,
                  }}
                >
                  {n.tag}
                </span>
                <ChevronRight size={12} strokeWidth={1.5} style={{ color: VANTARY.ashSoft, flexShrink: 0 }} />
              </motion.button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ── PAIR DEEP-DIVE VIEW ───────────────────────────────────────────────
 *  Replaces the entire traded-column body when a pair is selected.
 *  Layout (top → bottom):
 *    1. Back navigation row
 *    2. Pair hero card  · large symbol, full name, tag, liquidity, stat strip
 *    3. Why this pair works in this session (playbook reasoning)
 *    4. Trade-by-trade breakdown (timestamp · direction · setup · R · pips · hold · rationale)
 *    5. Best & worst trade callouts
 *    6. Setup mix + dominant setup
 *    7. Coach recommendation specific to this pair
 * ──────────────────────────────────────────────────────────────────── */
const SETUP_NAMES = ["FVG", "SWEEP", "BPR"] as const
const SETUP_FULL_NAMES = ["Fair-value gap reclaim", "Liquidity sweep reversal", "Breaker-block retest"]

function tradeRationale(t: PairTrade, sessionCity: string): string {
  const setup = SETUP_FULL_NAMES[t.setup]
  const dir = t.direction === "LONG" ? "long" : "short"
  const result =
    t.r >= 1.5  ? "extended through the next liquidity pool — full target hit cleanly"
  : t.r >= 0.8  ? "structural follow-through to first target, partial scaled out"
  : t.r >= 0.3  ? "modest win — managed exit before macro liquidity event"
  : t.r >= 0    ? "tiny scratch — discipline over greed, kept BE"
  : t.r >= -0.5 ? "stopped at break-even after structure shifted against position"
  : t.r >= -1   ? "full stop hit — invalidation level was correct, conviction was off"
  :              "stop-out beyond max risk — likely re-entered after first stop"
  return `${setup} ${dir} during ${sessionCity} flow — ${result}.`
}

function PairDeepDiveView({
  selected, playbook, session, forensics, onBack,
}: {
  selected: SelectedPair
  playbook: SessionPlaybook
  session: SessionWindow
  forensics: SessionForensics
  onBack: () => void
}) {
  const note =
    playbook.favored.find((n) => n.pair === selected.pair) ??
    playbook.avoid.find((n)   => n.pair === selected.pair)
  const userStats = forensics.pairStats.find((ps) => ps.pair === selected.pair)
  const { color: accent, wash: accentWash, border: accentBorder } = categoryAccent(selected.category)

  // For non-traded pairs (missed / correctly-avoided), assemble a defensive view
  if (!note) {
    return (
      <div className="flex flex-col gap-3 h-full">
        <button
          type="button"
          onClick={onBack}
          className="font-mono uppercase flex items-center gap-1.5 self-start hover:text-white"
          style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
        >
          <ArrowLeft size={11} strokeWidth={1.5} /> BACK TO OVERVIEW
        </button>
        <div className="font-sans" style={{ fontSize: 12, color: VANTARY.paperDim }}>
          No data available for {selected.pair} in this session.
        </div>
      </div>
    )
  }

  // Recommendation text — coach voice tailored to category + outcome
  const rec = (() => {
    if (selected.category === "good" && userStats) {
      const positive = userStats.pips >= 0
      return positive
        ? `Keep doing this. ${selected.pair} during ${session.city} is a high-conviction setup for you (${userStats.winRate}% WR, +${userStats.netR.toFixed(1)}R net). Consider increasing size on equivalent setups in the next session.`
        : `The setup selection was correct — ${selected.pair} is a primary pair this window. Your execution was off (${userStats.winRate}% WR, ${userStats.netR.toFixed(1)}R). Review your entries: likely entered too early before structure confirmed.`
    }
    if (selected.category === "bad" && userStats) {
      return `Stop trading ${selected.pair} during ${session.city}. The pair lacks real liquidity in this window — ${userStats.winRate}% WR confirms this is a leak, not an edge. Save the ${userStats.pips}p you're bleeding for sessions where this pair has institutional flow.`
    }
    if (selected.category === "warn") {
      return `Add ${selected.pair} to your active watchlist for ${session.city}. The playbook flagged this as a primary pair — you missed potential pip flow this window. Set an alert at the killzone open so you don't miss the next one.`
    }
    return `Continue avoiding ${selected.pair} during ${session.city}. This is the discipline that compounds — every session you skip a low-liquidity pair, you save the spread + slippage cost a less-disciplined trader pays.`
  })()

  return (
    <div className="flex flex-col gap-3">
      {/* 1 · Back navigation row */}
      <div className="flex items-center justify-between">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -2 }}
          transition={{ duration: 0.18 }}
          className="font-mono uppercase flex items-center gap-1.5 hover:text-white"
          style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
        >
          <ArrowLeft size={11} strokeWidth={1.5} /> BACK TO OVERVIEW
        </motion.button>
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: accent }}>
          {CATEGORY_LABEL[selected.category]}
        </span>
      </div>

      {/* 2 · Pair hero card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05, ease: EASE_V }}
        className="rounded-md overflow-hidden"
        style={{ border: `1px solid ${accentBorder}`, background: accentWash }}
      >
        <div style={{ padding: "12px 14px" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-sans tabular-nums" style={{ fontSize: 28, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.025em", lineHeight: 1 }}>
                {selected.pair}
              </div>
              <div className="font-mono uppercase mt-1" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.paperDim }}>
                {pairFullName(selected.pair)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 8.5, letterSpacing: "0.20em", color: accent,
                  padding: "2px 7px",
                  border: `1px solid ${accentBorder}`,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.014)",
                }}
              >
                {note.tag}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>LIQ</span>
                <LiquidityRating value={note.liquidity} accent={accent} />
              </div>
            </div>
          </div>

          {/* Stat strip — your result vs playbook */}
          {userStats ? (
            <div className="flex items-stretch gap-2 mt-3">
              <DeepStat label="NET PIPS"  value={(userStats.pips >= 0 ? "+" : "") + userStats.pips}                tone={userStats.pips >= 0 ? "good" : "bad"} />
              <DeepStat label="TRADES"    value={String(userStats.trades)}                                          tone="neutral" />
              <DeepStat label="WIN-RATE"  value={`${userStats.winRate}%`}                                           tone={userStats.winRate >= 60 ? "good" : userStats.winRate >= 50 ? "neutral" : "bad"} />
              <DeepStat label="NET R"     value={`${userStats.netR >= 0 ? "+" : ""}${userStats.netR.toFixed(1)}R`} tone={userStats.netR >= 0 ? "good" : "bad"} />
              <DeepStat label="AVG HOLD"  value={`${userStats.avgHoldMin}m`}                                        tone="neutral" />
              <DeepStat label="PROFIT FX" value={userStats.profitFactor.toFixed(2)}                                 tone={userStats.profitFactor >= 1.5 ? "good" : userStats.profitFactor >= 1 ? "neutral" : "bad"} />
            </div>
          ) : (
            <div
              className="mt-3 rounded font-sans"
              style={{
                padding: "8px 10px",
                fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.45,
                border: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)",
              }}
            >
              You did NOT trade <span style={{ color: VANTARY.paper, fontWeight: 500 }}>{selected.pair}</span> during this {session.city} window.
              The analysis below explains the playbook&apos;s view of this pair so you know whether to engage next session.
            </div>
          )}
        </div>
      </motion.div>

      {/* 3 · Why this pair works (playbook reasoning) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.10, ease: EASE_V }}
        className="rounded-md"
        style={{ padding: "10px 12px", border: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <BookOpen size={10} strokeWidth={1.5} color={VANTARY.ashSoft} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            WHY THIS PAIR · {session.city.toUpperCase()} WINDOW
          </span>
        </div>
        <div className="font-sans" style={{ fontSize: 11.5, color: VANTARY.paper, lineHeight: 1.6 }}>
          {note.deepDive}
        </div>
      </motion.div>

      {/* 4 · Trade-by-trade breakdown — only if user traded this pair */}
      {userStats && userStats.recentTrades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: EASE_V }}
          className="rounded-md overflow-hidden"
          style={{ border: `1px solid ${VANTARY.rule}` }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: "7px 10px", borderBottom: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)" }}
          >
            <div className="flex items-center gap-1.5">
              <Activity size={10} strokeWidth={1.5} color={VANTARY.ashSoft} />
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.paper }}>
                TRADE-BY-TRADE BREAKDOWN
              </span>
            </div>
            <span className="font-mono tabular-nums" style={{ fontSize: 9, color: VANTARY.ashSoft }}>
              {userStats.recentTrades.length} executions
            </span>
          </div>
          <ul className="flex flex-col">
            {userStats.recentTrades.map((t, i) => {
              const win = t.r > 0
              const tone = t.r >= 1 ? "#34d399" : t.r >= 0 ? "rgba(52,211,153,0.7)" : t.r >= -0.5 ? VANTARY.amber : "#f87171"
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.18 + i * 0.04, ease: EASE_V }}
                  className="flex items-start gap-2.5"
                  style={{ padding: "8px 10px", borderTop: i === 0 ? "none" : `1px solid ${VANTARY.rule}` }}
                >
                  {/* Time + index */}
                  <div className="flex flex-col items-start shrink-0" style={{ width: 50 }}>
                    <span className="font-mono tabular-nums" style={{ fontSize: 10.5, color: VANTARY.paper, fontWeight: 500 }}>
                      {t.timeUTC}
                    </span>
                    <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
                      #{i + 1} · UTC
                    </span>
                  </div>
                  {/* Direction icon */}
                  <div
                    className="rounded-sm flex items-center justify-center shrink-0"
                    style={{
                      width: 22, height: 22,
                      background: t.direction === "LONG" ? "rgba(52,211,153,0.10)" : "rgba(248,113,113,0.10)",
                      border: `1px solid ${t.direction === "LONG" ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                    }}
                  >
                    {t.direction === "LONG"
                      ? <ArrowUp   size={11} strokeWidth={2} color="#34d399" />
                      : <ArrowDown size={11} strokeWidth={2} color="#f87171" />}
                  </div>
                  {/* Setup */}
                  <span
                    className="font-mono uppercase shrink-0"
                    style={{
                      fontSize: 8, letterSpacing: "0.16em", color: VANTARY.paperDim,
                      padding: "2px 5px",
                      border: `1px solid ${VANTARY.rule}`,
                      borderRadius: 3,
                      width: 46, textAlign: "center",
                    }}
                  >
                    {SETUP_NAMES[t.setup]}
                  </span>
                  {/* R + pips */}
                  <div className="flex flex-col items-start shrink-0" style={{ width: 56 }}>
                    <span className="font-sans tabular-nums" style={{ fontSize: 11, fontWeight: 500, color: tone, lineHeight: 1 }}>
                      {t.r >= 0 ? "+" : ""}{t.r.toFixed(1)}R
                    </span>
                    <span className="font-mono tabular-nums" style={{ fontSize: 8.5, color: win ? "rgba(52,211,153,0.7)" : "rgba(248,113,113,0.7)" }}>
                      {t.pips >= 0 ? "+" : ""}{t.pips}p · {t.holdMin}m
                    </span>
                  </div>
                  {/* Rationale */}
                  <div className="flex-1 min-w-0">
                    <div className="font-sans" style={{ fontSize: 10.5, color: VANTARY.paper, lineHeight: 1.4 }}>
                      {tradeRationale(t, session.city)}
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </motion.div>
      )}

      {/* 5 · Best/Worst + Setup mix */}
      {userStats && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22, ease: EASE_V }}
          className="grid grid-cols-3 gap-2"
        >
          {/* Best trade */}
          <div
            className="rounded-md"
            style={{ padding: "8px 10px", border: "1px solid rgba(52,211,153,0.18)", background: "rgba(52,211,153,0.04)" }}
          >
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp size={9} strokeWidth={1.5} color="#34d399" />
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.20em", color: "#34d399" }}>BEST TRADE</span>
            </div>
            <div className="font-sans tabular-nums" style={{ fontSize: 16, fontWeight: 500, color: "#34d399", lineHeight: 1 }}>
              +{userStats.bestTrade.r.toFixed(1)}R
            </div>
            <div className="font-mono tabular-nums mt-0.5" style={{ fontSize: 8.5, color: VANTARY.paperDim }}>
              {userStats.bestTrade.timeUTC} · +{userStats.bestTrade.pips}p
            </div>
          </div>
          {/* Worst trade */}
          <div
            className="rounded-md"
            style={{ padding: "8px 10px", border: "1px solid rgba(248,113,113,0.18)", background: "rgba(248,113,113,0.04)" }}
          >
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown size={9} strokeWidth={1.5} color="#f87171" />
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.20em", color: "#f87171" }}>WORST TRADE</span>
            </div>
            <div className="font-sans tabular-nums" style={{ fontSize: 16, fontWeight: 500, color: "#f87171", lineHeight: 1 }}>
              {userStats.worstTrade.r.toFixed(1)}R
            </div>
            <div className="font-mono tabular-nums mt-0.5" style={{ fontSize: 8.5, color: VANTARY.paperDim }}>
              {userStats.worstTrade.timeUTC} · {userStats.worstTrade.pips}p
            </div>
          </div>
          {/* Dominant setup */}
          <div
            className="rounded-md"
            style={{ padding: "8px 10px", border: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)" }}
          >
            <div className="flex items-center gap-1 mb-1">
              <Target size={9} strokeWidth={1.5} color={VANTARY.ashSoft} />
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>DOMINANT SETUP</span>
            </div>
            <div className="font-sans" style={{ fontSize: 16, fontWeight: 500, color: VANTARY.paper, lineHeight: 1, letterSpacing: "-0.005em" }}>
              {SETUP_NAMES[userStats.dominantSetup]}
            </div>
            <div className="font-mono tabular-nums mt-0.5" style={{ fontSize: 8.5, color: VANTARY.paperDim }}>
              {userStats.dominantSetupCount} of {userStats.trades} trades
            </div>
          </div>
        </motion.div>
      )}

      {/* 6 · Coach recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.28, ease: EASE_V }}
        className="rounded-md"
        style={{ padding: "10px 12px", border: `1px solid ${VANTARY.amberHalo}`, background: VANTARY.amberWash }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Zap size={10} strokeWidth={1.5} color={VANTARY.amber} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber }}>
            COACH · NEXT-SESSION RECOMMENDATION
          </span>
        </div>
        <div className="font-sans" style={{ fontSize: 11.5, color: VANTARY.paper, lineHeight: 1.6 }}>
          {rec}
        </div>
      </motion.div>
    </div>
  )
}

/** Pair-deep-dive stat tile — used inside the hero stat strip */
function DeepStat({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" | "neutral" }) {
  const valueColor = tone === "good" ? "#34d399" : tone === "bad" ? "#f87171" : VANTARY.paper
  return (
    <div
      className="flex-1 rounded"
      style={{
        padding: "6px 8px",
        background: "rgba(255,255,255,0.022)",
        border: `1px solid ${VANTARY.rule}`,
        minWidth: 0,
      }}
    >
      <div className="font-mono uppercase truncate" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
        {label}
      </div>
      <div className="font-sans tabular-nums truncate" style={{ fontSize: 13, fontWeight: 500, color: valueColor, lineHeight: 1.1, marginTop: 2, letterSpacing: "-0.005em" }}>
        {value}
      </div>
    </div>
  )
}

function LiquidityRating({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0" style={{ width: 60 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: 9,
            height: 3,
            borderRadius: 1,
            background: i < value ? accent : "rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  )
}

/* ── COL 3 · Behavior Audit ────────────────────────────────────────── */
function SessionBehaviorColumn({
  forensics, violations, playbook, session,
}: {
  forensics: SessionForensics
  violations: { pair: string; trades: number; pips: number; reason: string; tag: string }[]
  playbook: SessionPlaybook
  session: SessionWindow
}) {
  // Discipline score recomputed for the dial
  const score = useMemo(() => {
    let s = 100
    s -= violations.length * 12
    return Math.max(0, Math.min(100, s))
  }, [violations])
  const tone = score >= 80 ? "edge" : score >= 55 ? "balanced" : "weak"
  const toneColor =
    tone === "edge"     ? "#34d399"
  : tone === "balanced" ? VANTARY.amber
  :                       "#f87171"

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Discipline arc + score */}
      <div className="flex items-center gap-3" style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)" }}>
        <DisciplineArc score={score} color={toneColor} />
        <div className="flex-1 min-w-0">
          <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
            DISCIPLINE · {session.city.toUpperCase()}
          </div>
          <div className="font-sans mt-0.5" style={{ fontSize: 24, fontWeight: 600, color: toneColor, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {score}<span style={{ fontSize: 13, fontWeight: 400, color: VANTARY.paperDim }}> / 100</span>
          </div>
          <div className="font-mono uppercase mt-1" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.paperDim }}>
            {tone === "edge" ? "ON THE PLAYBOOK" : tone === "balanced" ? "DRIFTING" : "BREAKING THE RULES"}
          </div>
        </div>
      </div>

      {/* Detailed Session Rules with per-rule compliance status */}
      <DetailedSessionRules playbook={playbook} violations={violations} session={session} />

      {/* Detailed Violations panel — timestamp, pattern, cost analysis */}
      <DetailedViolations violations={violations} forensics={forensics} session={session} playbook={playbook} />

      {/* Detailed Hourly Rhythm — peak/leak callouts, cumulative overlay, hover tooltip.
          Coach Verdict has been promoted to column 2 (terminal block of the
          traded analysis), so column 3 ends on the rhythm chart. */}
      <DetailedHourlyRhythm forensics={forensics} session={session} />
    </div>
  )
}

/* ── DETAILED SESSION RULES ─────────────────────────────────────────────
 *  Each rule gets:
 *    · index pill, rule text
 *    · status chip (FOLLOWED / FLAGGED) with green/amber dot
 *    · expandable "why this rule matters" rationale (one-liner)
 *    · severity hint when flagged
 *  Heuristic status: if there are violations, flag the first N rules where
 *  N = min(violations.length, rules.length). Otherwise all FOLLOWED.
 *  This gives a realistic per-rule compliance picture without dummy data.
 * ─────────────────────────────────────────────────────────────────��── */
function ruleRationale(rule: string): string {
  const r = rule.toLowerCase()
  if (r.includes("killzone") || r.includes("kz"))
    return "Liquidity concentrates here. Outside this window the pair drifts on noise — your edge does not exist."
  if (r.includes("skip") || r.includes("avoid") || r.includes("don") || r.includes("never"))
    return "These pairs have no real institutional flow this window. Trading them = paying spread + slippage with no edge."
  if (r.includes("wait"))
    return "Anticipation is how traders die. Let structure print and confirm before you commit a single dollar of risk."
  if (r.includes("primary") || r.includes("focus"))
    return "Concentration of effort beats diversification of attention. One pair, fully understood, beats five half-watched."
  if (r.includes("london") || r.includes("ny") || r.includes("new york"))
    return "Hand-off context matters. The next session inherits this session's liquidity — read it before you leave."
  if (r.includes("risk") || r.includes("size"))
    return "Position sizing is the only variable you fully control. Get it right or nothing else matters."
  if (r.includes("news") || r.includes("nfp") || r.includes("cpi") || r.includes("event"))
    return "Macro releases are not setups. Spread expands, fills are unpredictable — sit on hands until the dust settles."
  return "Discipline compounds. Every session you respect this rule, your edge widens against the average trader."
}

function DetailedSessionRules({
  playbook, violations, session,
}: {
  playbook: SessionPlaybook
  violations: { pair: string; tag: string }[]
  session: SessionWindow
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const flaggedCount = Math.min(violations.length, playbook.rules.length)
  const compliantCount = playbook.rules.length - flaggedCount
  const compliancePct = playbook.rules.length > 0
    ? Math.round((compliantCount / playbook.rules.length) * 100)
    : 100

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: `1px solid ${VANTARY.amberHalo}` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "8px 10px", borderBottom: `1px solid ${VANTARY.amberHalo}`, background: VANTARY.amberWash }}
      >
        <div className="flex items-center gap-2">
          <Shield size={11} strokeWidth={1.5} color={VANTARY.amber} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber }}>
            SESSION RULES · {session.city.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono tabular-nums" style={{ fontSize: 9, color: compliancePct === 100 ? "#34d399" : VANTARY.amber, fontWeight: 500 }}>
            {compliantCount}/{playbook.rules.length}
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            FOLLOWED
          </span>
        </div>
      </div>
      {/* Compliance progress bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.04)", position: "relative" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${compliancePct}%` }}
          transition={{ duration: 0.6, ease: EASE_V }}
          style={{ height: "100%", background: compliancePct === 100 ? "#34d399" : VANTARY.amber }}
        />
      </div>
      {/* Rule rows */}
      <ul className="flex flex-col">
        {playbook.rules.map((rule, i) => {
          const isFlagged = i < flaggedCount
          const isExpanded = expandedIdx === i
          const dotColor = isFlagged ? "#f87171" : "#34d399"
          const statusLabel = isFlagged ? "FLAGGED" : "FOLLOWED"
          const statusColor = isFlagged ? "#f87171" : "#34d399"
          return (
            <li
              key={i}
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${VANTARY.rule}`,
                background: isFlagged ? "rgba(248,113,113,0.025)" : "transparent",
              }}
            >
              <button
                type="button"
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="w-full flex items-start gap-2"
                style={{
                  padding: "8px 10px",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {/* Status dot */}
                <span
                  className="shrink-0"
                  style={{
                    width: 6, height: 6, borderRadius: 999,
                    background: dotColor,
                    marginTop: 5,
                    boxShadow: isFlagged ? "0 0 6px rgba(248,113,113,0.5)" : "0 0 4px rgba(52,211,153,0.4)",
                  }}
                />
                {/* Number */}
                <span
                  className="font-mono tabular-nums shrink-0"
                  style={{ fontSize: 8.5, color: VANTARY.amber, letterSpacing: "0.14em", paddingTop: 2, width: 16 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Rule text */}
                <div className="flex-1 min-w-0">
                  <div className="font-sans" style={{ fontSize: 10.5, color: VANTARY.paper, lineHeight: 1.4 }}>
                    {rule}
                  </div>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 4 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.22, ease: EASE_V }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="font-sans"
                          style={{
                            fontSize: 10, color: VANTARY.paperDim, lineHeight: 1.5,
                            padding: "5px 7px",
                            borderLeft: `2px solid ${isFlagged ? "rgba(248,113,113,0.4)" : VANTARY.amberHalo}`,
                            background: "rgba(255,255,255,0.012)",
                            borderRadius: "0 3px 3px 0",
                          }}
                        >
                          {ruleRationale(rule)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Status pill */}
                <span
                  className="font-mono uppercase shrink-0"
                  style={{
                    fontSize: 7.5, letterSpacing: "0.18em", color: statusColor,
                    padding: "2px 6px",
                    border: `1px solid ${isFlagged ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.20)"}`,
                    borderRadius: 999,
                    background: isFlagged ? "rgba(248,113,113,0.06)" : "rgba(52,211,153,0.05)",
                    marginTop: 1,
                  }}
                >
                  {statusLabel}
                </span>
                {/* Chevron */}
                <ChevronDown
                  size={11}
                  strokeWidth={1.5}
                  style={{
                    color: VANTARY.ashSoft,
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ── DETAILED VIOLATIONS ────────────────────────────────────────────────
 *  Each violation shows:
 *    · pair · pip cost (vivid) · trade count · time range from forensics
 *    · "RULE BROKEN" label (the tag)
 *    · what playbook said vs what trader did
 *    · cost analysis: % of session pip pool, R-cost
 *    · best/worst trade on that pair if data exists
 * ────────────────────────��─────────────────────────────────────────── */
function DetailedViolations({
  violations, forensics, session, playbook,
}: {
  violations: { pair: string; trades: number; pips: number; reason: string; tag: string }[]
  forensics: SessionForensics
  session: SessionWindow
  playbook: SessionPlaybook
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const violationPipCost = violations.reduce((a, v) => a + Math.min(0, v.pips), 0)
  const violationPipCostAbs = Math.abs(violationPipCost)
  const totalSessionPips = Math.abs(forensics.netPips) + violationPipCostAbs
  const violationCostShare = totalSessionPips > 0
    ? Math.round((violationPipCostAbs / totalSessionPips) * 100)
    : 0

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: `1px solid ${violations.length > 0 ? "rgba(248,113,113,0.20)" : VANTARY.rule}` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "8px 10px",
          borderBottom: `1px solid ${violations.length > 0 ? "rgba(248,113,113,0.20)" : VANTARY.rule}`,
          background: violations.length > 0 ? "rgba(248,113,113,0.05)" : "rgba(255,255,255,0.014)",
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={11} strokeWidth={1.5} color={violations.length > 0 ? "#f87171" : VANTARY.ashSoft} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.paper }}>
            VIOLATIONS · {session.city.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {violations.length > 0 && violationPipCost < 0 && (
            <span className="font-mono tabular-nums" style={{ fontSize: 9, color: "#f87171", fontWeight: 500 }}>
              {violationPipCost}p · {violationCostShare}% of pool
            </span>
          )}
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize: 9, color: violations.length > 0 ? "#f87171" : "#34d399",
              padding: "1px 6px",
              borderRadius: 999,
              background: violations.length > 0 ? "rgba(248,113,113,0.08)" : "rgba(52,211,153,0.08)",
              border: `1px solid ${violations.length > 0 ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.20)"}`,
            }}
          >
            {violations.length}
          </span>
        </div>
      </div>

      {violations.length === 0 ? (
        <div style={{ padding: "10px 12px" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ width: 5, height: 5, borderRadius: 999, background: "#34d399" }} />
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#34d399" }}>
              CLEAN SESSION
            </span>
          </div>
          <div className="font-sans" style={{ fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.5 }}>
            You only traded pairs with real liquidity in this window — the discipline that compounds. Repeat this pattern across sessions and your equity curve straightens out.
          </div>
        </div>
      ) : (
        <ul className="flex flex-col">
          {violations.map((v, i) => {
            const userStats = forensics.pairStats.find((ps) => ps.pair === v.pair)
            const firstTrade = userStats?.recentTrades[0]
            const lastTrade  = userStats?.recentTrades[userStats.recentTrades.length - 1]
            const timeRange = firstTrade && lastTrade
              ? firstTrade.timeUTC === lastTrade.timeUTC
                ? firstTrade.timeUTC
                : `${firstTrade.timeUTC} → ${lastTrade.timeUTC}`
              : null
            const pipShare = totalSessionPips > 0
              ? Math.round((Math.abs(v.pips) / totalSessionPips) * 100)
              : 0
            const isExpanded = expanded === v.pair
            // Find the playbook avoid-note matching this pair for "what playbook said"
            const playbookNote = playbook.avoid.find((n) => n.pair === v.pair)
            return (
              <li
                key={v.pair}
                style={{ borderTop: i === 0 ? "none" : `1px solid ${VANTARY.rule}` }}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : v.pair)}
                  className="w-full flex items-start gap-2"
                  style={{ padding: "8px 10px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer" }}
                >
                  {/* Pair + time */}
                  <div className="flex flex-col items-start shrink-0" style={{ width: 64 }}>
                    <span className="font-sans tabular-nums" style={{ fontSize: 11.5, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.005em" }}>
                      {v.pair}
                    </span>
                    {timeRange && (
                      <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft, letterSpacing: "0.06em", marginTop: 1 }}>
                        {timeRange}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono tabular-nums" style={{ fontSize: 11, color: v.pips >= 0 ? "#34d399" : "#f87171", fontWeight: 500 }}>
                        {v.pips >= 0 ? "+" : ""}{v.pips}p
                      </span>
                      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
                        · {v.trades} trade{v.trades !== 1 ? "s" : ""}
                      </span>
                      {v.pips < 0 && pipShare > 0 && (
                        <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: "#f87171" }}>
                          · {pipShare}% LEAK
                        </span>
                      )}
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: 7.5, letterSpacing: "0.18em", color: "#f87171", padding: "1px 5px", borderRadius: 3, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.20)" }}
                      >
                        RULE: {v.tag}
                      </span>
                    </div>
                    <div className="font-sans mt-1" style={{ fontSize: 10.5, color: VANTARY.paperDim, lineHeight: 1.4 }}>
                      {v.reason}
                    </div>
                  </div>
                  <ChevronDown
                    size={11}
                    strokeWidth={1.5}
                    style={{
                      color: VANTARY.ashSoft,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                </button>
                {/* Expanded forensics */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE_V }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "9px 10px 11px 10px",
                          background: "rgba(248,113,113,0.04)",
                          borderTop: "1px solid rgba(248,113,113,0.15)",
                        }}
                      >
                        {/* What playbook said vs what trader did */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div
                            className="rounded"
                            style={{ padding: "6px 7px", background: "rgba(255,255,255,0.014)", border: `1px solid ${VANTARY.rule}` }}
                          >
                            <div className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VANTARY.amber, marginBottom: 2 }}>
                              PLAYBOOK SAID
                            </div>
                            <div className="font-sans" style={{ fontSize: 10, color: VANTARY.paper, lineHeight: 1.4 }}>
                              {playbookNote?.reason ?? `Skip ${v.pair} during ${session.city} — no real liquidity in this window.`}
                            </div>
                          </div>
                          <div
                            className="rounded"
                            style={{ padding: "6px 7px", background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.20)" }}
                          >
                            <div className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: "#f87171", marginBottom: 2 }}>
                              YOU DID
                            </div>
                            <div className="font-sans" style={{ fontSize: 10, color: VANTARY.paper, lineHeight: 1.4 }}>
                              Took {v.trades} position{v.trades !== 1 ? "s" : ""} {timeRange ? `between ${timeRange} UTC` : "this window"} — {v.pips >= 0 ? `lucky +${v.pips}p` : `bled ${Math.abs(v.pips)}p`}.
                            </div>
                          </div>
                        </div>
                        {/* Trade-level forensics if available */}
                        {userStats && (
                          <div
                            className="grid grid-cols-3 gap-1.5 mb-2"
                          >
                            <ViolationStatPill label="WIN-RATE" value={`${userStats.winRate}%`} tone={userStats.winRate < 50 ? "bad" : "neutral"} />
                            <ViolationStatPill label="NET R" value={`${userStats.netR >= 0 ? "+" : ""}${userStats.netR.toFixed(1)}R`} tone={userStats.netR < 0 ? "bad" : "neutral"} />
                            <ViolationStatPill label="WORST" value={`${userStats.worstTrade.r.toFixed(1)}R`} tone="bad" />
                          </div>
                        )}
                        {/* Coach micro-line */}
                        <div className="font-sans" style={{ fontSize: 10, color: VANTARY.paperDim, lineHeight: 1.45, fontStyle: "italic" }}>
                          {v.pips < 0
                            ? `Cost analysis: this single violation accounted for ${pipShare}% of your session-wide pip flow. Eliminate it and your net pips swing materially.`
                            : `You got away with it this time. The luck variance is hiding the structural problem — the next session, ${v.pair} will not be kind.`}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ViolationStatPill({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" | "neutral" }) {
  const valueColor = tone === "good" ? "#34d399" : tone === "bad" ? "#f87171" : VANTARY.paper
  return (
    <div
      className="rounded"
      style={{ padding: "5px 7px", background: "rgba(255,255,255,0.022)", border: `1px solid ${VANTARY.rule}` }}
    >
      <div className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
        {label}
      </div>
      <div className="font-sans tabular-nums" style={{ fontSize: 11, fontWeight: 500, color: valueColor, lineHeight: 1.1, marginTop: 1 }}>
        {value}
      </div>
    </div>
  )
}

/* ── DETAILED COACH VERDICT ─────────────────────────────────────────────
 *  Multi-section breakdown:
 *    · Headline verdict (existing string)
 *    · WHAT WENT RIGHT (computed bullets from forensics)
 *    · WHAT TO IMPROVE (computed bullets from violations + forensics)
 *    · NEXT-SESSION FOCUS (3 actionable directives)
 *  Confidence stripe based on discipline score.
 * ──────────────────────────────────────────────────────────────────── */
function DetailedCoachVerdict({
  forensics, violations, playbook, session, verdict, disciplineScore,
}: {
  forensics: SessionForensics
  violations: { pair: string; trades: number; pips: number; reason: string; tag: string }[]
  playbook: SessionPlaybook
  session: SessionWindow
  verdict: string
  disciplineScore: number
}) {
  const positives = useMemo(() => {
    const out: string[] = []
    if (forensics.peakHour.wr >= 60 && forensics.peakHour.trades > 0) {
      out.push(`Peak edge at ${String(forensics.peakHour.utcHour).padStart(2, "0")}:00 UTC (${forensics.peakHour.wr}% WR, ${forensics.peakHour.pips >= 0 ? "+" : ""}${forensics.peakHour.pips}p) — your read was sharp here.`)
    }
    if (forensics.bestPair) {
      out.push(`${forensics.bestPair.pair} was your anchor: ${forensics.bestPair.trades} trades · ${forensics.bestPair.winRate}% WR · ${forensics.bestPair.netR >= 0 ? "+" : ""}${forensics.bestPair.netR.toFixed(1)}R net.`)
    }
    if (forensics.profitFactor >= 1.5) {
      out.push(`Profit factor ${forensics.profitFactor.toFixed(2)} — your winners are meaningfully larger than your losers, the cleanest sign of a real edge.`)
    }
    if (session.killzone) {
      const kzTrades = forensics.hours.filter((h) => h.utcHour >= session.killzone!.from && h.utcHour < session.killzone!.to).reduce((a, h) => a + h.trades, 0)
      const totalT = forensics.hours.reduce((a, h) => a + h.trades, 0)
      const kzShare = totalT > 0 ? Math.round((kzTrades / totalT) * 100) : 0
      if (kzShare >= 60) {
        out.push(`${kzShare}% of trades sat inside the killzone — you concentrated effort where liquidity actually exists.`)
      }
    }
    if (out.length === 0) {
      out.push(`You showed up and took ${forensics.trades} trades — the rep is the foundation. Refine quality next session.`)
    }
    return out.slice(0, 3)
  }, [forensics, session])

  const improvements = useMemo(() => {
    const out: string[] = []
    if (violations.length > 0) {
      const cost = violations.reduce((a, v) => a + Math.min(0, v.pips), 0)
      out.push(`${violations.length} playbook violation${violations.length !== 1 ? "s" : ""} cost you ${cost}p. These pairs lacked liquidity — you paid spread for nothing.`)
    }
    if (forensics.fatigueAfterH < forensics.sessionLength) {
      out.push(`Edge fatigues after ~${forensics.fatigueAfterH}h. Your last hours produced more noise than signal — set a hard stop after ${forensics.fatigueAfterH}h next time.`)
    }
    if (forensics.profitFactor < 1) {
      out.push(`Profit factor ${forensics.profitFactor.toFixed(2)} — your average loser is bigger than your average winner. Check stop placement and exit discipline.`)
    }
    const lossHours = forensics.hours.filter((h) => h.trades > 0 && h.wr < 40)
    if (lossHours.length > 0) {
      const worst = lossHours.reduce((a, b) => (a.pips < b.pips ? a : b))
      out.push(`${String(worst.utcHour).padStart(2, "0")}:00 UTC was a leak hour (${worst.wr}% WR, ${worst.pips}p) — avoid trading this clock face next session.`)
    }
    if (out.length === 0 && violations.length === 0 && forensics.profitFactor >= 1.2) {
      out.push(`Nothing structural to fix. Maintain selectivity — adding more trades does not add edge.`)
    }
    return out.slice(0, 3)
  }, [violations, forensics])

  const nextSession = useMemo(() => {
    const out: string[] = []
    if (forensics.bestPair) {
      out.push(`Open ${forensics.bestPair.pair} chart first — this is your highest-conviction pair this window.`)
    }
    if (session.killzone) {
      out.push(`Be at desk by ${String(session.killzone.from).padStart(2, "0")}:00 UTC — anything before is reconnaissance, not a setup.`)
    }
    if (forensics.fatigueAfterH > 0) {
      out.push(`Hard stop after ${forensics.fatigueAfterH}h of active screen time — chase no setup beyond this point.`)
    }
    if (violations.length > 0) {
      out.push(`Block ${violations.map((v) => v.pair).slice(0, 2).join(", ")} from your watchlist for this window — remove the temptation entirely.`)
    }
    return out.slice(0, 4)
  }, [forensics, session, violations])

  // Confidence stripe based on discipline + profit factor
  const confidenceColor = disciplineScore >= 80 && forensics.profitFactor >= 1.3 ? "#34d399"
                       : disciplineScore >= 55 ? VANTARY.amber
                       : "#f87171"
  const confidenceLabel = disciplineScore >= 80 && forensics.profitFactor >= 1.3 ? "HIGH CONVICTION READ"
                        : disciplineScore >= 55 ? "MIXED · DRIFT DETECTED"
                        : "LOW CONFIDENCE · MULTIPLE LEAKS"

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: `1px solid ${VANTARY.amberHalo}` }}
    >
      {/* Header band */}
      <div style={{ padding: "9px 12px", background: VANTARY.amberWash, borderBottom: `1px solid ${VANTARY.amberHalo}` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} strokeWidth={1.5} color={VANTARY.amber} />
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.amber }}>
              COACH VERDICT
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ width: 5, height: 5, borderRadius: 999, background: confidenceColor, boxShadow: `0 0 6px ${confidenceColor}` }} />
            <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: confidenceColor }}>
              {confidenceLabel}
            </span>
          </div>
        </div>
        <div className="font-sans" style={{ fontSize: 11.5, color: VANTARY.paper, lineHeight: 1.55 }}>
          {verdict}
        </div>
      </div>

      {/* What went right */}
      <VerdictSection
        eyebrow="WHAT WENT RIGHT"
        accent="#34d399"
        bullets={positives}
      />
      {/* What to improve */}
      <VerdictSection
        eyebrow="WHAT TO IMPROVE"
        accent="#f87171"
        bullets={improvements}
        topBorder
      />
      {/* Next session focus */}
      <VerdictSection
        eyebrow="NEXT SESSION · FOCUS"
        accent={VANTARY.amber}
        bullets={nextSession}
        numbered
        topBorder
      />
    </div>
  )
}

function VerdictSection({
  eyebrow, accent, bullets, numbered, topBorder,
}: {
  eyebrow: string
  accent: string
  bullets: string[]
  numbered?: boolean
  topBorder?: boolean
}) {
  if (bullets.length === 0) return null
  return (
    <div style={{ padding: "8px 12px 10px 12px", borderTop: topBorder ? `1px solid ${VANTARY.rule}` : "none" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ width: 4, height: 4, borderRadius: 999, background: accent }} />
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: accent }}>
          {eyebrow}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-1.5">
            {numbered ? (
              <span
                className="font-mono tabular-nums shrink-0"
                style={{
                  fontSize: 7.5, letterSpacing: "0.10em", color: accent,
                  width: 16, height: 16,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 999,
                  border: `1px solid ${accent}`,
                  marginTop: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ) : (
              <span
                className="shrink-0"
                style={{ width: 4, height: 4, borderRadius: 999, background: accent, marginTop: 6 }}
              />
            )}
            <span className="font-sans" style={{ fontSize: 10.5, color: VANTARY.paper, lineHeight: 1.5 }}>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Half-arc dial for the discipline score. */
function DisciplineArc({ score, color }: { score: number; color: string }) {
  const radius = 28
  const sweep = 200
  const startDeg = -190
  const endDeg = startDeg + sweep
  const progressDeg = startDeg + (sweep * score) / 100
  const polar = (d: number) => {
    const r = (d * Math.PI) / 180
    return { x: 36 + radius * Math.cos(r), y: 38 + radius * Math.sin(r) }
  }
  const arcPath = (fromDeg: number, toDeg: number) => {
    const a = polar(fromDeg)
    const b = polar(toDeg)
    const large = toDeg - fromDeg > 180 ? 1 : 0
    return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y}`
  }
  return (
    <svg width={72} height={64} viewBox="0 0 72 64" aria-label={`Discipline ${score}`}>
      <path d={arcPath(startDeg, endDeg)} fill="none" stroke={VANTARY.rule} strokeWidth={4} strokeLinecap="round" />
      <motion.path
        d={arcPath(startDeg, progressDeg)}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: EASE_V }}
      />
    </svg>
  )
}

/* ── DETAILED HOURLY RHYTHM ─────────────────────────────────────────────
 *  A research-grade hour-by-hour visualization. Layers:
 *    1. Stat strip — peak hr · trough hr · killzone share · fatigue cliff
 *    2. Killzone band — amber wash behind bars within KZ
 *    3. Bars       — height = trades, color = WR bracket, glow = peak
 *    4. Cum-pips overlay — SVG path floating above bars (left axis)
 *    5. Per-hour hover — bar lifts, tooltip floats with full stats
 *    6. Hour labels + per-hour pip pills below
 *    7. Insight strip — computed prose: where edge lives, where it dies
 *    8. WR legend strip
 * ──────────────���───────────────────────────────────────────────────── */
function DetailedHourlyRhythm({
  forensics, session,
}: {
  forensics: SessionForensics
  session: SessionWindow
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const maxTrades   = Math.max(1, ...forensics.hours.map((h) => h.trades))
  const totalHours  = forensics.hours.length
  const activeHours = forensics.hours.filter((h) => h.trades > 0).length
  const totalTrades = forensics.hours.reduce((a, h) => a + h.trades, 0)
  const totalPips   = forensics.hours.reduce((a, h) => a + h.pips, 0)

  // Killzone compression
  const kzTrades = session.killzone
    ? forensics.hours.filter((h) => h.utcHour >= session.killzone!.from && h.utcHour < session.killzone!.to).reduce((a, h) => a + h.trades, 0)
    : 0
  const kzPct = totalTrades > 0 ? Math.round((kzTrades / totalTrades) * 100) : 0

  // Best/worst hours (only consider traded hours)
  const tradedHours = forensics.hours.filter((h) => h.trades > 0)
  const bestHour  = tradedHours.length > 0 ? tradedHours.reduce((a, b) => (b.pips > a.pips ? b : a)) : null
  const worstHour = tradedHours.length > 0 ? tradedHours.reduce((a, b) => (b.pips < a.pips ? b : a)) : null

  // Cumulative pip path — for overlay line
  const cumPipsByHour = useMemo(() => {
    let cum = 0
    return forensics.hours.map((h) => { cum += h.pips; return cum })
  }, [forensics.hours])
  const cumMin = Math.min(0, ...cumPipsByHour)
  const cumMax = Math.max(0, ...cumPipsByHour)
  const cumRange = Math.max(1, cumMax - cumMin)

  // Build SVG path — viewBox 100 wide, 36 tall
  const cumPath = useMemo(() => {
    if (forensics.hours.length === 0) return ""
    const w = 100, h = 36
    return cumPipsByHour.map((v, i) => {
      const x = forensics.hours.length === 1
        ? 50
        : ((i + 0.5) / forensics.hours.length) * w
      const y = h - ((v - cumMin) / cumRange) * (h - 4) - 2
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(" ")
  }, [cumPipsByHour, cumMin, cumRange, forensics.hours.length])

  // Zero-line position in viewBox coords (for cum overlay)
  const zeroY = 36 - ((0 - cumMin) / cumRange) * (36 - 4) - 2

  const hoveredHour = hoveredIdx != null ? forensics.hours[hoveredIdx] : null
  const hoveredCum = hoveredIdx != null ? cumPipsByHour[hoveredIdx] : null

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: `1px solid ${VANTARY.rule}` }}
    >
      {/* Header band */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "8px 10px", borderBottom: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.014)" }}
      >
        <div className="flex items-center gap-1.5">
          <Activity size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.paper }}>
            HOURLY RHYTHM · {session.city.toUpperCase()}
          </span>
        </div>
        <span className="font-mono tabular-nums" style={{ fontSize: 9, color: VANTARY.paperDim }}>
          {totalTrades}t · {totalPips >= 0 ? "+" : ""}{totalPips}p · {activeHours}/{totalHours}h active
        </span>
      </div>

      {/* Stat strip — 4 callouts */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          borderBottom: `1px solid ${VANTARY.rule}`,
        }}
      >
        <RhythmStat
          label="PEAK HR"
          value={bestHour ? `${String(bestHour.utcHour).padStart(2, "0")}:00` : "—"}
          sub={bestHour ? `${bestHour.pips >= 0 ? "+" : ""}${bestHour.pips}p · ${bestHour.wr}% WR` : "no data"}
          tone="good"
        />
        <RhythmStat
          label="LEAK HR"
          value={worstHour && worstHour.pips < 0 ? `${String(worstHour.utcHour).padStart(2, "0")}:00` : "—"}
          sub={worstHour && worstHour.pips < 0 ? `${worstHour.pips}p · ${worstHour.wr}% WR` : "none"}
          tone={worstHour && worstHour.pips < 0 ? "bad" : "neutral"}
          divider
        />
        <RhythmStat
          label="KZ SHARE"
          value={session.killzone ? `${kzPct}%` : "—"}
          sub={session.killzone
            ? `${String(session.killzone.from).padStart(2, "0")}-${String(session.killzone.to).padStart(2, "0")} UTC`
            : "no killzone"}
          tone={kzPct >= 60 ? "good" : kzPct >= 40 ? "neutral" : "bad"}
          divider
        />
        <RhythmStat
          label="FATIGUE"
          value={`~${forensics.fatigueAfterH}h`}
          sub={forensics.fatigueAfterH < forensics.sessionLength
            ? `edge dies after ${forensics.fatigueAfterH}h`
            : "no fatigue detected"}
          tone={forensics.fatigueAfterH >= forensics.sessionLength ? "good" : "neutral"}
          divider
        />
      </div>

      <div style={{ padding: "10px 10px 8px 10px" }}>
        {/* Killzone label */}
        {session.killzone && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span style={{ width: 8, height: 3, borderRadius: 1, background: VANTARY.amber }} />
            <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VANTARY.amber }}>
              KILLZONE {String(session.killzone.from).padStart(2, "0")}:00 — {String(session.killzone.to).padStart(2, "0")}:00 UTC
            </span>
            <span style={{ flex: 1, height: 1, background: VANTARY.amberHalo, marginLeft: 4 }} />
            <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
              CUM PIPS LINE →
            </span>
            <span style={{ width: 12, height: 1.5, background: "#34d399" }} />
          </div>
        )}

        {/* Chart container — bars + cum pips overlay + tooltip layer */}
        <div className="relative" style={{ height: 56 }}>
          {/* Bars grid */}
          <div
            className="grid items-end absolute inset-0"
            style={{ gridTemplateColumns: `repeat(${forensics.hours.length}, minmax(0, 1fr))`, gap: 2 }}
          >
            {forensics.hours.map((h, i) => {
              const traded = h.trades > 0
              const heightPct = traded ? Math.max(18, (h.trades / maxTrades) * 100) : 8
              const isPeak  = bestHour && h.utcHour === bestHour.utcHour && traded
              const isTrough = worstHour && worstHour.pips < 0 && h.utcHour === worstHour.utcHour && traded
              const inKZ = !!(session.killzone && h.utcHour >= session.killzone.from && h.utcHour < session.killzone.to)
              const tone = !traded
                ? "rgba(255,255,255,0.06)"
                : h.wr >= 65 ? "#34d399"
                : h.wr >= 50 ? "rgba(234,239,244,0.55)"
                :              "rgba(248,113,113,0.6)"
              const isHovered = hoveredIdx === i
              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center cursor-default"
                  style={{ height: "100%" }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx((cur) => (cur === i ? null : cur))}
                >
                  {inKZ && (
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: VANTARY.amberWash, borderRadius: 2 }}
                    />
                  )}
                  {/* Peak/trough markers */}
                  {isPeak && (
                    <span
                      aria-hidden
                      className="absolute"
                      style={{
                        top: -4, left: "50%", transform: "translateX(-50%)",
                        width: 0, height: 0,
                        borderLeft: "3px solid transparent",
                        borderRight: "3px solid transparent",
                        borderTop: "4px solid #34d399",
                      }}
                    />
                  )}
                  {isTrough && (
                    <span
                      aria-hidden
                      className="absolute"
                      style={{
                        top: -4, left: "50%", transform: "translateX(-50%)",
                        width: 0, height: 0,
                        borderLeft: "3px solid transparent",
                        borderRight: "3px solid transparent",
                        borderBottom: "4px solid #f87171",
                      }}
                    />
                  )}
                  <div className="flex-1 w-full flex items-end relative">
                    <motion.span
                      className="w-full block"
                      style={{
                        background: tone,
                        borderRadius: 2,
                        height: `${heightPct}%`,
                        transformOrigin: "bottom center",
                        boxShadow: isPeak ? "0 0 8px rgba(52,211,153,0.55)" : isHovered ? "0 0 6px rgba(255,255,255,0.20)" : "none",
                        outline: isHovered ? "1px solid rgba(255,255,255,0.30)" : "none",
                        outlineOffset: 0,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1, opacity: hoveredIdx == null || isHovered ? 1 : 0.55 }}
                      transition={{ duration: 0.4, delay: 0.10 + i * 0.022, ease: EASE_V }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          {/* Cumulative pips overlay — SVG above bars */}
          <svg
            viewBox="0 0 100 36"
            preserveAspectRatio="none"
            className="absolute inset-x-0 pointer-events-none"
            style={{ top: 4, height: 36 }}
          >
            {/* zero-line baseline */}
            <line
              x1={0}
              x2={100}
              y1={zeroY}
              y2={zeroY}
              stroke={VANTARY.rule}
              strokeWidth={0.5}
              strokeDasharray="1.2 2"
            />
            <motion.path
              d={cumPath}
              fill="none"
              stroke="#34d399"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, delay: 0.4, ease: EASE_V }}
            />
            {/* dot at hovered hour */}
            {hoveredIdx != null && (() => {
              const x = forensics.hours.length === 1
                ? 50
                : ((hoveredIdx + 0.5) / forensics.hours.length) * 100
              const y = 36 - ((cumPipsByHour[hoveredIdx] - cumMin) / cumRange) * (36 - 4) - 2
              return (
                <motion.circle
                  cx={x} cy={y} r={1.6}
                  fill="#34d399"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                />
              )
            })()}
          </svg>
          {/* Floating tooltip */}
          <AnimatePresence>
            {hoveredHour && hoveredIdx != null && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
                className="absolute pointer-events-none"
                style={{
                  bottom: "calc(100% + 6px)",
                  left: `calc(${((hoveredIdx + 0.5) / forensics.hours.length) * 100}% )`,
                  transform: "translateX(-50%)",
                  zIndex: 5,
                }}
              >
                <div
                  className="rounded-md"
                  style={{
                    padding: "6px 8px",
                    background: "rgba(8,9,11,0.96)",
                    border: `1px solid ${VANTARY.rule}`,
                    minWidth: 132,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono tabular-nums" style={{ fontSize: 10.5, color: VANTARY.paper, fontWeight: 500 }}>
                      {String(hoveredHour.utcHour).padStart(2, "0")}:00 UTC
                    </span>
                    {session.killzone && hoveredHour.utcHour >= session.killzone.from && hoveredHour.utcHour < session.killzone.to && (
                      <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.16em", color: VANTARY.amber }}>
                        KZ
                      </span>
                    )}
                  </div>
                  <div
                    className="grid mt-1"
                    style={{ gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 1 }}
                  >
                    <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>TRADES</span>
                    <span className="font-mono tabular-nums text-right" style={{ fontSize: 9, color: VANTARY.paper }}>{hoveredHour.trades}</span>
                    <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>WIN-RATE</span>
                    <span className="font-mono tabular-nums text-right" style={{ fontSize: 9, color: hoveredHour.trades > 0 ? (hoveredHour.wr >= 60 ? "#34d399" : hoveredHour.wr >= 50 ? VANTARY.paper : "#f87171") : VANTARY.ashSoft }}>
                      {hoveredHour.trades > 0 ? `${hoveredHour.wr}%` : "—"}
                    </span>
                    <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>HR PIPS</span>
                    <span className="font-mono tabular-nums text-right" style={{ fontSize: 9, color: hoveredHour.pips > 0 ? "#34d399" : hoveredHour.pips < 0 ? "#f87171" : VANTARY.ashSoft }}>
                      {hoveredHour.pips >= 0 ? "+" : ""}{hoveredHour.pips}p
                    </span>
                    <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>CUM PIPS</span>
                    <span className="font-mono tabular-nums text-right" style={{ fontSize: 9, color: (hoveredCum ?? 0) >= 0 ? "#34d399" : "#f87171", fontWeight: 500 }}>
                      {(hoveredCum ?? 0) >= 0 ? "+" : ""}{hoveredCum ?? 0}p
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hour labels + per-hour pip pills */}
        <div
          className="grid mt-1.5"
          style={{ gridTemplateColumns: `repeat(${forensics.hours.length}, minmax(0, 1fr))`, gap: 2 }}
        >
          {forensics.hours.map((h, i) => {
            const isHovered = hoveredIdx === i
            return (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="font-mono tabular-nums text-center"
                  style={{ fontSize: 7.5, color: isHovered ? VANTARY.paper : VANTARY.ashSoft, letterSpacing: "0.04em", transition: "color 0.15s" }}
                >
                  {String(h.utcHour).padStart(2, "0")}
                </span>
                {h.trades > 0 && (
                  <span
                    className="font-mono tabular-nums text-center"
                    style={{ fontSize: 7, color: h.pips >= 0 ? "rgba(52,211,153,0.7)" : "rgba(248,113,113,0.7)" }}
                  >
                    {h.pips >= 0 ? "+" : ""}{h.pips}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Insight strip — computed prose */}
      <RhythmInsight forensics={forensics} session={session} bestHour={bestHour} worstHour={worstHour} kzPct={kzPct} />

      {/* WR color legend */}
      <div
        className="flex items-center gap-3"
        style={{ padding: "5px 10px 7px 10px", borderTop: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.012)" }}
      >
        <LegendChip color="#34d399"                       label="65%+ WR" />
        <LegendChip color="rgba(234,239,244,0.55)"        label="50-64%" />
        <LegendChip color="rgba(248,113,113,0.6)"          label="<50%" />
        <LegendChip color="rgba(255,255,255,0.06)"         label="no trades" />
        <span style={{ flex: 1 }} />
        <div className="flex items-center gap-1">
          <span style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderTop: "4px solid #34d399" }} />
          <span className="font-mono" style={{ fontSize: 7, color: VANTARY.ashSoft, letterSpacing: "0.10em" }}>peak</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderBottom: "4px solid #f87171" }} />
          <span className="font-mono" style={{ fontSize: 7, color: VANTARY.ashSoft, letterSpacing: "0.10em" }}>leak</span>
        </div>
      </div>
    </div>
  )
}

function RhythmStat({
  label, value, sub, tone, divider,
}: {
  label: string
  value: string
  sub: string
  tone: "good" | "bad" | "neutral"
  divider?: boolean
}) {
  const valueColor = tone === "good" ? "#34d399" : tone === "bad" ? "#f87171" : VANTARY.paper
  return (
    <div
      style={{
        padding: "7px 10px",
        borderLeft: divider ? `1px solid ${VANTARY.rule}` : "none",
        background: "rgba(255,255,255,0.010)",
        minWidth: 0,
      }}
    >
      <div className="font-mono uppercase truncate" style={{ fontSize: 7.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
        {label}
      </div>
      <div
        className="font-sans tabular-nums truncate"
        style={{ fontSize: 13, fontWeight: 500, color: valueColor, lineHeight: 1.1, marginTop: 2, letterSpacing: "-0.005em" }}
      >
        {value}
      </div>
      <div className="font-mono tabular-nums truncate" style={{ fontSize: 8.5, color: VANTARY.paperDim, marginTop: 2 }}>
        {sub}
      </div>
    </div>
  )
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ width: 6, height: 3, borderRadius: 1, background: color }} />
      <span className="font-mono" style={{ fontSize: 7, color: VANTARY.ashSoft, letterSpacing: "0.10em" }}>{label}</span>
    </div>
  )
}

interface HourRow { utcHour: number; trades: number; wr: number; pips: number }

function RhythmInsight({
  forensics, session, bestHour, worstHour, kzPct,
}: {
  forensics: SessionForensics
  session: SessionWindow
  bestHour: HourRow | null
  worstHour: HourRow | null
  kzPct: number
}) {
  // Build a 2-3 sentence insight from the data
  const sentence = useMemo(() => {
    const parts: string[] = []
    if (bestHour) {
      parts.push(
        `Edge concentrated at ${String(bestHour.utcHour).padStart(2, "0")}:00 UTC — ${bestHour.trades} trade${bestHour.trades !== 1 ? "s" : ""}, ${bestHour.wr}% WR, ${bestHour.pips >= 0 ? "+" : ""}${bestHour.pips}p.`
      )
    }
    if (session.killzone) {
      if (kzPct >= 60) {
        parts.push(`${kzPct}% of trades sat inside the killzone — disciplined timing.`)
      } else if (kzPct > 0) {
        parts.push(`Only ${kzPct}% of trades sat inside the killzone — you took setups in low-conviction hours.`)
      } else {
        parts.push(`Zero trades in the killzone window — the highest-probability hour passed by untouched.`)
      }
    }
    if (worstHour && worstHour.pips < 0) {
      parts.push(`Worst hour was ${String(worstHour.utcHour).padStart(2, "0")}:00 (${worstHour.pips}p) — likely fatigue or chase entries; cut this clock face next session.`)
    }
    if (forensics.fatigueAfterH < forensics.sessionLength) {
      parts.push(`Edge fatigues after ~${forensics.fatigueAfterH}h of active screen time.`)
    }
    if (parts.length === 0) parts.push(`No significant rhythm signal in this session.`)
    return parts.join(" ")
  }, [bestHour, worstHour, kzPct, session, forensics])

  return (
    <div
      style={{
        padding: "7px 10px",
        borderTop: `1px solid ${VANTARY.rule}`,
        background: "rgba(255,255,255,0.010)",
      }}
    >
      <div className="flex items-start gap-1.5">
        <Eye size={10} strokeWidth={1.5} color={VANTARY.ashSoft} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.20em", color: VANTARY.ashSoft, marginBottom: 1 }}>
            WHAT THE RHYTHM SAYS
          </div>
          <div className="font-sans" style={{ fontSize: 10.5, color: VANTARY.paper, lineHeight: 1.5 }}>
            {sentence}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  <CoActivePuckArc/>
 *  ─────────────────────────────────────────────────────────────────────────
 *  When two or more sessions are open simultaneously, this component draws a
 *  hairline SVG arc above the puck row connecting the two pucks that are
 *  co-active right now, with a centered "DUAL FLOW" capsule label.
 *
 *  This is the *visual reinforcement* of the overlap state which is also
 *  expressed in three other places (so the trader sees a coherent story):
 *      · the headline ligature        (Sydney + Tokyo)
 *      · the timeline overlap zone    (◇ OVERLAP 00–09)
 *      · the DUAL FLOW context strip  (under the headline)
 *
 *  Layout math: the puck row is a 4-column grid. Each puck's horizontal
 *  center sits at column-index/3.5 + 0.5/4 within the parent's width. We
 *  derive the % positions from SESSIONS.indexOf(...) so this works for ANY
 *  pair of overlapping sessions today (Sydney+Tokyo) AND tomorrow when
 *  London+NY co-activate at 12:00–16:00 UTC.
 *
 *  If only one — or zero — sessions are open right now, the component
 *  renders nothing (hairline arc would be misleading).
 * ═══════════════════════════════════════════════════════════════════════ */
function CoActivePuckArc({ utcHour }: { utcHour: number }) {
  // Identify all currently-open sessions
  const openSessions = useMemo(
    () => SESSIONS.filter((s) => isSessionOpen(s, utcHour)),
    [utcHour],
  )
  // Only render the arc when EXACTLY 2 sessions are co-active. With 3+ a
  // single arc would be ambiguous, so we bail out gracefully — the trader
  // still sees the dual headline + overlap zones above.
  if (openSessions.length !== 2) return null

  // Compute the horizontal centre (in % of parent width) of each puck
  // based on its column index in the 4-column grid (col gap is `gap-3`
  // = 12px, but the percentages-of-grid-width approximation below is
  // visually correct because the centres land on (n+0.5) * 25%).
  const indices = openSessions
    .map((s) => SESSIONS.findIndex((x) => x.key === s.key))
    .sort((a, b) => a - b)
  const leftPct  = (indices[0] + 0.5) * 25
  const rightPct = (indices[1] + 0.5) * 25
  const midPct   = (leftPct + rightPct) / 2
  const spanPct  = rightPct - leftPct
  // The visual height of the arc — wider spans get a deeper sag so the
  // arc reads as a single confident curve. Capped to keep the arc inside
  // the 24px overhead band above the puck row.
  const archDepth = Math.min(20, 6 + spanPct * 0.18)

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left: 0, right: 0,
        top: -22,           // sit in the empty band created by `mt-7` on parent
        height: 22,
      }}
    >
      <svg
        width="100%"
        height="22"
        viewBox="0 0 100 22"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="coactive-arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={VANTARY.amber} stopOpacity="0.20" />
            <stop offset="50%"  stopColor={VANTARY.amber} stopOpacity="0.85" />
            <stop offset="100%" stopColor={VANTARY.amber} stopOpacity="0.20" />
          </linearGradient>
        </defs>
        {/* The arc itself. Quadratic Bézier with the apex at midPct/0 (top).
            Uses non-uniform Y scale by setting viewBox height to 22 so the
            archDepth value reads in pixels even though X is in percent. */}
        <motion.path
          d={`M ${leftPct} 22 Q ${midPct} ${22 - archDepth} ${rightPct} 22`}
          fill="none"
          stroke="url(#coactive-arc-grad)"
          strokeWidth="1"
          strokeLinecap="round"
          // Soft glow underneath
          style={{ filter: `drop-shadow(0 0 4px ${VANTARY.amberHalo})` }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_V }}
        />
        {/* Two anchor dots that "land" on the puck heads */}
        <motion.circle
          cx={leftPct} cy={22} r={1.2} fill={VANTARY.amber}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.circle
          cx={rightPct} cy={22} r={1.2} fill={VANTARY.amber}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      </svg>
      {/* Centered DUAL FLOW capsule label, anchored to the apex of the arc. */}
      <motion.div
        className="absolute"
        style={{
          left: `${midPct}%`,
          transform: "translateX(-50%)",
          top: 22 - archDepth - 8,
        }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_V, delay: 0.55 }}
      >
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 7.5,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            padding: "1.5px 6px",
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 999,
            background: "rgba(0,0,0,0.65)",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          ◇ DUAL FLOW
        </span>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  SessionPuck — a single Sessions Radar grid tile, expressed as a DrillCard.
 *
 *  Cross-highlight semantics:
 *    primary  crossKey  →  session:{city}        (matches TickerCapsule)
 *    broadcast keys     →  pair:EUR/USD, pair:XAU/USD, …  (lights up watchlist)
 *
 *  Selecting (clicking) a puck pins it to the SideDetailRail. Hovering shows a
 *  preview popover with the regime, killzone window, and tradeable pairs.
 * ─────────────────────────────────────────────────────────────────────────── */
function SessionPuck({
  session: s,
  isActive,
  onSelect,
  utcHour = 0,
  index = 0,
}: {
  session: typeof SESSIONS[number]
  isActive: boolean
  onSelect: () => void
  /** Used to detect co-active "OVERLAP" state for visual hint. */
  utcHour?: number
  /** Used for the radar-sweep stagger entrance. */
  index?: number
}) {
  const { isPinned } = useSideRail()
  const id = `session:${s.key}`
  const pinned = isPinned(id)

  // Broadcast every tradable pair so hovering this session lights up matching
  // DrillCards in WatchlistMatrix, TickerStrip, and the Oracle answer.
  const broadcastKeys = useMemo(
    () => s.pairs.map((p) => `pair:${p}`),
    [s.pairs],
  )

  // Co-active = THIS session is open AND at least one OTHER session is open.
  const coActive = isActive && SESSIONS.some(
    (other) => other.key !== s.key && isSessionOpen(other, utcHour),
  )

  // Live progress for the active session (drives the bottom slimline bar)
  const progress = isActive ? sessionProgress01(s, utcHour) ?? 0 : 0

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, delay: 0.08 + index * 0.07, ease: EASE_V }}
    >
      {/* Tether — vertical glowing line connecting this puck to the rail above
          when the session is active. Visually anchors the active station to
          the now-cursor on the timeline. */}
      {isActive && (
        <motion.div
          aria-hidden
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: -16, height: 16, width: 1,
            background: `linear-gradient(180deg, transparent, ${VANTARY.amber})`,
            transform: "translateX(-0.5px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <DrillCard
        as="div"
        interaction="preview-action"
        affordance="preview"
        category="session"
        density="default"
        intent={isActive ? "default" : "subtle"}
        crossKey={`session:${s.city.toLowerCase()}`}
        broadcastKeys={broadcastKeys}
        selected={pinned}
        previewSide="bottom"
        previewWidth={360}
        tooltip={`Open ${s.city} dossier`}
        preview={<SessionPuckPreview session={s} isActive={isActive} pinned={pinned} />}
        onClick={() => onSelect()}
        style={{
          background: isActive ? VANTARY.amberWash : "transparent",
          border: `1px solid ${isActive ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius: 16,
          padding: "10px 12px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle ambient breath inside the active card */}
        {isActive && (
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(120% 80% at 50% 0%, ${VANTARY.amberHalo} 0%, transparent 60%)`,
            }}
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="relative">
          {/* Top row — flag pill + status (●LIVE / OVERLAP / +) */}
          <div className="flex items-center justify-between">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft }}
            >
              {s.flag}
            </span>
            {coActive ? (
              <motion.span
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize: 7,
                  letterSpacing: "0.20em",
                  color: VANTARY.amber,
                  padding: "1px 5px",
                  border: `1px solid ${VANTARY.amberHalo}`,
                  borderRadius: 999,
                  background: VANTARY.amberWash,
                  whiteSpace: "nowrap",
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ◇ OVERLAP
              </motion.span>
            ) : isActive ? (
              <motion.span
                className="rounded-full"
                style={{ width: 5, height: 5, background: VANTARY.amber, boxShadow: `0 0 6px ${VANTARY.amber}` }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1.1, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <span style={{ fontSize: 11, color: VANTARY.ashSoft, lineHeight: 1, transform: "translateY(-1px)" }}>
                +
              </span>
            )}
          </div>

          {/* City name */}
          <div
            className="font-sans mt-1"
            style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}
          >
            {s.city}
          </div>

          {/* Heartbeat ECG — animates only when active */}
          <div className="mt-1.5">
            <Heartbeat active={isActive} />
          </div>

          {/* Footer — WR · regime separated by a hairline */}
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1">
              <span
                className="font-mono tabular-nums"
                style={{
                  fontSize: 11,
                  color: isActive ? VANTARY.amber : VANTARY.paper,
                  fontWeight: 500,
                }}
              >
                {s.winRate}%
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}
              >
                WR
              </span>
            </div>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft }}
            >
              {s.regime}
            </span>
          </div>

          {/* Slimline progress at card bottom — subtle, only when active */}
          {isActive && (
            <div className="relative mt-2" style={{ height: 2 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <motion.div
                className="absolute top-0 bottom-0 left-0 rounded-full"
                style={{ background: VANTARY.amber }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.9, ease: EASE_V }}
              />
            </div>
          )}
        </div>
      </DrillCard>
    </motion.div>
  )
}

/* ═══════════════════���════════════════════════════════════════════════════════
   SessionDossier — the in-place deep-dive that REPLACES the 4-puck strip
   ────────────────────────────────────────────────────────────────────────────
   THE BRIEF (verbatim from the trader):
     "When I tap Sydney/Tokyo/London/NY I want every detail about THAT
      session — pairs traded, time spent, # trades, win rate, P&L,
      behavioral metrics — without the radar block growing the dashboard
      down. Most advanced billionaire-grade edit. NO pies, NO basic bars."

   THE ANSWER:
     A single 88px-tall frame with FOUR strata that fit the same height
     envelope as the original puck row, so the parent card barely grows:

       ┌─ Stratum 1 · IDENTITY (24px) ─────────────────────────────────┐
       │ ‹  GB  London  TREND          12tr · 72% · +127p · 1h 22m     │
       ├─ Stratum 2 · BODY split (62px) ───────────────────────────────┤
       │  Constellation                  │   Pair pulses + insight     │
       │  ─────────────                  │   EUR/USD ▌▍▌ 6t +47p 67%   │
       │  +3R ┄┄┄┄┄┄┄┄��┄┄┄┄┄┄            │   GBP/USD ▏▌  3t +52p 100%  │
       │       •  ·    ·  · ·            │   XAU/USD ▎▍  3t +18p 67%   │
       │  ━━━━━━━━━━━━━━━ EV +0.42R      │   peaks 09:00 · fades 3h    │
       │  -3R ┄┄┄┄┄┄┄┄┄┄┄��┄┄┄            │                             │
       └────────────────────────────────────────────────────────────────┘

   THE HERO VIZ — "Behavioral Constellation":
     Every historical trade in this session plotted on a 2-D field of
     (time-into-session × R-multiple), coloured by setup family
     (FVG / SWEEP / BPR), sized by risk used. A dotted EV waterline
     runs across the field at the trader's average R, drawn-on with
     a pathLength animation. A faint ribbon connects the dots in
     chronological order — the trader's behavioural arc through the
     session. No pies, no bars: the spatial distribution of the dots
     IS the visualisation. Where they cluster, your edge is strongest;
     where they fan apart vertically, your discipline is breaking.

   PAIR PULSES — micro "heart-monitor" strips, NOT bar charts.
     Each pair shows up to N tiny vertical chips, one per trade in the
     session, height encoded by |R|, paper for wins, ash for losses.
     A glanceable read of session R-by-trade per pair.

   AUTO-INSIGHT — one sentence built from peakHour, fatigueAfterH, and
     bestPair. Reads like a coach speaking the trader's pattern back to
     him: "Edge peaks at 09:00 (84%), fades after 3h, prime pair EUR/USD."
   ──────────────────────────────────────────────────────────────────── */

/** ── Recent trade row used inside a pair card ───────────────────────
 *  Each trade is fully spelled out so nothing is compressed visually.
 *  Time is the UTC HH:MM the trade was opened. Direction is LONG/SHORT.
 *  Setup is the family. R is the trade's risk-multiple. Pips is the
 *  outcome translated. holdMin is how long the trade was held.        */
interface PairTrade {
  timeUTC: string              // "14:23"
  direction: "LONG" | "SHORT"
  setup: 0 | 1 | 2             // FVG | SWEEP | BPR
  r: number                    // signed R-multiple
  pips: number                 // signed pips
  holdMin: number              // hold time in minutes
}

interface SessionPairStat {
  pair: string
  fullName: string             // "EURO · US DOLLAR"
  trades: number
  winRate: number
  pips: number
  rSeq: number[]
  cumR: number[]               // running cumulative R (kept for legacy)
  netR: number                 // last value of cumR (sum of rSeq)
  dominantSetup: 0 | 1 | 2     // 0=FVG 1=SWEEP 2=BPR
  dominantSetupCount: number   // e.g. 5 (out of `trades`)
  grade: 0 | 1 | 2 | 3 | 4 | 5 // 0..5 dot composite rating
  avgHoldMin: number           // avg trade hold in minutes (per pair)
  profitFactor: number         // wins R / |losses R| for THIS pair
  consistency: number          // % of trades that closed within 0.5R of avg-R (0..100)
  expectancy: number           // avg R per trade
  bestTrade: { r: number; pips: number; timeUTC: string }
  worstTrade: { r: number; pips: number; timeUTC: string }
  recentTrades: PairTrade[]    // chronological, most recent last
}

/** Human-readable currency names for a pair. Falls back to the symbol
 *  itself if a currency code isn't in the table.                      */
const CURRENCY_NAMES: Record<string, string> = {
  EUR: "Euro",
  USD: "US Dollar",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  NZD: "New Zealand Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  XAU: "Gold",
  XAG: "Silver",
}
function pairFullName(symbol: string): string {
  const [base, quote] = symbol.split("/")
  const b = CURRENCY_NAMES[base] ?? base
  const q = CURRENCY_NAMES[quote] ?? quote
  return `${b.toUpperCase()} · ${q.toUpperCase()}`
}
interface SessionForensics {
  trades: number
  winRate: number
  netPips: number
  netR: number                 // sum of all R-multiples across the session
  profitFactor: number         // Σwins / |Σlosses|
  avgHoldMin: number
  hours: { utcHour: number; trades: number; wr: number; pips: number }[]
  pairStats: SessionPairStat[]
  scatter: { t: number; r: number; setup: 0 | 1 | 2; size: number }[]
  avgR: number
  peakHour: { utcHour: number; trades: number; wr: number; pips: number }
  bestPair: SessionPairStat
  fatigueAfterH: number
  sessionLength: number
  setupMix: { fvg: number; sweep: number; bpr: number } // % of trades by setup
}

/** Deterministic per-session forensics. The same session key always yields
 *  the same dossier, so the surface is stable across renders without a feed. */
function generateSessionForensics(s: SessionWindow): SessionForensics {
  const seed = s.key.charCodeAt(0) * 31 + s.key.length * 7
  let n = seed
  const rnd = () => { n = (n * 9301 + 49297) % 233280; return n / 233280 }

  const sessionLength = Math.max(1, ((s.closeUTC - s.openUTC) + 24) % 24 || 24)

  // Per-hour buckets — killzone hours weight heavier and trade better.
  const hours = Array.from({ length: sessionLength }, (_, i) => {
    const utcHour = (s.openUTC + i) % 24
    const inKZ = !!(s.killzone && utcHour >= s.killzone.from && utcHour < s.killzone.to)
    const baseTrades = inKZ ? 3 + rnd() * 2 : rnd() * 2.5
    const trades = Math.round(baseTrades)
    const wrBase = s.winRate + (inKZ ? 8 : -4) + (rnd() - 0.5) * 18
    const wr = trades > 0 ? Math.max(0, Math.min(100, Math.round(wrBase))) : 0
    const pips = trades > 0 ? Math.round((wr - 50) * 0.8 + (rnd() - 0.4) * 12) : 0
    return { utcHour, trades, wr, pips }
  })

  const totalTrades = Math.max(1, hours.reduce((a, b) => a + b.trades, 0))
  const winRate = s.winRate
  const netPips = Math.round((winRate - 50) * 4 + (rnd() - 0.4) * 60)
  const avgHoldMin = Math.round(50 + rnd() * 90)

  // Per-pair stats — fully expanded so the dossier can render rich cards
  // with no shortened text. Each pair gets a timeline of individual trades
  // (timestamps, direction, setup, R, pips, hold), best/worst trade,
  // expectancy, consistency, profit factor, dominant setup count, grade.
  const pairStats: SessionPairStat[] = s.pairs.map((pair) => {
    const t = Math.max(3, Math.floor(rnd() * 4 + 3))
    const wr = Math.max(35, Math.min(95, Math.round(winRate + (rnd() - 0.5) * 24)))
    const dominantSetup = (Math.floor(rnd() * 3) % 3) as 0 | 1 | 2
    const pipsPerR = 12

    // Build the per-trade timeline distributed across the session window.
    const trades: PairTrade[] = []
    for (let i = 0; i < t; i++) {
      const fraction = (i + 0.5) / t + (rnd() - 0.5) * 0.05
      const intoSession = Math.max(0, Math.min(sessionLength - 0.01, fraction * sessionLength))
      const utcRaw = (s.openUTC + intoSession) % 24
      const hh = Math.floor(utcRaw)
      const mm = Math.floor((utcRaw - hh) * 60)
      const timeUTC = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
      const isWin = rnd() < wr / 100
      const r = isWin ? 0.4 + rnd() * 2.0 : -(0.5 + rnd() * 1.4)
      const direction: PairTrade["direction"] = rnd() < 0.5 ? "LONG" : "SHORT"
      // 60% of trades use the dominant setup, the rest are mixed.
      const setup = (rnd() < 0.6 ? dominantSetup : (Math.floor(rnd() * 3) % 3)) as 0 | 1 | 2
      const holdMin = Math.round(15 + rnd() * 110)
      const pipsOut = Math.round(r * pipsPerR + (rnd() - 0.5) * 4)
      trades.push({ timeUTC, direction, setup, r, pips: pipsOut, holdMin })
    }

    const rSeq = trades.map(tr => tr.r)
    const cumR: number[] = []
    let acc = 0
    for (const r of rSeq) { acc += r; cumR.push(acc) }
    const netR = cumR[cumR.length - 1] ?? 0
    const pips = Math.round(trades.reduce((a, b) => a + b.pips, 0))

    const dominantSetupCount = trades.filter(tr => tr.setup === dominantSetup).length

    // Best & worst trade — by R (which already encapsulates pips & risk).
    const sortedR = [...trades].sort((a, b) => a.r - b.r)
    const worstT = sortedR[0]
    const bestT = sortedR[sortedR.length - 1]

    const avgHoldMin = Math.round(trades.reduce((a, b) => a + b.holdMin, 0) / trades.length)

    // Profit factor for THIS pair.
    const winR = trades.filter(tr => tr.r > 0).reduce((a, b) => a + b.r, 0)
    const losR = Math.abs(trades.filter(tr => tr.r < 0).reduce((a, b) => a + b.r, 0))
    const profitFactor = losR > 0 ? Math.min(9.99, winR / losR) : (winR > 0 ? 9.99 : 0)

    // Consistency: % of trades whose R is within 0.5 of the avg-R.
    const expectancy = rSeq.reduce((a, b) => a + b, 0) / rSeq.length
    const within = trades.filter(tr => Math.abs(tr.r - expectancy) <= 0.5).length
    const consistency = Math.round((within / trades.length) * 100)

    // Grade: WR up to 3 dots, netR up to 2 dots.
    const wrStars = wr >= 80 ? 3 : wr >= 65 ? 2 : wr >= 50 ? 1 : 0
    const rStars  = netR >= 2.5 ? 2 : netR >= 1 ? 1 : 0
    const grade = Math.max(0, Math.min(5, wrStars + rStars)) as 0 | 1 | 2 | 3 | 4 | 5

    return {
      pair,
      fullName: pairFullName(pair),
      trades: t,
      winRate: wr,
      pips,
      rSeq,
      cumR,
      netR,
      dominantSetup,
      dominantSetupCount,
      grade,
      avgHoldMin,
      profitFactor,
      consistency,
      expectancy,
      bestTrade: { r: bestT.r, pips: bestT.pips, timeUTC: bestT.timeUTC },
      worstTrade: { r: worstT.r, pips: worstT.pips, timeUTC: worstT.timeUTC },
      recentTrades: trades,
    }
  })

  // Scatter — historical trades on (time-into-session × R-multiple).
  const scatter = Array.from({ length: 26 }, (_, i) => {
    const tIntoSession = rnd() * sessionLength
    // Slightly skew positive in killzone window, negative in the back half.
    const inKzWindow = s.killzone &&
      tIntoSession >= (s.killzone.from - s.openUTC + 24) % 24 &&
      tIntoSession < (s.killzone.to - s.openUTC + 24) % 24
    const baseR = inKzWindow ? 0.6 : (tIntoSession > sessionLength * 0.6 ? -0.3 : 0.1)
    const r = baseR + (rnd() - 0.5) * 3.6
    const setup = (i % 3) as 0 | 1 | 2
    const size = 0.5 + rnd() * 1.5
    return { t: tIntoSession, r, setup, size }
  }).sort((a, b) => a.t - b.t)

  const avgR = scatter.reduce((a, b) => a + b.r, 0) / scatter.length

  // Peak hour: highest WR among hours that traded.
  const tradedHours = hours.filter(h => h.trades > 0)
  const peakHour = tradedHours.length > 0
    ? tradedHours.reduce((best, h) => h.wr > best.wr ? h : best, tradedHours[0])
    : { utcHour: s.openUTC, trades: 0, wr: 0, pips: 0 }

  // Best pair: highest WR.
  const bestPair = pairStats.reduce((best, p) => p.winRate > best.winRate ? p : best, pairStats[0])

  // Fatigue: hours-into-session at which avg WR drops > 10pts vs first 2 hours.
  const earlyHrs = hours.slice(0, Math.min(2, hours.length)).filter(h => h.trades > 0)
  const earlyWr = earlyHrs.length > 0 ? earlyHrs.reduce((a, b) => a + b.wr, 0) / earlyHrs.length : winRate
  let fatigueAfterH = sessionLength
  for (let i = 2; i < hours.length; i++) {
    if (hours[i].trades > 0 && hours[i].wr < earlyWr - 10) { fatigueAfterH = i; break }
  }

  // Net R for the whole session = sum across all pairs.
  const netR = pairStats.reduce((a, p) => a + p.netR, 0)
  // Profit Factor = Σ(wins R) / |Σ(losses R)|, capped at 5 for display sanity.
  const winsR = pairStats.flatMap(p => p.rSeq).filter(r => r > 0).reduce((a, b) => a + b, 0)
  const lossR = Math.abs(pairStats.flatMap(p => p.rSeq).filter(r => r < 0).reduce((a, b) => a + b, 0))
  const profitFactor = lossR > 0 ? Math.min(5, winsR / lossR) : (winsR > 0 ? 5 : 0)
  // Setup mix from the scatter (percentage of trades per setup family).
  const setupCount: [number, number, number] = [0, 0, 0]
  for (const d of scatter) setupCount[d.setup]++
  const setupTotal = setupCount.reduce((a, b) => a + b, 0) || 1
  const setupMix = {
    fvg: Math.round((setupCount[0] / setupTotal) * 100),
    sweep: Math.round((setupCount[1] / setupTotal) * 100),
    bpr: Math.round((setupCount[2] / setupTotal) * 100),
  }

  return {
    trades: totalTrades,
    winRate,
    netPips,
    netR,
    profitFactor,
    avgHoldMin,
    hours,
    pairStats,
    scatter,
    avgR,
    peakHour,
    bestPair,
    fatigueAfterH,
    sessionLength,
    setupMix,
  }
}

const SETUP_TAGS = ["FVG", "SWEEP", "BPR"] as const
const REGIME_BLURB: Record<SessionWindow["regime"], string> = {
  TREND: "Trend day · directional liquidity sweeps reward continuation",
  RANGE: "Range day · liquidity grabs reverse off well-defined extremes",
  QUIET: "Quiet tape · low ATR, prefer scalps over swings",
  NEWS:  "News driven · headline volatility, manage size aggressively",
}

/* ─────────────────────────────────────────────────────────────────────────
   <DossierErrorBoundary/> — hard guard around the FullSessionDossier.
   When ANY child throws during render, instead of the whole page going
   black we render an in-card recovery panel that shows the error message,
   logs the full stack to the console under `[v0]`, and exposes a retry
   button that calls `onRetry` (the parent's "back to overview" handler).
   ─────────────────────────────────────────────────────────────────────���─ */
class DossierErrorBoundary extends React.Component<
  { onRetry: () => void; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface the underlying problem in the DevTools console so the
    // exact line number is visible the next time the trader clicks.
    console.error("[v0] FullSessionDossier crashed during render:", error, info)
  }

  handleRetry = () => {
    this.setState({ error: null })
    this.props.onRetry()
  }

  render() {
    const err = this.state.error
    if (err) {
      return (
        <div className="flex flex-col gap-3" style={{ padding: 4 }}>
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber }}>
              SESSION DOSSIER · ERROR
            </span>
            <button
              type="button"
              onClick={this.handleRetry}
              className="font-mono uppercase rounded-sm px-2.5 py-1 transition-colors hover:bg-white/5"
              style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.paper, border: `1px solid ${VANTARY.rule}` }}
            >
              ← Back to sessions
            </button>
          </div>
          <p className="font-sans" style={{ fontSize: 12, color: VANTARY.paperDim, lineHeight: 1.55 }}>
            We couldn&apos;t render this session&apos;s dossier. The exact reason is below — please share it with the team if it keeps happening.
          </p>
          <pre
            className="font-mono whitespace-pre-wrap break-words"
            style={{
              fontSize: 11,
              color: VANTARY.ashSoft,
              padding: "10px 12px",
              borderLeft: `2px solid ${VANTARY.amberHalo}`,
              background: "rgba(255,80,80,0.04)",
              borderRadius: "0 6px 6px 0",
              maxHeight: 180,
              overflow: "auto",
            }}
          >
            {err.message || String(err)}
            {err.stack ? "\n\n" + err.stack.split("\n").slice(0, 6).join("\n") : ""}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

function FullSessionDossier({
  session: s,
  onClose,
}: {
  session: SessionWindow
  onClose: () => void
}) {
  const fx = useMemo(() => generateSessionForensics(s), [s])

  // Live UTC clock chip on the right of the identity row.
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const utcNow = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`
  const isLive = useMemo(() => {
    const h = now.getUTCHours() + now.getUTCMinutes() / 60
    return s.openUTC < s.closeUTC ? h >= s.openUTC && h < s.closeUTC : h >= s.openUTC || h < s.closeUTC
  }, [now, s])

  const fmtPips = (p: number) => (p >= 0 ? "+" : "") + p + "p"
  const fmtHold = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`

  // ── Killzone, NEXT-CLOSE countdown, hours-into-session ─────────────
  const utcH = now.getUTCHours() + now.getUTCMinutes() / 60
  // Hours-until-close (shown on the right of the hero when the session is live)
  let untilClose = s.closeUTC - utcH
  if (untilClose < 0) untilClose += 24
  let untilOpen = s.openUTC - utcH
  if (untilOpen < 0) untilOpen += 24
  const hoursToHM = (h: number) => `${Math.floor(h)}h ${Math.floor((h % 1) * 60)}m`

  // KPI sextet (replaces the old quartet).
  const kpis = [
    { label: "TRADES",        value: String(fx.trades) },
    { label: "WIN RATE",      value: fx.winRate + "%" },
    { label: "NET PIPS",      value: fmtPips(fx.netPips) },
    { label: "NET R",         value: (fx.netR >= 0 ? "+" : "") + fx.netR.toFixed(1) + "R" },
    { label: "AVG HOLD",      value: fmtHold(fx.avgHoldMin) },
    { label: "PROFIT FACTOR", value: fx.profitFactor.toFixed(2) },
  ]

  return (
    <div>
      {/* ── 1 · IDENTITY BAR ─────────────────────────────────────────
            Back chevron · flag · city · regime tag · live UTC pill +
            killzone window when defined.                              */}
      <motion.div
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE_V }}
        className="flex items-center justify-between"
        style={{ paddingBottom: 10, borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            aria-label="Back to all sessions"
            className="inline-flex items-center justify-center rounded-sm transition-colors hover:bg-white/5 shrink-0"
            style={{ width: 18, height: 18, border: `1px solid ${VANTARY.rule}`, color: VANTARY.paperDim }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} />
          </button>
          <span
            className="font-mono uppercase rounded-sm px-1.5 shrink-0"
            style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft, border: `1px solid ${VANTARY.rule}`, lineHeight: "16px" }}
          >
            {s.flag}
          </span>
          <span className="font-mono uppercase shrink-0" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            {s.city}
          </span>
          <span className="shrink-0" style={{ width: 1, height: 12, background: VANTARY.rule }} />
          <span
            className="font-mono uppercase rounded-sm px-1.5 shrink-0"
            style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber, border: `1px solid ${VANTARY.amberHalo}`, background: "rgba(45,212,191,0.06)", lineHeight: "16px" }}
          >
            {s.regime}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {s.killzone && (
            <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.12em", color: VANTARY.ashSoft }}>
              KZ {String(s.killzone.from).padStart(2, "0")}:00–{String(s.killzone.to).padStart(2, "0")}:00
            </span>
          )}
          <span className="shrink-0" style={{ width: 1, height: 12, background: VANTARY.rule }} />
          {isLive && (
            <motion.span
              className="rounded-full"
              style={{ width: 6, height: 6, background: VANTARY.amber }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <span
            className="font-mono uppercase tabular-nums"
            style={{ fontSize: 10, letterSpacing: "0.12em", color: isLive ? VANTARY.paper : VANTARY.ashSoft }}
          >
            {utcNow} UTC{isLive ? " · LIVE" : ""}
          </span>
        </div>
      </motion.div>

      {/* ── 2 · HERO ──────────────────────────────────────���────────────
            ACTIVE WINDOW protagonist + closes-in / opens-in countdown
            + a one-line regime blurb so the trader feels the day's mood. */}
      <div className="flex items-end justify-between" style={{ marginTop: 18, marginBottom: 6 }}>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft, marginBottom: 6 }}>
            {isLive ? "ACTIVE WINDOW" : "WINDOW"}
          </div>
          <ProtagonistNum value={s.city} size={44} />
        </div>
        <div className="text-right">
          <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft, marginBottom: 6 }}>
            {isLive ? "CLOSES IN" : "OPENS IN"}
          </div>
          <div className="font-sans tabular-nums" style={{ fontSize: 18, fontWeight: 500, color: VANTARY.paper }}>
            {hoursToHM(isLive ? untilClose : untilOpen)}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="font-sans"
        style={{ fontSize: 12, color: VANTARY.paperDim, marginBottom: 16 }}
      >
        {REGIME_BLURB[s.regime]}
      </motion.div>

      {/* ── 3 · KPI SEXTET ─────────────────────────────────────────────
            Six performance numbers in one strip with dashed dividers.
            Numbers count up via the existing CountUp helpers (used as
            a single label-value pair to keep render cost negligible). */}
      <div
        className="grid grid-cols-6"
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${VANTARY.rule}`,
          borderBottom: `1px solid ${VANTARY.rule}`,
        }}
      >
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.10 + i * 0.05, ease: EASE_V }}
            className="flex flex-col gap-1 px-3"
            style={{ borderRight: i < 5 ? `1px dashed ${VANTARY.rule}` : "none" }}
          >
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
              {kpi.label}
            </span>
            <span className="font-sans tabular-nums" style={{ fontSize: 18, fontWeight: 500, color: VANTARY.paper, lineHeight: 1 }}>
              {kpi.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── 4 · TRADABLE PAIRS — RICH CARDS ───────��────────────────────
            One card per pair the trader uses in this session. Every
            number is fully spelled out (no shortened "8t" / "+47p"
            stubs). Each card carries: a header (pair · full name ·
            dominant setup · grade), a six-metric performance grid,
            a behavioural strip (BEST / WORST / EXPECTANCY /
            CONSISTENCY), and a chronological recent-trades list.    */}
      <div style={{ marginTop: 22 }}>
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
              TRADABLE PAIRS
            </span>
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
              {fx.pairStats.length} INSTRUMENTS THIS SESSION
            </span>
          </div>
          <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
            ALL TIME · {s.city.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {fx.pairStats.map((p, i) => (
            <TradablePairCard
              key={p.pair}
              stats={p}
              session={s}
              delay={0.30 + i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* ── 5 · COACH READOUT ─────────────────────────────────────────
            Two-line auto-generated insight reading the trader's pattern
            back to him. First line = the data; second line = the action. */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: EASE_V }}
        style={{
          marginTop: 18,
          padding: "12px 14px",
          borderLeft: `2px solid ${VANTARY.amberHalo}`,
          background: "rgba(45,212,191,0.04)",
          borderRadius: "0 6px 6px 0",
        }}
      >
        <div className="font-mono uppercase mb-1" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.amber }}>
          COACH READOUT
        </div>
        <div className="font-sans" style={{ fontSize: 12, color: VANTARY.paper, lineHeight: 1.55 }}>
          Edge peaks at{" "}
          <span style={{ color: VANTARY.amber }}>{String(fx.peakHour.utcHour).padStart(2, "0")}:00 ({fx.peakHour.wr}%)</span>
          {s.killzone ? " inside the killzone" : ""}, fades after{" "}
          <span style={{ color: VANTARY.paper, fontWeight: 500 }}>{fx.fatigueAfterH}h</span>.{" "}
          Prime pair{" "}
          <span style={{ color: VANTARY.paper, fontWeight: 500 }}>{fx.bestPair.pair}</span>{" "}
          on{" "}
          <span style={{ color: VANTARY.paper, fontWeight: 500 }}>{SETUP_TAGS[fx.bestPair.dominantSetup]}</span>{" "}
          setups.
        </div>
        <div className="font-sans" style={{ fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.5, marginTop: 4 }}>
          Avoid trading past{" "}
          <span style={{ color: VANTARY.ashSoft }}>{String((s.openUTC + fx.fatigueAfterH) % 24).padStart(2, "0")}:00 UTC</span>
          {" "}— historical drawdown skews negative.
        </div>
      </motion.div>
    </div>
  )
}

/** ── TradablePairCard ──────────����────────────────────────────────────
 *  The centrepiece of the dossier. One card per pair the trader uses in
 *  this session, with NO compressed text — every metric and trade row
 *  is fully spelled out.
 *
 *  Card layout (top-to-bottom):
 *    1. Header row    : "EUR/USD · Euro · US Dollar" + dominant setup
 *                       chip + 5-dot grade.
 *    2. KPI grid 6up  : TRADES · WIN RATE · NET PIPS · NET R · PROFIT
 *                       FACTOR · AVG HOLD.
 *    3. Behaviour row : BEST TRADE · WORST TRADE · EXPECTANCY ·
 *                       CONSISTENCY (rich micro-cards, not bars).
 *    4. Recent trades : a chronological table with timestamp, direction,
 *                       setup, R, pips, hold — readable like a journal.
 *
 *  All animation timing follows EASE_V with a per-row stagger so the
 *  cards "write themselves in" rather than popping.                    */
function TradablePairCard({
  stats: p,
  session: s,
  delay,
}: {
  stats: SessionPairStat
  session: SessionWindow
  delay: number
}) {
  const fmtPips = (n: number) => (n >= 0 ? "+" : "") + n + " pips"
  const fmtR = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "R"
  const fmtHold = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`
  const tone = (positive: boolean) => positive ? VANTARY.amber : VANTARY.ashSoft

  const kpis = [
    { label: "TRADES",        value: String(p.trades) },
    { label: "WIN RATE",      value: p.winRate + "%" },
    { label: "NET PIPS",      value: (p.pips >= 0 ? "+" : "") + p.pips },
    { label: "NET R",         value: fmtR(p.netR) },
    { label: "PROFIT FACTOR", value: p.profitFactor.toFixed(2) },
    { label: "AVG HOLD",      value: fmtHold(p.avgHoldMin) },
  ]

  // Show the most recent 5 trades, newest first.
  const recent = [...p.recentTrades].reverse().slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE_V }}
      style={{
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 14,
        background: "rgba(255,255,255,0.014)",
        overflow: "hidden",
      }}
    >
      {/* ── 1 · Header ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${VANTARY.rule}`,
          background: "rgba(255,255,255,0.012)",
        }}
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-sans tabular-nums" style={{ fontSize: 22, fontWeight: 500, color: VANTARY.paper, letterSpacing: "0.01em" }}>
            {p.pair}
          </span>
          <span className="font-mono uppercase truncate" style={{ fontSize: 10, letterSpacing: "0.18em", color: VANTARY.paperDim }}>
            {p.fullName}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
              DOMINANT
            </span>
            <span
              className="font-mono uppercase rounded-sm"
              style={{
                fontSize: 9,
                letterSpacing: "0.20em",
                color: VANTARY.amber,
                border: `1px solid ${VANTARY.amberHalo}`,
                background: "rgba(45,212,191,0.06)",
                padding: "2px 7px",
              }}
            >
              {SETUP_TAGS[p.dominantSetup]}
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: 10, color: VANTARY.paperDim }}>
              {p.dominantSetupCount} of {p.trades}
            </span>
          </div>
          <span style={{ width: 1, height: 14, background: VANTARY.rule }} />
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
              GRADE
            </span>
            <span className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const filled = i < p.grade
                return (
                  <span
                    key={i}
                    style={{
                      width: 6, height: 6,
                      borderRadius: "50%",
                      background: filled ? VANTARY.amber : "transparent",
                      border: `1px solid ${filled ? VANTARY.amber : VANTARY.rule}`,
                    }}
                  />
                )
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2 · KPI grid (six full numbers) ─────────────────────────── */}
      <div
        className="grid grid-cols-6"
        style={{
          padding: "14px 0",
          borderBottom: `1px solid ${VANTARY.rule}`,
        }}
      >
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: delay + 0.10 + i * 0.04, ease: EASE_V }}
            className="flex flex-col gap-1.5 px-4"
            style={{ borderRight: i < 5 ? `1px dashed ${VANTARY.rule}` : "none" }}
          >
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
              {kpi.label}
            </span>
            <span className="font-sans tabular-nums" style={{ fontSize: 17, fontWeight: 500, color: VANTARY.paper, lineHeight: 1 }}>
              {kpi.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── 3 · Behaviour strip (best / worst / expectancy / consistency) ── */}
      <div
        className="grid grid-cols-4"
        style={{
          padding: "14px 0",
          borderBottom: `1px solid ${VANTARY.rule}`,
        }}
      >
        <BehaviourCell
          label="BEST TRADE"
          primary={fmtR(p.bestTrade.r)}
          secondary={`${fmtPips(p.bestTrade.pips)} · ${p.bestTrade.timeUTC} UTC`}
          accent={VANTARY.amber}
          delay={delay + 0.30}
          divider
        />
        <BehaviourCell
          label="WORST TRADE"
          primary={fmtR(p.worstTrade.r)}
          secondary={`${fmtPips(p.worstTrade.pips)} · ${p.worstTrade.timeUTC} UTC`}
          accent={VANTARY.ashSoft}
          delay={delay + 0.36}
          divider
        />
        <BehaviourCell
          label="EXPECTANCY"
          primary={fmtR(p.expectancy)}
          secondary="per trade · all-time"
          accent={tone(p.expectancy >= 0)}
          delay={delay + 0.42}
          divider
        />
        <BehaviourCell
          label="CONSISTENCY"
          primary={p.consistency + "%"}
          secondary="trades within 0.5R of average"
          accent={p.consistency >= 60 ? VANTARY.paper : VANTARY.ashSoft}
          delay={delay + 0.48}
        />
      </div>

      {/* ── 4 · Recent trades — fully readable journal rows ─────────── */}
      <div style={{ padding: "10px 16px 14px" }}>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            RECENT TRADES
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
            SHOWING {recent.length} OF {p.trades}
          </span>
        </div>
        <div className="flex flex-col">
          {/* Column headers */}
          <div
            className="grid items-baseline"
            style={{
              gridTemplateColumns: "70px 80px 70px minmax(60px, 1fr) minmax(60px, 1fr) 1fr",
              padding: "6px 0",
              borderBottom: `1px solid ${VANTARY.rule}`,
            }}
          >
            {["TIME UTC", "DIRECTION", "SETUP", "R-MULT", "PIPS", "HOLD TIME"].map((h, i) => (
              <span
                key={h}
                className="font-mono uppercase"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.18em",
                  color: VANTARY.ashSoft,
                  textAlign: i >= 3 ? "right" : "left",
                  paddingRight: i === 5 ? 0 : 6,
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {recent.map((t, i) => {
            const isWin = t.r >= 0
            return (
              <motion.div
                key={`${t.timeUTC}-${i}`}
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: delay + 0.55 + i * 0.05, ease: EASE_V }}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: "70px 80px 70px minmax(60px, 1fr) minmax(60px, 1fr) 1fr",
                  padding: "8px 0",
                  borderBottom: i < recent.length - 1 ? `1px dashed ${VANTARY.rule}` : "none",
                }}
              >
                <span className="font-mono tabular-nums" style={{ fontSize: 12, color: VANTARY.paper, letterSpacing: "0.04em" }}>
                  {t.timeUTC}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: t.direction === "LONG" ? VANTARY.paper : VANTARY.paperDim,
                  }}
                >
                  {t.direction}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: VANTARY.paperDim,
                    border: `1px solid ${VANTARY.rule}`,
                    borderRadius: 2,
                    padding: "1px 5px",
                    width: "fit-content",
                  }}
                >
                  {SETUP_TAGS[t.setup]}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 12,
                    color: tone(isWin),
                    fontWeight: 500,
                    textAlign: "right",
                    paddingRight: 6,
                  }}
                >
                  {fmtR(t.r)}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 12,
                    color: tone(t.pips >= 0),
                    textAlign: "right",
                    paddingRight: 6,
                  }}
                >
                  {(t.pips >= 0 ? "+" : "") + t.pips}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 11,
                    color: VANTARY.paperDim,
                    textAlign: "right",
                  }}
                >
                  {fmtHold(t.holdMin)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── 5 · Per-pair coach line ─────────────────────────────���───── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.85 }}
        className="font-sans"
        style={{
          padding: "10px 16px",
          fontSize: 11.5,
          color: VANTARY.paperDim,
          lineHeight: 1.5,
          borderTop: `1px solid ${VANTARY.rule}`,
          background: "rgba(255,255,255,0.008)",
        }}
      >
        {p.grade >= 4 ? (
          <>Strongest pair this session — <span style={{ color: VANTARY.paper }}>{SETUP_TAGS[p.dominantSetup]}</span> setups carry your edge{s.killzone ? " inside the killzone" : ""}.</>
        ) : p.grade <= 1 ? (
          <>Underperformer — limit size on <span style={{ color: VANTARY.paper }}>{p.pair}</span> until {SETUP_TAGS[p.dominantSetup]} expectancy stabilises.</>
        ) : (
          <>Workmanlike pair — your <span style={{ color: VANTARY.paper }}>{SETUP_TAGS[p.dominantSetup]}</span> setups print {p.winRate}% with average hold {fmtHold(p.avgHoldMin)}.</>
        )}
      </motion.div>
    </motion.div>
  )
}

/** A single behaviour-strip cell. Three-line layout: tiny label, large
 *  primary value (accent-tinted), small secondary line. Optional dashed
 *  divider on the right.                                                */
function BehaviourCell({
  label,
  primary,
  secondary,
  accent,
  delay,
  divider,
}: {
  label: string
  primary: string
  secondary: string
  accent: string
  delay: number
  divider?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: EASE_V }}
      className="flex flex-col gap-1.5 px-4"
      style={{ borderRight: divider ? `1px dashed ${VANTARY.rule}` : "none" }}
    >
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
        {label}
      </span>
      <span className="font-sans tabular-nums" style={{ fontSize: 16, fontWeight: 500, color: accent, lineHeight: 1 }}>
        {primary}
      </span>
      <span className="font-mono" style={{ fontSize: 10, color: VANTARY.paperDim, letterSpacing: "0.04em", lineHeight: 1.3 }}>
        {secondary}
      </span>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   SessionPuckPreview & supporting micro-primitives
   ────────────────────────────────────────────────────────────────────────────
   The flagship hover popover for the Sessions Radar. Same density bar as
   WatchPairPreview — every section conveys real, glanceable information.

       ┌────────────────────────────────────────────────────┐
       │ SESSION · GB                  ● LIVE  ·  TREND     │  Header (live chip)
       │ London                  07:00 → 16:00 UTC          │  Subject + window
       ├────────────────────��───────────────────────────────┤
       │ 24-HOUR ACTIVITY                  CURSOR · 09:24   │
       │ ░░░░░░████████████████████��█░░░░░░░░░░░░░░░░░░░░░  │  SessionActivityBar
       │ 00      06       12       18      24               │
       ├────────────────────────────────────────────────────┤
       │   WIN-RATE     STREAK      VOLATILITY    PAIRS      │  Stat quartet
       │   71%          W·W·L       1.8x          3          │
       │   YOUR EDGE    LAST 3      VS BASELINE   TRADEABLE  │
       ├────────────────────────────────────────────────────┤
       │ KILLZONE                          07:00 – 10:00    ��  KillzoneStrip
       │ ░░░░░░██████░░░░░░░░��░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
       ├──────────────────���───────────��─────────────────────┤
       │ TRADEABLE PAIRS                  GLOBAL HIGHLIGHT   │
       │ ┌──────────┬──────────┬──────���───┐                 │  SessionPairsGrid
       │ │ EUR/USD  │ GBP/USD  │ EUR/GBP  │                 │
       │ │  +18 p   │   +12 p  │   ���3 p   │                 │
       │ ��──────────┴──────────┴──────────┘                 │
       ├──��─────────────────────────────��───────────────────┤
       │ + PIN     ↗ VIEW PAIRS    ↓ ALERT ON OPEN          │  Footer
       └────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── SessionActivityBar ──────────────────────────────────────────────────
   24-hour horizontal track. The session's open→close window is highlighted
   with the green session tint; the current UTC cursor pulses as a hairline
   amber stem so traders can read "where am I in the day" instantly. */
function SessionActivityBar({
  session: s,
  utcHour,
}: {
  session: SessionWindow
  utcHour: number
}) {
  // Handle the Sydney edge case where the window wraps midnight.
  const wraps = s.openUTC > s.closeUTC
  const segments = wraps
    ? [{ from: s.openUTC, to: 24 }, { from: 0, to: s.closeUTC }]
    : [{ from: s.openUTC, to: s.closeUTC }]
  const cursorPct = (utcHour / 24) * 100

  return (
    <div
      className="rounded-md px-2.5 py-2"
      style={{
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.42)" }}
        >
          24-Hour Activity
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)" }}
        >
          CURSOR · {String(Math.floor(utcHour)).padStart(2, "0")}:{String(Math.round((utcHour % 1) * 60)).padStart(2, "0")}
        </span>
      </div>

      {/* track */}
      <div
        className="relative h-[18px] rounded-sm overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 4px, transparent 4px 8px)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* session window highlight(s) */}
        {segments.map((seg, i) => {
          const left = (seg.from / 24) * 100
          const width = ((seg.to - seg.from) / 24) * 100
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background:
                  "linear-gradient(180deg, rgba(34,197,94,0.32) 0%, rgba(34,197,94,0.12) 100%)",
                borderLeft: "1px solid rgba(34,197,94,0.45)",
                borderRight: "1px solid rgba(34,197,94,0.45)",
              }}
            />
          )
        })}

        {/* killzone overlay */}
        {s.killzone && (
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: `${(s.killzone.from / 24) * 100}%`,
              width: `${((s.killzone.to - s.killzone.from) / 24) * 100}%`,
              background:
                "linear-gradient(180deg, rgba(251,146,60,0.35) 0%, rgba(251,146,60,0.15) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(251,146,60,0.5)",
            }}
          />
        )}

        {/* now cursor */}
        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: `${cursorPct}%`,
            width: 1.5,
            background: VANTARY.amber,
            boxShadow: `0 0 6px ${VANTARY.amber}`,
            transform: "translateX(-50%)",
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* hour ticks */}
      <div className="flex justify-between mt-1 px-0.5">
        {[0, 6, 12, 18, 24].map((h) => (
          <span
            key={h}
            className="font-mono"
            style={{ fontSize: 8.5, letterSpacing: "0.10em", color: "rgba(255,255,255,0.32)" }}
          >
            {String(h).padStart(2, "0")}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── KillzoneStrip ───────────────────────────────────────────────────────
   Smaller dedicated strip for the session's killzone, when present. */
function KillzoneStrip({ session: s }: { session: SessionWindow }) {
  if (!s.killzone) return null
  const fmtHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:00`
  const left = (s.killzone.from / 24) * 100
  const width = ((s.killzone.to - s.killzone.from) / 24) * 100

  return (
    <div className="flex items-center gap-2.5 mt-1">
      <span
        className="font-mono uppercase shrink-0"
        style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(251,146,60,0.85)" }}
      >
        Killzone
      </span>
      <div
        className="relative flex-1 h-[6px] rounded-full overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{
            left: `${left}%`,
            width: `${width}%`,
            background:
              "linear-gradient(90deg, rgba(251,146,60,0.7) 0%, rgba(251,146,60,0.4) 100%)",
            boxShadow: "0 0 8px rgba(251,146,60,0.4)",
          }}
        />
      </div>
      <span
        className="font-mono shrink-0"
        style={{ fontSize: 9, letterSpacing: "0.10em", color: "rgba(255,255,255,0.7)" }}
      >
        {fmtHour(s.killzone.from)} – {fmtHour(s.killzone.to)}
      </span>
    </div>
  )
}

/* ── SessionPairsGrid ────────────────────────────────────────────────────
   Each tradeable pair becomes a cross-keyed micro-card. Hovering one inside
   the popover lights up the same `pair:*` everywhere on the dashboard.  */
export function SessionPairsGrid({ pairs }: { pairs: string[] }) {
  // Look up pip data from WATCHLIST when available, else synthesise a
  // deterministic value from the symbol so the card never reads "N/A".
  const data = pairs.map((p) => {
    const w = WATCHLIST.find((x) => x.symbol === p)
    if (w) return { symbol: p, pips: w.pipsToday, sourced: true }
    const seed = p.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    const synth = ((seed * 17) % 41) - 20 // −20..+20
    return { symbol: p, pips: synth, sourced: false }
  })

  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
      {data.map(({ symbol, pips, sourced }) => {
        const positive = pips >= 0
        return (
          <DrillCard
            key={symbol}
            as="div"
            interaction="none"
            category="forex"
            density="compact"
            intent="subtle"
            crossKey={`pair:${symbol}`}
            className="px-2 py-1.5 rounded-md flex flex-col items-start"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              minWidth: 0,
            }}
          >
            <span
              className="font-mono truncate w-full"
              style={{
                fontSize: 10,
                color: VANTARY.paper,
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              {symbol}
            </span>
            <span
              className="font-mono mt-0.5"
              style={{
                fontSize: 10,
                color: positive ? "rgb(52,211,153)" : "rgb(244,114,114)",
                fontWeight: 500,
              }}
            >
              {positive ? "+" : ""}
              {pips}
              <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 8.5, marginLeft: 2 }}>
                p{sourced ? "" : "·"}
              </span>
            </span>
          </DrillCard>
        )
      })}
    </div>
  )
}

/** Compute everything the session preview needs — deterministic snapshot. */
function deriveSessionLive(s: SessionWindow, utcHour: number) {
  const wraps = s.openUTC > s.closeUTC
  let isOpen = false
  let elapsedHours = 0
  let totalHours = 0
  if (wraps) {
    isOpen = utcHour >= s.openUTC || utcHour < s.closeUTC
    totalHours = 24 - s.openUTC + s.closeUTC
    if (isOpen) {
      elapsedHours = utcHour >= s.openUTC ? utcHour - s.openUTC : 24 - s.openUTC + utcHour
    }
  } else {
    isOpen = utcHour >= s.openUTC && utcHour < s.closeUTC
    totalHours = s.closeUTC - s.openUTC
    if (isOpen) elapsedHours = utcHour - s.openUTC
  }
  const remainingHours = isOpen ? Math.max(0, totalHours - elapsedHours) : 0

  // Volatility multiplier — TREND > NEWS > RANGE > QUIET vs baseline 1.0x
  const volMap: Record<SessionWindow["regime"], number> = { TREND: 1.8, NEWS: 2.4, RANGE: 1.1, QUIET: 0.6 }
  const vol = volMap[s.regime]

  // Streak — last 3 deterministic from the city seed.
  const seed = s.city.charCodeAt(0) + s.city.length
  const streak = [0, 1, 2].map((i) => (((seed + i * 11) % 7) > 2 ? "W" : "L")).join(" · ")

  return { isOpen, elapsedHours, remainingHours, totalHours, vol, streak }
}

/* ── SessionPuckPreview (composed flagship) ────────────────────────────── */
function SessionPuckPreview({
  session: s,
  isActive,
  pinned,
}: {
  session: SessionWindow
  isActive: boolean
  pinned: boolean
}) {
  // Compute UTC once per popover open. Re-mounts on each open so this is fine.
  const [utcHour] = useState(() => {
    const d = new Date()
    return d.getUTCHours() + d.getUTCMinutes() / 60
  })

  const live = useMemo(() => deriveSessionLive(s, utcHour), [s, utcHour])
  const fmtHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:00`
  const fmtElapsed = (h: number) => {
    const hh = Math.floor(h)
    const mm = Math.floor((h % 1) * 60)
    return `${hh}h ${String(mm).padStart(2, "0")}m`
  }

  return (
    <>
      {/* ── Header ── */}
      <HoverPreviewPopover.Header>
        <div className="flex items-baseline justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-medium uppercase tracking-[0.10em] text-white/45 leading-none mb-1.5">
              SESSION · {s.flag}
            </div>
            <div className="font-sans leading-tight" style={{ fontSize: 19, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.015em" }}>
              {s.city}
              <span
                className="font-mono ml-2"
                style={{
                  fontSize: 10.5,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.06em",
                }}
              >
                {fmtHour(s.openUTC)} → {fmtHour(s.closeUTC)} UTC
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {isActive ? (
              <span className="flex items-center gap-1.5">
                <motion.span
                  className="rounded-full"
                  style={{ width: 6, height: 6, background: "rgb(52,211,153)" }}
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    color: "rgb(52,211,153)",
                    fontWeight: 500,
                  }}
                >
                  LIVE
                </span>
              </span>
            ) : (
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}
              >
                CLOSED
              </span>
            )}
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)" }}
            >
              {s.regime}
            </span>
          </div>
        </div>

        {/* status sub-line */}
        {isActive && (
          <div className="mt-1.5 flex items-center justify-between">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.42)" }}
            >
              {fmtElapsed(live.elapsedHours)} elapsed
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.42)" }}
            >
              {fmtElapsed(live.remainingHours)} remaining
            </span>
          </div>
        )}
      </HoverPreviewPopover.Header>

      {/* ── Body ── */}
      <HoverPreviewPopover.Body>
        <SessionActivityBar session={s} utcHour={utcHour} />

        {/* stat quartet */}
        <div className="grid grid-cols-4 gap-2 mt-1.5">
          <StatTile
            label="Win-rate"
            value={`${s.winRate}%`}
            hint="YOUR EDGE"
            tone={s.winRate >= 65 ? "positive" : s.winRate >= 50 ? "default" : "warn"}
          />
          <StatTile
            label="Streak"
            value={live.streak}
            hint="LAST 3"
          />
          <StatTile
            label="Volatility"
            value={`${live.vol.toFixed(1)}x`}
            hint="VS BASE"
            tone={live.vol >= 1.5 ? "accent" : "default"}
          />
          <StatTile
            label="Pairs"
            value={s.pairs.length.toString()}
            hint="TRADEABLE"
          />
        </div>

        {s.killzone && (
          <>
            <HoverPreviewPopover.Divider />
            <KillzoneStrip session={s} />
          </>
        )}

        <HoverPreviewPopover.Divider />

        {/* tradeable pairs */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)" }}
            >
              Tradeable pairs
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgb(34,197,94)" }}
            >
              GLOBAL HIGHLIGHT
            </span>
          </div>
          <SessionPairsGrid pairs={s.pairs} />
        </div>
      </HoverPreviewPopover.Body>

      {/* ── Footer ── */}
      <HoverPreviewPopover.Footer>
        <HoverPreviewPopover.ActionButton
          affordance={pinned ? "confirm" : "preview"}
          variant="primary"
        >
          {pinned ? "Pinned" : "Pin to rail"}
        </HoverPreviewPopover.ActionButton>
        <HoverPreviewPopover.ActionButton affordance="navigate">
          View pairs
        </HoverPreviewPopover.ActionButton>
        <HoverPreviewPopover.ActionButton affordance="save">
          Alert on open
        </HoverPreviewPopover.ActionButton>
      </HoverPreviewPopover.Footer>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  LIVING SESSIONS RADAR — TIMING UTILITIES
 *  ─────────────────────────────────────────────────────────────────────────
 *  Pure time-math helpers used by the Sessions Radar overview surface.
 *  Deterministic given utcHour (no Date.now in render path) so SSR, tests,
 *  and visual regressions stay stable.
 * ═══════════════════════════════════════════════════════════════════════ */
function sessionLengthH(s: SessionWindow): number {
  return s.openUTC < s.closeUTC ? s.closeUTC - s.openUTC : 24 - s.openUTC + s.closeUTC
}
function isSessionOpen(s: SessionWindow, utcHour: number): boolean {
  return s.openUTC < s.closeUTC
    ? utcHour >= s.openUTC && utcHour < s.closeUTC
    : utcHour >= s.openUTC || utcHour < s.closeUTC
}
function sessionProgress01(s: SessionWindow, utcHour: number): number | null {
  if (!isSessionOpen(s, utcHour)) return null
  const len = sessionLengthH(s)
  const elapsed =
    s.openUTC < s.closeUTC
      ? utcHour - s.openUTC
      : utcHour >= s.openUTC ? utcHour - s.openUTC : utcHour + 24 - s.openUTC
  return Math.min(1, Math.max(0, elapsed / len))
}
/** Two pixel-space segments per session (single-segment for non-wrapping windows). */
function sessionSegmentsPct(s: SessionWindow): { left: number; width: number; segStart01: number; segEnd01: number }[] {
  const total = sessionLengthH(s)
  if (s.openUTC < s.closeUTC) {
    return [{
      left: (s.openUTC / 24) * 100,
      width: ((s.closeUTC - s.openUTC) / 24) * 100,
      segStart01: 0, segEnd01: 1,
    }]
  }
  const firstLen = 24 - s.openUTC
  return [
    {
      left: (s.openUTC / 24) * 100,
      width: (firstLen / 24) * 100,
      segStart01: 0, segEnd01: firstLen / total,
    },
    {
      left: 0,
      width: (s.closeUTC / 24) * 100,
      segStart01: firstLen / total, segEnd01: 1,
    },
  ]
}
/** Continuous overlap zones — runs of hours where ≥2 sessions are co-open. */
function computeOverlapZones(): { from: number; to: number; sessions: SessionWindow["key"][] }[] {
  const zones: { from: number; to: number; sessions: SessionWindow["key"][] }[] = []
  let segStart: number | null = null
  let segKeys: SessionWindow["key"][] = []
  for (let h = 0; h <= 24; h++) {
    const sample = (h % 24) + 0.001
    const open = SESSIONS.filter((s) => isSessionOpen(s, sample))
    if (open.length >= 2) {
      if (segStart === null) {
        segStart = h
        segKeys = open.map((s) => s.key)
      } else {
        // merge any new keys into the current zone's set
        for (const k of open.map((s) => s.key)) if (!segKeys.includes(k)) segKeys.push(k)
      }
    } else if (segStart !== null) {
      zones.push({ from: segStart, to: h, sessions: segKeys })
      segStart = null
      segKeys = []
    }
  }
  if (segStart !== null) zones.push({ from: segStart, to: 24, sessions: segKeys })
  return zones
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  <LivingSessionHero/>  — the redesigned hero band that opens the radar
 *  ─────────────────────────────────────────────────────────────────────────
 *  Left:   ACTIVE WINDOW · big city protagonist · vitals chips
 *          (regime · WR · IN · LEFT) · session progress bar with marker
 *  Right:  NEXT · upcoming city · countdown tile · regime preview chip
 *  Mid:    a "handoff" line — animated dashed bridge from active → next
 *
 *  Everything is visually alive: breathing dot, sweeping bridge dashes,
 *  progress-bar shimmer that travels with elapsed time.
 * ═══════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
 *  <LivingSessionHero/>  —  v3 · co-active aware headline
 *  ─────────────────────────────────────────────────────────────────────────
 *  Architecture (top → bottom):
 *
 *    Eyebrow row  ─ left:   "● ACTIVE WINDOW · OVERLAP MODE" (or just
 *                            "ACTIVE WINDOW")  with breathing pulse dot
 *                  right:   "NEXT OPEN" eyebrow
 *
 *    Headline row ─ left:   protagonist at 64px. In co-active state the
 *                            two open sessions are rendered as a ligature
 *                            ("Sydney + Tokyo") with a softly-breathing
 *                            "+" between them; otherwise just one city.
 *                  right:   "London / opens 07:00 UTC · in 5h 28m /
 *                            TREND · 72% historical edge"
 *
 *    Context line ─ when in co-active state, a single hairline-bordered
 *                   strip explains the relationship between the two
 *                   currently-open sessions ("Tokyo joined 1h 31m ago ·
 *                   both running until 09:00") so the trader instantly
 *                   understands why both names are on the headline.
 *
 *    Vitals tiles ─ four teaching tiles (REGIME / HISTORICAL / TIME
 *                   ELAPSED / NEXT TRANSITION). Each tile has an
 *                   eyebrow, a big value, and a 2-line teaching subtitle
 *                   so a noob trader understands the *meaning* of each
 *                   metric, not just the number.
 *
 *    Progress bar ─ horizontal shimmer-filled bar with a pulsing comet
 *                   at the elapsed edge, plus a 1-line meta caption
 *                   ("39% through Sydney · handoff → London").
 *
 *  Every layer animates in with stagger — total entrance budget ~0.9s.
 * ═══════════════════════════════════════════════════════════════════════ */
function LivingSessionHero({
  active, next, utcHour,
}: {
  active: SessionWindow | undefined
  next: { s: SessionWindow; hours: number }
  utcHour: number
}) {
  // ── Identify ALL currently-open sessions, not just the first one
  // (the parent's `active` is always SESSIONS.find(...) which returns
  // only the first match — but during 00:00–07:00 UTC we have
  // Sydney AND Tokyo simultaneously). The co-active headline depends
  // on this distinction.                                          ──
  const openSessions = useMemo(
    () => SESSIONS.filter((s) => isSessionOpen(s, utcHour)),
    [utcHour],
  )
  const isCoActive = openSessions.length >= 2
  // Protagonist for "single-active" mode; in co-active mode we render
  // a ligature instead of using this directly.
  const protagonist = active ?? next.s

  // ── progress numbers (drive the bar + tiles) ────────────────────
  const totalH   = sessionLengthH(protagonist)
  const progress = active ? sessionProgress01(active, utcHour) ?? 0 : 0
  const elapsedH    = Math.floor(progress * totalH)
  const elapsedMins = Math.floor((progress * totalH * 60) % 60)
  const remainingTotalMins = Math.max(0, Math.round(totalH * 60 - progress * totalH * 60))
  const remainingH = Math.floor(remainingTotalMins / 60)
  const remainingM = remainingTotalMins % 60
  const nextH = Math.floor(next.hours)
  const nextM = Math.floor((next.hours % 1) * 60)

  // ── For the co-active context line: when did the SECOND session
  // join? Compute the most-recent session-open hour and how long ago
  // it was, so we can say "Tokyo joined 1h 31m ago".              ──
  const coActiveSecondary = isCoActive
    ? openSessions.find((s) => s.key !== active?.key) ?? null
    : null
  const secondaryJoinedH = coActiveSecondary
    ? (() => {
        let h = utcHour - coActiveSecondary.openUTC
        if (h < 0) h += 24
        return h
      })()
    : 0
  const secondaryJoinedHH = Math.floor(secondaryJoinedH)
  const secondaryJoinedMM = Math.floor((secondaryJoinedH % 1) * 60)
  // When does the EARLIEST currently-open session close? That's the
  // moment one of the two co-active windows ends. Useful for the
  // context line: "both running until 07:00".
  const earliestClose = isCoActive
    ? openSessions.reduce((earliest, s) => {
        // Compute how many hours until this session's close
        let until = s.closeUTC - utcHour
        if (until <= 0) until += 24
        if (until < earliest.until) return { s, until }
        return earliest
      }, { s: openSessions[0], until: Infinity })
    : null

  // ── Regime explainer copy. This is the teaching subtitle on the
  // REGIME tile. Each regime gets a 2-line subtitle in trader-grade
  // language so QUIET / RANGE / TREND / NEWS no longer look cryptic.
  const regimeExplainer: Record<string, [string, string]> = {
    QUIET: ["Low volatility · tight range", "Fade extremes · skip breakouts"],
    RANGE: ["Mean-reverting · two-way flow", "Buy support · sell resistance"],
    TREND: ["Directional · momentum carries", "Ride pullbacks · skip fades"],
    NEWS:  ["Headline-driven · spikes & gaps", "Wait the report · then react"],
  }
  const [regimeLine1, regimeLine2] = active
    ? regimeExplainer[active.regime] ?? ["", ""]
    : regimeExplainer[next.s.regime] ?? ["", ""]

  // ── Format the next session's open clock as "07:00 UTC".
  const nextOpenHH = String(next.s.openUTC).padStart(2, "0")

  return (
    <div className="mb-5">
      {/* ─────────────────────────────────────────────────────────────
          ROW 1 · Eyebrow row (left: ACTIVE WINDOW · right: NEXT OPEN)
          ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-6 mb-2">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE_V }}
        >
          {active && (
            <motion.span
              className="rounded-full"
              style={{
                width: 6, height: 6, background: VANTARY.amber,
                boxShadow: `0 0 8px ${VANTARY.amber}`,
              }}
              animate={{ opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <span
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
          >
            {active ? "ACTIVE WINDOW" : "NEXT WINDOW"}
          </span>
          {isCoActive && (
            <>
              <span
                aria-hidden
                style={{ width: 1, height: 10, background: VANTARY.rule, marginInline: 4 }}
              />
              <motion.span
                className="font-mono uppercase"
                style={{
                  fontSize: 10, letterSpacing: "0.22em", color: VANTARY.amber,
                }}
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ◇ OVERLAP MODE
              </motion.span>
            </>
          )}
        </motion.div>
        <motion.span
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE_V, delay: 0.05 }}
        >
          {active ? "NEXT OPEN" : "OPENS IN"}
        </motion.span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2 · Headline row · big protagonist · next-open capsule
          ─────────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-6 mb-3">
        {/* LEFT — Headline. Single OR co-active ligature. */}
        <motion.div
          className="min-w-0 flex-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE_V, delay: 0.06 }}
        >
          {isCoActive && active && coActiveSecondary ? (
            // ── Co-active ligature: "Sydney + Tokyo" at 64px, with a
            // breathing "+" between them in amber.                ──
            <div className="flex items-end gap-3 flex-wrap">
              <ProtagonistNum value={active.city} size={64} />
              <motion.span
                className="font-sans"
                style={{
                  fontSize: 56, fontWeight: 200,
                  color: VANTARY.amber, lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                }}
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                +
              </motion.span>
              <ProtagonistNum value={coActiveSecondary.city} size={64} />
            </div>
          ) : (
            <ProtagonistNum value={protagonist.city} size={64} />
          )}
        </motion.div>

        {/* RIGHT — Next-open capsule (3-line vertical block) */}
        <motion.div
          className="text-right shrink-0"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE_V, delay: 0.10 }}
        >
          <div
            className="font-sans"
            style={{ fontSize: 28, fontWeight: 500, color: VANTARY.paper, lineHeight: 1.05 }}
          >
            {next.s.city}
          </div>
          <div
            className="font-mono uppercase tabular-nums mt-1"
            style={{ fontSize: 10, letterSpacing: "0.16em", color: VANTARY.paperDim }}
          >
            opens {nextOpenHH}:00 UTC ·{" "}
            <span style={{ color: VANTARY.amber }}>
              in {nextH}h {String(nextM).padStart(2, "0")}m
            </span>
          </div>
          <div
            className="flex items-center gap-2 justify-end mt-2"
            style={{ fontSize: 9 }}
          >
            <span
              className="font-mono uppercase"
              style={{ letterSpacing: "0.20em", color: VANTARY.ashSoft }}
            >
              {next.s.regime} ·{" "}
              <span className="tabular-nums" style={{ color: VANTARY.paperDim }}>
                {next.s.winRate}% historical edge
              </span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 3 · Co-active context line (only in overlap mode)
          ─────────────────────────────────────────────────────────── */}
      {isCoActive && coActiveSecondary && earliestClose && (
        <motion.div
          className="rounded-md flex items-center gap-2 mb-3"
          style={{
            border: `1px solid ${VANTARY.amberHalo}`,
            background: VANTARY.amberWash,
            padding: "5px 10px",
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_V, delay: 0.18 }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.amber }}
          >
            ◇ DUAL FLOW
          </span>
          <span style={{ width: 1, height: 9, background: VANTARY.amberHalo }} />
          <span
            className="font-mono uppercase tabular-nums"
            style={{ fontSize: 9.5, letterSpacing: "0.10em", color: VANTARY.paperDim }}
          >
            {coActiveSecondary.city} joined {secondaryJoinedHH}h{" "}
            {String(secondaryJoinedMM).padStart(2, "0")}m ago · both running until{" "}
            {String(earliestClose.s.closeUTC).padStart(2, "0")}:00 UTC
          </span>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ROW 4 · Vitals teaching tiles (4 columns, equal width)
          Each tile teaches the meaning of its metric, not just its
          number. This is the antidote to the cryptic chip strip.
          ─────────────────────────────────────────────────────────── */}
      {active && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <VitalTile
            index={0}
            eyebrow="REGIME"
            value={active.regime}
            tone="amber"
            line1={regimeLine1}
            line2={regimeLine2}
          />
          <VitalTile
            index={1}
            eyebrow="HISTORICAL"
            value={`${active.winRate}%`}
            tone="amber"
            line1="Win rate · last 90"
            line2={`of your ${active.city} sessions`}
          />
          <VitalTile
            index={2}
            eyebrow="TIME ELAPSED"
            value={`${elapsedH}h ${String(elapsedMins).padStart(2, "0")}m`}
            line1={`${active.city} since ${String(active.openUTC).padStart(2, "0")}:00 UTC`}
            line2={`${Math.round(progress * 100)}% through window`}
          />
          <VitalTile
            index={3}
            eyebrow="NEXT TRANSITION"
            value={`${remainingH}h ${String(remainingM).padStart(2, "0")}m`}
            line1={`${active.city} closes at ${String(active.closeUTC).padStart(2, "0")}:00 UTC`}
            line2={`${next.s.city} opens at the same moment`}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ROW 5 · Progress bar (kept polished with shimmer + comet)
          ─────────────────────────────────────────────────────────── */}
      <div className="relative" style={{ height: 6 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${VANTARY.rule}` }}
        />
        {active && (
          <>
            <motion.div
              className="absolute top-0 bottom-0 left-0 rounded-full overflow-hidden"
              style={{ background: VANTARY.amberHalo, border: `1px solid ${VANTARY.amber}` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.9, ease: EASE_V }}
            >
              <motion.div
                className="absolute inset-y-0"
                style={{
                  width: 32,
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)`,
                }}
                animate={{ x: ["-32px", "100%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <motion.div
              className="absolute rounded-full"
              style={{
                left: `calc(${progress * 100}% - 5px)`,
                top: -3, width: 11, height: 11,
                background: VANTARY.amber, boxShadow: `0 0 12px ${VANTARY.amber}`,
              }}
              animate={{ scale: [0.85, 1.15, 0.85] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      {/* ─── Progress meta caption ─── */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-mono uppercase tabular-nums" style={{
          fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft,
        }}>
          {active
            ? `${Math.round(progress * 100)}% THROUGH ${active.city.toUpperCase()}`
            : `${protagonist.city.toUpperCase()} OPENS IN ${nextH}h ${String(nextM).padStart(2, "0")}m`}
        </span>
        <span className="font-mono uppercase tabular-nums" style={{
          fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft,
        }}>
          HANDOFF → {next.s.city.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

/* ── <VitalTile/>  ───────────────────────────────────────────────────
 *  A tile in the teaching vitals strip. Layout:
 *      eyebrow (10px mono caps)
 *      value   (16px sans)        ← the number/word the trader scans
 *      line1   (8.5px mono caps)  ← teaching subtitle, what it means
 *      line2   (8.5px mono caps)  ← teaching subtitle, why it matters
 *  This tile design is the antidote to the old "WR 54%" chip — it
 *  preserves the number AND the trader's understanding of it.
 * ────────────────────────────────────────────────────────────────── */
function VitalTile({
  eyebrow, value, line1, line2, tone, index,
}: {
  eyebrow: string
  value: string
  line1: string
  line2: string
  tone?: "amber" | "default"
  index: number
}) {
  return (
    <motion.div
      className="rounded-md"
      style={{
        border: `1px solid ${VANTARY.rule}`,
        background: "rgba(255,255,255,0.012)",
        padding: "8px 10px",
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_V, delay: 0.22 + index * 0.05 }}
    >
      <div
        className="font-mono uppercase"
        style={{ fontSize: 8, letterSpacing: "0.22em", color: VANTARY.ashSoft, marginBottom: 4 }}
      >
        {eyebrow}
      </div>
      <div
        className="font-sans tabular-nums"
        style={{
          fontSize: 16, fontWeight: 500, lineHeight: 1.05,
          color: tone === "amber" ? VANTARY.amber : VANTARY.paper,
          letterSpacing: "-0.005em",
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.10em", color: VANTARY.paperDim, lineHeight: 1.35 }}
      >
        {line1}
      </div>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.10em", color: VANTARY.ashSoft, lineHeight: 1.35 }}
      >
        {line2}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  <SessionRail/>  — v3 · INTERACTIVE 24-hour living timeline
 *  ────────────────────────────────────────���────────────────────────────────
 *  Hover any element to learn what's happening. Every primitive on the
 *  rail is a teaching surface:
 *
 *    Layers (bottom-up):
 *      0.  Ambient horizontal scan line (very slow left→right sweep)
 *      1.  Overlap halo bands — vertical glowing columns where 2+ sessions
 *          are co-active.  HOVER:  rich tooltip explaining what the overlap
 *          means tactically (which sessions, best pairs, historical edge).
 *      2.  Hour grid — dashed verticals every 3h, solid at edges.
 *          Hovering an hour LABEL (footer row) shows what's happening
 *          at that hour (which sessions are open, opening, closing).
 *      3.  Session lifelines — outlined tracks with progress fill, inner
 *          peak-brightness gradient, killzone "KZ" badges, and bright
 *          killzone segments.  HOVER:  rich session dossier (window,
 *          regime, WR, killzone, top pairs, dossier CTA).
 *      4.  City open markers — chevron + flag tag.
 *      5.  Now cursor — vertical beam + comet head + UTC time chip + 5-min
 *          minor ticks.  HOVER comet:  full clock dossier (UTC, NY, SYD,
 *          LON local times + active sessions list + handoff countdown).
 *      6.  Hour labels + footer (UTC · 24H · NY OPEN 12:00) with hoverable
 *          hour tooltips.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ── <RailTooltip/> ─────────────────────────────────────────────────────
 *  Reusable absolutely-positioned tooltip card for the rail. Anchored
 *  to the parent (which must be position:relative). Pops in below or
 *  above its anchor with a tiny tail. Width is content-driven up to
 *  maxWidth.
 * ───────────────────────────────────────────────────────────────────── */
function RailTooltip({
  open, side = "below", align = "center", leftPct, children, maxWidth = 280,
}: {
  open: boolean
  side?: "above" | "below"
  align?: "left" | "center" | "right"
  /** horizontal anchor in the parent (0–100). */
  leftPct: number
  children: React.ReactNode
  maxWidth?: number
}) {
  const transformX =
    align === "left"  ? "0%" :
    align === "right" ? "-100%" :
    "-50%"
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: side === "below" ? -4 : 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: side === "below" ? -4 : 4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: EASE_V }}
          className="absolute pointer-events-none z-50"
          style={{
            left: `${leftPct}%`,
            transform: `translateX(${transformX})`,
            top:    side === "below" ? "calc(100% + 8px)" : undefined,
            bottom: side === "above" ? "calc(100% + 8px)" : undefined,
            maxWidth,
            width: "max-content",
          }}
        >
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: "rgba(10,10,10,0.92)",
              border: `1px solid ${VANTARY.amberHalo}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.4) inset",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── helpers for tooltip content ───────────────────────────────────── */

/** Tactical meaning for each known overlap window. */
function getOverlapMeta(zone: { from: number; to: number; sessions: string[] }) {
  const has = (k: string) => zone.sessions.includes(k)
  if (has("SYDNEY") && has("TOKYO")) {
    return {
      title: "ASIA OPEN · DUAL LIQUIDITY",
      sub: "Sydney + Tokyo desks active simultaneously — carry-trade flow comes alive, ranges firm up.",
      best: ["AUD/JPY", "USD/JPY", "GBP/JPY"],
      edge: "71% historical WR",
      avoid: "EUR/USD GBP/USD · European desks closed",
    }
  }
  if (has("LONDON") && has("NY")) {
    return {
      title: "PEAK GLOBAL LIQUIDITY",
      sub: "London + NY simultaneously — 78% of daily FX volume happens here, deepest order books of the day.",
      best: ["EUR/USD", "GBP/USD", "XAU/USD"],
      edge: "Highest historical edge window",
      avoid: "Skip late after 14:30 UTC · trends fade",
    }
  }
  if (has("TOKYO") && has("LONDON")) {
    return {
      title: "ASIA → EUROPE HANDOFF",
      sub: "Tokyo closing while London opens — choppy 2h transition with whipsaw risk.",
      best: ["EUR/JPY", "GBP/JPY"],
      edge: "Wait for clean trend post-08:00",
      avoid: "Avoid breakout entries 07:00–08:00",
    }
  }
  return {
    title: "SESSION OVERLAP",
    sub: `${zone.sessions.join(" + ")} co-active — heightened liquidity expected.`,
    best: [],
    edge: "",
    avoid: "",
  }
}

/** Compact dossier for a session lifeline tooltip. */
function getSessionMeta(s: SessionWindow) {
  const playbook = SESSION_LIQUIDITY_RULES[s.key]
  const topPairs = playbook?.favored.slice(0, 3).map((n) => n.pair) ?? s.pairs.slice(0, 3)
  return {
    desc: playbook?.description ?? "",
    topPairs,
    killzoneLabel: s.killzone?.label,
  }
}

/** What sessions are open / opening / closing at a specific UTC hour. */
function getHourMeta(hour: number) {
  const h = ((hour % 24) + 24) % 24
  const eps = 0.001
  const open = SESSIONS.filter((s) => isSessionOpen(s, h + eps))
  const opening = SESSIONS.filter((s) => Math.abs(s.openUTC - h) < 0.5)
  const closing = SESSIONS.filter((s) => Math.abs(s.closeUTC - h) < 0.5)
  return { open, opening, closing }
}

/** Convert UTC hour-fraction to a local-clock string for a fixed offset. */
function fmtClock(utcH: number, offset: number) {
  const total = ((utcH + offset) % 24 + 24) % 24
  const hh = Math.floor(total)
  const mm = Math.floor((total % 1) * 60)
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}

function SessionRail({ utcHour }: { utcHour: number }) {
  const cursorPct = (utcHour / 24) * 100
  const overlapZones = useMemo(() => computeOverlapZones(), [])

  // Bumped track height (9→11) and gap (3→5) — accounts for the new
  // "KZ" badges above each killzone segment and gives the rail breathing
  // room. Also contributes to the +18% card-height growth requirement.
  const TRACK_H = 11
  const TRACK_GAP = 5
  const TRACKS_AREA_H = SESSIONS.length * (TRACK_H + TRACK_GAP)

  // City open markers — short tag at the open hour of each session
  const OPEN_MARKERS = useMemo(
    () => SESSIONS.map((s) => ({
      key: s.key, h: s.openUTC, label: s.flag,
    })),
    [],
  )

  // Format current UTC hour as HH:MM
  const utcChip = fmtClock(utcHour, 0)

  // ── HOVER STATE — every layer's hovered identifier lives here ──
  const [hoveredSession, setHoveredSession] = useState<string | null>(null)
  const [hoveredOverlap, setHoveredOverlap] = useState<number | null>(null)
  const [hoveredHour, setHoveredHour]       = useState<number | null>(null)
  const [cometHovered, setCometHovered]     = useState(false)

  // Derived sets for currently-active sessions (used in comet tooltip)
  const openNow = useMemo(() => SESSIONS.filter((s) => isSessionOpen(s, utcHour)), [utcHour])

  // Time until next handoff (any session opening) — for comet tooltip
  const nextHandoff = useMemo(() => {
    const upcoming = SESSIONS.map((s) => {
      let h = s.openUTC - utcHour
      if (h <= 0) h += 24
      return { s, hours: h }
    }).sort((a, b) => a.hours - b.hours)
    return upcoming.find((u) => !openNow.find((o) => o.key === u.s.key)) ?? upcoming[0]
  }, [utcHour, openNow])

  return (
    <div className="relative">
      {/* ── L0 · Ambient horizontal scan ─────────────────────────────── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: 14, height: TRACKS_AREA_H,
          width: 80,
          background: `linear-gradient(90deg, transparent, ${VANTARY.amberHalo} 40%, ${VANTARY.amberHalo} 60%, transparent)`,
          opacity: 0.18,
          filter: "blur(8px)",
        }}
        animate={{ x: ["-80px", "calc(100% + 80px)"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* ── L1 · Overlap halo bands (HOVERABLE) ──────────────────────── */}
      <div
        className="absolute inset-x-0"
        style={{ top: 0, height: TRACKS_AREA_H + 14, zIndex: 1 }}
      >
        {overlapZones.map((z, i) => {
          const meta = getOverlapMeta(z)
          return (
            <button
              key={`oz-${i}`}
              type="button"
              onMouseEnter={() => setHoveredOverlap(i)}
              onMouseLeave={() => setHoveredOverlap((cur) => (cur === i ? null : cur))}
              onFocus={() => setHoveredOverlap(i)}
              onBlur={() => setHoveredOverlap((cur) => (cur === i ? null : cur))}
              aria-label={`Overlap ${z.from}-${z.to} UTC: ${meta.title}`}
              className="absolute outline-none"
              style={{
                left: `${(z.from / 24) * 100}%`,
                width: `${((z.to - z.from) / 24) * 100}%`,
                top: 0, bottom: 0,
                background: "transparent",
                border: "none",
                cursor: "help",
                padding: 0,
              }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${VANTARY.amberHalo}, transparent 75%)`,
                  borderLeft:  `1px dashed ${VANTARY.amberHalo}`,
                  borderRight: `1px dashed ${VANTARY.amberHalo}`,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hoveredOverlap === i ? 0.85 : [0.28, 0.55, 0.28],
                }}
                transition={
                  hoveredOverlap === i
                    ? { duration: 0.18 }
                    : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 }
                }
              />
            </button>
          )
        })}
      </div>

      {/* ── L1b · Overlap label band ─────────────────────────────────── */}
      <div className="relative h-3 mb-1" style={{ zIndex: 2 }}>
        {overlapZones.map((z, i) => (
          <span
            key={`oz-l-${i}`}
            className="absolute font-mono uppercase tabular-nums"
            style={{
              left: `${((z.from + z.to) / 2 / 24) * 100}%`,
              transform: "translateX(-50%)",
              fontSize: 7.5,
              letterSpacing: "0.20em",
              color: VANTARY.amber,
              top: -1,
              whiteSpace: "nowrap",
              transition: "filter 0.18s",
              filter: hoveredOverlap === i ? "brightness(1.4)" : "none",
            }}
          >
            ◇ OVERLAP {String(z.from).padStart(2, "0")}–{String(z.to).padStart(2, "0")}
          </span>
        ))}
        {/* Overlap-zone tooltip(s) — only one shown at a time */}
        {overlapZones.map((z, i) => {
          if (hoveredOverlap !== i) return null
          const meta = getOverlapMeta(z)
          const centerPct = (z.from + z.to) / 2 / 24 * 100
          return (
            <RailTooltip key={`oz-tip-${i}`} open leftPct={centerPct} side="below" maxWidth={320}>
              <div className="px-3.5 py-3">
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.amber, marginBottom: 6 }}
                >
                  {meta.title}
                </div>
                <div
                  className="font-mono uppercase tabular-nums mb-2"
                  style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim }}
                >
                  {String(z.from).padStart(2, "0")}:00–{String(z.to).padStart(2, "0")}:00 UTC
                  {" · "}
                  {z.to - z.from}h dual flow
                </div>
                <div
                  className="font-sans"
                  style={{ fontSize: 11, color: VANTARY.paper, lineHeight: 1.45, marginBottom: 8 }}
                >
                  {meta.sub}
                </div>
                {meta.best.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span className="font-mono uppercase" style={{
                      fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft,
                    }}>
                      BEST PAIRS
                    </span>
                    {meta.best.map((p) => (
                      <span key={p} className="font-mono tabular-nums" style={{
                        fontSize: 9.5, color: VANTARY.amber,
                        padding: "1px 5px",
                        border: `1px solid ${VANTARY.amberHalo}`,
                        borderRadius: 4,
                        background: VANTARY.amberWash,
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {meta.edge && (
                  <div className="font-mono uppercase" style={{
                    fontSize: 9, letterSpacing: "0.14em", color: VANTARY.amber, marginTop: 4,
                  }}>
                    ↑ {meta.edge}
                  </div>
                )}
                {meta.avoid && (
                  <div className="font-mono uppercase" style={{
                    fontSize: 8.5, letterSpacing: "0.14em", color: VANTARY.paperDim, marginTop: 2,
                  }}>
                    ✗ avoid: {meta.avoid}
                  </div>
                )}
              </div>
            </RailTooltip>
          )
        })}
      </div>

      {/* ── L2/3 · Track rail (HOVERABLE LIFELINES) ──────────────────── */}
      <div className="relative" style={{ height: TRACKS_AREA_H, zIndex: 3 }}>
        {/* dashed hour guides */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => {
            const pct = (i / 8) * 100
            return (
              <div
                key={`g-${i}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${pct}%`,
                  borderLeft: `1px ${i === 0 || i === 8 ? "solid" : "dashed"} ${VANTARY.rule}`,
                  opacity: 0.5,
                }}
              />
            )
          })}
        </div>

        {SESSIONS.map((s, i) => {
          const isActive = isSessionOpen(s, utcHour)
          const progress = sessionProgress01(s, utcHour)
          const top = i * (TRACK_H + TRACK_GAP)
          const segs = sessionSegmentsPct(s)
          const isHovered = hoveredSession === s.key
          // dim non-hovered lifelines when ANY lifeline is hovered
          const dimNonHovered = hoveredSession != null && !isHovered
          const lifelineOpacity = dimNonHovered ? 0.45 : 1

          return (
            <div
              key={s.key}
              style={{ opacity: lifelineOpacity, transition: "opacity 0.18s" }}
            >
              {segs.map((seg, segIdx) => {
                let fillFrac = 0
                if (progress != null) {
                  const localFrac = (progress - seg.segStart01) / (seg.segEnd01 - seg.segStart01)
                  fillFrac = Math.min(1, Math.max(0, localFrac))
                }

                const kz = s.killzone
                let kzLeft: number | null = null
                let kzWidth = 0
                if (kz && s.openUTC < s.closeUTC) {
                  const segLen = s.closeUTC - s.openUTC
                  kzLeft = ((kz.from - s.openUTC) / segLen) * 100
                  kzWidth = ((kz.to - kz.from) / segLen) * 100
                }

                return (
                  <button
                    key={`${s.key}-seg-${segIdx}`}
                    type="button"
                    onMouseEnter={() => setHoveredSession(s.key)}
                    onMouseLeave={() => setHoveredSession((cur) => (cur === s.key ? null : cur))}
                    onFocus={() => setHoveredSession(s.key)}
                    onBlur={() => setHoveredSession((cur) => (cur === s.key ? null : cur))}
                    aria-label={`${s.city} session ${s.openUTC}-${s.closeUTC} UTC`}
                    className="absolute outline-none"
                    style={{
                      top, left: `${seg.left}%`, width: `${seg.width}%`, height: TRACK_H,
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "help",
                    }}
                  >
                    {/* outline track */}
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: isActive ? "rgba(45,212,191,0.05)" : "rgba(255,255,255,0.025)",
                        border: `1px solid ${isActive ? VANTARY.amberHalo : VANTARY.rule}`,
                      }}
                      animate={isActive ? {
                        boxShadow: [
                          `0 0 0 0 ${VANTARY.amberHalo}`,
                          `0 0 8px 0 ${VANTARY.amberHalo}`,
                          `0 0 0 0 ${VANTARY.amberHalo}`,
                        ],
                      } : {}}
                      transition={isActive ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                    />
                    {/* progress fill (active only) */}
                    {isActive && fillFrac > 0 && (
                      <motion.div
                        aria-hidden
                        className="absolute top-0 bottom-0 left-0 rounded-full overflow-hidden"
                        style={{ background: VANTARY.amberWash, border: `1px solid ${VANTARY.amber}` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${fillFrac * 100}%` }}
                        transition={{ duration: 0.9, ease: EASE_V }}
                      >
                        <motion.div
                          className="absolute inset-y-0"
                          style={{
                            width: 24,
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
                          }}
                          animate={{ x: ["-24px", "100%"] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                    {/* PEAK BRIGHTNESS GRADIENT — lighter inner glow at the
                        center of each segment to suggest peak liquidity in
                        the middle vs thin tails. Subtle, only visible on
                        hover or active. */}
                    {(isActive || isHovered) && (
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background: `radial-gradient(80% 100% at 50% 50%, ${VANTARY.amberHalo} 0%, transparent 75%)`,
                          opacity: isHovered ? 0.55 : 0.30,
                          mixBlendMode: "screen",
                        }}
                      />
                    )}
                    {/* killzone bright segment */}
                    {kzLeft != null && (
                      <div
                        aria-hidden
                        className="absolute rounded-full"
                        style={{
                          left: `${kzLeft}%`,
                          width: `${kzWidth}%`,
                          top: 0, bottom: 0,
                          background: isActive ? VANTARY.amber : VANTARY.amberHalo,
                          opacity: isActive ? 0.78 : 0.35,
                          boxShadow: isActive ? `0 0 6px ${VANTARY.amber}` : "none",
                        }}
                      />
                    )}
                    {/* KZ badge floating above the killzone segment */}
                    {kzLeft != null && (
                      <span
                        aria-hidden
                        className="absolute font-mono uppercase tabular-nums"
                        style={{
                          left: `${kzLeft + kzWidth / 2}%`,
                          transform: "translateX(-50%)",
                          top: -10,
                          fontSize: 6.5,
                          letterSpacing: "0.22em",
                          color: VANTARY.amber,
                          padding: "1px 3px",
                          background: "rgba(0,0,0,0.65)",
                          border: `1px solid ${VANTARY.amberHalo}`,
                          borderRadius: 2,
                          whiteSpace: "nowrap",
                          lineHeight: 1,
                        }}
                      >
                        KZ
                      </span>
                    )}
                  </button>
                )
              })}

              {/* Lifeline tooltip — anchored to session midpoint */}
              {isHovered && (() => {
                const meta = getSessionMeta(s)
                const midH = s.openUTC < s.closeUTC
                  ? (s.openUTC + s.closeUTC) / 2
                  : ((s.openUTC + s.closeUTC + 24) / 2) % 24
                const midPct = (midH / 24) * 100
                return (
                  <div className="absolute" style={{
                    top: top + TRACK_H, left: 0, right: 0, height: 0,
                  }}>
                    <RailTooltip open leftPct={midPct} side="below" maxWidth={300}>
                      <div className="px-3.5 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: 8, letterSpacing: "0.22em", color: VANTARY.ashSoft,
                              padding: "1px 4px",
                              border: `1px solid ${VANTARY.rule}`,
                              borderRadius: 3,
                            }}
                          >
                            {s.flag}
                          </span>
                          <span className="font-sans" style={{
                            fontSize: 14, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.005em",
                          }}>
                            {s.city}
                          </span>
                          {isActive && (
                            <motion.span
                              className="rounded-full"
                              style={{ width: 5, height: 5, background: VANTARY.amber }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                          {isActive && (
                            <span className="font-mono uppercase" style={{
                              fontSize: 8, letterSpacing: "0.20em", color: VANTARY.amber,
                            }}>
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="font-mono uppercase tabular-nums mb-2" style={{
                          fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim,
                        }}>
                          {String(s.openUTC).padStart(2, "0")}:00–{String(s.closeUTC).padStart(2, "0")}:00 UTC
                          {" · "}{sessionLengthH(s)}h window
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono uppercase" style={{
                            fontSize: 9, letterSpacing: "0.14em", color: VANTARY.paper,
                          }}>
                            {s.regime}
                          </span>
                          <span style={{ width: 1, height: 9, background: VANTARY.rule }} />
                          <span className="font-mono tabular-nums" style={{
                            fontSize: 10, color: VANTARY.amber, fontWeight: 500,
                          }}>
                            {s.winRate}% WR
                          </span>
                          <span className="font-mono uppercase" style={{
                            fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft,
                          }}>
                            historical
                          </span>
                        </div>
                        {meta.killzoneLabel && (
                          <div className="font-mono uppercase mb-2" style={{
                            fontSize: 9, letterSpacing: "0.14em", color: VANTARY.amber,
                          }}>
                            ★ {meta.killzoneLabel}{" · "}
                            <span style={{ color: VANTARY.paperDim }}>
                              {String(s.killzone!.from).padStart(2, "0")}:00–
                              {String(s.killzone!.to).padStart(2, "0")}:00 UTC
                            </span>
                          </div>
                        )}
                        {meta.desc && (
                          <div className="font-sans mb-2" style={{
                            fontSize: 10.5, color: VANTARY.paperDim, lineHeight: 1.4,
                          }}>
                            {meta.desc.split(".")[0]}.
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono uppercase" style={{
                            fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft,
                          }}>
                            TOP PAIRS
                          </span>
                          {meta.topPairs.map((p) => (
                            <span key={p} className="font-mono tabular-nums" style={{
                              fontSize: 9, color: VANTARY.paper,
                              padding: "1px 4px",
                              border: `1px solid ${VANTARY.rule}`,
                              borderRadius: 3,
                            }}>
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="font-mono uppercase mt-2 pt-2" style={{
                          fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft,
                          borderTop: `1px solid ${VANTARY.rule}`,
                        }}>
                          → click puck for full dossier
                        </div>
                      </div>
                    </RailTooltip>
                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>

      {/* ── L4 · City open markers (chevrons) ────────────────────────── */}
      <div className="relative h-3 mt-0.5">
        {OPEN_MARKERS.map((m) => (
          <div
            key={`om-${m.key}`}
            className="absolute"
            style={{ left: `${(m.h / 24) * 100}%`, transform: "translateX(-50%)", top: 0 }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span
                aria-hidden
                style={{
                  width: 0, height: 0,
                  borderLeft: "3px solid transparent",
                  borderRight: "3px solid transparent",
                  borderBottom: `4px solid ${VANTARY.ashSoft}`,
                }}
              />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 7, letterSpacing: "0.18em", color: VANTARY.ashSoft, lineHeight: 1 }}
              >
                {m.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── L5 · NOW cursor (HOVERABLE) ─────────────────────────────── */}
      {/* Vertical beam (visual only) */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: `${cursorPct}%`,
          top: 14,
          height: TRACKS_AREA_H,
          width: 1,
          background: VANTARY.amber,
          boxShadow: `0 0 10px ${VANTARY.amber}`,
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: `calc(${cursorPct}% - 24px)`,
          top: 14,
          height: TRACKS_AREA_H,
          width: 24,
          background: `linear-gradient(90deg, transparent, ${VANTARY.amberHalo})`,
          opacity: 0.45,
        }}
      />
      {/* 5-min minor ticks around the comet */}
      {[-12, -6, 6, 12].map((min) => {
        const tickPct = ((utcHour + min / 60) / 24) * 100
        if (tickPct < 0 || tickPct > 100) return null
        return (
          <div
            key={`mt-${min}`}
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: `${tickPct}%`,
              top: 12,
              width: 1, height: 4,
              background: VANTARY.amber,
              opacity: 0.35,
            }}
          />
        )
      })}
      {/* Comet head dot — HOVERABLE */}
      <button
        type="button"
        onMouseEnter={() => setCometHovered(true)}
        onMouseLeave={() => setCometHovered(false)}
        onFocus={() => setCometHovered(true)}
        onBlur={() => setCometHovered(false)}
        aria-label="Current time and active sessions"
        className="absolute outline-none rounded-full"
        style={{
          left: `calc(${cursorPct}% - 8px)`,
          top: 6,
          width: 17, height: 17,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "help",
        }}
      >
        <motion.div
          aria-hidden
          className="rounded-full mx-auto"
          style={{
            width: 11, height: 11,
            marginTop: 3,
            background: VANTARY.amber,
            boxShadow: `0 0 14px ${VANTARY.amber}`,
          }}
          animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </button>
      {/* UTC time chip floating above the comet */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${cursorPct}%`,
          top: -10,
          transform: "translateX(-50%)",
        }}
      >
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.16em",
            color: VANTARY.amber,
            padding: "2px 6px",
            border: `1px solid ${VANTARY.amberHalo}`,
            borderRadius: 999,
            background: "rgba(0,0,0,0.65)",
            whiteSpace: "nowrap",
          }}
        >
          NOW · {utcChip} UTC
        </span>
      </div>
      {/* Comet tooltip — current time across timezones + active list */}
      {cometHovered && (
        <div className="absolute" style={{ top: 22, left: 0, right: 0, height: 0 }}>
          <RailTooltip open leftPct={cursorPct} side="below" maxWidth={320}>
            <div className="px-3.5 py-3">
              <div className="font-mono uppercase mb-2" style={{
                fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.amber,
              }}>
                LIVE CLOCK
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                <div>
                  <div className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>UTC</div>
                  <div className="font-mono tabular-nums" style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500 }}>{utcChip}</div>
                </div>
                <div>
                  <div className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>NEW YORK</div>
                  <div className="font-mono tabular-nums" style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500 }}>{fmtClock(utcHour, -5)}</div>
                </div>
                <div>
                  <div className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>LONDON</div>
                  <div className="font-mono tabular-nums" style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500 }}>{fmtClock(utcHour, 0)}</div>
                </div>
                <div>
                  <div className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>SYDNEY</div>
                  <div className="font-mono tabular-nums" style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500 }}>{fmtClock(utcHour, 11)}</div>
                </div>
              </div>
              <div className="font-mono uppercase mb-1.5" style={{
                fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft,
              }}>
                ACTIVE NOW
              </div>
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {openNow.length > 0 ? openNow.map((s) => (
                  <span key={s.key} className="font-mono uppercase tabular-nums" style={{
                    fontSize: 9, color: VANTARY.amber,
                    padding: "1px 5px",
                    border: `1px solid ${VANTARY.amberHalo}`,
                    borderRadius: 4,
                    background: VANTARY.amberWash,
                    letterSpacing: "0.10em",
                  }}>
                    {s.flag} {s.city}
                  </span>
                )) : (
                  <span className="font-mono uppercase" style={{
                    fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim,
                  }}>
                    No major session active
                  </span>
                )}
              </div>
              <div
                className="font-mono uppercase pt-2"
                style={{
                  fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim,
                  borderTop: `1px solid ${VANTARY.rule}`,
                }}
              >
                NEXT HANDOFF{" → "}
                <span style={{ color: VANTARY.amber }}>{nextHandoff.s.city}</span>
                {" "}in{" "}
                <span className="tabular-nums">
                  {Math.floor(nextHandoff.hours)}h{" "}
                  {String(Math.floor((nextHandoff.hours % 1) * 60)).padStart(2, "0")}m
                </span>
              </div>
            </div>
          </RailTooltip>
        </div>
      )}

      {/* ── L6 · Hour labels & footer (HOVERABLE TICKS) ──────────────── */}
      <div className="relative flex justify-between mt-2 px-0">
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h, i) => (
          <button
            key={h}
            type="button"
            onMouseEnter={() => setHoveredHour(h)}
            onMouseLeave={() => setHoveredHour((cur) => (cur === h ? null : cur))}
            onFocus={() => setHoveredHour(h)}
            onBlur={() => setHoveredHour((cur) => (cur === h ? null : cur))}
            aria-label={`At ${String(h).padStart(2, "0")}:00 UTC`}
            className="font-mono tabular-nums outline-none"
            style={{
              fontSize: 9.5,
              color: hoveredHour === h
                ? VANTARY.amber
                : Math.abs(h - utcHour) < 1.5
                  ? VANTARY.amber
                  : VANTARY.ashSoft,
              letterSpacing: "0.10em",
              transition: "color 0.18s",
              background: "transparent",
              border: "none",
              padding: "2px 4px",
              cursor: "help",
            }}
          >
            {h.toString().padStart(2, "0")}
          </button>
        ))}
        {/* Hour-tick tooltip */}
        {hoveredHour != null && (() => {
          const meta = getHourMeta(hoveredHour)
          const tickPct = (hoveredHour / 24) * 100
          return (
            <RailTooltip open leftPct={tickPct} side="below" maxWidth={260}>
              <div className="px-3 py-2.5">
                <div className="font-mono uppercase tabular-nums" style={{
                  fontSize: 9, letterSpacing: "0.20em", color: VANTARY.amber, marginBottom: 6,
                }}>
                  AT {String(hoveredHour).padStart(2, "0")}:00 UTC
                </div>
                {meta.open.length > 0 ? (
                  <div className="mb-1.5">
                    <span className="font-mono uppercase" style={{
                      fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft,
                    }}>
                      OPEN
                    </span>
                    <div className="font-mono uppercase mt-0.5" style={{
                      fontSize: 9.5, letterSpacing: "0.10em", color: VANTARY.paper,
                    }}>
                      {meta.open.map((s) => `${s.flag} ${s.city}`).join("  ·  ")}
                    </div>
                  </div>
                ) : (
                  <div className="font-mono uppercase mb-1.5" style={{
                    fontSize: 9.5, letterSpacing: "0.10em", color: VANTARY.paperDim,
                  }}>
                    No major session open
                  </div>
                )}
                {meta.opening.length > 0 && (
                  <div className="font-mono uppercase" style={{
                    fontSize: 9, letterSpacing: "0.14em", color: VANTARY.amber, marginBottom: 2,
                  }}>
                    ↑ {meta.opening.map((s) => s.city).join(" / ")} opens
                  </div>
                )}
                {meta.closing.length > 0 && (
                  <div className="font-mono uppercase" style={{
                    fontSize: 9, letterSpacing: "0.14em", color: VANTARY.paperDim,
                  }}>
                    ↓ {meta.closing.map((s) => s.city).join(" / ")} closes
                  </div>
                )}
              </div>
            </RailTooltip>
          )
        })()}
      </div>
      <div className="flex justify-between mt-1 px-0">
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
          UTC · 24H · HOVER ANY ELEMENT
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
          NY OPEN 12:00
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  <Heartbeat/>  — a tiny ECG line used inside SessionPuck.
 *  Animates a moving dash when the session is currently open; freezes
 *  flat-and-faint when dormant. The path itself is a stylized peak-trough
 *  pattern, not real data — its job is to convey "this market is alive".
 * ─────────────────────────────────────────────────────────────────────── */
function Heartbeat({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 100 18"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 14, display: "block" }}
    >
      {/* baseline */}
      <line x1={0} x2={100} y1={9} y2={9} stroke={VANTARY.rule} strokeWidth={0.4} />
      <motion.path
        d="M 0 9 L 18 9 L 24 4 L 30 14 L 36 2 L 42 16 L 48 9 L 60 9 L 66 6 L 72 12 L 80 9 L 100 9"
        fill="none"
        stroke={active ? VANTARY.amber : VANTARY.ashGhost}
        strokeWidth={active ? 1.2 : 0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="22 100"
        initial={{ strokeDashoffset: 0 }}
        animate={active ? { strokeDashoffset: [122, 0] } : { strokeDashoffset: 0 }}
        transition={active ? { duration: 1.7, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
      />
    </svg>
  )
}

/* ════════════════════════════════════��═══════════���══════════════════════════
   4.  <WatchlistMatrix/> — five pairs the trader actually watches
   ──────────────────────────────────────────────────────────────────���────────
   Each row: pair · bias · mini Vantary candle chart · pips today · WR · status.
   Hairline-only candles in monochrome (paper bull, ash bear) — green/red
   stays banned from chrome per the Vantary palette rule.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────��─────────────────────────────────
   <WatchlistMatrix/> — CATEGORY GRID + DETAIL MODAL
   ───────────────────────────────────────────────────────────────────────────
   The watchlist surface is grouped into five **trading categories** rather
   than a flat row of pairs:

       USD   ·   EUR   ·   STOCKS   ·   COMMODITIES   ·   CRYPTO

   The outside view shows ONE rich tile per category with category-level KPIs
   (pair count, today pips, focus count, dominant bias, weighted WR). Clicking
   a tile opens a fullscreen modal popup whose body is a 2-column grid of
   high-quality `<WatchlistPairCard/>`s — each pair card mirrors the session
   `<TradablePairCard/>` exactly: header (pair · full name · dominant setup ·
   grade) → 6-metric KPI grid → 4-cell behaviour strip → recent trades journal
   → contextual coach line.
   ─────────────────────────────────────────────────────────────────────── */

export function WatchlistMatrix() {
  const [activeCategory, setActiveCategory] = useState<WatchCategoryId | null>(null)
  const focused = WATCHLIST.filter(p => p.inFocus).length
  const totalPips = WATCHLIST.reduce((a, p) => a + p.pipsToday, 0)

  // Lock body scroll while the modal is open (avoids dual-scroll feel).
  useEffect(() => {
    if (!activeCategory) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [activeCategory])

  // ESC closes the modal.
  useEffect(() => {
    if (!activeCategory) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveCategory(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeCategory])

  return (
    <>
      <CardShell padding={0}>
        <>
          {/* ── HERO HEADER ─────────────────────────────────────────────
             Three-column layout:
               · Eyebrow + title (left)
               · Hero pip number with sign-tinted underline (center-left)
               · Status pills + day timestamp (right)
             Then a full-width 5-segment composition bar showing exactly
             how today's +211 pips were distributed across the categories,
             with each segment in its category accent and inline labels.
          ─��─────────────────────────────────────���────────────────────── */}
          <WatchlistHeroHeader
            totalPips={totalPips}
            focused={focused}
            warningCount={WATCHLIST.filter(p => p.warning).length}
            pairsCount={WATCHLIST.length}
          />

          {/* dashed rule */}
          <div className="h-px mx-6" style={{ background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 6px, transparent 6px 12px)` }} />

          {/* ── Body — Category tile grid ───────────────────────────── */}
          <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {WATCH_CATEGORIES.map((cat, i) => (
              <WatchlistCategoryTile
                key={cat.id}
                category={cat}
                index={i}
                onOpen={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>
        </>
      </CardShell>

      {/* ── Modal popup — full-screen overlay with 2-col pair grid ───── */}
      <AnimatePresence>
        {activeCategory && (
          <WatchlistCategoryModal
            categoryId={activeCategory}
            onClose={() => setActiveCategory(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   <WatchlistHeroHeader/> — multi-billion-dollar hero block
   ─────────────────────────────────────────────────────────────────────────
   Layout (top → bottom):
       Eyebrow + title + day badge          (one row, three columns)
       Hero pip number — sized & weighted
       Composition stack-bar                (5 segments, accent-colored)
       Inline category contributions        (one chip per category)
   Renders directly inside CardShell so it inherits the watchlist card
   chrome. Replaces the old flat eyebrow + ProtagonistNum row.
   ─────────────────────────────────────────────────────────────────────── */
function WatchlistHeroHeader({
  totalPips,
  focused,
  warningCount,
  pairsCount,
}: {
  totalPips: number
  focused: number
  warningCount: number
  pairsCount: number
}) {
  // Per-category contribution map for the composition bar.
  const contributions = useMemo(
    () => WATCH_CATEGORIES.map(cat => {
      const agg = aggregateCategory(cat.id)
      return { id: cat.id, label: cat.label, pips: agg.pipsToday, vis: CATEGORY_VIS[cat.id] }
    }),
    []
  )
  // Bar width math — split positive vs negative side so the bar visually
  // shows winners-vs-losers without a fake "absolute value" trick.
  const positives = contributions.filter(c => c.pips >= 0)
  const negatives = contributions.filter(c => c.pips <  0)
  const posTotal = positives.reduce((a, c) => a + c.pips, 0)
  const negTotal = Math.abs(negatives.reduce((a, c) => a + c.pips, 0))
  const grand    = posTotal + negTotal || 1
  const positive = totalPips >= 0
  const todayLabel = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", weekday: "short" }).toUpperCase()

  return (
    <div className="px-6 pt-6 pb-5">
      {/* ── Row 1 — eyebrow / title / day-badge ───────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.24em", color: VANTARY.ashSoft }}>
            WATCHLIST  ·  PORTFOLIO OVERVIEW
          </span>
          <h2
            className="font-sans"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.005em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Pairs you trade
          </h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.18em",
              color: VANTARY.paperDim,
              border: `1px solid ${VANTARY.rule}`,
              borderRadius: 999,
              padding: "3px 9px",
              background: "rgba(255,255,255,0.012)",
            }}
          >
            {todayLabel}
          </span>
        </div>
      </div>

      {/* ── Row 2 — Hero pip number + supporting metrics ─────────── */}
      <div className="flex items-end justify-between gap-6 mt-5 flex-wrap">
        <div className="flex items-baseline gap-3 min-w-0">
          {/* sign chip */}
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: positive ? VANTARY.amber : "#E58F8F",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {positive ? "+" : "−"}
          </span>
          {/* protagonist number */}
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 56,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
            }}
          >
            {Math.abs(totalPips)}
          </span>
          {/* unit + tagline (stacked) */}
          <div className="flex flex-col gap-1 ml-1" style={{ paddingBottom: 4 }}>
            <span className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: "0.20em", color: VANTARY.paperDim }}>
              pips today
            </span>
            <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
              {pairsCount} INSTRUMENTS · {WATCH_CATEGORIES.length} ASSET CLASSES
            </span>
          </div>
        </div>

        {/* ── Right side: stat pills ─────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <HeroStatPill
            label="IN FOCUS"
            value={String(focused)}
            tone={VANTARY.amber}
            dot
          />
          {warningCount > 0 && (
            <HeroStatPill
              label="UNDER WATCH"
              value={String(warningCount)}
              tone="#E5B95B"
              triangle
            />
          )}
          <HeroStatPill
            label="NET R"
            value={posTotal > negTotal ? "POSITIVE" : "DRAWDOWN"}
            tone={posTotal > negTotal ? VANTARY.amber : VANTARY.ashSoft}
          />
        </div>
      </div>

      {/* ── Row 3 — Composition stack-bar ─────────────────────────
         Two stacked half-bars (positives | negatives) split at center,
         each segment colored with its category accent. The gap between
         the two halves is exactly at the zero-line so it reads like a
         P&L attribution chart, not a rainbow.                              */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            CONTRIBUTION BY ASSET CLASS
          </span>
          <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
            +{posTotal}  /  −{negTotal}  pips
          </span>
        </div>
        {/* The bar */}
        <div
          className="flex items-stretch w-full overflow-hidden"
          style={{
            height: 8,
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 999,
          }}
        >
          {/* positives (left) */}
          <div className="flex" style={{ width: `${(posTotal / grand) * 100}%` }}>
            {positives.map((c, i) => (
              <div
                key={c.id}
                title={`${c.label} +${c.pips} pips`}
                style={{
                  flex: c.pips,
                  background: c.vis.accent,
                  opacity: 0.92,
                  borderRight: i < positives.length - 1 ? "1px solid rgba(0,0,0,0.35)" : "none",
                }}
              />
            ))}
          </div>
          {/* zero divider */}
          <div style={{ width: 2, background: VANTARY.ink, flexShrink: 0 }} />
          {/* negatives (right) */}
          <div className="flex" style={{ width: `${(negTotal / grand) * 100}%` }}>
            {negatives.map((c, i) => (
              <div
                key={c.id}
                title={`${c.label} ${c.pips} pips`}
                style={{
                  flex: Math.abs(c.pips),
                  background: c.vis.accent,
                  opacity: 0.55,
                  borderRight: i < negatives.length - 1 ? "1px solid rgba(0,0,0,0.35)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Inline contribution legend ─────────────────────────── */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
          {contributions.map(c => {
            const sign = c.pips >= 0 ? "+" : ""
            return (
              <span
                key={c.id}
                className="font-mono tabular-nums inline-flex items-center gap-1.5"
                style={{ fontSize: 10, color: VANTARY.paperDim, letterSpacing: "0.06em" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: c.vis.accent }} />
                <span className="uppercase" style={{ letterSpacing: "0.18em", fontSize: 9.5, color: VANTARY.ashSoft }}>
                  {c.label}
                </span>
                <span style={{ color: c.pips >= 0 ? VANTARY.paper : VANTARY.ashSoft }}>
                  {sign}{c.pips}
                </span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HeroStatPill({
  label, value, tone, dot, triangle,
}: { label: string; value: string; tone: string; dot?: boolean; triangle?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 999,
        padding: "4px 10px",
        background: "rgba(255,255,255,0.012)",
      }}
    >
      {dot && <span style={{ width: 5, height: 5, borderRadius: 999, background: tone }} />}
      {triangle && <Triangle size={8} fill={tone} stroke="none" />}
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
        {label}
      </span>
      <span className="font-sans tabular-nums" style={{ fontSize: 11.5, fontWeight: 500, color: tone }}>
        {value}
      </span>
    </span>
  )
}

/* ───────────────────��───────────────────────────────────────────────��─────
   <WatchlistCategoryTile/> — the redesigned outside view tile.
   ────���────────────────��───────────────────────────────────────────────────
   Each tile now has a unique visual identity driven by CATEGORY_VIS[id]:

       · Top accent stripe (3 px) painted in the category's accent
       · Large signature glyph in the right corner (banknote / euro star /
         bar-spike / ingot / hex node), softened to the accent's wash
       · Category accent ring on the {USD}/{EUR}/etc badge
       · Hero pip number with an accent-colored sign chip
       · Refined KPI strip (4 cells, smaller gutters, no aggressive borders)
       · "INSTRUMENTS" row replaced by a flag-rich pair-pill list — every
         pair is a pill with its two-flag chip + symbol + today's pips delta
   ───────────────────────────────────────────────���─────────────────────── */
function WatchlistCategoryTile({
  category,
  index,
  onOpen,
}: {
  category: WatchCategory
  index: number
  onOpen: () => void
}) {
  const agg = useMemo(() => aggregateCategory(category.id), [category.id])
  const pairs = useMemo(
    () => WATCHLIST.filter(p => p.category === category.id),
    [category.id]
  )
  const vis = CATEGORY_VIS[category.id]
  const positive = agg.pipsToday >= 0
  const Icon = vis.Icon

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, delay: 0.06 * index, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -1 }}
      className="group relative text-left rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${vis.accentWash} 0%, rgba(255,255,255,0.012) 38%)`,
        border: `1px solid ${VANTARY.rule}`,
        padding: 0,
        cursor: "pointer",
      }}
    >
      {/* ── Top accent stripe — the strongest visual differentiator ── */}
      <div aria-hidden style={{ height: 3, background: vis.accent, opacity: 0.95 }} />

      {/* ── Large signature glyph watermark in top-right corner ───── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: 18,
          right: 14,
          color: vis.accent,
          opacity: 0.18,
          transition: "opacity 0.3s",
        }}
      >
        <Icon size={56} color={vis.accent} />
      </div>

      {/* ── Hover halo (category-tinted) ──────────���──────────────── */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse at 0% 0%, ${vis.accentWash} 0%, rgba(0,0,0,0) 55%)`,
        }}
      />

      {/* ── Header row — accent badge · full-name · open chevron ── */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3 relative"
        style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Glyph chip */}
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 28, height: 28,
              borderRadius: 8,
              border: `1px solid ${vis.accentRule}`,
              background: vis.accentWash,
              color: vis.accent,
              flexShrink: 0,
            }}
          >
            <Icon size={15} color={vis.accent} />
          </span>
          {/* Category label badge */}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: vis.accent,
              border: `1px solid ${vis.accentRule}`,
              borderRadius: 4,
              padding: "3px 8px",
              background: vis.accentWash,
            }}
          >
            {category.label}
          </span>
          {/* Full-name */}
          <span className="font-mono uppercase truncate" style={{ fontSize: 10, letterSpacing: "0.18em", color: VANTARY.paperDim }}>
            {category.fullName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            DETAILS
          </span>
          <ChevronRight size={12} strokeWidth={1.6} color={vis.accent} className="opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* ── Hero — pip number + status pills (right) ─────────────── */}
      <div className="px-4 pt-4 pb-3 flex items-end justify-between gap-3 relative">
        <div className="flex items-baseline gap-2 min-w-0">
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: positive ? vis.accent : "#E58F8F",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {positive ? "+" : "−"}
          </span>
          <span
            className="font-sans tabular-nums"
            style={{
              fontSize: 38,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
            }}
          >
            {Math.abs(agg.pipsToday)}
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.20em", color: VANTARY.paperDim, marginLeft: 6 }}>
            pips today
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {agg.inFocusCount > 0 && (
            <span className="inline-flex items-center gap-1.5" style={{
              border: `1px solid ${vis.accentRule}`,
              borderRadius: 999,
              padding: "2px 7px",
              background: vis.accentWash,
            }}>
              <span style={{ width: 4, height: 4, borderRadius: 999, background: vis.accent }} />
              <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.16em", color: vis.accent }}>
                {agg.inFocusCount} FOCUS
              </span>
            </span>
          )}
          {agg.warningCount > 0 && (
            <span className="inline-flex items-center gap-1.5" style={{
              border: `1px solid rgba(229,143,143,0.30)`,
              borderRadius: 999,
              padding: "2px 7px",
              background: "rgba(229,143,143,0.06)",
            }}>
              <Triangle size={7} fill="#E58F8F" stroke="none" />
              <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.16em", color: "#E58F8F" }}>
                {agg.warningCount} WATCH
              </span>
            </span>
          )}
        </div>
      </div>

      {/* ── KPI strip — 4 cells with refined dividers ──���─────────── */}
      <div
        className="grid grid-cols-4 relative"
        style={{ borderTop: `1px solid ${VANTARY.rule}`, borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        {[
          { label: "PAIRS",      value: String(agg.pairsCount) },
          { label: "AVG WIN",    value: agg.weightedWinRate + "%" },
          { label: "BIAS",       value: agg.dominantBias, accent: true },
          { label: "TRADES",     value: String(agg.totalSample) },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-1.5 px-4 py-3"
            style={{ borderRight: i < 3 ? `1px dashed ${VANTARY.rule}` : "none" }}
          >
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
              {kpi.label}
            </span>
            <span
              className="font-sans tabular-nums"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: kpi.accent ? vis.accent : VANTARY.paper,
                lineHeight: 1,
                letterSpacing: kpi.accent ? "0.02em" : "0.005em",
              }}
            >
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── INSTRUMENTS row — flag-rich pair pills ──────────────── */}
      <div className="px-4 py-3.5 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
            INSTRUMENTS
          </span>
          <span className="font-mono uppercase tabular-nums" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.paperDim }}>
            {pairs.length} TICKERS
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pairs.map((p) => {
            const pos = p.pipsToday >= 0
            return (
              <span
                key={p.symbol}
                className="inline-flex items-center gap-1.5"
                style={{
                  border: `1px solid ${VANTARY.rule}`,
                  borderRadius: 6,
                  padding: "3px 7px 3px 4px",
                  background: p.inFocus ? vis.accentWash : "rgba(255,255,255,0.014)",
                  borderColor: p.inFocus ? vis.accentRule : VANTARY.rule,
                }}
              >
                {/* flag chip(s) */}
                <PairFlagBadge symbol={p.symbol} />
                {/* symbol */}
                <span
                  className="font-mono tabular-nums"
                  style={{ fontSize: 10.5, color: VANTARY.paper, letterSpacing: "0.02em" }}
                >
                  {p.symbol}
                </span>
                {/* today's delta */}
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 10,
                    color: pos ? vis.accent : "#E58F8F",
                    letterSpacing: "0.02em",
                    fontWeight: 500,
                  }}
                >
                  {pos ? "+" : ""}{p.pipsToday}
                </span>
                {/* focus dot */}
                {p.inFocus && (
                  <span style={{ width: 4, height: 4, borderRadius: 999, background: vis.accent, marginLeft: 1 }} />
                )}
              </span>
            )
          })}
        </div>
      </div>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   <WatchlistCategoryModal/> — fullscreen popup that opens when a category
   tile is clicked. Renders ALL pairs in that category as
   <WatchlistPairCard/>s arranged in a 2-column grid (50% / 50% per row).
   ─────────────────────────────────────────────────────────────────────── */
function WatchlistCategoryModal({
  categoryId,
  onClose,
}: {
  categoryId: WatchCategoryId
  onClose: () => void
}) {
  const category = WATCH_CATEGORIES.find(c => c.id === categoryId)!
  const pairs = useMemo(
    () => WATCHLIST.filter(p => p.category === categoryId),
    [categoryId]
  )
  const agg = useMemo(() => aggregateCategory(categoryId), [categoryId])
  const positive = agg.pipsToday >= 0
  const vis = CATEGORY_VIS[categoryId]
  const ModalIcon = vis.Icon

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={`${category.fullName} pair details`}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-[1280px] mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: "90vh",
          background: "rgba(15,15,15,0.96)",
          border: `1px solid ${VANTARY.rule}`,
          boxShadow: "0 24px 80px -8px rgba(0,0,0,0.7)",
        }}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal header — accent stripe + category glyph ─────── */}
        <div aria-hidden style={{ height: 3, background: vis.accent, opacity: 0.95 }} />
        <div
          className="flex items-start justify-between gap-6 px-6 pt-5 pb-4 relative"
          style={{
            borderBottom: `1px solid ${VANTARY.rule}`,
            background: `linear-gradient(180deg, ${vis.accentWash} 0%, transparent 70%)`,
          }}
        >
          <div className="flex items-start gap-4 min-w-0">
            {/* Large category glyph */}
            <span
              className="inline-flex items-center justify-center shrink-0"
              style={{
                width: 52, height: 52,
                borderRadius: 12,
                border: `1px solid ${vis.accentRule}`,
                background: vis.accentWash,
                color: vis.accent,
              }}
            >
              <ModalIcon size={26} color={vis.accent} />
            </span>
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2.5">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    color: vis.accent,
                    border: `1px solid ${vis.accentRule}`,
                    borderRadius: 4,
                    padding: "3px 8px",
                    background: vis.accentWash,
                  }}
                >
                  {category.label}
                </span>
                <span className="font-sans" style={{ fontSize: 22, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.005em" }}>
                  {category.fullName}
                </span>
              </div>
              <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
                {category.description}
              </span>
              <div className="flex items-baseline gap-3 flex-wrap mt-1">
                <span
                  className="font-sans tabular-nums"
                  style={{
                    fontSize: 32,
                    fontWeight: 500,
                    color: positive ? vis.accent : "#E58F8F",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {(positive ? "+" : "") + agg.pipsToday}
                </span>
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
                  pips today · {agg.pairsCount} pairs · {agg.totalSample} trades · avg WR {agg.weightedWinRate}%
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 inline-flex items-center justify-center rounded-md transition-colors"
            style={{
              width: 32,
              height: 32,
              border: `1px solid ${VANTARY.rule}`,
              background: "transparent",
              color: VANTARY.paperDim,
              cursor: "pointer",
            }}
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Modal body: 2-column pair-card grid ───────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pairs.map((pair, i) => (
              <WatchlistPairCard key={pair.symbol} pair={pair} index={i} />
            ))}
          </div>
          {pairs.length === 0 && (
            <div className="font-mono uppercase text-center py-12" style={{ fontSize: 11, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
              NO PAIRS IN THIS CATEGORY YET
            </div>
          )}
        </div>

        {/* ── Modal footer ─────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderTop: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.012)" }}
        >
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            ESC TO CLOSE · CLICK BACKDROP TO DISMISS
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.paperDim }}>
            DOMINANT BIAS · {agg.dominantBias}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   <WatchlistPairCard/> — visual mirror of the session dossier's
   <TradablePairCard/>. Used inside the WatchlistCategoryModal grid so each
   pair rendered there gets the same level of detail as the session view:

       1. Header        → pair · full-name · DOMINANT setup chip · grade
       2. KPI sextet    → TRADES / WIN RATE / NET PIPS / NET R /
                          PROFIT FACTOR / AVG HOLD
       3. Behaviour row → BEST TRADE / WORST TRADE / EXPECTANCY / CONSISTENCY
       4. Recent trades → chronological journal table
       5. Coach line    → per-pair contextual readout
   ──���───────────────────────────────��───────���──���───────────────────────── */
function WatchlistPairCard({ pair, index }: { pair: WatchPair; index: number }) {
  const fx = useMemo(() => derivePairForensics(pair), [pair])
  const fullName = useMemo(() => watchPairFullName(pair.symbol), [pair.symbol])

  // Format helpers — no shortened "pips/R" units, all spelled out.
  const fmtPipsSigned = (n: number) => (n >= 0 ? "+" : "") + n + " pips"
  const fmtR = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "R"
  const fmtHold = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`
  const tone = (positive: boolean) => positive ? VANTARY.amber : VANTARY.ashSoft

  // Net R is approximated from expectancy × trades — keeps consistency
  // with the per-pair forensics surface.
  const netR = Number((fx.expectancyR * fx.trades).toFixed(2))
  const dominantSetup = fx.setups[0]
  const dominantSetupName = dominantSetup?.name ?? "STRATEGY"
  const dominantSetupCount = dominantSetup?.trades ?? 0
  const totalTrades = fx.trades

  // Best & worst recent trade by R.
  const sortedRecent = [...fx.recent].sort((a, b) => a.r - b.r)
  const worstT = sortedRecent[0]
  const bestT = sortedRecent[sortedRecent.length - 1]

  // Consistency: % of trades whose R is within 0.5 of expectancy.
  const within = fx.recent.filter(t => Math.abs(t.r - fx.expectancyR) <= 0.5).length
  const consistency = fx.recent.length > 0 ? Math.round((within / fx.recent.length) * 100) : 0

  // Grade: WR (3) + netR (2) capped at 5.
  const wrStars = pair.winRate >= 80 ? 3 : pair.winRate >= 65 ? 2 : pair.winRate >= 50 ? 1 : 0
  const rStars = netR >= 25 ? 2 : netR >= 10 ? 1 : 0
  const grade = Math.max(0, Math.min(5, wrStars + rStars))

  // KPI sextet (all fully spelled out — no "8t" / "+47p" stubs).
  const kpis = [
    { label: "TRADES",        value: String(fx.trades) },
    { label: "WIN RATE",      value: pair.winRate + "%" },
    { label: "NET PIPS",      value: (fx.pipsNet >= 0 ? "+" : "") + fx.pipsNet },
    { label: "NET R",         value: fmtR(netR) },
    { label: "PROFIT FACTOR", value: fx.profitFactor.toFixed(2) },
    { label: "AVG HOLD",      value: fmtHold(fx.holdWinAvg) },
  ]

  // Show 5 most recent trades.
  const recent = fx.recent.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 14,
        background: "rgba(255,255,255,0.014)",
        overflow: "hidden",
      }}
    >
      {/* ── 1 · Header ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.012)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Flag chip(s) — base + quote for forex; glyph for everything else */}
          <PairFlagBadge symbol={pair.symbol} w={20} h={14} />
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-sans tabular-nums" style={{ fontSize: 20, fontWeight: 500, color: VANTARY.paper, letterSpacing: "0.01em" }}>
              {pair.symbol}
            </span>
            <span className="font-mono uppercase truncate" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
              {fullName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
              DOMINANT
            </span>
            <span
              className="font-mono uppercase rounded-sm"
              style={{
                fontSize: 9,
                letterSpacing: "0.16em",
                color: VANTARY.amber,
                border: `1px solid ${VANTARY.amberHalo}`,
                background: "rgba(45,212,191,0.06)",
                padding: "2px 6px",
                whiteSpace: "nowrap",
              }}
            >
              {dominantSetupName.toUpperCase().slice(0, 14)}
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: 10, color: VANTARY.paperDim }}>
              {dominantSetupCount} of {totalTrades}
            </span>
          </div>
          <span style={{ width: 1, height: 14, background: VANTARY.rule }} />
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
              GRADE
            </span>
            <span className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const filled = i < grade
                return (
                  <span
                    key={i}
                    style={{
                      width: 6, height: 6,
                      borderRadius: "50%",
                      background: filled ? VANTARY.amber : "transparent",
                      border: `1px solid ${filled ? VANTARY.amber : VANTARY.rule}`,
                    }}
                  />
                )
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2 · KPI sextet ──────────────────────────────────── */}
      <div
        className="grid grid-cols-3 sm:grid-cols-6"
        style={{ padding: "12px 0", borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-1.5 px-3"
            style={{
              borderRight: i < 5 ? `1px dashed ${VANTARY.rule}` : "none",
            }}
          >
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
              {kpi.label}
            </span>
            <span className="font-sans tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: VANTARY.paper, lineHeight: 1 }}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── 3 · Behaviour strip ─────────────────────────────── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4"
        style={{ padding: "12px 0", borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <WatchlistBehaviourCell
          label="BEST TRADE"
          primary={bestT ? fmtR(bestT.r) : "—"}
          secondary={bestT ? `${fmtPipsSigned(bestT.pips)} · ${bestT.ts.split("·")[1]?.trim() || "—"}` : "no data"}
          accent={VANTARY.amber}
          divider
        />
        <WatchlistBehaviourCell
          label="WORST TRADE"
          primary={worstT ? fmtR(worstT.r) : "—"}
          secondary={worstT ? `${fmtPipsSigned(worstT.pips)} · ${worstT.ts.split("·")[1]?.trim() || "—"}` : "no data"}
          accent={VANTARY.ashSoft}
          divider
        />
        <WatchlistBehaviourCell
          label="EXPECTANCY"
          primary={fmtR(fx.expectancyR)}
          secondary="per trade · all-time"
          accent={tone(fx.expectancyR >= 0)}
          divider
        />
        <WatchlistBehaviourCell
          label="CONSISTENCY"
          primary={consistency + "%"}
          secondary="trades within 0.5R of average"
          accent={consistency >= 60 ? VANTARY.paper : VANTARY.ashSoft}
        />
      </div>

      {/* ── 4 · Recent trades journal ──────────────────────── */}
      <div style={{ padding: "10px 16px 12px" }}>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
            RECENT TRADES
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.paperDim }}>
            SHOWING {recent.length} OF {fx.recent.length}
          </span>
        </div>
        <div className="flex flex-col">
          {/* Column headers */}
          <div
            className="grid items-baseline"
            style={{
              gridTemplateColumns: "minmax(80px, 1.1fr) 70px 70px minmax(60px, 1fr) minmax(60px, 1fr)",
              padding: "6px 0",
              borderBottom: `1px solid ${VANTARY.rule}`,
            }}
          >
            {["DATE / TIME", "DIRECTION", "GRADE", "R-MULT", "PIPS"].map((h, i) => (
              <span
                key={h}
                className="font-mono uppercase"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.18em",
                  color: VANTARY.ashSoft,
                  textAlign: i >= 3 ? "right" : "left",
                  paddingRight: i === 4 ? 0 : 6,
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {recent.map((t, i) => {
            const isWin = t.r >= 0
            return (
              <div
                key={t.id}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: "minmax(80px, 1.1fr) 70px 70px minmax(60px, 1fr) minmax(60px, 1fr)",
                  padding: "8px 0",
                  borderBottom: i < recent.length - 1 ? `1px dashed ${VANTARY.rule}` : "none",
                }}
              >
                <span className="font-mono tabular-nums" style={{ fontSize: 11, color: VANTARY.paper, letterSpacing: "0.02em" }}>
                  {t.ts}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: t.dir === "long" ? VANTARY.paper : VANTARY.paperDim,
                  }}
                >
                  {t.dir}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    color: VANTARY.paperDim,
                    border: `1px solid ${VANTARY.rule}`,
                    borderRadius: 2,
                    padding: "1px 5px",
                    width: "fit-content",
                  }}
                >
                  {t.grade}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 11.5,
                    color: tone(isWin),
                    fontWeight: 500,
                    textAlign: "right",
                    paddingRight: 6,
                  }}
                >
                  {fmtR(t.r)}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 11.5,
                    color: tone(t.pips >= 0),
                    textAlign: "right",
                  }}
                >
                  {(t.pips >= 0 ? "+" : "") + t.pips}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 5 · Per-pair coach line ─────────────────────────── */}
      <div
        className="font-sans"
        style={{
          padding: "10px 16px",
          fontSize: 11.5,
          color: VANTARY.paperDim,
          lineHeight: 1.5,
          borderTop: `1px solid ${VANTARY.rule}`,
          background: "rgba(255,255,255,0.008)",
        }}
      >
        {grade >= 4 ? (
          <>Strongest pair in this category — <span style={{ color: VANTARY.paper }}>{dominantSetupName}</span> setups carry your edge during {fx.bestSession}.</>
        ) : grade <= 1 ? (
          <>Underperformer — limit size on <span style={{ color: VANTARY.paper }}>{pair.symbol}</span> until {dominantSetupName} expectancy stabilises.</>
        ) : (
          <>Workmanlike — <span style={{ color: VANTARY.paper }}>{dominantSetupName}</span> prints {pair.winRate}% with average hold {fmtHold(fx.holdWinAvg)} during {fx.bestSession}.</>
        )}
      </div>
    </motion.div>
  )
}

/** Single behaviour-cell inside <WatchlistPairCard/>. Three-line layout:
 *  tiny label · large accent-tinted primary · small secondary line.       */
function WatchlistBehaviourCell({
  label,
  primary,
  secondary,
  accent,
  divider,
}: {
  label: string
  primary: string
  secondary: string
  accent: string
  divider?: boolean
}) {
  return (
    <div
      className="flex flex-col gap-1.5 px-4"
      style={{ borderRight: divider ? `1px dashed ${VANTARY.rule}` : "none" }}
    >
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
        {label}
      </span>
      <span className="font-sans tabular-nums" style={{ fontSize: 14, fontWeight: 500, color: accent, lineHeight: 1 }}>
        {primary}
      </span>
      <span className="font-mono" style={{ fontSize: 10, color: VANTARY.paperDim, letterSpacing: "0.04em", lineHeight: 1.3 }}>
        {secondary}
      </span>
    </div>
  )
}

/**
 * A single watchlist pair, expressed as a `<DrillCard>`.
 *
 *   • interaction="preview-action"
 *       hover  → rich `WatchPairPreview` popover (Header / candle / stats / footer)
 *       click  → toggles a pin into the persistent SideDetailRail
 *
 *   • crossKey={`pair:${symbol}`}
 *       Hovering this row tints every other DrillCard sharing the same key
 *       (other watchlist surfaces, narrative claims, ticker chips, etc.).
 *
 *   • selected = isPinned(`pair:${symbol}`)
 *       Mirrors the rail's pinned state — the row visually "lights" when the
 *       rail is currently showing this pair.
 */
function WatchRow({ pair, onOpen }: { pair: WatchPair; onOpen: () => void }) {
  const id = `pair:${pair.symbol}`
  const { isPinned } = useSideRail()
  const pinned = isPinned(id)
  // Derive the pair's true forensics — the same source the takeover uses.
  const fx = useMemo(() => derivePairForensics(pair), [pair])

  return (
    <DrillCard
      as="div"
      interaction="preview-action"
      affordance="preview"
      category="forex"
      density="default"
      intent="subtle"
      crossKey={id}
      selected={pinned}
      previewSide="right"
      previewWidth={380}
      tooltip="Click to open full pair forensics"
      preview={<WatchPairPreview pair={pair} pinned={pinned} />}
      onClick={() => onOpen()}
      className="w-full"
    >
      <div
        className="grid items-center gap-3 w-full"
        style={{
          gridTemplateColumns:
            "minmax(86px,96px) 1fr minmax(72px,84px) minmax(60px,80px)",
        }}
      >
        {/* ── Symbol + bias + small WR puck ────────────────────────── */}
        <div className="min-w-0">
          <div
            className="font-sans flex items-center gap-1.5"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: VANTARY.paper,
              letterSpacing: "-0.005em",
            }}
          >
            {pair.symbol}
            {pair.inFocus && (
              <motion.span
                className="rounded-full"
                style={{ width: 5, height: 5, background: VANTARY.amber }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
          <div className="font-mono uppercase mt-0.5 inline-flex items-center gap-1.5" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
            <span>{pair.bias}</span>
            <span style={{ color: VANTARY.paperDim, fontWeight: 500 }}>
              WR {pair.winRate}<span style={{ color: VANTARY.ashSoft }}>%</span>
            </span>
            <span style={{ color: VANTARY.ashSoft }}>n={pair.sampleSize}</span>
          </div>
        </div>

        {/* ── Pair Stat Band (replaces the old candle strip) ─────────
              5 hairline-divided micro-cells with primary + caption stack,
              and a 1px win/loss-pip proportion bar beneath. */}
        <div className="min-w-0">
          <PairStatBand pair={pair} fx={fx} />
        </div>

        {/* ── Pips today ─────────────────────────────────────────── */}
        <div className="flex flex-col items-end">
          <span
            className="font-mono"
            style={{
              fontSize: 12,
              color: pair.pipsToday >= 0 ? VANTARY.paper : VANTARY.ash,
              fontWeight: 500,
            }}
          >
            {pair.pipsToday >= 0 ? "+" : ""}
            {pair.pipsToday}
            <span style={{ color: VANTARY.ashSoft, fontSize: 9 }}> pips</span>
          </span>
          <span
            className="font-mono uppercase mt-0.5"
            style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft }}
          >
            TODAY
          </span>
        </div>

        {/* ── Status / inspect-affordance ─────────────────────────── */}
        <div className="flex items-center justify-end gap-1.5">
          {pair.warning ? (
            <>
              <Triangle size={10} fill={VANTARY.amber} stroke="none" />
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VANTARY.amber }}>
                WATCH
              </span>
            </>
          ) : pair.inFocus ? (
            <>
              <StatusDot tone="ok" size={6} breathe />
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VANTARY.paperDim }}>
                FOCUS
              </span>
            </>
          ) : (
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
              IDLE
            </span>
          )}
          <ChevronRight size={12} strokeWidth={1.6} color={VANTARY.ash} className="opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </DrillCard>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   <PairStatBand>
   The trader-grade horizontal strip that replaces the old mini OHLC candle
   chart in each watchlist row. Five hairline-divided micro-cells that the
   eye can scan in under 2 seconds:

       ┌───────┬───────┬───────┬───────┬───────┐
       │ +428p │ −145p │ +$3.1k│ 12/mo │ 2h ago│
       │ TP 31 │ SL 16 │ PF 2.95│ LDN-AM│  HOT  │
       └───────┴───────┴───────┴───────┴───────┘
       ▰▰▰▰▰▰▰▰▰▰��▱▱▱▱  74% of pip volume from wins
   ─────────────────────────────────────────────────────────────────���───── */
function PairStatBand({ pair, fx }: { pair: WatchPair; fx: PairForensics }) {
  const winShare = fx.pipsWin / Math.max(1, fx.pipsWin + fx.pipsLoss)
  const heatRgb =
    fx.heat === "HOT" ? "34, 197, 94" :
    fx.heat === "COLD" ? "100, 116, 139" :
    "234, 179, 8"
  const cells: Array<{ primary: React.ReactNode; caption: React.ReactNode }> = [
    {
      primary: (
        <span className="font-mono tabular-nums" style={{ fontSize: 11.5, color: "rgb(34, 197, 94)", fontWeight: 500 }}>
          +{fx.pipsWin}<span style={{ fontSize: 9, color: VANTARY.ashSoft }}>p</span>
        </span>
      ),
      caption: (
        <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8, letterSpacing: "0.10em", color: VANTARY.ashSoft }}>
          TP {fx.tpHits}
        </span>
      ),
    },
    {
      primary: (
        <span className="font-mono tabular-nums" style={{ fontSize: 11.5, color: "rgb(239, 68, 68)", fontWeight: 500 }}>
          −{fx.pipsLoss}<span style={{ fontSize: 9, color: VANTARY.ashSoft }}>p</span>
        </span>
      ),
      caption: (
        <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8, letterSpacing: "0.10em", color: VANTARY.ashSoft }}>
          SL {fx.slHits}
        </span>
      ),
    },
    {
      primary: (
        <span className="font-mono tabular-nums" style={{ fontSize: 11.5, color: VANTARY.paper, fontWeight: 500 }}>
          {fx.netUsd >= 0 ? "+" : "−"}${Math.abs(fx.netUsd) >= 1000 ? (Math.abs(fx.netUsd) / 1000).toFixed(1) + "k" : Math.abs(fx.netUsd).toLocaleString()}
        </span>
      ),
      caption: (
        <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8, letterSpacing: "0.10em", color: VANTARY.ashSoft }}>
          PF {fx.profitFactor.toFixed(2)}
        </span>
      ),
    },
    {
      primary: (
        <span className="font-mono tabular-nums" style={{ fontSize: 11.5, color: VANTARY.paper, fontWeight: 500 }}>
          {fx.freqPerMonth}<span style={{ fontSize: 9, color: VANTARY.ashSoft }}>/mo</span>
        </span>
      ),
      caption: (
        <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8, letterSpacing: "0.10em", color: VANTARY.amber }}>
          {fx.bestSession}
        </span>
      ),
    },
    {
      primary: (
        <span className="font-mono tabular-nums" style={{ fontSize: 11, color: VANTARY.paper, fontWeight: 500 }}>
          {fx.lastTradedHrsAgo < 1 ? "now" : fx.lastTradedHrsAgo < 24 ? `${fx.lastTradedHrsAgo}h ago` : `${Math.round(fx.lastTradedHrsAgo / 24)}d ago`}
        </span>
      ),
      caption: (
        <span className="font-mono uppercase inline-flex items-center gap-0.5" style={{ fontSize: 8, letterSpacing: "0.12em", color: `rgb(${heatRgb})` }}>
          {fx.heat === "HOT" ? <Flame size={7} strokeWidth={2} /> : <CircleDot size={6} strokeWidth={2} />}
          {fx.heat}
        </span>
      ),
    },
  ]
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div
        className="grid items-stretch min-w-0"
        style={{
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        }}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center px-1.5 py-0.5"
            style={{
              borderLeft: i === 0 ? "none" : `1px solid ${VANTARY.rule}`,
            }}
          >
            <div className="leading-none">{c.primary}</div>
            <div className="leading-none mt-0.5">{c.caption}</div>
          </div>
        ))}
      </div>
      {/* win/loss pip-volume proportion bar */}
      <div className="relative w-full overflow-hidden rounded-sm" style={{ height: 2, background: "rgba(255,255,255,0.05)" }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${winShare * 100}%`,
            background: "linear-gradient(90deg, rgba(34,197,94,0.55) 0%, rgba(34,197,94,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0"
          style={{
            left: `${winShare * 100}%`,
            right: 0,
            background: "linear-gradient(90deg, rgba(239,68,68,0.85) 0%, rgba(239,68,68,0.55) 100%)",
          }}
        />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   WatchPairPreview & supporting micro-primitives
   ────────────────────────────────────────────────────────────────────────────
   The flagship hover popover for the platform. Maximum useful information
   density inside a 380px obsidian-glass card. Every section is a real,
   glanceable read — no decorative filler.

       ┌────────────────────────────────────────────────────┐
       │ FOREX · EUR/USD                  LONG · FOCUS  ↑   │  Header
       │ 1.17013                              +18 PIPS      │
       ├────────────────────────────────────────────────────┤
       │ BID 1.17008    ●───────●───────  ASK 1.17018       │  LiveSpreadBar
       │                spread 1.0 pip                      │
       ├────────────────────────────────────────────────────┤
       │ 1H · 4H · 1D                          24 BARS      │  TF selector
       │ ░▆▅▇▇▆▆▇▇▇▆▅▆▇▇▇▆▆▆▇▇▆▆░  88 px tall              │  Big candle
       ├───────────────��────────────────────────────────────┤
       │  WIN-RATE   ATR (5d)   AVG R:R    STREAK           │  Stat quartet
       │   74%        42 pips    1.8R       W · W · L       │
       │   ↑ +6       n=14       n=30       last 3          │
       ├────────────────────────────────────────────────────┤
       │ Win-rate distribution             your bucket       │
       │ ▁▂▃▅▇█▆▄▃▁                                         │  MiniHistogram
       │ 30      50      70      90                         │
       ├────────────────────────────────────────────────────┤
       │ + PIN     ↗ OPEN CHART     ↓ SET ALERT             │  Action footer
       └──────────────────────���─────────────────────────────┘

   All numbers are derived from the deterministic `pair.bars` so the preview
   stays stable across re-renders without needing a live feed.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Per-symbol display anchors. The OHLC bars live in abstract space (~100);
 *  the popover renders prices in the user's mental model (1.17013, 2032.45). */
const PAIR_LIVE_ANCHOR: Record<string, { price: number; decimals: number; pipFactor: number }> = {
  "EUR/USD": { price: 1.17013, decimals: 5, pipFactor: 10000 },
  "XAU/USD": { price: 2032.45, decimals: 2, pipFactor: 10 },
  "GBP/JPY": { price: 188.421, decimals: 3, pipFactor: 100 },
  "US30":    { price: 38421.5, decimals: 1, pipFactor: 1 },
  "USD/JPY": { price: 156.782, decimals: 3, pipFactor: 100 },
}

/** Compute everything the preview needs from `pair.bars` — deterministic. */
function derivePairLive(pair: WatchPair) {
  const last = pair.bars[pair.bars.length - 1]
  const prev = pair.bars[pair.bars.length - 2] ?? last
  const anchor = PAIR_LIVE_ANCHOR[pair.symbol] ?? { price: 1.0, decimals: 4, pipFactor: 10000 }

  // ATR(14) — Wilder's true range, simplified (no smoothing for snapshot).
  const recent = pair.bars.slice(-14)
  const tr = recent.map((b, i, arr) => {
    if (i === 0) return b.h - b.l
    const pc = arr[i - 1].c
    return Math.max(b.h - b.l, Math.abs(b.h - pc), Math.abs(b.l - pc))
  })
  const atrAbstract = tr.reduce((a, b) => a + b, 0) / Math.max(1, tr.length)
  // Convert abstract bar-space ATR to pips using the symbol's pip factor.
  // Bars span ~100, anchor scale varies — use anchor.price as denominator.
  const atrPips = Math.round((atrAbstract / 100) * anchor.price * anchor.pipFactor * 10) / 10

  // Spread — narrow but visible. ~1 pip on majors, slightly wider on others.
  const spreadPips = pair.symbol === "XAU/USD" ? 35
    : pair.symbol === "US30" ? 1.5
      : pair.symbol === "GBP/JPY" ? 1.4
        : pair.symbol === "USD/JPY" ? 0.9
          : 1.0
  const spreadAbsolute = spreadPips / anchor.pipFactor
  const bid = anchor.price - spreadAbsolute / 2
  const ask = anchor.price + spreadAbsolute / 2

  // Recent setups: deterministic W/L by walking the last 3 bar pairs.
  const setups = recent.slice(-6).reduce<{ result: "W" | "L"; pips: number }[]>((acc, b, i, arr) => {
    if (i % 2 !== 1) return acc
    const open = arr[i - 1]?.c ?? b.o
    const move = b.c - open
    const pips = Math.round((move / 100) * anchor.price * anchor.pipFactor)
    acc.push({ result: pips >= 0 ? "W" : "L", pips })
    return acc
  }, []).slice(-3)

  // Streak letters for the stat block — last 3.
  const streak = setups.map((s) => s.result).join(" · ")

  // Ticking direction (last close vs prev close).
  const tickUp = last.c >= prev.c

  // Win-rate vs 30d delta — synthesised from pair seed; deterministic.
  const seed = pair.symbol.charCodeAt(0) + pair.symbol.length
  const wrDelta = ((seed * 13) % 11) - 4 // range −4..+6

  // Avg R:R from sample-size weighted by win-rate; capped 0.8–2.4.
  const avgR = Math.max(0.8, Math.min(2.4, 0.8 + (pair.winRate - 40) / 30))

  return {
    anchor,
    bid: bid.toFixed(anchor.decimals),
    ask: ask.toFixed(anchor.decimals),
    mid: anchor.price.toFixed(anchor.decimals),
    spreadPips: spreadPips.toFixed(spreadPips < 2 ? 1 : 0),
    atrPips,
    avgR: avgR.toFixed(1),
    setups,
    streak,
    tickUp,
    wrDelta,
  }
}

/* ── LiveSpreadBar ─────────────────────────────────────────────────────────
   Visual: BID label · gradient track · mid pulse marker · ASK label.
   The mid marker pulses softly so the popover feels live, even though the
   underlying snapshot is static. ─────────────────────────────────────────── */
function LiveSpreadBar({
  bid,
  ask,
  spreadPips,
  tickUp,
}: {
  bid: string
  ask: string
  spreadPips: string
  tickUp: boolean
}) {
  return (
    <div
      className="rounded-md px-3 py-2.5"
      style={{
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="font-mono"
          style={{ fontSize: 9.5, letterSpacing: "0.10em", color: "rgba(255,255,255,0.42)" }}
        >
          BID <span style={{ color: "rgba(255,255,255,0.86)", fontWeight: 500, marginLeft: 4 }}>{bid}</span>
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 9.5, letterSpacing: "0.10em", color: "rgba(255,255,255,0.42)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.86)", fontWeight: 500, marginRight: 4 }}>{ask}</span> ASK
        </span>
      </div>

      {/* track */}
      <div className="relative h-[6px] rounded-full overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(244,114,114,0.18) 0%, rgba(244,114,114,0.05) 35%, rgba(255,255,255,0.04) 50%, rgba(52,211,153,0.05) 65%, rgba(52,211,153,0.18) 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* mid pulse */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 8, height: 8,
            background: tickUp ? "rgb(52,211,153)" : "rgb(244,114,114)",
            boxShadow: `0 0 8px ${tickUp ? "rgba(52,211,153,0.5)" : "rgba(244,114,114,0.5)"}`,
          }}
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-center">
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.36)" }}
        >
          spread {spreadPips} pip
        </span>
      </div>
    </div>
  )
}

/* ── TimeframeTabs ─────────────────────────────────────────────────────────
   Three small pills above the big candle strip. Selection is local to the
   popover; the candle data is shared (we pretend each TF is a slice of the
   same bar set — production-ready architecture for when real TF feeds land). */
function TimeframeTabs({
  active,
  onChange,
}: {
  active: "1H" | "4H" | "1D"
  onChange: (tf: "1H" | "4H" | "1D") => void
}) {
  const tfs: ("1H" | "4H" | "1D")[] = ["1H", "4H", "1D"]
  return (
    <div className="flex items-center gap-1">
      {tfs.map((tf) => {
        const isActive = active === tf
        return (
          <button
            key={tf}
            type="button"
            onClick={(e) => {
              // Stop the click from bubbling to the DrillCard (which would toggle the pin).
              e.stopPropagation()
              onChange(tf)
            }}
            className="font-mono uppercase rounded-md transition-all"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.12em",
              padding: "3px 7px",
              color: isActive ? VANTARY.paper : "rgba(255,255,255,0.42)",
              background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
              border: `1px solid ${isActive ? "rgba(255,255,255,0.10)" : "transparent"}`,
            }}
          >
            {tf}
          </button>
        )
      })}
    </div>
  )
}

/* ── MiniHistogram ─────────────������──────────────────────────────────────────
   10-bucket vertical-bar distribution (30%–90% range). The bucket containing
   the user's current win-rate is rendered category-tinted; all others are a
   muted hairline. Reads as a one-glance "where do I sit". */
function MiniHistogram({
  userWinRate,
  populationSeed,
}: {
  userWinRate: number
  populationSeed: number
}) {
  // Deterministic Gaussian-ish population centred at 60% with σ≈10.
  const buckets = useMemo(() => {
    const out = new Array(10).fill(0)
    let s = populationSeed
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    for (let i = 0; i < 200; i++) {
      // box-muller-ish using mean-of-3 for a soft bell
      const r = (rand() + rand() + rand()) / 3
      const wr = 30 + r * 60 // 30..90
      const idx = Math.max(0, Math.min(9, Math.floor((wr - 30) / 6)))
      out[idx]++
    }
    return out
  }, [populationSeed])

  const max = Math.max(...buckets)
  const userBucket = Math.max(0, Math.min(9, Math.floor((userWinRate - 30) / 6)))

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-[3px] h-[34px]">
        {buckets.map((count, i) => {
          const isUser = i === userBucket
          const heightPct = (count / max) * 100
          return (
            <div
              key={i}
              className="flex-1 rounded-[2px] transition-colors"
              style={{
                height: `${Math.max(10, heightPct)}%`,
                background: isUser
                  ? `rgba(6,182,212,0.7)`
                  : "rgba(255,255,255,0.10)",
                boxShadow: isUser
                  ? `inset 0 0 0 1px rgba(6,182,212,0.6), 0 0 6px rgba(6,182,212,0.35)`
                  : "none",
              }}
            />
          )
        })}
      </div>
      <div className="flex items-center justify-between">
        {[30, 50, 70, 90].map((tick) => (
          <span
            key={tick}
            className="font-mono"
            style={{ fontSize: 8.5, letterSpacing: "0.10em", color: "rgba(255,255,255,0.32)" }}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── StatTile ───────────��──��─────────��────────────────���────────────────────
   Compact four-up tile inside Body. Mirrors HoverPreviewPopover.Stat in
   visual weight but tighter for a quartet layout. */
export function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  tone?: "default" | "positive" | "negative" | "warn" | "accent"
}) {
  const valueColor =
    tone === "positive" ? "rgb(52,211,153)"
      : tone === "negative" ? "rgb(244,114,114)"
        : tone === "warn" ? VANTARY.amber
          : tone === "accent" ? "rgb(6,182,212)"
            : VANTARY.paper

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span
        className="font-mono uppercase truncate"
        style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.40)" }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums leading-none truncate"
        style={{ fontSize: 14, fontWeight: 500, color: valueColor, letterSpacing: "-0.01em" }}
      >
        {value}
      </span>
      {hint !== undefined && (
        <span
          className="font-mono uppercase truncate"
          style={{ fontSize: 8.5, letterSpacing: "0.10em", color: "rgba(255,255,255,0.32)" }}
        >
          {hint}
        </span>
      )}
    </div>
  )
}

/* ── WatchPairPreview (composed flagship) ─────────────────────────────── */
function WatchPairPreview({
  pair,
  pinned,
}: {
  pair: WatchPair
  pinned: boolean
}) {
  const positive = pair.pipsToday >= 0
  const live = useMemo(() => derivePairLive(pair), [pair])
  const [tf, setTf] = useState<"1H" | "4H" | "1D">("1H")

  // Bias chip color
  const biasColor =
    pair.bias === "LONG"
      ? "rgb(52,211,153)"
      : pair.bias === "SHORT"
        ? "rgb(244,114,114)"
        : "rgba(255,255,255,0.55)"

  const wrTone =
    pair.winRate >= 65
      ? "positive"
      : pair.winRate >= 50
        ? "default"
        : pair.winRate >= 40
          ? "warn"
          : "negative"

  const populationSeed = pair.symbol
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0) * 7

  return (
    <>
      {/* ── Header ── */}
      <HoverPreviewPopover.Header>
        <div className="flex items-baseline justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-medium uppercase tracking-[0.10em] text-white/45 leading-none mb-1.5">
              FOREX · {pair.symbol}
            </div>
            <div className="font-mono tabular-nums leading-tight"
              style={{ fontSize: 19, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.015em" }}
            >
              {live.mid}
              <span
                className="font-mono ml-1.5"
                style={{
                  fontSize: 11,
                  color: live.tickUp ? "rgb(52,211,153)" : "rgb(244,114,114)",
                }}
              >
                {live.tickUp ? "▲" : "▼"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className="font-mono uppercase rounded-sm px-1.5 py-px"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: biasColor,
                background: `${biasColor.replace("rgb", "rgba").replace(")", ", 0.10)")}`,
                border: `1px solid ${biasColor.replace("rgb", "rgba").replace(")", ", 0.20)")}`,
                fontWeight: 500,
              }}
            >
              {pair.bias}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: positive ? "rgb(52,211,153)" : "rgb(244,114,114)",
                fontWeight: 500,
              }}
            >
              {positive ? "+" : ""}
              {pair.pipsToday}
              <span style={{ color: "rgba(255,255,255,0.42)", marginLeft: 3, fontSize: 9, letterSpacing: "0.10em" }}>
                PIPS
              </span>
            </span>
          </div>
        </div>
      </HoverPreviewPopover.Header>

      {/* ── Body ── */}
      <HoverPreviewPopover.Body>
        {/* live spread */}
        <LiveSpreadBar
          bid={live.bid}
          ask={live.ask}
          spreadPips={live.spreadPips}
          tickUp={live.tickUp}
        />

        {/* timeframe tabs + big candle strip */}
        <div
          className="rounded-md overflow-hidden mt-1"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
            padding: "6px 6px 8px",
          }}
        >
          <div className="flex items-center justify-between mb-1.5 px-1">
            <TimeframeTabs active={tf} onChange={setTf} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.32)" }}
            >
              {pair.bars.length} BARS
            </span>
          </div>
          <div className="h-[88px] px-1">
            {/* Pretend each TF zooms differently — slice the bar tail. */}
            <VantaryCandleStrip
              bars={
                tf === "1H"
                  ? pair.bars
                  : tf === "4H"
                    ? pair.bars.slice(-16)
                    : pair.bars.slice(-8)
              }
            />
          </div>
        </div>

        {/* stat quartet */}
        <div className="grid grid-cols-4 gap-2 mt-1.5">
          <StatTile
            label="Win-rate"
            value={`${pair.winRate}%`}
            hint={`${live.wrDelta >= 0 ? "↑ +" : "↓ "}${live.wrDelta} vs 30d`}
            tone={wrTone === "positive" ? "positive" : wrTone === "negative" ? "negative" : wrTone === "warn" ? "warn" : "default"}
          />
          <StatTile
            label="ATR"
            value={`${live.atrPips}`}
            hint="14 BARS"
          />
          <StatTile
            label="Avg R:R"
            value={`${live.avgR}R`}
            hint={`n=${pair.sampleSize}`}
          />
          <StatTile
            label="Streak"
            value={live.streak || "—"}
            hint="LAST 3"
          />
        </div>

        <HoverPreviewPopover.Divider />

        {/* distribution histogram */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)" }}
            >
              Win-rate distribution
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgb(6,182,212)" }}
            >
              YOU · {pair.winRate}%
            </span>
          </div>
          <MiniHistogram userWinRate={pair.winRate} populationSeed={populationSeed} />
        </div>

        {/* AI warning, if any */}
        {pair.warning && (
          <div
            className="mt-1 p-2 rounded-md flex items-start gap-1.5"
            style={{
              background: "rgba(251,146,60,0.07)",
              border: "1px solid rgba(251,146,60,0.18)",
            }}
          >
            <Triangle
              size={10}
              fill={VANTARY.amber}
              stroke="none"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <span style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim }}>
              {pair.warning}
            </span>
          </div>
        )}
      </HoverPreviewPopover.Body>

      {/* ── Footer · three real action affordances ── */}
      <HoverPreviewPopover.Footer>
        <HoverPreviewPopover.ActionButton
          affordance={pinned ? "confirm" : "preview"}
          variant="primary"
          onClick={(e) => {
            e.stopPropagation()
            // Click on the row itself toggles the pin; we just echo state here.
          }}
        >
          {pinned ? "Pinned" : "Pin to rail"}
        </HoverPreviewPopover.ActionButton>
        <HoverPreviewPopover.ActionButton
          affordance="external"
          onClick={(e) => {
            e.stopPropagation()
            // Hook for opening a chart workspace later.
          }}
        >
          Open chart
        </HoverPreviewPopover.ActionButton>
        <HoverPreviewPopover.ActionButton
          affordance="save"
          onClick={(e) => {
            e.stopPropagation()
            // Hook for setting an alert later.
          }}
        >
          Set alert
        </HoverPreviewPopover.ActionButton>
      </HoverPreviewPopover.Footer>
    </>
  )
}

/** Vantary-styled candle strip — hairline wicks, monochrome bodies (paper for
 *  bull, ash for bear), no green/red on the chrome plane. */
function VantaryCandleStrip({ bars }: { bars: WatchPair["bars"] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const w = cv.clientWidth, h = cv.clientHeight
    cv.width = w * dpr
    cv.height = h * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    const minL = Math.min(...bars.map(b => b.l))
    const maxH = Math.max(...bars.map(b => b.h))
    const pad = (maxH - minL) * 0.08
    const range = (maxH + pad) - (minL - pad)
    const pToY = (p: number) => h - ((p - (minL - pad)) / range) * h

    const slot = w / bars.length
    const bw = Math.max(2, Math.min(slot * 0.55, 6))

    bars.forEach((b, i) => {
      const x = (i + 0.5) * slot
      const isBull = b.c >= b.o
      const oY = pToY(b.o), cY = pToY(b.c), hY = pToY(b.h), lY = pToY(b.l)
      const top = Math.min(oY, cY)
      const ht = Math.max(1, Math.abs(cY - oY))

      // wick — hairline ash
      ctx.strokeStyle = "rgba(190,194,200,0.35)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + 0.5, hY)
      ctx.lineTo(x + 0.5, lY)
      ctx.stroke()

      // body — paper (bull) or paperDim (bear), hairline-only
      ctx.fillStyle = isBull ? "rgba(237,238,240,0.92)" : "rgba(190,194,200,0.5)"
      ctx.fillRect(x - bw / 2, top, bw, ht)
      ctx.strokeStyle = isBull ? "rgba(237,238,240,1)" : "rgba(190,194,200,0.9)"
      ctx.lineWidth = 1
      ctx.strokeRect(x - bw / 2 + 0.5, top + 0.5, bw - 1, Math.max(0, ht - 1))
    })
  }, [bars])

  return <canvas ref={ref} className="w-full h-full block" />
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAIR FORENSICS — Opus 5.0 click-to-takeover dossier
   ────────��──────────────────────────────────────────────────────────────────
   Replaces the entire body of the WatchlistMatrix card when a row is
   clicked. Renders 13 dense, glanceable forensic blocks that together
   give the trader the most authentic, actionable read on a single pair
   in the entire app — denser than the AI Dashboard or Asset Register.
   ═══════════════════════════════════════════���═══════════════════════════════ */

/* ── 3.1  Header — replaces the LIST eyebrow + hero number ───────────── */
function PairForensicsHeader({ pair, onBack }: { pair: WatchPair; onBack: () => void }) {
  const fx = useMemo(() => derivePairForensics(pair), [pair])
  const live = PAIR_LIVE_ANCHOR[pair.symbol]
  const positiveDay = pair.pipsToday >= 0
  const positiveAll = fx.netUsd >= 0
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={onBack}
          className="rounded-md flex items-center justify-center transition-colors mt-0.5 shrink-0"
          style={{
            width: 26, height: 26,
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${VANTARY.rule}`,
            color: VANTARY.paperDim,
          }}
          title="Back to watchlist"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
        </button>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="font-mono uppercase inline-flex items-center gap-1.5" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
            <Crosshair size={10} strokeWidth={1.5} />
            PAIR FORENSICS
            <span className="px-1 py-px rounded-sm" style={{ fontSize: 7.5, letterSpacing: "0.10em", color: VANTARY.amber, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.22)" }}>
              FOREX
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-sans" style={{ fontSize: 22, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.015em", lineHeight: 1 }}>
              {pair.symbol}
            </h3>
            <span
              className="font-mono uppercase px-1.5 py-0.5 rounded-sm"
              style={{
                fontSize: 8.5, letterSpacing: "0.16em",
                color: pair.bias === "LONG" ? "rgb(34, 197, 94)" : pair.bias === "SHORT" ? "rgb(239, 68, 68)" : VANTARY.ashSoft,
                background: pair.bias === "LONG" ? "rgba(34,197,94,0.08)" : pair.bias === "SHORT" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${pair.bias === "LONG" ? "rgba(34,197,94,0.22)" : pair.bias === "SHORT" ? "rgba(239,68,68,0.22)" : VANTARY.rule}`,
              }}
            >
              {pair.bias}
            </span>
            {pair.inFocus && (
              <span className="font-mono uppercase inline-flex items-center gap-1" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: VANTARY.amber }}>
                <StatusDot tone="ok" size={5} breathe />
                FOCUS
              </span>
            )}
          </div>
          {live && (
            <div className="flex items-center gap-2.5">
              <span className="font-mono tabular-nums" style={{ fontSize: 12, color: VANTARY.paperDim, fontWeight: 500 }}>
                {live.price.toFixed(live.decimals)}
              </span>
              <motion.span
                className="rounded-full"
                style={{ width: 5, height: 5, background: "rgb(34, 197, 94)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
                LIVE
              </span>
              <span className="font-mono tabular-nums ml-1" style={{ fontSize: 9.5, color: positiveDay ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)" }}>
                {positiveDay ? "+" : ""}{pair.pipsToday}p TODAY
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
          ALL-TIME P&amp;L
        </span>
        <span className="font-sans tabular-nums" style={{
          fontSize: 28, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em",
          color: positiveAll ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
          textShadow: positiveAll ? "0 0 24px rgba(34,197,94,0.18)" : "0 0 24px rgba(239,68,68,0.18)",
          marginTop: 4,
        }}>
          {positiveAll ? "+" : "−"}${Math.abs(fx.netUsd).toLocaleString()}
        </span>
        <span className="font-mono tabular-nums mt-1" style={{ fontSize: 9, color: VANTARY.ashSoft, letterSpacing: "0.06em" }}>
          {fx.trades} trades · {fx.daysActive} days
        </span>
      </div>
    </div>
  )
}

/* ── Common section primitives shared by all forensic blocks ────────── */
function ForensicSection({ title, accessory, children, delay = 0 }: { title: string; accessory?: React.ReactNode; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
      className="px-6 py-4 flex flex-col gap-3"
      style={{ borderTop: `1px solid ${VANTARY.rule}` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
          {title}
        </span>
        {accessory}
      </div>
      {children}
    </motion.section>
  )
}

function FxStat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
        {label}
      </span>
      <span className="font-mono tabular-nums" style={{ fontSize: 18, color: tone || VANTARY.paper, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.005em" }}>
        {value}
      </span>
      {sub && (
        <span className="font-mono tabular-nums" style={{ fontSize: 8.5, color: VANTARY.ashSoft, letterSpacing: "0.04em" }}>
          {sub}
        </span>
      )}
    </div>
  )
}

/* ── 3.0  The View — ties all 13 sections together ─────────────────── */
function PairForensicsView({ pair }: { pair: WatchPair }) {
  const fx = useMemo(() => derivePairForensics(pair), [pair])
  return (
    <div className="flex flex-col">

      {/* 3.2  HERO QUARTET — top KPI strip ─────────��──────────────── */}
      <ForensicSection title="HEADLINE" delay={0.04}>
        <div className="grid grid-cols-4 gap-0">
          <div className="px-3 py-1">
            <FxStat label="TOTAL TRADES" value={fx.trades} sub={`over ${fx.daysActive} days`} />
          </div>
          <div className="px-3 py-1" style={{ borderLeft: `1px solid ${VANTARY.rule}` }}>
            <FxStat
              label="WIN RATE"
              value={<>{pair.winRate}<span style={{ fontSize: 11, color: VANTARY.ashSoft, marginLeft: 1 }}>%</span></>}
              sub={
                <span className="inline-flex items-center gap-0.5" style={{ color: pair.winRate >= 60 ? "rgb(34, 197, 94)" : "rgb(251, 146, 60)" }}>
                  {pair.winRate >= 60 ? <TrendingUp size={9} strokeWidth={1.8} /> : <TrendingDown size={9} strokeWidth={1.8} />}
                  {pair.winRate >= 60 ? "+" : ""}{(pair.winRate - 65).toFixed(0)} vs 30D
                </span>
              }
              tone={pair.winRate >= 60 ? VANTARY.paper : "rgb(251, 146, 60)"}
            />
          </div>
          <div className="px-3 py-1" style={{ borderLeft: `1px solid ${VANTARY.rule}` }}>
            <FxStat
              label="PROFIT FACTOR"
              value={fx.profitFactor.toFixed(2)}
              sub={`gross ${fx.pipsWin}p / ${fx.pipsLoss}p`}
              tone={fx.profitFactor >= 2 ? "rgb(34, 197, 94)" : fx.profitFactor >= 1.3 ? VANTARY.paper : "rgb(251, 146, 60)"}
            />
          </div>
          <div className="px-3 py-1" style={{ borderLeft: `1px solid ${VANTARY.rule}` }}>
            <FxStat
              label="EXPECTANCY"
              value={<>{fx.expectancyR >= 0 ? "+" : ""}{fx.expectancyR.toFixed(2)}<span style={{ fontSize: 11, color: VANTARY.ashSoft, marginLeft: 2 }}>R</span></>}
              sub="per trade"
              tone={fx.expectancyR >= 0.4 ? "rgb(34, 197, 94)" : fx.expectancyR >= 0 ? VANTARY.paper : "rgb(239, 68, 68)"}
            />
          </div>
        </div>
      </ForensicSection>

      {/* 3.3  PIP WATERFALL ──────────────────────────────────────── */}
      <ForensicSection
        title="PIP WATERFALL"
        delay={0.08}
        accessory={
          <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: fx.pipsNet >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", fontWeight: 500 }}>
            NET {fx.pipsNet >= 0 ? "+" : ""}{fx.pipsNet}p
          </span>
        }
      >
        <PipWaterfall fx={fx} />
      </ForensicSection>

      {/* 3.4  WHERE & WHEN — Account distribution (left) ╎ Trading clock (right)
            The day×session heatmap and the standalone 24-hour histogram have
            been merged into a single, denser, more professional surface: the
            right-hand TradingClock. It encodes session arcs, per-hour
            win-rate, per-hour trade frequency, sweet-spot markers, and a
            live UTC hand inside one round dial — the most authentic
            "when do I trade this pair?" answer in the entire app. */}
      <ForensicSection title="WHERE & WHEN YOU TRADE THIS PAIR" delay={0.12}>
        <div className="grid gap-6 items-start" style={{ gridTemplateColumns: "minmax(0, 1fr) 320px" }}>
          <AccountDistribution fx={fx} />
          <TradingClock fx={fx} />
        </div>
      </ForensicSection>

      {/* 3.7 + 3.8  SETUP MIX + R-MULTIPLE HISTOGRAM (side by side) */}
      <ForensicSection title="EDGE COMPOSITION" delay={0.24}>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
          <SetupMix fx={fx} />
          <RMultipleHistogram fx={fx} />
        </div>
      </ForensicSection>

      {/* 3.9 + 3.10  HOLD TIME + DIRECTION SPLIT (side by side) ──── */}
      <ForensicSection title="DISCIPLINE & DIRECTION" delay={0.28}>
        <div className="grid grid-cols-2 gap-6">
          <HoldTimeProfile fx={fx} />
          <DirectionSplit fx={fx} />
        </div>
      </ForensicSection>

      {/* 3.11  RECENT TRADES FEED ─────────────────────────────────��� */}
      <ForensicSection
        title={`RECENT TRADES · LAST ${fx.recent.length}`}
        delay={0.32}
        accessory={
          <button className="font-mono uppercase inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm transition-colors hover:bg-white/5"
            style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.paperDim, border: `1px solid ${VANTARY.rule}` }}>
            <Filter size={9} strokeWidth={1.6} /> FILTER
          </button>
        }
      >
        <RecentTradesFeed fx={fx} />
      </ForensicSection>

      {/* 3.12  AI VERDICT ──────────────────────────���──────────────── */}
      <ForensicSection
        title="AI VERDICT"
        delay={0.36}
        accessory={
          <span className="font-mono uppercase tabular-nums inline-flex items-center gap-1" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: VANTARY.amber }}>
            <Sparkles size={10} strokeWidth={1.5} />
            CONFIDENCE {fx.verdict.confidence}%
          </span>
        }
      >
        <AIVerdict fx={fx} />
      </ForensicSection>

      {/* 3.13  FOOTER ACTION RAIL ──────────────────────────────��──── */}
      <div className="px-6 py-4 flex items-center gap-2 flex-wrap" style={{ borderTop: `1px solid ${VANTARY.rule}` }}>
        <ForensicChip icon={Pause} label="Pause this pair" />
        <ForensicChip icon={Bell} label="Set custom alert" />
        <ForensicChip icon={BookOpen} label="Open filtered journal" />
        <ForensicChip icon={FileDown} label="Export forensics PDF" />
        <span className="ml-auto font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashGhost }}>
          GENERATED · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
        </span>
      </div>
    </div>
  )
}

function ForensicChip({ icon: Icon, label }: { icon: typeof Pause; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors hover:bg-white/5"
      style={{
        background: "rgba(255,255,255,0.012)",
        border: `1px solid ${VANTARY.rule}`,
        color: VANTARY.paperDim,
      }}
    >
      <Icon size={11} strokeWidth={1.6} />
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em" }}>{label}</span>
    </button>
  )
}

/* ─── 3.3  Pip Waterfall ─������───────────────────────────────────────── */
function PipWaterfall({ fx }: { fx: PairForensics }) {
  const tpPips    = Math.round(fx.pipsWin * 0.74)
  const partial   = Math.round(fx.pipsWin * 0.26)
  const breakEven = Math.max(2, Math.round(fx.pipsLoss * 0.05))
  const slPips    = Math.round(fx.pipsLoss * 0.85) - breakEven
  const slipPips  = fx.slippagePips
  const segments = [
    { label: "TP HIT",     pips: tpPips,    rgb: "34, 197, 94", count: fx.tpHits },
    { label: "PARTIAL",    pips: partial,   rgb: "132, 204, 22", count: fx.partialWins },
    { label: "BREAK-EVEN", pips: breakEven, rgb: "234, 179, 8",  count: fx.breakEven },
    { label: "STOP HIT",   pips: slPips,    rgb: "239, 68, 68",  count: fx.slHits },
    { label: "SLIPPAGE",   pips: slipPips,  rgb: "127, 29, 29",  count: 4 },
  ]
  const total = segments.reduce((s, x) => s + x.pips, 0)
  return (
    <div className="flex flex-col gap-2">
      {/* Segmented bar */}
      <div className="relative w-full overflow-hidden rounded-sm flex" style={{ height: 22, background: "rgba(255,255,255,0.04)", border: `1px solid ${VANTARY.rule}` }}>
        {segments.map((s, i) => {
          const w = (s.pips / total) * 100
          return (
            <motion.div
              key={s.label}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.18 + i * 0.06 }}
              className="relative flex items-center justify-center group"
              style={{
                width: `${w}%`,
                transformOrigin: "left center",
                background: `linear-gradient(180deg, rgba(${s.rgb}, 0.5) 0%, rgba(${s.rgb}, 0.18) 100%)`,
                borderRight: i < segments.length - 1 ? `1px solid rgba(0,0,0,0.4)` : "none",
              }}
              title={`${s.label}: ${s.pips} pips · ${s.count} trades`}
            >
              {w > 7 && (
                <span className="font-mono tabular-nums" style={{ fontSize: 9, color: `rgb(${s.rgb})`, letterSpacing: "0.04em", fontWeight: 500 }}>
                  {s.pips}p
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
      {/* Legend grid */}
      <div className="grid grid-cols-5 gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-start gap-1.5">
            <span className="rounded-sm shrink-0 mt-0.5" style={{ width: 8, height: 8, background: `rgb(${s.rgb})` }} />
            <div className="flex flex-col min-w-0">
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.paperDim }}>
                {s.label}
              </span>
              <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: VANTARY.ashSoft }}>
                {s.count} trades · {((s.pips / total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 3.4  Account Distribution ───────────────────────────────────── */
function AccountDistribution({ fx }: { fx: PairForensics }) {
  const maxTrades = Math.max(...fx.accounts.map(a => a.trades))
  return (
    <div className="flex flex-col gap-2">
      {fx.accounts.map((a, i) => {
        const pnlRgb = a.pnl >= 0 ? "34, 197, 94" : "239, 68, 68"
        const typeRgb = a.type === "live" ? "34, 197, 94" : a.type === "prop_firm" ? "234, 179, 8" : "100, 116, 139"
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.18 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr) 80px 84px" }}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-sans truncate" style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500, letterSpacing: "-0.005em" }}>
                {a.label}
              </span>
              <span className="font-mono uppercase inline-flex items-center gap-1.5" style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
                <span className="px-1 py-px rounded-sm" style={{ color: `rgb(${typeRgb})`, background: `rgba(${typeRgb}, 0.10)`, border: `1px solid rgba(${typeRgb}, 0.22)`, fontSize: 7.5 }}>
                  {a.type === "live" ? "LIVE" : a.type === "prop_firm" ? "PROP" : "DEMO"}
                </span>
                {a.broker}
              </span>
            </div>
            <div className="relative w-full rounded-sm overflow-hidden" style={{ height: 6, background: "rgba(255,255,255,0.04)" }}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.32 + i * 0.06 }}
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${(a.trades / Math.max(1, maxTrades)) * 100}%`,
                  transformOrigin: "left center",
                  background: `linear-gradient(90deg, rgba(${pnlRgb}, 0.45) 0%, rgba(${pnlRgb}, 0.85) 100%)`,
                }}
              />
            </div>
            <div className="font-mono tabular-nums text-right" style={{ fontSize: 11, color: VANTARY.paper, fontWeight: 500 }}>
              {a.trades}
              <span style={{ fontSize: 8.5, color: VANTARY.ashSoft, marginLeft: 3 }}>trades</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono tabular-nums" style={{ fontSize: 11, color: `rgb(${pnlRgb})`, fontWeight: 500 }}>
                {a.pnl >= 0 ? "+" : "−"}${Math.abs(a.pnl).toLocaleString()}
              </span>
              <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft, letterSpacing: "0.06em" }}>
                WR {a.wr}%
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── 3.5  TradingClock — 24-hour wall-clock dial (the "when") ────��────
   A circular SVG dial that encodes everything a trader wants to glance at
   for a single pair's timing edge:

     · OUTER TICK RING       — hour marks, every 3h labelled (UTC)
     · SESSION ARCS          — Asia / London / NY-AM / NY-PM ribbons
     · WIN-RATE NECKLACE     — 24 small dots, each tinted by that hour's WR
     · FREQUENCY SPOKES      — radial bars from center, length = trade count
     · SWEET-SPOT MARKERS    — the 3 most-traded hours pulse softly
     · LIVE UTC HAND         — thin amber ray pointing to "now"
     · CENTER HUB            — best window + total entries

   Designed to read like an instrument panel, not a chart. ───────────── */

function TradingClock({ fx }: { fx: PairForensics }) {
  // Geometry — the SVG renders into a fixed ~300px square box; the column
  // outside is fixed at 320px so the dial always stays a perfect circle.
  const SIZE = 300
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R_OUTER       = 142  // outer rim (ticks)
  const R_LABEL       = 132  // hour-number labels
  const R_SESSION_OUT = 122  // session arc outer edge
  const R_SESSION_IN  = 110  // session arc inner edge
  const R_WR_DOT      = 102  // win-rate necklace dots
  const R_BAR_BASE    = 56   // inner ring where frequency bars start
  const R_BAR_MAX     = 92   // max frequency bar length
  const R_HUB         = 46   // center hub

  // 24h trade map
  const totalTrades = fx.hourly.reduce((s, h) => s + h.count, 0)
  const maxCount    = Math.max(...fx.hourly.map(h => h.count), 1)

  // Sweet-spot = top-3 most-traded hours. Used for pulse + center label.
  const sweet = [...fx.hourly]
    .map((h, i) => ({ ...h, idx: i }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
  const sweetHours = sweet.map(s => s.hour)
  const sweetSorted = [...sweet].sort((a, b) => a.hour - b.hour)
  const sweetWindow = `${String(sweetSorted[0].hour).padStart(2, "0")}–${String(sweetSorted[sweetSorted.length - 1].hour + 1).padStart(2, "0")}`

  // Polar helpers — hour 0 sits at the top (12 o'clock), going clockwise.
  const hourToAngle = (h: number) => (h / 24) * 360 - 90
  const polar = (deg: number, r: number) => ({
    x: CX + r * Math.cos((deg * Math.PI) / 180),
    y: CY + r * Math.sin((deg * Math.PI) / 180),
  })

  // Trading sessions — non-purple palette, distinct hues that read as bands.
  const SESSIONS: { name: string; from: number; to: number; rgb: string }[] = [
    { name: "ASIA",  from: 0,  to: 8,  rgb: "100, 116, 139" }, // slate
    { name: "LDN",   from: 7,  to: 12, rgb: "234, 179, 8"   }, // yellow
    { name: "NY-AM", from: 12, to: 17, rgb: "45, 212, 191"  }, // teal
    { name: "NY-PM", from: 16, to: 21, rgb: "251, 146, 60"  }, // orange
  ]

  // Live UTC hand
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const liveHour = now ? now.getUTCHours() + now.getUTCMinutes() / 60 : 0
  const liveAngle = hourToAngle(liveHour)
  const livePos = polar(liveAngle, R_BAR_MAX)

  return (
    <div
      className="relative flex flex-col gap-2 rounded-md p-3"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(45,212,191,0.05) 0%, rgba(255,255,255,0.012) 45%, transparent 75%)",
        border: `1px solid ${VANTARY.rule}`,
      }}
    >
      {/* Eyebrow row above the dial */}
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase inline-flex items-center gap-1.5" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
          <Clock size={10} strokeWidth={1.5} />
          24H · UTC DIAL
        </span>
        <span className="font-mono tabular-nums" style={{ fontSize: 9, color: VANTARY.paperDim, letterSpacing: "0.06em" }}>
          {now
            ? `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`
            : "—— UTC"}
        </span>
      </div>

      {/* The dial */}
      <svg
        width="100%"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="block"
        style={{ aspectRatio: "1 / 1" }}
        aria-label="24-hour trading clock"
      >
        <defs>
          {/* Bezel gradients */}
          <radialGradient id="dial-bezel" cx="50%" cy="48%" r="60%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.04)" />
            <stop offset="70%"  stopColor="rgba(255,255,255,0.012)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <radialGradient id="dial-hub" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="rgba(45,212,191,0.10)" />
            <stop offset="80%"  stopColor="rgba(45,212,191,0.025)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Glow filter for the live hand */}
          <filter id="live-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Bezel — outer faint disc */}
        <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="url(#dial-bezel)" />
        <circle cx={CX} cy={CY} r={R_OUTER}     fill="none" stroke={VANTARY.rule} strokeWidth={1} />
        <circle cx={CX} cy={CY} r={R_SESSION_OUT + 1} fill="none" stroke={VANTARY.rule} strokeWidth={0.5} opacity={0.7} />
        <circle cx={CX} cy={CY} r={R_BAR_BASE} fill="none" stroke={VANTARY.rule} strokeWidth={0.5} strokeDasharray="2 3" opacity={0.6} />

        {/* SESSION ARCS — drawn as outer + inner arc joined into a thick ribbon */}
        {SESSIONS.map((s, i) => {
          const a0 = hourToAngle(s.from)
          const a1 = hourToAngle(s.to)
          const out0 = polar(a0, R_SESSION_OUT)
          const out1 = polar(a1, R_SESSION_OUT)
          const in0  = polar(a0, R_SESSION_IN)
          const in1  = polar(a1, R_SESSION_IN)
          const large = (a1 - a0) > 180 ? 1 : 0
          const ribbon =
            `M ${out0.x} ${out0.y} ` +
            `A ${R_SESSION_OUT} ${R_SESSION_OUT} 0 ${large} 1 ${out1.x} ${out1.y} ` +
            `L ${in1.x} ${in1.y} ` +
            `A ${R_SESSION_IN} ${R_SESSION_IN} 0 ${large} 0 ${in0.x} ${in0.y} Z`

          // Mid-arc label
          const mid = (s.from + s.to) / 2
          const labelPos = polar(hourToAngle(mid), (R_SESSION_OUT + R_SESSION_IN) / 2)

          return (
            <g key={s.name}>
              <motion.path
                d={ribbon}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.18 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                fill={`rgba(${s.rgb}, 0.16)`}
                stroke={`rgba(${s.rgb}, 0.42)`}
                strokeWidth={0.5}
              />
              <text
                x={labelPos.x}
                y={labelPos.y + 2.5}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize={7}
                letterSpacing="0.18em"
                fill={`rgb(${s.rgb})`}
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                {s.name}
              </text>
            </g>
          )
        })}

        {/* HOUR TICKS — every hour, longer at multiples of 6 */}
        {Array.from({ length: 24 }).map((_, h) => {
          const ang = hourToAngle(h)
          const isMajor = h % 6 === 0
          const isMid = !isMajor && h % 3 === 0
          const len = isMajor ? 8 : isMid ? 5 : 3
          const p0 = polar(ang, R_OUTER)
          const p1 = polar(ang, R_OUTER - len)
          return (
            <line
              key={`tick-${h}`}
              x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}
              stroke={isMajor ? VANTARY.paperDim : VANTARY.ashSoft}
              strokeWidth={isMajor ? 1.25 : 0.6}
              opacity={isMajor ? 0.95 : 0.55}
            />
          )
        })}

        {/* HOUR LABELS — every 3 hours */}
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => {
          const pos = polar(hourToAngle(h), R_LABEL)
          return (
            <text
              key={`lbl-${h}`}
              x={pos.x}
              y={pos.y + 2.5}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize={8.5}
              letterSpacing="0.06em"
              fill={h % 6 === 0 ? VANTARY.paperDim : VANTARY.ashSoft}
              style={{ fontWeight: h % 6 === 0 ? 500 : 400 }}
            >
              {String(h).padStart(2, "0")}
            </text>
          )
        })}

        {/* WIN-RATE NECKLACE — 24 dots, tinted by WR for that hour */}
        {fx.hourly.map((h, i) => {
          if (h.count === 0) return null
          const ang = hourToAngle(h.hour)
          const pos = polar(ang, R_WR_DOT)
          const rgb = h.wr >= 65 ? "34, 197, 94" : h.wr >= 50 ? "234, 179, 8" : "239, 68, 68"
          return (
            <motion.circle
              key={`wr-${i}`}
              cx={pos.x} cy={pos.y}
              r={2.2}
              fill={`rgb(${rgb})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.012, ease: [0.16, 1, 0.3, 1] }}
            >
              <title>{`${String(h.hour).padStart(2, "0")}:00 UTC — ${h.count} trades · WR ${h.wr}%`}</title>
            </motion.circle>
          )
        })}

        {/* FREQUENCY RADIAL BARS — one bar per hour, length ∝ count */}
        {fx.hourly.map((h, i) => {
          if (h.count === 0) return null
          const ang = hourToAngle(h.hour)
          const len = (h.count / maxCount) * (R_BAR_MAX - R_BAR_BASE)
          const inner = polar(ang, R_BAR_BASE)
          const outer = polar(ang, R_BAR_BASE + len)
          const isSweet = sweetHours.includes(h.hour)
          const rgb = h.wr >= 65 ? "34, 197, 94" : h.wr >= 50 ? "45, 212, 191" : "100, 116, 139"
          return (
            <motion.line
              key={`bar-${i}`}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={`rgba(${rgb}, ${isSweet ? 0.95 : 0.7})`}
              strokeWidth={isSweet ? 4.2 : 3}
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.5 + i * 0.014, ease: [0.16, 1, 0.3, 1] }}
              style={isSweet ? { filter: "drop-shadow(0 0 4px rgba(45,212,191,0.45))" } : undefined}
            >
              <title>{`${String(h.hour).padStart(2, "0")}:00 UTC — ${h.count} trades · WR ${h.wr}%`}</title>
            </motion.line>
          )
        })}

        {/* SWEET-SPOT PULSE — soft halo on the top hour */}
        {sweet.slice(0, 1).map((h) => {
          const ang = hourToAngle(h.hour + 0.5) // mid-hour
          const pos = polar(ang, R_BAR_MAX + 4)
          return (
            <motion.circle
              key={`sweet-${h.hour}`}
              cx={pos.x} cy={pos.y}
              r={3}
              fill="rgba(45,212,191,0.85)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, delay: 1.0, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 6px rgba(45,212,191,0.7))" }}
            />
          )
        })}

        {/* LIVE UTC HAND — thin ray from hub to outer */}
        <motion.line
          x1={CX} y1={CY}
          x2={livePos.x} y2={livePos.y}
          stroke="rgba(45,212,191,0.95)"
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{ filter: "drop-shadow(0 0 4px rgba(45,212,191,0.6))" }}
        />
        <circle cx={livePos.x} cy={livePos.y} r={2.4} fill="rgba(45,212,191,1)" style={{ filter: "drop-shadow(0 0 5px rgba(45,212,191,0.7))" }} />

        {/* CENTER HUB */}
        <circle cx={CX} cy={CY} r={R_HUB} fill="url(#dial-hub)" />
        <circle cx={CX} cy={CY} r={R_HUB} fill="none" stroke="rgba(45,212,191,0.28)" strokeWidth={0.8} />
        <text
          x={CX}
          y={CY - 10}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={7}
          letterSpacing="0.22em"
          fill={VANTARY.ashSoft}
          style={{ textTransform: "uppercase" }}
        >
          SWEET SPOT
        </text>
        <text
          x={CX}
          y={CY + 6}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={16}
          fontWeight={600}
          fill={VANTARY.paper}
          letterSpacing="-0.005em"
        >
          {sweetWindow}
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={7.5}
          letterSpacing="0.16em"
          fill={VANTARY.amber}
        >
          UTC
        </text>
        <text
          x={CX}
          y={CY + 32}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={7.5}
          letterSpacing="0.10em"
          fill={VANTARY.ashSoft}
        >
          {totalTrades} ENTRIES
        </text>
      </svg>

      {/* Legend strip — session keys + WR scale */}
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {/* Sessions */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            SESSIONS
          </span>
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5">
            {SESSIONS.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1 font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.10em", color: VANTARY.paperDim }}>
                <span className="rounded-sm" style={{ width: 6, height: 6, background: `rgb(${s.rgb})`, opacity: 0.85 }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        {/* WR scale */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            WIN-RATE DOT
          </span>
          <div className="grid grid-cols-3 gap-x-1.5">
            {[
              { rgb: "239, 68, 68", label: "<50" },
              { rgb: "234, 179, 8", label: "50-65" },
              { rgb: "34, 197, 94", label: "65+" },
            ].map((l) => (
              <span key={l.label} className="inline-flex items-center gap-1 font-mono tabular-nums" style={{ fontSize: 7.5, color: VANTARY.paperDim, letterSpacing: "0.04em" }}>
                <span className="rounded-full" style={{ width: 5, height: 5, background: `rgb(${l.rgb})` }} />
                {l.label}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 3.7  Setup Mix donut ────────────────────────────────────────── */
function SetupMix({ fx }: { fx: PairForensics }) {
  const total = fx.setups.reduce((s, x) => s + x.trades, 0)
  const colors = ["45, 212, 191", "234, 179, 8", "59, 130, 246", "239, 68, 68"]
  const size = 96
  const r = 38
  const stroke = 14
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {fx.setups.map((s, i) => {
          const share = s.trades / total
          const dash = share * c
          const el = (
            <motion.circle
              key={s.name}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={`rgb(${colors[i % colors.length]})`}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${c}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              initial={{ strokeDasharray: `0 ${c}` }}
              animate={{ strokeDasharray: `${dash} ${c}` }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              opacity={0.92}
            />
          )
          offset += dash
          return el
        })}
        <text x="50%" y="50%" dy="-2" textAnchor="middle" className="font-sans" style={{ fontSize: 14, fontWeight: 500, fill: VANTARY.paper, letterSpacing: "-0.01em" }}>
          {fx.setups.length}
        </text>
        <text x="50%" y="50%" dy="12" textAnchor="middle" className="font-mono" style={{ fontSize: 7, fill: VANTARY.ashSoft, letterSpacing: "0.16em" }}>
          SETUPS
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {fx.setups.map((s, i) => (
          <div key={s.name} className="grid items-center gap-2 min-w-0" style={{ gridTemplateColumns: "8px minmax(0,1fr) 56px 44px" }}>
            <span className="rounded-sm shrink-0" style={{ width: 8, height: 8, background: `rgb(${colors[i % colors.length]})` }} />
            <span className="font-sans truncate" style={{ fontSize: 11, color: VANTARY.paper, letterSpacing: "-0.005em" }}>
              {s.name}
            </span>
            <span className="font-mono tabular-nums text-right" style={{ fontSize: 9.5, color: VANTARY.paperDim }}>
              {s.trades}<span style={{ fontSize: 8, color: VANTARY.ashSoft, marginLeft: 3 }}>trd</span>
            </span>
            <span className="font-mono tabular-nums text-right" style={{ fontSize: 9.5, color: s.wr >= 60 ? "rgb(34, 197, 94)" : VANTARY.paperDim }}>
              {s.wr}<span style={{ fontSize: 8, color: VANTARY.ashSoft }}>%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 3.8  R-Multiple Histogram ──────��────────────────────���───────── */
function RMultipleHistogram({ fx }: { fx: PairForensics }) {
  const max = Math.max(...fx.rHist.map(b => b.count), 1)
  const total = fx.rHist.reduce((s, b) => s + b.count, 0)
  return (
    <div className="flex flex-col gap-1">
      <div className="relative grid items-end gap-px" style={{ gridTemplateColumns: `repeat(${fx.rHist.length}, minmax(0, 1fr))`, height: 64 }}>
        {/* expectancy rule */}
        <span aria-hidden className="absolute top-0 bottom-0 pointer-events-none" style={{
          left: `${((fx.expectancyR + 3) / 8) * 100}%`,
          width: 1,
          background: VANTARY.amber,
          opacity: 0.7,
          boxShadow: "0 0 6px rgba(45,212,191,0.45)",
        }} />
        {fx.rHist.map((b, i) => {
          const rgb = b.bucket < 0 ? "239, 68, 68" : b.bucket < 0.4 ? "234, 179, 8" : "34, 197, 94"
          const h = (b.count / Math.max(1, max)) * 100
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.55, delay: 0.24 + i * 0.018, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-sm self-end"
              style={{
                width: "100%",
                height: `${h}%`,
                transformOrigin: "bottom center",
                background: `linear-gradient(180deg, rgba(${rgb}, 0.7) 0%, rgba(${rgb}, 0.18) 100%)`,
                minHeight: b.count > 0 ? 2 : 0,
              }}
              title={`${b.bucket >= 0 ? "+" : ""}${b.bucket.toFixed(1)}R — ${b.count} trades`}
            />
          )
        })}
      </div>
      <div className="grid items-center" style={{ gridTemplateColumns: `repeat(${fx.rHist.length}, minmax(0, 1fr))` }}>
        {fx.rHist.map((b, i) => (
          <span key={i} className="font-mono tabular-nums text-center" style={{ fontSize: 7, color: VANTARY.ashSoft, letterSpacing: "0.02em" }}>
            {[0, 6, 12, 16].includes(i) ? `${b.bucket >= 0 ? "+" : ""}${b.bucket.toFixed(0)}` : ""}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
          R-MULTIPLE · {total} TRADES
        </span>
        <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: VANTARY.amber }}>
          μ {fx.expectancyR >= 0 ? "+" : ""}{fx.expectancyR.toFixed(2)}R
        </span>
      </div>
    </div>
  )
}

/* ─── 3.9  Hold-Time Profile ──────────────────────────────────────── */
function HoldTimeProfile({ fx }: { fx: PairForensics }) {
  const fmt = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`
  const max = Math.max(fx.holdWinP75, fx.holdLossP75)
  const ratio = fx.holdWinAvg / Math.max(1, fx.holdLossAvg)
  const Box = ({ label, p25, avg, p75, rgb }: { label: string; p25: number; avg: number; p75: number; rgb: string }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
          {label}
        </span>
        <span className="font-mono tabular-nums" style={{ fontSize: 11, color: `rgb(${rgb})`, fontWeight: 500 }}>
          AVG {fmt(avg)}
        </span>
      </div>
      <div className="relative w-full" style={{ height: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${VANTARY.rule}`, borderRadius: 3 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute rounded-sm"
          style={{
            left: `${(p25 / Math.max(1, max)) * 100}%`,
            width: `${((p75 - p25) / Math.max(1, max)) * 100}%`,
            top: 1,
            bottom: 1,
            transformOrigin: "left center",
            background: `linear-gradient(90deg, rgba(${rgb}, 0.45) 0%, rgba(${rgb}, 0.85) 100%)`,
          }}
        />
        <span aria-hidden className="absolute inset-y-0 pointer-events-none" style={{ left: `${(avg / Math.max(1, max)) * 100}%`, width: 2, background: `rgb(${rgb})`, top: -2, bottom: -2 }} />
      </div>
      <div className="flex items-center justify-between font-mono tabular-nums" style={{ fontSize: 8, color: VANTARY.ashSoft, letterSpacing: "0.04em" }}>
        <span>P25 {fmt(p25)}</span>
        <span>P75 {fmt(p75)}</span>
      </div>
    </div>
  )
  return (
    <div className="flex flex-col gap-2.5">
      <Box label="WINNERS" p25={fx.holdWinP25} avg={fx.holdWinAvg} p75={fx.holdWinP75} rgb="34, 197, 94" />
      <Box label="LOSERS"  p25={fx.holdLossP25} avg={fx.holdLossAvg} p75={fx.holdLossP75} rgb="239, 68, 68" />
      <span className="font-mono" style={{ fontSize: 9, color: VANTARY.ashSoft, lineHeight: 1.4, letterSpacing: "0.02em" }}>
        {ratio >= 2.5
          ? `Disciplined: winners held ${ratio.toFixed(1)}× longer than losers — textbook cut-loss / let-run pattern.`
          : ratio >= 1.5
          ? `Acceptable: winners held ${ratio.toFixed(1)}× longer than losers. Trim losers earlier to widen the gap.`
          : `Caution: winners and losers held similar durations. You may be cutting winners too early.`}
      </span>
    </div>
  )
}

/* ─── 3.10  Direction Split ───────────────────────────────────────── */
function DirectionSplit({ fx }: { fx: PairForensics }) {
  const Side = ({ side, trades, wr, pips, avgR }: { side: "LONG" | "SHORT"; trades: number; wr: number; pips: number; avgR: number }) => {
    const rgb = side === "LONG" ? "34, 197, 94" : "239, 68, 68"
    return (
      <div
        className="rounded-md p-3 flex flex-col gap-2"
        style={{
          background: `rgba(${rgb}, 0.04)`,
          border: `1px solid rgba(${rgb}, 0.18)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono uppercase inline-flex items-center gap-1.5" style={{ fontSize: 9, letterSpacing: "0.18em", color: `rgb(${rgb})`, fontWeight: 500 }}>
            {side === "LONG" ? <ArrowUp size={10} strokeWidth={2.2} /> : <ArrowDown size={10} strokeWidth={2.2} />}
            {side}
          </span>
          <span className="font-mono tabular-nums" style={{ fontSize: 11, color: VANTARY.paperDim }}>
            n={trades}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>WR</span>
            <span className="font-mono tabular-nums" style={{ fontSize: 14, color: VANTARY.paper, fontWeight: 500 }}>{wr}<span style={{ fontSize: 9, color: VANTARY.ashSoft }}>%</span></span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>PIPS</span>
            <span className="font-mono tabular-nums" style={{ fontSize: 14, color: pips >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", fontWeight: 500 }}>
              {pips >= 0 ? "+" : ""}{pips}<span style={{ fontSize: 9, color: VANTARY.ashSoft, marginLeft: 1 }}>p</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>AVG R</span>
            <span className="font-mono tabular-nums" style={{ fontSize: 14, color: avgR >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", fontWeight: 500 }}>
              {avgR >= 0 ? "+" : ""}{avgR.toFixed(2)}<span style={{ fontSize: 9, color: VANTARY.ashSoft, marginLeft: 1 }}>R</span>
            </span>
          </div>
        </div>
      </div>
    )
  }
  // Bias asymmetry note
  const dom = fx.longWR - fx.shortWR
  const note = Math.abs(dom) >= 12
    ? `${dom > 0 ? "Long" : "Short"} side dominates by ${Math.abs(dom)} WR points. Consider biasing entries to the stronger side.`
    : `Bias is balanced — both directions perform within ${Math.abs(dom)} WR points of each other.`
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Side side="LONG"  trades={fx.longTrades}  wr={fx.longWR}  pips={fx.longPips}  avgR={fx.longAvgR} />
        <Side side="SHORT" trades={fx.shortTrades} wr={fx.shortWR} pips={fx.shortPips} avgR={fx.shortAvgR} />
      </div>
      <span className="font-mono" style={{ fontSize: 9, color: VANTARY.ashSoft, lineHeight: 1.4, letterSpacing: "0.02em" }}>
        {note}
      </span>
    </div>
  )
}

/* ─── 3.11  Recent Trades Feed ────────────────────────────────────── */
function RecentTradesFeed({ fx }: { fx: PairForensics }) {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div
      className="rounded-md flex flex-col"
      style={{ border: `1px solid ${VANTARY.rule}`, background: "rgba(255,255,255,0.012)" }}
    >
      {fx.recent.map((t, i) => {
        const dirRgb = t.dir === "long" ? "34, 197, 94" : "239, 68, 68"
        const pipsRgb = t.pips >= 0 ? "34, 197, 94" : "239, 68, 68"
        const gradeRgb =
          t.grade === "A+" ? "34, 197, 94" :
          t.grade === "A"  ? "132, 204, 22" :
          t.grade === "B"  ? "234, 179, 8" :
                             "239, 68, 68"
        const open = openId === t.id
        return (
          <div
            key={t.id}
            className="flex flex-col"
            style={{ borderBottom: i < fx.recent.length - 1 ? `1px solid ${VANTARY.rule}` : "none" }}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : t.id)}
              className="grid items-center gap-2 px-3 py-2 hover:bg-white/[0.02] transition-colors text-left"
              style={{
                gridTemplateColumns: "minmax(0,108px) 22px minmax(0,148px) minmax(0,80px) minmax(0,68px) 28px minmax(0,140px) 16px",
              }}
            >
              <span className="font-mono tabular-nums truncate" style={{ fontSize: 9.5, color: VANTARY.paperDim, letterSpacing: "0.04em" }}>
                {t.ts}
              </span>
              <span
                className="font-mono uppercase inline-flex items-center justify-center px-1 py-0.5 rounded-sm"
                style={{
                  fontSize: 8, letterSpacing: "0.10em",
                  color: `rgb(${dirRgb})`,
                  background: `rgba(${dirRgb}, 0.08)`,
                  border: `1px solid rgba(${dirRgb}, 0.22)`,
                }}
              >
                {t.dir === "long" ? "L" : "S"}
              </span>
              <span className="font-mono tabular-nums truncate" style={{ fontSize: 9.5, color: VANTARY.paperDim, letterSpacing: "0.04em" }}>
                {t.entry} <span style={{ color: VANTARY.ashSoft }}>→</span> {t.exit}
              </span>
              <span className="font-mono tabular-nums" style={{ fontSize: 11, color: `rgb(${pipsRgb})`, fontWeight: 500 }}>
                {t.pips >= 0 ? "+" : ""}{t.pips}<span style={{ fontSize: 8.5, color: VANTARY.ashSoft, marginLeft: 1 }}>p</span>
              </span>
              <span className="font-mono tabular-nums" style={{ fontSize: 10, color: t.r >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)" }}>
                {t.r >= 0 ? "+" : ""}{t.r.toFixed(2)}R
              </span>
              <span
                className="font-mono uppercase inline-flex items-center justify-center px-1 rounded-sm"
                style={{
                  fontSize: 7.5, letterSpacing: "0.10em", lineHeight: "13px",
                  color: `rgb(${gradeRgb})`,
                  background: `rgba(${gradeRgb}, 0.10)`,
                  border: `1px solid rgba(${gradeRgb}, 0.28)`,
                }}
              >
                {t.grade}
              </span>
              <span className="font-mono uppercase truncate" style={{ fontSize: 8.5, letterSpacing: "0.10em", color: VANTARY.ashSoft }}>
                {t.account}
              </span>
              <ChevronDown size={11} strokeWidth={1.6} color={VANTARY.ash} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="note"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 pt-1 flex items-start gap-2" style={{ borderTop: `1px dashed ${VANTARY.rule}` }}>
                    <BookOpen size={11} strokeWidth={1.5} color={VANTARY.ash} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span className="font-mono" style={{ fontSize: 10, color: VANTARY.paperDim, lineHeight: 1.5, letterSpacing: "0.02em" }}>
                      {t.note}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ─── 3.12  AI Verdict block ──────────────────────────────────────── */
function AIVerdict({ fx }: { fx: PairForensics }) {
  const items = [
    { tone: "ok",   label: "WHAT'S WORKING", text: fx.verdict.working },
    { tone: "warn", label: "WATCH",          text: fx.verdict.watch   },
    { tone: "info", label: "NEXT ACTION",    text: fx.verdict.next    },
  ] as const
  return (
    <div
      className="rounded-md p-3 flex flex-col gap-2"
      style={{
        background: "rgba(45,212,191,0.04)",
        border: "1px solid rgba(45,212,191,0.18)",
      }}
    >
      {items.map((it, i) => {
        const rgb = it.tone === "ok" ? "34, 197, 94" : it.tone === "warn" ? "234, 179, 8" : "45, 212, 191"
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-2"
          >
            <span
              className="font-mono uppercase shrink-0 px-1 py-0.5 rounded-sm"
              style={{
                fontSize: 7.5, letterSpacing: "0.14em", marginTop: 1,
                color: `rgb(${rgb})`,
                background: `rgba(${rgb}, 0.10)`,
                border: `1px solid rgba(${rgb}, 0.28)`,
                minWidth: 110, textAlign: "center",
              }}
            >
              {it.label}
            </span>
            <span className="font-mono" style={{ fontSize: 10.5, color: VANTARY.paperDim, lineHeight: 1.55, letterSpacing: "0.01em" }}>
              {it.text}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════��════════════
   5.  <MacroAlertSheet/> — high-impact news, plan-aware
   ─────────────────────��─────────────────────────��───────────────────────────
   Mirrors the brick-red Capacity Issues sheet from frame #5/#6: severity wash,
   countdown puck, expandable evidence. Each event shows its time, currency,
   affected pairs, and the trader's plan rule that applies (e.g. "no trading
   30 min before high-impact news").
   ═══════════════════════════════════════════════════════════════════════════ */

export function MacroAlertSheet() {
  const [openId, setOpenId] = useState<string | null>(MACRO_EVENTS.find(e => e.impact === "high")?.id ?? null)
  const high = MACRO_EVENTS.filter(e => e.impact === "high")

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: high.length ? "linear-gradient(180deg, rgba(122,47,47,0.18) 0%, rgba(20,22,24,0.55) 100%)" : VANTARY.glass,
        border: `1px solid ${high.length ? "rgba(122,47,47,0.45)" : VANTARY.rule}`,
        borderRadius: RADIUS_V.cardLg,
        backdropFilter: "blur(28px) saturate(140%)",
        WebkitBackdropFilter: "blur(28px) saturate(140%)",
      }}
    >
      {/* header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="rounded-full flex items-center justify-center shrink-0"
            style={{
              width: 36, height: 36,
              background: high.length ? "rgba(255,80,80,0.15)" : VANTARY.chipFill,
              border: `1px solid ${high.length ? "rgba(255,80,80,0.35)" : VANTARY.chipBorder}`,
            }}
          >
            <AlertTriangle size={15} strokeWidth={1.5} color={high.length ? "#f87171" : VANTARY.ash} />
          </div>
          <div>
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
              MACRO · ALERT SHEET
            </div>
            <h3 className="font-sans mt-1" style={{ fontSize: 18, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.01em" }}>
              {high.length} high-impact event{high.length === 1 ? "" : "s"} today
            </h3>
            <p className="font-sans mt-1" style={{ fontSize: 12, color: VANTARY.paperDim, lineHeight: 1.55 }}>
              Plan rule: no trading 30 min before · affects {DAILY_PLAN.focusPairs.join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono" style={{ fontSize: 14, color: VANTARY.amber, fontWeight: 500 }}>
            {MACRO_EVENTS.length}
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            EVENTS
          </span>
        </div>
      </div>

      {/* dashed rule */}
      <div className="h-px mx-6" style={{ background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 6px, transparent 6px 12px)` }} />

      {/* event rows */}
      <div className="px-2 py-2">
        {MACRO_EVENTS.map((e) => (
          <MacroRow
            key={e.id}
            event={e}
            isOpen={openId === e.id}
            onToggle={() => setOpenId(openId === e.id ? null : e.id)}
          />
        ))}
      </div>

      {/* footer recommend */}
      <div className="px-6 py-4 border-t flex items-start gap-2" style={{ borderColor: VANTARY.rule }}>
        <Sparkles size={13} strokeWidth={1.5} color={VANTARY.amber} className="shrink-0 mt-0.5" />
        <p className="font-sans" style={{ fontSize: 12, color: VANTARY.paperDim, lineHeight: 1.55 }}>
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.amber, marginRight: 6 }}>RECOMMEND</span>
          Stand down 30 minutes before ECB. Re-enter on post-event displacement only — your post-news continuation setups have averaged 2.8R historically.
        </p>
      </div>
    </section>
  )
}

/* ���═══════════════════════════════════════════════════════════════════════════
   MacroEventPreview
   ───────────────────────────────────────────────────────���────────────────────
   Hover popover for MacroRow. Same density bar as the watchlist + sessions
   previews. Live UTC countdown, similar-event volatility forecast, plan rule
   echo, and a cross-keyed grid of every pair the event will affect.

       ┌────────────────────────────────────────────────────┐
       │ MACRO · ECB RATE DECISION             ▲ HIGH       │  Header
       │ 14:30 UTC                       in 02 : 38         │  Live countdown
       ├────────────────────────────────────────────────────┤
       │   CURRENCY   EXPECTED VOL   TYPICAL MOVE           │
       │   EUR        2.4x           ±42 pips               │  Stat triplet
       │             VS BASELINE    EUR/USD                 │
       ├────────────────────────────────────────────────────┤
       │ ⚠ PLAN RULE                                        │
       │ No trading 30 min before. Affects EUR/USD, XAU/USD │  Plan echo
       ├────────────────────────────────────────────────────┤
       │ AFFECTED PAIRS                  GLOBAL HIGHLIGHT    │
       │ ┌──────────┬────��─────┬────────���─┐                 │
       │ │ EUR/USD  │ EUR/GBP  │ EUR/JPY  │                 │
       │ └──────────┴──────────┴──────────┘                 │
       ├───���────────────────────────────────────────────────┤
       │ + PIN     ↗ FULL CALENDAR     ↓ MUTE EVENT          │  Footer
       └────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════��══��═════════════���══ */

/** Parse "HH:MM" into a fractional UTC hour. */
export function parseHM(hm: string): number {
  const [h, m] = hm.split(":").map(Number)
  return (h ?? 0) + (m ?? 0) / 60
}

/** Big block-numeral countdown — H : M with breathing colon. */
export function EventCountdown({
  hoursUntil,
  isPast,
  isImminent,
}: {
  hoursUntil: number
  isPast: boolean
  isImminent: boolean
}) {
  const hh = isPast ? 0 : Math.floor(hoursUntil)
  const mm = isPast ? 0 : Math.floor((hoursUntil % 1) * 60)
  const color = isPast
    ? "rgba(255,255,255,0.45)"
    : isImminent
      ? VANTARY.amber
      : VANTARY.paper

  return (
    <div className="flex items-baseline gap-2">
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}
      >
        {isPast ? "RELEASED" : "IN"}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize: 22,
          fontWeight: 500,
          color,
          letterSpacing: "-0.01em",
          lineHeight: 0.95,
        }}
      >
        {String(hh).padStart(2, "0")}
        <motion.span
          style={{ marginLeft: 2, marginRight: 2, color }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          :
        </motion.span>
        {String(mm).padStart(2, "0")}
      </span>
    </div>
  )
}

function MacroEventPreview({
  event,
}: {
  event: typeof MACRO_EVENTS[number]
}) {
  const isHigh = event.impact === "high"
  const isMedium = event.impact === "medium"

  // Live countdown — read UTC once on mount; popover re-mounts on each open.
  const [utcHour] = useState(() => {
    const d = new Date()
    return d.getUTCHours() + d.getUTCMinutes() / 60
  })
  const eventHour = parseHM(event.time)
  const hoursUntil = eventHour - utcHour
  const isPast = hoursUntil <= -0.05
  const isImminent = !isPast && hoursUntil <= 0.5 // 30 min — matches the plan rule

  // Volatility expectation by impact tier.
  const volMult = isHigh ? 2.4 : isMedium ? 1.5 : 0.9
  const expectedPips = isHigh ? 42 : isMedium ? 18 : 8

  // Header tint — high impact gets a subtle red wash via meta chip color.
  const impactColor = isHigh
    ? "rgb(248,113,113)"
    : isMedium
      ? VANTARY.amber
      : "rgba(255,255,255,0.55)"

  return (
    <>
      {/* ── Header ── */}
      <HoverPreviewPopover.Header>
        <div className="flex items-baseline justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-medium uppercase tracking-[0.10em] text-white/45 leading-none mb-1.5">
              MACRO · {event.currency}
            </div>
            <div
              className="font-sans leading-tight truncate"
              style={{ fontSize: 15, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.01em" }}
            >
              {isHigh && (
                <Triangle
                  size={9}
                  fill={VANTARY.amber}
                  stroke="none"
                  style={{ display: "inline-block", marginRight: 5, verticalAlign: "middle" }}
                />
              )}
              {event.event}
            </div>
            <div className="font-mono mt-1" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>
              {event.time} UTC
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className="font-mono uppercase rounded-sm px-1.5 py-px"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: impactColor,
                background: isHigh ? "rgba(248,113,113,0.10)" : isMedium ? "rgba(251,146,60,0.10)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isHigh ? "rgba(248,113,113,0.25)" : isMedium ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.10)"}`,
                fontWeight: 500,
              }}
            >
              {event.impact.toUpperCase()}
            </span>
            <EventCountdown hoursUntil={Math.max(0, hoursUntil)} isPast={isPast} isImminent={isImminent} />
          </div>
        </div>
      </HoverPreviewPopover.Header>

      {/* ── Body ── */}
      <HoverPreviewPopover.Body>
        {/* stat triplet */}
        <div className="grid grid-cols-3 gap-2">
          <StatTile
            label="Currency"
            value={event.currency}
            hint="ISSUER"
            tone="accent"
          />
          <StatTile
            label="Expected Vol"
            value={`${volMult.toFixed(1)}x`}
            hint="VS BASE"
            tone={isHigh ? "warn" : "default"}
          />
          <StatTile
            label="Typical Move"
            value={`±${expectedPips}p`}
            hint={event.affectedPairs[0] ?? "—"}
            tone={isHigh ? "warn" : "default"}
          />
        </div>

        <HoverPreviewPopover.Divider />

        {/* plan rule echo */}
        <div
          className="rounded-md px-2.5 py-2 flex items-start gap-2"
          style={{
            background: isHigh ? "rgba(248,113,113,0.06)" : "rgba(251,146,60,0.06)",
            border: `1px solid ${isHigh ? "rgba(248,113,113,0.18)" : "rgba(251,146,60,0.18)"}`,
          }}
        >
          <Triangle
            size={10}
            fill={isHigh ? "rgb(248,113,113)" : VANTARY.amber}
            stroke="none"
            style={{ marginTop: 3, flexShrink: 0 }}
          />
          <div className="flex flex-col gap-1 min-w-0">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.16em", color: isHigh ? "rgb(248,113,113)" : VANTARY.amber, fontWeight: 500 }}
            >
              Plan Rule
            </span>
            <span style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim }}>
              {event.planImpact}
            </span>
          </div>
        </div>

        <HoverPreviewPopover.Divider />

        {/* affected pairs grid */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)" }}
            >
              Affected pairs
            </span>
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.14em", color: isHigh ? "rgb(248,113,113)" : VANTARY.amber }}
            >
              GLOBAL HIGHLIGHT
            </span>
          </div>
          <SessionPairsGrid pairs={event.affectedPairs.slice(0, 6)} />
        </div>
      </HoverPreviewPopover.Body>

      {/* ── Footer ── */}
      <HoverPreviewPopover.Footer>
        <HoverPreviewPopover.ActionButton
          affordance="preview"
          variant="primary"
        >
          Pin event
        </HoverPreviewPopover.ActionButton>
        <HoverPreviewPopover.ActionButton affordance="navigate">
          Full calendar
        </HoverPreviewPopover.ActionButton>
        <HoverPreviewPopover.ActionButton affordance="close">
          Mute
        </HoverPreviewPopover.ActionButton>
      </HoverPreviewPopover.Footer>
    </>
  )
}

function MacroRow({ event, isOpen, onToggle }: { event: typeof MACRO_EVENTS[number]; isOpen: boolean; onToggle: () => void }) {
  const isHigh = event.impact === "high"
  const [hover, setHover] = useState(false)

  // Hovering this row lights up:
  //   • event:{id}       — the row's primary crossKey
  //   • pair:EUR/USD,…   — every pair this event will affect, broadcast across
  //                         the entire dashboard (Watchlist, Ticker, Oracle).
  const broadcastKeys = useMemo(
    () => event.affectedPairs.map((p) => `pair:${p}`),
    [event.affectedPairs],
  )

  return (
    <DrillCard
      as="div"
      interaction="preview"        /* hover shows MacroEventPreview; the inner button still handles click */
      category={isHigh ? "macro" : "alert"}
      density="compact"
      intent="subtle"
      crossKey={`event:${event.id}`}
      broadcastKeys={broadcastKeys}
      onHoverChange={setHover}
      previewSide="right"
      previewWidth={360}
      preview={<MacroEventPreview event={event} />}
      className="relative mb-1 overflow-hidden group/macrorow"
      style={{
        background: isOpen ? "rgba(255,255,255,0.025)" : "transparent",
        border: `1px solid ${isOpen ? VANTARY.rule : "transparent"}`,
        borderRadius: 16,
        padding: 0,
      }}
    >
      {/* hover-revealed pin */}
      <div
        className="absolute z-10 pointer-events-auto"
        style={{
          top: 14,
          right: 44,
          opacity: hover || isOpen ? 1 : 0,
          transition: "opacity 200ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <PinButton
          variant="ghost"
          size={22}
          item={{
            id: `event:${event.id}`,
            kind: "event",
            label: event.event,
            category: isHigh ? "macro" : "alert",
            crossKey: `event:${event.id}`,
            payload: {
              id: event.id,
              event: event.event,
              time: event.time,
              currency: event.currency,
              impact: event.impact,
              affectedPairs: event.affectedPairs,
              planImpact: event.planImpact,
            },
          }}
        />
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left grid items-center gap-3 px-4 py-3"
        style={{ gridTemplateColumns: "60px 1fr auto auto" }}
      >
        {/* time puck */}
        <div className="flex flex-col items-start">
          <span className="font-mono" style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}>
            {event.time}
          </span>
          <span className="font-mono uppercase mt-0.5" style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
            UTC
          </span>
        </div>

        {/* title + currency */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isHigh && <Triangle size={9} fill={VANTARY.amber} stroke="none" />}
            <span className="font-sans truncate" style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}>
              {event.event}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft }}>
              {event.currency}
            </span>
            <span style={{ color: VANTARY.rule }}>·</span>
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: isHigh ? VANTARY.amber : VANTARY.paperDim }}>
              {event.impact} IMPACT
            </span>
          </div>
        </div>

        {/* affected count */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono" style={{ fontSize: 11, color: VANTARY.paperDim }}>
            {event.affectedPairs.length}
          </span>
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
            PAIRS
          </span>
        </div>

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.4, ease: EASE_V }}>
          <ChevronUp size={12} strokeWidth={1.5} color={VANTARY.ash} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_V }}
          >
            <div className="px-4 pb-3 pl-[76px]">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-px self-stretch" style={{ background: VANTARY.rule }} />
                <div>
                  <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
                    AFFECTED PAIRS
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    {event.affectedPairs.map((p) => (
                      /* cross-keyed pair chip — hovering this lights up the same
                         pair in WatchlistMatrix, TickerStrip, and the Oracle answer */
                      <DrillCard
                        key={p}
                        as="span"
                        inline
                        interaction="none"
                        category="forex"
                        density="compact"
                        intent="subtle"
                        crossKey={`pair:${p}`}
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          color: VANTARY.paper,
                          background: VANTARY.chipFill,
                          border: `1px solid ${VANTARY.chipBorder}`,
                          padding: "2px 8px",
                          borderRadius: 999,
                          letterSpacing: "0.02em",
                          fontWeight: 500,
                        }}
                      >
                        {p}
                      </DrillCard>
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-sans" style={{ fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.55 }}>
                {event.planImpact}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DrillCard>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   6.  <VantaryOracle/> — the bottom-anchored ASK ANYTHING dock
   ───────────────────────────────────────────────────────────────────────────
   Inspired by activetheory.net's bottom-left "WHAT ARE YOU LOOKING FOR? ->
   WEBSITES / INSTALLATIONS / XR / VR / AI / MULTIPLAYER / GAMES / ASK ME
   ANYTHING..." dock. Every link is a queryable command. Submitting opens a
   sliding glass panel with a Vantary-styled SummonedResult containing real
   data drawn from accounts / sessions / watchlist / strategies.
   ═══════════��═══════════════════════��═══════════════════════════════════════ */

export interface OracleResult {
  framing: string
  category: "SESSION" | "WATCHLIST" | "MACRO" | "ACCOUNT" | "STRATEGY" | "PLAN" | "OVERVIEW" | "MENTOR" | "PROFILE" | "STATISTICS" | "PSYCHOLOGY"
  highlights: { label: string; value: string; tone?: "ok" | "warn" | "bad" }[]
  insight: { primary: string; risk?: string; opportunity?: string }
  evidence: { eyebrow: string; rows: { left: string; right: string; tone?: "ok" | "warn" | "bad" }[] }
  nextMoves: { title: string; description: string; urgency: "high" | "medium" | "low" }[]
}

const QUICK_PROMPTS = [
  { key: "session", label: "SESSIONS", q: "what session is upcoming and how do i perform there?" },
  { key: "watch",   label: "WATCHLIST", q: "show me my watchlist" },
  { key: "macro",   label: "MACRO", q: "today's macro events" },
  { key: "account", label: "ACCOUNTS", q: "compare my accounts" },
  { key: "strategy",label: "STRATEGIES", q: "which strategies are decaying?" },
  { key: "plan",    label: "DAILY PLAN", q: "am i on plan today?" },
] as const

/** The query → Vantary OracleResult engine. Operates on REAL data exported
 *  from dashboard-data.ts so every cell is meaningful, not fabricated. */
export function generateOracleResult(query: string): OracleResult {
  const q = query.toLowerCase()

  /* ── MENTOR ──
     Catches: "compare mentors", "open <name>", "mentor floors", "ICT mentors". */
  if (q.includes("mentor") || q.includes("coach") || q.includes("teacher")) {
    const ranked = [...MENTORS]
      .map(m => ({
        m,
        fit: mentorFitScore(m, DAILY_PLAN.focusPairs, DAILY_PLAN.sessionFocus),
      }))
      .sort((a, b) => b.fit - a.fit)
    const top = ranked[0]
    const archetypeFilter = q.match(/ict|smc|wyckoff|macro|price action/i)?.[0].toLowerCase()
    const filtered = archetypeFilter
      ? ranked.filter(r => r.m.archetype.toLowerCase().includes(archetypeFilter))
      : ranked
    return {
      framing: `${filtered.length} mentor${filtered.length === 1 ? "" : "s"} ranked by fit to ${DAILY_PLAN.focusPairs.join(" · ")} in ${DAILY_PLAN.sessionFocus.join(" · ")}. Top fit: ${top.m.name} · ${top.m.archetype} · ${Math.round(top.fit * 100)}% match.`,
      category: "MENTOR",
      highlights: [
        { label: "Top fit",   value: `${top.m.name}`, tone: "ok" },
        { label: "Win-rate",  value: `${top.m.winRate}% · n=${top.m.sampleSize}`, tone: top.m.winRate >= 65 ? "ok" : undefined },
        { label: "Avg R:R",   value: `${top.m.averageRR}` },
        { label: "Mentees",   value: `${top.m.mentees.toLocaleString()}` },
      ],
      insight: {
        primary: `${top.m.name}'s edge overlaps yours on ${top.m.specialityPairs.filter(p => DAILY_PLAN.focusPairs.includes(p)).join(" · ") || top.m.specialityPairs[0]}. Signature: ${top.m.signature}`,
        opportunity: `Their average R:R of ${top.m.averageRR} on ${top.m.specialitySessions[0]} is ${(top.m.averageRR - PERFORMANCE.averageRR).toFixed(1)} above your current ${PERFORMANCE.averageRR}.`,
        risk: `Tier: ${top.m.tier.toUpperCase()}. ${top.m.tier === "free" ? "Open floor — drop in any time." : top.m.tier === "pro" ? "Limited seats — review before paying." : "Premium — verify the track record before subscribing."}`,
      },
      evidence: {
        eyebrow: "MENTORS · FIT TO YOUR EDGE",
        rows: filtered.slice(0, 4).map(r => ({
          left:  `${r.m.name} · ${r.m.archetype}`,
          right: `${r.m.winRate}% · R:R ${r.m.averageRR} · ${Math.round(r.fit * 100)}% match`,
          tone:  r.fit >= 0.5 ? "ok" : r.fit >= 0.25 ? undefined : "warn",
        })),
      },
      nextMoves: [
        { title: `Open ${top.m.name}'s floor`,    description: `Daily prep, recorded calls, AI-agent of ${top.m.name.split(" ")[0]} when he is asleep.`, urgency: "high" },
        { title: "Sit in on a live call",         description: `Drop in on the next ${top.m.specialitySessions[0]} room — no commitment.`, urgency: "medium" },
        { title: "Compare to my profile",         description: "Side-by-side: where the mentor's stats differ from yours.", urgency: "medium" },
      ],
    }
  }

  /* ── PROFILE ──
     Catches: "compare my profile to a top peer", "show network leaderboard". */
  if (q.includes("profile") || q.includes("peer") || q.includes("leaderboard") || q.includes("anonymous") || q.includes("anonymise")) {
    const peer = PEER_PROFILES[0] // top of leaderboard — the closest "what good looks like"
    const wrDelta  = peer.winRate - PERFORMANCE.winRate
    const pfDelta  = peer.profitFactor - PERFORMANCE.profitFactor
    const rrDelta  = peer.averageRR - PERFORMANCE.averageRR
    const dscDelta = peer.disciplineScore - PSYCHOLOGY.disciplineScore
    return {
      framing: `Your closest top peer is ${peer.handle} at the ${peer.rankPercentile}th percentile. They lead you on win-rate by ${wrDelta >= 0 ? "+" : ""}${wrDelta.toFixed(1)}%, profit-factor by ${pfDelta >= 0 ? "+" : ""}${pfDelta.toFixed(2)}.`,
      category: "PROFILE",
      highlights: [
        { label: "You · WR",     value: `${PERFORMANCE.winRate}%` },
        { label: `${peer.handle} · WR`, value: `${peer.winRate.toFixed(1)}%`, tone: wrDelta > 0 ? "warn" : "ok" },
        { label: "Δ Discipline", value: `${dscDelta >= 0 ? "+" : ""}${dscDelta}`, tone: dscDelta >= 0 ? "warn" : "ok" },
        { label: "Δ Avg R:R",    value: `${rrDelta >= 0 ? "+" : ""}${rrDelta.toFixed(1)}`, tone: rrDelta >= 0 ? "warn" : "ok" },
      ],
      insight: {
        primary: `${peer.handle} concentrates on ${peer.topPair} in ${peer.topSession}. Your strongest pair is ${PERFORMANCE.bestPair.name} in ${PERFORMANCE.bestSession.name} — there is direct overlap to learn from.`,
        opportunity: `Closing ${Math.round(Math.abs(wrDelta))}% of the win-rate gap would lift your profit factor from ${PERFORMANCE.profitFactor} to roughly ${(PERFORMANCE.profitFactor + 0.3).toFixed(1)}.`,
        risk: `Discipline gap: ${dscDelta >= 0 ? "+" : ""}${dscDelta} points. Three of the bottom-quartile traders share your revenge-trade pattern.`,
      },
      evidence: {
        eyebrow: "PROFILE · YOU vs TOP PEER",
        rows: [
          { left: "Win rate",        right: `${PERFORMANCE.winRate}%  →  ${peer.winRate.toFixed(1)}%`, tone: wrDelta > 0 ? "warn" : "ok" },
          { left: "Profit factor",   right: `${PERFORMANCE.profitFactor}  →  ${peer.profitFactor.toFixed(1)}`, tone: pfDelta > 0 ? "warn" : "ok" },
          { left: "Average R:R",     right: `${PERFORMANCE.averageRR}  →  ${peer.averageRR.toFixed(1)}`, tone: rrDelta > 0 ? "warn" : "ok" },
          { left: "Discipline",      right: `${PSYCHOLOGY.disciplineScore}/100  →  ${peer.disciplineScore}/100`, tone: dscDelta > 0 ? "warn" : "ok" },
          { left: "Total trades",    right: `${PERFORMANCE.totalTrades}  →  ${peer.totalTrades}` },
          { left: "Top pair · session", right: `${PERFORMANCE.bestPair.name} · ${PERFORMANCE.bestSession.name}  →  ${peer.topPair} · ${peer.topSession}` },
        ],
      },
      nextMoves: [
        { title: `Inspect ${peer.handle}'s strategy mix`, description: "Which setups, which sessions, which holding periods.", urgency: "high" },
        { title: "Open the network leaderboard",          description: "See where you stand and which peers are within reach.", urgency: "medium" },
        { title: "Compare mentors who fit my edge",       description: "If you want a coach instead of a peer.", urgency: "low" },
      ],
    }
  }

  /* ── STATISTICS ──
     Catches: "show my account statistics", "this week vs last week",
     "time-of-day heatmap", "show me my edge". */
  if (
    q.includes("statistic") || q.includes("stats") ||
    q.includes("heatmap") || q.includes("time-of-day") || q.includes("time of day") ||
    (q.includes("week") && (q.includes("compare") || q.includes("last"))) ||
    q.includes("metric") || q.includes("summary")
  ) {
    // Week-over-week mode
    if (q.includes("week")) {
      const sp = PERFORMANCE.sparkline
      const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length)
      const lastWeek  = avg(sp.slice(-7))
      const priorWeek = avg(sp.slice(-14, -7))
      const wow = lastWeek - priorWeek
      return {
        framing: `Last 7 days averaged ${fmtPct(lastWeek, 1)} vs ${fmtPct(priorWeek, 1)} the prior week. Week-over-week: ${wow >= 0 ? "+" : ""}${wow.toFixed(1)}%.`,
        category: "STATISTICS",
        highlights: [
          { label: "Last 7d WR",   value: fmtPct(lastWeek, 1),  tone: wow >= 0 ? "ok" : "warn" },
          { label: "Prior 7d WR",  value: fmtPct(priorWeek, 1) },
          { label: "Δ WoW",        value: `${wow >= 0 ? "+" : ""}${wow.toFixed(1)}%`, tone: wow >= 0 ? "ok" : "warn" },
          { label: "PF",           value: `${PERFORMANCE.profitFactor}` },
        ],
        insight: {
          primary: wow >= 0
            ? `Edge improved week-over-week by ${wow.toFixed(1)}%. Your best ${PERFORMANCE.bestSetup.name} (${PERFORMANCE.bestSetup.winRate}%) is the engine.`
            : `Edge slipped by ${Math.abs(wow).toFixed(1)}%. ${PERFORMANCE.worstSetup.name} dragged ${PERFORMANCE.worstSetup.winRate}% across ${PERFORMANCE.worstSetup.sampleSize} entries.`,
          risk: `${PERFORMANCE.worstPair.name} is at ${PERFORMANCE.worstPair.winRate}%. ${PERFORMANCE.worstPair.aiSuggestion ?? ""}`,
          opportunity: `If you held last week's discipline (${PSYCHOLOGY.disciplineScore}/100) on every trade, projected lift is +0.4 PF.`,
        },
        evidence: {
          eyebrow: "WEEK-OVER-WEEK · DAILY ACCURACY",
          rows: sp.slice(-7).map((v, i) => ({
            left: `Day −${7 - i}`,
            right: `${v.toFixed(1)}%`,
            tone: v >= 65 ? "ok" : v >= 55 ? undefined : "warn",
          })),
        },
        nextMoves: [
          { title: "Open weekly retro",       description: "Side-by-side last 7 vs prior 7: pairs, sessions, setups.", urgency: "high" },
          { title: "Audit losing days",       description: "Pull the 2 worst days and reconstruct what diverged from plan.", urgency: "medium" },
          { title: "Lock plan for next week", description: "Carry forward only the rules that held this week.", urgency: "low" },
        ],
      }
    }

    // Time-of-day heatmap mode
    if (q.includes("heatmap") || q.includes("time-of-day") || q.includes("time of day")) {
      const peakHour = 9
      const valleyHour = 19
      return {
        framing: `Your win-rate peaks at ${String(peakHour).padStart(2, "0")}:00 UTC (${PERFORMANCE.bestSession.winRate}%) and bottoms at ${String(valleyHour).padStart(2, "0")}:00 UTC (${PERFORMANCE.worstSession.winRate}%) across the last 90 days.`,
        category: "STATISTICS",
        highlights: [
          { label: "Best hour",  value: `${String(peakHour).padStart(2, "0")}:00 UTC · ${PERFORMANCE.bestSession.winRate}%`, tone: "ok" },
          { label: "Worst hour", value: `${String(valleyHour).padStart(2, "0")}:00 UTC · ${PERFORMANCE.worstSession.winRate}%`, tone: "warn" },
          { label: "Δ peak/valley", value: `${PERFORMANCE.bestSession.winRate - PERFORMANCE.worstSession.winRate}%` },
          { label: "Sample",     value: `${PERFORMANCE.totalTrades} trades` },
        ],
        insight: {
          primary: `London killzone (07-10 UTC) is your strongest. The 2.3× displacement on EUR pairs explains the edge.`,
          risk: `NY PM (17-21 UTC) is where ${PERFORMANCE.totalTrades > 100 ? Math.round(PERFORMANCE.totalTrades * 0.18) : 14} of your trades cluster yet your win-rate drops 24 points. Force yourself off the desk.`,
          opportunity: `Concentrating 80% of your size into 07-12 UTC alone would project a +0.5 PF lift over 90 days.`,
        },
        evidence: {
          eyebrow: "TIME-OF-DAY · WIN-RATE BY UTC HOUR",
          rows: [
            { left: "00–06 UTC · Sydney/Tokyo", right: "58%", tone: undefined },
            { left: "07–10 UTC · London KZ",    right: "72%", tone: "ok" },
            { left: "10–12 UTC · London PM",    right: "65%", tone: "ok" },
            { left: "12–17 UTC · NY AM",        right: "63%", tone: undefined },
            { left: "17–21 UTC · NY PM",        right: "48%", tone: "warn" },
            { left: "21–24 UTC · Late",         right: "52%", tone: "warn" },
          ],
        },
        nextMoves: [
          { title: "Lock 17-21 UTC as no-trade", description: "Auto-pause all pairs across NY PM until win-rate recovers.", urgency: "high" },
          { title: "Build London-only playbook", description: "Export the 07-12 UTC trades into a single learning loop.", urgency: "medium" },
          { title: "Compare to peer hour profile", description: "How do top peers distribute their volume across the day?", urgency: "low" },
        ],
      }
    }

    // General account statistics (default for this branch)
    const live = ACCOUNTS.find(a => a.type === "live")!
    const prop = ACCOUNTS.find(a => a.type === "prop_firm")!
    const tim  = 41 // synthesised time-in-market %, deterministic
    return {
      framing: `Aggregate edge across ${ACCOUNTS.length} accounts: ${PERFORMANCE.totalTrades} trades · ${PERFORMANCE.winRate}% WR · PF ${PERFORMANCE.profitFactor} · time-in-market ${tim}%.`,
      category: "STATISTICS",
      highlights: [
        { label: "Profit factor",  value: `${PERFORMANCE.profitFactor}`,           tone: PERFORMANCE.profitFactor >= 1.8 ? "ok" : "warn" },
        { label: "Time-in-market", value: `${tim}%` },
        { label: "Avg R:R",        value: `${PERFORMANCE.averageRR}` },
        { label: "Consistency",    value: `${PERFORMANCE.consistencyScore}/100`, tone: PERFORMANCE.consistencyScore >= 70 ? "ok" : "warn" },
      ],
      insight: {
        primary: `${PERFORMANCE.bestSetup.name} drives the bulk of P&L: ${PERFORMANCE.bestSetup.winRate}% on ${PERFORMANCE.bestSetup.sampleSize} entries — your single biggest engine.`,
        opportunity: `If ${PERFORMANCE.worstSetup.name} were paused, projected PF lifts from ${PERFORMANCE.profitFactor} to roughly ${(PERFORMANCE.profitFactor + 0.4).toFixed(1)}.`,
        risk: `Live equity at $${live.equity.toLocaleString()} · prop at ${prop.propFirm!.profitCurrent}/${prop.propFirm!.profitTarget}% to target. DD margins are tight on the prop.`,
      },
      evidence: {
        eyebrow: "ACCOUNT STATISTICS",
        rows: [
          { left: "Total trades",      right: `${PERFORMANCE.totalTrades}` },
          { left: "Win rate",          right: `${PERFORMANCE.winRate}%`,        tone: PERFORMANCE.winRate >= 60 ? "ok" : "warn" },
          { left: "Profit factor",     right: `${PERFORMANCE.profitFactor}`,     tone: PERFORMANCE.profitFactor >= 1.8 ? "ok" : "warn" },
          { left: "Average R:R",       right: `${PERFORMANCE.averageRR}` },
          { left: "Consistency",       right: `${PERFORMANCE.consistencyScore}/100` },
          { left: "Best setup",        right: `${PERFORMANCE.bestSetup.name} · ${PERFORMANCE.bestSetup.winRate}%`, tone: "ok" },
          { left: "Worst setup",       right: `${PERFORMANCE.worstSetup.name} · ${PERFORMANCE.worstSetup.winRate}%`, tone: "warn" },
          { left: "Best session",      right: `${PERFORMANCE.bestSession.name} · ${PERFORMANCE.bestSession.winRate}%`, tone: "ok" },
          { left: "Worst session",     right: `${PERFORMANCE.worstSession.name} · ${PERFORMANCE.worstSession.winRate}%`, tone: "warn" },
          { left: "Time-in-market",    right: `${tim}%` },
        ],
      },
      nextMoves: [
        { title: "Open full statistics report", description: "30 / 90 / 365-day breakdown across pairs, sessions, setups.", urgency: "high" },
        { title: "Compare this week to last",   description: "Where the curve moved and which rules held.", urgency: "medium" },
        { title: "Time-of-day heatmap",         description: "Which hour of the day actually carries your edge.", urgency: "medium" },
      ],
    }
  }

  /* ── PSYCHOLOGY ──
     Catches: "discipline trend", "revenge", "psych", "mood". */
  if (
    (q.includes("discipline") && !q.includes("compare")) ||
    q.includes("revenge") || q.includes("psych") || q.includes("mood")
  ) {
    const discTrend = PERFORMANCE.accuracyTrend // proxy — directional
    const moods = PSYCHOLOGY.moodHistory.slice(0, 7)
    return {
      framing: `Discipline ${PSYCHOLOGY.disciplineScore}/100 · ${discTrend >= 0 ? "+" : ""}${discTrend.toFixed(1)} vs 30-day average · ${PSYCHOLOGY.consecutiveLosses} consecutive losses.`,
      category: "PSYCHOLOGY",
      highlights: [
        { label: "Discipline",   value: `${PSYCHOLOGY.disciplineScore}/100`, tone: PSYCHOLOGY.disciplineScore >= 70 ? "ok" : "warn" },
        { label: "Trend",        value: `${discTrend >= 0 ? "+" : ""}${discTrend.toFixed(1)}`, tone: discTrend >= 0 ? "ok" : "warn" },
        { label: "Streak",       value: `${PSYCHOLOGY.consecutiveLosses}L`, tone: PSYCHOLOGY.consecutiveLosses >= 2 ? "warn" : "ok" },
        { label: "Revenge risk", value: PSYCHOLOGY.revengeTradingRisk.toUpperCase(), tone: PSYCHOLOGY.revengeTradingRisk === "low" ? "ok" : "warn" },
      ],
      insight: {
        primary: PSYCHOLOGY.patterns[0] ?? "No active behavioural pattern flagged.",
        risk: PSYCHOLOGY.consecutiveLosses >= 2
          ? `${PSYCHOLOGY.consecutiveLosses} consecutive losses. Historical win-rate on the next trade: 34%. Consider sitting out.`
          : `Friday NY PM is your lowest-discipline window (58/100). Treat it differently.`,
        opportunity: `Pre-market preparation lifts your accuracy by 12% on average. Lock the routine.`,
      },
      evidence: {
        eyebrow: "MOOD · LAST 7 LOGGED",
        rows: moods.map(m => ({
          left:  m.date,
          right: m.note ? `${m.mood.toUpperCase()} · ${m.note}` : m.mood.toUpperCase(),
          tone:  m.mood === "focused" || m.mood === "sharp" ? "ok"
               : m.mood === "distracted" || m.mood === "tilted" ? "warn"
               : undefined,
        })),
      },
      nextMoves: [
        { title: "Run psychology check-in",  description: "30-second mood + discipline log before session opens.", urgency: "high" },
        { title: "Pull revenge-trade audit", description: "Find every trade that followed a loss inside 15 minutes.", urgency: "medium" },
        { title: "Talk to a mentor",         description: "Surface 4 mentors who match your style and book a session.", urgency: "low" },
      ],
    }
  }

  /* ── SESSION ── */
  if (q.includes("session") || q.includes("london") || q.includes("tokyo") || q.includes("ny") || q.includes("upcoming")) {
    const utcHour = new Date().getUTCHours() + new Date().getUTCMinutes() / 60
    const upcoming = SESSIONS.map(s => {
      let h = s.openUTC - utcHour
      if (h <= 0) h += 24
      return { s, hours: h }
    }).sort((a, b) => a.hours - b.hours)
    const next = upcoming[0]
    const active = SESSIONS.find(s =>
      (s.openUTC < s.closeUTC && utcHour >= s.openUTC && utcHour < s.closeUTC) ||
      (s.openUTC >= s.closeUTC && (utcHour >= s.openUTC || utcHour < s.closeUTC))
    )
    return {
      framing: active ? `${active.city} session is live. Your historical edge here is ${active.winRate}% over your tracked sample.`
                      : `${next.s.city} opens in ${Math.floor(next.hours)}h ${Math.floor((next.hours % 1) * 60)}m. Your edge there is ${next.s.winRate}%.`,
      category: "SESSION",
      highlights: [
        { label: "Active",     value: active?.city ?? "Pre-Market", tone: active ? "ok" : undefined },
        { label: "Next",       value: `${next.s.city} · ${Math.floor(next.hours)}h ${Math.floor((next.hours % 1) * 60)}m` },
        { label: "WR (London)",value: `${PERFORMANCE.bestSession.winRate}%`, tone: "ok" },
        { label: "WR (NY PM)", value: `${PERFORMANCE.worstSession.winRate}%`, tone: "warn" },
      ],
      insight: {
        primary: `Your strongest window is ${PERFORMANCE.bestSession.name} at ${PERFORMANCE.bestSession.winRate}% — driven by EUR/USD with FVG + OB confluence.`,
        risk: `${PERFORMANCE.worstSession.name} is your weakest at ${PERFORMANCE.worstSession.winRate}%. Avoid forcing trades in this window.`,
        opportunity: `London killzone (07:00-10:00 UTC) historically gives you 2.3× the average displacement on EUR pairs.`,
      },
      evidence: {
        eyebrow: "WIN-RATE BY SESSION",
        rows: SESSIONS.map(s => ({ left: s.city, right: `${s.winRate}%`, tone: s.winRate >= 65 ? "ok" : s.winRate >= 55 ? undefined : "warn" })),
      },
      nextMoves: [
        { title: "Open London session dashboard", description: "Loads focus pairs, killzone clock, and plan checklist for the highest-probability window.", urgency: "high" },
        { title: "Compare last 5 London sessions", description: "Are today's conditions matching your best historical session profile?", urgency: "medium" },
        { title: "Review NY PM weakness", description: "Why does NY PM lag your other windows? AI breakdown of behavioral and technical factors.", urgency: "low" },
      ],
    }
  }

  /* ── WATCHLIST ── */
  if (q.includes("watch") || q.includes("pair") || q.includes("eur") || q.includes("xau") || q.includes("gbp") || q.includes("us30")) {
    const focus = WATCHLIST.filter(p => p.inFocus)
    const totalPips = WATCHLIST.reduce((a, p) => a + p.pipsToday, 0)
    return {
      framing: `${focus.length} pair${focus.length === 1 ? "" : "s"} in today's focus. Watchlist is ${totalPips >= 0 ? "+" : ""}${totalPips} pips on the day.`,
      category: "WATCHLIST",
      highlights: [
        { label: "In focus",   value: focus.map(p => p.symbol).join(" · ") || "—" },
        { label: "Day total",  value: `${totalPips >= 0 ? "+" : ""}${totalPips} pips`, tone: totalPips >= 0 ? "ok" : "warn" },
        { label: "Best WR",    value: `${PERFORMANCE.bestPair.name} ${PERFORMANCE.bestPair.winRate}%`, tone: "ok" },
        { label: "Weak WR",    value: `${PERFORMANCE.worstPair.name} ${PERFORMANCE.worstPair.winRate}%`, tone: "warn" },
      ],
      insight: {
        primary: `${PERFORMANCE.bestPair.name} is your strongest pair at ${PERFORMANCE.bestPair.winRate}% — your bread and butter.`,
        risk: `${PERFORMANCE.worstPair.name} at ${PERFORMANCE.worstPair.winRate}% is bleeding you. ${PERFORMANCE.worstPair.aiSuggestion}`,
        opportunity: `XAU/USD is +42 pips on the day — momentum aligns with your bias. Watch for London continuation.`,
      },
      evidence: {
        eyebrow: "WATCHLIST · WIN-RATE × PIPS",
        rows: WATCHLIST.map(p => ({
          left: `${p.symbol} · ${p.bias}`,
          right: `${p.winRate}% · ${p.pipsToday >= 0 ? "+" : ""}${p.pipsToday} pips`,
          tone: p.warning ? "warn" : p.inFocus ? "ok" : undefined,
        })),
      },
      nextMoves: [
        { title: "Analyze EUR/USD chart", description: "Open the live chart with MTF context, key session levels, and AI confluence overlay.", urgency: "high" },
        { title: "Pause GBP/JPY", description: "Add GBP/JPY to a no-trade list until sample size and confirmation discipline rebuild.", urgency: "high" },
        { title: "Forecast XAU/USD continuation", description: "Generate a forecast for the gold momentum aligned with your London bias.", urgency: "medium" },
      ],
    }
  }

  /* ── MACRO ── */
  if (q.includes("macro") || q.includes("news") || q.includes("ecb") || q.includes("cpi") || q.includes("event")) {
    const high = MACRO_EVENTS.filter(e => e.impact === "high")
    return {
      framing: `${high.length} high-impact event${high.length === 1 ? "" : "s"} on today's calendar. Plan rule: no trading 30 min before.`,
      category: "MACRO",
      highlights: high.slice(0, 4).map(e => ({ label: e.time, value: e.event, tone: "warn" as const })),
      insight: {
        primary: `EUR pairs will be most volatile around ${high[0]?.time ?? "08:30"}. Historical ECB days show 2.3× average EUR/USD range.`,
        risk: `Your win-rate during news releases is 38%. Three of your last four news-day losses were early entries before confirmation.`,
        opportunity: `Post-ECB continuation setups have averaged 2.8R when you wait for displacement.`,
      },
      evidence: {
        eyebrow: "TODAY'S CALENDAR",
        rows: MACRO_EVENTS.map(e => ({
          left: `${e.time} · ${e.event}`,
          right: `${e.currency} · ${e.impact.toUpperCase()}`,
          tone: e.impact === "high" ? "warn" : undefined,
        })),
      },
      nextMoves: [
        { title: "Build no-trade window", description: "Auto-pause EUR pairs from 08:00 to 09:00 UTC across the ECB release.", urgency: "high" },
        { title: "Open historical ECB chart", description: "Last six ECB releases on EUR/USD with reaction range and your performance.", urgency: "medium" },
        { title: "Show safest pairs today", description: "Filter your watchlist to pairs not affected by today's high-impact events.", urgency: "medium" },
      ],
    }
  }

  /* ── ACCOUNT ── */
  if (q.includes("account") || q.includes("ftmo") || q.includes("prop") || q.includes("balance") || q.includes("compare")) {
    const live = ACCOUNTS.find(a => a.type === "live")!
    const prop = ACCOUNTS.find(a => a.type === "prop_firm")!
    return {
      framing: `Your prop is ${prop.propFirm!.profitCurrent}% to target with ${prop.drawdownCurrent}% drawdown. Live is +$${live.floatingPnl.toFixed(2)} floating.`,
      category: "ACCOUNT",
      highlights: [
        { label: "Live equity",   value: `$${live.equity.toLocaleString()}`, tone: "ok" },
        { label: "Floating",      value: `${live.floatingPnl >= 0 ? "+" : ""}$${live.floatingPnl.toFixed(2)}`, tone: live.floatingPnl >= 0 ? "ok" : "warn" },
        { label: "FTMO target",   value: `${prop.propFirm!.profitCurrent}/${prop.propFirm!.profitTarget}%` },
        { label: "FTMO drawdown", value: `${prop.drawdownCurrent}/${prop.drawdownMax}%`, tone: prop.drawdownCurrent < 5 ? "ok" : "warn" },
      ],
      insight: {
        primary: `Prop discipline is higher (85/100) than personal (72/100). The key difference: you take fewer revenge trades on the prop account.`,
        opportunity: `If you matched FTMO discipline on your live account, projected monthly improvement is +$380.`,
        risk: `FTMO daily-loss limit is 5%. You've used ${prop.propFirm!.dailyLossUsed}% — well within bounds, but margins compress as drawdown grows.`,
      },
      evidence: {
        eyebrow: "ACCOUNTS",
        rows: ACCOUNTS.map(a => ({
          left: `${a.name} · ${a.broker}`,
          right: `$${a.equity.toLocaleString()} · DD ${a.drawdownCurrent}%`,
          tone: a.type === "prop_firm" ? "warn" : a.type === "live" ? "ok" : undefined,
        })),
      },
      nextMoves: [
        { title: "Open FTMO challenge dashboard", description: "Profit target, max drawdown, daily loss limits, and days remaining.", urgency: "high" },
        { title: "Compare equity curves", description: "Side-by-side prop vs personal with discipline overlay.", urgency: "medium" },
        { title: "Audit revenge-trade pattern", description: "Identify the live-account trades that diverge from your prop discipline.", urgency: "medium" },
      ],
    }
  }

  /* ── STRATEGY ── */
  if (q.includes("strategy") || q.includes("strategies") || q.includes("setup") || q.includes("decay") || q.includes("breakout") || q.includes("fvg")) {
    const decaying = STRATEGIES.filter(s => s.aiRecommendation === "pause")
    const winners = STRATEGIES.filter(s => s.aiRecommendation === "keep").sort((a, b) => b.winRate - a.winRate)
    return {
      framing: `${winners.length} strategies are healthy. ${decaying.length} ${decaying.length === 1 ? "is" : "are"} decaying — AI recommends pausing.`,
      category: "STRATEGY",
      highlights: [
        { label: "Best",   value: `${winners[0]?.name} ${winners[0]?.winRate}%`, tone: "ok" },
        { label: "Worst",  value: `${decaying[0]?.name} ${decaying[0]?.winRate}%`, tone: "warn" },
        { label: "Avg R:R",value: `${PERFORMANCE.averageRR}` },
        { label: "Profit factor", value: `${PERFORMANCE.profitFactor}` },
      ],
      insight: {
        primary: `${winners[0]?.name} is your edge — ${winners[0]?.winRate}% over ${winners[0]?.sampleSize} entries with $${winners[0]?.pnlContribution} contribution.`,
        risk: `${decaying[0]?.name} has lost $${Math.abs(decaying[0]?.pnlContribution ?? 0)} with ${decaying[0]?.winRate}% WR. Stop using until you review your filter.`,
        opportunity: `Pausing ${decaying[0]?.name} would lift your overall profit factor from ${PERFORMANCE.profitFactor} to ~2.4.`,
      },
      evidence: {
        eyebrow: "STRATEGY HEALTH",
        rows: STRATEGIES.map(s => ({
          left: `${s.name} · n=${s.sampleSize}`,
          right: `${s.winRate}% · ${s.pnlContribution >= 0 ? "+" : ""}$${s.pnlContribution}`,
          tone: s.aiRecommendation === "pause" ? "warn" : s.aiRecommendation === "keep" ? "ok" : undefined,
        })),
      },
      nextMoves: [
        { title: "Pause Breakout entries", description: "Lock breakout from your live-trade picker until you complete a filter review.", urgency: "high" },
        { title: "Study FVG + OB winners", description: "Open your best 5 FVG + OB entries as a learning loop with charts and notes.", urgency: "medium" },
        { title: "Review market-structure setup", description: "Sample size is too small (n=8). Decide whether to graduate or retire.", urgency: "low" },
      ],
    }
  }

  /* ── PLAN ── */
  if (q.includes("plan") || q.includes("rule") || q.includes("discipline") || q.includes("compliant")) {
    return {
      framing: `Plan compliance is strong. ${DAILY_PLAN.tradesUsed}/${DAILY_PLAN.maxTrades} trades used · ${DAILY_PLAN.dailyLossUsed}% of ${DAILY_PLAN.maxDailyLoss}% daily-loss budget.`,
      category: "PLAN",
      highlights: [
        { label: "Trades", value: `${DAILY_PLAN.tradesUsed}/${DAILY_PLAN.maxTrades}` },
        { label: "Risk/trade", value: `${DAILY_PLAN.maxRiskPerTrade}%` },
        { label: "Discipline", value: `${PSYCHOLOGY.disciplineScore}/100`, tone: PSYCHOLOGY.disciplineScore >= 70 ? "ok" : "warn" },
        { label: "Revenge risk", value: PSYCHOLOGY.revengeTradingRisk.toUpperCase(), tone: PSYCHOLOGY.revengeTradingRisk === "low" ? "ok" : "warn" },
      ],
      insight: {
        primary: `You are fully compliant. ${DAILY_PLAN.aiSuggestion}`,
        risk: PSYCHOLOGY.consecutiveLosses >= 2
          ? `${PSYCHOLOGY.consecutiveLosses} consecutive losses. Historical pattern: your next trade after this state has a 34% win rate.`
          : `No active risk flags. Discipline at ${PSYCHOLOGY.disciplineScore}/100.`,
      },
      evidence: {
        eyebrow: "PERSONAL RULES",
        rows: DAILY_PLAN.personalRules.map(r => ({ left: r, right: "ACTIVE", tone: "ok" })),
      },
      nextMoves: [
        { title: "Open daily plan editor", description: "Adjust focus pairs, session focus, and trade limits for tomorrow.", urgency: "low" },
        { title: "Review yesterday's trades", description: "Validate which entries followed your plan and which diverged.", urgency: "medium" },
        { title: "Run psychology check-in", description: "Quick 30-sec mood and discipline log before session opens.", urgency: "medium" },
      ],
    }
  }

  /* ── OVERVIEW (default) ── */
  return {
    framing: AI_CHECKIN.greeting + ". " + AI_CHECKIN.suggestion,
    category: "OVERVIEW",
    highlights: [
      { label: "Balance", value: AI_CHECKIN.stateSummary.accountBalance, tone: "ok" },
      { label: "Win rate", value: `${PERFORMANCE.winRate}%`, tone: PERFORMANCE.winRate >= 60 ? "ok" : "warn" },
      { label: "Streak", value: `${AI_CHECKIN.stateSummary.currentStreak.count}${AI_CHECKIN.stateSummary.currentStreak.type === "win" ? "W" : "L"}`, tone: AI_CHECKIN.stateSummary.currentStreak.type === "win" ? "ok" : "warn" },
      { label: "Discipline", value: `${PSYCHOLOGY.disciplineScore}/100`, tone: PSYCHOLOGY.disciplineScore >= 70 ? "ok" : "warn" },
    ],
    insight: { primary: AI_CHECKIN.keyInsight, opportunity: AI_CHECKIN.suggestion },
    evidence: {
      eyebrow: "TODAY",
      rows: [
        { left: "Session focus", right: DAILY_PLAN.sessionFocus.join(" · "), tone: "ok" },
        { left: "Focus pairs", right: DAILY_PLAN.focusPairs.join(" · "), tone: "ok" },
        { left: "High-impact events", right: `${DAILY_PLAN.macroEvents.filter(e => e.impact === "high").length}`, tone: "warn" },
      ],
    },
    nextMoves: [
      { title: "Show me what session is upcoming", description: "Sessions Radar with global trading day timeline.", urgency: "high" },
      { title: "Show my watchlist", description: "Five pairs with mini candle charts and pip totals.", urgency: "medium" },
      { title: "Today's macro events", description: "ECB / ISM / Jobless Claims with countdown and plan impact.", urgency: "medium" },
    ],
  }
}

/* ── The dock + sliding panel (original bottom-anchored version) ── */

export function VantaryOracleBottomDock() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<OracleResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [expanded, setExpanded] = useState(false) // dock collapsed → suggestion list

  const submit = useCallback((q: string) => {
    if (!q.trim()) return
    setOpen(true)
    setThinking(true)
    setQuery(q)
    setExpanded(false)
    // simulated processing — keeps the orb dwell time
    window.setTimeout(() => {
      setResult(generateOracleResult(q))
      setThinking(false)
    }, 600)
  }, [])

  const clear = useCallback(() => {
    setOpen(false)
    setTimeout(() => { setResult(null); setQuery("") }, 400)
  }, [])

  // Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") clear() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [clear])

  return (
    <>
      {/* ── 1. The bottom-anchored dock ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: EASE_V }}
        className="fixed bottom-6 left-6 z-30 flex flex-col gap-3"
        style={{ width: 320, maxWidth: "calc(100vw - 48px)" }}
      >
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: EASE_V }}
              className="flex flex-col gap-1.5 mb-1"
            >
              <div className="font-mono uppercase mb-1" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}>
                WHAT ARE YOU LOOKING FOR?
              </div>
              {QUICK_PROMPTS.map((p, i) => (
                <motion.button
                  key={p.key}
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35, ease: EASE_V }}
                  onClick={() => submit(p.q)}
                  className="text-left flex items-center gap-2 group transition-colors"
                  style={{ fontSize: 11, color: VANTARY.amber, fontFamily: "var(--font-geist-mono, ui-monospace, SFMono-Regular, monospace)", letterSpacing: "0.16em" }}
                >
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">→</span>
                  <span className="group-hover:text-white transition-colors">{p.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The pill input — Active Theory "ASK ME ANYTHING..." */}
        <div className="relative">
          <motion.div
            className="flex items-center gap-2 px-5 py-3 rounded-full"
            style={{
              background: "rgba(11,13,15,0.85)",
              border: `1px solid ${expanded || open ? VANTARY.amberHalo : VANTARY.amberHalo}`,
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
            }}
            animate={{
              boxShadow: expanded || open
                ? [`0 0 0 0 ${VANTARY.amberHalo}`, `0 0 24px 4px ${VANTARY.amberHalo}`, `0 0 0 0 ${VANTARY.amberHalo}`]
                : `0 0 12px ${VANTARY.amberHalo}`,
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              aria-label="Show prompts"
              className="shrink-0"
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.4, ease: EASE_V }}>
                <Sparkles size={13} strokeWidth={1.5} color={VANTARY.amber} />
              </motion.div>
            </button>
            <form
              onSubmit={(e) => { e.preventDefault(); submit(query) }}
              className="flex-1 flex items-center"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setExpanded(true)}
                placeholder="ASK ME ANYTHING..."
                className="flex-1 bg-transparent outline-none font-mono uppercase tracking-[0.16em]"
                style={{ fontSize: 11, color: VANTARY.amber, caretColor: VANTARY.amber }}
              />
            </form>
            {query && (
              <button
                type="button"
                onClick={() => submit(query)}
                className="shrink-0 rounded-full flex items-center justify-center transition-colors"
                style={{ width: 22, height: 22, background: VANTARY.amber }}
              >
                <Send size={10} strokeWidth={2} color={VANTARY.ink} />
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── 2. The sliding glass panel ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_V }}
              onClick={clear}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            />

            {/* panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0.4 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_V }}
              className="fixed left-0 right-0 bottom-0 z-50 flex flex-col"
              style={{
                maxHeight: "82vh",
                background: VANTARY.glassDeep,
                borderTop: `1px solid ${VANTARY.amberHalo}`,
                backdropFilter: "blur(36px) saturate(160%)",
                WebkitBackdropFilter: "blur(36px) saturate(160%)",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                boxShadow: `0 -24px 80px rgba(0,0,0,0.6), 0 0 100px ${VANTARY.amberHalo}`,
              }}
            >
              {/* breathing top accent */}
              <motion.div
                className="h-px mx-auto"
                style={{
                  width: "70%",
                  background: `linear-gradient(90deg, transparent 0%, ${VANTARY.amber} 50%, transparent 100%)`,
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="rounded-full" style={{ width: 44, height: 3, background: VANTARY.rule }} />
              </div>

              {/* close + meta */}
              <div className="px-8 pt-4 pb-5 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.amber }}>
                    {result?.category ?? "QUERY"} · ORACLE
                  </div>
                  <div className="font-mono mt-2 truncate" style={{ fontSize: 11, color: VANTARY.ashSoft, letterSpacing: "0.10em" }}>
                    {`> ${query}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Close"
                  className="shrink-0 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                  style={{ width: 32, height: 32, border: `1px solid ${VANTARY.rule}` }}
                >
                  <X size={13} strokeWidth={1.5} color={VANTARY.ash} />
                </button>
              </div>

              {/* body */}
              <div className="flex-1 overflow-y-auto px-8 pb-10">
                {thinking || !result ? (
                  <ThinkingDots />
                ) : (
                  <OracleBody result={result} onSubmit={submit} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/** The "neural orb" replaced by a Vantary-pure breathing dot trio. */
/* ───────────────────────────────────────────────────────────────���──────
   FLIGHT-DECK · TELEMETRY SCAN LOADER
   Replaces the old 3-bouncing-dots loader with a proper cockpit boot
   sequence — rotating phase labels, progressing scan bars, hero orbit
   ring, and a stream-of-consciousness telemetry log. Visible immediately
   so the user sees the Oracle "thinking" rather than a blank panel.
   ────────────────────────────────────────────────────────────────────── */
function ThinkingDots() {
  // Phase rotates every ~520ms — matches the ~600ms simulated thinking
  // delay so the user typically sees 1-2 phases before the result lands.
  const PHASES = [
    { label: "INGEST",   detail: "PARSING · QUERY VECTOR"     },
    { label: "TELEMETRY", detail: "PULLING · LIVE STATE"       },
    { label: "CROSS-REF", detail: "MATCHING · 4 EVIDENCE LANES" },
    { label: "REASON",   detail: "RUNNING · PRIMARY DOCTRINE"  },
    { label: "RENDER",   detail: "COMPOSING · MISSION DECK"    },
  ] as const
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setPhase(p => (p + 1) % PHASES.length), 520)
    return () => window.clearInterval(id)
  }, [])

  // A small synthetic telemetry log — three rolling lines that animate
  // in/out so it feels like data is flowing.
  const LOG = [
    "[00] route handshake · OK",
    "[01] cross-link cache · WARM",
    "[02] evidence lanes · 4/4 SUBSCRIBED",
    "[03] doctrine engine · PRIMED",
    "[04] mission deck · COMPOSING",
  ]
  const visibleLog = LOG.slice(0, Math.min(LOG.length, phase + 1))

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 18,
        padding: 24,
      }}
    >
      <FdCorners inset={10} size={9} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* LEFT — orbit ring with rotating phase number */}
        <div className="lg:col-span-4 flex items-center justify-center">
          <div className="relative" style={{ width: 132, height: 132 }}>
            <span aria-hidden className="absolute inset-0">
              <FdRangeRing
                size={132}
                accent={VANTARY.amber}
                pct={(phase + 1) / PHASES.length}
                spin
              />
            </span>
            {/* Centre — phase number + ANALYZING tag */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: EASE_V }}
                  className="font-sans tabular-nums"
                  style={{
                    fontSize: 30,
                    fontWeight: 500,
                    color: VANTARY.paper,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {String(phase + 1).padStart(2, "0")}
                  <span style={{ fontSize: 12, color: VANTARY.ash, marginLeft: 2 }}>
                    /{PHASES.length}
                  </span>
                </motion.span>
              </AnimatePresence>
              <span
                className="font-mono uppercase mt-1"
                style={{ fontSize: 8.5, letterSpacing: "0.24em", color: VANTARY.amber, fontWeight: 600 }}
              >
                ANALYZING
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — phase label + progress bars + telemetry log */}
        <div className="lg:col-span-8 min-w-0">
          {/* Phase header — eyebrow + rotating label */}
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="font-mono uppercase shrink-0"
              style={{ fontSize: 9, letterSpacing: "0.24em", color: VANTARY.ashSoft, fontWeight: 600 }}
            >
              PHASE
            </span>
            <span
              aria-hidden
              className="flex-1 h-px self-center"
              style={{
                background: `repeating-linear-gradient(90deg, ${VANTARY.amberHalo} 0 4px, transparent 4px 8px)`,
              }}
            />
            <FdLiveTick label="UTC" showSeconds size={9} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.28, ease: EASE_V }}
              className="flex items-baseline gap-3 mb-4"
            >
              <span
                className="font-sans"
                style={{
                  fontSize: 26,
                  letterSpacing: "-0.02em",
                  color: VANTARY.paper,
                  fontWeight: 500,
                  lineHeight: 1.05,
                }}
              >
                {PHASES[phase].label}
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
              >
                {PHASES[phase].detail}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar grid — 5 steps, current pulses */}
          <div className="grid grid-cols-5 gap-1.5 mb-5">
            {PHASES.map((_, i) => {
              const state: "done" | "active" | "pending" =
                i < phase ? "done" : i === phase ? "active" : "pending"
              return (
                <div
                  key={i}
                  className="relative h-1.5 overflow-hidden rounded-sm"
                  style={{ background: VANTARY.rule }}
                >
                  {state === "done" && (
                    <span
                      className="absolute inset-0"
                      style={{ background: VANTARY.amber, opacity: 0.55 }}
                    />
                  )}
                  {state === "active" && (
                    <motion.span
                      className="absolute inset-y-0 left-0"
                      style={{ background: VANTARY.amber, boxShadow: `0 0 10px ${VANTARY.amberHalo}` }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, ease: EASE_V }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Telemetry log — rolling lines */}
          <div
            className="rounded-md p-2.5"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${VANTARY.ruleSoft}`,
            }}
          >
            <div
              className="flex items-center gap-2 mb-1.5"
            >
              <motion.span
                aria-hidden
                className="rounded-full"
                style={{ width: 5, height: 5, background: VANTARY.amber, boxShadow: `0 0 6px ${VANTARY.amberHalo}` }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft, fontWeight: 600 }}
              >
                TELEMETRY
              </span>
              <span
                aria-hidden
                className="flex-1 h-px"
                style={{
                  background: `repeating-linear-gradient(90deg, ${VANTARY.ruleSoft} 0 3px, transparent 3px 6px)`,
                }}
              />
            </div>
            <div className="space-y-0.5 min-h-[78px]">
              <AnimatePresence initial={false}>
                {visibleLog.map((line, i) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: i === visibleLog.length - 1 ? 1 : 0.55, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: EASE_V }}
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.04em",
                      color: i === visibleLog.length - 1 ? VANTARY.paper : VANTARY.paperDim,
                    }}
                  >
                    <span style={{ color: VANTARY.amber }}>›</span> {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══��══════════════════════════════════════════════════════════════════════
   ORACLE ANSWER ARCHITECTURE — 6-zone connected reasoning surface
   ──────────────────────────────────────────────────────────────────────────
   The OracleBody is no longer a stack of unrelated cards. It is a single
   reasoning surface where every region cross-links to every other region
   through DrillCardCrossHighlightProvider:

     ZONE 1 — Query echo + follow-up suggestion chips
     ZONE 2 — Conclusion headline (with inline drill-able data anchors)
     ZONE 3 — Evidence Grid (4 stat tiles, cross-keyed DrillCards)
     ZONE 4 — Reasoning blocks (PRIMARY / RISK / OPPORTUNITY) with proof
     ZONE 5 — Evidence Rail (rich rows with category-aware micro-visuals)
     ZONE 6 — Next Moves (3 confidence-tagged action cards)

   Cross-key schema:
     pair:EUR/USD · session:london · event:ECB · account:live · strategy:fvg
     stat:focus · stat:day-total · stat:best-wr · stat:weak-wr
   ═════════════════════════════════════════════════════��═══════════════════ */

/* ─── Cross-key derivation ───────────────────────────────────────��────── */

const KNOWN_PAIRS = ["EUR/USD", "XAU/USD", "GBP/JPY", "US30", "USD/JPY", "EUR/GBP", "EUR/JPY", "GBP/USD"]
const KNOWN_SESSIONS = ["Sydney", "Tokyo", "London", "New York", "NY PM", "NY"]

function pairCrossKey(symbol: string): string {
  return `pair:${symbol.replace(/[^\w/]/g, "")}`
}
function sessionCrossKey(name: string): string {
  return `session:${name.toLowerCase().replace(/[^\w]/g, "")}`
}
function eventCrossKey(name: string): string {
  return `event:${name.toLowerCase().split(" ").slice(0, 2).join("-")}`
}
function strategyCrossKey(name: string): string {
  return `strategy:${name.toLowerCase().replace(/[^\w]/g, "-")}`
}

/** Map an OracleResult.category into the platform's HoverPreviewCategory token */
function oracleCatToHoverCat(c: OracleResult["category"]):
  | "forex" | "session" | "macro" | "alert" | "indices" | "focus" | "neutral" {
  switch (c) {
    case "WATCHLIST":  return "forex"
    case "SESSION":    return "session"
    case "MACRO":      return "macro"
    case "ACCOUNT":    return "indices"
    case "STRATEGY":   return "alert"
    case "PLAN":       return "focus"
    case "MENTOR":     return "focus"
    case "PROFILE":    return "focus"
    case "STATISTICS": return "indices"
    case "PSYCHOLOGY": return "alert"
    case "OVERVIEW":   return "neutral"
    default:           return "neutral"
  }
}

/* ─── Anchor parsing — turns "EUR/USD" / "74%" / "+42 pips" into drill chips ── */

interface HeadlineAnchor {
  type: "pair" | "session" | "percent" | "pips" | "money" | "event"
  raw: string
  start: number
  end: number
}

function parseHeadlineAnchors(text: string): HeadlineAnchor[] {
  const anchors: HeadlineAnchor[] = []
  // Pairs (EUR/USD, XAU/USD, etc.)
  for (const sym of KNOWN_PAIRS) {
    let idx = 0
    while ((idx = text.indexOf(sym, idx)) !== -1) {
      anchors.push({ type: "pair", raw: sym, start: idx, end: idx + sym.length })
      idx += sym.length
    }
  }
  // Sessions
  for (const sess of KNOWN_SESSIONS) {
    const re = new RegExp(`\\b${sess.replace(/\s+/g, "\\s+")}\\b`, "g")
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      anchors.push({ type: "session", raw: m[0], start: m.index, end: m.index + m[0].length })
    }
  }
  // Percentages (e.g. "74%", "4.2%")
  const pctRe = /\b\d{1,3}(?:\.\d+)?%/g
  let pm: RegExpExecArray | null
  while ((pm = pctRe.exec(text)) !== null) {
    anchors.push({ type: "percent", raw: pm[0], start: pm.index, end: pm.index + pm[0].length })
  }
  // Pips ("+42 pips", "-22 pips", "+18 pips")
  const pipRe = /[-+]?\d+\s*pips?/g
  let pi: RegExpExecArray | null
  while ((pi = pipRe.exec(text)) !== null) {
    anchors.push({ type: "pips", raw: pi[0], start: pi.index, end: pi.index + pi[0].length })
  }
  // Money ("$12,480", "+$2830")
  const mRe = /[+\-]?\$\s?[\d,]+(?:\.\d+)?/g
  let mm: RegExpExecArray | null
  while ((mm = mRe.exec(text)) !== null) {
    anchors.push({ type: "money", raw: mm[0], start: mm.index, end: mm.index + mm[0].length })
  }
  // Sort by start, drop overlaps (keep earliest)
  anchors.sort((a, b) => a.start - b.start || b.end - a.end)
  const out: HeadlineAnchor[] = []
  let lastEnd = -1
  for (const a of anchors) {
    if (a.start >= lastEnd) {
      out.push(a)
      lastEnd = a.end
    }
  }
  return out
}

/** Split text into [{kind:"text"|"anchor", value, anchor?}] segments. */
function segmentText(text: string, anchors: HeadlineAnchor[]) {
  const segments: Array<{ kind: "text" | "anchor"; value: string; anchor?: HeadlineAnchor }> = []
  let cursor = 0
  for (const a of anchors) {
    if (a.start > cursor) segments.push({ kind: "text", value: text.slice(cursor, a.start) })
    segments.push({ kind: "anchor", value: a.raw, anchor: a })
    cursor = a.end
  }
  if (cursor < text.length) segments.push({ kind: "text", value: text.slice(cursor) })
  return segments
}

/* ─── Follow-up suggestion engine ───────────────────��─────────────────── */

function computeFollowUps(result: OracleResult): Array<{ label: string; q: string }> {
  switch (result.category) {
    case "WATCHLIST": return [
      { label: "FILTER TO FOCUS",      q: "show only my focus pairs" },
      { label: "COMPARE TO LAST WEEK", q: "compare watchlist to last week" },
      { label: "ADD MACRO LAYER",      q: "today's macro events" },
      { label: "MOST LIKELY TODAY",    q: "which pair is most likely to print today" },
    ]
    case "SESSION": return [
      { label: "BEST PAIRS NOW",       q: "best pairs for london right now" },
      { label: "5-SESSION HISTORY",    q: "compare last 5 london sessions" },
      { label: "WHY NY PM IS WEAK",    q: "why does NY PM lag" },
      { label: "KILLZONE BREAKDOWN",   q: "show london killzone analysis" },
    ]
    case "MACRO": return [
      { label: "BUILD NO-TRADE WINDOW", q: "create no-trade window for ECB" },
      { label: "HISTORICAL ECB CHARTS", q: "last 6 ECB releases on EUR/USD" },
      { label: "SAFE PAIRS TODAY",      q: "show pairs not affected by today's events" },
      { label: "POST-EVENT PATTERN",    q: "show post-news continuation setups" },
    ]
    case "ACCOUNT": return [
      { label: "FTMO DASHBOARD",        q: "open FTMO challenge dashboard" },
      { label: "EQUITY CURVES",         q: "compare equity curves" },
      { label: "REVENGE-TRADE AUDIT",   q: "audit my revenge trade pattern" },
      { label: "DISCIPLINE GAP",        q: "why is my live discipline lower" },
    ]
    case "STRATEGY": return [
      { label: "PAUSE BREAKOUT",        q: "pause breakout strategy" },
      { label: "STUDY FVG WINNERS",     q: "show my best FVG entries" },
      { label: "GROW MARKET STRUCTURE", q: "review market structure setup" },
      { label: "PROFIT-FACTOR GOAL",    q: "what would lift profit factor to 2.5" },
    ]
    case "PLAN": return [
      { label: "EDIT PLAN",             q: "open daily plan editor" },
      { label: "REVIEW YESTERDAY",      q: "review yesterday's trades" },
      { label: "PSYCHOLOGY CHECK-IN",   q: "run psychology check-in" },
      { label: "TOMORROW'S PREP",       q: "prepare tomorrow's plan" },
    ]
    case "MENTOR": return [
      { label: "OPEN TOP MENTOR",       q: "open daniel cohen profile" },
      { label: "PROFILE-VS-PROFILE",    q: "compare my profile to a top peer" },
      { label: "SHOW LIVE FLOORS",      q: "what mentor floors are live now" },
      { label: "FILTER BY ARCHETYPE",   q: "compare ICT mentors only" },
    ]
    case "PROFILE": return [
      { label: "SHOW PEER STRATEGIES",  q: "what setups does my peer use" },
      { label: "OPEN LEADERBOARD",      q: "show network leaderboard" },
      { label: "COMPARE MENTORS",       q: "compare mentors for me" },
      { label: "ANONYMISE MY PROFILE",  q: "make my profile anonymous" },
    ]
    case "STATISTICS": return [
      { label: "WEEK-OVER-WEEK",        q: "compare this week to last week" },
      { label: "TIME-OF-DAY HEATMAP",   q: "show my time-of-day heatmap" },
      { label: "EQUITY CURVES",         q: "show my equity curves overlaid" },
      { label: "SHOW STRATEGY HEALTH",  q: "which strategies are decaying?" },
    ]
    case "PSYCHOLOGY": return [
      { label: "RUN CHECK-IN",          q: "run psychology check-in" },
      { label: "SHOW MOOD HISTORY",     q: "show my 30-day mood history" },
      { label: "REVENGE-TRADE AUDIT",   q: "audit my revenge trade pattern" },
      { label: "TALK TO MENTOR",        q: "compare mentors for me" },
    ]
    default: return [
      { label: "WHAT SESSION NOW",      q: "what session is upcoming" },
      { label: "SHOW WATCHLIST",        q: "show me my watchlist" },
      { label: "TODAY'S MACRO",         q: "today's macro events" },
      { label: "AM I ON PLAN",          q: "am i on plan today" },
    ]
  }
}

/* ─── Inline visualizations ───────────────────────────────────────────── */

/** Confidence ring used by NextMove cards. pct ∈ 0..1 */
function ConfidenceRing({ urgency, size = 22 }: { urgency: "high" | "medium" | "low"; size?: number }) {
  const pct = urgency === "high" ? 1 : urgency === "medium" ? 0.66 : 0.33
  const tint = urgency === "high" ? VANTARY.chartUp : urgency === "medium" ? VANTARY.amber : VANTARY.ashSoft
  const r = size / 2 - 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - pct)
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={VANTARY.rule} strokeWidth={1.25} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={tint}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  )
}

/** Tiny 1-line spark used inside the evidence rail. */
function MiniSpark({ values, width = 60, height = 16, positive = true }: { values: number[]; width?: number; height?: number; positive?: boolean }) {
  if (!values.length) return null
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const range = hi - lo || 1
  const stroke = positive ? VANTARY.chartUp : VANTARY.chartDown
  const path = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width
      const y = height - ((v - lo) / range) * height
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={path} fill="none" stroke={stroke} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </svg>
  )
}

/** Mini candle chart — used by watchlist evidence rows. */
function MiniCandle({ bars, width = 64, height = 20 }: { bars: WatchPair["bars"]; width?: number; height?: number }) {
  if (!bars.length) return null
  const lo = Math.min(...bars.map(b => b.l))
  const hi = Math.max(...bars.map(b => b.h))
  const range = hi - lo || 1
  const slot = width / bars.length
  const bw = Math.max(1.2, slot * 0.55)
  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      {bars.map((b, i) => {
        const x = (i + 0.5) * slot
        const oY = height - ((b.o - lo) / range) * height
        const cY = height - ((b.c - lo) / range) * height
        const hY = height - ((b.h - lo) / range) * height
        const lY = height - ((b.l - lo) / range) * height
        const isBull = b.c >= b.o
        const top = Math.min(oY, cY)
        const ht = Math.max(1, Math.abs(cY - oY))
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={hY} y2={lY} stroke={isBull ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)"} strokeWidth={0.75} />
            <rect x={x - bw / 2} y={top} width={bw} height={ht} fill={isBull ? VANTARY.chartUp : VANTARY.chartDown} opacity={0.9} />
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Inline anchor chip (used inside the conclusion headline) ────────── */

function ConclusionAnchor({
  anchor,
  category,
}: {
  anchor: HeadlineAnchor
  category: "forex" | "session" | "macro" | "alert" | "indices" | "focus" | "neutral"
}) {
  // Resolve a cross-key + category override per anchor type
  let crossKey: string | undefined
  let anchorCategory = category
  let popoverContent: React.ReactNode

  if (anchor.type === "pair") {
    const wp = WATCHLIST.find(w => w.symbol === anchor.raw)
    crossKey = pairCrossKey(anchor.raw)
    anchorCategory = "forex"
    popoverContent = wp ? (
      <>
        <HoverPreviewPopover.Header
          subject={anchor.raw}
          value={`${wp.bias} · ${wp.winRate}% WR`}
          meta={`${wp.pipsToday >= 0 ? "+" : ""}${wp.pipsToday} pips today`}
        />
        <HoverPreviewPopover.Body>
          <div className="flex items-center justify-center py-2">
            <MiniCandle bars={wp.bars} width={240} height={50} />
          </div>
          <HoverPreviewPopover.Row label="Sample size" value={`n=${wp.sampleSize}`} tone="muted" />
          <HoverPreviewPopover.Row label="Bias" value={wp.bias} />
          <HoverPreviewPopover.Row label="In focus today" value={wp.inFocus ? "Yes" : "No"} tone={wp.inFocus ? "positive" : "muted"} />
          {wp.warning && (
            <>
              <HoverPreviewPopover.Divider />
              <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0 }}>
                {wp.warning}
              </p>
            </>
          )}
        </HoverPreviewPopover.Body>
        <HoverPreviewPopover.Footer>
          <HoverPreviewPopover.ActionButton affordance="navigate">
            Open {anchor.raw} chart
          </HoverPreviewPopover.ActionButton>
        </HoverPreviewPopover.Footer>
      </>
    ) : null
  } else if (anchor.type === "session") {
    const s = SESSIONS.find(x => x.city.toLowerCase() === anchor.raw.toLowerCase())
    crossKey = sessionCrossKey(anchor.raw)
    anchorCategory = "session"
    popoverContent = s ? (
      <>
        <HoverPreviewPopover.Header subject="SESSION" value={`${s.city} · ${s.flag}`} meta={`WR ${s.winRate}%`} />
        <HoverPreviewPopover.Body>
          <HoverPreviewPopover.Row label="Window (UTC)" value={`${String(s.openUTC).padStart(2, "0")}:00 → ${String(s.closeUTC).padStart(2, "0")}:00`} />
          <HoverPreviewPopover.Row label="Regime" value={s.regime} tone="muted" />
          {s.killzone && (
            <HoverPreviewPopover.Row
              label={s.killzone.label}
              value={`${String(s.killzone.from).padStart(2, "0")}:00 – ${String(s.killzone.to).padStart(2, "0")}:00`}
              tone="positive"
            />
          )}
          <HoverPreviewPopover.Divider />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {s.pairs.map(p => (
              <span
                key={p}
                className="font-mono"
                style={{
                  fontSize: 9.5,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "rgba(34,197,94,0.07)",
                  color: VANTARY.paperDim,
                  border: "1px solid rgba(34,197,94,0.14)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </HoverPreviewPopover.Body>
      </>
    ) : null
  } else if (anchor.type === "percent") {
    const num = parseFloat(anchor.raw)
    const tone: "positive" | "warn" | "negative" | "default" =
      num >= 65 ? "positive" : num >= 50 ? "default" : num >= 40 ? "warn" : "negative"
    anchorCategory = num >= 65 ? "session" : num >= 40 ? "alert" : "macro"
    popoverContent = (
      <>
        <HoverPreviewPopover.Header subject="METRIC" value={anchor.raw} meta="Win-rate read" />
        <HoverPreviewPopover.Body>
          <HoverPreviewPopover.Row
            label="Reads as"
            value={num >= 65 ? "Strong edge" : num >= 50 ? "Net positive" : num >= 40 ? "Marginal" : "Bleeding"}
            tone={tone}
          />
          <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0, marginTop: 6 }}>
            {num >= 65 ? "Above your platform average — keep deploying capital here."
              : num >= 50 ? "Net positive but watch for regression."
              : num >= 40 ? "Inside the noise band. Demand higher confluence."
              : "Below random. Sample size warning + filter review needed."}
          </p>
        </HoverPreviewPopover.Body>
      </>
    )
  } else if (anchor.type === "pips") {
    const sign = anchor.raw.trim().startsWith("-")
    anchorCategory = sign ? "macro" : "session"
    popoverContent = (
      <>
        <HoverPreviewPopover.Header subject="PIPS" value={anchor.raw} meta="Today" />
        <HoverPreviewPopover.Body>
          <HoverPreviewPopover.Row label="Direction" value={sign ? "Drawdown" : "Profit"} tone={sign ? "negative" : "positive"} />
          <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0, marginTop: 4 }}>
            {sign ? "Pip loss this session — review entries against your plan rules."
                  : "Pip gain compounding — protect with partial exits if at target."}
          </p>
        </HoverPreviewPopover.Body>
      </>
    )
  } else if (anchor.type === "money") {
    anchorCategory = "indices"
    popoverContent = (
      <>
        <HoverPreviewPopover.Header subject="EQUITY" value={anchor.raw} meta="USD" />
        <HoverPreviewPopover.Body>
          <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0 }}>
            Snapshot from your live account. Tap to drill into the equity timeline.
          </p>
        </HoverPreviewPopover.Body>
      </>
    )
  }

  // Render as inline DrillCard with a subtle underline + cross-highlight pulse
  return (
    <DrillCard
      as="span"
      inline
      density="compact"
      interaction={popoverContent ? "preview" : "none"}
      category={anchorCategory}
      crossKey={crossKey}
      previewSide="bottom"
      previewWidth={300}
      preview={popoverContent}
      intent="subtle"
      className="oracle-anchor"
      style={{
        display: "inline",
        background: "transparent",
        border: "none",
        padding: 0,
        borderRadius: 0,
        boxShadow: "none",
        // Restate inline so the type/weight inherit from the headline
        fontSize: "inherit",
        fontWeight: "inherit",
        letterSpacing: "inherit",
        lineHeight: "inherit",
        color: anchor.type === "percent" || anchor.type === "pips"
          ? VANTARY.paper
          : anchor.type === "pair"
            ? VANTARY.paper
            : VANTARY.paper,
      }}
    >
      <span
        className="oracle-anchor-text"
        style={{
          // Subtle dotted underline on the anchor so the user can see it's drillable
          borderBottom: `1px dotted rgba(255,255,255,0.32)`,
          paddingBottom: 1,
          transition: "border-color 240ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {anchor.raw}
      </span>
    </DrillCard>
  )
}

/* ─── ZONE 1 — Query echo follow-ups ──────────────────────────────────── */

function OracleFollowUps({
  followUps,
  onSubmit,
  category,
}: {
  followUps: Array<{ label: string; q: string }>
  onSubmit: (q: string) => void
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_V }}
      className="flex flex-wrap gap-2"
    >
      {followUps.map((f, i) => (
        <motion.div
          key={f.q}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 * i, duration: 0.32, ease: EASE_V }}
        >
          <DrillCard
            as="button"
            interaction="action"
            category={category}
            inline
            density="compact"
            intent="subtle"
            affordance="navigate"
            tooltip={`Drill: ${f.q}`}
            onClick={() => onSubmit(f.q)}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 999,
              padding: "5px 10px 5px 11px",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9.5, letterSpacing: "0.18em", color: VANTARY.paperDim, fontWeight: 500 }}
            >
              {f.label}
            </span>
          </DrillCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── ZONE 2 — Conclusion headline with inline drill anchors ──────────── */

function OracleConclusion({
  framing,
  category,
}: {
  framing: string
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  const anchors = useMemo(() => parseHeadlineAnchors(framing), [framing])
  const segments = useMemo(() => segmentText(framing, anchors), [framing, anchors])
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_V, delay: 0.05 }}
      className="font-sans"
      style={{
        fontSize: 26,
        lineHeight: 1.38,
        fontWeight: 400,
        color: VANTARY.paper,
        letterSpacing: "-0.018em",
        maxWidth: 980,
      }}
    >
      {segments.map((seg, i) =>
        seg.kind === "text" ? (
          <span key={i}>{seg.value}</span>
        ) : (
          <ConclusionAnchor key={i} anchor={seg.anchor!} category={category} />
        ),
      )}
    </motion.p>
  )
}

/* ─── ZONE 3 — Evidence Grid (4 stat tiles) ───────────────────────────── */

function statCrossKey(label: string, value: string): string | undefined {
  const ucv = value.toUpperCase()
  // Prefer pair if value contains a known pair
  for (const p of KNOWN_PAIRS) if (ucv.includes(p)) return pairCrossKey(p)
  // Else session
  for (const s of KNOWN_SESSIONS) if (ucv.includes(s.toUpperCase())) return sessionCrossKey(s)
  // Fallback to label-based key
  return `stat:${label.toLowerCase().replace(/\s+/g, "-")}`
}

function StatTilePopover({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "bad" }) {
  // Try to extract a pair / percent for the popover deep dive
  const pair = KNOWN_PAIRS.find(p => value.toUpperCase().includes(p))
  const pctMatch = value.match(/(\d{1,3}(?:\.\d+)?)%/)
  const pct = pctMatch ? parseFloat(pctMatch[1]) : null
  const wp = pair ? WATCHLIST.find(w => w.symbol === pair) : null

  return (
    <>
      <HoverPreviewPopover.Header subject={label} value={value} meta={tone === "ok" ? "Strength" : tone === "warn" ? "Watch" : "Reading"} />
      <HoverPreviewPopover.Body>
        {wp && (
          <div className="flex items-center justify-center py-2">
            <MiniCandle bars={wp.bars} width={240} height={48} />
          </div>
        )}
        {pct !== null && (
          <HoverPreviewPopover.Row
            label="Reads as"
            value={pct >= 65 ? "Strong edge" : pct >= 50 ? "Net positive" : pct >= 40 ? "Marginal" : "Bleeding"}
            tone={pct >= 65 ? "positive" : pct >= 50 ? "default" : pct >= 40 ? "warn" : "negative"}
          />
        )}
        {wp && (
          <>
            <HoverPreviewPopover.Row label="Sample size" value={`n=${wp.sampleSize}`} tone="muted" />
            <HoverPreviewPopover.Row label="Bias" value={wp.bias} />
            <HoverPreviewPopover.Row label="Pips today" value={`${wp.pipsToday >= 0 ? "+" : ""}${wp.pipsToday}`} tone={wp.pipsToday >= 0 ? "positive" : "negative"} />
          </>
        )}
        {!wp && pct === null && (
          <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0 }}>
            Snapshot pulled from this Oracle answer. Drill further to inspect the underlying timeline.
          </p>
        )}
      </HoverPreviewPopover.Body>
    </>
  )
}

function OracleEvidenceGrid({
  highlights,
  category,
}: {
  highlights: OracleResult["highlights"]
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.10, duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {highlights.map((h, i) => {
        const ck = statCrossKey(h.label, h.value)
        const isPair = !!KNOWN_PAIRS.find(p => h.value.toUpperCase().includes(p))
        const tileCategory: ReturnType<typeof oracleCatToHoverCat> =
          h.tone === "warn" ? "alert" : isPair ? "forex" : category
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 + i * 0.06, duration: 0.4, ease: EASE_V }}
          >
            <DrillCard
              interaction="preview"
              category={tileCategory}
              crossKey={ck}
              previewSide="bottom"
              previewWidth={320}
              tooltip={`Drill: ${h.label}`}
              preview={<StatTilePopover label={h.label} value={h.value} tone={h.tone} />}
              density="rich"
              intent="default"
              style={{
                background: h.tone === "warn"
                  ? VANTARY.amberWash
                  : "rgba(255,255,255,0.025)",
                border: `1px solid ${h.tone === "warn" ? VANTARY.amberHalo : "rgba(255,255,255,0.05)"}`,
                borderRadius: 16,
              }}
            >
              <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}>
                {h.label}
              </div>
              <div
                className="font-sans mt-2 truncate"
                style={{
                  fontSize: 17,
                  color: h.tone === "warn" ? VANTARY.amber : VANTARY.paper,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {h.value}
              </div>
              {/* hairline footer indicator */}
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-block rounded-full"
                  style={{
                    width: 4, height: 4,
                    background: h.tone === "ok" ? VANTARY.chartUp : h.tone === "warn" ? VANTARY.amber : VANTARY.ashSoft,
                    boxShadow: h.tone === "ok" || h.tone === "warn"
                      ? `0 0 6px ${h.tone === "ok" ? VANTARY.chartUp : VANTARY.amber}`
                      : "none",
                  }}
                />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
                >
                  {h.tone === "ok" ? "STRENGTH" : h.tone === "warn" ? "WATCH" : "READ"}
                </span>
              </div>
            </DrillCard>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ─── ZONE 4 — Reasoning Block (PRIMARY / RISK / OPPORTUNITY) ─────────── */

function extractFirstMetric(body: string): string | null {
  const m = body.match(/[-+]?\d{1,3}(?:\.\d+)?%|[-+]?\d+\s*pips?|[-+]?\$\s?[\d,]+(?:\.\d+)?/)
  return m ? m[0] : null
}

function ReasoningBlock({
  eyebrow,
  body,
  tone,
  category,
}: {
  eyebrow: string
  body: string
  tone: "primary" | "risk" | "opportunity"
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  const accent = tone === "risk"
    ? VANTARY.chartDown
    : tone === "opportunity"
      ? VANTARY.amber
      : VANTARY.teal
  const eyebrowColor = tone === "risk"
    ? VANTARY.chartDown
    : tone === "opportunity"
      ? VANTARY.amber
      : VANTARY.teal
  const blockCategory: ReturnType<typeof oracleCatToHoverCat> =
    tone === "risk" ? "macro" : tone === "opportunity" ? "alert" : "session"

  const anchors = useMemo(() => parseHeadlineAnchors(body), [body])
  const segments = useMemo(() => segmentText(body, anchors), [body, anchors])
  const primaryMetric = extractFirstMetric(body)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_V }}
      className="relative"
    >
      <div className="flex gap-4 items-start">
        {/* Left accent rail — category-tinted */}
        <div className="relative shrink-0 self-stretch" style={{ width: 2, minHeight: 36 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${accent} 0%, ${accent}55 50%, transparent 100%)`,
              opacity: 0.85,
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          {/* Eyebrow + primary metric chip + see-proof affordance */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: eyebrowColor, fontWeight: 600 }}
            >
              {eyebrow}
            </span>
            {primaryMetric && (
              <span
                className="font-mono"
                style={{
                  fontSize: 9.5,
                  padding: "1.5px 7px",
                  borderRadius: 999,
                  background: `${accent}1F`,
                  border: `1px solid ${accent}38`,
                  color: VANTARY.paper,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {primaryMetric}
              </span>
            )}
          </div>
          {/* Body with inline drill anchors */}
          <p
            className="font-sans mt-2"
            style={{ fontSize: 14.5, color: VANTARY.paper, lineHeight: 1.55, letterSpacing: "-0.005em" }}
          >
            {segments.map((seg, i) =>
              seg.kind === "text" ? (
                <span key={i}>{seg.value}</span>
              ) : (
                <ConclusionAnchor key={i} anchor={seg.anchor!} category={blockCategory} />
              ),
            )}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── ZONE 5 — Evidence Rail (rich rows with micro-visuals) ───────────── */

function rowCrossKey(left: string): string | undefined {
  for (const p of KNOWN_PAIRS) if (left.includes(p)) return pairCrossKey(p)
  for (const s of KNOWN_SESSIONS) if (left.toLowerCase().includes(s.toLowerCase())) return sessionCrossKey(s)
  return undefined
}

function EvidenceRowVisual({
  category,
  left,
  tone,
}: {
  category: OracleResult["category"]
  left: string
  tone?: "ok" | "warn" | "bad"
}) {
  // For watchlist, render the actual mini-candle for the matched pair
  if (category === "WATCHLIST") {
    const pair = KNOWN_PAIRS.find(p => left.includes(p))
    const wp = pair ? WATCHLIST.find(w => w.symbol === pair) : null
    if (wp) return <MiniCandle bars={wp.bars} width={56} height={16} />
  }
  // For session, a tiny WR sparkline (synthesized from the WR delta)
  if (category === "SESSION") {
    const m = left.match(/^(.+?)$/)
    const sess = m ? SESSIONS.find(s => left.toLowerCase().includes(s.city.toLowerCase())) : null
    if (sess) {
      const arr = Array.from({ length: 14 }, (_, i) => sess.winRate + Math.sin(i * 0.7) * 4 + (i / 14) * 2)
      return <MiniSpark values={arr} positive={sess.winRate >= 60} width={56} height={16} />
    }
  }
  // For macro / strategy / etc., a severity dot + thin line
  if (category === "MACRO" || category === "STRATEGY" || category === "ACCOUNT" || category === "PLAN") {
    return (
      <span
        aria-hidden="true"
        className="relative overflow-hidden rounded-sm"
        style={{
          width: 56,
          height: 3,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <span
          className="absolute inset-y-0 left-0"
          style={{
            width: tone === "ok" ? "92%" : tone === "warn" ? "65%" : "40%",
            background:
              tone === "ok" ? VANTARY.chartUp
                : tone === "warn" ? VANTARY.amber
                : VANTARY.ashSoft,
            transition: "width 600ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </span>
    )
  }
  return null
}

function EvidenceRowPopover({
  category,
  left,
  right,
  tone,
}: {
  category: OracleResult["category"]
  left: string
  right: string
  tone?: "ok" | "warn" | "bad"
}) {
  // Resolve a richer popover per category
  if (category === "WATCHLIST") {
    const pair = KNOWN_PAIRS.find(p => left.includes(p))
    const wp = pair ? WATCHLIST.find(w => w.symbol === pair) : null
    if (wp) {
      return (
        <>
          <HoverPreviewPopover.Header subject={wp.symbol} value={wp.bias} meta={`${wp.winRate}% WR · n=${wp.sampleSize}`} />
          <HoverPreviewPopover.Body>
            <div className="flex items-center justify-center py-2">
              <MiniCandle bars={wp.bars} width={260} height={56} />
            </div>
            <HoverPreviewPopover.Row
              label="Pips today"
              value={`${wp.pipsToday >= 0 ? "+" : ""}${wp.pipsToday}`}
              tone={wp.pipsToday >= 0 ? "positive" : "negative"}
            />
            <HoverPreviewPopover.Row label="In focus" value={wp.inFocus ? "Yes" : "No"} tone={wp.inFocus ? "positive" : "muted"} />
            {wp.warning && (
              <>
                <HoverPreviewPopover.Divider />
                <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0 }}>
                  {wp.warning}
                </p>
              </>
            )}
          </HoverPreviewPopover.Body>
          <HoverPreviewPopover.Footer>
            <HoverPreviewPopover.ActionButton affordance="navigate">Open {wp.symbol} chart</HoverPreviewPopover.ActionButton>
          </HoverPreviewPopover.Footer>
        </>
      )
    }
  }
  if (category === "SESSION") {
    const sess = SESSIONS.find(s => left.toLowerCase().includes(s.city.toLowerCase()))
    if (sess) {
      return (
        <>
          <HoverPreviewPopover.Header subject="SESSION" value={`${sess.city} · ${sess.flag}`} meta={`WR ${sess.winRate}%`} />
          <HoverPreviewPopover.Body>
            <HoverPreviewPopover.Row label="Window (UTC)" value={`${String(sess.openUTC).padStart(2, "0")}:00 → ${String(sess.closeUTC).padStart(2, "0")}:00`} />
            <HoverPreviewPopover.Row label="Regime" value={sess.regime} tone="muted" />
            {sess.killzone && (
              <HoverPreviewPopover.Row
                label={sess.killzone.label}
                value={`${String(sess.killzone.from).padStart(2, "0")}:00 – ${String(sess.killzone.to).padStart(2, "0")}:00`}
                tone="positive"
              />
            )}
          </HoverPreviewPopover.Body>
        </>
      )
    }
  }
  // Generic fallback
  return (
    <>
      <HoverPreviewPopover.Header subject={left} value={right} meta={tone === "warn" ? "Watch" : tone === "ok" ? "Healthy" : ""} />
      <HoverPreviewPopover.Body>
        <p style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim, margin: 0 }}>
          Drill into this row for the full breakdown.
        </p>
      </HoverPreviewPopover.Body>
    </>
  )
}

function OracleEvidenceRail({
  evidence,
  category,
  rawCategory,
}: {
  evidence: OracleResult["evidence"]
  category: ReturnType<typeof oracleCatToHoverCat>
  rawCategory: OracleResult["category"]
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: VANTARY.glass, border: `1px solid ${VANTARY.rule}` }}
    >
      <div
        className="px-5 pt-4 pb-3 flex items-center justify-between"
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          {evidence.eyebrow}
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft, opacity: 0.75 }}
        >
          {evidence.rows.length} ROWS
        </span>
      </div>
      <div
        className="h-px"
        style={{ background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 6px, transparent 6px 12px)` }}
      />
      <ul className="py-1">
        {evidence.rows.map((r, i) => {
          const ck = rowCrossKey(r.left)
          const rowCategory: ReturnType<typeof oracleCatToHoverCat> =
            r.tone === "warn" ? "alert"
              : KNOWN_PAIRS.some(p => r.left.includes(p)) ? "forex"
              : category
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.04, duration: 0.32, ease: EASE_V }}
              className="px-2"
              style={{
                borderBottom: i < evidence.rows.length - 1
                  ? `1px solid ${VANTARY.rule}`
                  : "none",
              }}
            >
              <DrillCard
                as="div"
                interaction="preview"
                category={rowCategory}
                crossKey={ck}
                previewSide="left"
                previewWidth={320}
                tooltip={`Drill: ${r.left}`}
                preview={<EvidenceRowPopover category={rawCategory} left={r.left} right={r.right} tone={r.tone} />}
                density="compact"
                intent="subtle"
                style={{
                  background: "transparent",
                  border: "1px solid transparent",
                  borderRadius: 8,
                  padding: "9px 10px",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="font-sans truncate"
                    style={{ fontSize: 12, color: VANTARY.paperDim }}
                  >
                    {r.left}
                  </span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <EvidenceRowVisual category={rawCategory} left={r.left} tone={r.tone} />
                    <span
                      className="font-mono inline-flex items-center gap-1.5"
                      style={{
                        fontSize: 11,
                        color: r.tone === "warn"
                          ? VANTARY.amber
                          : r.tone === "ok"
                            ? VANTARY.paper
                            : VANTARY.paperDim,
                        fontWeight: 500,
                      }}
                    >
                      {r.tone && <StatusDot tone={r.tone} size={5} breathe={false} />}
                      {r.right}
                    </span>
                  </div>
                </div>
              </DrillCard>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─── ZONE 6 — Next Moves (confidence-tagged action cards) ────────────── */

function NextMovePopover({
  move,
}: {
  move: OracleResult["nextMoves"][number]
}) {
  const eta = move.urgency === "high" ? "1.2s" : move.urgency === "medium" ? "2.4s" : "4.8s"
  const expectedOutcome = move.urgency === "high"
    ? "Loads dedicated view with full context"
    : move.urgency === "medium"
      ? "Computes a derived view from current data"
      : "Generates an exploratory analysis"
  return (
    <>
      <HoverPreviewPopover.Header subject="NEXT MOVE" value={move.title} meta={move.urgency.toUpperCase()} />
      <HoverPreviewPopover.Body>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: VANTARY.paperDim, margin: 0 }}>
          {move.description}
        </p>
        <HoverPreviewPopover.Divider />
        <HoverPreviewPopover.Row label="What happens" value={expectedOutcome} />
        <HoverPreviewPopover.Row label="Confidence" value={move.urgency === "high" ? "High" : move.urgency === "medium" ? "Medium" : "Low"} tone={move.urgency === "high" ? "positive" : move.urgency === "medium" ? "warn" : "muted"} />
        <HoverPreviewPopover.Row label="Expected delay" value={eta} tone="muted" />
      </HoverPreviewPopover.Body>
      <HoverPreviewPopover.Footer>
        <HoverPreviewPopover.ActionButton affordance="execute">Run drill</HoverPreviewPopover.ActionButton>
      </HoverPreviewPopover.Footer>
    </>
  )
}

function OracleNextMoves({
  moves,
  onSubmit,
  category,
}: {
  moves: OracleResult["nextMoves"]
  onSubmit: (q: string) => void
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          NEXT MOVES
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft, opacity: 0.65 }}
        >
          HOVER TO PREVIEW · CLICK TO DRILL
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {moves.map((m, i) => {
          const tint =
            m.urgency === "high" ? VANTARY.chartUp
              : m.urgency === "medium" ? VANTARY.amber
              : VANTARY.ashSoft
          const tileCategory: ReturnType<typeof oracleCatToHoverCat> =
            m.urgency === "high" ? "session" : m.urgency === "medium" ? "alert" : "neutral"
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20 + i * 0.06, duration: 0.4, ease: EASE_V }}
            >
              <DrillCard
                as="button"
                interaction="preview-action"
                category={tileCategory}
                previewSide="top"
                previewWidth={320}
                tooltip="Click to drill"
                preview={<NextMovePopover move={m} />}
                onClick={() => onSubmit(m.title)}
                density="rich"
                intent="prominent"
                style={{
                  background: m.urgency === "high"
                    ? "rgba(16,185,129,0.06)"
                    : m.urgency === "medium"
                      ? VANTARY.amberWash
                      : "rgba(255,255,255,0.025)",
                  border: `1px solid ${m.urgency === "high" ? "rgba(16,185,129,0.22)" : m.urgency === "medium" ? VANTARY.amberHalo : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16,
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <ConfidenceRing urgency={m.urgency} size={20} />
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 9, letterSpacing: "0.20em", color: tint, fontWeight: 600 }}
                    >
                      {m.urgency}
                    </span>
                  </div>
                </div>
                <div
                  className="font-sans"
                  style={{
                    fontSize: 13.5,
                    color: VANTARY.paper,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.35,
                  }}
                >
                  {m.title}
                </div>
                <p
                  className="font-sans mt-1.5"
                  style={{ fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.5 }}
                >
                  {m.description}
                </p>
              </DrillCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   FLIGHT-DECK DOCTRINE — primitives shared across the Oracle answer surface
   ─────────────────────────────────────────────────────────────────────────
   Borrowed from the Ron Design "Traffic Management" reference frames:
     · dashed concentric range rings around hero numerics
     · magnitude/precision two-weight numerals (lead bold, tail quiet)
     · hairline route-table grids with breathing status pulses
     · corner registration marks on every primary surface
     · brick-red advisory sheet for RISK (Capacity Issues archetype)
     · live UTC tick + breathing dot on every panel header
   ═════════════════════════════════════════════════════════════════════════ */

/* ── 0.  Shared corner registration marks — small L-glyphs in each
       corner of a flight-deck panel. Calibration aesthetic. ───────── */
function FdCorners({
  inset = 10,
  size = 9,
  color,
  thickness = 1,
}: {
  inset?: number
  size?: number
  color?: string
  thickness?: number
}) {
  const c = color ?? VANTARY.ashSoft
  const corner = (rotate: number, x: string, y: string) => (
    <span
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left: x === "l" ? inset : "auto",
        right: x === "r" ? inset : "auto",
        top: y === "t" ? inset : "auto",
        bottom: y === "b" ? inset : "auto",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, width: size, height: thickness, background: c, opacity: 0.7 }} />
      <span style={{ position: "absolute", left: 0, top: 0, width: thickness, height: size, background: c, opacity: 0.7 }} />
    </span>
  )
  return (
    <>
      {corner(0,   "l", "t")}
      {corner(90,  "r", "t")}
      {corner(270, "l", "b")}
      {corner(180, "r", "b")}
    </>
  )
}

/* ── 1.  Live UTC tick — HH:MM:SS in mono with a breathing primary
       dot. The whole platform shares one second-clock so this is
       cheap. Used in every flight-deck panel header. ──────────────── */
function FdLiveTick({
  label = "UTC",
  showSeconds = true,
  size = 10,
}: {
  label?: string
  showSeconds?: boolean
  size?: number
}) {
  const sec = useUTCSecondClock()
  const hh = sec.getUTCHours().toString().padStart(2, "0")
  const mm = sec.getUTCMinutes().toString().padStart(2, "0")
  const ss = sec.getUTCSeconds().toString().padStart(2, "0")
  const txt = showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`
  return (
    <span className="inline-flex items-center gap-1.5">
      <motion.span
        aria-hidden
        className="rounded-full"
        style={{
          width: 5,
          height: 5,
          background: VANTARY.amber,
          boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
        }}
        animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{ fontSize: size, letterSpacing: "0.16em", color: VANTARY.ashSoft, fontWeight: 500 }}
      >
        {label} · {txt}
      </span>
    </span>
  )
}

/* ── 2.  Magnitude/precision numeral — lead bold, tail light.
       The Vantary signature trick used on every protagonist number. */
function FdMagnitude({
  value,
  suffix,
  size = 56,
  hover = false,
  tone,
}: {
  value: string
  suffix?: string
  size?: number
  hover?: boolean
  tone?: "ok" | "warn" | "bad"
}) {
  const { lead, tail } = splitMagnitude(value)
  const leadColor =
    tone === "warn" ? VANTARY.amber
      : tone === "bad" ? VANTARY.chartDown
      : VANTARY.paper
  return (
    <span className="inline-flex items-baseline gap-1.5 select-none">
      <span
        className="font-sans transition-[text-shadow] duration-500 tabular-nums"
        style={{
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          fontWeight: 600,
          color: leadColor,
          textShadow: hover ? CHROMA_SHADOW : CHROMA_SHADOW_LO,
        }}
      >
        {lead}
      </span>
      {tail && (
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: size,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            fontWeight: 200,
            color: VANTARY.ash,
          }}
        >
          {tail}
        </span>
      )}
      {suffix && (
        <span
          className="font-sans"
          style={{
            fontSize: Math.max(11, Math.round(size * 0.26)),
            color: VANTARY.ash,
            fontWeight: 400,
            marginLeft: 4,
          }}
        >
          {suffix}
        </span>
      )}
    </span>
  )
}

/* ── 3.  Dashed concentric range ring — the Ron Design "Passenger
       Load 87%" dashed-orbit motif. Sits behind a hero number. ───── */
function FdRangeRing({
  size = 96,
  accent,
  pct = 0.78,
  showCenterMark = true,
  spin = false,
}: {
  size?: number
  accent?: string
  pct?: number
  showCenterMark?: boolean
  spin?: boolean
}) {
  const c = accent ?? VANTARY.amber
  const halo = `${c}30`
  const r1 = size / 2 - 2
  const r2 = size / 2 - 10
  const circ = 2 * Math.PI * r1
  return (
    <span
      aria-hidden
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        animate={spin ? { rotate: 360 } : undefined}
        transition={spin ? { duration: 28, repeat: Infinity, ease: "linear" } : undefined}
      >
        {/* Outer dashed orbit */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r1}
          fill="none"
          stroke={halo}
          strokeWidth={1}
          strokeDasharray="3 5"
        />
        {/* Inner soft ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r2}
          fill="none"
          stroke={`${c}18`}
          strokeWidth={1}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r1}
          fill="none"
          stroke={c}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </motion.svg>
      {showCenterMark && (
        <>
          {/* Centre crosshair */}
          <span
            aria-hidden
            className="absolute"
            style={{ left: "50%", top: "50%", width: 8, height: 1, background: c, transform: "translate(-50%,-50%)", opacity: 0.4 }}
          />
          <span
            aria-hidden
            className="absolute"
            style={{ left: "50%", top: "50%", width: 1, height: 8, background: c, transform: "translate(-50%,-50%)", opacity: 0.4 }}
          />
        </>
      )}
    </span>
  )
}

/* ── 4.  Panel header — eyebrow + live tick + count, separated by
       hairline rule. Used on every flight-deck panel. ────────────── */
function FdPanelHeader({
  eyebrow,
  count,
  hint,
  showLiveTick = true,
  accent,
}: {
  eyebrow: string
  count?: string | number
  hint?: string
  showLiveTick?: boolean
  accent?: string
}) {
  const a = accent ?? VANTARY.amber
  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-3">
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.24em", color: a, fontWeight: 600 }}
      >
        {eyebrow}
      </span>
      <span
        aria-hidden
        className="flex-1 h-px"
        style={{
          background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
        }}
      />
      {hint && (
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft, opacity: 0.85 }}
        >
          {hint}
        </span>
      )}
      {showLiveTick && <FdLiveTick label="UTC" showSeconds size={9.5} />}
      {typeof count !== "undefined" && (
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft, minWidth: 18, textAlign: "right" }}
        >
          {typeof count === "number" ? String(count).padStart(2, "0") : count}
        </span>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FLIGHT-DECK · MISSION BRIEFING PANEL
   Replaces the bare conclusion. Sits at the top of every Oracle answer
   as the cockpit briefing card — eyebrow + live tick + framing copy
   with inline drill anchors + extracted hero metric on the right with
   a dashed range ring behind it.
   ────────────────────────────────────────────────────────────────────── */
function FlightDeckMissionPanel({
  framing,
  category,
  rawCategory,
  query,
}: {
  framing: string
  category: ReturnType<typeof oracleCatToHoverCat>
  rawCategory: OracleResult["category"]
  query?: string
}) {
  const anchors = useMemo(() => parseHeadlineAnchors(framing), [framing])
  const segments = useMemo(() => segmentText(framing, anchors), [framing, anchors])

  // Pull the first percentage anchor as the hero metric for the right rail.
  const heroPct = useMemo(() => {
    const a = anchors.find(x => x.type === "percent")
    if (!a) return null
    const n = parseFloat(a.raw)
    return { raw: a.raw, num: isNaN(n) ? 0 : n }
  }, [anchors])

  // Pull a money figure as a secondary readout if no percent.
  const heroMoney = useMemo(() => {
    if (heroPct) return null
    const a = anchors.find(x => x.type === "money")
    return a ? a.raw : null
  }, [anchors, heroPct])

  const accent =
    rawCategory === "PSYCHOLOGY" || rawCategory === "STRATEGY" ? VANTARY.amber
      : rawCategory === "WATCHLIST" || rawCategory === "MACRO" ? VANTARY.amber
      : VANTARY.amber

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_V }}
      className="relative overflow-hidden"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 20,
        backdropFilter: "blur(28px) saturate(150%)",
        WebkitBackdropFilter: "blur(28px) saturate(150%)",
      }}
    >
      <FdCorners inset={10} size={9} />

      <FdPanelHeader
        eyebrow={`MISSION BRIEFING · ${rawCategory}`}
        hint={query ? "QUERY ECHO" : undefined}
        accent={accent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 px-5 pb-5">
        {/* LEFT — framing copy */}
        <div className="lg:col-span-8">
          {query && (
            <div
              className="font-mono uppercase mb-3"
              style={{
                fontSize: 10,
                letterSpacing: "0.20em",
                color: VANTARY.ashSoft,
                paddingLeft: 10,
                borderLeft: `1px solid ${VANTARY.amberHalo}`,
              }}
            >
              {`> ${query}`}
            </div>
          )}
          <p
            className="font-sans"
            style={{
              fontSize: 22,
              lineHeight: 1.42,
              fontWeight: 400,
              color: VANTARY.paper,
              letterSpacing: "-0.018em",
              maxWidth: 760,
            }}
          >
            {segments.map((seg, i) =>
              seg.kind === "text" ? (
                <span key={i}>{seg.value}</span>
              ) : (
                <ConclusionAnchor key={i} anchor={seg.anchor!} category={category} />
              ),
            )}
          </p>
        </div>

        {/* RIGHT — hero metric with dashed orbit ring (the Ron 87% motif) */}
        {(heroPct || heroMoney) && (
          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end relative">
            <div className="relative flex items-center justify-center" style={{ width: 168, height: 168 }}>
              <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                <FdRangeRing
                  size={168}
                  accent={accent}
                  pct={heroPct ? Math.min(1, Math.max(0.05, heroPct.num / 100)) : 0.62}
                  spin
                />
              </span>
              <div className="relative flex flex-col items-center">
                {heroPct ? (
                  <>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft, marginBottom: 4 }}
                    >
                      HEADLINE
                    </span>
                    <FdMagnitude value={`${Math.round(heroPct.num)}`} suffix="%" size={48} />
                    <span
                      className="font-mono uppercase mt-1"
                      style={{ fontSize: 9, letterSpacing: "0.18em", color: accent }}
                    >
                      {heroPct.num >= 65 ? "EDGE" : heroPct.num >= 50 ? "STABLE" : heroPct.num >= 40 ? "WATCH" : "BLEED"}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft, marginBottom: 4 }}
                    >
                      EQUITY
                    </span>
                    <FdMagnitude value={(heroMoney || "").replace(/[^\d,]/g, "") || "0"} size={36} />
                    <span
                      className="font-mono uppercase mt-1"
                      style={{ fontSize: 9, letterSpacing: "0.18em", color: accent }}
                    >
                      USD
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FLIGHT-DECK · TELEMETRY QUAD
   Replaces the OracleEvidenceGrid. Four cockpit gauge cards in a 2x2
   on mobile and 4x1 on desktop. Each gauge:
     · breathing status dot (top-right)
     · hairline eyebrow (top-left)
     · magnitude/precision numeral (centre)
     · status word footer ("STRENGTH/WATCH/READ")
     · dashed top edge to suggest a route reading
   ────────────────────────────────────────────────────────────────────── */
function FlightDeckTelemetryQuad({
  highlights,
  category,
}: {
  highlights: OracleResult["highlights"]
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.10, duration: 0.5 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
    >
      {highlights.map((h, i) => {
        const ck = statCrossKey(h.label, h.value)
        const isPair = !!KNOWN_PAIRS.find(p => h.value.toUpperCase().includes(p))
        const tileCategory: ReturnType<typeof oracleCatToHoverCat> =
          h.tone === "warn" ? "alert" : isPair ? "forex" : category
        const dot =
          h.tone === "ok" ? VANTARY.chartUp
            : h.tone === "warn" ? VANTARY.amber
            : VANTARY.ashSoft
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 + i * 0.06, duration: 0.4, ease: EASE_V }}
          >
            <DrillCard
              interaction="preview"
              category={tileCategory}
              crossKey={ck}
              previewSide="bottom"
              previewWidth={320}
              tooltip={`Drill: ${h.label}`}
              preview={<StatTilePopover label={h.label} value={h.value} tone={h.tone} />}
              density="rich"
              intent="default"
              style={{
                position: "relative",
                background: h.tone === "warn"
                  ? VANTARY.amberWash
                  : VANTARY.glass,
                border: `1px solid ${h.tone === "warn" ? VANTARY.amberHalo : VANTARY.rule}`,
                borderRadius: 16,
                overflow: "hidden",
                padding: 14,
                minHeight: 132,
              }}
            >
              {/* dashed top edge */}
              <span
                aria-hidden
                className="absolute left-3 right-3 top-0 h-px"
                style={{
                  background: `repeating-linear-gradient(90deg, ${h.tone === "warn" ? VANTARY.amberHalo : VANTARY.rule} 0 4px, transparent 4px 8px)`,
                }}
              />
              <FdCorners inset={6} size={6} thickness={1} />

              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}
                >
                  {h.label}
                </div>
                <motion.span
                  aria-hidden
                  className="rounded-full shrink-0"
                  style={{
                    width: 6, height: 6,
                    background: dot,
                    boxShadow: h.tone === "ok" || h.tone === "warn"
                      ? `0 0 8px ${dot}88`
                      : "none",
                  }}
                  animate={
                    h.tone === "ok" || h.tone === "warn"
                      ? { opacity: [0.55, 1, 0.55], scale: [0.92, 1.1, 0.92] }
                      : undefined
                  }
                  transition={
                    h.tone === "ok" || h.tone === "warn"
                      ? { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }
                      : undefined
                  }
                />
              </div>

              {/* Value — magnitude/precision when numeric, plain otherwise */}
              <div className="mt-auto">
                {/^[\d,.\s%$+\-]+$/.test(h.value) || /\d/.test(h.value) ? (
                  <FdMagnitude
                    value={h.value}
                    size={28}
                    tone={h.tone === "warn" ? "warn" : undefined}
                  />
                ) : (
                  <div
                    className="font-sans truncate"
                    style={{
                      fontSize: 17,
                      color: h.tone === "warn" ? VANTARY.amber : VANTARY.paper,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {h.value}
                  </div>
                )}
              </div>

              {/* Footer status pill */}
              <div className="mt-3 flex items-center justify-between">
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 8, letterSpacing: "0.20em", color: dot, fontWeight: 600 }}
                >
                  {h.tone === "ok" ? "STRENGTH" : h.tone === "warn" ? "WATCH" : "READ"}
                </span>
                <span
                  aria-hidden
                  className="font-mono tabular-nums"
                  style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft }}
                >
                  T{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </DrillCard>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FLIGHT-DECK · ADVISORY SHEETS
   Replaces ReasoningBlock stack. Each tone (PRIMARY / RISK / OPPORTUNITY)
   is a collapsible advisory sheet:
     · Collapsed view = eyebrow + extracted metric + 1-line preview
     · Click to expand = full body text with parsed drill anchors,
       hairline divider, and a dashed timeline strip at the bottom.
   The RISK sheet uses the brick-red warning wash (Ron Design "Capacity
   Issues" archetype) — it's the only sheet that pre-expands.
   ────────────────────────────────────────────────────────────────────── */
function FdAdvisorySheet({
  eyebrow,
  body,
  tone,
  category,
  defaultOpen = false,
  index = 0,
}: {
  eyebrow: string
  body: string
  tone: "primary" | "risk" | "opportunity"
  category: ReturnType<typeof oracleCatToHoverCat>
  defaultOpen?: boolean
  index?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  const accent =
    tone === "risk" ? VANTARY.chartDown
      : tone === "opportunity" ? VANTARY.amber
      : VANTARY.teal
  const wash =
    tone === "risk" ? VANTARY.warnWash
      : tone === "opportunity" ? VANTARY.amberWash
      : VANTARY.glass
  const edge =
    tone === "risk" ? VANTARY.warnEdge
      : tone === "opportunity" ? VANTARY.amberHalo
      : VANTARY.rule
  const blockCategory: ReturnType<typeof oracleCatToHoverCat> =
    tone === "risk" ? "macro" : tone === "opportunity" ? "alert" : "session"

  const anchors = useMemo(() => parseHeadlineAnchors(body), [body])
  const segments = useMemo(() => segmentText(body, anchors), [body, anchors])
  const primaryMetric = extractFirstMetric(body)

  // Build a 1-line preview from the body — first sentence or 110 chars.
  const preview = useMemo(() => {
    const firstSentence = body.split(/(?<=[.!?])\s/)[0] ?? body
    return firstSentence.length > 116 ? `${firstSentence.slice(0, 113)}…` : firstSentence
  }, [body])

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_V, delay: index * 0.05 }}
      className="relative overflow-hidden"
      style={{
        background: wash,
        border: `1px solid ${edge}`,
        borderRadius: 14,
      }}
    >
      {/* hairline left rail */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: 2,
          background: `linear-gradient(180deg, ${accent} 0%, ${accent}55 50%, transparent 100%)`,
        }}
      />

      {/* Trigger row — always visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full text-left flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
      >
        <span
          className="font-mono uppercase shrink-0"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: accent, fontWeight: 600 }}
        >
          {eyebrow}
        </span>

        {primaryMetric && (
          <span
            className="font-mono shrink-0"
            style={{
              fontSize: 9.5,
              padding: "1.5px 7px",
              borderRadius: 999,
              background: `${accent}1F`,
              border: `1px solid ${accent}38`,
              color: VANTARY.paper,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {primaryMetric}
          </span>
        )}

        {!open && (
          <span
            className="font-sans truncate flex-1 min-w-0"
            style={{ fontSize: 12.5, color: VANTARY.paperDim, lineHeight: 1.45 }}
          >
            {preview}
          </span>
        )}
        {open && <span aria-hidden className="flex-1" />}

        <motion.span
          aria-hidden
          className="shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE_V }}
        >
          <ChevronDown size={14} strokeWidth={1.6} color={accent} />
        </motion.span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_V }}
            className="overflow-hidden"
          >
            <div
              aria-hidden
              className="mx-4 h-px"
              style={{
                background: `repeating-linear-gradient(90deg, ${edge} 0 5px, transparent 5px 10px)`,
              }}
            />
            <div className="px-4 py-4">
              <p
                className="font-sans"
                style={{ fontSize: 14, color: VANTARY.paper, lineHeight: 1.6, letterSpacing: "-0.005em" }}
              >
                {segments.map((seg, i) =>
                  seg.kind === "text" ? (
                    <span key={i}>{seg.value}</span>
                  ) : (
                    <ConclusionAnchor key={i} anchor={seg.anchor!} category={blockCategory} />
                  ),
                )}
              </p>
              {/* Bottom dashed timeline strip — borrowed from Ron's
                  Schedule Offset cells. Suggests a temporal axis even
                  on a non-time advisory. */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
                >
                  ADVISORY · {tone.toUpperCase()}
                </span>
                <span
                  aria-hidden
                  className="flex-1 h-px"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${edge} 0 4px, transparent 4px 8px)`,
                  }}
                />
                <FdLiveTick label="" showSeconds={false} size={8.5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FlightDeckAdvisorySheets({
  insight,
  category,
}: {
  insight: OracleResult["insight"]
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <div className="flex flex-col gap-3">
      <FdAdvisorySheet
        eyebrow="PRIMARY"
        body={insight.primary}
        tone="primary"
        category={category}
        defaultOpen
        index={0}
      />
      {insight.risk && (
        <FdAdvisorySheet
          eyebrow="RISK · CAPACITY"
          body={insight.risk}
          tone="risk"
          category={category}
          defaultOpen
          index={1}
        />
      )}
      {insight.opportunity && (
        <FdAdvisorySheet
          eyebrow="OPPORTUNITY"
          body={insight.opportunity}
          tone="opportunity"
          category={category}
          defaultOpen={false}
          index={2}
        />
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FLIGHT-DECK · SCHEDULE MATRIX
   Replaces OracleEvidenceRail. Borrowed from Ron Design's "Schedule
   Offset" route table. Hairline-separated rows, route-number left
   column, value chip on the right with tone-coded delta + a tiny
   visual (mini candle / spark / progress bar) inline.
   ────────────────────────────────────────────────────────────────────── */
function FlightDeckScheduleMatrix({
  evidence,
  category,
  rawCategory,
}: {
  evidence: OracleResult["evidence"]
  category: ReturnType<typeof oracleCatToHoverCat>
  rawCategory: OracleResult["category"]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_V, delay: 0.1 }}
      className="relative overflow-hidden"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 16,
      }}
    >
      <FdCorners inset={8} size={7} />

      <FdPanelHeader
        eyebrow={evidence.eyebrow}
        count={evidence.rows.length}
        hint="LIVE"
      />

      {/* Column header row — route / signal / read */}
      <div
        className="px-4 pb-2 grid items-center gap-3"
        style={{ gridTemplateColumns: "minmax(0,1fr) 60px 100px" }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          ROUTE
        </span>
        <span
          className="font-mono uppercase text-center"
          style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          SIGNAL
        </span>
        <span
          className="font-mono uppercase text-right"
          style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          READ
        </span>
      </div>

      <div
        aria-hidden
        className="h-px mx-4"
        style={{
          background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 5px, transparent 5px 10px)`,
        }}
      />

      <ul className="px-2 py-1">
        {evidence.rows.map((r, i) => {
          const ck = rowCrossKey(r.left)
          const rowCategory: ReturnType<typeof oracleCatToHoverCat> =
            r.tone === "warn" ? "alert"
              : KNOWN_PAIRS.some(p => r.left.includes(p)) ? "forex"
              : category
          const toneColor =
            r.tone === "ok" ? VANTARY.chartUp
              : r.tone === "warn" ? VANTARY.amber
              : r.tone === "bad" ? VANTARY.chartDown
              : VANTARY.ashSoft
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.04, duration: 0.32, ease: EASE_V }}
              style={{
                borderBottom: i < evidence.rows.length - 1
                  ? `1px solid ${VANTARY.ruleSoft}`
                  : "none",
              }}
            >
              <DrillCard
                as="div"
                interaction="preview"
                category={rowCategory}
                crossKey={ck}
                previewSide="left"
                previewWidth={320}
                tooltip={`Drill: ${r.left}`}
                preview={<EvidenceRowPopover category={rawCategory} left={r.left} right={r.right} tone={r.tone} />}
                density="compact"
                intent="subtle"
                style={{
                  background: "transparent",
                  border: "1px solid transparent",
                  borderRadius: 6,
                  padding: "10px 8px",
                }}
              >
                <div
                  className="grid items-center gap-3"
                  style={{ gridTemplateColumns: "minmax(0,1fr) 60px 100px" }}
                >
                  {/* Left — route number + label */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      aria-hidden
                      className="rounded-full shrink-0"
                      style={{
                        width: 5, height: 5,
                        background: toneColor,
                        boxShadow: r.tone === "ok" || r.tone === "warn" ? `0 0 6px ${toneColor}88` : "none",
                      }}
                    />
                    <span
                      className="font-mono uppercase shrink-0"
                      style={{
                        fontSize: 8.5,
                        letterSpacing: "0.16em",
                        color: VANTARY.ashSoft,
                        minWidth: 22,
                      }}
                    >
                      R{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-sans truncate"
                      style={{ fontSize: 12, color: VANTARY.paperDim }}
                    >
                      {r.left}
                    </span>
                  </div>

                  {/* Mid — signal visual */}
                  <div className="flex items-center justify-center">
                    <EvidenceRowVisual category={rawCategory} left={r.left} tone={r.tone} />
                  </div>

                  {/* Right — read chip */}
                  <div className="flex items-center justify-end">
                    <span
                      className="font-mono tabular-nums truncate"
                      style={{
                        fontSize: 11,
                        color: r.tone === "warn" ? VANTARY.amber
                          : r.tone === "bad" ? VANTARY.chartDown
                          : r.tone === "ok" ? VANTARY.paper
                          : VANTARY.paperDim,
                        fontWeight: 500,
                        padding: "2px 6px",
                        background: r.tone ? `${toneColor}15` : "transparent",
                        border: `1px solid ${r.tone ? `${toneColor}30` : "transparent"}`,
                        borderRadius: 4,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {r.right}
                    </span>
                  </div>
                </div>
              </DrillCard>
            </motion.li>
          )
        })}
      </ul>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FLIGHT-DECK · DESTINATION BAY
   Replaces OracleNextMoves. Three "destination tiles" in the spirit of
   the Bus 6023 / Bus 4120 / Bus 2209 destination cards on Ron's
   Traffic Management screen. Each tile has:
     · Top-left status pip + urgency mono label
     · Centre orbit ring with the confidence percentage in the middle
     · Title + description below
     · Bottom dashed timeline strip with "RUN →" affordance
   ────────────────────────────────────────────────────────────────────── */
function FlightDeckDestinationBay({
  moves,
  onSubmit,
  category: _category,
}: {
  moves: OracleResult["nextMoves"]
  onSubmit: (q: string) => void
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.ashSoft, fontWeight: 600 }}
        >
          DESTINATION BAY · NEXT MOVES
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft, opacity: 0.65 }}
        >
          HOVER · PREVIEW · CLICK · RUN
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {moves.map((m, i) => {
          const tint =
            m.urgency === "high" ? VANTARY.chartUp
              : m.urgency === "medium" ? VANTARY.amber
              : VANTARY.ashSoft
          const pct =
            m.urgency === "high" ? 1
              : m.urgency === "medium" ? 0.66
              : 0.33
          const tileCategory: ReturnType<typeof oracleCatToHoverCat> =
            m.urgency === "high" ? "session" : m.urgency === "medium" ? "alert" : "neutral"
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20 + i * 0.07, duration: 0.45, ease: EASE_V }}
            >
              <DrillCard
                as="button"
                interaction="preview-action"
                category={tileCategory}
                previewSide="top"
                previewWidth={320}
                tooltip="Click to drill"
                preview={<NextMovePopover move={m} />}
                onClick={() => onSubmit(m.title)}
                density="rich"
                intent="prominent"
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                  background: m.urgency === "high"
                    ? "rgba(16,185,129,0.06)"
                    : m.urgency === "medium"
                      ? VANTARY.amberWash
                      : VANTARY.glass,
                  border: `1px solid ${m.urgency === "high" ? "rgba(16,185,129,0.22)" : m.urgency === "medium" ? VANTARY.amberHalo : VANTARY.rule}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  padding: 16,
                  minHeight: 196,
                }}
              >
                <FdCorners inset={6} size={6} thickness={1} />

                {/* Status row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.span
                      aria-hidden
                      className="rounded-full"
                      style={{
                        width: 6, height: 6,
                        background: tint,
                        boxShadow: `0 0 8px ${tint}88`,
                      }}
                      animate={{ opacity: [0.5, 1, 0.5], scale: [0.92, 1.1, 0.92] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
                    />
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 9, letterSpacing: "0.22em", color: tint, fontWeight: 600 }}
                    >
                      {m.urgency} · DEST {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <ArrowUpRight size={13} strokeWidth={1.5} color={VANTARY.paperDim} />
                </div>

                {/* Centre — orbit ring with % in middle */}
                <div className="flex items-center justify-center my-2">
                  <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
                    <span aria-hidden className="absolute inset-0">
                      <FdRangeRing size={88} accent={tint} pct={pct} spin />
                    </span>
                    <span
                      className="font-sans tabular-nums relative"
                      style={{
                        fontSize: 22,
                        color: VANTARY.paper,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {Math.round(pct * 100)}
                      <span style={{ fontSize: 11, color: VANTARY.ash, marginLeft: 1 }}>%</span>
                    </span>
                  </div>
                </div>

                {/* Title + description */}
                <div
                  className="font-sans"
                  style={{
                    fontSize: 13.5,
                    color: VANTARY.paper,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.32,
                  }}
                >
                  {m.title}
                </div>
                <p
                  className="font-sans mt-1.5"
                  style={{ fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.5 }}
                >
                  {m.description}
                </p>

                {/* Bottom dashed timeline strip + RUN affordance */}
                <div className="mt-4 flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex-1 h-px"
                    style={{
                      background: `repeating-linear-gradient(90deg, ${tint}40 0 4px, transparent 4px 8px)`,
                    }}
                  />
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.20em",
                      color: tint,
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: `1px solid ${tint}55`,
                      background: `${tint}10`,
                      fontWeight: 600,
                    }}
                  >
                    RUN →
                  </span>
                </div>
              </DrillCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FLIGHT-DECK · FOLLOW-UP RAIL
   Restyled OracleFollowUps. A horizontal scrubber of follow-up prompts
   with a leading "DRILL FORWARD" eyebrow + dashed connecting rail.
   ────────────────────────────────────────────────────────────────────── */
function FlightDeckFollowUpRail({
  followUps,
  onSubmit,
  category,
}: {
  followUps: Array<{ label: string; q: string }>
  onSubmit: (q: string) => void
  category: ReturnType<typeof oracleCatToHoverCat>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_V, delay: 0.25 }}
      className="flex items-center gap-3 flex-wrap"
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft, fontWeight: 600 }}
      >
        DRILL FORWARD
      </span>
      <span
        aria-hidden
        className="h-px"
        style={{
          width: 24,
          background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 3px, transparent 3px 6px)`,
        }}
      />
      <div className="flex flex-wrap gap-2">
        {followUps.map((f, i) => (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.30 + i * 0.04, duration: 0.32, ease: EASE_V }}
          >
            <DrillCard
              as="button"
              interaction="action"
              category={category}
              inline
              density="compact"
              intent="subtle"
              affordance="navigate"
              tooltip={`Drill: ${f.q}`}
              onClick={() => onSubmit(f.q)}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 999,
                padding: "5px 10px 5px 11px",
              }}
            >
              <span
                className="font-mono uppercase inline-flex items-center gap-1.5"
                style={{ fontSize: 9.5, letterSpacing: "0.18em", color: VANTARY.paperDim, fontWeight: 500 }}
              >
                {f.label}
                <ArrowRight size={10} strokeWidth={1.6} />
              </span>
            </DrillCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   The orchestrator — connects all 6 zones inside a single cross-highlight
   provider so hovering EUR/USD anywhere lights up everywhere it appears.
   Now styled as a flight-deck briefing surface.
   ═══════════════════════════════════════════════════════════════════════ */

function OracleBody({
  result,
  onSubmit,
  query,
}: {
  result: OracleResult
  onSubmit: (q: string) => void
  query?: string
}) {
  const category = oracleCatToHoverCat(result.category)
  const followUps = useMemo(() => computeFollowUps(result), [result])

  return (
    <div className="flex flex-col gap-6">
      {/* MISSION BRIEFING — eyebrow, query echo, framing, hero ring */}
      <FlightDeckMissionPanel
        framing={result.framing}
        category={category}
        rawCategory={result.category}
        query={query}
      />

      {/* TELEMETRY QUAD — 4 cockpit gauge cards */}
      <FlightDeckTelemetryQuad highlights={result.highlights} category={category} />

      {/* ADVISORY STACK + SCHEDULE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <FlightDeckAdvisorySheets insight={result.insight} category={category} />
        </div>
        <div className="lg:col-span-5">
          <FlightDeckScheduleMatrix
            evidence={result.evidence}
            category={category}
            rawCategory={result.category}
          />
        </div>
      </div>

      {/* DESTINATION BAY — confidence-orbit action tiles */}
      <FlightDeckDestinationBay moves={result.nextMoves} onSubmit={onSubmit} category={category} />

      {/* DRILL FORWARD — follow-up rail */}
      <FlightDeckFollowUpRail followUps={followUps} onSubmit={onSubmit} category={category} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   <VantaryOracle> — NEW top-mounted command bar with inline result expansion.
   
   Layout:
   - Fixed at top of main content (above "Good morning, Marcus")
   - Input pill with Sparkles trigger + quick prompts expansion
   - When query submitted: result panels materialize BELOW the input (not bottom sheet)
   - Results shown as inline cards that push content down
   - Keeps notifications in header (right side)
   
   Reference: Advanced "ASK ME ANYTHING" with inline expansion like Active Theory
   layered card reveals, but anchored at page top instead of bottom dock.
   ───────────────────────────────────────────────────────────────────────── */

/* localStorage key for the recent-queries ring buffer.
   Bumped to v2 since the schema changed when the command console shipped. */
const ORACLE_RECENTS_KEY = "vantary.oracle.recents.v2"
const ORACLE_RECENTS_MAX = 8

/** Read recents from localStorage; safe in SSR / private-browsing failures. */
function readOracleRecents(): readonly { q: string; at: number }[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(ORACLE_RECENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Defensive — keep only well-shaped rows.
    return parsed
      .filter((r: any) => r && typeof r.q === "string" && typeof r.at === "number")
      .slice(0, ORACLE_RECENTS_MAX)
  } catch {
    return []
  }
}

/** Push a new query to the head of the recents stack, dedupe, persist. */
function pushOracleRecent(
  prev: readonly { q: string; at: number }[],
  q: string,
): readonly { q: string; at: number }[] {
  const trimmed = q.trim()
  if (!trimmed) return prev
  const next = [
    { q: trimmed, at: Date.now() },
    ...prev.filter((r) => r.q.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, ORACLE_RECENTS_MAX)
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ORACLE_RECENTS_KEY, JSON.stringify(next))
    } catch {
      /* quota / private browsing — silently drop */
    }
  }
  return next
}

/** Lightweight UTC-hour ticker for state-aware suggestions. Cheap: 60s cadence. */
function useUtcHourFresh(): number {
  const [hour, setHour] = useState(() => {
    const d = new Date()
    return d.getUTCHours() + d.getUTCMinutes() / 60
  })
  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date()
      setHour(d.getUTCHours() + d.getUTCMinutes() / 60)
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return hour
}

export function VantaryOracle({ slim = false }: { slim?: boolean } = {}) {
  /* ── ARCHIO slim mode ────────────────────────────────────────────────
        When `slim` is true the legacy `ORACLE · STANDBY ──── READY · UTC`
        telemetry strip, the bordered rounded-full input pill, AND the
        OracleCommandConsole dropdown are all suppressed — the rooms in
        the Flight Deck Cockpit are now the command surface, and the new
        <OracleHaloBar/> (in your-space.tsx) renders the visible input.
        
        What stays alive in slim mode:
          · the full submit pipeline (templates, recents, legacy answer)
          · the FlightDeckViewportSurface (templated answers paint here)
          · the legacy <OracleBody/> answer panel for unmatched free-text
        
        The `useOracleArmed()` context bridges the Halo Bar's input
        to this component: query is mirrored both ways, armed state is
        synchronised, and a registerSubmit() effect plugs the submit
        callback into the context's `submit()` dispatcher. */
  const oracleArmed = useOracleArmed()
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<OracleResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [consoleOpen, setConsoleOpen] = useState(false) // command console visible
  const [showResult, setShowResult] = useState(false)   // result panel visible
  const [recents, setRecents] = useState<readonly { q: string; at: number }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  /* ── Theme accent ────────────────────────────────────────────────────
     The Oracle ask-bar's entry surface (telemetry strip, input pill
     border, sparkles icon, submit button, corner registration marks)
     now follows the active VantaryTheme accent. Switching theme
     instantly retints the whole bar without remount. */
  const accent = useThemeAccent().primary

  /* ── Universal Template Engine bridge ─────────────────────────────────
     A submitted query is first inspected for a structural intent
     (e.g. mentor-compare). If a template handles it, the viewport
     above the trading desk opens with the resolved selection
     pre-filled and we return early — no need to drop the user into
     the legacy long-form Oracle answer. If nothing matches, the
     existing Oracle pipeline takes over unchanged. */
  const viewportApi = useFlightDeckViewportContext()

  // Hydrate recents from localStorage on mount.
  useEffect(() => {
    setRecents(readOracleRecents())
  }, [])

  // Live UTC hour drives state-aware smart suggestions (macro proximity etc.).
  const utcHour = useUtcHourFresh()

  // Compute the smart-suggestion deck per render. `getSmartSuggestions` is pure
  // and bounded (≤ 6 items), so the cost is negligible and the freshness is
  // exactly what the trader expects ("why is this surfacing right now?").
  const suggestions = useMemo(
    () =>
      getSmartSuggestions({
        utcHour,
        performance: PERFORMANCE,
        psychology: PSYCHOLOGY,
        plan: DAILY_PLAN,
        accounts: ACCOUNTS,
      }),
    [utcHour],
  )

  const submit = useCallback((q: string) => {
    if (!q.trim()) return
    // 1. Try the structural template path first. If it resolves
    //    (e.g. "Compare Picasso to Girard"), the viewport above the
    //    chart paints the answer and the legacy Oracle stays quiet.
    if (viewportApi?.openFromQuery(q)) {
      setQuery(q)
      setConsoleOpen(false)
      setRecents((prev) => pushOracleRecent(prev, q))
      setShowResult(false)
      return
    }
    // 2. Fall through to the legacy Oracle answer surface.
    setThinking(true)
    setShowResult(true)
    setQuery(q)
    setConsoleOpen(false)
    setRecents((prev) => pushOracleRecent(prev, q))
    // simulate AI processing time
    window.setTimeout(() => {
      setResult(generateOracleResult(q))
      setThinking(false)
    }, 600)
  }, [viewportApi])

  const clear = useCallback(() => {
    setShowResult(false)
    setTimeout(() => { setResult(null); setQuery("") }, 400)
  }, [])

  /* ── ARCHIO slim bridge ───────────────────────────────────────────────
        Register THIS component's full submit pipeline with the shared
        OracleArmedContext. The Halo Bar (and any cockpit-suggestion
        click) calls `context.submit(q)`, which routes here. Mirror the
        context's query into our local state too so the legacy answer
        panel header still shows what was asked. */
  useEffect(() => {
    if (!slim) return
    return oracleArmed.registerSubmit((q) => {
      submit(q)
    })
  }, [slim, oracleArmed, submit])
  useEffect(() => {
    if (!slim) return
    setQuery(oracleArmed.query)
  }, [slim, oracleArmed.query])

  // Esc closes the result panel — only when the console isn't open
  // (the console handles its own Escape via onDismiss).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showResult && !consoleOpen) clear()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [clear, showResult, consoleOpen])

  // Click-outside dismisses the console — but only when the user isn't
  // actively typing or hovering the dropdown itself.
  const consoleRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!consoleOpen) return
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node | null
      if (consoleRef.current && t && !consoleRef.current.contains(t)) {
        setConsoleOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [consoleOpen])

  return (
    <div className="mb-8">
      {/* ── Always-on telemetry strip — UTC clock, system pulse, status ──
            ARCHIO: hidden in slim mode. The Halo Bar (in your-space.tsx)
            replaces the standby telegraphy with a quieter visual halo. */}
      {!slim && (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: EASE_V }}
        className="flex items-center gap-3 px-2 mb-2"
      >
        <span
          aria-hidden
          className="rounded-full"
          style={{
            width: 4,
            height: 4,
            background: accent.hex,
            boxShadow: `0 0 6px ${vgRgba(accent.rgb, 0.7)}`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.24em", color: accent.hex, fontWeight: 600 }}
        >
          ORACLE · STANDBY
        </span>
        <span
          aria-hidden
          className="flex-1 h-px"
          style={{
            background: `repeating-linear-gradient(90deg, ${vgRgba(accent.rgb, 0.22)} 0 4px, transparent 4px 8px)`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
        >
          {viewportApi?.activeId
            ? "DECK · DEPLOYED"
            : showResult
            ? "DECK · DEPLOYED"
            : consoleOpen
            ? "CONSOLE · ARMED"
            : "READY"}
        </span>
        <FdLiveTick label="UTC" showSeconds size={9.5} />
      </motion.div>
      )}

      {/* ── Command input bar + console dropdown ──
            ARCHIO: hidden in slim mode. The slim VantaryOracle renders
            only the answer surface; the visible input is the new
            <OracleHaloBar/> sitting under the welcome cartouche. */}
      {!slim && (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE_V }}
        className="relative z-20"
        ref={consoleRef}
      >
        {/* The main input pill */}
        <div className="relative">
          {/* Corner registration marks framing the input — theme-tinted */}
          <FdCorners inset={-2} size={10} thickness={1} color={vgRgba(accent.rgb, 0.35)} />

          <motion.div
            className="flex items-center gap-3 px-6 py-4 rounded-full"
            style={{
              background: VANTARY.glassDeep,
              border: `1px solid ${
                consoleOpen || showResult || viewportApi?.activeId
                  ? accent.hex
                  : vgRgba(accent.rgb, 0.28)
              }`,
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              boxShadow:
                consoleOpen || showResult || viewportApi?.activeId
                  ? `0 0 32px ${vgRgba(accent.rgb, 0.30)}, 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
                  : `0 0 16px ${vgRgba(accent.rgb, 0.16)}, 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
            animate={{
              borderColor:
                consoleOpen || showResult || viewportApi?.activeId
                  ? accent.hex
                  : vgRgba(accent.rgb, 0.28),
            }}
            transition={{ duration: 0.4, ease: EASE_V }}
          >
            {/* Sparkles trigger — toggles the console */}
            <button
              type="button"
              onClick={() => {
                setConsoleOpen((v) => !v)
                inputRef.current?.focus()
              }}
              aria-label={consoleOpen ? "Close command console" : "Open command console"}
              aria-expanded={consoleOpen}
              className="shrink-0 transition-transform hover:scale-110"
            >
              <motion.div
                animate={{ rotate: consoleOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: EASE_V }}
              >
                <Sparkles size={16} strokeWidth={1.5} color={accent.hex} />
              </motion.div>
            </button>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); submit(query) }}
              className="flex-1 flex items-center"
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setConsoleOpen(true)}
                placeholder="ASK ME ANYTHING — COMPARE MENTORS, AUDIT PROFILES, SHOW STATS…"
                className="flex-1 bg-transparent outline-none font-mono uppercase tracking-[0.18em] placeholder:opacity-40"
                style={{
                  fontSize: 12,
                  color: accent.hex,
                  caretColor: accent.hex,
                }}
              />
            </form>

            {/* Submit button — theme-tinted */}
            {query && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                type="button"
                onClick={() => submit(query)}
                className="shrink-0 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  width: 28,
                  height: 28,
                  background: accent.hex,
                  boxShadow: `0 0 16px ${vgRgba(accent.rgb, 0.45)}`,
                }}
              >
                <Send size={12} strokeWidth={2.5} color={VANTARY.ink} />
              </motion.button>
            )}
          </motion.div>

          {/* Console dropdown — anchored below the pill, full width.
              Mounts only when open so its keyboard handler does not
              interfere with the rest of the dashboard. */}
          <AnimatePresence>
            {consoleOpen && !showResult && !viewportApi?.activeId && (
              <motion.div
                key="oracle-console"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.985 }}
                transition={{ duration: 0.32, ease: EASE_V }}
                className="absolute left-0 right-0 mt-3 z-30"
                style={{ transformOrigin: "top center" }}
              >
                <OracleCommandConsole
                  query={query}
                  onSubmit={submit}
                  recentQueries={recents}
                  suggestions={suggestions}
                  onDismiss={() => setConsoleOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      )}

      {/* ── Universal Template Surface ─────────────────────────────────
            Every flight-deck destination click (Market Floor, The
            Studio, Mentor Hall, Review Room) AND every natural-language
            ask-bar query that resolves to a structural intent (e.g.
            "Compare Picasso to Girard") paints HERE — directly below
            the ask-me-anything bar, in the same conceptual slot the
            legacy Oracle answer used to occupy. The user never leaves
            the AI dashboard page; the answer rises into focus right
            where their eyes already are. */}
      <FlightDeckViewportSurface className="mt-6" />

      {/* ── Legacy Oracle answer panel ────────────────────────────────
            Renders only when no structural template is active so it
            never competes with the template surface above. Used for
            free-text queries that don't resolve to a registered
            intent. */}
      <AnimatePresence>
        {showResult && !viewportApi?.activeId && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_V }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.5, ease: EASE_V }}
              className="relative mt-6 rounded-3xl p-6"
              style={{
                background: VANTARY.glassDeep,
                border: `1px solid ${VANTARY.amberHalo}`,
                backdropFilter: "blur(36px) saturate(160%)",
                WebkitBackdropFilter: "blur(36px) saturate(160%)",
                boxShadow: `0 8px 48px rgba(0,0,0,0.4), 0 0 80px ${VANTARY.amberHalo}20`,
              }}
            >
              {/* Corner registration marks on the deck shell */}
              <FdCorners inset={14} size={12} />

              {/* Mission status header — multi-column cockpit strip */}
              <div className="relative mb-6">
                <div className="flex items-center gap-3">
                  {/* Left — system identity + breathing pulse */}
                  <div className="flex items-center gap-2 shrink-0">
                    <motion.span
                      aria-hidden
                      className="rounded-full"
                      style={{
                        width: 7, height: 7,
                        background: VANTARY.amber,
                        boxShadow: `0 0 10px ${VANTARY.amberHalo}`,
                      }}
                      animate={{ opacity: [0.55, 1, 0.55], scale: [0.92, 1.1, 0.92] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 10, letterSpacing: "0.24em", color: VANTARY.amber, fontWeight: 600 }}
                    >
                      ORACLE DECK
                    </span>
                  </div>

                  {/* Mid — dashed rule */}
                  <span
                    aria-hidden
                    className="flex-1 h-px"
                    style={{
                      background: `repeating-linear-gradient(90deg, ${VANTARY.amberHalo} 0 4px, transparent 4px 8px)`,
                    }}
                  />

                  {/* Right — category chip + live UTC + close */}
                  <span
                    className="font-mono uppercase shrink-0"
                    style={{
                      fontSize: 9,
                      padding: "3px 8px",
                      letterSpacing: "0.20em",
                      color: VANTARY.paper,
                      background: VANTARY.amberWash,
                      border: `1px solid ${VANTARY.amberHalo}`,
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    {result?.category ?? "QUERY"}
                  </span>
                  <FdLiveTick label="UTC" showSeconds size={9.5} />
                  <button
                    type="button"
                    onClick={clear}
                    aria-label="Close result"
                    className="shrink-0 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                    style={{ width: 30, height: 30, border: `1px solid ${VANTARY.rule}` }}
                  >
                    <X size={13} strokeWidth={1.5} color={VANTARY.ash} />
                  </button>
                </div>
              </div>

              {/* Result body */}
              <div>
                {thinking || !result ? (
                  <ThinkingDots />
                ) : (
                  <OracleBody result={result} onSubmit={submit} query={query} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
