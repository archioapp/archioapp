"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Target, Trophy, CheckCircle, MousePointer, Sparkles } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GuideStep {
  id: number
  title: string
  description: string
  image: string
  tips: string[]
  hoverDemo?: boolean
}

const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "Upload Your Chart Screenshot",
    description:
      "Start by uploading a high-quality screenshot of your trading chart. The AI system works best with clear, unobstructed chart images.",
    image: "/trading-chart-upload.png",
    tips: [
      "Use PNG or JPG format for best quality",
      "Ensure chart is clearly visible without overlays",
      "Include timeframe and instrument labels",
      "Avoid blurry or low-resolution images",
    ],
    hoverDemo: true,
  },
  {
    id: 2,
    title: "AI Analysis & Confluence Detection",
    description:
      "Our $177M AI system instantly analyzes your chart, detecting key confluences, market structure, and institutional levels.",
    image: "/ai-analysis-brain.png",
    tips: [
      "AI detects 50+ technical confluences automatically",
      "Institutional flow analysis included",
      "Market structure identification",
      "Risk-reward calculations provided",
    ],
  },
  {
    id: 3,
    title: "Review & Confirm Confluences",
    description:
      "Review the AI-detected confluences and add your personal analysis. This helps the community understand your trading thesis.",
    image: "/confluence-selection.png",
    tips: [
      "Confirm or modify AI suggestions",
      "Add your personal confluences",
      "Explain your market bias",
      "Include psychological state assessment",
    ],
  },
  {
    id: 4,
    title: "Community Feedback & Learning",
    description:
      "Share your forecast with the global trading community. Receive feedback from experienced traders and track your progress.",
    image: "/community-collaboration.png",
    tips: [
      "Get feedback from expert traders",
      "Track your accuracy over time",
      "Climb the community leaderboards",
      "Learn from other successful forecasts",
    ],
  },
]

interface ProfessionalGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfessionalGuideModal({ isOpen, onClose }: ProfessionalGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentGuideStep = guideSteps[currentStep]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="professional-guide-modal w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Particles */}
            <div className="floating-particles-177m" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Professional Trading Guide</h2>
                  <p className="text-purple-200">$177M Premium System Tutorial</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-300">
                  Step {currentStep + 1} of {guideSteps.length}
                </span>
                <span className="text-sm text-zinc-400">
                  {Math.round(((currentStep + 1) / guideSteps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Header */}
                  <div className="text-center space-y-2">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-3 py-1">
                      Step {currentGuideStep.id}
                    </Badge>
                    <h3 className="text-2xl font-bold text-white">{currentGuideStep.title}</h3>
                    <p className="text-zinc-300 max-w-2xl mx-auto leading-relaxed">{currentGuideStep.description}</p>
                  </div>

                  {/* Interactive Demo */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Image/Demo Section */}
                    <motion.div
                      className={cn(
                        "premium-hover-board guide-step-card p-4",
                        currentGuideStep.hoverDemo && "glassy-flash",
                      )}
                      onHoverStart={() => setIsHovering(true)}
                      onHoverEnd={() => setIsHovering(false)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-purple-500/20">
                        <Image
                          src={currentGuideStep.image || "/placeholder.svg"}
                          alt={currentGuideStep.title}
                          fill
                          className="object-cover"
                        />
                        {currentGuideStep.hoverDemo && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-black/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovering ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="text-center text-white">
                              <MousePointer className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                              <p className="text-sm font-medium">Hover to see interaction</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Tips Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" />
                        Pro Tips
                      </h4>
                      <div className="space-y-3">
                        {currentGuideStep.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-zinc-300">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-purple-500/20">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 disabled:opacity-50 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {guideSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentStep ? "bg-purple-400 w-6" : "bg-zinc-600 hover:bg-zinc-500",
                    )}
                  />
                ))}
              </div>

              {currentStep === guideSteps.length - 1 ? (
                <Button onClick={onClose} className="premium-glow-button bg-gradient-to-r from-purple-500 to-blue-500">
                  <Trophy className="w-4 h-4 mr-2" />
                  Start Trading
                </Button>
              ) : (
                <Button onClick={nextStep} className="premium-glow-button bg-gradient-to-r from-purple-500 to-blue-500">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
