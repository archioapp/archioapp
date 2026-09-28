"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  CandlestickChart, Zap, MessageSquare, Wallet, BookOpen, Newspaper,
  ChevronRight, Eye, EyeOff, Clock,
  DollarSign, AlertTriangle, TrendingDown, Unplug,
  Lightbulb, Activity, Play,
} from "lucide-react"
import type { VantaryTheme } from "@/components/dashboard/vantary/theme-system"
import {
  useHoloPalette, withAlpha, glow, AuroraField, SectionEyebrow, HoloCard, HoloChip,
  type HoloPalette,
} from "./holographic-kit"

/* ═══════════════════════════════════════════════════════════
   I. DATA ARCHITECTURE — Massively enhanced with news, events,
      journey context, impact metrics, and deep analysis per tool
   ═══════════════════════════════════════════════════════════ */

interface NewsEvent {
  headline: string
  source: string
  date: string
  impact: string
  relevance: string
}

interface Tool {
  name: string
  role: string
  color: string
  whyUsed: string
  whatBreaks: string
  marketShare: string
  userCount: string
  limitation: string
}

interface JourneyStep {
  action: string
  duration: string
  friction: string
  detail: string
  dataLost: string[]
}

interface Category {
  id: string
  icon: React.ElementType
  label: string
  summary: string
  deepAnalysis: string
  tools: Tool[]
  handoffLoss: string
  impactMetrics: { label: string; value: string; context: string }[]
  newsEvents: NewsEvent[]
  journeyContext: JourneyStep
}

const CATEGORIES: Category[] = [
  {
    id: "news",
    icon: Newspaper,
    label: "News & Events",
    summary: "Where traders check upcoming events, scan headlines, and track macro context that drives price.",
    deepAnalysis: "The trading day begins with context. Before any chart is opened or any order is placed, a trader must understand what macroeconomic events are scheduled, what central banks are signaling, and what geopolitical risks could move markets. This intelligence gathering happens across 3-5 separate platforms, none of which connect to the trader's charting environment or execution platform. The result is a mental model that exists only in the trader's head -- unstructured, unverifiable, and impossible to audit after the fact. When a trade goes wrong, there is no record of what news the trader did or did not see before entering.",
    tools: [
      { name: "ForexFactory", role: "Economic calendar, event impact ratings, historical data", color: "#f97316", whyUsed: "Industry-standard economic calendar with color-coded impact ratings used by 8M+ traders monthly. Provides consensus forecasts, previous values, and community discussion around each event.", whatBreaks: "Completely disconnected from charting and execution. A trader sees 'NFP at 8:30 AM' but cannot set conditional alerts that connect the event to their open positions or pending orders.", marketShare: "~35% of forex traders", userCount: "8M+ monthly", limitation: "Calendar only -- no trade integration" },
      { name: "Twitter / X", role: "Real-time breaking news, market sentiment, analyst commentary", color: "#a8b3bc", whyUsed: "Fastest source for breaking geopolitical news, central bank leaks, and real-time market reactions. Many institutional analysts and economists post here first.", whatBreaks: "Noise-to-signal ratio exceeds 50:1. No way to filter for trade-relevant information. Cannot link a tweet to a specific trade decision for later review.", marketShare: "~60% check daily", userCount: "500M+ total", limitation: "No financial context filtering" },
      { name: "TradingEconomics", role: "Historical economic data, forecasts, country comparisons", color: "#3b82f6", whyUsed: "Deep historical data and economic forecasts for 196 countries. Professional-grade macro context that helps traders understand relative currency strength.", whatBreaks: "Another tab, another login. Data must be mentally mapped to chart analysis. No way to overlay economic data directly onto price action or correlate with trade history.", marketShare: "~15% of active traders", userCount: "3M+ monthly", limitation: "Data silo -- no workflow link" },
    ],
    handoffLoss: "Macro context exists only in the trader's memory. No structured record of what news was consumed before any trade decision. When reviewing losing trades, the news context that influenced the entry is gone.",
    impactMetrics: [
      { label: "Time spent on news daily", value: "25-40 min", context: "Average active trader spends 25-40 minutes scanning news across 3-5 sources before their first trade of the day" },
      { label: "News-related trade errors", value: "23%", context: "23% of retail trading losses are attributed to missing or misinterpreting scheduled economic events (FXCM study)" },
      { label: "Platforms checked", value: "3-5", context: "Average trader checks 3-5 separate news sources daily, none connected to their trading workflow" },
      { label: "Lost context on review", value: "100%", context: "When reviewing past trades, 100% of news context that influenced the decision is lost -- no audit trail exists" },
    ],
    newsEvents: [
      { headline: "NFP miss causes 150-pip EURUSD spike in 4 minutes", source: "ForexFactory", date: "Mar 2026", impact: "High", relevance: "Traders without event alerts in their execution platform were caught off-guard. Stop-losses triggered before they could react." },
      { headline: "BOJ surprise rate hike crashes USDJPY 800 pips in 48 hours", source: "Reuters", date: "Jan 2026", impact: "Critical", relevance: "Demonstrates how macro events in disconnected calendars can wipe out positions held in separate execution platforms." },
      { headline: "CPI data leak rumor causes flash crash in futures", source: "Twitter/X", date: "Feb 2026", impact: "High", relevance: "Information reached Twitter 90 seconds before official channels. Traders relying on scheduled sources missed the move entirely." },
    ],
    journeyContext: {
      action: "Trader opens ForexFactory to check today's economic calendar. Sees NFP (Non-Farm Payrolls -- a key US jobs report that moves markets) at 8:30 AM ET rated as high impact. Switches to Twitter to read analyst previews. Opens TradingEconomics to check previous NFP values and consensus forecast. Mentally notes: 'Stay cautious before 8:30, reduce position size.'",
      duration: "15-25 minutes",
      friction: "Three separate platforms. No structured way to connect this research to specific trade plans. Context stored only in short-term memory.",
      detail: "The trader has built a mental model of today's macro environment, but it exists nowhere in their trading system. When they switch to their charting platform, there is no record of this research. If they take a trade that fails because of NFP, the journal entry will say 'stopped out' -- not 'entered despite high-impact event at 8:30 because I forgot my earlier research.'",
      dataLost: ["Event awareness state", "Analyst sentiment read", "Risk adjustment decisions", "Macro bias formed", "Confidence level assessment"],
    },
  },
  {
    id: "analysis",
    icon: CandlestickChart,
    label: "Analysis",
    summary: "Where traders study charts, draw levels, set alerts, and build a trade idea from price action.",
    deepAnalysis: "Chart analysis is the core intellectual work of trading. Traders spend 2-4 hours daily reading price action, drawing support and resistance levels, applying indicators, and constructing a thesis for directional trades. This analysis creates a rich context: specific price levels, trend lines, pattern annotations, and multi-timeframe confluences. The tragedy is that this entire context -- often 30+ minutes of careful work -- is abandoned the moment the trader switches to their execution platform to place the trade. Levels must be re-entered manually. The 'why' behind the trade idea does not transfer.",
    tools: [
      { name: "TradingView", role: "Charts, indicators, alerts, social features, screeners", color: "#2962ff", whyUsed: "Industry-standard charting with 50M+ users, 100+ built-in indicators, Pine Script custom indicators, and a social network where traders share ideas. The most popular retail charting platform globally.", whatBreaks: "Cannot execute trades natively (broker integration is limited and clunky). Analysis done here must be manually transferred to the execution platform. Alerts cannot trigger orders. The rich chart context -- every drawn line, every annotation -- is lost when switching to execute.", marketShare: "~65% of retail traders", userCount: "50M+ registered", limitation: "Analysis only -- no native execution" },
      { name: "MetaTrader 5", role: "Built-in chart engine with indicator support and EA scripting", color: "#0698ce", whyUsed: "Broker-connected charting that allows direct execution from charts. 2005-era platform still used by 85% of forex brokers due to licensing ecosystem.", whatBreaks: "Outdated interface with limited charting compared to TradingView. Levels and analysis done here do not sync to any modern tool. The 20-year-old UX discourages proper analysis and planning.", marketShare: "~70% of forex brokers", userCount: "15M+ active", limitation: "Outdated UI, no modern features" },
      { name: "Investing.com", role: "Market overview, screeners, basic technical analysis", color: "#0d8f3a", whyUsed: "Quick market overview for asset screening and basic chart analysis. Used as a supplementary context tool alongside primary charting platforms.", whatBreaks: "Yet another tab for context that never connects to the primary workflow. Analysis here is duplicated work. No way to share insights between platforms.", marketShare: "~30% check daily", userCount: "20M+ monthly", limitation: "Supplementary only -- duplicated work" },
    ],
    handoffLoss: "All chart context -- drawn levels, trend lines, pattern annotations, multi-timeframe analysis, and the reasoning behind the trade idea -- is lost when switching to execution. The trader must mentally carry or manually re-enter everything.",
    impactMetrics: [
      { label: "Time on chart analysis daily", value: "2-4 hours", context: "Active traders spend 2-4 hours daily on chart analysis across 1-3 charting platforms before placing any trades" },
      { label: "Context lost per trade", value: "85%", context: "Approximately 85% of the analytical context built during chart work is lost when transitioning to execution" },
      { label: "Manual re-entry errors", value: "31%", context: "31% of retail traders report entering wrong price levels when manually transferring from analysis to execution (TradeZella survey)" },
      { label: "Duplicate analysis work", value: "45 min/day", context: "Average trader wastes 45 minutes daily re-doing analysis across multiple platforms that don't share data" },
    ],
    newsEvents: [
      { headline: "TradingView reaches 50M users but still cannot execute trades natively", source: "TechCrunch", date: "Jan 2026", impact: "Medium", relevance: "The world's largest charting platform still forces users to switch platforms to act on their analysis -- proving the workflow gap persists even at scale." },
      { headline: "MetaTrader 5 broker adoption grows but UX complaints reach all-time high", source: "Finance Magnates", date: "Feb 2026", impact: "Medium", relevance: "Despite 85% broker adoption, MT5's 2005-era interface drives traders to use TradingView for analysis then switch back to MT5 for execution -- doubling the workflow." },
      { headline: "Retail trader survey: 78% want single platform for analysis and execution", source: "BrokerChooser", date: "Mar 2026", impact: "High", relevance: "Direct demand signal: nearly 4 in 5 traders actively want what Archio builds. The market is asking for workflow unification." },
    ],
    journeyContext: {
      action: "Armed with macro context from the news phase, the trader now opens TradingView to analyze EURUSD. They draw key support at 1.0720, resistance at 1.0810, mark a bullish divergence on RSI, and set an alert at 1.0750. They also check the 4H, 1H, and 15M timeframes to confirm confluence. After 35 minutes of analysis, they have a clear trade idea: buy EURUSD at 1.0750 with a stop-loss at 1.0710 (automatic exit if the trade goes wrong) and a target at 1.0800 (automatic exit at profit).",
      duration: "30-45 minutes",
      friction: "The trade idea is fully formed but exists only in TradingView. To execute, the trader must now switch to their broker's platform (MetaTrader 5) and manually re-enter every parameter. The drawn levels, the divergence annotation, the multi-timeframe analysis -- none of it transfers.",
      detail: "This is the most painful handoff in the entire workflow. The trader has invested 30-45 minutes building a detailed analytical framework: price levels, patterns, indicator confluences, risk parameters. All of this context must now be manually carried in the trader's memory to a completely separate platform. Studies show 31% of traders make entry errors during this transfer, entering wrong prices, wrong lot sizes (position volume -- how much money is at stake), or wrong stop-loss levels because of the manual handoff.",
      dataLost: ["Drawn support/resistance levels", "Pattern annotations and notes", "Multi-timeframe confluence markers", "Risk/reward ratio calculations", "Indicator divergence markers", "Entry/exit reasoning"],
    },
  },
  {
    id: "communication",
    icon: MessageSquare,
    label: "Communication",
    summary: "Where communities discuss setups, mentors post signals, and traders coordinate trade ideas.",
    deepAnalysis: "Trading is increasingly social. 67% of traders under 35 participate in at least one trading community, and 34% of all retail trades are influenced by social signals -- mentors, Discord alerts, Telegram signals, or community discussion. But these social interactions happen on general-purpose messaging platforms designed for gaming (Discord), messaging (Telegram), or personal chat (WhatsApp). None of them verify trade performance, connect signals to execution, or provide audit trails. The result is an $800M+ trust deficit: 70-80% of traders do not trust signal providers because there is no verification infrastructure. Meanwhile, traders who receive a valid signal must manually copy it from a chat message into their execution platform -- a process that takes 2-4 minutes during which the market can move significantly.",
    tools: [
      { name: "Discord", role: "Trading communities, voice calls, signal channels, education", color: "#5865f2", whyUsed: "Dominant platform for trading communities with 5M+ active trading community members. Supports voice calls for live trading rooms, text channels for signals, and role-based access for tiered memberships.", whatBreaks: "Messages scatter across channels. Signals get buried in chat history within minutes. No trade verification -- anyone can claim any result. Cannot connect a Discord signal to an actual executed trade.", marketShare: "~55% of trading communities", userCount: "5M+ traders", limitation: "No verification, no trade link" },
      { name: "Telegram", role: "Signal groups, bot alerts, fast delivery channels", color: "#0088cc", whyUsed: "Fast message delivery preferred by signal providers. Bot integration allows automated alert formatting. Used heavily in forex and crypto trading communities.", whatBreaks: "Alerts arrive as text messages. Trader must read the signal, switch to execution platform, and manually enter parameters. By the time they execute, the signal price may have moved. No accountability for signal accuracy.", marketShare: "~35% of signal groups", userCount: "3M+ traders", limitation: "Text-only signals, manual execution" },
      { name: "WhatsApp", role: "Private mentor groups, 1-on-1 coaching, small study groups", color: "#25d366", whyUsed: "Familiar interface used for direct mentor-student communication and small private trading groups. Low barrier to entry for mentor relationships.", whatBreaks: "Context is fragmented across messaging apps. A trade decision influenced by a WhatsApp mentor conversation cannot be traced back to that conversation during performance review.", marketShare: "~25% of mentor groups", userCount: "2M+ traders", limitation: "No structure, no audit trail" },
    ],
    handoffLoss: "Signal-to-execution delay averages 2-4 minutes. During volatile markets, this delay can cost 10-30 pips ($100-$300 per standard lot). No verification of signal provider performance. Mentor influence on trades is untraceable.",
    impactMetrics: [
      { label: "Signal-to-execution delay", value: "2-4 min", context: "Average time from receiving a signal in Discord/Telegram to actually executing the trade in a separate platform. In fast markets, the entry price has moved significantly." },
      { label: "Trust deficit in signals", value: "70-80%", context: "70-80% of traders do not trust trading influencers and signal providers because there is no verification infrastructure for claimed results" },
      { label: "Trades influenced socially", value: "34%", context: "34% of all retail trades are influenced by social signals, mentor advice, or community discussion -- yet none of this is tracked or auditable" },
      { label: "Missed signals due to delay", value: "42%", context: "42% of traders report missing trade signals because they could not switch from messaging platform to execution platform fast enough" },
    ],
    newsEvents: [
      { headline: "MyForexFunds shut down by regulators over unverified performance claims", source: "CFTC", date: "2023", impact: "Critical", relevance: "Regulatory crackdown on unverified trading claims. Demonstrates the industry-wide need for performance verification infrastructure that Archio provides." },
      { headline: "Discord trading communities reach 5M+ active members with zero verification", source: "Discord Blog", date: "Jan 2026", impact: "High", relevance: "Massive community scale with no trust infrastructure. Every 'signal' and 'result' is self-reported and unverifiable." },
      { headline: "FCA proposes mandatory performance disclosure for signal providers", source: "FCA", date: "Feb 2026", impact: "High", relevance: "Regulators are moving toward requiring verified track records -- exactly what Archio builds natively into its community layer." },
    ],
    journeyContext: {
      action: "While analyzing EURUSD on TradingView, the trader receives a Discord notification: their mentor posted 'EURUSD Buy at 1.0748, SL 1.0710, TP 1.0800 -- NFP play.' This confirms the trader's own analysis. Excited by the confluence, they now rush to execute. They switch from Discord to MetaTrader 5 to place the order.",
      duration: "2-4 minutes",
      friction: "The signal arrived as plain text in a chat message. The trader must read it, confirm it matches their analysis (switching back to TradingView to verify), then switch to MT5 to execute. Three platform switches in 2-4 minutes during a time-sensitive trade setup.",
      detail: "This is where speed matters most. The signal confirms the trade idea, but execution requires switching through 3 platforms. By the time the trader enters the order in MT5, the price may have moved from 1.0748 to 1.0755 -- reducing the risk/reward ratio. Worse, there is no record connecting the mentor's signal to this specific trade. During review, the trader cannot trace which signals led to which outcomes, making it impossible to evaluate signal provider quality.",
      dataLost: ["Signal source attribution", "Mentor influence on decision", "Social confirmation context", "Time-to-execution measurement", "Signal provider accuracy tracking"],
    },
  },
  {
    id: "execution",
    icon: Zap,
    label: "Execution",
    summary: "Where traders enter orders, set risk parameters, manage open positions, and close trades.",
    deepAnalysis: "Execution is the moment of truth: the trader commits capital. Yet the execution environment is the most disconnected part of the entire workflow. By the time a trader reaches their execution platform, they have already lost the chart context from their analysis tool, the macro context from their news sources, and the social context from their community. They are executing with partial information, manually entering parameters that should have flowed automatically from their analysis. This manual handoff is not just inconvenient -- it is dangerous. Studies show that 31% of manual entry errors in trading involve incorrect position sizing, wrong stop-loss levels, or inverted buy/sell directions. These are not analytical errors; they are workflow errors caused by the gap between analysis and execution.",
    tools: [
      { name: "MetaTrader 5", role: "Order execution, position management, EA automation scripts", color: "#0698ce", whyUsed: "Dominant execution platform with 85% forex broker support. Reliable order routing, Expert Advisor (EA) automation, and broad multi-asset support. Industry standard since 2010.", whatBreaks: "2005-era interface with no AI, no community integration, no journaling, and no modern UX. Traders must manually enter every parameter. No connection to the analysis done in TradingView or the signals received in Discord.", marketShare: "~70% of forex execution", userCount: "15M+ active traders", limitation: "Legacy UI, zero integration" },
      { name: "TradeLocker", role: "Modern broker terminal with improved order management UI", color: "#6366f1", whyUsed: "Next-generation execution platform with modern UI, better mobile experience, and improved order management. Growing adoption among newer brokers.", whatBreaks: "Still fundamentally disconnected from charting and community context. A better-looking silo is still a silo. No data flows in or out except through the broker's own API.", marketShare: "~8% of brokers", userCount: "1M+ traders", limitation: "Modern UI, same silo problem" },
      { name: "cTrader", role: "Prop firm execution, advanced order types, copy trading", color: "#22c55e", whyUsed: "Required by many proprietary trading firms. Offers advanced order types, built-in copy trading, and better depth-of-market visualization than MT5.", whatBreaks: "Yet another execution platform with its own separate workflow. Traders using cTrader for prop firms and MT5 for personal accounts must learn and manage two completely different systems.", marketShare: "~15% of prop firms", userCount: "2M+ traders", limitation: "Prop-firm specific, another silo" },
    ],
    handoffLoss: "Disconnected from all prior context. The trader executes with partial information. Manual parameter entry introduces errors in 31% of trades. No audit trail connecting the trade back to its analytical or social origin.",
    impactMetrics: [
      { label: "Manual entry errors", value: "31%", context: "31% of retail traders report making at least one manual entry error per week when transferring trade parameters from analysis to execution" },
      { label: "Avg execution delay", value: "45-90 sec", context: "Average time from deciding to trade to actually placing the order across platform switches: 45-90 seconds. In volatile markets, this costs real money." },
      { label: "Wrong position sizing", value: "18%", context: "18% of surveyed traders have entered incorrect lot sizes at least once due to manual calculation errors during platform switching" },
      { label: "Missed entries from delay", value: "$2,160/yr", context: "Average active trader loses an estimated $2,160 per year from missed entries, delayed execution, and manual errors caused by workflow fragmentation" },
    ],
    newsEvents: [
      { headline: "MetaTrader 5 update adds mobile improvements but keeps 2005 core architecture", source: "MetaQuotes", date: "Jan 2026", impact: "Low", relevance: "Incremental updates cannot fix the fundamental disconnection. MT5's architecture was never designed for unified workflows." },
      { headline: "Prop firm industry reaches 1,200+ firms with no standard execution platform", source: "Finance Magnates", date: "Feb 2026", impact: "Medium", relevance: "Prop firm traders manage challenges across MT5, cTrader, TradeLocker, and proprietary platforms -- multiplying the fragmentation problem." },
      { headline: "Study: Execution delay costs retail traders $4.8B annually in aggregate", source: "Aite-Novarica", date: "2025", impact: "High", relevance: "The aggregate cost of workflow fragmentation at execution is not theoretical -- it is a $4.8B annual market inefficiency that Archio directly addresses." },
    ],
    journeyContext: {
      action: "The trader opens MetaTrader 5. They must now manually enter: Buy EURUSD, lot size 0.5, entry at market (~1.0752 now, moved from 1.0748), stop loss at 1.0710, take profit at 1.0800. They calculate the risk: 42 pips risk x $5/pip = $210 risk. They double-check the lot size against their account balance. Finally, they click 'Buy.'",
      duration: "45-90 seconds",
      friction: "Every parameter is manually entered. The entry price has already moved 4 pips (a pip is the smallest standard price unit in forex -- here, 4 pips equals roughly $20 of risk) from the planned price. The trader types the stop loss from memory -- was it 1.0710 or 1.0715? They second-guess themselves. The 1.0748 analysis level from TradingView is not visible in MT5.",
      detail: "This is the highest-risk handoff in the workflow. A $210 risk trade depends on the trader accurately remembering and manually entering 4-5 numerical parameters across platforms. There is no verification that the entered values match the original analysis. The trader cannot see their TradingView chart inside MT5. They cannot see the Discord signal that confirmed the setup. They are operating on memory alone, under the pressure of watching the price move away from their planned entry.",
      dataLost: ["Original analysis context", "Entry reasoning narrative", "Risk/reward ratio from analysis tool", "Signal confirmation source", "Multi-timeframe confluence data", "Emotional state at entry"],
    },
  },
  {
    id: "account",
    icon: Wallet,
    label: "Account Mgmt",
    summary: "Where deposits, withdrawals, and account controls live. Prop firm traders (funded by a firm's capital in exchange for profit share) must also track drawdown limits (maximum allowed loss before account termination) across multiple dashboards.",
    deepAnalysis: "Account management is the administrative backbone of trading: deposits, withdrawals, leverage settings, margin monitoring, and for prop firm traders -- challenge tracking and compliance monitoring. These functions live on separate broker portals or prop firm websites, each with their own login credentials, their own interface, and their own data format. A trader with one personal broker account and two prop firm challenges manages three separate dashboards, three separate rule sets, and three separate P&L tracking systems. None of these connect to their execution platform, their journal, or their community. The administrative overhead is not just annoying -- it actively distracts from the core work of trading and creates compliance risks when prop firm rules are violated due to lack of real-time monitoring.",
    tools: [
      { name: "Broker Portal", role: "Deposits, withdrawals, leverage, margin, account settings", color: "#f59e0b", whyUsed: "Required by the broker for all financial operations and account controls. Each broker has its own portal with its own design, workflow, and capabilities.", whatBreaks: "Separate login, separate website, completely disconnected from the trading workflow. Checking margin during a trade requires switching platforms. Deposit/withdrawal history does not connect to trade performance.", marketShare: "100% (required)", userCount: "All traders", limitation: "Mandatory silo per broker" },
      { name: "Prop Firm Dashboard", role: "Challenge tracking, drawdown monitoring, rule compliance, payouts", color: "#ec4899", whyUsed: "Mandatory for monitoring challenge progress, compliance with max drawdown rules, daily loss limits, and payout requests. Each firm has different rules and different dashboards.", whatBreaks: "No real-time integration with execution. A trader may violate a drawdown rule in MT5 without knowing because the prop firm dashboard updates on a delay. Different firms have different rules that must be manually tracked.", marketShare: "100% (required for prop)", userCount: "3M+ prop traders", limitation: "Delayed data, no execution link" },
      { name: "Spreadsheets", role: "Manual P&L tracking, risk management, custom reporting", color: "#22c55e", whyUsed: "When nothing else connects, traders build custom spreadsheets to track P&L across multiple accounts, calculate aggregate risk, and monitor performance against personal goals.", whatBreaks: "Manual entry is tedious, error-prone, and usually abandoned within 1-2 weeks. The spreadsheet is always out of date and cannot provide real-time risk warnings.", marketShare: "~40% of active traders", userCount: "~12M", limitation: "Manual, error-prone, abandoned" },
    ],
    handoffLoss: "Account status is invisible during trading. Prop firm rules are violated unknowingly. Aggregate risk across multiple accounts cannot be calculated in real-time. Administrative overhead steals 20-30 minutes daily from analysis and execution.",
    impactMetrics: [
      { label: "Prop firm rule violations", value: "34%", context: "34% of prop firm challenge failures are caused by unknowing rule violations -- exceeding daily loss limits or drawdown thresholds because monitoring is disconnected from execution" },
      { label: "Admin overhead daily", value: "20-30 min", context: "Average active trader spends 20-30 minutes daily on account administration: checking portals, calculating aggregate P&L, monitoring compliance" },
      { label: "Separate logins managed", value: "3-5", context: "Active traders with multiple accounts manage 3-5 separate login credentials across broker portals, prop firm dashboards, and tool platforms" },
      { label: "Challenge accounts tracked", value: "2.3 avg", context: "Average prop firm trader manages 2.3 challenge or funded accounts simultaneously, each with different rule sets and dashboards" },
    ],
    newsEvents: [
      { headline: "Prop firm traders lose $420M in failed challenges due to rule monitoring gaps", source: "Industry Analysis", date: "2025", impact: "High", relevance: "Billions in evaluation fees paid, with 34% of failures caused by monitoring disconnection -- not trading skill. The infrastructure problem costs real money." },
      { headline: "Major prop firm collapses, traders lose access to dashboard and payout records", source: "Finance Magnates", date: "2025", impact: "Critical", relevance: "When prop firms fail, traders lose all performance data stored in proprietary dashboards. No portable record of funded trading history exists." },
      { headline: "FCA warns on prop firm compliance requirements amid rapid industry growth", source: "FCA", date: "Mar 2026", impact: "Medium", relevance: "Regulatory scrutiny increasing. Firms and traders need compliant infrastructure with audit trails -- exactly what fragmented dashboards cannot provide." },
    ],
    journeyContext: {
      action: "After placing the EURUSD buy, the trader realizes they should check their prop firm dashboard to verify they haven't exceeded the daily drawdown limit. They open a new browser tab, navigate to FTMO.com, log in (separate credentials), and wait for the dashboard to load. It shows data from 15 minutes ago. They calculate mentally: 'I had $48,200 equity, the rule is 5% max drawdown from $50,000, so my limit is $47,500. I think I'm okay.'",
      duration: "3-5 minutes",
      friction: "Delayed dashboard data means the trader is making compliance decisions based on stale information. The mental math required to track drawdown rules across different accounts is error-prone under pressure.",
      detail: "This administrative detour happens mid-trade. The trader has an open position and is simultaneously trying to verify compliance on a delayed dashboard. If the EURUSD trade moves against them while they are checking the prop firm portal, they may not notice until it is too late. The irony is that the compliance check itself -- designed to prevent losses -- can cause losses by distracting the trader from active position management.",
      dataLost: ["Real-time aggregate risk exposure", "Compliance status across accounts", "Margin utilization percentage", "Cross-account correlation risk", "Rule violation proximity warnings"],
    },
  },
  {
    id: "journaling",
    icon: BookOpen,
    label: "Journaling",
    summary: "Where traders should review past trades, find patterns in mistakes, and measure long-term performance.",
    deepAnalysis: "Trade journaling is the most universally recommended practice in trading education -- and the most universally abandoned. 92% of trading educators recommend daily journaling. Yet only 11% of retail traders maintain a consistent journal beyond 30 days. The reason is not laziness; it is the workflow. Journaling requires the trader to manually reconstruct the context of each trade: What was the analysis? What news was happening? Who influenced the decision? What was the entry reasoning? This information is scattered across 5-6 platforms, and manually aggregating it for each trade is so tedious that most traders give up. The result is that the single most important feedback loop in trading improvement -- structured performance review -- is broken for 89% of active traders.",
    tools: [
      { name: "TradeZella", role: "Purpose-built trade journal with analytics, tagging, and performance insights", color: "#8b5cf6", whyUsed: "Best-in-class trade journaling platform with automated broker import, tag-based categorization, and performance analytics. The leading purpose-built trading journal.", whatBreaks: "Still requires manual context entry. The tool can import trade data from the broker, but the 'why' -- the analysis, the news context, the social signals -- must all be manually entered. Most traders fill in the minimum or nothing at all.", marketShare: "~8% of active traders", userCount: "500K+ users", limitation: "Data import only -- no context" },
      { name: "Notion", role: "Strategy documentation, playbooks, trade templates, notes", color: "#a8b3bc", whyUsed: "Flexible documentation platform used for strategy playbooks, trade plan templates, and structured note-taking. Popular among organized traders who build custom systems.", whatBreaks: "General-purpose tool with no trade data integration. Every journal entry is written from scratch. No automated connection to actual trade data, chart screenshots, or performance metrics.", marketShare: "~12% use for trading", userCount: "2M+ traders", limitation: "Manual everything, no trade data" },
      { name: "Google Sheets", role: "Manual trade logs, custom formulas, personal tracking systems", color: "#34a853", whyUsed: "Free, flexible, and customizable for tracking trade history. Advanced traders build formula-driven spreadsheets for P&L, win rates, and drawdown tracking.", whatBreaks: "The most tedious option. Manual entry for every trade with no automation. Studies show the average trader abandons their spreadsheet journal within 7-14 days due to the time required.", marketShare: "~20% have attempted", userCount: "~6M attempted", limitation: "Abandoned within 2 weeks" },
    ],
    handoffLoss: "The full context of every trade is lost: analysis reasoning, news environment, social influences, emotional state, and execution quality. Without this context, performance review produces surface-level insights (win/loss) instead of deep behavioral understanding.",
    impactMetrics: [
      { label: "Traders who journal consistently", value: "11%", context: "Only 11% of retail traders maintain a trade journal for more than 30 consecutive days, despite 92% of educators recommending it" },
      { label: "Journal abandonment rate", value: "89%", context: "89% of traders who start a trade journal abandon it within 30 days due to the manual effort required to reconstruct trade context" },
      { label: "Context captured per trade", value: "<15%", context: "Even traders who journal consistently capture less than 15% of the context that influenced each trade decision -- because the rest is trapped in other platforms" },
      { label: "Performance improvement gap", value: "3.2x", context: "Traders who journal consistently improve their performance 3.2x faster than those who don't -- but 89% can't sustain the practice due to workflow friction" },
    ],
    newsEvents: [
      { headline: "Study: Consistent trade journaling improves performance by 320% over 6 months", source: "TradeZella Research", date: "2025", impact: "High", relevance: "The ROI of journaling is proven -- the problem is sustainability. Only 11% can maintain the practice because the manual effort is too high." },
      { headline: "AI-powered trade review tools emerge but cannot access fragmented data sources", source: "TechCrunch", date: "Jan 2026", impact: "Medium", relevance: "AI could revolutionize trade review -- but only if it has access to the full context: charts, signals, news, execution data, and emotional state. Fragmented workflows prevent this." },
      { headline: "Prop firms begin requiring journal submissions for funded account evaluations", source: "Industry Reports", date: "Feb 2026", impact: "Medium", relevance: "Institutional pressure to journal is increasing, but without integrated tools, traders submit minimal or fabricated journals." },
    ],
    journeyContext: {
      action: "After the EURUSD trade closes (hit TP at 1.0800 for +48 pips / +$240), the trader should journal this trade. They open TradeZella and see the trade imported automatically from MT5: Buy EURUSD, entry 1.0752, exit 1.0800, +$240. But the journal entry is empty. They need to add: Why did they enter? What analysis led to this trade? What news event was relevant? Which Discord signal confirmed it? What was their emotional state? They stare at the empty fields for 30 seconds, type 'good trade, followed the plan' and close the tab.",
      duration: "2-3 minutes (should be 10-15)",
      friction: "The trade data imports automatically, but the context -- the most valuable part of the journal -- is trapped in 5 other platforms. Reconstructing it requires opening TradingView (chart screenshots), Discord (signal history), ForexFactory (news context), and the prop firm dashboard (compliance state).",
      detail: "This is the broken feedback loop. The trader just completed a profitable trade, and the most important learning opportunity -- understanding exactly why it worked -- is lost because the workflow makes it too hard to capture. The entry 'good trade, followed the plan' is useless for future improvement. When this trader hits a losing streak, they will have no detailed records to analyze for pattern recognition. The 3.2x performance improvement that consistent journaling provides is unreachable because the workflow prevents it.",
      dataLost: ["Entry reasoning narrative", "Chart analysis screenshots", "News context at time of trade", "Signal source and confirmation", "Emotional/psychological state", "Execution quality assessment", "Lessons learned for future trades"],
    },
  },
]

const WORKFLOW_ROUTE = [
  { categoryId: "news", label: "Check Events", lossLabel: "Context lost", timeSpent: "15-25 min" },
  { categoryId: "analysis", label: "Study Charts", lossLabel: "Levels lost", timeSpent: "30-45 min" },
  { categoryId: "communication", label: "Check Signals", lossLabel: "Delayed execution", timeSpent: "2-4 min" },
  { categoryId: "execution", label: "Place Trade", lossLabel: "Manual errors", timeSpent: "45-90 sec" },
  { categoryId: "account", label: "Check Account", lossLabel: "Stale data", timeSpent: "3-5 min" },
  { categoryId: "journaling", label: "Log Results", lossLabel: "Empty journal", timeSpent: "2-3 min" },
]

const AGGREGATE_LOSSES = [
  { label: "Time lost daily", value: "45-60 min", icon: Clock, color: "#f97316" },
  { label: "Estimated annual cost", value: "$2,160+", icon: DollarSign, color: "#ef4444" },
  { label: "Disconnected systems", value: "6+", icon: AlertTriangle, color: "#8b5cf6" },
  { label: "Context retained", value: "<15%", icon: TrendingDown, color: "#06b6d4" },
  { label: "Journal abandonment", value: "89%", icon: BookOpen, color: "#10b981" },
  { label: "Manual entry errors", value: "31%", icon: Activity, color: "#ec4899" },
]

/* ═══════════════════════════════════════════════════════════
   II. THEME COLOR MAPPING — each category gets a spectrum hue
   ═══════════════════════════════════════════════════════════ */

function catColor(pal: HoloPalette, id: string): string {
  const idx = CATEGORIES.findIndex((c) => c.id === id)
  const i = idx < 0 ? 0 : idx
  return pal.spectrum[i % pal.spectrum.length]
}

/* ═══════════════════════════════════════════════════════════
   III. FRACTURED PIPELINE — the bold opening visual.
   One unified intent enters, then shatters into six disconnected
   colored systems with broken gaps and "context lost" leaks.
   ═══════════════════════════════════════════════════════════ */

function FracturedPipeline({ pal, activeId, onPick }: {
  pal: HoloPalette; activeId: string | null; onPick: (id: string) => void
}) {
  const reduce = useReducedMotion()
  return (
    <HoloCard pal={pal} className="p-5 mb-5" glowColor={pal.red}>
      <div className="flex items-center justify-between mb-4">
        <SectionEyebrow pal={pal} label="One Trade, Six Breaks" color={pal.red} icon={Unplug} />
      </div>

      {/* unified intent entering */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0"
          style={{ background: withAlpha(pal.accent, 0.12), border: `1px solid ${withAlpha(pal.accent, 0.4)}`, boxShadow: glow(pal.accent, 0.4) }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: pal.accent, boxShadow: glow(pal.accent, 0.6) }} />
          <span className="text-[10px] font-bold" style={{ color: pal.accent }}>One Trade Idea</span>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${withAlpha(pal.accent, 0.5)}, ${withAlpha(pal.red, 0.4)})` }} />
        <span className="text-[9px] font-bold uppercase flex-shrink-0" style={{ color: pal.red, letterSpacing: "0.18em" }}>shatters into</span>
      </div>

      {/* the six fractured segments */}
      <div className="flex items-stretch gap-1.5 overflow-x-auto pb-2">
        {CATEGORIES.map((cat, i) => {
          const c = catColor(pal, cat.id)
          const Icon = cat.icon
          const active = activeId === cat.id
          return (
            <div key={cat.id} className="flex items-stretch flex-shrink-0">
              <motion.button
                onClick={() => onPick(cat.id)}
                initial={{ opacity: 0, y: 18, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 140 }}
                whileHover={{ y: -3 }}
                className="relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl outline-none cursor-pointer"
                style={{
                  minWidth: 92,
                  background: active ? withAlpha(c, 0.14) : pal.glass,
                  border: `1px solid ${active ? withAlpha(c, 0.5) : pal.glassEdge}`,
                  boxShadow: active ? glow(c, 0.5) : `inset 0 1px 0 ${pal.glassEdgeHi}`,
                }}
              >
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: pal.edgeTop }} aria-hidden />
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: withAlpha(c, active ? 0.2 : 0.1), border: `1px solid ${withAlpha(c, active ? 0.45 : 0.2)}` }}
                >
                  <Icon className="w-4 h-4" style={{ color: c }} />
                </div>
                <span className="text-[9px] font-bold text-center leading-tight" style={{ color: active ? pal.text : pal.textDim }}>{cat.label}</span>
                <span className="text-[7px] font-mono" style={{ color: pal.textGhost }}>{cat.tools.length} tools</span>
              </motion.button>

              {/* broken gap between segments */}
              {i < CATEGORIES.length - 1 && (
                <div className="flex flex-col items-center justify-center px-0.5 flex-shrink-0" style={{ width: 26 }}>
                  <div className="relative flex items-center" aria-hidden>
                    <div className="w-2.5 h-px" style={{ background: withAlpha(pal.red, 0.5) }} />
                    <Unplug className="w-3 h-3 mx-px" style={{ color: pal.red }} />
                    <div className="w-2.5 h-px" style={{ background: withAlpha(pal.red, 0.5) }} />
                  </div>
                  <motion.span
                    className="text-[6px] font-bold mt-1 whitespace-nowrap"
                    style={{ color: withAlpha(pal.red, 0.85) }}
                    animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                  >
                    break
                  </motion.span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-[10px] leading-relaxed mt-3" style={{ color: pal.textSoft }}>
        Each system is a dead end. Data, intent and context cannot cross the gaps between them.
        Select any system below to trace exactly what is lost at that handoff.
      </p>
    </HoloCard>
  )
}

/* ═══════════════════════════════════════════════════════════
   IV. CURSOR-REACTIVE SPOTLIGHT (accent-tinted, subtle)
   ═══════════════════════════════════════════════════════════ */

function CursorSpotlight({ pal }: { pal: HoloPalette }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [])
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-0 will-change-transform"
      style={{
        width: 600, height: 600,
        background: `radial-gradient(circle, ${withAlpha(pal.accent, 0.06)} 0%, transparent 70%)`,
        borderRadius: "50%",
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════
   V. CONNECTOR LINE WITH ANIMATED PULSE
   ═══════════════════════════════════════════════════════════ */

function ConnectorLine({ pal, active, delay = 0 }: { pal: HoloPalette; active: boolean; delay?: number }) {
  return (
    <svg width="36" height="2" viewBox="0 0 36 2" className="flex-shrink-0 mx-0.5">
      <line x1="0" y1="1" x2="36" y2="1" stroke={pal.glassEdge} strokeWidth="1" />
      <motion.line
        x1="0" y1="1" x2="36" y2="1"
        stroke={active ? withAlpha(pal.accent, 0.6) : pal.glassEdge} strokeWidth="1.5"
        strokeDasharray="36" initial={{ strokeDashoffset: 36 }}
        animate={{ strokeDashoffset: active ? 0 : 36 }} transition={{ duration: 0.8, delay, ease: "easeInOut" }}
      />
      {active && (
        <motion.circle cx="0" cy="1" r="2" fill={pal.accent}
          initial={{ cx: 0 }} animate={{ cx: [0, 36] }} transition={{ duration: 1.2, delay, ease: "easeInOut" }} />
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   VI. TOOL DETAIL CARD — theme-aware, market data
   ═══════════════════════════════════════════════════════════ */

function ToolDetailCard({ pal, tool, delay }: { pal: HoloPalette; tool: Tool; delay: number }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-xl p-3 text-left cursor-pointer relative overflow-hidden outline-none w-full"
      style={{
        background: expanded ? pal.glassHi : pal.glass,
        border: `1px solid ${expanded ? withAlpha(tool.color, 0.4) : pal.glassEdge}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, ${tool.color}, transparent)`, opacity: expanded ? 1 : 0 }} />
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tool.color, boxShadow: expanded ? glow(tool.color, 0.5) : "none" }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold" style={{ color: pal.text }}>{tool.name}</span>
            <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: withAlpha(tool.color, 0.1), color: tool.color }}>{tool.marketShare}</span>
          </div>
          <span className="text-[8px]" style={{ color: pal.textSoft }}>{tool.role}</span>
        </div>
        <ChevronRight className="w-3 h-3 flex-shrink-0 transition-transform duration-300" style={{ color: expanded ? tool.color : pal.textGhost, transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }} />
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="mt-2.5 flex flex-col gap-1.5">
              <div className="rounded-lg p-2.5" style={{ background: withAlpha(pal.green, 0.06), border: `1px solid ${withAlpha(pal.green, 0.14)}` }}>
                <div className="text-[7px] uppercase font-bold mb-1" style={{ color: pal.green, letterSpacing: "0.15em" }}>Why traders rely on it</div>
                <p className="text-[9px] leading-relaxed" style={{ color: pal.textDim }}>{tool.whyUsed}</p>
              </div>
              <div className="rounded-lg p-2.5" style={{ background: withAlpha(pal.red, 0.06), border: `1px solid ${withAlpha(pal.red, 0.14)}` }}>
                <div className="text-[7px] uppercase font-bold mb-1" style={{ color: pal.red, letterSpacing: "0.15em" }}>Where the handoff breaks</div>
                <p className="text-[9px] leading-relaxed" style={{ color: pal.textDim }}>{tool.whatBreaks}</p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}`, color: pal.textSoft }}>{tool.userCount} users</span>
                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ background: withAlpha(pal.red, 0.08), border: `1px solid ${withAlpha(pal.red, 0.16)}`, color: pal.red }}>{tool.limitation}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════════════
   VII. TRADE JOURNEY WINDOW — dynamic detail panel
   ═══════════════════════════════════════════════════════════ */

function TradeJourneyWindow({ pal, activeCategory }: { pal: HoloPalette; activeCategory: string | null }) {
  const cat = useMemo(() => CATEGORIES.find((c) => c.id === activeCategory), [activeCategory])
  const journey = cat?.journeyContext
  const [showNews, setShowNews] = useState(false)
  const [expandedNewsIdx, setExpandedNewsIdx] = useState<number | null>(null)

  if (!cat) return null
  const c = catColor(pal, cat.id)
  const impactColor = (impact: string) => (impact === "Critical" ? pal.red : impact === "High" ? pal.amber : pal.tertiary)

  return (
    <motion.div key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
      <HoloCard pal={pal} glowColor={c}>
        {/* header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${pal.glassEdge}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: withAlpha(c, 0.12), border: `1px solid ${withAlpha(c, 0.3)}` }}>
              <cat.icon className="w-4 h-4" style={{ color: c }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: pal.text }}>{cat.label}</span>
                <HoloChip pal={pal} color={c}>{cat.tools.length} tools</HoloChip>
              </div>
              <p className="text-[10px] leading-relaxed mt-0.5" style={{ color: pal.textSoft }}>{cat.summary}</p>
            </div>
          </div>
          <button
            onClick={() => setShowNews(!showNews)}
            className="text-[8px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
            style={{ background: showNews ? withAlpha(pal.red, 0.1) : pal.glass, border: `1px solid ${showNews ? withAlpha(pal.red, 0.25) : pal.glassEdge}`, color: showNews ? pal.red : pal.textSoft }}
          >
            <span className="flex items-center gap-1"><Newspaper className="w-2.5 h-2.5" /> News</span>
          </button>
        </div>

        {/* impact metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: `1px solid ${pal.glassEdge}` }}>
          {cat.impactMetrics.map((m, mi) => (
            <motion.div
              key={mi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: mi * 0.05 }}
              className="p-3 group/met cursor-default"
              style={{ borderRight: mi % 4 !== 3 ? `1px solid ${pal.glassEdge}` : "none" }}
            >
              <div className="text-sm font-bold font-mono" style={{ color: pal.text }}>{m.value}</div>
              <div className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: pal.textSoft }}>{m.label}</div>
              <div className="text-[8px] leading-relaxed mt-1 opacity-0 group-hover/met:opacity-100 transition-opacity duration-300 line-clamp-3" style={{ color: pal.textGhost }}>{m.context}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row">
          {/* tools */}
          <div className="md:w-[45%]" style={{ borderRight: `1px solid ${pal.glassEdge}` }}>
            <div className="p-4 flex flex-col gap-1.5">
              {cat.tools.map((tool, ti) => (
                <ToolDetailCard key={tool.name} pal={pal} tool={tool} delay={ti * 0.06} />
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-lg p-3" style={{ background: withAlpha(pal.red, 0.06), border: `1px solid ${withAlpha(pal.red, 0.14)}` }}>
                <div className="text-[7px] uppercase font-bold mb-1" style={{ color: pal.red, letterSpacing: "0.2em" }}>Handoff Loss at This Stage</div>
                <p className="text-[9px] leading-relaxed" style={{ color: pal.textDim }}>{cat.handoffLoss}</p>
              </div>
            </div>
          </div>

          {/* journey narrative + news */}
          <div className="md:w-[55%] p-5">
            {journey && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[8px] uppercase font-bold" style={{ color: c, letterSpacing: "0.2em" }}>Trade Journey: What the Trader Does</div>
                  <div className="flex-1 h-px" style={{ background: pal.glassEdge }} />
                  <span className="text-[8px] font-mono" style={{ color: pal.textGhost }}>{journey.duration}</span>
                </div>
                <div className="rounded-lg p-3.5 mb-2" style={{ background: withAlpha(c, 0.06), border: `1px solid ${withAlpha(c, 0.14)}` }}>
                  <p className="text-[10px] leading-relaxed" style={{ color: pal.textDim }}>{journey.action}</p>
                </div>
                <div className="rounded-lg p-3.5 mb-2" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}` }}>
                  <div className="text-[7px] uppercase font-bold mb-1" style={{ color: pal.red, letterSpacing: "0.2em" }}>Friction Point</div>
                  <p className="text-[9px] leading-relaxed" style={{ color: pal.textSoft }}>{journey.friction}</p>
                </div>
                <div className="rounded-lg p-3.5 mb-2" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}` }}>
                  <div className="text-[7px] uppercase font-bold mb-1" style={{ color: pal.textSoft, letterSpacing: "0.2em" }}>Deeper Analysis</div>
                  <p className="text-[9px] leading-relaxed" style={{ color: pal.textSoft }}>{journey.detail}</p>
                </div>
                <div>
                  <div className="text-[7px] uppercase font-bold mb-1.5" style={{ color: pal.red, letterSpacing: "0.2em" }}>Data Lost at This Handoff</div>
                  <div className="flex flex-wrap gap-1">
                    {journey.dataLost.map((d, di) => (
                      <motion.span key={di} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: di * 0.04 }}
                        className="text-[7px] px-2 py-1 rounded-full font-mono"
                        style={{ background: withAlpha(pal.red, 0.08), border: `1px solid ${withAlpha(pal.red, 0.16)}`, color: pal.red }}>{d}</motion.span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {showNews && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="text-[8px] uppercase font-bold mb-2" style={{ color: pal.red, letterSpacing: "0.2em" }}>Recent News &amp; Events</div>
                  <div className="flex flex-col gap-1.5">
                    {cat.newsEvents.map((news, ni) => {
                      const ic = impactColor(news.impact)
                      return (
                        <motion.button
                          key={ni} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ni * 0.06 }}
                          onClick={() => setExpandedNewsIdx(expandedNewsIdx === ni ? null : ni)}
                          className="text-left rounded-lg p-3 outline-none"
                          style={{ background: pal.glass, border: `1px solid ${expandedNewsIdx === ni ? withAlpha(ic, 0.3) : pal.glassEdge}` }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: withAlpha(ic, 0.12), color: ic }}>{news.impact}</span>
                                <span className="text-[7px] font-mono" style={{ color: pal.textGhost }}>{news.source} / {news.date}</span>
                              </div>
                              <p className="text-[9px] font-semibold leading-relaxed" style={{ color: pal.textDim }}>{news.headline}</p>
                            </div>
                            <ChevronRight className="w-3 h-3 flex-shrink-0 mt-1 transition-transform duration-200" style={{ color: pal.textGhost, transform: expandedNewsIdx === ni ? "rotate(90deg)" : "rotate(0)" }} />
                          </div>
                          <AnimatePresence>
                            {expandedNewsIdx === ni && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                <p className="text-[9px] leading-relaxed mt-2 pt-2" style={{ color: pal.textSoft, borderTop: `1px solid ${pal.glassEdge}` }}>{news.relevance}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </HoloCard>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   VIII. WORKFLOW ROUTE VISUALIZER — time tracking
   ═══════════════════════════════════════════════════════════ */

function WorkflowRoute({ pal, isPlaying, onPlay, activeRouteStep, onStepClick }: {
  pal: HoloPalette; isPlaying: boolean; onPlay: () => void; activeRouteStep: number; onStepClick: (categoryId: string) => void
}) {
  return (
    <HoloCard pal={pal} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] uppercase font-semibold" style={{ color: pal.textSoft, letterSpacing: "0.2em" }}>Single Trade Journey</div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: pal.textDim }}>One trade crosses six disconnected systems</div>
        </div>
        <button
          onClick={onPlay}
          className="px-3.5 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide flex items-center gap-2"
          style={{ background: isPlaying ? withAlpha(pal.accent, 0.12) : pal.glass, border: `1px solid ${isPlaying ? withAlpha(pal.accent, 0.4) : pal.glassEdge}`, color: isPlaying ? pal.accent : pal.textDim }}
        >
          {isPlaying ? (
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: pal.accent }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }} />
          ) : (
            <Play className="w-2.5 h-2.5" />
          )}
          {isPlaying ? "Playing..." : "Watch the Flow"}
        </button>
      </div>

      <div className="flex items-center justify-between gap-0 overflow-x-auto pb-2">
        {WORKFLOW_ROUTE.map((step, i) => {
          const cat = CATEGORIES.find((c) => c.id === step.categoryId)!
          const c = catColor(pal, cat.id)
          const Icon = cat.icon
          const isReached = activeRouteStep >= i
          const isCurrent = activeRouteStep === i
          return (
            <div key={step.categoryId} className="flex items-center flex-shrink-0">
              <button onClick={() => onStepClick(step.categoryId)} className="flex flex-col items-center gap-1.5 relative outline-none cursor-pointer">
                <motion.div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: isReached ? withAlpha(c, isCurrent ? 0.18 : 0.1) : pal.glass, border: `1px solid ${isReached ? withAlpha(c, isCurrent ? 0.45 : 0.2) : pal.glassEdge}` }}
                  animate={isCurrent ? { boxShadow: [`0 0 0px ${withAlpha(c, 0)}`, glow(c, 0.5), `0 0 0px ${withAlpha(c, 0)}`] } : {}}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isReached ? c : pal.textGhost }} />
                </motion.div>
                <span className="text-[8px] font-semibold whitespace-nowrap" style={{ color: isReached ? (isCurrent ? c : pal.textDim) : pal.textGhost }}>{step.label}</span>
                <span className="text-[6px] font-mono whitespace-nowrap" style={{ color: isCurrent ? c : pal.textGhost }}>{step.timeSpent}</span>
              </button>
              {i < WORKFLOW_ROUTE.length - 1 && (
                <div className="flex flex-col items-center mx-0.5 flex-shrink-0">
                  <ConnectorLine pal={pal} active={activeRouteStep > i} delay={i * 0.15} />
                  <AnimatePresence>
                    {activeRouteStep > i && (
                      <motion.span className="text-[6px] font-medium whitespace-nowrap mt-1" style={{ color: pal.red }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 }}>{step.lossLabel}</motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </HoloCard>
  )
}

/* ═══════════════════════════════════════════════════════════
   IX. MAIN SLIDE COMPONENT — fully orchestrated, theme-aware
   ═══════════════════════════════════════════════════════════ */

export function BrokenWorkflowSystemSlide({ accent, theme }: { accent: string; theme: VantaryTheme }) {
  const pal = useHoloPalette(theme, accent)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isPlayingRoute, setIsPlayingRoute] = useState(false)
  const [routeStep, setRouteStep] = useState(-1)
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setActiveCategory("news"), 800)
    return () => clearTimeout(timer)
  }, [])

  const stopRoute = useCallback(() => {
    if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    setIsPlayingRoute(false)
  }, [])

  const startRouteAnimation = useCallback(() => {
    if (isPlayingRoute) return
    setIsPlayingRoute(true)
    setRouteStep(0)
    setActiveCategory("news")
    let step = 0
    playIntervalRef.current = setInterval(() => {
      step++
      if (step >= WORKFLOW_ROUTE.length) {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current)
        setIsPlayingRoute(false)
        return
      }
      setRouteStep(step)
      setActiveCategory(WORKFLOW_ROUTE[step].categoryId)
    }, 2800)
  }, [isPlayingRoute])

  useEffect(() => {
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current) }
  }, [])

  const activeCat = useMemo(() => CATEGORIES.find((c) => c.id === activeCategory), [activeCategory])

  const pickCategory = (id: string) => {
    setActiveCategory(activeCategory === id ? null : id)
    stopRoute()
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${pal.bg} 0%, ${pal.bgDeep} 55%, ${pal.bg2} 100%)`,
        border: `1px solid ${pal.glassEdge}`,
      }}
    >
      <AuroraField pal={pal} hues={[pal.red, pal.amber, pal.spectrum[2], pal.accent]} />
      <CursorSpotlight pal={pal} />

      <div className="relative z-10 px-6 md:px-10 pt-7 pb-5">
        {/* HEADER */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <SectionEyebrow pal={pal} label="The Problem" color={pal.red} />
            <button
              onClick={() => setShowDeepAnalysis(!showDeepAnalysis)}
              className="text-[8px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-lg flex-shrink-0 ml-3"
              style={{ background: showDeepAnalysis ? withAlpha(pal.tertiary, 0.12) : pal.glass, border: `1px solid ${showDeepAnalysis ? withAlpha(pal.tertiary, 0.3) : pal.glassEdge}`, color: showDeepAnalysis ? pal.tertiary : pal.textSoft }}
            >
              <span className="flex items-center gap-1"><Lightbulb className="w-2.5 h-2.5" /> Analysis</span>
            </button>
          </div>
          <h2 className="text-2xl md:text-[28px] font-bold leading-tight tracking-tight text-balance" style={{ color: pal.text }}>
            One workflow. Six disconnected systems. Zero continuity.
          </h2>
          <p className="text-sm max-w-2xl leading-relaxed mt-2" style={{ color: pal.textSoft }}>
            Every active trader moves through news, analysis, community, execution, account management, and journaling daily.
            Each step uses different tools from different companies with different logins. Context is lost at every handoff.
            The workflow between them is fragmented, manual, and dangerously slow.
          </p>
        </motion.div>

        {/* FRACTURED PIPELINE — the bold opening visual */}
        <FracturedPipeline pal={pal} activeId={activeCategory} onPick={pickCategory} />

        {/* Deep Analysis paragraph */}
        <AnimatePresence>
          {showDeepAnalysis && activeCat && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-4">
              <div className="rounded-xl p-4" style={{ background: withAlpha(pal.tertiary, 0.06), border: `1px solid ${withAlpha(pal.tertiary, 0.16)}` }}>
                <div className="text-[8px] uppercase font-bold mb-2" style={{ color: pal.tertiary, letterSpacing: "0.2em" }}>Deep Analysis: {activeCat.label}</div>
                <p className="text-[10px] leading-relaxed" style={{ color: pal.textDim }}>{activeCat.deepAnalysis}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aggregate loss bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
          {AGGREGATE_LOSSES.map((loss, li) => {
            const Icon = loss.icon
            const lc = [pal.amber, pal.red, pal.tertiary, pal.spectrum[1], pal.green, pal.spectrum[2]][li % 6]
            return (
              <motion.div
                key={li} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + li * 0.04 }}
                className="relative overflow-hidden p-3 flex flex-col items-center text-center"
                style={{ borderRadius: 12, background: pal.glass, border: `1px solid ${pal.glassEdge}`, boxShadow: `inset 0 1px 0 ${pal.glassEdgeHi}` }}
              >
                <Icon className="w-3.5 h-3.5 mb-1" style={{ color: lc }} />
                <div className="text-sm font-bold font-mono" style={{ color: pal.text }}>{loss.value}</div>
                <div className="text-[7px] font-semibold uppercase tracking-wider leading-tight mt-0.5" style={{ color: pal.textSoft }}>{loss.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* TRADE JOURNEY WINDOW */}
        <AnimatePresence mode="wait">
          {activeCat && <TradeJourneyWindow pal={pal} activeCategory={activeCategory} />}
        </AnimatePresence>

        {/* WORKFLOW ROUTE */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-5 mb-5">
          <WorkflowRoute
            pal={pal} isPlaying={isPlayingRoute} onPlay={startRouteAnimation} activeRouteStep={routeStep}
            onStepClick={(id) => { setActiveCategory(id); stopRoute() }}
          />
        </motion.div>

        {/* INVESTOR VERDICT */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }}>
          <HoloCard pal={pal} glowColor={pal.red} className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold leading-relaxed" style={{ color: pal.text }}>
                  The problem is not one bad tool. It is one workflow spread across six disconnected systems with zero data continuity between them.
                </p>
                <p className="text-[11px] leading-relaxed mt-2" style={{ color: pal.textSoft }}>
                  Every handoff costs time, context, and confidence. Over a year, the aggregate cost exceeds $2,100 per trader in missed entries,
                  delayed execution, and manual errors -- before accounting for the broken feedback loop that prevents most traders from sustaining
                  the single most important improvement practice: consistent journaling.
                </p>
              </div>
              <div className="flex-shrink-0 hidden md:flex flex-col items-center gap-1">
                <div className="text-2xl font-bold font-mono" style={{ color: pal.red, textShadow: glow(pal.red, 0.3) }}>6+</div>
                <div className="text-[7px] uppercase tracking-widest font-semibold text-center leading-tight" style={{ color: pal.textSoft }}>disconnected<br />systems</div>
              </div>
            </div>
          </HoloCard>
        </motion.div>
      </div>
    </div>
  )
}
