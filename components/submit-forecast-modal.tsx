"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { technicalConfluences, tradeTypes, type Confluence } from "@/lib/confluences"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrainCircuit, FileText } from "lucide-react"

const ConfluenceButton = ({
  confluence,
  isSelected,
  onSelect,
}: {
  confluence: Confluence
  isSelected: boolean
  onSelect: (id: string) => void
}) => {
  const Icon = confluence.icon
  return (
    <motion.button
      onClick={() => onSelect(confluence.id)}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? "bg-luxury-gold/20 border-luxury-gold text-white"
          : "bg-slate-grey border-zinc-800 hover:border-luxury-gold/50 text-zinc-300"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-8 h-8" />
      <span className="text-xs font-semibold">{confluence.name}</span>
    </motion.button>
  )
}

const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-luxury-gold mb-3">{title}</h3>
    <div className="space-y-4 p-4 bg-matte-black rounded-lg border border-zinc-800">{children}</div>
  </div>
)

const ChecklistItem = ({ id, label }: { id: string; label: string }) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={id}
      className="border-zinc-600 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
    />
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
    >
      {label}
    </label>
  </div>
)

export function SubmitForecastModal({
  isOpen,
  onOpenChange,
}: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([])
  const [selectedTradeType, setSelectedTradeType] = useState<string | null>(null)

  const handleConfluenceSelect = (id: string) => {
    setSelectedConfluences((prev) => (prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]))
  }

  const handleTradeTypeSelect = (id: string) => {
    setSelectedTradeType(id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] bg-slate-grey border-zinc-800 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Submit New Forecast</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Log your technical analysis and mental state for a comprehensive review by ArchioAI.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="technical" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 bg-matte-black border border-zinc-800">
            <TabsTrigger
              value="technical"
              className="gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              Technical Analysis
            </TabsTrigger>
            <TabsTrigger
              value="mental"
              className="gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
            >
              <BrainCircuit className="w-4 h-4" />
              Mental Preparation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="technical" className="flex-grow overflow-hidden">
            <ScrollArea className="h-full p-1 pr-4">
              <div className="p-4">
                <FormSection title="Trade Type">
                  <div className="grid grid-cols-2 gap-4">
                    {tradeTypes.map((confluence) => (
                      <ConfluenceButton
                        key={confluence.id}
                        confluence={confluence}
                        isSelected={selectedTradeType === confluence.id}
                        onSelect={handleTradeTypeSelect}
                      />
                    ))}
                  </div>
                </FormSection>

                <FormSection title="Confluence Checklist">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {technicalConfluences.map((confluence) => (
                      <ConfluenceButton
                        key={confluence.id}
                        confluence={confluence}
                        isSelected={selectedConfluences.includes(confluence.id)}
                        onSelect={handleConfluenceSelect}
                      />
                    ))}
                  </div>
                </FormSection>

                <FormSection title="Trade Parameters">
                  <Input placeholder="Entry Price" className="bg-zinc-800 border-zinc-700" />
                  <Input placeholder="Stop Loss" className="bg-zinc-800 border-zinc-700" />
                  <Input placeholder="Take Profit" className="bg-zinc-800 border-zinc-700" />
                  <Textarea placeholder="Trade Narrative & Reasoning..." className="bg-zinc-800 border-zinc-700" />
                </FormSection>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="mental" className="flex-grow overflow-hidden">
            <ScrollArea className="h-full p-1 pr-4">
              <div className="p-4">
                <FormSection title="Morning Thoughts">
                  <Textarea placeholder="Gratitude..." className="bg-zinc-800 border-zinc-700" />
                  <Textarea
                    placeholder="How are you feeling? Are you worried about anything? Excited?"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </FormSection>

                <FormSection title="Pre-Trade Mindset">
                  <RadioGroup>
                    <Label className="text-zinc-300">
                      Do I feel the need to be productive or stimulated today through the charts?
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                  <RadioGroup>
                    <Label className="text-zinc-300">
                      Has price presented clear potential or am I forcing points of interest to avoid FOMO?
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="clear" id="r3" />
                      <Label htmlFor="r3">Clear Potential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fomo" id="r4" />
                      <Label htmlFor="r4">Forcing/FOMO</Label>
                    </div>
                  </RadioGroup>
                </FormSection>

                <FormSection title="Current Emotional State">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fearful" id="e1" />
                      <Label htmlFor="e1">Fearful - Not wanting to miss the move</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excited" id="e2" />
                      <Label htmlFor="e2">Excited - wanting to act</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="calm" id="e3" />
                      <Label htmlFor="e3">Calmly monitoring price</Label>
                    </div>
                  </RadioGroup>
                </FormSection>

                <FormSection title="Goal Alignment">
                  <ChecklistItem
                    id="read-goals"
                    label="Have I read through my monthly goal and reminded myself of the low importance of today's events and the high importance of today's execution?"
                  />
                </FormSection>

                <FormSection title="Action Plan / How can I improve my mental game for tomorrow?">
                  <Textarea
                    placeholder="I am most at risk of getting hijacked when..."
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Textarea placeholder="I am at risk because I..." className="bg-zinc-800 border-zinc-700" />
                  <Textarea
                    placeholder="To reduce the risk of this happening I..."
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Textarea placeholder="My plan might fail because..." className="bg-zinc-800 border-zinc-700" />
                  <Textarea placeholder="To help my plan succeed I will..." className="bg-zinc-800 border-zinc-700" />
                </FormSection>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4 p-4 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button className="bg-luxury-gold hover:bg-amber-300 text-matte-black font-bold">Submit for AI Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
