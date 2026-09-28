"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, BrainCircuit } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TradeState, Message } from "./types"

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Setup looks solid with an 82% score. DXY is showing weakness, which supports a GBP/USD long. I'm ready when you are.",
  },
]

const liveMessages: Message[] = [
  {
    id: 2,
    sender: "ai",
    text: "Entry confirmed. Monitoring price action... Minor rejection at the 5-min order block. This is expected.",
  },
  {
    id: 3,
    sender: "ai",
    text: "Momentum is building. Volume profile shows accumulation. Keep an eye on the 1.3280 level for initial resistance.",
  },
]

interface CopilotAiTerminalProps {
  tradeState: TradeState
}

export function CopilotAiTerminal({ tradeState }: CopilotAiTerminalProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  useEffect(() => {
    if (tradeState.status === "live" && messages.length === 1) {
      setMessages((prev) => [...prev, ...liveMessages])
    } else if (tradeState.status === "stalking") {
      setMessages(initialMessages)
    }
  }, [tradeState.status, messages.length])

  const handleSend = () => {
    if (input.trim() === "") return
    const userMessage: Message = { id: Date.now(), sender: "user", text: input }
    const aiResponse: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "Acknowledged. I'm scanning for any changes in market structure or order flow.",
    }
    setMessages([...messages, userMessage, aiResponse])
    setInput("")
  }

  return (
    <div className="p-4 border-t border-zinc-800 mt-auto bg-matte-black/50 rounded-b-l-xl">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-luxury-gold" />
        <h5 className="text-md font-bold text-white">AI Terminal</h5>
      </div>
      <ScrollArea className="h-48 mb-4 p-3 bg-matte-black/70 rounded-lg border border-zinc-800">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}>
              {msg.sender === "ai" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-luxury-gold to-metallic-bronze flex-shrink-0" />
              )}
              <div
                className={`p-2 rounded-lg max-w-[85%] text-sm ${
                  msg.sender === "user"
                    ? "bg-luxury-gold/10 text-white rounded-br-none"
                    : "bg-zinc-800 text-zinc-300 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Message your Co-Pilot..."
          className="bg-zinc-800/50 border-zinc-700 focus:border-luxury-gold text-white h-9 text-sm"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="bg-luxury-gold hover:bg-amber-300 text-matte-black flex-shrink-0 h-9 w-9"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
