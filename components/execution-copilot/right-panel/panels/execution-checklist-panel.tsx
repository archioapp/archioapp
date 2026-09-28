"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const checklistItems = [
  "Higher Timeframe Bias Confirmed",
  "Valid Entry Model Identified",
  "Risk/Reward Ratio > 2:1",
  "Key News Events Checked",
  "Psychological State Assessed",
  "DXY Correlation Considered",
]

export function ExecutionChecklistPanel({ onPlaceTrade }: { onPlaceTrade: () => void }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const allChecked =
    Object.values(checkedItems).length === checklistItems.length && Object.values(checkedItems).every(Boolean)

  const handleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <h4 className="font-bold text-white">Execution Checklist</h4>
        <p className="text-xs text-zinc-400">Ensure all conditions are met before entry.</p>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-3 p-2 rounded-md bg-zinc-800/50"
            >
              <Checkbox
                id={item}
                checked={checkedItems[item]}
                onCheckedChange={() => handleCheck(item)}
                className="border-zinc-600 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
              />
              <label htmlFor={item} className="text-sm font-medium text-zinc-300 leading-none cursor-pointer">
                {item}
              </label>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-zinc-700">
        <Button
          onClick={onPlaceTrade}
          disabled={!allChecked}
          className="w-full bg-luxury-gold text-slate-grey font-bold hover:bg-luxury-gold/90 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all"
        >
          {allChecked ? "Place Trade & Activate Co-Pilot" : "Complete Checklist to Proceed"}
        </Button>
      </div>
    </div>
  )
}
