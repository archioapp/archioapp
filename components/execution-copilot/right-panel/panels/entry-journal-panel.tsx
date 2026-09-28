"use client"

import { useState } from "react"
import { Mic, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function EntryJournalPanel() {
  const [isListening, setIsListening] = useState(false)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <h4 className="font-bold text-white">Entry Journal</h4>
        <p className="text-xs text-zinc-400">Record your thesis. Voice or text.</p>
      </div>
      <div className="flex-grow p-4 flex flex-col space-y-4">
        <Textarea
          placeholder="Why are you taking this trade? What is your edge?"
          className="flex-grow bg-zinc-800/50 border-zinc-700 text-zinc-300 resize-none focus:border-luxury-gold"
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsListening(!isListening)}
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
          >
            <Mic className={`w-4 h-4 transition-colors ${isListening ? "text-red-500 animate-pulse" : ""}`} />
          </Button>
          <Button className="w-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
            <Send className="w-4 h-4 mr-2" />
            Save Journal Entry
          </Button>
        </div>
      </div>
    </div>
  )
}
