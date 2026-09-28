"use client"

import { motion } from "framer-motion"

interface GaugeWidgetProps {
  title: string
  value: number
  color: string
}

export function GaugeWidget({ title, value, color }: GaugeWidgetProps) {
  const circumference = 2 * Math.PI * 40 // 2 * pi * r

  return (
    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col items-center justify-center text-center h-full">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-zinc-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <motion.circle
            className={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (value / 100) * circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-zinc-400">{title}</p>
    </div>
  )
}
