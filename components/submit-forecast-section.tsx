"use client"

import { Button } from "@/components/ui/button"
import { Upload, Zap } from "lucide-react"

export function SubmitForecastSection({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="mt-16 mb-8">
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-slate-grey p-12 text-center">
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-luxury-gold/80 to-metallic-bronze/80 shadow-2xl shadow-luxury-gold/20">
              <Zap className="w-6 h-6 text-matte-black" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Ready to Test Your Edge?</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
            Submit your analysis for an institutional-grade review by the ArchioAI Engine. Refine your strategy, improve
            your accuracy, and join the elite.
          </p>
          <Button
            size="lg"
            className="bg-luxury-gold text-matte-black hover:bg-amber-300 font-bold shadow-lg shadow-luxury-gold/25 text-lg px-8 py-6 transition-transform hover:scale-105"
            onClick={onOpenModal}
          >
            <Upload className="w-5 h-5 mr-3" />
            Submit Your Forecast
          </Button>
        </div>
      </div>
    </div>
  )
}
