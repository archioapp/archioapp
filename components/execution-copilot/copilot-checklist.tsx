"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { X, FileText, BrainCircuit } from "lucide-react"
import type { TradeState } from "./types"
import { technicalConfluences, tradeTypes, type Confluence } from "@/lib/confluences"
import { cn } from "@/lib/utils"

type CopilotChecklistProps = {
  tradeState: TradeState
  onCancel: () => void
  onSubmit: () => void
}

const StatBox = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex-1 rounded-lg bg-zinc-900/50 p-3 text-center">
    <p className="text-xs text-zinc-400">{label}</p>
    <p className={cn("text-lg font-bold", color)}>{value}</p>
  </div>
)

const TabButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: { label: string; icon: React.ElementType; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
      isActive ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800",
    )}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
)

const TypeCard = ({ item, isSelected, onSelect }: { item: Confluence; isSelected: boolean; onSelect: () => void }) => {
  const Icon = item.icon
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg cursor-pointer border transition-all",
        isSelected ? "bg-zinc-700/50 border-blue-500" : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600",
      )}
    >
      <Icon className={cn("w-6 h-6", isSelected ? "text-blue-400" : "text-zinc-400")} />
      <span className="text-sm font-semibold">{item.name}</span>
    </div>
  )
}

const ConfluenceCheckItem = ({
  item,
  isSelected,
  onSelect,
}: { item: Confluence; isSelected: boolean; onSelect: () => void }) => {
  const Icon = item.icon
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg cursor-pointer border transition-all",
        isSelected ? "bg-zinc-700/50 border-zinc-600" : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600",
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        className="border-zinc-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <Icon className="w-5 h-5 text-zinc-400" />
      <span className="text-sm font-medium text-zinc-200">{item.name}</span>
    </div>
  )
}

const cognitiveBiases = [
  { id: "fomo", label: "FOMO" },
  { id: "recency", label: "Recency Bias" },
  { id: "confirmation", label: "Confirmation Bias" },
  { id: "overconfidence", label: "Overconfidence" },
  { id: "revenge", label: "Revenge Trading" },
  { id: "herd", label: "Herd Mentality" },
]

export function CopilotChecklist({ tradeState, onCancel, onSubmit }: CopilotChecklistProps) {
  const [activeTab, setActiveTab] = useState<"technical" | "mental">("technical")
  const [selectedTradeType, setSelectedTradeType] = useState<string | null>(null)
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([])
  const [mentalState, setMentalState] = useState<Record<string, any>>({
    focus: [8],
    discipline: [8],
    biases: [],
  })

  const handleConfluenceSelect = (id: string) => {
    setSelectedConfluences((prev) => (prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]))
  }

  const handleMentalStateChange = (key: string, value: any) => {
    setMentalState((prev) => ({ ...prev, [key]: value }))
  }

  const handleBiasToggle = (biasId: string) => {
    const currentBiases = mentalState.biases || []
    const newBiases = currentBiases.includes(biasId)
      ? currentBiases.filter((b: string) => b !== biasId)
      : [...currentBiases, biasId]
    handleMentalStateChange("biases", newBiases)
  }

  return (
    <div className="flex h-full flex-col bg-[#1c1c1e] text-white p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BrainCircuit className="text-blue-400" />
            AI Pre-Flight Checklist
          </h3>
          <p className="text-sm text-zinc-400">Submit your trade plan for AI validation and co-pilot activation.</p>
        </div>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white hover:bg-zinc-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pr-2">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-zinc-200">Chart Snapshot & Parameters</h4>
          <div className="flex-1 bg-zinc-900/50 rounded-lg p-4 flex items-center justify-center border border-zinc-700">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Chart Snapshot"
              width={400}
              height={300}
              className="rounded-md opacity-50"
            />
          </div>
          {tradeState && (
            <div className="flex gap-3">
              <StatBox label="Entry" value={tradeState.entry?.toFixed(5) || "N/A"} color="text-blue-400" />
              <StatBox label="Stop Loss" value={tradeState.stopLoss?.toFixed(5) || "N/A"} color="text-red-400" />
              <StatBox label="Take Profit" value={tradeState.takeProfit?.toFixed(5) || "N/A"} color="text-green-400" />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900/50 p-1 rounded-lg flex gap-1 border border-zinc-700">
            <TabButton
              label="Technical Analysis"
              icon={FileText}
              isActive={activeTab === "technical"}
              onClick={() => setActiveTab("technical")}
            />
            <TabButton
              label="Mental Preparation"
              icon={BrainCircuit}
              isActive={activeTab === "mental"}
              onClick={() => setActiveTab("mental")}
            />
          </div>

          {activeTab === "technical" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-zinc-300 mb-2">Trade Type</h5>
                <div className="flex gap-3">
                  {tradeTypes.map((type) => (
                    <TypeCard
                      key={type.id}
                      item={type}
                      isSelected={selectedTradeType === type.id}
                      onSelect={() => setSelectedTradeType(type.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-zinc-300 mb-2">Confluence Checklist</h5>
                <div className="space-y-2">
                  {technicalConfluences.map((confluence) => (
                    <ConfluenceCheckItem
                      key={confluence.id}
                      item={confluence}
                      isSelected={selectedConfluences.includes(confluence.id)}
                      onSelect={() => handleConfluenceSelect(confluence.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "mental" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
              <div>
                <Label className="text-zinc-300">Focus Level: {mentalState.focus[0]}/10</Label>
                <Slider
                  value={mentalState.focus}
                  onValueChange={(value) => handleMentalStateChange("focus", value)}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Discipline Level: {mentalState.discipline[0]}/10</Label>
                <Slider
                  value={mentalState.discipline}
                  onValueChange={(value) => handleMentalStateChange("discipline", value)}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-zinc-300 mb-3 block">Cognitive Biases Check</Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {cognitiveBiases.map((bias) => (
                    <div key={bias.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={bias.id}
                        checked={mentalState.biases.includes(bias.id)}
                        onCheckedChange={() => handleBiasToggle(bias.id)}
                        className="border-zinc-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={bias.id} className="text-sm font-medium text-zinc-300">
                        {bias.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-700">
        <Button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white h-12 text-base font-semibold hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400"
          disabled={!selectedTradeType || selectedConfluences.length === 0}
        >
          Submit for AI Validation
        </Button>
      </div>
    </div>
  )
}
