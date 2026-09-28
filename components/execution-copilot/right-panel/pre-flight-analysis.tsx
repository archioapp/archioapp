"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, XCircle, Shield, BarChart, Brain, Bot } from "lucide-react"
import type { TradeState } from "../types"

interface PreFlightAnalysisProps {
  tradeState: TradeState
  onAbort: () => void
}

const AnalysisItem = ({
  icon: Icon,
  text,
  status,
}: { icon: React.ElementType; text: string; status: "success" | "warning" | "danger" }) => {
  const statusClasses = {
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  }
  const statusIcons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    danger: <XCircle className="w-5 h-5" />,
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-zinc-400" />
        <span className="text-sm text-white">{text}</span>
      </div>
      <div className={`flex items-center gap-2 ${statusClasses[status]}`}>{statusIcons[status]}</div>
    </motion.div>
  )
}

export function PreFlightAnalysis({ tradeState, onAbort }: PreFlightAnalysisProps) {
  const [activeTab, setActiveTab] = useState("technical")

  return (
    <div className="h-full flex flex-col text-white">
      <div className="p-4 border-b border-zinc-700">
        <h4 className="text-lg font-bold">Pre-Flight Analysis: Validated</h4>
        <p className="text-sm text-zinc-400">AI has reviewed your setup against key risk factors.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/80 m-2">
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="psychological">Psychological</TabsTrigger>
        </TabsList>

        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
          <TabsContent value="technical">
            <AnalysisItem icon={BarChart} text="Price Action Context" status="success" />
            <AnalysisItem icon={BarChart} text="Higher Timeframe Alignment" status="success" />
            <AnalysisItem icon={BarChart} text="Key Level Proximity" status="warning" />
            <AnalysisItem icon={BarChart} text="Liquidity Zone" status="success" />
          </TabsContent>
          <TabsContent value="environmental">
            <AnalysisItem icon={Shield} text="High-Impact News" status="success" />
            <AnalysisItem icon={Shield} text="Market Sentiment" status="warning" />
            <AnalysisItem icon={Shield} text="Correlated Asset Divergence" status="success" />
          </TabsContent>
          <TabsContent value="psychological">
            <AnalysisItem icon={Brain} text="Recent Performance Bias" status="success" />
            <AnalysisItem icon={Brain} text="Emotional State (Journal)" status="success" />
            <AnalysisItem icon={Brain} text="Focus Level" status="warning" />
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-4 border-t border-zinc-700 bg-slate-900/50">
        <div className="bg-slate-800/70 p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <Bot className="w-6 h-6 text-luxury-gold flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-bold text-white">AI Verdict</h5>
              <p className="text-sm text-zinc-300">
                Setup is strong with 87% alignment. Caution advised due to proximity to weekly resistance. Confirm break
                and retest before aggressive scaling.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <Button
          onClick={onAbort}
          variant="outline"
          className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Abort & Reset
        </Button>
      </div>
    </div>
  )
}
