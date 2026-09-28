"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Trash2 } from "lucide-react"
import { useConfluenceStore, type CustomConfluence } from "@/stores/confluence-store"

const ICON_OPTIONS = [
  "TrendingUp",
  "Droplets",
  "Scaling",
  "Layers",
  "FlipHorizontal2",
  "Box",
  "ArrowLeftRight",
  "Shuffle",
  "Clock",
  "GitCommit",
  "Crosshair",
]

type ModalProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function CustomConfluenceModal({ open, onOpenChange }: ModalProps) {
  const createCustom = useConfluenceStore((s) => s.createCustomConfluence)

  const [form, setForm] = useState<Omit<CustomConfluence, "id" | "createdAt" | "updatedAt">>({
    name: "",
    icon: ICON_OPTIONS[0],
    category: "Custom",
    hoverDescription: "",
    detailedDescription: "",
    detectionRules: [],
    visualIndicators: { type: "levels", parameters: {} },
    strengthWeight: 50,
    confidenceImpact: "medium",
  })

  const [ruleInput, setRuleInput] = useState("")
  const [alerts, setAlerts] = useState<
    { condition: string; message: string; priority: "info" | "warning" | "critical" }[]
  >([])

  const addRule = () => {
    const val = ruleInput.trim()
    if (!val) return
    setForm((f) => ({ ...f, detectionRules: [...f.detectionRules, val] }))
    setRuleInput("")
  }

  const removeRule = (idx: number) => {
    setForm((f) => ({ ...f, detectionRules: f.detectionRules.filter((_, i) => i !== idx) }))
  }

  const onSave = () => {
    createCustom(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Your Custom Confluence</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Optimal Trade Entry (OTE)"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v: any) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Fundamental">Fundamental</SelectItem>
                    <SelectItem value="Sentiment">Sentiment</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quick Description (hover)</Label>
                <Input
                  value={form.hoverDescription}
                  onChange={(e) => setForm((f) => ({ ...f, hoverDescription: e.target.value }))}
                  placeholder="One-liner for tooltip"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div>
              <Label>Full Description</Label>
              <Textarea
                rows={5}
                value={form.detailedDescription}
                onChange={(e) => setForm((f) => ({ ...f, detailedDescription: e.target.value }))}
                placeholder="Explain the concept, how to use it, and caveats."
              />
            </div>
            <div>
              <Label>Detection Rules</Label>
              <div className="flex gap-2 mt-2">
                <Input value={ruleInput} onChange={(e) => setRuleInput(e.target.value)} placeholder="Add rule" />
                <Button onClick={addRule}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Rule
                </Button>
              </div>
              <ul className="mt-2 space-y-1">
                {form.detectionRules.map((r, i) => (
                  <li
                    key={i}
                    className="text-sm flex items-center justify-between bg-zinc-900/40 border border-zinc-800 rounded px-2 py-1"
                  >
                    <span>{r}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeRule(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4 mt-4">
            <div>
              <Label>Visual Type</Label>
              <Select
                value={form.visualIndicators.type}
                onValueChange={(v: any) =>
                  setForm((f) => ({ ...f, visualIndicators: { ...f.visualIndicators, type: v } }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="levels">Levels</SelectItem>
                  <SelectItem value="zones">Zones</SelectItem>
                  <SelectItem value="patterns">Patterns</SelectItem>
                  <SelectItem value="time-based">Time-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Strength (0–100)</Label>
              <Slider
                value={[form.strengthWeight]}
                onValueChange={(v) => setForm((f) => ({ ...f, strengthWeight: v[0] }))}
                min={0}
                max={100}
                step={1}
              />
              <div className="text-xs text-zinc-400 mt-1">
                Weight used in custom analytics; does not alter global confidence-by-count.
              </div>
            </div>
            <div>
              <Label>Confidence Impact</Label>
              <Select
                value={form.confidenceImpact}
                onValueChange={(v: any) => setForm((f) => ({ ...f, confidenceImpact: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-zinc-400 mt-1">
                For metadata only. Global Confidence stays strictly count-based.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-2 mt-4">
            <div className="text-sm text-zinc-400">
              Alerts can be added later; this version stores detection rules and metadata.
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-luxury-gold text-black hover:bg-amber-300" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" /> Save to My Confluences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
