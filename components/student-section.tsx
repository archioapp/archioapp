"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Upload, MessageCircle, ThumbsUp, Target, Zap } from "lucide-react"

const studentForecasts = [
  {
    id: 1,
    student: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    forecast: "GBPUSD Short from 1.3520 - BPR rejection setup with neural confirmation",
    accuracy: "87%",
    confidence: "92%",
    aiResponse:
      "Excellent zone identification! Neural analysis confirms 94% probability. Consider LTF confirmation during quantum execution window.",
    likes: 24,
    comments: 8,
    timestamp: "2 hours ago",
    verified: true,
  },
  {
    id: 2,
    student: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    forecast: "Looking for quantum reversal at 1.3304 demand zone with BXY confluence",
    accuracy: "82%",
    confidence: "89%",
    aiResponse:
      "Outstanding macro alignment! Quantum analysis shows 91% correlation with BXY support at 132.80. Perfect institutional thinking.",
    likes: 18,
    comments: 6,
    timestamp: "4 hours ago",
    verified: true,
  },
  {
    id: 3,
    student: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    forecast: "Bullish momentum to 1.3665 if we break above weekly resistance",
    accuracy: "75%",
    confidence: "85%",
    aiResponse:
      "Good structural analysis! However, neural data suggests 73% probability of rejection at BPR. Consider risk management.",
    likes: 12,
    comments: 4,
    timestamp: "6 hours ago",
    verified: true,
  },
]

export function StudentSection() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/10 border-orange-500/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Student Quantum Forecasts
            </span>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">847 Learning Today</Badge>
          </CardTitle>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
            <Upload className="w-4 h-4 mr-2" />
            Submit Your Forecast
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {studentForecasts.map((forecast) => (
            <div
              key={forecast.id}
              className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-xl p-5 space-y-4 border border-slate-600/30 hover:border-orange-500/30 transition-all"
            >
              {/* Student Info */}
              <div className="flex items-center gap-3">
                <Avatar className="ring-2 ring-orange-500/50">
                  <AvatarImage src={forecast.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                    {forecast.student
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{forecast.student}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">{forecast.timestamp}</span>
                    <span className="text-orange-400">Accuracy: {forecast.accuracy}</span>
                  </div>
                </div>
                {forecast.verified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">AI Verified</Badge>
                )}
              </div>

              {/* Forecast Content */}
              <div className="space-y-3">
                <p className="text-slate-300 leading-relaxed">{forecast.forecast}</p>
                <div className="bg-slate-700/30 rounded-lg p-3 h-24 flex items-center justify-center border border-slate-600/30">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                    <span className="text-slate-500 text-sm">Chart Analysis</span>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Neural Confidence</span>
                    <span className="text-purple-400 font-semibold">{forecast.confidence}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: forecast.confidence }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-purple-400 font-semibold">ArchioAI Neural Response</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{forecast.aiResponse}</p>
              </div>

              {/* Engagement */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700/50">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {forecast.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700/50">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {forecast.comments}
                  </Button>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Neural Approved</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
