"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Brain, Zap, Target, TrendingUp } from "lucide-react"

const aiMessages = [
  {
    type: "ai",
    message:
      "I've analyzed your last 5 trades. You're entering 23% too early on average. The neural data shows waiting for execution window confirmation would improve your win rate by 34%. What's driving your early entries?",
    timestamp: "10:30 AM",
    confidence: "96%",
  },
  {
    type: "student",
    message: "I see strong rejection candles and don't want to miss the move",
    timestamp: "10:32 AM",
  },
  {
    type: "ai",
    message:
      "I understand the FOMO psychology. However, institutional algorithms process 2.4M data points per second during execution windows. Your 'rejection candle' might be liquidity hunting. Trust the process - structure + timing + confirmation = consistent profits.",
    timestamp: "10:33 AM",
    confidence: "98%",
  },
]

const emotionalMetrics = [
  {
    label: "Discipline Score",
    value: 78,
    color: "from-green-400 to-emerald-400",
    bgColor: "from-green-500/10 to-emerald-500/10",
    improvement: "+12%",
  },
  {
    label: "Patience Level",
    value: 65,
    color: "from-blue-400 to-cyan-400",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    improvement: "-8%",
  },
  {
    label: "Risk Management",
    value: 91,
    color: "from-purple-400 to-pink-400",
    bgColor: "from-purple-500/10 to-pink-500/10",
    improvement: "+23%",
  },
  {
    label: "Execution Timing",
    value: 58,
    color: "from-orange-400 to-amber-400",
    bgColor: "from-orange-500/10 to-amber-500/10",
    improvement: "-15%",
  },
]

export function AIInteractionPanel() {
  const [message, setMessage] = useState("")

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* AI Mentorship Chat */}
      <Card className="xl:col-span-2 bg-gradient-to-br from-slate-900/50 to-purple-900/10 border-purple-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Mentorship Session
            </span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
              ✨ NEURAL COACHING
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="h-80 overflow-y-auto space-y-4 p-4 bg-slate-800/20 rounded-xl border border-slate-700/50">
            {aiMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "student" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-xl ${
                    msg.type === "ai"
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                  }`}
                >
                  {msg.type === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-purple-400 font-semibold text-sm">ARCHIO AI</span>
                      {msg.confidence && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">{msg.confidence}</Badge>
                      )}
                    </div>
                  )}
                  <p className="text-slate-300 text-sm leading-relaxed">{msg.message}</p>
                  <span className="text-xs text-slate-500 mt-2 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask ARCHIO AI about your trading psychology..."
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500/50"
            />
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emotional Grading */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/10 border-indigo-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Emotional Grading
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Emotional Metrics */}
          {emotionalMetrics.map((metric) => (
            <div
              key={metric.label}
              className={`space-y-3 p-4 rounded-xl bg-gradient-to-r ${metric.bgColor} border border-slate-600/30 hover:scale-105 transition-all`}
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-lg bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value}%
                  </span>
                  <Badge
                    className={`text-xs ${
                      metric.improvement.startsWith("+")
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {metric.improvement}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${metric.color} h-3 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              
              <div className="text-xs text-slate-400">
                {metric.value >= 80
                  ? "🎯 Institutional Level"
                  : metric.value >= 60
                    ? "📈 Developing Well"
                    : "⚠️ Needs Focus"}
              </div>
            </div>
          ))}

          {/* Weekly Progress */}
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Weekly Progress</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                +18%
              </div>
              <div className="text-sm text-slate-300">Overall Improvement</div>
              <div className="text-xs text-green-400 mt-1">Keep up the excellent work!</div>
            </div>
          </div>

          {/* Daily Goals */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Today's Focus Areas
            </h4>
            <div className="space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-full justify-start p-2">
                <Zap className="w-3 h-3 mr-2" />
                ✓ Wait for execution windows
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 w-full justify-start p-2">
                <Target className="w-3 h-3 mr-2" />
                ○ Improve entry timing
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 w-full justify-start p-2">
                <Brain className="w-3 h-3 mr-2" />
                ○ Trust AI confluence
              </Badge>
            </div> {/* Closes the space-y-2 div for Today's Focus Areas */}
          </div> {/* Closes the space-y-3 div for Today's Focus Areas */}
        </CardContent> {/* Closes the CardContent for Emotional Grading */}
      </Card> {/* Closes the Card for Emotional Grading */}
    </div>
  )
}
