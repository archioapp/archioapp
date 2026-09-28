import type { MentorTemplate } from "../types"

export const JADECAP_TEMPLATE: MentorTemplate = {
  id: "jadecap-ict-ny",
  name: "ICT NY Session Method",
  mentorName: "JadeCap",
  mentorTitle: "ICT NY Session Specialist",
  methodology: "Inner Circle Trader",
  accentColor: "#a78bfa",

  session: {
    id: "ny",
    label: "New York",
    preSessionStart: 12,
    killzoneStart: 13.5,
    killzoneEnd: 15.5,
    extendedEnd: 20,
    timezone: "America/New_York",
    timezoneLabel: "ET",
  },

  dayRules: [
    { day: 0, validity: "INVALID", note: "Markets closed" },
    { day: 1, validity: "VALID", note: "Monday -- Watch for weekly range establishment" },
    { day: 2, validity: "VALID", note: "Tuesday -- Primary reversal day" },
    { day: 3, validity: "VALID", note: "Wednesday -- Midweek continuation" },
    { day: 4, validity: "VALID", note: "Thursday -- Late-week momentum" },
    { day: 5, validity: "CONDITIONAL", note: "Friday -- No new entries after 12:00 ET", cutoffHourUTC: 16 },
    { day: 6, validity: "INVALID", note: "Markets closed" },
  ],

  newsRules: {
    highImpactCooldown: 30,
    mediumImpactSizeReduction: 50,
    lowImpactAction: "IGNORE",
  },

  defaultBias: {
    direction: "BEARISH",
    instrument: "EUR/USD",
    timeframe: "D1 + H4",
    reasoning: "D1 broke structure to the downside. H4 order block at 1.0920 is the draw. Looking for LTF short model after 9:30 displacement.",
    updatedAt: new Date().toISOString(),
    confidence: 72,
  },

  entryModels: [
    {
      id: "ny-ob-sweep",
      name: "NY Killzone OB Sweep",
      shortName: "OB Sweep",
      description: "Primary model. Waits for displacement after 9:30 ET, identifies fair value gap, enters on order block retest within the gap. Requires HTF bias alignment.",
      session: "ny",
      state: "FORMING",
      instruments: ["EURUSD", "GBPUSD"],
      targetRMultiple: 3,
      executionTimeframe: "M5 / M15",
      historicalWinRate: 62,
      averageR: 2.4,
      sampleSize: 147,
      conditions: [
        {
          id: "c1",
          label: "HTF Bias Aligned",
          description: "D1/H4 structure confirms directional bias. Current bias must be established before session.",
          status: "MET",
          evaluatedAt: new Date().toISOString(),
          whatToWatch: "Check D1 chart for the most recent swing structure break. H4 must show at least one lower-low (bearish) or higher-high (bullish) confirming the D1 narrative.",
          checkTimeframe: "D1 + H4",
        },
        {
          id: "c2",
          label: "Killzone Active",
          description: "NY Killzone window is open (9:30-11:30 ET). No entries outside this window.",
          status: "PENDING",
          whatToWatch: "The killzone is time-locked. Watch the clock. If it is before 9:30 AM ET, you are in pre-session analysis mode only.",
          checkTimeframe: "Clock",
        },
        {
          id: "c3",
          label: "Displacement Confirmed",
          description: "Minimum 15-pip impulsive move in bias direction after killzone open. Must be a single strong candle or series.",
          status: "PENDING",
          whatToWatch: "Wait for a strong, impulsive move -- a single large candle or 2-3 consecutive candles moving aggressively in the bias direction. This is smart money tipping their hand.",
          checkTimeframe: "M5",
        },
        {
          id: "c4",
          label: "Fair Value Gap Formed",
          description: "FVG forms on M5/M15 in the direction of the displacement. Must be clean with no immediate fill.",
          status: "PENDING",
          whatToWatch: "After displacement, look for a 3-candle pattern where the wicks of candle 1 and candle 3 do not overlap. That gap is the FVG. It must be in the displacement direction.",
          checkTimeframe: "M5 / M15",
        },
        {
          id: "c5",
          label: "Order Block Respected",
          description: "Price retraces into the FVG and touches/respects a valid M5/M15 order block. Entry is placed at the OB level.",
          status: "PENDING",
          whatToWatch: "The order block is the last opposing candle before the displacement. When price retraces into the FVG and touches this OB, that is your entry. Place your limit order at the OB body.",
          checkTimeframe: "M5",
        },
      ],
      invalidationRules: [
        "Price closes above/below the H4 order block that defines the bias",
        "Two consecutive H4 candles against the bias direction",
        "Major news event within 30 minutes (high-impact)",
        "Killzone window has closed without displacement",
      ],
      education: {
        overview: "The NY Killzone OB Sweep is JadeCap's highest-conviction model. It exploits the predictable volatility injection that occurs when New York opens at 9:30 AM ET. Smart money uses this window to displace price, create imbalances (FVGs), and then retrace to order blocks before continuing in the HTF direction. Your job is to identify the displacement, mark the FVG, find the order block inside it, and enter with a tight stop below the OB.",
        steps: [
          {
            id: "s1", stepNumber: 1,
            title: "Establish HTF Bias (Pre-Session)",
            description: "Before the session opens, analyze the D1 and H4 charts. Identify the most recent structural shift. Is price making higher-highs or lower-lows? Where is the nearest liquidity pool? The bias MUST be established before 9:00 AM ET.",
            visualCue: "Look for a clear break of structure on D1. Then confirm on H4 with at least one swing in the same direction.",
            mentorTip: "If D1 and H4 disagree, I sit on my hands. Both timeframes must align. No exceptions.",
            media: {
              id: "m1", type: "annotated_chart",
              src: "/mentor/education/htf-bias-example.jpg",
              caption: "D1 bearish BOS with H4 confirmation -- ideal pre-session setup"
            },
          },
          {
            id: "s2", stepNumber: 2,
            title: "Wait for Killzone Open (9:30 AM ET)",
            description: "Do nothing before 9:30. Pre-session is for analysis only. Mark your key levels, set alerts, and wait. The killzone is when institutional volume enters the market.",
            visualCue: "Watch the clock and the M15 chart. Volume will spike dramatically at 9:30. You are looking for the FIRST aggressive move after the open.",
            mentorTip: "I have a rule: no charts on M5 before 9:30. If you are staring at lower timeframes during pre-session, you will manufacture signals that do not exist.",
          },
          {
            id: "s3", stepNumber: 3,
            title: "Identify Displacement",
            description: "Displacement is a rapid, aggressive move of at least 15 pips in the bias direction. It tells you smart money is moving. This is NOT a slow drift -- it is violent and unmistakable.",
            visualCue: "On M5: look for a single candle with a body at least 15 pips, or 2-3 consecutive candles with very small wicks moving in one direction. The candle bodies should be large relative to the session average.",
            mentorTip: "If you are unsure whether it is displacement, it is not. Real displacement makes you feel like you missed it. That feeling is actually your confirmation.",
            media: {
              id: "m3", type: "annotated_chart",
              src: "/mentor/education/displacement-example.jpg",
              caption: "22-pip bearish displacement at 9:47 AM -- classic smart money injection"
            },
          },
          {
            id: "s4", stepNumber: 4,
            title: "Mark the Fair Value Gap",
            description: "After displacement, a Fair Value Gap forms. This is a 3-candle pattern where candle 1's low and candle 3's high do not overlap (bearish) or candle 1's high and candle 3's low do not overlap (bullish). The gap between them is the FVG.",
            visualCue: "Use a rectangle tool to mark the gap between candle 1 and candle 3 wicks. This is your retracement zone. Price will likely return here before continuing.",
            mentorTip: "I only trade FVGs that form on M5 or M15. M1 FVGs are noise. And the FVG must be clean -- if it gets immediately filled in the next candle, it is invalid.",
            media: {
              id: "m4", type: "diagram",
              src: "/mentor/education/fvg-diagram.jpg",
              caption: "Fair Value Gap anatomy -- the gap between candle 1 and candle 3 wicks"
            },
          },
          {
            id: "s5", stepNumber: 5,
            title: "Enter at the Order Block",
            description: "The order block is the last opposing candle before the displacement. When price retraces into the FVG and reaches the OB level, that is your entry. Place a limit order at the OB candle body with a stop 1-2 pips beyond the OB wick.",
            visualCue: "The OB is the last green candle before a bearish displacement (or last red before bullish). Your entry is at the body of this candle. Your stop is 1-2 pips beyond its wick.",
            mentorTip: "I always use limit orders, never market orders. If price does not come to my level, I do not chase. There will be another setup tomorrow.",
            media: {
              id: "m5", type: "annotated_chart",
              src: "/mentor/education/ob-entry-example.jpg",
              caption: "Perfect OB entry at 1.0847 with 8-pip stop -- 3.2R winner"
            },
          },
        ],
        commonMistakes: [
          "Entering before displacement -- guessing instead of waiting for confirmation",
          "Trading FVGs on M1 -- too much noise, not enough institutional footprint",
          "Moving stops to breakeven too early -- the OB retest often wicks beyond entry before moving",
          "Ignoring the HTF bias and trying to trade counter-trend displacement",
          "Chasing after the displacement instead of waiting for the retracement to the FVG/OB",
          "Taking multiple entries in the same killzone -- the method gives 1-2 clean setups maximum",
        ],
        psychologyNotes: "When you see displacement, your instinct will be to jump in immediately. That is the wrong move. Displacement is your SIGNAL to prepare, not your signal to enter. The entry comes later, at the retracement. If you feel urgency, that is your ego talking. The method is designed around patience. Trust the retracement.",
        chartExamples: [
          {
            id: "ce1", type: "annotated_chart",
            src: "/mentor/education/eurusd-march12.jpg",
            caption: "EURUSD March 12 -- All 5 conditions met, 3.2R result"
          },
          {
            id: "ce2", type: "annotated_chart",
            src: "/mentor/education/eurusd-march19.jpg",
            caption: "EURUSD March 19 -- Displacement without FVG -- no trade taken"
          },
          {
            id: "ce3", type: "annotated_chart",
            src: "/mentor/education/gbpusd-march26.jpg",
            caption: "GBPUSD March 26 -- Perfect Asia sweep into NY OB entry"
          },
        ],
        keyTakeaway: "The OB Sweep model is not about prediction. It is about waiting for a specific sequence of events -- displacement, FVG, OB retest -- and only acting when all 5 conditions are green. If one is missing, you wait. The market runs 5 days a week. One missed day means nothing. One disciplined entry means everything.",
      },
    },
    {
      id: "asia-sweep",
      name: "Asian Range Sweep",
      shortName: "Asia Sweep",
      description: "Secondary model. Looks for sweep of Asian session high or low during NY open. Reversal pattern must confirm at the sweep level.",
      session: "ny",
      state: "INACTIVE",
      instruments: ["EURUSD"],
      targetRMultiple: 2.5,
      executionTimeframe: "M5",
      historicalWinRate: 55,
      averageR: 1.9,
      sampleSize: 83,
      conditions: [
        {
          id: "a1",
          label: "Asia Range Defined",
          description: "Asian session high and low are clearly established with no overnight extension.",
          status: "MET",
          whatToWatch: "Mark the high and low of the Asian session (7 PM - 12 AM ET). The range should be under 40 pips for this model to be valid.",
          checkTimeframe: "H1",
        },
        {
          id: "a2",
          label: "Killzone Active",
          description: "NY Killzone window is open (9:30-11:30 ET).",
          status: "PENDING",
          whatToWatch: "Same as OB Sweep -- wait for 9:30 AM ET.",
          checkTimeframe: "Clock",
        },
        {
          id: "a3",
          label: "Asia Extreme Swept",
          description: "Price sweeps the Asian high or low, collecting liquidity from overnight stops.",
          status: "PENDING",
          whatToWatch: "Watch for price to trade BEYOND the Asia high or low by at least 5-10 pips, then quickly reject. The sweep collects stop losses placed by overnight traders.",
          checkTimeframe: "M5",
        },
        {
          id: "a4",
          label: "Reversal Pattern Confirmed",
          description: "M5 shows bullish/bearish engulfing or displacement candle at the sweep level, confirming rejection.",
          status: "PENDING",
          whatToWatch: "After the sweep, look for an immediate rejection -- a large engulfing candle or a rapid reversal back inside the range. This confirms the liquidity grab is complete.",
          checkTimeframe: "M5",
        },
      ],
      invalidationRules: [
        "Asia range is too wide (> 40 pips) -- reduces sweep probability",
        "Price re-sweeps the same extreme within 15 minutes",
        "No reversal pattern within 3 candles of the sweep",
      ],
      education: {
        overview: "The Asian Range Sweep exploits the predictable behavior of institutional players who target overnight liquidity during the NY open. Asian session traders place stops beyond the range, creating a liquidity pool. Smart money sweeps these stops to fill orders before moving in the real direction.",
        steps: [
          {
            id: "as1", stepNumber: 1,
            title: "Mark the Asian Range",
            description: "Identify the high and low of the Asian session (7 PM - 12 AM ET). Draw horizontal lines at both levels. Measure the range -- it should be under 40 pips.",
            visualCue: "Use the H1 chart to clearly see the Asian session as a consolidation box. The range should be tight and well-defined.",
            mentorTip: "If the Asian range is wider than 40 pips, skip this model for the day. Wide ranges mean the sweep has less energy.",
          },
          {
            id: "as2", stepNumber: 2,
            title: "Wait for the Sweep",
            description: "During the NY open, watch for price to push beyond one of the Asia extremes. The sweep should be quick -- a spike beyond the level followed by immediate rejection.",
            visualCue: "A long wick beyond the Asia high/low on M5 is the classic sweep signature. The body should close back inside the range.",
            mentorTip: "The best sweeps happen in the first 30 minutes of the killzone. If there is no sweep by 10:00 AM, this model is likely inactive for the day.",
          },
          {
            id: "as3", stepNumber: 3,
            title: "Confirm the Reversal",
            description: "After the sweep, you need a reversal confirmation. Look for a bullish or bearish engulfing pattern on M5, or a displacement candle moving back into the range.",
            visualCue: "The reversal candle should be strong -- its body should be larger than the previous 3-5 candles. Weak reversals often fail.",
            mentorTip: "I give the market 3 candles after the sweep to confirm. If there is no clear reversal in 3 candles, the sweep might be genuine breakout, not a liquidity grab.",
          },
        ],
        commonMistakes: [
          "Trading sweeps on wide Asian ranges (> 40 pips)",
          "Entering before the reversal confirmation",
          "Not checking HTF bias -- the sweep should align with the higher timeframe direction",
        ],
        psychologyNotes: "The sweep looks scary because it appears like a breakout. Your instinct will tell you to trade WITH the sweep. The method says to trade AGAINST it. This requires conviction in the setup and trust in the liquidity theory.",
        chartExamples: [
          {
            id: "ace1", type: "annotated_chart",
            src: "/mentor/education/asia-sweep-example.jpg",
            caption: "Classic Asia low sweep with immediate M5 engulfing reversal"
          },
        ],
        keyTakeaway: "The Asia Sweep is a liquidity play. You are betting that the move beyond the range was a stop hunt, not a genuine breakout. Wait for confirmation before committing.",
      },
    },
  ],

  riskGuidance: {
    maxRiskPerTrade: 1.0,
    maxTradesPerDay: 2,
    maxDailyLoss: 2.0,
    minRiskReward: 2.0,
    maxConcurrentTrades: 2,
    noAveraging: true,
    noMartingale: true,
    additionalRules: [
      "No trading during first 5 minutes of killzone -- wait for context",
      "If 2 consecutive losses, stop trading for the day",
      "Friday: no new entries after 12:00 PM ET",
      "FOMC day: wait until 30 minutes after the release",
    ],
  },

  aiPersona: {
    voice: "Direct, disciplined, patient. Uses ICT terminology natively. Never hypes or encourages reckless behavior.",
    coreBeliefs: [
      "The market gives you 1-2 clean opportunities per session. Your job is to wait, not to hunt.",
      "Patience is not passive -- it is the most aggressive form of discipline.",
      "Every valid setup will come back. If you missed it, the market will give you another one tomorrow.",
      "Your stop loss is your business partner. Respect it unconditionally.",
      "The best traders are the ones who can sit and do nothing for hours. That is the edge.",
    ],
    terminology: [
      "order block", "fair value gap", "liquidity sweep", "displacement",
      "killzone", "smart money", "inducement", "breaker block",
      "HTF narrative", "LTF confirmation", "premium/discount",
    ],
    refusalPattern: "That does not meet the entry criteria. [Specific reason]. The method requires patience here. Wait for the next valid setup.",
    patience: "JadeCap's method requires waiting for the 9:30-10:30 killzone. If you are looking at charts before this window, you are either pre-planning (good) or hunting (bad). Which one is it?",
    systemPromptPrefix: `You are JadeCap's AI assistant. You embody JadeCap's ICT NY Session methodology exactly. You answer as JadeCap would -- direct, disciplined, and patient. You use ICT terminology natively. You NEVER suggest trades outside the defined killzone. You NEVER validate setups that don't meet all conditions. When a student asks about a setup, you check it against the conditions checklist and give a precise answer with the specific condition that is missing or met. You refuse to encourage impulsive trading. Your core belief: the market gives 1-2 clean opportunities per session, and the student's job is to wait.`,
    suggestedQuestions: [
      "Is this a valid entry right now?",
      "What condition am I missing?",
      "Should I be at my desk?",
      "How do I identify a clean FVG?",
      "When should I move my stop?",
      "What is displacement vs normal movement?",
    ],
  },

  methodVault: [
    {
      id: "mv1",
      title: "NY Killzone OB Sweep -- Complete Model Breakdown",
      category: "lesson",
      description: "Full walkthrough of the primary entry model with annotated chart examples from 12 live sessions.",
      tags: ["entry model", "OB sweep", "killzone", "core"],
      createdAt: "2026-02-15T10:00:00Z",
    },
    {
      id: "mv2",
      title: "How to Build Your Daily Bias",
      category: "lesson",
      description: "Step-by-step process for constructing directional bias using D1 and H4 structure before the session opens.",
      tags: ["bias", "pre-session", "structure", "HTF"],
      createdAt: "2026-02-20T10:00:00Z",
    },
    {
      id: "mv3",
      title: "Trade Plan Template -- JadeCap Standard",
      category: "trade_plan",
      description: "The exact trade plan template JadeCap uses before every session. Fill in before 9:00 AM ET.",
      tags: ["trade plan", "template", "discipline"],
      createdAt: "2026-03-01T10:00:00Z",
    },
    {
      id: "mv4",
      title: "EURUSD March 12 -- Perfect OB Sweep Execution",
      category: "chart_example",
      description: "Annotated chart showing all 5 conditions met in sequence, entry, management, and 3.2R result.",
      tags: ["chart", "EURUSD", "OB sweep", "live example"],
      createdAt: "2026-03-12T16:00:00Z",
    },
    {
      id: "mv5",
      title: "War Room Archive: EURUSD NY Sweep March 19",
      category: "war_room_archive",
      description: "Full war room recording with mentor commentary, student Q&A, and post-trade review.",
      tags: ["war room", "archive", "live session"],
      createdAt: "2026-03-19T16:00:00Z",
    },
  ],
}
