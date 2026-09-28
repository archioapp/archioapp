"use client"

import { BrainCircuit, Target, Droplets, PlayCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AICoPilot() {
  return (
    <div className="p-4 border-t border-zinc-800 mt-auto bg-matte-black/50 rounded-b-xl">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-luxury-gold" />
        <h5 className="text-md font-bold text-white">AI Co-Pilot</h5>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:border-luxury-gold/50 text-zinc-300 hover:text-white transition-all justify-start text-xs h-10"
        >
          <Target className="w-4 h-4 mr-2 text-luxury-gold" />
          Analyze Entry
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:border-luxury-gold/50 text-zinc-300 hover:text-white transition-all justify-start text-xs h-10"
        >
          <Droplets className="w-4 h-4 mr-2 text-luxury-gold" />
          Scan Liquidity
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:border-luxury-gold/50 text-zinc-300 hover:text-white transition-all justify-start text-xs h-10"
        >
          <PlayCircle className="w-4 h-4 mr-2 text-luxury-gold" />
          Simulate Trade
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:border-luxury-gold/50 text-zinc-300 hover:text-white transition-all justify-start text-xs h-10"
        >
          <BrainCircuit className="w-4 h-4 mr-2 text-luxury-gold" />
          Check Sentiment
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask a follow-up question..."
          className="bg-zinc-800/50 border-zinc-700 focus:border-luxury-gold text-white h-9 text-sm"
        />
        <Button size="icon" className="bg-luxury-gold hover:bg-amber-300 text-matte-black flex-shrink-0 h-9 w-9">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
