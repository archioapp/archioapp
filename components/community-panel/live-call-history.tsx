"use client"

import React, { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  Crown,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  BarChart3,
  Flame,
  Eye,
  Crosshair,
  Zap,
  Radio,
  Layers,
  Shield,
  ArrowRightLeft,
  LogIn,
  LogOut,
  ShieldAlert,
  Milestone,
  Timer,
  CircleArrowUp,
  CircleArrowDown,
  FileText,
  Signal,
  Activity,
  X,
  Minus,
  ArrowUpDown,
} from "lucide-react"

// ══════════════════════════════════════════════════════════════════
// CONSTANTS + ANIMATION
// ══════════════════════════════════════════════════════════════════

const EASE_PREMIUM = [0.22, 0.68, 0.36, 1] as const

// ══════════════════════════════════════════════════════════════════
// DATA TYPES (mirrors mentor-stage.tsx SessionEvent contracts)
// ══════════════════════════════════════════════════════════════════

type SessionEventType =
  | "entry" | "exit" | "bias-shift" | "focus-change"
  | "thesis-update" | "level-call" | "warning" | "mode-change"
  | "key-moment" | "audience-milestone" | "system"

type SessionPhase = "observation" | "setup" | "execution" | "review"

interface SessionEvent {
  id: string
  type: SessionEventType
  timestamp: string
  elapsedAt: string
  description: string
  instrument?: string
  direction?: "bullish" | "bearish" | "neutral"
  importance: 1 | 2 | 3 | 4 | 5
  pnl?: string
  previousValue?: string
  newValue?: string
  mentorTriggered: boolean
  roomReaction?: number
  details?: { label: string; value: string }[]
  phase: SessionPhase
}

interface TradeRecord {
  id: string
  instrument: string
  direction: "bullish" | "bearish"
  entryPrice: string
  exitPrice: string
  pnl: string
  rr: string
  entryTime: string
  exitTime: string
  outcome: "win" | "loss" | "breakeven"
  notes: string
}

type SessionOutcome = "profitable" | "loss" | "breakeven"

interface PastSession {
  id: string
  name: string
  mentor: string
  mentorInitials: string
  mentorGradient: string
  date: string
  dayOfWeek: string
  startTime: string
  endTime: string
  duration: string
  instruments: string[]
  sessionType: string
  outcome: SessionOutcome
  netPnl: string
  tradesExecuted: number
  tradeRecords: TradeRecord[]
  winRate: number
  peakAudience: number
  avgEngagement: string
  totalEvents: number
  keyMomentsCount: number
  phases: { phase: SessionPhase; startedAt: string; duration: string }[]
  events: SessionEvent[]
  highlights: string[]
  tags: string[]
}

// ══════════════════════════════════════════════════════════════════
// SESSION EVENT VISUAL CONFIG
// ══════════════════════════════════════════════════════════════════

const SESSION_EVENT_CONFIG: Record<SessionEventType, { icon: typeof Flame; color: string; accent: string; label: string }> = {
  entry:              { icon: LogIn,         color: "16,185,129",  accent: "52,211,153",  label: "Entry" },
  exit:               { icon: LogOut,        color: "56,189,248",  accent: "125,211,252", label: "Exit" },
  "bias-shift":       { icon: ArrowRightLeft, color: "245,158,11", accent: "251,191,36",  label: "Bias Shift" },
  "focus-change":     { icon: Crosshair,     color: "139,92,246",  accent: "167,139,250", label: "Focus Change" },
  "thesis-update":    { icon: FileText,      color: "56,189,248",  accent: "125,211,252", label: "Thesis Update" },
  "level-call":       { icon: Target,        color: "239,68,68",   accent: "248,113,113", label: "Level Call" },
  warning:            { icon: ShieldAlert,   color: "245,158,11",  accent: "251,191,36",  label: "Warning" },
  "mode-change":      { icon: Layers,        color: "139,92,246",  accent: "167,139,250", label: "Mode Change" },
  "key-moment":       { icon: Milestone,     color: "239,68,68",   accent: "248,113,113", label: "Key Moment" },
  "audience-milestone": { icon: Users,       color: "52,211,153",  accent: "110,231,183", label: "Milestone" },
  system:             { icon: Radio,         color: "148,163,184", accent: "203,213,225", label: "System" },
}

// ══════════════════════════════════════════════════════════════════
// MOCK PAST SESSIONS DATA (7 sessions)
// ══════════════════════════════════════════════════════════════════

const PAST_SESSIONS: PastSession[] = [
  {
    id: "ps-1",
    name: "NY Session Live Trading",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 14, 2026",
    dayOfWeek: "Tuesday",
    startTime: "2:00 PM",
    endTime: "3:15 PM",
    duration: "1h 15m",
    instruments: ["XAU/USD", "EUR/USD"],
    sessionType: "Live Trading",
    outcome: "profitable",
    netPnl: "+$2,480",
    tradesExecuted: 3,
    tradeRecords: [
      { id: "tr-1a", instrument: "XAU/USD", direction: "bullish", entryPrice: "2034.20", exitPrice: "2042.00", pnl: "+$1,950", rr: "1:3.2", entryTime: "2:39 PM", exitTime: "3:02 PM", outcome: "win", notes: "Sweep + displacement at 2035 level" },
      { id: "tr-1b", instrument: "EUR/USD", direction: "bearish", entryPrice: "1.0852", exitPrice: "1.0838", pnl: "+$530", rr: "1:1.8", entryTime: "2:48 PM", exitTime: "3:05 PM", outcome: "win", notes: "Rejection at 1.0870 supply zone" },
      { id: "tr-1c", instrument: "XAU/USD", direction: "bullish", entryPrice: "2040.50", exitPrice: "2039.80", pnl: "-$140", rr: "—", entryTime: "3:08 PM", exitTime: "3:10 PM", outcome: "loss", notes: "Re-entry stopped out at FOMC spike" },
    ],
    winRate: 67,
    peakAudience: 847,
    avgEngagement: "Very High",
    totalEvents: 18,
    keyMomentsCount: 5,
    phases: [
      { phase: "observation", startedAt: "2:00 PM", duration: "12m" },
      { phase: "setup", startedAt: "2:12 PM", duration: "16m" },
      { phase: "execution", startedAt: "2:28 PM", duration: "42m" },
      { phase: "review", startedAt: "3:10 PM", duration: "5m" },
    ],
    events: [
      { id: "e1-1", type: "system", timestamp: "2:00 PM", elapsedAt: "0m", description: "Session opened — NY Session Live Trading", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e1-2", type: "thesis-update", timestamp: "2:08 PM", elapsedAt: "8m", description: "Gold sweep at 2035 for longs — bullish thesis", instrument: "XAU/USD", direction: "bullish", importance: 4, mentorTriggered: true, phase: "observation", roomReaction: 34 },
      { id: "e1-3", type: "level-call", timestamp: "2:10 PM", elapsedAt: "10m", description: "Key level: 2035.50 sweep zone identified", instrument: "XAU/USD", importance: 4, mentorTriggered: true, phase: "observation", roomReaction: 28 },
      { id: "e1-4", type: "warning", timestamp: "2:15 PM", elapsedAt: "15m", description: "FOMC in 2h — reduce position size to 50%", importance: 4, mentorTriggered: true, phase: "setup", roomReaction: 19 },
      { id: "e1-5", type: "key-moment", timestamp: "2:28 PM", elapsedAt: "28m", description: "Delta divergence on Gold 15m — institutional accumulation confirmed", instrument: "XAU/USD", importance: 5, mentorTriggered: true, phase: "setup", roomReaction: 42 },
      { id: "e1-6", type: "entry", timestamp: "2:39 PM", elapsedAt: "39m", description: "Entry LIVE — Gold long at 2034.20, target 2042, stop 2028", instrument: "XAU/USD", direction: "bullish", importance: 5, mentorTriggered: true, phase: "execution", roomReaction: 63, pnl: "+$1,950", details: [{ label: "R:R", value: "1:3.2" }] },
      { id: "e1-7", type: "entry", timestamp: "2:48 PM", elapsedAt: "48m", description: "Entry — EUR/USD short at 1.0852", instrument: "EUR/USD", direction: "bearish", importance: 4, mentorTriggered: true, phase: "execution", roomReaction: 31 },
      { id: "e1-8", type: "exit", timestamp: "3:02 PM", elapsedAt: "62m", description: "Gold TP hit at 2042.00 — full target reached", instrument: "XAU/USD", importance: 5, mentorTriggered: true, phase: "execution", pnl: "+$1,950", roomReaction: 52 },
      { id: "e1-9", type: "exit", timestamp: "3:05 PM", elapsedAt: "65m", description: "EUR/USD closed at 1.0838 — partial TP", instrument: "EUR/USD", importance: 3, mentorTriggered: true, phase: "execution", pnl: "+$530" },
      { id: "e1-10", type: "system", timestamp: "3:15 PM", elapsedAt: "75m", description: "Session closed — Net P&L: +$2,480", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "Gold sweep thesis played out perfectly at 2035 level",
      "Delta divergence correctly predicted institutional accumulation",
      "FOMC risk management prevented overexposure",
    ],
    tags: ["gold", "sweep", "institutional-flow", "fomc", "high-conviction"],
  },
  {
    id: "ps-2",
    name: "London Open Scalping",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 13, 2026",
    dayOfWeek: "Monday",
    startTime: "8:00 AM",
    endTime: "9:45 AM",
    duration: "1h 45m",
    instruments: ["GBP/USD", "EUR/GBP", "XAU/USD"],
    sessionType: "Scalping",
    outcome: "profitable",
    netPnl: "+$1,120",
    tradesExecuted: 5,
    tradeRecords: [
      { id: "tr-2a", instrument: "GBP/USD", direction: "bullish", entryPrice: "1.2945", exitPrice: "1.2968", pnl: "+$460", rr: "1:2.3", entryTime: "8:22 AM", exitTime: "8:38 AM", outcome: "win", notes: "London open breakout" },
      { id: "tr-2b", instrument: "EUR/GBP", direction: "bearish", entryPrice: "0.8565", exitPrice: "0.8548", pnl: "+$340", rr: "1:1.7", entryTime: "8:31 AM", exitTime: "8:52 AM", outcome: "win", notes: "Correlation play with GBP strength" },
      { id: "tr-2c", instrument: "GBP/USD", direction: "bullish", entryPrice: "1.2972", exitPrice: "1.2965", pnl: "-$140", rr: "—", entryTime: "9:05 AM", exitTime: "9:08 AM", outcome: "loss", notes: "Re-entry failed at resistance" },
      { id: "tr-2d", instrument: "XAU/USD", direction: "bullish", entryPrice: "2028.50", exitPrice: "2033.20", pnl: "+$590", rr: "1:2.8", entryTime: "9:12 AM", exitTime: "9:28 AM", outcome: "win", notes: "Gold bounce at Asian low" },
      { id: "tr-2e", instrument: "GBP/USD", direction: "bearish", entryPrice: "1.2980", exitPrice: "1.2975", pnl: "-$130", rr: "—", entryTime: "9:35 AM", exitTime: "9:38 AM", outcome: "loss", notes: "Reversal attempt stopped" },
    ],
    winRate: 60,
    peakAudience: 612,
    avgEngagement: "High",
    totalEvents: 22,
    keyMomentsCount: 4,
    phases: [
      { phase: "observation", startedAt: "8:00 AM", duration: "15m" },
      { phase: "setup", startedAt: "8:15 AM", duration: "5m" },
      { phase: "execution", startedAt: "8:20 AM", duration: "1h 15m" },
      { phase: "review", startedAt: "9:35 AM", duration: "10m" },
    ],
    events: [
      { id: "e2-1", type: "system", timestamp: "8:00 AM", elapsedAt: "0m", description: "Session opened — London Open Scalping", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e2-2", type: "focus-change", timestamp: "8:05 AM", elapsedAt: "5m", description: "Focus: GBP/USD, EUR/GBP correlation pair", instrument: "GBP/USD", importance: 3, mentorTriggered: true, phase: "observation" },
      { id: "e2-3", type: "key-moment", timestamp: "8:20 AM", elapsedAt: "20m", description: "London open breakout confirmed — GBP strength", instrument: "GBP/USD", direction: "bullish", importance: 5, mentorTriggered: true, phase: "execution", roomReaction: 38 },
      { id: "e2-4", type: "entry", timestamp: "8:22 AM", elapsedAt: "22m", description: "Entry — GBP/USD long at 1.2945", instrument: "GBP/USD", direction: "bullish", importance: 4, mentorTriggered: true, phase: "execution", roomReaction: 29 },
      { id: "e2-5", type: "entry", timestamp: "8:31 AM", elapsedAt: "31m", description: "Entry — EUR/GBP short at 0.8565 (correlation)", instrument: "EUR/GBP", direction: "bearish", importance: 3, mentorTriggered: true, phase: "execution" },
      { id: "e2-6", type: "exit", timestamp: "8:38 AM", elapsedAt: "38m", description: "GBP/USD TP hit at 1.2968", instrument: "GBP/USD", importance: 4, mentorTriggered: true, phase: "execution", pnl: "+$460" },
      { id: "e2-7", type: "system", timestamp: "9:45 AM", elapsedAt: "105m", description: "Session closed — Net P&L: +$1,120", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "London open breakout captured cleanly on GBP/USD",
      "Correlation play between GBP/USD and EUR/GBP worked well",
      "Gold Asian low bounce was an opportunistic add-on",
    ],
    tags: ["london-open", "scalping", "correlation", "gbp", "gold"],
  },
  {
    id: "ps-3",
    name: "Pre-NFP Analysis",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 11, 2026",
    dayOfWeek: "Saturday",
    startTime: "12:00 PM",
    endTime: "1:30 PM",
    duration: "1h 30m",
    instruments: ["XAU/USD", "DXY", "US10Y"],
    sessionType: "Analysis",
    outcome: "breakeven",
    netPnl: "$0",
    tradesExecuted: 0,
    tradeRecords: [],
    winRate: 0,
    peakAudience: 534,
    avgEngagement: "Medium",
    totalEvents: 12,
    keyMomentsCount: 3,
    phases: [
      { phase: "observation", startedAt: "12:00 PM", duration: "45m" },
      { phase: "setup", startedAt: "12:45 PM", duration: "30m" },
      { phase: "review", startedAt: "1:15 PM", duration: "15m" },
    ],
    events: [
      { id: "e3-1", type: "system", timestamp: "12:00 PM", elapsedAt: "0m", description: "Session opened — Pre-NFP Analysis", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e3-2", type: "thesis-update", timestamp: "12:15 PM", elapsedAt: "15m", description: "NFP scenario mapping: above 200K bearish Gold, below 150K bullish", importance: 5, mentorTriggered: true, phase: "observation", roomReaction: 45 },
      { id: "e3-3", type: "level-call", timestamp: "12:30 PM", elapsedAt: "30m", description: "Pre-NFP zones: Gold 2025-2030 buy zone, 2045-2050 sell zone", instrument: "XAU/USD", importance: 4, mentorTriggered: true, phase: "observation", roomReaction: 38 },
      { id: "e3-4", type: "warning", timestamp: "12:45 PM", elapsedAt: "45m", description: "No positions into NFP — sit on hands, wait for reaction", importance: 5, mentorTriggered: true, phase: "setup", roomReaction: 52 },
      { id: "e3-5", type: "system", timestamp: "1:30 PM", elapsedAt: "90m", description: "Session closed — analysis complete, no trades", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "Comprehensive NFP scenario mapping with clear levels",
      "Disciplined approach — no trades before high-impact news",
      "Pre-positioned audience with clear action plans for Friday",
    ],
    tags: ["nfp", "analysis", "macro", "preparation", "no-trade"],
  },
  {
    id: "ps-4",
    name: "Asian Session Opportunity",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 10, 2026",
    dayOfWeek: "Friday",
    startTime: "11:00 PM",
    endTime: "12:30 AM",
    duration: "1h 30m",
    instruments: ["USD/JPY", "AUD/USD", "NZD/USD"],
    sessionType: "Live Trading",
    outcome: "loss",
    netPnl: "-$380",
    tradesExecuted: 2,
    tradeRecords: [
      { id: "tr-4a", instrument: "USD/JPY", direction: "bearish", entryPrice: "151.85", exitPrice: "152.10", pnl: "-$500", rr: "—", entryTime: "11:32 PM", exitTime: "11:48 PM", outcome: "loss", notes: "BOJ intervention fakeout" },
      { id: "tr-4b", instrument: "AUD/USD", direction: "bullish", entryPrice: "0.6628", exitPrice: "0.6640", pnl: "+$120", rr: "1:1.2", entryTime: "12:05 AM", exitTime: "12:18 AM", outcome: "win", notes: "Risk-on bounce at support" },
    ],
    winRate: 50,
    peakAudience: 298,
    avgEngagement: "Medium",
    totalEvents: 14,
    keyMomentsCount: 3,
    phases: [
      { phase: "observation", startedAt: "11:00 PM", duration: "20m" },
      { phase: "setup", startedAt: "11:20 PM", duration: "10m" },
      { phase: "execution", startedAt: "11:30 PM", duration: "50m" },
      { phase: "review", startedAt: "12:20 AM", duration: "10m" },
    ],
    events: [
      { id: "e4-1", type: "system", timestamp: "11:00 PM", elapsedAt: "0m", description: "Session opened — Asian Session Opportunity", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e4-2", type: "warning", timestamp: "11:15 PM", elapsedAt: "15m", description: "BOJ rhetoric risk — JPY pairs may spike", importance: 4, mentorTriggered: true, phase: "observation", roomReaction: 22 },
      { id: "e4-3", type: "entry", timestamp: "11:32 PM", elapsedAt: "32m", description: "Entry — USD/JPY short at 151.85", instrument: "USD/JPY", direction: "bearish", importance: 4, mentorTriggered: true, phase: "execution", roomReaction: 18 },
      { id: "e4-4", type: "exit", timestamp: "11:48 PM", elapsedAt: "48m", description: "Stopped out USD/JPY at 152.10 — BOJ fakeout", instrument: "USD/JPY", importance: 4, mentorTriggered: true, phase: "execution", pnl: "-$500", roomReaction: 35 },
      { id: "e4-5", type: "bias-shift", timestamp: "12:00 AM", elapsedAt: "60m", description: "Bias shifted from JPY strength to risk-on AUD play", previousValue: "JPY bearish", newValue: "AUD bullish", importance: 3, mentorTriggered: true, phase: "execution" },
      { id: "e4-6", type: "system", timestamp: "12:30 AM", elapsedAt: "90m", description: "Session closed — Net P&L: -$380", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "BOJ intervention risk materialized as a fakeout",
      "Quick pivot to AUD recovered partial losses",
      "Key lesson: size down on JPY during BOJ risk windows",
    ],
    tags: ["asian-session", "jpy", "boj", "risk-management", "recovery"],
  },
  {
    id: "ps-5",
    name: "NY Power Hour",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 9, 2026",
    dayOfWeek: "Thursday",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    duration: "1h",
    instruments: ["XAU/USD", "S&P 500"],
    sessionType: "Live Trading",
    outcome: "profitable",
    netPnl: "+$3,150",
    tradesExecuted: 2,
    tradeRecords: [
      { id: "tr-5a", instrument: "XAU/USD", direction: "bearish", entryPrice: "2048.30", exitPrice: "2038.50", pnl: "+$2,450", rr: "1:4.1", entryTime: "3:12 PM", exitTime: "3:42 PM", outcome: "win", notes: "Short from premium zone into close" },
      { id: "tr-5b", instrument: "XAU/USD", direction: "bullish", entryPrice: "2037.80", exitPrice: "2041.30", pnl: "+$700", rr: "1:1.8", entryTime: "3:45 PM", exitTime: "3:55 PM", outcome: "win", notes: "Bounce play at discount zone" },
    ],
    winRate: 100,
    peakAudience: 923,
    avgEngagement: "Peak",
    totalEvents: 11,
    keyMomentsCount: 4,
    phases: [
      { phase: "observation", startedAt: "3:00 PM", duration: "8m" },
      { phase: "execution", startedAt: "3:08 PM", duration: "48m" },
      { phase: "review", startedAt: "3:56 PM", duration: "4m" },
    ],
    events: [
      { id: "e5-1", type: "system", timestamp: "3:00 PM", elapsedAt: "0m", description: "Session opened — NY Power Hour", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e5-2", type: "key-moment", timestamp: "3:08 PM", elapsedAt: "8m", description: "Gold at premium zone 2048 — reversal pattern forming", instrument: "XAU/USD", direction: "bearish", importance: 5, mentorTriggered: true, phase: "observation", roomReaction: 55 },
      { id: "e5-3", type: "entry", timestamp: "3:12 PM", elapsedAt: "12m", description: "Entry — Gold short at 2048.30 targeting 2038", instrument: "XAU/USD", direction: "bearish", importance: 5, mentorTriggered: true, phase: "execution", roomReaction: 68, details: [{ label: "R:R", value: "1:4.1" }] },
      { id: "e5-4", type: "exit", timestamp: "3:42 PM", elapsedAt: "42m", description: "Full TP — Gold hit 2038.50, +$2,450", instrument: "XAU/USD", importance: 5, mentorTriggered: true, phase: "execution", pnl: "+$2,450", roomReaction: 72 },
      { id: "e5-5", type: "entry", timestamp: "3:45 PM", elapsedAt: "45m", description: "Counter-trade — Gold long at 2037.80 for bounce", instrument: "XAU/USD", direction: "bullish", importance: 3, mentorTriggered: true, phase: "execution", roomReaction: 34 },
      { id: "e5-6", type: "exit", timestamp: "3:55 PM", elapsedAt: "55m", description: "Closed bounce trade at 2041.30, +$700", instrument: "XAU/USD", importance: 3, mentorTriggered: true, phase: "execution", pnl: "+$700" },
      { id: "e5-7", type: "system", timestamp: "4:00 PM", elapsedAt: "60m", description: "Session closed — Net P&L: +$3,150 (100% win rate)", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "Perfect session — 100% win rate with +$3,150",
      "Counter-trade from short to long showed elite adaptability",
      "Peak audience at 923 viewers during the Gold short",
    ],
    tags: ["power-hour", "gold", "perfect-session", "high-rr", "counter-trade"],
  },
  {
    id: "ps-6",
    name: "CPI Release Trading",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 8, 2026",
    dayOfWeek: "Wednesday",
    startTime: "8:15 AM",
    endTime: "10:00 AM",
    duration: "1h 45m",
    instruments: ["XAU/USD", "EUR/USD", "DXY"],
    sessionType: "News Trading",
    outcome: "profitable",
    netPnl: "+$1,870",
    tradesExecuted: 3,
    tradeRecords: [
      { id: "tr-6a", instrument: "XAU/USD", direction: "bullish", entryPrice: "2022.50", exitPrice: "2031.80", pnl: "+$1,860", rr: "1:3.5", entryTime: "8:38 AM", exitTime: "9:15 AM", outcome: "win", notes: "CPI miss drove Gold bid" },
      { id: "tr-6b", instrument: "EUR/USD", direction: "bullish", entryPrice: "1.0812", exitPrice: "1.0835", pnl: "+$460", rr: "1:2.3", entryTime: "8:42 AM", exitTime: "9:20 AM", outcome: "win", notes: "DXY weakness correlation" },
      { id: "tr-6c", instrument: "XAU/USD", direction: "bullish", entryPrice: "2033.40", exitPrice: "2030.80", pnl: "-$450", rr: "—", entryTime: "9:30 AM", exitTime: "9:38 AM", outcome: "loss", notes: "Overextended re-entry stopped" },
    ],
    winRate: 67,
    peakAudience: 1042,
    avgEngagement: "Peak",
    totalEvents: 19,
    keyMomentsCount: 6,
    phases: [
      { phase: "observation", startedAt: "8:15 AM", duration: "15m" },
      { phase: "setup", startedAt: "8:30 AM", duration: "5m" },
      { phase: "execution", startedAt: "8:35 AM", duration: "55m" },
      { phase: "review", startedAt: "9:30 AM", duration: "30m" },
    ],
    events: [
      { id: "e6-1", type: "system", timestamp: "8:15 AM", elapsedAt: "0m", description: "Session opened — CPI Release Trading", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e6-2", type: "warning", timestamp: "8:25 AM", elapsedAt: "10m", description: "CPI in 5 minutes — no positions, watch for spike", importance: 5, mentorTriggered: true, phase: "observation", roomReaction: 68 },
      { id: "e6-3", type: "key-moment", timestamp: "8:30 AM", elapsedAt: "15m", description: "CPI prints below consensus — Gold bid, DXY dropping", importance: 5, mentorTriggered: true, phase: "setup", roomReaction: 82 },
      { id: "e6-4", type: "entry", timestamp: "8:38 AM", elapsedAt: "23m", description: "Entry — Gold long at 2022.50 after CPI reaction", instrument: "XAU/USD", direction: "bullish", importance: 5, mentorTriggered: true, phase: "execution", roomReaction: 74, details: [{ label: "R:R", value: "1:3.5" }] },
      { id: "e6-5", type: "exit", timestamp: "9:15 AM", elapsedAt: "60m", description: "Gold TP at 2031.80 — massive CPI move captured", instrument: "XAU/USD", importance: 5, mentorTriggered: true, phase: "execution", pnl: "+$1,860", roomReaction: 89 },
      { id: "e6-6", type: "system", timestamp: "10:00 AM", elapsedAt: "105m", description: "Session closed — Net P&L: +$1,870", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "CPI miss captured perfectly with immediate Gold entry",
      "Peak audience at 1,042 — highest engagement of the week",
      "Discipline to wait for CPI before entering paid off",
    ],
    tags: ["cpi", "news-trading", "gold", "macro", "high-impact"],
  },
  {
    id: "ps-7",
    name: "Tuesday Consolidation",
    mentor: "Mentor Alex",
    mentorInitials: "A",
    mentorGradient: "from-emerald-500 to-cyan-500",
    date: "Apr 7, 2026",
    dayOfWeek: "Tuesday",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    duration: "1h",
    instruments: ["XAU/USD", "EUR/USD"],
    sessionType: "Live Trading",
    outcome: "loss",
    netPnl: "-$620",
    tradesExecuted: 3,
    tradeRecords: [
      { id: "tr-7a", instrument: "XAU/USD", direction: "bullish", entryPrice: "2018.40", exitPrice: "2016.20", pnl: "-$440", rr: "—", entryTime: "2:25 PM", exitTime: "2:35 PM", outcome: "loss", notes: "False breakout in consolidation" },
      { id: "tr-7b", instrument: "EUR/USD", direction: "bearish", entryPrice: "1.0798", exitPrice: "1.0802", pnl: "-$80", rr: "—", entryTime: "2:40 PM", exitTime: "2:48 PM", outcome: "loss", notes: "Choppy price action, stopped" },
      { id: "tr-7c", instrument: "XAU/USD", direction: "bearish", entryPrice: "2019.50", exitPrice: "2017.60", pnl: "-$100", rr: "—", entryTime: "2:52 PM", exitTime: "2:58 PM", outcome: "loss", notes: "Reversal attempt in range" },
    ],
    winRate: 0,
    peakAudience: 478,
    avgEngagement: "Low",
    totalEvents: 15,
    keyMomentsCount: 2,
    phases: [
      { phase: "observation", startedAt: "2:00 PM", duration: "20m" },
      { phase: "execution", startedAt: "2:20 PM", duration: "35m" },
      { phase: "review", startedAt: "2:55 PM", duration: "5m" },
    ],
    events: [
      { id: "e7-1", type: "system", timestamp: "2:00 PM", elapsedAt: "0m", description: "Session opened — Tuesday Consolidation", importance: 2, mentorTriggered: false, phase: "observation" },
      { id: "e7-2", type: "warning", timestamp: "2:12 PM", elapsedAt: "12m", description: "Low volatility day — be cautious with size", importance: 3, mentorTriggered: true, phase: "observation" },
      { id: "e7-3", type: "entry", timestamp: "2:25 PM", elapsedAt: "25m", description: "Entry — Gold long at 2018.40 (breakout attempt)", instrument: "XAU/USD", direction: "bullish", importance: 3, mentorTriggered: true, phase: "execution" },
      { id: "e7-4", type: "exit", timestamp: "2:35 PM", elapsedAt: "35m", description: "Stopped — false breakout in consolidation", instrument: "XAU/USD", importance: 3, mentorTriggered: true, phase: "execution", pnl: "-$440" },
      { id: "e7-5", type: "key-moment", timestamp: "2:55 PM", elapsedAt: "55m", description: "Lesson: avoid trading consolidation ranges without clear displacement", importance: 4, mentorTriggered: true, phase: "review", roomReaction: 28 },
      { id: "e7-6", type: "system", timestamp: "3:00 PM", elapsedAt: "60m", description: "Session closed — Net P&L: -$620 (3 losses)", importance: 2, mentorTriggered: false, phase: "review" },
    ],
    highlights: [
      "All 3 trades were losses in a consolidation environment",
      "Key lesson identified: avoid choppy consolidation",
      "Transparent about losses — valuable educational session",
    ],
    tags: ["consolidation", "losing-day", "lesson", "discipline", "range"],
  },
]

// ══════════════════════════════════════════════════════════════════
// FILTER / SORT TYPES
// ══════════════════════════════════════════════════════════════════

type HistoryFilter = "all" | "profitable" | "loss" | "breakeven"
type HistorySort = "date" | "pnl" | "trades" | "audience"
type InstrumentFilter = "all" | string

// ══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════════

function SessionPhaseBar({ phases }: { phases: PastSession["phases"] }) {
  const phaseColors: Record<SessionPhase, string> = {
    observation: "148,163,184",
    setup: "56,189,248",
    execution: "16,185,129",
    review: "139,92,246",
  }
  const phaseLabels: Record<SessionPhase, string> = {
    observation: "OBS",
    setup: "SET",
    execution: "EXE",
    review: "REV",
  }

  return (
    <div className="flex items-center gap-0.5 w-full">
      {phases.map((p, i) => {
        const c = phaseColors[p.phase]
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full h-1 rounded-full" style={{ background: `rgba(${c},0.4)` }} />
            <span className="text-[5px] font-mono font-bold uppercase" style={{ color: `rgba(${c},0.55)` }}>
              {phaseLabels[p.phase]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function TradeRow({ trade }: { trade: TradeRecord }) {
  const isWin = trade.outcome === "win"
  const color = isWin ? "16,185,129" : "239,68,68"
  const accent = isWin ? "52,211,153" : "248,113,113"

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 hover:bg-white/[0.02]"
      style={{
        background: `rgba(${color},0.02)`,
        border: `1px solid rgba(${color},0.06)`,
      }}>
      {/* Direction chip */}
      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{
          background: `rgba(${color},0.1)`,
          border: `1px solid rgba(${color},0.15)`,
        }}>
        {trade.direction === "bullish"
          ? <CircleArrowUp className="w-2.5 h-2.5" style={{ color: `rgba(${accent},0.9)` }} />
          : <CircleArrowDown className="w-2.5 h-2.5" style={{ color: `rgba(${accent},0.9)` }} />
        }
      </div>

      {/* Instrument + times */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono font-bold text-white/75">{trade.instrument}</span>
          <span className="text-[7px] uppercase font-bold tracking-wider"
            style={{ color: `rgba(${accent},0.7)` }}>
            {trade.direction === "bullish" ? "Long" : "Short"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[7px] font-mono text-slate-400/45">{trade.entryPrice}</span>
          <ArrowRightLeft className="w-2 h-2 text-slate-500/30" />
          <span className="text-[7px] font-mono text-slate-400/45">{trade.exitPrice}</span>
        </div>
      </div>

      {/* R:R */}
      {trade.rr !== "—" && (
        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: "rgba(255,255,255,0.03)", color: "rgba(148,163,184,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
          {trade.rr}
        </span>
      )}

      {/* P&L */}
      <span className="text-[10px] font-mono font-bold flex-shrink-0"
        style={{ color: `rgba(${accent},0.9)` }}>
        {trade.pnl}
      </span>
    </div>
  )
}

function MiniTimelineEvent({ event }: { event: SessionEvent }) {
  const conf = SESSION_EVENT_CONFIG[event.type]
  const EventIcon = conf.icon
  const isHighImportance = event.importance >= 4

  return (
    <div className="flex items-start gap-2 group/tevt">
      {/* Time + connector */}
      <div className="flex flex-col items-center flex-shrink-0 w-8 pt-0.5">
        <span className="text-[6px] font-mono text-slate-500/40">{event.elapsedAt}</span>
        <div className="flex-1 w-px mt-0.5" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>

      {/* Icon node */}
      <div className="w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: `rgba(${conf.color},${isHighImportance ? "0.12" : "0.06"})`,
          border: `1px solid rgba(${conf.color},0.1)`,
        }}>
        <EventIcon className="w-2 h-2" style={{ color: `rgba(${conf.accent},${isHighImportance ? "0.9" : "0.6"})` }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-1.5">
        <p className={`text-[7px] leading-relaxed ${isHighImportance ? "text-white/65 font-medium" : "text-slate-300/50"}`}>
          {event.description}
        </p>
        {event.pnl && (
          <span className="text-[7px] font-mono font-bold"
            style={{ color: event.pnl.startsWith("+") ? "rgba(52,211,153,0.85)" : "rgba(248,113,113,0.85)" }}>
            {event.pnl}
          </span>
        )}
      </div>
    </div>
  )
}

function SessionDetailView({ session, onClose }: { session: PastSession; onClose: () => void }) {
  const [detailTab, setDetailTab] = useState<"trades" | "timeline" | "highlights">("trades")
  const outcomeColor = session.outcome === "profitable" ? "16,185,129" : session.outcome === "loss" ? "239,68,68" : "148,163,184"
  const outcomeAccent = session.outcome === "profitable" ? "52,211,153" : session.outcome === "loss" ? "248,113,113" : "203,213,225"

  const detailTabs: { key: typeof detailTab; label: string; count?: number }[] = [
    { key: "trades", label: "Trades", count: session.tradeRecords.length },
    { key: "timeline", label: "Timeline", count: session.events.length },
    { key: "highlights", label: "Highlights", count: session.highlights.length },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(10,11,16,0.98) 0%, rgba(15,16,22,0.95) 100%)",
        border: `1px solid rgba(${outcomeColor},0.12)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(${outcomeColor},0.03)`,
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid rgba(${outcomeColor},0.08)` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `rgba(${outcomeColor},0.1)`, border: `1px solid rgba(${outcomeColor},0.15)` }}>
            {session.outcome === "profitable"
              ? <TrendingUp className="w-4 h-4" style={{ color: `rgba(${outcomeAccent},0.9)` }} />
              : session.outcome === "loss"
              ? <TrendingDown className="w-4 h-4" style={{ color: `rgba(${outcomeAccent},0.9)` }} />
              : <Minus className="w-4 h-4" style={{ color: `rgba(${outcomeAccent},0.9)` }} />
            }
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-white/85">{session.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] font-mono text-slate-400/50">{session.date}</span>
              <span className="text-[8px] text-slate-500/35">|</span>
              <span className="text-[8px] text-slate-400/45">{session.startTime} - {session.endTime}</span>
              <span className="text-[8px] text-slate-500/35">|</span>
              <span className="text-[8px] font-mono" style={{ color: `rgba(${outcomeAccent},0.7)` }}>{session.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-mono font-bold"
            style={{ color: `rgba(${outcomeAccent},0.95)` }}>
            {session.netPnl}
          </span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.06]"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <X className="w-3 h-3 text-slate-400/50" />
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 py-2.5 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        {[
          { label: "Win Rate", value: session.tradesExecuted > 0 ? `${session.winRate}%` : "N/A", color: session.winRate >= 60 ? "52,211,153" : session.winRate >= 40 ? "251,191,36" : "248,113,113" },
          { label: "Trades", value: `${session.tradesExecuted}`, color: "148,163,184" },
          { label: "Peak", value: `${session.peakAudience}`, color: "167,139,250" },
          { label: "Events", value: `${session.totalEvents}`, color: "148,163,184" },
          { label: "Key", value: `${session.keyMomentsCount}`, color: "248,113,113" },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${stat.color},0.8)` }}>{stat.value}</span>
            <span className="text-[5px] uppercase tracking-wider text-slate-500/40 mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Phase bar */}
      <div className="px-4 py-2">
        <SessionPhaseBar phases={session.phases} />
      </div>

      {/* Instruments */}
      <div className="px-4 py-1.5 flex items-center gap-1.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        {session.instruments.map(inst => (
          <span key={inst} className="text-[7px] font-mono font-bold px-2 py-0.5 rounded-md"
            style={{
              background: "rgba(56,189,248,0.06)",
              color: "rgba(125,211,252,0.7)",
              border: "1px solid rgba(56,189,248,0.1)",
            }}>
            {inst}
          </span>
        ))}
        <span className="text-[6px] text-slate-500/30 ml-auto uppercase tracking-wider">{session.sessionType}</span>
      </div>

      {/* Tab bar */}
      <div className="px-4 py-2 flex items-center gap-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        {detailTabs.map(tab => {
          const isActive = detailTab === tab.key
          return (
            <motion.button key={tab.key} whileTap={{ scale: 0.95 }}
              onClick={() => setDetailTab(tab.key)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[7px] font-bold uppercase tracking-wider transition-all duration-150"
              style={{
                background: isActive ? `rgba(${outcomeColor},0.1)` : "rgba(255,255,255,0.02)",
                color: isActive ? `rgba(${outcomeAccent},0.9)` : "rgba(148,163,184,0.45)",
                border: `1px solid ${isActive ? `rgba(${outcomeColor},0.18)` : "rgba(255,255,255,0.04)"}`,
              }}>
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[6px] font-mono" style={{ opacity: isActive ? 0.7 : 0.4 }}>{tab.count}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="px-4 py-3 max-h-[320px] overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {detailTab === "trades" && (
            <motion.div key="trades" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-1.5">
              {session.tradeRecords.length === 0 ? (
                <div className="text-center py-6">
                  <Shield className="w-5 h-5 text-slate-500/25 mx-auto mb-2" />
                  <p className="text-[8px] text-slate-400/40">No trades this session -- analysis only</p>
                </div>
              ) : (
                session.tradeRecords.map(trade => (
                  <TradeRow key={trade.id} trade={trade} />
                ))
              )}
            </motion.div>
          )}
          {detailTab === "timeline" && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {session.events.map(event => (
                <MiniTimelineEvent key={event.id} event={event} />
              ))}
            </motion.div>
          )}
          {detailTab === "highlights" && (
            <motion.div key="highlights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-2">
              {session.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 px-2.5 py-2 rounded-lg"
                  style={{
                    background: `rgba(${outcomeColor},0.03)`,
                    border: `1px solid rgba(${outcomeColor},0.06)`,
                  }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `rgba(${outcomeColor},0.1)` }}>
                    <span className="text-[7px] font-mono font-bold" style={{ color: `rgba(${outcomeAccent},0.7)` }}>{i + 1}</span>
                  </div>
                  <p className="text-[8px] text-white/60 leading-relaxed">{h}</p>
                </div>
              ))}
              {/* Tags */}
              <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                <span className="text-[6px] text-slate-500/35 uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {session.tags.map(tag => (
                    <span key={tag} className="text-[6px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.03)", color: "rgba(148,163,184,0.45)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function SessionCard({ session, onExpand }: { session: PastSession; onExpand: () => void }) {
  const outcomeColor = session.outcome === "profitable" ? "16,185,129" : session.outcome === "loss" ? "239,68,68" : "148,163,184"
  const outcomeAccent = session.outcome === "profitable" ? "52,211,153" : session.outcome === "loss" ? "248,113,113" : "203,213,225"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
      onClick={onExpand}
      className="group/card cursor-pointer rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
      style={{
        background: "linear-gradient(135deg, rgba(10,11,16,0.95) 0%, rgba(15,16,22,0.9) 100%)",
        border: `1px solid rgba(${outcomeColor},0.08)`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <div className="px-3.5 py-3">
        {/* Row 1: Name + P&L */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Mentor avatar */}
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${session.mentorGradient} flex items-center justify-center`}>
              <span className="text-[8px] font-bold text-white">{session.mentorInitials}</span>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white/80 group-hover/card:text-white/95 transition-colors">{session.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[7px] font-mono text-slate-400/45">{session.date}</span>
                <span className="text-[6px] text-slate-500/30">|</span>
                <span className="text-[7px] text-slate-400/40">{session.duration}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono font-bold"
              style={{ color: `rgba(${outcomeAccent},0.9)` }}>
              {session.netPnl}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500/30 group-hover/card:text-white/40 transition-colors" />
          </div>
        </div>

        {/* Row 2: Stats pills */}
        <div className="flex items-center gap-1.5 mb-2">
          {/* Win rate */}
          {session.tradesExecuted > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{
                background: session.winRate >= 60 ? "rgba(16,185,129,0.06)" : session.winRate >= 40 ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${session.winRate >= 60 ? "rgba(16,185,129,0.1)" : session.winRate >= 40 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)"}`,
              }}>
              <Target className="w-2 h-2" style={{
                color: session.winRate >= 60 ? "rgba(52,211,153,0.65)" : session.winRate >= 40 ? "rgba(251,191,36,0.65)" : "rgba(248,113,113,0.65)",
              }} />
              <span className="text-[7px] font-mono font-bold"
                style={{
                  color: session.winRate >= 60 ? "rgba(52,211,153,0.7)" : session.winRate >= 40 ? "rgba(251,191,36,0.7)" : "rgba(248,113,113,0.7)",
                }}>{session.winRate}%</span>
            </div>
          )}
          {/* Trades */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Activity className="w-2 h-2 text-slate-400/40" />
            <span className="text-[7px] font-mono text-slate-400/50">{session.tradesExecuted} trades</span>
          </div>
          {/* Audience */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.08)" }}>
            <Users className="w-2 h-2 text-purple-400/45" />
            <span className="text-[7px] font-mono text-purple-400/50">{session.peakAudience}</span>
          </div>
          {/* Session type */}
          <span className="text-[6px] font-bold uppercase tracking-wider text-slate-500/30 ml-auto">{session.sessionType}</span>
        </div>

        {/* Row 3: Instruments + phase bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-1">
            {session.instruments.map(inst => (
              <span key={inst} className="text-[6px] font-mono font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(56,189,248,0.04)",
                  color: "rgba(125,211,252,0.55)",
                  border: "1px solid rgba(56,189,248,0.07)",
                }}>
                {inst}
              </span>
            ))}
          </div>
          <div className="w-20">
            <SessionPhaseBar phases={session.phases} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════
// AGGREGATE STATS HEADER
// ══════════════════════════════════════════════════════════════════

function AggregateStatsBar({ sessions }: { sessions: PastSession[] }) {
  const totalSessions = sessions.length
  const profitableSessions = sessions.filter(s => s.outcome === "profitable").length
  const lossSessions = sessions.filter(s => s.outcome === "loss").length
  const totalTrades = sessions.reduce((sum, s) => sum + s.tradesExecuted, 0)
  const totalWins = sessions.reduce((sum, s) => sum + Math.round(s.tradesExecuted * s.winRate / 100), 0)
  const overallWinRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0

  // Parse net P&L
  const totalPnl = sessions.reduce((sum, s) => {
    const num = parseFloat(s.netPnl.replace(/[$,+]/g, ""))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
  const pnlStr = totalPnl >= 0 ? `+$${totalPnl.toLocaleString()}` : `-$${Math.abs(totalPnl).toLocaleString()}`
  const pnlColor = totalPnl >= 0 ? "16,185,129" : "239,68,68"
  const pnlAccent = totalPnl >= 0 ? "52,211,153" : "248,113,113"

  const peakAudience = Math.max(...sessions.map(s => s.peakAudience))

  const stats = [
    { label: "Sessions", value: `${totalSessions}`, color: "148,163,184", accent: "203,213,225", icon: Calendar },
    { label: "Net P&L", value: pnlStr, color: pnlColor, accent: pnlAccent, icon: totalPnl >= 0 ? CircleArrowUp : CircleArrowDown },
    { label: "Win Rate", value: `${overallWinRate}%`, color: overallWinRate >= 60 ? "16,185,129" : "245,158,11", accent: overallWinRate >= 60 ? "52,211,153" : "251,191,36", icon: Target },
    { label: "Total Trades", value: `${totalTrades}`, color: "56,189,248", accent: "125,211,252", icon: Activity },
    { label: "Win/Loss", value: `${profitableSessions}/${lossSessions}`, color: "139,92,246", accent: "167,139,250", icon: BarChart3 },
    { label: "Peak Viewers", value: `${peakAudience}`, color: "52,211,153", accent: "110,231,183", icon: Users },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map(stat => {
        const StatIcon = stat.icon
        return (
          <div key={stat.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{
              background: `linear-gradient(135deg, rgba(${stat.color},0.04) 0%, rgba(0,0,0,0.12) 100%)`,
              border: `1px solid rgba(${stat.color},0.08)`,
            }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${stat.color},0.1)`, border: `1px solid rgba(${stat.color},0.12)` }}>
              <StatIcon className="w-3 h-3" style={{ color: `rgba(${stat.accent},0.8)` }} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold block leading-tight" style={{ color: `rgba(${stat.accent},0.9)` }}>{stat.value}</span>
              <span className="text-[5px] uppercase tracking-wider text-slate-500/40">{stat.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

export function LiveCallHistory() {
  const [outcomeFilter, setOutcomeFilter] = useState<HistoryFilter>("all")
  const [instrumentFilter, setInstrumentFilter] = useState<InstrumentFilter>("all")
  const [sortBy, setSortBy] = useState<HistorySort>("date")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(false)

  // Unique instruments across all sessions
  const allInstruments = useMemo(() => {
    const set = new Set<string>()
    PAST_SESSIONS.forEach(s => s.instruments.forEach(i => set.add(i)))
    return Array.from(set).sort()
  }, [])

  // Filter sessions
  const filteredSessions = useMemo(() => {
    let result = [...PAST_SESSIONS]

    // Outcome filter
    if (outcomeFilter !== "all") result = result.filter(s => s.outcome === outcomeFilter)

    // Instrument filter
    if (instrumentFilter !== "all") result = result.filter(s => s.instruments.includes(instrumentFilter))

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q)) ||
        s.highlights.some(h => h.toLowerCase().includes(q)) ||
        s.instruments.some(i => i.toLowerCase().includes(q))
      )
    }

    // Sort
    result.sort((a, b) => {
      let diff = 0
      switch (sortBy) {
        case "pnl":
          diff = parseFloat(a.netPnl.replace(/[$,+]/g, "")) - parseFloat(b.netPnl.replace(/[$,+]/g, ""))
          break
        case "trades":
          diff = a.tradesExecuted - b.tradesExecuted
          break
        case "audience":
          diff = a.peakAudience - b.peakAudience
          break
        default: // date — use index as proxy (already ordered newest first)
          diff = 0
      }
      return sortAsc ? diff : -diff
    })

    return result
  }, [outcomeFilter, instrumentFilter, searchQuery, sortBy, sortAsc])

  const expandedSession = expandedSessionId ? PAST_SESSIONS.find(s => s.id === expandedSessionId) : null

  const outcomeFilters: { key: HistoryFilter; label: string; color: string }[] = [
    { key: "all", label: "All", color: "148,163,184" },
    { key: "profitable", label: "Profitable", color: "16,185,129" },
    { key: "loss", label: "Loss", color: "239,68,68" },
    { key: "breakeven", label: "Breakeven", color: "148,163,184" },
  ]

  const sortOptions: { key: HistorySort; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "pnl", label: "P&L" },
    { key: "trades", label: "Trades" },
    { key: "audience", label: "Audience" },
  ]

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(245,158,11,0.08) 100%)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}>
            <Radio className="w-4 h-4 text-red-400/80" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-white/90">Live Call History</h1>
            <p className="text-[10px] text-slate-400/50">Complete archive of past live sessions with structured timelines and trade records</p>
          </div>
        </div>
      </div>

      {/* Aggregate stats */}
      <AggregateStatsBar sessions={PAST_SESSIONS} />

      {/* Controls row */}
      <div className="space-y-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500/40" />
          <input
            type="text"
            placeholder="Search sessions, instruments, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl text-[9px] text-white/75 placeholder:text-slate-500/35 outline-none transition-all duration-150 focus:ring-1"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
          {searchQuery && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X className="w-3 h-3 text-slate-500/40" />
            </motion.button>
          )}
        </div>

        {/* Filters + sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Outcome filters */}
          {outcomeFilters.map(f => {
            const isActive = outcomeFilter === f.key
            const count = f.key === "all" ? PAST_SESSIONS.length : PAST_SESSIONS.filter(s => s.outcome === f.key).length
            return (
              <motion.button key={f.key} whileTap={{ scale: 0.93 }}
                onClick={() => setOutcomeFilter(f.key)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-bold uppercase tracking-wider transition-all duration-150"
                style={{
                  background: isActive ? `rgba(${f.color},0.1)` : "rgba(255,255,255,0.02)",
                  color: isActive ? `rgba(${f.color},0.9)` : "rgba(148,163,184,0.4)",
                  border: `1px solid ${isActive ? `rgba(${f.color},0.18)` : "rgba(255,255,255,0.04)"}`,
                }}>
                {f.label}
                <span className="text-[6px] font-mono" style={{ opacity: isActive ? 0.7 : 0.35 }}>{count}</span>
              </motion.button>
            )
          })}

          <div className="w-px h-4 bg-white/[0.06]" />

          {/* Instrument filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-2.5 h-2.5 text-slate-500/35" />
            <select
              value={instrumentFilter}
              onChange={(e) => setInstrumentFilter(e.target.value)}
              className="text-[7px] font-mono bg-transparent text-slate-400/55 outline-none cursor-pointer px-1 py-0.5 rounded"
              style={{ border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <option value="all">All Instruments</option>
              {allInstruments.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>

          <div className="flex-1" />

          {/* Sort */}
          <div className="flex items-center gap-1">
            {sortOptions.map(opt => {
              const isActive = sortBy === opt.key
              return (
                <motion.button key={opt.key} whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    if (sortBy === opt.key) {
                      setSortAsc(!sortAsc)
                    } else {
                      setSortBy(opt.key)
                      setSortAsc(false)
                    }
                  }}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[6px] font-bold uppercase tracking-wider transition-all duration-150"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                    color: isActive ? "rgba(255,255,255,0.65)" : "rgba(148,163,184,0.35)",
                  }}>
                  {opt.label}
                  {isActive && (
                    <ArrowUpDown className="w-2 h-2" style={{ color: "rgba(148,163,184,0.5)" }} />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Expanded session detail */}
      <AnimatePresence>
        {expandedSession && (
          <SessionDetailView
            session={expandedSession}
            onClose={() => setExpandedSessionId(null)}
          />
        )}
      </AnimatePresence>

      {/* Session list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[7px] text-slate-400/45 font-bold uppercase tracking-wider">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <AnimatePresence>
          {filteredSessions.map((session, idx) => (
            <motion.div key={session.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04, ease: EASE_PREMIUM }}>
              <SessionCard
                session={session}
                onExpand={() => setExpandedSessionId(
                  expandedSessionId === session.id ? null : session.id
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredSessions.length === 0 && (
          <div className="text-center py-12 rounded-xl"
            style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Search className="w-5 h-5 text-slate-500/25 mx-auto mb-2" />
            <p className="text-[9px] text-slate-400/40">No sessions match your filters</p>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => { setOutcomeFilter("all"); setInstrumentFilter("all"); setSearchQuery("") }}
              className="text-[8px] text-sky-400/50 mt-2 hover:text-sky-400/70 transition-colors">
              Clear all filters
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
