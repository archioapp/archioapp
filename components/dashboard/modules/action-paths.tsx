"use client"

import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW, MOTION } from "@/components/mtf/mtf-theme"
import Link from "next/link"
import {
  Crosshair, Activity, TrendingUp, BarChart3, Users,
  ArrowUpRight,
} from "lucide-react"

const ACTION_ROUTES = [
  {
    href: "/copilot",
    icon: Crosshair,
    label: "Execution Copilot",
    description: "Charts, execution & journal",
    color: ACCENT.emerald.rgb,
    contextLabel: "Open Charts",
  },
  {
    href: "/",
    icon: Activity,
    label: "Signal Terminal",
    description: "Real-time market analysis",
    color: ACCENT.purple.rgb,
    contextLabel: "View Signals",
  },
  {
    href: "/forecast",
    icon: TrendingUp,
    label: "Forecast Hub",
    description: "Prediction record system",
    color: ACCENT.amber.rgb,
    contextLabel: "My Forecasts",
  },
  {
    href: "/intelligence",
    icon: BarChart3,
    label: "Macro Intelligence",
    description: "Economic event analysis",
    color: ACCENT.blue.rgb,
    contextLabel: "View Events",
  },
  {
    href: "/hub",
    icon: Users,
    label: "Student Hub",
    description: "Learning & collaboration",
    color: ACCENT.cyan.rgb,
    contextLabel: "Open Hub",
  },
]

export function ActionPathsLayer() {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <ArrowUpRight className="w-4 h-4" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }} />
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>
          Quick Actions
        </span>
        <div className="flex-1 h-px" style={{ background: `rgba(${ACCENT.slate.rgb},0.06)` }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {ACTION_ROUTES.map((route, i) => {
          const Icon = route.icon
          return (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={route.href}
                className="block p-4 rounded-2xl transition-all duration-200 group"
                style={{
                  background: SURFACE.card,
                  border: `1px solid rgba(${route.color},0.05)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${route.color},0.04)`
                  e.currentTarget.style.borderColor = `rgba(${route.color},0.12)`
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = SURFACE.card
                  e.currentTarget.style.borderColor = `rgba(${route.color},0.05)`
                  e.currentTarget.style.transform = "translateY(0px)"
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `rgba(${route.color},0.08)`,
                    border: `1px solid rgba(${route.color},0.08)`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: `rgba(${route.color},0.7)` }} />
                </div>
                <div className="text-white text-xs font-semibold mb-0.5">{route.label}</div>
                <div className="text-[10px]" style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>
                  {route.description}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
