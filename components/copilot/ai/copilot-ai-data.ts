import {
  Target, Globe, Waypoints, HeartPulse, BookOpen, GitBranch,
  RotateCcw, SunMedium, Moon, Flame, ShieldAlert, Layers,
  Scale, Search, Timer, Shield
} from "lucide-react"

/* =================================================================
   TYPES
   ================================================================= */

export interface Message {
  id: string; role: "user" | "assistant"; content: string
  timestamp: number; type?: "warning" | "insight" | "analysis" | "coaching"
}

export interface ConversationMode {
  id: string
  label: string
  icon: typeof Target
  hex: string
  desc: string
  aiMode: string
  starters: string[]
}

export interface BehaviorSignal {
  id: string
  category: "psychology" | "strategy" | "risk" | "discipline"
  title: string
  question: string
  reasoning: string
  impact: "critical" | "high" | "medium"
  trigger: string
  icon: typeof Target
  mapsToMode: string
}

export interface ChatThread {
  id: string
  typeId: string
  messages: Message[]
  createdAt: number
  lastActive: number
  title: string
}

/* =================================================================
   CONSTANTS
   ================================================================= */

export const CONVERSATION_MODES: ConversationMode[] = [
  { id: "market-thinking", label: "Market Thinking", icon: Globe, hex: "#3b82f6",
    desc: "Analyze market structure, directional bias, and key levels with your AI analyst.",
    aiMode: "Analyst",
    starters: ["What's the current market structure on my main pair?", "Show me where smart money is positioning", "Break down the session so far"] },
  { id: "scenario-lab", label: "Scenario Lab", icon: Waypoints, hex: "#8b5cf6",
    desc: "Build if-then scenarios and stress-test your trade ideas before committing capital.",
    aiMode: "Strategist",
    starters: ["What if price breaks below today's low?", "Build scenarios for my EURUSD idea", "What's the best and worst case from here?"] },
  { id: "journal-reflect", label: "Journal", icon: BookOpen, hex: "#06b6d4",
    desc: "Review your trades with an AI mirror that helps you see patterns in your decisions.",
    aiMode: "Mirror",
    starters: ["Review my last trade objectively", "What patterns show up in my recent losses?", "How does today compare to my best trading days?"] },
  { id: "strategy-refine", label: "Strategy", icon: GitBranch, hex: "#10b981",
    desc: "Refine your trading plan and rules with structured strategic feedback.",
    aiMode: "Strategist",
    starters: ["Where is my strategy leaking edge?", "Help me tighten my entry rules", "Review my risk management framework"] },
  { id: "coach-mode", label: "Coach", icon: HeartPulse, hex: "#f43f5e",
    desc: "Personal trading coach for discipline, accountability, and emotional guidance.",
    aiMode: "Coach",
    starters: ["I just took a loss, talk me through it", "Am I trading with discipline today?", "Help me stay focused this session"] },
  { id: "post-trade", label: "Post-Trade", icon: RotateCcw, hex: "#f59e0b",
    desc: "Structured post-trade review to extract maximum learning from every position.",
    aiMode: "Mirror",
    starters: ["Grade my last trade execution", "What would I do differently?", "Was my risk management correct?"] },
  { id: "pre-market", label: "Pre-Market", icon: SunMedium, hex: "#ec4899",
    desc: "Session preparation: build your watchlist, set levels, define your plan.",
    aiMode: "Strategist",
    starters: ["Build my session plan for today", "What setups should I be looking for?", "What are the key events coming up?"] },
  { id: "reset", label: "Reset", icon: Moon, hex: "#14b8a6",
    desc: "Emotional regulation and mental reset when you need to step back and recenter.",
    aiMode: "Coach",
    starters: ["I need to calm down before my next trade", "Guide me through a breathing exercise", "Am I in the right headspace to trade?"] },
]

export const BEHAVIOR_SIGNALS: BehaviorSignal[] = [
  {
    id: "bs1", category: "psychology", title: "Revenge Pattern",
    question: "Am I entering this trade to recover my last loss, or because the setup is genuinely valid?",
    reasoning: "After a losing trade, the brain's loss-aversion circuits push for immediate recovery. This creates urgency that overrides your playbook.",
    impact: "critical", trigger: "Post-loss entry detected", icon: Flame,
    mapsToMode: "coach-mode"
  },
  {
    id: "bs2", category: "discipline", title: "Rule Adherence",
    question: "Does this entry satisfy every checkpoint in my trading plan, or am I skipping steps?",
    reasoning: "Edge erodes when rules are bent. Each shortcut trains the brain to accept lower-quality setups, compounding over time.",
    impact: "critical", trigger: "Entry checklist incomplete", icon: ShieldAlert,
    mapsToMode: "strategy-refine"
  },
  {
    id: "bs3", category: "strategy", title: "Timeframe Alignment",
    question: "Is my setup aligned with the higher-timeframe directional bias, or am I counter-trend without knowing it?",
    reasoning: "Trades against the dominant flow have a structurally lower win rate. Knowing your position relative to HTF bias changes your expectancy.",
    impact: "high", trigger: "Multi-TF check required", icon: Layers,
    mapsToMode: "market-thinking"
  },
  {
    id: "bs4", category: "risk", title: "Exposure Check",
    question: "If all my open positions move against me simultaneously, can I survive the drawdown?",
    reasoning: "Correlated positions create hidden leverage. What feels like 3 separate trades can behave like 1 oversized bet during volatility spikes.",
    impact: "high", trigger: "Multiple positions open", icon: Scale,
    mapsToMode: "strategy-refine"
  },
  {
    id: "bs5", category: "psychology", title: "FOMO Scanner",
    question: "Am I chasing this move because I missed the entry, or is there still a valid setup at this price?",
    reasoning: "FOMO entries typically have worse R:R because you are paying up for the move. The best setups come to you at your predefined level.",
    impact: "high", trigger: "Extended price action detected", icon: Search,
    mapsToMode: "coach-mode"
  },
  {
    id: "bs6", category: "discipline", title: "Session Boundaries",
    question: "Am I still within my optimal trading hours, or am I overtrading outside my edge window?",
    reasoning: "Your historical win rate peaks during specific sessions. Trading outside these windows dilutes your overall edge and increases emotional fatigue.",
    impact: "medium", trigger: "Outside peak session", icon: Timer,
    mapsToMode: "reset"
  },
]

export const CATEGORY_STYLES: Record<string, { hex: string; bg: string; text: string; border: string }> = {
  psychology: { hex: "#f59e0b", bg: "bg-amber-500/[0.06]", text: "text-amber-400/80", border: "border-amber-500/[0.10]" },
  strategy: { hex: "#8b5cf6", bg: "bg-purple-500/[0.06]", text: "text-purple-400/80", border: "border-purple-500/[0.10]" },
  risk: { hex: "#ef4444", bg: "bg-red-500/[0.06]", text: "text-red-400/80", border: "border-red-500/[0.10]" },
  discipline: { hex: "#10b981", bg: "bg-emerald-500/[0.06]", text: "text-emerald-400/80", border: "border-emerald-500/[0.10]" },
}
