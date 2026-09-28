"use client"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useConfluenceStore } from "@/stores/confluence-store"
import type { Confluence } from "@/lib/confluences"
import Image from "next/image"

type IconName = keyof typeof Icons

export interface ConfluenceDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  confluence: Confluence | null
}

export function ConfluenceDetailsModal({ open, onOpenChange, confluence }: ConfluenceDetailsModalProps) {
  const selectedConfluences = useConfluenceStore((s) => s.selectedConfluences)
  const toggleConfluence = useConfluenceStore((s) => s.toggleConfluence)
  const status = useConfluenceStore((s) => (confluence ? s.confluenceStatus[confluence.id] : undefined))

  if (!confluence) return null
  const Icon =
    (confluence.icon as unknown as IconName) && (Icons as any)[(confluence.icon as any).name]
      ? (Icons as any)[(confluence.icon as any).name]
      : Icons.CircleDot

  const isSelected = selectedConfluences.includes(confluence.id)
  const liveStrength = status?.strength ?? 0
  const lastUpdated = status?.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : "—"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full bg-slate-900/95 border border-zinc-800 text-white p-0 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="p-6 pb-3 border-b border-zinc-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700">
                  <Icon className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">{confluence.name}</DialogTitle>
                  {confluence.summary && <p className="text-zinc-400 text-sm">{confluence.summary}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-zinc-800 text-zinc-200 border-zinc-700">
                  {confluence.category ?? "Confluence"}
                </Badge>
                <Badge
                  onClick={() => toggleConfluence(confluence.id)}
                  className={isSelected ? "bg-emerald-600 hover:bg-emerald-600/90" : "bg-zinc-700 hover:bg-zinc-700/90"}
                >
                  {isSelected ? "Selected" : "Select"}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-zinc-800 border border-zinc-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rules">Detection Rules</TabsTrigger>
                <TabsTrigger value="status">Current Status</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-2">What it is</h4>
                    <p className="text-sm text-zinc-300">{confluence.hoverDescription || confluence.summary}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-2">Visual</h4>
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-zinc-800">
                      <Image
                        src="/placeholder.svg?height=240&width=430"
                        alt="Confluence visual"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-[12px] text-zinc-400 mt-2">Illustrative visualization for education.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rules" className="mt-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                  <h4 className="font-semibold mb-3">Detection Methodology</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {(confluence as any).methodology?.map((rule: string, idx: number) => (
                      <li key={idx} className="text-sm text-zinc-300">
                        {rule}
                      </li>
                    )) || <li className="text-sm text-zinc-400">No rules provided for this confluence.</li>}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-3">Realtime</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Active</span>
                      <span className={status?.active ? "text-emerald-400 font-medium" : "text-zinc-300"}>
                        {String(status?.active ?? false)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-zinc-400">Strength</span>
                        <span className="text-white font-semibold">{liveStrength}%</span>
                      </div>
                      <Progress value={liveStrength} className="h-2 bg-zinc-800" />
                    </div>
                    <div className="mt-3 text-xs text-zinc-400">Last updated: {lastUpdated}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-3">Detected Levels</h4>
                    <div className="text-sm text-zinc-300">
                      {(status?.levels ?? []).length > 0 ? (
                        <ul className="space-y-1">
                          {status?.levels?.map((lvl, i) => (
                            <li key={i} className="flex items-center justify-between">
                              <span className="text-zinc-400">Level {i + 1}</span>
                              <span className="font-mono tabular-nums">{lvl.toFixed(5)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-zinc-400">No levels detected yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                  <h4 className="font-semibold mb-2">Selection</h4>
                  <p className="text-sm text-zinc-300">
                    This toggle affects the entire application via the centralized confluence system.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => toggleConfluence(confluence.id)}
                      className={
                        isSelected
                          ? "px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-600/90"
                          : "px-3 py-2 rounded-md bg-zinc-700 hover:bg-zinc-700/90"
                      }
                    >
                      {isSelected ? "Selected (Click to unselect)" : "Select"}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">
                    Confidence tiers: 1 selected = Low, 2–3 = Medium, 4+ = High. The more confluences you select, the
                    higher the global strength percentage.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
