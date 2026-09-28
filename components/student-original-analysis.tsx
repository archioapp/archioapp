"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Eye,
  CheckCircle,
} from "lucide-react"
import type { StudentForecast } from "./student-forecast-system"

interface StudentOriginalAnalysisProps {
  forecast: StudentForecast & {
    originalAnalysis?: string
    higherTimeframe?: string
    executionTimeframe?: string
  }
  isEditMode?: boolean
}

export function StudentOriginalAnalysis({ forecast, isEditMode }: StudentOriginalAnalysisProps) {
  const DirectionIcon = forecast.direction === "LONG" ? TrendingUp : TrendingDown
  const directionColor = forecast.direction === "LONG" ? "text-emerald-400" : "text-red-400"

  return (
    <div className="space-y-6">
      {/* Chart Image */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30">
        <Image
          src={forecast.chartImage || "/placeholder.svg"}
          alt={`${forecast.pair} analysis chart`}
          width={800}
          height={450}
          className="w-full object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
            {forecast.pair}
          </Badge>
          <Badge className={`${
            forecast.direction === "LONG"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          }`}>
            <DirectionIcon className="w-3 h-3 mr-1" />
            {forecast.direction}
          </Badge>
        </div>
      </div>

      {/* Trade Setup Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <p className="text-xs text-zinc-500 mb-1">Entry</p>
            <p className="text-sm font-bold text-white">{forecast.entry}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Shield className="w-5 h-5 mx-auto mb-2 text-red-400" />
            <p className="text-xs text-zinc-500 mb-1">Stop Loss</p>
            <p className="text-sm font-bold text-white">{forecast.stop}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
            <p className="text-xs text-zinc-500 mb-1">Take Profit</p>
            <p className="text-sm font-bold text-white">{forecast.target}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Eye className="w-5 h-5 mx-auto mb-2 text-purple-400" />
            <p className="text-xs text-zinc-500 mb-1">R:R</p>
            <p className="text-sm font-bold text-white">{forecast.rr}</p>
          </CardContent>
        </Card>
      </div>

      {/* Confluences */}
      {forecast.confluences && forecast.confluences.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-300">Confluences Used</h4>
          <div className="flex flex-wrap gap-2">
            {forecast.confluences.map((c, i) => (
              <Badge
                key={i}
                className="bg-purple-500/10 text-purple-300 border-purple-500/20 px-3 py-1"
              >
                <CheckCircle className="w-3 h-3 mr-1.5" />
                {c.name}
                <span className="ml-1.5 text-purple-400/70">{c.score}%</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Original Analysis Text */}
      {forecast.forecast && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-semibold text-zinc-300 mb-2">Analysis</h4>
          <p className="text-sm text-zinc-400 leading-relaxed">{forecast.forecast}</p>
        </div>
      )}
    </div>
  )
}
