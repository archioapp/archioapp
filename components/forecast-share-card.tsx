"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Upload, Camera, ThumbsUp, MessageSquare, Eye, UserPlus, CheckCircle2 } from 'lucide-react'
import { technicalConfluences } from "@/lib/confluences"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"

interface ForecastShareCardProps {
  onReleaseForecast?: (data: any) => void
}

export function ForecastShareCard({ onReleaseForecast }: ForecastShareCardProps) {
  const [forecast, setForecast] = useState({
    pair: "EURUSD",
    direction: "LONG",
    timeframe: "Daily",
    entry: "1.3304",
    stop: "1.3260",
    target: "1.3420",
    rr: "1:2.6",
    description: "Reversal buy opportunity at 1.3304 demand zone with BXY support confluence and oversold conditions.",
    userName: "Emma Rodriguez",
    userLevel: "Intermediate",
    status: "AGGRESSIVE",
    accuracy: 82,
    winRate: 71,
    trades: 89,
  })

  const [selectedConfluences, setSelectedConfluences] = useState([
    { name: "Demand Zone", score: 78 },
    { name: "BXY Support", score: 71 },
    { name: "RSI Oversold", score: 85 },
  ])

  const [psychology, setPsychology] = useState({
    focus: 85,
    discipline: 92,
    biases: "Confirmation bias present",
    notes: "Feeling confident about this setup",
  })

  const [chartImage, setChartImage] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setChartImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const downloadCard = async () => {
    if (!cardRef.current) return
    
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    })
    
    const link = document.createElement("a")
    link.download = `forecast-${forecast.pair}-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const releaseAndNotify = () => {
    const data = {
      user: { name: forecast.userName, level: forecast.userLevel },
      trade: {
        pair: forecast.pair,
        direction: forecast.direction,
        entry: forecast.entry,
        summary: forecast.description,
      },
      confluences: selectedConfluences.map(c => c.name),
      screenshotUrl: chartImage,
      timestamp: new Date().toISOString(),
    }
    
    onReleaseForecast?.(data)
    window.dispatchEvent(new CustomEvent("forecast:submitted", { detail: data }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Configuration Panel */}
      <Card className="bg-slate-grey/80 border border-zinc-700 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Forecast Designer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-zinc-300">User Name</Label>
              <Input
                value={forecast.userName}
                onChange={(e) => setForecast(f => ({ ...f, userName: e.target.value }))}
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-sm text-zinc-300">Level</Label>
              <Select value={forecast.userLevel} onValueChange={(val) => setForecast(f => ({ ...f, userLevel: val }))}>
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-zinc-300">Pair</Label>
              <Input
                value={forecast.pair}
                onChange={(e) => setForecast(f => ({ ...f, pair: e.target.value }))}
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-sm text-zinc-300">Direction</Label>
              <Select value={forecast.direction} onValueChange={(val) => setForecast(f => ({ ...f, direction: val }))}>
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LONG">LONG</SelectItem>
                  <SelectItem value="SHORT">SHORT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-zinc-300">Timeframe</Label>
              <Select value={forecast.timeframe} onValueChange={(val) => setForecast(f => ({ ...f, timeframe: val }))}>
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1H">1H</SelectItem>
                  <SelectItem value="4H">4H</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm text-zinc-300">Description</Label>
            <Textarea
              value={forecast.description}
              onChange={(e) => setForecast(f => ({ ...f, description: e.target.value }))}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label className="text-sm text-zinc-300">Chart Screenshot</Label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700 text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Chart
              </Button>
              {chartImage && <span className="text-xs text-green-400">✓ Image uploaded</span>}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadCard} className="bg-luxury-gold hover:bg-amber-300 text-matte-black font-bold">
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            <Button onClick={releaseAndNotify} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
              <Camera className="w-4 h-4 mr-2" />
              Release Forecast (Notify)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <div ref={cardRef} className="bg-slate-grey/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/30 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-zinc-700">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-zinc-700 text-white">
                {forecast.userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-white text-lg">{forecast.userName}</p>
              <p className="text-sm text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full inline-block">
                {forecast.userLevel}
              </p>
            </div>
          </div>
          <Badge className={cn(
            "text-xs font-bold px-3 py-1",
            forecast.status === "AGGRESSIVE" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"
          )}>
            {forecast.status}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{forecast.accuracy}%</p>
            <p className="text-xs text-zinc-400">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{forecast.winRate}%</p>
            <p className="text-xs text-zinc-400">Win Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{forecast.trades}</p>
            <p className="text-xs text-zinc-400">Trades</p>
          </div>
        </div>

        {/* Trade Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-zinc-700 text-white text-xs font-bold px-2 py-1">
              {forecast.pair}
            </Badge>
            <Badge className={cn(
              "text-xs font-bold px-2 py-1",
              forecast.direction === "LONG" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
            )}>
              {forecast.direction}
            </Badge>
            <Badge className="bg-zinc-700 text-white text-xs font-bold px-2 py-1">
              {forecast.timeframe}
            </Badge>
          </div>
          <p className="text-sm text-zinc-300 mb-4">{forecast.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-900/50 p-3 rounded-lg">
            <div>
              <span className="text-zinc-400">Entry: </span>
              <span className="text-white font-mono">{forecast.entry}</span>
            </div>
            <div>
              <span className="text-zinc-400">R/R: </span>
              <span className="text-green-400 font-mono">{forecast.rr}</span>
            </div>
            <div>
              <span className="text-zinc-400">Stop: </span>
              <span className="text-red-400 font-mono">{forecast.stop}</span>
            </div>
            <div>
              <span className="text-zinc-400">Target: </span>
              <span className="text-green-400 font-mono">{forecast.target}</span>
            </div>
          </div>
        </div>

        {/* Chart Image */}
        {chartImage && (
          <div className="mb-4">
            <img src={chartImage || "/placeholder.svg"} alt="Chart" className="w-full h-32 object-cover rounded-lg" />
          </div>
        )}

        {/* Confluences */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">Confluences:</h3>
          <div className="space-y-2">
            {selectedConfluences.map((confluence, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{confluence.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-green-500" 
                      style={{ width: `${confluence.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 w-8">{confluence.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-400/30 shadow-lg shadow-purple-500/10 mb-4">
          <h3 className="text-sm font-bold text-purple-300 mb-2">
            ARCHIO AI Analysis (78/100)
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-2">
            <span className="font-semibold text-zinc-300">Technical:</span> Demand zone untested but macro headwinds present
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            <span className="font-semibold text-zinc-300">Execution Plan:</span> Wait for bullish divergence confirmation...
          </p>
          <div>
            <span className="text-xs font-semibold text-zinc-300">AI Confidence</span>
            <div className="w-full h-2 bg-zinc-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: "78%" }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" /> 18
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> 6
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> 98
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 text-xs">
              <UserPlus className="w-3 h-3 mr-1" /> Follow
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> AI VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
