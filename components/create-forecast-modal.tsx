"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { technicalConfluences } from "@/lib/confluences"
import {
  Sparkles,
  Upload,
  BrainCircuit,
  X,
  Gauge,
  Stars,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { EnhancedAIAnalysis } from "./enhanced-ai-analysis"
import { ScenarioSelector } from "./scenario-selector"
import { CreateScenarioModal } from "./create-scenario-modal"
import { useScenarioStore } from "@/lib/scenario-store"
import { EnhancedConfluenceSelector } from "./enhanced-confluence-selector"

interface CreateForecastModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "compose" | "analyzing" | "ai"

// Balanced representation of positive and negative biases
const psychologyBiases = [
  // Positive/Neutral biases
  "Confidence",
  "Patience",
  "Discipline",
  "Focus",
  // Negative biases
  "FOMO",
  "Overconfidence",
  "Revenge Trading",
  "Confirmation Bias",
]

// Commentary templates for different analysis types
const commentaryTemplates = [
  {
    name: "Technical Analysis",
    template:
      "Market Structure: [Bullish/Bearish/Neutral]\nKey Levels: Support at [price], Resistance at [price]\nConfluences: [List main confluences]\nEntry Trigger: [Specific entry condition]\nRisk Management: SL at [price], TP at [price]\nRisk-Reward: [ratio]",
  },
  {
    name: "Multi-Timeframe",
    template:
      "HTF Bias: [Higher timeframe direction]\nMTF Structure: [Current market structure]\nLTF Entry: [Lower timeframe setup]\nConfluence Alignment: [How timeframes align]\nExecution Plan: [Step-by-step entry process]",
  },
  {
    name: "News & Fundamentals",
    template:
      "Fundamental Bias: [Economic outlook]\nNews Catalysts: [Upcoming events]\nTechnical Confluence: [How technicals align]\nRisk Events: [Potential market movers]\nPosition Sizing: [Adjusted for volatility]",
  },
  {
    name: "Risk Management",
    template:
      "Position Size: [% of account]\nStop Loss: [Price and reasoning]\nTake Profit: [Targets and scaling]\nWorst Case Scenario: [What could go wrong]\nExit Strategy: [When to close early]",
  },
]

// Interactive Psychology Slider Component
function InteractivePsychologySlider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleMouseDown = () => {
    setIsDragging(true)
    setTempValue(value)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    onChange(tempValue)
  }

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0]
    setTempValue(val)
    if (!isDragging) {
      onChange(val)
    }
  }

  const getColorForValue = (val: number) => {
    if (val >= 8) return "text-emerald-400"
    if (val >= 6) return "text-amber-400"
    return "text-rose-400"
  }

  return (
    <div className="space-y-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/60 transition-all duration-300">
      <div className="flex items-center justify-between">
        <Label className="text-slate-300 font-medium">{label}</Label>
        <div className={cn("text-xl font-bold", getColorForValue(isDragging ? tempValue : value))}>
          {isDragging ? tempValue : value}/10
        </div>
      </div>
      <div className="relative">
        <Slider
          value={[isDragging ? tempValue : value]}
          onValueChange={handleValueChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          max={max}
          min={min}
          step={1}
          className={cn("transition-all duration-300", isDragging && "scale-105")}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Poor</span>
          <span>Average</span>
          <span>Excellent</span>
        </div>
      </div>
      {isDragging && (
        <div className="text-xs text-purple-400 animate-pulse font-medium">Release to confirm: {tempValue}/10</div>
      )}
    </div>
  )
}

// Interactive Bias Selector
function InteractiveBiasSelector({
  biases,
  selectedBiases,
  onToggle,
}: {
  biases: string[]
  selectedBiases: string[]
  onToggle: (bias: string) => void
}) {
  const [hoveredBias, setHoveredBias] = useState<string | null>(null)

  // Determine if bias is positive or negative for styling
  const isPositiveBias = (bias: string) => {
    return ["Confidence", "Patience", "Discipline", "Focus"].includes(bias)
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/60 transition-all duration-300">
      <Label className="text-slate-300 mb-4 block font-medium">Psychological State (Click to select/deselect)</Label>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {biases.map((bias) => {
          const isSelected = selectedBiases.includes(bias)
          const isHovered = hoveredBias === bias
          const isPositive = isPositiveBias(bias)

          return (
            <button
              key={bias}
              type="button"
              onClick={() => onToggle(bias)}
              onMouseEnter={() => setHoveredBias(bias)}
              onMouseLeave={() => setHoveredBias(null)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-300",
                "hover:scale-105 active:scale-95 backdrop-blur-sm",
                isSelected
                  ? isPositive
                    ? "border-emerald-500/60 bg-emerald-900/30 text-emerald-300"
                    : "border-rose-500/60 bg-rose-900/30 text-rose-300"
                  : "border-slate-600/40 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300",
                isHovered && !isSelected && "border-slate-500/60 bg-slate-700/60",
              )}
            >
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                  isSelected
                    ? isPositive
                      ? "bg-emerald-500 border-emerald-400"
                      : "bg-rose-500 border-rose-400"
                    : "border-slate-500 bg-transparent",
                )}
              >
                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={cn("font-medium", isSelected && "font-semibold")}>{bias}</span>
            </button>
          )
        })}
      </div>
      {selectedBiases.length > 0 && (
        <div className="mt-4 p-3 bg-slate-800/40 border border-slate-600/40 rounded-lg backdrop-blur-sm">
          <div className="text-xs text-slate-400 font-medium">
            Selected states: {selectedBiases.length}
            {selectedBiases.filter((bias) => !isPositiveBias(bias)).length > 2 &&
              " (High negative bias risk - consider reducing position size)"}
          </div>
        </div>
      )}
    </div>
  )
}

function HoverBoard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl",
        "transition-all duration-300 hover:border-slate-600/60 hover:bg-slate-900/70",
        className,
      )}
    >
      {children}
    </div>
  )
}

// Enhanced AI that provides comprehensive analysis using SELECTED confluences
async function analyzeWithAI(
  file: File | null,
  commentary: string,
  psychology: { focus: number; discipline: number; biases: string[] },
  selectedConfluenceIds: string[], // Use the actual selected confluences
) {
  await new Promise((r) => setTimeout(r, 2000))

  // Get the actual selected confluences by their IDs
  const selectedConfluences = technicalConfluences.filter((c) => selectedConfluenceIds.includes(c.id))

  return {
    instrument: "EUR/USD",
    direction: (Math.random() > 0.5 ? "Long" : "Short") as "Long" | "Short",
    confidence: 74 + Math.round(Math.random() * 20),
    summary:
      commentary?.trim().length > 0
        ? `Comprehensive analysis integrating your commentary: "${commentary.slice(0, 150)}${
            commentary.length > 150 ? "..." : ""
          }". The AI has identified ${selectedConfluences.length} confluence factors supporting this directional bias. Market structure analysis reveals strong institutional footprints at key levels, with momentum indicators aligning across multiple timeframes. Risk-reward dynamics favor this setup given current volatility regime and upcoming economic catalysts.`
        : `Multi-timeframe analysis reveals a high-probability setup with ${selectedConfluences.length} strong confluence factors. Price action shows clear institutional involvement with liquidity sweeps and displacement patterns. The setup aligns with broader market sentiment and fundamental drivers, creating favorable risk-reward dynamics for the anticipated move.`,
    confluences: selectedConfluences.map((c) => c.name), // Use actual selected confluence names
    selectedConfluenceIds: selectedConfluenceIds, // Pass the IDs for the analysis component
    misses: ["Multi-TF RSI Divergence", "Volume Profile Confirmation", "Intermarket Analysis"].slice(
      0,
      Math.random() > 0.5 ? 2 : 1,
    ),
    execution: {
      entry: "Pending retest of imbalance edge with LTF confirmation",
      stop: "Beyond invalidation wick with 15-pip buffer",
      takeProfit: "Next major liquidity pool / 1:3 RR minimum",
    },
    psychologyAnalysis: {
      overall: `With a focus of ${psychology.focus}/10 and discipline at ${psychology.discipline}/10, your current mental state is moderately prepared for execution. The presence of biases like '${psychology.biases.join("', '")}' suggests a need for heightened awareness to prevent emotional decision-making.`,
      recommendations: [
        "Double-check your analysis against your trading plan to counteract any active biases.",
        "If feeling hesitant, consider reducing position size to lower psychological pressure.",
        "Before entering, take three deep breaths to ensure a calm and focused mindset.",
      ],
    },
  }
}

async function enhanceCommentaryWithAI(commentary: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1500))

  if (!commentary.trim()) {
    return "Consider adding details about market structure, key levels, confluence factors, risk management, and execution plan for a comprehensive analysis."
  }

  // Simulate AI enhancement
  const enhancements = [
    "Enhanced with multi-timeframe perspective",
    "Added institutional flow context",
    "Included risk-reward optimization",
    "Refined with market structure analysis",
  ]

  return `${commentary}\n\n[AI Enhanced]: ${enhancements[Math.floor(Math.random() * enhancements.length)]} - This setup shows strong confluence alignment with proper risk management protocols in place.`
}

interface ChartUpload {
  id: string
  file: File
  previewUrl: string
  label: string
  type: "higher" | "lower" | "main"
}

export function CreateForecastModal({ open, onOpenChange }: CreateForecastModalProps) {
  const [step, setStep] = useState<Step>("compose")
  const [chartUploads, setChartUploads] = useState<ChartUpload[]>([])
  const [commentary, setCommentary] = useState("")
  const [isEnhancingCommentary, setIsEnhancingCommentary] = useState(false)
  const [selectedConfs, setSelectedConfs] = useState<string[]>(() => technicalConfluences.slice(0, 5).map((c) => c.id))
  const [focus, setFocus] = useState(8)
  const [discipline, setDiscipline] = useState(7)
  const [biases, setBiases] = useState<string[]>(["Confirmation Bias"])
  const [ai, setAi] = useState<Awaited<ReturnType<typeof analyzeWithAI>> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isDragOver, setIsDragOver] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [showCreateScenario, setShowCreateScenario] = useState(false)
  const { createScenarioFromForecast, scenarios, getScenarioById } = useScenarioStore()

  // Listen for new scenarios from terminal
  useEffect(() => {
    const handleScenarioFromTerminal = (event: CustomEvent) => {
      // Refresh available scenarios when new ones are created from terminal
      // This ensures scenarios created in terminal appear in forecast
    }

    window.addEventListener("scenario:available-for-forecast" as any, handleScenarioFromTerminal)

    return () => {
      window.removeEventListener("scenario:available-for-forecast" as any, handleScenarioFromTerminal)
    }
  }, [])

  useEffect(() => {
    return () => {
      chartUploads.forEach((chart) => URL.revokeObjectURL(chart.previewUrl))
    }
  }, [chartUploads])

  useEffect(() => {
    if (!open) {
      setShowCreateScenario(false)
    }
  }, [open])

  useEffect(() => {
    const words = commentary
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)

    if (commentary.length > 0) {
      setAutoSaveStatus("saving")
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [commentary])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024, // 10MB limit
    )

    if (files.length > 0) {
      processFiles(files)
    }
  }

  const processFiles = (files: File[]) => {
    files.forEach((file, index) => {
      const id = `chart-${Date.now()}-${index}`
      const previewUrl = URL.createObjectURL(file)

      // Smart type assignment based on current uploads
      let type: "higher" | "lower" | "main"
      let label: string

      if (chartUploads.length === 0) {
        type = "main"
        label = "Main Analysis Chart"
      } else if (!chartUploads.some((c) => c.type === "higher")) {
        type = "higher"
        label = "Higher Timeframe"
      } else {
        type = "lower"
        label = "Lower Timeframe"
      }

      setChartUploads((prev) => [...prev, { id, file, previewUrl, label, type }])
    })
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    processFiles(files)
  }

  const removeChart = (id: string) => {
    setChartUploads((prev) => {
      const chart = prev.find((c) => c.id === id)
      if (chart) URL.revokeObjectURL(chart.previewUrl)
      return prev.filter((c) => c.id !== id)
    })
  }

  const enhanceCommentary = async () => {
    setIsEnhancingCommentary(true)
    try {
      const enhanced = await enhanceCommentaryWithAI(commentary)
      setCommentary(enhanced)
    } catch (error) {
      console.error("Failed to enhance commentary:", error)
    } finally {
      setIsEnhancingCommentary(false)
    }
  }

  const applyTemplate = (template: string) => {
    if (commentary.trim().length > 0) {
      setCommentary((prev) => `${prev}\n\n${template}`)
    } else {
      setCommentary(template)
    }
    setSelectedTemplate("")
  }

  const toggleConf = (confluenceId: string) => {
    setSelectedConfs((prev) =>
      prev.includes(confluenceId) ? prev.filter((id) => id !== confluenceId) : [...prev, confluenceId],
    )
  }

  const handleParameterChange = (confluenceId: string, parameterId: string, value: number) => {
    // Handle parameter changes for confluences
    console.log(`Confluence ${confluenceId}, Parameter ${parameterId}: ${value}`)
  }

  const toggleBias = (name: string) => {
    setBiases((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(scenarioId) ? prev.filter((id) => id !== scenarioId) : [...prev, scenarioId],
    )
  }

  const analyze = useCallback(async () => {
    if (chartUploads.length === 0) return
    setStep("analyzing")
    const psychologyState = { focus, discipline, biases }
    const mainChart = chartUploads.find((c) => c.type === "main") || chartUploads[0]
    const result = await analyzeWithAI(mainChart.file, commentary, psychologyState, selectedConfs)
    setAi(result)
    setStep("ai")
  }, [chartUploads, commentary, focus, discipline, biases, selectedConfs])

  const submit = () => {
    // Create scenario from forecast if none selected
    let finalScenarios = [...selectedScenarios]

    if (selectedScenarios.length === 0 && ai) {
      const newScenario = createScenarioFromForecast({
        pair: ai.instrument,
        direction: ai.direction,
        confluences: selectedConfs,
        commentary,
        screenshotUrl: chartUploads[0]?.previewUrl,
      })
      finalScenarios = [newScenario.id]
      setSelectedScenarios(finalScenarios)
    }

    // Notify execution copilot about new scenarios
    window.dispatchEvent(
      new CustomEvent("execution:scenario-available", {
        detail: {
          scenarios: finalScenarios.map((id) => scenarios.find((s) => s.id === id)).filter(Boolean),
          source: "forecast",
        },
      }),
    )

    // Dispatch 'forecast:created' for the Student Hub to catch and process
    window.dispatchEvent(
      new CustomEvent("forecast:created", {
        detail: {
          user: { name: "Student" },
          trade: {
            pair: (ai?.instrument ?? "Unknown").toString(),
            direction: (ai?.direction ?? "Long").toString(),
            summary: commentary || ai?.summary || "New forecast",
          },
          confluences: selectedConfs, // Pass the selected confluence IDs
          confluenceNames: ai?.confluences || [], // Pass the confluence names
          screenshotUrl: chartUploads[0]?.previewUrl,
          timestamp: new Date().toISOString(),
          scenarios: finalScenarios,
          psychology: {
            focus,
            discipline,
            biases,
          },
          commentary: commentary, // Save the commentary
        },
      }),
    )

    onOpenChange(false)

    // reset after close animation
    setTimeout(() => {
      setStep("compose")
      setChartUploads([])
      setCommentary("")
      setSelectedConfs(technicalConfluences.slice(0, 5).map((c) => c.id))
      setFocus(8)
      setDiscipline(7)
      setBiases(["Confirmation Bias"])
      setAi(null)
      setSelectedScenarios([])
      setShowCreateScenario(false)
      setWordCount(0)
      setAutoSaveStatus("saved")
      setSelectedTemplate("")
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-7xl h-[92vh] border-0 bg-transparent p-0 text-white flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-purple-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.08),transparent_50%)]" />

        <div className="absolute top-12 left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute top-40 right-24 w-24 h-24 bg-indigo-500/8 rounded-full blur-xl animate-float-reverse" />
        <div className="absolute bottom-24 left-40 w-40 h-40 bg-violet-500/6 rounded-full blur-3xl animate-float-slow" />

        <div className="absolute inset-0 rounded-3xl border border-slate-700/60" />
        <div className="absolute inset-0 rounded-3xl ring-1 ring-slate-600/30" />

        <div className="relative z-10 flex flex-col h-full">
          <DialogHeader className="p-8 pb-4 flex-shrink-0 bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
            <DialogTitle className="flex items-center justify-between text-3xl">
              <span className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
                </div>
                <span className="text-slate-200 font-bold tracking-wide">Create New Forecast</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-400 font-medium">
              {step === "compose"
                ? "Upload your chart, add commentary, and confirm confluences. Then analyze with AI."
                : step === "analyzing"
                  ? "Running comprehensive multi-dimensional analysis on your chart and notes."
                  : "AI insights with detected confluences, news impact, and execution plan."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
            {step === "compose" && (
              <div className="grid gap-8 md:grid-cols-2 pb-8">
                <HoverBoard className="p-6 md:col-span-2">
                  <div className="flex items-center gap-3 pb-4">
                    <Upload className="h-6 w-6 text-purple-400" />
                    <span className="text-xl font-bold text-slate-200">Upload Charts</span>
                    <span className="text-sm text-slate-400">
                      (3 charts recommended: Higher TF, Main Analysis, Lower TF)
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Enhanced upload area with drag and drop */}
                    <div
                      className={cn(
                        "relative aspect-video w-full rounded-xl border-2 border-dashed transition-all duration-300",
                        "flex items-center justify-center cursor-pointer overflow-hidden",
                        "bg-slate-800/60 backdrop-blur-lg hover:bg-slate-800/80",
                        isDragOver
                          ? "border-purple-400/70 bg-purple-900/20"
                          : "border-slate-600/50 hover:border-slate-500/70",
                      )}
                      onClick={() => inputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={onPick}
                      />
                      <div className="text-center text-slate-300">
                        <Upload
                          className={cn(
                            "mx-auto mb-3 h-8 w-8 transition-all duration-300",
                            isDragOver ? "text-purple-400 animate-bounce scale-110" : "text-purple-400 animate-bounce",
                          )}
                        />
                        <p className="text-sm font-semibold text-slate-300 mb-1">
                          {isDragOver ? "Drop charts here" : "Add Charts"}
                        </p>
                        <p className="text-xs text-slate-500">Drag & drop or click • Max 10MB each</p>
                        {chartUploads.length > 0 && (
                          <p className="text-xs text-purple-400 mt-1">{chartUploads.length}/3 uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Enhanced chart previews with better labeling */}
                    {chartUploads.map((chart) => (
                      <div key={chart.id} className="relative group">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800/60 border border-slate-600/50">
                          <Image
                            src={chart.previewUrl || "/placeholder.svg"}
                            alt={chart.label}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                          />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/90 backdrop-blur-sm rounded-md border border-slate-700/50">
                            <span className="text-xs font-medium text-slate-300">{chart.label}</span>
                          </div>
                          <div className="absolute top-2 right-8 px-2 py-1 bg-purple-900/80 backdrop-blur-sm rounded-md">
                            <span className="text-xs font-medium text-purple-300 uppercase">{chart.type}</span>
                          </div>
                          <button
                            onClick={() => removeChart(chart.id)}
                            className="absolute top-2 right-2 w-6 h-6 bg-rose-500/80 hover:bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <p className="text-xs text-slate-300">
                              {(chart.file.size / (1024 * 1024)).toFixed(1)}MB •{" "}
                              {chart.file.type.split("/")[1].toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Placeholder slots for remaining charts */}
                    {Array.from({ length: Math.max(0, 3 - chartUploads.length - 1) }).map((_, index) => (
                      <div key={`placeholder-${index}`} className="relative">
                        <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-700/30 bg-slate-800/20 flex items-center justify-center">
                          <div className="text-center text-slate-500">
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-slate-700/30 flex items-center justify-center">
                              <span className="text-xs font-bold">{chartUploads.length + index + 1}</span>
                            </div>
                            <p className="text-xs">
                              {chartUploads.length === 0 && index === 0
                                ? "Higher TF"
                                : chartUploads.length === 1 && index === 0
                                  ? "Lower TF"
                                  : "Optional"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {chartUploads.length > 0 && (
                    <div className="mt-4 p-3 bg-slate-800/40 border border-slate-600/40 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Charts validated • Ready for analysis</span>
                        {chartUploads.length < 3 && (
                          <span className="text-amber-400">
                            • Consider adding {3 - chartUploads.length} more for complete analysis
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </HoverBoard>

                <HoverBoard className="p-6 md:col-span-2">
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                      <Stars className="h-6 w-6 text-purple-400" />
                      <span className="text-xl font-bold text-slate-200">Your Commentary</span>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{wordCount} words</span>
                        <div className="flex items-center gap-1">
                          {autoSaveStatus === "saving" && <Clock className="h-3 w-3 animate-spin" />}
                          {autoSaveStatus === "saved" && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                          <span className="text-xs">{autoSaveStatus === "saving" ? "Saving..." : "Saved"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="text-sm bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-1 text-slate-300 focus:border-slate-500/70 transition-all duration-300"
                      >
                        <option value="">Choose Template</option>
                        {commentaryTemplates.map((template) => (
                          <option key={template.name} value={template.template}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      {selectedTemplate && (
                        <Button
                          onClick={() => applyTemplate(selectedTemplate)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600/50 text-slate-400 hover:bg-slate-700/40 transition-all duration-300 rounded-lg bg-transparent"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Apply
                        </Button>
                      )}
                      <Button
                        onClick={enhanceCommentary}
                        disabled={isEnhancingCommentary}
                        variant="outline"
                        size="sm"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-300 rounded-lg bg-transparent"
                      >
                        {isEnhancingCommentary ? (
                          <>
                            <BrainCircuit className="mr-2 h-4 w-4 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Enhance with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={commentary}
                    onChange={(e) => setCommentary(e.target.value)}
                    placeholder="Explain the setup, structure context, catalysts, risk, and management plan..."
                    className="min-h-[240px] resize-none bg-slate-800/60 border-slate-600/50 focus:border-slate-500/70 backdrop-blur-lg text-slate-200 placeholder:text-slate-500 transition-all duration-300 rounded-xl text-base"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-slate-400 font-medium">
                      Tip: Mention HTF bias, levels, liquidity, and execution trigger. Use templates for structure.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Min: 50 words</span>
                      <span
                        className={cn(
                          wordCount >= 50 ? "text-emerald-400" : wordCount >= 25 ? "text-amber-400" : "text-slate-500",
                        )}
                      >
                        {wordCount >= 50 ? "✓ Good length" : wordCount >= 25 ? "Getting there" : "Too short"}
                      </span>
                    </div>
                  </div>
                  {wordCount < 50 && commentary.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-900/20 border border-amber-600/30 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-amber-300">
                        Add more details for better AI analysis ({50 - wordCount} words needed)
                      </span>
                    </div>
                  )}
                </HoverBoard>

                <HoverBoard className="p-6 md:col-span-2 border-emerald-600/30 bg-slate-900/70">
                  <EnhancedConfluenceSelector
                    selectedConfluences={selectedConfs}
                    onConfluenceToggle={toggleConf}
                    onParameterChange={handleParameterChange}
                  />
                </HoverBoard>

                <HoverBoard className="p-6 md:col-span-2 border-blue-600/30 bg-slate-900/70">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <Gauge className="h-6 w-6 text-blue-400" />
                        <span className="text-xl font-bold text-slate-200">Interactive Psychological State</span>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/60 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300 font-medium">Focus Level</Label>
                            <div
                              className={cn(
                                "text-xl font-bold",
                                focus >= 8 ? "text-emerald-400" : focus >= 6 ? "text-amber-400" : "text-rose-400",
                              )}
                            >
                              {focus}/10
                            </div>
                          </div>
                          <div className="relative">
                            <Slider
                              value={[focus]}
                              onValueChange={(value) => setFocus(value[0])}
                              max={10}
                              min={0}
                              step={1}
                              className="enhanced-slider"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                              <span>Poor</span>
                              <span>Average</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/60 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300 font-medium">Discipline Level</Label>
                            <div
                              className={cn(
                                "text-xl font-bold",
                                discipline >= 8
                                  ? "text-emerald-400"
                                  : discipline >= 6
                                    ? "text-amber-400"
                                    : "text-rose-400",
                              )}
                            >
                              {discipline}/10
                            </div>
                          </div>
                          <div className="relative">
                            <Slider
                              value={[discipline]}
                              onValueChange={(value) => setDiscipline(value[0])}
                              max={10}
                              min={0}
                              step={1}
                              className="enhanced-slider"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                              <span>Poor</span>
                              <span>Average</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <InteractiveBiasSelector
                        biases={psychologyBiases}
                        selectedBiases={biases}
                        onToggle={toggleBias}
                      />
                    </div>
                  </div>
                </HoverBoard>

                <HoverBoard className="p-6 md:col-span-2 border-amber-600/30 bg-slate-900/70">
                  <div className="scenario-container">
                    <ScenarioSelector
                      selectedScenarioIds={selectedScenarios}
                      onScenarioToggle={toggleScenario}
                      currentPair={ai?.instrument}
                      forecastData={{
                        pair: ai?.instrument,
                        direction: ai?.direction,
                        confluences: selectedConfs,
                        commentary,
                        screenshotUrl: chartUploads[0]?.previewUrl,
                      }}
                    />
                  </div>
                </HoverBoard>
              </div>
            )}

            {step === "analyzing" && (
              <div className="flex min-h-[400px] items-center justify-center p-12 text-center">
                <div className="relative z-10">
                  <BrainCircuit className="mx-auto h-16 w-16 text-purple-400 animate-spin-slow mb-6" />
                  <p className="text-2xl font-bold text-slate-200 mb-2">Analyzing your chart and commentary...</p>
                  <p className="text-lg text-slate-400">
                    Extracting confluences, news impact, sentiment analysis, and risk assessment.
                  </p>
                </div>
              </div>
            )}

            {step === "ai" && ai && (
              <div className="pb-8">
                <HoverBoard className="p-8 border-emerald-600/30 bg-slate-900/70">
                  <EnhancedAIAnalysis
                    instrument={ai.instrument}
                    direction={ai.direction}
                    confidence={ai.confidence}
                    summary={ai.summary}
                    confluences={ai.confluences}
                    selectedConfluenceIds={ai.selectedConfluenceIds}
                    chartScreenshotUrl={chartUploads[0]?.previewUrl}
                    selectedScenarios={selectedScenarios.map((id) => {
                      const scenario = getScenarioById(id)
                      return scenario
                        ? {
                            id: scenario.id,
                            entry: Number.parseFloat(scenario.level) || undefined,
                            stopLoss: Number.parseFloat(scenario.sl) || undefined,
                            takeProfit: Number.parseFloat(scenario.tp) || undefined,
                            riskReward: scenario.rr ? Number.parseFloat(scenario.rr.split(":")[1]) : undefined,
                            position: scenario.position === "Buy Position" ? "buy" : "sell",
                            commentary: scenario.notes,
                            probability: scenario.probability as "High" | "Medium" | "Low",
                            timeframe: "5-15m",
                            riskPercentage: 1.5,
                          }
                        : {}
                    })}
                    psychology={{
                      focus,
                      discipline,
                      biases,
                    }}
                    psychologyAnalysis={ai.psychologyAnalysis}
                    commentary={commentary}
                  />
                </HoverBoard>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-slate-700/50 p-8 flex-shrink-0 bg-slate-900/80 backdrop-blur-lg">
            {step === "compose" && (
              <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                <Button
                  onClick={analyze}
                  disabled={chartUploads.length === 0 || !commentary || wordCount < 25}
                  className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300 hover:scale-105 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BrainCircuit className="mr-3 h-5 w-5" /> Analyze with AI
                </Button>
                <div className="text-sm text-slate-400 font-medium">
                  {chartUploads.length === 0
                    ? "Upload charts to continue"
                    : wordCount < 25
                      ? "Add more commentary details"
                      : "Ready for comprehensive analysis"}
                </div>
              </div>
            )}

            {step === "ai" && (
              <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                <Button
                  onClick={submit}
                  className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300 hover:scale-105 rounded-xl font-semibold"
                >
                  Submit Forecast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep("compose")}
                  className="w-full h-12 border-slate-600/50 text-slate-300 hover:bg-slate-700/40 transition-all duration-300 rounded-xl font-medium"
                >
                  Back to Edit
                </Button>
              </div>
            )}

            {step === "analyzing" && (
              <div className="w-full text-center text-base text-slate-400 animate-pulse font-medium">
                Generating comprehensive AI insights…
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
      {open && (
        <CreateScenarioModal
          isOpen={showCreateScenario}
          onOpenChange={setShowCreateScenario}
          initialData={
            ai
              ? {
                  pair: ai.instrument,
                  direction: ai.direction,
                  confluences: selectedConfs,
                  commentary,
                  screenshotUrl: chartUploads[0]?.previewUrl,
                }
              : undefined
          }
        />
      )}
    </Dialog>
  )
}
