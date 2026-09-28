"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingDown, Clock, Zap, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ForecastBrain() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/10 border-purple-500/20 backdrop-blur-xl h-full overflow-y-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ArchioAI Quantum Brain
          </span>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">NEURAL ACTIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Bias */}
        <div className="bg-gradient-to-r from-red-500/10 via-red-600/10 to-pink-500/10 border border-red-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <span className="text-red-400 font-bold text-lg">BEARISH QUANTUM BIAS</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">HIGH CONFIDENCE</Badge>
            </div>
            <p className="text-slate-300">Awaiting reversal only if Scenario 3 confirms with neural validation</p>
            <div className="mt-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">Quantum processing: 2.4M calculations/sec</span>
            </div>
          </div>
        </div>

        {/* Macroeconomic Context */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg flex items-center gap-2">🌍 Quantum Macro Analysis</h4>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 font-semibold text-lg">🇺🇸 DXY Neural Scan</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">QUANTUM STRONG</Badge>
            </div>
            <p className="text-slate-300 text-sm mb-2">CPI & PPI hot → Rate cut delays confirmed by neural analysis</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">DXY holding 104.80+ with 94% confidence</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-red-400 font-semibold text-lg">🇬🇧 BXY Quantum Alert</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">NEURAL WEAK</Badge>
            </div>
            <p className="text-slate-300 text-sm mb-2">Exited BPR range at 135.57 → Macro weakness confirmed</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-red-400 text-sm">Liquidity magnet at 1.3500 detected</span>
            </div>
          </div>
        </div>

        {/* Execution Windows */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Quantum Execution Windows
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
              <div className="text-cyan-400 font-bold text-lg">2:00-5:00 AM</div>
              <div className="text-xs text-slate-400">EST • Institutional Flow</div>
              <div className="mt-2 w-full bg-slate-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-1 rounded-full w-3/4" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
              <div className="text-purple-400 font-bold text-lg">8:00-12:00 PM</div>
              <div className="text-xs text-slate-400">EST • Neural Optimal</div>
              <div className="mt-2 w-full bg-slate-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Breakdown */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Quantum Scenario Matrix
          </h4>

          {/* Scenario 1 */}
          <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-red-400 font-semibold">🔻 Scenario 1 - Quantum Aggressive</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">HIGH RISK</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Neural Zone:</span>
                <span className="text-white font-mono bg-slate-800/50 px-2 py-1 rounded">1.34451</span>
              </div>
              <p className="text-slate-300">Early continuation short with quantum validation</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-400 to-orange-400 h-2 rounded-full w-[65%]" />
                </div>
                <span className="text-red-400 text-xs">65% Neural Confidence</span>
              </div>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl p-4 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-400 font-semibold">✅ Scenario 2 - Quantum Institutional</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">NEURAL OPTIMAL</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Neural Zone:</span>
                <span className="text-white font-mono bg-slate-800/50 px-2 py-1 rounded">1.35091-1.35320</span>
              </div>
              <p className="text-slate-300">Premium BPR rejection with quantum smart money analysis</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full w-[92%]" />
                </div>
                <span className="text-green-400 text-xs">92% Neural Confidence</span>
              </div>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 font-semibold">🟢 Scenario 3 - Quantum Reversal</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">COUNTERTREND</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Neural Zone:</span>
                <span className="text-white font-mono bg-slate-800/50 px-2 py-1 rounded">1.33042</span>
              </div>
              <p className="text-slate-300">Macro demand with quantum reversal confirmation required</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full w-[78%]" />
                </div>
                <span className="text-blue-400 text-xs">78% Neural Confidence</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-400 font-semibold">Quantum Neural Confidence</span>
            <span className="text-purple-400 font-bold text-2xl">96%</span>
          </div>
          <Progress value={96} className="h-3 mb-2" />
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-slate-300">Processing 2.4M data points per second</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
