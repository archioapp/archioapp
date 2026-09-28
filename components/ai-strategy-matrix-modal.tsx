"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Send, X, BookOpen, BarChart, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Scenario } from "@/lib/analysis-data"

interface AIStrategyMatrixModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  scenario: Scenario | null
}

const suggestedQuestions = [
  "What are the primary risks for this setup?",
  "Show me historical examples of this scenario playing out.",
  "Explain the entry trigger confirmation in more detail.",
  "What specific market conditions would invalidate this scenario?",
]

export function AIStrategyMatrixModal({ isOpen, onOpenChange, scenario }: AIStrategyMatrixModalProps) {
  const [chatMessages, setChatMessages] = useState([{ from: "ai", text: "How can I help you analyze this scenario?" }])
  const [userInput, setUserInput] = useState("")

  if (!scenario) return null

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return
    sendMessage(userInput)
  }

  const sendMessage = (text: string) => {
    const newMessages = [...chatMessages, { from: "user", text }]
    // Dummy AI response for demonstration
    setTimeout(() => {
      const aiResponse = {
        from: "ai",
        text: `Regarding '${text}', the key is to observe the reaction at the ${scenario.level} level. A strong rejection or acceptance on the M15 timeframe is your primary confirmation signal. This aligns with the broader institutional flow we're tracking.`,
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 500)
    setChatMessages(newMessages)
    setUserInput("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50"
          />
          <DialogContent className="max-w-6xl w-full bg-slate-grey/95 border border-zinc-700 text-white p-0 shadow-2xl shadow-black/50 rounded-2xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="p-6 border-b border-zinc-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{scenario.title}</h2>
                    <p className="text-slate-400 text-lg">{scenario.subtitle}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="text-slate-400 hover:text-white absolute top-4 right-4"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {/* Left Column: Details */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <BarChart className="w-6 h-6 text-luxury-gold" />
                      Parameter Matrix
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-base">
                      <div>
                        <span className="text-slate-400">Level:</span>
                        <p className="font-mono text-white text-lg">{scenario.level}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">R/R Potential:</span>
                        <p className="font-mono text-white text-lg">{scenario.rr}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Recent Tests:</span>
                        <p className="font-mono text-white text-lg">{scenario.tests}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Last Occurence:</span>
                        <p className="font-mono text-white text-lg">{scenario.last}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <span className="text-slate-400 text-base">AI Confidence Score:</span>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="w-full bg-zinc-800 rounded-full h-3">
                          <motion.div
                            className="bg-luxury-gold h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${scenario.confidence}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <span className="font-bold text-xl text-luxury-gold">{scenario.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-luxury-gold" />
                      Scenario Playbook
                    </h3>
                    <ul className="space-y-3 text-base list-disc list-inside text-slate-300">
                      {scenario.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-luxury-gold" />
                      Invalidation Conditions
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-base">
                      {scenario.invalidation ||
                        "A strong 15-minute candle close outside of the specified level would invalidate this setup. Watch for opposing high-impact news."}
                    </p>
                  </div>
                </div>

                {/* Right Column: AI Clarification */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 flex flex-col h-[75vh]">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-luxury-gold" />
                    AI Strategy Drill-Down
                  </h3>
                  <div className="flex-grow overflow-y-auto space-y-6 p-4 bg-slate-grey rounded-md mb-4 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-start gap-3 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.from === "ai" && (
                          <div className="w-9 h-9 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 flex-shrink-0 shadow-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-luxury-gold" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] p-4 rounded-xl text-base leading-relaxed ${msg.from === "ai" ? "bg-zinc-800" : "bg-blue-600"}`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-2 mb-4">
                    {suggestedQuestions.map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        className="w-full text-left justify-start text-sm bg-zinc-800/70 border-zinc-700 hover:bg-zinc-800 hover:border-luxury-gold/50 text-slate-300 transition-all duration-200"
                        onClick={() => sendMessage(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex gap-3 mt-auto">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ask a follow-up question..."
                      className="bg-zinc-800 border-zinc-700 focus:border-luxury-gold/50 text-base h-12"
                    />
                    <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-12 w-12">
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
