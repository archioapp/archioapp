"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Lightbulb, Clock, Shield, Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeyInsightsPanelProps {
  forecast: any
}

// Insight Card with Hover Popup
const InsightCard = ({
  title,
  description,
  icon: Icon,
  color,
  hoverContent,
  delay = 0,
}: {
  title: string
  description: string
  icon: React.ElementType
  color: string
  hoverContent: {
    title: string
    details: string[]
    impact: string
  }
  delay?: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        className={cn(
          "p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105",
          color === "emerald"
            ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
            : color === "purple"
              ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
              : "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20",
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className={cn(
              "p-2 rounded-lg",
              color === "emerald" ? "bg-emerald-500/20" : color === "purple" ? "bg-purple-500/20" : "bg-cyan-500/20",
            )}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Icon
              className={cn(
                "w-5 h-5",
                color === "emerald" ? "text-emerald-400" : color === "purple" ? "text-purple-400" : "text-cyan-400",
              )}
            />
          </motion.div>
          <div className="flex-1">
            <h4
              className={cn(
                "font-semibold mb-2",
                color === "emerald" ? "text-emerald-300" : color === "purple" ? "text-purple-300" : "text-cyan-300",
              )}
            >
              {title}
            </h4>
            <p className="text-white text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </motion.div>

      {/* Hover Popup */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 top-full mt-2 w-80 p-4 bg-black/95 border border-white/20 rounded-xl backdrop-blur-xl shadow-2xl"
          >
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              {hoverContent.title}
            </h4>

            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-semibold text-emerald-400 mb-2">Key Details:</h5>
                <ul className="space-y-1">
                  {hoverContent.details.map((detail, index) => (
                    <li key={index} className="text-xs text-white flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h5 className="text-xs font-semibold text-purple-400 mb-1">Impact:</h5>
                <p className="text-xs text-white">{hoverContent.impact}</p>
              </div>
            </div>

            {/* Arrow pointer */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-black/95 border-l border-t border-white/20 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// AI Assistant Component
const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai" as const,
      content:
        "Hello! I'm here to help clarify any part of your trading analysis. What would you like to understand better?",
      timestamp: "05:05 PM",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    "Why was my entry timing off?",
    "Explain the DXY confluence again.",
    "What's a better stop loss strategy?",
    "How can I improve my risk management?",
  ]

  const handleQuickQuestion = (question: string) => {
    const newUserMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "Why was my entry timing off?":
          "Your entry was slightly early based on the confluence analysis. The Fair Value Gap hadn't fully formed when you entered, which reduced the probability of immediate price reaction. Consider waiting for LTF confirmation next time.",
        "Explain the DXY confluence again.":
          "The DXY showed bearish divergence at the 104.50 resistance level, coinciding with your EURUSD long bias. This created a favorable correlation setup, as DXY weakness typically supports EUR strength.",
        "What's a better stop loss strategy?":
          "Consider using a dynamic stop loss based on ATR (Average True Range) rather than fixed pips. This adapts to market volatility and reduces the chance of being stopped out by normal market noise.",
        "How can I improve my risk management?":
          "Focus on position sizing based on account percentage rather than fixed lot sizes. Also, consider scaling out of positions at key levels to lock in profits while maintaining exposure to larger moves.",
      }

      const aiResponse = {
        id: messages.length + 2,
        type: "ai" as const,
        content:
          responses[question as keyof typeof responses] ||
          "I'd be happy to help with that. Can you provide more specific details about what you'd like me to clarify?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newUserMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai" as const,
        content:
          "That's a great question! Based on your analysis, I can see several factors that contributed to this outcome. Let me break it down for you with specific recommendations.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* AI Assistant Header */}
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Brain className="w-5 h-5 text-purple-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">AI Assistant</h3>
      </div>

      {/* Clarification Box */}
      <motion.div
        className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Ask me to clarify any part of this analysis</h4>
            <p className="text-zinc-400 text-sm">
              I can help explain confluences, risk management, or trading psychology
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Questions */}
      <div className="space-y-2">
        {quickQuestions.map((question, index) => (
          <motion.button
            key={question}
            onClick={() => handleQuickQuestion(question)}
            className="w-full p-3 text-left bg-black/40 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all duration-300 text-white text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ x: 2, scale: 1.02 }}
          >
            {question}
          </motion.button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 max-h-40 overflow-y-auto">
        {messages.slice(-3).map((message) => (
          <motion.div
            key={message.id}
            className={cn(
              "p-3 rounded-lg text-sm",
              message.type === "ai"
                ? "bg-purple-500/10 border border-purple-500/30 text-white"
                : "bg-blue-500/10 border border-blue-500/30 text-white ml-4",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2">
              {message.type === "ai" && <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />}
              <div className="flex-1">
                <p className="leading-relaxed">{message.content}</p>
                <span className="text-xs text-zinc-400 mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                  />
                </div>
                <span className="text-white">AI is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 p-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
        <motion.button
          onClick={handleSendMessage}
          className="p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export function KeyInsightsPanel({ forecast }: KeyInsightsPanelProps) {
  const insights = [
    {
      title: "Strong Confluence Alignment",
      description: "Multiple technical factors converge at your entry level, increasing probability of success.",
      icon: Shield,
      color: "emerald",
      hoverContent: {
        title: "Confluence Analysis Details",
        details: [
          "Fair Value Gap (FVG) at 1.0850 level provides institutional interest",
          "Order Block confluence from previous session's high",
          "Liquidity sweep setup below recent lows",
          "Weekly pivot level alignment with entry zone",
          "BPR (Broken Previous Resistance) now acting as support",
        ],
        impact:
          "This confluence increases the probability of price reaction at your entry level by approximately 73%, based on historical backtesting of similar setups.",
      },
    },
    {
      title: "Psychological Readiness",
      description: "Your mental state shows good focus but watch for overconfidence bias affecting position sizing.",
      icon: Brain,
      color: "purple",
      hoverContent: {
        title: "Psychology Assessment",
        details: [
          "Focus score of 8/10 indicates optimal analytical state",
          "Discipline rating of 7/10 shows room for improvement",
          "Confirmation bias detected in analysis approach",
          "Overconfidence may lead to larger position sizes",
          "Emotional control remains stable under pressure",
        ],
        impact:
          "Current psychological state supports good decision-making, but position sizing should be reduced by 20% to account for overconfidence bias.",
      },
    },
    {
      title: "Optimal Timing",
      description: "Entry during London/NY overlap provides best liquidity and institutional participation.",
      icon: Clock,
      color: "cyan",
      hoverContent: {
        title: "Market Timing Analysis",
        details: [
          "London/NY overlap (8:00-12:00 EST) shows highest volume",
          "Institutional order flow most active during this period",
          "Spread costs reduced due to increased liquidity",
          "News impact minimized outside major announcement times",
          "Historical win rate 15% higher during this session",
        ],
        impact:
          "Trading during optimal hours increases success probability and reduces execution costs by an average of 0.8 pips per trade.",
      },
    },
  ]

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Key Insights Header */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">Key Insights</h3>
      </motion.div>

      {/* Insight Cards */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.title}
            title={insight.title}
            description={insight.description}
            icon={insight.icon}
            color={insight.color}
            hoverContent={insight.hoverContent}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}
