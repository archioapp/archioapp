"use client"

import type React from "react"
import { useState, useRef, useEffect, type FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, Smile, TrendingUp, Shield, HelpCircle, Frown, Meh } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TradeState, Message } from "../types"
import { cn } from "@/lib/utils"

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Entry confirmed at 1.2705. Monitoring price action... Minor rejection at the 5-min order block. This is expected.",
  },
  {
    id: 2,
    sender: "ai",
    text: "Momentum is building. Volume profile shows accumulation. Keep an eye on the 1.2750 level for initial resistance.",
  },
]

const TacticalActionButton: FC<{ icon: React.ElementType; label: string; onClick: () => void; className?: string }> = ({
  icon: Icon,
  label,
  onClick,
  className,
}) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={onClick}
          className={cn(
            "p-2 rounded-full bg-zinc-800/50 hover:bg-luxury-gold/20 text-zinc-400 hover:text-luxury-gold transition-all duration-200",
            className,
          )}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon className="w-5 h-5" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-slate-900 text-white border-zinc-700">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export function LiveCommentary({ tradeState }: { tradeState: TradeState }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div")
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  const addMessage = (sender: "user" | "ai", text: string) => {
    const newMessage: Message = { id: Date.now(), sender, text }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSend = () => {
    if (input.trim() === "") return
    addMessage("user", input)
    setTimeout(() => {
      addMessage("ai", "Acknowledged. I'm scanning for any changes in market structure or order flow.")
    }, 800)
    setInput("")
  }

  const handleTacticalAction = (action: string, aiResponse: string) => {
    addMessage("user", `[Action]: ${action}`)
    setTimeout(() => {
      addMessage("ai", aiResponse)
    }, 800)
  }

  return (
    <div className="h-full flex flex-col bg-zinc-900/30">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-white">Live AI Terminal</h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Trade Active</span>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          {tradeState.pair} Long @ {tradeState.entry}
        </p>
      </div>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-luxury-gold to-metallic-bronze flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-900" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[85%] text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-luxury-gold/10 text-white rounded-br-none border border-luxury-gold/20"
                    : "bg-zinc-800 text-zinc-300 rounded-bl-none border border-zinc-700"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="p-4 border-t border-zinc-800 bg-slate-900/50"
      >
        <AnimatePresence>
          {isHovered ? (
            <motion.div
              key="controls"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-around mb-4">
                <TacticalActionButton
                  icon={TrendingUp}
                  label="Trade Management"
                  onClick={() =>
                    handleTacticalAction(
                      "Query: Trade Management Options",
                      "You can scale out, move SL to BE, or trail your stop. Which action would you like to analyze?",
                    )
                  }
                />
                <TacticalActionButton
                  icon={Shield}
                  label="Real-Time Risk Scan"
                  onClick={() =>
                    handleTacticalAction(
                      "Execute: Real-Time Risk Scan",
                      "Scanning... Spread is normal at 1.1 pips. No immediate high-impact news. DXY correlation remains positive. Risk profile is currently low.",
                    )
                  }
                />
                <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-full">
                  <TacticalActionButton
                    icon={Smile}
                    label="Log Emotion: Confident"
                    onClick={() =>
                      handleTacticalAction("Log Emotion: Confident", "Emotion logged. Confidence is high.")
                    }
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400"
                  />
                  <TacticalActionButton
                    icon={Meh}
                    label="Log Emotion: Neutral"
                    onClick={() =>
                      handleTacticalAction("Log Emotion: Neutral", "Emotion logged. Maintaining neutrality.")
                    }
                    className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                  />
                  <TacticalActionButton
                    icon={Frown}
                    label="Log Emotion: Anxious"
                    onClick={() =>
                      handleTacticalAction(
                        "Log Emotion: Anxious",
                        "Emotion logged. Acknowledging anxiety is the first step to managing it.",
                      )
                    }
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  />
                </div>
                <TacticalActionButton
                  icon={HelpCircle}
                  label="Request Second Opinion"
                  onClick={() =>
                    handleTacticalAction(
                      "Query: Second Opinion",
                      "My analysis suggests the current price action is a healthy consolidation. The primary bullish structure remains intact above 1.2700. A break of that level would warrant a reassessment.",
                    )
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Message your Co-Pilot..."
                  className="bg-zinc-800/50 border-zinc-700 focus:border-luxury-gold text-white h-10 text-sm"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-luxury-gold hover:bg-amber-300 text-matte-black flex-shrink-0 h-10 w-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-zinc-500"
            >
              Hover to interact with your Co-Pilot
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
