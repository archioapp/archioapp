"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   <MyFitAnalysisTemplate />

   Discover which ecosystem matches your trading style. Answer 5 quick 
   questions about how you trade, and we rank every community by fit score.
   Process over prediction.

   Decision enabled: "Based on how I actually trade, which ecosystem is 
   the best match?"

   Value system applied:
   1. What decision does this help them make? → Which ecosystem fits my style
   2. What evidence does it show? → Fit scores based on trading preferences
   3. What action does it enable? → Explore recommended ecosystems
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react"

import { VANTARY, EASE_V } from "../../vantary-theme"
import {
  MOCK_COMMUNITIES,
  type Community,
} from "../communities-source"
import {
  FdCorners,
  FdDashedRule,
  FdRouteId,
} from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"

/* ── Types ─────────────────────────────────────────────────────────── */

interface ProfileQuestion {
  id: string
  question: string
  description: string
  icon: React.ElementType
  options: {
    value: string
    label: string
    description: string
  }[]
}

interface UserProfile {
  tradingStyle: string
  timeframe: string
  riskTolerance: string
  learningStyle: string
  sessionPreference: string
}

/* ── Questions ─────────────────────────────────────────────────────── */

const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: "tradingStyle",
    question: "What's your trading style?",
    description: "How you approach entries and exits",
    icon: Target,
    options: [
      { value: "scalping", label: "Scalping", description: "Quick trades, small gains, high volume" },
      { value: "day_trading", label: "Day Trading", description: "Intraday positions, close by end of day" },
      { value: "swing", label: "Swing Trading", description: "Hold for days to weeks" },
      { value: "mixed", label: "Mixed / Learning", description: "Still developing my approach" },
    ],
  },
  {
    id: "timeframe",
    question: "How much time can you dedicate daily?",
    description: "Your availability for active trading and learning",
    icon: Clock,
    options: [
      { value: "full", label: "Full-time", description: "4+ hours per day, trading is my focus" },
      { value: "part", label: "Part-time", description: "1-4 hours daily around other commitments" },
      { value: "casual", label: "Casual", description: "Less than 1 hour daily, checking in briefly" },
      { value: "weekend", label: "Weekend Warrior", description: "Mostly weekends, occasional weekday trades" },
    ],
  },
  {
    id: "riskTolerance",
    question: "What's your risk tolerance?",
    description: "How you handle drawdowns and position sizing",
    icon: Zap,
    options: [
      { value: "conservative", label: "Conservative", description: "Protect capital, small positions, tight stops" },
      { value: "moderate", label: "Moderate", description: "Balanced approach, standard position sizing" },
      { value: "aggressive", label: "Aggressive", description: "Higher risk for higher reward potential" },
      { value: "learning", label: "Still Learning", description: "Figuring out my risk comfort zone" },
    ],
  },
  {
    id: "learningStyle",
    question: "How do you learn best?",
    description: "Your preferred way to absorb trading knowledge",
    icon: TrendingUp,
    options: [
      { value: "live", label: "Live Calls", description: "Watch mentors trade in real-time" },
      { value: "recorded", label: "Recorded Content", description: "Learn at my own pace with replays" },
      { value: "ai", label: "AI + Async", description: "Get answers anytime from AI mentors" },
      { value: "community", label: "Peer Discussion", description: "Learn through community interaction" },
    ],
  },
  {
    id: "sessionPreference",
    question: "Which market session fits you best?",
    description: "When you're most likely to be active",
    icon: Activity,
    options: [
      { value: "asia", label: "Asia Session", description: "Tokyo, Sydney, Singapore hours" },
      { value: "london", label: "London Session", description: "European market hours" },
      { value: "new_york", label: "New York Session", description: "US market hours" },
      { value: "multi_session", label: "Multiple Sessions", description: "Flexible across time zones" },
    ],
  },
]

/* ── Fit Scoring Logic ─────────────────────────────────────────────── */

function calculateFitScore(community: Community, profile: UserProfile): number {
  let score = 0
  let maxScore = 0

  // Trading style match (30 points)
  maxScore += 30
  if (community.tradingStyle === profile.tradingStyle) score += 30
  else if (profile.tradingStyle === "mixed" || community.tradingStyle === "mixed") score += 15

  // Learning style match (25 points)
  maxScore += 25
  if (profile.learningStyle === "live" && community.hasLiveCalls) score += 25
  else if (profile.learningStyle === "ai" && community.hasArchioAi) score += 25
  else if (profile.learningStyle === "recorded" && !community.hasLiveCalls) score += 20
  else if (profile.learningStyle === "community") score += 15 // All communities have this

  // Session preference match (20 points)
  maxScore += 20
  if (community.sessionFocus === profile.sessionPreference) score += 20
  else if (profile.sessionPreference === "multi_session" || community.sessionFocus === "multi_session") score += 12

  // Time commitment alignment (15 points)
  maxScore += 15
  if (profile.timeframe === "full" && community.signalsPerWeek >= 50) score += 15
  else if (profile.timeframe === "part" && community.signalsPerWeek >= 30) score += 15
  else if (profile.timeframe === "casual" && community.signalsPerWeek <= 40) score += 12
  else if (profile.timeframe === "weekend") score += 8

  // Risk tolerance alignment (10 points)
  maxScore += 10
  if (profile.riskTolerance === "conservative" && community.avgR <= 2) score += 10
  else if (profile.riskTolerance === "moderate") score += 8
  else if (profile.riskTolerance === "aggressive" && community.avgR >= 2) score += 10
  else if (profile.riskTolerance === "learning" && community.beginnerFriendly) score += 10

  return Math.round((score / maxScore) * 100)
}

function rankCommunities(profile: UserProfile): { community: Community; fitScore: number }[] {
  return MOCK_COMMUNITIES
    .map((c) => ({
      community: c,
      fitScore: calculateFitScore(c, profile),
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
}

/* ── Component ─────────────────────────────────────────────────────── */

export interface MyFitAnalysisTemplateProps {
  onClose?: () => void
  onPin?: () => void
  pinned?: boolean
}

export function MyFitAnalysisTemplate({
  onClose,
  onPin,
  pinned = false,
}: MyFitAnalysisTemplateProps) {
  const [step, setStep] = React.useState(0)
  const [profile, setProfile] = React.useState<Partial<UserProfile>>({})
  const [showResults, setShowResults] = React.useState(false)

  const currentQuestion = PROFILE_QUESTIONS[step]
  const totalQuestions = PROFILE_QUESTIONS.length
  const progress = ((step + 1) / totalQuestions) * 100

  const isComplete = Object.keys(profile).length === totalQuestions

  const results = React.useMemo(() => {
    if (!isComplete) return []
    return rankCommunities(profile as UserProfile)
  }, [profile, isComplete])

  const handleAnswer = (questionId: string, value: string) => {
    setProfile((prev) => ({ ...prev, [questionId]: value }))
    
    if (step < totalQuestions - 1) {
      setTimeout(() => setStep(step + 1), 300)
    } else {
      setTimeout(() => setShowResults(true), 300)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleReset = () => {
    setProfile({})
    setStep(0)
    setShowResults(false)
  }

  const drillers: DrillForwardSuggestion[] = React.useMemo(() => {
    if (!showResults || results.length === 0) return []
    return [
      {
        id: "drill.explore-top",
        routeId: "D01",
        label: `Explore ${results[0]?.community.name}`,
        hint: "View full profile of your top match",
        urgency: "high",
      },
      {
        id: "drill.compare-top-3",
        routeId: "D02",
        label: "Compare top 3 matches",
        hint: "Side-by-side comparison of your best fits",
        urgency: "high",
      },
      {
        id: "drill.retake",
        routeId: "D03",
        label: "Retake profiler",
        hint: "Adjust your answers and see new results",
        urgency: "low",
      },
    ]
  }, [showResults, results])

  return (
    <TemplateShell
      id="collective.my-fit"
      eyebrow="THE COLLECTIVE · FIT ANALYSIS · LIVE"
      routeId="C-FIT"
      headline="My Fit Analysis"
      subheadline={
        showResults
          ? `Found ${results.length} ecosystems ranked by fit`
          : `Question ${step + 1} of ${totalQuestions}`
      }
      prelude={
        <span>
          Answer 5 quick questions about your trading style. We&apos;ll rank every
          ecosystem by{" "}
          <span style={{ color: VANTARY.amber }}>fit score</span> — the higher
          the score, the better the match.
        </span>
      }
      inputs={
        !showResults ? (
          <div className="flex flex-col gap-4">
            {/* Progress bar */}
            <div className="flex items-center gap-4">
              <div
                className="flex-1 h-1 rounded-full overflow-hidden"
                style={{ background: VANTARY.rule }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: EASE_V }}
                  className="h-full rounded-full"
                  style={{ background: VANTARY.amber }}
                />
              </div>
              <span
                className="text-xs font-mono"
                style={{ color: VANTARY.ash }}
              >
                {step + 1}/{totalQuestions}
              </span>
            </div>

            {/* Back button */}
            {step > 0 && (
              <motion.button
                type="button"
                onClick={handleBack}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-xs self-start"
                style={{ color: VANTARY.ashSoft }}
              >
                <ChevronLeft size={14} />
                Previous question
              </motion.button>
            )}
          </div>
        ) : null
      }
      resolver={
        showResults && results.length > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: VANTARY.amberWash, border: `1px solid ${VANTARY.amber}` }}
              >
                <Sparkles size={14} color={VANTARY.amber} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: VANTARY.paper }}>
                  Best Match: {results[0]?.community.name}
                </div>
                <div className="text-xs" style={{ color: VANTARY.ash }}>
                  {results[0]?.fitScore}% fit score
                </div>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{
                background: "transparent",
                border: `1px solid ${VANTARY.rule}`,
                color: VANTARY.ash,
              }}
            >
              <RotateCcw size={12} />
              Retake
            </motion.button>
          </div>
        ) : null
      }
      renderPlan={
        showResults ? (
          <ResultsView results={results} />
        ) : (
          <QuestionView
            question={currentQuestion!}
            selectedValue={profile[currentQuestion!.id as keyof UserProfile]}
            onSelect={(value) => handleAnswer(currentQuestion!.id, value)}
          />
        )
      }
      drillForward={drillers}
      onClose={onClose}
      onPin={onPin}
      state="ready"
    />
  )
}

/* ── Subcomponents ─────────────────────────────────────────────────── */

function QuestionView({
  question,
  selectedValue,
  onSelect,
}: {
  question: ProfileQuestion
  selectedValue?: string
  onSelect: (value: string) => void
}) {
  const Icon = question.icon

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: EASE_V }}
      className="flex flex-col gap-6"
    >
      {/* Question header */}
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: VANTARY.amberWash,
            border: `1px solid ${VANTARY.amber}`,
          }}
        >
          <Icon size={20} color={VANTARY.amber} />
        </div>
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: VANTARY.paper }}
          >
            {question.question}
          </h3>
          <p
            className="text-sm mt-1"
            style={{ color: VANTARY.ash }}
          >
            {question.description}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, idx) => (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, ease: EASE_V }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-xl text-left transition-all"
            style={{
              background: selectedValue === option.value
                ? VANTARY.amberWash
                : "rgba(255,255,255,0.02)",
              border: `1px solid ${selectedValue === option.value ? VANTARY.amber : VANTARY.rule}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: selectedValue === option.value ? VANTARY.amber : "transparent",
                  border: `2px solid ${selectedValue === option.value ? VANTARY.amber : VANTARY.rule}`,
                }}
              >
                {selectedValue === option.value && (
                  <Check size={12} color={VANTARY.ink} strokeWidth={3} />
                )}
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ color: selectedValue === option.value ? VANTARY.amber : VANTARY.paper }}
                >
                  {option.label}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: VANTARY.ash }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ResultsView({
  results,
}: {
  results: { community: Community; fitScore: number }[]
}) {
  const top3 = results.slice(0, 3)
  const remaining = results.slice(3)

  return (
    <div className="flex flex-col gap-6">
      {/* Top 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {top3.map((result, idx) => (
          <motion.div
            key={result.community.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, ease: EASE_V }}
            className="p-4 rounded-xl relative overflow-hidden"
            style={{
              background: idx === 0 ? VANTARY.amberWash : "rgba(255,255,255,0.02)",
              border: `1px solid ${idx === 0 ? VANTARY.amber : VANTARY.rule}`,
            }}
          >
            {/* Rank badge */}
            <div
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: idx === 0 ? VANTARY.amber : "rgba(255,255,255,0.05)",
                color: idx === 0 ? VANTARY.ink : VANTARY.ash,
              }}
            >
              #{idx + 1}
            </div>

            {/* Fit score */}
            <div className="mb-3">
              <div
                className="text-2xl font-bold font-mono"
                style={{ color: idx === 0 ? VANTARY.amber : VANTARY.paper }}
              >
                {result.fitScore}%
              </div>
              <div
                className="text-[10px] uppercase tracking-wide"
                style={{ color: VANTARY.ashSoft }}
              >
                Fit Score
              </div>
            </div>

            {/* Community info */}
            <div
              className="text-sm font-bold mb-1"
              style={{ color: VANTARY.paper }}
            >
              {result.community.name}
            </div>
            <div
              className="text-xs flex items-center gap-2"
              style={{ color: VANTARY.ash }}
            >
              <span>{result.community.winRate}% win</span>
              <span>{result.community.avgR}R</span>
            </div>

            {/* Key features */}
            <div className="flex flex-wrap gap-1 mt-3">
              {result.community.hasArchioAi && (
                <span
                  className="px-2 py-0.5 rounded text-[9px] uppercase"
                  style={{
                    background: "rgba(227,165,69,0.1)",
                    color: VANTARY.amber,
                  }}
                >
                  AI
                </span>
              )}
              {result.community.hasLiveCalls && (
                <span
                  className="px-2 py-0.5 rounded text-[9px] uppercase"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: VANTARY.ash,
                  }}
                >
                  Live
                </span>
              )}
              {result.community.verified && (
                <span
                  className="px-2 py-0.5 rounded text-[9px] uppercase"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: VANTARY.ash,
                  }}
                >
                  Verified
                </span>
              )}
            </div>

            {/* CTA */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              style={{
                background: idx === 0 ? VANTARY.amber : "transparent",
                border: idx === 0 ? "none" : `1px solid ${VANTARY.rule}`,
                color: idx === 0 ? VANTARY.ink : VANTARY.paper,
              }}
            >
              Explore
              <ArrowRight size={12} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Remaining results */}
      {remaining.length > 0 && (
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.01)",
            border: `1px solid ${VANTARY.rule}`,
          }}
        >
          <div
            className="text-xs font-mono uppercase tracking-wide mb-3"
            style={{ color: VANTARY.ashSoft }}
          >
            Other Matches
          </div>
          <div className="flex flex-col gap-2">
            {remaining.map((result) => (
              <div
                key={result.community.slug}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-mono font-bold"
                    style={{ color: VANTARY.paper }}
                  >
                    {result.fitScore}%
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: VANTARY.ash }}
                  >
                    {result.community.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: VANTARY.ashSoft }}>
                  <span>{result.community.winRate}%</span>
                  <span>{result.community.avgR}R</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyFitAnalysisTemplate
