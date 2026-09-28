"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { motion } from "framer-motion"

const drivers = [
  {
    name: "U.S. Debt Concerns",
    value: 30,
    description:
      "Investors are increasingly worried about the U.S. debt and deficit, leading to a cautious market stance.",
  },
  {
    name: "Upcoming Economic Data",
    value: 25,
    description:
      "Anticipation of key economic releases, such as PCE inflation and GDP updates, is influencing investor sentiment.",
  },
  {
    name: "Bitcoin ETF Inflows",
    value: 25,
    description:
      "Increased investment in Bitcoin ETFs is seen as a sign of broader risk appetite and institutional adoption of digital assets.",
  },
  {
    name: "Sector Rotation",
    value: 20,
    description:
      "A defensive rotation into sectors like utilities and healthcare suggests that investors are preparing for potential market volatility.",
  },
]

export function FundamentalDrivers() {
  return (
    <Card className="bg-slate-grey border border-zinc-800 rounded-xl h-full group">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          MRKT AI Fundamental Drivers <Info className="w-4 h-4 text-zinc-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-matte-black rounded-full border-2 border-zinc-800 flex flex-col items-center justify-center">
              <span className="text-sm text-zinc-400">Risk-Off</span>
              <span className="text-xs text-zinc-500">environment</span>
            </div>
          </div>
          {drivers.map((driver, index) => {
            const angle = (index / drivers.length) * 2 * Math.PI - Math.PI / 2
            const x = Math.cos(angle) * 90 + 96
            const y = Math.sin(angle) * 90 + 96
            return (
              <motion.div
                key={driver.name}
                className="absolute w-32 text-center"
                initial={{ x: 96, y: 96, opacity: 0, scale: 0.5 }}
                animate={{ x, y, opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 120 }}
              >
                <div className="p-2 bg-slate-grey/80 backdrop-blur-sm border border-zinc-700 rounded-full shadow-lg">
                  <div className="text-xs text-zinc-300 truncate">{driver.name}</div>
                  <div className="text-lg font-bold text-white">{driver.value}%</div>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div key={driver.name} className="flex items-start gap-3">
              <div className="w-12 h-12 flex-shrink-0 bg-matte-black border border-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-luxury-gold">{driver.value}%</span>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{driver.name}</h4>
                <p className="text-xs text-zinc-400">{driver.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
