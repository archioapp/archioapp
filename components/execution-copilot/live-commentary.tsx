"use client"

import { motion } from "framer-motion"
import { Bot, Shield } from "lucide-react"
import type { TradeState } from "../types"

const commentaryEvents = [
  { time: "14:30:05", message: "Trade executed successfully. Monitoring price action.", type: "info" },
  { time: "14:32:18", message: "Price approaching first minor resistance. Holding steady.", type: "info" },
  { time: "14:35:45", message: "Volatility increasing. Stop loss remains secure.", type: "warning" },
  { time: "14:38:02", message: "Price has broken minor resistance. Target 1 is now probable.", type: "success" },
]

export function LiveCommentary({ tradeState }: { tradeState: TradeState }) {
  const isProfitable = tradeState.pnl >= 0

  return (
    <div className="h-full flex flex-col text-white bg-slate-900">
      <div className="p-4 border-b border-zinc-700">
        <h4 className="text-lg font-bold">Live Trade Monitoring</h4>
        <p className="text-sm text-zinc-400">
          {tradeState.pair} {tradeState.bias.charAt(0).toUpperCase() + tradeState.bias.slice(1)}
        </p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 bg-slate-900/50">
        <div className="p-3 bg-slate-800/70 rounded-lg text-center">
          <p className="text-xs text-zinc-400">Current P&L</p>
          <p className={`text-lg font-bold ${isProfitable ? "text-green-400" : "text-red-400"}`}>
            {isProfitable ? "+" : ""}${tradeState.pnl.toFixed(2)}
          </p>
        </div>
        <div className="p-3 bg-slate-800/70 rounded-lg text-center">
          <p className="text-xs text-zinc-400">Risk/Reward</p>
          <p className="text-lg font-bold text-white">1:{tradeState.riskReward}</p>
        </div>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <h5 className="text-sm font-bold text-zinc-300 mb-2">AI Commentary Log</h5>
        {commentaryEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-full flex items-center justify-center">
              <Bot
                className={`w-5 h-5 ${
                  event.type === "warning"
                    ? "text-yellow-400"
                    : event.type === "success"
                      ? "text-green-400"
                      : "text-zinc-400"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-zinc-200">{event.message}</p>
              <p className="text-xs text-zinc-500">{event.time} UTC</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-zinc-700">
        <button className="w-full p-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold transition-colors flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          Close Position Manually
        </button>
      </div>
    </div>
  )
}
