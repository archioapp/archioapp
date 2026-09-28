"use client"

import { Progress } from "@/components/ui/progress"

export function ConfluenceStrengthMeter({ value }: { value: number }) {
  const color = value >= 80 ? "rgb(34 197 94)" : value >= 60 ? "rgb(234 179 8)" : "rgb(239 68 68)"
  return (
    <Progress
      value={value}
      className="h-1.5"
      style={{
        background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, rgb(63 63 70) ${value}%)`,
      }}
    />
  )
}
