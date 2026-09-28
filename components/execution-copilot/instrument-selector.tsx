"use client"

import { useState, type ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import type { Instrument } from "@/lib/instruments"

interface InstrumentSelectorProps {
  instruments?: Instrument[] | null
  onSelect?: (instrument: Instrument) => void
  trigger?: ReactNode
}

export function InstrumentSelector({ instruments = [], onSelect = () => {}, trigger }: InstrumentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Guard against undefined/null and ensure we always have a list
  const list: Instrument[] = Array.isArray(instruments) ? instruments : []

  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      className="h-9 px-3 rounded-md text-zinc-200 hover:text-white hover:bg-white/10"
    >
      Select instrument
    </Button>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-56 p-2 bg-[#1A1D26] border-gray-700 text-white">
        {list.length === 0 ? (
          <div className="px-3 py-2 text-sm text-zinc-400">No instruments available.</div>
        ) : (
          <div className="grid gap-1">
            {list.map((instrument) => (
              <button
                key={instrument.id}
                onClick={() => {
                  onSelect(instrument)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md text-zinc-300 hover:bg-white/5 transition-colors"
              >
                {instrument.name}
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
