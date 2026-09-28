"use client"
import { useEffect, useRef, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  Settings,
  Bell,
  BookOpen,
  PlayCircle,
  ChevronRight,
  Target,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type Direction = "Long" | "Short"

type AnalysisData = {
  instrument: string
  direction: Direction
  confidence: number
  summary: string
  commentary?: string
  chartUrl?: string | null
  psychology: {
    focus: number
    discipline: number
    biases: string[]
    analysis?: string
    recommendations?: string[]
  }
  confluences: string[]
  riskAssessment: string[]
  scenarios: Array<{
    id?: string
    entry?: number
    stopLoss?: number
    takeProfit?: number
    riskReward?: number
    probability?: "High" | "Medium" | "Low"
  }>
}

export function FloatingConfluenceMenu({
  isVisible = false,
  onClose = () => {},
  analysisData,
}: {
  isVisible?: boolean
  onClose?: () => void
  analysisData?: AnalysisData
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // Fallback demo data if not provided
  const data: AnalysisData = useMemo(
    () =>
      analysisData ?? {
        instrument: "EURUSD",
        direction: "Long",
        confidence: 78,
        summary:
          "Multiple HTF confluences align with liquidity engineering into bank session open. Favor continuation after BOS with protected lows.",
        commentary:
          "I’m aligned with the larger liquidity story; would prefer a minor displacement into prior H1 FVG before entry.",
        chartUrl: "/placeholder.svg?height=300&width=600",
        psychology: {
          focus: 8,
          discipline: 9,
          biases: ["Confirmation Bias"],
          analysis: "Strong focus and adherence to plan; no major performance regressions detected.",
          recommendations: ["Keep risk at 1.25%", "Avoid overtrading during NY lunch"],
        },
        confluences: ["HTF Structure", "FVG", "Order Block", "Liquidity Sweep"],
        riskAssessment: [
          "Upcoming red-folder event in 2h could increase volatility.",
          "Wicks expanding on LTF &#45; wait for clean displacement.",
        ],
        scenarios: [
          { id: "S1", entry: 1.085, stopLoss: 1.082, takeProfit: 1.092, riskReward: 2.33, probability: "High" },
        ],
      },
    [analysisData],
  )

  // Close on ESC
  useEffect(() => {
    if (!isVisible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isVisible, onClose])

  // Close on outside click
  useEffect(() => {
    if (!isVisible) return
    const handleClick = (e: MouseEvent) => {
      if (!overlayRef.current || !panelRef.current) return
      if (panelRef.current.contains(e.target as Node)) return
      onClose?.()
    }
    const current = overlayRef.current
    current?.addEventListener("mousedown", handleClick)
    return () => current?.removeEventListener("mousedown", handleClick)
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={overlayRef}
          key="overlay"
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Centered premium glass panel */}
          <div className="absolute inset-0 grid place-items-end p-4 md:place-items-center md:p-8">
            <motion.div
              ref={panelRef}
              key="panel"
              role="dialog"
              aria-modal="true"
              className={cn(
                "group relative w-[96vw] max-w-5xl overflow-hidden rounded-3xl",
                "border border-purple-400/25 bg-gradient-to-br from-zinc-900/75 via-zinc-900/55 to-zinc-950/80",
                "shadow-[0_40px_100px_-20px_rgba(168,85,247,0.35)] backdrop-blur-2xl",
              )}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 160, damping: 18 } }}
              exit={{ opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2 } }}
            >
              {/* Purple rim and inner glow layers */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-purple-500/30" />
              <div className="pointer-events-none absolute inset-[1px] rounded-[calc(theme(borderRadius.3xl)-1px)] bg-gradient-to-br from-white/5 via-transparent to-transparent" />
              {/* Diagonal shine sweep */}
              <motion.div
                className="pointer-events-none absolute -inset-24 rotate-6 opacity-0 group-hover:opacity-100"
                initial={{ x: "-60%" }}
                animate={{ x: "120%" }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3.5, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(168,85,247,0.12) 45%, rgba(59,130,246,0.12) 55%, rgba(255,255,255,0) 100%)",
                  WebkitMaskImage:
                    "radial-gradient(60% 150% at 50% 50%, rgba(255,255,255,1), rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 70%)",
                }}
              />
              {/* Subtle particle sparkle */}
              <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(168,85,247,0.14)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to-bottom,rgba(0,0,0,0.5),black)]" />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-6 p-5 md:p-8">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <motion.div
                      className="grid size-12 place-items-center rounded-2xl border border-purple-500/30 bg-purple-500/10"
                      animate={{ rotate: [0, 8, 0, -8, 0] }}
                      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <Target className="size-6 text-purple-300" />
                    </motion.div>
                    <motion.div
                      className="absolute -inset-1 rounded-2xl"
                      animate={{
                        boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 24px rgba(168,85,247,0.25)", "0 0 0 rgba(0,0,0,0)"],
                      }}
                      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                          data.direction === "Long"
                            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                            : "border-red-400/40 bg-red-500/10 text-red-300",
                        )}
                      >
                        {data.instrument} {data.direction}
                      </span>
                      <span className="text-xs text-zinc-400">Premium Confluence Overview</span>
                    </div>
                    <div className="mt-2 text-sm text-zinc-300">{data.summary}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-zinc-400">Confidence</div>
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress
                            value={data.confidence}
                            className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500"
                          />
                        </div>
                        <span className="font-semibold text-white">{data.confidence}%</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={onClose}
                      aria-label="Close"
                    >
                      <X className="size-5 text-zinc-300" />
                    </Button>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                  {/* Left: Confluences and Risk */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                        <CheckCircle2 className="size-4" />
                        Confluences
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.confluences.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-transparent p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300">
                        <Activity className="size-4" />
                        Risk Notes
                      </div>
                      <ul className="space-y-2">
                        {data.riskAssessment.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <span className="mt-1 size-1.5 rounded-full bg-amber-300/80" />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: r,
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Middle: Chart + Commentary */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="relative overflow-hidden rounded-2xl border border-zinc-700/50">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <img
                        src={data.chartUrl || "/placeholder.svg?height=300&width=600&query=glass+chart+preview"}
                        alt="Chart preview"
                        className="h-48 w-full object-cover md:h-56"
                      />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur">
                        <Sparkles className="size-4 text-purple-300" />
                        Institutional-grade preview
                      </div>
                    </div>
                    {data.commentary && (
                      <div className="rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 text-xs italic text-zinc-300">
                        “{data.commentary}”
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      className="group rounded-xl border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                    >
                      <Settings className="mr-2 size-4 transition-transform group-hover:rotate-90" />
                      Configure
                    </Button>
                    <Button
                      variant="secondary"
                      className="group rounded-xl border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                    >
                      <BookOpen className="mr-2 size-4" />
                      Learn More
                    </Button>
                    <Button
                      variant="secondary"
                      className="group rounded-xl border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                    >
                      <Bell className="mr-2 size-4" />
                      Set Alert
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="group rounded-xl border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                    onClick={onClose}
                  >
                    Close
                    <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>

                {/* Footer micro-cta */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-zinc-400">
                    Tip: Click the confluence card to lock this panel. Press ESC or click outside to dismiss.
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white shadow-[0_8px_30px_rgba(168,85,247,0.35)] hover:brightness-110"
                  >
                    <PlayCircle className="mr-2 size-4" />
                    Run Rules Engine
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
