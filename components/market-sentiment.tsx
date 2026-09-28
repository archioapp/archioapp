"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { motion } from "framer-motion"

const sentimentValue = 42
const sentimentLabel = "Neutral Outlook"

const getSentimentColor = (value: number) => {
  if (value < 25) return { main: "#FF2400", bg: "rgba(255, 36, 0, 0.1)" } // scarlet-red
  if (value < 45) return { main: "#A97142", bg: "rgba(169, 113, 66, 0.1)" } // metallic-bronze
  if (value < 55) return { main: "#D4AF37", bg: "rgba(212, 175, 55, 0.1)" } // luxury-gold
  if (value < 75) return { main: "#3D9970", bg: "rgba(61, 153, 112, 0.1)" } // muted-emerald
  return { main: "#3D9970", bg: "rgba(61, 153, 112, 0.1)" } // muted-emerald
}

export function MarketSentiment() {
  const angle = (sentimentValue / 100) * 180 - 90
  const color = getSentimentColor(sentimentValue)

  return (
    <Card className="bg-slate-grey border border-zinc-800 rounded-xl h-full group">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          MRKT AI Sentiment Index <Info className="w-4 h-4 text-zinc-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-8">
        <div className="relative w-64 h-32">
          <svg width="250" height="125" viewBox="0 0 250 125" className="absolute top-0">
            <defs>
              <linearGradient id="sentiment-gradient-pro" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF2400" />
                <stop offset="25%" stopColor="#A97142" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="75%" stopColor="#3D9970" />
                <stop offset="100%" stopColor="#3D9970" />
              </linearGradient>
            </defs>
            <path
              d="M 25 115 A 100 100 0 0 1 225 115"
              stroke="url(#sentiment-gradient-pro)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              opacity="0.3"
            />
            {[0, 25, 50, 75, 100].map((val) => {
              const tickAngle = (val / 100) * 180 - 180
              const x = 125 + 110 * Math.cos((tickAngle * Math.PI) / 180)
              const y = 115 + 110 * Math.sin((tickAngle * Math.PI) / 180)
              return (
                <text key={val} x={x} y={y} fill="#64748b" fontSize="12" textAnchor="middle">
                  {val}
                </text>
              )
            })}
          </svg>
          <motion.div
            className="absolute top-[105px] left-1/2 w-0.5 h-24 bg-white rounded-full origin-bottom"
            style={{ boxShadow: `0 0 12px ${color.main}` }}
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
          <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-3 h-3 bg-matte-black border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-center">
            <div className="text-6xl font-bold text-white">{sentimentValue}</div>
            <div
              className="mt-1 px-4 py-1 rounded-full text-md font-semibold"
              style={{ backgroundColor: color.bg, color: color.main, border: `1px solid ${color.main}33` }}
            >
              {sentimentLabel}
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-400 text-center mt-10 max-w-md">
          Today's market tone is neutral, driven by mixed signals from recent selloffs in major indices and cautious
          investor sentiment amidst rising U.S. debt concerns and upcoming economic data releases.
        </p>
      </CardContent>
    </Card>
  )
}
