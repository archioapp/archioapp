"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useScenarioStore } from "@/lib/scenario-store"
import { technicalConfluences } from "@/lib/confluences"
import { cn } from "@/lib/utils"
import { Plus, TrendingUp, TrendingDown, X, Target } from "lucide-react"
import { activityScenarioSaved } from "@/lib/copilot/activityApi"

interface CreateScenarioModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    pair?: string
    direction?: string
    confluences?: string[]
    commentary?: string
    screenshotUrl?: string
  }
}

const CURRENCY_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
  "AUD/JPY",
  "CHF/JPY",
  "CAD/JPY",
  "NZD/JPY",
]

const PROBABILITY_LEVELS = ["High Probability", "Medium Probability", "Low Probability"]

export function CreateScenarioModal({ isOpen, onOpenChange, initialData }: CreateScenarioModalProps) {
  const { addScenario } = useScenarioStore()

  const [pair, setPair] = useState(initialData?.pair || "")
  const [position, setPosition] = useState<"Buy Position" | "Sell Position">(
    initialData?.direction === "Long" ? "Buy Position" : "Sell Position",
  )
  const [probability, setProbability] = useState<"High Probability" | "Medium Probability" | "Low Probability">(
    "High Probability",
  )
  const [level, setLevel] = useState("")
  const [rr, setRr] = useState("1:0")
  const [sl, setSl] = useState("")
  const [tp, setTp] = useState("")
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>(initialData?.confluences || [])
  const [notes, setNotes] = useState(initialData?.commentary || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate R/R ratio automatically
  useEffect(() => {
    const calculateRR = () => {
      const entryPrice = Number.parseFloat(level)
      const stopLoss = Number.parseFloat(sl)
      const takeProfit = Number.parseFloat(tp)

      if (!entryPrice || !stopLoss || !takeProfit) {
        setRr("1:0")
        return
      }

      let risk: number
      let reward: number

      if (position === "Buy Position") {
        risk = Math.abs(entryPrice - stopLoss)
        reward = Math.abs(takeProfit - entryPrice)
      } else {
        risk = Math.abs(stopLoss - entryPrice)
        reward = Math.abs(entryPrice - takeProfit)
      }

      if (risk === 0) {
        setRr("1:0")
        return
      }

      const ratio = reward / risk
      setRr(`1:${ratio.toFixed(2)}`)
    }

    calculateRR()
  }, [level, sl, tp, position])

  const toggleConfluence = (confluence: string) => {
    setSelectedConfluences((prev) =>
      prev.includes(confluence) ? prev.filter((c) => c !== confluence) : [...prev, confluence],
    )
  }

  const resetForm = () => {
    setPair("")
    setPosition("Buy Position")
    setProbability("High Probability")
    setLevel("")
    setRr("1:0")
    setSl("")
    setTp("")
    setSelectedConfluences([])
    setNotes("")
    setIsSubmitting(false)
  }

  const handleSubmit = async () => {
    if (!pair || !level || !sl || !tp || isSubmitting) return

    setIsSubmitting(true)

    try {
      const scenario = addScenario({
        pair,
        position,
        probability,
        level,
        rr,
        sl,
        tp,
        confluences: selectedConfluences.map((conf) => ({ text: conf })),
        aiConfidence: 0, // Will be calculated by AI
        relevantPairs: [pair],
        source: initialData ? "forecast" : "terminal",
        chartData: initialData
          ? {
              screenshotUrl: initialData.screenshotUrl,
              commentary: initialData.commentary,
            }
          : undefined,
      })

      activityScenarioSaved({
        instrument: pair,
        orderType: "market", // Default to market for now, could be enhanced based on form data
        entry: Number.parseFloat(level),
        sl: Number.parseFloat(sl),
        tp: Number.parseFloat(tp),
        rr: Number.parseFloat(rr.split(":")[1]) || 0,
      })

      // Reset form
      resetForm()
      onOpenChange(false)

      // Notify about successful creation
      window.dispatchEvent(
        new CustomEvent("scenario:created-success", {
          detail: { scenario, source: initialData ? "forecast" : "terminal" },
        }),
      )

      // Show success notification
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "success",
            message: `Trading scenario for ${pair} created successfully!`,
          },
        }),
      )
    } catch (error) {
      console.error("Error creating scenario:", error)
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "error",
            message: "Failed to create scenario. Please try again.",
          },
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl premium-glass-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              <span className="text-white font-semibold">Create New Trading Scenario</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="premium-glass-icon-button"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Setup */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-purple-200">Currency Pair</Label>
              <Select value={pair} onValueChange={setPair} disabled={isSubmitting}>
                <SelectTrigger className="premium-glass-input">
                  <SelectValue placeholder="Select currency pair" />
                </SelectTrigger>
                <SelectContent className="premium-glass-dropdown">
                  {CURRENCY_PAIRS.map((currencyPair) => (
                    <SelectItem key={currencyPair} value={currencyPair} className="dropdown-item">
                      {currencyPair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-200">Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setPosition("Buy Position")}
                    disabled={isSubmitting}
                    className={cn(
                      "premium-glass-button justify-center relative overflow-hidden transition-all duration-300 ease-out transform",
                      position === "Buy Position"
                        ? "bg-emerald-500/30 border-emerald-400/60 text-emerald-200 shadow-lg shadow-emerald-500/25 scale-105 ring-2 ring-emerald-400/30"
                        : "text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-400/30 hover:text-emerald-300 hover:scale-102",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-400/0 before:via-emerald-400/20 before:to-emerald-400/0 before:translate-x-[-100%] before:transition-transform before:duration-500",
                      position === "Buy Position" && "before:translate-x-[100%]",
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        "mr-1 h-3 w-3 transition-all duration-300",
                        position === "Buy Position" ? "scale-110 drop-shadow-sm" : "",
                      )}
                    />
                    Buy
                    {position === "Buy Position" && (
                      <div className="absolute inset-0 bg-emerald-400/10 animate-pulse rounded-lg" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setPosition("Sell Position")}
                    disabled={isSubmitting}
                    className={cn(
                      "premium-glass-button justify-center relative overflow-hidden transition-all duration-300 ease-out transform",
                      position === "Sell Position"
                        ? "bg-red-500/30 border-red-400/60 text-red-200 shadow-lg shadow-red-500/25 scale-105 ring-2 ring-red-400/30"
                        : "text-zinc-300 hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-300 hover:scale-102",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/20 before:to-red-400/0 before:translate-x-[-100%] before:transition-transform before:duration-500",
                      position === "Sell Position" && "before:translate-x-[100%]",
                    )}
                  >
                    <TrendingDown
                      className={cn(
                        "mr-1 h-3 w-3 transition-all duration-300",
                        position === "Sell Position" ? "scale-110 drop-shadow-sm" : "",
                      )}
                    />
                    Sell
                    {position === "Sell Position" && (
                      <div className="absolute inset-0 bg-red-400/10 animate-pulse rounded-lg" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Probability</Label>
                <Select
                  value={probability}
                  onValueChange={(value: any) => setProbability(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="premium-glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="premium-glass-dropdown">
                    {PROBABILITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level} className="dropdown-item">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-200">Entry Level</Label>
              <Input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g., 1.31650"
                disabled={isSubmitting}
                className="premium-glass-input"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-200">R/R Ratio</Label>
                <Input
                  value={rr}
                  readOnly
                  placeholder="Auto-calculated"
                  className="premium-glass-input opacity-60 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-purple-200">Stop Loss</Label>
                <Input
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  placeholder="1.31627"
                  disabled={isSubmitting}
                  className="premium-glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-purple-200">Take Profit</Label>
                <Input
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  placeholder="1.32527"
                  disabled={isSubmitting}
                  className="premium-glass-input"
                />
              </div>
            </div>
          </div>

          {/* Confluences & Notes */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-purple-200">Key Confluences</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 p-3 premium-glass-container rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {technicalConfluences.slice(0, 12).map((conf) => (
                    <button
                      key={conf.id || conf.name}
                      type="button"
                      onClick={() => toggleConfluence(conf.name)}
                      disabled={isSubmitting}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs border transition-all duration-200",
                        selectedConfluences.includes(conf.name)
                          ? "border-purple-400/60 bg-purple-500/20 text-purple-200 shadow-purple-500/20"
                          : "border-zinc-600/50 bg-zinc-800/30 text-zinc-300 hover:bg-purple-500/10 hover:border-purple-500/40",
                        isSubmitting && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {conf.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedConfluences.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedConfluences.map((conf) => (
                    <Badge key={conf} className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                      {conf}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-purple-200">Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional context, risk management notes, or execution details..."
                disabled={isSubmitting}
                className="min-h-[120px] premium-glass-input resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 premium-glass-button bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!pair || !level || !sl || !tp || isSubmitting}
              className="flex-1 premium-glass-action-button bg-purple-500/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Scenario
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
