"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const currencies = [
  { name: "USD", bias: "Neutral", icon: Minus, color: "text-slate-400" },
  { name: "EUR", bias: "Slightly Bullish", icon: TrendingUp, color: "text-green-400" },
  { name: "GBP", bias: "Neutral", icon: Minus, color: "text-slate-400" },
  { name: "JPY", bias: "Slightly Bullish", icon: TrendingUp, color: "text-green-400" },
  { name: "AUD", bias: "Slightly Bearish", icon: TrendingDown, color: "text-red-400" },
]

export function CurrencyMarketSummary() {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Currency Market Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-300 mb-4">
          FX markets are cautious today, with sentiment influenced by geopolitical tensions and upcoming economic data
          releases.
        </p>
        <div className="space-y-3">
          {currencies.map((currency) => (
            <div key={currency.name} className="flex items-center justify-between">
              <span className="font-semibold text-white">{currency.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${currency.color}`}>{currency.bias}</span>
                <currency.icon className={`w-4 h-4 ${currency.color}`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
