"use client"

import { useState } from "react"
import { PriceTicker } from "./price-ticker"
import { InstrumentSelector } from "./instrument-selector"
import { Button } from "@/components/ui/button"
import { Search, Share2, ChevronDown } from "lucide-react"
import { instrumentsByCategory, type Instrument } from "@/lib/instruments"
import { InstrumentSearchModal } from "./instrument-search-modal"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { normalizeSymbolForPolygon } from "@/lib/market/symbols"

interface SignalTerminalHeaderProps {
  activeInstrument: Instrument
  setActiveInstrument: (instrument: Instrument) => void
}

export function SignalTerminalHeader({ activeInstrument, setActiveInstrument }: SignalTerminalHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { setSelectedPair } = useAnalysis()

  const handleInstrumentSelect = (instrument: Instrument) => {
    setActiveInstrument(instrument)
    // Normalize symbol for Polygon API and update analysis store
    const polygonSymbol = normalizeSymbolForPolygon(instrument.symbol)
    setSelectedPair(polygonSymbol)
  }

  return (
    <>
      <div className="bg-[#12141C] border-b border-gray-800 px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-400"
            >
              <path
                d="M3.5 9.04199V14.958"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.04199 6.5V17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.583 3.5V20.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.125 6.5V17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.667 9.04199V14.958"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.208 11.25V12.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-white">Institutional Signal Terminal</h1>
              <p className="text-xs text-zinc-400 -mt-1">
                Live Confluence & Scenario Analysis for Institutional Grade Trading
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0D0F17] rounded-lg p-2 flex items-center gap-4 border border-gray-800">
          <PriceTicker instrument={activeInstrument} />
          <div className="h-8 w-px bg-gray-700" />
          <InstrumentSelector
            instruments={instrumentsByCategory.forex}
            onSelect={handleInstrumentSelect}
            trigger={
              <Button
                variant="ghost"
                className="text-zinc-300 hover:bg-white/10 hover:text-white rounded-full px-3 py-1 h-auto text-sm"
              >
                {" "}
                Pairs <ChevronDown className="w-4 h-4 ml-1" />{" "}
              </Button>
            }
          />
          <InstrumentSelector
            instruments={instrumentsByCategory.indices}
            onSelect={handleInstrumentSelect}
            trigger={
              <Button
                variant="ghost"
                className="text-zinc-300 hover:bg-white/10 hover:text-white rounded-full px-3 py-1 h-auto text-sm"
              >
                {" "}
                Indices <ChevronDown className="w-4 h-4 ml-1" />{" "}
              </Button>
            }
          />
          <InstrumentSelector
            instruments={instrumentsByCategory.crypto}
            onSelect={handleInstrumentSelect}
            trigger={
              <Button
                variant="ghost"
                className="text-zinc-300 hover:bg-white/10 hover:text-white rounded-full px-3 py-1 h-auto text-sm"
              >
                {" "}
                Crypto <ChevronDown className="w-4 h-4 ml-1" />{" "}
              </Button>
            }
          />
          <InstrumentSelector
            instruments={instrumentsByCategory.commodities}
            onSelect={handleInstrumentSelect}
            trigger={
              <Button
                variant="ghost"
                className="text-zinc-300 hover:bg-white/10 hover:text-white rounded-full px-3 py-1 h-auto text-sm"
              >
                {" "}
                Commodities <ChevronDown className="w-4 h-4 ml-1" />{" "}
              </Button>
            }
          />
          <div className="flex-grow" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full text-sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Layout
          </Button>
        </div>
      </div>
      <InstrumentSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(inst) => {
          handleInstrumentSelect(inst)
          setIsSearchOpen(false)
        }}
      />
    </>
  )
}
