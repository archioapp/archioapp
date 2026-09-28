"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Brain, Target, Compass, ChevronRight,
  Zap, Activity, AlertTriangle, CheckCircle2, Lightbulb,
  MessageSquare, Eye, Layers, Scale, BookOpen,
  Shield, TrendingUp, BarChart3, Search, Waypoints,
  HeartPulse, GitBranch, Cpu, Radio, Network,
  Flame, RefreshCw, Gauge,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════
   AI COPILOT INTELLIGENCE — COMPLETE GUIDE & TUTORIAL

   13x more detailed than Strategy/Activity tutorials.
   Covers the full AI intelligence system architecture:

   1. BEHAVIORAL SIGNAL ENGINE — How the AI detects patterns in
      your trading behavior, what signals it monitors, and how
      it constructs real-time behavioral intelligence
   2. CONVERSATION MODES — The 6 specialized AI conversation modes,
      when each activates, what each provides, how to use them
   3. INTELLIGENCE BOARDS — Pattern recognition dashboards, how
      the AI synthesizes multi-source data into actionable insights
   4. CONTEXTUAL AWARENESS — How the AI maintains context across
      sessions, the memory architecture, and the learning loop
   5. DECISION SUPPORT SYSTEM — How the AI assists without replacing
      operator judgment, the advisory model, and confidence scoring
   6. INTEGRATION ARCHITECTURE — How the AI connects to all 5 other
      copilot layers and why cross-layer intelligence matters
   ═══════════════════════════════════════════════════════════════════ */

/* ── Section Type ── */
interface AISection {
  id: string
  title: string
  tagline: string
  icon: typeof Brain
  color: string
  systemCode: string
  overview: string
  components: {
    label: string
    description: string
    status: "active" | "learning" | "ready" | "monitoring"
  }[]
  deepDive: {
    heading: string
    body: string
  }[]
  operatorGuidance: {
    doThis: string[]
    neverDoThis: string[]
  }
  capabilities: {
    name: string
    description: string
    example: string
  }[]
}

const AI_SECTIONS: AISection[] = [
  {
    id: "behavioral-engine",
    title: "Behavioral Signal Engine",
    tagline: "The AI watches your trading patterns to understand you better than you understand yourself.",
    icon: Activity,
    color: "#8b5cf6",
    systemCode: "BSE-MONITOR-V3",
    overview: "The Behavioral Signal Engine is the foundational layer of the AI Copilot. It continuously monitors your trading behavior across multiple dimensions: trade timing, position sizing patterns, hold duration, win/loss sequences, drawdown behavior, emotional indicators (rapid actions, increased trade frequency), and session patterns. From this raw behavioral data, it constructs a dynamic operator profile that evolves with every trading session. This profile is not a static snapshot -- it is a living model that understands your strengths, weaknesses, biases, and patterns. The engine detects behavioral signals that precede common mistakes and surfaces them before the mistake occurs.",
    components: [
      { label: "Trade Pattern Analyzer", description: "Monitors entry timing, session duration, and trade frequency to build a model of your typical trading behavior. Deviations from your baseline trigger behavioral signals.", status: "active" },
      { label: "Risk Behavior Monitor", description: "Tracks position sizing relative to account size, portfolio heat levels, and stop-loss adherence. Detects risk-seeking behavior (increasing size after losses) and risk-averse behavior (decreasing size after wins).", status: "active" },
      { label: "Emotional State Estimator", description: "Infers emotional state from behavioral proxies: rapid sequential trades (possible tilt), long pauses after losses (possible fear), increasing position sizes (possible overconfidence). Does not require self-reporting.", status: "learning" },
      { label: "Sequence Pattern Detector", description: "Identifies recurring sequences in your trading: what happens after 2 consecutive wins, after a large loss, after a break from trading. These sequences reveal unconscious patterns.", status: "active" },
      { label: "Session Quality Scorer", description: "Assigns a quality score to each trading session based on adherence to your rules, decision quality (not just P&L), and behavioral consistency. High-quality losing sessions score higher than low-quality winning sessions.", status: "active" },
    ],
    deepDive: [
      { heading: "Why Behavior, Not Just Results", body: "Traditional analysis focuses on P&L -- did the trade make money or lose money? This is the wrong metric for development. A trader who breaks every rule and gets lucky has a positive P&L but negative development. A trader who executes perfectly and loses has negative P&L but positive development. The Behavioral Signal Engine prioritizes process over outcome because over large sample sizes, good process produces good outcomes. We track how you trade, not just what happens after." },
      { heading: "The Behavioral Baseline", body: "During your first 30 trading sessions, the engine builds a comprehensive behavioral baseline: your average trade frequency, typical session duration, position sizing patterns, time between trades, and response to wins and losses. After the baseline period, the engine scores every session against your baseline. Gradual evolution (getting better over time) is healthy and expected. Sudden deviations (trading twice as fast as normal, doubling position size) trigger signals because they indicate an emotional or cognitive shift." },
      { heading: "Signal Categories Explained", body: "Behavioral signals are categorized into four types: (1) Performance signals -- detected patterns in your trading results that suggest process improvements. (2) Behavioral signals -- deviations from your baseline that may indicate emotional trading. (3) Pattern signals -- recurring sequences that reveal unconscious habits. (4) Risk signals -- changes in your risk behavior that may indicate developing problems. Each category uses different detection algorithms and has different severity thresholds." },
      { heading: "Privacy and Data Ownership", body: "All behavioral data belongs to you. The AI processes your data in an isolated compute environment (the same sandboxing described in the Secure Environment layer). No behavioral data is shared with other operators, used for aggregate analysis, or accessible to platform administrators. You can export or delete your behavioral data at any time. The AI's knowledge of you exists only for you." },
    ],
    operatorGuidance: {
      doThis: [
        "Trade naturally -- the engine builds a better model when you are not trying to game it",
        "Review the behavioral signals dashboard weekly to understand what patterns the AI has detected",
        "Use the session quality score as a feedback mechanism -- aim for high-quality sessions regardless of P&L",
        "Provide feedback on signals that are accurate vs inaccurate -- this improves the model's precision over time",
        "Trust the emotional state estimation even when you think you feel fine -- behavioral proxies are often more accurate than self-assessment",
      ],
      neverDoThis: [
        "Never try to manipulate your behavior to produce better signals -- the engine detects artificial behavior patterns",
        "Never ignore risk behavior warnings -- they are the most actionable signals in the system",
        "Never compare your behavioral signals with other operators -- each model is personalized and comparisons are meaningless",
        "Never disable behavioral monitoring during difficult periods -- those are exactly when you need it most",
      ],
    },
    capabilities: [
      { name: "Pre-Tilt Detection", description: "Detects the behavioral precursors of tilt (increased trade frequency, shorter analysis time, larger positions) and alerts you before the tilt cascade begins.", example: "Signal: Trade frequency has increased 40% from your baseline in the last 45 minutes. This pattern has preceded a tilt event in 3 of your last 4 similar episodes. Consider a 30-minute break." },
      { name: "Risk Drift Warning", description: "Detects gradual increases in risk-taking that may go unnoticed over days or weeks. Compares current risk behavior to your historical baseline.", example: "Signal: Average position size has increased 15% over the last 2 weeks without a corresponding increase in account equity. Your risk per trade has drifted from 1.0% to 1.15%. Review and recalibrate." },
      { name: "Win Streak Overconfidence", description: "After consecutive wins, detects behavioral changes associated with overconfidence: less analysis time, fewer confirmation checks, larger position sizes.", example: "Signal: You are on a 6-trade winning streak. Analysis time per trade has decreased from 12 minutes to 4 minutes over the last 3 trades. Win streaks of this length have historically been followed by your largest losses." },
    ],
  },
  {
    id: "conversation-modes",
    title: "Conversation Modes",
    tagline: "Six specialized AI modes, each trained for a specific type of trading challenge.",
    icon: MessageSquare,
    color: "#3b82f6",
    systemCode: "CONV-MODE-V6",
    overview: "The AI Copilot does not use a single generic conversational model. Instead, it deploys six specialized conversation modes, each designed for a specific type of interaction. When a behavioral signal is detected, the system recommends the most appropriate conversation mode for the situation. You can also select any mode manually. Each mode has a distinct personality, specialized knowledge base, and conversation framework. The mode determines how the AI responds, what questions it asks, and what frameworks it applies to your situation.",
    components: [
      { label: "Trade Review Mode", description: "Deep analysis of specific trades: what went right, what went wrong, and what to do differently. Uses your trade data, journal entries, and market context to reconstruct the decision-making process.", status: "ready" },
      { label: "Strategy Architect Mode", description: "Collaborative strategy development. The AI asks probing questions about your edge, helps formalize your rules, and identifies gaps in your strategy definition.", status: "ready" },
      { label: "Psychology Lab Mode", description: "Guided exploration of your psychological patterns. Uses cognitive behavioral frameworks to help you identify and neutralize destructive thought patterns.", status: "ready" },
      { label: "Risk Advisor Mode", description: "Quantitative risk analysis. Calculates portfolio exposure, correlation risk, drawdown projections, and provides specific risk management recommendations.", status: "ready" },
      { label: "Market Context Mode", description: "Current market analysis combining your watchlist, HTF structure, session timing, and upcoming events to provide a complete picture of today's trading landscape.", status: "ready" },
      { label: "Accountability Partner Mode", description: "Holds you accountable to your own rules. Reviews your stated plan against your actual behavior and provides honest, direct feedback without sugar-coating.", status: "ready" },
    ],
    deepDive: [
      { heading: "Why Specialized Modes Matter", body: "A generic AI that tries to do everything does nothing well. A trader reviewing a specific trade needs deep analytical capabilities. A trader struggling with tilt needs psychological support. A trader evaluating a new strategy needs collaborative brainstorming. Each of these interactions requires different knowledge, different frameworks, and different conversational patterns. Specialized modes ensure that the AI response is always contextually appropriate and maximally useful." },
      { heading: "Mode Selection Intelligence", body: "The system recommends modes based on behavioral context. After a losing streak, it may suggest Psychology Lab mode. After a series of rule-breaking trades, it may suggest Accountability Partner mode. After a successful day, it may suggest Trade Review mode to reinforce what went right. These recommendations are suggestions, not requirements -- you always control which mode to engage." },
      { heading: "Cross-Mode Memory", body: "Conversations in one mode inform the intelligence available in other modes. If you discuss a specific psychological pattern in Psychology Lab mode, that insight is available when Trade Review mode analyzes a trade where that pattern was relevant. The modes are specialized in their approach but unified in their knowledge of you." },
      { heading: "The Accountability Partner", body: "The Accountability Partner mode is intentionally direct. It does not validate poor decisions or offer comfort after rule-breaking trades. Its role is to mirror your stated rules back to you and highlight when your behavior deviated. This mode is uncomfortable by design -- growth happens at the edge of comfort. However, it never attacks or demeans. It holds you to the standard you set for yourself, nothing more and nothing less." },
    ],
    operatorGuidance: {
      doThis: [
        "Start with the AI's recommended mode -- the behavioral engine selected it for a reason based on your current context",
        "Use Trade Review mode after every session to build a feedback loop between your actions and your learning",
        "Engage Psychology Lab mode proactively during calm periods, not only when you are already struggling",
        "Use Strategy Architect mode to formalize any new idea before risking real capital on it",
        "Engage Accountability Partner mode weekly for an honest assessment of your rule adherence",
      ],
      neverDoThis: [
        "Never use Market Context mode as a replacement for your own analysis -- it supplements, it does not replace",
        "Never ignore Accountability Partner feedback because it is uncomfortable -- discomfort is the signal of useful feedback",
        "Never rely on Risk Advisor mode to make risk decisions for you -- it provides data, you make the decision",
        "Never skip Trade Review after a losing session -- those are the most valuable review sessions",
      ],
    },
    capabilities: [
      { name: "Contextual Mode Switching", description: "The AI can suggest switching modes mid-conversation if the discussion reveals a need for a different framework.", example: "You started in Trade Review mode analyzing a losing trade. The AI detects that the root cause is psychological, not technical. It suggests: 'This trade failure appears to be rooted in a revenge trading pattern. Would you like to switch to Psychology Lab to explore this further?'" },
      { name: "Guided Questioning", description: "Each mode uses a structured questioning framework designed to help you reach insights through your own reasoning rather than being told the answer.", example: "Instead of saying 'You should have waited for confirmation,' the AI asks: 'What confirmation criteria did your plan specify for this entry? Looking at the chart, were those criteria met when you entered? What was the gap between your plan and your execution?'" },
      { name: "Pattern Linking", description: "The AI connects insights from different conversations to reveal patterns you may not see across individual interactions.", example: "Signal: In your last 5 Trade Review sessions, the root cause was the same: entering before confirmation. In your Psychology Lab session last week, you identified impatience as a core challenge. These are connected -- your impatience is manifesting as premature entries." },
    ],
  },
  {
    id: "intelligence-boards",
    title: "Intelligence Boards",
    tagline: "Pattern recognition dashboards that synthesize multi-source data into actionable intelligence.",
    icon: BarChart3,
    color: "#06b6d4",
    systemCode: "INTEL-BOARD-V2",
    overview: "Intelligence Boards are visual dashboards that present synthesized intelligence from across all copilot layers. Unlike traditional analytics dashboards that show raw metrics, Intelligence Boards present interpreted patterns with context and actionable recommendations. Each board focuses on a specific dimension of your trading: Performance Intelligence (how you are performing and why), Behavioral Intelligence (how your behavior correlates with outcomes), Risk Intelligence (your current and historical risk posture), and Development Intelligence (where you are improving and where you are stuck).",
    components: [
      { label: "Performance Board", description: "Win rate, expectancy, profit factor, and R-multiple distribution -- contextualized with behavioral data to explain why results are what they are.", status: "active" },
      { label: "Behavioral Board", description: "Session quality scores, rule adherence rates, emotional state estimations, and behavioral signal history -- showing the process behind the results.", status: "active" },
      { label: "Risk Board", description: "Portfolio heat history, drawdown curves, position sizing distribution, and correlation exposure -- real-time risk visualization.", status: "active" },
      { label: "Development Board", description: "Learning curve analysis, mastery progression across mentor modules, and skill gap identification -- tracking your growth trajectory.", status: "learning" },
    ],
    deepDive: [
      { heading: "Intelligence vs Analytics", body: "Traditional analytics dashboards present data: your win rate is 58%, your average R is 1.8, your profit factor is 2.1. Intelligence Boards present interpretation: your win rate is 58% overall but 72% during London killzone and 34% during off-hours. Your average R is 1.8 but drops to 0.9 on trades taken within 15 minutes of a loss. Your profit factor is 2.1 but would be 3.4 if you eliminated the bottom 10% of trades (which are all post-loss revenge trades). Intelligence tells you what the data means, not just what it says." },
      { heading: "The Performance-Behavior Link", body: "The most powerful insight comes from linking performance data with behavioral data. The Performance Board shows that your Tuesday trades have a 75% win rate while your Friday trades have a 41% win rate. The Behavioral Board shows that your session quality score averages 8.2 on Tuesdays and 5.1 on Fridays. Combined intelligence: your Friday performance is poor because your process quality drops on Fridays -- you are trading differently, not just trading in different market conditions." },
      { heading: "Actionable Recommendations", body: "Every Intelligence Board generates specific, actionable recommendations. Not vague advice like 'improve your risk management.' Specific actions: 'Reduce your Friday trading to zero -- your data shows that eliminating Friday trades would increase your monthly expectancy by 12% and reduce your maximum drawdown by 3.2 percentage points. Your process quality on Fridays is consistently below your threshold.'" },
    ],
    operatorGuidance: {
      doThis: [
        "Review the Performance Board weekly to understand your results in the context of your behavior",
        "Use the Behavioral Board to identify process improvements that are data-driven, not opinion-driven",
        "Monitor the Risk Board daily to maintain awareness of your current exposure",
        "Track the Development Board monthly to measure your skill progression over time",
      ],
      neverDoThis: [
        "Never make strategy changes based on a single week's data -- require at least 30 trades for statistical significance",
        "Never ignore the behavioral correlations -- they reveal the causes behind your results",
        "Never obsess over daily P&L on the Performance Board -- focus on process metrics and weekly/monthly trends",
      ],
    },
    capabilities: [
      { name: "Automated Insight Generation", description: "The boards automatically highlight the most important patterns and changes, so you know where to focus your attention.", example: "Highlighted insight: Your off-hours trades (taken outside killzones) have generated -14R in the last 30 days while your killzone trades have generated +38R. Eliminating off-hours trades would have improved your net performance by 58%." },
      { name: "Comparative Analysis", description: "Compare your current metrics to your own historical data across any time period.", example: "This month vs last month: Win rate improved from 52% to 61%. Key driver: you reduced off-hours trading from 25% to 8% of total trades." },
    ],
  },
  {
    id: "contextual-awareness",
    title: "Contextual Awareness",
    tagline: "The AI remembers your history, understands your journey, and learns with every interaction.",
    icon: Brain,
    color: "#f59e0b",
    systemCode: "CTX-MEMORY-V4",
    overview: "The AI Copilot maintains contextual awareness across sessions, conversations, and time periods. It remembers your trading history, your stated goals, your identified weaknesses, and the insights from previous conversations. This context enables conversations that build on each other rather than starting from zero every time. The memory architecture is designed to be both comprehensive and relevant -- the AI surfaces the right context at the right time without overwhelming you with historical detail.",
    components: [
      { label: "Session Memory", description: "Complete record of each trading session: what you traded, how you traded, what signals were detected, and what conversations occurred. Stored with full context for future reference.", status: "active" },
      { label: "Insight Database", description: "Key insights generated across all conversations and sessions. Tagged by topic, date, and relevance. The AI references these insights when they are relevant to current situations.", status: "active" },
      { label: "Goal Tracking", description: "Your stated trading goals, rules, and development objectives. The AI uses these as reference points for accountability and progress tracking.", status: "active" },
      { label: "Pattern Memory", description: "Identified recurring patterns in your trading behavior. These patterns are tracked over time to measure whether interventions are working.", status: "learning" },
    ],
    deepDive: [
      { heading: "The Learning Loop", body: "The contextual awareness system implements a continuous learning loop: (1) Observe your trading behavior. (2) Detect patterns and signals. (3) Surface insights through conversations. (4) Track whether insights lead to behavioral changes. (5) Adjust future insights based on what worked. This loop means the AI becomes more effective the longer you use it. Early conversations are more exploratory. Later conversations are more targeted because the AI has learned what resonates with you." },
      { heading: "Relevance Filtering", body: "The AI has access to your entire trading history but does not dump all of it into every conversation. Relevance filtering selects the most pertinent context for the current situation. If you are reviewing a trade that went wrong because of premature entry, the AI might reference a conversation from 3 weeks ago where you identified impatience as a core challenge. It would not reference your position sizing analysis from last month because it is not relevant right now." },
      { heading: "Context Decay", body: "Not all context is equally valuable. Recent insights are weighted more heavily than older ones. Short-term behavioral patterns (this week) are more predictive than long-term averages (this quarter). The memory system implements context decay -- recent information has higher priority, but significant historical events (major drawdowns, breakthrough insights, rule changes) retain their weight indefinitely." },
    ],
    operatorGuidance: {
      doThis: [
        "Articulate your goals, rules, and development priorities clearly -- the AI uses them as accountability reference points",
        "Engage in regular conversations, not just during crises -- consistent engagement builds a more accurate contextual model",
        "Review the insight database periodically to reconnect with past breakthroughs and check your progress",
        "Update your goals when they change -- outdated goals lead to misaligned AI guidance",
      ],
      neverDoThis: [
        "Never expect the AI to remember information you have not shared -- it knows your trading behavior, not your life",
        "Never assume the AI's context is perfect -- if a recommendation seems off, provide the missing context",
        "Never avoid engaging after bad sessions -- those interactions provide the most valuable data for the contextual model",
      ],
    },
    capabilities: [
      { name: "Proactive Context Surfacing", description: "The AI automatically surfaces relevant past insights when it detects a situation where they apply.", example: "Three weeks ago, you identified that your worst trades happen between 14:30-15:00 UTC. You are currently about to enter a trade at 14:35 UTC. The AI surfaces this insight: 'Reminder: you identified this time window as your lowest-probability trading period. Review that decision before proceeding.'" },
      { name: "Development Arc Tracking", description: "The AI tracks your development over months, identifying improvements and plateaus.", example: "Development update: Your rule adherence has improved from 71% to 89% over the last 6 weeks. Your off-hours trading has decreased from 30% to 7%. However, your partial-taking discipline has plateaued at 65% -- this is your current development priority." },
    ],
  },
  {
    id: "decision-support",
    title: "Decision Support System",
    tagline: "The AI assists your decisions. It never makes them for you. Advisory, not autonomous.",
    icon: Scale,
    color: "#10b981",
    systemCode: "DSS-ADVISORY-V2",
    overview: "The Decision Support System is built on a fundamental principle: the AI advises, the operator decides. The system never takes autonomous action on your behalf. It does not place trades, modify stops, or close positions. Its role is to provide you with the best possible information and analysis to support your decision-making. This includes: pre-trade checklists that verify your setup meets your rules, real-time alerts when behavioral signals suggest potential problems, post-trade analysis that helps you learn from every outcome, and strategic recommendations based on your performance data.",
    components: [
      { label: "Pre-Trade Checklist", description: "Automated verification that your intended trade meets all of your stated criteria: HTF alignment, killzone timing, risk parameters, portfolio heat, and rule compliance.", status: "ready" },
      { label: "Real-Time Alerts", description: "Behavioral signal alerts delivered during live trading. Configurable sensitivity to balance awareness with distraction.", status: "active" },
      { label: "Post-Trade Analysis", description: "Automated trade review that analyzes entry quality, management adherence, and outcome against your stated rules.", status: "active" },
      { label: "Strategic Recommendations", description: "Data-driven recommendations for improving your trading process. Based on at least 30 trades of data for statistical significance.", status: "active" },
      { label: "Confidence Scoring", description: "Each AI recommendation includes a confidence score based on the strength of the underlying data and the relevance of the pattern.", status: "learning" },
    ],
    deepDive: [
      { heading: "Advisory, Not Autonomous", body: "The AI Copilot is deliberately designed to support human decision-making, not replace it. There are three reasons: (1) Trading skill is built through making decisions, not delegating them. An autonomous system would prevent your development. (2) No AI model can capture the full complexity of market context and personal circumstances. Your judgment, informed by AI analysis, is better than AI alone. (3) Autonomy creates moral hazard -- if the AI makes decisions, you stop developing the judgment needed to override it when it is wrong." },
      { heading: "The Pre-Trade Checklist", body: "Before you can enter a trade through the platform, you optionally engage the pre-trade checklist. The checklist verifies: (1) Is the trade aligned with HTF structure? (2) Is the entry within a killzone? (3) Does the position size calculate to exactly your stated risk percentage? (4) Will the new trade keep portfolio heat below your threshold? (5) Have you taken any losses in the last 30 minutes? Each item is verified against your stated rules. The checklist does not prevent you from trading -- it ensures you are aware of any rule deviations before you commit." },
      { heading: "Confidence Scoring Explained", body: "Every recommendation includes a confidence score from 0-100. Scores above 80 indicate high confidence: the recommendation is based on a large sample of your data, the pattern is statistically significant, and the recommended action has a clear positive expected value. Scores between 50-80 indicate moderate confidence: the pattern exists but the sample size is smaller or there are confounding factors. Scores below 50 are exploratory: the AI has detected a potential pattern but needs more data to confirm it. Use confidence scores to calibrate how seriously to take each recommendation." },
    ],
    operatorGuidance: {
      doThis: [
        "Use the pre-trade checklist for every trade until rule adherence becomes automatic",
        "Read the confidence score on every recommendation -- high confidence recommendations deserve more attention",
        "Act on strategic recommendations that have high confidence and align with your own analysis",
        "Use post-trade analysis to build a feedback loop between your stated plan and your actual execution",
      ],
      neverDoThis: [
        "Never follow AI recommendations blindly -- the AI provides analysis, you provide judgment",
        "Never dismiss all AI recommendations because one was wrong -- evaluate each on its own merits",
        "Never disable real-time alerts during live trading -- they exist to catch what you miss in the heat of the moment",
        "Never use AI analysis as an excuse for a bad trade -- you made the decision, the AI informed it",
      ],
    },
    capabilities: [
      { name: "Rule Compliance Check", description: "Automated verification of your trade against your stated rules before execution.", example: "Pre-trade check: HTF alignment [PASS]. Killzone timing [PASS]. Risk per trade [PASS at 0.98%]. Portfolio heat [PASS at 3.2%]. Post-loss cooldown [WARNING: last loss was 22 minutes ago, your rule requires 30 minutes]. Proceed with awareness." },
      { name: "Strategic Insight", description: "Data-driven insights based on your performance data with statistical backing.", example: "Recommendation (confidence: 87): Your win rate on trades with 3+ timeframe alignment is 74%, versus 48% on trades with 2 or fewer. Requiring 3-timeframe alignment as a minimum filter would reduce your trade count by 30% but improve your expectancy by an estimated 45%." },
    ],
  },
  {
    id: "integration-architecture",
    title: "Integration Architecture",
    tagline: "The AI connects all 5 copilot layers into a unified intelligence system.",
    icon: Network,
    color: "#ec4899",
    systemCode: "INT-CROSS-LAYER",
    overview: "The AI Copilot does not operate in isolation. It is the connective intelligence layer that integrates data and insights from all five other copilot layers: Strategy (your trading methodology), Activity (your real-time execution), Psychology (your emotional and cognitive patterns), Secure Environment (your security posture), and Mentor Intelligence (your skill development). This cross-layer integration enables insights that no single layer could produce on its own. For example: the AI can correlate your psychology signals with your activity data and your strategy rules to explain why a specific trade deviated from your plan -- it was not a strategy failure, it was a psychological event triggered by a specific behavioral pattern.",
    components: [
      { label: "Strategy Layer Integration", description: "Access to your strategy definitions, rules, and historical strategy performance. Enables the AI to verify trades against strategy criteria and identify strategy improvements.", status: "active" },
      { label: "Activity Layer Integration", description: "Real-time access to your live trading activity, open positions, P&L, and session metrics. Enables live monitoring and real-time behavioral signal detection.", status: "active" },
      { label: "Psychology Layer Integration", description: "Access to your psychological profile, cognitive bias assessments, and emotional state estimations. Enables the AI to factor your psychological state into its analysis.", status: "active" },
      { label: "Secure Layer Integration", description: "Awareness of your security posture and session health. Ensures all AI operations comply with security protocols.", status: "active" },
      { label: "Mentor Layer Integration", description: "Access to your learning progress, mastery levels, and identified skill gaps. Enables the AI to recommend relevant educational content at the right time.", status: "active" },
    ],
    deepDive: [
      { heading: "Cross-Layer Insight Generation", body: "The most valuable insights come from connecting data across layers. Example: The Strategy layer shows you have a rule to wait for H4 confirmation before entering. The Activity layer shows you entered 3 trades this week without H4 confirmation. The Psychology layer shows your emotional state was elevated (post-win euphoria) during all 3 entries. The Mentor layer shows you have not yet mastered the 'Patience' module. Cross-layer insight: Your H4 confirmation rule breaks are connected to post-win euphoria, which is connected to an undeveloped patience skill. The recommendation is specific: engage Psychology Lab mode to work on post-win euphoria, revisit the Patience module in Mentor, and consider adding a mandatory checklist step for H4 confirmation." },
      { heading: "Data Flow Architecture", body: "Data flows between layers through a secure event bus. Each layer publishes events (trade opened, signal detected, module completed) and subscribes to events from other layers. The AI Copilot is the primary subscriber to all events, maintaining a real-time understanding of the complete system state. All data flow is encrypted and subject to the same security protocols as the Secure Environment layer." },
      { heading: "The Unified Operator Model", body: "The integration of all layers creates a Unified Operator Model -- a comprehensive, real-time understanding of who you are as a trader: what you know (Mentor), what you plan (Strategy), what you do (Activity), how you feel (Psychology), how you are protected (Secure), and how these all interact (AI). This unified model is what enables the AI to provide truly personalized, contextually relevant guidance that no generic trading tool could match." },
    ],
    operatorGuidance: {
      doThis: [
        "Engage with all copilot layers to build the most complete unified model -- the AI is only as good as the data it has",
        "Review cross-layer insights with an open mind -- the connections between layers often reveal blind spots",
        "Use the AI as a translator between layers -- it can explain how your psychology affects your strategy execution",
        "Trust the unified model's recommendations when they are supported by data from multiple layers",
      ],
      neverDoThis: [
        "Never ignore insights that span multiple layers -- these are the highest-value insights in the system",
        "Never treat the copilot layers as independent tools -- they are designed to work together through the AI",
        "Never assume you can see cross-layer patterns on your own -- the data volume is too large for human pattern recognition",
      ],
    },
    capabilities: [
      { name: "Root Cause Analysis", description: "When a trade fails, the AI can trace the root cause across multiple layers to identify the true source of the failure.", example: "Trade review root cause: The losing trade was not a strategy failure (setup was valid) or an execution error (entry was precise). It was a psychology-driven premature exit. Your emotional state estimator showed elevated anxiety from two previous losses. The Mentor layer shows you have not yet mastered the 'Trade Management' module. Root cause: anxiety-driven early exit due to undeveloped management skills, triggered by recent loss sequence." },
      { name: "Unified Development Plan", description: "The AI creates a personalized development plan that prioritizes improvements across all layers based on their expected impact on your overall performance.", example: "Development priority: (1) Eliminate off-hours trading (Activity) -- expected impact: +12% monthly expectancy. (2) Complete the Psychology module on loss aversion (Mentor) -- expected impact: reduce max drawdown by 2.1pp. (3) Add H4 confirmation to your pre-trade checklist (Strategy) -- expected impact: +8% win rate. Total expected improvement: +23% expectancy, -2.1pp max drawdown." },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════ */

interface AIGuideProps {
  onStartDemo?: () => void
}

export function AIGuideAndTutorial({ onStartDemo }: AIGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedSub, setExpandedSub] = useState<string | null>(null)

  const toggleSection = useCallback((id: string) => {
    setExpandedSection(prev => prev === id ? null : id)
    setExpandedSub(null)
  }, [])

  return (
    <div className="px-3 pb-6 pt-2">
      {/* ── Master Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400/50" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em] text-purple-400/60">
            Complete AI Intelligence Reference
          </span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>
        <p className="text-[9px] font-mono text-white/30 leading-relaxed max-w-[600px]">
          Full documentation of the AI Copilot intelligence system. Six interconnected
          subsystems that observe, learn, and advise. The AI watches your trading behavior,
          constructs a dynamic model of your patterns, and surfaces insights through
          specialized conversation modes. It connects all 5 other copilot layers into
          a unified intelligence architecture.
        </p>
      </div>

      {/* ── AI Sections ── */}
      <div className="space-y-[2px]">
        {AI_SECTIONS.map((section) => {
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
                    <span className="text-[11px] font-mono font-black text-white/60 group-hover:text-white/80 transition-colors">
                      {section.title}
                    </span>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                      style={{ color: `${section.color}60`, backgroundColor: `${section.color}06`, borderColor: `${section.color}15` }}>
                      {section.systemCode}
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

                      {/* Components */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">System Components</div>
                        <div className="space-y-[1px]">
                          {section.components.map((c, i) => (
                            <div key={i} className="px-2.5 py-2 bg-white/[0.008] hover:bg-white/[0.02] transition-colors">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: c.status === "active" ? "#10b981" : c.status === "ready" ? "#06b6d4" : c.status === "learning" ? "#f59e0b" : "#6b7280" }} />
                                <span className="text-[9px] font-mono font-bold text-white/50">{c.label}</span>
                                <span className="text-[6px] font-mono font-bold uppercase tracking-wider ml-auto shrink-0"
                                  style={{ color: c.status === "active" ? "rgba(16,185,129,0.5)" : c.status === "ready" ? "rgba(6,182,212,0.5)" : "rgba(245,158,11,0.5)" }}>
                                  {c.status}
                                </span>
                              </div>
                              <p className="text-[8px] font-mono text-white/25 leading-relaxed ml-3.5">{c.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deep Dive */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Deep Dive</div>
                        <div className="space-y-[1px]">
                          {section.deepDive.map((d, i) => {
                            const subKey = `${section.id}-deep-${i}`
                            const isSubExpanded = expandedSub === subKey
                            return (
                              <div key={i}>
                                <button
                                  onClick={() => setExpandedSub(prev => prev === subKey ? null : subKey)}
                                  className="w-full flex items-center gap-2 px-2.5 py-2 bg-white/[0.008] hover:bg-white/[0.02] transition-colors text-left"
                                >
                                  <BookOpen className="w-2.5 h-2.5 shrink-0" style={{ color: `${section.color}40` }} />
                                  <span className="text-[9px] font-mono font-bold text-white/40 flex-1">{d.heading}</span>
                                  <ChevronRight className={`w-2.5 h-2.5 text-white/15 transition-transform duration-200 shrink-0 ${isSubExpanded ? "rotate-90" : ""}`} />
                                </button>
                                <AnimatePresence>
                                  {isSubExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 py-2 ml-4 border-l" style={{ borderColor: `${section.color}10` }}>
                                        <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{d.body}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Capabilities</div>
                        <div className="space-y-1.5">
                          {section.capabilities.map((cap, i) => {
                            const capKey = `${section.id}-cap-${i}`
                            const isCapExpanded = expandedSub === capKey
                            return (
                              <div key={i}>
                                <button
                                  onClick={() => setExpandedSub(prev => prev === capKey ? null : capKey)}
                                  className="w-full flex items-center gap-2 px-2.5 py-2 bg-white/[0.008] hover:bg-white/[0.02] transition-colors text-left"
                                >
                                  <Zap className="w-2.5 h-2.5 shrink-0" style={{ color: `${section.color}40` }} />
                                  <div className="flex-1">
                                    <span className="text-[9px] font-mono font-bold text-white/40">{cap.name}</span>
                                    <p className="text-[7px] font-mono text-white/20 mt-0.5">{cap.description}</p>
                                  </div>
                                  <ChevronRight className={`w-2.5 h-2.5 text-white/15 transition-transform duration-200 shrink-0 ${isCapExpanded ? "rotate-90" : ""}`} />
                                </button>
                                <AnimatePresence>
                                  {isCapExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 py-2 ml-4 border-l border-emerald-400/10">
                                        <div className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider mb-1">Live Example</div>
                                        <p className="text-[8px] font-mono text-white/30 leading-[1.7] italic">{cap.example}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Operator Guidance */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Operator Guidance</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center gap-1 mb-1.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/50" />
                              <span className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider">Do This</span>
                            </div>
                            <div className="space-y-1">
                              {section.operatorGuidance.doThis.map((d, i) => (
                                <div key={i} className="flex items-start gap-1.5 px-2 py-1 bg-emerald-400/[0.02]">
                                  <div className="w-0.5 h-0.5 rounded-full bg-emerald-400/30 mt-1.5 shrink-0" />
                                  <p className="text-[7px] font-mono text-white/25 leading-relaxed">{d}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1.5">
                              <AlertTriangle className="w-2.5 h-2.5 text-red-400/50" />
                              <span className="text-[7px] font-mono text-red-400/40 uppercase tracking-wider">Never Do This</span>
                            </div>
                            <div className="space-y-1">
                              {section.operatorGuidance.neverDoThis.map((d, i) => (
                                <div key={i} className="flex items-start gap-1.5 px-2 py-1 bg-red-400/[0.02]">
                                  <div className="w-0.5 h-0.5 rounded-full bg-red-400/30 mt-1.5 shrink-0" />
                                  <p className="text-[7px] font-mono text-white/25 leading-relaxed">{d}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

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
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-400/15 bg-purple-400/[0.04] hover:bg-purple-400/[0.08] transition-all group"
          >
            <Sparkles className="w-3 h-3 text-purple-400/50 group-hover:text-purple-400/70 transition-colors" />
            <span className="text-[9px] font-mono font-bold text-purple-400/50 group-hover:text-purple-400/70 uppercase tracking-wider transition-colors">
              Engage AI Intelligence
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
