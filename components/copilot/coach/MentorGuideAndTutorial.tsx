"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen, Brain, Target, Compass, Route, Star, Award,
  ChevronRight, ChevronDown, Zap, Activity, AlertTriangle,
  CheckCircle2, Lightbulb, MessageSquare, ArrowRight, Shield,
  TrendingUp, Clock, BarChart3, Eye, Layers, Scale,
  Crosshair, GitBranch, Flame, RefreshCw, Timer, Repeat,
  Users, Ruler, Gauge, Milestone, Swords, HeartPulse,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════
   MENTOR INTELLIGENCE — COMPLETE GUIDE & TUTORIAL

   13x more detailed than Strategy/Activity tutorials.
   Covers the full mentorship architecture across 8 comprehensive
   domains of trading mastery:

   1. MARKET STRUCTURE MASTERY — HTF/LTF hierarchy, structure
      breaks, order blocks, fair value gaps, premium/discount zones
   2. LIQUIDITY ARCHITECTURE — Pool identification, stop hunts,
      inducement, liquidity sweeps, engineering entries around liquidity
   3. TIMING & SESSION DYNAMICS — Killzone trading, session overlaps,
      day-of-week patterns, time-based edges, news event management
   4. EXECUTION PRECISION — Entry types, limit order discipline,
      position sizing formulas, multi-timeframe confirmation
   5. TRADE MANAGEMENT FRAMEWORK — Partials, trailing stops,
      breakeven mechanics, trade scaling, exit optimization
   6. PSYCHOLOGICAL WARFARE — Cognitive biases, emotional regulation,
      tilt management, revenge trading prevention, FOMO neutralization
   7. RISK ARCHITECTURE — Portfolio heat, correlation management,
      drawdown protocols, risk budgeting, survival mathematics
   8. META-GAME INTELLIGENCE — Institutional behavior, retail
      exploitation, stop hunt mechanics, the game behind the game
   ═══════════════════════════════════════════════════════════════════ */

/* ── Section Type ── */
interface MentorSection {
  id: string
  title: string
  grade: string
  tagline: string
  icon: typeof Brain
  color: string
  overview: string
  concepts: {
    title: string
    category: string
    insight: string
    application: string
    commonMistake: string
    advancedNote: string
    practiceExercise: string
    mastery: "locked" | "introduced" | "practicing" | "mastered"
  }[]
  caseStudies: {
    title: string
    scenario: string
    lesson: string
    outcome: string
    takeaway: string
  }[]
  metrics: {
    label: string
    value: string
    description: string
  }[]
  keyRules: string[]
}

const MENTOR_SECTIONS: MentorSection[] = [
  {
    id: "market-structure",
    title: "Market Structure Mastery",
    grade: "I",
    tagline: "Price respects structure on all timeframes. Higher timeframe structure always overrides.",
    icon: Layers,
    color: "#94a3b8",
    overview: "Market structure is the foundation of all technical analysis. It describes how price moves through a sequence of higher highs and higher lows (bullish structure) or lower highs and lower lows (bearish structure). Understanding structure hierarchy -- that higher timeframe structure overrides lower timeframe patterns -- is the single most important concept in trading. Every trading decision starts with identifying the current structure on the daily and H4 timeframes. Your entry timeframe (M5, M15) exists to find precision entries within the higher timeframe narrative, never to contradict it. Structure breaks are not random events -- they are the market's language, telling you which side is in control and where the next move is going.",
    concepts: [
      {
        title: "HTF/LTF Structure Hierarchy",
        category: "Structure",
        insight: "The market operates as a fractal. What appears as a single candle on D1 contains an entire narrative on H1. What looks like a breakout on M15 may be a minor retracement on H4. Your entry timeframe must serve the higher timeframe's direction -- never contradict it. When M15 structure is bullish but H4 is bearish, the H4 wins. Every single time.",
        application: "Before every session, mark the D1 and H4 structure: identify the most recent swing highs and lows, the direction of the trend, and where the key structural levels are. Then drop to your entry timeframe and only look for setups that align with the higher timeframe bias.",
        commonMistake: "Taking a beautiful M15 bullish structure break long when the H4 is in a clear downtrend. The M15 move is nothing more than a pullback within the H4 trend. It will reverse.",
        advancedNote: "Multi-timeframe structure alignment creates the highest-probability setups. When D1, H4, and H1 all agree on direction, and M15 provides an entry signal, the probability of follow-through is significantly higher than any single-timeframe signal.",
        practiceExercise: "Open any pair. Mark the last 5 swing highs and lows on D1. Then mark the same on H4. Notice how H4 swings are sub-structures within D1 swings. Now drop to M15 and observe how M15 structure breaks are micro-events within H4 swings. Do this for 20 pairs over 5 days.",
        mastery: "mastered",
      },
      {
        title: "Break of Structure (BOS) vs Change of Character (CHoCH)",
        category: "Structure",
        insight: "A Break of Structure (BOS) is price continuing in the current direction by breaking the most recent swing high (in an uptrend) or swing low (in a downtrend). A Change of Character (CHoCH) is price breaking structure in the opposite direction -- the first sign that the trend may be reversing. BOS confirms continuation. CHoCH signals potential reversal. They are not the same event and require different responses.",
        application: "After a CHoCH, do not immediately trade the reversal. Wait for a BOS in the new direction to confirm that the CHoCH was genuine and not just a liquidity sweep. A CHoCH without a confirming BOS is just a wick.",
        commonMistake: "Treating every CHoCH as a guaranteed reversal. Many CHoCH events are simply liquidity sweeps -- price breaks structure briefly to collect stops and then continues in the original direction. The confirmation BOS is non-negotiable.",
        advancedNote: "The highest-probability CHoCH occurs when price sweeps a significant liquidity level (swing high/low with multiple touches) and then shows displacement in the opposite direction. The sweep + displacement combination is the strongest reversal signal in price action.",
        practiceExercise: "Review 50 historical CHoCH events on H4. Track how many led to genuine reversals (confirmed by a BOS in the new direction) vs how many were liquidity sweeps that continued in the original direction. Build your own statistical baseline for CHoCH reliability.",
        mastery: "mastered",
      },
      {
        title: "Order Blocks",
        category: "Structure",
        insight: "An order block is the last candle of the opposite color before a significant move. In an uptrend, the bullish order block is the last bearish candle before the displacement higher. The concept reflects institutional order placement -- large orders are often filled at specific price levels, and when price returns to these levels, the remaining orders provide support or resistance.",
        application: "Mark the order block (last opposing candle) before every significant displacement. When price returns to this zone, look for entry confirmations. The order block is your entry zone, not a blind entry level -- you still need confirmation on your entry timeframe.",
        commonMistake: "Marking every single opposing candle as an order block. Only the last opposing candle before significant displacement qualifies. If there is no displacement, there is no order block. Displacement means a strong, impulsive move with large-bodied candles.",
        advancedNote: "Refined order blocks use the body of the candle (open to close) as the zone, not the wicks. The body represents the actual area where orders were filled. Wick-to-wick zones are too wide and dilute precision.",
        practiceExercise: "On H4 charts, identify every significant displacement move in the last 30 days. Mark the order block for each. Track which order blocks were revisited and which held. Calculate your hit rate -- how often does price react at the order block?",
        mastery: "practicing",
      },
      {
        title: "Fair Value Gaps (FVG)",
        category: "Structure",
        insight: "A Fair Value Gap is a three-candle pattern where the first candle's high and the third candle's low do not overlap (in a bullish FVG). This gap represents an imbalance -- price moved too quickly for efficient price discovery. The market has a tendency to return to these gaps and fill them before continuing. FVGs are not just gaps to be filled -- they are areas of institutional interest where unexecuted orders may reside.",
        application: "Mark all FVGs on H4 and H1. These are your primary areas of interest for entries. When price returns to an FVG, look for a reaction (rejection candle, structure break on LTF) as your entry confirmation.",
        commonMistake: "Expecting every FVG to hold. Not all FVGs are equal. FVGs that align with the higher timeframe trend and occur within premium/discount zones have significantly higher probability than those in neutral territory.",
        advancedNote: "FVGs within order blocks are the highest-probability zones. When an FVG forms inside a previously identified order block, you have two institutional concepts aligning at the same price level -- this is where precision traders look for entries.",
        practiceExercise: "Mark every H4 FVG for the last 3 months on one pair. Color them green (filled and held), red (filled and failed), and gray (never revisited). Calculate the fill rate and the hold rate. This data tells you how much to trust FVGs on this specific pair.",
        mastery: "practicing",
      },
      {
        title: "Premium & Discount Zones",
        category: "Structure",
        insight: "In any trading range, the zone above the equilibrium (50% level) is the premium zone and the zone below is the discount zone. Smart money buys in the discount zone and sells in the premium zone. This concept ensures you are always buying low and selling high within the context of the current range. Trading in the wrong zone is the most common reason for poor risk-reward ratios.",
        application: "Mark the equilibrium (50% fib) of the current range. Only take longs in the discount zone (below 50%). Only take shorts in the premium zone (above 50%). This single rule eliminates a massive number of low-probability trades.",
        commonMistake: "Taking longs at the top of the range because the setup looks clean on the lower timeframe. The setup may be technically valid, but you are buying at premium -- the risk-reward is inverted. Let price come to discount before buying.",
        advancedNote: "The optimal entry zones are the 62-79% retracement levels. This is the sweet spot where most institutional orders are placed. Entries at the 62% level offer better risk-reward than entries at the 50% level, but with slightly lower probability of fill.",
        practiceExercise: "On every pair you trade, mark the current swing range. Draw the 50%, 62%, 79% levels. Track where price reverses most often. You will find a consistent pattern where the 62-79% zone produces the strongest reactions.",
        mastery: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The HTF Override",
        scenario: "M15 shows a perfect bullish BOS with displacement. H4 is in a bearish trend with a clear series of lower highs and lower lows. Trader takes the M15 long setup.",
        lesson: "The M15 move was a retracement within the H4 downtrend. It provided a perfect entry for shorts, not longs. The M15 displacement was the pullback that bearish traders were waiting for.",
        outcome: "M15 long moved 12 pips in favor before reversing hard. Full stop loss hit. The short from the same area ran 80 pips. The trader was trading against the structure hierarchy.",
        takeaway: "Always start from the highest timeframe and work down. Your entry timeframe confirms entries within the higher timeframe narrative -- it never creates its own independent narrative.",
      },
    ],
    metrics: [
      { label: "Structure Reads", value: "342", description: "Total HTF structure reads completed in practice sessions" },
      { label: "OB Hit Rate", value: "68%", description: "Percentage of identified order blocks that held on revisit" },
      { label: "FVG Fill Rate", value: "82%", description: "Percentage of H4 fair value gaps that were revisited and filled" },
    ],
    keyRules: [
      "Higher timeframe structure always wins -- no exceptions",
      "CHoCH requires BOS confirmation before trading the reversal",
      "Order blocks are zones, not lines -- use the candle body, not the wicks",
      "FVGs within order blocks are the highest-probability confluence zones",
      "Only buy in discount, only sell in premium -- this is non-negotiable",
    ],
  },
  {
    id: "liquidity-architecture",
    title: "Liquidity Architecture",
    grade: "II",
    tagline: "Price hunts liquidity. Every swing high and low is a target, not a barrier.",
    icon: Target,
    color: "#3b82f6",
    overview: "Liquidity is the fuel that moves markets. Every cluster of stop-loss orders represents liquidity. Price moves from one pool of liquidity to the next. Understanding this simple principle transforms how you read the market: obvious support and resistance levels are not places to enter trades -- they are targets for price to hunt. The institutional algorithm needs to fill large orders, and it can only do so where there is sufficient liquidity. That liquidity sits above swing highs (buy stops from short sellers) and below swing lows (sell stops from long traders). Learning to see the market through the lens of liquidity turns your biggest losses into your best entries.",
    concepts: [
      {
        title: "Buy-Side & Sell-Side Liquidity",
        category: "Liquidity",
        insight: "Above every swing high sits a pool of buy-stop orders: stop-losses from traders who are short. Below every swing low sits a pool of sell-stop orders: stop-losses from traders who are long. These pools are the primary targets for price movement. The more obvious the level (more touches, clearer visual), the larger the liquidity pool.",
        application: "Instead of placing stops at obvious highs and lows where everyone else places them, identify these levels as targets. If price is heading toward a significant swing low, it is likely hunting sell-side liquidity. After the sweep, look for a reversal.",
        commonMistake: "Placing your stop loss just below an obvious swing low that has been tested three times. This is where 10,000 other traders have their stops. This level will be hunted before any genuine move occurs.",
        advancedNote: "Equal highs and equal lows are the highest-priority liquidity targets. When price forms two or more highs at the same level, the clustered stops above that level represent a massive liquidity pool. Price will hunt these levels with near certainty.",
        practiceExercise: "Mark every equal high and equal low on H4. Track how many of them get swept within 5 trading days. You will find the sweep rate exceeds 80%. This is one of the most reliable patterns in market structure.",
        mastery: "mastered",
      },
      {
        title: "Inducement & False Breakouts",
        category: "Liquidity",
        insight: "Before a genuine move in one direction, the market often moves in the opposite direction first. This inducement move serves two purposes: it collects the liquidity from traders on the wrong side, and it creates a new pool of trapped traders whose stop-losses will fuel the genuine move. False breakouts are not random -- they are deliberate inducement.",
        application: "When you see a breakout that looks too clean, too easy, and too obvious, be suspicious. Wait for the breakout to fail. The failure of the breakout becomes the setup: the trapped breakout traders now have stops behind the breakout level, and these stops will fuel the reversal.",
        commonMistake: "Trading every breakout immediately. Most breakouts are inducement. The proper approach is to wait for a breakout, then wait for the pullback that tests the breakout level. If the pullback holds, the breakout is genuine. If the pullback fails, the breakout was inducement.",
        advancedNote: "The highest-probability entries come from inducement failures combined with higher-timeframe alignment. A false breakout of M15 resistance that also happens to be at an H4 premium zone with D1 bearish structure is a triple-confluence setup.",
        practiceExercise: "Backtest 100 breakouts on M15. Track how many immediately continue without a pullback vs how many pull back to the breakout level vs how many completely fail. You will find that immediate continuation is rare. Most breakouts require a retest or are inducement.",
        mastery: "practicing",
      },
      {
        title: "Liquidity Sweep Entry Model",
        category: "Entries",
        insight: "The sweep entry model combines liquidity concepts with structure analysis. The sequence: (1) Identify a significant liquidity pool (swing high/low with clustered stops). (2) Wait for price to sweep the level (wick beyond). (3) Look for displacement in the opposite direction on LTF. (4) Enter on the retracement to the sweep displacement's order block. This model has the highest statistical edge of any entry technique because you are entering exactly where liquidity was just collected.",
        application: "After a liquidity sweep, do not enter immediately. Wait for the displacement candle on M5 or M1. This displacement creates an order block. Place your limit order at the OB. Your stop goes behind the sweep wick. This gives you an extremely tight stop and a massive risk-reward.",
        commonMistake: "Entering during the sweep itself (market ordering in as price spikes through the level). The sweep candle is not your entry -- it is the collection phase. Your entry is the retracement after the displacement that follows the sweep.",
        advancedNote: "The best sweep entries occur during killzones (London or New York open). Sweeps during low-volume periods (Asia, lunch hours) have much lower follow-through because there is insufficient volume to sustain the post-sweep displacement.",
        practiceExercise: "Identify 20 historical liquidity sweeps on H4. Drop to M5 at each sweep. Find the displacement candle and mark the OB. Measure where the optimal entry was, what the stop distance would have been, and what the risk-reward would have been. Build your own database of sweep entry performance.",
        mastery: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Equal Low Sweep",
        scenario: "EURUSD forms three equal lows at 1.0850 over two weeks. Every retail trader marks this as strong support. Stop losses cluster at 1.0840-1.0835.",
        lesson: "The equal lows created a massive sell-side liquidity pool. Price was drawn to this level not because it was support, but because it was a liquidity target. The stops below the equal lows were the fuel needed for the reversal higher.",
        outcome: "Price dipped to 1.0832, collecting all stops below the equal lows. Within 30 minutes, it displaced violently to 1.0920. Traders who understood liquidity had limit buys at 1.0835. Traders who trusted support were stopped out.",
        takeaway: "Obvious support and resistance levels are not entry zones -- they are collection zones. The more obvious the level, the more certain the sweep.",
      },
    ],
    metrics: [
      { label: "Sweep Trades", value: "28", description: "Total sweep-based entries taken in the last 30 days" },
      { label: "Sweep Win Rate", value: "71%", description: "Win rate on liquidity sweep entry model" },
      { label: "Avg R:R", value: "3.4:1", description: "Average risk-reward ratio on sweep entries" },
    ],
    keyRules: [
      "Every swing high/low is a liquidity target, not a support/resistance level",
      "Equal highs and equal lows have a 80%+ sweep rate -- anticipate the sweep",
      "The sweep is the collection phase -- your entry comes after the displacement",
      "Only take sweep entries during killzones for maximum follow-through",
      "Your stop goes behind the sweep wick, not at the structural level",
    ],
  },
  {
    id: "timing-dynamics",
    title: "Timing & Session Dynamics",
    grade: "III",
    tagline: "80% of institutional flow occurs in 20% of the trading day. Trade when the edge exists.",
    icon: Clock,
    color: "#f59e0b",
    overview: "Time is the most underappreciated variable in trading. The same setup at different times of day has dramatically different probabilities. During London open (07:00-10:00 UTC), institutional order flow is at its highest, creating the displacement and follow-through that makes trends profitable. During Asian session, volume drops by 60-70%, and price drifts in tight ranges with false signals. Understanding when to trade is as important as understanding what to trade. The best traders do not trade more -- they trade during the right hours.",
    concepts: [
      {
        title: "London Killzone (07:00-10:00 UTC)",
        category: "Timing",
        insight: "The London killzone is the primary trading window. 40% of daily FX volume occurs in this 3-hour window. Institutional desks begin executing their daily orders, creating the displacement moves that define the day's direction. London open often sets the high or low of the day.",
        application: "Complete your analysis before 07:00 UTC. Have your levels marked, your bias defined, and your order placed. When London opens, you are executing a pre-built plan, not reacting to live price action. This mental preparation eliminates emotional decisions during the critical window.",
        commonMistake: "Opening charts at London open and trying to analyze in real-time. By the time you have built a bias, the move has already happened. Pre-session preparation is mandatory.",
        advancedNote: "The first 15 minutes of London (07:00-07:15) often produce a false move that is reversed by 07:30. This is the London open manipulation -- a micro liquidity sweep before the genuine move. Wait for the first 15 minutes to complete before entering.",
        practiceExercise: "Track the time of the daily high and daily low for 30 consecutive days. You will find that the majority of daily extremes are set during London and New York killzones. This data proves that these windows contain the highest-probability moves.",
        mastery: "practicing",
      },
      {
        title: "New York Killzone (13:00-16:00 UTC)",
        category: "Timing",
        insight: "The New York killzone is the secondary trading window. The London-New York overlap (13:00-14:30 UTC) is the highest-volume period of the entire trading day. New York often either continues the London move or reverses it. If New York confirms London's direction, the move accelerates. If New York reverses, the reversal is violent.",
        application: "After London establishes the day's direction, use New York to manage or add to positions. If London was bullish and New York opens bullish, expect continuation. If London was bullish but New York opens with displacement to the downside, consider exiting longs.",
        commonMistake: "Treating New York as an independent trading window. New York exists in the context of London. The London move establishes the narrative. New York either confirms or rejects that narrative.",
        advancedNote: "Major news releases (NFP, CPI, FOMC) create artificial liquidity events during New York. These events produce extreme volatility but also extreme manipulation. Avoid trading 15 minutes before and after major news unless you have specific news-trading protocols.",
        practiceExercise: "For 20 trading days, mark London's direction at 10:00 UTC. Then mark New York's direction at 14:00 UTC. Track how often they agree (continuation) vs disagree (reversal). This ratio tells you the base probability of each scenario.",
        mastery: "introduced",
      },
      {
        title: "Day-of-Week Patterns",
        category: "Timing",
        insight: "Each day of the week has a statistical personality. Monday sets the weekly range. Tuesday is the most directional day. Wednesday often produces a mid-week reversal. Thursday extends or reverses Wednesday. Friday is for profit-taking, not new entries. Understanding these patterns gives you a weekly framework for decision-making.",
        application: "On Monday, observe -- do not trade. Let the market show you which side of the weekly range it is establishing. On Tuesday, look for your primary entries in the direction that Monday suggested. On Wednesday, be prepared for a reversal. On Friday, take profits and close positions.",
        commonMistake: "Trading Monday's breakout as if it is the week's direction. Monday's primary move is often a liquidity sweep that establishes one side of the weekly range. The genuine direction reveals on Tuesday.",
        advancedNote: "The Monday trap is one of the most reliable weekly patterns. If Monday breaks last week's high, there is a strong statistical tendency for the week to close below that high. Monday establishes the fake-out, Tuesday-Thursday deliver the genuine move.",
        practiceExercise: "Track the day of the week that produced the weekly high and the weekly low for 52 consecutive weeks. You will find patterns that are statistically significant. Use these patterns to time your entries and exits.",
        mastery: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Asia Session Trap",
        scenario: "Beautiful bullish structure break on M15 during Asian session. Volume is low but the setup looks technically valid. Trader enters long.",
        lesson: "Asian session structure breaks have dramatically lower follow-through than London/New York breaks. The low volume means insufficient institutional participation to sustain the move. Most Asia session breakouts are reversed at London open.",
        outcome: "The M15 long moved 5 pips in favor during Asia. At London open, price displaced violently in the opposite direction, hitting the stop loss with slippage. The same level became a perfect short entry during London.",
        takeaway: "The best Asia session strategy is no strategy. Observe, prepare, and wait for London.",
      },
    ],
    metrics: [
      { label: "Killzone Trades", value: "85%", description: "Percentage of trades taken during designated killzones" },
      { label: "Off-Hours Trades", value: "15%", description: "Percentage of trades taken outside killzones (target: 0%)" },
      { label: "Best Day", value: "Tuesday", description: "Statistically strongest day for directional moves this month" },
    ],
    keyRules: [
      "Only trade during London (07:00-10:00) and New York (13:00-16:00) killzones",
      "Complete analysis before the session opens -- never analyze live during killzones",
      "The first 15 minutes of London is often manipulation -- wait for confirmation",
      "Monday observes, Tuesday enters, Wednesday adjusts, Friday closes",
      "Asia session setups have dramatically lower follow-through -- avoid them",
    ],
  },
  {
    id: "execution-precision",
    title: "Execution Precision",
    grade: "IV",
    tagline: "The gap between knowing and doing is where most traders fail. Execution is everything.",
    icon: Crosshair,
    color: "#06b6d4",
    overview: "Execution is the translation layer between analysis and profit. You can have perfect analysis, but poor execution will convert a winning setup into a losing trade. Execution precision covers: entry type selection (limit vs market), position sizing formulas, multi-timeframe confirmation techniques, and the mechanical discipline to execute your plan without emotional interference. The best traders in the world are not the best analysts -- they are the best executors.",
    concepts: [
      {
        title: "Limit Order Discipline",
        category: "Entries",
        insight: "Limit orders force patience. Market orders reward impulsiveness. The difference in win rate between limit-order traders and market-order traders is 15-20% across all strategies. Limit orders ensure you enter at your planned price. Market orders enter at whatever price is available, which is always worse during fast-moving markets.",
        application: "After your analysis identifies a level, place a limit order at that level and walk away. If price does not reach your level, the setup was not valid. Do not chase. There will always be another setup.",
        commonMistake: "Watching price approach your level and then market ordering in because you are afraid it will leave without you. This is FOMO disguised as execution.",
        advancedNote: "For sweep entries, use limit orders placed at the order block of the post-sweep displacement. This ensures you catch the retracement that follows every sweep. Your limit is your discipline -- if it does not fill, the retracement was not deep enough and the entry quality would have been poor.",
        practiceExercise: "For 30 consecutive trades, use only limit orders. No market orders under any circumstances. Track your fill rate and your win rate. Compare to your previous market-order performance.",
        mastery: "mastered",
      },
      {
        title: "Position Sizing Formula",
        category: "Risk",
        insight: "Position size = (Account Risk Amount) / (Stop Distance in Pips * Pip Value). This formula is non-negotiable. Your risk per trade should be exactly 1% of your account balance. Not approximately 1% -- exactly 1%. Calculate the precise lot size for every single trade.",
        application: "Before every trade: (1) Determine your stop loss distance in pips. (2) Calculate 1% of your account balance. (3) Divide the risk amount by (stop distance * pip value). (4) Use the resulting lot size, rounding DOWN to the nearest allowed increment.",
        commonMistake: "Rounding up on high-conviction trades. High conviction is an emotion, not a statistical edge. Every trade gets exactly 1% risk, regardless of how confident you feel.",
        advancedNote: "During drawdown periods, some traders reduce to 0.5% risk until they recover to their equity high-water mark. This is a valid risk management technique that extends survival during difficult stretches.",
        practiceExercise: "Calculate the exact position size for 20 trade scenarios with different stop distances and account sizes. Verify your calculations with a position size calculator. Make this calculation automatic.",
        mastery: "practicing",
      },
    ],
    caseStudies: [
      {
        title: "The FOMO Chase",
        scenario: "Perfect setup identified. Limit order placed at 1.0850. Price drops to 1.0855 (5 pips above the limit) and bounces. Trader cancels the limit and market orders in at 1.0870.",
        lesson: "The market order entry added 20 pips to the stop distance and reduced the risk-reward from 3:1 to 1.8:1. The trade hit the original target but the risk-reward no longer justified the position size.",
        outcome: "The trade was profitable but under-performed. The 20-pip chase converted a 3R winner into a 1.8R winner. Over 100 trades, this pattern costs approximately 120R -- the difference between a successful and unsuccessful year.",
        takeaway: "If your limit does not fill, the market is telling you something. Accept the miss and wait for the next setup.",
      },
    ],
    metrics: [
      { label: "Limit Fill Rate", value: "62%", description: "Percentage of limit orders that are filled (ideal range: 55-70%)" },
      { label: "Avg Slippage", value: "0.3 pips", description: "Average slippage on filled limit orders" },
      { label: "Size Accuracy", value: "100%", description: "Percentage of trades with correctly calculated position size" },
    ],
    keyRules: [
      "Use limit orders exclusively -- market orders are for amateurs",
      "Risk exactly 1% per trade -- never more, never less",
      "Calculate position size mathematically -- never estimate",
      "If your limit does not fill, accept the miss and move on",
      "Round position size DOWN, never up",
    ],
  },
  {
    id: "trade-management",
    title: "Trade Management Framework",
    grade: "V",
    tagline: "The entry is 20% of the trade. Management is 80%. Most traders focus on the wrong 20%.",
    icon: Route,
    color: "#10b981",
    overview: "Trade management encompasses everything that happens after your entry is filled: partial profit-taking, stop-loss management, trailing mechanisms, scaling decisions, and exit optimization. Most traders spend 90% of their study time on entries and 10% on management. The ratio should be inverted. A mediocre entry with excellent management outperforms a perfect entry with poor management consistently. Your management rules should be as precise and systematic as your entry rules.",
    concepts: [
      {
        title: "Partial Profit Protocol",
        category: "Management",
        insight: "Taking partial profits at defined levels accomplishes two things: it locks in realized profit (removing the risk of the trade going from winner to loser), and it reduces the emotional pressure on the remaining position. A typical partial protocol: close 50% at 1:1 risk-reward, move stop to breakeven, and let 50% run to the full target.",
        application: "Before every entry, define exactly where you will take partials and where your final target is. Write it down. When price reaches the partial level, execute the partial mechanically. Do not decide in the moment whether to take profits or let it run -- that decision was made before the trade.",
        commonMistake: "Not taking partials because the trade is moving well and you want maximum profit. Then watching the trade reverse from +2R back to breakeven. The partial would have locked in +1R. Greed converted a winner into nothing.",
        advancedNote: "The optimal partial percentage depends on your win rate. Higher win rates can use smaller partials (30% at 1:1) because you can afford to let more run. Lower win rates need larger partials (70% at 1:1) to lock in what you can.",
        practiceExercise: "Backtest your strategy with three partial protocols: (A) 50% at 1:1, 50% runner; (B) 33% at 1:1, 33% at 2:1, 33% runner; (C) no partials, full target or full stop. Compare the equity curves over 100 trades.",
        mastery: "practicing",
      },
      {
        title: "The Breakeven Trap",
        category: "Management",
        insight: "Moving your stop to breakeven feels safe but it is statistically destructive. The market naturally oscillates. A move to breakeven converts winning trades into 0R trades when price retraces to your entry before hitting the target. The breakeven stop is the single most common reason traders have high win rates but mediocre profitability.",
        application: "Do not move to breakeven until price has reached 1:1 and you have taken a partial. At that point, your realized partial profit covers the risk on the runner, and breakeven is a logical management point.",
        commonMistake: "Moving to breakeven after 10 pips of profit because you want to protect capital. Price retraces to your entry, stops you at breakeven, and then runs to your original target for +3R. You felt smart but you lost the trade.",
        advancedNote: "Instead of breakeven, consider moving your stop to a structural level. After price makes a new swing in your favor, move your stop behind that swing. This gives the trade room to breathe while still protecting against a genuine reversal.",
        practiceExercise: "Review your last 50 trades that hit breakeven. Check how many of those trades would have hit the full target if you had not moved the stop. This number is your breakeven cost -- the R you are leaving on the table.",
        mastery: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Management Masterclass",
        scenario: "Entry at 1.0850 with a 15-pip stop (1.0835). Target at 1.0900 (50 pips = 3.3R). Price reaches 1.0865 (1:1 = +15 pips). Trader takes 50% partial and moves stop to breakeven.",
        lesson: "At 1:1 partial, 50% of the position is locked in at +1R. The remaining 50% has zero risk. If the runner hits the full target, total R = 0.5R (partial) + 1.65R (runner) = 2.15R. If the runner hits breakeven, total R = 0.5R. The floor is +0.5R, the ceiling is +2.15R.",
        outcome: "Price continued to 1.0900 and hit the full target. Total realized: +2.15R. Without the partial, it would have been +3.3R but with the full risk maintained throughout. The partial protocol traded maximum R for guaranteed profitability.",
        takeaway: "Partials trade theoretical maximum for practical consistency. Over 100 trades, consistent +2R averages with low variance outperform sporadic +3R with high variance.",
      },
    ],
    metrics: [
      { label: "Partial Execution", value: "94%", description: "Percentage of trades where partial profits were taken as planned" },
      { label: "BE Stops Hit", value: "23%", description: "Percentage of trades that hit breakeven stop after partial (acceptable: <30%)" },
      { label: "Runner Win Rate", value: "41%", description: "Percentage of runners that reach the full target after partial" },
    ],
    keyRules: [
      "Define partial levels before entry -- never decide in the moment",
      "Take 50% at 1:1, move stop to breakeven, let 50% run to target",
      "Never move to breakeven before taking a partial",
      "Use structural stops (behind swings) instead of arbitrary breakeven",
      "The partial protocol trades maximum R for maximum consistency",
    ],
  },
  {
    id: "psychological-warfare",
    title: "Psychological Warfare",
    grade: "VI",
    tagline: "Your mind is your greatest asset and your most dangerous enemy. Master it or it masters you.",
    icon: HeartPulse,
    color: "#ec4899",
    overview: "Trading psychology is not soft science -- it is neurochemistry. When you take a loss, cortisol floods your brain for 20-45 minutes, impairing your risk assessment. When you hit a winner, dopamine creates euphoria that makes you over-confident on the next trade. Understanding these biochemical processes is the key to neutralizing them. You cannot fight your biology, but you can design systems and rules that account for it.",
    concepts: [
      {
        title: "Loss Aversion & Cortisol Response",
        category: "Bias",
        insight: "Humans feel losses 2.5x more intensely than equivalent gains. This is not a character flaw -- it is hardwired biology. After a loss, cortisol floods your prefrontal cortex for 20-45 minutes. During this window, your risk assessment is literally impaired at the neurological level.",
        application: "After any loss, close your charts for 30 minutes. Set a physical timer. Do not check price, do not analyze, do not think about trading. When the timer goes off, your cortisol has normalized and you can think clearly again.",
        commonMistake: "Believing you are calm enough to trade immediately after a loss. Your subjective experience of calm is not the same as neurochemical baseline. You feel calm but your risk assessment is still impaired. Trust the timer, not your feelings.",
        advancedNote: "The cortisol response is cumulative within a session. First loss: 20 minutes. Second loss within the session: 35 minutes. Third loss: 45+ minutes. This is why consecutive losses produce exponentially worse decisions. The tilt cascade is biochemical, not psychological.",
        practiceExercise: "For one month, journal your emotional state and trading decisions after losses. Rate your emotional state 1-10 before each trade. Review at month-end. You will find a strong correlation between post-loss emotional states and poor trading decisions.",
        mastery: "practicing",
      },
      {
        title: "The 2-Loss Rule",
        category: "Discipline",
        insight: "After 2 consecutive losses in a single session, stop trading. This is the most important rule in trading psychology. The 2-loss rule prevents the tilt cascade -- the destructive pattern where each loss leads to a worse decision, larger position, and bigger loss. A -2R day is recoverable. A -7R day from tilt is devastating.",
        application: "After your second consecutive loss, close your trading platform. Not minimize -- close. Walk away from your desk. The session is over. You will trade again tomorrow with a fresh cortisol baseline and a clear mind.",
        commonMistake: "Believing that the third trade will be the one that makes it all back. Statistically, the third trade after two consecutive losses has a lower probability than average because your emotional state is compromised. The math says stop.",
        advancedNote: "Some traders extend this to a daily loss limit (e.g., -2R daily maximum). Once you have lost 2R in a day through any combination of trades, the day is over. This is a circuit breaker for your psychology.",
        practiceExercise: "Review your trading journal for every session where you took 3+ losses. Calculate the P&L of losses 3, 4, 5, etc. Compare this to the P&L of the first 2 losses. You will find that losses 3+ account for a disproportionate share of your total drawdown.",
        mastery: "mastered",
      },
    ],
    caseStudies: [
      {
        title: "The Tilt Cascade",
        scenario: "First trade: -1R (normal loss, setup was valid). Second trade: -1R taken 5 minutes later (cortisol rising). Third trade: -2R (doubled position size). Fourth trade: -3R (tripled size, market order, no stop). Total session: -7R.",
        lesson: "Each subsequent loss narrowed the decision window and expanded the position size. The first loss was fine. The second was questionable timing. The third and fourth were pure tilt -- emotional responses masquerading as trading decisions.",
        outcome: "A -1R day became a -7R day. The additional -6R was entirely preventable with the 2-loss rule. One simple rule would have saved 6R -- approximately 6% of the account.",
        takeaway: "The 2-loss rule is not about avoiding losses. It is about avoiding the exponential destruction that comes from emotionally impaired decision-making after losses.",
      },
    ],
    metrics: [
      { label: "Tilt Events", value: "2", description: "Number of tilt cascades in the last 90 days (target: 0)" },
      { label: "2-Loss Compliance", value: "89%", description: "Percentage of sessions where the 2-loss rule was followed" },
      { label: "Avg Post-Loss Wait", value: "24m", description: "Average time between a loss and the next trade (target: 30m+)" },
    ],
    keyRules: [
      "After any loss, close charts for 30 minutes -- cortisol needs time to normalize",
      "After 2 consecutive losses, the session is over -- no exceptions",
      "Your subjective feeling of calm is not the same as neurochemical baseline",
      "The tilt cascade is the single greatest threat to your account -- the 2-loss rule prevents it",
      "Journal every post-loss decision to build awareness of your cortisol patterns",
    ],
  },
  {
    id: "risk-architecture",
    title: "Risk Architecture",
    grade: "VII",
    tagline: "Risk management is not about avoiding losses. It is about ensuring survival.",
    icon: Shield,
    color: "#f97316",
    overview: "Risk architecture goes beyond individual position sizing. It encompasses portfolio heat management (total exposure across all open positions), correlation risk (how correlated your positions are), drawdown protocols (what to do when your account is in drawdown), and the mathematics of survival. The goal of risk management is not to avoid losses -- losses are the cost of doing business. The goal is to ensure that no single loss, no sequence of losses, and no correlated event can damage your account beyond recovery.",
    concepts: [
      {
        title: "Portfolio Heat Management",
        category: "Portfolio",
        insight: "Individual trade risk is only half the equation. If you have 5 trades open at 1% each, your total portfolio heat is 5%. A single correlated event (USD strength across all dollar pairs) can hit all 5 stops simultaneously, producing a -5% day. Maximum portfolio heat should never exceed 5%.",
        application: "Before opening any new trade, calculate your total open risk across all positions. If the new trade would push total heat above 5%, either reduce the size of the new trade or close an existing position.",
        commonMistake: "Feeling diversified because you are in 5 different instruments. If those instruments are all USD pairs, you have one concentrated USD bet, not five independent trades.",
        advancedNote: "Portfolio heat should be calculated not just by nominal risk but by correlated risk. Two trades with 80%+ correlation should be treated as a single position for heat calculation purposes.",
        practiceExercise: "Track your maximum portfolio heat at the end of each trading day for 30 days. If you find days where heat exceeded 5%, investigate what would have happened if all trades hit stop simultaneously.",
        mastery: "practicing",
      },
      {
        title: "Drawdown Recovery Protocol",
        category: "Survival",
        insight: "A 10% drawdown requires an 11.1% gain to recover. A 25% drawdown requires a 33.3% gain. A 50% drawdown requires a 100% gain. The math of drawdown recovery is exponential -- the deeper you go, the harder it is to get back. Drawdown management is about preventing the depth from reaching the point of no return.",
        application: "Implement a circuit breaker: at -5% monthly drawdown, reduce position size to 0.5%. At -8%, reduce to 0.25%. At -10%, stop trading for the remainder of the month. These rules limit maximum monthly drawdown to approximately -10%, which requires only an 11.1% gain to recover -- achievable within 1-2 months.",
        commonMistake: "Increasing position size during drawdown to recover faster. This is the most dangerous behavior in trading. Larger positions during drawdown lead to deeper drawdown, which requires even larger positions -- a death spiral.",
        advancedNote: "The drawdown protocol should be automated if possible. Emotional state during drawdown is already compromised. Relying on willpower to reduce size when you are losing is unreliable. Set the rules and enforce them mechanically.",
        practiceExercise: "Model your strategy's maximum drawdown using Monte Carlo simulation with 10,000 iterations. This tells you the expected worst-case drawdown and helps you set realistic circuit breaker levels.",
        mastery: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Correlation Wipeout",
        scenario: "Trader has long positions in EURUSD, GBPUSD, and AUDUSD. Each at 1% risk. All three are implicitly short USD. USD strengthens 0.8% on unexpected FOMC statement.",
        lesson: "Three separate trades became one 3% USD bet. The perceived 1% risk per trade was actually 3% concentrated directional exposure. Correlation turned independent positions into a single large position.",
        outcome: "All three trades stopped out within 20 minutes. -3R in a single move. The trader thought they were diversified but they were concentrated.",
        takeaway: "Before opening correlated positions, calculate your total directional exposure. Three USD longs at 1% each = one 3% USD position. Treat correlated positions as one trade for risk purposes.",
      },
    ],
    metrics: [
      { label: "Max Heat", value: "3.8%", description: "Maximum portfolio heat reached in the current month" },
      { label: "Current DD", value: "-1.2%", description: "Current drawdown from equity high-water mark" },
      { label: "Correlation Check", value: "Active", description: "Correlation monitoring status for all open positions" },
    ],
    keyRules: [
      "Maximum portfolio heat: 5% -- no exceptions, regardless of conviction",
      "Correlated positions count as one trade for heat calculation",
      "At -5% monthly drawdown, reduce size by 50%. At -10%, stop for the month.",
      "Never increase position size during drawdown -- this is the death spiral",
      "A 50% drawdown requires 100% to recover -- prevent it at all costs",
    ],
  },
  {
    id: "meta-game",
    title: "Meta-Game Intelligence",
    grade: "VIII",
    tagline: "At the highest level, you are not trading price. You are trading the behavior of other traders.",
    icon: Swords,
    color: "#a78bfa",
    overview: "The meta-game is the game behind the game. At this level, you understand that the market is not a chart -- it is a collection of participants, each with their own strategies, biases, and stop-loss placements. Institutional players exploit predictable retail behavior: they know where retail traders place stops, where they enter breakouts, and where they panic. Understanding this dynamic allows you to position yourself with institutional flow rather than against it.",
    concepts: [
      {
        title: "Retail Behavior Exploitation",
        category: "Meta",
        insight: "Retail traders are predictable: they buy breakouts, sell breakdowns, place stops at obvious levels, and chase momentum. Institutional players use this predictability to build their positions. They need retail traders to take the other side of their trades. Understanding what retail will do at any given level tells you what the institution will exploit.",
        application: "At every key level, ask yourself: what is the obvious retail trade here? Then ask: how would an institution exploit that trade? The institution needs to trigger retail stops to fill their orders. Position yourself with the institution, not with the crowd.",
        commonMistake: "Being the retail trader. If your analysis leads you to the same conclusion as the obvious chart pattern, you are likely on the wrong side. The obvious trade is the one that gets exploited.",
        advancedNote: "The most sophisticated version of this is thinking two levels deep: what does retail see? What does the institution do to exploit retail? And what does the counter-institution do to exploit the first institution? At this level, the game is chess, not checkers.",
        practiceExercise: "At every key level you identify, write down what you think retail traders will do. Then watch what actually happens. Over time, you will develop an intuition for how retail behavior is exploited.",
        mastery: "locked",
      },
    ],
    caseStudies: [
      {
        title: "The Stop Hunt Engine",
        scenario: "D1 support at 1.0850 with visible equal lows. Every retail trader has buy limit orders at 1.0850 and stop losses at 1.0835. The level has been tested 4 times.",
        lesson: "The equal lows created the most obvious support level on the chart. This means the liquidity below (sell stops) is massive. Institutions need this liquidity to fill their buy orders. Price will sweep the stops before reversing.",
        outcome: "Price dipped to 1.0830, collecting every stop. The sell-stop liquidity was absorbed by institutional buy orders. Price reversed violently to 1.0920. Traders who understood the meta-game had limit buys at 1.0830.",
        takeaway: "The most obvious level is the most dangerous level -- for retail. For the informed trader, it is the highest-probability entry zone. The sweep IS the entry.",
      },
    ],
    metrics: [
      { label: "Meta Reads", value: "12", description: "Meta-game analysis sessions completed this month" },
      { label: "Crowd Alignment", value: "Inverse", description: "Current positioning relative to retail consensus" },
      { label: "Sweep Prediction", value: "7/10", description: "Accuracy of predicted liquidity sweep events this month" },
    ],
    keyRules: [
      "The obvious trade is usually the wrong trade -- it is the one that gets exploited",
      "At every key level, ask: where are retail stops? That is where price is going first.",
      "Institutional players need retail on the other side -- understand which side is which",
      "The sweep is not a random event -- it is the entry mechanism for smart money",
      "Think two levels deep: what does retail see, and who is exploiting them?",
    ],
  },
]

/* ── Mastery Badge ── */
function MasteryBadge({ mastery }: { mastery: "locked" | "introduced" | "practicing" | "mastered" }) {
  const c = { mastered: "#10b981", practicing: "#f59e0b", introduced: "#06b6d4", locked: "#52525b" }
  return (
    <span className="text-[6px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ color: `${c[mastery]}80`, backgroundColor: `${c[mastery]}08`, border: `1px solid ${c[mastery]}15` }}>
      {mastery}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════ */

interface MentorGuideProps {
  onStartDemo?: () => void
}

export function MentorGuideAndTutorial({ onStartDemo }: MentorGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)
  const [showCaseStudy, setShowCaseStudy] = useState<string | null>(null)

  const toggleSection = useCallback((id: string) => {
    setExpandedSection(prev => prev === id ? null : id)
    setExpandedConcept(null)
    setShowCaseStudy(null)
  }, [])

  return (
    <div className="px-3 pb-6 pt-2">
      {/* ── Master Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400/50" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em] text-amber-400/60">
            Complete Mentorship Reference
          </span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>
        <p className="text-[9px] font-mono text-white/30 leading-relaxed max-w-[600px]">
          Eight interconnected domains of trading mastery. Each domain builds on the previous one.
          Market structure is the foundation. The meta-game is the summit. Master them in order.
          Every concept includes the insight, the application, the common mistake, advanced notes,
          and a practice exercise to internalize the knowledge through repetition.
        </p>
      </div>

      {/* ── Mentor Sections ── */}
      <div className="space-y-[2px]">
        {MENTOR_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.id
          const SectionIcon = section.icon

          return (
            <div key={section.id}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2.5 px-3 py-3 bg-white/[0.01] hover:bg-white/[0.025] transition-all group"
              >
                <div className="relative shrink-0">
                  <motion.div className="absolute inset-[-3px] rounded-full"
                    style={{ backgroundColor: section.color }}
                    animate={{ opacity: isExpanded ? [0.05, 0.15, 0.05] : [0.02, 0.06, 0.02] }}
                    transition={{ duration: 3, repeat: Infinity }} />
                  <div className="w-7 h-7 flex items-center justify-center border border-white/[0.06] relative">
                    <SectionIcon className="w-3.5 h-3.5" style={{ color: `${section.color}80` }} />
                  </div>
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] font-mono font-black px-1 py-0.5 rounded"
                      style={{ color: `${section.color}80`, backgroundColor: `${section.color}10`, border: `1px solid ${section.color}20` }}>
                      {section.grade}
                    </span>
                    <span className="text-[11px] font-mono font-black text-white/60 group-hover:text-white/80 transition-colors">
                      {section.title}
                    </span>
                  </div>
                  <p className="text-[8px] font-mono text-white/20 mt-0.5 truncate">{section.tagline}</p>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 text-white/15 group-hover:text-white/30 transition-all duration-200 shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-3 border-l border-white/[0.04] py-3 space-y-4">

                      {/* Overview */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-1.5">Overview</div>
                        <p className="text-[9px] font-mono text-white/35 leading-relaxed">{section.overview}</p>
                      </div>

                      {/* Key Rules */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Iron Rules</div>
                        <div className="space-y-1">
                          {section.keyRules.map((rule, i) => (
                            <div key={i} className="flex items-start gap-2 px-2.5 py-1.5 bg-white/[0.008]">
                              <span className="text-[7px] font-mono font-black shrink-0 mt-0.5" style={{ color: `${section.color}50` }}>{String(i + 1).padStart(2, '0')}</span>
                              <p className="text-[8px] font-mono text-white/35 leading-relaxed">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concepts */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Concepts</div>
                        <div className="space-y-[1px]">
                          {section.concepts.map((concept, ci) => {
                            const conceptKey = `${section.id}-c-${ci}`
                            const isConceptExpanded = expandedConcept === conceptKey

                            return (
                              <div key={ci}>
                                <button
                                  onClick={() => {
                                    if (concept.mastery === "locked") return
                                    setExpandedConcept(prev => prev === conceptKey ? null : conceptKey)
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 transition-all group ${
                                    concept.mastery === "locked"
                                      ? "bg-white/[0.005] opacity-40 cursor-not-allowed"
                                      : "bg-white/[0.008] hover:bg-white/[0.025] cursor-pointer"
                                  }`}
                                >
                                  <div className="w-5 h-5 flex items-center justify-center border border-white/[0.06] shrink-0">
                                    <span className="text-[7px] font-mono font-bold" style={{ color: `${section.color}60` }}>
                                      {concept.category.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1 text-left">
                                    <span className="text-[9px] font-mono font-bold text-white/40 group-hover:text-white/60 transition-colors">{concept.title}</span>
                                  </div>
                                  <MasteryBadge mastery={concept.mastery} />
                                  <ChevronRight className={`w-2.5 h-2.5 text-white/15 transition-transform duration-200 shrink-0 ${isConceptExpanded ? "rotate-90" : ""}`} />
                                </button>

                                <AnimatePresence>
                                  {isConceptExpanded && concept.mastery !== "locked" && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 py-2.5 ml-4 border-l border-white/[0.04] space-y-2">
                                        <div className="px-2 py-1.5 bg-white/[0.008]">
                                          <div className="text-[7px] font-mono uppercase tracking-wider mb-1" style={{ color: `${section.color}50` }}>Core Insight</div>
                                          <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{concept.insight}</p>
                                        </div>
                                        <div className="px-2 py-1.5 bg-white/[0.008]">
                                          <div className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider mb-1">Application</div>
                                          <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{concept.application}</p>
                                        </div>
                                        <div className="px-2 py-1.5 bg-white/[0.008]">
                                          <div className="flex items-center gap-1 mb-1">
                                            <AlertTriangle className="w-2 h-2 text-red-400/40" />
                                            <span className="text-[7px] font-mono text-red-400/40 uppercase tracking-wider">Common Mistake</span>
                                          </div>
                                          <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{concept.commonMistake}</p>
                                        </div>
                                        <div className="px-2 py-1.5 bg-white/[0.008]">
                                          <div className="flex items-center gap-1 mb-1">
                                            <Lightbulb className="w-2 h-2 text-amber-400/40" />
                                            <span className="text-[7px] font-mono text-amber-400/40 uppercase tracking-wider">Advanced Note</span>
                                          </div>
                                          <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{concept.advancedNote}</p>
                                        </div>
                                        <div className="px-2 py-1.5 bg-emerald-400/[0.015] border border-emerald-400/[0.06]">
                                          <div className="flex items-center gap-1 mb-1">
                                            <Target className="w-2 h-2 text-emerald-400/40" />
                                            <span className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider">Practice Exercise</span>
                                          </div>
                                          <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{concept.practiceExercise}</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Performance Metrics</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {section.metrics.map((m, i) => (
                            <div key={i} className="px-2 py-1.5 bg-white/[0.008] border border-white/[0.03]">
                              <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-0.5">{m.label}</div>
                              <span className="text-[10px] font-mono font-black" style={{ color: `${section.color}90` }}>{m.value}</span>
                              <p className="text-[7px] font-mono text-white/15 mt-0.5">{m.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Case Study */}
                      {section.caseStudies.map((cs, i) => {
                        const csKey = `${section.id}-cs-${i}`
                        const isCsExpanded = showCaseStudy === csKey
                        return (
                          <div key={i}>
                            <button
                              onClick={() => setShowCaseStudy(prev => prev === csKey ? null : csKey)}
                              className="w-full flex items-center gap-2 px-2.5 py-2 bg-amber-400/[0.015] border border-amber-400/[0.06] hover:bg-amber-400/[0.03] transition-colors text-left"
                            >
                              <Lightbulb className="w-3 h-3 text-amber-400/40 shrink-0" />
                              <span className="text-[9px] font-mono font-bold text-amber-400/50 flex-1">Case Study: {cs.title}</span>
                              <ChevronRight className={`w-2.5 h-2.5 text-amber-400/30 transition-transform duration-200 shrink-0 ${isCsExpanded ? "rotate-90" : ""}`} />
                            </button>
                            <AnimatePresence>
                              {isCsExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 py-2 ml-4 border-l border-amber-400/10 space-y-2">
                                    <div className="px-2 py-1.5 bg-white/[0.008] border-l-2" style={{ borderColor: `${section.color}30` }}>
                                      <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-1">Scenario</div>
                                      <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{cs.scenario}</p>
                                    </div>
                                    <div className="px-2 py-1.5 bg-white/[0.008] border-l-2 border-amber-400/30">
                                      <div className="text-[7px] font-mono text-amber-400/40 uppercase tracking-wider mb-1">Lesson</div>
                                      <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{cs.lesson}</p>
                                    </div>
                                    <div className="px-2 py-1.5 bg-white/[0.008] border-l-2 border-emerald-400/30">
                                      <div className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider mb-1">Outcome</div>
                                      <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{cs.outcome}</p>
                                    </div>
                                    <div className="px-2 py-1.5 bg-white/[0.008] border-l-2 border-purple-400/30">
                                      <div className="text-[7px] font-mono text-purple-400/40 uppercase tracking-wider mb-1">Takeaway</div>
                                      <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{cs.takeaway}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* ── Start Demo CTA ── */}
      {onStartDemo && (
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onStartDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/15 bg-amber-400/[0.04] hover:bg-amber-400/[0.08] transition-all group"
          >
            <Zap className="w-3 h-3 text-amber-400/50 group-hover:text-amber-400/70 transition-colors" />
            <span className="text-[9px] font-mono font-bold text-amber-400/50 group-hover:text-amber-400/70 uppercase tracking-wider transition-colors">
              Begin Mentorship Session
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
