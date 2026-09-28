"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Globe, TrendingDown, Clock, Target, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ForecastEngineSection() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/10 border-purple-500/20 backdrop-blur-xl h-full overflow-y-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ARCHIO AI FORECAST ENGINE
          </span>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
            ✨ NEURAL ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Bias */}
        <div className="bg-gradient-to-r from-red-500/10 via-red-600/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <TrendingDown className="w-6 h-6 text-red-400 animate-pulse" />
              <span className="text-red-400 font-bold text-lg">BEARISH INSTITUTIONAL BIAS</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">HIGH CONFIDENCE</Badge>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Awaiting reversal confirmation only if Scenario 3 validates during execution window with institutional
              flow alignment.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 text-sm">Processing: 2.4M data points/second</span>
            </div>
          </div>
        </div>

        {/* Macroeconomic Outlook */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />🌍 Macroeconomic Outlook
          </h4>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 font-semibold text-lg">🇺🇸 USD Strength Analysis</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">BULLISH</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">• CPI & PPI remain elevated → Fed hawkish stance maintained</p>
              <p className="text-slate-300">• Rate cut expectations pushed to Q3 2024</p>
              <p className="text-slate-300">• DXY holding critical support at 104.80 with institutional backing</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">Confidence: 94% • Trend: Bullish</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-red-400 font-semibold text-lg">🇬🇧 GBP Weakness Signals</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">BEARISH</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">• BXY exited BPR range at 135.57 → Macro weakness confirmed</p>
              <p className="text-slate-300">• BoE dovish pivot amid recession fears</p>
              <p className="text-slate-300">• UK inflation cooling faster than expected</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs">Confidence: 91% • Trend: Bearish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Summary */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg">💭 Sentiment Summary</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">68%</div>
                <div className="text-xs text-slate-400">COT Bearish</div>
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">RISK-OFF</div>
                <div className="text-xs text-slate-400">Market Mood</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Structure */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg">🧱 Technical Structure</h4>

          <div className="space-y-3">
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-400 font-medium">BPR Resistance Zone</span>
                <Badge className="bg-red-500/20 text-red-400">ACTIVE</Badge>
              </div>
              <div className="text-xs text-slate-300">1.35091 - 1.35320 • Premium rejection expected</div>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-400 font-medium">Weekly Open</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">TESTED</Badge>
              </div>
              <div className="text-xs text-slate-300">1.34451 • Key pivot for continuation</div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-medium">Demand Zone</span>
                <Badge className="bg-green-500/20 text-green-400">PENDING</Badge>
              </div>
              <div className="text-xs text-slate-300">1.33042 • Reversal potential if reached</div>
            </div>
          </div>
        </div>

        {/* Execution Windows */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />🕒 Execution Windows
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
              <div className="text-cyan-400 font-bold text-lg">2:00-5:00 AM</div>
              <div className="text-xs text-slate-400 mb-2">EST • London Open</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full w-4/5 animate-pulse" />
              </div>
              <div className="text-xs text-cyan-400 mt-1">Optimal Window</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
              <div className="text-purple-400 font-bold text-lg">8:00-12:00 PM</div>
              <div className="text-xs text-slate-400 mb-2">EST • NY Session</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-3/5" />
              </div>
              <div className="text-xs text-purple-400 mt-1">Secondary Window</div>
            </div>
          </div>
        </div>

        {/* Directional Bias */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />🔁 Directional Bias
          </h4>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                BEARISH CONTINUATION
              </div>
              <div className="text-sm text-slate-400">Primary Scenario</div>
            </div>

            <p className="text-slate-300 text-sm text-center leading-relaxed">
              Wait for LTF confirmation at BPR rejection (1.3509-1.3532) during London session execution window. Target
              1.3304 demand zone with 1:3 R/R minimum.
            </p>
          </div>
        </div>

        {/* Mindset & Reminders */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg">🧘 Mindset & Reminders</h4>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="text-center">
              <div className="text-yellow-400 font-semibold mb-2">"Patience is the ultimate edge"</div>
              <div className="text-xs text-slate-400 italic">- Institutional Trading Wisdom</div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            <div className="text-sm text-slate-300">
              <p>• Don't chase price - let structure validate</p>
              <p>• Execution windows exist for a reason</p>
              <p>• Risk management over profit maximization</p>
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-400 font-semibold">ARCHIO AI Confidence</span>
            <span className="text-purple-400 font-bold text-2xl">96%</span>
          </div>
          <Progress value={96} className="h-3 mb-2" />
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-slate-300">Neural processing: 2.4M calculations/second</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
