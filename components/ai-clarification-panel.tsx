"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Send, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: string
}

export function AiClarificationPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm here to help clarify any part of your trading analysis. What would you like to understand better?",
      timestamp: "05:05 PM",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    "Why did my confluence analysis fail?",
    "How can I improve my entry timing?",
    "What's the best risk management approach?",
    "Explain the psychology behind this trade",
  ]

  const handleQuickQuestion = (question: string) => {
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "Why did my confluence analysis fail?":
          "Your confluence analysis showed good technical alignment, but market sentiment shifted due to unexpected news. Consider incorporating fundamental analysis alongside technical confluences for better context.",
        "How can I improve my entry timing?":
          "Focus on lower timeframe confirmations before entering. Wait for price action signals like engulfing candles or break of structure on 15M charts to confirm your higher timeframe bias.",
        "What's the best risk management approach?":
          "Use position sizing based on account percentage (1-2% risk per trade) rather than fixed lot sizes. Also consider scaling out at key levels to lock in profits while maintaining exposure.",
        "Explain the psychology behind this trade":
          "This trade shows good analytical discipline but some overconfidence bias. The large position size suggests emotional attachment to the setup. Consider reducing size when confidence is high.",
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content:
          responses[question as keyof typeof responses] ||
          "I'd be happy to help with that. Can you provide more specific details?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content:
          "That's an excellent question! Based on your analysis, I can see several factors that contributed to this outcome. Let me break it down for you with specific recommendations for improvement.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Brain className="w-5 h-5 text-purple-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">AI Clarification</h3>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-48">
        {messages.map((message) => (
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

      {/* Quick Questions */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          Quick Questions
        </h4>
        {quickQuestions.map((question, index) => (
          <motion.button
            key={question}
            onClick={() => handleQuickQuestion(question)}
            className="w-full p-2 text-left bg-black/40 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all duration-300 text-white text-xs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 2, scale: 1.02 }}
          >
            {question}
          </motion.button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 p-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
        />
        <motion.button
          onClick={handleSendMessage}
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
