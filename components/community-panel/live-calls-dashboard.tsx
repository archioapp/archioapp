"use client"

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import {
  TrendingUp, TrendingDown, Target, Crown, BarChart3, Flame, Users, Clock, Zap, Activity,
  Calendar, ArrowUpRight, ArrowDownRight, Shield, Eye, Signal, Layers, Star, Timer,
  Crosshair, Radio, LineChart, Gauge, Award, PieChart, Brain, Sparkles, CircleDot,
  ChevronRight, Hexagon, Globe, Settings, RefreshCw, ArrowRightLeft, ChevronDown,
  ChevronUp, Check, X, Bookmark, Share2, AlertTriangle, Info, TrendingUp as Trending,
  Minus, BarChart2, ArrowRight, Wifi, Mic, MessageSquare, ThumbsUp, ThumbsDown, Filter,
  SlidersHorizontal, GripVertical, EyeOff, RotateCcw, Save, Maximize2, Lock, Unlock,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// ══════════════════════════════════════════════════════════════════
// PREMIUM CONSTANTS
// ══════════════════════════════════════════════════════════════════

const EASE_PREMIUM = [0.22, 0.68, 0.36, 1] as const
const EASE_ARR = EASE_PREMIUM as unknown as [number, number, number, number]
const SPRING_CARD = { type: "spring" as const, stiffness: 280, damping: 24, mass: 0.7 }
const SPRING_BOUNCE = { type: "spring" as const, stiffness: 400, damping: 18 }

type TimePeriod = "7d" | "30d" | "90d" | "all"
const PERIODS: TimePeriod[] = ["7d", "30d", "90d", "all"]
const PREV_PERIOD: Record<TimePeriod, TimePeriod> = { "7d": "30d", "30d": "90d", "90d": "all", all: "all" }

// ══════════════════════════════════════════════════════════════════
// DATA LAYER (preserved + extended)
// ══════════════════════════════════════════════════════════════════

interface DashboardMetrics {
  totalSessions: number; totalTrades: number; netPnl: string; netPnlValue: number
  overallWinRate: number; avgSessionDuration: string; avgTradesPerSession: number
  peakAudience: number; avgAudience: number; totalEvents: number; avgEventsPerSession: number
  profitableSessions: number; lossSessions: number; breakevenSessions: number
  bestSession: { name: string; pnl: string; date: string }
  worstSession: { name: string; pnl: string; date: string }
  longestStreak: number; currentStreak: number; profitFactor: number
  avgRR: string; totalWins: number; totalLosses: number
  // Extended metrics (System B + C)
  avgWin: number; avgLoss: number; expectancy: number; maxDrawdown: number; maxDrawdownPct: number
  currentDrawdown: number; drawdownDuration: number; rollingWR: number[]
  performanceMomentum: "improving" | "stable" | "declining"
  performanceGrade: string; engagementQuality: number; audienceRetention: number
  // System C v2 deep evolution
  grossPnl: number            // sum of winning trades only
  feesPaid: number            // total fees
  livePositionsPnl: number    // in-progress open positions value
  dailyReturns: number[]      // daily P&L series used for CV/smoothness
  rMultiples: number[]        // R-multiple outcomes for distribution chart
  concentrationByInstrument: { symbol: string; pnl: number; color: string }[]
  concentrationBySessionType: { type: string; pnl: number; color: string }[]
  concentrationTopSessionsPct: number   // % P&L from top 3 sessions
  recoveryStats: { avgRecoveryDays: number; worstRecoveryDays: number; currentRecoveryDay: number; expectedRecoveryDays: number }
  curveSmoothness: number     // coefficient of variation of daily returns (lower = smoother)
  riskAdjExpectancy: number   // expectancy / avg_loss
  gradeInputs: { expectancyN: number; smoothnessN: number; profitFactorN: number; concentrationN: number; sampleSizeN: number; momentumN: number; score: number }
}

const METRICS: Record<TimePeriod, DashboardMetrics> = {
  "7d": {
    totalSessions: 7, totalTrades: 18, netPnl: "+$4,355", netPnlValue: 4355,
    overallWinRate: 64, avgSessionDuration: "1h 22m", avgTradesPerSession: 2.6,
    peakAudience: 847, avgAudience: 589, totalEvents: 98, avgEventsPerSession: 14,
    profitableSessions: 4, lossSessions: 2, breakevenSessions: 1,
    bestSession: { name: "Power Hour Perfect", pnl: "+$3,200", date: "Apr 10" },
    worstSession: { name: "Consolidation Day", pnl: "-$680", date: "Apr 8" },
    longestStreak: 3, currentStreak: 1, profitFactor: 2.8, avgRR: "1:2.4", totalWins: 12, totalLosses: 6,
    avgWin: 485, avgLoss: 290, expectancy: 136.4, maxDrawdown: 1725, maxDrawdownPct: 8.2,
    currentDrawdown: 720, drawdownDuration: 2, rollingWR: [60, 67, 57, 71, 60, 64, 70],
    performanceMomentum: "improving", performanceGrade: "B+", engagementQuality: 78, audienceRetention: 72,
    grossPnl: 7145, feesPaid: 216, livePositionsPnl: 340,
    dailyReturns: [1120, 2480, 0, -680, 3200, -1045, -720],
    rMultiples: [2.1, 1.8, 0, -1.0, 2.8, -0.9, -0.8, 1.4, 2.2, -0.6, 1.1, 2.5, -0.4, 1.9, 0.8, -0.7, 1.6, 2.3],
    concentrationByInstrument: [
      { symbol: "XAU/USD", pnl: 3180, color: "245,158,11" },
      { symbol: "EUR/USD", pnl: 620, color: "56,189,248" },
      { symbol: "GBP/USD", pnl: 280, color: "139,92,246" },
      { symbol: "USD/JPY", pnl: -165, color: "239,68,68" },
      { symbol: "Other", pnl: 440, color: "148,163,184" },
    ],
    concentrationBySessionType: [
      { type: "Live Trading", pnl: 2960, color: "16,185,129" },
      { type: "Scalping", pnl: 860, color: "56,189,248" },
      { type: "News", pnl: -180, color: "245,158,11" },
      { type: "Analysis", pnl: 715, color: "139,92,246" },
    ],
    concentrationTopSessionsPct: 73,
    recoveryStats: { avgRecoveryDays: 3.2, worstRecoveryDays: 6, currentRecoveryDay: 2, expectedRecoveryDays: 2 },
    curveSmoothness: 0.68, riskAdjExpectancy: 0.47,
    gradeInputs: { expectancyN: 0.68, smoothnessN: 0.54, profitFactorN: 0.72, concentrationN: 0.32, sampleSizeN: 0.22, momentumN: 0.78, score: 0.552 },
  },
  "30d": {
    totalSessions: 24, totalTrades: 68, netPnl: "+$18,240", netPnlValue: 18240,
    overallWinRate: 68, avgSessionDuration: "1h 18m", avgTradesPerSession: 2.8,
    peakAudience: 1124, avgAudience: 621, totalEvents: 384, avgEventsPerSession: 16,
    profitableSessions: 16, lossSessions: 6, breakevenSessions: 2,
    bestSession: { name: "NFP Breakout Session", pnl: "+$5,800", date: "Mar 28" },
    worstSession: { name: "Overtrading Day", pnl: "-$1,420", date: "Mar 22" },
    longestStreak: 5, currentStreak: 1, profitFactor: 3.1, avgRR: "1:2.6", totalWins: 46, totalLosses: 22,
    avgWin: 520, avgLoss: 278, expectancy: 164.8, maxDrawdown: 2840, maxDrawdownPct: 6.4,
    currentDrawdown: 0, drawdownDuration: 0, rollingWR: [62, 65, 70, 68, 72, 64, 68, 70, 66, 71],
    performanceMomentum: "stable", performanceGrade: "A", engagementQuality: 82, audienceRetention: 76,
    grossPnl: 26230, feesPaid: 742, livePositionsPnl: 0,
    dailyReturns: [4355, 5120, 3840, 4925],
    rMultiples: [2.6, 1.9, -0.7, 2.2, 1.4, -0.8, 2.8, 1.7, 0.9, 2.1, -1.0, 1.6, 2.3, 1.1, -0.5, 2.0, 1.8, -0.9, 2.4, 1.2, 1.5, 2.7, -0.6, 1.3, 2.5, 0.8, -0.4, 1.9],
    concentrationByInstrument: [
      { symbol: "XAU/USD", pnl: 11200, color: "245,158,11" },
      { symbol: "EUR/USD", pnl: 3420, color: "56,189,248" },
      { symbol: "GBP/USD", pnl: 1845, color: "139,92,246" },
      { symbol: "USD/JPY", pnl: 920, color: "16,185,129" },
      { symbol: "Other", pnl: 855, color: "148,163,184" },
    ],
    concentrationBySessionType: [
      { type: "Live Trading", pnl: 10240, color: "16,185,129" },
      { type: "Scalping", pnl: 4820, color: "56,189,248" },
      { type: "News", pnl: 1680, color: "245,158,11" },
      { type: "Analysis", pnl: 1500, color: "139,92,246" },
    ],
    concentrationTopSessionsPct: 52,
    recoveryStats: { avgRecoveryDays: 2.8, worstRecoveryDays: 5, currentRecoveryDay: 0, expectedRecoveryDays: 0 },
    curveSmoothness: 0.42, riskAdjExpectancy: 0.59,
    gradeInputs: { expectancyN: 0.78, smoothnessN: 0.72, profitFactorN: 0.79, concentrationN: 0.48, sampleSizeN: 0.58, momentumN: 0.65, score: 0.682 },
  },
  "90d": {
    totalSessions: 72, totalTrades: 198, netPnl: "+$52,680", netPnlValue: 52680,
    overallWinRate: 71, avgSessionDuration: "1h 25m", avgTradesPerSession: 2.75,
    peakAudience: 1380, avgAudience: 645, totalEvents: 1152, avgEventsPerSession: 16,
    profitableSessions: 52, lossSessions: 14, breakevenSessions: 6,
    bestSession: { name: "Gold Institutional Flow", pnl: "+$8,200", date: "Feb 12" },
    worstSession: { name: "Revenge Trading Day", pnl: "-$2,100", date: "Jan 28" },
    longestStreak: 8, currentStreak: 1, profitFactor: 3.4, avgRR: "1:2.8", totalWins: 141, totalLosses: 57,
    avgWin: 548, avgLoss: 245, expectancy: 178.6, maxDrawdown: 3200, maxDrawdownPct: 5.1,
    currentDrawdown: 0, drawdownDuration: 0, rollingWR: [65, 68, 70, 72, 69, 74, 71, 73, 70, 72],
    performanceMomentum: "improving", performanceGrade: "A+", engagementQuality: 86, audienceRetention: 81,
    grossPnl: 78420, feesPaid: 2240, livePositionsPnl: 0,
    dailyReturns: [14200, 18960, 19520],
    rMultiples: [2.8, 2.1, -0.9, 2.4, 1.8, -0.6, 2.9, 1.5, 0.7, 2.3, -1.1, 1.9, 2.6, 1.2, -0.5, 2.2, 1.6, -0.8, 2.7, 1.4, 1.8, 2.5, -0.7, 1.3, 2.8, 0.9, -0.4, 2.0, 1.7, 2.4, -0.6, 1.5, 2.1, 2.6, 1.8, -0.9, 2.3, 1.4, 2.7, 0.6, 1.9, 2.5, -1.0, 1.6, 2.8, 2.0, 1.3, -0.5, 2.4, 1.7, 2.2, -0.8, 1.5, 2.6, 1.9, 2.0, -0.6, 2.3, 1.4, 2.5],
    concentrationByInstrument: [
      { symbol: "XAU/USD", pnl: 31840, color: "245,158,11" },
      { symbol: "EUR/USD", pnl: 8920, color: "56,189,248" },
      { symbol: "GBP/USD", pnl: 6120, color: "139,92,246" },
      { symbol: "USD/JPY", pnl: 3480, color: "16,185,129" },
      { symbol: "Other", pnl: 2320, color: "148,163,184" },
    ],
    concentrationBySessionType: [
      { type: "Live Trading", pnl: 28940, color: "16,185,129" },
      { type: "Scalping", pnl: 14220, color: "56,189,248" },
      { type: "News", pnl: 5640, color: "245,158,11" },
      { type: "Analysis", pnl: 3880, color: "139,92,246" },
    ],
    concentrationTopSessionsPct: 38,
    recoveryStats: { avgRecoveryDays: 2.1, worstRecoveryDays: 5, currentRecoveryDay: 0, expectedRecoveryDays: 0 },
    curveSmoothness: 0.29, riskAdjExpectancy: 0.73,
    gradeInputs: { expectancyN: 0.89, smoothnessN: 0.84, profitFactorN: 0.86, concentrationN: 0.62, sampleSizeN: 0.82, momentumN: 0.78, score: 0.812 },
  },
  all: {
    totalSessions: 142, totalTrades: 398, netPnl: "+$112,450", netPnlValue: 112450,
    overallWinRate: 72, avgSessionDuration: "1h 20m", avgTradesPerSession: 2.8,
    peakAudience: 1520, avgAudience: 658, totalEvents: 2272, avgEventsPerSession: 16,
    profitableSessions: 104, lossSessions: 26, breakevenSessions: 12,
    bestSession: { name: "Gold Institutional Flow", pnl: "+$8,200", date: "Feb 12" },
    worstSession: { name: "Revenge Trading Day", pnl: "-$2,100", date: "Jan 28" },
    longestStreak: 11, currentStreak: 1, profitFactor: 3.6, avgRR: "1:2.9", totalWins: 286, totalLosses: 112,
    avgWin: 560, avgLoss: 238, expectancy: 184.2, maxDrawdown: 3200, maxDrawdownPct: 4.8,
    currentDrawdown: 0, drawdownDuration: 0, rollingWR: [64, 66, 69, 71, 70, 72, 73, 71, 72, 74],
    performanceMomentum: "improving", performanceGrade: "A+", engagementQuality: 88, audienceRetention: 83,
    grossPnl: 168080, feesPaid: 4620, livePositionsPnl: 0,
    dailyReturns: [22400, 37370, 34440, 18240],
    rMultiples: [2.9, 2.2, -0.8, 2.5, 1.9, -0.5, 2.7, 1.6, 0.8, 2.4, -1.0, 1.8, 2.6, 1.3, -0.4, 2.3, 1.7, -0.7, 2.8, 1.5, 1.9, 2.6, -0.6, 1.4, 2.9, 1.0, -0.3, 2.1, 1.8, 2.5, -0.5, 1.6, 2.2, 2.7, 1.9, -0.8, 2.4, 1.5, 2.8, 0.7, 2.0, 2.6, -0.9, 1.7, 2.9, 2.1, 1.4, -0.4, 2.5, 1.8, 2.3, -0.7, 1.6, 2.7, 2.0, 2.1, -0.5, 2.4, 1.5, 2.6, 1.8, 2.3, -0.6, 2.1, 1.7, 2.8, 2.0, 1.9, -0.8, 2.5, 1.4, 2.6, 1.8, 2.2, -0.5, 2.3, 1.6, 2.7, 1.9],
    concentrationByInstrument: [
      { symbol: "XAU/USD", pnl: 64820, color: "245,158,11" },
      { symbol: "EUR/USD", pnl: 19240, color: "56,189,248" },
      { symbol: "GBP/USD", pnl: 12860, color: "139,92,246" },
      { symbol: "USD/JPY", pnl: 8420, color: "16,185,129" },
      { symbol: "Other", pnl: 7110, color: "148,163,184" },
    ],
    concentrationBySessionType: [
      { type: "Live Trading", pnl: 58420, color: "16,185,129" },
      { type: "Scalping", pnl: 31240, color: "56,189,248" },
      { type: "News", pnl: 12840, color: "245,158,11" },
      { type: "Analysis", pnl: 9950, color: "139,92,246" },
    ],
    concentrationTopSessionsPct: 32,
    recoveryStats: { avgRecoveryDays: 1.9, worstRecoveryDays: 5, currentRecoveryDay: 0, expectedRecoveryDays: 0 },
    curveSmoothness: 0.24, riskAdjExpectancy: 0.77,
    gradeInputs: { expectancyN: 0.91, smoothnessN: 0.88, profitFactorN: 0.88, concentrationN: 0.68, sampleSizeN: 0.92, momentumN: 0.80, score: 0.842 },
  },
}

const PNL_CURVE: Record<TimePeriod, { label: string; value: number; cumulative: number }[]> = {
  "7d": [
    { label: "Mon", value: 1120, cumulative: 1120 }, { label: "Tue", value: 2480, cumulative: 3600 },
    { label: "Wed", value: 0, cumulative: 3600 }, { label: "Thu", value: -680, cumulative: 2920 },
    { label: "Fri", value: 3200, cumulative: 6120 }, { label: "Sat", value: -1045, cumulative: 5075 },
    { label: "Sun", value: -720, cumulative: 4355 },
  ],
  "30d": [
    { label: "Wk 1", value: 4355, cumulative: 4355 }, { label: "Wk 2", value: 5120, cumulative: 9475 },
    { label: "Wk 3", value: 3840, cumulative: 13315 }, { label: "Wk 4", value: 4925, cumulative: 18240 },
  ],
  "90d": [
    { label: "Jan", value: 14200, cumulative: 14200 }, { label: "Feb", value: 18960, cumulative: 33160 },
    { label: "Mar", value: 19520, cumulative: 52680 },
  ],
  all: [
    { label: "Q3", value: 22400, cumulative: 22400 }, { label: "Q4", value: 37370, cumulative: 59770 },
    { label: "Q1", value: 34440, cumulative: 94210 }, { label: "Apr", value: 18240, cumulative: 112450 },
  ],
}

interface InstrumentPerf {
  symbol: string; trades: number; winRate: number; netPnl: string; netPnlValue: number
  avgRR: string; bestTrade: string; sessions: number
  sparkline: number[]; edgeScore: "strong" | "moderate" | "weak" | "negative"; focus: "core" | "trial"
}
const INSTRUMENT_PERF: InstrumentPerf[] = [
  { symbol: "XAU/USD", trades: 8, winRate: 75, netPnl: "+$4,890", netPnlValue: 4890, avgRR: "1:2.8", bestTrade: "+$1,950", sessions: 5, sparkline: [200, 680, 1200, 2400, 3100, 3800, 4200, 4890], edgeScore: "strong", focus: "core" },
  { symbol: "GBP/USD", trades: 4, winRate: 50, netPnl: "+$190", netPnlValue: 190, avgRR: "1:1.6", bestTrade: "+$460", sessions: 2, sparkline: [0, -120, 280, 190], edgeScore: "weak", focus: "trial" },
  { symbol: "EUR/USD", trades: 2, winRate: 100, netPnl: "+$680", netPnlValue: 680, avgRR: "1:1.9", bestTrade: "+$530", sessions: 2, sparkline: [150, 680], edgeScore: "moderate", focus: "trial" },
  { symbol: "EUR/GBP", trades: 1, winRate: 100, netPnl: "+$340", netPnlValue: 340, avgRR: "1:1.7", bestTrade: "+$340", sessions: 1, sparkline: [340], edgeScore: "moderate", focus: "trial" },
  { symbol: "USD/JPY", trades: 2, winRate: 50, netPnl: "-$280", netPnlValue: -280, avgRR: "1:1.2", bestTrade: "+$180", sessions: 1, sparkline: [180, -280], edgeScore: "negative", focus: "trial" },
  { symbol: "DXY", trades: 1, winRate: 0, netPnl: "-$465", netPnlValue: -465, avgRR: "--", bestTrade: "--", sessions: 1, sparkline: [-465], edgeScore: "negative", focus: "trial" },
]

interface SessionTypeBreakdown { type: string; count: number; winRate: number; avgPnl: string; color: string; avgDuration: string; phases: { obs: number; setup: number; exec: number; review: number } }
const SESSION_TYPES: SessionTypeBreakdown[] = [
  { type: "Live Trading", count: 3, winRate: 78, avgPnl: "+$1,400", color: "16,185,129", avgDuration: "1h 35m", phases: { obs: 20, setup: 15, exec: 45, review: 20 } },
  { type: "Scalping", count: 2, winRate: 60, avgPnl: "+$560", color: "56,189,248", avgDuration: "52m", phases: { obs: 10, setup: 10, exec: 65, review: 15 } },
  { type: "News Trading", count: 1, winRate: 50, avgPnl: "-$523", color: "245,158,11", avgDuration: "1h 08m", phases: { obs: 30, setup: 25, exec: 30, review: 15 } },
  { type: "Analysis", count: 1, winRate: 100, avgPnl: "$0", color: "139,92,246", avgDuration: "1h 45m", phases: { obs: 50, setup: 30, exec: 5, review: 15 } },
]

interface HeatmapDay { day: string; shortDay: string; sessions: number; trades: number; pnl: number; engagement: "none" | "low" | "medium" | "high" | "peak" }
const WEEKLY_HEATMAP: HeatmapDay[] = [
  { day: "Monday", shortDay: "Mon", sessions: 1, trades: 5, pnl: 1120, engagement: "high" },
  { day: "Tuesday", shortDay: "Tue", sessions: 1, trades: 3, pnl: 2480, engagement: "peak" },
  { day: "Wednesday", shortDay: "Wed", sessions: 1, trades: 0, pnl: 0, engagement: "low" },
  { day: "Thursday", shortDay: "Thu", sessions: 1, trades: 4, pnl: -680, engagement: "medium" },
  { day: "Friday", shortDay: "Fri", sessions: 1, trades: 2, pnl: 3200, engagement: "peak" },
  { day: "Saturday", shortDay: "Sat", sessions: 1, trades: 2, pnl: -1045, engagement: "medium" },
  { day: "Sunday", shortDay: "Sun", sessions: 1, trades: 2, pnl: -720, engagement: "low" },
]

interface EngagementPoint { session: string; viewers: number; active: number; messages: number; reactions: number; qualityEngaged: number; retention: number }
const ENGAGEMENT_DATA: EngagementPoint[] = [
  { session: "Mon", viewers: 612, active: 142, messages: 89, reactions: 234, qualityEngaged: 68, retention: 74 },
  { session: "Tue", viewers: 847, active: 198, messages: 156, reactions: 412, qualityEngaged: 112, retention: 82 },
  { session: "Wed", viewers: 423, active: 67, messages: 34, reactions: 78, qualityEngaged: 28, retention: 58 },
  { session: "Thu", viewers: 534, active: 112, messages: 67, reactions: 145, qualityEngaged: 52, retention: 68 },
  { session: "Fri", viewers: 756, active: 189, messages: 123, reactions: 367, qualityEngaged: 98, retention: 79 },
  { session: "Sat", viewers: 389, active: 78, messages: 45, reactions: 98, qualityEngaged: 34, retention: 62 },
  { session: "Sun", viewers: 562, active: 134, messages: 78, reactions: 189, qualityEngaged: 56, retention: 70 },
]

interface TopContributor { name: string; initials: string; gradient: string; sessions: number; messages: number; reactions: number; questionsAsked: number; engagementScore: number; trend: "up" | "down" | "stable"; impactScore: number; qualityFactors: { qaQuality: number; consistency: number; relevance: number } }
const TOP_CONTRIBUTORS: TopContributor[] = [
  { name: "TraderMike", initials: "TM", gradient: "from-cyan-500 to-blue-500", sessions: 7, messages: 89, reactions: 234, questionsAsked: 12, engagementScore: 98, trend: "up", impactScore: 94, qualityFactors: { qaQuality: 92, consistency: 96, relevance: 88 } },
  { name: "GoldHunter", initials: "GH", gradient: "from-amber-500 to-orange-500", sessions: 6, messages: 67, reactions: 189, questionsAsked: 8, engagementScore: 92, trend: "up", impactScore: 88, qualityFactors: { qaQuality: 85, consistency: 90, relevance: 92 } },
  { name: "SwingKing", initials: "SK", gradient: "from-purple-500 to-pink-500", sessions: 7, messages: 56, reactions: 156, questionsAsked: 15, engagementScore: 88, trend: "stable", impactScore: 82, qualityFactors: { qaQuality: 90, consistency: 85, relevance: 78 } },
  { name: "PipMaster", initials: "PM", gradient: "from-emerald-500 to-teal-500", sessions: 5, messages: 45, reactions: 134, questionsAsked: 6, engagementScore: 82, trend: "down", impactScore: 76, qualityFactors: { qaQuality: 72, consistency: 80, relevance: 84 } },
  { name: "NoviceNate", initials: "NN", gradient: "from-rose-500 to-red-500", sessions: 4, messages: 34, reactions: 98, questionsAsked: 22, engagementScore: 76, trend: "up", impactScore: 71, qualityFactors: { qaQuality: 88, consistency: 65, relevance: 70 } },
]

// AI Copilot insights (System H — enhanced with categories, urgency, action states)
type InsightCategory = "performance" | "risk" | "audience" | "instrument" | "behavioral" | "session"
type InsightUrgency = "urgent" | "advisory" | "informational" | "positive"
type InsightAction = "new" | "acknowledged" | "applied" | "dismissed"
interface AIInsight {
  type: string; title: string; detail: string; accent: string; icon: typeof Brain
  time: string; category: InsightCategory; urgency: InsightUrgency; actionState: InsightAction
  metric?: string; recommendation?: string
}
const AI_INSIGHTS: AIInsight[] = [
  { type: "pattern", title: "Consistent Edge Detected", detail: "Your win rate on XAU/USD during London session is 82% over 90 days. Consider increasing allocation by 15%.", accent: "16,185,129", icon: Brain, time: "2m ago", category: "instrument", urgency: "positive", actionState: "new", metric: "82% WR on XAU/USD", recommendation: "Increase XAU/USD allocation" },
  { type: "warning", title: "Revenge Trading Pattern", detail: "3 of your last 5 losses were followed by immediate re-entries within 8 minutes. Enforce a 15-min cooldown rule.", accent: "239,68,68", icon: Shield, time: "15m ago", category: "behavioral", urgency: "urgent", actionState: "new", metric: "3/5 revenge entries", recommendation: "Add cooldown timer" },
  { type: "insight", title: "Optimal Session Window", detail: "Best P&L performance occurs between 14:00-16:00 EST. 73% of profitable trades are in this window.", accent: "56,189,248", icon: Clock, time: "1h ago", category: "performance", urgency: "advisory", actionState: "acknowledged", metric: "73% win rate in window" },
  { type: "achievement", title: "Audience Correlation Found", detail: "Sessions with 500+ active viewers have 78% win rate vs 52% with fewer. High engagement improves your focus.", accent: "139,92,246", icon: Users, time: "2h ago", category: "audience", urgency: "informational", actionState: "new", metric: "78% WR with 500+ viewers" },
  { type: "risk", title: "Drawdown Alert", detail: "Current drawdown of $720 is approaching your 30-day average max drawdown. Consider reducing position size.", accent: "245,158,11", icon: AlertTriangle, time: "3h ago", category: "risk", urgency: "advisory", actionState: "new", metric: "$720 current DD", recommendation: "Reduce position size" },
  { type: "session", title: "Session Quality Trend", detail: "Your last 3 Analysis sessions scored A+ in quality. Your Live Trading sessions average B+. Consider longer observation phases.", accent: "16,185,129", icon: Flame, time: "5h ago", category: "session", urgency: "informational", actionState: "applied", metric: "Analysis > Live Trading quality" },
]

// Mentor quality decomposition (System I)
const MENTOR_QUALITY_FACTORS = [
  { label: "Execution", value: 88, color: "16,185,129", description: "Trade entry/exit precision" },
  { label: "Risk Mgmt", value: 92, color: "56,189,248", description: "SL/TP discipline, position sizing" },
  { label: "Engagement", value: 78, color: "139,92,246", description: "Audience interaction quality" },
  { label: "Consistency", value: 85, color: "245,158,11", description: "Day-to-day performance stability" },
  { label: "Selectivity", value: 80, color: "239,68,68", description: "Trade quality over quantity" },
  { label: "Teaching", value: 74, color: "56,189,248", description: "Educational value delivered" },
]

// ══════════════════════════════════════════════════════════════════
// SYSTEM K: DASHBOARD MODULE REGISTRY (configurable entities)
// ══════════════════════════════════════════════════════════════════

type ModuleId =
  | "kpi" | "substat" | "pnl" | "outcomes" | "instruments" | "session-types"
  | "heatmap" | "engagement" | "copilot" | "contributors" | "recent-sessions" | "mentor-perf"

type ModuleZone = "truth-rail" | "pinned-hero" | "intelligence-grid" | "deep-dive"
type ModuleSize = "full" | "large" | "medium" | "small"
type ModulePrivacy = "public" | "private" | "mentor-only"

interface ModuleConfig {
  id: ModuleId
  label: string
  description: string
  visible: boolean
  order: number
  zone: ModuleZone
  size: ModuleSize
  privacy: ModulePrivacy
  pinned: boolean
  emphasized: boolean
  settings?: Record<string, string | boolean | number>
}

const DEFAULT_MODULE_CONFIG: ModuleConfig[] = [
  { id: "kpi", label: "KPI Hero Metrics", description: "The four numbers you defend your room with", visible: true, order: 0, zone: "truth-rail", size: "full", privacy: "public", pinned: false, emphasized: true },
  { id: "substat", label: "Sub-stat Strip", description: "Profit factor, expectancy, R:R, DD, streak", visible: true, order: 1, zone: "truth-rail", size: "full", privacy: "public", pinned: false, emphasized: false },
  { id: "pnl", label: "P&L Performance Engine", description: "Six-mode chart, grade, drawdown anatomy, edge decomposition", visible: true, order: 2, zone: "truth-rail", size: "large", privacy: "public", pinned: true, emphasized: true, settings: { defaultMode: "equity", showAnatomy: true, showDecomposition: true } },
  { id: "outcomes", label: "Session Outcomes", description: "Win/loss/breakeven donut + quality", visible: true, order: 3, zone: "truth-rail", size: "medium", privacy: "public", pinned: false, emphasized: false },
  { id: "instruments", label: "Instrument Intelligence", description: "Per-pair edge, sparklines, focus", visible: true, order: 4, zone: "intelligence-grid", size: "large", privacy: "private", pinned: false, emphasized: false, settings: { show: "all" } },
  { id: "session-types", label: "Session Types", description: "Live/Scalp/News/Analysis breakdown", visible: true, order: 5, zone: "intelligence-grid", size: "medium", privacy: "private", pinned: false, emphasized: false },
  { id: "heatmap", label: "Weekly Activity", description: "Day-of-week heatmap", visible: true, order: 6, zone: "intelligence-grid", size: "medium", privacy: "public", pinned: false, emphasized: false },
  { id: "engagement", label: "Audience Engagement", description: "Viewer + quality signal per session", visible: true, order: 7, zone: "intelligence-grid", size: "medium", privacy: "public", pinned: false, emphasized: false },
  { id: "copilot", label: "AI Copilot", description: "Insights by category, urgency, action state", visible: true, order: 8, zone: "intelligence-grid", size: "full", privacy: "mentor-only", pinned: false, emphasized: false, settings: { showDismissed: false } },
  { id: "contributors", label: "Top Contributors", description: "Impact-ranked community voices", visible: true, order: 9, zone: "intelligence-grid", size: "medium", privacy: "private", pinned: false, emphasized: false },
  { id: "recent-sessions", label: "Recent Sessions", description: "Bridge to live-call history", visible: true, order: 10, zone: "intelligence-grid", size: "medium", privacy: "public", pinned: false, emphasized: false },
  { id: "mentor-perf", label: "Mentor Performance Radar", description: "Six-axis quality, grade, peer position", visible: true, order: 11, zone: "deep-dive", size: "full", privacy: "public", pinned: false, emphasized: false },
]

interface DashboardPreset {
  id: string
  label: string
  description: string
  icon: typeof Brain
  color: string
  curated: boolean
  config: Partial<ModuleConfig>[]
}

const CURATED_PRESETS: DashboardPreset[] = [
  { id: "balanced", label: "Balanced", description: "All modules visible, default order", icon: Layers, color: "139,92,246", curated: true, config: DEFAULT_MODULE_CONFIG.map(m => ({ id: m.id, visible: true, zone: m.zone, pinned: m.pinned })) },
  { id: "performance", label: "Performance", description: "P&L, Instruments, Grade pinned", icon: TrendingUp, color: "16,185,129", curated: true, config: [
    { id: "pnl", pinned: true, emphasized: true, size: "full" },
    { id: "instruments", zone: "truth-rail", size: "large" },
    { id: "mentor-perf", zone: "intelligence-grid" },
    { id: "engagement", zone: "deep-dive" },
    { id: "contributors", zone: "deep-dive" },
    { id: "heatmap", zone: "deep-dive" },
  ]},
  { id: "audience", label: "Audience", description: "Engagement, Contributors pinned", icon: Users, color: "56,189,248", curated: true, config: [
    { id: "engagement", zone: "truth-rail", pinned: true, size: "full" },
    { id: "contributors", zone: "truth-rail", size: "large" },
    { id: "heatmap", zone: "intelligence-grid" },
    { id: "instruments", zone: "deep-dive" },
    { id: "session-types", zone: "deep-dive" },
  ]},
  { id: "compact", label: "Compact", description: "Truth rail only, rest collapsed", icon: Maximize2, color: "245,158,11", curated: true, config: [
    { id: "instruments", zone: "deep-dive" },
    { id: "session-types", zone: "deep-dive" },
    { id: "heatmap", zone: "deep-dive" },
    { id: "engagement", zone: "deep-dive" },
    { id: "contributors", zone: "deep-dive" },
    { id: "recent-sessions", zone: "deep-dive" },
    { id: "copilot", zone: "deep-dive" },
    { id: "mentor-perf", zone: "deep-dive" },
  ]},
  { id: "showcase", label: "Public Showcase", description: "External-viewer optimized, public modules only", icon: Globe, color: "56,189,248", curated: true, config: DEFAULT_MODULE_CONFIG.map(m => ({ id: m.id, visible: m.privacy === "public" })) },
]

// Dashboard config hook — localStorage-backed persistence
function useDashboardConfig() {
  const [config, setConfig] = useState<ModuleConfig[]>(DEFAULT_MODULE_CONFIG)
  const [savedPresets, setSavedPresets] = useState<DashboardPreset[]>([])
  const [activePresetId, setActivePresetId] = useState<string>("balanced")

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("v0-dashboard-config-v1")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.config) setConfig(parsed.config)
        if (parsed.savedPresets) setSavedPresets(parsed.savedPresets)
        if (parsed.activePresetId) setActivePresetId(parsed.activePresetId)
      }
    } catch {
      // ignore corrupt storage
    }
  }, [])

  const persist = useCallback((next: Partial<{ config: ModuleConfig[]; savedPresets: DashboardPreset[]; activePresetId: string }>) => {
    try {
      const raw = localStorage.getItem("v0-dashboard-config-v1")
      const prev = raw ? JSON.parse(raw) : {}
      const merged = { ...prev, ...next }
      localStorage.setItem("v0-dashboard-config-v1", JSON.stringify(merged))
    } catch {
      // ignore quota / unavailable
    }
  }, [])

  const updateModule = useCallback((id: ModuleId, patch: Partial<ModuleConfig>) => {
    setConfig(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...patch } : m)
      persist({ config: next })
      return next
    })
  }, [persist])

  const reorderModule = useCallback((id: ModuleId, direction: "up" | "down") => {
    setConfig(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(m => m.id === id)
      if (idx < 0) return prev
      const swapIdx = direction === "up" ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev
      // Only swap if in same zone
      if (sorted[idx].zone !== sorted[swapIdx].zone) return prev
      const a = sorted[idx], b = sorted[swapIdx]
      const next = prev.map(m => {
        if (m.id === a.id) return { ...m, order: b.order }
        if (m.id === b.id) return { ...m, order: a.order }
        return m
      })
      persist({ config: next })
      return next
    })
  }, [persist])

  const applyPreset = useCallback((preset: DashboardPreset) => {
    setConfig(prev => {
      const next = prev.map(m => {
        const patch = preset.config.find(p => p.id === m.id)
        const defaults = DEFAULT_MODULE_CONFIG.find(d => d.id === m.id)!
        // Reset to defaults then apply preset overrides
        return {
          ...defaults,
          ...(patch ? patch : {}),
          visible: patch?.visible ?? (preset.id === "showcase" ? defaults.privacy === "public" : defaults.visible),
        }
      })
      persist({ config: next, activePresetId: preset.id })
      return next
    })
    setActivePresetId(preset.id)
  }, [persist])

  const savePreset = useCallback((label: string) => {
    const newPreset: DashboardPreset = {
      id: `user-${Date.now()}`,
      label,
      description: "User-saved layout",
      icon: Bookmark,
      color: "139,92,246",
      curated: false,
      config: config.map(m => ({ id: m.id, visible: m.visible, order: m.order, zone: m.zone, size: m.size, privacy: m.privacy, pinned: m.pinned, emphasized: m.emphasized, settings: m.settings })),
    }
    setSavedPresets(prev => {
      const next = [...prev, newPreset]
      persist({ savedPresets: next })
      return next
    })
  }, [config, persist])

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_MODULE_CONFIG)
    setActivePresetId("balanced")
    persist({ config: DEFAULT_MODULE_CONFIG, activePresetId: "balanced" })
  }, [persist])

  return { config, savedPresets, activePresetId, updateModule, reorderModule, applyPreset, savePreset, resetToDefault }
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM L: DRILLDOWN TARGET TYPES
// ══════════════════════════════════════════════════════════════════

type DrilldownTarget =
  | { type: "kpi"; metric: "netPnl" | "winRate" | "sessions" | "peakViewers" }
  | { type: "curve-point"; index: number; mode: string }
  | { type: "instrument"; symbol: string }
  | { type: "session-type"; typeName: string }
  | { type: "contributor"; name: string }
  | { type: "recent-session"; name: string }
  | { type: "grade"; metric: string }

// ══════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ══════════════════════════════════════════════════════════════════

function ParticleField({ accent = "139,92,246" }: { accent?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext("2d", { alpha: true }); if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio, 2)
    const resize = () => { c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize(); window.addEventListener("resize", resize)
    const [r, g, b] = accent.split(",").map(Number)
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * c.offsetWidth, y: Math.random() * c.offsetHeight,
      vx: (Math.random() - 0.5) * 0.06, vy: (Math.random() - 0.5) * 0.05,
      r: 0.5 + Math.random() * 1.5, a: 0.02 + Math.random() * 0.05, p: Math.random() * Math.PI * 2,
    }))
    let alive = true
    const draw = () => {
      if (!alive) return
      const w = c.offsetWidth, h = c.offsetHeight; ctx.clearRect(0, 0, w, h)
      for (const p of pts) { p.x += p.vx; p.y += p.vy; p.p += 0.005; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0 }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
        if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / 120) * 0.035})`; ctx.lineWidth = 0.3; ctx.stroke() }
      }
      for (const p of pts) {
        const br = 1 + Math.sin(p.p) * 0.3
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * br, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${p.a * br})`; ctx.fill()
      }
      requestAnimationFrame(draw)
    }
    draw(); return () => { alive = false; window.removeEventListener("resize", resize) }
  }, [accent])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
}

function AnimNum({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const mv = useMotionValue(0)
  const display = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${suffix}`)
  const [text, setText] = useState(`${prefix}0${suffix}`)
  useEffect(() => {
    const ctrl = animate(mv, value, { duration: 1.4, ease: EASE_ARR })
    const unsub = display.on("change", setText)
    return () => { ctrl.stop(); unsub() }
  }, [value, mv, display])
  return <span>{text}</span>
}

function GlassCard({ children, className = "", delay = 0, accent = "139,92,246", glowIntensity = 0.06, onClick, priority = "normal" }: {
  children: React.ReactNode; className?: string; delay?: number; accent?: string; glowIntensity?: number; onClick?: () => void; priority?: "hero" | "normal" | "supplementary"
}) {
  const [hovered, setHovered] = useState(false)
  const borderWidth = priority === "hero" ? 1.5 : 1
  return (
    <motion.div
      initial={{ opacity: 0, y: priority === "hero" ? 20 : 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE_ARR }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: `linear-gradient(145deg, rgba(${accent},${hovered ? 0.07 : 0.035}) 0%, rgba(10,12,18,${hovered ? 0.93 : 0.9}) 35%, rgba(8,10,16,0.96) 100%)`,
        border: `${borderWidth}px solid rgba(${accent},${hovered ? 0.22 : 0.1})`,
        boxShadow: hovered
          ? `0 0 28px rgba(${accent},${glowIntensity * 1.4}), 0 8px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 0 12px rgba(${accent},${glowIntensity * 0.4}), 0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)`,
        transition: "all 0.35s cubic-bezier(0.22,0.68,0.36,1)",
      }}
    >
      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, rgba(${accent},${hovered ? 0.1 : 0.05}), transparent 70%)`, transition: "all 0.35s ease" }} />
      {children}
    </motion.div>
  )
}

// Confidence bar (System B)
function ConfidenceBar({ sessions }: { sessions: number }) {
  const level = sessions >= 50 ? "high" : sessions >= 15 ? "medium" : "low"
  const colors = { low: "239,68,68", medium: "245,158,11", high: "16,185,129" }
  const labels = { low: "Low", medium: "Med", high: "High" }
  const widths = { low: 33, medium: 66, high: 100 }
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <div className="flex-1 h-[2px] rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: `rgba(${colors[level]},0.5)` }}
          initial={{ width: 0 }} animate={{ width: `${widths[level]}%` }} transition={{ delay: 0.8, duration: 0.6 }} />
      </div>
      <span className="text-[5px] font-mono uppercase tracking-wider" style={{ color: `rgba(${colors[level]},0.6)` }}>
        {labels[level]} ({sessions})
      </span>
    </div>
  )
}

// Mini sparkline SVG (System E)
function MiniSparkline({ data, color, width = 48, height = 16 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return <div style={{ width, height }} />
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 2) - 1}`).join(" ")
  const isPositive = data[data.length - 1] >= data[0]
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={`rgba(${color},0.6)`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 2) - 1}
        r="1.5" fill={`rgba(${color},0.9)`} />
    </svg>
  )
}

// Edge score badge (System E)
function EdgeBadge({ score }: { score: InstrumentPerf["edgeScore"] }) {
  const cfg = {
    strong: { label: "Strong Edge", color: "16,185,129", bg: "rgba(16,185,129,0.1)" },
    moderate: { label: "Moderate", color: "56,189,248", bg: "rgba(56,189,248,0.08)" },
    weak: { label: "Weak", color: "245,158,11", bg: "rgba(245,158,11,0.08)" },
    negative: { label: "Negative", color: "239,68,68", bg: "rgba(239,68,68,0.08)" },
  }[score]
  return (
    <span className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: `rgba(${cfg.color},0.8)`, border: `1px solid rgba(${cfg.color},0.15)` }}>
      {cfg.label}
    </span>
  )
}

// Performance momentum badge (System C)
function MomentumBadge({ momentum }: { momentum: DashboardMetrics["performanceMomentum"] }) {
  const cfg = {
    improving: { label: "Improving", color: "16,185,129", icon: TrendingUp },
    stable: { label: "Stable", color: "56,189,248", icon: Minus },
    declining: { label: "Declining", color: "239,68,68", icon: TrendingDown },
  }[momentum]
  const Icon = cfg.icon
  return (
    <motion.div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: `rgba(${cfg.color},0.08)`, border: `1px solid rgba(${cfg.color},0.15)` }}
      animate={{ borderColor: [`rgba(${cfg.color},0.15)`, `rgba(${cfg.color},0.3)`, `rgba(${cfg.color},0.15)`] }}
      transition={{ duration: 3, repeat: Infinity }}>
      <Icon className="w-2.5 h-2.5" style={{ color: `rgba(${cfg.color},0.8)` }} />
      <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: `rgba(${cfg.color},0.75)` }}>{cfg.label}</span>
    </motion.div>
  )
}

// Urgency dot for AI insights (System H)
function UrgencyDot({ urgency }: { urgency: InsightUrgency }) {
  const colors = { urgent: "239,68,68", advisory: "245,158,11", informational: "56,189,248", positive: "16,185,129" }
  return (
    <motion.div className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: `rgba(${colors[urgency]},0.9)`, boxShadow: `0 0 6px rgba(${colors[urgency]},0.4)` }}
      animate={urgency === "urgent" ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
      transition={urgency === "urgent" ? { duration: 1.2, repeat: Infinity } : {}} />
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM A: DASHBOARD IDENTITY + CONTROL LAYER
// ══════════════════════════════════════════════════════════════════

function DashboardHeader({ period, setPeriod, comparisonOn, setComparisonOn, viewMode, setViewMode, setCustomizeOpen, m }: {
  period: TimePeriod; setPeriod: (p: TimePeriod) => void; comparisonOn: boolean; setComparisonOn: (v: boolean) => void
  viewMode: "mentor" | "public"; setViewMode: (v: "mentor" | "public") => void; setCustomizeOpen: (v: boolean) => void; m: DashboardMetrics
}) {
  const [lastUpdated] = useState(() => new Date())
  const minutesAgo = useMemo(() => Math.floor((Date.now() - lastUpdated.getTime()) / 60000), [lastUpdated])

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="relative z-10 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.25)" }}>
      {/* Status strip */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.5), rgba(56,189,248,0.3) 40%, rgba(139,92,246,0.3) 70%, rgba(245,158,11,0.2))" }} />

      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Title + freshness */}
        <div className="flex items-center gap-3">
          <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(59,130,246,0.12))", border: "1px solid rgba(139,92,246,0.22)" }}>
            <Hexagon className="w-3.5 h-3.5 text-violet-400/85" />
            <motion.div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: "rgba(16,185,129,0.9)", border: "1.5px solid rgba(8,10,18,1)" }}
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>
          <div>
            <h2 className="text-[12px] font-black text-white/90 tracking-tight">Intelligence Dashboard</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[6px] text-slate-400/45 uppercase tracking-[0.15em]">Performance Analytics</span>
              <div className="w-px h-2.5 bg-white/[0.06]" />
              <div className="flex items-center gap-0.5">
                <motion.div className="w-1 h-1 rounded-full bg-emerald-400/70"
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-[5px] text-emerald-400/50">Updated {minutesAgo < 1 ? "just now" : `${minutesAgo}m ago`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Comparison toggle */}
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => setComparisonOn(!comparisonOn)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-bold uppercase tracking-wider transition-all"
            style={{
              background: comparisonOn ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${comparisonOn ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.06)"}`,
              color: comparisonOn ? "rgba(167,139,250,0.9)" : "rgba(148,163,184,0.45)",
            }}>
            <ArrowRightLeft className="w-2.5 h-2.5" /> Compare
          </motion.button>

          {/* View mode */}
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => setViewMode(viewMode === "mentor" ? "public" : "mentor")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-bold uppercase tracking-wider transition-all"
            style={{
              background: viewMode === "public" ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${viewMode === "public" ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.06)"}`,
              color: viewMode === "public" ? "rgba(125,211,252,0.85)" : "rgba(148,163,184,0.45)",
            }}>
            {viewMode === "mentor" ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
            {viewMode === "mentor" ? "Mentor" : "Public"}
          </motion.button>

          {/* Customize */}
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => setCustomizeOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-bold uppercase tracking-wider transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(148,163,184,0.45)" }}>
            <SlidersHorizontal className="w-2.5 h-2.5" /> Customize
          </motion.button>

          {/* Period selector */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {PERIODS.map(p => (
              <motion.button key={p} onClick={() => setPeriod(p)}
                className="relative px-2.5 py-1 rounded-md text-[7px] font-bold uppercase tracking-wider transition-colors duration-200"
                style={{ color: period === p ? "rgba(139,92,246,0.95)" : "rgba(148,163,184,0.4)" }}>
                {period === p && (
                  <motion.div layoutId="period-pill" className="absolute inset-0 rounded-md"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
                    transition={{ duration: 0.25, ease: EASE_ARR }} />
                )}
                <span className="relative z-10">{p.toUpperCase()}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM B: KPI TRUTH LAYER — Hero Metrics with context
// ══════════════════════════════════════════════════════════════════

function HeroMetric({ label, value, trend, trendValue, icon: Icon, accent, index, suffix = "", tooltip, sessions }: {
  label: string; value: string; trend: "up" | "down" | "neutral"; trendValue: string
  icon: React.ComponentType<{ className?: string }>; accent: string; index: number; suffix?: string
  tooltip?: string; sessions?: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <GlassCard delay={0.06 + index * 0.05} accent={accent} glowIntensity={0.08} priority="hero">
      <div className="relative px-3.5 py-3 z-10" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="flex items-start justify-between mb-2">
          <div className="relative">
            <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `rgba(${accent},0.1)`, border: `1px solid rgba(${accent},0.18)` }}
              animate={hovered ? { rotate: [0, 5, -5, 0] } : {}} transition={{ duration: 0.5 }}>
              <Icon className="w-3.5 h-3.5" style={{ color: `rgba(${accent},0.85)` }} />
            </motion.div>
            <motion.svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none"
              viewBox="0 0 44 44" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
              <circle cx="22" cy="22" r="20" fill="none" stroke={`rgba(${accent},${hovered ? 0.12 : 0.05})`} strokeWidth="0.4" strokeDasharray="3 5" />
              <circle cx="22" cy="2" r="1.2" fill={`rgba(${accent},${hovered ? 0.7 : 0.25})`} />
            </motion.svg>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
            style={{
              background: trend === "up" ? "rgba(16,185,129,0.07)" : trend === "down" ? "rgba(239,68,68,0.07)" : "rgba(148,163,184,0.05)",
              border: `1px solid ${trend === "up" ? "rgba(16,185,129,0.12)" : trend === "down" ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)"}`,
            }}>
            {trend === "up" ? <ArrowUpRight className="w-2 h-2 text-emerald-400/75" /> : trend === "down" ? <ArrowDownRight className="w-2 h-2 text-red-400/75" /> : <Minus className="w-2 h-2 text-slate-400/55" />}
            <span className="text-[6px] font-mono font-bold" style={{ color: trend === "up" ? "rgba(52,211,153,0.8)" : trend === "down" ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.55)" }}>{trendValue}</span>
          </div>
        </div>
        <div className="text-[18px] font-black text-white/95 leading-none tracking-tight">{value}{suffix}</div>
        <div className="text-[7px] font-bold uppercase tracking-[0.14em] mt-1" style={{ color: `rgba(${accent},0.55)` }}>{label}</div>
        {/* Confidence bar */}
        {sessions !== undefined && <ConfidenceBar sessions={sessions} />}
        {/* Tooltip on hover */}
        <AnimatePresence>
          {hovered && tooltip && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute left-2 right-2 -bottom-1 translate-y-full z-50 px-2.5 py-1.5 rounded-lg"
              style={{ background: "rgba(8,10,18,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
              <p className="text-[6px] text-slate-300/70 leading-relaxed">{tooltip}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM C: P&L + PERFORMANCE SEMANTICS — DEEP EVOLUTION
// ══════════════════════════════════════════════════════════════════

type ChartMode = "equity" | "daily" | "drawdown" | "rolling-wr" | "r-multiple" | "concentration"
type PnlView = "net" | "gross"
type PnlScope = "realized" | "live"

// Grade tier from normalized score
function gradeTier(score: number): { letter: string; color: string } {
  if (score >= 0.80) return { letter: "A+", color: "16,185,129" }
  if (score >= 0.70) return { letter: "A",  color: "16,185,129" }
  if (score >= 0.60) return { letter: "B+", color: "56,189,248" }
  if (score >= 0.50) return { letter: "B",  color: "245,158,11" }
  return { letter: "C", color: "239,68,68" }
}

// Drawdown Anatomy sub-module (System C v2)
function DrawdownAnatomyStrip({ m }: { m: DashboardMetrics }) {
  const inStress = m.currentDrawdown > 0
  const ddPctOfMax = m.maxDrawdown > 0 ? (m.currentDrawdown / m.maxDrawdown) * 100 : 0
  return (
    <div className="grid grid-cols-5 gap-2 px-3 py-2 rounded-xl mt-2"
      style={{ background: inStress ? "rgba(239,68,68,0.035)" : "rgba(16,185,129,0.025)", border: `1px solid ${inStress ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.08)"}` }}>
      <div>
        <div className="text-[5px] uppercase tracking-wider text-slate-500/50">Current DD</div>
        <div className="text-[9px] font-mono font-bold" style={{ color: inStress ? "rgba(248,113,113,0.9)" : "rgba(148,163,184,0.5)" }}>
          {inStress ? `-$${m.currentDrawdown.toLocaleString()}` : "Flat"}
        </div>
      </div>
      <div>
        <div className="text-[5px] uppercase tracking-wider text-slate-500/50">Max DD</div>
        <div className="text-[9px] font-mono font-bold text-red-400/80">-${m.maxDrawdown.toLocaleString()} <span className="text-[6px] text-red-400/50">({m.maxDrawdownPct.toFixed(1)}%)</span></div>
      </div>
      <div>
        <div className="text-[5px] uppercase tracking-wider text-slate-500/50">DD Duration</div>
        <div className="text-[9px] font-mono font-bold text-slate-300/75">{m.drawdownDuration}d</div>
      </div>
      <div>
        <div className="text-[5px] uppercase tracking-wider text-slate-500/50">Avg Recovery</div>
        <div className="text-[9px] font-mono font-bold text-sky-400/80">{m.recoveryStats.avgRecoveryDays.toFixed(1)}d</div>
      </div>
      <div>
        <div className="text-[5px] uppercase tracking-wider text-slate-500/50">Stress Level</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex-1 h-[3px] rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `rgba(${inStress ? "239,68,68" : "16,185,129"},0.6)` }}
              initial={{ width: 0 }} animate={{ width: `${Math.min(ddPctOfMax, 100)}%` }} transition={{ duration: 0.8, delay: 0.4 }} />
          </div>
          <span className="text-[5px] font-mono" style={{ color: inStress ? "rgba(248,113,113,0.75)" : "rgba(52,211,153,0.65)" }}>
            {inStress ? `${ddPctOfMax.toFixed(0)}%` : "OK"}
          </span>
        </div>
      </div>
    </div>
  )
}

// Edge Decomposition strip (System C v2)
function EdgeDecompositionStrip({ m, onSliceClick }: { m: DashboardMetrics; onSliceClick?: (symbolOrType: string, kind: "instrument" | "session-type") => void }) {
  const [view, setView] = useState<"instrument" | "session-type">("instrument")
  const data = view === "instrument" ? m.concentrationByInstrument : m.concentrationBySessionType
  const total = data.reduce((sum, d) => sum + Math.abs(d.pnl), 0) || 1

  return (
    <div className="mt-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <PieChart className="w-2.5 h-2.5 text-slate-400/50" />
          <span className="text-[6px] uppercase tracking-wider text-slate-400/55 font-bold">Edge Decomposition</span>
          {m.concentrationTopSessionsPct >= 60 && (
            <div className="flex items-center gap-0.5 px-1 py-px rounded" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)" }}>
              <AlertTriangle className="w-2 h-2 text-amber-400/70" />
              <span className="text-[5px] font-bold text-amber-400/80">Concentrated: {m.concentrationTopSessionsPct}% from top 3 sessions</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5 p-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.03)" }}>
          {(["instrument", "session-type"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: view === v ? "rgba(139,92,246,0.1)" : "transparent",
                color: view === v ? "rgba(167,139,250,0.85)" : "rgba(148,163,184,0.35)",
              }}>
              {v === "instrument" ? "By Instrument" : "By Session"}
            </button>
          ))}
        </div>
      </div>
      {/* Horizontal stacked bar */}
      <div className="flex h-[5px] rounded-full overflow-hidden gap-px">
        {data.map((d, i) => {
          const pct = (Math.abs(d.pnl) / total) * 100
          const key = view === "instrument" ? (d as typeof m.concentrationByInstrument[number]).symbol : (d as typeof m.concentrationBySessionType[number]).type
          return (
            <motion.button key={key} type="button"
              onClick={() => onSliceClick?.(key, view)}
              className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: `rgba(${d.color},0.6)`, width: `${pct}%` }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: EASE_ARR }}
              title={`${key}: $${d.pnl.toLocaleString()} (${pct.toFixed(1)}%)`}
            />
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5">
        {data.map(d => {
          const pct = (Math.abs(d.pnl) / total) * 100
          const key = view === "instrument" ? (d as typeof m.concentrationByInstrument[number]).symbol : (d as typeof m.concentrationBySessionType[number]).type
          return (
            <button key={key} type="button" onClick={() => onSliceClick?.(key, view)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${d.color},0.7)` }} />
              <span className="text-[5px] font-mono text-slate-400/65">{key}</span>
              <span className="text-[5px] font-mono font-bold" style={{ color: `rgba(${d.color},0.85)` }}>{pct.toFixed(0)}%</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Grade breakdown popover (System C v2)
function GradeBreakdownPopover({ m, open, onClose }: { m: DashboardMetrics; open: boolean; onClose: () => void }) {
  const tier = gradeTier(m.gradeInputs.score)
  const rows = [
    { label: "Expectancy", weight: 0.30, value: m.gradeInputs.expectancyN },
    { label: "Curve Smoothness", weight: 0.20, value: m.gradeInputs.smoothnessN },
    { label: "Profit Factor", weight: 0.15, value: m.gradeInputs.profitFactorN },
    { label: "Concentration (inv.)", weight: 0.15, value: m.gradeInputs.concentrationN },
    { label: "Sample Size", weight: 0.10, value: m.gradeInputs.sampleSizeN },
    { label: "Momentum", weight: 0.10, value: m.gradeInputs.momentumN },
  ]
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.22, ease: EASE_ARR }}
          className="absolute right-2 top-full mt-1.5 z-50 w-[280px] px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(8,10,18,0.98)", border: `1px solid rgba(${tier.color},0.25)`, boxShadow: `0 12px 32px rgba(0,0,0,0.55), 0 0 24px rgba(${tier.color},0.12)` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Award className="w-3 h-3" style={{ color: `rgba(${tier.color},0.8)` }} />
              <span className="text-[8px] font-bold text-white/85 uppercase tracking-wider">Grade Breakdown</span>
            </div>
            <button onClick={onClose}><X className="w-2.5 h-2.5 text-slate-500/55" /></button>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[22px] font-black leading-none" style={{ color: `rgba(${tier.color},0.95)` }}>{tier.letter}</span>
            <span className="text-[6px] font-mono text-slate-500/50">score: {(m.gradeInputs.score * 100).toFixed(1)}</span>
          </div>
          <div className="space-y-1.5">
            {rows.map(r => {
              const contribution = r.weight * r.value
              return (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[6px] text-slate-400/70">{r.label}</span>
                    <span className="text-[6px] font-mono text-slate-500/60">
                      {r.weight.toFixed(2)} × {r.value.toFixed(2)} = <span className="text-white/80 font-bold">{contribution.toFixed(3)}</span>
                    </span>
                  </div>
                  <div className="h-[3px] rounded-full bg-white/[0.03] overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ background: `rgba(${tier.color},0.6)` }}
                      initial={{ width: 0 }} animate={{ width: `${contribution * 100 / 0.3}%` }} transition={{ duration: 0.5, delay: 0.1 }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-[5px] text-slate-500/55 mt-2 leading-relaxed">
            Grade is transparent. Each input is normalized 0&mdash;1. Weighted sum produces the final score; tiers: A+ &ge;.80, A &ge;.70, B+ &ge;.60, B &ge;.50, C &lt;.50.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PnLPerformanceModule({ data, period, m, comparisonOn, prevData, onDrilldown }: {
  data: typeof PNL_CURVE["7d"]; period: TimePeriod; m: DashboardMetrics; comparisonOn: boolean
  prevData?: typeof PNL_CURVE["7d"]
  onDrilldown?: (target: DrilldownTarget) => void
}) {
  const [chartMode, setChartMode] = useState<ChartMode>("equity")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [pnlView, setPnlView] = useState<PnlView>("net")
  const [pnlScope, setPnlScope] = useState<PnlScope>("realized")
  const [gradeOpen, setGradeOpen] = useState(false)

  const w = 440, h = 145, px = 36, py = 16

  // Derive adjusted curve based on Gross/Net + Realized/Live
  const adjustedData = useMemo(() => {
    const netFactor = pnlView === "gross" ? (m.grossPnl / Math.max(m.netPnlValue, 1)) : 1
    const live = pnlScope === "live" ? m.livePositionsPnl : 0
    return data.map((d, i) => ({
      ...d,
      value: d.value * netFactor,
      cumulative: d.cumulative * netFactor + (i === data.length - 1 ? live : 0),
    }))
  }, [data, pnlView, pnlScope, m.grossPnl, m.netPnlValue, m.livePositionsPnl])

  // Calculate drawdown data
  const drawdownData = useMemo(() => {
    let peak = 0
    return adjustedData.map(d => {
      if (d.cumulative > peak) peak = d.cumulative
      return { ...d, drawdown: peak > 0 ? -(peak - d.cumulative) : 0 }
    })
  }, [adjustedData])

  // Rolling WR series
  const rollingWrData = useMemo(() => m.rollingWR, [m.rollingWR])

  // R-Multiple histogram bins (from -2 to +3, 0.5 wide)
  const rMultipleBins = useMemo(() => {
    const bins: { label: string; count: number; color: string }[] = [
      { label: "-2R", count: 0, color: "239,68,68" },
      { label: "-1R", count: 0, color: "239,68,68" },
      { label: "0R", count: 0, color: "148,163,184" },
      { label: "+1R", count: 0, color: "16,185,129" },
      { label: "+2R", count: 0, color: "16,185,129" },
      { label: "+3R", count: 0, color: "16,185,129" },
    ]
    m.rMultiples.forEach(r => {
      if (r <= -1.5) bins[0].count++
      else if (r <= -0.5) bins[1].count++
      else if (r < 0.5) bins[2].count++
      else if (r < 1.5) bins[3].count++
      else if (r < 2.5) bins[4].count++
      else bins[5].count++
    })
    return bins
  }, [m.rMultiples])

  // Chart rendering based on mode
  const chartData = useMemo(() => {
    if (chartMode === "equity") return adjustedData.map(d => d.cumulative)
    if (chartMode === "daily") return adjustedData.map(d => d.value)
    if (chartMode === "drawdown") return drawdownData.map(d => d.drawdown)
    if (chartMode === "rolling-wr") return rollingWrData
    if (chartMode === "r-multiple") return rMultipleBins.map(b => b.count)
    // concentration: use instrument magnitudes
    return m.concentrationByInstrument.map(c => c.pnl)
  }, [chartMode, adjustedData, drawdownData, rollingWrData, rMultipleBins, m.concentrationByInstrument])

  // Previous-period ghost curve when comparison is on
  const prevPoints = useMemo(() => {
    if (!comparisonOn || !prevData || chartMode !== "equity") return null
    const prevCum = prevData.map(d => d.cumulative)
    const factor = adjustedData.length / Math.max(prevCum.length, 1)
    return prevCum.map((v, i) => ({ v, x: px + (i * factor / Math.max(adjustedData.length - 1, 1)) * (w - px * 2) }))
  }, [comparisonOn, prevData, chartMode, adjustedData.length])

  const maxVal = Math.max(...chartData, 1)
  const minVal = Math.min(...chartData, 0)
  const range = maxVal - minVal || 1

  const points = chartData.map((v, i) => ({
    x: px + (i / Math.max(chartData.length - 1, 1)) * (w - px * 2),
    y: py + (1 - (v - minVal) / range) * (h - py * 2),
  }))

  const chartColor = chartMode === "drawdown" ? "239,68,68"
    : chartMode === "rolling-wr" ? "56,189,248"
    : chartMode === "r-multiple" ? "139,92,246"
    : chartMode === "concentration" ? "245,158,11"
    : "16,185,129"

  const chartModeLabel: Record<ChartMode, string> = {
    "equity": "Equity",
    "daily": "Daily",
    "drawdown": "Drawdown",
    "rolling-wr": "Rolling WR",
    "r-multiple": "R-Multiple",
    "concentration": "Concentration",
  }

  const tier = gradeTier(m.gradeInputs.score)

  const pathD = points.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`
    const prev = points[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`
  }).join(" ")

  const areaD = `${pathD} L${points[points.length - 1].x},${h - py} L${points[0].x},${h - py} Z`
  const zeroY = py + (1 - (0 - minVal) / range) * (h - py * 2)

  return (
    <GlassCard delay={0.25} accent={chartColor} glowIntensity={0.05} priority="hero">
      <div className="px-4 pt-3 pb-2 relative">
        {/* Header with chart mode toggle + gross/net + realized/live */}
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <LineChart className="w-3 h-3" style={{ color: `rgba(${chartColor},0.65)` }} />
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">P&amp;L Engine</span>
            <MomentumBadge momentum={m.performanceMomentum} />
          </div>
          <div className="flex items-center gap-1.5">
            {/* Gross/Net */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {(["net", "gross"] as PnlView[]).map(v => (
                <button key={v} onClick={() => setPnlView(v)}
                  className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: pnlView === v ? "rgba(139,92,246,0.1)" : "transparent",
                    color: pnlView === v ? "rgba(167,139,250,0.85)" : "rgba(148,163,184,0.35)",
                  }}>{v}</button>
              ))}
            </div>
            {/* Realized/Live */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {(["realized", "live"] as PnlScope[]).map(v => (
                <button key={v} onClick={() => setPnlScope(v)}
                  className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: pnlScope === v ? "rgba(16,185,129,0.1)" : "transparent",
                    color: pnlScope === v ? "rgba(52,211,153,0.85)" : "rgba(148,163,184,0.35)",
                  }}>{v === "live" && m.livePositionsPnl > 0 ? `Live +$${m.livePositionsPnl}` : v}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 6-mode chart selector */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-md mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}>
          {(["equity", "daily", "drawdown", "rolling-wr", "r-multiple", "concentration"] as ChartMode[]).map(mode => {
            const modeColor = mode === "drawdown" ? "239,68,68"
              : mode === "rolling-wr" ? "56,189,248"
              : mode === "r-multiple" ? "139,92,246"
              : mode === "concentration" ? "245,158,11"
              : "16,185,129"
            return (
              <button key={mode} onClick={() => setChartMode(mode)}
                className="flex-1 px-1.5 py-1 rounded text-[6px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: chartMode === mode ? `rgba(${modeColor},0.1)` : "transparent",
                  color: chartMode === mode ? `rgba(${modeColor},0.9)` : "rgba(148,163,184,0.35)",
                  border: chartMode === mode ? `1px solid rgba(${modeColor},0.2)` : "1px solid transparent",
                }}>
                {chartModeLabel[mode]}
              </button>
            )
          })}
        </div>

        {/* Sub-metrics strip — elevated with first-class grade */}
        <div className="grid grid-cols-6 gap-2 mb-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.015)" }}>
          {[
            { label: "Expectancy", value: `$${m.expectancy.toFixed(0)}`, sub: `RA ${m.riskAdjExpectancy.toFixed(2)}`, color: "16,185,129" },
            { label: "Profit Factor", value: m.profitFactor.toFixed(1), sub: "win/loss", color: "52,211,153" },
            { label: "Avg Win", value: `$${m.avgWin}`, sub: `R:R ${m.avgRR}`, color: "16,185,129" },
            { label: "Avg Loss", value: `-$${m.avgLoss}`, sub: "avg stop", color: "239,68,68" },
            { label: "Smoothness", value: m.curveSmoothness.toFixed(2), sub: m.curveSmoothness < 0.35 ? "stable" : m.curveSmoothness < 0.6 ? "moderate" : "volatile", color: m.curveSmoothness < 0.35 ? "16,185,129" : m.curveSmoothness < 0.6 ? "56,189,248" : "245,158,11" },
          ].map(s => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[5px] uppercase tracking-wider text-slate-500/50">{s.label}</span>
              <span className="text-[9px] font-mono font-bold" style={{ color: `rgba(${s.color},0.85)` }}>{s.value}</span>
              <span className="text-[5px] text-slate-500/40 font-mono">{s.sub}</span>
            </div>
          ))}
          {/* Grade — clickable */}
          <button type="button" onClick={() => setGradeOpen(o => !o)}
            className="flex flex-col items-start rounded-md px-1.5 py-0.5 -mx-1.5 transition-all hover:bg-white/[0.04]"
            style={{ border: `1px solid rgba(${tier.color},0.18)`, background: `rgba(${tier.color},0.04)` }}>
            <span className="text-[5px] uppercase tracking-wider" style={{ color: `rgba(${tier.color},0.55)` }}>Grade</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black leading-none" style={{ color: `rgba(${tier.color},0.95)` }}>{tier.letter}</span>
              <ChevronDown className="w-2 h-2" style={{ color: `rgba(${tier.color},0.55)` }} />
            </div>
            <span className="text-[5px] font-mono" style={{ color: `rgba(${tier.color},0.55)` }}>score {(m.gradeInputs.score * 100).toFixed(0)}</span>
          </button>
        </div>

        {/* Grade breakdown popover */}
        <GradeBreakdownPopover m={m} open={gradeOpen} onClose={() => setGradeOpen(false)} />

        {/* Chart — 6 modes */}
        <div className="h-[145px]">
          <AnimatePresence mode="wait">
            <motion.div key={chartMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id={`pnl-grad-${period}-${chartMode}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={`rgba(${chartColor},0.2)`} />
                    <stop offset="100%" stopColor={`rgba(${chartColor},0)`} />
                  </linearGradient>
                  <filter id="glow"><feGaussianBlur stdDeviation="2.5" /><feComposite in="SourceGraphic" /></filter>
                </defs>

                {/* Grid */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const yy = py + pct * (h - py * 2)
                  const val = maxVal - pct * range
                  const isRmultiple = chartMode === "r-multiple"
                  const isWrMode = chartMode === "rolling-wr"
                  return (
                    <g key={i}>
                      <line x1={px} y1={yy} x2={w - px} y2={yy} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 5" />
                      <text x={px - 4} y={yy + 3} textAnchor="end" fontSize="5" fontFamily="monospace" fill="rgba(148,163,184,0.3)">
                        {isWrMode ? `${val.toFixed(0)}%`
                          : isRmultiple ? `${val.toFixed(0)}`
                          : val >= 1000 || val <= -1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val.toFixed(0)}`}
                      </text>
                    </g>
                  )
                })}

                {/* Zero line */}
                {(chartMode === "daily" || chartMode === "drawdown") && minVal < 0 && (
                  <line x1={px} y1={zeroY} x2={w - px} y2={zeroY} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                )}

                {/* Ghost previous-period curve when comparison is on */}
                {prevPoints && chartMode === "equity" && (() => {
                  const prevMax = Math.max(...prevPoints.map(p => p.v), 1)
                  const prevMin = Math.min(...prevPoints.map(p => p.v), 0)
                  const prevRange = prevMax - prevMin || 1
                  const ghostPts = prevPoints.map(p => ({
                    x: p.x,
                    y: py + (1 - (p.v - prevMin) / prevRange) * (h - py * 2),
                  }))
                  const ghostD = ghostPts.map((p, i) => i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`).join(" ")
                  return (
                    <motion.path d={ghostD} fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="1" strokeDasharray="3 3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                  )
                })()}

                {/* Chart body per mode */}
                {(chartMode === "daily" || chartMode === "r-multiple" || chartMode === "concentration") ? (
                  // Bar chart for daily / r-multiple / concentration
                  (chartMode === "r-multiple" ? rMultipleBins.map((b, i) => ({
                      label: b.label, value: b.count, color: b.color, key: `${i}`
                    }))
                    : chartMode === "concentration" ? m.concentrationByInstrument.map((c, i) => ({
                      label: c.symbol, value: c.pnl, color: c.color, key: c.symbol
                    }))
                    : adjustedData.map((d, i) => ({
                      label: d.label, value: d.value, color: d.value >= 0 ? "16,185,129" : "239,68,68", key: `${i}`
                    }))
                  ).map((d, i, arr) => {
                    const barWidth = Math.max(8, (w - px * 2) / arr.length - 4)
                    const barX = px + (i / Math.max(arr.length - 1, 1)) * (w - px * 2) - barWidth / 2
                    const effectiveZero = chartMode === "daily" ? zeroY : h - py
                    const barH = Math.abs(d.value / range) * (h - py * 2)
                    const isPos = d.value >= 0
                    const barY = isPos ? effectiveZero - barH : effectiveZero
                    return (
                      <motion.rect key={d.key} x={barX} y={barY} width={barWidth} height={barH} rx="2"
                        fill={`rgba(${d.color},0.55)`}
                        stroke={hoveredIdx === i ? `rgba(${d.color},1)` : "transparent"}
                        strokeWidth={hoveredIdx === i ? 1 : 0}
                        initial={{ height: 0, y: effectiveZero }} animate={{ height: barH, y: barY }}
                        transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: EASE_ARR }}
                        onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => {
                          if (chartMode === "concentration") onDrilldown?.({ type: "instrument", symbol: m.concentrationByInstrument[i].symbol })
                          else if (chartMode === "daily") onDrilldown?.({ type: "curve-point", index: i, mode: chartMode })
                        }}
                        className="cursor-pointer" />
                    )
                  })
                ) : (
                  // Line/area chart for equity / drawdown / rolling-wr
                  <>
                    <motion.path d={areaD} fill={`url(#pnl-grad-${period}-${chartMode})`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
                    <motion.path d={pathD} fill="none" stroke={`rgba(${chartColor},0.25)`} strokeWidth="5" filter="url(#glow)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} />
                    <motion.path d={pathD} fill="none" stroke={`rgba(${chartColor},0.85)`} strokeWidth="1.8" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} />
                    {points.map((p, i) => (
                      <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => onDrilldown?.({ type: "curve-point", index: i, mode: chartMode })}
                        className="cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
                        <motion.circle cx={p.x} cy={p.y}
                          r={hoveredIdx === i ? 3.5 : 2}
                          fill={hoveredIdx === i ? `rgba(${chartColor},1)` : `rgba(${chartColor},0.7)`}
                          stroke={hoveredIdx === i ? "rgba(255,255,255,0.25)" : `rgba(${chartColor},0.25)`}
                          strokeWidth={hoveredIdx === i ? 1.5 : 0.8}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ delay: 0.35 + i * 0.06, ...SPRING_BOUNCE }} />
                      </g>
                    ))}
                  </>
                )}

                {/* Labels */}
                {(chartMode === "r-multiple" ? rMultipleBins.map(b => ({ label: b.label }))
                  : chartMode === "concentration" ? m.concentrationByInstrument.map(c => ({ label: c.symbol.split("/")[0] }))
                  : chartMode === "rolling-wr" ? rollingWrData.map((_, i) => ({ label: `${i + 1}` }))
                  : adjustedData
                ).map((d, i, arr) => (
                  <text key={i} x={px + (i / Math.max(arr.length - 1, 1)) * (w - px * 2)} y={h - 4}
                    textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgba(148,163,184,0.4)">{d.label}</text>
                ))}
              </svg>

              {/* Rich hover popover (session-linkage) — HTML overlay outside the SVG */}
              {hoveredIdx !== null && (chartMode === "equity" || chartMode === "daily") && adjustedData[hoveredIdx] && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 px-2.5 py-1.5 rounded-lg pointer-events-none"
                  style={{
                    left: `${(points[hoveredIdx].x / w) * 100}%`,
                    top: `${(points[hoveredIdx].y / h) * 100}%`,
                    transform: "translate(-50%, calc(-100% - 8px))",
                    background: "rgba(8,10,18,0.97)",
                    border: `1px solid rgba(${chartColor},0.3)`,
                    boxShadow: `0 8px 24px rgba(0,0,0,0.55), 0 0 12px rgba(${chartColor},0.15)`,
                    minWidth: 140,
                  }}>
                  <div className="text-[6px] uppercase tracking-wider text-slate-500/50 font-bold">{adjustedData[hoveredIdx].label}</div>
                  <div className="text-[10px] font-mono font-bold" style={{ color: `rgba(${chartColor},0.95)` }}>
                    {chartMode === "equity" ? `$${adjustedData[hoveredIdx].cumulative.toLocaleString()}` : `${adjustedData[hoveredIdx].value >= 0 ? "+" : ""}$${adjustedData[hoveredIdx].value.toLocaleString()}`}
                  </div>
                  <div className="text-[5px] text-slate-400/60 mt-0.5">{pnlView === "gross" ? "Gross" : "Net"} &middot; {pnlScope === "live" ? "Realized + Live" : "Realized"}</div>
                  <div className="flex items-center gap-1 mt-1 text-[5px] text-sky-400/70">
                    <ArrowRight className="w-2 h-2" /> Click point for session detail
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Drawdown Anatomy strip */}
        <DrawdownAnatomyStrip m={m} />

        {/* Edge Decomposition strip */}
        <EdgeDecompositionStrip m={m} onSliceClick={(key, kind) => {
          if (kind === "instrument") onDrilldown?.({ type: "instrument", symbol: key })
          else onDrilldown?.({ type: "session-type", typeName: key })
        }} />
      </div>
    </GlassCard>
  )
}

// ═════════════════���════════════════════════════════════════════════
// SYSTEM D: SESSION OUTCOMES + QUALITY
// ══════════════════════════════════════════════════════════════════

function SessionOutcomesModule({ m }: { m: DashboardMetrics }) {
  const total = m.profitableSessions + m.lossSessions + m.breakevenSessions
  const segments = [
    { value: m.profitableSessions, color: "16,185,129", label: "Won" },
    { value: m.lossSessions, color: "239,68,68", label: "Lost" },
    { value: m.breakevenSessions, color: "148,163,184", label: "BE" },
  ]
  const r = 34, cx = 46, cy = 46, circ = 2 * Math.PI * r
  let offset = 0

  // Quality factors
  const qualityScore = Math.round(MENTOR_QUALITY_FACTORS.reduce((sum, f) => sum + f.value, 0) / MENTOR_QUALITY_FACTORS.length)

  return (
    <GlassCard delay={0.3} accent="139,92,246" glowIntensity={0.04}>
      <div className="px-3 pt-3 pb-2.5">
        <div className="flex items-center gap-2 mb-2.5">
          <PieChart className="w-3 h-3 text-violet-400/60" />
          <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Session Outcomes</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Donut */}
          <div className="relative flex-shrink-0">
            <svg viewBox="0 0 92 92" className="w-24 h-24">
              {segments.map((seg, i) => {
                const dashLen = (seg.value / total) * circ
                const currentOffset = offset
                offset += seg.value
                return (
                  <motion.circle key={i} cx={cx} cy={cy} r={r}
                    fill="none" stroke={`rgba(${seg.color},0.8)`} strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeDasharray={`${dashLen} ${circ - dashLen}`}
                    strokeDashoffset={-currentOffset * (circ / total)}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    initial={{ opacity: 0, strokeWidth: 0 }}
                    animate={{ opacity: 1, strokeWidth: 5.5 }}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: EASE_ARR }}
                  />
                )
              })}
              <text x={cx} y={cy - 3} textAnchor="middle" fontSize="15" fontWeight="900" fill="rgba(255,255,255,0.92)" fontFamily="monospace">{m.profitableSessions}</text>
              <text x={cx} y={cy + 9} textAnchor="middle" fontSize="5.5" fill="rgba(148,163,184,0.55)" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">WINS</text>
            </svg>
          </div>

          {/* Stats beside donut */}
          <div className="flex-1 space-y-1.5">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${seg.color},0.75)` }} />
                  <span className="text-[7px] text-slate-300/55">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono font-bold" style={{ color: `rgba(${seg.color},0.8)` }}>{seg.value}</span>
                  <span className="text-[6px] font-mono text-slate-500/35">{((seg.value / total) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
            <div className="pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[6px] text-slate-500/40 uppercase tracking-wider">Quality Score</span>
                <span className="text-[9px] font-mono font-bold text-violet-400/80">{qualityScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best / Worst compact */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.08)" }}>
            <span className="text-[5px] text-emerald-400/45 uppercase tracking-wider block">Best</span>
            <span className="text-[8px] font-bold text-emerald-400/80 block">{m.bestSession.pnl}</span>
            <span className="text-[5px] text-slate-500/35 truncate block">{m.bestSession.name}</span>
          </div>
          <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
            <span className="text-[5px] text-red-400/45 uppercase tracking-wider block">Worst</span>
            <span className="text-[8px] font-bold text-red-400/80 block">{m.worstSession.pnl}</span>
            <span className="text-[5px] text-slate-500/35 truncate block">{m.worstSession.name}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// Session Types with phase analysis (System D)
function SessionTypesModule() {
  return (
    <GlassCard delay={0.4} accent="245,158,11" glowIntensity={0.03}>
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-3 h-3 text-amber-400/60" />
          <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Session Types</span>
        </div>
        <div className="space-y-1.5">
          {SESSION_TYPES.map((st, i) => {
            const totalPhase = st.phases.obs + st.phases.setup + st.phases.exec + st.phases.review
            return (
              <motion.div key={st.type}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.07, ...SPRING_CARD }}
                className="px-2.5 py-2 rounded-xl" style={{ background: `rgba(${st.color},0.04)`, border: `1px solid rgba(${st.color},0.08)` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-bold text-white/75">{st.type}</span>
                  <span className="text-[6px] font-mono" style={{ color: `rgba(${st.color},0.7)` }}>{st.winRate}% WR</span>
                </div>
                {/* Phase bar */}
                <div className="flex h-[3px] rounded-full overflow-hidden gap-px mb-1">
                  {[
                    { v: st.phases.obs, c: "148,163,184", l: "Obs" },
                    { v: st.phases.setup, c: "56,189,248", l: "Setup" },
                    { v: st.phases.exec, c: "16,185,129", l: "Exec" },
                    { v: st.phases.review, c: "139,92,246", l: "Review" },
                  ].map((phase, pi) => (
                    <motion.div key={pi} className="rounded-full" style={{ background: `rgba(${phase.c},0.45)` }}
                      initial={{ width: 0 }} animate={{ width: `${(phase.v / totalPhase) * 100}%` }}
                      transition={{ delay: 0.6 + i * 0.07 + pi * 0.04, duration: 0.5 }} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[5px] text-slate-500/40">{st.count} sess</span>
                  <span className="text-[5px] text-slate-500/40">{st.avgDuration}</span>
                  <span className="text-[5px] font-mono ml-auto" style={{
                    color: st.avgPnl.startsWith("+") ? "rgba(52,211,153,0.65)" : st.avgPnl.startsWith("-") ? "rgba(248,113,113,0.65)" : "rgba(148,163,184,0.45)"
                  }}>{st.avgPnl}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM E: INSTRUMENT INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

function InstrumentModule() {
  const [sortBy, setSortBy] = useState<"pnl" | "winRate" | "trades">("pnl")
  const sorted = useMemo(() => {
    return [...INSTRUMENT_PERF].sort((a, b) => {
      if (sortBy === "pnl") return b.netPnlValue - a.netPnlValue
      if (sortBy === "winRate") return b.winRate - a.winRate
      return b.trades - a.trades
    })
  }, [sortBy])

  return (
    <GlassCard delay={0.35} accent="56,189,248" glowIntensity={0.04}>
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3 h-3 text-sky-400/60" />
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Instrument Intelligence</span>
          </div>
          <div className="flex items-center gap-0.5">
            {(["pnl", "winRate", "trades"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: sortBy === s ? "rgba(56,189,248,0.1)" : "transparent",
                  color: sortBy === s ? "rgba(125,211,252,0.8)" : "rgba(148,163,184,0.35)",
                }}>
                {s === "pnl" ? "P&L" : s === "winRate" ? "WR" : "Trades"}
              </button>
            ))}
          </div>
        </div>
        {sorted.map((inst, i) => {
          const isPositive = inst.netPnlValue >= 0
          const instColor = isPositive ? "16,185,129" : "239,68,68"
          return (
            <motion.div key={inst.symbol}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05, ease: EASE_ARR }}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all duration-200 hover:bg-white/[0.02] group"
              style={{
                borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.025)" : "none",
                background: `linear-gradient(90deg, rgba(${instColor},0.02), transparent 60%)`,
              }}>
              <div className="w-8 flex-shrink-0">
                <span className="text-[7px] font-mono font-bold" style={{ color: `rgba(${instColor},0.85)` }}>{inst.symbol.split("/")[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-white/80">{inst.symbol}</span>
                    <span className="px-1 py-px rounded text-[4px] font-bold uppercase"
                      style={{ background: inst.focus === "core" ? "rgba(16,185,129,0.08)" : "rgba(148,163,184,0.05)", color: inst.focus === "core" ? "rgba(52,211,153,0.7)" : "rgba(148,163,184,0.4)" }}>
                      {inst.focus}
                    </span>
                    <EdgeBadge score={inst.edgeScore} />
                  </div>
                  <span className="text-[8px] font-mono font-bold" style={{ color: `rgba(${instColor},0.85)` }}>{inst.netPnl}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-[2px] rounded-full bg-white/[0.03] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: `rgba(${instColor},0.5)` }}
                      initial={{ width: 0 }} animate={{ width: `${inst.winRate}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.7 }} />
                  </div>
                  <span className="text-[6px] font-mono text-slate-400/45">{inst.winRate}%</span>
                  <span className="text-[5px] text-slate-500/35">{inst.trades}T</span>
                  <MiniSparkline data={inst.sparkline} color={instColor} width={36} height={10} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM F + G: AUDIENCE + CONTRIBUTORS
// ═════════���════════════════════════════════════════════════════════

function WeeklyHeatmap({ data }: { data: HeatmapDay[] }) {
  const engColors: Record<string, string> = {
    none: "rgba(148,163,184,0.04)", low: "rgba(139,92,246,0.1)",
    medium: "rgba(139,92,246,0.22)", high: "rgba(139,92,246,0.4)", peak: "rgba(139,92,246,0.65)",
  }
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {data.map((day, i) => (
        <motion.div key={day.shortDay}
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 + i * 0.05, ...SPRING_CARD }}
          className="flex flex-col items-center gap-0.5">
          <span className="text-[5px] font-mono uppercase tracking-wider text-slate-500/45">{day.shortDay}</span>
          <motion.div className="w-full aspect-square rounded-lg flex flex-col items-center justify-center"
            style={{ background: engColors[day.engagement], border: `1px solid rgba(139,92,246,${day.engagement === "peak" ? 0.25 : 0.06})` }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 12px rgba(139,92,246,0.15)" }}>
            <span className="text-[10px] font-bold text-white/75">{day.trades}</span>
            <span className="text-[4px] uppercase tracking-wider text-white/35">trades</span>
            {day.pnl !== 0 && (
              <span className="text-[5px] font-mono font-bold mt-0.5" style={{ color: day.pnl > 0 ? "rgba(52,211,153,0.75)" : "rgba(248,113,113,0.75)" }}>
                {day.pnl > 0 ? "+" : ""}{(day.pnl / 1000).toFixed(1)}k
              </span>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

function AudienceEngagementModule() {
  const maxV = Math.max(...ENGAGEMENT_DATA.map(d => d.viewers))
  return (
    <GlassCard delay={0.5} accent="56,189,248" glowIntensity={0.03}>
      <div className="px-3.5 pt-3 pb-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3 text-sky-400/60" />
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Audience Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            {[{ c: "rgba(56,189,248,0.2)", l: "Viewers" }, { c: "rgba(56,189,248,0.6)", l: "Active" }, { c: "rgba(139,92,246,0.6)", l: "Quality" }].map(legend => (
              <div key={legend.l} className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: legend.c }} />
                <span className="text-[5px] text-slate-500/40">{legend.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {ENGAGEMENT_DATA.map((d, i) => {
            const hPct = (d.viewers / maxV) * 100
            const aPct = (d.active / d.viewers) * hPct
            const qPct = (d.qualityEngaged / d.viewers) * hPct
            return (
              <div key={d.session} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full relative" style={{ height: "52px" }}>
                  <motion.div className="absolute bottom-0 w-full rounded-t" style={{ background: "rgba(56,189,248,0.12)" }}
                    initial={{ height: 0 }} animate={{ height: `${hPct}%` }} transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: EASE_ARR }} />
                  <motion.div className="absolute bottom-0 w-full rounded-t" style={{ background: "rgba(56,189,248,0.4)" }}
                    initial={{ height: 0 }} animate={{ height: `${aPct}%` }} transition={{ delay: 0.55 + i * 0.05, duration: 0.5, ease: EASE_ARR }} />
                  <motion.div className="absolute bottom-0 w-full rounded-t" style={{ background: "rgba(139,92,246,0.5)" }}
                    initial={{ height: 0 }} animate={{ height: `${qPct}%` }} transition={{ delay: 0.6 + i * 0.05, duration: 0.5, ease: EASE_ARR }} />
                </div>
                <span className="text-[5px] font-mono text-slate-500/40">{d.session}</span>
              </div>
            )
          })}
        </div>
        {/* Retention + quality stats */}
        <div className="flex items-center justify-between mt-2 pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-slate-500/40 uppercase">Avg Retention</span>
            <span className="text-[7px] font-mono font-bold text-sky-400/70">{Math.round(ENGAGEMENT_DATA.reduce((s, d) => s + d.retention, 0) / ENGAGEMENT_DATA.length)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-slate-500/40 uppercase">Quality Score</span>
            <span className="text-[7px] font-mono font-bold text-violet-400/70">{Math.round(ENGAGEMENT_DATA.reduce((s, d) => s + d.qualityEngaged, 0) / ENGAGEMENT_DATA.length)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function ContributorsModule() {
  const medals = ["rgba(245,158,11,0.85)", "rgba(148,163,184,0.7)", "rgba(180,120,60,0.7)"]
  return (
    <GlassCard delay={0.55} accent="245,158,11" glowIntensity={0.03}>
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-amber-400/60" />
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Top Contributors</span>
          </div>
          <span className="text-[6px] font-mono text-slate-500/35">{TOP_CONTRIBUTORS.length} members</span>
        </div>
        {TOP_CONTRIBUTORS.map((c, i) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.06, ...SPRING_CARD }}
            className="flex items-center gap-2 py-1.5 px-1.5 rounded-lg hover:bg-white/[0.02] transition-all group">
            <div className="relative flex-shrink-0">
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${c.gradient} flex items-center justify-center text-[7px] font-bold text-white`}
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.25)" }}>{c.initials}</div>
              {i < 3 && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: "#0a0b10", border: `1.5px solid ${medals[i]}` }}>
                  <span className="text-[5px] font-bold" style={{ color: medals[i] }}>{i + 1}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-bold text-white/75 truncate">{c.name}</span>
                  {c.trend === "up" && <ArrowUpRight className="w-2 h-2 text-emerald-400/60" />}
                  {c.trend === "down" && <ArrowDownRight className="w-2 h-2 text-red-400/60" />}
                </div>
                <span className="text-[7px] font-mono font-bold text-violet-400/70">{c.engagementScore}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[5px] text-slate-400/40">{c.messages} msg</span>
                <span className="text-[5px] text-slate-400/40">{c.reactions} rxn</span>
                <span className="text-[5px] text-slate-400/40">{c.questionsAsked} Q</span>
                {/* Quality bar */}
                <div className="flex-1 h-[2px] rounded-full bg-white/[0.03] overflow-hidden ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-full rounded-full" style={{ width: `${c.impactScore}%`, background: "rgba(139,92,246,0.4)" }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM H: AI COPILOT INTELLIGENCE ENGINE
// ══════════════════════════════════════════════════════════════════

function AICopilotModule() {
  const [filter, setFilter] = useState<InsightCategory | "all">("all")
  const [insightStates, setInsightStates] = useState<Record<number, InsightAction>>(
    Object.fromEntries(AI_INSIGHTS.map((_, i) => [i, AI_INSIGHTS[i].actionState]))
  )

  const filtered = filter === "all" ? AI_INSIGHTS : AI_INSIGHTS.filter(i => i.category === filter)
  const categories: (InsightCategory | "all")[] = ["all", "performance", "risk", "audience", "instrument", "behavioral", "session"]
  const newCount = AI_INSIGHTS.filter((_, i) => insightStates[i] === "new").length

  return (
    <GlassCard delay={0.5} accent="16,185,129" glowIntensity={0.05} priority="hero">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div className="relative">
              <Brain className="w-3.5 h-3.5 text-emerald-400/80" />
              <motion.div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400/90"
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </motion.div>
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">AI Copilot Intelligence</span>
            {newCount > 0 && (
              <motion.span className="px-1.5 py-0.5 rounded-md text-[6px] font-bold"
                style={{ background: "rgba(16,185,129,0.12)", color: "rgba(52,211,153,0.85)", border: "1px solid rgba(16,185,129,0.2)" }}
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                {newCount} new
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <Sparkles className="w-2.5 h-2.5 text-emerald-400/65" />
            <span className="text-[5px] font-bold text-emerald-400/60 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-0.5 mb-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: filter === cat ? "rgba(16,185,129,0.1)" : "transparent",
                color: filter === cat ? "rgba(52,211,153,0.8)" : "rgba(148,163,184,0.35)",
                border: filter === cat ? "1px solid rgba(16,185,129,0.15)" : "1px solid transparent",
              }}>
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Insights feed */}
        <div className="space-y-1.5">
          {filtered.map((insight, i) => {
            const Icon = insight.icon
            const state = insightStates[AI_INSIGHTS.indexOf(insight)] || "new"
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12, scale: 0.96 }}
                animate={{ opacity: state === "dismissed" ? 0.4 : 1, x: 0, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.08, ...SPRING_CARD }}
                className="relative rounded-xl overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, rgba(${insight.accent},0.05) 0%, rgba(10,12,18,0.92) 50%)`,
                  border: `1px solid rgba(${insight.accent},0.08)`,
                }}>
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-0.5 h-full rounded-r-full" style={{ background: `rgba(${insight.accent},0.45)` }} />
                <div className="px-3 py-2 pl-3.5">
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <UrgencyDot urgency={insight.urgency} />
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: `rgba(${insight.accent},0.1)`, border: `1px solid rgba(${insight.accent},0.15)` }}>
                        <Icon className="w-2.5 h-2.5" style={{ color: `rgba(${insight.accent},0.85)` }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-white/82">{insight.title}</span>
                        <span className="text-[5px] font-mono text-slate-500/35">{insight.time}</span>
                      </div>
                      <p className="text-[6.5px] text-slate-300/50 mt-0.5 leading-relaxed">{insight.detail}</p>
                      {insight.metric && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[5px] font-mono font-bold"
                          style={{ background: `rgba(${insight.accent},0.06)`, color: `rgba(${insight.accent},0.7)` }}>
                          {insight.metric}
                        </span>
                      )}
                      {/* Action buttons */}
                      <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {state === "new" && (
                          <>
                            {insight.recommendation && (
                              <button onClick={() => setInsightStates(s => ({ ...s, [AI_INSIGHTS.indexOf(insight)]: "applied" }))}
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider"
                                style={{ background: `rgba(${insight.accent},0.1)`, color: `rgba(${insight.accent},0.8)` }}>
                                <Check className="w-2 h-2" /> Apply
                              </button>
                            )}
                            <button onClick={() => setInsightStates(s => ({ ...s, [AI_INSIGHTS.indexOf(insight)]: "acknowledged" }))}
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[5px] font-bold text-slate-400/50 hover:text-white/60 transition-colors">
                              <Bookmark className="w-2 h-2" /> Save
                            </button>
                            <button onClick={() => setInsightStates(s => ({ ...s, [AI_INSIGHTS.indexOf(insight)]: "dismissed" }))}
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[5px] font-bold text-slate-400/50 hover:text-red-400/60 transition-colors">
                              <X className="w-2 h-2" /> Dismiss
                            </button>
                          </>
                        )}
                        {state === "applied" && (
                          <span className="flex items-center gap-0.5 text-[5px] font-bold text-emerald-400/60">
                            <Check className="w-2 h-2" /> Applied
                          </span>
                        )}
                        {state === "acknowledged" && (
                          <span className="flex items-center gap-0.5 text-[5px] font-bold text-sky-400/60">
                            <Bookmark className="w-2 h-2" /> Saved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM I: MENTOR PERFORMANCE + ROOM QUALITY
// ══════════════════════════════════════════════════════════════════

function MentorPerformanceModule({ m }: { m: DashboardMetrics }) {
  // Radar chart values
  const radarData = MENTOR_QUALITY_FACTORS.map(f => f.value / 100)
  const radarSize = 72, radarCenter = radarSize / 2, radarR = 28
  const points = radarData.map((v, i) => {
    const angle = (Math.PI * 2 * i) / radarData.length - Math.PI / 2
    return { x: radarCenter + Math.cos(angle) * radarR * v, y: radarCenter + Math.sin(angle) * radarR * v }
  })
  const radarPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z"

  // Mentor grade tier
  const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
    "A+": { bg: "rgba(16,185,129,0.12)", text: "rgba(52,211,153,0.9)", border: "rgba(16,185,129,0.25)" },
    A: { bg: "rgba(16,185,129,0.08)", text: "rgba(52,211,153,0.75)", border: "rgba(16,185,129,0.18)" },
    "B+": { bg: "rgba(56,189,248,0.08)", text: "rgba(125,211,252,0.75)", border: "rgba(56,189,248,0.18)" },
    B: { bg: "rgba(56,189,248,0.06)", text: "rgba(125,211,252,0.6)", border: "rgba(56,189,248,0.12)" },
  }
  const gc = gradeColors[m.performanceGrade] || gradeColors["B"]

  return (
    <GlassCard delay={0.55} accent="139,92,246" glowIntensity={0.05} priority="hero">
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-violet-400/70" />
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Mentor Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[7px] font-bold"
              style={{ background: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}>
              Grade {m.performanceGrade}
            </span>
            <span className="text-[6px] text-slate-500/40">Mentor Alex</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Quality radar */}
          <div className="flex flex-col items-center">
            <span className="text-[6px] font-bold uppercase tracking-wider text-slate-500/45 mb-2">Room Quality</span>
            <svg viewBox={`0 0 ${radarSize} ${radarSize}`} className="w-20 h-20">
              {/* Grid rings */}
              {[0.33, 0.66, 1].map((pct, i) => {
                const ringPts = Array.from({ length: 6 }, (_, j) => {
                  const angle = (Math.PI * 2 * j) / 6 - Math.PI / 2
                  return `${radarCenter + Math.cos(angle) * radarR * pct},${radarCenter + Math.sin(angle) * radarR * pct}`
                }).join(" ")
                return <polygon key={i} points={ringPts} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
              })}
              {/* Axis lines */}
              {MENTOR_QUALITY_FACTORS.map((_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
                return <line key={i} x1={radarCenter} y1={radarCenter}
                  x2={radarCenter + Math.cos(angle) * radarR} y2={radarCenter + Math.sin(angle) * radarR}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              })}
              {/* Data shape */}
              <motion.polygon points={points.map(p => `${p.x},${p.y}`).join(" ")}
                fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.6)" strokeWidth="1"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                style={{ transformOrigin: "center" }}
                transition={{ delay: 0.7, duration: 0.6, ease: EASE_ARR }} />
              {/* Data points */}
              {points.map((p, i) => (
                <motion.circle key={i} cx={p.x} cy={p.y} r="1.5" fill="rgba(139,92,246,0.9)"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.05, ...SPRING_BOUNCE }} />
              ))}
              {/* Labels */}
              {MENTOR_QUALITY_FACTORS.map((f, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
                const lx = radarCenter + Math.cos(angle) * (radarR + 8)
                const ly = radarCenter + Math.sin(angle) * (radarR + 8)
                return <text key={i} x={lx} y={ly + 1.5} textAnchor="middle" fontSize="3.5" fill="rgba(148,163,184,0.45)" fontFamily="monospace">{f.label.slice(0, 5)}</text>
              })}
            </svg>
          </div>

          {/* Factor breakdown */}
          <div className="space-y-1.5">
            <span className="text-[6px] font-bold uppercase tracking-wider text-slate-500/45">Quality Factors</span>
            {MENTOR_QUALITY_FACTORS.map((f, i) => (
              <div key={f.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[6px] text-slate-300/50">{f.label}</span>
                  <span className="text-[7px] font-mono font-bold" style={{ color: `rgba(${f.color},0.8)` }}>{f.value}%</span>
                </div>
                <div className="h-[2px] rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: `rgba(${f.color},0.5)` }}
                    initial={{ width: 0 }} animate={{ width: `${f.value}%` }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.7 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Audience impact stats */}
          <div className="space-y-2">
            <span className="text-[6px] font-bold uppercase tracking-wider text-slate-500/45">Audience Impact</span>
            {[
              { label: "Peak Viewers", value: m.peakAudience.toLocaleString(), icon: Eye, color: "139,92,246" },
              { label: "Avg Active", value: m.avgAudience.toLocaleString(), icon: Users, color: "56,189,248" },
              { label: "Retention", value: `${m.audienceRetention}%`, icon: Timer, color: "16,185,129" },
              { label: "Engagement", value: `${m.engagementQuality}`, icon: Signal, color: "245,158,11" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <stat.icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `rgba(${stat.color},0.5)` }} />
                <span className="text-[6px] text-slate-300/45 flex-1">{stat.label}</span>
                <span className="text-[7px] font-mono font-bold text-white/65">{stat.value}</span>
              </div>
            ))}
            {/* Verification badge */}
            <div className="mt-2 pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
                <Shield className="w-2.5 h-2.5 text-emerald-400/60" />
                <div className="flex flex-col">
                  <span className="text-[5px] font-bold text-emerald-400/65 uppercase tracking-wider">Verified Mentor</span>
                  <span className="text-[4px] text-slate-500/35">{m.totalSessions} sessions tracked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM K: CUSTOMIZE PANEL (slide-in)
// ══════════════════════════════════════════════════════════════════

// System K v2 — three-column customize panel operating on the real module registry
function CustomizePanel({ open, onClose, configApi }: {
  open: boolean; onClose: () => void
  configApi: ReturnType<typeof useDashboardConfig>
}) {
  const { config, savedPresets, activePresetId, updateModule, reorderModule, applyPreset, savePreset, resetToDefault } = configApi
  const [selectedModuleId, setSelectedModuleId] = useState<ModuleId>("pnl")
  const [saveInput, setSaveInput] = useState("")
  const [showSaveInput, setShowSaveInput] = useState(false)

  const allPresets = useMemo(() => [...CURATED_PRESETS, ...savedPresets], [savedPresets])
  const selectedModule = useMemo(() => config.find(m => m.id === selectedModuleId) ?? config[0], [config, selectedModuleId])
  const sortedByZone = useMemo(() => {
    const zones: ModuleZone[] = ["pinned-hero", "truth-rail", "intelligence-grid", "deep-dive"]
    return zones.map(z => ({ zone: z, modules: config.filter(m => m.zone === z).sort((a, b) => a.order - b.order) }))
  }, [config])

  const zoneLabels: Record<ModuleZone, { label: string; color: string; icon: typeof Brain }> = {
    "pinned-hero": { label: "Pinned Hero", color: "245,158,11", icon: Star },
    "truth-rail": { label: "Truth Rail", color: "16,185,129", icon: Crown },
    "intelligence-grid": { label: "Intelligence Grid", color: "56,189,248", icon: Layers },
    "deep-dive": { label: "Deep Dive", color: "148,163,184", icon: ChevronDown },
  }
  const privacyCfg: Record<ModulePrivacy, { label: string; color: string; icon: typeof Brain }> = {
    "public": { label: "Public", color: "16,185,129", icon: Globe },
    "private": { label: "Private", color: "245,158,11", icon: Lock },
    "mentor-only": { label: "Mentor Only", color: "239,68,68", icon: Shield },
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }} onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: EASE_ARR }}
            className="absolute right-0 top-0 bottom-0 w-[720px] max-w-full z-50 flex flex-col"
            style={{
              background: "linear-gradient(180deg, rgba(12,14,22,0.98), rgba(8,10,16,0.99))",
              borderLeft: "1px solid rgba(139,92,246,0.2)",
              boxShadow: "-16px 0 50px rgba(0,0,0,0.55)",
            }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400/75" />
                <div>
                  <div className="text-[11px] font-bold text-white/85 leading-tight">Customize Dashboard</div>
                  <div className="text-[6px] text-slate-400/50 uppercase tracking-wider">Your intelligence cockpit</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={resetToDefault} className="flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-bold text-slate-400/50 hover:text-white/60 transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <RotateCcw className="w-2.5 h-2.5" /> Reset
                </button>
                <button onClick={onClose} className="p-1 rounded-md hover:bg-white/[0.04] transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-400/50" />
                </button>
              </div>
            </div>

            {/* Three-column body */}
            <div className="flex-1 grid grid-cols-[200px_1fr_220px] min-h-0">
              {/* LEFT: Presets */}
              <div className="border-r flex flex-col min-h-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-3">
                    <div>
                      <span className="text-[7px] font-bold text-white/55 uppercase tracking-wider">Curated Presets</span>
                      <div className="space-y-1 mt-1.5">
                        {CURATED_PRESETS.map(p => {
                          const active = activePresetId === p.id
                          return (
                            <motion.button key={p.id} type="button" onClick={() => applyPreset(p)}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
                              style={{
                                background: active ? `rgba(${p.color},0.08)` : "rgba(255,255,255,0.02)",
                                border: `1px solid ${active ? `rgba(${p.color},0.25)` : "rgba(255,255,255,0.04)"}`,
                              }}>
                              <p.icon className="w-3 h-3 flex-shrink-0" style={{ color: `rgba(${p.color},0.75)` }} />
                              <div className="flex-1 min-w-0">
                                <div className="text-[7px] font-bold" style={{ color: active ? `rgba(${p.color},0.95)` : "rgba(255,255,255,0.75)" }}>{p.label}</div>
                                <div className="text-[5px] text-slate-500/55 truncate">{p.description}</div>
                              </div>
                              {active && <Check className="w-2.5 h-2.5" style={{ color: `rgba(${p.color},0.8)` }} />}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                    {savedPresets.length > 0 && (
                      <div>
                        <span className="text-[7px] font-bold text-white/55 uppercase tracking-wider">My Layouts</span>
                        <div className="space-y-1 mt-1.5">
                          {savedPresets.map(p => {
                            const active = activePresetId === p.id
                            return (
                              <button key={p.id} type="button" onClick={() => applyPreset(p)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
                                style={{
                                  background: active ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                                  border: `1px solid ${active ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.04)"}`,
                                }}>
                                <Bookmark className="w-3 h-3 text-violet-400/70 flex-shrink-0" />
                                <span className="text-[7px] font-bold text-white/70 truncate flex-1">{p.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    <div>
                      {!showSaveInput ? (
                        <button onClick={() => setShowSaveInput(true)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[7px] font-bold text-slate-400/55 hover:text-white/70 transition-colors"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}>
                          <Save className="w-2.5 h-2.5" /> Save current layout
                        </button>
                      ) : (
                        <div className="space-y-1.5">
                          <input value={saveInput} onChange={e => setSaveInput(e.target.value)} placeholder="Preset name"
                            className="w-full px-2 py-1.5 rounded-md text-[7px] text-white/80 focus:outline-none"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }} autoFocus />
                          <div className="flex gap-1">
                            <button onClick={() => { if (saveInput.trim()) { savePreset(saveInput.trim()); setSaveInput(""); setShowSaveInput(false) } }}
                              className="flex-1 py-1 rounded-md text-[6px] font-bold text-emerald-400/80 uppercase"
                              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>Save</button>
                            <button onClick={() => { setShowSaveInput(false); setSaveInput("") }}
                              className="px-2 py-1 rounded-md text-[6px] font-bold text-slate-400/55 uppercase"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* MIDDLE: Module rail organized by zone */}
              <div className="border-r flex flex-col min-h-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-2.5">
                    {sortedByZone.map(({ zone, modules }) => {
                      const zc = zoneLabels[zone]
                      return (
                        <div key={zone}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <zc.icon className="w-2.5 h-2.5" style={{ color: `rgba(${zc.color},0.7)` }} />
                            <span className="text-[6px] font-bold uppercase tracking-wider" style={{ color: `rgba(${zc.color},0.7)` }}>{zc.label}</span>
                            <span className="text-[5px] text-slate-600/40">({modules.length})</span>
                            <div className="flex-1 h-px" style={{ background: `rgba(${zc.color},0.08)` }} />
                          </div>
                          <div className="space-y-1">
                            {modules.map((mod) => {
                              const selected = selectedModuleId === mod.id
                              const pcfg = privacyCfg[mod.privacy]
                              return (
                                <motion.button key={mod.id} type="button"
                                  onClick={() => setSelectedModuleId(mod.id)}
                                  whileTap={{ scale: 0.99 }}
                                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-left"
                                  style={{
                                    background: selected ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${selected ? "rgba(139,92,246,0.22)" : "rgba(255,255,255,0.04)"}`,
                                    opacity: mod.visible ? 1 : 0.5,
                                  }}>
                                  <div className="flex flex-col gap-0.5">
                                    <button onClick={(e) => { e.stopPropagation(); reorderModule(mod.id, "up") }}
                                      className="p-0 leading-none" aria-label="Move up">
                                      <ChevronUp className="w-2 h-2 text-slate-600/40 hover:text-slate-300/70" />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); reorderModule(mod.id, "down") }}
                                      className="p-0 leading-none" aria-label="Move down">
                                      <ChevronDown className="w-2 h-2 text-slate-600/40 hover:text-slate-300/70" />
                                    </button>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[7px] font-bold text-white/80 truncate">{mod.label}</span>
                                      {mod.pinned && <Star className="w-2 h-2 text-amber-400/75 flex-shrink-0" />}
                                      {mod.emphasized && <Flame className="w-2 h-2 text-orange-400/75 flex-shrink-0" />}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <div className="flex items-center gap-0.5 text-[5px]" style={{ color: `rgba(${pcfg.color},0.7)` }}>
                                        <pcfg.icon className="w-2 h-2" /> {pcfg.label}
                                      </div>
                                      <span className="text-[5px] text-slate-600/40">&middot;</span>
                                      <span className="text-[5px] text-slate-500/50 uppercase">{mod.size}</span>
                                    </div>
                                  </div>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); updateModule(mod.id, { visible: !mod.visible }) }}
                                    className="w-6 h-3 rounded-full relative flex-shrink-0"
                                    style={{ background: mod.visible ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)" }}>
                                    <motion.div className="absolute top-0.5 w-2 h-2 rounded-full"
                                      style={{ background: mod.visible ? "rgba(52,211,153,0.9)" : "rgba(148,163,184,0.3)" }}
                                      animate={{ left: mod.visible ? 14 : 2 }} transition={{ duration: 0.2 }} />
                                  </button>
                                </motion.button>
                              )
                            })}
                            {modules.length === 0 && (
                              <div className="text-[6px] text-slate-600/40 italic px-2 py-1">Empty zone</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* RIGHT: Settings sheet for selected module */}
              <div className="flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold">Module Settings</div>
                      <div className="text-[10px] font-bold text-white/85 mt-0.5">{selectedModule.label}</div>
                      <div className="text-[6px] text-slate-500/60 leading-relaxed mt-1">{selectedModule.description}</div>
                    </div>

                    {/* Zone */}
                    <div>
                      <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold mb-1">Zone</div>
                      <div className="grid grid-cols-2 gap-1">
                        {(Object.keys(zoneLabels) as ModuleZone[]).map(z => {
                          const zc = zoneLabels[z]
                          const active = selectedModule.zone === z
                          return (
                            <button key={z} type="button" onClick={() => updateModule(selectedModule.id, { zone: z })}
                              className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[6px] font-bold uppercase tracking-wider transition-all"
                              style={{
                                background: active ? `rgba(${zc.color},0.1)` : "rgba(255,255,255,0.02)",
                                color: active ? `rgba(${zc.color},0.9)` : "rgba(148,163,184,0.5)",
                                border: `1px solid ${active ? `rgba(${zc.color},0.2)` : "rgba(255,255,255,0.04)"}`,
                              }}>
                              <zc.icon className="w-2 h-2" /> {zc.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold mb-1">Size</div>
                      <div className="flex gap-1">
                        {(["small", "medium", "large", "full"] as ModuleSize[]).map(s => {
                          const active = selectedModule.size === s
                          return (
                            <button key={s} type="button" onClick={() => updateModule(selectedModule.id, { size: s })}
                              className="flex-1 px-1 py-1 rounded-md text-[6px] font-bold uppercase transition-all"
                              style={{
                                background: active ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.02)",
                                color: active ? "rgba(167,139,250,0.9)" : "rgba(148,163,184,0.5)",
                                border: `1px solid ${active ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)"}`,
                              }}>{s}</button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Privacy */}
                    <div>
                      <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold mb-1">Privacy</div>
                      <div className="space-y-1">
                        {(Object.keys(privacyCfg) as ModulePrivacy[]).map(p => {
                          const pc = privacyCfg[p]
                          const active = selectedModule.privacy === p
                          return (
                            <button key={p} type="button" onClick={() => updateModule(selectedModule.id, { privacy: p })}
                              className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md text-left transition-all"
                              style={{
                                background: active ? `rgba(${pc.color},0.08)` : "rgba(255,255,255,0.02)",
                                border: `1px solid ${active ? `rgba(${pc.color},0.2)` : "rgba(255,255,255,0.04)"}`,
                              }}>
                              <pc.icon className="w-2.5 h-2.5" style={{ color: `rgba(${pc.color},0.8)` }} />
                              <span className="text-[6px] font-bold" style={{ color: active ? `rgba(${pc.color},0.95)` : "rgba(148,163,184,0.6)" }}>{pc.label}</span>
                              {active && <Check className="w-2 h-2 ml-auto" style={{ color: `rgba(${pc.color},0.8)` }} />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Flags */}
                    <div className="space-y-1.5 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      {[
                        { key: "visible" as const, label: "Visible", icon: Eye },
                        { key: "pinned" as const, label: "Pin to Hero", icon: Star },
                        { key: "emphasized" as const, label: "Emphasized", icon: Flame },
                      ].map(flag => {
                        const v = selectedModule[flag.key]
                        return (
                          <button key={flag.key} type="button" onClick={() => updateModule(selectedModule.id, { [flag.key]: !v })}
                            className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md">
                            <flag.icon className="w-2.5 h-2.5" style={{ color: v ? "rgba(52,211,153,0.85)" : "rgba(148,163,184,0.35)" }} />
                            <span className="text-[6px] font-bold" style={{ color: v ? "rgba(255,255,255,0.8)" : "rgba(148,163,184,0.5)" }}>{flag.label}</span>
                            <div className="ml-auto w-6 h-3 rounded-full relative"
                              style={{ background: v ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)" }}>
                              <motion.div className="absolute top-0.5 w-2 h-2 rounded-full"
                                style={{ background: v ? "rgba(52,211,153,0.9)" : "rgba(148,163,184,0.3)" }}
                                animate={{ left: v ? 14 : 2 }} transition={{ duration: 0.18 }} />
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Per-module settings */}
                    {selectedModule.id === "pnl" && (
                      <div className="pt-1 space-y-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold">P&amp;L Module</div>
                        <div className="text-[5px] text-slate-500/60 leading-relaxed">Default chart mode, anatomy, decomposition visibility managed inside module header.</div>
                      </div>
                    )}
                    {selectedModule.id === "instruments" && (
                      <div className="pt-1 space-y-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold">Instrument Module</div>
                        <div className="grid grid-cols-3 gap-1">
                          {(["all", "core", "trial"] as const).map(s => {
                            const active = (selectedModule.settings?.show ?? "all") === s
                            return (
                              <button key={s} type="button" onClick={() => updateModule(selectedModule.id, { settings: { ...selectedModule.settings, show: s } })}
                                className="px-1 py-1 rounded-md text-[6px] font-bold uppercase transition-all"
                                style={{
                                  background: active ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.02)",
                                  color: active ? "rgba(125,211,252,0.9)" : "rgba(148,163,184,0.5)",
                                  border: `1px solid ${active ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.04)"}`,
                                }}>{s}</button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    {selectedModule.id === "copilot" && (
                      <div className="pt-1 space-y-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className="text-[6px] uppercase tracking-wider text-slate-500/55 font-bold">Copilot Module</div>
                        <button type="button" onClick={() => updateModule(selectedModule.id, { settings: { ...selectedModule.settings, showDismissed: !(selectedModule.settings?.showDismissed) } })}
                          className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md">
                          <Eye className="w-2.5 h-2.5" style={{ color: selectedModule.settings?.showDismissed ? "rgba(52,211,153,0.85)" : "rgba(148,163,184,0.35)" }} />
                          <span className="text-[6px] font-bold text-white/75">Show Dismissed Insights</span>
                        </button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="px-3 py-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                    className="w-full py-2 rounded-lg text-[8px] font-bold text-white/90 uppercase tracking-wider flex items-center justify-center gap-1.5"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
                      border: "1px solid rgba(139,92,246,0.35)",
                      boxShadow: "0 4px 16px rgba(139,92,246,0.18)",
                    }}>
                    <Check className="w-3 h-3" /> Done
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ══════════════════════════════════════════════════════════════════
// SYSTEM J: RECENT SESSIONS (History Integration)
// ══════════════════════════════════════════════════════════════════

function RecentSessionsModule() {
  const sessions = [
    { name: "NY Session Live Trading", date: "Today", pnl: "+$1,120", winRate: 75, trades: 4, status: "won" as const },
    { name: "Asian Session Scalps", date: "Yesterday", pnl: "+$2,480", winRate: 100, trades: 3, status: "won" as const },
    { name: "Consolidation Analysis", date: "Apr 12", pnl: "$0", winRate: 0, trades: 0, status: "neutral" as const },
    { name: "Reversal Day", date: "Apr 11", pnl: "-$680", winRate: 25, trades: 4, status: "lost" as const },
    { name: "Power Hour Perfect", date: "Apr 10", pnl: "+$3,200", winRate: 100, trades: 2, status: "won" as const },
  ]
  const statusColors = { won: "16,185,129", lost: "239,68,68", neutral: "148,163,184" }

  return (
    <GlassCard delay={0.6} accent="56,189,248" glowIntensity={0.03}>
      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-sky-400/60" />
            <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Recent Sessions</span>
          </div>
          <button className="flex items-center gap-0.5 text-[6px] font-bold text-sky-400/50 hover:text-sky-400/80 transition-colors">
            View History <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="space-y-1">
          {sessions.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05, ease: EASE_ARR }}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-all cursor-pointer group"
              style={{ borderBottom: i < sessions.length - 1 ? "1px solid rgba(255,255,255,0.02)" : "none" }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `rgba(${statusColors[s.status]},0.7)` }} />
              <div className="flex-1 min-w-0">
                <span className="text-[7px] font-bold text-white/70 truncate block">{s.name}</span>
                <span className="text-[5px] text-slate-500/35">{s.date}</span>
              </div>
              <span className="text-[7px] font-mono font-bold" style={{
                color: s.pnl.startsWith("+") ? "rgba(52,211,153,0.8)" : s.pnl.startsWith("-") ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.5)"
              }}>{s.pnl}</span>
              <ChevronRight className="w-2.5 h-2.5 text-slate-700/30 group-hover:text-slate-400/50 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD — ALL SYSTEMS ASSEMBLED
// ══════════════════════════════════════════════════════════════════

export function LiveCallsDashboard() {
  const [period, setPeriod] = useState<TimePeriod>("7d")
  const [comparisonOn, setComparisonOn] = useState(false)
  const [viewMode, setViewMode] = useState<"mentor" | "public">("mentor")
  const [customizeOpen, setCustomizeOpen] = useState(false)

  const m = METRICS[period]
  const prevM = METRICS[PREV_PERIOD[period]]
  const curveData = PNL_CURVE[period]

  // Calculate trend deltas (System B — computed, not hardcoded)
  const calcDelta = useCallback((current: number, previous: number) => {
    if (previous === 0) return { value: "N/A", trend: "neutral" as const }
    const delta = ((current - previous) / previous) * 100
    return {
      value: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`,
      trend: delta > 1 ? "up" as const : delta < -1 ? "down" as const : "neutral" as const,
    }
  }, [])

  const pnlDelta = useMemo(() => calcDelta(m.netPnlValue, prevM.netPnlValue), [m, prevM, calcDelta])
  const wrDelta = useMemo(() => calcDelta(m.overallWinRate, prevM.overallWinRate), [m, prevM, calcDelta])
  const sessDelta = useMemo(() => {
    const d = m.totalSessions - prevM.totalSessions
    return { value: `${d >= 0 ? "+" : ""}${d}`, trend: d > 0 ? "up" as const : d < 0 ? "down" as const : "neutral" as const }
  }, [m, prevM])
  const viewersDelta = useMemo(() => calcDelta(m.peakAudience, prevM.peakAudience), [m, prevM, calcDelta])

  return (
    <div className="relative h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(8,10,18,1) 0%, rgba(6,8,14,1) 100%)" }}>
      <ParticleField accent="139,92,246" />

      {/* System A: Header */}
      <DashboardHeader period={period} setPeriod={setPeriod} comparisonOn={comparisonOn} setComparisonOn={setComparisonOn}
        viewMode={viewMode} setViewMode={setViewMode} setCustomizeOpen={setCustomizeOpen} m={m} />

      {/* Scrollable content */}
      <ScrollArea className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={period} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="p-4 space-y-3">

            {/* System B: Hero KPIs — 4 cards with computed trends + confidence */}
            <div className="grid grid-cols-4 gap-2.5">
              <HeroMetric label="Net P&L" value={m.netPnl} trend={pnlDelta.trend} trendValue={pnlDelta.value}
                icon={TrendingUp} accent="16,185,129" index={0} sessions={m.totalSessions}
                tooltip={`Net P&L of ${m.netPnl} across ${m.totalSessions} sessions (${m.totalTrades} trades). Avg session P&L: $${Math.round(m.netPnlValue / m.totalSessions).toLocaleString()}. Expectancy: $${m.expectancy.toFixed(0)}/trade.`} />
              <HeroMetric label="Win Rate" value={`${m.overallWinRate}`} suffix="%" trend={wrDelta.trend} trendValue={wrDelta.value}
                icon={Target} accent="56,189,248" index={1} sessions={m.totalTrades}
                tooltip={`${m.overallWinRate}% win rate on ${m.totalTrades} trades (${m.totalWins}W / ${m.totalLosses}L). Avg Win: $${m.avgWin}, Avg Loss: $${m.avgLoss}. Sample confidence: ${m.totalTrades >= 50 ? "High" : m.totalTrades >= 15 ? "Medium" : "Low"}.`} />
              <HeroMetric label="Sessions" value={`${m.totalSessions}`} trend={sessDelta.trend} trendValue={sessDelta.value}
                icon={Radio} accent="245,158,11" index={2}
                tooltip={`${m.totalSessions} sessions completed. Avg duration: ${m.avgSessionDuration}. ${m.profitableSessions} profitable, ${m.lossSessions} losing, ${m.breakevenSessions} breakeven.`} />
              <HeroMetric label="Peak Viewers" value={m.peakAudience.toLocaleString()} trend={viewersDelta.trend} trendValue={viewersDelta.value}
                icon={Users} accent="139,92,246" index={3}
                tooltip={`Peak audience: ${m.peakAudience.toLocaleString()}. Avg active: ${m.avgAudience.toLocaleString()}. Audience retention: ${m.audienceRetention}%. Engagement quality: ${m.engagementQuality}/100.`} />
            </div>

            {/* Sub-stats strip with trends */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.035)" }}>
              {[
                { label: "Profit Factor", value: m.profitFactor.toFixed(1), color: "16,185,129", prev: prevM.profitFactor },
                { label: "Expectancy", value: `$${m.expectancy.toFixed(0)}`, color: "52,211,153", prev: prevM.expectancy },
                { label: "Avg R:R", value: m.avgRR, color: "56,189,248", prev: 0 },
                { label: "Max DD", value: `-$${m.maxDrawdown.toLocaleString()}`, color: "239,68,68", prev: prevM.maxDrawdown },
                { label: "Win Streak", value: `${m.longestStreak}`, color: "245,158,11", prev: prevM.longestStreak },
              ].map((stat, i) => {
                const delta = stat.prev && typeof stat.prev === "number" && stat.label !== "Avg R:R"
                  ? (stat.label === "Max DD" ? (stat.prev > m.maxDrawdown ? "up" : "down") : (Number(stat.value.replace(/[^0-9.-]/g, "")) > stat.prev ? "up" : "down"))
                  : "neutral"
                return (
                  <React.Fragment key={stat.label}>
                    {i > 0 && <div className="w-px h-4 bg-white/[0.04]" />}
                    <div className="flex items-center gap-1 flex-1 justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[5px] uppercase tracking-[0.12em] text-slate-500/40">{stat.label}</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${stat.color},0.8)` }}>{stat.value}</span>
                          {comparisonOn && delta !== "neutral" && (
                            delta === "up"
                              ? <ArrowUpRight className="w-2 h-2 text-emerald-400/50" />
                              : <ArrowDownRight className="w-2 h-2 text-red-400/50" />
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </motion.div>

            {/* System C + D: P&L Chart + Session Outcomes */}
            <div className="grid grid-cols-5 gap-2.5">
              <div className="col-span-3">
                <PnLPerformanceModule data={curveData} period={period} m={m} comparisonOn={comparisonOn} />
              </div>
              <div className="col-span-2">
                <SessionOutcomesModule m={m} />
              </div>
            </div>

            {/* System E + D: Instruments + Session Types */}
            <div className="grid grid-cols-5 gap-2.5">
              <div className="col-span-3">
                <InstrumentModule />
              </div>
              <div className="col-span-2">
                <SessionTypesModule />
              </div>
            </div>

            {/* System F: Heatmap + Audience */}
            <div className="grid grid-cols-2 gap-2.5">
              <GlassCard delay={0.45} accent="139,92,246" glowIntensity={0.03}>
                <div className="px-3.5 pt-3 pb-2.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-violet-400/60" />
                      <span className="text-[9px] font-bold text-white/75 uppercase tracking-wider">Weekly Activity</span>
                    </div>
                    <span className="text-[6px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.07)", color: "rgba(167,139,250,0.55)" }}>This Week</span>
                  </div>
                  <WeeklyHeatmap data={WEEKLY_HEATMAP} />
                </div>
              </GlassCard>
              <AudienceEngagementModule />
            </div>

            {/* System H: AI Copilot — promoted higher */}
            <AICopilotModule />

            {/* System G + J: Contributors + Recent Sessions */}
            <div className="grid grid-cols-2 gap-2.5">
              <ContributorsModule />
              <RecentSessionsModule />
            </div>

            {/* System I: Mentor Performance — full width hero */}
            {viewMode === "mentor" && <MentorPerformanceModule m={m} />}

            <div className="h-2" />
          </motion.div>
        </AnimatePresence>
      </ScrollArea>

      {/* System K: Customize panel overlay */}
      <CustomizePanel open={customizeOpen} onClose={() => setCustomizeOpen(false)} />
    </div>
  )
}
