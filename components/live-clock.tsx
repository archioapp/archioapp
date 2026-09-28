"use client"

import { useState, useEffect } from "react"

interface TradingSession {
  name: string
  color: string
  isActive: boolean
}

function getTradingSession(hour: number, minute: number): TradingSession {
  const totalMinutes = hour * 60 + minute

  // Trading sessions in UTC
  const sessions = [
    { name: "Sydney", start: 21 * 60, end: 6 * 60, color: "bg-blue-500" },
    { name: "Tokyo", start: 23 * 60, end: 8 * 60, color: "bg-red-500" },
    { name: "London", start: 7 * 60, end: 16 * 60, color: "bg-green-500" },
    { name: "New York", start: 12 * 60, end: 21 * 60, color: "bg-yellow-500" },
  ]

  const activeSessions = sessions.filter((session) => {
    if (session.start > session.end) {
      // Session crosses midnight
      return totalMinutes >= session.start || totalMinutes < session.end
    } else {
      return totalMinutes >= session.start && totalMinutes < session.end
    }
  })

  if (activeSessions.length > 1) {
    return {
      name: `Overlap ${activeSessions.map((s) => s.name).join(" / ")}`,
      color: "bg-purple-500",
      isActive: true,
    }
  } else if (activeSessions.length === 1) {
    return {
      name: activeSessions[0].name,
      color: activeSessions[0].color,
      isActive: true,
    }
  } else {
    return {
      name: "Market Closed",
      color: "bg-gray-500",
      isActive: false,
    }
  }
}

export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const sessionInfo = getTradingSession(time.getUTCHours(), time.getUTCMinutes())

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="font-mono text-2xl font-bold text-white">
          {time.toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        <div className="text-xs text-zinc-400">UTC</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${sessionInfo.color} ${sessionInfo.isActive ? "animate-pulse" : ""}`} />
        <div className="text-sm text-zinc-300">{sessionInfo.name}</div>
      </div>
    </div>
  )
}
