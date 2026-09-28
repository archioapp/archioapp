"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useConfluenceStore } from "@/stores/confluence-store"
import { technicalConfluences } from "@/lib/confluences"

interface ConfluenceDetailsModalProps {
  confluenceId: string | null
  open: boolean
  onClose: () => void
}

export function ConfluenceDetailsModal({ confluenceId, open, onClose }: ConfluenceDetailsModalProps) {
  const c = technicalConfluences.find((x) => x.id === confluenceId)
  const status = useConfluenceStore((s) => (confluenceId ? s.confluenceStatus[confluenceId] : undefined))
  const toggleConfluence = useConfluenceStore((s) => s.toggleConfluence)
  const selected = useConfluenceStore((s) => (confluenceId ? s.selectedConfluences.includes(confluenceId) : false))

  return (
    <AnimatePresence>
      {open && c && (
        <motion.div
          key="conf-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="w-full max-w-3xl bg-slate-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold">{c.name}</h3>
                {c.summary && <p className="text-zinc-400 text-sm mt-1">{c.summary}</p>}
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-zinc-800 text-zinc-200 border-zinc-700">{c.category ?? "Confluence"}</Badge>
                  <Badge
                    onClick={() => confluenceId && toggleConfluence(confluenceId)}
                    className={
                      selected
                        ? "bg-emerald-600 hover:bg-emerald-600/90 cursor-pointer"
                        : "bg-zinc-700 hover:bg-zinc-700/90 cursor-pointer"
                    }
                  >
                    {selected ? "Selected" : "Select"}
                  </Badge>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-300 hover:text-white p-2 rounded-md hover:bg-zinc-800/60"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-zinc-800/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rules">Detection Rules</TabsTrigger>
                <TabsTrigger value="status">Current Status</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-2">What it is</h4>
                    <p className="text-sm text-zinc-300">{c.hoverDescription ?? c.summary}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-2">Visual</h4>
                    <div className="relative w-full aspect-video rounded-lg border border-zinc-800 bg-zinc-950/60" />
                    <p className="text-[12px] text-zinc-400 mt-2">Illustrative visualization placeholder.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rules" className="mt-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                  <h4 className="font-semibold mb-2">Detection Methodology</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {(c as any).methodology?.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-300">
                        {r}
                      </li>
                    )) || <li className="text-sm text-zinc-400">No rules available.</li>}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-2">Realtime</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Active</span>
                      <span className={status?.active ? "text-emerald-400 font-medium" : "text-zinc-300"}>
                        {String(status?.active ?? false)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-zinc-400">Strength</span>
                        <span className="text-white font-semibold">{status?.strength ?? 0}%</span>
                      </div>
                      <Progress value={status?.strength ?? 0} className="h-2 bg-zinc-800" />
                    </div>
                    <div className="mt-3 text-xs text-zinc-400">
                      Last updated: {status?.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="font-semibold mb-2">Detected Levels</h4>
                    {(status?.levels ?? []).length ? (
                      <ul className="text-sm text-zinc-300 space-y-1">
                        {status?.levels?.map((lvl, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span className="text-zinc-400">Level {i + 1}</span>
                            <span className="font-mono tabular-nums">{lvl.toFixed(5)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-zinc-400">No levels detected.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                  <h4 className="font-semibold mb-2">Selection</h4>
                  <p className="text-sm text-zinc-300">
                    This toggle updates the centralized confluence system and affects the entire application.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => confluenceId && toggleConfluence(confluenceId)}
                      className={
                        selected
                          ? "px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-600/90"
                          : "px-3 py-2 rounded-md bg-zinc-700 hover:bg-zinc-700/90"
                      }
                    >
                      {selected ? "Selected (Click to unselect)" : "Select"}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">
                    Confidence tiers: 1 selected = Low, 2–3 = Medium, 4+ = High. Global strength increases with more
                    selections (capped at 6 for 100%).
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
