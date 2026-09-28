"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Info, MapPin, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const riskScore = 10

export function TrumpTracker() {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (riskScore / 100) * circumference

  return (
    <Card className="bg-slate-grey border border-zinc-800 rounded-xl h-full group">
      <CardHeader>
        <CardTitle className="text-white text-lg">Trump Schedule Risk Probabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3A3A43"
                strokeWidth="8"
                fill="transparent"
                transform="rotate(-90 50 50)"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3D9970"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{riskScore}</span>
              <span className="text-xs text-zinc-400 -mt-1">SCORE</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-zinc-300 mb-3">
              No Trump events scheduled for today, suggesting minimal potential for volatility from this source. Markets
              are likely to be influenced by other factors instead.
            </p>
            <Badge className="bg-muted-emerald/10 text-muted-emerald border border-muted-emerald/20">
              LOW RISK BASED ON CURRENT SCHEDULE
            </Badge>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-4 hover:text-white transition-colors cursor-pointer">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>About this schedule</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Full Trump Tracker</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 rounded-lg px-4 py-2 text-sm font-semibold">
              Latest Published Events: May 25 2025
            </AccordionTrigger>
            <AccordionContent className="pt-4 pl-2 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1 h-12 bg-scarlet-red rounded-full mt-1" />
                <div>
                  <p className="text-sm text-zinc-400">2:30 PM</p>
                  <p className="font-semibold text-white">Out-of-Town Travel Pool Call Time</p>
                  <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>Trump National Golf Club Bedminster</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>Out-of-Town Travel Pool</span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="text-right text-[10px] text-zinc-500 mt-4">Generated May 25, 08:26 AM</div>
      </CardContent>
    </Card>
  )
}
