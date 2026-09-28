"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, GLOW, RADIUS, TYPE, GRADIENT, MOTION } from "@/components/mtf/mtf-theme"
import { NeuralOrb, type OrbState } from "./neural-orb"
import { SummonedWorkspace, type SummonedResult } from "./summoned-workspace"
import { parseIntent } from "@/lib/command/intent-parser"
import { generateSuggestions } from "@/lib/command/suggestions"
import type { SuggestionChip, ResultObject } from "@/lib/command/types"
import {
  Send, Mic, Clock, TrendingUp, Users, Shield, Target,
  AlertTriangle, Calendar, BarChart3, Sparkles, Zap,
  ChevronRight, ArrowUpRight, Activity, BookOpen, Eye,
  Crosshair, Brain, Globe, DollarSign, FileText,
  LineChart, Layers, MessageSquare, ArrowDown, ArrowUp,
  Lock, Search, Radio,
} from "lucide-react"
import type { AICheckIn, PsychologyState, DailyPlan, PerformanceSnapshot, SessionMode } from "../dashboard-types"

/* ═══════════════════════════════════════════════════════
   COMMAND DESK v1.5 — Deep Enhancement Pass
   Engaged Mode | Deep Side Lanes | Rich Input | Detailed Quick Intents
   ═══════════════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ═══════════════════════════════════════════════════════
   MOCK RESPONSE ENGINE
   ═══════════════════════════════════════════════════════ */

function generateMockResponse(query: string): SummonedResult {
  const parsed = parseIntent(query)
  const lower = query.toLowerCase()
  const suggestions = generateSuggestions(parsed.intent, parsed.entities)

  /* Session openers */
  if (lower.includes("london") && (lower.includes("open") || lower.includes("session") || lower.includes("dashboard"))) {
    return {
      framing: "London session dashboard loaded. Your highest-probability window is active.",
      category: "SESSION",
      detectedEntities: ["London", "EUR/USD", "Session Dashboard"],
      sessionBadge: "London",
      sourceStatus: "live",
      objects: [
        {
          type: "stat-grid",
          data: {
            items: [
              { label: "Session", value: "London", color: "cyan" },
              { label: "Win Rate", value: "72%", color: "emerald" },
              { label: "Focus Pair", value: "EUR/USD" },
              { label: "Trades Left", value: "2", color: "amber" },
            ],
          },
        },
        {
          type: "plan-checklist",
          data: {
            compliance: 100,
            items: [
              { label: "Pre-market prep complete", checked: true, status: "on-track" as const },
              { label: "Max 2 trades today", checked: false, status: "on-track" as const, detail: "0 taken" },
              { label: "Only FVG + Liquidity setups", checked: true, status: "on-track" as const },
              { label: "No trading before ECB", checked: true, status: "warning" as const, detail: "47min away" },
            ],
          },
        },
      ],
      insight: {
        primary: "Your EUR/USD London win rate is 74% over the last 20 entries. FVG + OB is your strongest confluence in this window.",
        risk: "ECB Rate Decision in 47 minutes. EUR pairs will see elevated volatility. Your plan restricts trading 30 minutes before high-impact news.",
        opportunity: "Post-ECB continuation setups have historically been your second-best entry type. Wait for displacement confirmation after the event.",
      },
      suggestions,
      contextBar: {
        session: "London",
        pair: "EUR/USD",
        routeAffinity: ["Dashboard", "Forecast Hub", "Intelligence"],
        planActive: true,
        newsAlert: "ECB in 47m",
      },
      chartActions: [
        { label: "Analyze EUR/USD", description: "Open chart with MTF context and AI analysis", icon: "chart", route: "/intelligence" },
        { label: "Open DXY Context", description: "Dollar index with correlation overlay", icon: "trending", query: "Show me DXY and macro context" },
        { label: "London Session Chart", description: "Session-specific key levels and killzones", icon: "layers", route: "/intelligence" },
        { label: "Confluence Overlay", description: "Map active FVG, OB, and liquidity zones", icon: "crosshair", query: "Show confluences on EUR/USD" },
      ],
      nextMoves: [
        { title: "Open Execution Copilot", description: "Move from prep into your live execution surface with today's active pair and risk context.", category: "continue", route: "/copilot", urgency: "high", icon: "crosshair" },
        { title: "Analyze EUR/USD Chart", description: "Open the current chart surface with MTF context, key levels, and AI analysis panel.", category: "deepen", route: "/intelligence", urgency: "medium", icon: "chart" },
        { title: "Compare with Previous London Sessions", description: "See whether today's conditions match your best historical session profile.", category: "compare", query: "Compare my last 5 London sessions", urgency: "low", icon: "trending" },
        { title: "Review ECB No-Trade Window", description: "Check whether your rules require standing down before the event. Shows affected pairs and timing.", category: "protect", query: "Show ECB risk briefing", urgency: "high", icon: "shield" },
        { title: "Open Mentor Morning Forecasts", description: "See all new mentor posts that align with your watchlist and current session.", category: "navigate", query: "What did my mentors post this morning?", urgency: "medium", icon: "users" },
      ],
    }
  }

  /* Macro / DXY / News */
  if (lower.includes("dxy") || lower.includes("macro") || lower.includes("news") || lower.includes("cpi") || lower.includes("ecb")) {
    return {
      framing: "Macro intelligence for today. 3 events on calendar, 1 high-impact in 47 minutes.",
      category: "MACRO",
      detectedEntities: ["ECB", "EUR", "USD", "Macro Calendar"],
      sessionBadge: "London",
      sourceStatus: "live",
      objects: [
        {
          type: "macro-panel",
          data: {
            events: [
              { name: "ECB Rate Decision", time: "08:30", impact: "high" as const, currency: "EUR", affectedPairs: ["EUR/USD", "EUR/GBP", "EUR/JPY"] },
              { name: "US Initial Jobless Claims", time: "13:30", impact: "medium" as const, currency: "USD", affectedPairs: ["EUR/USD", "GBP/USD", "XAU/USD"] },
              { name: "ISM Services PMI", time: "15:00", impact: "high" as const, currency: "USD", affectedPairs: ["EUR/USD", "GBP/USD", "US30"] },
            ],
          },
        },
        {
          type: "alert-banner",
          data: {
            type: "warning" as const,
            title: "No-Trade Window Active",
            message: "ECB Rate Decision in 47 minutes. Your plan restricts trading 30 minutes before high-impact news.",
          },
        },
      ],
      insight: {
        primary: "EUR pairs will be most volatile around 08:30. Historical ECB days show 2.3x average EUR/USD range.",
        risk: "Trading during ECB releases has historically resulted in 38% win rate for you. 3 of your last 4 news-day losses were early entries before confirmation.",
        opportunity: "Post-ECB continuation setups have historically yielded 2.8R average when you wait for displacement.",
        protection: "Your plan says: no trading 30 minutes before high-impact news. Consider pausing EUR pairs until 09:00.",
      },
      suggestions,
      contextBar: {
        session: "London",
        pair: "EUR/USD",
        routeAffinity: ["Intelligence", "Macro Calendar", "Risk Management"],
        planActive: true,
        newsAlert: "ECB in 47m",
      },
      chartActions: [
        { label: "Open DXY Chart", description: "Dollar index with historical ECB overlay", icon: "chart", route: "/intelligence" },
        { label: "EUR/USD Around ECB", description: "Last 6 ECB reactions on 15m chart", icon: "trending", route: "/intelligence" },
        { label: "Affected Pairs Grid", description: "Multi-chart view of all EUR and USD pairs", icon: "layers", route: "/intelligence" },
      ],
      nextMoves: [
        { title: "Open Macro Intelligence", description: "Full macro timeline with DXY context, affected instruments, and historical impact data.", category: "navigate", route: "/intelligence", urgency: "high", icon: "chart" },
        { title: "Show Safest Pairs Today", description: "Filter your watchlist to pairs not affected by today's high-impact events.", category: "protect", query: "Which pairs should I avoid today?", urgency: "high", icon: "shield" },
        { title: "Historical ECB Impact", description: "View last 6 ECB decisions with price reaction, range, and your performance on those days.", category: "deepen", query: "Show historical ECB rate decision impact", urgency: "medium", icon: "trending" },
        { title: "Build No-Trade Plan", description: "Set up event-specific risk windows and auto-reminders before each release today.", category: "protect", query: "Help me plan around today's events", urgency: "medium", icon: "lock" },
      ],
    }
  }

  /* Mentor / Community */
  if (lower.includes("mentor") || lower.includes("marcus") || lower.includes("forecast")) {
    return {
      framing: "Mentor activity from this morning. 3 new forecasts, 2 align with your watchlist.",
      category: "MENTOR",
      detectedEntities: ["Marcus Wei", "Sarah Kim", "EUR/USD", "XAU/USD"],
      sessionBadge: "Pre-Market",
      sourceStatus: "live",
      objects: [
        {
          type: "forecast-card",
          data: [
            { id: "fc-101", mentor: "Marcus Wei", pair: "EUR/USD", direction: "LONG" as const, confidence: 82, status: "active" as const, confluences: ["FVG", "Order Block", "Liquidity Sweep"], createdAt: "6h ago" },
            { id: "fc-102", mentor: "Sarah Kim", pair: "XAU/USD", direction: "LONG" as const, confidence: 75, status: "active" as const, confluences: ["Break & Retest", "Demand Zone"], createdAt: "4h ago" },
          ],
        },
      ],
      insight: {
        primary: "Marcus Wei's EUR/USD LONG aligns with your current bias and your strongest setup (FVG + OB). His accuracy on EUR/USD is 78% this quarter.",
        opportunity: "Both forecasts align with your focus pairs. Marcus Wei uses institutional flow data that has been 82% accurate this month.",
      },
      suggestions,
      contextBar: {
        session: "London",
        pair: "EUR/USD",
        routeAffinity: ["Forecast Hub", "Mentor Profiles", "Community"],
        planActive: true,
      },
      chartActions: [
        { label: "Analyze EUR/USD", description: "Compare Marcus Wei's levels with current chart", icon: "chart", route: "/intelligence" },
        { label: "Forecast vs Chart", description: "Overlay forecast entry, SL, TP on live chart", icon: "layers", route: "/intelligence" },
        { label: "Mentor Thesis View", description: "Side-by-side chart with mentor's reasoning", icon: "trending", route: "/intelligence" },
      ],
      nextMoves: [
        { title: "Open Forecast Hub", description: "Full forecast browser with mentor filters, pair filters, and community discussion threads.", category: "navigate", route: "/forecast", urgency: "medium", icon: "trending" },
        { title: "Compare Mentor Forecasts", description: "Side-by-side accuracy, confluences, and historical win rate of Marcus Wei vs Sarah Kim.", category: "compare", query: "Compare Marcus Wei vs Sarah Kim", urgency: "low", icon: "chart" },
        { title: "View My Forecast Replies", description: "See what mentors and students have said about your last EUR/USD LONG forecast.", category: "deepen", query: "Show replies on my last forecast", urgency: "medium", icon: "message" },
        { title: "Open Marcus Wei Profile", description: "Full profile with accuracy history, specialization, and all active forecasts.", category: "navigate", query: "Show Marcus Wei's full profile", urgency: "low", icon: "users" },
      ],
    }
  }

  /* Plan / Discipline */
  if (lower.includes("plan") || lower.includes("discipline") || lower.includes("rule") || lower.includes("should i") || lower.includes("focus")) {
    return {
      framing: "Plan compliance check. You are on track with all rules active.",
      category: "PLAN",
      detectedEntities: ["Daily Plan", "Discipline", "Trade Limits"],
      sessionBadge: "Pre-Market",
      sourceStatus: "live",
      objects: [
        {
          type: "plan-checklist",
          data: {
            compliance: 95,
            items: [
              { label: "Max 2 trades today", checked: false, status: "on-track" as const, detail: "0/2 taken" },
              { label: "Only FVG + Liquidity setups", checked: true, status: "on-track" as const },
              { label: "Max 1.5% risk per trade", checked: true, status: "on-track" as const },
              { label: "No trading 30min before news", checked: true, status: "warning" as const, detail: "ECB in 47min" },
              { label: "Wait for displacement confirmation", checked: true, status: "on-track" as const },
            ],
          },
        },
        {
          type: "stat-grid",
          data: {
            items: [
              { label: "Discipline", value: "72/100", color: "emerald" },
              { label: "Daily Loss Used", value: "0%", color: "emerald" },
              { label: "Trades Remaining", value: "2" },
              { label: "Revenge Risk", value: "LOW", color: "emerald" },
            ],
          },
        },
      ],
      insight: {
        primary: "You are fully compliant. Best action: wait for London killzone FVG + OB on EUR/USD. Your 74% win rate in this exact scenario is your strongest edge.",
        protection: "ECB Rate Decision in 47 minutes. Your plan restricts EUR pairs 30 minutes before. This is a no-trade window you have historically violated 2 out of 7 times.",
      },
      suggestions,
      contextBar: {
        session: "London",
        pair: "EUR/USD",
        routeAffinity: ["Dashboard", "Journal", "Psychology"],
        planActive: true,
        newsAlert: "ECB in 47m",
      },
      chartActions: [
        { label: "EUR/USD Setup Watch", description: "Monitor FVG + OB formation on 15m", icon: "chart", route: "/intelligence" },
      ],
      nextMoves: [
        { title: "Open Daily Plan", description: "View and edit your full plan with session focus, trade limits, and personal rules.", category: "navigate", route: "/dashboard", urgency: "low", icon: "target" },
        { title: "Review Yesterday's Trades", description: "See all entries from yesterday with P&L, confluences, and plan compliance for each.", category: "deepen", query: "Show my trades from yesterday", urgency: "medium", icon: "chart" },
        { title: "Check FTMO Progress", description: "View challenge metrics: profit target, drawdown status, days remaining, and daily loss limits.", category: "navigate", query: "How is my FTMO challenge going?", urgency: "medium", icon: "trending" },
        { title: "Compare Plan vs Actual", description: "See exactly where your planned behavior diverges from actual execution this week.", category: "compare", query: "Compare my plan vs actual behavior this week", urgency: "low", icon: "target" },
      ],
    }
  }

  /* Account / Performance */
  if (lower.includes("account") || lower.includes("compare") || lower.includes("performance") || lower.includes("prop") || lower.includes("ftmo")) {
    return {
      framing: "Account comparison loaded. Prop account outperforming personal on discipline metrics.",
      category: "ACCOUNT",
      detectedEntities: ["FTMO Challenge", "Main Live", "Comparison"],
      sessionBadge: "Pre-Market",
      sourceStatus: "live",
      objects: [
        {
          type: "comparison-board",
          data: {
            title: "Account Comparison",
            leftLabel: "FTMO Challenge",
            rightLabel: "Main Live",
            metrics: [
              { label: "Balance", leftValue: "$98,420", rightValue: "$12,480" },
              { label: "Win Rate", leftValue: "68%", rightValue: "64%", leftColor: "emerald" as const, rightColor: "amber" as const },
              { label: "Drawdown", leftValue: "3.2%", rightValue: "2.1%", leftColor: "amber" as const, rightColor: "emerald" as const },
              { label: "Profit Factor", leftValue: "2.1", rightValue: "1.82", leftColor: "emerald" as const, rightColor: "amber" as const },
              { label: "Avg R:R", leftValue: "2.4", rightValue: "2.1" },
              { label: "Discipline", leftValue: "85/100", rightValue: "72/100", leftColor: "emerald" as const, rightColor: "amber" as const },
            ],
          },
        },
      ],
      insight: {
        primary: "Your FTMO account has higher discipline and win rate. The key difference: you take fewer revenge trades on the prop account.",
        opportunity: "Apply the same discipline to your personal account. If you matched FTMO discipline, projected monthly improvement is +$380.",
      },
      suggestions,
      contextBar: {
        session: "Pre-Market",
        routeAffinity: ["Dashboard", "Accounts", "Journal"],
        planActive: true,
      },
      chartActions: [
        { label: "Equity Curves", description: "Compare equity curves side-by-side", icon: "chart", route: "/intelligence" },
      ],
      nextMoves: [
        { title: "View FTMO Challenge Details", description: "Full challenge dashboard: profit target, max drawdown, daily loss limits, and days remaining.", category: "navigate", query: "Show FTMO challenge progress", urgency: "high", icon: "trending" },
        { title: "Compare by Session", description: "Break down prop vs personal performance across London, NY AM, NY PM, and Asia.", category: "compare", query: "Compare performance by session", urgency: "medium", icon: "chart" },
        { title: "Compare by Setup", description: "See which setups perform differently across your prop and personal accounts.", category: "compare", query: "Compare accounts by setup type", urgency: "low", icon: "layers" },
        { title: "Open Accounts Page", description: "View all accounts with live balances, floating P&L, and prop firm phase tracking.", category: "navigate", route: "/dashboard", urgency: "low", icon: "dollar" },
      ],
    }
  }

  /* Win rate / Stats */
  if (lower.includes("win rate") || lower.includes("win most") || lower.includes("best") || lower.includes("worst") || lower.includes("confluence")) {
    return {
      framing: "Performance breakdown loaded. FVG + OB is your edge. Breakout is bleeding you.",
      category: "PERFORMANCE",
      detectedEntities: ["Win Rate", "FVG + OB", "Breakout", "Setup Analysis"],
      sessionBadge: "Analysis",
      sourceStatus: "live",
      objects: [
        {
          type: "stat-grid",
          data: {
            items: [
              { label: "Overall WR", value: "64.2%", color: "emerald" },
              { label: "Profit Factor", value: "1.82", color: "cyan" },
              { label: "Avg R:R", value: "2.1", color: "purple" },
              { label: "Consistency", value: "71/100" },
              { label: "Best Setup", value: "FVG+OB 78%", color: "emerald" },
              { label: "Worst Setup", value: "Breakout 41%", color: "rose" },
            ],
          },
        },
      ],
      insight: {
        primary: "Your FVG + OB setup has generated $1,240 in profit with 78% win rate. Breakout entries have cost you $340 with 41% win rate.",
        risk: "Breakout entries are your biggest P&L drain. 6 of your last 10 breakout entries were losers.",
        opportunity: "Pausing breakout entries and focusing on FVG + OB would have improved your profit factor from 1.82 to 2.4 over the last 30 days.",
      },
      suggestions,
      contextBar: {
        session: "Analysis",
        routeAffinity: ["Journal", "Performance", "Strategy Health"],
        planActive: true,
      },
      chartActions: [
        { label: "Setup Heatmap", description: "Visual breakdown of all setups by win rate and P&L", icon: "chart", route: "/intelligence" },
        { label: "FVG + OB Examples", description: "Review your best 5 FVG + OB entries with charts", icon: "layers", route: "/intelligence" },
      ],
      nextMoves: [
        { title: "Compare by Session", description: "See which sessions amplify or diminish each setup's effectiveness.", category: "compare", query: "Show win rate by session", urgency: "medium", icon: "chart" },
        { title: "Cluster by Confluence", description: "Group your trades by confluence combination and see which clusters produce the best results.", category: "deepen", query: "What confluences do I win most with?", urgency: "medium", icon: "layers" },
        { title: "Show Losing Patterns", description: "AI analysis of your worst entries to identify repeating behavioral or technical mistakes.", category: "deepen", query: "What patterns lead to my losses?", urgency: "high", icon: "eye" },
        { title: "Open Copilot Journal", description: "Full journal with all entries, filters, and AI-powered pattern detection.", category: "navigate", route: "/copilot", urgency: "low", icon: "crosshair" },
      ],
    }
  }

  /* Default fallback */
  return {
    framing: "Here is a summary of your current state. Tell me what you need.",
    category: "OVERVIEW",
    detectedEntities: ["Overview", "Current State"],
    sessionBadge: "Pre-Market",
    sourceStatus: "live",
    objects: [
      {
        type: "stat-grid",
        data: {
          items: [
            { label: "Balance", value: "$12,480" },
            { label: "Win Rate", value: "64.2%", color: "emerald" },
            { label: "Streak", value: "2W", color: "emerald" },
            { label: "Discipline", value: "72/100" },
          ],
        },
      },
    ],
    insight: {
      primary: "You are in a good position. 2W streak, discipline at 72, London session approaching.",
      opportunity: "Your strongest edge is EUR/USD during London with FVG + OB confluence. 74% win rate over last 20 entries.",
    },
    suggestions,
    contextBar: {
      session: "Pre-Market",
      pair: "EUR/USD",
      routeAffinity: ["Dashboard", "Forecast Hub"],
      planActive: true,
    },
    chartActions: [],
    nextMoves: [
      { title: "Open London Dashboard", description: "Load your highest-probability session panel with active pairs, checklist, and plan status.", category: "continue", query: "Open my London session dashboard", urgency: "high", icon: "chart" },
      { title: "Review Macro Events", description: "Today's economic calendar with timing, impact levels, affected pairs, and no-trade windows.", category: "navigate", query: "Show me today's macro events", urgency: "medium", icon: "calendar" },
      { title: "Check Plan Compliance", description: "Validates trades remaining, allowed setups, news restrictions, and behavioral risk.", category: "protect", query: "Am I following my plan?", urgency: "medium", icon: "shield" },
      { title: "Compare My Accounts", description: "Side-by-side prop vs personal with equity, drawdown, win rate, and discipline scores.", category: "compare", query: "Compare my prop vs personal account", urgency: "low", icon: "trending" },
    ],
  }
}

/* ═══════════════════════════════════════════════════════
   PROACTIVE BRIEFING CARD (Deep Side Lane)
   ═══════════════════════════════════════════════════════ */

interface BriefingCard {
  id: string
  icon: typeof Clock
  title: string
  detail: string
  meta: string
  opens: string
  priority: "high" | "medium" | "low"
  color: string
  action: string
}

function buildLeftLane(
  checkin: AICheckIn,
  plan: DailyPlan,
  psychology: PsychologyState,
  sessionMode: SessionMode,
): BriefingCard[] {
  const cards: BriefingCard[] = []

  /* Session timing */
  if (checkin.sessionInfo.isOpen) {
    cards.push({
      id: "l1", icon: Radio, title: `${checkin.sessionInfo.name} Session Live`,
      detail: "Your highest-probability window is currently active. Focus pairs are ready.",
      meta: `Win Rate: ${sessionMode === "in_session" ? "72%" : "--"}`,
      opens: "Session Dashboard",
      priority: "high", color: ACCENT.emerald.rgb,
      action: `Open my ${checkin.sessionInfo.name} session dashboard`,
    })
  } else {
    cards.push({
      id: "l1", icon: Clock, title: `${checkin.sessionInfo.name} in ${checkin.sessionInfo.opensIn}`,
      detail: "Pre-market window is open. Complete your prep, review macro, and confirm your plan before session opens.",
      meta: "Historical prep completion: +12% accuracy",
      opens: "Macro + DXY Brief",
      priority: "medium", color: ACCENT.blue.rgb,
      action: "Show me today's macro and DXY context",
    })
  }

  /* Macro warning */
  const highImpact = plan.macroEvents.filter(e => e.impact === "high")
  if (highImpact.length > 0) {
    cards.push({
      id: "l2", icon: AlertTriangle, title: `${highImpact[0].currency} News: ${highImpact[0].event}`,
      detail: `High-impact release at ${highImpact[0].time}. Your plan restricts trading 30 minutes before. Affects ${plan.focusPairs.join(", ")}.`,
      meta: "Historical ECB: 2.3x avg range",
      opens: "Macro Risk Briefing",
      priority: "high", color: ACCENT.amber.rgb,
      action: `Show me ${highImpact[0].event} risk briefing`,
    })
  }

  /* Trade budget */
  cards.push({
    id: "l3", icon: Target, title: `${plan.tradesUsed}/${plan.maxTrades} Trades Used`,
    detail: plan.tradesUsed >= plan.maxTrades
      ? "Daily trade limit reached. No more entries today. Review existing positions and journal."
      : `${plan.maxTrades - plan.tradesUsed} trades remaining. Max ${plan.maxRiskPerTrade}% risk per trade. Daily loss at ${plan.dailyLossUsed}% of ${plan.maxDailyLoss}% limit.`,
    meta: `Daily P&L: ${plan.dailyLossUsed > 0 ? `-${plan.dailyLossUsed}%` : "0%"}`,
    opens: "Plan Compliance",
    priority: plan.tradesUsed >= plan.maxTrades ? "high" : "low",
    color: plan.tradesUsed >= plan.maxTrades ? ACCENT.rose.rgb : ACCENT.cyan.rgb,
    action: "What should I focus on according to my plan?",
  })

  /* Psychology */
  if (psychology.consecutiveLosses >= 2) {
    cards.push({
      id: "l4", icon: Shield, title: `${psychology.consecutiveLosses} Consecutive Losses`,
      detail: "Pattern detected: after 2+ losses, your next trade win rate drops to 34%. Consider stepping back or reducing size.",
      meta: `Revenge risk: ${psychology.revengeTradingRisk.toUpperCase()}`,
      opens: "Psychology Check",
      priority: "high", color: ACCENT.rose.rgb,
      action: "Review my recent losses and help me reset",
    })
  } else {
    cards.push({
      id: "l4", icon: Brain, title: `Discipline: ${psychology.disciplineScore}/100`,
      detail: psychology.disciplineScore >= 70
        ? "Solid discipline this week. Your plan compliance and trade quality are above average."
        : "Discipline trending lower. Review recent rule violations and consider tightening your plan.",
      meta: `Level: ${psychology.disciplineLevel}`,
      opens: "Discipline Dashboard",
      priority: psychology.disciplineScore < 60 ? "high" : "low",
      color: psychology.disciplineScore >= 70 ? ACCENT.emerald.rgb : ACCENT.amber.rgb,
      action: "Show me my discipline breakdown this week",
    })
  }

  return cards
}

function buildRightLane(
  checkin: AICheckIn,
  plan: DailyPlan,
  performance: PerformanceSnapshot,
): BriefingCard[] {
  return [
    {
      id: "r1", icon: Users, title: "3 New Mentor Forecasts",
      detail: "Marcus Wei posted EUR/USD LONG (82% conf, FVG + OB + Liquidity Sweep). Sarah Kim posted XAU/USD LONG. Both align with your watchlist.",
      meta: "2 match your focus pairs",
      opens: "Forecast Hub + Mentor Profiles",
      priority: "medium", color: ACCENT.amber.rgb,
      action: "Show me mentor morning forecasts",
    },
    {
      id: "r2", icon: MessageSquare, title: "4 Unread Forecast Replies",
      detail: "Your EUR/USD LONG from last night received 4 replies including a mentor review from Marcus Wei. Consensus: bullish bias confirmed.",
      meta: "EUR/USD LONG -- last night",
      opens: "Forecast Discussion",
      priority: "medium", color: ACCENT.purple.rgb,
      action: "Show replies on my last forecast",
    },
    {
      id: "r3", icon: TrendingUp, title: `${checkin.stateSummary.currentStreak.count}${checkin.stateSummary.currentStreak.type === "win" ? "W" : "L"} Streak`,
      detail: checkin.stateSummary.currentStreak.type === "win"
        ? `${checkin.stateSummary.currentStreak.count} consecutive wins. Maintain discipline -- overconfidence after streaks has historically reduced your win rate by 8%.`
        : `${checkin.stateSummary.currentStreak.count} consecutive losses. Historical pattern: your recovery rate is 67% when you pause, 34% when you force the next trade.`,
      meta: `Best setup: ${performance.bestSetup.name} (${performance.bestSetup.winRate}%)`,
      opens: "Performance Analysis",
      priority: checkin.stateSummary.currentStreak.type === "loss" ? "high" : "low",
      color: checkin.stateSummary.currentStreak.type === "win" ? ACCENT.emerald.rgb : ACCENT.rose.rgb,
      action: "Show my performance breakdown for this week",
    },
    {
      id: "r4", icon: BarChart3, title: `Worst: ${performance.worstPair.name} (${performance.worstPair.winRate}%)`,
      detail: performance.worstPair.aiSuggestion || "Consider pausing this pair or reviewing your approach on it.",
      meta: `Best: ${performance.bestPair.name} (${performance.bestPair.winRate}%)`,
      opens: "Performance by Pair",
      priority: "low", color: ACCENT.slate.rgb,
      action: `Show my performance on ${performance.worstPair.name}`,
    },
  ]
}

/* ═══════════════════════════════════════════════════════
   QUICK INTENT WITH DESCRIPTOR
   ═══════════════════════════════════════════════════════ */

interface RichQuickIntent {
  label: string
  descriptor: string
  query: string
  icon: typeof Clock
  color: string
  surfaces: string[]
}

function buildQuickIntents(sessionMode: SessionMode, checkin: AICheckIn): RichQuickIntent[] {
  if (sessionMode === "pre_market") {
    return [
      { label: `Open ${checkin.sessionInfo.name} Session`, descriptor: "Loads your highest-probability session panel, active pairs, checklist, and plan status.", query: `Open my ${checkin.sessionInfo.name} session dashboard`, icon: Activity, color: ACCENT.emerald.rgb, surfaces: ["Session Dashboard", "Plan", "Checklist"] },
      { label: "Review Macro + DXY", descriptor: "Summons today's macro timeline, DXY context, affected instruments, and risk windows.", query: "Pull up today's macro and DXY context", icon: Globe, color: ACCENT.amber.rgb, surfaces: ["Macro Calendar", "Intelligence", "DXY"] },
      { label: "Mentor Morning Updates", descriptor: "Pulls new mentor forecasts, live calls, and relevant watchlist alignment.", query: "What did my mentors post this morning?", icon: Users, color: ACCENT.blue.rgb, surfaces: ["Forecast Hub", "Mentor Profiles"] },
      { label: "Check My Plan", descriptor: "Validates trades remaining, allowed setups, news restrictions, and plan-compliance risk before session opens.", query: "What should I focus on today according to my plan?", icon: Target, color: ACCENT.cyan.rgb, surfaces: ["Daily Plan", "Discipline", "Compliance"] },
      { label: "Pre-Flight Checklist", descriptor: "Runs your full pre-session checklist with prep status, pair focus, macro awareness, and rule reminders.", query: "Run my pre-session checklist", icon: Shield, color: ACCENT.emerald.rgb, surfaces: ["Checklist", "Plan", "Macro"] },
    ]
  } else if (sessionMode === "in_session") {
    return [
      { label: "Open Execution Copilot", descriptor: "Your live execution surface with risk context, scenario simulator, and trade entry workflow.", query: "Open my execution copilot", icon: Crosshair, color: ACCENT.emerald.rgb, surfaces: ["Copilot", "Risk", "Execution"] },
      { label: "Live Mentor Calls", descriptor: "Real-time mentor forecasts tagged #live with entry levels and confluences.", query: "Show live mentor calls", icon: Users, color: ACCENT.amber.rgb, surfaces: ["Forecast Hub", "Live Calls"] },
      { label: "Am I Following My Plan?", descriptor: "Live comparison of your plan constraints vs actual behavior. Shows violations and remaining budget.", query: "Am I following my plan right now?", icon: Shield, color: ACCENT.blue.rgb, surfaces: ["Plan Compliance", "Risk"] },
      { label: "Quick Account Check", descriptor: "All accounts with live balances, floating P&L, drawdown meters, and prop firm phase progress.", query: "Show my accounts and risk status", icon: DollarSign, color: ACCENT.cyan.rgb, surfaces: ["Accounts", "Risk"] },
      { label: "Compare Student Entries", descriptor: "See how other students are trading the same setup and pair today.", query: "Compare student entries on today's setup", icon: BarChart3, color: ACCENT.purple.rgb, surfaces: ["Community", "Forecast Hub"] },
    ]
  }
  return [
    { label: "Session Recap", descriptor: "Full recap: trades taken, P&L, plan compliance, setup quality, and lessons for next session.", query: "Give me a recap of today's session", icon: BarChart3, color: ACCENT.blue.rgb, surfaces: ["Journal", "Performance", "Recap"] },
    { label: "Compare Plan vs Actual", descriptor: "Shows exactly where your planned behavior diverged from actual execution today.", query: "Compare my plan vs actual execution today", icon: Target, color: ACCENT.amber.rgb, surfaces: ["Plan", "Journal", "Compliance"] },
    { label: "Review My Mistakes", descriptor: "AI analysis of today's losing trades with behavioral pattern detection and improvement paths.", query: "Show my biggest mistakes today", icon: Eye, color: ACCENT.rose.rgb, surfaces: ["Journal", "AI Analysis"] },
    { label: "Performance Breakdown", descriptor: "P&L by setup, session, pair, and confluence. Shows what worked and what to keep/pause.", query: "Show my performance breakdown for today", icon: TrendingUp, color: ACCENT.emerald.rgb, surfaces: ["Performance", "Strategy Health"] },
    { label: "Compare Accounts", descriptor: "Side-by-side prop vs personal with equity, drawdown, win rate, and discipline scores.", query: "Compare my prop vs personal account", icon: DollarSign, color: ACCENT.cyan.rgb, surfaces: ["Accounts", "Comparison"] },
  ]
}

/* ═══════════════════════════════════════════════════════
   INTENT CLASSIFICATION LABELS
   ═══════════════════════════════════════════════════════ */

const INTENT_LABELS: Record<string, { label: string; color: string; surfaces: string[] }> = {
  show: { label: "RETRIEVE", color: ACCENT.cyan.rgb, surfaces: ["Data Surface"] },
  compare: { label: "COMPARE", color: ACCENT.purple.rgb, surfaces: ["Comparison Board"] },
  explain: { label: "EXPLAIN", color: ACCENT.amber.rgb, surfaces: ["Intelligence"] },
  guide: { label: "GUIDE", color: ACCENT.emerald.rgb, surfaces: ["Plan", "Copilot"] },
  navigate: { label: "NAVIGATE", color: ACCENT.blue.rgb, surfaces: ["Route Handoff"] },
  drill: { label: "DRILL DOWN", color: ACCENT.rose.rgb, surfaces: ["Analysis"] },
}

/* ═══════════════════════════════════════════════════════
   PLACEHOLDER ROTATION BY SESSION
   ═══════════════════════════════════════════════════════ */

const PLACEHOLDERS: Record<SessionMode, string[]> = {
  pre_market: [
    "Open my London session dashboard...",
    "What macro events should I watch today?",
    "Show me mentor morning forecasts...",
    "Check my plan compliance...",
  ],
  in_session: [
    "Am I following my plan right now?",
    "Show live mentor calls...",
    "Quick account check...",
    "Open execution copilot...",
  ],
  post_session: [
    "Give me a recap of today's session...",
    "What mistakes did I make today?",
    "Compare my plan vs actual...",
    "Show my performance breakdown...",
  ],
  reset: [
    "Review what went wrong...",
    "Show my recent losses...",
    "When should I return?",
  ],
}

/* ══════════════════════════════════════════════════════
   SCROLLABLE LANE — Advanced scroll-reveal side panel
   ══════════════════════════════════════════════════════ */

const CARD_HEIGHT = 142 // approx height of each briefing card in px
const CARD_GAP = 10
const VISIBLE_CARDS = 2
const SCROLL_STEP = 2 // scroll exactly 2 cards per click

interface ScrollableLaneProps {
  cards: BriefingCard[]
  label: string
  accentRgb: string
  direction: "left" | "right"
  onCardClick: (action: string) => void
}

function ScrollableLane({ cards, label, accentRgb, direction, onCardClick }: ScrollableLaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const visibleHeight = VISIBLE_CARDS * CARD_HEIGHT + (VISIBLE_CARDS - 1) * CARD_GAP
  const hasOverflow = cards.length > VISIBLE_CARDS
  const hiddenCount = Math.max(0, cards.length - VISIBLE_CARDS)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    setScrollProgress(maxScroll > 0 ? scrollTop / maxScroll : 0)
    setCanScrollDown(scrollTop < maxScroll - 2)
    setCanScrollUp(scrollTop > 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [updateScrollState, cards.length])

  const scrollByCards = useCallback((count: number) => {
    const el = scrollRef.current
    if (!el) return
    const distance = count * (CARD_HEIGHT + CARD_GAP)
    el.scrollBy({ top: distance, behavior: "smooth" })
  }, [])

  const handleScrollDown = useCallback(() => {
    if (canScrollDown) {
      scrollByCards(SCROLL_STEP)
    } else {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [canScrollDown, scrollByCards])

  const handleScrollUp = useCallback(() => {
    scrollByCards(-SCROLL_STEP)
  }, [scrollByCards])

  return (
    <div
      className={`hidden lg:flex flex-col py-6 ${direction === "left" ? "pr-5 pl-2" : "pl-5 pr-2"}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Lane header with integrated scroll nav */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-1 h-3.5 rounded-full" style={{ background: `rgba(${accentRgb},0.4)` }} />
        <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>
          {label}
        </span>

        {/* Scroll nav arrows + progress — right side of header */}
        {hasOverflow && (
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Dot progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering ? 0.7 : 0.3 }}
              className="flex items-center gap-0.5 mr-1"
            >
              {cards.map((_, i) => {
                const visStart = Math.round(scrollProgress * hiddenCount)
                const isVisible = i >= visStart && i < visStart + VISIBLE_CARDS
                return (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    animate={{
                      width: isVisible ? 8 : 3,
                      height: 3,
                      background: isVisible
                        ? `rgba(${accentRgb},0.6)`
                        : `rgba(${accentRgb},0.15)`,
                    }}
                    transition={{ duration: 0.25 }}
                  />
                )
              })}
            </motion.div>

            {/* Up arrow */}
            <motion.button
              animate={{ opacity: canScrollUp ? 1 : 0.2 }}
              onClick={handleScrollUp}
              disabled={!canScrollUp}
              className="w-5 h-5 rounded flex items-center justify-center transition-colors duration-150"
              style={{
                background: canScrollUp ? `rgba(${accentRgb},0.08)` : "transparent",
              }}
              onMouseEnter={(e) => {
                if (canScrollUp) e.currentTarget.style.background = `rgba(${accentRgb},0.15)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = canScrollUp ? `rgba(${accentRgb},0.08)` : "transparent"
              }}
              aria-label="Scroll up"
            >
              <ArrowUp className="w-2.5 h-2.5" style={{ color: `rgba(${accentRgb},${canScrollUp ? 0.6 : 0.15})` }} />
            </motion.button>

            {/* Down arrow */}
            <motion.button
              animate={{ opacity: canScrollDown ? 1 : 0.2 }}
              onClick={handleScrollDown}
              disabled={!canScrollDown && scrollProgress === 0}
              className="w-5 h-5 rounded flex items-center justify-center transition-colors duration-150"
              style={{
                background: canScrollDown ? `rgba(${accentRgb},0.08)` : "transparent",
              }}
              onMouseEnter={(e) => {
                if (canScrollDown) e.currentTarget.style.background = `rgba(${accentRgb},0.15)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = canScrollDown ? `rgba(${accentRgb},0.08)` : "transparent"
              }}
              aria-label="Scroll down"
            >
              <motion.div
                animate={{ rotate: canScrollDown ? 0 : 180 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowDown className="w-2.5 h-2.5" style={{ color: `rgba(${accentRgb},${canScrollDown ? 0.6 : 0.15})` }} />
              </motion.div>
            </motion.button>
          </div>
        )}
      </div>

      {/* Progress bar under header */}
      {hasOverflow && (
        <div
          className="h-px mx-1 mb-2 rounded-full overflow-hidden"
          style={{ background: `rgba(${accentRgb},0.06)` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `rgba(${accentRgb},0.35)` }}
            animate={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}

      {/* Scrollable card container */}
      <div className="relative flex-1">
        {/* Top fade mask */}
        <AnimatePresence>
          {canScrollUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none rounded-t-xl"
              style={{
                background: `linear-gradient(180deg, rgba(10,12,21,0.9) 0%, rgba(10,12,21,0.4) 50%, transparent 100%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Scrollable area */}
        <div
          ref={scrollRef}
          className="flex flex-col gap-2.5 overflow-y-auto"
          style={{
            maxHeight: hasOverflow ? visibleHeight : "none",
            scrollbarWidth: "none",
            scrollSnapType: "y mandatory",
          }}
        >
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, x: direction === "left" ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: EASE }}
                onClick={() => onCardClick(card.action)}
                className="group text-left rounded-xl transition-all duration-300 overflow-hidden flex-shrink-0"
                style={{
                  scrollSnapAlign: "start",
                  background: card.priority === "high"
                    ? `rgba(${card.color},0.04)`
                    : `rgba(${ACCENT.slate.rgb},0.02)`,
                  border: `1px solid rgba(${card.color},${card.priority === "high" ? 0.1 : 0.04})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${card.color},0.07)`
                  e.currentTarget.style.borderColor = `rgba(${card.color},0.18)`
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(${card.color},0.06)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = card.priority === "high" ? `rgba(${card.color},0.04)` : `rgba(${ACCENT.slate.rgb},0.02)`
                  e.currentTarget.style.borderColor = `rgba(${card.color},${card.priority === "high" ? 0.1 : 0.04})`
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <div className="p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `rgba(${card.color},0.12)` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: `rgba(${card.color},0.8)` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white/85 font-semibold leading-tight mb-1">{card.title}</div>
                      <div className="text-[10px] leading-[1.5] text-white/40 mb-2">{card.detail}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${card.color},0.45)` }}>{card.meta}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom action strip */}
                <div
                  className="px-3.5 py-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    background: `rgba(${card.color},0.03)`,
                    borderTop: `1px solid rgba(${card.color},0.06)`,
                  }}
                >
                  <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${card.color},0.4)` }}>
                    Opens: {card.opens}
                  </span>
                  <ChevronRight className="w-3 h-3" style={{ color: `rgba(${card.color},0.4)` }} />
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Bottom fade mask */}
        <AnimatePresence>
          {canScrollDown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-10 z-10 pointer-events-none rounded-b-xl"
              style={{
                background: `linear-gradient(0deg, rgba(10,12,21,0.9) 0%, rgba(10,12,21,0.4) 50%, transparent 100%)`,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   COMMAND DESK COMPONENT
   ══════════════════════════════════════════════════════ */

interface CommandDeskProps {
  checkin: AICheckIn
  psychology: PsychologyState
  performance: PerformanceSnapshot
  plan: DailyPlan
  sessionMode: SessionMode
}

export function CommandDesk({
  checkin,
  psychology,
  performance,
  plan,
  sessionMode,
}: CommandDeskProps) {
  const [orbState, setOrbState] = useState<OrbState>("idle")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<SummonedResult | null>(null)
  const [isEngaged, setIsEngaged] = useState(false)
  const [hoveredChip, setHoveredChip] = useState<string | null>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const leftLane = buildLeftLane(checkin, plan, psychology, sessionMode)
  const rightLane = buildRightLane(checkin, plan, performance)
  const quickIntents = buildQuickIntents(sessionMode, checkin)

  /* Session mode config */
  const modeConfig: Record<SessionMode, { label: string; color: string }> = {
    pre_market: { label: "Pre-Market", color: ACCENT.blue.rgb },
    in_session: { label: "In Session", color: ACCENT.emerald.rgb },
    post_session: { label: "Post Session", color: ACCENT.amber.rgb },
    reset: { label: "Reset", color: ACCENT.amber.rgb },
  }
  const mode = modeConfig[sessionMode]

  /* Placeholder rotation */
  useEffect(() => {
    const placeholders = PLACEHOLDERS[sessionMode]
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [sessionMode])

  /* Execute command */
  const executeCommand = useCallback((q: string) => {
    if (!q.trim()) return
    setOrbState("processing")

    setTimeout(() => {
      setOrbState("rendering")
      setTimeout(() => {
        const response = generateMockResponse(q)
        setResult(response)
        setOrbState("ready")
        setIsEngaged(true)
        setQuery("")
      }, 600)
    }, 800)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return
    executeCommand(query)
  }, [query, executeCommand])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleInputFocus = useCallback(() => {
    setOrbState("listening")
  }, [])

  const handleInputBlur = useCallback(() => {
    if (!query.trim()) setOrbState(result ? "ready" : "idle")
  }, [query, result])

  /* Rich intent preview */
  const [intentPreview, setIntentPreview] = useState<{ intent: string; entities: string[]; surfaces: string[] } | null>(null)
  useEffect(() => {
    if (query.trim().length > 3) {
      const parsed = parseIntent(query)
      const intentInfo = INTENT_LABELS[parsed.intent] || INTENT_LABELS.show
      setIntentPreview({
        intent: intentInfo.label,
        entities: parsed.entities.map(e => e.value),
        surfaces: intentInfo.surfaces,
      })
    } else {
      setIntentPreview(null)
    }
  }, [query])

  /* Clear workspace */
  const handleClearWorkspace = useCallback(() => {
    setResult(null)
    setOrbState("idle")
    setIsEngaged(false)
  }, [])

  return (
    <div className="relative">
      {/* Background energy field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: RADIUS.card }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
          style={{ background: `radial-gradient(ellipse at center, rgba(${ACCENT.blue.rgb},0.03), rgba(${ACCENT.purple.rgb},0.015) 40%, transparent 70%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(${ACCENT.blue.rgb},0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(${ACCENT.blue.rgb},0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ══════════════════��═══════════════════════════
            ZONE 1 + 2: CORE + DEEP SIDE INTELLIGENCE
            ══════════════════════════════════════════════ */}
        <motion.div
          animate={{
            paddingBottom: isEngaged ? 8 : 0,
          }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-0 items-start"
        >
          {/* ── LEFT LANE: SESSION / PLAN / PROTECTION ── */}
          <ScrollableLane
            cards={leftLane}
            label="Session / Plan / Protection"
            accentRgb={ACCENT.cyan.rgb}
            direction="left"
            onCardClick={executeCommand}
          />

          {/* ── CENTER: NEURAL ORB + COMMAND INPUT ── */}
          <div className="flex flex-col items-center py-4 px-4 min-w-0">
            {/* Session mode pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5 mb-5"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `rgba(${mode.color},0.8)` }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color: `rgba(${mode.color},0.6)` }}>
                {mode.label}
              </span>
              <span className="w-px h-3" style={{ background: `rgba(${ACCENT.slate.rgb},0.12)` }} />
              <span className="text-[9px] font-mono tracking-wider" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }}>
                Archio Command
              </span>
            </motion.div>

            {/* THE ORB -- shrinks in engaged mode */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: isEngaged ? 0.65 : 1,
              }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <NeuralOrb
                state={orbState}
                size={isEngaged ? 140 : 200}
                onHover={() => { if (orbState === "idle") setOrbState("hover") }}
                onLeave={() => { if (orbState === "hover") setOrbState("idle") }}
                onClick={() => inputRef.current?.focus()}
              />
            </motion.div>

            {/* COMMAND INPUT -- premium with rich intent preview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              className="w-full max-w-[480px]"
              style={{ marginTop: isEngaged ? 12 : 28 }}
            >
              {/* Rich intent preview */}
              <AnimatePresence>
                {intentPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2 px-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{
                          background: `rgba(${INTENT_LABELS[parseIntent(query).intent]?.color || ACCENT.cyan.rgb},0.1)`,
                          color: `rgba(${INTENT_LABELS[parseIntent(query).intent]?.color || ACCENT.cyan.rgb},0.7)`,
                          border: `1px solid rgba(${INTENT_LABELS[parseIntent(query).intent]?.color || ACCENT.cyan.rgb},0.15)`,
                        }}
                      >
                        {intentPreview.intent}
                      </span>
                      {intentPreview.entities.slice(0, 3).map((entity, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                          style={{
                            background: `rgba(${ACCENT.purple.rgb},0.06)`,
                            color: `rgba(${ACCENT.purple.rgb},0.6)`,
                          }}
                        >
                          {entity}
                        </span>
                      ))}
                      <span className="text-[8px] font-mono" style={{ color: `rgba(${ACCENT.slate.rgb},0.2)` }}>
                        {">"} {intentPreview.surfaces.join(" + ")}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input bar */}
              <div
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300"
                style={{
                  background: orbState === "listening"
                    ? `rgba(${ACCENT.blue.rgb},0.05)`
                    : `rgba(${ACCENT.slate.rgb},0.03)`,
                  border: `1px solid rgba(${orbState === "listening" ? ACCENT.blue.rgb : ACCENT.slate.rgb},${orbState === "listening" ? 0.15 : 0.06})`,
                  boxShadow: orbState === "listening"
                    ? `0 0 30px rgba(${ACCENT.blue.rgb},0.06), inset 0 0 30px rgba(${ACCENT.blue.rgb},0.02)`
                    : "none",
                }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: `rgba(${orbState === "listening" ? ACCENT.blue.rgb : ACCENT.slate.rgb},${orbState === "listening" ? 0.5 : 0.2})` }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={PLACEHOLDERS[sessionMode][placeholderIdx]}
                  className="flex-1 bg-transparent text-[13px] text-white/90 placeholder:text-white/18 focus:outline-none font-medium"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={orbState === "processing" || orbState === "rendering"}
                />
                <button
                  disabled
                  className="w-8 h-8 rounded-xl flex items-center justify-center cursor-not-allowed"
                  style={{ background: `rgba(${ACCENT.slate.rgb},0.04)` }}
                  aria-label="Voice input coming soon"
                  title="Voice -- Phase 2"
                >
                  <Mic className="w-3.5 h-3.5" style={{ color: `rgba(${ACCENT.slate.rgb},0.15)` }} />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || orbState === "processing" || orbState === "rendering"}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-20"
                  style={{
                    background: query.trim() ? `rgba(${ACCENT.blue.rgb},0.15)` : `rgba(${ACCENT.slate.rgb},0.04)`,
                    border: query.trim() ? `1px solid rgba(${ACCENT.blue.rgb},0.25)` : `1px solid transparent`,
                  }}
                  aria-label="Send command"
                >
                  <Send className="w-3.5 h-3.5" style={{ color: query.trim() ? `rgba(${ACCENT.blue.rgb},0.9)` : `rgba(${ACCENT.slate.rgb},0.15)` }} />
                </button>
              </div>

              {/* Quick intent chips with descriptor on hover */}
              <AnimatePresence>
                {!isEngaged && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 px-1"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {quickIntents.map((chip, i) => {
                        const Icon = chip.icon
                        return (
                          <motion.button
                            key={chip.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.04 }}
                            onClick={() => executeCommand(chip.query)}
                            onMouseEnter={() => setHoveredChip(chip.label)}
                            onMouseLeave={() => setHoveredChip(null)}
                            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200"
                            style={{
                              background: `rgba(${chip.color},0.04)`,
                              border: `1px solid rgba(${chip.color},0.08)`,
                              color: `rgba(${chip.color},0.6)`,
                            }}
                            onMouseEnterCapture={(e) => {
                              const el = e.currentTarget
                              el.style.background = `rgba(${chip.color},0.1)`
                              el.style.borderColor = `rgba(${chip.color},0.2)`
                              el.style.color = `rgba(${chip.color},0.9)`
                              el.style.transform = "translateY(-1px)"
                            }}
                            onMouseLeaveCapture={(e) => {
                              const el = e.currentTarget
                              el.style.background = `rgba(${chip.color},0.04)`
                              el.style.borderColor = `rgba(${chip.color},0.08)`
                              el.style.color = `rgba(${chip.color},0.6)`
                              el.style.transform = "translateY(0)"
                            }}
                          >
                            <Icon className="w-3 h-3" />
                            {chip.label}
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Descriptor panel for hovered chip */}
                    <AnimatePresence>
                      {hoveredChip && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 mx-auto max-w-[400px]"
                        >
                          {quickIntents.filter(c => c.label === hoveredChip).map(chip => (
                            <div
                              key={chip.label}
                              className="p-3 rounded-xl"
                              style={{
                                background: `rgba(${chip.color},0.03)`,
                                border: `1px solid rgba(${chip.color},0.08)`,
                              }}
                            >
                              <p className="text-[10px] leading-[1.6] text-white/50 mb-2">
                                {chip.descriptor}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }}>
                                  Surfaces:
                                </span>
                                {chip.surfaces.map(s => (
                                  <span key={s} className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `rgba(${chip.color},0.06)`, color: `rgba(${chip.color},0.5)` }}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── RIGHT LANE: MENTOR / MARKET / SIGNAL ── */}
          <ScrollableLane
            cards={rightLane}
            label="Mentor / Market / Signal"
            accentRgb={ACCENT.purple.rgb}
            direction="right"
            onCardClick={executeCommand}
          />
        </motion.div>

        {/* ── Mobile proactive (horizontal scroll) ── */}
        <div className="lg:hidden px-4 pb-4">
          <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {[...leftLane.slice(0, 2), ...rightLane.slice(0, 2)].map((card, i) => {
              const Icon = card.icon
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  onClick={() => executeCommand(card.action)}
                  className="flex items-start gap-2.5 p-3 rounded-xl flex-shrink-0 min-w-[240px] text-left transition-all duration-200"
                  style={{
                    background: `rgba(${card.color},0.04)`,
                    border: `1px solid rgba(${card.color},0.06)`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: `rgba(${card.color},0.6)` }} />
                  <div>
                    <span className="text-[10px] font-semibold text-white/70 block">{card.title}</span>
                    <span className="text-[9px] text-white/35 block mt-0.5 leading-[1.4]">{card.detail.slice(0, 80)}...</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            ZONE 4: SUMMONED WORKSPACE
            ══════════════════════════════════════════════ */}
        <AnimatePresence>
          {result && (
            <SummonedWorkspace
              result={result}
              orbState={orbState}
              isEngaged={isEngaged}
              onClear={handleClearWorkspace}
              onExecuteCommand={executeCommand}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
