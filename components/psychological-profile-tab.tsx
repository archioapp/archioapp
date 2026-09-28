"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Activity,
  BookOpen,
  TrendingUp,
  Shield,
  Zap,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PsychologicalProfileTabProps {
  psychologyData?: {
    focus: number
    discipline: number
    biases: string[]
  }
}

// Professional animated gauge component
const AnimatedGauge = ({ value, label }: { value: number; label: string }) => {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (value / 10) * circumference
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      strokeDashoffset: offset,
      transition: { duration: 2, ease: "easeOut", delay: 0.5 },
    })
  }, [controls, offset])

  const getColor = () => {
    if (value >= 8) return "stroke-emerald-400"
    if (value >= 6) return "stroke-amber-400"
    return "stroke-red-400"
  }

  const getGlowColor = () => {
    if (value >= 8) return "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
    if (value >= 6) return "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
    return "drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]"
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle className="stroke-zinc-700/50" strokeWidth="6" cx="50" cy="50" r="45" fill="transparent" />
          <motion.circle
            className={cn("stroke-current", getColor(), getGlowColor())}
            strokeWidth="6"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={controls}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {value}
          </motion.div>
          <div className="text-xs text-zinc-400">/10</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-white">{label}</div>
      </div>
    </motion.div>
  )
}

// Lesson Popup Component
const LessonPopup = ({
  children,
  title,
  lessons,
  tips,
}: {
  children: React.ReactNode
  title: string
  lessons: string[]
  tips: string[]
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 top-full mt-2 w-80 p-4 bg-black/95 border border-purple-400/30 rounded-xl backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h4 className="font-semibold text-purple-400 text-sm">{title} Improvement</h4>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Key Lessons:
                </h5>
                <ul className="space-y-1">
                  {lessons.map((lesson, index) => (
                    <li key={index} className="text-xs text-white flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Practical Tips:
                </h5>
                <ul className="space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-xs text-white flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow pointer */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-black/95 border-l border-t border-purple-400/30 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Mental State Assessment
const MentalStateAssessment = ({ psychology }: { psychology: any }) => {
  const focusLessons = [
    "Practice single-tasking during market analysis to improve concentration",
    "Use the Pomodoro technique: 25 minutes focused analysis, 5 minute break",
    "Eliminate distractions during trading hours - phone, social media, news",
    "Develop pre-market routines to prime your mind for focused analysis",
  ]

  const focusTips = [
    "Start each session with 5 minutes of deep breathing",
    "Keep a trading journal to track focus levels throughout the day",
    "Use meditation apps like Headspace for 10 minutes daily",
    "Create a dedicated trading workspace free from distractions",
  ]

  const disciplineLessons = [
    "Stick to your trading plan regardless of market emotions",
    "Never risk more than your predetermined percentage per trade",
    "Wait for your setups - patience is a trader's greatest weapon",
    "Review and learn from both winning and losing trades equally",
  ]

  const disciplineTips = [
    "Set daily risk limits and stop trading when reached",
    "Use position sizing calculators to maintain consistency",
    "Create trading rules checklist and follow it religiously",
    "Practice saying 'no' to trades that don't meet your criteria",
  ]

  return (
    <motion.div
      className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        Mental State Assessment
      </h4>

      <div className="flex justify-around items-center mb-6">
        <LessonPopup title="Focus" lessons={focusLessons} tips={focusTips}>
          <div className="cursor-pointer">
            <AnimatedGauge value={psychology.focus} label="Focus" />
          </div>
        </LessonPopup>

        <LessonPopup title="Discipline" lessons={disciplineLessons} tips={disciplineTips}>
          <div className="cursor-pointer">
            <AnimatedGauge value={psychology.discipline} label="Discipline" />
          </div>
        </LessonPopup>
      </div>

      {/* Cognitive Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h5 className="font-semibold text-white flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            Cognitive Analysis
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Mental Clarity:</span>
              <span className="text-emerald-400 font-semibold">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Emotional Control:</span>
              <span className="text-amber-400 font-semibold">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Decision Confidence:</span>
              <span className="text-emerald-400 font-semibold">High</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h5 className="font-semibold text-white flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Performance Metrics
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Win Rate (30d):</span>
              <span className="text-emerald-400 font-semibold">73%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Avg R:R Ratio:</span>
              <span className="text-cyan-400 font-semibold">1:2.8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Risk Adherence:</span>
              <span className="text-emerald-400 font-semibold">95%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Detected Biases Component
const DetectedBiases = ({ biases }: { biases: string[] }) => {
  const biasDetails = {
    "Confirmation Bias": {
      description: "Tendency to search for information that confirms existing beliefs",
      impact: "May ignore contradictory signals",
      solution: "Actively seek opposing viewpoints and devil's advocate analysis",
    },
    Overconfidence: {
      description: "Excessive confidence in one's trading abilities or predictions",
      impact: "Risk taking larger positions or ignoring risk management",
      solution: "Keep detailed performance records and review losing trades regularly",
    },
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h4 className="font-semibold text-white flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        Detected Biases
      </h4>
      <div className="space-y-2">
        {biases.map((bias, index) => (
          <motion.div
            key={bias}
            className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ x: 2, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-red-300 text-sm">{bias}</span>
              <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">Active</span>
            </div>
            {biasDetails[bias as keyof typeof biasDetails] && (
              <div className="space-y-2 text-xs">
                <p className="text-white opacity-80">{biasDetails[bias as keyof typeof biasDetails].description}</p>
                <div className="flex items-start gap-2">
                  <Shield className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-amber-300">{biasDetails[bias as keyof typeof biasDetails].solution}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// AI Psychological Insights
const AIPsychologicalInsights = () => {
  return (
    <motion.div
      className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        AI Psychological Insights
      </h4>
      <div className="space-y-3 text-sm">
        <p className="text-white leading-relaxed">
          Your current psychological state shows strong analytical capabilities with well-controlled emotional
          responses. The high focus score indicates optimal conditions for complex decision-making.
        </p>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <h5 className="font-semibold text-emerald-400 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Recommendations:
          </h5>
          <ul className="space-y-1 text-xs text-white">
            <li>• Maintain current meditation and risk management practices</li>
            <li>• Consider position sizing review to address overconfidence bias</li>
            <li>• Continue journaling to track psychological patterns</li>
            <li>• Schedule regular performance reviews to maintain objectivity</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export function PsychologicalProfileTab({ psychologyData }: PsychologicalProfileTabProps) {
  const psychology = psychologyData || {
    focus: 8,
    discipline: 7,
    biases: ["Confirmation Bias", "Overconfidence"],
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Brain className="w-5 h-5 text-purple-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">Psychology</h3>
      </motion.div>

      {/* Mental State Assessment with Lessons */}
      <MentalStateAssessment psychology={psychology} />

      {/* Detected Biases */}
      <DetectedBiases biases={psychology.biases} />

      {/* AI Psychological Insights */}
      <AIPsychologicalInsights />
    </div>
  )
}
