"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Brain, TrendingUp, Users, Target, Zap, Shield, BarChart3, Globe } from "lucide-react"

const metrics = [
  {
    title: "AI Forecast",
    icon: Brain,
    value: "89%",
    subtitle: "Bullish Target",
    detail: "Target: 1.3675",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Sentiment",
    icon: TrendingUp,
    value: "91%",
    subtitle: "Bullish Wave",
    detail: "+8% vs yesterday",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    title: "Community",
    icon: Globe,
    value: "2.4K",
    subtitle: "Active Traders",
    detail: "+347 online now",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Students",
    icon: Users,
    value: "847",
    subtitle: "Learning Today",
    detail: "+15% accuracy",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-amber-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    title: "Risk",
    icon: Shield,
    value: "LOW",
    subtitle: "Optimal Entry",
    detail: "AI Approved",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
  },
  {
    title: "Quantum Speed",
    icon: Zap,
    value: "2.4M/s",
    subtitle: "Processing Rate",
    detail: "Ultra-fast neural",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    title: "Algorithms",
    icon: BarChart3,
    value: "97",
    subtitle: "Active Bots",
    detail: "+243% profit",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    title: "Education",
    icon: Target,
    value: "4.2K",
    subtitle: "Students",
    detail: "+67% accuracy",
    gradient: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-500/10 to-cyan-500/10",
    borderColor: "border-teal-500/20",
  },
]

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${metric.bgGradient} border ${metric.borderColor} backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${metric.gradient} shadow-lg group-hover:scale-110 transition-transform`}
              >
                <metric.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs text-slate-400">{metric.title}</div>
            </div>

            <div className="space-y-1">
              <div className={`text-2xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                {metric.value}
              </div>
              <div className="text-sm text-slate-300 font-medium">{metric.subtitle}</div>
              <div className="text-xs text-slate-400">{metric.detail}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
