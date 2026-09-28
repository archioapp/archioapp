import type { StudentForecast } from "@/components/student-forecast-system"

// Forecasts used across the hub (e.g., StudentForecastSystem)
export const mockForecasts: StudentForecast[] = [
  {
    id: 1,
    student: "Alex Chen",
    level: "Advanced",
    time: "2 hours ago",
    status: "SETUP VALID",
    pair: "GBPUSD",
    forecast: "GBPUSD Short from 1.3520 - BPR rejection with institutional confluence and DXY strength confirmation",
    chartImage: "/images/student_chart_main.png",
    comments: 24,
    likes: 8,
    views: 156,
    accuracy: 89,
    winRate: 76,
    trades: 142,
    direction: "SHORT",
    timeframe: "4H",
    entry: "1.3520",
    stop: "1.3580",
    target: "1.3420",
    rr: "1:1.7",
    confluences: [
      { name: "BPR Rejection", score: 92 },
      { name: "Institutional Confluence", score: 85 },
      { name: "DXY Strength", score: 78 },
    ],
    commentary: {
      rating: 8.5,
      summary: "Excellent read on institutional flow, aligning with key technical levels for a high-probability setup.",
      confluenceAnalysis: {
        hit: ["BPR Rejection", "Institutional Confluence", "DXY Strength"],
        miss: ["News Catalyst"],
      },
      executionReview: {
        entry: "Entry at 1.3520 was precise, capturing the rejection wick.",
        stopLoss: "Stop loss was well-placed above the key resistance zone.",
        takeProfit: "Take profit target is realistic, targeting the next liquidity pool.",
      },
      actionPlan: [
        "Continue to trust your institutional analysis.",
        "Consider pre-positioning ahead of major news events.",
      ],
    },
  },
  {
    id: 2,
    student: "Samantha Bee",
    level: "Intermediate",
    time: "5 hours ago",
    status: "AGGRESSIVE",
    pair: "EURJPY",
    forecast: "EURJPY Long from 130.50 - Break and retest of daily resistance, targeting weekly high.",
    chartImage: "/images/student1.png",
    comments: 12,
    likes: 5,
    views: 98,
    accuracy: 72,
    winRate: 65,
    trades: 88,
    direction: "LONG",
    timeframe: "1D",
    entry: "130.50",
    stop: "130.10",
    target: "131.50",
    rr: "1:2.5",
    confluences: [
      { name: "Break of Structure", score: 88 },
      { name: "Demand Zone", score: 75 },
    ],
    commentary: {
      rating: 7.0,
      summary: "Solid trend-following setup, but entry could be refined for a better risk-reward ratio.",
      confluenceAnalysis: {
        hit: ["Break of Structure", "Demand Zone"],
        miss: ["Momentum Divergence"],
      },
      executionReview: {
        entry: "Entry was slightly premature, could wait for clearer confirmation.",
        stopLoss: "Stop is logical, below the demand zone.",
        takeProfit: "Target is ambitious but achievable if momentum continues.",
      },
      actionPlan: ["Work on entry timing.", "Analyze momentum indicators alongside structure."],
    },
  },
]

// Entries for the EntryRoom tab in the FloatingCommunityHub
// Shape matches components/community/entry-room.tsx expectations (entry.user.*, entry.trade.*, etc.)
export const mockEntries = [
  {
    id: "entry-2",
    user: {
      name: "Alex Chen",
      avatar: "/images/student1.png",
    },
    trade: {
      pair: "GBP/USD",
      direction: "Short",
      entryPrice: "1.3520",
    },
    confluences: ["BPR", "Institutional Flow", "DXY Strength"],
    social: {
      likes: 32,
      comments: 11,
    },
    timestamp: "5m ago",
  },
  {
    id: "entry-1",
    user: {
      name: "Sophia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    trade: {
      pair: "AUD/USD",
      direction: "Short",
      entryPrice: "0.6650",
    },
    confluences: ["Supply Zone", "Momentum Shift"],
    social: {
      likes: 5,
      comments: 2,
    },
    timestamp: "Just now",
  },
]
