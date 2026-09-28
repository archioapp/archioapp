"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { ForecastCard, type StudentForecast } from "@/components/student-forecast-system"
import { mockForecasts } from "@/lib/community-data"

export function ForecastRoom({
  forecasts: newForecastsFromHub = [] as StudentForecast[],
}: { forecasts?: StudentForecast[] }) {
  const allForecasts = useMemo(() => {
    const combined = [...newForecastsFromHub, ...mockForecasts]
    const unique = Array.from(new Map(combined.map((f) => [f.id, f])).values())
    return unique.sort((a, b) => Number(b.id) - Number(a.id))
  }, [newForecastsFromHub])

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="p-4 space-y-6"
      >
        {allForecasts.length === 0 ? (
          <div className="text-center text-sm text-zinc-400 px-3 py-10">
            No recent forecasts yet. Submit a forecast to see it appear here instantly.
          </div>
        ) : (
          allForecasts.map((forecast) => (
            <motion.div
              key={forecast.id}
              layout
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <ForecastCard forecast={forecast} onClick={() => {}} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
