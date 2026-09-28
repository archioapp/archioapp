"use client"

import type React from "react"

import { motion } from "framer-motion"
import { X } from "lucide-react"

interface FeatureDetailPanelProps {
  feature: string
  onClose: () => void
}

const panelContent: Record<string, React.ReactNode> = {
  alignment: (
    <div>
      <h3 className="text-lg font-semibold text-luxury-gold mb-2">Entry Alignment Score: 89%</h3>
      <p className="text-zinc-300">
        Strong confluence from BPR and Weekly Open. Minor caution due to unfilled 4h imbalance.
      </p>
    </div>
  ),
  environment: (
    <div>
      <h3 className="text-lg font-semibold text-luxury-gold mb-2">Market Environment: High Volatility</h3>
      <p className="text-zinc-300">Upcoming ISM PMI in 27m. Expect increased volatility. Current spread: 1.2 pips.</p>
    </div>
  ),
  cot: (
    <div>
      <h3 className="text-lg font-semibold text-luxury-gold mb-2">COT Data: Bullish</h3>
      <p className="text-zinc-300">
        Institutional Net Longs for GBP have increased by 12% week-over-week, signaling accumulation.
      </p>
    </div>
  ),
  options: (
    <div>
      <h3 className="text-lg font-semibold text-luxury-gold mb-2">Options Expiry: 1.2750</h3>
      <p className="text-zinc-300">
        Major expiry level acting as a price magnet. This is a high-probability target zone.
      </p>
    </div>
  ),
  news: (
    <div>
      <h3 className="text-lg font-semibold text-luxury-gold mb-2">Key News Flow</h3>
      <ul className="list-disc list-inside text-zinc-300 space-y-1">
        <li>BoE Member Mann (Hawkish): "Inflation remains a primary concern."</li>
        <li>Goldman Sachs: "Upgrading UK growth forecast for Q3."</li>
      </ul>
    </div>
  ),
}

export function FeatureDetailPanel({ feature, onClose }: FeatureDetailPanelProps) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="absolute bottom-[105px] left-1/2 -translate-x-1/2 w-[600px] z-40"
    >
      <div className="relative bg-slate-grey/95 backdrop-blur-lg border-2 border-zinc-700 rounded-xl p-6 shadow-2xl shadow-black/50">
        <button onClick={onClose} className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        {panelContent[feature] || <p>No data available.</p>}
      </div>
    </motion.div>
  )
}
