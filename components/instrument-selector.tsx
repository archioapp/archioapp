"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ReactElement } from "react"

interface Instrument {
  symbol: string
  name: string
}

interface InstrumentSelectorProps {
  instruments: Instrument[]
  onSelect: (instrument: string) => void
  trigger: ReactElement
}

export function InstrumentSelector({ instruments, onSelect, trigger }: InstrumentSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-grey-dark border-slate-grey text-white">
        {instruments.map((instrument) => (
          <DropdownMenuItem
            key={instrument.symbol}
            onSelect={() => onSelect(instrument.symbol)}
            className="hover:bg-slate-grey focus:bg-slate-grey"
          >
            <span className="font-bold w-20">{instrument.symbol}</span>
            <span className="text-zinc-400">{instrument.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
