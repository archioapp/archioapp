"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useScenarioStore, type TradingScenario } from "@/lib/scenario-store"
import { technicalConfluences } from "@/lib/confluences"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, X, Trash2, Save } from "lucide-react"

interface ScenarioEditModalProps {
  isOpen: boolean
  scenario: TradingScenario | null
  onClose: () => void
  onSave: (scenario: TradingScenario) => void
  onDelete: (scenarioId: string) => void
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

export function ScenarioEditModal({ isOpen, scenario, onClose, onSave, onDelete }: ScenarioEditModalProps) {
  const { updateScenario, deleteScenario } = useScenarioStore()

  const [pair, setPair] = useState("")
  const [position, setPosition] = useState<"Buy Position" | "Sell Position">("Buy Position")
  const [probability, setProbability] = useState<"High Probability" | "Medium Probability" | "Low Probability">(
    "High Probability",
  )
  const [level, setLevel] = useState("")
  const [rr, setRr] = useState("1:0")
  const [sl, setSl] = useState("")
  const [tp, setTp] = useState("")
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with scenario data
  useEffect(() => {
    if (scenario) {
      setPair(scenario.pair)
      setPosition(scenario.position)
      setProbability(scenario.probability)
      setLevel(scenario.level)
      setRr(scenario.rr)
      setSl(scenario.sl)
      setTp(scenario.tp)
      setSelectedConfluences(scenario.confluences.map((conf) => conf.text))
      setNotes(scenario.notes || "")
    }
  }, [scenario])

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

  const handleSave = async () => {
    if (!scenario || !pair || !level || !sl || !tp || isSubmitting) return

    setIsSubmitting(true)

    try {
      const updatedScenario: TradingScenario = {
        ...scenario,
        pair,
        position,
        probability,
        level,
        rr,
        sl,
        tp,
        confluences: selectedConfluences.map((conf) => ({ text: conf })),
        notes,
        updatedAt: new Date().toISOString(),
      }

      updateScenario(scenario.id, updatedScenario)
      onSave(updatedScenario)
      onClose()

      // Show success notification
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "success",
            message: `Trading scenario for ${pair} updated successfully!`,
          },
        }),
      )
    } catch (error) {
      console.error("Error updating scenario:", error)
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "error",
            message: "Failed to update scenario. Please try again.",
          },
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!scenario || isSubmitting) return

    setIsSubmitting(true)

    try {
      deleteScenario(scenario.id)
      onDelete(scenario.id)
      onClose()

      // Show success notification
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "success",
            message: `Trading scenario deleted successfully!`,
          },
        }),
      )
    } catch (error) {
      console.error("Error deleting scenario:", error)
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "error",
            message: "Failed to delete scenario. Please try again.",
          },
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!scenario) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border border-white/10 bg-gradient-to-br from-zinc-950/95 to-zinc-900/90 text-white backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <div
                className={cn(
                  "p-2 rounded-full",
                  position === "Buy Position" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400",
                )}
              >
                {position === "Buy Position" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              Edit Trading Scenario
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Setup */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Currency Pair</Label>
              <Select value={pair} onValueChange={setPair} disabled={isSubmitting}>
                <SelectTrigger className="bg-zinc-900/50 border-zinc-700">
                  <SelectValue placeholder="Select currency pair" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {CURRENCY_PAIRS.map((currencyPair) => (
                    <SelectItem key={currencyPair} value={currencyPair}>
                      {currencyPair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={position === "Buy Position" ? "default" : "outline"}
                    onClick={() => setPosition("Buy Position")}
                    disabled={isSubmitting}
                    className={cn(
                      "justify-center",
                      position === "Buy Position"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "border-zinc-700 hover:bg-zinc-800",
                    )}
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Buy
                  </Button>
                  <Button
                    type="button"
                    variant={position === "Sell Position" ? "default" : "outline"}
                    onClick={() => setPosition("Sell Position")}
                    disabled={isSubmitting}
                    className={cn(
                      "justify-center",
                      position === "Sell Position"
                        ? "bg-red-500 hover:bg-red-600"
                        : "border-zinc-700 hover:bg-zinc-800",
                    )}
                  >
                    <TrendingDown className="mr-1 h-3 w-3" />
                    Sell
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Probability</Label>
                <Select
                  value={probability}
                  onValueChange={(value: any) => setProbability(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {PROBABILITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Entry Level</Label>
              <Input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g., 1.31650"
                disabled={isSubmitting}
                className="bg-zinc-900/50 border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>R/R Ratio</Label>
                <Input
                  value={rr}
                  readOnly
                  placeholder="Auto-calculated"
                  className="bg-zinc-900/30 border-zinc-700 text-zinc-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss</Label>
                <Input
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  placeholder="1.31627"
                  disabled={isSubmitting}
                  className="bg-zinc-900/50 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Take Profit</Label>
                <Input
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  placeholder="1.32527"
                  disabled={isSubmitting}
                  className="bg-zinc-900/50 border-zinc-700"
                />
              </div>
            </div>
          </div>

          {/* Confluences & Notes */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key Confluences</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-zinc-900/30 rounded-lg border border-zinc-700">
                <div className="flex flex-wrap gap-2">
                  {technicalConfluences.slice(0, 12).map((conf) => (
                    <button
                      key={conf.id || conf.name}
                      type="button"
                      onClick={() => toggleConfluence(conf.name)}
                      disabled={isSubmitting}
                      className={cn(
                        "px-2 py-1 rounded text-xs border transition-colors",
                        selectedConfluences.includes(conf.name)
                          ? "border-luxury-gold bg-luxury-gold/15 text-white"
                          : "border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/70",
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
                    <Badge key={conf} className="bg-luxury-gold/20 text-luxury-gold">
                      {conf}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional context, risk management notes, or execution details..."
                disabled={isSubmitting}
                className="min-h-[120px] bg-zinc-900/50 border-zinc-700 resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-zinc-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!pair || !level || !sl || !tp || isSubmitting}
              className="flex-1 bg-luxury-gold text-matte-black hover:bg-amber-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-matte-black border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
