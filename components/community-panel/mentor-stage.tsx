"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Shield,
  Crown,
  Activity,
  TrendingUp,
  TrendingDown,
  Send,
  Star,
  Bookmark,
  ChevronRight,
  Eye,
  Clock,
  Zap,
  BarChart3,
  AlertTriangle,
  Target,
  MessageSquare,
  Sparkles,
  Radio,
  Flame,
  Wifi,
  Mic,
  Volume2,
  Maximize2,
  Monitor,
  Layers,
  Share2,
  Copy,
  ChevronDown,
  Crosshair,
  ArrowUpRight,
  Check,
  Play,
  Lock,
  Globe,
  Cpu,
  LineChart,
  BellRing,
  Radar,
  Scan,
  Gauge,
  ExternalLink,
  Heart,
  ThumbsUp,
  Pin,
  MoreHorizontal,
  Reply,
  AtSign,
  Hash,
  ChevronUp,
  ArrowDown,
  Quote,
  UserPlus,
  CircleDot,
  GripVertical,
  Signal,
  UserCheck,
  HelpCircle,
  HandMetal,
  Focus,
  ArrowRightLeft,
  LogIn,
  LogOut,
  ShieldAlert,
  Megaphone,
  Milestone,
  Timer,
  CircleArrowUp,
  CircleArrowDown,
  Minus,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ══════════════════════════════════════════════════════════════════
// MENTOR STAGE — flagship live-room surface
// ══════════════════════════════════════════════════════════════════

const EASE_PREMIUM = [0.22, 0.68, 0.36, 1] as const

// ── Stage data ──

interface StageInstrument {
  symbol: string
  direction: "bullish" | "bearish" | "neutral"
  note: string
  priority: "primary" | "secondary"
  change?: string
}

interface StageFocusBlock {
  id: string
  type: "thesis" | "watch" | "risk" | "behavior"
  title: string
  content: string
  urgency: "high" | "medium" | "low"
  details?: { label: string; value: string }[]
  actionLabel?: string
}

const MENTOR = {
  name: "Mentor Alex",
  initials: "A",
  title: "Senior Market Strategist",
  gradient: "from-emerald-500 to-cyan-500",
  track: { winRate: 78, accuracy: 92, streak: 12, sessions: 847, pnl: "+$247K" },
  badges: ["Top Mentor", "Gold Specialist", "Verified"],
  status: "Analyzing live flow" as const,
}

const SESSION = {
  name: "NY Session Live Trading",
  phase: "Active Session" as const,
  elapsed: "45m",
  startedAt: "2:00 PM EST",
  theme: "Institutional flow analysis — Gold & EUR/USD",
  mode: "execution" as "observation" | "setup" | "execution" | "review",
}

const INSTRUMENTS: StageInstrument[] = [
  { symbol: "XAU/USD", direction: "bullish", note: "Watching 2035 sweep", priority: "primary", change: "+0.42%" },
  { symbol: "EUR/USD", direction: "bearish", note: "Below 1.0850 supply", priority: "primary", change: "-0.18%" },
  { symbol: "DXY", direction: "bullish", note: "Supporting thesis", priority: "secondary", change: "+0.11%" },
  { symbol: "US10Y", direction: "neutral", note: "Range-bound context", priority: "secondary", change: "-0.03%" },
]

const FOCUS_BLOCKS: StageFocusBlock[] = [
  {
    id: "fb-1", type: "thesis", title: "Current Thesis", urgency: "high",
    content: "Gold pushing into 2035 liquidity pool. Expecting a sweep + displacement for long entry. EUR/USD short bias remains while DXY holds above 104.20.",
    details: [
      { label: "Entry Zone", value: "2033.50 - 2035.80" },
      { label: "Target", value: "2042.00 (+0.35%)" },
      { label: "Invalidation", value: "Below 2028.00" },
      { label: "R:R Ratio", value: "1:3.2" },
    ],
    actionLabel: "Copy Thesis",
  },
  {
    id: "fb-2", type: "watch", title: "What to Watch", urgency: "high",
    content: "2035.50 sweep on Gold for entry confirmation. EUR/USD reaction at 1.0840 demand. DXY 104.20 as macro anchor.",
    details: [
      { label: "Key Level 1", value: "XAU 2035.50 (sweep)" },
      { label: "Key Level 2", value: "EUR 1.0840 (demand)" },
      { label: "Macro Anchor", value: "DXY 104.20" },
    ],
    actionLabel: "Set Alert",
  },
  {
    id: "fb-3", type: "risk", title: "Current Risk", urgency: "medium",
    content: "FOMC minutes in 2h — reduce size into event. Gold could trap both sides above 2040.",
    details: [
      { label: "Event", value: "FOMC Minutes (2h)" },
      { label: "Risk Level", value: "Medium-High" },
      { label: "Action", value: "Reduce size 50%" },
    ],
    actionLabel: "Risk Overlay",
  },
  {
    id: "fb-4", type: "behavior", title: "Key Behavior Today", urgency: "low",
    content: "Institutions accumulating Gold below 2030. Smart money divergence visible on 15m order flow. Wait for displacement, do not chase.",
    details: [
      { label: "Pattern", value: "Accumulation" },
      { label: "Timeframe", value: "15m Order Flow" },
      { label: "Bias", value: "Wait for displacement" },
    ],
    actionLabel: "View Flow",
  },
]

// ── Discussion data model ──

type MessageType = "mentor" | "mentor-pinned" | "audience" | "question" | "callout" | "system" | "join"

interface DiscussionMessage {
  id: string
  type: MessageType
  userName: string
  userAvatar: string
  userColor: string
  message: string
  timestamp: string
  role?: "mentor" | "moderator" | "subscriber" | "member"
  instrument?: string
  reactions?: { emoji: string; count: number; reacted?: boolean }[]
  isPinned?: boolean
  replyTo?: string
}

const DISCUSSION_FEED: DiscussionMessage[] = [
  {
    id: "d-pin", type: "mentor-pinned", userName: "Mentor Alex", userAvatar: "A", userColor: "from-emerald-500 to-cyan-500",
    message: "Gold is approaching 2035 sweep zone. Wait for displacement before entering long. Do NOT chase. This is the level we discussed at session open.",
    timestamp: "2:28 PM", role: "mentor", instrument: "XAU/USD", isPinned: true,
    reactions: [{ emoji: "fire", count: 47, reacted: false }, { emoji: "target", count: 23 }, { emoji: "check", count: 18 }],
  },
  {
    id: "d-sys1", type: "system", userName: "Room", userAvatar: "R", userColor: "from-slate-500 to-slate-600",
    message: "Mentor Alex updated the thesis — Gold sweep zone active", timestamp: "2:30 PM",
  },
  {
    id: "d-1", type: "mentor", userName: "Mentor Alex", userAvatar: "A", userColor: "from-emerald-500 to-cyan-500",
    message: "Notice the delta divergence on Gold 15m. Institutions are absorbing sell-side liquidity below 2033. Classic accumulation before a sweep.",
    timestamp: "2:32 PM", role: "mentor", instrument: "XAU/USD",
    reactions: [{ emoji: "brain", count: 34 }, { emoji: "eyes", count: 12 }],
  },
  {
    id: "d-2", type: "audience", userName: "TraderMike", userAvatar: "T", userColor: "from-blue-500 to-cyan-500",
    message: "Great call on that Gold setup! The order flow is exactly as you described.", timestamp: "2:34 PM", role: "subscriber",
    reactions: [{ emoji: "thumbsUp", count: 8 }],
  },
  {
    id: "d-3", type: "question", userName: "SarahFX", userAvatar: "S", userColor: "from-pink-500 to-rose-500",
    message: "What invalidation level are you watching for EUR/USD short? Is 1.0870 still the line?", timestamp: "2:35 PM", role: "subscriber", instrument: "EUR/USD",
    reactions: [{ emoji: "question", count: 5 }],
  },
  {
    id: "d-join1", type: "join", userName: "Room", userAvatar: "", userColor: "",
    message: "Maya, Jordan, Ali joined the stage", timestamp: "2:35 PM",
  },
  {
    id: "d-4", type: "mentor", userName: "Mentor Alex", userAvatar: "A", userColor: "from-emerald-500 to-cyan-500",
    message: "Good question Sarah. Yes, 1.0870 is the invalidation. If price closes above that level on 15m, we exit the short bias. Until then, we hold conviction.",
    timestamp: "2:36 PM", role: "mentor", replyTo: "SarahFX", instrument: "EUR/USD",
    reactions: [{ emoji: "check", count: 22 }, { emoji: "fire", count: 9 }],
  },
  {
    id: "d-5", type: "callout", userName: "GoldTrader", userAvatar: "G", userColor: "from-yellow-500 to-amber-500",
    message: "2035 sweep incoming! Volume spike on the 5m. This is the move Alex called.", timestamp: "2:37 PM", role: "subscriber", instrument: "XAU/USD",
    reactions: [{ emoji: "rocket", count: 31 }, { emoji: "eyes", count: 15 }],
  },
  {
    id: "d-6", type: "audience", userName: "CryptoKing", userAvatar: "C", userColor: "from-amber-500 to-orange-500",
    message: "DXY holding 104.20 perfectly as the anchor. This thesis is playing out textbook.", timestamp: "2:37 PM", role: "member",
    reactions: [{ emoji: "thumbsUp", count: 6 }],
  },
  {
    id: "d-7", type: "audience", userName: "NoviceFX", userAvatar: "N", userColor: "from-violet-500 to-purple-500",
    message: "Thanks for the DXY context. Starting to see how the macro picture connects to individual setups.", timestamp: "2:38 PM", role: "member",
  },
  {
    id: "d-8", type: "mentor", userName: "Mentor Alex", userAvatar: "A", userColor: "from-emerald-500 to-cyan-500",
    message: "There is the displacement. Entry is live at 2034.20. Targeting 2042 with invalidation below 2028. This is a 1:3.2 R:R setup. Size accordingly — FOMC in 2h.",
    timestamp: "2:39 PM", role: "mentor", instrument: "XAU/USD",
    reactions: [{ emoji: "fire", count: 63 }, { emoji: "rocket", count: 42 }, { emoji: "target", count: 28 }],
  },
]

// ══════════════════════════════════════════════════════════════════
// ROOM PULSE / LIVE REACTIONS DATA + TYPES
// ══════════════════════════════════════════════════════════════════

type RoomSignalType = "agree" | "strong" | "caution" | "key-level" | "follow" | "question-mark" | "fire" | "aligned"

interface RoomSignal {
  type: RoomSignalType
  label: string
  icon: typeof Flame
  color: string
  count: number
}

interface ReactionMoment {
  id: string
  signal: RoomSignalType
  triggeredBy: string          // what caused the burst
  timestamp: string
  intensity: number            // 1-5 scale
  participantCount: number     // how many reacted
}

interface RoomPulseData {
  currentMomentum: "calm" | "building" | "surging" | "peak"
  momentumValue: number        // 0-100 normalized
  signalCounts: RoomSignal[]
  recentMoments: ReactionMoment[]
  activeSignals: number        // signals in last 60s
  dominantSentiment: RoomSignalType
}

const ROOM_SIGNAL_CONFIG: Record<RoomSignalType, { label: string; icon: typeof Flame; color: string; accent: string }> = {
  agree:          { label: "Agree",      icon: UserCheck,    color: "16,185,129",  accent: "52,211,153" },
  strong:         { label: "Strong",     icon: Flame,        color: "239,68,68",   accent: "248,113,113" },
  caution:        { label: "Caution",    icon: AlertTriangle, color: "245,158,11", accent: "251,191,36" },
  "key-level":    { label: "Key Level",  icon: Target,       color: "56,189,248",  accent: "125,211,252" },
  follow:         { label: "Follow",     icon: Eye,          color: "139,92,246",  accent: "167,139,250" },
  "question-mark": { label: "Question",  icon: HelpCircle,   color: "56,189,248",  accent: "125,211,252" },
  fire:           { label: "Conviction", icon: TrendingUp,   color: "239,68,68",   accent: "248,113,113" },
  aligned:        { label: "Aligned",    icon: Focus,        color: "16,185,129",  accent: "110,231,183" },
}

const ROOM_PULSE: RoomPulseData = {
  currentMomentum: "surging",
  momentumValue: 82,
  signalCounts: [
    { type: "agree", label: "Agree", icon: UserCheck, color: "16,185,129", count: 89 },
    { type: "strong", label: "Strong", icon: Flame, color: "239,68,68", count: 63 },
    { type: "caution", label: "Caution", icon: AlertTriangle, color: "245,158,11", count: 14 },
    { type: "key-level", label: "Key Level", icon: Target, color: "56,189,248", count: 47 },
    { type: "follow", label: "Follow", icon: Eye, color: "139,92,246", count: 38 },
    { type: "fire", label: "Conviction", icon: TrendingUp, color: "239,68,68", count: 72 },
    { type: "aligned", label: "Aligned", icon: Focus, color: "16,185,129", count: 55 },
  ],
  recentMoments: [
    {
      id: "rm-1", signal: "fire", triggeredBy: "Entry live at 2034.20 — 1:3.2 R:R",
      timestamp: "12s ago", intensity: 5, participantCount: 47,
    },
    {
      id: "rm-2", signal: "agree", triggeredBy: "Gold sweep zone confirmed",
      timestamp: "1m ago", intensity: 4, participantCount: 34,
    },
    {
      id: "rm-3", signal: "key-level", triggeredBy: "2035 level marked critical",
      timestamp: "3m ago", intensity: 3, participantCount: 28,
    },
    {
      id: "rm-4", signal: "caution", triggeredBy: "FOMC in 2h — size accordingly",
      timestamp: "5m ago", intensity: 2, participantCount: 19,
    },
  ],
  activeSignals: 127,
  dominantSentiment: "fire",
}

// ══════════════════════════════════════════════════════════════════
// LIVE SESSION TIMELINE DATA + TYPES
// ══════════════════════════════════════════════════════════════════

type SessionEventType =
  | "entry"            // trade entry
  | "exit"             // trade exit
  | "bias-shift"       // directional bias changed
  | "focus-change"     // instrument focus shifted
  | "thesis-update"    // thesis rewritten
  | "level-call"       // key level identified
  | "warning"          // risk/caution alert
  | "mode-change"      // session mode shifted (observation->setup->execution->review)
  | "key-moment"       // significant moment flagged by mentor
  | "audience-milestone" // audience count milestone
  | "system"           // session open/close, system events

type SessionPhase = "observation" | "setup" | "execution" | "review"

interface SessionEvent {
  id: string
  type: SessionEventType
  timestamp: string             // display time e.g. "2:15 PM"
  elapsedAt: string             // session-relative e.g. "12m"
  description: string
  instrument?: string
  direction?: "bullish" | "bearish" | "neutral"
  importance: 1 | 2 | 3 | 4 | 5
  pnl?: string                  // for entry/exit events
  previousValue?: string        // for bias-shift, thesis-update, mode-change
  newValue?: string
  mentorTriggered: boolean      // true = mentor action, false = system/audience
  roomReaction?: number         // how many people reacted
  details?: { label: string; value: string }[] // structured details
  phase: SessionPhase           // what phase the session was in when this happened
}

interface SessionTimelineData {
  events: SessionEvent[]
  currentPhase: SessionPhase
  phaseHistory: { phase: SessionPhase; startedAt: string; elapsedAt: string }[]
  runningPnl: string
  tradesOpen: number
  tradesClosed: number
  totalEvents: number
  highImportanceCount: number
  lastEventTime: string
}

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

const SESSION_TIMELINE: SessionTimelineData = {
  currentPhase: "execution",
  phaseHistory: [
    { phase: "observation", startedAt: "2:00 PM", elapsedAt: "0m" },
    { phase: "setup", startedAt: "2:12 PM", elapsedAt: "12m" },
    { phase: "execution", startedAt: "2:28 PM", elapsedAt: "28m" },
  ],
  runningPnl: "+$1,240",
  tradesOpen: 1,
  tradesClosed: 1,
  totalEvents: 16,
  highImportanceCount: 5,
  lastEventTime: "2:42 PM",
  events: [
    {
      id: "te-1", type: "system", timestamp: "2:00 PM", elapsedAt: "0m",
      description: "Session opened — NY Session Live Trading",
      importance: 2, mentorTriggered: false, phase: "observation",
    },
    {
      id: "te-2", type: "mode-change", timestamp: "2:00 PM", elapsedAt: "0m",
      description: "Session mode set to Observation",
      previousValue: "—", newValue: "Observation",
      importance: 2, mentorTriggered: true, phase: "observation",
    },
    {
      id: "te-3", type: "focus-change", timestamp: "2:03 PM", elapsedAt: "3m",
      description: "Primary focus set to Gold and EUR/USD",
      instrument: "XAU/USD", importance: 3, mentorTriggered: true, phase: "observation",
      details: [
        { label: "Primary", value: "XAU/USD, EUR/USD" },
        { label: "Context", value: "DXY, US10Y" },
      ],
    },
    {
      id: "te-4", type: "thesis-update", timestamp: "2:08 PM", elapsedAt: "8m",
      description: "Initial thesis published — Gold sweep at 2035 for longs",
      instrument: "XAU/USD", direction: "bullish", importance: 4, mentorTriggered: true, phase: "observation",
      roomReaction: 34,
      details: [
        { label: "Thesis", value: "Gold pushing into 2035 liquidity pool" },
        { label: "Entry Zone", value: "2033.50 - 2035.80" },
        { label: "Target", value: "2042.00" },
      ],
    },
    {
      id: "te-5", type: "level-call", timestamp: "2:10 PM", elapsedAt: "10m",
      description: "Key level identified: 2035.50 sweep zone",
      instrument: "XAU/USD", direction: "bullish", importance: 4, mentorTriggered: true, phase: "observation",
      roomReaction: 28,
      details: [
        { label: "Level", value: "2035.50" },
        { label: "Type", value: "Liquidity sweep" },
        { label: "Action", value: "Wait for displacement" },
      ],
    },
    {
      id: "te-6", type: "mode-change", timestamp: "2:12 PM", elapsedAt: "12m",
      description: "Mode shifted to Setup — preparing for entries",
      previousValue: "Observation", newValue: "Setup",
      importance: 3, mentorTriggered: true, phase: "setup",
    },
    {
      id: "te-7", type: "warning", timestamp: "2:15 PM", elapsedAt: "15m",
      description: "FOMC minutes in 2h — reduce position size",
      importance: 4, mentorTriggered: true, phase: "setup",
      roomReaction: 19,
      details: [
        { label: "Event", value: "FOMC Minutes" },
        { label: "Time", value: "2 hours away" },
        { label: "Action", value: "Size at 50%" },
      ],
    },
    {
      id: "te-8", type: "level-call", timestamp: "2:18 PM", elapsedAt: "18m",
      description: "EUR/USD invalidation level: 1.0870 on 15m close",
      instrument: "EUR/USD", direction: "bearish", importance: 3, mentorTriggered: true, phase: "setup",
      details: [
        { label: "Level", value: "1.0870" },
        { label: "Type", value: "Invalidation" },
        { label: "Timeframe", value: "15m close" },
      ],
    },
    {
      id: "te-9", type: "bias-shift", timestamp: "2:22 PM", elapsedAt: "22m",
      description: "Gold bias confirmed bullish after accumulation pattern",
      instrument: "XAU/USD", direction: "bullish", importance: 3, mentorTriggered: true, phase: "setup",
      previousValue: "Watching", newValue: "Bullish confirmed",
      roomReaction: 22,
    },
    {
      id: "te-10", type: "audience-milestone", timestamp: "2:25 PM", elapsedAt: "25m",
      description: "Room reached 800 concurrent viewers",
      importance: 1, mentorTriggered: false, phase: "setup",
    },
    {
      id: "te-11", type: "key-moment", timestamp: "2:28 PM", elapsedAt: "28m",
      description: "Delta divergence spotted on Gold 15m — institutional accumulation",
      instrument: "XAU/USD", direction: "bullish", importance: 5, mentorTriggered: true, phase: "setup",
      roomReaction: 42,
    },
    {
      id: "te-12", type: "mode-change", timestamp: "2:28 PM", elapsedAt: "28m",
      description: "Mode shifted to Execution — trades are live",
      previousValue: "Setup", newValue: "Execution",
      importance: 4, mentorTriggered: true, phase: "execution",
    },
    {
      id: "te-13", type: "entry", timestamp: "2:39 PM", elapsedAt: "39m",
      description: "Entry LIVE — Gold long at 2034.20",
      instrument: "XAU/USD", direction: "bullish", importance: 5, mentorTriggered: true, phase: "execution",
      roomReaction: 63,
      details: [
        { label: "Entry", value: "2034.20" },
        { label: "Target", value: "2042.00" },
        { label: "Stop", value: "2028.00" },
        { label: "R:R", value: "1:3.2" },
        { label: "Size", value: "50% (FOMC)" },
      ],
    },
    {
      id: "te-14", type: "key-moment", timestamp: "2:41 PM", elapsedAt: "41m",
      description: "Gold sweeps 2035.50 — displacement confirmed",
      instrument: "XAU/USD", direction: "bullish", importance: 5, mentorTriggered: true, phase: "execution",
      roomReaction: 47,
    },
    {
      id: "te-15", type: "exit", timestamp: "2:42 PM", elapsedAt: "42m",
      description: "Partial exit — Gold TP1 hit at 2038.40",
      instrument: "XAU/USD", direction: "bullish", importance: 4, mentorTriggered: true, phase: "execution",
      pnl: "+$1,240",
      roomReaction: 52,
      details: [
        { label: "Exit Price", value: "2038.40" },
        { label: "P&L", value: "+$1,240" },
        { label: "Remaining", value: "50% running to 2042" },
      ],
    },
    {
      id: "te-16", type: "thesis-update", timestamp: "2:43 PM", elapsedAt: "43m",
      description: "Thesis updated — remaining position targeting 2042 with trail at 2036",
      instrument: "XAU/USD", direction: "bullish", importance: 3, mentorTriggered: true, phase: "execution",
      previousValue: "Entry zone 2033-2035", newValue: "Trail at 2036, TP 2042",
      details: [
        { label: "New Target", value: "2042.00" },
        { label: "Trail Stop", value: "2036.00" },
        { label: "Status", value: "Running 50%" },
      ],
    },
  ],
}

type ParticipantRole = "mentor" | "moderator" | "top-contributor" | "subscriber" | "member"
type EngagementMode = "watching" | "discussing" | "reacting" | "asking" | "sharing-levels"
type PulseLevel = "Calm" | "Active" | "High" | "Surging"

interface Participant {
  name: string
  initials: string
  color: string
  role: ParticipantRole
  engagementMode: EngagementMode
  focusAligned: boolean        // following mentor's current instrument focus
  messageCount: number         // messages this session
  reactionCount: number        // reactions this session
  lastActive: string           // time-ago string
  streak?: number              // sessions attended in a row
}

interface AudienceData {
  total: number
  activeParticipants: number
  recentJoins: string[]
  engagementPulse: PulseLevel
  topParticipants: Participant[]
  activityBreakdown: {
    watching: number
    discussing: number
    reacting: number
    asking: number
    sharingLevels: number
  }
  roomSentiment: {
    bullish: number   // percentage
    bearish: number
    cautious: number
    neutral: number
  }
  sessionPeak: number           // peak active participants this session
  avgSessionTime: string        // average time participants stay
  pulseHistory: number[]        // last 12 activity values for sparkline
}

const AUDIENCE: AudienceData = {
  total: 847,
  activeParticipants: 142,
  recentJoins: ["Maya", "Jordan", "Ali", "Chen"],
  engagementPulse: "High",
  topParticipants: [
    { name: "TraderMike", initials: "TM", color: "from-blue-500 to-cyan-500", role: "top-contributor", engagementMode: "discussing", focusAligned: true, messageCount: 24, reactionCount: 18, lastActive: "now", streak: 12 },
    { name: "SarahFX", initials: "SF", color: "from-pink-500 to-rose-500", role: "moderator", engagementMode: "asking", focusAligned: true, messageCount: 15, reactionCount: 32, lastActive: "1m", streak: 8 },
    { name: "GoldTrader", initials: "GT", color: "from-yellow-500 to-amber-500", role: "top-contributor", engagementMode: "sharing-levels", focusAligned: true, messageCount: 19, reactionCount: 11, lastActive: "now" },
    { name: "ProScalper", initials: "PS", color: "from-emerald-500 to-teal-500", role: "subscriber", engagementMode: "reacting", focusAligned: false, messageCount: 7, reactionCount: 45, lastActive: "2m", streak: 22 },
    { name: "AlgoAlex", initials: "AA", color: "from-indigo-500 to-violet-500", role: "subscriber", engagementMode: "watching", focusAligned: true, messageCount: 3, reactionCount: 8, lastActive: "5m" },
    { name: "FlowReader", initials: "FR", color: "from-violet-500 to-purple-500", role: "subscriber", engagementMode: "discussing", focusAligned: true, messageCount: 11, reactionCount: 14, lastActive: "now" },
    { name: "SwingKing", initials: "SK", color: "from-orange-500 to-red-500", role: "member", engagementMode: "reacting", focusAligned: false, messageCount: 2, reactionCount: 27, lastActive: "3m" },
    { name: "NoviceFX", initials: "NF", color: "from-teal-500 to-green-500", role: "member", engagementMode: "asking", focusAligned: true, messageCount: 6, reactionCount: 4, lastActive: "1m" },
  ],
  activityBreakdown: {
    watching: 412,
    discussing: 142,
    reacting: 189,
    asking: 34,
    sharingLevels: 70,
  },
  roomSentiment: {
    bullish: 58,
    bearish: 12,
    cautious: 22,
    neutral: 8,
  },
  sessionPeak: 203,
  avgSessionTime: "47m",
  pulseHistory: [32, 45, 61, 78, 92, 105, 98, 112, 125, 138, 142, 139],
}

// ── Discussion Rooms ──

interface DiscussionRoom {
  id: string
  name: string
  icon: typeof MessageSquare
  color: string
  accent: string
  description: string
  messageCount: number
  activeUsers: number
  isLive: boolean
  lastMessage?: string
  lastMessageUser?: string
}

const DISCUSSION_ROOMS: DiscussionRoom[] = [
  {
    id: "main", name: "Main Stage", icon: Radio, color: "239,68,68", accent: "248,113,113",
    description: "Live commentary from Mentor Alex and the audience",
    messageCount: 142, activeUsers: 89, isLive: true,
    lastMessage: "Entry is live at 2034.20", lastMessageUser: "Mentor Alex",
  },
  {
    id: "questions", name: "Q&A", icon: MessageSquare, color: "56,189,248", accent: "125,211,252",
    description: "Ask questions directly to the mentor",
    messageCount: 28, activeUsers: 34, isLive: true,
    lastMessage: "Is 1.0870 still the invalidation?", lastMessageUser: "SarahFX",
  },
  {
    id: "setups", name: "Trade Setups", icon: Target, color: "16,185,129", accent: "52,211,153",
    description: "Share and discuss trade ideas and setups",
    messageCount: 56, activeUsers: 42, isLive: true,
    lastMessage: "XAU sweep zone hit, entry triggered", lastMessageUser: "GoldTrader",
  },
  {
    id: "flow", name: "Order Flow", icon: Activity, color: "245,158,11", accent: "251,191,36",
    description: "Real-time order flow analysis and alerts",
    messageCount: 71, activeUsers: 27, isLive: false,
    lastMessage: "Delta spike on 5m candle", lastMessageUser: "ProScalper",
  },
]

const STAGE_TOOLS = [
  {
    id: "oracle", icon: Sparkles, label: "Oracle Summary", color: "emerald",
    desc: "AI-powered live session recap",
    features: ["Live transcription", "Key moments", "Auto-highlights", "Pattern scoring"],
    hotkey: "O", stats: { uses: "2.4K", rating: "4.9" },
  },
  {
    id: "forecasts", icon: BarChart3, label: "Forecasts", color: "sky",
    desc: "Prediction timeline & accuracy",
    features: ["Win/loss tracking", "Confidence levels", "History view", "Accuracy map"],
    hotkey: "F", stats: { uses: "1.8K", rating: "4.7" },
  },
  {
    id: "compare", icon: Target, label: "Compare Plan", color: "violet",
    desc: "Align with your own thesis",
    features: ["Side-by-side view", "Alignment score", "Gap detection", "Divergence alerts"],
    hotkey: "C", stats: { uses: "956", rating: "4.8" },
  },
  {
    id: "flow", icon: Activity, label: "Order Flow", color: "amber",
    desc: "Live institutional flow data",
    features: ["Delta tracking", "Volume profile", "Imbalance alerts", "Footprint view"],
    hotkey: "W", stats: { uses: "3.1K", rating: "4.9" },
  },
]

// ── Utility components ──

function DirectionChip({ direction }: { direction: "bullish" | "bearish" | "neutral" }) {
  if (direction === "bullish") return (
    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wider"
      style={{ background: "rgba(16,185,129,0.18)", color: "rgba(52,211,153,1)", border: "1px solid rgba(16,185,129,0.25)" }}>
      <TrendingUp className="w-2 h-2" /> BULL
    </span>
  )
  if (direction === "bearish") return (
    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wider"
      style={{ background: "rgba(239,68,68,0.18)", color: "rgba(248,113,113,1)", border: "1px solid rgba(239,68,68,0.25)" }}>
      <TrendingDown className="w-2 h-2" /> BEAR
    </span>
  )
  return (
    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wider"
      style={{ background: "rgba(148,163,184,0.12)", color: "rgba(148,163,184,0.85)", border: "1px solid rgba(148,163,184,0.18)" }}>
      RANGE
    </span>
  )
}

const FOCUS_COLORS: Record<string, { primary: string; accent: string }> = {
  thesis: { primary: "16,185,129", accent: "52,211,153" },
  watch: { primary: "56,189,248", accent: "125,211,252" },
  risk: { primary: "245,158,11", accent: "251,191,36" },
  behavior: { primary: "139,92,246", accent: "167,139,250" },
}

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  thesis: <Target className="w-4 h-4" />,
  watch: <Eye className="w-4 h-4" />,
  risk: <AlertTriangle className="w-4 h-4" />,
  behavior: <Activity className="w-4 h-4" />,
}

function ModeBadge({ mode }: { mode: typeof SESSION.mode }) {
  const config = {
    observation: { label: "OBSERVE", color: "rgba(148,163,184,0.95)", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.2)" },
    setup: { label: "SETUP", color: "rgba(56,189,248,1)", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.25)" },
    execution: { label: "EXECUTING", color: "rgba(16,185,129,1)", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
    review: { label: "REVIEW", color: "rgba(168,85,247,0.95)", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)" },
  }
  const c = config[mode]
  return (
    <span className="relative flex items-center gap-1 px-2 py-[3px] rounded-md text-[8px] font-bold uppercase tracking-[0.1em]"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.color }} />
      {c.label}
    </span>
  )
}

function AudioWaveform() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[0.6, 1, 0.7, 0.9, 0.5, 0.8, 0.4].map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: "rgba(239,68,68,0.7)" }}
          animate={{ height: [`${h * 12}px`, `${h * 4}px`, `${h * 12}px`] }}
          transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  )
}

function AnimatedStat({ value, suffix = "", prefix = "" }: { value: number | string, suffix?: string, prefix?: string }) {
  return (
    <span className="tabular-nums font-mono font-bold">
      {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
    </span>
  )
}

// ── Live Screen Share ──
function ScreenShareView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animFrame: number
    let t = 0

    const priceData: number[] = []
    let price = 2030
    for (let i = 0; i < 120; i++) {
      price += (Math.random() - 0.48) * 2.5
      priceData.push(price)
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = "rgba(255,255,255,0.03)"
      ctx.lineWidth = 0.5
      for (let y = 0; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }

      const visiblePoints = Math.min(priceData.length, Math.floor(t / 2) + 10)
      const minP = Math.min(...priceData.slice(0, visiblePoints)) - 3
      const maxP = Math.max(...priceData.slice(0, visiblePoints)) + 3
      const range = maxP - minP || 1

      const levels = [2028, 2032, 2035, 2038, 2042]
      levels.forEach(lvl => {
        const ly = h - 25 - ((lvl - minP) / range) * (h - 50)
        if (ly > 10 && ly < h - 30) {
          ctx.setLineDash([2, 6]); ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(20, ly); ctx.lineTo(w - 10, ly); ctx.stroke(); ctx.setLineDash([])
          ctx.font = "7px monospace"; ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.textAlign = "right"
          ctx.fillText(lvl.toFixed(2), w - 12, ly + 3); ctx.textAlign = "left"
        }
      })

      ctx.beginPath(); ctx.strokeStyle = "rgba(16,185,129,0.85)"; ctx.lineWidth = 2
      ctx.shadowColor = "rgba(16,185,129,0.5)"; ctx.shadowBlur = 12
      for (let i = 0; i < visiblePoints; i++) {
        const x = (i / 119) * (w - 50) + 25
        const y = h - 25 - ((priceData[i] - minP) / range) * (h - 50)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke(); ctx.shadowBlur = 0

      if (visiblePoints > 1) {
        const lastX = ((visiblePoints - 1) / 119) * (w - 50) + 25
        ctx.lineTo(lastX, h - 25); ctx.lineTo(25, h - 25); ctx.closePath()
        const gradient = ctx.createLinearGradient(0, 0, 0, h)
        gradient.addColorStop(0, "rgba(16,185,129,0.15)"); gradient.addColorStop(0.5, "rgba(16,185,129,0.05)"); gradient.addColorStop(1, "rgba(16,185,129,0.0)")
        ctx.fillStyle = gradient; ctx.fill()
      }

      if (visiblePoints > 0) {
        const lastIdx = visiblePoints - 1
        const cx = (lastIdx / 119) * (w - 50) + 25
        const cy = h - 25 - ((priceData[lastIdx] - minP) / range) * (h - 50)
        const pulseR = 5 + Math.sin(t * 0.08) * 3
        ctx.beginPath(); ctx.arc(cx, cy, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(16,185,129,${0.2 + Math.sin(t * 0.08) * 0.15})`; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(52,211,153,1)"; ctx.shadowColor = "rgba(16,185,129,0.6)"; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0
        const priceLabel = priceData[lastIdx].toFixed(2)
        ctx.font = "bold 10px monospace"; ctx.fillStyle = "rgba(52,211,153,1)"; ctx.fillText(priceLabel, cx + 12, cy + 4)
        const boxW = 58
        ctx.fillStyle = "rgba(16,185,129,0.2)"; ctx.fillRect(w - boxW - 4, cy - 9, boxW, 18)
        ctx.strokeStyle = "rgba(16,185,129,0.4)"; ctx.lineWidth = 1; ctx.strokeRect(w - boxW - 4, cy - 9, boxW, 18)
        ctx.fillStyle = "rgba(52,211,153,1)"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"
        ctx.fillText(priceLabel, w - boxW / 2 - 4, cy + 4); ctx.textAlign = "left"
        ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(16,185,129,0.15)"; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(cx + 6, cy); ctx.lineTo(w - boxW - 6, cy); ctx.stroke(); ctx.setLineDash([])
      }

      for (let i = 1; i < visiblePoints; i++) {
        const x = (i / 119) * (w - 50) + 25
        const vol = Math.abs(priceData[i] - priceData[i - 1]) * 18
        const barH = Math.min(vol, 16)
        const isUp = priceData[i] > priceData[i - 1]
        ctx.fillStyle = isUp ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)"
        ctx.fillRect(x - 1, h - 8 - barH, 2.5, barH)
      }

      const sweepY = h - 25 - ((2035 - minP) / range) * (h - 50)
      if (sweepY > 15 && sweepY < h - 35) {
        ctx.fillStyle = "rgba(245,158,11,0.08)"; ctx.fillRect(0, sweepY - 12, w, 24)
        ctx.strokeStyle = "rgba(245,158,11,0.35)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5])
        ctx.beginPath(); ctx.moveTo(0, sweepY); ctx.lineTo(w, sweepY); ctx.stroke(); ctx.setLineDash([])
        ctx.font = "bold 8px monospace"; ctx.fillStyle = "rgba(245,158,11,0.85)"
        ctx.fillText("SWEEP ZONE 2035.00", w - 140, sweepY - 5)
      }

      const entryTop = h - 25 - ((2035.8 - minP) / range) * (h - 50)
      const entryBot = h - 25 - ((2033.5 - minP) / range) * (h - 50)
      if (entryTop > 10 && entryBot < h - 20) {
        ctx.fillStyle = "rgba(16,185,129,0.05)"; ctx.fillRect(w * 0.65, entryTop, w * 0.3, entryBot - entryTop)
        ctx.strokeStyle = "rgba(16,185,129,0.15)"; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3])
        ctx.strokeRect(w * 0.65, entryTop, w * 0.3, entryBot - entryTop); ctx.setLineDash([])
        ctx.font = "bold 7px monospace"; ctx.fillStyle = "rgba(52,211,153,0.6)"; ctx.fillText("ENTRY ZONE", w * 0.68, entryTop + 10)
      }

      if (t % 6 === 0 && priceData.length < 250) {
        const last = priceData[priceData.length - 1]
        priceData.push(last + (Math.random() - 0.48) * 2.2)
      }

      t++
      animFrame = requestAnimationFrame(draw)
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2; canvas.height = rect.height * 2; ctx.scale(2, 2)
    }

    resizeCanvas(); draw()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE_PREMIUM }}
      className="relative mx-4 mt-1 rounded-xl overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.65) 100%)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
      <div className="flex items-center justify-between px-3 py-1.5"
        style={{ background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Monitor className="w-3 h-3 text-emerald-400/80" />
          <span className="text-[8px] font-semibold text-white/60 uppercase tracking-wider">Screen Share</span>
          <span className="text-[7px] px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold uppercase">Live</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] text-slate-400/60 font-mono">XAU/USD 15m</span>
          <div className="w-px h-3 bg-white/[0.08]" />
          <motion.button whileTap={{ scale: 0.9 }} className="p-1 rounded hover:bg-white/[0.06] transition-colors">
            <Maximize2 className="w-2.5 h-2.5 text-slate-400/60" />
          </motion.button>
        </div>
      </div>
      <div className="relative" style={{ height: "420px" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Instrument badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-white/90"
            style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(16,185,129,0.35)", backdropFilter: "blur(12px)" }}>XAU/USD</span>
          <span className="text-[8px] font-mono text-emerald-300 font-bold" style={{ background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: "6px" }}>+0.42%</span>
          <span className="text-[7px] font-mono text-slate-300/60 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.5)" }}>H: 2038.40</span>
          <span className="text-[7px] font-mono text-slate-300/60 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.5)" }}>L: 2029.10</span>
        </div>

        {/* Timeframe selector */}
        <div className="absolute top-3 right-3 flex items-center gap-0.5 p-0.5 rounded-lg z-10"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
          {["1m", "5m", "15m", "1H", "4H"].map((tf, i) => (
            <span key={tf} className={`text-[7px] px-2 py-1 rounded font-mono cursor-pointer transition-all duration-150 ${i === 2 ? "bg-white/[0.15] text-white/90 font-bold" : "text-slate-400/55 hover:text-white/60 hover:bg-white/[0.05]"}`}>{tf}</span>
          ))}
        </div>

        {/* Chart type tabs */}
        <div className="absolute top-12 left-3 flex items-center gap-0.5 p-0.5 rounded-lg z-10"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
          {[
            { label: "Candles", active: true },
            { label: "Line", active: false },
            { label: "Heikin", active: false },
          ].map(ct => (
            <span key={ct.label} className={`text-[7px] px-2 py-1 rounded font-mono cursor-pointer transition-all duration-150 ${ct.active ? "bg-white/[0.12] text-white/80 font-bold" : "text-slate-400/45 hover:text-white/50"}`}>{ct.label}</span>
          ))}
        </div>

        {/* Indicator labels along right side */}
        <div className="absolute top-12 right-3 flex flex-col gap-1 z-10">
          {[
            { label: "EMA 9", color: "rgba(56,189,248,0.75)" },
            { label: "EMA 21", color: "rgba(245,158,11,0.75)" },
            { label: "VWAP", color: "rgba(139,92,246,0.7)" },
          ].map(ind => (
            <div key={ind.label} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
              <div className="w-2 h-[1.5px] rounded-full" style={{ background: ind.color }} />
              <span className="text-[6px] font-mono" style={{ color: ind.color }}>{ind.label}</span>
            </div>
          ))}
        </div>

        {/* Mentor cursor */}
        <motion.div className="absolute flex items-center gap-1.5 z-10" style={{ top: "35%", right: "25%" }}
          animate={{ y: [-2, 4, -2], opacity: [0.6, 0.95, 0.6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <div className="relative">
            <Crosshair className="w-5 h-5 text-amber-400/70" />
            <motion.div className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0px rgba(245,158,11,0)", "0 0 0 8px rgba(245,158,11,0.08)", "0 0 0 0px rgba(245,158,11,0)"] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <span className="text-[8px] text-amber-300/80 font-medium px-2 py-0.5 rounded-md"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(245,158,11,0.2)", backdropFilter: "blur(8px)" }}>Mentor focus</span>
        </motion.div>

        {/* Mentor webcam corner */}
        <div className="absolute bottom-14 right-3 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative w-[72px] h-[72px] rounded-xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.9))", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white"
                style={{ boxShadow: "0 0 16px rgba(16,185,129,0.3)" }}>
                A
              </div>
            </div>
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
            <div className="absolute bottom-1.5 left-0 right-0 text-center">
              <span className="text-[6px] font-bold text-white/80 bg-black/60 px-1.5 py-0.5 rounded">Mentor Alex</span>
            </div>
            {/* Speaking ring */}
            <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{ boxShadow: ["inset 0 0 0 1px rgba(16,185,129,0.2)", "inset 0 0 0 2px rgba(16,185,129,0.4)", "inset 0 0 0 1px rgba(16,185,129,0.2)"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          </motion.div>
        </div>

        {/* Bottom indicators bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: "48px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
          <div className="flex h-full">
            {/* RSI mini */}
            <div className="flex-1 relative px-3 py-1" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[6px] font-mono text-slate-400/55 absolute top-1 left-3">RSI(14)</span>
              <span className="text-[7px] font-mono text-amber-400/80 absolute top-1 right-3">58.4</span>
              <div className="absolute bottom-2 left-3 right-3 h-[14px] flex items-end gap-[1px]">
                {[42, 45, 48, 52, 55, 50, 53, 58, 61, 55, 52, 56, 58, 54, 57, 60, 58, 55, 57, 58].map((v, i) => (
                  <div key={i} className="flex-1 rounded-t-[0.5px]"
                    style={{ height: `${(v / 70) * 14}px`, background: v > 55 ? "rgba(16,185,129,0.5)" : v < 45 ? "rgba(239,68,68,0.5)" : "rgba(148,163,184,0.25)" }} />
                ))}
              </div>
            </div>
            {/* MACD mini */}
            <div className="flex-1 relative px-3 py-1">
              <span className="text-[6px] font-mono text-slate-400/55 absolute top-1 left-3">MACD</span>
              <span className="text-[7px] font-mono text-emerald-400/80 absolute top-1 right-3">+0.12</span>
              <div className="absolute bottom-2 left-3 right-3 h-[14px] flex items-center">
                <div className="w-full flex items-end justify-around gap-[1px]" style={{ height: "14px" }}>
                  {[-3, -1, 2, 4, 3, 1, -1, 2, 5, 6, 4, 2, 3, 5, 4, 3, 1, 2, 3, 4].map((v, i) => (
                    <div key={i} className="flex-1 rounded-[0.5px]"
                      style={{
                        height: `${Math.abs(v) * 1.8}px`,
                        background: v > 0 ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.5)",
                        marginTop: v > 0 ? "auto" : undefined,
                        marginBottom: v <= 0 ? "auto" : undefined,
                      }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market data strip */}
        <div className="absolute left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg z-10"
          style={{ bottom: "56px", background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
          <span className="text-[7px] text-slate-300/70"><span className="text-emerald-400/90 font-bold">Vol</span> 12.4K</span>
          <div className="w-px h-2.5 bg-white/[0.1]" />
          <span className="text-[7px] text-slate-300/70"><span className="text-sky-400/90 font-bold">OI</span> +2.1K</span>
          <div className="w-px h-2.5 bg-white/[0.1]" />
          <span className="text-[7px] text-slate-300/70"><span className="text-amber-400/90 font-bold">Delta</span> +340</span>
          <div className="w-px h-2.5 bg-white/[0.1]" />
          <span className="text-[7px] text-slate-300/70"><span className="text-violet-400/90 font-bold">Spread</span> 0.3</span>
        </div>

        {/* Recording indicator */}
        <div className="absolute right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg z-10"
          style={{ bottom: "56px", background: "rgba(0,0,0,0.65)", border: "1px solid rgba(239,68,68,0.15)", backdropFilter: "blur(12px)" }}>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-red-500" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-[7px] font-bold text-red-400/90 uppercase tracking-wider">Recording</span>
        </div>

        {/* Scanning line */}
        <motion.div className="absolute left-0 w-full h-px pointer-events-none z-[5]"
          animate={{ top: ["10%", "70%", "10%"] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.12), rgba(16,185,129,0.05), transparent)" }} />
      </div>
    </motion.div>
  )
}


// ═══════════════════════════════════════════════���══════════════════
// ROOM INTELLIGENCE — 2x2 premium dashboard grid, always visible
// ══════════════════════════════════════════════════════════════════

function IntelligenceGrid({ blocks }: { blocks: StageFocusBlock[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {blocks.map((block, idx) => {
        const c = FOCUS_COLORS[block.type]
        const isHovered = hoveredId === block.id
        const isCopied = copiedId === block.id

        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.06, ease: EASE_PREMIUM }}
            onMouseEnter={() => setHoveredId(block.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative rounded-xl overflow-hidden cursor-default"
            style={{
              background: isHovered
                ? `linear-gradient(160deg, rgba(${c.primary},0.12) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.32) 100%)`
                : `linear-gradient(160deg, rgba(${c.primary},0.06) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.32) 100%)`,
              border: `1px solid rgba(${c.primary},${isHovered ? "0.3" : "0.12"})`,
              boxShadow: isHovered
                ? `0 4px 20px rgba(0,0,0,0.25), 0 0 20px rgba(${c.primary},0.08), inset 0 1px 0 rgba(255,255,255,0.04)`
                : `0 2px 8px rgba(0,0,0,0.15)`,
              transform: isHovered ? "translateY(-1px)" : "translateY(0)",
              transition: "all 0.25s cubic-bezier(0.22, 0.68, 0.36, 1)",
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{
                background: `linear-gradient(90deg, transparent 5%, rgba(${c.primary},${isHovered ? "0.7" : "0.3"}) 50%, transparent 95%)`,
                transition: "all 0.3s",
              }} />

            {/* Left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{
                background: `linear-gradient(180deg, rgba(${c.accent},${isHovered ? "0.9" : "0.6"}), rgba(${c.primary},0.15))`,
                boxShadow: isHovered ? `0 0 8px rgba(${c.primary},0.2)` : "none",
                transition: "all 0.3s",
              }} />

            {/* Hover glow */}
            <div className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: isHovered
                  ? `radial-gradient(ellipse 80% 60% at 30% 20%, rgba(${c.primary},0.1), transparent 65%)`
                  : "none",
                transition: "all 0.35s",
              }} />

            <div className="px-3 py-3 relative z-10">
              {/* Header: icon + title + urgency */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, rgba(${c.primary},${isHovered ? "0.3" : "0.2"}), rgba(${c.primary},0.08))`,
                    border: `1px solid rgba(${c.primary},${isHovered ? "0.3" : "0.18"})`,
                    color: `rgba(${c.accent},${isHovered ? "1" : "0.85"})`,
                    boxShadow: isHovered ? `0 0 12px rgba(${c.primary},0.15)` : "none",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}>
                  {FOCUS_ICONS[block.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold transition-colors duration-200 truncate"
                    style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)" }}>
                    {block.title}
                  </h4>
                </div>
                <span className="text-[6px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded flex-shrink-0"
                  style={{
                    background: block.urgency === "high" ? `rgba(${c.primary},0.18)` : block.urgency === "medium" ? "rgba(245,158,11,0.15)" : "rgba(148,163,184,0.1)",
                    color: block.urgency === "high" ? `rgba(${c.accent},0.95)` : block.urgency === "medium" ? "rgba(251,191,36,0.9)" : "rgba(148,163,184,0.65)",
                    border: `1px solid ${block.urgency === "high" ? `rgba(${c.primary},0.22)` : block.urgency === "medium" ? "rgba(245,158,11,0.18)" : "rgba(148,163,184,0.12)"}`,
                  }}>
                  {block.urgency.toUpperCase()}
                </span>
              </div>

              {/* Content preview */}
              <p className="text-[8px] leading-[1.65] mb-2 transition-colors duration-200"
                style={{
                  color: isHovered ? "rgba(148,163,184,0.8)" : "rgba(148,163,184,0.6)",
                  display: "-webkit-box",
                  WebkitLineClamp: isHovered ? 4 : 2,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                }}>
                {block.content}
              </p>

              {/* Data grid — key values always visible */}
              {block.details && (
                <div className="space-y-1">
                  {block.details.slice(0, isHovered ? 4 : 2).map((detail, di) => (
                    <div key={detail.label}
                      className="flex items-center justify-between px-2 py-1 rounded-md transition-all duration-200"
                      style={{
                        background: `rgba(${c.primary},${isHovered ? "0.08" : "0.04"})`,
                        border: `1px solid rgba(${c.primary},${isHovered ? "0.12" : "0.06"})`,
                        opacity: di >= 2 ? (isHovered ? 1 : 0) : 1,
                        transform: di >= 2 ? (isHovered ? "translateY(0)" : "translateY(-4px)") : "none",
                        transition: `all 0.25s ${di * 0.04}s`,
                      }}>
                      <span className="text-[6px] text-slate-400/60 uppercase tracking-[0.08em]">{detail.label}</span>
                      <span className="text-[8px] font-mono font-bold" style={{ color: `rgba(${c.accent},${isHovered ? "0.95" : "0.8"})` }}>{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action button — visible on hover */}
              {block.actionLabel && (
                <div className="mt-2 transition-all duration-200"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(4px)",
                    transition: "all 0.25s 0.1s",
                  }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); handleCopy(block.id) }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[7px] font-bold uppercase tracking-wider transition-all duration-150"
                    style={{
                      background: isCopied ? `rgba(${c.primary},0.22)` : `rgba(${c.primary},0.1)`,
                      color: `rgba(${c.accent},0.9)`,
                      border: `1px solid rgba(${c.primary},${isCopied ? "0.3" : "0.15"})`,
                    }}>
                    {isCopied ? <><Check className="w-2.5 h-2.5" /> Done</> : <><Copy className="w-2.5 h-2.5" /> {block.actionLabel}</>}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════
// STAGE TOOLS — premium command board with hover intelligence
// ══════════════════════════════════════════════════════════════════

const QUICK_ACTIONS = [
  { id: "transcript", icon: Scan, label: "Live Transcript", color: "56,189,248" },
  { id: "moments", icon: Zap, label: "Key Moments", color: "245,158,11" },
  { id: "notes", icon: Layers, label: "Session Notes", color: "139,92,246" },
  { id: "charts", icon: LineChart, label: "Related Charts", color: "16,185,129" },
  { id: "recap", icon: Cpu, label: "Room Recap", color: "248,113,113" },
  { id: "share", icon: Share2, label: "Share Room", color: "148,163,184" },
]

function StageToolsBoard({ tools }: { tools: typeof STAGE_TOOLS }) {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)
  const [activatedTool, setActivatedTool] = useState<string | null>(null)

  const colorMap: Record<string, { r: string; g: string }> = {
    emerald: { r: "16,185,129", g: "52,211,153" },
    sky: { r: "56,189,248", g: "125,211,252" },
    violet: { r: "139,92,246", g: "167,139,250" },
    amber: { r: "245,158,11", g: "251,191,36" },
  }

  const handleActivate = (id: string) => {
    setActivatedTool(id)
    setTimeout(() => setActivatedTool(null), 1500)
  }

  return (
    <div className="space-y-3">
      {/* Primary tools — 2x2 centered command cards */}
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool, idx) => {
          const c = colorMap[tool.color] || colorMap.emerald
          const isHovered = hoveredTool === tool.id
          const isActivated = activatedTool === tool.id

          return (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + idx * 0.05, ease: EASE_PREMIUM }}
              whileTap={{ scale: 0.96 }}
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              onClick={() => handleActivate(tool.id)}
              className="relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: isActivated
                  ? `linear-gradient(160deg, rgba(${c.r},0.18) 0%, rgba(${c.r},0.06) 50%, rgba(0,0,0,0.25) 100%)`
                  : `linear-gradient(160deg, rgba(${c.r},0.06) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.3) 100%)`,
                border: `1px solid rgba(${c.r},${isHovered ? "0.3" : isActivated ? "0.35" : "0.12"})`,
                boxShadow: isHovered
                  ? `0 4px 20px rgba(0,0,0,0.25), 0 0 20px rgba(${c.r},0.1), inset 0 1px 0 rgba(255,255,255,0.04)`
                  : isActivated
                  ? `0 0 30px rgba(${c.r},0.18), inset 0 1px 0 rgba(${c.r},0.15)`
                  : `0 2px 8px rgba(0,0,0,0.12)`,
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.25s cubic-bezier(0.22, 0.68, 0.36, 1)",
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{
                  background: `linear-gradient(90deg, transparent 10%, rgba(${c.r},${isHovered ? "0.75" : "0.35"}) 50%, transparent 90%)`,
                  transition: "all 0.3s",
                }} />

              {/* Activated flash */}
              <AnimatePresence>
                {isActivated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{ background: `radial-gradient(ellipse 100% 80% at 50% 40%, rgba(${c.r},0.18), transparent 70%)` }}
                  />
                )}
              </AnimatePresence>

              {/* Hover glow */}
              <div className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: isHovered
                    ? `radial-gradient(ellipse 90% 70% at 50% 50%, rgba(${c.r},0.12), transparent 65%)`
                    : "none",
                  transition: "all 0.35s",
                }} />

              {/* Centered content */}
              <div className="relative z-10 flex flex-col items-center justify-center py-5 px-3 text-center">
                <div className="relative mb-2.5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 mx-auto"
                    style={{
                      background: `linear-gradient(135deg, rgba(${c.r},${isHovered ? "0.3" : "0.18"}), rgba(${c.r},0.06))`,
                      border: `1px solid rgba(${c.r},${isHovered ? "0.3" : "0.18"})`,
                      color: `rgba(${c.g},${isHovered ? "1" : "0.8"})`,
                      boxShadow: isHovered ? `0 0 20px rgba(${c.r},0.2)` : `0 0 8px rgba(${c.r},0.06)`,
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                    }}>
                    {isActivated ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <tool.icon className="w-5 h-5" />
                    )}
                  </div>
                  {isHovered && (
                    <motion.div className="absolute -inset-2 rounded-2xl pointer-events-none"
                      animate={{ boxShadow: [`0 0 0 1px rgba(${c.r},0.12)`, `0 0 0 3px rgba(${c.r},0.06)`, `0 0 0 1px rgba(${c.r},0.12)`] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                  )}
                </div>
                <h5 className="text-[11px] font-bold mb-0.5 transition-colors duration-200"
                  style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)" }}>
                  {isActivated ? "Launching..." : tool.label}
                </h5>
                <p className="text-[8px] leading-relaxed transition-colors duration-200"
                  style={{ color: isHovered ? "rgba(148,163,184,0.75)" : "rgba(148,163,184,0.5)" }}>
                  {tool.desc}
                </p>
                <span className="mt-2 text-[6px] font-mono px-1.5 py-0.5 rounded transition-all duration-200"
                  style={{
                    background: `rgba(${c.r},${isHovered ? "0.15" : "0.08"})`,
                    color: `rgba(${c.g},${isHovered ? "0.8" : "0.45"})`,
                    border: `1px solid rgba(${c.r},${isHovered ? "0.2" : "0.1"})`,
                  }}>
                  {tool.hotkey}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Quick actions — single row of 6 interactive dots/pills */}
      <div className="flex items-center gap-1.5 px-0.5">
        {QUICK_ACTIONS.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 + idx * 0.03, ease: EASE_PREMIUM }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -1 }}
            className="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg group cursor-pointer transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = `rgba(${action.color},0.08)`
              el.style.borderColor = `rgba(${action.color},0.2)`
              el.style.boxShadow = `0 0 12px rgba(${action.color},0.08)`
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = "rgba(255,255,255,0.015)"
              el.style.borderColor = "rgba(255,255,255,0.04)"
              el.style.boxShadow = "none"
            }}
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{
                background: `rgba(${action.color},0.12)`,
                border: `1px solid rgba(${action.color},0.12)`,
              }}>
              <action.icon className="w-3 h-3 transition-colors duration-200"
                style={{ color: `rgba(${action.color},0.65)` }}
                onMouseEnter={(e) => { (e.currentTarget as SVGElement).style.color = `rgba(${action.color},0.95)` }}
                onMouseLeave={(e) => { (e.currentTarget as SVGElement).style.color = `rgba(${action.color},0.65)` }}
              />
            </div>
            <span className="text-[6.5px] font-medium text-slate-400/55 group-hover:text-slate-300/75 transition-colors duration-200 text-center leading-tight whitespace-nowrap">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}


// ���═════════════════════════════════════════════════════════════════
// DISCUSSION FEED — premium live-room participation system
// ══════════════════════════════════════════════════════════════════

const EMOJI_MAP: Record<string, string> = {
  fire: "\u{1F525}", rocket: "\u{1F680}", eyes: "\u{1F440}", brain: "\u{1F9E0}",
  thumbsUp: "\u{1F44D}", target: "\u{1F3AF}", check: "\u2705", question: "\u2753",
}

const REACTION_COLOR_MAP: Record<string, string> = {
  fire:     "239,68,68",
  rocket:   "139,92,246",
  eyes:     "56,189,248",
  brain:    "167,139,250",
  thumbsUp: "16,185,129",
  target:   "56,189,248",
  check:    "16,185,129",
  question: "245,158,11",
}

function RoleBadge({ role }: { role?: string }) {
  if (role === "mentor") return (
    <span className="text-[6px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded"
      style={{ background: "rgba(16,185,129,0.2)", color: "rgba(52,211,153,1)", border: "1px solid rgba(16,185,129,0.25)" }}>
      Mentor
    </span>
  )
  if (role === "moderator") return (
    <span className="text-[6px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded"
      style={{ background: "rgba(56,189,248,0.15)", color: "rgba(125,211,252,0.9)", border: "1px solid rgba(56,189,248,0.2)" }}>
      Mod
    </span>
  )
  if (role === "subscriber") return (
    <span className="text-[6px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded"
      style={{ background: "rgba(245,158,11,0.12)", color: "rgba(251,191,36,0.8)", border: "1px solid rgba(245,158,11,0.15)" }}>
      Sub
    </span>
  )
  return null
}

function MessageActions({ messageId }: { messageId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 2 }}
      transition={{ duration: 0.12 }}
      className="absolute -top-3 right-2 flex items-center gap-0.5 px-1 py-0.5 rounded-lg z-20"
      style={{ background: "rgba(15,17,25,0.95)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
    >
      {[
        { icon: Heart, tip: "React" },
        { icon: Reply, tip: "Reply" },
        { icon: Quote, tip: "Quote" },
        { icon: Copy, tip: "Copy" },
        { icon: Sparkles, tip: "Ask Oracle" },
      ].map(action => (
        <motion.button key={action.tip} whileTap={{ scale: 0.85 }}
          className="p-1.5 rounded-md text-slate-400/60 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-100"
          title={action.tip}>
          <action.icon className="w-3 h-3" />
        </motion.button>
      ))}
    </motion.div>
  )
}

function DiscussionFeed({ messages }: { messages: DiscussionMessage[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [reactedMessages, setReactedMessages] = useState<Set<string>>(new Set())

  const toggleReaction = (msgId: string) => {
    setReactedMessages(prev => {
      const next = new Set(prev)
      if (next.has(msgId)) next.delete(msgId); else next.add(msgId)
      return next
    })
  }

  const pinnedMsg = messages.find(m => m.isPinned)
  const feedMessages = messages.filter(m => !m.isPinned)

  return (
    <div className="space-y-0">

      {/* ── Pinned Mentor Insight ── */}
      {pinnedMsg && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          className="mb-3 rounded-xl relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.35) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2), 0 0 20px rgba(16,185,129,0.06)",
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ background: "linear-gradient(180deg, rgba(52,211,153,0.8), rgba(16,185,129,0.25))" }} />

          <div className="px-3.5 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-3 h-3 text-emerald-400/85" />
              <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-400/80">Pinned Insight</span>
              <div className="flex-1" />
              <span className="text-[7px] text-slate-400/50 font-mono">{pinnedMsg.timestamp}</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${pinnedMsg.userColor} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}
                style={{ boxShadow: "0 0 0 2px rgba(16,185,129,0.2), 0 2px 6px rgba(0,0,0,0.3)" }}>
                {pinnedMsg.userAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-emerald-300/95">{pinnedMsg.userName}</span>
                  <RoleBadge role={pinnedMsg.role} />
                  {pinnedMsg.instrument && (
                    <span className="text-[7px] font-mono px-1.5 py-[1px] rounded"
                      style={{ background: "rgba(16,185,129,0.12)", color: "rgba(52,211,153,0.8)", border: "1px solid rgba(16,185,129,0.12)" }}>
                      {pinnedMsg.instrument}
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-200/80 leading-[1.7]">{pinnedMsg.message}</p>

                {pinnedMsg.reactions && (
                  <div className="flex items-center gap-1.5 mt-2.5">
                    {pinnedMsg.reactions.map(r => {
                      const rColor = REACTION_COLOR_MAP[r.emoji] || "148,163,184"
                      const isReacted = reactedMessages.has(pinnedMsg.id)
                      return (
                        <motion.button key={r.emoji} whileTap={{ scale: 0.85 }}
                          onClick={() => toggleReaction(pinnedMsg.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] transition-all duration-150 group/rx"
                          style={{
                            background: isReacted ? `rgba(${rColor},0.12)` : `rgba(${rColor},0.05)`,
                            border: `1px solid rgba(${rColor},${isReacted ? "0.22" : "0.1"})`,
                            boxShadow: r.count >= 20 ? `0 0 8px rgba(${rColor},0.06)` : "none",
                          }}>
                          <span className="text-[10px] transition-transform duration-150 group-hover/rx:scale-110">{EMOJI_MAP[r.emoji] || r.emoji}</span>
                          <span className="font-mono font-bold" style={{ color: `rgba(${rColor},${isReacted ? "0.9" : "0.6"})` }}>{r.count}</span>
                        </motion.button>
                      )
                    })}
                    {/* Total for pinned */}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md ml-1"
                      style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.08)" }}>
                      <Signal className="w-2.5 h-2.5 text-emerald-400/45" />
                      <span className="text-[7px] font-mono font-bold text-emerald-400/60">
                        {pinnedMsg.reactions.reduce((sum, r) => sum + r.count, 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Audience Presence Strip (discussion-scoped) ── */}
      <div className="flex items-center gap-2 mb-3 px-2 py-2 rounded-xl"
        style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.02) 0%, rgba(0,0,0,0.12) 100%)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex -space-x-1.5">
          {AUDIENCE.topParticipants.filter(p => p.engagementMode === "discussing" || p.engagementMode === "asking").slice(0, 4).map((p, i) => (
            <div key={p.name} className="relative">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-[6px] font-bold text-white`}
                style={{ zIndex: 5 - i, boxShadow: "0 0 0 1.5px rgba(10,11,16,0.9)" }}>
                {p.initials}
              </div>
              {p.lastActive === "now" && (
                <div className="absolute -bottom-px -right-px w-1.5 h-1.5 rounded-full bg-emerald-400/90"
                  style={{ border: "1px solid rgba(10,11,16,0.9)" }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0"
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="text-[8px] font-mono font-bold text-emerald-400/70">{AUDIENCE.activityBreakdown.discussing}</span>
            <span className="text-[7px] text-slate-400/50">discussing</span>
          </div>
          <div className="w-px h-3 bg-white/[0.06]" />
          <div className="flex items-center gap-1">
            <HelpCircle className="w-2.5 h-2.5 text-sky-400/50 flex-shrink-0" />
            <span className="text-[8px] font-mono font-bold text-sky-400/60">{AUDIENCE.activityBreakdown.asking}</span>
            <span className="text-[7px] text-slate-400/50">asking</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <PulseSparkline data={AUDIENCE.pulseHistory.slice(-6)} color="52,211,153" />
          <Signal className="w-2.5 h-2.5 text-emerald-400/50" />
        </div>
      </div>

      {/* ── Message Feed ── */}
      <div className="space-y-0.5">
        {feedMessages.map((msg, idx) => {

          // System / join events
          if (msg.type === "system" || msg.type === "join") {
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="flex items-center gap-2 py-1.5 px-2"
              >
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="flex items-center gap-1.5">
                  {msg.type === "join" && <UserPlus className="w-2.5 h-2.5 text-emerald-400/45" />}
                  {msg.type === "system" && <CircleDot className="w-2.5 h-2.5 text-sky-400/45" />}
                  <span className="text-[8px] text-slate-400/50 italic">{msg.message}</span>
                  <span className="text-[7px] text-slate-400/55 font-mono">{msg.timestamp}</span>
                </div>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
              </motion.div>
            )
          }

          const isMentor = msg.role === "mentor"
          const isQuestion = msg.type === "question"
          const isCallout = msg.type === "callout"
          const isHovered = hoveredId === msg.id

          return (
            <motion.div key={msg.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.05 + idx * 0.03 }}
              onMouseEnter={() => setHoveredId(msg.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-lg transition-all duration-150"
              style={{
                padding: isMentor ? "10px 12px" : "6px 10px",
                background: isMentor
                  ? "linear-gradient(160deg, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0.2) 100%)"
                  : isQuestion
                  ? "rgba(56,189,248,0.03)"
                  : isCallout
                  ? "rgba(245,158,11,0.03)"
                  : isHovered
                  ? "rgba(255,255,255,0.015)"
                  : "transparent",
                borderLeft: isMentor
                  ? "2px solid rgba(16,185,129,0.45)"
                  : isQuestion
                  ? "2px solid rgba(56,189,248,0.3)"
                  : isCallout
                  ? "2px solid rgba(245,158,11,0.3)"
                  : "2px solid transparent",
              }}
            >
              {/* Hover actions */}
              <AnimatePresence>
                {isHovered && <MessageActions messageId={msg.id} />}
              </AnimatePresence>

              <div className="flex items-start gap-2.5">
                {/* Avatar */}
                <div className={`bg-gradient-to-br ${msg.userColor} flex items-center justify-center font-bold text-white flex-shrink-0 mt-0.5`}
                  style={{
                    width: isMentor ? "28px" : "22px",
                    height: isMentor ? "28px" : "22px",
                    borderRadius: isMentor ? "8px" : "6px",
                    fontSize: isMentor ? "9px" : "8px",
                    boxShadow: isMentor ? "0 0 0 2px rgba(16,185,129,0.18), 0 2px 6px rgba(0,0,0,0.25)" : "0 1px 3px rgba(0,0,0,0.2)",
                  }}>
                  {msg.userAvatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name row */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`font-semibold ${isMentor ? "text-[10px] text-emerald-300/95" : "text-[9px] text-white/70"}`}>
                      {msg.userName}
                    </span>
                    <RoleBadge role={msg.role} />
                    {isQuestion && (
                      <span className="text-[6px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded"
                        style={{ background: "rgba(56,189,248,0.15)", color: "rgba(125,211,252,0.85)", border: "1px solid rgba(56,189,248,0.15)" }}>
                        Question
                      </span>
                    )}
                    {isCallout && (
                      <span className="text-[6px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded"
                        style={{ background: "rgba(245,158,11,0.15)", color: "rgba(251,191,36,0.85)", border: "1px solid rgba(245,158,11,0.15)" }}>
                        Callout
                      </span>
                    )}
                    {msg.instrument && (
                      <span className="text-[6px] font-mono px-1 py-[1px] rounded text-slate-400/50"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {msg.instrument}
                      </span>
                    )}
                    <span className="text-[7px] text-slate-400/55 font-mono ml-auto flex-shrink-0">{msg.timestamp}</span>
                  </div>

                  {/* Reply reference */}
                  {msg.replyTo && (
                    <div className="flex items-center gap-1 mb-1 text-[7px] text-slate-400/50">
                      <Reply className="w-2.5 h-2.5 rotate-180" />
                      <span>Replying to <span className="text-white/65 font-medium">{msg.replyTo}</span></span>
                    </div>
                  )}

                  {/* Message body */}
                  <p className={`leading-[1.7] ${isMentor ? "text-[10.5px] text-slate-200/80" : "text-[10px] text-slate-300/65"}`}>
                    {msg.message}
                  </p>

                  {/* Reactions — color-coded per type */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {msg.reactions.map(r => {
                        const rColor = REACTION_COLOR_MAP[r.emoji] || "148,163,184"
                        const isReacted = reactedMessages.has(msg.id)
                        const isHigh = r.count >= 30
                        return (
                          <motion.button key={r.emoji} whileTap={{ scale: 0.85 }}
                            onClick={() => toggleReaction(msg.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] transition-all duration-150 group/rx"
                            style={{
                              background: isReacted
                                ? `rgba(${rColor},0.12)`
                                : `rgba(${rColor},0.04)`,
                              border: `1px solid rgba(${rColor},${isReacted ? "0.22" : "0.08"})`,
                              boxShadow: isHigh ? `0 0 6px rgba(${rColor},0.06)` : "none",
                            }}>
                            <span className="text-[9px] transition-transform duration-150 group-hover/rx:scale-110">{EMOJI_MAP[r.emoji] || r.emoji}</span>
                            <span className="font-mono font-bold transition-colors duration-150"
                              style={{ color: `rgba(${rColor},${isReacted ? "0.9" : "0.55"})` }}>
                              {r.count}
                            </span>
                            {isHigh && (
                              <motion.div className="w-1 h-1 rounded-full flex-shrink-0"
                                style={{ background: `rgba(${rColor},0.6)` }}
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </motion.button>
                        )
                      })}
                      {/* Total reaction count for mentor messages */}
                      {isMentor && msg.reactions.reduce((sum, r) => sum + r.count, 0) > 50 && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md ml-0.5"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <Signal className="w-2 h-2 text-slate-400/35" />
                          <span className="text-[6px] font-mono text-slate-400/45 font-bold">
                            {msg.reactions.reduce((sum, r) => sum + r.count, 0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════
// LIVE SESSION TIMELINE COMPONENTS
// ══════════════════════════════════════════════════════════════════

type TimelineFilter = "all" | "mentor" | "trades" | "levels" | "warnings"

const TIMELINE_FILTERS: { key: TimelineFilter; label: string; color: string }[] = [
  { key: "all",      label: "All",       color: "148,163,184" },
  { key: "mentor",   label: "Mentor",    color: "52,211,153" },
  { key: "trades",   label: "Trades",    color: "16,185,129" },
  { key: "levels",   label: "Levels",    color: "239,68,68" },
  { key: "warnings", label: "Warnings",  color: "245,158,11" },
]

function filterEvents(events: SessionEvent[], filter: TimelineFilter): SessionEvent[] {
  switch (filter) {
    case "mentor":   return events.filter(e => e.mentorTriggered)
    case "trades":   return events.filter(e => e.type === "entry" || e.type === "exit")
    case "levels":   return events.filter(e => e.type === "level-call" || e.type === "key-moment")
    case "warnings": return events.filter(e => e.type === "warning")
    default:         return events
  }
}

function SessionPhaseProgressBar({ timeline }: { timeline: SessionTimelineData }) {
  const phases: { phase: SessionPhase; label: string; color: string; icon: typeof Eye }[] = [
    { phase: "observation", label: "Observe",  color: "148,163,184", icon: Eye },
    { phase: "setup",       label: "Setup",    color: "56,189,248",  icon: Crosshair },
    { phase: "execution",   label: "Execute",  color: "16,185,129",  icon: Zap },
    { phase: "review",      label: "Review",   color: "139,92,246",  icon: FileText },
  ]

  const currentIdx = phases.findIndex(p => p.phase === timeline.currentPhase)

  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => {
        const isComplete = i < currentIdx
        const isCurrent = i === currentIdx
        const isFuture = i > currentIdx
        const PhIcon = p.icon

        return (
          <React.Fragment key={p.phase}>
            <div className="flex items-center gap-1 px-1.5 py-1 rounded-md transition-all duration-200"
              style={{
                background: isCurrent
                  ? `rgba(${p.color},0.1)`
                  : isComplete
                  ? `rgba(${p.color},0.04)`
                  : "rgba(255,255,255,0.015)",
                border: `1px solid ${isCurrent ? `rgba(${p.color},0.2)` : isComplete ? `rgba(${p.color},0.08)` : "rgba(255,255,255,0.03)"}`,
                boxShadow: isCurrent ? `0 0 8px rgba(${p.color},0.06)` : "none",
              }}>
              <PhIcon className="w-2 h-2" style={{
                color: isCurrent
                  ? `rgba(${p.color},0.9)`
                  : isComplete
                  ? `rgba(${p.color},0.5)`
                  : "rgba(148,163,184,0.25)",
              }} />
              <span className="text-[6px] font-bold uppercase tracking-wider" style={{
                color: isCurrent
                  ? `rgba(${p.color},0.85)`
                  : isComplete
                  ? `rgba(${p.color},0.45)`
                  : "rgba(148,163,184,0.2)",
              }}>{p.label}</span>
              {isCurrent && (
                <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: `rgba(${p.color},0.8)` }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }} />
              )}
              {isComplete && (
                <Check className="w-2 h-2" style={{ color: `rgba(${p.color},0.45)` }} />
              )}
            </div>
            {i < phases.length - 1 && (
              <div className="w-3 h-px" style={{
                background: isFuture
                  ? "rgba(255,255,255,0.04)"
                  : `rgba(${phases[Math.min(i + 1, phases.length - 1)].color},${isComplete ? "0.2" : "0.1"})`,
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function RunningPnlStrip({ timeline }: { timeline: SessionTimelineData }) {
  const isPositive = timeline.runningPnl.startsWith("+")
  const color = isPositive ? "16,185,129" : "239,68,68"
  const accent = isPositive ? "52,211,153" : "248,113,113"

  return (
    <div className="flex items-center justify-between px-2.5 py-2 rounded-xl"
      style={{
        background: `linear-gradient(135deg, rgba(${color},0.04) 0%, rgba(0,0,0,0.12) 100%)`,
        border: `1px solid rgba(${color},0.1)`,
      }}>
      <div className="flex items-center gap-3">
        {/* Running P&L */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: `rgba(${color},0.1)`, border: `1px solid rgba(${color},0.15)` }}>
            {isPositive
              ? <CircleArrowUp className="w-2.5 h-2.5" style={{ color: `rgba(${accent},0.9)` }} />
              : <CircleArrowDown className="w-2.5 h-2.5" style={{ color: `rgba(${accent},0.9)` }} />
            }
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] text-slate-500/50 uppercase tracking-wider leading-none">Running P&L</span>
            <span className="text-[12px] font-mono font-bold leading-tight" style={{ color: `rgba(${accent},0.95)` }}>
              {timeline.runningPnl}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-white/[0.06]" />

        {/* Trade counters */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold text-emerald-400/75">{timeline.tradesOpen}</span>
            <span className="text-[5px] text-slate-500/45 uppercase tracking-wider">Open</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold text-sky-400/70">{timeline.tradesClosed}</span>
            <span className="text-[5px] text-slate-500/45 uppercase tracking-wider">Closed</span>
          </div>
        </div>
      </div>

      {/* Event count + high-importance */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <Timer className="w-2.5 h-2.5 text-slate-400/45" />
          <span className="text-[8px] font-mono font-bold text-white/55">{timeline.totalEvents}</span>
          <span className="text-[6px] text-slate-500/40">events</span>
        </div>
        {timeline.highImportanceCount > 0 && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <Flame className="w-2.5 h-2.5 text-red-400/60" />
            <span className="text-[8px] font-mono font-bold text-red-400/65">{timeline.highImportanceCount}</span>
            <span className="text-[6px] text-red-400/40">key</span>
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineEventCard({ event, isLatest }: { event: SessionEvent; isLatest: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const conf = SESSION_EVENT_CONFIG[event.type]
  const EventIcon = conf.icon
  const isHighImportance = event.importance >= 4
  const isTrade = event.type === "entry" || event.type === "exit"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
      className="flex gap-2.5 group/evt"
    >
      {/* Time column */}
      <div className="flex flex-col items-center flex-shrink-0 w-10 pt-0.5">
        <span className="text-[7px] font-mono font-bold text-slate-400/55">{event.elapsedAt}</span>
        {/* Connector line */}
        <div className="flex-1 w-px mt-1 mb-0.5"
          style={{ background: isHighImportance ? `rgba(${conf.color},0.15)` : "rgba(255,255,255,0.04)" }} />
      </div>

      {/* Event icon node */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <div className="relative">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 group-hover/evt:scale-105"
            style={{
              background: `rgba(${conf.color},${isHighImportance ? "0.15" : "0.08"})`,
              border: `1px solid rgba(${conf.color},${isHighImportance ? "0.25" : "0.12"})`,
              boxShadow: isHighImportance ? `0 0 10px rgba(${conf.color},0.08)` : "none",
            }}>
            <EventIcon className="w-3 h-3" style={{ color: `rgba(${conf.accent},${isHighImportance ? "0.95" : "0.7"})` }} />
          </div>
          {isLatest && (
            <motion.div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{ background: `rgba(${conf.accent},0.9)`, border: "2px solid rgba(10,11,16,0.95)" }}
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          )}
          {/* Intensity dots */}
          {isHighImportance && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
              {Array.from({ length: event.importance }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 rounded-full"
                  style={{ background: `rgba(${conf.accent},${0.3 + i * 0.15})` }} />
              ))}
            </div>
          )}
        </div>
        {/* Vertical connector below */}
        <div className="flex-1 w-px mt-1.5"
          style={{ background: isHighImportance ? `rgba(${conf.color},0.1)` : "rgba(255,255,255,0.03)" }} />
      </div>

      {/* Event content */}
      <div className="flex-1 min-w-0 pb-3 cursor-default"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}>
        <div className={`px-2.5 py-2 rounded-xl transition-all duration-200 ${isExpanded ? "translate-y-[-1px]" : ""}`}
          style={{
            background: isExpanded
              ? `linear-gradient(135deg, rgba(${conf.color},0.06) 0%, rgba(0,0,0,0.15) 100%)`
              : isHighImportance
              ? `linear-gradient(135deg, rgba(${conf.color},0.03) 0%, rgba(0,0,0,0.1) 100%)`
              : "rgba(255,255,255,0.01)",
            border: `1px solid ${isExpanded ? `rgba(${conf.color},0.15)` : isHighImportance ? `rgba(${conf.color},0.08)` : "rgba(255,255,255,0.03)"}`,
            boxShadow: isExpanded ? `0 4px 16px rgba(0,0,0,0.2), 0 0 8px rgba(${conf.color},0.04)` : "none",
          }}>
          {/* Header row */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[7px] font-bold uppercase tracking-wider"
              style={{ color: `rgba(${conf.accent},0.8)` }}>
              {conf.label}
            </span>
            {event.instrument && (
              <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: event.direction === "bullish" ? "rgba(16,185,129,0.08)"
                    : event.direction === "bearish" ? "rgba(239,68,68,0.08)"
                    : "rgba(148,163,184,0.06)",
                  color: event.direction === "bullish" ? "rgba(52,211,153,0.8)"
                    : event.direction === "bearish" ? "rgba(248,113,113,0.8)"
                    : "rgba(148,163,184,0.6)",
                  border: `1px solid ${event.direction === "bullish" ? "rgba(16,185,129,0.12)" : event.direction === "bearish" ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)"}`,
                }}>
                {event.instrument}
              </span>
            )}
            {event.mentorTriggered && (
              <Crown className="w-2 h-2 text-amber-400/50 flex-shrink-0" />
            )}
            <span className="text-[6px] font-mono text-slate-500/40 ml-auto flex-shrink-0">{event.timestamp}</span>
          </div>

          {/* Description */}
          <p className={`text-[8px] leading-relaxed ${isHighImportance ? "text-white/75 font-medium" : "text-slate-300/65"}`}>
            {event.description}
          </p>

          {/* Bias shift: before -> after */}
          {(event.type === "bias-shift" || event.type === "mode-change") && event.previousValue && event.newValue && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[7px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(148,163,184,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                {event.previousValue}
              </span>
              <ArrowRightLeft className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `rgba(${conf.accent},0.5)` }} />
              <span className="text-[7px] px-1.5 py-0.5 rounded font-mono font-bold"
                style={{ background: `rgba(${conf.color},0.08)`, color: `rgba(${conf.accent},0.8)`, border: `1px solid rgba(${conf.color},0.12)` }}>
                {event.newValue}
              </span>
            </div>
          )}

          {/* P&L for trade events */}
          {isTrade && event.pnl && (
            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-lg"
              style={{
                background: event.pnl.startsWith("+") ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${event.pnl.startsWith("+") ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}`,
              }}>
              <span className="text-[7px] text-slate-400/50 uppercase tracking-wider">P&L</span>
              <span className="text-[10px] font-mono font-bold"
                style={{ color: event.pnl.startsWith("+") ? "rgba(52,211,153,0.95)" : "rgba(248,113,113,0.95)" }}>
                {event.pnl}
              </span>
            </div>
          )}

          {/* Room reaction indicator */}
          {event.roomReaction && event.roomReaction > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Users className="w-2 h-2" style={{ color: `rgba(${conf.accent},0.4)` }} />
              <span className="text-[6px] font-mono" style={{ color: `rgba(${conf.accent},0.5)` }}>
                {event.roomReaction} reacted
              </span>
              {/* Mini reaction bar */}
              <div className="flex-1 h-[2px] rounded-full overflow-hidden ml-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(event.roomReaction * 1.5, 100)}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE_PREMIUM }}
                  className="h-full rounded-full"
                  style={{ background: `rgba(${conf.accent},0.3)` }}
                />
              </div>
            </div>
          )}

          {/* Expandable details */}
          <AnimatePresence>
            {isExpanded && event.details && event.details.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_PREMIUM }}
                className="overflow-hidden"
              >
                <div className="mt-2 pt-2 space-y-1"
                  style={{ borderTop: `1px solid rgba(${conf.color},0.08)` }}>
                  {event.details.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-center justify-between">
                      <span className="text-[6px] text-slate-500/50 uppercase tracking-wider">{d.label}</span>
                      <span className="text-[7px] font-mono font-bold" style={{ color: `rgba(${conf.accent},0.7)` }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function PhaseTransitionMarker({ phase, elapsedAt }: { phase: SessionPhase; elapsedAt: string }) {
  const phaseConf: Record<SessionPhase, { label: string; color: string; icon: typeof Eye }> = {
    observation: { label: "Observation Phase", color: "148,163,184", icon: Eye },
    setup:       { label: "Setup Phase",       color: "56,189,248",  icon: Crosshair },
    execution:   { label: "Execution Phase",   color: "16,185,129",  icon: Zap },
    review:      { label: "Review Phase",      color: "139,92,246",  icon: FileText },
  }
  const pc = phaseConf[phase]
  const PhIcon = pc.icon

  return (
    <div className="flex items-center gap-2 py-1.5 pl-12">
      <div className="flex-1 h-px" style={{ background: `rgba(${pc.color},0.12)` }} />
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
        style={{ background: `rgba(${pc.color},0.06)`, border: `1px solid rgba(${pc.color},0.1)` }}>
        <PhIcon className="w-2 h-2" style={{ color: `rgba(${pc.color},0.7)` }} />
        <span className="text-[6px] font-bold uppercase tracking-wider" style={{ color: `rgba(${pc.color},0.6)` }}>{pc.label}</span>
        <span className="text-[5px] font-mono text-slate-500/35">{elapsedAt}</span>
      </div>
      <div className="flex-1 h-px" style={{ background: `rgba(${pc.color},0.12)` }} />
    </div>
  )
}

function LiveSessionTimeline() {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all")
  const [showAll, setShowAll] = useState(false)

  const filtered = filterEvents(SESSION_TIMELINE.events, activeFilter)
  // Show events newest-first
  const reversed = [...filtered].reverse()
  const displayEvents = showAll ? reversed : reversed.slice(0, 8)
  const hasMore = reversed.length > 8

  // Group events by phase for phase transition markers
  const phaseBreaks = new Set<string>()
  let lastPhase: SessionPhase | null = null
  for (const evt of reversed) {
    if (evt.phase !== lastPhase) {
      phaseBreaks.add(evt.id)
      lastPhase = evt.phase
    }
  }

  return (
    <div className="space-y-2.5">
      {/* Phase progress bar */}
      <SessionPhaseProgressBar timeline={SESSION_TIMELINE} />

      {/* Running P&L strip */}
      <RunningPnlStrip timeline={SESSION_TIMELINE} />

      {/* Filter pills */}
      <div className="flex items-center gap-1">
        {TIMELINE_FILTERS.map(f => {
          const isActive = activeFilter === f.key
          const count = filterEvents(SESSION_TIMELINE.events, f.key).length
          return (
            <motion.button
              key={f.key}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveFilter(f.key)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-wider transition-all duration-150"
              style={{
                background: isActive ? `rgba(${f.color},0.1)` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? `rgba(${f.color},0.18)` : "rgba(255,255,255,0.04)"}`,
                color: isActive ? `rgba(${f.color},0.9)` : "rgba(148,163,184,0.4)",
              }}
            >
              {f.label}
              <span className="font-mono text-[6px]" style={{ opacity: isActive ? 0.7 : 0.4 }}>{count}</span>
            </motion.button>
          )
        })}
      </div>

      {/* "Now" marker */}
      <div className="flex items-center gap-2 pl-10">
        <motion.div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: "rgba(239,68,68,0.8)", boxShadow: "0 0 8px rgba(239,68,68,0.3)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }} />
        <span className="text-[7px] font-bold uppercase tracking-wider text-red-400/70">Now</span>
        <span className="text-[6px] font-mono text-slate-500/40">{SESSION_TIMELINE.lastEventTime}</span>
        <div className="flex-1 h-px bg-red-500/10" />
      </div>

      {/* Event feed */}
      <div>
        {displayEvents.map((event, idx) => {
          const isLatest = idx === 0
          const showPhaseBreak = phaseBreaks.has(event.id) && idx > 0

          return (
            <React.Fragment key={event.id}>
              {showPhaseBreak && (
                <PhaseTransitionMarker phase={event.phase} elapsedAt={event.elapsedAt} />
              )}
              <TimelineEventCard event={event} isLatest={isLatest} />
            </React.Fragment>
          )
        })}
      </div>

      {/* Show more/less */}
      {hasMore && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[7px] font-bold uppercase tracking-wider transition-all duration-150 hover:bg-white/[0.02]"
          style={{ color: "rgba(148,163,184,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Show all {reversed.length} events
            </>
          )}
        </motion.button>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ROOM PULSE / LIVE REACTIONS SYSTEM
// ═══════════════════════════════════════════════════════════���═���════

function MomentumGauge({ value, momentum }: { value: number; momentum: RoomPulseData["currentMomentum"] }) {
  const conf = {
    calm:     { color: "148,163,184", label: "Calm" },
    building: { color: "52,211,153",  label: "Building" },
    surging:  { color: "251,191,36",  label: "Surging" },
    peak:     { color: "239,68,68",   label: "Peak" },
  }[momentum]

  const angle = (value / 100) * 180 - 90 // -90 to 90

  return (
    <div className="relative flex flex-col items-center">
      <svg width="52" height="30" viewBox="0 0 52 30" className="overflow-visible">
        {/* Track */}
        <path d="M 4 28 A 22 22 0 0 1 48 28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" strokeLinecap="round" />
        {/* Filled arc */}
        <path d="M 4 28 A 22 22 0 0 1 48 28" fill="none" stroke={`rgba(${conf.color},0.15)`} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 69} 69`} />
        {/* Glow arc */}
        <path d="M 4 28 A 22 22 0 0 1 48 28" fill="none" stroke={`rgba(${conf.color},0.45)`} strokeWidth="2" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 69} 69`}>
          <animate attributeName="stroke-opacity" values="0.3;0.55;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Needle */}
        <g transform={`rotate(${angle}, 26, 28)`}>
          <line x1="26" y1="28" x2="26" y2="10" stroke={`rgba(${conf.color},0.9)`} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="26" cy="28" r="2.5" fill={`rgba(${conf.color},0.9)`}>
            <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${conf.color},0.9)` }}>{value}</span>
        <span className="text-[6px] font-bold uppercase tracking-wider" style={{ color: `rgba(${conf.color},0.6)` }}>{conf.label}</span>
      </div>
    </div>
  )
}

function FloatingReactionTrail({ moment }: { moment: ReactionMoment }) {
  const conf = ROOM_SIGNAL_CONFIG[moment.signal]
  const SignalIcon = conf.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
      style={{
        background: `linear-gradient(135deg, rgba(${conf.color},0.06) 0%, rgba(0,0,0,0.15) 100%)`,
        border: `1px solid rgba(${conf.color},0.1)`,
      }}
    >
      {/* Signal icon with glow */}
      <div className="relative flex-shrink-0">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{
            background: `rgba(${conf.color},0.12)`,
            border: `1px solid rgba(${conf.color},0.18)`,
            boxShadow: moment.intensity >= 4 ? `0 0 10px rgba(${conf.color},0.12)` : "none",
          }}>
          <SignalIcon className="w-3 h-3" style={{ color: `rgba(${conf.accent},0.9)` }} />
        </div>
        {/* Intensity rings for high-intensity moments */}
        {moment.intensity >= 4 && (
          <motion.div className="absolute inset-0 rounded-lg"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ border: `1px solid rgba(${conf.color},0.3)` }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: `rgba(${conf.accent},0.85)` }}>{conf.label}</span>
          {/* Participant burst dots */}
          <div className="flex items-center gap-px">
            {Array.from({ length: Math.min(moment.intensity, 5) }).map((_, i) => (
              <motion.div key={i}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
                className="w-1 h-1 rounded-full"
                style={{ background: `rgba(${conf.accent},${0.4 + i * 0.12})` }}
              />
            ))}
          </div>
        </div>
        <p className="text-[7px] text-slate-300/55 leading-tight mt-0.5 truncate">{moment.triggeredBy}</p>
      </div>

      {/* Right: count + time */}
      <div className="flex flex-col items-end flex-shrink-0">
        <div className="flex items-center gap-1">
          <Users className="w-2 h-2" style={{ color: `rgba(${conf.accent},0.5)` }} />
          <span className="text-[8px] font-mono font-bold" style={{ color: `rgba(${conf.accent},0.7)` }}>{moment.participantCount}</span>
        </div>
        <span className="text-[6px] font-mono text-slate-500/40 mt-0.5">{moment.timestamp}</span>
      </div>
    </motion.div>
  )
}

function QuickReactBar({ onReact }: { onReact: (signal: RoomSignalType) => void }) {
  const [recentlySent, setRecentlySent] = useState<RoomSignalType | null>(null)

  const quickSignals: { type: RoomSignalType; shortLabel: string }[] = [
    { type: "agree",      shortLabel: "Agree" },
    { type: "strong",     shortLabel: "Strong" },
    { type: "key-level",  shortLabel: "Level" },
    { type: "caution",    shortLabel: "Caution" },
    { type: "fire",       shortLabel: "Conviction" },
    { type: "aligned",    shortLabel: "Aligned" },
  ]

  const handleReact = (signal: RoomSignalType) => {
    onReact(signal)
    setRecentlySent(signal)
    setTimeout(() => setRecentlySent(null), 1500)
  }

  return (
    <div className="flex items-center gap-1">
      {quickSignals.map(sig => {
        const conf = ROOM_SIGNAL_CONFIG[sig.type]
        const SigIcon = conf.icon
        const isSent = recentlySent === sig.type

        return (
          <motion.button
            key={sig.type}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleReact(sig.type)}
            className="flex items-center gap-1 px-1.5 py-1 rounded-md transition-all duration-150 group/react"
            style={{
              background: isSent ? `rgba(${conf.color},0.15)` : "rgba(255,255,255,0.02)",
              border: `1px solid ${isSent ? `rgba(${conf.color},0.25)` : "rgba(255,255,255,0.04)"}`,
              boxShadow: isSent ? `0 0 8px rgba(${conf.color},0.1)` : "none",
            }}
          >
            <SigIcon className="w-2.5 h-2.5 transition-colors duration-150"
              style={{ color: isSent ? `rgba(${conf.accent},0.95)` : `rgba(${conf.accent},0.4)` }} />
            <span className="text-[6px] font-bold uppercase tracking-wider transition-colors duration-150"
              style={{ color: isSent ? `rgba(${conf.accent},0.9)` : `rgba(${conf.accent},0.35)` }}>
              {isSent ? "Sent" : sig.shortLabel}
            </span>
            {isSent && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `rgba(${conf.accent},0.8)` }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function RoomPulsePanel() {
  const [expandedMoments, setExpandedMoments] = useState(false)
  const [, setForceUpdate] = useState(0)

  const handleReact = useCallback((_signal: RoomSignalType) => {
    // In a real app this would send to server; here we just show the sent feedback
    setForceUpdate(n => n + 1)
  }, [])

  const momentumConf = {
    calm:     { color: "148,163,184" },
    building: { color: "52,211,153" },
    surging:  { color: "251,191,36" },
    peak:     { color: "239,68,68" },
  }[ROOM_PULSE.currentMomentum]

  const topSignals = [...ROOM_PULSE.signalCounts].sort((a, b) => b.count - a.count).slice(0, 4)
  const displayMoments = expandedMoments ? ROOM_PULSE.recentMoments : ROOM_PULSE.recentMoments.slice(0, 2)

  return (
    <div className="space-y-3">
      {/* Momentum + top signals row */}
      <div className="flex items-start gap-3">
        {/* Gauge */}
        <MomentumGauge value={ROOM_PULSE.momentumValue} momentum={ROOM_PULSE.currentMomentum} />

        {/* Signal counters grid */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          {topSignals.map(sig => {
            const conf = ROOM_SIGNAL_CONFIG[sig.type]
            const SigIcon = conf.icon
            return (
              <div key={sig.type} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-150 hover:bg-white/[0.02]"
                style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <SigIcon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `rgba(${conf.accent},0.7)` }} />
                <span className="text-[7px] font-medium truncate" style={{ color: `rgba(${conf.accent},0.6)` }}>{conf.label}</span>
                <span className="text-[8px] font-mono font-bold ml-auto flex-shrink-0" style={{ color: `rgba(${conf.accent},0.8)` }}>{sig.count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active signals summary */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
        style={{
          background: `linear-gradient(90deg, rgba(${momentumConf.color},0.04) 0%, rgba(0,0,0,0.1) 100%)`,
          border: `1px solid rgba(${momentumConf.color},0.08)`,
        }}>
        <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: `rgba(${momentumConf.color},0.8)` }}
          animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <span className="text-[8px] font-bold" style={{ color: `rgba(${momentumConf.color},0.8)` }}>
          {ROOM_PULSE.activeSignals} signals
        </span>
        <span className="text-[7px] text-slate-500/45">in last 60s</span>
        <div className="flex-1" />
        <span className="text-[7px] font-medium" style={{ color: `rgba(${momentumConf.color},0.55)` }}>
          Dominant: {ROOM_SIGNAL_CONFIG[ROOM_PULSE.dominantSentiment].label}
        </span>
      </div>

      {/* Quick react bar */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[7px] text-slate-400/50 font-bold uppercase tracking-wider">Quick Signal</span>
          <div className="flex-1 h-px bg-white/[0.03]" />
        </div>
        <QuickReactBar onReact={handleReact} />
      </div>

      {/* Recent moments */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] text-slate-400/50 font-bold uppercase tracking-wider">Recent Moments</span>
            <span className="text-[6px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.03)", color: "rgba(148,163,184,0.45)" }}>
              {ROOM_PULSE.recentMoments.length} events
            </span>
          </div>
          {ROOM_PULSE.recentMoments.length > 2 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpandedMoments(!expandedMoments)}
              className="text-[7px] font-medium transition-colors duration-150 hover:text-white/60"
              style={{ color: "rgba(148,163,184,0.45)" }}
            >
              {expandedMoments ? "Show less" : `+${ROOM_PULSE.recentMoments.length - 2} more`}
            </motion.button>
          )}
        </div>
        <div className="space-y-1.5">
          <AnimatePresence>
            {displayMoments.map(moment => (
              <FloatingReactionTrail key={moment.id} moment={moment} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// AUDIENCE PRESENCE INTELLIGENCE PANEL
// ══════════════════════════════════════════════════════════════════

const ENGAGEMENT_MODE_CONFIG: Record<EngagementMode, { icon: typeof Eye; label: string; color: string }> = {
  watching:        { icon: Eye,        label: "Watching",  color: "148,163,184" },
  discussing:      { icon: MessageSquare, label: "Discussing", color: "52,211,153" },
  reacting:        { icon: Flame,      label: "Reacting",  color: "251,191,36" },
  asking:          { icon: HelpCircle, label: "Asking",    color: "125,211,252" },
  "sharing-levels": { icon: Target,    label: "Sharing",   color: "167,139,250" },
}

const ROLE_CONFIG: Record<ParticipantRole, { label: string; color: string; border: string }> = {
  mentor:           { label: "Mentor",    color: "52,211,153",  border: "16,185,129" },
  moderator:        { label: "Mod",       color: "125,211,252", border: "56,189,248" },
  "top-contributor": { label: "Top",      color: "251,191,36",  border: "245,158,11" },
  subscriber:       { label: "Sub",       color: "167,139,250", border: "139,92,246" },
  member:           { label: "",          color: "148,163,184", border: "100,116,139" },
}

function PulseSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 20
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${color},0.15)`} />
          <stop offset="100%" stopColor={`rgba(${color},0)`} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill="url(#sparkFill)"
      />
      <polyline
        points={points}
        fill="none"
        stroke={`rgba(${color},0.6)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current dot */}
      <circle
        cx={w}
        cy={parseFloat(points.split(" ").pop()!.split(",")[1])}
        r="2.5"
        fill={`rgba(${color},0.9)`}
      >
        <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function ActivityBreakdownBar({ breakdown }: { breakdown: AudienceData["activityBreakdown"] }) {
  const total = breakdown.watching + breakdown.discussing + breakdown.reacting + breakdown.asking + breakdown.sharingLevels
  const segments = [
    { key: "watching" as const, value: breakdown.watching, color: "148,163,184", label: "Watching" },
    { key: "discussing" as const, value: breakdown.discussing, color: "52,211,153", label: "Active" },
    { key: "reacting" as const, value: breakdown.reacting, color: "251,191,36", label: "Reacting" },
    { key: "asking" as const, value: breakdown.asking, color: "125,211,252", label: "Asking" },
    { key: "sharingLevels" as const, value: breakdown.sharingLevels, color: "167,139,250", label: "Sharing" },
  ]

  return (
    <div>
      {/* Segmented bar */}
      <div className="flex h-[3px] rounded-full overflow-hidden gap-px">
        {segments.map(seg => (
          <motion.div
            key={seg.key}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.value / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_PREMIUM }}
            className="rounded-full"
            style={{ background: `rgba(${seg.color},0.7)`, minWidth: seg.value > 0 ? "3px" : "0" }}
          />
        ))}
      </div>
      {/* Labels */}
      <div className="flex items-center gap-2.5 mt-2">
        {segments.filter(s => s.value > 0).map(seg => (
          <div key={seg.key} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${seg.color},0.7)` }} />
            <span className="text-[7px] font-medium" style={{ color: `rgba(${seg.color},0.65)` }}>{seg.value}</span>
            <span className="text-[6px] text-slate-500/50 uppercase tracking-wider">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ParticipantChip({ participant, rank }: { participant: Participant; rank: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const roleConf = ROLE_CONFIG[participant.role]
  const modeConf = ENGAGEMENT_MODE_CONFIG[participant.engagementMode]
  const ModeIcon = modeConf.icon

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-default"
    >
      {/* Compact chip */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200"
        style={{
          background: isHovered
            ? `linear-gradient(135deg, rgba(${roleConf.border},0.08) 0%, rgba(0,0,0,0.2) 100%)`
            : "rgba(255,255,255,0.015)",
          border: `1px solid ${isHovered ? `rgba(${roleConf.border},0.18)` : "rgba(255,255,255,0.04)"}`,
        }}>
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${participant.color} flex items-center justify-center text-[6px] font-bold text-white`}
            style={{ boxShadow: participant.lastActive === "now" ? `0 0 6px rgba(${roleConf.border},0.25)` : "none" }}>
            {participant.initials}
          </div>
          {participant.lastActive === "now" && (
            <motion.div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: `rgba(52,211,153,0.9)`, border: "1.5px solid rgba(10,11,16,0.95)" }}
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          )}
        </div>

        {/* Name + role */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-semibold text-white/75 truncate">{participant.name}</span>
            {roleConf.label && (
              <span className="text-[5px] font-bold uppercase px-1 py-px rounded tracking-wider flex-shrink-0"
                style={{
                  background: `rgba(${roleConf.border},0.1)`,
                  color: `rgba(${roleConf.color},0.8)`,
                  border: `1px solid rgba(${roleConf.border},0.12)`,
                }}>
                {roleConf.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-px">
            <ModeIcon className="w-2 h-2 flex-shrink-0" style={{ color: `rgba(${modeConf.color},0.55)` }} />
            <span className="text-[6px] font-medium" style={{ color: `rgba(${modeConf.color},0.5)` }}>{modeConf.label}</span>
            {participant.focusAligned && (
              <Focus className="w-2 h-2 flex-shrink-0" style={{ color: "rgba(52,211,153,0.45)" }} />
            )}
          </div>
        </div>

        {/* Activity spark */}
        <div className="flex items-center gap-1 ml-auto pl-1 flex-shrink-0">
          <span className="text-[6px] font-mono text-slate-500/45">{participant.messageCount}m</span>
          <div className="w-px h-2.5 bg-white/[0.04]" />
          <span className="text-[6px] font-mono text-slate-500/45">{participant.reactionCount}r</span>
        </div>
      </div>

      {/* Expanded hover card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 top-full mt-1 rounded-xl p-2.5 pointer-events-none"
            style={{
              background: "linear-gradient(160deg, rgba(20,22,34,0.98) 0%, rgba(10,12,18,0.99) 100%)",
              border: `1px solid rgba(${roleConf.border},0.2)`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(${roleConf.border},0.06)`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-white/85">{participant.name}</span>
              <span className="text-[7px] text-slate-400/55">{participant.lastActive === "now" ? "Active now" : `${participant.lastActive} ago`}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[6px] text-slate-500/50 uppercase tracking-wider">Messages</span>
                <span className="text-[10px] font-bold font-mono text-white/70">{participant.messageCount}</span>
              </div>
              <div className="w-px h-5 bg-white/[0.06]" />
              <div className="flex flex-col">
                <span className="text-[6px] text-slate-500/50 uppercase tracking-wider">Reactions</span>
                <span className="text-[10px] font-bold font-mono text-white/70">{participant.reactionCount}</span>
              </div>
              {participant.streak && (
                <>
                  <div className="w-px h-5 bg-white/[0.06]" />
                  <div className="flex flex-col">
                    <span className="text-[6px] text-slate-500/50 uppercase tracking-wider">Streak</span>
                    <span className="text-[10px] font-bold font-mono" style={{ color: `rgba(${roleConf.color},0.8)` }}>{participant.streak}d</span>
                  </div>
                </>
              )}
            </div>
            {participant.focusAligned && (
              <div className="mt-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
                <Focus className="w-2 h-2 text-emerald-400/60" />
                <span className="text-[6px] font-medium text-emerald-400/60">Aligned with mentor focus</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function RoomSentimentBar({ sentiment }: { sentiment: AudienceData["roomSentiment"] }) {
  const segments = [
    { label: "Bullish", value: sentiment.bullish, color: "16,185,129" },
    { label: "Cautious", value: sentiment.cautious, color: "245,158,11" },
    { label: "Bearish", value: sentiment.bearish, color: "239,68,68" },
    { label: "Neutral", value: sentiment.neutral, color: "148,163,184" },
  ]

  return (
    <div>
      <div className="flex h-[2.5px] rounded-full overflow-hidden gap-px">
        {segments.map(seg => (
          <motion.div
            key={seg.label}
            initial={{ width: 0 }}
            animate={{ width: `${seg.value}%` }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_PREMIUM }}
            className="rounded-full"
            style={{ background: `rgba(${seg.color},0.65)` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        {segments.filter(s => s.value > 5).map(seg => (
          <div key={seg.label} className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full" style={{ background: `rgba(${seg.color},0.65)` }} />
            <span className="text-[6px] font-bold uppercase tracking-wider" style={{ color: `rgba(${seg.color},0.6)` }}>{seg.value}%</span>
            <span className="text-[6px] text-slate-500/40">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AudiencePresencePanel() {
  const [showAllParticipants, setShowAllParticipants] = useState(false)
  const pulseConf: Record<PulseLevel, { color: string; glow: string }> = {
    Calm:    { color: "148,163,184", glow: "0" },
    Active:  { color: "52,211,153",  glow: "0.08" },
    High:    { color: "251,191,36",  glow: "0.12" },
    Surging: { color: "239,68,68",   glow: "0.18" },
  }
  const pulse = pulseConf[AUDIENCE.engagementPulse]
  const displayParticipants = showAllParticipants ? AUDIENCE.topParticipants : AUDIENCE.topParticipants.slice(0, 4)

  return (
    <div className="space-y-3">
      {/* Room vitals row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Total viewers */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Users className="w-2.5 h-2.5 text-white/50" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-bold text-white/85">{AUDIENCE.total.toLocaleString()}</span>
              <span className="text-[6px] text-slate-500/50 uppercase tracking-wider leading-none">Viewing</span>
            </div>
          </div>
          <div className="w-px h-6 bg-white/[0.06]" />
          {/* Active now */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <motion.div className="w-1.5 h-1.5 rounded-full"
                style={{ background: `rgba(${pulse.color},0.8)` }}
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="text-[11px] font-mono font-bold" style={{ color: `rgba(${pulse.color},0.9)` }}>
                <AnimatedStat value={AUDIENCE.activeParticipants} />
              </span>
            </div>
            <span className="text-[6px] text-slate-500/50 uppercase tracking-wider leading-none">Active</span>
          </div>
          <div className="w-px h-6 bg-white/[0.06]" />
          {/* Session peak */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-white/55">{AUDIENCE.sessionPeak}</span>
            <span className="text-[6px] text-slate-500/40 uppercase tracking-wider leading-none">Peak</span>
          </div>
        </div>

        {/* Pulse indicator + sparkline */}
        <div className="flex items-center gap-2.5">
          <PulseSparkline data={AUDIENCE.pulseHistory} color={pulse.color} />
          <div className="flex items-center gap-1 px-2 py-1 rounded-md"
            style={{
              background: `rgba(${pulse.color},0.06)`,
              border: `1px solid rgba(${pulse.color},0.12)`,
              boxShadow: `0 0 8px rgba(${pulse.color},${pulse.glow})`,
            }}>
            <Signal className="w-3 h-3" style={{ color: `rgba(${pulse.color},0.8)` }} />
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: `rgba(${pulse.color},0.85)` }}>{AUDIENCE.engagementPulse}</span>
          </div>
        </div>
      </div>

      {/* Activity breakdown bar */}
      <ActivityBreakdownBar breakdown={AUDIENCE.activityBreakdown} />

      {/* Room sentiment */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[7px] text-slate-400/55 font-bold uppercase tracking-wider">Room Sentiment</span>
          <div className="flex-1 h-px bg-white/[0.03]" />
          <span className="text-[7px] text-slate-500/40 font-mono">{AUDIENCE.avgSessionTime} avg</span>
        </div>
        <RoomSentimentBar sentiment={AUDIENCE.roomSentiment} />
      </div>

      {/* Top participants */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] text-slate-400/55 font-bold uppercase tracking-wider">Top Participants</span>
            <span className="text-[6px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.03)", color: "rgba(148,163,184,0.45)" }}>
              {AUDIENCE.topParticipants.filter(p => p.lastActive === "now").length} online
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAllParticipants(!showAllParticipants)}
            className="text-[7px] font-medium transition-colors duration-150 hover:text-white/60"
            style={{ color: "rgba(148,163,184,0.45)" }}
          >
            {showAllParticipants ? "Show less" : `+${AUDIENCE.topParticipants.length - 4} more`}
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <AnimatePresence>
            {displayParticipants.map((p, i) => (
              <ParticipantChip key={p.name} participant={p} rank={i + 1} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent joins ticker */}
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
        style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
        <UserPlus className="w-2.5 h-2.5 text-emerald-400/45 flex-shrink-0" />
        <div className="flex items-center gap-1 overflow-hidden flex-1">
          {AUDIENCE.recentJoins.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="text-[7px] text-emerald-400/55 font-medium flex-shrink-0"
            >
              +{name}
            </motion.span>
          ))}
          <span className="text-[7px] text-slate-500/40 flex-shrink-0">just joined</span>
        </div>
        <span className="text-[6px] font-mono text-slate-500/35 flex-shrink-0">{AUDIENCE.total - AUDIENCE.activeParticipants} idle</span>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// COLLAPSIBLE + REORDERABLE SECTION SYSTEM
// ══════════════════════════════════════════════════════════════════

type SectionId = "screen-share" | "discussion" | "instruments" | "intelligence" | "tools" | "audience" | "room-pulse" | "session-timeline"

const DEFAULT_SECTION_ORDER: SectionId[] = ["session-timeline", "audience", "room-pulse", "screen-share", "discussion", "instruments", "intelligence", "tools"]

interface SectionConfig {
  id: SectionId
  title: string
  icon: typeof MessageSquare
  color: string
  accent: string
  meta: string
  metaStyle?: "badge" | "text"
}

const SECTION_CONFIGS: SectionConfig[] = [
  { id: "session-timeline", title: "Session Timeline", icon: Timer, color: "239,68,68", accent: "248,113,113", meta: `${SESSION_TIMELINE.totalEvents} events`, metaStyle: "badge" },
  { id: "audience", title: "Audience Presence", icon: Users, color: "52,211,153", accent: "110,231,183", meta: `${AUDIENCE.total} viewers` },
  { id: "room-pulse", title: "Room Pulse", icon: Signal, color: "251,191,36", accent: "253,224,71", meta: `${ROOM_PULSE.activeSignals} signals`, metaStyle: "badge" },
  { id: "screen-share", title: "Screen Share", icon: Monitor, color: "239,68,68", accent: "248,113,113", meta: "Live", metaStyle: "badge" },
  { id: "discussion", title: "Live Discussion", icon: MessageSquare, color: "239,68,68", accent: "248,113,113", meta: `${DISCUSSION_ROOMS.length} rooms` },
  { id: "instruments", title: "Instruments in Focus", icon: BarChart3, color: "56,189,248", accent: "125,211,252", meta: `${INSTRUMENTS.length} tracked` },
  { id: "intelligence", title: "Room Intelligence", icon: Sparkles, color: "139,92,246", accent: "167,139,250", meta: "AI Enhanced", metaStyle: "badge" },
  { id: "tools", title: "Stage Tools", icon: Zap, color: "245,158,11", accent: "251,191,36", meta: `${STAGE_TOOLS.length} available` },
]

const STORAGE_KEY = "mentor-stage-layout"

function loadLayout(): { order: SectionId[]; collapsed: SectionId[] } {
  if (typeof window === "undefined") return { order: DEFAULT_SECTION_ORDER, collapsed: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Validate all section IDs are present
      const validOrder = (parsed.order as SectionId[]).filter(id => DEFAULT_SECTION_ORDER.includes(id))
      // Add any missing sections
      for (const id of DEFAULT_SECTION_ORDER) {
        if (!validOrder.includes(id)) validOrder.push(id)
      }
      return { order: validOrder, collapsed: parsed.collapsed || [] }
    }
  } catch { /* ignore */ }
  return { order: DEFAULT_SECTION_ORDER, collapsed: [] }
}

function saveLayout(order: SectionId[], collapsed: SectionId[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, collapsed }))
  } catch { /* ignore */ }
}

// ── CollapsibleSection wrapper ──

interface CollapsibleSectionProps {
  config: SectionConfig
  isCollapsed: boolean
  onToggleCollapse: () => void
  onMoveUp: (() => void) | null
  onMoveDown: (() => void) | null
  isFirst: boolean
  isLast: boolean
  children: React.ReactNode
}

function CollapsibleSection({
  config,
  isCollapsed,
  onToggleCollapse,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  children,
}: CollapsibleSectionProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className="px-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Section header bar */}
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer group/section transition-all duration-200"
        onClick={onToggleCollapse}
        style={{
          background: isCollapsed
            ? "linear-gradient(160deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.15) 100%)"
            : `linear-gradient(160deg, rgba(${config.color},0.04) 0%, rgba(0,0,0,0.18) 100%)`,
          border: `1px solid ${isCollapsed ? "rgba(255,255,255,0.05)" : `rgba(${config.color},0.12)`}`,
          boxShadow: isCollapsed ? "none" : `0 2px 10px rgba(0,0,0,0.15), 0 0 8px rgba(${config.color},0.03)`,
        }}
      >
        {/* Drag handle — visible on hover */}
        <div className={`flex-shrink-0 transition-opacity duration-200 ${isHovering ? "opacity-60" : "opacity-0"}`}>
          <GripVertical className="w-3 h-3 text-slate-400/50" />
        </div>

        {/* Left accent bar */}
        <div className="w-[2px] h-5 rounded-full flex-shrink-0 transition-all duration-200"
          style={{
            background: isCollapsed ? "rgba(148,163,184,0.15)" : `rgba(${config.accent},0.5)`,
            boxShadow: isCollapsed ? "none" : `0 0 6px rgba(${config.color},0.15)`,
          }} />

        {/* Section icon */}
        <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: `rgba(${config.color},${isCollapsed ? "0.06" : "0.12"})`,
            border: `1px solid rgba(${config.color},${isCollapsed ? "0.08" : "0.18"})`,
          }}>
          <config.icon className="w-2.5 h-2.5 transition-colors duration-200"
            style={{ color: `rgba(${config.accent},${isCollapsed ? "0.5" : "0.9"})` }} />
        </div>

        {/* Title */}
        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] flex-1 transition-colors duration-200 ${isCollapsed ? "text-white/50" : "text-white/80"}`}>
          {config.title}
        </span>

        {/* Meta badge/text */}
        {config.metaStyle === "badge" ? (
          <span className="text-[7px] px-1.5 py-0.5 rounded font-bold uppercase transition-all duration-200"
            style={{
              background: `rgba(${config.color},${isCollapsed ? "0.04" : "0.08"})`,
              border: `1px solid rgba(${config.color},${isCollapsed ? "0.06" : "0.12"})`,
              color: `rgba(${config.accent},${isCollapsed ? "0.4" : "0.7"})`,
            }}>
            {config.meta}
          </span>
        ) : (
          <span className={`text-[8px] font-medium transition-colors duration-200 ${isCollapsed ? "text-slate-500/40" : "text-slate-400/60"}`}>
            {config.meta}
          </span>
        )}

        {/* Reorder arrows — visible on hover */}
        <div className={`flex items-center gap-0.5 flex-shrink-0 transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}`}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            disabled={isFirst}
            onClick={(e) => { e.stopPropagation(); onMoveUp?.() }}
            className={`p-0.5 rounded transition-colors duration-150 ${isFirst ? "text-slate-600/20 cursor-default" : "text-slate-400/50 hover:text-white/70 hover:bg-white/[0.06]"}`}
          >
            <ChevronUp className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            disabled={isLast}
            onClick={(e) => { e.stopPropagation(); onMoveDown?.() }}
            className={`p-0.5 rounded transition-colors duration-150 ${isLast ? "text-slate-600/20 cursor-default" : "text-slate-400/50 hover:text-white/70 hover:bg-white/[0.06]"}`}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        </div>

        {/* Collapse chevron */}
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 p-0.5"
        >
          <ChevronDown className={`w-3 h-3 transition-colors duration-200 ${isCollapsed ? "text-slate-500/35" : "text-slate-300/55"}`} />
        </motion.div>
      </div>

      {/* Section content — animated expand/collapse */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

interface MentorStageProps {
  messageInput: string
  setMessageInput: (v: string) => void
  onSendMessage: () => void
}

export function MentorStage({ messageInput, setMessageInput, onSendMessage }: MentorStageProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(2700)
  const [isMuted, setIsMuted] = useState(false)
  const [composerMode, setComposerMode] = useState<"chat" | "question" | "setup">("chat")
  const [discussionOpen, setDiscussionOpen] = useState(false)
  const [discussionHover, setDiscussionHover] = useState(false)
  const [activeRoom, setActiveRoom] = useState("main")
  const discussionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Section layout state — persisted to localStorage
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(DEFAULT_SECTION_ORDER)
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionId>>(new Set())
  const [layoutLoaded, setLayoutLoaded] = useState(false)

  // Load layout from localStorage on mount
  useEffect(() => {
    const { order, collapsed } = loadLayout()
    setSectionOrder(order)
    setCollapsedSections(new Set(collapsed))
    setLayoutLoaded(true)
  }, [])

  // Save layout whenever it changes (after initial load)
  useEffect(() => {
    if (!layoutLoaded) return
    saveLayout(sectionOrder, Array.from(collapsedSections))
  }, [sectionOrder, collapsedSections, layoutLoaded])

  const toggleSection = useCallback((id: SectionId) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const moveSectionUp = useCallback((id: SectionId) => {
    setSectionOrder(prev => {
      const idx = prev.indexOf(id)
      if (idx <= 0) return prev
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }, [])

  const moveSectionDown = useCallback((id: SectionId) => {
    setSectionOrder(prev => {
      const idx = prev.indexOf(id)
      if (idx < 0 || idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}` : `${m}:${sec.toString().padStart(2, "0")}`
  }

  const composerConfig = {
    chat: { placeholder: "Chat with the audience...", color: "rgba(255,255,255,0.5)", label: "Chat" },
    question: { placeholder: "Ask the mentor a question...", color: "rgba(56,189,248,0.7)", label: "Question" },
    setup: { placeholder: "Share a setup or observation...", color: "rgba(245,158,11,0.7)", label: "Setup" },
  }

  const cc = composerConfig[composerMode]

  // Hover handlers for discussion
  const handleDiscussionEnter = () => {
    if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current)
    setDiscussionHover(true)
    setDiscussionOpen(true)
  }
  const handleDiscussionLeave = () => {
    discussionTimeoutRef.current = setTimeout(() => {
      setDiscussionHover(false)
      setDiscussionOpen(false)
    }, 400)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">

      {/* Atmospheric layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-[120px]"
          style={{ background: "radial-gradient(ellipse 60% 100% at 30% 0%, rgba(239,68,68,0.06) 0%, transparent 70%)" }} />
        <div className="absolute top-[60px] left-0 w-[200px] h-[200px]"
          style={{ background: "radial-gradient(circle at 0% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[80px]"
          style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(239,68,68,0.03) 0%, transparent 60%)" }} />
      </div>

      {/* ═══ 1) COMPACT STAGE HEADER BAR ═══ */}
      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE_PREMIUM }} className="relative flex-shrink-0 z-10">
        <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none z-20"
          style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.65), rgba(239,68,68,0.3) 30%, rgba(16,185,129,0.25) 70%, transparent)" }} />

        <div className="flex items-center gap-2 px-3 py-1.5"
          style={{ background: "linear-gradient(160deg, rgba(239,68,68,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.18) 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {/* LIVE badge */}
          <motion.span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-[0.12em] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,1))", color: "white", boxShadow: "0 0 10px rgba(239,68,68,0.3)" }}
            animate={{ boxShadow: ["0 0 10px rgba(239,68,68,0.3)", "0 0 16px rgba(239,68,68,0.45)", "0 0 10px rgba(239,68,68,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <Radio className="w-2.5 h-2.5" /> LIVE
          </motion.span>

          {/* Session name + mode */}
          <h2 className="text-[11px] font-bold text-white/90 truncate">{SESSION.name}</h2>
          <ModeBadge mode={SESSION.mode} />

          {/* Timer */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <Clock className="w-2.5 h-2.5 text-red-400/80" />
            <span className="text-[9px] font-mono font-semibold text-red-400/85">{formatElapsed(elapsedSeconds)}</span>
          </div>

          <AudioWaveform />

          {/* Instruments */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            {INSTRUMENTS.filter(i => i.priority === "primary").map(inst => (
              <span key={inst.symbol} className="px-1.5 py-[2px] rounded text-[7px] font-mono font-bold flex items-center gap-0.5"
                style={{
                  background: inst.direction === "bullish" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  color: inst.direction === "bullish" ? "rgba(52,211,153,0.85)" : "rgba(248,113,113,0.85)",
                  border: `1px solid ${inst.direction === "bullish" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
                }}>
                {inst.symbol} <span className="text-[6px] opacity-75">{inst.change}</span>
              </span>
            ))}
          </div>

          {/* Viewers + controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Users className="w-2.5 h-2.5 text-red-400/60" />
              <span className="text-[8px] font-mono font-bold text-white/70">{AUDIENCE.total.toLocaleString()}</span>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded-md transition-all duration-150"
              style={{ background: isMuted ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${isMuted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)"}` }}>
              <Volume2 className={`w-3 h-3 ${isMuted ? "text-red-400/75" : "text-white/45"}`} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }}
              className="px-2 py-1 rounded-md text-[7px] font-semibold uppercase tracking-wider transition-all duration-150"
              style={{ background: "rgba(239,68,68,0.1)", color: "rgba(248,113,113,0.85)", border: "1px solid rgba(239,68,68,0.15)" }}>
              Leave
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ═══ TWO-COLUMN BODY ═══ */}
      <div className="flex-1 flex min-h-0 relative z-10">

        {/* ═══ LEFT COLUMN — scrollable information ═══ */}
        <ScrollArea className="w-[45%] min-w-[280px] flex-shrink-0 border-r border-white/[0.04]">
        <div className="space-y-5 pb-4">

          {/* ═══ 2) MENTOR PRESENCE — compact card ═══ */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: EASE_PREMIUM }}
            className="relative rounded-xl overflow-hidden mx-3"
            style={{ background: "linear-gradient(160deg, rgba(16,185,129,0.05) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.3) 100%)", border: "1px solid rgba(16,185,129,0.12)" }}>

            {/* Row 1: Avatar + Name + Stats + Actions — all one row */}
            <div className="flex items-center gap-2.5 px-3 py-2 relative">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${MENTOR.gradient} flex items-center justify-center text-[11px] font-bold text-white`}
                  style={{ boxShadow: "0 0 0 1.5px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.3)" }}>
                  {MENTOR.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "2px solid #0a0b10" }}>
                  <Mic className="w-1.5 h-1.5 text-white" />
                </div>
              </div>

              {/* Name + title */}
              <div className="min-w-0 flex-shrink">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[11px] font-bold text-white/90 truncate">{MENTOR.name}</h3>
                  <Crown className="w-2.5 h-2.5 text-amber-400/75 flex-shrink-0" />
                  <motion.div className="w-1 h-1 rounded-full bg-emerald-400/80 flex-shrink-0"
                    animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                </div>
                <span className="text-[7px] text-slate-300/60 truncate block">{MENTOR.title}</span>
              </div>

              {/* Inline stats */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                {[
                  { label: "WR", value: `${MENTOR.track.winRate}%`, color: "rgba(16,185,129,0.9)" },
                  { label: "ACC", value: `${MENTOR.track.accuracy}%`, color: "rgba(56,189,248,0.85)" },
                  { label: "P&L", value: MENTOR.track.pnl, color: "rgba(16,185,129,0.85)" },
                ].map((stat, idx) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span className="text-[6px] text-slate-500/50 uppercase tracking-wider leading-none">{stat.label}</span>
                    <span className="text-[9px] font-mono font-bold leading-tight" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
                <div className="w-px h-5 bg-white/[0.05]" />
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="p-1 rounded-md transition-all duration-200"
                  style={{ background: isFollowing ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${isFollowing ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                  <Star className={`w-3 h-3 ${isFollowing ? "text-emerald-400 fill-emerald-400/50" : "text-slate-400/45"}`} />
                </motion.button>
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-1 rounded-md transition-all duration-200"
                  style={{ background: isBookmarked ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${isBookmarked ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                  <Bookmark className={`w-3 h-3 ${isBookmarked ? "text-amber-400 fill-amber-400/50" : "text-slate-400/45"}`} />
                </motion.button>
              </div>
            </div>

            {/* Row 2: Audience bar — ultra-compact */}
            <div className="flex items-center justify-between px-3 py-1.5"
              style={{ background: "rgba(0,0,0,0.15)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {AUDIENCE.topParticipants.slice(0, 4).map((p, i) => (
                    <div key={p.name}
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-[5px] font-bold text-white`}
                      style={{ zIndex: 4 - i, boxShadow: "0 0 0 1px #0a0b10" }}>
                      {p.initials}
                    </div>
                  ))}
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[5px] font-bold text-white/40"
                    style={{ background: "rgba(255,255,255,0.04)", zIndex: 0, boxShadow: "0 0 0 1px #0a0b10" }}>
                    +{AUDIENCE.total - 4}
                  </div>
                </div>
                <span className="text-[7px] font-mono font-bold text-white/60">{AUDIENCE.total.toLocaleString()}</span>
                <motion.div className="w-1 h-1 rounded-full bg-emerald-400/80 flex-shrink-0"
                  animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
                <span className="text-[7px] font-mono text-emerald-400/65">{AUDIENCE.activeParticipants} active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 px-1 py-0.5 rounded"
                  style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.07)" }}>
                  <Timer className="w-2 h-2 text-red-400/50" />
                  <span className="text-[6px] font-mono font-bold text-red-400/60">{SESSION_TIMELINE.totalEvents}</span>
                </div>
                <PulseSparkline data={AUDIENCE.pulseHistory} color="52,211,153" />
                <span className="text-[6px] font-bold uppercase tracking-wider text-emerald-400/65">{AUDIENCE.engagementPulse}</span>
              </div>
            </div>
          </motion.div>

          {/* ═══ DYNAMIC REORDERABLE SECTIONS (left column only — screen-share + discussion live in right column) ═══ */}
          {sectionOrder.filter(s => s !== "screen-share" && s !== "discussion").map((sectionId, idx, filteredArr) => {
            const config = SECTION_CONFIGS.find(c => c.id === sectionId)!
            const isCollapsed = collapsedSections.has(sectionId)
            const isFirst = idx === 0
            const isLast = idx === filteredArr.length - 1

            // Discussion has its own special wrapper with hover behavior
            if (sectionId === "discussion") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <div
                    onMouseEnter={handleDiscussionEnter}
                    onMouseLeave={handleDiscussionLeave}
                  >
                    {/* Room preview pills */}
                    {!discussionOpen && (
                      <div className="pb-2">
                        <div className="flex items-center gap-1.5">
                          {DISCUSSION_ROOMS.map(room => (
                            <div key={room.id} className="flex items-center gap-1.5 px-2 py-1 rounded-md flex-1 min-w-0 cursor-pointer transition-all duration-150 hover:brightness-125"
                              style={{ background: `rgba(${room.color},0.08)`, border: `1px solid rgba(${room.color},0.12)` }}>
                              <room.icon className="w-3 h-3 flex-shrink-0" style={{ color: `rgba(${room.accent},0.85)` }} />
                              <span className="text-[7px] font-semibold truncate" style={{ color: `rgba(${room.accent},0.75)` }}>{room.name}</span>
                              {room.isLive && (
                                <motion.div className="w-1 h-1 rounded-full flex-shrink-0 ml-auto"
                                  style={{ background: `rgba(${room.accent},0.8)` }}
                                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expanded discussion */}
                    <AnimatePresence>
                      {discussionOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl overflow-hidden"
                            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.2) 100%)", border: "1px solid rgba(255,255,255,0.05)" }}>

                            {/* Room selector tabs */}
                            <div className="flex items-center gap-0 px-1.5 pt-1.5 pb-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              {DISCUSSION_ROOMS.map(room => {
                                const isActive = activeRoom === room.id
                                return (
                                  <motion.button
                                    key={room.id}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setActiveRoom(room.id)}
                                    className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg text-[9px] font-bold transition-all duration-200 flex-1"
                                    style={{
                                      background: isActive ? `rgba(${room.color},0.1)` : "transparent",
                                      color: isActive ? `rgba(${room.accent},0.95)` : "rgba(148,163,184,0.55)",
                                    }}
                                  >
                                    <room.icon className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{room.name}</span>
                                    {room.isLive && (
                                      <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ background: isActive ? `rgba(${room.accent},0.8)` : "rgba(16,185,129,0.5)" }}
                                        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                    )}
                                    <span className="text-[7px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded"
                                      style={{
                                        background: isActive ? `rgba(${room.color},0.15)` : "rgba(255,255,255,0.04)",
                                        color: isActive ? `rgba(${room.accent},0.75)` : "rgba(148,163,184,0.4)",
                                      }}>
                                      {room.activeUsers}
                                    </span>
                                    {isActive && (
                                      <motion.div layoutId="roomTab"
                                        className="absolute bottom-0 left-1 right-1 h-[2px] rounded-t-full"
                                        style={{ background: `rgba(${room.accent},0.8)`, boxShadow: `0 0 10px rgba(${room.color},0.35)` }}
                                        transition={{ duration: 0.25, ease: EASE_PREMIUM }} />
                                    )}
                                  </motion.button>
                                )
                              })}
                            </div>

                            {/* Active room info bar */}
                            {(() => {
                              const room = DISCUSSION_ROOMS.find(r => r.id === activeRoom) || DISCUSSION_ROOMS[0]
                              return (
                                <div className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: `rgba(${room.color},0.03)` }}>
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                      style={{ background: `rgba(${room.color},0.15)`, border: `1px solid rgba(${room.color},0.2)` }}>
                                      <room.icon className="w-3 h-3" style={{ color: `rgba(${room.accent},0.95)` }} />
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold" style={{ color: `rgba(${room.accent},0.9)` }}>{room.name}</span>
                                      <p className="text-[8px] text-slate-300/60">{room.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" style={{ color: `rgba(${room.accent},0.55)` }} />
                                      <span className="text-[8px] font-mono font-bold" style={{ color: `rgba(${room.accent},0.65)` }}>{room.activeUsers}</span>
                                    </div>
                                    <div className="w-px h-3.5 bg-white/[0.08]" />
                                    <div className="flex items-center gap-1">
                                      <MessageSquare className="w-3 h-3 text-slate-400/50" />
                                      <span className="text-[8px] font-mono text-slate-300/55">{room.messageCount}</span>
                                    </div>
                                    {room.isLive && (
                                      <>
                                        <div className="w-px h-3.5 bg-white/[0.08]" />
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                                          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.15)" }}>
                                          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/90"
                                            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                          <span className="text-[7px] font-bold text-emerald-400/80 uppercase">Live</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            })()}

                            {/* Cross-room previews */}
                            <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.08)" }}>
                              {DISCUSSION_ROOMS.filter(r => r.id !== activeRoom).slice(0, 3).map(room => (
                                <motion.button key={room.id} whileTap={{ scale: 0.97 }}
                                  onClick={() => setActiveRoom(room.id)}
                                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg flex-1 min-w-0 transition-all duration-150 hover:bg-white/[0.04]"
                                  style={{ border: `1px solid rgba(${room.color},0.1)`, background: `rgba(${room.color},0.03)` }}>
                                  <room.icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `rgba(${room.accent},0.6)` }} />
                                  <span className="text-[7px] truncate text-slate-300/55">{room.lastMessage}</span>
                                </motion.button>
                              ))}
                            </div>

                            {/* Message feed */}
                            <div className="p-3">
                              <DiscussionFeed messages={DISCUSSION_FEED} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CollapsibleSection>
              )
            }

            if (sectionId === "screen-share") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <div className="-mx-4">
                    <ScreenShareView />
                  </div>
                </CollapsibleSection>
              )
            }

            if (sectionId === "instruments") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {INSTRUMENTS.map((inst, instIdx) => (
                      <motion.div key={inst.symbol}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.04 + instIdx * 0.04, ease: EASE_PREMIUM }}
                        className="group relative px-3 py-3 rounded-xl cursor-default overflow-hidden transition-all duration-200 hover:translate-y-[-1px]"
                        style={{
                          background: inst.priority === "primary" ? "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)" : "rgba(255,255,255,0.015)",
                          border: `1px solid ${inst.priority === "primary" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"}`,
                          boxShadow: inst.priority === "primary" ? "0 2px 12px rgba(0,0,0,0.2)" : "none",
                        }}>
                        <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full"
                          style={{
                            background: inst.direction === "bullish" ? "rgba(16,185,129,0.6)" : inst.direction === "bearish" ? "rgba(239,68,68,0.6)" : "rgba(148,163,184,0.25)",
                            boxShadow: inst.direction === "bullish" ? "0 0 6px rgba(16,185,129,0.2)" : inst.direction === "bearish" ? "0 0 6px rgba(239,68,68,0.2)" : "none",
                          }} />
                        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: inst.direction === "bullish" ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16,185,129,0.05), transparent)"
                              : inst.direction === "bearish" ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(239,68,68,0.05), transparent)" : "none",
                          }} />
                        <div className="flex items-center justify-between mb-1.5 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className={`text-[13px] font-mono font-bold ${inst.priority === "primary" ? "text-white/95" : "text-white/70"}`}>{inst.symbol}</span>
                            {inst.change && (
                              <span className={`text-[9px] font-mono font-semibold ${inst.change.startsWith("+") ? "text-emerald-400/80" : inst.change.startsWith("-") ? "text-red-400/80" : "text-slate-400/60"}`}>{inst.change}</span>
                            )}
                          </div>
                          <DirectionChip direction={inst.direction} />
                        </div>
                        <p className="text-[9px] text-slate-300/70 leading-relaxed relative z-10">{inst.note}</p>
                      </motion.div>
                    ))}
                  </div>
                </CollapsibleSection>
              )
            }

            if (sectionId === "intelligence") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <IntelligenceGrid blocks={FOCUS_BLOCKS} />
                </CollapsibleSection>
              )
            }

            if (sectionId === "tools") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <StageToolsBoard tools={STAGE_TOOLS} />
                </CollapsibleSection>
              )
            }

            if (sectionId === "audience") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <AudiencePresencePanel />
                </CollapsibleSection>
              )
            }

            if (sectionId === "room-pulse") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <RoomPulsePanel />
                </CollapsibleSection>
              )
            }

            if (sectionId === "session-timeline") {
              return (
                <CollapsibleSection
                  key={sectionId}
                  config={config}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleSection(sectionId)}
                  onMoveUp={isFirst ? null : () => moveSectionUp(sectionId)}
                  onMoveDown={isLast ? null : () => moveSectionDown(sectionId)}
                  isFirst={isFirst}
                  isLast={isLast}
                >
                  <LiveSessionTimeline />
                </CollapsibleSection>
              )
            }

            return null
          })}

        </div>
      </ScrollArea>

        {/* ═══ RIGHT COLUMN — Screen Share (top) + Live Discussion (bottom) ═══ */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* Screen Share — always visible, top */}
          <div className="flex-shrink-0 border-b border-white/[0.04]">
            <div className="flex items-center justify-between px-3 py-2"
              style={{ background: "rgba(239,68,68,0.03)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-red-400/70" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Screen Share</span>
                <span className="px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(239,68,68,0.15)", color: "rgba(248,113,113,0.9)", border: "1px solid rgba(239,68,68,0.2)" }}>Live</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-mono text-slate-400/50">XAU/USD 15m</span>
              </div>
            </div>
            <ScreenShareView />
          </div>

          {/* Live Discussion — always visible, fills remaining space */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Room selector tabs */}
            <div className="flex items-center gap-0 px-1.5 pt-1.5 pb-0 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.08)" }}>
              {DISCUSSION_ROOMS.map(room => {
                const isActive = activeRoom === room.id
                return (
                  <motion.button
                    key={room.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveRoom(room.id)}
                    className="relative flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[9px] font-bold transition-all duration-200 flex-1"
                    style={{
                      background: isActive ? `rgba(${room.color},0.1)` : "transparent",
                      color: isActive ? `rgba(${room.accent},0.95)` : "rgba(148,163,184,0.55)",
                    }}
                  >
                    <room.icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{room.name}</span>
                    {room.isLive && (
                      <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: isActive ? `rgba(${room.accent},0.8)` : "rgba(16,185,129,0.5)" }}
                        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    )}
                    <span className="text-[7px] font-mono flex-shrink-0 px-1 py-0.5 rounded"
                      style={{
                        background: isActive ? `rgba(${room.color},0.15)` : "rgba(255,255,255,0.04)",
                        color: isActive ? `rgba(${room.accent},0.75)` : "rgba(148,163,184,0.4)",
                      }}>
                      {room.activeUsers}
                    </span>
                    {isActive && (
                      <motion.div layoutId="rightRoomTab"
                        className="absolute bottom-0 left-1 right-1 h-[2px] rounded-t-full"
                        style={{ background: `rgba(${room.accent},0.8)`, boxShadow: `0 0 10px rgba(${room.color},0.35)` }}
                        transition={{ duration: 0.25, ease: EASE_PREMIUM }} />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Active room info bar */}
            {(() => {
              const room = DISCUSSION_ROOMS.find(r => r.id === activeRoom) || DISCUSSION_ROOMS[0]
              return (
                <div className="flex items-center justify-between px-3 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: `rgba(${room.color},0.03)` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: `rgba(${room.color},0.15)`, border: `1px solid rgba(${room.color},0.2)` }}>
                      <room.icon className="w-2.5 h-2.5" style={{ color: `rgba(${room.accent},0.95)` }} />
                    </div>
                    <span className="text-[9px] font-bold" style={{ color: `rgba(${room.accent},0.9)` }}>{room.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" style={{ color: `rgba(${room.accent},0.55)` }} />
                      <span className="text-[7px] font-mono font-bold" style={{ color: `rgba(${room.accent},0.65)` }}>{room.activeUsers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-2.5 h-2.5 text-slate-400/50" />
                      <span className="text-[7px] font-mono text-slate-300/55">{room.messageCount}</span>
                    </div>
                    {room.isLive && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/90"
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[6px] font-bold text-emerald-400/80 uppercase">Live</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Message feed — scrollable */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-3">
                <DiscussionFeed messages={DISCUSSION_FEED} />
              </div>
            </ScrollArea>

            {/* Inline composer for the right column */}
            <div className="flex-shrink-0 px-3 py-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 100%)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                {(["chat", "question", "setup"] as const).map(mode => (
                  <motion.button key={mode} whileTap={{ scale: 0.95 }}
                    onClick={() => setComposerMode(mode)}
                    className="px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider transition-all duration-150"
                    style={{
                      background: composerMode === mode ? "rgba(255,255,255,0.07)" : "transparent",
                      color: composerMode === mode ? cc.color : "rgba(148,163,184,0.5)",
                      border: `1px solid ${composerMode === mode ? "rgba(255,255,255,0.1)" : "transparent"}`,
                    }}>
                    {mode === "chat" && <MessageSquare className="w-2 h-2 inline mr-0.5" />}
                    {mode === "question" && <AtSign className="w-2 h-2 inline mr-0.5" />}
                    {mode === "setup" && <Hash className="w-2 h-2 inline mr-0.5" />}
                    {composerConfig[mode].label}
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 focus-within:border-red-500/25"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
                  placeholder={cc.placeholder}
                  className="flex-1 bg-transparent border-0 text-[11px] text-white/90 placeholder:text-slate-400/55 focus-visible:ring-0 p-0 h-auto"
                />
                <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}
                  onClick={onSendMessage}
                  className="p-1.5 rounded-lg transition-all duration-150"
                  style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.85))", color: "white", boxShadow: "0 0 10px rgba(239,68,68,0.2)" }}>
                  <Send className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </div>

        </div>
      </div>{/* end two-column body */}

      {/* ═══ BOTTOM STATUS BAR ═══ */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.12)" }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80"
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-[7px] font-bold text-emerald-400/65 uppercase tracking-wider">Connected</span>
          </div>
          <div className="w-px h-3 bg-white/[0.06]" />
          <span className="text-[7px] font-mono text-slate-500/40">{AUDIENCE.total} viewers</span>
          <div className="w-px h-3 bg-white/[0.06]" />
          <span className="text-[7px] font-mono text-slate-500/40">{SESSION_TIMELINE.totalEvents} events</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[6px] text-slate-500/35 uppercase tracking-wider">Session</span>
          <span className="text-[7px] font-mono text-red-400/65">{formatElapsed(elapsedSeconds)}</span>
        </div>
      </div>
    </div>
  )
}
